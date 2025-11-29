# Informe: Implementación de Persistencia SQL con better-sqlite3

**Componente:** Persistencia de Datos (Estrategia SQL)
**Tecnología:** SQLite / better-sqlite3

---

## 1. Introducción y Justificación

Como extensión a los requerimientos originales del Trabajo Final, se decidió implementar una arquitectura de persistencia flexible basada en el **Patrón de Diseño Strategy**. Esto permite intercambiar el mecanismo de almacenamiento (JSON vs. SQL) sin afectar la lógica de negocio.

Para la implementación de la estrategia SQL, se seleccionó la librería **`better-sqlite3`**. Esta decisión se fundamenta en la naturaleza de la aplicación siendo robusta y sincrónica.

### ¿Por qué SQLite?
SQLite es un motor de base de datos **serverless** (sin servidor). A diferencia de MySQL o PostgreSQL, no requiere un servicio ejecutándose en segundo plano. La base de datos completa reside en un único archivo físico (`database.sqlite`) dentro del proyecto, garantizando la **portabilidad** del entregable.

---

## 2. Módulo `PersistenciaSQL`

La clase `PersistenciaSQL` implementa la interfaz `IPersistencia`, cumpliendo con el contrato de métodos `guardar()` y `cargar()`. A continuación, se detallan los conceptos técnicos aplicados en su desarrollo.

### 2.1. Conexión y Definición de Datos (DDL)

```typescript
constructor() {
    this.db = new Database('database.sqlite');
    this.inicializarTabla();
}

-Conexión Síncrona: La instanciación de Database abre una conexión directa al archivo local. Al ser una operación sincrónica, se evita la complejidad de promesas (async/await), las cuales optamos por no utilizarlas y enfocarnos más por el lado sincrónico.

-Inicialización (inicializarTabla): Se ejecuta una sentencia DDL (CREATE TABLE IF NOT EXISTS) al inicio. Esto nos asegura que la estructura de datos exista antes de querer leer o escribir, evitando los errores en la primera ejecución.

2.2. Seguridad y Rendimiento: Sentencias Preparadas
En lugar de concatenar cadenas de texto para formar consultas SQL (lo cual es inseguro e ineficiente), se utilizaron Sentencias Preparadas (Prepared Statements).

Las "Sentencias Preparadas" (tales como: @titulo, @id) las utilizamos para no pasar los datos ciegamente y blindar dichos atributos, porque puede darse un caso como en el sig. ejemplo:

-"Estudiar", DROP TABLE tareas;  <-sin sentencias preparadas nos borran la tabla.

En este caso es vulnerable la base de datos si no "blindamos" los atributos.

En cambio, si utilizamos las sentencias preparadas la instrucción será diferente. Guardaremos una tarea con su estructura, pero los datos van blindados.

El código es: INSERT INTO tareas VALUES (@titulo).

Si el usuario escribe: "Estudiar"; DROP TABLE tareas;

La base de datos guardará literalmente la frase "Estudiar; DROP TABLE tareas;"

const insert = this.db.prepare(`
    INSERT INTO tareas (id, titulo, ...)
    VALUES (@id, @titulo, ...)
`);

A todo esto le llamamos inyección SQL, sanitizamos los datos.

Compilación Previa: El motor de base de datos "compila" la estructura de la consulta una única vez (.prepare). Luego, dentro del bucle de guardado, la consulta se ejecuta múltiples veces (.run) rellenando solo los datos. Esto mejora significativamente el rendimiento en operaciones masivas.

2.3. Integridad de Datos: Transacciones ACID
Para el método guardar(), se implementó una estrategia de "sincronización completa" (borrar todo e insertar el estado actual). Para que esto sea seguro, se envolvió la operación en una Transacción.
const transaction = this.db.transaction(() => {
    deleteMany.run(); // Limpiamos
    for (const t of tareas) {
        insert.run({ ... }); // Insertamos todo
    }
});
transaction(); // Ejecución atómica
Atomicidad: La transacción garantiza que el conjunto de operaciones se trate como una unidad indivisible. O se ejecutan todo bien o no se ejecuta nada.

Consistencia: Si ocurriera un error (por ejemplo, un corte de energía o fallo del programa) a mitad del bucle for, la base de datos realiza un rollback automático, volviendo al estado anterior y evitando la pérdida o corrupción parcial de datos.

2.4. Recuperación y Rehidratación de Objetos
El método cargar() recupera los registros de la base de datos. Dado que SQL devuelve tipos de datos planos (texto, enteros), se aplicó una técnica de Rehidratación.
return filas.map((fila: any) => Tarea.importarTarea(fila));
Mapeo de Tipos: SQLite no posee un tipo de dato nativo para fechas. Las fechas se almacenan como texto (ISO String) y se reconvierten a objetos Date de JavaScript durante la carga.

Recuperación de Comportamiento: Se utiliza el método estático (importarTarea) de la entidad Tarea para transformar los datos crudos en instancias válidas de la clase, asegurando que los objetos recuperados posean todos sus métodos y encapsulamiento original.

3. Conclusión
La implementación de este módulo nos permitió conocer conceptos de persistencia y bases de datos mas avanzados e integrarlos con los paradigmas dee programación POO y PE.