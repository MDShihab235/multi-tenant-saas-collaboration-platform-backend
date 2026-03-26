// ============================================================
//  ApiKey Module — Service
// ============================================================

import status from "http-status";
import crypto from "crypto";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { ICreateApiKeyPayload, IUpdateApiKeyPayload } from "./apiKey.interface";

// Utility function to generate and hash API keys securely
const generateKeyData = () => {
  const rawKey = crypto.randomBytes(32).toString("hex");
  const fullKey = `cp_${rawKey}`; // 'cp' stands for collab-pro
  const keyPrefix = fullKey.substring(0, 8); // e.g., 'cp_a1b2'
  const keyHash = crypto.createHash("sha256").update(fullKey).digest("hex");

  return { fullKey, keyPrefix, keyHash };
};

// Utility to verify user has Admin/Owner access to the org
const verifyOrgAdmin = async (userId: string, orgId: string) => {
  const membership = await prisma.membership.findFirst({
    where: { organizationId: orgId, userId: userId },
    include: { role: true },
  });

  if (
    !membership ||
    (membership.role.name !== "OWNER" && membership.role.name !== "ADMIN")
  ) {
    throw new AppError(
      status.FORBIDDEN,
      "Only organization administrators can manage API keys",
    );
  }
};

const createApiKey = async (
  userId: string,
  orgId: string,
  payload: ICreateApiKeyPayload,
) => {
  await verifyOrgAdmin(userId, orgId);

  const { fullKey, keyPrefix, keyHash } = generateKeyData();

  const apiKey = await prisma.apiKey.create({
    data: {
      organizationId: orgId,
      name: payload.name,
      keyHash: keyHash, // Storing hash
      keyPrefix: keyPrefix, // Storing prefix
      expiresAt: payload.expiresAt ? new Date(payload.expiresAt) : null,
    },
    select: {
      id: true,
      name: true,
      keyPrefix: true,
      expiresAt: true,
      createdAt: true,
    },
  });

  return {
    ...apiKey,
    key: fullKey, // Return raw key only once
  };
};

const getOrgApiKeys = async (userId: string, orgId: string) => {
  await verifyOrgAdmin(userId, orgId);

  return await prisma.apiKey.findMany({
    where: { organizationId: orgId },
    select: {
      id: true,
      name: true,
      keyPrefix: true,
      isActive: true,
      lastUsedAt: true,
      expiresAt: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

const getApiKeyDetails = async (
  userId: string,
  orgId: string,
  keyId: string,
) => {
  await verifyOrgAdmin(userId, orgId);

  const apiKey = await prisma.apiKey.findFirst({
    where: { id: keyId, organizationId: orgId },
    select: {
      id: true,
      name: true,
      keyPrefix: true,
      isActive: true,
      lastUsedAt: true,
      expiresAt: true,
      createdAt: true,
    },
  });

  if (!apiKey) throw new AppError(status.NOT_FOUND, "API Key not found");
  return apiKey;
};

const updateApiKey = async (
  userId: string,
  orgId: string,
  keyId: string,
  payload: IUpdateApiKeyPayload,
) => {
  await verifyOrgAdmin(userId, orgId);

  const apiKey = await prisma.apiKey.findFirst({
    where: { id: keyId, organizationId: orgId },
  });
  if (!apiKey) throw new AppError(status.NOT_FOUND, "API Key not found");

  const dataToUpdate: any = {};
  if (payload.name) dataToUpdate.name = payload.name;
  if (payload.isActive !== undefined) dataToUpdate.isActive = payload.isActive;
  if (payload.expiresAt !== undefined)
    dataToUpdate.expiresAt = payload.expiresAt
      ? new Date(payload.expiresAt)
      : null;

  return await prisma.apiKey.update({
    where: { id: keyId },
    data: dataToUpdate,
    select: {
      id: true,
      name: true,
      keyPrefix: true,
      isActive: true,
      expiresAt: true,
    },
  });
};

const rotateApiKey = async (userId: string, orgId: string, keyId: string) => {
  await verifyOrgAdmin(userId, orgId);

  const apiKey = await prisma.apiKey.findFirst({
    where: { id: keyId, organizationId: orgId },
  });
  if (!apiKey) throw new AppError(status.NOT_FOUND, "API Key not found");

  const { fullKey, keyPrefix, keyHash } = generateKeyData();

  // Updates existing record with new hash and prefix, effectively invalidating the old key
  const updatedKey = await prisma.apiKey.update({
    where: { id: keyId },
    data: {
      keyHash: keyHash,
      keyPrefix: keyPrefix,
    },
    select: {
      id: true,
      name: true,
      keyPrefix: true,
      expiresAt: true,
      createdAt: true,
    },
  });

  return {
    ...updatedKey,
    key: fullKey, // Return the newly generated raw key
  };
};

const deleteApiKey = async (userId: string, orgId: string, keyId: string) => {
  await verifyOrgAdmin(userId, orgId);

  const apiKey = await prisma.apiKey.findFirst({
    where: { id: keyId, organizationId: orgId },
  });
  if (!apiKey) throw new AppError(status.NOT_FOUND, "API Key not found");

  return await prisma.apiKey.delete({
    where: { id: keyId },
  });
};

export const ApiKeyService = {
  createApiKey,
  getOrgApiKeys,
  getApiKeyDetails,
  updateApiKey,
  rotateApiKey,
  deleteApiKey,
};
