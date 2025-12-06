"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.obtenerSugerenciaLogica = void 0;
const logicjs_1 = __importDefault(require("logicjs"));
const obtenerSugerenciaLogica = (tareas) => {
    const sugeridas = tareas.filter(t => {
        // HECHOS
        const estado = t.getEstado();
        const dificultad = t.getDificultad();
        // VARIABLE LÓGICA
        const x = logicjs_1.default.lvar();
        // REGLAS
        const reglaContinuidad = logicjs_1.default.eq(estado, 'En Curso');
        const reglaQuickly = logicjs_1.default.and(logicjs_1.default.eq(estado, 'Pendiente'), logicjs_1.default.eq(dificultad, 'Fácil'));
        const condicion = logicjs_1.default.or(reglaContinuidad, reglaQuickly);
        // META FINAL (Unificación)
        const metaFinal = logicjs_1.default.and(condicion, logicjs_1.default.eq(x, 'SÍ'));
        // Orden: (Regla/Meta, Variable, Cantidad de soluciones)
        // Pasamos metaFinal PRIMERO
        const resultado = logicjs_1.default.run(metaFinal, x, 1);
        // Si encontró una solución, resultado será ['VERDADERO/SI']
        return resultado.length > 0;
    });
    return sugeridas;
};
exports.obtenerSugerenciaLogica = obtenerSugerenciaLogica;
