import { authClient } from "~/lib/auth-client";
import styles from "./proconnect-button.module.css";

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

  return (
    <div>
      <button type="button" onClick={handleClick} className={styles.button}>
        <span aria-hidden="true" className={styles.badge}>
          PRO
        </span>
        S'identifier avec ProConnect
      </button>
      <div className="fr-mt-1w">
        <a
          href="https://www.proconnect.gouv.fr/"
          target="_blank"
          rel="noopener noreferrer"
          className="fr-link fr-link--sm"
        >
          Qu'est-ce que ProConnect ?
        </a>
      </div>
    </div>
  );
}
