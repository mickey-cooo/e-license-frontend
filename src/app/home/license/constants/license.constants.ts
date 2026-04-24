import { ELicenseMerchantType } from "@/service/merchant-type";

export const merchantTypeDetails: Record<
  ELicenseMerchantType,
  { label: string; description: string }
> = {
  [ELicenseMerchantType.FOOD_AND_BEVERAGE]: {
    label: ELicenseMerchantType.FOOD_AND_BEVERAGE,
    description: ELicenseMerchantType.FOOD_AND_BEVERAGE,
  },
  [ELicenseMerchantType.HOTEL_AND_ACCOMMODATION]: {
    label: ELicenseMerchantType.HOTEL_AND_ACCOMMODATION,
    description: ELicenseMerchantType.HOTEL_AND_ACCOMMODATION,
  },
  [ELicenseMerchantType.TOURISM_AND_TRAVEL]: {
    label: ELicenseMerchantType.TOURISM_AND_TRAVEL,
    description: ELicenseMerchantType.TOURISM_AND_TRAVEL,
  },
  [ELicenseMerchantType.HEALTH_AND_WELLNESS]: {
    label: ELicenseMerchantType.HEALTH_AND_WELLNESS,
    description: ELicenseMerchantType.HEALTH_AND_WELLNESS,
  },
  [ELicenseMerchantType.EDUCATION_AND_TRAINING]: {
    label: ELicenseMerchantType.EDUCATION_AND_TRAINING,
    description: ELicenseMerchantType.EDUCATION_AND_TRAINING,
  },
  [ELicenseMerchantType.MANUFACTURING]: {
    label: ELicenseMerchantType.MANUFACTURING,
    description: ELicenseMerchantType.MANUFACTURING,
  },
  [ELicenseMerchantType.IMPORT_EXPORT]: {
    label: ELicenseMerchantType.IMPORT_EXPORT,
    description: ELicenseMerchantType.IMPORT_EXPORT,
  },
  [ELicenseMerchantType.TRANSPORT_AND_LOGISTICS]: {
    label: ELicenseMerchantType.TRANSPORT_AND_LOGISTICS,
    description: ELicenseMerchantType.TRANSPORT_AND_LOGISTICS,
  },
  [ELicenseMerchantType.CONSTRUCTION]: {
    label: ELicenseMerchantType.CONSTRUCTION,
    description: ELicenseMerchantType.CONSTRUCTION,
  },
  [ELicenseMerchantType.RETAIL_AND_ECOMMERCE]: {
    label: ELicenseMerchantType.RETAIL_AND_ECOMMERCE,
    description: ELicenseMerchantType.RETAIL_AND_ECOMMERCE,
  },
  [ELicenseMerchantType.ENVIRONMENTAL_SERVICE]: {
    label: ELicenseMerchantType.ENVIRONMENTAL_SERVICE,
    description: ELicenseMerchantType.ENVIRONMENTAL_SERVICE,
  },
  [ELicenseMerchantType.DIGITAL_SERVICE]: {
    label: ELicenseMerchantType.DIGITAL_SERVICE,
    description: ELicenseMerchantType.DIGITAL_SERVICE,
  },
  [ELicenseMerchantType.OTHER]: {
    label: ELicenseMerchantType.OTHER,
    description: ELicenseMerchantType.OTHER,
  },
};
