# Tema 20. Cliente/servidor, multicapa y servicios web

Peso en el examen: unas 2,1 preguntas de test y 0,6 de supuesto III por convocatoria (2,8 puntos esperados). Hay 44 preguntas históricas entre 2005 y 2025 (35 de test y 9 de supuesto III). Se concentran en tres bloques. Primero, servicios web SOAP (estructura del mensaje, WSDL 1.1 y 2.0, WS-Security y la familia WS-\*). Segundo, REST y HTTP (principios, códigos de estado, idempotencia). Tercero, la arquitectura cliente/servidor clásica (modelos de Gartner, dos y tres capas, escalabilidad). Desde 2015 domina SOAP/REST; lo de cliente/servidor clásico es sobre todo de 2005-2008, aunque reapareció en 2024 con los sistemas distribuidos. Los códigos HTTP y los métodos también se estudian en el tema 21.

## Cómo lo preguntan

- **Elemento de una estructura**: qué elemento NO está en un mensaje SOAP 1.2 (2018: Title), qué hace `binding` en WSDL (2008, 2017), cómo se llaman las acciones en WSDL (2008: operaciones).
- **Patrón de mensaje WSDL**: cómo se llama la operación que recibe y no responde (2018: one-way).
- **Identificar la incorrecta o la que NO es de REST**: REST "usa UDDI" (2019), "no admite XML" (2018).
- **Siglas de la familia WS-\***: WS-Security para firmar SOAP (2007, 2024 b3), WS-SecureConversation (2022), WSIL (2022), SAML (2015).
- **Tecnología Java**: JAX-RS frente a JAX-WS (2016), Apache CXF como implementación JAX-WS o generador de clientes (2016, 2024 b3), Axis2 (2015), anotación `@WebMethod(operationName=...)` (2015 b3).
- **Códigos y métodos HTTP**: 200 (2018 b3), 201 Created (2025 b3), método idempotente pero no seguro (2025).
- **Definiciones de arquitectura**: modelos de Gartner (presentación distribuida 2005, presentación remota 2008), quién inicia la comunicación (2008), escalabilidad horizontal (2006), ventajas de tres capas (2015).
- **Traza de código en supuesto**: bucle de un servidor de sockets Java con `accept()` (2016 b3).

## Arquitectura cliente/servidor

### Concepto

La arquitectura cliente/servidor reparte una aplicación entre procesos que piden servicios (clientes) y procesos que los prestan (servidores). Es un modelo lógico: cliente y servidor pueden convivir en el mismo equipo **[Salió 2015]**.

Rasgos básicos:

- El **cliente inicia** siempre la comunicación con una petición; el servidor espera de forma pasiva **[Salió 2008]**.
- Al cliente se le llama **front-end** y al servidor **back-end** **[Salió 2016]**.
- Relación muchos a uno: muchos clientes, un servidor (o un grupo).
- Encapsulación: el cliente no sabe cómo implementa el servidor el servicio.
- Interfaz por mensajes, con protocolo pactado (HTTP, SQL sobre la red, RPC...).
- Independencia de plataforma entre cliente y servidor.

### Modos de comunicación

- **Síncrono (bloqueante)**: el cliente espera hasta que el servidor completa la petición.
- **Asíncrono (no bloqueante)**: el cliente sigue trabajando en cuanto el servidor acusa recibo de la petición; recogerá la respuesta después **[Salió 2005]**.
- Un *timeout* es solo un límite de espera; no define el modo asíncrono (distractor de 2005).

### Clientes finos y gruesos

| Tipo | Qué hace el cliente | Ejemplo |
|---|---|---|
| Cliente fino (thin) | Solo presentación; la lógica y los datos están en el servidor | Navegador con una aplicación web clásica |
| Cliente grueso (fat, rich) | Presentación y lógica de negocio; el servidor sirve datos | Aplicación de escritorio con acceso directo a la BD |
| Cliente inteligente o SPA | Presentación rica y parte de la lógica, datos por API | Angular, React consumiendo REST |

Cliente fino y servidor grueso puede implantarse en un único equipo: capas lógicas no implican máquinas distintas **[Salió 2015]**.

### Los cinco modelos de Gartner Group

Gartner clasifica el reparto de tres funciones (presentación, lógica y datos) entre cliente y servidor. Ha caído varias veces.

| Modelo | En el cliente | En el servidor |
|---|---|---|
| Presentación distribuida ("embellecimiento" o revamping) | Parte de la presentación | Parte de la presentación, toda la lógica y los datos |
| Presentación remota | Toda la presentación | Toda la lógica y los datos |
| Lógica (proceso) distribuida | Presentación y parte de la lógica | Parte de la lógica y los datos |
| Gestión remota de datos (acceso remoto a datos) | Presentación y toda la lógica | Solo los datos (SGBD) |
| Base de datos distribuida | Presentación, lógica y parte de los datos | Parte de los datos |

- **Presentación distribuida**: el cliente asume parte de la presentación, pero siguen existiendo programas en el servidor dedicados a ella **[Salió 2005]**. Es el típico "lavado de cara" de una aplicación de terminal.
- **Presentación remota**: la lógica primaria de la aplicación y la base de datos permanecen en el servidor **[Salió 2008]**.
- Truco: el nombre indica lo que se reparte o se aleja. "Distribuida" significa que esa función se parte entre ambos lados; "remota" significa que esa función está entera en el otro lado.

### Dos capas y tres capas

**Dos capas**: cliente con presentación y lógica, servidor con el SGBD. Variantes:

- **SQL remoto**: el cliente envía sentencias SQL y procesa los registros devueltos **[Salió 2006]**.
- **Procedimientos almacenados**: el cliente invoca procedimientos que se ejecutan en el SGBD; menos tráfico.

Problemas de dos capas: tráfico de red alto, lógica duplicada en cada cliente, despliegues costosos y mala escalabilidad.

**Tres capas** (modelo de 3 capas) **[Salió 2015]**:

1. **Presentación**: interfaz con el usuario (navegador, app móvil, HTML/JS).
2. **Lógica de negocio** (aplicación): reglas, validaciones, procesos; servidor de aplicaciones.
3. **Datos o persistencia**: SGBD y almacenamiento (Oracle, Informix, PostgreSQL) **[Salió 2006]**.

Ventajas: escalabilidad, separación de responsabilidades, se puede cambiar una capa sin tocar las demás, reutilización, seguridad (el cliente no ve la BD), mantenimiento centralizado. **[Salió 2008, 2015]**

Matices que caen:

- Las capas son **lógicas**: no exigen un servidor por capa (2008, 2015).
- Al actualizar una capa no hace falta recompilar las demás si la interfaz no cambia (2008).
- Tres capas no es lo mismo que **MVC**. MVC es un patrón de la capa de presentación; tres capas es una arquitectura del sistema completo.
- En inglés se distingue *layer* (capa lógica) de *tier* (nivel físico).

**N capas**: se añaden niveles (servidor web separado del de aplicaciones, capa de servicios, caché, integración). En la web típica: navegador, servidor web (Apache, Nginx), servidor de aplicaciones (Tomcat, WildFly, Kestrel), SGBD.

### Escalabilidad

- **Horizontal (scale out)**: añadir o quitar máquinas similares para aumentar capacidad; requiere balanceo de carga **[Salió 2006]**.
- **Vertical (scale up)**: migrar a un servidor mayor o ampliar CPU y memoria del existente.
- La horizontal casa con servicios sin estado (stateless), como REST: cualquier nodo atiende cualquier petición.

### Middleware

Software que hace de "pegamento" entre cliente y servidor y oculta la red.

| Tipo | Ejemplos |
|---|---|
| Acceso a datos | ODBC, JDBC, ADO.NET |
| Llamadas a procedimiento remoto | RPC de Sun (ONC RPC), gRPC, Java RMI |
| Objetos distribuidos | CORBA (OMG, IDL, ORB, IIOP), DCOM de Microsoft, EJB remotos |
| Orientado a mensajes (MOM) | JMS, IBM MQ, RabbitMQ (AMQP), MQTT, Apache Kafka |
| Monitores de transacciones | CICS, Tuxedo |
| Servicios web | SOAP, REST |

DCOM y CORBA son middleware de objetos, no de capa de datos (distractor de 2006).

## Sistemas distribuidos y arquitecturas orientadas a servicios

### Sistemas distribuidos

Un sistema distribuido es un conjunto de ordenadores independientes que el usuario percibe como un único sistema coherente (Tanenbaum).

Características **[Salió 2024]**:

- **Escalabilidad**: la capacidad crece al añadir máquinas (respuesta correcta en 2024).
- **Transparencia**: oculta la distribución. Tipos (RM-ODP): acceso, ubicación, migración, reubicación, replicación, concurrencia, fallos y persistencia.
- **Concurrencia**: varios nodos procesan a la vez, incluso la misma función.
- **Apertura**: interfaces y protocolos estándar.
- **Tolerancia a fallos**: el fallo de un nodo no tumba el sistema.
- Sin reloj global; comunicación por paso de mensajes.

En 2024 los distractores negaban justo estas propiedades ("falta de transparencia", "varias máquinas no pueden procesar la misma función").

**Teorema CAP** (Brewer): ante una partición de red, un sistema distribuido solo garantiza dos de tres: consistencia, disponibilidad y tolerancia a particiones.

### SOA

**SOA (Service Oriented Architecture)** es un modelo orientado a la reutilización de servicios en entornos distribuidos **[Salió 2016]**. Principios:

- Servicios **débilmente acoplados** (no "fuertemente", distractor de 2016).
- Contrato formal independiente de la plataforma (WSDL, en XML; no en Java).
- Reutilización, composición, abstracción, autonomía, descubrimiento y ausencia de estado.
- Se suele implementar con servicios web SOAP y un **ESB** (bus de servicios empresarial).

**Orquestación frente a coreografía**:

- Orquestación: un proceso central controla la invocación de los servicios. Lenguaje: **WS-BPEL** **[Salió 2008]**.
- Coreografía: cada servicio sabe cuándo actuar; no hay coordinador (WS-CDL del W3C, hoy eventos).

**BPEL** (Business Process Execution Language, WS-BPEL 2.0 de OASIS, 2007): lenguaje XML para el control centralizado de la invocación de servicios web. BPMN es la notación gráfica de procesos (OMG); BPEL es ejecutable.

### Microservicios y otras arquitecturas actuales

- **Microservicios**: servicios pequeños, desplegables por separado, cada uno con su propia base de datos, comunicación ligera (REST, gRPC, mensajería).
- Piezas habituales: API Gateway, descubrimiento de servicios, circuit breaker, configuración centralizada, contenedores (Docker) y orquestación (Kubernetes).
- **Monolito**: una sola unidad desplegable. **Monolito modular**: un despliegue, módulos bien separados.
- **Arquitectura orientada a eventos (EDA)**: productores publican eventos en un broker (Kafka); consumidores reaccionan.
- **Serverless o FaaS**: funciones ejecutadas bajo demanda (AWS Lambda, Azure Functions).
- **BFF (Backend for Frontend)**: una API adaptada a cada tipo de cliente.
- **Arquitectura hexagonal** (puertos y adaptadores) y **limpia**: el dominio no depende de la infraestructura.

### Sockets: el cliente/servidor más básico

En el supuesto de 2016 apareció un servidor Java con sockets **[Salió 2016 b3]**. Patrón correcto: bucle infinito, `accept()` bloqueante y un objeto (o hilo) por conexión.

```java
ServerSocket servidor = new ServerSocket(5000);
while (true) {
    Socket conexion = servidor.accept();      // bloquea hasta que llega un cliente
    new Conecta(directorio, conexion);        // atiende la conexión (normalmente en un hilo)
}
```

```java
// Cliente
try (Socket s = new Socket("localhost", 5000);
     PrintWriter out = new PrintWriter(s.getOutputStream(), true);
     BufferedReader in = new BufferedReader(new InputStreamReader(s.getInputStream()))) {
    out.println("HOLA");
    System.out.println(in.readLine());
}
```

Errores típicos en las opciones: falta `new`, método mal escrito (`acept`), un solo `accept()` sin bucle.

## Servicios web: conceptos y pila de estándares

### Qué es un servicio web

Según el W3C, un servicio web es un sistema software para la interacción máquina a máquina en red. Tiene una interfaz descrita en formato procesable (WSDL) y se usa con mensajes SOAP sobre HTTP con serialización XML.

- El paradigma se basa en el **intercambio de mensajes XML** **[Salió 2007]**.
- Hoy "servicio web" incluye también las API REST con JSON.
- Ventajas: interoperabilidad entre plataformas y lenguajes, uso de HTTP (atraviesa cortafuegos), estándares abiertos.

### La pila clásica SOAP

| Función | Estándar | Organismo |
|---|---|---|
| Mensajería | SOAP 1.1 (nota 2000), SOAP 1.2 (recomendación 2003, 2.ª ed. 2007) | W3C |
| Descripción | WSDL 1.1 (nota 2001), WSDL 2.0 (recomendación 2007) | W3C |
| Descubrimiento | UDDI 3.0 | OASIS |
| Inspección descentralizada | WSIL | IBM y Microsoft |
| Datos | XML, XML Schema (XSD), Namespaces | W3C |
| Transporte | HTTP, HTTPS, SMTP, JMS | IETF y otros |
| Interoperabilidad | WS-I Basic Profile | WS-I (integrada en OASIS desde 2010) |

Triángulo SOA clásico: el **proveedor** publica la descripción en el **registro** (UDDI); el **consumidor** busca en el registro y luego invoca al proveedor.

## SOAP

### Definición

SOAP es un protocolo basado en XML para intercambiar mensajes entre aplicaciones en entornos distribuidos **[Salió 2005, 2008]**.

- Es una **recomendación del W3C** (no ISO, ni UNE, ni ANSI) **[Salió 2015]**.
- Especifica el **formato del mensaje**; no define el transporte **[Salió 2008]**.
- Es **independiente del transporte**: suele ir sobre HTTP, pero puede ir sobre SMTP, JMS o TCP (falso que "dependa del transporte", 2005).
- Es independiente de plataforma, sistema operativo y lenguaje.
- Basado en XML, no en HTML (distractor de 2008).
- Originalmente "Simple Object Access Protocol"; desde SOAP 1.2 el nombre ya no se considera acrónimo.

### Estructura del mensaje SOAP 1.2

**[Salió 2018]**: los elementos del esqueleto son Envelope, Header y Body; Title NO existe.

| Elemento | Obligatorio | Función |
|---|---|---|
| Envelope | Sí | Raíz; identifica el documento como mensaje SOAP y fija la versión por el espacio de nombres |
| Header | No | Información auxiliar procesable por intermediarios: seguridad, direccionamiento, transacciones |
| Body | Sí | Carga útil: la petición, la respuesta o un Fault |
| Fault | No (dentro de Body) | Información de error |

```xml
<?xml version="1.0" encoding="UTF-8"?>
<env:Envelope xmlns:env="http://www.w3.org/2003/05/soap-envelope">
  <env:Header>
    <wsse:Security xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd"
                   env:mustUnderstand="true">
      <!-- firma, token, marca de tiempo -->
    </wsse:Security>
  </env:Header>
  <env:Body>
    <m:consultarReservas xmlns:m="http://ejemplo.gob.es/reservas">
      <m:cif>Q2826000H</m:cif>
      <m:mes>2026-05</m:mes>
    </m:consultarReservas>
  </env:Body>
</env:Envelope>
```

### Diferencias entre SOAP 1.1 y 1.2

| Aspecto | SOAP 1.1 | SOAP 1.2 |
|---|---|---|
| Espacio de nombres | http://schemas.xmlsoap.org/soap/envelope/ | http://www.w3.org/2003/05/soap-envelope |
| Content-Type | text/xml | application/soap+xml |
| Acción | Cabecera HTTP SOAPAction | Parámetro action del Content-Type |
| Atributos de Header | actor, mustUnderstand | role, mustUnderstand, relay |
| Fault | faultcode, faultstring, faultactor, detail | Code (Value, Subcode), Reason (Text), Node, Role, Detail |
| Códigos de fallo | VersionMismatch, MustUnderstand, Client, Server | VersionMismatch, MustUnderstand, DataEncodingUnknown, Sender, Receiver |
| Estado | Nota W3C | Recomendación W3C |

- `mustUnderstand="true"`: si el receptor no entiende ese bloque de cabecera, debe devolver un Fault MustUnderstand.
- En SOAP 1.2 sobre HTTP, un Fault viaja normalmente con código HTTP 500 (o 400 si la culpa es del emisor).

### Estilos de mensaje

- **RPC/encoded, RPC/literal, document/literal, document/literal wrapped**.
- WS-I Basic Profile prohíbe *encoded*. Lo habitual es **document/literal wrapped**.
- Adjuntos binarios: SwA (SOAP with Attachments) y **MTOM/XOP** (W3C), que evita codificar en Base64 dentro del XML.

## WSDL

### Para qué sirve

WSDL (Web Services Description Language) es un lenguaje XML que describe la interfaz pública de un servicio web: qué operaciones ofrece, con qué mensajes, por qué protocolo y en qué dirección. Lo genera o consume la herramienta para crear stubs y clientes.

### Elementos de WSDL 1.1

| Elemento | Qué describe |
|---|---|
| definitions | Raíz |
| types | Contenedor de definiciones de tipos (normalmente XSD) |
| message | Datos de un mensaje, dividido en part |
| portType | Interfaz abstracta: conjunto de operaciones |
| operation | Acción soportada por el servicio **[Salió 2008]** |
| binding | Protocolo concreto y formato de datos para un portType **[Salió 2008]** |
| port | Un binding más una dirección de red |
| service | Conjunto de ports |

Parte abstracta: types, message, portType, operation. Parte concreta: binding, port, service.

### Tipos de operación en WSDL 1.1

| Operación | Secuencia | Quién empieza |
|---|---|---|
| One-way | Solo entrada; el servicio recibe y no responde **[Salió 2018]** | Cliente |
| Request-response | Entrada y salida | Cliente |
| Solicit-response | Salida y entrada | Servicio |
| Notification | Solo salida | Servicio |

Distractores de 2018: "Notification" (es al revés: el servicio envía sin recibir), "Request-no response" y "Petition-no response" (no existen).

### WSDL 2.0

Recomendación W3C de junio de 2007. Definición que dio por buena la plantilla de 2025: lenguaje XML para describir servicios web a partir de un modelo abstracto de lo que ofrece el servicio **[Salió 2025]**. Cambios frente a 1.1 que hay que saber:

| WSDL 1.1 | WSDL 2.0 |
|---|---|
| definitions | description |
| portType | interface |
| port | endpoint |
| message (con part) | Desaparece; los mensajes se definen con XSD en types |
| Herencia de interfaces no prevista | interface puede extender otras (atributo extends) |
| Fault dentro de cada operación | interface/fault reutilizable |
| Bindings SOAP 1.1, HTTP GET/POST, MIME | Bindings SOAP 1.2 y HTTP completo (cualquier verbo), apto para REST |

Elementos principales de WSDL 2.0: **description, types, interface (con operation y fault), binding, service (con endpoint)**. También documentation, import e include.

- **binding** especifica los **protocolos de comunicación** (formato de mensaje y transporte) para una interface **[Salió 2017]**. Los puertos y direcciones van en endpoint; los tipos en types; las operaciones en interface.
- **Patrones de intercambio (MEP)** definidos en la parte 2: **in-only**, **robust-in-only** e **in-out**. Una nota posterior añade in-optional-out, out-only, robust-out-only, out-in y out-optional-in.
- in-only equivale al one-way de 1.1; in-out al request-response.
- En WSDL 2.0 una operación se asocia a un patrón con el atributo `pattern` (por ejemplo http://www.w3.org/ns/wsdl/in-out).

```xml
<description xmlns="http://www.w3.org/ns/wsdl"
             targetNamespace="http://ejemplo.gob.es/reservas"
             xmlns:tns="http://ejemplo.gob.es/reservas">
  <types> <!-- esquemas XSD de los mensajes --> </types>
  <interface name="ReservasInterface">
    <operation name="consultarReservas" pattern="http://www.w3.org/ns/wsdl/in-out">
      <input element="tns:consultarReservas"/>
      <output element="tns:consultarReservasResponse"/>
    </operation>
  </interface>
  <binding name="ReservasSOAP" interface="tns:ReservasInterface"
           type="http://www.w3.org/ns/wsdl/soap"
           xmlns:wsoap="http://www.w3.org/ns/wsdl/soap"
           wsoap:protocol="http://www.w3.org/2003/05/soap/bindings/HTTP/"/>
  <service name="ReservasService" interface="tns:ReservasInterface">
    <endpoint name="ReservasEndpoint" binding="tns:ReservasSOAP"
              address="https://servicios.ejemplo.gob.es/reservas"/>
  </service>
</description>
```

En la práctica casi todas las herramientas (JAX-WS, .NET) siguen usando WSDL 1.1. WSDL 2.0 es lo que pregunta el examen.

## Descubrimiento: UDDI y WSIL

### UDDI

UDDI (Universal Description, Discovery and Integration) es un registro para publicar y encontrar servicios web. Versión 3.0.2, estándar OASIS.

- Páginas **blancas**: datos de la empresa (nombre, contacto).
- Páginas **amarillas**: clasificación por categorías (sector, producto).
- Páginas **verdes**: información técnica de los servicios (cómo invocarlos).
- Estructuras de datos: businessEntity, businessService, bindingTemplate y tModel.
- Los registros públicos (UBR de IBM, Microsoft y SAP) cerraron en 2006; UDDI queda en registros privados.
- UDDI es de SOAP, no de REST (respuesta de 2019).

### WSIL

WSIL o WS-Inspection (Web Services Inspection Language, IBM y Microsoft, 2001) define un modo de publicar y encontrar información sobre servicios web **[Salió 2022]**.

- Es **descentralizado**: cada sitio publica un documento `inspection.wsil` con enlaces a sus WSDL o entradas UDDI.
- Complementa a UDDI; no es una alternativa al descubrimiento en sí ni una organización.
- Distractores de 2022: "modelo de programación en Java EE" (eso es JSR 109, Web Services for Java EE) y "organización para la interoperabilidad" (eso es WS-I).

## Seguridad y especificaciones WS-\*

### Seguridad en transporte frente a seguridad en mensaje

- **Transporte**: TLS (HTTPS), opcionalmente con certificado de cliente (TLS mutuo). Protege punto a punto, no extremo a extremo si hay intermediarios.
- **Mensaje**: firma y cifrado dentro del propio XML SOAP. Protege extremo a extremo y permite firmar solo partes. Es lo que exige la AGE en SCSP o GEISER.

### WS-Security

**WS-Security (WSS, OASIS 2004; versión 1.1 en 2006, 1.1.1 en 2012)** define cómo garantizar la integridad y confidencialidad de los mensajes SOAP **[Salió 2007, 2024 b3]**.

- Añade un bloque `wsse:Security` en el Header.
- Integridad con **XML Signature** (XMLDSig, W3C) y confidencialidad con **XML Encryption** (W3C).
- Transporta **tokens de seguridad**: UsernameToken, BinarySecurityToken (certificado X.509), tokens SAML, Kerberos.
- Incluye marca de tiempo (`wsu:Timestamp`) contra ataques de repetición.
- Para firmar las peticiones SOAP a GEISER se usa WS-Security con certificado X.509 **[Salió 2024 b3]**. SAML es un token de identidad, JWT es de REST y XML-Encryption cifra pero no firma.
- Distractores de 2007: Kerberos y TLS son mecanismos, no la especificación de mensajería; BinarySecurityToken es un elemento de WS-Security.

### Resto de la familia WS-\*

| Especificación | Organismo | Para qué |
|---|---|---|
| WS-SecureConversation | OASIS | Establecer y compartir contextos de seguridad y derivar claves de sesión **[Salió 2022]** |
| WS-Trust | OASIS | Emitir, renovar y validar tokens; servicio STS |
| WS-SecurityPolicy | OASIS | Expresar requisitos de seguridad como políticas |
| WS-Policy | W3C | Marco para describir políticas y capacidades de un servicio |
| WS-Federation | OASIS | Federar identidades entre dominios de confianza |
| WS-Addressing | W3C | Direccionamiento en el mensaje (To, ReplyTo, MessageID, Action) |
| WS-ReliableMessaging | OASIS | Entrega fiable y ordenada de mensajes |
| WS-AtomicTransaction, WS-Coordination, WS-BusinessActivity | OASIS (WS-TX) | Transacciones distribuidas |
| WS-BPEL | OASIS | Orquestación de servicios |
| WS-I Basic Profile | WS-I, hoy OASIS | Reglas de interoperabilidad |
| MTOM | W3C | Envío eficiente de binarios |

### SAML y XACML

- **SAML** (Security Assertion Markup Language, OASIS, versión 2.0 de 2005): XML para intercambiar aserciones de autenticación y autorización. Es un estándar de seguridad aplicable a servicios web **[Salió 2015]**. Lo usa Cl@ve.
- **XACML** (OASIS): lenguaje de políticas de control de acceso.
- WSDL, SOAP y UDDI no son estándares de seguridad (distractores de 2015).

### Servicios SOAP en la AGE

- **SCSP** (Sustitución de Certificados en Soporte Papel) y la Plataforma de Intermediación de Datos: SOAP con WS-Security y certificado X.509.
- **GEISER/SIR**: servicios SOAP para el intercambio de registros (SICRES 3.0/4.0).
- **@firma**: servicios web SOAP de validación y firma (incluye perfiles OASIS DSS).
- La Red SARA conecta a las administraciones para estos servicios.

## REST

### Principios

REST (REpresentational State Transfer) es un **estilo de arquitectura**, no un protocolo ni un estándar. Lo definió Roy Fielding en su tesis doctoral de 2000.

Restricciones de Fielding:

1. **Cliente-servidor**: separación de responsabilidades.
2. **Sin estado (stateless)**: cada petición lleva toda la información necesaria; el servidor no guarda estado del cliente entre peticiones **[Salió 2019, 2024]**.
3. **Cacheable**: las respuestas indican si se pueden guardar en caché.
4. **Interfaz uniforme**: identificación de recursos por URI, manipulación mediante representaciones, mensajes autodescriptivos y **HATEOAS** (hipermedia como motor del estado).
5. **Sistema en capas**: puede haber proxies, pasarelas y cachés intermedios.
6. **Código bajo demanda** (opcional): el servidor puede enviar código ejecutable (JavaScript).

Ideas clave:

- **Orientado a recursos**: todo es un recurso con su URI (sustantivos, no verbos) **[Salió 2018, 2024]**.
- Usa **HTTP** y sus métodos de forma explícita **[Salió 2018, 2019]**. No FTP (distractor de 2024).
- Usa los códigos de estado nativos de HTTP (200, 204, 404, 409...) **[Salió 2018]**.
- Admite cualquier formato: JSON, **XML**, HTML, texto, CSV **[Salió 2018, 2019]**.
- No usa WSDL ni UDDI para describirse o descubrirse **[Salió 2019]**.

### Diseño de URI

```text
GET    /api/v1/becas                    lista (filtros con ?anio=2026&estado=abierta)
GET    /api/v1/becas/42                 un recurso
POST   /api/v1/becas                    crea; responde 201 + Location: /api/v1/becas/43
PUT    /api/v1/becas/42                 reemplaza completo (o crea con id conocido)
PATCH  /api/v1/becas/42                 modificación parcial
DELETE /api/v1/becas/42                 borra; responde 204
GET    /api/v1/becas/42/solicitudes     subrecurso
```

Buenas prácticas: sustantivos en plural, jerarquía con `/`, minúsculas, versionado en URI o cabecera, paginación con parámetros, filtros en la query string.

### Modelo de madurez de Richardson

| Nivel | Qué tiene |
|---|---|
| 0 | Un único endpoint y un único método (POX, "SOAP disfrazado") |
| 1 | Recursos con URI propias |
| 2 | Verbos HTTP y códigos de estado correctos |
| 3 | Controles hipermedia (HATEOAS): las respuestas incluyen enlaces |

### Métodos HTTP: seguros e idempotentes

Fuente: RFC 9110 (HTTP Semantics, 2022) y RFC 5789 (PATCH).

- **Seguro**: no modifica el estado del servidor (solo lectura).
- **Idempotente**: repetir la petición N veces deja el servidor igual que hacerla una vez. Todo método seguro es idempotente.

| Método | Seguro | Idempotente | Uso en REST |
|---|---|---|---|
| GET | Sí | Sí | Obtener representación |
| HEAD | Sí | Sí | Como GET pero sin cuerpo (solo cabeceras) |
| OPTIONS | Sí | Sí | Métodos admitidos; preflight de CORS |
| TRACE | Sí | Sí | Eco de la petición (diagnóstico) |
| PUT | No | Sí | Crear o reemplazar en una URI conocida |
| DELETE | No | Sí | Borrar |
| POST | No | No | Crear en una colección, acciones |
| PATCH | No | No (en general) | Modificación parcial |
| CONNECT | No | No | Túnel (proxies HTTPS) |

**Idempotentes pero no seguros: PUT y DELETE** **[Salió 2025]**. POST y PATCH no son idempotentes. Un DELETE repetido puede dar 404 la segunda vez, pero el estado del servidor no cambia: sigue siendo idempotente.

### Códigos de estado HTTP

| Código | Nombre | Uso típico en REST |
|---|---|---|
| 100 | Continue | El cliente puede enviar el cuerpo |
| 101 | Switching Protocols | Paso a WebSocket |
| 200 | OK | Petición completada correctamente **[Salió 2018 b3]** |
| 201 | Created | Recurso creado (POST o PUT); cabecera Location **[Salió 2025 b3]** |
| 202 | Accepted | Aceptada para proceso asíncrono, aún sin terminar |
| 204 | No Content | Éxito sin cuerpo (DELETE, PUT) |
| 206 | Partial Content | Respuesta a petición con Range |
| 301 | Moved Permanently | Redirección permanente |
| 302 | Found | Redirección temporal |
| 303 | See Other | Ver otro recurso con GET (tras un POST) |
| 304 | Not Modified | Caché válida (If-None-Match, If-Modified-Since) |
| 307 / 308 | Temporary / Permanent Redirect | Como 302/301 pero sin cambiar el método |
| 400 | Bad Request | Sintaxis incorrecta o petición inválida |
| 401 | Unauthorized | Falta autenticación o es inválida (WWW-Authenticate) |
| 403 | Forbidden | Autenticado pero sin permiso |
| 404 | Not Found | Recurso no encontrado |
| 405 | Method Not Allowed | Método no admitido para ese recurso (cabecera Allow) |
| 406 | Not Acceptable | No hay representación según Accept |
| 409 | Conflict | Conflicto con el estado del recurso (duplicado, versión) |
| 410 | Gone | Eliminado de forma permanente |
| 412 | Precondition Failed | Falla If-Match (control de concurrencia optimista) |
| 415 | Unsupported Media Type | Content-Type no admitido |
| 422 | Unprocessable Content | Sintaxis correcta pero validación semántica fallida |
| 429 | Too Many Requests | Límite de peticiones superado (RFC 6585) |
| 500 | Internal Server Error | Error genérico del servidor |
| 501 | Not Implemented | Método no implementado en el servidor |
| 502 | Bad Gateway | Respuesta inválida del servidor de origen |
| 503 | Service Unavailable | Sobrecarga o mantenimiento (Retry-After) |
| 504 | Gateway Timeout | El origen no respondió a tiempo |

Clases: 1xx informativos, 2xx éxito, 3xx redirección, 4xx error del cliente, 5xx error del servidor.

### Cabeceras útiles en API

- **Content-Type**: formato del cuerpo enviado (`application/json`).
- **Accept**: formato que desea el cliente (negociación de contenido).
- **Authorization**: credenciales (`Bearer <token>`, `Basic`).
- **Location**: URI del recurso creado (con 201) o destino de redirección.
- **ETag** con **If-None-Match** (caché) e **If-Match** (concurrencia).
- **Cache-Control**, **Allow**, **Retry-After**.

### Versiones de HTTP

| Versión | RFC vigente | Rasgo |
|---|---|---|
| HTTP/1.1 | RFC 9112 (semántica común en RFC 9110) | Texto, conexiones persistentes |
| HTTP/2 | RFC 9113 | Binario, multiplexación, compresión de cabeceras HPACK |
| HTTP/3 | RFC 9114 | Sobre QUIC (RFC 9000), es decir, UDP; QPACK |

### Seguridad en REST

- **TLS** obligatorio (HTTPS).
- **OAuth 2.0** (RFC 6749) para autorización delegada; tokens Bearer (RFC 6750). OAuth 2.1 consolida buenas prácticas (PKCE obligatorio) y sigue en borrador.
- **OpenID Connect**: capa de identidad sobre OAuth 2.0.
- **JWT** (RFC 7519): token compacto firmado (JWS, RFC 7515) o cifrado (JWE, RFC 7516). Tres partes en Base64url: cabecera, carga y firma.
- **API keys** y **TLS mutuo** para máquina a máquina.
- **CORS**: el servidor autoriza orígenes cruzados con `Access-Control-Allow-Origin`.
- Para SOAP se firma con WS-Security; para REST se usa JWT u OAuth (2024 b3).

### SOAP frente a REST

| Aspecto | SOAP | REST |
|---|---|---|
| Naturaleza | Protocolo (W3C) | Estilo de arquitectura |
| Formato | Solo XML (sobre SOAP) | JSON, XML, HTML, texto... |
| Transporte | HTTP, SMTP, JMS... | HTTP |
| Contrato | WSDL | OpenAPI, RAML (opcional) |
| Orientación | Operaciones | Recursos |
| Estado | Puede mantener estado (WS-*) | Sin estado |
| Seguridad | WS-Security a nivel de mensaje | TLS, OAuth, JWT |
| Errores | SOAP Fault | Códigos HTTP |
| Caché | No usa la caché de HTTP | Aprovecha la caché HTTP |
| Uso | Integraciones formales, AGE (SCSP, GEISER) | API web y móviles, microservicios |

## Documentación y descripción de API

Opciones válidas para documentar servicios **[Salió 2024 b3]**:

- **WSDL**: servicios SOAP.
- **OpenAPI** (antes Swagger): estándar de facto para REST. OpenAPI 2.0 equivale a Swagger 2.0; la 3.0 es de 2017, la 3.1 de 2021 (alineada con JSON Schema) y la 3.2 de septiembre de 2025. Lo mantiene la OpenAPI Initiative (Linux Foundation). Se escribe en YAML o JSON.
- **Swagger**: hoy es el conjunto de herramientas de SmartBear (Swagger UI, Swagger Editor, Swagger Codegen).
- **RAML** (RESTful API Modeling Language): YAML, de MuleSoft.
- **API Blueprint**: Markdown.
- **WADL**: XML para REST, propuesta de Sun (2009) al W3C; poco usado.
- **AsyncAPI**: API asíncronas y orientadas a eventos (Kafka, MQTT).
- **REST no es un lenguaje de documentación**: es la respuesta NO válida en 2024.

```yaml
openapi: 3.1.0
info:
  title: API de becas
  version: 1.0.0
paths:
  /becas/{id}:
    get:
      summary: Obtiene una beca
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: integer
      responses:
        '200':
          description: Beca encontrada
        '404':
          description: No existe
```

## Implementación en Java y .NET

### JAX-WS (SOAP)

- **JAX-WS** (Java API for XML Web Services, JSR 224) es la API para servicios SOAP. Hoy se llama **Jakarta XML Web Services** (paquetes `jakarta.jws` y `jakarta.xml.ws`).
- Sustituyó a **JAX-RPC** (Java API for XML-based RPC), la API anterior para invocar servicios descritos con WSDL.
- **JAXR**: API para acceder a registros XML (UDDI, ebXML). **JAXB**: enlace entre XML y objetos Java.
- JAX-WS y JAXB salieron del JDK en Java 11 (JEP 320); hoy se añaden como dependencias.
- Implementaciones: **Metro** (referencia), **Apache CXF** **[Salió 2016]**, **Apache Axis2** (soporta también JAX-WS), JBossWS.
- Herramientas: **wsimport** genera el cliente (stubs) a partir de un WSDL; **wsgen** genera artefactos desde una clase. En CXF, **wsdl2java**. Por eso Apache CXF es la tecnología para generar un cliente en 2024 b3.
- Distractores de 2024: Apache Flink (procesamiento de flujos), Apache Xalan (XSLT) y Apache Xerces (parser XML).

Anotaciones **[Salió 2015 b3]**:

| Anotación | Uso |
|---|---|
| @WebService | Marca la clase o interfaz como servicio web (name, serviceName, targetNamespace) |
| @WebMethod | Publica un método como operación; operationName cambia su nombre; exclude=true lo oculta |
| @WebParam | Nombre del parámetro en el mensaje |
| @WebResult | Nombre del resultado |
| @Oneway | Operación de solo ida (sin respuesta) |
| @SOAPBinding | Estilo (DOCUMENT o RPC) y uso (LITERAL) |

```java
import jakarta.jws.WebMethod;
import jakarta.jws.WebParam;
import jakarta.jws.WebService;

@WebService(serviceName = "ReservasService")
public class ReservasWS {

    @WebMethod(operationName = "consultarReservas")
    public List<Reserva> buscar(@WebParam(name = "cif") String cif,
                                @WebParam(name = "mes") int mes) {
        return dao.buscarPorCifYMes(cif, mes);
    }
}
```

```bash
wsimport -keep -p es.gob.cliente https://servicios.ejemplo.gob.es/reservas?wsdl
```

### Axis2

Apache **Axis2** es un motor nuclear (core engine) de servicios web: framework para crear y consumir servicios SOAP y REST, sucesor de Axis 1 **[Salió 2015]**. No es base de datos, ni buscador, ni herramienta de compilación (eso sería Ant o Maven).

### JAX-RS (REST)

- **JAX-RS** = Java API for RESTful Web Services: soporte a la creación de servicios REST **[Salió 2016]**. Hoy **Jakarta RESTful Web Services** (versión 3.1 en Jakarta EE 10, 4.0 en Jakarta EE 11).
- Implementaciones: **Jersey** (referencia), RESTEasy (Red Hat), Apache CXF.
- Jersey es de JAX-RS, no de JAX-WS (distractor de 2016).

| Anotación | Uso |
|---|---|
| @Path | URI relativa del recurso o método |
| @GET, @POST, @PUT, @DELETE, @PATCH, @HEAD, @OPTIONS | Método HTTP |
| @Produces | Tipos MIME que devuelve |
| @Consumes | Tipos MIME que acepta |
| @PathParam | Parámetro de la ruta (/becas/{id}) |
| @QueryParam | Parámetro de la query string |
| @FormParam, @HeaderParam, @CookieParam, @MatrixParam | Otros orígenes de datos |
| @DefaultValue, @BeanParam, @Context | Valor por defecto, agrupar parámetros, inyectar contexto |
| @ApplicationPath | Raíz de la aplicación (sobre una subclase de Application) |

```java
@Path("/becas")
@Produces(MediaType.APPLICATION_JSON)
public class BecaResource {

    @GET
    @Path("/{id}")
    public Response obtener(@PathParam("id") long id) {
        Beca b = servicio.buscar(id);
        return b == null ? Response.status(404).build() : Response.ok(b).build();
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public Response crear(Beca beca, @Context UriInfo uri) {
        Beca nueva = servicio.crear(beca);
        URI location = uri.getAbsolutePathBuilder().path(String.valueOf(nueva.getId())).build();
        return Response.created(location).entity(nueva).build();   // 201 + Location
    }
}
```

Cliente JAX-RS (desde 2.0):

```java
Beca b = ClientBuilder.newClient()
        .target("https://api.ejemplo.gob.es/becas/42")
        .request(MediaType.APPLICATION_JSON)
        .get(Beca.class);
```

### Spring

- REST: `@RestController`, `@RequestMapping`, `@GetMapping`, `@PostMapping`, `@PutMapping`, `@DeleteMapping`, `@PatchMapping`, `@PathVariable`, `@RequestParam`, `@RequestBody`, `ResponseEntity`.
- Clientes: `RestTemplate` (en mantenimiento), `WebClient` (reactivo), `RestClient` (Spring 6.1) y clientes declarativos con `@HttpExchange`.
- Documentación: **springdoc-openapi** genera OpenAPI y Swagger UI.
- SOAP: **Spring Web Services**, enfoque contract-first (primero el XSD/WSDL).

```java
@RestController
@RequestMapping("/api/becas")
public class BecaController {
    @PostMapping
    public ResponseEntity<Beca> crear(@RequestBody Beca b) {
        Beca n = servicio.crear(b);
        return ResponseEntity.created(URI.create("/api/becas/" + n.getId())).body(n);  // 201
    }
}
```

### .NET

- REST: **ASP.NET Core Web API** con controladores (`[ApiController]`, `[HttpGet]`, `[Route]`) o **Minimal APIs** (`app.MapGet`). Devuelve `CreatedAtAction` (201), `NoContent` (204), `NotFound` (404).
- SOAP: **WCF** en .NET Framework (legado); en .NET moderno, cliente con **dotnet-svcutil** o "Connected Services" y servidor con **CoreWCF**. ASMX (.asmx) es la tecnología antigua.
- Documentación: Swashbuckle o NSwag; desde .NET 9, `Microsoft.AspNetCore.OpenApi` genera OpenAPI de forma nativa.

```csharp
[ApiController]
[Route("api/[controller]")]
public class BecasController : ControllerBase
{
    [HttpGet("{id}")]
    public ActionResult<Beca> Get(int id) =>
        _repo.Find(id) is Beca b ? Ok(b) : NotFound();

    [HttpPost]
    public ActionResult<Beca> Post(Beca b)
    {
        _repo.Add(b);
        return CreatedAtAction(nameof(Get), new { id = b.Id }, b);   // 201
    }
}
```

## Otros protocolos y estándares de integración

| Tecnología | Qué es |
|---|---|
| XML-RPC | Predecesor de SOAP: llamadas remotas en XML sobre HTTP |
| JSON-RPC 2.0 | Llamadas remotas con JSON; ligero, sin estándar formal de organismo |
| gRPC | RPC de Google sobre HTTP/2 con Protocol Buffers; streaming bidireccional |
| GraphQL | Lenguaje de consulta de API (Meta, hoy GraphQL Foundation); un endpoint, el cliente pide los campos |
| OData v4 | Protocolo REST de consulta (OASIS, ISO/IEC 20802); filtros con $filter, $select, $top |
| WebSocket | Canal bidireccional persistente (RFC 6455), arranca con HTTP 101 |
| Server-Sent Events | Envío unidireccional servidor a cliente sobre HTTP |
| Webhooks | El servidor llama por HTTP a una URL del cliente cuando ocurre un evento |
| AMQP, MQTT | Mensajería asíncrona (MQTT para IoT) |
| JSON | Formato de datos (RFC 8259, ECMA-404) |
| JSON Schema | Validación de JSON; base de los esquemas de OpenAPI 3.1 |

## Trampas y respuestas desactualizadas

- **SOAP no es acrónimo desde 1.2.** Las preguntas antiguas (2005, 2015) lo expanden como Simple Object Access Protocol. Si sale, acepta la expansión.
- **SOAP 1.2 no tiene Title** (2018). Tampoco "Message" ni "Footer". Fault no es hijo de Envelope sino de Body.
- **WSDL 1.1 frente a 2.0.** portType, port y message son de 1.1; en 2.0 son interface, endpoint y desaparece message. Si la pregunta dice "WSDL 2.0" (2017, 2025), usa la terminología nueva. Los tipos de operación one-way y notification son de 1.1; en 2.0 se habla de MEP (in-only, in-out...).
- **Binding** no son "operaciones" ni "tipos": es el protocolo y formato concreto (2008, 2017).
- **REST no es un protocolo ni un formato de documentación.** En 2024 b3, REST era la opción NO válida para documentar.
- **REST admite XML** (2018) y no usa UDDI ni WSDL (2019). No usa FTP (2024).
- **SOA es débilmente acoplada** y su contrato no se escribe en Java ni se implementa con HTML5 (2016).
- **401 frente a 403**: 401 es "no autenticado", 403 es "autenticado sin permiso".
- **422**: antes "Unprocessable Entity" (WebDAV, RFC 4918); en RFC 9110 se llama "Unprocessable Content".
- **PATCH no es idempotente en general**; PUT y DELETE sí. HEAD y OPTIONS son seguros.
- **Las RFC de HTTP cambiaron en 2022**: RFC 2616 y la serie 7230-7235 están obsoletas; ahora rigen RFC 9110 a 9114.
- **JAX-WS ya no viene en el JDK** desde Java 11; `wsimport` hay que obtenerlo de Metro o CXF. Los paquetes son `jakarta.*` desde Jakarta EE 9 (antes `javax.*`).
- **JAX-RPC y JAXR** están retirados (pruned) de Java EE. Si aparecen como opción para crear servicios hoy, la correcta es JAX-WS o JAX-RS.
- **UDDI público** desapareció en 2006. Una pregunta que lo presente como pieza viva de REST es falsa.
- **Swagger frente a OpenAPI**: desde 2016 la especificación se llama OpenAPI; Swagger es el nombre de las herramientas.
- **Tres capas lógicas no exigen tres servidores** (2008, 2015). Distractor recurrente.
- **Escalabilidad horizontal** es añadir nodos; migrar a un servidor mayor es vertical (2006).
- **Modo asíncrono**: el cliente continúa al recibir el acuse, no al expirar un timeout (2005).
- **Presentación distribuida frente a remota**: distribuida reparte la presentación; remota la saca entera al cliente (2005, 2008).
- **Firmar SOAP**: WS-Security, no SAML ni XML-Encryption ni JWT (2024 b3).
