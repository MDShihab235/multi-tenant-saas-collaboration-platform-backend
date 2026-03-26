// ============================================================
//  File Module — Interfaces
// ============================================================

export interface IUploadFilePayload {
  uploadedBy: string;
  url: string;
  mimeType?: string;
  sizeBytes?: number;
}

export interface IFileFilters {
  page?: string;
  limit?: string;
}
