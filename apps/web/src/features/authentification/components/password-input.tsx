import { Button } from "@codegouvfr/react-dsfr/Button";
import { Input, type InputProps } from "@codegouvfr/react-dsfr/Input";
import clsx from "clsx";
import { useState } from "react";
import styles from "./password-input.module.css";

type NativeInput = NonNullable<
  Extract<InputProps, { nativeTextAreaProps?: undefined | never }>["nativeInputProps"]
>;

type PasswordInputProps = {
  label: React.ReactNode;
  hintText?: string;
  classes?: InputProps["classes"];
  state?: "default" | "error" | "success" | "info";
  stateRelatedMessage?: string;
  nativeInputProps?: Omit<NativeInput, "type">;
};

export function PasswordInput({
  label,
  hintText,
  classes,
  state,
  stateRelatedMessage,
  nativeInputProps,
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);
  return (
    <Input
      classes={{ ...classes, root: clsx(classes?.root, styles.root) }}
      label={label}
      hintText={hintText}
      state={state}
      stateRelatedMessage={stateRelatedMessage}
      nativeInputProps={{
        ...nativeInputProps,
        type: visible ? "text" : "password",
      }}
      addon={
        <Button
          type="button"
          priority="tertiary"
          iconId={visible ? "fr-icon-eye-off-line" : "fr-icon-eye-line"}
          title={visible ? "Masquer le mot de passe" : "Afficher le mot de passe"}
          onClick={() => setVisible((v) => !v)}
        />
      }
    />
  );
}
