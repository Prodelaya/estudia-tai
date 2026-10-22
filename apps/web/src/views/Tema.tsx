import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Markdown } from '../components/Markdown';
import { SesionPractica, SesionTarjetas } from '../components/Sesiones';
import { datos, desdeTema, idProgreso } from '../lib/datos';
import { useProgreso } from '../lib/progreso';
import { contestada } from '../lib/repaso';
import { hoy } from '../lib/srs';
import { barajar, useCarga } from '../lib/useCarga';
import type { ContenidoTema, PreguntaTema } from '../lib/tipos';

const PESTANAS = [['leccion', 'Lección'], ['tarjetas', 'Tarjetas'], ['test', 'Test']] as const;

export function TemaVista() {
  const { n: nStr, pestana = 'leccion' } = useParams();
  const n = Number(nStr);
  const navegar = useNavigate();
  const carga = useCarga(async () => {
    const [temas, leccion, contenido] = await Promise.all([datos.temas(), datos.leccion(n), datos.contenido(n)]);
    return { tema: temas.find(t => t.n === n), leccion, contenido };
  }, [n]);
  if (!carga) return <p className="note">Cargando…</p>;
  if (!carga.tema) return <p className="empty">No existe el tema {n}.</p>;
  const { tema, leccion, contenido } = carga;

  return (
    <div className="stack">
      <div>
        <Link to="/" className="eyebrow">← Temas</Link>
        <h1>Tema {tema.n}. {tema.titulo}</h1>
        <p className="lead">≈{tema.preg_test.toString().replace('.', ',')} preguntas de test por examen{tema.preg_sup3 ? ` y ${tema.preg_sup3.toString().replace('.', ',')} del supuesto III` : ''} · {tema.horas} h de estudio estimadas</p>
      </div>
      <div className="tabs" role="tablist">
        {PESTANAS.map(([id, txt]) => (
          <button key={id} role="tab" aria-selected={pestana === id} onClick={() => navegar(`/tema/${n}/${id}`)}>{txt}</button>
        ))}
      </div>
      {pestana === 'leccion' && (leccion ? <Leccion md={leccion} /> : <p className="empty">Lección no disponible.</p>)}
      {pestana === 'tarjetas' && (contenido?.tarjetas.length ? <Tarjetas c={contenido} /> : <p className="empty">Tarjetas en preparación.</p>)}
      {pestana === 'test' && (contenido?.preguntas.length ? <TestTema c={contenido} /> : <p className="empty">Preguntas en preparación.</p>)}
    </div>
  );
}

const slug = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function Leccion({ md }: { md: string }) {
  const secciones = useMemo(() => [...md.matchAll(/^## (.+)$/gm)].map(m => m[1]), [md]);
  // Anclas en los ## para el índice lateral.
  const conAnclas = useMemo(() => md.replace(/^## (.+)$/gm, (_, t) => `<h2 id="${slug(t)}">${t}</h2>`), [md]);
  return (
    <div className="lesson-grid">
      <nav className="toc" aria-label="Índice del tema">
        {secciones.map(s => <a key={s} href={`#${slug(s)}`} onClick={e => { e.preventDefault(); document.getElementById(slug(s))?.scrollIntoView({ behavior: 'smooth' }); }}>{s}</a>)}
      </nav>
      <Markdown texto={conAnclas} />
    </div>
  );
}

function Tarjetas({ c }: { c: ContenidoTema }) {
  const { porTarjeta } = useProgreso();
  const [sesion, setSesion] = useState<'repaso' | 'todas' | null>(null);
  const vencidas = c.tarjetas.filter(t => { const s = porTarjeta.get(t.id); return s && s.vence <= hoy(); });
  const nuevas = c.tarjetas.filter(t => !porTarjeta.has(t.id));
  if (sesion) {
    const lista = sesion === 'repaso' ? [...vencidas, ...nuevas.slice(0, 20)] : barajar(c.tarjetas);
    return <SesionTarjetas tarjetas={lista} temaDe={() => c.tema} onFin={() => setSesion(null)} />;
  }
  return (
    <div className="stack">
      <div className="stats">
        <div className="stat"><b>{vencidas.length}</b><span>para repasar hoy</span></div>
        <div className="stat"><b>{nuevas.length}</b><span>sin ver</span></div>
        <div className="stat"><b>{c.tarjetas.length}</b><span>en total</span></div>
      </div>
      <div className="row">
        <button className="btn" disabled={!vencidas.length && !nuevas.length} onClick={() => setSesion('repaso')}>Repasar ({vencidas.length} + {Math.min(20, nuevas.length)} nuevas)</button>
        <button className="btn ghost" onClick={() => setSesion('todas')}>Pasar todas</button>
      </div>
    </div>
  );
}

type Filtro = 'todas' | 'historica' | 'variante' | 'nueva';
type Seleccion = 'todas' | 'sin-ver' | 'falladas';

function TestTema({ c }: { c: ContenidoTema }) {
  const { porPregunta } = useProgreso();
  const [filtro, setFiltro] = useState<Filtro>('todas');
  const [seleccion, setSeleccion] = useState<Seleccion>('todas');
  const [epigrafe, setEpigrafe] = useState('');
  const [cuantas, setCuantas] = useState(20);
  const [sesion, setSesion] = useState<PreguntaTema[] | null>(null);

  const epigrafes = useMemo(() => [...new Set(c.preguntas.map(p => p.epigrafe).filter(Boolean) as string[])], [c]);
  const cuenta = (t: Filtro) => c.preguntas.filter(p => t === 'todas' || p.tipo === t).length;
  const candidatas = c.preguntas.filter(p =>
    (filtro === 'todas' || p.tipo === filtro)
    && (!epigrafe || p.epigrafe === epigrafe)
    && (seleccion === 'todas' || (seleccion === 'sin-ver' ? !contestada(porPregunta.get(idProgreso(p))) : porPregunta.get(idProgreso(p))?.ultima === 0)));

  if (sesion) return <SesionPractica preguntas={sesion.map(p => desdeTema(p, c.tema))} onFin={() => setSesion(null)} />;
  return (
    <div className="panel stack">
      <div className="row">
        <label className="chk">Tipo
          <select value={filtro} onChange={e => setFiltro(e.target.value as Filtro)}>
            <option value="todas">Todas ({cuenta('todas')})</option>
            <option value="historica">Salieron en examen ({cuenta('historica')})</option>
            <option value="variante">Variantes ({cuenta('variante')})</option>
            <option value="nueva">Posibles nuevas ({cuenta('nueva')})</option>
          </select>
        </label>
        <label className="chk">Cuáles
          <select value={seleccion} onChange={e => setSeleccion(e.target.value as Seleccion)}>
            <option value="todas">Todas</option>
            <option value="sin-ver">Sin ver</option>
            <option value="falladas">Falladas la última vez</option>
          </select>
        </label>
        {epigrafes.length > 1 && (
          <label className="chk">Apartado
            <select value={epigrafe} onChange={e => setEpigrafe(e.target.value)}>
              <option value="">Todos</option>
              {epigrafes.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
          </label>
        )}
        <label className="chk">Número
          <select value={cuantas} onChange={e => setCuantas(Number(e.target.value))}>
            {[10, 20, 40, 80].map(k => <option key={k} value={k}>{k}</option>)}
            <option value={9999}>Todas</option>
          </select>
        </label>
      </div>
      <div className="row">
        <button className="btn" disabled={!candidatas.length} onClick={() => setSesion(barajar(candidatas).slice(0, cuantas))}>
          Empezar ({Math.min(cuantas, candidatas.length)} de {candidatas.length})
        </button>
      </div>
    </div>
  );
}
