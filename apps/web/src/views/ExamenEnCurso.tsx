import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Contexto, Pregunta } from '../components/Pregunta';
import { corregirParte, fmt, MINIMO, veredicto } from '../lib/correccion';
import { datos, desdeExamen, explicacionesPorRef } from '../lib/datos';
import { useProgreso } from '../lib/progreso';
import { useCarga } from '../lib/useCarga';
import type { Examen, Letra, NotaParte, PreguntaVista } from '../lib/tipos';
import { NOMBRE_PARTE, PARTES_SIMULACRO, nombreExamen } from './Examenes';

type Item = PreguntaVista & { parte: string; n: number; reserva: boolean };
interface Config { partes: string[]; modo: 'examen' | 'practica'; minutos: number }

export function ExamenEnCurso() {
  const { id = '' } = useParams();
  const carga = useCarga(async () => ({ ex: await datos.examen(id), expl: await explicacionesPorRef() }), [id]);
  const [config, setConfig] = useState<Config | null>(null);
  if (!carga) return <p className="note">Cargando examen…</p>;
  if (!carga.ex) return <p className="empty">No existe el examen {id}.</p>;
  if (!config) return <Preparar ex={carga.ex} onEmpezar={setConfig} />;
  return <Hoja ex={carga.ex} expl={carga.expl} config={config} />;
}

function Preparar({ ex, onEmpezar }: { ex: Examen; onEmpezar: (c: Config) => void }) {
  const disponibles = Object.keys(ex.partes).filter(p => PARTES_SIMULACRO.includes(p));
  const [partes, setPartes] = useState(disponibles);
  const [modo, setModo] = useState<Config['modo']>('examen');
  const [minutos, setMinutos] = useState(0);
  return (
    <div className="stack" style={{ maxWidth: 640 }}>
      <div>
        <Link to="/examenes" className="eyebrow">← Exámenes</Link>
        <h1>{nombreExamen(ex.anio, ex.id)}</h1>
        <p className="lead">{ex.convocatoria}{ex.nota_formato ? `. ${ex.nota_formato}` : ''}</p>
      </div>
      <div className="panel stack">
        {disponibles.map(p => {
          const qs = ex.partes[p].preguntas;
          return (
            <label key={p} className="chk">
              <input type="checkbox" checked={partes.includes(p)} onChange={e => setPartes(e.target.checked ? [...partes, p] : partes.filter(x => x !== p))} />
              {ex.partes[p].titulo ?? NOMBRE_PARTE[p]} <span className="meta">({qs.filter(q => !q.reserva).length} + {qs.filter(q => q.reserva).length} reserva)</span>
            </label>
          );
        })}
        <label className="chk">Modo
          <select value={modo} onChange={e => setModo(e.target.value as Config['modo'])}>
            <option value="examen">Examen: corrección al final</option>
            <option value="practica">Práctica: corrección en cada pregunta</option>
          </select>
        </label>
        <label className="chk">Tiempo en minutos
          <input type="number" min={0} max={300} value={minutos} onChange={e => setMinutos(Number(e.target.value))} style={{ width: 90 }} />
          <span className="meta">0 = sin límite</span>
        </label>
        <div className="row"><button className="btn" disabled={!partes.length} onClick={() => onEmpezar({ partes: disponibles.filter(p => partes.includes(p)), modo, minutos })}>Empezar</button></div>
      </div>
    </div>
  );
}

function Hoja({ ex, expl, config }: { ex: Examen; expl: Map<string, string>; config: Config }) {
  const { responder, guardarIntento } = useProgreso();
  const items: Item[] = useMemo(() => config.partes.flatMap(p => ex.partes[p].preguntas.map(q => ({
    ...desdeExamen(q, ex, p), parte: p, n: q.n, reserva: q.reserva,
    explicacion: [expl.get(q.id), q.nota_clave].filter(Boolean).join('\n\n') || undefined,
  }))), [ex, expl, config.partes]);
  const [i, setI] = useState(0);
  const [resp, setResp] = useState<Record<string, Letra>>({});
  const [notas, setNotas] = useState<Record<string, NotaParte> | null>(null);
  const inicio = useRef(Date.now());
  const fin = config.minutos ? inicio.current + config.minutos * 6e4 : 0;
  const [ahora, setAhora] = useState(Date.now());

  async function entregar() {
    if (notas) return;
    const n = Object.fromEntries(config.partes.map(p => [p, corregirParte(ex.partes[p], resp)]));
    setNotas(n);
    for (const q of items) if (resp[q.id] && q.ok) responder(q, resp[q.id], 'examen');
    await guardarIntento({ examen_id: ex.id, partes: config.partes, notas: n, respuestas: resp, segundos: Math.round((Date.now() - inicio.current) / 1000) });
  }

  useEffect(() => {
    if (!fin || notas) return;
    const t = setInterval(() => { setAhora(Date.now()); if (Date.now() >= fin) entregar(); }, 1000);
    return () => clearInterval(t);
  });

  if (notas) return <Resultado ex={ex} items={items} resp={resp} notas={notas} />;

  const q = items[i];
  const corregida = config.modo === 'practica' && !!resp[q.id];
  const etiqueta = (x: Item) => `${x.parte === 'ej1' ? 'T' : 'S'}${x.reserva ? 'R' : ''}${x.n}`;
  const resta = Math.max(0, Math.round((fin - ahora) / 1000));
  return (
    <div className="exam-grid">
      <div className="stack" style={{ minWidth: 0 }}>
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <span className="eyebrow">{ex.partes[q.parte].titulo ?? NOMBRE_PARTE[q.parte]}{q.reserva ? ' · reserva' : ''}</span>
          <span className="meta">{i + 1} de {items.length}</span>
        </div>
        {q.ctx && <details className="ctxbox" open={q.n === 1 && !q.reserva}><summary>Enunciado del supuesto</summary><Contexto texto={q.ctx} /></details>}
        <Pregunta key={q.id} q={q} elegida={resp[q.id]} corregida={corregida} mostrarContexto={false} onElegir={l => setResp(r => ({ ...r, [q.id]: l }))} cabecera={`Pregunta ${q.n}`} />
        <div className="row">
          <button className="btn ghost" disabled={!i} onClick={() => setI(i - 1)}>Anterior</button>
          <button className="btn ghost" disabled={!resp[q.id] || corregida} onClick={() => setResp(({ [q.id]: _, ...r }) => r)}>Dejar en blanco</button>
          <button className="btn" onClick={() => (i < items.length - 1 ? setI(i + 1) : entregar())}>{i < items.length - 1 ? 'Siguiente' : 'Entregar'}</button>
        </div>
      </div>
      <aside className="sheet" aria-label="Hoja de respuestas">
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <b>Hoja de respuestas</b>
          {fin > 0 && <span className="timer">{Math.floor(resta / 60)}:{String(resta % 60).padStart(2, '0')}</span>}
        </div>
        {config.partes.map(p => (
          <div key={p}>
            <h4>{ex.partes[p].titulo ?? NOMBRE_PARTE[p]}</h4>
            <div className="cells">
              {items.map((x, k) => x.parte === p && (
                <button key={x.id} className={`cell ${resp[x.id] ? 'done' : ''} ${k === i ? 'cur' : ''}`} onClick={() => setI(k)}>{etiqueta(x)}</button>
              ))}
            </div>
          </div>
        ))}
        <div className="row" style={{ marginTop: 12 }}>
          <button className="btn" onClick={() => { if (confirm(`¿Entregar? Llevas ${Object.keys(resp).length} de ${items.length} respondidas.`)) entregar(); }}>Entregar</button>
        </div>
      </aside>
    </div>
  );
}

function Resultado({ ex, items, resp, notas }: { ex: Examen; items: Item[]; resp: Record<string, Letra>; notas: Record<string, NotaParte> }) {
  const [revision, setRevision] = useState<'falladas' | 'todas' | null>(null);
  const lista = items.filter(q => revision === 'todas' || (resp[q.id] && resp[q.id] !== q.ok && !q.anulada));
  return (
    <div className="stack">
      <div>
        <span className="eyebrow">{nombreExamen(ex.anio, ex.id)}</span>
        <h1>Resultado</h1>
        <p className="lead">{veredicto(notas)}</p>
      </div>
      <div className="panel" style={{ overflowX: 'auto' }}>
        <table className="res">
          <thead><tr><th>Parte</th><th>Aciertos</th><th>Errores</th><th>En blanco</th><th>Nota /50</th></tr></thead>
          <tbody>
            {Object.entries(notas).map(([p, n]) => (
              <tr key={p}>
                <td>{ex.partes[p].titulo ?? NOMBRE_PARTE[p]}</td><td>{n.a}</td><td>{n.e}</td><td>{n.b}</td>
                <td><b>{fmt(n.nota)}</b> <span className={`chip ${n.nota >= MINIMO ? 'ok' : 'ko'}`}>{n.nota >= MINIMO ? '≥ 25' : '< 25'}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="row">
        <button className="btn" onClick={() => setRevision('falladas')}>Revisar las falladas</button>
        <button className="btn ghost" onClick={() => setRevision('todas')}>Revisar todas</button>
        <Link className="btn ghost" to="/examenes">Volver a exámenes</Link>
      </div>
      {revision && (
        <div className="stack">
          {lista.map(q => <Pregunta key={q.id} q={q} elegida={resp[q.id]} corregida cabecera={`${NOMBRE_PARTE[q.parte] ?? q.parte} · ${q.reserva ? 'reserva ' : ''}${q.n}${resp[q.id] ? '' : ' · en blanco'}`} />)}
          {!lista.length && <p className="empty">Ninguna fallada.</p>}
        </div>
      )}
    </div>
  );
}
