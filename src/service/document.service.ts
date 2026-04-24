import { instance } from "@/lib/instance";
import type { DocumentSchema } from "@/schema/document.schema";

export interface DocumentSearchParams {
  merchantUuid?: string;
  documentType?: string;
}

export interface DocumentItem {
  uuid?: string;
  title: string;
  documentType: string;
  fileUrl: string;
  description?: string;
  status?: string;
  submittedBy?: string;
  createdAt?: string;
}

export async function createDocument(body: DocumentSchema) {
  const payload = {
    ...body,
    merchantUuid: body.merchantUuid || undefined,
    submittedBy: body.submittedBy || undefined,
  };

  try {
    const response = await instance.post("/api/v1/document", payload);
    return { success: true, data: response.data, status: response.status };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message ?? "Unable to create document",
      status: error?.response?.status,
    };
  }
}

export async function getDocuments(params?: DocumentSearchParams) {
  try {
    const response = await instance.get<{ data?: DocumentItem[] }>(
      "/api/v1/document",
      { params },
    );
    const documents = Array.isArray(response.data?.data)
      ? response.data.data
      : [];
    return { success: true, data: documents, status: response.status };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message ?? "Unable to fetch documents",
      data: [] as DocumentItem[],
      status: error?.response?.status,
    };
  }
}
