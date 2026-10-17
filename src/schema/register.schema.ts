import { z } from "zod";

export const registerSchema = z
  .object({
    email: z.string().email("emailInvalid"),
    password: z
      .string()
      .min(8, "passwordMin")
      .max(100, "passwordMax"),
    confirmPassword: z
      .string()
      .min(8, "confirmMin")
      .max(100, "confirmMax"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "passwordMismatch",
  });

export type RegisterSchema = z.infer<typeof registerSchema>;
