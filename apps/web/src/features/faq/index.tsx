import DocumentSearch from "@codegouvfr/react-dsfr/picto/DocumentSearch";
import { FaqQuestionsAnswers } from "./faq-questions-answers";

export function FaqPage() {
  return (
    <div className="fr-container fr-pb-12w fr-pt-4w">
      <div className="fr-flex fr-align-items-center fr-flex-gap-4v fr-mb-2w">
        <DocumentSearch width={62} height={66} />
        <h1 className="fr-mb-0">Foire aux questions</h1>
      </div>
      <FaqQuestionsAnswers />
    </div>
  );
}
