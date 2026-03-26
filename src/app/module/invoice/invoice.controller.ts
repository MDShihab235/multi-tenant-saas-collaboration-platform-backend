// ============================================================
//  Invoice Module — Controller
// ============================================================

import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { InvoiceService } from "./invoice.service";

const getOrgInvoices = catchAsync(async (req: Request, res: Response) => {
  const result = await InvoiceService.getOrgInvoices(
    req.user.userId,
    req.params.orgId as string,
    req.query,
  );
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Organization invoices retrieved successfully",
    data: result,
  });
});

const getInvoiceDetails = catchAsync(async (req: Request, res: Response) => {
  const result = await InvoiceService.getInvoiceDetails(
    req.user.userId,
    req.params.orgId as string,
    req.params.invoiceId as string,
  );
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Invoice details retrieved",
    data: result,
  });
});

const getInvoicePdf = catchAsync(async (req: Request, res: Response) => {
  const result = await InvoiceService.getInvoicePdf(
    req.user.userId,
    req.params.orgId as string,
    req.params.invoiceId as string,
  );
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Invoice PDF URL generated",
    data: result,
  });
});

const stripeWebhookHandler = catchAsync(async (req: Request, res: Response) => {
  // Pass headers and body to service for signature verification
  await InvoiceService.stripeWebhookHandler(req.headers, req.body);

  // Stripe requires a 200 response immediately
  res.status(httpStatus.OK).json({ received: true });
});

const getAllPlatformInvoices = catchAsync(
  async (req: Request, res: Response) => {
    const result = await InvoiceService.getAllPlatformInvoices(req.query);
    sendResponse(res, {
      httpStatusCode: httpStatus.OK,
      success: true,
      message: "Platform invoices retrieved",
      data: result,
    });
  },
);

export const InvoiceController = {
  getOrgInvoices,
  getInvoiceDetails,
  getInvoicePdf,
  stripeWebhookHandler,
  getAllPlatformInvoices,
};
