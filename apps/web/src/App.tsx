import { NavLink, Route, Routes, useLocation } from 'react-router-dom';
import { useProgreso } from './lib/progreso';
import { Login } from './views/Login';
import { Inicio } from './views/Inicio';
import { TemaVista } from './views/Tema';
import { Repaso } from './views/Repaso';
import { Examenes } from './views/Examenes';
import { ExamenEnCurso } from './views/ExamenEnCurso';
import { Dudas } from './views/Dudas';
import { Activar } from './views/Activar';
import { Usuarios } from './views/Usuarios';

export function App() {
  const { estado, usuario, salir, guardado, reintentar } = useProgreso();
  const location = useLocation();
  if (location.pathname === '/activar') return <Activar />;
  if (estado === 'cargando') return <main className="wrap"><p className="note">Cargando…</p></main>;
  if (estado === 'login') return <Login />;
  return (
    <>
      <header className="top">
        <div className="wrap">
          <NavLink className="brand" to="/">Estudia TAI <small>acceso libre</small></NavLink>
          <nav className="main">
            <NavLink to="/" end>Temas</NavLink>
            <NavLink to="/repaso">Repaso</NavLink>
            <NavLink to="/examenes">Exámenes</NavLink>
            <NavLink to="/dudas">Dudas</NavLink>
            <a href="/api/export" title="Descarga una copia de tu progreso">Exportar</a>
            {usuario?.admin && <NavLink to="/usuarios">Usuarios</NavLink>}
            <button onClick={salir}>Salir ({usuario?.nombre})</button>
          </nav>
          <EstadoGuardado estado={guardado.estado} pendientes={guardado.pendientes} error={guardado.error} onReintentar={reintentar} />
        </div>
      </header>
      <main className="wrap">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/tema/:n/:pestana?" element={<TemaVista />} />
          <Route path="/repaso" element={<Repaso />} />
          <Route path="/examenes" element={<Examenes />} />
          <Route path="/examenes/:id" element={<ExamenEnCurso />} />
          <Route path="/dudas" element={<Dudas />} />
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="*" element={<p className="empty">Esta página no existe.</p>} />
        </Routes>
      </main>
    </>
  );
}

/** Indicador discreto: «Guardado» casi invisible; «Guardando…» y el error, visibles y con reintento. */
function EstadoGuardado({ estado, pendientes, error, onReintentar }: { estado: 'guardado' | 'guardando' | 'error'; pendientes: number; error?: string; onReintentar: () => void }) {
  if (estado === 'guardado') return <span className="guardado ok" role="status">Guardado</span>;
  if (estado === 'guardando') return <span className="guardado" role="status">Guardando…{pendientes > 1 ? ` (${pendientes})` : ''}</span>;
  return (
    <span className="guardado ko" role="alert">
      {error ?? 'Error al guardar'}{pendientes ? ` · ${pendientes} pendiente${pendientes > 1 ? 's' : ''}` : ''}
      {pendientes > 0 && <button onClick={onReintentar}>Reintentar</button>}
    </span>
  );
}
