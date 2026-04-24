import Accordion from "@codegouvfr/react-dsfr/Accordion";
import { FAQ_CONTENTS, type FaqEntry } from "./faq-content";
import styles from "./faq-questions-answers.module.css";

type FaqQuestionsAnswersProps = {
  contents?: FaqEntry[];
};

export function FaqQuestionsAnswers({ contents = FAQ_CONTENTS }: FaqQuestionsAnswersProps) {
  return (
    <div className={styles.accordionContainer}>
      <div className="fr-accordions-group">
        {contents.map((content) => (
          <Accordion key={content.question} label={content.question}>
            {content.answer}
          </Accordion>
        ))}
      </div>
    </div>
  );
}
