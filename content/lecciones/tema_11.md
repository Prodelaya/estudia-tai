# Tema 11. Periféricos

Peso en el examen: unas **3 preguntas de test** por convocatoria (2,9 esperadas, cerca de 1,8 puntos) y **ninguna de supuesto III**. Hay **42 preguntas históricas** entre 2005 y 2025, todas de test. Se concentran en tres bloques. El primero son las **velocidades de interfaces** (USB, Thunderbolt, FireWire, HDMI), con unas 13 preguntas. El segundo es el **almacenamiento** (SSD frente a HDD, interfaces SATA/NVMe/M.2, estructura del disco, RAID), con unas 14. El resto se reparte entre pantallas, impresión y escáneres. Desde 2015 caen casi siempre 3 o 4 preguntas seguidas de este tema en el test.

## Cómo lo preguntan

- **Velocidad máxima de una versión concreta**: USB 2.0 (2008), USB 3.1 Gen 2 y Thunderbolt 2 (2015), Thunderbolt 3 (2018), USB 4.0 (2019), HDMI 2.1 (2025). Hay que saber la tabla de memoria.
- **Identificar la afirmación incorrecta** sobre versiones USB (2022), SSD frente a HDD (2016) o zonas del disco (2017).
- **"Cuál es válida / cuál no es válida"**: interfaz no válida para SSD (2018), formato de interfaz SSD (2024), resolución de pantalla válida (2024), tipo de panel LCD (2024).
- **Definiciones de un término**: SSD (2019), sector (2008), latencia rotacional (2008), dot pitch (2007), impresión GDI (2007), sublimación (2016), OCR (2008), CCD (2006).
- **Clasificación**: impresoras de impacto (2016), periféricos de entrada (2016), interfaces serie frente a paralelo (2016, 2022).
- **Potencia de carga**: USB Power Delivery (2017). Hoy la respuesta sería 240 W.
- **Protocolos**: IPP para impresión (2025), Bluetooth para teclados y ratones (2008), ISO 9660 para CD-ROM (2007).
- Las preguntas son cortas y de memoria. No hay supuestos ni cálculos largos, salvo algún RAID sencillo.

## Conectividad: buses e interfaces externas

### Conceptos previos

- **Interfaz serie**: envía los bits uno detrás de otro por un par de hilos. Es la tendencia actual (USB, SATA, SAS, PCIe, Thunderbolt).
- **Interfaz paralela**: envía varios bits a la vez por varios hilos. Ejemplos antiguos: Centronics (impresoras), PATA/IDE, SCSI paralelo, AGP, PCI.
- El paralelo se abandonó por el desfase entre hilos (*skew*) y las interferencias a alta frecuencia.
- **Velocidades**: en interfaces se dan en bits por segundo. 1 Gbit/s equivale a 125 MB/s brutos. Cuidado con Gbps frente a GB/s.
- **Half-duplex** y **full-duplex**: USB 2.0 es half-duplex; USB 3.x añade pares dedicados y es full-duplex.
- **Hot plug** (conexión en caliente) y **Plug and Play**: USB, FireWire, Thunderbolt, eSATA y SATA (con AHCI) los admiten.

### USB (Universal Serial Bus)

USB lo gestiona el **USB-IF** (USB Implementers Forum). Topología en estrella escalonada (árbol) con un único **host** y hasta **127 dispositivos** por controlador (direcciones de 7 bits). Máximo 5 niveles de hubs. Cable USB 2.0: 5 m máximo.

Tabla de versiones (memorízala):

| Versión | Año | Nombre comercial | Velocidad máxima | Codificación |
|---|---|---|---|---|
| USB 1.0/1.1 | 1996/1998 | Low Speed / Full Speed | 1,5 Mbit/s / 12 Mbit/s | NRZI |
| USB 2.0 | 2000 | High Speed | 480 Mbit/s | NRZI |
| USB 3.0 = USB 3.1 Gen 1 = USB 3.2 Gen 1 | 2008 | SuperSpeed (USB 5Gbps) | 5 Gbit/s | 8b/10b |
| USB 3.1 Gen 2 = USB 3.2 Gen 2 | 2013 | SuperSpeed+ (USB 10Gbps) | 10 Gbit/s | 128b/132b |
| USB 3.2 Gen 2x2 | 2017 | SuperSpeed 20Gbps | 20 Gbit/s (2 carriles de 10) | 128b/132b |
| USB4 (v1.0) | 2019 | USB 40Gbps | 20 o 40 Gbit/s | 64b/66b y 128b/132b |
| USB4 v2.0 | 2022 | USB 80Gbps | 80 Gbit/s simétricos, 120 Gbit/s asimétricos | PAM3 |

- USB 1.1: **1,5 Mbit/s (Low Speed) y 12 Mbit/s (Full Speed)** **[Salió 2006]**.
- USB 2.0: **480 Mbit/s** **[Salió 2008]**.
- USB 3.1 Gen 2: **10 Gbit/s** **[Salió 2015]**.
- USB4: **40 Gbit/s** **[Salió 2019]**. Se escribe oficialmente "USB4", sin espacio ni ".0". USB4 se basa en el protocolo Thunderbolt 3, que Intel cedió al USB-IF.
- USB4 usa siempre conector **USB-C** y túneles para USB 3.x, DisplayPort y PCIe.
- Afirmaciones típicas de "incorrecta" **[Salió 2022]**: decir que USB 3.0 da 10 Gbit/s (son 5), que USB 2.0 da 480 MB/s (son megabits) o que USB 3.2 Gen 1 es más rápido que USB 3.1 Gen 2 (es al revés).
- Desde 2022 el USB-IF recomienda nombres por velocidad: "USB 5Gbps", "USB 10Gbps", "USB 20Gbps", "USB 40Gbps", "USB 80Gbps".

Tipos de transferencia USB: **control**, **interrupción** (teclado, ratón), **isócrona** (audio y vídeo, sin reintentos) y **masiva o bulk** (almacenamiento).

Clases de dispositivo frecuentes: **HID** (teclado, ratón), **Mass Storage** (memorias), **UVC** (cámaras), **Audio**, **CDC** (comunicaciones), **Printer**.

Conectores:

| Conector | Rasgos |
|---|---|
| Tipo A | Rectangular, lado del host. En USB 3.x suele ser azul |
| Tipo B | Cuadrado, lado del periférico (impresoras) |
| Mini-USB y Micro-USB | Móviles y cámaras antiguos. Micro-B tiene versión USB 3.0 más ancha |
| USB-C | 24 pines, reversible, sirve para USB 2.0 a USB4, Thunderbolt 3/4/5, DisplayPort y carga |

La UE obliga al **USB-C** como puerto de carga común (Directiva (UE) 2022/2380). Aplica a móviles, tabletas, cámaras, auriculares y otros desde el **28 de diciembre de 2024** y a portátiles desde el **28 de abril de 2026**.

### USB Power Delivery y alimentación

| Modo | Tensión/corriente | Potencia |
|---|---|---|
| USB 2.0 | 5 V, 500 mA | 2,5 W |
| USB 3.x | 5 V, 900 mA | 4,5 W |
| USB BC 1.2 | 5 V, 1,5 A | 7,5 W |
| USB-C (sin PD) | 5 V, 1,5 o 3 A | 7,5 o 15 W |
| USB PD 2.0/3.0 (SPR) | hasta 20 V, 5 A | **100 W** |
| USB PD 3.1 (EPR, 2021) | hasta 48 V, 5 A | **240 W** |

- La pregunta de 2017 sobre la potencia máxima de USB PD tenía como respuesta **100 W** (20 V x 5 A) **[Salió 2017]**. Desde USB PD 3.1 (mayo de 2021) el máximo es **240 W** (48 V x 5 A) con cables EPR.
- Para más de 3 A hace falta un cable USB-C con chip **e-marker**.

### Thunderbolt

Desarrollado por **Intel** con **Apple** (2011). Combina PCIe y DisplayPort en un solo cable. Permite encadenar dispositivos (*daisy chain*, hasta 6).

| Versión | Año | Conector | Velocidad | Notas |
|---|---|---|---|---|
| Thunderbolt 1 | 2011 | Mini DisplayPort | 10 Gbit/s (2 canales de 10) | |
| Thunderbolt 2 | 2013 | Mini DisplayPort | **20 Gbit/s** (agrega los dos canales) | **[Salió 2015]** |
| Thunderbolt 3 | 2015 | **USB-C** | **40 Gbit/s** | PCIe 3.0 x4, 100 W, **[Salió 2018]** |
| Thunderbolt 4 | 2020 | USB-C | 40 Gbit/s | Mínimos más exigentes: dos monitores 4K, PCIe 32 Gbit/s, compatible con USB4 |
| Thunderbolt 5 | 2023 | USB-C | **80 Gbit/s** bidireccional, **120 Gbit/s** con *Bandwidth Boost* | Basado en USB4 v2, carga hasta 240 W |

- Thunderbolt 4 no sube la velocidad: mantiene 40 Gbit/s y endurece requisitos.
- El símbolo es un rayo. Se usa sobre todo en Mac y en portátiles con procesador Intel.

### FireWire (IEEE 1394)

Creado por **Apple** (FireWire), Sony lo llamaba **i.LINK**. Bus serie *peer-to-peer* (no necesita PC host), hasta 63 dispositivos, isócrono. Muy usado en vídeo digital (videocámaras DV). Hoy está obsoleto.

| Norma | Nombre | Velocidad |
|---|---|---|
| IEEE 1394 (1995) / 1394a (2000) | FireWire 400 | 100, 200 y **400 Mbit/s** |
| IEEE 1394b (2002) | FireWire 800 | **800 Mbit/s** (la norma prevé S1600 y S3200 que apenas se fabricaron) |

- IEEE 1394b: respuesta habitual **800 Mbit/s** **[Salió 2007]**. Si una opción dice 3,2 Gbit/s, es el máximo teórico de la norma; hay que leer bien las opciones.

### Otras interfaces externas y heredadas

- **Puerto serie RS-232** (COM, DB-9): módems, consolas de equipos de red. Hasta 115,2 kbit/s habitual.
- **Puerto paralelo** (LPT, Centronics, DB-25): impresoras antiguas. Modos SPP, EPP y ECP (IEEE 1284).
- **PS/2**: conector mini-DIN de 6 pines para teclado (morado) y ratón (verde).
- **eSATA**: SATA externo, hasta 6 Gbit/s, no da alimentación (eSATAp sí).
- **AGP** (Accelerated Graphics Port): bus paralelo dedicado a tarjetas gráficas (1x a 8x, hasta 2,1 GB/s). Sustituido por **PCI Express** **[Salió 2005, OBSOLETA]**.
- **PCI Express (PCIe)**: bus serie punto a punto por carriles (x1, x4, x8, x16).

| PCIe | Por carril (aprox.) | x4 | x16 |
|---|---|---|---|
| 3.0 (8 GT/s) | ~1 GB/s | ~4 GB/s | ~16 GB/s |
| 4.0 (16 GT/s) | ~2 GB/s | ~8 GB/s | ~32 GB/s |
| 5.0 (32 GT/s) | ~4 GB/s | ~16 GB/s | ~64 GB/s |
| 6.0 (64 GT/s, PAM4) | ~8 GB/s | ~32 GB/s | ~128 GB/s |

PCIe 7.0 (128 GT/s) se publicó en 2025. En equipos de consumo lo habitual en 2026 es PCIe 4.0 y 5.0.

### Inalámbricas para periféricos

- **Bluetooth** (IEEE 802.15.1 en origen, hoy lo mantiene el Bluetooth SIG): banda de 2,4 GHz, red **piconet** de 1 maestro y hasta 7 esclavos activos. Perfil **HID** para teclados y ratones **[Salió 2008]**.
- Versiones: 2.0 + EDR (3 Mbit/s), 4.0 introduce **BLE** (bajo consumo), 5.0 (2016, 2 Mbit/s en LE, más alcance), 5.3, 5.4 y **6.0** (2024, *Channel Sounding* para medir distancia).
- **Receptores propietarios de 2,4 GHz** (Logitech Unifying, Bolt).
- **IrDA**: infrarrojos, visión directa, obsoleto.
- **NFC**: 13,56 MHz, pocos centímetros, pagos y emparejamiento.
- **Wi-Fi Direct**: impresoras que se conectan sin punto de acceso.

## Visualización

### Interfaces de vídeo

| Interfaz | Tipo | Datos clave |
|---|---|---|
| VGA (D-sub 15) | Analógica | 1987, IBM. Hasta ~2048x1536 |
| DVI | Digital (DVI-D), analógica (DVI-A) o ambas (DVI-I) | Enlace simple 3,96 Gbit/s; doble enlace hasta 2560x1600 |
| HDMI | Digital, vídeo + audio + CEC | Tipo A estándar, C mini, D micro |
| DisplayPort | Digital por paquetes, VESA, libre de cánones | Mini DP, multistream (MST) para encadenar monitores |

Versiones de **HDMI**:

| Versión | Año | Ancho de banda | Hitos |
|---|---|---|---|
| 1.0 a 1.2 | 2002-2005 | 4,95 Gbit/s | 1080p |
| 1.3 | 2006 | 10,2 Gbit/s | Deep Color |
| 1.4 | 2009 | 10,2 Gbit/s | 4K a 30 Hz, canal Ethernet (HEC), ARC, 3D |
| 2.0 | 2013 | **18 Gbit/s** | 4K a 60 Hz, HDR (2.0a) |
| 2.1 | 2017 | **48 Gbit/s** (FRL) | 4K a 120 Hz, 8K a 60 Hz, 10K, eARC, VRR, ALLM. Cable Ultra High Speed **[Salió 2025]** |
| 2.2 | 2025 | **96 Gbit/s** | 4K a 480 Hz, 12K a 120 Hz, cable Ultra96 |

- HDMI 2.1: **48 Gbit/s** **[Salió 2025]**. HDMI 2.2 se presentó en el CES 2025 y la especificación se publicó a mediados de 2025.
- HDMI lleva **HDCP** (protección anticopia) y **CEC** (control de varios equipos con un mando).

Versiones de **DisplayPort** (VESA):

| Versión | Año | Ancho de banda máximo |
|---|---|---|
| 1.2 | 2010 | 21,6 Gbit/s |
| 1.4 | 2016 | 32,4 Gbit/s (DSC, HDR) |
| 2.0 / 2.1 | 2019 / 2022 | **80 Gbit/s** (UHBR20) |

DisplayPort Alt Mode permite sacar vídeo por USB-C. Thunderbolt y USB4 tunelizan DisplayPort.

### Tecnologías de pantalla

- **CRT** (tubo de rayos catódicos): haz de electrones sobre fósforo. Obsoleto. Aquí nace el término **dot pitch**.
- **LCD** (cristal líquido): los cristales no emiten luz; necesitan retroiluminación. Antes CCFL, hoy **LED** (por eso "monitor LED" es en realidad un LCD con retroiluminación LED).
- **Mini-LED**: LCD con miles de LED pequeños y atenuación local por zonas.
- **OLED**: cada píxel emite su propia luz. Negro perfecto, contraste "infinito", ángulos amplios. Riesgo de quemado (*burn-in*). Variantes: AMOLED (matriz activa), QD-OLED, WOLED.
- **MicroLED**: LED inorgánicos por píxel, emisivo, sin burn-in, muy caro.
- **Plasma**: celdas de gas ionizado, obsoleto.
- **Tinta electrónica (e-ink)**: lectores de libros, reflectiva, consume solo al cambiar la imagen.
- **QLED**: marca de Samsung para LCD con capa de puntos cuánticos.

Tipos de panel **LCD** **[Salió 2024]**:

| Panel | Siglas | Ventajas | Inconvenientes |
|---|---|---|---|
| TN | Twisted Nematic | Muy rápido (1 ms), barato | Malos ángulos de visión y color |
| IPS | In-Plane Switching | Mejor color y ángulos (178°) | Contraste ~1000:1, *IPS glow* |
| VA | Vertical Alignment | Mejor contraste (3000:1 o más), negros profundos | Más lento, *ghosting* |

Matriz **activa (TFT)**: un transistor por subpíxel. Todos los LCD actuales son TFT. Matriz pasiva (STN, DSTN): antigua y lenta. Ojo: OLED no es un tipo de panel LCD.

### Parámetros de una pantalla

- **Resolución**: número de píxeles horizontal x vertical.
- **Tamaño**: diagonal en pulgadas (1" = 2,54 cm).
- **Densidad**: píxeles por pulgada (ppi).
- **Dot pitch** (paso de punto): distancia entre dos puntos de fósforo (o subpíxeles) del mismo color, en mm. Cuanto **menor**, más nitidez **[Salió 2007]**. Valores típicos: 0,25 a 0,28 mm.
- **Relación de aspecto**: 4:3, 16:9, 16:10, 21:9.
- **Frecuencia de refresco** (Hz): 60, 120, 144, 240, 360 Hz o más.
- **Tiempo de respuesta** (ms): gris a gris (GtG).
- **Contraste**: blanco más brillante frente a negro más oscuro.
- **Brillo**: en nits (cd/m²).
- **Sincronización adaptativa**: FreeSync (AMD), G-Sync (NVIDIA), HDMI VRR, VESA Adaptive-Sync.
- **HDR**: HDR10, HDR10+, Dolby Vision, HLG. Certificación VESA DisplayHDR 400 a 1400.

Resoluciones estándar **[Salió 2024]**:

| Nombre | Resolución | Aspecto |
|---|---|---|
| VGA | 640x480 | 4:3 |
| SVGA | 800x600 | 4:3 |
| XGA | 1024x768 | 4:3 |
| SXGA | 1280x1024 | 5:4 |
| HD (720p) | 1280x720 | 16:9 |
| WXGA | 1280x800 | 16:10 |
| Full HD (1080p) | 1920x1080 | 16:9 |
| WUXGA | 1920x1200 | 16:10 |
| QHD / WQHD (1440p) | 2560x1440 | 16:9 |
| UWQHD | 3440x1440 | 21:9 |
| 4K UHD (2160p) | 3840x2160 | 16:9 |
| DCI 4K (cine) | 4096x2160 | ~17:9 |
| 8K UHD | 7680x4320 | 16:9 |

Truco para "resolución válida": las válidas casan con las tablas anteriores. Una cifra rara (por ejemplo 1920x1060) no es un estándar.

### Color

- **RGB**: modelo **aditivo** (luz). Rojo, verde y azul. Suma de todos = blanco. Lo usan monitores, cámaras y escáneres.
- **CMYK**: modelo **sustractivo** (tinta). Cian, magenta, amarillo y negro (*Key*). Suma de C, M e Y = negro teórico (en la práctica marrón oscuro, por eso se añade K). Lo usa la impresión.
- **HSV/HSB y HSL**: tono, saturación y valor o luminosidad. Útil para elegir colores.
- **YUV / YCbCr**: luminancia y crominancia separadas. Vídeo y JPEG.
- **CIELAB (L\*a\*b\*)**: independiente del dispositivo, base de la gestión de color (perfiles ICC).
- **Gamas de color**: sRGB (web), Adobe RGB (fotografía), DCI-P3 (cine, Apple), Rec. 2020 (UHD).
- **Profundidad de color**: bits por píxel **[Salió 2018]**.

| Bits por píxel | Colores | Nombre |
|---|---|---|
| 1 | 2 | Monocromo |
| 8 | 256 | Paleta indexada |
| 16 | 65.536 | High Color |
| 24 (8 por canal) | 16.777.216 (~16,7 millones) | True Color |
| 30 (10 por canal) | ~1.073 millones | Deep Color, HDR |
| 32 | 16,7 millones + canal alfa de 8 bits | True Color con transparencia |

Cálculo de memoria de una imagen sin comprimir: ancho x alto x bits por píxel / 8.

```text
1920 x 1080 x 24 bits / 8 = 6.220.800 bytes ≈ 5,93 MiB por fotograma
```

## Impresión

### Clasificación de impresoras

| Criterio | Tipos |
|---|---|
| Con impacto | Matricial (agujas), margarita, bola, línea o banda, cadena, tambor |
| Sin impacto | Inyección de tinta, láser, LED, térmica, sublimación, cera sólida, 3D |
| Por unidad de impresión | De carácter, de línea, de página |

- **Impacto** **[Salió 2016]**: golpean una cinta entintada contra el papel. Permiten **papel autocopiativo** (copias con calco) y papel continuo. La **matricial** es la que sigue en uso (facturas, albaranes). La pregunta de 2016 incluía como distractor un tipo sin impacto (láser, tinta, térmica) dentro de la lista de impacto.
- **Matricial**: cabezal de 9 o 24 agujas. Velocidad en cps (caracteres por segundo).
- **Inyección de tinta**: **térmica** (burbuja: HP, Canon) o **piezoeléctrica** (Epson). Cartuchos o depósitos (EcoTank).
- **Láser**: un láser descarga zonas de un **tambor fotosensible** (OPC); el **tóner** se adhiere a las zonas cargadas; se transfiere al papel y el **fusor** lo fija con calor y presión. Fases: carga, exposición, revelado, transferencia, fijación y limpieza. Es una impresora de página.
- **LED**: como la láser, pero una barra de LED sustituye al láser.
- **Térmica directa**: papel termosensible (tiques, etiquetas). **Transferencia térmica**: cinta de cera o resina.
- **Sublimación de tinta** **[Salió 2016]**: una cinta con tintes sólidos se calienta. El tinte pasa de **sólido a gas sin pasar por líquido** y penetra en el papel o tejido. Da tonos continuos, ideal para fotografía y tarjetas plásticas.
- **Cera sólida** (*solid ink*, Xerox): barras de cera que se funden.
- **Plóter**: gran formato. De plumillas (antiguo), de inyección o de corte.
- **Impresora 3D**: FDM (filamento fundido), SLA (resina con láser UV), SLS (sinterizado de polvo).

### Parámetros

- **ppp/dpi**: puntos por pulgada (resolución).
- **ppm**: páginas por minuto (láser e inyección). **cps**: caracteres por segundo (matriciales).
- **Ciclo de trabajo mensual** (*duty cycle*): páginas al mes máximas.
- **Coste por página** y rendimiento del consumible (norma ISO/IEC 19752 para tóner monocromo, 24711 para inyección).
- **Dúplex**: impresión a doble cara automática.

### Lenguajes y modos de impresión

- **PCL** (Printer Command Language, HP): lenguaje de control. PCL 5 y PCL 6 (PCL XL).
- **PostScript** (Adobe): lenguaje de descripción de página independiente del dispositivo. **PDF** deriva de él.
- **ESC/P** (Epson): matriciales.
- **Impresión GDI o basada en host** **[Salió 2007]**: el **ordenador** rasteriza la página con la interfaz GDI de Windows y envía el mapa de bits. La impresora no tiene lenguaje propio, es más barata y depende del controlador del sistema. También se llama *Winprinter*.
- **IPP Everywhere** y **AirPrint** (Apple), **Mopria** (Android): impresión **sin controlador** (*driverless*).

### Protocolos de impresión en red

| Protocolo | Puerto | Notas |
|---|---|---|
| **IPP** (Internet Printing Protocol) | **631/TCP** | Sobre HTTP, RFC 8011 (IPP/1.1), IPP/2.x. IPPS sobre TLS. Base de **CUPS** **[Salió 2025]** |
| LPD/LPR | 515/TCP | Unix clásico, RFC 1179 |
| Raw / JetDirect / AppSocket | **9100/TCP** | HP, envío directo del trabajo |
| SMB | 445/TCP | Impresoras compartidas en Windows |
| WSD | 3702/UDP, 5357/TCP | Web Services for Devices (Windows) |
| SNMP | 161/UDP | Estado y niveles de consumibles |

- **CUPS** (Common Unix Printing System): sistema de impresión de Linux y macOS. Administración web en `http://localhost:631`.
- **Spooler** (cola de impresión): en Windows el servicio "Cola de impresión" (`spoolsv.exe`). Fue el origen de la vulnerabilidad **PrintNightmare** (2021).
- Windows Protected Print Mode (Windows 11) abandona los controladores de terceros en favor de IPP y Mopria.

```bash
lpstat -p          # estado de impresoras (CUPS)
lp -d HP01 doc.pdf # enviar trabajo a la impresora HP01
lpq                # ver la cola
cancel 23          # cancelar el trabajo 23
```

## Almacenamiento

### Disco duro magnético (HDD)

Componentes: **platos** con superficies magnéticas, **cabezales** de lectura/escritura en un **brazo actuador**, motor de giro y controladora. Velocidades de giro: 5.400, 7.200, 10.000 y 15.000 rpm.

Estructura física y lógica **[Salió 2008, 2017]**:

| Término | Definición |
|---|---|
| **Pista** | Circunferencia concéntrica de una superficie del plato |
| **Sector** | División de una pista. Unidad física mínima de lectura/escritura: **512 bytes** clásico o **4.096 bytes** (Advanced Format, 4Kn y 512e) |
| **Cilindro** | Conjunto de pistas con el mismo radio en todas las superficies. Se leen sin mover el brazo |
| **Clúster** (unidad de asignación) | Grupo de sectores contiguos que el **sistema de ficheros** asigna como mínimo a un fichero. Es concepto **lógico**, no físico |
| Cabeza | Una por superficie |

- La pregunta falsa de 2017 jugaba con estas definiciones. Un error típico: decir que el clúster es una división física del disco o que el cilindro está en un solo plato.
- Direccionamiento antiguo **CHS** (cilindro, cabeza, sector). Hoy **LBA** (dirección lógica de bloque lineal).

Tiempos de acceso:

- **Tiempo de búsqueda** (*seek time*): mover el cabezal a la pista correcta. 3 a 12 ms.
- **Latencia rotacional**: esperar a que el sector **pase bajo el cabezal** **[Salió 2008]**. Media = medio giro.
- **Tiempo de transferencia**: leer los datos.
- Tiempo de acceso = búsqueda + latencia + transferencia.

```text
Latencia media a 7.200 rpm = (60 / 7200) / 2 = 4,17 ms
Latencia media a 15.000 rpm = (60 / 15000) / 2 = 2 ms
```

Otros conceptos: **SMART** (autodiagnóstico), **CMR** frente a **SMR** (grabación solapada, más densidad y escritura más lenta), **HAMR** (asistida por calor, Seagate, discos de 30 TB o más), **MTBF**.

### Unidades de estado sólido (SSD)

**SSD** = *Solid State Drive*, unidad de estado sólido **[Salió 2019]**. Almacena datos en memoria **flash NAND** no volátil, **sin partes móviles**. Tiene controladora, memoria NAND y a menudo caché DRAM.

Tipos de celda NAND:

| Tipo | Bits por celda | Durabilidad (ciclos P/E aprox.) | Uso |
|---|---|---|---|
| SLC | 1 | ~100.000 | Industrial, caché |
| MLC | 2 | ~10.000 | Profesional |
| TLC | 3 | ~3.000 | Consumo |
| QLC | 4 | ~1.000 | Capacidad, lecturas |
| PLC | 5 | Menor | En desarrollo |

**3D NAND** apila capas verticales (más de 200 en 2025).

Conceptos del SSD:

- **TRIM**: el SO avisa de qué bloques ya no se usan. Mantiene el rendimiento.
- **Wear leveling** (nivelación de desgaste): reparte las escrituras.
- **Garbage collection**: reorganiza bloques en segundo plano.
- **Sobreaprovisionamiento** (*over-provisioning*): espacio reservado.
- **TBW** (terabytes escritos) y **DWPD** (escrituras completas por día): durabilidad.
- **No se desfragmenta** un SSD: no mejora el rendimiento y lo desgasta.

SSD frente a HDD **[Salió 2015, 2016]**:

| Aspecto | SSD | HDD |
|---|---|---|
| Partes móviles | No | Sí |
| Tiempo de acceso | ~0,1 ms o menos | 5-15 ms |
| Velocidad secuencial | 550 MB/s (SATA) a 14.000 MB/s (NVMe PCIe 5.0) | 100-280 MB/s |
| Ruido, vibración, golpes | Silencioso, resistente | Ruido, sensible a golpes |
| Consumo y calor | Menor | Mayor |
| Precio por GB | **Mayor** | **Menor** |
| Capacidad máxima habitual | Menor en consumo | Mayor |
| Durabilidad de escritura | Limitada por ciclos P/E | No limitada por escritura |
| Recuperación de datos tras fallo | Más difícil | Más fácil |
| Fragmentación | No le afecta | Le afecta |

Afirmaciones **incorrectas** habituales: "el SSD es más barato por GB", "el SSD tiene mayor latencia", "el SSD consume más", "hay que desfragmentarlo".

### Interfaces de almacenamiento

| Interfaz | Tipo | Velocidad | Notas |
|---|---|---|---|
| **PATA / IDE** (ATA) | **Paralelo**, cable plano de 40/80 hilos | Hasta 133 MB/s (UDMA 6) | Maestro/esclavo |
| **SCSI** paralelo | Paralelo | Hasta 320 MB/s (Ultra-320) | Servidores, terminador, ID |
| **SATA** I / II / III | **Serie** | 1,5 / 3 / **6 Gbit/s** (~600 MB/s útiles) | Punto a punto, hot plug, AHCI |
| **SAS** (Serial Attached SCSI) | Serie | 3, 6, 12, **24 Gbit/s** (SAS-4) | Servidores, doble puerto, admite discos SATA |
| **eSATA** | Serie, externa | 6 Gbit/s | |
| **NVMe** | **Protocolo** sobre PCIe | Según PCIe (x4 Gen4 ~8 GB/s, Gen5 ~16 GB/s) | 64K colas de 64K comandos frente a 1 cola de 32 en AHCI |
| Fibre Channel | Serie, red SAN | 8 a 128 Gbit/s | |

- "Estándar de comunicación **en serie**" entre PATA, SCSI y SATA: **SATA** **[Salió 2016]**. Tecnología de disco con bus serie: **SATA** o **SAS** **[Salió 2022]**.
- **Interfaz o factor de forma**: hay que distinguir **protocolo** (AHCI, NVMe), **bus** (SATA, PCIe) y **formato físico** (2,5", M.2, U.2, mSATA).

Formatos físicos de SSD **[Salió 2018, 2024]**:

| Formato | Qué es |
|---|---|
| 2,5" | Caja de portátil, normalmente SATA |
| **mSATA** | Tarjeta pequeña SATA (antigua) |
| **M.2** (NGFF) | Tarjeta (2242, 2260, **2280**, 22110: ancho x largo en mm). Puede ser **SATA o NVMe** según la llave (B, M o B+M) |
| **U.2** (SFF-8639) | 2,5" NVMe para servidores, conexión en caliente |
| **U.3** | U.2 compatible con SAS, SATA y NVMe |
| **EDSFF** (E1.S, E1.L, E3) | Formatos de centro de datos |
| Tarjeta PCIe (AIC) | SSD en ranura PCIe |

- Interfaces **válidas** para SSD: SATA, SAS, PCIe/NVMe, M.2, U.2, mSATA. Interfaces **no válidas**: las de vídeo o de otros periféricos (VGA, HDMI, DVI, AGP, PS/2) **[Salió 2018]** (sin verificar la opción exacta).
- NVMe 2.0 (2021) reorganizó la especificación en conjuntos de comandos (incluye Zoned Namespaces y Key Value).

### RAID

**RAID** = *Redundant Array of Independent (Inexpensive) Disks*.

| Nivel | Técnica | Discos mínimos | Tolera | Capacidad útil (n discos de C) |
|---|---|---|---|---|
| RAID 0 | Bandas (*striping*) sin paridad | 2 | **0 fallos** | n x C |
| RAID 1 | Espejo (*mirroring*) | 2 | n-1 fallos | C |
| RAID 2 | Bits con código Hamming | | | Obsoleto |
| RAID 3 | Bytes con paridad dedicada | 3 | 1 | (n-1) x C |
| RAID 4 | Bloques con paridad en un disco dedicado | 3 | 1 | (n-1) x C |
| **RAID 5** | Bloques con **paridad distribuida** | **3** | **1 disco** | **(n-1) x C** |
| RAID 6 | Doble paridad distribuida | 4 | 2 discos | (n-2) x C |
| RAID 10 (1+0) | Bandas sobre espejos | 4 | 1 por espejo (hasta n/2 si son de espejos distintos) | n x C / 2 |
| RAID 50, 60 | Bandas sobre RAID 5 o 6 | 6 / 8 | | |

- RAID 5 tolera el **fallo de un solo disco** **[Salió 2025]**. Si falla un segundo antes de terminar la reconstrucción, se pierde todo el volumen. La paridad se calcula con **XOR**.
- Ejemplo: 4 discos de 2 TB en RAID 5 dan 6 TB útiles; en RAID 6, 4 TB; en RAID 10, 4 TB.
- **RAID no es copia de seguridad**: no protege de borrados, ransomware ni corrupción lógica.
- **Hot spare**: disco de reserva que entra solo al fallar otro.
- RAID por hardware (controladora) o por software (mdadm en Linux, Espacios de almacenamiento en Windows, ZFS RAID-Z).

### Almacenamiento en red

- **DAS**: conectado directamente al servidor.
- **NAS**: almacenamiento en red a **nivel de fichero** (NFS, SMB/CIFS).
- **SAN**: red dedicada a **nivel de bloque** (Fibre Channel, iSCSI, FCoE, NVMe-oF).

### Almacenamiento óptico

| Formato | Láser | Capacidad |
|---|---|---|
| CD | Infrarrojo 780 nm | 650-700 MB |
| DVD | Rojo 650 nm | 4,7 GB (1 capa), 8,5 GB (doble capa), hasta 17 GB doble cara |
| HD-DVD | Azul-violeta 405 nm | 15 GB / 30 GB (doble capa). Abandonado en **2008** |
| **Blu-ray** | Azul-violeta **405 nm** | **25 GB por capa**, 50 GB doble capa, BDXL 100/128 GB |

- Blu-ray y HD-DVD usan ambos láser azul-violeta de 405 nm. Blu-ray tiene la capa de datos más cerca de la superficie (0,1 mm) y apertura numérica mayor, por eso cabe más **[Salió 2007]**. Blu-ray ganó la "guerra de formatos" (Toshiba abandonó HD-DVD en febrero de 2008).
- **Sistemas de ficheros ópticos**: **ISO 9660** (CD-ROM, multiplataforma) **[Salió 2007]**, con extensiones **Joliet** (Windows, nombres largos Unicode) y **Rock Ridge** (Unix, permisos). **UDF** para DVD y Blu-ray.
- Formatos grabables: CD-R/RW, DVD±R/RW, DVD-RAM, BD-R/RE.
- **M-DISC**: discos de archivo de larga duración.

### Memoria flash extraíble y cinta

- **Tarjetas SD**: SD (hasta 2 GB), **SDHC** (hasta 32 GB, FAT32), **SDXC** (hasta 2 TB, exFAT), **SDUC** (hasta 128 TB). Clases de velocidad: Class 10, UHS U1/U3, Video V30/V60/V90. Buses UHS-I, UHS-II, SD Express (PCIe/NVMe).
- **microSD**, CompactFlash, **CFexpress** (PCIe/NVMe, cámaras profesionales).
- **Cinta magnética LTO** (Linear Tape-Open): copias y archivo a largo plazo, acceso secuencial, muy barato por TB. **LTO-9** (2021): 18 TB nativos. **LTO-10** (2025): 30 TB nativos. Admite WORM y cifrado.

## Periféricos de entrada y digitalización

### Clasificación de periféricos

| Tipo | Ejemplos |
|---|---|
| Entrada | Teclado, ratón, escáner, micrófono, webcam, lector de códigos de barras, tableta digitalizadora, lápiz óptico, joystick |
| Salida | Monitor, impresora, altavoces, plóter, proyector |
| Entrada/salida (mixtos) | Pantalla táctil, multifunción, módem, tarjeta de red, casco VR |
| Almacenamiento | Discos, memorias USB, unidades ópticas, cintas |

Pregunta tipo "periférico que no es de entrada" **[Salió 2016]**: la respuesta es uno de salida (impresora, monitor, altavoz, plóter) (sin verificar la opción exacta).

### Teclado

Distribuciones:

| Distribución | Dónde |
|---|---|
| **QWERTY** | Inglés, español (con Ñ) y la mayoría |
| **QWERTZ** | **Alemania, Austria, Suiza** y Europa central **[Salió 2015]** |
| **AZERTY** | Francia y Bélgica |
| Dvorak | Alternativa ergonómica, EE. UU. |

Tecnologías: membrana, tijera (portátiles), **mecánico** (interruptores individuales), capacitivo. Conexión USB (HID), PS/2 o Bluetooth.

### Ratón y otros dispositivos apuntadores

- Ratón mecánico (bola), **óptico** (LED) y **láser**. Resolución en **DPI/CPI**. Frecuencia de sondeo (*polling rate*) en Hz.
- Touchpad, trackball, trackpoint.
- **Pantallas táctiles**: **resistivas** (presión, cualquier objeto) y **capacitivas** (conductividad del dedo, multitáctil). También infrarrojas y de onda acústica.
- **Tableta digitalizadora**: lápiz con niveles de presión (Wacom).

### Escáneres

Tipos:

| Tipo | Características |
|---|---|
| **De sobremesa (plano)** | Cristal y tapa, el más común |
| Con alimentador (ADF) o de documentos | Hojas sueltas a alta velocidad, dúplex |
| De mano | Se desliza a mano sobre el original |
| **De tambor** | El original va en un cilindro. Usa **fotomultiplicadores (PMT)**. **Máxima calidad**, preprensa profesional |
| De gran formato (de rodillo) | Planos y mapas A0, el papel pasa entre rodillos |
| De diapositivas y negativos | Película |
| Cenital (*overhead*) | Libros sin aplastar, desde arriba |
| 3D | Captura geometría de objetos |

La pregunta de 2015 sobre el escáner de "gran formato y alta resolución óptica" apunta al **escáner de tambor** **[Salió 2015]** (sin verificar la opción oficial).

Sensores **[Salió 2006]**:

- **CCD** (*Charge-Coupled Device*): matriz o línea de fotodiodos que convierte luz en carga eléctrica. Su número de elementos por pulgada **fija la resolución óptica**. Mayor calidad y profundidad de campo.
- **CIS** (*Contact Image Sensor*): sensor pegado al cristal con LED. Más barato, fino y de bajo consumo, menos profundidad de campo.
- **PMT** (fotomultiplicador): escáneres de tambor.
- **CMOS**: cámaras digitales y webcams.

Parámetros:

- **Resolución óptica** (real, del sensor) frente a **interpolada** (calculada por software, no añade detalle). En dpi/ppp, por ejemplo 1200x2400.
- **Profundidad de color**: 24, 48 bits.
- **Rango dinámico** (densidad óptica, Dmax).
- **TWAIN**: estándar de comunicación entre escáner y aplicaciones. Otros: WIA (Windows), SANE (Linux), eSCL/AirScan (sin controlador).

### Digitalización y reconocimiento

- **OCR** (*Optical Character Recognition*): convierte la imagen de un texto escaneado en **texto editable** **[Salió 2008]**.
- **ICR** (*Intelligent Character Recognition*): texto manuscrito.
- **OMR** (*Optical Mark Recognition*): marcas en casillas, como las hojas de respuesta del test.
- **MICR**: caracteres con tinta magnética (cheques).
- **Códigos de barras**: 1D (EAN-13, Code 128, Code 39) y 2D (**QR**, DataMatrix, PDF417).
- **PDF/A**: PDF para archivo a largo plazo (ISO 19005). Formato habitual del documento digitalizado con OCR.
- **Digitalización certificada** en la Administración: la **NTI de Digitalización de Documentos** (Resolución de 19 de julio de 2011) pide una resolución mínima de **200 ppp**, formatos del catálogo de la NTI de catálogo de estándares y metadatos mínimos. La copia auténtica electrónica se regula en el art. 27 de la Ley 39/2015.
- **Biometría**: lectores de huella, reconocimiento facial (Windows Hello), iris.
- **Lector de tarjetas inteligentes**: DNIe (norma ISO 7816), con contacto y NFC en el DNIe 3.0 y 4.0.

### Audio y vídeo de entrada

- **Webcam**: sensor CMOS, clase UVC.
- Tarjeta de sonido: conversor **ADC** (entrada) y **DAC** (salida). Calidad CD: 44,1 kHz, 16 bits, estéreo.
- **Capturadora**: digitaliza señal HDMI o analógica.

## Trampas y respuestas desactualizadas

- **USB PD (2017)**: la respuesta oficial era **100 W**. Hoy, con USB PD 3.1 EPR, el máximo es **240 W**. Si sale hoy, elige 240 W salvo que la pregunta cite una versión antigua.
- **USB4 (2019)**: la respuesta era **40 Gbit/s**. USB4 v2.0 (2022) llega a **80 Gbit/s** (120 asimétricos). Fíjate si la pregunta dice "USB4" o "USB4 versión 2".
- **Nombres USB 3.x**: el USB-IF renombró dos veces. USB 3.0 = USB 3.1 Gen 1 = USB 3.2 Gen 1 = 5 Gbit/s. No te fíes del número: mira "Gen".
- **Thunderbolt 4 no es más rápido que Thunderbolt 3**: ambos 40 Gbit/s. El salto es Thunderbolt 5 (80/120 Gbit/s).
- **Thunderbolt 1 y 2 usaban Mini DisplayPort**, no USB-C. USB-C llega con Thunderbolt 3.
- **HDMI 2.1 (2025)**: 48 Gbit/s. No confundir con HDMI 2.0 (18 Gbit/s) ni con HDMI 2.2 (96 Gbit/s, 2025).
- **IEEE 1394b**: 800 Mbit/s es lo habitual. La norma contempla hasta 3,2 Gbit/s.
- **AGP (2005)**: pregunta OBSOLETA. Las gráficas usan **PCIe x16** desde 2004.
- **Mbit/s frente a MB/s**: USB 2.0 son 480 **Mbit/s** (unos 60 MB/s teóricos). Un distractor típico cambia la unidad.
- **M.2 no es un protocolo**: es un formato físico que puede ir por SATA o por PCIe/NVMe. Un SSD M.2 SATA no va más rápido que uno de 2,5" SATA.
- **NVMe no es un conector**: es un protocolo sobre PCIe.
- **Clúster**: es una unidad lógica del sistema de ficheros, no una zona física del disco.
- **"Monitor LED"** es un LCD con retroiluminación LED. OLED sí es emisivo.
- **Sublimación**: sólido a gas, sin pasar por líquido. Distractor: "la tinta se funde" (eso es cera sólida).
- **GDI**: el trabajo de rasterizado lo hace el **PC**, no la impresora.
- **Dot pitch**: menor es mejor.
- **Resolución óptica frente a interpolada**: la que cuenta es la óptica, fijada por el CCD.
- **Blu-ray y HD-DVD usan el mismo láser azul-violeta (405 nm)**. La diferencia de capacidad viene de la óptica y del espesor de la capa protectora.
- **RAID 0 no tiene redundancia**: la "R" no se cumple. RAID 5 solo aguanta un disco.
- **Bluetooth**: 1 maestro y 7 esclavos activos por piconet (255 aparcados en las versiones clásicas).
