import { instance } from "@/lib/instance";
import type { MerchantSchema } from "@/schema/merchant.schema";

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
  createdAt?: string;
  updatedAt?: string;
}

export interface MerchantQueryParams {
  search?: string;
  status?: string;
}

interface ReviewMerchantPayload {
  status: "approved" | "rejected";
  remark?: string;
}

export async function createMerchant(body: MerchantSchema) {
  try {
    const response = await instance.post("/api/v1/merchant/create", body);
    return { success: true, data: response.data, status: response.status };
  } catch (error: any) {
    return {
      success: false,
      message:
        error?.response?.data?.message ?? "Unable to create merchant profile",
      status: error?.response?.status,
    };
  }
}

export async function getMerchants(params?: MerchantQueryParams) {
  try {
    const response = await instance.get<{ data?: MerchantItem[] }>(
      "/api/v1/merchant/list",
      { params },
    );
    const merchants = Array.isArray(response.data?.data)
      ? response.data.data
      : [];
    return { success: true, data: merchants, status: response.status };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message ?? "Unable to fetch merchants",
      data: [] as MerchantItem[],
      status: error?.response?.status,
    };
  }
}

export async function deleteMerchant(merchantId: string) {
  try {
    const response = await instance.delete(
      `/api/v1/merchant/delete/${merchantId}`,
    );
    return { success: true, data: response.data, status: response.status };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message ?? "Unable to delete merchant",
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
    return { success: true, data: response.data, status: response.status };
  } catch (error: any) {
    return {
      success: false,
      message:
        error?.response?.data?.message ?? "Unable to update merchant review",
      status: error?.response?.status,
    };
  }
}
