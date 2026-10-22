import { ErrorHttp, NoAutenticado, type CuerpoIntento, type ItemRespuesta } from './api';
import type { EstadoSrs } from './tipos';

export type Escritura =
  | { tipo: 'respuestas'; items: ItemRespuesta[] }
  | { tipo: 'srs'; e: EstadoSrs }
  | { tipo: 'intento'; cuerpo: CuerpoIntento };

interface Entrada { id: string; op: Escritura }

/** Qué pasó con una escritura: enviada, rechazada por el servidor (4xx) o pendiente de reintento. */
export type Resultado = 'ok' | 'rechazado' | 'pendiente';

export interface EstadoGuardado {
  estado: 'guardado' | 'guardando' | 'error';
  pendientes: number;
  error?: string;
}

/** Almacén mínimo: localStorage en el navegador, un Map en las pruebas. */
export interface Almacen { getItem(k: string): string | null; setItem(k: string, v: string): void; removeItem(k: string): void }

export function almacenNavegador(): Almacen | null {
  try { return typeof localStorage === 'undefined' ? null : localStorage; } catch { return null; }
}

export function nuevoId() {
  try { return crypto.randomUUID(); } catch { return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`; }
}

type Bloqueo = <T>(nombre: string, f: () => Promise<T>) => Promise<T>;
/** Web Locks: una sola pestaña envía a la vez la cola de un usuario. Sin soporte, se envía sin bloqueo. */
function bloqueoNavegador(): Bloqueo {
  const locks = typeof navigator !== 'undefined' ? (navigator as Navigator & { locks?: LockManager }).locks : undefined;
  return locks ? (nombre, f) => locks.request(nombre, f) as Promise<Awaited<ReturnType<typeof f>>> : (_nombre, f) => f();
}

/**
 * Cola de escrituras al servidor. Las respuestas, tarjetas e intentos se pintan al momento y se mandan en orden.
 * La lista vive en localStorage (por usuario) y es la misma para todas las pestañas, así que lo que no se pudo
 * enviar sobrevive a una recarga. Cada escritura lleva un id y las respuestas e intentos su cliente_id, de modo
 * que un reintento de algo que ya llegó no se duplica. Un 4xx distinto de 401 no se arregla reintentando: se
 * descarta esa escritura para no bloquear las siguientes y se avisa.
 */
export class ColaEscrituras {
  private usuario: string | null = null;
  private generacion = 0;
  private memoria: Entrada[] = [];
  private enCurso: { gen: number; p: Promise<boolean>; siguiente?: Promise<boolean> } | null = null;
  private esperando = new Map<string, (r: Resultado) => void>();
  /** Envíos empezados: recargar() lo usa para saber si una escritura cruzó su lectura del servidor. */
  envios = 0;

  constructor(
    private readonly ejecutar: (e: Escritura, usuario: string) => Promise<unknown>,
    private readonly almacen: Almacen | null,
    private readonly avisar: (e: EstadoGuardado) => void,
    private readonly bloqueo: Bloqueo = bloqueoNavegador(),
  ) {}

  private get clave() { return this.usuario ? `estudia-tai:pendientes:${this.usuario}` : null; }

  private leer(): Entrada[] {
    if (!this.clave) return [];
    if (this.almacen) {
      try {
        const v = JSON.parse(this.almacen.getItem(this.clave) ?? '[]');
        if (Array.isArray(v)) return v.filter(x => x && typeof x.id === 'string' && x.op);
        return [];
      } catch { /* almacenamiento roto o inaccesible: se usa la memoria */ }
    }
    return this.memoria;
  }

  private escribir(lista: Entrada[]) {
    this.memoria = lista;
    if (!this.clave || !this.almacen) return;
    try {
      if (lista.length) this.almacen.setItem(this.clave, JSON.stringify(lista));
      else this.almacen.removeItem(this.clave);
    } catch { /* sin almacenamiento local: la cola sigue en memoria */ }
  }

  get pendientes() { return this.leer().length; }
  get ocupada() { return this.enCurso !== null; }

  /** Escrituras aún no enviadas, para superponerlas al progreso que devuelve el servidor. */
  pendientesDe<T extends Escritura['tipo']>(tipo: T): Extract<Escritura, { tipo: T }>[] {
    return this.leer().map(e => e.op).filter((op): op is Extract<Escritura, { tipo: T }> => op.tipo === tipo);
  }

  /** Cambia de usuario: lo pendiente de su última sesión en este navegador se recupera de su clave. */
  usar(usuario: string | null) {
    if (usuario === this.usuario) return;
    this.generacion++;
    this.usuario = usuario;
    this.memoria = [];
    for (const r of this.esperando.values()) r('pendiente');
    this.esperando.clear();
    const n = this.pendientes;
    this.fijar(n ? { estado: 'error', pendientes: n, error: 'Quedaron datos sin guardar de la última vez' } : { estado: 'guardado', pendientes: 0 });
  }

  encolar(op: Escritura): Promise<Resultado> {
    if (!this.clave) return Promise.resolve('pendiente');
    const id = nuevoId();
    this.escribir([...this.leer(), { id, op }]);
    const r = new Promise<Resultado>(res => this.esperando.set(id, res));
    void this.vaciar();
    return r;
  }

  /** Envía lo pendiente, en orden. Devuelve true si la cola del usuario actual queda vacía. */
  vaciar(): Promise<boolean> {
    const gen = this.generacion;
    if (this.enCurso?.gen === gen) {
      // Ya hay un envío en marcha: al terminar se repite una vez para recoger lo que haya entrado mientras tanto
      // (también tras un error de red, porque una escritura nueva merece un intento nuevo).
      const actual = this.enCurso;
      actual.siguiente ??= actual.p.then(() => this.vaciar());
      return actual.siguiente;
    }
    // Si hay un envío de otro usuario en marcha, el nuevo espera a que termine (no se mezclan).
    const previo = this.enCurso?.p.catch(() => false) ?? Promise.resolve(false);
    const p = previo.then(() => (this.generacion === gen ? this.bucle(gen) : false)).finally(() => {
      if (this.enCurso?.p === p) this.enCurso = null;
    });
    this.enCurso = { gen, p };
    return p;
  }

  private bucle(gen: number): Promise<boolean> {
    const usuario = this.usuario!;
    return this.bloqueo(`estudia-tai:cola:${usuario}`, async () => {
      let descartadas = 0;
      for (;;) {
        if (this.generacion !== gen) return false;
        const lista = this.leer();
        if (!lista.length) break;
        const e = lista[0];
        this.fijar({ estado: 'guardando', pendientes: lista.length });
        let resultado: Resultado = 'ok';
        this.envios++;
        try {
          await this.ejecutar(e.op, usuario);
        } catch (err) {
          if (this.generacion !== gen) return false;
          if (err instanceof ErrorHttp && err.status >= 400 && err.status < 500) {
            console.error('Escritura rechazada por el servidor, se descarta:', err);
            descartadas++;
            resultado = 'rechazado';
          } else {
            for (const r of this.esperando.values()) r('pendiente');
            this.esperando.clear();
            this.fijar({
              estado: 'error', pendientes: this.pendientes,
              error: err instanceof NoAutenticado ? 'La sesión ha caducado o es de otra cuenta: entra de nuevo y se enviará' : 'Sin conexión o error del servidor',
            });
            return false;
          }
        }
        if (this.generacion !== gen) return false;
        // Se quita por id: otra pestaña puede haber añadido cosas detrás mientras tanto.
        this.escribir(this.leer().filter(x => x.id !== e.id));
        this.esperando.get(e.id)?.(resultado);
        this.esperando.delete(e.id);
      }
      // Lo que esperaba esta pestaña y ya no está en la lista lo envió otra pestaña.
      for (const r of this.esperando.values()) r('ok');
      this.esperando.clear();
      this.fijar(descartadas
        ? { estado: 'error', pendientes: 0, error: `El servidor rechazó ${descartadas === 1 ? 'un dato' : `${descartadas} datos`}; el resto está guardado` }
        : { estado: 'guardado', pendientes: 0 });
      return true;
    });
  }

  private fijar(e: EstadoGuardado) {
    this.avisar(e);
  }
}
