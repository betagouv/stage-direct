import type { ReactNode } from "react";

export type FaqEntry = {
  question: string;
  answer: NonNullable<ReactNode>;
};

export const FAQ_CONTENTS: FaqEntry[] = [
  {
    question: "Lorem ipsum dolor sit amet consectetur adipiscing elit ?",
    answer: (
      <>
        <p>Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua :</p>
        <ul>
          <li>
            <p className="fr-m-0">
              <span className="fr-text--bold">Ut enim ad minim veniam</span>&nbsp;: quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            <p className="fr-text--italic">
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.
            </p>
          </li>
          <li>
            <p>
              <span className="fr-text--bold">Excepteur sint occaecat</span> cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
          </li>
          <li>
            <p className="fr-m-0">
              <span className="fr-text--bold">Sed ut perspiciatis unde</span>&nbsp;: omnis iste
              natus error sit voluptatem accusantium doloremque laudantium.
            </p>
          </li>
        </ul>
      </>
    ),
  },
  {
    question: "Quis autem vel eum iure reprehenderit qui in ea voluptate ?",
    answer: (
      <>
        <p>
          Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia
          consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
        </p>
        <p>
          Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci
          velit, sed quia non numquam eius modi tempora incidunt.
        </p>
      </>
    ),
  },
  {
    question: "At vero eos et accusamus et iusto odio dignissimos ducimus ?",
    answer: (
      <>
        <p>
          Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta
          nobis est eligendi optio cumque nihil impedit quo minus id.
        </p>
        <ul>
          <li>Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus.</li>
          <li>Saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.</li>
          <li>Itaque earum rerum hic tenetur a sapiente delectus.</li>
        </ul>
      </>
    ),
  },
  {
    question: "Ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis ?",
    answer: (
      <p>
        Doloribus asperiores repellat. Sed ut perspiciatis unde omnis iste natus error sit
        voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo
        inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
      </p>
    ),
  },
  {
    question: "Quisquam est qui dolorem ipsum quia dolor sit amet consectetur ?",
    answer: (
      <p>
        Adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam
        aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam
        corporis suscipit laboriosam.
      </p>
    ),
  },
];
