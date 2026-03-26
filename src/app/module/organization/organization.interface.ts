// ============================================================
//  Organization Module — Interfaces
//  Project : Multi-Tenant SaaS Collaboration Platform
// ============================================================

// ── Request payloads ─────────────────────────────────────────

export interface ICreateOrganizationPayload {
  name: string;
  slug: string;
}

export interface IUpdateOrganizationPayload {
  name?: string;
  slug?: string;
}

// ── Query filters ─────────────────────────────────────────────

export interface IOrgFilter {
  page?: number;
  limit?: number;
  search?: string;
}

// ── Response shapes ───────────────────────────────────────────

export interface IOrgStatsResponse {
  members: number;
  projects: number;
  tasks: number;
  activeApiKeys: number;
  subscription: {
    status: string;
    plan: string;
  } | null;
}
