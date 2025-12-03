---
markmap:
  colorScheme: dark
  initialExpandLevel: 2
---

# 🗺️ Mapa Mental del Gestor de Tareas

## `main.ts` (Punto de Entrada)
- **Función `main()`**
  - **Bucle Principal de la Aplicación**
    - Llama a `configurarBaseDeDatos()` al inicio.
    - Muestra el menú principal en un bucle `while`.
    - **Opciones del Menú (`switch`)**
      - `1. Ver todas`: `gestor.obtenerTodasLasTareas()`
      - `2. Buscar`: `gestor.buscarTareasPorTitulo()`
      - `3. Agregar`: Llama a `agregarNuevaTarea(gestor)`
      - `4. Editar`: Llama a `editarTarea(gestor)`
      - `5. Eliminar`: Llama a `eliminarTarea(gestor)`
      - `6. Estadísticas`: Llama a `verPanel(gestor)`
      - `0. Salir`: Termina el bucle.
- **Función `configurarBaseDeDatos()`**
  - **Selección de Estrategia (Patrón Strategy)**
    - Permite al usuario elegir entre:
      - `1. JSON` -> `new PersistenciaJSON()`
      - `2. SQL` -> `new PersistenciaSQL()`
  - **Inyección de Dependencias**
    - Crea y devuelve `new GestorTareas(estrategia)`.

## `controllers/GestorTareas.ts`
- **Clase `GestorTareas`**
  - **Orquestador / Lógica de Negocio**
  - **Recibe `IPersistencia` en el constructor (Inyección de Dependencias)**
  - **Atributos**
    - `private tareas: Tarea[]`
    - `private persistencia: IPersistencia`
  - **Métodos**
    - `constructor(persistencia: IPersistencia)`
    - `agregarTarea()`
    - `obtenerTareaPorId()`
    - `obtenerTodasLasTareas()`
    - `obtenerTareasActivas()`
    - `buscarTareasPorTitulo()`
    - `actualizarTarea()`
    - `eliminarTarea()`

## `interfaces/IPersistencia.ts`
- **Interfaz `IPersistencia`**
  - **Contrato para la Capa de Datos**
  - **Métodos**
    - `guardar(tareas: Tarea[]): void`
    - `cargar(): Tarea[]`

## `services/` (Estrategias de Persistencia)
- **`PersistenciaJSON.ts`**
  - **Implementa `IPersistencia`**
  - **Atributos**
    - `private readonly RUTA_ARCHIVO: string`
  - **Métodos**
    - `guardar(tareas: Tarea[]): void`
    - `cargar(): Tarea[]`
- **`PersistenciaSQL.ts`**
  - **Implementa `IPersistencia`**
  - **Atributos**
    - `private db: Database.Database`
  - **Métodos**
    - `constructor()`
    - `private inicializarTabla(): void`
    - `guardar(tareas: Tarea[]): void`
    - `cargar(): Tarea[]`

## `models/Tarea.ts`
- **Clase `Tarea`**
  - **Modelo de Datos**
  - **Atributos**
    - `id`
    - `titulo`
    - `descripcion`
    - `estado`
    - `dificultad`
    - `fechaVencimiento`
    - `fechaCreacion`
    - `ultimaEdicion`
  - **Métodos**
    - `constructor(titulo, descripcion, dificultad, fechaVencimiento)`
    - `static validarTitulo(titulo): void`
    - `static importarTarea(data): Tarea`
    - `setEstado(nuevoEstado)`
    - `setDificultad(nuevaDificultad)`
    - `update(titulo, descripcion, ...)`
    - `getId(): string`
    - `getTitulo(): string`
    - `... (otros getters)`
    - `getDificultadVisual(): string`


## `utils/` (Directorio de Utilidades)
  - **`Entradas.ts`**
    - **Función `input()`**: Abstrae la lógica para capturar la entrada del usuario desde la consola usando `prompt-sync`.
  - **`Estadisticas.ts`**
    - **Módulo de Funciones Puras**: Realiza cálculos sobre las tareas sin modificarlas (Inmutabilidad).
    - **Funciones**: `obtenerTotalTareas`, `obtenerCantidadPorEstado`, `obtenerCantidadPorDificultad`, `obtenerTareasVencidas`, `ordenarTareas`, etc.
  - **`Reglas.ts`**
    - **Motor de Inferencia (Programación Lógica)**: Utiliza `logicjs` para aplicar reglas y deducir sugerencias de tareas.


## `vista.ts` (Capa de Presentación)
  - **Funciones de Interfaz de Usuario (UI)**
    - `mostrarEncabezado()`: Muestra el título de la app.
    - `mostrarLista(tareas)`: Itera y muestra las tareas.
    - `pausa()`: Espera que el usuario presione ENTER.
    - `eliminarTarea(gestor)`: Lógica de UI para eliminar una tarea.
    - `editarTarea(gestor)`: Lógica de UI para editar una tarea.
    - `agregarNuevaTarea(gestor)`: Lógica de UI para agregar una tarea.
    - `verPanel(gestor)`: Muestra el panel de estadísticas.
    - `verTareasConOrden(gestor)`: Muestra tareas con opciones de ordenamiento.
    - `solicitarEstrategiaPersistencia()`: Pide al usuario la estrategia de persistencia.
    - `obtenerSugerencias(gestor)`: Muestra sugerencias del motor de inferencia.

# 🏛️ Explicación Detallada de la Arquitectura

## 1. `main.ts` - El Corazón de la Aplicación
- Punto de entrada del programa.
- Gestiona la interacción con el usuario, muestra el menú y coordina acciones.
- **Función `main()`**
  - Llama a `configurarBaseDeDatos()` al inicio.
  - **Bucle `while (true)`**: Mantiene la app corriendo.
  - **Menú de Opciones (`switch`)**: Delega la lógica de UI a funciones de la capa de presentación (`vista.ts`).
- **Función `configurarBaseDeDatos()`**
  - **Patrón Strategy**: Usuario elige método de almacenamiento (JSON/SQL).
  - Crea la instancia de persistencia (`PersistenciaJSON` o `PersistenciaSQL`).
  - **Inyección de Dependencias**: Crea `GestorTareas` inyectándole la estrategia.

## 2. `controllers/GestorTareas.ts` - El Orquestador
- Cerebro de la lógica de negocio.
- Intermediario entre UI (`main.ts`) y capa de datos (`IPersistencia`).
- No contiene lógica de presentación (consola), solo gestiona los datos.
- **Constructor**
  - Recibe un objeto `IPersistencia`.
  - Carga las tareas iniciales usando `persistencia.cargar()`.
- **Atributos**
  - `private tareas: Tarea[]`: Listado de tareas en memoria.
  - `private persistencia: IPersistencia`: Estrategia de almacenamiento (JSON/SQL).
- **Métodos de Modificación**
  - `agregarTarea`, `eliminarTarea`, `actualizarTarea`:
    - Modifican el array `this.tareas`.
    - Llaman a `persistencia.guardar()` para persistir los cambios.
- **Métodos de Consulta**
  - `obtenerTodasLasTareas`, `obtenerTareasActivas`, `buscarTareasPorTitulo`:
    - Leen y devuelven datos del array `this.tareas` sin modificarlo.

## 3. `interfaces/IPersistencia.ts` - El Contrato
- Fundamental para el **Patrón Strategy**.
- Define un contrato que las clases de persistencia deben cumplir.
- **Métodos definidos**
  - `guardar(tareas: Tarea[]): void`: Escribe los datos en el almacenamiento.
  - `cargar(): Tarea[]`: Lee los datos desde el almacenamiento.

## 4. `services/` - Las Estrategias Concretas
- **`PersistenciaJSON.ts`**
  - **Propósito**: Guardar y cargar tareas en `tareas.json`.
  - **`guardar()`**: Usa `JSON.stringify` y `fs.writeFileSync`.
  - **`cargar()`**: Usa `fs.readFileSync` y `JSON.parse`. "Rehidrata" objetos genéricos a instancias de `Tarea` con `Tarea.importarTarea`.
- **`PersistenciaSQL.ts`**
  - **Propósito**: Guardar y cargar tareas en una base de datos SQLite.
  - **`constructor()`**: Se conecta a la BD y llama a `inicializarTabla()`.
  - **`inicializarTabla()`**: Asegura que la tabla `tareas` exista (`CREATE TABLE IF NOT EXISTS`).
  - **`guardar()`**: Usa una **transacción** para borrar e insertar, garantizando consistencia. Utiliza **sentencias preparadas** para seguridad y rendimiento.
  - **`cargar()`**: Ejecuta `SELECT * FROM tareas` y "rehidrata" cada fila a un objeto `Tarea`.

## 5. `models/Tarea.ts` - El Molde de los Datos
- Define la estructura y comportamiento de una `Tarea`.
- **Atributos**: `id`, `titulo`, `descripcion`, `fechaVencimiento`, etc. Son privados para encapsular los datos.
- **Constructor**: Crea una nueva tarea, asignando `id` único y fechas.
- **Getters y Setters**: Permiten acceso controlado a los atributos. Los setters (`setEstado`, `setDificultad`) actualizan la fecha de `ultimaEdicion`.
- **`update()`**: Método principal para modificar una tarea. Centraliza la lógica de edición y actualiza la `ultimaEdicion`.
- **`static importarTarea(data)`**: Método de "fábrica" para la **rehidratación**. Convierte un objeto simple (de JSON o SQL) en una instancia real de la clase `Tarea`.
- **`static validarTitulo(titulo)`**: Método de validación que arroja un error si el título no es válido.

## 6. `vista.ts` - La Capa de Presentación (UI de Consola)
- **Propósito**: Encargado de toda la lógica relacionada con la interfaz de usuario (UI) en la consola.
- Abstrae la manera en que la información se muestra y cómo se capturan las entradas del usuario para acciones específicas.
- **Funciones Principales**:
  - `mostrarEncabezado`, `mostrarLista`, `pausa`: Funciones básicas para renderizar la UI.
  - `agregarNuevaTarea`, `editarTarea`, `eliminarTarea`: Orquestan la interacción con el usuario para recolectar los datos necesarios y luego llaman a los métodos correspondientes en el `gestor`.
  - `verPanel`, `verTareasConOrden`: Muestran vistas más complejas de los datos, como estadísticas o listas ordenadas.
  - `solicitarEstrategiaPersistencia`: Aísla la lógica para la configuración inicial.

## 7. `utils/` - El Directorio de Utilidades
- **Propósito**: Agrupa módulos con funciones de ayuda reutilizables que no encajan en otras capas.

### `Entradas.ts` - La Utilidad de Entrada
  - Abstrae la lógica para obtener texto del usuario en la consola.
  - **Función `input()`**: Usa `prompt-sync` para pausar y esperar la entrada del usuario, facilitando el mantenimiento del código.

### `Estadisticas.ts` - El Módulo Funcional
  - **Propósito**: Contiene un conjunto de **funciones puras** que operan sobre la lista de tareas para generar datos y estadísticas.
  - **Inmutabilidad**: Ninguna de estas funciones modifica el array original de tareas. Crean copias o devuelven nuevos arrays filtrados u ordenados.
  - **Funciones de Agregación**: `obtenerTotalTareas`, `obtenerCantidadPorEstado`, `obtenerCantidadPorDificultad`. Usan `reduce` para transformar la lista en un valor agregado.
  - **Funciones de Filtrado**: `obtenerTareasVencidas`, `obtenerTareasPrioridadAlta`. Usan `filter` para devolver subconjuntos de tareas.
  - **Funciones de Ordenamiento (HOF)**: `ordenarTareas` es una función de orden superior que recibe un criterio y devuelve una **copia ordenada** de la lista de tareas.

### `Reglas.ts` - El Motor de Inferencia
  - **Propósito**: Implementa un paradigma de **programación lógica** para deducir qué tareas sugerir al usuario.
  - **Función `obtenerSugerenciaLogica()`**:
    - **Hechos**: Define las características de cada tarea (estado, dificultad) como hechos.
    - **Reglas**: Establece las condiciones para que una tarea sea "sugerible" (por ejemplo, `estado = 'Pendiente' Y dificultad = 'Fácil'`).
    - **Motor `logicjs`**: Utiliza la librería para unificar los hechos con las reglas y encontrar las tareas que satisfacen la consulta.
