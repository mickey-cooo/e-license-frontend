import { instance } from "@/lib/instance";
import { apiError } from "@/lib/helper/api-error";

export interface AnalyzeLicenseBody {
  merchantType: string;
  businessActivities: string[];
  handlesHazardousMaterial?: boolean;
  hasAlcoholService?: boolean;
  hasFoodPreparation?: boolean;
}

export interface LicenseRecommendation {
  code: string;
  name: string;
  authority: string;
  reason: string;
  note?: string;
}

export interface MerchantTypeInfo {
  code: string;
  label: string;
  description: string;
}

export async function getMerchantTypes() {
  try {
    const response = await instance.get<{ data?: MerchantTypeInfo[] }>(
      "/api/v1/license-advisory/merchant-types",
    );
    return {
      success: true as const,
      data: response.data?.data ?? [],
      status: response.status,
    };
  } catch (error: any) {
    return {
      success: false as const,
      message: apiError(error, "Unable to fetch merchant types"),
      data: [] as MerchantTypeInfo[],
      status: error?.response?.status,
    };
  }
}

export async function analyzeLicenses(body: AnalyzeLicenseBody) {
  try {
    const response = await instance.post<{
      data?: { recommendedLicenses: LicenseRecommendation[] };
    }>("/api/v1/license-advisory/analyze", body);
    return { success: true as const, data: response.data?.data, status: response.status };
  } catch (error: any) {
    return {
      success: false as const,
      message: apiError(error, "Unable to analyze licenses"),
      status: error?.response?.status,
    };
  }
}
