# Tema 12. Estructuras de datos, ficheros, algoritmos y formatos

Peso esperado: unas 2,9 preguntas de test y 0,2 de supuesto III por convocatoria (unos 2,3 puntos). Hay 54 preguntas históricas clasificadas aquí (2005-2025, la "2025" es el examen de mayo de 2026). Se concentran en tres bloques: árboles (recorridos, grado, árboles equilibrados), TAD lineales (pila, cola, bicola, listas) y formatos de fichero (JPEG, PDF, JSON, CSV, códecs). Ordenación y complejidad salen casi cada año con una pregunta. La organización de ficheros solo salió entre 2005 y 2008, pero sigue en el temario.

## Cómo lo preguntan

- **Definición pura de TAD**: "la pila es...", "la cola se basa en..." (2007, 2024). Distractor clásico: cambiar LIFO por FIFO.
- **Identificar la incorrecta**: sobre TAD en Java (2024), sobre estándares PDF (2022), sobre estructuras contiguas (2018).
- **Recorridos de árboles**: nombre de un recorrido (2018, 2019) o reconstruir el postorden a partir de preorden e inorden (2007, 2008). La raíz es el primero del preorden (2016).
- **Propiedades de árboles equilibrados**: 2-3-4 (2024), rojo-negro (2025). Hay que saber las reglas exactas.
- **Algoritmos con nombre propio**: Dijkstra (2022), Kruskal (2017), radix sort con "urnas" (2015), Huffman (2007).
- **Complejidad**: ordenar órdenes de crecimiento (2017 b3), Quicksort medio y peor (2017 b3), pasadas de la burbuja (2016).
- **Formatos**: qué es AV1 (2019), JPEG (2008, 2018), SVG vectorial (2017), extensión ods (2016), RFC 4180 y RFC 8259 (2025).
- **Supuesto**: traza de un programa dado (2008 b3: qué orden produce, qué estructura usa, qué hace con una matriz). En 2025 salió "algoritmo voraz" en reserva.

## Tipos abstractos de datos

### Concepto de TAD

Un **tipo abstracto de datos (TAD)** es un conjunto de valores más las operaciones sobre ellos. Se define por una **especificación** independiente de cualquier representación. **[Salió 2024]**

- **Especificación**: qué hace cada operación (sintaxis y semántica). Puede escribirse en lenguaje natural, pseudocódigo, notación algebraica o un lenguaje de programación. **[Salió 2024]**
- **Implementación**: cómo se representa en memoria y cómo se programan las operaciones.
- **Encapsulación y ocultación**: el usuario del TAD solo ve la interfaz, no la representación.
- Un mismo TAD admite varias implementaciones (una pila sobre array o sobre lista enlazada).

En Java, la especificación del TAD se expresa con una **interface** y la implementación con una **class**. La clase que implementa la interfaz debe implementar todas sus operaciones abstractas. **[Salió 2024]** La opción incorrecta de 2024 invertía los papeles ("la estructura de datos (interface) debe implementar el TAD (class)").

```java
public interface Pila<T> {          // especificación (TAD)
    void apilar(T x);               // push
    T desapilar();                  // pop
    T cima();                       // peek
    boolean estaVacia();
}

public class PilaArray<T> implements Pila<T> {   // implementación
    private Object[] datos = new Object[10];
    private int tope = 0;
    public void apilar(T x) {
        if (tope == datos.length) datos = java.util.Arrays.copyOf(datos, tope * 2);
        datos[tope++] = x;
    }
    @SuppressWarnings("unchecked")
    public T desapilar() { return (T) datos[--tope]; }
    @SuppressWarnings("unchecked")
    public T cima() { return (T) datos[tope - 1]; }
    public boolean estaVacia() { return tope == 0; }
}
```

### Clasificación de las estructuras de datos

| Criterio | Tipos | Ejemplos |
|---|---|---|
| Composición | Simples (primitivos) y estructurados (compuestos) | int, char frente a array, registro |
| Gestión de memoria | Estáticas (tamaño fijo en compilación) y dinámicas (crecen en ejecución) | array frente a lista enlazada, árbol |
| Relación entre elementos | Lineales (un sucesor) y no lineales (varios sucesores) | pila, cola, lista frente a árbol, grafo |
| Ubicación en memoria | Contiguas y enlazadas | array, cadena, vector frente a lista con punteros |

- Las cadenas, los vectores y los arrays son estructuras **contiguas**. **[Salió 2018]** La afirmación falsa era "los vectores no son contiguos".
- Un array bidimensional es una matriz. **[Salió 2018]**
- **Árbol**: estructura estructurada, **dinámica y no lineal**. Pila, cola y lista son lineales. **[Salió 2016]**
- El árbol se puede recorrer en **amplitud y en profundidad**. **[Salió 2016]**
- Estructuras **ordenadas**: la posición de cada elemento depende de su contenido (de su clave). **[Salió 2005]**

### Pila (stack)

- Estructura lineal **LIFO** (*last in, first out*): el último en entrar es el primero en salir. **[Salió 2007]**
- Solo se accede por un extremo, la **cima**.
- Operaciones: apilar (*push*), desapilar (*pop*), cima (*peek/top*), vacía.
- Usos: pila de llamadas (recursividad), deshacer, evaluación de expresiones postfijas, comprobación de paréntesis, recorrido en profundidad (DFS).
- Distractores de 2007: "cada nodo apunta al siguiente y el último a nada" (lista enlazada), "FIFO" (cola), "acceso por índices" (array).

### Cola (queue)

- Estructura lineal **FIFO** (*first in, first out*). Se inserta por el **final** y se extrae por el **frente**. **[Salió 2018, 2024]**
- Operaciones: encolar (*enqueue/offer*), desencolar (*dequeue/poll*), frente (*peek*).
- Se puede implementar con estructura estática (array circular) o **dinámica** (lista enlazada). **[Salió 2024]**
- Usos: colas de impresión, planificación de procesos FCFS, buffers, recorrido en amplitud (BFS).
- **Cola de prioridad**: sale primero el de mayor prioridad. Se implementa con un **montículo** (*heap*).
- **Cola circular**: array donde el final enlaza con el principio; aprovecha los huecos.

Distractores de 2024: "LIFO" (es la pila), "insertar y eliminar por cualquier extremo" (es la bicola), "dos enlaces, al siguiente y al anterior" (lista doble).

### Bicola (deque)

Lista en la que se puede insertar y eliminar por **ambos extremos** (*double-ended queue*).

| Variante | Inserción | Borrado |
|---|---|---|
| Bicola general | Ambos extremos | Ambos extremos |
| Bicola de **entrada restringida** | Un solo extremo | Ambos extremos |
| Bicola de **salida restringida** | Ambos extremos | Un solo extremo |

**[Salió 2017]** "Inserciones por un extremo y borrados por los dos" es la bicola de entrada restringida. Regla mnemotécnica: lo restringido es lo que solo se hace por un lado.

### Listas

- **Lista**: secuencia de elementos donde se puede insertar y borrar en cualquier posición.
- **Lista enlazada (encadenada)**: conjunto variable de elementos cuyo orden se establece mediante **punteros**. **[Salió 2005]**
- Ventaja: usa la memoria eficazmente, porque **no necesita posiciones contiguas**. **[Salió 2008]**
- Inconveniente: no hay acceso directo por índice; acceder al elemento i es O(n).

| Tipo | Enlaces de cada nodo | Detalle |
|---|---|---|
| Simplemente enlazada | Al siguiente | Cada elemento sabe cuál le sucede, pero no cuál le precede. **[Salió 2006]** |
| Doblemente enlazada | Al siguiente y al anterior | Recorrido en ambos sentidos. Distractor de 2008. |
| Circular | El último apunta al primero | Distractor de 2008. Puede ser simple o doble. |

Distractor de 2008: "se procesan en el orden en que se reciben, el primero en entrar es el primero en salir" describe una cola.

### Conjuntos, diccionarios y mapas

- **Conjunto** (*set*): colección sin repetidos y **sin orden definido**.
- **Diccionario o mapa** (*map*): pares clave-valor; se accede por clave, no por posición. No mantiene orden entre elementos. **[Salió 2015]**
- Pila, cola y lista sí tienen orden definido (por posición).
- Implementaciones habituales: tabla hash (O(1) medio) o árbol de búsqueda equilibrado (O(log n), recorre en orden de clave).

### Tablas hash (dispersión)

Una **función hash** transforma la clave en una posición de la tabla. Dos claves con la misma posición producen una **colisión**.

| Familia | Otro nombre | Cómo resuelve |
|---|---|---|
| **Hashing abierto** | Encadenamiento separado (*separate chaining*) | Cada celda guarda una lista con todas las claves que caen ahí |
| **Hashing cerrado** | Direccionamiento abierto (*open addressing*) | Busca otra celda libre en la misma tabla |

**[Salió 2016]** Los dos métodos principales son hashing abierto y hashing cerrado. Ojo: los nombres se cruzan. "Hashing abierto" es encadenamiento, pero "direccionamiento abierto" es hashing cerrado.

Sondeos del hashing cerrado: **lineal** (h+1, h+2...), **cuadrático** (h+1², h+2²...) y **doble hash** (segunda función para el salto).

- **Factor de carga**: número de elementos almacenados dividido entre el tamaño de la tabla. En 2016 el distractor decía "número de índices".
- Java `HashMap`: factor de carga por defecto **0,75**. Desde Java 8, una cubeta con muchas colisiones (umbral 8) pasa a árbol rojo-negro.

### Colecciones de Java (implementaciones de los TAD)

| TAD | Interfaz Java | Implementaciones |
|---|---|---|
| Lista | `List` | `ArrayList` (array dinámico), `LinkedList` (lista doble) |
| Cola | `Queue` | `LinkedList`, `ArrayDeque`, `PriorityQueue` (montículo) |
| Bicola y pila | `Deque` | `ArrayDeque`, `LinkedList` |
| Conjunto | `Set`, `SortedSet` | `HashSet`, `LinkedHashSet`, `TreeSet` (rojo-negro) |
| Mapa | `Map`, `SortedMap` | `HashMap`, `LinkedHashMap`, `TreeMap` (rojo-negro) |

- La clase `Stack` es heredada (extiende `Vector`). Se recomienda `Deque` con `push`/`pop`.
- Java 21 añadió `SequencedCollection`, `SequencedSet` y `SequencedMap` (métodos `getFirst`, `getLast`, `reversed`).

```java
Deque<Integer> pila = new ArrayDeque<>();
pila.push(1); pila.push(2); pila.push(3);
System.out.println(pila.pop());      // 3 (LIFO)

Queue<Integer> cola = new ArrayDeque<>();
cola.offer(1); cola.offer(2); cola.offer(3);
System.out.println(cola.poll());     // 1 (FIFO)
```

## Árboles

### Terminología

- **Raíz**: nodo sin padre. **Hoja** (nodo terminal): nodo sin hijos. **Nodo interno**: tiene al menos un hijo.
- **Grado de un nodo**: número de hijos.
- **Grado de un árbol**: el **máximo grado de todos sus nodos**. **[Salió 2005, 2015]** El distractor "número de hijos de un nodo" es el grado del nodo.
- **Nivel** de un nodo: la raíz tiene nivel 0 o 1, según el autor. **Altura** (profundidad del árbol): número de niveles o máximo nivel.
- **Camino**: secuencia de nodos unidos por aristas. Su longitud es el número de aristas.
- **Bosque**: conjunto de árboles disjuntos.

### Árboles binarios

Cada nodo tiene como máximo dos hijos (izquierdo y derecho). Por tanto, el grado de un árbol binario no degenerado es **2**. **[Salió 2018]** En 2018 preguntaron el grado de un árbol binario lleno de 15 nodos: es 2 (tiene 4 niveles, pero eso es la altura).

| Término (uso habitual en España) | Definición | Nodos |
|---|---|---|
| Árbol binario **lleno** | Todos los niveles completos; todas las hojas en el último nivel | 2^h − 1 con h niveles (15 nodos: 4 niveles, 8 hojas) |
| Árbol binario **completo** | Lleno hasta el penúltimo nivel; el último se rellena de izquierda a derecha | Entre 2^(h−1) y 2^h − 1 |
| Árbol **degenerado** | Cada nodo tiene un solo hijo | Equivale a una lista |
| Árbol **equilibrado** | Alturas de subárboles con diferencia acotada | Altura O(log n) |

Datos útiles: el nivel i (raíz en nivel 1) tiene como máximo 2^(i−1) nodos. Con n nodos, la altura mínima es ⌈log2(n+1)⌉. Ojo: en inglés *full binary tree* significa "cada nodo tiene 0 o 2 hijos" y *perfect* es nuestro "lleno".

### Recorridos

| Recorrido | Orden | Uso típico |
|---|---|---|
| **Preorden** | Raíz, izquierdo, derecho | Copiar el árbol, notación prefija |
| **Inorden** (orden central, simétrico) | Izquierdo, raíz, derecho | En un ABB da las claves ordenadas |
| **Postorden** | Izquierdo, derecho, raíz | Borrar el árbol, notación postfija |
| **En amplitud** (por niveles) | Nivel a nivel, de izquierda a derecha | Usa una cola (BFS) |

**[Salió 2019]** Raíz, izquierdo, derecho es preorden. **[Salió 2018]** Izquierdo, raíz, derecho es inorden. Los distractores "exorden" y "reorden" no existen.

Pre, in y post son recorridos **en profundidad** (usan pila o recursividad). El prefijo indica dónde va la raíz.

```java
void preorden(Nodo n)  { if (n == null) return; visitar(n); preorden(n.izq); preorden(n.der); }
void inorden(Nodo n)   { if (n == null) return; inorden(n.izq); visitar(n); inorden(n.der); }
void postorden(Nodo n) { if (n == null) return; postorden(n.izq); postorden(n.der); visitar(n); }
```

### Reconstruir un árbol a partir de dos recorridos

Con **preorden + inorden** (o postorden + inorden) el árbol binario queda determinado. Con preorden + postorden no siempre.

Método:

1. La raíz es el **primero del preorden** (o el último del postorden). **[Salió 2016]** Preorden (7, 8, 2, 1, 5, 6, 9, 0): la raíz es 7.
2. Localiza la raíz en el inorden. Lo de su izquierda es el subárbol izquierdo; lo de su derecha, el derecho.
3. Repite con cada subárbol, tomando del preorden los elementos que le corresponden.

**Ejemplo 2008 [Salió 2008]**. Preorden 1-2-3-4-5, inorden 3-2-4-1-5.

- Raíz 1. Izquierdo: {3, 2, 4}. Derecho: {5}.
- Subárbol izquierdo: en preorden aparece primero 2, luego es su raíz. Su hijo izquierdo es 3 y el derecho, 4.
- Postorden: 3-4-2-5-1.

```text
        1
       / \
      2   5
     / \
    3   4
```

**Ejemplo 2007 [Salió 2007]**. Preorden a-b-d-c-e-f, inorden b-d-a-e-c-f.

- Raíz a. Izquierdo {b, d}; derecho {e, c, f}.
- Izquierdo: raíz b; d está a su derecha en el inorden, luego es hijo derecho de b.
- Derecho: raíz c; e a su izquierda y f a su derecha.
- Postorden: d-b-e-f-c-a.

### Árbol binario de búsqueda (ABB)

- Para cada nodo, las claves del subárbol izquierdo son menores y las del derecho, mayores.
- Búsqueda, inserción y borrado: O(log n) de media; **O(n) en el peor caso** (árbol degenerado, por ejemplo insertando datos ya ordenados).
- Borrado de un nodo con dos hijos: se sustituye por su sucesor inorden (mínimo del subárbol derecho) o su predecesor.

### Árboles AVL

- ABB equilibrado (Adelson-Velski y Landis, 1962).
- **Factor de equilibrio** de cada nodo: altura(derecho) − altura(izquierdo), que debe valer −1, 0 o 1.
- Al desequilibrarse se aplican **rotaciones**: simples (II, DD) o dobles (ID, DI).
- Altura máxima aproximada: 1,44·log2 n. Operaciones en O(log n) en el peor caso.

### Árboles rojo-negro

ABB autoequilibrado. Cada nodo tiene un color, rojo o negro. **[Salió 2025]** Propiedades:

1. Todo nodo es rojo o negro.
2. La **raíz es negra**.
3. Las hojas nulas (NIL) son negras.
4. Un nodo rojo **no puede tener hijos rojos** (no hay dos rojos seguidos).
5. Todo camino desde un nodo hasta sus hojas descendientes tiene el **mismo número de nodos negros** (altura negra).

Consecuencias:

- El camino más largo de la raíz a una hoja mide como máximo el doble que el más corto.
- Altura ≤ 2·log2(n+1). Búsqueda, inserción y borrado en O(log n).
- Se reequilibra con **recoloreados y rotaciones**. Está menos equilibrado que un AVL, pero hace menos rotaciones al insertar y borrar.
- Equivale a un árbol 2-3-4: un nodo negro con sus hijos rojos forma un 3-nodo o un 4-nodo.
- Lo usan `TreeMap` y `TreeSet` de Java, `std::map` de C++ y el planificador CFS de Linux.

### Árboles 2-3 y 2-3-4

Árboles de búsqueda **no binarios** y perfectamente equilibrados. **[Salió 2024]**

- En un 2-3-4 cada nodo interno tiene **2, 3 o 4 hijos** (2-nodo con 1 clave, 3-nodo con 2 claves, 4-nodo con 3 claves). **[Salió 2024]**
- **Todas las hojas están en el mismo nivel**. Por eso es falso que "las hojas pueden estar a distinto nivel".
- No es un árbol binario, así que no "cumple las propiedades del ABB" tal cual; generaliza el orden a nodos con varias claves.
- Inserción descendente: al bajar desde la raíz, se **dividen preventivamente** los 4-nodos que se encuentran. La reestructuración va **de la raíz hacia las hojas**. El árbol crece por la raíz.
- Un árbol 2-3-4 es un árbol B de orden 4. El árbol 2-3 es un árbol B de orden 3.

### Árboles B y B+

Pensados para disco: nodos grandes (una página), pocos accesos.

- **Árbol B de orden m**: cada nodo tiene como máximo m hijos y m−1 claves. Cada nodo, salvo la raíz, tiene al menos ⌈m/2⌉ hijos. Todas las hojas al mismo nivel.
- Inserción: si un nodo se llena, se **divide** y la clave central sube al padre. El árbol crece hacia arriba.
- **Árbol B+**: los datos (o punteros a registros) solo están en las hojas. Las hojas están enlazadas, lo que permite recorridos secuenciales rápidos. Es la base de los índices de casi todos los SGBD.
- **Árbol B\***: exige nodos llenos al menos en 2/3; redistribuye antes de dividir.

### Montículos (heaps)

- Árbol binario **completo** que cumple la propiedad de montículo: en un *max-heap* cada padre es mayor o igual que sus hijos (en *min-heap*, menor o igual).
- Se guarda en un array: los hijos del nodo i están en 2i+1 y 2i+2 (con índice desde 0).
- Insertar y extraer la raíz: O(log n). Consultar el máximo: O(1).
- Implementa colas de prioridad y el algoritmo **heapsort**.

### Otros árboles

- **Trie** (árbol de prefijos): autocompletado. **Árbol de Huffman**: códigos de compresión. **Árbol de expresión**: operadores en nodos internos.

## Grafos

### Conceptos

- **Grafo**: G = (V, A), vértices y aristas. Estructura dinámica y no lineal.
- **Dirigido** (aristas con sentido, arcos) o **no dirigido**. **Ponderado**: cada arista tiene un peso.
- **Grado** de un vértice: número de aristas que inciden en él. En dirigidos hay grado de entrada y de salida.
- **Conexo**: hay camino entre cualquier par de vértices. **Árbol**: grafo conexo y acíclico, con n−1 aristas.
- **Árbol recubridor** (de expansión, *spanning tree*): subgrafo que es árbol y contiene todos los vértices.

Representación:

| Representación | Memoria | Cuándo conviene |
|---|---|---|
| Matriz de adyacencia | O(V²) | Grafos densos; saber si hay arista en O(1) |
| Listas de adyacencia | O(V + A) | Grafos dispersos (lo más habitual) |

### Recorridos

- **En anchura (BFS)**: por niveles, con una **cola**. Da caminos más cortos en número de aristas en grafos no ponderados.
- **En profundidad (DFS)**: con una **pila** o recursividad. Sirve para detectar ciclos y para la ordenación topológica.

### Algoritmos clásicos

| Problema | Algoritmo | Técnica | Detalles |
|---|---|---|---|
| Camino más corto desde un origen, pesos no negativos | **Dijkstra** | Voraz | O((V+A)·log V) con montículo. **[Salió 2022]** |
| Camino más corto desde un origen, admite pesos negativos | **Bellman-Ford** | Programación dinámica | O(V·A); detecta ciclos negativos |
| Caminos más cortos entre todos los pares | **Floyd-Warshall** | Programación dinámica | O(V³) |
| Árbol recubridor mínimo | **Kruskal** | Voraz | Ordena aristas por peso; usa unión-búsqueda. **[Salió 2017]** |
| Árbol recubridor mínimo | **Prim** | Voraz | Crece desde un vértice añadiendo la arista más barata |
| Camino más corto con heurística | **A\*** | Búsqueda informada | Dijkstra guiado por una estimación |
| Orden de tareas con dependencias | Ordenación topológica | DFS o Kahn | Solo en grafos dirigidos acíclicos |

**[Salió 2022]** "Camino más corto desde un vértice origen al resto, con pesos" es Dijkstra. Floyd-Warshall calcula todos los pares; Prim y Kruskal construyen árboles recubridores.

**[Salió 2017]** Kruskal encuentra el árbol recubridor mínimo en un grafo conexo y ponderado. Distractores: Quicksort (ordenación), QR (factorización de matrices), Rijndael (es AES, cifrado).

## Algoritmos y complejidad

### Concepto y propiedades

Un **algoritmo** es una secuencia finita y ordenada de pasos no ambiguos que resuelve un problema.

Propiedades clásicas: **finitud** (termina), **precisión o definición** (cada paso es exacto), entrada, salida y efectividad.

- El tiempo que tarda un algoritmo en ejecutarse se llama **coste** (coste temporal). **[Salió 2006]** Finitud, definición y precisión son propiedades, no medidas.
- Un algoritmo puede tener **muchas implementaciones** (lenguajes, estructuras). **[Salió 2016]**
- La **complejidad algorítmica** representa la cantidad de recursos (tiempo, memoria) que necesita un algoritmo para resolver un problema. **[Salió 2016]**
- Se mide en el **mejor caso, el caso medio y el peor caso**, no en uno solo. **[Salió 2016]**

### Notación asintótica

- **O grande**: cota superior (lo habitual en exámenes).
- **Ω (omega)**: cota inferior. **Θ (theta)**: cota ajustada (superior e inferior a la vez).
- Se ignoran constantes y términos menores: 3n² + 5n + 2 es O(n²).

Órdenes de menor a mayor crecimiento **[Salió 2017 b3]**:

| Orden | Nombre | Ejemplo |
|---|---|---|
| O(1) | Constante | Acceso a un array por índice |
| O(log n) | Logarítmico | Búsqueda binaria |
| O(n) | Lineal | Búsqueda secuencial |
| O(n log n) | Casi lineal (linealítmico) | Mergesort, heapsort |
| O(n²) | Cuadrático | Burbuja, selección, inserción |
| O(n³) | Cúbico | Producto de matrices clásico, Floyd-Warshall |
| O(2^n) | Exponencial | Subconjuntos, Fibonacci recursivo ingenuo |
| O(n!) | Factorial | Permutaciones, viajante por fuerza bruta |

En 2017 la respuesta válida era "logarítmico, lineal, cuadrático, exponencial y factorial".

### Técnicas de diseño de algoritmos

| Técnica | Idea | Ejemplos |
|---|---|---|
| Fuerza bruta | Probar todas las posibilidades | Búsqueda secuencial |
| **Divide y vencerás** | Dividir en subproblemas independientes, resolver y combinar | Mergesort, Quicksort, búsqueda binaria |
| **Voraz** (*greedy*) | En cada paso elige la opción localmente óptima y nunca la revisa | Dijkstra, Prim, Kruskal, Huffman, cambio de monedas |
| **Programación dinámica** | Subproblemas solapados; guarda resultados (memoización o tabla) | Floyd-Warshall, Bellman-Ford, mochila 0/1, Fibonacci con tabla |
| **Vuelta atrás** (*backtracking*) | Explora un árbol de soluciones y retrocede al fallar | N reinas, sudoku, laberintos |
| **Ramificación y poda** | Como vuelta atrás, pero poda con cotas | Asignación, viajante |

**Algoritmo voraz** **[Salió 2025 b3, reserva]**:

- Toma decisiones irrevocables basadas en un criterio de selección local.
- Es rápido y sencillo, pero **no siempre da el óptimo global**.
- Da el óptimo si el problema cumple la propiedad de **elección voraz** y la **subestructura óptima**.
- Óptimo: Dijkstra, Prim, Kruskal, Huffman, mochila fraccionaria, cambio de monedas con sistema canónico (euro).
- No óptimo: mochila 0/1 o cambio con monedas arbitrarias (por ejemplo, monedas de 1, 3 y 4 para pagar 6: voraz da 4+1+1, el óptimo es 3+3).

**Recursividad**: una función que se llama a sí misma. Necesita un **caso base**. Cada llamada ocupa un marco en la pila de llamadas; sin caso base hay desbordamiento de pila.

```java
int factorial(int n) { return (n <= 1) ? 1 : n * factorial(n - 1); }
int fib(int n) { return (n < 2) ? n : fib(n - 1) + fib(n - 2); }   // O(2^n)
```

## Algoritmos de ordenación

### Conceptos

- **Ordenación interna**: los datos caben en memoria. **Externa**: datos en disco (mezcla de tramos, *mergesort* externo).
- **Estable**: mantiene el orden relativo de los elementos con igual clave.
- **In situ** (*in place*): memoria extra O(1) u O(log n).
- Cota inferior de cualquier ordenación **por comparaciones**: Ω(n log n). Solo los métodos sin comparaciones bajan de ahí.

### Tabla resumen

| Algoritmo | Mejor | Medio | Peor | Memoria extra | Estable | Familia |
|---|---|---|---|---|---|---|
| Burbuja (intercambio directo) | O(n) con indicador | O(n²) | O(n²) | O(1) | Sí | Intercambio |
| Selección directa | O(n²) | O(n²) | O(n²) | O(1) | No | Selección |
| Inserción directa | O(n) | O(n²) | O(n²) | O(1) | Sí | Inserción |
| Shell | O(n log n) | Depende de saltos | O(n²) o menos | O(1) | No | Inserción con saltos |
| Mergesort (fusión, mezcla) | O(n log n) | O(n log n) | O(n log n) | O(n) | Sí | Divide y vencerás |
| Quicksort (rápido) | O(n log n) | O(n log n) | O(n²) | O(log n) | No | Divide y vencerás |
| Heapsort (montículo) | O(n log n) | O(n log n) | O(n log n) | O(1) | No | Selección |
| Counting sort (cuenta) | O(n + k) | O(n + k) | O(n + k) | O(n + k) | Sí | Sin comparaciones |
| Radix sort (residuos) | O(d·(n + k)) | O(d·(n + k)) | O(d·(n + k)) | O(n + k) | Sí | Sin comparaciones |
| Bucket sort (cubetas) | O(n + k) | O(n + k) | O(n²) | O(n + k) | Sí si las cubetas lo son | Sin comparaciones |

(k: rango de valores o número de cubetas; d: número de dígitos.)

### Burbuja (intercambio directo)

Recorre el vector comparando cada elemento con su **sucesor** y los intercambia si no están en orden. **[Salió 2017]** En cada pasada el mayor "sube" al final.

- Número máximo de pasadas: **N − 1**. **[Salió 2016]**
- Con un indicador de "no hubo intercambios" se detiene antes. Así el mejor caso (ya ordenado) es O(n).

```java
void burbuja(int[] v) {
    for (int pasada = 1; pasada < v.length; pasada++) {      // N-1 pasadas
        boolean cambio = false;
        for (int j = 0; j < v.length - pasada; j++) {
            if (v[j] > v[j + 1]) { int t = v[j]; v[j] = v[j + 1]; v[j + 1] = t; cambio = true; }
        }
        if (!cambio) break;
    }
}
```

Traza con 10 5 7 2 3:

```text
Pasada 1: 5 7 2 3 10
Pasada 2: 5 2 3 7 10
Pasada 3: 2 3 5 7 10
Pasada 4: sin cambios, termina
```

Distractores de 2017: "busca el menor y lo intercambia con el primero" es **selección**. "Compara secuencialmente hasta encontrarlo" es **búsqueda secuencial**.

### Selección e inserción

- **Selección directa**: busca el mínimo del resto y lo coloca en su posición. Hace exactamente n−1 intercambios. No es estable.
- **Inserción directa**: toma cada elemento y lo inserta en su lugar dentro de la parte ya ordenada (como ordenar cartas). Muy buena con datos casi ordenados.
- **Shell**: inserción con saltos decrecientes (por ejemplo n/2, n/4... 1).

### Quicksort

Hoare, 1960. Divide y vencerás:

1. Elige un **pivote**.
2. **Partición**: menores a la izquierda, mayores a la derecha.
3. Ordena recursivamente cada parte.

- Caso medio y mejor: **O(n log n)**. Peor caso: **O(n²)**, cuando el pivote es siempre el mínimo o el máximo (por ejemplo, vector ya ordenado tomando el primero como pivote). **[Salió 2017 b3]**
- Se mitiga con pivote aleatorio o mediana de tres.
- Java usa *dual-pivot quicksort* en `Arrays.sort` para tipos primitivos.

```java
void quicksort(int[] v, int ini, int fin) {
    if (ini >= fin) return;
    int p = v[fin], i = ini;
    for (int j = ini; j < fin; j++)
        if (v[j] < p) { int t = v[i]; v[i] = v[j]; v[j] = t; i++; }
    int t = v[i]; v[i] = v[fin]; v[fin] = t;   // pivote en su sitio
    quicksort(v, ini, i - 1);
    quicksort(v, i + 1, fin);
}
```

### Mergesort (fusión o mezcla)

- Divide el vector en dos mitades, ordena cada una y las **fusiona**.
- Siempre O(n log n), estable, pero necesita O(n) de memoria extra.
- Base de la ordenación externa de ficheros.
- **TimSort** (híbrido de mergesort e inserción, estable) es el de `Collections.sort` y `Arrays.sort` de objetos en Java, y el de Python.

### Ordenación en tiempo lineal

No comparan elementos entre sí, por eso pueden bajar de n log n. **[Salió 2025, reserva]**

- **Counting sort** (por cuenta): cuenta cuántas veces aparece cada valor en un rango pequeño [0, k] y reconstruye. O(n + k).
- **Radix sort** (por residuos, por dígitos): ordena dígito a dígito con un método estable. Usa **urnas** o cubetas (una por dígito, 10 en base 10) donde deposita los registros en cada pasada. **[Salió 2015]**
- **Bucket sort** (por cubetas): reparte valores uniformemente distribuidos en cubetas, ordena cada una y concatena.

Traza de radix sort LSD (dígito menos significativo primero) con 170 45 75 90 802 24 2 66:

```text
Por unidades: 170 90 802 2 24 45 75 66
Por decenas:  802 2 24 45 66 170 75 90
Por centenas: 2 24 45 66 75 90 170 802
```

## Algoritmos de búsqueda

| Búsqueda | Requisito | Complejidad | Idea |
|---|---|---|---|
| Secuencial (lineal) | Ninguno | O(n) | Compara uno a uno desde el principio |
| **Binaria** (dicotómica) | Vector **ordenado** y acceso directo | O(log n) | Compara con el centro y descarta la mitad |
| Interpolación | Ordenado y distribución uniforme | O(log log n) medio, O(n) peor | Estima la posición según el valor |
| Hash | Función hash | O(1) medio, O(n) peor | Calcula la posición a partir de la clave |
| ABB | Árbol de búsqueda | O(log n) medio, O(n) peor | Baja a izquierda o derecha |
| Árbol equilibrado (AVL, rojo-negro, B) | Árbol equilibrado | O(log n) | Garantiza altura logarítmica |

Con un vector ordenado de 1.000.000 de elementos, la binaria necesita como máximo unas 20 comparaciones (2^20 ≈ 10^6).

```java
int busquedaBinaria(int[] v, int x) {
    int ini = 0, fin = v.length - 1;
    while (ini <= fin) {
        int medio = ini + (fin - ini) / 2;     // evita desbordamiento
        if (v[medio] == x) return medio;
        if (v[medio] < x) ini = medio + 1; else fin = medio - 1;
    }
    return -1;
}
```

Búsqueda en grafos: BFS y DFS (ver grafos). En inteligencia artificial: A\* y búsqueda heurística.

## Organización de ficheros

### Conceptos

- **Fichero**: conjunto de **registros** del mismo tipo. Registro: conjunto de **campos**. **Clave**: campo que identifica el registro.
- **Registro lógico**: el que ve el programa. **Registro físico o bloque**: unidad de transferencia con el soporte. **Factor de bloqueo**: registros lógicos por bloque.
- **Soporte secuencial**: cinta. **Soporte direccionable** (acceso directo): disco.
- **Organización**: cómo se colocan los registros en el soporte. **Modo de acceso**: cómo se leen (secuencial o directo). No son lo mismo.
- **Tasa de actividad** (de utilización): porcentaje de registros que se procesan en cada ejecución. **Volatilidad**: frecuencia de altas y bajas.

### Organización secuencial

Los registros se graban en posiciones **físicamente contiguas**, en el orden en que se introducen, **sin huecos**. **[Salió 2006]**

- Aprovecha al máximo el soporte.
- Se puede grabar en **cualquier soporte**, secuencial o direccionable.
- Solo admite acceso secuencial: para leer el registro n hay que leer los n−1 anteriores.
- **No se pueden insertar registros** entre los ya grabados; se añaden al final o se reescribe el fichero.
- Aconsejable para ficheros con **alta tasa de utilización** y **estables** (pocas altas y bajas), en procesos por lotes. **[Salió 2005]** Era falso "aconsejable para ficheros con bajo índice de utilización e inestables".
- Actualización típica: fichero maestro + fichero de movimientos, generando un maestro nuevo.

### Organización secuencial indexada

Los registros se graban ordenados por clave y se crean **índices** para llegar a ellos directamente.

Áreas:

1. **Área primaria (de datos)**: registros ordenados por clave.
2. **Área de índices**: se genera al grabar los datos. Guarda la clave más alta de cada bloque y su dirección. **[Salió 2008]**
3. **Área de desbordamiento (overflow)**: guarda los registros que no caben en su sitio del área primaria tras altas. **[Salió 2005]**

Características:

- Permite acceso **secuencial y directo** (por índice). **[Salió 2005, 2008]**
- Ocupa **más espacio** que un secuencial (índices y overflow). **[Salió 2008]**
- **Solo puede estar en soporte direccionable** (disco), nunca en cinta. **[Salió 2008]** Era la característica falsa.
- Permite actualizar registros en el mismo fichero y proceso interactivo, no solo por lotes.
- Con muchas altas, el overflow crece y el rendimiento cae: hay que **reorganizar**.
- Implementaciones históricas: ISAM y VSAM de IBM. La evolución moderna usa árboles B+.

### Organización directa (aleatoria) y relativa

- **Directa o aleatoria**: la posición del registro se obtiene aplicando una **función hash** (de transformación) a la clave. Requiere soporte direccionable.
- Hay **sinónimos** (colisiones), que van a un área de desbordamiento o a la siguiente posición libre.
- **Relativa**: la clave es directamente el número de registro (posición relativa al inicio).
- Acceso muy rápido a un registro concreto; mal rendimiento en recorridos ordenados.

### Otras organizaciones

- **Indexada pura**: índice denso (una entrada por registro) sobre un área de datos desordenada.
- **Ficheros invertidos**: índices por campos secundarios; cada valor apunta a todos los registros que lo contienen. Base de los motores de búsqueda de texto.
- **Multilista**: los registros con el mismo valor de un campo se encadenan con punteros.

### Comparativa

| Organización | Soporte | Acceso | Inserción | Uso típico |
|---|---|---|---|---|
| Secuencial | Cualquiera | Solo secuencial | Al final o reescribiendo | Lotes con alta actividad |
| Secuencial indexada | Direccionable | Secuencial y directo | Overflow | Mixto: consultas y listados |
| Directa (hash) | Direccionable | Directo | Por hash, con sinónimos | Consultas puntuales rápidas |

## Formatos de información y ficheros

### Compresión

| Tipo | Técnica | Ejemplos |
|---|---|---|
| Sin pérdida | **RLE** (longitud de series) | BMP comprimido, TIFF, fax |
| Sin pérdida | **Huffman** (longitud variable) | Parte de DEFLATE, JPEG, MP3 |
| Sin pérdida | **Diccionario LZ77, LZ78, LZW** | ZIP, gzip (DEFLATE = LZ77 + Huffman), GIF y TIFF (LZW) |
| Sin pérdida | Codificación aritmética | JPEG 2000, H.264 (CABAC) |
| Con pérdida | **Transformada discreta del coseno (TDC o DCT)** | JPEG, MPEG, H.264 |
| Con pérdida | Transformada wavelet | JPEG 2000 |
| Con pérdida | Cuantificación y modelos psicoacústicos | MP3, AAC |

- **Huffman** es un algoritmo de **compresión de datos** sin pérdida. **[Salió 2007]** Asigna códigos cortos a los símbolos frecuentes. Construye el árbol uniendo de forma voraz los dos símbolos menos frecuentes.
- **JPEG** es la técnica con pérdida entre LZW, Huffman, RLE y JPEG. **[Salió 2008]**
- La **codificación por transformación (TDC)** es el método con pérdidas; RLE, Huffman y LZW son sin pérdidas. **[Salió 2017]**

### Imagen

| Formato | Tipo | Compresión | Colores y transparencia | Notas |
|---|---|---|---|---|
| **JPEG** (.jpg) | Mapa de bits | Con pérdida (DCT), grado ajustable | 24 bits (16,7 millones); sin transparencia | Fotografía. ISO/IEC 10918 |
| JPEG 2000 | Mapa de bits | Con o sin pérdida (wavelet) | Admite alfa | Archivo, imagen médica |
| **PNG** | Mapa de bits | Sin pérdida (DEFLATE) | Hasta 48 bits; canal alfa | Sustituto libre de GIF. W3C e ISO 15948 |
| **GIF** | Mapa de bits | Sin pérdida (LZW) | 256 colores (paleta); transparencia de 1 bit | Admite animación |
| BMP | Mapa de bits | Normalmente sin compresión | Hasta 32 bits | Windows |
| TIFF | Mapa de bits | Sin compresión, LZW, JPEG | Varias capas y páginas | Escaneo, imprenta |
| **WebP** | Mapa de bits | Con o sin pérdida | Alfa y animación | Google |
| **HEIF/HEIC** | Contenedor | Con pérdida (HEVC) | Alfa, secuencias | iPhone |
| **AVIF** | Mapa de bits | Basado en AV1 | Alfa, HDR | Libre de regalías |
| **SVG** | **Vectorial** | Texto XML (se puede comprimir como .svgz) | Escalable sin pérdida de calidad | W3C. **[Salió 2017]** |
| EPS, AI, WMF/EMF, CGM | Vectorial | | | Otros vectoriales |

- **JPEG original** **[Salió 2018]**: con pérdida, **permite ajustar el grado de compresión** (calidad), soporta millones de colores y **no** soporta transparencia.
- **EXIF** no es un formato de imagen vectorial: son **metadatos** dentro de JPEG o TIFF (cámara, fecha, GPS).
- **Mapa de bits** (ráster): matriz de píxeles; pierde calidad al ampliar. **Vectorial**: primitivas geométricas; escala sin perder calidad.

### Audio y vídeo

- **Códec**: algoritmo que codifica y decodifica audio o vídeo. **Contenedor**: fichero que empaqueta pistas (MP4, MKV, WebM, AVI, MOV, Ogg).
- Audio con pérdida: MP3 (MPEG-1/2 Capa III), AAC, Vorbis, **Opus** (IETF RFC 6716). Sin pérdida: **FLAC**, ALAC. Sin comprimir: WAV (PCM).

| Códec de vídeo | Organismo | Año | Licencia |
|---|---|---|---|
| H.264 / AVC (MPEG-4 parte 10) | ITU-T e ISO/IEC | 2003 | Con patentes |
| H.265 / HEVC | ITU-T e ISO/IEC | 2013 | Con patentes |
| H.266 / VVC | ITU-T e ISO/IEC | 2020 | Con patentes |
| VP8, VP9 | Google | 2010, 2013 | Abiertos |
| **AV1** | Alliance for Open Media (AOMedia) | 2018 | Abierto y **libre de regalías** |

**[Salió 2019]** AV1 es un **nuevo códec de vídeo**. Lo impulsan Google, Mozilla, Netflix, Amazon, Microsoft y otros. Se usa en YouTube, Netflix y en el contenedor WebM. Su formato de imagen derivado es AVIF.

### Documentos

| Formato | Norma | Extensiones |
|---|---|---|
| **ODF** (OpenDocument) | OASIS e ISO/IEC 26300 | .odt (texto), **.ods (hoja de cálculo)**, .odp (presentación), .odg (gráficos) |
| **OOXML** (Office Open XML) | ECMA-376 e ISO/IEC 29500 | .docx, .xlsx, .pptx |
| Office binario antiguo | Propietario | .doc, .xls, .ppt |
| RTF | Microsoft | .rtf (texto enriquecido) |
| **PDF** | ISO 32000 | .pdf |

**[Salió 2016]** De odt, doc, ods y rtf, la hoja de cálculo es **.ods**.

En la Administración, la **NTI de Catálogo de estándares** (desarrollo del ENI) recoge los formatos admitidos. Incluye ODF, OOXML, PDF y PDF/A, JPEG, PNG, SVG, XML, CSV y JSON, entre otros.

### PDF y sus subconjuntos ISO

- PDF lo creó Adobe (1993). Es norma **ISO 32000-1:2008** (PDF 1.7) e **ISO 32000-2** (PDF 2.0, de 2017, revisada en 2020).

| Estándar | Norma ISO | Propósito |
|---|---|---|
| **PDF/A** | ISO 19005 | **Archivo y conservación a largo plazo**. Todo incrustado (fuentes), sin cifrado, sin JavaScript, sin contenido externo |
| **PDF/X** | ISO 15930 | **Artes gráficas e imprenta**: páginas listas para imprimir o para prensa |
| **PDF/E** | ISO 24517 | Documentos de **ingeniería** (planos, 3D) |
| **PDF/UA** | ISO 14289 | **Accesibilidad universal** (etiquetado, estructura) |
| PDF/VT | ISO 16612-2 | Impresión de datos variables (facturas, extractos) |

**[Salió 2022]** La falsa era **"PDF/I"**: no existe. Lo que describía (páginas listas para imprimir o para prensa) es PDF/X.

Versiones de PDF/A: A-1 (2005, basado en PDF 1.4), A-2 (2011), A-3 (2012, admite ficheros adjuntos de cualquier tipo) y **A-4** (2020, basado en PDF 2.0). Niveles de conformidad: **b** (básico, apariencia visual), **a** (accesible, con estructura etiquetada) y **u** (texto Unicode). PDF/UA tiene la parte 1 (2014) y la parte 2 (2024, basada en PDF 2.0).

### Formatos de intercambio de datos

**[Salió 2015]** CSV y XML sirven para importar y exportar datos. **SWF** era el formato de animaciones Flash (fin de soporte en 2020). **PFX** (PKCS#12) es un almacén de certificados con clave privada.

#### JSON (RFC 8259)

JSON (*JavaScript Object Notation*) es un **formato de texto ligero para el intercambio de datos**, independiente del lenguaje. **[Salió 2018]** No es gramática XML, ni API de Java, ni librería JavaScript.

- Norma vigente: **RFC 8259** (diciembre de 2017), que es el STD 90. Equivalente a **ECMA-404**. Sustituyó al RFC 7159.
- Tipo MIME: **application/json**. Extensión .json.
- Entre sistemas no cerrados debe codificarse en **UTF-8**. No se debe añadir BOM.

Tipos **[Salió 2025]**: cuatro **primitivos** y dos **estructurados**.

| Tipo | Clase | Ejemplo | Detalles |
|---|---|---|---|
| string | Primitivo | "hola" | Siempre comillas **dobles**; escapes \n, \", \\, \uXXXX |
| number | Primitivo | -12.5e3 | Sin ceros a la izquierda, sin hexadecimal, sin NaN ni Infinity |
| boolean | Primitivo | true, false | En minúsculas |
| null | Primitivo | null | En minúsculas |
| object | Estructurado | {"a": 1} | Pares nombre-valor sin orden; los nombres son strings y deberían ser únicos |
| array | Estructurado | [1, "x", null] | Secuencia ordenada de valores de cualquier tipo |

- Los literales `true`, `false` y `null` van en minúsculas.
- No hay tipo fecha: las fechas se envían como string (normalmente ISO 8601).
- No admite comentarios ni comas finales.
- Desde el RFC 7159, cualquier valor puede ser el texto JSON completo (no solo objeto o array).
- Ojo a cómo lo enumera el RFC 8259 (apartado 3): un valor JSON es **object, array, number o string, o uno de los tres literales false, null y true**. No nombra un tipo "boolean" en esa lista. La plantilla de 2025 dio como correcta "object, array, number, string, true, false y null".

```json
{
  "expediente": "2026/0042",
  "importe": 1250.75,
  "urgente": false,
  "notas": null,
  "interesados": [
    { "nif": "12345678Z", "rol": "solicitante" }
  ]
}
```

Relacionados: **JSON Schema** (validación), JSON-LD (datos enlazados, W3C), JSON Lines (un objeto por línea), JSON Patch (RFC 6902).

#### CSV (RFC 4180)

CSV (*comma-separated values*): texto plano con un registro por línea y campos separados por comas. El **RFC 4180** (octubre de 2005) es **informativo**: documenta la práctica común y registra el tipo MIME **text/csv**. **[Salió 2025]**

Reglas del RFC 4180:

1. Cada registro va en su propia línea, terminada en salto de línea **CRLF**.
2. El último registro puede llevar o no CRLF final.
3. Puede haber una **cabecera opcional** en la primera línea, con el mismo formato. El parámetro MIME `header=present` o `header=absent` lo indica.
4. Cada registro tiene uno o más campos separados por **comas**. Todos los registros deberían tener el mismo número de campos. El último campo no lleva coma detrás.
5. Los **espacios forman parte del campo** y no se ignoran.
6. Cada campo puede ir entre **comillas dobles** o no.
7. Los campos que contienen **comas, comillas dobles o saltos de línea (CRLF)** deben ir entre comillas dobles.
8. Una comilla doble dentro de un campo entrecomillado se escapa **duplicándola** ("").

```text
nif,nombre,observaciones
12345678Z,"García, Ana","Dijo ""urgente"""
87654321X,Luis Pérez,
```

- El separador punto y coma (habitual en España por la coma decimal) **no** es RFC 4180.
- El RFC original asume ASCII; el parámetro `charset` permite indicar otra codificación (UTF-8 hoy).

#### XML, YAML y otros

- **XML 1.0** (W3C, quinta edición de 2008). **YAML 1.2**: superconjunto de JSON, basado en indentación. Binarios: Protocol Buffers, Avro, CBOR (RFC 8949). Columnares: Parquet.

### Codificación de caracteres

- **ASCII**: 7 bits, 128 caracteres. ISO-8859-1 (Latin-1) y ISO-8859-15 (añade €): 8 bits.
- **Unicode**: repertorio universal. Codificaciones: **UTF-8** (1 a 4 bytes, compatible con ASCII, la de la web), UTF-16 (2 o 4 bytes), UTF-32 (4 bytes).
- **BOM**: marca de orden de bytes al inicio del fichero. JSON y la web desaconsejan usarla en UTF-8.

## Trampas y respuestas desactualizadas

- **Grado de un árbol frente a grado de un nodo** (2005, 2015): el grado del árbol es el máximo de sus nodos. "Número de hijos de un nodo" es el grado del nodo.
- **Grado frente a altura** (2018): un árbol binario lleno de 15 nodos tiene grado 2 y altura 4. Te ponen 4 para que confundas.
- **"Lleno" y "completo"**: en los textos españoles, lleno es todos los niveles completos; en inglés *full* es otra cosa. Lee el enunciado.
- **Bicola de entrada o salida restringida** (2017): lo restringido es la operación que solo se hace por un extremo.
- **Hashing abierto frente a direccionamiento abierto** (2016): son opuestos. Abierto es encadenamiento; direccionamiento abierto es hashing cerrado.
- **Factor de carga**: elementos entre tamaño de tabla, no "número de índices" (2016).
- **TAD e interface en Java** (2024): la interface es la especificación; la clase la implementa. La opción que lo invertía era la incorrecta.
- **2-3-4** (2024): las hojas siempre al mismo nivel; la división de 4-nodos es descendente, de la raíz a las hojas.
- **Quicksort** (2017 b3): O(n log n) es el caso **medio**. El peor caso es O(n²). Un distractor pone "O(n log n) en el peor caso".
- **Burbuja** (2016): pasadas máximas N−1, no N. Burbuja compara con el sucesor; la que busca el mínimo es selección (2017).
- **Dijkstra frente a Floyd-Warshall** (2022): desde un origen es Dijkstra; todos los pares es Floyd-Warshall. Dijkstra no admite pesos negativos (entonces Bellman-Ford).
- **PDF/I no existe** (2022). Impresión es PDF/X; archivo, PDF/A; ingeniería, PDF/E; accesibilidad, PDF/UA.
- **JPEG original** (2018): no tiene transparencia y no es sin pérdida. La compresión es ajustable. PNG, GIF y WebP sí tienen transparencia.
- **EXIF y HEIF no son vectoriales** (2017): EXIF son metadatos y HEIF es un contenedor de mapa de bits.
- **Huffman** (2007) es compresión, no detección ni corrección de errores (eso es CRC, Hamming).
- **Secuencial indexado** (2008): no puede estar en cinta. El secuencial sí admite cualquier soporte (2005).
- **JSON** (2018, 2025): no es XML ni una librería. RFC 8259 sustituye a RFC 7159 y RFC 4627. Si una opción cita RFC 4627 como vigente, es falsa. En 2025 la respuesta buena enumeraba los valores como en el apartado 3 del RFC: object, array, number, string, true, false y null (los literales, no "boolean").
- **CSV** (2025): RFC 4180 es informativo, no un estándar obligatorio. Las comillas se escapan duplicándolas, no con barra invertida.
- **SWF** (2015): Flash dejó de tener soporte en diciembre de 2020. Hoy ni siquiera se usa para animaciones.
- **Clase Stack de Java**: sigue existiendo, pero es heredada. Si preguntan la recomendada, es `Deque`/`ArrayDeque`.
