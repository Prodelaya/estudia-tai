# Tema 15. Modelado de datos y normalización

Peso: unas 2,8 preguntas de test y 0,5 de supuesto III por convocatoria (unos 3 puntos esperados). Hay 58 preguntas históricas (2005-2025), 51 de test y 7 de supuesto. Se concentran en tres zonas: formas normales y dependencias funcionales (unas 20), conceptos del modelo E/R según Métrica v3 (unas 15) y reglas de integridad y vocabulario del modelo relacional (unas 15). El resto son álgebra relacional, diseño físico y, desde 2025, modelado dimensional de Kimball. Este tema es la base del tema 17 (SQL) y de las preguntas de esquema de cualquier supuesto.

## Cómo lo preguntan

- **Definición literal de Métrica v3**: copian frases de la técnica "Modelo Entidad/Relación Extendido" y de "Normalización" y cambian una palabra (2018, 2019, 2022, 2024). Hay que conocer el texto casi de memoria.
- **"Señale la incorrecta / la que NO es"**: objetivos de la normalización (2017), características de las dependencias funcionales (2017), objetivos de Codd (2016), afirmaciones sobre claves (2015).
- **Determinar la forma normal de una tabla dada**: Calificación con DNI de profesor (2006), EMPLEADOS con clave compuesta (2008), registro con teléfonos separados por punto y coma (2019 b3).
- **Definición formal de cada forma normal**: 2FN (2005, 2008), 3FN (2008, 2019), 5FN (2017). Los distractores son las definiciones de las otras formas.
- **Vocabulario relacional**: grado, cardinalidad, dominio, atributo, tupla (2006, 2007, 2015, 2016, 2025).
- **Reglas de integridad**: entidad frente a referencial, con nulos en clave primaria o en clave ajena (2005, 2007, 2008, 2016, 2018).
- **Supuesto con diagrama**: leer cardinalidades de un E/R o de un esquema de tablas (2017, 2024) y transformar jerarquías o atributos compuestos (2015, 2018).
- **Novedad 2025**: modelado dimensional de Kimball (dimensión outrigger). Indica que pueden caer más conceptos de almacén de datos.

## Niveles de modelado y proceso de diseño

### Los tres niveles

El diseño de una base de datos pasa por tres modelos, de más abstracto a más concreto.

| Nivel | Qué describe | Depende de | Herramienta típica |
|---|---|---|---|
| Conceptual | Qué información maneja el sistema y cómo se relaciona | Nada (ni modelo ni SGBD) | Modelo E/R, diagrama de clases UML |
| Lógico | Estructura en un modelo de datos concreto (relacional, jerárquico, red, documental) | Del tipo de modelo, no del producto | Esquema relacional normalizado |
| Físico | Cómo se almacena: ficheros, índices, particiones, tipos exactos | Del SGBD concreto (Oracle, PostgreSQL...) | DDL, parámetros de almacenamiento |

Ideas que se preguntan:

- El modelo conceptual representa la **visión estática** del dominio de información. Ayuda a recoger las necesidades del usuario. Representa toda la información que tratará el sistema. **No** representa la estructura física **[Salió 2015]**.
- El modelo conceptual describe la información, su estructura y las reglas o restricciones, a alto nivel **[Salió 2005]**.
- La **primera tarea** del diseño conceptual es identificar las entidades **[Salió 2007]**. Después se identifican relaciones, atributos e identificadores.
- La eliminación de redundancia es un objetivo del diseño **lógico** (normalización), no de la organización física. Las inserciones y borrados sí afectan mucho a la distribución física de los datos **[Salió 2005]**.

### Independencia de datos (ANSI/SPARC)

La arquitectura ANSI/SPARC define tres niveles de esquema: externo (vistas de usuario), conceptual (lógico global) e interno (físico).

- **Independencia física**: cambiar el almacenamiento sin tocar el esquema conceptual ni las aplicaciones.
- **Independencia lógica**: cambiar el esquema conceptual (añadir tablas o columnas) sin afectar a las vistas externas.

## Modelo Entidad/Relación

### Origen y notaciones

- Lo propone **Peter Chen en 1976**. El modelo E/R **extendido** (EER) añade generalización, especialización y agregación.
- Notación de Chen: rectángulo para entidad, rombo para relación, elipse para atributo.
- Notación "pata de gallo" (crow's foot, de Gordon Everest) o de Martin: muy usada en herramientas CASE. La cardinalidad se dibuja en el extremo de la línea.
- UML: diagrama de clases con multiplicidades `0..1`, `1`, `0..*`, `1..*`.

### Símbolos de la notación de Chen

| Símbolo | Significado |
|---|---|
| Rectángulo | Entidad fuerte (regular) |
| Rectángulo doble | Entidad débil |
| Rombo | Relación |
| Rombo doble | Relación identificativa (con entidad débil) |
| Elipse | Atributo simple |
| Elipse con nombre subrayado | Atributo identificador (clave) |
| Elipse doble | Atributo multivaluado |
| Elipse discontinua | Atributo derivado **[Salió 2025]** |
| Elipse con elipses colgando | Atributo compuesto |
| Línea doble | Participación total (obligatoria) |
| Triángulo "ES-UN" | Generalización/especialización |

En las notaciones españolas habituales (Métrica, De Miguel y Piattini), el identificador se marca con un círculo relleno y los atributos con círculos vacíos.

### Elementos según Métrica v3

Métrica v3 recoge el modelo E/R extendido como técnica. Sus definiciones se copian literalmente en el examen **[Salió 2018, 2022, 2024]**.

- **Entidad**: "objeto real o abstracto acerca del cual se desea almacenar información en la base de datos" **[Salió 2022]**. Entidad regular: sus ocurrencias tienen existencia propia. Entidad débil: depende de otra.
- **Relación**: asociación o correspondencia entre entidades. Se caracteriza por:
  - **Nombre**: la identifica unívocamente.
  - **Grado**: número de entidades que participan (unaria o reflexiva, binaria, ternaria, n-aria) **[Salió 2015]**.
  - **Tipo de correspondencia**: número **máximo** de ocurrencias de cada entidad que pueden intervenir en una ocurrencia de la relación (1:1, 1:N, N:M) **[Salió 2006]**.
  - **Cardinalidad**: "representa la participación en la relación de cada una de las entidades afectadas". Es el número mínimo y máximo de ocurrencias de una entidad que se relacionan con una ocurrencia de la otra. Se escribe (0,1), (1,1), (0,n), (1,n) **[Salió 2024]**.
- Pregunta típica: "las relaciones se definen por..." → nombre, cardinalidad y tipo de correspondencia (el grado también). Nunca por atributo, dominio o categoría **[Salió 2018]**.
- **Dominio**: conjunto de valores homogéneos con un nombre. **Tiene existencia propia** con independencia de entidades, relaciones o atributos. Por eso es falso que "no tiene existencia propia" **[Salió 2022]**.
- **Atributo**: propiedad o característica de una entidad o relación. Cada atributo toma valores de **un único dominio** (es falso que "se define sobre diversos dominios") **[Salió 2022]**. El dominio de un atributo es el conjunto de todos los valores posibles que puede tomar **[Salió 2015]**.
- **Identificador candidato**: atributo o conjunto de atributos que identifican unívoca y **mínimamente** cada ocurrencia. Se elige uno como identificador principal; los demás son alternativos.

### Extensiones del modelo E/R en Métrica v3

- **Dependencia en existencia**: las ocurrencias de la entidad débil no pueden existir sin la ocurrencia de la entidad regular de la que dependen. Ejemplo: Línea de factura sin Factura.
- **Dependencia en identificación**: además, la entidad débil no se identifica con sus propios atributos. Necesita la clave de la entidad regular. Toda dependencia en identificación lo es también en existencia.
- Ojo al distractor: es la entidad **débil** la que depende de la **fuerte**, nunca al revés **[Salió 2016]**.
- **Relaciones exclusivas**: una ocurrencia participa en una relación o en otra, no en ambas (arco de exclusividad).
- **Generalización/especialización (jerarquías, subtipos)**: una entidad supertipo se descompone en subtipos. Se clasifican por:
  - **Total o parcial**: si toda ocurrencia del supertipo pertenece o no a algún subtipo.
  - **Exclusiva o solapada (inclusiva)**: si una ocurrencia puede estar en un solo subtipo o en varios.
- **Agregación**: abstracción que trata una relación como entidad de nivel superior. Tipos en Métrica:
  - **Compuesto/componente**: el todo se forma por unión de partes (un coche y sus piezas).
  - **Asociación**: "consiste en relacionar dos tipos de entidades que normalmente son de dominios independientes, pero coyunturalmente se asocian" **[Salió 2024]**.

### Restricciones y ejemplos de lectura

Lectura de cardinalidades en un diagrama Trabajador–Puesto: se lee "un trabajador ocupa (mín, máx) puestos". Si en el extremo de Puesto pone (1,n), cada trabajador tiene al menos uno. Si hay un arco de exclusividad entre "puesto central" y "puesto exterior", el trabajador está en uno u otro, no en ambos **[Salió 2017 b3]**.

En un esquema de tablas, la clave ajena está en el lado "muchos". Si FicheroAdjunto tiene una clave ajena a SolicitudBeca, una solicitud puede tener N ficheros **[Salió 2024 b3]**.

## Modelo relacional

### Origen y objetivos de Codd

- Lo propone **Edgar F. Codd** (IBM) en 1970, en "A Relational Model of Data for Large Shared Data Banks" **[Salió 2015]**.
- Objetivos de Codd: **independencia física**, **independencia lógica**, **flexibilidad** (vistas distintas para cada usuario), **uniformidad** (todo son tablas), **sencillez**. "Independencia conceptual" no es uno de ellos **[Salió 2016]**.
- En 1985 publica las **12 reglas de Codd** (numeradas de 0 a 12, son 13). Regla 0: el sistema debe gestionar la base de datos solo con capacidades relacionales.

| Regla | Nombre |
|---|---|
| 1 | Información (todo se representa como valores en tablas) |
| 2 | Acceso garantizado (tabla + clave primaria + columna) |
| 3 | Tratamiento sistemático de nulos |
| 4 | Catálogo dinámico en línea basado en el modelo relacional |
| 5 | Sublenguaje de datos completo |
| 6 | Actualización de vistas |
| 7 | Inserción, actualización y borrado de alto nivel (de conjuntos) |
| 8 | Independencia física |
| 9 | Independencia lógica |
| 10 | Independencia de integridad |
| 11 | Independencia de distribución |
| 12 | No subversión (un lenguaje de bajo nivel no salta las reglas) |

### Vocabulario: relación, tupla, atributo

| Término formal | Término de tabla | Término de fichero |
|---|---|---|
| Relación | Tabla | Fichero |
| Tupla | Fila | Registro |
| Atributo | Columna | Campo |
| Grado | Número de columnas | |
| Cardinalidad | Número de filas | |
| Dominio | Conjunto de valores posibles de una columna | |

- **Grado** de una relación: número de atributos. **Cardinalidad**: número de tuplas. Con 4 columnas y 7 filas, el grado es 4 y la cardinalidad 7 **[Salió 2007, 2025]**.
- El **atributo** es la unidad de información asociada a un dominio del que toma sus valores **[Salió 2016]**.
- **Dominio**: rango o conjunto de valores que puede tomar un atributo **[Salió 2006]**.
- Cuidado: "cardinalidad" en E/R es la participación (mín, máx); en relacional es el número de tuplas.

Propiedades de una relación: no hay tuplas duplicadas, el orden de tuplas y de atributos no importa, cada celda tiene un valor atómico (o nulo). El **esquema** (intensión) es estable; la **extensión** (las filas) cambia en el tiempo.

### Claves

- **Superclave**: conjunto de atributos que identifica cada tupla. Puede tener atributos sobrantes.
- **Clave candidata**: superclave mínima. Si se quita cualquier atributo, deja de identificar **[Salió 2015]**.
- **Clave primaria**: la candidata elegida. Toda primaria es candidata **[Salió 2015]**.
- **Clave alternativa**: candidata no elegida como primaria.
- **Clave ajena (foránea, externa)**: atributos de R2 cuyos valores deben concordar con la clave primaria (o una candidata) de R1 **[Salió 2005 b3, 2006]**.
- Toda relación tiene **al menos una** clave candidata, porque no hay tuplas repetidas. Es falso que "una relación puede no tener clave candidata" **[Salió 2015]**.
- **Atributo principal (primo)**: forma parte de alguna clave candidata. **No principal**: no forma parte de ninguna.

### Valor nulo

- Un nulo significa valor **desconocido o inaplicable**. No es cero ni cadena vacía **[Salió 2008]**.
- Comparar con nulo da UNKNOWN (lógica trivaluada). En SQL se usa `IS NULL`.
- Una tupla con su clave ajena a nulo **no está relacionada** con ninguna tupla de la tabla referenciada. No incumple ninguna regla **[Salió 2008]**.

### Reglas de integridad

| Regla | Qué exige |
|---|---|
| Integridad de entidad | Ningún atributo de la clave primaria puede ser nulo **[Salió 2005, 2007, 2008, 2018]** |
| Integridad referencial | Los valores de la clave ajena existen en la clave referenciada o son nulos **[Salió 2016]** |
| Integridad de dominio | Cada valor pertenece al dominio de su atributo |
| Unicidad | La clave primaria y las alternativas no se repiten |
| Reglas de negocio (semánticas) | Restricciones propias del problema (CHECK, triggers, aserciones) |

- La no duplicidad de la clave primaria es **inherente** al modelo (no hay tuplas repetidas). La no nulidad es la regla de integridad de entidad **[Salió 2007, 2008]**.
- Restricciones **inherentes**: las impone el propio modelo (no hay filas duplicadas, valores atómicos, clave primaria no nula). Restricciones **semánticas o de usuario**: las define el diseñador (claves, NOT NULL, CHECK).
- Fallos de integridad típicos: claves primarias repetidas, valores inválidos, borrar un padre sin comprobar los hijos que lo referencian. Borrar una fila hija **no** es un fallo de integridad **[Salió 2008]**.

### Acciones ante borrado o modificación del padre

```sql
CREATE TABLE provincia (
  cod_provincia CHAR(2) PRIMARY KEY,
  nombre        VARCHAR(50) NOT NULL
);

CREATE TABLE municipio (
  cod_municipio CHAR(5) PRIMARY KEY,
  nombre        VARCHAR(80) NOT NULL,
  cod_provincia CHAR(2) NOT NULL,
  CONSTRAINT fk_mun_prov FOREIGN KEY (cod_provincia)
    REFERENCES provincia (cod_provincia)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
);
```

| Opción | Efecto al borrar o modificar el padre |
|---|---|
| RESTRICT / NO ACTION | Se rechaza si hay hijos (NO ACTION comprueba al final de la sentencia) |
| CASCADE | Se borran o actualizan los hijos |
| SET NULL | La clave ajena de los hijos pasa a nulo |
| SET DEFAULT | La clave ajena toma su valor por defecto |

### Álgebra relacional

Lenguaje **procedimental**: dice cómo obtener el resultado. Opera sobre relaciones y devuelve relaciones (cierre).

| Operación | Símbolo | Tipo | Equivalente SQL |
|---|---|---|---|
| Selección (restricción) | σ | Fundamental, unaria | WHERE |
| Proyección | π | Fundamental, unaria | lista del SELECT |
| Renombrado | ρ | Fundamental, unaria | AS |
| Unión | ∪ | Fundamental, binaria | UNION |
| Diferencia | − | Fundamental, binaria | EXCEPT / MINUS |
| Producto cartesiano | × | Fundamental, binaria | CROSS JOIN |
| Intersección | ∩ | Derivada | INTERSECT |
| Reunión (join) | ⋈ | Derivada | JOIN |
| División | ÷ | Derivada | NOT EXISTS anidados |

- Las cinco fundamentales clásicas son selección, proyección, unión, diferencia y producto cartesiano. La **intersección no es fundamental**: R ∩ S = R − (R − S) **[Salió 2015]**.
- **Proyección**: obtiene un subconjunto de **atributos** (columnas) **[Salió 2008]**. **Selección**: subconjunto de **tuplas** (filas).
- Unión, diferencia e intersección exigen relaciones **compatibles** (mismo grado y dominios).
- La división responde a "los que están relacionados con **todos**". Ejemplo: alumnos matriculados en todas las asignaturas.

```text
Empleado(id, nombre, dpto, salario)
π nombre ( σ salario > 3000 (Empleado) )
equivale a:
SELECT DISTINCT nombre FROM Empleado WHERE salario > 3000;
```

### Cálculo relacional

- Lenguaje **no procedimental** (declarativo): dice qué se quiere, no cómo. Toma su nombre del **cálculo de predicados**, rama de la lógica **[Salió 2006]**.
- **Cálculo de tuplas**: variables que recorren tuplas. Lenguaje histórico: QUEL (Ingres). SQL se inspira en él.
- **Cálculo de dominios**: variables que recorren valores de dominio. Lenguaje histórico: QBE (Query By Example, gráfico).
- Teorema de Codd: álgebra y cálculo relacional (seguro) tienen la misma potencia expresiva. Un lenguaje con esa potencia es "relacionalmente completo".

## Transformación del modelo E/R al relacional

### Reglas básicas

| Elemento E/R | Transformación |
|---|---|
| Entidad | Tabla. El identificador pasa a clave primaria |
| Atributo simple | Columna |
| Atributo compuesto | Una columna por cada componente simple; el compuesto desaparece **[Salió 2015 b3]** |
| Atributo multivaluado | Tabla nueva con la clave de la entidad + el valor |
| Atributo derivado | Normalmente no se almacena (se calcula o se usa una vista) |
| Relación 1:N | La clave del lado 1 pasa como clave ajena al lado N |
| Relación 1:1 | Clave ajena en cualquiera de los lados (mejor el de participación obligatoria) o fusión de tablas |
| Relación N:M | Tabla nueva cuya clave es la unión de las claves de ambas entidades |
| Relación ternaria o n-aria | Tabla nueva con las claves de todas las entidades |
| Entidad débil | Tabla cuya clave incluye la clave de la entidad fuerte |
| Atributos de una relación N:M | Columnas de la tabla de la relación |

Ejemplo clásico de N:M: alumnos y asignaturas. En 3FN hacen falta **tres tablas**: Alumno, Asignatura y Matrícula con una fila por cada par alumno-asignatura **[Salió 2008]**.

```sql
CREATE TABLE matricula (
  cod_alumno     INT,
  cod_asignatura INT,
  nota           DECIMAL(4,2),
  PRIMARY KEY (cod_alumno, cod_asignatura),
  FOREIGN KEY (cod_alumno)     REFERENCES alumno (cod_alumno),
  FOREIGN KEY (cod_asignatura) REFERENCES asignatura (cod_asignatura)
);
```

### Jerarquías (generalización)

Tres opciones para transformar un supertipo AccionFormativa con subtipos Presencial y Online **[Salió 2018 b3]**:

1. **Una sola tabla** con todos los atributos del supertipo y de los subtipos, más un atributo discriminador (tipo). Simple; deja muchos nulos. Conviene si los subtipos tienen pocos atributos propios.
2. **Una tabla para el supertipo y una por subtipo**. La clave de cada subtipo es la del supertipo y es a la vez clave ajena. Es la opción más fiel y la más general.
3. **Una tabla por subtipo** (sin tabla de supertipo), cada una con los atributos comunes repetidos. Solo vale si la jerarquía es **total y exclusiva**.

Si la jerarquía es solapada, la opción 1 necesita un indicador por subtipo en vez de un único discriminador.

## Dependencias funcionales y normalización

### Objetivos y beneficios

La normalización (Codd, 1970-1972) descompone tablas para eliminar redundancias y anomalías.

- Objetivos: minimizar la redundancia, evitar anomalías de inserción, borrado y actualización, garantizar la integridad, organizar los datos en grupos lógicos y facilitar el mantenimiento.
- El **principal beneficio** es **minimizar la redundancia** **[Salió 2007]**.
- **No** es objetivo reducir las relaciones entre tablas. Normalizar las aumenta **[Salió 2017]**.
- **No** es objetivo mejorar el rendimiento de las consultas. Normalizar suele añadir reuniones (joins).
- Consecuencias de no normalizar: inconsistencia, incoherencia, anomalías de actualización y redundancia **[Salió 2016]**. No lo son los bloqueos de transacciones ni la disponibilidad.

### Anomalías

Tabla sin normalizar: `Pedido(num_pedido, cod_cliente, nombre_cliente, cod_producto, cantidad)`.

- **Inserción**: no se puede dar de alta un cliente sin pedidos.
- **Borrado**: al borrar su único pedido se pierden los datos del cliente.
- **Modificación**: cambiar el nombre del cliente exige tocar todas sus filas.

### Dependencia funcional

Definición de Métrica v3, muy literal **[Salió 2019]**:

- **Dependencia funcional**: un atributo Y depende funcionalmente de X si, y solo si, a cada valor de X le corresponde **un único valor** de Y. Se escribe X → Y. X es el determinante (implicante).
- **Dependencia funcional completa (plena)**: Y depende de X y **no** depende de ningún subconjunto propio de X. Solo tiene sentido si X es compuesto.
- **Dependencia funcional transitiva**: Y depende de X "a través de otro atributo". Si X → Z y Z → Y (y Z no determina a X), entonces X → Y es transitiva.
- Trampa: "Y tiene dependencia completa de X si depende de él a través de otro atributo" es la definición de transitiva, no de completa **[Salió 2019, 2024]**.

Características de las dependencias funcionales **[Salió 2017]**:

- Son propiedades del contenido **semántico** de los datos. Se cumplen para cualquier extensión del esquema.
- Son restricciones de integridad que reflejan interrelaciones del mundo real.
- Son **invariantes** en el tiempo.
- Es falso que **todas** las restricciones de integridad se representen con dependencias funcionales. Hay multivaluadas, de reunión, de dominio, etc.

Axiomas de Armstrong (base para razonar con dependencias):

| Axioma | Regla |
|---|---|
| Reflexividad | Si Y ⊆ X, entonces X → Y |
| Aumentatividad | Si X → Y, entonces XZ → YZ |
| Transitividad | Si X → Y e Y → Z, entonces X → Z |
| Unión (derivada) | Si X → Y y X → Z, entonces X → YZ |
| Descomposición (derivada) | Si X → YZ, entonces X → Y |
| Pseudotransitividad (derivada) | Si X → Y y WY → Z, entonces WX → Z |

El **cierre** de un conjunto de atributos X (X+) son todos los atributos que X determina. Si X+ contiene todos los atributos, X es superclave.

### Otras dependencias

- **Dependencia multivaluada** (X →→ Y): a cada valor de X le corresponde un **conjunto** de valores de Y, independiente del resto de atributos. Base de la 4FN.
- **Dependencia de reunión (join)**: la relación se puede reconstruir **sin pérdida** a partir de la reunión de algunas de sus proyecciones **[Salió 2018]**. Base de la 5FN.

### Las formas normales

Cada forma normal incluye a las anteriores: una tabla en 3FN está también en 2FN y en 1FN. Afirmar "en 3FN pero no en 1FN" es falso **[Salió 2024]**.

| Forma | Autor y año | Condición (además de la anterior) |
|---|---|---|
| 1FN | Codd 1970 | Sin grupos repetitivos: valores atómicos, un único valor de un dominio simple |
| 2FN | Codd 1971 | Todo atributo no principal tiene dependencia funcional **completa** de cada clave candidata |
| 3FN | Codd 1971 | Ningún atributo no principal depende **transitivamente** de una clave |
| FNBC | Boyce y Codd 1974 | Todo determinante es clave candidata |
| 4FN | Fagin 1977 | Sin dependencias multivaluadas no triviales (salvo las de una superclave) |
| 5FN (FNPJ) | Fagin 1979 | Toda dependencia de reunión está implicada por las claves candidatas |
| FNDC (DKNF) | Fagin 1981 | Toda restricción se deduce de dominios y claves |
| 6FN | Date 2003 | Sin dependencias de reunión no triviales (tablas de clave más un atributo) |

Sobre "cuántas formas normales hay": las clásicas son seis (1FN, 2FN, 3FN, FNBC, 4FN, 5FN). Algunos textos hablan de cinco (de 1FN a 5FN, con FNBC como variante de la 3FN) **[Salió 2007]**.

### Definiciones literales de Métrica v3

- **1FN**: "Una entidad está en 1FN si **no** tiene grupos repetitivos, es decir, un atributo solo puede tomar un único valor de un dominio simple" **[Salió 2008, 2024]**. El distractor de 2024 decía "si tiene grupos repetitivos".
- **2FN**: "Una entidad está en 2FN si está en 1FN y todos los atributos que no forman parte de las claves candidatas tienen dependencia funcional completa respecto de estas" **[Salió 2005, 2008, 2024]**.
- **3FN**: "Una entidad está en 3FN si está en 2FN y todos sus atributos no principales dependen directamente de la clave primaria, es decir, no hay dependencias funcionales transitivas de atributos no principales respecto de las claves" **[Salió 2008, 2019]**.

Cómo descartar distractores de definición:

- "Depende de toda la clave / dependencia completa" → 2FN.
- "No hay dependencias transitivas / depende directamente" → 3FN.
- "Todo determinante es clave candidata" → FNBC.
- "Sin dependencias multivaluadas no triviales" → 4FN.
- "Toda dependencia de reunión implicada por las claves candidatas" → 5FN **[Salió 2017]**.

### Ejemplos resueltos

**Teléfonos en una sola columna** **[Salió 2019 b3]**. Registro: `NIF 12345678Z, Nombre Emilia, Telefonos 916666666;917777777`. La columna Telefonos guarda dos valores. Viola la 1FN, así que la tabla no está en ninguna forma normal. Solución: tabla Telefono(NIF, numero).

**Calificación** **[Salió 2006]**. `Calificacion(Dni_Profesor, Nombre_Profesor, Dni_Alumno, Nota)`, clave (Dni_Profesor, Dni_Alumno) y Dni_Profesor → Nombre_Profesor. Nombre_Profesor depende de parte de la clave. Hay dependencia parcial: está en **1FN** pero no en 2FN.

**EMPLEADOS** **[Salió 2008]**. `EMPLEADOS(COD_EMPLEADO, COD_DEPARTAMENTO, TIPO, EDAD, PLANTA_DEPARTAMENTO)`, clave (COD_EMPLEADO, COD_DEPARTAMENTO). EDAD depende solo de COD_EMPLEADO. PLANTA_DEPARTAMENTO depende solo de COD_DEPARTAMENTO. **No cumple la 2FN**.

Descomposición a 3FN paso a paso:

```text
Inicial (1FN):
  Pedido(num_pedido, fecha, cod_cliente, nombre_cliente,
         cod_producto, desc_producto, cantidad)
  Clave: (num_pedido, cod_producto)

DF: num_pedido -> fecha, cod_cliente
    cod_cliente -> nombre_cliente
    cod_producto -> desc_producto
    (num_pedido, cod_producto) -> cantidad

2FN (quitar dependencias parciales):
  Pedido(num_pedido, fecha, cod_cliente, nombre_cliente)
  Producto(cod_producto, desc_producto)
  LineaPedido(num_pedido, cod_producto, cantidad)

3FN (quitar transitiva num_pedido -> cod_cliente -> nombre_cliente):
  Pedido(num_pedido, fecha, cod_cliente)
  Cliente(cod_cliente, nombre_cliente)
  Producto(cod_producto, desc_producto)
  LineaPedido(num_pedido, cod_producto, cantidad)
```

**3FN que no está en FNBC**. `Clase(alumno, asignatura, profesor)`. Cada profesor imparte una sola asignatura (profesor → asignatura). Clave: (alumno, asignatura). No hay atributos no principales, así que está en 3FN. Pero el determinante "profesor" no es clave candidata: no está en FNBC.

**4FN**. `Profesor(id, idioma, curso)`, donde idiomas y cursos son independientes. Hay que combinar cada idioma con cada curso. Se divide en ProfesorIdioma(id, idioma) y ProfesorCurso(id, curso).

### Propiedades de la descomposición

- **Sin pérdida (reunión sin pérdida, lossless join)**: la reunión natural de las proyecciones devuelve exactamente la tabla original. Es obligatoria.
- **Conservación de dependencias**: todas las dependencias se pueden comprobar en alguna tabla resultante.
- Hasta la **3FN** siempre se consiguen ambas propiedades. En **FNBC** puede perderse la conservación de dependencias.

### Desnormalización

Se desnormaliza a propósito para reducir reuniones y accesos. Es típico en el diseño físico y en almacenes de datos. Ejemplos: columnas calculadas, totales precalculados, copiar un nombre en la tabla hija, vistas materializadas. Exige controlar la redundancia con triggers o procesos.

## Diseño lógico y físico en Métrica v3

### Actividades de Métrica v3

| Proceso | Actividad | Tareas principales |
|---|---|---|
| ASI (Análisis) | ASI 6 Elaboración del modelo de datos | 6.1 Modelo conceptual, 6.2 Modelo lógico, 6.3 Normalización del modelo lógico, 6.4 Necesidades de migración y carga inicial |
| DSI (Diseño) | DSI 6 Diseño físico de datos | 6.1 Diseño del modelo físico, 6.2 Caminos de acceso, 6.3 Optimización del modelo físico, 6.4 Distribución de datos |

En el ASI el modelo lógico se obtiene a partir del conceptual y se normaliza hasta la 3FN. En el DSI se pasa al modelo físico del gestor elegido y se optimiza.

### Optimización del modelo físico

Métrica v3 (Técnicas y Prácticas) dice que, para reducir o simplificar el número de accesos a la base de datos, se puede **[Salió 2024 b3]**:

- **Introducir elementos redundantes** (desnormalizar).
- **Dividir entidades** (fragmentación horizontal o vertical).
- **Combinar entidades** si los accesos son frecuentes **dentro de la misma transacción**. El distractor dice "en transacciones distintas".
- **Redefinir relaciones** para que los accesos sean más directos.

Normalizar más (FNBC) aumenta el número de tablas y de accesos, así que no sirve para ese fin.

### Conceptos del diseño físico

- **Tiempo de respuesta**: tiempo que tarda en completarse una transacción **[Salió 2007]**.
- **Productividad (throughput)**: número de transacciones procesadas por unidad de tiempo.
- **Espacio de almacenamiento**: tamaño de ficheros e índices.
- **Índices**: B+ (rango y orden, el más habitual), hash (igualdad), bitmap (columnas de baja cardinalidad, almacenes de datos). Índice agrupado (clustered): ordena físicamente las filas.
- **Particionamiento**: por rango, lista, hash o compuesto.
- **Agrupamiento (clustering)**: guardar juntas filas de tablas que se consultan unidas.
- **Caminos de acceso**: secuencial, por índice o por hash, según las transacciones más frecuentes.

```sql
CREATE INDEX idx_mun_prov ON municipio (cod_provincia);
```

## Modelado dimensional (Kimball)

Ha entrado en el examen en 2025. Se usa en almacenes de datos (data warehouse) y BI.

### Conceptos

- **Ralph Kimball**: enfoque ascendente (bottom-up), por data marts integrados con dimensiones conformadas. **Bill Inmon**: enfoque descendente, almacén corporativo en 3FN.
- **Tabla de hechos**: medidas numéricas de un proceso de negocio (importe, unidades). Claves ajenas a las dimensiones.
- **Tabla de dimensión**: contexto descriptivo (quién, qué, cuándo, dónde). Muy desnormalizada.
- **Granularidad (grano)**: nivel de detalle de una fila de hechos. Es la primera decisión de diseño tras elegir el proceso.
- Proceso de diseño de Kimball en cuatro pasos: proceso de negocio, grano, dimensiones, hechos.

### Esquemas

| Esquema | Descripción |
|---|---|
| Estrella | Una tabla de hechos rodeada de dimensiones desnormalizadas |
| Copo de nieve | Las dimensiones se normalizan en varias tablas |
| Constelación | Varias tablas de hechos que comparten dimensiones |

### Tipos de dimensión

- **Outrigger**: dimensión enlazada desde **otra dimensión**, no desde los hechos **[Salió 2025]**. Ejemplo: dimensión Fecha de alta referenciada desde Cliente.
- **Conformada**: compartida con el mismo significado por varias tablas de hechos.
- **Degenerada**: atributo de dimensión guardado en la tabla de hechos, sin tabla propia (número de factura).
- **Basura (junk)**: agrupa indicadores y banderas de baja cardinalidad.
- **De rol (role-playing)**: una misma dimensión usada varias veces (fecha de pedido, fecha de envío).
- **Lentamente cambiante (SCD)**: tipo 0 conserva el original, tipo 1 sobrescribe, tipo 2 añade fila nueva con vigencia, tipo 3 añade columna con el valor anterior. Los tipos 4 a 7 son híbridos (minidimensión, etc.).
- **Tabla puente (bridge)**: resuelve relaciones muchos a muchos entre hechos y dimensión.

### Tipos de hechos y tablas de hechos

- Medidas **aditivas** (se suman en todas las dimensiones), **semiaditivas** (saldo: no se suma en el tiempo) y **no aditivas** (porcentajes).
- Tablas de hechos **transaccionales**, de **instantánea periódica** y de **instantánea acumulada**. **Sin hechos (factless)**: registran eventos sin medidas.
- Las tablas de dimensión usan **claves subrogadas** (enteros sin significado), no las claves naturales del sistema origen.

## Trampas y respuestas desactualizadas

- **"Cardinalidad" tiene dos sentidos**. En relacional es el número de tuplas (2007, 2025). En E/R de Métrica es la participación mínima y máxima (2024). El "número máximo" es el tipo de correspondencia (2006).
- **Grado también tiene dos sentidos**. En una relación es el número de atributos (2025). En una relación E/R es el número de entidades participantes (2015). Nunca es "número de valores de un atributo" (2016).
- **Nulo no es cero ni cadena vacía** (2008). Una clave ajena nula no viola la integridad referencial (2008).
- **Integridad de entidad frente a referencial**: entidad habla de la clave primaria no nula; referencial, de la clave ajena (2005, 2016, 2018).
- **Dependencia completa frente a transitiva**: "a través de otro atributo" es transitiva (2019, 2024).
- **Normalizar no mejora el rendimiento ni reduce relaciones** (2017). Aumenta tablas y reuniones.
- **Entidad débil depende de la fuerte**, no al revés (2016).
- **Dominio con existencia propia**: el dominio no depende de atributos ni entidades en Métrica v3 (2022).
- **Optimización física**: combinar entidades solo si se acceden en la **misma** transacción (2024 b3).
- **Intersección y reunión** son derivadas, no fundamentales (2015).
- **Cálculo relacional es declarativo**; el álgebra es procedimental (2006).
- **"Cuántas formas normales"** (2007): no hay número oficial universal. Depende de si se cuentan FNBC, FNDC y 6FN. Es una pregunta antigua y discutible.
- **Métrica v3 sigue vigente** como referencia en el examen. No hay versión 4. Las preguntas copian su texto de 2001.
- **Kimball outrigger**: el distractor típico es "dimensión enlazada en la tabla de hechos", que es una dimensión normal (2025).
