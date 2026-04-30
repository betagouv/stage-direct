import { Button } from "@codegouvfr/react-dsfr/Button";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { authClient } from "~/lib/auth-client";
import { getSessionQueryOptions } from "~/lib/session-query";
import { createToast } from "./ui/create-toast";
import { Dropdown } from "./ui/dropdown";

type UserMenuProps = {
  user: { name?: string | null; email: string };
};

export function UserMenu({ user }: UserMenuProps) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const handleSignout = async () => {
    await authClient.signOut();
    await queryClient.invalidateQueries({ queryKey: getSessionQueryOptions().queryKey });
    await router.invalidate();
    createToast({ priority: "success", message: "Vous êtes maintenant déconnecté." });
    router.navigate({ to: "/se-connecter" });
  };

  return (
    <Dropdown
      id="header-user-menu"
      alignRight
      control={user.name || user.email}
      priority="tertiary"
      dropdownControlClassName="fr-mb-0"
    >
      <ul>
        <li className="fr-border-top fr-border-bottom">
          <Button
            priority="tertiary no outline"
            iconId="fr-icon-logout-box-r-line"
            onClick={handleSignout}
          >
            Se déconnecter
          </Button>
        </li>
      </ul>
    </Dropdown>
  );
}
