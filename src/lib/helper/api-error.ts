// Backend errors arrive as { message: string | string[] }; ValidationPipe sends an array.
export function apiError(error: any, fallback: string) {
  const message = error?.response?.data?.message;
  if (Array.isArray(message)) return message.join(", ");
  return message ?? fallback;
}
