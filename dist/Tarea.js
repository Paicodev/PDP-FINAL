"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tarea = void 0;
// Imports Libreria del IDentificador Único Universal 
const uuid_1 = require("uuid");
class Tarea {
    // Constructor: Asegura valores por defecto y obligatorios PE: Validá entradas
    constructor(titulo, descripcion, dificultad = 'Fácil', // Valor por defecto: Fácil 
    fechaVencimiento) {
        // Asignación de atributos (POO: Oculta detalles internos )
        this.id = (0, uuid_1.v4)(); // ¡UUID implementado! 
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
    static validarTitulo(titulo) {
        if (!titulo || titulo.length > 100) {
            throw new Error("El titulo es obligatorio y debe tener menos de 100 caracteres.");
        }
    }
    /**
     * Actualiza el estado de la tarea y la fecha de última edición.
     */
    setEstado(nuevoEstado) {
        this.estado = nuevoEstado;
        this.actualizarFechaEdicion();
    }
    /**
     * Actualiza la dificultad de la tarea y la fecha de última edición.
     */
    setDificultad(nuevaDificultad) {
        this.dificultad = nuevaDificultad;
        this.actualizarFechaEdicion();
    }
    /**
     * Actualiza los datos principales de la tarea.
     */
    update(titulo, descripcion, dificultad, estado, fechaVencimiento) {
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
    actualizarFechaEdicion() {
        this.ultimaEdicion = new Date(); // Actualizar fecha de edición (Bonus/Req. obligatorio)
    }
    // --- Métodos de Acceso (Getters) ---
    /**
     * Método para obtener la representación de la dificultad (Bonus/Req. obligatorio)
     */
    getDificultadVisual() {
        // Implementación de lógica de emojis/caracteres
        switch (this.dificultad) {
            case 'Fácil': return '★☆☆';
            case 'Medio': return '★★☆';
            case 'Difícil': return '★★★';
            default: return '';
        }
    }
    getId() {
        return this.id;
    }
    getTitulo() {
        return this.titulo;
    }
    getDescripcion() {
        return this.descripcion;
    }
    getEstado() {
        return this.estado;
    }
    getDificultad() {
        return this.dificultad;
    }
    getFechaCreacion() {
        return this.fechaCreacion;
    }
    getFechaVencimiento() {
        return this.fechaVencimiento;
    }
    getUltimaEdicion() {
        return this.ultimaEdicion;
    }
}
exports.Tarea = Tarea;
