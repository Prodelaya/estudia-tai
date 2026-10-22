import { useEffect, useState, type FormEvent } from 'react';
import { api, type EstadoCuenta } from '../lib/api';
import { useProgreso } from '../lib/progreso';

export function Usuarios() {
  const { usuario } = useProgreso();
  const [cuentas, setCuentas] = useState<EstadoCuenta[]>([]);
  const [enlaces, setEnlaces] = useState<Record<string, { url: string; expira: number }>>({});
  const [enviando, setEnviando] = useState(true);
  const [error, setError] = useState('');
  const [nombre, setNombre] = useState('');
  useEffect(() => {
    if (usuario?.admin) api.usuarios().then(setCuentas)
      .catch(() => setError('No se han podido cargar las cuentas.'))
      .finally(() => setEnviando(false));
  }, [usuario?.admin]);

  function guardarEnlace(cuenta: string, invitacion: { token: string; expira: number }) {
    setEnlaces(prev => ({ ...prev, [cuenta]: { url: `${window.location.origin}/activar#${invitacion.token}`, expira: invitacion.expira } }));
  }

  async function crear(e: FormEvent) {
    e.preventDefault();
    setEnviando(true);
    setError('');
    try {
      const cuenta = await api.crearUsuario(nombre.trim());
      setCuentas(prev => [...prev, { nombre: cuenta.nombre, activo: cuenta.activo }]);
      guardarEnlace(cuenta.nombre, cuenta);
      setNombre('');
    } catch {
      setError('No se ha podido confirmar el alta. Si aparece en la lista, genera una nueva invitación; si no, vuelve a intentarlo.');
      try { setCuentas(await api.usuarios()); }
      catch { setError('No se ha podido confirmar el alta ni actualizar la lista. Recarga la página antes de intentarlo otra vez.'); }
    } finally {
      setEnviando(false);
    }
  }

  async function invitar(nombre: string) {
    setEnviando(true);
    setError('');
    setEnlaces(prev => {
      const siguientes = { ...prev };
      delete siguientes[nombre];
      return siguientes;
    });
    try {
      guardarEnlace(nombre, await api.invitacion(nombre));
    } catch {
      setError('No se ha podido confirmar la invitación. Vuelve a generarla o recarga esta página si la cuenta ya está activa.');
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
      <form className="panel stack" onSubmit={crear} aria-busy={enviando}>
        <label className="stack">
          <span>Nombre del nuevo usuario</span>
          <input type="text" value={nombre} onChange={e => setNombre(e.target.value.toLowerCase())}
            minLength={3} maxLength={32} pattern="[a-z0-9][a-z0-9_-]{2,31}" autoCapitalize="none" spellCheck={false}
            aria-describedby="reglas-usuario" required disabled={enviando} />
        </label>
        <small id="reglas-usuario">De 3 a 32 caracteres: minúsculas, números, guion o guion bajo. Empieza por letra o número.</small>
        <button className="btn" type="submit" disabled={enviando}>Crear usuario y generar invitación</button>
      </form>
      {cuentas.map(cuenta => <article className="panel stack" key={cuenta.nombre}>
        <h2>{cuenta.nombre}</h2>
        <p>{cuenta.activo ? 'Cuenta activa' : 'Pendiente de elegir contraseña'}</p>
        {!cuenta.activo && <button className="btn" disabled={enviando} onClick={() => invitar(cuenta.nombre)}>
          {Object.hasOwn(enlaces, cuenta.nombre) ? 'Renovar invitación' : 'Generar invitación'}
        </button>}
        {Object.hasOwn(enlaces, cuenta.nombre) && <label className="stack">
          <span>Enlace privado para {cuenta.nombre}</span>
          <input type="text" aria-label={`Invitación para ${cuenta.nombre}`} readOnly value={enlaces[cuenta.nombre].url} onFocus={e => e.currentTarget.select()} />
          <small>Caduca: {new Date(enlaces[cuenta.nombre].expira).toLocaleString()}</small>
        </label>}
      </article>)}
    </section>
  );
}
