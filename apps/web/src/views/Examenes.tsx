import { Link } from 'react-router-dom';
import { datos } from '../lib/datos';
import { fmt, valorar } from '../lib/correccion';
import { useProgreso } from '../lib/progreso';
import { useCarga } from '../lib/useCarga';

export const NOMBRE_PARTE: Record<string, string> = { ej1: 'Test', b3: 'Supuesto III', b4: 'Supuesto IV', ej1_iv: 'Test bloque IV' };
/** Pablo se examina de test + supuesto del bloque III: el resto no se ofrece como simulacro. */
export const PARTES_SIMULACRO = ['ej1', 'b3'];

export const nombreExamen = (anio: number, id: string) =>
  id === 'LI_2025' ? 'Mayo 2026' : id === 'LI_2025ext' ? 'Extraordinario 2026' : `OEP ${anio}`;

export function Examenes() {
  const { progreso } = useProgreso();
  const examenes = useCarga(() => datos.examenes(), []);
  if (!examenes) return <p className="note">Cargando exámenes…</p>;
  return (
    <div className="stack">
      <div>
        <h1>Exámenes reales</h1>
        <p className="lead">Completos y tal como salieron. Se corrigen con las reglas de las bases: cada error resta un tercio y las reservas sustituyen a las anuladas. Verás tu puntuación neta; la nota sobre 50 es orientativa, porque el corte lo fija la Comisión en cada convocatoria.</p>
      </div>
      <div className="list">
        {[...examenes].sort((a, b) => b.anio - a.anio || a.id.localeCompare(b.id)).map(e => {
          // Los intentos en modo práctica no cuentan como simulacro.
          const ultimo = progreso.intentos.find(i => i.examen_id === e.id && i.modo !== 'practica');
          return (
            <div key={e.id} className="exam-item">
              <div>
                <b>{nombreExamen(e.anio, e.id)}</b> <span className="meta">{e.convocatoria}</span>
                <div className="row" style={{ marginTop: 6 }}>
                  {e.partes.filter(p => PARTES_SIMULACRO.includes(p)).map(p => <span key={p} className="chip">{NOMBRE_PARTE[p] ?? p}</span>)}
                  {e.fuente_clave === 'oficial-provisional' && <span className="chip warn">Clave provisional</span>}
                </div>
                {ultimo && (
                  <div className="note" style={{ marginTop: 6 }}>
                    Último simulacro: {Object.entries(ultimo.notas).map(([p, n]) => `${NOMBRE_PARTE[p] ?? p} neta ${fmt(valorar(n).neta)}`).join(' · ')}
                  </div>
                )}
              </div>
              <Link className="btn" to={`/examenes/${e.id}`}>Hacer examen</Link>
            </div>
          );
        })}
        {!examenes.length && <p className="empty">Aún no hay exámenes cargados.</p>}
      </div>
    </div>
  );
}
