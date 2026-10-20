# Tema 22. Accesibilidad, usabilidad y seguridad en el desarrollo

Peso en el examen: unas 2,4 preguntas de test y 1,3 de supuesto del Bloque III por convocatoria (unos 4,8 puntos sobre 100). Hay 56 preguntas históricas (2005-2025). Más de la mitad son de accesibilidad: WCAG (principios, pautas, niveles), RD 1112/2018 y siglas del W3C/WAI. Desde 2017 el supuesto III añade seguridad web: CSRF, cookies SameSite, CORS, inyección SQL, XSS y ARIA. La usabilidad solo se preguntó en 2005-2007. El puesto de usuario apenas sale (FileVault en 2018 y MFA en 2025).

## Cómo lo preguntan

- **Asignar pauta a principio**: "¿qué pauta NO es del principio Perceptible?" (2018), "¿a qué principio pertenece la pauta 3.3?" (2016), "pauta del principio Operable" (2017, 2022).
- **Nivel de un criterio**: "¿cuál es de nivel AAA?" (2016: Pronunciación) o "¿cuál es de nivel A?" (2017: Contenido no textual).
- **Siglas del W3C**: WAI, WCAG, ATAG, UAAG (2008, 2015, 2022, 2024). Los distractores intercambian herramienta de autor y agente de usuario.
- **Literalidad del RD 1112/2018**: plazo de 20 días hábiles (2019, 2024), plazos de primera revisión (2019), rango normativo (2022: Real Decreto y no Ley u Orden).
- **Herramientas**: lector de pantalla (JAWS 2017, NVDA 2016) y validadores automáticos (2015, 2024).
- **Supuesto III con código**: botón-imagen accesible (2008), título de tabla (2015), atributos ARIA (2024, 2025), cadena `100 OR 1=1` (2019).
- **Seguridad web por siglas o cabeceras**: CSRF (2017, 2022), SameSite (2022), CORS frente a HSTS/CSP/TLS (2024), XSS (2025), SAST/DAST/SCA (2022).

## Accesibilidad: conceptos y organismos

### Accesibilidad, diseño universal y discapacidad

La **accesibilidad web** busca que cualquier persona pueda percibir, entender, navegar e interactuar con la web. El objetivo clásico es facilitar el acceso a la información a las personas con discapacidad **[Salió 2007]**. Beneficia también a mayores, usuarios con móviles, conexiones lentas o limitaciones temporales.

El **RDL 1/2013** (Ley General de derechos de las personas con discapacidad) define:

- **Accesibilidad universal**: condición que deben cumplir entornos, productos y servicios para ser comprensibles, utilizables y practicables por todas las personas de la forma más autónoma y natural posible.
- **Diseño universal o diseño para todas las personas**: concebir desde el origen entornos y productos utilizables por todos, sin necesidad de adaptación posterior. No excluye los productos de apoyo.
- **Ajustes razonables**: adaptaciones necesarias en un caso concreto, sin carga desproporcionada.

La accesibilidad en telecomunicaciones y sociedad de la información está regulada por ley **[Salió 2016]**. Antecedentes: Ley 51/2003 (LIONDAU), Ley 34/2002 (LSSI, disposición adicional quinta) y RD 1494/2007. No existe una ISO 20000 de accesibilidad ni una NTI de accesibilidad del ENI (distractores de 2016).

### Los 7 principios del diseño universal

Formulados por Ron Mace y el Center for Universal Design (Universidad Estatal de Carolina del Norte, 1997):

1. Uso equitativo.
2. Flexibilidad en el uso.
3. Uso simple e intuitivo.
4. Información perceptible.
5. Tolerancia al error.
6. Mínimo esfuerzo físico.
7. Tamaño y espacio para el acercamiento y el uso.

Norma española relacionada: **UNE 170001** (accesibilidad universal, criterios DALCO: deambulación, aprehensión, localización y comunicación).

### W3C y WAI

- **W3C** (World Wide Web Consortium) elabora las WCAG **[Salió 2008]**.
- **WAI** = *Web Accessibility Initiative*, iniciativa del W3C para la accesibilidad **[Salió 2015]**.
- La WAI publica tres familias de pautas complementarias y la especificación ARIA.

| Siglas | Nombre | A quién se dirige | Versión vigente |
|---|---|---|---|
| WCAG | Web Content Accessibility Guidelines | Contenido web (páginas, apps) | 2.2 (octubre 2023) |
| ATAG | Authoring Tool Accessibility Guidelines | Herramientas de autor (CMS, editores) | 2.0 (2015) |
| UAAG | User Agent Accessibility Guidelines | Agentes de usuario (navegadores, reproductores) | 2.0 (nota de 2015) |
| WAI-ARIA | Accessible Rich Internet Applications | Componentes dinámicos con JavaScript | 1.2 (junio 2023) |

**ATAG** tiene dos partes. Parte A: la herramienta de autor debe ser accesible para autores con discapacidad. Parte B: debe ayudar a generar contenido accesible **[Salió 2008, 2015, 2024]**. En 2024 la opción correcta fue "conjunto de normas que deben cumplir las herramientas de autor para ser accesibles y generar contenidos también accesibles".

Distractores habituales: "explican cómo hacer accesibles los agentes de usuario" es UAAG. "Explican cómo hacer el contenido web más accesible" es WCAG. "Suite para contenido y aplicaciones dinámicas" es WAI-ARIA.

## WCAG: estructura, principios y pautas

### Versiones

| Versión | Fecha | Estructura | Criterios |
|---|---|---|---|
| WCAG 1.0 | Mayo 1999 | 14 pautas, puntos de verificación con prioridad 1, 2 y 3 | 65 puntos |
| WCAG 2.0 | Diciembre 2008 | 4 principios, 12 pautas | 61 (A 25, AA 13, AAA 23) |
| WCAG 2.1 | Junio 2018 | 4 principios, 13 pautas | 78 (A 30, AA 20, AAA 28) |
| WCAG 2.2 | 5 octubre 2023 | 4 principios, 13 pautas | 86 (A 31, AA 24, AAA 31) |
| WCAG 3.0 | Borrador de trabajo | Nuevo modelo de resultados y puntuación | No es norma |

- WCAG 2.0 es también la norma **ISO/IEC 40500:2012**. WCAG 2.2 se ha aprobado como ISO/IEC 40500:2025.
- Las versiones 2.x son compatibles hacia atrás: cumplir 2.2 implica cumplir 2.1 y 2.0. La excepción es el criterio 4.1.1, eliminado en 2.2.
- WCAG 2.1 añadió 17 criterios (móvil, baja visión, discapacidad cognitiva). WCAG 2.2 añadió 9 y suprimió 4.1.1 Procesamiento.
- La norma europea UNE-EN 301 549 vigente exige WCAG 2.1 nivel AA.

### WCAG 1.0 (obsoleta, pero sale)

- Cada punto de verificación tenía prioridad 1 (debe), 2 (debería) o 3 (puede).
- Nivel **A** = todos los de prioridad 1. **Doble-A** = prioridades 1 y 2 **[Salió 2008]**. **Triple-A** = 1, 2 y 3.
- Prioridad 1: texto equivalente para imágenes **[Salió 2007]**, información transmitida con color también disponible sin color **[Salió 2008]**, documento legible sin hojas de estilo **[Salió 2008]**.
- Pauta 1 de WCAG 1.0: "Proporcione alternativas equivalentes para el contenido visual y auditivo" **[Salió 2008]**.

### Niveles de orientación en WCAG 2.x

De lo más general a lo más concreto **[Salió 2017]**:

1. **Principios** (4): perceptible, operable, comprensible, robusto (POUR).
2. **Pautas** (13): objetivos básicos; no son comprobables.
3. **Criterios de conformidad** (86 en 2.2): comprobables, con nivel A, AA o AAA.
4. **Técnicas suficientes y recomendables** (más los fallos documentados): informativas, no normativas.

### Los 4 principios y sus 13 pautas

Memoriza esta tabla: es la pregunta más repetida del tema **[Salió 2015, 2016, 2017, 2018, 2019, 2022]**.

| Principio | Pautas |
|---|---|
| 1 Perceptible | 1.1 Alternativas textuales; 1.2 Medios tempodependientes; 1.3 Adaptable; 1.4 Distinguible |
| 2 Operable | 2.1 Accesible por teclado; 2.2 Tiempo suficiente; 2.3 Convulsiones y reacciones físicas; 2.4 Navegable; 2.5 Modalidades de entrada (nueva en 2.1) |
| 3 Comprensible | 3.1 Legible; 3.2 Predecible; 3.3 Entrada de datos asistida |
| 4 Robusto | 4.1 Compatible |

Definición de cada principio:

- **Perceptible**: la información y la interfaz se presentan de forma que los usuarios puedan percibirlas.
- **Operable**: los componentes de la interfaz y la navegación deben poder utilizarse **[Salió 2022]**.
- **Comprensible**: la información y el manejo de la interfaz deben ser comprensibles.
- **Robusto**: el contenido debe poder interpretarse por diversos agentes de usuario, incluidas las ayudas técnicas.

Enunciado literal de pautas que han salido:

- 1.1 Alternativas textuales: proporcionar alternativas textuales para todo contenido no textual (letra grande, braille, voz, símbolos, lenguaje más simple).
- 1.2 Medios tempodependientes: proporcionar alternativas para los medios tempodependientes.
- 1.3 Adaptable: crear contenido presentable de diferentes formas sin perder información ni estructura.
- 1.4 Distinguible: facilitar a los usuarios ver y oír el contenido, incluida la separación entre primer plano y fondo **[Salió 2019]**.
- 2.1 Accesible por teclado: proporcionar acceso a toda la funcionalidad mediante el teclado **[Salió 2017]**.
- 2.3 Convulsiones: no diseñar contenido que pueda provocar ataques epilépticos. Es de Operable, no de Perceptible **[Salió 2018]**.
- 3.2 Predecible: hacer que las páginas aparezcan y operen de manera predecible (es de Comprensible; distractor en 2017).
- 3.3 Entrada de datos asistida: ayudar a evitar y corregir errores. Es de Comprensible **[Salió 2016]**.

## WCAG: criterios de conformidad

### Requisitos de conformidad

Para declarar conformidad hay que cumplir cinco requisitos:

1. **Nivel**: A (mínimo), AA (incluye A) o AAA (incluye A y AA).
2. **Páginas completas**: no vale cumplir solo una parte de la página.
3. **Procesos completos**: todas las páginas de un proceso (por ejemplo, una compra) cumplen.
4. **Uso de tecnologías de forma compatible con la accesibilidad**.
5. **Sin interferencia**: la tecnología no compatible no bloquea el resto.

El W3C no recomienda exigir AAA a sitios completos: algunos contenidos no pueden cumplirlo. La normativa española exige **AA**.

### Tabla completa de criterios (WCAG 2.2)

Entre paréntesis, versión en que aparece si es posterior a 2.0.

| Criterio | Nivel | Dato clave |
|---|---|---|
| 1.1.1 Contenido no textual | A | Alternativa textual; excepciones CAPTCHA, decoración **[Salió 2017]** |
| 1.2.1 Solo audio y solo vídeo (grabado) | A | Transcripción o pista alternativa |
| 1.2.2 Subtítulos (grabado) | A | |
| 1.2.3 Audiodescripción o medio alternativo (grabado) | A | |
| 1.2.4 Subtítulos (en directo) | AA | |
| 1.2.5 Audiodescripción (grabado) | AA | |
| 1.2.6 Lengua de señas (grabado) | AAA | Distractor en 2017 |
| 1.2.7 Audiodescripción ampliada (grabado) | AAA | |
| 1.2.8 Medio alternativo (grabado) | AAA | |
| 1.2.9 Solo audio (en directo) | AAA | |
| 1.3.1 Información y relaciones | A | Estructura en el marcado (encabezados, tablas, etiquetas) |
| 1.3.2 Secuencia significativa | A | |
| 1.3.3 Características sensoriales | A | No depender de forma, color o posición |
| 1.3.4 Orientación (2.1) | AA | Vertical y horizontal |
| 1.3.5 Identificar el propósito de la entrada (2.1) | AA | Atributo autocomplete |
| 1.3.6 Identificar el propósito (2.1) | AAA | |
| 1.4.1 Uso del color | A | El color no es el único medio |
| 1.4.2 Control del audio | A | Audio de más de 3 segundos con pausa o volumen |
| 1.4.3 Contraste (mínimo) | AA | 4,5:1; texto grande 3:1 |
| 1.4.4 Cambio de tamaño del texto | AA | Hasta 200 % sin perder contenido |
| 1.4.5 Imágenes de texto | AA | |
| 1.4.6 Contraste (mejorado) | AAA | 7:1; texto grande 4,5:1 |
| 1.4.7 Sonido de fondo bajo o ausente | AAA | 20 dB por debajo |
| 1.4.8 Presentación visual | AAA | Máximo 80 caracteres por línea |
| 1.4.9 Imágenes de texto (sin excepciones) | AAA | |
| 1.4.10 Reajuste del texto (2.1) | AA | Sin scroll en dos ejes a 320 px CSS |
| 1.4.11 Contraste no textual (2.1) | AA | 3:1 en controles y gráficos |
| 1.4.12 Espaciado del texto (2.1) | AA | Interlineado 1,5; párrafo 2; letras 0,12; palabras 0,16 |
| 1.4.13 Contenido con hover o foco (2.1) | AA | Descartable, persistente, apuntable |
| 2.1.1 Teclado | A | |
| 2.1.2 Sin trampas para el foco | A | |
| 2.1.3 Teclado (sin excepciones) | AAA | |
| 2.1.4 Atajos de teclado de un carácter (2.1) | A | |
| 2.2.1 Tiempo ajustable | A | Ampliar al menos 10 veces; aviso de 20 s |
| 2.2.2 Pausar, detener, ocultar | A | Movimiento de más de 5 s |
| 2.2.3 Sin tiempo | AAA | |
| 2.2.4 Interrupciones | AAA | |
| 2.2.5 Reautenticación | AAA | |
| 2.2.6 Tiempos de espera (2.1) | AAA | Avisar si se pierden datos tras inactividad; 20 horas |
| 2.3.1 Umbral de tres destellos o menos | A | Máximo 3 destellos por segundo |
| 2.3.2 Tres destellos | AAA | |
| 2.3.3 Animación por interacciones (2.1) | AAA | |
| 2.4.1 Evitar bloques | A | Enlace "saltar al contenido" |
| 2.4.2 Titulado de páginas | A | Elemento title |
| 2.4.3 Orden del foco | A | |
| 2.4.4 Propósito de los enlaces (en contexto) | A | Evitar "pincha aquí" |
| 2.4.5 Múltiples vías | AA | Buscador, mapa web, menú |
| 2.4.6 Encabezados y etiquetas | AA | |
| 2.4.7 Foco visible | AA | |
| 2.4.8 Ubicación | AAA | Migas de pan |
| 2.4.9 Propósito de los enlaces (solo enlaces) | AAA | |
| 2.4.10 Encabezados de sección | AAA | Distractor en 2017 |
| 2.4.11 Foco no oculto (mínimo) (2.2) | AA | |
| 2.4.12 Foco no oculto (mejorado) (2.2) | AAA | |
| 2.4.13 Apariencia del foco (2.2) | AAA | |
| 2.5.1 Gestos del puntero (2.1) | A | Alternativa a gestos multipunto |
| 2.5.2 Cancelación del puntero (2.1) | A | Acción al soltar, no al pulsar |
| 2.5.3 Etiqueta en el nombre (2.1) | A | |
| 2.5.4 Activación mediante movimiento (2.1) | A | |
| 2.5.5 Tamaño del objetivo (mejorado) (2.1) | AAA | 44 x 44 px CSS |
| 2.5.6 Mecanismos de entrada concurrentes (2.1) | AAA | |
| 2.5.7 Movimientos de arrastre (2.2) | AA | Alternativa de un solo puntero |
| 2.5.8 Tamaño del objetivo (mínimo) (2.2) | AA | 24 x 24 px CSS |
| 3.1.1 Idioma de la página | A | Atributo lang en html |
| 3.1.2 Idioma de las partes | AA | Distractor en 2016 |
| 3.1.3 Palabras inusuales | AAA | |
| 3.1.4 Abreviaturas | AAA | |
| 3.1.5 Nivel de lectura | AAA | Educación secundaria inferior |
| 3.1.6 Pronunciación | AAA | **[Salió 2016]** |
| 3.2.1 Al recibir el foco | A | Sin cambios de contexto |
| 3.2.2 Al recibir entradas | A | |
| 3.2.3 Navegación coherente | AA | |
| 3.2.4 Identificación coherente | AA | |
| 3.2.5 Cambios a petición | AAA | |
| 3.2.6 Ayuda coherente (2.2) | A | |
| 3.3.1 Identificación de errores | A | |
| 3.3.2 Etiquetas o instrucciones | A | Distractor en 2016 |
| 3.3.3 Sugerencias ante errores | AA | |
| 3.3.4 Prevención de errores (legales, financieros, datos) | AA | Reversible, verificado o confirmado |
| 3.3.5 Ayuda | AAA | |
| 3.3.6 Prevención de errores (todos) | AAA | |
| 3.3.7 Entrada redundante (2.2) | A | No pedir dos veces el mismo dato |
| 3.3.8 Autenticación accesible (mínimo) (2.2) | AA | Sin pruebas cognitivas; permitir pegar y gestores de contraseñas |
| 3.3.9 Autenticación accesible (mejorada) (2.2) | AAA | |
| 4.1.1 Procesamiento | A en 2.0 y 2.1 | Eliminado (obsoleto) en 2.2 |
| 4.1.2 Nombre, función, valor | A | Base de ARIA |
| 4.1.3 Mensajes de estado (2.1) | AA | Anunciar sin mover el foco (aria-live, role="status") |

Regla práctica para niveles: lo "mejorado", "sin excepciones", "ampliado", lengua de señas, pronunciación, abreviaturas y palabras inusuales son AAA. Lo básico (alternativas, teclado, título, idioma de la página, etiquetas) es A.

Texto grande: al menos 18 puntos, o 14 puntos en negrita (aprox. 24 px y 18,66 px CSS).

## HTML accesible y WAI-ARIA

### Buenas prácticas de marcado

La primera regla de ARIA: si existe un elemento HTML nativo con la semántica necesaria, úsalo en vez de ARIA.

Elementos semánticos de HTML5 (puntos de referencia o *landmarks*): `header`, `nav`, `main`, `aside`, `footer`, `section`, `article` **[Salió 2025]**. Encabezados `h1` a `h6` jerárquicos, listas `ul`/`ol`, `button` para acciones y `a` para navegar.

```html
<!DOCTYPE html>
<html lang="es">
<head><title>Inscripción - Proceso TAI</title></head>
<body>
  <a href="#contenido" class="saltar">Saltar al contenido</a>
  <header>...</header>
  <nav aria-label="Principal">...</nav>
  <main id="contenido">
    <h1>Inscripción</h1>
    <form>
      <label for="dni">DNI</label>
      <input id="dni" name="dni" autocomplete="off" required aria-describedby="ayuda-dni">
      <p id="ayuda-dni">8 cifras y letra</p>
      <input type="image" src="enviar.png" alt="Enviar datos">
    </form>
  </main>
  <footer><a href="/accesibilidad">Accesibilidad</a></footer>
</body>
</html>
```

Imagen como botón o enlace: la imagen debe llevar `alt` con la función ("Enviar datos"). En 2008 la correcta era un enlace con `<img ... alt="Enviar datos">` **[Salió 2008]**. Un `title` no sustituye a `alt`.

Tablas de datos accesibles: título con `caption`, cabeceras con `th` y `scope` **[Salió 2015]**.

```html
<table>
  <caption>Plazas convocadas por año</caption>
  <thead>
    <tr><th scope="col">Año</th><th scope="col">Plazas</th></tr>
  </thead>
  <tbody>
    <tr><th scope="row">2024</th><td>1000</td></tr>
  </tbody>
</table>
```

Otras reglas: imágenes decorativas con `alt=""`; no usar tablas para maquetar; textos de enlace con sentido fuera de contexto; no transmitir información solo con color.

### WAI-ARIA

ARIA añade **roles**, **estados** y **propiedades** para tecnologías de apoyo. No cambia el comportamiento ni el aspecto: el teclado lo programa el desarrollador.

| Atributo o rol | Para qué sirve |
|---|---|
| `role` (button, dialog, tab, alert, status, navigation...) | Define qué es el elemento |
| `aria-label` | Nombre accesible cuando no hay texto visible |
| `aria-labelledby` | Nombre tomado de otro elemento por su id |
| `aria-describedby` | Descripción adicional (ayudas, errores) |
| `aria-hidden="true"` | Oculta el elemento a las tecnologías de apoyo |
| `aria-expanded` | Indica si el elemento controlado está desplegado (true) o plegado (false) **[Salió 2025]** |
| `aria-controls` | Id del elemento que controla |
| `aria-live` (off, polite, assertive) | Región que se actualizará; el lector anuncia los cambios **[Salió 2024]** |
| `aria-atomic`, `aria-relevant` | Cómo anunciar los cambios de la región viva |
| `aria-checked`, `aria-selected`, `aria-pressed` | Estado de casillas, opciones y conmutadores |
| `aria-required`, `aria-invalid` | Campo obligatorio o con error |
| `aria-current` | Elemento actual (página, paso) |
| `aria-valuenow`, `aria-valuemin`, `aria-valuemax` | Valor de un deslizador o barra de progreso |
| `aria-flowto` | Orden de lectura alternativo |

```html
<button aria-expanded="false" aria-controls="menu1">Opciones</button>
<ul id="menu1" hidden>...</ul>

<div aria-live="polite" role="status" id="aviso"></div>
<script>
  // El lector anunciará el texto sin mover el foco
  document.getElementById('aviso').textContent = 'Datos guardados';
</script>
```

`role="alert"` equivale a `aria-live="assertive"`; `role="status"` equivale a `aria-live="polite"`.

## Herramientas y productos de apoyo

### Evaluación automática

Las herramientas automáticas solo detectan una parte de los problemas (en torno a un tercio). Siempre hace falta revisión manual y con usuarios.

| Herramienta | Tipo |
|---|---|
| TAW | Validador en línea español (Fundación CTIC) |
| WAVE | Validador y extensión de navegador (WebAIM) **[Salió 2015]** |
| AChecker | Validador en línea **[Salió 2015]** |
| SortSite | Analizador de sitios completo **[Salió 2015]** |
| axe (Deque), Lighthouse (Google), Pa11y | Motores automáticos integrables en CI |
| QualWeb, Access Monitor | Evaluadores automáticos de WCAG 2.1 **[Salió 2024]** |
| Colour Contrast Analyser | Comprobación de contraste |
| Validador del W3C | Validación de HTML y CSS |

WebCT **no** es de accesibilidad: es una plataforma de e-learning **[Salió 2015]**.

En la AGE, el **Observatorio de Accesibilidad Web** (portal accesibilidad.gob.es) realiza el seguimiento con su propia herramienta.

### Productos de apoyo

| Producto | Plataforma | Licencia |
|---|---|---|
| JAWS | Windows | Lector de pantalla comercial (Freedom Scientific) **[Salió 2017]** |
| NVDA | Windows | Lector de pantalla libre y gratuito **[Salió 2016]** |
| Narrador | Windows | Incluido en el sistema |
| VoiceOver | macOS, iOS | Incluido en el sistema |
| Orca | Linux (GNOME) | Libre |
| TalkBack | Android | Incluido |
| ZoomText | Windows | Magnificador comercial |

Otros: líneas braille, software de reconocimiento de voz, teclados alternativos, conmutadores, ratones de cabeza o mirada.

## RD 1112/2018 y normativa de accesibilidad

### Identificación y ámbito

- **Real Decreto 1112/2018, de 7 de septiembre**, sobre accesibilidad de los sitios web y aplicaciones para dispositivos móviles del sector público **[Salió 2022]**.
- Transpone la **Directiva (UE) 2016/2102**. Entró en vigor el 20 de septiembre de 2018.
- Deroga lo relativo a páginas web del RD 1494/2007.
- Ámbito: todo el sector público (AGE, CCAA, entidades locales, sector público institucional, universidades públicas).
- Se aplica parcialmente a otras entidades: corporaciones de derecho público, entidades que prestan servicios públicos (educación, sanidad, servicios sociales) con financiación pública, etc.
- **Contenido que debe ser accesible** **[Salió 2025]**: la información textual y no textual, los documentos y formularios descargables, los contenidos multimedia pregrabados, las formas de interacción bidireccional y la cumplimentación de procesos de identificación, autenticación, firma y pago.

### Contenidos excluidos

No están obligados a ser accesibles:

- Ficheros ofimáticos publicados antes del 20/09/2018, salvo los necesarios para procesos administrativos activos.
- Multimedia pregrabado de base temporal publicado antes del 20/09/2020.
- Multimedia en directo.
- Mapas y servicios cartográficos en línea, si la información esencial se da de forma accesible.
- Contenido de terceros ni financiado ni desarrollado ni controlado por la entidad.
- Reproducciones de piezas de patrimonio que no puedan hacerse accesibles.
- Contenido de extranets e intranets publicado antes del 20/09/2019, hasta su revisión sustancial.
- Contenido de archivo no actualizado tras el 20/09/2019 ni necesario para procesos activos.

También están excluidos los servicios públicos de radiodifusión y, salvo funciones administrativas esenciales, centros escolares y guarderías.

### Requisitos y carga desproporcionada

- Los contenidos deben ser **perceptibles, operables, comprensibles y robustos**.
- Se presume conformidad si se cumple la norma armonizada **UNE-EN 301 549** (hoy V3.2.1, publicada en España como UNE-EN 301549:2022). Exige WCAG 2.1 nivel AA **[Salió 2018]**.
- La entidad puede alegar **carga desproporcionada** para una parte concreta. Debe justificarla y ofrecer alternativa accesible.

### Plazos de aplicación

| Contenido | Obligado desde |
|---|---|
| Sitios web nuevos (publicados desde el 20/09/2018) | 20 de septiembre de 2019 |
| Sitios web existentes | 20 de septiembre de 2020 |
| Aplicaciones para dispositivos móviles | 23 de junio de 2021 |

Primera revisión de accesibilidad: sitios web antes de **dos años** desde la entrada en vigor; aplicaciones móviles antes de **tres años** **[Salió 2019]**.

### Declaración de accesibilidad

- Obligatoria, según el modelo de la Decisión de Ejecución (UE) 2018/1523.
- Publicada en formato accesible, enlazada desde todas las páginas (habitualmente en el pie) o en la tienda de aplicaciones.
- Contenido: situación de cumplimiento (plenamente, parcialmente o no conforme), contenido no accesible y motivos, alternativas, fecha de elaboración y revisión.
- Incluye un mecanismo de comunicación y el enlace al procedimiento de reclamación.
- Se revisa y actualiza periódicamente, al menos una vez al año.

### Solicitudes, quejas y reclamaciones

- La entidad debe ofrecer un canal para comunicaciones, sugerencias y **quejas** **[Salió 2019]**.
- Se pueden pedir **información accesible** sobre contenidos excluidos o con carga desproporcionada.
- Plazo de respuesta: **veinte días hábiles** **[Salió 2019, 2024]**.
- Si la respuesta no satisface, cabe **reclamación** ante la Unidad responsable de accesibilidad.

### Organización y seguimiento

- **Unidades responsables de accesibilidad**: en cada ministerio, CCAA y entidad local. Coordinan, revisan e informan.
- **Ministerio para la Transformación Digital y de la Función Pública** (a través de la SGAD): coordina en la AGE, mantiene el Observatorio y elabora el informe a la Comisión Europea.
- Metodología de seguimiento: Decisión de Ejecución (UE) 2018/1524. Revisiones simplificadas (automáticas) y en profundidad (manuales).
- Informe de España a la Comisión cada tres años.
- Formación del personal y sensibilización son obligaciones de la entidad.

### Normas técnicas

| Norma | Contenido |
|---|---|
| UNE 139803:2012 | Requisitos de accesibilidad web; equivalente a WCAG 2.0. Sustituida |
| UNE-EN 301549:2019 | Requisitos de accesibilidad de productos y servicios TIC (V2.1.2) **[Salió 2018]** |
| UNE-EN 301549:2022 | Versión V3.2.1, vigente; WCAG 2.1 AA |
| ISO/IEC 40500 | WCAG 2.0 (2012) y WCAG 2.2 (2025) |
| UNE 170001 | Accesibilidad universal (DALCO) |

### Sector privado: Ley 11/2023 y Acta Europea de Accesibilidad

- La **Directiva (UE) 2019/882** (Acta Europea de Accesibilidad) se transpuso por la **Ley 11/2023**.
- Se aplica desde el **28 de junio de 2025** a productos y servicios privados: comercio electrónico, banca, transporte, libros electrónicos, terminales y cajeros.
- La LSSI y el RDL 1/2013 ya exigían accesibilidad a grandes empresas que prestan servicios de especial trascendencia económica.

## Usabilidad e interfaz de usuario

### Definiciones

- **Usabilidad (ISO 9241-11)**: grado en que un producto puede ser usado por usuarios específicos para lograr objetivos específicos con **eficacia, eficiencia y satisfacción** en un contexto de uso especificado **[Salió 2006, 2007]**.
- Eficacia: precisión y completitud. Eficiencia: recursos empleados. Satisfacción: ausencia de incomodidad y actitud positiva.
- **ISO 9241-210**: diseño centrado en las personas (usuario), proceso iterativo.
- **ISO/IEC 25010**: en la versión de 2011, la usabilidad es una característica de calidad. En la de 2023 pasa a llamarse "capacidad de interacción".
- **Interfaz de usuario**: medio de comunicación hombre-máquina. Abarca software, hardware y documentación **[Salió 2005]**.

### Tipos de interfaz

| Tipo | Característica |
|---|---|
| CUI o CLI (línea de comandos) | Órdenes con sintaxis; usuarios expertos **[Salió 2006]** |
| Menús | Elección entre opciones; verbos en infinitivo ("Guardar", "Abrir") **[Salió 2006]** |
| GUI (gráfica, WIMP) | Ventanas, iconos, menús y puntero |
| OOUI | Orientada a objetos: el usuario actúa sobre objetos |
| Natural (NUI), voz, conversacional | Gestos táctiles, voz, lenguaje natural |

### Principios de diseño de interfaces

- Ocultar al usuario ocasional los detalles técnicos.
- Permitir interrumpir y deshacer las acciones (reversibilidad).
- Aligerar la interacción al crecer la experiencia y permitir personalizar.
- Coherencia, retroalimentación, prevención de errores, valores por defecto sensatos.
- "Garantizar la autenticación con criptografía" no es un principio de interfaz **[Salió 2005]**.
- "Diseño centrado en el dato" no es criterio de usabilidad; lo es el diseño centrado en el usuario **[Salió 2005]**.

**Ley de Fitts**: el tiempo para alcanzar un objetivo depende de su distancia y su tamaño. Cuanto más grande y cercano, más fácil hacer clic **[Salió 2005, 2007]**.

**Ley de Hick**: el tiempo de decisión crece con el número de opciones (de forma logarítmica).

**Reglas de oro de Shneiderman** (8): consistencia, atajos para expertos, retroalimentación, diálogos con cierre, prevención de errores, deshacer fácil, control del usuario, reducir la carga de memoria.

### Heurísticas de Nielsen (10)

1. Visibilidad del estado del sistema.
2. Correspondencia entre el sistema y el mundo real.
3. Control y libertad del usuario.
4. Consistencia y estándares.
5. Prevención de errores.
6. Reconocer antes que recordar.
7. Flexibilidad y eficiencia de uso.
8. Diseño estético y minimalista.
9. Ayudar a reconocer, diagnosticar y recuperarse de errores.
10. Ayuda y documentación.

### Métodos de evaluación

| Grupo | Métodos |
|---|---|
| Inspección por expertos (sin usuarios) | Evaluación heurística **[Salió 2007]**, recorrido cognitivo, inspección de estándares |
| Test con usuarios | Pensamiento en voz alta, test de tareas, eye tracking, tests A/B |
| Indagación | Encuestas (cuestionario SUS), entrevistas, card sorting, grupos focales |

Nielsen: con 5 usuarios se detecta la mayoría de los problemas de usabilidad de un ciclo de prueba.

## Seguridad en el puesto de usuario

### Marco: ENS y CCN-CERT

El **ENS (RD 311/2022)** incluye medidas sobre el puesto:

- **mp.eq.1** Puesto de trabajo despejado.
- **mp.eq.2** Bloqueo de puesto de trabajo por inactividad.
- **mp.eq.3** Protección de dispositivos portátiles (cifrado en categoría alta).
- **mp.eq.4** Otros dispositivos conectados a la red.
- **op.exp.6** Protección frente a código dañino.
- **op.acc.5 y op.acc.6** Mecanismos de autenticación (usuarios externos y de la organización).

El **CCN-CERT** publica guías CCN-STIC de bastionado (serie 500 y 600 para Windows, Linux, macOS) e informes de buenas prácticas (serie BP).

### Autenticación multifactor

Combina factores de categorías distintas **[Salió 2025]**:

- Algo que se **sabe**: contraseña, PIN.
- Algo que se **tiene**: token, tarjeta criptográfica, móvil con app OTP.
- Algo que se **es**: huella, rostro (biometría).

Dos contraseñas no son MFA: son del mismo factor. Por eso **iris + huella NO es MFA**: las dos son «algo que se es» **[Salió 2025: era la respuesta a «cuál NO es MFA»]**. Los SMS son el segundo factor más débil (SIM swapping). Lo más robusto frente a phishing son FIDO2/WebAuthn y las *passkeys*. El ENS exige doble factor para accesos remotos y en categorías media y alta.

### Medidas técnicas en el puesto

- **Actualizaciones** del sistema y aplicaciones (parches).
- **Mínimo privilegio**: usuario sin derechos de administrador; UAC en Windows.
- **Antimalware y EDR** (Microsoft Defender, soluciones EDR); cortafuegos local.
- **Cifrado de disco**: BitLocker (Windows), **FileVault** (macOS) **[Salió 2018]**, LUKS (Linux).
- **Control de aplicaciones**: AppLocker o WDAC (Windows), **Gatekeeper** (macOS, solo apps firmadas o notarizadas), SELinux o AppArmor (Linux).
- macOS también incluye XProtect (antimalware) y SIP (protección de la integridad del sistema).
- Control de dispositivos USB y medios extraíbles; bloqueo automático de pantalla.
- Navegador actualizado, sin extensiones innecesarias; correo con filtrado de adjuntos.
- Copias de seguridad y concienciación frente a phishing e ingeniería social.

Herramientas del CCN útiles en el puesto: **microCLAUDIA** (vacuna contra ransomware), **CLARA** (cumplimiento ENS en Windows), **CARMEN** (detección de amenazas avanzadas) y **INES** (estado de seguridad).

En 2018 los distractores fueron Trello (gestor de tareas), Finder (explorador de archivos) y Gatekeeper.

## Seguridad en el desarrollo de aplicaciones

### Ciclo de vida seguro (S-SDLC)

S-SDLC significa *Secure Software Development Life Cycle*. Es una metodología, no un tipo de análisis **[Salió 2022]**. Integra seguridad en cada fase:

- **Requisitos**: requisitos de seguridad (OWASP ASVS), casos de abuso.
- **Diseño**: modelado de amenazas (STRIDE), mínimo privilegio, defensa en profundidad.
- **Codificación**: guías de codificación segura, revisión de código.
- **Pruebas**: SAST, DAST, IAST, SCA, pruebas de penetración.
- **Despliegue y operación**: bastionado, gestión de secretos, monitorización, parches.

| Análisis | Qué hace |
|---|---|
| SAST | Análisis estático del código fuente sin ejecutarlo (caja blanca). Ej.: SonarQube, Semgrep |
| DAST | Pruebas sobre la aplicación en ejecución (caja negra). Ej.: OWASP ZAP, Burp Suite |
| IAST | Agente dentro de la aplicación durante las pruebas; combina ambos |
| SCA | Análisis de dependencias de terceros y sus vulnerabilidades. Ej.: OWASP Dependency-Check |
| RASP | Protección en tiempo de ejecución desde dentro de la aplicación |

STRIDE: suplantación (*Spoofing*), manipulación (*Tampering*), repudio, revelación de información, denegación de servicio, elevación de privilegios.

### OWASP

**OWASP** (*Open Worldwide Application Security Project*) es una fundación abierta. Proyectos clave: Top 10, ASVS (estándar de verificación, versión 5.0 de 2025), SAMM (modelo de madurez), ZAP, Dependency-Check, Cheat Sheet Series, MASVS (móviles) y Top 10 para aplicaciones LLM.

| Puesto | Top 10 2021 | Top 10 2025 |
|---|---|---|
| A01 | Broken Access Control | Broken Access Control |
| A02 | Cryptographic Failures | Security Misconfiguration |
| A03 | Injection (incluye XSS) | Software Supply Chain Failures |
| A04 | Insecure Design | Cryptographic Failures |
| A05 | Security Misconfiguration | Injection |
| A06 | Vulnerable and Outdated Components | Insecure Design |
| A07 | Identification and Authentication Failures | Authentication Failures |
| A08 | Software and Data Integrity Failures | Software or Data Integrity Failures |
| A09 | Security Logging and Monitoring Failures | Logging and Alerting Failures |
| A10 | Server-Side Request Forgery (SSRF) | Mishandling of Exceptional Conditions |

La lista 2025 se presentó en noviembre de 2025. SSRF se integra en Broken Access Control. En 2017 XSS era A7 propio; desde 2021 forma parte de Injection. CSRF salió del Top 10 en 2017 (era A8 en 2013).

### Inyección SQL

El atacante introduce SQL en un dato de entrada para alterar la consulta **[Salió 2017, 2019]**.

```java
// VULNERABLE: concatenación
String sql = "SELECT * FROM aspirantes WHERE num_opositor = " + entrada;
// Con entrada = "100 OR 1=1" la consulta queda:
// SELECT * FROM aspirantes WHERE num_opositor = 100 OR 1=1   -> devuelve todas las filas

// SEGURO: consulta parametrizada
PreparedStatement ps = con.prepareStatement(
    "SELECT * FROM aspirantes WHERE num_opositor = ?");
ps.setInt(1, Integer.parseInt(entrada));
ResultSet rs = ps.executeQuery();
```

Otras defensas: procedimientos almacenados seguros, ORM con parámetros, validación por lista blanca, cuenta de BD con mínimo privilegio. Variantes de inyección: comandos del SO, LDAP, XPath, CRLF (cabeceras HTTP).

### Cross-Site Scripting (XSS)

El atacante consigue que el navegador de la víctima ejecute su script en el contexto del sitio. Tipos: **reflejado**, **almacenado** y **basado en DOM**.

Prevención según OWASP **[Salió 2025]**:

- **Codificar o escapar la salida** según el contexto (HTML, atributo, JavaScript, URL, CSS). Es la defensa principal.
- Validar la entrada (lista blanca) como defensa complementaria.
- Usar plantillas que escapan por defecto (Thymeleaf, React, Angular).
- Sanear el HTML permitido con librerías como DOMPurify.
- **Content-Security-Policy** para limitar el origen de los scripts.
- Cookies con **HttpOnly** para que JavaScript no pueda leerlas.

```javascript
// VULNERABLE
div.innerHTML = 'Hola ' + nombre;   // nombre = <img src=x onerror=alert(1)>
// SEGURO
div.textContent = 'Hola ' + nombre; // se muestra como texto, no se ejecuta
```

### Cross-Site Request Forgery (CSRF)

**Cross-Site Request Forgery**: fuerza al usuario autenticado a ejecutar acciones no deseadas en la aplicación **[Salió 2022]**. El navegador envía la cookie de sesión automáticamente.

Defensas:

- **Token anti-CSRF** aleatorio, ligado a la sesión y al formulario, con caducidad **[Salió 2017]**.
- Atributo **SameSite** en la cookie de sesión.
- Comprobar las cabeceras `Origin` o `Referer` como apoyo (no basta solo: la cabecera puede faltar).
- Reautenticación o confirmación para operaciones críticas.
- No usar GET para operaciones que cambian el estado.
- Redirigir HTTP a HTTPS no protege frente a CSRF (distractor de 2017).

```html
<form method="post" action="/transferir">
  <input type="hidden" name="_csrf" value="9f8a7c...aleatorio">
  ...
</form>
```

### Cookies seguras

```
Set-Cookie: JSESSIONID=abc123; Secure; HttpOnly; SameSite=Strict; Path=/
```

| Atributo | Efecto |
|---|---|
| Secure | Solo se envía por HTTPS |
| HttpOnly | No accesible desde JavaScript (mitiga robo por XSS) |
| SameSite=Strict | Solo se envía si la petición se origina en el mismo sitio **[Salió 2022]** |
| SameSite=Lax | También en navegación de nivel superior con GET desde otro sitio; valor por defecto en Chrome |
| SameSite=None | Se envía siempre; exige Secure |
| Domain y Path | Ámbito de dominios y rutas a los que se envía |
| Expires o Max-Age | Caducidad; sin ellos es cookie de sesión |

### CORS y cabeceras de seguridad

La **política del mismo origen** impide a un script leer respuestas de otro origen (esquema, host y puerto). **CORS** (*Cross-Origin Resource Sharing*) es la configuración del servidor que relaja esa política para orígenes concretos **[Salió 2024]**.

```
Access-Control-Allow-Origin: https://app.ejemplo.gob.es
Access-Control-Allow-Methods: GET, POST
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
```

Para métodos o cabeceras no simples, el navegador envía antes una petición de verificación previa (*preflight*) con OPTIONS. No combines `Access-Control-Allow-Origin: *` con credenciales.

```java
// Spring Boot: solo el frontend puede llamar a la API
@CrossOrigin(origins = "https://app.ejemplo.gob.es")
@RestController
public class ApiController { ... }
```

| Cabecera | Protege frente a |
|---|---|
| Strict-Transport-Security (HSTS) | Fuerza HTTPS; evita degradación a HTTP |
| Content-Security-Policy (CSP) | Limita orígenes de scripts y recursos; mitiga XSS |
| X-Frame-Options o CSP frame-ancestors | Clickjacking |
| X-Content-Type-Options: nosniff | Interpretación errónea del tipo MIME |
| Referrer-Policy | Fuga de URL en la cabecera Referer |

### Otras buenas prácticas de codificación segura

- **Autenticación**: contraseñas con hash lento y sal (Argon2id, bcrypt, PBKDF2), nunca MD5 ni SHA-1; MFA; bloqueo ante fuerza bruta.
- **Sesiones**: identificador aleatorio, regenerado tras el login; caducidad.
- **Control de acceso** en el servidor, denegado por defecto; comprobar propiedad del recurso (evita IDOR).
- **Errores**: mensajes genéricos al usuario, detalle solo en el log; sin trazas de pila en producción.
- **Secretos** fuera del código (gestor de secretos, variables de entorno).
- **Dependencias** actualizadas y SBOM (lista de componentes).
- **Registros** de eventos de seguridad sin datos sensibles.

El **Reglamento (UE) 2024/2847 de Ciberresiliencia** exige seguridad desde el diseño en productos con elementos digitales. Las obligaciones de notificación empiezan en septiembre de 2026; el resto, en diciembre de 2027.

## Trampas y respuestas desactualizadas

- **WCAG 1.0 (2007, 2008)**: las preguntas de prioridades 1, 2 y 3 y "Doble-A = P1 y P2" están obsoletas. Hoy no hay prioridades, sino niveles de criterios.
- **UNE-EN 301549:2019 (2018)**: era la correcta entonces. Hoy la vigente es UNE-EN 301549:2022 (V3.2.1). UNE 139803:2012 ya no es la referencia.
- **WCAG 2.1 frente a 2.2**: la vigente del W3C es 2.2; la exigida legalmente (vía EN 301 549) sigue siendo 2.1 AA.
- **4.1.1 Procesamiento**: existe en 2.0 y 2.1 (nivel A), pero se eliminó en 2.2.
- **Número de pautas**: 12 en WCAG 2.0 (2015 lo preguntó así) y 13 desde 2.1.
- **Ataques epilépticos y Distinguible**: la pauta 2.3 es de Operable, no de Perceptible. "Distinguible" es ver y oír y separar primer plano y fondo, no "presentar de diferentes formas" (eso es Adaptable).
- **Plazo del RD 1112/2018**: veinte días **hábiles**. Los distractores cambian a naturales o a diez días.
- **Primera revisión**: dos años para webs, tres para apps. En 2019 la incorrecta decía dos años para apps.
- **Rango normativo**: es un Real Decreto, no Ley, Ley Orgánica ni Orden Ministerial.
- **ATAG frente a UAAG**: herramientas de autor frente a agentes de usuario.
- **S-SDLC**: no es un análisis y su expansión real es *Secure Software Development Life Cycle*.
- **OWASP Top 10**: las listas de 2013 y 2017 tenían XSS y CSRF como categorías; en 2021 XSS entra en Injection. La edición vigente es la de 2025.
- **CSRF y Referer**: comprobar el Referer no es la defensa principal; lo es el token.
- **HSTS, CSP, TLS y CORS (2024)**: solo CORS restringe qué orígenes pueden llamar a la API.
- **X-XSS-Protection**: cabecera obsoleta; los navegadores modernos la ignoran. Usa CSP.
- **SameSite por defecto**: desde 2020 Chrome trata las cookies sin SameSite como Lax.
- **ISO 25010**: en la versión 2023 la "usabilidad" pasa a llamarse "capacidad de interacción".
- **OWASP**: hoy significa *Open Worldwide Application Security Project* (antes *Open Web*).
- **SMS como MFA**: válido como segundo factor, pero desaconsejado frente a FIDO2 o apps.
- **MFA con dos biometrías (2025)**: la pregunta pedía cuál **NO** es MFA y la respuesta es "Escáner de Iris + Huella dactilar", porque ambos son del mismo factor (algo que se es). Lee bien el «NO»: contraseña + OTP, contraseña + iris y tarjeta + reconocimiento facial sí combinan factores distintos.
- **XSS (2025)**: la plantilla da "validar y escapar los datos antes de mostrarlos". Coincide con OWASP: escapar la salida es la defensa principal y validar la entrada, la complementaria.
