import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Contexto, Pregunta } from '../components/Pregunta';
import { corregirParte, fmt, queCuentan, resumen, valorar } from '../lib/correccion';
import { datos, desdeExamen, explicacionesPorRef } from '../lib/datos';
import { borrarExamen, guardarExamen, leerExamen, marcarEntregado, nuevoId, restante, type ConfigExamen, type ExamenGuardado } from '../lib/examenGuardado';
import type { Resultado as ResultadoEscritura } from '../lib/cola';
import { useProgreso } from '../lib/progreso';
import { useCarga } from '../lib/useCarga';
import type { Examen, Letra, NotaParte, PreguntaVista } from '../lib/tipos';
import { NOMBRE_PARTE, PARTES_SIMULACRO, nombreExamen } from './Examenes';

type Item = PreguntaVista & { parte: string; n: number; reserva: boolean };

/** Tiempo de la última convocatoria para el ejercicio completo (test + supuesto). Revisar con cada convocatoria. */
export const MINUTOS_OFICIALES = 120;

/** El modo oficial solo tiene sentido en el formato actual: test y supuesto en un mismo ejercicio. */
export const admiteModoOficial = (ex: Examen) => !ex.formato && 'ej1' in ex.partes && 'b3' in ex.partes;

const reloj = (ms: number) => {
  const s = Math.max(0, Math.round(ms / 1000));
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), r = s % 60;
  return `${h ? `${h}:${String(m).padStart(2, '0')}` : m}:${String(r).padStart(2, '0')}`;
};
const hora = (ts: number) => new Date(ts).toLocaleString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

export function ExamenEnCurso() {
  const { id = '' } = useParams();
  const { usuario } = useProgreso();
  const carga = useCarga(async () => ({ ex: await datos.examen(id), expl: await explicacionesPorRef() }), [id]);
  const [sesion, setSesion] = useState<{ config: ConfigExamen; inicial?: ExamenGuardado } | null>(null);
  if (!carga) return <p className="note">Cargando examen…</p>;
  if (!carga.ex) return <p className="empty">No existe el examen {id}.</p>;
  const nombre = usuario?.nombre ?? '';
  if (!sesion) return <Preparar key={id} ex={carga.ex} usuario={nombre} onEmpezar={(config, inicial) => setSesion({ config, inicial })} />;
  return <Hoja ex={carga.ex} expl={carga.expl} usuario={nombre} config={sesion.config} inicial={sesion.inicial} />;
}

function Preparar({ ex, usuario, onEmpezar }: { ex: Examen; usuario: string; onEmpezar: (c: ConfigExamen, inicial?: ExamenGuardado) => void }) {
  const disponibles = Object.keys(ex.partes).filter(p => PARTES_SIMULACRO.includes(p));
  const [partes, setPartes] = useState(disponibles);
  const [modo, setModo] = useState<ConfigExamen['modo']>('examen');
  const [minutos, setMinutos] = useState(0);
  const [guardado, setGuardado] = useState(() => leerExamen(usuario, ex.id));
  const oficial = admiteModoOficial(ex);
  const respondidas = guardado ? Object.keys(guardado.resp).length : 0;
  const agotado = guardado ? restante(guardado) <= 0 : false;
  return (
    <div className="stack" style={{ maxWidth: 640 }}>
      <div>
        <Link to="/examenes" className="eyebrow">← Exámenes</Link>
        <h1>{nombreExamen(ex.anio, ex.id)}</h1>
        <p className="lead">{ex.convocatoria}{ex.nota_formato ? `. ${ex.nota_formato}` : ''}</p>
        {ex.fuente && (
          <p className="meta">
            Fuente: {[ex.fuente.cuestionario, ex.fuente.plantilla && `plantilla: ${ex.fuente.plantilla}`, ex.fuente.version_plantilla && `versión ${ex.fuente.version_plantilla}`].filter(Boolean).join(' · ')}
          </p>
        )}
      </div>
      {guardado && (
        <div className="panel stack" role="status">
          <b>{agotado ? 'Se acabó el tiempo mientras estabas fuera' : 'Tienes este examen a medias'}</b>
          <p className="note" style={{ margin: 0 }}>
            Empezado el {hora(guardado.inicio)} · {respondidas} respondidas · {guardado.config.modo === 'examen' ? 'simulacro' : 'práctica'}
            {guardado.config.minutos ? ` · ${agotado ? 'tiempo agotado' : `quedan ${reloj(restante(guardado))}`}` : ''}
          </p>
          <div className="row">
            <button className="btn" onClick={() => onEmpezar(guardado.config, guardado)}>{agotado ? 'Entregar lo que había' : 'Continuar'}</button>
            <button className="btn ghost" onClick={() => { if (confirm('¿Descartar el examen a medias? Se pierden sus respuestas.')) { borrarExamen(usuario, ex.id); setGuardado(null); } }}>Descartar</button>
          </div>
        </div>
      )}
      {!guardado && oficial && (
        <div className="panel stack">
          <b>Modo oficial</b>
          <p className="note" style={{ margin: 0 }}>Test y supuesto del bloque III juntos, {MINUTOS_OFICIALES} minutos (el tiempo de la última convocatoria) y corrección al final. Es el que mide de verdad cómo llegas.</p>
          <div className="row"><button className="btn" onClick={() => onEmpezar({ partes: ['ej1', 'b3'], modo: 'examen', minutos: MINUTOS_OFICIALES, oficial: true })}>Empezar en modo oficial</button></div>
        </div>
      )}
      {!guardado && (
        <div className="panel stack">
          <b>{oficial ? 'O a tu manera' : 'Configuración'}</b>
          {!oficial && ex.formato === 'antiguo' && <p className="note" style={{ margin: 0 }}>Formato antiguo: eran dos ejercicios con tiempos propios, así que no hay modo oficial. Pon el tiempo que quieras.</p>}
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
            <select value={modo} onChange={e => setModo(e.target.value as ConfigExamen['modo'])}>
              <option value="examen">Simulacro: corrección al final</option>
              <option value="practica">Práctica: corrección en cada pregunta</option>
            </select>
          </label>
          {modo === 'practica' && <p className="note" style={{ margin: 0 }}>En práctica ves la solución al responder, así que se guarda como práctica y no da nota orientativa ni cuenta como simulacro.</p>}
          <label className="chk">Tiempo en minutos
            <input type="number" min={0} max={300} step={1} value={minutos} onChange={e => setMinutos(Math.max(0, Math.min(300, Math.round(Number(e.target.value) || 0))))} style={{ width: 90 }} />
            <span className="meta">0 = sin límite (se muestra el tiempo que llevas)</span>
          </label>
          <div className="row"><button className={oficial ? 'btn ghost' : 'btn'} disabled={!partes.length} onClick={() => onEmpezar({ partes: disponibles.filter(p => partes.includes(p)), modo, minutos })}>Empezar</button></div>
        </div>
      )}
    </div>
  );
}

function Hoja({ ex, expl, usuario, config, inicial }: { ex: Examen; expl: Map<string, string>; usuario: string; config: ConfigExamen; inicial?: ExamenGuardado }) {
  const { responder, registrar, guardarIntento, guardado } = useProgreso();
  const items: Item[] = useMemo(() => config.partes.flatMap(p => ex.partes[p].preguntas.map(q => ({
    ...desdeExamen(q, ex, p), parte: p, n: q.n, reserva: q.reserva,
    explicacion: [expl.get(q.id), q.nota_clave].filter(Boolean).join('\n\n') || undefined,
  }))), [ex, expl, config.partes]);
  const [i, setI] = useState(() => Math.min(inicial?.i ?? 0, items.length - 1));
  const [resp, setResp] = useState<Record<string, Letra>>(inicial?.resp ?? {});
  const [notas, setNotas] = useState<Record<string, NotaParte> | null>(null);
  const [guardadoIntento, setGuardadoIntento] = useState<ResultadoEscritura | 'guardando'>('guardando');
  const [otraPestana, setOtraPestana] = useState(false);
  const inicio = useRef(inicial?.inicio ?? Date.now());
  const clienteId = useRef(inicial?.cliente_id ?? nuevoId());
  const yaGuardado = useRef(!!inicial);
  const entregado = useRef(false);
  const fin = config.minutos ? inicio.current + config.minutos * 6e4 : 0;
  const [ahora, setAhora] = useState(Date.now());
  const practica = config.modo === 'practica';
  // Preguntas que puntúan: las reservas solo cuentan si sustituyen a una anulada.
  const cuentan = useMemo(() => new Set(config.partes.flatMap(p => queCuentan(ex.partes[p]).map(q => q.id))), [ex, config.partes]);

  // Autoguardado en el navegador en cada cambio, hasta entregar. Si otra pestaña entregó este examen o empezó
  // otro, se deja de guardar y se avisa.
  useEffect(() => {
    if (entregado.current || otraPestana) return;
    const r = guardarExamen(usuario, ex.id, { v: 1, config, resp, i, inicio: inicio.current, cliente_id: clienteId.current }, !yaGuardado.current);
    if (r === 'ok') yaGuardado.current = true;
    else setOtraPestana(true);
  }, [usuario, ex.id, config, resp, i, otraPestana]);

  async function entregar() {
    if (entregado.current) return;
    entregado.current = true;
    const n = Object.fromEntries(config.partes.map(p => [p, corregirParte(ex.partes[p], resp)]));
    setNotas(n);
    marcarEntregado(usuario, ex.id, clienteId.current);
    // En simulacro se registran también los blancos de las preguntas que puntúan, para que vuelvan en el repaso.
    // En práctica cada respuesta ya se guardó al darla. Los ids del lote derivan del examen: reenviarlo
    // (otra pestaña, un reintento) no duplica nada.
    if (!practica) registrar(items.filter(q => resp[q.id] || cuentan.has(q.id)).map(q => ({ q, elegida: resp[q.id] ?? null })), 'examen', 'simulacro', clienteId.current);
    const segundos = Math.round((Date.now() - inicio.current) / 1000);
    const r = await guardarIntento({
      examen_id: ex.id, partes: config.partes, notas: n, respuestas: resp,
      segundos: config.minutos ? Math.min(segundos, config.minutos * 60) : segundos,
      modo: practica ? 'practica' : 'simulacro', limite: config.minutos || null, cliente_id: clienteId.current, ts: Date.now(),
    });
    setGuardadoIntento(r);
  }

  // Al reanudar con el tiempo ya agotado, se entrega en el acto, sin dejar responder.
  const agotadoAlEmpezar = fin > 0 && Date.now() >= fin;
  useEffect(() => { if (agotadoAlEmpezar) entregar(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (notas) return;
    const t = setInterval(() => { setAhora(Date.now()); if (fin && Date.now() >= fin) entregar(); }, 1000);
    return () => clearInterval(t);
  });

  // Si el intento quedó en cola y la cola se vacía después (reintento), el intento ya está guardado.
  const estadoIntento = guardadoIntento === 'pendiente' && guardado.estado === 'guardado' && !guardado.pendientes ? 'ok' : guardadoIntento;
  if (notas) return <Resultado ex={ex} items={items} resp={resp} notas={notas} practica={practica} cuentan={cuentan} guardado={estadoIntento} />;
  if (agotadoAlEmpezar) return <p className="note">Se acabó el tiempo: entregando…</p>;

  const q = items[i];
  const corregida = practica && !!resp[q.id];
  const etiqueta = (x: Item) => `${x.parte === 'ej1' ? 'T' : 'S'}${x.reserva ? 'R' : ''}${x.n}`;
  const elegir = (l: Letra) => {
    setResp(r => ({ ...r, [q.id]: l }));
    if (practica) responder(q, l, 'examen', 'practica');
  };
  return (
    <div className="exam-grid">
      <div className="stack" style={{ minWidth: 0 }}>
        {otraPestana && (
          <p className="note" role="alert">Este examen se ha entregado o se ha empezado de nuevo en otra pestaña, así que aquí ya no se autoguarda. Si entregas también desde aquí, no se duplicará nada.</p>
        )}
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <span className="eyebrow">{ex.partes[q.parte].titulo ?? NOMBRE_PARTE[q.parte]}{q.reserva ? ' · reserva' : ''}</span>
          <span className="meta">{i + 1} de {items.length}{practica ? ' · práctica' : config.oficial ? ' · modo oficial' : ''}</span>
        </div>
        {q.ctx && <details className="ctxbox" open={q.n === 1 && !q.reserva}><summary>Enunciado del supuesto</summary><Contexto texto={q.ctx} /></details>}
        <Pregunta key={q.id} q={q} elegida={resp[q.id]} corregida={corregida} mostrarContexto={false} onElegir={elegir} cabecera={`Pregunta ${q.n}`} />
        <div className="row">
          <button className="btn ghost" disabled={!i} onClick={() => setI(i - 1)}>Anterior</button>
          <button className="btn ghost" disabled={!resp[q.id] || corregida} onClick={() => setResp(({ [q.id]: _, ...r }) => r)}>Dejar en blanco</button>
          <button className="btn" onClick={() => (i < items.length - 1 ? setI(i + 1) : entregar())}>{i < items.length - 1 ? 'Siguiente' : 'Entregar'}</button>
        </div>
      </div>
      <aside className="sheet" aria-label="Hoja de respuestas">
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <b>Hoja de respuestas</b>
          {fin > 0
            ? <span className="timer" title="Tiempo restante">{reloj(fin - ahora)}</span>
            : <span className="meta" title="Tiempo transcurrido">{reloj(ahora - inicio.current)}</span>}
        </div>
        <p className="meta" style={{ margin: '4px 0 0' }}>Se guarda solo en este navegador mientras haces el examen.</p>
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

function Resultado({ ex, items, resp, notas, practica, cuentan, guardado }: {
  ex: Examen; items: Item[]; resp: Record<string, Letra>; notas: Record<string, NotaParte>; practica: boolean; cuentan: Set<string>; guardado: ResultadoEscritura | 'guardando';
}) {
  const [revision, setRevision] = useState<'falladas' | 'todas' | null>(null);
  const lista = items.filter(q => revision === 'todas' || (q.ok && !q.anulada && resp[q.id] !== q.ok && (resp[q.id] || cuentan.has(q.id))));
  const nombre = (p: string) => ex.partes[p].titulo ?? NOMBRE_PARTE[p] ?? p;
  const criterios = Object.fromEntries(Object.keys(notas).map(p => [p, ex.partes[p].criterio]));
  const hayCorte = Object.values(criterios).some(c => c?.oficial);
  return (
    <div className="stack">
      <div>
        <span className="eyebrow">{nombreExamen(ex.anio, ex.id)}{practica ? ' · práctica' : ''}</span>
        <h1>Resultado</h1>
        {practica
          ? <p className="lead">Era práctica (con la solución a la vista), así que no cuenta como simulacro. Estos números sirven para ver dónde fallas, no para estimar la nota.</p>
          : resumen(notas, criterios, nombre, ex.formato === 'antiguo').map((l, k) => <p key={k} className={k ? 'note' : 'lead'}>{l}</p>)}
        <p className="meta">
          {guardado === 'guardando' ? 'Guardando el intento…'
            : guardado === 'ok' ? 'Intento guardado.'
            : guardado === 'rechazado' ? 'El servidor rechazó el intento y no se ha guardado. Las respuestas sí se han registrado para el repaso.'
            : 'El intento no se ha podido guardar todavía: está en cola y se reintentará (mira el aviso de la cabecera).'}
        </p>
      </div>
      <div className="panel" style={{ overflowX: 'auto' }}>
        <table className="res">
          <thead><tr><th>Parte</th><th>Aciertos</th><th>Errores</th><th>En blanco</th><th>Neta</th>{!practica && <th>Nota orientativa /50</th>}</tr></thead>
          <tbody>
            {Object.entries(notas).map(([p, n]) => {
              const v = valorar(n, criterios[p]);
              return (
                <tr key={p}>
                  <td>{nombre(p)}</td><td>{n.a}</td><td>{n.e}</td><td>{n.b}</td>
                  <td><b>{fmt(v.neta)}</b> <span className="meta">de {v.total}</span></td>
                  {!practica && <td>{v.corte?.transformada !== undefined
                    ? <><b>{fmt(v.corte.transformada)}</b> <span className="chip ok">oficial</span></>
                    : v.corte?.oficial && v.corte.margen < 0
                      ? <><span className="chip ko">bajo el corte</span> <span className="meta">{fmt(n.nota)} lineal</span></>
                      : <>{fmt(n.nota)} <span className="chip">orientativa</span></>}</td>}
                </tr>
              );
            })}
          </tbody>
        </table>
        {!practica && !hayCorte && (
          <p className="note">La nota oficial no sale de esta cuenta: la Comisión fija cada año una puntuación directa mínima y la transforma en 25 sobre 50. La columna orientativa solo reparte 50 puntos de forma lineal.</p>
        )}
      </div>
      <div className="row">
        <button className="btn" onClick={() => setRevision('falladas')}>Revisar falladas y en blanco</button>
        <button className="btn ghost" onClick={() => setRevision('todas')}>Revisar todas</button>
        <Link className="btn ghost" to="/repaso">Ir al repaso</Link>
        <Link className="btn ghost" to="/examenes">Volver a exámenes</Link>
      </div>
      {revision && (
        <div className="stack">
          {lista.map(q => <Pregunta key={q.id} q={q} elegida={resp[q.id]} corregida cabecera={`${NOMBRE_PARTE[q.parte] ?? q.parte} · ${q.reserva ? 'reserva ' : ''}${q.n}${resp[q.id] ? '' : ' · en blanco'}`} />)}
          {!lista.length && <p className="empty">Ninguna fallada ni en blanco.</p>}
        </div>
      )}
    </div>
  );
}
