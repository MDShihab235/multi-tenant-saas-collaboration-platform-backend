import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { ProjectMemberService } from "./projectMember.service";

const getProjectMembers = catchAsync(async (req: Request, res: Response) => {
  const result = await ProjectMemberService.getProjectMembers(
    req.params.projectId as string,
  );
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Project members retrieved",
    data: result,
  });
});

const addMemberToProject = catchAsync(async (req: Request, res: Response) => {
  const result = await ProjectMemberService.addMemberToProject(
    req.params.projectId as string,
    req.body,
  );
  sendResponse(res, {
    httpStatusCode: httpStatus.CREATED,
    success: true,
    message: "Member added to project",
    data: result,
  });
});

const updateMemberRole = catchAsync(async (req: Request, res: Response) => {
  const result = await ProjectMemberService.updateMemberRole(
    req.params.projectId as string,
    req.params.userId as string,
    req.body.role,
  );
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Member role updated",
    data: result,
  });
});

const removeMember = catchAsync(async (req: Request, res: Response) => {
  await ProjectMemberService.removeMember(
    req.params.projectId as string,
    req.params.userId as string,
  );
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Member removed from project",
    data: null,
  });
});

const leaveProject = catchAsync(async (req: Request, res: Response) => {
  await ProjectMemberService.leaveProject(
    req.user.userId,
    req.params.projectId as string,
  );
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Left the project successfully",
    data: null,
  });
});

export const ProjectMemberController = {
  getProjectMembers,
  addMemberToProject,
  updateMemberRole,
  removeMember,
  leaveProject,
};
