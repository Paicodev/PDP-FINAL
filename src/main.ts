import { input } from "./utils/Entradas";
import { GestorTareas } from "./controllers/GestorTareas";
import { PersistenciaJSON } from "./services/PersistenciaJSON";
import { PersistenciaSQL } from "./services/persistenciaSQL";
import { Tarea } from './models/Tarea';
import { IPersistencia } from './interfaces/IPersistencia';
import * as Estadisticas from './utils/Estadisticas';

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
    }
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

function EditarTarea(gestor: GestorTareas){
    console.clear();
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
    const idSeleccion = input("\nIngrese el Número de la tarea a editar:\n");
    if (idSeleccion === '0' || idSeleccion.trim() === '' || isNaN(Number(idSeleccion))) {
        return;
    }

    const indice = parseInt(idSeleccion) -1;

    if ( indice < 0 || indice >= activas.length){
        console.log("Opción inválida, el número ingresado no existe.");
        return;
    }

    const tarea = activas[indice];
    console.log("\n Editando: "+ tarea.getTitulo());
    console.log("(Deja vacio y presiona ENTER para mantener el valor actual)");

    // el operador || nos permite mantener el valor actual si no se ingresa nada nuevo. Porque input devuelve string siempre.
    const nuevoTitulo = input("Titulo: "+ tarea.getTitulo()) || tarea.getTitulo();
    const nuevaDesc = input("Descripción: "+ tarea.getDescripcion()) || tarea.getDescripcion();

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

    console.log("Tarea creada correctamente.")
}

function VerPanel(gestor: GestorTareas) {
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
    if (Object.keys(porEstado).length === 0) console.log(" - Sin datos");
    Object.keys(porEstado).forEach(estado => {
        console.log(` - ${estado}: ${porEstado[estado]}`);
    });

    // Por Dificultad
    console.log("\n[Por Dificultad]");
    const porDificultad = Estadisticas.obtenerCantidadPorDificultad(tareas);
    if (Object.keys(porDificultad).length === 0) console.log(" - Sin datos");
    Object.keys(porDificultad).forEach(dif => {
        console.log(` - ${dif}: ${porDificultad[dif]}`);
    });

    // Alertas (Vencidas y Prioridad Alta)
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

                    // solicitamos fecha de vencimiento
                    console.log("Fecha Vencimiento (AAAA-MM-DD) o Enter para vacio:");
                    const fechaStr = input("Fecha: ");
                    let fechaVenc: Date | undefined = undefined;
                    if(fechaStr) fechaVenc = new Date(fechaStr);

                    gestor.agregarTarea(titulo, desc, dif, fechaVenc);
                    console.log(" Tarea guardada con éxito.");
                }
                pausa();
                break;

            case '4':
                EditarTarea(gestor);
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