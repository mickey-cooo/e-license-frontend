import { z } from "zod";

export const documentSchema = z.object({
  title: z.string().min(1, "titleRequired"),
  documentType: z.string().min(1, "documentTypeRequired"),
  fileUrl: z.string().url("urlInvalid"),
  description: z.string().optional(),
  merchantUuid: z
    .string()
    .uuid("merchantUuidInvalid")
    .or(z.literal(""))
    .optional(),
});

export const trackerSchema = z.object({
  merchantUuid: z
    .string()
    .uuid("merchantUuidInvalid")
    .or(z.literal(""))
    .optional(),
  documentType: z.string().optional(),
});

export type DocumentSchema = z.infer<typeof documentSchema>;
export type TrackerSchema = z.infer<typeof trackerSchema>;
