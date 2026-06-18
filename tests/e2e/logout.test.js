import { test, expect } from '@playwright/test';
const { WEB, API, generarUsuario, crearUsuarioPorAPI } = require('../helpers');

test('TC05 - Logout exitoso con usuario dinámico', async ({
  page,
  context,
  request,
}) => {
  // Registrar usuario y obtener token
  const usuario = await crearUsuarioPorAPI(request);
  const { username, password } = usuario;

  const loginResponse = await request.post(`${API}/login`, {
    data: { username, password },
  });

  const responseText = await loginResponse.text();
  const token = responseText.replace(/Auth_token:\s*|"/g, '').trim();

  // INYECCIÓN DE COOKIES NATIVAS

  await context.addCookies([
    {
      name: 'tokenp_',
      value: token,
      url: WEB,
    },
    {
      name: 'user',
      value: username,
      url: WEB,
    },
  ]);

  // TEST Y VERIFICACIÓN EN UI
  await page.goto(WEB);

  const saludoUsuario = page.locator('#nameofuser');
  await expect(saludoUsuario).toContainText(`Welcome ${username}`);

  const botonLogout = page.locator('#logout2');
  await botonLogout.click();

  await expect(page.locator('#login2')).toBeVisible();
  await expect(botonLogout).not.toBeVisible();

  console.log('✅ Logout exitoso');
});
