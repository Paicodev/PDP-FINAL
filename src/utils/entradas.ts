// 1. Importar prompt-sync para pedir datos por consola.
// Se usa la sintaxis de import de ES6 compatible con módulos CommonJS.
import promptSync from 'prompt-sync';
// 2. Crear la función de prompt.
// La opción { sigint: true } permite que el programa termine con Ctrl+C.
const prompt = promptSync({ sigint: true });

//Función auxiliar para pedir entradas al usuario
function input(question: string): string {
  const answer = prompt(question);
  // prompt-sync devuelve null si el usuario presiona Ctrl+C.
  // Devolvemos una cadena vacía para mantener la consistencia del tipo.
  return answer === null ? "" : answer;
}

export { input};