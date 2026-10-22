# Tema 29. Comunicaciones e inalámbricas

Peso en el examen: unas **3,1 preguntas de test** por convocatoria y **0 de supuesto III** (unos 1,9 puntos esperados). Hay **90 preguntas históricas** (2005-2025): 63 de test y 27 de supuesto del Bloque IV, que tú no harás pero sirven como práctica. La tendencia es ligeramente a la baja, con 2-4 preguntas de test al año. Las preguntas se concentran en cinco zonas: **Wi-Fi 802.11** (estándares, bandas, nombres comerciales, seguridad), **cableado** (categorías de par trenzado y tipos de fibra), **PoE**, **telefonía móvil** (2G a 5G, dividendo digital) y **equipos de interconexión por capa OSI**. ATM, Frame Relay y RDSI cayeron mucho hasta 2008 y hoy están obsoletos.

## Cómo lo preguntan

- **Estándar IEEE por número o letra**: "estándar comercializado como Wi-Fi 6" (2019), "WiMAX" (2016), "redes PAN" (2015), "fast BSS transition" (2015), "ámbito de 802.11" (2024).
- **Señalar la INCORRECTA o la que NO pertenece**: afirmaciones sobre Wi-Fi (2007, 2019), POF (2022), "no es LPWAN" (2024), "no es topología inalámbrica" (2017), "no es de telefonía IP" (2018).
- **Tabla de valores exactos**: ancho de banda de Cat 6 (2015), categoría para 10 Gbps a 500 MHz (2018), Cat 8 para 30 Gbps (2019), velocidad de 802.11n (2015), 802.11ac a 7 Gbps (2015), HSDPA 14,4 Mbps (2008).
- **Pequeños cálculos**: bits de paridad impar (2018), enlace mínimo para vídeo con overhead (2008), clientes por punto de acceso (2008).
- **Siglas y potencias de PoE**: 70 W con 802.3bt (2019), tipos 3 y 4 de PoE++ (2022).
- **Bandas y frecuencias**: 802.11g a 2,4 GHz (2016), estándar en 2,4/5/6 GHz (2022), segundo dividendo digital en 700 MHz (2018), canales de BLE (2025).
- **Orden o clasificación**: evolución GSM, GPRS, UMTS, HSDPA, LTE (2016); tipos de fibra según propagación (2016).
- **Supuesto IV aplicado**: "qué dispositivo uso para unir la red coaxial con Ethernet" (2024), "qué necesito para WPA3-Enterprise" (2024).

## 1. Conceptos básicos de transmisión

### Señal, ancho de banda y capacidad

- **Ancho de banda (Hz)**: rango de frecuencias que deja pasar un medio. No es lo mismo que la velocidad (bit/s), aunque coloquialmente se confunda.
- **Velocidad de transmisión (bit/s)** frente a **velocidad de modulación (baudios)**: un baudio es un cambio de símbolo. Si cada símbolo lleva n bits, bit/s = baudios × n.
- **Teorema de Nyquist** (canal sin ruido): C = 2B · log2(M), siendo M el número de niveles.
- **Teorema de Shannon** (canal con ruido): C = B · log2(1 + S/N). Fija el límite teórico absoluto de un canal.
- **Atenuación**: pérdida de potencia con la distancia (se mide en dB/km o dB/100 m). La fibra óptica atenúa mucho menos que el cobre **[Salió 2007]**.
- **Interferencias**: diafonía (*crosstalk*, NEXT y FEXT) entre pares, ruido electromagnético (EMI), ruido térmico.

### Banda base y banda ancha

- **Banda base**: la señal digital se envía con una **codificación** de línea (NRZ, Manchester, 4B5B, PAM), sin desplazarla en frecuencia. Ethernet es banda base (el "BASE" de 1000BASE-T).
- **Banda ancha**: la señal se **modula** sobre una portadora y se desplaza en frecuencia. Permite varios canales en el mismo medio **[Salió 2008: en banda ancha se usan técnicas de modulación]**.
- Modulaciones digitales: **ASK** (amplitud), **FSK** (frecuencia), **PSK** (fase) y **QAM** (amplitud y fase). Wi-Fi 6 usa 1024-QAM (10 bits por símbolo) y Wi-Fi 7 4096-QAM (12 bits).

### Multiplexación

| Técnica | Qué reparte | Ejemplo |
|---|---|---|
| FDM | Frecuencia | Radio FM, ADSL (voz y datos) |
| TDM | Tiempo (ranuras) | E1/T1, PDH, SDH, GSM (TDMA) |
| WDM (CWDM, DWDM) | Longitud de onda en fibra | Redes troncales, PON |
| CDM (CDMA) | Códigos ortogonales | UMTS (W-CDMA) |
| OFDM / OFDMA | Muchas subportadoras ortogonales | Wi-Fi a/g/n/ac/ax, LTE, 5G, DVB-T |

- **Espectro ensanchado**: FHSS (salto de frecuencia, Bluetooth) y DSSS (secuencia directa, 802.11b) **[Salió 2007: 802.11b usa espectro ensanchado]**.

## 2. Modos de comunicación

### Según el sentido

| Modo | Descripción | Ejemplo |
|---|---|---|
| Símplex | Un solo sentido, siempre | Radiodifusión TV, teletexto |
| Semidúplex (half duplex) | Ambos sentidos, pero no a la vez | Walkie-talkie, Ethernet con hub, Wi-Fi |
| Dúplex (full duplex) | Ambos sentidos a la vez | Teléfono, Ethernet conmutada |

- **[Salió 2008]** Half duplex: cada nodo puede transmitir o recibir, pero no al mismo tiempo.
- Ojo con el idioma: en terminología ITU-T antigua "símplex" significaba a veces semidúplex. En el examen, símplex es unidireccional.
- Para full duplex en el mismo medio se usa FDD (frecuencias distintas) o TDD (ranuras de tiempo). LTE y 5G admiten ambos.

### Serie y paralelo; síncrona y asíncrona

- **Serie**: un bit tras otro por una línea (USB, SATA, Ethernet). **Paralelo**: varios bits a la vez (antiguo puerto de impresora, PATA).
- **Asíncrona**: cada carácter lleva bit de inicio y bit(s) de parada (RS-232). Reloj no compartido.
- **Síncrona**: bloques o tramas largas con reloj sincronizado o recuperado (HDLC, SDH, Ethernet).

### Control de errores

- **Paridad**: se añade un bit para que el número de unos sea par (paridad par) o impar (paridad impar). Detecta errores de un número impar de bits. No corrige.
- **Suma de comprobación (checksum)**: usada en cabeceras IP, TCP y UDP.
- **CRC (código de redundancia cíclica)**: división polinómica; detecta ráfagas de errores con gran eficacia. Ethernet usa CRC-32 en el campo FCS. El CRC **detecta**, no corrige **[Salió 2006]**.
- **Códigos correctores (FEC)**: Hamming, Reed-Solomon, LDPC (Wi-Fi 6, 5G), códigos polares (control en 5G). Corrigen sin retransmitir.
- **ARQ**: el receptor detecta y pide retransmisión. Variantes: parada y espera, retroceso N (*go-back-N*), repetición selectiva.
- **Ventana deslizante** (HDLC, LAPB, LAPD, TCP): número máximo de tramas que pueden estar enviadas y pendientes de asentimiento **[Salió 2006]**.

Ejemplo de paridad **[Salió 2018]**:

```text
Trama A: 0111011  -> cinco unos (ya es impar) -> bit de paridad impar = 0
Trama B: 0011100  -> tres unos (ya es impar)  -> bit de paridad impar = 0
Respuesta: A:0; B:0
Con paridad PAR serían A:1; B:1
```

Regla rápida: cuenta los unos. Paridad impar: el bit vale 0 si ya hay un número impar de unos y 1 si no. Paridad par: al revés.

## 3. Medios de transmisión

### Guiados y no guiados

- **Guiados**: la señal viaja confinada en un medio físico (par trenzado, coaxial, fibra).
- **No guiados**: la señal se propaga por el aire o el vacío. Necesitan **antenas** que emitan y capten la señal **[Salió 2018: en los no guiados es necesario el uso de dispositivos que emitan o capten la señal]**.
- El aire sí es un medio para datos (radio, microondas, satélite). Un "cable RJ-3" no existe **[Salió 2008]**.

### Par trenzado

Pares de cobre trenzados para reducir diafonía y EMI. Conector **RJ-45** (8P8C). Cuatro pares. Impedancia de 100 ohmios. Distancia máxima del canal: **100 m** (90 m enlace permanente + 10 m de latiguillos).

Nomenclatura de apantallamiento (ISO/IEC 11801): **X/YTP**, donde X es la pantalla global e Y la de cada par.

- **U/UTP**: sin apantallar (el UTP clásico).
- **F/UTP** (antes FTP): pantalla global de lámina (*foil*).
- **S/FTP**: malla global y lámina en cada par (típico de Cat 7).
- **STP**: término genérico de par apantallado. Se elige cuando hay interferencias eléctricas **[Salió 2008: Cat 6 STP para 1 Gbps protegido ante interferencias]**.

Tabla clave de categorías (memorízala):

| Categoría | Clase ISO | Frecuencia | Uso típico | Notas |
|---|---|---|---|---|
| Cat 3 | C | 16 MHz | 10BASE-T, voz | Obsoleta para datos |
| Cat 5 | (D antigua) | 100 MHz | 100BASE-TX | Retirada de la norma |
| Cat 5e | D | 100 MHz | 1000BASE-T a 100 m; también 2,5G y 5GBASE-T | Mínimo actual para datos |
| Cat 6 | E | **250 MHz** | 1 Gbps a 100 m; 10GBASE-T solo a 37-55 m | **[Salió 2015]** |
| Cat 6A | EA | **500 MHz** | **10GBASE-T a 100 m** | **[Salió 2018]** |
| Cat 7 | F | 600 MHz | 10 Gbps; conector GG45 o TERA | Solo ISO, TIA no la reconoce |
| Cat 7A | FA | 1000 MHz | 10 Gbps y más | Solo ISO |
| Cat 8 (8.1 y 8.2) | I y II | **2000 MHz** | **25GBASE-T y 40GBASE-T a 30 m** | **[Salió 2019: 30 Gbps exige Cat 8]** |

- Para 1 Gbps por puesto basta Cat 5e; se suele recomendar Cat 6 **[Salió 2008, 2007]**.
- Cat 8 solo llega a 30 m: está pensada para centros de datos (de servidor a switch de rack).
- 802.3bz (2016) permite 2,5GBASE-T sobre Cat 5e y 5GBASE-T sobre Cat 6, a 100 m. Útil para puntos de acceso Wi-Fi 6.

### Normas de cableado estructurado

- **ANSI/TIA-568**: norma estadounidense. Versión vigente: **TIA-568-E** (2020), con partes 568.0-E, 568.1-E, 568.2-E (cobre), 568.3-E (fibra). Las preguntas antiguas citan la 568-B y la 568-C **[Salió 2018, 2019]**.
- **ISO/IEC 11801**: norma internacional. Versión actual: ISO/IEC 11801-1:2017 y siguientes partes. Usa "clases" (D, E, EA, F, FA, I, II) **[Salió 2007: ISO/IEC 11801 con UTP Cat 5e o Cat 6]**.
- **EN 50173**: equivalente europea (CENELEC).
- TIA-569 (canalizaciones y espacios), TIA-606 (etiquetado y administración), TIA-607 (puesta a tierra), **TIA-942** (centros de datos).
- Subsistemas: cableado de campus, troncal o vertical (*backbone*, entre plantas, suele ser fibra), horizontal (planta, hasta la roseta), área de trabajo.
- Esquemas de conexión del RJ-45: **T568A** y **T568B**. Cable directo: mismo esquema en ambos extremos. Cable cruzado: A en un extremo y B en el otro (hoy innecesario por Auto-MDI/MDIX).
- Trampa: "ANSI/EIA/TIA 11801" no existe. 11801 es ISO/IEC **[Salió 2007]**.

### Cable coaxial

- Conductor central de cobre, **aislante dieléctrico**, malla conductora y cubierta exterior **[Salió 2008]**.
- 50 ohmios: RG-8 (10BASE5, *thick Ethernet*) y RG-58 (10BASE2, *thin Ethernet*). Ambos obsoletos en LAN.
- 75 ohmios: RG-6 y RG-59. Televisión, CCTV analógico y redes de cable (HFC, DOCSIS).
- Para unir una red coaxial de cámaras a Ethernet hace falta un equipo que traduzca entre redes distintas: pasarela o convertidor (EoC, Ethernet over Coax) **[Salió 2024]**.

### Fibra óptica

Transmite luz por un **núcleo** de vidrio (o plástico) rodeado de un **revestimiento** (*cladding*) de menor índice de refracción. La luz se guía por **reflexión total interna**.

Ventajas frente al cobre **[Salió 2007, 2008]**:

- Inmunidad total a interferencias electromagnéticas (es dieléctrica). Es el medio con **mayor inmunidad EMI**.
- Menor atenuación y mayor ancho de banda y distancia.
- Menor tamaño y peso; no conduce electricidad; difícil de pinchar.
- Inconvenientes: fragilidad, coste de empalmes y conectores, no transporta energía.

Clasificación **según el modo de propagación** **[Salió 2016, 2005]**:

| Tipo | Núcleo/revestimiento | Fuente de luz | Distancia | Ventanas |
|---|---|---|---|---|
| Monomodo (SMF) | 9/125 µm | Láser | Decenas de km | 1310 y 1550 nm |
| Multimodo (MMF) | 50/125 o 62,5/125 µm | LED o VCSEL | Cientos de metros | 850 y 1300 nm |

- La monomodo transmite a mayor distancia y con menos pérdidas que la multimodo **[Salió 2005]**.
- **Según el perfil del índice**: índice escalonado (*step index*) o índice gradual (*graded index*). La multimodo moderna es de índice gradual; la monomodo es de índice escalonado. Por tanto, "monomodo = índice gradual" es falso **[Salió 2005]**.
- Colores de cubierta habituales (TIA-598): amarillo monomodo, naranja OM1 y OM2, aguamarina OM3 y OM4 (OM4 a veces violeta), verde lima OM5. No son obligatorios: "monomodo siempre naranja" es falso **[Salió 2005]**.

Tipos ISO/IEC 11801 y alcance en 10 Gigabit Ethernet:

| Tipo | Clase | 10GBASE-SR/LR (aprox.) |
|---|---|---|
| OM1 | Multimodo 62,5 µm | 33 m |
| OM2 | Multimodo 50 µm | 82 m |
| OM3 | Multimodo 50 µm optimizada para láser | 300 m |
| OM4 | Multimodo 50 µm | 400 m (hasta 550 m según fabricante) |
| OM5 | Multimodo banda ancha (SWDM) | 400 m; pensada para varias longitudes de onda |
| OS1 / OS2 | Monomodo | 10 km (10GBASE-LR) y 40 km o más (ER) |

- Para un enlace de 10 Gbps de la **máxima longitud** se elige **monomodo OS2** **[Salió 2015]**.
- Conectores: SC, LC (pequeño, el más usado), ST, FC, MTP/MPO (multifibra, 40/100G).
- Pulido: PC, UPC (azul) y APC (verde, en ángulo, típico de FTTH).

### Fibra óptica plástica (POF)

- Núcleo de **PMMA** (polimetilmetacrilato) envuelto en polímeros fluorados.
- Núcleo **grande**, de alrededor de 1 mm (980 µm), mucho **mayor** que el de la fibra de vidrio. Por eso es fácil de conectorizar.
- Muy flexible, barata y sencilla de instalar por tubos antiguos. Usada en hogares, automóvil (MOST) e industria.
- Atenuación alta: solo sirve para distancias cortas (decenas de metros). Ventana típica de 650 nm (luz roja visible).
- **[Salió 2022]**: la afirmación incorrecta es que "ofrece un núcleo conductor menor que la fibra tradicional".

### Medios no guiados

- **Radiofrecuencia**: omnidireccional, atraviesa paredes. Wi-Fi, Bluetooth, telefonía móvil.
- **Microondas terrestres**: antenas parabólicas direccionales, enlaces punto a punto con **visión directa** (LOS).
- **Satélite**: el satélite actúa como repetidor. Su **transpondedor** recibe la señal del enlace ascendente, la amplifica o regenera, cambia la frecuencia y la reenvía por el enlace descendente **[Salió 2006]**.
- **Infrarrojos**: corto alcance, sin atravesar paredes (mandos, IrDA, ya obsoleto).
- **Luz visible**: Li-Fi, estandarizado como **IEEE 802.11bb** (2023).

Órbitas de satélite:

| Órbita | Altitud | Ejemplo | Latencia |
|---|---|---|---|
| LEO (baja) | 300-2000 km | Starlink, OneWeb, Iridium | 20-40 ms |
| MEO (media) | 2000-35.786 km | GPS (unos 20.200 km), Galileo | Media |
| GEO (geoestacionaria) | 35.786 km sobre el ecuador | Hispasat, TV por satélite | Unos 250 ms por salto |

Bandas de satélite: L, S, C, X, **Ku** (TV), **Ka** (banda ancha).

Propagación de las ondas de radio:

- **Onda de superficie** (frecuencias bajas, siguen la curvatura terrestre).
- **Onda ionosférica o de cielo** (HF, rebota en la ionosfera).
- **Visión directa** (VHF y superiores).
- **Dispersión troposférica**: permite comunicar antenas sin visión directa aprovechando la dispersión en la troposfera **[Salió 2007]**.

## 4. Equipos de interconexión

### Por capa OSI

| Capa OSI | Equipo | Qué hace |
|---|---|---|
| 1 Física | Repetidor, concentrador (hub), conversor de medios | Regenera y difunde bits. Un único dominio de colisión |
| 2 Enlace | Puente (bridge), conmutador (switch), punto de acceso Wi-Fi | Reenvía tramas por dirección MAC. Separa dominios de colisión |
| 3 Red | **Encaminador (router)**, switch de capa 3 | Encamina paquetes por dirección IP. Separa dominios de difusión |
| 4 a 7 | **Pasarela (gateway)**, cortafuegos de aplicación, proxy, balanceador L7 | Traduce entre protocolos o arquitecturas distintas |

- **[Salió 2022]**: trabaja en nivel 3 el router (no el puente, el switch ni el hub).
- **Brouter**: híbrido de puente y router. Encamina lo que puede y puentea el resto.
- **Ultrix** no es un dispositivo: fue el Unix de DEC **[Salió 2007]**.
- **Módem**: modula y demodula. Trabaja en capa física.
- **Switch gestionable**: admite VLAN (802.1Q), STP/RSTP (802.1D/802.1w), agregación (802.3ad/802.1AX), port mirroring y 802.1X.
- **Switch de capa 3**: encamina entre VLAN en hardware.
- **Pasarela**: el término también se usa para el "router por defecto" de una red IP. En el examen, si piden "nivel de aplicación" o "traducir protocolos distintos", es la pasarela.

### Dominios de colisión y difusión

```text
Hub de 8 puertos           -> 1 dominio de colisión, 1 de difusión
Switch de 8 puertos        -> 8 dominios de colisión, 1 de difusión (sin VLAN)
Router de 4 interfaces     -> 4 dominios de colisión y 4 de difusión
```

### Power over Ethernet (PoE)

Alimenta equipos (cámaras IP, teléfonos IP, puntos de acceso) por el mismo cable de datos. El que da energía es el **PSE** (switch o inyector); el que la recibe es el **PD**. Las siglas son **Power over Ethernet**, no "Power-of-Ethernet" **[Salió 2022]**.

| Norma | Nombre | Año | Tipo | Potencia en el PSE | Potencia en el PD | Pares |
|---|---|---|---|---|---|---|
| IEEE 802.3af | PoE | 2003 | Tipo 1 | 15,4 W | 12,95 W | 2 |
| IEEE 802.3at | PoE+ | 2009 | Tipo 2 | 30 W | 25,5 W | 2 |
| IEEE 802.3bt | PoE++ (4PPoE) | 2018 | **Tipo 3** | 60 W | 51 W | 4 |
| IEEE 802.3bt | PoE++ (4PPoE) | 2018 | **Tipo 4** | 90 W (a veces 100 W) | 71,3 W | 4 |

- **[Salió 2022]**: PoE++ se subdivide en Tipo 3 y Tipo 4. 802.3at y 25,5 W son de PoE+, no de PoE++.
- **[Salió 2019]**: una sonda de unos 70 W se puede alimentar y encender remotamente con **802.3bt** (Tipo 4). 802.3ct y 802.3dt no son normas PoE (802.3ct es Ethernet coherente de 100G por DWDM).
- Clases de potencia: 0 a 4 en af/at; 5 a 8 en bt (la clase 8 es la de 71,3 W).
- **PoDL** (Power over Data Lines, IEEE 802.3bu y 802.3cg): alimentación sobre un único par (Single Pair Ethernet, industrial y automoción).
- Cat 5e es suficiente para PoE, pero con 802.3bt conviene Cat 6A o mejor por el calentamiento de los mazos.

## 5. Técnicas de conmutación

### Conmutación de circuitos

- Tres fases: **establecimiento**, transferencia y liberación.
- Se reserva un **camino físico o lógico dedicado y exclusivo** (no compartido) entre los nodos durante toda la comunicación **[Salió 2005, 2025]**.
- Retardo constante y pequeño una vez establecido. Ideal para voz.
- Desperdicia recursos si no se transmite; la llamada puede ser rechazada si no hay circuitos libres (bloqueo).
- Ejemplos: red telefónica conmutada (RTC/RTB), RDSI, GSM de voz.

### Conmutación de mensajes

- El mensaje completo se almacena en cada nodo y luego se reenvía (**store and forward**).
- No hay camino dedicado. Retardos grandes y variables. Hoy apenas se usa (antiguo télex y telegrafía).

### Conmutación de paquetes

El mensaje se divide en paquetes de tamaño limitado que comparten los enlaces. Dos variantes:

| Aspecto | Datagrama | Circuito virtual |
|---|---|---|
| Establecimiento de conexión | No | Sí (SVC) o permanente (PVC) |
| Ruta | Cada paquete se encamina de forma independiente | Todos siguen la misma ruta |
| Orden de llegada | Puede desordenarse | Se mantiene |
| Cabecera | Dirección completa de destino | Identificador corto de circuito |
| Ante un fallo de nodo | Se reencamina solo | Se pierde el circuito |
| Ejemplos | **IP**, UDP | X.25, Frame Relay, ATM, MPLS |

- **[Salió 2008]**: en datagrama cada paquete se conmuta de forma independiente, sin referencia a los anteriores.

### Tecnologías de conmutación (WAN clásica y actual)

- **X.25**: circuitos virtuales, control de errores salto a salto. Histórico.
- **Frame Relay**: circuitos virtuales identificados por **DLCI**. Bits de congestión **FECN** y **BECN**. El bit **DE** (*Discard Eligibility*) marca las tramas que se pueden descartar si hay congestión **[Salió 2008]**. Obsoleto.
- **ATM** (*Asynchronous Transfer Mode*): conmutación de **celdas de 53 octetos** (5 de cabecera y 48 de datos), orientada a conexión **[Salió 2008]**. Identificadores VPI/VCI. Capas: física (subcapas PMD y de convergencia de transmisión, que delimita celdas y genera el HEC), capa ATM y capa de adaptación AAL. Suele situarse en el **nivel de enlace** de OSI **[Salió 2007]**. Obsoleto.
- Categorías de servicio ATM: **CBR** (tasa constante, voz sin comprimir), **VBR-rt** (variable en tiempo real, voz y vídeo comprimidos) **[Salió 2008, 2007]**, VBR-nrt, ABR y UBR (mejor esfuerzo).
- **MPLS** (RFC 3031): conmutación por **etiquetas** de 20 bits, entre capa 2 y 3 ("capa 2,5"). Elementos:
  - **LSR** (*Label Switching Router*): router del núcleo que **conmuta etiquetas** **[Salió 2016]**.
  - **LER** (*Label Edge Router*): router de borde que pone o quita la etiqueta (inicia o termina el LSP).
  - **LSP** (*Label Switched Path*): el camino o "circuito virtual" MPLS.
  - **FEC** (*Forwarding Equivalence Class*): conjunto de paquetes que reciben el mismo tratamiento.
  - Usos: VPN de nivel 2 y 3, ingeniería de tráfico, QoS. Muy usado por las operadoras (la Red SARA se apoya en servicios MPLS de operador).
- **SD-WAN**: superpone una capa de control por software sobre enlaces diversos (MPLS, Internet, 4G/5G). Es la evolución actual de la WAN corporativa.

### Jerarquías digitales (PDH y SDH)

| Nivel | Velocidad |
|---|---|
| E1 (Europa) | 2,048 Mbps (32 canales de 64 kbps) |
| T1 (EE. UU.) | 1,544 Mbps (24 canales) |
| E3 | 34,368 Mbps |
| STM-1 (SDH) | 155,52 Mbps |
| STM-4 | 622,08 Mbps |
| STM-16 | 2,5 Gbps |
| STM-64 | 10 Gbps |

- Cálculo **[Salió 2008]**: vídeo de 3,6 MB/s es 28,8 Mbps; con un 10 % de overhead son 31,68 Mbps. El circuito normalizado inmediatamente superior es **34 Mbps (E3)**.
- STM-1 ATM (155 Mbps) supera a Fast Ethernet (100), Ethernet (10) y Frame Relay **[Salió 2008]**.

### RDSI (obsoleta)

- **Acceso básico (BRI)**: **2B + D** = 2 × 64 kbps + 16 kbps = 144 kbps útiles **[Salió 2005]**.
- **Acceso primario (PRI)** en Europa: 30B + D (64 kbps), sobre un E1.
- El canal D usa el protocolo **LAPD**, de la familia HDLC.

## 6. Redes de acceso

### xDSL

Usan el **par de cobre telefónico**. La voz va en la banda baja (hasta 4 kHz) y los datos en frecuencias superiores. Un **filtro o *splitter*** separa ambas señales **[Salió 2005]**.

| Tecnología | Recomendación ITU-T | Bajada / subida máx. | Notas |
|---|---|---|---|
| ADSL | G.992.1 | 8 / 1 Mbps | Asimétrica |
| ADSL2 | G.992.3 | 12 / 1 Mbps | |
| ADSL2+ | G.992.5 | 24 / 1 Mbps (3,3 con anexo M) | |
| VDSL | G.993.1 | 52 / 16 Mbps | Corta distancia |
| **VDSL2** | **G.993.2** | Hasta 100/100 Mbps (perfil 35b, unos 300 Mbps) | **[Salió 2008]** |
| HDSL | G.991.1 | 2 Mbps simétricos | Usa 2 o 3 pares |
| SHDSL | G.991.2 | Hasta 5,7 Mbps simétricos | |
| G.fast | G.9700 / G.9701 | Hasta 1 Gbps a pocos metros | |

- ADSL es **asimétrica**: más velocidad de bajada que de subida **[Salió 2005]**. Por eso no conviene a quien **publica** servicios en Internet **[Salió 2007, 2008]**.
- Según la tecnología se usa uno o varios pares (HDSL usa dos o tres) **[Salió 2006]**.
- La calidad y la distancia a la central limitan la velocidad: no vale cualquier bucle de abonado.
- En España el ADSL está en apagado progresivo: Telefónica cerró las centrales de cobre durante 2025 y migró a fibra.

### Fibra hasta el hogar (FTTH) y cable

- **FTTx**: FTTH (hogar), FTTB (edificio), FTTC (armario), FTTN (nodo).
- **PON** (red óptica pasiva): un OLT en la central y ONT en casa del cliente, con divisores ópticos pasivos.
  - **GPON** (ITU-T G.984): 2,488 Gbps de bajada y 1,244 Gbps de subida.
  - **XGS-PON** (G.9807.1): 10 Gbps simétricos. Es el estándar actual de las operadoras en España.
  - **NG-PON2** (G.989) y **50G-PON** (G.9804): siguientes generaciones.
- **HFC** (híbrido fibra-coaxial) con **DOCSIS 3.1** (hasta 10 Gbps de bajada) y **DOCSIS 4.0**.

### Telefonía IP

- **VoIP**: voz sobre redes IP. **ToIP**: el servicio telefónico completo sobre IP.
- **Teléfono IP**: terminal conectado **directamente a la red IP**, con su propia dirección IP **[Salió 2005]**. Puede ser hardware o *softphone*.
- Protocolos de señalización: **H.323** (ITU-T, estándar multimedia) **[Salió 2005]** y **SIP** (IETF, RFC 3261). Otros: MGCP, MEGACO/H.248.
- Transporte de la voz: **RTP** y su control **RTCP**; SRTP cifrado.
- Códecs: G.711 (64 kbps, sin compresión), G.729 (8 kbps), G.722 (banda ancha), Opus.
- **NetCDF** no tiene relación con la telefonía IP: es un formato de datos científicos **[Salió 2018]**.
- Calidad de servicio: reservar caudal o priorizar la voz (DiffServ con marca **EF**, DSCP 46) **[Salió 2006]**. Parámetros críticos: latencia (menos de 150 ms en un sentido), *jitter* y pérdida.
- Ventajas: servicios de valor añadido en los terminales, red única, movilidad, ahorro en llamadas internas **[Salió 2006]**.
- Se pueden eliminar las centralitas de las sedes con teléfonos IP y una centralita IP en la sede central **[Salió 2008]**.
- Para recibir llamadas en el portátil desde Internet: túnel VPN y aplicación de telefonía con el usuario de la empresa **[Salió 2006]**.

## 7. Comunicaciones móviles

### Evolución por generaciones

Orden correcto **[Salió 2016]**: **GSM → GPRS → UMTS → HSDPA → LTE**.

| Gen. | Tecnología | Acceso | Velocidad típica máxima | Notas |
|---|---|---|---|---|
| 1G | TACS (España), AMPS, NMT | FDMA analógico | Solo voz | |
| 2G | **GSM** | TDMA + FDMA | 9,6 kbps (datos por circuitos) | 900 y 1800 MHz |
| 2,5G | **GPRS** | TDMA | Unos 115 kbps | Conmutación de paquetes |
| 2,75G | EDGE | TDMA, 8-PSK | Unos 384 kbps | |
| 3G | **UMTS** | **W-CDMA** | 384 kbps - 2 Mbps | 2100 MHz |
| 3,5G | **HSDPA** | W-CDMA | **14,4 Mbps de bajada** | **[Salió 2008]** |
| 3,75G | HSUPA y HSPA+ | W-CDMA | 5,76 Mbps subida; HSPA+ hasta 42 Mbps | |
| 3,9G | **LTE** (3GPP Release 8) | **OFDMA** bajada, **SC-FDMA** subida | 100 / 50 Mbps (más con MIMO) | Solo IP |
| 4G | **LTE-Advanced** (Release 10) | OFDMA | Hasta 1 Gbps | Cumple IMT-Advanced |
| 4,5G | LTE-Advanced Pro (Release 13) | OFDMA | Varios Gbps | NB-IoT y LTE-M |
| 5G | **NR** (Release 15 y siguientes) | OFDMA (CP-OFDM) | 20 Gbps pico de bajada | IMT-2020 |

- **[Salió 2015]**: LTE Advanced es la técnica incluida en la telefonía 4G (no GPRS, HSDPA ni UMTS).
- **[Salió 2008]**: entre UMTS, HSDPA, ADSL y módem RDSI, la de mayor bajada por radio es HSDPA.
- LTE "puro" no cumplía IMT-Advanced; comercialmente se le llama 4G.

### LTE y LTE-Advanced

- Estándar del **3GPP**. Red totalmente IP; la voz va por **VoLTE** (IMS).
- Arquitectura: **eNodeB** (estación base) y núcleo **EPC**: MME (control y movilidad), S-GW, P-GW y HSS (base de abonados).
- Canales de 1,4 a 20 MHz. MIMO.
- LTE-Advanced añade:
  - **Agregación de portadoras** de hasta 5 portadoras de 20 MHz (100 MHz en total).
  - MIMO avanzado (8x8 en bajada, 4x4 en subida).
  - Retransmisores (*relays*), CoMP y HetNet (small cells).
- **[Salió 2016]**: es FALSO que LTE-Advanced use W-CDMA. W-CDMA es de UMTS (3G).

### 5G

- Estandarizado por el 3GPP desde la **Release 15** (2018). La ITU lo define como **IMT-2020**.
- Tres escenarios de uso:
  - **eMBB** (banda ancha móvil mejorada): hasta 20 Gbps de bajada pico.
  - **URLLC** (comunicaciones ultrafiables de baja latencia): 1 ms de latencia en el plano de usuario.
  - **mMTC** (comunicaciones masivas tipo máquina): hasta 1 millón de dispositivos por km².
- Rangos de frecuencia: **FR1** (410 MHz a 7,125 GHz) y **FR2** (24,25 a 52,6 GHz, ampliado a 71 GHz; ondas milimétricas).
- Bandas pioneras en España: **700 MHz** (cobertura), **3,5 GHz** (3,4-3,8 GHz, capacidad) y **26 GHz** (milimétrica).
- **NSA** (*Non-Standalone*): radio 5G apoyada en el núcleo 4G (EPC). **SA** (*Standalone*): radio y núcleo 5G (5GC).
- Núcleo **5GC** con arquitectura basada en servicios (SBA): AMF (acceso y movilidad), SMF (sesiones), UPF (plano de usuario), UDM, AUSF, NRF, PCF.
- Estación base: **gNB**.
- Tecnologías clave: **Massive MIMO** y *beamforming*, **network slicing** (redes lógicas sobre la misma infraestructura), **MEC** (computación en el borde), numerología flexible, códigos LDPC (datos) y polares (control).
- **5G-Advanced**: Release 18 (congelada en 2024) y Release 19 (2025). Introduce IA en la red y mejoras de posicionamiento.
- **6G**: la ITU lo llama **IMT-2030**. El 3GPP inició estudios en la Release 20 y espera especificaciones en la Release 21 (hacia 2029).
- Esquema Nacional de Seguridad y Ley 11/2022: la **Ley de Ciberseguridad 5G** (Real Decreto-ley 7/2022) regula los requisitos de seguridad de las redes 5G y los suministradores de alto riesgo.

### Dividendo digital

Liberación de bandas de la televisión digital terrestre (TDT) para la telefonía móvil.

| Dividendo | Banda liberada | Rango | Fecha en España |
|---|---|---|---|
| Primero | 800 MHz | 790-862 MHz | 2015 (uso para 4G) |
| **Segundo** | **700 MHz** | 694-790 MHz | Junio de 2020 (uso para 5G) **[Salió 2018]** |

- La TDT quedó en la banda de 470-694 MHz. Su futuro tras 2030 se está decidiendo en la Conferencia Mundial de Radiocomunicaciones de 2027 (CMR-27).

### Roaming y handover

- **Roaming (itinerancia)**: usar los servicios contratados en una red de otro operador, típicamente en otro país, sin cambiar de operador **[Salió 2016]**. En la UE rige "Roam like at home" (Reglamento (UE) 2022/612, vigente hasta 2032).
- **Handover (traspaso)**: pasar de una celda o estación base a otra durante una comunicación sin que se corte. Es la opción trampa típica.
- **Portabilidad**: cambiar de operador conservando el número. Otro distractor.
- En Wi-Fi, "roaming" sí se usa para el paso de un punto de acceso a otro dentro de la misma ESS **[Salió 2008]**.

### Redes LPWAN (IoT de largo alcance)

LPWAN = *Low Power Wide Area Network*: bajo consumo, largo alcance (kilómetros), poca velocidad.

| Tecnología | Espectro | Notas |
|---|---|---|
| **LoRaWAN** | Sin licencia (868 MHz en Europa) | Modulación LoRa (chirp). LoRa Alliance |
| **Sigfox** | Sin licencia (868 MHz) | Banda ultraestrecha, muy pocos mensajes al día |
| **NB-IoT** | Con licencia (red móvil) | 3GPP Release 13 |
| **LTE-M** (Cat-M1) | Con licencia | 3GPP; admite movilidad y voz |
| Wi-Fi HaLow (802.11ah) | Sub-1 GHz | Puede considerarse LPWAN de alcance medio |

- **[Salió 2024]**: Bluetooth LE **no** es LPWAN. Es una red personal (WPAN) de corto alcance. Lo mismo vale para Zigbee.

## 8. Redes inalámbricas: Wi-Fi (IEEE 802.11)

### La familia IEEE 802

| Norma | Ámbito |
|---|---|
| 802.1 | Puenteo y gestión (802.1Q VLAN, 802.1X autenticación, 802.1D STP, 802.1w RSTP, 802.1AE MACsec) |
| 802.2 | LLC |
| 802.3 | **Ethernet** (y PoE) |
| 802.4 | Token Bus (obsoleto) |
| 802.5 | Token Ring (obsoleto) |
| 802.6 | Redes MAN, **DQDB** (obsoleto) **[Salió 2016]** |
| **802.11** | **Redes de área local inalámbricas (WLAN)** **[Salió 2005, 2024]** |
| **802.15** | **Redes de área personal inalámbricas (WPAN)** **[Salió 2015]** |
| **802.16** | **WiMAX** (redes metropolitanas inalámbricas) **[Salió 2016]** |
| 802.20 | Acceso inalámbrico móvil de banda ancha (MBWA) |
| 802.22 | Redes regionales en espacios blancos de TV (WRAN) |

- 802.12 (100VG-AnyLAN) existió y está obsoleto. Aloha ranurado es un protocolo de acceso al medio. X.25 es una red de paquetes.

### Estándares Wi-Fi: la tabla clave

| Estándar | Nombre Wi-Fi Alliance | Año | Banda | Velocidad máx. teórica | Técnicas clave |
|---|---|---|---|---|---|
| 802.11 | (legado) | 1997 | 2,4 GHz e IR | 2 Mbps | FHSS, DSSS |
| 802.11b | (Wi-Fi 1, no oficial) | 1999 | 2,4 GHz | **11 Mbps** | DSSS/CCK |
| 802.11a | (Wi-Fi 2, no oficial) | 1999 | **5 GHz** | 54 Mbps | OFDM |
| 802.11g | (Wi-Fi 3, no oficial) | 2003 | **2,4 GHz** **[Salió 2016]** | **54 Mbps** **[Salió 2007]** | OFDM; compatible con b |
| 802.11n | **Wi-Fi 4** | 2009 | 2,4 y 5 GHz | **600 Mbps** **[Salió 2015]** | MIMO 4x4, canales de 40 MHz |
| 802.11ac | **Wi-Fi 5** | 2013 (wave 2: 2016) | **Solo 5 GHz** | **6,9 Gbps** (unos 7) **[Salió 2015]** | 8 flujos, 160 MHz, 256-QAM, MU-MIMO de bajada |
| 802.11ax | **Wi-Fi 6** **[Salió 2019]** | 2021 (certificación 2019) | 2,4 y 5 GHz | 9,6 Gbps | **OFDMA**, MU-MIMO en ambos sentidos, 1024-QAM, TWT, BSS Coloring |
| 802.11ax | **Wi-Fi 6E** | 2020 | 2,4, 5 y **6 GHz** | 9,6 Gbps | Igual que Wi-Fi 6 más la banda de 6 GHz |
| 802.11be | **Wi-Fi 7** | Certificación enero 2024; IEEE 2024-2025 | 2,4, 5 y 6 GHz **[Salió 2022]** | Unos 46 Gbps | Canales de **320 MHz**, **4096-QAM**, **MLO** (operación multienlace), 16 flujos |
| 802.11bn | **Wi-Fi 8** (UHR) | En desarrollo (hacia 2028) | 2,4, 5 y 6 GHz | Similar a Wi-Fi 7 | Prioriza fiabilidad y baja latencia |

Otros estándares 802.11 de uso específico:

| Estándar | Qué es |
|---|---|
| 802.11ad (WiGig) | 60 GHz, unos 7 Gbps, muy corto alcance |
| 802.11ay | 60 GHz, evolución de ad, decenas de Gbps |
| **802.11ah** | **Wi-Fi HaLow**, sub-1 GHz, IoT de largo alcance (hasta 1 km) **[Salió 2016]** |
| 802.11af | "White-Fi", espacios blancos de TV (VHF/UHF) |
| 802.11p | Comunicaciones vehiculares (WAVE), 5,9 GHz. Sucesor: 802.11bd |
| 802.11bb | Li-Fi (comunicación por luz) |
| 802.11az | Posicionamiento de nueva generación (NGP) |
| 802.11bf | Detección por Wi-Fi (*WLAN sensing*) |

Enmiendas funcionales (salen como distractores):

| Enmienda | Función |
|---|---|
| 802.11d | Dominios reguladores por país |
| 802.11e | Calidad de servicio (WMM) |
| 802.11h | DFS y TPC en 5 GHz (Europa) |
| **802.11i** | **Seguridad: base de WPA2 (CCMP-AES)** |
| 802.11k | Medición de recursos radio (ayuda al roaming) |
| **802.11r** | **Fast BSS Transition**: roaming rápido para clientes en movimiento **[Salió 2015]** |
| 802.11s | Redes malladas (mesh) |
| 802.11u | Interconexión con redes externas (Hotspot 2.0 / Passpoint) |
| 802.11v | Gestión de red inalámbrica (BSS Transition Management) |
| 802.11w | Protección de tramas de gestión (PMF) |

- Wi-Fi 6, 6E y 7 son los nombres oficiales. "Wi-Fi 1, 2 y 3" no los usa oficialmente la Wi-Fi Alliance.
- "802.11ac wave 2" no es Wi-Fi 6. "802.11az" tampoco.
- El nombre del certificado de 802.11ah es **Wi-Fi HaLow** (no "Hello" ni "Highlow").

### Bandas de frecuencia

- **2,4 GHz** (banda ISM, 2400-2483,5 MHz): mayor alcance y mejor penetración, pero saturada. En Europa hay 13 canales de 20 MHz separados 5 MHz; no solapados: 1, 6 y 11 (o 1, 5, 9 y 13). Interfiere con Bluetooth, microondas y Zigbee **[Salió 2019]**.
- **5 GHz** (UNII, 5150-5725 MHz en Europa): más canales y velocidad, **menor alcance** que 2,4 GHz **[Salió 2019]**. Parte exige **DFS** (detección de radares) y TPC.
- **6 GHz**: abierta en la UE y en España para Wi-Fi en 5945-6425 MHz desde 2021 (los 500 MHz inferiores). La parte superior (6425-7125 MHz) está en discusión entre Wi-Fi y móvil.
- **60 GHz**: 802.11ad/ay.
- **Sub-1 GHz**: 802.11ah (863-868 MHz en Europa).
- Son bandas de **uso común sin licencia**: no hace falta autorización para montar una WLAN corporativa **[Salió 2008]**.

### Arquitectura y acceso al medio

- **Topologías**: **ad hoc** (IBSS, sin punto de acceso), **infraestructura** (BSS con punto de acceso; ESS con varios) y **malla** (mesh, 802.11s). El **anillo** no es una topología inalámbrica **[Salió 2017]**.
- **SSID**: nombre de la red. **BSSID**: MAC del punto de acceso. **ESS**: varios BSS con el mismo SSID unidos por un sistema de distribución.
- **Roaming** entre puntos de acceso del mismo edificio: posible, más rápido con 802.11r/k/v **[Salió 2008]**. Los equipos de distintos fabricantes son interoperables gracias a la certificación Wi-Fi.
- Acceso al medio: **CSMA/CA** (evitación de colisiones), no CSMA/CD como Ethernet. **RTS/CTS** resuelve el problema del nodo oculto.
- Wi-Fi es semidúplex en un mismo canal. La velocidad real útil es aproximadamente la mitad de la nominal.
- Controladoras WLAN (WLC) gestionan muchos puntos de acceso ligeros (protocolo CAPWAP).
- Cálculo de clientes **[Salió 2008]**: un AP 802.11b tiene 11 Mbps nominales y unos 5-6 Mbps reales compartidos. Garantizar 2 Mbps a cada cliente da unos 3 clientes con el caudal real (5 con el nominal).

### Seguridad Wi-Fi

| Protocolo | Año | Cifrado | Estado |
|---|---|---|---|
| WEP | 1999 | RC4 (claves de 40 o 104 bits) | Roto. No usar |
| WPA | 2003 | TKIP (RC4 mejorado) | Obsoleto |
| WPA2 (802.11i) | 2004 | **CCMP-AES** | Vulnerable a **KRACK** (2017) sin parches |
| **WPA3** | 2018 | AES-CCMP/GCMP; **SAE** en Personal | Actual. Obligatorio para Wi-Fi 6E y 7 |

- **[Salió 2019]**: es FALSO que WEP sea más seguro que WPA2. WPA3 surge, entre otras causas, por el ataque KRACK.
- Modos **Personal** (PSK, clave compartida) y **Enterprise** (802.1X con EAP y un servidor de autenticación **RADIUS**).
- **WPA3-Personal** sustituye PSK por **SAE** (*Simultaneous Authentication of Equals*, protocolo Dragonfly). Resiste ataques de diccionario fuera de línea y aporta **secreto directo** (*forward secrecy*). Las vulnerabilidades Dragonblood (2019) se corrigieron.
- **WPA3-Enterprise**: necesita **802.1X/EAP con servidor RADIUS** (o solución equivalente que admita EAP-TLS) **[Salió 2024]**. Tiene un modo opcional de **192 bits** (suite CNSA): GCMP-256, HMAC-SHA-384, ECDH y ECDSA con P-384.
- **PMF** (802.11w, protección de tramas de gestión) es obligatorio en WPA3.
- **OWE** (*Opportunistic Wireless Encryption*, "Wi-Fi Enhanced Open"): cifra redes abiertas sin contraseña.
- Métodos EAP habituales: EAP-TLS (certificados en cliente y servidor), PEAP-MSCHAPv2, EAP-TTLS. **eduroam** usa 802.1X con RADIUS federado.

### WPS (Wi-Fi Protected Setup)

- Configuración sencilla de la seguridad sin teclear la clave.
- Métodos: **PIN**, **PBC** (pulsar botón), **NFC** y **USB** (este último ya en desuso) **[Salió 2022]**.
- El método PIN es vulnerable a fuerza bruta (2011, herramienta Reaver): el PIN de 8 dígitos se valida en dos mitades. Recomendación: desactivar WPS.
- Wi-Fi Easy Connect (DPP, códigos QR) es su sustituto moderno.

### WiMAX

- **IEEE 802.16**, red metropolitana inalámbrica (WMAN). 802.16d fijo y 802.16e móvil **[Salió 2016]**.
- Llegó a considerarse 4G, pero perdió frente a LTE. Hoy residual.

## 9. Redes de área personal (WPAN)

### Bluetooth

- Base del estándar **IEEE 802.15.1** (hoy lo mantiene el **Bluetooth SIG**). Banda ISM de **2,4 GHz**.
- Bluetooth clásico (BR/EDR): **79 canales de 1 MHz** con salto de frecuencia (FHSS, 1600 saltos por segundo).
- **Piconet**: un maestro (central) y hasta **7 esclavos activos** (hasta 255 aparcados).
- **Scatternet**: **grupo de piconets** interconectadas; un dispositivo participa en varias **[Salió 2019]**.
- Es una red **WPAN** de unos 10 metros (clase 2) **[Salió 2007]**.

Clases de potencia (clásico):

| Clase | Potencia máx. | Alcance aproximado |
|---|---|---|
| 1 | 100 mW | 100 m |
| 2 | 2,5 mW | 10 m |
| 3 | 1 mW | 1 m |

Versiones:

| Versión | Año | Novedad |
|---|---|---|
| 1.x | 1999-2003 | 1 Mbps |
| 2.0 + EDR | 2004 | 3 Mbps |
| 3.0 + HS | 2009 | 24 Mbps usando un enlace 802.11 |
| **4.0** | 2010 | **Bluetooth Low Energy (BLE)** |
| 4.2 | 2014 | IPv6 (IoT), más seguridad |
| **5.0** | 2016 | BLE a 2 Mbps, 4 veces más alcance (Coded PHY), 8 veces más capacidad de anuncios |
| 5.1 | 2019 | Radiogoniometría (AoA/AoD) |
| 5.2 | 2020 | **LE Audio** (códec LC3), canales isócronos |
| 5.3 | 2021 | Mejoras de eficiencia |
| 5.4 | 2023 | PAwR (etiquetas electrónicas) |
| **6.0** | 2024 | **Channel Sounding** (medición de distancia precisa) |
| 6.1 | 2025 | Mejoras de privacidad y consumo |

- Wi-Fi tiene velocidad nominal **mayor** que Bluetooth. Es falso lo contrario **[Salió 2007]**.

### Bluetooth Low Energy (BLE)

- **40 canales de 2 MHz** en 2,4 GHz **[Salió 2025]**.
- **3 canales de anuncio** (*advertising*: 37, 38 y 39) y **37 canales de datos** (0 a 36).
- Los canales de anuncio se sitúan en huecos entre los canales Wi-Fi 1, 6 y 11 para evitar interferencias.
- Velocidades de 1 y 2 Mbps (125 o 500 kbps en Coded PHY de largo alcance).
- Muy bajo consumo: balizas (iBeacon, Eddystone), wearables, sensores.

### Otras tecnologías de corto alcance

| Tecnología | Estándar | Banda | Uso |
|---|---|---|---|
| Zigbee | IEEE 802.15.4 | 2,4 GHz (y 868 MHz en Europa) | Domótica, malla de bajo consumo |
| Thread / Matter | 802.15.4 + IPv6 | 2,4 GHz | Hogar inteligente interoperable |
| UWB | IEEE 802.15.4z | 3,1-10,6 GHz | Localización precisa (AirTag, llaves digitales) |
| NFC | ISO/IEC 14443, 18092 | 13,56 MHz | Pagos, DNI electrónico 3.0 y 4.0, unos 10 cm |
| RFID | ISO 18000 y otras | LF, HF, UHF | Etiquetado, inventario |
| VLC | IEEE 802.15.7 | Luz visible | Comunicación por luz |

## 10. Organismos de normalización y regulación

| Organismo | Ámbito |
|---|---|
| **ITU / UIT** | **Agencia de la ONU para las telecomunicaciones** (Ginebra, fundada en 1865) **[Salió 2022]**. Sectores: ITU-T (normas), ITU-R (radio y espectro), ITU-D (desarrollo) |
| ISO | Normalización internacional general (OSI, 11801 con IEC) |
| IEC | Electrotecnia |
| IEEE | Normas 802 (Ethernet, Wi-Fi, PoE) |
| ETSI | Europa; creó GSM; socio del 3GPP |
| 3GPP | UMTS, LTE, 5G, 6G |
| IETF | Protocolos de Internet (RFC) |
| ICANN | Nombres de dominio y direcciones IP. No regula telecomunicaciones |
| TIA / EIA / ANSI | Normas de cableado de EE. UU. (TIA-568) |
| Wi-Fi Alliance | Certificación y nombres comerciales Wi-Fi |
| Bluetooth SIG | Especificaciones Bluetooth |
| CEPT / BEREC | Coordinación europea de espectro y de reguladores |
| CNMC | Regulador de mercados de telecomunicaciones en España |

- En España, el espectro lo gestiona el Ministerio para la Transformación Digital y de la Función Pública (Secretaría de Estado de Telecomunicaciones e Infraestructuras Digitales). La asignación se publica en el **CNAF** (Cuadro Nacional de Atribución de Frecuencias).
- La norma básica es la **Ley 11/2022, de 28 de junio, General de Telecomunicaciones**.

## 11. Caso práctico: elegir tecnologías (supuesto)

Criterios que se repiten en los supuestos:

- **Puesto con 1 Gbps**: Cat 6 (Cat 5e vale). Con interferencias, versión apantallada.
- **10 Gbps a 100 m en cobre**: Cat 6A. **25/40 Gbps**: Cat 8 a 30 m o fibra.
- **Troncal entre plantas o edificios**: fibra (multimodo OM3/OM4 en edificio; monomodo entre edificios).
- **Edificio histórico o instalación temporal**: WLAN 802.11 con estudio de cobertura y varios puntos de acceso cableados **[Salió 2007]**.
- **Servicios publicados a Internet**: conexión simétrica (fibra o circuito dedicado), no ADSL.
- **Teletrabajo**: banda ancha doméstica (antes ADSL, hoy fibra) con VPN **[Salió 2008]**.
- **Enlace saturado**: ampliar caudal, conformar tráfico (*traffic shaping*) o restringir usos. Limitar lo que descargan los ciudadanos del propio ministerio no resuelve la saturación de entrada **[Salió 2007]**.
- **Voz sobre la red de datos**: QoS con caudal reservado o priorizado.

## Trampas y respuestas desactualizadas

- **ATM, Frame Relay, RDSI, DQDB, X.25 (2005-2016)**: preguntas marcadas como obsoletas. Las tecnologías han desaparecido de las redes reales, aunque el dato teórico sigue siendo correcto.
- **CRC (2006)**: la opción "detección y corrección de errores" era la única razonable, pero el CRC solo **detecta**. Si hoy aparece "detección" sola, elígela.
- **ADSL (2005-2008)**: ya no se comercializa en España (cierre del cobre en 2025). En supuestos actuales piensa en fibra FTTH (XGS-PON) o 5G.
- **HSDPA, UMTS (2008)**: el 3G se apagó en España entre 2023 y 2025. El 2G está en proceso de cierre.
- **802.11n "600 Mbps" (2015)**: la opción "1300 Mbps" era de 802.11ac de tres flujos. No las confundas.
- **802.11ac "solo 5 GHz"**: los routers "dual band ac" llevan 802.11n en 2,4 GHz. El estándar ac no usa 2,4 GHz.
- **Estándar en 2,4, 5 y 6 GHz (2022)**: la **clave oficial fue d) 802.11be (Wi-Fi 7)**. Técnicamente 802.11ax en su versión Wi-Fi 6E también usa las tres bandas, así que la pregunta era discutible; el tribunal se quedó con la norma que nace con las tres bandas de forma nativa. Si vuelven a salir ax y be juntas para 2,4/5/6 GHz, marca **802.11be**, salvo que el enunciado diga «Wi-Fi 6E».
- **"No existe la banda de 6 GHz"**: falso desde 2020 (EE. UU.) y 2021 (UE).
- **Cat 7 y Cat 7A**: no son categorías TIA. Si la pregunta cita "ANSI/TIA-568", tras Cat 6A viene Cat 8 **[2019]**.
- **TIA-568-B y C**: hoy la vigente es TIA-568-E (2020).
- **PoE**: 802.3at es PoE+ (25,5 W en el PD), no PoE++. "802.3ct" y "802.3dt" son distractores de PoE.
- **POF**: el núcleo es **mayor** que el de la fibra de vidrio. Los textos comerciales en español dicen que "aprovecha todo el ancho de banda sin pérdidas", aunque su atenuación es alta.
- **Fibra por propagación** (2016): la respuesta esperada es monomodo y multimodo. Índice escalonado y gradual es la clasificación por perfil de índice.
- **Roaming frente a handover y portabilidad** (2016): el roaming de móvil es usar otra red, normalmente en otro país.
- **LTE como 4G**: técnicamente LTE (Release 8) es 3,9G; el 4G "de verdad" (IMT-Advanced) es LTE-Advanced.
- **5G "1 ms de latencia"**: es el objetivo URLLC en el plano de usuario, no la latencia típica que mide un usuario.
- **Bluetooth LE en LPWAN** (2024): BLE es WPAN, no LPWAN.
- **WPS con USB** (2022): el método USB existía en WPS 1.0 y se retiró después. La respuesta esperada incluye los cuatro.
- **ICANN, IEEE, TIA** como "organismo de la ONU": distractores. Solo la ITU es agencia de la ONU.
- **Half duplex** frente a símplex: no confundas "en ambos sentidos pero no a la vez" con "un solo sentido".
- **Wi-Fi 6 = 802.11ax**: "802.11ac wave 2" y "802.11az" son distractores.
