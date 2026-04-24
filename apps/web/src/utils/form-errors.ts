export function getFieldErrorMessage(errors: ReadonlyArray<unknown>): string {
  const first = errors[0];
  if (!first) return "";
  if (typeof first === "string") return first;
  if (typeof first === "object" && "message" in first) {
    const msg = (first as { message?: unknown }).message;
    return typeof msg === "string" ? msg : "";
  }
  return "";
}
