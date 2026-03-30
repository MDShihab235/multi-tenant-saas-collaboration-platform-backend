// ============================================================
//  Invoice Module — Routes
//  Base    : /api/v1/invoices
// ============================================================

import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { InvoiceController } from "./invoice.controller";
import { InvoiceValidation } from "./invoice.validation";

const router = Router();

// 4. Stripe webhook handler — processes payment events (Public)
// NOTE: Ensure this route is positioned BEFORE any express.json() middleware in your app.ts
// or use express.raw() specifically for this route so Stripe signature verification works.
// router.post("/webhook", InvoiceController.stripeWebhookHandler);

// 5. List all invoices platform-wide (super-admin only)
router.get(
  "/",
  checkAuth(),
  validateRequest(InvoiceValidation.paginationSchema),
  InvoiceController.getAllPlatformInvoices,
);

// 1. List all invoices for an org — paginated
router.get(
  "/:orgId",
  checkAuth(),
  validateRequest(InvoiceValidation.orgInvoiceParamsSchema),
  validateRequest(InvoiceValidation.paginationSchema),
  InvoiceController.getOrgInvoices,
);

// 2. Get invoice details with period and amounts
router.get(
  "/:orgId/:invoiceId",
  checkAuth(),
  validateRequest(InvoiceValidation.orgInvoiceParamsSchema),
  InvoiceController.getInvoiceDetails,
);

// 3. Get signed URL to download invoice PDF
router.get(
  "/:orgId/:invoiceId/pdf",
  checkAuth(),
  validateRequest(InvoiceValidation.orgInvoiceParamsSchema),
  InvoiceController.getInvoicePdf,
);

export const InvoiceRoutes = router;
