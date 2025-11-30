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
const Entradas_1 = require("./utils/Entradas");
const GestorTareas_1 = require("./controllers/GestorTareas");
const PersistenciaJSON_1 = require("./services/PersistenciaJSON");
const PersistenciaSQL_1 = require("./services/PersistenciaSQL");
const Estadisticas = __importStar(require("./utils/Estadisticas"));
//SELECCIÓN DE ESTRATEGIA 
function configurarBaseDeDatos() {
    let opcion = '';
    let estrategia = null;
    while (opcion !== '1' && opcion !== '2') {
        console.clear();
        console.log("========================================");
        console.log("     CONFIGURACIÓN DE ALMACENAMIENTO    ");
        console.log("========================================");
        console.log("Selecciones el motor de persistencia");
        console.log("1. Archivo de Texto (JSON)");
        console.log("2- Base de Datos Local (SQLite)");
        console.log("========================================");
        opcion = (0, Entradas_1.input)("Elige una opción (1-2): ");
        if (opcion === '2') {
            console.log(">> Iniciando motor SQL...");
            estrategia = new PersistenciaSQL_1.PersistenciaSQL();
        }
        else if (opcion == '1') {
            console.log(">> Iniciando sistema de archivos JSON...");
            estrategia = new PersistenciaJSON_1.PersistenciaJSON();
        }
        else {
            console.log(" Opción inválida. Intente nuevamente.");
            (0, Entradas_1.input)("Presiona ENTER para reintentar...");
        }
    }
    // Inyección de Dependencias: El gestor recibe la estrategia elegida
    return new GestorTareas_1.GestorTareas(estrategia); //aqui el signo ! quiere decir que estrategia no es null.
}
//Logica de Presentación
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
    (0, Entradas_1.input)("\nPresiona ENTER para continuar...");
}
// ==========================================
// Eliminar Tarea - Funcion extraida para evitar callback hell
// ==========================================
function EliminarTarea(gestor) {
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
    const borrar = (0, Entradas_1.input)("\nIngrese el NÚMERO de la tarea a eliminar: ");
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
function VerPanel(gestor) {
    console.clear();
    console.log("\n========================================");
    console.log("--- ESTADÍSTICAS DEL SISTEMA ---");
    // cargamos todas las tareas en una variable
    const tareas = gestor.obtenerTodasLasTareas();
    // sacamos el total de tareas
    const total = Estadisticas.obtenerTotalTareas(tareas);
    console.log(`\n Total de Tareas: ${total}`);
    // Por Estado (Iteramos el objeto Record que devuelve la función pura)
    console.log("\n[Por Estado]");
    const porEstado = Estadisticas.obtenerCantidadPorEstado(tareas);
    // Object.keys nos da ["Pendiente", "Terminada", etc.]
    if (Object.keys(porEstado).length === 0)
        console.log(" - Sin datos");
    Object.keys(porEstado).forEach(estado => {
        console.log(` - ${estado}: ${porEstado[estado]}`);
    });
    // Por Dificultad
    console.log("\n[Por Dificultad]");
    const porDificultad = Estadisticas.obtenerCantidadPorDificultad(tareas);
    if (Object.keys(porDificultad).length === 0)
        console.log(" - Sin datos");
    Object.keys(porDificultad).forEach(dif => {
        console.log(` - ${dif}: ${porDificultad[dif]}`);
    });
    // Alertas (Vencidas y Prioridad Alta)
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
// BUCLE PRINCIPAL (Programación Estructurada)
// ==========================================
function main() {
    //Configurar el sistema
    const gestor = configurarBaseDeDatos();
    let salir = false;
    //Bucle de aplicación
    while (!salir) {
        mostrarEncabezado();
        console.log("1. Ver todas las tareas");
        console.log("2. Buscar tarea por título");
        console.log("3. Agregar nueva tarea");
        console.log("4. Editar tarea (To-Do)"); // Aún no implementado en el menú
        console.log("5. Eliminar tarea");
        console.log("6. Ver Estadísticas (To-Do)"); // Aún no implementado en el menú
        console.log("0. Salir");
        console.log("----------------------------------------");
        const opcion = (0, Entradas_1.input)("Elija una opción: ");
        switch (opcion) {
            case '1':
                const todas = gestor.obtenerTodasLasTareas();
                mostrarLista(todas);
                pausa();
                break;
            case '2':
                //se limpia la consola para que no este sucia, esto evita que baje el texto al escribir algo.
                console.clear();
                const busqueda = (0, Entradas_1.input)("\nIngrese palabra clave: ");
                const resultados = gestor.buscarTareasPorTitulo(busqueda);
                mostrarLista(resultados);
                pausa();
                break;
            case '3':
                console.log("\n--- NUEVA TAREA ---");
                const titulo = (0, Entradas_1.input)("Título (Obligatorio): ");
                if (!titulo) {
                    console.log("! El título no puede estar vacío.");
                }
                else {
                    const desc = (0, Entradas_1.input)("Descripción: ");
                    console.log("Dificultad: 1.Fácil | 2.Medio | 3.Difícil");
                    const difInput = (0, Entradas_1.input)("Elija (1-3): ");
                    // Mapeo simple de entrada a Tipo
                    let dif = 'Fácil';
                    if (difInput === '2')
                        dif = 'Medio';
                    if (difInput === '3')
                        dif = 'Difícil';
                    // solicitamos fecha de vencimiento
                    console.log("Fecha Vencimiento (AAAA-MM-DD) o Enter para vacio:");
                    const fechaStr = (0, Entradas_1.input)("Fecha: ");
                    let fechaVenc = undefined;
                    if (fechaStr)
                        fechaVenc = new Date(fechaStr);
                    gestor.agregarTarea(titulo, desc, dif, fechaVenc);
                    console.log(" Tarea guardada con éxito.");
                }
                pausa();
                break;
            case '4':
                console.log("\n(Funcionalidad de Edición en construcción...)");
                pausa();
                break;
            case '5':
                console.clear();
                EliminarTarea(gestor);
                pausa();
                break;
            case '6':
                VerPanel(gestor);
                pausa();
                break;
            case '0':
                salir = true;
                console.log("\n¡Hasta luego! Guardando datos...");
                break;
            default:
                console.log("Opción no válida.");
                pausa();
                break;
        }
    }
}
main();
