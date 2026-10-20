# Tema 19. Java EE / Jakarta EE y .NET

Peso en el examen: unas **2,1 preguntas de test** y **2,6 de supuesto III** por convocatoria, en torno a 7,9 puntos de 100. Hay **73 preguntas históricas** clasificadas aquí (2007-2025, donde "2025" es el examen de mayo de 2026). La tendencia es al alza. Se concentran en cuatro zonas: plataforma .NET (CLR, JIT, ensamblados, NuGet, MAUI, Razor), C# práctico (using, async/Task, colecciones, ADO.NET), persistencia Java (JDBC, JPA, ORM) y el ecosistema Java (Spring Boot, Log4j, JAXB, JAAS, servlets). Los supuestos III de 2024 y 2025 ofrecían elegir entre backend Java o .NET, así que hay que dominar ambos.

## Cómo lo preguntan

- **"Qué usarías para X" según el backend**: ORM, librería de logs, comando para instalar un paquete, API para XML. Ejemplos: ORM en .NET y en Java (2024 b3 2), NuGet de iText (2024 b3 16), JAXB (2024 b3 9), log4j (2018 b3 18).
- **Definición de un componente de plataforma**: CLR, JIT, ensamblado, NuGet, MAUI, Spring Boot, Java DB (2017, 2018, 2019, 2024, 2025).
- **"Señale la correcta/incorrecta"** sobre una tecnología con un distractor sutil: Razor y el símbolo @ (2024), POCO (2022), ADO.NET con un objeto inventado "Operation" (2018), drivers JDBC (2022).
- **Nombres inventados como distractores**: "Mockete", "Ruby Hibernation", "track4j", "G#", "Cloos", "Trash busher", "AppServer". Si un nombre no te suena de nada, suele ser falso.
- **Código C# del supuesto**: completar una instrucción (using, MySqlCommand, Console.ReadLine), traza de Array.Sort/Reverse, condición de un bucle, struct frente a class (2015, 2016, 2018, 2019).
- **Paquetes y anotaciones Java**: javax.ejb (2018), javax.persistence y @Table (2015), javax.naming y javax.sql (2022).
- **Comandos de herramientas**: `mvn spring-boot:run` (2025), `dotnet add package` (2024).
- **Especificaciones y perfiles de Jakarta EE**: Core Profile y MicroProfile (2022), JPA (2024).

## 1. Panorama: plataformas empresariales Java y .NET

### 1.1 Qué es una plataforma empresarial

Una plataforma empresarial ofrece un entorno de ejecución, un lenguaje y un conjunto de APIs estándar. Resuelve lo repetitivo: transacciones, seguridad, persistencia, concurrencia, mensajería y servicios web. El programador escribe componentes y el **contenedor** gestiona su ciclo de vida.

| Concepto | Java | .NET |
|---|---|---|
| Máquina virtual | JVM | CLR |
| Código intermedio | Bytecode (.class) | CIL/MSIL (dentro del ensamblado) |
| Compilación en ejecución | JIT de HotSpot (C1/C2) | RyuJIT |
| Compilación anticipada | GraalVM Native Image | Native AOT, ReadyToRun |
| Unidad de despliegue | JAR, WAR, EAR | Ensamblado (.dll, .exe) |
| Organización lógica | Paquetes (package) | Espacios de nombres (namespace) |
| Clase raíz | java.lang.Object | System.Object |
| Raíz de excepciones | java.lang.Throwable | System.Exception |
| Gestor de paquetes | Maven, Gradle (Maven Central) | NuGet (nuget.org) |
| Acceso a datos de bajo nivel | JDBC | ADO.NET |
| ORM estándar | JPA (Hibernate, EclipseLink) | Entity Framework Core |
| ORM alternativo | MyBatis, EclipseLink | NHibernate (port de Hibernate), Dapper |
| Web MVC | Spring MVC, Jakarta MVC, Faces | ASP.NET Core MVC, Razor Pages |
| API REST | Jakarta REST (JAX-RS), Spring | ASP.NET Core Web API, Minimal APIs |
| Plantillas de servidor | JSP (Jakarta Pages), Thymeleaf | Razor (.cshtml) |
| Logging | Log4j 2, Logback, SLF4J, JUL | ILogger, Serilog, NLog, log4net |
| Pruebas unitarias | JUnit, TestNG, Mockito | xUnit, NUnit, MSTest, Moq |
| Escritorio | Swing, JavaFX | WinForms, WPF, WinUI, MAUI |
| Móvil | Android (Kotlin/Java) | .NET MAUI |
| AOP | AspectJ, Spring AOP | PostSharp (Metalama), Castle DynamicProxy |
| IDE habitual | IntelliJ IDEA, Eclipse, NetBeans | Visual Studio, VS Code, Rider |
| Framework "todo en uno" | Spring Boot | ASP.NET Core |

**[Salió 2024]** ORM según backend: Entity Framework en .NET e Hibernate en Java. Esta tabla de equivalencias es la herramienta más rentable del tema.

### 1.2 Versiones vigentes (octubre de 2026)

| Producto | Versión de referencia |
|---|---|
| Java SE | Java 25 es la última LTS (septiembre de 2025). Hay versión nueva cada seis meses (26 en marzo de 2026, 27 en septiembre de 2026). |
| Jakarta EE | Jakarta EE 11 (2025). Jakarta EE 12 en preparación, con base Java 21. |
| Spring Boot | 4.0 (noviembre de 2025), sobre Spring Framework 7 y Jakarta EE 11. Requiere Java 17 o superior. |
| Hibernate ORM | 7.x, implementa Jakarta Persistence 3.2. |
| Apache Tomcat | 11 (Servlet 6.1, Jakarta EE 11). |
| .NET | .NET 10 LTS (noviembre de 2025, soporte tres años). .NET 11 previsto para noviembre de 2026 (STS). |
| C# | C# 14 (con .NET 10). |
| .NET Framework | 4.8.1, solo Windows, en mantenimiento sin nuevas funciones. |
| EF Core | EF Core 10 (con .NET 10). |

Las preguntas de "última versión" caducan rápido. Repásalas la semana antes del examen.

## 2. Java: plataforma y lenguaje base

### 2.1 Características de Java

Java es un lenguaje orientado a objetos, fuertemente tipado y **independiente de la plataforma** ("write once, run anywhere"). El compilador `javac` genera **bytecode** en ficheros `.class`. La JVM lo interpreta y compila a código máquina con el **JIT**.

- **JDK**: kit de desarrollo (compilador, javadoc, jar, jshell). Desde Java 11 ya no hay JRE separado oficial de Oracle.
- **JVM**: máquina virtual. La implementación de referencia es HotSpot (OpenJDK).
- **Recolector de basura (garbage collector)**: elimina automáticamente los objetos no referenciados **[Salió 2007]**. Colectores actuales: G1 (por defecto), ZGC, Shenandoah, Parallel, Serial.
- Java **no** está destinado solo a servidores. Corre en escritorio, móvil (Android), servidor y embebidos **[Salió 2008]**.
- Sun creó Java en 1995. Oracle compró Sun en 2010.

### 2.2 El compilador JIT

El **JIT (Just-In-Time)** compila a código máquina nativo, durante la ejecución, los métodos que se usan a menudo ("hot spots"). **[Salió 2025]** Ventajas: optimiza con información real de ejecución (inlining, eliminación de código muerto). Inconveniente: coste de arranque ("calentamiento").

- HotSpot usa **compilación escalonada (tiered)**: primero interpreta, luego C1 (rápido) y después C2 (muy optimizado).
- Alternativa **AOT (Ahead-Of-Time)**: compila antes de ejecutar. En Java, GraalVM Native Image. En .NET, Native AOT y ReadyToRun.
- En .NET el JIT se llama **RyuJIT** y compila el CIL de cada método la primera vez que se invoca.

### 2.3 Jerarquía de clases y excepciones

- **java.lang.Object** es la clase raíz de toda la jerarquía **[Salió 2018]**. Todas las clases heredan de ella aunque no lo declaren.
- Métodos de Object: `equals`, `hashCode`, `toString`, `getClass`, `clone`, `wait`, `notify`, `notifyAll` y `finalize` (obsoleto).
- **java.lang.Throwable** es la clase de la que heredan todas las excepciones y errores **[Salió 2018]**.

```text
Throwable
├── Error            (graves, no se capturan: OutOfMemoryError, StackOverflowError)
└── Exception        (comprobadas: IOException, SQLException)
    └── RuntimeException  (no comprobadas: NullPointerException, ArithmeticException)
```

- **Checked** (comprobadas): heredan de Exception pero no de RuntimeException. El compilador obliga a capturarlas o declararlas con `throws`.
- **Unchecked**: RuntimeException y Error.
- `try-with-resources` cierra automáticamente los objetos `AutoCloseable` (equivale al `using` de C#).

```java
try (Connection con = ds.getConnection();
     PreparedStatement ps = con.prepareStatement("SELECT 1")) {
    // uso
} catch (SQLException e) {
    log.error("Fallo de BD", e);
}   // con y ps se cierran solos, en orden inverso
```

### 2.4 Ediciones y bibliotecas clásicas

- **Java SE**: edición estándar (lenguaje, colecciones, java.time, JDBC, Swing).
- **Java EE / Jakarta EE**: edición empresarial (sección 3).
- **Java ME**: dispositivos limitados, prácticamente en desuso.
- **Swing**: biblioteca de interfaz gráfica de escritorio, no de persistencia **[Salió 2016]**. **JavaFX** (OpenJFX) va aparte del JDK desde Java 11.
- **JUnit**: framework para crear pruebas unitarias de clases Java **[Salió 2016]**. Versiones: JUnit 5 (Jupiter) y JUnit 6 (2025).
- **Applets**: obsoletos. La API se eliminó del JDK en Java 26 (JEP 504).
- **Java DB**: distribución de Oracle de la base de datos de código abierto **Apache Derby** **[Salió 2017]**. Se incluyó en el JDK 6 a 8 y se quitó en el JDK 9.

### 2.5 Librerías de la Apache Software Foundation

Pregunta típica: "¿cuál NO es de Apache?" **[Salió 2022]** (respuesta: "Mockete", que no existe).

| De Apache | No de Apache |
|---|---|
| Log4j, Commons (IO, Lang, Collections), HttpComponents (HttpClient) | Hibernate (Red Hat/Commonhaus) |
| POI (ficheros Office), PDFBox, FOP | Spring (Broadcom/VMware) |
| Tomcat, TomEE, Struts, Wicket | JUnit, Mockito, TestNG |
| Maven, Ant | Logback, SLF4J (QOS.ch) |
| CXF (servicios web), Axis2 | Jackson (FasterXML), Gson (Google) |
| Xerces (parser XML), Xalan (XSLT) | iText (Apryse) |
| Kafka, Camel, ActiveMQ, Derby | Jersey (Eclipse) |
| Shiro (seguridad), Lucene, OpenJPA, log4net | NLog, Serilog |

### 2.6 Logging en Java

**[Salió 2018]** Librería para escribir trazas a un fichero de logs: **log4j**. Distractores: "logTrack", "track4j" (inventados) y "Nlog" (es de .NET).

| Librería | Qué es |
|---|---|
| java.util.logging (JUL) | Incluida en Java SE. Niveles SEVERE, WARNING, INFO, CONFIG, FINE, FINER, FINEST. |
| Log4j 2 | Apache. Niveles OFF, FATAL, ERROR, WARN, INFO, DEBUG, TRACE, ALL. Configuración en log4j2.xml. |
| Logback | Sucesor de Log4j 1. Logger por defecto de Spring Boot. |
| SLF4J | Fachada (API) que delega en Logback, Log4j 2 o JUL. |
| Apache Commons Logging | Fachada antigua. |

```java
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ExpedienteService {
    private static final Logger log = LoggerFactory.getLogger(ExpedienteService.class);
    void tramitar(long id) {
        log.info("Tramitando expediente {}", id);
    }
}
```

Dato de seguridad: **Log4Shell** (CVE-2021-44228, diciembre de 2021) afectó a Log4j 2 por la búsqueda JNDI en mensajes. Se corrigió en 2.17.x. Log4j 1.x está fuera de soporte desde 2015.

### 2.7 Construcción: Maven y Gradle

- **Maven**: proyecto descrito en `pom.xml` con coordenadas `groupId`, `artifactId`, `version`. Repositorio central: Maven Central.
- Fases del ciclo por defecto: `validate`, `compile`, `test`, `package`, `verify`, `install`, `deploy`. Además `clean` y `site`.
- `mvn clean package` genera el JAR o WAR en `target/`. `mvn install` lo copia al repositorio local (`~/.m2`).
- **Gradle**: `build.gradle` (Groovy) o `build.gradle.kts` (Kotlin). Tareas `build`, `test`, `bootRun`.
- `mvnw` y `gradlew` son *wrappers* que descargan la versión correcta de la herramienta.

## 3. Java EE / Jakarta EE

### 3.1 Historia y cambio de espacio de nombres

| Versión | Año | Hito |
|---|---|---|
| J2EE 1.2 a 1.4 | 1999-2003 | Servlets, JSP, EJB 2 (entity beans). |
| Java EE 5 | 2006 | Anotaciones, EJB 3, nace JPA 1.0. |
| Java EE 6 | 2009 | Perfiles (Web Profile), CDI, JAX-RS. |
| Java EE 7 | 2013 | WebSocket, JSON-P, Batch. |
| Java EE 8 | 2017 | Última de Oracle. JSON-B, Security 1.0. |
| Jakarta EE 8 | 2019 | Pasa a la Eclipse Foundation. Mismas APIs con `javax.*`. |
| Jakarta EE 9 / 9.1 | 2020 / 2021 | Cambio de `javax.*` a **`jakarta.*`**. 9.1 admite Java 11. |
| Jakarta EE 10 | 2022 | Nace el **Core Profile**. Java 11 y 17. |
| Jakarta EE 11 | 2024-2025 | Core Profile (dic. 2024), Web Profile y Platform (2025). Java 17 mínimo, hilos virtuales de Java 21, nace **Jakarta Data**. |
| Jakarta EE 12 | 2026 (en curso) | Base Java 21. |

Regla de oro: las preguntas antiguas dicen `javax.ejb` o `javax.persistence`. Hoy son `jakarta.ejb` y `jakarta.persistence`. Ojo: `javax.sql` y `javax.naming` **no cambian**, porque son de Java SE.

### 3.2 Arquitectura: capas, contenedores y perfiles

Jakarta EE sigue un modelo **multicapa**: cliente, web, negocio y datos (EIS). Los componentes viven en **contenedores**:

- **Contenedor web**: servlets, páginas JSP/Faces, filtros, listeners, WebSocket.
- **Contenedor EJB**: enterprise beans (transacciones, seguridad, concurrencia).
- **Contenedor de cliente de aplicación**: aplicaciones Java SE que usan servicios del servidor.

Tres **perfiles** (subconjuntos de la plataforma):

| Perfil | Para qué | Contenido principal |
|---|---|---|
| Core Profile | Microservicios y ejecutables nativos ligeros | CDI Lite, REST, JSON-P, JSON-B, Annotations, Interceptors, Dependency Injection |
| Web Profile | Aplicaciones web típicas | Core + Servlet, Pages, Faces, Persistence, Enterprise Beans Lite, Transactions, Validation, Security, WebSocket, EL, Concurrency |
| Platform (Full) | Aplicaciones empresariales completas | Web + Messaging, Batch, Mail, Connectors, Enterprise Beans completo, etc. |

**[Salió 2022]** Para un microservicio alineado con Jakarta EE Core Profile, la especificación de la comunidad indicada es **MicroProfile**.

### 3.3 MicroProfile

Iniciativa de la Eclipse Foundation para microservicios Java empresariales. Se apoya en el Core Profile de Jakarta EE. MicroProfile 7.x se basa en Jakarta EE 10 Core Profile.

- **Config**: configuración externa (variables de entorno, ficheros).
- **Fault Tolerance**: @Retry, @Timeout, @CircuitBreaker, @Bulkhead, @Fallback.
- **Health**: comprobaciones de vida y disponibilidad (liveness, readiness, startup).
- **JWT Authentication**: seguridad basada en tokens JWT.
- **OpenAPI**: documentación de la API.
- **Rest Client**: cliente REST declarativo.
- **Telemetry**: trazas y métricas con OpenTelemetry (sustituye a OpenTracing y Metrics en la plataforma).

Implementaciones: Quarkus, Helidon, Open Liberty, Payara Micro, WildFly.

### 3.4 Catálogo de especificaciones

| Nombre actual (Jakarta) | Nombre antiguo | Para qué |
|---|---|---|
| Servlet 6.1 | Java Servlet | Procesar peticiones HTTP en servidor |
| Pages 4.0 | JSP | Páginas dinámicas con HTML y código Java |
| Expression Language | EL | Expresiones `${...}` y `#{...}` |
| Standard Tag Library | JSTL | Etiquetas `c:forEach`, `c:if` |
| Faces 4.1 | JSF | Framework web de componentes (Facelets) |
| REST 4.0 | JAX-RS | Servicios web RESTful |
| XML Web Services | JAX-WS | Servicios web SOAP |
| XML Binding | JAXB | Mapear XML a clases Java y viceversa |
| JSON Processing / Binding | JSON-P / JSON-B | Procesar JSON / mapear JSON a objetos |
| Persistence 3.2 | JPA | ORM estándar |
| Data 1.0 | (nueva en EE 11) | Repositorios declarativos sobre Persistence o NoSQL |
| Enterprise Beans 4.0 | EJB | Componentes de negocio transaccionales |
| Contexts and Dependency Injection 4.1 | CDI | Inyección de dependencias y ámbitos |
| Transactions | JTA | Transacciones distribuidas |
| Messaging | JMS | Mensajería asíncrona (colas y temas) |
| Mail | JavaMail | Envío de correo |
| Validation | Bean Validation | Validación con anotaciones (@NotNull) |
| Security 4.0 | Java EE Security API | Seguridad de aplicación (IdentityStore) |
| Authentication | JASPIC | Contrato de módulos de autenticación |
| Authorization | JACC | Contrato de proveedores de autorización |
| Connectors | JCA | Conectar con sistemas de información empresariales (EIS) |
| Batch | JBatch | Procesos por lotes |
| Concurrency | Concurrency Utilities | Hilos gestionados por el contenedor |
| WebSocket | Java API for WebSocket | Comunicación bidireccional |

En Java SE (no en Jakarta EE) quedan JDBC, JNDI (`javax.naming`), JAAS y JAXP.

Distractores reales: **JAXR** (registros XML tipo UDDI, eliminado), **JAX-RS** (REST, no XML), **JAXP** (parsear XML con DOM, SAX, StAX y XSLT, sin mapear a clases).

### 3.5 Servidores de aplicaciones y contenedores

| Producto | Tipo |
|---|---|
| Apache Tomcat | Contenedor de servlets (Servlet, Pages, EL, WebSocket). No implementa EJB ni JPA completos. |
| Eclipse Jetty, Undertow | Contenedores web ligeros, embebibles. |
| WildFly (Red Hat) / JBoss EAP | Servidor de aplicaciones completo. |
| Eclipse GlassFish | Servidor completo, implementación compatible histórica de referencia. |
| Payara Server | Derivado de GlassFish. |
| Open Liberty / WebSphere Liberty (IBM) | Servidor completo y modular. |
| Oracle WebLogic | Servidor comercial completo. |
| Apache TomEE | Tomcat más Web Profile de Jakarta EE. |

**No** son servidores de aplicaciones: Apache HTTP Server y Nginx (servidores web), MySQL o PostgreSQL (SGBD) **[Salió 2007 b4]**.

#### Tomcat: estructura y LifecycleListener

Componentes de Tomcat (fichero `conf/server.xml`): Server, Service, Connector (HTTP en 8080, AJP), Engine, Host, Context. **Catalina** es el contenedor de servlets y **Coyote** el conector HTTP. **Jasper** compila los JSP.

Un **LifecycleListener** (`org.apache.catalina.LifecycleListener`) recibe los eventos del ciclo de vida de un componente de Tomcat (arranque, parada). **[Salió 2025 reserva]** Tiene un único método `lifecycleEvent(LifecycleEvent event)`. Se registra con un elemento `<Listener>` anidado en el elemento **`<Server>`** de `server.xml` (respuesta oficial de 2025: "implementar un LifecycleListener y registrarlo en el elemento <server> del fichero server.xml"); también puede declararse en `<Service>`, `<Engine>`, `<Host>` o en `context.xml` para un contexto.

```xml
<Server port="8005" shutdown="SHUTDOWN">
  <Listener className="org.apache.catalina.startup.VersionLoggerListener" />
  <Listener className="org.apache.catalina.core.JreMemoryLeakPreventionListener" />
  <Listener className="org.apache.catalina.mbeans.GlobalResourcesLifecycleListener" />
  ...
</Server>
```

Eventos típicos: `before_init`, `after_init`, `before_start`, `start`, `after_start`, `before_stop`, `stop`, `after_stop`, `destroy`. No confundir con `ServletContextListener`, que es estándar de Servlet y escucha el arranque de una aplicación web.

### 3.6 Empaquetado y descriptores

| Fichero | Contenido |
|---|---|
| JAR | Clases y recursos. Módulo EJB o biblioteca. |
| WAR | Aplicación web: `WEB-INF/web.xml`, `WEB-INF/classes`, `WEB-INF/lib`. |
| EAR | Aplicación empresarial: varios WAR y JAR, con `META-INF/application.xml`. |
| RAR | Adaptador de recursos (Connectors). |

Descriptores: `web.xml` (web), `ejb-jar.xml` (EJB), `persistence.xml` (JPA, en `META-INF`), `beans.xml` (CDI), `application.xml` (EAR). Desde Java EE 5 casi todo se puede declarar con anotaciones.

## 4. Componentes web Java: servlets, JSP y Faces

### 4.1 Servlets

Un **servlet** es una clase Java que se ejecuta **en el servidor** (en el contenedor web) y responde peticiones HTTP **[Salió 2008]**. Los applets y los controles ActiveX se ejecutaban en el cliente, igual que JavaScript.

Ciclo de vida, gestionado por el contenedor:

1. Carga e instanciación (una sola instancia por servlet, compartida por todos los hilos).
2. `init(ServletConfig)`: una vez.
3. `service(req, res)`: una vez por petición. En `HttpServlet` despacha a `doGet`, `doPost`, `doPut`, `doDelete`, etc.
4. `destroy()`: al descargar el servlet.

```java
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.*;

@WebServlet("/contador")
public class Contador extends HttpServlet {
    private int total = 0;                       // atributo de instancia: compartido por todas las peticiones

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse res) throws IOException {
        res.setContentType("text/html;charset=UTF-8");   // tipo MIME de la respuesta
        HttpSession s = req.getSession();
        Integer enSesion = (Integer) s.getAttribute("n");
        enSesion = (enSesion == null) ? 1 : enSesion + 1;
        s.setAttribute("n", enSesion);
        total++;
        PrintWriter out = res.getWriter();
        out.println("<p>Total desde el arranque: " + total + "</p>");
        out.println("<p>En esta sesión: " + enSesion + "</p>");
        out.println("<p>" + new java.util.Date() + "</p>");
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse res) throws IOException {
        doGet(req, res);   // misma respuesta por GET y por POST
    }
}
```

Claves para leer un servlet en un supuesto **[Salió 2008 b3 17-23]**:

- `setContentType("text/html")` fija el **tipo MIME** de la respuesta (cabecera Content-Type). Indica al navegador que recibe HTML.
- Un contador en un **atributo de instancia** o `static` cuenta todas las ejecuciones desde que se cargó el servlet.
- Un contador guardado en **`HttpSession`** cuenta las peticiones de esa sesión (ese usuario y navegador).
- Un contador en **variable local** del método vale siempre 1.
- `new Date()` o `LocalDateTime.now()` muestra fecha y hora actuales.
- Si el servlet solo implementa `doGet` y se accede por POST, `HttpServlet` responde **405 Method Not Allowed**. Si `doPost` llama a `doGet`, la respuesta es la misma.

Otros elementos de la API Servlet:

- `ServletContext`: ámbito de aplicación, compartido por todos los usuarios.
- `RequestDispatcher.forward()` y `include()`: reenviar o incluir otro recurso en el servidor. `sendRedirect()` obliga al navegador a hacer otra petición (302).
- **Filtros** (`@WebFilter`, interfaz `Filter`): interceptan peticiones (autenticación, logs, codificación).
- **Listeners**: `ServletContextListener`, `HttpSessionListener`, `ServletRequestListener`.
- Ámbitos de atributos: page (solo JSP), request, session, application.

### 4.2 JSP (Jakarta Pages)

Una página JSP mezcla HTML y Java. El contenedor (Jasper en Tomcat) la **traduce a un servlet** y la compila la primera vez.

| Elemento | Sintaxis |
|---|---|
| Comentario JSP (no llega al cliente) | `<%-- comentario --%>` **[Salió 2016]** |
| Comentario HTML (sí llega al cliente) | `<!-- comentario -->` |
| Directiva | `<%@ page import="java.util.*" %>`, `<%@ include file="cab.jsp" %>`, `<%@ taglib prefix="c" uri="..." %>` |
| Declaración | `<%! int contador = 0; %>` |
| Scriptlet | `<% for (int i = 0; i < 3; i++) { %>` |
| Expresión | `<%= new java.util.Date() %>` |
| Lenguaje de expresiones | `${usuario.nombre}` |
| Acción estándar | `<jsp:include page="..."/>`, `<jsp:forward page="..."/>`, `<jsp:useBean>` |

Objetos implícitos: `request`, `response`, `out`, `session`, `application`, `config`, `pageContext`, `page` y `exception` (solo en páginas de error).

### 4.3 Jakarta Faces (JSF)

Framework MVC basado en **componentes** de servidor. Las vistas se escriben con **Facelets** (XHTML). Los beans de respaldo son beans CDI con `@Named` y un ámbito.

Ciclo de vida de una petición Faces (6 fases):

1. Restore View.
2. Apply Request Values.
3. Process Validations.
4. Update Model Values.
5. Invoke Application.
6. Render Response.

Bibliotecas de componentes: PrimeFaces, OmniFaces. Faces 4.x ya no admite JSP como tecnología de vista.

## 5. Componentes de negocio: CDI y EJB

### 5.1 CDI (Contexts and Dependency Injection)

CDI es el modelo de componentes central de Jakarta EE moderno. Un bean CDI es casi cualquier clase Java.

- `@Inject`: inyecta una dependencia.
- `@Named`: da nombre al bean para usarlo desde EL (`#{bean.prop}`).
- Ámbitos: `@RequestScoped`, `@SessionScoped`, `@ApplicationScoped`, `@ConversationScoped`, `@Dependent` (por defecto).
- `@Produces`: método productor. `@Qualifier`: distinguir implementaciones.
- Interceptores (`@Interceptor`) y decoradores (`@Decorator`).
- Eventos: `Event<T>.fire()` y `@Observes`.
- `@Transactional` (de Jakarta Transactions) añade transacciones a beans CDI.

### 5.2 Enterprise Beans (EJB)

**[Salió 2018]** Las clases e interfaces de EJB estaban en el paquete **`javax.ejb`**. Hoy es `jakarta.ejb` (Enterprise Beans 4.0).

| Tipo | Anotación | Uso |
|---|---|---|
| Sin estado | `@Stateless` | Operaciones independientes. El contenedor mantiene un pool. |
| Con estado | `@Stateful` | Conversación con un cliente (carrito). `@Remove` lo finaliza. |
| Singleton | `@Singleton` | Una instancia por aplicación. `@Startup` lo crea al arrancar. |
| Dirigido por mensajes | `@MessageDriven` | Consume mensajes JMS de forma asíncrona. |

- Vistas: `@Local`, `@Remote`, o sin interfaz (no-interface view).
- **Entity beans** de EJB 2 desaparecieron. Los sustituyó JPA.
- Servicios del contenedor: transacciones, seguridad, concurrencia, temporizadores (`@Schedule`), métodos asíncronos (`@Asynchronous`).
- Atributos de transacción (`@TransactionAttribute`): **REQUIRED** (por defecto), REQUIRES_NEW, MANDATORY, SUPPORTS, NOT_SUPPORTED, NEVER.
- **EJB Lite**: subconjunto incluido en el Web Profile (sin MDB ni interfaces remotas).

```java
import jakarta.ejb.Stateless;
import jakarta.persistence.*;

@Stateless
public class SolicitudService {
    @PersistenceContext
    private EntityManager em;

    public void registrar(Solicitud s) {   // transacción REQUIRED por defecto
        em.persist(s);
    }
}
```

### 5.3 Otros servicios: JNDI, JMS, JTA

- **JNDI** (`javax.naming`): servicio de nombres y directorios. Permite localizar recursos por nombre: `java:comp/env/jdbc/MiDS`.
- **Jakarta Messaging (JMS)**: mensajería asíncrona. Modelo punto a punto (**Queue**) y publicación/suscripción (**Topic**). Proveedores: ActiveMQ Artemis, IBM MQ.
- **Jakarta Transactions (JTA)**: `UserTransaction` (begin, commit, rollback) y `@Transactional`. Coordina varios recursos con commit en dos fases (XA).

## 6. Persistencia en Java

### 6.1 JDBC: paquetes e interfaces

JDBC es la API de bajo nivel de Java SE para hablar con bases de datos relacionales.

- **`java.sql`**: `DriverManager`, `Connection`, `Statement`, `PreparedStatement`, `CallableStatement`, `ResultSet`, `ResultSetMetaData`, `DatabaseMetaData`, `SQLException`.
- **`javax.sql`**: `DataSource`, pools de conexiones (`ConnectionPoolDataSource`), `XADataSource`, `RowSet`.
- **`javax.naming`**: JNDI, para obtener el `DataSource` configurado en el servidor.

**[Salió 2022 b3]** Para conectar con la base de datos en una aplicación Java de servidor: **`javax.naming` y `javax.sql`** (DataSource obtenido por JNDI). "java.database" no existe.

```java
// Opción 1: DriverManager (aplicaciones sencillas)
Connection con = DriverManager.getConnection(
    "jdbc:postgresql://localhost:5432/tai", "usuario", "clave");

// Opción 2: DataSource por JNDI (servidor de aplicaciones)
InitialContext ctx = new InitialContext();                        // javax.naming
DataSource ds = (DataSource) ctx.lookup("java:comp/env/jdbc/Notif"); // javax.sql
Connection con2 = ds.getConnection();
```

Métodos de ejecución:

| Método | Para qué | Devuelve |
|---|---|---|
| `executeQuery(sql)` | SELECT | `ResultSet` |
| `executeUpdate(sql)` | INSERT, UPDATE, DELETE, DDL | `int` (filas afectadas) |
| `execute(sql)` | Cualquiera | `boolean` (true si hay ResultSet) |
| `executeBatch()` | Lote de sentencias | `int[]` |

### 6.2 PreparedStatement

**[Salió 2019 reserva]** `PreparedStatement` sirve para **ejecutar muchas veces una sentencia SQL** precompilada con parámetros distintos. Además **previene la inyección SQL**, porque los parámetros nunca se concatenan al SQL.

```java
String sql = "SELECT id, nombre FROM ciudadano WHERE nif = ? AND activo = ?";
try (PreparedStatement ps = con.prepareStatement(sql)) {
    ps.setString(1, nif);        // los índices empiezan en 1
    ps.setBoolean(2, true);
    try (ResultSet rs = ps.executeQuery()) {
        while (rs.next()) {      // next() avanza; devuelve false al acabar
            System.out.println(rs.getLong("id") + " " + rs.getString("nombre"));
        }
    }
}
```

- `CallableStatement` invoca procedimientos almacenados: `con.prepareCall("{call alta(?, ?)}")`.
- Transacciones: `con.setAutoCommit(false)`, `con.commit()`, `con.rollback()`. Por defecto autocommit está activado.

### 6.3 Tipos de drivers JDBC

**[Salió 2022]** Hay **4 tipos**, no 3. La afirmación correcta fue: "los drivers tipo 3 utilizan un protocolo de red y middleware para comunicarse con un servidor".

| Tipo | Nombre | Cómo funciona | Java puro |
|---|---|---|---|
| 1 | Puente JDBC-ODBC | Traduce llamadas JDBC a ODBC. Eliminado en Java 8. | No |
| 2 | API nativa | Usa la biblioteca cliente nativa del SGBD (por ejemplo OCI de Oracle). | Parcialmente |
| 3 | Protocolo de red (middleware) | Habla con un servidor intermedio que traduce al protocolo del SGBD. | Sí |
| 4 | Protocolo nativo ("thin") | Habla directamente el protocolo de red del SGBD. Es el más usado hoy. | Sí |

Trampa de 2022: decían que el tipo 1 usa Java puro (falso, es el 4) y que el tipo 2 es el puente (falso, es el 1).

### 6.4 ORM y JPA

Un **ORM** (mapeador objeto-relacional) traduce clases a tablas y objetos a filas.

| ORM | Plataforma |
|---|---|
| Hibernate | Java (implementa JPA) |
| EclipseLink | Java (implementación de referencia de JPA) |
| Apache OpenJPA | Java |
| MyBatis | Java (mapeador SQL, no ORM completo) |
| Spring Data JPA | Java (capa de repositorios sobre JPA, no es un ORM en sí) |
| Entity Framework / EF Core | .NET |
| NHibernate | .NET (port de Hibernate) |
| Dapper | .NET (micro-ORM) |
| ActiveRecord | Ruby on Rails |
| Eloquent / Doctrine | PHP (Laravel / Symfony) |
| SQLAlchemy, Django ORM | Python |

**[Salió 2019]** No es un ORM: "Ruby Hibernation" (inventado). **[Salió 2024 b3]** En .NET, Entity Framework; en Java, Hibernate.

**JPA (Jakarta Persistence)** es la especificación estándar. Necesita un **proveedor** (Hibernate, EclipseLink) **[Salió 2024]**. Paquete: **`javax.persistence`** hasta Java EE 8 / Jakarta EE 8 **[Salió 2015]**. Desde Jakarta EE 9 es **`jakarta.persistence`**.

**[Salió 2024]** Afirmación correcta: "una entidad representa normalmente una tabla y cada instancia corresponde a una fila". Falsas: que no necesita proveedor, que el lenguaje se llama "JPSQL" (es **JPQL**) y que no admite relaciones uno a muchos.

### 6.5 Anotaciones JPA

| Anotación | Para qué |
|---|---|
| `@Entity` | Marca la clase como entidad persistente |
| `@Table(name = "ACTIVIDADES")` | Tabla a la que se mapea la clase **[Salió 2015]** |
| `@Id` | Clave primaria |
| `@GeneratedValue(strategy = ...)` | Generación de la clave: AUTO, IDENTITY, SEQUENCE, TABLE, UUID |
| `@Column(name, nullable, length, unique)` | Columna |
| `@Transient` | Atributo no persistente |
| `@Enumerated(EnumType.STRING)` | Guardar un enum |
| `@Lob` | Objeto grande (CLOB/BLOB) |
| `@Version` | Bloqueo optimista |
| `@Embeddable` / `@Embedded` | Objeto valor incrustado |
| `@OneToOne`, `@OneToMany`, `@ManyToOne`, `@ManyToMany` | Relaciones |
| `@JoinColumn` / `@JoinTable` | Clave ajena / tabla intermedia |
| `@Inheritance(strategy = ...)` | SINGLE_TABLE (defecto), JOINED, TABLE_PER_CLASS |
| `@MappedSuperclass` | Superclase con mapeo pero sin tabla propia |
| `@NamedQuery` | Consulta JPQL con nombre |
| `@PersistenceContext` | Inyecta un EntityManager |

```java
import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "ACTIVIDADES")
public class Actividades {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "DESCRIPCION", nullable = false, length = 200)
    private String descripcion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CENTRO_ID")
    private Centro centro;

    @OneToMany(mappedBy = "actividad", cascade = CascadeType.ALL)
    private List<Inscripcion> inscripciones;
}
```

Datos finos:

- Carga por defecto: `@OneToMany` y `@ManyToMany` son **LAZY**. `@ManyToOne` y `@OneToOne` son **EAGER**.
- `mappedBy` marca el lado inverso. El dueño de la relación es el lado con la clave ajena.
- `CascadeType`: ALL, PERSIST, MERGE, REMOVE, REFRESH, DETACH.

### 6.6 EntityManager, contexto de persistencia y JPQL

`EntityManager` gestiona las entidades. La unidad de persistencia se define en `META-INF/persistence.xml`.

| Método | Efecto |
|---|---|
| `persist(e)` | Hace persistente una entidad nueva |
| `find(Clase, id)` | Busca por clave primaria |
| `merge(e)` | Copia el estado de una entidad separada al contexto |
| `remove(e)` | Marca para borrar |
| `createQuery(jpql)` | Crea una consulta JPQL |
| `flush()` | Sincroniza con la BD sin hacer commit |
| `refresh(e)` | Recarga desde la BD |
| `detach(e)` | Separa la entidad del contexto |

Estados de una entidad: **nueva** (transient), **gestionada** (managed), **separada** (detached) y **eliminada** (removed).

```java
List<Actividades> lista = em.createQuery(
        "SELECT a FROM Actividades a WHERE a.centro.nombre = :c ORDER BY a.descripcion",
        Actividades.class)
    .setParameter("c", "Madrid")
    .getResultList();
```

JPQL consulta **entidades y atributos**, no tablas y columnas. Alternativa tipada: **Criteria API**.

### 6.7 Spring Data JPA y Jakarta Data

Ambos generan repositorios a partir de interfaces, sin escribir la implementación.

```java
public interface ActividadRepository extends JpaRepository<Actividades, Long> {
    List<Actividades> findByDescripcionContaining(String texto);  // consulta derivada del nombre
}
```

Jakarta Data 1.0 (Jakarta EE 11) hace lo mismo de forma estándar, con `@Repository`, `@Find`, `@Insert`, `@Query` y la interfaz `CrudRepository`.

## 7. Servicios web y XML en Java

### 7.1 JAX-WS (SOAP)

**[Salió 2017]** API Java para construir servicios web: **JAX-WS** (hoy Jakarta XML Web Services). JPA es persistencia; SOAP es el protocolo, no una API Java.

- Anotaciones `@WebService`, `@WebMethod`, `@WebParam`.
- `wsimport` genera el cliente a partir del WSDL. `wsgen` genera artefactos desde la clase.
- **[Salió 2024 b3, es del tema 20]** Tecnología Java para generar un cliente de servicios web: **Apache CXF**. Xerces es un parser y Xalan un procesador XSLT. Flink es procesamiento de flujos.
- JAX-WS, JAXB y CORBA se eliminaron del JDK en Java 11 (JEP 320). Ahora se añaden como dependencias.

### 7.2 Jakarta REST (JAX-RS)

```java
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;

@Path("/solicitudes")
@Produces(MediaType.APPLICATION_JSON)
public class SolicitudResource {
    @GET
    @Path("/{id}")
    public Solicitud obtener(@PathParam("id") long id) { ... }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public Response crear(Solicitud s) { ... return Response.status(201).build(); }
}
```

Anotaciones: `@Path`, `@GET`, `@POST`, `@PUT`, `@DELETE`, `@PATCH`, `@Produces`, `@Consumes`, `@PathParam`, `@QueryParam`, `@FormParam`, `@HeaderParam`. La clase `Application` con `@ApplicationPath("/api")` activa el servicio. Implementaciones: Jersey, RESTEasy, Apache CXF.

### 7.3 JAXB: XML a clases

**[Salió 2024 b3]** Para mapear elementos XML a clases Java: **JAXB** (Jakarta XML Binding).

- **Marshalling**: objeto Java a XML (`Marshaller`). **Unmarshalling**: XML a objeto (`Unmarshaller`).
- Anotaciones: `@XmlRootElement`, `@XmlElement`, `@XmlAttribute`, `@XmlTransient`, `@XmlAccessorType`.
- `xjc` genera clases desde un XSD. `schemagen` genera el XSD desde clases.

```java
JAXBContext ctx = JAXBContext.newInstance(Solicitud.class);
Solicitud s = (Solicitud) ctx.createUnmarshaller().unmarshal(new File("sol.xml"));
Marshaller m = ctx.createMarshaller();
m.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, true);
m.marshal(s, System.out);
```

Equivalentes para JSON: **JSON-B** (Yasson), **Jackson** y Gson.

## 8. Seguridad en Java y Jakarta EE

### 8.1 JAAS y familia

**[Salió 2016]** API de Java que proporciona autenticación y control de acceso de usuarios y grupos: **JAAS** (Java Authentication and Authorization Service).

| Sigla | Qué es |
|---|---|
| JAAS | Autenticación y autorización en Java SE. Clases `LoginContext`, `LoginModule`, `Subject`, `Principal`, `CallbackHandler`. |
| JACC (Jakarta Authorization) | Contrato entre servidor y proveedores de autorización. |
| JASPIC (Jakarta Authentication) | Contrato para módulos de autenticación pluggables (`ServerAuthModule`). |
| Jakarta Security | API de alto nivel: `HttpAuthenticationMechanism`, `IdentityStore`, `SecurityContext`. |
| JCA / JCE | Arquitectura criptográfica (MessageDigest, Cipher, KeyStore). No confundir con Connectors. |
| JSSE | TLS/SSL en Java. |
| JAF | JavaBeans Activation Framework (tipos MIME). No es seguridad. |
| JNDI | Nombres y directorios. No es seguridad, aunque se use con LDAP. |

El **Security Manager** de Java quedó obsoleto en Java 17 (JEP 411) y desactivado para siempre en Java 24 (JEP 486). Jakarta EE 11 ya no lo usa.

### 8.2 Seguridad declarativa y programática

Declarativa con anotaciones (Jakarta Annotations):

```java
@DeclareRoles({"GESTOR", "CIUDADANO"})
@Stateless
public class ExpedienteBean {
    @RolesAllowed("GESTOR")
    public void resolver(long id) { ... }

    @PermitAll
    public Estado consultar(long id) { ... }
}
```

- `@RolesAllowed`, `@PermitAll`, `@DenyAll`, `@RunAs`, `@DeclareRoles`.
- En `web.xml`: `<security-constraint>`, `<auth-constraint>`, `<login-config>`.
- Métodos de autenticación web: **BASIC**, **FORM**, **DIGEST**, **CLIENT-CERT**.
- Jakarta Security: `@BasicAuthenticationMechanismDefinition`, `@FormAuthenticationMechanismDefinition`, `@OpenIdAuthenticationMechanismDefinition` (OpenID Connect, desde EE 10).
- Programática: `request.isUserInRole("GESTOR")`, `request.getUserPrincipal()`, `SecurityContext.isCallerInRole()`.

### 8.3 Spring Security

Framework de seguridad de Spring: cadena de filtros, autenticación (formulario, HTTP Basic, OAuth2, JWT, SAML) y autorización por URL o método (`@PreAuthorize("hasRole('ADMIN')")`). Protege por defecto contra CSRF.

## 9. Spring y Spring Boot

### 9.1 Spring Framework

Framework Java de código abierto (hoy de Broadcom). Su núcleo es el contenedor de **inversión de control (IoC)** con **inyección de dependencias**. Módulos: Core, AOP, Data Access, MVC, WebFlux (reactivo), Test.

Estereotipos: `@Component`, `@Service`, `@Repository`, `@Controller`. Inyección preferente por constructor; también `@Autowired`. Configuración Java con `@Configuration` y `@Bean`.

### 9.2 Spring Boot

**[Salió 2018]** Spring Boot es una plataforma para crear aplicaciones **autocontenidas** que llevan **embebido el contenedor de servlets** (Tomcat por defecto, también Jetty o Undertow). Se ejecutan con `java -jar`.

Características:

- **Autoconfiguración** según las dependencias del classpath.
- **Starters**: `spring-boot-starter-web`, `-data-jpa`, `-security`, `-test`, `-actuator`.
- Configuración en `application.properties` o `application.yml`.
- **Actuator**: endpoints de salud y métricas (`/actuator/health`).
- **Spring Initializr** (start.spring.io) genera el proyecto inicial.
- `@SpringBootApplication` = `@Configuration` + `@EnableAutoConfiguration` + `@ComponentScan`.

### 9.3 Controlador REST en Spring Boot

**[Salió 2025 b3]** Un controlador REST se anota con **`@RestController`**, que equivale a `@Controller` + `@ResponseBody`. Los métodos devuelven objetos que se serializan a JSON con Jackson.

```java
@RestController
@RequestMapping("/api/solicitudes")
public class SolicitudController {

    private final SolicitudService servicio;

    public SolicitudController(SolicitudService servicio) {   // inyección por constructor
        this.servicio = servicio;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Solicitud> obtener(@PathVariable Long id) {
        return servicio.buscar(id)
                .map(ResponseEntity::ok)                       // 200
                .orElse(ResponseEntity.notFound().build());    // 404
    }

    @GetMapping
    public List<Solicitud> listar(@RequestParam(defaultValue = "0") int pagina) {
        return servicio.listar(pagina);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)                         // 201
    public Solicitud crear(@Valid @RequestBody Solicitud s) {
        return servicio.guardar(s);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> borrar(@PathVariable Long id) {
        servicio.borrar(id);
        return ResponseEntity.noContent().build();             // 204
    }
}
```

| Anotación | Para qué |
|---|---|
| `@RequestMapping` | Ruta base o genérica |
| `@GetMapping`, `@PostMapping`, `@PutMapping`, `@PatchMapping`, `@DeleteMapping` | Atajos por verbo HTTP |
| `@PathVariable` | Valor de la ruta (`/{id}`) |
| `@RequestParam` | Parámetro de consulta (`?pagina=2`) |
| `@RequestBody` | Cuerpo de la petición (JSON a objeto) |
| `@RequestHeader` | Cabecera HTTP |
| `@ResponseStatus` | Código HTTP de respuesta |
| `@ExceptionHandler`, `@RestControllerAdvice` | Gestión centralizada de errores |
| `@CrossOrigin` | Permitir CORS |

### 9.4 Arrancar la aplicación

**[Salió 2025 b3]** `mvn spring-boot:run` compila y **arranca la aplicación** desde el código fuente con el plugin de Maven de Spring Boot.

| Comando | Efecto |
|---|---|
| `mvn spring-boot:run` o `./mvnw spring-boot:run` | Ejecuta la aplicación (Maven) |
| `gradle bootRun` o `./gradlew bootRun` | Ejecuta la aplicación (Gradle) |
| `mvn clean package` | Genera el JAR ejecutable en `target/` |
| `java -jar target/app-1.0.jar` | Ejecuta el JAR empaquetado |
| `mvn spring-boot:build-image` | Crea una imagen de contenedor (OCI) |
| `mvn test` | Ejecuta las pruebas |

Puerto por defecto: **8080** (`server.port` lo cambia).

## 10. Plataforma .NET

### 10.1 Qué es .NET y su evolución

**.NET** es una plataforma de desarrollo **gratuita, de código abierto y multiplataforma** de Microsoft **[Salió 2022]**. Se publica con licencia MIT bajo la .NET Foundation. Funciona en Windows, Linux y macOS. Admite varios lenguajes: **C#**, F# y Visual Basic. Sirve para web, escritorio, móvil, nube, juegos (Unity), IoT e IA.

| Producto | Años | Notas |
|---|---|---|
| .NET Framework 1.0 a 4.8.1 | 2002-2022 | Solo Windows. Incluido en Windows. Sin novedades, solo mantenimiento. |
| Mono / Xamarin | 2004-2024 | Implementación libre multiplataforma. Xamarin perdió soporte en mayo de 2024. |
| .NET Core 1.0 a 3.1 | 2016-2019 | Reescritura abierta y multiplataforma. |
| .NET 5 | 2020 | Unifica la línea. Se quita "Core" del nombre. |
| .NET 6 (LTS), 7, 8 (LTS), 9 | 2021-2024 | Una versión cada noviembre. |
| .NET 10 (LTS) | Noviembre de 2025 | Versión LTS vigente, con C# 14. Soporte hasta noviembre de 2028. |
| .NET 11 (STS) | Noviembre de 2026 | Versión de soporte estándar. |

- Versiones **pares** son **LTS** (3 años de soporte). Las **impares** son **STS**: 18 meses, ampliado a 24 meses desde .NET 9.
- Distractores habituales: ".NET es de Google", ".NET sirve exclusivamente para móviles", ".NET admite muchos lenguajes excepto C#" **[Salió 2022]**.

### 10.2 Arquitectura: CLI, CLR, CIL, CTS, CLS, BCL

La **CLI** (Common Language Infrastructure) es el estándar ECMA-335 e ISO/IEC 23271. .NET es su implementación.

| Sigla | Nombre | Función |
|---|---|---|
| CLR | Common Language Runtime | Motor de ejecución (máquina virtual) |
| CIL / MSIL / IL | Common Intermediate Language | Código intermedio que generan los compiladores |
| CTS | Common Type System | Sistema de tipos común a todos los lenguajes |
| CLS | Common Language Specification | Reglas mínimas para que los lenguajes interoperen |
| BCL / FCL | Base / Framework Class Library | Biblioteca de clases (System.*) |
| JIT (RyuJIT) | Just-In-Time compiler | Traduce CIL a código máquina en ejecución |
| GC | Garbage Collector | Libera memoria de objetos no referenciados |

Flujo: código C# → compilador **Roslyn** → **CIL + metadatos** en un ensamblado → el CLR lo carga → el **JIT** genera código nativo → se ejecuta como **código administrado** (managed code).

### 10.3 El CLR

**[Salió 2008, 2025]** El **CLR** es el entorno de ejecución de .NET. Funciones:

- Compilación **JIT** del CIL a código máquina nativo.
- **Recolección de basura**: elimina de memoria los objetos no utilizados.
- **Seguridad**: verificación de tipos, seguridad del código. En .NET Framework existía CAS (Code Access Security), eliminada en .NET Core y posteriores.
- Gestión de **excepciones** y de **hilos**.
- Carga de ensamblados, resolución de tipos y metadatos.
- Interoperabilidad con código nativo (P/Invoke, COM).

En 2008 preguntaron "¿cuál no es función del CLR?". Generar código máquina, eliminar objetos y seguridad lo son. La respuesta era "todas las anteriores son funciones del CLR".

### 10.4 Ensamblados (assemblies)

**[Salió 2017, 2025]** El **ensamblado** es la **unidad fundamental de implementación, control de versiones, reutilización, ámbito de activación y permisos de seguridad** de una aplicación .NET. Es un fichero `.dll` (biblioteca) o `.exe` (ejecutable).

Contenido:

- **Manifiesto**: nombre, versión (mayor.menor.compilación.revisión), referencias a otros ensamblados, lista de ficheros, referencia cultural.
- **Metadatos de tipos**: descripción de clases, métodos y atributos. Permiten la **reflexión**.
- **Código CIL**.
- **Recursos**: imágenes, cadenas localizadas.

Datos complementarios:

- **Nombre seguro (strong name)**: nombre, versión, cultura y clave pública con firma.
- **GAC (Global Assembly Cache)**: almacén de ensamblados compartidos en .NET Framework. No existe en .NET moderno, que usa NuGet.
- Ensamblados **satélite**: solo recursos de un idioma.
- Herramienta para ver el CIL: `ildasm`, ILSpy.
- **Carga bajo demanda** **[Salió 2025]**: el CLR solo carga en memoria un ensamblado cuando se necesita (la primera vez que se usa un tipo suyo). Si no se usa, no se carga.

Un **espacio de nombres** es una agrupación lógica de tipos. Un ensamblado es una unidad física. Un ensamblado puede contener varios espacios de nombres y un espacio de nombres puede repartirse entre varios ensamblados.

### 10.5 Espacios de nombres

**[Salió 2018]** Los **namespaces** son un **mecanismo para organizar clases** y evitar conflictos de nombres. No protegen ni encapsulan (eso lo hacen los modificadores de acceso).

**[Salió 2016]** La directiva para importarlos en C# es **`using System;`**. "import" es de Java y Python.

```csharp
using System;                       // directiva using: importa un espacio de nombres
using System.Collections.Generic;
using Sql = Microsoft.Data.SqlClient; // alias

namespace Tai.Expedientes;          // namespace con ámbito de fichero (C# 10)

public class Expediente { }
```

Espacios de nombres importantes:

| Namespace | Contenido |
|---|---|
| System | Tipos base, Console, DateTime, Math, String |
| System.Collections | Colecciones no genéricas (ArrayList, Hashtable) |
| System.Collections.Generic | `List<T>`, `Dictionary<K,V>` |
| System.IO | Ficheros y flujos |
| System.Linq | LINQ |
| System.Data | ADO.NET (DataSet, DataTable) |
| System.Net.Http | HttpClient |
| System.Text.Json | Serialización JSON |
| System.Threading.Tasks | Task, programación asíncrona |
| System.Web.UI.HtmlControls | Controles HTML de servidor de Web Forms |

### 10.6 NuGet y la CLI de dotnet

**[Salió 2019]** **NuGet** es el **administrador de paquetes** de .NET. El repositorio público es nuget.org. Un paquete es un fichero `.nupkg`.

**[Salió 2024 b3]** Para instalar el paquete NuGet de iText: **`dotnet add package iText`**.

| Forma | Comando |
|---|---|
| CLI de .NET | `dotnet add package iText` (opcional `--version 9.0.0`) |
| Consola del Administrador de paquetes (Visual Studio) | `Install-Package iText` |
| CLI nuget.exe | `nuget install iText` |
| Eliminar | `dotnet remove package iText` |
| Restaurar dependencias | `dotnet restore` |

El paquete queda referenciado en el `.csproj`:

```xml
<ItemGroup>
  <PackageReference Include="iText" Version="9.0.0" />
</ItemGroup>
```

Otros comandos de la CLI `dotnet`:

| Comando | Efecto |
|---|---|
| `dotnet new webapi -n MiApi` | Crea un proyecto desde plantilla (console, classlib, mvc, webapp, blazor, maui, xunit) |
| `dotnet build` | Compila |
| `dotnet run` | Compila y ejecuta |
| `dotnet test` | Ejecuta pruebas |
| `dotnet publish -c Release` | Prepara para desplegar |
| `dotnet watch run` | Ejecuta con recarga en caliente |
| `dotnet add reference ../Lib/Lib.csproj` | Referencia a otro proyecto |
| `dotnet ef migrations add Inicial` | Crea una migración de EF Core |
| `dotnet ef database update` | Aplica migraciones a la BD |

### 10.7 Lenguajes e IDE

- **C#**: lenguaje principal, orientado a objetos con rasgos funcionales.
- **F#**: lenguaje **funcional primero y multiparadigma** (funcional, imperativo y orientado a objetos) **[Salió 2018]**.
- **Visual Basic .NET**: sin nuevas funciones del lenguaje.
- C++/CLI: C++ con extensiones para el CLR, solo Windows.
- "G#" y "Cloos" no son lenguajes .NET.

**[Salió 2018]** El IDE de Microsoft es **Visual Studio** (Community, Professional, Enterprise). **Visual Studio Code** es un editor ligero y multiplataforma. Visual Studio para Mac se retiró en agosto de 2024. Alternativa de JetBrains: **Rider**. NetBeans es de Apache; Sublime Text y CodeLite no son de Microsoft.

## 11. C# práctico para el supuesto

### 11.1 Tipos de valor y de referencia

- **Tipos de valor** (`struct`, `int`, `double`, `bool`, `DateTime`, `enum`): la asignación **copia** el contenido.
- **Tipos de referencia** (`class`, `string`, arrays, `object`): la asignación copia la **referencia**. Ambas variables apuntan al mismo objeto.

**[Salió 2016 b3]** Traza típica con `ns` (struct) y `nc` (class):

```csharp
struct NumS { public int n; }
class  NumC { public int n; }

static void Cambia(NumS s, NumC c) { s.n = 8; c.n = 8; }

NumS ns = new NumS(); ns.n = 5;
NumC nc = new NumC(); nc.n = 5;
Cambia(ns, nc);
Console.WriteLine($"ns.n = {ns.n} nc.n = {nc.n}");
// Resultado: ns.n = 5 nc.n = 8
```

El método recibe una **copia** del struct, así que el original no cambia. Recibe una copia de la **referencia** a la clase, así que modifica el mismo objeto. Con `ref` o `out` sí cambiaría el struct.

### 11.2 Tipos que aceptan null y operadores de null

**[Salió 2024 b3, es del tema 16]** La opcionalidad de un tipo se indica con **`int? Telefono`** (`Nullable<int>`).

```csharp
int? telefono = null;
int t = telefono ?? 0;            // ?? coalescencia nula: 0 si es null
string? nombre = null;            // tipo de referencia anulable (C# 8)
int? lon = nombre?.Length;        // ?. condicional nulo: null sin excepción
nombre ??= "Anónimo";             // asigna solo si es null
if (telefono.HasValue) Console.WriteLine(telefono.Value);
```

### 11.3 Instrucción using e IDisposable

**[Salió 2019 b3]** Para crear un `SqlConnection` y que se llame a `Dispose` al final del bloque: **instrucción `using`**.

```csharp
using (SqlConnection conn = new SqlConnection(connString))
{
    conn.Open();
    // ...
}   // aquí se llama a conn.Dispose(), que cierra la conexión, aunque haya excepción

// Declaración using (C# 8): se libera al final del ámbito que la contiene
using var conn2 = new SqlConnection(connString);
```

`using` tiene dos usos distintos: **directiva** (importar espacios de nombres) e **instrucción** (liberar recursos `IDisposable`). Equivale a `try-finally` con `Dispose()`. "scope", "dispose" o "internal" no sirven: `internal` es un modificador de acceso.

### 11.4 Programación asíncrona: async, await y Task

**[Salió 2025 b3]** Un método `async Task` es asíncrono y no devuelve valor; si debe devolver un dato, la firma es `async Task<int> DevolverDatoAsync()`. Ojo: la plantilla provisional de 2025 dio como correcta "a) Thread int DevolverDato()" (ver Trampas). Dentro usa `await` para esperar operaciones sin bloquear el hilo.

```csharp
public async Task<Solicitud?> ObtenerAsync(int id)
{
    await using var conn = new SqlConnection(_cadena);
    await conn.OpenAsync();
    var cmd = new SqlCommand("SELECT Id, Nif FROM Solicitud WHERE Id = @id", conn);
    cmd.Parameters.AddWithValue("@id", id);
    await using var rd = await cmd.ExecuteReaderAsync();
    return await rd.ReadAsync() ? new Solicitud(rd.GetInt32(0), rd.GetString(1)) : null;
}

// Llamada
Solicitud? s = await ObtenerAsync(7);
```

| Firma | Significado |
|---|---|
| `async Task` | Asíncrono sin valor de retorno |
| `async Task<T>` | Asíncrono que devuelve un T |
| `async ValueTask<T>` | Igual, optimizado si suele terminar sin esperar |
| `async void` | Solo para manejadores de eventos. No se puede esperar y sus excepciones no se capturan |
| `Task.WhenAll(t1, t2)` | Espera a que terminen todas |
| `Task.Run(() => ...)` | Ejecuta trabajo de CPU en el pool de hilos |

- `await` solo puede usarse dentro de un método `async`.
- Por convención, los métodos asíncronos acaban en `Async`.
- `.Result` o `.Wait()` bloquean y pueden provocar interbloqueos. Mejor `await`.
- Se apoya en el patrón TAP (Task-based Asynchronous Pattern).

### 11.5 Consola, cadenas y fechas

**[Salió 2016 b3]** Leer una línea de la entrada estándar: **`string cadena = Console.ReadLine();`** `Console.Read()` lee un solo carácter y devuelve `int`.

**[Salió 2016 b3]** Recorrer una cadena sin error: el índice va de 0 a `Length - 1`. `Length` es una **propiedad**, sin paréntesis.

```csharp
string cadena = Console.ReadLine() ?? "";
int lon = 0;
while (lon <= cadena.Length - 1)      // equivale a lon < cadena.Length
{
    Console.Write("{0} ", cadena[lon]);
    lon++;
}
```

Con `lon < cadena.Length + 1` el último acceso lanza `IndexOutOfRangeException`. `cadena.Length()` no compila.

**[Salió 2018 b3]** Convertir un string a fecha: **`DateTime.Parse`**.

```csharp
DateTime f1 = DateTime.Parse("19/10/2026");                     // usa la cultura actual
DateTime f2 = DateTime.ParseExact("2026-10-19", "yyyy-MM-dd", CultureInfo.InvariantCulture);
bool ok = DateTime.TryParse(texto, out DateTime f3);             // no lanza excepción
DateOnly d = DateOnly.Parse("2026-10-19");                       // solo fecha (.NET 6)
```

`Convert.ToDateTime` también sirve. "To_date" es de Oracle SQL. "ToDate" y "String2Date" no existen en C#.

### 11.6 Arrays

```csharp
int[] a = new int[3];               // tres ceros
int[] b = { 4, 1, 3 };
int[] c = new int[] { 4, 1, 3 };
int[] d = new int[3] { 4, 1, 3 };
int[] e = [4, 1, 3];                // expresión de colección (C# 12)
// Errores de compilación:
// int f[] = {1, 2};                 sintaxis de C/Java, no válida en C#
// int[] g = new int[2] { 1, 2, 3 }; tamaño y número de elementos no coinciden
// int[3] h;                         el tamaño no va en el tipo
```

**[Salió 2015 b3]** Traza con `Array.Sort` y `Array.Reverse`:

```csharp
int[] v = { 5, 2, 9, 1 };
Array.Sort(v);         // 1 2 5 9  (orden ascendente, modifica el array)
Array.Reverse(v);      // 9 5 2 1  (invierte el orden)
foreach (int x in v) Console.Write(x + " ");
// Salida: 9 5 2 1
```

### 11.7 Colecciones

**System.Collections** (no genéricas, guardan `object`): `ArrayList`, `Hashtable`, `Queue`, `Stack`, `SortedList`, `BitArray`. **No** hay `Tree` **[Salió 2016 b3]**.

**System.Collections.Generic** (recomendadas): `List<T>`, `Dictionary<TKey,TValue>`, `HashSet<T>`, `Queue<T>`, `Stack<T>`, `LinkedList<T>`, `SortedList<K,V>`, `SortedDictionary<K,V>`, `SortedSet<T>`.

**[Salió 2015 b3]** Para usar `ArrayList` hay que importar **`using System.Collections;`**.

Formas de recorrer un `ArrayList` de objetos `Cliente`:

```csharp
using System.Collections;

ArrayList clientes = new ArrayList();
clientes.Add(new Cliente("Ana"));

foreach (Cliente c in clientes)               // válido: conversión implícita en foreach
    Console.WriteLine(c.Nombre);

for (int i = 0; i < clientes.Count; i++)      // válido: Count, no Length
    Console.WriteLine(((Cliente)clientes[i]).Nombre);   // hay que hacer cast

// No válidos:
// for (int i = 0; i < clientes.Length; i++)  ArrayList no tiene Length
// clientes[i].Nombre                         sin cast, object no tiene Nombre
```

Con `List<Cliente>` no hace falta cast. LINQ permite filtrar: `clientes.Where(c => c.Activo).OrderBy(c => c.Nombre).ToList()`.

### 11.8 POCO, propiedades y records

**[Salió 2022]** **POCO** (Plain Old CLR Object) es una estructura de datos .NET que solo contiene **propiedades o campos públicos**. No hereda de otra clase ni implementa interfaces de un framework. Según la definición de Microsoft **no** debe contener otros miembros como **métodos, eventos o delegados**. Equivale al POJO de Java.

```csharp
public class Ciudadano            // POCO
{
    public int Id { get; set; }
    public string Nif { get; set; } = "";
    public DateTime? FechaAlta { get; set; }
}

public record SolicitudDto(int Id, string Estado);   // record (C# 9): inmutable, igualdad por valor
```

## 12. Acceso a datos en .NET

### 12.1 ADO.NET: arquitectura

ADO.NET es la API de acceso a datos de .NET. Tiene dos modos:

- **Conectado**: `Connection`, `Command`, `DataReader` (lectura hacia delante y solo lectura), `Parameter`, `Transaction`.
- **Desconectado**: `DataSet` (colección de `DataTable` y `DataRelation`), `DataTable` (`DataRow`, `DataColumn`), `DataAdapter` (puente: `Fill` y `Update`).

**[Salió 2018]** Falsa: "el objeto **Operation** permite invocar peticiones". El objeto que ejecuta sentencias es **Command**. Verdaderas: ADO.NET accede a datos XML, Connection da conectividad, DataSet contiene una colección de DataTable.

Proveedores de datos (cada uno con su `XxxConnection`, `XxxCommand`, `XxxDataReader`, `XxxDataAdapter`):

| Proveedor | Espacio de nombres o paquete |
|---|---|
| SQL Server | `Microsoft.Data.SqlClient` (actual), `System.Data.SqlClient` (obsoleto) |
| OLE DB | `System.Data.OleDb` (solo Windows) |
| ODBC | `System.Data.Odbc` |
| Oracle | `Oracle.ManagedDataAccess` (ODP.NET) |
| MySQL | `MySql.Data` (MySqlConnection) o MySqlConnector |
| PostgreSQL | `Npgsql` |
| SQLite | `Microsoft.Data.Sqlite` |

### 12.2 Command y sus métodos

**[Salió 2016 b3]** El método de `SqlCommand` que devuelve un `SqlDataReader` es **`ExecuteReader`**.

| Método | Uso | Devuelve |
|---|---|---|
| `ExecuteReader()` | SELECT con varias filas | `DataReader` |
| `ExecuteNonQuery()` | INSERT, UPDATE, DELETE, DDL | `int` (filas afectadas) |
| `ExecuteScalar()` | Un único valor (COUNT, MAX) | `object` (primera columna de la primera fila) |
| `ExecuteXmlReader()` | Resultado XML (SQL Server) | `XmlReader` |

Todos tienen versión asíncrona: `ExecuteReaderAsync`, `ExecuteNonQueryAsync`, `ExecuteScalarAsync`.

**[Salió 2018 b3]** Con una `MySqlConnection` abierta, la instrucción para ejecutar después la consulta es **`MySqlCommand resultado = new MySqlCommand(query, conn);`**. `mysqli_query` es de PHP y `executeQuery` de Java (JDBC).

```csharp
MySqlConnection conn = new MySqlConnection(cadena);
string query = "SELECT * FROM Inscripcion WHERE Curso = @curso";
conn.Open();
MySqlCommand cmd = new MySqlCommand(query, conn);
cmd.Parameters.AddWithValue("@curso", 2026);       // parámetros: evita inyección SQL
using MySqlDataReader rd = cmd.ExecuteReader();
while (rd.Read())                                  // Read() avanza; false al terminar
    Console.WriteLine(rd["Nombre"]);
conn.Close();
```

Modo desconectado:

```csharp
var da = new SqlDataAdapter("SELECT * FROM Curso", conn);
var ds = new DataSet();
da.Fill(ds, "Curso");                     // abre, consulta, cierra
foreach (DataRow fila in ds.Tables["Curso"].Rows)
    Console.WriteLine(fila["Titulo"]);
```

### 12.3 ADO clásico (no .NET)

ADO (ActiveX Data Objects) es la tecnología COM anterior a .NET (ASP clásico, VB6). Objetos: **Connection**, **Command**, **Recordset**, **Record**, **Stream**, **Field**, **Parameter**, **Property** y **Error** (colección Errors). **[Salió 2008]** **DSN** no es un componente de ADO: es el nombre de un origen de datos ODBC.

### 12.4 Entity Framework Core

EF Core es el ORM oficial de .NET. Versión actual: EF Core 10 (con .NET 10). Proveedores para SQL Server, PostgreSQL, MySQL, SQLite, Oracle y Cosmos DB.

```csharp
public class TaiContext : DbContext
{
    public DbSet<Ciudadano> Ciudadanos => Set<Ciudadano>();
    public DbSet<Solicitud> Solicitudes => Set<Solicitud>();

    protected override void OnConfiguring(DbContextOptionsBuilder o)
        => o.UseSqlServer("Server=.;Database=Tai;Trusted_Connection=True;");
}

// Uso con LINQ
using var db = new TaiContext();
var pendientes = await db.Solicitudes
    .Where(s => s.Estado == "PENDIENTE")
    .OrderBy(s => s.Fecha)
    .ToListAsync();
db.Ciudadanos.Add(new Ciudadano { Nif = "12345678Z" });
await db.SaveChangesAsync();          // genera los INSERT/UPDATE/DELETE
```

- **DbContext**: unidad de trabajo y sesión con la BD. `DbSet<T>`: colección de entidades (tabla).
- Enfoques: **Code First** (clases primero y migraciones) y **Database First** (scaffolding desde la BD: `dotnet ef dbcontext scaffold`).
- Configuración con convenciones, anotaciones (`[Key]`, `[Table("X")]`, `[Required]`, `[MaxLength]`) o Fluent API (`OnModelCreating`).
- Migraciones: `dotnet ef migrations add` y `dotnet ef database update`. En la consola de Visual Studio: `Add-Migration` y `Update-Database`.
- Carga de relaciones: eager (`Include`), explícita y diferida (lazy, con proxies).

Otros ORM .NET: **NHibernate** y **Dapper** (micro-ORM de Stack Overflow, SQL escrito a mano).

## 13. Interfaces de usuario en .NET

### 13.1 Web: ASP.NET Web Forms (.NET Framework)

Modelo antiguo, solo en .NET Framework. Páginas `.aspx` con código separado (*code-behind*) en `.aspx.cs`. No existe en .NET Core ni posteriores.

**[Salió 2015 b3]** La directiva `@Page` enlaza la página con su fichero de código:

```aspx
<%@ Page Language="C#" AutoEventWireup="true"
         CodeBehind="Alta.aspx.cs" Inherits="Tai.Alta" %>
```

- **CodeBehind**: fichero de código en proyectos de tipo *Web Application* (se compila antes).
- **CodeFile**: fichero de código en proyectos de tipo *Web Site* (se compila en ejecución).
- **Inherits**: clase de la que hereda la página.

**[Salió 2016 b3]** Ciclo de vida de una página: PreInit → **Init** → InitComplete → PreLoad → **Load** → eventos de control (Click) → LoadComplete → PreRender → SaveStateComplete → Render → Unload. Entre `Page_Init`, `Page_Load` y `Page_Click`, ocurre antes **Page_Init**. "Page_PrePage" no existe.

**[Salió 2016 b3]** Controles HTML de servidor (`runat="server"`), en `System.Web.UI.HtmlControls`: `<input type="checkbox">` se maneja con **`HtmlInputCheckBox`**. Otros: `HtmlInputText`, `HtmlInputButton`, `HtmlForm`, `HtmlTable`. Los controles web (`System.Web.UI.WebControls`) son `<asp:CheckBox>`, `<asp:TextBox>`, `<asp:GridView>`.

**[Salió 2017]** Modos de almacenamiento del estado de sesión (`<sessionState mode="...">`):

| Modo | Dónde se guarda |
|---|---|
| InProc | Memoria del proceso del servidor web (por defecto) |
| StateServer | Servicio de estado ASP.NET (otro proceso o máquina) |
| SQLServer | Base de datos SQL Server |
| Custom | Proveedor propio |
| Off | Sesión desactivada |

"AppServer" no es un modo válido. En ASP.NET Core la sesión usa `IDistributedCache` (memoria, Redis, SQL Server).

### 13.2 ASP.NET Core

Framework web abierto y multiplataforma. Servidor web integrado **Kestrel**. Puede ir detrás de IIS, Nginx o Apache como proxy inverso.

- **Canal de middleware** (*pipeline*): cada componente procesa la petición y pasa al siguiente.
- **Inyección de dependencias integrada**: `AddSingleton`, `AddScoped` (una por petición), `AddTransient` (una por uso).
- Configuración en `appsettings.json`, variables de entorno y secretos.
- Modelos de aplicación: **MVC**, **Razor Pages**, **Web API** (controladores), **Minimal APIs**, **Blazor**, **SignalR** (tiempo real), **gRPC**.

```csharp
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();
builder.Services.AddScoped<ISolicitudService, SolicitudService>();
var app = builder.Build();

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.MapGet("/salud", () => Results.Ok("ok"));   // Minimal API
app.Run();
```

Controlador Web API (equivalente a `@RestController` de Spring):

```csharp
[ApiController]
[Route("api/[controller]")]
public class SolicitudesController : ControllerBase
{
    private readonly ISolicitudService _svc;
    private readonly ILogger<SolicitudesController> _log;

    public SolicitudesController(ISolicitudService svc, ILogger<SolicitudesController> log)
    { _svc = svc; _log = log; }

    [HttpGet("{id}")]
    public async Task<ActionResult<Solicitud>> Get(int id)
    {
        var s = await _svc.BuscarAsync(id);
        return s is null ? NotFound() : Ok(s);          // 404 o 200
    }

    [HttpPost]
    public async Task<IActionResult> Post(Solicitud s)
    {
        await _svc.CrearAsync(s);
        return CreatedAtAction(nameof(Get), new { id = s.Id }, s);   // 201
    }
}
```

### 13.3 Razor y Blazor

**[Salió 2024]** **Razor** es la **sintaxis de plantillas** de ASP.NET Core para crear vistas dinámicas mezclando HTML y C#. Se procesa **en el servidor** (salvo en Blazor WebAssembly). No es un lenguaje de programación. El símbolo **`@` hace la transición de HTML a C#**, no al revés.

```cshtml
@model List<Solicitud>
<h1>Solicitudes (@Model.Count)</h1>
<ul>
@foreach (var s in Model)
{
    <li>@s.Id - @s.Estado</li>
}
</ul>
@{ var hoy = DateTime.Today; }
<p>Fecha: @hoy.ToShortDateString()</p>
```

- Ficheros: `.cshtml` (MVC y Razor Pages) y `.razor` (componentes Blazor).
- Directivas: `@model`, `@page`, `@using`, `@inject`, `@code`, `@if`, `@foreach`, `@{ }`.
- **Tag Helpers**: atributos `asp-for`, `asp-action`, `asp-controller` sobre HTML.
- Razor codifica en HTML la salida de `@` por defecto, lo que previene XSS.

**Blazor**: interfaz web interactiva con componentes C# en lugar de JavaScript.

| Modo | Dónde se ejecuta |
|---|---|
| Blazor Server | En el servidor; la interfaz se actualiza por SignalR |
| Blazor WebAssembly | En el navegador, sobre WebAssembly |
| Blazor Web App (.NET 8+) | Mezcla renderizado estático, servidor y WebAssembly por componente |
| Blazor Hybrid | Componentes Razor dentro de una app nativa (MAUI, WPF, WinForms) mediante un WebView |

### 13.4 Escritorio y móvil

**[Salió 2024]** **.NET MAUI** (Multi-platform App UI) es un **marco multiplataforma para crear aplicaciones móviles y de escritorio nativas con C# y XAML**. Sucesor de Xamarin.Forms. Plataformas: Android, iOS, macOS (Mac Catalyst) y Windows (WinUI 3). Linux no está soportado oficialmente.

**[Salió 2022 b3]** Framework para aplicaciones de escritorio nativas .NET: **.NET MAUI**. JavaFX es Java. Blazor Hybrid y WebView incrustan interfaz web en una app nativa.

| Tecnología | Plataforma | Notas |
|---|---|---|
| Windows Forms (WinForms) | Solo Windows | La más antigua, diseñador visual, GDI+ |
| WPF | Solo Windows | XAML, enlace de datos, patrón MVVM, DirectX |
| UWP | Windows 10/11 | En mantenimiento |
| WinUI 3 / Windows App SDK | Windows 10/11 | Interfaz nativa moderna de Windows |
| .NET MAUI | Android, iOS, macOS, Windows | Multiplataforma, XAML o C# |
| Avalonia, Uno Platform | Incluye Linux y web | De terceros, no de Microsoft |

WinForms y WPF funcionan en .NET moderno, pero solo en Windows.

## 14. Seguridad en .NET

### 14.1 Autenticación y autorización en ASP.NET Core

- **ASP.NET Core Identity**: gestión de usuarios, contraseñas (con hash), roles, 2FA y bloqueo.
- **Esquemas de autenticación**: cookies, **JWT Bearer**, **OpenID Connect**, autenticación de Windows (Negotiate/Kerberos), certificados.
- Proveedores externos: Microsoft **Entra ID** (antes Azure AD), Google, Cl@ve mediante SAML u OIDC.
- **Autorización**: `[Authorize]`, `[Authorize(Roles = "Gestor")]`, `[Authorize(Policy = "MayorEdad")]`, `[AllowAnonymous]`. Basada en roles, en **claims** o en **políticas**.
- Middleware: `UseAuthentication()` antes de `UseAuthorization()`.

```csharp
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(o => { o.Authority = "https://idp.ejemplo.es"; o.Audience = "api-tai"; });
builder.Services.AddAuthorization(o =>
    o.AddPolicy("SoloGestores", p => p.RequireRole("Gestor")));
```

### 14.2 Otras protecciones

- **Data Protection API**: cifrado de cookies y tokens.
- **Antiforgery**: tokens contra CSRF en formularios (`[ValidateAntiForgeryToken]`).
- `UseHttpsRedirection()` y `UseHsts()`: forzar HTTPS.
- CORS: `AddCors` y `UseCors`.
- **Secret Manager** (`dotnet user-secrets`) en desarrollo y Azure Key Vault en producción.
- .NET Framework: autenticación Forms y Windows en `web.config`. CAS (Code Access Security) ya no existe en .NET moderno.

## 15. Utilidades transversales en .NET

### 15.1 Logging

**[Salió 2025 b3]** En .NET moderno el registro se hace con **`ILogger<T>`** (`Microsoft.Extensions.Logging`), que se inyecta por constructor.

```csharp
public class SolicitudService
{
    private readonly ILogger<SolicitudService> _logger;
    public SolicitudService(ILogger<SolicitudService> logger) => _logger = logger;

    public void Registrar(int id)
    {
        _logger.LogInformation("Registrada la solicitud {Id}", id);   // logging estructurado
        _logger.LogWarning("Plazo próximo a vencer para {Id}", id);
    }
}
```

Niveles (de menor a mayor gravedad): **Trace**, **Debug**, **Information**, **Warning**, **Error**, **Critical**, y **None** para desactivar. Se configuran en `appsettings.json` en la sección `Logging:LogLevel`. **[Salió 2025 b3]** Para registrar que un método terminó bien se usa el nivel Information: `logger.LogInformation("Ejecución del método finalizada correctamente.");`.

**[Salió 2015]** Bibliotecas de logs para .NET:

| Biblioteca | Notas |
|---|---|
| log4net | De Apache, port de log4j |
| NLog | Muy extendida, configuración en nlog.config |
| Serilog | Logging estructurado, "sinks" (destinos) |
| Microsoft.Extensions.Logging | Abstracción oficial; las anteriores se enchufan como proveedores |

### 15.2 Programación orientada a aspectos (AOP)

**[Salió 2018 b3]** Framework de AOP para .NET: **PostSharp** (su sucesor es Metalama). Spring Framework y AspectJ son de Java; Aspyct es de Python. También existen Castle DynamicProxy, Fody y Spring.NET (abandonado).

### 15.3 Pruebas en .NET

xUnit, NUnit y MSTest son los frameworks de pruebas unitarias. Moq y NSubstitute crean dobles de prueba. Se ejecutan con `dotnet test`.

## Trampas y respuestas desactualizadas

- **javax frente a jakarta.** Las respuestas oficiales de 2015 (`javax.persistence`) y 2018 (`javax.ejb`) eran correctas entonces. Desde Jakarta EE 9 (2020) son `jakarta.persistence` y `jakarta.ejb`. Si en una pregunta nueva aparecen ambas, elige la que encaje con la versión citada.
- **javax.sql y javax.naming no migran.** Son de Java SE, no de Jakarta EE. La respuesta de 2022 sigue valiendo.
- **Java DB (2017).** Era Apache Derby incluido en el JDK 6 a 8. Desde el JDK 9 ya no se distribuye.
- **Driver JDBC tipo 1.** El puente JDBC-ODBC se eliminó en Java 8. Sigue preguntándose como teoría.
- **JAX-WS y JAXB (2017, 2024).** Ya no vienen en el JDK desde Java 11. Siguen siendo la respuesta correcta como API.
- **ASP.NET Web Forms (2015-2017).** Directiva @Page, ciclo de vida, HtmlControls y modos de sesión son de .NET Framework. No existen en ASP.NET Core.
- **"Plataforma .NET".** Las preguntas antiguas hablan de ".NET Framework" (solo Windows). Hoy ".NET" es multiplataforma y abierto. Si dice "exclusivamente Windows", es falso para .NET moderno.
- **System.Data.SqlClient** está obsoleto. El paquete actual es `Microsoft.Data.SqlClient`.
- **Xamarin** terminó su soporte en mayo de 2024. La respuesta actual es .NET MAUI.
- **Visual Studio para Mac** se retiró en 2024.
- **CAS y GAC** son de .NET Framework. No existen en .NET moderno.
- **Log4j 1.x** está fuera de soporte. Log4j 2 sufrió Log4Shell en 2021.
- **Razor y @ (2024).** El distractor decía que @ pasa de C# a HTML. Es al revés: de HTML a C#.
- **"Razor es un lenguaje" (2024).** Falso. Es una sintaxis de plantillas; el lenguaje es C#.
- **POCO (2022).** Distractor: "podrá contener métodos, eventos y delegados". Microsoft dice que no debería.
- **JPQL, no JPSQL (2024).** Cambiar una letra de una sigla es un distractor clásico.
- **4 tipos de drivers JDBC, no 3 (2022).**
- **F# frente a C# (2018).** Ambos son multiparadigma. Se esperaba F#, el único de .NET entre opciones inventadas que no era C#. Si una pregunta nueva pone C# y F#, lee bien el enunciado (funcional = F#).
- **Spring Data no es un ORM** (2024): es una capa de repositorios sobre JPA. "JPA en .NET" o "Hibernate en .NET" son falsos.
- **Tomcat no es un servidor de aplicaciones Jakarta EE completo**: es un contenedor web.
- **Blazor Hybrid frente a MAUI (2022).** Blazor Hybrid usa componentes web dentro de una app nativa; el framework nativo es MAUI.
- **Nombres inventados**: Mockete, Ruby Hibernation, track4j, logTrack, G#, Cloos, AppServer, Page_PrePage, Operation (ADO.NET), String2Date, Trash busher.
- **async Task en C# (2025 b3 9), posible impugnación.** La plantilla provisional da "a) Thread int DevolverDato()", que no es una firma válida de C# ni usa `Task`/`async`. Lo esperable sería algo como `async Task<int> DevolverDato()`. Probablemente es una errata de transcripción del cuestionario ("Thread" por "Task<"); se mantiene la respuesta oficial, pero es candidata a reclamación.
- **Ensamblados (2025).** La opción correcta fue "solo se cargan en memoria si son necesarios": el CLR carga los ensamblados bajo demanda, no todos al arrancar.
- **LifecycleListener (2025 reserva).** Se registra en `server.xml` dentro de `<Server>` (elemento `<Listener>`), no en `web.xml`: no es un listener de Servlet.
- **Distractores cruzados entre lenguajes**: `import` (Java) frente a `using` (C#), `executeQuery` (JDBC) frente a `ExecuteReader` (ADO.NET), `mysqli_query` (PHP), `To_date` (Oracle SQL), `Console.Read` frente a `ReadLine`.
