// ============================================================
//  User Module — Interfaces
//  Project : Multi-Tenant SaaS Collaboration Platform
// ============================================================

// ── Request payloads ─────────────────────────────────────────

export interface IUpdateProfilePayload {
  name?: string;
  image?: string;
}

export interface IChangeOwnPasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface IUpdateUserStatusPayload {
  status: "ACTIVE" | "INACTIVE" | "BLOCKED";
}

// ── Query filters ─────────────────────────────────────────────

export interface IUserFilter {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}

// ── Response shapes ───────────────────────────────────────────

export interface IUserProfileResponse {
  id: string;
  name: string;
  email: string;
  image: string | null;
  emailVerified: boolean;
  status: string;
  needPasswordChange: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  memberships: {
    organization: { id: string; name: string; slug: string };
    role: { id: string; name: string };
  }[];
  ownedOrganizations: { id: string; name: string; slug: string }[];
}
