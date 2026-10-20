# Tema 23. Metodologías, pruebas y control de versiones

Peso en el examen: unas **3 preguntas de test** y casi **2 preguntas del supuesto del Bloque III** por convocatoria (unos 6 puntos esperados sobre 100). Hay **70 preguntas históricas** (2005-2025). Se concentran en cuatro zonas. La primera, las **pruebas** (tipos de prueba de Métrica v3, herramientas como JUnit, JMeter, Selenium o Jest). La segunda, el **control de versiones** (comandos Git y SVN, herramientas de versiones). La tercera, los **Diagramas de Flujo de Datos de Métrica v3**, muy preguntados de 2005 a 2019. La cuarta, desde 2017, la cadena **DevOps**: integración continua (Jenkins, Bamboo, GitHub Actions), calidad de código (SonarQube) y ficheros de repositorio (README, .gitignore). Scrum ha salido poco (2024), pero es materia segura del epígrafe.

## Cómo lo preguntan

- **Definición literal de Métrica v3 y elegir el tipo de prueba**: integración (2018, 2022, 2024), rendimiento (2019), implantación (2018 b3). Las definiciones se copian casi palabra por palabra.
- **"Qué comando Git hace X"**: `git init` (2017), `git push origin master` (2017), `git tag` (2018), `git log` (2019), `git fetch` (2025). En 2015 se preguntó lo mismo con Subversion (`svn checkout`, `svn status`).
- **"Cuál NO es / cuál sí es una herramienta de control de versiones"**: el distractor es una herramienta de pruebas o de otro tipo (JMeter en 2022, Selenium y Cucumber en 2024, Cassandra, Lucene, Gimp en 2015-2016).
- **Asociar herramienta y función**: Jest = pruebas JS (2019), Selenium WebDriver = automatizar el navegador (2022), JMeter = carga y estrés (2017, 2019), Jenkins = pipelines (2022), MantisBT = seguimiento de errores (2017).
- **"Señale la INCORRECTA"** sobre SonarQube (2018: no hace análisis dinámico), pruebas de regresión (2018: sí se automatizan) o DFD (2007, 2018).
- **Reglas de los DFD**: tipos de flujo (consulta, actualización, diálogo), conexiones permitidas, consistencia al explotar un proceso, proceso primitivo. Salen con regularidad entre 2005 y 2019.
- **Supuesto con contexto de equipo**: "su equipo usa Scrum, ¿en qué reunión...?" (2024, retrospectiva) o "quiere facilitar la incorporación de desarrolladores, ¿qué fichero?" (2024, README).
- **Código para leer**: Javadoc correcto entre cuatro bloques (2015), uso de `assertThrows` en JUnit 5 (2025).

## 1. Repositorios y plataformas colaborativas

### 1.1. Qué es un repositorio

Un **repositorio** es un almacén gestionado de artefactos con historial y control de acceso. En desarrollo hay tres clases:

| Tipo | Qué guarda | Ejemplos |
|---|---|---|
| Repositorio de código fuente | Código y su historial de versiones | Git (GitHub, GitLab, Bitbucket, Gitea), Subversion, Mercurial |
| Repositorio de artefactos o binarios | Librerías compiladas, paquetes, imágenes | Nexus Repository, JFrog Artifactory, Maven Central, npm registry, PyPI, NuGet |
| Registro de contenedores | Imágenes Docker y OCI | Docker Hub, Harbor, GitHub Container Registry, Quay |

También se llama repositorio al almacén de una herramienta CASE (diccionario de modelos y especificaciones) y al de documentación (Alfresco, SharePoint).

### 1.2. Plataformas colaborativas de desarrollo

Integran el repositorio Git con revisión de código, gestión de incidencias, wiki e integración continua.

| Plataforma | Propietario | Rasgos |
|---|---|---|
| GitHub | Microsoft (desde 2018) | Pull requests, Issues, Projects, Actions, Copilot, Pages, Packages |
| GitLab | GitLab Inc. | Merge requests, GitLab CI/CD (`.gitlab-ci.yml`), autoalojable (Community Edition libre) |
| Bitbucket | Atlassian | Integración con Jira y Confluence, Bitbucket Pipelines |
| Azure DevOps | Microsoft | Azure Repos (Git o TFVC), Boards, Pipelines, Test Plans, Artifacts. Antes Team Foundation Server **[Salió 2018]** |
| Gitea / Forgejo | Comunidad | Ligeras, autoalojables, libres |

Herramientas colaborativas complementarias:

- **Seguimiento de incidencias y errores (bug trackers)**: Jira, Redmine, **MantisBT [Salió 2017]**, Bugzilla, Trac, GitHub Issues.
- **Tableros y planificación**: Trello, Jira Software, Azure Boards, Taiga, GitHub Projects.
- **Documentación compartida**: Confluence, wikis de GitHub o GitLab, MediaWiki.
- **Comunicación**: Slack, Microsoft Teams, Mattermost.

### 1.3. Ficheros convencionales de un repositorio

| Fichero | Para qué sirve |
|---|---|
| `README.md` | Propósito del proyecto, instalación, cómo arrancarlo en local, uso **[Salió 2024]** |
| `LICENSE` | Texto de la licencia |
| `CONTRIBUTING.md` | Normas para contribuir |
| `CODEOWNERS` | Responsables de revisar cada ruta (GitHub y GitLab lo usan para asignar revisores) |
| `CHANGELOG.md` | Cambios por versión |
| `CITATION.cff` | Cómo citar el software en trabajos académicos |
| `SECURITY.md` | Cómo notificar vulnerabilidades |
| `CODE_OF_CONDUCT.md` | Código de conducta |
| `.gitignore` | Ficheros que Git no debe seguir **[Salió 2016]** |
| `.gitattributes` | Atributos por ruta (finales de línea, Git LFS) |
| `.github/workflows/*.yml` | Flujos de GitHub Actions |
| `.gitlab-ci.yml` | Pipeline de GitLab CI |
| `Jenkinsfile` | Pipeline de Jenkins |

### 1.4. Repositorios de la Administración

- **Centro de Transferencia de Tecnología (CTT)** del Portal de Administración Electrónica (PAe): directorio de aplicaciones reutilizables de las AAPP, con forja de código.
- **Ley 40/2015, art. 157**: las AAPP deben poner a disposición de otras las aplicaciones de las que son titulares. Pueden declararlas de fuentes abiertas.
- **Ley 40/2015, art. 158**: directorios actualizados de aplicaciones para su libre reutilización. Antes de adquirir o desarrollar, hay que consultar si existen soluciones reutilizables.
- Licencia recomendada para software de las AAPP europeas: **EUPL** (European Union Public Licence, versión 1.2).
- Nivel europeo: **code.europa.eu** (GitLab de la Comisión) y Joinup (Interoperable Europe).

## 2. Generación de código y documentación

### 2.1. Herramientas CASE

CASE = *Computer Aided Software Engineering*. Clasificación por fase del ciclo de vida que cubren:

| Tipo | Fases | Ejemplo de uso |
|---|---|---|
| Upper CASE (U-CASE, front-end) | Planificación, análisis de requisitos, modelado del negocio | Diagramas de alto nivel |
| Middle CASE (M-CASE) | **Análisis y diseño** **[Salió 2008]** | DFD, E/R, UML |
| Lower CASE (L-CASE, back-end) | **Generación de código**, pruebas, implantación **[Salió 2008]** | Generadores, depuradores |
| I-CASE (integradas) | Todo el ciclo, con repositorio común | Rational, Enterprise Architect |

Las herramientas CASE se aplican en la unidad de **Desarrollo y mantenimiento** de una organización TI **[Salió 2006]**. Su núcleo es el **repositorio CASE** (diccionario de datos con todos los modelos).

### 2.2. Generación automática de código

- **Desde modelos (MDA/MDD)**: Model Driven Architecture del OMG. Se pasa de un modelo independiente de plataforma (PIM) a uno específico (PSM) y de ahí a código.
- **Andamiaje (scaffolding)**: Spring Initializr, Maven archetypes, JHipster, Yeoman, Angular CLI (`ng generate`), `rails generate`, `dotnet new`.
- **Desde contratos de API**: OpenAPI Generator y Swagger Codegen generan clientes y servidores a partir de un fichero OpenAPI. JAXB y `wsimport` lo hacen desde XSD y WSDL.
- **ORM e ingeniería inversa**: Hibernate Tools, Entity Framework (*database first*) generan entidades a partir de la BD.
- **Procesadores de anotaciones**: Lombok genera getters, setters y constructores en compilación. MapStruct genera mapeadores.
- **Asistentes con IA**: GitHub Copilot, Gemini Code Assist, Amazon Q Developer, Claude Code, Cursor. Sugieren o escriben código a partir de lenguaje natural. El código generado debe revisarse y probarse igual que el escrito a mano.

**Refactorización** **[Salió 2017]**: cambiar la estructura interna del código sin alterar su comportamiento externo (Martin Fowler). Ejemplos: extraer método, renombrar, mover clase, eliminar duplicados. Los IDE la automatizan. Distractores habituales: ofuscación (hacer el código ilegible a propósito), compresión, encapsulación.

**IDE y extensiones**: Eclipse se extiende con *plug-ins*. Un plug-in declara **puntos de extensión** para que otros le añadan funcionalidad; quien la añade declara **extensiones** **[Salió 2008]**. El plug-in de Git para Eclipse es **EGit** (basado en JGit) **[Salió 2016]**. Para Subversion existían Subclipse y Subversive. IntelliJ IDEA, NetBeans y Visual Studio Code integran Git de serie.

### 2.3. Documentación del código: Javadoc

**Javadoc** genera documentación HTML de APIs Java a partir de los comentarios **[Salió 2017]**. El comentario empieza por `/**` (dos asteriscos), no por `/*` **[Salió 2015]**.

```java
/**
 * Indica si el cliente ha realizado alguna reserva.
 *
 * @param cif CIF del cliente
 * @return {@code true} si el cliente tiene alguna reserva
 * @throws IllegalArgumentException si el CIF es nulo
 * @see utilidades.Reservas#verReservas(String)
 * @since 1.2
 */
public boolean tieneReservas(String cif) { ... }
```

| Etiqueta | Uso |
|---|---|
| `@param nombre` | Describe un parámetro (no existe `@parameter`) |
| `@return` | Describe el valor devuelto |
| `@throws` / `@exception` | Excepción que puede lanzar |
| `@see paquete.Clase#metodo(Tipo)` | Referencia cruzada (no existe `@ref`) |
| `{@link Clase#metodo}` | Enlace en línea dentro del texto |
| `{@code texto}` | Texto en fuente de código |
| `@author`, `@version`, `@since` | Autor, versión, desde qué versión existe |
| `@deprecated` | Elemento obsoleto |
| `{@inheritDoc}` | Hereda la documentación del método sobrescrito |

Comando: `javadoc -d doc src/*.java`. Con Maven: `mvn javadoc:javadoc`. Desde **Java 23 (JEP 467)** se admiten comentarios de documentación en Markdown con `///` en cada línea.

### 2.4. Otras herramientas de documentación

| Herramienta | Lenguaje o ámbito |
|---|---|
| Doxygen | C, C++, Java, Python y otros |
| JSDoc / TSDoc | JavaScript / TypeScript |
| Sphinx, pydoc | Python (docstrings) |
| PHPDocumentor | PHP |
| XML doc comments (`///`) y DocFX | C# y .NET |
| Swagger UI, Redoc | APIs REST descritas con OpenAPI |
| MkDocs, Docusaurus, AsciiDoc | Sitios de documentación de proyecto |
| Diagramas como código | PlantUML, Mermaid |

Los manuales (usuario, explotación) son productos de la metodología. En Métrica v3 los manuales de usuario se elaboran en el proceso CSI (actividad CSI 6).

### 2.5. Licencias de documentación y contenidos

- **Creative Commons**: familia de licencias para contenidos (BY, SA, NC, ND). CC0 es dominio público.
- **GNU FDL**: licencia de documentación libre de la FSF (Wikipedia la usó hasta 2009).
- **Open Publication License (OPL)**: licencia abierta de publicaciones, hoy en desuso.
- No existe una "SKL (Sharing Knowledge Licence)" estándar **[Salió 2007]**.

## 3. Métrica versión 3

### 3.1. Qué es y cómo se organiza

Metodología de planificación, desarrollo y mantenimiento de sistemas de información. La promovió el Consejo Superior de Informática (Ministerio de Administraciones Públicas) en 2001. Se basa en ISO/IEC 12207 e ISO/IEC 15504. Admite desarrollo estructurado y orientado a objetos.

**Procesos principales**:

| Proceso | Sigla | Contenido |
|---|---|---|
| Planificación de Sistemas de Información | PSI | Plan de sistemas alineado con la estrategia |
| Estudio de Viabilidad del Sistema | EVS | Alternativas de solución y selección |
| Análisis del Sistema de Información | ASI | Requisitos, modelos lógicos (DFD, E/R, casos de uso), plan de pruebas |
| Diseño del Sistema de Información | DSI | Arquitectura, diseño físico, especificación técnica del plan de pruebas |
| Construcción del Sistema de Información | CSI | Código, pruebas unitarias, de integración y del sistema, manuales |
| Implantación y Aceptación del Sistema | IAS | Pruebas de implantación y de aceptación, paso a producción |
| Mantenimiento de Sistemas de Información | MSI | Mantenimiento correctivo y evolutivo |

EVS, ASI, DSI, CSI e IAS forman el **proceso de Desarrollo**.

**Interfaces** (actividades que acompañan a todos los procesos):

- Gestión de Proyectos (GP).
- Seguridad (SEG).
- Aseguramiento de la Calidad (CAL).
- Gestión de la Configuración (GC). Es la que controla versiones de productos.

### 3.2. Actividades de CSI e IAS (donde están las pruebas)

| Actividad | Nombre |
|---|---|
| CSI 1 | Preparación del entorno de generación y construcción |
| CSI 2 | Generación del código de los componentes y procedimientos |
| CSI 3 | Ejecución de las pruebas unitarias |
| CSI 4 | Ejecución de las pruebas de integración |
| CSI 5 | Ejecución de las pruebas del sistema |
| CSI 6 | Elaboración de los manuales de usuario |
| CSI 7 | Definición de la formación de usuarios finales |
| CSI 8 | Construcción de los componentes y procedimientos de migración y carga inicial de datos |
| CSI 9 | Aprobación del sistema de información |
| IAS 5 | Pruebas de implantación del sistema |
| IAS 6 | Pruebas de aceptación del sistema |
| IAS 10 | Paso a producción |

El **plan de pruebas** se especifica en ASI 10 y se detalla técnicamente en DSI 10. Las pruebas de regresión se aplican en MSI tras cada cambio.

**Participantes** habituales: Comité de Dirección, Comité de Seguimiento, Jefe de Proyecto, Analistas, Programadores, Equipo del Proyecto, Usuarios Expertos, Equipo de Soporte Técnico, Técnicos de Sistemas, Equipo de Formación, Responsable de Mantenimiento. La elaboración de los manuales de usuario la realiza el **Equipo del Proyecto** **[Salió 2022]**. El Equipo de Formación participa en la formación (CSI 7, IAS 2), no en los manuales.

### 3.3. Tipos de pruebas según Métrica v3 (memorizar literalmente)

Las definiciones salen casi copiadas. Fíjate en la palabra clave de cada una.

- **Pruebas unitarias**: verifican la funcionalidad y estructura de **cada componente individualmente**, una vez codificado.
- **Pruebas de integración** **[Salió 2018, 2022, 2024]**: verifican el **correcto ensamblaje entre los distintos componentes**, una vez probados unitariamente. Comprueban que **interactúan correctamente a través de sus interfaces, tanto internas como externas**, cubren la funcionalidad establecida y se ajustan a los requisitos no funcionales especificados.
- **Pruebas del sistema**: son pruebas de integración del **sistema de información completo**. Prueban el sistema en su conjunto y **con otros sistemas con los que se relaciona**, para verificar que se cumplen las especificaciones funcionales y técnicas.
- **Pruebas de implantación** **[Salió 2018]**: comprueban el funcionamiento correcto del sistema **integrado de hardware y software en el entorno de operación**. Permiten al usuario, desde el punto de vista de **operación**, aceptar el sistema instalado en su entorno real, según los requisitos no funcionales.
- **Pruebas de aceptación**: validan que el sistema cumple los requisitos de funcionamiento esperado (catálogo de requisitos y criterios de aceptación). Buscan la **aceptación final por parte del usuario**.
- **Pruebas de regresión** **[Salió 2018]**: eliminan el **efecto onda**. Comprueban que los cambios en un componente no introducen errores en otros componentes no modificados. Repiten pruebas ya hechas y **se pueden y suelen automatizar**.

Las **pruebas del sistema** incluyen estos subtipos:

| Subtipo | Qué verifica |
|---|---|
| Funcionales | Que el sistema hace lo especificado |
| De comunicaciones | Interfaces y comunicaciones con otros sistemas, interfaces hombre-máquina |
| **De rendimiento** **[Salió 2019]** | Que los **tiempos de respuesta** están dentro de los intervalos especificados |
| De volumen | Funcionamiento con grandes volúmenes de datos |
| De sobrecarga | Comportamiento en el umbral límite de recursos |
| De disponibilidad de datos | Recuperación tras un fallo sin perder integridad |
| De facilidad de uso | Adecuación a las necesidades del usuario |
| De operación | Arranque, parada, copias, recuperación, operación |
| De entorno | Interacción con otros sistemas del mismo entorno |
| De seguridad | Mecanismos de control de acceso e intrusión |

Truco: si el enunciado dice "interfaces" o "ensamblaje", es integración. Si dice "entorno de operación" o "hardware y software", es implantación. Si dice "usuario" y "requisitos", es aceptación. Si dice "efecto onda", es regresión.

### 3.4. Mantenimiento

Tipos clásicos (Métrica v3 y la norma ISO/IEC 14764):

- **Correctivo**: corrige errores.
- **Evolutivo**: incorpora cambios por nuevas necesidades del usuario.
- **Adaptativo**: adapta el sistema a cambios del entorno (SO, hardware, normativa técnica).
- **Perfectivo**: mejora calidad interna o rendimiento sin cambiar la funcionalidad.
- **Preventivo** (ISO/IEC 14764): detecta y corrige fallos latentes antes de que se manifiesten.

"Acumulativo" no es un tipo de mantenimiento **[Salió 2006]**. El proceso MSI de Métrica v3 cubre solo el **correctivo y el evolutivo**.

### 3.5. Diagramas de Flujo de Datos (DFD)

Técnica de Métrica v3 para el modelo de procesos en ASI. Representa el flujo de datos entre procesos, almacenes y entidades externas. Es **lógico**: no tiene en cuenta restricciones físicas. Permite identificar gráficamente los **límites del sistema** y la lógica de los procesos **[Salió 2006]**.

**Elementos** **[Salió 2015, 2019]**:

| Elemento | Definición |
|---|---|
| Entidad externa | Fuente o destino de información fuera del sistema (persona, organización, otro sistema) |
| Proceso | Transforma flujos de entrada en flujos de salida. Nunca es origen ni final de los datos |
| Almacén de datos | Información **en reposo**. No crea, transforma ni destruye datos |
| Flujo de datos | Datos **en movimiento**. Comunica procesos con procesos, almacenes o entidades |
| Proceso de control | Coordina y sincroniza las actividades de otros procesos (tiempo real) **[Salió 2019]** |
| Flujo de control | Señal entre un proceso de control y otro proceso. No transporta datos |

**Tipos de flujo entre proceso y almacén** **[Salió 2006, 2015, 2016, 2017]**:

- **De consulta**: el proceso lee del almacén.
- **De actualización**: el proceso crea, modifica o borra datos del almacén.
- **De diálogo**: consulta y actualización a la vez (flujo bidireccional).

No existen flujos "de relación", "de optimización", "de extracción", "de comentario" ni "de control y comunicación" como tipos entre proceso y almacén.

**Conexiones permitidas** **[Salió 2005]**:

| Desde (fila) hacia (columna) | Proceso | Almacén | Entidad externa |
|---|---|---|---|
| Proceso | Sí | Sí | Sí |
| Almacén | Sí | No | No |
| Entidad externa | Sí | No | No |

Es decir, todo flujo tiene un proceso en al menos un extremo. Siempre hace falta un proceso entre una entidad externa y un almacén. Dos procesos sí pueden conectarse directamente.

**Niveles**:

- **Nivel 0, diagrama de contexto**: el de menor detalle. Un **único proceso** que representa todo el sistema, con las entidades externas y sus flujos **[Salió 2007, 2016]**.
- **Nivel 1, diagrama de subsistemas**: un proceso por cada subsistema y los flujos entre ellos.
- **Niveles siguientes**: se descompone ("explota") cada proceso hasta llegar a los **procesos primitivos**, los que **no necesitan más descomposición** **[Salió 2017]**. Cada proceso primitivo se describe con una especificación de proceso (lenguaje estructurado, tablas o árboles de decisión).

**Consistencia al explotar un proceso** (balanceo) **[Salió 2018]**:

- No deben faltar flujos de entrada o salida que tenía el proceso de nivel superior.
- No debe aparecer un flujo nuevo que no estuviera asociado al proceso de nivel superior.
- Todos los elementos del nuevo DFD deben estar conectados, directa o indirectamente, con los flujos del proceso origen.
- Un flujo puede **dividirse en varios** en el nivel inferior (descomposición de flujos).
- Las **entidades externas no se descomponen**. Es la afirmación falsa típica.

**Otras reglas**:

- Un almacén o una entidad externa **sí pueden aparecer duplicados** en un mismo diagrama para mejorar la legibilidad. Se marcan con una línea **[Salió 2018]**.
- Un proceso sin entradas es un "milagro" y uno sin salidas un "agujero negro". Ambos son errores.
- Los almacenes se crean en el nivel en que se usan por primera vez por más de un proceso.
- La numeración es jerárquica: el proceso 2 se explota en 2.1, 2.2, 2.3.

### 3.6. Otras técnicas de Métrica v3 (lo justo)

- **Modelado de datos**: modelo E/R extendido y normalización (tema 15).
- **Orientación a objetos**: casos de uso, diagramas de clases, secuencia, estados (UML, tema 18).
- **Historia de la vida de las entidades (HVE)** y diagramas de estructura de **Jackson**: las HVE usan notación de Jackson. Jackson (JSP) parte de las estructuras de datos de entrada y salida **[Salió 2007]**.
- **Técnicas de gestión**: PERT, Gantt, estimación por puntos de función (Albrecht) o Métrica Mark II, análisis coste-beneficio.
- **Técnicas de participación**: JAD, JRP, entrevistas, sesiones de trabajo, prototipado, presentaciones.
- **Prototipado**: los prototipos rápidos (desechables) sirven para validar requisitos y **adquirir experiencia en el análisis** del sistema. No para acelerar la codificación **[Salió 2007]**.

## 4. Otras metodologías de desarrollo

### 4.1. Modelos de ciclo de vida clásicos

| Modelo | Idea | Ventaja | Inconveniente |
|---|---|---|---|
| Cascada (Royce, 1970) | Fases secuenciales: requisitos, diseño, codificación, pruebas, mantenimiento | Sencillo, buena documentación | Rígido, el usuario ve el producto al final |
| Modelo en V | Cascada en la que cada fase de desarrollo tiene su nivel de prueba | Pruebas planificadas desde el inicio | Igual de rígido |
| Prototipado | Se construye un prototipo para validar requisitos | Aclara requisitos difusos | El prototipo desechable puede acabar en producción |
| Incremental | Se entrega el sistema por partes funcionales | Valor temprano | Requiere buena arquitectura inicial |
| Espiral (Boehm, 1986) | Ciclos con análisis de **riesgos** en cada vuelta | Gestión explícita del riesgo | Complejo, caro |
| RAD | Desarrollo rápido con herramientas y prototipos | Muy rápido | Exige usuarios muy implicados |

En el **modelo en V** cada nivel de prueba valida una fase: unitarias con diseño detallado, integración con diseño arquitectónico, sistema con requisitos del sistema y aceptación con requisitos de usuario.

### 4.2. Proceso Unificado (PUD y RUP)

El Proceso Unificado de Desarrollo (Jacobson, Booch, Rumbaugh, 1999) tiene tres rasgos **[Salió 2008]**:

- **Iterativo e incremental**.
- **Dirigido por casos de uso**.
- **Centrado en la arquitectura**.

Además está guiado por los riesgos y usa UML. Fases: **Inicio** (Inception), **Elaboración**, **Construcción** y **Transición**. Cada fase tiene iteraciones y acaba en un hito. RUP (Rational Unified Process) es la versión comercial de IBM Rational, con disciplinas (requisitos, análisis y diseño, implementación, pruebas, despliegue...).

### 4.3. Manifiesto ágil

Firmado en febrero de 2001 (Snowbird, Utah) por 17 desarrolladores. Cuatro valores:

1. **Individuos e interacciones** sobre procesos y herramientas.
2. **Software funcionando** sobre documentación extensiva.
3. **Colaboración con el cliente** sobre negociación contractual.
4. **Respuesta ante el cambio** sobre seguir un plan.

Valora lo de la derecha, pero más lo de la izquierda. Tiene **12 principios**: entrega temprana y continua de software con valor, aceptar cambios de requisitos incluso tarde, entregas frecuentes (de semanas a meses), negocio y desarrolladores juntos a diario, conversación cara a cara, software funcionando como medida de progreso, ritmo sostenible, excelencia técnica, simplicidad, equipos autoorganizados y reflexión periódica para ajustar el comportamiento.

### 4.4. Scrum (Guía Scrum 2020)

Marco de trabajo ligero, empírico, basado en **tres pilares**: **transparencia, inspección y adaptación**. Cinco **valores**: compromiso, foco, apertura, respeto y coraje.

**Equipo Scrum** (normalmente 10 personas o menos, sin subequipos ni jerarquías). La guía de 2020 habla de "responsabilidades" (*accountabilities*), no de roles:

| Responsabilidad | Función |
|---|---|
| Product Owner | Una sola persona. Maximiza el valor del producto. Gestiona y ordena el Product Backlog y define el Objetivo del Producto |
| Scrum Master | Responsable de la eficacia del equipo. Líder que sirve. Enseña Scrum y elimina impedimentos |
| Developers | Crean el Incremento cada Sprint. Elaboran el Sprint Backlog y se responsabilizan de la calidad (Definición de Terminado) |

**Eventos** (duración máxima para un Sprint de un mes; más cortos si el Sprint es más corto):

| Evento | Duración máxima | Propósito |
|---|---|---|
| Sprint | 1 mes | Contenedor de los demás eventos. Duración fija |
| Sprint Planning | 8 horas | Qué se hará (Objetivo del Sprint), cómo, y por qué es valioso |
| Daily Scrum | 15 minutos | Los Developers inspeccionan el progreso hacia el Objetivo del Sprint y adaptan el plan |
| Sprint Review | 4 horas | Se inspecciona el Incremento con los interesados y se adapta el Product Backlog |
| **Sprint Retrospective** | 3 horas | Se planifica cómo **mejorar la calidad y la eficacia**: personas, interacciones, procesos, herramientas, Definición de Terminado **[Salió 2024]** |

La **retrospectiva** cierra el Sprint y es donde se comenta una mala práctica para no repetirla. La **Review** mira el producto; la **Retrospective** mira el proceso. El **refinamiento** del Product Backlog es una actividad continua, no un evento.

**Artefactos y sus compromisos**:

| Artefacto | Compromiso |
|---|---|
| Product Backlog | Objetivo del Producto (Product Goal) |
| Sprint Backlog | Objetivo del Sprint (Sprint Goal) |
| Incremento | Definición de Terminado (Definition of Done) |

Prácticas habituales no obligatorias en la Guía: historias de usuario, puntos de historia, Planning Poker, gráfico de *burndown*, velocidad del equipo.

### 4.5. Otras metodologías ágiles y afines

- **Extreme Programming (XP, Kent Beck)**: programación en parejas, TDD, integración continua, refactorización, entregas pequeñas, diseño simple, propiedad colectiva del código, estándares de codificación, cliente in situ, ritmo sostenible (40 horas), juego de la planificación.
- **Kanban**: visualizar el flujo en un tablero, **limitar el trabajo en curso (WIP)**, gestionar el flujo, políticas explícitas, mejora continua. Métricas: *lead time* (desde la petición hasta la entrega) y *cycle time* (desde que se empieza hasta que se termina). No tiene iteraciones fijas ni roles prescritos.
- **Lean Software Development**: eliminar desperdicio, amplificar el aprendizaje, decidir lo más tarde posible, entregar rápido.
- **Crystal, FDD (Feature Driven Development), DSDM**: otros métodos ágiles. DSDM usa la priorización **MoSCoW** (Must, Should, Could, Won't).
- **Escalado**: SAFe, LeSS, Nexus, Scrum@Scale.
- **DevOps**: cultura que une desarrollo y operaciones. Automatiza integración, pruebas y despliegue. **DevSecOps** integra la seguridad en todo el ciclo ("shift left").

## 5. Pruebas del software

### 5.1. Conceptos básicos

- **Error** (equivocación humana) produce un **defecto** (fallo en el código, bug), que al ejecutarse provoca un **fallo** (comportamiento incorrecto observable).
- **Verificación**: ¿estamos construyendo el producto correctamente? (cumple la especificación).
- **Validación**: ¿estamos construyendo el producto correcto? (satisface al usuario).
- **Pruebas estáticas**: sin ejecutar el código (revisiones, inspecciones, análisis estático con SonarQube o linters).
- **Pruebas dinámicas**: ejecutando el código.
- Las pruebas muestran la presencia de defectos, no su ausencia. Las pruebas exhaustivas son imposibles.

### 5.2. Niveles de prueba

| Nivel | Objeto | Quién suele hacerlo |
|---|---|---|
| Unitarias (de componente) | Una unidad aislada: método, clase | Desarrolladores |
| De integración | Interacción entre componentes a través de interfaces **[Salió 2018, 2024]** | Desarrolladores o equipo de pruebas |
| De sistema | El sistema completo frente a requisitos funcionales y no funcionales | Equipo de pruebas |
| De aceptación | Que el usuario acepta el sistema | Usuarios o cliente |

Estrategias de integración: **descendente** (top-down, usa *stubs* para lo que falta abajo), **ascendente** (bottom-up, usa *drivers* para lo que falta arriba), **sándwich** y **big bang** (todo a la vez).

Las pruebas de aceptación pueden ser **alfa** (en las instalaciones del desarrollador, con usuarios) o **beta** (en el entorno del usuario, sin el desarrollador).

### 5.3. Tipos de prueba

**Por conocimiento del código**:

- **Caja negra** (funcionales): sin mirar el código, a partir de la especificación. Técnicas: **partición en clases de equivalencia**, **análisis de valores límite**, tablas de decisión, transición de estados, casos de uso.
- **Caja blanca** (estructurales): mirando el código. Técnicas de cobertura: de sentencias, de decisiones o ramas, de condiciones, de caminos. **Complejidad ciclomática de McCabe**: V(G) = aristas − nodos + 2 = número de decisiones + 1. Da el número de caminos independientes que hay que probar.
- **Caja gris**: combinación de ambas.

**No funcionales**:

| Prueba | Objetivo |
|---|---|
| De rendimiento | Tiempos de respuesta bajo carga normal |
| De carga | Comportamiento con la carga esperada de usuarios concurrentes |
| De estrés | Llevar el sistema más allá de su límite para ver cómo falla y se recupera |
| De pico (spike) | Subidas bruscas de carga |
| De resistencia (soak) | Carga sostenida durante mucho tiempo (fugas de memoria) |
| De volumen | Grandes cantidades de datos |
| De seguridad | Vulnerabilidades: SAST (estático), DAST (dinámico), pentesting |
| De usabilidad | Facilidad de uso |
| De accesibilidad | Cumplimiento de WCAG (tema 22) |
| De compatibilidad | Navegadores, dispositivos, sistemas operativos |

**Relacionadas con el cambio**:

- **Re-test o de confirmación**: se repite la prueba que falló para confirmar la corrección.
- **De regresión**: se repiten pruebas ya superadas para comprobar que el cambio no rompe nada más. Ideales para automatizar **[Salió 2018]**.
- **Smoke test** (prueba de humo): comprobación rápida de que lo básico funciona tras un despliegue.

**Otras**:

- **End-to-end (E2E)**: recorren un flujo completo de usuario a través de la interfaz.
- **De mutación**: se introducen cambios artificiales (mutantes) en el código para medir la calidad de las pruebas (PIT en Java, Stryker en JS).
- **Exploratorias**: diseño y ejecución simultáneos, sin guion.
- **De contrato**: verifican que proveedor y consumidor de una API cumplen el contrato (Pact).

### 5.4. Productos y normas de pruebas

Productos típicos del proceso de pruebas: **plan de pruebas**, **especificación de diseño de pruebas**, **casos de prueba** (entrada, condiciones, resultado esperado), **procedimientos de prueba**, **registro (log) de pruebas**, **informe de incidentes** e **informe de resumen o final de pruebas**. Venían de la norma IEEE 829 (sustituida). Hoy rige **ISO/IEC/IEEE 29119** (partes 1 a 5: conceptos, procesos, documentación, técnicas y pruebas dirigidas por palabras clave). En Métrica v3 los productos son el plan de pruebas, la especificación técnica del plan de pruebas y los resultados de cada tipo de prueba.

Certificación profesional de referencia: **ISTQB** (Foundation Level 4.0, de 2023).

### 5.5. Desarrollo guiado por pruebas

- **TDD (Test Driven Development)**: ciclo **rojo, verde, refactorizar**. Primero se escribe una prueba que falla, luego el código mínimo que la supera, y después se refactoriza.
- **BDD (Behaviour Driven Development)**: escenarios en lenguaje natural con **Gherkin**: `Given` (dado), `When` (cuando), `Then` (entonces). Herramientas: **Cucumber**, SpecFlow, Behave.
- **ATDD**: pruebas de aceptación escritas antes del desarrollo junto con el cliente.
- **Dobles de prueba**: *dummy* (relleno), *stub* (respuestas fijas), *spy* (registra llamadas), *mock* (verifica interacciones esperadas), *fake* (implementación simplificada, como una BD en memoria).

### 5.6. JUnit 5 y JUnit 6

JUnit es el marco de pruebas unitarias de Java. JUnit 5 = Platform + **Jupiter** (nuevo API) + Vintage (ejecuta pruebas JUnit 3 y 4). En septiembre de 2025 salió **JUnit 6**, que mantiene el API Jupiter y exige Java 17.

```java
import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.*;

class CalculadoraTest {

    private Calculadora calc;

    @BeforeEach
    void setUp() { calc = new Calculadora(); }

    @Test
    void sumaDosNumeros() {
        assertEquals(5, calc.sumar(2, 3));   // (esperado, real)
    }

    @Test
    void dividirPorCeroLanzaExcepcion() {
        ArithmeticException ex = assertThrows(
            ArithmeticException.class,
            () -> calc.dividir(1, 0));
        assertEquals("/ by zero", ex.getMessage());
    }
}
```

**`assertThrows(Clase.class, ejecutable)`** **[Salió 2025]**: la prueba pasa si el lambda lanza esa excepción o una subclase. Falla si no lanza nada o lanza otro tipo. **Devuelve la excepción** capturada, para inspeccionar su mensaje. Variante estricta: `assertThrowsExactly` (no admite subclases). Lo contrario: `assertDoesNotThrow`. En JUnit 4 se usaba `@Test(expected = ArithmeticException.class)`.

| JUnit 5 (Jupiter) | JUnit 4 | Uso |
|---|---|---|
| `@Test` | `@Test` | Método de prueba |
| `@BeforeEach` / `@AfterEach` | `@Before` / `@After` | Antes y después de cada prueba |
| `@BeforeAll` / `@AfterAll` (static) | `@BeforeClass` / `@AfterClass` | Una vez por clase |
| `@Disabled` | `@Ignore` | Desactivar prueba |
| `@DisplayName` | No existe | Nombre legible |
| `@ParameterizedTest` con `@ValueSource`, `@CsvSource`, `@MethodSource` | `@RunWith(Parameterized.class)` | Prueba parametrizada |
| `@Nested`, `@Tag`, `@Timeout`, `@RepeatedTest` | No existen | Anidar, etiquetar, tiempo máximo, repetir |

Otras aserciones: `assertTrue`, `assertFalse`, `assertNull`, `assertNotNull`, `assertSame`, `assertArrayEquals`, `assertIterableEquals`, `assertAll` (agrupa varias y informa de todos los fallos), `assertTimeout`, `fail`. Las **suposiciones** (`assumeTrue`) abortan la prueba sin fallarla si no se cumplen.

### 5.7. Herramientas de pruebas y calidad

| Herramienta | Para qué |
|---|---|
| JUnit, TestNG | Pruebas unitarias en Java |
| NUnit, xUnit.net, MSTest | Pruebas unitarias en .NET |
| PHPUnit, pytest | PHP y Python |
| **Jest** | Pruebas de JavaScript y TypeScript (Meta). Incluye aserciones, mocks y cobertura **[Salió 2019]** |
| Mocha, Jasmine, Vitest, Karma | Otras de JavaScript |
| Mockito, EasyMock | Objetos simulados (mocks) en Java |
| **Selenium WebDriver** | **Automatizar pruebas en el navegador** controlándolo como un usuario **[Salió 2022]** |
| Selenium IDE, Selenium Grid | Grabar y reproducir; ejecución distribuida en varios navegadores |
| Cypress, Playwright, Puppeteer | Pruebas E2E web modernas |
| Appium | Pruebas de apps móviles |
| **Cucumber** | BDD con Gherkin (no es control de versiones) **[Salió 2024]** |
| **Apache JMeter** | Pruebas de **carga y estrés**, libre, en Java, con usuarios concurrentes simulados **[Salió 2017, 2019, 2022]** |
| Gatling, k6, Locust, LoadRunner | Otras de carga |
| Postman, SoapUI, REST Assured | Pruebas de APIs REST y SOAP |
| JaCoCo, Istanbul | Cobertura de código |
| **SonarQube** | Análisis **estático** de calidad y seguridad del código **[Salió 2018, 2022]** |
| PMD, Checkstyle, SpotBugs | Análisis estático en Java **[Salió 2024]** |
| ESLint, linters en general | Análisis estático y estilo en JavaScript **[Salió 2024]** |
| TestLink, Zephyr, Xray, Azure Test Plans | Gestión de casos y planes de prueba |
| Cactus (Apache, retirado) | Pruebas de componentes Java EE en servidor |
| Foglight (Quest) | Monitorización de rendimiento de aplicaciones, no pruebas de carga |
| OneTrust | Gestión de privacidad, consentimiento (cookies) y cumplimiento normativo. **No es producto de pruebas** (opción intrusa) **[Salió 2025]** |

**SonarQube** (SonarSource) en detalle:

- Hace **análisis estático** del código fuente, de forma automática y continua. **No hace análisis dinámico** **[Salió 2018]**.
- Detecta *bugs*, **vulnerabilidades**, *security hotspots*, *code smells* y **código duplicado**.
- Calcula **métricas**: cobertura (importada de JaCoCo u otras), complejidad, deuda técnica, líneas de código.
- **Quality Profiles**: conjunto de reglas por lenguaje.
- **Quality Gates**: condiciones mínimas que debe cumplir el proyecto para darse por bueno (por ejemplo, cobertura del código nuevo mayor del 80 %). Se integran en el pipeline para bloquear el paso a producción.
- Desde 2024 la familia se llama SonarQube Server, SonarQube Cloud (antes SonarCloud) y SonarQube for IDE (antes SonarLint).
- "SonarCode", "SonarCuality" y "SonarSrc" no existen **[Salió 2022]**.

**Calidad del producto**: la norma de referencia es **ISO/IEC 25010** (familia SQuaRE). Su revisión de 2023 tiene nueve características: adecuación funcional, eficiencia de desempeño, compatibilidad, capacidad de interacción, fiabilidad, seguridad, mantenibilidad, flexibilidad y protección (*safety*). La gestión de la calidad de la organización la regula **ISO 9001:2015**.

## 6. Control de versiones

### 6.1. Conceptos

Un **sistema de control de versiones** registra los cambios de un conjunto de ficheros a lo largo del tiempo. Permite recuperar versiones, trabajar en paralelo y saber quién cambió qué. **VCS** (*Version Control System*), **SCM** (*Software Configuration Management*) y **CMS** (*Configuration Management System*) son formas de referirse al control de cambios de los programas **[Salió 2016]**. En Métrica v3 esto corresponde a la interfaz de **Gestión de la Configuración**.

Vocabulario común:

- **Repositorio**: almacén con el historial.
- **Copia de trabajo**: ficheros locales sobre los que se trabaja.
- **Commit (confirmación)**: registra un conjunto de cambios en el historial.
- **Rama (branch)**: línea de desarrollo independiente.
- **Fusión (merge)**: integrar los cambios de una rama en otra.
- **Conflicto**: dos cambios incompatibles en las mismas líneas.
- **Etiqueta (tag)**: nombre fijo para una versión concreta (por ejemplo, v1.0).
- **Trunk, main o master**: línea principal.

**Centralizados frente a distribuidos**:

| Aspecto | Centralizado (CVS, Subversion, TFVC, Perforce) | Distribuido (Git, Mercurial, Bazaar) |
|---|---|---|
| Historial | Solo en el servidor | Cada clon tiene el historial completo |
| Trabajo sin conexión | Muy limitado | Commits, ramas y log en local |
| Velocidad | Más lento (red) | Más rápido (casi todo en local) |
| Identificador de versión | Número de revisión secuencial (r1, r2...) | Hash (SHA-1 en Git) |
| Ramas | Copias de directorios, más costosas | Ligeras y baratas |
| Espacio | Copia de trabajo más pequeña | Repositorio muy compacto (compresión y empaquetado) |

En 2015 se preguntó qué afirmación era correcta al comparar Git y Subversion **[Salió 2015]**. Lo cierto es que Git es más rápido, tiene ramas baratas y su repositorio suele ocupar **menos espacio**. Subversion usa números de revisión secuenciales; Git usa hashes.

### 6.2. Herramientas de control de versiones

| Herramienta | Tipo | Notas |
|---|---|---|
| **Git** | Distribuido, libre | Linus Torvalds, 2005. El estándar actual |
| **Mercurial (hg)** | Distribuido, libre, **multiplataforma** **[Salió 2015, 2016]** | Escrito en Python |
| **Apache Subversion (SVN)** | Centralizado, libre **[Salió 2015, 2024]** | Sucesor de CVS |
| CVS (Concurrent Versions System) | Centralizado, libre | Histórico |
| Bazaar, Fossil, Darcs | Distribuidos, libres | Minoritarios |
| **Team Foundation Server** (hoy Azure DevOps Server) | Microsoft **[Salió 2018]** | Usa TFVC (centralizado) o Git |
| **Visual SourceSafe** | Microsoft, centralizado **[Salió 2015]** | Descatalogado, sustituido por TFS |
| ClearCase | IBM (hoy HCL VersionVault) | Centralizado, entornos corporativos |
| Perforce (Helix Core) | Comercial, centralizado | Muy usado en videojuegos |
| Plastic SCM (Unity Version Control) | Comercial | Videojuegos |

**GitHub, GitLab y Bitbucket** no son sistemas de control de versiones en sentido estricto: son **plataformas** que alojan repositorios Git. En las preguntas de "herramientas de control de versiones" se aceptan como tales **[Salió 2024]**.

Distractores que **no** son control de versiones: JMeter, Selenium, Cucumber, NUnit (pruebas), Cassandra, Redis (bases de datos), Lucene (búsqueda), Gimp (imagen), Redmine, Planner, OpenProj (gestión de proyectos), Trello (tableros), Jenkins (CI).

### 6.3. Subversion (SVN)

Estructura habitual del repositorio: `trunk/` (línea principal), `branches/` (ramas) y `tags/` (versiones). Ramas y etiquetas son copias baratas (`svn copy`).

| Comando | Qué hace |
|---|---|
| `svn checkout URL` (`svn co`) | **Primera descarga** de una copia de trabajo local **[Salió 2015]** |
| `svn update` (`svn up`) | Trae los cambios del repositorio a la copia de trabajo |
| `svn status` (`svn st`) | **Lista los ficheros modificados**, añadidos o borrados en la copia local **[Salió 2015]** |
| `svn diff` | Muestra las diferencias línea a línea |
| `svn commit -m "msg"` (`svn ci`) | Envía los cambios al repositorio central |
| `svn add` / `svn delete` / `svn move` | Añade, borra o mueve bajo control de versiones |
| `svn log` | Historial de revisiones |
| `svn revert` | Deshace cambios locales no enviados |
| `svn import` | Sube un árbol de ficheros no versionado al repositorio (no crea copia de trabajo) |
| `svn export` | Copia limpia sin metadatos `.svn` |
| `svn merge`, `svn resolve`, `svn lock` | Fusionar, marcar conflicto resuelto, bloquear fichero |

Ojo: en SVN `commit` envía directamente al servidor. En Git `commit` es local y hace falta `push`.

### 6.4. Git: las tres zonas

- **Directorio de trabajo** (working tree): los ficheros que editas.
- **Área de preparación** (staging area o índice): lo que irá en el próximo commit. Se llena con `git add`.
- **Repositorio local** (`.git`): el historial. Se actualiza con `git commit`.
- Además, los **repositorios remotos** (por defecto `origin`). Se sincronizan con `push`, `fetch` y `pull`.

Estados de un fichero: sin seguimiento (*untracked*), modificado, preparado (*staged*) y confirmado (*committed*).

Un **commit** almacena una **nueva instantánea (snapshot)** del estado del proyecto en el historial **[Salió 2019]**. No guarda diferencias, sino el estado completo (reutilizando objetos que no cambian).

### 6.5. Modelo de datos de Git

Git es un almacén de objetos direccionado por contenido. Cada objeto se identifica por el **hash SHA-1** de su contenido (40 caracteres hexadecimales). Desde Git 2.29 se admiten repositorios con **SHA-256**. El **modelo de datos de Git** tiene cuatro piezas **[Salió 2025]**: **objetos** (*objects*), **referencias** (*references*), el **índice** (*index*, el área de preparación) y los **reflogs** (registro local de por dónde han pasado HEAD y cada rama). Hay **cuatro tipos de objeto**:

| Objeto | Contenido |
|---|---|
| **blob** | Contenido de un fichero (sin nombre ni permisos) |
| **tree** | Un directorio: lista de nombres, permisos y punteros a blobs y a otros trees |
| **commit** | Puntero a un tree raíz, a su commit o commits padre, autor, confirmador, fecha y mensaje |
| **tag** (anotado) | Puntero a un objeto (normalmente un commit), con nombre, autor, fecha, mensaje y firma opcional |

Además están las **referencias** (*refs*), que son punteros con nombre a un commit:

- Ramas: `.git/refs/heads/main`. Una rama es solo un puntero móvil al último commit.
- Etiquetas: `.git/refs/tags/v1.0`.
- Ramas remotas de seguimiento: `.git/refs/remotes/origin/main`.
- **HEAD**: apunta a la rama actual. Si apunta directamente a un commit, es un *detached HEAD*.

El **índice** (`.git/index`) es el fichero binario del área de preparación: lista los ficheros con el blob de cada uno que irá en el próximo commit. Los **reflogs** (`.git/logs/`) anotan cada movimiento de HEAD y de las ramas locales; `git reflog` permite recuperar commits "perdidos" tras un `reset` o un `rebase`.

Los commits forman un **grafo acíclico dirigido (DAG)**: cada commit apunta a sus padres. Un commit de fusión tiene dos o más padres. Comandos de bajo nivel para verlo: `git cat-file -p <hash>`, `git cat-file -t <hash>` y `git hash-object`.

### 6.6. Comandos Git esenciales

**Configuración e inicio**:

```bash
git config --global user.name "Pablo"
git config --global user.email "pablo@ejemplo.es"
git init                  # crea un repositorio vacío en el directorio actual
git init --bare           # repositorio sin directorio de trabajo (para servidor)
git clone https://github.com/org/proyecto.git   # copia completa de un remoto
```

`git init` crea un repositorio vacío **[Salió 2017]**. No existe `git start`.

**Ciclo diario** (`git log` lista los commits anteriores **[Salió 2019]**):

```bash
git status                # estado de las tres zonas
git add fichero.java      # prepara un fichero
git add .                 # prepara todos los cambios del directorio
git diff                  # cambios no preparados
git diff --staged         # cambios preparados frente al último commit
git commit -m "Añade validación de CIF"
git commit -am "msg"      # add de ficheros ya seguidos + commit
git commit --amend        # rehace el último commit
git log                   # historial de commits
git log --oneline --graph --all
git show <hash>           # detalle de un commit
git blame fichero.java    # quién cambió cada línea
```

**Remotos**:

| Comando | Qué hace |
|---|---|
| `git remote -v` | Lista los remotos |
| `git remote add origin URL` | Añade un remoto |
| `git push origin master` | **Sube los commits** de la rama local master al remoto origin **[Salió 2017]** |
| `git push -u origin main` | Sube y fija la rama de seguimiento (upstream) |
| `git push --tags` | Sube las etiquetas (push no las sube por defecto) |
| **`git fetch`** | **Descarga** objetos y referencias (commits, ramas y etiquetas) del remoto, actualiza las ramas de seguimiento remoto `origin/*` y anota lo obtenido en `.git/FETCH_HEAD`. **No integra** nada en tu rama local ni toca tu directorio de trabajo **[Salió 2025]** |
| `git pull` | `git fetch` + `git merge` (o `git rebase` con `--rebase`). Integra los cambios en tu rama actual |

Con `git fetch` puedes revisar antes de integrar: `git log main..origin/main` muestra lo que ha llegado.

**Ramas**:

```bash
git branch                # lista ramas locales (-a incluye remotas)
git branch nueva          # crea rama (no cambia a ella)
git switch nueva          # cambia de rama (Git 2.23+)
git checkout nueva        # equivalente clásico
git switch -c nueva       # crea y cambia (= git checkout -b nueva)
git merge nueva           # fusiona 'nueva' en la rama actual
git merge --no-ff nueva   # fuerza commit de fusión aunque pueda avanzar rápido
git rebase main           # reaplica los commits de la rama actual sobre main
git branch -d nueva       # borra rama fusionada (-D fuerza)
```

**Merge frente a rebase**: `merge` conserva la historia real y crea un commit de fusión (salvo *fast-forward*). `rebase` reescribe los commits para una historia lineal. Regla de oro: no hacer rebase de commits ya publicados y compartidos.

**Conflicto de fusión**. Git marca así el fichero:

```text
<<<<<<< HEAD
int limite = 10;
=======
int limite = 20;
>>>>>>> nueva
```

Se edita, se hace `git add` y se completa con `git commit` (o `git merge --continue`).

**Etiquetas** **[Salió 2018]**:

```bash
git tag                       # lista las etiquetas
git tag -l "v1.*"             # lista filtrando por patrón
git tag v1.0                  # etiqueta ligera
git tag -a v1.0 -m "Versión 1.0"   # etiqueta anotada (objeto tag)
git push origin v1.0          # sube una etiqueta
```

**Deshacer**:

| Comando | Efecto |
|---|---|
| `git restore fichero` | Descarta cambios no preparados (antes `git checkout -- fichero`) |
| `git restore --staged fichero` | Saca el fichero del área de preparación |
| `git reset --soft HEAD~1` | Deshace el último commit; los cambios quedan preparados |
| `git reset --mixed HEAD~1` | (por defecto) Deshace el commit; los cambios quedan sin preparar |
| `git reset --hard HEAD~1` | Deshace el commit y **borra** los cambios |
| `git revert <hash>` | Crea un commit nuevo que invierte otro. Seguro en ramas compartidas |
| `git stash` / `git stash pop` | Guarda temporalmente cambios sin confirmar y los recupera |
| `git cherry-pick <hash>` | Aplica un commit concreto en la rama actual |
| `git bisect` | Búsqueda binaria del commit que introdujo un error |
| `git reflog` | Historial de movimientos de HEAD (recupera commits "perdidos") |

**Fichero `.gitignore`** **[Salió 2016]**:

```text
# comentario
target/          # directorio
*.class          # patrón
*.log
!importante.log  # excepción: sí se sigue
.env
```

Solo afecta a ficheros no seguidos. Para dejar de seguir uno ya confirmado: `git rm --cached fichero`.

Otros: `git submodule` (repositorio dentro de otro), **Git LFS** (ficheros binarios grandes), *hooks* en `.git/hooks` (por ejemplo, `pre-commit`, `pre-push`).

### 6.7. Flujos de trabajo con ramas

- **Git Flow** (Vincent Driessen, 2010): ramas permanentes `main` (producción) y `develop`; ramas temporales `feature/*`, `release/*` y `hotfix/*`.
- **GitHub Flow**: una rama `main` siempre desplegable; cada cambio en una rama corta que entra por pull request.
- **GitLab Flow**: añade ramas de entorno (`staging`, `production`).
- **Trunk-based development**: todos integran en el tronco al menos una vez al día; ramas de vida muy corta y *feature flags*.

### 6.8. Pull request y merge request

Una **pull request** (GitHub, Bitbucket, Azure DevOps) o **merge request** (GitLab) es una **solicitud para integrar los cambios de una rama en otra**, normalmente en `main` **[Salió 2025]**. Abre un espacio de revisión de código: comentarios por línea, aprobaciones, ejecución automática de pruebas y comprobaciones. Al aprobarse se fusiona con merge, squash (aplasta en un solo commit) o rebase.

- No es un comando de Git: es una función de la plataforma. No confundir con `git pull`.
- En proyectos de terceros se suele trabajar sobre un **fork** (copia del repositorio en tu cuenta) y abrir la PR desde él.
- **Reglas de protección de rama**: exigir revisiones aprobadas, que pasen los *checks* de CI y prohibir *push* directo a `main`.
- Puede abrirse como **borrador** (*draft*) mientras el trabajo no está listo.
- `CODEOWNERS` asigna revisores obligatorios por ruta.

## 7. Integración y entrega continuas (CI/CD)

### 7.1. Conceptos

- **Integración continua (CI)**: cada cambio se integra a menudo en la rama principal y dispara automáticamente compilación y pruebas.
- **Entrega continua (Continuous Delivery)**: el software está siempre listo para desplegar. El paso a producción es manual (un clic).
- **Despliegue continuo (Continuous Deployment)**: cada cambio que supera el pipeline se despliega en producción automáticamente.
- **Pipeline**: secuencia automatizada de etapas: compilar, probar, analizar calidad, empaquetar, desplegar.
- **GitOps**: el estado deseado de la infraestructura se declara en Git y una herramienta lo sincroniza (Argo CD, Flux).

### 7.2. Herramientas

| Herramienta | Notas |
|---|---|
| **Jenkins** | Libre (Java). Pipelines como código en un `Jenkinsfile` **[Salió 2022]**. Nació como fork de Hudson. Miles de plugins |
| **Bamboo** | CI/CD de Atlassian **[Salió 2017]** |
| **GitHub Actions** | Integrado en GitHub **[Salió 2025]** |
| GitLab CI/CD | Integrado en GitLab, fichero `.gitlab-ci.yml` |
| Azure Pipelines | Parte de Azure DevOps |
| TeamCity (JetBrains), CircleCI, Travis CI | Otros servicios de CI |
| Tekton, Argo CD | Nativos de Kubernetes |

Herramientas de **construcción** (*build*): **Maven** (`pom.xml`; fases `validate`, `compile`, `test`, `package`, `verify`, `install`, `deploy`), **Gradle** (`build.gradle`), Ant, npm o yarn (`package.json`), MSBuild y `dotnet` (.NET).

Distractores de 2022: RabbitMQ y Apache Kafka son sistemas de mensajería; Subversion es control de versiones. Ninguno automatiza pipelines.

### 7.3. GitHub Actions

- Los **workflows** son ficheros YAML (extensión **`.yml` o `.yaml`**) en **`.github/workflows/`** **[Salió 2025]**.
- **`on`**: eventos que lo disparan: `push`, `pull_request`, `schedule` (cron), `workflow_dispatch` (lanzamiento manual), `release`.
- **`jobs`**: trabajos. Por defecto se ejecutan **en paralelo**. Con `needs` se encadenan.
- **`runs-on`**: tipo de **runner** (máquina): `ubuntu-latest`, `windows-latest`, `macos-latest` o uno autoalojado (*self-hosted*).
- **`steps`**: pasos secuenciales del job. Cada uno usa una **acción** (`uses:`) o ejecuta un comando (`run:`).
- **Secretos**: `${{ secrets.NOMBRE }}`. **Matriz**: `strategy.matrix` ejecuta el job con varias versiones.

```yaml
name: CI
on:
  push:
    branches: [ main ]
  pull_request:
jobs:
  build:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        java: [ 17, 21 ]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with:
          distribution: temurin
          java-version: ${{ matrix.java }}
      - run: mvn -B verify
```

Este workflow se ejecuta en cada push a `main` y en cada pull request. Compila y prueba con Java 17 y 21 en paralelo.

### 7.4. GitLab CI (lo básico)

```yaml
stages: [build, test, deploy]

compilar:
  stage: build
  script: mvn -B package

pruebas:
  stage: test
  script: mvn -B test

desplegar:
  stage: deploy
  script: ./desplegar.sh
  rules:
    - if: $CI_COMMIT_BRANCH == "main"
```

Las etapas (*stages*) se ejecutan en orden. Los jobs de una misma etapa, en paralelo. Los ejecuta un **GitLab Runner**.

## Trampas y respuestas desactualizadas

- **Team Foundation Server (2018)**: era la respuesta correcta como "plataforma de control de versiones de Microsoft". Desde 2019 se llama **Azure DevOps Server**. Si sale hoy, cualquiera de los dos nombres vale; Visual SourceSafe está descatalogado.
- **Visual SourceSafe (2015)**: la respuesta (herramienta de control de versiones de Microsoft) sigue siendo cierta como dato histórico. Ya no se usa.
- **`git push origin master` (2017)**: correcto con la rama del enunciado. Desde 2020 GitHub y GitLab crean la rama inicial como **`main`**. Git aún usa `master` por defecto en `git init` salvo que se configure `init.defaultBranch`. Está anunciado que **Git 3.0** cambiará el valor por defecto a `main`.
- **ISO 9001:2000 (2005, OBSOLETA)**: la versión vigente es **ISO 9001:2015**. La ISO 9000 da fundamentos y vocabulario; la 9001, los **requisitos**; la 19011, las auditorías.
- **Licencias de la revista (2007, OBSOLETA)**: la OPL está en desuso y la GFDL apenas se usa para contenidos nuevos. Hoy lo normal es Creative Commons.
- **Diagramas de Jackson (2007, OBSOLETA)**: técnica casi abandonada. Basta saber que parte de las estructuras de datos de entrada y salida.
- **JUnit 4 frente a 5**: `@Before`, `@BeforeClass` e `@Ignore` son de JUnit 4. En JUnit 5 son `@BeforeEach`, `@BeforeAll` e `@Disabled`. `@Test(expected=...)` no existe en JUnit 5: se usa `assertThrows`.
- **Orden de argumentos**: en JUnit `assertEquals(esperado, real)`. En las aserciones de Jest es al revés: `expect(real).toBe(esperado)`.
- **`git fetch` frente a `git pull`**: `fetch` solo descarga y actualiza `origin/*`. `pull` además fusiona en tu rama. Distractor típico: "fetch actualiza el directorio de trabajo" (falso).
- **Modelo de datos de Git (2025)**: la plantilla da como respuesta **Objects, References, Index y Reflogs**. No confundir con los **cuatro tipos de objeto** (blob, tree, commit y tag), que son solo la primera de esas piezas.
- **`git commit` frente a `svn commit`**: el de Git es local; el de SVN va al servidor.
- **`git checkout`** sigue funcionando, pero desde Git 2.23 se recomiendan `git switch` (ramas) y `git restore` (ficheros).
- **Pull request no es un comando Git**: no confundir con `git pull` ni con `git request-pull` (genera un resumen para pedir una integración por correo).
- **GitHub, GitLab y Bitbucket "son" control de versiones** en las preguntas del tribunal (2024), aunque técnicamente son plataformas que alojan Git.
- **SonarQube no hace análisis dinámico** (2018). Distractor: confundirlo con herramientas DAST como OWASP ZAP.
- **Las pruebas de regresión sí se automatizan** (2018). Es la razón de ser de las suites en CI.
- **Integración frente a sistema en Métrica v3**: integración = componentes e interfaces. Sistema = sistema completo y relación con otros sistemas. **Implantación** frente a **aceptación**: implantación = entorno de operación, hardware y software. Aceptación = requisitos del usuario.
- **"Diagrama 0" no es el diagrama de contexto**: en muchas obras el contexto es el nivel 0 y el "diagrama 0" es el primer nivel de descomposición (nivel 1). En 2016 la opción "es conocido como diagrama 0" era, muy probablemente, el distractor.
- **Almacenes duplicados**: un almacén sí puede aparecer varias veces en un DFD (2018). Lo que no puede es conectarse con otro almacén o con una entidad externa.
- **Equipo de Formación frente a Equipo del Proyecto** (2022): el primero imparte la formación; los manuales de usuario los elabora el Equipo del Proyecto.
- **Scrum 2020**: ya no habla de "roles" ni de "Development Team", sino de responsabilidades y "Developers". El Scrum Master es "líder que sirve". El Daily Scrum es para los Developers. Una pregunta basada en la guía de 2017 puede usar la terminología antigua.
- **GitLab CI**: las palabras clave `only` y `except` están en desuso. Se usa `rules`.
- **Herramientas inventadas** como distractor: SonarCode, SonarCuality, SonarSrc (2022), NBGITE (2016), `git -t`, `git start`, `.gituntrack`, `svn download`.
