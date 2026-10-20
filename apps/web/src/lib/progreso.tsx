import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { api, NoAutenticado } from './api';
import { programar, type Nota } from './srs';
import type { EstadoSrs, Letra, NotaParte, Progreso, PreguntaVista } from './tipos';

interface Ctx {
  estado: 'cargando' | 'login' | 'listo';
  progreso: Progreso;
  porPregunta: Map<string, Progreso['preguntas'][number]>;
  porTarjeta: Map<string, EstadoSrs>;
  recargar: () => Promise<void>;
  responder: (q: PreguntaVista, elegida: Letra, origen?: string) => void;
  calificar: (id: string, tema: number | null, nota: Nota) => void;
  guardarIntento: (b: { examen_id: string; partes: string[]; notas: Record<string, NotaParte>; respuestas: Record<string, Letra>; segundos: number | null }) => Promise<void>;
  marcar: (q: { id: string; tema: number | null }, nota: string) => Promise<void>;
  resolverMarca: (id: string, resuelta: boolean) => Promise<void>;
  borrarMarca: (id: string) => Promise<void>;
  salir: () => Promise<void>;
}

const VACIO: Progreso = { preguntas: [], srs: [], marcas: [], intentos: [] };
const Contexto = createContext<Ctx | null>(null);

export function ProveedorProgreso({ children }: { children: ReactNode }) {
  const [estado, setEstado] = useState<Ctx['estado']>('cargando');
  const [progreso, setProgreso] = useState<Progreso>(VACIO);

  const recargar = useCallback(async () => {
    try {
      setProgreso(await api.progreso());
      setEstado('listo');
    } catch (e) {
      if (e instanceof NoAutenticado) setEstado('login');
      else throw e;
    }
  }, []);
  useEffect(() => { recargar(); }, [recargar]);

  const porPregunta = useMemo(() => new Map(progreso.preguntas.map(p => [p.pregunta_id, p])), [progreso.preguntas]);
  const porTarjeta = useMemo(() => new Map(progreso.srs.map(s => [s.tarjeta_id, s])), [progreso.srs]);

  // Las escrituras son optimistas: se pinta al momento y se manda al servidor en segundo plano.
  const responder = useCallback((q: PreguntaVista, elegida: Letra, origen = 'test') => {
    if (!q.ok) return;
    const acierto = elegida === q.ok;
    setProgreso(p => {
      const prev = p.preguntas.find(x => x.pregunta_id === q.id);
      const nueva = { pregunta_id: q.id, tema: q.tema, vistas: (prev?.vistas ?? 0) + 1, aciertos: (prev?.aciertos ?? 0) + (acierto ? 1 : 0), ultima: (acierto ? 1 : 0) as 0 | 1, ts: Date.now() };
      return { ...p, preguntas: [...p.preguntas.filter(x => x.pregunta_id !== q.id), nueva] };
    });
    api.respuestas([{ pregunta_id: q.id, tema: q.tema, elegida, acierto, origen }]).catch(console.error);
  }, []);

  const calificar = useCallback((id: string, tema: number | null, nota: Nota) => {
    const e = programar(porTarjeta.get(id), nota, id, tema);
    setProgreso(p => ({ ...p, srs: [...p.srs.filter(s => s.tarjeta_id !== id), e] }));
    api.srs(e).catch(console.error);
  }, [porTarjeta]);

  const guardarIntento: Ctx['guardarIntento'] = useCallback(async b => {
    await api.intento(b);
    await recargar();
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
    await api.logout();
    setProgreso(VACIO);
    setEstado('login');
  }, []);

  const valor = { estado, progreso, porPregunta, porTarjeta, recargar, responder, calificar, guardarIntento, marcar, resolverMarca, borrarMarca, salir };
  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

export function useProgreso() {
  const c = useContext(Contexto);
  if (!c) throw new Error('useProgreso fuera de ProveedorProgreso');
  return c;
}
