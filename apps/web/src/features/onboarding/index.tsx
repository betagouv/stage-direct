import { AuthLayout } from "../authentification/components/auth-layout";
import { OnboardingForm } from "./onboarding-form";

type OnboardingPageProps = {
  userEmail: string;
  userName: string;
};

export function OnboardingPage({ userEmail, userName }: OnboardingPageProps) {
  return (
    <AuthLayout>
      <OnboardingForm userEmail={userEmail} userName={userName} />
    </AuthLayout>
  );
}
