import { useState, type FormEvent } from 'react';
import { api } from '../lib/api';
import { useProgreso } from '../lib/progreso';

export function Login() {
  const { recargar } = useProgreso();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function entrar(e: FormEvent) {
    e.preventDefault();
    setEnviando(true);
    setError('');
    try {
      await api.login(password);
      await recargar();
    } catch {
      setError('Contraseña incorrecta (o demasiados intentos: espera unos minutos).');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className="wrap" style={{ maxWidth: 420, paddingTop: '18vh' }}>
      <form className="panel stack" onSubmit={entrar}>
        <h1>Estudia TAI</h1>
        <label className="stack" style={{ gap: 6 }}>
          <span className="note">Contraseña</span>
          <input type="password" autoComplete="current-password" autoFocus value={password} onChange={e => setPassword(e.target.value)} />
        </label>
        {error && <p className="chip ko" role="alert" style={{ whiteSpace: 'normal' }}>{error}</p>}
        <button className="btn" disabled={!password || enviando}>Entrar</button>
      </form>
    </main>
  );
}
