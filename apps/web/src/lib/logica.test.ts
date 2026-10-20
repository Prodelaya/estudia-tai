import { describe, expect, it } from 'vitest';
import { corregirParte, veredicto } from './correccion';
import { programar } from './srs';
import type { Letra, ParteExamen, PreguntaExamen } from './tipos';

const op = { a: 'a', b: 'b', c: 'c', d: 'd' };
const pregunta = (n: number, extra: Partial<PreguntaExamen> = {}): PreguntaExamen =>
  ({ id: `q${extra.reserva ? 'r' : ''}${n}`, n, reserva: false, q: '', op, ok: 'a', anulada: false, tema: null, ...extra });

describe('corrección según las bases', () => {
  it('resta un tercio por error y escala a 50', () => {
    const parte: ParteExamen = { contexto: '', preguntas: Array.from({ length: 80 }, (_, i) => pregunta(i + 1)) };
    const resp: Record<string, Letra> = {};
    parte.preguntas.forEach((q, i) => { if (i < 60) resp[q.id] = 'a'; else if (i < 70) resp[q.id] = 'b'; });
    const n = corregirParte(parte, resp);
    expect([n.a, n.e, n.b]).toEqual([60, 10, 10]);
    expect(n.nota).toBe(35.42); // (60 − 10/3) × 0,625
  });

  it('las reservas sustituyen a las anuladas, en orden', () => {
    const parte: ParteExamen = {
      contexto: '',
      preguntas: [pregunta(1), pregunta(2, { anulada: true, ok: null }), pregunta(1, { reserva: true, ok: 'b' }), pregunta(2, { reserva: true })],
    };
    const n = corregirParte(parte, { q1: 'a', qr1: 'b', qr2: 'a' });
    expect(n.n).toBe(2);
    expect(n.a).toBe(2);
    expect(n.nota).toBe(50);
  });

  it('el supuesto no cuenta si no se aprueba el test', () => {
    expect(veredicto({ ej1: { a: 0, e: 0, b: 0, n: 80, nota: 20 }, b3: { a: 0, e: 0, b: 0, n: 20, nota: 40 } })).toMatch(/no se corregiría/);
  });
});

describe('repetición espaciada', () => {
  it('crece el intervalo al acertar y se reinicia al fallar', () => {
    const a = programar(undefined, 2, 't', 1, 100);
    const b = programar(a, 2, 't', 1, 101);
    const c = programar(b, 2, 't', 1, 107);
    expect([a.intervalo, b.intervalo]).toEqual([1, 6]);
    expect(c.intervalo).toBeGreaterThan(6);
    const d = programar(c, 0, 't', 1, 120);
    expect(d.intervalo).toBe(0);
    expect(d.vence).toBe(120);
    expect(d.facilidad).toBeGreaterThanOrEqual(1.3);
  });
});
