import * as fs from 'fs';
import { Tarea } from './Tarea';
import { IPersistencia } from './IPersistencia';

/* Constante para la ruta del archivo JSON,
Para que la ruta del archivo sea inmutable y fácil de gestionar*/

const RUTA_ARCHIVO = './tareas.json'; 

//Se implementa la interfaz
export class PersistenciaJSON implements IPersistencia {
    
    /**
     * Guarda el array de tareas en un archivo de texto plano (JSON).
     * (Programación Estructurada: Uso de I/O secuencial)
     */
    public guardar(tareas: Tarea[]): void {
        // Manejo de errores
        try {
            // stringify convierte el array de tareas a formato JSON
            const datos = JSON.stringify(tareas, null, 2);
            // writeFileSync escribe los datos en el archivo especificado
            fs.writeFileSync(RUTA_ARCHIVO, datos, 'utf-8');
        } catch (error) {
            console.error("Error al escribir en disco:", error);
        }
    }

    /**
     * Carga y reconstruye las tareas desde el archivo.
     * (POO: Rehidratación de objetos)
     */
    public cargar(): Tarea[] {
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
            return json.map((t: any) => {
                 // 1. Instanciamos para recuperar los métodos de la clase
                 const tarea = new Tarea(
                    t.titulo, 
                    t.descripcion, 
                    t.dificultad, 
                    t.fechaVencimiento ? new Date(t.fechaVencimiento) : undefined
                 );
                 
                 // 2. Restauramos el estado interno (IDs, Fechas y Estado)
                 // Usamos 'as any' para acceder a props privadas durante la carga
                 (tarea as any).id = t.id;
                 (tarea as any).estado = t.estado;
                 (tarea as any).fechaCreacion = new Date(t.fechaCreacion);
                 (tarea as any).ultimaEdicion = new Date(t.ultimaEdicion);
                 
                 return tarea;
            });
        } catch (error) {
            console.error("Error al leer el archivo JSON:", error);
            return [];
        }
    }
}