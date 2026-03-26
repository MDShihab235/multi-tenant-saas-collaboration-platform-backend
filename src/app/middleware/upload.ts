// ============================================================
//  Upload Middleware (Cloudinary Integration)
//  Project : Multi-Tenant SaaS Collaboration Platform
// ============================================================

import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import httpStatus from "http-status";
import AppError from "../errorHelpers/AppError";
import { cloudinaryUpload } from "../config/cloudinary.config"; // Adjust path if necessary

// Configure Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinaryUpload,
  params: async (req, file) => {
    const originalName = file.originalname;
    const extension = originalName.split(".").pop()?.toLowerCase();

    // Sanitize file name
    const fileNameWithoutExtension = originalName
      .split(".")
      .slice(0, -1)
      .join(".")
      .toLowerCase()
      .replace(/\s+/g, "-")
      // eslint-disable-next-line no-useless-escape
      .replace(/[^a-z0-9\-]/g, "");

    // Generate unique identifier
    const uniqueName =
      Math.random().toString(36).substring(2) +
      "-" +
      Date.now() +
      "-" +
      fileNameWithoutExtension;

    // Route PDFs to a specific folder, otherwise images/docs
    const folder = extension === "pdf" ? "pdfs" : "images";

    return {
      folder: `collab-pro/${folder}`, // Using the collab-pro folder structure
      public_id: uniqueName,
      resource_type: "auto", // Crucial for non-image files like PDFs
    };
  },
});

// File filter (restrict allowed MIME types)
const fileFilter = (
  req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
    "text/plain",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        httpStatus.BAD_REQUEST,
        "Unsupported file format. Please upload images (JPEG/PNG/WebP), PDFs, or Docs.",
      ),
    );
  }
};

// Initialize multer with storage, limits, and filter
export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Limit to 5 MB
  },
  fileFilter,
});
