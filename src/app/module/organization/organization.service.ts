// ============================================================
//  Organization Module — Service
//  Project : Multi-Tenant SaaS Collaboration Platform
//  Deps    : prisma, zod
// ============================================================

import httpStatus from "http-status";
import AppError from "../../errorHelpers/AppError";
import { IRequestUser } from "../../interfaces/requestUser.interface";
import { prisma } from "../../lib/prisma";
import {
  ICreateOrganizationPayload,
  IOrgFilter,
  IUpdateOrganizationPayload,
} from "./organization.interface";

// ── 1. Create organization ────────────────────────────────────
// Creates the org record, an OWNER role scoped to that org, and
// the caller's membership — all inside a single transaction so
// none of the three records can be created without the others.
// Enforces slug uniqueness across the platform before writing.
const createOrganization = async (
  requestUser: IRequestUser,
  payload: ICreateOrganizationPayload,
) => {
  const slugTaken = await prisma.organization.findUnique({
    where: { slug: payload.slug },
  });

  if (slugTaken) {
    throw new AppError(
      httpStatus.CONFLICT,
      `The slug "${payload.slug}" is already taken`,
    );
  }

  const organization = await prisma.$transaction(async (tx) => {
    const org = await tx.organization.create({
      data: {
        name: payload.name,
        slug: payload.slug,
        ownerId: requestUser.userId,
      },
    });

    // Create a default OWNER role scoped to this org
    const ownerRole = await tx.role.create({
      data: {
        name: "Owner",
        organizationId: org.id,
      },
    });

    // Add the creator as the first member with the OWNER role
    await tx.membership.create({
      data: {
        userId: requestUser.userId,
        organizationId: org.id,
        roleId: ownerRole.id,
      },
    });

    return org;
  });

  // Return the full org with owner and counts after the transaction
  return prisma.organization.findUnique({
    where: { id: organization.id },
    include: {
      owner: {
        select: { id: true, name: true, email: true, image: true },
      },
      _count: {
        select: { memberships: true, projects: true, roles: true },
      },
    },
  });
};

// ── 2. Get my organizations ───────────────────────────────────
// Returns every organization the current user holds a membership in,
// ordered newest-first. Each org includes the user's role, member /
// project counts, and subscription plan if one exists.
const getMyOrganizations = async (requestUser: IRequestUser) => {
  return prisma.organization.findMany({
    where: {
      memberships: { some: { userId: requestUser.userId } },
    },
    include: {
      owner: {
        select: { id: true, name: true, email: true },
      },
      memberships: {
        where: { userId: requestUser.userId },
        include: {
          role: { select: { id: true, name: true } },
        },
      },
      subscription: {
        include: {
          plan: { select: { id: true, name: true, slug: true } },
        },
      },
      _count: {
        select: { memberships: true, projects: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

// ── 3. List all organizations — admin ─────────────────────────
// Returns a paginated list of every organization on the platform.
// Supports full-text search on name and slug. Intended exclusively
// for super-admin dashboards — not accessible to regular users.
const getAllOrganizations = async (filters: IOrgFilter) => {
  const { page = 1, limit = 10, search } = filters;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { slug: { contains: search, mode: "insensitive" } },
    ];
  }

  const [data, total] = await Promise.all([
    prisma.organization.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        owner: {
          select: { id: true, name: true, email: true },
        },
        subscription: {
          include: {
            plan: { select: { name: true, slug: true } },
          },
        },
        _count: {
          select: { memberships: true, projects: true },
        },
      },
    }),
    prisma.organization.count({ where }),
  ]);

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// ── 4. Get organization by ID ─────────────────────────────────
// Returns the full org detail with owner, roles, active subscription,
// and aggregate counts. Only members of the org can call this — any
// non-member receives a 403 regardless of their platform role.
const getOrganizationById = async (
  orgId: string,
  requestUser: IRequestUser,
) => {
  const membership = await prisma.membership.findFirst({
    where: { organizationId: orgId, userId: requestUser.userId },
  });

  if (!membership) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not a member of this organization",
    );
  }

  const org = await prisma.organization.findUnique({
    where: { id: orgId },
    include: {
      owner: {
        select: { id: true, name: true, email: true, image: true },
      },
      roles: {
        select: { id: true, name: true },
        orderBy: { name: "asc" },
      },
      subscription: {
        include: {
          plan: {
            select: {
              id: true,
              name: true,
              slug: true,
              priceMonthly: true,
              priceYearly: true,
            },
          },
        },
      },
      _count: {
        select: { memberships: true, projects: true, apiKeys: true },
      },
    },
  });

  if (!org) {
    throw new AppError(httpStatus.NOT_FOUND, "Organization not found");
  }

  return org;
};

// ── 5. Update organization ────────────────────────────────────
// Only the organization owner (ownerId === requestUser.userId) may
// rename the org or change its slug. Slug uniqueness is validated
// across the platform, excluding the current org's own slug.
const updateOrganization = async (
  orgId: string,
  requestUser: IRequestUser,
  payload: IUpdateOrganizationPayload,
) => {
  const org = await prisma.organization.findUnique({
    where: { id: orgId },
  });

  if (!org) {
    throw new AppError(httpStatus.NOT_FOUND, "Organization not found");
  }

  if (org.ownerId !== requestUser.userId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Only the organization owner can update this organization",
    );
  }

  if (payload.slug && payload.slug !== org.slug) {
    const slugTaken = await prisma.organization.findUnique({
      where: { slug: payload.slug },
    });

    if (slugTaken) {
      throw new AppError(
        httpStatus.CONFLICT,
        `The slug "${payload.slug}" is already taken`,
      );
    }
  }

  return prisma.organization.update({
    where: { id: orgId },
    data: {
      ...(payload.name !== undefined && { name: payload.name }),
      ...(payload.slug !== undefined && { slug: payload.slug }),
    },
    include: {
      owner: {
        select: { id: true, name: true, email: true },
      },
    },
  });
};

// ── 6. Delete organization ────────────────────────────────────
// Permanently deletes the org and all cascade-associated data —
// memberships, invitations, projects, tasks, labels, API keys,
// subscriptions and activity logs — as defined by the schema's
// onDelete: Cascade rules. Only the owner may perform this action.
const deleteOrganization = async (orgId: string, requestUser: IRequestUser) => {
  const org = await prisma.organization.findUnique({
    where: { id: orgId },
  });

  if (!org) {
    throw new AppError(httpStatus.NOT_FOUND, "Organization not found");
  }

  if (org.ownerId !== requestUser.userId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Only the organization owner can delete this organization",
    );
  }

  await prisma.organization.delete({ where: { id: orgId } });
};

// ── 7. Get organization stats ─────────────────────────────────
// Returns aggregate counts for members, projects, tasks, and active
// API keys, plus the current subscription plan and status.
// Any member of the org can view stats — no owner restriction.
const getOrganizationStats = async (
  orgId: string,
  requestUser: IRequestUser,
) => {
  const membership = await prisma.membership.findFirst({
    where: { organizationId: orgId, userId: requestUser.userId },
  });

  if (!membership) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not a member of this organization",
    );
  }

  const org = await prisma.organization.findUnique({
    where: { id: orgId },
  });

  if (!org) {
    throw new AppError(httpStatus.NOT_FOUND, "Organization not found");
  }

  const [members, projects, tasks, activeApiKeys, subscription] =
    await Promise.all([
      prisma.membership.count({
        where: { organizationId: orgId },
      }),
      prisma.project.count({
        where: { organizationId: orgId },
      }),
      prisma.task.count({
        where: { project: { organizationId: orgId } },
      }),
      prisma.apiKey.count({
        where: { organizationId: orgId, isActive: true },
      }),
      prisma.subscription.findUnique({
        where: { organizationId: orgId },
        include: {
          plan: { select: { name: true, slug: true } },
        },
      }),
    ]);

  return {
    members,
    projects,
    tasks,
    activeApiKeys,
    subscription: subscription
      ? {
          status: subscription.status,
          billingCycle: subscription.billingCycle,
          currentPeriodEnd: subscription.currentPeriodEnd,
          plan: subscription.plan,
        }
      : null,
  };
};

// ─────────────────────────────────────────────────────────────

export const OrganizationService = {
  createOrganization,
  getMyOrganizations,
  getAllOrganizations,
  getOrganizationById,
  updateOrganization,
  deleteOrganization,
  getOrganizationStats,
};
