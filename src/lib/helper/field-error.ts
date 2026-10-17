// Zod schemas carry Validation message keys; translate them where the error is shown.
export function fieldError(
  t: (key: never) => string,
  error?: { message?: string },
) {
  return error?.message ? t(error.message as never) : undefined;
}
