# Tema 13. Sistemas operativos

Peso en el examen: unas 3,2 preguntas de test por convocatoria y ninguna esperada en el supuesto III. Vale en torno a 2 puntos sobre 100. Hay 53 preguntas históricas (2005-2025), casi todas de test; solo 3 de supuesto IV. Se concentran en tres bloques: conceptos de procesos y planificación (planificadores, Round Robin, estados, hilos, fork), Linux (directorios, permisos, UID/GID/init, distribuciones) y móviles (versiones de Android, ART, NDK, capas de personalización, iOS). Los comandos de administración están en el tema 24; aquí solo aparecen cuando se preguntaron como concepto (chmod 640).

## Cómo lo preguntan

- **"Señale la INCORRECTA"** sobre conceptos generales: funciones del kernel (2022: "es el núcleo del procesador" es falsa), fork() (2017), UID/GID/init (2022), NDK (2024).
- **Versiones y nombres en clave**: Android 4.1 = Jelly Bean (2017), Pie = 9.0 (2018), Honeycomb para tablets (2016), macOS 10.13 = High Sierra (2017 b4), el macOS más reciente (2022), Debian estable y antigua estable (2018 b4). Caducan: repásalas la última semana.
- **Definición de un mecanismo**: qué planificador mete procesos en la CPU (2018), cuál hace swapping (2008), qué es Round Robin (2008, 2015), qué es SRR (2015), inanición (2006).
- **Directorios de Linux**: / (2005), /dev (2008), /bin (2017), /etc (2019).
- **Permisos en octal**: chmod 640 (2019); tipos de acceso rwx (2006).
- **"Intrusos" en listas**: qué no es distribución Linux (Kilimanjaro, 2016), qué no es capa Android (PenPoint OS, 2022), qué sistema de ficheros no nació para Windows (Ext2, 2015).
- **Detalle técnico de Microsoft**: DLL de 32/64 bits y RPC (2022), BitLocker (2007, 2018), ReFS (2017), FAT16 (2007).
- **Novedad 2024-2025**: más peso de móviles y desarrollo Apple (Xcode, SwiftUI, sandboxing iOS, núcleo de Android).

## Conceptos generales de sistemas operativos

### Qué es y qué hace un sistema operativo

Un sistema operativo (SO) es el software que gestiona el hardware y ofrece servicios a los programas. Tiene dos papeles clásicos:

- **Máquina extendida**: oculta la complejidad del hardware tras abstracciones (procesos, ficheros, sockets).
- **Gestor de recursos**: reparte CPU, memoria, E/S y almacenamiento entre procesos y usuarios.

Funciones principales: gestión de procesos, gestión de memoria, gestión de E/S y dispositivos, sistema de ficheros, protección y seguridad, red e interfaz de usuario.

### El núcleo (kernel)

El núcleo es la parte del SO que se ejecuta en **modo privilegiado** (modo núcleo, supervisor o anillo 0). Funciones:

- Gestiona procesos e hilos: creación, planificación, multitarea y cambio de contexto.
- Gestiona la memoria: asignación, memoria virtual, protección.
- Controla los dispositivos mediante drivers y atiende interrupciones.
- Recibe las peticiones de los procesos (llamadas al sistema) y las comunica con el hardware.

**[Salió 2024]** La función del kernel en Unix/Linux es "controlar los procesos, la memoria y la administración de dispositivos". No es la interfaz gráfica ni los servicios de red de usuario.

**[Salió 2022]** La afirmación incorrecta era "el kernel es el núcleo del procesador". El kernel es software; el núcleo (core) del procesador es hardware.

Tipos de núcleo:

| Tipo | Idea | Ejemplos |
|---|---|---|
| Monolítico | Todo el SO (drivers, FS, red) en espacio de núcleo | Linux, Unix clásicos, FreeBSD |
| Micronúcleo | Núcleo mínimo (IPC, planificación, memoria); el resto en espacio de usuario | Mach, MINIX 3, QNX, seL4 |
| Híbrido | Base de micronúcleo con muchos servicios en modo núcleo | Windows NT (Windows 10/11), XNU (macOS, iOS) |
| Exokernel | Núcleo que solo multiplexa hardware; bibliotecas hacen el resto | Investigación (MIT) |

Linux es monolítico pero **modular**: carga y descarga módulos (drivers) en caliente.

### Modo usuario, modo núcleo y llamadas al sistema

- Una **llamada al sistema** (system call) es la forma en que un proceso pide un servicio al núcleo. Provoca un cambio a modo núcleo (trap o instrucción syscall).
- Una **llamada a biblioteca** (por ejemplo, printf de libc) se ejecuta en espacio de usuario. Puede que internamente haga una llamada al sistema (write).

**[Salió 2007]** En Windows, la llamada al sistema se ejecuta en el kernel y la llamada a librería en espacio de usuario.

Ejemplos de llamadas POSIX: fork, exec, wait, exit, open, read, write, close, kill, mmap. En Windows, la API Win32 (kernel32.dll) llama a funciones nativas de ntdll.dll, que hacen la transición al núcleo.

### Clasificación de sistemas operativos

- Por usuarios: monousuario o multiusuario.
- Por tareas: monotarea o multitarea (cooperativa o apropiativa).
- Por procesadores: monoprocesador o multiprocesador (SMP simétrico, AMP asimétrico).
- Por uso: por lotes, tiempo compartido, tiempo real (duro o blando), distribuidos, en red, embebidos, móviles.

## Gestión de procesos

### Proceso, PCB e identificadores

Un **proceso** es un programa en ejecución: código, datos, pila, montículo y su contexto. El SO lo representa con el **PCB** (Process Control Block, bloque de control de proceso). El PCB guarda: identificador, estado, contador de programa, registros, información de memoria, ficheros abiertos, prioridad y datos contables.

Identificadores en Linux/Unix:

| Identificador | Significado |
|---|---|
| PID | Identificador único del proceso |
| PPID | Identificador del proceso padre |
| UID / EUID | Usuario real / efectivo propietario |
| GID / EGID | Grupo real / efectivo |
| TID | Identificador de hilo (en Linux cada hilo es una tarea) |
| TGID | Identificador del grupo de hilos (coincide con el PID visible) |
| PGID / SID | Grupo de procesos / sesión |

**[Salió 2018]** "TPID" no es un identificador real de proceso en Linux. Sí lo son PID, PPID y UID.

**[Salió 2022]** UID es el identificador de usuario; GID el de grupo; root el administrador (UID 0). Era incorrecto decir que init "es el proceso de arranque de un usuario". init es el primer proceso del sistema (PID 1), padre de todos los demás. Hoy en casi todas las distribuciones lo implementa systemd.

### Estados de un proceso

Modelo de cinco estados: **Nuevo, Listo (preparado), En ejecución, Bloqueado (en espera) y Terminado**.

Transiciones típicas:

- Listo → Ejecución: lo elige el planificador (dispatch).
- Ejecución → Listo: se agota el quantum o llega otro más prioritario (expropiación).
- Ejecución → Bloqueado: pide E/S o espera un evento.
- Bloqueado → Listo: ocurre el evento esperado.

Con intercambio (swapping) aparecen estados **suspendidos**: Listo y suspendido (ejecutable no residente) y Bloqueado y suspendido (en espera no residente).

**[Salió 2005]** Un proceso en espera no residente, cuando ocurre su evento, pasa a "ejecutable, pero no residente" (listo y suspendido). Sigue en disco.

**[Salió 2008]** "Ocioso" no es un estado de proceso. Sí lo son ejecución, bloqueado y listo.

En Linux, ps muestra estados con letras: R (ejecutando o listo), S (dormido interrumpible), D (dormido no interrumpible), T (parado), Z (zombi). Un **zombi** ha terminado pero su padre aún no ha recogido su estado con wait. Un **huérfano** ha perdido al padre y lo adopta init (o un subreaper).

### Creación de procesos: fork y exec

En Unix, fork() duplica el proceso que la llama.

- Al **padre** le devuelve el PID del hijo.
- Al **hijo** le devuelve 0.
- Si falla, devuelve -1 al padre.

**[Salió 2017]** Era FALSO que fork "devuelve al proceso hijo el ID del proceso padre". El hijo recibe 0; si quiere el PID del padre, llama a getppid().

```c
#include <stdio.h>
#include <unistd.h>
#include <sys/wait.h>

int main(void) {
    pid_t pid = fork();
    if (pid == 0) {
        printf("Hijo: mi PID=%d, padre=%d\n", getpid(), getppid());
        execlp("ls", "ls", "-l", NULL);   /* sustituye la imagen del proceso */
    } else if (pid > 0) {
        wait(NULL);                        /* evita el zombi */
        printf("Padre: mi hijo era %d\n", pid);
    } else {
        perror("fork");
    }
    return 0;
}
```

exec no crea proceso: reemplaza el programa del proceso actual. En Windows no hay fork; se usa CreateProcess, que crea y carga el programa en un paso.

### Hilos (threads)

Un **hilo** es la unidad mínima de planificación dentro de un proceso. Los hilos de un proceso comparten código, datos, montículo y ficheros abiertos. Cada hilo tiene su pila, registros y contador de programa.

**[Salió 2024]** El concepto que permite que un proceso ejecute varias tareas concurrentes son los **hilos**. Segmentación, paginación y prepaging son de memoria.

Modelos de hilos:

| Modelo | Descripción |
|---|---|
| N:1 (hilos de usuario) | Muchos hilos de usuario sobre un hilo de núcleo; un bloqueo para a todos |
| 1:1 | Cada hilo de usuario es un hilo de núcleo (Linux NPTL, Windows) |
| N:M | Multiplexa N hilos de usuario sobre M de núcleo (Go, hilos virtuales de Java 21) |

Ventajas frente a procesos: creación y cambio de contexto más baratos, comunicación por memoria compartida. Inconveniente: hay que sincronizar el acceso a datos compartidos.

### Planificadores

| Planificador | También llamado | Qué decide | Frecuencia |
|---|---|---|---|
| Largo plazo | Planificador de trabajos (job scheduler) | Qué trabajos entran al sistema; controla el grado de multiprogramación | Baja |
| Medio plazo | Swapper | Saca procesos de memoria a disco y los vuelve a traer | Media |
| Corto plazo | Planificador de CPU, dispatcher | Qué proceso listo pasa a la CPU | Muy alta |

**[Salió 2018]** El que decide qué proceso entra en el procesador es el **short term scheduler** (corto plazo). "Main term scheduler" no existe.

**[Salió 2008]** El que pasa un proceso de memoria a disco y lo trae más tarde es el de **medio plazo**.

El **dispatcher** (despachador) hace el cambio de contexto efectivo tras la decisión del planificador a corto plazo.

### Algoritmos de planificación

Criterios: uso de CPU, productividad (throughput), tiempo de retorno, tiempo de espera, tiempo de respuesta, equidad.

| Algoritmo | Expropiativo | Idea | Problema |
|---|---|---|---|
| FCFS / FIFO | No | Por orden de llegada | Efecto convoy |
| SJF | No | Primero el trabajo más corto | Inanición de largos; requiere estimar duración |
| SRTF | Sí | Primero el de menor tiempo restante | Inanición de largos |
| Prioridades | Ambos | Mayor prioridad primero | Inanición; se corrige con envejecimiento |
| Round Robin | Sí | Turno circular con quantum fijo | Quantum mal elegido |
| Colas multinivel | Sí | Varias colas por tipo de proceso | Rigidez |
| Colas multinivel con realimentación | Sí | Los procesos cambian de cola según su comportamiento | Complejo de ajustar |
| HRRN | No | Mayor tasa de respuesta (espera + servicio) / servicio | Coste de cálculo |

**Round Robin (RR)** **[Salió 2008, 2015]**:

- Cola circular de procesos listos.
- Cada proceso recibe un **quantum** o time-slice. Si no termina, vuelve al final de la cola.
- Es expropiativo y no produce inanición.
- Quantum muy grande: degenera en FCFS. Quantum muy pequeño: demasiados cambios de contexto.

**Selfish Round Robin (SRR)** **[Salió 2015]**: variante con **dos colas**, una de procesos nuevos y otra de aceptados. La prioridad de los nuevos crece más deprisa que la de los aceptados. Cuando un nuevo iguala la prioridad de los aceptados, entra en la cola RR.

Ejemplo de traza RR con quantum 2:

```text
Procesos (llegada 0): A=5, B=3, C=1
Orden: A(2) B(2) C(1) A(2) B(1) A(1)
Fin: C en t=5, B en t=8, A en t=9
Tiempo de retorno medio = (9 + 8 + 5) / 3 = 7,33
```

Planificadores reales: Linux usó CFS (Completely Fair Scheduler) desde 2.6.23 y lo sustituyó por **EEVDF** en el kernel 6.6 (2023). Windows usa prioridades de 0 a 31 con expropiación y quantum variable.

### Concurrencia, interbloqueo e inanición

- **Sección crítica**: código que accede a un recurso compartido. Requisitos: exclusión mutua, progreso y espera limitada.
- **Mecanismos**: cerrojos (mutex), semáforos (Dijkstra, operaciones P/wait y V/signal), monitores, variables de condición, paso de mensajes.
- **Condición de carrera**: el resultado depende del orden de ejecución.

**Interbloqueo (deadlock)**. Condiciones de Coffman, deben darse las cuatro a la vez:

1. Exclusión mutua.
2. Retención y espera.
3. No expropiación.
4. Espera circular.

Estrategias: prevención (romper una condición), evitación (algoritmo del banquero de Dijkstra), detección y recuperación, o ignorarlo (algoritmo del avestruz).

**Inanición (starvation)** **[Salió 2006]**: un proceso espera indefinidamente un recurso que siempre se asigna a otros. Se corrige con envejecimiento (aging). No es lo mismo que interbloqueo: en la inanición el sistema avanza, pero un proceso no.

**Comunicación entre procesos (IPC)**: tuberías (pipes), tuberías con nombre (FIFO), señales, colas de mensajes, memoria compartida, semáforos, sockets. En Windows, además, RPC, COM y named pipes.

## Gestión de memoria

### Conceptos básicos

- **Dirección lógica** (virtual): la que genera el programa. **Dirección física**: la real en RAM.
- La **MMU** (Memory Management Unit) traduce direcciones lógicas a físicas.
- **TLB**: caché de traducciones de la MMU.
- **Swapping**: mover procesos enteros entre memoria y disco.

### Particiones, paginación y segmentación

| Técnica | Bloques | Fragmentación que produce |
|---|---|---|
| Particiones fijas | Tamaño fijo | Interna |
| Particiones variables | Tamaño variable | Externa (se corrige con compactación) |
| Paginación | Páginas lógicas y marcos físicos del mismo tamaño | **Interna** (en la última página) |
| Segmentación | Segmentos de tamaño variable (código, datos, pila) | Externa |
| Segmentación paginada | Segmentos divididos en páginas | Interna |

**[Salió 2015]** La paginación puede provocar **fragmentación interna**, no externa.

Estrategias de asignación con particiones variables: primer ajuste (first fit), mejor ajuste (best fit), peor ajuste (worst fit), siguiente ajuste (next fit).

### Memoria virtual

Permite ejecutar procesos más grandes que la RAM. Solo se cargan las páginas necesarias.

- **Paginación bajo demanda**: la página se carga al acceder a ella.
- **Fallo de página**: la página no está en RAM. El SO la trae de disco.
- **Prepaging (prepaginación)**: cargar por adelantado páginas que probablemente se usarán.
- **Hiperpaginación (thrashing)**: el sistema pasa más tiempo paginando que ejecutando.
- **Conjunto de trabajo (working set)**: páginas que el proceso usa en una ventana de tiempo.

Algoritmos de reemplazo de páginas:

| Algoritmo | Idea | Nota |
|---|---|---|
| Óptimo (OPT, Belady) | Sustituye la que tardará más en usarse | Teórico, sirve de referencia |
| FIFO | La más antigua | Sufre la anomalía de Belady |
| LRU | La usada hace más tiempo | Buen rendimiento, coste alto |
| Segunda oportunidad / reloj | FIFO con bit de referencia | Aproximación práctica a LRU |
| NRU | Usa bits de referencia y modificación | Sencillo |
| LFU / MFU | Menos / más frecuentemente usada | Poco usados |

**Anomalía de Belady**: con FIFO, aumentar el número de marcos puede aumentar los fallos de página.

En Windows el fichero de paginación es pagefile.sys. En Linux se usa una partición o fichero swap.

## Gestión de E/S y sistemas de ficheros

### Entrada/salida

- Técnicas: E/S programada (sondeo), por interrupciones y DMA (acceso directo a memoria).
- **Drivers**: código del núcleo que controla cada dispositivo.
- **Buffering** y **spooling** (cola de impresión).
- Planificación de disco: FCFS, SSTF, SCAN (ascensor), C-SCAN, LOOK. En SSD casi no importa.

### Conceptos de sistema de ficheros

- **Fichero**: secuencia de datos con nombre y atributos.
- **Directorio**: estructura que asocia nombres a ficheros. Puede ser jerárquica (árbol) o en grafo (con enlaces).
- Métodos de asignación: contigua, enlazada (FAT es una variante) e indexada (inodos).
- **Journaling**: registro de cambios para recuperar la coherencia tras un fallo.

### El inodo en Unix

Cada fichero tiene un **inodo** con sus metadatos:

- Tipo de fichero, permisos, propietario (UID) y grupo (GID).
- Tamaño, número de enlaces duros.
- Marcas de tiempo: atime (acceso), mtime (modificación), ctime (cambio de inodo).
- Punteros a bloques de datos (directos, indirectos simples, dobles y triples en ext2/ext3; extents en ext4).

**[Salió 2015]** El **nombre del fichero NO está en el inodo**. El nombre está en la entrada de directorio, que asocia nombre e inodo. Por eso un fichero puede tener varios nombres (enlaces duros).

- **Enlace duro**: otra entrada de directorio al mismo inodo. No cruza sistemas de ficheros.
- **Enlace simbólico**: fichero especial que contiene una ruta. Puede quedar roto.

### Sistemas de ficheros más comunes

| FS | Origen | Datos clave |
|---|---|---|
| FAT12/FAT16 | MS-DOS | FAT16: volumen y fichero hasta 2 GB (4 GB con clúster de 64 KB en NT) |
| FAT32 | Windows 95 OSR2 | Fichero máximo 4 GB menos 1 byte |
| exFAT | Microsoft, 2006 | Para memorias flash y SDXC; sin límite de 4 GB |
| NTFS | Windows NT 3.1 (1993) | Journaling, ACL, EFS, compresión, cuotas, ADS; nombres de 255 caracteres |
| ReFS | Windows Server 2012 | Resilient File System: integridad con sumas de comprobación, Storage Spaces |
| ext2/ext3/ext4 | Linux | ext3 añade journaling; ext4 usa extents, fichero hasta 16 TiB, volumen hasta 1 EiB |
| XFS | SGI | Por defecto en RHEL 7 y posteriores |
| Btrfs | Linux | Copia en escritura, instantáneas; por defecto en Fedora y openSUSE |
| ZFS | Sun | Copia en escritura, gestión de volúmenes integrada |
| HFS+ / APFS | Apple | APFS desde 2017 (iOS 10.3, macOS High Sierra) |

**[Salió 2007]** Tamaño máximo de archivo en FAT16: **2 GB** (respuesta habitual).

**[Salió 2006]** NTFS es propio y exclusivo de Windows (en origen; Linux lo lee y escribe con controladores como ntfs3).

**[Salió 2015]** El sistema de archivos no creado para Windows era **Ext2**.

**[Salió 2017]** ReFS: la opción correcta era "tamaño máximo de archivo 18 EB", es decir, 2^64 bytes (16 EiB). Las demás eran falsas: no es de Mac, el nombre admite 255 caracteres y no significa "repetible", sino "resiliente".

## Windows

### Familia y versiones vigentes

| Versión | Año | Situación en octubre de 2026 |
|---|---|---|
| Windows 10 | 2015 | Soporte general terminado el 14-10-2025; solo ESU de pago o temporal |
| Windows 11 | 2021 | Vigente; versión 25H2 (otoño 2025) y siguientes |
| Windows Server 2019 | 2018 | Soporte extendido |
| Windows Server 2022 | 2021 | Vigente |
| Windows Server 2025 | 2024 | Última versión de servidor |

Requisitos de Windows 11: UEFI con Secure Boot, **TPM 2.0**, CPU de 64 bits compatible, 4 GB de RAM y 64 GB de almacenamiento. No hay versión de 32 bits.

Ediciones de Windows 11: Home, Pro, Pro for Workstations, Education, Enterprise, IoT Enterprise. Windows Server: Standard, Datacenter, Essentials.

### Arquitectura de Windows NT

- **Modo usuario**: aplicaciones, subsistemas (Win32), servicios, DLL de sistema (kernel32, user32, ntdll).
- **Modo núcleo**: Executive (gestor de procesos, de memoria, de E/S, de objetos, monitor de seguridad), núcleo (kernel), HAL (capa de abstracción de hardware) y drivers.
- **Registro**: base de datos jerárquica de configuración (HKLM, HKCU, HKCR, HKU, HKCC).
- **Servicios**: procesos en segundo plano gestionados por el SCM (services.exe). Equivalen a los demonios de Unix.

### Cuentas y procesos

Cuentas especiales: **SYSTEM** (LocalSystem, máximo privilegio local), LocalService, NetworkService, Administrador.

**[Salió 2005]** En Windows Server, los procesos pueden pertenecer a SYSTEM, al usuario de la sesión o a cualquier usuario con sesión remota. No pertenecen todos a un único usuario.

### DLL, 32 y 64 bits

- Una **DLL** (Dynamic Link Library) es una biblioteca de enlace dinámico. Equivale a los .so de Linux.
- **WOW64** permite ejecutar aplicaciones de 32 bits en Windows de 64 bits.
- Las DLL de 64 bits están en System32; las de 32 bits, en SysWOW64.

**[Salió 2022]** Reglas de interoperabilidad en Windows de 64 bits:

- Un proceso de 64 bits no puede cargar una DLL de 32 bits.
- Un proceso de 32 bits no puede cargar una DLL de 64 bits.
- Sí se admite RPC entre procesos de 32 y 64 bits, **tanto en el mismo equipo como entre equipos**.
- Por tanto, la afirmación NO correcta era la que decía "solo en el mismo equipo".

### Seguridad y otras tecnologías

- **BitLocker** **[Salió 2007, 2018]**: cifrado de volumen completo. Mitiga el acceso no autorizado a datos, por ejemplo si roban el equipo. Usa AES (XTS-AES 128 por defecto) y suele apoyarse en el TPM. BitLocker To Go cifra unidades extraíbles. Disponible en Pro, Enterprise y Education; en Home solo "cifrado de dispositivo".
- **EFS**: cifrado de ficheros individuales en NTFS.
- **UAC**: control de cuentas de usuario; pide elevación.
- **Windows Defender / Microsoft Defender**: antimalware integrado.
- **Active Directory**: servicio de directorio (se detalla en otros temas).
- **ActiveSync** **[Salió 2016]**: tecnología de Microsoft para sincronizar equipos de escritorio y dispositivos móviles. En Vista se sustituyó por el Centro de dispositivos de Windows Mobile. Su protocolo (Exchange ActiveSync) sigue vivo para correo móvil.
- **WSL** (Windows Subsystem for Linux): ejecuta Linux dentro de Windows; WSL 2 usa un núcleo Linux real en una VM ligera.

## Unix y Linux

### Historia y familia

- **Unix**: Bell Labs (AT&T), 1969, Ken Thompson y Dennis Ritchie; reescrito en C en 1973.
- Ramas: System V (AT&T) y BSD (Berkeley). Derivados comerciales: Solaris (Sun, hoy Oracle), AIX (IBM), HP-UX. BSD libres: FreeBSD, OpenBSD, NetBSD. macOS es Unix certificado (núcleo XNU, base Darwin).
- **POSIX** (IEEE 1003): estándar de interfaz para sistemas tipo Unix.
- **Linux**: núcleo creado por Linus Torvalds en 1991, con licencia **GPL v2**. "GNU/Linux" es el núcleo más las herramientas del proyecto GNU.

**[Salió 2007 b4]** Si el enunciado dice "Unix para los SGBD y Linux para lo demás", el SGBD irá en **Sun Solaris**. SUSE, Debian y Red Hat son Linux.

**[Salió 2008]** Correcto: Ubuntu, Fedora, SUSE y Debian son distribuciones de Linux. Falso: que Windows use licencias GPL, que Unix solo corra en SPARC o que Linux carezca de interfaz gráfica.

### Distribuciones

| Familia | Distribuciones | Paquetes |
|---|---|---|
| Debian | Debian, Ubuntu, Linux Mint, Kali, Trisquel, elementary OS, Zorin | .deb, apt/dpkg |
| Red Hat | RHEL, Fedora, CentOS Stream, Rocky Linux, AlmaLinux, Oracle Linux | .rpm, dnf/yum |
| SUSE | SUSE Linux Enterprise, openSUSE Leap/Tumbleweed | .rpm, zypper |
| Arch | Arch Linux, Manjaro, EndeavourOS | pacman |
| Otras | Gentoo, Slackware, Alpine, NixOS | propios |

**[Salió 2016]** No es distribución Linux: **Kilimanjaro**. Sí lo son Mint, openSUSE y Arch.

**[Salió 2016]** Basada en Ubuntu: **Trisquel** (distribución 100 % libre, de origen gallego). Ututo se basa en Gentoo; PCLinuxOS nació de Mandrake; CentOS, de RHEL.

Debian, nombres en clave (personajes de Toy Story):

| Versión | Nombre | Año |
|---|---|---|
| 8 | jessie | 2015 |
| 9 | stretch | 2017 |
| 10 | buster | 2019 |
| 11 | bullseye | 2021 |
| 12 | bookworm | 2023 |
| 13 | trixie | 2025 (agosto) |
| 14 | forky | en pruebas (testing) |
| — | sid | inestable permanente |

**[Salió 2018 b4]** En 2019, estable Debian 10 "buster" y antigua estable Debian 9 "stretch". A octubre de 2026: **estable 13 "trixie"** y **antigua estable 12 "bookworm"**.

Otras versiones vigentes: Ubuntu 24.04 LTS "Noble Numbat" y 26.04 LTS (abril de 2026); RHEL 10 (2025). Ubuntu publica LTS cada dos años en abril, con 5 años de soporte estándar.

### Jerarquía de directorios (FHS)

| Directorio | Contenido |
|---|---|
| / | Raíz de todo el árbol **[Salió 2005]** |
| /bin | Ejecutables esenciales de usuario (ls, cp, cat) **[Salió 2017]** |
| /sbin | Ejecutables de administración (fsck, ip, reboot) |
| /boot | Núcleo, initramfs y gestor de arranque |
| /dev | Ficheros de dispositivo de E/S **[Salió 2008]** |
| /etc | Ficheros de configuración del sistema **[Salió 2019]** |
| /home | Directorios personales de los usuarios |
| /root | Directorio personal del superusuario |
| /lib, /lib64 | Bibliotecas compartidas esenciales y módulos del núcleo |
| /media, /mnt | Puntos de montaje de extraíbles y temporales |
| /opt | Software adicional de terceros |
| /proc | Sistema de ficheros virtual con información de procesos y núcleo |
| /sys | Sistema de ficheros virtual de dispositivos (sysfs) |
| /run | Datos volátiles desde el arranque (PID, sockets) |
| /tmp | Temporales |
| /usr | Programas y datos de solo lectura compartibles (/usr/bin, /usr/lib, /usr/share) |
| /var | Datos variables: logs (/var/log), colas, cachés, correo |
| /srv | Datos de servicios (web, FTP) |

Ojo: la raíz es **/**, no /root. En muchas distribuciones actuales /bin, /sbin y /lib son enlaces a /usr ("usr merge").

### Usuarios, grupos y permisos

- Usuario **root**: UID 0, superusuario.
- Usuarios de sistema: UID bajos (normalmente menores de 1000).
- Ficheros: /etc/passwd (cuentas), /etc/shadow (contraseñas cifradas), /etc/group (grupos).

Permisos clásicos **[Salió 2006]**: tres tipos de acceso, **lectura (r), escritura (w) y ejecución (x)**, para tres clases: propietario (u), grupo (g) y otros (o).

| Octal | Binario | Permisos |
|---|---|---|
| 0 | 000 | --- |
| 1 | 001 | --x |
| 2 | 010 | -w- |
| 3 | 011 | -wx |
| 4 | 100 | r-- |
| 5 | 101 | r-x |
| 6 | 110 | rw- |
| 7 | 111 | rwx |

**[Salió 2019]** chmod 640 da **rw-r-----**: lectura y escritura al propietario, lectura al grupo, nada a otros.

```bash
chmod 640 informe.txt     # rw-r-----
chmod 755 script.sh       # rwxr-xr-x
chmod u+x,g-w fichero     # notación simbólica
ls -l informe.txt
# -rw-r----- 1 pablo staff 1024 oct 19 10:00 informe.txt
```

En directorios: r permite listar, w crear o borrar entradas, x atravesar el directorio.

Permisos especiales (cuarto dígito, a la izquierda):

| Bit | Octal | Efecto |
|---|---|---|
| setuid | 4000 | El ejecutable corre con el UID del propietario (ejemplo: passwd) |
| setgid | 2000 | Con el GID del grupo; en directorios, los ficheros heredan el grupo |
| sticky | 1000 | En directorios, solo el dueño borra sus ficheros (ejemplo: /tmp, 1777) |

**umask** resta permisos por defecto: con umask 022, los ficheros nacen 644 y los directorios 755. Las ACL POSIX (getfacl, setfacl) amplían el modelo.

### Arranque de Linux

1. Firmware (BIOS o UEFI).
2. Gestor de arranque: **GRUB 2** (actual), antes LILO o GRUB Legacy; systemd-boot en algunos sistemas UEFI.
3. Carga del núcleo y del initramfs.
4. Primer proceso de espacio de usuario, **PID 1**: init.
5. Servicios y sesión.

**[Salió 2015]** Correcto: GRUB 2 sustituyó al GRUB original, que pasó a llamarse **GRUB Legacy**. Falso: que GRUB sea anterior a LILO (LILO es anterior) o que no puedan instalarse en el MBR (sí pueden).

Sistemas init:

- **SysV init**: scripts en /etc/init.d y niveles de ejecución (runlevels 0 a 6).
- **Upstart**: Ubuntu 6.10 a 14.10.
- **systemd**: estándar actual (Debian, Ubuntu, RHEL, Fedora, SUSE, Arch). Usa unidades (.service, .target, .timer). Los targets sustituyen a los runlevels: multi-user.target ~ nivel 3, graphical.target ~ nivel 5.

Los comandos (systemctl, journalctl, ps, top, kill) se estudian en el tema 24.

## Sistemas operativos móviles

### Panorama

| SO | Empresa | Núcleo | Situación |
|---|---|---|---|
| Android | Google (AOSP) | Linux | Dominante mundial (más del 70 %) |
| iOS / iPadOS | Apple | XNU (Darwin) | Segundo; muy fuerte en EE. UU. |
| HarmonyOS NEXT | Huawei | Propio (microkernel HongMeng) | China; sin apps Android desde 2024 |
| KaiOS | KaiOS Technologies | Linux (deriva de Firefox OS) | Teléfonos básicos |
| Históricos | — | — | Symbian, BlackBerry OS, Windows Phone, Firefox OS, MeeGo, webOS, Bada, Tizen |

**[Salió 2017]** Sistema operativo para móviles en la lista: **MeeGo** (Nokia e Intel, 2010). Knoppix, Ubuntu y SUSE son distribuciones de escritorio.

### Android: arquitectura

Capas de abajo arriba:

1. **Núcleo Linux**: drivers, gestión de energía, memoria, procesos, Binder (IPC propio). Desde Android 11-12 se usa el **GKI** (Generic Kernel Image), un núcleo común con módulos del fabricante.
2. **HAL** (capa de abstracción de hardware). Desde Android 8 (Project Treble) se separa del framework.
3. **Android Runtime (ART)** y bibliotecas nativas en C/C++ (libc Bionic, SQLite, OpenGL ES, WebKit/Chromium).
4. **Framework de Java/Kotlin**: Activity Manager, Content Providers, View System, Notification Manager, Package Manager.
5. **Aplicaciones** del sistema y de usuario.

**[Salió 2025]** El núcleo de Android es un **núcleo Linux** (modificado). No es un núcleo propio de Google ni XNU.

Componentes de una app: Activity, Service, Broadcast Receiver y Content Provider. Se comunican con Intents. El manifiesto es AndroidManifest.xml.

### Android: máquina virtual y paquetes

- **Dalvik**: máquina virtual de registros con compilación JIT, hasta Android 4.4. Ejecuta bytecode .dex.
- **ART** (Android Runtime): compilación AOT al instalar. Opcional en 4.4 KitKat y **por defecto desde 5.0 Lollipop**. Desde Android 7 combina AOT, JIT y perfiles.

**[Salió 2015]** La plataforma de ejecución "a partir de KitKat" era **ART** (sin verificar la opción oficial; ver Trampas).

**Paquetes** **[Salió 2016]**: extensión **.apk** (Android Package). Desde agosto de 2021, Google Play exige publicar en **.aab** (Android App Bundle). Play genera desde el AAB los APK optimizados para cada dispositivo.

### Android: lenguajes y desarrollo

- **Java**: lenguaje oficial original **[Salió 2015]**.
- **Kotlin**: oficial desde 2017 y lenguaje preferente ("Kotlin first") desde mayo de 2019.
- **Jetpack Compose**: framework declarativo de UI para Kotlin.
- **Android Studio**: IDE oficial, basado en IntelliJ IDEA. Construye con Gradle.
- **Android SDK**: bibliotecas y herramientas (adb, emulador).

**Android NDK** **[Salió 2024]**:

- Conjunto de herramientas para implementar partes de la app en **C y C++**.
- Genera bibliotecas binarias por arquitectura (arm64-v8a, armeabi-v7a, x86_64) que se llaman desde Java o Kotlin mediante **JNI** (Java Native Interface).
- Útil para tareas intensivas en cálculo: juegos, simulación física, procesado de señal.
- **Sí permite reutilizar código y bibliotecas de terceros en C/C++**. Esa era la afirmación incorrecta.

### Android: versiones

| Versión | Nombre | API | Año | Novedad destacable |
|---|---|---|---|---|
| 1.5 | Cupcake | 3 | 2009 | Primer nombre de postre |
| 1.6 | Donut | 4 | 2009 | |
| 2.0-2.1 | Eclair | 5-7 | 2009 | |
| 2.2 | Froyo | 8 | 2010 | |
| 2.3 | Gingerbread | 9-10 | 2010 | |
| 3.x | Honeycomb | 11-13 | 2011 | Solo para tablets **[Salió 2016]** |
| 4.0 | Ice Cream Sandwich | 14-15 | 2011 | Une móvil y tablet |
| 4.1-4.3 | Jelly Bean | 16-18 | 2012 | Project Butter **[Salió 2017]** |
| 4.4 | KitKat | 19 | 2013 | ART experimental |
| 5.x | Lollipop | 21-22 | 2014 | ART por defecto, Material Design |
| 6.0 | Marshmallow | 23 | 2015 | Permisos en tiempo de ejecución |
| 7.x | Nougat | 24-25 | 2016 | Multiventana |
| 8.x | Oreo | 26-27 | 2017 | Project Treble |
| 9 | Pie | 28 | 2018 | **[Salió 2018]** |
| 10 | (Quince Tart, interno) | 29 | 2019 | Fin de los nombres públicos de postre |
| 11 | (Red Velvet Cake) | 30 | 2020 | |
| 12 / 12L | (Snow Cone) | 31-32 | 2021-2022 | Material You; 12L para pantallas grandes |
| 13 | (Tiramisu) | 33 | 2022 | |
| 14 | (Upside Down Cake) | 34 | 2023 | |
| 15 | (Vanilla Ice Cream) | 35 | 2024 | |
| 16 | (Baklava) | 36 | 2025 (junio) | Nuevo calendario: versión mayor en el segundo trimestre |
| 17 | (Cinnamon Bun) | 37 | 2026 (junio) | Última versión estable a octubre de 2026 |

Truco: los postres siguen el orden alfabético desde la C (Cupcake). Desde la 10 el nombre de postre es solo interno.

### Android: capas de personalización

Los fabricantes modifican AOSP con su propia capa:

| Capa | Fabricante |
|---|---|
| One UI (antes TouchWiz, Samsung Experience) | Samsung |
| MIUI, sustituida por HyperOS (2023) | Xiaomi |
| ColorOS | OPPO (y OnePlus en China) |
| OxygenOS | OnePlus |
| OriginOS (antes Funtouch OS) | vivo |
| EMUI | Huawei |
| MagicOS | Honor |
| realme UI | realme |
| Hello UI (antes My UX) | Motorola |
| Pixel UI | Google |

**[Salió 2022]** No es capa de Android: **PenPoint OS**, un SO para ordenadores de lápiz de GO Corporation (1991).

### iOS y el ecosistema Apple

- **Núcleo**: XNU, híbrido (Mach + partes de BSD). Base común Darwin con macOS.
- **Capas de iOS**: Core OS, Core Services, Media y Cocoa Touch (UIKit).
- **Lenguajes**: Objective-C (histórico) y **Swift** (2014, actual).
- **Versiones vigentes**: iOS 26 (septiembre de 2025, salto de numeración desde iOS 18) e **iOS 27** (septiembre de 2026). La numeración por año se aplica a iOS, iPadOS, macOS, watchOS, tvOS y visionOS.

**Sandboxing en iOS** **[Salió 2025]**:

- Cada aplicación se ejecuta en su propio contenedor aislado (sandbox).
- Solo accede a sus ficheros; no puede leer datos de otras apps ni del sistema.
- El acceso a recursos sensibles (cámara, ubicación, contactos) exige permisos del usuario y entitlements.
- Las apps se comunican por mecanismos controlados: extensiones, URL schemes, App Groups.
- Se complementa con firma de código obligatoria, revisión del App Store y Secure Enclave.

**Herramientas de desarrollo Apple** **[Salió 2024]**:

| Herramienta | Qué es |
|---|---|
| Xcode | IDE oficial; desarrolla para **todas** las plataformas Apple (iOS, iPadOS, macOS, watchOS, tvOS, visionOS). Solo funciona en macOS |
| Xcode Cloud | Servicio de CI/CD de Apple en la nube (sí existe, desde 2022) |
| SwiftUI | Framework declarativo de UI para **cualquier dispositivo Apple** (2019) |
| UIKit / AppKit | Frameworks de UI imperativos para iOS / macOS |
| iOS SDK | Kit para apps de iOS; cada plataforma tiene su propio SDK |
| TestFlight | Distribución de versiones beta |
| Instruments | Análisis de rendimiento |

En 2024 la correcta era la de SwiftUI. Era falso que Xcode sea exclusivo de iOS, que Xcode Cloud no exista y que el iOS SDK sirva para macOS, watchOS y tvOS.

```swift
import SwiftUI

struct ContentView: View {
    @State private var contador = 0
    var body: some View {
        Button("Pulsado \(contador) veces") { contador += 1 }
    }
}
```

### macOS: versiones

| Versión | Nombre | Año |
|---|---|---|
| 10.12 | Sierra | 2016 |
| 10.13 | High Sierra | 2017 **[Salió 2017 b4]** |
| 10.14 | Mojave | 2018 |
| 10.15 | Catalina | 2019 |
| 11 | Big Sur | 2020 (transición a Apple Silicon) |
| 12 | Monterey | 2021 |
| 13 | Ventura | 2022 **[Salió 2022]** |
| 14 | Sonoma | 2023 |
| 15 | Sequoia | 2024 |
| 26 | Tahoe | 2025 (último con soporte para Intel) |
| 27 | Golden Gate | 2026 (septiembre) |

Sistema de ficheros: APFS. Los nombres desde Mavericks (10.9) son lugares de California.

## Trampas y respuestas desactualizadas

- **macOS más reciente (2022)**: la respuesta era Ventura. Hoy sería macOS 27 Golden Gate (septiembre de 2026). Ojo al salto de numeración: tras 15 Sequoia viene 26 Tahoe.
- **Debian estable (2018 b4)**: buster y stretch valían en 2019. Hoy: estable 13 trixie, antigua estable 12 bookworm.
- **BitLocker en Vista (2007, OBSOLETA)**: venía en Ultimate y Enterprise. Hoy está en Windows 11 Pro, Enterprise y Education; Home tiene "cifrado de dispositivo".
- **ART "a partir de KitKat" (2015)**: en 4.4 ART era opcional y Dalvik seguía por defecto. ART es el runtime por defecto desde 5.0 Lollipop. Si la pregunta se repite, elige ART: Dalvik y JVM son distractores.
- **Lenguaje oficial de Android (2015)**: entonces Java. Hoy el preferente es **Kotlin** (desde 2019), aunque Java sigue soportado. Si preguntan por el "recomendado" o "preferente", Kotlin.
- **FAT16 (2007)**: 2 GB es la respuesta clásica. Con clúster de 64 KB (Windows NT) llega a 4 GB; si aparecen ambas, elige 2 GB salvo que mencione NT.
- **ReFS (2017)**: "18 EB" es 2^64 bytes. Microsoft documenta hoy límites prácticos menores (35 PB), pero la respuesta oficial de aquella pregunta es la de 18 EB.
- **ActiveSync (2016)**: dejó de existir como programa de escritorio en Vista. Exchange ActiveSync sigue como protocolo.
- **Windows 10**: fuera de soporte general desde el 14 de octubre de 2025. No lo des como "versión vigente".
- **init en Unix (2022)**: init no es "el arranque de un usuario", sino el proceso PID 1 del sistema.
- **fork (2017)**: el hijo recibe 0, no el PID del padre.
- **El kernel no es "el núcleo del procesador"** (2022): trampa de vocabulario core/núcleo.
- **/root frente a /** (2005): la raíz del sistema es /. /root es la carpeta personal del superusuario.
- **Paginación** produce fragmentación interna; **segmentación**, externa (2015).
- **Corto plazo frente a medio plazo** (2008, 2018): la CPU la asigna el de corto plazo; el swapping es del de medio plazo.
- **NDK (2024)**: sí permite reutilizar bibliotecas de terceros.
- **Distractores inventados**: "Main term scheduler", "TPID", "Kilimanjaro", "estado Ocioso", "paginación heteroscedástica". Si un término te suena raro, suele ser el intruso.
- **RPC 32/64 bits (2022)**: funciona en el mismo equipo y entre equipos distintos.
