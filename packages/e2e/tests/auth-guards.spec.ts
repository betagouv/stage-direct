import { expect, test } from "@playwright/test";

const PROTECTED_ROUTES = ["/", "/onboarding"];
const PUBLIC_ROUTES = [
  "/se-connecter",
  "/s-inscrire",
  "/mot-de-passe-oublie",
  "/foire-aux-questions",
];

test.describe("Routes protégées (utilisateur non connecté)", () => {
  for (const route of PROTECTED_ROUTES) {
    test(`${route} redirige vers /se-connecter`, async ({ page }) => {
      await page.goto(route);
      await expect(page).toHaveURL(/\/se-connecter/);
    });
  }
});

test.describe("Routes publiques (utilisateur non connecté)", () => {
  for (const route of PUBLIC_ROUTES) {
    test(`${route} est accessible`, async ({ page }) => {
      const response = await page.goto(route);
      expect(response?.status()).toBe(200);
      await expect(page).toHaveURL(new RegExp(route.replace(/\//g, "\\/")));
    });
  }
});

test.describe("Page 404", () => {
  test("Une URL inconnue rend la page 404", async ({ page }) => {
    await page.goto("/cette-page-n-existe-pas-12345");
    await expect(page.getByRole("heading", { name: /Page introuvable/i })).toBeVisible();
    await expect(page.getByText(/Erreur 404/i)).toBeVisible();
  });
});
