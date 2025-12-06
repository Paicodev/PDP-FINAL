"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ordenarTareas = exports.obtenerTareasPrioridadAlta = exports.obtenerTareasVencidas = exports.obtenerCantidadPorDificultad = exports.obtenerCantidadPorEstado = exports.obtenerTotalTareas = void 0;
// modulo de estadisticas con funciones puras y HOF
// Sec. 1 : Funciones Puras Simples //
/**
 * Retorna el total de tareas.
 */
const obtenerTotalTareas = (tareas) => tareas.length;
exports.obtenerTotalTareas = obtenerTotalTareas;
/**
 * Retorna un objeto con el conteo de tareas por estado.
 * Uso de .reduce() para transformar array -> objeto.
 * record es un tipo de objeto con claves string, number, esto quiere decir que las claves son strings y los valores son numeros.
  por ejemplo: { "Pendiente": 5, "En Curso": 3, "Terminada": 7 }
 */
const obtenerCantidadPorEstado = (tareas) => {
    return tareas.reduce((contador, tarea) => {
        const estado = tarea.getEstado();
        // Si la clave existe, suma 1, si no, inicializa en 1
        contador[estado] = (contador[estado] || 0) + 1;
        return contador;
    }, {});
};
exports.obtenerCantidadPorEstado = obtenerCantidadPorEstado;
/**
 * Retorna un objeto con el conteo por dificultad.
 * Uso de .reduce() nuevamente.
 */
const obtenerCantidadPorDificultad = (tareas) => {
    return tareas.reduce((contador, tarea) => {
        const dif = tarea.getDificultad();
        contador[dif] = (contador[dif] || 0) + 1;
        return contador;
    }, {});
};
exports.obtenerCantidadPorDificultad = obtenerCantidadPorDificultad;
// Sec. 2: Funciones Puras con Filtros //
/**
 * Retorna tareas vencidas (Vencimiento < Hoy).
 * Uso de .filter().
 */
const obtenerTareasVencidas = (tareas) => {
    const hoy = new Date();
    return tareas.filter(t => {
        const fecha = t.getFechaVencimiento();
        // mostrara lo sig: fecha, ser menor a hoy y no estar terminada/cancelada
        return fecha && fecha < hoy && t.getEstado() !== 'Terminada' && t.getEstado() !== 'Cancelada';
    });
};
exports.obtenerTareasVencidas = obtenerTareasVencidas;
/**
 * Retorna tareas de "Prioridad Alta".
 * Criterio Funcional: la dificultad debe ser "Difícil" y el estado "Pendiente" o "En Curso".
 */
const obtenerTareasPrioridadAlta = (tareas) => {
    return tareas.filter(t => t.getDificultad() === 'Difícil' &&
        (t.getEstado() === 'Pendiente' || t.getEstado() === 'En Curso'));
};
exports.obtenerTareasPrioridadAlta = obtenerTareasPrioridadAlta;
// Sec. 3: Ordenamiento con funciones de Orden Superior (HOF) //
/**
 * Ordena la lista de tareas según un criterio.
 * Para respetar la INMUTABILIDAD funcional, primero creamos una copia con el spread operator: [...tareas].
 */
const ordenarTareas = (tareas, criterio) => {
    // hacemos una copia de seguridad (Inmutabilidad)
    const copiaTareas = [...tareas];
    // Ordenamos según el criterio con la copia
    // la clave a, b son dos elementos cualesquiera del array que se comparan
    return copiaTareas.sort((a, b) => {
        var _a, _b;
        switch (criterio) {
            case 'titulo':
                // Comparación alfabética
                return a.getTitulo().localeCompare(b.getTitulo());
            case 'creacion':
                // Comparación numérica de fechas
                return a.getFechaCreacion().getTime() - b.getFechaCreacion().getTime();
            case 'vencimiento':
                // Manejo de nulos: Si no tiene fecha, la mandamos al final ya que es indefinido o infinito con: (Infinity)
                const fechaA = ((_a = a.getFechaVencimiento()) === null || _a === void 0 ? void 0 : _a.getTime()) || Infinity;
                const fechaB = ((_b = b.getFechaVencimiento()) === null || _b === void 0 ? void 0 : _b.getTime()) || Infinity;
                return fechaA - fechaB;
            case 'dificultad':
                // Mapeo de string a valor numérico para poder restar, siendo los valores mas bajos los mas faciles.
                const valorMap = { 'Fácil': 1, 'Medio': 2, 'Difícil': 3 };
                /* se restan los valores numericos para ordenar
                Por ej: 'Fácil' (1) - 'Difícil' (3) = -2  -> a viene antes que b
                        'Difícil' (3) - 'Fácil' (1) = 2   -> b viene antes que a
                        'Medio' (2) - 'Medio' (2) = 0     -> son iguales
                */
                return valorMap[a.getDificultad()] - valorMap[b.getDificultad()];
            default:
                return 0;
        }
    });
};
exports.ordenarTareas = ordenarTareas;
