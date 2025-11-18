import { Tarea, TareaEstado, TareaDificultad } from './Tarea';


export class gestorTareas {
    
    // POO: Encapsulamos el estado. Nadie fuera de esta clase
    // puede acceder o modificar el array de tareas directamente.
    private tareas: Tarea[] = [];

    constructor() {
       //Constructor vacio.
    }

    /**
     * Añade una nueva tarea a la lista.
     * (POO: Método que modifica el estado interno)
     */
    public agregarTarea(
        titulo: string, 
        descripcion?: string,
        dificultad?: TareaDificultad,
        fechaVencimiento?: Date
    ): Tarea {
        const nuevaTarea = new Tarea(titulo, descripcion, dificultad, fechaVencimiento);
        //impuro
        this.tareas.push(nuevaTarea);
        // TODO: Aquí llamaremos a 'guardarTareas()' de PersistenciaTareas
        return nuevaTarea;
    }

    /**
     * Busca y devuelve una tarea por su ID.
     * (PF: Usamos .find() en lugar de un bucle)
     */
    public obtenerTareaPorId(id: string): Tarea | undefined {
        return this.tareas.find(tarea => tarea.getId() === id); // Asumo que Tarea.ts tiene getId()
    }

    /**
     * Devuelve una COPIA de todas las tareas (incluyendo las canceladas/soft-deleted).
     * (POO: Devolvemos una copia para proteger el array original)
     */
    public obtenerTodasLasTareas(): Tarea[] {
        return [...this.tareas];
    }
    
    /**
     * Devuelve todas las tareas que NO están "Canceladas".
     * (PF: Usamos .filter() para una consulta pura sobre la lista)
     */
    public obtenerTareasActivas(): Tarea[] {
        return this.tareas.filter(tarea => tarea.getEstado() !== 'Cancelada'); // Asumo que Tarea.ts tiene getEstado()
    }

    /**
     * Actualiza una tarea existente.
     * (POO: Método que modifica el estado de un objeto encapsulado)
     */
    public actualizarTarea(
        id: string,
        titulo: string, 
        descripcion: string,
        dificultad: TareaDificultad,
        estado: TareaEstado,
        fechaVencimiento?: Date
    ): boolean {
        const tarea = this.obtenerTareaPorId(id);
        if (tarea) {
            // Usamos el método 'update' de la propia Tarea
            tarea.update(titulo, descripcion, dificultad, estado, fechaVencimiento); // Asumo que Tarea.ts tiene update()
           
            return true;
        }
        return false; // No se encontró la tarea
    }

    /**
     * Implementa la "Eliminación Lógica" (Soft Delete).
     * Requerimiento 2 del TP Final.
     * (POO: Modifica el estado de la tarea a 'Cancelada')
     */
    public eliminarTarea(id: string): boolean {
        const tarea = this.obtenerTareaPorId(id);
        
        // Solo la "borramos" si existe y no está ya cancelada
        if (tarea && tarea.getEstado() !== 'Cancelada') { // Asumo getEstado()
            tarea.setEstado('Cancelada'); // Asumo setEstado()
            
            return true;
        }
        return false;
    }
}