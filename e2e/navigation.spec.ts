import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("redirects / to /fr/dashboard", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/fr\/dashboard/);
  });

  test("redirects /fr to /fr/dashboard", async ({ page }) => {
    await page.goto("/fr");
    await expect(page).toHaveURL(/\/fr\/dashboard/);
  });

  test("sidebar renders brand name", async ({ page }) => {
    await page.goto("/fr/dashboard");
    await expect(page.getByText("Clonecto")).toBeVisible();
  });

  test("sidebar logo link navigates to dashboard", async ({ page }) => {
    await page.goto("/fr/invoices");
    await page.getByText("Clonecto").click();
    await expect(page).toHaveURL(/\/fr\/dashboard/);
  });

  test("sidebar nav links are all visible", async ({ page }) => {
    await page.goto("/fr/dashboard");
    await expect(page.getByRole("link", { name: /Accueil/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Encaissements/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Dépenses/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Clients/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Paramètres/i })).toBeVisible();
  });

  test("navigates to invoices page from sidebar", async ({ page }) => {
    await page.goto("/fr/dashboard");
    await page.getByRole("link", { name: /Encaissements/i }).click();
    await expect(page).toHaveURL(/\/fr\/invoices/);
  });

  test("navigates to clients page from sidebar", async ({ page }) => {
    await page.goto("/fr/dashboard");
    await page.getByRole("link", { name: /Clients/i }).click();
    await expect(page).toHaveURL(/\/fr\/clients/);
  });

  test("navigates to expenses page from sidebar", async ({ page }) => {
    await page.goto("/fr/dashboard");
    await page.getByRole("link", { name: /Dépenses/i }).click();
    await expect(page).toHaveURL(/\/fr\/expenses/);
  });

  test("navigates to settings page from sidebar", async ({ page }) => {
    await page.goto("/fr/dashboard");
    await page.getByRole("link", { name: /Paramètres/i }).click();
    await expect(page).toHaveURL(/\/fr\/settings/);
  });
});
