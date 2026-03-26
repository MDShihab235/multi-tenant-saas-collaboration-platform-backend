// ============================================================
//  Permission Module — Controller
//  Project : Multi-Tenant SaaS Collaboration Platform
//  Deps    : express, http-status
// ============================================================

import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { PermissionService } from "./permission.service";

// ── 1. Create permission — admin ──────────────────────────────
// POST /api/v1/permissions
// Auth : admin
// Body : { action, resource }
// Res  : 201 — new permission record
const createPermission = catchAsync(async (req: Request, res: Response) => {
  const result = await PermissionService.createPermission(req.body);

  sendResponse(res, {
    httpStatusCode: httpStatus.CREATED,
    success: true,
    message: "Permission created successfully",
    data: result,
  });
});

// ── 2. List all permissions — admin ───────────────────────────
// GET /api/v1/permissions
// Auth : admin
// Res  : 200 — full platform permission catalog sorted by resource → action
const getAllPermissions = catchAsync(async (req: Request, res: Response) => {
  const result = await PermissionService.getAllPermissions();

  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Permissions fetched successfully",
    data: result,
  });
});

// ── 3. Get permission by ID — admin ───────────────────────────
// GET /api/v1/permissions/:permId
// Auth  : admin
// Param : permId
// Res   : 200 — permission detail with role assignment list
const getPermissionById = catchAsync(async (req: Request, res: Response) => {
  const { permId } = req.params;

  const result = await PermissionService.getPermissionById(permId as string);

  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Permission fetched successfully",
    data: result,
  });
});

// ── 4. Update permission — admin ──────────────────────────────
// PATCH /api/v1/permissions/:permId
// Auth  : admin
// Param : permId
// Body  : { action?, resource? }
// Res   : 200 — updated permission record
const updatePermission = catchAsync(async (req: Request, res: Response) => {
  const { permId } = req.params;

  const result = await PermissionService.updatePermission(
    permId as string,
    req.body,
  );

  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Permission updated successfully",
    data: result,
  });
});

// ── 5. Delete permission — admin ──────────────────────────────
// DELETE /api/v1/permissions/:permId
// Auth  : admin
// Param : permId
// Res   : 200 — deleted permission info + count of cascaded role assignments
const deletePermission = catchAsync(async (req: Request, res: Response) => {
  const { permId } = req.params;

  const result = await PermissionService.deletePermission(permId as string);

  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Permission deleted successfully",
    data: result,
  });
});

// ── 6. Assign permission to a role ───────────────────────────
// POST /api/v1/permissions/:orgId/:roleId/assign
// Auth  : required — org member
// Param : orgId, roleId
// Body  : { permissionId }
// Res   : 201 — new RolePermission record with permission + role detail
const assignPermissionToRole = catchAsync(
  async (req: Request, res: Response) => {
    const { orgId, roleId } = req.params;

    const result = await PermissionService.assignPermissionToRole(
      orgId as string,
      roleId as string,
      req.user,
      req.body,
    );

    sendResponse(res, {
      httpStatusCode: httpStatus.CREATED,
      success: true,
      message: "Permission assigned to role successfully",
      data: result,
    });
  },
);

// ── 7. Remove permission from a role ─────────────────────────
// DELETE /api/v1/permissions/:orgId/:roleId/:permId
// Auth  : required — org member
// Param : orgId, roleId, permId
// Res   : 200 — removed permission action + resource labels
const removePermissionFromRole = catchAsync(
  async (req: Request, res: Response) => {
    const { orgId, roleId, permId } = req.params;

    const result = await PermissionService.removePermissionFromRole(
      orgId as string,
      roleId as string,
      permId as string,
      req.user,
    );

    sendResponse(res, {
      httpStatusCode: httpStatus.OK,
      success: true,
      message: "Permission removed from role successfully",
      data: result,
    });
  },
);

// ── 8. List permissions assigned to a role ───────────────────
// GET /api/v1/permissions/:orgId/:roleId
// Auth  : required — org member
// Param : orgId, roleId
// Res   : 200 — role info + flat permissions array + total count
const getRolePermissions = catchAsync(async (req: Request, res: Response) => {
  const { orgId, roleId } = req.params;

  const result = await PermissionService.getRolePermissions(
    orgId as string,
    roleId as string,
    req.user,
  );

  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Role permissions fetched successfully",
    data: result,
  });
});

// ─────────────────────────────────────────────────────────────

export const PermissionController = {
  createPermission,
  getAllPermissions,
  getPermissionById,
  updatePermission,
  deletePermission,
  assignPermissionToRole,
  removePermissionFromRole,
  getRolePermissions,
};
