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

export function getFieldErrorProps(meta: { isTouched: boolean; errors: ReadonlyArray<unknown> }): {
  state: "error" | undefined;
  stateRelatedMessage: string | undefined;
} {
  const visible = meta.isTouched && meta.errors.length > 0;
  return {
    state: visible ? "error" : undefined,
    stateRelatedMessage: visible ? getFieldErrorMessage(meta.errors) : undefined,
  };
}
