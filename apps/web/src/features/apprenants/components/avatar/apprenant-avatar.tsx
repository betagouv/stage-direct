import { getInitials } from "../../helpers";
import styles from "./apprenant-avatar.module.css";

type Props = {
  prenom: string;
  nom: string;
};

export function ApprenantAvatar({ prenom, nom }: Props) {
  return (
    <span className={styles.avatar} aria-hidden="true">
      {getInitials(prenom, nom)}
    </span>
  );
}
