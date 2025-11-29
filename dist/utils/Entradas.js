"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.input = input;
// 1. Importar prompt-sync para pedir datos por consola.
// Se usa la sintaxis de import de ES6 compatible con módulos CommonJS.
const prompt_sync_1 = __importDefault(require("prompt-sync"));
// 2. Crear la función de prompt.
// La opción { sigint: true } permite que el programa termine con Ctrl+C.
const prompt = (0, prompt_sync_1.default)({ sigint: true });
//Función auxiliar para pedir entradas al usuario
function input(question) {
    const answer = prompt(question);
    // prompt-sync devuelve null si el usuario presiona Ctrl+C.
    // Devolvemos una cadena vacía para mantener la consistencia del tipo.
    return answer === null ? "" : answer;
}
