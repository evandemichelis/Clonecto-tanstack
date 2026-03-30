import { test, expect } from "@playwright/test";

test.describe("Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/fr/dashboard");
  });

  test("renders the page title", async ({ page }) => {
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("renders stat cards", async ({ page }) => {
    const cards = page.locator('[class*="card"]');
    await expect(cards.first()).toBeVisible();
  });

  test("renders recent invoices section", async ({ page }) => {
    await expect(page.getByText(/Encaissements récents/i)).toBeVisible();
  });

  test("has a link to see all invoices", async ({ page }) => {
    await page.getByRole("link", { name: /Voir tout/i }).first().click();
    await expect(page).toHaveURL(/\/fr\/invoices/);
  });

  test("page has no horizontal scroll", async ({ page }) => {
    const bodyScrollWidth = await page.evaluate(
      () => document.body.scrollWidth
    );
    const viewportWidth = page.viewportSize()?.width ?? 1280;
    expect(bodyScrollWidth).toBeLessThanOrEqual(viewportWidth);
  });
});
