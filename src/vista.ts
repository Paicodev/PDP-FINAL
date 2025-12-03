import { GestorTareas } from "./controllers/GestorTareas";
import { Tarea, TareaDificultad } from "./models/Tarea";
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

/**
 * Función auxiliar para recolectar los nuevos datos de una tarea desde el usuario.
 * Es una función pura en el sentido de que no modifica estado externo, solo recolecta y devuelve datos.
 * @param tareaActual La tarea que se está editando.
 * @returns Un objeto con los nuevos valores para la tarea.
 */
function obtenerNuevosDatosTarea(tareaActual: Tarea) {
    console.log("Ingresa el nuevo título o presiona ENTER para mantenerlo.");
    console.log("Título actual: " + tareaActual.getTitulo());
    const nuevoTitulo = input('') || tareaActual.getTitulo();

    console.log("Descripcion actual: " + tareaActual.getDescripcion());
    const nuevaDesc = input('') || tareaActual.getDescripcion();

    console.log("Dificultad actual: " + tareaActual.getDificultad());
    console.log("1- Facil | 2- Medio | 3. Dificil (Enter para mantener)");
    const difInput = input("Elige: ");
    let nuevaDificultad = tareaActual.getDificultad();
    if (difInput === '1') { nuevaDificultad = 'Fácil'; }
    if (difInput === '2') { nuevaDificultad = 'Medio'; }
    if (difInput === '3') { nuevaDificultad = 'Difícil'; }

    console.log("Estado actual: " + tareaActual.getEstado());
    console.log("1- Pendiente | 2- En Curso | 3- Terminada (Enter para mantener)");
    const estInput = input("Elige: ");
    let nuevoEstado = tareaActual.getEstado();
    if (estInput === '1') { nuevoEstado = 'Pendiente'; }
    if (estInput === '2') { nuevoEstado = 'En Curso'; }
    if (estInput === '3') { nuevoEstado = 'Terminada'; }

    return { nuevoTitulo, nuevaDesc, nuevaDificultad, nuevoEstado };
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

    // Usamos la función auxiliar para mantener esta función más limpia
    const { nuevoTitulo, nuevaDesc, nuevaDificultad, nuevoEstado } = obtenerNuevosDatosTarea(tarea);

    gestor.actualizarTarea(
        tarea.getId(), 
        nuevoTitulo, 
        nuevaDesc, 
        nuevaDificultad, 
        nuevoEstado, 
        tarea.getFechaVencimiento()
    );

    console.log("\nTarea actualizada correctamente.");
}

export function agregarNuevaTarea(gestor: GestorTareas) {
    console.log("\n--- NUEVA TAREA ---");
    const titulo = input("Título (Obligatorio): ");
    
    // Validación de entrada
    if (!titulo) {
        console.log("¡El título no puede estar vacío!");
        return; // Salimos de la función si no hay título
    }

    const desc = input("Descripción: ");
    
    console.log("Dificultad: 1. Fácil | 2. Medio | 3. Difícil");
    const difInput = input("Elija (1-3): ");
    
    let dificultad: TareaDificultad = 'Fácil'; // Valor por defecto
    if (difInput === '2') dificultad = 'Medio';
    if (difInput === '3') dificultad = 'Difícil';

    console.log("Fecha Vencimiento (AAAA-MM-DD) o Enter para omitir:");
    const fechaStr = input("Fecha: ");
    let fechaVenc: Date | undefined = undefined;
    
    // Validación de la fecha
    if (fechaStr && !isNaN(new Date(fechaStr).getTime())) {
        fechaVenc = new Date(fechaStr);
    } else if (fechaStr) {
        console.log("Formato de fecha inválido. Se omitirá la fecha de vencimiento.");
    }

    // Llamada al gestor con los datos recolectados
    gestor.agregarTarea(titulo, desc, dificultad, fechaVenc);
    console.log("\n✅ Tarea guardada con éxito.");
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

    //Le pasamos la lista ya ordenada.
    mostrarLista(tareasOrdenadas);
}

/**
 * Muestra un menú para que el usuario elija la estrategia de persistencia.
 * Valida la entrada y no retorna hasta que se elija una opción válida.
 * @returns {string} La opción elegida por el usuario ('1' para JSON, '2' para SQL).
 */
export function solicitarEstrategiaPersistencia(): string {
    let opcion = '';

    while(opcion !== '1' && opcion !== '2'){
        console.clear();
        console.log("========================================");
        console.log("     CONFIGURACIÓN DE ALMACENAMIENTO    ");
        console.log("========================================");
        console.log("Seleccione el motor de persistencia");
        console.log("1. Archivo de Texto (JSON)");
        console.log("2. Base de Datos Local (SQLite)");
        console.log("========================================");

        opcion = input("Elige una opción (1-2): ");

        if (opcion !== '1' && opcion !== '2') {
            console.log(" Opción inválida. Intente nuevamente.");
            input("Presiona ENTER para reintentar...");
        }
    }
    return opcion;
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