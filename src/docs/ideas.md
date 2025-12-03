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
      - `3. Agregar`: Pide datos y llama a `gestor.agregarTarea()`
      - `4. Editar`: (Pendiente)
      - `5. Eliminar`: Llama a la función `EliminarTarea()`
      - `6. Estadísticas`: (Pendiente)
      - `0. Salir`: Termina el bucle.
- **Función `configurarBaseDeDatos()`**
  - **Selección de Estrategia (Patrón Strategy)**
    - Permite al usuario elegir entre:
      - `1. JSON` -> `new PersistenciaJSON()`
      - `2. SQL` -> `new PersistenciaSQL()`
  - **Inyección de Dependencias**
    - Crea y devuelve `new GestorTareas(estrategia)`.
- **Funciones de Interfaz de Usuario (UI)**
  - `mostrarEncabezado()`: Muestra el título de la app.
  - `mostrarLista(tareas)`: Itera y muestra las tareas.
  - `pausa()`: Espera que el usuario presione ENTER.
- **Función `EliminarTarea(gestor)`**
  - Obtiene y muestra las tareas con `gestor.obtenerTareasActivas()`.
  - Pide al usuario que elija una tarea por su número.
  - Llama a `gestor.eliminarTarea(id)`.

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
    - `eliminarTarea()`
    - `editarTarea()`
    - `cambiarEstado()`
    - `obtenerTodasLasTareas()`
    - `obtenerTareasActivas()`
    - `buscarTareasPorTitulo()`
    - `obtenerEstadisticas()`

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
    - `fechaCreacion`
    - `ultimaEdicion`
  - **Métodos**
    - `constructor(titulo, descripcion, dificultad)`
    - `static importarTarea(data): Tarea`
    - `get id(): string`
    - `get titulo(): string`
    - `get descripcion(): string`
    - `get estado(): string`
    - `get dificultad(): string`
    - `getDificultadVisual(): string`
    - `get fechaCreacion(): Date`
    - `get ultimaEdicion(): Date`
    - `editar(titulo, descripcion, dificultad, estado): void`

## `utils/Entradas.ts`
- **Función `input()`**
  - Abstrae la lógica para capturar la entrada del usuario desde la consola.

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
  - **Menú de Opciones (`switch`)**: Ejecuta acciones según la elección del usuario.
    - Casos 1-6: Invocan métodos del `gestor` o funciones auxiliares.
    - Caso 0: Termina la aplicación.
- **Función `configurarBaseDeDatos()`**
  - **Patrón Strategy**: Usuario elige método de almacenamiento (JSON/SQL).
  - Crea la instancia de persistencia (`PersistenciaJSON` o `PersistenciaSQL`).
  - **Inyección de Dependencias**: Crea `GestorTareas` inyectándole la estrategia.
- **Funciones de UI y Auxiliares**
  - `mostrarEncabezado`, `mostrarLista`, `pausa`: Mejoran la UI de la consola.
  - `EliminarTarea(gestor)`: Abstrae la lógica para borrar una tarea.

## 2. `controllers/GestorTareas.ts` - El Orquestador
- Cerebro de la lógica de negocio.
- Intermediario entre UI (`main.ts`) y capa de datos (`IPersistencia`).
- **Constructor**
  - Recibe un objeto `IPersistencia`.
  - Carga las tareas iniciales usando `persistencia.cargar()`.
- **Atributos**
  - `private tareas: Tarea[]`: Listado de tareas en memoria.
  - `private persistencia: IPersistencia`: Estrategia de almacenamiento (JSON/SQL).
- **Métodos de Modificación**
  - `agregarTarea`, `eliminarTarea`, `editarTarea`:
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
- **Atributos**: `id`, `titulo`, `descripcion`, etc. Son privados para encapsular los datos.
- **Constructor**: Crea una nueva tarea, asignando `id` único y fechas.
- **Getters**: Permiten acceso controlado de solo lectura a los atributos.
- **`editar()`**: Único método para modificar una tarea. Actualiza la `ultimaEdicion`.
- **`static importarTarea(data)`**: Método de "fábrica" para la **rehidratación**. Convierte un objeto simple (de JSON o SQL) en una instancia real de la clase `Tarea`.

## 6. `vista.ts` - La Capa de Presentación
- **Propósito**: Encargado de toda la lógica relacionada con la interfaz de usuario (UI) en la consola.
- Abstrae la manera en que la información se muestra y cómo se capturan las entradas del usuario para acciones específicas.
- **Funciones Principales**:
  - `mostrarEncabezado`, `mostrarLista`, `pausa`: Funciones básicas para renderizar la UI.
  - `agregarNuevaTarea`, `editarTarea`, `eliminarTarea`: Orquestan la interacción con el usuario para recolectar los datos necesarios y luego llaman a los métodos correspondientes en el `gestor`.
  - `verPanel`, `verTareasConOrden`: Muestran vistas más complejas de los datos, como estadísticas o listas ordenadas.
  - `solicitarEstrategiaPersistencia`: Aísla la lógica para la configuración inicial.

## 7. `utils/Entradas.ts` - La Utilidad de Entrada
- Abstrae la lógica para obtener texto del usuario en la consola.
- **Función `input()`**
  - Usa `readline-sync` para pausar y esperar la entrada del usuario.
  - Facilita el mantenimiento del código.
