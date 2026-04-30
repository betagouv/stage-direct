import { startReactDsfr } from "@codegouvfr/react-dsfr/spa";
import { Link as RouterLink } from "@tanstack/react-router";
import type { AnchorHTMLAttributes } from "react";

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & { href: string };

function isExternal(href: string): boolean {
  return (
    /^https?:\/\//.test(href) ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:") ||
    href.startsWith("#")
  );
}

export function DsfrLink({ href, target, ...rest }: Props) {
  if (target === "_blank" || isExternal(href)) {
    return <a href={href} target={target} {...rest} />;
  }
  // biome-ignore lint/suspicious/noExplicitAny: DSFR linkProps use arbitrary string hrefs that TanStack Router's literal-typed `to` rejects.
  return <RouterLink to={href as any} target={target} {...rest} />;
}

declare module "@codegouvfr/react-dsfr/link" {
  interface RegisterLink {
    Link: typeof DsfrLink;
  }
}

if (typeof window !== "undefined") {
  startReactDsfr({
    defaultColorScheme: "system",
    Link: DsfrLink,
  });
}
