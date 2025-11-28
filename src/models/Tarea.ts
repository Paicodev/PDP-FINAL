// Imports Libreria del IDentificador Único Universal 
import { v4 as uuidv4 } from 'uuid';

// Definición de Tipos para Estado y Dificultad
export type TareaEstado = 'Pendiente' | 'En Curso' | 'Terminada' | 'Cancelada'; 
export type TareaDificultad = 'Fácil' | 'Medio' | 'Difícil'; 

export class Tarea {
    // Requerimiento: ID único numérico o UUID
    private id: string; 
    private titulo: string; // Requerido, máx 100 caracteres 
    private descripcion: string; // Opcional, máx 500 caracteres 
    private estado: TareaEstado; // Por defecto: Pendiente 
    private dificultad: TareaDificultad; // Por defecto: Fácil 
    
    // Requerimiento: Fechas obligatorias (antes eran Bonus del tp1)
    private fechaCreacion: Date; // Automática 
    private fechaVencimiento?: Date; // Opcional
    private ultimaEdicion: Date; // Si no se edita, igual a Creación

    // Constructor: Asegura valores por defecto y obligatorios PE: Validá entradas
    constructor(
        titulo: string, 
        descripcion?: string,
        dificultad: TareaDificultad = 'Fácil', // Valor por defecto: Fácil 
        fechaVencimiento?: Date
    ) {
        // Asignación de atributos (POO: Oculta detalles internos )
        this.id = uuidv4(); // ¡UUID implementado! 
        Tarea.validarTitulo(titulo);
        this.titulo = titulo;
        this.descripcion = descripcion || "";
        this.estado = 'Pendiente'; // Valor por defecto: Pendiente 
        this.dificultad = dificultad;
        
        // Fechas
        this.fechaCreacion = new Date(); 
        this.fechaVencimiento = fechaVencimiento;
        this.ultimaEdicion = this.fechaCreacion; // Inicialmente igual a Creación 
    }

   // --- Métodos Mutadores (Setters) ---
    // (POO: Nomenclatura orientada a acciones)

//el metodo es static porque no depende de una instancia en particular
    public static validarTitulo(titulo: string): void{
    if(!titulo || titulo.length > 100){
        throw new Error("El titulo es obligatorio y debe tener menos de 100 caracteres.");
    }
}

 
    /**
     * Actualiza el estado de la tarea y la fecha de última edición.
     */
    public setEstado(nuevoEstado: TareaEstado): void {
        this.estado = nuevoEstado;
        this.actualizarFechaEdicion();
    }

    /**
     * Actualiza la dificultad de la tarea y la fecha de última edición.
     */
    public setDificultad(nuevaDificultad: TareaDificultad): void {
        this.dificultad = nuevaDificultad;
        this.actualizarFechaEdicion();
    }
    
    /**
     * Actualiza los datos principales de la tarea.
     */
    public update(
        titulo: string, 
        descripcion: string, 
        dificultad: TareaDificultad,
        estado: TareaEstado,
        fechaVencimiento?: Date
    ): void {
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.dificultad = dificultad;
        this.estado = estado;
        this.fechaVencimiento = fechaVencimiento;
        this.actualizarFechaEdicion();
    }

    /**
     * Método privado para centralizar la actualización de la fecha de edición.
     * (POO: Oculta detalles internos )
     */
    private actualizarFechaEdicion(): void {
        this.ultimaEdicion = new Date(); // Actualizar fecha de edición (Bonus/Req. obligatorio)
    }
    
    // --- Métodos de Acceso (Getters) ---

    /**
     * Método para obtener la representación de la dificultad (Bonus/Req. obligatorio) 
     */
    public getDificultadVisual(): string {
        // Implementación de lógica de emojis/caracteres
        switch (this.dificultad) {
            case 'Fácil': return '★☆☆';
            case 'Medio': return '★★☆';
            case 'Difícil': return '★★★';
            default: return '';
        }
    }
    
    public getId(): string {
         return this.id; 
        }
    public getTitulo(): string {
         return this.titulo; 
        }
    public getDescripcion(): string { 
        return this.descripcion; 
    }
    public getEstado(): TareaEstado { 
        return this.estado; 
    }
    public getDificultad(): TareaDificultad { 
        return this.dificultad; 
    }
    public getFechaCreacion(): Date { 
        return this.fechaCreacion; 
    }
    public getFechaVencimiento(): Date | undefined { 
        return this.fechaVencimiento; 
    }
    public getUltimaEdicion(): Date { 
        return this.ultimaEdicion; 
    }

}

