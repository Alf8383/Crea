import { randomUUID } from "node:crypto";
import { expect, type Page } from "@playwright/test";

export async function createTestAccount(page: Page) {
  await page.goto("/registro");
  await page.getByLabel("Correo electrónico").fill(`qa-${randomUUID()}@example.test`);
  await page.getByLabel("Contraseña", { exact: true }).fill("cuenta-de-prueba-crea");
  await page.getByRole("button", { name: "Crear cuenta", exact: true }).click();
  await expect(page).toHaveURL(/\/negocios$/);
  await expect(page.getByRole("main").getByRole("button", { name: "Salir" })).toBeVisible();
}
