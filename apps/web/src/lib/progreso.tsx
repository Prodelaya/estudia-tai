import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { api, alPerderSesion, NoAutenticado, type CuerpoIntento, type ItemRespuesta, type UsuarioActual } from './api';
import { almacenNavegador, ColaEscrituras, nuevoId, type EstadoGuardado, type Escritura, type Resultado } from './cola';
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
  /** idLote hace deterministas los cliente_id (lote:pregunta): reenviar el mismo lote no duplica nada. */
  registrar: (lista: Respuesta[], origen: string, modo: Modo, idLote?: string) => void;
  calificar: (id: string, tema: number | null, nota: Nota) => void;
  /** 'ok' si quedó guardado; 'pendiente' si sigue en la cola y se reintentará; 'rechazado' si el servidor no lo admitió. */
  guardarIntento: (b: CuerpoIntento) => Promise<Resultado>;
  marcar: (q: { id: string; tema: number | null }, nota: string) => Promise<void>;
  resolverMarca: (id: string, resuelta: boolean) => Promise<void>;
  borrarMarca: (id: string) => Promise<void>;
  salir: () => Promise<void>;
}

const VACIO: Progreso = { preguntas: [], srs: [], marcas: [], intentos: [] };
const Contexto = createContext<Ctx | null>(null);

function ejecutar(e: Escritura, usuario: string) {
  if (e.tipo === 'respuestas') return api.respuestas(e.items, usuario);
  if (e.tipo === 'srs') return api.srs(e.e, usuario);
  return api.intento(e.cuerpo, usuario);
}

/** Lo que sigue en la cola aún no está en el servidor: se aplica encima de lo que devuelve. */
function superponer(p: Progreso, c: ColaEscrituras): Progreso {
  const respuestas = c.pendientesDe('respuestas').flatMap(e => e.items);
  const tarjetas = c.pendientesDe('srs').map(e => e.e);
  if (!respuestas.length && !tarjetas.length) return p;
  const mapa = new Map(p.preguntas.map(x => [x.pregunta_id, x]));
  for (const i of respuestas) mapa.set(i.pregunta_id, sumarRespuesta(mapa.get(i.pregunta_id), i));
  const srs = new Map(p.srs.map(x => [x.tarjeta_id, x]));
  for (const t of tarjetas) srs.set(t.tarjeta_id, t);
  return { ...p, preguntas: [...mapa.values()], srs: [...srs.values()] };
}

const conLimite = <T,>(p: Promise<T>, ms: number) => Promise.race([p, new Promise<void>(r => setTimeout(r, ms))]);

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
    const c = cola.current!;
    try {
      for (let vuelta = 0; ; vuelta++) {
        const envios = c.envios, ocupada = c.ocupada;
        const [nuevo, cuenta] = await Promise.all([api.progreso(), api.yo()]);
        if (actual !== revision.current) return;
        // Si se envió algo mientras se leía, la foto puede incluirlo o no: se espera a la cola y se vuelve a leer.
        if (vuelta < 2 && (ocupada || c.ocupada || c.envios !== envios)) { await conLimite(c.vaciar(), 5000); continue; }
        setProgreso(superponer(nuevo, c));
        setUsuario(cuenta);
        setEstado('listo');
        return;
      }
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

  const reintentar = useCallback(() => {
    cola.current!.vaciar().then(ok => { if (ok) recargar().catch(console.error); });
  }, [recargar]);

  // Al entrar, se recupera lo que quedó sin enviar en este navegador: se pinta encima y se envía.
  const nombre = usuario?.nombre ?? null;
  useEffect(() => {
    const c = cola.current!;
    c.usar(nombre);
    if (nombre && c.pendientes) {
      setProgreso(p => superponer(p, c));
      reintentar();
    }
  }, [nombre, reintentar]);

  // Reintento automático mientras haya algo pendiente: al recuperar la conexión y cada 30 s.
  useEffect(() => {
    if (guardado.estado !== 'error' || !guardado.pendientes) return;
    window.addEventListener('online', reintentar);
    const t = setInterval(reintentar, 30_000);
    return () => { window.removeEventListener('online', reintentar); clearInterval(t); };
  }, [guardado.estado, guardado.pendientes, reintentar]);

  const porPregunta = useMemo(() => new Map(progreso.preguntas.map(p => [p.pregunta_id, p])), [progreso.preguntas]);
  const porTarjeta = useMemo(() => new Map(progreso.srs.map(s => [s.tarjeta_id, s])), [progreso.srs]);

  // Las escrituras son optimistas: se pinta al momento y se manda al servidor en segundo plano.
  const registrar = useCallback((lista: Respuesta[], origen: string, modo: Modo, idLote?: string) => {
    const ahora = Date.now();
    const items: ItemRespuesta[] = lista.filter(r => r.q.ok).map(({ q, elegida }) => ({
      pregunta_id: q.id, tema: q.tema, elegida, acierto: elegida === q.ok, origen, modo, ts: ahora,
      cliente_id: idLote ? `${idLote}:${q.id}` : nuevoId(),
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
    const r = await cola.current!.encolar({ tipo: 'intento', cuerpo });
    // Un fallo al refrescar no cambia que el intento esté guardado.
    if (r === 'ok') await recargar().catch(console.error);
    return r;
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
