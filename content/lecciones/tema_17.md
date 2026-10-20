# Tema 17. SQL ANSI, procedimientos almacenados y disparadores

Es el segundo tema que más puntúa del examen. Se esperan unas 3 preguntas de test (2,9) y otras 2-3 del supuesto del Bloque III (2,6) por convocatoria. Hay 91 preguntas históricas clasificadas aquí, de 2005 a 2025. Se concentran en cuatro zonas: clasificar sentencias en DDL, DML, DCL y TCL; escribir el CREATE TABLE o el INSERT correcto; elegir la consulta que devuelve algo concreto (GROUP BY con HAVING, JOIN, subconsultas, LIKE); y la sintaxis de CREATE TRIGGER. Procedimientos almacenados y transacciones salen menos, pero salen. Los eventos programados no han salido nunca.

## Cómo lo preguntan

- **"¿Qué consulta devuelve X?"** sobre el modelo de datos del supuesto. Las cuatro opciones difieren en un detalle: WHERE en lugar de HAVING, LIKE sin comodín, falta un FROM (2019 b3 17, 2024 b3 23).
- **Sintaxis inventada como distractor**: `INSERT TO`, `CREATE NEW TABLE`, `UPDATE TABLE`, `CREAR TABLA`, `SWITCH`, `RECOVERPOINT` (2019, 2022, 2024).
- **Clasificar sentencias**: "¿cuál es DDL?", "¿GRANT es DCL?", "TRUNCATE es DML" como afirmación falsa (2007, 2015, 2016, 2017, 2018, 2024).
- **Identificar la INCORRECTA**: sobre DELETE, sobre tipos de sentencias o sobre triggers (2005 b3 28, 2018 ej1 49, 2022 ej1 22, 2024 ej1 38).
- **Cabecera de trigger ANSI**: elegir el inicio válido de un CREATE TRIGGER (2019 ej1 42, 2025 ej1 44).
- **Dialectos concretos**: MySQL (`DATE_FORMAT`, `STR_TO_DATE`, `LOAD DATA`, `AUTO_INCREMENT`), Oracle (PL/SQL, secuencias, `CREATE USER`, SAVEPOINT) y T-SQL (`EXEC` con parámetros, `DENY`).
- **Orden lógico de evaluación** de las cláusulas de un SELECT (2008 ej1 55).
- **Literalidad de la definición**: "HAVING especifica una condición de búsqueda para un grupo o agregado" (2008 ej1 54).

## 1. SQL: origen, estándar y sublenguajes

### 1.1 Historia y estándar ISO/IEC 9075

SQL (*Structured Query Language*) nace en IBM en los años 70 como SEQUEL, para el prototipo System R. Su base teórica es el modelo relacional de Codd. Se apoya en el álgebra relacional y en el cálculo relacional de tuplas. Es un lenguaje **declarativo**: dices qué quieres, no cómo obtenerlo.

Es un estándar **de iure**: ANSI lo aprobó en 1986 e ISO en 1987. Hoy es la norma ISO/IEC 9075. Versiones principales:

| Versión | Novedad que conviene recordar |
|---|---|
| SQL-86 / SQL-87 | Primera norma ANSI e ISO |
| SQL-89 | Integridad referencial básica |
| SQL-92 (SQL2) | JOIN explícito, CASE, CAST, niveles de aislamiento, esquemas. La versión "clásica" |
| SQL:1999 (SQL3) | Disparadores (triggers), consultas recursivas (WITH RECURSIVE), roles, tipo BOOLEAN, objetos, ROLLUP y CUBE |
| SQL:2003 | Funciones de ventana, MERGE, secuencias, columnas IDENTITY, SQL/XML |
| SQL:2006 | Integración con XQuery |
| SQL:2008 | TRUNCATE TABLE, triggers INSTEAD OF, FETCH FIRST |
| SQL:2011 | Datos temporales (tablas versionadas por periodo) |
| SQL:2016 | JSON, reconocimiento de patrones en filas (MATCH_RECOGNIZE), LISTAGG |
| SQL:2019 | Parte 15: arrays multidimensionales (SQL/MDA) |
| SQL:2023 | Parte 16: consultas de grafos (SQL/PGQ), tipo JSON nativo, GREATEST y LEAST, ANY_VALUE |

A octubre de 2026 la versión vigente es **SQL:2023**. La norma tiene varias partes. Para este tema importan dos:

- **Parte 2 (SQL/Foundation)**: el núcleo del lenguaje, incluidos los triggers.
- **Parte 4 (SQL/PSM, *Persistent Stored Modules*)**: procedimientos y funciones almacenadas, variables, bucles, manejadores de errores.

Otras partes: 3 (CLI, base de ODBC), 9 (MED, datos externos), 10 (OLB, SQL embebido en Java), 11 (esquema de información), 13 (rutinas Java), 14 (XML).

**[Salió 2015]**: SQL "es un estándar de facto y se basa en el álgebra relacional". Ojo: en realidad es estándar de iure. Era la opción menos mala, porque las otras eran claramente falsas (sin verificar).

Ningún SGBD cumple el estándar completo. Cada uno añade su dialecto: **PL/SQL** (Oracle), **Transact-SQL** (SQL Server y Sybase), **PL/pgSQL** (PostgreSQL) y el SQL/PSM de **MySQL/MariaDB**.

### 1.2 Sublenguajes

Las sentencias se agrupan por su función. Es la pregunta de test más repetida del tema.

| Sublenguaje | Significado | Sentencias | Para qué |
|---|---|---|---|
| DDL | *Data Definition Language* | CREATE, ALTER, DROP, TRUNCATE, RENAME, COMMENT | Definir la estructura (esquema) |
| DML | *Data Manipulation Language* | SELECT, INSERT, UPDATE, DELETE, MERGE | Consultar y modificar datos |
| DCL | *Data Control Language* | GRANT, REVOKE (DENY en T-SQL) | Controlar el acceso, los privilegios |
| TCL | *Transaction Control Language* | COMMIT, ROLLBACK, SAVEPOINT, SET TRANSACTION | Controlar transacciones |

Matices que caen:

- **SELECT es DML** **[Salió 2024]**. Algunos autores lo separan como DQL (*Data Query Language*). En el examen, si no aparece DQL, SELECT es DML.
- DML es *Data Manipulation Language*, no "Data Manager Language" **[Salió 2024]**.
- **TRUNCATE es DDL**, no DML **[Salió 2024]**. Vacía la tabla sin registrar fila a fila y no admite WHERE.
- **ALTER es DDL**: cambia la estructura de un objeto **[Salió 2008, 2016]**.
- **CREATE es DDL** **[Salió 2015]**. El DDL sirve para "definir la estructura lógica de la base de datos" **[Salió 2015]**.
- **GRANT es DCL** **[Salió 2007]**: da derechos de acceso a un usuario sobre un objeto **[Salió 2007]**.
- Operaciones básicas del DML: INSERT y DELETE (y UPDATE, SELECT). DROP, CREATE y REVOKE no son DML **[Salió 2008]**.
- Crear una tabla e insertar registros requiere como mínimo **una sentencia DDL y otra DML** **[Salió 2007]**.
- DCL controla el acceso a los datos; DDL define el esquema **[Salió 2017]**. La afirmación "DCL define estructuras con CREATE TABLE" es falsa **[Salió 2018]**.
- Una sentencia **SELECT nunca altera** el contenido de la base de datos **[Salió 2017]**.
- A veces el examen mete COMMIT y ROLLBACK en DML o DCL. Con el estándar actual son TCL.

Manipular y definir datos se hace con **el mismo lenguaje** SQL. Por eso en 2016 fue falsa la frase "el lenguaje para manipular datos es diferente del de definir datos" **[Salió 2016]**.

## 2. DDL: definición de datos

### 2.1 Bases de datos y esquemas

En el estándar, un **catálogo** contiene **esquemas** y cada esquema contiene tablas, vistas, dominios, etc.

```sql
-- Estándar: esquema con propietario
CREATE SCHEMA museo AUTHORIZATION museo;

-- MySQL: SCHEMA y DATABASE son sinónimos
CREATE DATABASE IF NOT EXISTS tienda;
DROP DATABASE IF EXISTS tienda;
```

- `CREATE SCHEMA nombre AUTHORIZATION usuario` crea un esquema cuyo propietario es ese usuario **[Salió 2015]**.
- En MySQL una base de datos se borra con `DROP DATABASE [IF EXISTS] nombre` **[Salió 2016]**. No existen `ERASE`, `DELETE` ni `QUIT DATABASE`.
- En Oracle, un usuario y su esquema son casi lo mismo. Al crear el usuario se crea su esquema.

### 2.2 Tipos de datos

| Familia | Estándar | Oracle | MySQL | SQL Server |
|---|---|---|---|---|
| Texto fijo | CHAR(n) | CHAR(n) | CHAR(n) | CHAR(n), NCHAR(n) |
| Texto variable | VARCHAR(n) | VARCHAR2(n) | VARCHAR(n) | VARCHAR(n), NVARCHAR(n) |
| Texto largo | CLOB | CLOB | TEXT, LONGTEXT | VARCHAR(MAX) |
| Enteros | SMALLINT, INTEGER, BIGINT | NUMBER(p) | TINYINT, INT, BIGINT | TINYINT, INT, BIGINT |
| Decimal exacto | NUMERIC(p,s), DECIMAL(p,s) | NUMBER(p,s) | DECIMAL(p,s) | DECIMAL(p,s), MONEY |
| Coma flotante | REAL, FLOAT, DOUBLE PRECISION | BINARY_FLOAT, BINARY_DOUBLE | FLOAT, DOUBLE | REAL, FLOAT |
| Fecha y hora | DATE, TIME, TIMESTAMP, INTERVAL | DATE (con hora), TIMESTAMP | DATE, DATETIME, TIMESTAMP | DATE, DATETIME2 |
| Lógico | BOOLEAN | BOOLEAN (desde 23ai) | BOOL (alias de TINYINT(1)) | BIT |
| Binario | BLOB, BINARY, VARBINARY | BLOB, RAW | BLOB | VARBINARY(MAX) |

`NUMERIC(7,2)` admite 7 dígitos en total, 2 de ellos decimales: hasta 99999,99. En CHAR(n) se rellena con espacios; VARCHAR(n) guarda solo lo usado.

### 2.3 CREATE TABLE y restricciones

Estructura general:

```sql
CREATE TABLE Aula (
  idAula     INT          NOT NULL,
  nomAula    VARCHAR(50)  NOT NULL,
  numPlazas  INT          DEFAULT 30 CHECK (numPlazas > 0),
  idEdificio INT          NOT NULL,
  CONSTRAINT pk_aula PRIMARY KEY (idAula),
  CONSTRAINT fk_aula_edif FOREIGN KEY (idEdificio)
      REFERENCES Edificio (idEdificio)
      ON DELETE RESTRICT ON UPDATE CASCADE
);
```

Es el modelo de 2018 b3 8: cada aula pertenece a un edificio y un edificio tiene muchas aulas. La opción correcta tenía **PRIMARY KEY y FOREIGN KEY a la vez** **[Salió 2018]**. La clave ajena va en el lado "muchos" (Aula).

Errores de sintaxis que han servido de distractor **[Salió 2022, 2024]**:

- `CREATE Subsanacion (...)`: falta TABLE.
- `CREATE NEW TABLE ...`: NEW no existe.
- `CREATE TABLE X AS (col tipo, ...)`: AS va seguido de un SELECT, no de columnas.
- `ALTER TABLE`, `INSERT TABLE` o `DROP TABLE` con lista de columnas: no crean nada.
- `CREATE TABLE T KEY id, nombre;` o `CREATE TABLE T (nombre, apellido);`: faltan tipos.

Respuesta correcta tipo **[Salió 2022, 2024]**:

```sql
CREATE TABLE Usuario (idUsuario BIGINT PRIMARY KEY, nombre VARCHAR(255));
CREATE TABLE Subsanacion (IdSubsanacion BIGINT, IdSolicitudBeca BIGINT,
                          TextoFundamento VARCHAR(2000));
-- MySQL, 2024 b4 22
CREATE TABLE ProfesoresIngles (
  id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(30), apellido1 VARCHAR(30), apellido2 VARCHAR(30));
```

Las restricciones (*constraints*) son reglas de integridad declarativa:

| Restricción | Qué garantiza | Nulos |
|---|---|---|
| NOT NULL | La columna siempre tiene valor | No admite |
| UNIQUE | Valores distintos en la columna o grupo | Admite (ver nota) |
| PRIMARY KEY | Identifica cada fila. Equivale a UNIQUE + NOT NULL | No admite |
| FOREIGN KEY | El valor existe en la clave referenciada | Admite |
| CHECK | Cumple una condición booleana | Pasa si es desconocido |
| DEFAULT | Valor si no se indica otro | No es restricción en sentido estricto |

Puntos finos:

- Solo hay **una PRIMARY KEY** por tabla, pero puede haber varias UNIQUE.
- **UNIQUE** impide valores repetidos en columnas que no son clave primaria **[Salió 2006, 2017, 2025]**. Es la respuesta a "impedir nombres de usuario duplicados".
- UNIQUE y nulos: en el estándar y en Oracle, PostgreSQL y MySQL caben varios NULL. SQL Server solo admite un NULL en un índice UNIQUE. SQL:2023 añade `UNIQUE NULLS NOT DISTINCT` para tratarlos como iguales.
- Las **claves ajenas pueden ser nulas** **[Salió 2016]**, salvo que además sean NOT NULL o formen parte de la clave primaria.
- CHECK rechaza solo si la condición es FALSE. Si es UNKNOWN (por un NULL), la fila entra.

Restricción en línea o en tabla, con o sin nombre:

```sql
-- En línea, sin nombre
nombre VARCHAR(50) UNIQUE
-- A nivel de tabla, con nombre (recomendado: facilita borrarla)
CONSTRAINT u_nombre UNIQUE (nombre)
-- Añadida después (2017 b3 3)
ALTER TABLE usuarios ADD CONSTRAINT u_nombre UNIQUE (nombre);
```

### 2.4 Integridad referencial: acciones y MATCH

```sql
CONSTRAINT fk_res_cli FOREIGN KEY (idcliente)
  REFERENCES CLIENTES (idcliente)
  ON UPDATE NO ACTION ON DELETE NO ACTION
```

Acciones al borrar o actualizar la fila padre:

| Acción | Efecto en las filas hijas |
|---|---|
| NO ACTION | Error si quedan hijas huérfanas. Comprobación al final de la sentencia. Es la opción por defecto |
| RESTRICT | Error inmediato. En la práctica, casi igual que NO ACTION |
| CASCADE | Borra o actualiza también las hijas |
| SET NULL | Pone a NULL la clave ajena de las hijas |
| SET DEFAULT | Pone el valor por defecto |

"Sin acción en UPDATE ni DELETE" se escribe `ON UPDATE NO ACTION ON DELETE NO ACTION` **[Salió 2015]**. Oracle solo admite `ON DELETE CASCADE` y `ON DELETE SET NULL`; no tiene ON UPDATE.

La cláusula **MATCH** decide qué pasa con claves ajenas **compuestas** que tienen algún nulo:

| MATCH | Comportamiento |
|---|---|
| SIMPLE (defecto) | Si alguna columna es NULL, no se comprueba nada |
| PARTIAL | Las columnas no nulas deben coincidir con alguna fila padre |
| FULL | O todas son NULL o ninguna. Prohíbe nulos parciales |

La que impide nulos parciales es **MATCH FULL** **[Salió 2015]**.

Restricciones diferibles: `DEFERRABLE INITIALLY DEFERRED` aplaza la comprobación hasta el COMMIT. Sirve para cargar datos con referencias circulares.

### 2.5 ALTER, DROP, TRUNCATE y RENAME

```sql
ALTER TABLE Empleado ADD email VARCHAR(100);           -- añadir columna
ALTER TABLE Empleado DROP COLUMN email;                -- quitar columna
ALTER TABLE Empleado ALTER COLUMN sueldo SET DEFAULT 0; -- estándar y PostgreSQL
ALTER TABLE Empleado MODIFY sueldo DECIMAL(10,2);      -- Oracle y MySQL
ALTER TABLE Empleado ALTER COLUMN sueldo DECIMAL(10,2); -- SQL Server
ALTER TABLE Empleado RENAME COLUMN nom TO nombre;
ALTER TABLE Empleado ADD CONSTRAINT ck_sueldo CHECK (sueldo >= 0);
ALTER TABLE Empleado DROP CONSTRAINT ck_sueldo;
```

Para añadir una columna se usa **ALTER TABLE** **[Salió 2015]**. No existen `ADD COLUMN` como sentencia suelta, `INSERT COLUMN` ni `MODIFY TABLE`.

Comparativa que siempre cae:

| | DELETE | TRUNCATE | DROP |
|---|---|---|---|
| Tipo | DML | DDL | DDL |
| Qué elimina | Filas (todas o las del WHERE) | Todas las filas | Datos y estructura |
| WHERE | Sí | No | No |
| Dispara triggers DML | Sí | No | No |
| ROLLBACK | Sí | No en Oracle y MySQL (commit implícito). Sí en SQL Server y PostgreSQL dentro de transacción | No en Oracle y MySQL |
| Reinicia IDENTITY o AUTO_INCREMENT | No | Sí | Desaparece |

- Para borrar los datos **sin borrar la definición** de la tabla: **DELETE** (o TRUNCATE) **[Salió 2022]**. DROP TABLE se lleva la estructura. REMOVE y ERASE no existen.
- **DROP** elimina la estructura de la tabla junto con sus datos **[Salió 2024]**. No es DCL, no usa WHERE.
- La tabla se borra con `DROP TABLE nombre`, no con `DELETE TABLE` **[Salió 2016]**.
- `DROP TABLE t CASCADE CONSTRAINTS` (Oracle) borra también las FK que apuntan a ella. En el estándar: `DROP TABLE t CASCADE` o `RESTRICT`.
- Oracle tiene papelera: `DROP TABLE` la envía a RECYCLEBIN y `FLASHBACK TABLE t TO BEFORE DROP` la recupera. `PURGE` la borra del todo.
- `IF EXISTS` / `IF NOT EXISTS`: MySQL, PostgreSQL, SQL Server 2016+ y Oracle 23ai.

### 2.6 Índices

`CREATE INDEX` **no forma parte del estándar ANSI**. Todos los SGBD lo implementan con sintaxis parecida.

```sql
CREATE INDEX idx_act_fecha ON ACTIVIDADES (fecha_inicio) TABLESPACE t_indices; -- Oracle
CREATE UNIQUE INDEX ux_dni ON Opositor (DNI);
CREATE INDEX idx_x USING BTREE ON t (col);  -- MySQL
```

- En Oracle el índice por defecto es **B-tree**. No hace falta indicarlo. La cláusula `TABLESPACE` elige dónde se guarda **[Salió 2015]**.
- Otros tipos: bitmap (Oracle, columnas de baja cardinalidad), hash, GiST/GIN (PostgreSQL), índices de texto completo.
- La PRIMARY KEY y UNIQUE crean un índice automáticamente.
- Un índice acelera lecturas y ralentiza INSERT, UPDATE y DELETE.

### 2.7 Secuencias y columnas autonuméricas

```sql
-- Estándar SQL:2003 y Oracle
CREATE SEQUENCE seq_clientes START WITH 150 INCREMENT BY 1;
SELECT seq_clientes.NEXTVAL FROM dual;          -- Oracle
INSERT INTO clientes VALUES (NEXT VALUE FOR seq_clientes, 'Ana'); -- estándar, SQL Server
SELECT nextval('seq_clientes');                 -- PostgreSQL

-- Columna identidad estándar (Oracle 12c+, PostgreSQL, SQL Server con su sintaxis)
id INTEGER GENERATED ALWAYS AS IDENTITY
id INT IDENTITY(1,1)        -- SQL Server
id INT AUTO_INCREMENT       -- MySQL
```

La secuencia que empieza en 150 se crea con `START WITH 150` **[Salió 2015]**. Otras opciones: `MINVALUE`, `MAXVALUE`, `CYCLE`, `CACHE`. `CURRVAL` devuelve el último valor obtenido en la sesión.

Antes de existir secuencias se calculaba `MAX(secuencia) + 1`. Es la idea de 2008 b3 5. Es una mala práctica: dos sesiones concurrentes pueden obtener el mismo número.

### 2.8 Vistas

Una vista es una consulta guardada con nombre. Se usa como una tabla, pero no almacena datos (salvo las materializadas).

```sql
CREATE VIEW TrabajadoresPorEdad AS
SELECT edad, COUNT(*) AS num
FROM Trabajadores
GROUP BY edad;
```

Es la respuesta de 2017 b3 2 **[Salió 2017]**: COUNT con GROUP BY. Fallaban las opciones con SUM, AVG o sin GROUP BY.

- `CREATE OR REPLACE VIEW` la redefine (Oracle, MySQL, PostgreSQL). SQL Server usa `CREATE OR ALTER VIEW`.
- `WITH CHECK OPTION` impide insertar o actualizar a través de la vista filas que la vista no vería.
- Una vista es **actualizable** si sale de una sola tabla, sin agregados, DISTINCT, GROUP BY ni UNION.
- Ventajas: seguridad (ocultar columnas o filas), simplificar consultas, independencia lógica.
- **Vista materializada**: guarda el resultado y se refresca. No es estándar. Existe en Oracle y PostgreSQL; SQL Server usa vistas indexadas.

`CREATE TABLE nueva AS SELECT ...` (CTAS) crea una tabla con la estructura y los datos de la consulta.

## 3. DML: modificación de datos

### 3.1 INSERT

```sql
INSERT INTO CuerpoBecado (Codigo, Denominacion)
VALUES ('TAI', 'Técnico Auxiliar de Informática');

INSERT INTO t VALUES (1, 'a'), (2, 'b');       -- varias filas (SQL-92 en adelante)
INSERT INTO historico (id, nombre) SELECT id, nombre FROM clientes WHERE baja = 1;
```

Reglas que deciden las preguntas **[Salió 2005, 2008, 2024]**:

- Es `INSERT INTO`, no `INSERT TO`.
- Las cadenas y fechas van entre **comillas simples**. Sin comillas, `TAI` se interpreta como nombre de columna.
- Una comilla sin cerrar (`'TAI, '...`) rompe la sentencia.
- Igual número de columnas que de valores, en el mismo orden.
- **INSERT no lleva WHERE**. Las opciones con `... VALUES (...) WHERE cdcdad='04'` son falsas **[Salió 2008]**.
- Hay que indicar la tabla tras INTO.
- Si se omite la lista de columnas, hay que dar valor a todas, en el orden de la tabla.
- Dar de alta datos nuevos es INSERT; UPDATE modifica filas existentes **[Salió 2005]**.

### 3.2 UPDATE

```sql
UPDATE Ejercicio SET Duracion = Duracion * 1.1;            -- +10 % a todas
UPDATE Empleado SET sueldo = sueldo + 100, categoria = 'B'
WHERE  id = 7;
UPDATE Empleado e SET sueldo = (SELECT AVG(sueldo) FROM Empleado)
WHERE  e.categoria = 'C';
```

- Sintaxis: `UPDATE tabla SET col = expr [, ...] [WHERE condición]` **[Salió 2019]**.
- Sin WHERE se actualizan **todas** las filas.
- No existen `UPDATE TABLE`, `UPDATE ... FROM` en el estándar, ni operadores `*=` o `10%`.
- SQL Server sí admite `UPDATE ... FROM` con JOIN, pero no es ANSI.

### 3.3 DELETE

```sql
DELETE FROM impuestos;                                     -- todas las filas
DELETE FROM impuestos WHERE ejercicio < 2000;
DELETE FROM pedidos WHERE idcliente IN (SELECT id FROM clientes WHERE baja = 1);
```

- DELETE borra **filas**, no objetos. "DELETE borra bases de datos, tablas o índices" es falso **[Salió 2022]**. Eso es DROP.
- Admite WHERE y subconsultas **[Salió 2005]**.
- `DELETE '' FROM tabla` o `DELETE * FROM tabla` no son SQL estándar (el segundo es de Access).
- En SQL Server y MySQL `FROM` es opcional en `DELETE tabla`. En el estándar se escribe.

### 3.4 MERGE (upsert)

Introducido en SQL:2003. Inserta o actualiza según exista la fila.

```sql
MERGE INTO clientes c
USING nuevos n ON (c.id = n.id)
WHEN MATCHED THEN UPDATE SET c.nombre = n.nombre
WHEN NOT MATCHED THEN INSERT (id, nombre) VALUES (n.id, n.nombre);
```

MySQL no tiene MERGE: usa `INSERT ... ON DUPLICATE KEY UPDATE`. PostgreSQL tiene `INSERT ... ON CONFLICT` y MERGE desde la versión 15.

### 3.5 Carga masiva

```sql
-- MySQL: CSV del equipo cliente, separado por comas, saltando la cabecera
LOAD DATA LOCAL INFILE 'inscripciones.csv'
INTO TABLE Inscripcion
FIELDS TERMINATED BY ',' ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;
```

- `LOCAL` indica que el fichero está en el **cliente**. Sin LOCAL, se lee del servidor **[Salió 2018]**.
- `IGNORE 1 LINES` e `IGNORE 1 ROWS` son sinónimos.
- No existe `LOAD FROM`. El orden es `LOAD DATA [LOCAL] INFILE`.
- Equivalentes: `BULK INSERT` (SQL Server), `COPY` (PostgreSQL), SQL*Loader (Oracle). La exportación en MySQL: `SELECT ... INTO OUTFILE`.

## 4. Consultas con SELECT

### 4.1 Estructura y orden lógico de evaluación

```sql
SELECT   [DISTINCT] columnas, expresiones, agregados
FROM     tablas y JOIN
WHERE    condición sobre filas
GROUP BY columnas de agrupación
HAVING   condición sobre grupos
ORDER BY columnas [ASC|DESC]
OFFSET n ROWS FETCH FIRST m ROWS ONLY;
```

El SGBD no la evalúa en el orden en que se escribe. El **orden lógico** es:

1. FROM (y JOIN)
2. WHERE
3. GROUP BY
4. HAVING
5. SELECT (expresiones y alias)
6. DISTINCT
7. ORDER BY
8. OFFSET / FETCH (LIMIT)

Consecuencias:

- De las cláusulas WHERE, GROUP BY, HAVING y ORDER BY, se ejecuta primero **WHERE** **[Salió 2008]**.
- En WHERE **no se pueden usar agregados** (aún no hay grupos). Por eso `WHERE COUNT(*) > 1` es error **[Salió 2017, 2018, 2019]**.
- En WHERE no se puede usar un alias del SELECT (`WHERE NumeroSolicitudes > 1` falla) **[Salió 2019]**.
- En ORDER BY sí se pueden usar alias, porque se evalúa después del SELECT.

### 4.2 Proyección, alias, DISTINCT y CASE

```sql
SELECT nombre AS "Nombre completo", sueldo * 12 AS anual FROM Empleado;
SELECT DISTINCT provincia FROM Empleado;
SELECT IdProceso,
       CASE IdFormaAcceso
            WHEN 'L' THEN 'Ingreso Libre'
            WHEN 'P' THEN 'Promocion Interna'
       END AS FormaAcceso
FROM Proceso;
```

- **CASE** es la expresión condicional estándar **[Salió 2019]**. Formas: simple (`CASE col WHEN valor`) y buscada (`CASE WHEN condición`). Sin ELSE devuelve NULL.
- `IF ... THEN ... ENDIF`, `SWITCH` o `IIF` no son ANSI. IIF existe en SQL Server y Access; IF() en MySQL; DECODE en Oracle.
- `DISTINCT` elimina filas duplicadas del resultado. **No es una función de agregación** **[Salió 2017]**.
- Cálculos en el SELECT: `importe * 0.20 AS canon` calcula un 20 % **[Salió 2015]**.

### 4.3 WHERE: operadores

| Operador | Ejemplo | Nota |
|---|---|---|
| Comparación | `=, <>, !=, <, >, <=, >=` | `<>` es el estándar; `!=` lo admiten casi todos |
| BETWEEN | `ejercicio BETWEEN 2000 AND 2004` | Incluye ambos extremos |
| IN | `ejercicio IN (2000, 2001, 2002)` | Lista o subconsulta |
| LIKE | `nombre LIKE 'PAL%'` | Patrón con comodines |
| IS NULL | `email IS NULL` | Nunca `= NULL` |
| EXISTS | `EXISTS (SELECT ...)` | Cierto si la subconsulta devuelve filas |
| Lógicos | `AND, OR, NOT` | NOT > AND > OR en precedencia |

- BETWEEN puede ir en un WHERE, por supuesto **[Salió 2016]**.
- Para los años 2000 a 2004 valen `BETWEEN 2000 AND 2004` y `IN (2000, 2001, 2002, 2003, 2004)` **[Salió 2005]**. `IN (2000 TO 2004)` no existe.
- Fechas en el estándar: literal `DATE '2016-01-01'`. Comparar fecha de inicio igual o posterior al 1/1/2016: `fecha_inicio >= DATE '2016-01-01'` **[Salió 2015]**. En Oracle también `TO_DATE('01/01/2016','DD/MM/YYYY')`.

### 4.4 LIKE y comodines

| Comodín | Significado | Ejemplo |
|---|---|---|
| `%` | Cero o más caracteres | `'PAL%'`: empieza por PAL |
| `_` | Exactamente un carácter | `'_A%'`: segunda letra A |

```sql
SELECT * FROM Opositor WHERE DNI LIKE '3%';              -- empieza por 3
SELECT * FROM FicheroAdjunto WHERE Denominacion NOT LIKE '%.pdf';  -- no termina en .pdf
SELECT * FROM t WHERE codigo LIKE '10\%%' ESCAPE '\';      -- empieza por "10%"
```

- LIKE es el operador que busca por patrón **[Salió 2015]**. Empezar por PAL: `LIKE 'PAL%'` **[Salió 2016]**. DNI que empieza por 3: `LIKE '3%'` **[Salió 2019]**.
- `*` y `?` son comodines de Access, no de SQL. `&` y `$` tampoco son comodines.
- `LIKE 'pdf'` sin comodín equivale a `= 'pdf'` **[Salió 2024]**.
- La distinción de mayúsculas depende de la intercalación (*collation*). MySQL y SQL Server suelen ser insensibles por defecto; Oracle y PostgreSQL, sensibles. PostgreSQL tiene ILIKE.
- `SIMILAR TO` (estándar) y `REGEXP_LIKE` (Oracle) usan expresiones regulares.

### 4.5 ORDER BY y limitar filas

```sql
SELECT * FROM Empleados ORDER BY Provincia DESC, Municipio;
```

Ordena por Provincia descendente y, dentro de cada provincia, por Municipio **ascendente** **[Salió 2016]**. ASC es el valor por defecto y se aplica a cada columna por separado.

- `ORDER BY 2` ordena por la segunda columna del SELECT.
- Los NULL van al final en ASC en Oracle y PostgreSQL; al principio en MySQL y SQL Server. El estándar permite `NULLS FIRST` / `NULLS LAST`.
- Limitar filas: `FETCH FIRST 10 ROWS ONLY` (estándar SQL:2008, Oracle 12c+, PostgreSQL), `LIMIT 10` (MySQL, PostgreSQL), `TOP 10` (SQL Server), `ROWNUM` (Oracle clásico).

### 4.6 El valor NULL

NULL significa "desconocido" o "no aplicable". SQL usa **lógica trivaluada**: TRUE, FALSE, UNKNOWN.

- `NULL = NULL` es UNKNOWN, no TRUE. Se pregunta con `IS NULL`.
- Cualquier operación aritmética con NULL da NULL.
- WHERE solo deja pasar filas con TRUE.
- `COALESCE(a, b, c)` devuelve el primer no nulo. `NULLIF(a, b)` devuelve NULL si son iguales. Oracle: `NVL`; SQL Server: `ISNULL`; MySQL: `IFNULL`.
- Trampa clásica: `x NOT IN (subconsulta)` no devuelve nada si la subconsulta contiene un NULL. Usa `NOT EXISTS`.

## 5. Agregados, GROUP BY y HAVING

### 5.1 Funciones de agregación

| Función | Devuelve | Nulos |
|---|---|---|
| COUNT(*) | Número de filas | Las cuenta |
| COUNT(col) | Filas con col no nula | Las ignora |
| COUNT(DISTINCT col) | Valores distintos no nulos | Los ignora |
| SUM(col) | Suma | Ignora |
| AVG(col) | Media | Ignora (no cuenta como 0) |
| MAX(col), MIN(col) | Máximo, mínimo | Ignora |

- Funciones de agrupamiento: **AVG y SUM** **[Salió 2005]**. GROUP BY, HAVING y UNION no son funciones.
- **DISTINCT no es** de agregación **[Salió 2017]**.
- Número de nombres distintos: `SELECT COUNT(DISTINCT Nombre) FROM Clientes` **[Salió 2017]**. `SELECT DISTINCT Nombre` lista los nombres, no los cuenta.
- `COUNT(1)` equivale a `COUNT(*)` **[Salió 2008]**.
- Sobre una tabla vacía, COUNT devuelve 0 y SUM, AVG, MAX y MIN devuelven NULL.
- Estándar desde SQL:2016: `LISTAGG(col, ',')` concatena valores. MySQL tiene `GROUP_CONCAT`; SQL Server y PostgreSQL, `STRING_AGG`.

### 5.2 GROUP BY

Forma grupos de filas con el mismo valor en las columnas indicadas. Devuelve una fila por grupo.

**Regla de oro**: toda columna del SELECT que no esté dentro de un agregado debe aparecer en GROUP BY.

```sql
-- Coches comprados de cada marca en cada municipio (2008 ej1 51)
SELECT COUNT(1), C.MARCA, B.MUNICIPIO
FROM   COMPRAS A, PERSONA B, COCHE C
WHERE  B.IDPERSONA = A.IDPERSONA AND C.IDCOCHE = A.IDCOCHE
GROUP BY C.MARCA, B.MUNICIPIO;

-- Número de aulas por edificio (2018 b3 9)
SELECT idEdificio, COUNT(*) FROM Aula GROUP BY idEdificio;
```

- Agrupar solo por MARCA dejando MUNICIPIO en el SELECT es error **[Salió 2008]**. MySQL lo toleraba antes de 5.7 (ONLY_FULL_GROUP_BY); hoy también da error.
- `GROUP BY a AND GROUP BY b` no existe: se separan con comas.
- Extensiones SQL:1999: `ROLLUP` (subtotales jerárquicos), `CUBE` (todas las combinaciones), `GROUPING SETS`.

### 5.3 HAVING

HAVING filtra **grupos**, después del GROUP BY. WHERE filtra **filas**, antes de agrupar.

- Definición literal: "especificar una condición de búsqueda para un grupo o agregado" **[Salió 2008]**.
- Se usa habitualmente con GROUP BY **[Salió 2016]**. Usar HAVING **no impide** usar WHERE en la misma sentencia.
- HAVING no es DDL ni sirve para fechas.

```sql
-- Personas por lugar, solo si superan diez (2018 ej1 48)
SELECT lugar, COUNT(*) AS numPersonas
FROM Personal GROUP BY lugar HAVING COUNT(*) > 10;

-- Opositores con más de una solicitud (2019 b3 17)
SELECT IdOpositor, COUNT(IdSolicitud)
FROM Solicitud GROUP BY IdOpositor HAVING COUNT(IdSolicitud) > 1;

-- Categorías con sueldo medio inferior a la media general (2017 ej1 46)
SELECT CATEGORIA, AVG(SUELDO)
FROM EMPLEADO GROUP BY CATEGORIA
HAVING AVG(SUELDO) < (SELECT AVG(SUELDO) FROM EMPLEADO);
```

**[Salió 2017, 2018, 2019]**. Todas siguen el mismo patrón: el filtro sobre el agregado va en HAVING.

Interpretar el resultado **[Salió 2015]**:

```sql
SELECT Modelo, Color, COUNT(Bastidor) AS Num
FROM COCHES_VENTA GROUP BY Modelo, Color HAVING COUNT(Bastidor) <= 1;
```

Lista las combinaciones de modelo y color con una unidad o menos en venta. Sirve para avisar de que conviene reponer existencias.

Combinación completa con traza:

```sql
-- Tabla cuentas
-- empresa1 | 50
-- empresa2 | 80
-- empresa2 | 40
-- empresa3 | 90
SELECT nombre_empresa, SUM(cantidad)
FROM cuentas
WHERE nombre_empresa <> 'empresa1'
GROUP BY nombre_empresa
HAVING SUM(cantidad) > 100
ORDER BY nombre_empresa ASC;
-- Resultado: empresa2 | 120
```

WHERE quita empresa1. GROUP BY suma: empresa2 = 120, empresa3 = 90. HAVING deja solo empresa2.

## 6. Combinación de tablas (JOIN)

### 6.1 Tipos de JOIN del estándar

Desde SQL-92, el estándar define estos JOIN **[Salió 2015]**: **INNER, LEFT / RIGHT / FULL [OUTER] y CROSS**. Además NATURAL JOIN y la cláusula USING.

| JOIN | Devuelve |
|---|---|
| [INNER] JOIN | Solo filas con pareja en ambas tablas |
| LEFT [OUTER] JOIN | Todas las de la izquierda; NULL si no hay pareja a la derecha |
| RIGHT [OUTER] JOIN | Todas las de la derecha; NULL si no hay pareja a la izquierda |
| FULL [OUTER] JOIN | Todas las de ambas; NULL donde falte pareja |
| CROSS JOIN | Producto cartesiano: todas con todas |
| NATURAL JOIN | INNER JOIN por todas las columnas de igual nombre |

- `JOIN` a secas equivale a **INNER JOIN** **[Salió 2016, 2025]**. La palabra INNER es opcional; OUTER también.
- MySQL no tiene FULL OUTER JOIN: se simula con LEFT JOIN UNION RIGHT JOIN.
- Oracle clásico usaba `(+)` para el outer join: `WHERE a.id = b.id(+)`.

```sql
-- Sintaxis explícita (SQL-92)
SELECT e.nombre, d.nombre
FROM Empleado e INNER JOIN Departamento d ON e.dep_id = d.dep_id;

-- Sintaxis implícita (SQL-86): mismo resultado
SELECT e.nombre, d.nombre
FROM Empleado e, Departamento d
WHERE e.dep_id = d.dep_id;

-- USING cuando la columna se llama igual
SELECT * FROM Empleado JOIN Departamento USING (dep_id);
```

Si se listan dos tablas en el FROM sin condición de unión, el resultado es el **producto cartesiano**. Con 5 provincias y 100 municipios salen 500 filas. Es la trampa de 2005 b3 14.

### 6.2 Anti-join: filas sin pareja

"Ciudadanos sin inscripciones previas" **[Salió 2018]**:

```sql
SELECT Ciudadano.NIF
FROM   Ciudadano LEFT JOIN Inscripcion
       ON Ciudadano.NIF = Inscripcion.NIF
WHERE  Inscripcion.NIF IS NULL;

-- Equivalentes
SELECT NIF FROM Ciudadano c
WHERE NOT EXISTS (SELECT 1 FROM Inscripcion i WHERE i.NIF = c.NIF);

SELECT NIF FROM Ciudadano EXCEPT SELECT NIF FROM Inscripcion;  -- MINUS en Oracle
```

Con INNER JOIN la condición `IS NULL` nunca se cumple: no devuelve nada.

### 6.3 Autocombinación (self join)

Una tabla combinada consigo misma con dos alias. Caso de 2017 b3 1: trabajadores con el nombre del director de su ubicación. El director es otro trabajador.

```sql
SELECT t.nombre AS trabajador, d.nombre AS director
FROM   Trabajadores t
       JOIN Ubicaciones u  ON t.ubicacion = u.ubicacion
       JOIN Trabajadores d ON u.director  = d.codigo;
```

La clave es volver a la tabla Trabajadores con otro alias para sacar el nombre del director **[Salió 2017]**.

### 6.4 Operadores de conjuntos

| Operador | Resultado |
|---|---|
| UNION | Filas de ambas consultas, sin duplicados |
| UNION ALL | Filas de ambas, con duplicados (más rápido) |
| INTERSECT | Filas comunes |
| EXCEPT | Filas de la primera que no están en la segunda. Oracle lo llama MINUS (desde 21c admite EXCEPT) |

Las consultas deben tener el mismo número de columnas y tipos compatibles. ORDER BY solo va al final.

## 7. Subconsultas, CTE y funciones de ventana

### 7.1 Subconsultas

Una subconsulta es un SELECT dentro de otra sentencia, entre paréntesis.

| Tipo | Devuelve | Se compara con |
|---|---|---|
| Escalar | Un valor | `=, <, >` |
| De fila o lista | Varias filas, una columna | `IN, ANY, SOME, ALL` |
| De tabla (derivada) | Una tabla | Va en el FROM, con alias |
| Correlacionada | Depende de la fila externa | Se reevalúa por cada fila |

- El resultado de una subconsulta **no se visualiza**: solo lo usa la consulta externa **[Salió 2007]**.
- Una subconsulta puede contener otra subconsulta y puede devolver varias columnas (en EXISTS o en FROM).
- No necesita ORDER BY; en la mayoría de SGBD no se admite dentro de una subconsulta de WHERE.
- Si una subconsulta escalar devuelve más de una fila, da error. Por eso `> (SELECT AVG(...) ... GROUP BY dep)` falla con varios departamentos.

Operadores cuantificados:

- `> ALL (subconsulta)`: mayor que todos los valores (mayor que el máximo).
- `> ANY (subconsulta)` o `> SOME`: mayor que alguno (mayor que el mínimo).
- `= ANY` equivale a `IN`. `<> ALL` equivale a `NOT IN`.

```sql
-- Investigadores con salario superior a la media (2016 b3 16)
SELECT nombre, salario FROM investigadores
WHERE salario > (SELECT AVG(salario) FROM investigadores);

-- Salario mayor que la media de TODOS los departamentos
SELECT nombre, salario FROM investigadores
WHERE salario > ALL (SELECT AVG(salario) FROM investigadores GROUP BY dep_id);
```

Subconsultas anidadas de 2024 b3 23 **[Salió 2024]**:

```sql
SELECT * FROM FicheroAdjunto
WHERE Denominacion NOT LIKE '%.pdf'
  AND IdSolicitudBeca = (SELECT IdSolicitudBeca FROM SolicitudBeca
                         WHERE AñoConvocatoria = 2024
                           AND IdInteresado = (SELECT IdInteresado FROM Interesado
                                               WHERE DocumentoIdentidad = '00000000T'));
```

Las opciones falsas: usaban LIKE en vez de NOT LIKE, omitían el FROM Interesado, quitaban el filtro de DNI o ponían `'pdf'` sin `%`.

Tabla derivada en el FROM **[Salió 2006]**:

```sql
SELECT a.c1, b.c2 FROM (SELECT c1 FROM c WHERE c3 IS NOT NULL) a, b;
-- Mismo resultado que:
SELECT c.c1, b.c2 FROM c, b WHERE c.c3 IS NOT NULL;
```

Es válido. Solo hacen falta las tablas `b` y `c`; `a` es un alias. No crea ninguna tabla temporal que haya que borrar.

### 7.2 Subconsulta correlacionada: el N-ésimo valor

El "tercer salario mínimo" de 2016 b3 17 se resuelve contando cuántos salarios distintos hay por debajo o iguales:

```sql
SELECT DISTINCT e1.salario
FROM investigadores e1 JOIN departamentos d1 ON e1.dep_id = d1.dep_id
WHERE d1.dep_nombre = 'IN_AR'
  AND 3 = (SELECT COUNT(DISTINCT e2.salario)
           FROM investigadores e2 JOIN departamentos d2 ON e2.dep_id = d2.dep_id
           WHERE d2.dep_nombre = 'IN_AR' AND e2.salario <= e1.salario);
```

La subconsulta interna también debe filtrar por el departamento. Si no, cuenta salarios de toda la empresa **[Salió 2016]**.

Con funciones de ventana (SQL:2003) es más legible:

```sql
SELECT salario FROM (
  SELECT salario, DENSE_RANK() OVER (ORDER BY salario) AS pos
  FROM investigadores WHERE dep_id = 7) t
WHERE pos = 3;
```

### 7.3 Funciones de ventana

Calculan sobre un conjunto de filas relacionadas sin agruparlas. Sintaxis: `función OVER (PARTITION BY ... ORDER BY ...)`.

| Función | Con valores 100, 200, 200, 300 |
|---|---|
| ROW_NUMBER() | 1, 2, 3, 4 |
| RANK() | 1, 2, 2, 4 (deja huecos) |
| DENSE_RANK() | 1, 2, 2, 3 (sin huecos) |

Otras: `LAG`, `LEAD`, `FIRST_VALUE`, `NTILE`, y los agregados con OVER (`SUM(x) OVER (...)` para acumulados). MySQL las soporta desde la 8.0.

### 7.4 Expresiones de tabla comunes (WITH)

```sql
WITH ventas_dep AS (
  SELECT dep_id, SUM(importe) AS total FROM ventas GROUP BY dep_id)
SELECT * FROM ventas_dep WHERE total > 1000;

-- Recursiva (SQL:1999): jerarquía de empleados
WITH RECURSIVE jerarquia (id, jefe, nivel) AS (
  SELECT id, jefe, 1 FROM empleado WHERE jefe IS NULL
  UNION ALL
  SELECT e.id, e.jefe, j.nivel + 1
  FROM empleado e JOIN jerarquia j ON e.jefe = j.id)
SELECT * FROM jerarquia;
```

Oracle no exige la palabra RECURSIVE y tiene además `CONNECT BY`.

## 8. Funciones escalares

### 8.1 Cadenas

| Operación | Estándar | Oracle | MySQL | SQL Server |
|---|---|---|---|---|
| Concatenar | Operador doble barra vertical | Doble barra vertical, CONCAT | CONCAT(a,b) | `a + b`, CONCAT |
| Longitud | CHAR_LENGTH | LENGTH | CHAR_LENGTH, LENGTH (bytes) | LEN |
| Subcadena | SUBSTRING(s FROM 2 FOR 3) | SUBSTR(s,2,3) | SUBSTRING(s,2,3) | SUBSTRING(s,2,3) |
| Mayúsculas | UPPER, LOWER | igual | igual | igual |
| Recortar | TRIM | TRIM, LTRIM, RTRIM | igual | igual |
| Posición | POSITION('a' IN s) | INSTR | LOCATE, INSTR | CHARINDEX |

En MySQL, `||` es OR lógico salvo con el modo PIPES_AS_CONCAT.

### 8.2 Fechas

| Operación | Estándar | Oracle | MySQL | SQL Server |
|---|---|---|---|---|
| Fecha actual | CURRENT_DATE | SYSDATE, CURRENT_DATE | CURDATE(), CURRENT_DATE | GETDATE(), CAST(GETDATE() AS DATE) |
| Fecha y hora | CURRENT_TIMESTAMP | SYSTIMESTAMP | NOW() | SYSDATETIME() |
| Extraer mes | EXTRACT(MONTH FROM f) | EXTRACT, TO_CHAR(f,'MM') | MONTH(f), EXTRACT | MONTH(f), DATEPART |
| Cadena a fecha | CAST('2016-01-01' AS DATE) | TO_DATE(s, formato) | STR_TO_DATE(s, formato) | CONVERT, CAST |
| Fecha a cadena | CAST | TO_CHAR(f, formato) | DATE_FORMAT(f, formato) | FORMAT, CONVERT |
| Sumar días | `f + INTERVAL '1' DAY` | `f + 1` | DATE_ADD(f, INTERVAL 1 DAY) | DATEADD(day,1,f) |

Preguntas que han caído:

- Fecha actual de ejecución de la consulta: **CURRENT_DATE** en estándar (SYSDATE en Oracle) **[Salió 2015]** (sin verificar la opción exacta).
- MySQL, convertir cadena en fecha: **STR_TO_DATE** **[Salió 2016]**. TO_DATE es de Oracle.
- MySQL, contratados en octubre de cualquier año: `WHERE MONTH(contratado) = 10` **[Salió 2016]**.
- MySQL, fecha actual con formato "Marzo 5, 2017": `DATE_FORMAT(CURDATE(), '%M %e, %Y')` **[Salió 2016]**.

Especificadores de DATE_FORMAT en MySQL:

| Código | Significado | Ejemplo |
|---|---|---|
| %Y | Año con 4 cifras | 2017 |
| %y | Año con 2 cifras | 17 |
| %M | Nombre del mes | March (Marzo con lc_time_names=es_ES) |
| %m | Mes con 2 cifras | 03 |
| %c | Mes sin cero | 3 |
| %d | Día con 2 cifras | 05 |
| %e | Día sin cero | 5 |
| %W / %a | Día de la semana completo / abreviado | Sunday / Sun |
| %H:%i:%s | Hora, minutos, segundos | 14:05:09 |

Ojo: en MySQL los minutos son `%i`, no `%m`.

En ODBC y en el estándar, el operador `+` entre una fecha y un número **añade días** y produce una nueva fecha **[Salió 2005]**. En Oracle, `SYSDATE + 1` es mañana. La resta de dos fechas da los días entre ellas.

### 8.3 Conversión y nulos

- `CAST(expr AS tipo)`: conversión estándar.
- `COALESCE`, `NULLIF`: ver apartado 4.6.
- Oracle 23ai permite `SELECT 1;` sin `FROM dual`.

## 9. DCL: seguridad y privilegios

### 9.1 GRANT y REVOKE

```sql
GRANT SELECT ON ENTIDADES_EXTERNAS TO museo_consulta;
GRANT SELECT, UPDATE (SALARIO) ON EMPLEADOS TO USUARIO1;
GRANT INSERT ON pedidos TO ana WITH GRANT OPTION;
GRANT ALL PRIVILEGES ON pedidos TO admin_app;
GRANT EXECUTE ON PROCEDURE alta_cliente TO app;
REVOKE UPDATE ON EMPLEADOS FROM USUARIO1;
REVOKE GRANT OPTION FOR INSERT ON pedidos FROM ana CASCADE;
```

- Orden: `GRANT privilegios ON objeto TO usuario` **[Salió 2015, 2016]**. Poner la tabla antes de ON (`GRANT EMPLEADOS ON SELECT ...`) es incorrecto.
- Permitir actualizar solo SALARIO sin dar de alta empleados: `GRANT SELECT, UPDATE(SALARIO) ON EMPLEADOS TO USUARIO1` **[Salió 2016]**. No se concede INSERT.
- Privilegios de objeto del estándar: SELECT, INSERT, UPDATE, DELETE, REFERENCES, USAGE, TRIGGER, EXECUTE, UNDER. INSERT, UPDATE y REFERENCES admiten lista de columnas.
- `WITH GRANT OPTION`: el receptor puede conceder el privilegio a otros.
- `REVOKE ... CASCADE` retira también lo que el usuario concedió a terceros. `RESTRICT` falla si hay dependencias.
- `PUBLIC` representa a todos los usuarios.

### 9.2 Roles

```sql
CREATE ROLE consultor;
GRANT SELECT ON ventas TO consultor;
GRANT consultor TO ana;
```

Roles predefinidos en Oracle: CONNECT, RESOURCE, DBA y, desde 23ai, DB_DEVELOPER_ROLE.

### 9.3 DENY en Transact-SQL

SQL Server tiene tres estados de permiso: concedido (GRANT), denegado (DENY) y ninguno.

- **DENY** es una sentencia **DCL** **[Salió 2025]**. Prohíbe explícitamente un permiso y **prevalece sobre GRANT**, aunque este venga de un rol.
- **REVOKE** solo quita un GRANT o un DENY previo. No prohíbe: el usuario puede seguir teniendo el permiso por un rol.
- DENY no existe en el estándar, Oracle, MySQL ni PostgreSQL.
- No afecta a sysadmin ni al propietario del objeto.
- Excepción histórica: un GRANT a nivel de columna prevalece sobre un DENY a nivel de tabla.

```sql
DENY DELETE ON dbo.Pedidos TO becario;
```

### 9.4 Usuarios

```sql
-- Oracle
CREATE USER museo IDENTIFIED BY "Clave_2025"
  DEFAULT TABLESPACE users QUOTA 10M ON users;
GRANT CREATE SESSION, CREATE TABLE TO museo;

-- MySQL
CREATE USER 'ana'@'localhost' IDENTIFIED BY 'clave';
GRANT SELECT ON tienda.* TO 'ana'@'localhost';

-- SQL Server: login en el servidor y usuario en la base
CREATE LOGIN ana WITH PASSWORD = 'Clave_2025';
CREATE USER ana FOR LOGIN ana;
```

- En Oracle, la sintaxis es `CREATE USER nombre IDENTIFIED BY contraseña` **[Salió 2025]**: la respuesta fue `CREATE USER EDUCA_USER IDENTIFIED BY password123;`. Sin el privilegio CREATE SESSION no puede conectarse.
- Oracle 23ai añade privilegios por esquema: `GRANT SELECT ANY TABLE ON SCHEMA hr TO ana`.

## 10. Transacciones (TCL)

### 10.1 Concepto y sentencias

Una transacción es una unidad lógica de trabajo que cumple **ACID**: atomicidad, consistencia, aislamiento y durabilidad (se estudia a fondo en el tema 14).

| Sentencia | Efecto |
|---|---|
| START TRANSACTION / BEGIN | Inicia una transacción explícita |
| COMMIT | Confirma los cambios y los hace permanentes |
| ROLLBACK | Deshace todos los cambios desde el inicio de la transacción |
| SAVEPOINT s | Marca un punto intermedio |
| ROLLBACK TO SAVEPOINT s | Deshace hasta el punto, sin terminar la transacción |
| RELEASE SAVEPOINT s | Elimina el punto |
| SET TRANSACTION | Fija aislamiento o modo (READ ONLY) |

- **COMMIT** confirma los cambios realizados por la transacción **[Salió 2008]**.
- **ROLLBACK** deshace los cambios no confirmados **[Salió 2025]**.
- **SAVEPOINT** define un punto de salvaguarda dentro de una transacción **[Salió 2019]**. Permite revertir hasta él con ROLLBACK **[Salió 2018]**. No existe RECOVERPOINT.

```sql
-- Traza en Oracle
INSERT INTO t VALUES (1);
SAVEPOINT a;
INSERT INTO t VALUES (2);
SAVEPOINT b;
INSERT INTO t VALUES (3);
ROLLBACK TO SAVEPOINT a;   -- en Oracle basta "ROLLBACK TO a"
COMMIT;
-- Queda solo la fila 1. El savepoint b se pierde al volver a a.
```

Diferencias entre SGBD:

- **Oracle**: la transacción empieza sola con la primera sentencia DML. No hay autocommit en SQL*Plus. Cada DDL hace **COMMIT implícito** antes y después.
- **MySQL**: autocommit activado por defecto. Con InnoDB, `START TRANSACTION` lo suspende. DDL también hace commit implícito. MyISAM no admite transacciones.
- **SQL Server**: autocommit por defecto. `BEGIN TRAN`, `COMMIT TRAN`, `SAVE TRANSACTION s`, `ROLLBACK TRAN s`. El DDL es transaccional.
- **PostgreSQL**: el DDL también es transaccional; se puede hacer ROLLBACK de un CREATE TABLE.

### 10.2 Niveles de aislamiento

```sql
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
```

| Nivel | Lectura sucia | No repetible | Fantasma |
|---|---|---|---|
| READ UNCOMMITTED | Posible | Posible | Posible |
| READ COMMITTED | No | Posible | Posible |
| REPEATABLE READ | No | No | Posible |
| SERIALIZABLE | No | No | No |

Por defecto: READ COMMITTED en Oracle, SQL Server y PostgreSQL; REPEATABLE READ en MySQL InnoDB. Oracle solo implementa READ COMMITTED y SERIALIZABLE.

## 11. Procedimientos y funciones almacenadas

### 11.1 Concepto, ventajas e inconvenientes

Un procedimiento almacenado es un bloque de código con nombre que se **guarda compilado** en el diccionario de la base de datos. Combina sentencias SQL con lógica procedimental: variables, condiciones, bucles y gestión de errores.

- **Procedimiento**: realiza una acción. Se invoca con CALL o EXEC. Devuelve datos por parámetros OUT.
- **Función**: devuelve un valor con RETURN. Se puede usar dentro de un SELECT.

Ventajas:

- Menos tráfico de red: una llamada ejecuta muchas sentencias.
- Rendimiento: el plan se compila y reutiliza.
- Seguridad: se concede EXECUTE sin dar acceso directo a las tablas. Reduce la inyección SQL.
- Reutilización y lógica de negocio centralizada.

Inconvenientes: poca portabilidad entre SGBD, más carga en el servidor, depuración y control de versiones más difíciles.

Lenguajes procedimentales por SGBD:

| SGBD | Lenguaje |
|---|---|
| Estándar | SQL/PSM (ISO/IEC 9075-4) |
| Oracle | PL/SQL (y Java) |
| SQL Server | Transact-SQL (y CLR .NET) |
| PostgreSQL | PL/pgSQL (y PL/Python, PL/Perl...) |
| MySQL / MariaDB | SQL/PSM de MySQL |
| IBM Db2 | SQL PL |

En Oracle, el lenguaje procedimental que admite SQL y se almacena compilado en la base de datos es **PL/SQL** **[Salió 2022]**. Transact-SQL es de SQL Server.

### 11.2 Estándar SQL/PSM y MySQL

```sql
DELIMITER //
CREATE PROCEDURE subir_sueldo (IN p_dep INT, IN p_pct DECIMAL(5,2), OUT p_filas INT)
BEGIN
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    RESIGNAL;
  END;
  START TRANSACTION;
  UPDATE empleado SET sueldo = sueldo * (1 + p_pct / 100) WHERE dep_id = p_dep;
  SET p_filas = ROW_COUNT();
  COMMIT;
END //
DELIMITER ;

CALL subir_sueldo(10, 5, @n);
SELECT @n;
```

- Parámetros: **IN** (entrada, por defecto), **OUT** (salida), **INOUT** (ambas).
- Se ejecuta con **CALL**.
- `DELIMITER` es del cliente mysql: evita que el `;` interno corte la definición.
- Variables: `DECLARE v INT DEFAULT 0;` y `SET v = ...;` o `SELECT ... INTO v`.
- Control: `IF ... THEN ... ELSEIF ... ELSE ... END IF`, `CASE`, `WHILE ... DO ... END WHILE`, `REPEAT ... UNTIL ... END REPEAT`, `LOOP` con `LEAVE`.
- Errores: `DECLARE CONTINUE | EXIT HANDLER FOR ...`, y `SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = '...'` para lanzar uno.
- Funciones: `CREATE FUNCTION f(x INT) RETURNS INT DETERMINISTIC BEGIN RETURN x * 2; END`.

### 11.3 Oracle PL/SQL

Estructura de bloque:

```sql
CREATE OR REPLACE PROCEDURE alta_cliente (
  p_nombre IN  clientes.nombre%TYPE,
  p_id     OUT clientes.id%TYPE)
IS
  v_existe NUMBER;
BEGIN
  SELECT COUNT(*) INTO v_existe FROM clientes WHERE nombre = p_nombre;
  IF v_existe > 0 THEN
    RAISE_APPLICATION_ERROR(-20001, 'Cliente duplicado');
  END IF;
  INSERT INTO clientes (id, nombre)
  VALUES (seq_clientes.NEXTVAL, p_nombre)
  RETURNING id INTO p_id;
EXCEPTION
  WHEN DUP_VAL_ON_INDEX THEN
    RAISE_APPLICATION_ERROR(-20002, 'Clave repetida');
END alta_cliente;
/
```

- Bloque: `DECLARE` (en bloques anónimos) o `IS/AS` (en subprogramas), `BEGIN`, `EXCEPTION`, `END`. Solo BEGIN y END son obligatorios.
- `%TYPE` toma el tipo de una columna; `%ROWTYPE`, el de una fila entera.
- Excepciones predefinidas: `NO_DATA_FOUND`, `TOO_MANY_ROWS`, `ZERO_DIVIDE`, `DUP_VAL_ON_INDEX`, `VALUE_ERROR`, `INVALID_CURSOR`, `OTHERS`.
- Errores de usuario: `RAISE_APPLICATION_ERROR` con códigos de -20000 a -20999.
- Ejecución: `EXEC alta_cliente('Ana', :id);` en SQL*Plus, `CALL`, o dentro de otro bloque `BEGIN alta_cliente(...); END;`.
- Paso de parámetros: posicional, nominal (`p_nombre => 'Ana'`) o mixto.
- **Paquetes**: agrupan procedimientos, funciones, tipos y variables. Tienen especificación (`CREATE PACKAGE`) y cuerpo (`CREATE PACKAGE BODY`).
- Cursores explícitos: `CURSOR c IS SELECT ...; OPEN c; FETCH c INTO v; CLOSE c;` o el bucle `FOR r IN c LOOP ... END LOOP;`. Atributos: `%FOUND`, `%NOTFOUND`, `%ROWCOUNT`, `%ISOPEN`.

### 11.4 SQL Server Transact-SQL

```sql
CREATE PROCEDURE getEmployees
  @LastName  VARCHAR(50),
  @FirstName NVARCHAR(50),
  @Total     INT OUTPUT
AS
BEGIN
  SET NOCOUNT ON;
  SELECT * FROM Empleados WHERE Apellido = @LastName AND Nombre = @FirstName;
  SET @Total = @@ROWCOUNT;
END;
GO
```

Ejecución **[Salió 2018]**:

```sql
EXECUTE getEmployees N'Rojas', N'Pilar';                          -- posicional: válido
EXEC getEmployees @LastName = N'Rojas', @FirstName = N'Pilar';    -- nominal: válido
EXEC getEmployees @FirstName = N'Pilar', @LastName = N'Rojas';    -- nominal en otro orden: válido
EXEC getEmployees @LastName = N'Rojas', N'Pilar';                 -- NO válido
```

Regla: tras un parámetro con nombre, **todos los siguientes deben ir con nombre**. La última forma da error. `EXEC` y `EXECUTE` son sinónimos. El prefijo `N` marca cadena Unicode.

Otros datos de T-SQL:

- Variables con `@`, variables del sistema con `@@` (`@@ROWCOUNT`, `@@ERROR`, `@@IDENTITY`).
- Control de errores: `BEGIN TRY ... END TRY BEGIN CATCH ... END CATCH`, `THROW`, `RAISERROR`.
- `CREATE OR ALTER PROCEDURE` desde SQL Server 2016 SP1.
- Procedimientos del sistema empiezan por `sp_` (por ejemplo `sp_help`).
- `GO` no es T-SQL: es un separador de lotes de las herramientas cliente.

### 11.5 PostgreSQL

Hasta la versión 10 solo había funciones. Desde la **11** existe `CREATE PROCEDURE`, que se invoca con CALL y puede hacer COMMIT dentro.

```sql
CREATE OR REPLACE FUNCTION total_cliente(p_id INT) RETURNS NUMERIC
LANGUAGE plpgsql AS $$
DECLARE v NUMERIC;
BEGIN
  SELECT SUM(importe) INTO v FROM pedidos WHERE cliente_id = p_id;
  RETURN COALESCE(v, 0);
END;
$$;
SELECT total_cliente(5);
```

### 11.6 Cursores y SQL embebido

Un **cursor** recorre fila a fila el resultado de una consulta. Es el puente entre la lógica de conjuntos de SQL y la lógica de registro a registro de un lenguaje procedimental (desajuste de impedancia).

Ciclo de vida estándar: `DECLARE` → `OPEN` → `FETCH` (en bucle) → `CLOSE`. En SQL embebido en C o COBOL las sentencias van precedidas de `EXEC SQL` y se precompilan.

## 12. Disparadores (triggers)

### 12.1 Concepto

Un disparador es un procedimiento que el SGBD **ejecuta automáticamente** cuando ocurre un evento sobre una tabla o vista **[Salió 2024]**. No se invoca con CALL. Se estandarizó en **SQL:1999**.

Elementos (modelo ECA, evento-condición-acción):

- **Evento**: INSERT, UPDATE (opcionalmente de ciertas columnas) o DELETE **[Salió 2024]**.
- **Momento**: BEFORE, AFTER o INSTEAD OF **[Salió 2024]**.
- **Granularidad**: FOR EACH ROW (una vez por fila) o FOR EACH STATEMENT (una vez por sentencia, por defecto en el estándar).
- **Condición**: cláusula WHEN opcional.
- **Acción**: el cuerpo.

Usos: auditoría, reglas de negocio complejas, integridad que no cubre una CHECK, valores derivados, replicación, sincronizar tablas.

Si el trigger falla, **se cancela la sentencia que lo disparó**. No hay que programar esa cancelación. Por eso en 2024 era INCORRECTA la frase contraria **[Salió 2024]**. Con TRUNCATE no se disparan los triggers de DELETE. DROP no los dispara **[Salió 2024]**.

### 12.2 Sintaxis ANSI (SQL:1999 y posteriores)

```sql
CREATE TRIGGER nombre
  { BEFORE | AFTER | INSTEAD OF }
  { INSERT | DELETE | UPDATE [ OF columna [, ...] ] }
  ON tabla
  [ REFERENCING { OLD [ROW] AS o | NEW [ROW] AS n
                | OLD TABLE AS ot | NEW TABLE AS nt } ... ]
  [ FOR EACH { ROW | STATEMENT } ]
  [ WHEN ( condición ) ]
  cuerpo;
```

Ejemplo completo:

```sql
CREATE TRIGGER Validar_salario
  BEFORE UPDATE OF Salario ON Empleados
  REFERENCING OLD ROW AS antes NEW ROW AS despues
  FOR EACH ROW
  WHEN (despues.Salario < antes.Salario)
  SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No se puede bajar el salario';
```

El inicio válido de 2019 era **`CREATE TRIGGER Validar_salario BEFORE UPDATE OF Salario ON Empleados`** **[Salió 2019]**. Orden fijo: nombre, momento, evento (con OF columnas), ON tabla. Distractores: `CREATE NEW TRIGGER` (sin nombre), `OF TABLE Empleados` (debe ser ON), `IN Empleados`.

En 2025 se volvió a preguntar CREATE TRIGGER ANSI **[Salió 2025]**. La respuesta fue **`CREATE TRIGGER Validar_cambio BEFORE UPDATE ON Departamento`**: mismo orden (nombre, momento, evento, ON tabla), esta vez sin `OF columna`.

Puntos finos:

- Solo hay **un evento por trigger** en el estándar. Oracle, SQL Server y PostgreSQL admiten `INSERT OR UPDATE` o `INSERT, UPDATE`.
- `UPDATE OF col` solo se activa si la sentencia UPDATE nombra esa columna.
- **INSTEAD OF** se añadió en SQL:2008 y se usa sobre **vistas** para hacerlas actualizables.
- Un trigger BEFORE ROW puede modificar los valores nuevos antes de grabarse. Un AFTER no.
- OLD no existe en INSERT; NEW no existe en DELETE.
- Las tablas de transición (OLD TABLE, NEW TABLE) solo se usan en triggers AFTER.
- Cascada: un trigger puede modificar otra tabla y disparar otros triggers. Los SGBD limitan la profundidad (32 en SQL Server).

### 12.3 Oracle

```sql
CREATE OR REPLACE TRIGGER trg_audita_salario
  AFTER UPDATE OF salario ON empleados
  FOR EACH ROW
  WHEN (NEW.salario <> OLD.salario)
BEGIN
  INSERT INTO auditoria (emp_id, antes, despues, fecha, usuario)
  VALUES (:OLD.id, :OLD.salario, :NEW.salario, SYSDATE, USER);
END;
/
```

- En el cuerpo se escribe `:NEW` y `:OLD`, con dos puntos. En la cláusula WHEN, sin dos puntos.
- Predicados `INSERTING`, `UPDATING`, `DELETING` para saber qué evento lo activó.
- Sin FOR EACH ROW, es de sentencia.
- Error de **tabla mutante** (ORA-04091): un trigger de fila no puede consultar la tabla que lo disparó. Se resuelve con *compound triggers* (desde 11g).
- Un trigger normal no puede hacer COMMIT ni ROLLBACK. Solo si declara `PRAGMA AUTONOMOUS_TRANSACTION`.
- Triggers de sistema: sobre `SCHEMA` o `DATABASE` (LOGON, LOGOFF, STARTUP, SHUTDOWN, SERVERERROR) y de DDL (BEFORE CREATE, AFTER DROP...).
- `ALTER TRIGGER t DISABLE` / `ENABLE`.

### 12.4 SQL Server

```sql
CREATE TRIGGER trg_Pedidos_Auditoria
ON dbo.Pedidos
AFTER INSERT, UPDATE
AS
BEGIN
  SET NOCOUNT ON;
  INSERT INTO dbo.Auditoria (PedidoId, Accion, Fecha)
  SELECT i.Id, 'ALTA_O_CAMBIO', SYSDATETIME() FROM inserted i;
END;
```

- **No hay BEFORE**. Solo `AFTER` (sinónimo `FOR`) e `INSTEAD OF`.
- Siempre de sentencia: se ejecuta una vez y ve todas las filas en las pseudotablas **inserted** y **deleted**.
- Un UPDATE llena ambas: deleted con los valores antiguos e inserted con los nuevos.
- `UPDATE(col)` dentro del cuerpo comprueba si la columna se tocó.
- Triggers DDL (`ON DATABASE` / `ON ALL SERVER FOR CREATE_TABLE`) y de LOGON.

### 12.5 MySQL / MariaDB

```sql
CREATE TRIGGER trg_bi_empleado
BEFORE INSERT ON empleado
FOR EACH ROW
BEGIN
  IF NEW.sueldo < 0 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Sueldo negativo';
  END IF;
  SET NEW.alta = NOW();
END;
```

- Solo **FOR EACH ROW** (no hay triggers de sentencia).
- Momentos BEFORE y AFTER; sin INSTEAD OF.
- Desde 5.7.2 se permiten varios triggers para el mismo evento y momento, ordenados con `FOLLOWS` o `PRECEDES`.
- No puede ejecutar COMMIT, ROLLBACK ni devolver resultados.
- Las acciones en cascada de las claves ajenas **no** activan triggers.

### 12.6 PostgreSQL

El cuerpo es una función que devuelve `trigger`:

```sql
CREATE FUNCTION f_audita() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.modificado := now();
  RETURN NEW;          -- en BEFORE ROW, devolver NULL cancela la fila
END; $$;

CREATE TRIGGER t_audita BEFORE UPDATE ON pedidos
FOR EACH ROW EXECUTE FUNCTION f_audita();
```

`EXECUTE FUNCTION` desde la versión 11; antes `EXECUTE PROCEDURE`. Admite FOR EACH ROW y FOR EACH STATEMENT, tablas de transición y condición WHEN.

### 12.7 Comparativa de triggers

| Característica | ANSI | Oracle | SQL Server | MySQL | PostgreSQL |
|---|---|---|---|---|---|
| BEFORE | Sí | Sí | No | Sí | Sí |
| AFTER | Sí | Sí | Sí (o FOR) | Sí | Sí |
| INSTEAD OF | Sí (SQL:2008) | Sí, en vistas | Sí | No | Sí, en vistas |
| Nivel fila | FOR EACH ROW | FOR EACH ROW | No | Siempre | FOR EACH ROW |
| Nivel sentencia | FOR EACH STATEMENT (defecto) | Por defecto | Siempre | No | Por defecto |
| Valores viejo y nuevo | REFERENCING OLD/NEW | :OLD, :NEW | deleted, inserted | OLD, NEW | OLD, NEW |
| Triggers DDL o de sistema | No | Sí | Sí | No | Event triggers |

## 13. Eventos

"Evento" tiene dos sentidos en el epígrafe. Distínguelos.

### 13.1 Eventos que disparan triggers

Son los sucesos a los que responde un trigger:

- **DML**: INSERT, UPDATE, DELETE (y TRUNCATE en PostgreSQL).
- **DDL**: CREATE, ALTER, DROP, GRANT. En Oracle (`BEFORE DROP ON SCHEMA`), SQL Server (triggers DDL) y PostgreSQL (*event triggers*: `ddl_command_start`, `ddl_command_end`, `sql_drop`, `table_rewrite`, y `login` desde la versión 17).
- **De sistema o sesión**: LOGON, LOGOFF, STARTUP, SHUTDOWN, SERVERERROR (Oracle); LOGON (SQL Server).

### 13.2 Eventos programados (planificador)

Tareas que el SGBD ejecuta **por tiempo**, no por un cambio de datos. Son como un cron dentro de la base de datos.

MySQL / MariaDB:

```sql
SET GLOBAL event_scheduler = ON;

CREATE EVENT ev_purga_logs
ON SCHEDULE EVERY 1 DAY
STARTS '2026-11-01 03:00:00'
ON COMPLETION PRESERVE
DO
  DELETE FROM logs WHERE fecha < NOW() - INTERVAL 90 DAY;

CREATE EVENT ev_unico
ON SCHEDULE AT CURRENT_TIMESTAMP + INTERVAL 1 HOUR
DO CALL cerrar_plazo();

ALTER EVENT ev_purga_logs DISABLE;
DROP EVENT IF EXISTS ev_unico;
SHOW EVENTS;
```

- `ON SCHEDULE AT` para una sola ejecución; `EVERY` con `STARTS` y `ENDS` para repetir.
- `ON COMPLETION NOT PRESERVE` (por defecto) borra el evento cuando ya no volverá a ejecutarse.
- Requiere el privilegio EVENT y que `event_scheduler` esté en ON.

Otros SGBD:

| SGBD | Mecanismo |
|---|---|
| Oracle | Paquete `DBMS_SCHEDULER` (`CREATE_JOB`, con `repeat_interval => 'FREQ=DAILY;BYHOUR=3'`). Antes `DBMS_JOB` |
| SQL Server | Trabajos del **SQL Server Agent** (procedimientos `sp_add_job`, `sp_add_schedule`) |
| PostgreSQL | No trae planificador nativo. Se usa la extensión `pg_cron` o el cron del sistema |

El estándar ANSI no define eventos programados.

## Trampas y respuestas desactualizadas

- **SQL "estándar de facto" (2015 ej1 63)**: es un estándar de iure (ANSI 1986, ISO 1987, hoy ISO/IEC 9075:2023). La opción se daba por buena porque el resto eran falsas. Si sale "estándar de iure", esa es la correcta.
- **"SQL es solo de consulta" (2015)**: falso. SQL define, manipula, controla y gestiona transacciones.
- **SQL sirve para BD jerárquicas o en red (2015)**: falso. SQL es relacional.
- **Access no implementa SQL (2015)**: falso. Access usa un dialecto (Jet/ACE SQL) con comodines `*` y `?`.
- **SELECT como DML**: en el examen, sí. Si una opción lo clasifica como DQL, también es defendible. Elige según las demás opciones.
- **TRUNCATE**: es DDL. Se ofrece como DML para engañar (2024). Además, en SQL Server y PostgreSQL sí admite ROLLBACK dentro de una transacción.
- **COMMIT o ROLLBACK como DML o DCL**: en textos antiguos aparecen así. Hoy son TCL.
- **UNIQUE "no nulas" (2006 ej1 44)**: el enunciado decía que las columnas UNIQUE deben ser no nulas. No es cierto en el estándar. La respuesta seguía siendo UNIQUE.
- **WHERE con agregados o con alias del SELECT**: siempre error. Es el distractor número uno.
- **HAVING sin GROUP BY**: es válido. Trata toda la tabla como un único grupo. "HAVING impide usar WHERE" es falso.
- **ORDER BY con varias columnas**: cada una lleva su propio ASC o DESC; por defecto ASC. La opción "da error" de 2016 es falsa.
- **LIKE con `*`**: es Access, no SQL. En SQL el comodín es `%`.
- **`= NULL`**: nunca es cierto. Usa `IS NULL`.
- **Fecha actual**: CURRENT_DATE (estándar), SYSDATE (Oracle), CURDATE() o NOW() (MySQL), GETDATE() (SQL Server). No mezcles: `TO_DATE` es Oracle; `STR_TO_DATE`, MySQL.
- **`%M` frente a `%m`** en DATE_FORMAT: nombre del mes frente a número. Los minutos son `%i`.
- **Trigger que falla**: cancela la sentencia que lo disparó. No hay que programarlo (2024).
- **CREATE TRIGGER**: el orden es nombre, momento, evento, ON tabla. Ni `OF TABLE`, ni `IN`, ni `CREATE NEW`.
- **BEFORE en SQL Server**: no existe. Si preguntan por T-SQL, AFTER, FOR o INSTEAD OF.
- **Ejecutar procedimientos en T-SQL**: tras un parámetro nombrado, los demás deben ir nombrados (2018).
- **DENY**: solo existe en T-SQL. Prevalece sobre GRANT. REVOKE no es lo mismo que DENY.
- **CREATE INDEX** no es ANSI. Si una pregunta dice "según el estándar", no cuentes con él.
- **`MAX(x) + 1` para obtener el siguiente código (2008 b3 5)**: técnica antigua. Hoy se usan secuencias o IDENTITY.
- **MySQL y GROUP BY**: versiones anteriores a 5.7 aceptaban columnas sin agrupar. Desde 5.7 ONLY_FULL_GROUP_BY lo impide. Responde según el estándar.
- **Oracle 10g (2019 ej1 43)**: la pregunta citaba una versión muy antigua. La respuesta (SAVEPOINT) sigue valiendo. Oracle 23ai pasó a llamarse Oracle AI Database 26ai en octubre de 2025.
- **PostgreSQL sin procedimientos**: falso desde la versión 11 (2018), que añadió CREATE PROCEDURE y CALL.
