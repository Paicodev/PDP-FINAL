import { input } from "./utils/Entradas";
import { GestorTareas } from "./controllers/gestorTareas";
import { PersistenciaJSON } from "./services/PersistenciaJSON";
import { PersistenciaSQL } from "./services/persistenciaSQL";
import { IPersistencia } from './interfaces/IPersistencia';
import * as UI from "./vista";

//SELECCIÓN DE ESTRATEGIA 
function configurarBaseDeDatos(): GestorTareas{
    let opcion = '';
    let estrategia: IPersistencia | null = null;

    while(opcion !== '1' && opcion !== '2'){
        
    console.clear();
    console.log("========================================");
    console.log("     CONFIGURACIÓN DE ALMACENAMIENTO    ");
    console.log("========================================");
    console.log("Selecciones el motor de persistencia");
    console.log("1. Archivo de Texto (JSON)");
    console.log("2- Base de Datos Local (SQLite)");
    console.log("========================================");

    opcion = input("Elige una opción (1-2): ");

    if (opcion === '2') {
        console.log(">> Iniciando motor SQL...");
        estrategia = new PersistenciaSQL();
    } else if (opcion == '1'){
        console.log(">> Iniciando sistema de archivos JSON...");
        estrategia = new PersistenciaJSON();
    }else {
        console.log(" Opción inválida. Intente nuevamente.");
            input("Presiona ENTER para reintentar...");
    }
    
    }
    // Inyección de Dependencias: El gestor recibe la estrategia elegida
    return new GestorTareas(estrategia!); //aqui el signo ! quiere decir que estrategia no es null.
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

        const opcion = input("Elija una opción: ");

        switch (opcion) {
            case '1':
                const todas = gestor.obtenerTodasLasTareas();
                mostrarLista(todas);
                pausa();
                break;

            case '2':
                console.log("Ingrese palabra clave: ");
                const busqueda = input("");
                const resultados = gestor.buscarTareasPorTitulo(busqueda);
                UI.mostrarLista(resultados);
                UI.pausa();
                break;

            case '3':
                console.log("\n--- NUEVA TAREA ---");
                const titulo = input("Título (Obligatorio): ");
                if (!titulo) {
                    console.log("! El título no puede estar vacío.");
                } else {
                    const desc = input("Descripción: ");
                    console.log("Dificultad: 1.Fácil | 2.Medio | 3.Difícil");
                    const difInput = input("Elija (1-3): ");
                    
                    // Mapeo simple de entrada a Tipo
                    let dif: any = 'Fácil';
                    if (difInput === '2') dif = 'Medio';
                    if (difInput === '3') dif = 'Difícil';

                    // solicitamos fecha de vencimiento
                    console.log("Fecha Vencimiento (AAAA-MM-DD) o Enter para vacio:");
                    const fechaStr = input("Fecha: ");
                    let fechaVenc: Date | undefined = undefined;
                    if(fechaStr) fechaVenc = new Date(fechaStr);

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