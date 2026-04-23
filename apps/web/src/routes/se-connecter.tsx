import { createFileRoute, redirect } from "@tanstack/react-router";
import { SignInPage } from "~/features/authentification/se-connecter";

export const Route = createFileRoute("/se-connecter")({
  beforeLoad: ({ context: { session } }) => {
    if (session) {
      throw redirect({ to: "/" });
    }
  },
  component: SignInPage,
});
