// ============================================================
//  Role Module — Controller
// ============================================================

import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { RoleService } from "./route.service";

const createRole = catchAsync(async (req: Request, res: Response) => {
  const result = await RoleService.createRole(
    req.params.orgId as string,
    req.body,
  );
  sendResponse(res, {
    httpStatusCode: httpStatus.CREATED,
    success: true,
    message: "Custom role created successfully",
    data: result,
  });
});

const getOrgRoles = catchAsync(async (req: Request, res: Response) => {
  const result = await RoleService.getOrgRoles(req.params.orgId as string);
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Organization roles retrieved successfully",
    data: result,
  });
});

const getRoleDetails = catchAsync(async (req: Request, res: Response) => {
  const result = await RoleService.getRoleDetails(
    req.params.orgId as string,
    req.params.roleId as string,
  );
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Role details retrieved successfully",
    data: result,
  });
});

const updateRole = catchAsync(async (req: Request, res: Response) => {
  const result = await RoleService.updateRole(
    req.params.orgId as string,
    req.params.roleId as string,
    req.body,
  );
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Role updated successfully",
    data: result,
  });
});

const deleteRole = catchAsync(async (req: Request, res: Response) => {
  await RoleService.deleteRole(
    req.params.orgId as string,
    req.params.roleId as string,
  );
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Role deleted successfully",
    data: null,
  });
});

export const RoleController = {
  createRole,
  getOrgRoles,
  getRoleDetails,
  updateRole,
  deleteRole,
};
