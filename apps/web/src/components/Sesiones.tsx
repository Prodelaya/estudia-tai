import { useState } from 'react';
import { Pregunta } from './Pregunta';
import { Markdown } from './Markdown';
import { useProgreso } from '../lib/progreso';
import type { Nota } from '../lib/srs';
import type { Letra, PreguntaVista, Tarjeta } from '../lib/tipos';

/** Test de práctica: corrige al momento, enseña la explicación y guarda cada respuesta. */
export function SesionPractica({ preguntas, onFin, origen = 'test' }: { preguntas: PreguntaVista[]; onFin: () => void; origen?: string }) {
  const { responder } = useProgreso();
  const [i, setI] = useState(0);
  const [elegidas, setElegidas] = useState<Record<string, Letra>>({});
  if (!preguntas.length) return <p className="empty">No hay preguntas con ese filtro.</p>;
  const terminado = i >= preguntas.length;
  const respondidas = preguntas.filter(q => elegidas[q.id]);
  const aciertos = respondidas.filter(q => elegidas[q.id] === q.ok).length;

  if (terminado) {
    return (
      <div className="stack">
        <div className="panel">
          <h2>Resultado: {aciertos} de {respondidas.length}</h2>
          <p className="lead">Las falladas vuelven a salir en «Repaso» hasta que las aciertes dos veces con al menos un día de diferencia.</p>
        </div>
        <div className="row"><button className="btn" onClick={onFin}>Volver</button></div>
      </div>
    );
  }

  const q = preguntas[i];
  const elegida = elegidas[q.id];
  return (
    <div className="stack">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <span className="meta">Pregunta {i + 1} de {preguntas.length} · {aciertos} aciertos</span>
        <button className="btn ghost" onClick={() => setI(preguntas.length)}>Terminar</button>
      </div>
      <Pregunta
        key={q.id}
        q={q}
        elegida={elegida}
        corregida={!!elegida || !q.ok}
        onElegir={l => { setElegidas(e => ({ ...e, [q.id]: l })); responder(q, l, origen); }}
      />
      <div className="row">
        <button className="btn ghost" disabled={!i} onClick={() => setI(i - 1)}>Anterior</button>
        <button className="btn" onClick={() => setI(i + 1)}>{elegida || !q.ok ? 'Siguiente' : 'Saltar'}</button>
      </div>
    </div>
  );
}

const NOTAS: [Nota, string][] = [[0, 'Otra vez'], [1, 'Difícil'], [2, 'Bien'], [3, 'Fácil']];

/** Tarjetas con repetición espaciada (SM-2). */
export function SesionTarjetas({ tarjetas, temaDe, onFin }: { tarjetas: Tarjeta[]; temaDe: (t: Tarjeta) => number | null; onFin: () => void }) {
  const { calificar } = useProgreso();
  const [cola, setCola] = useState(tarjetas);
  const [girada, setGirada] = useState(false);
  const [hechas, setHechas] = useState(0);
  if (!cola.length) {
    return (
      <div className="stack">
        <p className="empty">{hechas ? `Hecho: ${hechas} tarjetas repasadas.` : 'No te toca ninguna tarjeta ahora.'}</p>
        <div className="row"><button className="btn" onClick={onFin}>Volver</button></div>
      </div>
    );
  }
  const t = cola[0];
  const nota = (n: Nota) => {
    calificar(t.id, temaDe(t), n);
    setGirada(false);
    setHechas(h => h + 1);
    // «Otra vez» la devuelve al final de la sesión.
    setCola(c => (n === 0 ? [...c.slice(1), c[0]] : c.slice(1)));
  };
  return (
    <div className="stack">
      <span className="meta">{cola.length} pendientes{t.epigrafe ? ` · ${t.epigrafe}` : ''}</span>
      <div className="panel flash">
        <Markdown texto={t.anverso} className="front" />
        {girada && <div className="back"><Markdown texto={t.reverso} className="" /></div>}
      </div>
      {girada
        ? <div className="grades">{NOTAS.map(([n, l]) => <button key={n} onClick={() => nota(n)}>{l}</button>)}</div>
        : <button className="btn" onClick={() => setGirada(true)}>Ver respuesta</button>}
    </div>
  );
}
