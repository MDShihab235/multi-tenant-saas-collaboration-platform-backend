// ============================================================
//  Plan Module — Interfaces
// ============================================================

export interface ICreatePlanPayload {
  name: string;
  slug: string;
  description?: string;
  priceMonthly: number;
  priceYearly: number;
  isActive?: boolean;
}

export interface IUpdatePlanPayload {
  name?: string;
  price?: number;
  trialDays?: number;
  isActive?: boolean;
}

export interface ICreateFeaturePayload {
  name: string;
  limitValue?: number;
  isEnabled?: boolean;
}

export interface IUpdateFeaturePayload {
  name?: string;
  limitValue?: number;
  isEnabled?: boolean;
}
