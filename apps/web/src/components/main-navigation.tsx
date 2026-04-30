import { MainNavigation, type MainNavigationProps } from "@codegouvfr/react-dsfr/MainNavigation";
import { useLocation } from "@tanstack/react-router";

const NAV_ITEMS: ReadonlyArray<{ href: string; text: string }> = [
  { href: "/tableau-de-bord", text: "Tableau de bord" },
  { href: "/apprenants", text: "Apprenants" },
  { href: "/planning", text: "Planning" },
  { href: "/evaluations", text: "Evaluations" },
  { href: "/ressources-enm", text: "Ressources ENM" },
  { href: "/centre-d-aide", text: "Centre d'aide" },
];

export function MainNav() {
  const { pathname } = useLocation();

  const items: MainNavigationProps.Item[] = NAV_ITEMS.map(({ href, text }) => ({
    isActive: pathname === href,
    linkProps: { href, target: "_self" },
    text,
  }));

  return <MainNavigation items={items} />;
}
