//Generame un test de Playwright que haga login en DemoBlaze con usuario y contraseña, y verifique que el nombre de usuario aparece en la pantalla
const { test, expect } = require('@playwright/test');
const { API, generarUsuario, crearUsuarioPorAPI} = require('../helpers');

test('TC01 - Signup exitoso con datos válidos ', async ({ request }) => {
    //Primero creamos un usuario nuevo
    const usuario = generarUsuario();
    
    // Ahora hacemos signup
    const response = await request.post(`${API}/signup`, {
    data: usuario,
  });

  // Verificar que el signup fue exitoso
  expect(response.status()).toBe(200);
  const texto = await response.text();
  console.log('Respuesta del signup:', texto);
});