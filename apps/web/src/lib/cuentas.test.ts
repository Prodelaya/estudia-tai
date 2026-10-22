import { afterEach, expect, test, vi } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { ProveedorProgreso } from './progreso';
import { Login } from '../views/Login';
import { api, alPerderSesion, NoAutenticado } from './api';

const render = (child: ReturnType<typeof createElement>, path = '/') => renderToStaticMarkup(
  createElement(MemoryRouter, { initialEntries: [path] }, createElement(ProveedorProgreso, { children: child })),
);

test.each([
  ['respuestas', () => api.respuestas([])],
  ['srs', () => api.srs({ tarjeta_id: 'fixture', tema: 15, facilidad: 2.5, intervalo: 1, repeticiones: 1, vence: 1 })],
  ['intento', () => api.intento({ examen_id: 'fixture', partes: [], notas: {}, respuestas: {}, segundos: 0 })],
  ['marca', () => api.marca('fixture', { tema: 15, nota: 'fixture' })],
  ['borrarMarca', () => api.borrarMarca('fixture')],
  ['usuarios', () => api.usuarios()],
  ['crearUsuario', () => api.crearUsuario('nuevo')],
  ['invitacion', () => api.invitacion('nosa')],
] as const)('a 401 from %s notifies the active progress provider', async (_name, operation) => {
  vi.stubGlobal('fetch', vi.fn(async () => new Response('{}', { status: 401 })));
  const lost = vi.fn();
  const unsubscribe = alPerderSesion(lost);
  try {
    await expect(operation()).rejects.toBeInstanceOf(NoAutenticado);
    expect(lost).toHaveBeenCalledTimes(1);
  } finally { unsubscribe(); }
});

test('a late 401 from the previous session cannot invalidate a new login', async () => {
  let finishOld!: (response: Response) => void;
  const old = new Promise<Response>(resolve => { finishOld = resolve; });
  vi.stubGlobal('fetch', vi.fn().mockReturnValueOnce(old).mockResolvedValueOnce(new Response('{"ok":true}', { status: 200 })));
  const lost = vi.fn();
  const unsubscribe = alPerderSesion(lost);
  try {
    const pending = api.respuestas([]);
    await api.login('nosa', 'disposable-fixture-password');
    finishOld(new Response('{}', { status: 401 }));
    await expect(pending).rejects.toBeInstanceOf(NoAutenticado);
    expect(lost).not.toHaveBeenCalled();
  } finally { unsubscribe(); }
});

test('simultaneous 401 responses notify once, and unsubscribe removes the observer', async () => {
  vi.stubGlobal('fetch', vi.fn(async () => new Response('{}', { status: 401 })));
  const lost = vi.fn();
  const unsubscribe = alPerderSesion(lost);
  try {
    await Promise.allSettled([api.respuestas([]), api.borrarMarca('fixture')]);
    expect(lost).toHaveBeenCalledTimes(1);
    unsubscribe();
    await expect(api.usuarios()).rejects.toBeInstanceOf(NoAutenticado);
    expect(lost).toHaveBeenCalledTimes(1);
  } finally { unsubscribe(); }
});

afterEach(() => vi.unstubAllGlobals());

test('account creation sends only its name to the owner endpoint', async () => {
  const fetch = vi.fn(async () => new Response('{"nombre":"nuevo","activo":false,"token":"fixture","expira":1}', { status: 201 }));
  vi.stubGlobal('fetch', fetch);
  await api.crearUsuario('nuevo');
  const [url, init] = fetch.mock.calls[0] as unknown as [string, RequestInit];
  expect(url).toBe('/api/usuarios');
  expect(init.method).toBe('POST');
  expect(JSON.parse(String(init.body))).toEqual({ nombre: 'nuevo' });
});

test('login includes explicit account identity and keeps the owner default', () => {
  const html = render(createElement(Login));
  expect(html).toContain('autoComplete="username"');
  expect(html).toContain('value="laya92"');
  expect(html).toContain('autoComplete="current-password"');
});

test('credentials and activation token are sent in JSON bodies, never URLs', async () => {
  const fetch = vi.fn(async () => new Response(JSON.stringify({ ok: true }), { status: 200 }));
  vi.stubGlobal('fetch', fetch);
  await api.login('nosa', 'disposable-fixture-password');
  const [loginUrl, loginInit] = fetch.mock.calls[0] as unknown as [string, RequestInit];
  expect(loginUrl).toBe('/api/login');
  expect(JSON.parse(String(loginInit.body))).toEqual({ usuario: 'nosa', password: 'disposable-fixture-password' });
  const token = 'x'.repeat(43);
  await api.activar(token, 'disposable-fixture-password');
  const [activateUrl, activateInit] = fetch.mock.calls[1] as unknown as [string, RequestInit];
  expect(activateUrl).toBe('/api/activar');
  expect(activateUrl).not.toContain(token);
  expect(JSON.parse(String(activateInit.body))).toEqual({ token, password: 'disposable-fixture-password' });
});

test('activation uses new-password confirmation without rendering the fragment secret', async () => {
  const { Activar } = await import('../views/Activar');
  const token = 'x'.repeat(43);
  const html = render(createElement(Activar), `/activar#${token}`);
  expect(html).not.toContain(token);
  expect(html.match(/autoComplete="new-password"/g)).toHaveLength(2);
  expect(html).toContain('Crear mi contraseña');
  expect(html).toContain('12');
});

test('activation without an invitation does not offer an open registration form', async () => {
  const { Activar } = await import('../views/Activar');
  const html = render(createElement(Activar), '/activar');
  expect(html).toContain('invitación');
  expect(html).not.toContain('type="password"');
});
