import { Link } from 'react-router-dom';
import { datos, idProgreso } from '../lib/datos';
import { useProgreso } from '../lib/progreso';
import { hoy } from '../lib/srs';
import { useCarga } from '../lib/useCarga';

export function Inicio() {
  const { progreso, porPregunta, porTarjeta } = useProgreso();
  const temas = useCarga(async () => {
    const ts = await datos.temas();
    return Promise.all(ts.map(async t => ({ ...t, contenido: await datos.contenido(t.n) })));
  }, []);
  if (!temas) return <p className="note">Cargando temas…</p>;

  const respondidas = progreso.preguntas.length;
  const aciertoMedio = respondidas ? Math.round((progreso.preguntas.filter(p => p.ultima).length / respondidas) * 100) : 0;
  // Acierto la primera vez que viste cada pregunta: mide lo que sabes, no lo que has memorizado al repetir.
  const conPrimera = progreso.preguntas.filter(p => p.primera === 0 || p.primera === 1);
  const aciertoPrimera = conPrimera.length ? Math.round((conPrimera.filter(p => p.primera === 1).length / conPrimera.length) * 100) : null;
  const venceHoy = progreso.srs.filter(s => s.vence <= hoy()).length;
  const ultimo = progreso.intentos.find(i => i.modo !== 'practica');

  return (
    <div className="stack">
      <div>
        <h1>Tus 18 temas</h1>
        <p className="lead">Lección, tarjetas y test de cada tema. Ordenados por su peso histórico: cuántos puntos han valido de media en los exámenes, no la nota que vas a sacar.</p>
      </div>
      <div className="stats">
        <div className="stat"><b>{respondidas}</b><span>preguntas practicadas</span></div>
        <div className="stat"><b>{aciertoMedio}%</b><span>acierto en el último intento de cada una</span></div>
        <div className="stat"><b>{aciertoPrimera === null ? '—' : `${aciertoPrimera}%`}</b><span>acierto la primera vez que las viste</span></div>
        <div className="stat"><b>{venceHoy}</b><span>tarjetas para repasar hoy</span></div>
        <div className="stat"><b>{ultimo ? ultimo.examen_id.replace('LI_', '') : '—'}</b><span>último simulacro</span></div>
      </div>
      <div className="temas">
        {[...temas].sort((a, b) => b.pts - a.pts).map(t => {
          const preg = t.contenido?.preguntas ?? [];
          const tarj = t.contenido?.tarjetas ?? [];
          const dominadas = preg.filter(p => porPregunta.get(idProgreso(p))?.ultima === 1).length;
          const nuevasTarj = tarj.filter(c => !porTarjeta.has(c.id)).length;
          return (
            <Link key={t.n} className="tema-card" to={`/tema/${t.n}`}>
              <div className="tema-num">{t.n}<small>BLOQUE {t.bloque}</small></div>
              <div>
                <h3>{t.titulo}</h3>
                <div className="meta">
                  peso histórico {t.pts.toFixed(1).replace('.', ',')} pts · {preg.length ? `${dominadas}/${preg.length} preguntas` : 'contenido en preparación'}
                  {tarj.length > 0 && ` · ${nuevasTarj} tarjetas sin ver`}
                </div>
                <div className="bar"><i style={{ width: `${preg.length ? (dominadas / preg.length) * 100 : 0}%` }} /></div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
