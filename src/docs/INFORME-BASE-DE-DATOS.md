Se decidió mejorar la capa de persistencia implementando una estrategia de almacenamiento. En lugar de optar por un código que solo utilice archivos de texto (JSON), definimos una interfaz (IPersistencia) que actúa como contrato. Esto nos permitió utilizar SQLite (mediante la librería better-sqlite3) como estrategia principal (a sugerencia del profesor).

Elegimos SQLite debido a la necesidad de manejar los datos con mayor robustez y seguridad: a diferencia del JSON, SQLite nos permite realizar operaciones transaccionales (asegurando que los datos no se corrompan ante fallos) y prepara la aplicación para ser más eficiente y escalable en el futuro, manteniendo la portabilidad al ser serverless (no necesita un servidor).

¿Por qué SQLite es mejor que solo JSON?
Integridad y Seguridad (Transacciones):

JSON: Si el programa deja de funcionar mientras se escribe el archivo tareas.json, puede corromperse y perderíamos todo.

SQLite: Usa transacciones. O se guarda todo perfecto, o no se guarda nada. Es mucho más difícil romper los datos.

Eficiencia en Búsquedas:

JSON: Para buscar una tarea, deberíamos cargar todo el archivo en memoria, y recorrerlo luego con un .filter(). Si tuviéramos miles de tareas importadas o cargadas, sería muy lento.

SQLite: El motor de base de datos está optimizado para buscar. Si consultamos con SELECT * WHERE titulo LIKE '%ejemplo%' y dicho motor lo hará rápido sin cargar todo a la RAM.

Escalabilidad:

JSON es para configuraciones o datos pequeños.

SQLite es para aplicaciones que pueden crecer.
