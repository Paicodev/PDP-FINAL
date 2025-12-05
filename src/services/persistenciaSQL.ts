import Database from 'better-sqlite3';
import { Tarea } from '../models/Tarea';
import { IPersistencia } from '../interfaces/IPersistencia';

export class PersistenciaSQL implements IPersistencia {
    private db: any;

    constructor() {
        //db será la conexión a la base de datos SQLite
        this.db = new Database('database.sqlite');
        this.inicializarTabla();
    }

    private inicializarTabla() {
        // DEFINICIÓN DE ESTRUCTURA (DDL)
        const sql = `
            CREATE TABLE IF NOT EXISTS tareas (
                id TEXT PRIMARY KEY,
                titulo TEXT,
                descripcion TEXT,
                estado TEXT,
                dificultad TEXT,
                fechaCreacion TEXT,
                fechaVencimiento TEXT,
                ultimaEdicion TEXT
            )
        `;
        //ejecutamos el comando exec para crear la tabla si no existe
        this.db.exec(sql);
    }

    public guardar(tareas: Tarea[]): void {

        const insert = this.db.prepare(`
            INSERT INTO tareas (id, titulo, descripcion, estado, dificultad, fechaCreacion, fechaVencimiento, ultimaEdicion)
            VALUES (@id, @titulo, @descripcion, @estado, @dificultad, @fechaCreacion, @fechaVencimiento, @ultimaEdicion)
        `);

        const deleteMany = this.db.prepare('DELETE FROM tareas');

        // 2. TRANSACCIÓN (Atomicidad)
        const transaction = this.db.transaction(() => {
            deleteMany.run(); // Limpiamos la tabla


            for (const t of tareas) {

                /*
                // [MODO INSEGURO - SOLO PARA DEMOSTRACIÓN]
                //titulo: X'); DROP TABLE tareas; --
                 const sqlInseguro = `INSERT INTO tareas (id, titulo) VALUES ('${t.getId()}', '${t.getTitulo()}')`;
                this.db.exec(sqlInseguro); 
                
               */
                // [MODO SEGURO - PRINCIPAL]---------------------------------------------------
                //-------------------SIMULAR ROLLBACK------ ----------------//
                if (t.getTitulo() === "AGARRAR LA PALA") {
                    console.log("¡ESO ES IMPOSIBLE! (Rollback iniciado)");
                    throw new Error("Error inesperado durante la transacción.");
                }
                //-------------------------------------------------------//
                // Ejecutamos la inserción mapeando los getters
                insert.run({
                    id: t.getId(),
                    titulo: t.getTitulo(),
                    descripcion: t.getDescripcion(),
                    estado: t.getEstado(),
                    dificultad: t.getDificultad(),
                    fechaCreacion: t.getFechaCreacion().toISOString(),
                    fechaVencimiento: t.getFechaVencimiento()?.toISOString() || null,
                    ultimaEdicion: t.getUltimaEdicion().toISOString()
                });

                //----------------------------------------------------------------------//
            }
        });


        transaction(); // Ejecutamos todo el bloque

    }

    public cargar(): Tarea[] {
        const stmt = this.db.prepare('SELECT * FROM tareas');
        const filas = stmt.all();

        // con el mapeo transformamos datos crudos (filas DB) en Instancias Reales (Objetos Tarea)
        return filas.map((fila: any) => Tarea.importarTarea(fila));
    }
}