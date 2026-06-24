const { test, expect } = require('@playwright/test');
const { API, generarUsuario } = require('../helpers');

test('TC03 - Login con credenciales validas', async ({ request }) => {
  // Creamos el usuario
  const usuario = generarUsuario();
  await request.post(`${API}/signup`, { data: usuario });

  // Hacemos login
  const response = await request.post(`${API}/login`, {
    data: usuario,
  });

  // Verificamos que respondio OK
  expect(response.status()).toBe(200);

  // DemoBlaze devuelve texto, no JSON
  const texto = await response.text();
  console.log('Respuesta del login:', texto);

  // Verificamos que el texto contiene el token
  expect(texto).toContain('Auth_token');
}
);