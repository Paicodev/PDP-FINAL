"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersistenciaSQL = void 0;
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const Tarea_1 = require("../models/Tarea");
class PersistenciaSQL {
    constructor() {
        //db será la conexión a la base de datos SQLite
        this.db = new better_sqlite3_1.default('database.sqlite');
        this.inicializarTabla();
    }
    inicializarTabla() {
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
    guardar(tareas) {
        // 
        const insert = this.db.prepare(`
            INSERT INTO tareas (id, titulo, descripcion, estado, dificultad, fechaCreacion, fechaVencimiento, ultimaEdicion)
            VALUES (@id, @titulo, @descripcion, @estado, @dificultad, @fechaCreacion, @fechaVencimiento, @ultimaEdicion)
        `);
        const deleteMany = this.db.prepare('DELETE FROM tareas');
        // 2. TRANSACCIÓN (Atomicidad)
        const transaction = this.db.transaction(() => {
            var _a;
            deleteMany.run(); // Limpiamos la tabla
            for (const t of tareas) {
                // Ejecutamos la inserción mapeando los getters
                insert.run({
                    id: t.getId(),
                    titulo: t.getTitulo(),
                    descripcion: t.getDescripcion(),
                    estado: t.getEstado(),
                    dificultad: t.getDificultad(),
                    fechaCreacion: t.getFechaCreacion().toISOString(),
                    fechaVencimiento: ((_a = t.getFechaVencimiento()) === null || _a === void 0 ? void 0 : _a.toISOString()) || null,
                    ultimaEdicion: t.getUltimaEdicion().toISOString()
                });
            }
        });
        transaction(); // Ejecutamos todo el bloque
    }
    cargar() {
        const stmt = this.db.prepare('SELECT * FROM tareas');
        const filas = stmt.all();
        // con el mapeo transformamos datos crudos (filas DB) en Instancias Reales (Objetos Tarea)
        return filas.map((fila) => Tarea_1.Tarea.importarTarea(fila));
    }
}
exports.PersistenciaSQL = PersistenciaSQL;
