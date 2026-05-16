// ============================================================
//  Subscription Module — Service
// ============================================================

import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { ISubscribePayload, BillingCycle } from "./subscription.interface";
import Stripe from "stripe";
import { stripe } from "../../config/stripe.config";
// Helper: Ensure user is org owner
const verifyOrgOwner = async (userId: string, orgId: string) => {
  const membership = await prisma.membership.findFirst({
    where: { organizationId: orgId, userId: userId, role: { name: "OWNER" } },
  });
  if (!membership)
    throw new AppError(
      status.FORBIDDEN,
      "Only organization owners can manage subscriptions",
    );
};

// subscription.service.ts

const subscribe = async (
  userId: string,
  orgId: string,
  payload: ISubscribePayload,
) => {
  await verifyOrgOwner(userId, orgId);

  // 1. Fetch the Plan from DB (Data sourced from your CSV)
  const plan = await prisma.plan.findUnique({
    where: { id: payload.planId },
  });

  if (!plan) throw new AppError(status.NOT_FOUND, "Plan not found");

  // 2. Select price and convert to cents (Stripe requirement)
  const unitAmount =
    payload.billingCycle === "YEARLY"
      ? Math.round(Number(plan.priceYearly) * 100)
      : Math.round(Number(plan.priceMonthly) * 100);

  // 3. Create Checkout Session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "subscription",
    customer_email: undefined, // You can pass req.user.email here
    line_items: [
      {
        price_data: {
          currency: plan.currency.toLowerCase(),
          product_data: {
            name: plan.name,
            description: plan.description || `Plan: ${plan.name}`,
          },
          unit_amount: unitAmount,
          recurring: {
            interval: payload.billingCycle === "YEARLY" ? "year" : "month",
          },
        },
        quantity: 1,
      },
    ],
    // Metadata links the Stripe payment back to your local database entities
    metadata: {
      orgId: orgId,
      planId: plan.id,
      billingCycle: payload.billingCycle,
    },
    success_url: `${process.env.FRONTEND_URL}/${orgId}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONTEND_URL}/${orgId}/billing?canceled=true`,
  });

  return { url: session.url };
};

// subscription.service.ts (or a dedicated webhook service)

const handleSuccessfulSubscription = async (
  session: Stripe.Checkout.Session,
) => {
  const { orgId, planId, billingCycle } = session.metadata as {
    orgId: string;
    planId: string;
    billingCycle: "MONTHLY" | "YEARLY";
  };

  // Basic validation to prevent Prisma crashes
  if (!orgId || !planId) {
    throw new Error(`Missing metadata in Stripe Session: ${session.id}`);
  }

  const stripeSubscriptionId = session.subscription as string;
  const stripeCustomerId = session.customer as string;

  // Calculate dates based on billing cycle
  const now = new Date();
  const periodEnd = new Date();
  if (billingCycle === "YEARLY") {
    periodEnd.setFullYear(periodEnd.getFullYear() + 1);
  } else {
    periodEnd.setMonth(periodEnd.getMonth() + 1);
  }

  // Atomic Transaction: Subscription + Invoice
  return await prisma.$transaction(async (tx) => {
    // 1. Update/Create Subscription
    // We use upsert to ensure we don't get 'Unique constraint' errors on organizationId
    const subscription = await tx.subscription.upsert({
      where: { organizationId: orgId },
      update: {
        planId: planId,
        status: "ACTIVE",
        stripeSubscriptionId,
        stripeCustomerId,
        billingCycle,
        currentPeriodStart: now,
        currentPeriodEnd: periodEnd,
        cancelAtPeriodEnd: false,
      },
      create: {
        organizationId: orgId,
        planId: planId,
        status: "ACTIVE",
        stripeSubscriptionId,
        stripeCustomerId,
        billingCycle,
        currentPeriodStart: now,
        currentPeriodEnd: periodEnd,
      },
    });

    // 2. Create Invoice Record
    // session.amount_total is in cents (e.g., 2900 for $29.00)
    const amount = session.amount_total ? session.amount_total / 100 : 0;

    await tx.invoice.create({
      data: {
        subscriptionId: subscription.id,
        status: "PAID",
        amountDue: amount,
        amountPaid: amount,
        currency: session.currency?.toUpperCase() || "USD",
        periodStart: now,
        periodEnd: periodEnd,
        paidAt: now,
        stripeInvoiceId: session.invoice as string, // Link to Stripe Invoice ID
        // invoicePdfUrl can be updated later via invoice.paid webhook if needed
      },
    });

    return subscription;
  });
};

// const subscribe = async (
//   userId: string,
//   orgId: string,
//   payload: ISubscribePayload,
// ) => {
//   await verifyOrgOwner(userId, orgId);

//   // Check if active subscription already exists
//   const existingSub = await prisma.subscription.findFirst({
//     where: { organizationId: orgId, status: { in: ["ACTIVE", "TRIALING"] } },
//   });
//   if (existingSub)
//     throw new AppError(
//       status.BAD_REQUEST,
//       "Organization already has an active subscription",
//     );

//   const plan = await prisma.plan.findUnique({ where: { id: payload.planId } });
//   if (!plan) throw new AppError(status.NOT_FOUND, "Plan not found");

//   const now = new Date();
//   const periodEnd = new Date();
//   periodEnd.setMonth(
//     periodEnd.getMonth() + (payload.billingCycle === "YEARLY" ? 12 : 1),
//   );

//   // If Stripe/Braintree is used, you would create the customer/subscription there first.
//   return await prisma.subscription.create({
//     data: {
//       organizationId: orgId,
//       planId: plan.id,
//       status: plan.trialDays && plan.trialDays > 0 ? "TRIALING" : "ACTIVE",
//       billingCycle: payload.billingCycle,
//       currentPeriodStart: now,
//       currentPeriodEnd: periodEnd,
//       cancelAtPeriodEnd: false,
//     },
//   });
// };

const getSubscription = async (orgId: string) => {
  // const subscription = await prisma.subscription.findFirst({
  //   where: { organizationId: orgId },
  //   include: { plan: { include: { features: true } }, invoices: true },
  //   orderBy: { createdAt: "desc" },
  // });

  const subscription = await prisma.subscription.findUnique({
    where: { organizationId: orgId },
    include: {
      plan: true, // Includes details like plan limits/pricing
      invoices: {
        // CRITICAL: This ensures subscription.invoices is sent to frontend!
        orderBy: {
          createdAt: "desc", // Shows your latest invoices first on the ledger
        },
      },
    },
  });

  if (!subscription)
    throw new AppError(
      status.NOT_FOUND,
      "No subscription found for this organization",
    );
  return subscription;
};

const getUsage = async (orgId: string) => {
  const subscription = await getSubscription(orgId);

  // Example counts (adjust based on your actual schema relations)
  const projectCount = await prisma.project.count({
    where: { organizationId: orgId },
  });
  const memberCount = await prisma.membership.count({
    where: { organizationId: orgId },
  });

  return {
    subscriptionDetails: subscription,
    usage: {
      projects: projectCount,
      members: memberCount,
      // Add other metrics (tasks, storage space, etc.) as needed
    },
  };
};

const upgradeSubscription = async (
  userId: string,
  orgId: string,
  newPlanId: string,
) => {
  await verifyOrgOwner(userId, orgId);
  const sub = await prisma.subscription.findFirst({
    where: { organizationId: orgId, status: { in: ["ACTIVE", "TRIALING"] } },
  });
  if (!sub)
    throw new AppError(status.NOT_FOUND, "Active subscription not found");

  // In reality, call your Payment Gateway here to handle proration
  return await prisma.subscription.update({
    where: { id: sub.id },
    data: { planId: newPlanId },
  });
};

const downgradeSubscription = async (
  userId: string,
  orgId: string,
  newPlanId: string,
) => {
  await verifyOrgOwner(userId, orgId);
  const sub = await prisma.subscription.findFirst({
    where: { organizationId: orgId, status: { in: ["ACTIVE", "TRIALING"] } },
  });
  if (!sub)
    throw new AppError(status.NOT_FOUND, "Active subscription not found");

  // Downgrades typically take effect at the end of the billing period
  return await prisma.subscription.update({
    where: { id: sub.id },
    data: { planId: newPlanId },
  });
};

const changeBillingCycle = async (
  userId: string,
  orgId: string,
  billingCycle: BillingCycle,
) => {
  await verifyOrgOwner(userId, orgId);
  const sub = await prisma.subscription.findFirst({
    where: { organizationId: orgId, status: { in: ["ACTIVE", "TRIALING"] } },
  });
  if (!sub)
    throw new AppError(status.NOT_FOUND, "Active subscription not found");

  return await prisma.subscription.update({
    where: { id: sub.id },
    data: { billingCycle },
  });
};

const cancelSubscription = async (userId: string, orgId: string) => {
  await verifyOrgOwner(userId, orgId);
  const sub = await prisma.subscription.findFirst({
    where: { organizationId: orgId, status: { in: ["ACTIVE", "TRIALING"] } },
  });
  if (!sub)
    throw new AppError(status.NOT_FOUND, "Active subscription not found");

  // Do not delete immediately; mark to cancel at the end of the paid period
  return await prisma.subscription.update({
    where: { id: sub.id },
    data: { cancelAtPeriodEnd: true },
  });
};

const reactivateSubscription = async (userId: string, orgId: string) => {
  await verifyOrgOwner(userId, orgId);
  const sub = await prisma.subscription.findFirst({
    where: { organizationId: orgId, cancelAtPeriodEnd: true },
  });
  if (!sub)
    throw new AppError(
      status.NOT_FOUND,
      "No pending cancellation found to reactivate",
    );

  return await prisma.subscription.update({
    where: { id: sub.id },
    data: { cancelAtPeriodEnd: false },
  });
};

export const SubscriptionService = {
  subscribe,
  handleSuccessfulSubscription,
  getSubscription,
  getUsage,
  upgradeSubscription,
  downgradeSubscription,
  changeBillingCycle,
  cancelSubscription,
  reactivateSubscription,
};
