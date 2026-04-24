import { createFileRoute } from "@tanstack/react-router";
import { FaqPage } from "~/features/faq";

export const Route = createFileRoute("/foire-aux-questions")({
  component: FaqPage,
});
