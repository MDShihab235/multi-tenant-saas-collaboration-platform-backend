// ============================================================
//  Permission Module — Interfaces
//  Project : Multi-Tenant SaaS Collaboration Platform
// ============================================================

// ── Request payloads ─────────────────────────────────────────

export interface ICreatePermissionPayload {
  action: string;
  resource: string;
}

export interface IUpdatePermissionPayload {
  action?: string;
  resource?: string;
}

export interface IAssignPermissionPayload {
  permissionId: string;
}

// ── Response shapes ───────────────────────────────────────────

export interface IPermissionResponse {
  id: string;
  action: string;
  resource: string;
}

export interface IRolePermissionResponse {
  roleId: string;
  permissionId: string;
  permission: IPermissionResponse;
}
