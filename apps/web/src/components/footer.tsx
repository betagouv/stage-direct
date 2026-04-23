import { Footer as DsfrFooter } from "@codegouvfr/react-dsfr/Footer";

const BRAND_TOP = (
  <>
    MINISTÈRE
    <br />
    DE LA JUSTICE
  </>
);

export function Footer() {
  return (
    <DsfrFooter
      brandTop={BRAND_TOP}
      homeLinkProps={{ href: "/", title: "Stage Direct" }}
      accessibility="non compliant"
      contentDescription={
        <>
          <span style={{ fontWeight: "bold" }}>Stage Direct</span>
          <br />
          Connectons les futurs magistrats à leurs lieux de formation
        </>
      }
    />
  );
}
