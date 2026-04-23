import styles from "./role-tabs.module.css";
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
    <div role="tablist" aria-label="Type de compte" className={styles.tablist}>
      {ROLES.map((r) => (
        <button
          key={r.value}
          type="button"
          role="tab"
          aria-selected={r.value === value}
          onClick={() => onChange(r.value)}
          className={styles.tab}
        >
          {r.label}
        </button>
      ))}
    </div>
  );
}
