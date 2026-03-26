// ============================================================
//  Membership Module — Controller
// ============================================================

import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { MembershipService } from "./membership.service";

const getOrganizationMembers = catchAsync(
  async (req: Request, res: Response) => {
    const result = await MembershipService.getOrganizationMembers(
      req.params.orgId as string,
    );
    sendResponse(res, {
      httpStatusCode: httpStatus.OK,
      success: true,
      message: "Organization members retrieved successfully",
      data: result,
    });
  },
);

const getMemberDetails = catchAsync(async (req: Request, res: Response) => {
  const result = await MembershipService.getMemberDetails(
    req.params.orgId as string,
    req.params.userId as string,
  );
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Member details retrieved successfully",
    data: result,
  });
});

const updateMemberRole = catchAsync(async (req: Request, res: Response) => {
  const result = await MembershipService.updateMemberRole(
    req.user.userId,
    req.params.orgId as string,
    req.params.userId as string,
    req.body.roleId,
  );
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Member role updated successfully",
    data: result,
  });
});

const removeMember = catchAsync(async (req: Request, res: Response) => {
  await MembershipService.removeMember(
    req.user.userId,
    req.params.orgId as string,
    req.params.userId as string,
  );
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Member removed from organization",
    data: null,
  });
});

const leaveOrganization = catchAsync(async (req: Request, res: Response) => {
  await MembershipService.leaveOrganization(
    req.user.userId,
    req.params.orgId as string,
  );
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "You have successfully left the organization",
    data: null,
  });
});

export const MembershipController = {
  getOrganizationMembers,
  getMemberDetails,
  updateMemberRole,
  removeMember,
  leaveOrganization,
};
