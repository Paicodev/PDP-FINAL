import { Tarea } from '../models/Tarea';

// Definimos el contrato: Cualquier cosa que quiera guardar tareas, debe tener estos dos métodos.
export interface IPersistencia {
    guardar(tareas: Tarea[]): void;
    cargar(): Tarea[];
}