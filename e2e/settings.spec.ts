import { test, expect } from "@playwright/test";

test.describe("Settings page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/fr/settings");
  });

  test("renders the page heading", async ({ page }) => {
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("renders language section", async ({ page }) => {
    await expect(page.getByText("Français")).toBeVisible();
    await expect(page.getByText("English")).toBeVisible();
    await expect(page.getByText("Español")).toBeVisible();
  });

  test("switches locale to English", async ({ page }) => {
    await page.getByRole("button", { name: "English" }).click();
    await expect(page).toHaveURL(/\/en\/settings/);
  });

  test("switches locale to Spanish", async ({ page }) => {
    await page.getByRole("button", { name: "Español" }).click();
    await expect(page).toHaveURL(/\/es\/settings/);
  });

  test("active language button is highlighted", async ({ page }) => {
    const frButton = page.getByRole("button", { name: "Français" });
    await expect(frButton).toHaveClass(/active/);
  });
});
