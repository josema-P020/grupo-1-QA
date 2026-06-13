import { test, expect } from '@playwright/test';

test('TC05 - Logout exitoso con usuario dinámico', async ({
  page,
  request,
}) => {
  // Generamos un nombre de usuario único usando la estampa de tiempo actual
  const usernameDinamico = `alumno_${Date.now()}`;
  const passwordDinamico = 'bootcamp123';

  // === FASE 1: REGISTRO VIA API ===
  const signupResponse = await request.post(
    'https://api.demoblaze.com/signup',
    {
      data: {
        username: usernameDinamico,
        password: passwordDinamico,
      },
    },
  );

  // Verificamos que el registro haya sido exitoso en la API
  expect(signupResponse.ok()).toBeTruthy();

  // === FASE 2: LOGIN VIA API ===
  const loginResponse = await request.post('https://api.demoblaze.com/login', {
    data: {
      username: usernameDinamico,
      password: passwordDinamico,
    },
  });

  // Verificamos éxito de red del login
  expect(loginResponse.ok()).toBeTruthy();

  // Extraemos el token devuelto y lo limpiamos de comillas
  const responseText = await loginResponse.text();
  const token = responseText.replace(/Auth_token:\s*|"/g, '').trim();
  console.log(`--> USUARIO CREADO: ${usernameDinamico}`);
  console.log(`--> TOKEN GENERADO: ${token}`);

  // === FASE 3: INYECCIÓN DE SESIÓN Y NAVEGACIÓN ===
  // 1. Entramos a la tienda para fijar el dominio en el navegador
  await page.goto('https://www.demoblaze.com/');

  // 2. Inyectamos las credenciales dinámicas en el Local Storage
  await page.evaluate(
    ({ user, tokenValue }) => {
      localStorage.setItem('username', user);
      localStorage.setItem('token_ja_clsm', tokenValue);
    },
    { user: usernameDinamico, tokenValue: token },
  );

  // 3. Recargamos la página de manera limpia para que impacte la UI
  await page.reload({ waitUntil: 'load' });

  // === FASE 4: VALIDACIÓN EN UI Y LOGOUT ===
  // 4. Esperamos a que el saludo confirme que la sesión impactó de verdad en la interfaz [cite: 48]
  const saludoUsuario = page.locator('#nameofuser');
  await expect(saludoUsuario).toContainText(`Welcome ${usernameDinamico}`);

  // 5. Localizamos el botón de cerrar sesión (Log out) y le hacemos clic [cite: 49]
  const botonLogout = page.locator('#logout2');
  await botonLogout.click();

  // 6. Validaciones finales: El botón de Login debe volver a aparecer y el de Logout desaparecer
  await expect(page.locator('#login2')).toBeVisible();
  await expect(botonLogout).not.toBeVisible();
});
