import { GestorTareas } from "./controllers/GestorTareas";
import { Tarea } from "./models/Tarea";
import { input } from "./utils/Entradas";
import * as Estadisticas from './utils/Estadisticas';
import * as Reglas from './utils/Reglas';

// Lógica de Presentación (UI)

export function mostrarEncabezado(){
    console.clear();
    console.log("========================================");
    console.log("   GESTOR DE TAREAS - PARADIGMAS        ");
    console.log("========================================");
}

export function mostrarLista(tareas: Tarea[]) {
    if (tareas.length === 0) {
        console.log("\n(No hay tareas registradas)");
        return;
    }
    console.log("\n--- LISTADO DE TAREAS ---");
    tareas.forEach((t, i) => {
        // Usamos los getters de la clase Tarea
        console.log(`${i + 1}. [${t.getEstado()}] ${t.getTitulo()} ${t.getDificultadVisual()}`);
        console.log(`   ID: ${t.getId()}`); // Mostramos ID para operaciones

        // Usamos toLocaleDateString() para que se lea "dd/mm/aaaa"
        const creacion = t.getFechaCreacion().toLocaleDateString();
        // Usamos un operador ternario: Si tiene fecha ? se muestra : imprime "Sin vencimiento"
        const vencimiento = t.getFechaVencimiento() 
                            ? t.getFechaVencimiento()?.toLocaleDateString() 
                            : "Sin vencimiento";
        console.log(`   Creada: ${creacion} | Vence: ${vencimiento}`);

        if (t.getDescripcion()) console.log(`   Desc: ${t.getDescripcion()}`);
    });
}

export function pausa() {
    input("Presiona ENTER para continuar...");
}

export function eliminarTarea(gestor: GestorTareas) {
    console.clear();
    console.log("--- ELIMINAR TAREA ---");

    // Obtenemos las tareas activas
    const activas = gestor.obtenerTareasActivas();
    if (activas.length === 0) {
        console.log("No hay tareas disponibles para eliminar.");
        return; 
    }
    // Mostramos las opciones para eliminar
    mostrarLista(activas);
    console.log("0. Cancelar");

    // guardamos la selección
    const borrar = input("Ingrese el NÚMERO de la tarea a eliminar: ");
    
    // cancelación
    if (borrar === '0') {
        console.log("Operación cancelada.");
        return; 
    }

    // validamos la entrada al valor correspondiente
    const indice = parseInt(borrar) - 1;

    
    if (indice >= 0 && indice < activas.length) {
        // eliminamos la tarea seleccionada
        const tarea = activas[indice];
        gestor.eliminarTarea(tarea.getId());
        console.log(`Tarea "${tarea.getTitulo()}" eliminada correctamente.`);
    } else {
        console.log("Opción inválida: El número ingresado no existe.");
    }
}

export function editarTarea(gestor: GestorTareas){
    console.log("--- EDITAR TAREA ---")
    // Mostrar opciones
    const activas = gestor.obtenerTareasActivas();
    if( activas.length === 0){
        console.log("No hay tareas para editar.");
        return;
    }

    mostrarLista(activas);
    console.log("0. Cancelar");
    
    // Seleccion de ID
    const idSeleccion = input("Ingrese el Número de la tarea a editar: ");
    if (idSeleccion === '0' || idSeleccion.trim() === '' || isNaN(Number(idSeleccion))) {
        return;
    }

    const indice = parseInt(idSeleccion) -1;

    if ( indice < 0 || indice >= activas.length){
        console.log("Opción inválida, el número ingresado no existe.");
        return;
    }
    const tarea = activas[indice];
    console.log("Editando: "+ tarea.getTitulo());

    // el operador || nos permite mantener el valor actual si no se ingresa nada nuevo. Porque input devuelve string siempre.
    console.log("Ingresa el nuevo título o presiona ENTER para mantenerlo.");
    console.log("Título actual: "+ tarea.getTitulo());
    const nuevoTitulo = input('') || tarea.getTitulo();

    console.log("Descripcion actual: "+ tarea.getDescripcion());
    const nuevaDesc = input('') || tarea.getDescripcion();

    console.log("Dificultad actual: "+ tarea.getDificultad());
    console.log("1- Facil | 2- Medio | 3. Dificil (Enter para mantener)");
    const difInput = input("Elige: ");

    let nuevaDificultad = tarea.getDificultad();
    if (difInput === '1') {nuevaDificultad = 'Fácil';}
    if (difInput === '2') {nuevaDificultad = 'Medio';}
    if (difInput === '3') {nuevaDificultad = 'Difícil';}

    console.log("Estado actual: "+ tarea.getEstado());
    console.log("1- Pendiente | 2- En Curso | 3- Terminada (Enter para mantener)");
    const difEst = input("Elige: ");

    let nuevoEstado = tarea.getEstado();
    if (difEst === '1') {nuevoEstado = 'Pendiente';}
    if (difEst === '2') {nuevoEstado = 'En Curso';}
    if (difEst === '3') {nuevoEstado = 'Terminada';}

    gestor.actualizarTarea(tarea.getId(), nuevoTitulo, nuevaDesc, nuevaDificultad, nuevoEstado, tarea.getFechaVencimiento());

    console.log("\nTarea actualizada correctamente.");
}

export function verPanel(gestor: GestorTareas) {
    console.clear();
    console.log("\n========================================");
    console.log("--- ESTADÍSTICAS DEL SISTEMA ---");

    const tareas = gestor.obtenerTodasLasTareas();
    const total = Estadisticas.obtenerTotalTareas(tareas);
    console.log(`\n Total de Tareas: ${total}`);

    console.log("\n[Por Estado]");
    const porEstado = Estadisticas.obtenerCantidadPorEstado(tareas);
    if (Object.keys(porEstado).length === 0) console.log(" - Sin datos");
    Object.keys(porEstado).forEach(estado => {
        console.log(` - ${estado}: ${porEstado[estado]}`);
    });

    console.log("\n[Por Dificultad]");
    const porDificultad = Estadisticas.obtenerCantidadPorDificultad(tareas);
    if (Object.keys(porDificultad).length === 0) console.log(" - Sin datos");
    Object.keys(porDificultad).forEach(dif => {
        console.log(` - ${dif}: ${porDificultad[dif]}`);
    });

    const vencidas = Estadisticas.obtenerTareasVencidas(tareas);
    const prioridadAlta = Estadisticas.obtenerTareasPrioridadAlta(tareas);

    console.log("\n[Alertas]");
    console.log(` Vencidas: ${vencidas.length}`);
    vencidas.forEach(t => console.log(`    -> ${t.getTitulo()} (Vencía: ${t.getFechaVencimiento()?.toLocaleDateString()})`));
    
    console.log(` Prioridad Alta: ${prioridadAlta.length}`);
    prioridadAlta.forEach(t => console.log(`    -> ${t.getTitulo()}`));

    console.log("\n========================================");
}

// ==========================================
// Ver Tareas con Ordenamiento
// ==========================================
export function verTareasConOrden(gestor: GestorTareas) {
    console.clear();
    console.log("--- VER TAREAS ---");

    //Obtenemos la copia cruda
    const tareas = gestor.obtenerTodasLasTareas();

    if (tareas.length === 0) {
        console.log("(No hay tareas registradas)");
        return;
    }

    //Preguntamos criterio
    console.log("Seleccione criterio de ordenamiento:");
    console.log("1. Por Defecto (Orden de creación)");
    console.log("2. Por Título (A-Z)");
    console.log("3. Por Fecha de Vencimiento");
    console.log("4. Por Dificultad");
    console.log("5. Por Fecha de Creación");

    const criterio = input("\nOpción (1-5): ");

    let tareasOrdenadas = tareas; //Por defecto, la lista original

    //Aplicamos la función pura de Estadísticas según la opción
    switch (criterio) {
        case '2':
            tareasOrdenadas = Estadisticas.ordenarTareas(tareas, 'titulo');
            console.log(">> Ordenado por Título:");
            break;
        case '3':
            tareasOrdenadas = Estadisticas.ordenarTareas(tareas, 'vencimiento');
            console.log(">> Ordenado por Vencimiento:");
            break;
        case '4':
            tareasOrdenadas = Estadisticas.ordenarTareas(tareas, 'dificultad');
            console.log(">> Ordenado por Dificultad:");
            break;
        case '5':
            tareasOrdenadas = Estadisticas.ordenarTareas(tareas, 'creacion');
            console.log(">> Ordenado por Creación:");
            break;
        default:
            console.log(">> Orden por defecto:");
            break;
    }

    mostrarLista(tareasOrdenadas);
}

export function obtenerSugerencias(gestor: GestorTareas){
            console.log("========================================");
            console.log("   MOTOR DE INFERENCIA LÓGICA   ");
            console.log("========================================");
            console.log("Analizando hechos y reglas...");

            // 1. Obtenemos todas las tareas (Hechos)
            const listaHechos = gestor.obtenerTodasLasTareas();

            // 2. Ejecutamos el motor de inferencia
            const sugerencias = Reglas.obtenerSugerenciaLogica(listaHechos);

            if (sugerencias.length > 0) {
                console.log(`\n El sistema sugiere realizar estas ${sugerencias.length} tareas ahora:\n`);
                console.log("   (Criterio: Están 'En Curso' O son 'Fáciles y Pendientes')\n");

                mostrarLista(sugerencias);
            } else {
                console.log("\n El motor lógico no encontró sugerencias inmediatas.");
                console.log("   (Quizás todo es muy difícil o ya terminaste todo).");
            }
}