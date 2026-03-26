// ============================================================
//  Invoice Module — Interfaces
// ============================================================

export interface IInvoiceFilters {
  page?: string;
  limit?: string;
  status?: string; // e.g., 'PAID', 'OPEN', 'UNCOLLECTIBLE'
}

export interface IStripeWebhookPayload {
  // This will typically be the raw Buffer from Stripe,
  // but typed here loosely for the parsed event
  id: string;
  type: string;
  data: {
    object: any;
  };
}
