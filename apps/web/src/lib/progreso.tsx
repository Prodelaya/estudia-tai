import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { api, alPerderSesion, NoAutenticado, type CuerpoIntento, type ItemRespuesta, type UsuarioActual } from './api';
import { almacenNavegador, ColaEscrituras, type EstadoGuardado, type Escritura } from './cola';
import { programar, type Nota } from './srs';
import type { EstadoSrs, Letra, Modo, Progreso, PreguntaVista, ResumenPregunta } from './tipos';

/** Una respuesta para registrar: elegida null es un blanco de simulacro. */
export interface Respuesta { q: PreguntaVista; elegida: Letra | null }

interface Ctx {
  estado: 'cargando' | 'login' | 'listo';
  usuario: UsuarioActual | null;
  progreso: Progreso;
  porPregunta: Map<string, Progreso['preguntas'][number]>;
  porTarjeta: Map<string, EstadoSrs>;
  guardado: EstadoGuardado;
  reintentar: () => void;
  recargar: () => Promise<void>;
  responder: (q: PreguntaVista, elegida: Letra, origen?: string, modo?: Modo) => void;
  registrar: (lista: Respuesta[], origen: string, modo: Modo) => void;
  calificar: (id: string, tema: number | null, nota: Nota) => void;
  /** true si quedó guardado en el servidor; si no, sigue en la cola y se reintenta. */
  guardarIntento: (b: CuerpoIntento) => Promise<boolean>;
  marcar: (q: { id: string; tema: number | null }, nota: string) => Promise<void>;
  resolverMarca: (id: string, resuelta: boolean) => Promise<void>;
  borrarMarca: (id: string) => Promise<void>;
  salir: () => Promise<void>;
}

const VACIO: Progreso = { preguntas: [], srs: [], marcas: [], intentos: [] };
const Contexto = createContext<Ctx | null>(null);

function ejecutar(e: Escritura) {
  if (e.tipo === 'respuestas') return api.respuestas(e.items);
  if (e.tipo === 'srs') return api.srs(e.e);
  return api.intento(e.cuerpo);
}

/** Aplica una respuesta al resumen local, igual que lo calcularía el servidor. */
export function sumarRespuesta(prev: ResumenPregunta | undefined, i: ItemRespuesta): ResumenPregunta {
  const acierto = i.acierto ? 1 : 0;
  const sigueRacha = acierto && prev?.ultima === 1;
  return {
    pregunta_id: i.pregunta_id, tema: i.tema,
    vistas: (prev?.vistas ?? 0) + 1, aciertos: (prev?.aciertos ?? 0) + acierto,
    ultima: acierto, blanco: i.elegida ? 0 : 1,
    racha: acierto ? (sigueRacha ? (prev?.racha ?? 1) + 1 : 1) : 0,
    ts_racha: acierto ? (sigueRacha ? (prev?.ts_racha ?? prev?.ts ?? i.ts) : i.ts) : null,
    primera: prev ? (prev.primera ?? null) : acierto,
    ts: i.ts,
  };
}

export function ProveedorProgreso({ children }: { children: ReactNode }) {
  const [estado, setEstado] = useState<Ctx['estado']>('cargando');
  const [progreso, setProgreso] = useState<Progreso>(VACIO);
  const [usuario, setUsuario] = useState<UsuarioActual | null>(null);
  const [guardado, setGuardado] = useState<EstadoGuardado>({ estado: 'guardado', pendientes: 0 });
  const revision = useRef(0);
  const cola = useRef<ColaEscrituras | null>(null);
  if (!cola.current) cola.current = new ColaEscrituras(ejecutar, almacenNavegador(), setGuardado);

  const recargar = useCallback(async () => {
    const actual = ++revision.current;
    try {
      const [nuevo, cuenta] = await Promise.all([api.progreso(), api.yo()]);
      if (actual !== revision.current) return;
      // Lo que sigue en la cola aún no está en el servidor: se vuelve a aplicar encima.
      const mapa = new Map(nuevo.preguntas.map(x => [x.pregunta_id, x]));
      for (const i of cola.current!.respuestasPendientes()) mapa.set(i.pregunta_id, sumarRespuesta(mapa.get(i.pregunta_id), i));
      setProgreso({ ...nuevo, preguntas: [...mapa.values()] });
      setUsuario(cuenta);
      setEstado('listo');
    } catch (e) {
      if (actual !== revision.current) return;
      if (e instanceof NoAutenticado) {
        setProgreso(VACIO);
        setUsuario(null);
        setEstado('login');
      }
      else throw e;
    }
  }, []);
  useEffect(() => alPerderSesion(() => {
    ++revision.current;
    setProgreso(VACIO);
    setUsuario(null);
    setEstado('login');
  }), []);
  useEffect(() => { recargar(); }, [recargar]);

  // Al entrar, se recupera lo que quedó sin enviar en este navegador; al terminar se refresca el resumen.
  const nombre = usuario?.nombre ?? null;
  useEffect(() => {
    const c = cola.current!;
    c.usar(nombre);
    if (nombre && c.pendientes) c.vaciar().then(ok => { if (ok) recargar(); });
  }, [nombre, recargar]);

  // Reintento automático mientras haya algo pendiente: al recuperar la conexión y cada 30 s.
  useEffect(() => {
    if (guardado.estado !== 'error' || !guardado.pendientes) return;
    const reintento = () => { void cola.current!.vaciar(); };
    window.addEventListener('online', reintento);
    const t = setInterval(reintento, 30_000);
    return () => { window.removeEventListener('online', reintento); clearInterval(t); };
  }, [guardado.estado, guardado.pendientes]);

  const porPregunta = useMemo(() => new Map(progreso.preguntas.map(p => [p.pregunta_id, p])), [progreso.preguntas]);
  const porTarjeta = useMemo(() => new Map(progreso.srs.map(s => [s.tarjeta_id, s])), [progreso.srs]);

  // Las escrituras son optimistas: se pinta al momento y se manda al servidor en segundo plano.
  const registrar = useCallback((lista: Respuesta[], origen: string, modo: Modo) => {
    const ahora = Date.now();
    const items: ItemRespuesta[] = lista.filter(r => r.q.ok).map(({ q, elegida }) => ({
      pregunta_id: q.id, tema: q.tema, elegida, acierto: elegida === q.ok, origen, modo, ts: ahora,
    }));
    if (!items.length) return;
    setProgreso(p => {
      const mapa = new Map(p.preguntas.map(x => [x.pregunta_id, x]));
      for (const i of items) mapa.set(i.pregunta_id, sumarRespuesta(mapa.get(i.pregunta_id), i));
      return { ...p, preguntas: [...mapa.values()] };
    });
    void cola.current!.encolar({ tipo: 'respuestas', items });
  }, []);

  const responder = useCallback((q: PreguntaVista, elegida: Letra, origen = 'test', modo: Modo = 'practica') => {
    registrar([{ q, elegida }], origen, modo);
  }, [registrar]);

  const calificar = useCallback((id: string, tema: number | null, nota: Nota) => {
    const e = programar(porTarjeta.get(id), nota, id, tema);
    setProgreso(p => ({ ...p, srs: [...p.srs.filter(s => s.tarjeta_id !== id), e] }));
    void cola.current!.encolar({ tipo: 'srs', e });
  }, [porTarjeta]);

  const guardarIntento: Ctx['guardarIntento'] = useCallback(async cuerpo => {
    const ok = await cola.current!.encolar({ tipo: 'intento', cuerpo });
    if (ok) await recargar();
    return ok;
  }, [recargar]);

  const reintentar = useCallback(() => {
    cola.current!.vaciar().then(ok => { if (ok) recargar(); });
  }, [recargar]);

  const marcar: Ctx['marcar'] = useCallback(async (q, nota) => {
    await api.marca(q.id, { tema: q.tema, nota });
    await recargar();
  }, [recargar]);

  const resolverMarca: Ctx['resolverMarca'] = useCallback(async (id, resuelta) => {
    const m = progreso.marcas.find(x => x.pregunta_id === id);
    await api.marca(id, { tema: m?.tema ?? null, nota: m?.nota ?? '', resuelta });
    await recargar();
  }, [progreso.marcas, recargar]);

  const borrarMarca: Ctx['borrarMarca'] = useCallback(async id => {
    await api.borrarMarca(id);
    await recargar();
  }, [recargar]);

  const salir = useCallback(async () => {
    ++revision.current;
    await api.logout();
    ++revision.current;
    setProgreso(VACIO);
    setUsuario(null);
    setEstado('login');
  }, []);

  const valor = { estado, usuario, progreso, porPregunta, porTarjeta, guardado, reintentar, recargar, responder, registrar, calificar, guardarIntento, marcar, resolverMarca, borrarMarca, salir };
  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

export function useProgreso() {
  const c = useContext(Contexto);
  if (!c) throw new Error('useProgreso fuera de ProveedorProgreso');
  return c;
}
