import dayjs from "dayjs";

export const MONTHS = [
  "JAN.",
  "FÉV.",
  "MARS",
  "AVR.",
  "MAI",
  "JUIN",
  "JUIL.",
  "AOÛT",
  "SEP.",
  "OCT.",
  "NOV.",
  "DÉC.",
];

export function toPct(month: number, day: number): number {
  const year = dayjs().year();
  const date = dayjs(new Date(year, month - 1, day));
  const start = dayjs(new Date(year, 0, 1));
  return (date.diff(start, "day") / 365) * 100;
}

const _today = dayjs();
export const TODAY_PCT = (_today.diff(_today.startOf("year"), "day") / 365) * 100;

export type Block = {
  startMonth: number;
  startDay: number;
  endMonth: number;
  endDay: number;
  weeks: number;
  color: string;
  textColor: string;
};

export type EvaluationData = { type: "comment"; count: number } | { type: "pending" };

export type PlanningItem = {
  id: number;
  name: string;
  dateRange: string;
  responsible: string | null;
  block: Block | null;
  evaluation: EvaluationData | null;
};
