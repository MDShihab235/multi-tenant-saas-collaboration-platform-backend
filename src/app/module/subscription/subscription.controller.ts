// ============================================================
//  Subscription Module — Controller
// ============================================================

import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { SubscriptionService } from "./subscription.service";

const subscribe = catchAsync(async (req: Request, res: Response) => {
  const result = await SubscriptionService.subscribe(
    req.user.userId,
    req.params.orgId as string,
    req.body,
  );
  sendResponse(res, {
    httpStatusCode: httpStatus.CREATED,
    success: true,
    message: "Subscription created successfully",
    data: result,
  });
});

const getSubscription = catchAsync(async (req: Request, res: Response) => {
  const result = await SubscriptionService.getSubscription(
    req.user.userId,
    req.params.orgId as string,
  );
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Subscription retrieved",
    data: result,
  });
});

const getUsage = catchAsync(async (req: Request, res: Response) => {
  const result = await SubscriptionService.getUsage(
    req.user.userId,
    req.params.orgId as string,
  );
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Usage metrics retrieved",
    data: result,
  });
});

const upgradeSubscription = catchAsync(async (req: Request, res: Response) => {
  const result = await SubscriptionService.upgradeSubscription(
    req.user.userId,
    req.params.orgId as string,
    req.body.planId,
  );
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Subscription upgraded successfully",
    data: result,
  });
});

const downgradeSubscription = catchAsync(
  async (req: Request, res: Response) => {
    const result = await SubscriptionService.downgradeSubscription(
      req.user.userId,
      req.params.orgId as string,
      req.body.planId,
    );
    sendResponse(res, {
      httpStatusCode: httpStatus.OK,
      success: true,
      message: "Subscription downgraded successfully",
      data: result,
    });
  },
);

const changeBillingCycle = catchAsync(async (req: Request, res: Response) => {
  const result = await SubscriptionService.changeBillingCycle(
    req.user.userId,
    req.params.orgId as string,
    req.body.billingCycle,
  );
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Billing cycle updated",
    data: result,
  });
});

const cancelSubscription = catchAsync(async (req: Request, res: Response) => {
  const result = await SubscriptionService.cancelSubscription(
    req.user.userId,
    req.params.orgId as string,
  );
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Subscription scheduled for cancellation",
    data: result,
  });
});

const reactivateSubscription = catchAsync(
  async (req: Request, res: Response) => {
    const result = await SubscriptionService.reactivateSubscription(
      req.user.userId,
      req.params.orgId as string,
    );
    sendResponse(res, {
      httpStatusCode: httpStatus.OK,
      success: true,
      message: "Subscription reactivated",
      data: result,
    });
  },
);

export const SubscriptionController = {
  subscribe,
  getSubscription,
  getUsage,
  upgradeSubscription,
  downgradeSubscription,
  changeBillingCycle,
  cancelSubscription,
  reactivateSubscription,
};
