import { z } from "zod";
import { merchantTypeValues } from "@/service/merchant-type";

export const merchantSchema = z.object({
  merchantName: z.string().min(1, "กรุณากรอกชื่อร้าน/กิจการ"),
  businessRegistrationNumber: z
    .string()
    .min(1, "กรุณากรอกเลขทะเบียนพาณิชย์"),
  taxId: z
    .string()
    .regex(/^\d{13}$/, "เลขประจำตัวผู้เสียภาษีต้องมี 13 หลัก"),
  merchantType: z.enum(merchantTypeValues, {
    errorMap: () => ({ message: "กรุณาเลือกประเภทธุรกิจ" }),
  }),
  contactName: z.string().min(1, "กรุณากรอกชื่อผู้ติดต่อ"),
  contactEmail: z.string().email("รูปแบบอีเมลไม่ถูกต้อง"),
  contactPhoneNumber: z
    .string()
    .regex(/^(0|\+66)\d{8,9}$/, "กรุณากรอกเบอร์โทรศัพท์ไทยให้ถูกต้อง"),
  businessAddress: z.string().optional(),
  businessActivities: z.array(z.string()).optional(),
  handlesHazardousMaterial: z.boolean().default(false),
  hasAlcoholService: z.boolean().default(false),
  hasFoodPreparation: z.boolean().default(false),
});

export type MerchantFormValues = z.input<typeof merchantSchema>;
export type MerchantSchema = z.output<typeof merchantSchema>;
