// ============================================================
//  Plan Module — Controller
// ============================================================

import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { PlanService } from "./plan.service";

const getActivePlans = catchAsync(async (req: Request, res: Response) => {
  const result = await PlanService.getActivePlans();
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Active plans retrieved successfully",
    data: result,
  });
});

const getPlanDetails = catchAsync(async (req: Request, res: Response) => {
  const result = await PlanService.getPlanDetails(req.params.planId as string);
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Plan details retrieved",
    data: result,
  });
});

const createPlan = catchAsync(async (req: Request, res: Response) => {
  const result = await PlanService.createPlan(req.body);
  sendResponse(res, {
    httpStatusCode: httpStatus.CREATED,
    success: true,
    message: "Plan created successfully",
    data: result,
  });
});

const updatePlan = catchAsync(async (req: Request, res: Response) => {
  const result = await PlanService.updatePlan(
    req.params.planId as string,
    req.body,
  );
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Plan updated successfully",
    data: result,
  });
});

const deactivatePlan = catchAsync(async (req: Request, res: Response) => {
  await PlanService.deactivatePlan(req.params.planId as string);
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Plan deactivated successfully",
    data: null,
  });
});

const addPlanFeature = catchAsync(async (req: Request, res: Response) => {
  const result = await PlanService.addPlanFeature(
    req.params.planId as string,
    req.body,
  );
  sendResponse(res, {
    httpStatusCode: httpStatus.CREATED,
    success: true,
    message: "Plan feature added successfully",
    data: result,
  });
});

const getPlanFeatures = catchAsync(async (req: Request, res: Response) => {
  const result = await PlanService.getPlanFeatures(req.params.planId as string);
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Plan features retrieved",
    data: result,
  });
});

const updatePlanFeature = catchAsync(async (req: Request, res: Response) => {
  const result = await PlanService.updatePlanFeature(
    req.params.planId as string,
    req.params.featureId as string,
    req.body,
  );
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Plan feature updated successfully",
    data: result,
  });
});

const removePlanFeature = catchAsync(async (req: Request, res: Response) => {
  await PlanService.removePlanFeature(
    req.params.planId as string,
    req.params.featureId as string,
  );
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Plan feature removed successfully",
    data: null,
  });
});

export const PlanController = {
  getActivePlans,
  getPlanDetails,
  createPlan,
  updatePlan,
  deactivatePlan,
  addPlanFeature,
  getPlanFeatures,
  updatePlanFeature,
  removePlanFeature,
};
