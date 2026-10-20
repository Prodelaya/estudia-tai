import { useState } from 'react';
import { Markdown } from './Markdown';
import { useProgreso } from '../lib/progreso';
import type { Clave, Letra, PreguntaVista } from '../lib/tipos';

const LETRAS: Letra[] = ['a', 'b', 'c', 'd'];

const CLAVE: Record<Clave, [string, string]> = {
  'oficial': ['Clave oficial', 'ok'],
  'oficial-provisional': ['Clave oficial provisional', 'ok'],
  'claude': ['Resuelta por Claude', 'warn'],
  'claude-dudosa': ['Clave dudosa', 'ko'],
};
const TIPO = { historica: 'Salió en examen', variante: 'Variante', nueva: 'Posible pregunta nueva' } as const;

const pareceCodigo = (s: string) => /[{};]\s*$|^\s{2,}\S|<\/?\w+>/m.test(s) && s.includes('\n');

interface Props {
  q: PreguntaVista;
  elegida?: Letra;
  corregida: boolean;
  onElegir?: (l: Letra) => void;
  cabecera?: string;
  mostrarContexto?: boolean;
}

export function Pregunta({ q, elegida, corregida, onElegir, cabecera, mostrarContexto = true }: Props) {
  const [clave, tono] = CLAVE[q.clave] ?? CLAVE.claude;
  return (
    <article className="q">
      <div className="q-head">
        {cabecera && <span className="eyebrow">{cabecera}</span>}
        {q.etiqueta && <span className="chip">{q.etiqueta}</span>}
        {!q.etiqueta && q.tipo && <span className="chip">{TIPO[q.tipo]}</span>}
        {q.texto === 'reformulado' && <span className="chip warn" title="Texto reconstruido, no literal del examen">Reformulada</span>}
        {q.anulada && <span className="chip ko">Anulada</span>}
        {q.obsoleta && <span className="chip warn">Normativa cambiada</span>}
        {corregida && <span className={`chip ${tono}`}>{clave}</span>}
      </div>
      {mostrarContexto && q.ctx && (
        <details className="ctxbox"><summary>Enunciado del supuesto</summary><Contexto texto={q.ctx} /></details>
      )}
      {q.subctx && <Contexto texto={q.subctx} abierto />}
      <div className={`q-text ${pareceCodigo(q.q) ? 'code' : ''}`}>{pareceCodigo(q.q) ? q.q : <Negritas texto={q.q} />}</div>
      <div className="opts" role="radiogroup">
        {LETRAS.map(l => {
          let cls = 'opt';
          if (corregida && q.ok === l) cls += ' right';
          else if (corregida && elegida === l) cls += ' wrong';
          else if (elegida === l) cls += ' sel';
          return (
            <button key={l} className={cls} role="radio" aria-checked={elegida === l} disabled={corregida || !onElegir} onClick={() => onElegir?.(l)}>
              <span className="l">{l}</span>
              <span className={`t ${pareceCodigo(q.op[l]) ? 'code' : ''}`}>{q.op[l]}</span>
            </button>
          );
        })}
      </div>
      {corregida && (
        <div className="expl">
          {!q.ok ? <p><b>Pregunta anulada:</b> no puntúa.</p> : <p><b>Correcta: {q.ok})</b>{elegida ? (elegida === q.ok ? ' Has acertado.' : ` Marcaste ${elegida}).`) : ' La dejaste en blanco.'}</p>}
          {q.explicacion ? <Markdown texto={q.explicacion} /> : <p className="note">Sin explicación: solo las tienen las preguntas de tus 18 temas.</p>}
          <BotonDuda q={q} />
        </div>
      )}
    </article>
  );
}

/** Los enunciados son texto literal (pueden llevar código); solo se interpreta **negrita**. */
function Negritas({ texto }: { texto: string }) {
  return <>{texto.split(/\*\*([^*\s](?:[^*\n]*?[^*\s])?)\*\*/g).map((t, i) => (i % 2 ? <b key={i}>{t}</b> : t))}</>;
}

/** Contexto de supuesto: admite imágenes [[img:fichero.png]]. */
export function Contexto({ texto, abierto = false }: { texto: string; abierto?: boolean }) {
  const trozos = texto.split(/\[\[img:([\w.-]+)\]\]/);
  return (
    <div className={abierto ? 'ctx subctx' : 'ctx'}>
      {trozos.map((t, i) => (i % 2 ? <img key={i} src={`/data/img/${t}`} alt="Diagrama del supuesto" style={{ maxWidth: '100%' }} /> : <span key={i}>{t}</span>))}
    </div>
  );
}

function BotonDuda({ q }: { q: PreguntaVista }) {
  const { progreso, marcar } = useProgreso();
  const ya = progreso.marcas.some(m => m.pregunta_id === q.id);
  const [abierto, setAbierto] = useState(false);
  const [nota, setNota] = useState('');
  if (ya) return <p className="note">Marcada como dudosa. La verás en «Dudas».</p>;
  if (!abierto) return <button className="btn ghost" style={{ marginTop: 8 }} onClick={() => setAbierto(true)}>Dudo de esta clave</button>;
  return (
    <div className="row" style={{ marginTop: 8 }}>
      <input type="text" placeholder="¿Qué crees que falla? (opcional)" value={nota} onChange={e => setNota(e.target.value)} style={{ flex: 1, minWidth: 200 }} />
      <button className="btn" onClick={() => marcar(q, nota)}>Guardar duda</button>
    </div>
  );
}
