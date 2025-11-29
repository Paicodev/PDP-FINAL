import { input } from './utils/Entradas';
import { GestorTareas } from './controllers/GestorTareas';
import { PersistenciaJSON } from './services/PersistenciaJSON';
import { PersistenciaSQL } from './services/PersistenciaSQL';
import { Tarea } from './models/Tarea';
import { IPersistencia } from './interfaces/IPersistencia';

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

//Logica de Presentación

function mostrarEncabezado(){
    console.clear();
    console.log("========================================");
    console.log("   GESTOR DE TAREAS - PARADIGMAS        ");
    console.log("========================================");
}

function mostrarLista(tareas: Tarea[]) {
    if (tareas.length === 0) {
        console.log("\n(No hay tareas registradas)");
        return;
    }
    console.log("\n--- LISTADO DE TAREAS ---");
    tareas.forEach((t, i) => {
        // Usamos los getters de la clase Tarea
        console.log(`${i + 1}. [${t.getEstado()}] ${t.getTitulo()} ${t.getDificultadVisual()}`);
        console.log(`   ID: ${t.getId()}`); // Mostramos ID para operaciones
        if (t.getDescripcion()) console.log(`   Desc: ${t.getDescripcion()}`);
    });
}

function pausa() {
    input("\nPresiona ENTER para continuar...");
}

// ==========================================
// Eliminar Tarea - Funcion extraida para evitar callback hell
// ==========================================
function EliminarTarea(gestor: GestorTareas) {
    console.clear();
    console.log("--- ELIMINAR TAREA ---");

    // Obtenemos las tareas activas
    const activas = gestor.obtenerTareasActivas();
    if (activas.length === 0) {
        console.log("No hay tareas disponibles para eliminar.");
        return; 

    // Mostramos las opciones para eliminar
    mostrarLista(activas);
    console.log("0. Cancelar");

    // guardamos la selección
    const borrar = input("\nIngrese el NÚMERO de la tarea a eliminar: ");
    
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

        const opcion = input("Elija una opción: ");

        switch (opcion) {
            case '1':
                const todas = gestor.obtenerTodasLasTareas();
                mostrarLista(todas);
                pausa();
                break;

            case '2':
                //se limpia la consola para que no este sucia, esto evita que baje el texto al escribir algo.
                console.clear();
                const busqueda = input("\nIngrese palabra clave: ");
                const resultados = gestor.buscarTareasPorTitulo(busqueda);
                mostrarLista(resultados);
                pausa();
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

                    gestor.agregarTarea(titulo, desc, dif);
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
                console.log("\n(Módulo de Estadísticas pendiente de implementación...)");
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