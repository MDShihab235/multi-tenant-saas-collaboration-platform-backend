// ============================================================
//  File Module — Routes
//  Base    : /api/v1/files
// ============================================================

import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth"; //
import { validateRequest } from "../../middleware/validateRequest";
import { upload } from "../../middleware/upload"; // Assuming this uses multer + Cloudinary
import { FileController } from "./file.controller";
import { FileValidation } from "./file.validation";

const router = Router();

// 1. Upload a file — store object + metadata (multipart)
router.post(
  "/upload",
  checkAuth(),
  upload.single("file"), // Multer middleware handling Cloudinary upload
  FileController.uploadFile,
);

// 2. List all files uploaded by current user
router.get(
  "/my",
  checkAuth(),
  validateRequest(FileValidation.paginationSchema),
  FileController.getMyFiles,
);

// 5. List all files platform-wide (super-admin only)
// Note: Assuming 'SUPER_ADMIN' is part of your Role enum used in checkAuth
router.get(
  "/",
  checkAuth(),
  validateRequest(FileValidation.paginationSchema),
  FileController.getAllPlatformFiles,
);

// 3. Get file metadata and signed download URL
router.get(
  "/:fileId",
  checkAuth(),
  validateRequest(FileValidation.fileIdParamSchema),
  FileController.getFileDetails,
);

// 4. Delete file record and its stored object
router.delete(
  "/:fileId",
  checkAuth(),
  validateRequest(FileValidation.fileIdParamSchema),
  FileController.deleteFile,
);

export const FileRoutes = router;
