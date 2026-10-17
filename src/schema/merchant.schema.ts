import { z } from "zod";
import { merchantTypeValues } from "@/service/merchant-type";

export const merchantSchema = z.object({
  merchantName: z.string().min(1, "merchantNameRequired"),
  businessRegistrationNumber: z
    .string()
    .min(1, "registrationRequired"),
  taxId: z
    .string()
    .regex(/^\d{13}$/, "taxIdInvalid"),
  merchantType: z.enum(merchantTypeValues, {
    errorMap: () => ({ message: "merchantTypeRequired" }),
  }),
  contactName: z.string().min(1, "contactNameRequired"),
  contactEmail: z.string().email("contactEmailInvalid"),
  contactPhoneNumber: z
    .string()
    .regex(/^(0|\+66)\d{8,9}$/, "phoneInvalid"),
  businessAddress: z.string().optional(),
  businessActivities: z.array(z.string()).optional(),
  handlesHazardousMaterial: z.boolean().default(false),
  hasAlcoholService: z.boolean().default(false),
  hasFoodPreparation: z.boolean().default(false),
});

export type MerchantFormValues = z.input<typeof merchantSchema>;
export type MerchantSchema = z.output<typeof merchantSchema>;
