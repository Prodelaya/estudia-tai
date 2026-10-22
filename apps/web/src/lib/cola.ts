import { ErrorHttp, NoAutenticado, type CuerpoIntento, type ItemRespuesta } from './api';
import type { EstadoSrs } from './tipos';

export type Escritura =
  | { tipo: 'respuestas'; items: ItemRespuesta[] }
  | { tipo: 'srs'; e: EstadoSrs }
  | { tipo: 'intento'; cuerpo: CuerpoIntento };

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

/**
 * Cola de escrituras al servidor. Las respuestas, tarjetas e intentos se pintan al momento y se mandan en
 * orden; lo que no se pudo enviar se conserva en el navegador (por usuario) y se reintenta. Un 4xx distinto de
 * 401 no se arregla reintentando: se descarta esa escritura para no bloquear las siguientes y se avisa.
 */
export class ColaEscrituras {
  private cola: Escritura[] = [];
  private clave: string | null = null;
  private enCurso: Promise<boolean> | null = null;
  private estado: EstadoGuardado = { estado: 'guardado', pendientes: 0 };

  constructor(
    private readonly ejecutar: (e: Escritura) => Promise<unknown>,
    private readonly almacen: Almacen | null,
    private readonly avisar: (e: EstadoGuardado) => void,
  ) {}

  get pendientes() { return this.cola.length; }

  /** Respuestas aún no enviadas, para no perderlas de vista al recargar el progreso del servidor. */
  respuestasPendientes(): ItemRespuesta[] {
    return this.cola.flatMap(e => (e.tipo === 'respuestas' ? e.items : []));
  }

  /** Cambia de usuario: recupera lo que quedó pendiente de su última sesión en este navegador. */
  usar(usuario: string | null) {
    this.clave = usuario ? `estudia-tai:pendientes:${usuario}` : null;
    this.cola = [];
    if (this.clave) {
      try { this.cola = JSON.parse(this.almacen?.getItem(this.clave) ?? '[]'); } catch { this.cola = []; }
      if (!Array.isArray(this.cola)) this.cola = [];
    }
    this.fijar({ estado: this.cola.length ? 'error' : 'guardado', pendientes: this.cola.length, error: this.cola.length ? 'Quedaron datos sin guardar de la última vez' : undefined });
  }

  encolar(e: Escritura) {
    if (!this.clave) return Promise.resolve(false);
    this.cola.push(e);
    this.persistir();
    return this.vaciar();
  }

  /** Envía lo pendiente, en orden. Devuelve true si la cola queda vacía. */
  vaciar(): Promise<boolean> {
    if (!this.enCurso) {
      this.enCurso = this.bucle().finally(() => {
        this.enCurso = null;
        // Si algo entró justo al terminar, se envía sin esperar a la siguiente escritura.
        if (this.cola.length && this.estado.estado !== 'error') void this.vaciar();
      });
    }
    return this.enCurso;
  }

  private async bucle(): Promise<boolean> {
    const clave = this.clave;
    let descartadas = 0;
    while (this.cola.length && this.clave === clave) {
      this.fijar({ estado: 'guardando', pendientes: this.cola.length });
      try {
        await this.ejecutar(this.cola[0]);
      } catch (err) {
        if (this.clave !== clave) return false;
        if (err instanceof ErrorHttp && err.status >= 400 && err.status < 500) {
          console.error('Escritura rechazada por el servidor, se descarta:', err);
          descartadas++;
        } else {
          this.fijar({
            estado: 'error', pendientes: this.cola.length,
            error: err instanceof NoAutenticado ? 'La sesión ha caducado: entra de nuevo y se enviará' : 'Sin conexión o error del servidor',
          });
          return false;
        }
      }
      if (this.clave !== clave) return false;
      this.cola.shift();
      this.persistir();
    }
    this.fijar(descartadas
      ? { estado: 'error', pendientes: 0, error: `El servidor rechazó ${descartadas === 1 ? 'un dato' : `${descartadas} datos`}; el resto está guardado` }
      : { estado: 'guardado', pendientes: 0 });
    return true;
  }

  private persistir() {
    if (!this.clave || !this.almacen) return;
    try {
      if (this.cola.length) this.almacen.setItem(this.clave, JSON.stringify(this.cola));
      else this.almacen.removeItem(this.clave);
    } catch { /* sin almacenamiento local: la cola sigue en memoria */ }
  }

  private fijar(e: EstadoGuardado) {
    this.estado = e;
    this.avisar(e);
  }
}
