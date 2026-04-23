import { ProConnectButton as DsfrProConnectButton } from "@codegouvfr/react-dsfr/ProConnectButton";
import { authClient } from "~/lib/auth-client";

type ProConnectButtonProps = {
  callbackURL?: string;
};

export function ProConnectButton({ callbackURL = "/onboarding" }: ProConnectButtonProps) {
  const handleClick = async () => {
    await authClient.signIn.oauth2({
      providerId: "proconnect",
      callbackURL,
    });
  };

  return <DsfrProConnectButton onClick={handleClick} />;
}
