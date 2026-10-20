import { expect, test, vi } from 'vitest';
import { Children, isValidElement, type ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Usuarios } from './Usuarios';

const fixture = vi.hoisted(() => ({ index: 0, state: [] as unknown[], invite: vi.fn() }));
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
vi.mock('../lib/progreso', () => ({ useProgreso: () => ({ usuario: { nombre: 'laya92', admin: true } }) }));
vi.mock('../lib/api', () => ({ api: { invitacion: fixture.invite } }));

function invitationButton(node: ReactNode): (() => Promise<void>) | undefined {
  for (const child of Children.toArray(node)) {
    if (!isValidElement<{ children?: ReactNode; onClick?: () => Promise<void> }>(child)) continue;
    if (child.type === 'button') return child.props.onClick;
    const found = invitationButton(child.props.children);
    if (found) return found;
  }
}

test('uncertain renewal removes the old link immediately and preserves other invitations', async () => {
  const previous = { url: 'https://fixture.invalid/activar#old-fixture', expira: 1 };
  const other = { url: 'https://fixture.invalid/activar#other-fixture', expira: 1 };
  fixture.index = 0;
  fixture.state = [[{ nombre: 'nosa', activo: false }], { nosa: previous, jota: other }, false, ''];
  fixture.invite.mockRejectedValueOnce(new Error('simulated lost response'));
  const view = Usuarios();
  expect(renderToStaticMarkup(view)).toContain('type="text"');
  const click = invitationButton(view);
  expect(click).toBeTypeOf('function');
  const pending = click!();
  const whilePending = fixture.state[1];
  await pending;
  expect(whilePending).not.toHaveProperty('nosa');
  expect(fixture.state[1]).not.toHaveProperty('nosa');
  expect(fixture.state[1]).toHaveProperty('jota', other);
  expect(fixture.state[3]).not.toBe('');
});
