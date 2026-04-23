import type { ReactNode } from "react";

type AuthLayoutProps = {
  children: ReactNode;
};

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
        minHeight: "calc(100vh - 280px)",
      }}
      className="stage-direct-auth-layout"
    >
      <aside
        style={{
          background: "var(--background-action-high-blue-france)",
          color: "var(--text-inverted-blue-france)",
          padding: "4rem 3rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <h1 style={{ color: "inherit", marginBottom: "1.5rem" }}>
          Connectons les futurs magistrats à leurs lieux de formation
        </h1>
        <p style={{ color: "inherit", fontSize: "1.125rem", lineHeight: 1.6 }}>
          <strong>StageDirect</strong> simplifie la gestion des stages et renforce
          l'encadrement des futurs magistrats.
        </p>
      </aside>
      <main style={{ padding: "4rem 3rem", background: "var(--background-default-grey)" }}>
        {children}
      </main>
      <style>{`
        @media (max-width: 768px) {
          .stage-direct-auth-layout {
            grid-template-columns: 1fr !important;
          }
          .stage-direct-auth-layout > aside {
            padding: 2rem 1.5rem !important;
          }
          .stage-direct-auth-layout > main {
            padding: 2rem 1.5rem !important;
          }
        }
      `}</style>
    </div>
  );
}
