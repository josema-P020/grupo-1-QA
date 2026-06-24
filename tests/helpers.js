/**
 * Helpers y constantes compartidas.
 * Importa esto en tus tests para no repetir codigo y usar los mismos valores.
 *
 * Ejemplo de uso:
 *   const { API, generarUsuario } = require('./helpers');
 */

// URLs base
const API = 'https://api.demoblaze.com';
const WEB = 'https://www.demoblaze.com';

/**
 * Genera un usuario unico usando la fecha actual.
 * Asi nunca choca con "usuario ya existe".
 */
function generarUsuario() {
  const aleatorio = Math.floor(Math.random() * 10000);
  const username = `alumno_${Date.now()}_${aleatorio}`;
  
  const password = btoa('bootcamp123');

  return { username, password };
}

/**
 * Crea un usuario por API. Devuelve las credenciales usadas.
 * Util para el setup de tests E2E.
 */
async function crearUsuarioPorAPI(request) {
  const usuario = generarUsuario();
  await request.post(`${API}/signup`, { data: usuario });
  return usuario;
}

module.exports = { API, WEB, generarUsuario, crearUsuarioPorAPI };
