import type { EstadoSrs, Letra, NotaParte, Progreso } from './tipos';

export class NoAutenticado extends Error {}
export interface UsuarioActual { nombre: string; admin: boolean }
export interface EstadoCuenta { nombre: string; activo: boolean }

let revisionSesion = 0;
const observadores = new Set<() => void>();
export function alPerderSesion(observador: () => void) {
  observadores.add(observador);
  return () => { observadores.delete(observador); };
}

async function pedir<T>(url: string, init?: RequestInit, cambiaSesion = false): Promise<T> {
  const revision = revisionSesion;
  const r = await fetch(url, {
    credentials: 'same-origin',
    ...init,
    headers: init?.body ? { 'content-type': 'application/json', ...init.headers } : init?.headers,
  });
  if (r.status === 401) {
    // Una respuesta tardía de la sesión anterior no debe cerrar la nueva.
    if (revision === revisionSesion) {
      ++revisionSesion;
      observadores.forEach(observador => observador());
    }
    throw new NoAutenticado();
  }
  if (!r.ok) throw new Error(`${r.status} ${await r.text()}`);
  const resultado = r.status === 204 ? (undefined as T) : await r.json();
  if (cambiaSesion) ++revisionSesion;
  return resultado;
}

const json = (method: string, body: unknown): RequestInit => ({ method, body: JSON.stringify(body) });

export const api = {
  login: (usuario: string, password: string) => pedir<{ ok: true }>('/api/login', json('POST', { usuario, password }), true),
  activar: (token: string, password: string) => pedir<{ ok: true }>('/api/activar', json('POST', { token, password }), true),
  yo: () => pedir<UsuarioActual>('/api/yo'),
  usuarios: () => pedir<EstadoCuenta[]>('/api/usuarios'),
  invitacion: (nombre: string) => pedir<{ token: string; expira: number }>(`/api/usuarios/${encodeURIComponent(nombre)}/invitacion`, { method: 'POST' }),
  logout: () => pedir('/api/logout', { method: 'POST' }, true),
  check: () => pedir<void>('/api/auth/check'),
  progreso: () => pedir<Progreso>('/api/progreso'),
  respuestas: (items: { pregunta_id: string; tema: number | null; elegida: Letra; acierto: boolean; origen: string }[]) =>
    pedir('/api/respuestas', json('POST', { items })),
  srs: (e: EstadoSrs) => pedir(`/api/srs/${encodeURIComponent(e.tarjeta_id)}`, json('PUT', e)),
  intento: (b: { examen_id: string; partes: string[]; notas: Record<string, NotaParte>; respuestas: Record<string, Letra>; segundos: number | null }) =>
    pedir<{ id: number }>('/api/intentos', json('POST', b)),
  marca: (id: string, b: { tema: number | null; nota: string; resuelta?: boolean }) =>
    pedir(`/api/marcas/${encodeURIComponent(id)}`, json('PUT', b)),
  borrarMarca: (id: string) => pedir(`/api/marcas/${encodeURIComponent(id)}`, { method: 'DELETE' }),
};
