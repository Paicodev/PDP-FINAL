import { input } from "./utils/Entradas";
import { GestorTareas } from "./controllers/GestorTareas";
import { PersistenciaJSON } from "./services/PersistenciaJSON";
import { PersistenciaSQL } from "./services/PersistenciaSQL";
import { IPersistencia } from './interfaces/IPersistencia';
import * as UI from "./vista";

//SELECCIÓN DE ESTRATEGIA 
function configurarBaseDeDatos(): GestorTareas{
    // La vista se encarga de solicitar la opción al usuario.
    const opcion = UI.solicitarEstrategiaPersistencia();
    let estrategia: IPersistencia;

    if (opcion === '2') {
        console.log(">> Iniciando motor SQL...");
        estrategia = new PersistenciaSQL();
    } else {
        // Por defecto o si es '1', usamos JSON.
        console.log(">> Iniciando sistema de archivos JSON...");
        estrategia = new PersistenciaJSON();
    }

    // El gestor recibe la estrategia elegida.
    return new GestorTareas(estrategia);
}

// BUCLE PRINCIPAL (Programación Estructurada)

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

        const opcion = input("Elija una opción: ");
    
        switch (opcion) {
            case '1':
                UI.verTareasConOrden(gestor);
                UI.pausa();
                break;

            case '2':
                console.log("Ingrese palabra clave: ");
                const busqueda = input("");
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