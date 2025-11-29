"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Entradas_1 = require("./utils/Entradas");
const GestorTareas_1 = require("./controllers/GestorTareas");
const PersistenciaJSON_1 = require("./services/PersistenciaJSON");
const PersistenciaSQL_1 = require("./services/PersistenciaSQL");
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
// 3. BUCLE PRINCIPAL (Programación Estructurada)
// ==========================================
function main() {
    // Paso 1: Configurar el sistema
    const gestor = configurarBaseDeDatos();
    let salir = false;
    // Paso 2: Bucle de aplicación
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
                console.log("--- Eliminar Tarea ---");
                const tareasActivas = gestor.obtenerTareasActivas();
                console.log("0- Salir");
                if (tareasActivas.length === 0) {
                    console.log("No hay tareas para eliminar.ra eliminar.");
                }
                else {
                    mostrarLista(tareasActivas);
                    const borrar = (0, Entradas_1.input)("\nIngrese el numero de la tarea a eliminar: ");
                    const indiceArray = parseInt(borrar) - 1;
                    if (borrar === '0') {
                        console.log("Operación cancelada.");
                    }
                    else if (indiceArray >= 0 && indiceArray < tareasActivas.length) {
                        const tareaABorrar = tareasActivas[indiceArray];
                        const idReal = tareaABorrar.getId();
                        gestor.eliminarTarea(idReal);
                        console.log("Tarea " + tareaABorrar.getTitulo() + " eliminada (Soft Delete).");
                    }
                    else {
                        console.log("Número inválido: esa tarea no existe:");
                    }
                }
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
