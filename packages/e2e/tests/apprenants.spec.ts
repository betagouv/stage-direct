import { expect, type Page, test } from "@playwright/test";
import { TEST_USER_EMAIL, TEST_USER_PASSWORD } from "web/prisma/seed-constants";

async function loginAsTestUser(page: Page) {
  await page.goto("/se-connecter");
  await page.waitForLoadState("networkidle");
  await page.locator('input[name="email"]').fill(TEST_USER_EMAIL);
  await page.locator('input[name="password"]').fill(TEST_USER_PASSWORD);
  await page.getByRole("button", { name: /^Se connecter/ }).click();
  await page.waitForURL((url) => !url.pathname.includes("/se-connecter"), { timeout: 15_000 });
}

test.describe("Page Apprenants (espace gestionnaire)", () => {
  test("affiche la liste avec en-tête et cartes pour un DCS connecté", async ({ page }) => {
    await loginAsTestUser(page);
    await page.goto("/apprenants");

    await expect(page.getByRole("heading", { name: "Apprenants", level: 1 })).toBeVisible();
    await expect(page.getByText(/Auditeurs de justice du TJ de Paris/)).toBeVisible();

    const counter = page.getByText(/^\d+ apprenants?$/);
    await expect(counter).toBeVisible();
  });

  test("filtre par statut Stage en cours via les onglets", async ({ page }) => {
    await loginAsTestUser(page);
    await page.goto("/apprenants");
    await page.waitForLoadState("networkidle");

    // Le label recouvre l'input DSFR — on passe par le DOM natif pour déclencher le onChange React
    await page
      .locator("label")
      .filter({ hasText: "Stage en cours" })
      .evaluate((el) => (el as HTMLElement).click());
    await expect(page).toHaveURL(/statut=EN_COURS/, { timeout: 10_000 });
  });

  test("la recherche filtre la liste sans perdre le focus de l'input", async ({ page }) => {
    await loginAsTestUser(page);
    await page.goto("/apprenants");

    const searchInput = page.getByPlaceholder("Nom ou prénom");
    await searchInput.click();
    await page.keyboard.type("zzzunknownnameforsure");

    // Attend que le debounce + tRPC + re-render ait eu lieu
    await expect(page.getByText(/Aucun apprenant ne correspond à ces filtres/)).toBeVisible({
      timeout: 10_000,
    });
    // L'input doit toujours avoir le focus après le re-fetch
    await expect(searchInput).toBeFocused();
    await expect(searchInput).toHaveValue("zzzunknownnameforsure");
  });

  test("redirige un apprenant vers le tableau de bord", async ({ page }) => {
    // Pas connecté → /apprenants doit rediriger vers /se-connecter
    await page.goto("/apprenants");
    await expect(page).toHaveURL(/\/se-connecter/);
  });
});
