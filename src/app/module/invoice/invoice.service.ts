// ============================================================
//  Invoice Module — Service
// ============================================================

import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
// import Stripe from "stripe";
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, { apiVersion: "2023-10-16" });

// Helper: Ensure user has billing access (Owner/Admin)
const verifyBillingAccess = async (userId: string, orgId: string) => {
  const membership = await prisma.membership.findFirst({
    where: {
      organizationId: orgId,
      userId: userId,
      role: { name: { in: ["OWNER", "ADMIN"] } },
    },
  });
  if (!membership)
    throw new AppError(
      status.FORBIDDEN,
      "Only organization administrators can view billing information",
    );
};

const getOrgInvoices = async (userId: string, orgId: string, query: any) => {
  await verifyBillingAccess(userId, orgId);

  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const whereClause: any = { organizationId: orgId };
  if (query.status) whereClause.status = query.status;

  const [invoices, total] = await Promise.all([
    prisma.invoice.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.invoice.count({ where: whereClause }),
  ]);

  return { meta: { page, limit, total }, data: invoices };
};

const getInvoiceDetails = async (
  userId: string,
  orgId: string,
  invoiceId: string,
) => {
  await verifyBillingAccess(userId, orgId);

  const invoice = await prisma.invoice.findFirst({
    where: { id: invoiceId, subscriptionId: orgId },
    include: { subscription: true },
  });

  if (!invoice) throw new AppError(status.NOT_FOUND, "Invoice not found");
  return invoice;
};

const getInvoicePdf = async (
  userId: string,
  orgId: string,
  invoiceId: string,
) => {
  await verifyBillingAccess(userId, orgId);

  const invoice = await prisma.invoice.findFirst({
    where: { id: invoiceId, subscriptionId: orgId },
  });

  if (!invoice) throw new AppError(status.NOT_FOUND, "Invoice not found");
  if (!invoice.invoicePdfUrl)
    throw new AppError(status.NOT_FOUND, "PDF not available for this invoice");

  // If using a private S3 bucket, generate a signed URL here.
  // If the URL from Stripe is public/secure, just return it.
  return { downloadUrl: invoice.invoicePdfUrl };
};

const stripeWebhookHandler = async (headers: any, rawBody: any) => {
  // const sig = headers["stripe-signature"];
  // let event;

  // try {
  //   event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET as string);
  // } catch (err: any) {
  //   throw new AppError(status.BAD_REQUEST, `Webhook Error: ${err.message}`);
  // }

  // // Handle the event
  // switch (event.type) {
  //   case "invoice.payment_succeeded":
  //     const invoiceData = event.data.object;
  //     // Update local invoice record to 'PAID'
  //     break;
  //   case "invoice.payment_failed":
  //     // Update local invoice record to 'FAILED', notify user
  //     break;
  //   // ... handle other subscription events
  //   default:
  //     console.log(`Unhandled event type ${event.type}`);
  // }

  console.log("Stripe webhook received (Simulation)");
  return true;
};

const getAllPlatformInvoices = async (query: any) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 20;
  const skip = (page - 1) * limit;

  const [invoices, total] = await Promise.all([
    prisma.invoice.findMany({
      include: { subscription: true },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.invoice.count(),
  ]);

  return { meta: { page, limit, total }, data: invoices };
};

export const InvoiceService = {
  getOrgInvoices,
  getInvoiceDetails,
  getInvoicePdf,
  stripeWebhookHandler,
  getAllPlatformInvoices,
};
