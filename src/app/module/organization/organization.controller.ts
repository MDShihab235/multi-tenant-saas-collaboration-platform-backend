// ============================================================
//  Organization Module — Controller
//  Project : Multi-Tenant SaaS Collaboration Platform
//  Deps    : express, http-status
// ============================================================

import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { OrganizationService } from "./organization.service";

// ── 1. Create organization ────────────────────────────────────
// POST /api/v1/organizations
// Auth : required
// Body : { name, slug }
// Res  : 201 — new org with owner info and counts
const createOrganization = catchAsync(async (req: Request, res: Response) => {
  const result = await OrganizationService.createOrganization(
    req.user,
    req.body,
  );

  sendResponse(res, {
    httpStatusCode: httpStatus.CREATED,
    success: true,
    message: "Organization created successfully",
    data: result,
  });
});

// ── 2. Get my organizations ───────────────────────────────────
// GET /api/v1/organizations/my
// Auth : required
// Res  : 200 — all orgs the current user is a member of
const getMyOrganizations = catchAsync(async (req: Request, res: Response) => {
  const result = await OrganizationService.getMyOrganizations(req.user);

  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Your organizations fetched successfully",
    data: result,
  });
});

// ── 3. List all organizations — admin ─────────────────────────
// GET /api/v1/organizations?page=1&limit=10&search=acme
// Auth  : admin
// Query : page, limit, search
// Res   : 200 — paginated organization list with meta
const getAllOrganizations = catchAsync(async (req: Request, res: Response) => {
  const filters = {
    page: Number(req.query.page) || 1,
    limit: Number(req.query.limit) || 10,
    search: req.query.search as string | undefined,
  };

  const result = await OrganizationService.getAllOrganizations(filters);

  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Organizations fetched successfully",
    data: result,
  });
});

// ── 4. Get organization by ID ─────────────────────────────────
// GET /api/v1/organizations/:orgId
// Auth  : required — org member only
// Param : orgId
// Res   : 200 — org detail with roles, subscription, and counts
const getOrganizationById = catchAsync(async (req: Request, res: Response) => {
  const { orgId } = req.params;

  const result = await OrganizationService.getOrganizationById(
    orgId as string,
    req.user,
  );

  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Organization fetched successfully",
    data: result,
  });
});

// ── 5. Update organization ────────────────────────────────────
// PATCH /api/v1/organizations/:orgId
// Auth  : required — owner only
// Param : orgId
// Body  : { name?, slug? }
// Res   : 200 — updated org with owner info
const updateOrganization = catchAsync(async (req: Request, res: Response) => {
  const { orgId } = req.params;

  const result = await OrganizationService.updateOrganization(
    orgId as string,
    req.user,
    req.body,
  );

  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Organization updated successfully",
    data: result,
  });
});

// ── 6. Delete organization ────────────────────────────────────
// DELETE /api/v1/organizations/:orgId
// Auth  : required — owner only
// Param : orgId
// Res   : 200 — org and all cascade data permanently removed
const deleteOrganization = catchAsync(async (req: Request, res: Response) => {
  const { orgId } = req.params;

  await OrganizationService.deleteOrganization(orgId as string, req.user);

  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Organization deleted successfully",
    data: null,
  });
});

// ── 7. Get organization stats ─────────────────────────────────
// GET /api/v1/organizations/:orgId/stats
// Auth  : required — org member
// Param : orgId
// Res   : 200 — member, project, task counts + subscription info
const getOrganizationStats = catchAsync(async (req: Request, res: Response) => {
  const { orgId } = req.params;

  const result = await OrganizationService.getOrganizationStats(
    orgId as string,
    req.user,
  );

  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Organization stats fetched successfully",
    data: result,
  });
});

// ─────────────────────────────────────────────────────────────

export const OrganizationController = {
  createOrganization,
  getMyOrganizations,
  getAllOrganizations,
  getOrganizationById,
  updateOrganization,
  deleteOrganization,
  getOrganizationStats,
};
