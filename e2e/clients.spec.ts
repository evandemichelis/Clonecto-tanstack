import { test, expect } from "@playwright/test";

test.describe("Clients page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/fr/clients");
  });

  test("renders the page heading", async ({ page }) => {
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("renders the create button", async ({ page }) => {
    await expect(page.getByRole("button", { name: /Créer/i })).toBeVisible();
  });

  test("renders the search input", async ({ page }) => {
    await expect(page.getByRole("textbox")).toBeVisible();
  });

  test("opens create client modal on button click", async ({ page }) => {
    await page.getByRole("button", { name: /Créer/i }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
  });

  test("closes modal with cancel button", async ({ page }) => {
    await page.getByRole("button", { name: /Créer/i }).click();
    await page.getByRole("button", { name: /Annuler/i }).click();
    await expect(page.getByRole("dialog")).not.toBeVisible();
  });

  test("closes modal with Escape key", async ({ page }) => {
    await page.getByRole("button", { name: /Créer/i }).click();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).not.toBeVisible();
  });

  test("filters clients by search input", async ({ page }) => {
    const input = page.getByRole("textbox");
    await input.fill("zzz_no_match");
    const cards = page.locator('[class*="clientCard"]');
    await expect(cards).toHaveCount(0);
  });
});
