import { createFileRoute, redirect } from "@tanstack/react-router";
import { SignUpPage } from "~/features/authentification/s-inscrire";

export const Route = createFileRoute("/s-inscrire")({
  beforeLoad: ({ context: { session } }) => {
    if (session) {
      throw redirect({ to: "/" });
    }
  },
  component: SignUpPage,
});
