import type { SignUpRole } from "./server/schemas/sign-up";

const ROLES: { value: SignUpRole; label: string }[] = [
  { value: "DCS", label: "DCS" },
  { value: "MDS", label: "MDS" },
  { value: "CRF", label: "CRF" },
];

type RoleTabsProps = {
  value: SignUpRole;
  onChange: (role: SignUpRole) => void;
};

export function RoleTabs({ value, onChange }: RoleTabsProps) {
  return (
    <div role="tablist" aria-label="Type de compte" style={{ display: "inline-flex", gap: "0.5rem" }}>
      {ROLES.map((r) => {
        const selected = r.value === value;
        return (
          <button
            key={r.value}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(r.value)}
            style={{
              padding: "0.5rem 1.25rem",
              border: selected
                ? "1px solid var(--border-action-high-blue-france)"
                : "1px solid transparent",
              background: "transparent",
              color: selected
                ? "var(--text-action-high-blue-france)"
                : "var(--text-default-grey)",
              fontWeight: 700,
              cursor: "pointer",
              borderRadius: "4px",
            }}
          >
            {r.label}
          </button>
        );
      })}
    </div>
  );
}
