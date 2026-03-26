// ============================================================
//  Project Module — Controller
// ============================================================

import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { ProjectService } from "./project.service";

const createProject = catchAsync(async (req: Request, res: Response) => {
  const result = await ProjectService.createProject(
    req.user.userId,
    req.params.orgId as string,
    req.body,
  );
  sendResponse(res, {
    httpStatusCode: httpStatus.CREATED,
    success: true,
    message: "Project created successfully",
    data: result,
  });
});

const getOrgProjects = catchAsync(async (req: Request, res: Response) => {
  const result = await ProjectService.getOrgProjects(
    req.params.orgId as string,
    req.query,
  );
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Organization projects retrieved",
    data: result,
  });
});

const getMyProjects = catchAsync(async (req: Request, res: Response) => {
  const result = await ProjectService.getMyProjects(req.user.userId);
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Your projects retrieved",
    data: result,
  });
});

const getProjectDetails = catchAsync(async (req: Request, res: Response) => {
  const result = await ProjectService.getProjectDetails(
    req.params.orgId as string,
    req.params.projectId as string,
  );
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Project details retrieved",
    data: result,
  });
});

const updateProject = catchAsync(async (req: Request, res: Response) => {
  const result = await ProjectService.updateProject(
    req.params.projectId as string,
    req.body,
  );
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Project updated successfully",
    data: result,
  });
});

const deleteProject = catchAsync(async (req: Request, res: Response) => {
  await ProjectService.deleteProject(req.params.projectId as string);
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Project deleted successfully",
    data: null,
  });
});

const getProjectStats = catchAsync(async (req: Request, res: Response) => {
  const result = await ProjectService.getProjectStats(
    req.params.projectId as string,
  );
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Project statistics retrieved",
    data: result,
  });
});

export const ProjectController = {
  createProject,
  getOrgProjects,
  getMyProjects,
  getProjectDetails,
  updateProject,
  deleteProject,
  getProjectStats,
};
