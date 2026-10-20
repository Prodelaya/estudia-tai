# Tema 30. Modelos OSI y TCP/IP, protocolos y direccionamiento IP

Es el tema con más preguntas de test de toda la oposición: se esperan unas **4,1 preguntas de test por convocatoria** y **0 del supuesto III**. Hay **127 preguntas históricas** (2005-2025): 68 de test (ej1) y 59 del supuesto IV (b4), 6 de ellas de 2025 con tema estimado. El supuesto IV no te afecta porque eliges el III, pero sus preguntas son ejercicios de subredes idénticos a los del test. Las preguntas se concentran en cuatro bloques. Primero, el cálculo de subredes y direccionamiento IPv4 (casi la mitad: hosts, broadcast, máscara, clase, rango). Segundo, IPv6 (multicast FF00::/8, campos de la cabecera, cabeceras de extensión). Tercero, las capas OSI y TCP/IP y qué protocolo va en cada una. Cuarto, protocolos concretos: ARP/RARP, TCP frente a UDP, puertos, registros DNS y protocolos de enrutamiento (RIP, OSPF).

## Cómo lo preguntan

- **Cálculo de subredes con cuatro opciones numéricas**: hosts de una /20, broadcast de una /21, primera IP asignable, máscara para N subredes. Ejemplos: 2018 b4 1-3, 2016 b4 31-37, 2019 b4 1-4, 2024 b4 1, 2025 ej1 73, 2025 b4 1-3.
- **La red que te dan no es la dirección de red real**: 172.30.23.0/20 (2018) o 172.17.8.0/21 (2016). Si no calculas la red verdadera, eliges el distractor.
- **"Indique la INCORRECTA" sobre IPv4 o TCP/UDP**: 2018 ej1 91 (IPv4 orientado a conexión), 2019 ej1 80, 2024 ej1 71 (dos IP en la misma /26).
- **Asignar protocolo a capa**: ARP a red (2008), SNMP a aplicación (2008), ICMP a Internet (2024), MAC/LLC a enlace (2016), RZ y bifase a física (2008).
- **Literalidad de siglas, RFC y versiones**: ISO/IEC 7498-1:1994 (2024), RFC 1122 keep-alive (2017), RIPng (2018), OSPFv3 (2017), L2TP (2018).
- **Datos de cabecera IPv6**: Payload Length 16 bits (2008), Traffic Class 8 bits (2015), Hop Limit (2025), campo que desaparece (2017).
- **Prefijos IPv6**: FF00::/8 multicast sale en 2016, 2019 y 2022 con los mismos distractores (FE80::/10, FC00::/7).
- **Puertos bien conocidos y registros DNS**: Telnet 23, DNS 53, NTP 123, SMTP 25; MX, SOA, NS, CNAME.
- **Comandos con su sistema**: getmac en Windows (2017), ipconfig /flushdns (2016), nslookup (2006, 2016).

## 1. Arquitecturas de red y modelo OSI

### 1.1 Conceptos básicos de una arquitectura por capas

Una **arquitectura de red** es el conjunto de capas y protocolos de un sistema de comunicaciones. Dividir en capas reduce la complejidad: cada capa resuelve un problema y oculta los detalles a las demás.

- **Entidad**: elemento activo de una capa (proceso o hardware). Las entidades de la misma capa en máquinas distintas son **entidades pares**.
- **Protocolo**: reglas que siguen las entidades pares para comunicarse (comunicación horizontal, virtual).
- **Servicio**: lo que una capa ofrece a la capa superior (comunicación vertical, real).
- **Interfaz**: frontera entre dos capas adyacentes de la misma máquina.
- **SAP (Service Access Point)**: punto donde la capa N+1 accede a los servicios de la capa N. En TCP/IP, los puertos son SAP de transporte.
- **PDU (Protocol Data Unit)**: unidad que intercambian entidades pares. PDU(N) = PCI(N) + SDU(N).
- **PCI (Protocol Control Information)**: la cabecera que añade la capa.
- **SDU (Service Data Unit)**: los datos que la capa superior entrega para transmitir.

Regla clave: **la capa N presta servicios a la capa N+1** y usa los de la capa N-1. **[Salió 2018, 2022]** Los distractores dicen "cada capa presta servicios a la capa inferior" (2018) o "las entidades del nivel N+1 ofrecen servicios al nivel N" (2022). Ambos son falsos.

### 1.2 Primitivas y tipos de servicio

Las capas se comunican mediante **cuatro primitivas de servicio**:

| Primitiva | Quién la emite | Significado |
|---|---|---|
| Request (petición/solicitud) | Usuario del servicio que origina | Pide una acción al proveedor |
| Indication (indicación) | Proveedor, en el destino | Avisa al usuario remoto del evento |
| Response (respuesta) | Usuario remoto | Contesta a la indicación |
| Confirm (confirmación) | Proveedor, en el origen | Entrega la respuesta al que pidió |

- **Servicio confirmado**: usa las **cuatro primitivas** (Request, Indication, Response, Confirm). **[Salió 2022]**
- **Servicio no confirmado**: usa **dos** primitivas, Request e Indication. El distractor de 2022 decía "3 de 4" y es falso.
- **Servicio orientado a conexión**: tres fases (establecimiento, transferencia, liberación). Mantiene el orden. Ejemplo: TCP.
- **Servicio no orientado a conexión (sin conexión)**: cada unidad viaja independiente, como un telegrama. Ejemplo: UDP, IP.
- **Servicio fiable**: garantiza la entrega con acuses de recibo y retransmisiones. No fiable: no lo garantiza.

Un servicio puede ser orientado a conexión y no fiable, o sin conexión y fiable. Son dos ejes independientes.

### 1.3 El modelo OSI: origen y norma

- OSI = **Open Systems Interconnection**, modelo de referencia de la **ISO**.
- Norma vigente: **ISO/IEC 7498-1:1994** (equivalente a la UIT-T X.200). **[Salió 2024]** La primera versión es de 1984.
- Es un **modelo de referencia**, no una implementación. Define capas y funciones, no protocolos concretos. La pila de protocolos OSI (X.400, X.500, FTAM, CLNP) apenas se usa hoy.
- Tiene **7 capas**. Regla mnemotécnica de abajo arriba: "**F**ui **E**l **R**ey **T**risteza **S**in **P**rincesa **A**mada" (Física, Enlace, Red, Transporte, Sesión, Presentación, Aplicación).

### 1.4 Las siete capas OSI

| Nº | Capa | PDU | Función principal | Ejemplos |
|---|---|---|---|---|
| 7 | Aplicación | APDU (datos) | Servicios al usuario y a las aplicaciones | HTTP, FTP, SMTP, DNS, X.400, FTAM |
| 6 | Presentación | PPDU (datos) | Sintaxis y formato: codificación, cifrado, compresión | ASN.1, XDR, TLS (discutido), JPEG |
| 5 | Sesión | SPDU (datos) | Diálogo, sincronización, puntos de control | RPC, NetBIOS, SQL sesiones |
| 4 | Transporte | Segmento (TPDU) | Extremo a extremo: fiabilidad, flujo, multiplexación | TCP, UDP, SCTP |
| 3 | Red | Paquete | Encaminamiento y direccionamiento lógico | IP, ICMP, IPsec, OSPF |
| 2 | Enlace de datos | Trama | Entramado, direcciones físicas, control de errores | Ethernet MAC, PPP, HDLC, 802.11 |
| 1 | Física | Bit | Transmisión de bits por el medio | RS-232, 1000BASE-T, codificación Manchester |

#### Capa 1. Física
- Transmite **bits** por el medio. Define características mecánicas (conectores), eléctricas (tensiones), funcionales y de procedimiento.
- Incluye la **codificación de línea**: NRZ, NRZI, RZ, Manchester, Manchester diferencial, bifase, 4B/5B, 8B/10B. **[Salió 2008]** RZ, RZ-L y bifase son de nivel físico.
- Dispositivos: repetidor, hub (concentrador), módem, cableado.

#### Capa 2. Enlace de datos
- Organiza los bits en **tramas**, detecta errores (CRC/FCS), controla el flujo entre nodos vecinos y gestiona el acceso al medio.
- Direcciones físicas: **MAC de 48 bits** (6 bytes), por ejemplo 00:1A:2B:3C:4D:5E. Los 24 primeros bits son el OUI del fabricante.
- El IEEE 802 la divide en dos **subcapas**: **LLC** (Logical Link Control, 802.2, arriba) y **MAC** (Medium Access Control, abajo). **[Salió 2016, 2024]** El distractor de 2024 las atribuía a la capa de sesión.
- Dispositivos: puente (bridge), switch (conmutador), tarjeta de red (NIC).

#### Capa 3. Red
- **Encaminamiento** (routing), **reenvío** (forwarding) y **direccionamiento lógico** a través de varias redes. **[Salió 2024]** El distractor atribuía estas funciones a transporte.
- Control de congestión en la subred y fragmentación.
- Protocolos: IP, ICMP, IGMP, IPsec, protocolos de encaminamiento. ARP suele situarse entre la 2 y la 3; el examen de 2008 lo puso en **red**. **[Salió 2008]**
- Dispositivo: router (encaminador), switch de nivel 3.

#### Capa 4. Transporte
- Primera capa **extremo a extremo** (de proceso a proceso, no de nodo a nodo).
- Segmentación y reensamblado, control de flujo y de errores extremo a extremo, multiplexación mediante puertos.
- Puede ofrecer servicio orientado a conexión (TCP) o sin conexión (UDP). **[Salió 2018]** El distractor decía "trabaja siempre con protocolos no orientados a conexión".
- La PDU de transporte es el **segmento** (en UDP se suele decir **datagrama**). El distractor de 2018 decía "paquetes".
- OSI define cinco clases de transporte (TP0 a TP4). TP4 es la más completa.

#### Capa 5. Sesión
- Establece, gestiona y cierra **sesiones** (diálogos) entre aplicaciones.
- **Control del diálogo**: quién habla (símplex, semidúplex, dúplex) mediante testigos (tokens).
- **Sincronización**: puntos de control (checkpoints) para reanudar transferencias largas.
- En TCP/IP no existe como capa: sus funciones quedan dentro de **aplicación**. **[Salió 2008]**

#### Capa 6. Presentación
- Se ocupa de la **sintaxis y la semántica** de la información: **formato de los datos** que intercambian las aplicaciones. **[Salió 2018, 2025]**
- Traducción entre códigos (ASCII, EBCDIC, Unicode), representación de datos (ASN.1 con BER/DER, XDR), **cifrado** y **compresión**.
- En TCP/IP también se integra en aplicación.

#### Capa 7. Aplicación
- Ofrece servicios de red directamente a las aplicaciones del usuario.
- OSI definía FTAM (ficheros), X.400 (correo), X.500 (directorio), VT (terminal virtual), CMIP (gestión).
- En TCP/IP: HTTP, FTP, SMTP, DNS, SNMP, Telnet, SSH, DHCP, NTP.

### 1.5 Encapsulación

Al bajar por la pila, cada capa añade su cabecera (PCI) a los datos de la capa superior. La capa de enlace añade además una cola (trailer) con el FCS. Al subir, cada capa quita su cabecera (desencapsulación).

```text
Aplicación   [ Datos ]
Transporte   [ Cab. TCP | Datos ]                         -> segmento
Red          [ Cab. IP | Cab. TCP | Datos ]               -> paquete
Enlace       [ Cab. Eth | Cab. IP | Cab. TCP | Datos | FCS ] -> trama
Física       0101101011...                                -> bits
```

### 1.6 Dispositivos de interconexión por capa

| Capa | Dispositivo | Qué mira |
|---|---|---|
| 1 | Repetidor, hub | Nada: regenera la señal |
| 2 | Puente, switch | Dirección MAC |
| 3 | Router, switch L3 | Dirección IP |
| 4-7 | Pasarela (gateway), cortafuegos de aplicación, balanceador L7, proxy | Puertos y contenido |

Un **hub** no separa dominios de colisión ni de difusión. Un **switch** separa dominios de colisión. Un **router** separa dominios de difusión (broadcast). Las VLAN también separan dominios de difusión.

## 2. Modelo TCP/IP

### 2.1 Origen y capas

TCP/IP nace de ARPANET (Departamento de Defensa de EE. UU.). Su especificación está en las **RFC** del IETF. La **RFC 1122** (requisitos para hosts) define cuatro capas.

| Capa TCP/IP (RFC 1122) | Otros nombres | Equivalencia OSI | Protocolos |
|---|---|---|---|
| Aplicación | Proceso | 5, 6 y 7 | HTTP, FTP, SMTP, DNS, SNMP, Telnet, SSH, DHCP, NTP |
| Transporte | Host a host | 4 | TCP, UDP, SCTP, QUIC (sobre UDP) |
| Internet | Red, interred | 3 | IP (v4 y v6), ICMP, IGMP, IPsec |
| Acceso a red | Enlace, host a red, interfaz de red | 1 y 2 | Ethernet, Wi-Fi, PPP, ARP |

- La arquitectura TCP/IP tiene **cuatro capas**. Muchos libros (Tanenbaum, Cisco) usan un **modelo híbrido de cinco**: física, enlace, red, transporte y aplicación. Ninguno tiene capa de sesión. **[Salió 2024]**
- **TCP y UDP son de transporte**, no de Internet. **[Salió 2024]**
- **ICMP es de la capa de Internet** (respuesta correcta de 2024 ej1 70). Aunque viaja dentro de IP, es parte integral de IP.
- **Telnet, HTTP y FTP** funcionan en la capa de **aplicación**. **[Salió 2016, 2024]** El distractor de 2024 ponía Telnet en "sesión".
- **SNMP** es de la capa de **aplicación**. **[Salió 2008]**
- **UDP** trabaja en la capa de **transporte**. **[Salió 2006]**
- La capa de **sesión** OSI se ubica en la **aplicación** de TCP/IP. **[Salió 2008]**

### 2.2 Comparación OSI frente a TCP/IP

| Aspecto | OSI | TCP/IP |
|---|---|---|
| Origen | ISO, de iure | DoD/IETF, de facto |
| Capas | 7 | 4 (o 5 en el modelo híbrido) |
| Enfoque | Primero el modelo, luego los protocolos | Primero los protocolos, luego el modelo |
| Capa de red | Con y sin conexión | Solo sin conexión (IP) |
| Capa de transporte | Con y sin conexión | Con (TCP) y sin conexión (UDP) |
| Distinción servicio/protocolo/interfaz | Muy clara | Difusa |
| Uso real | Referencia docente | Internet |

### 2.3 Protocolos de usuario y protocolos de soporte

La RFC 1123 (requisitos de hosts: aplicación y soporte) distingue dos tipos de protocolos de aplicación. **[Salió 2024]**

- **Protocolos de usuario** (aplicaciones que usa directamente una persona): **Telnet**, **FTP** (y su versión segura), **SMTP**, HTTP.
- **Protocolos de soporte** (servicios que hacen funcionar la red): **DNS**, inicialización de hosts (BOOTP, DHCP), gestión remota (**SNMP**).

Por eso en 2024 b4 6 la respuesta es: **FTP es de usuario y DNS es de soporte**. El distractor "DNS es siempre orientado a conexión" es falso: DNS usa sobre todo UDP.

### 2.4 Direcciones en cada capa

| Capa | Dirección | Tamaño | Ejemplo |
|---|---|---|---|
| Enlace | MAC (física) | 48 bits | 00:1A:2B:3C:4D:5E |
| Internet | IP (lógica) | 32 bits (v4), 128 bits (v6) | 192.168.1.10, 2001:db8::1 |
| Transporte | Puerto | 16 bits (0 a 65535) | 443 |
| Aplicación | Nombre, URL | Variable | www.ejemplo.es |

Un **socket** es la combinación **dirección IP + protocolo de transporte + puerto**. Identifica un proceso en una máquina de la red. **[Salió 2007]** Una conexión TCP se identifica por la quíntupla: protocolo, IP origen, puerto origen, IP destino, puerto destino.

## 3. Protocolo IPv4

### 3.1 Características de IP

- Definido en la **RFC 791** (1981).
- **No orientado a conexión**: cada datagrama se encamina por separado y puede seguir rutas distintas. **[Salió 2018]** Decir que IPv4 "es orientado a conexión" es falso.
- **No fiable** ("best effort", mejor esfuerzo): no garantiza entrega, orden ni ausencia de duplicados. La fiabilidad la pone TCP.
- Unidad de datos: **datagrama** (paquete IP). **[Salió 2018]**
- Incluye un **checksum de cabecera** (solo cabecera, no datos). **[Salió 2018]**
- Fragmenta datagramas cuando superan la MTU del enlace. Los routers IPv4 pueden fragmentar.

### 3.2 Cabecera IPv4

La cabecera mínima ocupa **20 bytes** y la máxima **60 bytes** (con opciones).

| Campo | Bits | Función |
|---|---|---|
| Versión | 4 | Vale 4 |
| IHL (longitud de cabecera) | 4 | En palabras de 32 bits; mínimo 5 (20 bytes), máximo 15 (60 bytes) |
| Tipo de servicio (ToS) / DSCP + ECN | 8 | Calidad de servicio: 6 bits DSCP y 2 bits ECN |
| Longitud total | 16 | Cabecera + datos; máximo 65.535 bytes |
| Identificación | 16 | Identifica los fragmentos de un mismo datagrama |
| Indicadores (flags) | 3 | Reservado, DF (no fragmentar), MF (más fragmentos) |
| Desplazamiento de fragmento | 13 | Posición del fragmento en unidades de 8 bytes |
| TTL (tiempo de vida) | 8 | Se decrementa en cada router; a 0 se descarta |
| Protocolo | 8 | Protocolo encapsulado: 1 ICMP, 6 TCP, 17 UDP |
| Suma de comprobación de cabecera | 16 | Se recalcula en cada salto porque cambia el TTL |
| Dirección origen | 32 | IP del emisor |
| Dirección destino | 32 | IP del receptor |
| Opciones y relleno | Variable | Raras; hasta completar múltiplo de 32 bits |

Valores habituales del campo **Protocolo** (en IPv6, campo Next Header):

| Valor | Protocolo |
|---|---|
| 1 | ICMP |
| 2 | IGMP |
| 6 | TCP |
| 17 | UDP |
| 41 | IPv6 encapsulado (túneles 6in4, 6to4) |
| 47 | GRE |
| 50 | ESP (IPsec) |
| 51 | AH (IPsec) |
| 58 | ICMPv6 |
| 88 | EIGRP |
| 89 | OSPF |
| 112 | VRRP |
| 132 | SCTP |

### 3.3 Formato y representación de una dirección IPv4

- **32 bits** (4 bytes). **[Salió 2015]** El distractor dice "32 bytes".
- Se escribe en **notación decimal con puntos**: cuatro octetos de 0 a 255. Ejemplo: 192.168.1.10.
- Puede representarse en **decimal, binario o hexadecimal**. **[Salió 2008]** Por ejemplo, 192.168.1.10 = 11000000.10101000.00000001.00001010 = C0.A8.01.0A.
- Un octeto con valor mayor que 255 hace inválida la dirección. **[Salió 2007]** 197.165.276.1 no es una IP válida.

Tabla de pesos de un octeto, que debes saber de memoria:

| Bit | 7 | 6 | 5 | 4 | 3 | 2 | 1 | 0 |
|---|---|---|---|---|---|---|---|---|
| Peso | 128 | 64 | 32 | 16 | 8 | 4 | 2 | 1 |

Conversión rápida a binario de 172: 172 = 128 + 32 + 8 + 4 = 10101100. De 17: 16 + 1 = 00010001. **[Salió 2016]**

### 3.4 Direccionamiento con clases (classful)

La dirección se divide en **parte de red** y **parte de host**. Antes de 1993 la frontera la fijaban los primeros bits (la clase).

| Clase | Primeros bits | Primer octeto | Máscara por defecto | Bits de red útiles | Nº de redes | Hosts por red |
|---|---|---|---|---|---|---|
| A | 0 | 0 a 127 (útiles 1 a 126) | 255.0.0.0 (/8) | 7 | 126 (2^7 - 2) | 16.777.214 (2^24 - 2) |
| B | 10 | 128 a 191 | 255.255.0.0 (/16) | 14 | 16.384 (2^14) | 65.534 (2^16 - 2) |
| C | 110 | 192 a 223 | 255.255.255.0 (/24) | 21 | 2.097.152 (2^21) | 254 (2^8 - 2) |
| D | 1110 | 224 a 239 | No tiene | Multicast | No aplica | No aplica |
| E | 1111 | 240 a 255 | No tiene | Experimental, reservada | No aplica | No aplica |

- La **clase A** usa **7 bits** para identificar la red (el primero es el 0 fijo) y 24 para hosts. **[Salió 2005]**
- **Red 10** = clase A. **[Salió 2008, 2019]** 10.0.4.0 sigue siendo clase A aunque lleve otra máscara.
- 172.x = clase B. **[Salió 2016, 2018, 2024]** 199.8.45.3 = clase C. **[Salió 2006]**
- Clase A: máscara por defecto 255.0.0.0. Clase C: 254 hosts como máximo. **[Salió 2024]**
- **La clase solo depende del primer octeto, nunca del prefijo.** 172.30.23.0/20 es clase B aunque el prefijo sea /20. **[Salió 2016, 2018]**

### 3.5 Direcciones especiales y reservadas

| Bloque | Uso | Norma |
|---|---|---|
| 0.0.0.0/8 | "Esta red"; 0.0.0.0 = cualquier dirección o sin dirección | RFC 1122 |
| 10.0.0.0/8 | Privada | RFC 1918 |
| 100.64.0.0/10 | Espacio compartido para CGNAT de operadores | RFC 6598 |
| 127.0.0.0/8 | Bucle local (loopback); 127.0.0.1 = localhost | RFC 1122 |
| 169.254.0.0/16 | Enlace local (APIPA en Windows, sin DHCP) | RFC 3927 |
| 172.16.0.0/12 | Privada: 172.16.0.0 a 172.31.255.255 | RFC 1918 |
| 192.0.2.0/24, 198.51.100.0/24, 203.0.113.0/24 | Documentación (TEST-NET-1, 2 y 3) | RFC 5737 |
| 192.168.0.0/16 | Privada | RFC 1918 |
| 198.18.0.0/15 | Pruebas de rendimiento (benchmarking) | RFC 2544 |
| 224.0.0.0/4 | Multicast (antigua clase D) | RFC 5771 |
| 240.0.0.0/4 | Reservada (antigua clase E) | RFC 1112 |
| 255.255.255.255 | Difusión limitada (broadcast en la red local) | RFC 919 |

Datos que caen:

- **Privadas RFC 1918**: 10.0.0.0/8, **172.16.0.0/12** (de 172.16 a **172.31**) y 192.168.0.0/16. Fuera de esos rangos, la dirección es pública. **[Salió 2006, 2007, 2008]** 172.23.18.1 es privada; 192.132.1.1, 144.168.37.3 y 92.123.47.8 son públicas.
- **Trampa clásica**: 172.32.x.x ya no es privada. 192.169.x.x tampoco.
- **Loopback**: cualquier 127.x.x.x. Un datagrama enviado a esa red **vuelve dentro del propio host** y no llega a la red física. No se asigna a hosts. **[Salió 2008, 2015]**
- La dirección de **red** (todos los bits de host a 0) y la de **broadcast dirigido** (todos los bits de host a 1) no se asignan a hosts. Por eso se restan 2.
- 10.0.0.32 no es loopback: es privada. **[Salió 2008]**

Multicast IPv4 relevante:

| Dirección | Grupo |
|---|---|
| 224.0.0.1 | Todos los hosts del enlace |
| 224.0.0.2 | Todos los routers del enlace |
| 224.0.0.5 | Todos los routers OSPF |
| 224.0.0.6 | Routers OSPF designados (DR y BDR) |
| 224.0.0.9 | Routers RIPv2 |
| 224.0.0.10 | Routers EIGRP |
| 224.0.0.18 | VRRP |
| 239.0.0.0/8 | Ámbito administrativo (multicast privado) |

**Multicast y MAC.** Una IP multicast se convierte en MAC copiando sus **23 bits de menor peso** detrás del prefijo 01:00:5E. Se pierden 5 bits, así que **32 grupos IP comparten la misma MAC**. La tarjeta no puede distinguirlos y la capa de red descarta los que no le interesan. **[Salió 2008]** Por ejemplo, 236.0.0.2 y 237.0.0.2 producen la misma MAC 01:00:5E:00:00:02. El protocolo que gestiona la pertenencia a grupos es **IGMP** (en IPv6, MLD).

### 3.6 Máscara de red y prefijo CIDR

La **máscara** es un número de 32 bits con **unos contiguos a la izquierda** (parte de red) y **ceros a la derecha** (parte de host). La notación **CIDR** indica cuántos unos tiene: /24 = 255.255.255.0.

Una máscara válida no puede tener un cero seguido de un uno. **[Salió 2005]** 255.255.216.0 no es posible: 216 = 11011000 rompe la continuidad.

Los únicos valores posibles de un octeto de máscara son:

| Binario | Decimal | Bits a 1 |
|---|---|---|
| 00000000 | 0 | 0 |
| 10000000 | 128 | 1 |
| 11000000 | 192 | 2 |
| 11100000 | 224 | 3 |
| 11110000 | 240 | 4 |
| 11111000 | 248 | 5 |
| 11111100 | 252 | 6 |
| 11111110 | 254 | 7 |
| 11111111 | 255 | 8 |

Cualquier otro valor (por ejemplo 216, 236, 196, 194, 190, 223) delata una opción incorrecta. **[Salió 2007, 2016, 2022]**

**CIDR** (Classless Inter-Domain Routing, RFC 4632, antes RFC 1519, 1993) elimina las clases. El prefijo puede tener cualquier longitud. Permite dos cosas:

- **Subnetting** y **VLSM** (máscaras de longitud variable): dividir una red en subredes de distinto tamaño.
- **Superredes o agregación de rutas** (route summarization): anunciar varias redes contiguas como una sola. Ejemplo: 192.168.0.0/24 a 192.168.3.0/24 se resumen en 192.168.0.0/22.

**Máscara comodín (wildcard)**: es la máscara invertida (255 menos cada octeto). La usan las ACL de Cisco y OSPF. **[Salió 2015]** Para 255.240.0.0 la wildcard es **0.15.255.255**.

### 3.7 NAT y PAT

**NAT** (Network Address Translation, RFC 3022) traduce direcciones privadas a públicas en el router de salida. Nació para ahorrar direcciones IPv4.

- **NAT estático**: una privada se asocia siempre a una pública (útil para publicar un servidor).
- **NAT dinámico**: las privadas toman una pública libre de un conjunto (pool).
- **PAT o NAPT** (sobrecarga, overload): muchas privadas salen por **una única IP pública** y se distinguen por el puerto origen. En Linux se llama **IP Masquerade** (enmascaramiento). **[Salió 2017]**
- **CGNAT** (NAT de operador): el proveedor hace NAT a gran escala con 100.64.0.0/10.
- Inconvenientes: rompe el principio extremo a extremo, complica IPsec, VoIP y P2P (se usa NAT-T, STUN, TURN).

En IPv6 no hace falta NAT porque sobran direcciones. Existe NAT64 para la transición (apartado 5.7).

## 4. Cálculo de subredes: método paso a paso

Esta sección vale casi la mitad de las preguntas del tema. Hazla con lápiz hasta que cada ejercicio te cueste menos de un minuto.

### 4.1 Fórmulas que tienes que saber

Sea **n** el número de bits que tomas para subredes y **h** el número de bits que quedan para hosts.

- **Nº de subredes** = 2^n.
- **Nº de direcciones por subred** = 2^h.
- **Nº de hosts útiles por subred** = 2^h - 2 (se restan la dirección de red y la de broadcast).
- **h = 32 - prefijo**.
- **Tamaño de bloque** (número mágico) = 256 - valor del octeto interesante de la máscara. Es la distancia entre una subred y la siguiente.

Excepciones: una **/31** se usa en enlaces punto a punto con 2 direcciones útiles (RFC 3021). Una **/32** identifica un único host (rutas de host, loopbacks de router).

**Sobre 2^n o 2^n - 2 subredes.** La RFC 950 (1985) prohibía la primera subred (todo ceros) y la última (todo unos). Desde la RFC 1878 y CIDR se usan todas: **2^n subredes**. En los exámenes TAI los números elegidos dan el mismo resultado con ambos criterios. Usa 2^n salvo que la pregunta excluya expresamente la subred cero.

### 4.2 Tabla de potencias de 2

| n | 2^n | 2^n - 2 |
|---|---|---|
| 1 | 2 | 0 |
| 2 | 4 | 2 |
| 3 | 8 | 6 |
| 4 | 16 | 14 |
| 5 | 32 | 30 |
| 6 | 64 | 62 |
| 7 | 128 | 126 |
| 8 | 256 | 254 |
| 9 | 512 | 510 |
| 10 | 1.024 | 1.022 |
| 11 | 2.048 | 2.046 |
| 12 | 4.096 | 4.094 |
| 13 | 8.192 | 8.190 |
| 14 | 16.384 | 16.382 |
| 16 | 65.536 | 65.534 |
| 24 | 16.777.216 | 16.777.214 |

### 4.3 Tabla de prefijos de /8 a /32

| Prefijo | Máscara | Octeto interesante | Bloque | Direcciones | Hosts útiles |
|---|---|---|---|---|---|
| /8 | 255.0.0.0 | 1.º | 256 | 16.777.216 | 16.777.214 |
| /9 | 255.128.0.0 | 2.º | 128 | 8.388.608 | 8.388.606 |
| /10 | 255.192.0.0 | 2.º | 64 | 4.194.304 | 4.194.302 |
| /11 | 255.224.0.0 | 2.º | 32 | 2.097.152 | 2.097.150 |
| /12 | 255.240.0.0 | 2.º | 16 | 1.048.576 | 1.048.574 |
| /13 | 255.248.0.0 | 2.º | 8 | 524.288 | 524.286 |
| /14 | 255.252.0.0 | 2.º | 4 | 262.144 | 262.142 |
| /15 | 255.254.0.0 | 2.º | 2 | 131.072 | 131.070 |
| /16 | 255.255.0.0 | 3.º | 256 | 65.536 | 65.534 |
| /17 | 255.255.128.0 | 3.º | 128 | 32.768 | 32.766 |
| /18 | 255.255.192.0 | 3.º | 64 | 16.384 | 16.382 |
| /19 | 255.255.224.0 | 3.º | 32 | 8.192 | 8.190 |
| /20 | 255.255.240.0 | 3.º | 16 | 4.096 | 4.094 |
| /21 | 255.255.248.0 | 3.º | 8 | 2.048 | 2.046 |
| /22 | 255.255.252.0 | 3.º | 4 | 1.024 | 1.022 |
| /23 | 255.255.254.0 | 3.º | 2 | 512 | 510 |
| /24 | 255.255.255.0 | 4.º | 256 | 256 | 254 |
| /25 | 255.255.255.128 | 4.º | 128 | 128 | 126 |
| /26 | 255.255.255.192 | 4.º | 64 | 64 | 62 |
| /27 | 255.255.255.224 | 4.º | 32 | 32 | 30 |
| /28 | 255.255.255.240 | 4.º | 16 | 16 | 14 |
| /29 | 255.255.255.248 | 4.º | 8 | 8 | 6 |
| /30 | 255.255.255.252 | 4.º | 4 | 4 | 2 |
| /31 | 255.255.255.254 | 4.º | 2 | 2 | 2 (punto a punto) |
| /32 | 255.255.255.255 | 4.º | 1 | 1 | 1 (host) |

Truco para reconstruirla: el bloque se divide por 2 al sumar un bit. Las filas /20, /21, /25, /26, /29 y /30 son las que más salen.

### 4.4 Método del bloque (número mágico) para red, broadcast y rango

Es el método más rápido y no necesita binario. Sirve para cualquier pregunta "dada una IP y una máscara".

1. **Localiza el octeto interesante**: el primero de la máscara que no es 255. Con /20 es el tercero; con /26, el cuarto.
2. **Calcula el bloque**: 256 menos el valor de la máscara en ese octeto. Con /20 (240): 256 - 240 = 16.
3. **Halla la dirección de red**: en el octeto interesante, toma el múltiplo del bloque igual o inferior al valor de la IP. Los octetos de la derecha pasan a 0. Los de la izquierda se copian.
4. **Halla el broadcast**: red + bloque - 1 en el octeto interesante. Los octetos de la derecha pasan a 255.
5. **Rango de hosts**: desde red + 1 hasta broadcast - 1 (en el último octeto).
6. **Nº de hosts**: 2^(32 - prefijo) - 2.

Atajo para el paso 3: divide el valor del octeto entre el bloque, quédate con la parte entera y multiplica por el bloque. Por ejemplo, 23 entre 16 da 1; 1 por 16 = 16.

### 4.5 Método binario (AND lógico)

Es más lento, pero conviene saberlo porque a veces piden la respuesta en binario.

- **Dirección de red** = IP **AND** máscara (bit a bit).
- **Broadcast** = IP **OR** (máscara invertida), es decir, bits de host a 1.

```text
IP       10.31.93.25   = 00001010.00011111.01011101.00011001
Máscara  /29           = 11111111.11111111.11111111.11111000
AND      red           = 00001010.00011111.01011101.00011000 = 10.31.93.24
Broadcast (host a 1)   = 00001010.00011111.01011101.00011111 = 10.31.93.31
```

### 4.6 Método para "necesito N subredes"

1. Busca el menor **n** con 2^n mayor o igual que N.
2. Nuevo prefijo = prefijo original + n.
3. Convierte el prefijo en máscara decimal con la tabla 4.3.
4. Comprueba que quedan suficientes hosts: 2^(32 - nuevo prefijo) - 2.

Si piden "el mayor número de hosts posible", toma exactamente ese n mínimo. Tomar más bits deja menos hosts.

### 4.7 Método para "necesito H hosts por subred"

1. Busca el menor **h** con 2^h - 2 mayor o igual que H.
2. Nuevo prefijo = 32 - h.
3. Nº de subredes que salen = 2^(nuevo prefijo - prefijo original).

Si te piden a la vez N subredes y H hosts, comprueba las dos condiciones. Si ambas caben, cualquier máscara entre las dos soluciones vale. Elige la que encaje con las opciones.

### 4.8 Método VLSM (subredes de distinto tamaño)

1. Ordena las necesidades **de mayor a menor** número de hosts.
2. A cada una le asignas el bloque más pequeño que la cubra (método 4.7).
3. Colócalas **seguidas**, empezando por la dirección más baja. Cada bloque debe empezar en un múltiplo de su tamaño.
4. Lo que sobra queda libre para crecer.

### 4.9 Ejercicios resueltos de exámenes reales

#### Ejercicio 1 (2018 b4 1, 2, 3 y 32). Red 172.30.23.0/20

Clase: primer octeto 172, entre 128 y 191, **clase B**.

1. Octeto interesante: tercero (/20 = 255.255.240.0).
2. Bloque: 256 - 240 = **16**.
3. Red: múltiplos de 16 en el tercer octeto: 0, 16, 32. El 23 cae en el bloque del 16. Red = **172.30.16.0**. Fíjate: 172.30.23.0 no es la dirección de red.
4. Broadcast: 16 + 16 - 1 = 31. Broadcast = **172.30.31.255**.
5. Rango: **172.30.16.1** a 172.30.31.254. La primera IP asignable es 172.30.16.1.
6. Hosts: 2^(32 - 20) - 2 = 2^12 - 2 = **4.094**.

Distractores: 2.046 (eso es una /21), 172.30.23.1, 172.30.23.255.

#### Ejercicio 2 (2016 b4 31 a 37). Red 172.17.8.0/21

1. /21 = 255.255.248.0. Bloque en el tercer octeto: 256 - 248 = **8**.
2. Múltiplos de 8: 0, 8, 16. El 8 es múltiplo: la red es **172.17.8.0**.
3. Broadcast: 8 + 8 - 1 = 15. **172.17.15.255**.
4. Rango: **172.17.8.1** a **172.17.15.254**.
5. Hosts: 2^11 - 2 = **2.046**. Clase **B**.
6. ¿Qué host pertenece? 172.17.15.254 sí. 172.17.16.1 y 172.17.19.143 están en la siguiente /21. 172.17.7.1 está en la anterior.
7. IP 172.17.14.2 en binario: **10101100.00010001.00001110.00000010**.
8. "16 subredes con 126 hosts cada una" partiendo de /21: 16 subredes = 4 bits más, prefijo /25. Una /25 tiene 126 hosts. Máscara **255.255.255.128**.

#### Ejercicio 3 (2019 b4 1 a 4). Redes 10.0.4.0/25 y 10.0.0.0/21

- 255.255.255.128 tiene 8 + 8 + 8 + 1 = **25 bits**.
- 10.0.4.0: primer octeto 10, **clase A**.
- 10.0.0.0/21: hosts = 2^11 - 2 = **2.046**.
- Rango: bloque 8 en el tercer octeto. Red 10.0.0.0, broadcast 10.0.7.255. Hosts de **10.0.0.1 a 10.0.7.254**.

#### Ejercicio 4 (2017 b4 17 a 19). Red 10.31.93.128/29

1. /29 = 255.255.255.248, bloque **8** en el cuarto octeto.
2. 128 es múltiplo de 8: red 10.31.93.128.
3. Broadcast: 128 + 8 - 1 = **10.31.93.135**.
4. Primera IP: 10.31.93.129 = **00001010.00011111.01011101.10000001**. Atención: 31 = 00011111, no 00011110 (eso es 30).
5. ¿A qué red pertenece 10.31.93.25/29? Múltiplos de 8: 16, 24, 32. El 25 cae en el 24: **10.31.93.24/29**.

#### Ejercicio 5 (2024 b4 1). La red 10.9.0.0/16 se divide en 16 subredes; el organismo recibe la última

1. 16 subredes = 2^4, se toman 4 bits. Nuevo prefijo: 16 + 4 = **/20**.
2. Hosts por subred: 2^12 - 2 = **4.094**.
3. Bloque: 16 en el tercer octeto. Subredes: 10.9.0.0, 10.9.16.0, ..., 10.9.240.0.
4. La última es **10.9.240.0/20**: hosts de 10.9.240.1 a 10.9.255.254, broadcast 10.9.255.255.

Distractores: 4.096 (olvida restar 2), 65.534 (la /16 entera).

#### Ejercicio 6 (2024 ej1 71). ¿Están 192.168.123.71 y 192.168.123.133 en la misma red con 255.255.255.192?

1. /26, bloque 64: subredes .0, .64, .128, .192.
2. .71 está en la subred .64 (de .64 a .127).
3. .133 está en la subred .128 (de .128 a .191).
4. **No** están en la misma red. Esa era la afirmación INCORRECTA de la pregunta.

#### Ejercicio 7 (2022 b4 5, 7 y 25). Red 10.20.30.0/24 dividida en cuatro subredes

1. Cuatro subredes = 2 bits. Prefijo /26, máscara **255.255.255.192**. Las opciones 194, 196 y 190 no son octetos de máscara válidos.
2. Subredes: 10.20.30.0/26, .64/26, .128/26, .192/26.
3. Primera subred 10.20.30.0/26: red **10.20.30.0**, broadcast **10.20.30.63**.
4. Última IP válida de host de la subred .128/26: **10.20.30.190**. La .191 es su broadcast.

#### Ejercicio 8 (2015 b4 17). Host 192.168.168.188 con máscara 255.255.255.192

1. Bloque 64. Múltiplos: 128, 192. El 188 cae en el **128**.
2. Red 192.168.168.128, broadcast 192.168.168.191.
3. Rango válido: **192.168.168.129 a 192.168.168.190**.

#### Ejercicio 9 (2015 b4 18). ¿Qué es 204.201.210.4/30?

/30 tiene bloque 4. Las subredes empiezan en 0, 4, 8... El 4 es múltiplo de 4, así que es la **dirección de red** de la subred 204.201.210.4/30 (hosts .5 y .6, broadcast .7).

#### Ejercicio 10 (2015 ej1 123 y 124). Máscaras en el segundo octeto

- 113.128.14.35 con 255.192.0.0 (/10). Bloque 256 - 192 = 64 en el segundo octeto. Múltiplos: 64, 128, 192. El 128 es múltiplo. Red **113.128.0.0**.
- 123.132.14.35 con 255.240.0.0 (/12). La wildcard es 255 - cada octeto: **0.15.255.255**. Además, la red sería 123.128.0.0 (132 entre 16 da 8; 8 por 16 = 128).

#### Ejercicio 11 (2017 ej1 88 y 90). Broadcast con y sin máscara

- Host 34.254.0.17 **sin máscara**: se aplica la máscara por defecto de su clase. 34 es clase A (/8). Broadcast **34.255.255.255**. Trampa: 34.254.255.255 sería el de una /16.
- Red 213.114.93.0 con 255.255.255.192: bloque 64, broadcast **213.114.93.63**.

#### Ejercicio 12 (2016 ej1 137 y 142). Máscara 255.255.255.128

- /25: 2^7 - 2 = **126 hosts**.
- 192.48.11.3/25: bloque 128. El 3 cae en el 0. Broadcast **192.48.11.127**.

#### Ejercicio 13 (2015 ej1 104 y 105; 2008 ej1 95). Número de hosts

- 5 bits para hosts: 2^5 - 2 = **30**.
- 172.16.1.0/26: 2^6 - 2 = **62**.
- Red 194.168.14.0 (clase C, /24) tomando 2 bits para subred: /26, **62 hosts**.

#### Ejercicio 14 (2015 b4 13 a 16)

- 200.100.15.0/24: **254 hosts**.
- 10 subredes de 10 hosts en esa /24: 10 subredes piden 4 bits (16). Quedan 4 bits de host: 14 hosts. Sirve. Máscara **255.255.255.240** (/28).
- 172.167.0.0 con 255.255.240.0 (/20): bloque 16, broadcast **172.167.15.255**.
- 172.167.0.0/20: **4.094 hosts**.

#### Ejercicio 15 (2008 b4 7 y 18; 2007 b4 2). Máscara para N subredes

- Clase C con 18 subredes y el máximo de hosts: 2^5 = 32 es la menor potencia que cubre 18. /24 + 5 = /29, **255.255.255.248** (6 hosts por subred). Con /28 solo habría 16 subredes.
- 10.10.0.0/16 con 20 subredes: 5 bits (32). /21, **255.255.248.0**.
- 10.1.0.0/16 con 52 subredes: 6 bits (64). /22, **255.255.252.0**.

#### Ejercicio 16 (2025 ej1 73). 600 subredes

2^9 = 512 no llega; 2^10 = 1.024 sí. Hacen falta **10 bits de subred**. La plantilla provisional da **b) /18**: eso implica que la red de partida es una /8 (clase A), y /8 + 10 = **/18** (255.255.192.0, 16.382 hosts por subred). Ojo: desde una /16 resultaría /26 (255.255.255.192, 62 hosts), que es el distractor si no lees el prefijo de partida. Desde una /24 es imposible: solo hay 8 bits.

#### Ejercicio 17 (2007 b4 41). VLSM en 10.48.100.0/24: un edificio de 100 IP, dos de 25 y una o dos sedes futuras

1. 100 hosts: 2^7 - 2 = 126. Una **/25**: 10.48.100.0/25 (de .0 a .127).
2. 25 hosts: 2^5 - 2 = 30. Una **/27**: 10.48.100.128/27 (de .128 a .159).
3. Otra **/27**: 10.48.100.160/27 (de .160 a .191).
4. Queda libre 10.48.100.192/26 para las sedes futuras.
5. Respuesta: **10.48.100.0/25, 10.48.100.128/27 y 10.48.100.160/27**. La opción con dos /26 desperdicia direcciones y no deja hueco.

#### Ejercicio 18 (2005 b4 14). IP y máscara en binario

IP 00001010.11111110.00000001.00001001 = 10.254.1.9. Máscara 11111111.11111111.11111111.11111000 = /29. Red 10.254.1.8, hosts .9 a .14, broadcast .15. El router por defecto tiene que estar en ese rango (10.254.1.10 a .14, porque .9 es el propio equipo).

### 4.10 Ejercicios de práctica con solución

Resuélvelos sin mirar y compara.

1. **192.168.10.77/27**. Bloque 32. Red 192.168.10.64, broadcast .95, hosts .65 a .94, 30 hosts.
2. **172.16.45.200/19**. Bloque 32 en el tercer octeto; 45 cae en 32. Red 172.16.32.0, broadcast 172.16.63.255, 8.190 hosts.
3. **10.200.130.5/10**. Bloque 64 en el segundo octeto; 200 cae en 192. Red 10.192.0.0, broadcast 10.255.255.255, 4.194.302 hosts.
4. **130.50.0.0/16, 300 subredes**. 2^9 = 512. Prefijo /25, máscara 255.255.255.128, 126 hosts por subred.
5. **172.20.0.0/16, 500 hosts por subred**. 2^9 - 2 = 510. Prefijo /23, máscara 255.255.254.0, 128 subredes.
6. **VLSM en 200.1.1.0/24 para 60, 28, 12 y 2 hosts**. 200.1.1.0/26 (.0-.63), 200.1.1.64/27 (.64-.95), 200.1.1.96/28 (.96-.111), 200.1.1.112/30 (.112-.115). Libre desde .116.
7. **¿10.1.15.200/20 y 10.1.17.3/20 en la misma red?** Bloque 16 en el tercer octeto: 15 cae en 0-15 y 17 en 16-31. No.
8. **Resumir 192.168.0.0/24, .1.0/24, .2.0/24 y .3.0/24**. Cuatro redes = 2 bits menos: 192.168.0.0/22.
9. **Wildcard de /27**. 255.255.255.224 invertida: 0.0.0.31.
10. **Sexta subred /28 de 192.168.1.0/24**. Subredes .0, .16, .32, .48, .64, .80. La sexta es .80/28: hosts .81 a .94, broadcast .95.
11. **¿Es válida la máscara 255.255.255.236?** No: 236 = 11101100 tiene un cero entre unos.
12. **Hosts de una /23**. 2^9 - 2 = 510.
13. **Clase y máscara por defecto de 191.255.0.1**. Clase B (128-191), 255.255.0.0.
14. **¿Es 172.31.255.1 privada? ¿Y 172.32.0.1?** La primera sí (172.16/12 llega hasta 172.31). La segunda es pública.
15. **Última IP de host de 10.9.240.0/20**. Broadcast 10.9.255.255, última de host 10.9.255.254.

### 4.11 Comprobación con Python

Como programador, puedes verificar tus cálculos con el módulo estándar ipaddress.

```python
import ipaddress

# strict=False acepta una IP que no es la dirección de red
red = ipaddress.ip_network("172.30.23.0/20", strict=False)
print(red)                        # 172.30.16.0/20
print(red.broadcast_address)      # 172.30.31.255
print(red.num_addresses - 2)      # 4094
print(list(red.hosts())[0])       # 172.30.16.1
print(red.netmask, red.hostmask)  # 255.255.240.0 0.0.15.255

# Dividir 10.9.0.0/16 en 16 subredes
subredes = list(ipaddress.ip_network("10.9.0.0/16").subnets(new_prefix=20))
print(subredes[-1])               # 10.9.240.0/20

# ¿Misma red?
print(ipaddress.ip_address("192.168.123.133") in
      ipaddress.ip_network("192.168.123.64/26"))   # False
```

## 5. IPv6

### 5.1 Motivación y características

IPv6 está definido en la **RFC 8200** (2017), que sustituye a la RFC 2460 (1998). Nace por el agotamiento de IPv4: la IANA repartió sus últimos bloques en 2011 y RIPE NCC agotó su reserva en 2019.

- Direcciones de **128 bits** (16 bytes). **[Salió 2005, 2015, 2016]** Los distractores dicen "128 bytes", "32 bytes" o "40 bytes".
- **Cabecera simplificada y de longitud fija de 40 bytes**. **[Salió 2005]** Decir que tiene "cabecera de longitud variable" es falso.
- Las opciones van en **cabeceras de extensión** encadenadas.
- **Sin checksum de cabecera** (lo hacen el enlace y el transporte). En IPv6 el checksum de UDP pasa a ser obligatorio.
- **Sin fragmentación en los routers**: solo fragmenta el origen, tras descubrir la MTU de la ruta (PMTUD). MTU mínima: **1.280 bytes**.
- **Sin broadcast**: se usa multicast. Hay tres tipos de dirección: **unicast, multicast y anycast**. **[Salió 2005]** "Dos modos, unicast y multicast" es falso.
- **Autoconfiguración** sin estado (SLAAC) y con estado (DHCPv6).
- IPsec integrado en la especificación (hoy recomendado, ya no obligatorio desde la RFC 6434).
- Etiqueta de flujo para calidad de servicio.
- Movilidad mejorada (Mobile IPv6, RFC 6275).

### 5.2 Cabecera IPv6

| Campo | Bits | Equivale en IPv4 | Función |
|---|---|---|---|
| Versión | 4 | Versión | Vale 6 |
| Clase de tráfico (Traffic Class) | **8** | Tipo de servicio | Prioridad: DSCP 6 bits + ECN 2 bits |
| Etiqueta de flujo (Flow Label) | **20** | No existe | Identifica paquetes de un mismo flujo |
| Longitud de carga útil (Payload Length) | **16** (2 bytes) | Longitud total | Bytes tras la cabecera fija, extensiones incluidas |
| Siguiente cabecera (Next Header) | 8 | Protocolo | Tipo de la cabecera siguiente (extensión o transporte) |
| Límite de saltos (Hop Limit) | **8** | TTL | Se decrementa en cada router; a 0 se descarta |
| Dirección origen | 128 | Origen (32) | |
| Dirección destino | 128 | Destino (32) | |

Datos preguntados:

- Clase de Tráfico: **8 bits**. **[Salió 2015]**
- Payload Length: **16 bits = 2 bytes**. **[Salió 2008]**
- **Hop Limit** sustituye al TTL. Ocupa 8 bits, cada router lo resta en 1 y, al llegar a 0, descarta el paquete y envía un ICMPv6 Time Exceeded. **[Salió 2025]**
- Total: 4 + 8 + 20 + 16 + 8 + 8 = 64 bits (8 bytes) + 256 bits de direcciones (32 bytes) = **40 bytes**.

**Campos de IPv4 que desaparecen en IPv6**: IHL (la cabecera es fija), **identificación, indicadores y desplazamiento de fragmento** (pasan a la cabecera de extensión de **fragmento**), checksum y opciones (pasan a extensiones). **[Salió 2017]** La respuesta de 2017 fue "fragmento, que pasa a ser un tipo de cabecera de extensión". Etiqueta de flujo, longitud de carga útil y límite de saltos sí existen en la cabecera fija.

### 5.3 Cabeceras de extensión

Se encadenan con el campo Next Header. La RFC 8200 recomienda este orden:

| Orden | Cabecera | Next Header |
|---|---|---|
| 1 | Opciones salto a salto (Hop-by-Hop) | 0 |
| 2 | Opciones de destino (para el primer destino y los de Routing) | 60 |
| 3 | Encaminamiento (Routing) | 43 |
| 4 | **Fragmento** (Fragment) | 44 |
| 5 | Autenticación (AH) | 51 |
| 6 | Carga de seguridad encapsulada (ESP) | 50 |
| 7 | Opciones de destino (para el destino final) | 60 |
| 8 | Capa superior (TCP 6, UDP 17, ICMPv6 58) | |

- La cabecera de **fragmentación** es de extensión. **[Salió 2016]**
- Otras: Movilidad (135), HIP (139), Shim6 (140). "Sin siguiente cabecera" = 59.
- La única que procesan todos los routers del camino es **Hop-by-Hop**, y debe ir la primera.

### 5.4 Notación de direcciones IPv6

Ocho grupos de 16 bits en **hexadecimal**, separados por dos puntos: 2001:0db8:0000:0000:0000:ff00:0042:8329.

Reglas de abreviatura (RFC 4291 y RFC 5952):

1. Se pueden quitar los **ceros a la izquierda** de cada grupo: 0db8 pasa a db8; 0042 pasa a 42.
2. Una secuencia de grupos completos a cero se sustituye por **"::"**, pero **solo una vez** en toda la dirección.
3. RFC 5952 (forma canónica): letras en minúscula; "::" en la secuencia de ceros más larga; no usarlo para un único grupo.

Ejemplo: 2001:0db8:0000:0000:0000:ff00:0042:8329 se abrevia **2001:db8::ff00:42:8329**.

**Dirección errónea**: fe80::a00::27ff::fee9::ffac usa "::" varias veces y es ambigua. **[Salió 2015]**

El **prefijo** se escribe como en CIDR: 2001:db8:1234::/48. Una subred estándar de LAN es una **/64**: 64 bits de prefijo y 64 de identificador de interfaz. Un organismo suele recibir una /48, que da 2^16 = 65.536 subredes /64.

Direcciones IPv6 en URL: entre corchetes, http://[2001:db8::1]:8080/.

### 5.5 Tipos de direcciones IPv6

| Prefijo | Tipo | Notas |
|---|---|---|
| ::/128 | No especificada | Equivale a 0.0.0.0 |
| ::1/128 | Bucle local (loopback) | Equivale a 127.0.0.1 |
| ::ffff:0:0/96 | IPv4 mapeada | ::ffff:192.0.2.1 |
| 2000::/3 | Unicast global | Las enrutables en Internet (empiezan por 2 o 3) |
| 2001:db8::/32 | Documentación | No enrutable |
| 2001::/32 | Teredo | Túnel sobre UDP |
| 2002::/16 | 6to4 | Túnel automático |
| 64:ff9b::/96 | NAT64 | Traducción a IPv4 |
| fc00::/7 | Unicast local única (ULA) | Equivale a las privadas; en la práctica fd00::/8 |
| fe80::/10 | Enlace local (link-local) | Obligatoria en cada interfaz; no se enruta |
| fec0::/10 | Local de sitio | **Obsoleta** (RFC 3879) |
| **ff00::/8** | **Multicast** | Sustituye al broadcast |

- **Multicast IPv6: FF00::/8.** **[Salió 2016, 2019, 2022]** Distractores: ::1/128 (loopback), 224.0.0.0/4 (multicast IPv4), FC00::/7 (ULA), FE80::/10 (enlace local), FF80::/10 y FE00::/8 (inventados).
- El rango FF00::/8 es **multicast**. **[Salió 2016]**
- **Anycast**: misma dirección en varios nodos; llega al más cercano. Se toma del espacio unicast; no tiene prefijo propio.

Estructura de una dirección multicast: ff + 4 bits de indicadores + 4 bits de **ámbito** + 112 bits de identificador de grupo.

| Ámbito | Significado |
|---|---|
| ff01:: | Interfaz (nodo local) |
| ff02:: | Enlace local |
| ff05:: | Sitio |
| ff08:: | Organización |
| ff0e:: | Global |

Grupos que conviene saber:

- **ff02::1**: todos los nodos del enlace (lo más parecido al broadcast).
- **ff02::2**: todos los routers del enlace.
- **ff02::5 y ff02::6**: routers OSPFv3.
- **ff02::9**: routers RIPng.
- **ff02::1:2**: agentes DHCPv6.
- **ff02::1:ff00:0/104**: multicast de **nodo solicitado** (solicited-node), que usa NDP para sustituir a ARP.

En Ethernet, una multicast IPv6 se convierte en la MAC **33:33** seguida de los 32 bits de menor peso.

### 5.6 Autoconfiguración, EUI-64 y NDP

**NDP** (Neighbor Discovery Protocol, RFC 4861) funciona sobre ICMPv6. Sustituye a ARP, a ICMP Router Discovery y a ICMP Redirect.

| Tipo ICMPv6 | Mensaje | Uso |
|---|---|---|
| 133 | Router Solicitation (RS) | El host pide routers |
| 134 | Router Advertisement (RA) | El router anuncia prefijo y parámetros |
| 135 | Neighbor Solicitation (NS) | Equivale a la petición ARP; también para DAD |
| 136 | Neighbor Advertisement (NA) | Equivale a la respuesta ARP |
| 137 | Redirect | Indica un salto mejor |

- **SLAAC** (autoconfiguración sin estado, RFC 4862): el host toma el prefijo /64 del RA y genera su identificador de interfaz.
- **DAD** (detección de direcciones duplicadas): el host envía un NS para su propia dirección antes de usarla.
- **DHCPv6** (RFC 8415): autoconfiguración con estado. Usa los puertos UDP 546 (cliente) y 547 (servidor).
- **EUI-64 modificado**: a partir de la MAC de 48 bits se insertan **FFFE** en medio y se invierte el **séptimo bit** (bit U/L) del primer byte.

Ejemplo EUI-64 con la MAC 00:1A:2B:3C:4D:5E:

```text
MAC:                00:1A:2B   :   3C:4D:5E
Insertar FFFE:      00:1A:2B:FF:FE:3C:4D:5E
Invertir bit 7:     00 -> 02
Identificador:      021a:2bff:fe3c:4d5e
Enlace local:       fe80::21a:2bff:fe3c:4d5e
```

Por privacidad, los sistemas actuales generan identificadores aleatorios o estables (RFC 8981 y RFC 7217) en lugar de EUI-64.

### 5.7 Mecanismos de transición de IPv4 a IPv6

| Familia | Mecanismo | Idea |
|---|---|---|
| Doble pila | Dual stack | Cada equipo tiene IPv4 e IPv6 a la vez |
| Túnel manual | 6in4 | IPv6 dentro de IPv4 (protocolo 41), configurado a mano |
| Túnel automático | **6to4** (2002::/16) | Conecta **islas IPv6** a través de IPv4; obsoleto desde 2015 (RFC 7526) |
| Túnel automático | **Teredo** (2001::/32) | IPv6 dentro de UDP/IPv4; atraviesa NAT; de Microsoft |
| Túnel automático | ISATAP | Túnel dentro de un sitio IPv4 |
| Túnel de operador | 6rd | Variante de 6to4 con el prefijo del proveedor |
| Traducción | NAT64 + DNS64 | Hosts solo IPv6 acceden a servidores IPv4 |
| Traducción | 464XLAT | Usado en redes móviles |
| Traducción antigua | NAT-PT | Obsoleto |

- El mecanismo de **túneles automáticos IPv6 sobre IPv4 para conectar islas IPv6** es **6to4**. **[Salió 2016]** Distractores: "taredo" (mal escrito), proxmox y nuxeo (nada que ver).
- Un servidor puede tener IPv4 e IPv6 a la vez (doble pila). **[Salió 2015]**

## 6. ICMP y ARP

### 6.1 ICMP

**ICMP** (Internet Control Message Protocol, RFC 792) informa de errores y permite diagnosticar. Pertenece a la **capa de Internet** aunque viaja encapsulado en IP (protocolo 1). **[Salió 2024]** No usa puertos.

| Tipo | Mensaje | Uso típico |
|---|---|---|
| 0 | Respuesta de eco (Echo Reply) | Respuesta de ping |
| 3 | Destino inalcanzable | Códigos: 0 red, 1 host, 3 puerto, 4 hace falta fragmentar y DF activo |
| 4 | Source Quench | Control de congestión; **obsoleto** (RFC 6633) |
| 5 | Redirección (Redirect) | Hay un router mejor |
| 8 | Petición de eco (Echo Request) | Ping |
| 9 y 10 | Anuncio y solicitud de router | |
| 11 | Tiempo excedido | Código 0: TTL a cero en tránsito; código 1: reensamblado |
| 12 | Problema de parámetros | Cabecera errónea |
| 13 y 14 | Marca de tiempo | |

- **ping** envía Echo Request (8) y espera Echo Reply (0).
- **traceroute** envía paquetes con TTL 1, 2, 3... y recibe Time Exceeded (11) de cada router. En Linux usa por defecto UDP a puertos altos (33434 en adelante). En Windows, **tracert** usa ICMP Echo.
- **ICMPv6** (RFC 4443, Next Header 58): 1 destino inalcanzable, 2 paquete demasiado grande, 3 tiempo excedido, 4 problema de parámetros, 128 petición de eco, 129 respuesta de eco. Incluye NDP y MLD.

### 6.2 ARP

**ARP** (Address Resolution Protocol, RFC 826) obtiene la **dirección física (MAC) a partir de la dirección lógica (IP)**. **[Salió 2024]**

Funcionamiento:

1. El host consulta su **caché ARP**. Si la IP está, usa la MAC guardada.
2. Si no, envía una **petición ARP en difusión** (MAC destino ff:ff:ff:ff:ff:ff): "¿quién tiene 192.168.1.1?".
3. El dueño de esa IP contesta con una **respuesta ARP unicast** con su MAC.
4. El emisor guarda la pareja IP-MAC en la caché durante un tiempo.

Si el destino está en otra red, el host pide por ARP la MAC de su **puerta de enlace**, no la del destino.

- Va directamente sobre Ethernet (EtherType **0x0806**; IPv4 usa 0x0800 e IPv6 0x86DD). No usa IP.
- Capa: entre enlace y red. El examen de 2008 lo situó en la capa de **red**. **[Salió 2008]**
- **ARP gratuito**: un host anuncia su propia IP sin que nadie pregunte. Sirve para detectar duplicados y actualizar cachés tras una conmutación.
- **Proxy ARP**: un router responde en nombre de hosts de otra red.
- **ARP spoofing o envenenamiento**: un atacante responde con su MAC para interceptar tráfico. Se mitiga con Dynamic ARP Inspection en los switches.
- **InARP** (ARP inverso): obtiene la IP a partir de un identificador de circuito (Frame Relay, ATM).
- En **IPv6 no hay ARP**: lo sustituye **NDP** (mensajes NS y NA).

### 6.3 RARP, BOOTP y DHCP

- **RARP** (Reverse ARP, RFC 903) hace lo contrario: obtiene la **IP a partir de la MAC**. Lo usaban estaciones sin disco al arrancar. **[Salió 2018]** Está obsoleto.
- **BOOTP** (RFC 951) lo sustituyó, y después **DHCP** (RFC 2131), que es compatible con BOOTP.
- DHCP usa UDP **67 (servidor)** y **68 (cliente)**. Proceso **DORA**: Discover, Offer, Request, Acknowledge. El tema 27 lo desarrolla.
- El Discover es un broadcast y no atraviesa routers. Si el servidor DHCP está en otra subred o VLAN, el router hace de **agente de retransmisión (DHCP relay)**. En Cisco IOS se configura en la interfaz de la VLAN de los clientes (SVI) con **ip helper-address <IP del servidor DHCP>**. **[Salió 2025 b4]**

## 7. Capa de transporte: TCP y UDP

### 7.1 Puertos

Un **puerto** es un número de 16 bits (0 a 65.535) que identifica el proceso dentro de la máquina. Lo gestiona la **IANA**.

| Rango | Nombre | Uso |
|---|---|---|
| 0 a 1023 | Bien conocidos (well-known, de sistema) | Servicios estándar; en Unix requieren privilegios |
| 1024 a 49151 | Registrados (de usuario) | Aplicaciones registradas ante la IANA |
| 49152 a 65535 | Dinámicos o privados (efímeros) | Puertos origen temporales de los clientes |

UDP añade a IP, básicamente, el **direccionamiento de puertos** (multiplexación) y un checksum opcional. **[Salió 2008]**

### 7.2 Puertos bien conocidos que hay que saber

| Puerto | Transporte | Protocolo |
|---|---|---|
| 20 y 21 | TCP | FTP (20 datos en modo activo, 21 control) **[Salió 2017]** |
| 22 | TCP | SSH, SFTP, SCP |
| 23 | TCP | **Telnet** **[Salió 2015, 2017]** |
| 25 | TCP | **SMTP** (entre servidores) **[Salió 2017]** |
| 53 | UDP y TCP | **DNS** **[Salió 2015]** |
| 67 y 68 | UDP | DHCP y BOOTP (servidor y cliente) |
| 69 | UDP | TFTP |
| 80 | TCP | HTTP |
| 88 | TCP y UDP | Kerberos |
| 110 | TCP | **POP3** **[Salió 2017]** |
| 119 | TCP | NNTP (noticias) |
| **123** | **UDP** | **NTP** **[Salió 2017]** |
| 137 a 139 | UDP y TCP | NetBIOS (nombres, datagramas, sesión) |
| 143 | TCP | IMAP |
| 161 y 162 | UDP | SNMP (consultas y traps) |
| 179 | TCP | BGP |
| 389 | TCP y UDP | LDAP |
| 443 | TCP (y UDP para HTTP/3) | HTTPS |
| 445 | TCP | SMB/CIFS |
| 465 | TCP | SMTPS (envío con TLS implícito) |
| 514 | UDP | Syslog |
| 520 | UDP | RIP |
| 521 | UDP | RIPng |
| 546 y 547 | UDP | DHCPv6 |
| 587 | TCP | SMTP de envío (submission) |
| 636 | TCP | LDAPS |
| 646 | TCP y UDP | LDP (MPLS) |
| 853 | TCP (UDP en DoQ) | DNS sobre TLS (DoT) |
| 993 | TCP | IMAPS |
| 995 | TCP | POP3S |
| 1433 | TCP | Microsoft SQL Server |
| 1521 | TCP | Oracle |
| 1812 y 1813 | UDP | RADIUS |
| 3306 | TCP | MySQL y MariaDB |
| 3389 | TCP | RDP (escritorio remoto) |
| 5432 | TCP | PostgreSQL |
| 8080 | TCP | HTTP alternativo |

Trampas: SMTP **no** es 27 (2017). NTP no es 137 (NetBIOS) ni 143 (IMAP). Telnet no es 32. DNS no es 135 (RPC de Microsoft).

### 7.3 UDP

**UDP** (User Datagram Protocol, RFC 768).

- **Sin conexión** y **no fiable**: no hay acuses, retransmisiones, orden ni control de flujo o congestión. **[Salió 2019]**
- Orientado a mensajes: respeta los límites de cada datagrama.
- Cabecera fija de **8 bytes**: puerto origen (16), puerto destino (16), longitud (16) y checksum (16).
- El checksum es opcional en IPv4 y obligatorio en IPv6.
- Admite **difusión y multidifusión** (TCP no).
- Usos: DNS, DHCP, TFTP, SNMP, NTP, syslog, RIP, VoIP (RTP), streaming, juegos, QUIC.

Afirmación falsa de 2019: "UDP obliga al nivel de red a verificar que el envío es correcto". UDP no verifica nada ni obliga a IP a hacerlo.

### 7.4 TCP

**TCP** (Transmission Control Protocol). La especificación vigente es la **RFC 9293** (2022), que sustituye a la RFC 793 (1981).

- **Orientado a conexión**: establecimiento, transferencia y cierre.
- **Fiable**: números de secuencia, acuses de recibo (ACK) acumulativos, retransmisión por temporizador.
- Trabaja con un **flujo de bytes** (byte stream), no con mensajes. **[Salió 2019]**
- **Full dúplex** y **punto a punto** (sin multicast ni broadcast).
- **Control de flujo** con ventana deslizante: el receptor anuncia cuánto puede recibir.
- **Control de congestión**: el emisor adapta su ritmo a la red.
- Unidad: **segmento**.

#### Cabecera TCP

| Campo | Bits | Función |
|---|---|---|
| Puerto origen | 16 | |
| Puerto destino | 16 | |
| Número de secuencia | 32 | Posición del primer byte del segmento |
| Número de acuse (ACK) | 32 | Siguiente byte que se espera recibir |
| Longitud de cabecera (Data Offset) | 4 | En palabras de 32 bits; de 20 a 60 bytes |
| Reservado | 4 | |
| Indicadores (flags) | 8 | CWR, ECE, URG, ACK, PSH, RST, SYN, FIN |
| Ventana | 16 | Bytes que el receptor acepta (ampliable con la opción Window Scale) |
| Suma de comprobación | 16 | Cabecera, datos y pseudocabecera IP |
| Puntero urgente | 16 | Válido si URG está activo |
| Opciones | Variable | MSS, Window Scale, SACK, Timestamps |

Indicadores:

- **SYN**: sincronizar números de secuencia (abrir conexión).
- **ACK**: el campo de acuse es válido.
- **FIN**: el emisor ha terminado de enviar.
- **RST**: reiniciar o rechazar la conexión.
- **PSH**: entregar ya a la aplicación.
- **URG**: hay datos urgentes.
- **ECE y CWR**: notificación explícita de congestión (ECN).

#### Establecimiento: saludo en tres pasos (three-way handshake)

```text
Cliente                         Servidor
  | --- SYN, seq=x --------------> |   (LISTEN -> SYN-RECEIVED)
  | <-- SYN+ACK, seq=y, ack=x+1 -- |
  | --- ACK, ack=y+1 ------------> |   ESTABLISHED en ambos
```

#### Cierre: cuatro pasos

```text
A --- FIN ---> B
A <--- ACK --- B      (A queda en FIN-WAIT-2; B en CLOSE-WAIT)
A <--- FIN --- B      (B pasa a LAST-ACK)
A --- ACK ---> B      (A espera en TIME-WAIT 2 x MSL y cierra)
```

Estados TCP (11): CLOSED, LISTEN, SYN-SENT, SYN-RECEIVED, ESTABLISHED, FIN-WAIT-1, FIN-WAIT-2, CLOSE-WAIT, CLOSING, LAST-ACK y TIME-WAIT. Los ves con netstat o ss.

#### Control de congestión

- **Arranque lento (slow start)**: la ventana de congestión crece de forma exponencial hasta un umbral.
- **Evitación de la congestión**: a partir del umbral, crecimiento lineal (AIMD).
- **Retransmisión rápida**: con 3 ACK duplicados se retransmite sin esperar al temporizador.
- **Recuperación rápida** (TCP Reno).
- Algoritmos actuales: **CUBIC** (por defecto en Linux y Windows) y **BBR** (Google).

#### Otros mecanismos

- **MSS** (tamaño máximo de segmento): en Ethernet, 1.460 bytes (1.500 de MTU menos 20 de IP y 20 de TCP).
- **Algoritmo de Nagle**: agrupa datos pequeños; se desactiva con TCP_NODELAY.
- **Keep-alive (RFC 1122)**: segmento opcional que se envía tras un periodo de inactividad para **comprobar si la conexión con el otro extremo sigue activa**. **[Salió 2017]** El intervalo por defecto no debe ser menor de **2 horas**. No recibir respuesta a un único keep-alive no debe cortar la conexión. No se envía aleatoriamente.
- **SYN flood**: ataque que deja conexiones a medias. Se mitiga con SYN cookies.

### 7.5 TCP frente a UDP

| Aspecto | TCP | UDP |
|---|---|---|
| Conexión | Orientado a conexión | Sin conexión |
| Fiabilidad | Fiable (ACK, retransmisión) | No fiable |
| Orden | Garantizado | No garantizado |
| Unidad | Flujo de bytes (segmentos) | Mensajes (datagramas) |
| Cabecera | 20 a 60 bytes | 8 bytes |
| Control de flujo y congestión | Sí | No |
| Difusión y multidifusión | No | Sí |
| Velocidad y latencia | Mayor sobrecarga | Menor sobrecarga |
| Ejemplos | HTTP/1.1 y HTTP/2, SMTP, FTP, SSH | DNS, DHCP, SNMP, NTP, VoIP, QUIC |

### 7.6 Otros protocolos de transporte

- **SCTP** (RFC 9260): orientado a conexión y fiable, pero orientado a mensajes, con multiflujo (multistreaming) y multihoming. Se usa en señalización de telefonía (SIGTRAN, redes 4G y 5G).
- **QUIC** (RFC 9000, 2021): transporte fiable y cifrado (TLS 1.3) que funciona sobre **UDP**. Es la base de **HTTP/3** (RFC 9114). Reduce la latencia de establecimiento y evita el bloqueo de cabeza de línea.
- **DCCP**: datagramas con control de congestión.

## 8. DNS

### 8.1 Qué es y cómo se organiza

**DNS** (Domain Name System, RFC 1034 y 1035) traduce **nombres de dominio en direcciones IP** y viceversa. Es una base de datos **distribuida y jerárquica**.

- **Espacio de nombres** en árbol: raíz ("."), dominios de primer nivel (TLD), segundo nivel, subdominios. Ejemplo: www.sede.gob.es.
- **TLD genéricos** (gTLD: .com, .org, .net) y **territoriales** (ccTLD: .es, .fr). El .es lo gestiona **Red.es**.
- **Zona**: parte del árbol que administra un servidor con autoridad. Un dominio puede dividirse en varias zonas mediante **delegación**.
- **Servidores raíz**: 13 identidades lógicas (de a.root-servers.net a m.root-servers.net) con cientos de instancias anycast.
- **Servidor primario** (maestro): tiene la copia original de la zona. **Secundario** (esclavo): la copia mediante **transferencia de zona** (AXFR completa, IXFR incremental).
- **Servidor caché o recursivo**: resuelve por cuenta de los clientes y guarda las respuestas durante su **TTL**.
- **Resolver** (cliente DNS): biblioteca del sistema que hace las consultas.

### 8.2 Resolución

- **Consulta recursiva**: el cliente pide la respuesta completa a su servidor y este hace todo el trabajo.
- **Consulta iterativa**: el servidor contesta con una referencia ("pregunta a este otro") y el que consulta sigue preguntando.
- Lo habitual: el host hace una consulta recursiva a su servidor local; este hace consultas iterativas a raíz, TLD y servidor con autoridad.
- **Resolución inversa**: de IP a nombre con registros PTR en **in-addr.arpa** (IPv4, octetos al revés) e **ip6.arpa** (IPv6, nibbles al revés). Para 192.0.2.10 se consulta 10.2.0.192.in-addr.arpa.
- Antes de DNS se consulta el fichero **hosts** (/etc/hosts en Linux; C:\Windows\System32\drivers\etc\hosts en Windows).

Para que una impresora interna se llame por nombre basta un **servidor DNS local** donde se asocie ese nombre a su IP privada. **[Salió 2008]** No hace falta pedir nada al proveedor ni un registro MX.

### 8.3 Transporte y seguridad

- **Puerto 53**. **[Salió 2015]** Usa **UDP** para las consultas normales y **TCP** para transferencias de zona y respuestas grandes. EDNS(0) permite respuestas UDP de más de 512 bytes.
- **DNSSEC**: firma las zonas para garantizar autenticidad e integridad (no confidencialidad). Registros DNSKEY, RRSIG, DS, NSEC y NSEC3.
- **DoT** (DNS over TLS, RFC 7858): puerto **853/TCP**.
- **DoH** (DNS over HTTPS, RFC 8484): puerto **443**.
- **DoQ** (DNS over QUIC, RFC 9250): puerto 853/UDP.
- Ataques: envenenamiento de caché (Kaminsky), amplificación DDoS, túneles DNS, secuestro de dominios.

### 8.4 Tipos de registro (Resource Records)

| Registro | Contenido |
|---|---|
| **A** | Nombre a dirección IPv4 |
| **AAAA** | Nombre a dirección IPv6 |
| **CNAME** | **Nombre canónico**: alias de otro nombre **[Salió 2015]** |
| **MX** | **Servidor de correo** del dominio, con prioridad (menor valor = más preferente) **[Salió 2015]** |
| **NS** | **Servidores de nombres con autoridad** de la zona **[Salió 2015]** |
| **SOA** | **Inicio de autoridad**: datos básicos de la zona **[Salió 2019]** |
| **PTR** | Puntero para resolución inversa (IP a nombre) |
| **TXT** | Texto libre: SPF, DKIM, DMARC, verificación de dominio |
| **SRV** | Localización de servicios (_ldap._tcp.ejemplo.es), con prioridad, peso y puerto. Lo usa Active Directory |
| **CAA** | Qué autoridades de certificación pueden emitir certificados para el dominio |
| **NAPTR** | Reescritura de nombres (VoIP, ENUM) |
| **DNSKEY, RRSIG, DS, NSEC** | DNSSEC |
| **HTTPS y SVCB** | Parámetros de conexión de servicios (RFC 9460) |
| **HINFO, LOC, RP** | Hardware y SO, ubicación geográfica, persona responsable |

El **SOA** contiene: servidor primario, correo del responsable, **número de serie**, refresh, retry, expire y TTL mínimo (caché negativa). Cada zona tiene exactamente un SOA.

No existe un registro "MAIL" (distractor de 2015). TSIG y TKEY sirven para firmar o acordar claves de transacción; no son el CNAME.

Ejemplo de fichero de zona de BIND:

```text
$TTL 86400
@       IN  SOA  ns1.ejemplo.es. admin.ejemplo.es. (
                 2026101901 ; serie
                 3600       ; refresh
                 900        ; retry
                 604800     ; expire
                 300 )      ; TTL negativo
        IN  NS   ns1.ejemplo.es.
        IN  NS   ns2.ejemplo.es.
        IN  MX   10 correo.ejemplo.es.
ns1     IN  A    192.0.2.1
correo  IN  A    192.0.2.25
www     IN  A    192.0.2.80
www     IN  AAAA 2001:db8::80
portal  IN  CNAME www.ejemplo.es.
```

### 8.5 Herramientas de diagnóstico DNS

- **nslookup**: herramienta de consulta DNS disponible en Windows y en Unix. **[Salió 2006]**
- Sintaxis: nslookup [nombre o IP a resolver] [servidor DNS al que preguntar]. **[Salió 2016]** "nslookup 81.89.32.200 10.31.15.6" resuelve la primera IP preguntando al servidor 10.31.15.6.
- **dig** (Linux): más completo. dig ejemplo.es MX, dig -x 192.0.2.1 (inversa), dig @8.8.8.8 ejemplo.es, dig +trace ejemplo.es.
- **host** (Linux): consulta sencilla.
- **ipconfig /displaydns** muestra la caché DNS de Windows. **ipconfig /flushdns** la **vacía (purga)**. **[Salió 2016]**
- En Linux con systemd: resolvectl flush-caches (antes systemd-resolve --flush-caches).
- En PowerShell: Resolve-DnsName y Clear-DnsClientCache.

```text
C:\> nslookup www.ejemplo.es 10.31.15.6
Servidor:  dns1.organismo.local
Address:  10.31.15.6

Respuesta no autoritativa:
Nombre:  www.ejemplo.es
Address:  192.0.2.80
```

"Respuesta no autoritativa" significa que la respuesta viene de la caché de un servidor que no tiene autoridad sobre la zona.

## 9. Encaminamiento IP

El encaminamiento no aparece literalmente en el epígrafe, pero se ha preguntado una decena de veces (2015-2019). Conviene dominarlo.

### 9.1 Tabla de rutas y reenvío

- Cada router decide el **siguiente salto** consultando su **tabla de rutas**: destino, máscara, puerta de enlace (siguiente salto), interfaz y métrica.
- Regla de la **coincidencia más larga** (longest prefix match): si varias rutas coinciden, gana la de prefijo más largo.
- **Ruta por defecto**: 0.0.0.0/0 (en IPv6, ::/0). Se usa si nada más coincide.
- **Encaminamiento estático**: rutas puestas a mano. Adecuado para redes pequeñas o con una sola salida.
- **Encaminamiento dinámico**: los routers intercambian rutas con un protocolo.

Para preguntas de tabla de rutas (2007 b4 44, 2008 b4 39): aplica la máscara de cada entrada a la IP destino. Si el resultado coincide con el destino de la entrada, la ruta vale. Entre varias válidas, la de prefijo más largo.

### 9.2 Clasificación de los protocolos de encaminamiento

Por ámbito:

- **IGP** (de pasarela interior): dentro de un sistema autónomo (AS). RIP, OSPF, IS-IS, EIGRP.
- **EGP** (de pasarela exterior): entre sistemas autónomos. **BGP-4** es el único en uso (RFC 4271).

Por algoritmo:

- **Vector de distancia**: cada router envía periódicamente su tabla a los vecinos. Algoritmo de **Bellman-Ford**. Conoce la red "de oídas". Ejemplos: **RIP**, **IGRP**. **[Salió 2019]**
- **Estado de enlace**: cada router conoce la topología completa (base de datos LSDB) y calcula el camino más corto con **Dijkstra (SPF)**. Ejemplos: **OSPF**, **IS-IS**, OLSR (redes ad hoc). **[Salió 2015, 2016]**
- **Vector de caminos** (path vector): **BGP**. Guarda la lista de AS atravesados.
- **Vector de distancia avanzado o híbrido**: **EIGRP** de Cisco (algoritmo DUAL).

### 9.3 Comparativa de protocolos

| Protocolo | Tipo | Métrica | Transporte | Norma | Notas |
|---|---|---|---|---|---|
| RIPv1 | IGP, vector distancia | Saltos (máx. 15) | UDP 520 | RFC 1058 | Classful, difusión |
| RIPv2 | IGP, vector distancia | Saltos (máx. 15) | UDP 520, multicast 224.0.0.9 | RFC 2453 | Classless (VLSM), autenticación |
| RIPng | IGP, vector distancia | Saltos | UDP 521, ff02::9 | **RFC 2080** | **Para IPv6** **[Salió 2018]** |
| IGRP | IGP, vector distancia | Compuesta (ancho de banda, retardo) | IP 9 | Cisco | Obsoleto |
| EIGRP | IGP, vector distancia avanzado | Compuesta | IP 88 | Cisco (RFC 7868 informativa) | DUAL |
| OSPFv2 | IGP, estado de enlace | Coste (según ancho de banda) | IP 89, 224.0.0.5 y .6 | RFC 2328 | Áreas, área 0 troncal |
| OSPFv3 | IGP, estado de enlace | Coste | IP 89, ff02::5 y ::6 | RFC 5340 | **Soporta IPv6** **[Salió 2017]** |
| IS-IS | IGP, estado de enlace | Coste | Directo sobre enlace | ISO 10589 | Operadores |
| BGP-4 | EGP, vector de caminos | Atributos (AS_PATH...) | **TCP 179** | RFC 4271 | Internet |

Detalles de RIP:

- Métrica: **número de saltos**. Máximo 15; **16 = infinito** (inalcanzable). Por eso solo vale para redes pequeñas.
- Envía la tabla completa **cada 30 segundos**.
- Convergencia lenta y problema de la **cuenta al infinito**. Soluciones: **horizonte dividido** (split horizon), envenenamiento de ruta inversa (poison reverse), temporizadores de espera (hold-down) y actualizaciones disparadas. **[Salió 2016]**
- Adecuado cuando hay **pocas sedes**. **[Salió 2008]**

Detalles de OSPF:

- OSPF = **Open Shortest Path First**. **[Salió 2015]** El distractor dice "Open Software Path First".
- Usa el algoritmo de **Dijkstra**. **[Salió 2015]**
- Va **directamente sobre IP** con número de protocolo **89** (no 98). **[Salió 2015]** No usa TCP ni UDP.
- OSPFv2 está en la RFC 2328 (no en la 1202). **[Salió 2017]** OSPF para IPv6 (OSPFv3) está en la RFC 5340 (no en la 5430). **[Salió 2015]**
- Es de pasarela **interior**, no exterior. **[Salió 2017]**
- Jerarquía en **áreas**; el **área 0** es la troncal (backbone). Elige un router designado (DR) y uno de reserva (BDR) en redes multiacceso.
- Envía actualizaciones solo cuando hay cambios (LSA) y paquetes Hello periódicos. Converge rápido.
- Es el protocolo adecuado cuando el enunciado pide "estado de enlace" para routers nuevos. **[Salió 2016]** "SPF" a secas es el nombre del algoritmo, no un protocolo.

**Distancia administrativa** (Cisco, menor es mejor): conectada 0, estática 1, eBGP 20, EIGRP interno 90, IGRP 100, OSPF 110, IS-IS 115, RIP 120, iBGP 200.

### 9.4 Redundancia de la puerta de enlace (FHRP)

Varios routers comparten una **IP virtual** que los hosts usan como puerta de enlace. Si el activo cae, otro toma la IP.

| Protocolo | Propiedad | Balanceo de carga | Detalles |
|---|---|---|---|
| **VRRP** | Estándar IETF (RFC 5798, VRRPv3) | No por sí mismo | Router maestro y de respaldo; IP 112; 224.0.0.18 **[Salió 2015]** |
| **HSRP** | **Propietario de Cisco** | No (solo activo y en espera) | UDP 1985 |
| **GLBP** | **Propietario de Cisco** | **Sí** | Varios routers reenvían a la vez **[Salió 2015]** |
| CARP | OpenBSD, libre | Parcial | Alternativa libre a VRRP |

RARP, LACP (agregación de enlaces), SQUID (proxy), Exim y Postfix (correo) son distractores de 2015.

### 9.5 IP móvil

**IP móvil** (Mobile IP, RFC 5944 para IPv4 y RFC 6275 para IPv6) permite que un equipo se mueva entre redes **conservando su dirección IP** y sus conexiones. **[Salió 2006]**

- **Agente local** (home agent): en la red de origen; recibe el tráfico y lo reenvía por túnel.
- **Agente foráneo** (foreign agent, solo en IPv4): en la red visitada.
- **Dirección de auxilio** (care-of address): dirección temporal en la red visitada.

## 10. Comandos de red

| Tarea | Windows | Linux |
|---|---|---|
| Ver IP y configuración | **ipconfig**, ipconfig /all | **ip addr** (ip a), ifconfig (obsoleto) |
| Ver la MAC | **getmac**, ipconfig /all | ip link, ifconfig |
| Renovar DHCP | ipconfig /release y /renew | dhclient -r y dhclient |
| Caché DNS | ipconfig /displaydns, /flushdns | resolvectl flush-caches |
| Consultar DNS | nslookup, Resolve-DnsName | nslookup, dig, host |
| Caché ARP | arp -a | ip neigh, arp -n |
| Conectividad | ping | ping (ping6 o ping -6) |
| Ruta seguida | **tracert**, pathping | **traceroute**, tracepath, mtr |
| Tabla de rutas | route print, netstat -r | ip route, route -n |
| Ruta efectiva hacia un destino | Find-NetRoute -RemoteIPAddress | **ip route get <IP>** |
| Probar un puerto TCP | Test-NetConnection -Port | **nc -vz <IP> <puerto>** |
| Conexiones y puertos | netstat -ano | ss -tulpn, netstat -tulpn |
| Nombre del equipo | hostname | hostname |
| NetBIOS | nbtstat | nmblookup |

- **getmac** obtiene la MAC **en Windows**. **[Salió 2017]** Los distractores cruzaban sistemas: "ipconfig /all (en Unix)" e "ifconfig (en Windows)".
- Para ver la IP asignada por DHCP en Windows: **ipconfig** en cmd. No hace falta ser administrador. **[Salió 2015]** La ventana de propiedades TCP/IP solo muestra "obtener automáticamente".
- **hostname** muestra el nombre del equipo; **nbtstat** es de NetBIOS; ninguno diagnostica DNS. **[Salió 2006]**
- **ip route get 10.30.20.30** muestra la ruta que el kernel usaría para ese destino (interfaz de salida, next hop y IP origen); ip route show lista la tabla entera. **nc -vz IP puerto** (netcat) prueba si un puerto TCP acepta conexiones sin necesidad del cliente de la aplicación (-z solo escanea, -v informa). **[Salió 2025 b4]**

```bash
$ ip -4 addr show eth0
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500
    inet 192.168.1.20/24 brd 192.168.1.255 scope global eth0

$ ip route
default via 192.168.1.1 dev eth0
192.168.1.0/24 dev eth0 proto kernel scope link src 192.168.1.20

$ ss -tln
State   Recv-Q  Send-Q  Local Address:Port  Peer Address:Port
LISTEN  0       128     0.0.0.0:22          0.0.0.0:*
```

## 11. NTP y otros servicios de soporte

- **NTP** (Network Time Protocol) **sincroniza los relojes** de los sistemas. **[Salió 2005]** Usa **UDP 123**. **[Salió 2017]** Versión actual NTPv4 (RFC 5905). Organiza los servidores en **estratos**: estrato 0 = reloj de referencia (atómico, GPS), estrato 1 = servidor conectado a él. En España, la hora oficial la difunde el Real Instituto y Observatorio de la Armada (ROA).
- NNTP (noticias, 119), TFTP (transferencia trivial, UDP 69) y SMTP (correo, 25) son distractores.
- SNTP es la versión simplificada de NTP.
- PTP (IEEE 1588) da precisión de microsegundos en redes industriales.

## Trampas y respuestas desactualizadas

- **La IP del enunciado no es la red.** 172.30.23.0/20 tiene como red 172.30.16.0 (2018). 172.17.8.0/21 sí es dirección de red (2016). Calcula siempre la red antes de contestar.
- **La clase no depende del prefijo.** 10.0.4.0/25 es clase A; 172.30.23.0/20 es clase B. El direccionamiento con clases es histórico, pero sigue preguntándose.
- **Broadcast sin máscara = máscara de la clase.** 34.254.0.17 sin máscara da 34.255.255.255 (2017).
- **600 subredes: mira el prefijo de partida.** 10 bits de subred desde una /8 dan /18 (plantilla 2025 ej1 73); /26 solo sería correcto partiendo de una /16.
- **Olvidar restar 2.** 4.096 frente a 4.094 (2024) o 2.048 frente a 2.046 (2016). Las opciones incluyen siempre la cifra sin restar.
- **Octetos de máscara imposibles.** 216, 236, 194, 196, 190 o 223 descartan la opción sin calcular nada.
- **2^n o 2^n - 2 subredes.** Las respuestas antiguas (2007, 2008) se diseñaron para que ambos criterios coincidan. Hoy se usa 2^n (RFC 1878, subred cero permitida). Si una pregunta nueva dice "excluyendo la subred cero y la de todos unos", usa 2^n - 2.
- **RARP frente a ARP.** IP a MAC = ARP (2024). MAC a IP = RARP (2018). Leer al revés es el error más común. RARP está obsoleto: hoy esa función la cubren BOOTP y DHCP.
- **Capa de MAC y LLC**: enlace, no sesión ni red (2016, 2024).
- **Capas TCP/IP**: cuatro, sin sesión. TCP y UDP en transporte, ICMP en Internet (2024). Algunos libros cuentan cinco; las opciones con "Sesión" son falsas.
- **Primitivas**: servicio confirmado = 4; no confirmado = 2, no 3 (2022).
- **Dirección de servicio**: la capa N sirve a la N+1, nunca al revés (2018, 2022).
- **IPv4 no es orientado a conexión** (2018). TCP sí lo es; IP no.
- **Prefijos IPv6 parecidos.** FF00::/8 multicast; FE80::/10 enlace local; FC00::/7 ULA; FEC0::/10 local de sitio obsoleto. FF80::/10 y FE00::/8 no son nada.
- **Local de sitio (fec0::/10) está obsoleta** desde la RFC 3879 (2004). Si un temario antiguo la presenta como equivalente a las privadas, la equivalencia actual es **ULA fc00::/7**.
- **6to4 y Teredo** existen, pero 6to4 está desaconsejado desde 2015 (RFC 7526). Pueden seguir preguntándolos como "mecanismo de túnel automático".
- **RFC de IPv6.** La vigente es la RFC 8200 (2017). Las respuestas que citen la RFC 2460 estaban bien antes de 2017.
- **RFC de TCP.** La vigente es la RFC 9293 (2022), no la RFC 793. Si una opción dice "TCP se define en la RFC 793", es dato histórico.
- **ICMP Source Quench** está obsoleto (RFC 6633, 2012).
- **IPsec en IPv6**: antes "obligatorio"; desde la RFC 6434 (2011) solo recomendado. Una opción que diga "IPsec es obligatorio en IPv6" es discutible hoy.
- **OSPF**: Open **Shortest** Path First; protocolo IP 89; RFC 2328 (v2) y RFC 5340 (v3). Distractores con números cambiados: 98, RFC 1202, RFC 5430.
- **RIPng**: RFC 2080 y UDP 521. Distractores: RFC 2180, TCP, puerto 646 (LDP).
- **Vector distancia**: RIP e IGRP. OSPF, IS-IS y OLSR son de estado de enlace. EIGRP es "híbrido" o vector distancia avanzado.
- **Puertos cambiados**: SMTP 25 (no 27), Telnet 23 (no 32), NTP 123 (no 137 ni 143), DNS 53 (no 135).
- **Comandos cruzados**: getmac e ipconfig son de Windows; ifconfig e ip son de Linux (2017).
- **ifconfig está obsoleto** en la mayoría de distribuciones Linux. Se sustituye por ip (paquete iproute2). netstat se sustituye por ss.
- **Multicast y tarjeta de red.** La tarjeta no puede filtrar perfectamente grupos IP multicast porque 32 grupos comparten MAC. Quien termina de filtrar es la capa de red (2008 b4 3).
- **Loopback**: todo 127.0.0.0/8, no solo 127.0.0.1. Ping no se basa en "devolver sin procesar" (2015).
- **Direcciones privadas**: 172.16 a 172.31, no 172.16 a 172.32. 128.x no está "reservado para servidores web" (2008).
