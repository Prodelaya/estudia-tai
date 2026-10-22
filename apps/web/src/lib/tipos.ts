export type Letra = 'a' | 'b' | 'c' | 'd';
export type Clave = 'oficial' | 'oficial-provisional' | 'claude' | 'claude-dudosa';

export interface Tema {
  n: number;
  titulo: string;
  bloque: string;
  preg_test: number;
  preg_sup3: number;
  pts: number;
  horas: number;
  palabras: number;
}

/** Pregunta de un examen real (data/examenes/<id>.json). */
export interface PreguntaExamen {
  id: string;
  n: number;
  reserva: boolean;
  q: string;
  op: Record<Letra, string>;
  ok: Letra | null;
  anulada: boolean;
  tema: number | null;
  obsoleta?: boolean;
  ctx?: string | null;
  ctx2?: string | null;
  clave?: Clave;
  /** Fiabilidad de la clave por pregunta (exámenes antiguos con supuesto sin plantilla oficial). */
  fiab?: Clave;
  dudosa?: boolean;
  nota_clave?: string;
}

/**
 * Criterio de calificación publicado para una parte de una convocatoria. Solo se rellena con fuente:
 * sin él, la web da una nota orientativa y no dice si se aprueba.
 */
export interface CriterioParte {
  /** Puntuación directa mínima (aciertos − errores/3) que la Comisión fijó para obtener 25 sobre 50. */
  corte_directa: number;
  /** Si la fuente documenta la transformación lineal corte → 25 y máximo → 50. */
  transformacion_lineal?: boolean;
  fuente: string;
  url?: string;
  oficial: boolean;
}

export interface ParteExamen {
  titulo?: string;
  valor?: number;
  fuente_clave?: Clave;
  criterio?: CriterioParte;
  contexto: string;
  preguntas: PreguntaExamen[];
}

/** Procedencia del cuestionario y de la plantilla, para poder contrastar cada pregunta con el original. */
export interface FuenteExamen {
  cuestionario?: string;
  plantilla?: string;
  modelo?: string;
  version_plantilla?: string;
}

export interface Examen {
  id: string;
  anio: number;
  convocatoria: string;
  fuente_clave: Clave;
  formato?: 'antiguo';
  nota_formato?: string;
  fuente?: FuenteExamen;
  partes: Record<string, ParteExamen>;
}

export interface ExamenIndice {
  id: string;
  anio: number;
  convocatoria: string;
  fuente_clave: Clave;
  partes: string[];
}

/** Pregunta de práctica por tema (data/contenido/tema_XX.json). */
export interface PreguntaTema {
  id: string;
  tipo: 'historica' | 'variante' | 'nueva';
  ref: string | null;
  origen?: { anio: number; parte: string; n: number } | null;
  de?: string | null;
  texto?: 'literal' | 'reformulado';
  q: string;
  ctx?: string | null;
  op: Record<Letra, string>;
  ok: Letra | null;
  clave: Clave;
  anulada?: boolean;
  obsoleta?: boolean;
  explicacion: string;
  epigrafe?: string;
  dificultad?: 1 | 2 | 3;
}

export interface Tarjeta {
  id: string;
  anverso: string;
  reverso: string;
  epigrafe?: string;
}

export interface ContenidoTema {
  tema: number;
  preguntas: PreguntaTema[];
  tarjetas: Tarjeta[];
}

/** Pregunta tal como se pinta: une los dos orígenes. */
export interface PreguntaVista {
  id: string;
  tema: number | null;
  q: string;
  /** Enunciado general del supuesto (plegable). */
  ctx?: string | null;
  /** Contexto propio de un grupo de preguntas («PREGUNTAS n-m»): se muestra siempre. */
  subctx?: string | null;
  op: Record<Letra, string>;
  ok: Letra | null;
  clave: Clave;
  anulada?: boolean;
  obsoleta?: boolean;
  explicacion?: string;
  etiqueta?: string;
  tipo?: PreguntaTema['tipo'];
  texto?: PreguntaTema['texto'];
}

export interface EstadoSrs {
  tarjeta_id: string;
  tema: number | null;
  facilidad: number;
  intervalo: number;
  repeticiones: number;
  vence: number;
}

export interface ResumenPregunta {
  pregunta_id: string;
  tema: number | null;
  vistas: number;
  aciertos: number;
  /** Resultado de la última respuesta (un blanco cuenta como 0). */
  ultima: 0 | 1;
  /** 1 si la última respuesta fue un blanco de simulacro. */
  blanco?: 0 | 1 | null;
  /** Aciertos seguidos desde el último fallo o blanco, y hora del primero de ellos. */
  racha?: number;
  ts_racha?: number | null;
  /** Resultado la primera vez que se vio; null si esa respuesta es anterior a que se registrara. */
  primera?: 0 | 1 | null;
  ts: number;
}

export interface Marca {
  pregunta_id: string;
  tema: number | null;
  nota: string;
  resuelta: 0 | 1;
  ts: number;
}

export type Modo = 'practica' | 'simulacro';

export interface NotaParte {
  a: number;
  e: number;
  b: number;
  n: number;
  /** Nota orientativa sobre 50: conversión lineal de la neta, sin el corte de la Comisión. */
  nota: number;
  /** Puntuación directa: aciertos − errores/3 (falta en intentos anteriores a este cambio). */
  neta?: number;
  /** Preguntas que puntúan en la parte (sin reservas). */
  total?: number;
}

export interface Intento {
  id: number;
  examen_id: string;
  partes: string[];
  notas: Record<string, NotaParte>;
  segundos: number | null;
  /** null en intentos anteriores a separar práctica y simulacro. */
  modo?: Modo | null;
  limite?: number | null;
  ts: number;
}

export interface Progreso {
  preguntas: ResumenPregunta[];
  srs: EstadoSrs[];
  marcas: Marca[];
  intentos: Intento[];
}
