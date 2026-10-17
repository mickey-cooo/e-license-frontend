import { instance } from "@/lib/instance";
import { apiError } from "@/lib/helper/api-error";
import type { DocumentSchema } from "@/schema/document.schema";

export interface DocumentSearchParams {
  merchantUuid?: string;
  documentType?: string;
  status?: string;
  keyword?: string;
  offset?: number;
  limit?: number;
}

export interface DocumentItem {
  uuid?: string;
  title: string;
  documentType: string;
  fileUrl: string;
  description?: string;
  status?: string;
  submittedBy?: string;
  merchantUuid?: string | null;
  createdAt?: string;
}

export interface DocumentProgressItem {
  uuid?: string;
  status?: string;
  note?: string;
  createdAt?: string;
}

const failure = (error: any, fallback: string) => ({
  success: false as const,
  message: apiError(error, fallback),
  status: error?.response?.status as number | undefined,
});

export async function createDocument(body: DocumentSchema) {
  // submittedBy is taken from the token server-side; the API rejects unknown fields.
  const payload = {
    title: body.title,
    documentType: body.documentType,
    fileUrl: body.fileUrl,
    description: body.description || undefined,
    merchantUuid: body.merchantUuid || undefined,
  };

  try {
    const response = await instance.post(
      "/api/v1/document-workflow/create",
      payload,
    );
    return { success: true as const, data: response.data, status: response.status };
  } catch (error: any) {
    return failure(error, "Unable to create document");
  }
}

export async function getDocuments(params?: DocumentSearchParams) {
  // The API filters only by status and keyword; merchant and type narrow client-side.
  const { merchantUuid, documentType, ...query } = params ?? {};
  try {
    const response = await instance.get<{
      data?: DocumentItem[];
      total?: number;
    }>("/api/v1/document-workflow/list", {
      params: { ...query, limit: query.limit ?? 100 },
    });
    const documents = (
      Array.isArray(response.data?.data) ? response.data.data : []
    ).filter(
      (doc) =>
        (!merchantUuid || doc.merchantUuid === merchantUuid) &&
        (!documentType ||
          doc.documentType?.toLowerCase().includes(documentType.toLowerCase())),
    );
    return {
      success: true as const,
      data: documents,
      total: response.data?.total ?? documents.length,
      status: response.status,
    };
  } catch (error: any) {
    return {
      ...failure(error, "Unable to fetch documents"),
      data: [] as DocumentItem[],
      total: 0,
    };
  }
}

export async function getDocumentById(documentId: string) {
  try {
    const response = await instance.get<{ data?: DocumentItem }>(
      `/api/v1/document-workflow/${documentId}`,
    );
    return { success: true as const, data: response.data?.data, status: response.status };
  } catch (error: any) {
    return failure(error, "Unable to fetch document");
  }
}

export async function getDocumentProgress(documentId: string) {
  try {
    const response = await instance.get<{ data?: DocumentProgressItem[] }>(
      `/api/v1/document-workflow/progress/${documentId}`,
    );
    return {
      success: true as const,
      data: response.data?.data ?? [],
      status: response.status,
    };
  } catch (error: any) {
    return {
      ...failure(error, "Unable to fetch document progress"),
      data: [] as DocumentProgressItem[],
    };
  }
}

export async function updateDocument(
  documentId: string,
  body: Partial<DocumentSchema>,
) {
  try {
    const response = await instance.patch(
      `/api/v1/document-workflow/update/${documentId}`,
      body,
    );
    return { success: true as const, data: response.data, status: response.status };
  } catch (error: any) {
    return failure(error, "Unable to update document");
  }
}

export async function deleteDocument(documentId: string) {
  try {
    const response = await instance.delete(
      `/api/v1/document-workflow/delete/${documentId}`,
    );
    return { success: true as const, data: response.data, status: response.status };
  } catch (error: any) {
    return failure(error, "Unable to delete document");
  }
}

// Admin only.
export async function forwardDocument(documentId: string, note?: string) {
  try {
    const response = await instance.patch(
      `/api/v1/document-workflow/forward/${documentId}`,
      { note },
    );
    return { success: true as const, data: response.data, status: response.status };
  } catch (error: any) {
    return failure(error, "Unable to forward document");
  }
}

// Admin only.
export async function updateDocumentStatus(
  documentId: string,
  body: { status: string; note?: string },
) {
  try {
    const response = await instance.patch(
      `/api/v1/document-workflow/status/${documentId}`,
      body,
    );
    return { success: true as const, data: response.data, status: response.status };
  } catch (error: any) {
    return failure(error, "Unable to update document status");
  }
}
