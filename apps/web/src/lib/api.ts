import type { EstadoSrs, Letra, Modo, NotaParte, Progreso } from './tipos';

/** cliente_id hace idempotente el envío: un reintento de algo que ya llegó no se duplica. */
export interface ItemRespuesta { pregunta_id: string; tema: number | null; elegida: Letra | null; acierto: boolean; origen: string; modo: Modo; ts: number; cliente_id: string }
export interface CuerpoIntento {
  examen_id: string; partes: string[]; notas: Record<string, NotaParte>; respuestas: Record<string, Letra>; segundos: number | null;
  modo: Modo; limite: number | null; cliente_id: string; ts: number;
}

export class NoAutenticado extends Error {}
/** Respuesta HTTP de error distinta de 401: un 4xx no se arregla reintentando. */
export class ErrorHttp extends Error {
  constructor(readonly status: number, mensaje: string) { super(mensaje); }
}
export interface UsuarioActual { nombre: string; admin: boolean }
export interface EstadoCuenta { nombre: string; activo: boolean }

let revisionSesion = 0;
const observadores = new Set<() => void>();
export function alPerderSesion(observador: () => void) {
  observadores.add(observador);
  return () => { observadores.delete(observador); };
}

const LIMITE_MS = 30_000;

async function pedir<T>(url: string, init?: RequestInit, cambiaSesion = false): Promise<T> {
  const revision = revisionSesion;
  const r = await fetch(url, {
    credentials: 'same-origin',
    // Una petición colgada no debe dejar la cola o la pantalla esperando para siempre.
    signal: typeof AbortSignal.timeout === 'function' ? AbortSignal.timeout(LIMITE_MS) : undefined,
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
  if (!r.ok) throw new ErrorHttp(r.status, `${r.status} ${await r.text()}`);
  const resultado = r.status === 204 ? (undefined as T) : await r.json();
  if (cambiaSesion) ++revisionSesion;
  return resultado;
}

const json = (method: string, body: unknown, usuario?: string): RequestInit =>
  ({ method, body: JSON.stringify(body), headers: usuario ? { 'x-estudia-usuario': usuario } : undefined });

export const api = {
  login: (usuario: string, password: string) => pedir<{ ok: true }>('/api/login', json('POST', { usuario, password }), true),
  activar: (token: string, password: string) => pedir<{ ok: true }>('/api/activar', json('POST', { token, password }), true),
  yo: () => pedir<UsuarioActual>('/api/yo'),
  usuarios: () => pedir<EstadoCuenta[]>('/api/usuarios'),
  crearUsuario: (nombre: string) => pedir<EstadoCuenta & { token: string; expira: number }>('/api/usuarios', json('POST', { nombre })),
  invitacion: (nombre: string) => pedir<{ token: string; expira: number }>(`/api/usuarios/${encodeURIComponent(nombre)}/invitacion`, { method: 'POST' }),
  logout: () => pedir('/api/logout', { method: 'POST' }, true),
  check: () => pedir<void>('/api/auth/check'),
  progreso: () => pedir<Progreso>('/api/progreso'),
  // Las escrituras llevan el usuario dueño: si la cookie ya es de otra cuenta, el servidor responde 401.
  respuestas: (items: ItemRespuesta[], usuario?: string) => pedir('/api/respuestas', json('POST', { items }, usuario)),
  srs: (e: EstadoSrs, usuario?: string, ts?: number) => pedir(`/api/srs/${encodeURIComponent(e.tarjeta_id)}`, json('PUT', { ...e, ts }, usuario)),
  intento: (b: CuerpoIntento, usuario?: string) => pedir<{ id: number }>('/api/intentos', json('POST', b, usuario)),
  marca: (id: string, b: { tema: number | null; nota: string; resuelta?: boolean }, usuario?: string) =>
    pedir(`/api/marcas/${encodeURIComponent(id)}`, json('PUT', b, usuario)),
  borrarMarca: (id: string, usuario?: string) =>
    pedir(`/api/marcas/${encodeURIComponent(id)}`, { method: 'DELETE', headers: usuario ? { 'x-estudia-usuario': usuario } : undefined }),
};
