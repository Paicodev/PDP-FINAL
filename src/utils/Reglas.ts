import { Tarea } from '../models/Tarea';
import logic from 'logicjs';

export const obtenerSugerenciaLogica = (tareas: Tarea[]): Tarea[] => {
    
    const sugeridas = tareas.filter(t => {
        // HECHOS
        const estado = t.getEstado();
        const dificultad = t.getDificultad();

        // VARIABLE LÓGICA
        const x = logic.lvar(); 

        // REGLAS
        const reglaContinuidad = logic.eq(estado, 'En Curso');

        const reglaQuickly = logic.and(
            logic.eq(estado, 'Pendiente'),
            logic.eq(dificultad, 'Fácil')
        );

        const condicion = logic.or(
            reglaContinuidad,
            reglaQuickly
        );

        // META FINAL (Unificación)
        const metaFinal = logic.and(
            condicion,
            logic.eq(x, 'SÍ')
        );

        // Orden: (Regla/Meta, Variable, Cantidad de soluciones)
        // Pasamos metaFinal PRIMERO
        const resultado = logic.run(metaFinal, x, 1);

        // Si encontró una solución, resultado será ['VERDADERO/SI']
        return resultado.length > 0;
    });

    return sugeridas;
};