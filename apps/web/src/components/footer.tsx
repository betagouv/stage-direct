import { Footer as DsfrFooter } from "@codegouvfr/react-dsfr/Footer";
import { BrandTop } from "./brand-top";

export function Footer() {
  return (
    <DsfrFooter
      brandTop={<BrandTop />}
      homeLinkProps={{ href: "/", title: "Stage Direct" }}
      accessibility="non compliant"
      contentDescription={
        <>
          <span className="fr-text--bold">Stage Direct</span>
          <br />
          Connectons les futurs magistrats à leurs lieux de formation
        </>
      }
    />
  );
}
