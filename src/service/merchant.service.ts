import { instance } from "@/lib/instance";
import { apiError } from "@/lib/helper/api-error";
import type { MerchantSchema } from "@/schema/merchant.schema";
import type {
  AnalyzeLicenseBody,
  LicenseRecommendation,
} from "@/service/license-advisory.service";

export type MerchantStatus = "pending" | "approved" | "rejected";

export interface MerchantItem {
  uuid: string;
  merchantName: string;
  businessRegistrationNumber?: string;
  taxId?: string;
  merchantType?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhoneNumber?: string;
  businessAddress?: string;
  status?: MerchantStatus | string;
  remark?: string;
  licenseAnalysisSnapshot?: {
    result?: { recommendedLicenses?: LicenseRecommendation[] };
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface MerchantQueryParams {
  search?: string;
  status?: string;
  merchantType?: string;
  offset?: number;
  limit?: number;
}

interface ReviewMerchantPayload {
  status: "approved" | "rejected";
  remark?: string;
}

// Backend names the review note `reviewRemark`.
function toMerchantItem(raw: MerchantItem & { reviewRemark?: string | null }) {
  const { reviewRemark, ...rest } = raw;
  return { ...rest, remark: reviewRemark ?? rest.remark } as MerchantItem;
}

export async function createMerchant(body: MerchantSchema) {
  try {
    const response = await instance.post<{
      data?: {
        licenseAnalysis?: { recommendedLicenses?: LicenseRecommendation[] };
      };
    }>("/api/v1/merchant/create", body);
    return { success: true as const, data: response.data, status: response.status };
  } catch (error: any) {
    return {
      success: false as const,
      message: apiError(error, "Unable to create merchant profile"),
      status: error?.response?.status,
    };
  }
}

export async function getMyMerchant() {
  try {
    const response = await instance.get<{ data?: MerchantItem }>(
      "/api/v1/merchant/me",
    );
    return {
      success: true as const,
      data: response.data?.data ? toMerchantItem(response.data.data) : null,
      status: response.status,
    };
  } catch (error: any) {
    return {
      success: false as const,
      message: apiError(error, "Unable to fetch your merchant profile"),
      data: null,
      status: error?.response?.status,
    };
  }
}

// The list endpoint is admin-only (403 for merchants), so merchants fall back to their own profile.
export async function getMerchants(params?: MerchantQueryParams) {
  const { search, ...rest } = params ?? {};
  try {
    const response = await instance.get<{ data?: MerchantItem[] }>(
      "/api/v1/merchant/list",
      { params: { ...rest, name: search, limit: rest.limit ?? 100 } },
    );
    const merchants = Array.isArray(response.data?.data)
      ? response.data.data.map(toMerchantItem)
      : [];
    return { success: true as const, data: merchants, status: response.status };
  } catch (error: any) {
    if (error?.response?.status === 403) {
      const mine = await getMyMerchant();
      return {
        success: true as const,
        data: mine.data ? [mine.data] : ([] as MerchantItem[]),
        status: mine.status,
      };
    }
    return {
      success: false as const,
      message: apiError(error, "Unable to fetch merchants"),
      data: [] as MerchantItem[],
      status: error?.response?.status,
    };
  }
}

export async function getMerchantById(merchantId: string) {
  try {
    const response = await instance.get<{ data?: MerchantItem }>(
      `/api/v1/merchant/${merchantId}`,
    );
    return {
      success: true as const,
      data: response.data?.data ? toMerchantItem(response.data.data) : null,
      status: response.status,
    };
  } catch (error: any) {
    return {
      success: false as const,
      message: apiError(error, "Unable to fetch merchant"),
      data: null,
      status: error?.response?.status,
    };
  }
}

export async function updateMerchant(
  merchantId: string,
  body: Partial<MerchantSchema>,
) {
  try {
    const response = await instance.patch(
      `/api/v1/merchant/update/${merchantId}`,
      body,
    );
    return { success: true as const, data: response.data, status: response.status };
  } catch (error: any) {
    return {
      success: false as const,
      message: apiError(error, "Unable to update merchant"),
      status: error?.response?.status,
    };
  }
}

export async function deleteMerchant(merchantId: string) {
  try {
    const response = await instance.delete(
      `/api/v1/merchant/delete/${merchantId}`,
    );
    return { success: true as const, data: response.data, status: response.status };
  } catch (error: any) {
    return {
      success: false as const,
      message: apiError(error, "Unable to delete merchant"),
      status: error?.response?.status,
    };
  }
}

export async function reviewMerchant(
  merchantId: string,
  body: ReviewMerchantPayload,
) {
  try {
    const response = await instance.patch(
      `/api/v1/merchant/review/${merchantId}`,
      body,
    );
    return { success: true as const, data: response.data, status: response.status };
  } catch (error: any) {
    return {
      success: false as const,
      message: apiError(error, "Unable to update merchant review"),
      status: error?.response?.status,
    };
  }
}

export async function analyzeMerchantLicenses(body: AnalyzeLicenseBody) {
  try {
    const response = await instance.post<{ data?: unknown }>(
      "/api/v1/merchant/analyze-license",
      body,
    );
    return { success: true as const, data: response.data?.data, status: response.status };
  } catch (error: any) {
    return {
      success: false as const,
      message: apiError(error, "Unable to analyze licenses"),
      status: error?.response?.status,
    };
  }
}
