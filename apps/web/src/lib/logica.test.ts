import { describe, expect, it } from 'vitest';
import { corregirParte, resumen, valorar } from './correccion';
import { ColaEscrituras, type Almacen, type Escritura } from './cola';
import { ErrorHttp, NoAutenticado } from './api';
import { borrarExamen, guardarExamen, leerExamen, restante } from './examenGuardado';
import { sumarRespuesta } from './progreso';
import { MARGEN_RETENCION_MS, motivoRepaso } from './repaso';
import { programar } from './srs';
import type { Letra, ParteExamen, PreguntaExamen, ResumenPregunta } from './tipos';

const op = { a: 'a', b: 'b', c: 'c', d: 'd' };
const pregunta = (n: number, extra: Partial<PreguntaExamen> = {}): PreguntaExamen =>
  ({ id: `q${extra.reserva ? 'r' : ''}${n}`, n, reserva: false, q: '', op, ok: 'a', anulada: false, tema: null, ...extra });
const nombre = (p: string) => (p === 'ej1' ? 'Test' : 'Supuesto');

describe('corrección según las bases', () => {
  it('resta un tercio por error y da la neta y una nota orientativa sobre 50', () => {
    const parte: ParteExamen = { contexto: '', preguntas: Array.from({ length: 80 }, (_, i) => pregunta(i + 1)) };
    const resp: Record<string, Letra> = {};
    parte.preguntas.forEach((q, i) => { if (i < 60) resp[q.id] = 'a'; else if (i < 70) resp[q.id] = 'b'; });
    const n = corregirParte(parte, resp);
    expect([n.a, n.e, n.b, n.total]).toEqual([60, 10, 10, 80]);
    expect(n.neta).toBe(56.67);
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

  it('sin corte publicado no afirma aprobar ni suspender', () => {
    const lineas = resumen({ ej1: { a: 50, e: 9, b: 21, n: 80, total: 80, neta: 47, nota: 29.38 }, b3: { a: 0, e: 0, b: 20, n: 20, nota: 0 } }, {}, nombre);
    const texto = lineas.join(' ');
    expect(texto).not.toMatch(/aprueb|suspend/i);
    expect(lineas[0]).toMatch(/neta 47,00 de 80 \(59 %\).*Sin corte oficial.*7,00 por encima/);
    expect(lineas[1]).toMatch(/neta 0,00 de 20/);
    expect(lineas.at(-1)).toMatch(/solo se corrige si superas el corte del test/);
  });

  it('con un corte oficial documentado da el margen y, si la fuente lo respalda, la nota transformada', () => {
    const n = { a: 50, e: 9, b: 21, n: 80, total: 80, neta: 47, nota: 29.38 };
    const v = valorar(n, { corte_directa: 40, transformacion_lineal: true, fuente: 'acta', oficial: true });
    expect(v.corte?.margen).toBe(7);
    expect(v.corte?.transformada).toBe(29.38); // 25 + 7 × 25/40
    expect(valorar(n, { corte_directa: 50, transformacion_lineal: true, fuente: 'acta', oficial: true }).corte?.transformada).toBeUndefined();
    expect(valorar(n, { corte_directa: 40, fuente: 'academia', oficial: false }).corte?.transformada).toBeUndefined();
    expect(resumen({ ej1: n }, { ej1: { corte_directa: 40, fuente: 'acta', oficial: true } }, nombre)[0]).toMatch(/corte oficial .* 40,00: estarías 7,00 por encima/);
  });

  it('reconstruye la neta de intentos guardados antes del cambio', () => {
    expect(valorar({ a: 30, e: 6, b: 4, n: 40, nota: 35 })).toMatchObject({ neta: 28, total: 40, pct: 70 });
  });
});

describe('repaso y retención', () => {
  const base: ResumenPregunta = { pregunta_id: 'p', tema: 1, vistas: 1, aciertos: 0, ultima: 0, ts: 0 };
  const DIA = MARGEN_RETENCION_MS;
  it('fallos y blancos vuelven siempre', () => {
    expect(motivoRepaso(base, 1)).toBe('fallada');
    expect(motivoRepaso({ ...base, blanco: 1 }, 1)).toBe('blanco');
  });
  it('una pregunta acertada siempre no vuelve', () => {
    expect(motivoRepaso({ ...base, aciertos: 2, vistas: 2, ultima: 1, racha: 2, ts_racha: 0, ts: 10 }, 10 * DIA)).toBeNull();
  });
  it('tras un fallo, el acierto se comprueba al día siguiente y sale con dos aciertos separados', () => {
    let p = sumarRespuesta(undefined, { pregunta_id: 'p', tema: 1, elegida: 'b', acierto: false, origen: 'test', modo: 'practica', ts: 0 });
    expect(p.primera).toBe(0);
    p = sumarRespuesta(p, { pregunta_id: 'p', tema: 1, elegida: 'a', acierto: true, origen: 'repaso', modo: 'practica', ts: 1000 });
    expect(motivoRepaso(p, 2000)).toBeNull(); // recién acertada: hoy no
    expect(motivoRepaso(p, 1000 + DIA)).toBe('confirmar');
    p = sumarRespuesta(p, { pregunta_id: 'p', tema: 1, elegida: 'a', acierto: true, origen: 'repaso', modo: 'practica', ts: 1000 + DIA });
    expect([p.racha, p.ts_racha]).toEqual([2, 1000]);
    expect(motivoRepaso(p, 1000 + 5 * DIA)).toBeNull();
    // Dos aciertos el mismo día no bastan.
    let q = sumarRespuesta({ ...base }, { pregunta_id: 'p', tema: 1, elegida: 'a', acierto: true, origen: 'test', modo: 'practica', ts: 100 });
    q = sumarRespuesta(q, { pregunta_id: 'p', tema: 1, elegida: 'a', acierto: true, origen: 'test', modo: 'practica', ts: 200 });
    expect(motivoRepaso(q, 200 + DIA)).toBe('confirmar');
  });
  it('un blanco corta la racha', () => {
    const p = sumarRespuesta({ ...base, vistas: 3, aciertos: 2, ultima: 1, racha: 2, ts_racha: 0, ts: DIA }, { pregunta_id: 'p', tema: 1, elegida: null, acierto: false, origen: 'examen', modo: 'simulacro', ts: 3 * DIA });
    expect([p.racha, p.ts_racha, p.blanco, p.ultima]).toEqual([0, null, 1, 0]);
    expect(motivoRepaso(p, 3 * DIA)).toBe('blanco');
  });
});

class Memoria implements Almacen {
  m = new Map<string, string>();
  getItem(k: string) { return this.m.get(k) ?? null; }
  setItem(k: string, v: string) { this.m.set(k, v); }
  removeItem(k: string) { this.m.delete(k); }
}
const srs = (id: string): Escritura => ({ tipo: 'srs', e: { tarjeta_id: id, tema: 1, facilidad: 2.5, intervalo: 1, repeticiones: 1, vence: 1 } });

describe('cola de escrituras', () => {
  it('envía en orden y avisa del estado', async () => {
    const enviadas: string[] = [];
    const estados: string[] = [];
    const c = new ColaEscrituras(async e => { enviadas.push(e.tipo === 'srs' ? e.e.tarjeta_id : e.tipo); }, new Memoria(), e => estados.push(e.estado));
    c.usar('nosa');
    await Promise.all([c.encolar(srs('1')), c.encolar(srs('2'))]);
    expect(enviadas).toEqual(['1', '2']);
    expect(estados.at(-1)).toBe('guardado');
  });

  it('si falla la red conserva lo pendiente en el navegador, por usuario, y lo envía al volver', async () => {
    const almacen = new Memoria();
    let red = false;
    const enviadas: string[] = [];
    const estados: { estado: string; pendientes: number }[] = [];
    const ejecutar = async (e: Escritura) => { if (!red) throw new TypeError('Failed to fetch'); enviadas.push(e.tipo === 'srs' ? e.e.tarjeta_id : e.tipo); };
    const c = new ColaEscrituras(ejecutar, almacen, e => estados.push(e));
    c.usar('nosa');
    expect(await c.encolar(srs('1'))).toBe(false);
    expect(await c.encolar(srs('2'))).toBe(false);
    expect(estados.at(-1)).toMatchObject({ estado: 'error', pendientes: 2 });
    expect(JSON.parse(almacen.getItem('estudia-tai:pendientes:nosa')!)).toHaveLength(2);
    // Otro usuario en el mismo navegador no ve ni envía lo de nosa.
    c.usar('jota');
    expect(c.pendientes).toBe(0);
    // Al volver nosa (p. ej. tras recargar), se recupera y se envía.
    red = true;
    const otra = new ColaEscrituras(ejecutar, almacen, () => {});
    otra.usar('nosa');
    expect(otra.pendientes).toBe(2);
    expect(await otra.vaciar()).toBe(true);
    expect(enviadas).toEqual(['1', '2']);
    expect(almacen.getItem('estudia-tai:pendientes:nosa')).toBeNull();
  });

  it('una escritura rechazada (4xx) se descarta sin bloquear las siguientes; un 401 se conserva', async () => {
    const enviadas: string[] = [];
    let estado = '';
    const c = new ColaEscrituras(async e => {
      const id = e.tipo === 'srs' ? e.e.tarjeta_id : '';
      if (id === 'mala') throw new ErrorHttp(400, 'bad');
      if (id === 'sin-sesion') throw new NoAutenticado();
      enviadas.push(id);
    }, new Memoria(), e => { estado = `${e.estado}:${e.pendientes}`; });
    c.usar('nosa');
    await c.encolar(srs('mala'));
    await c.encolar(srs('buena'));
    expect(enviadas).toEqual(['buena']);
    expect(await c.encolar(srs('sin-sesion'))).toBe(false);
    expect(estado).toBe('error:1');
  });
});

describe('autoguardado del examen', () => {
  it('guarda por usuario y examen, y calcula el tiempo que queda aunque la pestaña estuviera cerrada', () => {
    const a = new Memoria();
    const g = { v: 1 as const, config: { partes: ['ej1'], modo: 'examen' as const, minutos: 120 }, resp: { q1: 'a' as Letra }, i: 3, inicio: 0, cliente_id: 'x'.repeat(10) };
    guardarExamen('nosa', 'LI_2025', g, a);
    expect(leerExamen('jota', 'LI_2025', a)).toBeNull();
    expect(leerExamen('nosa', 'LI_2025', a)).toEqual(g);
    expect(restante(g, 60 * 60_000)).toBe(60 * 60_000);
    expect(restante(g, 121 * 60_000)).toBeLessThan(0);
    expect(restante({ ...g, config: { ...g.config, minutos: 0 } }, 1e12)).toBe(Infinity);
    borrarExamen('nosa', 'LI_2025', a);
    expect(leerExamen('nosa', 'LI_2025', a)).toBeNull();
    a.setItem('estudia-tai:examen:nosa:LI_2024', '{roto');
    expect(leerExamen('nosa', 'LI_2024', a)).toBeNull();
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
