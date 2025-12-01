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
const UI = __importStar(require("./vista"));
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
// ==========================================
// BUCLE PRINCIPAL (Programación Estructurada)
// ==========================================
function main() {
    //Configurar el sistema
    const gestor = configurarBaseDeDatos();
    let salir = false;
    //Bucle de aplicación
    while (!salir) {
        UI.mostrarEncabezado();
        console.log("1. Ver todas las tareas");
        console.log("2. Buscar tarea por título");
        console.log("3. Agregar nueva tarea");
        console.log("4. Editar tarea");
        console.log("5. Eliminar tarea");
        console.log("6. Ver Estadísticas");
        console.log("7. Asistente IA (Lógica)");
        console.log("0. Salir");
        console.log("----------------------------------------");
        const opcion = (0, Entradas_1.input)("Elija una opción: ");
        switch (opcion) {
            case '1':
                UI.verTareasConOrden(gestor); // <--- Cambio aquí
                UI.pausa();
                break;
            case '2':
                console.log("Ingrese palabra clave: ");
                const busqueda = (0, Entradas_1.input)("");
                const resultados = gestor.buscarTareasPorTitulo(busqueda);
                UI.mostrarLista(resultados);
                UI.pausa();
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
                UI.pausa();
                break;
            case '4':
                UI.editarTarea(gestor);
                UI.pausa();
                break;
            case '5':
                UI.eliminarTarea(gestor);
                UI.pausa();
                break;
            case '6':
                UI.verPanel(gestor);
                UI.pausa();
                break;
            case '7':
                console.clear();
                UI.obtenerSugerencias(gestor);
                UI.pausa();
                break;
            case '0':
                salir = true;
                console.log("\n¡Hasta luego! Guardando datos...");
                break;
            default:
                console.log("Opción no válida.");
                UI.pausa();
                break;
        }
    }
}
main();
