export interface ICreateAttachmentPayload {
  taskId: string;
  fileUrl: string;
  uploadedBy: string;
  // Note: Actual file processing happens via Multer.
  // This interface represents the data passed to the service after upload.
}
