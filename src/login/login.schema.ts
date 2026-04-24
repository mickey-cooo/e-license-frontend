import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("รูปแบบอีเมลไม่ถูกต้อง"),
  password: z
    .string()
    .min(8, "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร")
    .max(100, "รหัสผ่านยาวเกินไป"),
});

export type LoginSchema = z.infer<typeof loginSchema>;
