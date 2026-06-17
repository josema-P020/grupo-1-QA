const { test, expect } = require('@playwright/test');
const { WEB, generarUsuario, crearUsuarioPorAPI } = require('../helpers');

test('TC01 - Signup exitoso con datos válidos', async ({ page }) => {
  const { username, password } = generarUsuario();

  await page.goto(WEB);
  await page.click('#signin2');
  await expect(page.locator('#signInModal')).toBeVisible();

  await page.fill('#sign-username', username);
  await page.fill('#sign-password', password);
  
  const dialogPromise = page.waitForEvent('dialog');
  await page.click('#signInModal .btn-primary');
  const dialog = await dialogPromise;
  console.log('Alerta signup exitoso:', dialog.message());
  expect(dialog.message()).toContain('Sign up successful.');
  await dialog.accept();

  console.log('Usuario creado:', username);
});

test('TC02 - Signup con usuario duplicado muestra error', async ({ page, request }) => {
  const { username, password } = await crearUsuarioPorAPI(request);
  await page.goto(WEB);
  await page.click('#signin2');
  await expect(page.locator('#signInModal')).toBeVisible();

  await page.fill('#sign-username', username);
  await page.fill('#sign-password', password);

  const dialogPromise = page.waitForEvent('dialog');
  await page.click('#signInModal .btn-primary');
  const dialog = await dialogPromise;
  console.log('Alerta duplicado:', dialog.message());
  expect(dialog.message()).toContain('This user already exist.');
  await dialog.accept();

  console.log('Intento de signup con usuario duplicado:', username);
});