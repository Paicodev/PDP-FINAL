"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersistenciaJSON = void 0;
const fs = __importStar(require("fs"));
const Tarea_1 = require("./Tarea");
/* Constante para la ruta del archivo JSON,
Para que la ruta del archivo sea inmutable y fácil de gestionar*/
const RUTA_ARCHIVO = './tareas.json';
//Se implementa la interfaz
class PersistenciaJSON {
    /**
     * Guarda el array de tareas en un archivo de texto plano (JSON).
     * (Programación Estructurada: Uso de I/O secuencial)
     */
    guardar(tareas) {
        // Manejo de errores
        try {
            // stringify convierte el array de tareas a formato JSON
            const datos = JSON.stringify(tareas, null, 2);
            // writeFileSync escribe los datos en el archivo especificado
            fs.writeFileSync(RUTA_ARCHIVO, datos, 'utf-8');
        }
        catch (error) {
            console.error("Error al escribir en disco:", error);
        }
    }
    /**
     * Carga y reconstruye las tareas desde el archivo.
     * (POO: Rehidratación de objetos)
     */
    cargar() {
        // Robustez: Si el archivo no existe no rompemos nada.
        if (!fs.existsSync(RUTA_ARCHIVO)) {
            return [];
        }
        try {
            //readFileSync lee el contenido del archivo
            const datos = fs.readFileSync(RUTA_ARCHIVO, 'utf-8');
            //parse convierte el JSON a un array de objetos
            const json = JSON.parse(datos);
            // MAPEO: Transformamos datos crudos (JSON) en Instancias Reales (Objetos Tarea)
            // hacemos uso de una funcion flecha porque es mas conciso
            return json.map((t) => {
                // 1. Instanciamos para recuperar los métodos de la clase
                const tarea = new Tarea_1.Tarea(t.titulo, t.descripcion, t.dificultad, t.fechaVencimiento ? new Date(t.fechaVencimiento) : undefined);
                // 2. Restauramos el estado interno (IDs, Fechas y Estado)
                // Usamos 'as any' para acceder a props privadas durante la carga
                tarea.id = t.id;
                tarea.estado = t.estado;
                tarea.fechaCreacion = new Date(t.fechaCreacion);
                tarea.ultimaEdicion = new Date(t.ultimaEdicion);
                return tarea;
            });
        }
        catch (error) {
            console.error("Error al leer el archivo JSON:", error);
            return [];
        }
    }
}
exports.PersistenciaJSON = PersistenciaJSON;
