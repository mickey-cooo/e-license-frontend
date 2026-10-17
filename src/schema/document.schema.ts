import { z } from "zod";

export const documentSchema = z.object({
  title: z.string().min(1, "กรุณากรอกชื่อเอกสาร"),
  documentType: z.string().min(1, "กรุณากรอกประเภทเอกสาร"),
  fileUrl: z.string().url("กรุณากรอก URL ให้ถูกต้อง"),
  description: z.string().optional(),
  merchantUuid: z
    .string()
    .uuid("merchantUuid ต้องเป็น UUID ที่ถูกต้อง")
    .or(z.literal(""))
    .optional(),
});

export const trackerSchema = z.object({
  merchantUuid: z
    .string()
    .uuid("merchantUuid ต้องเป็น UUID ที่ถูกต้อง")
    .or(z.literal(""))
    .optional(),
  documentType: z.string().optional(),
});

export type DocumentSchema = z.infer<typeof documentSchema>;
export type TrackerSchema = z.infer<typeof trackerSchema>;
