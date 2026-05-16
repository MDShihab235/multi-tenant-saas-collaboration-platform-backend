// ============================================================
//  Subscription Module — Interfaces
// ============================================================

export type BillingCycle = "MONTHLY" | "YEARLY";

export interface ISubscribePayload {
  planId: string;
  billingCycle: BillingCycle;
}

export interface IChangePlanPayload {
  planId: string;
}

export interface IChangeBillingCyclePayload {
  billingCycle: BillingCycle;
}
// export type InvoiceStatus =
//   | "DRAFT"
//   | "OPEN"
//   | "PAID"
//   | "UNCOLLECTIBLE"
//   | "VOID";

// export interface ICreateInvoiceInput {
//   subscriptionId: string;
//   status: InvoiceStatus;
//   amountDue: number;
//   amountPaid: number;
//   currency: string;
//   periodStart: Date;
//   periodEnd: Date;
//   paidAt?: Date;
//   stripeInvoiceId?: string;
//   invoicePdfUrl?: string;
// }
