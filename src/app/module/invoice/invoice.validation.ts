// ============================================================
//  Invoice Module — Validation (Zod)
// ============================================================

import { z } from "zod";

const orgInvoiceParamsSchema = z.object({
  params: z.object({
    orgId: z.string("Organization ID is required"),
    invoiceId: z.string().optional(),
  }),
});

const paginationSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    status: z.string().optional(),
  }),
});

export const InvoiceValidation = {
  orgInvoiceParamsSchema,
  paginationSchema,
};
