"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.mostrarEncabezado = mostrarEncabezado;
exports.mostrarLista = mostrarLista;
exports.pausa = pausa;
exports.eliminarTarea = eliminarTarea;
exports.editarTarea = editarTarea;
exports.agregarNuevaTarea = agregarNuevaTarea;
exports.verPanel = verPanel;
exports.verTareasConOrden = verTareasConOrden;
exports.solicitarEstrategiaPersistencia = solicitarEstrategiaPersistencia;
const Entradas_1 = require("./utils/Entradas");
const Estadisticas = __importStar(require("./utils/Estadisticas"));
// Lógica de Presentación (UI)
function mostrarEncabezado() {
    console.clear();
    console.log("========================================");
    console.log("   GESTOR DE TAREAS - PARADIGMAS        ");
    console.log("========================================");
}
function mostrarLista(tareas) {
    if (tareas.length === 0) {
        console.log("\n(No hay tareas registradas)");
        return;
    }
    console.log("\n--- LISTADO DE TAREAS ---");
    tareas.forEach((t, i) => {
        // Usamos los getters de la clase Tarea
        console.log(`${i + 1}. [${t.getEstado()}] ${t.getTitulo()} ${t.getDificultadVisual()}`);
        console.log(`   ID: ${t.getId()}`); // Mostramos ID para operaciones
        if (t.getDescripcion())
            console.log(`   Desc: ${t.getDescripcion()}`);
    });
}
function pausa() {
    (0, Entradas_1.input)("Presiona ENTER para continuar...");
}
function eliminarTarea(gestor) {
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
    const borrar = (0, Entradas_1.input)("Ingrese el NÚMERO de la tarea a eliminar: ");
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
    }
    else {
        console.log("Opción inválida: El número ingresado no existe.");
    }
}
/**
 * Función auxiliar para recolectar los nuevos datos de una tarea desde el usuario.
 * Es una función pura en el sentido de que no modifica estado externo, solo recolecta y devuelve datos.
 * @param tareaActual La tarea que se está editando.
 * @returns Un objeto con los nuevos valores para la tarea.
 */
function obtenerNuevosDatosTarea(tareaActual) {
    console.log("Ingresa el nuevo título o presiona ENTER para mantenerlo.");
    console.log("Título actual: " + tareaActual.getTitulo());
    const nuevoTitulo = (0, Entradas_1.input)('') || tareaActual.getTitulo();
    console.log("Descripcion actual: " + tareaActual.getDescripcion());
    const nuevaDesc = (0, Entradas_1.input)('') || tareaActual.getDescripcion();
    console.log("Dificultad actual: " + tareaActual.getDificultad());
    console.log("1- Facil | 2- Medio | 3. Dificil (Enter para mantener)");
    const difInput = (0, Entradas_1.input)("Elige: ");
    let nuevaDificultad = tareaActual.getDificultad();
    if (difInput === '1') {
        nuevaDificultad = 'Fácil';
    }
    if (difInput === '2') {
        nuevaDificultad = 'Medio';
    }
    if (difInput === '3') {
        nuevaDificultad = 'Difícil';
    }
    console.log("Estado actual: " + tareaActual.getEstado());
    console.log("1- Pendiente | 2- En Curso | 3- Terminada (Enter para mantener)");
    const estInput = (0, Entradas_1.input)("Elige: ");
    let nuevoEstado = tareaActual.getEstado();
    if (estInput === '1') {
        nuevoEstado = 'Pendiente';
    }
    if (estInput === '2') {
        nuevoEstado = 'En Curso';
    }
    if (estInput === '3') {
        nuevoEstado = 'Terminada';
    }
    return { nuevoTitulo, nuevaDesc, nuevaDificultad, nuevoEstado };
}
function editarTarea(gestor) {
    console.log("--- EDITAR TAREA ---");
    // Mostrar opciones
    const activas = gestor.obtenerTareasActivas();
    if (activas.length === 0) {
        console.log("No hay tareas para editar.");
        return;
    }
    mostrarLista(activas);
    console.log("0. Cancelar");
    // Seleccion de ID
    const idSeleccion = (0, Entradas_1.input)("Ingrese el Número de la tarea a editar: ");
    if (idSeleccion === '0' || idSeleccion.trim() === '' || isNaN(Number(idSeleccion))) {
        return;
    }
    const indice = parseInt(idSeleccion) - 1;
    if (indice < 0 || indice >= activas.length) {
        console.log("Opción inválida, el número ingresado no existe.");
        return;
    }
    const tarea = activas[indice];
    console.log("Editando: " + tarea.getTitulo());
    // Usamos la función auxiliar para mantener esta función más limpia
    const { nuevoTitulo, nuevaDesc, nuevaDificultad, nuevoEstado } = obtenerNuevosDatosTarea(tarea);
    gestor.actualizarTarea(tarea.getId(), nuevoTitulo, nuevaDesc, nuevaDificultad, nuevoEstado, tarea.getFechaVencimiento());
    console.log("\nTarea actualizada correctamente.");
}
function agregarNuevaTarea(gestor) {
    console.log("\n--- NUEVA TAREA ---");
    const titulo = (0, Entradas_1.input)("Título (Obligatorio): ");
    // 1. Validación de entrada
    if (!titulo) {
        console.log("¡El título no puede estar vacío!");
        return; // Salimos de la función si no hay título
    }
    const desc = (0, Entradas_1.input)("Descripción: ");
    console.log("Dificultad: 1. Fácil | 2. Medio | 3. Difícil");
    const difInput = (0, Entradas_1.input)("Elija (1-3): ");
    // 2. Mapeo seguro de tipos, evitando 'any'
    let dificultad = 'Fácil'; // Valor por defecto
    if (difInput === '2')
        dificultad = 'Medio';
    if (difInput === '3')
        dificultad = 'Difícil';
    console.log("Fecha Vencimiento (AAAA-MM-DD) o Enter para omitir:");
    const fechaStr = (0, Entradas_1.input)("Fecha: ");
    let fechaVenc = undefined;
    // 3. Validación de la fecha
    if (fechaStr && !isNaN(new Date(fechaStr).getTime())) {
        fechaVenc = new Date(fechaStr);
    }
    else if (fechaStr) {
        console.log("Formato de fecha inválido. Se omitirá la fecha de vencimiento.");
    }
    // 4. Llamada al gestor con los datos recolectados
    gestor.agregarTarea(titulo, desc, dificultad, fechaVenc);
    console.log("\n✅ Tarea guardada con éxito.");
}
function verPanel(gestor) {
    console.clear();
    console.log("\n========================================");
    console.log("--- ESTADÍSTICAS DEL SISTEMA ---");
    const tareas = gestor.obtenerTodasLasTareas();
    const total = Estadisticas.obtenerTotalTareas(tareas);
    console.log(`\n Total de Tareas: ${total}`);
    console.log("\n[Por Estado]");
    const porEstado = Estadisticas.obtenerCantidadPorEstado(tareas);
    if (Object.keys(porEstado).length === 0)
        console.log(" - Sin datos");
    Object.keys(porEstado).forEach(estado => {
        console.log(` - ${estado}: ${porEstado[estado]}`);
    });
    console.log("\n[Por Dificultad]");
    const porDificultad = Estadisticas.obtenerCantidadPorDificultad(tareas);
    if (Object.keys(porDificultad).length === 0)
        console.log(" - Sin datos");
    Object.keys(porDificultad).forEach(dif => {
        console.log(` - ${dif}: ${porDificultad[dif]}`);
    });
    const vencidas = Estadisticas.obtenerTareasVencidas(tareas);
    const prioridadAlta = Estadisticas.obtenerTareasPrioridadAlta(tareas);
    console.log("\n[Alertas]");
    console.log(` Vencidas: ${vencidas.length}`);
    vencidas.forEach(t => { var _a; return console.log(`    -> ${t.getTitulo()} (Vencía: ${(_a = t.getFechaVencimiento()) === null || _a === void 0 ? void 0 : _a.toLocaleDateString()})`); });
    console.log(` Prioridad Alta: ${prioridadAlta.length}`);
    prioridadAlta.forEach(t => console.log(`    -> ${t.getTitulo()}`));
    console.log("\n========================================");
}
// ==========================================
// Ver Tareas con Ordenamiento
// ==========================================
function verTareasConOrden(gestor) {
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
    const criterio = (0, Entradas_1.input)("\nOpción (1-5): ");
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
function solicitarEstrategiaPersistencia() {
    let opcion = '';
    while (opcion !== '1' && opcion !== '2') {
        console.clear();
        console.log("========================================");
        console.log("     CONFIGURACIÓN DE ALMACENAMIENTO    ");
        console.log("========================================");
        console.log("Seleccione el motor de persistencia");
        console.log("1. Archivo de Texto (JSON)");
        console.log("2. Base de Datos Local (SQLite)");
        console.log("========================================");
        opcion = (0, Entradas_1.input)("Elige una opción (1-2): ");
        if (opcion !== '1' && opcion !== '2') {
            console.log(" Opción inválida. Intente nuevamente.");
            (0, Entradas_1.input)("Presiona ENTER para reintentar...");
        }
    }
    return opcion;
}
