export enum ELicenseMerchantType {
  FOOD_AND_BEVERAGE = "food_and_beverage",
  HOTEL_AND_ACCOMMODATION = "hotel_and_accommodation",
  TOURISM_AND_TRAVEL = "tourism_and_travel",
  HEALTH_AND_WELLNESS = "health_and_wellness",
  EDUCATION_AND_TRAINING = "education_and_training",
  MANUFACTURING = "manufacturing",
  IMPORT_EXPORT = "import_export",
  TRANSPORT_AND_LOGISTICS = "transport_and_logistics",
  CONSTRUCTION = "construction",
  RETAIL_AND_ECOMMERCE = "retail_and_ecommerce",
  ENVIRONMENTAL_SERVICE = "environmental_service",
  DIGITAL_SERVICE = "digital_service",
  OTHER = "other",
}

export const merchantTypeValues = Object.values(ELicenseMerchantType) as [
  ELicenseMerchantType,
  ...ELicenseMerchantType[],
];

export const merchantTypeOptions = [
  {
    value: ELicenseMerchantType.FOOD_AND_BEVERAGE,
    labelKey: "merchantType.food_and_beverage",
  },
  {
    value: ELicenseMerchantType.HOTEL_AND_ACCOMMODATION,
    labelKey: "merchantType.hotel_and_accommodation",
  },
  {
    value: ELicenseMerchantType.TOURISM_AND_TRAVEL,
    labelKey: "merchantType.tourism_and_travel",
  },
  {
    value: ELicenseMerchantType.HEALTH_AND_WELLNESS,
    labelKey: "merchantType.health_and_wellness",
  },
  {
    value: ELicenseMerchantType.EDUCATION_AND_TRAINING,
    labelKey: "merchantType.education_and_training",
  },
  { value: ELicenseMerchantType.MANUFACTURING, labelKey: "merchantType.manufacturing" },
  { value: ELicenseMerchantType.IMPORT_EXPORT, labelKey: "merchantType.import_export" },
  {
    value: ELicenseMerchantType.TRANSPORT_AND_LOGISTICS,
    labelKey: "merchantType.transport_and_logistics",
  },
  { value: ELicenseMerchantType.CONSTRUCTION, labelKey: "merchantType.construction" },
  {
    value: ELicenseMerchantType.RETAIL_AND_ECOMMERCE,
    labelKey: "merchantType.retail_and_ecommerce",
  },
  {
    value: ELicenseMerchantType.ENVIRONMENTAL_SERVICE,
    labelKey: "merchantType.environmental_service",
  },
  { value: ELicenseMerchantType.DIGITAL_SERVICE, labelKey: "merchantType.digital_service" },
  { value: ELicenseMerchantType.OTHER, labelKey: "merchantType.other" },
] as const;
