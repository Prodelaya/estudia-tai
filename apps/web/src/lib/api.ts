import type { EstadoSrs, Letra, NotaParte, Progreso } from './tipos';

export class NoAutenticado extends Error {}

async function pedir<T>(url: string, init?: RequestInit): Promise<T> {
  const r = await fetch(url, {
    credentials: 'same-origin',
    ...init,
    headers: init?.body ? { 'content-type': 'application/json', ...init.headers } : init?.headers,
  });
  if (r.status === 401) throw new NoAutenticado();
  if (!r.ok) throw new Error(`${r.status} ${await r.text()}`);
  return r.status === 204 ? (undefined as T) : r.json();
}

const json = (method: string, body: unknown): RequestInit => ({ method, body: JSON.stringify(body) });

export const api = {
  login: (password: string) => pedir<{ ok: true }>('/api/login', json('POST', { password })),
  logout: () => pedir('/api/logout', { method: 'POST' }),
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
