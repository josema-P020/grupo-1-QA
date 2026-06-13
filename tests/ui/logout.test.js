import { test, expect } from '@playwright/test';

test('TC05 - Logout exitoso con usuario dinámico', async ({
  page,
  context,
  request,
}) => {
  const usernameDinamico = `alumno_${Date.now()}`;
  const passwordDinamico = 'bootcamp123';

  // 1. Registrar usuario y obtener token
  await request.post('https://api.demoblaze.com/signup', {
    data: { username: usernameDinamico, password: passwordDinamico },
  });

  const loginResponse = await request.post('https://api.demoblaze.com/login', {
    data: { username: usernameDinamico, password: passwordDinamico },
  });

  const responseText = await loginResponse.text();
  const token = responseText.replace(/Auth_token:\s*|"/g, '').trim();

  // busca exactamente estas dos cookies para loguear la UI
  await context.addCookies([
    {
      name: 'tokenp_',
      value: token,
      url: 'https://www.demoblaze.com',
    },
    {
      name: 'user',
      value: usernameDinamico,
      url: 'https://www.demoblaze.com',
    },
  ]);

  // TEST Y VERIFICACIÓN EN UI
  await page.goto('https://www.demoblaze.com/');

  const saludoUsuario = page.locator('#nameofuser');
  await expect(saludoUsuario).toContainText(`Welcome ${usernameDinamico}`, {
    timeout: 8000,
  });

  const botonLogout = page.locator('#logout2');
  await botonLogout.click();

  await expect(page.locator('#login2')).toBeVisible();
  await expect(botonLogout).not.toBeVisible();
});
