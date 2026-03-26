// ============================================================
//  ApiKey Module — Controller
// ============================================================

import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { ApiKeyService } from "./apiKey.service";

const createApiKey = catchAsync(async (req: Request, res: Response) => {
  const result = await ApiKeyService.createApiKey(
    req.user.userId,
    req.params.orgId as string,
    req.body,
  );
  sendResponse(res, {
    httpStatusCode: httpStatus.CREATED,
    success: true,
    message:
      "API Key generated successfully. Please copy it now, it won't be shown again.",
    data: result,
  });
});

const getOrgApiKeys = catchAsync(async (req: Request, res: Response) => {
  const result = await ApiKeyService.getOrgApiKeys(
    req.user.userId,
    req.params.orgId as string,
  );
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Organization API keys retrieved successfully",
    data: result,
  });
});

const getApiKeyDetails = catchAsync(async (req: Request, res: Response) => {
  const result = await ApiKeyService.getApiKeyDetails(
    req.user.userId,
    req.params.orgId as string,
    req.params.keyId as string,
  );
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "API key details retrieved",
    data: result,
  });
});

const updateApiKey = catchAsync(async (req: Request, res: Response) => {
  const result = await ApiKeyService.updateApiKey(
    req.user.userId,
    req.params.orgId as string,
    req.params.keyId as string,
    req.body,
  );
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "API key updated successfully",
    data: result,
  });
});

const rotateApiKey = catchAsync(async (req: Request, res: Response) => {
  const result = await ApiKeyService.rotateApiKey(
    req.user.userId,
    req.params.orgId as string,
    req.params.keyId as string,
  );
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "API key rotated successfully. Please copy your new key.",
    data: result,
  });
});

const deleteApiKey = catchAsync(async (req: Request, res: Response) => {
  await ApiKeyService.deleteApiKey(
    req.user.userId,
    req.params.orgId as string,
    req.params.keyId as string,
  );
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "API key permanently revoked and deleted",
    data: null,
  });
});

export const ApiKeyController = {
  createApiKey,
  getOrgApiKeys,
  getApiKeyDetails,
  updateApiKey,
  rotateApiKey,
  deleteApiKey,
};
