import { useEffect, useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useProgreso } from '../lib/progreso';

export function Activar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { recargar } = useProgreso();
  const [token] = useState(() => location.hash.slice(1));
  const [password, setPassword] = useState('');
  const [confirmacion, setConfirmacion] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);
  useEffect(() => {
    // El fragmento nunca se envía al servidor; retirarlo también del historial visible.
    if (location.hash) navigate('/activar', { replace: true });
  }, [location.hash, navigate]);

  async function activar(e: FormEvent) {
    e.preventDefault();
    if (password !== confirmacion) { setError('Las contraseñas no coinciden.'); return; }
    setEnviando(true);
    setError('');
    try {
      await api.activar(token, password);
      setPassword('');
      setConfirmacion('');
      await recargar();
      navigate('/', { replace: true });
    } catch {
      setError('No se ha podido activar la cuenta. Usa entre 12 y 200 caracteres; si el enlace caducó o ya se usó, pide uno nuevo a laya92.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className="wrap" style={{ maxWidth: 460, paddingTop: '12vh' }}>
      <section className="panel stack">
        <h1>Activa tu cuenta</h1>
        {!/^[A-Za-z0-9_-]{43}$/.test(token) ? <>
          <p>Necesitas una invitación privada válida de laya92. No hay registro público.</p>
          <Link to="/">Volver al acceso</Link>
        </> : <form className="stack" onSubmit={activar}>
          <p className="note">Elige tu propia contraseña, de 12 a 200 caracteres. Tu progreso será independiente.</p>
          <label className="stack">Contraseña
            <input type="password" autoComplete="new-password" minLength={12} maxLength={200} required value={password} onChange={e => setPassword(e.target.value)} />
          </label>
          <label className="stack">Repite la contraseña
            <input type="password" autoComplete="new-password" minLength={12} maxLength={200} required value={confirmacion} onChange={e => setConfirmacion(e.target.value)} />
          </label>
          {error && <p role="alert">{error}</p>}
          <button className="btn" disabled={enviando || !password || !confirmacion}>Crear mi contraseña</button>
        </form>}
      </section>
    </main>
  );
}
