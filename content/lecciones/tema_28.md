# Tema 28. Seguridad de los sistemas de información

Peso en el examen: unas **3,4 preguntas de test** y **0,1 de supuesto III** por convocatoria (unos 2,4 puntos esperados). Hay **88 preguntas históricas** (2005-2025). Concentran casi todo cinco bloques: herramientas del CCN-CERT (una o dos por examen desde 2016), algoritmos simétricos y asimétricos, tipos de ataque y malware, firma digital y sus formatos, y CPD (tiers TIA-942 y Uptime). Las dimensiones de seguridad y los conceptos de MAGERIT (amenaza, vulnerabilidad, impacto, riesgo) salen con regularidad. Control remoto y gestión de incidencias casi no se preguntan, salvo ITIL y el CAU.

## Cómo lo preguntan

- **"Qué herramienta del CCN-CERT hace X"**: cuatro nombres de mujer y una descripción. Salió en 2016, 2017 (dos), 2018, 2019, 2022 (dos) y 2024. Es pura memoria.
- **"Cuál NO es asimétrico / cuál es simétrico"**: listas mezcladas de RSA, DSA, ElGamal, AES, IDEA, DES, GOST. Salió en 2006, 2015 (cuatro), 2016 y 2019.
- **Definición de un ataque por su nombre exótico**: vishing (2024), clickjacking (2018), defacement (2018), pharming (2008), bluejacking (2008), eavesdropping (2008), hoax (2015), phreaker (2016).
- **Afirmación correcta o incorrecta sobre conceptos**: activo, amenaza, vulnerabilidad, impacto, riesgo (2005, 2017, 2018). Ojo a las definiciones literales de MAGERIT.
- **Supuesto IV con un caso**: "la base de datos está corrupta, ¿qué dimensiones se ven afectadas?" (2024), "un intruso entra detrás de un empleado" (2024), "el hash publicado bajo la descarga" (2024).
- **Proceso de firma digital**: qué clave se usa para firmar (2008) o qué afirmación es falsa (2019). La trampa típica: "la firma cifra el documento y da confidencialidad".
- **CPD**: número de tiers y cuál es el de mayor disponibilidad (2015, 2016, 2019); zonas de TIA-942 (2025); diferenciales del cuadro eléctrico (2015).
- **Comandos y ficheros**: `openssl` para generar una clave RSA (2015), `/etc/hosts.allow` (2017), clave de BitLocker (2019), `auditd` en RHEL (2025 b4).
- **Recientes (2024-2025)**: tiran de guías y servicios del CCN-CERT y de bases de datos de vulnerabilidades (NVD).

## Conceptos básicos de seguridad

### Seguridad de la información

La seguridad de la información protege los datos y los servicios que los tratan. Se apoya en tres pilares clásicos (la tríada **CIA**). El ENS y MAGERIT añaden dos dimensiones más.

| Dimensión (ENS) | Sigla | Qué garantiza | Amenaza típica |
|---|---|---|---|
| Confidencialidad | C | Solo acceden quienes están autorizados | Interceptación, sniffing, fuga |
| Integridad | I | La información es exacta y completa, sin alteraciones indebidas | Modificación, corrupción |
| Disponibilidad | D | Los autorizados acceden cuando lo necesitan | Interrupción, DoS, borrado |
| Autenticidad | A | La entidad es quien dice ser, o los datos proceden de quien dicen | Suplantación, fabricación |
| Trazabilidad | T | Se puede saber quién hizo qué y cuándo | Borrado de logs, falta de auditoría |

- **Integridad**: "garantía de que la información y sus métodos de proceso son exactos y completos, y no han sido modificados indebidamente" **[Salió 2007]**.
- Tríada CIA: confidencialidad, integridad y disponibilidad son "tres atributos esenciales" **[Salió 2006]**.
- **No repudio**: el emisor no puede negar que envió (no repudio en origen). El receptor no puede negar que recibió (no repudio en destino). Lo aporta la firma electrónica.
- **Autenticación** frente a **autorización**: la primera comprueba la identidad; la segunda decide qué puede hacer esa identidad.
- **AAA**: Authentication, Authorization, Accounting (contabilidad o registro de uso).

Caso práctico **[Salió 2024 b4]**: una base de datos corrupta a la que nadie puede acceder afecta a la **disponibilidad** (no hay acceso) y a la **integridad** (fichero corrupto). Si se sabe quién, cómo y por qué, la trazabilidad no está afectada. La confidencialidad tampoco, porque nadie ha leído nada.

Otro caso **[Salió 2007 b4, 2008 b4]**: un atacante que intercepta y lee el tráfico (wifi o cifrado mal implementado) afecta a la **confidencialidad**.

### Seguridad física y lógica

- **Seguridad física**: protege el hardware, las instalaciones y los soportes frente a amenazas materiales. Incluye control de acceso al edificio y a la sala, biometría, CCTV, protección contra incendio, agua, temperatura y cortes de energía.
- **Seguridad lógica**: protege el software y los datos mediante controles informáticos. Incluye identificación y autenticación, control de acceso, cifrado, antimalware, cortafuegos, copias y registros.
- La biometría para entrar en la sala es seguridad física o perimetral, no lógica **[Salió 2006]**.
- **Defensa en profundidad**: varias capas de protección sucesivas. La seguridad de un SO es imprescindible y se implementa con **varios niveles de protección** **[Salió 2005]**.

### Clasificación de amenazas por su efecto sobre el flujo (Stallings)

| Tipo | Qué hace el atacante | Dimensión afectada |
|---|---|---|
| Interrupción | Corta el flujo o destruye un recurso | Disponibilidad |
| Interceptación | Accede sin autorización (escucha) | Confidencialidad |
| Modificación | Accede y altera | Integridad |
| Fabricación | Inserta objetos falsificados | Autenticidad |

- "La disponibilidad se ve afectada por la interrupción" es la afirmación correcta **[Salió 2017]**.
- Insertar objetos falsificados (virus) en el sistema es **fabricación** **[Salió 2005]**.
- Otra clasificación: amenazas **pasivas** (escuchar, analizar tráfico; no alteran) y **activas** (modifican, suplantan, deniegan servicio).

### Activo, amenaza, vulnerabilidad, impacto y riesgo

Definiciones según MAGERIT v3 (metodología del Ministerio, herramienta PILAR) y la ISO 27000.

| Concepto | Definición útil para el examen |
|---|---|
| Activo | Componente o funcionalidad del sistema susceptible de ser atacado, con consecuencias para la organización. Los **datos** son el activo más crítico **[Salió 2008]** |
| Amenaza | Causa potencial de un incidente que puede causar daños a un sistema o a la organización **[Salió 2018]** |
| Vulnerabilidad | Debilidad de un activo que puede ser aprovechada por una amenaza |
| Ataque | Intento deliberado de materializar una amenaza |
| Impacto | Consecuencia de la materialización de una amenaza sobre un activo |
| Riesgo | Estimación del grado de exposición: probabilidad de que una amenaza se materialice causando un impacto |
| Salvaguarda | Procedimiento o mecanismo que reduce el riesgo |
| Riesgo residual | El que queda tras aplicar las salvaguardas |

- Fórmula práctica: **Riesgo = Probabilidad × Impacto**.
- Tratamiento del riesgo: **mitigar** (reducir), **transferir** (seguro, externalizar), **aceptar** y **evitar** (eliminar la actividad).
- "Impacto es el evento que puede desencadenar un incidente" es **falso**: eso es la amenaza **[Salió 2005]**.
- "Ataque: evento que puede originar un incidente produciendo daños materiales o pérdidas inmateriales" es **incorrecto**: es la definición de amenaza de MAGERIT v1 **[Salió 2017]** (sin verificar la opción oficial).
- Cuidado: MAGERIT v1 definía vulnerabilidad como "posibilidad de ocurrencia de la materialización de una amenaza sobre un activo". Los exámenes de 2005 y 2017 la dan por buena. La definición moderna es "debilidad".

### Marco normativo y estándares

| Norma | Qué es |
|---|---|
| ENS, Real Decreto 311/2022 | Esquema Nacional de Seguridad. Obligatorio para el sector público y sus proveedores. Categorías BÁSICA, MEDIA y ALTA. Niveles BAJO, MEDIO y ALTO por dimensión |
| RGPD (UE) 2016/679 y LOPDGDD 3/2018 | Protección de datos. Brechas a la AEPD en **72 horas** (art. 33 RGPD) |
| Directiva NIS2 (UE) 2022/2555 | Ciberseguridad de entidades esenciales e importantes. Sustituye a NIS1. Notificación: alerta temprana 24 h, notificación 72 h, informe final en un mes |
| RD-ley 12/2018 y RD 43/2021 | Transposición de NIS1 en España. La ley que transpone NIS2 ha estado en tramitación; comprueba su estado antes del examen |
| ISO/IEC 27001:2022 | Requisitos del SGSI, certificable. Anexo A con **93 controles** en 4 temas: organizacionales (37), personas (8), físicos (14) y tecnológicos (34) |
| ISO/IEC 27002:2022 | Guía de buenas prácticas de los controles |
| ISO/IEC 27005 | Gestión de riesgos de seguridad de la información |
| ISO 22301 | Continuidad de negocio |
| MAGERIT v3 (2012) | Metodología española de análisis y gestión de riesgos. Herramienta: **PILAR** |

En el ENS la categoría del sistema es el nivel más alto que alcance cualquiera de sus dimensiones. El ENS exige auditoría ordinaria al menos cada **dos años** en categorías MEDIA y ALTA. La BÁSICA basta con autoevaluación.

## Amenazas y ataques

### Malware

| Nombre | Rasgo que lo define |
|---|---|
| Virus | Se adjunta a un programa o fichero huésped. Necesita que se ejecute |
| Gusano (worm) | Se **replica** solo, en memoria y por la red, sin huésped **[Salió 2007 b4]** |
| Troyano | Programa aparentemente legítimo con una función oculta maliciosa |
| Bomba lógica | Código que se activa al cumplirse una condición (fecha, evento) |
| Rootkit | Mantiene acceso privilegiado y oculta su presencia corrompiendo el SO **[Salió 2016]** |
| Ransomware | Cifra los datos de la víctima y exige un rescate **[Salió 2016]**. Ejemplo: WannaCry (2017) |
| Spyware | Recopila información del usuario sin su consentimiento |
| Keylogger | Registra las pulsaciones del teclado |
| Adware | Muestra publicidad no deseada |
| Backdoor | Puerta trasera para acceder saltándose la autenticación |
| Botnet | Red de equipos infectados (zombis) controlados por un C&C |
| RAT | Troyano de acceso remoto |
| Cryptojacking | Usa la CPU de la víctima para minar criptomoneda |
| Malware sin fichero (fileless) | Vive en memoria y usa herramientas legítimas (PowerShell, WMI) |
| Wiper | Borra o destruye datos sin pedir rescate |

### Ingeniería social y fraude

| Término | Significado |
|---|---|
| Phishing | Correo que suplanta a una entidad para robar credenciales o datos |
| Spear phishing | Phishing dirigido a una persona o grupo concreto |
| Whaling | Phishing dirigido a altos cargos ("ballenas") |
| Smishing | Phishing por SMS |
| Vishing | Suplantación mediante **llamadas telefónicas** (voz) **[Salió 2024]** |
| Quishing | Phishing mediante códigos QR |
| Pharming | Redirige al usuario a una web falsa manipulando DNS o el fichero hosts **[Salió 2008]** |
| Hoax | Bulo: mensaje que avisa de un problema inexistente, a veces con instrucciones dañinas **[Salió 2015]** |
| Spam | Correo masivo no solicitado, normalmente publicitario |
| Scam | Estafa por correo (falsas herencias, premios) |
| Pretexting | Inventar un escenario creíble para sonsacar información |
| Baiting | Dejar un cebo (USB infectado) para que alguien lo use |
| Quid pro quo | Ofrecer algo a cambio de información o acceso |
| Tailgating o piggybacking | Colarse en una zona física detrás de una persona autorizada **[Salió 2024 b4]** |
| Shoulder surfing | Mirar por encima del hombro para ver contraseñas |
| Dumpster diving | Buscar información en la basura |

Matiz: en sentido estricto, en el *tailgating* el autorizado no se da cuenta. En el *piggybacking* lo consiente. El examen los dio como equivalentes.

### Ataques técnicos

| Ataque | Descripción |
|---|---|
| Sniffing | **Capturar** el tráfico que circula por la red |
| Spoofing | **Suplantar** una identidad: IP, MAC, ARP, DNS, correo |
| Eavesdropping | Escucha pasiva: obtener información **sin modificarla** **[Salió 2008]** |
| Man in the middle | El atacante se interpone entre dos partes y lee o altera |
| Escaneo de puertos | Reconocimiento: averiguar servicios y datos técnicos del sistema **[Salió 2024]** |
| DoS | Denegación de servicio desde un origen |
| DDoS | Denegación **distribuida**: muchos orígenes (botnet) contra un objetivo |
| SYN flood | Inunda con SYN sin completar el *handshake* |
| Smurf | ICMP a una dirección de difusión con origen falsificado |
| Replay | Reenviar un mensaje capturado válido |
| Fuerza bruta y diccionario | Probar todas las claves o una lista de palabras |
| Credential stuffing | Probar credenciales filtradas en otros servicios |
| Password spraying | Una contraseña común contra muchas cuentas |
| Inyección SQL | Insertar SQL en una entrada no validada |
| XSS | Inyectar *script* que se ejecuta en el navegador de otro usuario |
| CSRF | Hacer que el navegador autenticado envíe una petición no deseada |
| Clickjacking | Secuestrar los clics con capas invisibles y redirigirlos a otro sitio **[Salió 2018]** |
| Defacement | Cambiar la apariencia de una web atacada **[Salió 2018 b4]** |
| Directory traversal | Acceder a ficheros del servidor fuera de la raíz web (`../`) |
| Día cero (zero-day) | Explota una vulnerabilidad desconocida para fabricante y antivirus, sin parche **[Salió 2018 b3]** |
| Ataque a la cadena de suministro | Comprometer a un proveedor o una dependencia de software |

En 2024 la correcta era la del escaneo de puertos. Las otras intercambiaban sniffing y spoofing, y describían el DDoS como "desde un único punto" (falso).

### Ataques por Bluetooth

- **Bluejacking**: enviar mensajes no solicitados a dispositivos Bluetooth **[Salió 2008]**. Es molesto, no roba datos.
- **Bluesnarfing**: robar información (agenda, ficheros) por Bluetooth.
- **Bluebugging**: tomar el control del dispositivo (llamadas, mensajes).

### Amenazas persistentes avanzadas (APT)

Definición del CCN **[Salió 2024 b4]**: ataque dirigido de **ciberespionaje o cibersabotaje**, llevado a cabo bajo la dirección o el patrocinio de un **país** o de una organización adversaria. Sus motivos van más allá de lo económico, delictivo o de protesta política.

Rasgos: objetivo concreto, gran sofisticación, permanencia oculta durante meses, recursos elevados. La herramienta del CCN contra APT es **CARMEN**.

### Perfiles de atacante

| Término | Perfil |
|---|---|
| Hacker | Experto que busca fallos. Puede ser ético (white hat) |
| Cracker | Rompe protecciones con fines maliciosos o de lucro |
| Phreaker | Abusa de la **red telefónica** o del teléfono ajeno **[Salió 2016]** |
| Lamer | Presume de saber sin conocimientos reales |
| Script kiddie | Usa herramientas de otros sin entenderlas |
| Insider | Empleado o persona interna que ataca |
| Hacktivista | Ataca por motivos ideológicos o de protesta |

## Vulnerabilidades

### Identificación y bases de datos

| Recurso | Responsable | Para qué sirve |
|---|---|---|
| CVE | MITRE | Identificador único de vulnerabilidad: `CVE-2021-44228` (Log4Shell) |
| NVD (National Vulnerability Database) | **NIST** (EE. UU.) | Base de datos pública que enriquece los CVE con CVSS, CWE y CPE **[Salió 2025]** |
| CVSS | FIRST | Puntuación de gravedad de 0 a 10. Versión vigente: **4.0** (2023) |
| CWE | MITRE | Catálogo de **tipos** de debilidad (CWE-79 es XSS, CWE-89 es SQLi) |
| CPE | NIST | Nombre normalizado de producto y versión afectado |
| KEV | CISA | Catálogo de vulnerabilidades explotadas activamente |
| EUVD | ENISA | Base de datos europea de vulnerabilidades, en marcha desde 2025 (NIS2) |

Rangos de gravedad CVSS (v3 y v4):

| Puntuación | Gravedad |
|---|---|
| 0,0 | Ninguna |
| 0,1 - 3,9 | Baja |
| 4,0 - 6,9 | Media |
| 7,0 - 8,9 | Alta |
| 9,0 - 10,0 | Crítica |

### Gestión de vulnerabilidades y pruebas

- Ciclo: inventario, detección (escáner), valoración (CVSS), corrección (parche o mitigación), verificación.
- **Escáneres de vulnerabilidades**: Nessus, OpenVAS (Greenbone), Qualys.
- **Pruebas de seguridad de aplicaciones**: IBM AppScan (hoy HCL AppScan) **[Salió 2016]**, OWASP ZAP, Burp Suite.
- **Pentesting**: Kali Linux, Metasploit, Nmap (escaneo de puertos), Wireshark (captura de tráfico), John the Ripper y Hashcat (contraseñas).
- Distractores de 2016: HP LoadRunner (pruebas de **rendimiento**), JAWS (lector de pantalla), aDesigner (accesibilidad).
- Tipos de prueba: SAST (análisis estático de código), DAST (aplicación en ejecución), IAST (mixta), caja negra, gris y blanca.
- Bastionado (*hardening*): quitar servicios innecesarios, cambiar credenciales por defecto, aplicar guías CCN-STIC.

## Seguridad lógica: identificación, autenticación y control de acceso

### Factores de autenticación

| Factor | Ejemplos |
|---|---|
| Algo que sabes | Contraseña, PIN, frase de paso, respuesta secreta |
| Algo que tienes | Tarjeta criptográfica, token, USB, móvil con app OTP, generador de claves |
| Algo que eres | Huella, iris, cara, voz (biometría) |

- **2FA o MFA**: combinar factores de **categorías distintas**. Dos contraseñas no son 2FA.
- Caso **[Salió 2017 b3]**: la política exige "algo que sabes + algo que tienes". **Password + huella dactilar** no la cumple, porque la huella es "algo que eres".
- **Token físico de seguridad**: dispositivo electrónico que se entrega al usuario autorizado para facilitar la autenticación **[Salió 2016]**.
- OTP: HOTP (por contador, RFC 4226) y TOTP (por tiempo, RFC 6238, normalmente 30 s).
- **FIDO2/WebAuthn y passkeys**: autenticación sin contraseña con criptografía de clave pública. Resiste el phishing.
- Medidas para impedir que alguien se haga pasar por otro: **anti-spoof** **[Salió 2017 b4]**.

### Contraseñas robustas

Recomendaciones habituales del CCN-CERT y del NIST SP 800-63B **[Salió 2025]**:

- Longitud como primer factor: mejor **12 o más** caracteres. Las frases de paso largas son una buena opción.
- Mezclar mayúsculas, minúsculas, números y símbolos.
- Sin datos personales, palabras de diccionario ni patrones de teclado (`qwerty`, `123456`).
- Una contraseña distinta por servicio. Usar gestor de contraseñas.
- Activar el doble factor siempre que sea posible.
- Almacenamiento en servidor: nunca en claro. Hash con sal y algoritmo lento: **bcrypt, scrypt, Argon2** o PBKDF2.
- Construir la contraseña a partir de **frases sin sentido** (fáciles de recordar para uno y difíciles de adivinar para otros) es una recomendación del CCN-CERT. En 2025 la plantilla dio por buena "**usar frases cortas sin sentido**" (opción c).

Ojo: "cortas" choca con la longitud como primer factor; ver Trampas.

### Control de acceso

| Modelo | Quién decide |
|---|---|
| DAC (discrecional) | El propietario del recurso (permisos Unix, ACL de NTFS) |
| MAC (obligatorio) | El sistema, por etiquetas de clasificación (SELinux, entornos militares) |
| RBAC (por roles) | Permisos asignados a roles, y roles a usuarios |
| ABAC (por atributos) | Reglas sobre atributos del usuario, recurso y contexto |

- Principios: **mínimo privilegio**, **necesidad de conocer**, **segregación de funciones**.
- Clasificación TCSEC o "Libro Naranja" (DoD, 1985): niveles D, C1, C2, B1, B2, B3 y A1, de menor a mayor. Hoy la sustituye **Common Criteria** (ISO/IEC 15408), con niveles EAL1 a EAL7.

### Servicios de autenticación

| Servicio | Datos clave |
|---|---|
| Kerberos | Protocolo de autenticación de red del **MIT** **[Salió 2015]**. Usa tickets y un KDC (AS + TGS). Puerto 88. Base de Active Directory |
| RADIUS | AAA centralizado. UDP 1812 (autenticación) y 1813 (contabilidad) |
| TACACS+ | AAA de Cisco. TCP 49. Cifra todo el paquete |
| LDAP / LDAPS | Directorio. Puertos 389 y 636 |
| EAP | Marco de autenticación extensible (802.1X, wifi WPA-Enterprise) |
| CHAP | Autenticación PPP por desafío-respuesta |
| SAML 2.0, OAuth 2.0, OpenID Connect | Federación de identidades y SSO web |

- Caso **[Salió 2008 b4]**: entre X.509, EAP, CHAP y "SATP", el que **no** es mecanismo de autenticación es SATP, porque no existe.
- **Cl@ve** es el sistema de identificación de la AGE (Cl@ve PIN, Cl@ve Permanente, certificado, Cl@ve Móvil).

### Controles de acceso en Windows y Linux

- **LAPS** (Local Administrator Password Solution): gestiona y rota las contraseñas de la cuenta de **administrador local** de equipos del dominio **[Salió 2016 b4]**. Desde 2023 viene integrado en Windows (Windows LAPS).
- **BitLocker**: cifrado de disco de Windows, apoyado en el chip TPM. Para restaurar o desbloquear un equipo cifrado hace falta la **clave de recuperación de BitLocker** (48 dígitos) **[Salió 2019 b4]**.
- **TCP Wrappers** en Linux: `/etc/hosts.allow` y `/etc/hosts.deny` controlan qué hosts acceden a servicios concretos **[Salió 2017 b4]**. Se consulta primero `hosts.allow`.

```bash
# /etc/hosts.allow
sshd: 192.168.1.0/24
# /etc/hosts.deny
ALL: ALL
```

Ojo: muchas distribuciones modernas ya no compilan sshd con TCP Wrappers. Hoy se filtra con el cortafuegos (nftables, firewalld) o con `AllowUsers` en `sshd_config`.

- **auditd** (Linux Audit, RHEL): demonio que registra con detalle los eventos del sistema (llamadas al sistema, accesos a ficheros, cambios de usuarios). Reglas con `auditctl` o en `/etc/audit/rules.d/`, registro en `/var/log/audit/audit.log` y consultas con `ausearch` y `aureport` **[Salió 2025 b4]**.

## Criptografía

### Conceptos

- **Criptografía**: técnica para cifrar. **Criptoanálisis**: técnica para romper el cifrado. **Criptología**: ambas.
- **Principio de Kerckhoffs**: la seguridad debe depender solo del secreto de la clave, no del algoritmo.
- **Cifrado en bloque**: procesa bloques de tamaño fijo (DES, AES, IDEA). Modos: ECB (inseguro), CBC, CTR, GCM (cifrado autenticado).
- **Cifrado en flujo**: procesa bit a bit o byte a byte (RC4, ChaCha20).
- Servicios que aporta: confidencialidad (cifrado), integridad (hash, MAC), autenticidad y no repudio (firma).

### Criptografía simétrica

Misma clave para cifrar y descifrar. Es rápida. Problema: distribuir la clave de forma segura.

| Algoritmo | Bloque | Clave | Notas |
|---|---|---|---|
| DES | 64 bits | 56 bits | Roto por fuerza bruta. Obsoleto |
| 3DES (TDEA) | 64 bits | 168 (seguridad efectiva 112) | Retirado por el NIST desde 2023 **[Salió 2016]** |
| AES (Rijndael) | **128 bits** | 128, 192 o 256 | Estándar actual (FIPS 197, 2001) |
| IDEA | **64 bits** | 128 bits | Usado en las primeras versiones de PGP **[Salió 2016]** |
| Blowfish | 64 bits | 32 a 448 | De Schneier |
| Twofish | 128 bits | Hasta 256 | Finalista del concurso AES |
| RC5 | Variable (32, 64, 128) | Variable | De Rivest |
| RC4 | Flujo | Variable | Roto. Prohibido en TLS |
| ChaCha20 | Flujo | 256 bits | Usado en TLS 1.3 con Poly1305 |
| Camellia | 128 bits | 128, 192, 256 | Japonés, aceptado en TLS |
| GOST 28147-89 | 64 bits | 256 bits | Estándar ruso **simétrico** **[Salió 2019]** |
| FEAL | 64 bits | 64 bits | Japonés, roto |

Número de claves con criptografía simétrica: **n(n-1)/2** (una por pareja). Con 6 usuarios, 15 claves.

### Criptografía asimétrica (clave pública)

Cada usuario tiene un par de claves: **pública** (se difunde) y **privada** (secreta). Lo cifrado con una solo se descifra con la otra **[Salió 2006]**. Es lenta, por eso se combina con la simétrica.

| Algoritmo | Base matemática | Uso |
|---|---|---|
| RSA | Factorización de enteros grandes | Cifrado y firma |
| Diffie-Hellman | Logaritmo discreto | **Intercambio de claves** (no cifra ni firma) |
| ElGamal | Logaritmo discreto | Cifrado y firma |
| DSA | Logaritmo discreto | Solo **firma** (FIPS 186) |
| ECC | Curvas elípticas | Familia de algoritmos con claves cortas |
| ECDSA | Curvas elípticas | **Firma digital** (Elliptic Curve Digital Signature Algorithm) **[Salió 2022]** |
| ECDH / ECDHE | Curvas elípticas | Intercambio de claves (la E final es efímera) |
| EdDSA (Ed25519) | Curvas de Edwards | Firma, rápida y segura |
| ECIES | Curvas elípticas | Cifrado integrado (híbrido) |
| Rabin, Paillier, McEliece | Varias | Menos frecuentes |

Número de claves con criptografía asimétrica: **2n** (un par por usuario). Con 6 usuarios, **12 claves** **[Salió 2007 b4]**.

Regla para las preguntas "cuál es asimétrico": son asimétricos RSA, DSA, ECDSA, ElGamal, Diffie-Hellman, ECC, ECIES. Son simétricos DES, 3DES/TDEA, AES, IDEA, RC4, RC5, Blowfish, Twofish, Serpent, Camellia, GOST, FEAL **[Salió 2006 b4, 2015, 2015 b4, 2016, 2019]**.

Equivalencias de seguridad aproximadas (NIST SP 800-57):

| Seguridad (bits) | Simétrica | RSA / DH | Curva elíptica |
|---|---|---|---|
| 112 | 3DES | 2048 | 224 |
| 128 | AES-128 | 3072 | 256 |
| 192 | AES-192 | 7680 | 384 |
| 256 | AES-256 | 15360 | 512 |

El CCN (guía CCN-STIC 807, criptología de empleo en el ENS) recomienda en general AES, RSA de al menos 3072 bits para larga duración, curvas de 256 bits o más e intercambio de claves con (EC)DHE efímero. Como **nivel mínimo de seguridad para el intercambio de claves (key exchange)** la respuesta oficial es **112 bits** **[Salió 2025, reserva]** (equivale a RSA/DH de 2048 o curva de 224, primera fila de la tabla).

### Usos combinados: cifrar y firmar

| Objetivo | Clave que usa el emisor | Clave que usa el receptor |
|---|---|---|
| Confidencialidad (cifrar para B) | Pública de B | Privada de B |
| Firma (autenticidad de A) | **Privada de A** **[Salió 2008]** | Pública de A |

- **Cifrado híbrido o sobre digital**: el mensaje se cifra con una clave simétrica de sesión aleatoria. Esa clave se cifra con la pública del receptor. Así funcionan TLS, PGP y S/MIME.
- **Criptografía poscuántica**: el NIST publicó en agosto de 2024 los FIPS 203 (**ML-KEM**, antes Kyber, encapsulación de claves), 204 (**ML-DSA**, antes Dilithium, firma) y 205 (**SLH-DSA**, antes SPHINCS+, firma). En 2025 eligió **HQC** como KEM de respaldo. Un ordenador cuántico rompería RSA y ECC (algoritmo de Shor), no AES-256.

### Funciones hash

Una función hash calcula, a partir de una entrada de longitud arbitraria, un **resumen de longitud fija**. Propiedades:

- **Unidireccional**: no se puede reconstruir el mensaje a partir del resumen.
- **Determinista**: el mismo mensaje da siempre el mismo resumen.
- **Efecto avalancha**: un cambio mínimo cambia por completo el resumen.
- **Resistencia a colisiones**: es difícil encontrar dos mensajes con el mismo resumen. Pero las colisiones **existen** (hay infinitas entradas y finitos resúmenes).
- Sirve para garantizar la **integridad**, no la confidencialidad **[Salió 2015]**.
- "Dos huellas idénticas pueden proceder de dos mensajes iguales o de dos completamente diferentes" es la propiedad correcta **[Salió 2007]**.

| Algoritmo | Resumen | Estado |
|---|---|---|
| MD5 | 128 bits | Roto. Solo para comprobaciones no críticas |
| SHA-1 | 160 bits | Roto: primera colisión práctica (SHAttered) anunciada en febrero de 2017 **[Salió 2016 b4]** |
| SHA-2 (SHA-224, 256, 384, 512) | 224 a 512 bits | Vigente |
| SHA-3 (Keccak) | 224 a 512 bits | Vigente, FIPS 202 (2015) |
| RIPEMD-160 | 160 bits | Usado en Bitcoin |
| BLAKE2 y BLAKE3 | Variable | Rápidos, modernos |

- **HMAC**: hash con clave secreta. Aporta integridad y autenticidad del origen, pero no no repudio.
- Caso **[Salió 2024 b4]**: el CCN-CERT publica un hash junto al enlace de descarga. Es una medida de **integridad**: si el hash calculado no coincide con el publicado, el fichero no es válido.

```bash
sha256sum herramienta.zip          # Linux
certutil -hashfile herramienta.zip SHA256   # Windows (cmd)
Get-FileHash herramienta.zip -Algorithm SHA256   # PowerShell
```

### OpenSSL y comandos

El comando para crear una clave privada RSA en Linux es **openssl** **[Salió 2015 b4]**.

```bash
openssl genrsa -out privada.pem 3072                 # clave privada RSA (forma clásica)
openssl genpkey -algorithm RSA -pkeyopt rsa_keygen_bits:3072 -out privada.pem   # forma moderna
openssl rsa -in privada.pem -pubout -out publica.pem # extraer la clave pública
openssl req -new -key privada.pem -out peticion.csr  # petición de certificado (CSR)
openssl x509 -in cert.pem -text -noout               # ver un certificado
openssl dgst -sha256 -sign privada.pem -out firma.bin doc.pdf    # firmar
openssl dgst -sha256 -verify publica.pem -signature firma.bin doc.pdf  # verificar
ssh-keygen -t ed25519                                # par de claves SSH
gpg --gen-key                                        # par de claves OpenPGP
```

## Firma electrónica y certificados

### Proceso de firma digital

1. Se calcula el **hash** del documento.
2. Se **cifra el hash con la clave privada** del firmante. El resultado es la firma.
3. Se envía el documento, la firma y normalmente el certificado del firmante.
4. El receptor descifra la firma con la **clave pública** del firmante y obtiene el hash original.
5. El receptor calcula el hash del documento recibido. Si coinciden, la firma es válida.

- La firma **no cifra el documento** y **no da confidencialidad**. Esa es la afirmación falsa de 2019 **[Salió 2019]**.
- La firma electrónica asegura **integridad, autenticidad y no repudio en origen** **[Salió 2008]**.

### Marco legal

| Norma | Contenido |
|---|---|
| Reglamento (UE) 910/2014 **eIDAS** | Identificación electrónica y servicios de confianza en la UE |
| Reglamento (UE) 2024/1183 (**eIDAS2**) | Reforma eIDAS. Crea la **Cartera Europea de Identidad Digital** (EUDI Wallet) |
| Ley 6/2020 | Servicios electrónicos de confianza en España. Deroga la Ley 59/2003 de firma electrónica |
| Ley 39/2015, arts. 9 a 11 | Sistemas de identificación y firma de los interesados ante las AAPP |
| Ley 40/2015, arts. 42 y 43 | Sello electrónico de órgano, CSV y firma del personal |

Tipos de firma según eIDAS:

| Tipo | Requisitos |
|---|---|
| Simple | Datos electrónicos asociados a otros que el firmante usa para firmar |
| Avanzada | Vinculada al firmante de forma única, permite identificarlo, bajo su control exclusivo, detecta cambios posteriores |
| Cualificada | Avanzada + certificado **cualificado** + dispositivo cualificado de creación de firma (QSCD). Equivale a la **manuscrita** (art. 25.2) |

Otros servicios de confianza: **sello electrónico** (de persona jurídica), **sello de tiempo**, entrega electrónica certificada, autenticación de sitios web (QWAC) y, desde eIDAS2, archivo electrónico y libros mayores electrónicos.

### Formatos de firma avanzada (ETSI)

| Formato | Base | Uso típico | Norma ETSI |
|---|---|---|---|
| **CAdES** | CMS / PKCS#7 (binario) | Cualquier fichero. Adecuado para **ficheros grandes** **[Salió 2024]** | EN 319 122 |
| **XAdES** | XML-DSig | Documentos XML, facturae. Lo usa Microsoft Office (OOXML) | EN 319 132 |
| **PAdES** | PDF (ISO 32000) | Documentos **PDF**: la firma va dentro del PDF | EN 319 142 |
| ASiC | Contenedor ZIP | Agrupa documentos y firmas CAdES o XAdES | EN 319 162 |
| JAdES | JSON (JWS) | Firmas en servicios web y API | TS 119 182 |

En 2024 la correcta era la de CAdES y ficheros grandes. Los distractores atribuían a CAdES lo propio de XAdES (resultado XML, Office) y de PAdES (PDF).

Modalidades de firma:

- **Attached / enveloping (implícita)**: la firma contiene el documento.
- **Detached (explícita)**: la firma va separada del documento.
- **Enveloped**: la firma va dentro del documento (típico en XAdES y PAdES).

Niveles o perfiles. Los antiguos (ETSI TS 101 903 para XAdES):

| Perfil | Añade |
|---|---|
| BES | Firma básica con el certificado firmado |
| EPES | Política de firma explícita |
| T | Sello de tiempo |
| C | Referencias a certificados y estados de revocación |
| X | Sello sobre las referencias |
| X-L | Incluye los certificados y estados de revocación completos |
| A | Archivo longevo: resellado periódico |

**XAdES-R no existe** **[Salió 2008]**.

Los niveles **baseline** actuales (normas EN 319 1x2) son **B-B** (básico), **B-T** (con sello de tiempo), **B-LT** (largo plazo, con datos de validación) y **B-LTA** (largo plazo con archivo).

### Certificados y PKI

- **Certificado X.509 v3**: vincula una clave pública con una identidad. Lo firma una autoridad de certificación. Contiene número de serie, emisor, sujeto, validez, clave pública, extensiones y firma de la AC.
- Componentes de una **PKI**: AC (autoridad de certificación), AR (autoridad de registro, comprueba la identidad), AV (autoridad de validación), TSA (autoridad de sellado de tiempo), repositorio.
- Prestadores en España: **FNMT-RCM** (CERES), DNIe (Dirección General de la Policía), ACCV, Camerfirma, entre otros. La lista oficial es la TSL del Ministerio.
- Formatos de fichero: `.cer`/`.crt` (solo certificado, DER o PEM), `.pem` (Base64), `.p12`/`.pfx` (PKCS#12, certificado **con clave privada**, protegido con contraseña), `.p7b` (cadena PKCS#7), `.csr` (petición PKCS#10).

Validación de certificados:

| Mecanismo | Funcionamiento |
|---|---|
| **CRL** | Lista de certificados revocados publicada periódicamente por la AC |
| **OCSP** | Online Certificate Status Protocol (RFC 6960): consulta en línea el estado de un certificado. Respuestas: good, revoked, unknown **[Salió 2018 b4]** |
| OCSP stapling | El servidor TLS adjunta la respuesta OCSP firmada |

- Distractores de 2018: "CRLP", "DNSSECP" y "HMACP" no existen como protocolos de validación.
- Plataformas de la AGE: **@firma** (validación y firma en servidor), **VALIDe** (validar firmas y certificados en web), **AutoFirma** (cliente de firma de escritorio), **TS@** (sellado de tiempo), **Cl@ve Firma** (firma en la nube).

## Protocolos seguros

### Tabla de protocolos y puertos

| Protocolo | Protege | Puerto |
|---|---|---|
| TLS 1.2 y 1.3 | Transporte de cualquier aplicación | Según servicio |
| HTTPS | Web | 443 |
| SSH | Shell remota, túneles, SFTP, SCP | 22 |
| SFTP | Transferencia de ficheros sobre SSH | 22 |
| FTPS explícito / implícito | FTP sobre TLS | 21 / 990 (datos 989) |
| SMTPS / submission | Envío de correo | 465 / 587 (STARTTLS) |
| IMAPS / POP3S | Lectura de correo | 993 / 995 |
| LDAPS | Directorio | 636 |
| DNSSEC | Autenticidad e integridad de respuestas DNS (no cifra) | 53 |
| DoT / DoH | DNS cifrado | 853 / 443 |
| IPsec | Capa de red. AH (protocolo 51), ESP (protocolo 50), IKE (UDP 500 y 4500) | — |
| SNMPv3 | Gestión de red con autenticación y cifrado | 161/162 |
| Kerberos | Autenticación | 88 |

### SSL/TLS

- SSL 2.0 y 3.0 están prohibidos. TLS 1.0 y 1.1 se declararon obsoletos (RFC 8996, 2021).
- **TLS 1.3** (RFC 8446, 2018): *handshake* de 1 RTT (0-RTT opcional), solo cifrados AEAD (AES-GCM, ChaCha20-Poly1305), intercambio siempre efímero (**secreto perfecto hacia delante**), sin RSA estático.
- El *handshake* autentica al servidor con su certificado, acuerda una clave simétrica de sesión y luego cifra los datos con ella.
- Pregunta de 2006 **[Salió 2006 b4]**: "si el servidor cifra con algoritmo asimétrico, ¿cómo descifra el cliente?". Lo cifrado con la clave privada del servidor se descifra con su **clave pública** (sin verificar la opción oficial). En la práctica, TLS cifra los datos con clave simétrica.

### SFTP frente a FTPS

| Rasgo | SFTP | FTPS |
|---|---|---|
| Base | SSH (no es FTP) | FTP + SSL/TLS |
| Puertos | Uno solo (22) para órdenes y datos | Canal de control y canal de datos separados |
| Autenticación | Usuario y contraseña **o** clave pública | Usuario y contraseña **y/o** certificado |
| Órdenes de directorio | Estandarizadas | Hereda las de FTP, con listados no normalizados |
| Cortafuegos | Sencillo | Complicado por los puertos de datos |

La afirmación **incorrecta** de 2024 era "SFTP usa certificado y FTPS usuario y contraseña" **[Salió 2024 b4]**: ambos admiten los dos métodos.

### Correo seguro

- **S/MIME**: estándar de **correo electrónico seguro** con certificados X.509. Firma y cifra los mensajes **[Salió 2006, 2016]**.
- **PGP / OpenPGP** (GnuPG): lo mismo con modelo de **anillo de confianza** en vez de jerarquía de AC.
- **SPF, DKIM y DMARC**: autentican el dominio del remitente y reducen el spoofing de correo.
- Distractores de 2016: LVM (volúmenes lógicos), VRRP (redundancia de router), Gluster (sistema de ficheros distribuido).

### Otros

- **WPA3** en wifi (SAE en lugar de PSK). WPA2-Enterprise con 802.1X y EAP.
- **SET** (Secure Electronic Transaction): protocolo de pago con tarjeta de los años 90, hoy abandonado. Sustituido por **3-D Secure** (con la SCA de la PSD2).

## Seguridad física y CPD

### Ubicación y construcción

- Lejos de riesgos: zonas inundables, plantas bajas o sótanos con riesgo de agua, áreas con interferencias, cocinas y almacenes inflamables.
- Acceso restringido y registrado. Sin ventanas exteriores. Paredes y puertas resistentes al fuego.
- **Suelo técnico** (falso suelo) o **techo técnico** para cableado y climatización **[Salió 2008]**.
- Los armarios **no** deben ir apoyados contra las paredes: impide el acceso trasero y la circulación de aire. Es la opción no adecuada de 2008 **[Salió 2008]**.
- **Pasillos fríos y calientes**: los racks se enfrentan frontal con frontal para separar aire frío de entrada y caliente de salida.

### Control de acceso físico

- Tarjeta y PIN, biometría, tornos, **esclusas** (*mantrap*) que dejan pasar a una persona cada vez y frenan el tailgating.
- Vigilancia, CCTV, registro de visitas, acompañamiento de personal externo.
- **TEMPEST**: protección frente a emanaciones electromagnéticas comprometedoras.

### Climatización y entorno

- Temperatura recomendada por **ASHRAE**: **18 a 27 °C** en la entrada de aire a los equipos. Humedad relativa controlada (evitar condensación y electricidad estática).
- El examen de 2008 daba por buena "no superior a 25 °C con sensores de temperatura".
- Climatización de precisión (CRAC/CRAH), *free cooling*, refrigeración líquida en alta densidad.
- **PUE** (Power Usage Effectiveness) = energía total del CPD / energía de los equipos TI. El ideal es 1,0.

### Energía

| Elemento | Función |
|---|---|
| SAI / UPS | Alimentación ininterrumpida durante cortes cortos y filtrado de la red **[Salió 2008]** |
| Grupo electrógeno | Generador diésel para cortes largos. Arranca mientras aguanta el SAI |
| Interruptor **diferencial** | Protege a las **personas** frente a contactos eléctricos (detecta fugas a tierra) **[Salió 2015]** |
| Interruptor **magnetotérmico** | Protege la **instalación** frente a sobrecargas y cortocircuitos |
| PDU | Regletas de distribución en el rack |
| Doble acometida | Dos suministros de compañías o subestaciones distintas |

Tipos de SAI: *off-line* o *standby* (conmuta al fallar la red), interactivo (*line-interactive*, regula tensión) y *on-line* de doble conversión (la carga siempre se alimenta desde el inversor; el mejor para CPD).

### Protección contra incendios

- Detección: detectores de humo, **detección precoz por aspiración** (VESDA), sensores de temperatura.
- Extinción con **gases limpios** que no dañan los equipos: **FM-200** (HFC-227ea), **Novec 1230** (FK-5-1-12) o **gases inertes** (IG-541 Inergen, IG-55 Argonite, IG-100 nitrógeno). El **halón** está prohibido (Protocolo de Montreal).
- Agua nebulizada o rociadores de preacción como complemento. Extintores de CO2 para fuego eléctrico.

### Clasificación TIA-942 y Uptime Institute

- **ANSI/TIA-942**: norma de infraestructura de telecomunicaciones para centros de datos (2005). Revisiones A (2012), B (2017) y **C (2024)**. Define **cuatro niveles**, del 1 (menor disponibilidad) al 4 (mayor) **[Salió 2015, 2019]**. Desde la revisión A los llama **Rated 1-4**, porque "Tier" es marca del Uptime Institute.
- **Uptime Institute**: certifica **Tier I a Tier IV** **[Salió 2016]**. No existe Tier V.

| Tier | Nombre | Redundancia | Disponibilidad | Parada anual aprox. |
|---|---|---|---|---|
| I | Básico | Ninguna (N) | 99,671 % | 28,8 h |
| II | Componentes redundantes | N+1 en componentes, una sola ruta | 99,741 % | 22 h |
| III | Mantenimiento concurrente | N+1, varias rutas (una activa) | 99,982 % | 1,6 h |
| IV | **Tolerante a fallos** | 2N o 2(N+1), varias rutas activas | 99,995 % | 0,4 h (26 min) |

- En 2016 la verdadera era "un CPD Tier IV es tolerante a fallos". Las falsas hablaban de Tier V o de redundancia en Tier I.

Espacios o zonas de TIA-942 **[Salió 2025]**:

| Zona | Siglas | Función |
|---|---|---|
| Sala de entrada | ER (Entrance Room) | Entrada de operadores, frontera con el exterior |
| Área de distribución principal | MDA (Main Distribution Area) | Conexión cruzada principal, routers y switches de núcleo |
| Área de distribución intermedia | IDA | Nivel opcional entre MDA y HDA (añadida en la revisión A) |
| Área de distribución horizontal | HDA (Horizontal Distribution Area) | Conexión cruzada horizontal, switches de acceso |
| Área de distribución de zona | ZDA (Zone Distribution Area) | Punto de consolidación opcional |
| Área de distribución de equipos | EDA (Equipment Distribution Area) | Racks de servidores y almacenamiento |
| Sala de telecomunicaciones | TR | Da servicio a las oficinas fuera de la sala de ordenadores |

En 2025 la respuesta oficial fue **EDA (Equipment Distribution Area)**: es la zona donde van los racks de servidores y almacenamiento.

### Continuidad: copias y CPD de respaldo

| Métrica | Significado |
|---|---|
| RPO | Máxima pérdida de datos tolerable (tiempo desde la última copia) |
| RTO | Tiempo máximo para recuperar el servicio |
| MTPD / MTD | Tiempo máximo tolerable de interrupción antes de daños inaceptables |
| MTBF | Tiempo medio entre fallos |
| MTTR | Tiempo medio de reparación |

Tipos de copia:

| Tipo | Qué copia | Restauración |
|---|---|---|
| Completa | Todo | Solo la última completa |
| Incremental | Lo cambiado desde la **última copia de cualquier tipo** | Completa + todas las incrementales |
| Diferencial | Lo cambiado desde la **última completa** | Completa + la última diferencial |

- Regla **3-2-1**: tres copias, en dos soportes distintos, una fuera de las instalaciones. Variante 3-2-1-1-0: una inmutable o desconectada y cero errores en la verificación.

Centros de respaldo:

| Tipo | Estado | Tiempo de arranque |
|---|---|---|
| Sala fría (cold site, sala blanca) | Espacio acondicionado sin equipos | Días o semanas |
| Sala templada (warm site) | Equipos parciales, datos no actualizados | Horas o días |
| Sala caliente (hot site) | Equipos y datos casi al día | Minutos u horas |
| Espejo (mirror) | Réplica síncrona activa | Inmediato |

- La **replicación síncrona** exige baja latencia: el CPD de respaldo va en **otro edificio a pocos kilómetros** con **enlaces dedicados** de gran capacidad (fibra) **[Salió 2007 b4]** (sin verificar la opción exacta). En el mismo edificio comparte riesgos. A cientos de kilómetros se usa replicación asíncrona.

### Plan de contingencias y continuidad

- **Plan de contingencias**: conjunto de medidas para recuperar el sistema tras un incidente grave. Contiene las **medidas de corrección** a aplicar una vez producido el incidente **[Salió 2008]** (sin verificar). El análisis de riesgos y las medidas preventivas son fases previas.
- Estructura clásica en tres planes **[Salió 2007 b4]**: **plan de respaldo** (antes: copias, prevención), **plan de emergencia** (durante: actuación inmediata) y **plan de recuperación** (después: volver a la normalidad).
- **BCP** (plan de continuidad de negocio): mantiene los procesos de negocio. **DRP** (plan de recuperación ante desastres): recupera la parte TIC.
- **BIA** (análisis de impacto en el negocio): identifica procesos críticos, RTO y RPO.
- El plan se prueba y actualiza periódicamente.

## Gestión de incidencias

### ITIL

**ITIL** es una colección de **buenas prácticas de gestión de servicios TI** **[Salió 2019]**. La versión de referencia es **ITIL 4** (2019), de AXELOS, hoy de PeopleCert.

- ITIL 4: sistema de valor del servicio, cadena de valor, 7 principios guía, 4 dimensiones y **34 prácticas** (antes "procesos" en ITIL v3).
- ITIL v3 (2007, revisión 2011): ciclo de vida en cinco fases. Estrategia, diseño, transición, operación y mejora continua.
- Norma certificable equivalente: **ISO/IEC 20000-1:2018**.
- Distractores de 2019: "metodología Kaizen del ciclo de vida del software", "librería Java de Jakarta EE" y "metodología de análisis de riesgos" (eso es MAGERIT).

| Concepto ITIL | Definición |
|---|---|
| Incidente | Interrupción no planificada o reducción de la calidad de un servicio |
| Problema | Causa, real o potencial, de uno o más incidentes |
| Error conocido | Problema analizado con causa identificada, aún sin resolver |
| Solución temporal (workaround) | Reduce el impacto mientras no hay solución definitiva |
| Petición de servicio | Solicitud del usuario que no es un fallo (alta, acceso, información) |
| Cambio | Alta, modificación o retirada de algo que afecta a los servicios |

- **Gestión de incidentes**: restaurar el servicio **lo antes posible**. **Gestión de problemas**: encontrar y eliminar la causa raíz.
- **Prioridad = impacto × urgencia**.
- **Escalado funcional**: pasa a un nivel con más conocimiento técnico (N1, N2, N3). **Escalado jerárquico**: sube a la dirección.
- Ciclo del incidente: registro, clasificación, priorización, diagnóstico, escalado, resolución, cierre.

### Service Desk y CAU

- El **CAU** (Centro de Atención a Usuarios) o **Service Desk** es el punto único de contacto. Se encarga directamente de **gestionar las incidencias** de los usuarios **[Salió 2007]**.
- Tipos: local, centralizado, virtual y "follow the sun".
- Herramientas de *ticketing* y CAU: **BMC Remedy (Helix)** **[Salió 2017]**, ServiceNow, Jira Service Management, GLPI, OTRS/Znuny, Freshservice. Distractores: Outlook, Visio, Subversion.

### Gestión de ciberincidentes

Equipos de respuesta en España:

| CSIRT | Ámbito |
|---|---|
| **CCN-CERT** | Sector público (ENS) e información clasificada. Depende del CNI |
| **INCIBE-CERT** | Ciudadanos, empresas privadas y operadores privados |
| **ESPDEF-CERT** | Defensa (Mando Conjunto del Ciberespacio) |

- Guía de referencia: **CCN-STIC 817** (gestión de ciberincidentes en el ENS) y la Guía Nacional de Notificación y Gestión de Ciberincidentes.
- Niveles de **peligrosidad**: bajo, medio, alto, muy alto y crítico. Niveles de **impacto**: de sin impacto a crítico.
- Las entidades del ENS notifican al CCN-CERT mediante **LUCIA** los incidentes de cierta relevancia.
- Fases según NIST SP 800-61: **preparación**; **detección y análisis**; **contención, erradicación y recuperación**; **actividad posterior** (lecciones aprendidas). La revisión 3 (2025) la alinea con el NIST CSF 2.0 (gobernar, identificar, proteger, detectar, responder, recuperar).
- Plazos: brecha de datos personales a la AEPD en 72 h. NIS2: alerta temprana en 24 h, notificación en 72 h, informe final en un mes.

### Herramientas del CCN-CERT

Es la parte más rentable del tema. Haz una ficha y repásala.

| Herramienta | Función |
|---|---|
| **LUCIA** | **Gestión de ciberincidentes** (*ticketing* federado) en entidades del ENS. Mejora la coordinación entre el CERT y los organismos **[Salió 2017 b4, 2024]** |
| **MARTA** | **Análisis avanzado y automatizado de ficheros** sospechosos (multi-*sandboxing*) **[Salió 2016 b4, 2018]** |
| **MARIA** | **Análisis estático** de código dañino con **múltiples motores antivirus** y antimalware, para Windows y Linux **[Salió 2019]** |
| **ADA** | **Plataforma de análisis avanzado de malware** **[Salió 2022 b4]** |
| **CLARA** | **Auditoría de cumplimiento ENS/STIC en sistemas Windows** **[Salió 2017]** |
| **REYES** | **Intercambio de información de ciberamenazas** y aceleración del análisis de ciberincidentes **[Salió 2016 b4]** |
| **ELENA** | **Simulador de técnicas de cibervigilancia** **[Salió 2022]** |
| **GLORIA** | Gestor de **logs** para responder ante incidentes y amenazas (correlación) |
| **MÓNICA** | Gestión de **eventos e información de seguridad** (SIEM) |
| **CARMEN** | Defensa frente a **APT** (análisis de tráfico de red) |
| **CLAUDIA** | Detección de amenazas complejas en el **puesto de usuario** |
| **microCLAUDIA** | Centro de **vacunación** contra malware (ransomware) |
| **EMMA** | Visibilidad y control de la **red** (NAC) |
| **ELSA** | Análisis de exposición local y superficie de ataque |
| **PILAR** | **Análisis y gestión de riesgos** (implementa MAGERIT) |
| **INÉS** | **Informe nacional del estado de seguridad** de las entidades del ENS |
| **AMPARO** | Implantación de la seguridad y cumplimiento del ENS |
| **ANA** | Automatización y normalización de **auditorías** |
| **IRIS** | Estado de la ciberseguridad (informe) |
| **LORETO** | Almacenamiento en la **nube** |
| **OLVIDO** | **Borrado seguro** de datos |
| **metaOLVIDO** | Gestión (limpieza) de **metadatos** |
| **VANESA** | Grabación y emisión de vídeo (formación y sensibilización) |
| **ATENEA** | Plataforma de **desafíos** o retos de seguridad (CTF) |
| **CARLA** | **Protección y trazabilidad del dato** |
| **ROCÍO** | Inspección de la configuración de dispositivos de red |

Reglas mnemotécnicas:

- **MARTA** "mira ficheros en marcha" (*sandbox*). **MARIA** "mira estático con muchos antivirus".
- **LUCIA** "lucha contra incidentes". **REYES** "reparte información de amenazas".
- **CLARA** "aclara el cumplimiento en Windows". **CARLA** "carga con el dato".
- **GLORIA** guarda logs. **MÓNICA** monitoriza eventos (SIEM).

En 2022 la correcta era ELENA. Las demás opciones cambiaban CARLA por CLARA e intercambiaban las descripciones de GLORIA y MÓNICA.

## Control remoto

### Herramientas y protocolos

| Herramienta | Protocolo y puerto | Notas |
|---|---|---|
| Escritorio remoto de Windows | **RDP**, TCP/UDP **3389** | Activar NLA (autenticación a nivel de red). No exponer a Internet |
| Asistencia remota de Windows | RDP (`msra.exe`) | El usuario invita al técnico |
| Asistencia rápida (Quick Assist) | Servicio en la nube de Microsoft | Muy usado en CAU, también por estafadores |
| **VNC** | RFB, TCP **5900** (+ número de pantalla) | Multiplataforma. Cifrado débil por defecto: túnel SSH o VPN |
| **SSH** | TCP **22** | Shell cifrada, túneles, reenvío X11 (`ssh -X`) |
| Telnet | TCP **23** | Sin cifrado. No usar |
| WinRM / PowerShell Remoting | 5985 (HTTP) / 5986 (HTTPS) | Administración remota de Windows |
| TeamViewer, AnyDesk, Chrome Remote Desktop | Propietarios, salen por 443 | Atraviesan cortafuegos sin abrir puertos |
| Wake-on-LAN | Paquete mágico UDP | Encender equipos en remoto |

### Buenas prácticas de seguridad en el acceso remoto

- Acceso a través de **VPN** o pasarela segura (RD Gateway, bastión), nunca abierto a Internet.
- **Autenticación multifactor** y cuentas nominales. Nada de cuentas compartidas.
- **Consentimiento** del usuario y aviso visible en la asistencia remota.
- Registro de sesiones (trazabilidad) y tiempo máximo de sesión.
- Mínimo privilegio y herramientas actualizadas.
- En SSH: autenticación por clave pública, `PermitRootLogin no`, `PasswordAuthentication no`.

```bash
ssh-keygen -t ed25519 -C "pablo@equipo"
ssh-copy-id usuario@servidor          # copia la clave a ~/.ssh/authorized_keys
ssh -L 5901:localhost:5901 usuario@servidor   # túnel local para VNC cifrado
ssh -X usuario@servidor               # reenvío gráfico X11
```

```text
# /etc/ssh/sshd_config
PermitRootLogin no
PasswordAuthentication no
AllowUsers pablo admin
```

## Trampas y respuestas desactualizadas

- **Vulnerabilidad (2005, 2017)**: los exámenes usan la definición de MAGERIT v1 ("posibilidad de ocurrencia de la materialización de una amenaza"). Hoy es "debilidad". En la pregunta, la incorrecta era otra (impacto en 2005, ataque en 2017).
- **TIA-942 "Tier" (2015, 2019)**: desde 2012 la TIA usa "Rated 1-4". Si preguntan número de niveles, siguen siendo **cuatro**, y el 4 es el de mayor disponibilidad. **No existe Tier V**.
- **Temperatura del CPD (2008)**: "no más de 25 °C" era la respuesta de entonces. ASHRAE recomienda hoy 18-27 °C.
- **3DES/TDEA (2016)**: sigue siendo simétrico, pero el NIST lo retiró a finales de 2023. No lo propongas como algoritmo recomendado.
- **SHA-1 (2016 b4)**: es una función hash. Hoy se considera rota; no sirve para firma.
- **Diffie-Hellman (2015)**: la respuesta "RSA y Diffie-Hellman" como "algoritmos de cifrado asimétrico" se aceptó, aunque DH solo intercambia claves.
- **GOST (2019)**: GOST 28147-89 es simétrico. Existe también una firma rusa GOST R 34.10 (asimétrica), pero el examen buscaba el simétrico.
- **SSL (2006 b4)**: hoy no se usa SSL, sino TLS. Además, los datos de una sesión TLS van con clave simétrica; el asimétrico solo autentica y acuerda claves.
- **SET (2006)**: protocolo de pago abandonado. Si aparece, es un distractor.
- **Ley 59/2003 de firma electrónica**: derogada por la Ley 6/2020. eIDAS ya fue reformado por eIDAS2 (2024).
- **ENS**: el vigente es el **RD 311/2022**. El RD 3/2010 está derogado.
- **ITIL**: "procesos" de ITIL v3 se llaman "prácticas" en ITIL 4.
- **TCP Wrappers (2017 b4)**: la respuesta `/etc/hosts.allow` sigue siendo la correcta en examen. En sistemas modernos está en desuso.
- **IBM AppScan (2016)**: hoy se comercializa como HCL AppScan.
- **Pares que se confunden**: sniffing (capturar) frente a spoofing (suplantar); phishing (correo) frente a pharming (DNS); vishing (voz) frente a smishing (SMS); MARTA frente a MARIA; CLARA frente a CARLA; GLORIA frente a MÓNICA; diferencial (personas) frente a magnetotérmico (instalación); incremental frente a diferencial.
- **Firma digital**: nunca da confidencialidad. Se firma con la **privada del emisor**. Se cifra con la **pública del receptor**.
- **Hash**: las colisiones existen; lo que es difícil es encontrarlas. No es reversible ni "de doble sentido".
- **DDoS**: es **distribuido** (muchos orígenes). "Desde un único punto" es DoS.
- **Contraseñas con "frases cortas sin sentido" (2025 ej1 69)**: la plantilla provisional da por correcta "usar frases cortas sin sentido". Las guías del CCN-CERT y el NIST SP 800-63B ponen la longitud como primer factor, así que "cortas" es discutible (posible impugnación). En examen, responde lo que dio la plantilla.
- **Key exchange 112 bits (2025 reserva 82)**: 112 bits es el mínimo aceptado hoy (equivale a RSA-2048), no el recomendado a largo plazo, que es 128 bits o más.
