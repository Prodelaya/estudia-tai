# Tema 16. Lenguajes de programación

Peso: unas 2,7 preguntas de test y 2,4 de supuesto III por convocatoria (unos 7,7 puntos esperados). Hay 93 preguntas históricas clasificadas aquí, de 2005 a 2025 (examen de mayo de 2026). Se concentran en tres bloques: trazas de código («¿qué imprime?»), operadores con trampa (`^`, `++`, `==` frente a `equals`, lógica booleana) y estructuras de control (sobre todo `do-while` y `switch`). En el supuesto III aparecen además preguntas de «lenguaje aplicado»: colecciones Java, `java.time`, tipos nullable de C#, diccionarios de Python y librerías de Machine Learning.

## Cómo lo preguntan

- **Traza de código**: dan un fragmento y piden la salida. Java, C, C++, PHP y pseudocódigo (2016 ej1 81, 2017 ej1 43, 2024 ej1 35, 2016 b3 40).
- **Operador trampa**: `x^y` no es potencia sino XOR (2006 ej1 41, 2019 ej1 46). Pre y postincremento (2016 ej1 77, 2017 ej1 55).
- **Expresión lógica**: dan valores de `a`, `b`, `d` y piden el `c` que hace verdadera la expresión (2015 ej1 59, 2017 b3 10, 2024 ej1 33).
- **«Señale la falsa/incorrecta»** sobre conceptos: compilador e intérprete (2008, 2022), `switch` (2016), procedimientos (2005), arrays (2008, 2022).
- **Bucle que se ejecuta al menos una vez**: `do-while` o `REPEAT-UNTIL`. Ha salido en 2008, 2015 (dos veces), 2019 y como traza en 2006.
- **Sintaxis exacta de un lenguaje**: declarar un array en C# (2019), importar paquetes Java (2015, 2016), `int?` en C# (2024), `printStackTrace()` (2016).
- **Supuesto III con código «del proyecto»**: una clase o fragmento que se usa para varias preguntas seguidas (2008 Programa2, 2016 servidor de sockets, 2017 Funcionalidades 1 y 2).
- **Biblioteca o clase adecuada**: `StringBuilder` (2019), `LocalDateTime` (2024), `Set` (2022), Keras o TensorFlow (2019, 2025).

## Lenguajes de programación: concepto y clasificación

### Concepto

Un lenguaje de programación es un lenguaje formal con una sintaxis (forma) y una semántica (significado). Sirve para expresar algoritmos que ejecuta un ordenador. Sus elementos básicos son:

- **Léxico**: palabras reservadas, identificadores, literales, operadores, separadores y comentarios.
- **Sintaxis**: reglas de combinación, normalmente descritas con gramáticas BNF o EBNF.
- **Semántica**: qué hace cada construcción. Puede ser estática (tipos, comprobada al compilar) o dinámica (en ejecución).

### Generaciones

| Generación | Nivel | Ejemplos |
|---|---|---|
| 1GL | Lenguaje máquina (binario) | Código del procesador |
| 2GL | Ensamblador (mnemónicos) | MASM, NASM |
| 3GL | Alto nivel, procedimental u OO | FORTRAN, COBOL, C, C++, Pascal, Java, C#, Python |
| 4GL | Orientados al problema, declarativos | SQL, Natural, generadores de informes, ABAP |
| 5GL | Lógica, restricciones, IA | Prolog, Mercury |

C++ es un lenguaje de **tercera generación**, no de segunda **[Salió 2022]**.

### Nivel de abstracción

- **Bajo nivel**: máquina y ensamblador. Dependen del procesador.
- **Medio nivel**: a veces se dice de C, porque combina alto nivel con acceso a memoria y bits.
- **Alto nivel**: independientes de la máquina, cercanos al lenguaje humano.

### Paradigmas

| Paradigma | Idea | Lenguajes |
|---|---|---|
| Imperativo procedimental | Secuencia de órdenes que cambian el estado | C, Pascal, COBOL, FORTRAN |
| Orientado a objetos | Objetos con estado y comportamiento | Java, C#, C++, Smalltalk, Python |
| Funcional | Funciones puras, sin efectos laterales | LISP, Haskell, Erlang, F#, Scala, Clojure |
| Lógico | Hechos, reglas y consultas | Prolog |
| Declarativo de datos | Se describe el qué, no el cómo | SQL, HTML (marcado) |
| Dirigido por eventos | El flujo lo marcan eventos | JavaScript en navegador, Visual Basic |
| Concurrente | Procesos o hilos simultáneos | Go, Erlang, Ada |

La mayoría de los lenguajes actuales son **multiparadigma**: Java, C#, Python, JavaScript, Kotlin y Scala mezclan OO e imperativo con elementos funcionales.

### Lenguajes que conviene ubicar

| Lenguaje | Año | Dato clave |
|---|---|---|
| FORTRAN | 1957 | Cálculo científico. John Backus (IBM) |
| LISP | 1958 | Listas como estructura básica de datos y de código. John McCarthy **[Salió 2007]** |
| COBOL | 1959 | Gestión empresarial. Sigue en mainframes de la Administración |
| BASIC | 1964 | Pensado para principiantes |
| Logo | 1967 | Educativo, la «tortuga» |
| Pascal | 1970 | Niklaus Wirth. Enseñanza de programación estructurada |
| C | 1972 | Dennis Ritchie (Bell Labs). Escrito para UNIX |
| Smalltalk | 1972 | OO puro |
| Prolog | 1972 | Programación lógica |
| Ada | 1980 | Defensa de EE. UU. Tipado fuerte, concurrencia |
| C++ | 1985 | Bjarne Stroustrup. C con clases |
| Python | 1991 | Guido van Rossum. Indentación significativa |
| Java | 1995 | James Gosling (Sun). «Write once, run anywhere» |
| JavaScript | 1995 | Brendan Eich (Netscape). Estándar ECMAScript |
| PHP | 1995 | Rasmus Lerdorf. Lado servidor web |
| C# | 2000 | Microsoft, Anders Hejlsberg. Plataforma .NET |
| Scratch | 2007 | MIT Media Lab. Bloques visuales, **educativo** **[Salió 2017]** |
| Go | 2009 | Google. Concurrencia con goroutines |
| TypeScript | 2012 | Microsoft. Superconjunto tipado de JavaScript |
| Swift | 2014 | Apple, sustituto de Objective-C |
| Rust | 2015 | Seguridad de memoria sin recolector de basura |
| Kotlin | 2016 | JetBrains. Lenguaje preferente para Android |

Versiones vigentes a octubre de 2026 (útiles para preguntas nuevas):

- **Java**: versión cada seis meses. La LTS más reciente es **Java 25** (septiembre de 2025). Anteriores LTS: 8, 11, 17, 21.
- **C#**: C# 14 con **.NET 10** (noviembre de 2025, LTS).
- **Python**: rama 3.x. Python 2 está sin soporte desde el 1 de enero de 2020. Python 3.14 salió en octubre de 2025.
- **C**: estándar C23 (ISO/IEC 9899:2024). **C++**: C++23; C++26 en cierre.
- **JavaScript**: ECMAScript publica una edición cada junio (ES2025, ES2026).

### Tipado

| Eje | Opción A | Opción B |
|---|---|---|
| Momento de comprobación | **Estático** (al compilar): Java, C, C#, C++, Go | **Dinámico** (en ejecución): Python, JavaScript, PHP, Ruby |
| Rigor con las conversiones | **Fuerte** (no mezcla tipos sin conversión explícita): Java, Python, C# | **Débil** (conversiones implícitas): C, JavaScript, PHP |
| Declaración | **Explícito** (`int x`) | **Inferido** (`var x = 5` en Java 10+ y C#, `auto` en C++) |

Ojo: `var` de Java sigue siendo tipado estático. El compilador infiere el tipo y ya no cambia.

En JavaScript `"5" + 1` da `"51"` y `"5" - 1` da `4`. En Python `"5" + 1` lanza `TypeError`.

## Traductores: compiladores, intérpretes y afines

### Definiciones exactas

- **Compilador**: transforma el código fuente en su equivalente en otro lenguaje de más bajo nivel (objeto o máquina). Se traduce una vez y se ejecuta muchas **[Salió 2022]**.
- **Intérprete**: ejecuta directamente las instrucciones del lenguaje fuente, traduciendo sentencia a sentencia cada vez **[Salió 2022]**.
- **Transpilador** (*source-to-source compiler*): traduce de un lenguaje de alto nivel a otro de nivel similar. Ejemplos: TypeScript a JavaScript (`tsc`), Babel (ES moderno a ES5). **No** es «un intérprete y un compilador a la vez»: esa era la afirmación falsa **[Salió 2022]**.
- **Compilador cruzado** (*cross compiler*): genera ejecutable para una plataforma distinta de aquella en la que se ejecuta. Ejemplo: compilar en x86 para un microcontrolador ARM **[Salió 2022]**.
- **Ensamblador**: traduce ensamblador a código máquina.
- **Enlazador** (*linker*): une los ficheros objeto y las bibliotecas en un ejecutable.
- **Cargador** (*loader*): lleva el ejecutable a memoria para ejecutarlo.
- **Preprocesador**: transforma el fuente antes de compilar. En C procesa las líneas que empiezan por `#` **[Salió 2015]**.
- **Depurador** (*debugger*): ejecución paso a paso, puntos de ruptura, inspección de variables.

### Fases de un compilador

1. **Análisis léxico** (*scanner*): divide el texto en *tokens*. Detecta símbolos no válidos.
2. **Análisis sintáctico** (*parser*): comprueba la gramática y construye el árbol sintáctico.
3. **Análisis semántico**: tipos, declaraciones, ámbitos.
4. **Generación de código intermedio**.
5. **Optimización** de código.
6. **Generación de código objeto**.

La tabla de símbolos y el gestor de errores acompañan todas las fases. Las tres primeras forman el *front-end*; las tres últimas, el *back-end*.

### Compilado frente a interpretado

| Aspecto | Compilado | Interpretado |
|---|---|---|
| Traducción | Una vez, antes de ejecutar | En cada ejecución |
| Velocidad de ejecución | Mayor | Menor |
| Ejecuciones sucesivas | No necesitan volver a traducir **[Salió 2008]** | Traducen cada vez |
| Errores | Se detectan muchos al compilar | Aparecen al llegar a la línea |
| Portabilidad del resultado | El ejecutable depende de la plataforma | Basta con tener el intérprete |
| Modificar y probar | Hay que recompilar | Más ágil |
| Ejemplos | C, C++, Go, Rust | Python (CPython), PHP, shell, JavaScript clásico |

En 2008 las afirmaciones falsas eran «el interpretado es más rápido» y «el compilado es más fácil de modificar». La correcta: las ejecuciones sucesivas del compilado no necesitan traducir el fuente **[Salió 2008]**.

### Modelo híbrido: bytecode, máquina virtual y JIT

- **Java**: `javac` compila el `.java` a **bytecode** (`.class`), un código intermedio independiente de la CPU. La **JVM** ejecuta ese bytecode **[Salió 2005, 2022]**.
- **.NET**: el compilador de C# genera **CIL** (antes MSIL) dentro de ensamblados (`.dll`, `.exe`). El **CLR** lo ejecuta.
- **JIT** (*Just-in-Time*): técnica de ejecución que compila el código intermedio a código nativo en tiempo de ejecución, normalmente los fragmentos más usados **[Salió 2006]**. La usan la JVM HotSpot, el CLR y V8 (JavaScript).
- **AOT** (*Ahead-of-Time*): compila a nativo antes de ejecutar. Ejemplos: GraalVM *native-image*, .NET Native AOT.
- **Python** también compila a bytecode (`.pyc` en `__pycache__`) que interpreta la máquina virtual de CPython.
- **WebAssembly** (Wasm): formato binario portable que ejecutan los navegadores. Se obtiene compilando C, C++, Rust o C#.

En 2022 la afirmación «Bytecode es el código binario obtenido tras la compilación (Java)» era discutible. El bytecode es código intermedio, no código máquina nativo.

## Estructura de un programa

### Elementos comunes

Casi todos los programas tienen:

1. **Cabecera o declaraciones de módulo**: `package`, `import`, `#include`, `using`, `namespace`.
2. **Declaraciones**: constantes, tipos, variables globales, prototipos.
3. **Subprogramas**: funciones, procedimientos o métodos.
4. **Punto de entrada**: `main` en C, C++, Java y C#. En Python el código de nivel superior, con el idioma `if __name__ == "__main__":`.
5. **Comentarios** a lo largo del código.

### Programa en C

```c
#include <stdio.h>          /* directiva del preprocesador: inserta la cabecera */
#define MAX 10              /* macro: sin punto y coma */

int contador = 0;           /* variable global */

int suma(int a, int b);     /* prototipo */

int main(int argc, char *argv[]) {
    printf("Argumentos: %d\n", argc);
    return 0;
}

int suma(int a, int b) { return a + b; }
```

Puntos que han caído:

- `#include <stdio.h>` **incluye el contenido** del fichero de cabecera en el fuente. No «enlaza la librería»; eso lo hace el *linker* **[Salió 2008]**.
- `printf` es una **función de la biblioteca estándar** (declarada en `stdio.h`), no una palabra reservada **[Salió 2008]**.
- `argc` cuenta también el nombre del programa. `programa2 1 2 3 4` da `argc = 5` **[Salió 2008]**.
- `argv` es `char *argv[]`, equivalente a `char **argv`: un **puntero a puntero a char** **[Salió 2008]**.
- `char *aux;` declara un **puntero a char** llamado `aux` **[Salió 2008]**.
- Las directivas del preprocesador empiezan por **`#`** **[Salió 2015]**.
- `#define pi 3.141592;` está mal escrito: el `;` pasa a formar parte de la macro **[Salió 2006]**.
- Comentarios en C: `/* ... */`. Desde C99 también `//` de una línea **[Salió 2007]**.
- `gotoxy` está en **`conio.h`**, cabecera no estándar de los compiladores de Borland para MS-DOS **[Salió 2015]**.

Cabeceras estándar de C que conviene conocer:

| Cabecera | Contenido |
|---|---|
| `stdio.h` | Entrada y salida: `printf`, `scanf`, `fopen`, `getchar` |
| `stdlib.h` | `malloc`, `free`, `exit`, `atoi`, `rand`, `qsort` |
| `string.h` | `strlen`, `strcpy`, `strcmp`, `strcat`, `memcpy` |
| `math.h` | `sqrt`, `pow`, `sin`, `floor` |
| `ctype.h` | `isdigit`, `isalpha`, `toupper` |
| `time.h` | `time`, `clock` |
| `conio.h` | No estándar: `getch`, `clrscr`, `gotoxy` |

### Programa en C++

```cpp
#include <iostream>
using namespace std;

int a = 2;                  // global

int main() {
    int a = 10;             // local, oculta a la global
    cout << ::a << endl;    // 2: :: accede al ámbito global
    cout << a << endl;      // 10
    int n;
    cin >> n;               // lee de teclado
    return 0;
}
```

- `cin` es un **objeto** (de la clase `istream`) que representa la entrada estándar, el teclado **[Salió 2006]**.
- `<<` es el **operador de inserción**: envía datos al objeto de salida estándar `cout` **[Salió 2006]**. `>>` es el de extracción.
- `::a` accede a la variable **global** `a` cuando una local la oculta **[Salió 2016]**.
- Varias funciones con el mismo nombre en el mismo ámbito y distinta lista de parámetros son **funciones sobrecargadas** **[Salió 2022]**.
- `template` declara una **clase o función genérica** (plantilla) **[Salió 2017]**.

```cpp
template <typename T>
T maximo(T a, T b) { return (a > b) ? a : b; }
// maximo(3, 7) -> 7 ; maximo(2.5, 1.0) -> 2.5
```

### Programa en Java

```java
package es.ejemplo.app;           // opcional, primera sentencia

import java.util.ArrayList;       // importación de una clase
import java.util.*;               // todas las clases del paquete

public class Hola {               // la clase pública da nombre al fichero Hola.java
    static final int MAX = 10;    // constante

    public static void main(String[] args) {
        System.out.println("Hola " + args.length);
    }
}
```

- `java.lang` se importa siempre de forma implícita (`String`, `Math`, `StringBuilder`, `Integer`, `Thread`, `System`).
- `ArrayList`, `Iterator`, `Scanner`, `Arrays`, `List`, `Map` están en **`java.util`** **[Salió 2015]**.
- Sockets en **`java.net`** y `File` en **`java.io`** **[Salió 2016]**.
- `args.length` no incluye el nombre del programa, a diferencia de `argc` en C.
- Novedad de **Java 25** (JEP 512): ficheros fuente compactos y `main` de instancia. Basta con `void main() { IO.println("Hola"); }`.

### Programa en C#

```csharp
using System;

namespace Demo;

class Program {
    static void Main(string[] args) {
        Console.WriteLine("Hola");
    }
}
```

Desde C# 9 se admiten *top-level statements*: un fichero con solo `Console.WriteLine("Hola");` es un programa válido.

### Programa en Python

```python
import sys

def saludar(nombre):
    return f"Hola, {nombre}"

if __name__ == "__main__":
    print(saludar(sys.argv[1] if len(sys.argv) > 1 else "mundo"))
```

Los bloques se delimitan por **indentación**: todas las líneas del bloque llevan la misma sangría **[Salió 2019]**. PEP 8 recomienda 4 espacios. Mezclar tabuladores y espacios provoca `TabError` o `IndentationError`.

### Comentarios por lenguaje

| Lenguaje | Línea | Bloque | Documentación |
|---|---|---|---|
| C (C99+), C++, Java, C#, JavaScript, PHP | `//` | `/* */` | `/** */` (Javadoc, JSDoc), `///` (C# XML) |
| Python | `#` | No hay; se usan cadenas `"""..."""` | Docstring `"""..."""` |
| SQL | `--` | `/* */` | |
| Shell, Perl, Ruby | `#` | | |
| Pascal | | `{ }` y `(* *)` | |
| Visual Basic | `'` o `REM` | | |
| HTML, XML | | `<!-- -->` | |

### Ámbito y vida de las variables

- **Global**: declarada fuera de todo subprograma. Visible en todo el fichero (o programa).
- **Local**: declarada dentro de un subprograma o bloque. Solo existe mientras se ejecuta. Su memoria se reserva en la pila en cada llamada **[Salió 2005]**.
- **Ocultación** (*shadowing*): una local con el mismo nombre que una global la oculta dentro de su ámbito **[Salió 2008 ALCANCE, 2016]**.
- **Estática** (`static` en C dentro de una función): conserva su valor entre llamadas.
- Desde el programa principal **no** se puede acceder a las variables locales de un procedimiento. Esa era la incorrecta en 2005 **[Salió 2005]**.

Ámbito léxico (estático) frente a dinámico: casi todos los lenguajes usan el léxico. La visibilidad depende de dónde está escrito el código, no de quién llama.

### Modularidad: cohesión y acoplamiento

- **Acoplamiento**: grado de interdependencia entre módulos. Debe ser **bajo** **[Salió 2008]**.
- **Cohesión**: relación funcional entre los elementos de un mismo módulo. Debe ser **alta**.

| Acoplamiento (de mejor a peor) | Cohesión (de mejor a peor) |
|---|---|
| De datos (parámetros simples) | Funcional |
| De marca o estampado (estructuras) | Secuencial |
| De control (flags) | Comunicacional |
| Externo | Procedimental |
| Común (datos globales) | Temporal |
| De contenido (accede al interior de otro) | Lógica |
| | Coincidental |

## Tipos de datos

### Clasificación general

- **Simples o primitivos**: entero, real, carácter, lógico. Ocupan un tamaño fijo.
- **Enumerados**: lista de valores con nombre.
- **Estructurados o compuestos**: arrays, registros (`struct`), cadenas, conjuntos, ficheros.
- **Punteros y referencias**: contienen una dirección o referencia a otro dato.
- **Abstractos (TAD)**: tipo definido por sus operaciones (tema 12).

### Tipos primitivos de Java

Java tiene exactamente **8** tipos primitivos.

| Tipo | Tamaño | Rango o nota | Valor por defecto (atributo) |
|---|---|---|---|
| `byte` | 8 bits | -128 a 127 | 0 |
| `short` | 16 bits | -32.768 a 32.767 | 0 |
| `int` | 32 bits | unos ±2.147 millones | 0 |
| `long` | 64 bits | literal con `L`: `10L` | 0L |
| `float` | 32 bits | IEEE 754, literal con `f`: `1.5f` | 0.0f |
| `double` | 64 bits | IEEE 754, tipo real por defecto | 0.0 |
| `char` | 16 bits | Unidad UTF-16, sin signo | `'\u0000'` |
| `boolean` | No fijado por la especificación | `true` o `false` | `false` |

- `simple` **no** es un tipo de Java **[Salió 2018]**. Tampoco existen `unsigned`, `int8` ni `string` en minúscula.
- Todo lo demás es **tipo referencia**: clases (`String`, `Integer`), interfaces, arrays, enumerados, *records*.
- Las variables locales no tienen valor por defecto: usarlas sin inicializar es error de compilación.
- Cada primitivo tiene su **clase envoltorio** (*wrapper*): `Byte`, `Short`, `Integer`, `Long`, `Float`, `Double`, `Character`, `Boolean`. La conversión automática se llama *autoboxing* y *unboxing* (Java 5).

```java
int n = 5;
// n.equals(5);          // ERROR de compilación: un primitivo no tiene métodos
Integer m = 5;           // autoboxing
System.out.println(m.equals(5));   // true
```

**[Salió 2025]**: llamar a `equals` sobre una variable `int` no compila. `equals` es un método de objeto; con `Integer` sí funciona.

### Conversiones (casting)

- **Implícita o de ampliación** (*widening*): `byte → short → int → long → float → double`. Sin pérdida de rango.
- **Explícita o de estrechamiento** (*narrowing*): se escribe el tipo entre paréntesis. Trunca hacia cero, no redondea.

```java
double y = 272.895;
int x = (int)(y - 0.9);    // 271.995 -> 271
System.out.println(x);     // 271
```

**[Salió 2015]**: el resultado es `271`. El *cast* a `int` trunca la parte decimal.

Otras trampas de conversión:

- `int / int` da entero: `7 / 2` vale `3`. `7 / 2.0` vale `3.5`.
- `(int) 3.99` vale `3`; `(int) -3.99` vale `-3`. `Math.round(3.5)` vale `4`.
- `char` es numérico: `'A' + 1` vale `66`; `(char)('A' + 1)` vale `'B'`.
- Desbordamiento silencioso: `Integer.MAX_VALUE + 1` da `Integer.MIN_VALUE`.
- `0.1 + 0.2 == 0.3` es `false` en coma flotante. Para dinero, `BigDecimal`.

### Tipos en C y C++

| Tipo C | Tamaño típico | Nota |
|---|---|---|
| `char` | 1 byte | Puede ser con o sin signo según compilador |
| `short` | 2 bytes | |
| `int` | 4 bytes | El estándar solo exige al menos 16 bits |
| `long` | 4 u 8 bytes | |
| `long long` | 8 bytes | C99 |
| `float` / `double` | 4 / 8 bytes | |
| `_Bool` o `bool` | 1 byte | `bool` es palabra clave desde C23; antes, `<stdbool.h>` |

- En C clásico no hay booleano: `0` es falso y cualquier otro valor es verdadero.
- `sizeof` devuelve el tamaño en bytes de un tipo o variable.
- Modificadores: `signed`, `unsigned`, `const`, `volatile`, `static`, `extern`.

### Tipos en C#: valor, referencia y nullable

- **Tipos valor** (`struct`): `int`, `double`, `bool`, `char`, `decimal`, `DateTime`, `enum`. Se copian al asignar.
- **Tipos referencia** (`class`): `string`, `object`, arrays, clases, delegados.
- Un tipo valor **nullable** se declara con `?`: `int? telefono = null;`. Es azúcar sintáctico de `Nullable<int>` **[Salió 2024]**.
- Desde C# 8 existen los **tipos referencia anulables**: `string?` indica que puede ser `null` y el compilador avisa.

```csharp
int? telefono = null;
int t = telefono ?? 0;            // ?? : valor por defecto si es null
string? nombre = null;
int? largo = nombre?.Length;      // ?. : acceso condicional, da null
telefono ??= 600000000;           // asigna solo si es null
```

`int|null` es sintaxis de PHP o TypeScript, no de C#. `int ?? x` no declara nada: `??` es un operador.

### Tipos en Python y JavaScript

| Python | JavaScript |
|---|---|
| `int` (precisión arbitraria), `float`, `complex`, `bool` | `number` (doble IEEE 754), `bigint` |
| `str` (inmutable) | `string` (inmutable) |
| `list` (mutable), `tuple` (inmutable) | `Array` |
| `dict`, `set`, `frozenset` | `Object`, `Map`, `Set` |
| `None` | `null` y `undefined` |
| | `boolean`, `symbol` |

- `type(x)` en Python; `typeof x` en JavaScript. Ojo: `typeof null` devuelve `"object"`.
- En JavaScript los valores *falsy* son: `false`, `0`, `-0`, `0n`, `""`, `null`, `undefined` y `NaN`.
- En Python son falsos `False`, `None`, `0`, `0.0`, `""`, `[]`, `()`, `{}` y `set()`.

### Enumerados

```java
enum Color { ROJO, VERDE, AZUL }
Color c = Color.VERDE;
System.out.println(c.ordinal());   // 1 (posición desde 0)
System.out.println(c.name());      // VERDE
```

- En Pascal la función **`ORD`** da la posición de un valor en el tipo enumerado. `SUCC` y `PRED` dan el siguiente y el anterior **[Salió 2008]**.
- En Java, `ordinal()`. En C, cada constante es un `int` que empieza en 0: `enum Colores {amarillo, verde, rojo};` es correcto.

### Arrays

Un array es un tipo estructurado que guarda un conjunto **homogéneo** de datos. En C sus elementos ocupan posiciones **consecutivas** de memoria y se accede por índice **[Salió 2022]**.

| Lenguaje | Declaración válida | Nota |
|---|---|---|
| C, C++ | `int v[] = {1,2,3,4,10,9,80,70,19};` | Correcta: el tamaño se deduce **[Salió 2022]** |
| C, C++ | `int v[12];` | Tamaño fijo, sin inicializar |
| Java | `int[] v = new int[12];` o `int v[] = new int[12];` | Se inicializa a 0 |
| Java | `int[] v = {1, 2, 3};` | Solo en la declaración |
| C# | `int[] v = new int[3];` | |
| C# | `int[] v = new[] {1, 2, 3};` o `int[] v = {1, 2, 3};` | **[Salió 2019]** |
| C# 12+ | `int[] v = [1, 2, 3];` | Expresiones de colección |
| Python | `v = [1, 2, 3]` | Es una lista dinámica |
| JavaScript | `const v = [1, 2, 3];` | |

En C# `int v[] = ...` **no** compila: los corchetes van pegados al tipo.

Datos clave de Java:

- Los índices van de `0` a `length - 1`. Fuera de rango salta `ArrayIndexOutOfBoundsException` en ejecución.
- `length` es un **atributo** del array (`v.length`). En `String` es un **método** (`s.length()`). En colecciones, `size()` **[Salió 2008]**.
- Un array es un **objeto**: hereda de `Object` y vive en el *heap* **[Salió 2008]**.
- Los arrays bidimensionales son arrays de arrays y sus filas pueden tener longitudes distintas (*jagged*) **[Salió 2008]**.

```java
float[] saldoMensual = new float[12];
for (int i = 0; i < 12; i++) {          // 0..11: correcto
    System.out.println(saldoMensual[i]);
}
for (float s : saldoMensual) System.out.println(s);   // for-each equivalente
```

**[Salió 2016]**: el bucle correcto empieza en `0` y usa `< 12`. Con `<= 12` o empezando en `1` se sale del rango o se salta el primero.

### Cadenas

- En Java `String` es **inmutable**. Concatenar en un bucle crea un objeto nuevo en cada vuelta.
- Para concatenar mucho, **`StringBuilder`** (de `java.lang`, no sincronizado, más rápido) **[Salió 2019]**. `StringBuffer` es la versión sincronizada (segura para hilos).
- `==` compara **referencias**; `equals` compara **contenido**; `compareTo` devuelve un `int` (negativo, 0 o positivo).

```java
String a = "TAI";
String b = new String("TAI");
System.out.println(a == b);              // false: objetos distintos
System.out.println(a.equals(b));         // true
System.out.println(a.compareTo(b) == 0); // true
// if ("TAI".compareTo(a) == true)       // ERROR de compilación: int frente a boolean
```

**[Salió 2016]**: la sentencia que no compila es la que compara el `int` de `compareTo` con `true`.

En C una cadena es un array de `char` terminado en `'\0'`. `strlen` no cuenta ese terminador; `sizeof` del array sí.

### Secuencias de escape (C, Java, C#, JavaScript)

| Secuencia | Significado |
|---|---|
| `\n` | Salto de línea |
| `\t` | Tabulador horizontal |
| `\v` | **Tabulador vertical** **[Salió 2016]** |
| `\r` | Retorno de carro |
| `\b` | Retroceso (*backspace*) |
| `\f` | Avance de página (*form feed*) |
| `\a` | Alerta: hace sonar la campana del sistema |
| `\0` | Carácter nulo, fin de cadena en C |
| `\\` `\'` `\"` | Barra, comilla simple, comilla doble |
| `\uXXXX` | Carácter Unicode (Java, C#, JavaScript) |

Java no admite `\a` ni `\v`. Sí `\s` (espacio) desde Java 15.

### Constantes e inmutabilidad

| Lenguaje | Constante |
|---|---|
| Java | `final int MAX = 10;` **[Salió 2008]** |
| C | `const int meses = 12;` o `#define MESES 12` |
| C# | `const` (en compilación) y `readonly` (se fija en el constructor) |
| JavaScript | `const` (la referencia no cambia; el objeto sí puede mutar) |
| Python | No hay. Convenio: nombre en MAYÚSCULAS |

`final` en Java también impide sobrescribir un método o heredar de una clase.

### Palabras reservadas de Java

Java tiene unas 50 palabras clave. Conviene reconocer las que **no** lo son.

- Sí son: `abstract`, `assert`, `boolean`, `break`, `byte`, `case`, `catch`, `char`, `class`, `const`, `continue`, `default`, `do`, `double`, `else`, `enum`, `extends`, `final`, `finally`, `float`, `for`, `goto`, `if`, `implements`, `import`, `instanceof`, `int`, `interface`, `long`, `native`, `new`, `package`, `private`, `protected`, `public`, `return`, `short`, `static`, `strictfp`, `super`, `switch`, `synchronized`, `this`, `throw`, `throws`, `transient`, `try`, `void`, `volatile`, `while`, `_`.
- `goto` y `const` están **reservadas pero no se usan**.
- `true`, `false` y `null` son literales, no palabras clave, pero tampoco valen como identificadores.
- Contextuales (solo reservadas en ciertos sitios): `var`, `record`, `yield`, `sealed`, `permits`, `non-sealed`, `module`, `exports`, `requires`.
- **No** son de Java: `explicit` (C++ y C#), `include` (C), `out` (C#), `delete` (C++), `friend` (C++), `function` (JavaScript), `def` (Python), `elif`.

**[Salió 2016]**: el conjunto correcto era `assert, boolean, return, public, this`.

## Colecciones y bibliotecas estándar de uso frecuente

Este apartado es «lenguaje aplicado». Cae casi siempre en el supuesto III.

### Colecciones de Java (java.util)

| Interfaz | Duplicados | Orden | Implementaciones |
|---|---|---|---|
| `List` | Sí | Por inserción, acceso por índice | `ArrayList`, `LinkedList`, `Vector`, `Stack` |
| `Set` | **No** **[Salió 2022]** | Según implementación | `HashSet` (sin orden), `LinkedHashSet` (inserción), `TreeSet` (ordenado) |
| `Queue` / `Deque` | Sí | FIFO, o por prioridad | `ArrayDeque`, `LinkedList`, `PriorityQueue` |
| `Map` | Claves no; valores sí | Según implementación | `HashMap`, `LinkedHashMap`, `TreeMap`, `Hashtable` |

- `Map` **no** hereda de `Collection`.
- `Stack` hereda de `Vector` y admite duplicados. Hoy se recomienda `ArrayDeque` como pila.
- `List.of(...)`, `Set.of(...)` y `Map.of(...)` (Java 9) crean colecciones **inmutables**. `Set.of` lanza excepción si hay duplicados.
- Java 21 añadió `SequencedCollection`: `getFirst()`, `getLast()`, `reversed()`.

```java
import java.util.*;

List<String> lista = new ArrayList<>();
lista.add("A"); lista.add("B"); lista.add("A");
System.out.println(lista.size());          // 3

Set<String> conjunto = new HashSet<>(lista);
System.out.println(conjunto.size());       // 2

Map<String, Integer> notas = new HashMap<>();
notas.put("Ana", 7);
notas.put("Ana", 9);                       // sustituye el valor
System.out.println(notas.get("Ana"));      // 9
```

### Iteradores

| Método de `Iterator` | Función |
|---|---|
| `hasNext()` | Indica si quedan elementos **[Salió 2015]** |
| `next()` | Devuelve el siguiente y avanza |
| `remove()` | Elimina el último elemento devuelto por `next()` **[Salió 2015]** |

```java
Iterator<String> it = lista.iterator();
while (it.hasNext()) {
    String s = it.next();
    if (s.equals("A")) it.remove();    // forma segura de borrar al recorrer
}
```

Borrar con `lista.remove()` dentro de un for-each lanza `ConcurrentModificationException`.

### Fechas: java.time (Java 8)

| Clase | Representa |
|---|---|
| `LocalDate` | Solo fecha (2026-05-23) |
| `LocalTime` | Solo hora (09:30) |
| `LocalDateTime` | **Fecha y hora** sin zona **[Salió 2024]** |
| `ZonedDateTime` | Fecha y hora con zona (`Europe/Madrid`) |
| `OffsetDateTime` / `OffsetTime` | Con desfase respecto a UTC (+02:00) |
| `Instant` | Instante en la línea temporal (UTC) |
| `Duration` / `Period` | Duración en tiempo / en días, meses y años |
| `DateTimeFormatter` | Formateo y análisis de texto |

Son inmutables y seguras para hilos. Sustituyen a `java.util.Date` y `Calendar`.

```java
LocalDateTime fin = LocalDateTime.of(2026, 6, 15, 14, 0);
boolean enPlazo = LocalDateTime.now().isBefore(fin);
```

### Python: estructuras básicas

```python
opositor = {'nombre': 'Sandra Gomez', 'notas': [27, 36, 12]}
nota_segundo = opositor['notas'][1]     # 36: índice desde 0
opositor.get('edad', 0)                 # 0 si no existe la clave
opositor['notas'][-1]                   # 12: índice negativo desde el final
opositor['notas'][0:2]                  # [27, 36]: slicing, fin excluido
for clave, valor in opositor.items():
    print(clave, valor)
```

**[Salió 2019]**: `opositor['notas'][1]` da 36. Los diccionarios se indexan con corchetes y la clave; no se usa notación de punto.

- `opositor['edad']` sin existir lanza `KeyError`.
- Comprensión de listas: `[x * 2 for x in range(5) if x % 2 == 0]` da `[0, 4, 8]`.
- `range(1, 5)` genera 1, 2, 3, 4.

### Python: bibliotecas de datos y Machine Learning

| Biblioteca | Uso |
|---|---|
| **TensorFlow** | Aprendizaje profundo (Google). `import tensorflow as tf` **[Salió 2025]** |
| **Keras** | API de alto nivel para redes neuronales; hoy multi-backend (Keras 3) **[Salió 2019]** |
| **PyTorch** | Aprendizaje profundo (Meta). `import torch` |
| **scikit-learn** | ML clásico: regresión, clasificación, *clustering*. `import sklearn` |
| NumPy | Arrays y cálculo numérico. `import numpy as np` |
| pandas | Tablas (*DataFrame*). `import pandas as pd` |
| Matplotlib, Seaborn | Gráficos |
| SciPy | Cálculo científico |
| XGBoost, LightGBM | *Gradient boosting* |
| Hugging Face Transformers | Modelos de lenguaje preentrenados |
| NLTK, spaCy | Procesamiento de lenguaje natural |
| OpenCV, Mahotas | Visión artificial y procesado de imagen |
| openpyxl | Leer y escribir Excel (no es ML) |

`yum` es el gestor de paquetes de Red Hat, no una biblioteca. `pip` instala paquetes Python; `conda` también.

### Hilos en Java (concurrencia básica)

```java
static class Conecta extends Thread {      // o implements Runnable
    @Override
    public void run() {                     // código que se ejecuta en paralelo
        System.out.println("Atendiendo conexión");
    }
}
new Conecta().start();                      // start() crea el hilo y llama a run()
```

- El código asíncrono va en **`run()`**; se lanza con **`start()`** **[Salió 2016]**. Llamar a `run()` directamente no crea hilo.
- `Thread` es una clase: se usa `extends Thread`. `Runnable` es una interfaz: se usa `implements Runnable` **[Salió 2016]**.
- Java 21 añadió los **hilos virtuales**: `Thread.ofVirtual().start(tarea)` o `Executors.newVirtualThreadPerTaskExecutor()`.

### Excepciones (control de errores)

```java
try {
    File dir = new File(args[0]);
    if (!dir.exists()) {                    // comprobar que existe
        throw new FileNotFoundException(args[0]);
    }
} catch (IOException e) {
    e.printStackTrace();                    // traza de la pila
    System.err.println(e.getMessage());
} finally {
    System.out.println("Siempre se ejecuta");
}
```

- `exists()` comprueba que el fichero o directorio existe; `isDirectory()`, que es un directorio **[Salió 2016]**.
- `printStackTrace()` imprime la traza de pila; `getMessage()` devuelve el mensaje **[Salió 2016]**.
- Jerarquía: `Throwable` se divide en `Error` y `Exception`. `RuntimeException` y sus hijas son **no comprobadas**.
- *try-with-resources* (Java 7): `try (var in = new FileInputStream(f)) { ... }` cierra solo el recurso.

## Operadores y expresiones

### Clasificación

| Tipo | Java, C, C#, JavaScript | Python |
|---|---|---|
| Aritméticos | `+ - * / %` | `+ - * / // % **` |
| Incremento y decremento | `++ --` (pre y post) | No existen |
| Relacionales | `== != < > <= >=` **[Salió 2018]** | Igual, y además `is`, `in` |
| Lógicos | `&& \|\| !` | `and or not` |
| Bit a bit | `& \| ^ ~ << >>` (y `>>>` en Java y JS) | `& \| ^ ~ << >>` |
| Asignación | `= += -= *= /= %= &= ^= <<=` | Igual, y `:=` (morsa) |
| Condicional (ternario) | `cond ? a : b` | `a if cond else b` |
| Otros | `instanceof` (Java), `typeof` (JS), `sizeof` (C), `::` (C++) | |

En Java, `==` es un operador **relacional** (de comparación). No es de asignación, que es `=` **[Salió 2018]**.

En .NET (C# y VB.NET), `i += 1` **suma 1** al contenido de `i` **[Salió 2008]**. Equivale a `i = i + 1`.

### El operador ^ es XOR, no potencia

En C, C++, Java, C#, JavaScript y Python, `^` es el **O exclusivo bit a bit**. Da 1 donde los bits difieren.

```text
x = 6  -> 110
y = 3  -> 011
x ^ y  -> 101 = 5
```

**[Salió 2019]**: en Java, con `x = 6` e `y = 3`, `x ^ y` vale **5**. El distractor era 216 (6 elevado a 3).

```text
a = 85 -> 1010101
b = 71 -> 1000111
a ^ b  -> 0010010 = 18
```

**[Salió 2006]**: en C, `85 ^ 71` vale **18**.

Para potencias: `Math.pow(6, 3)` en Java (devuelve `double` 216.0), `pow()` de `math.h` en C, `6 ** 3` en Python y JavaScript, `Math.Pow` en C#. En Visual Basic y en Excel sí, `^` es potencia.

Método rápido para XOR: pasa a binario, compara bit a bit, 1 si son distintos. Comprueba con la propiedad `a ^ b ^ b == a`.

Otros operadores de bits:

| Expresión | Resultado | Por qué |
|---|---|---|
| `6 & 3` | 2 | 110 AND 011 = 010 |
| `6 \| 3` | 7 | 110 OR 011 = 111 |
| `~5` | -6 | Complemento a 2: `~x == -x - 1` |
| `5 << 2` | 20 | Desplazar n a la izquierda multiplica por 2 elevado a n |
| `20 >> 2` | 5 | Divide por 4 conservando el signo |
| `-8 >>> 28` (Java, int) | 15 | Desplazamiento sin signo: entra 0 por la izquierda |

### Incremento y decremento: prefijo y postfijo

- **Prefijo** `++x`: primero incrementa y luego usa el valor nuevo.
- **Postfijo** `x++`: primero usa el valor actual y luego incrementa.

```c
int x = 5, y = 3;
y = ++x;              /* x = 6, y = 6 */

int a = 11, b;
b = a--;              /* b = 11, a = 10 */

int c = 10, d;
d = c++;              /* d = 10, c = 11 */
```

**[Salió 2016]**: tras `y = ++x` con `x = 5`, se imprime `x = 6, y = 6`.

**[Salió 2017]**: para dejar `a = 10` y `b = 11` la opción era `int a=11, b; b=a--;`. Comprueba las otras:

| Código | a | b |
|---|---|---|
| `int a=11,b; b=a--;` | 10 | 11 |
| `int a=11,b; b=--a;` | 10 | 10 |
| `int a=10,b; b=++a;` | 11 | 11 |
| `int a=10,b; b=a++;` | 11 | 10 |

En C, expresiones como `i = i++ + ++i;` tienen **comportamiento indefinido**. En Java el orden de evaluación es de izquierda a derecha y el resultado sí está definido.

### División entera y módulo

| Expresión | Java, C, C#, JS (enteros) | Python |
|---|---|---|
| `7 / 2` | 3 (en JS, 3.5) | 3.5 |
| `7 // 2` | No existe | 3 |
| `-7 / 2` | -3 (trunca hacia cero) | -3.5 |
| `-7 // 2` | No existe | -4 (redondea hacia abajo) |
| `-7 % 2` | -1 (signo del dividendo) | 1 (signo del divisor) |
| `5 / 0` | Java: `ArithmeticException`. JS: `Infinity` | `ZeroDivisionError` |
| `5.0 / 0` | Java: `Infinity` | `ZeroDivisionError` |

### Operadores lógicos y cortocircuito

- `&&` y `||` evalúan en **cortocircuito**: si el primer operando decide el resultado, no evalúan el segundo.
- `&` y `|` aplicados a `boolean` en Java evalúan **siempre** ambos lados.
- En Python, `and` y `or` devuelven uno de los operandos, no necesariamente `True` o `False`: `0 or "x"` da `"x"`.

```java
String s = null;
if (s != null && s.length() > 0) { }   // seguro: no evalúa s.length()
if (s != null & s.length() > 0) { }    // NullPointerException
```

Leyes de De Morgan, muy útiles en preguntas de expresiones:

- `!(A && B)` equivale a `!A || !B`.
- `!(A || B)` equivale a `!A && !B`.

### Resolver expresiones lógicas: método

1. Sustituye los valores conocidos y evalúa cada comparación.
2. Simplifica las partes que no dependen de la incógnita.
3. Deja una condición sobre `c` y prueba cada opción.

**[Salió 2015]** Java, `a = 4`, `b = 6`: `!(a==b) && ((b<c) || (a>b))`.

- `!(4==6)` es `true`. `a>b` es `false`.
- Queda `b < c`, es decir `c > 6`. Respuesta: **c = 8**.

**[Salió 2017]** Pseudocódigo, `a = 4`, `b = 5`, `d = 5`: `(NOT (c>d) AND (a<c)) AND NOT ((a>b) AND (a<b))`.

- `(a>b) AND (a<b)` es siempre falso, así que su `NOT` es verdadero.
- Queda `c <= 5` y `c > 4`. Respuesta: **c = 5**.

**[Salió 2024]** `a=1, b=2, c=3, d=1`. ¿Qué operación da `true`?

- `Not (a==c) and (c>b)`: `Not(false)` es `true`; `3>2` es `true`. Resultado **true**.
- `Not (a>=d) and not (c>=b)`: `Not(true)` es `false`. Resultado **false**.

En pseudocódigo la precedencia habitual es `NOT` > `AND` > `OR`. `NOT` se aplica solo a lo que tiene inmediatamente detrás.

### Precedencia de operadores en Java (de mayor a menor)

| Nivel | Operadores |
|---|---|
| 1 | Postfijos `x++ x--`, acceso `.`, `[]`, llamada `()` |
| 2 | Unarios `++x --x + - ~ !`, *cast* |
| 3 | Multiplicativos `* / %` |
| 4 | Aditivos `+ -` |
| 5 | Desplazamiento `<< >> >>>` |
| 6 | Relacionales `< > <= >= instanceof` |
| 7 | Igualdad `== !=` |
| 8 | AND de bits `&` |
| 9 | XOR de bits `^` |
| 10 | OR de bits `\|` |
| 11 | AND lógico `&&` |
| 12 | OR lógico `\|\|` |
| 13 | Ternario `?:` |
| 14 | Asignación `= += -=` etc. (asociativa por la derecha) |

Consecuencia típica: `1 + 2 * 3` vale 7. `"a" + 1 + 2` vale `"a12"`; `1 + 2 + "a"` vale `"3a"`.

En C, `a & b == c` se evalúa como `a & (b == c)`, porque `==` tiene más precedencia que `&`.

En Python, `**` es asociativo por la derecha: `2 ** 3 ** 2` vale 512. Y `-2 ** 2` vale -4.

### Operador ternario

```javascript
const edad = 20;
const tipo = edad >= 18 ? "mayor" : "menor";      // "mayor"
const precio = esSocio ? 10 : esJoven ? 12 : 15;  // anidado: asocia por la derecha
```

**[Salió 2025]**: operador ternario en JavaScript. Sintaxis `condición ? valorSiTrue : valorSiFalse`.

Equivalentes: `cond ? a : b` en C, C++, Java, C# y PHP. En Python, `a if cond else b`. En SQL, `CASE WHEN`. En Visual Basic, `If(cond, a, b)`.

### Igualdad: == frente a equals, === y is

| Lenguaje | Compara referencia o identidad | Compara valor o contenido |
|---|---|---|
| Java | `==` (con objetos) | `equals()` |
| C# | `ReferenceEquals()` | `==` en `string` está sobrecargado y compara contenido |
| JavaScript | `===` (estricta, sin conversión) | `==` convierte tipos: `"5" == 5` es `true` |
| Python | `is` | `==` |
| PHP | `===` (valor y tipo) | `==` (con conversión) |

Trampa clásica de Java con la caché de `Integer`:

```java
Integer a = 127, b = 127;
System.out.println(a == b);   // true: caché de -128 a 127
Integer c = 128, d = 128;
System.out.println(c == d);   // false: objetos distintos
System.out.println(c.equals(d)); // true
```

### Operadores modernos de acceso nulo

| Operador | Lenguajes | Significado |
|---|---|---|
| `??` | C#, JavaScript, PHP | Valor alternativo si el izquierdo es `null` (o `undefined` en JS) |
| `?.` | C#, JavaScript, Kotlin | Acceso que devuelve `null` en vez de fallar |
| `??=` | C#, JavaScript, PHP | Asigna solo si la variable es `null` |
| `?:` (Elvis) | Kotlin, Groovy | Como `??` |

En JavaScript, `0 || 5` da 5 y `0 ?? 5` da 0. `??` solo reacciona ante `null` y `undefined`.

## Estructuras de control

La programación estructurada se apoya en el **teorema de Böhm-Jacopini** (1966). Todo algoritmo se puede escribir con tres estructuras: **secuencia**, **selección** e **iteración**. Por eso se desaconseja `goto`.

### Selección: if

```java
if (nota >= 5) {
    System.out.println("Apto");
} else if (nota >= 4) {
    System.out.println("Compensable");
} else {
    System.out.println("No apto");
}
```

- En Java y C# la condición tiene que ser `boolean`. `if (x = 5)` no compila en Java; en C sí, y siempre es verdadero.
- Sin llaves, el `if` controla **una sola** sentencia. El `else` se asocia al `if` más cercano (*dangling else*).
- Python usa `if`, `elif`, `else`, dos puntos y sangría **[Salió 2019]**.

### Selección múltiple: switch

```java
String opcion = "anulada";
switch (opcion) {
    case "anulada":
        System.out.println("opción anulada");
        break;
    case "cursada":
        System.out.println("opción cursada");
        break;
    default:
        System.out.println("desconocida");
}
```

Reglas de Java que se preguntan:

- Tipos admitidos en el `switch` clásico: `char`, `byte`, `short`, `int`, sus envoltorios, `enum` (Java 5) y **`String` (Java 7)** **[Salió 2017]**. Desde Java 21, cualquier tipo referencia con *pattern matching*.
- **No** admite `long`, `float`, `double` ni `boolean` en el `switch` clásico.
- Sin `break`, la ejecución **cae** (*fall-through*) al siguiente `case`.
- El `break` del último `case` o del `default` no es necesario **[Salió 2016]**.
- Equivale a una cadena de `if-else` anidados **[Salió 2016]**.
- **No** es un bucle: no repite nada. Esa era la afirmación falsa en 2016 **[Salió 2016]**.
- Las etiquetas `case` deben ser constantes y no repetirse.

`switch` con cadenas en un sistema anterior a Java 7 da **error de compilación** **[Salió 2017]**.

Expresiones `switch` (Java 14) y *pattern matching* (Java 21):

```java
int dias = switch (mes) {
    case 2 -> 28;
    case 4, 6, 9, 11 -> 30;
    default -> 31;
};                                  // con flecha no hay fall-through

String desc = switch (obj) {
    case Integer i when i > 0 -> "entero positivo";
    case String s -> "cadena de " + s.length();
    case null -> "nulo";
    default -> "otro";
};
```

`yield` devuelve un valor desde un bloque dentro de una expresión `switch`.

Otros lenguajes:

- C y C++: solo tipos enteros (`int`, `char`, `enum`). No admiten cadenas.
- C#: admite `string` desde siempre. No permite caer de un `case` con código al siguiente sin `goto case` o `break`.
- Python 3.10 añadió `match ... case`. Antes no había `switch`.
- JavaScript compara con igualdad estricta (`===`).

### Bucles

| Bucle | Comprueba la condición | Ejecuciones mínimas |
|---|---|---|
| `while` | Al principio | **0**: puede no ejecutarse nunca **[Salió 2008]** |
| `do ... while` | Al final | **1**: siempre al menos una vez **[Salió 2015, 2019]** |
| `REPEAT ... UNTIL` (Pascal) | Al final, repite hasta que sea verdadera | **1** **[Salió 2008]** |
| `for` | Al principio | 0 |
| `for-each` | Recorre una colección | 0 si está vacía |

- `do-while` se ejecuta una vez **antes** de evaluar la condición **[Salió 2019]**. Repite **mientras** sea verdadera.
- `REPEAT-UNTIL` repite **hasta que** sea verdadera: la condición está invertida respecto a `do-while`.
- Python no tiene `do-while`. Se simula con `while True:` y `break`.
- `IF` no es un bucle; es un distractor clásico **[Salió 2008]**.

```php
<?php
$i = 0;
do { echo $i; } while ($i > 0);    // imprime 0: una sola vez
$i = 1;
while ($i < 0) { echo $i; }         // no imprime nada
?>
```

**[Salió 2015]**: el bloque PHP que escribe `$i` al menos una vez es el `do-while`.

En 2006 se preguntó por el `DO...WHILE` del programa ALFA, que mostraba un menú. Se repetía **mientras** la opción elegida fuera distinta de la de salir (sin verificar el valor exacto).

### Anatomía del for

```java
for (inicialización; condición; actualización) { cuerpo }
```

Orden exacto: inicialización (una vez), condición, cuerpo, actualización, condición, cuerpo... La condición se evalúa **antes** de cada vuelta. La actualización, **después** del cuerpo.

Un `for` admite varias variables separadas por comas en la inicialización y en la actualización.

### Trazas resueltas de exámenes

**Bucle con dos variables (Java)** **[Salió 2016]**:

```java
for (int i = 10, j = 1; i > 0; i = i - j) {
    System.out.print(i);
    j++;
}
```

| Vuelta | i al imprimir | j tras `j++` | Nuevo i |
|---|---|---|---|
| 1 | 10 | 2 | 8 |
| 2 | 8 | 3 | 5 |
| 3 | 5 | 4 | 1 |
| 4 | 1 | 5 | -4 (sale) |

Salida: `10851`.

**Postincremento en la condición (C++)** **[Salió 2017]**:

```cpp
for (int i = 1; i++ < 10; i++) {
    (i == 5) ? cout << "Cinco" : cout << i << " ";
}
```

| Condición evaluada | i dentro del cuerpo | Imprime | i tras la actualización |
|---|---|---|---|
| 1 < 10 | 2 | 2 | 3 |
| 3 < 10 | 4 | 4 | 5 |
| 5 < 10 | 6 | 6 | 7 |
| 7 < 10 | 8 | 8 | 9 |
| 9 < 10 | 10 | 10 | 11 |
| 11 < 10, falso | | | |

Salida: `2 4 6 8 10`. Nunca vale 5 dentro del cuerpo, así que «Cinco» no aparece. El enunciado oficial traía erratas de transcripción (`1++`, `I== 5`).

**Bucle que no avanza (pseudocódigo)** **[Salió 2024]**:

```text
integer x = 0;
while x < 100 do (x = x + 1; print x; x = x - 1;)
```

Cada vuelta sube `x` a 1, imprime 1 y la baja a 0. La condición `0 < 100` nunca deja de cumplirse. Es un **bucle infinito** que imprime 1 sin parar.

**Ordenar Integer y recorrer (Java)** **[Salió 2016]**:

```java
Integer[] numeros = {3, 5, 1, 2};
Arrays.sort(numeros);
for (int n : numeros) { System.out.print(n); }
```

Compila sin problema: `Arrays.sort` admite arrays de objetos y el for-each hace *unboxing* a `int`. Salida: `1235`.

**Ocultación de variables (Java, programa ALCANCE)** **[Salió 2008]**: el patrón general es este.

```java
public class Alcance {
    static int x = 2;
    static void f() { int x = 5; System.out.println("X=" + x); }
    public static void main(String[] args) {
        f();                              // X=5 (local de f)
        System.out.println("X=" + x);     // X=2 (atributo estático)
    }
}
```

### Sentencias de salto

| Sentencia | Efecto |
|---|---|
| `break` | Sale del bucle o `switch` más interno |
| `continue` | Salta a la siguiente iteración del bucle |
| `return` | Sale del subprograma, devolviendo un valor si es función |
| `break etiqueta` (Java) | Sale del bucle etiquetado, aunque sea externo |
| `goto` | Salto incondicional. Existe en C, C++ y C#. En Java está reservada sin uso |
| `throw` | Lanza una excepción |

```java
for (int i = 0; i < 5; i++) {
    if (i == 1) continue;
    if (i == 4) break;
    System.out.print(i);       // imprime 023
}
```

### Programación funcional en lenguajes OO: lambdas y forEach

Java 8 incorporó **expresiones lambda**, **referencias a métodos** y la API **Stream**.

```java
List<Integer> nums = Arrays.asList(3, 0, 1, 8, 7, 2, 5, 4, 9, 6);

// Bucle clásico
for (Integer numero : nums) { System.out.println(numero); }

// Equivalente con forEach y lambda
nums.forEach(numero -> System.out.println(numero));

// Equivalente con referencia a método
nums.forEach(System.out::println);

// Stream: filtrar, transformar y reducir
int sumaParesAlCuadrado = nums.stream()
        .filter(n -> n % 2 == 0)
        .mapToInt(n -> n * n)
        .sum();                    // 0+64+4+16+36 = 120
```

**[Salió 2017]**: la alternativa correcta era `Arrays.asList(...).forEach(numero -> System.out.println(numero))`. Fallaban las que usaban `.for`, omitían el parámetro o declaraban `n` y usaban `numero`.

Sintaxis de lambda por lenguaje:

| Lenguaje | Sintaxis |
|---|---|
| Java | `(a, b) -> a + b` |
| C# | `(a, b) => a + b` |
| JavaScript | `(a, b) => a + b` (función flecha) |
| Python | `lambda a, b: a + b` |
| C++ | `[](int a, int b) { return a + b; }` |
| Kotlin | `{ a, b -> a + b }` |

Funciones de orden superior: reciben o devuelven funciones. Ejemplos: `map`, `filter`, `reduce`, `sorted(lista, key=...)`.

## Subprogramas: funciones y procedimientos

### Función frente a procedimiento

| Aspecto | Función | Procedimiento |
|---|---|---|
| Devuelve | **Un único valor** con `return` | Nada (o resultados por parámetros) |
| Uso | Puede ser **operando** de una expresión | Se invoca como sentencia independiente |
| En C, Java, C# | Tipo de retorno distinto de `void` | Método `void` |
| En Pascal | `FUNCTION` | `PROCEDURE` |
| En VB | `Function` | `Sub` |

- El subprograma con parámetros de entrada que determinan un **único** resultado de salida es la **función** **[Salió 2006]**.
- Una llamada a procedimiento **no** puede aparecer como operando de una expresión **[Salió 2024]**.
- Un procedimiento **no** necesita ejecutar `return` **[Salió 2024]**.
- Un procedimiento puede declarar variables locales; su memoria se reserva en cada llamada **[Salió 2005]**.

Términos: **parámetro formal** es el de la declaración; **parámetro real** o argumento es el de la llamada. **Firma** es nombre más tipos de los parámetros. El tipo de retorno no forma parte de la firma en Java.

### Paso de parámetros

| Modo | Qué se pasa | ¿Puede cambiar la variable del llamador? | Uso |
|---|---|---|---|
| **Por valor** | Una copia del valor | No | Entrada |
| **Por referencia** | La dirección de la variable | Sí | **Entrada/salida** **[Salió 2024]** |
| Por resultado | Nada al entrar; se copia al salir | Sí | Salida |
| Por valor-resultado | Copia al entrar y al salir | Sí | Entrada/salida |
| Por nombre | La expresión, que se reevalúa | Sí | Histórico (ALGOL 60) |

En 2024 era falsa la frase «el paso por referencia envía una copia del valor». Eso describe el paso por valor **[Salió 2024]**.

Cómo lo hace cada lenguaje:

- **C**: solo por valor. La referencia se simula pasando un **puntero** (`&x` en la llamada y `*p` en la función).
- **C++**: por valor y por referencia (`int &x`). También `const int &x` para no copiar ni modificar.
- **Java**: **siempre por valor**. Con objetos se copia el valor de la referencia: el método puede cambiar el estado del objeto, pero no hacer que la variable del llamador apunte a otro.
- **C#**: por valor por defecto; `ref` (entrada/salida), `out` (salida, obligatorio asignarlo), `in` (referencia de solo lectura), `params` (número variable).
- **Pascal**: por valor por defecto; `VAR` para referencia.
- **Ada**: modos `in`, `out` e `in out`.
- **Python**: «paso por asignación» (por referencia a objeto). Los mutables (`list`, `dict`) se pueden modificar dentro; los inmutables no.

```c
void intercambia(int *a, int *b) { int t = *a; *a = *b; *b = t; }
int x = 1, y = 2;
intercambia(&x, &y);     /* x = 2, y = 1 */
```

```java
static void cambia(int n, int[] v, StringBuilder sb) {
    n = 99;              // no afecta al llamador
    v[0] = 99;           // sí: modifica el objeto compartido
    sb.append("!");      // sí
    sb = new StringBuilder("otro");   // no: solo cambia la copia local
}
```

### Sobrecarga

**Sobrecarga** (*overloading*): varios subprogramas con el **mismo nombre** en el mismo ámbito y **distinta lista de parámetros** (número, tipo u orden) **[Salió 2022]**. Se resuelve al compilar.

- Solo cambiar el tipo de retorno **no** es sobrecarga válida: no compila.
- No confundir con **sobrescritura** (*overriding*): la subclase redefine un método heredado con la misma firma. Se resuelve en ejecución (tema 18).
- C++ y C# también permiten **sobrecargar operadores**. Java no, salvo el `+` de `String`, que viene de serie.
- C y Python no tienen sobrecarga de funciones. Python la emula con parámetros por defecto o `*args`.

### Otras características de los subprogramas

- **Parámetros por defecto**: C++, C#, Python, JavaScript, PHP. Java no los tiene.
- **Número variable de argumentos**: `int... nums` en Java, `params int[]` en C#, `*args` y `**kwargs` en Python, `...args` en JavaScript, `va_list` en C.
- **Efecto lateral** (*side effect*): el subprograma modifica algo fuera de su ámbito (global, parámetro por referencia, E/S).
- **Función pura**: mismo resultado para las mismas entradas y sin efectos laterales.
- **Transparencia referencial**: se puede sustituir la llamada por su valor sin cambiar el programa.
- **Funciones genéricas**: `template` en C++ **[Salió 2017]**, genéricos `<T>` en Java y C#.
- **Funciones en línea**: `inline` en C++ sugiere sustituir la llamada por el cuerpo.

### Registro de activación y pila

Cada llamada a un subprograma crea en la **pila** un **registro de activación** (*stack frame*) con:

1. Los **parámetros** o argumentos.
2. Las **variables locales**.
3. La **dirección de retorno**.
4. El valor devuelto y datos de control (enlace al registro anterior).

Al terminar la llamada, el registro se desapila. Los objetos creados con `new` o `malloc` van al **montículo** (*heap*), no a la pila.

## Recursividad

### Concepto

Un subprograma es **recursivo** cuando se llama a sí mismo, directa o indirectamente. Necesita:

- **Caso base**: se resuelve sin recursión y detiene las llamadas.
- **Caso recursivo**: se llama con un problema más pequeño que se acerca al caso base.

Sin caso base, o si no se alcanza, las llamadas no terminan. La pila se agota: `StackOverflowError` en Java, `RecursionError` en Python (límite por defecto de unas 1.000 llamadas).

En la pila, cada llamada recursiva guarda argumentos, variables locales y dirección de retorno. **No** necesita «el número de orden de la iteración» **[Salió 2015]**.

### Tipos

| Tipo | Descripción |
|---|---|
| Directa | `f` llama a `f` |
| Indirecta o mutua | `f` llama a `g` y `g` llama a `f` (`esPar`/`esImpar`) |
| Lineal | Una sola llamada recursiva en cada ejecución (factorial) |
| Múltiple o en árbol | Varias llamadas en cada ejecución (Fibonacci, Hanoi) |
| De cola (*tail*) | La llamada recursiva es lo último que se hace. Se puede convertir en bucle |
| Anidada | Un argumento es otra llamada recursiva (Ackermann) |

Java y Python **no** optimizan la recursión de cola. Scheme, Scala (`@tailrec`) y muchos compiladores de C sí.

### Ejemplos clásicos con traza

```java
static int factorial(int n) {
    if (n <= 1) return 1;            // caso base
    return n * factorial(n - 1);     // caso recursivo
}
// factorial(4) = 4 * 3 * 2 * 1 = 24
```

Traza de `factorial(4)`: se apilan `f(4)`, `f(3)`, `f(2)` y `f(1)`. `f(1)` devuelve 1. Al desapilar: `f(2)` = 2, `f(3)` = 6, `f(4)` = 24.

```java
static int fib(int n) {
    if (n < 2) return n;             // fib(0)=0, fib(1)=1
    return fib(n - 1) + fib(n - 2);
}
```

| n | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|---|---|
| fib(n) | 0 | 1 | 1 | 2 | 3 | 5 | 8 | 13 | 21 |

Si la serie empieza con `fib(1) = fib(2) = 1`, el 8 se obtiene también con n = 6. Lee siempre el caso base del código.

Otros clásicos y su resultado:

| Función | Definición | Resultado conocido |
|---|---|---|
| Potencia | `pot(b, e) = b * pot(b, e-1)`, `pot(b, 0) = 1` | `pot(2, 3) = 8` |
| Suma de 1 a n | `suma(n) = n + suma(n-1)`, `suma(0) = 0` | `suma(4) = 10` |
| MCD de Euclides | `mcd(a, b) = mcd(b, a % b)`, `mcd(a, 0) = a` | `mcd(48, 18) = 6` |
| Torres de Hanoi | Mover n-1, mover 1, mover n-1 | 2 elevado a n, menos 1 movimientos |
| Búsqueda binaria | Mitad del vector cada vez | O(log n) |
| Ackermann | Doble recursión anidada | Crece muy rápido; no es primitiva recursiva |

Para preguntas del tipo «¿qué parámetro hace que la función devuelva 8?» **[Salió 2018]**: haz la traza con cada opción. Empieza por el caso base y sube.

```java
static int misterio(int n) {
    if (n == 0) return 1;
    return 2 * misterio(n - 1);
}
// misterio(3) = 2 * 2 * 2 * 1 = 8
```

### Recursión frente a iteración

| Aspecto | Recursión | Iteración |
|---|---|---|
| Claridad | Natural en árboles, divide y vencerás, gramáticas | Natural en recorridos lineales |
| Memoria | Un registro de activación por llamada | Constante |
| Velocidad | Coste extra de cada llamada | Más rápida |
| Riesgo | Desbordamiento de pila | Bucle infinito |

Todo algoritmo recursivo puede escribirse de forma iterativa, a veces con una pila explícita. Fibonacci recursivo ingenuo es exponencial; con memorización (*memoization*) o iterativo es lineal.

```python
from functools import lru_cache

@lru_cache(maxsize=None)
def fib(n):
    return n if n < 2 else fib(n - 1) + fib(n - 2)
```

## Trampas y respuestas desactualizadas

- **2016 ej1 78 (switch de Java)**: la opción «la expresión debe devolver `char`, `byte`, `short` o `int`» ya era incompleta en 2016. Desde Java 5 admite `enum` y envoltorios; desde Java 7, `String`; desde Java 21, cualquier referencia con patrones. La oficial era la que decía que `switch` repite instrucciones. Hoy la otra también sería falsa.
- **2017 b3 26 (switch con cadenas)**: la respuesta depende de la versión. Con Java 7 o posterior compila y funciona.
- **2008 b3 13 (`printf`)**: no es palabra reservada. Es función de biblioteca.
- **2008 ej1 67 (`i += 1` en .NET)**: válido en C#. En VB.NET también existe `+=`, pero no `++`.
- **2015 ej1 78 (`gotoxy`)**: `conio.h` no es estándar ANSI/ISO. Compiladores actuales como GCC no la traen.
- **2007 ej1 53 (comentarios en C)**: `/* */` es lo clásico. Desde C99 también vale `//`.
- **2022 ej1 39 (bytecode «binario»)**: el bytecode no es código máquina nativo. Es código intermedio.
- **2019 b3 10 (Keras)**: Keras se integró en TensorFlow (`tf.keras`) y desde Keras 3 vuelve a ser multi-backend (TensorFlow, JAX, PyTorch).
- **Distractores de `^`**: la potencia (216) y el producto. En Java, C, C#, Python y JavaScript `^` es siempre XOR.
- **Distractores de bucles**: `while` «se ejecuta al menos una vez» es falso. `REPEAT-UNTIL` sí se ejecuta al menos una vez.
- **`==` con objetos**: compara referencias. `"a" == "a"` puede dar `true` por el *pool* de literales, pero no se debe confiar en ello.
- **Paso por referencia en Java**: no existe. Las preguntas que dicen «Java pasa los objetos por referencia» son imprecisas; pasa referencias por valor.
- **`length`, `length()` y `size()`**: array, `String` y colección, respectivamente.
- **Arrays en C#**: `int v[] = ...` es sintaxis de C, no de C#.
- **Python 2**: `print "hola"` y la división entera con `/` son de Python 2, sin soporte desde 2020. En Python 3, `7 / 2` da 3.5.
- **Generaciones**: C y C++ son de tercera generación; SQL, de cuarta; Prolog, de quinta.
- **`Stack` admite duplicados**: es una `List`. El que no los admite es `Set`.
- **Erratas de transcripción**: los enunciados oficiales a veces traen `1++` por `i++` o `lnt` por `int`. Interpreta la intención; el tribunal no suele anular por eso.
