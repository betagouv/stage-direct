import { Button } from "@codegouvfr/react-dsfr/Button";
import { Header as DsfrHeader } from "@codegouvfr/react-dsfr/Header";
import { BrandTop } from "./brand-top";
import { UserMenu } from "./user-menu";

type HeaderProps = {
  user?: { name?: string | null; email: string } | null;
};

const HOME_LINK_PROPS = { href: "/", title: "Stage Direct" };
const SERVICE_TAGLINE = "Connectons les futurs magistrats à leurs lieux de formation";

export function Header({ user }: HeaderProps) {
  const quickAccessItems = user
    ? [
        <Button
          key="notifications"
          priority="tertiary"
          iconId="fr-icon-notification-3-line"
          linkProps={{ href: "/notifications" }}
        >
          Notifications
        </Button>,
        <UserMenu key="user-menu" user={user} />,
      ]
    : [
        <Button
          key="faq"
          priority="tertiary no outline"
          iconId="fr-icon-question-line"
          linkProps={{ href: "/foire-aux-questions" }}
        >
          Foire aux questions
        </Button>,
        <Button key="signup" priority="tertiary" linkProps={{ href: "/s-inscrire" }}>
          Créer un compte
        </Button>,
        <Button
          key="login"
          priority="secondary"
          size="large"
          iconId="fr-icon-account-circle-line"
          linkProps={{ href: "/se-connecter" }}
        >
          Se connecter
        </Button>,
      ];

  return (
    <DsfrHeader
      brandTop={<BrandTop />}
      homeLinkProps={HOME_LINK_PROPS}
      serviceTitle="Stage Direct"
      serviceTagline={SERVICE_TAGLINE}
      quickAccessItems={quickAccessItems}
    />
  );
}
