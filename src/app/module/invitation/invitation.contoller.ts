// ============================================================
//  Invitation Module — Controller
// ============================================================

import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { InvitationService } from "./invitation.service";

const sendInvitation = catchAsync(async (req: Request, res: Response) => {
  const result = await InvitationService.sendInvitation(
    req.user.userId,
    req.params.orgId as string,
    req.body,
  );
  sendResponse(res, {
    httpStatusCode: httpStatus.CREATED,
    success: true,
    message: "Invitation sent successfully",
    data: result,
  });
});

const getOrgInvitations = catchAsync(async (req: Request, res: Response) => {
  const result = await InvitationService.getOrgInvitations(
    req.params.orgId as string,
  );
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Pending invitations retrieved",
    data: result,
  });
});

const revokeInvitation = catchAsync(async (req: Request, res: Response) => {
  await InvitationService.revokeInvitation(
    req.user.userId,
    req.params.invitationId as string,
  );
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Invitation revoked successfully",
    data: null,
  });
});

const verifyInvitationToken = catchAsync(
  async (req: Request, res: Response) => {
    const result = await InvitationService.verifyInvitationToken(
      req.params.token as string,
    );
    sendResponse(res, {
      httpStatusCode: httpStatus.OK,
      success: true,
      message: "Token is valid",
      data: result,
    });
  },
);

const acceptInvitation = catchAsync(async (req: Request, res: Response) => {
  const result = await InvitationService.acceptInvitation(req.body.token);
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Invitation accepted. You are now a member.",
    data: result,
  });
});

const declineInvitation = catchAsync(async (req: Request, res: Response) => {
  await InvitationService.declineInvitation(req.body.token);
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Invitation declined",
    data: null,
  });
});

export const InvitationController = {
  sendInvitation,
  getOrgInvitations,
  revokeInvitation,
  verifyInvitationToken,
  acceptInvitation,
  declineInvitation,
};
