import { instance } from "@/lib/instance";
import { apiError } from "@/lib/helper/api-error";

// Authenticated user endpoints. Not a server-action file: the bearer token is attached in the browser.

export interface UserItem {
  uuid: string;
  email: string;
  name?: { th: string; en: string } | null;
  lastName?: { th: string; en: string } | null;
  phoneNumber?: string | null;
  province?: string | null;
  district?: string | null;
  subDistrict?: string | null;
  postalCode?: string | null;
  detail?: string | null;
  status?: string;
}

export interface UpdateUserBody {
  name: { th: string; en: string };
  lastName: { th: string; en: string };
  phoneNumber: string;
  addressDetail?: {
    province: string;
    district: string;
    subDistrict: string;
    postalCode: string;
    detail?: string;
  };
}

const failure = (error: any, fallback: string) => ({
  success: false as const,
  message: apiError(error, fallback),
  status: error?.response?.status as number | undefined,
});

export async function getUser(userId: string) {
  try {
    const response = await instance.get<{ data?: UserItem }>(
      `/api/v1/user/${userId}`,
    );
    return { success: true as const, data: response.data?.data, status: response.status };
  } catch (error: any) {
    return failure(error, "Unable to fetch user");
  }
}

export async function updateUser(userId: string, body: UpdateUserBody) {
  try {
    const response = await instance.patch(
      `/api/v1/user/update/${userId}`,
      body,
    );
    return { success: true as const, data: response.data, status: response.status };
  } catch (error: any) {
    return failure(error, "Unable to update user");
  }
}

export async function deleteUser(userId: string) {
  try {
    const response = await instance.delete(`/api/v1/user/delete/${userId}`);
    return { success: true as const, data: response.data, status: response.status };
  } catch (error: any) {
    return failure(error, "Unable to delete user");
  }
}

// Admin only. The API looks users up by uuid; there is no "list everyone" endpoint.
export async function listUsers(ids: string[], query?: { offset?: number; limit?: number }) {
  try {
    const response = await instance.post<{ data?: UserItem[]; total?: number }>(
      "/api/v1/user/list",
      { ids },
      { params: query },
    );
    return {
      success: true as const,
      data: response.data?.data ?? [],
      total: response.data?.total ?? 0,
      status: response.status,
    };
  } catch (error: any) {
    return { ...failure(error, "Unable to list users"), data: [] as UserItem[] };
  }
}

// Admin only.
export async function createUser(body: UpdateUserBody & { addressDetail: NonNullable<UpdateUserBody["addressDetail"]> }) {
  try {
    const response = await instance.post("/api/v1/user/create", body);
    return { success: true as const, data: response.data, status: response.status };
  } catch (error: any) {
    return failure(error, "Unable to create user");
  }
}
