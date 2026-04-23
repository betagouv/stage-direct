import { AuthLayout } from "../components/auth-layout";
import { SignUpForm } from "./sign-up-form";

export function SignUpPage() {
  return (
    <AuthLayout>
      <SignUpForm />
    </AuthLayout>
  );
}
