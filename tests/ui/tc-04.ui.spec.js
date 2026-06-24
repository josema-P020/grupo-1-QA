const { test, expect } = require('@playwright/test');

test('TC04 - Login con credenciales invalidas muestra error', async ({ page }) => {
  await page.goto('/');

  // Abrir el modal de login
  await page.click('#login2');

  // Esperar que aparezca el modal
  await page.waitForSelector('#logInModal', { state: 'visible' });

  // Ingresar credenciales invalidas
  await page.fill('#loginusername', 'usuario_falso');
  await page.fill('#loginpassword', 'password_falso');

  // Capturar la alerta antes de hacer click 
  page.once('dialog', async (dialog) => {
    console.log('Alerta:', dialog.message());
    expect(dialog.message()).toContain('Wrong password');
    await dialog.accept();
  });


});