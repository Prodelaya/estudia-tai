import { useEffect, useState } from 'react';
import { api, type EstadoCuenta } from '../lib/api';
import { useProgreso } from '../lib/progreso';

export function Usuarios() {
  const { usuario } = useProgreso();
  const [cuentas, setCuentas] = useState<EstadoCuenta[]>([]);
  const [enlaces, setEnlaces] = useState<Record<string, { url: string; expira: number }>>({});
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    if (usuario?.admin) api.usuarios().then(setCuentas).catch(() => setError('No se han podido cargar las cuentas.'));
  }, [usuario?.admin]);

  async function invitar(nombre: string) {
    setEnviando(true);
    setError('');
    try {
      const { token, expira } = await api.invitacion(nombre);
      setEnlaces(prev => ({ ...prev, [nombre]: { url: `${window.location.origin}/activar#${token}`, expira } }));
    } catch {
      setError('No se ha podido generar la invitación. Si la cuenta ya está activa, no se cambia su contraseña.');
    } finally {
      setEnviando(false);
    }
  }

  if (!usuario?.admin) return <p role="alert">Solo laya92 puede gestionar las invitaciones.</p>;
  return (
    <section className="stack">
      <h1>Usuarios</h1>
      <p className="note">Tu contraseña y tu progreso se conservan. Cada persona tiene su propio progreso.</p>
      <p>Envía cada enlace solo a su destinatario y por un canal privado. Caduca en 48 horas y solo puede usarse una vez. Renovarlo invalida el anterior.</p>
      {error && <p role="alert">{error}</p>}
      {cuentas.map(cuenta => <article className="panel stack" key={cuenta.nombre}>
        <h2>{cuenta.nombre}</h2>
        <p>{cuenta.activo ? 'Cuenta activa' : 'Pendiente de elegir contraseña'}</p>
        {!cuenta.activo && <button className="btn" disabled={enviando} onClick={() => invitar(cuenta.nombre)}>
          {enlaces[cuenta.nombre] ? 'Renovar invitación' : 'Generar invitación'}
        </button>}
        {enlaces[cuenta.nombre] && <label className="stack">
          <span>Enlace privado para {cuenta.nombre}</span>
          <input aria-label={`Invitación para ${cuenta.nombre}`} readOnly value={enlaces[cuenta.nombre].url} onFocus={e => e.currentTarget.select()} />
          <small>Caduca: {new Date(enlaces[cuenta.nombre].expira).toLocaleString()}</small>
        </label>}
      </article>)}
    </section>
  );
}
