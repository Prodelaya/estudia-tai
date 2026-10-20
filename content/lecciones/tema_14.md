# Tema 14. SGBD relacionales, orientados a objetos y NoSQL

Peso en el examen: unas 2,7 preguntas de test por convocatoria y casi ninguna en el supuesto III (0,1 de media, aunque en 2024 cayó una de niveles de aislamiento). La tendencia es al alza: en 2025 cayeron cuatro seguidas. Hay 36 preguntas históricas (2005-2025). Se concentran en cuatro bloques: transacciones y concurrencia (ACID, aislamiento, anomalías, bloqueos), reglas de Codd y arquitectura ANSI/SPARC, bases de datos orientadas a objetos (Atkinson, OID, constructores, OQL, productos) y NoSQL (tipos, productos, Cypher). El tema solapa con el 15 (modelo relacional, normalización) y el 17 (SQL).

## Cómo lo preguntan

- **"¿Cuál NO es…?"** sobre listas de productos: qué SGBD no es relacional (Knosys 2005, JSON 2017), cuál no es NoSQL (Aurora 2018), cuál es orientado a objetos (Zope 2015, Matisse 2024).
- **Reglas de Codd con una regla falsa o deformada**: "dependencia de la distribución" (2019) o "regla de la cardinalidad de las entidades" (2018).
- **Acrónimos con distractores parecidos**: ACID con "Disponibilidad", "Coherencia" o "Persistencia" (2015, 2016, 2022).
- **Matriz de aislamiento**: qué nivel evita lecturas sucias y no repetibles pero permite fantasmas (2024 supuesto).
- **Anomalías inventadas**: "lecturas hundidas" (2022).
- **Manifiesto de Atkinson**: qué característica es opcional (herencia múltiple, 2008) o cuál es falsa (tipos fijos, 2022).
- **BDOO en 2024-2025**: naturaleza de OQL, propiedades del OID, constructores de colección.
- **Producto concreto de un fabricante**: Oracle (tablespace y datafile, 2018), SQL Server Machine Learning Services y sus paquetes R (2022).
- **NoSQL**: tipos (2025), Cypher y Neo4j (2017, 2025), proyecto Hadoop para serialización (Avro, 2017).

## 1. Sistemas de gestión de bases de datos: conceptos y componentes

### 1.1 Definición y objetivos

Una **base de datos** es un conjunto de datos relacionados, almacenados con redundancia controlada y compartidos por varios usuarios y aplicaciones. Un **SGBD** (DBMS) es el software que permite definirla, construirla, manipularla y protegerla.

Objetivos clásicos de un SGBD:

- **Independencia de los datos** respecto de las aplicaciones (física y lógica).
- **Redundancia mínima** y controlada.
- **Integridad**: los datos cumplen las restricciones definidas.
- **Seguridad**: control de accesos y privilegios.
- **Concurrencia**: varios usuarios a la vez sin inconsistencias.
- **Recuperación** ante fallos (copias, diario o *log*).
- **Acceso eficiente** y consultas *ad hoc*.

Funciones de un SGBD según Codd (1982): almacenar, recuperar y actualizar datos; catálogo accesible; transacciones; control de concurrencia; recuperación; autorización; comunicación de datos; integridad; utilidades.

### 1.2 Arquitectura ANSI/X3/SPARC

El comité SPARC de ANSI/X3 propuso en 1975 (informe final 1978) una arquitectura de **tres niveles**. Su objetivo es la **independencia de los datos** **[Salió 2006]**.

| Nivel | Qué describe | Quién lo usa | Ejemplo |
|---|---|---|---|
| Externo | Vistas parciales de cada usuario o aplicación | Usuarios finales, programadores | `CREATE VIEW` |
| Conceptual | Esquema lógico global: entidades, relaciones, restricciones | Diseñador, DBA | Tablas, claves, dominios |
| Interno | Almacenamiento físico: ficheros, índices, bloques | DBA, el propio SGBD | Tablespaces, índices B+ |

- La **creación de vistas** pertenece al **nivel externo** **[Salió 2007]**.
- Los tres niveles son **interno, conceptual y externo** **[Salió 2006]**. "Sintáctico", "canónico", "de aplicación" o "intermedio" no existen **[Salió 2015]**.
- Entre niveles hay **correspondencias** (*mappings*): externo/conceptual y conceptual/interno.
- **Independencia lógica**: cambiar el esquema conceptual sin tocar los esquemas externos ni las aplicaciones.
- **Independencia física**: cambiar el esquema interno (índices, ficheros) sin tocar el conceptual.
- La independencia física es más fácil de lograr que la lógica.
- Cuidado: algunos autores llaman "nivel físico" al interno y "nivel lógico" al conceptual. "Canónico" es un término del diseño (modelo canónico), no un nivel ANSI.

### 1.3 Lenguajes del SGBD

Un SGBD debe ofrecer como mínimo un **DDL** y un **DML** **[Salió 2005]**.

| Lenguaje | Función | Sentencias SQL |
|---|---|---|
| DDL (definición) | Crear y modificar estructuras | `CREATE`, `ALTER`, `DROP`, `TRUNCATE` |
| DML (manipulación) | Consultar, insertar, borrar y modificar datos | `SELECT`, `INSERT`, `UPDATE`, `DELETE`, `MERGE` |
| DCL (control) | Permisos | `GRANT`, `REVOKE` (y `DENY` en Transact-SQL) |
| TCL (transacciones) | Control de transacciones | `COMMIT`, `ROLLBACK`, `SAVEPOINT` |

- El lenguaje para **recuperar, insertar, borrar y modificar** información es el **DML** **[Salió 2006]**.
- Algunos autores separan `SELECT` en un DQL (lenguaje de consulta).
- Elmasri distingue además SDL (almacenamiento) y VDL (vistas).
- DML **procedimental** (navegacional, registro a registro) frente a **no procedimental** o declarativo (SQL: dices qué quieres, no cómo).

Formas de trabajar con SQL en un SGBD relacional **[Salió 2006]**:

1. **Interactiva**: el usuario lanza sentencias directamente (SQL\*Plus, psql, SSMS).
2. **Embebida**: SQL dentro de un lenguaje anfitrión con precompilador (Pro\*C, SQLJ, `EXEC SQL`).
3. **Por módulos**: sentencias agrupadas en módulos o procedimientos almacenados.
4. **Dinámica y mediante API**: la sentencia se construye en ejecución (ODBC, JDBC, ADO.NET).

"Mapeadamente, transformando SQL en comandos del sistema operativo" no es una forma válida.

### 1.4 Componentes de un SGBD

- **Procesador de consultas**: analizador sintáctico (*parser*), comprobación semántica, **optimizador** (elige el plan de ejecución) y motor de ejecución.
- **Gestor de almacenamiento**: gestor de ficheros, **gestor de memoria intermedia** (*buffer*), gestor de autorización e integridad.
- **Gestor de transacciones**: control de concurrencia y recuperación (log).
- **Diccionario de datos o catálogo**: metadatos sobre tablas, columnas, usuarios, índices. En un relacional es a su vez un conjunto de tablas.
- **Utilidades**: carga, copias de seguridad, monitorización, reorganización.
- **Usuarios**: administrador (DBA), diseñadores, programadores y usuarios finales.

### 1.5 Evolución de los modelos

| Generación | Modelo | Ejemplos |
|---|---|---|
| Años 60 | Jerárquico | IBM IMS |
| Años 60-70 | En red (CODASYL) | IDMS |
| 1970 en adelante | Relacional (Codd, 1970) | Oracle, DB2, SQL Server |
| Años 80-90 | Orientado a objetos | O2, ObjectStore, Versant, Matisse |
| Años 90 | Objeto-relacional | Oracle 8, PostgreSQL, SQL:1999 |
| 2009 en adelante | NoSQL y NewSQL | MongoDB, Cassandra, Neo4j, Spanner |

## 2. SGBD relacionales

### 2.1 Elementos del modelo relacional

- **Relación**: tabla. **Tupla**: fila. **Atributo**: columna. **Dominio**: conjunto de valores válidos de un atributo.
- **Grado**: número de atributos (columnas). **Cardinalidad**: número de tuplas (filas).
- **Clave candidata**: conjunto mínimo de atributos que identifica cada tupla. **Clave primaria**: la candidata elegida.
- **Clave ajena o foránea**: atributo que **referencia la clave primaria (o una clave candidata) de otra tabla** **[Salió 2024]**. Puede repetirse y puede ser nula.
- **Integridad de entidad**: la clave primaria no puede ser nula.
- **Integridad referencial**: el valor de una clave foránea existe en la tabla referenciada o es nulo.

```sql
CREATE TABLE departamento (
  id_dep  NUMBER PRIMARY KEY,
  nombre  VARCHAR2(50) NOT NULL
);

CREATE TABLE empleado (
  id_emp  NUMBER PRIMARY KEY,
  nombre  VARCHAR2(50),
  id_dep  NUMBER REFERENCES departamento(id_dep) ON DELETE SET NULL
);
```

### 2.2 Las 12 reglas de Codd

Edgar F. Codd las publicó en 1985 en *Computerworld*. Sirven para decidir si un SGBD es "plenamente relacional". Son 13 si se cuenta la regla 0. Es lo más preguntado del bloque relacional **[Salió 2018, 2019]**.

| Nº | Regla | Idea clave |
|---|---|---|
| 0 | Fundamento | El sistema gestiona la BD solo con capacidades relacionales |
| 1 | Información | Toda la información se representa como valores en tablas |
| 2 | Acceso garantizado | Cada dato es accesible con tabla, clave primaria y columna |
| 3 | Tratamiento sistemático de nulos | Representación de valores desconocidos o no aplicables distinta de los normales |
| 4 | Catálogo dinámico en línea relacional | Los metadatos están en tablas consultables con el mismo lenguaje |
| 5 | Sublenguaje de datos completo | Un lenguaje para definición, manipulación, vistas, integridad, autorización y transacciones |
| 6 | Actualización de vistas | Las vistas teóricamente actualizables lo son en la práctica |
| 7 | Inserción, actualización y borrado de alto nivel | Operaciones sobre conjuntos de filas, no fila a fila |
| 8 | Independencia física | Cambiar el almacenamiento no afecta a las aplicaciones |
| 9 | Independencia lógica | Cambiar tablas sin perder información no afecta a las aplicaciones |
| 10 | Independencia de integridad | Las restricciones se definen en el catálogo, no en los programas |
| 11 | Independencia de distribución | Distribuir la BD en varios servidores no afecta a usuarios ni aplicaciones |
| 12 | No subversión | Un acceso de bajo nivel no puede saltarse las reglas de integridad o seguridad |

Trucos para el examen:

- Todas las de independencia hablan de **independencia**. Si una opción dice "**dependencia** de la distribución" y que la distribución "afecta" a las aplicaciones, es falsa **[Salió 2019]**.
- No existe "regla de la cardinalidad de las entidades" **[Salió 2018]**. La cardinalidad es del modelo E/R (tema 15).
- La regla 3 no obliga a usar nulos en todas partes. Exige que existan y se traten de forma sistemática.

### 2.3 Productos relacionales

| Producto | Fabricante o licencia | Notas |
|---|---|---|
| Oracle Database | Oracle | 19c (soporte largo), 23ai (2024); en octubre de 2025 Oracle anunció Oracle AI Database 26ai |
| SQL Server | Microsoft | 2022 y 2025 (disponible desde noviembre de 2025); dialecto Transact-SQL |
| Db2 | IBM | Mainframe (z/OS) y LUW |
| MySQL | Oracle (GPL) | 8.4 LTS; motor InnoDB (transaccional) frente a MyISAM (sin transacciones) |
| MariaDB | Fork de MySQL (GPL) | Usado en muchas AAPP por ser libre |
| PostgreSQL | Libre (licencia PostgreSQL) | Objeto-relacional; versión 18 publicada en septiembre de 2025 |
| Informix | IBM (antes Informix Software) | Relacional **[Salió 2005]** |
| SQLite | Dominio público | Embebida, sin servidor, un solo fichero |
| MaxDB | SAP | Relacional **[Salió 2017]** |
| Sybase ASE | SAP | Origen histórico de SQL Server |
| Firebird | Libre | Derivado de InterBase |
| Amazon Aurora | AWS | **Relacional** en la nube, compatible con MySQL y PostgreSQL **[Salió 2018]** |

No son SGBD relacionales:

- **Knosys**: gestor documental o textual (de Micronet) **[Salió 2005]**.
- **JSON**: es un formato de intercambio de datos, no un gestor **[Salió 2017]**.
- **CouchDB**: NoSQL documental. **Data warehouse** es un concepto, no un producto **[Salió 2015]**.
- **Snowflake**: almacén de datos en la nube. Habla SQL, pero se presenta como plataforma analítica, no como "el" relacional de la pregunta **[Salió 2015]**.

### 2.4 Arquitectura de Oracle

Oracle distingue **instancia** (memoria y procesos) y **base de datos** (ficheros).

Instancia:

- **SGA** (System Global Area), compartida: *buffer cache*, *shared pool* (caché de biblioteca y diccionario), *redo log buffer*, *large pool*, *Java pool*.
- **PGA** (Program Global Area), privada de cada proceso servidor.
- Procesos de fondo: **DBWn** (escribe bloques sucios a los datafiles), **LGWR** (escribe el redo log), **CKPT** (puntos de control), **SMON** (recuperación de la instancia), **PMON** (limpia procesos caídos), **ARCn** (archiva redo logs).

Ficheros físicos:

- **Datafiles**: contienen los datos. Cada datafile pertenece a **un único tablespace**.
- **Control files**: estructura física de la BD, nombres de ficheros, SCN.
- **Redo log files** (en línea y archivados): registro de cambios para recuperación.
- Además: fichero de parámetros (`spfile` o `pfile`) y fichero de contraseñas.

Estructura lógica, de mayor a menor **[Salió 2018]**:

| Unidad | Qué es |
|---|---|
| Tablespace | **Unidad lógica de almacenamiento**. Agrupa uno o varios datafiles |
| Segmento | Espacio de un objeto (tabla, índice, undo, temporal) dentro de un tablespace |
| Extensión (*extent*) | Conjunto de bloques **contiguos** asignado de una vez a un segmento |
| Bloque de datos | **Unidad mínima** de E/S y almacenamiento (por defecto 8 KB) |

- Un tablespace tiene uno o varios datafiles; un datafile pertenece a un solo tablespace.
- Un segmento puede repartirse entre varios datafiles del mismo tablespace.
- Tablespaces habituales: `SYSTEM` (diccionario), `SYSAUX`, `UNDOTBS1` (deshacer), `TEMP` (ordenaciones), `USERS`.
- Desde 12c existe la arquitectura **multitenant**: una CDB (contenedor) aloja varias PDB (bases conectables). En 21c y posteriores es la única opción.

```sql
CREATE TABLESPACE ts_nominas
  DATAFILE '/u01/oradata/ORCL/nominas01.dbf' SIZE 500M
  AUTOEXTEND ON NEXT 100M MAXSIZE 2G;
```

### 2.5 SQL Server y Machine Learning Services

Componentes de SQL Server:

- **Database Engine**: "servicio principal para almacenar, procesar y proteger los datos".
- **SSIS** (Integration Services): ETL. **SSAS** (Analysis Services): OLAP y minería. **SSRS** (Reporting Services): informes.
- **Replicación**: "tecnologías para copiar y distribuir datos y objetos de una base de datos a otra".
- **Data Quality Services (DQS)**: "producto de calidad de datos basado en conocimiento".
- **Machine Learning Services**: característica que permite **ejecutar scripts de Python y R con datos relacionales** dentro de la base de datos **[Salió 2022]**.

Machine Learning Services nació como R Services en SQL Server 2016; Python llegó en 2017. Los scripts se lanzan con el procedimiento `sp_execute_external_script`.

```sql
EXEC sp_execute_external_script
  @language = N'R',
  @script = N'OutputDataSet <- InputDataSet',
  @input_data_1 = N'SELECT edad FROM dbo.clientes';
```

Paquetes de Microsoft:

| Paquete | Lenguaje | Para qué |
|---|---|---|
| **RevoScaleR** | R | Transformación y manipulación de datos, resúmenes estadísticos, visualización y muchas formas de modelado **[Salió 2022]** |
| revoscalepy | Python | Equivalente de RevoScaleR para Python |
| MicrosoftML (R) y microsoftml (Python) | R y Python | Algoritmos de aprendizaje automático rápidos |
| olapR | R | Consultas MDX a cubos SSAS |
| sqlrutils | R | Empaquetar scripts R como procedimientos almacenados |

Trampa: **revoscalepy** es Python, no R. Fíjate en la terminación: "R" mayúscula al final, paquete de R.

## 3. Transacciones, ACID y concurrencia

### 3.1 Transacción

Una **transacción** es una unidad lógica de trabajo: una secuencia de operaciones que se ejecuta entera o no se ejecuta.

Estados de una transacción:

1. **Activa**: ejecutando operaciones.
2. **Parcialmente confirmada**: ha ejecutado la última operación.
3. **Confirmada** (*committed*): cambios permanentes.
4. **Fallida**: no puede continuar.
5. **Abortada**: se han deshecho sus cambios (*rollback*).

```sql
START TRANSACTION;               -- BEGIN TRANSACTION en SQL Server
UPDATE cuenta SET saldo = saldo - 100 WHERE id = 1;
SAVEPOINT tras_cargo;
UPDATE cuenta SET saldo = saldo + 100 WHERE id = 2;
-- si algo falla: ROLLBACK TO SAVEPOINT tras_cargo;
COMMIT;
```

- Oracle abre la transacción implícitamente con la primera sentencia DML. Una sentencia DDL hace `COMMIT` implícito.
- SQL Server y MySQL trabajan por defecto en **autocommit**: cada sentencia es una transacción salvo que se abra una explícita.
- Los registros bloqueados por una transacción se liberan **cuando la transacción termina** (`COMMIT` o `ROLLBACK`), es decir, cuando la aplicación indica el fin **[Salió 2006]**.

### 3.2 Propiedades ACID

Las transacciones deben cumplir las propiedades **ACID** **[Salió 2015, 2016, 2022]**.

| Letra | Propiedad | Significado | Componente que la garantiza |
|---|---|---|---|
| A | Atomicidad | Todo o nada | Gestor de recuperación (undo, log) |
| C | Consistencia | Lleva la BD de un estado válido a otro válido | Restricciones de integridad y el programador |
| I | Aislamiento (*Isolation*) | Las transacciones concurrentes no se interfieren | Control de concurrencia |
| D | Durabilidad | Lo confirmado sobrevive a fallos | Gestor de recuperación (redo, log, copias) |

- Algunos libros traducen D como **persistencia** (2015: "atomicidad, consistencia, aislamiento y persistencia").
- Distractores: "Disponibilidad" (es de CAP), "Coherencia", "Integridad", "Distribución", "Cohesión", "Herencia", "Polimorfismo".
- 2016 preguntó por dos características: **atomicidad y consistencia**. "Herencia", "abstracción" y "polimorfismo" son de orientación a objetos.

### 3.3 Anomalías de concurrencia

| Anomalía | Qué ocurre |
|---|---|
| Lectura sucia (*dirty read*) | T2 lee un dato modificado por T1 que aún no ha confirmado; T1 hace rollback |
| Lectura no repetible (*non-repeatable read*) | T1 lee una fila dos veces y obtiene valores distintos porque T2 la modificó y confirmó |
| Lectura fantasma (*phantom read*) | T1 repite una consulta con condición y aparecen o desaparecen filas insertadas o borradas por T2 |
| Actualización perdida (*lost update*) | T1 y T2 leen y escriben el mismo dato; una escritura pisa a la otra |

Las "**lecturas hundidas**" no existen **[Salió 2022]**.

Traza de lectura sucia:

```text
T1: UPDATE cuenta SET saldo = 0 WHERE id = 1;   -- saldo era 500
T2: SELECT saldo FROM cuenta WHERE id = 1;       -- lee 0 (dato sucio)
T1: ROLLBACK;                                    -- saldo vuelve a 500
-- T2 ha trabajado con un valor que nunca existió
```

Traza de lectura fantasma:

```text
T1: SELECT COUNT(*) FROM empleado WHERE id_dep = 10;   -- 5
T2: INSERT INTO empleado VALUES (99, 'Ana', 10); COMMIT;
T1: SELECT COUNT(*) FROM empleado WHERE id_dep = 10;   -- 6 (fila fantasma)
```

### 3.4 Niveles de aislamiento (SQL-92)

| Nivel | Lectura sucia | Lectura no repetible | Fantasma |
|---|---|---|---|
| READ UNCOMMITTED | Posible | Posible | Posible |
| READ COMMITTED | Evitada | Posible | Posible |
| REPEATABLE READ | Evitada | Evitada | Posible |
| SERIALIZABLE | Evitada | Evitada | Evitada |

- El nivel que evita sucias y no repetibles pero **permite fantasmas** es **REPEATABLE READ** **[Salió 2024 supuesto]**.
- Truco: cada nivel evita una anomalía más, en el orden sucia, no repetible, fantasma.
- Más aislamiento implica menos concurrencia y más bloqueos.

```sql
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
```

Valores por defecto y particularidades:

| SGBD | Nivel por defecto | Notas |
|---|---|---|
| Oracle | READ COMMITTED | Solo admite READ COMMITTED, SERIALIZABLE y READ ONLY; usa multiversión (undo) |
| SQL Server | READ COMMITTED | Añade SNAPSHOT y la opción RCSI (read committed con versiones) |
| MySQL (InnoDB) | REPEATABLE READ | Bloqueos *next-key* que evitan fantasmas en lecturas con bloqueo |
| PostgreSQL | READ COMMITTED | READ UNCOMMITTED se comporta como READ COMMITTED; su REPEATABLE READ no muestra fantasmas |

### 3.5 Control de concurrencia

La **gestión de la concurrencia** controla la interacción entre transacciones activas para evitar inconsistencias **[Salió 2005]**. Volver a un estado coherente tras un fallo es **recuperación**, no concurrencia.

**Serializabilidad**: una planificación concurrente es correcta si equivale a alguna ejecución en serie de las mismas transacciones. Dos operaciones están en conflicto si son de transacciones distintas, acceden al mismo dato y al menos una es escritura.

Técnicas:

1. **Bloqueos** (*locks*):
   - **Compartido** (S, lectura): compatible con otros compartidos.
   - **Exclusivo** (X, escritura): incompatible con cualquier otro.
   - Granularidad: base de datos, tabla, página, fila. Bloqueos de intención (IS, IX) en niveles superiores.
2. **Bloqueo en dos fases (2PL)**: fase de crecimiento (solo adquiere) y fase de decrecimiento (solo libera). Garantiza serializabilidad pero no evita interbloqueos.
   - **2PL estricto**: los bloqueos exclusivos se liberan al confirmar o abortar. Evita rollbacks en cascada.
   - **2PL riguroso**: todos los bloqueos se liberan al final.
3. **Marcas de tiempo** (*timestamps*): cada transacción recibe una marca al empezar. Las operaciones fuera de orden provocan aborto. No hay interbloqueos.
4. **Control optimista**: se ejecuta sin bloquear y se valida al final (fases de lectura, validación y escritura). Útil con pocos conflictos.
5. **Multiversión (MVCC)**: los lectores ven una instantánea; lectores y escritores no se bloquean. Lo usan Oracle, PostgreSQL, InnoDB y SQL Server (SNAPSHOT).

| Compatibilidad | S solicitado | X solicitado |
|---|---|---|
| S concedido | Sí | No |
| X concedido | No | No |

### 3.6 Interbloqueos (deadlocks)

Un interbloqueo ocurre cuando dos o más transacciones esperan recursos que tiene la otra. Condiciones de Coffman: exclusión mutua, retención y espera, no expropiación y espera circular.

Estrategias:

- **Prevención** con marcas de tiempo (TS menor = transacción más antigua). Ti pide un dato bloqueado por Tj.
- **Detección**: grafo de espera (*wait-for graph*); si hay ciclo, se aborta una víctima. Es lo que hacen Oracle y SQL Server.
- **Tiempos de espera** (*timeout*): si se espera demasiado, se aborta.

| Protocolo | Ti más antigua que Tj | Ti más joven que Tj | Tipo |
|---|---|---|---|
| **Wait-die** (esperar-morir) | Ti **espera** | Ti **muere** (aborta) | No expropiativo |
| **Wound-wait** (herir-esperar) | Ti **hiere** a Tj (Tj aborta) | Ti **espera** | Expropiativo |

- En ambos, la transacción abortada se reinicia **con su marca de tiempo original**. Así acaba siendo la más antigua y se evita la inanición.
- Regla mnemotécnica: en los dos protocolos **siempre aborta la más joven**.
- **Sin espera** (*no waiting*): si no obtiene el bloqueo, la transacción aborta inmediatamente, sin mirar edades.
- **Espera cautelosa** (*cautious waiting*): Ti espera solo si Tj no está esperando a su vez; si no, Ti aborta.
- 2005 preguntó por la afirmación incorrecta entre estas definiciones **[Salió 2005]**.

### 3.7 Recuperación

- **Diario o log**: registro de cada cambio con valor anterior (para deshacer, *undo*) y posterior (para rehacer, *redo*).
- **WAL** (*write-ahead logging*): el registro del log se escribe en disco antes que el dato.
- **Punto de control** (*checkpoint*): fuerza a disco los bloques modificados y acorta la recuperación.
- **Actualización diferida**: solo necesita redo. **Actualización inmediata**: necesita undo y redo.
- Al recuperar: se rehacen las transacciones confirmadas y se deshacen las no confirmadas.

## 4. Bases de datos distribuidas, CAP y BASE

### 4.1 Distribución y replicación

- **BD distribuida**: lógicamente una, físicamente repartida en varios nodos. Debe ofrecer transparencia de ubicación, fragmentación y replicación (regla 11 de Codd).
- **Fragmentación**: horizontal (por filas), vertical (por columnas) o mixta. En NoSQL se llama **sharding** cuando es horizontal.
- **Replicación**: copias del mismo dato en varios nodos. Síncrona o asíncrona; maestro-esclavo o multimaestro.
- **Commit en dos fases (2PC)**: coordinador y participantes. Fase 1, preparación y votación; fase 2, confirmación o aborto global.
- **Snapshot**: en el contexto clásico de Oracle, copia de solo lectura de datos remotos que se refresca periódicamente. Es un **mecanismo de replicación** en BD distribuidas; hoy se llama vista materializada **[Salió 2006]**.
- En otros contextos "snapshot" es una instantánea de un volumen o el nivel SNAPSHOT de SQL Server.

### 4.2 Teorema CAP

Eric Brewer lo formuló en 2000; Gilbert y Lynch lo demostraron en 2002. Un sistema distribuido solo puede garantizar a la vez **dos de tres** propiedades:

- **C, Consistencia**: todos los nodos ven el mismo dato al mismo tiempo (consistencia fuerte o linealizable).
- **A, Disponibilidad** (*Availability*): toda petición a un nodo vivo recibe respuesta.
- **P, Tolerancia a particiones**: el sistema sigue funcionando aunque se corte la comunicación entre nodos.

En un sistema distribuido real las particiones ocurren, así que la elección práctica es **C o A cuando hay partición**.

| Tipo | Renuncia a | Ejemplos típicos |
|---|---|---|
| CP | Disponibilidad durante la partición | HBase, MongoDB (configuración por defecto), ZooKeeper, Redis Cluster |
| AP | Consistencia fuerte (consistencia eventual) | Cassandra, CouchDB, DynamoDB, Riak |
| CA | Tolerancia a particiones (solo un nodo o red fiable) | SGBD relacional en un único servidor |

- **PACELC** (Abadi, 2010): si hay partición (P), elige A o C; si no (E, *else*), elige latencia (L) o consistencia (C).
- La C de CAP **no es** la C de ACID. La de ACID habla de restricciones de integridad; la de CAP, de réplicas iguales.

### 4.3 ACID frente a BASE

| ACID (relacional) | BASE (muchos NoSQL) |
|---|---|
| Consistencia fuerte | Consistencia eventual |
| Pesimista: bloquea | Optimista: tolera divergencias temporales |
| Escala sobre todo en vertical | Escala en horizontal |

**BASE** = *Basically Available, Soft state, Eventual consistency*: básicamente disponible, estado blando, consistencia eventual.

**NewSQL**: sistemas distribuidos con SQL y ACID que escalan en horizontal. Ejemplos: Google Spanner, CockroachDB, TiDB, YugabyteDB, VoltDB.

## 5. SGBD orientados a objetos

### 5.1 Motivación y conceptos

Las BDOO nacen en los años 80 para aplicaciones con objetos complejos (CAD, CASE, multimedia). Evitan el **desajuste de impedancia** entre el lenguaje OO y las tablas.

Conceptos clave:

- **Objeto**: estado (atributos) y comportamiento (métodos).
- **Identificador de objeto (OID)** **[Salió 2025]**:
  - Lo **genera el sistema**.
  - Es **único** e **inmutable** durante la vida del objeto.
  - Es **independiente de los valores de los atributos**: dos objetos con los mismos valores son objetos distintos.
  - **No es visible** para el usuario externo.
  - No se reutiliza cuando el objeto se borra.
  - No lo guarda el programa de aplicación; lo gestiona el SGBDOO.
- Igualdad: **idénticos** (mismo OID) frente a **iguales** (mismos valores).
- **Encapsulación**: el estado solo se accede por métodos.
- **Clases, herencia, polimorfismo**, sobrecarga y ligadura tardía.
- **Persistencia**: por herencia de una clase persistente, por nombre o por **alcanzabilidad** (un objeto es persistente si se alcanza desde uno persistente).
- **Extensión** (*extent*): conjunto de todos los objetos persistentes de una clase.

### 5.2 Constructores de tipos

Los tipos complejos se construyen con:

| Constructor | Qué crea | ¿Admite duplicados? | ¿Ordenado? |
|---|---|---|---|
| Átomo | Valor básico (entero, cadena, booleano) | No aplica | No aplica |
| Tupla (*struct*) | Registro de componentes con nombre | No aplica | No aplica |
| **Set** (conjunto) | Colección | No | No |
| **Bag** (bolsa, multiconjunto) | Colección | Sí | No |
| **List** (lista) | Colección | Sí | Sí |
| **Array** (vector) | Colección de tamaño fijo o acotado | Sí | Sí (por índice) |
| **Dictionary** (diccionario) | Pares clave-valor | Claves únicas | No |

- Set, bag, list, array y dictionary son los **constructores de colección** del modelo ODMG.
- **"Columna" no es un constructor de colección** **[Salió 2025]**. Es un concepto relacional o columnar.

### 5.3 El manifiesto de Atkinson (1989)

*The Object-Oriented Database System Manifesto* (Atkinson, Bancilhon, DeWitt, Dittrich, Maier y Zdonik, 1989) fija qué debe tener un SGBDOO. Es muy preguntado **[Salió 2008, 2022]**.

**Características obligatorias (13)**:

1. Objetos complejos.
2. Identidad de objeto (independiente de los valores de sus atributos).
3. Encapsulación.
4. Tipos o clases.
5. Jerarquías de clases o tipos (herencia).
6. Sobrecarga, sobrescritura y ligadura tardía (polimorfismo).
7. Completitud computacional.
8. **Extensibilidad**: el usuario puede definir tipos nuevos, tratados igual que los predefinidos.
9. Persistencia.
10. Gestión de almacenamiento secundario (índices, agrupamiento, caché).
11. Concurrencia.
12. Recuperación.
13. Consultas *ad hoc* (lenguaje de consulta declarativo, eficiente e independiente de la aplicación).

**Características opcionales**:

- **Herencia múltiple** **[Salió 2008]**.
- Verificación e inferencia de tipos.
- Distribución.
- Transacciones de diseño (largas, anidadas).
- Versiones.

**Opciones abiertas**: paradigma de programación, sistema de representación, sistema de tipos y uniformidad.

Lo que **no** es obligatorio, y aparece como distractor:

- "El conjunto de tipos de datos debe ser **fijo**" para buscar más rápido. Es falso: el manifiesto exige **extensibilidad** **[Salió 2022]**.
- Herencia múltiple (opcional).

En la pregunta de 2022, "el esquema de una BDOO incluye únicamente un conjunto de clases" es una afirmación correcta del modelo, no la respuesta.

Respuestas al manifiesto:

- **Tercer manifiesto** (Stonebraker y otros, 1990): defiende ampliar el modelo relacional. Da lugar a los **SGBD objeto-relacionales**.
- **Third Manifesto** (Date y Darwen, 1995): modelo relacional puro con tipos definidos por el usuario.

### 5.4 El estándar ODMG

El **ODMG** (*Object Data Management Group*) publicó el estándar ODMG-93; la última versión es la **3.0** (2000). Sus componentes:

- **Modelo de objetos**: basado en el de OMG.
- **ODL** (*Object Definition Language*): lenguaje de definición de esquemas.
- **OQL** (*Object Query Language*): **lenguaje de consulta** declarativo, de sintaxis parecida a SQL **[Salió 2024]**.
- **Vinculaciones** (*bindings*) con C++, Smalltalk y Java.

Sobre OQL:

- Es un lenguaje de **consulta**, no de definición ni de manipulación completa. Las actualizaciones se hacen con métodos del lenguaje anfitrión.
- Usa `SELECT ... FROM ... WHERE` y navega por relaciones con expresiones de camino (`p.departamento.nombre`).
- Devuelve colecciones (set, bag, list) y admite cuantificadores `for all` y `exists`.

```sql
-- ODL
class Empleado (extent empleados key dni) {
  attribute string nombre;
  attribute string dni;
  relationship Departamento trabaja_en inverse Departamento::tiene;
};

-- OQL: nombres de los empleados del departamento de Sistemas
SELECT e.nombre
FROM   empleados e
WHERE  e.trabaja_en.nombre = "Sistemas";
```

El estándar se abandonó tras 2001. Su parte Java evolucionó a **JDO** y, en la práctica, a JPA con su lenguaje JPQL.

### 5.5 Productos orientados a objetos

| Producto | Notas |
|---|---|
| **Matisse** | SGBDOO comercial (Matisse Software) **[Salió 2024]** |
| **ZODB** (Zope Object Database) | BD de objetos Python del servidor de aplicaciones Zope **[Salió 2015]** |
| ObjectStore | De Object Design, luego Progress |
| Versant | Hoy Actian NoSQL |
| Objectivity/DB | Usada en física de altas energías |
| GemStone/S | Smalltalk |
| O2 | Proyecto francés, pionero |
| db4o | BD de objetos para Java y .NET, discontinuada |
| ObjectDB | Para Java, con JPA y JDO |
| InterSystems Caché e IRIS | Multimodelo, con soporte de objetos |
| Poet, Jasmine | Históricos |

Trampa de 2024: "Cézanne, Picasso, Matisse, Rembrandt". Solo **Matisse** es un SGBDOO.

### 5.6 SGBD objeto-relacionales

Extienden el modelo relacional con conceptos OO. Se estandarizaron en **SQL:1999** (SQL3):

- Tipos definidos por el usuario (`CREATE TYPE`), con métodos.
- Herencia de tipos y tablas (`UNDER`).
- Referencias a objetos (`REF`) e identificadores de fila.
- Colecciones: `ARRAY` y, desde SQL:2003, `MULTISET`.

Ejemplos: Oracle (desde la versión 8), PostgreSQL, Db2, Informix.

```sql
-- Oracle
CREATE TYPE direccion_t AS OBJECT (calle VARCHAR2(60), cp CHAR(5));
/
CREATE TABLE cliente (id NUMBER PRIMARY KEY, dir direccion_t);
SELECT c.dir.cp FROM cliente c;
```

## 6. Bases de datos NoSQL

### 6.1 Características

"NoSQL" se entiende como *Not only SQL*. El término se popularizó en 2009 para sistemas no relacionales y distribuidos.

Características típicas:

- **Esquema flexible** o sin esquema.
- **Escalabilidad horizontal** en hardware estándar: *sharding* y replicación.
- **Alta disponibilidad** y consistencia **eventual** o configurable (BASE).
- Modelos orientados a **agregados**: se guarda junto lo que se lee junto.
- Sin JOIN complejos ni SQL estándar, aunque muchos ofrecen lenguajes parecidos (CQL, N1QL).
- Muchos ya ofrecen transacciones ACID (MongoDB desde 4.0).

Usos: big data, aplicaciones web a gran escala, cachés, sesiones, redes sociales, IoT.

### 6.2 Tipos de bases de datos NoSQL

Los cuatro tipos clásicos son **clave-valor, documentales, de columnas y de grafos** **[Salió 2025]**. "Sistemáticos" o "metodológicos" no son tipos.

| Tipo | Modelo | Productos | Usos |
|---|---|---|---|
| **Clave-valor** | Diccionario: clave única a un valor opaco | **Redis**, **Riak** KV, **Amazon DynamoDB**, Memcached, Valkey, etcd | Cachés, sesiones, carritos |
| **Documental** | Documentos JSON, BSON o XML con estructura interna consultable | **MongoDB**, **CouchDB**, Couchbase, RavenDB, Firestore | Catálogos, gestión de contenidos |
| **Columnar** (familia de columnas) | Filas con columnas agrupadas en familias, dispersas | **Cassandra**, **HBase**, Google Bigtable, ScyllaDB | Series temporales, escritura masiva |
| **Grafos** | Nodos, relaciones y propiedades | **Neo4j**, Amazon Neptune, JanusGraph, ArangoDB | Redes sociales, fraude, recomendaciones |

Otros tipos que pueden aparecer:

- **Multimodelo**: Azure Cosmos DB, ArangoDB, OrientDB.
- **Series temporales**: InfluxDB, TimescaleDB (extensión de PostgreSQL).
- **Motores de búsqueda**: Elasticsearch, OpenSearch, Solr.
- **Vectoriales** (IA, búsqueda semántica): Milvus, Pinecone, Qdrant, pgvector. Oracle 23ai y SQL Server 2025 añaden tipo de dato vector.
- **XML nativas**: eXist-db, BaseX.

DynamoDB es NoSQL; **Aurora** es relacional **[Salió 2018]**.

### 6.3 MongoDB (documental)

- Guarda **documentos BSON** (JSON binario) en **colecciones**, agrupadas en bases de datos.
- Cada documento tiene `_id`, por defecto un `ObjectId` de 12 bytes.
- Alta disponibilidad con **replica sets** (un primario y secundarios). Escalado con **sharding**.
- Transacciones ACID multidocumento desde la **4.0** (2018, replica sets) y la **4.2** (clústeres fragmentados).
- Consulta con métodos y el *aggregation pipeline*. Versión principal actual: 8.x.

```javascript
db.empleados.insertOne({ nombre: "Ana", dep: "Sistemas", edad: 34 });
db.empleados.find({ dep: "Sistemas", edad: { $gt: 30 } }, { nombre: 1, _id: 0 });
// Resultado: { nombre: "Ana" }
db.empleados.aggregate([{ $group: { _id: "$dep", total: { $sum: 1 } } }]);
```

### 6.4 Cassandra y HBase (columnares)

- **Cassandra**: nació en Facebook, hoy Apache. Arquitectura en anillo **sin maestro** (*peer-to-peer*), protocolo *gossip*.
- Consistencia **ajustable** por operación (`ONE`, `QUORUM`, `ALL`). Lenguaje **CQL**. Versión 5.0 publicada en 2024.
- Conceptos: *keyspace*, tabla, clave de partición, clave de agrupamiento.
- **HBase**: se inspira en Google Bigtable y corre sobre **HDFS** de Hadoop. Tiene maestro (HMaster) y RegionServers. Es CP.

```sql
-- CQL (Cassandra)
CREATE TABLE lecturas (sensor text, ts timestamp, valor double,
                       PRIMARY KEY (sensor, ts));
SELECT valor FROM lecturas WHERE sensor = 'S1' LIMIT 10;
```

### 6.5 Redis y DynamoDB (clave-valor)

- **Redis**: almacén en memoria con estructuras de datos (strings, listas, hashes, conjuntos, conjuntos ordenados, streams).
- Persistencia opcional: instantáneas **RDB** y registro **AOF**.
- En 2024 Redis dejó la licencia BSD. La Linux Foundation creó el fork libre **Valkey**. Redis 8 (2025) volvió a ofrecer una licencia libre, AGPLv3.
- **DynamoDB** (AWS): clave-valor y documental, gestionado, con clave de partición y de ordenación.

```text
SET sesion:42 "usuario=ana" EX 1800
GET sesion:42      -> "usuario=ana"
INCR visitas       -> 1
```

### 6.6 Neo4j y Cypher (grafos)

- **Neo4j**: SGBD de grafos nativo y transaccional (ACID). Modelo de **grafo de propiedades**: nodos con etiquetas, relaciones con tipo y dirección, propiedades en ambos.
- **Cypher** es el **lenguaje de consulta de Neo4j** **[Salió 2017, 2025]**. Es declarativo y usa patrones de "arte ASCII".
- Cypher **no es** una base de datos; Neo4j sí lo es. MongoDB, CouchDB y Cassandra no usan Cypher.
- Otros lenguajes de grafos: **Gremlin** (Apache TinkerPop), **SPARQL** (RDF), **GQL**.
- **GQL** (ISO/IEC 39075:2024) es el primer estándar ISO de lenguaje de consulta de grafos, muy inspirado en Cypher. SQL:2023 añadió **SQL/PGQ** para consultar grafos sobre tablas.

```cypher
CREATE (a:Persona {nombre: 'Ana'})-[:CONOCE]->(b:Persona {nombre: 'Luis'});

MATCH (p:Persona {nombre: 'Ana'})-[:CONOCE]->(amigo)
RETURN amigo.nombre;
// Resultado: "Luis"
```

### 6.7 Ecosistema Hadoop

Muchas preguntas de "NoSQL" tocan el ecosistema Hadoop:

| Proyecto | Función |
|---|---|
| HDFS | Sistema de ficheros distribuido |
| MapReduce | Modelo de procesamiento por lotes |
| YARN | Gestión de recursos del clúster |
| **Avro** | **Serialización de datos** (esquema en JSON, formato binario) **[Salió 2017]** |
| Parquet, ORC | Formatos columnares de fichero |
| HBase | BD columnar sobre HDFS |
| Hive | Almacén de datos con HiveQL (similar a SQL) |
| Pig | Lenguaje de flujo de datos (Pig Latin) |
| Flume | Ingesta de logs y eventos |
| Chukwa | Recogida y monitorización de logs |
| Sqoop | Transferencia entre Hadoop y relacionales (retirado en 2021) |
| ZooKeeper | Coordinación distribuida |
| Oozie | Planificador de flujos de trabajo |
| Spark | Procesamiento en memoria |
| Kafka | Mensajería y *streaming* de eventos |

Jaql es un lenguaje de consulta para JSON creado por IBM, no un servicio de serialización. Otros formatos de serialización: Thrift y Protocol Buffers.

### 6.8 Relacional, OO y NoSQL: comparación

| Aspecto | Relacional | Orientado a objetos | NoSQL |
|---|---|---|---|
| Unidad | Tabla y fila | Objeto con OID | Clave, documento, columna o nodo |
| Esquema | Rígido, previo | Clases | Flexible |
| Lenguaje | SQL (ISO/IEC 9075) | OQL (ODMG) | Propio (CQL, Cypher, API) |
| Transacciones | ACID | ACID | BASE o ACID limitado |
| Escalado | Vertical, sobre todo | Vertical | Horizontal |
| Identidad | Por valor (clave primaria) | Por OID, independiente del valor | Por clave |

## Trampas y respuestas desactualizadas

- **ACID frente a CAP**: "Disponibilidad" nunca está en ACID. La D es Durabilidad (o persistencia) (2015, 2022).
- **"Lecturas hundidas"** no existen (2022). Las anomalías estándar son sucia, no repetible y fantasma, más la actualización perdida.
- **REPEATABLE READ sí permite fantasmas** según SQL-92 (2024). Pero en PostgreSQL y en InnoDB los fantasmas se evitan en la práctica. Responde con la tabla del estándar.
- **Oracle no ofrece REPEATABLE READ ni READ UNCOMMITTED**. Su nivel por defecto es READ COMMITTED.
- **Reglas de Codd**: todas las de "independencia" lo son; "dependencia de la distribución" es falsa (2019). No existe la de "cardinalidad" (2018).
- **Manifiesto de Atkinson**: la herencia múltiple es opcional (2008). Los tipos no son fijos: se exige extensibilidad (2022).
- **OID**: lo genera el sistema; no es visible ni depende de atributos (2025). No confundir con una clave primaria.
- **"Columna"** no es constructor de colección de una BDOO (2025).
- **Cypher es un lenguaje, no una base de datos** (2017). La opción "base de datos orientada a grafos" describe a Neo4j, no a Cypher.
- **Amazon Aurora es relacional**, DynamoDB es NoSQL (2018). **Riak** y **Redis** son clave-valor.
- **JSON** es un formato, no un gestor (2017). **Knosys** es documental, no relacional (2005).
- **Oracle**: un datafile pertenece a un solo tablespace; la unidad mínima es el **bloque**, no el segmento; una extensión es un grupo de bloques contiguos, no de índices (2018).
- **RevoScaleR frente a revoscalepy** (2022): el primero es R; el segundo, Python.
- **SQL Server ML Services**: desde SQL Server 2022 los entornos de R y Python ya no se instalan con el producto; hay que añadirlos aparte. La característica sigue existiendo.
- **db4o** está discontinuada y el estándar **ODMG** dejó de mantenerse en 2001. Si aparecen, valen como ejemplo histórico.
- **Redis** cambió de licencia en 2024 (fork Valkey) y en 2025 volvió a ofrecer AGPLv3. Una pregunta antigua que lo dé como "BSD" estaría desfasada.
- **"Snapshot"** en 2006 se refería a la réplica de solo lectura de Oracle (hoy vista materializada), no a un nivel de aislamiento.
- **Wait-die y wound-wait**: en ambos aborta siempre la transacción más joven; se reinicia con su marca original.
- **NoSQL ya no implica "sin transacciones"**: MongoDB y Neo4j son ACID. Si una opción dice "NoSQL nunca soporta ACID", es falsa.
