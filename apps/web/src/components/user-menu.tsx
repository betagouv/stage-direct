import { Button } from "@codegouvfr/react-dsfr/Button";
import { useEffect, useRef, useState } from "react";
import { authClient } from "~/lib/auth-client";

type UserMenuProps = {
  user: { name?: string | null; email: string };
};

export function UserMenu({ user }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const handleSignout = async () => {
    await authClient.signOut();
    window.location.href = "/se-connecter";
  };

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <Button
        priority="tertiary no outline"
        iconId="fr-icon-account-circle-line"
        iconPosition="right"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        {user.name || user.email}
      </Button>
      {open && (
        <div
          role="menu"
          style={{
            position: "absolute",
            right: 0,
            top: "100%",
            background: "var(--background-default-grey)",
            border: "1px solid var(--border-default-grey)",
            minWidth: 220,
            zIndex: 1000,
            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
            padding: "0.5rem 0",
          }}
        >
          <Button
            priority="tertiary no outline"
            iconId="fr-icon-logout-box-r-line"
            onClick={handleSignout}
          >
            Se déconnecter
          </Button>
        </div>
      )}
    </div>
  );
}
