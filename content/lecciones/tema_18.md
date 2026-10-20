# Tema 18. Orientación a objetos, patrones y UML

Peso en el examen: unas **3 preguntas de test** y **1-2 preguntas del supuesto del Bloque III** por convocatoria (unos 6 puntos esperados). Hay **78 preguntas históricas** (2005-2025): 54 de test y 24 de supuesto III. Se reparten en tres bloques casi iguales. Conceptos OO y Java (herencia, polimorfismo, sobrecarga, modificadores, abstract, final, static) suman unas 35. UML (tipos de diagramas, rombo de agregación, multiplicidades, diagrama de secuencia) suma unas 22. Patrones de diseño (GoF, GRASP, MVC) suman unas 17. La tendencia reciente (2019-2025) es más patrones y más UML, y menos teoría OO de manual.

## Cómo lo preguntan

- **Identificar el patrón por su definición GoF**: "convierte la interfaz de una clase en otra" (Adapter, 2016), "desacopla una abstracción de su implementación" (Bridge, 2015 y 2017), "añade funcionalidad dinámicamente" (Decorator, 2019), "sustituto que controla el acceso" (Proxy, 2017).
- **Clasificar patrones**: cuál es creacional (Singleton, 2018) o estructural (Bridge, 2016).
- **"Señale la INCORRECTA"** mezclando definiciones de patrones: en 2024 la opción falsa del Composite era la definición del Decorator.
- **Qué diagrama UML usar para X**: énfasis en orden temporal de mensajes (secuencia, 2016 y 2018), flujo de acciones (2024), diagramas de estructura frente a comportamiento (2015, 2018), interacción (tiempos, 2017).
- **Modificadores Java en el supuesto**: impedir herencia (final, 2019), constante común a todas las instancias (static final, 2016), solo clase y derivadas (protected, 2015), acceso directo sin getters (public, 2022).
- **Definiciones de manual**: clase, objeto, superclase, herencia, polimorfismo, sobrecarga, clase abstracta. Las preguntas de 2005-2008 son casi todas de este tipo.
- **Multiplicidades en un diagrama de clases** a partir de los requisitos del enunciado (2022 b3).
- **Lectura de código Java** con varias clases: contar clases, entender extends/implements, super(), main (2006 y 2008 b3).

## 1. Fundamentos de la orientación a objetos

### 1.1 Paradigma y conceptos básicos

La programación orientada a objetos (POO) organiza el software en **objetos** que combinan datos (estado) y comportamiento (métodos). Los objetos colaboran enviándose **mensajes**.

| Concepto | Definición de examen |
|---|---|
| Clase | Plantilla o molde que describe atributos y métodos comunes. "Conjunto de objetos con propiedades comunes" **[Salió 2008]**. "Estructura de datos abstracta junto con sus operaciones" **[Salió 2006]** |
| Objeto | Instancia concreta de una clase. Encapsula la información junto con las operaciones que se pueden realizar sobre ella **[Salió 2005]**. Abstracción de un dato y su comportamiento **[Salió 2015]** |
| Atributo | Dato o propiedad del objeto. Su valor en un momento dado es el estado |
| Método | Operación o algoritmo asociado a una clase u objeto |
| Mensaje | Petición que un objeto envía a otro para que ejecute un método |
| Instancia | Sinónimo de objeto. Instanciar es crear un objeto con `new` |
| Identidad | Cada objeto es distinguible aunque tenga el mismo estado que otro |

Un objeto tiene tres propiedades: **estado** (valores de atributos), **comportamiento** (métodos) e **identidad**.

### 1.2 Los pilares y características del modelo OO

Booch habla de cuatro elementos fundamentales: **abstracción, encapsulamiento, modularidad y jerarquía**. Añade tres secundarios: tipos, concurrencia y persistencia. En los test se suelen citar como características de la OO:

- **Abstracción**: quedarse con las características esenciales y ocultar los detalles que no aportan. Una opción de 2016 la definía así como distractor del polimorfismo.
- **Encapsulamiento**: agrupar datos y métodos en una unidad y proteger el estado interno. Se accede mediante una interfaz pública.
- **Ocultación de información**: el detalle interno se hace privado. Va de la mano del encapsulamiento.
- **Modularidad**: descomponer el sistema en partes coherentes e independientes.
- **Herencia** (jerarquía): una clase adquiere atributos y métodos de otra.
- **Polimorfismo**: un mismo mensaje produce comportamientos distintos según el objeto que lo recibe.
- **Reusabilidad**: los componentes se pueden reutilizar en otros diseños.

"Durabilidad" **no** es una característica del modelo OO **[Salió 2018]**. Es una propiedad ACID de las transacciones (tema de bases de datos).

### 1.3 Herencia

La herencia permite definir una clase nueva (**subclase**, clase derivada o hija) a partir de otra existente (**superclase**, clase base o padre). La subclase hereda atributos y métodos, puede añadir otros nuevos y puede redefinir (sobrescribir) los heredados.

- Superclase: "clase padre de la que pueden derivar una serie de subclases" **[Salió 2017]**.
- Herencia: "mecanismo por el cual una clase adquiere las propiedades de una clase superior" **[Salió 2008]**.
- Ventaja principal: reutilización de código **[Salió 2008]**.
- Permite clases que nunca se instancian directamente (abstractas) **[Salió 2008]**.
- Relación "es un" (*is-a*): un `Coche` es un `Vehiculo`.

**Herencia simple y múltiple**

| Lenguaje | Herencia de clases | Cómo suple la múltiple |
|---|---|---|
| Java | Simple (una sola superclase) | Implementando varias interfaces |
| C# | Simple | Varias interfaces |
| C++ | Múltiple | No lo necesita. Problema del diamante, se resuelve con herencia `virtual` |
| Python | Múltiple | Orden de resolución MRO (C3) |
| Eiffel | Múltiple | Renombrado de rasgos |

La herencia múltiple existe, pero **no todos los lenguajes OO la ofrecen** **[Salió 2015]**. Java **no** tiene herencia múltiple de clases **[Salió 2008, 2016]**.

**Herencia y visibilidad.** Los miembros privados de la clase base **no son accesibles** desde la clase derivada **[Salió 2008]**. Existen en el objeto, pero la subclase no puede nombrarlos. Los protegidos sí son accesibles desde las subclases.

**Generalización y especialización.** En UML la herencia se llama **generalización**. Implica que la subclase hereda propiedades, comportamiento y relaciones de la superclase, y puede añadir los suyos **[Salió 2024]**. Generalizar es subir en la jerarquía (extraer lo común). Especializar es bajar (añadir lo específico).

### 1.4 Polimorfismo

Polimorfismo significa "muchas formas". Es la propiedad por la que **un mismo mensaje puede producir comportamientos distintos cuando lo reciben objetos distintos** **[Salió 2016]**. También se define como que un objeto presente diferentes comportamientos **[Salió 2008]**.

Tipos de polimorfismo:

| Tipo | Cuándo se resuelve | Ejemplo |
|---|---|---|
| Ad hoc: sobrecarga | Compilación (estático, enlace temprano) | `sumar(int,int)` y `sumar(double,double)` |
| Ad hoc: coerción | Compilación | Conversión implícita de `int` a `double` |
| Paramétrico | Compilación | Genéricos: `List<T>` |
| De inclusión o de subtipos | Ejecución (dinámico, enlace tardío) | `Figura f = new Circulo(); f.area();` |

El polimorfismo de subtipos se basa en la **ligadura dinámica** (*dynamic binding*). La JVM elige el método según el tipo real del objeto, no según el tipo de la variable.

```java
abstract class Figura { abstract double area(); }
class Circulo extends Figura {
    double r = 1;
    double area() { return Math.PI * r * r; }
}
class Cuadrado extends Figura {
    double l = 2;
    double area() { return l * l; }
}
Figura[] fs = { new Circulo(), new Cuadrado() };
for (Figura f : fs) System.out.println(f.area());
// Salida:
// 3.141592653589793
// 4.0
```

### 1.5 Sobrecarga frente a sobrescritura

Es la pareja más preguntada del tema. Hay que distinguirlas sin dudar.

| | Sobrecarga (*overloading*) | Sobrescritura (*overriding*) |
|---|---|---|
| Dónde | En la misma clase (o heredada) | En una subclase respecto a la superclase |
| Nombre | Igual | Igual |
| Parámetros | **Distintos** en número, tipo u orden | **Idénticos** (misma firma) |
| Tipo de retorno | Puede variar, pero no basta para distinguir | Igual o subtipo (covariante) |
| Resolución | Compilación (estática) | Ejecución (dinámica) |
| Polimorfismo | Ad hoc, estático | De inclusión, dinámico |
| Anotación Java | No tiene | `@Override` (opcional, recomendada) |

- Sobrecarga: "dos métodos con el mismo nombre pero distintos argumentos" **[Salió 2017]**. "Mismo nombre y parámetros diferentes en cantidad y/o tipo" **[Salió 2015]**.
- La sobrecarga **no** es polimorfismo dinámico. El compilador sí resuelve el método en compilación (distractor de 2015).
- Sobrescritura: la subclase redefine un método heredado con la misma firma **[Salió 2025]**.
- Un método `final` **no** puede sobrescribirse **[Salió 2006]**. Un método `static` no se sobrescribe, se oculta (*hiding*). Un método `private` no se hereda, así que no se sobrescribe.
- Al sobrescribir no se puede **reducir** la visibilidad (un `public` no puede pasar a `protected`). Tampoco se pueden lanzar excepciones comprobadas nuevas o más amplias.

```java
class Calculadora {
    int suma(int a, int b) { return a + b; }            // sobrecarga
    double suma(double a, double b) { return a + b; }   // sobrecarga
    int suma(int a, int b, int c) { return a + b + c; } // sobrecarga
}
class Animal {
    String sonido() { return "..."; }
}
class Perro extends Animal {
    @Override
    String sonido() { return "Guau"; }                  // sobrescritura
}
Animal a = new Perro();
System.out.println(a.sonido());   // Guau (decide el tipo real)
```

Traza típica que mezcla sobrecarga y sobrescritura:

```java
class A { void m(Object o){ System.out.print("A-Obj "); } }
class B extends A {
    void m(Object o){ System.out.print("B-Obj "); }  // sobrescribe
    void m(String s){ System.out.print("B-Str "); }  // sobrecarga
}
A x = new B();
x.m("hola");          // B-Obj  (el compilador solo ve m(Object) en A; en ejecución, la de B)
((B) x).m("hola");    // B-Str  (ahora se ve la sobrecarga más específica)
```

### 1.6 Clases abstractas e interfaces

**Clase abstracta**: clase que **no puede instanciarse** **[Salió 2005]**. Puede no estar implementada o estarlo de forma incompleta **[Salió 2019]**. Puede tener métodos abstractos (sin cuerpo) y métodos concretos, atributos y constructores. Sus subclases concretas deben implementar los métodos abstractos. Sí puede extenderse (de hecho, existe para eso).

**Interfaz**: contrato con las operaciones que una clase se compromete a ofrecer.

| | Clase abstracta | Interfaz (Java 8+) |
|---|---|---|
| Instanciable | No | No |
| Herencia | `extends`, solo una | `implements`, varias |
| Atributos | Cualquiera | Solo constantes (`public static final` implícito) |
| Métodos | Abstractos y concretos | Abstractos, `default` y `static` (Java 8), `private` (Java 9) |
| Constructores | Sí | No |
| Relación | "es un" | "se comporta como" o "puede hacer" |

En Java, `extends` se usa para heredar de una clase y `implements` para implementar interfaces **[Salió 2006, 2008, 2019]**. Una interfaz puede extender varias interfaces con `extends`.

```java
public class Ventana extends Frame implements MouseMotionListener, Serializable {
    // hereda de Frame e implementa dos interfaces
}
interface Volador extends Movil, Comparable<Volador> { }
```

### 1.7 Relaciones entre clases

| Relación | Significado | Notación UML |
|---|---|---|
| Asociación | Vínculo estructural entre instancias (enlaces) | Línea continua |
| Agregación | Todo-parte débil. La parte puede existir sin el todo | Línea con **rombo hueco** en el todo |
| Composición | Todo-parte fuerte. La parte muere con el todo | Línea con **rombo relleno** en el todo |
| Generalización | Herencia ("es un") | Línea continua con **triángulo hueco** apuntando a la superclase |
| Realización | Una clase implementa una interfaz | Línea **discontinua** con triángulo hueco |
| Dependencia | Una clase usa otra temporalmente | Línea discontinua con flecha abierta |

- "Un libro tiene capítulos" es **agregación** **[Salió 2006]**. Muchos autores lo verían como composición, pero de las opciones era la única "todo-parte".
- El rombo hueco es agregación **[Salió 2007, 2008]**, también según Métrica v3.
- La agregación es una asociación que representa una clase que es parte de otra **[Salió 2019]**.
- "Dispersión" **no** es un tipo de asociación UML **[Salió 2019]**.
- La relación "todo/parte" o "tiene un" es agregación o composición, **no** generalización (distractor 2024).
- La asociación describe enlaces entre instancias (distractor 2024 de generalización).
- La generalización se dibuja con línea **continua** y triángulo hueco junto a la superclase. Con línea discontinua sería realización (distractor 2024).

### 1.8 Otros conceptos

- **Constructor**: método especial con el nombre de la clase, sin tipo de retorno, que inicializa el objeto. Si no se escribe ninguno, Java añade uno por defecto sin parámetros.
- **Destructor**: en C++ (`~Clase()`). Java no tiene destructores. Usa el recolector de basura (*garbage collector*). `finalize()` está obsoleto desde Java 9 y marcado para eliminación (JEP 421, Java 18).
- **this**: referencia al objeto actual. **super**: referencia a la superclase. `super(...)` llama al constructor de la clase base **[Salió 2006]**.
- **Ligadura (binding)**: estática (en compilación) o dinámica (en ejecución).
- **Acoplamiento y cohesión**: el buen diseño busca **bajo acoplamiento** entre clases y **alta cohesión** dentro de cada clase.
- **Delegación**: un objeto encarga una tarea a otro en vez de heredarla. Base de la regla "favorece la composición sobre la herencia".
- **Función amiga (friend) en C++**: función no miembro que puede acceder a la parte **privada** (y protegida) de la clase donde se declara amiga **[Salió 2008]**. Rompe el encapsulamiento de forma controlada.
- **Reflexión**: capacidad de un programa de examinar y modificar su propia estructura en ejecución (`java.lang.reflect`).
- **Refactorización**: mejorar la estructura interna del código sin cambiar su comportamiento externo (Fowler).

### 1.9 Lenguajes orientados a objetos

| Tipo | Lenguajes |
|---|---|
| OO puros (todo es un objeto) | **Smalltalk** **[Salió 2015]**, Eiffel, Ruby |
| Primer lenguaje OO | **Simula 67** (Dahl y Nygaard) |
| Híbridos u OO multiparadigma | C++, Java, C#, Python, Ada 95, Object Pascal (Delphi), PHP 5+, Kotlin, Swift, Scala, Vala, JavaScript (prototipos) |
| No OO | C, Pascal estándar, GW-Basic, Fortran 77, COBOL clásico, PL/SQL (procedimental, aunque tiene tipos objeto) |

En 2015 la única OO entre Standard Pascal, GW-Basic, PL/SQL y Smalltalk era **Smalltalk** **[Salió 2015]**. En 2016 había que elegir la lista sin intrusos. La única sin Pascal, C, Basic ni Lisp era la de Ada 95, C#, C++, Eiffel, Vala, Python, Simula, Smalltalk y Visual Basic 6.0 **[Salió 2016]**. Ojo: VB6 es más bien "basado en objetos" (sin herencia), pero era la mejor opción.

Lenguaje **basado en objetos**: tiene objetos y encapsulación, pero no herencia de clases (VB6). **Orientado a objetos**: añade herencia y polimorfismo. JavaScript es OO **basado en prototipos**; la sintaxis `class` de ES6 es azúcar sintáctico sobre ellos.

### 1.10 Programación orientada a aspectos (POA)

La POA (AOP) separa las **incumbencias transversales** (*cross-cutting concerns*): log, seguridad, transacciones, caché. Sin POA, ese código aparece en muchos módulos y provoca dos problemas:

- **Código disperso** (*scattering*): el código de un mismo aspecto está **distribuido y duplicado** por gran parte de la aplicación **[Salió 2018]**.
- **Código enredado** (*tangling*): un mismo módulo implementa varios aspectos a la vez, mezclados con la lógica de negocio. Era el distractor de 2018.

| Término AOP | Significado |
|---|---|
| Aspecto | Módulo que encapsula una incumbencia transversal |
| Punto de unión (*join point*) | Punto de ejecución donde se puede insertar un aspecto (llamada a método, excepción) |
| Punto de corte (*pointcut*) | Expresión que selecciona puntos de unión |
| Consejo (*advice*) | Código que se ejecuta: before, after, around |
| Tejido (*weaving*) | Combinar aspectos con el código. En compilación, carga o ejecución |

Herramientas: **AspectJ** (Java), **Spring AOP** (proxies en ejecución), PostSharp (.NET).

## 2. Programación orientada a objetos en Java

Java es el lenguaje que aparece en todos los supuestos con código de este tema. La versión LTS más reciente a octubre de 2026 es **Java 25** (septiembre de 2025). Las anteriores LTS son 21, 17, 11 y 8.

### 2.1 Clases, objetos y la clase Object

```java
package es.gob.becas;

public class Solicitud {                 // clase pública: fichero Solicitud.java
    private static int contador = 0;     // atributo de clase (compartido)
    public static final int MAX = 10;    // constante de clase
    private final String id;             // atributo de instancia inmutable
    private String estado;

    public Solicitud(String id) {        // constructor
        this.id = id;
        this.estado = "BORRADOR";
        contador++;
    }
    public String getEstado() { return estado; }
    public static int getContador() { return contador; }
}
Solicitud s = new Solicitud("A1");       // instanciación
```

- **Todas las clases de Java heredan de `java.lang.Object`** **[Salió 2007]**, directa o indirectamente. No implementan ninguna interfaz "Interface" ni deben estar obligatoriamente en un paquete (hay paquete por defecto).
- Métodos de `Object`: `equals`, `hashCode`, `toString`, `getClass`, `clone` (protected), `finalize` (obsoleto), `wait`, `notify`, `notifyAll`.
- Si se sobrescribe `equals`, hay que sobrescribir `hashCode` para mantener su contrato.
- Un fichero `.java` puede tener varias clases, pero solo una `public`, con el mismo nombre que el fichero. Cada clase, incluidas las internas y anónimas, genera su propio `.class`.

### 2.2 Modificadores de acceso

| Modificador | Misma clase | Mismo paquete | Subclase (otro paquete) | Resto |
|---|---|---|---|---|
| `public` | Sí | Sí | Sí | Sí |
| `protected` | Sí | Sí | Sí | No |
| sin modificador (*package-private*, "friendly") | Sí | Sí | No | No |
| `private` | Sí | No | No | No |

- `protected`: accesible desde la clase, sus subclases **y** las clases del mismo paquete **[Salió 2018]**. Es el que se usa para "solo la clase y sus derivadas" **[Salió 2015]**, aunque en Java también abre el paquete.
- Para que cualquier objeto acceda directamente a un atributo, sin getters, se usa `public` **[Salió 2022]**. No es buena práctica (rompe el encapsulamiento), pero es lo que se preguntaba.
- El nivel por defecto se llama coloquialmente "friendly" o *package-private*. "Restricted" **no** es un nivel de acceso de Java **[Salió 2008]**.
- Las clases de primer nivel solo pueden ser `public` o sin modificador. `private class` solo vale para clases internas.

En C# hay además `internal` (mismo ensamblado), `protected internal` y `private protected`. En C++, `public`, `protected` y `private`, con `friend` como excepción.

### 2.3 Modificadores no de acceso: static, final, abstract

| Modificador | Sobre una clase | Sobre un método | Sobre un atributo |
|---|---|---|---|
| `final` | No se puede heredar **[Salió 2019]** | No se puede sobrescribir **[Salió 2006]** | Constante: se asigna una sola vez |
| `static` | Solo clases internas (anidada estática) | Método de clase: se invoca sin objeto | Compartido por todos los objetos **[Salió 2015]** |
| `abstract` | No se puede instanciar **[Salió 2019]** | Sin cuerpo; la subclase lo implementa | No aplica |

- Constante común a todas las instancias: `static final int PUERTO = 4444;` **[Salió 2016]**. Solo `final` daría una constante por objeto. Solo `static` sería compartido pero modificable.
- Para impedir la herencia: `final class Ejercicio` **[Salió 2019]**. No existen `closed class` ni `immutable class`.
- `abstract` y `final` son incompatibles en la misma clase o método.
- Un método `static` no puede usar `this` ni acceder a atributos de instancia directamente.
- Otros modificadores: `synchronized`, `volatile`, `transient`, `native`, `strictfp` (sin efecto desde Java 17), `sealed`, `non-sealed`.

### 2.4 Constructores privados y creación controlada

Si todos los constructores son privados, nadie de fuera puede hacer `new`. La forma de crear objetos es un **método estático público** de la propia clase que cree el objeto y lo devuelva **[Salió 2008]**. Es la base del **Singleton** y de los métodos de fábrica estáticos (`List.of`, `LocalDate.of`).

```java
public final class Configuracion {
    private static final Configuracion INSTANCIA = new Configuracion();
    private Configuracion() { }                       // nadie más puede hacer new
    public static Configuracion getInstance() { return INSTANCIA; }
}
```

Una subclase no sirve: su constructor tiene que llamar a `super()`, que es privado. Por eso una clase con constructores solo privados es, en la práctica, no heredable (salvo por sus clases anidadas).

### 2.5 Herencia en Java: extends, super, constructores

```java
public class Empleado {
    protected String nombre;
    public Empleado(String nombre) { this.nombre = nombre; }
    public double sueldo() { return 1000; }
}
public class Jefe extends Empleado {
    private double plus;
    public Jefe(String nombre, double plus) {
        super(nombre);              // llama al constructor de la clase base
        this.plus = plus;
    }
    @Override
    public double sueldo() { return super.sueldo() + plus; }
}
Empleado e = new Jefe("Ana", 500);
System.out.println(e.sueldo());     // 1500.0
```

- `class SaludosMundoFrm extends JFrame` crea una **subclase SaludosMundoFrm de JFrame** **[Salió 2006]**. El orden se confunde en los distractores.
- El constructor de la subclase llama siempre al de la superclase. Si no se escribe `super(...)`, el compilador inserta `super()` sin argumentos.
- Hasta Java 24, `super(...)` o `this(...)` debía ser la primera sentencia. Desde **Java 25** (JEP 513, *flexible constructor bodies*) se permiten sentencias previas que no usen `this`.
- Java admite herencia simple y polimorfismo **[Salió 2016]**.

### 2.6 El método main y la estructura de un programa

```java
import java.awt.*;
import java.awt.event.*;      // importa el paquete de gestión de eventos de AWT

public class Principal {
    public static void main(String[] args) {   // punto de entrada
        new Principal().arrancar();             // crea un objeto de la clase aplicación
    }
    void arrancar() { System.out.println("Hola"); }
}
```

- `main` es el punto de entrada. Es `public` (la JVM lo invoca desde fuera), `static` (no hay objeto aún), `void` (no devuelve nada) y recibe `String[] args` (argumentos de línea de comandos).
- En los programas gráficos, `main` suele **crear un objeto de la clase aplicación** y mostrarlo.
- `import java.awt.event.*;` importa el **paquete** para la gestión de eventos en un entorno gráfico **[Salió 2006]**. `import` no hereda nada ni declara variables. No importa subpaquetes: `java.awt.*` no incluye `java.awt.event`.
- Desde Java 25 (JEP 512) existen los *compact source files* con `void main()` de instancia y sin clase explícita. Sigue valiendo la forma clásica.

### 2.7 Novedades OO de Java moderno

| Característica | Versión | Uso |
|---|---|---|
| Métodos `default` y `static` en interfaces | Java 8 | Añadir métodos sin romper implementaciones |
| Métodos `private` en interfaces | Java 9 | Reutilizar código entre métodos default |
| `var` (inferencia local) | Java 10 | `var lista = new ArrayList<String>();` |
| `record` | Java 16 | Clase de datos inmutable con constructor, `equals`, `hashCode` y `toString` automáticos |
| Pattern matching para `instanceof` | Java 16 | `if (o instanceof String s)` |
| `sealed` y `permits` | Java 17 | Limitar qué clases pueden heredar |
| Pattern matching en `switch` y record patterns | Java 21 | `case Circulo c -> ...` |
| Flexible constructor bodies | Java 25 | Código antes de `super()` |

```java
public sealed interface Figura permits Circulo, Rectangulo { }
public record Circulo(double r) implements Figura { }
public record Rectangulo(double a, double b) implements Figura { }

double area(Figura f) {
    return switch (f) {
        case Circulo c -> Math.PI * c.r() * c.r();
        case Rectangulo r -> r.a() * r.b();
    };   // no necesita default: la jerarquía está sellada
}
```

Un `record` es implícitamente `final` y sus campos son `private final`. Una clase que extiende una `sealed` debe ser `final`, `sealed` o `non-sealed`.

### 2.8 Lectura de programas en el supuesto

En 2006 y 2008 el supuesto mostraba programas Java con interfaz gráfica (AWT y Swing) y preguntaba por su estructura. Pautas:

- **Contar clases**: cuenta cada `class`, incluidas las internas y las anónimas (`new MouseAdapter() { ... }` define una clase anónima). Las clases importadas (`JFrame`, `Frame`) no cuentan como "implementadas".
- **Contar objetos posibles**: si el constructor es privado y hay un `getInstance()`, solo habrá **uno** (Singleton). Si se hace `new` por cada petición, dependerá del número de peticiones.
- `extends Frame implements MouseMotionListener`: hereda de `Frame` e implementa la interfaz `MouseMotionListener` **[Salió 2008]**.
- `MouseMotionListener` recibe `mouseDragged` y `mouseMoved`. `MouseListener` recibe `mouseClicked`, `mousePressed`, `mouseReleased`, `mouseEntered` y `mouseExited`.
- Una clase "adaptador" de eventos (`MouseAdapter`, `WindowAdapter`) implementa la interfaz con métodos vacíos. Así solo se sobrescribe lo que interesa.

```java
import javax.swing.*;
import java.awt.event.*;

class SaludosMundoFrm extends JFrame {               // clase 1
    public SaludosMundoFrm() {
        super("Saludos");                              // constructor de JFrame
        addWindowListener(new WindowAdapter() {        // clase 2 (anónima)
            public void windowClosing(WindowEvent e) { System.exit(0); }
        });
        setSize(300, 200);
    }
}
public class SaludosMundo {                           // clase 3
    public static void main(String[] args) {
        new SaludosMundoFrm().setVisible(true);
    }
}
// Clases implementadas: 3 (2 con nombre y 1 anónima). Ficheros .class generados:
// SaludosMundoFrm.class, SaludosMundoFrm$1.class y SaludosMundo.class
```

## 3. Principios de diseño orientado a objetos

### 3.1 SOLID

Recopilados por Robert C. Martin (acrónimo de Michael Feathers). No han salido aún, pero son la pregunta nueva más probable del bloque de diseño.

| Letra | Principio | Idea en una línea |
|---|---|---|
| S | Responsabilidad única (SRP) | Una clase debe tener una sola razón para cambiar |
| O | Abierto/cerrado (OCP, Meyer) | Abierta a extensión, cerrada a modificación |
| L | Sustitución de Liskov (LSP) | Un subtipo debe poder sustituir a su tipo base sin romper el programa |
| I | Segregación de interfaces (ISP) | Muchas interfaces específicas mejor que una general |
| D | Inversión de dependencias (DIP) | Depender de abstracciones, no de concreciones |

La **inyección de dependencias** (DI) es una técnica para aplicar DIP: el contenedor (Spring, CDI, .NET) entrega las dependencias al objeto. Se relaciona con la **inversión de control** (IoC).

### 3.2 Otros principios

- **DRY** (*Don't Repeat Yourself*): no duplicar conocimiento.
- **KISS** (*Keep It Simple*) y **YAGNI** (*You Aren't Gonna Need It*): no añadir lo que no se necesita.
- **Ley de Demeter** (principio del mínimo conocimiento): un objeto solo habla con sus "amigos" inmediatos.
- **Composición sobre herencia** (GoF): preferir delegar en objetos a heredar.
- **Programar contra la interfaz, no contra la implementación** (GoF).
- **Diseño por contrato** (Meyer, Eiffel): precondiciones, postcondiciones e invariantes.

### 3.3 GRASP

**GRASP** (*General Responsibility Assignment Software Patterns*) son los **patrones generales de asignación de responsabilidades** en el diseño OO **[Salió 2022]**. Los propuso **Craig Larman** en *UML y patrones*. Son nueve:

| Patrón GRASP | Pregunta que responde |
|---|---|
| Experto en información | Asigna la responsabilidad a la clase que tiene la información para cumplirla |
| Creador | B crea objetos A si B contiene, agrega, registra o usa estrechamente a A |
| Controlador | Un objeto no de interfaz recibe y coordina los eventos del sistema |
| Bajo acoplamiento | Minimizar dependencias entre clases |
| Alta cohesión | Mantener cada clase centrada y manejable |
| Polimorfismo | Usar operaciones polimórficas en vez de condicionales por tipo |
| Fabricación pura | Inventar una clase que no es del dominio para lograr cohesión y bajo acoplamiento (un DAO) |
| Indirección | Introducir un intermediario para desacoplar |
| Variaciones protegidas | Proteger frente a cambios envolviendo el punto inestable en una interfaz |

En 2022 los distractores eran OOD (diseño orientado a objetos en general), Booch (método y autor) y Fan-In/Fan-Out (métricas de acoplamiento de diseño estructurado).

## 4. Patrones de diseño

### 4.1 Concepto y catálogo GoF

Un patrón de diseño es una **solución probada a un problema recurrente** de diseño en un contexto. Se describe con nombre, problema, solución y consecuencias. El concepto viene del arquitecto Christopher Alexander.

El catálogo de referencia es *Design Patterns: Elements of Reusable Object-Oriented Software* (1994). Sus autores, Gamma, Helm, Johnson y Vlissides, son la **Gang of Four (GoF)**. Contiene **23 patrones** en tres categorías según su **propósito**:

| Creacionales (5) | Estructurales (7) | De comportamiento (11) |
|---|---|---|
| Abstract Factory | Adapter | Chain of Responsibility |
| Builder | Bridge | Command |
| Factory Method | Composite | Interpreter |
| Prototype | Decorator | Iterator |
| Singleton | Facade | Mediator |
| | Flyweight | Memento |
| | Proxy | Observer |
| | | State |
| | | Strategy |
| | | Template Method |
| | | Visitor |

- **Creacionales**: cómo se crean los objetos. Abstraen la instanciación.
- **Estructurales**: cómo se componen clases y objetos para formar estructuras mayores.
- **De comportamiento**: cómo interactúan los objetos y se reparten responsabilidades.

Por su **ámbito**, los patrones son **de clase** (relaciones por herencia, fijadas en compilación) o **de objeto** (por composición, cambiables en ejecución). Solo cuatro son de clase: Factory Method, Adapter (versión de clase), Interpreter y Template Method.

Regla nemotécnica de estructurales: **"ABC DFFP"** (Adapter, Bridge, Composite, Decorator, Facade, Flyweight, Proxy). Creacionales: **"FAB PS"** (Factory Method, Abstract Factory, Builder, Prototype, Singleton).

Preguntas de clasificación: Singleton es creacional **[Salió 2018]** (Composite y Proxy son estructurales; Iterator, de comportamiento). Bridge es estructural **[Salió 2016]** (Mediator y Memento son de comportamiento; Prototype, creacional).

### 4.2 Patrones creacionales

**Singleton.** Garantiza que una clase tenga **una única instancia** y ofrece un punto de acceso global a ella **[Salió 2015]**. Se implementa con constructor privado y método estático `getInstance()`.

```java
public class Registro {
    private static volatile Registro instancia;
    private Registro() { }
    public static Registro getInstance() {
        if (instancia == null) {
            synchronized (Registro.class) {
                if (instancia == null) instancia = new Registro();  // doble comprobación
            }
        }
        return instancia;
    }
}
// Alternativa recomendada por Effective Java: enum Registro { INSTANCIA; }
```

**Factory Method.** Define una interfaz para crear un objeto, pero deja que las **subclases decidan qué clase instanciar**. Ejemplo: `Calendar.getInstance()`, o un método `crearDocumento()` sobrescrito por cada aplicación.

**Abstract Factory.** Proporciona una interfaz para crear **familias de objetos relacionados** sin especificar sus clases concretas. Ejemplo: una fábrica de widgets para Windows y otra para macOS.

**Builder.** Separa la construcción de un objeto complejo de su representación. Así el mismo proceso puede crear representaciones distintas. Ejemplo: `StringBuilder`, `HttpRequest.newBuilder()...build()`.

**Prototype.** Crea objetos nuevos **clonando** un prototipo existente. Ejemplo: `clone()`.

### 4.3 Patrones estructurales

**Adapter (Adaptador, Wrapper).** **Convierte la interfaz de una clase en otra interfaz que esperan los clientes**. Permite que colaboren clases con interfaces incompatibles **[Salió 2016]**. Es el patrón para **reutilizar una librería heredada** cuya interfaz no encaja (librería de Cl@ve PIN en 2022) **[Salió 2022]**.

```java
interface VerificadorPin { boolean verificar(String nif, String pin); }  // lo que espera el sistema

class LibreriaClavePinLegacy {                                          // clase heredada compilada
    int comprobar(String pin, String documento) { return 0; }           // 0 = correcto
}
class ClavePinAdapter implements VerificadorPin {
    private final LibreriaClavePinLegacy legacy = new LibreriaClavePinLegacy();
    public boolean verificar(String nif, String pin) {
        return legacy.comprobar(pin, nif) == 0;                         // traduce la llamada
    }
}
```

**Bridge (Puente).** **Desacopla una abstracción de su implementación** para que ambas puedan **variar independientemente** **[Salió 2015, 2017]**. Ejemplo: `Forma` (abstracción) con `Renderizador` (implementación) vectorial o ráster. JDBC es un ejemplo clásico: la API es la abstracción y cada driver la implementación.

**Composite (Compuesto).** Compone objetos en **estructuras de árbol** para representar jerarquías parte-todo. Permite tratar **igual a los objetos individuales y a los compuestos**, porque comparten interfaz **[Salió 2024]**. Ejemplo: ficheros y carpetas; componentes Swing (`Container` contiene `Component`).

```java
interface Elemento { long tamano(); }
class Fichero implements Elemento {
    long bytes; Fichero(long b) { bytes = b; }
    public long tamano() { return bytes; }
}
class Carpeta implements Elemento {
    List<Elemento> hijos = new ArrayList<>();
    public long tamano() { return hijos.stream().mapToLong(Elemento::tamano).sum(); }
}
```

**Decorator (Decorador).** **Añade responsabilidades a un objeto dinámicamente**, sin modificar su clase. Es una alternativa flexible a la herencia para extender funcionalidad **[Salió 2019]**. El decorador implementa la misma interfaz que el objeto y lo envuelve. Ejemplo: `new BufferedReader(new InputStreamReader(new FileInputStream(f)))`.

**Facade (Fachada).** Proporciona **una interfaz unificada y simplificada** para un conjunto de interfaces de un subsistema. Ejemplo: un servicio `TramitacionFacade` que oculta registro, firma y notificación.

**Flyweight (Peso ligero).** Comparte objetos de grano fino para ahorrar memoria. Separa el estado intrínseco (compartido) del extrínseco. Ejemplo: `Integer.valueOf()` cachea de -128 a 127.

**Proxy (Representante, Apoderado, Sustituto).** Proporciona **un sustituto o representante de otro objeto para controlar el acceso** a él **[Salió 2017]**. Variantes: proxy remoto (RMI), virtual (carga perezosa, *lazy loading* de JPA), de protección (control de permisos) y referencia inteligente. Spring AOP y las transacciones de Spring funcionan con proxies.

**Cómo no confundir los "envoltorios"**

| Patrón | Interfaz que expone | Para qué envuelve |
|---|---|---|
| Adapter | **Distinta** a la del envuelto | Hacer compatible |
| Decorator | **La misma** | Añadir funcionalidad |
| Proxy | **La misma** | Controlar el acceso |
| Facade | Nueva y más simple | Simplificar un subsistema entero |
| Bridge | Separa en dos jerarquías | Que evolucionen por separado (se diseña desde el principio) |

### 4.4 Patrones de comportamiento

**Observer (Observador, publicar-suscribir).** Define una dependencia **uno a muchos** entre objetos. Cuando el sujeto cambia de estado, **notifica automáticamente** a todos sus observadores **[Salió 2025]**. Base de los sistemas de eventos (listeners de Swing, `PropertyChangeListener`, eventos de Spring, RxJS). `java.util.Observable` está obsoleto desde Java 9.

```java
interface Observador { void actualizar(String evento); }
class Expediente {
    private final List<Observador> obs = new ArrayList<>();
    void suscribir(Observador o) { obs.add(o); }
    void cambiarEstado(String e) { obs.forEach(o -> o.actualizar(e)); }
}
Expediente exp = new Expediente();
exp.suscribir(e -> System.out.println("Email: " + e));
exp.suscribir(e -> System.out.println("Push: " + e));
exp.cambiarEstado("RESUELTO");
// Email: RESUELTO
// Push: RESUELTO
```

| Patrón | Intención en una línea |
|---|---|
| Chain of Responsibility | Pasa la petición por una cadena de manejadores hasta que uno la atiende (filtros de servlets) |
| Command | Encapsula una petición como objeto: permite colas, registro y deshacer |
| Interpreter | Define la gramática de un lenguaje y un intérprete para sus frases |
| Iterator | Recorre los elementos de un agregado sin exponer su representación interna (`Iterator` de Java) |
| Mediator | Un objeto centraliza la comunicación entre otros para reducir su acoplamiento |
| Memento | Captura y restaura el estado interno de un objeto sin violar el encapsulamiento (deshacer) |
| Observer | Uno a muchos: al cambiar el sujeto se notifica a los dependientes |
| State | El objeto cambia su comportamiento cuando cambia su estado interno |
| Strategy | Familia de algoritmos intercambiables encapsulados (`Comparator`) |
| Template Method | Esqueleto de un algoritmo en la superclase; las subclases redefinen pasos |
| Visitor | Añade operaciones a una estructura de objetos sin cambiar sus clases |

State y Strategy tienen la misma estructura. En State el cambio lo provoca el propio objeto al cambiar de estado. En Strategy lo elige el cliente.

### 4.5 Patrones arquitectónicos y J2EE

**MVC (Modelo-Vista-Controlador).** Separa la lógica de negocio de la interfaz de usuario. Aumenta la reutilización y la flexibilidad. Se usa en muchos frameworks: Spring MVC, ASP.NET MVC, Jakarta EE, Laravel, Django (variante MTV).

| Componente | Responsabilidad |
|---|---|
| Modelo | Datos y lógica de negocio. **Gestiona el acceso a la información** y notifica cambios |
| Vista | Presenta el modelo al usuario |
| Controlador | Recibe las acciones del usuario, invoca al modelo y elige la vista |

Afirmación falsa de 2015: "el controlador gestiona todos los accesos a la información". Eso lo hace el **modelo** **[Salió 2015]**. MVC combina internamente Observer (vista y modelo), Strategy (vista y controlador) y Composite (vistas anidadas).

Variantes: **MVP** (el presentador media y la vista es pasiva) y **MVVM** (enlace de datos entre vista y ViewModel; Angular, WPF).

**Patrones Core J2EE y de empresa** (enlazan con los temas 19 y 20):

| Patrón | Uso |
|---|---|
| DAO (*Data Access Object*) | Encapsula el acceso a la fuente de datos |
| DTO o Transfer Object | Transporta datos entre capas en un solo objeto |
| Front Controller | Un único punto de entrada para todas las peticiones (`DispatcherServlet`) |
| Service Locator | Localiza servicios (JNDI). Hoy se sustituye por inyección de dependencias |
| Business Delegate | Oculta al cliente la complejidad de los servicios de negocio |
| Session Facade | Fachada sobre los componentes de negocio |
| Intercepting Filter | Filtros previos y posteriores a la petición |
| Repository | Colección de objetos del dominio (Spring Data, DDD) |
| Inyección de dependencias | El contenedor entrega las dependencias |

### 4.6 Antipatrones

Un antipatrón es una solución habitual que produce más problemas de los que resuelve: **God Object** (clase que lo hace todo), **código espagueti**, **Lava Flow** (código muerto que nadie se atreve a quitar), **martillo de oro** (usar siempre la misma solución), **copiar y pegar**.

## 5. UML: Lenguaje Unificado de Modelado

### 5.1 Qué es UML y versiones

UML es un **lenguaje gráfico para especificar, visualizar, construir y documentar** los artefactos de un sistema software. Se basa en el **paradigma de orientación a objetos**. Es **independiente de la metodología** de análisis y diseño y **del lenguaje de programación** **[Salió 2024]**. Modela tanto la **estructura estática** como el **comportamiento dinámico** del sistema. Que "muestre únicamente el modelado estático" es falso **[Salió 2024]**.

UML es un lenguaje, **no un método ni un proceso**. El proceso asociado es el Proceso Unificado (RUP en su versión comercial de Rational).

- Autores: **Grady Booch, James Rumbaugh e Ivar Jacobson** ("los tres amigos", Rational Software). Unificaron el método Booch, OMT (Rumbaugh) y OOSE (Jacobson).
- Organismo: **OMG** (*Object Management Group*). UML 1.1 se adoptó en 1997.

| Versión | Año | Hito |
|---|---|---|
| 1.1 | 1997 | Adopción por el OMG |
| 1.4.2 | 2005 | Norma ISO/IEC 19501 |
| 2.0 | 2005 | Gran revisión: 13 diagramas, nuevos de tiempos y visión global de interacción |
| 2.2 | 2009 | Añade el diagrama de perfiles (14 diagramas) |
| 2.4.1 | 2011 | Norma ISO/IEC 19505-1 y 19505-2 (2012) |
| 2.5 | 2015 | Simplifica y reorganiza la especificación |
| **2.5.1** | **diciembre de 2017** | **Versión vigente** |

La última versión publicada es la **2.5.1**. En 2022 la opción correcta era "2.5" frente a 2.4.1, 2.4 y 3.0 **[Salió 2022]**. **No existe UML 3.0**. Sigue sin haberlo a octubre de 2026.

Lenguajes y estándares relacionados del OMG:

- **OCL** (*Object Constraint Language*): lenguaje textual para escribir restricciones, invariantes, precondiciones y postcondiciones.
- **XMI** (*XML Metadata Interchange*): formato XML para intercambiar modelos entre herramientas.
- **MOF** (*Meta Object Facility*): metamodelo en el que se define UML.
- **MDA** (*Model Driven Architecture*): desarrollo dirigido por modelos. Pasa de CIM (independiente de computación) a PIM (independiente de plataforma) y a PSM (específico de plataforma).
- **SysML**: lenguaje de ingeniería de sistemas. SysML 1.x es un perfil de UML. **SysML v2** (adoptado por el OMG en 2025) tiene metamodelo propio.
- **BPMN**: notación de procesos de negocio, también del OMG.

### 5.2 Bloques de construcción y mecanismos comunes

UML tiene tres tipos de bloques de construcción:

1. **Elementos**: estructurales (clase, interfaz, caso de uso, componente, nodo), de comportamiento (interacción, máquina de estados, actividad), de agrupación (paquete) y de anotación (nota).
2. **Relaciones**: dependencia, asociación (con agregación y composición), generalización y realización.
3. **Diagramas**.

**Mecanismos comunes** (Booch, Rumbaugh y Jacobson): especificaciones, adornos, divisiones comunes y mecanismos de extensibilidad.

**Mecanismos de extensibilidad**: **estereotipos**, **valores etiquetados** y **restricciones**. Se agrupan en **perfiles**. Los **adornos** son un mecanismo común, pero **no de extensibilidad** **[Salió 2016]**.

| Mecanismo | Qué hace | Notación |
|---|---|---|
| Estereotipo | Crea un nuevo tipo de elemento a partir de uno existente | `<<entity>>`, `<<interface>>`, `<<controller>>` |
| Valor etiquetado | Añade propiedades nuevas a un elemento | `{version = 2.1}` |
| Restricción | Añade reglas o condiciones, a menudo en OCL | `{ordered}`, `{saldo >= 0}` |
| Perfil | Conjunto de estereotipos, etiquetas y restricciones para un dominio | Diagrama de perfiles |

### 5.3 Los 14 diagramas de UML 2.5

UML 2.5 define **14 diagramas**: 7 de **estructura** y 7 de **comportamiento**. De los de comportamiento, 4 son de **interacción**.

| Estructura (estáticos) | Comportamiento (dinámicos) |
|---|---|
| Clases | Casos de uso |
| Objetos | Actividad |
| Paquetes | Máquina de estados |
| Componentes | Interacción: Secuencia |
| Estructura compuesta | Interacción: Comunicación |
| Despliegue | Interacción: Tiempos |
| Perfiles | Interacción: Visión global de la interacción |

- El diagrama de **paquetes** es de estructura **[Salió 2018]**. Los distractores eran secuencia, actividad y "flujo de información". El de flujo de información aparece en la especificación como concepto suplementario, no entre los 14.
- Grupo formado solo por diagramas de estructura: **clases, objetos, paquetes, despliegue y perfiles** **[Salió 2015]**. Las otras listas metían actividad, secuencia o casos de uso.
- Diagrama de interacción entre estructura, tiempos, componentes y actividades: **tiempos** **[Salió 2017]**.
- El **caso de uso** es de comportamiento, aunque mucha gente lo cree estático. Es el distractor favorito.
- El diagrama de comunicación se llamaba **de colaboración** en UML 1.x. El de máquina de estados se llamaba **de estados** o de transición de estados.

Regla nemotécnica de estructura: **"COP-CED-P"** (Clases, Objetos, Paquetes, Componentes, Estructura compuesta, Despliegue, Perfiles).

### 5.4 Diagrama de clases

Es el diagrama más usado. Recoge las clases, sus atributos y operaciones, y sus asociaciones **[Salió 2015]**.

Una clase se dibuja como un **rectángulo dividido en tres compartimentos**: nombre arriba, atributos en medio y operaciones abajo **[Salió 2019]**. **No es un círculo** **[Salió 2015]**. Los objetos son instancias de las clases.

```text
+---------------------------------+
|        <<entity>>               |
|        Solicitud                |
+---------------------------------+
| - id : String                   |
| - fecha : LocalDate             |
| # estado : Estado = BORRADOR    |
| + MAX : int = 10   (subrayado)  |
| / diasPendiente : int           |
+---------------------------------+
| + presentar() : void            |
| + firmar(cert : Certificado)    |
| ~ validar() : boolean           |
+---------------------------------+
```

| Símbolo | Visibilidad |
|---|---|
| `+` | Pública |
| `-` | Privada |
| `#` | Protegida |
| `~` | De paquete |

- **Subrayado**: miembro estático (de clase).
- **Cursiva** o `{abstract}`: clase u operación abstracta.
- `/` delante del atributo: **atributo derivado** (se calcula a partir de otros).
- Interfaz: estereotipo `<<interface>>` o notación de "piruleta" (círculo).

**Multiplicidad.** Se escribe en cada extremo de la asociación. Indica cuántas instancias del extremo pueden relacionarse con **una** instancia del otro extremo.

| Notación | Significado |
|---|---|
| `1` | Exactamente uno |
| `0..1` | Cero o uno (opcional) |
| `*` o `0..*` | Cero o muchos |
| `1..*` | Uno o muchos |
| `2..5` | Entre dos y cinco |

Ejemplo de 2022 **[Salió 2022]**. Requisitos: "una representación solo es válida para un trámite a la vez" y "cada trámite podrá ser solicitado por un número cualquiera de interesados". Solución:

```text
SolicitudRepresentacion  0..*  ------------  1  Tramite
```

Cada solicitud de representación va con **1** trámite. Cada trámite tiene **0..N** solicitudes. Truco: para cada extremo, pregúntate "un objeto del otro lado, ¿con cuántos de este se relaciona?".

**Otros adornos de asociación**: nombre de la asociación, roles en los extremos, navegabilidad (flecha), clase asociación (línea discontinua a una clase), asociación calificada, restricciones `{ordered}` y `{xor}`.

### 5.5 Diagramas de objetos, paquetes, componentes, estructura compuesta, despliegue y perfiles

- **Objetos**: muestra instancias concretas y sus enlaces en un momento dado. Es una "foto" del diagrama de clases. Nombre subrayado: `s1 : Solicitud`. "Vista completa o parcial de la estructura en un momento específico" es su definición (distractor de 2022).
- **Paquetes**: agrupa elementos del modelo en paquetes (carpeta con pestaña) y muestra sus dependencias (`<<import>>`, `<<access>>`, `<<merge>>`).
- **Componentes**: describe **cómo se divide el sistema en componentes y las dependencias entre ellos** **[Salió 2022]**. Usa interfaces ofrecidas (piruleta) y requeridas (semicírculo o "enchufe") y puertos.
- **Estructura compuesta**: estructura interna de una clase o componente (partes, puertos y conectores). También modela colaboraciones.
- **Despliegue**: modela el **hardware** (nodos, dispositivos, entornos de ejecución) y los **artefactos** desplegados en él (`.jar`, `.war`, esquemas). Fue el distractor "modelar el hardware" de 2022.
- **Perfiles**: define estereotipos, valores etiquetados y restricciones para adaptar UML a un dominio o plataforma (perfil EJB, perfil SysML).

### 5.6 Diagrama de casos de uso

Describe **qué** hace el sistema desde el punto de vista del usuario. Lo creó Jacobson.

- **Actor**: rol externo (persona, sistema o dispositivo). Muñeco de palo.
- **Caso de uso**: funcionalidad que da un resultado de valor al actor. Elipse.
- **Límite del sistema**: rectángulo.
- **Relaciones**:

| Relación | Significado | Dirección de la flecha discontinua |
|---|---|---|
| `<<include>>` | El caso base **siempre** incluye al otro | Del base al incluido |
| `<<extend>>` | El caso extensor añade comportamiento **opcional** en un punto de extensión | Del extensor al base |
| Generalización | Entre actores o entre casos de uso | Triángulo hacia el general |

Cada caso de uso tiene **escenarios**: el principal (camino feliz) y los alternativos. Cada escenario se detalla con un diagrama de interacción.

### 5.7 Diagramas de interacción

**Diagrama de secuencia.** Muestra la interacción entre objetos **con énfasis en la ordenación temporal de los mensajes** **[Salió 2016, 2018]**. El tiempo avanza hacia abajo.

- **Línea de vida**: rectángulo con línea discontinua vertical.
- **Barra de activación** (foco de control): rectángulo estrecho sobre la línea de vida.
- **Mensajes**: síncrono (flecha con punta rellena), asíncrono (punta abierta), respuesta (línea discontinua), creación (`<<create>>`) y destrucción (aspa al final de la línea de vida).
- **Fragmentos combinados**: `alt` (alternativa, if-else), `opt` (opcional, if), `loop` (bucle), `par` (paralelo), `break`, `critical` (región crítica), `neg` (traza inválida), `ref` (referencia a otra interacción), `seq`, `strict`, `ignore`, `consider` y `assert`.

```text
Solicitante      Frontend        Backend         BD         Registro
    |  presentar()  |               |              |             |
    |-------------->|  POST /sol    |              |             |
    |               |-------------->|  INSERT      |             |
    |               |               |------------->|             |
    |               |               |  crearAsiento()            |
    |               |               |--------------------------->|
    |               |  201 + justif |              |             |
    |<- - - - - - - |<- - - - - - - |              |             |
```

Para representar el flujo "autenticar, firmar, guardar en BD, generar asiento y generar justificante", de entre paquetes, objetos, secuencia y E/R, el adecuado era el de **secuencia** **[Salió 2024]**. Si hubiera estado como opción, el de **actividad** también encajaría: modela el flujo de acciones.

**Diagrama de comunicación** (antes de colaboración). Muestra las mismas interacciones que el de secuencia, pero con **énfasis en la organización estructural** de los objetos y sus enlaces. El orden se indica numerando los mensajes (1, 1.1, 1.2, 2). Es semánticamente equivalente al de secuencia.

**Diagrama de tiempos.** Muestra los **cambios de estado o condición** de las líneas de vida a lo largo de un **eje temporal**, con restricciones de tiempo. Útil en sistemas de tiempo real y embebidos. Es de interacción **[Salió 2017]**.

**Diagrama de visión global de la interacción** (*interaction overview*). Es un diagrama de actividad cuyos nodos son interacciones o referencias a ellas. Da una vista de alto nivel del flujo de control entre interacciones.

### 5.8 Diagrama de actividad

Modela **flujos de trabajo** y procesos: la secuencia de acciones, decisiones y paralelismo. Es la evolución del diagrama de flujo.

| Elemento | Símbolo |
|---|---|
| Nodo inicial | Círculo negro |
| Final de actividad | Círculo negro dentro de otro círculo (termina todo) |
| Final de flujo | Círculo con aspa (termina solo ese flujo) |
| Acción | Rectángulo de esquinas redondeadas |
| Decisión y fusión | Rombo, con guardas `[condición]` en las salidas |
| Bifurcación (*fork*) y unión (*join*) | Barra gruesa: inicia o sincroniza hilos paralelos |
| Particiones (calles, *swimlanes*) | Columnas por responsable |
| Nodo objeto | Rectángulo con el objeto que fluye |

Desde UML 2.0 su semántica se basa en **flujo de tokens** (como las redes de Petri), no en máquinas de estados.

### 5.9 Diagrama de máquina de estados

Muestra los **estados** por los que pasa un objeto durante su vida y las **transiciones** provocadas por eventos. Sintaxis de transición: `evento [guarda] / acción`.

- Estado: rectángulo redondeado con actividades internas `entry/`, `do/` y `exit/`.
- Pseudoestados: inicial, final, historia (H y H*), elección, unión, bifurcación.
- Estados compuestos (con subestados) y regiones ortogonales (concurrentes).
- Ejemplo: Solicitud pasa de Borrador a Presentada (evento `firmar`), luego a En trámite y a Resuelta.

Hay dos tipos: máquina de estados **de comportamiento** y **de protocolo** (secuencias legales de llamadas).

### 5.10 Qué diagrama usar para cada necesidad

| Necesidad | Diagrama |
|---|---|
| Requisitos funcionales y actores | Casos de uso |
| Clases, atributos, operaciones y relaciones | Clases |
| Instancias concretas en un momento dado | Objetos |
| Organización en módulos o espacios de nombres | Paquetes |
| Componentes software y sus dependencias e interfaces | Componentes |
| Hardware, nodos y artefactos desplegados | Despliegue |
| Estructura interna de una clase (partes y puertos) | Estructura compuesta |
| Orden temporal de mensajes entre objetos | Secuencia |
| Mensajes entre objetos según sus enlaces | Comunicación |
| Cambios de estado en un eje de tiempo | Tiempos |
| Flujo de alto nivel entre interacciones | Visión global de la interacción |
| Flujo de trabajo o algoritmo con paralelismo | Actividad |
| Ciclo de vida de un objeto según eventos | Máquina de estados |
| Extensión de UML para un dominio | Perfiles |

### 5.11 UML en Métrica v3

Métrica v3 (2001) usa notación UML 1.x en el análisis y diseño orientado a objetos (procesos ASI y DSI). Sus técnicas incluyen diagramas de casos de uso, clases, interacción, transición de estados, componentes, despliegue y paquetes.

- **Diagrama de interacción**: según Métrica v3, **describe en detalle un determinado escenario de un caso de uso** **[Salió 2022]**. Engloba el de secuencia y el de colaboración.
- **Rombo hueco**: agregación. Rombo relleno: composición **[Salió 2008]**.
- **Diagrama de clases** en Métrica v3: clases, atributos, operaciones y relaciones (asociación, herencia, agregación, composición, dependencia).
- **Diagrama de transición de estados**: comportamiento de una clase según eventos.

### 5.12 Herramientas UML y generación de código

| Herramienta | Notas |
|---|---|
| **Altova UModel** | Genera código Java, C# y Visual Basic .NET desde UML, y hace ingeniería inversa **[Salió 2017]** |
| Enterprise Architect (Sparx Systems) | Muy usada en la Administración; ida y vuelta de código |
| Visual Paradigm | UML, BPMN y SysML |
| MagicDraw o Cameo (Dassault) | UML y SysML |
| StarUML, ArgoUML, Umbrello | Ligeras o libres |
| Eclipse Papyrus | Libre, basada en Eclipse |
| PlantUML, Mermaid | Diagramas desde texto; se versionan con el código |
| IBM Rational Rose | Histórica; sustituida por Rational Software Architect |

- **Ingeniería directa**: de modelo a código. **Inversa**: de código a modelo. **Ida y vuelta** (*round-trip*): sincroniza ambos.
- En 2017 los distractores eran Jira (gestión de incidencias), Swagger Codegen (genera código desde OpenAPI) y "Hunting" (no existe).

```text
@startuml
class Solicitud {
  - id : String
  + presentar() : void
}
class Tramite
Solicitud "0..*" --> "1" Tramite
@enduml
```

## Trampas y respuestas desactualizadas

- **"Última versión de UML" (2022 b3).** La respuesta era "2.5" porque no estaba 2.5.1 entre las opciones. Si aparece 2.5.1, es la correcta (diciembre de 2017). UML 3.0 no existe. ISO/IEC 19505 corresponde a UML 2.4.1, no a 2.5.
- **Número de diagramas.** UML 2.0 tenía 13. Con el diagrama de perfiles (UML 2.2) son 14. Las preguntas de clasificación usan la de UML 2.5: 7 de estructura y 7 de comportamiento.
- **Métrica v3 usa UML 1.x.** Habla de "diagrama de colaboración" y de "diagrama de transición de estados". En UML 2.5 se llaman de comunicación y de máquina de estados. Si la pregunta dice "según Métrica v3", usa su vocabulario.
- **Secuencia frente a comunicación.** Los dos son de interacción y equivalentes. Secuencia = énfasis en el **orden temporal**. Comunicación = énfasis en la **organización estructural** (enlaces). En 2018 la pregunta decía "especial énfasis en la secuencia de mensajes": la respuesta buscada es secuencia.
- **Secuencia frente a tiempos.** El de tiempos también tiene un eje temporal, pero muestra **cambios de estado** de las líneas de vida, no el intercambio de mensajes.
- **Rombo hueco y relleno.** Hueco = agregación. Relleno (negro) = composición. Triángulo hueco = generalización. Se intercambian en los distractores (2007, 2008).
- **Generalización con línea discontinua.** Es falso. La línea discontinua con triángulo es realización (interfaz). Distractor de 2024.
- **protected en Java no es "solo subclases".** También da acceso a todo el paquete. En 2018 la opción correcta incluía el paquete. En 2015 b3 ("la clase y sus derivadas") la respuesta era protected igualmente, porque no había otra mejor.
- **Sobrecarga dinámica.** Falso: la sobrecarga se resuelve en compilación. La sobrescritura es la que se resuelve en ejecución.
- **Herencia múltiple en Java.** Java no la tiene para clases. "extends para simple e implements para múltiple" (2006) era la respuesta aceptada, pero `implements` es implementación de interfaces, no herencia de código. Desde Java 8, con métodos `default`, se hereda comportamiento de varias interfaces: herencia múltiple de comportamiento, no de estado.
- **"Todo lenguaje OO debe ofrecer herencia múltiple".** Falso (2015). Tampoco "C++ y Java permiten herencia múltiple" (2008): solo C++.
- **"Un libro tiene capítulos" (2006).** La respuesta fue agregación. Con criterio actual podría ser composición, pero no estaba entre las opciones.
- **Adapter frente a Decorator frente a Proxy.** Adapter cambia la interfaz. Decorator añade funcionalidad con la misma interfaz. Proxy controla el acceso con la misma interfaz. En 2024 se metió la definición del Decorator en una pregunta del Composite.
- **Bridge frente a Adapter.** Ambos separan. Bridge se diseña de antemano para que abstracción e implementación evolucionen por separado. Adapter se aplica después, para encajar algo existente.
- **Facade frente a Mediator.** Facade simplifica el acceso a un subsistema (estructural). Mediator coordina la comunicación entre objetos que se conocen a través de él (comportamiento).
- **Factory "a secas".** El GoF no tiene un patrón "Factory": tiene **Factory Method** y **Abstract Factory**. La "Simple Factory" no es GoF. "Delegate" y "Unity" (distractores 2015) no son patrones GoF.
- **MVC: el controlador no gestiona los datos.** Lo hace el modelo (2015).
- **Abstracción frente a encapsulamiento.** Abstraer es quedarse con lo esencial. Encapsular es agrupar y proteger. Ocultar detalles que no aportan es abstracción.
- **`java.util.Observable` y `Observer`** están obsoletos desde Java 9. El patrón sigue vigente; se usan listeners propios, `PropertyChangeListener` o `Flow` (Java 9).
- **`finalize()`** está obsoleto (Java 9) y marcado para eliminación (Java 18). No es un destructor.
- **Lenguajes OO.** PL/SQL, Pascal estándar, C y GW-Basic no son OO. Lisp clásico tampoco (CLOS es un añadido). Visual Basic 6.0 es basado en objetos.
- **Casos de uso.** Es diagrama de **comportamiento**, no de estructura.
- **include y extend.** En include la flecha va del caso base al incluido. En extend va del extensor al base. Include es obligatorio; extend, opcional.
