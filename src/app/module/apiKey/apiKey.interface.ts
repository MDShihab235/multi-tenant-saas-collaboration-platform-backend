// ============================================================
//  ApiKey Module — Interfaces
// ============================================================

export interface ICreateApiKeyPayload {
  name: string;
  expiresAt?: string; // ISO Date string
}

export interface IUpdateApiKeyPayload {
  name?: string;
  expiresAt?: string | null;
  isActive?: boolean;
}

export interface IApiKeyResponse {
  id: string;
  organizationId: string;
  name: string;
  keyPrefix: string;
  isActive: boolean;
  lastUsedAt: Date | null;
  expiresAt: Date | null;
  createdAt: Date;
}
