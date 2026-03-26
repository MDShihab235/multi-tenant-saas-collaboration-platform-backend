// ============================================================
//  Plan Module — Service
// ============================================================

import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import {
  ICreatePlanPayload,
  IUpdatePlanPayload,
  ICreateFeaturePayload,
  IUpdateFeaturePayload,
} from "./plan.interface";

const getActivePlans = async () => {
  return await prisma.plan.findMany({
    where: { isActive: true },
    include: {
      features: true, // Fetch features to display on pricing page
    },
    orderBy: { createdAt: "asc" },
  });
};

const getPlanDetails = async (planId: string) => {
  const plan = await prisma.plan.findUnique({
    where: { id: planId },
    include: { features: true },
  });

  if (!plan) throw new AppError(status.NOT_FOUND, "Plan not found");
  return plan;
};

const createPlan = async (payload: ICreatePlanPayload) => {
  const existingPlan = await prisma.plan.findFirst({
    where: { name: payload.name },
  });

  if (existingPlan) {
    throw new AppError(status.CONFLICT, "A plan with this name already exists");
  }

  return await prisma.plan.create({
    data: payload,
    include: { features: true },
  });
};

const updatePlan = async (planId: string, payload: IUpdatePlanPayload) => {
  const plan = await prisma.plan.findUnique({ where: { id: planId } });
  if (!plan) throw new AppError(status.NOT_FOUND, "Plan not found");

  return await prisma.plan.update({
    where: { id: planId },
    data: payload,
  });
};

const deactivatePlan = async (planId: string) => {
  const plan = await prisma.plan.findUnique({ where: { id: planId } });
  if (!plan) throw new AppError(status.NOT_FOUND, "Plan not found");

  // Soft-delete by setting isActive to false so existing subscriptions don't break
  return await prisma.plan.update({
    where: { id: planId },
    data: { isActive: false },
  });
};

const addPlanFeature = async (
  planId: string,
  payload: ICreateFeaturePayload,
) => {
  const plan = await prisma.plan.findUnique({ where: { id: planId } });
  if (!plan) throw new AppError(status.NOT_FOUND, "Plan not found");

  return await prisma.planFeature.create({
    data: {
      planId,
      ...payload,
    },
  });
};

const getPlanFeatures = async (planId: string) => {
  const plan = await prisma.plan.findUnique({ where: { id: planId } });
  if (!plan) throw new AppError(status.NOT_FOUND, "Plan not found");

  return await prisma.planFeature.findMany({
    where: { planId },
  });
};

const updatePlanFeature = async (
  planId: string,
  featureId: string,
  payload: IUpdateFeaturePayload,
) => {
  const feature = await prisma.planFeature.findFirst({
    where: { id: featureId, planId },
  });

  if (!feature)
    throw new AppError(status.NOT_FOUND, "Feature not found in this plan");

  return await prisma.planFeature.update({
    where: { id: featureId },
    data: payload,
  });
};

const removePlanFeature = async (planId: string, featureId: string) => {
  const feature = await prisma.planFeature.findFirst({
    where: { id: featureId, planId },
  });

  if (!feature)
    throw new AppError(status.NOT_FOUND, "Feature not found in this plan");

  return await prisma.planFeature.delete({
    where: { id: featureId },
  });
};

export const PlanService = {
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
