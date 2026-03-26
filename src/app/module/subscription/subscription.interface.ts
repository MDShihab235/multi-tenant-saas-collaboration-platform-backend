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
