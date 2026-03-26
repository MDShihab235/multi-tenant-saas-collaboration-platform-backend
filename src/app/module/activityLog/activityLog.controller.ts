import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { ActivityLogService } from "./activityLog.service";

const getOrgLogs = catchAsync(async (req: Request, res: Response) => {
  const result = await ActivityLogService.getOrgLogs(
    req.params.orgId as string,
    req.query,
  );
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Activity logs retrieved",
    data: result,
  });
});

const filterLogs = catchAsync(async (req: Request, res: Response) => {
  const result = await ActivityLogService.filterLogs(
    req.params.orgId as string,
    req.query,
  );
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Filtered logs retrieved",
    data: result,
  });
});

const getLogById = catchAsync(async (req: Request, res: Response) => {
  const result = await ActivityLogService.getLogById(
    req.params.orgId as string,
    req.params.logId as string,
  );
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Log entry retrieved",
    data: result,
  });
});

const purgeLogs = catchAsync(async (req: Request, res: Response) => {
  const result = await ActivityLogService.purgeLogs(
    req.user.userId,
    req.params.orgId as string,
    req.body.days,
  );
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: `Successfully purged ${result.count} old log entries`,
    data: result,
  });
});

export const ActivityLogController = {
  getOrgLogs,
  filterLogs,
  getLogById,
  purgeLogs,
};
