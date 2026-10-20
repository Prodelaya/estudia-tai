# Tema 21. Aplicaciones web: HTML, CSS, XML, JavaScript y PHP

Peso en el examen: unas **3,4 preguntas de test** y **6,1 preguntas del supuesto III** por convocatoria (unos 17 puntos sobre 100). Es el tema que más puntúa de todo el temario. Hay **163 preguntas históricas** entre 2005 y 2025: unas 100 de supuesto III y unas 60 de test. Se concentran en cinco bloques. **HTML5** (etiquetas nuevas, formularios y sus atributos, multimedia, APIs) suma unas 40. **JavaScript** (DOM, eventos, AJAX, fetch, fechas, trazas) unas 35. **XML** y derivados (bien formado, DTD, XPath, XQuery, XSLT, APIs Java) unas 30. **PHP** (arrays, superglobales, MySQL, Laravel) unas 22. **CSS** (selectores, especificidad, cascada, Flexbox, unidades, preprocesadores) unas 13. El resto son frameworks, JSON y desarrollo móvil. En el supuesto de 2025 cayeron 5 preguntas seguidas de este tema (HTML, XML, fetch y JavaScript nativo).

## Cómo lo preguntan

- **"¿Qué atributo, etiqueta o evento hace X?"** dentro del supuesto: `maxlength` (2024), `required` (2019), `autofocus` y `type="color"` (2018), `pattern` y `datalist` (2015), `draggable` y `ondragenter` (2016), `onmouseover` (2024).
- **"¿Cuál de estos fragmentos es correcto/válido?"**: HTML5 con DOCTYPE (2025), XML bien formado (2019, 2025), atributo XML entre comillas (2025), JSON válido (2019), lista anidada (2019).
- **Trazas cortas**: bucle `while` en JavaScript (2019), validación de fechas (2005, 2008), PHP con `str_shuffle` (2018), trait PHP (2017), paso por referencia (2016).
- **Completar una línea de código** de un script dado: `mysqli_connect`, `mysqli_query`, `mysqli_fetch_assoc`, `$_POST`, `$_COOKIE`, `open("GET", URL, true)`, `onreadystatechange` (2016, supuesto entero de PHP y AJAX).
- **Cálculo de CSS**: especificidad de `input:required` (2024), cascada autor/usuario con `!important` (2017), combinador `div + p` (2017).
- **"¿Cuál NO es...?"**: unidad CSS no relativa (2024), framework que no es de JavaScript (2022), elemento no soportado en HTML5 (2016), concepto ajeno a la Web Semántica (2017), forma no válida de app móvil (2018).
- **Clasificar herramientas**: preprocesadores CSS (2016, 2017, 2019), Gulp como build system (2016), Django como framework Python (2019), Symfony frente a Laravel (2018), Gecko como motor de Mozilla (2022), Go como lenguaje backend (2022).
- **Literalidad de la norma**: "según el HTML Living Standard de WHATWG" (DOCTYPE, 2025) y "según la especificación XML del W3C" (elemento raíz, 2025).
- Tendencia: desde 2022 las preguntas son más fáciles y genéricas. Sustituyen al PHP detallado de 2016-2018 por HTML, XML, JSON y fetch.

## Aplicaciones web: front-end, back-end y modelos de renderizado

### Arquitectura básica

Una aplicación web sigue el modelo **cliente/servidor** sobre HTTP. El cliente es el navegador. El servidor web recibe la petición, ejecuta la lógica y devuelve HTML, JSON u otros recursos.

- **Front-end** (capa de presentación, lado cliente): HTML, CSS y JavaScript ejecutados en el navegador. También TypeScript, WebAssembly y los frameworks (React, Angular, Vue).
- **Back-end** (lado servidor): lógica de negocio, acceso a datos y seguridad. Lenguajes: PHP, Java (Jakarta EE, Spring), C# (ASP.NET Core), Python (Django, Flask, FastAPI), Ruby (Rails), JavaScript/TypeScript (Node.js con Express o NestJS), Go, Rust, Kotlin.
- **Full stack**: el desarrollador que cubre ambas partes.
- Separación habitual en tres capas: presentación, negocio y datos. El patrón de diseño típico en servidor es **MVC** (Modelo-Vista-Controlador).

**[Salió 2022]** "¿Qué lenguaje está relacionado con el backend?" → **Go**. Los distractores eran SASS (preprocesador CSS), XML (lenguaje de marcado) y Angular (framework front-end).

**[Salió 2025]** "¿Qué lenguaje ejecutan de forma nativa Chrome, Edge y Firefox?" → **JavaScript (ECMAScript 2022)**. Ni Python, ni Java, ni SQL se ejecutan de forma nativa en el navegador. El único otro lenguaje nativo es WebAssembly (formato binario, no lenguaje de script).

**[Salió 2008]** El código JavaScript se ejecuta en **el navegador web del cliente**. Hoy matizaríamos: también en servidor con Node.js, Deno o Bun.

### Modelos de renderizado

| Modelo | Dónde se genera el HTML | Ejemplos | Ventajas |
|---|---|---|---|
| MPA clásica | En el servidor, en cada petición | PHP, JSP, ASP.NET MVC | Simple, buen SEO |
| SPA (Single Page Application) | En el cliente, con JavaScript | React, Angular, Vue | Fluidez, sin recargas |
| SSR (Server Side Rendering) | En el servidor; luego se "hidrata" en cliente | Next.js, Nuxt, Angular SSR | Primera carga rápida, SEO |
| SSG (Static Site Generation) | En tiempo de compilación | Astro, Hugo, Jekyll, Gatsby | Máximo rendimiento, CDN |
| ISR | Estático regenerado cada cierto tiempo | Next.js | Mezcla de SSG y SSR |

- **Hidratación**: el cliente recibe HTML ya pintado y JavaScript le "engancha" los eventos.
- **CSR** (Client Side Rendering) es el nombre del renderizado en cliente de una SPA.

**[Salió 2024]** Formulario extenso con muchas consultas de datos: ¿qué usar para renderizar la página en el servidor? → **Server Side Rendering**. Distractores: Server-Sent Events (envío de eventos servidor→cliente), AJAX (peticiones asíncronas desde cliente) y WebSocket (canal bidireccional).

### Comunicación cliente-servidor en tiempo real

| Técnica | Dirección | Base | Uso típico |
|---|---|---|---|
| AJAX / fetch | Cliente pide, servidor responde | HTTP | Cargar datos sin recargar la página |
| Long polling | El servidor retiene la respuesta | HTTP | Simular tiempo real (antiguo) |
| SSE (Server-Sent Events) | Solo servidor → cliente | HTTP, `text/event-stream`, objeto `EventSource` | Notificaciones, cotizaciones |
| WebSocket | Bidireccional, full-duplex | Handshake HTTP con `Upgrade`, luego tramas sobre TCP; esquemas `ws://` y `wss://` | Chat, juegos, colaboración |
| WebTransport | Bidireccional | HTTP/3 (QUIC) | Baja latencia |
| Web Push | Servidor → dispositivo, aunque la web esté cerrada | Service Worker + Push API | Notificaciones push |

**AJAX** (Asynchronous JavaScript And XML) no es un lenguaje. Es una técnica: JavaScript pide datos al servidor en segundo plano y actualiza parte del DOM. Pese al nombre, hoy se intercambia casi siempre JSON.

### Herramientas del front-end moderno

- **Node.js**: entorno de ejecución de JavaScript fuera del navegador, construido sobre el motor **V8** de Google (escrito en C++). **[Salió 2019]** como distractor: "Node.js fue construido con el motor de Java JRE 1.9" es falso.
- **npm**, **Yarn**, **pnpm**: gestores de paquetes de JavaScript. Fichero `package.json`.
- **Bundlers** (empaquetadores): Webpack, Vite, Rollup, Parcel, esbuild, Turbopack.
- **Task runners** (automatizadores de tareas): **Gulp** y **Grunt**. Automatizan minificación, concatenación y compilación de Sass. **[Salió 2016]** "Sistema de construcción que automatiza la minificación de JavaScript" → **Gulp**. Distractores: Bitbucket (repositorio Git), Babel y Traceur (transpiladores).
- **Transpiladores**: **Babel** convierte JavaScript moderno a versiones antiguas. **TypeScript** (Microsoft) es un superconjunto tipado de JavaScript que se compila a JavaScript.
- **Linters y formateadores**: ESLint, Prettier.
- **Pruebas**: Jest, Vitest, Mocha, Jasmine, Karma; end-to-end con Cypress, Playwright, Selenium.
- **Postman**: herramienta para probar APIs REST. **[Salió 2019]** Afirmar que "no permite validar servicios REST" era falso.

### Frameworks y bibliotecas del front-end

| Nombre | Tipo | Autor | Notas |
|---|---|---|---|
| React | Biblioteca de UI | Meta | Componentes, JSX, DOM virtual |
| Angular | Framework completo | Google | TypeScript, inyección de dependencias, RxJS |
| AngularJS | Framework (versión 1.x) | Google | Sin soporte desde enero de 2022 |
| Vue.js | Framework progresivo | Evan You | Plantillas, reactividad |
| Svelte | Compilador de componentes | Rich Harris | Sin DOM virtual |
| jQuery | Biblioteca | John Resig | `$()`, `$.ajax`; hoy en desuso |
| Next.js / Nuxt | Meta-frameworks | Vercel / comunidad | SSR y SSG sobre React / Vue |
| Bootstrap | Framework CSS (con componentes JS) | Twitter | Rejilla de 12 columnas, responsive |
| Tailwind CSS | Framework CSS de utilidades | Tailwind Labs | Clases atómicas |
| Ember, Backbone, Polymer | Frameworks JS antiguos | Varios | Poco usados hoy |

**[Salió 2022]** "¿Cuál NO es un framework para JavaScript?" → **JDBC** (API de Java para bases de datos). Ojo: Bootstrap figuraba como opción y no era la respuesta, porque incluye componentes JavaScript.

**[Salió 2022]** "Conjunto de herramientas de presentación y comportamiento con componentes para la parte dinámica del frontal HTML" → **Bootstrap**. Distractores: NumPy y TensorFlow (Python), ActiveMQ (mensajería).

## Aplicaciones multiplataforma y móviles

### Formas de desarrollar una app móvil

| Enfoque | Cómo funciona | Tecnologías |
|---|---|---|
| Nativa | Código específico de cada plataforma | Android: Kotlin, Java (Android Studio). iOS: Swift, Objective-C (Xcode) |
| Web móvil / responsive | Web normal adaptada al tamaño de pantalla | HTML, CSS, JS, media queries |
| PWA (Progressive Web App) | Web instalable, con trabajo sin conexión | Service Worker, Web App Manifest, HTTPS |
| Híbrida | Web dentro de un contenedor nativo (WebView) | Apache Cordova (antes PhoneGap), Ionic, Capacitor |
| Multiplataforma compilada o con renderizado propio | Un código, apps nativas para varias plataformas | React Native, Flutter (Dart), .NET MAUI (sucesor de Xamarin), Kotlin Multiplatform |

**[Salió 2018]** "¿Cuál NO es una opción para desarrollar una app móvil?" → **"aplicaciones web graduales"** (no existen). Sí existen nativas, híbridas y web progresivas.

**[Salió 2017]** Framework para desarrollar aplicaciones móviles → **Ionic**. Distractores: Atom (editor), Ark y ZTE (fabricante).

Datos para preguntas nuevas:

- **PhoneGap** se discontinuó en 2020. **Xamarin** perdió soporte en mayo de 2024; lo sustituye **.NET MAUI**.
- **WebView**: componente nativo que muestra contenido web dentro de una app. Es la base de las híbridas.
- Una **PWA** necesita HTTPS, un **manifiesto** (`manifest.json` o `.webmanifest`, con nombre, iconos, `start_url`, `display`) y un **Service Worker** (script en segundo plano que intercepta peticiones y gestiona caché y push).

### Notificaciones push

- **Push nativo móvil**: Android usa **Firebase Cloud Messaging (FCM)**; iOS usa **Apple Push Notification service (APNs)**.
- **Web Push**: estándar W3C (Push API + Notifications API) apoyado en el Service Worker. Usa el protocolo Web Push (RFC 8030) y claves VAPID.
- **[Salió 2022]** Tecnología para recibir notificaciones nativas en smartphones → **Mobile push**. Distractores: WebView, CDMA, Wi-Fi.

### Diseño de interfaz y diseño responsive

- **Material Design**: sistema de diseño de **Google** (2014; versión actual Material 3 y su variante "Expressive"). Pautas, componentes y herramientas. **[Salió 2022]**
- **Human Interface Guidelines**: las pautas de Apple. **Fluent Design**: las de Microsoft.
- Distractores frecuentes: WCAG 2.1 y WAI-ARIA son de accesibilidad (tema 22). "Inclusive Design" es una filosofía de diseño, no un sistema de Google.

**Diseño web responsive** (adaptativo o "responsivo", término de Ethan Marcotte, 2010): una misma página y una misma plantilla se adaptan a cualquier pantalla. Se basa en tres pilares:

1. **Rejillas fluidas** con anchos proporcionales (%, `fr`, `vw`).
2. **Imágenes flexibles** (`max-width: 100%`, `srcset`, `picture`).
3. **Media queries** de CSS3.

Se completa con la etiqueta `meta viewport` y el enfoque **mobile first** (estilos base para móvil y `min-width` para pantallas grandes).

**[Salió 2017]** Característica que NO corresponde al responsive → que sea **adecuado para proyectos que necesitan diseños distintos y específicos por dispositivo**. Eso es el **diseño adaptativo** (*adaptive*): varias plantillas fijas, una por tipo de dispositivo, o un sitio móvil aparte (m.ejemplo.com).

**[Salió 2006, supuesto IV]** Acceso a la web corporativa desde una PDA. Hoy la respuesta sería diseño responsive o una app; entonces se hablaba de WAP/WML y páginas adaptadas.

## HTML

### Historia, versiones y organismos

| Versión | Año | Organismo | Notas |
|---|---|---|---|
| HTML 2.0 | 1995 | IETF (RFC 1866) | Primera especificación formal, basada en SGML |
| HTML 3.2 | 1997 | W3C | Tablas, applets |
| HTML 4.01 | 1999 | W3C | Variantes Strict, Transitional y Frameset; CSS para la presentación |
| XHTML 1.0 | 2000 | W3C | HTML 4.01 reformulado como XML |
| XHTML 1.1 | 2001 | W3C | Modular; XHTML 2.0 se abandonó en 2009 |
| HTML5 | 2014 | W3C (Recomendación) | Semántica, multimedia, APIs; HTML 5.1 (2016) y 5.2 (2017) |
| HTML Living Standard | desde 2019 | WHATWG | Estándar "vivo" único, sin números de versión |

- **SGML** (ISO 8879, 1986) es el metalenguaje del que derivan HTML (hasta la 4.01) y XML.
- **XML** es un subconjunto simplificado de SGML. **XHTML** es HTML escrito con las reglas de XML.
- **[Salió 2007]** Relación entre lenguajes → **"XML cumple SGML"**. Falso: "HTML cumple XML" y "XHTML no cumple XML".
- **WHATWG** (Web Hypertext Application Technology Working Group): fundado en 2004 por Apple, Mozilla y Opera. Desde el acuerdo de mayo de 2019 con el W3C, el **HTML Living Standard** de WHATWG es la única especificación de HTML y del DOM.
- HTML5 ya no se define sobre SGML. Tiene su propio algoritmo de análisis (*parsing*), muy tolerante a errores.

### Estructura mínima de un documento

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>EducaData</title>
  <link rel="stylesheet" href="estilos.css">
  <script src="app.js" defer></script>
</head>
<body>
  <div id="alumnos"></div>
</body>
</html>
```

- **DOCTYPE**: va **en la primera línea, antes del elemento raíz `html`** **[Salió 2025]**. En HTML5 es simplemente `<!DOCTYPE html>`, no distingue mayúsculas. Sin él, el navegador entra en **modo quirks** (compatibilidad con errores antiguos).
- Solo puede ir precedido de comentarios, espacios o la marca BOM.
- **[Salió 2025, supuesto]** Estructura HTML5 válida → la que lleva `<!DOCTYPE html>`, `html`, `head` con `title` y `body`. Los distractores eran: sin DOCTYPE, `<html version="5">` con una etiqueta inventada `container`, y `<!HTML5>`.
- `title` es el único elemento obligatorio dentro de `head` (salvo que el protocolo de transporte aporte el título).
- **DOCTYPE de HTML 4.01 Strict** (para reconocerlo): `<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">`.

### Elementos de head

| Elemento | Uso |
|---|---|
| `title` | Título de la pestaña y de los buscadores |
| `meta` | Metainformación: `charset`, `name`/`content` (description, keywords, author, viewport, robots), `http-equiv` (refresh, Content-Security-Policy) |
| `link` | Recursos externos: hojas de estilo, iconos, `preload`, `manifest` |
| `style` | CSS interno |
| `script` | JavaScript interno o externo (`src`), con `async`, `defer` o `type="module"` |
| `base` | URL base para rutas relativas y destino por defecto de los enlaces (`target`) |
| `noscript` | Contenido si JavaScript está desactivado |

- **[Salió 2008]** La etiqueta `meta` tiene dos usos: **contenedor de metainformación del documento** o **de información adicional, incluidos comandos** (`http-equiv`, por ejemplo `refresh`). El distractor del "directorio base para URL relativas" describe a `base`.
- **[Salió 2015]** Etiqueta que hace que todos los enlaces se abran en ventana nueva → **`<base target="_blank">`**.
- Valores de `target`: `_blank` (nueva ventana o pestaña), `_self` (mismo marco, por defecto), `_parent` (marco padre), `_top` (ventana completa).
- `script` con **`defer`**: se descarga en paralelo y se ejecuta al terminar el análisis del HTML, en orden. Con **`async`**: se ejecuta en cuanto llega, sin orden garantizado.

### Texto, enlaces e imágenes

- Encabezados `h1` a `h6`; párrafo `p`; salto de línea `br` (vacío); línea horizontal `hr`.
- Énfasis semántico: `strong` (importancia) y `em` (énfasis). Presentacional: `b`, `i`.
- **`u`**: en HTML 4 era "texto subrayado" (desaconsejado). En HTML5 se redefine como anotación no textual, por ejemplo una falta de ortografía. **[Salió 2008]** se aceptó "texto subrayado".
- Otros: `mark` (resaltado, nuevo), `small`, `sub`, `sup`, `abbr` (abreviatura), `cite`, `q`, `blockquote`, `code`, `pre`, `kbd`, `del` e `ins` (texto borrado e insertado), `time` (fecha, nuevo), `data`, `span` (en línea genérico) y `div` (bloque genérico).
- **Enlace**: `<a href="url">texto</a>`. Atributos: `href`, `target`, `download`, `rel` (`noopener`, `nofollow`), `hreflang`. Enlace a un ancla: `href="#seccion"`. Correo: `href="mailto:..."`.
- **Imagen**: `<img src="foto.jpg" alt="Descripción" width="300" height="200">`. Es un elemento vacío. **[Salió 2008]** `img` es la etiqueta de imagen.
- `alt` es el **texto alternativo**: lo leen los lectores de pantalla y se muestra si la imagen no carga. No es un pie de foto ni un *tooltip* (para eso está `title`).

```html
<a href="https://www.boe.es"><img src="foto.jpg" alt="Acceso al BOE"/></a>
```

**[Salió 2018]** Si `foto.jpg` existe, se ve **la imagen como hipervínculo** a boe.es. El texto "Acceso al BOE" solo aparecería si la imagen no cargara.

**[Salió 2005]** `<a href:="europa.htm">Mapa de Europa<la>` está mal escrito: `href:=` no es el atributo `href` y `<la>` no cierra el enlace. El navegador, tolerante, mostraría el texto "Mapa de Europa" pero sin destino válido (respuesta oficial sin verificar).

- **Imágenes adaptables**: atributo `srcset` con descriptores `1x`/`2x` o anchos `480w`, más `sizes`. Elemento `picture` con varios `source` y un `img` final de respaldo. Carga diferida: `loading="lazy"`.

### Listas

| Tipo | Etiqueta | Elementos |
|---|---|---|
| Ordenada (numerada) | `ol` | `li`; atributos `type` (1, a, A, i, I), `start`, `reversed` |
| Desordenada (viñetas) | `ul` | `li` |
| De descripción (definición) | `dl` | `dt` (término) y `dd` (descripción) |

- **[Salió 2006]** Lista numerada → **`ol`**.
- **[Salió 2008]** Afirmación falsa: "`td` identifica una fila". `td` es una **celda**; la fila es `tr`.
- **Lista anidada** **[Salió 2019]**: la sublista `ul` va **dentro del `li`** padre, antes de cerrarlo.

```html
<ul>
  <li>Opositor
    <ul>
      <li>Nota 1</li>
      <li>Nota 2</li>
    </ul>
  </li>
</ul>
```

### Tablas

```html
<table>
  <caption>Procesos selectivos</caption>
  <thead>
    <tr><th scope="col">Proceso</th><th scope="col">Plazas</th></tr>
  </thead>
  <tbody>
    <tr><td>TAI</td><td>500</td></tr>
  </tbody>
  <tfoot>
    <tr><td colspan="2">Fuente: BOE</td></tr>
  </tfoot>
</table>
```

- `tr` fila, `td` celda de datos, **`th` celda de encabezado** **[Salió 2019]** (se muestra en negrita y centrada por defecto). Distractores inventados: `tableheader`, `theader`, `tableh`.
- `caption` (título de la tabla), `thead`, `tbody`, `tfoot`, `colgroup`, `col`.
- Fusión de celdas: `colspan` (columnas) y `rowspan` (filas).
- `scope` y `headers` ayudan a la accesibilidad. Las tablas son para datos tabulares, nunca para maquetar **[Salió 2025, supuesto, en accesibilidad]**.

### Elementos semánticos de HTML5

| Elemento | Significado |
|---|---|
| `header` | Cabecera de la página o de una sección |
| `nav` | Bloque de navegación principal |
| `main` | Contenido principal; uno visible por página |
| `section` | Sección temática con encabezado |
| `article` | Contenido independiente y reutilizable (noticia, entrada, comentario) |
| `aside` | Contenido **tangencial** al principal (barra lateral, notas) |
| `footer` | Pie de la página o de una sección |
| `figure` y `figcaption` | Contenido autónomo (imagen, diagrama, código) con su leyenda |
| `details` y `summary` | Bloque desplegable |
| `dialog` | Cuadro de diálogo o ventana modal |
| `mark` | Texto resaltado |
| `time` | Fecha u hora legible por máquina (`datetime`) |
| `progress` | Barra de progreso de una tarea |
| `meter` | Medida dentro de un rango conocido (nivel de batería) |
| `output` | Resultado de un cálculo |
| `template` | Fragmento HTML inerte para clonar con JavaScript |
| `search` | Zona de búsqueda (añadido en 2023) |

- **[Salió 2016]** `aside` → **contenido tangencial al principal**. No necesita atributos `left`/`right`, no está obsoleto y no existía en HTML 4.01.
- **[Salió 2017]** Etiqueta nueva de HTML5 → **`dialog`**. Ya existían `noscript`, `abbr` y `del`.
- **[Salió 2018]** Etiqueta nueva de HTML5 → **`progress`**. Inventadas: `socialmedia`, `blog`, `navigation`.
- **[Salió 2016]** Elemento NO soportado en HTML5 → **`applet`**. Sí siguen `article`, `body` y `caption`.
- La semántica mejora la **accesibilidad** y el SEO. **[Salió 2025, supuesto]** Las WCAG 2.1 recomiendan estructurar con `main`, `section` y `header` (tema 22).
- Otros nuevos de HTML5: `audio`, `video`, `source`, `track`, `canvas`, `embed` (estandarizado), `datalist`, `keygen` (ya eliminado), `wbr`, `ruby`, `rt`, `rp`, `picture` (2014-2015), `slot` (Web Components).

**Figura con dos imágenes** **[Salió 2017]**:

```html
<figure>
  <img src="sede1.jpg" alt="Sede central">
  <img src="sede2.jpg" alt="Sede norte">
  <figcaption>Sedes del organismo</figcaption>
</figure>
```

`figcaption` puede ir como primer o último hijo de `figure`.

### Elementos eliminados u obsoletos en HTML5

| Eliminado | Alternativa |
|---|---|
| `applet` | `object` o `embed` (Java applets ya no se ejecutan) |
| `acronym` | `abbr` |
| `basefont`, `big`, `center`, `font`, `strike`, `tt` | CSS |
| `frame`, `frameset`, `noframes` | `iframe` o maquetación con CSS |
| `dir` | `ul` |
| `isindex` | `form` con `input` |
| `keygen` | Web Crypto API (se retiró de la especificación en 2017-2018) |
| Atributos `align`, `bgcolor`, `border` (en tablas), `width` en `td` | CSS |

**[Salió 2016]** `keygen` generaba un par de claves al enviar un formulario. Su atributo **`keytype`** admitía **`rsa`**, `dsa` y **`ec`** (curva elíptica). Hoy está eliminado.

### Formularios

```html
<form action="/solicitud" method="post" enctype="multipart/form-data" novalidate>
  <label for="nif">NIF</label>
  <input id="nif" name="nif" type="text" autofocus required
         pattern="[0-9]{8}[A-Z]" placeholder="12345678Z">
  <label for="email">Correo</label>
  <input id="email" name="email" type="email" maxlength="100">
  <button type="submit">Enviar</button>
</form>
```

Atributos de `form`:

- `action`: URL que procesa los datos. `method`: `get` (datos en la URL) o `post` (en el cuerpo). También `dialog`.
- `enctype`: `application/x-www-form-urlencoded` (por defecto), **`multipart/form-data`** (obligatorio para subir ficheros) o `text/plain`.
- `novalidate`: desactiva la validación del navegador. `autocomplete="on|off"` para todo el formulario.

**Tipos de `input`** (los marcados con asterisco son nuevos en HTML5):

| Tipo | Control |
|---|---|
| `text`, `password`, `hidden` | Texto, contraseña, oculto |
| `checkbox`, `radio` | Casilla y botón de opción |
| `submit`, `reset`, `button`, `image` | Botones |
| `file` | Selección de fichero (`accept`, `multiple`) |
| `email`*, `url`*, `tel`*, `search`* | Texto con validación o teclado específico |
| `number`*, `range`* | Número y deslizador (`min`, `max`, `step`) |
| `date`*, `time`*, `datetime-local`*, `month`*, `week`* | Fechas y horas |
| `color`* | Selector de color |

- **[Salió 2018]** Selector de color → **`<input type="color">`**. Distractores inventados: `uipicker`, `selector`. `range` es un deslizador.
- El tipo `datetime` (sin `-local`) se eliminó de la especificación.

**Atributos de validación y comportamiento de `input`**:

| Atributo | Función |
|---|---|
| `required` | Campo obligatorio **[Salió 2019]** |
| `maxlength` / `minlength` | Longitud máxima/mínima en caracteres **[Salió 2024]** |
| `min` / `max` / `step` | Valores numéricos o de fecha (no longitud) |
| `size` | Ancho visible en caracteres (no limita lo que se escribe) |
| `pattern` | Expresión regular que debe cumplir el valor completo **[Salió 2015, 2018]** |
| `placeholder` | Texto de ayuda que desaparece al escribir |
| `autofocus` | El campo recibe el foco al cargar **[Salió 2018]** |
| `autocomplete` | `on`/`off` o un token (`email`, `name`, `new-password`): autocompletar con valores previos **[Salió 2015]** |
| `list` | Asocia un `datalist` de sugerencias **[Salió 2015]** |
| `readonly` | No editable, pero se envía |
| `disabled` | No editable y **no se envía** |
| `multiple` | Varios valores (`email`, `file`) |
| `form` | Asocia el control a un formulario por su `id` aunque esté fuera |
| `name` | Nombre con el que se envía el dato al servidor |
| `id` | Identificador único en el documento (para `label`, CSS y JavaScript) |

- **[Salió 2024]** Limitar el e-mail a 100 caracteres → **`maxlength="100"`**. Trampas: `size` (solo ancho visual), `max` (valor numérico), `length` (no existe).
- **[Salió 2019]** Campo obligatorio → **`required`**. Inventados: `enforced`, `mandatory`, `compulsory`.
- **[Salió 2005]** `name` identifica el dato enviado al servidor; `id`, el elemento en el documento; `maxlength`, el máximo de caracteres; `class`, la clase CSS.
- **[Salió 2015]** Validar texto en mayúsculas → `pattern="[A-Z]+"` (o `[A-Z]*`). `pattern` se ancla implícitamente al principio y al final: no hacen falta `^` ni `$`.

**Patrón de contraseña robusta** **[Salió 2018]**: 6 o más caracteres con al menos un dígito, una minúscula y una mayúscula, en cualquier orden. Se resuelve con **búsquedas anticipadas** (*lookahead*):

```html
<input type="password" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}">
```

`(?=.*\d)` comprueba que "más adelante hay un dígito" sin consumir caracteres. `.{6,}` exige al menos 6 caracteres.

**`datalist`**: lista de sugerencias para un `input` de texto, que admite también valores libres **[Salió 2015]**.

```html
<input list="provincias" name="provincia">
<datalist id="provincias">
  <option value="Madrid">
  <option value="Sevilla">
</datalist>
```

Otros controles: `select` con `option` y `optgroup` (atributos `multiple`, `size`, `selected`), `textarea` (`rows`, `cols`), `button`, `fieldset` con `legend`, `label` (atributo `for` = `id` del control), `output`.

**Desplegable cargado con datos** **[Salió 2008]**:

```html
<select id="materia" name="materia" onchange="cambiaMateria(this)">
  <option value="">-- Elija --</option>
  <option value="1">Matemáticas</option>
  <option value="2">Lengua</option>
</select>
```

### Multimedia y gráficos

```html
<video width="320" height="240" controls>
  <source src="movie.mp4" type="video/mp4">
  <source src="movie.ogg" type="video/ogg">
  No soportado
</video>

<audio controls autoplay>
  <source src="audio.mp3" type="audio/mpeg">
</audio>
```

- `audio` y `video` son nuevos en HTML5. Atributos booleanos: **`controls`**, **`autoplay`**, `loop`, `muted`, `preload` (`none`, `metadata`, `auto`), `poster` (solo vídeo, imagen previa).
- El navegador recorre los `source` **en orden** y usa **el primero cuyo formato soporte**. El texto final solo se ve en navegadores sin soporte de `video`. **[Salió 2019]** Resultado → se muestra `movie.mp4` si el navegador soporta MP4.
- **[Salió 2018]** Audio que arranca al cargar y con controles → **`<audio controls autoplay>`**. Inventados: `autorun`, `played`.
- Hoy los navegadores bloquean el `autoplay` con sonido salvo interacción previa. Con `muted` sí se permite.
- `track` añade subtítulos en formato **WebVTT** (`kind="subtitles"`, `srclang`, `label`).
- Formatos: vídeo MP4 (H.264), WebM (VP8/VP9/AV1), Ogg (Theora); audio MP3, AAC, Ogg Vorbis, Opus, WAV.
- **`canvas`**: mapa de bits dibujado con JavaScript (`getContext("2d")` o WebGL). **SVG**: gráficos vectoriales en XML, integrables en línea.
- `iframe`: incrusta otra página (`sandbox`, `allow`, `loading`). `embed` y `object`: contenido externo.

### APIs de HTML5

| API | Para qué | Elementos clave |
|---|---|---|
| Web Storage | Guardar pares clave-valor en el navegador | `localStorage`, `sessionStorage` |
| IndexedDB | Base de datos NoSQL en el navegador, asíncrona | `indexedDB.open()` |
| Drag and Drop | Arrastrar y soltar | `draggable="true"`, eventos `drag*` |
| Geolocation | Posición del usuario (con permiso) | `navigator.geolocation.getCurrentPosition()` |
| Web Workers | Ejecutar JavaScript en hilos de fondo | `new Worker("w.js")`, `postMessage` |
| Service Workers | Proxy de red programable: caché offline, push | `navigator.serviceWorker.register()` |
| WebSocket | Comunicación bidireccional | `new WebSocket("wss://...")` |
| History | Cambiar la URL sin recargar (SPA) | `history.pushState()`, evento `popstate` |
| File API | Leer ficheros locales elegidos | `FileReader`, `Blob` |
| Canvas | Dibujo 2D/3D | `getContext()` |
| Notifications | Avisos del sistema | `Notification.requestPermission()` |
| Application Cache | Funcionamiento offline (**obsoleta y eliminada**) | `<html manifest="x.appcache">` |

**Web Storage** **[Salió 2015, 2016]**:

| | `localStorage` | `sessionStorage` | Cookies |
|---|---|---|---|
| Duración | Permanente, hasta que se borre | **Hasta cerrar la pestaña o ventana** | Hasta `Expires`/`Max-Age` o fin de sesión |
| Ámbito | Origen (esquema + host + puerto) | Origen y pestaña | Dominio y ruta |
| Tamaño | Unos 5-10 MB | Unos 5 MB | Unos 4 KB por cookie |
| ¿Viaja al servidor? | No | No | Sí, en cada petición |

```javascript
localStorage.setItem("tema", "oscuro");
let t = localStorage.getItem("tema");   // "oscuro"
localStorage.removeItem("tema");
sessionStorage.clear();
```

- **[Salió 2016]** Objeto que se borra al cerrar la ventana → **`window.sessionStorage`**.
- Solo guarda cadenas. Para objetos: `JSON.stringify` al guardar y `JSON.parse` al leer.

**Arrastrar y soltar** **[Salió 2016]**:

```html
<div id="caja" draggable="true" ondragstart="inicio(event)">Arrástrame</div>
<div id="destino" ondragover="event.preventDefault()" ondrop="soltar(event)"></div>
```

- Atributo **`draggable="true"`**.
- Eventos en el elemento arrastrado: `dragstart`, `drag`, `dragend`.
- Eventos en el receptor: **`dragenter`** (entra en el receptor), `dragover` (está encima; hay que llamar a `preventDefault()` para permitir soltar), `dragleave` (sale) y `drop` (se suelta).
- Los datos viajan en `event.dataTransfer` (`setData` y `getData`).

**Application Cache** **[Salió 2017]**: el atributo era **`manifest`** del elemento `html` (`<html manifest="ejemplo.appcache">`). Se declaró obsoleto y los navegadores lo eliminaron (Chrome en 2021). Hoy se usan **Service Workers** y la Cache API.

### HTML frente a XHTML

| Regla | HTML5 (sintaxis HTML) | XHTML |
|---|---|---|
| Mayúsculas en etiquetas | Indiferente | **Siempre minúsculas** |
| Cierre de elementos no vacíos | Algunos opcionales (`p`, `li`, `td`) | **Obligatorio** |
| Elementos vacíos | `<br>` | `<br />` |
| Comillas en atributos | Opcionales si no hay espacios | **Siempre**, también los numéricos |
| Atributos booleanos | `checked` | `checked="checked"` |
| Anidamiento | Tolerante a errores | Estricto (bien formado) |
| Elementos obligatorios | Se infieren `html`, `head`, `body` | `html`, `head`, `title`, `body` explícitos y `xmlns` en `html` |
| Tipo MIME | `text/html` | `application/xhtml+xml` |
| Ante un error | El navegador lo corrige | El analizador XML se detiene |

- **[Salió 2016]** Afirmación INCORRECTA sobre XHTML → "todos los atributos entre comillas **excepto los numéricos**". En XHTML todos van entre comillas.
- **[Salió 2024]** Diferencia entre HTML y XHTML → **en XHTML es obligatoria la presencia de un elemento estructural** (el elemento raíz `html` con sus partes). Las otras opciones invertían las reglas: era XHTML el que exigía minúsculas, cerrar elementos y comillas.

## CSS

### Conceptos y versiones

- **CSS** (Cascading Style Sheets, hojas de estilo en cascada) define la **presentación**: colores, fuentes, posiciones. HTML define la estructura y JavaScript el comportamiento.
- **[Salió 2022]** Lenguaje para cambiar el color de un botón → **CSS**. Distractores: XML, SGML y XSL (este último da estilo a XML, no a HTML).
- Versiones: CSS1 (1996), CSS2 (1998), **CSS 2.1** (Recomendación en 2011). Desde entonces CSS se divide en **módulos** independientes (Selectors Level 4, Flexbox, Grid, Cascade Level 5...). Por eso "CSS3" es un nombre informal y **no habrá CSS4**. El W3C publica "instantáneas" anuales (*CSS Snapshot*).
- Formas de incluir CSS: **externa** (`<link rel="stylesheet" href="x.css">`), **interna** (`<style>` en `head`), **en línea** (atributo `style`) e **importada** (`@import url("x.css");`).
- Sintaxis: `selector { propiedad: valor; }`. Comentarios: `/* ... */`.

### Selectores

| Selector | Ejemplo | Selecciona |
|---|---|---|
| Universal | `*` | Todos los elementos |
| Tipo (etiqueta) | `p` | Todos los `p` |
| Clase | `.titulo` | Elementos con `class="titulo"` **[Salió 2017]** |
| Id | `#cabecera` | El elemento con `id="cabecera"` |
| Atributo | `input[type="email"]` | `input` con ese atributo y valor |
| Atributo empieza / termina / contiene | `a[href^="https"]`, `[src$=".png"]`, `[class*="btn"]` | Coincidencias parciales |
| Descendiente (espacio) | `div p` | `p` dentro de un `div`, a cualquier nivel |
| Hijo directo | `li > a` | `a` cuyo padre directo es `li` **[Salió 2019]** |
| Hermano adyacente | `div + p` | El `p` **inmediatamente después** de un `div`, con el mismo padre **[Salió 2017]** |
| Hermano general | `h2 ~ p` | Todos los `p` hermanos posteriores a un `h2` |
| Agrupación | `h1, h2, h3` | Los tres tipos |
| Combinado | `div#principal`, `p.nota` | `div` con ese id, `p` con esa clase |

- **[Salió 2019]** Color verde a todo `a` hijo de `li` → **`li > a { color: green; }`**. Trampas: `li.a` (`li` con clase "a"), `li#a` (`li` con id "a"), `li_a` (no existe).
- **[Salió 2017]** `div + p` → **los `p` situados justo después de un `div`**. Trampas: "dentro de un div" es `div p`; "cuyo padre sea div" es `div > p`.

**Pseudoclases** (estado o posición; un signo de dos puntos):

| Pseudoclase | Uso |
|---|---|
| `:hover`, `:active`, `:focus`, `:focus-visible` | Interacción |
| `:link`, `:visited` | Enlaces no visitados y visitados |
| `:first-child`, `:last-child`, `:nth-child(2n+1)`, `:nth-of-type()`, `:only-child` | Posición |
| `:required`, `:optional`, `:valid`, `:invalid`, `:checked`, `:disabled`, `:enabled`, `:placeholder-shown` | Formularios |
| `:not()`, `:is()`, `:where()`, `:has()` | Lógicas y relacionales |
| `:root`, `:empty`, `:target` | Estructura |

- Orden recomendado para enlaces (regla **LVHA**): `:link`, `:visited`, `:hover`, `:active`.
- **`:has()`** es el "selector de padre": `article:has(img)` selecciona artículos que contienen una imagen. Disponible en todos los navegadores desde diciembre de 2023.

**Pseudoelementos** (parte de un elemento; dos signos de dos puntos): `::before`, `::after` (con `content`), `::first-line`, `::first-letter`, `::placeholder`, `::selection`, `::marker`.

### Especificidad

Cuando varias reglas chocan, gana la de mayor **especificidad**. Se calcula como una terna **(A-B-C)**:

| Componente | Qué cuenta |
|---|---|
| A | Selectores de **id** |
| B | **Clases**, **atributos** y **pseudoclases** |
| C | **Tipos** (etiquetas) y **pseudoelementos** |

- El selector universal `*` y los combinadores (`>`, `+`, `~`, espacio) **no suman**.
- `:is()`, `:not()` y `:has()` valen lo que su argumento más específico. `:where()` vale siempre 0.
- El **estilo en línea** (atributo `style`) gana a cualquier selector. Por encima solo está `!important`.
- Se comparan las ternas de izquierda a derecha: (1-0-0) gana a (0-15-0).

| Selector | Especificidad |
|---|---|
| `p` | 0-0-1 |
| `ul li` | 0-0-2 |
| `.nota` | 0-1-0 |
| `input:required` | **0-1-1** **[Salió 2024]** |
| `a[href]:hover` | 0-2-1 |
| `#menu .item a` | 1-1-1 |
| `div#principal > p::first-line` | 1-0-3 |
| `*` | 0-0-0 |

**[Salió 2024]** `input:required` → **0-1-1**: una pseudoclase (B) y un tipo (C). Las trampas (1-1-0, 1-0-1, 1-0-0) suponían que la pseudoclase contaba como id.

### Cascada y herencia

El navegador resuelve los conflictos en este orden:

1. **Origen e importancia**.
2. **Contexto** (Shadow DOM) y **estilo en línea**.
3. **Capas** (`@layer`).
4. **Especificidad**.
5. **Orden de aparición**: a igualdad de todo, gana la última regla.

Precedencia de orígenes (de mayor a menor):

| Prioridad | Origen |
|---|---|
| 1 | Transiciones CSS |
| 2 | `!important` del agente de usuario (navegador) |
| 3 | `!important` del **usuario** |
| 4 | `!important` del **autor** |
| 5 | Animaciones CSS |
| 6 | Normal del **autor** |
| 7 | Normal del **usuario** |
| 8 | Normal del agente de usuario |

- **Autor**: quien escribe la web. **Usuario**: preferencias del lector (por ejemplo, accesibilidad). **Agente de usuario**: estilos por defecto del navegador.
- En reglas normales gana el autor. Con `!important` se invierte: gana el usuario. Así se protege la accesibilidad.

**[Salió 2017]** Opción 1: autor `P {color: black;}` y usuario `P {color: red;}` → **negro** (autor normal gana a usuario normal). Opción 2: usuario con `red !important` → **rojo** (importante de usuario gana a todo lo del autor normal). Respuesta: **negro y rojo**.

**Herencia**: algunas propiedades pasan de padres a hijos (`color`, `font-*`, `line-height`, `text-align`, `visibility`, `list-style`). Otras no (`margin`, `padding`, `border`, `background`, `width`, `display`). Valores globales: `inherit`, `initial`, `unset`, `revert`, `revert-layer`.

### Modelo de caja, display y posicionamiento

Cada elemento es una caja: **contenido + `padding` (relleno) + `border` (borde) + `margin` (margen)**.

- `box-sizing: content-box` (por defecto): `width` mide solo el contenido. `box-sizing: border-box`: `width` incluye relleno y borde.
- Atajos con 4 valores en sentido horario: arriba, derecha, abajo, izquierda (`margin: 10px 5px 10px 5px`).
- Los márgenes verticales adyacentes se **colapsan** (se toma el mayor).

| `display` | Comportamiento |
|---|---|
| `block` | Ocupa toda la línea (`div`, `p`, `h1`) |
| `inline` | En línea, ignora `width` y `height` (`span`, `a`) |
| `inline-block` | En línea pero admite dimensiones |
| `none` | No se muestra ni ocupa espacio (`visibility: hidden` sí ocupa) |
| `flex` | Contenedor Flexbox |
| `grid` | Contenedor Grid |

| `position` | Referencia |
|---|---|
| `static` | Flujo normal (por defecto) |
| `relative` | Se desplaza respecto a su posición normal, conservando el hueco |
| `absolute` | Respecto al ancestro posicionado más cercano; sale del flujo |
| `fixed` | Respecto a la ventana; no se mueve con el scroll |
| `sticky` | Relativo hasta un umbral de scroll, luego fijo |

`z-index` ordena capas en elementos posicionados.

**Bordes redondeados** **[Salió 2015]**: `border-radius: 15px;`. En 2015 Firefox antiguo requería el prefijo **`-moz-border-radius: 15px;`**. Prefijos de fabricante: `-moz-` (Firefox), `-webkit-` (Chrome, Safari), `-ms-` (IE/Edge antiguo), `-o-` (Opera antiguo). Hoy `border-radius` funciona sin prefijo.

**Listas** **[Salió 2018]**: `list-style-type` cambia el marcador. `lower-alpha` (o `lower-latin`) → **letras ASCII minúsculas** (a, b, c). Otros: `disc`, `circle`, `square`, `decimal`, `decimal-leading-zero`, `lower-roman` (i, ii), `upper-roman`, `upper-alpha`, `lower-greek` (α, β), `none`.

### Flexbox

Modelo de maquetación **unidimensional** (una fila o una columna).

```css
div#principal {
  display: flex;            /* activa Flexbox [Salió 2019] */
  flex-direction: row;      /* row, row-reverse, column, column-reverse */
  flex-wrap: wrap;          /* nowrap por defecto */
  justify-content: space-between; /* eje principal */
  align-items: center;      /* eje transversal */
  gap: 1rem;
}
.hijo { flex: 1 1 200px; }  /* flex-grow flex-shrink flex-basis */
```

- **[Salió 2019]** Activar Flexbox → **`display: flex`**. Inventados: `flexbox`, `flex-container`, `flexible`. Existe `inline-flex`.
- `justify-content`: `flex-start`, `flex-end`, `center`, `space-between`, `space-around`, `space-evenly`.
- `align-items`: `stretch` (por defecto), `flex-start`, `flex-end`, `center`, `baseline`.
- En los hijos: `order`, `flex-grow`, `flex-shrink`, `flex-basis`, `align-self`.

### Grid

Modelo **bidimensional** (filas y columnas a la vez).

```css
.contenedor {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    "cab cab cab"
    "menu main main"
    "pie pie pie";
  gap: 10px;
}
header { grid-area: cab; }
.ancho { grid-column: 1 / 3; }  /* de la línea 1 a la 3 */
```

- `fr`: fracción del espacio libre. `minmax(200px, 1fr)`, `auto-fill` y `auto-fit` para rejillas adaptables.
- **Subgrid**: un hijo hereda las pistas de la rejilla del padre (disponible en todos los navegadores desde 2023).

### Unidades de medida

| Tipo | Unidades |
|---|---|
| **Absolutas** | `px` (píxel, 1/96 de pulgada), `cm`, `mm`, **`Q`** (cuarto de milímetro), `in` (pulgada = 2,54 cm), `pt` (punto, 1/72 in), `pc` (pica = 12 pt) |
| Relativas a la fuente | `em` (fuente del elemento o del padre), `rem` (fuente del elemento raíz), `ex` (altura de la x), `ch` (ancho del "0"), `cap`, `lh`, `rlh` |
| Relativas a la ventana (*viewport*) | `vw`, `vh` (1 % del ancho/alto), `vmin`, `vmax`, `svh`, `lvh`, `dvh` (alto pequeño, grande y dinámico en móvil) |
| Relativas al contenedor | `cqw`, `cqh`, `cqi`, `cqb` |
| Porcentaje | `%` del valor de referencia (normalmente del padre) |

- **[Salió 2024]** Unidad de CSS3 que **no es relativa** → **`Q`**. `vw`, `ex` y `ch` son relativas.
- Truco: `em` se acumula al anidar; `rem` no, porque siempre mira al `html`.
- Colores: nombres (`red`), hexadecimal (`#ff0000`, `#f00`, `#ff000080` con alfa), `rgb()`, `rgba()`, `hsl()`, `hwb()`, `lab()`, `lch()`, `oklch()`, `color-mix()`.

### Diseño responsive: media queries y container queries

```css
/* Mobile first: estilos base para móvil */
.menu { display: none; }

@media (min-width: 768px) {
  .menu { display: flex; }
}

@media print { nav { display: none; } }
@media (prefers-color-scheme: dark) { body { background: #111; } }
@media (prefers-reduced-motion: reduce) { * { animation: none; } }
```

- Tipos de medio: `all`, `screen`, `print`, `speech`. Los antiguos `handheld`, `tv` o `projection` están obsoletos.
- Características: `width`, `min-width`, `max-width`, `orientation`, `resolution`, `hover`, `pointer`, `prefers-color-scheme`, `prefers-reduced-motion`.
- Sintaxis moderna de rangos: `@media (400px <= width <= 800px)`.
- **Container queries** (`@container`, disponibles desde 2023): el estilo depende del tamaño del **contenedor**, no de la ventana. Se declara `container-type: inline-size` en el padre.
- Imprescindible en móviles: `<meta name="viewport" content="width=device-width, initial-scale=1">`.

### Otras novedades de CSS

- **Variables** (propiedades personalizadas): `:root { --color-base: #0055aa; }` y `color: var(--color-base);`. Se pueden cambiar con JavaScript.
- **Anidamiento nativo** (*CSS Nesting*, 2023): `.card { color: black; & h2 { color: blue; } }`. Antes solo en preprocesadores.
- **Capas de cascada** `@layer base, componentes, utilidades;`: ordenan bloques de reglas antes de la especificidad.
- `@supports (display: grid) { ... }`: consultas de características.
- `@font-face` para fuentes web (formatos WOFF y WOFF2).
- Transiciones (`transition`), transformaciones (`transform: rotate() scale() translate()`) y animaciones (`@keyframes` con `animation`).
- `calc()`, `min()`, `max()`, `clamp()`.
- Novedades 2024-2026 con soporte creciente: View Transitions, `@scope`, `@starting-style`, anclaje de posición (*anchor positioning*), `text-wrap: balance`, consultas de estilo.

### Preprocesadores y frameworks CSS

Un **preprocesador** añade a CSS variables, anidamiento, *mixins*, funciones y bucles. Se **compila** a CSS normal.

| Preprocesador | Sintaxis | Notas |
|---|---|---|
| **Sass** | `.scss` (con llaves) y `.sass` (con sangría) | El más usado; variables con `$`; implementación oficial Dart Sass |
| **Less** | `.less` | Variables con `@`; escrito en JavaScript |
| **Stylus** | `.styl` | Sintaxis muy libre, sin llaves ni punto y coma |
| PostCSS | Postprocesador con plugins | Autoprefixer añade prefijos de fabricante |

- **[Salió 2016]** Preprocesador CSS → **LESS**. Distractores: Grunt (task runner), Veeam (copias de seguridad), Mercurial (control de versiones).
- **[Salió 2017]** Preprocesador CSS → **Stylus**. Distractores: Kotlin (lenguaje), Babel (transpilador JS), Flexbox (módulo CSS).
- **[Salió 2019]** Correcta: "**Sass, Less y Stylus son preprocesadores de CSS**".
- **[Salió 2022]** SASS es CSS, no back-end.

```scss
$primario: #0055aa;
@mixin centrado { display: flex; align-items: center; }
.boton {
  background: $primario;
  @include centrado;
  &:hover { background: darken($primario, 10%); }
}
```

Frameworks CSS: **Bootstrap** (rejilla de 12 columnas, puntos de ruptura `sm`, `md`, `lg`, `xl`, `xxl`; versión 5 sin jQuery), **Tailwind CSS** (clases de utilidad), Foundation, Bulma, Materialize y Angular Material (Material Design).

## XML y lenguajes derivados

### Qué es XML

- **XML** (eXtensible Markup Language) es un **metalenguaje** del W3C para describir datos estructurados. Permite definir lenguajes de marcado propios.
- Versiones: **XML 1.0** (1998; vigente la **5.ª edición, 2008**) y XML 1.1 (2004, 2.ª edición 2006, poco usado).
- Es texto plano: se crea con cualquier editor. Describe el **significado** de los datos, no su presentación **[Salió 2016]**.
- Distingue **mayúsculas de minúsculas** en nombres de elementos y atributos **[Salió 2016]**.

### Documento bien formado

Un documento XML está **bien formado** si cumple las reglas sintácticas de la especificación:

1. Tiene **un único elemento raíz**, que contiene a todos los demás **[Salió 2016, 2025]**.
2. Todo elemento abierto **se cierra**: `<a></a>` o vacío `<a/>`.
3. Los elementos **se anidan correctamente**, sin solaparse: `<a><b></b></a>`.
4. Las etiquetas de apertura y cierre coinciden **exactamente**, también en mayúsculas.
5. Los valores de atributos van **entre comillas** simples o dobles **[Salió 2025]**.
6. No se repite un atributo en el mismo elemento.
7. Los caracteres `<` y `&` del texto se escapan con entidades.
8. Los nombres empiezan por letra, `_` o `:`; no por número ni por "xml" en cualquier combinación de mayúsculas.

**[Salió 2025]** Según la especificación del W3C, un documento bien formado tiene **solo un elemento raíz**, cuyas etiquetas de apertura y cierre no están dentro de ningún otro elemento. Trampa: un DTD externo no permite "ningún" elemento raíz.

**[Salió 2025, supuesto]** Bien formado:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<alumno><id_alumno>10</id_alumno><nombre>Juan Pérez</nombre></alumno>
```

Las opciones malas cerraban `id_alumno` con `</nombre>`, olvidaban cerrar `alumno` o cerraban `nombre` con `</id_alumno>`.

**[Salió 2025, supuesto]** Atributo correcto → `<alumno id_alumno="10">`. Fallaban `id_alumno:"10"` (dos puntos), `id_alumno=10` (sin comillas) y el atributo escrito como texto fuera de la etiqueta.

**[Salió 2019, supuesto]** Bien formado:

```xml
<Opositor>Winston Churchill<Nota1/>95<Nota2/>65</Opositor>
```

Es bien formado aunque no represente bien la información: `Nota1` y `Nota2` son elementos vacíos y el texto queda como **contenido mixto**. Las demás opciones fallaban por mayúsculas (`<Nota1>...</nota1>`), solapamiento (`</Opositor></Nota2>`) o cierres anónimos `</>`.

### Bien formado frente a válido

| | Bien formado | Válido |
|---|---|---|
| Qué exige | Reglas sintácticas de XML | Bien formado **y** conforme a un DTD o un XML Schema |
| Quién lo comprueba | Cualquier analizador XML | Un analizador validador |
| Relación | Todo documento válido está bien formado | No todo bien formado es válido |

**[Salió 2005]** Diferencia entre válido y bien formado: ver tabla.

### Partes de un documento XML

```xml
<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE catalogo SYSTEM "catalogo.dtd">
<?xml-stylesheet type="text/xsl" href="catalogo.xsl"?>
<!-- Esto es un comentario -->
<catalogo xmlns="http://ejemplo.es/catalogo"
          xmlns:dc="http://purl.org/dc/elements/1.1/">
  <libro id="L1" disponible="si">
    <titulo>XML &amp; JSON</titulo>
    <dc:creator>Ana</dc:creator>
    <codigo><![CDATA[ if (a < b && c > d) { } ]]></codigo>
  </libro>
</catalogo>
```

- **Prólogo**: declaración XML, DOCTYPE, comentarios e instrucciones de procesamiento antes del raíz.
- **Declaración XML** `<?xml ...?>`: opcional en XML 1.0, pero si aparece va **al principio absoluto**. `version` es obligatoria dentro de ella; `encoding` y `standalone` son opcionales.
- **`encoding`** indica la **codificación de caracteres** del documento **[Salió 2005, 2007]**. Por defecto UTF-8 o UTF-16. UTF-8 es Unicode de longitud variable (1 a 4 bytes) compatible con ASCII.
- `standalone="yes"` indica que no depende de declaraciones externas.
- **Comentarios**: `<!-- texto -->` **[Salió 2019]**. No pueden contener `--` ni ir dentro de una etiqueta.
- **Instrucciones de procesamiento** (PI): `<?destino datos?>`, para aplicaciones.
- **CDATA**: bloque de texto que no se analiza; sirve para incluir `<` y `&` sin escapar.
- **Entidades predefinidas**: `&lt;` (<), `&gt;` (>), `&amp;` (&), `&quot;` ("), `&apos;` ('). Referencias numéricas: `&#233;` o `&#xE9;`.
- **Elemento frente a atributo**: los atributos no admiten estructura ni repeticiones. Para datos complejos se prefieren elementos.

### Espacios de nombres (namespaces)

- Evitan **conflictos de nombres** cuando se mezclan vocabularios XML distintos **[Salió 2005]**.
- Se declaran con **`xmlns`** (espacio por defecto) o `xmlns:prefijo` **[Salió 2007]**. El valor es un URI que solo identifica; no tiene que existir una página.
- Ejemplos: XHTML `http://www.w3.org/1999/xhtml`, XSLT `http://www.w3.org/1999/XSL/Transform`, XML Schema `http://www.w3.org/2001/XMLSchema`.

### DTD (Document Type Definition)

Gramática heredada de SGML que define elementos, atributos y entidades. No usa sintaxis XML y no tiene tipos de datos.

**Declaración en el documento** **[Salió 2016]**:

```xml
<!DOCTYPE libro SYSTEM "libro.dtd">                       <!-- externo privado -->
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
  "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">     <!-- externo público -->
<!DOCTYPE libro [ <!ELEMENT libro (#PCDATA)> ]>           <!-- interno -->
```

Respuesta 2016: **`<!DOCTYPE nombre SYSTEM "archivodtd.dtd">`**. La trampa terminaba en `/>`.

**Elementos**:

```xml
<!ELEMENT libro (titulo, autor+, precio?, materia*)>
<!ELEMENT titulo (#PCDATA)>
<!ELEMENT autor (#PCDATA)>
<!ELEMENT opcion (si | no)>
<!ELEMENT salto EMPTY>
<!ELEMENT nota ANY>
<!ELEMENT parrafo (#PCDATA | negrita)*>
```

| Símbolo | Significado |
|---|---|
| (sin símbolo) | Exactamente una vez |
| `?` | Cero o una vez (opcional) |
| `+` | Una o más veces |
| `*` | Cero o más veces |
| `,` | Secuencia en ese orden |
| barra vertical | Alternativa (uno u otro) |
| `#PCDATA` | Texto analizado (*parsed character data*) **[Salió 2005]** |
| `EMPTY` | Elemento vacío |
| `ANY` | Cualquier contenido |

**[Salió 2015]** Con `<!ELEMENT libro (titulo, autor+, precio?, materia*)>`, la afirmación INCORRECTA es "todo libro deberá tener **al menos una materia**". `materia*` admite cero.

**Atributos**:

```xml
<!ATTLIST libro
  id       ID        #REQUIRED
  idioma   CDATA     "es"
  estado   (nuevo|usado) "nuevo"
  editor   IDREF     #IMPLIED
  formato  CDATA     #FIXED "papel">
```

- Tipos: `CDATA` (texto), `ID` (único), `IDREF`/`IDREFS` (referencia a un ID), enumeración, `NMTOKEN`, `ENTITY`, `NOTATION`.
- Valores por defecto: **`#REQUIRED`** (obligatorio), **`#IMPLIED`** (opcional), **`#FIXED`** (constante) o un literal.
- **Entidades**: `<!ENTITY org "Ministerio de Educación">` y se usa `&org;`. Las paramétricas (`%nombre;`) solo dentro del DTD.

### XML Schema (XSD)

Lenguaje del W3C (XSD 1.0 en 2001; **XSD 1.1 en 2012**) que sustituye al DTD.

**[Salió 2005]** Ventajas frente al DTD:

- Está escrito **en XML**: se procesa con las mismas herramientas.
- Tiene **tipos de datos** (más de 40: `xs:string`, `xs:integer`, `xs:date`, `xs:boolean`, `xs:decimal`...) y permite crear tipos propios.
- Soporta **espacios de nombres**.
- Permite restricciones finas: `minOccurs`, `maxOccurs`, patrones, enumeraciones, longitudes, rangos.
- Admite herencia de tipos (extensión y restricción).

```xml
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">
  <xs:element name="libro">
    <xs:complexType>
      <xs:sequence>
        <xs:element name="titulo" type="xs:string"/>
        <xs:element name="autor" type="xs:string" maxOccurs="unbounded"/>
        <xs:element name="precio" type="xs:decimal" minOccurs="0"/>
        <xs:element name="materia" type="xs:string" minOccurs="0" maxOccurs="unbounded"/>
      </xs:sequence>
      <xs:attribute name="id" type="xs:ID" use="required"/>
    </xs:complexType>
  </xs:element>
</xs:schema>
```

- **[Salió 2005]** Equivalencias DTD → XSD: `autor+` es `maxOccurs="unbounded"`; `precio?` es `minOccurs="0"`; `materia*` son ambos. Por defecto `minOccurs` y `maxOccurs` valen 1.
- Compositores: `xs:sequence` (en orden), `xs:choice` (uno de ellos), `xs:all` (todos, en cualquier orden).
- `xs:simpleType` (solo texto, sin atributos) frente a `xs:complexType` (hijos o atributos).
- Restricciones: `xs:restriction` con `xs:pattern`, `xs:enumeration`, `xs:minInclusive`, `xs:maxLength`.
- Vinculación desde el documento: `xsi:schemaLocation` o `xsi:noNamespaceSchemaLocation`.
- Alternativas: **RELAX NG** (ISO/IEC 19757-2) y **Schematron** (reglas con XPath).

### XPath

**XPath** es un lenguaje para **seleccionar (direccionar) nodos** de un documento XML mediante expresiones de ruta **[Salió 2005]**. Versiones: 1.0 (1999), 2.0 (2007), 3.0 (2014) y **3.1 (2017)**, la vigente. La 4.0 está en borrador.

**[Salió 2016]** `/Usuarios/usuario[numIntentos>3]/apellidos` es **XPath**. Distractores: XLink, XPointer y XML.

| Expresión | Selecciona |
|---|---|
| `/catalogo/libro` | Los `libro` hijos del raíz `catalogo` (ruta absoluta) |
| `//autor` | Todos los `autor` a cualquier profundidad |
| `libro/@id` | El atributo `id` de cada `libro` |
| `libro[1]` | El primer `libro` (los índices **empiezan en 1**) |
| `libro[last()]` | El último |
| `libro[precio>20]` | Los libros con precio mayor que 20 |
| `libro[@idioma='es']` | Los libros con ese atributo |
| `.` y `..` | Nodo actual y nodo padre |
| `*` y `@*` | Cualquier elemento y cualquier atributo |
| `text()` | Nodos de texto |
| `count(//libro)` | Número de libros |

- **Ejes**: `child` (por defecto), `descendant`, `descendant-or-self` (`//`), `parent` (`..`), `ancestor`, `following-sibling`, `preceding-sibling`, `following`, `preceding`, `attribute` (`@`), `self` (`.`), `namespace`.
- Sintaxis completa: `/child::catalogo/child::libro[attribute::id='L1']`.
- **Tipos de nodo de XPath 1.0** (siete): **raíz** (documento), **elemento**, **atributo**, **texto**, **espacio de nombres**, **instrucción de procesamiento** y **comentario**. **[Salió 2005]** No existen como nodos ni el DOCTYPE, ni las entidades, ni las secciones CDATA (son texto).
- Funciones: `contains()`, `starts-with()`, `string-length()`, `normalize-space()`, `sum()`, `position()`, `not()`.

### XSL: XSLT y XSL-FO

**XSL** (eXtensible Stylesheet Language) es la familia de lenguajes de **hojas de estilo para XML** **[Salió 2005, 2008]**. Tiene tres partes:

1. **XSLT**: **transforma** XML en otro XML, HTML o texto **[Salió 2005]**. Versiones 1.0 (1999), 2.0 (2007) y **3.0 (2017)**.
2. **XPath**: selecciona las partes del documento.
3. **XSL-FO** (Formatting Objects): describe el formato de página para generar PDF (por ejemplo con Apache FOP).

- **[Salió 2008]** "XLS" (errata por XSL) se define como **lenguaje extensible de hojas de estilo**. Los distractores describían XPath ("acceder a partes"), XQuery ("extraer datos") y XLink ("enlaces entre recursos").
- **[Salió 2005]** XSL permite **mostrar documentos XML en un formato definido a medida en hojas de estilos**.

```xml
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:template match="/">
    <html><body><ul>
      <xsl:for-each select="catalogo/libro">
        <xsl:sort select="titulo"/>
        <xsl:if test="precio &gt; 20">
          <li><xsl:value-of select="titulo"/></li>
        </xsl:if>
      </xsl:for-each>
    </ul></body></html>
  </xsl:template>
</xsl:stylesheet>
```

Elementos XSLT: `xsl:template` (`match`), `xsl:apply-templates`, `xsl:value-of`, `xsl:for-each`, `xsl:if`, `xsl:choose`/`xsl:when`/`xsl:otherwise`, `xsl:sort`, `xsl:variable`, `xsl:attribute`, `xsl:output`. Se procesa con Saxon, Xalan o el propio navegador (instrucción `xml-stylesheet`).

### XQuery

**XQuery** es el lenguaje de **consulta** de XML del W3C, el "SQL de XML". Versiones 1.0 (2007), 3.0 (2014) y **3.1 (2017)**. Su predecesor fue XQL. Usa XPath para navegar.

Expresiones **FLWOR** (se pronuncia *flower*):

| Cláusula | Función | ¿Obligatoria? |
|---|---|---|
| `for` | Itera sobre una secuencia | Debe haber al menos un `for` o un `let` |
| `let` | Asigna una variable | Debe haber al menos un `for` o un `let` |
| `where` | Filtra | No |
| `order by` | Ordena | No |
| `return` | Construye el resultado | **Sí, siempre** **[Salió 2005]** |

```xquery
for $l in doc("catalogo.xml")//libro
let $p := $l/precio
where $p > 20
order by $l/titulo
return <caro>{ $l/titulo/text() }</caro>
```

Resultado: un elemento `caro` con el título de cada libro de más de 20, en orden alfabético. **[Salió 2005]** se pidió interpretar consultas como esta (opción oficial sin verificar).

### APIs para procesar XML

| API | Modelo | Características |
|---|---|---|
| **DOM** (W3C) | Árbol en memoria | Acceso aleatorio, lectura y modificación; consume mucha memoria **[Salió 2005]** |
| **SAX** | Eventos, *push* | Secuencial, solo lectura, poca memoria; lanza eventos (`startElement`, `endElement`, `characters`) |
| **StAX** (JSR 173) | Eventos, *pull* | Secuencial; la aplicación pide el siguiente evento (`XMLStreamReader`); lee y escribe **[Salió 2019]** |
| **JDOM**, **DOM4J** | Árbol, más "Java" que DOM | Fácil de usar para leer y editar |
| **JAXP** | Fachada de Java | Agrupa DOM, SAX, StAX y XSLT (`javax.xml`) |
| **JAXB** | Enlace de datos (*binding*) | Convierte XML en objetos Java y viceversa (*marshal*/*unmarshal*); hoy Jakarta XML Binding |
| XPath API | Consultas | `javax.xml.xpath` |

- **DOM** es una especificación del W3C (hoy DOM Living Standard de WHATWG). Sirve para manipular documentos HTML y XML desde cualquier lenguaje **[Salió 2005]**.
- **[Salió 2017]** Diferencia SAX/JDOM → **JDOM es recomendable para editar o cambiar documentos XML; SAX, para leerlos**. Trampas invertidas: SAX es secuencial y gasta menos memoria; es SAX el que lanza eventos.
- **[Salió 2019]** API Java para XML → **StAX**. Distractores: JNA y JNI (llamar a código nativo) y "JPaX" (inventada; existe JAXP).

### Derivados y tecnologías relacionadas

| Tecnología | Qué es |
|---|---|
| XHTML | HTML con reglas XML |
| SVG | Gráficos vectoriales 2D |
| MathML | Fórmulas matemáticas |
| RSS 2.0 | Sindicación de contenidos (*Really Simple Syndication*) |
| Atom (RFC 4287) | Sindicación, alternativa estándar del IETF a RSS |
| SOAP, WSDL | Servicios web (tema 20) |
| XOP y MTOM | Envío optimizado de datos binarios en mensajes XML |
| XLink | Enlaces entre recursos XML |
| XPointer | Direccionar fragmentos de un documento XML |
| XInclude | Incluir documentos dentro de otros |
| RDF, RDFS, OWL | Web Semántica |
| SAML, XACML, XML Signature, XML Encryption | Seguridad |
| OOXML (.docx), ODF (.odt) | Formatos ofimáticos (ZIP con XML) |
| KML, GML | Datos geográficos |
| XBRL | Información financiera |
| Facturae | Factura electrónica española |

**RSS 2.0** **[Salió 2007, 2008]**: el elemento raíz es `rss` (con `version="2.0"`) y contiene un `channel`. El canal exige tres elementos: **`title`**, **`link`** y **`description`**. Cada noticia es un `item`. **[Salió 2008]** Necesario para definir un canal → **descripción**. Idioma (`language`), categoría y autor son opcionales.

**XOP** (*XML-binary Optimized Packaging*, W3C 2005): saca los datos binarios del XML (por ejemplo, ficheros en Base64) y los empaqueta aparte en MIME. Se usa con SOAP mediante **MTOM**. Términos de la especificación: *Original XML Infoset*, *Optimized Content*, *XOP Infoset*, *XOP Document*, **XOP Package** y *Reconstituted XML Infoset*. El elemento de referencia es `xop:Include`. **[Salió 2022]** (ver autoevaluación).

**Web Semántica** **[Salió 2017]**: web cuyos datos entienden las máquinas. Pila de tecnologías del W3C:

- **RDF**: modelo de tripletas sujeto-predicado-objeto. Serializaciones: RDF/XML, Turtle, JSON-LD, N-Triples.
- **RDFS** y **OWL**: vocabularios y ontologías.
- **SPARQL**: lenguaje de consulta de RDF.
- **Linked Data**, **Schema.org**, microdatos y RDFa en HTML.

Respuesta 2017: **WebM** (formato de vídeo) NO está relacionado con la Web Semántica.

### JSON

**JSON** (JavaScript Object Notation) es un **formato ligero de intercambio de datos**, derivado de la notación de objetos de JavaScript **[Salió 2015]**. Normas: **RFC 8259** (2017) y **ECMA-404**. Tipo MIME: `application/json`.

Reglas de sintaxis:

- Tipos: **objeto** `{}`, **array** `[]`, **cadena**, **número**, `true`, `false` y `null`.
- **Las claves van siempre entre comillas dobles** `"clave"`.
- Las cadenas usan **solo comillas dobles**; nunca simples.
- Pares separados por **comas**; clave y valor separados por **dos puntos**.
- **No** se admiten comentarios, comas finales, `undefined`, funciones, fechas ni `NaN`.
- Codificación: UTF-8 obligatoria en intercambios entre sistemas.

**[Salió 2019]** JSON válido → `{"nombre": "Juana", "apellido": "Ruiz"}`. Fallaban las comillas simples, las claves sin comillas y el punto y coma como separador.

**[Salió 2016]** Equivalente JSON de un XML con dos `empleado` dentro de `empleados`:

```json
{"empleados": {"empleado": [
  {"nombre": "Juan", "apellido": "Español"},
  {"nombre": "Juana", "apellido": "Española"}
]}}
```

Los elementos repetidos se convierten en un **array**.

**[Salió 2015]** Pasar un cliente único a un arreglo `listaclientes`: se encierra el objeto en corchetes, `{"listaclientes": [ {"nombre": "..."} ]}`.

| | XML | JSON |
|---|---|---|
| Tamaño | Más verboso | Más compacto |
| Tipos | Todo es texto (salvo con XSD) | Número, booleano, null, cadena |
| Arrays | Elementos repetidos | Nativos `[]` |
| Atributos y espacios de nombres | Sí | No |
| Comentarios | Sí | No |
| Validación | DTD, XSD | JSON Schema |
| Consulta | XPath, XQuery | JSONPath (RFC 9535), jq |
| En JavaScript | DOMParser | `JSON.parse()` nativo |

Variantes: **JSON Schema** (validación; versión 2020-12), **JSON-LD** (datos enlazados, Web Semántica), **GeoJSON** (RFC 7946), **JSON Lines/NDJSON** (un objeto por línea), JSON5 (con comentarios, no estándar). Alternativas: YAML (superconjunto de JSON), TOML.

## Navegadores

### Motores de renderizado y de JavaScript

Un navegador tiene un **motor de renderizado** (HTML y CSS) y un **motor de JavaScript**.

| Navegador | Motor de renderizado | Motor de JavaScript | Empresa |
|---|---|---|---|
| Chrome, Chromium | **Blink** (bifurcación de WebKit, 2013) | **V8** | Google |
| Edge (desde 2020) | Blink | V8 | Microsoft |
| Opera, Brave, Vivaldi, Samsung Internet | Blink | V8 | Varias |
| Firefox | **Gecko** (con partes de Servo, en Rust) | **SpiderMonkey** | **Mozilla Foundation** |
| Safari | **WebKit** | **JavaScriptCore** (Nitro) | Apple |
| Internet Explorer | Trident | Chakra (JScript) | Microsoft; retirado el 15 de junio de 2022 |
| Edge antiguo (2015-2020) | EdgeHTML | Chakra | Microsoft |
| Ladybird | LibWeb | LibJS | Ladybird Browser Initiative (en desarrollo) |

- **[Salió 2022]** Motor web de Mozilla → **Gecko**. Trampas: WebKit (Apple), Firefox (es el navegador, no el motor) y Edge (navegador de Microsoft).
- WebKit nació de KHTML (KDE). Blink nació de WebKit. En iOS todos los navegadores usaban WebKit por imposición de Apple; desde 2024 la UE (Ley de Mercados Digitales) permite otros motores.
- **Servo**: motor experimental en Rust iniciado por Mozilla, hoy en la Linux Foundation.

### Cómo pinta una página el navegador (ruta crítica de renderizado)

1. Descarga el HTML y lo **analiza** para construir el **DOM** (árbol de nodos).
2. Analiza el CSS y construye el **CSSOM**.
3. Combina ambos en el **árbol de renderizado** (solo lo visible).
4. **Layout** (*reflow*): calcula tamaños y posiciones.
5. **Paint**: pinta píxeles en capas.
6. **Composite**: compone las capas, a menudo con la GPU.

- Un `script` normal **bloquea** el análisis del HTML; por eso se usa `defer`, `async` o se pone al final del `body`.
- El CSS bloquea el renderizado.
- Cambiar geometría (ancho, posición) provoca *reflow*, que es costoso. Cambiar `transform` u `opacity` solo recompone.

### Seguridad y almacenamiento en el navegador

- **Política del mismo origen** (*Same-Origin Policy*): un script solo accede a recursos de su mismo **origen** (esquema + host + puerto).
- **CORS** (Cross-Origin Resource Sharing): el servidor autoriza otros orígenes con la cabecera `Access-Control-Allow-Origin`. Las peticiones "no simples" llevan antes una petición previa `OPTIONS` (*preflight*).
- **CSP** (Content Security Policy): cabecera que limita de dónde se cargan scripts y otros recursos. Mitiga XSS (tema 22).
- **Cookies**: atributos `Expires`/`Max-Age`, `Domain`, `Path`, **`Secure`** (solo HTTPS), **`HttpOnly`** (inaccesible desde JavaScript), **`SameSite`** (`Strict`, `Lax` por defecto en Chrome, `None` con `Secure`).
- **Herramientas de desarrollo** (F12, DevTools): inspector de elementos, consola, red, depurador, rendimiento, almacenamiento y Lighthouse (auditoría de rendimiento, accesibilidad y SEO).
- **Compatibilidad**: webs como *Can I use* y MDN. **Baseline** (desde 2023) marca qué funciones están disponibles en todos los navegadores principales. Los **polyfills** emulan funciones nuevas en navegadores antiguos.

### Cookies: conceptos clásicos

- Una **cookie** es un pequeño fichero de texto que el **servidor** envía (cabecera `Set-Cookie`) y el **navegador del cliente guarda** y devuelve en cada petición (cabecera `Cookie`).
- **[Salió 2006]** Afirmación correcta: **solo el servidor (dominio) que envió la cookie puede consultarla**. Falso que se guarde en el servidor, que solo la manejen programas CGI o que tenga tres campos obligatorios: solo **nombre y valor** lo son.
- Sin caducidad, es una **cookie de sesión**: se borra al cerrar el navegador.
- Límites orientativos (RFC 6265): al menos 4096 bytes por cookie, 50 por dominio.

## JavaScript

### Características del lenguaje

- Creado por **Brendan Eich** en Netscape en **1995** (en 10 días). Se llamó Mocha y LiveScript. No tiene relación con Java salvo el nombre.
- Estandarizado por **Ecma International** como **ECMAScript** (norma **ECMA-262**; también ISO/IEC 16262). El comité técnico es el **TC39**.
- Es **interpretado** con compilación **JIT** (*just in time*) en los motores modernos.
- **Multiparadigma**: imperativo, orientado a objetos **basado en prototipos** y funcional.
- **Tipado dinámico** (el tipo va con el valor, no con la variable) y **débil** (conversiones implícitas: `"5" * 2` da `10`).
- **Funciones de primera clase**: se asignan a variables, se pasan como argumentos y se devuelven.
- **Monohilo** con **bucle de eventos** (*event loop*) y modelo asíncrono (callbacks, promesas, `async`/`await`).

**[Salió 2019]** Característica INCORRECTA → "**proporciona funciones de segunda clase**". Son de **primera** clase. Sí es imperativo, dinámico, débilmente tipado y basado en prototipos.

### Versiones de ECMAScript

| Versión | Año | Novedades principales |
|---|---|---|
| ES1 | 1997 | Primera edición |
| ES3 | 1999 | Expresiones regulares, `try`/`catch` |
| ES4 | — | Abandonada |
| ES5 | 2009 | Modo estricto (`"use strict"`), **JSON nativo**, `Array.forEach`/`map`/`filter`, getters y setters |
| **ES6 / ES2015** | 2015 | `let`, `const`, funciones flecha, clases, módulos (`import`/`export`), promesas, plantillas de texto (*template literals*) con acento grave, desestructuración, `Map`, `Set`, `Symbol`, iteradores, generadores, parámetros por defecto, *spread*/*rest* |
| **ES2016 (ES7)** | 2016 | **Operador de exponenciación `**`** y `Array.prototype.includes` |
| ES2017 | 2017 | **`async`/`await`**, `Object.values`/`entries`, `padStart`/`padEnd` |
| ES2018 | 2018 | Spread en objetos, `Promise.finally`, iteración asíncrona `for await` |
| ES2019 | 2019 | `Array.flat`/`flatMap`, `Object.fromEntries`, `catch` sin parámetro |
| ES2020 | 2020 | **`BigInt`**, encadenamiento opcional **`?.`**, fusión nula **`??`**, `Promise.allSettled`, `globalThis`, `import()` dinámico |
| ES2021 | 2021 | `replaceAll`, `Promise.any`, separadores numéricos `1_000`, `??=` y similares |
| ES2022 | 2022 | Campos privados de clase `#x`, `await` de nivel superior, `Array.at()`, `Object.hasOwn`, `Error.cause` |
| ES2023 | 2023 | `findLast`, `toSorted`, `toReversed`, `with` (arrays sin mutar) |
| ES2024 | 2024 | `Object.groupBy`, `Promise.withResolvers`, flag `v` en RegExp, `ArrayBuffer` redimensionable |
| ES2025 | 2025 | Ayudantes de iteradores, métodos de conjuntos de `Set` (`union`, `intersection`), módulos JSON, `RegExp.escape`, `Promise.try`, `Float16Array` |
| **ES2026** | junio 2026 | `Math.sumPrecise`, `Iterator.concat`, `Array.fromAsync`, `Error.isError`, valores por defecto en `Map`/`WeakMap` (`getOrInsert`), `Uint8Array` a/desde base64 y hexadecimal, `JSON.rawJSON` y acceso al texto fuente en el *reviver* de `JSON.parse` |

- **[Salió 2017]** ECMAScript 7 (2016) añade → **el operador exponencial `**`**. `try`/`catch` y expresiones regulares venían de ES3; JSON nativo, de ES5.
- Desde 2015 hay una edición cada junio, nombrada por el año. ES2026 es la 17.ª edición, aprobada el 30 de junio de 2026.

### Inclusión en la página

```html
<script>alert("Hola");</script>
<script src="app.js" defer></script>
<script type="module" src="main.js"></script>
<button onclick="enviar()">Enviar</button>
```

### Variables, tipos y operadores

| Declaración | Ámbito | ¿Reasignable? | Elevación (*hoisting*) |
|---|---|---|---|
| `var` | Función | Sí | Se eleva con valor `undefined` |
| `let` | Bloque | Sí | Zona muerta temporal hasta su declaración |
| `const` | Bloque | No (pero un objeto `const` sí se puede modificar por dentro) | Zona muerta temporal |

- **Tipos primitivos** (7): `string`, `number` (coma flotante IEEE 754 de 64 bits), `bigint`, `boolean`, `undefined`, `null`, `symbol`. Todo lo demás es `object` (incluidos arrays y funciones).
- `typeof null` devuelve `"object"` (error histórico). `typeof function(){}` devuelve `"function"`. `typeof []` devuelve `"object"`; se usa `Array.isArray()`.
- Valores **falsy**: `false`, `0`, `-0`, `0n`, `""`, `null`, `undefined`, `NaN`. Todo lo demás es *truthy*.

| Operador | Significado |
|---|---|
| `==` / `!=` | Igualdad / desigualdad **con conversión de tipo** |
| `===` / `!==` | Igualdad / desigualdad **estricta: valor y tipo** |
| `+` | Suma o concatenación (si un operando es cadena) |
| `**` | Potencia (ES2016) |
| `&&` y la doble barra vertical | Y lógico, O lógico (cortocircuito) |
| `??` | Fusión nula: valor por defecto si es `null` o `undefined` |
| `?.` | Encadenamiento opcional |
| `? :` | Ternario |

- **[Salió 2015]** Comprobar que `x` es distinto de 9 en valor o tipo → **`x !== 9`**. `<>` y `<=>` no existen en JavaScript.

```javascript
console.log(5 == "5");    // true
console.log(5 === "5");   // false
console.log("5" + 3);     // "53"
console.log("5" - 3);     // 2
console.log(null == undefined);  // true
console.log(null === undefined); // false
console.log(NaN === NaN); // false (usar Number.isNaN)
console.log(0.1 + 0.2);   // 0.30000000000000004
```

### Funciones, objetos y clases

```javascript
function suma(a, b = 0) { return a + b; }          // declaración (se eleva)
const resta = function (a, b) { return a - b; };   // expresión
const doble = x => x * 2;                          // flecha: no tiene this propio

const persona = { nombre: "Ana", saludar() { return "Hola, " + this.nombre; } };
const { nombre } = persona;                        // desestructuración
const copia = { ...persona, edad: 30 };            // spread

class Alumno extends Persona {
  #nota = 0;                                       // campo privado (ES2022)
  constructor(nombre) { super(nombre); }
  static crear(n) { return new Alumno(n); }
  get nota() { return this.#nota; }
}
```

- Las clases de ES2015 son "azúcar sintáctico" sobre los **prototipos**. Cada objeto tiene un prototipo del que hereda (`Object.getPrototypeOf`).
- **Clausura** (*closure*): una función recuerda las variables del ámbito donde se creó.
- `this` depende de cómo se llama la función. Las funciones flecha toman el `this` del ámbito exterior.
- **[Salió 2016]** Función que ejecuta una cadena como código → **`eval()`**. Es peligrosa (inyección de código) y se desaconseja.
- **[Salió 2016]** Método de `window` que codifica en Base64 → **`btoa()`** ("binary to ASCII"). Su inverso, `atob()`, decodifica.
- Otras funciones globales: `parseInt()`, `parseFloat()`, `isNaN()`, `encodeURIComponent()`, `setTimeout()`, `setInterval()`.

### Arrays y cadenas

```javascript
const a = [3, 1, 2];
a.push(4);                       // [3,1,2,4]
a.length;                        // 4
a.map(x => x * 2);               // [6,2,4,8]
a.filter(x => x > 1);            // [3,2,4]
a.reduce((s, x) => s + x, 0);    // 10
a.sort();                        // ordena como cadenas: cuidado con números
[10, 9, 1].sort();               // [1, 10, 9]
[10, 9, 1].sort((x, y) => x - y);// [1, 9, 10]
"02/05/2024".split("/");         // ["02","05","2024"]
"abcdef".substring(2, 4);        // "cd" (fin excluido)
"abcdef".slice(-2);              // "ef"
"Hola".indexOf("l");             // 2
```

### El DOM desde JavaScript

El **DOM** (Document Object Model) representa la página como un árbol de nodos. JavaScript lo lee y modifica a través del objeto `document`.

| Método o propiedad | Devuelve |
|---|---|
| `document.getElementById("id")` | Un elemento o `null` |
| `document.getElementsByClassName("c")` | `HTMLCollection` viva |
| `document.getElementsByTagName("p")` | `HTMLCollection` viva |
| `document.getElementsByName("n")` | `NodeList` |
| `document.querySelector("css")` | El primer elemento que casa con el selector CSS |
| `document.querySelectorAll("css")` | `NodeList` estática con todos |
| `document.activeElement` | El elemento que tiene el **foco** **[Salió 2015]** |
| `document.forms`, `document.images`, `document.links` | Colecciones |
| `document.cookie` | Cadena con las cookies accesibles |

| Para cambiar | Usar |
|---|---|
| Contenido HTML | `el.innerHTML = "<b>hola</b>"` (interpreta etiquetas; riesgo de XSS) |
| Solo texto | `el.textContent` (seguro) o `el.innerText` (solo lo visible) |
| Valor de un campo | `input.value` |
| Atributos | `el.setAttribute("href", "x")`, `el.getAttribute()`, `el.id`, `el.className` |
| Clases | `el.classList.add()`, `remove()`, `toggle()`, `contains()` |
| Estilo | `el.style.color = "red"`, `el.style.backgroundColor` (en *camelCase*) |
| Estructura | `document.createElement()`, `appendChild()`, `append()`, `removeChild()`, `remove()`, `replaceChild()`, `cloneNode()` |
| Navegación | `parentNode`, `childNodes`, `children`, `firstChild`, `lastChild`, `nextSibling`, `firstElementChild` |

**[Salió 2019]** Con `<h1 id="titulo">Primer ejercicio TAI</h1>`, obtener el texto:

```javascript
var titulo = document.getElementById("titulo").firstChild.nodeValue;
// "Primer ejercicio TAI"
```

El primer hijo del `h1` es un nodo de texto, y su `nodeValue` es el texto. También valdrían `textContent` o `innerText`, pero no `InnerHTML` con mayúscula: JavaScript distingue mayúsculas.

**[Salió 2016]** Mostrar datos en el `div` con id "celda" → **`document.getElementById("celda").innerHTML = datos;`**.

**[Salió 2008]** Leer la opción elegida en un `select`:

```javascript
function materiaSeleccionada() {
  const sel = document.getElementById("materia");
  return sel.options[sel.selectedIndex].text;   // texto visible
  // sel.value devuelve el atributo value de la opción elegida
}
```

### Eventos

| Evento | Cuándo salta |
|---|---|
| `click`, `dblclick` | Clic, doble clic |
| `mousedown`, `mouseup` | Pulsar y soltar el botón |
| **`mouseover`** | El puntero **entra** en el elemento (se propaga desde los hijos) **[Salió 2024]** |
| `mouseenter` | Entra en el elemento (no se propaga) |
| `mouseout`, `mouseleave` | El puntero sale |
| `mousemove` | Se mueve sobre el elemento |
| `keydown`, `keyup` | Tecla pulsada y soltada (`keypress` está obsoleto) |
| `focus`, **`blur`** | El elemento gana o **pierde el foco** **[Salió 2005]** |
| `focusin`, `focusout` | Igual pero se propagan |
| **`change`** | Cambia el valor y se confirma (en `select`, al elegir otra opción) **[Salió 2018]** |
| `input` | Cada vez que cambia el valor, tecla a tecla |
| `submit`, `reset` | Envío o reinicio del formulario |
| `load` | Página o recurso cargado del todo |
| `DOMContentLoaded` | HTML analizado, sin esperar a imágenes |
| `resize`, `scroll` | Ventana redimensionada o desplazada |
| `touchstart`, `pointerdown` | Táctiles y punteros unificados |
| `dragstart`, `dragenter`, `dragover`, `drop` | Arrastrar y soltar |

- En HTML el atributo lleva prefijo `on`: `onclick`, `onmouseover`, `onchange`, `onblur`.
- **[Salió 2024]** Efecto al situar el ratón sobre un elemento → **`onmouseover`**. `onmousedown` es pulsar; `onmouseout`, salir.
- **[Salió 2018]** Habilitar un campo fecha según el `select` → **`onChange`**. Inventados: `onSelection`, `onValue`.
- **[Salió 2005]** `onblur="comprobar(this)"`: al **perder el foco** el campo, llama a `comprobar` pasándole **el propio elemento**.

```javascript
const boton = document.querySelector("#enviar");
boton.addEventListener("click", function (e) {
  e.preventDefault();      // anula la acción por defecto (enviar, navegar)
  e.stopPropagation();     // detiene la propagación (burbujeo)
  console.log(e.target);   // elemento que originó el evento
});
document.getElementById("fecha").disabled = (sel.value !== "SI");
```

- **Propagación**: fase de captura (de la raíz al objetivo) y fase de **burbujeo** (*bubbling*, del objetivo hacia arriba). `addEventListener(tipo, f, true)` escucha en captura.
- **Delegación de eventos**: un único manejador en el padre atiende a muchos hijos gracias al burbujeo.

### AJAX con XMLHttpRequest

```javascript
var objeto_AJAX = new XMLHttpRequest();
objeto_AJAX.open("GET", URL, true);              // true = asíncrona [Salió 2016]
objeto_AJAX.onreadystatechange = muestraResultado; // sin paréntesis [Salió 2016]
objeto_AJAX.send(null);                          // en POST, send(datos)

function muestraResultado() {
  if (objeto_AJAX.readyState === 4 && objeto_AJAX.status === 200) {
    var datos = objeto_AJAX.responseText;        // [Salió 2016]
    document.getElementById("celda").innerHTML = datos;
  }
}
```

- **`open(método, url, asíncrono)`** solo **configura** la conexión; **`send()`** la envía. El tercer parámetro `true` la hace **asíncrona** (por defecto ya es `true`). **[Salió 2016]** → `open("GET", URL, true)`.
- **`onreadystatechange`** se asigna a la **referencia** de la función (`muestraResultado`), no a su llamada (`muestraResultado()`) **[Salió 2016]**.
- Respuesta: **`responseText`** (texto), `responseXML` (documento XML), `response`, `status` (código HTTP), `statusText`.
- `setRequestHeader("Content-Type", "application/json")` antes de `send`.
- En Internet Explorer 5 y 6 se usaba `new ActiveXObject("Microsoft.XMLHTTP")`.

| `readyState` | Constante | Significado |
|---|---|---|
| 0 | `UNSENT` | Objeto creado, `open()` aún no llamado |
| 1 | `OPENED` | `open()` ejecutado |
| 2 | `HEADERS_RECEIVED` | `send()` llamado; cabeceras y estado recibidos |
| 3 | `LOADING` | Descargando el cuerpo; `responseText` parcial |
| **4** | **`DONE`** | **Operación completada: todos los datos recibidos y listos** **[Salió 2016]** |

### fetch, promesas y async/await

**`fetch()`** es la API moderna para peticiones HTTP. Devuelve una **promesa** que se resuelve con un objeto `Response`.

```javascript
// [Salió 2025] Llamada REST al backend
fetch("http://localhost:8080/alumnos")
  .then(response => response.json())   // json() también devuelve una promesa
  .then(data => console.log(data))
  .catch(err => console.error(err));

// Equivalente con async/await y POST
async function crearAlumno(alumno) {
  const resp = await fetch("/alumnos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(alumno)
  });
  if (!resp.ok) throw new Error("HTTP " + resp.status);  // fetch NO falla con 404 o 500
  return await resp.json();
}
```

- **[Salió 2025]** La opción correcta era `fetch(url).then(response => response.json()).then(data => console.log(data))`. `get()`, `http.get()` y `request.fetch()` no son nativos del navegador.
- `fetch` solo rechaza la promesa ante **errores de red**. Un 404 o un 500 se resuelve con `response.ok === false`.
- Métodos de `Response`: `json()`, `text()`, `blob()`, `arrayBuffer()`, `formData()`. Propiedades: `ok`, `status`, `headers`.
- `AbortController` permite cancelar una petición.
- **Promesa**: estados *pending*, *fulfilled* y *rejected*. Métodos `then`, `catch`, `finally`. Combinadores: `Promise.all` (todas o falla), `allSettled` (todas, con su resultado), `race` (la primera que acabe), `any` (la primera que se cumpla).
- **`async`/`await`** (ES2017): `await` pausa una función `async` hasta que la promesa se resuelve. Una función `async` siempre devuelve una promesa.
- **Axios** es una biblioteca popular sobre XHR/fetch. jQuery ofrece `$.ajax`.

**jQuery `$.ajax`** **[Salió 2015]**:

```javascript
$.ajax({
  url: "/clientes",
  type: "POST",              // o method
  dataType: "json",          // formato esperado de la respuesta
  contentType: "application/json",  // formato de lo que se envía
  data: JSON.stringify(cliente),
  success: function (datos) { pinta(datos); },   // si la petición tiene éxito
  error: function (xhr, estado, err) { avisa(err); }
});
```

Cargar jQuery desde una copia local en ASP.NET **[Salió 2015]**: `<script src="Scripts/jquery-1.8.2.min.js"></script>` (ruta exacta según el proyecto).

### JSON en JavaScript

```javascript
const texto = '{"nombre":"Ana","edad":30}';
const obj = JSON.parse(texto);         // cadena -> objeto [Salió 2022]
obj.edad;                              // 30
const cadena = JSON.stringify(obj);    // objeto -> cadena
JSON.stringify(obj, null, 2);          // con sangría de 2 espacios
```

- **[Salió 2022]** Método estático para convertir una cadena JSON en objeto → **`JSON.parse()`**. `JSON.stringify()` hace lo contrario. `new JSON` no existe: `JSON` es un objeto global, no un constructor.
- `JSON.parse` lanza `SyntaxError` si la cadena no es JSON válido.

### Fechas

```javascript
const hoy = new Date();               // fecha y hora actuales
const f = new Date(2024, 0, 31);      // 31 de enero de 2024: el mes empieza en 0
f.getDate();      // 31  -> día del mes (1-31)
f.getDay();       // 3   -> día de la semana: 0 = domingo ... 6 = sábado
f.getMonth();     // 0   -> mes (0-11)
f.getFullYear();  // 2024 -> año con 4 cifras
f.getYear();      // 124  -> año - 1900 (obsoleto)
f.getHours(); f.getMinutes(); f.getTime(); // milisegundos desde 1-1-1970
new Date(2024, 1, 30);  // 1 de marzo de 2024: el desbordamiento se corrige solo
```

- **[Salió 2005]** `getDay()` devuelve el **día de la semana** (0 domingo a 6 sábado), no el día del mes.
- **[Salió 2005]** `getYear()` devuelve el **año menos 1900** (por ejemplo 105 en 2005) en la mayoría de navegadores; antiguos IE devolvían 4 cifras. Está obsoleto; hay que usar `getFullYear()`.
- El objeto **Temporal** (fechas inmutables, zonas horarias) es la propuesta que sustituirá a `Date`; no forma parte de ES2026.

**Validación de una fecha dd/mm/aaaa** (tipo de los supuestos de 2005 y 2008):

```javascript
function validaFecha(texto) {
  const partes = texto.split("/");
  if (partes.length !== 3) return "Error1";           // formato incorrecto
  const dia = parseInt(partes[0], 10);
  const mes = parseInt(partes[1], 10);                 // o texto.substring(3, 5)
  const anio = parseInt(partes[2], 10);
  if (isNaN(dia) || isNaN(mes) || isNaN(anio)) return "Error2";
  if (partes[2].length !== 4 || anio > new Date().getFullYear()) return "Error3";
  const f = new Date(anio, mes - 1, dia);
  if (f.getDate() !== dia || f.getMonth() !== mes - 1) return "Error4"; // 31/04 no existe
  return "Sin Error";
}
validaFecha("31/04/2008");  // "Error4": abril tiene 30 días
validaFecha("8//02/2008");  // "Error1": split da 4 partes
```

- Abril, junio, septiembre y noviembre tienen 30 días. Un año es bisiesto si es divisible por 4 y no por 100, salvo que lo sea por 400.
- En los supuestos reales, los mensajes ("Error1", "Error2"...) dependen del código dado: hay que trazarlo línea a línea.

### Expresiones regulares

```javascript
const re = /^[a-zA-Z ]+$/;           // solo letras y espacios
re.test("Ana Pérez");                // false: la é no está en a-z
/^\d{8}[A-Z]$/.test("12345678Z");    // true
"a1b2".replace(/\d/g, "#");          // "a#b#"
```

| Símbolo | Significado |
|---|---|
| `^` y `$` | Inicio y fin de la cadena |
| `.` | Cualquier carácter salvo salto de línea |
| `\d`, `\w`, `\s` | Dígito, carácter de palabra, espacio en blanco |
| `[abc]`, `[^abc]`, `[a-z]` | Clase, clase negada, rango |
| `*`, `+`, `?` | 0 o más, 1 o más, 0 o 1 |
| `{n}`, `{n,}`, `{n,m}` | Repeticiones exactas, mínimas, rango |
| `(...)` | Grupo |
| `(?=...)`, `(?!...)` | Búsqueda anticipada positiva y negativa |
| Modificadores `g`, `i`, `m`, `u` | Global, sin distinguir mayúsculas, multilínea, Unicode |

### Trazas: cómo resolverlas

**[Salió 2019]**

```javascript
function prueba() {
  var i = 1; var j = 0;
  while (i < 7) { j += i; i += 2; }
  return j;
}
```

| Iteración | `i` al entrar | `j` tras sumar | `i` al salir |
|---|---|---|---|
| 1 | 1 | 1 | 3 |
| 2 | 3 | 4 | 5 |
| 3 | 5 | 9 | 7 |
| — | 7 (no cumple `i < 7`) | — | — |

Resultado: **9**.

Método: haz una tabla con una columna por variable, actualízala en cada línea y comprueba la condición **antes** de cada vuelta.

### Ecosistema: TypeScript, Node.js y WebAssembly

- **TypeScript** (Microsoft, 2012): añade tipos estáticos, interfaces y genéricos. Se compila (transpila) a JavaScript con `tsc`. Angular lo usa por defecto.
- **Node.js** (2009, Ryan Dahl): JavaScript en servidor sobre V8, con E/S no bloqueante. Frameworks: Express, NestJS, Fastify. Alternativas: **Deno** (también de Ryan Dahl) y **Bun**.
- **WebAssembly** (Wasm, W3C 2019): formato binario que el navegador ejecuta a velocidad casi nativa. Se genera desde C, C++, Rust o Go. Complementa a JavaScript; no lo sustituye.
- **Web Components**: Custom Elements, Shadow DOM y elementos `template`/`slot`.

## PHP y otros lenguajes de servidor

### Qué es PHP

- **PHP** (acrónimo recursivo de *PHP: Hypertext Preprocessor*) lo creó **Rasmus Lerdorf** en 1994. Es un lenguaje de **script del lado del servidor**, interpretado, de tipado dinámico y débil, embebido en HTML.
- El servidor ejecuta el código entre `<?php` y `?>` y envía al navegador **solo el resultado** (normalmente HTML). El cliente nunca ve el código PHP.
- Se ejecuta con Apache (`mod_php`), con **PHP-FPM** detrás de Nginx o por línea de comandos (`php script.php`). Servidor de pruebas integrado: `php -S localhost:8000`.
- Desde PHP 7 usa el motor **Zend Engine 3**; PHP 8 añadió compilación **JIT**.
- Paquetes que instalan todo junto: **LAMP** (Linux, Apache, MySQL, PHP), WAMP (Windows), **MAMP** (macOS) y **XAMPP** (multiplataforma: Apache, MariaDB/MySQL, PHP y Perl) **[Salió 2015]**. La "X" de XAMPP significa "cualquier sistema operativo".

### Versiones de PHP

| Versión | Año | Novedades |
|---|---|---|
| PHP 5 | 2004 | Orientación a objetos completa, PDO, SimpleXML; 5.3 espacios de nombres y clausuras; 5.4 **traits** |
| PHP 6 | — | Abandonado (nunca se publicó) |
| **PHP 7.0** | 2015 | Doble de rendimiento, tipos escalares y de retorno, `??`, nave espacial `<=>`; **elimina la extensión `mysql_*`** |
| PHP 7.4 | 2019 | Propiedades tipadas, funciones flecha `fn`, preloading |
| **PHP 8.0** | 2020 | **JIT**, argumentos con nombre, tipos unión, `match`, operador nullsafe `?->`, atributos `#[...]`, promoción de propiedades en el constructor |
| PHP 8.1 | 2021 | **Enumeraciones** (`enum`), propiedades `readonly`, *fibers*, tipo `never` |
| PHP 8.2 | 2022 | Clases `readonly`, tipos DNF, propiedades dinámicas obsoletas |
| PHP 8.3 | 2023 | Constantes de clase tipadas, `json_validate()`, atributo `#[\Override]` |
| PHP 8.4 | noviembre 2024 | *Property hooks*, visibilidad asimétrica, `array_find()`, `new` sin paréntesis, `#[\Deprecated]` |
| **PHP 8.5** | noviembre 2025 | Operador de tubería (*pipe*), `clone` con propiedades, extensión URI, `#[\NoDiscard]`, `array_first()` y `array_last()` |

- Cada versión tiene 2 años de soporte activo y 2 de solo seguridad. A octubre de 2026 la última estable es la **8.5**; la 8.6 está prevista para noviembre de 2026.
- PHP 9 no tiene fecha.

### Sintaxis básica y variables

```php
<?php
$nombre = "Ana";            // las variables empiezan por $ [Salió 2016]
$edad = 30;                 // no se declara el tipo
const PI = 3.14;            // constante (también define("PI", 3.14))
echo "Hola, $nombre";       // comillas dobles: interpolan variables -> Hola, Ana
echo 'Hola, $nombre';       // comillas simples: literal -> Hola, $nombre
echo "Edad: " . $edad . "\n"; // el operador de concatenación es el PUNTO
$nombre .= " Pérez";        // concatenar y asignar
var_dump($edad);            // int(30)
?>
```

- **[Salió 2016]** Las variables **comienzan con `$`**. Después va una letra o un guion bajo, nunca un número. Distinguen mayúsculas (`$a` y `$A` son distintas). No hace falta declararlas ni indicar su tipo.
- Las **funciones y métodos no distinguen mayúsculas** (`ECHO`, `Count()` funcionan); las variables sí.
- Salida: `echo` (construcción del lenguaje, varios argumentos), `print` (devuelve 1), `printf` (con formato), `print_r` (arrays legibles), `var_dump` (tipo y valor).
- Comparación: `==` (con conversión) y `===` (valor y tipo), como en JavaScript. `<>` equivale a `!=`. `<=>` devuelve -1, 0 o 1.
- Ámbito: dentro de una función no se ven las variables globales salvo con `global $x;` o `$GLOBALS['x']`. `static` conserva el valor entre llamadas.
- Fin de instrucción con `;`. Comentarios `//`, `#` y `/* */`.

**[Salió 2018]** Mostrar la posición y el valor de un array:

```php
for ($i = 0; $i < count($array); $i++) {
    echo "Posición " . $i . ": " . $array[$i] . "\n";
}
```

Las trampas usaban `+` (suma), `&` (operador de bits) o `concat()`, que no existe en PHP.

### Arrays

```php
<?php
$monedas = array("bitcoin", "ada", "ripple");    // indexado; también ["bitcoin", ...]
echo count($monedas);           // 3 [Salió 2017, 2018]
$persona = ["nombre" => "Ana", "edad" => 30];    // asociativo
$persona["email"] = "ana@x.es";
$monedas[] = "ether";           // añadir al final

foreach ($monedas as $m) { echo $m; }
foreach ($persona as $clave => $valor) { echo "$clave: $valor\n"; }
?>
```

- **[Salió 2017, 2018]** Número de elementos → **`count($array)`** (alias `sizeof`). `strlen()` es para cadenas. `length()` y `size()` no existen.
- **[Salió 2016]** Recorrer las cabeceras HTTP: `$cabeceras = getallheaders();` y luego **`foreach ($cabeceras as $nombre => $valor)`**. El orden es *array* `as` *clave* `=>` *valor*.

| Función | Hace |
|---|---|
| `count`, `in_array`, `array_key_exists`, `array_search` | Tamaño y búsquedas |
| `array_push`, `array_pop`, `array_shift`, `array_unshift` | Pila y cola |
| `array_merge`, `array_slice`, `array_splice` | Combinar y recortar |
| `sort`, `rsort`, `asort`, `ksort`, `usort` | Ordenar (por valor, por clave, con función) |
| `array_map`, `array_filter`, `array_reduce` | Funcionales |
| `implode`, `explode` | Array a cadena y cadena a array |
| `array_keys`, `array_values`, `range` | Claves, valores y rango (`range(1, 5)`) |

Funciones de cadena frecuentes: `strlen`, `strtoupper`, `strtolower`, `substr`, `strpos`, `str_replace`, `trim`, **`str_shuffle`** (desordena), `sprintf`, `htmlspecialchars` (escapa HTML contra XSS), `str_contains` (PHP 8).

**[Salió 2018]**

```php
<?php
$psswd = substr(str_shuffle("0123abcd"), 0, $length = 5);
echo $psswd;     // p. ej. "b2d0a"
?>
```

`str_shuffle` desordena los 8 caracteres, todos distintos. `substr(..., 0, 5)` toma los 5 primeros. Resultado: **contraseña aleatoria de 5 caracteres sin repetición**.

### Funciones y paso por referencia

```php
<?php
function eleva2(&$numero) {   // & = paso por referencia [Salió 2016]
    $numero = $numero * $numero;
}
function doble($n) { return $n * 2; }   // paso por valor

$N = 3;
echo "N=$N ";        // N=3
doble($N);
echo "N=$N ";        // N=3: por valor no cambia
eleva2($N);
echo "N=$N";         // N=9: por referencia sí cambia
?>
```

- Por defecto PHP pasa **por valor**. Con **`&`** delante del parámetro, la función modifica la variable original.
- Los objetos se pasan por "manejador": la función puede cambiar sus propiedades.
- Tipos y valores por defecto: `function saluda(string $n = "Ana"): string { ... }`.
- **[Salió 2016]** El supuesto pedía la salida tras una línea concreta. Hay que trazar el código: mientras no se llame a la función por referencia, el valor no cambia.

### Superglobales

| Variable | Contiene |
|---|---|
| **`$_GET`** | Parámetros de la URL (cadena de consulta) |
| **`$_POST`** | Datos enviados por formulario con `method="post"` **[Salió 2016]** |
| `$_REQUEST` | `$_GET`, `$_POST` y `$_COOKIE` juntos |
| **`$_SESSION`** | Datos de la sesión del usuario en el servidor **[Salió 2022]** |
| **`$_COOKIE`** | Cookies recibidas del navegador **[Salió 2016]** |
| `$_FILES` | Ficheros subidos (`name`, `tmp_name`, `size`, `error`) |
| `$_SERVER` | Datos del servidor y la petición: `REQUEST_METHOD`, `REMOTE_ADDR`, `HTTP_USER_AGENT`, `PHP_SELF` |
| `$_ENV` | Variables de entorno |
| `$GLOBALS` | Todas las variables globales |

- **[Salió 2016]** Capturar `nombre` enviado por POST → **`$_POST["nombre"]`**. `Request.Form("nombre")` es de ASP clásico.
- **[Salió 2016]** Leer una cookie → **`$_COOKIE["nombre de la cookie"]`**. `$HTTP_COOKIE_VARS` era el nombre antiguo (eliminado en PHP 5.4).
- **[Salió 2022]** Datos del inicio de sesión → **`$_SESSION`**. Trampas: `$SESSION`, `$_GLOBAL`, `$GLOBAL`.

### Sesiones y cookies en PHP

```php
<?php
session_start();                          // antes de cualquier salida
$_SESSION["usuario"] = "ana";             // guardar
if (isset($_SESSION["usuario"])) { ... }  // comprobar
unset($_SESSION["usuario"]);              // quitar un dato
session_destroy();                        // cerrar la sesión

setcookie("idioma", "es", [
    "expires"  => time() + 3600,          // 1 hora
    "path"     => "/",
    "secure"   => true,
    "httponly" => true,
    "samesite" => "Lax"
]);                                       // antes de enviar HTML
echo $_COOKIE["idioma"] ?? "sin cookie"; // disponible en la siguiente petición
?>
```

- La sesión se guarda **en el servidor**. El navegador solo guarda una cookie con el identificador (`PHPSESSID`).
- `setcookie` y `session_start` envían cabeceras: deben ejecutarse **antes de cualquier salida**. Si no, aparece "headers already sent".
- Para borrar una cookie se le pone una caducidad pasada.

### Acceso a MySQL

**Extensión mysqli en estilo procedimental** **[Salió 2016]**:

```php
<?php
$conn = mysqli_connect($servername, $username, $password, $dbname);  // línea 12
if (!$conn) { die("Error: " . mysqli_connect_error()); }
$sql = "SELECT id, nombre FROM alumno";
$result = mysqli_query($conn, $sql);                                 // línea 15
while ($row = mysqli_fetch_assoc($result)) {                         // línea 17
    echo $row["id"] . " - " . $row["nombre"] . "<br>";
}
mysqli_close($conn);
?>
```

- **[Salió 2016]** Conectar → **`mysqli_connect($servername, $username, $password, $dbname)`**. Trampas: `new mysqli_connect(...)` y `createMysqli`.
- **[Salió 2016]** Ejecutar → **`mysqli_query($conn, $sql)`**. Primero la conexión, luego la consulta. `$conn.query()` usa el punto, que en PHP concatena.
- **[Salió 2016]** Recorrer → **`while ($row = mysqli_fetch_assoc($result))`**. Devuelve un array asociativo por fila y `null` al acabar.
- Otras: `mysqli_fetch_array` (numérico y asociativo), `mysqli_fetch_row` (numérico), `mysqli_num_rows`, `mysqli_affected_rows`, `mysqli_insert_id`, `mysqli_real_escape_string`.

**mysqli orientado a objetos**: `$conn = new mysqli($s, $u, $p, $db);` y `$result = $conn->query($sql);` (en PHP se usa la flecha `->`, no el punto).

**PDO con consultas preparadas** (recomendado; evita la inyección SQL y vale para varios gestores):

```php
<?php
$pdo = new PDO("mysql:host=localhost;dbname=educa;charset=utf8mb4", $u, $p, [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
]);
$st = $pdo->prepare("SELECT * FROM alumno WHERE dni = :dni");
$st->execute([":dni" => $dni]);
$alumnos = $st->fetchAll(PDO::FETCH_ASSOC);
?>
```

La antigua extensión **`mysql_*`** (`mysql_connect`, `mysql_query`) se eliminó en **PHP 7**.

### Expresiones regulares en PHP

```php
<?php
if (!preg_match("/^[a-zA-Z ]*$/", $name)) {     // [Salió 2016]
    $nameErr = "Solo se permiten letras y espacios";
}
?>
```

- Funciones PCRE (compatibles con Perl): `preg_match`, `preg_match_all`, `preg_replace`, `preg_split`. El patrón va entre delimitadores (`/.../`) con modificadores (`/i`, `/u`).
- Las funciones `ereg*` (POSIX) se eliminaron en PHP 7.
- Validación sin regex: `filter_var($email, FILTER_VALIDATE_EMAIL)`.

### Orientación a objetos en PHP

```php
<?php
interface Saludable { public function saludar(): string; }

abstract class Persona {
    public function __construct(protected string $nombre) {}  // promoción (PHP 8)
}

trait Peticion {
    public function mostrarPeticion() {
        $descripcion = 'informal';
        echo "La petición es $descripcion";
    }
}

class Reivindicacion extends Persona implements Saludable {
    use Peticion;
    public function mostrarPeticion() {           // la clase prevalece sobre el trait
        $descripcion = 'formal';
        echo "La petición es $descripcion";
    }
    public function saludar(): string { return "Hola, {$this->nombre}"; }
}

$o = new Reivindicacion("Ana");
$o->mostrarPeticion();     // La petición es formal
?>
```

- Visibilidad: `public`, `protected`, `private`. `static`, `abstract`, `final`, `readonly` (8.1).
- Acceso a miembros con **`->`**; a estáticos y constantes con **`::`** (`self::`, `parent::`, `static::`).
- Herencia **simple** (`extends`) y varias interfaces (`implements`).
- **Traits** (PHP 5.4): reutilizan métodos en clases sin herencia (`use NombreTrait;`).
- **Precedencia de métodos**: **los de la clase actual sustituyen a los del trait**, y los del trait sustituyen a los heredados. Conflictos entre traits: `insteadof` y `as`.
- Métodos mágicos: `__construct`, `__destruct`, `__get`, `__set`, `__call`, `__toString`, `__invoke`.
- **[Salió 2017]** Supuesto de traits con nombres de método "casi iguales". Recuerda dos reglas: la clase gana al trait y **los nombres de método no distinguen mayúsculas**. Si un nombre lleva un espacio en medio, es un error de sintaxis.

**[Salió 2018]** Determinar el género a partir del nombre de pila → **clase `Gender`** de la extensión PECL `gender` (`$g = new Gender\Gender; $g->get("María");`). La opción de "Laravel aprende con el tiempo" era inventada.

### Composer y frameworks PHP

- **Composer**: gestor de dependencias de PHP. Fichero `composer.json`, carpeta `vendor/`, repositorio **Packagist**. Carga automática según **PSR-4** (estándares del PHP-FIG).

**Laravel** (Taylor Otwell, 2011), el framework PHP más usado:

| Elemento | Qué es |
|---|---|
| **Eloquent** | **ORM** de Laravel, patrón Active Record **[Salió 2018]** |
| Blade | Motor de plantillas (`{{ $var }}`, `@if`, `@foreach`) |
| **Artisan** | Consola de comandos (`php artisan make:model`, `migrate`, `serve`) |
| Migrations y Seeders | Versionado del esquema de base de datos y datos de prueba |
| Routing | `routes/web.php`, `routes/api.php` |
| Middleware | Filtros de petición (autenticación, CSRF) |
| **Broadcasting** | Emitir eventos en tiempo real por WebSocket: el evento implementa la interfaz **`ShouldBroadcast`** **[Salió 2017]** |
| Queues, Horizon | Colas de trabajos |
| Sanctum, Passport | Autenticación de API |
| Livewire, Inertia | Interfaces dinámicas |

```bash
composer create-project --prefer-dist laravel/laravel agencia   # [Salió 2018]
laravel new agencia            # con el instalador de Laravel
php artisan serve              # servidor de desarrollo
```

```php
class ServerCreated implements ShouldBroadcast {
    public function broadcastOn() { return new PrivateChannel('servidores'); }
}
```

**[Salió 2018]** Persistencia de Laravel → **Eloquent**. Distractores: SQLAlchemy (Python), iBATIS (Java, hoy MyBatis), Web2py (framework Python).

| Framework PHP | Notas |
|---|---|
| **Symfony** | SensioLabs; componentes reutilizables; ORM **Doctrine**, plantillas **Twig**. Laravel usa componentes de Symfony **[Salió 2018]** |
| CodeIgniter | Ligero |
| CakePHP | Convención sobre configuración |
| Yii | Alto rendimiento |
| Laminas | Antes Zend Framework |
| Slim | Microframework para APIs |

**[Salió 2018]** Alternativa PHP a Laravel → **Symfony**. Flask y Django son de Python; Vaadin, de Java.

CMS en PHP: WordPress, Drupal, Joomla, Moodle.

### Otros lenguajes y frameworks de servidor

| Lenguaje | Frameworks | Notas |
|---|---|---|
| Python | **Django** (MTV, ORM propio, panel de administración), **Flask** (microframework), **FastAPI** (APIs asíncronas) | **[Salió 2019]** Django |
| Ruby | **Ruby on Rails** (David Heinemeier Hansson, 2004) | **Framework web MVC**; "convención sobre configuración" y DRY; ORM Active Record **[Salió 2019]** |
| Java | Spring Boot, Jakarta EE (Servlets, JSP, JSF), Quarkus, Micronaut | Tema 19 |
| C# | ASP.NET Core (MVC, Razor Pages, Blazor) | Tema 19 |
| JavaScript/TypeScript | Express, NestJS, Next.js | Sobre Node.js |
| Go | Gin, Echo, librería estándar `net/http` | **[Salió 2022]** como lenguaje backend |

- **[Salió 2019]** Framework web de Python → **Django**. Keras es aprendizaje profundo; pip, el gestor de paquetes; NumPy, cálculo numérico.
- **[Salió 2019]** Ruby on Rails → **framework de desarrollo web basado en MVC**. No es un lenguaje (el lenguaje es Ruby, de Yukihiro Matsumoto) ni un sistema de control de versiones.
- **ASP clásico** (Active Server Pages, Microsoft, VBScript): `<% Response.Write(x) %>` se ejecuta **en el servidor**, que inserta el resultado en el HTML. **[Salió 2005]** Escrito dentro de un atributo `value`, rellena el campo con un dato generado en el servidor.
- **Applets de Java** **[Salió 2007, 2008]**: programas Java incrustados en una página que se ejecutaban **en el navegador del cliente** con un plugin. Están **obsoletos**: Java 9 los desaprobó y Java 11 retiró el plugin.

## Trampas y respuestas desactualizadas

- **Applets de Java (2007, 2008)**: preguntas marcadas como obsoletas. Los applets ya no existen en ningún navegador; `applet` no es HTML5 (2016).
- **Application Cache y atributo `manifest` (2017)**: la respuesta oficial era `<html manifest="ejemplo.appcache">`. Hoy está eliminado; la respuesta moderna es un **Service Worker**.
- **`keygen` y `keytype` (2016)**: el elemento se retiró de HTML. Si vuelve a salir, recuerda `rsa`, `dsa` y `ec`.
- **`-moz-border-radius` (2015)**: hoy basta `border-radius`. Los prefijos solo sobreviven en propiedades experimentales.
- **jQuery y `$.ajax` (2015)**: siguen siendo válidos, pero la API nativa actual es `fetch` (salió en 2025).
- **`getYear()` (2005)**: obsoleto. Devuelve año menos 1900 en navegadores modernos. Usa `getFullYear()`.
- **Etiqueta `u` (2008)**: la respuesta "texto subrayado" valía en HTML 4. En HTML5 su significado es "anotación no textual", aunque se siga viendo subrayado.
- **`mysql_*`**: si una opción usa `mysql_connect`, desconfía. Se eliminó en PHP 7. Lo correcto es `mysqli_*` o PDO.
- **AngularJS frente a Angular**: AngularJS (1.x) acabó su soporte en enero de 2022. Angular (2+) es otro framework en TypeScript.
- **Internet Explorer**: retirado en junio de 2022. Edge usa Blink desde 2020; no usa EdgeHTML ni Trident.
- **Xamarin y PhoneGap**: sin soporte. Hoy serían .NET MAUI y Capacitor/Cordova.
- **"CSS4" o "HTML 5.3"**: no existen como tales. CSS avanza por módulos y HTML es un *Living Standard* de WHATWG.
- **`size` frente a `maxlength` (2024)**: `size` solo cambia el ancho visible. `max` es para números y fechas. `length` no existe.
- **Especificidad (2024)**: una pseudoclase cuenta como clase (columna B), no como id. Una pseudoclase de un signo de dos puntos frente a un pseudoelemento de dos.
- **`!important` y usuario (2017)**: en reglas normales gana el autor; con `!important` gana el usuario. Mucha gente responde al revés.
- **`div + p`, `div > p` y `div p`**: hermano adyacente, hijo directo y descendiente. Los cambian entre opciones.
- **Bootstrap "no es framework de JavaScript"**: en 2022 la respuesta era JDBC. Si no estuviera JDBC, la discusión sería Bootstrap (framework CSS).
- **`onreadystatechange = f` frente a `= f()`**: con paréntesis se asigna el resultado de llamar a la función, no la función.
- **`open()` frente a `send()`**: `open` configura, `send` envía. El tercer parámetro `true` es asíncrono; `false`, síncrono (desaconsejado).
- **`readyState` 4 frente a `status` 200**: 4 es "operación completada"; 200 es el código HTTP de éxito.
- **`fetch` y errores HTTP**: la promesa no se rechaza con un 404; hay que mirar `response.ok`.
- **JSON**: claves con comillas dobles, nada de comillas simples, comas finales ni comentarios. `JSON.parse` frente a `JSON.stringify`.
- **XML**: distingue mayúsculas; un solo raíz; atributos siempre entre comillas; comentarios `<!-- -->`. Un DTD externo no exime del elemento raíz (2025).
- **DTD**: `*` es "cero o más", `+` "uno o más", `?` "cero o uno". La trampa típica es "al menos una" con `*`.
- **SAX frente a DOM/JDOM**: SAX es secuencial, de solo lectura, por eventos y con poca memoria. DOM y JDOM cargan el árbol y permiten editar.
- **XLS frente a XSL (2008)**: el enunciado usaba "XLS" por errata. XSL es el lenguaje de hojas de estilo para XML; XLS es la extensión de Excel.
- **JavaScript "de segunda clase" (2019)**: las funciones son de primera clase. También es falso que JavaScript sea "fuertemente tipado" o "compilado a bytecode Java".
- **ECMAScript 7 = ES2016**: solo trajo `**` e `includes`. `async`/`await` es ES2017, no ES7.
- **PHP**: el concatenador es el punto, no `+`. `count` y no `length`. Superglobales con guion bajo (`$_POST`, `$_SESSION`), salvo `$GLOBALS`.
- **Laravel**: Eloquent es su ORM. Doctrine es de Symfony, SQLAlchemy de Python, Hibernate de Java.
- **Responsive frente a adaptativo (2017)**: responsive es una sola plantilla fluida; adaptativo, varias plantillas fijas.
- **Gecko frente a Firefox (2022)**: Firefox es el navegador; Gecko, su motor. WebKit es de Apple; Blink, de Google.
