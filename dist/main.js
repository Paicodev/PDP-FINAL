"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GestorTareas_1 = require("./controllers/GestorTareas");
const PersistenciaJSON_1 = require("./services/PersistenciaJSON");
const PersistenciaSQL_1 = require("./services/PersistenciaSQL");
console.log("--- INICIO DE PRUEBA ---");
//guardamos la estrategia en una instancia de la clase PersistenciaJSON
const estrategiaJSON = new PersistenciaJSON_1.PersistenciaJSON();
const estrategiaSQL = new PersistenciaSQL_1.PersistenciaSQL();
// Iniciamos el gestor con la estrategia de persistencia deseada
//const gestor = new GestorTareas(estrategiaJSON);//
const gestor = new GestorTareas_1.GestorTareas(estrategiaSQL);
console.log(`Tareas iniciales: ${gestor.obtenerTodasLasTareas().length}`);
// Agregamos una tarea
console.log("Agregando tarea de prueba...");
const tarea = gestor.agregarTarea("Prueba sql", "Verificando si guarda", "Medio");
console.log(`Tarea creada con ID: ${tarea.getId()}`);
// Verificamos si tiene métodos (Si esto falla, la clase Tarea está mal)
console.log(`Visual: ${tarea.getDificultadVisual()}`);
// Simulamos un reinicio (si no tuviesemos persistencia, perderíamos todo)
console.log("\n--- SIMULANDO REINICIO DE APP ---");
//creamos variable nueva de gestorTareas, para simular reinicio
const gestorNuevo = new GestorTareas_1.GestorTareas(estrategiaJSON);
const tareasRecuperadas = gestorNuevo.obtenerTodasLasTareas();
console.log(`Tareas recuperadas del disco: ${tareasRecuperadas.length}`);
