const { test, expect } = require('@playwright/test');
const { WEB, generarUsuario, crearUsuarioPorAPI } = require('../helpers');

test('TC01 - Signup exitoso con datos válidos', async ({ page }) => {
  const { username, password } = generarUsuario();

  await page.goto(WEB);
  await page.click('#signin2');
  await expect(page.locator('#sign-username')).toBeVisible();

  const usuario = generarUsuario();
  await page.fill('#sign-username', username);
  await page.fill('#sign-password', password);

  page.once('dialog', async (dialog) => {
    console.log('Alerta:', dialog.message());
    expect(dialog.message()).toContain('Sign up successful');
    await dialog.accept();
    });

    await page.click('#signInModal .btn-primary');
    await page.waitForTimeout(2000);

    console.log('Usuario creado:', username);
});