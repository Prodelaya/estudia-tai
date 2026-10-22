import { useState } from 'react';
import { SesionPractica, SesionTarjetas } from '../components/Sesiones';
import { datos, desdeExamen, desdeTema, idProgreso } from '../lib/datos';
import { useProgreso } from '../lib/progreso';
import { motivoRepaso, type MotivoRepaso } from '../lib/repaso';
import { hoy } from '../lib/srs';
import { barajar, useCarga } from '../lib/useCarga';
import type { PreguntaVista, Tarjeta } from '../lib/tipos';
import { NOMBRE_PARTE, nombreExamen } from './Examenes';

type Pendiente = PreguntaVista & { motivo: MotivoRepaso; propia: boolean };
const MOTIVO: Record<MotivoRepaso, string> = { fallada: 'fallada', blanco: 'en blanco', confirmar: 'comprobar que la recuerdas' };

/**
 * Lo que toca hoy: tarjetas vencidas y preguntas pendientes de todo lo que has respondido, tanto de tus temas
 * como de los simulacros (también las de temas que no estudias, que son las que más pesan en el test).
 */
export function Repaso() {
  const { porPregunta, porTarjeta } = useProgreso();
  const [sesion, setSesion] = useState<'preguntas' | 'tarjetas' | null>(null);
  const [incluirOtros, setIncluirOtros] = useState(true);
  const carga = useCarga(async () => {
    const [temas, indice] = await Promise.all([datos.temas(), datos.examenes()]);
    const [contenidos, examenes] = await Promise.all([
      Promise.all(temas.map(t => datos.contenido(t.n))),
      Promise.all(indice.map(e => datos.examen(e.id))),
    ]);
    return { contenidos: contenidos.filter(c => c !== null), examenes: examenes.filter(e => e !== null), temas: new Set(temas.map(t => t.n)) };
  }, []);
  // La cola se congela al empezar la sesión para que no cambie mientras respondes.
  const [cola, setCola] = useState<{ preguntas: PreguntaVista[]; tarjetas: (Tarjeta & { tema: number })[] } | null>(null);
  if (!carga) return <p className="note">Preparando el repaso…</p>;

  const ahora = Date.now();
  const pendientes: Pendiente[] = [];
  const vistas = new Set<string>();
  const vencidas: (Tarjeta & { tema: number })[] = [];
  for (const c of carga.contenidos) {
    for (const p of c.preguntas) {
      const id = idProgreso(p);
      vistas.add(id);
      const motivo = motivoRepaso(porPregunta.get(id), ahora);
      if (motivo) pendientes.push({ ...desdeTema(p, c.tema), motivo, propia: true });
    }
    for (const t of c.tarjetas) { const s = porTarjeta.get(t.id); if (s && s.vence <= hoy()) vencidas.push({ ...t, tema: c.tema }); }
  }
  // Preguntas de examen sin copia en tus temas: se repasan tal como salieron, con su nota de clave si la tienen.
  for (const ex of carga.examenes) {
    for (const [parte, datosParte] of Object.entries(ex.partes)) {
      for (const q of datosParte.preguntas) {
        if (vistas.has(q.id) || !q.ok || q.anulada) continue;
        vistas.add(q.id);
        const motivo = motivoRepaso(porPregunta.get(q.id), ahora);
        if (!motivo) continue;
        const propia = q.tema !== null && carga.temas.has(q.tema);
        pendientes.push({
          ...desdeExamen(q, ex, parte), motivo, propia,
          etiqueta: `${nombreExamen(ex.anio, ex.id)} · ${NOMBRE_PARTE[parte] ?? parte} · ${q.n}${q.tema ? ` · tema ${q.tema}` : ''}${propia ? '' : ' · fuera de tus temas'}`,
        });
      }
    }
  }

  const elegidas = pendientes.filter(p => incluirOtros || p.propia);
  const cuenta = (m: MotivoRepaso) => elegidas.filter(p => p.motivo === m).length;
  const otros = pendientes.filter(p => !p.propia).length;

  const empezar = (tipo: 'preguntas' | 'tarjetas') => {
    // Primero lo fallado o en blanco; después lo que toca confirmar.
    const urgentes = barajar(elegidas.filter(p => p.motivo !== 'confirmar'));
    const confirmar = barajar(elegidas.filter(p => p.motivo === 'confirmar'));
    setCola({ preguntas: [...urgentes, ...confirmar], tarjetas: barajar(vencidas) });
    setSesion(tipo);
  };
  const fin = () => { setSesion(null); setCola(null); };

  return (
    <div className="stack">
      <div>
        <h1>Repaso de hoy</h1>
        <p className="lead">Las tarjetas que te tocan, las preguntas que fallaste o dejaste en blanco (también en los simulacros) y las que acertaste tras fallarlas, para comprobar al día siguiente que las recuerdas. Una pregunta sale del repaso cuando la aciertas dos veces con al menos un día de diferencia.</p>
      </div>
      {sesion === 'preguntas' && cola && <SesionPractica preguntas={cola.preguntas} origen="repaso" onFin={fin} />}
      {sesion === 'tarjetas' && cola && <SesionTarjetas tarjetas={cola.tarjetas} temaDe={t => (t as Tarjeta & { tema: number }).tema} onFin={fin} />}
      {!sesion && (
        <>
          {otros > 0 && (
            <label className="chk">
              <input type="checkbox" checked={incluirOtros} onChange={e => setIncluirOtros(e.target.checked)} />
              Incluir {otros} {otros === 1 ? 'pregunta' : 'preguntas'} de temas que no estudias (salieron en tus simulacros)
            </label>
          )}
          {elegidas.length || vencidas.length ? (
            <>
              <div className="row">
                <button className="btn" disabled={!elegidas.length} onClick={() => empezar('preguntas')}>{elegidas.length} preguntas</button>
                <button className="btn ghost" disabled={!vencidas.length} onClick={() => empezar('tarjetas')}>{vencidas.length} tarjetas</button>
              </div>
              {elegidas.length > 0 && (
                <p className="meta">{(['fallada', 'blanco', 'confirmar'] as MotivoRepaso[]).filter(cuenta).map(m => `${cuenta(m)} ${MOTIVO[m]}`).join(' · ')}</p>
              )}
            </>
          ) : <p className="empty">No tienes nada pendiente hoy. Haz un test, un simulacro o estudia tarjetas y lo que falles aparecerá aquí.</p>}
        </>
      )}
    </div>
  );
}
