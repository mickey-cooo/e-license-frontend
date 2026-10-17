import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("emailInvalid"),
  password: z
    .string()
    .min(3, "passwordRequired")
    .max(100, "passwordMax"),
});

export type LoginSchema = z.infer<typeof loginSchema>;
