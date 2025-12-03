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
const gestorTareas_1 = require("./controllers/gestorTareas");
const PersistenciaJSON_1 = require("./services/PersistenciaJSON");
const persistenciaSQL_1 = require("./services/persistenciaSQL");
const UI = __importStar(require("./vista"));
//SELECCIÓN DE ESTRATEGIA 
function configurarBaseDeDatos() {
    // 1. La vista se encarga de solicitar la opción al usuario.
    const opcion = UI.solicitarEstrategiaPersistencia();
    let estrategia;
    if (opcion === '2') {
        console.log(">> Iniciando motor SQL...");
        estrategia = new persistenciaSQL_1.PersistenciaSQL();
    }
    else {
        // Por defecto o si es '1', usamos JSON.
        console.log(">> Iniciando sistema de archivos JSON...");
        estrategia = new PersistenciaJSON_1.PersistenciaJSON();
    }
    // 2. Inyección de Dependencias: El gestor recibe la estrategia elegida.
    // Ya no es necesario el "non-null assertion" (!) porque la lógica asegura
    // que 'estrategia' siempre tendrá un valor.
    return new gestorTareas_1.GestorTareas(estrategia);
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
                // Delegamos toda la lógica de UI a su módulo correspondiente
                UI.agregarNuevaTarea(gestor);
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
