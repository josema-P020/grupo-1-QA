
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
  const respuesta = await response.text();
  console.log('Respuesta del signup:', respuesta);
  console.log('Usuario creado:', usuario.username);
  expect(respuesta).not.toContain('errorMessage');
});

test('TC02 - Signup con usuario duplicado muestra error', async ({ request }) => {
    // Primero creamos un usuario nuevo
    const usuario = await crearUsuarioPorAPI(request);

    // Ahora intentamos hacer signup con el mismo usuario
    const response = await request.post(`${API}/signup`, {
    data: usuario,
  });

  // Verificar que el signup falló
  expect(response.status()).toBe(200);
  const resultado = await response.json();
  console.log('Respuesta del signup con usuario duplicado:', resultado);
  expect(resultado.errorMessage).toBe('This user already exist.');
  console.log('Usuario duplicado:', usuario.username);
});