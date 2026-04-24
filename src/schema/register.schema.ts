import { z } from "zod";

export const registerSchema = z
  .object({
    email: z.string().email("กรุณากรอกอีเมลให้ถูกต้อง"),
    password: z
      .string()
      .min(8, "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร")
      .max(100, "รหัสผ่านยาวเกินไป"),
    confirmPassword: z
      .string()
      .min(8, "ยืนยันรหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร")
      .max(100, "ยืนยันรหัสผ่านยาวเกินไป"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน",
  });

export type RegisterSchema = z.infer<typeof registerSchema>;
