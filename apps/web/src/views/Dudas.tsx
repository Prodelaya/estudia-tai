import { useProgreso } from '../lib/progreso';

/** Claves marcadas como dudosas: sirven de lista de trabajo para revisar y corregir el contenido. */
export function Dudas() {
  const { progreso, resolverMarca, borrarMarca } = useProgreso();
  const pendientes = progreso.marcas.filter(m => !m.resuelta);
  const resueltas = progreso.marcas.filter(m => m.resuelta);
  return (
    <div className="stack">
      <div>
        <h1>Claves en duda</h1>
        <p className="lead">Las preguntas cuya respuesta has marcado como dudosa. Pásame esta lista y reviso la clave o la explicación; cuando esté corregida, márcala como resuelta.</p>
      </div>
      {!progreso.marcas.length && <p className="empty">No has marcado ninguna. En cada pregunta corregida tienes el botón «Dudo de esta clave».</p>}
      {[['Pendientes', pendientes], ['Resueltas', resueltas]].map(([titulo, lista]) => (lista as typeof pendientes).length > 0 && (
        <section key={titulo as string} className="stack">
          <h2>{titulo as string}</h2>
          <div className="list">
            {(lista as typeof pendientes).map(m => (
              <div key={m.pregunta_id} className="exam-item">
                <div>
                  <b>{m.pregunta_id}</b> <span className="meta">{m.tema ? `tema ${m.tema} · ` : ''}{new Date(m.ts).toLocaleDateString('es-ES')}</span>
                  {m.nota && <div className="note">{m.nota}</div>}
                </div>
                <div className="row">
                  <button className="btn ghost" onClick={() => resolverMarca(m.pregunta_id, !m.resuelta)}>{m.resuelta ? 'Reabrir' : 'Resuelta'}</button>
                  <button className="btn ghost" onClick={() => borrarMarca(m.pregunta_id)}>Quitar</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
