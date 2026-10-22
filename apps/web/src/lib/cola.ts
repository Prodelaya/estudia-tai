import { ErrorHttp, NoAutenticado, type CuerpoIntento, type ItemRespuesta } from './api';
import type { EstadoSrs } from './tipos';

/** ts en srs es la hora de la calificación: el servidor no deja que un reenvío antiguo pise una más reciente. */
export type Escritura =
  | { tipo: 'respuestas'; items: ItemRespuesta[] }
  | { tipo: 'srs'; e: EstadoSrs; ts?: number }
  | { tipo: 'intento'; cuerpo: CuerpoIntento };

interface Entrada { id: string; op: Escritura }

/** Qué pasó con una escritura: enviada, rechazada por el servidor (4xx) o pendiente de reintento. */
export type Resultado = 'ok' | 'rechazado' | 'pendiente';
export type ResultadoFinal = Exclude<Resultado, 'pendiente'>;

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

/** Escrituras de esta pestaña que aún no se sabe cómo acabaron. */
interface Propia { op: Escritura; avisar?: (r: Resultado) => void; alFinal?: (r: ResultadoFinal) => void }

/** Cuántos resultados recientes se recuerdan para las demás pestañas. */
const MAX_HECHAS = 300;

/**
 * Cola de escrituras al servidor. Las respuestas, tarjetas e intentos se pintan al momento y se mandan en orden.
 * La lista vive en localStorage (por usuario) y es la misma para todas las pestañas, así que lo que no se pudo
 * enviar sobrevive a una recarga. Cada escritura lleva un id y las respuestas e intentos su cliente_id, de modo
 * que un reintento de algo que ya llegó no se duplica. Un 4xx distinto de 401 no se arregla reintentando: se
 * descarta esa escritura para no bloquear las siguientes y se avisa.
 *
 * Quien envía anota el resultado de cada id en una lista corta compartida: así la pestaña que encoló algo sabe
 * si otra lo envió o lo descartó, y si no consta en ningún sitio (dos pestañas escribieron la lista a la vez)
 * lo vuelve a encolar en lugar de darlo por guardado.
 */
export class ColaEscrituras {
  private usuario: string | null = null;
  private generacion = 0;
  /** Copia en memoria por usuario: manda si el navegador no deja leer o escribir en localStorage. */
  private memoria = new Map<string, { pendientes: Entrada[]; hechas: [string, ResultadoFinal][] }>();
  private sinAlmacen = false;
  private enCurso: { gen: number; p: Promise<boolean>; siguiente?: Promise<boolean> } | null = null;
  private propias = new Map<string, Propia>();
  /** Envíos empezados: recargar() lo usa para saber si una escritura cruzó su lectura del servidor. */
  envios = 0;

  constructor(
    private readonly ejecutar: (e: Escritura, usuario: string) => Promise<unknown>,
    private readonly almacen: Almacen | null,
    private readonly avisar: (e: EstadoGuardado) => void,
    private readonly bloqueo: Bloqueo = bloqueoNavegador(),
  ) {}

  private mem(usuario: string) {
    let m = this.memoria.get(usuario);
    if (!m) this.memoria.set(usuario, m = { pendientes: [], hechas: [] });
    return m;
  }

  private leerClave<T>(clave: string, valida: (x: unknown) => boolean): T[] | null {
    if (!this.almacen || this.sinAlmacen) return null;
    try {
      const v = JSON.parse(this.almacen.getItem(clave) ?? '[]');
      return Array.isArray(v) ? v.filter(valida) : [];
    } catch {
      this.sinAlmacen = true;
      return null;
    }
  }

  private escribirClave(clave: string, lista: unknown[]) {
    if (!this.almacen || this.sinAlmacen) return;
    try {
      if (lista.length) this.almacen.setItem(clave, JSON.stringify(lista));
      else this.almacen.removeItem(clave);
    } catch {
      // Lleno o bloqueado: desde aquí la cola vive en memoria, que ya tiene la copia al día, y no se pierde nada.
      this.sinAlmacen = true;
    }
  }

  // Cada lectura buena se copia a memoria: si después falla el almacenamiento, la memoria parte de lo último
  // que había (también lo que dejaron otras pestañas o una sesión anterior) y no se da nada por enviado.
  private leer(usuario = this.usuario): Entrada[] {
    if (!usuario) return [];
    const l = this.leerClave<Entrada>(`estudia-tai:pendientes:${usuario}`, x => !!x && typeof (x as Entrada).id === 'string' && !!(x as Entrada).op);
    if (l) this.mem(usuario).pendientes = l;
    return l ?? this.mem(usuario).pendientes;
  }

  private escribir(usuario: string, lista: Entrada[]) {
    this.mem(usuario).pendientes = lista;
    this.escribirClave(`estudia-tai:pendientes:${usuario}`, lista);
  }

  private leerHechas(usuario: string): Map<string, ResultadoFinal> {
    const l = this.leerClave<[string, ResultadoFinal]>(`estudia-tai:hechas:${usuario}`, x => Array.isArray(x) && x.length === 2);
    if (l) this.mem(usuario).hechas = l;
    return new Map(l ?? this.mem(usuario).hechas);
  }

  private anotar(usuario: string, id: string, r: ResultadoFinal) {
    const l = [...this.leerHechas(usuario)].filter(([k]) => k !== id);
    l.push([id, r]);
    const recortada = l.slice(-MAX_HECHAS);
    this.mem(usuario).hechas = recortada;
    this.escribirClave(`estudia-tai:hechas:${usuario}`, recortada);
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
    // Lo encolado para la cuenta anterior sigue en su clave y se enviará cuando vuelva a entrar.
    for (const p of this.propias.values()) p.avisar?.('pendiente');
    this.propias.clear();
    const n = this.pendientes;
    this.fijar(n ? { estado: 'error', pendientes: n, error: 'Quedaron datos sin guardar de la última vez' } : { estado: 'guardado', pendientes: 0 });
  }

  /**
   * Encola una escritura. La promesa dice qué pasó en el primer intento de envío; alFinal, si se pasa, avisa
   * cuando de verdad se guarda o se rechaza, aunque sea en un reintento posterior.
   */
  encolar(op: Escritura, alFinal?: (r: ResultadoFinal) => void): Promise<Resultado> {
    const usuario = this.usuario;
    if (!usuario) return Promise.resolve('pendiente');
    const id = nuevoId();
    this.escribir(usuario, [...this.leer(usuario), { id, op }]);
    const r = new Promise<Resultado>(avisar => this.propias.set(id, { op, avisar, alFinal }));
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
    // No se espera al envío de otra cuenta: cada usuario tiene su bloqueo y su clave, y una petición colgada de
    // la cuenta anterior no debe retener lo de la nueva.
    const p = (this.usuario ? this.bucle(gen, this.usuario) : Promise.resolve(true)).finally(() => {
      if (this.enCurso?.p === p) this.enCurso = null;
    });
    this.enCurso = { gen, p };
    return p;
  }

  private terminar(id: string, r: ResultadoFinal) {
    const p = this.propias.get(id);
    if (!p) return;
    this.propias.delete(id);
    p.avisar?.(r);
    p.alFinal?.(r);
  }

  private bucle(gen: number, usuario: string): Promise<boolean> {
    return this.bloqueo(`estudia-tai:cola:${usuario}`, async () => {
      let descartadas = 0;
      for (;;) {
        if (this.generacion !== gen) return false;
        const lista = this.leer(usuario);
        if (!lista.length) {
          // Lo que esta pestaña encoló y ya no está en la lista lo envió (o lo descartó) otra pestaña. Si no
          // consta en ningún sitio, se perdió al escribir dos pestañas a la vez: se vuelve a encolar.
          const hechas = this.leerHechas(usuario);
          const perdidas: Entrada[] = [];
          for (const [id, p] of [...this.propias]) {
            const h = hechas.get(id);
            if (h) this.terminar(id, h);
            else perdidas.push({ id, op: p.op });
          }
          if (!perdidas.length) break;
          this.escribir(usuario, [...this.leer(usuario), ...perdidas]);
          continue;
        }
        const e = lista[0];
        this.fijar({ estado: 'guardando', pendientes: lista.length }, gen);
        let resultado: ResultadoFinal = 'ok';
        this.envios++;
        try {
          await this.ejecutar(e.op, usuario);
        } catch (err) {
          if (err instanceof ErrorHttp && err.status >= 400 && err.status < 500) {
            console.error('Escritura rechazada por el servidor, se descarta:', err);
            descartadas++;
            resultado = 'rechazado';
          } else {
            if (this.generacion !== gen) return false;
            for (const p of this.propias.values()) { p.avisar?.('pendiente'); p.avisar = undefined; }
            this.fijar({
              estado: 'error', pendientes: this.pendientes,
              error: err instanceof NoAutenticado ? 'La sesión ha caducado o es de otra cuenta: entra de nuevo y se enviará' : 'Sin conexión o error del servidor',
            });
            return false;
          }
        }
        // Se anota y se quita por id de la clave de quien la envió (otra pestaña puede haber añadido cosas detrás),
        // aunque entretanto se haya cambiado de cuenta: si no, se reenviaría más tarde.
        this.anotar(usuario, e.id, resultado);
        this.escribir(usuario, this.leer(usuario).filter(x => x.id !== e.id));
        if (this.generacion !== gen) return false;
        this.terminar(e.id, resultado);
      }
      this.fijar(descartadas
        ? { estado: 'error', pendientes: 0, error: `El servidor rechazó ${descartadas === 1 ? 'un dato' : `${descartadas} datos`}; el resto está guardado` }
        : { estado: 'guardado', pendientes: 0 }, gen);
      return true;
    });
  }

  private fijar(e: EstadoGuardado, gen = this.generacion) {
    if (gen === this.generacion) this.avisar(e);
  }
}
