"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gestorTareas_1 = require("./gestorTareas");
const PersistenciaJSON_1 = require("./PersistenciaJSON");
console.log("--- INICIO DE PRUEBA ---");
// 1. Configuramos la estrategia
const estrategiaJSON = new PersistenciaJSON_1.PersistenciaJSON();
// 2. Iniciamos el gestor
const gestor = new gestorTareas_1.gestorTareas(estrategiaJSON);
console.log(`Tareas iniciales: ${gestor.obtenerTodasLasTareas().length}`);
// 3. Agregamos una tarea
console.log("Agregando tarea de prueba...");
const tarea = gestor.agregarTarea("Prueba JSON", "Verificando si guarda", "Medio");
console.log(`Tarea creada con ID: ${tarea.getId()}`);
// 4. Verificamos si tiene métodos (Si esto falla, la clase Tarea está mal)
console.log(`Visual: ${tarea.getDificultadVisual()}`);
// 5. SIMULACIÓN DE REINICIO
console.log("\n--- SIMULANDO REINICIO DE APP ---");
const gestorNuevo = new gestorTareas_1.gestorTareas(estrategiaJSON);
const tareasRecuperadas = gestorNuevo.obtenerTodasLasTareas();
console.log(`Tareas recuperadas del disco: ${tareasRecuperadas.length}`);
// 6. Validamos que la última sea la que acabamos de crear
const ultima = tareasRecuperadas[tareasRecuperadas.length - 1];
if (ultima.getId() === tarea.getId()) {
    console.log("✅ ÉXITO: La tarea persistió y se recuperó correctamente.");
    console.log(`Datos recuperados: ${ultima.getTitulo()} - ${ultima.getDificultadVisual()}`);
}
else {
    console.log("❌ ERROR: No se encontró la tarea guardada.");
}
