import { useState } from 'react';
import { SesionPractica, SesionTarjetas } from '../components/Sesiones';
import { datos, desdeTema, idProgreso } from '../lib/datos';
import { useProgreso } from '../lib/progreso';
import { hoy } from '../lib/srs';
import { barajar, useCarga } from '../lib/useCarga';
import type { PreguntaVista, Tarjeta } from '../lib/tipos';

/** Lo que toca hoy: tarjetas vencidas de todos los temas y preguntas cuya última respuesta fue un fallo. */
export function Repaso() {
  const { porPregunta, porTarjeta } = useProgreso();
  const [sesion, setSesion] = useState<'preguntas' | 'tarjetas' | null>(null);
  const contenidos = useCarga(async () => {
    const temas = await datos.temas();
    return (await Promise.all(temas.map(t => datos.contenido(t.n)))).filter(c => c !== null);
  }, []);
  // La cola se congela al empezar la sesión para que no cambie mientras respondes.
  const [cola, setCola] = useState<{ preguntas: PreguntaVista[]; tarjetas: (Tarjeta & { tema: number })[] } | null>(null);
  if (!contenidos) return <p className="note">Preparando el repaso…</p>;

  const falladas: PreguntaVista[] = [];
  const vencidas: (Tarjeta & { tema: number })[] = [];
  for (const c of contenidos) {
    for (const p of c.preguntas) if (porPregunta.get(idProgreso(p))?.ultima === 0) falladas.push(desdeTema(p, c.tema));
    for (const t of c.tarjetas) { const s = porTarjeta.get(t.id); if (s && s.vence <= hoy()) vencidas.push({ ...t, tema: c.tema }); }
  }

  const empezar = (tipo: 'preguntas' | 'tarjetas') => {
    setCola({ preguntas: barajar(falladas), tarjetas: barajar(vencidas) });
    setSesion(tipo);
  };
  const fin = () => { setSesion(null); setCola(null); };

  return (
    <div className="stack">
      <div>
        <h1>Repaso de hoy</h1>
        <p className="lead">Las tarjetas que te tocan según la repetición espaciada y las preguntas que fallaste la última vez que las viste.</p>
      </div>
      {sesion === 'preguntas' && cola && <SesionPractica preguntas={cola.preguntas} origen="repaso" onFin={fin} />}
      {sesion === 'tarjetas' && cola && <SesionTarjetas tarjetas={cola.tarjetas} temaDe={t => (t as Tarjeta & { tema: number }).tema} onFin={fin} />}
      {!sesion && (falladas.length || vencidas.length ? (
        <div className="row">
          <button className="btn" disabled={!falladas.length} onClick={() => empezar('preguntas')}>{falladas.length} preguntas falladas</button>
          <button className="btn ghost" disabled={!vencidas.length} onClick={() => empezar('tarjetas')}>{vencidas.length} tarjetas</button>
        </div>
      ) : <p className="empty">No tienes nada pendiente hoy. Haz un test o estudia tarjetas de un tema y lo que falles aparecerá aquí.</p>)}
    </div>
  );
}
