// ============================================================
//  Subscription Module — Service
// ============================================================

import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { ISubscribePayload, BillingCycle } from "./subscription.interface";

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

const subscribe = async (
  userId: string,
  orgId: string,
  payload: ISubscribePayload,
) => {
  await verifyOrgOwner(userId, orgId);

  // Check if active subscription already exists
  const existingSub = await prisma.subscription.findFirst({
    where: { organizationId: orgId, status: { in: ["ACTIVE", "TRIALING"] } },
  });
  if (existingSub)
    throw new AppError(
      status.BAD_REQUEST,
      "Organization already has an active subscription",
    );

  const plan = await prisma.plan.findUnique({ where: { id: payload.planId } });
  if (!plan) throw new AppError(status.NOT_FOUND, "Plan not found");

  const now = new Date();
  const periodEnd = new Date();
  periodEnd.setMonth(
    periodEnd.getMonth() + (payload.billingCycle === "YEARLY" ? 12 : 1),
  );

  // If Stripe/Braintree is used, you would create the customer/subscription there first.
  return await prisma.subscription.create({
    data: {
      organizationId: orgId,
      planId: plan.id,
      status: plan.trialDays && plan.trialDays > 0 ? "TRIALING" : "ACTIVE",
      billingCycle: payload.billingCycle,
      currentPeriodStart: now,
      currentPeriodEnd: periodEnd,
      cancelAtPeriodEnd: false,
    },
  });
};

const getSubscription = async (userId: string, orgId: string) => {
  const subscription = await prisma.subscription.findFirst({
    where: { organizationId: orgId },
    include: { plan: { include: { features: true } } },
    orderBy: { createdAt: "desc" },
  });

  if (!subscription)
    throw new AppError(
      status.NOT_FOUND,
      "No subscription found for this organization",
    );
  return subscription;
};

const getUsage = async (userId: string, orgId: string) => {
  const subscription = await getSubscription(userId, orgId);

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
  getSubscription,
  getUsage,
  upgradeSubscription,
  downgradeSubscription,
  changeBillingCycle,
  cancelSubscription,
  reactivateSubscription,
};
