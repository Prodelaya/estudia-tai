# Tema 24. Administración del sistema operativo y software de base

Peso en el examen: unas **2,8 preguntas de test** por convocatoria y **0 del supuesto del Bloque III**. Como Pablo elegirá el Bloque III, este tema solo le cuenta en el test. Hay **122 preguntas históricas**: 48 de test (ej1) y 74 del supuesto del Bloque IV (b4), que no hará pero que sirven de banco de comandos. Lo que más se pregunta es Linux: comandos con su opción exacta (tar, chmod, find, grep, apt/dpkg, ps, tail, crontab), seguido de Windows (ipconfig, net, PowerShell) y del editor vi. Solapa con el tema 13 (conceptos de sistemas operativos): aquí está el "cómo se hace", allí el "qué es".

## Cómo lo preguntan

- **Comando más opción exacta**: "¿qué opción de tar lista el contenido?" (2018: `tar tvf`), "`tail -f`" (2025), "`chmod -c o-w`" (2016 b4).
- **Distractores inventados que suenan bien**: `checkdisk`, `getcpu`, `concatenate`, `Get-InstalledSoftware`, `ipconfig /dnsflush`. Si un comando no te suena de nada, casi seguro que no existe.
- **Cálculo de permisos octales**: `chmod 754` (2015), `chmod 416` (2016). Hay que traducir números a rwx y al revés.
- **Interpretar una expresión**: crontab `0 5 8 11 *` (2025), `false && echo "Hola"` (2015 b4), `cat fichero | wc -l` (2016), `ps -ef | grep $USER` (2017).
- **Equivalencias Debian frente a RHEL**: versión del sistema (`lsb_release -a`, `/etc/redhat-release`), log de autenticación (`/var/log/auth.log`), gestor de paquetes (apt frente a dnf/rpm).
- **Windows en dos sabores**: cmd clásico (`ipconfig /flushdns`, `net localgroup`, `tasklist`, `route print`) y cmdlets de PowerShell con forma Verbo-Nombre (`Get-Process`, `Get-Service`, `Get-History`).
- **Editor vi**: borrar línea (`dd`), deshacer (`u`), salir sin guardar (`:q!`). Salió en 2015 y 2016.
- **Preguntas antiguas de organización** (2005-2007): tareas del administrador, tipos de mantenimiento, área de explotación. Hoy casi no salen.

## 1. El administrador de sistemas y el mantenimiento

### Funciones del administrador del sistema operativo

El administrador de sistemas (*sysadmin*) mantiene operativos los servidores y puestos. Sus tareas típicas son:

- Instalar, configurar y actualizar el sistema operativo y el software de base.
- Gestionar usuarios, grupos, permisos y cuotas.
- Arrancar, parar y vigilar servicios (web, BD, DNS, correo).
- Planificar y comprobar copias de seguridad.
- Monitorizar rendimiento, capacidad (disco, memoria, CPU) y registros (*logs*).
- Aplicar parches de seguridad y bastionado (guías CCN-STIC, ENS).
- Automatizar tareas con scripts y planificadores (cron, Programador de tareas).
- Documentar la configuración y atender incidencias de segundo nivel.

**No es tarea del administrador del SO**: analizar y programar aplicaciones de negocio, diseñar el modelo de datos o definir requisitos de usuario. Eso es desarrollo. **[Salió 2005, 2007]**

**Software de base**: el que hace funcionar el ordenador y da servicio a las aplicaciones. Incluye sistema operativo, controladores, utilidades, compiladores, intérpretes, SGBD, servidores web y de aplicaciones, y middleware.

### Áreas clásicas de un departamento de sistemas (obsoleto)

Preguntas de 2005-2007 que hoy están marcadas como obsoletas. Basta recordar:

- **Explotación** (operación): ejecuta los procesos *batch*, opera los equipos, lanza y vigila las copias. **[Salió 2005, 2006]**
- **Sistemas / técnica de sistemas**: instala y administra SO y software de base.
- **Desarrollo**: analiza y programa aplicaciones.
- **Soporte / microinformática**: atiende a usuarios y puestos.

### Tipos de mantenimiento

| Tipo | En hardware | En software (ISO/IEC 14764, Métrica v3) |
|---|---|---|
| Preventivo | Revisiones periódicas: limpiar cabezales, ventiladores, filtros | Mejorar mantenibilidad antes de que falle |
| Correctivo | Reparar o sustituir lo averiado | Corregir errores detectados |
| Predictivo | Vigilar indicadores (SMART del disco, temperatura) | No se usa como categoría |
| Adaptativo | No aplica | Adaptar a cambios de entorno (nuevo SO, ley) |
| Perfectivo | No aplica | Añadir mejoras o funcionalidad |

La limpieza periódica de cabezas de disco es **mantenimiento preventivo**. **[Salió 2007]**

Mantenimiento del SO en el día a día: aplicar actualizaciones, rotar logs (`logrotate`), revisar espacio (`df`), comprobar sistemas de ficheros (`fsck`, `chkdsk`), limpiar temporales, revisar servicios y tareas programadas.

## 2. Linux: los comandos más preguntados (a fondo)

Convenciones: `$` indica usuario normal y `#` root. Las opciones cortas llevan un guion (`-l`) y las largas dos (`--list`). En `tar` y `ps` se admiten opciones sin guion (`tar xvf`, `ps aux`).

### 2.1 Orientarse: pwd, ls, which, whereis, man

| Comando | Qué hace | Opciones clave |
|---|---|---|
| `pwd` | Muestra el directorio de trabajo actual **[Salió 2015]** | Equivale a la variable `$PWD` **[Salió 2017 b4]** |
| `cd` | Cambia de directorio | `cd -` vuelve al anterior; `cd ~` al home |
| `ls` | Lista ficheros | `-l` detalle, `-a` ocultos, `-h` tamaños legibles, `-R` recursivo, `-t` por fecha, `-S` por tamaño |
| `which` | Ruta completa del ejecutable que se lanzaría (busca en `$PATH`) **[Salió 2017]** | `which -a` todas las coincidencias |
| `whereis` | Localiza binario, fuentes y página man **[Salió 2017 b4]** | `-b` solo binario, `-m` solo manual |
| `type` | Dice si algo es alias, función, *builtin* o fichero | |
| `man` | Manual de un comando | Secciones: 1 órdenes de usuario, 5 formatos de fichero, 8 administración |
| `apropos` / `man -k` | Busca palabras en las descripciones del manual | |
| `whatis` | Descripción de una línea de un comando | |

Salida de `ls -l` y significado del primer carácter:

```bash
$ ls -l /etc/passwd
-rw-r--r-- 1 root root 2847 oct 19 10:02 /etc/passwd
# tipo+permisos, enlaces, propietario, grupo, tamaño, fecha, nombre
```

Primer carácter: `-` fichero, `d` directorio, `l` enlace simbólico, `c` dispositivo de caracteres, `b` de bloques, `s` socket, `p` tubería con nombre.

### 2.2 Ver y procesar texto: cat, less, head, tail, grep, wc, sort

**cat** concatena ficheros y los muestra por la salida estándar. **[Salió 2016 b4]** `cat a b > c` une dos ficheros. `cat -n` numera líneas. Su inverso es `tac`.

**less** muestra un fichero de forma interactiva, con avance y retroceso y búsquedas. **[Salió 2015]** Dentro: `/texto` busca hacia delante, `?texto` hacia atrás, `n` siguiente, `G` final, `g` inicio, `q` salir. `more` es el antecesor, solo avanza.

**head** muestra las **10 primeras líneas** por defecto. `head -n 20 f` o `head -20 f` cambia la cantidad. **[Salió 2015 b4]**

**tail** muestra las **10 últimas líneas** por defecto.

| Opción de tail | Efecto |
|---|---|
| `-n 50` | Últimas 50 líneas |
| `-n +5` | Desde la línea 5 hasta el final |
| `-f` | *Follow*: sigue mostrando lo que se añade al fichero en tiempo real **[Salió 2025]** |
| `-F` | Como `-f`, pero reabre el fichero si se rota (logrotate) |

```bash
tail -f /var/log/syslog          # ver el log crecer; Ctrl+C para salir
tail -n 100 -f /var/log/nginx/access.log
```

En 2025 los distractores eran `tail -r`, `tail -w` y `tail -u`. Ninguno sigue el fichero.

**grep** busca líneas que casan con un patrón. Sintaxis: `grep [opciones] PATRÓN [FICHERO...]`. El patrón va **antes** del fichero.

| Opción | Efecto |
|---|---|
| `-c` | Cuenta las líneas que coinciden **[Salió 2017]** |
| `-i` | Ignora mayúsculas y minúsculas |
| `-v` | Invierte: líneas que **no** coinciden |
| `-n` | Muestra el número de línea |
| `-r` / `-R` | Recursivo en directorios |
| `-l` | Solo nombres de ficheros con coincidencias |
| `-w` | Palabra completa |
| `-E` | Expresiones regulares extendidas (antes `egrep`) |
| `-F` | Cadena literal, sin regex (antes `fgrep`) |

```bash
grep -c Autor libro.txt     # nº de líneas con "Autor" (respuesta 2017)
grep -rin "error" /var/log/ # recursivo, sin mayúsculas, con nº de línea
grep -v "^#" sshd_config    # quitar comentarios
```

Trampa de 2017: `grep -c libro.txt Autor` está mal porque invierte patrón y fichero.

**wc** cuenta: `-l` líneas, `-w` palabras, `-c` bytes, `-m` caracteres. `cat fichero | wc -l` devuelve **el número de líneas** del fichero. **[Salió 2016]**

**sort** ordena líneas. **[Salió 2015]** Opciones: `-n` numérico, `-r` inverso, `-k2` por la columna 2, `-t:` separador, `-u` sin repetidos, `-h` tamaños humanos.

```bash
sort -t: -k3 -n /etc/passwd     # ordenar usuarios por UID
du -sh * | sort -h              # directorios ordenados por tamaño
```

Otros filtros en tabla compacta:

| Comando | Uso |
|---|---|
| `uniq` | Quita líneas repetidas consecutivas; `-c` cuenta |
| `cut -d: -f1` | Extrae campos (aquí, el primero separado por `:`) |
| `tr 'a-z' 'A-Z'` | Traduce o borra caracteres |
| `sed 's/viejo/nuevo/g'` | Editor de flujo: sustituciones |
| `awk -F: '{print $1}'` | Procesa columnas; mini lenguaje |
| `tee fichero` | Escribe en fichero y en pantalla a la vez |
| `xargs` | Convierte la entrada en argumentos de otro comando |
| `diff a b` | Diferencias entre ficheros |
| `pr` | Formatea texto para imprimir (cabecera, paginación); `pr -t` omite cabecera y pie **[Salió 2006]** |
| `nl` | Numera líneas |

### 2.3 Gestionar ficheros: touch, cp, mv, rm, ln, find

| Comando | Qué hace | Opciones clave |
|---|---|---|
| `touch f` | Crea un fichero vacío o, si existe, actualiza su fecha de modificación **[Salió 2016]** | `-t` fecha concreta |
| `cp` | Copia | `-r` recursivo, `-p` conserva permisos y fechas, `-a` archivo (todo), `-i` pregunta |
| `mv` | Mueve **o renombra** (no existe `rename` estándar en UNIX) **[Salió 2007]** | `-i` pregunta, `-f` fuerza |
| `rm` | Borra | `-r` recursivo, `-f` sin preguntar, `-i` pregunta |
| `mkdir` / `rmdir` | Crea / borra directorio vacío | `mkdir -p a/b/c` crea la ruta entera |
| `ln -s destino enlace` | Enlace simbólico | Sin `-s`, enlace duro |
| `stat f` | Metadatos e inodo | |
| `file f` | Tipo de contenido | |

**find** busca ficheros recorriendo el árbol. Es de los más preguntados en supuestos. Sintaxis: `find RUTA CRITERIOS ACCIÓN`.

| Criterio | Significado |
|---|---|
| `-name "*.log"` | Por nombre (`-iname` sin distinguir mayúsculas) |
| `-type f` / `-type d` / `-type l` | Fichero, directorio, enlace |
| `-mtime -3` | Modificado hace **menos** de 3 días **[Salió 2016 b4]** |
| `-mtime +30` | Modificado hace **más** de 30 días |
| `-mmin -60` | Modificado en los últimos 60 minutos |
| `-size +100M` | Mayor de 100 MB |
| `-user www-data` | De ese propietario |
| `-perm -0002` | Con **al menos** el bit de escritura para otros **[Salió 2016 b4]** |
| `-perm 644` | Permisos exactamente 644 |
| `-xdev` | No baja a otros sistemas de ficheros montados |
| `-exec cmd {} \;` | Ejecuta un comando por cada resultado |
| `-delete` | Borra lo encontrado |

```bash
find / -type f -mtime -3                       # modificados en los 3 últimos días
find /home -xdev -type d -perm -0002 -print    # directorios escribibles por todos
find /var/log -name "*.gz" -mtime +30 -delete  # limpiar logs viejos
find / -perm -4000 -type f                     # ficheros con SUID (auditoría)
```

Variantes: `locate` busca en una base de datos indexada (`updatedb`), es más rápido pero no está al día.

### 2.4 Comprimir y empaquetar: tar, gzip, zip

**tar** empaqueta varios ficheros en uno. Con `z`, `j` o `J` además comprime.

| Letra | Significado |
|---|---|
| `c` | *Create*: crear archivo |
| `x` | *eXtract*: extraer |
| `t` | Lis**t**ar el contenido **[Salió 2018]** |
| `v` | *Verbose* |
| `f` | El siguiente argumento es el **fichero** tar (va justo detrás) |
| `z` | gzip (`.tar.gz`, `.tgz`) **[Salió 2019 b4]** |
| `j` | bzip2 (`.tar.bz2`) |
| `J` | xz (`.tar.xz`) |
| `r` | Añadir ficheros a un tar existente |
| `-C dir` | Extraer en otro directorio |

```bash
tar -czf TEMAS.tar.gz /home/opositor/temas/   # crear comprimido (2019 b4)
tar -czf config_backup.tar.gz /srv/app/config/  # igual (2025 b4)
tar tvf fichero.tar                           # listar (2018)
tar -xzf TEMAS.tar.gz -C /restaurar           # extraer en /restaurar
```

Regla: el nombre del archivo tar va **justo después de `f`** y **antes** de lo que se empaqueta. `tar -cjf /home/opositor/temas/ TEMAS.tar.gz` está mal por el orden.

Otros: `gzip f` / `gunzip f.gz` (comprime un solo fichero y borra el original), `bzip2`, `xz`, `zip -r a.zip dir` / `unzip a.zip`, `zcat` (ver sin descomprimir).

### 2.5 Copiar entre equipos: ssh, scp, rsync, dd

**ssh** abre una sesión remota cifrada (puerto 22). Se puede lanzar un único comando remoto:

```bash
ssh u@s1 'who'                 # usuarios conectados en s1 (2018 b4)
ssh -p 2222 admin@servidor     # puerto distinto
ssh-keygen -t ed25519          # generar par de claves
ssh-copy-id u@s1               # instalar la clave pública en s1
scp fichero u@s1:/tmp/         # copiar por SSH
```

Instalar el servidor SSH en Debian/Ubuntu: `apt-get install ssh` (metapaquete) o `apt install openssh-server`. **[Salió 2017 b4]** Configuración: `/etc/ssh/sshd_config` (`PermitRootLogin no`, `PasswordAuthentication no`, `Port`).

**rsync** sincroniza directorios local o remotamente, enviando solo las diferencias. Es la respuesta para "sincronizar periódicamente carpetas entre servidores". **[Salió 2017 b4]** `robocopy` es su equivalente en Windows.

```bash
rsync -avz --delete /datos/ u@nuevo:/datos/   # a=archivo, v=verbose, z=comprimir
```

**dd** copia bloques a bajo nivel (`if` origen, `of` destino, `bs` tamaño de bloque, `count` número de bloques). Tamaño resultante = `bs × count`.

```bash
dd if=/dev/zero of=/tmp/testfile bs=512 count=1000   # fichero de 512.000 bytes
dd if=/dev/sda of=/backup/disco.img bs=4M status=progress
```

**[Salió 2016 b4]** con `bs=512 count=1000`: el fichero mide 512.000 bytes y no necesita existir antes.

### 2.6 Disco y sistemas de ficheros: df, du, mount, fsck

| Comando | Qué hace | Opciones clave |
|---|---|---|
| `df` | Espacio libre y usado **por sistema de ficheros montado** **[Salió 2006]** | `-h` legible, `-T` muestra el tipo (ext4, xfs), `-i` inodos |
| `du` | Espacio que ocupa **un directorio y sus subdirectorios** **[Salió 2016]** | `-s` total, `-h` legible, `--max-depth=1` |
| `mount` | Monta, o sin argumentos lista lo montado con su tipo **[Salió 2016 b4]** | `-t tipo`, `-o opciones`, `-a` monta todo `/etc/fstab` |
| `umount` | Desmonta | |
| `lsblk` | Árbol de discos y particiones | `-f` con sistema de ficheros |
| `blkid` | UUID y tipo de cada partición | |
| `fsck` | Comprueba y repara un sistema de ficheros **desmontado** | `-y` responde sí a todo (reparación automática) **[Salió 2024 b4]**, `-f` fuerza, `-n` solo comprueba |
| `e2fsck` | fsck específico de ext2/ext3/ext4 **[Salió 2017]** | |
| `mkfs.ext4 /dev/sdb1` | Formatea | |
| `fdisk` / `parted` | Particiona (MBR/GPT) | `fdisk -l` lista |
| `tune2fs` | Ajusta parámetros ext | |
| `quota` | Cuotas de disco por usuario | |

```bash
df -h                  # ocupación de cada FS
df -T /home            # tipo de FS de /home
mount | grep /home     # también muestra el tipo (respuesta 2016 b4)
du -sh /var/log        # cuánto ocupa /var/log
umount /dev/sda8 && fsck -y /dev/sda8   # reparar automáticamente (2024 b4)
```

`/etc/fstab` monta al arranque. Campos: dispositivo (o `UUID=`), punto de montaje, tipo, opciones, *dump*, orden de fsck (`0` no, `1` raíz, `2` resto).

```text
UUID=3f1c...  /home  ext4  defaults,noatime  0  2
```

**LVM** (volúmenes lógicos): disco físico (PV, `pvcreate`) → grupo de volúmenes (VG, `vgcreate`) → volumen lógico (LV, `lvcreate`). Para ampliar un LV con espacio libre del VG: primero se **extiende el LV** y después se **amplía el sistema de ficheros**, en línea (sin desmontar). **[Salió 2025 b4]**

```bash
lvextend -L 600G /dev/vg_datos/lv_contenido   # 1) ampliar el LV
xfs_growfs /contenido                         # 2) ampliar XFS (se le pasa el punto de montaje)
lvextend -r -L 600G /dev/vg_datos/lv_contenido  # ambos pasos a la vez
```

XFS se puede **ampliar en caliente pero no reducir**. ext4 se amplía con `resize2fs`.

### 2.7 Permisos: chmod, chown, umask

Cada fichero tiene permisos para **u** (propietario), **g** (grupo) y **o** (otros). Cada uno puede tener **r** (4), **w** (2) y **x** (1). Se suman por bloque.

| Octal | rwx | Octal | rwx |
|---|---|---|---|
| 0 | `---` | 4 | `r--` |
| 1 | `--x` | 5 | `r-x` |
| 2 | `-w-` | 6 | `rw-` |
| 3 | `-wx` | 7 | `rwx` |

Ejemplos preguntados:

- `chmod 754 f`: propietario rwx (total), grupo r-x (lectura y ejecución), otros r-- (lectura). **[Salió 2015]**
- Lectura al propietario, ejecución al grupo, lectura y escritura a otros: 4, 1, 6, o sea `chmod 416 fich.bct`. **[Salió 2016]**
- `chmod 777`: todo para todos. `chmod 755`: típico de ejecutables y directorios. `chmod 644`: típico de ficheros. `chmod 600`: claves privadas.

Modo simbólico: `chmod [ugoa][+-=][rwx] fichero`.

```bash
chmod u+x script.sh           # añadir ejecución al propietario
chmod o-w /home/fichero       # quitar escritura a otros (CCN-STIC-612)
chmod -c o-w /home/fichero    # igual, informando solo si hubo cambio (2016 b4)
chmod u=rwx,g=rx,o= f         # equivale a 750
chmod -R 750 /srv/app         # recursivo
```

Ojo con las opciones de chmod: `-R` recursivo, `-c` informa de cambios, `-v` informa de todo. `chmod -r` **no** es recursivo: quita la lectura. `chown` cambia propietario, no permisos.

| Comando | Uso |
|---|---|
| `chown usuario:grupo f` | Cambia propietario y grupo; `-R` recursivo |
| `chgrp grupo f` | Cambia solo el grupo |
| `umask` | Máscara que se resta a los permisos de creación. Con `022`, ficheros 644 y directorios 755 |
| `getfacl` / `setfacl` | Listas de control de acceso (ACL) más finas |
| `lsattr` / `chattr +i` | Atributos ext; `+i` hace el fichero inmutable |

Bits especiales (cuarto dígito por delante):

| Bit | Octal | En fichero | En directorio | Se ve como |
|---|---|---|---|---|
| SUID | 4000 | Se ejecuta con el UID del propietario (p. ej. `passwd`) | Sin efecto | `s` en u |
| SGID | 2000 | Se ejecuta con el GID del grupo | Lo creado hereda el grupo | `s` en g |
| Sticky | 1000 | Sin efecto hoy | Solo el dueño puede borrar sus ficheros (`/tmp`) | `t` en o |

```bash
chmod 4755 /usr/local/bin/prog    # -rwsr-xr-x
chmod 1777 /compartido            # drwxrwxrwt, como /tmp
```

### 2.8 Usuarios, contraseñas y límites

Ficheros clave:

| Fichero | Contenido |
|---|---|
| `/etc/passwd` | Usuarios, legible por todos. Campos: `nombre:x:UID:GID:GECOS:home:shell` |
| `/etc/shadow` | **Hash de las contraseñas** y caducidad; solo root **[Salió 2019 b4]** |
| `/etc/group` | Grupos y miembros |
| `/etc/gshadow` | Contraseñas de grupo |
| `/etc/login.defs` | Valores por defecto para **usuarios nuevos**: `PASS_MAX_DAYS`, `PASS_MIN_DAYS`, `PASS_WARN_AGE`, `UID_MIN` **[Salió 2016 b4]** |
| `/etc/sudoers` | Quién puede usar sudo; editar con `visudo` |
| `/etc/security/limits.conf` | Límites por usuario o grupo (`@grupo`): ficheros abiertos, procesos **[Salió 2015 b4]** |
| `/etc/skel/` | Plantilla que se copia al home de cada usuario nuevo |

```bash
# limits.conf: dominio  tipo  elemento  valor
@users  soft  nofile  1024
@users  hard  nofile  1024
```

En limits.conf, `@` delante indica grupo, `soft` es el límite efectivo y `hard` el máximo. `ulimit -n` muestra el límite actual de la sesión.

| Comando | Uso |
|---|---|
| `useradd -m -s /bin/bash ana` | Crea usuario con home y shell (`adduser` en Debian es interactivo) |
| `usermod -aG sudo ana` | Añade a un grupo sin quitar los demás (`-a` imprescindible) |
| `userdel -r ana` | Borra usuario y su home |
| `passwd ana` | Cambia contraseña; `-l` bloquea, `-u` desbloquea, `-e` caduca |
| `chage -l ana` | Muestra la **fecha del último cambio** y caducidad **[Salió 2016 b4]** |
| `chage -M 180 ana` | Caducidad de 180 días para un usuario ya existente |
| `groupadd`, `gpasswd` | Gestión de grupos |
| `id`, `groups`, `whoami` | Identidad del usuario actual |
| `su -` / `sudo cmd` | Cambiar a root / ejecutar como root |
| `who`, `w`, `users` | Usuarios conectados |
| `last`, `lastlog` | Historial de accesos |

`who -r` muestra el **nivel de ejecución** actual. **[Salió 2017]** `who -b` muestra la hora del último arranque.

### 2.9 Procesos: ps, top, kill, pidof

**ps** muestra procesos. Dos estilos:

- `ps -ef` (estilo System V). Columnas: `UID PID PPID C STIME TTY TIME CMD`. **UID** es el propietario. **[Salió 2016]**
- `ps aux` (estilo BSD). Columnas: `USER PID %CPU %MEM VSZ RSS TTY STAT START TIME COMMAND`.

```bash
ps -ef | grep $USER         # procesos del usuario actual (2017)
ps -U postgres -u postgres u  # procesos con UID real y efectivo postgres, formato usuario (2017 b4)
ps -ef --forest             # árbol de procesos
pidof systemd               # PID de systemd: devuelve 1 (2018 b4)
pgrep -u www-data nginx     # PIDs por nombre y usuario
```

`$USER` es una variable de entorno con el nombre del usuario actual. Por eso `ps -ef | grep $USER` muestra los procesos del usuario actual. Ojo: también sale la propia línea del `grep`.

| Comando | Uso |
|---|---|
| `top` | Procesos en tiempo real; `k` mata, `q` sale, `M` ordena por memoria |
| `htop` | top mejorado, en color e interactivo |
| `iotop` | Como top, pero para **E/S de disco** por proceso **[Salió 2017 b4]** |
| `kill PID` | Envía SIGTERM (15) por defecto: terminación ordenada |
| `kill -9 PID` | SIGKILL: muerte inmediata, no se puede capturar |
| `kill -HUP PID` | SIGHUP (1): muchos demonios relen su configuración |
| `killall nombre` / `pkill nombre` | Por nombre |
| `nice -n 10 cmd` / `renice` | Prioridad: de -20 (más alta) a 19 (más baja) |
| `nohup cmd &` | Sigue ejecutándose al cerrar la sesión |
| `jobs`, `fg`, `bg`, `Ctrl+Z` | Control de trabajos de la shell |
| `uptime` | Tiempo encendido y carga media (1, 5 y 15 min) |
| `vmstat`, `iostat`, `sar` | Estadísticas de memoria, E/S y CPU |
| `lsof` | Ficheros (y sockets) abiertos por procesos |

### 2.10 Servicios y arranque: systemctl, niveles de ejecución, shutdown

Hoy casi todas las distribuciones usan **systemd** como proceso inicial (PID 1). Las unidades de servicio se gestionan con `systemctl`.

| Orden | Efecto |
|---|---|
| `systemctl start nginx` | Arranca ahora |
| `systemctl stop nginx` | Para |
| `systemctl restart nginx` | Para y arranca |
| `systemctl reload nginx` | Relee la configuración sin cortar el servicio |
| `systemctl status nginx` | Estado, PID y últimas líneas de log |
| `systemctl enable nginx` | Arranque automático al iniciar (`--now` además lo arranca) **[Salió 2025 b4]** |
| `systemctl disable nginx` | Quita el arranque automático |
| `systemctl is-active` / `is-enabled` | Consultas rápidas para scripts |
| `systemctl mask nginx` | Impide arrancarlo incluso a mano |
| `systemctl list-units --type=service --state=running` | Servicios en ejecución |
| `systemctl daemon-reload` | Recarga tras editar ficheros `.service` |
| `journalctl -u nginx -f` | Log del servicio en tiempo real |

El comando clásico `service nginx restart` (SysV) sigue funcionando como envoltorio.

Niveles de ejecución SysV y su *target* equivalente en systemd:

| Runlevel | Significado | Target systemd |
|---|---|---|
| 0 | Apagar | `poweroff.target` |
| 1 (S) | Monousuario, mantenimiento | `rescue.target` |
| 2 | Multiusuario sin red (en Red Hat) | `multi-user.target` |
| 3 | Multiusuario con red, modo texto | `multi-user.target` |
| 4 | No definido | `multi-user.target` |
| 5 | Multiusuario gráfico | `graphical.target` |
| 6 | Reiniciar | `reboot.target` |

```bash
init 3                                # pasar al nivel 3 (2017)
telinit 3                             # equivalente
systemctl isolate multi-user.target   # forma systemd
systemctl get-default                 # target de arranque
runlevel                              # nivel anterior y actual
who -r                                # nivel actual (2017)
```

Apagado:

```bash
shutdown -h now        # apagar ya (-P también apaga)
shutdown -r +10 "Mantenimiento"   # reiniciar en 10 minutos con aviso
shutdown -c            # cancelar un shutdown pendiente (2015 b4)
reboot ; poweroff ; halt
```

### 2.11 Tareas programadas: cron y at

**crontab** tiene cinco campos de tiempo seguidos del comando:

```text
┌ minuto (0-59)
│ ┌ hora (0-23)
│ │ ┌ día del mes (1-31)
│ │ │ ┌ mes (1-12)
│ │ │ │ ┌ día de la semana (0-7; 0 y 7 = domingo)
│ │ │ │ │
0 5 8 11 *  /usr/local/bin/tarea.sh
```

`0 5 8 11 *` se ejecuta **a las 05:00 del 8 de noviembre**. **[Salió 2025]** El truco está en el orden: minuto, hora, día, mes, día de la semana. Los distractores daban "00:05" y "11 de agosto".

| Expresión | Significado |
|---|---|
| `*/15 * * * *` | Cada 15 minutos |
| `0 2 * * *` | Todos los días a las 02:00 |
| `30 8 * * 1-5` | De lunes a viernes a las 08:30 |
| `0 0 1 * *` | El día 1 de cada mes a medianoche |
| `0 9,14 * * *` | A las 09:00 y a las 14:00 |
| `@reboot` | Al arrancar |
| `@daily`, `@weekly`, `@monthly` | Atajos |

```bash
crontab -e        # editar el crontab del usuario
crontab -l        # listar
crontab -r        # borrar (¡sin confirmación!)
crontab -u ana -l # el de otro usuario (root)
```

Ficheros del sistema: `/etc/crontab` y `/etc/cron.d/*` llevan un **sexto campo con el usuario**. También existen `/etc/cron.daily/`, `/etc/cron.hourly/`, etc. Acceso: `/etc/cron.allow` y `/etc/cron.deny`. Alternativa moderna: *timers* de systemd (`systemctl list-timers`).

`at 22:00` ejecuta una tarea **una sola vez**. `atq` lista y `atrm` borra.

**watch** repite un comando periódicamente (cada 2 s por defecto) y `-d` resalta cambios. **[Salió 2016 b4]**

```bash
watch -d 'ls -l -R /var/www/ | fgrep www-data'
watch -n 5 df -h
```

### 2.12 Paquetes en Debian/Ubuntu: apt, apt-get, apt-cache, dpkg

**APT** (*Advanced Package Tool*) lo creó el **proyecto Debian**. **[Salió 2017]** Trabaja con paquetes `.deb` y resuelve dependencias descargándolas de **repositorios**. Los repositorios son servidores con paquetes y sus índices; el administrador decide cuáles usar. **[Salió 2015, 2016]**

Fuentes: `/etc/apt/sources.list` y `/etc/apt/sources.list.d/`. Desde Debian 12-13 y Ubuntu 24.04 se usa el formato *deb822* (ficheros `.sources`).

| Orden apt (moderna) | Equivalente clásico | Efecto |
|---|---|---|
| `apt update` | `apt-get update` | **Descarga los índices** de paquetes de todas las fuentes. No instala nada **[Salió 2019]** |
| `apt upgrade` | `apt-get upgrade` | Actualiza lo instalado sin quitar paquetes |
| `apt full-upgrade` | `apt-get dist-upgrade` | Actualiza aunque haya que instalar o quitar paquetes **[Salió 2015 b4]** |
| `apt install pkg` | `apt-get install pkg` | Instala **[Salió 2018 b4]** |
| `apt remove pkg` | `apt-get remove pkg` | Desinstala, **conserva la configuración** |
| `apt purge pkg` | `apt-get purge pkg` | Desinstala **y borra la configuración** **[Salió 2016 b4]** |
| `apt autoremove` | `apt-get autoremove` | Quita dependencias que ya nadie usa |
| `apt search salt` | `apt-cache search salt` | Busca paquetes disponibles **[Salió 2018 b4]** |
| `apt show tzdata` | `apt-cache show tzdata` | Información del paquete **[Salió 2016 b4]** |
| `apt list --installed` | `dpkg -l` | Lista instalados |
| `apt policy nginx` | `apt-cache policy nginx` | Versión instalada y candidata |
| `apt clean` | `apt-get clean` | Vacía la caché de `.deb` descargados |

Actualizar un servidor Debian completo: **`apt-get update; apt-get dist-upgrade`**. **[Salió 2015 b4]** Primero se actualizan índices y luego paquetes.

**dpkg** es la herramienta de bajo nivel: instala `.deb` sueltos y no resuelve dependencias.

| Orden | Efecto |
|---|---|
| `dpkg -i paquete.deb` | Instala un fichero `.deb` |
| `dpkg -r pkg` / `dpkg -P pkg` | Elimina / purga |
| `dpkg -l` | Lista paquetes con estado (`ii` = instalado) |
| `dpkg -s pkg` | Estado y versión instalada |
| `dpkg -L pkg` | Ficheros que instaló el paquete |
| `dpkg -S /ruta` | Qué paquete contiene ese fichero |
| `dpkg --get-selections` | Lista de paquetes y estado de selección **[Salió 2016 b4]** |
| `dpkg --show pkg` | Nombre y versión instalada (`dpkg-query -W`) |
| `dpkg-reconfigure pkg` | Vuelve a lanzar la configuración |

```bash
dpkg --get-selections | grep tomcat   # ¿está instalado Tomcat? (2016 b4)
dpkg --show nginx                     # versión instalada de nginx (2018 b4)
dpkg -l | grep openssh
```

Paquete curioso: **popularity-contest** envía anónimamente a Debian estadísticas de los paquetes más usados. **[Salió 2017 b4]**

Instalar y desinstalar no requiere borrar ficheros a mano: los gestores también desinstalan. Tampoco obligan a estar conectado: se puede instalar desde DVD o desde un `.deb` local.

### 2.13 Paquetes en Red Hat y otras familias

| Familia | Formato | Bajo nivel | Alto nivel |
|---|---|---|---|
| Debian, Ubuntu | `.deb` | `dpkg` | `apt`, `apt-get`, `aptitude` |
| RHEL, Fedora, Rocky, Alma | `.rpm` | `rpm` | `dnf` (sustituye a `yum` desde RHEL 8) |
| SUSE, openSUSE | `.rpm` | `rpm` | `zypper` |
| Arch | `.pkg.tar.zst` | | `pacman` |
| Universales | Snap, Flatpak, AppImage | | `snap`, `flatpak` |

```bash
rpm -ivh paquete.rpm   # instalar (i), verbose, barra de progreso (h)
rpm -Uvh paquete.rpm   # actualizar
rpm -e paquete         # borrar
rpm -qa | grep httpd   # consultar todos los instalados
rpm -qi httpd          # información; -ql ficheros; -qf /ruta qué paquete
dnf install httpd ; dnf update ; dnf remove httpd ; dnf search ; dnf info
```

### 2.14 Información del sistema: uname, lsb_release, hostname, free

| Comando | Muestra |
|---|---|
| `uname -r` | **Versión del kernel** (p. ej. `6.8.0-45-generic`) **[Salió 2024 b4]** |
| `uname -a` | Todo: nombre del kernel, host, versión, arquitectura |
| `uname -n` | **Nombre de la máquina** (no la versión del SO) **[Salió 2017 b4]** |
| `uname -m` | Arquitectura (`x86_64`) |
| `uname -s` / `-o` | Nombre del kernel (`Linux`) / del SO (`GNU/Linux`) |
| `lsb_release -a` | Distribución y versión (Debian, Ubuntu) **[Salió 2018]** |
| `cat /etc/os-release` | Distribución y versión; estándar en todas |
| `cat /etc/*release` | Todos los ficheros release |
| `cat /etc/issue` | Texto previo al login, suele incluir la versión |
| `cat /etc/debian_version` | Versión de Debian |
| `cat /etc/redhat-release` | **Versión de RHEL** **[Salió 2019 b4]** |
| `hostname` | **Nombre de la máquina** **[Salió 2018 b4]** |
| `hostnamectl` | Nombre, SO, kernel; `set-hostname` lo cambia |
| `free -h` | **Memoria** libre y usada **[Salió 2016 b4]** |
| `cat /proc/meminfo` | Detalle de memoria |
| `cat /proc/cpuinfo` | **Datos del procesador**, incluidos flags como `nx` (protección frente a desbordamientos) **[Salió 2016 b4]** |
| `lscpu`, `lspci`, `lsusb`, `dmidecode` | Hardware |
| `dmesg` | Mensajes del kernel (arranque, hardware) |
| `date`, `timedatectl` | Fecha, hora y zona horaria (paquete `tzdata`) |

### 2.15 Módulos del kernel

| Comando | Uso |
|---|---|
| `modprobe mod` | **Carga** un módulo con sus dependencias **[Salió 2016]** |
| `modprobe -r mod` | **Descarga** un módulo (por eso modprobe "añade o elimina") |
| `lsmod` | Lista módulos cargados |
| `insmod` / `rmmod` | Carga / descarga sin resolver dependencias |
| `modinfo mod` | Información del módulo |

### 2.16 Red en Linux: ip, ss, nc, nmap

El paquete **net-tools** (`ifconfig`, `netstat`, `route`, `arp`) está obsoleto y no viene por defecto. Lo sustituye **iproute2** (`ip`, `ss`). **[Salió 2018 b4]**

| Clásico (net-tools) | Moderno (iproute2) | Uso |
|---|---|---|
| `ifconfig` | `ip address` (`ip a`) | Ver IPs **[Salió 2018 b4]** |
| `ifconfig eth0 up` | `ip link set eth0 up` | Levantar interfaz |
| `ifconfig eth0 promisc` | `ip link set eth0 promisc on` | Modo promiscuo **[Salió 2015 b4]** |
| `route -n` | `ip route` (`ip r`, `ip route show`) | Tabla de rutas **[Salió 2025 b4]** |
| `route add -net ... gw ...` | `ip route add 10.0.5.0/24 via 10.0.5.150` | Añadir ruta |
| `arp -a` | `ip neigh` | Caché ARP |
| `arp -d IP` | `ip neigh flush all` | Borrar entradas ARP **[Salió 2022 b4]** |
| `netstat -tulpn` | `ss -tulpn` | Puertos en escucha y proceso |
| `netstat -r` / `-i` | `ip route` / `ip -s link` | Rutas / estadísticas de interfaces |

Si se quiere usar `ifconfig` en Debian: `apt install net-tools`. **[Salió 2018 b4]** `ifconfig eth0 -promisc` desactiva el modo promiscuo.

Salida antigua de `ifconfig`: aparece una entrada por interfaz (`eth0`, `eth1`...) más `lo` (bucle local, no es una tarjeta). El campo `Metric` es el coste de la interfaz para el encaminamiento; Linux lo ignora en la práctica. **[Salió 2007 b4]**

```bash
ss -tulpn                       # t=TCP u=UDP l=escucha p=proceso n=numérico
ss -ltn                         # puertos TCP en escucha, numéricos (2025 b4)
ss -ltn | grep 3306             # ¿escucha MySQL?
nc -v 10.0.4.22 422             # ¿puerto remoto abierto? (2019 b4)
nc -zv servidor 20-25           # escanear rango sin enviar datos
nmap -sT -p 1-1024 servidor     # puertos abiertos (2019)
ping -c 4 8.8.8.8 ; traceroute host ; dig dominio ; nslookup dominio
curl -I https://sede.example.es ; wget URL
```

Para saber qué puertos tiene abiertos un servidor: **nmap** (desde fuera) o `ss`/`netstat` (desde dentro). **[Salió 2019]** `ntpq` es de NTP y `traceroute` muestra saltos.

Cortafuegos: `ufw` (Ubuntu), `firewall-cmd` (RHEL, firewalld), `iptables` y su sucesor `nftables` (`nft`).

Ficheros de red: `/etc/hosts` (resolución local), `/etc/resolv.conf` (servidores DNS), `/etc/hostname`, `/etc/network/interfaces` (Debian clásico), Netplan `/etc/netplan/*.yaml` (Ubuntu), NetworkManager `nmcli`.

### 2.17 Registros (logs)

| Fichero | Contenido |
|---|---|
| `/var/log/auth.log` | Autenticaciones en Debian/Ubuntu: sudo, SSH, `Invalid user` **[Salió 2016 b4]** |
| `/var/log/secure` | Lo mismo en RHEL |
| `/var/log/syslog` | Log general en Debian/Ubuntu |
| `/var/log/messages` | Log general en RHEL |
| `/var/log/kern.log` | Mensajes del kernel |
| `/var/log/dpkg.log` | Instalaciones de paquetes |
| `/var/log/apache2/` / `/var/log/httpd/` | Apache en Debian / RHEL |
| `/var/log/wtmp`, `btmp` | Accesos y fallos (se leen con `last` y `lastb`) |

`journalctl` consulta el diario de systemd: `-u servicio`, `-f` seguir, `-b` desde el arranque, `--since "1 hour ago"`, `-p err`. La rotación se configura en `/etc/logrotate.conf` y `/etc/logrotate.d/`.

### 2.18 Impresión

| Comando | Uso |
|---|---|
| `lpr fichero` | Envía a imprimir |
| `lpq` | Ver la cola |
| `lprm` | **Borra trabajos de la cola** **[Salió 2016 b4]** |
| `lpstat -t`, `cancel` | Equivalentes de CUPS (System V) |

## 3. Scripts de shell (bash)

### 3.1 Estructura de un script

```bash
#!/bin/bash
# copia.sh: copia de seguridad diaria de /etc
DESTINO="/backup"
FECHA=$(date +%F)
if [ ! -d "$DESTINO" ]; then
    mkdir -p "$DESTINO"
fi
tar -czf "$DESTINO/etc-$FECHA.tar.gz" /etc 2>/dev/null
if [ $? -eq 0 ]; then
    echo "Copia correcta"
else
    echo "Error en la copia" >&2
    exit 1
fi
```

- La primera línea (*shebang*) indica el intérprete.
- Se ejecuta con `chmod +x copia.sh` y `./copia.sh`, o con `bash copia.sh`.
- `source copia.sh` o `. copia.sh` lo ejecuta **en la shell actual** (las variables quedan definidas).
- Las variables se asignan **sin espacios** (`A=1`) y se leen con `$A`.

### 3.2 Variables especiales

| Variable | Contenido |
|---|---|
| `$0` | Nombre del script |
| `$1` ... `$9`, `${10}` | Argumentos posicionales |
| `$#` | Número de argumentos |
| `$@` / `$*` | Todos los argumentos |
| `$?` | Código de salida del último comando (0 = éxito) |
| `$$` | PID de la shell actual |
| `$!` | PID del último proceso en segundo plano |
| `$PWD` | **Directorio actual** **[Salió 2017 b4]** |
| `$HOME`, `$USER`, `$PATH`, `$SHELL` | Entorno: home, usuario, rutas de búsqueda, shell |
| `$BASHPID`, `$RANDOM`, `$HOSTNAME` | Otras internas de bash |

`export VAR=valor` hace que la variable pase a los procesos hijos. `env` y `printenv` muestran el entorno.

### 3.3 Operadores de control, redirecciones y tuberías

| Operador | Significado |
|---|---|
| `a ; b` | Ejecuta a y después b, siempre |
| `a && b` | b solo si a **termina bien** (código 0) |
| `a \|\| b` | b solo si a **falla** |
| `a &` | a en segundo plano |
| `a \| b` | La salida de a es la entrada de b (tubería) |
| `> f` | Redirige la salida a f, **sobrescribiendo** |
| `>> f` | Añade al final de f |
| `2> f` | Redirige los errores |
| `2>&1` | Errores al mismo sitio que la salida |
| `&> f` | Salida y errores a f |
| `< f` | Lee la entrada de f |
| `<< FIN` | *Here document* |

`false && echo "Hola"`: `false` existe y devuelve 1, así que **echo no se ejecuta**. **[Salió 2015 b4]** Con `false || echo "Hola"` sí se imprimiría.

Comillas:

- `'simples'`: todo literal, no expande variables.
- `"dobles"`: expande `$VAR` y `$(...)`.
- `` `cmd` `` o `$(cmd)`: sustitución de comandos.
- `$(( 3 + 4 ))`: aritmética entera.

### 3.4 Historial y atajos

| Atajo | Efecto |
|---|---|
| `!!` | **Repite el último comando** **[Salió 2015 b4]** |
| `sudo !!` | Repite el último con sudo |
| `!n` / `!texto` | Repite el comando n del historial / el último que empieza por texto |
| `history` | Lista el historial (`~/.bash_history`) |
| `Ctrl+R` | Búsqueda inversa en el historial |
| `Ctrl+C` / `Ctrl+Z` / `Ctrl+D` | Interrumpir / suspender / fin de entrada |
| `alias ll='ls -l'` | Crea un alias; se hace permanente en `~/.bashrc` |

### 3.5 Condiciones y bucles

| Test | Verdadero si |
|---|---|
| `-f f` / `-d d` / `-e x` | Existe fichero / directorio / cualquier cosa |
| `-r`, `-w`, `-x` | Legible, escribible, ejecutable |
| `-s f` | Existe y no está vacío |
| `-z "$v"` / `-n "$v"` | Cadena vacía / no vacía |
| `"$a" = "$b"`, `!=` | Comparación de cadenas |
| `-eq -ne -lt -le -gt -ge` | Comparación numérica |

```bash
for f in /var/log/*.log; do
    gzip "$f"
done

i=1
while [ $i -le 5 ]; do
    echo "Vuelta $i"; i=$((i+1))
done

case "$1" in
    start) systemctl start nginx ;;
    stop)  systemctl stop nginx ;;
    *)     echo "Uso: $0 start|stop" ;;
esac

read -p "Usuario: " NOMBRE
```

Buenas prácticas: `set -e` (para al primer error), `set -u` (error con variables no definidas), comillas alrededor de las variables, `exit` con código explícito.

Otras shells: `sh` (Bourne, POSIX), `bash` (Bourne Again, la habitual), `zsh` (por defecto en macOS), `ksh`, `csh`/`tcsh`, `dash` (es `/bin/sh` en Debian).

## 4. El editor vi / vim

vi tiene tres modos: **comandos** (normal, al abrir), **inserción** y **línea de órdenes** (los `:`). `Esc` vuelve siempre al modo comandos.

| Tecla | Efecto |
|---|---|
| `i` / `a` / `o` | Insertar antes del cursor / después / en línea nueva debajo |
| `dd` | **Borra la línea actual** **[Salió 2016]** |
| `x` | Borra el carácter bajo el cursor |
| `dw` | Borra una palabra |
| `yy` / `p` | Copia la línea / pega |
| `u` | **Deshace la última acción** **[Salió 2016]** |
| `Ctrl+R` | Rehace |
| `/texto`, `n` | Busca y salta a la siguiente coincidencia |
| `gg` / `G` | Principio / final del fichero |
| `:w` | Guarda |
| `:q` | Sale (si no hay cambios) |
| `:wq`, `:x`, `ZZ` | Guarda y sale |
| `:q!` | **Sale sin guardar** **[Salió 2015]** |
| `:%s/viejo/nuevo/g` | Sustituye en todo el fichero |
| `:set number` | Muestra números de línea |

Otros editores de consola: `nano` (sencillo, `Ctrl+O` guarda, `Ctrl+X` sale), `joe`, `emacs`.

## 5. Windows: símbolo del sistema (cmd)

Los comandos de cmd no distinguen mayúsculas y usan opciones con barra (`/all`). La mayoría también funcionan dentro de PowerShell.

### 5.1 Red: ipconfig, route, netstat, arp

| Comando | Efecto |
|---|---|
| `ipconfig` | IP, máscara y puerta de enlace |
| `ipconfig /all` | Todo: MAC, DHCP, DNS, concesión |
| `ipconfig /flushdns` | **Vacía la caché DNS** **[Salió 2019 b4, 2022 b4]** |
| `ipconfig /displaydns` | Muestra la caché DNS |
| `ipconfig /registerdns` | Vuelve a registrar el equipo en DNS |
| `ipconfig /release` / `/renew` | Libera / renueva la IP por DHCP |
| `route print` | **Tabla de enrutamiento** (igual que `netstat -r`) **[Salió 2022 b4]** |
| `route add 10.17.4.0 mask 255.255.255.0 192.168.1.1` | Añade una ruta **[Salió 2008 b4]** |
| `route -p add ...` | Ruta **persistente** (sobrevive al reinicio) |
| `route delete 10.17.4.0` | Borra la ruta |
| `netstat -ano` | Conexiones y puertos con el PID propietario |
| `arp -a` / `arp -d *` | Ver / borrar la caché ARP |
| `ping -t`, `tracert`, `pathping` | Conectividad, saltos, pérdidas por salto |
| `nslookup` | Consultas DNS |
| `netsh` | Configuración avanzada de red y cortafuegos |

Trampas: en Windows es `ipconfig` y `tracert`. En Linux, `ifconfig`/`ip` y `traceroute`. `ipconfig /dnsflush` y `/cleardns` no existen.

### 5.2 Usuarios, servicios y procesos: net, sc, tasklist

| Comando | Efecto |
|---|---|
| `net user` | Lista usuarios locales |
| `net user Infocentro` | **Información de ese usuario** (último acceso, grupos, caducidad) **[Salió 2022 b4]** |
| `net user ana Clave1! /add` | Crea usuario |
| `net localgroup` | Lista grupos locales |
| `net localgroup administradores` | **Miembros del grupo Administradores** (en Windows en español) **[Salió 2019 b4]** |
| `net localgroup administradores ana /add` | Añade al grupo |
| `net accounts` | **Políticas de cuentas y contraseñas** (longitud mínima, caducidad, bloqueo) **[Salió 2019 b4]** |
| `net start` | Sin argumentos, **lista los servicios en ejecución** **[Salió 2019]** |
| `net start servicio` / `net stop servicio` | Arranca / para un servicio |
| `net use Z: \\srv\carpeta` | Conecta una unidad de red |
| `net share` | Recursos compartidos |
| `net view` | Equipos o recursos de la red |
| `sc query` | Estado de los servicios; `sc start`, `sc stop`, `sc config` |
| `tasklist` | **Procesos en ejecución**, local o remoto con `/s equipo` **[Salió 2018 b4]** |
| `taskkill /PID 1234 /F` | Mata un proceso; `/IM nombre.exe` por nombre |
| `whoami`, `hostname` | Usuario y nombre del equipo |
| `systeminfo` | Versión de Windows, parches, memoria |
| `winver` | Ventana con la versión de Windows |
| `shutdown /s /t 0`, `/r`, `/a` | Apagar, reiniciar, **abortar** un apagado |
| `schtasks` | Tareas programadas desde consola |
| `gpupdate /force` | Reaplica las directivas de grupo |
| `gpresult /r` | Directivas aplicadas al usuario y equipo |
| `iisreset` | **Reinicia IIS** (`/stop`, `/start`, `/status`) **[Salió 2022 b4]** |

### 5.3 Ficheros y disco

| Comando | Efecto |
|---|---|
| `dir` | Lista ficheros (`/s` recursivo, `/a` ocultos) |
| `cd`, `md`, `rd /s` | Cambiar, crear, borrar directorio |
| `copy`, `xcopy /e`, `robocopy origen destino /MIR` | Copiar; robocopy es robusto y sincroniza |
| `move` | Mover |
| `ren *.gz *.rar` | **Renombrar**, admite comodines **[Salió 2018 b4]** |
| `del`, `type`, `findstr` | Borrar, mostrar, buscar texto (como grep) |
| `attrib +h f` | Atributos (oculto, solo lectura, sistema) |
| `icacls` | Permisos NTFS |
| `chkdsk C: /f /r` | Comprueba y repara el disco (`/f` corrige, `/r` sectores) |
| `sfc /scannow` | **Examina los ficheros protegidos del sistema y sustituye los dañados por una copia en caché** **[Salió 2024]** |
| `DISM /Online /Cleanup-Image /RestoreHealth` | Repara la imagen de Windows que usa sfc |
| `diskpart` | Particionado interactivo |
| `format`, `convert D: /fs:ntfs` | Formatear, convertir FAT a NTFS |
| `bcdedit`, `bootrec` | Gestor de arranque |
| `cipher`, `manage-bde` | Cifrado EFS, BitLocker |

Orden de reparación recomendado: primero `DISM ... /RestoreHealth` y después `sfc /scannow`.

### 5.4 Consolas y herramientas gráficas (Win+R)

| Escribir | Abre |
|---|---|
| `eventvwr` (`eventvwr.msc`) | **Visor de eventos** **[Salió 2016 b4]** |
| `services.msc` | Servicios |
| `compmgmt.msc` | Administración de equipos |
| `devmgmt.msc` | Administrador de dispositivos |
| `diskmgmt.msc` | Administración de discos |
| `lusrmgr.msc` | Usuarios y grupos locales |
| `gpedit.msc` / `secpol.msc` | Directiva de grupo local / directiva de seguridad local |
| `taskschd.msc` | Programador de tareas |
| `perfmon`, `resmon` | Monitor de rendimiento, monitor de recursos |
| `taskmgr` | Administrador de tareas |
| `regedit` | Editor del registro |
| `msconfig` | Configuración del sistema (arranque) |
| `msinfo32` | Información del sistema |
| `appwiz.cpl`, `ncpa.cpl` | Programas instalados, conexiones de red |
| `dsa.msc` | Usuarios y equipos de Active Directory (servidor) |

**Windows Update** es el componente que mantiene actualizado el sistema. **[Salió 2017]** En empresa se centraliza con WSUS, Intune o Configuration Manager (SCCM). Windows Defender es el antivirus y Edge el navegador.

### 5.5 El registro de Windows

Base de datos jerárquica de configuración. Raíces (*hives*):

| Clave | Contenido |
|---|---|
| `HKEY_LOCAL_MACHINE` (HKLM) | Configuración del equipo para todos |
| `HKEY_CURRENT_USER` (HKCU) | Configuración del usuario conectado |
| `HKEY_USERS` (HKU) | Perfiles de todos los usuarios cargados |
| `HKEY_CLASSES_ROOT` (HKCR) | Asociaciones de ficheros y COM |
| `HKEY_CURRENT_CONFIG` (HKCC) | Perfil de hardware actual |

Programas que arrancan al iniciar sesión: `HKLM\Software\Microsoft\Windows\CurrentVersion\Run` (todos los usuarios) y `HKCU\Software\Microsoft\Windows\CurrentVersion\Run` (el usuario). `RunOnce` se ejecuta una sola vez. **[Salió 2008]** Desde Windows 10, también la pestaña Inicio del Administrador de tareas.

## 6. Windows PowerShell y PowerShell 7

### 6.1 Conceptos

- Los comandos se llaman **cmdlets** y siguen la forma **Verbo-Nombre** (`Get-Service`). **[Salió 2015]**
- Trabaja con **objetos .NET**, no con texto. La tubería pasa objetos.
- Scripts con extensión `.ps1`. La directiva de ejecución (`Get-ExecutionPolicy`) es `Restricted` por defecto en clientes Windows y `RemoteSigned` en Windows Server.
- **Windows PowerShell 5.1** viene con Windows y usa .NET Framework.
- **PowerShell 7** (antes PowerShell Core, ejecutable `pwsh`) es **open source** (licencia MIT), usa .NET moderno y funciona en **Windows, Linux y macOS**. **[Salió 2018]**
- Gestiona también IIS, Exchange, Active Directory, Azure, etc., mediante módulos.
- Hay alias de estilo Unix y cmd: `ls`, `dir`, `cd`, `cat`, `ps`, `cp`, `rm`.

### 6.2 Cmdlets más preguntados

| Cmdlet | Uso |
|---|---|
| `Get-Help Get-Process` | **Ayuda** de otros cmdlets (`-Examples`, `-Full`, `Update-Help`) **[Salió 2016 b4]** |
| `Get-Command` | Lista cmdlets disponibles |
| `Get-Member` | Propiedades y métodos de un objeto |
| `Get-Process` | **Procesos** del equipo **[Salió 2018 b4]** |
| `Stop-Process -Name notepad` | Mata procesos |
| `Get-Service` | **Servicios** del equipo **[Salió 2017 b4]** |
| `Start-Service`, `Stop-Service`, `Restart-Service` | Gestión de servicios |
| `Set-Service -StartupType Automatic` | Tipo de inicio |
| `Get-History` | **Historial de comandos** de la sesión **[Salió 2017 b4]** |
| `Get-ChildItem` | Listar ficheros (alias `ls`, `dir`, `gci`) |
| `Copy-Item "carpeta" -Destination "destino" -Recurse` | **Copiar carpeta con contenido** **[Salió 2018 b4]** y **[Salió 2025 b4]** (`-Path "C:\DirectorioA\*"`) |
| `Move-Item`, `Remove-Item`, `Rename-Item`, `New-Item` | Mover, borrar, renombrar, crear |
| `Get-Content f -Tail 10 -Wait` | Ver fichero (equivale a `tail -f`) |
| `Select-String` | Buscar texto (como grep) |
| `Where-Object`, `Select-Object`, `Sort-Object`, `ForEach-Object` | Filtrar, elegir columnas, ordenar, iterar |
| `Get-WmiObject Win32_Product` | **Software instalado con Windows Installer (MSI)** **[Salió 2017 b4]**. Hoy se prefiere `Get-CimInstance` |
| `Get-AppxPackage -AllUsers` | **Aplicaciones Appx** (Tienda) de todos los usuarios **[Salió 2016 b4]** |
| `Get-WinEvent`, `Get-EventLog` | Leer el registro de eventos |
| `Clear-DnsClientCache` | Vaciar caché DNS (equivale a `ipconfig /flushdns`) |
| `Get-NetIPAddress`, `Get-NetIPConfiguration` | Configuración IP |
| `Get-NetRoute` | Tabla de rutas |
| `Test-NetConnection srv -Port 443` | Prueba de puerto (como `nc -v`) |
| `Resolve-DnsName` | Consulta DNS |
| `Get-LocalUser`, `Get-LocalGroupMember Administradores` | Usuarios y grupos locales |
| `Get-ComputerInfo` | Información del sistema |
| `Restart-Computer`, `Stop-Computer` | Reiniciar, apagar |
| `Install-WindowsFeature` | Roles y características en Windows Server |
| `Invoke-Command`, `Enter-PSSession` | Ejecución remota (WinRM) |

```powershell
Get-Service | Where-Object Status -eq 'Running'
Get-Process | Sort-Object CPU -Descending | Select-Object -First 5
Get-ChildItem C:\Logs -Recurse -Filter *.log | Where-Object LastWriteTime -lt (Get-Date).AddDays(-30) | Remove-Item
```

Distractores típicos que **no existen**: `Get-InstalledSoftware`, `Get-InstalledServices`, `Get-List-Process`, `Copy-Directory`, `Get-PackageAppx`, `cmdlet-Help`, `Get-Last`.

## 7. Sistemas de ficheros

| Sistema | Plataforma | Notas |
|---|---|---|
| FAT32 | Universal | Ficheros de 4 GB como máximo; Windows solo lo formatea hasta 32 GB desde la interfaz clásica |
| **exFAT** | Windows y macOS nativo, Linux (kernel 5.4+) | Para memorias y discos externos de más de 32 GB, sin límite de 4 GB **[Salió 2025]** |
| NTFS | Windows | Permisos ACL, cifrado EFS, cuotas, diario. macOS solo lo lee |
| ReFS | Windows Server | Resiliente, para grandes volúmenes; no arranca el sistema |
| APFS | macOS, iOS | Por defecto desde macOS 10.13; Windows no lo lee de forma nativa |
| HFS+ | macOS antiguo | Sustituido por APFS |
| ext4 | Linux | Por defecto en Debian y Ubuntu; con diario |
| XFS | Linux | Por defecto en RHEL 7 en adelante |
| Btrfs | Linux | Instantáneas, por defecto en openSUSE y Fedora |
| ZFS | Solaris, FreeBSD, Linux | Gestor de volúmenes integrado |

## 8. Software de base y servicios típicos

### 8.1 Servidores web y de aplicaciones

**Apache httpd** (paquete `apache2` en Debian, `httpd` en RHEL).

```bash
a2enmod rewrite            # activar el módulo rewrite (2015 b4)
a2dismod status            # desactivar un módulo
a2ensite intranet.conf     # activar un sitio (VirtualHost)
a2dissite 000-default
apache2ctl configtest      # comprobar sintaxis (también apachectl -t)
systemctl reload apache2
```

Para servir varios dominios en el mismo servidor se usa la directiva **`<VirtualHost>`** (hosts virtuales por nombre). **[Salió 2022 b4]**

```apache
<VirtualHost *:80>
    ServerName intranet.sgi.es
    DocumentRoot /var/www/intranet
</VirtualHost>
<VirtualHost *:80>
    ServerName otro.sgi.es
    DocumentRoot /var/www/otro
</VirtualHost>
```

**ab** (*Apache Bench*, paquete `apache2-utils`) mide rendimiento, como peticiones por segundo: `ab -n 1000 -c 10 http://192.168.0.100/`. **[Salió 2015 b4]**

| Software | Comandos o datos clave |
|---|---|
| nginx | `nginx -t` (sintaxis), `nginx -v` (versión), `nginx -s reload`; `/etc/nginx/sites-available` |
| IIS | `iisreset`; consola `inetmgr`; servidor web de Windows |
| Tomcat | Contenedor de servlets Java; puerto HTTP 8080, apagado 8005, AJP 8009 |
| PHP-FPM, Node.js | Servidores de aplicación detrás de nginx o Apache |

### 8.2 Compartición de ficheros: Samba

**Samba** es la implementación libre de **SMB/CIFS** para Unix/Linux. **[Salió 2008]** Permite compartir ficheros e impresoras con Windows y actuar como controlador de dominio. Configuración en `/etc/samba/smb.conf`; `testparm` valida y `smbpasswd -a` crea usuarios Samba. Puertos: 445/TCP (SMB directo) y 137-139 (NetBIOS).

Nubes privadas de ficheros instalables en el CPD, alternativa a Dropbox: **ownCloud** y **Nextcloud** (bifurcación de 2016). **[Salió 2015 b4]**

### 8.3 Gestión de configuración y monitorización

| Herramienta | Clave |
|---|---|
| **Salt (SaltStack)** | Modelo master-minion. Puertos **4505** (publicación) y **4506** (retorno) **[Salió 2016 b4]**. `salt '*' test.ping`, `salt '*' disk.usage` **[Salió 2018 b4]**, `salt-cp '*' fichero.txt /tmp` **[Salió 2018 b4]**, `salt '*' cmd.run 'uptime'` |
| Ansible | Sin agente, por SSH. Playbooks en YAML; inventario de hosts; `ansible all -m ping` |
| Puppet | Agente y servidor (puerto 8140); lenguaje declarativo propio |
| Chef | Recetas en Ruby |
| Zabbix | Monitorización; agente 10050, servidor 10051 |
| Nagios | Monitorización con plugins y alertas |
| Prometheus y Grafana | Métricas y paneles |

## Trampas y respuestas desactualizadas

- **ifconfig, netstat, route y arp (net-tools)** están obsoletos en Linux. Preguntas de 2007 y 2015 b4 con `ifconfig` siguen siendo correctas, pero hoy se pregunta `ip` y `ss` (2018 b4).
- **Niveles de ejecución** (`init 3`, 2017): siguen funcionando por compatibilidad, pero systemd usa *targets*. Si sale "`systemctl isolate multi-user.target`", es equivalente.
- **`apt-get dist-upgrade`** (2015 b4) hoy se llama también `apt full-upgrade`. Ambas válidas.
- **yum** fue sustituido por **dnf** en RHEL 8. RHEL 10 salió en 2025.
- **`Get-WmiObject`** (2017 b4) no existe en PowerShell 7; se usa `Get-CimInstance`. Además, `wmic` está obsoleto y Windows 11 lo está retirando.
- **PowerShell Core** (2018) se llama ahora simplemente **PowerShell 7**. La afirmación correcta sigue siendo "open source y disponible para Linux y macOS".
- **Windows 10** dejó de tener soporte el 14 de octubre de 2025. Los comandos preguntados valen igual en Windows 11.
- **Ficheros de log**: `/var/log/auth.log` es Debian/Ubuntu; en RHEL es `/var/log/secure`. En sistemas con solo journald puede no existir y se usa `journalctl`.
- **Opción del patrón y el fichero en grep**: `grep -c PATRÓN FICHERO`. Invertirlos es el distractor (2017).
- **`head -n=10`** no es válido en GNU. En 2015 b4 la opción correcta era la rebuscada `tail -n 77 /tmp/fichero.log | head`: con un fichero de 30 líneas, `tail -n 77` devuelve todo y `head` las 10 primeras (sin verificar la plantilla oficial).
- **`chmod -r`** quita lectura; lo recursivo es `-R`. `chown o-w` es un distractor: chown no cambia permisos.
- **`apt-get remove`** conserva la configuración. Solo **`purge`** la borra (2016 b4).
- **`fsck`** se ejecuta con el sistema de ficheros **desmontado**. `checkdisk` no existe en Linux; `chkdsk` es de Windows.
- **`uname -n`** da el nombre del host, no la versión del SO (2017 b4). `uname -o` da "GNU/Linux", no la versión del kernel (2024 b4).
- **Crontab**: el orden es minuto, hora, día del mes, mes, día de la semana. Es fácil leer "0 5" como 00:05.
- **Ampliar LVM + XFS** (2025 b4 R5): el orden es LV primero y sistema de ficheros después, sin desmontar. XFS no se puede reducir ni necesita desmontarse para crecer.
- **Usuarios conectados por SSH en remoto**: `ssh u@s1 'who'`. La forma `u:s1` es sintaxis de scp, no de ssh.
- **Comandos inventados**: `checkdisk`, `getcpu`, `scancpu`, `concatenate`, `giveservername`, `pid systemd`, `apt-dist`, `ipconfig /cleardns`, `IIS RESET`. Si no te suena, descártalo.
- **2016 b4 6 (dd)**: el enunciado escaneado aparece con `/dev/zcro` y `ltmp`. Con `/dev/zero` la respuesta es 512.000 bytes. Si el origen estuviera mal escrito daría "No existe el fichero", opción que no se ofrecía.
- **Preguntas obsoletas** (2005 ej1 61, 2006 ej1 66, 2007 ej1 74): organización clásica del CPD por áreas (explotación, sistemas, desarrollo). Ya no está en el temario.
