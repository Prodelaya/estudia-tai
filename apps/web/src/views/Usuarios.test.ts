import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { Children, isValidElement, type ReactNode, type ReactElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Usuarios } from './Usuarios';

const fixture = vi.hoisted(() => ({ index: 0, state: [] as unknown[], admin: true, invite: vi.fn(), create: vi.fn(), list: vi.fn() }));
vi.mock('react', async importOriginal => ({
  ...await importOriginal<typeof import('react')>(),
  useState(initial: unknown) {
    const index = fixture.index++;
    if (!(index in fixture.state)) fixture.state[index] = initial;
    return [fixture.state[index], (value: unknown) => {
      fixture.state[index] = typeof value === 'function' ? value(fixture.state[index]) : value;
    }];
  },
  useEffect() {},
}));
vi.mock('../lib/progreso', () => ({ useProgreso: () => ({ usuario: { nombre: fixture.admin ? 'laya92' : 'nosa', admin: fixture.admin } }) }));
vi.mock('../lib/api', () => ({ api: { invitacion: fixture.invite, crearUsuario: fixture.create, usuarios: fixture.list } }));

interface Props { children?: ReactNode; onClick?: () => Promise<void>; onSubmit?: (e: { preventDefault(): void }) => Promise<void> }
function find(node: ReactNode, tag: string, text?: string): ReactElement<Props> | undefined {
  for (const child of Children.toArray(node)) {
    if (!isValidElement<Props>(child)) continue;
    if (child.type === tag && (!text || child.props.children === text)) return child;
    const found = find(child.props.children, tag, text);
    if (found) return found;
  }
}
const draw = () => { fixture.index = 0; return Usuarios(); };
const submit = () => {
  const handler = find(draw(), 'form')?.props.onSubmit;
  expect(handler).toBeTypeOf('function');
  return handler!({ preventDefault() {} });
};

beforeEach(() => {
  fixture.state = [[], {}, false, '', ''];
  fixture.admin = true;
  fixture.invite.mockReset();
  fixture.create.mockReset();
  fixture.list.mockReset().mockResolvedValue([]);
});
afterEach(() => vi.unstubAllGlobals());

test('uncertain renewal removes the old link immediately and preserves other invitations', async () => {
  const previous = { url: 'https://fixture.invalid/activar#old-fixture', expira: 1 };
  const other = { url: 'https://fixture.invalid/activar#other-fixture', expira: 1 };
  fixture.state[0] = [{ nombre: 'nosa', activo: false }];
  fixture.state[1] = { nosa: previous, jota: other };
  fixture.invite.mockRejectedValueOnce(new Error('simulated lost response'));
  const view = draw();
  expect(renderToStaticMarkup(view)).toContain('type="text"');
  const click = find(view, 'button', 'Renovar invitación')?.props.onClick;
  expect(click).toBeTypeOf('function');
  const pending = click!();
  const whilePending = fixture.state[1];
  await pending;
  expect(whilePending).not.toHaveProperty('nosa');
  expect(fixture.state[1]).not.toHaveProperty('nosa');
  expect(fixture.state[1]).toHaveProperty('jota', other);
  expect(fixture.state[3]).not.toBe('');
});

test('only the owner sees the creation form with username rules and no password field', () => {
  const html = renderToStaticMarkup(draw());
  expect(html).toContain('Crear usuario y generar invitación');
  expect(html).toContain('minLength="3"');
  expect(html).toContain('maxLength="32"');
  expect(html).not.toContain('type="password"');
  fixture.admin = false;
  expect(find(draw(), 'form')).toBeUndefined();
  expect(fixture.create).not.toHaveBeenCalled();
});

test('username pattern compiles in HTML UnicodeSets mode and validates whole names', () => {
  const html = renderToStaticMarkup(draw());
  const pattern = /pattern="([^"]+)"/.exec(html)?.[1];
  expect(pattern).toBeDefined();
  const matches = new RegExp(`^(?:${pattern})$`, 'v');
  for (const value of ['nuevo_1', 'persona-2', 'constructor']) expect(matches.test(value)).toBe(true);
  for (const value of ['a b', 'abc\n', '_nuevo', 'ábc', 'ab', 'a'.repeat(33)]) expect(matches.test(value)).toBe(false);
});

test('successful creation adds the pending account and private fragment link', async () => {
  vi.stubGlobal('window', { location: { origin: 'https://fixture.invalid' } });
  const token = 'x'.repeat(43);
  fixture.state[4] = 'nuevo';
  fixture.state[1] = { nosa: { url: 'existing-fixture' } };
  fixture.create.mockResolvedValue({ nombre: 'nuevo', activo: false, token, expira: 123 });
  await submit();
  expect(fixture.create).toHaveBeenCalledWith('nuevo');
  expect(fixture.state[0]).toContainEqual({ nombre: 'nuevo', activo: false });
  expect(fixture.state[1]).toHaveProperty('nuevo', { url: `https://fixture.invalid/activar#${token}`, expira: 123 });
  expect(fixture.state[1]).toHaveProperty('nosa', { url: 'existing-fixture' });
  expect(fixture.state[4]).toBe('');
  expect(fixture.state[2]).toBe(false);
});

test('uncertain creation refreshes pending accounts without retrying or inventing a link', async () => {
  fixture.state[4] = 'nuevo';
  fixture.create.mockRejectedValue(new Error('simulated lost response'));
  fixture.list.mockResolvedValue([{ nombre: 'nuevo', activo: false }]);
  await submit();
  expect(fixture.create).toHaveBeenCalledTimes(1);
  expect(fixture.state[0]).toContainEqual({ nombre: 'nuevo', activo: false });
  expect(fixture.state[1]).not.toHaveProperty('nuevo');
  expect(fixture.state[3]).not.toBe('');
  expect(fixture.state[2]).toBe(false);
});

test('a valid username cannot inherit a private link from Object.prototype', () => {
  fixture.state[0] = [{ nombre: 'constructor', activo: false }];
  const html = renderToStaticMarkup(draw());
  expect(html).not.toContain('Enlace privado para');
  expect(html).not.toContain('Renovar invitación');
  expect(html).toContain('Generar invitación');
});
