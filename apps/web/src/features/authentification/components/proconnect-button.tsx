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

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.75rem",
          background: "#000091",
          color: "#ffffff",
          padding: "0.75rem 1.5rem",
          border: "none",
          borderRadius: "4px",
          fontWeight: 700,
          fontSize: "1rem",
          cursor: "pointer",
        }}
      >
        <span
          aria-hidden="true"
          style={{
            background: "#FFD700",
            color: "#000091",
            fontWeight: 900,
            fontSize: "0.75rem",
            padding: "2px 6px",
            borderRadius: "2px",
          }}
        >
          PRO
        </span>
        S'identifier avec ProConnect
      </button>
      <div style={{ marginTop: "0.5rem" }}>
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
