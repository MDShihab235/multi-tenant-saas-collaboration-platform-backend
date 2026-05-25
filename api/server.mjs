var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/app.ts
import { toNodeHandler } from "better-auth/node";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import path3 from "path";
import qs from "qs";

// src/app/config/env.ts
import dotenv from "dotenv";
import status from "http-status";

// src/app/errorHelpers/AppError.ts
var AppError = class extends Error {
  statusCode;
  constructor(statusCode, message, stack = "") {
    super(message);
    this.statusCode = statusCode;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
};
var AppError_default = AppError;

// src/app/config/env.ts
dotenv.config();
var loadEnvVariables = () => {
  const requireEnvVariable = [
    "NODE_ENV",
    "PORT",
    "DATABASE_URL",
    "BETTER_AUTH_SECRET",
    "BETTER_AUTH_URL",
    "ACCESS_TOKEN_SECRET",
    "REFRESH_TOKEN_SECRET",
    "ACCESS_TOKEN_EXPIRES_IN",
    "REFRESH_TOKEN_EXPIRES_IN",
    "BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN",
    "BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE",
    "EMAIL_SENDER_SMTP_USER",
    "EMAIL_SENDER_SMTP_PASS",
    "EMAIL_SENDER_SMTP_HOST",
    "EMAIL_SENDER_SMTP_PORT",
    "EMAIL_SENDER_SMTP_FROM",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "GOOGLE_CALLBACK_URL",
    "FRONTEND_URL",
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
    "STRIPE_SECRET_KEY",
    "STRIPE_WEBHOOK_SECRET",
    "SUPER_ADMIN_EMAIL",
    "SUPER_ADMIN_PASSWORD"
  ];
  requireEnvVariable.forEach((variable) => {
    if (!process.env[variable]) {
      throw new AppError_default(status.INTERNAL_SERVER_ERROR, `Environment variable ${variable} is required but not set in .env file.`);
    }
  });
  return {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    DATABASE_URL: process.env.DATABASE_URL,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN,
    REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN,
    BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN: process.env.BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN,
    BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE: process.env.BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE,
    EMAIL_SENDER: {
      SMTP_USER: process.env.EMAIL_SENDER_SMTP_USER,
      SMTP_PASS: process.env.EMAIL_SENDER_SMTP_PASS,
      SMTP_HOST: process.env.EMAIL_SENDER_SMTP_HOST,
      SMTP_PORT: process.env.EMAIL_SENDER_SMTP_PORT,
      SMTP_FROM: process.env.EMAIL_SENDER_SMTP_FROM
    },
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
    FRONTEND_URL: process.env.FRONTEND_URL,
    CLOUDINARY: {
      CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
      CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
      CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET
    },
    STRIPE: {
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
      STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET
    },
    SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL,
    SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD
  };
};
var envVars = loadEnvVariables();

// src/app/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { bearer, emailOTP } from "better-auth/plugins";

// src/app/lib/prisma.ts
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

// src/generated/prisma/client.ts
import * as path from "path";
import { fileURLToPath } from "url";

// src/generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.5.0",
  "engineVersion": "280c870be64f457428992c43c1f6d557fab6e29e",
  "activeProvider": "postgresql",
  "inlineSchema": '// ============================================================\n//  Prisma Schema\n//  Project  : Multi-Tenant SaaS Collaboration Platform\n//  Source   : Advanced-SaaS-ERD-with-Payment.drawio\n//  Database : PostgreSQL\n//  Tables   : 22  |  Relations : 30  |  Enums : 7\n// ============================================================\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../../src/generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\n// \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n// ENUMS\n// \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n\nenum TaskStatus {\n  TODO\n  IN_PROGRESS\n  IN_REVIEW\n  DONE\n  CANCELED\n\n  @@map("task_status")\n}\n\nenum UserStatus {\n  ACTIVE\n  INACTIVE\n  BLOCKED\n  DELETED\n}\n\nenum TaskPriority {\n  LOW\n  MEDIUM\n  HIGH\n  URGENT\n\n  @@map("task_priority")\n}\n\nenum ProjectMemberRole {\n  OWNER\n  MANAGER\n  CONTRIBUTOR\n  VIEWER\n\n  @@map("project_member_role")\n}\n\nenum NotificationType {\n  TASK_ASSIGNED\n  TASK_UPDATED\n  COMMENT_ADDED\n  MEMBER_JOINED\n  MEMBER_REMOVED\n  INVITATION_SENT\n  SUBSCRIPTION_CHANGED\n  INVOICE_PAID\n  GENERAL\n\n  @@map("notification_type")\n}\n\nenum SubscriptionStatus {\n  TRIALING\n  ACTIVE\n  PAST_DUE\n  CANCELED\n  PAUSED\n  INCOMPLETE\n\n  @@map("subscription_status")\n}\n\nenum BillingCycle {\n  MONTHLY\n  YEARLY\n\n  @@map("billing_cycle")\n}\n\nenum InvoiceStatus {\n  DRAFT\n  OPEN\n  PAID\n  VOID\n  UNCOLLECTIBLE\n\n  @@map("invoice_status")\n}\n\n// \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n// 1. USER\n// ERD edges : \u2192 Organization (owner), Membership, ProjectMember,\n//               Task (assignee), TaskComment, TaskAttachment,\n//               Notification, ActivityLog (actor), File\n// \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n\nmodel User {\n  id                 String     @id @default(uuid())\n  name               String     @unique\n  email              String\n  image              String?    @map("avatar")\n  emailVerified      Boolean    @default(false)\n  status             UserStatus @default(ACTIVE)\n  needPasswordChange Boolean    @default(false)\n  isDeleted          Boolean    @default(false)\n  deletedAt          DateTime?\n  createdAt          DateTime   @default(now())\n  updatedAt          DateTime   @updatedAt\n\n  // Relations\n  sessions           Session[]\n  accounts           Account[]\n  ownedOrganizations Organization[]   @relation("OrgOwner")\n  memberships        Membership[]\n  projectMembers     ProjectMember[]\n  assignedTasks      Task[]           @relation("TaskAssignee")\n  taskComments       TaskComment[]\n  taskAttachments    TaskAttachment[] @relation("AttachmentUploader")\n  notifications      Notification[]\n  activityLogs       ActivityLog[]    @relation("ActivityActor")\n  files              File[]           @relation("FileUploader")\n\n  @@index([email], map: "idx_users_email")\n  @@index([createdAt], map: "idx_users_created_at")\n  @@map("users")\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n\n// \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n// 2. ORGANIZATION  (Tenant)\n// ERD edges : \u2192 Role, Membership, Invitation, Project,\n//               ActivityLog, ApiKey, Subscription (1:1)\n// \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n\nmodel Organization {\n  id        String   @id @default(cuid()) @map("id")\n  ownerId   String   @map("owner_id")\n  name      String   @map("name")\n  slug      String   @unique @map("slug")\n  createdAt DateTime @default(now()) @map("created_at")\n\n  // Relations\n  owner        User          @relation("OrgOwner", fields: [ownerId], references: [id])\n  roles        Role[]\n  memberships  Membership[]\n  invitations  Invitation[]\n  projects     Project[]\n  activityLogs ActivityLog[]\n  apiKeys      ApiKey[]\n  subscription Subscription?\n\n  @@index([slug], map: "idx_organizations_slug")\n  @@index([ownerId], map: "idx_organizations_owner_id")\n  @@map("organizations")\n}\n\n// \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n// 3. ROLE\n// ERD edges : \u2192 RolePermission, Membership, Invitation\n// \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n\nmodel Role {\n  id             String @id @default(cuid()) @map("id")\n  organizationId String @map("organization_id")\n  name           String @map("name")\n\n  // Relations\n  organization    Organization     @relation(fields: [organizationId], references: [id], onDelete: Cascade)\n  rolePermissions RolePermission[]\n  memberships     Membership[]\n  invitations     Invitation[]\n\n  @@unique([organizationId, name], map: "uq_role_org_name")\n  @@index([organizationId], map: "idx_roles_organization_id")\n  @@map("roles")\n}\n\n// \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n// 4. PERMISSION\n// ERD edges : \u2192 RolePermission\n// \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n\nmodel Permission {\n  id       String @id @default(cuid()) @map("id")\n  action   String @map("action") // e.g. "create", "read", "delete"\n  resource String @map("resource") // e.g. "project", "task"\n\n  // Relations\n  rolePermissions RolePermission[]\n\n  @@unique([action, resource], map: "uq_permission_action_resource")\n  @@map("permissions")\n}\n\n// \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n// 5. ROLE PERMISSION  (pivot \u2014 Roles \u2194 Permissions)\n// ERD edges : Role \u2192 RolePermission, Permission \u2192 RolePermission\n// Composite PK: [roleId, permissionId]\n// \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n\nmodel RolePermission {\n  roleId       String @map("role_id")\n  permissionId String @map("permission_id")\n\n  // Relations\n  role       Role       @relation(fields: [roleId], references: [id], onDelete: Cascade)\n  permission Permission @relation(fields: [permissionId], references: [id], onDelete: Cascade)\n\n  @@id([roleId, permissionId])\n  @@index([roleId], map: "idx_role_permissions_role_id")\n  @@index([permissionId], map: "idx_role_permissions_permission_id")\n  @@map("role_permissions")\n}\n\n// \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n// 6. MEMBERSHIP  (Users \u2194 Organizations, carries Role)\n// ERD edges : User \u2192 Membership, Organization \u2192 Membership,\n//             Role \u2192 Membership\n// \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n\nmodel Membership {\n  id             String   @id @default(cuid()) @map("id")\n  userId         String   @map("user_id")\n  organizationId String   @map("organization_id")\n  roleId         String   @map("role_id")\n  joinedAt       DateTime @default(now()) @map("joined_at")\n\n  // Relations\n  user         User         @relation(fields: [userId], references: [id], onDelete: Cascade)\n  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)\n  role         Role         @relation(fields: [roleId], references: [id])\n\n  @@unique([userId, organizationId], map: "uq_membership_user_org")\n  @@index([userId], map: "idx_memberships_user_id")\n  @@index([organizationId], map: "idx_memberships_organization_id")\n  @@index([roleId], map: "idx_memberships_role_id")\n  @@map("memberships")\n}\n\n// \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n// 7. INVITATION\n// ERD edges : Organization \u2192 Invitation, Role \u2192 Invitation\n// \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n\nmodel Invitation {\n  id             String    @id @default(cuid()) @map("id")\n  organizationId String    @map("organization_id")\n  roleId         String    @map("role_id")\n  email          String    @map("email")\n  token          String    @unique @default(cuid()) @map("token")\n  acceptedAt     DateTime? @map("accepted_at")\n  expiresAt      DateTime? @map("expires_at")\n  createdAt      DateTime  @default(now()) @map("created_at")\n\n  // Relations\n  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)\n  role         Role         @relation(fields: [roleId], references: [id])\n\n  @@index([organizationId], map: "idx_invitations_organization_id")\n  @@index([token], map: "idx_invitations_token")\n  @@index([email], map: "idx_invitations_email")\n  @@map("invitations")\n}\n\n// \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n// 8. PROJECT\n// ERD edges : Organization \u2192 Project\n//             Project \u2192 ProjectMember, Task, Label\n// \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n\nmodel Project {\n  id             String   @id @default(cuid()) @map("id")\n  organizationId String   @map("organization_id")\n  name           String   @map("name")\n  description    String?  @map("description")\n  createdBy      String   @map("created_by")\n  createdAt      DateTime @default(now()) @map("created_at")\n  updatedAt      DateTime @updatedAt @map("updated_at")\n\n  // Relations\n  organization   Organization    @relation(fields: [organizationId], references: [id], onDelete: Cascade)\n  projectMembers ProjectMember[]\n  tasks          Task[]\n  labels         Label[]\n\n  @@index([organizationId], map: "idx_projects_organization_id")\n  @@index([createdBy], map: "idx_projects_created_by")\n  @@map("projects")\n}\n\n// \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n// 9. PROJECT MEMBER  (pivot \u2014 Projects \u2194 Users)\n// ERD edges : Project \u2192 ProjectMember, User \u2192 ProjectMember\n// \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n\nmodel ProjectMember {\n  id        String            @id @default(cuid()) @map("id")\n  projectId String            @map("project_id")\n  userId    String            @map("user_id")\n  role      ProjectMemberRole @default(CONTRIBUTOR) @map("role")\n  joinedAt  DateTime          @default(now()) @map("joined_at")\n\n  // Relations\n  project Project @relation(fields: [projectId], references: [id], onDelete: Cascade)\n  user    User    @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([projectId, userId], map: "uq_project_member_user")\n  @@index([projectId], map: "idx_project_members_project_id")\n  @@index([userId], map: "idx_project_members_user_id")\n  @@map("project_members")\n}\n\n// \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n// 10. TASK\n// ERD edges : Project \u2192 Task, User \u2192 Task (assignee)\n//             Task \u2192 TaskComment, TaskAttachment, TaskLabel\n// \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n\nmodel Task {\n  id         String       @id @default(cuid()) @map("id")\n  projectId  String       @map("project_id")\n  assignedTo String?      @map("assigned_to")\n  title      String       @map("title")\n  status     TaskStatus   @default(TODO) @map("status")\n  priority   TaskPriority @default(MEDIUM) @map("priority")\n  createdAt  DateTime     @default(now()) @map("created_at")\n  updatedAt  DateTime     @updatedAt @map("updated_at")\n\n  // Relations\n  project     Project          @relation(fields: [projectId], references: [id], onDelete: Cascade)\n  assignee    User?            @relation("TaskAssignee", fields: [assignedTo], references: [id], onDelete: SetNull)\n  comments    TaskComment[]\n  attachments TaskAttachment[]\n  taskLabels  TaskLabel[]\n\n  @@index([projectId], map: "idx_tasks_project_id")\n  @@index([assignedTo], map: "idx_tasks_assigned_to")\n  @@index([status], map: "idx_tasks_status")\n  @@index([priority], map: "idx_tasks_priority")\n  @@map("tasks")\n}\n\n// \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n// 11. TASK COMMENT\n// ERD edges : Task \u2192 TaskComment, User \u2192 TaskComment\n// \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n\nmodel TaskComment {\n  id        String   @id @default(cuid()) @map("id")\n  taskId    String   @map("task_id")\n  userId    String   @map("user_id")\n  message   String   @map("message")\n  createdAt DateTime @default(now()) @map("created_at")\n  updatedAt DateTime @updatedAt @map("updated_at")\n\n  // Relations\n  task Task @relation(fields: [taskId], references: [id], onDelete: Cascade)\n  user User @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@index([taskId], map: "idx_task_comments_task_id")\n  @@index([userId], map: "idx_task_comments_user_id")\n  @@map("task_comments")\n}\n\n// \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n// 12. TASK ATTACHMENT\n// ERD edges : Task \u2192 TaskAttachment, User \u2192 TaskAttachment\n// \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n\nmodel TaskAttachment {\n  id         String   @id @default(cuid()) @map("id")\n  taskId     String   @map("task_id")\n  uploadedBy String   @map("uploaded_by")\n  fileUrl    String   @map("file_url")\n  createdAt  DateTime @default(now()) @map("created_at")\n\n  // Relations\n  task     Task @relation(fields: [taskId], references: [id], onDelete: Cascade)\n  uploader User @relation("AttachmentUploader", fields: [uploadedBy], references: [id])\n\n  @@index([taskId], map: "idx_task_attachments_task_id")\n  @@index([uploadedBy], map: "idx_task_attachments_uploaded_by")\n  @@map("task_attachments")\n}\n\n// \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n// 13. LABEL\n// ERD edges : Project \u2192 Label, Label \u2192 TaskLabel\n// \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n\nmodel Label {\n  id        String @id @default(cuid()) @map("id")\n  projectId String @map("project_id")\n  name      String @map("name")\n  color     String @map("color") // hex e.g. "#3498db"\n\n  // Relations\n  project    Project     @relation(fields: [projectId], references: [id], onDelete: Cascade)\n  taskLabels TaskLabel[]\n\n  @@unique([projectId, name], map: "uq_label_project_name")\n  @@index([projectId], map: "idx_labels_project_id")\n  @@map("labels")\n}\n\n// \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n// 14. TASK LABEL  (pivot \u2014 Tasks \u2194 Labels)\n// ERD edges : Task \u2192 TaskLabel, Label \u2192 TaskLabel\n// Composite PK: [taskId, labelId]\n// \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n\nmodel TaskLabel {\n  taskId  String @map("task_id")\n  labelId String @map("label_id")\n\n  // Relations\n  task  Task  @relation(fields: [taskId], references: [id], onDelete: Cascade)\n  label Label @relation(fields: [labelId], references: [id], onDelete: Cascade)\n\n  @@id([taskId, labelId])\n  @@index([taskId], map: "idx_task_labels_task_id")\n  @@index([labelId], map: "idx_task_labels_label_id")\n  @@map("task_labels")\n}\n\n// \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n// 15. NOTIFICATION\n// ERD edges : User \u2192 Notification\n// \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n\nmodel Notification {\n  id        String           @id @default(cuid()) @map("id")\n  userId    String           @map("user_id")\n  type      NotificationType @default(GENERAL) @map("type")\n  title     String           @map("title")\n  body      String?          @map("body")\n  isRead    Boolean          @default(false) @map("is_read")\n  createdAt DateTime         @default(now()) @map("created_at")\n\n  // Relations\n  user User @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@index([userId], map: "idx_notifications_user_id")\n  @@index([isRead], map: "idx_notifications_is_read")\n  @@index([createdAt], map: "idx_notifications_created_at")\n  @@map("notifications")\n}\n\n// \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n// 16. ACTIVITY LOG\n// ERD edges : Organization \u2192 ActivityLog, User \u2192 ActivityLog\n// \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n\nmodel ActivityLog {\n  id             String   @id @default(cuid()) @map("id")\n  organizationId String   @map("organization_id")\n  actorId        String   @map("actor_id")\n  action         String   @map("action")\n  metadata       Json?    @map("metadata")\n  createdAt      DateTime @default(now()) @map("created_at")\n\n  // Relations\n  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)\n  actor        User         @relation("ActivityActor", fields: [actorId], references: [id])\n\n  @@index([organizationId], map: "idx_activity_logs_organization_id")\n  @@index([actorId], map: "idx_activity_logs_actor_id")\n  @@index([action], map: "idx_activity_logs_action")\n  @@index([createdAt], map: "idx_activity_logs_created_at")\n  @@map("activity_logs")\n}\n\n// \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n// 17. FILE\n// ERD edges : User \u2192 File (uploader)\n// \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n\nmodel File {\n  id         String   @id @default(cuid()) @map("id")\n  uploadedBy String   @map("uploaded_by")\n  url        String   @map("url")\n  mimeType   String?  @map("mime_type")\n  sizeBytes  Int?     @map("size_bytes")\n  createdAt  DateTime @default(now()) @map("created_at")\n\n  // Relations\n  uploader User @relation("FileUploader", fields: [uploadedBy], references: [id])\n\n  @@index([uploadedBy], map: "idx_files_uploaded_by")\n  @@index([mimeType], map: "idx_files_mime_type")\n  @@map("files")\n}\n\n// \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n// 18. API KEY\n// ERD edges : Organization \u2192 ApiKey\n// \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n\nmodel ApiKey {\n  id             String    @id @default(cuid()) @map("id")\n  organizationId String    @map("organization_id")\n  name           String    @map("name")\n  keyHash        String    @unique @map("key_hash")\n  keyPrefix      String    @map("key_prefix")\n  isActive       Boolean   @default(true) @map("is_active")\n  lastUsedAt     DateTime? @map("last_used_at")\n  expiresAt      DateTime? @map("expires_at")\n  createdAt      DateTime  @default(now()) @map("created_at")\n\n  // Relations\n  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)\n\n  @@index([organizationId], map: "idx_api_keys_organization_id")\n  @@index([isActive], map: "idx_api_keys_is_active")\n  @@map("api_keys")\n}\n\n// \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n// 19. PLAN\n// ERD edges : Plan \u2192 Subscription, Plan \u2192 PlanFeature\n// \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n\nmodel Plan {\n  id           String   @id @default(cuid()) @map("id")\n  name         String   @map("name")\n  slug         String   @unique @map("slug")\n  description  String?  @map("description")\n  priceMonthly Decimal  @map("price_monthly") @db.Decimal(10, 2)\n  priceYearly  Decimal  @map("price_yearly") @db.Decimal(10, 2)\n  currency     String   @default("USD") @map("currency")\n  trialDays    Int      @default(14) @map("trial_days")\n  isActive     Boolean  @default(true) @map("is_active")\n  createdAt    DateTime @default(now()) @map("created_at")\n  updatedAt    DateTime @updatedAt @map("updated_at")\n\n  // Relations\n  subscriptions Subscription[]\n  features      PlanFeature[]\n\n  @@index([isActive], map: "idx_plans_is_active")\n  @@index([slug], map: "idx_plans_slug")\n  @@map("plans")\n}\n\n// \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n// 20. SUBSCRIPTION  (1:1 with Organization)\n// ERD edges : Organization \u2192 Subscription (unique / 1:1)\n//             Plan \u2192 Subscription\n//             Subscription \u2192 Invoice\n// \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n\nmodel Subscription {\n  id                   String             @id @default(cuid()) @map("id")\n  organizationId       String             @unique @map("organization_id")\n  planId               String             @map("plan_id")\n  status               SubscriptionStatus @default(TRIALING) @map("status")\n  billingCycle         BillingCycle       @default(MONTHLY) @map("billing_cycle")\n  currentPeriodStart   DateTime           @map("current_period_start")\n  currentPeriodEnd     DateTime           @map("current_period_end")\n  trialEndsAt          DateTime?          @map("trial_ends_at")\n  canceledAt           DateTime?          @map("canceled_at")\n  cancelAtPeriodEnd    Boolean            @default(false) @map("cancel_at_period_end")\n  stripeCustomerId     String?            @unique @map("stripe_customer_id")\n  stripeSubscriptionId String?            @unique @map("stripe_subscription_id")\n  createdAt            DateTime           @default(now()) @map("created_at")\n  updatedAt            DateTime           @updatedAt @map("updated_at")\n\n  // Relations\n  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)\n  plan         Plan         @relation(fields: [planId], references: [id])\n  invoices     Invoice[]\n\n  @@index([organizationId], map: "idx_subscriptions_organization_id")\n  @@index([planId], map: "idx_subscriptions_plan_id")\n  @@index([status], map: "idx_subscriptions_status")\n  @@index([currentPeriodEnd], map: "idx_subscriptions_period_end")\n  @@map("subscriptions")\n}\n\n// \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n// 21. INVOICE\n// ERD edges : Subscription \u2192 Invoice\n// \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n\nmodel Invoice {\n  id              String        @id @default(cuid()) @map("id")\n  subscriptionId  String        @map("subscription_id")\n  status          InvoiceStatus @default(DRAFT) @map("status")\n  amountDue       Decimal       @map("amount_due") @db.Decimal(10, 2)\n  amountPaid      Decimal       @default(0) @map("amount_paid") @db.Decimal(10, 2)\n  currency        String        @default("USD") @map("currency")\n  periodStart     DateTime      @map("period_start")\n  periodEnd       DateTime      @map("period_end")\n  dueDate         DateTime?     @map("due_date")\n  paidAt          DateTime?     @map("paid_at")\n  stripeInvoiceId String?       @unique @map("stripe_invoice_id")\n  invoicePdfUrl   String?       @map("invoice_pdf_url")\n  createdAt       DateTime      @default(now()) @map("created_at")\n  updatedAt       DateTime      @updatedAt @map("updated_at")\n\n  // Relations\n  subscription Subscription @relation(fields: [subscriptionId], references: [id], onDelete: Cascade)\n\n  @@index([subscriptionId], map: "idx_invoices_subscription_id")\n  @@index([status], map: "idx_invoices_status")\n  @@index([paidAt], map: "idx_invoices_paid_at")\n  @@map("invoices")\n}\n\n// \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n// 22. PLAN FEATURE\n// ERD edges : Plan \u2192 PlanFeature\n// \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n\nmodel PlanFeature {\n  id          String   @id @default(cuid()) @map("id")\n  planId      String   @map("plan_id")\n  name        String   @map("name")\n  description String?  @map("description")\n  limitValue  Int?     @map("limit_value")\n  isEnabled   Boolean  @default(true) @map("is_enabled")\n  createdAt   DateTime @default(now()) @map("created_at")\n\n  // Relations\n  plan Plan @relation(fields: [planId], references: [id], onDelete: Cascade)\n\n  @@unique([planId, name], map: "uq_plan_feature_plan_name")\n  @@index([planId], map: "idx_plan_features_plan_id")\n  @@index([isEnabled], map: "idx_plan_features_is_enabled")\n  @@map("plan_features")\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  },
  "parameterizationSchema": {
    "strings": [],
    "graph": ""
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"image","kind":"scalar","type":"String","dbName":"avatar"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"status","kind":"enum","type":"UserStatus"},{"name":"needPasswordChange","kind":"scalar","type":"Boolean"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"ownedOrganizations","kind":"object","type":"Organization","relationName":"OrgOwner"},{"name":"memberships","kind":"object","type":"Membership","relationName":"MembershipToUser"},{"name":"projectMembers","kind":"object","type":"ProjectMember","relationName":"ProjectMemberToUser"},{"name":"assignedTasks","kind":"object","type":"Task","relationName":"TaskAssignee"},{"name":"taskComments","kind":"object","type":"TaskComment","relationName":"TaskCommentToUser"},{"name":"taskAttachments","kind":"object","type":"TaskAttachment","relationName":"AttachmentUploader"},{"name":"notifications","kind":"object","type":"Notification","relationName":"NotificationToUser"},{"name":"activityLogs","kind":"object","type":"ActivityLog","relationName":"ActivityActor"},{"name":"files","kind":"object","type":"File","relationName":"FileUploader"}],"dbName":"users"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"},"Organization":{"fields":[{"name":"id","kind":"scalar","type":"String","dbName":"id"},{"name":"ownerId","kind":"scalar","type":"String","dbName":"owner_id"},{"name":"name","kind":"scalar","type":"String","dbName":"name"},{"name":"slug","kind":"scalar","type":"String","dbName":"slug"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"owner","kind":"object","type":"User","relationName":"OrgOwner"},{"name":"roles","kind":"object","type":"Role","relationName":"OrganizationToRole"},{"name":"memberships","kind":"object","type":"Membership","relationName":"MembershipToOrganization"},{"name":"invitations","kind":"object","type":"Invitation","relationName":"InvitationToOrganization"},{"name":"projects","kind":"object","type":"Project","relationName":"OrganizationToProject"},{"name":"activityLogs","kind":"object","type":"ActivityLog","relationName":"ActivityLogToOrganization"},{"name":"apiKeys","kind":"object","type":"ApiKey","relationName":"ApiKeyToOrganization"},{"name":"subscription","kind":"object","type":"Subscription","relationName":"OrganizationToSubscription"}],"dbName":"organizations"},"Role":{"fields":[{"name":"id","kind":"scalar","type":"String","dbName":"id"},{"name":"organizationId","kind":"scalar","type":"String","dbName":"organization_id"},{"name":"name","kind":"scalar","type":"String","dbName":"name"},{"name":"organization","kind":"object","type":"Organization","relationName":"OrganizationToRole"},{"name":"rolePermissions","kind":"object","type":"RolePermission","relationName":"RoleToRolePermission"},{"name":"memberships","kind":"object","type":"Membership","relationName":"MembershipToRole"},{"name":"invitations","kind":"object","type":"Invitation","relationName":"InvitationToRole"}],"dbName":"roles"},"Permission":{"fields":[{"name":"id","kind":"scalar","type":"String","dbName":"id"},{"name":"action","kind":"scalar","type":"String","dbName":"action"},{"name":"resource","kind":"scalar","type":"String","dbName":"resource"},{"name":"rolePermissions","kind":"object","type":"RolePermission","relationName":"PermissionToRolePermission"}],"dbName":"permissions"},"RolePermission":{"fields":[{"name":"roleId","kind":"scalar","type":"String","dbName":"role_id"},{"name":"permissionId","kind":"scalar","type":"String","dbName":"permission_id"},{"name":"role","kind":"object","type":"Role","relationName":"RoleToRolePermission"},{"name":"permission","kind":"object","type":"Permission","relationName":"PermissionToRolePermission"}],"dbName":"role_permissions"},"Membership":{"fields":[{"name":"id","kind":"scalar","type":"String","dbName":"id"},{"name":"userId","kind":"scalar","type":"String","dbName":"user_id"},{"name":"organizationId","kind":"scalar","type":"String","dbName":"organization_id"},{"name":"roleId","kind":"scalar","type":"String","dbName":"role_id"},{"name":"joinedAt","kind":"scalar","type":"DateTime","dbName":"joined_at"},{"name":"user","kind":"object","type":"User","relationName":"MembershipToUser"},{"name":"organization","kind":"object","type":"Organization","relationName":"MembershipToOrganization"},{"name":"role","kind":"object","type":"Role","relationName":"MembershipToRole"}],"dbName":"memberships"},"Invitation":{"fields":[{"name":"id","kind":"scalar","type":"String","dbName":"id"},{"name":"organizationId","kind":"scalar","type":"String","dbName":"organization_id"},{"name":"roleId","kind":"scalar","type":"String","dbName":"role_id"},{"name":"email","kind":"scalar","type":"String","dbName":"email"},{"name":"token","kind":"scalar","type":"String","dbName":"token"},{"name":"acceptedAt","kind":"scalar","type":"DateTime","dbName":"accepted_at"},{"name":"expiresAt","kind":"scalar","type":"DateTime","dbName":"expires_at"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"organization","kind":"object","type":"Organization","relationName":"InvitationToOrganization"},{"name":"role","kind":"object","type":"Role","relationName":"InvitationToRole"}],"dbName":"invitations"},"Project":{"fields":[{"name":"id","kind":"scalar","type":"String","dbName":"id"},{"name":"organizationId","kind":"scalar","type":"String","dbName":"organization_id"},{"name":"name","kind":"scalar","type":"String","dbName":"name"},{"name":"description","kind":"scalar","type":"String","dbName":"description"},{"name":"createdBy","kind":"scalar","type":"String","dbName":"created_by"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"organization","kind":"object","type":"Organization","relationName":"OrganizationToProject"},{"name":"projectMembers","kind":"object","type":"ProjectMember","relationName":"ProjectToProjectMember"},{"name":"tasks","kind":"object","type":"Task","relationName":"ProjectToTask"},{"name":"labels","kind":"object","type":"Label","relationName":"LabelToProject"}],"dbName":"projects"},"ProjectMember":{"fields":[{"name":"id","kind":"scalar","type":"String","dbName":"id"},{"name":"projectId","kind":"scalar","type":"String","dbName":"project_id"},{"name":"userId","kind":"scalar","type":"String","dbName":"user_id"},{"name":"role","kind":"enum","type":"ProjectMemberRole","dbName":"role"},{"name":"joinedAt","kind":"scalar","type":"DateTime","dbName":"joined_at"},{"name":"project","kind":"object","type":"Project","relationName":"ProjectToProjectMember"},{"name":"user","kind":"object","type":"User","relationName":"ProjectMemberToUser"}],"dbName":"project_members"},"Task":{"fields":[{"name":"id","kind":"scalar","type":"String","dbName":"id"},{"name":"projectId","kind":"scalar","type":"String","dbName":"project_id"},{"name":"assignedTo","kind":"scalar","type":"String","dbName":"assigned_to"},{"name":"title","kind":"scalar","type":"String","dbName":"title"},{"name":"status","kind":"enum","type":"TaskStatus","dbName":"status"},{"name":"priority","kind":"enum","type":"TaskPriority","dbName":"priority"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"project","kind":"object","type":"Project","relationName":"ProjectToTask"},{"name":"assignee","kind":"object","type":"User","relationName":"TaskAssignee"},{"name":"comments","kind":"object","type":"TaskComment","relationName":"TaskToTaskComment"},{"name":"attachments","kind":"object","type":"TaskAttachment","relationName":"TaskToTaskAttachment"},{"name":"taskLabels","kind":"object","type":"TaskLabel","relationName":"TaskToTaskLabel"}],"dbName":"tasks"},"TaskComment":{"fields":[{"name":"id","kind":"scalar","type":"String","dbName":"id"},{"name":"taskId","kind":"scalar","type":"String","dbName":"task_id"},{"name":"userId","kind":"scalar","type":"String","dbName":"user_id"},{"name":"message","kind":"scalar","type":"String","dbName":"message"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"task","kind":"object","type":"Task","relationName":"TaskToTaskComment"},{"name":"user","kind":"object","type":"User","relationName":"TaskCommentToUser"}],"dbName":"task_comments"},"TaskAttachment":{"fields":[{"name":"id","kind":"scalar","type":"String","dbName":"id"},{"name":"taskId","kind":"scalar","type":"String","dbName":"task_id"},{"name":"uploadedBy","kind":"scalar","type":"String","dbName":"uploaded_by"},{"name":"fileUrl","kind":"scalar","type":"String","dbName":"file_url"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"task","kind":"object","type":"Task","relationName":"TaskToTaskAttachment"},{"name":"uploader","kind":"object","type":"User","relationName":"AttachmentUploader"}],"dbName":"task_attachments"},"Label":{"fields":[{"name":"id","kind":"scalar","type":"String","dbName":"id"},{"name":"projectId","kind":"scalar","type":"String","dbName":"project_id"},{"name":"name","kind":"scalar","type":"String","dbName":"name"},{"name":"color","kind":"scalar","type":"String","dbName":"color"},{"name":"project","kind":"object","type":"Project","relationName":"LabelToProject"},{"name":"taskLabels","kind":"object","type":"TaskLabel","relationName":"LabelToTaskLabel"}],"dbName":"labels"},"TaskLabel":{"fields":[{"name":"taskId","kind":"scalar","type":"String","dbName":"task_id"},{"name":"labelId","kind":"scalar","type":"String","dbName":"label_id"},{"name":"task","kind":"object","type":"Task","relationName":"TaskToTaskLabel"},{"name":"label","kind":"object","type":"Label","relationName":"LabelToTaskLabel"}],"dbName":"task_labels"},"Notification":{"fields":[{"name":"id","kind":"scalar","type":"String","dbName":"id"},{"name":"userId","kind":"scalar","type":"String","dbName":"user_id"},{"name":"type","kind":"enum","type":"NotificationType","dbName":"type"},{"name":"title","kind":"scalar","type":"String","dbName":"title"},{"name":"body","kind":"scalar","type":"String","dbName":"body"},{"name":"isRead","kind":"scalar","type":"Boolean","dbName":"is_read"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"user","kind":"object","type":"User","relationName":"NotificationToUser"}],"dbName":"notifications"},"ActivityLog":{"fields":[{"name":"id","kind":"scalar","type":"String","dbName":"id"},{"name":"organizationId","kind":"scalar","type":"String","dbName":"organization_id"},{"name":"actorId","kind":"scalar","type":"String","dbName":"actor_id"},{"name":"action","kind":"scalar","type":"String","dbName":"action"},{"name":"metadata","kind":"scalar","type":"Json","dbName":"metadata"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"organization","kind":"object","type":"Organization","relationName":"ActivityLogToOrganization"},{"name":"actor","kind":"object","type":"User","relationName":"ActivityActor"}],"dbName":"activity_logs"},"File":{"fields":[{"name":"id","kind":"scalar","type":"String","dbName":"id"},{"name":"uploadedBy","kind":"scalar","type":"String","dbName":"uploaded_by"},{"name":"url","kind":"scalar","type":"String","dbName":"url"},{"name":"mimeType","kind":"scalar","type":"String","dbName":"mime_type"},{"name":"sizeBytes","kind":"scalar","type":"Int","dbName":"size_bytes"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"uploader","kind":"object","type":"User","relationName":"FileUploader"}],"dbName":"files"},"ApiKey":{"fields":[{"name":"id","kind":"scalar","type":"String","dbName":"id"},{"name":"organizationId","kind":"scalar","type":"String","dbName":"organization_id"},{"name":"name","kind":"scalar","type":"String","dbName":"name"},{"name":"keyHash","kind":"scalar","type":"String","dbName":"key_hash"},{"name":"keyPrefix","kind":"scalar","type":"String","dbName":"key_prefix"},{"name":"isActive","kind":"scalar","type":"Boolean","dbName":"is_active"},{"name":"lastUsedAt","kind":"scalar","type":"DateTime","dbName":"last_used_at"},{"name":"expiresAt","kind":"scalar","type":"DateTime","dbName":"expires_at"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"organization","kind":"object","type":"Organization","relationName":"ApiKeyToOrganization"}],"dbName":"api_keys"},"Plan":{"fields":[{"name":"id","kind":"scalar","type":"String","dbName":"id"},{"name":"name","kind":"scalar","type":"String","dbName":"name"},{"name":"slug","kind":"scalar","type":"String","dbName":"slug"},{"name":"description","kind":"scalar","type":"String","dbName":"description"},{"name":"priceMonthly","kind":"scalar","type":"Decimal","dbName":"price_monthly"},{"name":"priceYearly","kind":"scalar","type":"Decimal","dbName":"price_yearly"},{"name":"currency","kind":"scalar","type":"String","dbName":"currency"},{"name":"trialDays","kind":"scalar","type":"Int","dbName":"trial_days"},{"name":"isActive","kind":"scalar","type":"Boolean","dbName":"is_active"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"subscriptions","kind":"object","type":"Subscription","relationName":"PlanToSubscription"},{"name":"features","kind":"object","type":"PlanFeature","relationName":"PlanToPlanFeature"}],"dbName":"plans"},"Subscription":{"fields":[{"name":"id","kind":"scalar","type":"String","dbName":"id"},{"name":"organizationId","kind":"scalar","type":"String","dbName":"organization_id"},{"name":"planId","kind":"scalar","type":"String","dbName":"plan_id"},{"name":"status","kind":"enum","type":"SubscriptionStatus","dbName":"status"},{"name":"billingCycle","kind":"enum","type":"BillingCycle","dbName":"billing_cycle"},{"name":"currentPeriodStart","kind":"scalar","type":"DateTime","dbName":"current_period_start"},{"name":"currentPeriodEnd","kind":"scalar","type":"DateTime","dbName":"current_period_end"},{"name":"trialEndsAt","kind":"scalar","type":"DateTime","dbName":"trial_ends_at"},{"name":"canceledAt","kind":"scalar","type":"DateTime","dbName":"canceled_at"},{"name":"cancelAtPeriodEnd","kind":"scalar","type":"Boolean","dbName":"cancel_at_period_end"},{"name":"stripeCustomerId","kind":"scalar","type":"String","dbName":"stripe_customer_id"},{"name":"stripeSubscriptionId","kind":"scalar","type":"String","dbName":"stripe_subscription_id"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"organization","kind":"object","type":"Organization","relationName":"OrganizationToSubscription"},{"name":"plan","kind":"object","type":"Plan","relationName":"PlanToSubscription"},{"name":"invoices","kind":"object","type":"Invoice","relationName":"InvoiceToSubscription"}],"dbName":"subscriptions"},"Invoice":{"fields":[{"name":"id","kind":"scalar","type":"String","dbName":"id"},{"name":"subscriptionId","kind":"scalar","type":"String","dbName":"subscription_id"},{"name":"status","kind":"enum","type":"InvoiceStatus","dbName":"status"},{"name":"amountDue","kind":"scalar","type":"Decimal","dbName":"amount_due"},{"name":"amountPaid","kind":"scalar","type":"Decimal","dbName":"amount_paid"},{"name":"currency","kind":"scalar","type":"String","dbName":"currency"},{"name":"periodStart","kind":"scalar","type":"DateTime","dbName":"period_start"},{"name":"periodEnd","kind":"scalar","type":"DateTime","dbName":"period_end"},{"name":"dueDate","kind":"scalar","type":"DateTime","dbName":"due_date"},{"name":"paidAt","kind":"scalar","type":"DateTime","dbName":"paid_at"},{"name":"stripeInvoiceId","kind":"scalar","type":"String","dbName":"stripe_invoice_id"},{"name":"invoicePdfUrl","kind":"scalar","type":"String","dbName":"invoice_pdf_url"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"updatedAt","kind":"scalar","type":"DateTime","dbName":"updated_at"},{"name":"subscription","kind":"object","type":"Subscription","relationName":"InvoiceToSubscription"}],"dbName":"invoices"},"PlanFeature":{"fields":[{"name":"id","kind":"scalar","type":"String","dbName":"id"},{"name":"planId","kind":"scalar","type":"String","dbName":"plan_id"},{"name":"name","kind":"scalar","type":"String","dbName":"name"},{"name":"description","kind":"scalar","type":"String","dbName":"description"},{"name":"limitValue","kind":"scalar","type":"Int","dbName":"limit_value"},{"name":"isEnabled","kind":"scalar","type":"Boolean","dbName":"is_enabled"},{"name":"createdAt","kind":"scalar","type":"DateTime","dbName":"created_at"},{"name":"plan","kind":"object","type":"Plan","relationName":"PlanToPlanFeature"}],"dbName":"plan_features"}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","user","sessions","accounts","owner","organization","role","rolePermissions","_count","permission","memberships","invitations","roles","project","projectMembers","assignee","task","comments","uploader","attachments","taskLabels","label","tasks","labels","projects","actor","activityLogs","apiKeys","subscriptions","plan","features","subscription","invoices","ownedOrganizations","assignedTasks","taskComments","taskAttachments","notifications","files","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","data","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","create","update","User.upsertOne","User.deleteOne","User.deleteMany","having","_min","_max","User.groupBy","User.aggregate","Session.findUnique","Session.findUniqueOrThrow","Session.findFirst","Session.findFirstOrThrow","Session.findMany","Session.createOne","Session.createMany","Session.createManyAndReturn","Session.updateOne","Session.updateMany","Session.updateManyAndReturn","Session.upsertOne","Session.deleteOne","Session.deleteMany","Session.groupBy","Session.aggregate","Account.findUnique","Account.findUniqueOrThrow","Account.findFirst","Account.findFirstOrThrow","Account.findMany","Account.createOne","Account.createMany","Account.createManyAndReturn","Account.updateOne","Account.updateMany","Account.updateManyAndReturn","Account.upsertOne","Account.deleteOne","Account.deleteMany","Account.groupBy","Account.aggregate","Verification.findUnique","Verification.findUniqueOrThrow","Verification.findFirst","Verification.findFirstOrThrow","Verification.findMany","Verification.createOne","Verification.createMany","Verification.createManyAndReturn","Verification.updateOne","Verification.updateMany","Verification.updateManyAndReturn","Verification.upsertOne","Verification.deleteOne","Verification.deleteMany","Verification.groupBy","Verification.aggregate","Organization.findUnique","Organization.findUniqueOrThrow","Organization.findFirst","Organization.findFirstOrThrow","Organization.findMany","Organization.createOne","Organization.createMany","Organization.createManyAndReturn","Organization.updateOne","Organization.updateMany","Organization.updateManyAndReturn","Organization.upsertOne","Organization.deleteOne","Organization.deleteMany","Organization.groupBy","Organization.aggregate","Role.findUnique","Role.findUniqueOrThrow","Role.findFirst","Role.findFirstOrThrow","Role.findMany","Role.createOne","Role.createMany","Role.createManyAndReturn","Role.updateOne","Role.updateMany","Role.updateManyAndReturn","Role.upsertOne","Role.deleteOne","Role.deleteMany","Role.groupBy","Role.aggregate","Permission.findUnique","Permission.findUniqueOrThrow","Permission.findFirst","Permission.findFirstOrThrow","Permission.findMany","Permission.createOne","Permission.createMany","Permission.createManyAndReturn","Permission.updateOne","Permission.updateMany","Permission.updateManyAndReturn","Permission.upsertOne","Permission.deleteOne","Permission.deleteMany","Permission.groupBy","Permission.aggregate","RolePermission.findUnique","RolePermission.findUniqueOrThrow","RolePermission.findFirst","RolePermission.findFirstOrThrow","RolePermission.findMany","RolePermission.createOne","RolePermission.createMany","RolePermission.createManyAndReturn","RolePermission.updateOne","RolePermission.updateMany","RolePermission.updateManyAndReturn","RolePermission.upsertOne","RolePermission.deleteOne","RolePermission.deleteMany","RolePermission.groupBy","RolePermission.aggregate","Membership.findUnique","Membership.findUniqueOrThrow","Membership.findFirst","Membership.findFirstOrThrow","Membership.findMany","Membership.createOne","Membership.createMany","Membership.createManyAndReturn","Membership.updateOne","Membership.updateMany","Membership.updateManyAndReturn","Membership.upsertOne","Membership.deleteOne","Membership.deleteMany","Membership.groupBy","Membership.aggregate","Invitation.findUnique","Invitation.findUniqueOrThrow","Invitation.findFirst","Invitation.findFirstOrThrow","Invitation.findMany","Invitation.createOne","Invitation.createMany","Invitation.createManyAndReturn","Invitation.updateOne","Invitation.updateMany","Invitation.updateManyAndReturn","Invitation.upsertOne","Invitation.deleteOne","Invitation.deleteMany","Invitation.groupBy","Invitation.aggregate","Project.findUnique","Project.findUniqueOrThrow","Project.findFirst","Project.findFirstOrThrow","Project.findMany","Project.createOne","Project.createMany","Project.createManyAndReturn","Project.updateOne","Project.updateMany","Project.updateManyAndReturn","Project.upsertOne","Project.deleteOne","Project.deleteMany","Project.groupBy","Project.aggregate","ProjectMember.findUnique","ProjectMember.findUniqueOrThrow","ProjectMember.findFirst","ProjectMember.findFirstOrThrow","ProjectMember.findMany","ProjectMember.createOne","ProjectMember.createMany","ProjectMember.createManyAndReturn","ProjectMember.updateOne","ProjectMember.updateMany","ProjectMember.updateManyAndReturn","ProjectMember.upsertOne","ProjectMember.deleteOne","ProjectMember.deleteMany","ProjectMember.groupBy","ProjectMember.aggregate","Task.findUnique","Task.findUniqueOrThrow","Task.findFirst","Task.findFirstOrThrow","Task.findMany","Task.createOne","Task.createMany","Task.createManyAndReturn","Task.updateOne","Task.updateMany","Task.updateManyAndReturn","Task.upsertOne","Task.deleteOne","Task.deleteMany","Task.groupBy","Task.aggregate","TaskComment.findUnique","TaskComment.findUniqueOrThrow","TaskComment.findFirst","TaskComment.findFirstOrThrow","TaskComment.findMany","TaskComment.createOne","TaskComment.createMany","TaskComment.createManyAndReturn","TaskComment.updateOne","TaskComment.updateMany","TaskComment.updateManyAndReturn","TaskComment.upsertOne","TaskComment.deleteOne","TaskComment.deleteMany","TaskComment.groupBy","TaskComment.aggregate","TaskAttachment.findUnique","TaskAttachment.findUniqueOrThrow","TaskAttachment.findFirst","TaskAttachment.findFirstOrThrow","TaskAttachment.findMany","TaskAttachment.createOne","TaskAttachment.createMany","TaskAttachment.createManyAndReturn","TaskAttachment.updateOne","TaskAttachment.updateMany","TaskAttachment.updateManyAndReturn","TaskAttachment.upsertOne","TaskAttachment.deleteOne","TaskAttachment.deleteMany","TaskAttachment.groupBy","TaskAttachment.aggregate","Label.findUnique","Label.findUniqueOrThrow","Label.findFirst","Label.findFirstOrThrow","Label.findMany","Label.createOne","Label.createMany","Label.createManyAndReturn","Label.updateOne","Label.updateMany","Label.updateManyAndReturn","Label.upsertOne","Label.deleteOne","Label.deleteMany","Label.groupBy","Label.aggregate","TaskLabel.findUnique","TaskLabel.findUniqueOrThrow","TaskLabel.findFirst","TaskLabel.findFirstOrThrow","TaskLabel.findMany","TaskLabel.createOne","TaskLabel.createMany","TaskLabel.createManyAndReturn","TaskLabel.updateOne","TaskLabel.updateMany","TaskLabel.updateManyAndReturn","TaskLabel.upsertOne","TaskLabel.deleteOne","TaskLabel.deleteMany","TaskLabel.groupBy","TaskLabel.aggregate","Notification.findUnique","Notification.findUniqueOrThrow","Notification.findFirst","Notification.findFirstOrThrow","Notification.findMany","Notification.createOne","Notification.createMany","Notification.createManyAndReturn","Notification.updateOne","Notification.updateMany","Notification.updateManyAndReturn","Notification.upsertOne","Notification.deleteOne","Notification.deleteMany","Notification.groupBy","Notification.aggregate","ActivityLog.findUnique","ActivityLog.findUniqueOrThrow","ActivityLog.findFirst","ActivityLog.findFirstOrThrow","ActivityLog.findMany","ActivityLog.createOne","ActivityLog.createMany","ActivityLog.createManyAndReturn","ActivityLog.updateOne","ActivityLog.updateMany","ActivityLog.updateManyAndReturn","ActivityLog.upsertOne","ActivityLog.deleteOne","ActivityLog.deleteMany","ActivityLog.groupBy","ActivityLog.aggregate","File.findUnique","File.findUniqueOrThrow","File.findFirst","File.findFirstOrThrow","File.findMany","File.createOne","File.createMany","File.createManyAndReturn","File.updateOne","File.updateMany","File.updateManyAndReturn","File.upsertOne","File.deleteOne","File.deleteMany","_avg","_sum","File.groupBy","File.aggregate","ApiKey.findUnique","ApiKey.findUniqueOrThrow","ApiKey.findFirst","ApiKey.findFirstOrThrow","ApiKey.findMany","ApiKey.createOne","ApiKey.createMany","ApiKey.createManyAndReturn","ApiKey.updateOne","ApiKey.updateMany","ApiKey.updateManyAndReturn","ApiKey.upsertOne","ApiKey.deleteOne","ApiKey.deleteMany","ApiKey.groupBy","ApiKey.aggregate","Plan.findUnique","Plan.findUniqueOrThrow","Plan.findFirst","Plan.findFirstOrThrow","Plan.findMany","Plan.createOne","Plan.createMany","Plan.createManyAndReturn","Plan.updateOne","Plan.updateMany","Plan.updateManyAndReturn","Plan.upsertOne","Plan.deleteOne","Plan.deleteMany","Plan.groupBy","Plan.aggregate","Subscription.findUnique","Subscription.findUniqueOrThrow","Subscription.findFirst","Subscription.findFirstOrThrow","Subscription.findMany","Subscription.createOne","Subscription.createMany","Subscription.createManyAndReturn","Subscription.updateOne","Subscription.updateMany","Subscription.updateManyAndReturn","Subscription.upsertOne","Subscription.deleteOne","Subscription.deleteMany","Subscription.groupBy","Subscription.aggregate","Invoice.findUnique","Invoice.findUniqueOrThrow","Invoice.findFirst","Invoice.findFirstOrThrow","Invoice.findMany","Invoice.createOne","Invoice.createMany","Invoice.createManyAndReturn","Invoice.updateOne","Invoice.updateMany","Invoice.updateManyAndReturn","Invoice.upsertOne","Invoice.deleteOne","Invoice.deleteMany","Invoice.groupBy","Invoice.aggregate","PlanFeature.findUnique","PlanFeature.findUniqueOrThrow","PlanFeature.findFirst","PlanFeature.findFirstOrThrow","PlanFeature.findMany","PlanFeature.createOne","PlanFeature.createMany","PlanFeature.createManyAndReturn","PlanFeature.updateOne","PlanFeature.updateMany","PlanFeature.updateManyAndReturn","PlanFeature.upsertOne","PlanFeature.deleteOne","PlanFeature.deleteMany","PlanFeature.groupBy","PlanFeature.aggregate","AND","OR","NOT","id","planId","name","description","limitValue","isEnabled","createdAt","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","subscriptionId","InvoiceStatus","status","amountDue","amountPaid","currency","periodStart","periodEnd","dueDate","paidAt","stripeInvoiceId","invoicePdfUrl","updatedAt","organizationId","SubscriptionStatus","BillingCycle","billingCycle","currentPeriodStart","currentPeriodEnd","trialEndsAt","canceledAt","cancelAtPeriodEnd","stripeCustomerId","stripeSubscriptionId","slug","priceMonthly","priceYearly","trialDays","isActive","every","some","none","keyHash","keyPrefix","lastUsedAt","expiresAt","uploadedBy","url","mimeType","sizeBytes","actorId","action","metadata","string_contains","string_starts_with","string_ends_with","array_starts_with","array_ends_with","array_contains","userId","NotificationType","type","title","body","isRead","taskId","labelId","projectId","color","fileUrl","message","assignedTo","TaskStatus","TaskPriority","priority","ProjectMemberRole","joinedAt","createdBy","roleId","email","token","acceptedAt","permissionId","resource","action_resource","ownerId","identifier","value","accountId","providerId","accessToken","refreshToken","idToken","accessTokenExpiresAt","refreshTokenExpiresAt","scope","password","ipAddress","userAgent","image","emailVerified","UserStatus","needPasswordChange","isDeleted","deletedAt","planId_name","projectId_name","taskId_labelId","projectId_userId","userId_organizationId","roleId_permissionId","organizationId_name","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","increment","decrement","multiply","divide"]'),
  graph: "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-ANAAJUGACH5A0AAlQYAIQMHAACjCwAg-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-gMBANwFACH7AwEA3AUAIfwDAQDdBQAh_QMCAI8GACEDFAAAoAsAIPwDAADTBgAg_QMAANMGACAKFAAAkAYAIMEDAACOBgAwwgMAAHQAEMMDAACOBgAwxAMBAAAAAcoDQADhBQAh-gMBANwFACH7AwEA3AUAIfwDAQDdBQAh_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_wkAIDsAAIEKACA8AACACgAgpgQAANMGACCnBAAA0wYAIKgEAADTBgAgqQQAANMGACCqBAAA0wYAIKsEAADTBgAgrAQAANMGACAQwQMAAIgGADDCAwAAwgEAEMMDAACIBgAwxAMBALUFACHKA0AAuQUAIeIDQAC5BQAhhwQBALUFACGkBAEAtQUAIaUEAQC1BQAhpgQBALYFACGnBAEAtgUAIagEAQC2BQAhqQRAAMkFACGqBEAAyQUAIasEAQC2BQAhrAQBALYFACEDAAAABwAgAQAAwQEAMDoAAMIBACADAAAABwAgAQAACAAwAgAACQAgCcEDAACHBgAwwgMAAMgBABDDAwAAhwYAMMQDAQAAAAHKA0AA4QUAIeIDQADhBQAh-QNAAOEFACGiBAEA3AUAIaMEAQDcBQAhAQAAAMUBACABAAAAxQEAIAnBAwAAhwYAMMIDAADIAQAQwwMAAIcGADDEAwEA3AUAIcoDQADhBQAh4gNAAOEFACH5A0AA4QUAIaIEAQDcBQAhowQBANwFACEAAwAAAMgBACABAADJAQAwAgAAxQEAIAMAAADIAQAgAQAAyQEAMAIAAMUBACADAAAAyAEAIAEAAMkBADACAADFAQAgBsQDAQAAAAHKA0AAAAAB4gNAAAAAAfkDQAAAAAGiBAEAAAABowQBAAAAAQEuAADNAQAgBsQDAQAAAAHKA0AAAAAB4gNAAAAAAfkDQAAAAAGiBAEAAAABowQBAAAAAQEuAADPAQAwAS4AAM8BADAGxAMBANkGACHKA0AA3QYAIeIDQADdBgAh-QNAAN0GACGiBAEA2QYAIaMEAQDZBgAhAgAAAMUBACAuAADSAQAgBsQDAQDZBgAhygNAAN0GACHiA0AA3QYAIfkDQADdBgAhogQBANkGACGjBAEA2QYAIQIAAADIAQAgLgAA1AEAIAIAAADIAQAgLgAA1AEAIAMAAADFAQAgNQAAzQEAIDYAANIBACABAAAAxQEAIAEAAADIAQAgAwoAAPwJACA7AAD-CQAgPAAA_QkAIAnBAwAAhgYAMMIDAADbAQAQwwMAAIYGADDEAwEAtQUAIcoDQAC5BQAh4gNAALkFACH5A0AAuQUAIaIEAQC1BQAhowQBALUFACEDAAAAyAEAIAEAANoBADA6AADbAQAgAwAAAMgBACABAADJAQAwAgAAxQEAIAEAAAANACABAAAADQAgAwAAAAsAIAEAAAwAMAIAAA0AIAMAAAALACABAAAMADACAAANACADAAAACwAgAQAADAAwAgAADQAgDQYAAPQJACAMAAD2CQAgDQAA9wkAIA4AAPUJACAaAAD4CQAgHAAA-QkAIB0AAPoJACAhAAD7CQAgxAMBAAAAAcYDAQAAAAHKA0AAAAAB7gMBAAAAAaEEAQAAAAEBLgAA4wEAIAXEAwEAAAABxgMBAAAAAcoDQAAAAAHuAwEAAAABoQQBAAAAAQEuAADlAQAwAS4AAOUBADANBgAApQkAIAwAAKcJACANAACoCQAgDgAApgkAIBoAAKkJACAcAACqCQAgHQAAqwkAICEAAKwJACDEAwEA2QYAIcYDAQDZBgAhygNAAN0GACHuAwEA2QYAIaEEAQDZBgAhAgAAAA0AIC4AAOgBACAFxAMBANkGACHGAwEA2QYAIcoDQADdBgAh7gMBANkGACGhBAEA2QYAIQIAAAALACAuAADqAQAgAgAAAAsAIC4AAOoBACADAAAADQAgNQAA4wEAIDYAAOgBACABAAAADQAgAQAAAAsAIAMKAACiCQAgOwAApAkAIDwAAKMJACAIwQMAAIUGADDCAwAA8QEAEMMDAACFBgAwxAMBALUFACHGAwEAtQUAIcoDQAC5BQAh7gMBALUFACGhBAEAtQUAIQMAAAALACABAADwAQAwOgAA8QEAIAMAAAALACABAAAMADACAAANACABAAAAEQAgAQAAABEAIAMAAAAPACABAAAQADACAAARACADAAAADwAgAQAAEAAwAgAAEQAgAwAAAA8AIAEAABAAMAIAABEAIAcHAACeCQAgCQAAnwkAIAwAAKAJACANAAChCQAgxAMBAAAAAcYDAQAAAAHjAwEAAAABAS4AAPkBACADxAMBAAAAAcYDAQAAAAHjAwEAAAABAS4AAPsBADABLgAA-wEAMAcHAAD5CAAgCQAA-ggAIAwAAPsIACANAAD8CAAgxAMBANkGACHGAwEA2QYAIeMDAQDZBgAhAgAAABEAIC4AAP4BACADxAMBANkGACHGAwEA2QYAIeMDAQDZBgAhAgAAAA8AIC4AAIACACACAAAADwAgLgAAgAIAIAMAAAARACA1AAD5AQAgNgAA_gEAIAEAAAARACABAAAADwAgAwoAAPYIACA7AAD4CAAgPAAA9wgAIAbBAwAAhAYAMMIDAACHAgAQwwMAAIQGADDEAwEAtQUAIcYDAQC1BQAh4wMBALUFACEDAAAADwAgAQAAhgIAMDoAAIcCACADAAAADwAgAQAAEAAwAgAAEQAgCAkAAIIGACDBAwAAgQYAMMIDAACNAgAQwwMAAIEGADDEAwEAAAAB_wMBANwFACGfBAEA3AUAIaAEAACDBgAgAQAAAIoCACABAAAAigIAIAcJAACCBgAgwQMAAIEGADDCAwAAjQIAEMMDAACBBgAwxAMBANwFACH_AwEA3AUAIZ8EAQDcBQAhAQkAAPUIACADAAAAjQIAIAEAAI4CADACAACKAgAgAwAAAI0CACABAACOAgAwAgAAigIAIAMAAACNAgAgAQAAjgIAMAIAAIoCACAECQAA9AgAIMQDAQAAAAH_AwEAAAABnwQBAAAAAQEuAACSAgAgA8QDAQAAAAH_AwEAAAABnwQBAAAAAQEuAACUAgAwAS4AAJQCADAECQAA5wgAIMQDAQDZBgAh_wMBANkGACGfBAEA2QYAIQIAAACKAgAgLgAAlwIAIAPEAwEA2QYAIf8DAQDZBgAhnwQBANkGACECAAAAjQIAIC4AAJkCACACAAAAjQIAIC4AAJkCACADAAAAigIAIDUAAJICACA2AACXAgAgAQAAAIoCACABAAAAjQIAIAMKAADkCAAgOwAA5ggAIDwAAOUIACAGwQMAAIAGADDCAwAAoAIAEMMDAACABgAwxAMBALUFACH_AwEAtQUAIZ8EAQC1BQAhAwAAAI0CACABAACfAgAwOgAAoAIAIAMAAACNAgAgAQAAjgIAMAIAAIoCACABAAAAFQAgAQAAABUAIAMAAAATACABAAAUADACAAAVACADAAAAEwAgAQAAFAAwAgAAFQAgAwAAABMAIAEAABQAMAIAABUAIAQIAADiCAAgCwAA4wgAIJoEAQAAAAGeBAEAAAABAS4AAKgCACACmgQBAAAAAZ4EAQAAAAEBLgAAqgIAMAEuAACqAgAwBAgAAOAIACALAADhCAAgmgQBANkGACGeBAEA2QYAIQIAAAAVACAuAACtAgAgApoEAQDZBgAhngQBANkGACECAAAAEwAgLgAArwIAIAIAAAATACAuAACvAgAgAwAAABUAIDUAAKgCACA2AACtAgAgAQAAABUAIAEAAAATACADCgAA3QgAIDsAAN8IACA8AADeCAAgBcEDAAD_BQAwwgMAALYCABDDAwAA_wUAMJoEAQC1BQAhngQBALUFACEDAAAAEwAgAQAAtQIAMDoAALYCACADAAAAEwAgAQAAFAAwAgAAFQAgAQAAABsAIAEAAAAbACADAAAAGQAgAQAAGgAwAgAAGwAgAwAAABkAIAEAABoAMAIAABsAIAMAAAAZACABAAAaADACAAAbACAIAwAA2ggAIAcAANsIACAIAADcCAAgxAMBAAAAAeMDAQAAAAGHBAEAAAABmARAAAAAAZoEAQAAAAEBLgAAvgIAIAXEAwEAAAAB4wMBAAAAAYcEAQAAAAGYBEAAAAABmgQBAAAAAQEuAADAAgAwAS4AAMACADAIAwAA1wgAIAcAANgIACAIAADZCAAgxAMBANkGACHjAwEA2QYAIYcEAQDZBgAhmARAAN0GACGaBAEA2QYAIQIAAAAbACAuAADDAgAgBcQDAQDZBgAh4wMBANkGACGHBAEA2QYAIZgEQADdBgAhmgQBANkGACECAAAAGQAgLgAAxQIAIAIAAAAZACAuAADFAgAgAwAAABsAIDUAAL4CACA2AADDAgAgAQAAABsAIAEAAAAZACADCgAA1AgAIDsAANYIACA8AADVCAAgCMEDAAD-BQAwwgMAAMwCABDDAwAA_gUAMMQDAQC1BQAh4wMBALUFACGHBAEAtQUAIZgEQAC5BQAhmgQBALUFACEDAAAAGQAgAQAAywIAMDoAAMwCACADAAAAGQAgAQAAGgAwAgAAGwAgAQAAAB8AIAEAAAAfACADAAAAHQAgAQAAHgAwAgAAHwAgAwAAAB0AIAEAAB4AMAIAAB8AIAMAAAAdACABAAAeADACAAAfACAKBwAA0ggAIAgAANMIACDEAwEAAAABygNAAAAAAeMDAQAAAAH5A0AAAAABmgQBAAAAAZsEAQAAAAGcBAEAAAABnQRAAAAAAQEuAADUAgAgCMQDAQAAAAHKA0AAAAAB4wMBAAAAAfkDQAAAAAGaBAEAAAABmwQBAAAAAZwEAQAAAAGdBEAAAAABAS4AANYCADABLgAA1gIAMAoHAADQCAAgCAAA0QgAIMQDAQDZBgAhygNAAN0GACHjAwEA2QYAIfkDQADnBgAhmgQBANkGACGbBAEA2QYAIZwEAQDZBgAhnQRAAOcGACECAAAAHwAgLgAA2QIAIAjEAwEA2QYAIcoDQADdBgAh4wMBANkGACH5A0AA5wYAIZoEAQDZBgAhmwQBANkGACGcBAEA2QYAIZ0EQADnBgAhAgAAAB0AIC4AANsCACACAAAAHQAgLgAA2wIAIAMAAAAfACA1AADUAgAgNgAA2QIAIAEAAAAfACABAAAAHQAgBQoAAM0IACA7AADPCAAgPAAAzggAIPkDAADTBgAgnQQAANMGACALwQMAAP0FADDCAwAA4gIAEMMDAAD9BQAwxAMBALUFACHKA0AAuQUAIeMDAQC1BQAh-QNAAMkFACGaBAEAtQUAIZsEAQC1BQAhnAQBALUFACGdBEAAyQUAIQMAAAAdACABAADhAgAwOgAA4gIAIAMAAAAdACABAAAeADACAAAfACABAAAAKAAgAQAAACgAIAMAAAAmACABAAAnADACAAAoACADAAAAJgAgAQAAJwAwAgAAKAAgAwAAACYAIAEAACcAMAIAACgAIAsHAADJCAAgEAAAyggAIBgAAMsIACAZAADMCAAgxAMBAAAAAcYDAQAAAAHHAwEAAAABygNAAAAAAeIDQAAAAAHjAwEAAAABmQQBAAAAAQEuAADqAgAgB8QDAQAAAAHGAwEAAAABxwMBAAAAAcoDQAAAAAHiA0AAAAAB4wMBAAAAAZkEAQAAAAEBLgAA7AIAMAEuAADsAgAwCwcAAKEIACAQAACiCAAgGAAAowgAIBkAAKQIACDEAwEA2QYAIcYDAQDZBgAhxwMBANoGACHKA0AA3QYAIeIDQADdBgAh4wMBANkGACGZBAEA2QYAIQIAAAAoACAuAADvAgAgB8QDAQDZBgAhxgMBANkGACHHAwEA2gYAIcoDQADdBgAh4gNAAN0GACHjAwEA2QYAIZkEAQDZBgAhAgAAACYAIC4AAPECACACAAAAJgAgLgAA8QIAIAMAAAAoACA1AADqAgAgNgAA7wIAIAEAAAAoACABAAAAJgAgBAoAAJ4IACA7AACgCAAgPAAAnwgAIMcDAADTBgAgCsEDAAD8BQAwwgMAAPgCABDDAwAA_AUAMMQDAQC1BQAhxgMBALUFACHHAwEAtgUAIcoDQAC5BQAh4gNAALkFACHjAwEAtQUAIZkEAQC1BQAhAwAAACYAIAEAAPcCADA6AAD4AgAgAwAAACYAIAEAACcAMAIAACgAIAEAAAAsACABAAAALAAgAwAAACoAIAEAACsAMAIAACwAIAMAAAAqACABAAArADACAAAsACADAAAAKgAgAQAAKwAwAgAALAAgBwMAAJ0IACAIAAAAmAQCDwAAnAgAIMQDAQAAAAGHBAEAAAABjwQBAAAAAZgEQAAAAAEBLgAAgAMAIAUIAAAAmAQCxAMBAAAAAYcEAQAAAAGPBAEAAAABmARAAAAAAQEuAACCAwAwAS4AAIIDADAHAwAAmwgAIAgAAJkImAQiDwAAmggAIMQDAQDZBgAhhwQBANkGACGPBAEA2QYAIZgEQADdBgAhAgAAACwAIC4AAIUDACAFCAAAmQiYBCLEAwEA2QYAIYcEAQDZBgAhjwQBANkGACGYBEAA3QYAIQIAAAAqACAuAACHAwAgAgAAACoAIC4AAIcDACADAAAALAAgNQAAgAMAIDYAAIUDACABAAAALAAgAQAAACoAIAMKAACWCAAgOwAAmAgAIDwAAJcIACAICAAA-QWYBCLBAwAA-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_BwAgBcEDAADtBQAwwgMAAP4DABDDAwAA7QUAMI0EAQC1BQAhjgQBALUFACEDAAAAPAAgAQAA_QMAMDoAAP4DACADAAAAPAAgAQAAPQAwAgAAPgAgAQAAAHEAIAEAAABxACADAAAAbwAgAQAAcAAwAgAAcQAgAwAAAG8AIAEAAHAAMAIAAHEAIAMAAABvACABAABwADACAABxACAIAwAAvQcAIMQDAQAAAAHKA0AAAAABhwQBAAAAAYkEAAAAiQQCigQBAAAAAYsEAQAAAAGMBCAAAAABAS4AAIYEACAHxAMBAAAAAcoDQAAAAAGHBAEAAAABiQQAAACJBAKKBAEAAAABiwQBAAAAAYwEIAAAAAEBLgAAiAQAMAEuAACIBAAwCAMAALwHACDEAwEA2QYAIcoDQADdBgAhhwQBANkGACGJBAAAuweJBCKKBAEA2QYAIYsEAQDaBgAhjAQgANwGACECAAAAcQAgLgAAiwQAIAfEAwEA2QYAIcoDQADdBgAhhwQBANkGACGJBAAAuweJBCKKBAEA2QYAIYsEAQDaBgAhjAQgANwGACECAAAAbwAgLgAAjQQAIAIAAABvACAuAACNBAAgAwAAAHEAIDUAAIYEACA2AACLBAAgAQAAAHEAIAEAAABvACAECgAAuAcAIDsAALoHACA8AAC5BwAgiwQAANMGACAKwQMAAOkFADDCAwAAlAQAEMMDAADpBQAwxAMBALUFACHKA0AAuQUAIYcEAQC1BQAhiQQAAOoFiQQiigQBALUFACGLBAEAtgUAIYwEIAC4BQAhAwAAAG8AIAEAAJMEADA6AACUBAAgAwAAAG8AIAEAAHAAMAIAAHEAIAEAAABOACABAAAATgAgAwAAAEwAIAEAAE0AMAIAAE4AIAMAAABMACABAABNADACAABOACADAAAATAAgAQAATQAwAgAATgAgCAcAALYHACAbAAC3BwAgxAMBAAAAAcoDQAAAAAHjAwEAAAAB_gMBAAAAAf8DAQAAAAGABIAAAAABAS4AAJwEACAGxAMBAAAAAcoDQAAAAAHjAwEAAAAB_gMBAAAAAf8DAQAAAAGABIAAAAABAS4AAJ4EADABLgAAngQAMAgHAAC0BwAgGwAAtQcAIMQDAQDZBgAhygNAAN0GACHjAwEA2QYAIf4DAQDZBgAh_wMBANkGACGABIAAAAABAgAAAE4AIC4AAKEEACAGxAMBANkGACHKA0AA3QYAIeMDAQDZBgAh_gMBANkGACH_AwEA2QYAIYAEgAAAAAECAAAATAAgLgAAowQAIAIAAABMACAuAACjBAAgAwAAAE4AIDUAAJwEACA2AAChBAAgAQAAAE4AIAEAAABMACAECgAAsQcAIDsAALMHACA8AACyBwAggAQAANMGACAJwQMAAOYFADDCAwAAqgQAEMMDAADmBQAwxAMBALUFACHKA0AAuQUAIeMDAQC1BQAh_gMBALUFACH_AwEAtQUAIYAEAADnBQAgAwAAAEwAIAEAAKkEADA6AACqBAAgAwAAAEwAIAEAAE0AMAIAAE4AIAEAAAB2ACABAAAAdgAgAwAAAHQAIAEAAHUAMAIAAHYAIAMAAAB0ACABAAB1ADACAAB2ACADAAAAdAAgAQAAdQAwAgAAdgAgBxQAALAHACDEAwEAAAABygNAAAAAAfoDAQAAAAH7AwEAAAAB_AMBAAAAAf0DAgAAAAEBLgAAsgQAIAbEAwEAAAABygNAAAAAAfoDAQAAAAH7AwEAAAAB_AMBAAAAAf0DAgAAAAEBLgAAtAQAMAEuAAC0BAAwBxQAAK8HACDEAwEA2QYAIcoDQADdBgAh-gMBANkGACH7AwEA2QYAIfwDAQDaBgAh_QMCANsGACECAAAAdgAgLgAAtwQAIAbEAwEA2QYAIcoDQADdBgAh-gMBANkGACH7AwEA2QYAIfwDAQDaBgAh_QMCANsGACECAAAAdAAgLgAAuQQAIAIAAAB0ACAuAAC5BAAgAwAAAHYAIDUAALIEACA2AAC3BAAgAQAAAHYAIAEAAAB0ACAHCgAAqgcAIDsAAK0HACA8AACsBwAg7QIAAKsHACDuAgAArgcAIPwDAADTBgAg_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_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_MDAABUACD0AwAAVAAg9QMAAFQAIAPzAwAAWQAg9AMAAFkAIPUDAABZACAMwQMAAOQFADDCAwAA1gQAEMMDAADkBQAwxAMBALUFACHGAwEAtQUAIcoDQAC5BQAh4wMBALUFACHyAyAAuAUAIfYDAQC1BQAh9wMBALUFACH4A0AAyQUAIfkDQADJBQAhCcEDAADlBQAwwgMAAMAEABDDAwAA5QUAMMQDAQC1BQAhygNAALkFACH6AwEAtQUAIfsDAQC1BQAh_AMBALYFACH9AwIAtwUAIQnBAwAA5gUAMMIDAACqBAAQwwMAAOYFADDEAwEAtQUAIcoDQAC5BQAh4wMBALUFACH-AwEAtQUAIf8DAQC1BQAhgAQAAOcFACAPCgAAwAUAIDsAAOgFACA8AADoBQAgywOAAAAAAc4DgAAAAAHPA4AAAAAB0AOAAAAAAdEDgAAAAAHSA4AAAAABgQQBAAAAAYIEAQAAAAGDBAEAAAABhASAAAAAAYUEgAAAAAGGBIAAAAABDMsDgAAAAAHOA4AAAAABzwOAAAAAAdADgAAAAAHRA4AAAAAB0gOAAAAAAYEEAQAAAAGCBAEAAAABgwQBAAAAAYQEgAAAAAGFBIAAAAABhgSAAAAAAQrBAwAA6QUAMMIDAACUBAAQwwMAAOkFADDEAwEAtQUAIcoDQAC5BQAhhwQBALUFACGJBAAA6gWJBCKKBAEAtQUAIYsEAQC2BQAhjAQgALgFACEHCgAAuwUAIDsAAOwFACA8AADsBQAgywMAAACJBALMAwAAAIkECM0DAAAAiQQI0gMAAOsFiQQiBwoAALsFACA7AADsBQAgPAAA7AUAIMsDAAAAiQQCzAMAAACJBAjNAwAAAIkECNIDAADrBYkEIgTLAwAAAIkEAswDAAAAiQQIzQMAAACJBAjSAwAA7AWJBCIFwQMAAO0FADDCAwAA_gMAEMMDAADtBQAwjQQBALUFACGOBAEAtQUAIQfBAwAA7gUAMMIDAADoAwAQwwMAAO4FADDEAwEAtQUAIcYDAQC1BQAhjwQBALUFACGQBAEAtQUAIQjBAwAA7wUAMMIDAADSAwAQwwMAAO8FADDEAwEAtQUAIcoDQAC5BQAh-gMBALUFACGNBAEAtQUAIZEEAQC1BQAhCcEDAADwBQAwwgMAALwDABDDAwAA8AUAMMQDAQC1BQAhygNAALkFACHiA0AAuQUAIYcEAQC1BQAhjQQBALUFACGSBAEAtQUAIQvBAwAA8QUAMMIDAACmAwAQwwMAAPEFADDEAwEAtQUAIcoDQAC5BQAh2AMAAPIFlQQi4gNAALkFACGKBAEAtQUAIY8EAQC1BQAhkwQBALYFACGWBAAA8wWWBCIHCgAAuwUAIDsAAPcFACA8AAD3BQAgywMAAACVBALMAwAAAJUECM0DAAAAlQQI0gMAAPYFlQQiBwoAALsFACA7AAD1BQAgPAAA9QUAIMsDAAAAlgQCzAMAAACWBAjNAwAAAJYECNIDAAD0BZYEIgcKAAC7BQAgOwAA9QUAIDwAAPUFACDLAwAAAJYEAswDAAAAlgQIzQMAAACWBAjSAwAA9AWWBCIEywMAAACWBALMAwAAAJYECM0DAAAAlgQI0gMAAPUFlgQiBwoAALsFACA7AAD3BQAgPAAA9wUAIMsDAAAAlQQCzAMAAACVBAjNAwAAAJUECNIDAAD2BZUEIgTLAwAAAJUEAswDAAAAlQQIzQMAAACVBAjSAwAA9wWVBCIICAAA-QWYBCLBAwAA-AUAMMIDAACOAwAQwwMAAPgFADDEAwEAtQUAIYcEAQC1BQAhjwQBALUFACGYBEAAuQUAIQcKAAC7BQAgOwAA-wUAIDwAAPsFACDLAwAAAJgEAswDAAAAmAQIzQMAAACYBAjSAwAA-gWYBCIHCgAAuwUAIDsAAPsFACA8AAD7BQAgywMAAACYBALMAwAAAJgECM0DAAAAmAQI0gMAAPoFmAQiBMsDAAAAmAQCzAMAAACYBAjNAwAAAJgECNIDAAD7BZgEIgrBAwAA_AUAMMIDAAD4AgAQwwMAAPwFADDEAwEAtQUAIcYDAQC1BQAhxwMBALYFACHKA0AAuQUAIeIDQAC5BQAh4wMBALUFACGZBAEAtQUAIQvBAwAA_QUAMMIDAADiAgAQwwMAAP0FADDEAwEAtQUAIcoDQAC5BQAh4wMBALUFACH5A0AAyQUAIZoEAQC1BQAhmwQBALUFACGcBAEAtQUAIZ0EQADJBQAhCMEDAAD-BQAwwgMAAMwCABDDAwAA_gUAMMQDAQC1BQAh4wMBALUFACGHBAEAtQUAIZgEQAC5BQAhmgQBALUFACEFwQMAAP8FADDCAwAAtgIAEMMDAAD_BQAwmgQBALUFACGeBAEAtQUAIQbBAwAAgAYAMMIDAACgAgAQwwMAAIAGADDEAwEAtQUAIf8DAQC1BQAhnwQBALUFACEHCQAAggYAIMEDAACBBgAwwgMAAI0CABDDAwAAgQYAMMQDAQDcBQAh_wMBANwFACGfBAEA3AUAIQPzAwAAEwAg9AMAABMAIPUDAAATACAC_wMBAAAAAZ8EAQAAAAEGwQMAAIQGADDCAwAAhwIAEMMDAACEBgAwxAMBALUFACHGAwEAtQUAIeMDAQC1BQAhCMEDAACFBgAwwgMAAPEBABDDAwAAhQYAMMQDAQC1BQAhxgMBALUFACHKA0AAuQUAIe4DAQC1BQAhoQQBALUFACEJwQMAAIYGADDCAwAA2wEAEMMDAACGBgAwxAMBALUFACHKA0AAuQUAIeIDQAC5BQAh-QNAALkFACGiBAEAtQUAIaMEAQC1BQAhCcEDAACHBgAwwgMAAMgBABDDAwAAhwYAMMQDAQDcBQAhygNAAOEFACHiA0AA4QUAIfkDQADhBQAhogQBANwFACGjBAEA3AUAIRDBAwAAiAYAMMIDAADCAQAQwwMAAIgGADDEAwEAtQUAIcoDQAC5BQAh4gNAALkFACGHBAEAtQUAIaQEAQC1BQAhpQQBALUFACGmBAEAtgUAIacEAQC2BQAhqAQBALYFACGpBEAAyQUAIaoEQADJBQAhqwQBALYFACGsBAEAtgUAIQvBAwAAiQYAMMIDAACsAQAQwwMAAIkGADDEAwEAtQUAIcoDQAC5BQAh4gNAALkFACH5A0AAuQUAIYcEAQC1BQAhnAQBALUFACGtBAEAtgUAIa4EAQC2BQAhDsEDAACKBgAwwgMAAJYBABDDAwAAigYAMMQDAQC1BQAhxgMBALUFACHKA0AAuQUAIdgDAACLBrIEIuIDQAC5BQAhmwQBALUFACGvBAEAtgUAIbAEIAC4BQAhsgQgALgFACGzBCAAuAUAIbQEQADJBQAhBwoAALsFACA7AACNBgAgPAAAjQYAIMsDAAAAsgQCzAMAAACyBAjNAwAAALIECNIDAACMBrIEIgcKAAC7BQAgOwAAjQYAIDwAAI0GACDLAwAAALIEAswDAAAAsgQIzQMAAACyBAjSAwAAjAayBCIEywMAAACyBALMAwAAALIECM0DAAAAsgQI0gMAAI0GsgQiChQAAJAGACDBAwAAjgYAMMIDAAB0ABDDAwAAjgYAMMQDAQDcBQAhygNAAOEFACH6AwEA3AUAIfsDAQDcBQAh_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_gMBANwFACH_AwEA3AUAIYAEAAChBgAgDMsDgAAAAAHOA4AAAAABzwOAAAAAAdADgAAAAAHRA4AAAAAB0gOAAAAAAYEEAQAAAAGCBAEAAAABgwQBAAAAAYQEgAAAAAGFBIAAAAABhgSAAAAAAQLGAwEAAAABjwQBAAAAAQkPAACkBgAgFgAApQYAIMEDAACjBgAwwgMAAEUAEMMDAACjBgAwxAMBANwFACHGAwEA3AUAIY8EAQDcBQAhkAQBANwFACEQBwAAnQYAIBAAALIGACAYAACzBgAgGQAAwQYAIMEDAADABgAwwgMAACYAEMMDAADABgAwxAMBANwFACHGAwEA3AUAIccDAQDdBQAhygNAAOEFACHiA0AA4QUAIeMDAQDcBQAhmQQBANwFACG8BAAAJgAgvQQAACYAIAPzAwAAPAAg9AMAADwAIPUDAAA8ACACjQQBAAAAAY4EAQAAAAEHEgAAqAYAIBcAAKkGACDBAwAApwYAMMIDAAA8ABDDAwAApwYAMI0EAQDcBQAhjgQBANwFACESDwAApAYAIBEAALwGACATAAC0BgAgFQAAtQYAIBYAAKUGACDBAwAAuQYAMMIDAAAuABDDAwAAuQYAMMQDAQDcBQAhygNAAOEFACHYAwAAugaVBCLiA0AA4QUAIYoEAQDcBQAhjwQBANwFACGTBAEA3QUAIZYEAAC7BpYEIrwEAAAuACC9BAAALgAgCw8AAKQGACAWAAClBgAgwQMAAKMGADDCAwAARQAQwwMAAKMGADDEAwEA3AUAIcYDAQDcBQAhjwQBANwFACGQBAEA3AUAIbwEAABFACC9BAAARQAgChIAAKgGACAUAACQBgAgwQMAAKoGADDCAwAAOAAQwwMAAKoGADDEAwEA3AUAIcoDQADhBQAh-gMBANwFACGNBAEA3AUAIZEEAQDcBQAhCwMAAJAGACASAACoBgAgwQMAAKsGADDCAwAANAAQwwMAAKsGADDEAwEA3AUAIcoDQADhBQAh4gNAAOEFACGHBAEA3AUAIY0EAQDcBQAhkgQBANwFACEZBAAArgYAIAUAAK8GACAMAACxBgAgEAAAsgYAIBwAALcGACAjAACwBgAgJAAAswYAICUAALQGACAmAAC1BgAgJwAAtgYAICgAALgGACDBAwAArAYAMMIDAAAyABDDAwAArAYAMMQDAQDcBQAhxgMBANwFACHKA0AA4QUAIdgDAACtBrIEIuIDQADhBQAhmwQBANwFACGvBAEA3QUAIbAEIADgBQAhsgQgAOAFACGzBCAA4AUAIbQEQACVBgAhBMsDAAAAsgQCzAMAAACyBAjNAwAAALIECNIDAACNBrIEIgPzAwAAAwAg9AMAAAMAIPUDAAADACAD8wMAAAcAIPQDAAAHACD1AwAABwAgA_MDAAALACD0AwAACwAg9QMAAAsAIAPzAwAAGQAg9AMAABkAIPUDAAAZACAD8wMAACoAIPQDAAAqACD1AwAAKgAgA_MDAAAuACD0AwAALgAg9QMAAC4AIAPzAwAANAAg9AMAADQAIPUDAAA0ACAD8wMAADgAIPQDAAA4ACD1AwAAOAAgA_MDAABvACD0AwAAbwAg9QMAAG8AIAPzAwAATAAg9AMAAEwAIPUDAABMACAD8wMAAHQAIPQDAAB0ACD1AwAAdAAgEA8AAKQGACARAAC8BgAgEwAAtAYAIBUAALUGACAWAAClBgAgwQMAALkGADDCAwAALgAQwwMAALkGADDEAwEA3AUAIcoDQADhBQAh2AMAALoGlQQi4gNAAOEFACGKBAEA3AUAIY8EAQDcBQAhkwQBAN0FACGWBAAAuwaWBCIEywMAAACVBALMAwAAAJUECM0DAAAAlQQI0gMAAPcFlQQiBMsDAAAAlgQCzAMAAACWBAjNAwAAAJYECNIDAAD1BZYEIhsEAACuBgAgBQAArwYAIAwAALEGACAQAACyBgAgHAAAtwYAICMAALAGACAkAACzBgAgJQAAtAYAICYAALUGACAnAAC2BgAgKAAAuAYAIMEDAACsBgAwwgMAADIAEMMDAACsBgAwxAMBANwFACHGAwEA3AUAIcoDQADhBQAh2AMAAK0GsgQi4gNAAOEFACGbBAEA3AUAIa8EAQDdBQAhsAQgAOAFACGyBCAA4AUAIbMEIADgBQAhtARAAJUGACG8BAAAMgAgvQQAADIAIAKHBAEAAAABjwQBAAAAAQoDAACQBgAgCAAAvwaYBCIPAACkBgAgwQMAAL4GADDCAwAAKgAQwwMAAL4GADDEAwEA3AUAIYcEAQDcBQAhjwQBANwFACGYBEAA4QUAIQTLAwAAAJgEAswDAAAAmAQIzQMAAACYBAjSAwAA-wWYBCIOBwAAnQYAIBAAALIGACAYAACzBgAgGQAAwQYAIMEDAADABgAwwgMAACYAEMMDAADABgAwxAMBANwFACHGAwEA3AUAIccDAQDdBQAhygNAAOEFACHiA0AA4QUAIeMDAQDcBQAhmQQBANwFACED8wMAAEUAIPQDAABFACD1AwAARQAgDQcAAJ0GACAIAADDBgAgwQMAAMIGADDCAwAAHQAQwwMAAMIGADDEAwEA3AUAIcoDQADhBQAh4wMBANwFACH5A0AAlQYAIZoEAQDcBQAhmwQBANwFACGcBAEA3AUAIZ0EQACVBgAhDAcAAJ0GACAJAACCBgAgDAAAsQYAIA0AAMsGACDBAwAAygYAMMIDAAAPABDDAwAAygYAMMQDAQDcBQAhxgMBANwFACHjAwEA3AUAIbwEAAAPACC9BAAADwAgAuMDAQAAAAGHBAEAAAABCwMAAJAGACAHAACdBgAgCAAAwwYAIMEDAADFBgAwwgMAABkAEMMDAADFBgAwxAMBANwFACHjAwEA3AUAIYcEAQDcBQAhmARAAOEFACGaBAEA3AUAIQKaBAEAAAABngQBAAAAAQcIAADDBgAgCwAAyAYAIMEDAADHBgAwwgMAABMAEMMDAADHBgAwmgQBANwFACGeBAEA3AUAIQkJAACCBgAgwQMAAIEGADDCAwAAjQIAEMMDAACBBgAwxAMBANwFACH_AwEA3AUAIZ8EAQDcBQAhvAQAAI0CACC9BAAAjQIAIALGAwEAAAAB4wMBAAAAAQoHAACdBgAgCQAAggYAIAwAALEGACANAADLBgAgwQMAAMoGADDCAwAADwAQwwMAAMoGADDEAwEA3AUAIcYDAQDcBQAh4wMBANwFACED8wMAAB0AIPQDAAAdACD1AwAAHQAgEAYAAJAGACAMAACxBgAgDQAAywYAIA4AAM0GACAaAADOBgAgHAAAtwYAIB0AAM8GACAhAADQBgAgwQMAAMwGADDCAwAACwAQwwMAAMwGADDEAwEA3AUAIcYDAQDcBQAhygNAAOEFACHuAwEA3AUAIaEEAQDcBQAhA_MDAAAPACD0AwAADwAg9QMAAA8AIAPzAwAAJgAg9AMAACYAIPUDAAAmACAD8wMAAFAAIPQDAABQACD1AwAAUAAgFgcAAJ0GACAfAACZBgAgIgAAngYAIMEDAACaBgAwwgMAAFQAEMMDAACaBgAwxAMBANwFACHFAwEA3AUAIcoDQADhBQAh2AMAAJsG5QMi4gNAAOEFACHjAwEA3AUAIeYDAACcBuYDIucDQADhBQAh6ANAAOEFACHpA0AAlQYAIeoDQACVBgAh6wMgAOAFACHsAwEA3QUAIe0DAQDdBQAhvAQAAFQAIL0EAABUACARAwAAkAYAIMEDAADRBgAwwgMAAAcAEMMDAADRBgAwxAMBANwFACHKA0AA4QUAIeIDQADhBQAhhwQBANwFACGkBAEA3AUAIaUEAQDcBQAhpgQBAN0FACGnBAEA3QUAIagEAQDdBQAhqQRAAJUGACGqBEAAlQYAIasEAQDdBQAhrAQBAN0FACEMAwAAkAYAIMEDAADSBgAwwgMAAAMAEMMDAADSBgAwxAMBANwFACHKA0AA4QUAIeIDQADhBQAh-QNAAOEFACGHBAEA3AUAIZwEAQDcBQAhrQQBAN0FACGuBAEA3QUAIQAAAAAAAAHBBAEAAAABAcEEAQAAAAEFwQQCAAAAAccEAgAAAAHIBAIAAAAByQQCAAAAAcoEAgAAAAEBwQQgAAAAAQHBBEAAAAABBTUAAOoMACA2AADtDAAgvgQAAOsMACC_BAAA7AwAIMQEAADZBAAgAzUAAOoMACC-BAAA6wwAIMQEAADZBAAgAAAAAAABwQQAAADYAwIFwQQQAAAAAccEEAAAAAHIBBAAAAAByQQQAAAAAcoEEAAAAAEBwQRAAAAAAQU1AADlDAAgNgAA6AwAIL4EAADmDAAgvwQAAOcMACDEBAAAVwAgAzUAAOUMACC-BAAA5gwAIMQEAABXACAAAAABwQQAAADlAwIBwQQAAADmAwIFNQAA3AwAIDYAAOMMACC-BAAA3QwAIL8EAADiDAAgxAQAAA0AIAU1AADaDAAgNgAA4AwAIL4EAADbDAAgvwQAAN8MACDEBAAA2QQAIAs1AADyBgAwNgAA9wYAML4EAADzBgAwvwQAAPQGADDABAAA9QYAIMEEAAD2BgAwwgQAAPYGADDDBAAA9gYAMMQEAAD2BgAwxQQAAPgGADDGBAAA-QYAMA3EAwEAAAABygNAAAAAAdgDAAAA2AMC2QMQAAAAAdoDEAAAAAHbAwEAAAAB3ANAAAAAAd0DQAAAAAHeA0AAAAAB3wNAAAAAAeADAQAAAAHhAwEAAAAB4gNAAAAAAQIAAABhACA1AAD9BgAgAwAAAGEAIDUAAP0GACA2AAD8BgAgAS4AAN4MADASIQAAlgYAIMEDAACTBgAwwgMAAF8AEMMDAACTBgAwxAMBAAAAAcoDQADhBQAh1gMBANwFACHYAwAAlAbYAyLZAxAA3gUAIdoDEADeBQAh2wMBANwFACHcA0AA4QUAId0DQADhBQAh3gNAAJUGACHfA0AAlQYAIeADAQAAAAHhAwEA3QUAIeIDQADhBQAhAgAAAGEAIC4AAPwGACACAAAA-gYAIC4AAPsGACARwQMAAPkGADDCAwAA-gYAEMMDAAD5BgAwxAMBANwFACHKA0AA4QUAIdYDAQDcBQAh2AMAAJQG2AMi2QMQAN4FACHaAxAA3gUAIdsDAQDcBQAh3ANAAOEFACHdA0AA4QUAId4DQACVBgAh3wNAAJUGACHgAwEA3QUAIeEDAQDdBQAh4gNAAOEFACERwQMAAPkGADDCAwAA-gYAEMMDAAD5BgAwxAMBANwFACHKA0AA4QUAIdYDAQDcBQAh2AMAAJQG2AMi2QMQAN4FACHaAxAA3gUAIdsDAQDcBQAh3ANAAOEFACHdA0AA4QUAId4DQACVBgAh3wNAAJUGACHgAwEA3QUAIeEDAQDdBQAh4gNAAOEFACENxAMBANkGACHKA0AA3QYAIdgDAADlBtgDItkDEADmBgAh2gMQAOYGACHbAwEA2QYAIdwDQADdBgAh3QNAAN0GACHeA0AA5wYAId8DQADnBgAh4AMBANoGACHhAwEA2gYAIeIDQADdBgAhDcQDAQDZBgAhygNAAN0GACHYAwAA5QbYAyLZAxAA5gYAIdoDEADmBgAh2wMBANkGACHcA0AA3QYAId0DQADdBgAh3gNAAOcGACHfA0AA5wYAIeADAQDaBgAh4QMBANoGACHiA0AA3QYAIQ3EAwEAAAABygNAAAAAAdgDAAAA2AMC2QMQAAAAAdoDEAAAAAHbAwEAAAAB3ANAAAAAAd0DQAAAAAHeA0AAAAAB3wNAAAAAAeADAQAAAAHhAwEAAAAB4gNAAAAAAQM1AADcDAAgvgQAAN0MACDEBAAADQAgAzUAANoMACC-BAAA2wwAIMQEAADZBAAgBDUAAPIGADC-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_DAAgNgAAwgwAIL4EAADADAAgvwQAAMEMACDEBAAAAQAgAzUAAL8MACC-BAAAwAwAIMQEAAABACAAAAAFNQAAtwwAIDYAAL0MACC-BAAAuAwAIL8EAAC8DAAgxAQAADAAIAU1AAC1DAAgNgAAugwAIL4EAAC2DAAgvwQAALkMACDEBAAARwAgAzUAALcMACC-BAAAuAwAIMQEAAAwACADNQAAtQwAIL4EAAC2DAAgxAQAAEcAIAAAAAU1AACvDAAgNgAAswwAIL4EAACwDAAgvwQAALIMACDEBAAAKAAgCzUAAMoHADA2AADPBwAwvgQAAMsHADC_BAAAzAcAMMAEAADNBwAgwQQAAM4HADDCBAAAzgcAMMMEAADOBwAwxAQAAM4HADDFBAAA0AcAMMYEAADRBwAwAhIAAMMHACCNBAEAAAABAgAAAD4AIDUAANUHACADAAAAPgAgNQAA1QcAIDYAANQHACABLgAAsQwAMAgSAACoBgAgFwAAqQYAIMEDAACnBgAwwgMAADwAEMMDAACnBgAwjQQBANwFACGOBAEA3AUAIbcEAACmBgAgAgAAAD4AIC4AANQHACACAAAA0gcAIC4AANMHACAFwQMAANEHADDCAwAA0gcAEMMDAADRBwAwjQQBANwFACGOBAEA3AUAIQXBAwAA0QcAMMIDAADSBwAQwwMAANEHADCNBAEA3AUAIY4EAQDcBQAhAY0EAQDZBgAhAhIAAMEHACCNBAEA2QYAIQISAADDBwAgjQQBAAAAAQM1AACvDAAgvgQAALAMACDEBAAAKAAgBDUAAMoHADC-BAAAywcAMMAEAADNBwAgxAQAAM4HADAAAAAFNQAApwwAIDYAAK0MACC-BAAAqAwAIL8EAACsDAAgxAQAADAAIAU1AAClDAAgNgAAqgwAIL4EAACmDAAgvwQAAKkMACDEBAAAAQAgAzUAAKcMACC-BAAAqAwAIMQEAAAwACADNQAApQwAIL4EAACmDAAgxAQAAAEAIAAAAAU1AACdDAAgNgAAowwAIL4EAACeDAAgvwQAAKIMACDEBAAAMAAgBTUAAJsMACA2AACgDAAgvgQAAJwMACC_BAAAnwwAIMQEAAABACADNQAAnQwAIL4EAACeDAAgxAQAADAAIAM1AACbDAAgvgQAAJwMACDEBAAAAQAgAAAAAcEEAAAAlQQCAcEEAAAAlgQCBTUAAJAMACA2AACZDAAgvgQAAJEMACC_BAAAmAwAIMQEAAAoACAHNQAAjgwAIDYAAJYMACC-BAAAjwwAIL8EAACVDAAgwgQAADIAIMMEAAAyACDEBAAAAQAgCzUAAIUIADA2AACKCAAwvgQAAIYIADC_BAAAhwgAMMAEAACICAAgwQQAAIkIADDCBAAAiQgAMMMEAACJCAAwxAQAAIkIADDFBAAAiwgAMMYEAACMCAAwCzUAAPkHADA2AAD-BwAwvgQAAPoHADC_BAAA-wcAMMAEAAD8BwAgwQQAAP0HADDCBAAA_QcAMMMEAAD9BwAwxAQAAP0HADDFBAAA_wcAMMYEAACACAAwCzUAAPAHADA2AAD0BwAwvgQAAPEHADC_BAAA8gcAMMAEAADzBwAgwQQAAM4HADDCBAAAzgcAMMMEAADOBwAwxAQAAM4HADDFBAAA9QcAMMYEAADRBwAwAhcAAMQHACCOBAEAAAABAgAAAD4AIDUAAPgHACADAAAAPgAgNQAA-AcAIDYAAPcHACABLgAAlAwAMAIAAAA-ACAuAAD3BwAgAgAAANIHACAuAAD2BwAgAY4EAQDZBgAhAhcAAMIHACCOBAEA2QYAIQIXAADEBwAgjgQBAAAAAQUUAADeBwAgxAMBAAAAAcoDQAAAAAH6AwEAAAABkQQBAAAAAQIAAAA6ACA1AACECAAgAwAAADoAIDUAAIQIACA2AACDCAAgAS4AAJMMADAKEgAAqAYAIBQAAJAGACDBAwAAqgYAMMIDAAA4ABDDAwAAqgYAMMQDAQAAAAHKA0AA4QUAIfoDAQDcBQAhjQQBANwFACGRBAEA3AUAIQIAAAA6ACAuAACDCAAgAgAAAIEIACAuAACCCAAgCMEDAACACAAwwgMAAIEIABDDAwAAgAgAMMQDAQDcBQAhygNAAOEFACH6AwEA3AUAIY0EAQDcBQAhkQQBANwFACEIwQMAAIAIADDCAwAAgQgAEMMDAACACAAwxAMBANwFACHKA0AA4QUAIfoDAQDcBQAhjQQBANwFACGRBAEA3AUAIQTEAwEA2QYAIcoDQADdBgAh-gMBANkGACGRBAEA2QYAIQUUAADcBwAgxAMBANkGACHKA0AA3QYAIfoDAQDZBgAhkQQBANkGACEFFAAA3gcAIMQDAQAAAAHKA0AAAAAB-gMBAAAAAZEEAQAAAAEGAwAA5QcAIMQDAQAAAAHKA0AAAAAB4gNAAAAAAYcEAQAAAAGSBAEAAAABAgAAADYAIDUAAJAIACADAAAANgAgNQAAkAgAIDYAAI8IACABLgAAkgwAMAsDAACQBgAgEgAAqAYAIMEDAACrBgAwwgMAADQAEMMDAACrBgAwxAMBAAAAAcoDQADhBQAh4gNAAOEFACGHBAEA3AUAIY0EAQDcBQAhkgQBANwFACECAAAANgAgLgAAjwgAIAIAAACNCAAgLgAAjggAIAnBAwAAjAgAMMIDAACNCAAQwwMAAIwIADDEAwEA3AUAIcoDQADhBQAh4gNAAOEFACGHBAEA3AUAIY0EAQDcBQAhkgQBANwFACEJwQMAAIwIADDCAwAAjQgAEMMDAACMCAAwxAMBANwFACHKA0AA4QUAIeIDQADhBQAhhwQBANwFACGNBAEA3AUAIZIEAQDcBQAhBcQDAQDZBgAhygNAAN0GACHiA0AA3QYAIYcEAQDZBgAhkgQBANkGACEGAwAA4wcAIMQDAQDZBgAhygNAAN0GACHiA0AA3QYAIYcEAQDZBgAhkgQBANkGACEGAwAA5QcAIMQDAQAAAAHKA0AAAAAB4gNAAAAAAYcEAQAAAAGSBAEAAAABAzUAAJAMACC-BAAAkQwAIMQEAAAoACADNQAAjgwAIL4EAACPDAAgxAQAAAEAIAQ1AACFCAAwvgQAAIYIADDABAAAiAgAIMQEAACJCAAwBDUAAPkHADC-BAAA-gcAMMAEAAD8BwAgxAQAAP0HADAENQAA8AcAML4EAADxBwAwwAQAAPMHACDEBAAAzgcAMAAAAAHBBAAAAJgEAgU1AACGDAAgNgAAjAwAIL4EAACHDAAgvwQAAIsMACDEBAAAKAAgBTUAAIQMACA2AACJDAAgvgQAAIUMACC_BAAAiAwAIMQEAAABACADNQAAhgwAIL4EAACHDAAgxAQAACgAIAM1AACEDAAgvgQAAIUMACDEBAAAAQAgAAAABTUAAPwLACA2AACCDAAgvgQAAP0LACC_BAAAgQwAIMQEAAANACALNQAAvQgAMDYAAMIIADC-BAAAvggAML8EAAC_CAAwwAQAAMAIACDBBAAAwQgAMMIEAADBCAAwwwQAAMEIADDEBAAAwQgAMMUEAADDCAAwxgQAAMQIADALNQAAsQgAMDYAALYIADC-BAAAsggAML8EAACzCAAwwAQAALQIACDBBAAAtQgAMMIEAAC1CAAwwwQAALUIADDEBAAAtQgAMMUEAAC3CAAwxgQAALgIADALNQAApQgAMDYAAKoIADC-BAAApggAML8EAACnCAAwwAQAAKgIACDBBAAAqQgAMMIEAACpCAAwwwQAAKkIADDEBAAAqQgAMMUEAACrCAAwxgQAAKwIADAEFgAA1wcAIMQDAQAAAAHGAwEAAAABkAQBAAAAAQIAAABHACA1AACwCAAgAwAAAEcAIDUAALAIACA2AACvCAAgAS4AAIAMADAKDwAApAYAIBYAAKUGACDBAwAAowYAMMIDAABFABDDAwAAowYAMMQDAQAAAAHGAwEA3AUAIY8EAQDcBQAhkAQBANwFACG2BAAAogYAIAIAAABHACAuAACvCAAgAgAAAK0IACAuAACuCAAgB8EDAACsCAAwwgMAAK0IABDDAwAArAgAMMQDAQDcBQAhxgMBANwFACGPBAEA3AUAIZAEAQDcBQAhB8EDAACsCAAwwgMAAK0IABDDAwAArAgAMMQDAQDcBQAhxgMBANwFACGPBAEA3AUAIZAEAQDcBQAhA8QDAQDZBgAhxgMBANkGACGQBAEA2QYAIQQWAADJBwAgxAMBANkGACHGAwEA2QYAIZAEAQDZBgAhBBYAANcHACDEAwEAAAABxgMBAAAAAZAEAQAAAAELEQAAkggAIBMAAJMIACAVAACUCAAgFgAAlQgAIMQDAQAAAAHKA0AAAAAB2AMAAACVBALiA0AAAAABigQBAAAAAZMEAQAAAAGWBAAAAJYEAgIAAAAwACA1AAC8CAAgAwAAADAAIDUAALwIACA2AAC7CAAgAS4AAP8LADAQDwAApAYAIBEAALwGACATAAC0BgAgFQAAtQYAIBYAAKUGACDBAwAAuQYAMMIDAAAuABDDAwAAuQYAMMQDAQAAAAHKA0AA4QUAIdgDAAC6BpUEIuIDQADhBQAhigQBANwFACGPBAEA3AUAIZMEAQDdBQAhlgQAALsGlgQiAgAAADAAIC4AALsIACACAAAAuQgAIC4AALoIACALwQMAALgIADDCAwAAuQgAEMMDAAC4CAAwxAMBANwFACHKA0AA4QUAIdgDAAC6BpUEIuIDQADhBQAhigQBANwFACGPBAEA3AUAIZMEAQDdBQAhlgQAALsGlgQiC8EDAAC4CAAwwgMAALkIABDDAwAAuAgAMMQDAQDcBQAhygNAAOEFACHYAwAAugaVBCLiA0AA4QUAIYoEAQDcBQAhjwQBANwFACGTBAEA3QUAIZYEAAC7BpYEIgfEAwEA2QYAIcoDQADdBgAh2AMAAOkHlQQi4gNAAN0GACGKBAEA2QYAIZMEAQDaBgAhlgQAAOoHlgQiCxEAAOwHACATAADtBwAgFQAA7gcAIBYAAO8HACDEAwEA2QYAIcoDQADdBgAh2AMAAOkHlQQi4gNAAN0GACGKBAEA2QYAIZMEAQDaBgAhlgQAAOoHlgQiCxEAAJIIACATAACTCAAgFQAAlAgAIBYAAJUIACDEAwEAAAABygNAAAAAAdgDAAAAlQQC4gNAAAAAAYoEAQAAAAGTBAEAAAABlgQAAACWBAIFAwAAnQgAIAgAAACYBALEAwEAAAABhwQBAAAAAZgEQAAAAAECAAAALAAgNQAAyAgAIAMAAAAsACA1AADICAAgNgAAxwgAIAEuAAD-CwAwCwMAAJAGACAIAAC_BpgEIg8AAKQGACDBAwAAvgYAMMIDAAAqABDDAwAAvgYAMMQDAQAAAAGHBAEA3AUAIY8EAQDcBQAhmARAAOEFACG4BAAAvQYAIAIAAAAsACAuAADHCAAgAgAAAMUIACAuAADGCAAgCAgAAL8GmAQiwQMAAMQIADDCAwAAxQgAEMMDAADECAAwxAMBANwFACGHBAEA3AUAIY8EAQDcBQAhmARAAOEFACEICAAAvwaYBCLBAwAAxAgAMMIDAADFCAAQwwMAAMQIADDEAwEA3AUAIYcEAQDcBQAhjwQBANwFACGYBEAA4QUAIQQIAACZCJgEIsQDAQDZBgAhhwQBANkGACGYBEAA3QYAIQUDAACbCAAgCAAAmQiYBCLEAwEA2QYAIYcEAQDZBgAhmARAAN0GACEFAwAAnQgAIAgAAACYBALEAwEAAAABhwQBAAAAAZgEQAAAAAEDNQAA_AsAIL4EAAD9CwAgxAQAAA0AIAQ1AAC9CAAwvgQAAL4IADDABAAAwAgAIMQEAADBCAAwBDUAALEIADC-BAAAsggAMMAEAAC0CAAgxAQAALUIADAENQAApQgAML4EAACmCAAwwAQAAKgIACDEBAAAqQgAMAAAAAU1AAD0CwAgNgAA-gsAIL4EAAD1CwAgvwQAAPkLACDEBAAADQAgBTUAAPILACA2AAD3CwAgvgQAAPMLACC_BAAA9gsAIMQEAAARACADNQAA9AsAIL4EAAD1CwAgxAQAAA0AIAM1AADyCwAgvgQAAPMLACDEBAAAEQAgAAAABTUAAOcLACA2AADwCwAgvgQAAOgLACC_BAAA7wsAIMQEAAABACAFNQAA5QsAIDYAAO0LACC-BAAA5gsAIL8EAADsCwAgxAQAAA0AIAU1AADjCwAgNgAA6gsAIL4EAADkCwAgvwQAAOkLACDEBAAAEQAgAzUAAOcLACC-BAAA6AsAIMQEAAABACADNQAA5QsAIL4EAADmCwAgxAQAAA0AIAM1AADjCwAgvgQAAOQLACDEBAAAEQAgAAAABTUAANsLACA2AADhCwAgvgQAANwLACC_BAAA4AsAIMQEAAARACAFNQAA2QsAIDYAAN4LACC-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-BAAA_ggAMMAEAACACQAgxAQAAIEJADAAAAAFNQAAxQsAIDYAAM4LACC-BAAAxgsAIL8EAADNCwAgxAQAAAEAIAs1AADoCQAwNgAA7QkAML4EAADpCQAwvwQAAOoJADDABAAA6wkAIMEEAADsCQAwwgQAAOwJADDDBAAA7AkAMMQEAADsCQAwxQQAAO4JADDGBAAA7wkAMAs1AADfCQAwNgAA4wkAML4EAADgCQAwvwQAAOEJADDABAAA4gkAIMEEAACNCQAwwgQAAI0JADDDBAAAjQkAMMQEAACNCQAwxQQAAOQJADDGBAAAkAkAMAs1AADWCQAwNgAA2gkAML4EAADXCQAwvwQAANgJADDABAAA2QkAIMEEAACBCQAwwgQAAIEJADDDBAAAgQkAMMQEAACBCQAwxQQAANsJADDGBAAAhAkAMAs1AADKCQAwNgAAzwkAML4EAADLCQAwvwQAAMwJADDABAAAzQkAIMEEAADOCQAwwgQAAM4JADDDBAAAzgkAMMQEAADOCQAwxQQAANAJADDGBAAA0QkAMAs1AAC-CQAwNgAAwwkAML4EAAC_CQAwvwQAAMAJADDABAAAwQkAIMEEAADCCQAwwgQAAMIJADDDBAAAwgkAMMQEAADCCQAwxQQAAMQJADDGBAAAxQkAMAs1AACyCQAwNgAAtwkAML4EAACzCQAwvwQAALQJADDABAAAtQkAIMEEAAC2CQAwwgQAALYJADDDBAAAtgkAMMQEAAC2CQAwxQQAALgJADDGBAAAuQkAMAc1AACtCQAgNgAAsAkAIL4EAACuCQAgvwQAAK8JACDCBAAAVAAgwwQAAFQAIMQEAABXACAPHwAA_wYAICIAAIAHACDEAwEAAAABxQMBAAAAAcoDQAAAAAHYAwAAAOUDAuIDQAAAAAHmAwAAAOYDAucDQAAAAAHoA0AAAAAB6QNAAAAAAeoDQAAAAAHrAyAAAAAB7AMBAAAAAe0DAQAAAAECAAAAVwAgNQAArQkAIAMAAABUACA1AACtCQAgNgAAsQkAIBEAAABUACAfAADwBgAgIgAA8QYAIC4AALEJACDEAwEA2QYAIcUDAQDZBgAhygNAAN0GACHYAwAA7QblAyLiA0AA3QYAIeYDAADuBuYDIucDQADdBgAh6ANAAN0GACHpA0AA5wYAIeoDQADnBgAh6wMgANwGACHsAwEA2gYAIe0DAQDaBgAhDx8AAPAGACAiAADxBgAgxAMBANkGACHFAwEA2QYAIcoDQADdBgAh2AMAAO0G5QMi4gNAAN0GACHmAwAA7gbmAyLnA0AA3QYAIegDQADdBgAh6QNAAOcGACHqA0AA5wYAIesDIADcBgAh7AMBANoGACHtAwEA2gYAIQjEAwEAAAABxgMBAAAAAcoDQAAAAAHyAyAAAAAB9gMBAAAAAfcDAQAAAAH4A0AAAAAB-QNAAAAAAQIAAABSACA1AAC9CQAgAwAAAFIAIDUAAL0JACA2AAC8CQAgAS4AAMwLADANBwAAnQYAIMEDAACfBgAwwgMAAFAAEMMDAACfBgAwxAMBAAAAAcYDAQDcBQAhygNAAOEFACHjAwEA3AUAIfIDIADgBQAh9gMBAAAAAfcDAQDcBQAh-ANAAJUGACH5A0AAlQYAIQIAAABSACAuAAC8CQAgAgAAALoJACAuAAC7CQAgDMEDAAC5CQAwwgMAALoJABDDAwAAuQkAMMQDAQDcBQAhxgMBANwFACHKA0AA4QUAIeMDAQDcBQAh8gMgAOAFACH2AwEA3AUAIfcDAQDcBQAh-ANAAJUGACH5A0AAlQYAIQzBAwAAuQkAMMIDAAC6CQAQwwMAALkJADDEAwEA3AUAIcYDAQDcBQAhygNAAOEFACHjAwEA3AUAIfIDIADgBQAh9gMBANwFACH3AwEA3AUAIfgDQACVBgAh-QNAAJUGACEIxAMBANkGACHGAwEA2QYAIcoDQADdBgAh8gMgANwGACH2AwEA2QYAIfcDAQDZBgAh-ANAAOcGACH5A0AA5wYAIQjEAwEA2QYAIcYDAQDZBgAhygNAAN0GACHyAyAA3AYAIfYDAQDZBgAh9wMBANkGACH4A0AA5wYAIfkDQADnBgAhCMQDAQAAAAHGAwEAAAABygNAAAAAAfIDIAAAAAH2AwEAAAAB9wMBAAAAAfgDQAAAAAH5A0AAAAABBhsAALcHACDEAwEAAAABygNAAAAAAf4DAQAAAAH_AwEAAAABgASAAAAAAQIAAABOACA1AADJCQAgAwAAAE4AIDUAAMkJACA2AADICQAgAS4AAMsLADALBwAAnQYAIBsAAJAGACDBAwAAoAYAMMIDAABMABDDAwAAoAYAMMQDAQAAAAHKA0AA4QUAIeMDAQDcBQAh_gMBANwFACH_AwEA3AUAIYAEAAChBgAgAgAAAE4AIC4AAMgJACACAAAAxgkAIC4AAMcJACAJwQMAAMUJADDCAwAAxgkAEMMDAADFCQAwxAMBANwFACHKA0AA4QUAIeMDAQDcBQAh_gMBANwFACH_AwEA3AUAIYAEAAChBgAgCcEDAADFCQAwwgMAAMYJABDDAwAAxQkAMMQDAQDcBQAhygNAAOEFACHjAwEA3AUAIf4DAQDcBQAh_wMBANwFACGABAAAoQYAIAXEAwEA2QYAIcoDQADdBgAh_gMBANkGACH_AwEA2QYAIYAEgAAAAAEGGwAAtQcAIMQDAQDZBgAhygNAAN0GACH-AwEA2QYAIf8DAQDZBgAhgASAAAAAAQYbAAC3BwAgxAMBAAAAAcoDQAAAAAH-AwEAAAAB_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_BAAAgAsAMMAEAACBCwAgwQQAAIILADDCBAAAggsAMMMEAACCCwAwxAQAAIILADDFBAAAhAsAMMYEAACFCwAwCzUAAPIKADA2AAD3CgAwvgQAAPMKADC_BAAA9AoAMMAEAAD1CgAgwQQAAPYKADDCBAAA9goAMMMEAAD2CgAwxAQAAPYKADDFBAAA-AoAMMYEAAD5CgAwCzUAAOYKADA2AADrCgAwvgQAAOcKADC_BAAA6AoAMMAEAADpCgAgwQQAAOoKADDCBAAA6goAMMMEAADqCgAwxAQAAOoKADDFBAAA7AoAMMYEAADtCgAwCzUAAN0KADA2AADhCgAwvgQAAN4KADC_BAAA3woAMMAEAADgCgAgwQQAAI0JADDCBAAAjQkAMMMEAACNCQAwxAQAAI0JADDFBAAA4goAMMYEAACQCQAwCzUAANQKADA2AADYCgAwvgQAANUKADC_BAAA1goAMMAEAADXCgAgwQQAAMEIADDCBAAAwQgAMMMEAADBCAAwxAQAAMEIADDFBAAA2QoAMMYEAADECAAwCzUAAMsKADA2AADPCgAwvgQAAMwKADC_BAAAzQoAMMAEAADOCgAgwQQAALUIADDCBAAAtQgAMMMEAAC1CAAwxAQAALUIADDFBAAA0AoAMMYEAAC4CAAwCzUAAMIKADA2AADGCgAwvgQAAMMKADC_BAAAxAoAMMAEAADFCgAgwQQAAIkIADDCBAAAiQgAMMMEAACJCAAwxAQAAIkIADDFBAAAxwoAMMYEAACMCAAwCzUAALkKADA2AAC9CgAwvgQAALoKADC_BAAAuwoAMMAEAAC8CgAgwQQAAP0HADDCBAAA_QcAMMMEAAD9BwAwxAQAAP0HADDFBAAAvgoAMMYEAACACAAwCzUAAK0KADA2AACyCgAwvgQAAK4KADC_BAAArwoAMMAEAACwCgAgwQQAALEKADDCBAAAsQoAMMMEAACxCgAwxAQAALEKADDFBAAAswoAMMYEAAC0CgAwCzUAAKQKADA2AACoCgAwvgQAAKUKADC_BAAApgoAMMAEAACnCgAgwQQAAMIJADDCBAAAwgkAMMMEAADCCQAwxAQAAMIJADDFBAAAqQoAMMYEAADFCQAwCzUAAJgKADA2AACdCgAwvgQAAJkKADC_BAAAmgoAMMAEAACbCgAgwQQAAJwKADDCBAAAnAoAMMMEAACcCgAwxAQAAJwKADDFBAAAngoAMMYEAACfCgAwBcQDAQAAAAHKA0AAAAAB-wMBAAAAAfwDAQAAAAH9AwIAAAABAgAAAHYAIDUAAKMKACADAAAAdgAgNQAAowoAIDYAAKIKACABLgAAugsAMAoUAACQBgAgwQMAAI4GADDCAwAAdAAQwwMAAI4GADDEAwEAAAABygNAAOEFACH6AwEA3AUAIfsDAQDcBQAh_AMBAN0FACH9AwIAjwYAIQIAAAB2ACAuAACiCgAgAgAAAKAKACAuAAChCgAgCcEDAACfCgAwwgMAAKAKABDDAwAAnwoAMMQDAQDcBQAhygNAAOEFACH6AwEA3AUAIfsDAQDcBQAh_AMBAN0FACH9AwIAjwYAIQnBAwAAnwoAMMIDAACgCgAQwwMAAJ8KADDEAwEA3AUAIcoDQADhBQAh-gMBANwFACH7AwEA3AUAIfwDAQDdBQAh_QMCAI8GACEFxAMBANkGACHKA0AA3QYAIfsDAQDZBgAh_AMBANoGACH9AwIA2wYAIQXEAwEA2QYAIcoDQADdBgAh-wMBANkGACH8AwEA2gYAIf0DAgDbBgAhBcQDAQAAAAHKA0AAAAAB-wMBAAAAAfwDAQAAAAH9AwIAAAABBgcAALYHACDEAwEAAAABygNAAAAAAeMDAQAAAAH_AwEAAAABgASAAAAAAQIAAABOACA1AACsCgAgAwAAAE4AIDUAAKwKACA2AACrCgAgAS4AALkLADACAAAATgAgLgAAqwoAIAIAAADGCQAgLgAAqgoAIAXEAwEA2QYAIcoDQADdBgAh4wMBANkGACH_AwEA2QYAIYAEgAAAAAEGBwAAtAcAIMQDAQDZBgAhygNAAN0GACHjAwEA2QYAIf8DAQDZBgAhgASAAAAAAQYHAAC2BwAgxAMBAAAAAcoDQAAAAAHjAwEAAAAB_wMBAAAAAYAEgAAAAAEGxAMBAAAAAcoDQAAAAAGJBAAAAIkEAooEAQAAAAGLBAEAAAABjAQgAAAAAQIAAABxACA1AAC4CgAgAwAAAHEAIDUAALgKACA2AAC3CgAgAS4AALgLADALAwAAkAYAIMEDAACRBgAwwgMAAG8AEMMDAACRBgAwxAMBAAAAAcoDQADhBQAhhwQBANwFACGJBAAAkgaJBCKKBAEA3AUAIYsEAQDdBQAhjAQgAOAFACECAAAAcQAgLgAAtwoAIAIAAAC1CgAgLgAAtgoAIArBAwAAtAoAMMIDAAC1CgAQwwMAALQKADDEAwEA3AUAIcoDQADhBQAhhwQBANwFACGJBAAAkgaJBCKKBAEA3AUAIYsEAQDdBQAhjAQgAOAFACEKwQMAALQKADDCAwAAtQoAEMMDAAC0CgAwxAMBANwFACHKA0AA4QUAIYcEAQDcBQAhiQQAAJIGiQQiigQBANwFACGLBAEA3QUAIYwEIADgBQAhBsQDAQDZBgAhygNAAN0GACGJBAAAuweJBCKKBAEA2QYAIYsEAQDaBgAhjAQgANwGACEGxAMBANkGACHKA0AA3QYAIYkEAAC7B4kEIooEAQDZBgAhiwQBANoGACGMBCAA3AYAIQbEAwEAAAABygNAAAAAAYkEAAAAiQQCigQBAAAAAYsEAQAAAAGMBCAAAAABBRIAAN0HACDEAwEAAAABygNAAAAAAY0EAQAAAAGRBAEAAAABAgAAADoAIDUAAMEKACADAAAAOgAgNQAAwQoAIDYAAMAKACABLgAAtwsAMAIAAAA6ACAuAADACgAgAgAAAIEIACAuAAC_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_QoAIAMAAAAJACA1AAD9CgAgNgAA_AoAIAEuAACxCwAwEQMAAJAGACDBAwAA0QYAMMIDAAAHABDDAwAA0QYAMMQDAQAAAAHKA0AA4QUAIeIDQADhBQAhhwQBANwFACGkBAEA3AUAIaUEAQDcBQAhpgQBAN0FACGnBAEA3QUAIagEAQDdBQAhqQRAAJUGACGqBEAAlQYAIasEAQDdBQAhrAQBAN0FACECAAAACQAgLgAA_AoAIAIAAAD6CgAgLgAA-woAIBDBAwAA-QoAMMIDAAD6CgAQwwMAAPkKADDEAwEA3AUAIcoDQADhBQAh4gNAAOEFACGHBAEA3AUAIaQEAQDcBQAhpQQBANwFACGmBAEA3QUAIacEAQDdBQAhqAQBAN0FACGpBEAAlQYAIaoEQACVBgAhqwQBAN0FACGsBAEA3QUAIRDBAwAA-QoAMMIDAAD6CgAQwwMAAPkKADDEAwEA3AUAIcoDQADhBQAh4gNAAOEFACGHBAEA3AUAIaQEAQDcBQAhpQQBANwFACGmBAEA3QUAIacEAQDdBQAhqAQBAN0FACGpBEAAlQYAIaoEQACVBgAhqwQBAN0FACGsBAEA3QUAIQzEAwEA2QYAIcoDQADdBgAh4gNAAN0GACGkBAEA2QYAIaUEAQDZBgAhpgQBANoGACGnBAEA2gYAIagEAQDaBgAhqQRAAOcGACGqBEAA5wYAIasEAQDaBgAhrAQBANoGACEMxAMBANkGACHKA0AA3QYAIeIDQADdBgAhpAQBANkGACGlBAEA2QYAIaYEAQDaBgAhpwQBANoGACGoBAEA2gYAIakEQADnBgAhqgRAAOcGACGrBAEA2gYAIawEAQDaBgAhDMQDAQAAAAHKA0AAAAAB4gNAAAAAAaQEAQAAAAGlBAEAAAABpgQBAAAAAacEAQAAAAGoBAEAAAABqQRAAAAAAaoEQAAAAAGrBAEAAAABrAQBAAAAAQfEAwEAAAABygNAAAAAAeIDQAAAAAH5A0AAAAABnAQBAAAAAa0EAQAAAAGuBAEAAAABAgAAAAUAIDUAAIkLACADAAAABQAgNQAAiQsAIDYAAIgLACABLgAAsAsAMAwDAACQBgAgwQMAANIGADDCAwAAAwAQwwMAANIGADDEAwEAAAABygNAAOEFACHiA0AA4QUAIfkDQADhBQAhhwQBANwFACGcBAEAAAABrQQBAN0FACGuBAEA3QUAIQIAAAAFACAuAACICwAgAgAAAIYLACAuAACHCwAgC8EDAACFCwAwwgMAAIYLABDDAwAAhQsAMMQDAQDcBQAhygNAAOEFACHiA0AA4QUAIfkDQADhBQAhhwQBANwFACGcBAEA3AUAIa0EAQDdBQAhrgQBAN0FACELwQMAAIULADDCAwAAhgsAEMMDAACFCwAwxAMBANwFACHKA0AA4QUAIeIDQADhBQAh-QNAAOEFACGHBAEA3AUAIZwEAQDcBQAhrQQBAN0FACGuBAEA3QUAIQfEAwEA2QYAIcoDQADdBgAh4gNAAN0GACH5A0AA3QYAIZwEAQDZBgAhrQQBANoGACGuBAEA2gYAIQfEAwEA2QYAIcoDQADdBgAh4gNAAN0GACH5A0AA3QYAIZwEAQDZBgAhrQQBANoGACGuBAEA2gYAIQfEAwEAAAABygNAAAAAAeIDQAAAAAH5A0AAAAABnAQBAAAAAa0EAQAAAAGuBAEAAAABBDUAAP4KADC-BAAA_woAMMAEAACBCwAgxAQAAIILADAENQAA8goAML4EAADzCgAwwAQAAPUKACDEBAAA9goAMAQ1AADmCgAwvgQAAOcKADDABAAA6QoAIMQEAADqCgAwBDUAAN0KADC-BAAA3goAMMAEAADgCgAgxAQAAI0JADAENQAA1AoAML4EAADVCgAwwAQAANcKACDEBAAAwQgAMAQ1AADLCgAwvgQAAMwKADDABAAAzgoAIMQEAAC1CAAwBDUAAMIKADC-BAAAwwoAMMAEAADFCgAgxAQAAIkIADAENQAAuQoAML4EAAC6CgAwwAQAALwKACDEBAAA_QcAMAQ1AACtCgAwvgQAAK4KADDABAAAsAoAIMQEAACxCgAwBDUAAKQKADC-BAAApQoAMMAEAACnCgAgxAQAAMIJADAENQAAmAoAML4EAACZCgAwwAQAAJsKACDEBAAAnAoAMAAAAAAAAAAAAAAADQQAAJULACAFAACWCwAgDAAAmAsAIBAAAJkLACAcAACeCwAgIwAAlwsAICQAAJoLACAlAACbCwAgJgAAnAsAICcAAJ0LACAoAACfCwAgrwQAANMGACC0BAAA0wYAIAcHAACjCwAgHwAAogsAICIAAKQLACDpAwAA0wYAIOoDAADTBgAg7AMAANMGACDtAwAA0wYAIAMeAACjBwAgIAAApAcAIMcDAADTBgAgCAYAAKALACAMAACYCwAgDQAArAsAIA4AAK0LACAaAACuCwAgHAAAngsAIB0AAK8LACAhAAChCwAgAAUHAACjCwAgEAAAmQsAIBgAAJoLACAZAACpCwAgxwMAANMGACAABg8AAKULACARAACgCwAgEwAAmwsAIBUAAJwLACAWAACmCwAgkwQAANMGACACDwAApQsAIBYAAKYLACAABAcAAKMLACAJAAD1CAAgDAAAmAsAIA0AAKwLACABCQAA9QgAIAAAAAAHxAMBAAAAAcoDQAAAAAHiA0AAAAAB-QNAAAAAAZwEAQAAAAGtBAEAAAABrgQBAAAAAQzEAwEAAAABygNAAAAAAeIDQAAAAAGkBAEAAAABpQQBAAAAAaYEAQAAAAGnBAEAAAABqAQBAAAAAakEQAAAAAGqBEAAAAABqwQBAAAAAawEAQAAAAEExAMBAAAAAcYDAQAAAAHKA0AAAAAB7gMBAAAAAQTEAwEAAAAB4wMBAAAAAZgEQAAAAAGaBAEAAAABBAgAAACYBALEAwEAAAABjwQBAAAAAZgEQAAAAAEHxAMBAAAAAcoDQAAAAAHYAwAAAJUEAuIDQAAAAAGKBAEAAAABjwQBAAAAAZYEAAAAlgQCBcQDAQAAAAHKA0AAAAAB4gNAAAAAAY0EAQAAAAGSBAEAAAABBMQDAQAAAAHKA0AAAAABjQQBAAAAAZEEAQAAAAEGxAMBAAAAAcoDQAAAAAGJBAAAAIkEAooEAQAAAAGLBAEAAAABjAQgAAAAAQXEAwEAAAABygNAAAAAAeMDAQAAAAH_AwEAAAABgASAAAAAAQXEAwEAAAABygNAAAAAAfsDAQAAAAH8AwEAAAAB_QMCAAAAARUFAACLCwAgDAAAjQsAIBAAAI4LACAcAACTCwAgIwAAjAsAICQAAI8LACAlAACQCwAgJgAAkQsAICcAAJILACAoAACUCwAgxAMBAAAAAcYDAQAAAAHKA0AAAAAB2AMAAACyBALiA0AAAAABmwQBAAAAAa8EAQAAAAGwBCAAAAABsgQgAAAAAbMEIAAAAAG0BEAAAAABAgAAAAEAIDUAALsLACADAAAAMgAgNQAAuwsAIDYAAL8LACAXAAAAMgAgBQAAjgoAIAwAAJAKACAQAACRCgAgHAAAlgoAICMAAI8KACAkAACSCgAgJQAAkwoAICYAAJQKACAnAACVCgAgKAAAlwoAIC4AAL8LACDEAwEA2QYAIcYDAQDZBgAhygNAAN0GACHYAwAAjAqyBCLiA0AA3QYAIZsEAQDZBgAhrwQBANoGACGwBCAA3AYAIbIEIADcBgAhswQgANwGACG0BEAA5wYAIRUFAACOCgAgDAAAkAoAIBAAAJEKACAcAACWCgAgIwAAjwoAICQAAJIKACAlAACTCgAgJgAAlAoAICcAAJUKACAoAACXCgAgxAMBANkGACHGAwEA2QYAIcoDQADdBgAh2AMAAIwKsgQi4gNAAN0GACGbBAEA2QYAIa8EAQDaBgAhsAQgANwGACGyBCAA3AYAIbMEIADcBgAhtARAAOcGACEVBAAAigsAIAwAAI0LACAQAACOCwAgHAAAkwsAICMAAIwLACAkAACPCwAgJQAAkAsAICYAAJELACAnAACSCwAgKAAAlAsAIMQDAQAAAAHGAwEAAAABygNAAAAAAdgDAAAAsgQC4gNAAAAAAZsEAQAAAAGvBAEAAAABsAQgAAAAAbIEIAAAAAGzBCAAAAABtARAAAAAAQIAAAABACA1AADACwAgAwAAADIAIDUAAMALACA2AADECwAgFwAAADIAIAQAAI0KACAMAACQCgAgEAAAkQoAIBwAAJYKACAjAACPCgAgJAAAkgoAICUAAJMKACAmAACUCgAgJwAAlQoAICgAAJcKACAuAADECwAgxAMBANkGACHGAwEA2QYAIcoDQADdBgAh2AMAAIwKsgQi4gNAAN0GACGbBAEA2QYAIa8EAQDaBgAhsAQgANwGACGyBCAA3AYAIbMEIADcBgAhtARAAOcGACEVBAAAjQoAIAwAAJAKACAQAACRCgAgHAAAlgoAICMAAI8KACAkAACSCgAgJQAAkwoAICYAAJQKACAnAACVCgAgKAAAlwoAIMQDAQDZBgAhxgMBANkGACHKA0AA3QYAIdgDAACMCrIEIuIDQADdBgAhmwQBANkGACGvBAEA2gYAIbAEIADcBgAhsgQgANwGACGzBCAA3AYAIbQEQADnBgAhFQQAAIoLACAFAACLCwAgDAAAjQsAIBAAAI4LACAcAACTCwAgJAAAjwsAICUAAJALACAmAACRCwAgJwAAkgsAICgAAJQLACDEAwEAAAABxgMBAAAAAcoDQAAAAAHYAwAAALIEAuIDQAAAAAGbBAEAAAABrwQBAAAAAbAEIAAAAAGyBCAAAAABswQgAAAAAbQEQAAAAAECAAAAAQAgNQAAxQsAIALEAwEAAAABxgMBAAAAAQTEAwEAAAABhwQBAAAAAZgEQAAAAAGaBAEAAAABB8QDAQAAAAHKA0AAAAAB-QNAAAAAAZoEAQAAAAGbBAEAAAABnAQBAAAAAZ0EQAAAAAEGxAMBAAAAAcYDAQAAAAHHAwEAAAABygNAAAAAAeIDQAAAAAGZBAEAAAABBcQDAQAAAAHKA0AAAAAB_gMBAAAAAf8DAQAAAAGABIAAAAABCMQDAQAAAAHGAwEAAAABygNAAAAAAfIDIAAAAAH2AwEAAAAB9wMBAAAAAfgDQAAAAAH5A0AAAAABAwAAADIAIDUAAMULACA2AADPCwAgFwAAADIAIAQAAI0KACAFAACOCgAgDAAAkAoAIBAAAJEKACAcAACWCgAgJAAAkgoAICUAAJMKACAmAACUCgAgJwAAlQoAICgAAJcKACAuAADPCwAgxAMBANkGACHGAwEA2QYAIcoDQADdBgAh2AMAAIwKsgQi4gNAAN0GACGbBAEA2QYAIa8EAQDaBgAhsAQgANwGACGyBCAA3AYAIbMEIADcBgAhtARAAOcGACEVBAAAjQoAIAUAAI4KACAMAACQCgAgEAAAkQoAIBwAAJYKACAkAACSCgAgJQAAkwoAICYAAJQKACAnAACVCgAgKAAAlwoAIMQDAQDZBgAhxgMBANkGACHKA0AA3QYAIdgDAACMCrIEIuIDQADdBgAhmwQBANkGACGvBAEA2gYAIbAEIADcBgAhsgQgANwGACGzBCAA3AYAIbQEQADnBgAhDAYAAPQJACAMAAD2CQAgDQAA9wkAIBoAAPgJACAcAAD5CQAgHQAA-gkAICEAAPsJACDEAwEAAAABxgMBAAAAAcoDQAAAAAHuAwEAAAABoQQBAAAAAQIAAAANACA1AADQCwAgAZ4EAQAAAAEExAMBAAAAAeMDAQAAAAGHBAEAAAABmARAAAAAAQfEAwEAAAABygNAAAAAAeMDAQAAAAH5A0AAAAABmwQBAAAAAZwEAQAAAAGdBEAAAAABAwAAAAsAIDUAANALACA2AADXCwAgDgAAAAsAIAYAAKUJACAMAACnCQAgDQAAqAkAIBoAAKkJACAcAACqCQAgHQAAqwkAICEAAKwJACAuAADXCwAgxAMBANkGACHGAwEA2QYAIcoDQADdBgAh7gMBANkGACGhBAEA2QYAIQwGAAClCQAgDAAApwkAIA0AAKgJACAaAACpCQAgHAAAqgkAIB0AAKsJACAhAACsCQAgxAMBANkGACHGAwEA2QYAIcoDQADdBgAh7gMBANkGACGhBAEA2QYAIQGaBAEAAAABA8QDAQAAAAH_AwEAAAABnwQBAAAAAQIAAACKAgAgNQAA2QsAIAYHAACeCQAgDAAAoAkAIA0AAKEJACDEAwEAAAABxgMBAAAAAeMDAQAAAAECAAAAEQAgNQAA2wsAIAMAAACNAgAgNQAA2QsAIDYAAN8LACAFAAAAjQIAIC4AAN8LACDEAwEA2QYAIf8DAQDZBgAhnwQBANkGACEDxAMBANkGACH_AwEA2QYAIZ8EAQDZBgAhAwAAAA8AIDUAANsLACA2AADiCwAgCAAAAA8AIAcAAPkIACAMAAD7CAAgDQAA_AgAIC4AAOILACDEAwEA2QYAIcYDAQDZBgAh4wMBANkGACEGBwAA-QgAIAwAAPsIACANAAD8CAAgxAMBANkGACHGAwEA2QYAIeMDAQDZBgAhBgcAAJ4JACAJAACfCQAgDQAAoQkAIMQDAQAAAAHGAwEAAAAB4wMBAAAAAQIAAAARACA1AADjCwAgDAYAAPQJACANAAD3CQAgDgAA9QkAIBoAAPgJACAcAAD5CQAgHQAA-gkAICEAAPsJACDEAwEAAAABxgMBAAAAAcoDQAAAAAHuAwEAAAABoQQBAAAAAQIAAAANACA1AADlCwAgFQQAAIoLACAFAACLCwAgEAAAjgsAIBwAAJMLACAjAACMCwAgJAAAjwsAICUAAJALACAmAACRCwAgJwAAkgsAICgAAJQLACDEAwEAAAABxgMBAAAAAcoDQAAAAAHYAwAAALIEAuIDQAAAAAGbBAEAAAABrwQBAAAAAbAEIAAAAAGyBCAAAAABswQgAAAAAbQEQAAAAAECAAAAAQAgNQAA5wsAIAMAAAAPACA1AADjCwAgNgAA6wsAIAgAAAAPACAHAAD5CAAgCQAA-ggAIA0AAPwIACAuAADrCwAgxAMBANkGACHGAwEA2QYAIeMDAQDZBgAhBgcAAPkIACAJAAD6CAAgDQAA_AgAIMQDAQDZBgAhxgMBANkGACHjAwEA2QYAIQMAAAALACA1AADlCwAgNgAA7gsAIA4AAAALACAGAAClCQAgDQAAqAkAIA4AAKYJACAaAACpCQAgHAAAqgkAIB0AAKsJACAhAACsCQAgLgAA7gsAIMQDAQDZBgAhxgMBANkGACHKA0AA3QYAIe4DAQDZBgAhoQQBANkGACEMBgAApQkAIA0AAKgJACAOAACmCQAgGgAAqQkAIBwAAKoJACAdAACrCQAgIQAArAkAIMQDAQDZBgAhxgMBANkGACHKA0AA3QYAIe4DAQDZBgAhoQQBANkGACEDAAAAMgAgNQAA5wsAIDYAAPELACAXAAAAMgAgBAAAjQoAIAUAAI4KACAQAACRCgAgHAAAlgoAICMAAI8KACAkAACSCgAgJQAAkwoAICYAAJQKACAnAACVCgAgKAAAlwoAIC4AAPELACDEAwEA2QYAIcYDAQDZBgAhygNAAN0GACHYAwAAjAqyBCLiA0AA3QYAIZsEAQDZBgAhrwQBANoGACGwBCAA3AYAIbIEIADcBgAhswQgANwGACG0BEAA5wYAIRUEAACNCgAgBQAAjgoAIBAAAJEKACAcAACWCgAgIwAAjwoAICQAAJIKACAlAACTCgAgJgAAlAoAICcAAJUKACAoAACXCgAgxAMBANkGACHGAwEA2QYAIcoDQADdBgAh2AMAAIwKsgQi4gNAAN0GACGbBAEA2QYAIa8EAQDaBgAhsAQgANwGACGyBCAA3AYAIbMEIADcBgAhtARAAOcGACEGBwAAngkAIAkAAJ8JACAMAACgCQAgxAMBAAAAAcYDAQAAAAHjAwEAAAABAgAAABEAIDUAAPILACAMBgAA9AkAIAwAAPYJACAOAAD1CQAgGgAA-AkAIBwAAPkJACAdAAD6CQAgIQAA-wkAIMQDAQAAAAHGAwEAAAABygNAAAAAAe4DAQAAAAGhBAEAAAABAgAAAA0AIDUAAPQLACADAAAADwAgNQAA8gsAIDYAAPgLACAIAAAADwAgBwAA-QgAIAkAAPoIACAMAAD7CAAgLgAA-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_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_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_eAQRw3wEEceABBHLhAQRz4gEEdOQBBHXmASJ25wFAd-kBBHjrASJ57AFBeu0BBHvuAQR87wEiffIBQn7zAUZ_9AEFgAH1AQWBAfYBBYIB9wEFgwH4AQWEAfoBBYUB_AEihgH9AUeHAf8BBYgBgQIiiQGCAkiKAYMCBYsBhAIFjAGFAiKNAYgCSY4BiQJNjwGLAgeQAYwCB5EBjwIHkgGQAgeTAZECB5QBkwIHlQGVAiKWAZYCTpcBmAIHmAGaAiKZAZsCT5oBnAIHmwGdAgecAZ4CIp0BoQJQngGiAlSfAaMCBqABpAIGoQGlAgaiAaYCBqMBpwIGpAGpAgalAasCIqYBrAJVpwGuAgaoAbACIqkBsQJWqgGyAgarAbMCBqwBtAIirQG3AleuAbgCW68BuQIJsAG6AgmxAbsCCbIBvAIJswG9Agm0Ab8CCbUBwQIitgHCAly3AcQCCbgBxgIiuQHHAl26AcgCCbsByQIJvAHKAiK9Ac0CXr4BzgJivwHPAgrAAdACCsEB0QIKwgHSAgrDAdMCCsQB1QIKxQHXAiLGAdgCY8cB2gIKyAHcAiLJAd0CZMoB3gIKywHfAgrMAeACIs0B4wJlzgHkAmnPAeUCDNAB5gIM0QHnAgzSAegCDNMB6QIM1AHrAgzVAe0CItYB7gJq1wHwAgzYAfICItkB8wJr2gH0AgzbAfUCDNwB9gIi3QH5AmzeAfoCcN8B-wIN4AH8Ag3hAf0CDeIB_gIN4wH_Ag3kAYEDDeUBgwMi5gGEA3HnAYYDDegBiAMi6QGJA3LqAYoDDesBiwMN7AGMAyLtAY8Dc-4BkAN37wGRAw7wAZIDDvEBkwMO8gGUAw7zAZUDDvQBlwMO9QGZAyL2AZoDePcBnQMO-AGfAyL5AaADefoBogMO-wGjAw78AaQDIv0BpwN6_gGoA37_AakDD4ACqgMPgQKrAw-CAqwDD4MCrQMPhAKvAw-FArEDIoYCsgN_hwK0Aw-IArYDIokCtwOAAYoCuAMPiwK5Aw-MAroDIo0CvQOBAY4CvgOFAY8CvwMQkALAAxCRAsEDEJICwgMQkwLDAxCUAsUDEJUCxwMilgLIA4YBlwLKAxCYAswDIpkCzQOHAZoCzgMQmwLPAxCcAtADIp0C0wOIAZ4C1AOMAZ8C1QMSoALWAxKhAtcDEqIC2AMSowLZAxKkAtsDEqUC3QMipgLeA40BpwLgAxKoAuIDIqkC4wOOAaoC5AMSqwLlAxKsAuYDIq0C6QOPAa4C6gOTAa8C6wMRsALsAxGxAu0DEbIC7gMRswLvAxG0AvEDEbUC8wMitgL0A5QBtwL2AxG4AvgDIrkC-QOVAboC-gMRuwL7AxG8AvwDIr0C_wOWAb4CgASaAb8CgQQfwAKCBB_BAoMEH8IChAQfwwKFBB_EAocEH8UCiQQixgKKBJsBxwKMBB_IAo4EIskCjwScAcoCkAQfywKRBB_MApIEIs0ClQSdAc4ClgShAc8ClwQW0AKYBBbRApkEFtICmgQW0wKbBBbUAp0EFtUCnwQi1gKgBKIB1wKiBBbYAqQEItkCpQSjAdoCpgQW2wKnBBbcAqgEIt0CqwSkAd4CrASoAd8CrQQg4AKuBCDhAq8EIOICsAQg4wKxBCDkArMEIOUCtQQi5gK2BKkB5wK4BCDoAroEIukCuwSqAeoCvAQg6wK9BCDsAr4EIu8CwQSrAfACwgSxAfECwwQX8gLEBBfzAsUEF_QCxgQX9QLHBBf2AskEF_cCywQi-ALMBLIB-QLOBBf6AtAEIvsC0QSzAfwC0gQX_QLTBBf-AtQEIv8C1wS0AYAD2AS4AYED2gQZggPbBBmDA94EGYQD3wQZhQPgBBmGA-IEGYcD5AQiiAPlBLkBiQPnBBmKA-kEIosD6gS6AYwD6wQZjQPsBBmOA-0EIo8D8AS7AZAD8QTBAZED8gQYkgPzBBiTA_QEGJQD9QQYlQP2BBiWA_gEGJcD-gQimAP7BMIBmQP9BBiaA_8EIpsDgAXDAZwDgQUYnQOCBRieA4MFIp8DhgXEAaADhwXIAaEDiAUcogOJBRyjA4oFHKQDiwUcpQOMBRymA44FHKcDkAUiqAORBckBqQOTBRyqA5UFIqsDlgXKAawDlwUcrQOYBRyuA5kFIq8DnAXLAbADnQXRAbEDngUasgOfBRqzA6AFGrQDoQUatQOiBRq2A6QFGrcDpgUiuAOnBdIBuQOpBRq6A6sFIrsDrAXTAbwDrQUavQOuBRq-A68FIr8DsgXUAcADswXaAQ"
};
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer: Buffer2 } = await import("buffer");
  const wasmArray = Buffer2.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// src/generated/prisma/internal/prismaNamespace.ts
var prismaNamespace_exports = {};
__export(prismaNamespace_exports, {
  AccountScalarFieldEnum: () => AccountScalarFieldEnum,
  ActivityLogScalarFieldEnum: () => ActivityLogScalarFieldEnum,
  AnyNull: () => AnyNull2,
  ApiKeyScalarFieldEnum: () => ApiKeyScalarFieldEnum,
  DbNull: () => DbNull2,
  Decimal: () => Decimal2,
  FileScalarFieldEnum: () => FileScalarFieldEnum,
  InvitationScalarFieldEnum: () => InvitationScalarFieldEnum,
  InvoiceScalarFieldEnum: () => InvoiceScalarFieldEnum,
  JsonNull: () => JsonNull2,
  JsonNullValueFilter: () => JsonNullValueFilter,
  LabelScalarFieldEnum: () => LabelScalarFieldEnum,
  MembershipScalarFieldEnum: () => MembershipScalarFieldEnum,
  ModelName: () => ModelName,
  NotificationScalarFieldEnum: () => NotificationScalarFieldEnum,
  NullTypes: () => NullTypes2,
  NullableJsonNullValueInput: () => NullableJsonNullValueInput,
  NullsOrder: () => NullsOrder,
  OrganizationScalarFieldEnum: () => OrganizationScalarFieldEnum,
  PermissionScalarFieldEnum: () => PermissionScalarFieldEnum,
  PlanFeatureScalarFieldEnum: () => PlanFeatureScalarFieldEnum,
  PlanScalarFieldEnum: () => PlanScalarFieldEnum,
  PrismaClientInitializationError: () => PrismaClientInitializationError2,
  PrismaClientKnownRequestError: () => PrismaClientKnownRequestError2,
  PrismaClientRustPanicError: () => PrismaClientRustPanicError2,
  PrismaClientUnknownRequestError: () => PrismaClientUnknownRequestError2,
  PrismaClientValidationError: () => PrismaClientValidationError2,
  ProjectMemberScalarFieldEnum: () => ProjectMemberScalarFieldEnum,
  ProjectScalarFieldEnum: () => ProjectScalarFieldEnum,
  QueryMode: () => QueryMode,
  RolePermissionScalarFieldEnum: () => RolePermissionScalarFieldEnum,
  RoleScalarFieldEnum: () => RoleScalarFieldEnum,
  SessionScalarFieldEnum: () => SessionScalarFieldEnum,
  SortOrder: () => SortOrder,
  Sql: () => Sql2,
  SubscriptionScalarFieldEnum: () => SubscriptionScalarFieldEnum,
  TaskAttachmentScalarFieldEnum: () => TaskAttachmentScalarFieldEnum,
  TaskCommentScalarFieldEnum: () => TaskCommentScalarFieldEnum,
  TaskLabelScalarFieldEnum: () => TaskLabelScalarFieldEnum,
  TaskScalarFieldEnum: () => TaskScalarFieldEnum,
  TransactionIsolationLevel: () => TransactionIsolationLevel,
  UserScalarFieldEnum: () => UserScalarFieldEnum,
  VerificationScalarFieldEnum: () => VerificationScalarFieldEnum,
  defineExtension: () => defineExtension,
  empty: () => empty2,
  getExtensionContext: () => getExtensionContext,
  join: () => join2,
  prismaVersion: () => prismaVersion,
  raw: () => raw2,
  sql: () => sql
});
import * as runtime2 from "@prisma/client/runtime/client";
var PrismaClientKnownRequestError2 = runtime2.PrismaClientKnownRequestError;
var PrismaClientUnknownRequestError2 = runtime2.PrismaClientUnknownRequestError;
var PrismaClientRustPanicError2 = runtime2.PrismaClientRustPanicError;
var PrismaClientInitializationError2 = runtime2.PrismaClientInitializationError;
var PrismaClientValidationError2 = runtime2.PrismaClientValidationError;
var sql = runtime2.sqltag;
var empty2 = runtime2.empty;
var join2 = runtime2.join;
var raw2 = runtime2.raw;
var Sql2 = runtime2.Sql;
var Decimal2 = runtime2.Decimal;
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var prismaVersion = {
  client: "7.5.0",
  engine: "280c870be64f457428992c43c1f6d557fab6e29e"
};
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var DbNull2 = runtime2.DbNull;
var JsonNull2 = runtime2.JsonNull;
var AnyNull2 = runtime2.AnyNull;
var ModelName = {
  User: "User",
  Session: "Session",
  Account: "Account",
  Verification: "Verification",
  Organization: "Organization",
  Role: "Role",
  Permission: "Permission",
  RolePermission: "RolePermission",
  Membership: "Membership",
  Invitation: "Invitation",
  Project: "Project",
  ProjectMember: "ProjectMember",
  Task: "Task",
  TaskComment: "TaskComment",
  TaskAttachment: "TaskAttachment",
  Label: "Label",
  TaskLabel: "TaskLabel",
  Notification: "Notification",
  ActivityLog: "ActivityLog",
  File: "File",
  ApiKey: "ApiKey",
  Plan: "Plan",
  Subscription: "Subscription",
  Invoice: "Invoice",
  PlanFeature: "PlanFeature"
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var UserScalarFieldEnum = {
  id: "id",
  name: "name",
  email: "email",
  image: "image",
  emailVerified: "emailVerified",
  status: "status",
  needPasswordChange: "needPasswordChange",
  isDeleted: "isDeleted",
  deletedAt: "deletedAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var SessionScalarFieldEnum = {
  id: "id",
  expiresAt: "expiresAt",
  token: "token",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  ipAddress: "ipAddress",
  userAgent: "userAgent",
  userId: "userId"
};
var AccountScalarFieldEnum = {
  id: "id",
  accountId: "accountId",
  providerId: "providerId",
  userId: "userId",
  accessToken: "accessToken",
  refreshToken: "refreshToken",
  idToken: "idToken",
  accessTokenExpiresAt: "accessTokenExpiresAt",
  refreshTokenExpiresAt: "refreshTokenExpiresAt",
  scope: "scope",
  password: "password",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var VerificationScalarFieldEnum = {
  id: "id",
  identifier: "identifier",
  value: "value",
  expiresAt: "expiresAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var OrganizationScalarFieldEnum = {
  id: "id",
  ownerId: "ownerId",
  name: "name",
  slug: "slug",
  createdAt: "createdAt"
};
var RoleScalarFieldEnum = {
  id: "id",
  organizationId: "organizationId",
  name: "name"
};
var PermissionScalarFieldEnum = {
  id: "id",
  action: "action",
  resource: "resource"
};
var RolePermissionScalarFieldEnum = {
  roleId: "roleId",
  permissionId: "permissionId"
};
var MembershipScalarFieldEnum = {
  id: "id",
  userId: "userId",
  organizationId: "organizationId",
  roleId: "roleId",
  joinedAt: "joinedAt"
};
var InvitationScalarFieldEnum = {
  id: "id",
  organizationId: "organizationId",
  roleId: "roleId",
  email: "email",
  token: "token",
  acceptedAt: "acceptedAt",
  expiresAt: "expiresAt",
  createdAt: "createdAt"
};
var ProjectScalarFieldEnum = {
  id: "id",
  organizationId: "organizationId",
  name: "name",
  description: "description",
  createdBy: "createdBy",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var ProjectMemberScalarFieldEnum = {
  id: "id",
  projectId: "projectId",
  userId: "userId",
  role: "role",
  joinedAt: "joinedAt"
};
var TaskScalarFieldEnum = {
  id: "id",
  projectId: "projectId",
  assignedTo: "assignedTo",
  title: "title",
  status: "status",
  priority: "priority",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var TaskCommentScalarFieldEnum = {
  id: "id",
  taskId: "taskId",
  userId: "userId",
  message: "message",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var TaskAttachmentScalarFieldEnum = {
  id: "id",
  taskId: "taskId",
  uploadedBy: "uploadedBy",
  fileUrl: "fileUrl",
  createdAt: "createdAt"
};
var LabelScalarFieldEnum = {
  id: "id",
  projectId: "projectId",
  name: "name",
  color: "color"
};
var TaskLabelScalarFieldEnum = {
  taskId: "taskId",
  labelId: "labelId"
};
var NotificationScalarFieldEnum = {
  id: "id",
  userId: "userId",
  type: "type",
  title: "title",
  body: "body",
  isRead: "isRead",
  createdAt: "createdAt"
};
var ActivityLogScalarFieldEnum = {
  id: "id",
  organizationId: "organizationId",
  actorId: "actorId",
  action: "action",
  metadata: "metadata",
  createdAt: "createdAt"
};
var FileScalarFieldEnum = {
  id: "id",
  uploadedBy: "uploadedBy",
  url: "url",
  mimeType: "mimeType",
  sizeBytes: "sizeBytes",
  createdAt: "createdAt"
};
var ApiKeyScalarFieldEnum = {
  id: "id",
  organizationId: "organizationId",
  name: "name",
  keyHash: "keyHash",
  keyPrefix: "keyPrefix",
  isActive: "isActive",
  lastUsedAt: "lastUsedAt",
  expiresAt: "expiresAt",
  createdAt: "createdAt"
};
var PlanScalarFieldEnum = {
  id: "id",
  name: "name",
  slug: "slug",
  description: "description",
  priceMonthly: "priceMonthly",
  priceYearly: "priceYearly",
  currency: "currency",
  trialDays: "trialDays",
  isActive: "isActive",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var SubscriptionScalarFieldEnum = {
  id: "id",
  organizationId: "organizationId",
  planId: "planId",
  status: "status",
  billingCycle: "billingCycle",
  currentPeriodStart: "currentPeriodStart",
  currentPeriodEnd: "currentPeriodEnd",
  trialEndsAt: "trialEndsAt",
  canceledAt: "canceledAt",
  cancelAtPeriodEnd: "cancelAtPeriodEnd",
  stripeCustomerId: "stripeCustomerId",
  stripeSubscriptionId: "stripeSubscriptionId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var InvoiceScalarFieldEnum = {
  id: "id",
  subscriptionId: "subscriptionId",
  status: "status",
  amountDue: "amountDue",
  amountPaid: "amountPaid",
  currency: "currency",
  periodStart: "periodStart",
  periodEnd: "periodEnd",
  dueDate: "dueDate",
  paidAt: "paidAt",
  stripeInvoiceId: "stripeInvoiceId",
  invoicePdfUrl: "invoicePdfUrl",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var PlanFeatureScalarFieldEnum = {
  id: "id",
  planId: "planId",
  name: "name",
  description: "description",
  limitValue: "limitValue",
  isEnabled: "isEnabled",
  createdAt: "createdAt"
};
var SortOrder = {
  asc: "asc",
  desc: "desc"
};
var NullableJsonNullValueInput = {
  DbNull: DbNull2,
  JsonNull: JsonNull2
};
var QueryMode = {
  default: "default",
  insensitive: "insensitive"
};
var NullsOrder = {
  first: "first",
  last: "last"
};
var JsonNullValueFilter = {
  DbNull: DbNull2,
  JsonNull: JsonNull2,
  AnyNull: AnyNull2
};
var defineExtension = runtime2.Extensions.defineExtension;

// src/generated/prisma/enums.ts
var TaskStatus = {
  TODO: "TODO",
  IN_PROGRESS: "IN_PROGRESS",
  IN_REVIEW: "IN_REVIEW",
  DONE: "DONE",
  CANCELED: "CANCELED"
};
var UserStatus = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  BLOCKED: "BLOCKED",
  DELETED: "DELETED"
};
var TaskPriority = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
  URGENT: "URGENT"
};
var ProjectMemberRole = {
  OWNER: "OWNER",
  MANAGER: "MANAGER",
  CONTRIBUTOR: "CONTRIBUTOR",
  VIEWER: "VIEWER"
};

// src/generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/app/lib/prisma.ts
var connectionString = envVars.DATABASE_URL;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/app/utils/email.ts
import ejs from "ejs";
import status2 from "http-status";
import nodemailer from "nodemailer";
import path2 from "path";
var transporter = nodemailer.createTransport({
  host: envVars.EMAIL_SENDER.SMTP_HOST,
  secure: true,
  auth: {
    user: envVars.EMAIL_SENDER.SMTP_USER,
    pass: envVars.EMAIL_SENDER.SMTP_PASS
  },
  port: Number(envVars.EMAIL_SENDER.SMTP_PORT)
});
var sendEmail = async ({ subject, templateData, templateName, to, attachments }) => {
  try {
    const templatePath = path2.resolve(process.cwd(), `src/app/templates/${templateName}.ejs`);
    const html = await ejs.renderFile(templatePath, templateData);
    const info = await transporter.sendMail({
      from: envVars.EMAIL_SENDER.SMTP_FROM,
      to,
      subject,
      html,
      attachments: attachments?.map((attachment) => ({
        filename: attachment.filename,
        content: attachment.content,
        contentType: attachment.contentType
      }))
    });
    console.log(`Email sent to ${to} : ${info.messageId}`);
  } catch (error) {
    console.log("Email Sending Error", error.message);
    throw new AppError_default(status2.INTERNAL_SERVER_ERROR, "Failed to send email");
  }
};

// src/app/lib/auth.ts
var auth = betterAuth({
  baseURL: envVars.FRONTEND_URL,
  secret: envVars.FRONTEND_URL,
  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true
  },
  // mapping the user attributes to match your schema
  user: {
    additionalFields: {
      status: { type: "string", defaultValue: "ACTIVE" },
      needPasswordChange: { type: "boolean", defaultValue: false },
      isDeleted: { type: "boolean", defaultValue: false }
    }
  },
  plugins: [
    bearer(),
    emailOTP({
      overrideDefaultEmailVerification: true,
      async sendVerificationOTP({ email, otp, type }) {
        const user = await prisma.user.findFirst({
          where: { email },
          select: {
            id: true,
            email: true,
            name: true,
            emailVerified: true,
            // In your schema, "role" isn't a direct field, so we check memberships
            memberships: {
              include: { role: true }
            }
          }
        });
        if (!user) return;
        const isSuperAdmin = user.memberships.some(
          (m) => m.role.name === "SUPER_ADMIN"
        );
        if (isSuperAdmin) return;
        if (type === "email-verification" && !user.emailVerified) {
          await sendEmail({
            to: email,
            subject: "Verify your email",
            templateName: "otp",
            templateData: { name: user.name, otp }
          });
        } else if (type === "forget-password") {
          await sendEmail({
            to: email,
            subject: "Password Reset OTP",
            templateName: "otp",
            templateData: { name: user.name, otp }
          });
        }
      },
      expiresIn: 120,
      // 2 minutes
      otpLength: 6
    })
  ],
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24
  },
  socialProviders: {
    google: {
      clientId: envVars.GOOGLE_CLIENT_ID,
      clientSecret: envVars.GOOGLE_CLIENT_SECRET
    }
  },
  advanced: {
    cookies: {
      session_token: {
        name: "session_token",
        attributes: {
          sameSite: "none",
          secure: true,
          httpOnly: true,
          partitioned: true
        }
      }
    },
    state: {
      session_token: {
        name: "session_token",
        attributes: {
          sameSite: "none",
          secure: true,
          httpOnly: true,
          partitioned: true
        }
      }
    }
  }
  // advanced: {
  //   // If testing on localhost without https, set this to false
  //   useSecureCookies: process.env.NODE_ENV === "production",
  //   cookies: {
  //     sessionToken: {
  //       attributes: {
  //         sameSite: "lax", // Change "none" to "lax" for local development
  //         secure: process.env.NODE_ENV === "production",
  //       },
  //     },
  //   },
  // },
});
var sendVerificationEmailOTP = async (payload) => {
  return await auth.api.sendVerificationOTP({
    body: {
      email: payload.body.email,
      type: "email-verification"
    }
  });
};

// src/app/middleware/globalErrorHandler.ts
import status6 from "http-status";
import z from "zod";

// src/app/errorHelpers/handlePrismaErrors.ts
import status3 from "http-status";
var getStatusCodeFromPrismaError = (errorCode) => {
  if (errorCode === "P2002") {
    return status3.CONFLICT;
  }
  if (["P2025", "P2001", "P2015", "P2018"].includes(errorCode)) {
    return status3.NOT_FOUND;
  }
  if (["P1000", "P6002"].includes(errorCode)) {
    return status3.UNAUTHORIZED;
  }
  if (["P1010", "P6010"].includes(errorCode)) {
    return status3.FORBIDDEN;
  }
  if (errorCode === "P6003") {
    return status3.PAYMENT_REQUIRED;
  }
  if (["P1008", "P2004", "P6004"].includes(errorCode)) {
    return status3.GATEWAY_TIMEOUT;
  }
  if (errorCode === "P5011") {
    return status3.TOO_MANY_REQUESTS;
  }
  if (errorCode === "P6009") {
    return 413;
  }
  if (errorCode.startsWith("P1") || ["P2024", "P2037", "P6008"].includes(errorCode)) {
    return status3.SERVICE_UNAVAILABLE;
  }
  if (errorCode.startsWith("P2")) {
    return status3.BAD_REQUEST;
  }
  if (errorCode.startsWith("P3") || errorCode.startsWith("P4")) {
    return status3.INTERNAL_SERVER_ERROR;
  }
  return status3.INTERNAL_SERVER_ERROR;
};
var formatErrorMeta = (meta) => {
  if (!meta) return "";
  const parts = [];
  if (meta.target) {
    parts.push(`Field(s): ${String(meta.target)}`);
  }
  if (meta.field_name) {
    parts.push(`Field: ${String(meta.field_name)}`);
  }
  if (meta.column_name) {
    parts.push(`Column: ${String(meta.column_name)}`);
  }
  if (meta.table) {
    parts.push(`Table: ${String(meta.table)}`);
  }
  if (meta.model_name) {
    parts.push(`Model: ${String(meta.model_name)}`);
  }
  if (meta.relation_name) {
    parts.push(`Relation: ${String(meta.relation_name)}`);
  }
  if (meta.constraint) {
    parts.push(`Constraint: ${String(meta.constraint)}`);
  }
  if (meta.database_error) {
    parts.push(`Database Error: ${String(meta.database_error)}`);
  }
  return parts.length > 0 ? parts.join(" |") : "";
};
var handlePrismaClientKnownRequestError = (error) => {
  const statusCode = getStatusCodeFromPrismaError(error.code);
  const metaInfo = formatErrorMeta(error.meta);
  let cleanMessage = error.message;
  cleanMessage = cleanMessage.replace(/Invalid `.*?` invocation:?\s*/i, "");
  const lines = cleanMessage.split("\n").filter((line) => line.trim());
  const mainMessage = lines[0] || "An error occurred with the database operation.";
  const errorSources = [
    {
      path: error.code,
      message: metaInfo ? `${mainMessage} | ${metaInfo}` : mainMessage
    }
  ];
  if (error.meta?.cause) {
    errorSources.push({
      path: "cause",
      message: String(error.meta.cause)
    });
  }
  return {
    success: false,
    statusCode,
    message: `Prisma Client Known Request Error: ${mainMessage}`,
    errorSources
  };
};
var handlePrismaClientUnknownError = (error) => {
  let cleanMessage = error.message;
  cleanMessage = cleanMessage.replace(/Invalid `.*?` invocation:?\s*/i, "");
  const lines = cleanMessage.split("\n").filter((line) => line.trim());
  const mainMessage = lines[0] || "An unknown error occurred with the database operation.";
  const errorSources = [
    {
      path: "Unknown Prisma Error",
      message: mainMessage
    }
  ];
  return {
    success: false,
    statusCode: status3.INTERNAL_SERVER_ERROR,
    message: `Prisma Client Unknown Request Error: ${mainMessage}`,
    errorSources
  };
};
var handlePrismaClientValidationError = (error) => {
  let cleanMessage = error.message;
  cleanMessage = cleanMessage.replace(/Invalid `.*?` invocation:?\s*/i, "");
  const lines = cleanMessage.split("\n").filter((line) => line.trim());
  const errorSources = [];
  const fieldMatch = cleanMessage.match(/Argument `(\w+)`/i);
  const fieldName = fieldMatch ? fieldMatch[1] : "Unknown Field";
  const mainMessage = lines.find(
    (line) => !line.includes("Argument") && !line.includes("\u2192") && line.length > 10
  ) || lines[0] || "Invalid query parameters provided to the database operation.";
  errorSources.push({
    path: fieldName,
    message: mainMessage
  });
  return {
    success: false,
    statusCode: status3.BAD_REQUEST,
    message: `Prisma Client Validation Error: ${mainMessage}`,
    errorSources
  };
};
var handlerPrismaClientInitializationError = (error) => {
  const statusCode = error.errorCode ? getStatusCodeFromPrismaError(error.errorCode) : status3.SERVICE_UNAVAILABLE;
  const cleanMessage = error.message;
  cleanMessage.replace(/Invalid `.*?` invocation:?\s*/i, "");
  const lines = cleanMessage.split("\n").filter((line) => line.trim());
  const mainMessage = lines[0] || "An error occurred while initializing the Prisma Client.";
  const errorSources = [
    {
      path: error.errorCode || "Initialization Error",
      message: mainMessage
    }
  ];
  return {
    success: false,
    statusCode,
    message: `Prisma Client Initialization Error: ${mainMessage}`,
    errorSources
  };
};
var handlerPrismaClientRustPanicError = () => {
  const errorSources = [
    {
      path: "Rust Engine Crashed",
      message: "The database engine encountered a fatal error and crashed. This is usually due to an internal bug in the Prisma engine or an unexpected edge case in the database operation. Please check the Prisma logs for more details and consider reporting this issue to the Prisma team if it persists."
    }
  ];
  return {
    success: false,
    statusCode: status3.INTERNAL_SERVER_ERROR,
    message: "Prisma Client Rust Panic Error: The database engine crashed due to a fatal error.",
    errorSources
  };
};

// src/app/errorHelpers/handleZodError.ts
import status4 from "http-status";
var handleZodError = (err) => {
  const statusCode = status4.BAD_REQUEST;
  const message = "Zod Validation Error";
  const errorSources = [];
  err.issues.forEach((issue) => {
    errorSources.push({
      path: issue.path.join(" => "),
      message: issue.message
    });
  });
  return {
    success: false,
    message,
    errorSources,
    statusCode
  };
};

// src/app/config/cloudinary.config.ts
import { v2 as cloudinary } from "cloudinary";
import status5 from "http-status";
cloudinary.config({
  cloud_name: envVars.CLOUDINARY.CLOUDINARY_CLOUD_NAME,
  api_key: envVars.CLOUDINARY.CLOUDINARY_API_KEY,
  api_secret: envVars.CLOUDINARY.CLOUDINARY_API_SECRET
});
var deleteFileFromCloudinary = async (url) => {
  try {
    const regex = /\/v\d+\/(.+?)(?:\.[a-zA-Z0-9]+)+$/;
    const match = url.match(regex);
    if (match && match[1]) {
      const publicId = match[1];
      await cloudinary.uploader.destroy(publicId, {
        resource_type: "image"
      });
      console.log(`File ${publicId} deleted from cloudinary`);
    }
  } catch (error) {
    console.error("Error deleting file from Cloudinary:", error);
    throw new AppError_default(
      status5.INTERNAL_SERVER_ERROR,
      "Failed to delete file from Cloudinary"
    );
  }
};
var cloudinaryUpload = cloudinary;

// src/app/utils/deleteUploadedFilesFromGlobalErrorsHandler.ts
var deleteUploadedFilesFromGlobalErrorHandler = async (req) => {
  try {
    const filesToDelete = [];
    if (req.file && req.file?.path) {
      filesToDelete.push(req.file.path);
    } else if (req.files && typeof req.files === "object" && !Array.isArray(req.files)) {
      Object.values(req.files).forEach((fileArray) => {
        if (Array.isArray(fileArray)) {
          fileArray.forEach((file) => {
            if (file.path) {
              filesToDelete.push(file.path);
            }
          });
        }
      });
    } else if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      req.files.forEach((file) => {
        if (file.path) {
          filesToDelete.push(file.path);
        }
      });
    }
    if (filesToDelete.length > 0) {
      await Promise.all(
        filesToDelete.map((url) => deleteFileFromCloudinary(url))
      );
      console.log(
        `
Deleted ${filesToDelete.length} uploaded file(s) from Cloudinary due to an error during request processing.
`
      );
    }
  } catch (error) {
    console.error(
      "Error deleting uploaded files from Global Error Handler",
      error
    );
  }
};

// src/app/middleware/globalErrorHandler.ts
var globalErrorHandler = async (err, req, res, next) => {
  if (envVars.NODE_ENV === "development") {
    console.log("Error from Global Error Handler", err);
  }
  await deleteUploadedFilesFromGlobalErrorHandler(req);
  let errorSources = [];
  let statusCode = status6.INTERNAL_SERVER_ERROR;
  let message = "Internal Server Error";
  let stack = void 0;
  if (err instanceof prismaNamespace_exports.PrismaClientKnownRequestError) {
    const simplifiedError = handlePrismaClientKnownRequestError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
    stack = err.stack;
  } else if (err instanceof prismaNamespace_exports.PrismaClientUnknownRequestError) {
    const simplifiedError = handlePrismaClientUnknownError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
    stack = err.stack;
  } else if (err instanceof prismaNamespace_exports.PrismaClientValidationError) {
    const simplifiedError = handlePrismaClientValidationError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
    stack = err.stack;
  } else if (err instanceof prismaNamespace_exports.PrismaClientRustPanicError) {
    const simplifiedError = handlerPrismaClientRustPanicError();
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
    stack = err.stack;
  } else if (err instanceof prismaNamespace_exports.PrismaClientInitializationError) {
    const simplifiedError = handlerPrismaClientInitializationError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
    stack = err.stack;
  } else if (err instanceof z.ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
    stack = err.stack;
  } else if (err instanceof AppError_default) {
    statusCode = err.statusCode;
    message = err.message;
    stack = err.stack;
    errorSources = [
      {
        path: "",
        message: err.message
      }
    ];
  } else if (err instanceof Error) {
    statusCode = status6.INTERNAL_SERVER_ERROR;
    message = err.message;
    stack = err.stack;
    errorSources = [
      {
        path: "",
        message: err.message
      }
    ];
  }
  const errorResponse = {
    success: false,
    message,
    errorSources,
    error: envVars.NODE_ENV === "development" ? err : void 0,
    stack: envVars.NODE_ENV === "development" ? stack : void 0
  };
  res.status(statusCode).json(errorResponse);
};

// src/app/middleware/notFound.ts
import status7 from "http-status";
var notFound = (req, res) => {
  res.status(status7.NOT_FOUND).json({
    success: false,
    message: `Route ${req.originalUrl} Not Found`
  });
};

// src/app/routes/index.ts
import { Router as Router21 } from "express";

// src/app/module/auth/auth.route.ts
import { Router } from "express";

// src/app/middleware/checkAuth.ts
import httpStatus from "http-status";

// src/app/utils/cookie.ts
var setCookie = (res, key, value, options) => {
  res.cookie(key, value, options);
};
var getCookie = (req, key) => {
  return req.cookies[key];
};
var clearCookie = (res, key, options) => {
  res.clearCookie(key, options);
};
var CookieUtils = {
  setCookie,
  getCookie,
  clearCookie
};

// src/app/utils/jwt.ts
import jwt from "jsonwebtoken";
var createToken = (payload, secret, { expiresIn }) => {
  const token = jwt.sign(payload, secret, { expiresIn });
  return token;
};
var verifyToken = (token, secret) => {
  try {
    const decoded = jwt.verify(token, secret);
    return {
      success: true,
      data: decoded
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      error
    };
  }
};
var decodeToken = (token) => {
  const decoded = jwt.decode(token);
  return decoded;
};
var jwtUtils = {
  createToken,
  verifyToken,
  decodeToken
};

// src/app/middleware/checkAuth.ts
var checkAuth = () => async (req, res, next) => {
  try {
    const sessionToken = CookieUtils.getCookie(
      req,
      "better-auth.session_token"
    );
    const accessToken = CookieUtils.getCookie(req, "accessToken");
    if (!sessionToken && !accessToken) {
      throw new AppError_default(
        httpStatus.UNAUTHORIZED,
        "Authentication required. Please log in."
      );
    }
    let userId = null;
    if (sessionToken) {
      const sessionData = await prisma.session.findUnique({
        where: { token: sessionToken },
        include: { user: true }
      });
      if (!sessionData || new Date(sessionData.expiresAt) < /* @__PURE__ */ new Date()) {
        throw new AppError_default(
          httpStatus.UNAUTHORIZED,
          "Session expired or invalid."
        );
      }
      userId = sessionData.userId;
      req.user = {
        userId: sessionData.user.id,
        email: sessionData.user.email,
        name: sessionData.user.name
      };
    } else if (accessToken) {
      const verified = jwtUtils.verifyToken(
        accessToken,
        envVars.ACCESS_TOKEN_SECRET
      );
      if (!verified.success || !verified.data) {
        throw new AppError_default(httpStatus.UNAUTHORIZED, "Invalid access token.");
      }
      userId = verified.data.userId;
      req.user = {
        userId: verified.data.userId,
        email: verified.data.email,
        name: verified.data.name
      };
    }
    if (userId) {
      const userStatus = await prisma.user.findUnique({
        where: { id: userId },
        select: { status: true, isDeleted: true }
      });
      if (!userStatus || userStatus.isDeleted) {
        throw new AppError_default(
          httpStatus.UNAUTHORIZED,
          "This account has been deleted."
        );
      }
      if (userStatus.status === UserStatus.BLOCKED) {
        throw new AppError_default(
          httpStatus.FORBIDDEN,
          "Your account has been blocked. Contact support."
        );
      }
      if (userStatus.status === UserStatus.INACTIVE) {
        throw new AppError_default(
          httpStatus.FORBIDDEN,
          "Please verify your email to activate your account."
        );
      }
    }
    next();
  } catch (error) {
    next(error);
  }
};

// src/app/module/auth/auth.controller.ts
import httpStatus2 from "http-status";

// src/app/shared/catchAsync.ts
var catchAsync = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

// src/app/shared/sendResponse.ts
var sendResponse = (res, responseData) => {
  const { httpStatusCode, success, message, data, meta } = responseData;
  res.status(httpStatusCode).json({
    success,
    message,
    data,
    meta
  });
};

// src/app/utils/token.ts
var getAccessToken = (payload) => {
  const accessToken = jwtUtils.createToken(
    payload,
    envVars.ACCESS_TOKEN_SECRET,
    { expiresIn: envVars.ACCESS_TOKEN_EXPIRES_IN }
  );
  return accessToken;
};
var getRefreshToken = (payload) => {
  const refreshToken3 = jwtUtils.createToken(
    payload,
    envVars.REFRESH_TOKEN_SECRET,
    { expiresIn: envVars.REFRESH_TOKEN_EXPIRES_IN }
  );
  return refreshToken3;
};
var setAccessTokenCookie = (res, token) => {
  CookieUtils.setCookie(res, "accessToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    //1 day
    maxAge: 60 * 60 * 24 * 1e3
  });
};
var setRefreshTokenCookie = (res, token) => {
  CookieUtils.setCookie(res, "refreshToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    //7d
    maxAge: 60 * 60 * 24 * 1e3 * 7
  });
};
var setBetterAuthSessionCookie = (res, token) => {
  CookieUtils.setCookie(res, "better-auth.session_token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    //1 day
    maxAge: 60 * 60 * 24 * 1e3
  });
};
var tokenUtils = {
  getAccessToken,
  getRefreshToken,
  setAccessTokenCookie,
  setRefreshTokenCookie,
  setBetterAuthSessionCookie
};

// src/app/module/auth/auth.service.ts
import status8 from "http-status";
var register = async (payload) => {
  const { name, email, password } = payload;
  const existingUser = await prisma.user.findFirst({ where: { email } });
  if (existingUser) {
    throw new AppError_default(
      status8.CONFLICT,
      "An account with this email already exists"
    );
  }
  const data = await auth.api.signUpEmail({ body: { name, email, password } });
  if (!data?.user) {
    throw new AppError_default(
      status8.BAD_REQUEST,
      "Registration failed. Please try again"
    );
  }
  const user = await prisma.user.findUnique({
    where: { id: data.user.id }
  });
  const tokenPayload = {
    userId: data.user.id,
    name: data.user.name,
    email: data.user.email,
    status: user?.status,
    isDeleted: user?.isDeleted,
    emailVerified: data.user.emailVerified
  };
  const accessToken = tokenUtils.getAccessToken(tokenPayload);
  const refreshToken3 = tokenUtils.getRefreshToken(tokenPayload);
  return {
    accessToken,
    refreshToken: refreshToken3,
    sessionToken: data.token
  };
};
var login = async (payload) => {
  const { email, password } = payload;
  const data = await auth.api.signInEmail({ body: { email, password } });
  if (!data?.user) {
    throw new AppError_default(status8.UNAUTHORIZED, "Invalid email or password");
  }
  const user = await prisma.user.findUnique({
    where: { id: data.user.id }
  });
  if (user?.status === UserStatus.BLOCKED) {
    throw new AppError_default(
      status8.FORBIDDEN,
      "Your account has been blocked. Contact support"
    );
  }
  if (user?.isDeleted || user?.status === UserStatus.DELETED) {
    throw new AppError_default(status8.NOT_FOUND, "Account no longer exists");
  }
  const tokenPayload = {
    userId: data.user.id,
    name: data.user.name,
    email: data.user.email,
    status: user?.status,
    isDeleted: user?.isDeleted,
    emailVerified: data.user.emailVerified
  };
  const accessToken = tokenUtils.getAccessToken(tokenPayload);
  const refreshToken3 = tokenUtils.getRefreshToken(tokenPayload);
  return {
    accessToken,
    refreshToken: refreshToken3,
    sessionToken: data.token
  };
};
var logout = async (sessionToken) => {
  if (!sessionToken) {
    throw new AppError_default(status8.BAD_REQUEST, "Session token is required");
  }
  await auth.api.signOut({
    headers: new Headers({ Authorization: `Bearer ${sessionToken}` })
  });
};
var refreshToken = async (incomingRefreshToken, sessionToken) => {
  const session = await prisma.session.findUnique({
    where: { token: sessionToken },
    include: { user: true }
  });
  if (!session) {
    throw new AppError_default(status8.UNAUTHORIZED, "Session is expired or invalid");
  }
  if (session.expiresAt < /* @__PURE__ */ new Date()) {
    throw new AppError_default(
      status8.UNAUTHORIZED,
      "Session has expired. Please log in again"
    );
  }
  const verification = jwtUtils.verifyToken(
    incomingRefreshToken,
    envVars.REFRESH_TOKEN_SECRET
  );
  if (!verification.success || !verification.data) {
    throw new AppError_default(
      status8.UNAUTHORIZED,
      "Refresh token is invalid or expired"
    );
  }
  const decoded = verification.data;
  const user = session.user;
  if (user.isDeleted || user.status === UserStatus.DELETED) {
    throw new AppError_default(status8.NOT_FOUND, "Account no longer exists");
  }
  const tokenPayload = {
    userId: user.id,
    name: user.name,
    email: user.email,
    status: user.status,
    isDeleted: user.isDeleted,
    emailVerified: user.emailVerified
  };
  const newAccessToken = tokenUtils.getAccessToken(tokenPayload);
  const newRefreshToken = tokenUtils.getRefreshToken(tokenPayload);
  const updatedSession = await prisma.session.update({
    where: { token: sessionToken },
    data: { expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1e3) }
  });
  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    sessionToken: updatedSession.token
  };
};
var getMe = async (requestUser) => {
  const user = await prisma.user.findUnique({
    where: { id: requestUser.userId },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      emailVerified: true,
      status: true,
      needPasswordChange: true,
      isDeleted: true,
      createdAt: true,
      updatedAt: true,
      memberships: {
        include: {
          organization: { select: { id: true, name: true, slug: true } },
          role: { select: { id: true, name: true } }
        }
      },
      ownedOrganizations: { select: { id: true, name: true, slug: true } }
    }
  });
  if (!user) {
    throw new AppError_default(status8.NOT_FOUND, "User not found");
  }
  if (user.isDeleted) {
    throw new AppError_default(status8.GONE, "This account has been deleted");
  }
  return user;
};
var changePassword = async (payload, sessionToken) => {
  const session = await auth.api.getSession({
    headers: new Headers({ Authorization: `Bearer ${sessionToken}` })
  });
  if (!session?.user) {
    throw new AppError_default(status8.UNAUTHORIZED, "Session is invalid or expired");
  }
  const { currentPassword, newPassword } = payload;
  if (currentPassword === newPassword) {
    throw new AppError_default(
      status8.BAD_REQUEST,
      "New password must be different from current password"
    );
  }
  await auth.api.changePassword({
    body: { currentPassword, newPassword, revokeOtherSessions: true },
    headers: new Headers({ Authorization: `Bearer ${sessionToken}` })
  });
  const user = await prisma.user.findUnique({
    where: { id: session.user.id }
  });
  if (user?.needPasswordChange) {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { needPasswordChange: false }
    });
  }
  const tokenPayload = {
    userId: session.user.id,
    name: session.user.name,
    email: session.user.email,
    status: user?.status,
    isDeleted: user?.isDeleted,
    emailVerified: session.user.emailVerified
  };
  return {
    accessToken: tokenUtils.getAccessToken(tokenPayload),
    refreshToken: tokenUtils.getRefreshToken(tokenPayload),
    sessionToken
  };
};
var verifyEmail = async (email, otp) => {
  const user = await prisma.user.findFirst({
    where: { email }
  });
  if (!user) {
    throw new AppError_default(status8.NOT_FOUND, "No account found with this email");
  }
  if (user.emailVerified) {
    throw new AppError_default(status8.BAD_REQUEST, "Email is already verified");
  }
  await auth.api.verifyEmailOTP({ body: { email, otp } });
  await prisma.user.updateMany({
    where: { email },
    data: { emailVerified: true }
  });
};
var resendVerificationEmail = async (email) => {
  const user = await prisma.user.findFirst({ where: { email } });
  if (!user) {
    throw new AppError_default(status8.NOT_FOUND, "No account found with this email");
  }
  if (user.emailVerified) {
    throw new AppError_default(status8.BAD_REQUEST, "Email is already verified");
  }
  if (user.isDeleted || user.status === UserStatus.DELETED) {
    throw new AppError_default(status8.NOT_FOUND, "Account not found");
  }
  await sendVerificationEmailOTP({ body: { email } });
};
var forgotPassword = async (email) => {
  const user = await prisma.user.findFirst({ where: { email } });
  if (!user) {
    return;
  }
  if (!user.emailVerified) {
    throw new AppError_default(
      status8.BAD_REQUEST,
      "Please verify your email address first"
    );
  }
  if (user.isDeleted || user.status === UserStatus.DELETED) {
    return;
  }
  await auth.api.requestPasswordResetEmailOTP({ body: { email } });
};
var resetPassword = async (payload) => {
  const { email, otp, newPassword } = payload;
  const user = await prisma.user.findFirst({ where: { email } });
  if (!user) {
    throw new AppError_default(status8.NOT_FOUND, "No account found with this email");
  }
  if (!user.emailVerified) {
    throw new AppError_default(status8.BAD_REQUEST, "Email is not verified");
  }
  if (user.isDeleted || user.status === UserStatus.DELETED) {
    throw new AppError_default(status8.NOT_FOUND, "Account not found");
  }
  await auth.api.resetPasswordEmailOTP({
    body: { email, otp, password: newPassword }
  });
  if (user.needPasswordChange) {
    await prisma.user.update({
      where: { id: user.id },
      data: { needPasswordChange: false }
    });
  }
  await prisma.session.deleteMany({ where: { userId: user.id } });
};
var getAllSessions = async (userId) => {
  const sessions = await prisma.session.findMany({
    where: {
      userId,
      expiresAt: { gt: /* @__PURE__ */ new Date() }
    },
    select: {
      id: true,
      token: false,
      // never expose raw session token
      ipAddress: true,
      userAgent: true,
      createdAt: true,
      expiresAt: true
    },
    orderBy: { createdAt: "desc" }
  });
  return sessions;
};
var revokeSession = async (userId, sessionId) => {
  const session = await prisma.session.findFirst({
    where: { id: sessionId, userId }
  });
  if (!session) {
    throw new AppError_default(status8.NOT_FOUND, "Session not found");
  }
  await prisma.session.delete({ where: { id: sessionId } });
};
var revokeAllSessions = async (userId) => {
  const result = await prisma.session.deleteMany({ where: { userId } });
  return { count: result.count };
};
var AuthService = {
  register,
  login,
  logout,
  refreshToken,
  getMe,
  changePassword,
  verifyEmail,
  resendVerificationEmail,
  forgotPassword,
  resetPassword,
  getAllSessions,
  revokeSession,
  revokeAllSessions
};

// src/app/module/auth/auth.controller.ts
var register2 = catchAsync(async (req, res) => {
  const result = await AuthService.register(req.body);
  const { accessToken, refreshToken: refreshToken3, sessionToken } = result;
  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken3);
  tokenUtils.setBetterAuthSessionCookie(res, sessionToken);
  sendResponse(res, {
    httpStatusCode: httpStatus2.CREATED,
    success: true,
    message: "Account created successfully",
    data: { accessToken, refreshToken: refreshToken3, sessionToken }
  });
});
var login2 = catchAsync(async (req, res) => {
  const result = await AuthService.login(req.body);
  const { accessToken, refreshToken: refreshToken3, sessionToken } = result;
  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken3);
  tokenUtils.setBetterAuthSessionCookie(res, sessionToken);
  sendResponse(res, {
    httpStatusCode: httpStatus2.OK,
    success: true,
    message: "Logged in successfully",
    data: { accessToken, refreshToken: refreshToken3, sessionToken }
  });
});
var logout2 = catchAsync(async (req, res) => {
  const sessionToken = req.cookies["better-auth.session_token"];
  await AuthService.logout(sessionToken);
  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "none"
  };
  CookieUtils.clearCookie(res, "accessToken", cookieOptions);
  CookieUtils.clearCookie(res, "refreshToken", cookieOptions);
  CookieUtils.clearCookie(res, "better-auth.session_token", cookieOptions);
  sendResponse(res, {
    httpStatusCode: httpStatus2.OK,
    success: true,
    message: "Logged out successfully",
    data: null
  });
});
var refreshToken2 = catchAsync(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken;
  const sessionToken = req.cookies["better-auth.session_token"];
  if (!incomingRefreshToken) {
    return sendResponse(res, {
      httpStatusCode: httpStatus2.UNAUTHORIZED,
      success: false,
      message: "Refresh token is missing",
      data: null
    });
  }
  const result = await AuthService.refreshToken(
    incomingRefreshToken,
    sessionToken
  );
  const {
    accessToken,
    refreshToken: newRefreshToken,
    sessionToken: newSessionToken
  } = result;
  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, newRefreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, newSessionToken);
  sendResponse(res, {
    httpStatusCode: httpStatus2.OK,
    success: true,
    message: "Tokens refreshed successfully",
    data: {
      accessToken,
      refreshToken: newRefreshToken,
      sessionToken: newSessionToken
    }
  });
});
var getMe2 = catchAsync(async (req, res) => {
  const result = await AuthService.getMe(req.user);
  sendResponse(res, {
    httpStatusCode: httpStatus2.OK,
    success: true,
    message: "Profile fetched successfully",
    data: result
  });
});
var changePassword2 = catchAsync(async (req, res) => {
  const sessionToken = req.cookies["better-auth.session_token"];
  const result = await AuthService.changePassword(req.body, sessionToken);
  const { accessToken, refreshToken: refreshToken3, sessionToken: newSessionToken } = result;
  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken3);
  tokenUtils.setBetterAuthSessionCookie(res, newSessionToken);
  sendResponse(res, {
    httpStatusCode: httpStatus2.OK,
    success: true,
    message: "Password changed successfully",
    data: { accessToken, refreshToken: refreshToken3 }
  });
});
var verifyEmail2 = catchAsync(async (req, res) => {
  const { email, otp } = req.body;
  await AuthService.verifyEmail(email, otp);
  sendResponse(res, {
    httpStatusCode: httpStatus2.OK,
    success: true,
    message: "Email verified successfully",
    data: null
  });
});
var resendVerificationEmail2 = catchAsync(
  async (req, res) => {
    const { email } = req.body;
    await AuthService.resendVerificationEmail(email);
    sendResponse(res, {
      httpStatusCode: httpStatus2.OK,
      success: true,
      message: "Verification email sent successfully",
      data: null
    });
  }
);
var forgotPassword2 = catchAsync(async (req, res) => {
  const { email } = req.body;
  await AuthService.forgotPassword(email);
  sendResponse(res, {
    httpStatusCode: httpStatus2.OK,
    success: true,
    message: "If an account exists, a password reset OTP has been sent",
    data: null
  });
});
var resetPassword2 = catchAsync(async (req, res) => {
  await AuthService.resetPassword(req.body);
  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "none"
  };
  CookieUtils.clearCookie(res, "accessToken", cookieOptions);
  CookieUtils.clearCookie(res, "refreshToken", cookieOptions);
  CookieUtils.clearCookie(res, "better-auth.session_token", cookieOptions);
  sendResponse(res, {
    httpStatusCode: httpStatus2.OK,
    success: true,
    message: "Password reset successfully. Please log in with your new password",
    data: null
  });
});
var getAllSessions2 = catchAsync(async (req, res) => {
  const result = await AuthService.getAllSessions(req.user.userId);
  sendResponse(res, {
    httpStatusCode: httpStatus2.OK,
    success: true,
    message: "Active sessions fetched successfully",
    data: result
  });
});
var revokeSession2 = catchAsync(async (req, res) => {
  const { sessionId } = req.params;
  await AuthService.revokeSession(req.user.userId, sessionId);
  sendResponse(res, {
    httpStatusCode: httpStatus2.OK,
    success: true,
    message: "Session revoked successfully",
    data: null
  });
});
var revokeAllSessions2 = catchAsync(async (req, res) => {
  const result = await AuthService.revokeAllSessions(req.user.userId);
  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "none"
  };
  CookieUtils.clearCookie(res, "accessToken", cookieOptions);
  CookieUtils.clearCookie(res, "refreshToken", cookieOptions);
  CookieUtils.clearCookie(res, "better-auth.session_token", cookieOptions);
  sendResponse(res, {
    httpStatusCode: httpStatus2.OK,
    success: true,
    message: `All ${result.count} session(s) revoked. You have been signed out everywhere`,
    data: result
  });
});
var AuthController = {
  register: register2,
  login: login2,
  logout: logout2,
  refreshToken: refreshToken2,
  getMe: getMe2,
  changePassword: changePassword2,
  verifyEmail: verifyEmail2,
  resendVerificationEmail: resendVerificationEmail2,
  forgotPassword: forgotPassword2,
  resetPassword: resetPassword2,
  getAllSessions: getAllSessions2,
  revokeSession: revokeSession2,
  revokeAllSessions: revokeAllSessions2
};

// src/app/module/auth/auth.route.ts
var router = Router();
router.post(
  "/register",
  // validateRequest(AuthValidation.registerSchema),
  AuthController.register
);
router.post(
  "/login",
  // validateRequest(AuthValidation.loginSchema),
  AuthController.login
);
router.post("/refresh-token", AuthController.refreshToken);
router.post(
  "/verify-email",
  // validateRequest(AuthValidation.verifyEmailSchema),
  AuthController.verifyEmail
);
router.post(
  "/resend-verification",
  // validateRequest(AuthValidation.resendVerificationSchema),
  AuthController.resendVerificationEmail
);
router.post(
  "/forgot-password",
  // validateRequest(AuthValidation.forgotPasswordSchema),
  AuthController.forgotPassword
);
router.post(
  "/reset-password",
  // validateRequest(AuthValidation.resetPasswordSchema),
  AuthController.resetPassword
);
router.get("/me", checkAuth(), AuthController.getMe);
router.patch(
  "/change-password",
  checkAuth(),
  // validateRequest(AuthValidation.changePasswordSchema),
  AuthController.changePassword
);
router.post("/logout", checkAuth(), AuthController.logout);
router.get("/sessions", checkAuth(), AuthController.getAllSessions);
router.delete(
  "/sessions/:sessionId",
  checkAuth(),
  AuthController.revokeSession
);
router.delete("/sessions", checkAuth(), AuthController.revokeAllSessions);
var AuthRoutes = router;

// src/app/module/invitation/invitation.route.ts
import { Router as Router2 } from "express";

// src/app/middleware/validateRequest.ts
var validateRequest = (zodSchema) => {
  return async (req, res, next) => {
    try {
      if (req.body.data && typeof req.body.data === "string") {
        req.body = JSON.parse(req.body.data);
      }
      const parsedResult = await zodSchema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
        cookies: req.cookies
      });
      req.body = parsedResult.body;
      if (parsedResult.params) Object.assign(req.params, parsedResult.params);
      if (parsedResult.query) Object.assign(req.query, parsedResult.query);
      next();
    } catch (error) {
      next(error);
    }
  };
};

// src/app/module/invitation/invitation.contoller.ts
import httpStatus3 from "http-status";

// src/app/module/invitation/invitation.service.ts
import status9 from "http-status";
import crypto from "crypto";
var sendInvitation = async (inviterId, orgId, payload) => {
  const existingMember = await prisma.membership.findFirst({
    where: { organizationId: orgId, user: { email: payload.email } }
  });
  if (existingMember)
    throw new AppError_default(status9.CONFLICT, "User is already a member");
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = /* @__PURE__ */ new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);
  const invitation = await prisma.invitation.create({
    data: {
      email: payload.email,
      organizationId: orgId,
      inviterId,
      roleId: payload.roleId,
      token,
      expiresAt,
      status: "PENDING"
    }
  });
  return invitation;
};
var getOrgInvitations = async (orgId) => {
  return await prisma.invitation.findMany({
    where: { organizationId: orgId, status: "PENDING" },
    include: { inviter: { select: { name: true } }, role: true }
  });
};
var revokeInvitation = async (actorId, invitationId) => {
  const invitation = await prisma.invitation.findUnique({
    where: { id: invitationId }
  });
  if (!invitation) throw new AppError_default(status9.NOT_FOUND, "Invitation not found");
  return await prisma.invitation.delete({ where: { id: invitationId } });
};
var verifyInvitationToken = async (token) => {
  const invitation = await prisma.invitation.findUnique({
    where: { token },
    include: { organization: { select: { name: true } } }
  });
  if (!invitation)
    throw new AppError_default(status9.NOT_FOUND, "Invalid invitation token");
  if (!invitation.expiresAt || invitation.expiresAt < /* @__PURE__ */ new Date())
    throw new AppError_default(status9.GONE, "Invitation expired");
  if (invitation.status !== "PENDING")
    throw new AppError_default(status9.BAD_REQUEST, "Invitation already processed");
  return invitation;
};
var acceptInvitation = async (token) => {
  const invitation = await verifyInvitationToken(token);
  const user = await prisma.user.findUnique({
    where: { email: invitation.email }
  });
  if (!user)
    throw new AppError_default(
      status9.NOT_FOUND,
      "Please register an account with this email first"
    );
  return await prisma.$transaction(async (tx) => {
    const membership = await tx.membership.create({
      data: {
        userId: user.id,
        organizationId: invitation.organizationId,
        roleId: invitation.roleId
      }
    });
    await tx.invitation.update({
      where: { id: invitation.id },
      data: { status: "ACCEPTED" }
    });
    return membership;
  });
};
var declineInvitation = async (token) => {
  const invitation = await verifyInvitationToken(token);
  return await prisma.invitation.update({
    where: { id: invitation.id },
    data: { status: "DECLINED" }
  });
};
var InvitationService = {
  sendInvitation,
  getOrgInvitations,
  revokeInvitation,
  verifyInvitationToken,
  acceptInvitation,
  declineInvitation
};

// src/app/module/invitation/invitation.contoller.ts
var sendInvitation2 = catchAsync(async (req, res) => {
  const result = await InvitationService.sendInvitation(
    req.user.userId,
    req.params.orgId,
    req.body
  );
  sendResponse(res, {
    httpStatusCode: httpStatus3.CREATED,
    success: true,
    message: "Invitation sent successfully",
    data: result
  });
});
var getOrgInvitations2 = catchAsync(async (req, res) => {
  const result = await InvitationService.getOrgInvitations(
    req.params.orgId
  );
  sendResponse(res, {
    httpStatusCode: httpStatus3.OK,
    success: true,
    message: "Pending invitations retrieved",
    data: result
  });
});
var revokeInvitation2 = catchAsync(async (req, res) => {
  await InvitationService.revokeInvitation(
    req.user.userId,
    req.params.invitationId
  );
  sendResponse(res, {
    httpStatusCode: httpStatus3.OK,
    success: true,
    message: "Invitation revoked successfully",
    data: null
  });
});
var verifyInvitationToken2 = catchAsync(
  async (req, res) => {
    const result = await InvitationService.verifyInvitationToken(
      req.params.token
    );
    sendResponse(res, {
      httpStatusCode: httpStatus3.OK,
      success: true,
      message: "Token is valid",
      data: result
    });
  }
);
var acceptInvitation2 = catchAsync(async (req, res) => {
  const result = await InvitationService.acceptInvitation(req.body.token);
  sendResponse(res, {
    httpStatusCode: httpStatus3.OK,
    success: true,
    message: "Invitation accepted. You are now a member.",
    data: result
  });
});
var declineInvitation2 = catchAsync(async (req, res) => {
  await InvitationService.declineInvitation(req.body.token);
  sendResponse(res, {
    httpStatusCode: httpStatus3.OK,
    success: true,
    message: "Invitation declined",
    data: null
  });
});
var InvitationController = {
  sendInvitation: sendInvitation2,
  getOrgInvitations: getOrgInvitations2,
  revokeInvitation: revokeInvitation2,
  verifyInvitationToken: verifyInvitationToken2,
  acceptInvitation: acceptInvitation2,
  declineInvitation: declineInvitation2
};

// src/app/module/invitation/invitation.validation.ts
import { z as z2 } from "zod";
var sendInvitationSchema = z2.object({
  body: z2.object({
    email: z2.string().email(),
    roleId: z2.string().cuid().or(z2.string().uuid())
  })
});
var tokenActionSchema = z2.object({
  body: z2.object({
    token: z2.string().min(10)
  })
});
var InvitationValidation = {
  sendInvitationSchema,
  tokenActionSchema
};

// src/app/module/invitation/invitation.route.ts
var router2 = Router2();
router2.post(
  "/:orgId",
  checkAuth(),
  validateRequest(InvitationValidation.sendInvitationSchema),
  InvitationController.sendInvitation
);
router2.get("/:orgId", checkAuth(), InvitationController.getOrgInvitations);
router2.delete(
  "/:invitationId/revoke",
  checkAuth(),
  InvitationController.revokeInvitation
);
router2.get("/verify/:token", InvitationController.verifyInvitationToken);
router2.post(
  "/accept",
  validateRequest(InvitationValidation.tokenActionSchema),
  InvitationController.acceptInvitation
);
router2.post(
  "/decline",
  validateRequest(InvitationValidation.tokenActionSchema),
  InvitationController.declineInvitation
);
var InvitationRoutes = router2;

// src/app/module/activityLog/activityLog.route.ts
import { Router as Router3 } from "express";

// src/app/module/activityLog/activityLog.controller.ts
import httpStatus4 from "http-status";

// src/app/module/activityLog/activityLog.service.ts
import status10 from "http-status";
import { subDays } from "date-fns";
var getOrgLogs = async (orgId, query) => {
  const { page = 1, limit = 20 } = query;
  const skip = (Number(page) - 1) * Number(limit);
  const [logs, total] = await Promise.all([
    prisma.activityLog.findMany({
      where: { organizationId: orgId },
      include: { actor: { select: { name: true, email: true } } },
      orderBy: { createdAt: "desc" },
      skip,
      take: Number(limit)
    }),
    prisma.activityLog.count({ where: { organizationId: orgId } })
  ]);
  return {
    meta: { total, page: Number(page), limit: Number(limit) },
    data: logs
  };
};
var filterLogs = async (orgId, filters) => {
  const { actorId, action, startDate, endDate, page = 1, limit = 20 } = filters;
  const where = { organizationId: orgId };
  if (actorId) where.actorId = actorId;
  if (action) where.action = { contains: action, mode: "insensitive" };
  if (startDate || endDate) {
    where.createdAt = {
      ...startDate && { gte: new Date(startDate) },
      ...endDate && { lte: new Date(endDate) }
    };
  }
  const logs = await prisma.activityLog.findMany({
    where,
    include: { actor: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
    skip: (Number(page) - 1) * Number(limit),
    take: Number(limit)
  });
  return logs;
};
var getLogById = async (orgId, logId) => {
  const log = await prisma.activityLog.findFirst({
    where: { id: logId, organizationId: orgId },
    include: { actor: { select: { name: true, email: true } } }
  });
  if (!log) throw new AppError_default(status10.NOT_FOUND, "Log entry not found");
  return log;
};
var purgeLogs = async (userId, orgId, days) => {
  const org = await prisma.organization.findFirst({
    where: { id: orgId, ownerId: userId }
  });
  if (!org) {
    throw new AppError_default(
      status10.FORBIDDEN,
      "Only the organization owner can purge logs"
    );
  }
  const dateLimit = subDays(/* @__PURE__ */ new Date(), days);
  const result = await prisma.activityLog.deleteMany({
    where: {
      organizationId: orgId,
      createdAt: { lt: dateLimit }
    }
  });
  return result;
};
var ActivityLogService = {
  getOrgLogs,
  filterLogs,
  getLogById,
  purgeLogs
};

// src/app/module/activityLog/activityLog.controller.ts
var getOrgLogs2 = catchAsync(async (req, res) => {
  const result = await ActivityLogService.getOrgLogs(
    req.params.orgId,
    req.query
  );
  sendResponse(res, {
    httpStatusCode: httpStatus4.OK,
    success: true,
    message: "Activity logs retrieved",
    data: result
  });
});
var filterLogs2 = catchAsync(async (req, res) => {
  const result = await ActivityLogService.filterLogs(
    req.params.orgId,
    req.query
  );
  sendResponse(res, {
    httpStatusCode: httpStatus4.OK,
    success: true,
    message: "Filtered logs retrieved",
    data: result
  });
});
var getLogById2 = catchAsync(async (req, res) => {
  const result = await ActivityLogService.getLogById(
    req.params.orgId,
    req.params.logId
  );
  sendResponse(res, {
    httpStatusCode: httpStatus4.OK,
    success: true,
    message: "Log entry retrieved",
    data: result
  });
});
var purgeLogs2 = catchAsync(async (req, res) => {
  const result = await ActivityLogService.purgeLogs(
    req.user.userId,
    req.params.orgId,
    req.body.days
  );
  sendResponse(res, {
    httpStatusCode: httpStatus4.OK,
    success: true,
    message: `Successfully purged ${result.count} old log entries`,
    data: result
  });
});
var ActivityLogController = {
  getOrgLogs: getOrgLogs2,
  filterLogs: filterLogs2,
  getLogById: getLogById2,
  purgeLogs: purgeLogs2
};

// src/app/module/activityLog/activityLog.validation.ts
import { z as z3 } from "zod";
var filterLogsSchema = z3.object({
  query: z3.object({
    actorId: z3.string().optional(),
    action: z3.string().optional(),
    startDate: z3.string().datetime().optional(),
    endDate: z3.string().datetime().optional(),
    page: z3.string().optional(),
    limit: z3.string().optional()
  })
});
var purgeLogsSchema = z3.object({
  body: z3.object({
    days: z3.number().min(1, "Must be at least 1 day")
  })
});
var ActivityLogValidation = {
  filterLogsSchema,
  purgeLogsSchema
};

// src/app/module/activityLog/activityLog.route.ts
var router3 = Router3();
router3.get("/:orgId", checkAuth(), ActivityLogController.getOrgLogs);
router3.get(
  "/:orgId/filter",
  checkAuth(),
  validateRequest(ActivityLogValidation.filterLogsSchema),
  ActivityLogController.filterLogs
);
router3.get("/:orgId/:logId", checkAuth(), ActivityLogController.getLogById);
router3.delete(
  "/:orgId/purge",
  checkAuth(),
  // Further role check handled in service/controller
  validateRequest(ActivityLogValidation.purgeLogsSchema),
  ActivityLogController.purgeLogs
);
var ActivityLogRoutes = router3;

// src/app/module/apiKey/apiKey.route.ts
import { Router as Router4 } from "express";

// src/app/module/apiKey/apiKey.controller.ts
import httpStatus5 from "http-status";

// src/app/module/apiKey/apiKey.service.ts
import status11 from "http-status";
import crypto2 from "crypto";
var generateKeyData = () => {
  const rawKey = crypto2.randomBytes(32).toString("hex");
  const fullKey = `cp_${rawKey}`;
  const keyPrefix = fullKey.substring(0, 8);
  const keyHash = crypto2.createHash("sha256").update(fullKey).digest("hex");
  return { fullKey, keyPrefix, keyHash };
};
var verifyOrgAdmin = async (userId, orgId) => {
  const membership = await prisma.membership.findFirst({
    where: { organizationId: orgId, userId },
    include: { role: true }
  });
  if (!membership || membership.role.name !== "OWNER" && membership.role.name !== "ADMIN") {
    throw new AppError_default(
      status11.FORBIDDEN,
      "Only organization administrators can manage API keys"
    );
  }
};
var createApiKey = async (userId, orgId, payload) => {
  await verifyOrgAdmin(userId, orgId);
  const { fullKey, keyPrefix, keyHash } = generateKeyData();
  const apiKey = await prisma.apiKey.create({
    data: {
      organizationId: orgId,
      name: payload.name,
      keyHash,
      // Storing hash
      keyPrefix,
      // Storing prefix
      expiresAt: payload.expiresAt ? new Date(payload.expiresAt) : null
    },
    select: {
      id: true,
      name: true,
      keyPrefix: true,
      expiresAt: true,
      createdAt: true
    }
  });
  return {
    ...apiKey,
    key: fullKey
    // Return raw key only once
  };
};
var getOrgApiKeys = async (userId, orgId) => {
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
      createdAt: true
    },
    orderBy: { createdAt: "desc" }
  });
};
var getApiKeyDetails = async (userId, orgId, keyId) => {
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
      createdAt: true
    }
  });
  if (!apiKey) throw new AppError_default(status11.NOT_FOUND, "API Key not found");
  return apiKey;
};
var updateApiKey = async (userId, orgId, keyId, payload) => {
  await verifyOrgAdmin(userId, orgId);
  const apiKey = await prisma.apiKey.findFirst({
    where: { id: keyId, organizationId: orgId }
  });
  if (!apiKey) throw new AppError_default(status11.NOT_FOUND, "API Key not found");
  const dataToUpdate = {};
  if (payload.name) dataToUpdate.name = payload.name;
  if (payload.isActive !== void 0) dataToUpdate.isActive = payload.isActive;
  if (payload.expiresAt !== void 0)
    dataToUpdate.expiresAt = payload.expiresAt ? new Date(payload.expiresAt) : null;
  return await prisma.apiKey.update({
    where: { id: keyId },
    data: dataToUpdate,
    select: {
      id: true,
      name: true,
      keyPrefix: true,
      isActive: true,
      expiresAt: true
    }
  });
};
var rotateApiKey = async (userId, orgId, keyId) => {
  await verifyOrgAdmin(userId, orgId);
  const apiKey = await prisma.apiKey.findFirst({
    where: { id: keyId, organizationId: orgId }
  });
  if (!apiKey) throw new AppError_default(status11.NOT_FOUND, "API Key not found");
  const { fullKey, keyPrefix, keyHash } = generateKeyData();
  const updatedKey = await prisma.apiKey.update({
    where: { id: keyId },
    data: {
      keyHash,
      keyPrefix
    },
    select: {
      id: true,
      name: true,
      keyPrefix: true,
      expiresAt: true,
      createdAt: true
    }
  });
  return {
    ...updatedKey,
    key: fullKey
    // Return the newly generated raw key
  };
};
var deleteApiKey = async (userId, orgId, keyId) => {
  await verifyOrgAdmin(userId, orgId);
  const apiKey = await prisma.apiKey.findFirst({
    where: { id: keyId, organizationId: orgId }
  });
  if (!apiKey) throw new AppError_default(status11.NOT_FOUND, "API Key not found");
  return await prisma.apiKey.delete({
    where: { id: keyId }
  });
};
var ApiKeyService = {
  createApiKey,
  getOrgApiKeys,
  getApiKeyDetails,
  updateApiKey,
  rotateApiKey,
  deleteApiKey
};

// src/app/module/apiKey/apiKey.controller.ts
var createApiKey2 = catchAsync(async (req, res) => {
  const result = await ApiKeyService.createApiKey(
    req.user.userId,
    req.params.orgId,
    req.body
  );
  sendResponse(res, {
    httpStatusCode: httpStatus5.CREATED,
    success: true,
    message: "API Key generated successfully. Please copy it now, it won't be shown again.",
    data: result
  });
});
var getOrgApiKeys2 = catchAsync(async (req, res) => {
  const result = await ApiKeyService.getOrgApiKeys(
    req.user.userId,
    req.params.orgId
  );
  sendResponse(res, {
    httpStatusCode: httpStatus5.OK,
    success: true,
    message: "Organization API keys retrieved successfully",
    data: result
  });
});
var getApiKeyDetails2 = catchAsync(async (req, res) => {
  const result = await ApiKeyService.getApiKeyDetails(
    req.user.userId,
    req.params.orgId,
    req.params.keyId
  );
  sendResponse(res, {
    httpStatusCode: httpStatus5.OK,
    success: true,
    message: "API key details retrieved",
    data: result
  });
});
var updateApiKey2 = catchAsync(async (req, res) => {
  const result = await ApiKeyService.updateApiKey(
    req.user.userId,
    req.params.orgId,
    req.params.keyId,
    req.body
  );
  sendResponse(res, {
    httpStatusCode: httpStatus5.OK,
    success: true,
    message: "API key updated successfully",
    data: result
  });
});
var rotateApiKey2 = catchAsync(async (req, res) => {
  const result = await ApiKeyService.rotateApiKey(
    req.user.userId,
    req.params.orgId,
    req.params.keyId
  );
  sendResponse(res, {
    httpStatusCode: httpStatus5.OK,
    success: true,
    message: "API key rotated successfully. Please copy your new key.",
    data: result
  });
});
var deleteApiKey2 = catchAsync(async (req, res) => {
  await ApiKeyService.deleteApiKey(
    req.user.userId,
    req.params.orgId,
    req.params.keyId
  );
  sendResponse(res, {
    httpStatusCode: httpStatus5.OK,
    success: true,
    message: "API key permanently revoked and deleted",
    data: null
  });
});
var ApiKeyController = {
  createApiKey: createApiKey2,
  getOrgApiKeys: getOrgApiKeys2,
  getApiKeyDetails: getApiKeyDetails2,
  updateApiKey: updateApiKey2,
  rotateApiKey: rotateApiKey2,
  deleteApiKey: deleteApiKey2
};

// src/app/module/apiKey/apiKey.validation.ts
import { z as z4 } from "zod";
var createApiKeySchema = z4.object({
  body: z4.object({
    name: z4.string().min(2, "Name must be at least 2 characters").max(100),
    expiresAt: z4.string().datetime().optional()
  })
});
var updateApiKeySchema = z4.object({
  body: z4.object({
    name: z4.string().min(2).max(100).optional(),
    expiresAt: z4.string().datetime().nullable().optional(),
    isActive: z4.boolean().optional()
  })
});
var ApiKeyValidation = {
  createApiKeySchema,
  updateApiKeySchema
};

// src/app/module/apiKey/apiKey.route.ts
var router4 = Router4();
router4.post(
  "/:orgId",
  checkAuth(),
  validateRequest(ApiKeyValidation.createApiKeySchema),
  ApiKeyController.createApiKey
);
router4.get("/:orgId", checkAuth(), ApiKeyController.getOrgApiKeys);
router4.get("/:orgId/:keyId", checkAuth(), ApiKeyController.getApiKeyDetails);
router4.patch(
  "/:orgId/:keyId",
  checkAuth(),
  validateRequest(ApiKeyValidation.updateApiKeySchema),
  ApiKeyController.updateApiKey
);
router4.patch(
  "/:orgId/:keyId/rotate",
  checkAuth(),
  ApiKeyController.rotateApiKey
);
router4.delete("/:orgId/:keyId", checkAuth(), ApiKeyController.deleteApiKey);
var ApiKeyRoutes = router4;

// src/app/module/file/file.route.ts
import { Router as Router5 } from "express";

// src/app/middleware/upload.ts
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import httpStatus6 from "http-status";
var storage = new CloudinaryStorage({
  cloudinary: cloudinaryUpload,
  params: async (req, file) => {
    const originalName = file.originalname;
    const extension = originalName.split(".").pop()?.toLowerCase();
    const fileNameWithoutExtension = originalName.split(".").slice(0, -1).join(".").toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9\-]/g, "");
    const uniqueName = Math.random().toString(36).substring(2) + "-" + Date.now() + "-" + fileNameWithoutExtension;
    const folder = extension === "pdf" ? "pdfs" : "images";
    return {
      folder: `collab-pro/${folder}`,
      // Using the collab-pro folder structure
      public_id: uniqueName,
      resource_type: "auto"
      // Crucial for non-image files like PDFs
    };
  }
});
var fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    // .docx
    "text/plain"
  ];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new AppError_default(
        httpStatus6.BAD_REQUEST,
        "Unsupported file format. Please upload images (JPEG/PNG/WebP), PDFs, or Docs."
      )
    );
  }
};
var upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024
    // Limit to 5 MB
  },
  fileFilter
});

// src/app/module/file/file.controller.ts
import httpStatus7 from "http-status";

// src/app/module/file/file.service.ts
import status12 from "http-status";
var uploadFile = async (payload) => {
  return await prisma.file.create({
    data: {
      uploadedBy: payload.uploadedBy,
      url: payload.url,
      mimeType: payload.mimeType,
      sizeBytes: payload.sizeBytes
    }
  });
};
var getMyFiles = async (userId, query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;
  const [files, total] = await Promise.all([
    prisma.file.findMany({
      where: { uploadedBy: userId },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit
    }),
    prisma.file.count({ where: { uploadedBy: userId } })
  ]);
  return { meta: { page, limit, total }, data: files };
};
var getFileDetails = async (userId, userRole, fileId) => {
  const file = await prisma.file.findUnique({
    where: { id: fileId },
    include: { uploader: { select: { name: true, email: true } } }
  });
  if (!file) throw new AppError_default(status12.NOT_FOUND, "File not found");
  if (file.uploadedBy !== userId && userRole !== "SUPER_ADMIN") {
    throw new AppError_default(
      status12.FORBIDDEN,
      "You do not have permission to view this file"
    );
  }
  return file;
};
var deleteFile = async (userId, userRole, fileId) => {
  const file = await prisma.file.findUnique({ where: { id: fileId } });
  if (!file) throw new AppError_default(status12.NOT_FOUND, "File not found");
  if (file.uploadedBy !== userId && userRole !== "SUPER_ADMIN") {
    throw new AppError_default(
      status12.FORBIDDEN,
      "You do not have permission to delete this file"
    );
  }
  await deleteFileFromCloudinary(file.url);
  return await prisma.file.delete({
    where: { id: fileId }
  });
};
var getAllPlatformFiles = async (query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 20;
  const skip = (page - 1) * limit;
  const [files, total] = await Promise.all([
    prisma.file.findMany({
      include: { uploader: { select: { name: true, email: true } } },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit
    }),
    prisma.file.count()
  ]);
  return { meta: { page, limit, total }, data: files };
};
var FileService = {
  uploadFile,
  getMyFiles,
  getFileDetails,
  deleteFile,
  getAllPlatformFiles
};

// src/app/module/file/file.controller.ts
var uploadFile2 = catchAsync(async (req, res) => {
  const file = req.file;
  if (!file) {
    throw new AppError_default(
      httpStatus7.BAD_REQUEST,
      "Please provide a file to upload"
    );
  }
  const result = await FileService.uploadFile({
    uploadedBy: req.user.userId,
    url: file.path,
    // Cloudinary URL returned by multer-storage-cloudinary
    mimeType: file.mimetype,
    sizeBytes: file.size
  });
  sendResponse(res, {
    httpStatusCode: httpStatus7.CREATED,
    success: true,
    message: "File uploaded successfully",
    data: result
  });
});
var getMyFiles2 = catchAsync(async (req, res) => {
  const result = await FileService.getMyFiles(req.user.userId, req.query);
  sendResponse(res, {
    httpStatusCode: httpStatus7.OK,
    success: true,
    message: "Your files retrieved successfully",
    data: result
  });
});
var getFileDetails2 = catchAsync(async (req, res) => {
  const result = await FileService.getFileDetails(
    req.user.userId,
    req.user.role,
    req.params.fileId
  );
  sendResponse(res, {
    httpStatusCode: httpStatus7.OK,
    success: true,
    message: "File details retrieved",
    data: result
  });
});
var deleteFile2 = catchAsync(async (req, res) => {
  await FileService.deleteFile(
    req.user.userId,
    req.user.role,
    req.params.fileId
  );
  sendResponse(res, {
    httpStatusCode: httpStatus7.OK,
    success: true,
    message: "File and metadata deleted successfully",
    data: null
  });
});
var getAllPlatformFiles2 = catchAsync(async (req, res) => {
  const result = await FileService.getAllPlatformFiles(req.query);
  sendResponse(res, {
    httpStatusCode: httpStatus7.OK,
    success: true,
    message: "Platform files retrieved successfully",
    data: result
  });
});
var FileController = {
  uploadFile: uploadFile2,
  getMyFiles: getMyFiles2,
  getFileDetails: getFileDetails2,
  deleteFile: deleteFile2,
  getAllPlatformFiles: getAllPlatformFiles2
};

// src/app/module/file/file.validation.ts
import { z as z5 } from "zod";
var fileIdParamSchema = z5.object({
  params: z5.object({
    fileId: z5.string("File ID is required")
  })
});
var paginationSchema = z5.object({
  query: z5.object({
    page: z5.string().optional(),
    limit: z5.string().optional()
  })
});
var FileValidation = {
  fileIdParamSchema,
  paginationSchema
};

// src/app/module/file/file.route.ts
var router5 = Router5();
router5.post(
  "/upload",
  checkAuth(),
  upload.single("file"),
  // Multer middleware handling Cloudinary upload
  FileController.uploadFile
);
router5.get(
  "/my",
  checkAuth(),
  validateRequest(FileValidation.paginationSchema),
  FileController.getMyFiles
);
router5.get(
  "/",
  checkAuth(),
  validateRequest(FileValidation.paginationSchema),
  FileController.getAllPlatformFiles
);
router5.get(
  "/:fileId",
  checkAuth(),
  validateRequest(FileValidation.fileIdParamSchema),
  FileController.getFileDetails
);
router5.delete(
  "/:fileId",
  checkAuth(),
  validateRequest(FileValidation.fileIdParamSchema),
  FileController.deleteFile
);
var FileRoutes = router5;

// src/app/module/invoice/invoice.route.ts
import { Router as Router6 } from "express";

// src/app/module/invoice/invoice.controller.ts
import httpStatus8 from "http-status";

// src/app/module/invoice/invoice.service.ts
import status13 from "http-status";

// src/app/config/stripe.config.ts
import Stripe from "stripe";
var stripe = new Stripe(envVars.STRIPE.STRIPE_SECRET_KEY);

// src/app/module/invoice/invoice.service.ts
var verifyBillingAccess = async (userId, orgId) => {
  const membership = await prisma.membership.findFirst({
    where: {
      organizationId: orgId,
      userId,
      role: { name: { in: ["OWNER", "ADMIN"] } }
    }
  });
  if (!membership)
    throw new AppError_default(
      status13.FORBIDDEN,
      "Only organization administrators can view billing information"
    );
};
var getOrgInvoices = async (userId, orgId, query) => {
  await verifyBillingAccess(userId, orgId);
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;
  const whereClause = { organizationId: orgId };
  if (query.status) whereClause.status = query.status;
  const [invoices, total] = await Promise.all([
    prisma.invoice.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit
    }),
    prisma.invoice.count({ where: whereClause })
  ]);
  return { meta: { page, limit, total }, data: invoices };
};
var getInvoiceDetails = async (userId, orgId, invoiceId) => {
  await verifyBillingAccess(userId, orgId);
  const invoice = await prisma.invoice.findFirst({
    where: { id: invoiceId, subscriptionId: orgId },
    include: { subscription: true }
  });
  if (!invoice) throw new AppError_default(status13.NOT_FOUND, "Invoice not found");
  return invoice;
};
var getInvoicePdf = async (userId, orgId, invoiceId) => {
  await verifyBillingAccess(userId, orgId);
  const invoice = await prisma.invoice.findFirst({
    where: { id: invoiceId, subscriptionId: orgId }
  });
  if (!invoice) throw new AppError_default(status13.NOT_FOUND, "Invoice not found");
  if (!invoice.invoicePdfUrl)
    throw new AppError_default(status13.NOT_FOUND, "PDF not available for this invoice");
  return { downloadUrl: invoice.invoicePdfUrl };
};
var stripeWebhookHandler = async (headers, rawBody) => {
  const sig = headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    throw new AppError_default(status13.BAD_REQUEST, `Webhook Error: ${err.message}`);
  }
  switch (event.type) {
    case "invoice.payment_succeeded":
      const invoiceData = event.data.object;
      break;
    case "invoice.payment_failed":
      break;
    // ... handle other subscription events
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  console.log("Stripe webhook received (Simulation)");
  return true;
};
var getAllPlatformInvoices = async (query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 20;
  const skip = (page - 1) * limit;
  const [invoices, total] = await Promise.all([
    prisma.invoice.findMany({
      include: { subscription: true },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit
    }),
    prisma.invoice.count()
  ]);
  return { meta: { page, limit, total }, data: invoices };
};
var InvoiceService = {
  getOrgInvoices,
  getInvoiceDetails,
  getInvoicePdf,
  stripeWebhookHandler,
  getAllPlatformInvoices
};

// src/app/module/invoice/invoice.controller.ts
var getOrgInvoices2 = catchAsync(async (req, res) => {
  const result = await InvoiceService.getOrgInvoices(
    req.user.userId,
    req.params.orgId,
    req.query
  );
  sendResponse(res, {
    httpStatusCode: httpStatus8.OK,
    success: true,
    message: "Organization invoices retrieved successfully",
    data: result
  });
});
var getInvoiceDetails2 = catchAsync(async (req, res) => {
  const result = await InvoiceService.getInvoiceDetails(
    req.user.userId,
    req.params.orgId,
    req.params.invoiceId
  );
  sendResponse(res, {
    httpStatusCode: httpStatus8.OK,
    success: true,
    message: "Invoice details retrieved",
    data: result
  });
});
var getInvoicePdf2 = catchAsync(async (req, res) => {
  const result = await InvoiceService.getInvoicePdf(
    req.user.userId,
    req.params.orgId,
    req.params.invoiceId
  );
  sendResponse(res, {
    httpStatusCode: httpStatus8.OK,
    success: true,
    message: "Invoice PDF URL generated",
    data: result
  });
});
var stripeWebhookHandler2 = catchAsync(async (req, res) => {
  await InvoiceService.stripeWebhookHandler(req.headers, req.body);
  res.status(httpStatus8.OK).json({ received: true });
});
var getAllPlatformInvoices2 = catchAsync(
  async (req, res) => {
    const result = await InvoiceService.getAllPlatformInvoices(req.query);
    sendResponse(res, {
      httpStatusCode: httpStatus8.OK,
      success: true,
      message: "Platform invoices retrieved",
      data: result
    });
  }
);
var InvoiceController = {
  getOrgInvoices: getOrgInvoices2,
  getInvoiceDetails: getInvoiceDetails2,
  getInvoicePdf: getInvoicePdf2,
  stripeWebhookHandler: stripeWebhookHandler2,
  getAllPlatformInvoices: getAllPlatformInvoices2
};

// src/app/module/invoice/invoice.validation.ts
import { z as z6 } from "zod";
var orgInvoiceParamsSchema = z6.object({
  params: z6.object({
    orgId: z6.string("Organization ID is required"),
    invoiceId: z6.string().optional()
  })
});
var paginationSchema2 = z6.object({
  query: z6.object({
    page: z6.string().optional(),
    limit: z6.string().optional(),
    status: z6.string().optional()
  })
});
var InvoiceValidation = {
  orgInvoiceParamsSchema,
  paginationSchema: paginationSchema2
};

// src/app/module/invoice/invoice.route.ts
var router6 = Router6();
router6.post("/webhook", InvoiceController.stripeWebhookHandler);
router6.get(
  "/",
  checkAuth(),
  validateRequest(InvoiceValidation.paginationSchema),
  InvoiceController.getAllPlatformInvoices
);
router6.get(
  "/:orgId",
  checkAuth(),
  validateRequest(InvoiceValidation.orgInvoiceParamsSchema),
  validateRequest(InvoiceValidation.paginationSchema),
  InvoiceController.getOrgInvoices
);
router6.get(
  "/:orgId/:invoiceId",
  checkAuth(),
  validateRequest(InvoiceValidation.orgInvoiceParamsSchema),
  InvoiceController.getInvoiceDetails
);
router6.get(
  "/:orgId/:invoiceId/pdf",
  checkAuth(),
  validateRequest(InvoiceValidation.orgInvoiceParamsSchema),
  InvoiceController.getInvoicePdf
);
var InvoiceRoutes = router6;

// src/app/module/label/label.route.ts
import { Router as Router7 } from "express";

// src/app/module/label/label.controller.ts
import httpStatus9 from "http-status";

// src/app/module/label/label.service.ts
import status14 from "http-status";
var createLabel = async (projectId, payload) => {
  const existingLabel = await prisma.label.findFirst({
    where: { projectId, name: payload.name }
  });
  if (existingLabel) {
    throw new AppError_default(
      status14.CONFLICT,
      "A label with this name already exists in the project"
    );
  }
  return await prisma.label.create({
    data: {
      projectId,
      name: payload.name,
      color: payload.color
    }
  });
};
var getProjectLabels = async (projectId) => {
  return await prisma.label.findMany({
    where: { projectId },
    orderBy: { name: "asc" }
  });
};
var updateLabel = async (projectId, labelId, payload) => {
  const label = await prisma.label.findFirst({
    where: { id: labelId, projectId }
  });
  if (!label) throw new AppError_default(status14.NOT_FOUND, "Label not found");
  if (payload.name && payload.name !== label.name) {
    const existingLabel = await prisma.label.findFirst({
      where: { projectId, name: payload.name }
    });
    if (existingLabel) {
      throw new AppError_default(
        status14.CONFLICT,
        "A label with this name already exists"
      );
    }
  }
  return await prisma.label.update({
    where: { id: labelId },
    data: payload
  });
};
var deleteLabel = async (projectId, labelId) => {
  const label = await prisma.label.findFirst({
    where: { id: labelId, projectId }
  });
  if (!label) throw new AppError_default(status14.NOT_FOUND, "Label not found");
  return await prisma.label.delete({
    where: { id: labelId }
  });
};
var assignLabelToTask = async (taskId, labelId) => {
  const existing = await prisma.taskLabel.findUnique({
    where: { taskId_labelId: { taskId, labelId } }
  });
  if (existing) {
    throw new AppError_default(
      status14.CONFLICT,
      "Label is already attached to this task"
    );
  }
  return await prisma.taskLabel.create({
    data: { taskId, labelId }
  });
};
var removeLabelFromTask = async (taskId, labelId) => {
  const existing = await prisma.taskLabel.findUnique({
    where: { taskId_labelId: { taskId, labelId } }
  });
  if (!existing) {
    throw new AppError_default(status14.NOT_FOUND, "Label is not attached to this task");
  }
  return await prisma.taskLabel.delete({
    where: { taskId_labelId: { taskId, labelId } }
  });
};
var getTaskLabels = async (taskId) => {
  const taskLabels = await prisma.taskLabel.findMany({
    where: { taskId },
    include: { label: true }
  });
  return taskLabels.map((tl) => tl.label);
};
var LabelService = {
  createLabel,
  getProjectLabels,
  updateLabel,
  deleteLabel,
  assignLabelToTask,
  removeLabelFromTask,
  getTaskLabels
};

// src/app/module/label/label.controller.ts
var createLabel2 = catchAsync(async (req, res) => {
  const result = await LabelService.createLabel(
    req.params.projectId,
    req.body
  );
  sendResponse(res, {
    httpStatusCode: httpStatus9.CREATED,
    success: true,
    message: "Label created successfully",
    data: result
  });
});
var getProjectLabels2 = catchAsync(async (req, res) => {
  const result = await LabelService.getProjectLabels(
    req.params.projectId
  );
  sendResponse(res, {
    httpStatusCode: httpStatus9.OK,
    success: true,
    message: "Project labels retrieved",
    data: result
  });
});
var updateLabel2 = catchAsync(async (req, res) => {
  const result = await LabelService.updateLabel(
    req.params.projectId,
    req.params.labelId,
    req.body
  );
  sendResponse(res, {
    httpStatusCode: httpStatus9.OK,
    success: true,
    message: "Label updated successfully",
    data: result
  });
});
var deleteLabel2 = catchAsync(async (req, res) => {
  await LabelService.deleteLabel(
    req.params.projectId,
    req.params.labelId
  );
  sendResponse(res, {
    httpStatusCode: httpStatus9.OK,
    success: true,
    message: "Label deleted successfully",
    data: null
  });
});
var assignLabelToTask2 = catchAsync(async (req, res) => {
  const result = await LabelService.assignLabelToTask(
    req.params.taskId,
    req.params.labelId
  );
  sendResponse(res, {
    httpStatusCode: httpStatus9.OK,
    success: true,
    message: "Label attached to task",
    data: result
  });
});
var removeLabelFromTask2 = catchAsync(async (req, res) => {
  await LabelService.removeLabelFromTask(
    req.params.taskId,
    req.params.labelId
  );
  sendResponse(res, {
    httpStatusCode: httpStatus9.OK,
    success: true,
    message: "Label detached from task",
    data: null
  });
});
var getTaskLabels2 = catchAsync(async (req, res) => {
  const result = await LabelService.getTaskLabels(req.params.taskId);
  sendResponse(res, {
    httpStatusCode: httpStatus9.OK,
    success: true,
    message: "Task labels retrieved",
    data: result
  });
});
var LabelController = {
  createLabel: createLabel2,
  getProjectLabels: getProjectLabels2,
  updateLabel: updateLabel2,
  deleteLabel: deleteLabel2,
  assignLabelToTask: assignLabelToTask2,
  removeLabelFromTask: removeLabelFromTask2,
  getTaskLabels: getTaskLabels2
};

// src/app/module/label/label.validation.ts
import { z as z7 } from "zod";
var createLabelSchema = z7.object({
  body: z7.object({
    name: z7.string().min(1, "Label name is required").max(50),
    color: z7.string().regex(/^#([0-9A-F]{3}){1,2}$/i, "Color must be a valid hex code")
  })
});
var updateLabelSchema = z7.object({
  body: z7.object({
    name: z7.string().min(1).max(50).optional(),
    color: z7.string().regex(/^#([0-9A-F]{3}){1,2}$/i, "Color must be a valid hex code").optional()
  })
});
var LabelValidation = {
  createLabelSchema,
  updateLabelSchema
};

// src/app/module/label/label.route.ts
var router7 = Router7();
router7.post(
  "/:projectId",
  checkAuth(),
  validateRequest(LabelValidation.createLabelSchema),
  LabelController.createLabel
);
router7.get("/:projectId", checkAuth(), LabelController.getProjectLabels);
router7.patch(
  "/:projectId/:labelId",
  checkAuth(),
  validateRequest(LabelValidation.updateLabelSchema),
  LabelController.updateLabel
);
router7.delete("/:projectId/:labelId", checkAuth(), LabelController.deleteLabel);
router7.post(
  "/:taskId/assign/:labelId",
  checkAuth(),
  LabelController.assignLabelToTask
);
router7.delete(
  "/:taskId/remove/:labelId",
  checkAuth(),
  LabelController.removeLabelFromTask
);
router7.get("/:taskId/assigned", checkAuth(), LabelController.getTaskLabels);
var LabelRoutes = router7;

// src/app/module/membership/membership.route.ts
import { Router as Router8 } from "express";

// src/app/module/membership/membership.controller.ts
import httpStatus10 from "http-status";

// src/app/module/membership/membership.service.ts
import status15 from "http-status";
var getOrganizationMembers = async (orgId) => {
  return await prisma.membership.findMany({
    where: { organizationId: orgId },
    include: {
      user: { select: { id: true, name: true, email: true, image: true } },
      role: { select: { id: true, name: true } }
    }
  });
};
var getMemberDetails = async (orgId, userId) => {
  const member = await prisma.membership.findFirst({
    where: { organizationId: orgId, userId },
    include: {
      user: { select: { id: true, name: true, email: true, image: true } },
      role: { include: { rolePermissions: { include: { permission: true } } } }
    }
  });
  if (!member) throw new AppError_default(status15.NOT_FOUND, "Membership not found");
  return member;
};
var updateMemberRole = async (actorId, orgId, targetUserId, newRoleId) => {
  const actor = await prisma.membership.findFirst({
    where: { organizationId: orgId, userId: actorId },
    include: { role: true }
  });
  if (!actor || actor.role.name !== "ADMIN" && actor.role.name !== "OWNER") {
    throw new AppError_default(
      status15.FORBIDDEN,
      "Insufficient permissions to change roles"
    );
  }
  return await prisma.membership.update({
    where: {
      userId_organizationId: { organizationId: orgId, userId: targetUserId }
    },
    data: { roleId: newRoleId },
    include: { role: true }
  });
};
var removeMember = async (actorId, orgId, targetUserId) => {
  const org = await prisma.organization.findUnique({ where: { id: orgId } });
  if (org?.ownerId === targetUserId) {
    throw new AppError_default(
      status15.BAD_REQUEST,
      "Organization owner cannot be removed"
    );
  }
  const actor = await prisma.membership.findFirst({
    where: { organizationId: orgId, userId: actorId }
  });
  if (!actor) throw new AppError_default(status15.FORBIDDEN, "Access denied");
  return await prisma.membership.delete({
    where: {
      userId_organizationId: { organizationId: orgId, userId: targetUserId }
    }
  });
};
var leaveOrganization = async (userId, orgId) => {
  const org = await prisma.organization.findUnique({ where: { id: orgId } });
  if (org?.ownerId === userId) {
    throw new AppError_default(
      status15.BAD_REQUEST,
      "Owners cannot leave. Transfer ownership first."
    );
  }
  return await prisma.membership.delete({
    where: { userId_organizationId: { organizationId: orgId, userId } }
  });
};
var MembershipService = {
  getOrganizationMembers,
  getMemberDetails,
  updateMemberRole,
  removeMember,
  leaveOrganization
};

// src/app/module/membership/membership.controller.ts
var getOrganizationMembers2 = catchAsync(
  async (req, res) => {
    const result = await MembershipService.getOrganizationMembers(
      req.params.orgId
    );
    sendResponse(res, {
      httpStatusCode: httpStatus10.OK,
      success: true,
      message: "Organization members retrieved successfully",
      data: result
    });
  }
);
var getMemberDetails2 = catchAsync(async (req, res) => {
  const result = await MembershipService.getMemberDetails(
    req.params.orgId,
    req.params.userId
  );
  sendResponse(res, {
    httpStatusCode: httpStatus10.OK,
    success: true,
    message: "Member details retrieved successfully",
    data: result
  });
});
var updateMemberRole2 = catchAsync(async (req, res) => {
  const result = await MembershipService.updateMemberRole(
    req.user.userId,
    req.params.orgId,
    req.params.userId,
    req.body.roleId
  );
  sendResponse(res, {
    httpStatusCode: httpStatus10.OK,
    success: true,
    message: "Member role updated successfully",
    data: result
  });
});
var removeMember2 = catchAsync(async (req, res) => {
  await MembershipService.removeMember(
    req.user.userId,
    req.params.orgId,
    req.params.userId
  );
  sendResponse(res, {
    httpStatusCode: httpStatus10.OK,
    success: true,
    message: "Member removed from organization",
    data: null
  });
});
var leaveOrganization2 = catchAsync(async (req, res) => {
  await MembershipService.leaveOrganization(
    req.user.userId,
    req.params.orgId
  );
  sendResponse(res, {
    httpStatusCode: httpStatus10.OK,
    success: true,
    message: "You have successfully left the organization",
    data: null
  });
});
var MembershipController = {
  getOrganizationMembers: getOrganizationMembers2,
  getMemberDetails: getMemberDetails2,
  updateMemberRole: updateMemberRole2,
  removeMember: removeMember2,
  leaveOrganization: leaveOrganization2
};

// src/app/module/membership/membership.validation.ts
import { z as z8 } from "zod";
var updateRoleSchema = z8.object({
  body: z8.object({
    roleId: z8.string("Role ID is required")
  })
});
var MembershipValidation = {
  updateRoleSchema
};

// src/app/module/membership/membership.route.ts
var router8 = Router8();
router8.get("/:orgId", checkAuth(), MembershipController.getOrganizationMembers);
router8.get(
  "/:orgId/:userId",
  checkAuth(),
  MembershipController.getMemberDetails
);
router8.patch(
  "/:orgId/:userId/role",
  checkAuth(),
  validateRequest(MembershipValidation.updateRoleSchema),
  MembershipController.updateMemberRole
);
router8.delete(
  "/:orgId/:userId",
  checkAuth(),
  MembershipController.removeMember
);
router8.delete(
  "/:orgId/leave",
  checkAuth(),
  MembershipController.leaveOrganization
);
var MembershipRoutes = router8;

// src/app/module/notification/notification.route.ts
import { Router as Router9 } from "express";

// src/app/module/notification/notification.controller.ts
import httpStatus11 from "http-status";

// src/app/module/notification/notification.service.ts
import status16 from "http-status";
var getAllNotifications = async (userId, query) => {
  const { page = 1, limit = 10 } = query;
  const skip = (Number(page) - 1) * Number(limit);
  const [notifications, total] = await Promise.all([
    prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      skip,
      take: Number(limit)
    }),
    prisma.notification.count({ where: { userId } })
  ]);
  return {
    meta: { page: Number(page), limit: Number(limit), total },
    data: notifications
  };
};
var getUnreadNotifications = async (userId) => {
  const notifications = await prisma.notification.findMany({
    where: { userId, isRead: false },
    orderBy: { createdAt: "desc" }
  });
  const total = await prisma.notification.count({
    where: { userId, isRead: false }
  });
  return { total, notifications };
};
var getUnreadCount = async (userId) => {
  return await prisma.notification.count({
    where: { userId, isRead: false }
  });
};
var markAsRead = async (userId, notifId) => {
  const notification = await prisma.notification.findFirst({
    where: { id: notifId, userId }
  });
  if (!notification)
    throw new AppError_default(status16.NOT_FOUND, "Notification not found");
  return await prisma.notification.update({
    where: { id: notifId },
    data: { isRead: true }
  });
};
var markAllAsRead = async (userId) => {
  return await prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true }
  });
};
var deleteNotification = async (userId, notifId) => {
  const notification = await prisma.notification.findFirst({
    where: { id: notifId, userId }
  });
  if (!notification)
    throw new AppError_default(status16.NOT_FOUND, "Notification not found");
  return await prisma.notification.delete({
    where: { id: notifId }
  });
};
var clearAllNotifications = async (userId) => {
  return await prisma.notification.deleteMany({
    where: { userId }
  });
};
var NotificationService = {
  getAllNotifications,
  getUnreadNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications
};

// src/app/module/notification/notification.controller.ts
var getAllNotifications2 = catchAsync(async (req, res) => {
  const result = await NotificationService.getAllNotifications(
    req.user.userId,
    req.query
  );
  sendResponse(res, {
    httpStatusCode: httpStatus11.OK,
    success: true,
    message: "Notifications retrieved successfully",
    data: result
  });
});
var getUnreadNotifications2 = catchAsync(
  async (req, res) => {
    const result = await NotificationService.getUnreadNotifications(
      req.user.userId
    );
    sendResponse(res, {
      httpStatusCode: httpStatus11.OK,
      success: true,
      message: "Unread notifications retrieved",
      data: result
    });
  }
);
var getUnreadCount2 = catchAsync(async (req, res) => {
  const count = await NotificationService.getUnreadCount(req.user.userId);
  sendResponse(res, {
    httpStatusCode: httpStatus11.OK,
    success: true,
    message: "Unread count retrieved",
    data: { count }
  });
});
var markAsRead2 = catchAsync(async (req, res) => {
  await NotificationService.markAsRead(
    req.user.userId,
    req.params.notifId
  );
  sendResponse(res, {
    httpStatusCode: httpStatus11.OK,
    success: true,
    message: "Notification marked as read",
    data: null
  });
});
var markAllAsRead2 = catchAsync(async (req, res) => {
  await NotificationService.markAllAsRead(req.user.userId);
  sendResponse(res, {
    httpStatusCode: httpStatus11.OK,
    success: true,
    message: "All notifications marked as read",
    data: null
  });
});
var deleteNotification2 = catchAsync(async (req, res) => {
  await NotificationService.deleteNotification(
    req.user.userId,
    req.params.notifId
  );
  sendResponse(res, {
    httpStatusCode: httpStatus11.OK,
    success: true,
    message: "Notification deleted",
    data: null
  });
});
var clearAllNotifications2 = catchAsync(
  async (req, res) => {
    await NotificationService.clearAllNotifications(req.user.userId);
    sendResponse(res, {
      httpStatusCode: httpStatus11.OK,
      success: true,
      message: "All notifications cleared",
      data: null
    });
  }
);
var NotificationController = {
  getAllNotifications: getAllNotifications2,
  getUnreadNotifications: getUnreadNotifications2,
  getUnreadCount: getUnreadCount2,
  markAsRead: markAsRead2,
  markAllAsRead: markAllAsRead2,
  deleteNotification: deleteNotification2,
  clearAllNotifications: clearAllNotifications2
};

// src/app/module/notification/notification.validation.ts
import { z as z9 } from "zod";
var notificationIdSchema = z9.object({
  params: z9.object({
    notifId: z9.string("Notification ID is required")
  })
});
var NotificationValidation = {
  notificationIdSchema
};

// src/app/module/notification/notification.route.ts
var router9 = Router9();
router9.get("/", checkAuth(), NotificationController.getAllNotifications);
router9.get(
  "/unread",
  checkAuth(),
  NotificationController.getUnreadNotifications
);
router9.get("/count", checkAuth(), NotificationController.getUnreadCount);
router9.patch(
  "/:notifId/read",
  checkAuth(),
  validateRequest(NotificationValidation.notificationIdSchema),
  NotificationController.markAsRead
);
router9.patch("/read-all", checkAuth(), NotificationController.markAllAsRead);
router9.delete(
  "/:notifId",
  checkAuth(),
  validateRequest(NotificationValidation.notificationIdSchema),
  NotificationController.deleteNotification
);
router9.delete(
  "/clear-all",
  checkAuth(),
  NotificationController.clearAllNotifications
);
var NotificationRoutes = router9;

// src/app/module/organization/organization.route.ts
import { Router as Router10 } from "express";

// src/app/module/organization/organization.controller.ts
import httpStatus13 from "http-status";

// src/app/module/organization/organization.service.ts
import httpStatus12 from "http-status";
var createOrganization = async (requestUser, payload) => {
  const slugTaken = await prisma.organization.findUnique({
    where: { slug: payload.slug }
  });
  if (slugTaken) {
    throw new AppError_default(
      httpStatus12.CONFLICT,
      `The slug "${payload.slug}" is already taken`
    );
  }
  const organization = await prisma.$transaction(async (tx) => {
    const org = await tx.organization.create({
      data: {
        name: payload.name,
        slug: payload.slug,
        ownerId: requestUser.userId
      }
    });
    const ownerRole = await tx.role.create({
      data: {
        name: "Owner",
        organizationId: org.id
      }
    });
    await tx.membership.create({
      data: {
        userId: requestUser.userId,
        organizationId: org.id,
        roleId: ownerRole.id
      }
    });
    return org;
  });
  return prisma.organization.findUnique({
    where: { id: organization.id },
    include: {
      owner: {
        select: { id: true, name: true, email: true, image: true }
      },
      _count: {
        select: { memberships: true, projects: true, roles: true }
      }
    }
  });
};
var getMyOrganizations = async (requestUser) => {
  return prisma.organization.findMany({
    where: {
      memberships: { some: { userId: requestUser.userId } }
    },
    include: {
      owner: {
        select: { id: true, name: true, email: true }
      },
      memberships: {
        where: { userId: requestUser.userId },
        include: {
          role: { select: { id: true, name: true } }
        }
      },
      subscription: {
        include: {
          plan: { select: { id: true, name: true, slug: true } }
        }
      },
      _count: {
        select: { memberships: true, projects: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });
};
var getAllOrganizations = async (filters) => {
  const { page = 1, limit = 10, search } = filters;
  const skip = (page - 1) * limit;
  const where = {};
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { slug: { contains: search, mode: "insensitive" } }
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
          select: { id: true, name: true, email: true }
        },
        subscription: {
          include: {
            plan: { select: { name: true, slug: true } }
          }
        },
        _count: {
          select: { memberships: true, projects: true }
        }
      }
    }),
    prisma.organization.count({ where })
  ]);
  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};
var getOrganizationById = async (orgId, requestUser) => {
  const membership = await prisma.membership.findFirst({
    where: { organizationId: orgId, userId: requestUser.userId }
  });
  if (!membership) {
    throw new AppError_default(
      httpStatus12.FORBIDDEN,
      "You are not a member of this organization"
    );
  }
  const org = await prisma.organization.findUnique({
    where: { id: orgId },
    include: {
      owner: {
        select: { id: true, name: true, email: true, image: true }
      },
      roles: {
        select: { id: true, name: true },
        orderBy: { name: "asc" }
      },
      subscription: {
        include: {
          plan: {
            select: {
              id: true,
              name: true,
              slug: true,
              priceMonthly: true,
              priceYearly: true
            }
          }
        }
      },
      _count: {
        select: { memberships: true, projects: true, apiKeys: true }
      }
    }
  });
  if (!org) {
    throw new AppError_default(httpStatus12.NOT_FOUND, "Organization not found");
  }
  return org;
};
var getOrganizationBySlug = async (slug, requestUser) => {
  const membership = await prisma.membership.findFirst({
    where: { organization: { slug }, userId: requestUser.userId }
  });
  if (!membership) {
    throw new AppError_default(
      httpStatus12.FORBIDDEN,
      "You are not a member of this organization"
    );
  }
  const org = await prisma.organization.findUnique({
    where: { slug },
    include: {
      owner: {
        select: { id: true, name: true, email: true, image: true }
      },
      roles: {
        select: { id: true, name: true },
        orderBy: { name: "asc" }
      },
      subscription: {
        include: {
          plan: {
            select: {
              id: true,
              name: true,
              slug: true,
              priceMonthly: true,
              priceYearly: true
            }
          }
        }
      },
      _count: {
        select: { memberships: true, projects: true, apiKeys: true }
      }
    }
  });
  if (!org) {
    throw new AppError_default(httpStatus12.NOT_FOUND, "Organization not found");
  }
  return org;
};
var updateOrganization = async (orgId, requestUser, payload) => {
  const org = await prisma.organization.findUnique({
    where: { id: orgId }
  });
  if (!org) {
    throw new AppError_default(httpStatus12.NOT_FOUND, "Organization not found");
  }
  if (org.ownerId !== requestUser.userId) {
    throw new AppError_default(
      httpStatus12.FORBIDDEN,
      "Only the organization owner can update this organization"
    );
  }
  if (payload.slug && payload.slug !== org.slug) {
    const slugTaken = await prisma.organization.findUnique({
      where: { slug: payload.slug }
    });
    if (slugTaken) {
      throw new AppError_default(
        httpStatus12.CONFLICT,
        `The slug "${payload.slug}" is already taken`
      );
    }
  }
  return prisma.organization.update({
    where: { id: orgId },
    data: {
      ...payload.name !== void 0 && { name: payload.name },
      ...payload.slug !== void 0 && { slug: payload.slug }
    },
    include: {
      owner: {
        select: { id: true, name: true, email: true }
      }
    }
  });
};
var deleteOrganization = async (orgId, requestUser) => {
  const org = await prisma.organization.findUnique({
    where: { id: orgId }
  });
  if (!org) {
    throw new AppError_default(httpStatus12.NOT_FOUND, "Organization not found");
  }
  if (org.ownerId !== requestUser.userId) {
    throw new AppError_default(
      httpStatus12.FORBIDDEN,
      "Only the organization owner can delete this organization"
    );
  }
  await prisma.organization.delete({ where: { id: orgId } });
};
var getOrganizationStats = async (orgId, requestUser) => {
  const membership = await prisma.membership.findFirst({
    where: {
      organizationId: orgId,
      userId: requestUser.userId
    }
  });
  if (!membership) {
    throw new AppError_default(
      httpStatus12.FORBIDDEN,
      "You are not a member of this organization"
    );
  }
  const org = await prisma.organization.findUnique({
    where: { id: orgId }
  });
  if (!org) {
    throw new AppError_default(httpStatus12.NOT_FOUND, "Organization not found");
  }
  const [members, projects, tasks, activeApiKeys, subscription] = await Promise.all([
    prisma.membership.count({
      where: { organizationId: orgId }
    }),
    prisma.project.count({
      where: { organizationId: orgId }
    }),
    prisma.task.count({
      where: { project: { organizationId: orgId } }
    }),
    prisma.apiKey.count({
      where: { organizationId: orgId, isActive: true }
    }),
    prisma.subscription.findUnique({
      where: { organizationId: orgId },
      include: {
        plan: { select: { name: true, slug: true } }
      }
    })
  ]);
  return {
    members,
    projects,
    tasks,
    activeApiKeys,
    subscription: subscription ? {
      status: subscription.status,
      billingCycle: subscription.billingCycle,
      currentPeriodEnd: subscription.currentPeriodEnd,
      plan: subscription.plan
    } : null
  };
};
var OrganizationService = {
  createOrganization,
  getMyOrganizations,
  getAllOrganizations,
  getOrganizationById,
  getOrganizationBySlug,
  updateOrganization,
  deleteOrganization,
  getOrganizationStats
};

// src/app/module/organization/organization.controller.ts
var createOrganization2 = catchAsync(async (req, res) => {
  const result = await OrganizationService.createOrganization(
    req.user,
    req.body
  );
  sendResponse(res, {
    httpStatusCode: httpStatus13.CREATED,
    success: true,
    message: "Organization created successfully",
    data: result
  });
});
var getMyOrganizations2 = catchAsync(async (req, res) => {
  const result = await OrganizationService.getMyOrganizations(req.user);
  sendResponse(res, {
    httpStatusCode: httpStatus13.OK,
    success: true,
    message: "Your organizations fetched successfully",
    data: result
  });
});
var getAllOrganizations2 = catchAsync(async (req, res) => {
  const filters = {
    page: Number(req.query.page) || 1,
    limit: Number(req.query.limit) || 10,
    search: req.query.search
  };
  const result = await OrganizationService.getAllOrganizations(filters);
  sendResponse(res, {
    httpStatusCode: httpStatus13.OK,
    success: true,
    message: "Organizations fetched successfully",
    data: result
  });
});
var getOrganizationById2 = catchAsync(async (req, res) => {
  const { orgId } = req.params;
  const result = await OrganizationService.getOrganizationById(
    orgId,
    req.user
  );
  sendResponse(res, {
    httpStatusCode: httpStatus13.OK,
    success: true,
    message: "Organization fetched successfully",
    data: result
  });
});
var getOrganizationBySlug2 = catchAsync(
  async (req, res) => {
    const { slug } = req.params;
    const result = await OrganizationService.getOrganizationBySlug(
      slug,
      req.user
    );
    sendResponse(res, {
      httpStatusCode: httpStatus13.OK,
      success: true,
      message: "Organization fetched successfully",
      data: result
    });
  }
);
var updateOrganization2 = catchAsync(async (req, res) => {
  const { orgId } = req.params;
  const result = await OrganizationService.updateOrganization(
    orgId,
    req.user,
    req.body
  );
  sendResponse(res, {
    httpStatusCode: httpStatus13.OK,
    success: true,
    message: "Organization updated successfully",
    data: result
  });
});
var deleteOrganization2 = catchAsync(async (req, res) => {
  const { orgId } = req.params;
  await OrganizationService.deleteOrganization(orgId, req.user);
  sendResponse(res, {
    httpStatusCode: httpStatus13.OK,
    success: true,
    message: "Organization deleted successfully",
    data: null
  });
});
var getOrganizationStats2 = catchAsync(async (req, res) => {
  const { orgId } = req.params;
  const result = await OrganizationService.getOrganizationStats(
    orgId,
    req.user
  );
  sendResponse(res, {
    httpStatusCode: httpStatus13.OK,
    success: true,
    message: "Organization stats fetched successfully",
    data: result
  });
});
var OrganizationController = {
  createOrganization: createOrganization2,
  getMyOrganizations: getMyOrganizations2,
  getAllOrganizations: getAllOrganizations2,
  getOrganizationById: getOrganizationById2,
  getOrganizationBySlug: getOrganizationBySlug2,
  updateOrganization: updateOrganization2,
  deleteOrganization: deleteOrganization2,
  getOrganizationStats: getOrganizationStats2
};

// src/app/module/organization/organization.validation.ts
import { z as z10 } from "zod";
var slugField = z10.string("Slug is required").min(2, "Slug must be at least 2 characters").max(60, "Slug must not exceed 60 characters").regex(
  /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  "Slug may only contain lowercase letters, numbers, and hyphens, and cannot start or end with a hyphen"
);
var createOrganizationSchema = z10.object({
  body: z10.object({
    name: z10.string("Name is required").min(2, "Name must be at least 2 characters").max(100, "Name must not exceed 100 characters").trim(),
    slug: slugField
  })
});
var updateOrganizationSchema = z10.object({
  body: z10.object({
    name: z10.string().min(2, "Name must be at least 2 characters").max(100, "Name must not exceed 100 characters").trim().optional(),
    slug: slugField.optional()
  })
});
var OrganizationValidation = {
  createOrganizationSchema,
  updateOrganizationSchema
};

// src/app/module/organization/organization.route.ts
var router10 = Router10();
router10.post(
  "/",
  checkAuth(),
  validateRequest(OrganizationValidation.createOrganizationSchema),
  OrganizationController.createOrganization
);
router10.get("/my", checkAuth(), OrganizationController.getMyOrganizations);
router10.get(
  "/:orgId/stats",
  checkAuth(),
  OrganizationController.getOrganizationStats
);
router10.get("/:orgId", checkAuth(), OrganizationController.getOrganizationById);
router10.get(
  "/slug/:slug",
  checkAuth(),
  OrganizationController.getOrganizationBySlug
);
router10.patch(
  "/:orgId",
  checkAuth(),
  validateRequest(OrganizationValidation.updateOrganizationSchema),
  OrganizationController.updateOrganization
);
router10.delete(
  "/:orgId",
  checkAuth(),
  OrganizationController.deleteOrganization
);
router10.get("/", checkAuth(), OrganizationController.getAllOrganizations);
var OrganizationRoutes = router10;

// src/app/module/permission/permission.route.ts
import { Router as Router11 } from "express";

// src/app/module/permission/permission.controller.ts
import httpStatus15 from "http-status";

// src/app/module/permission/permission.service.ts
import httpStatus14 from "http-status";
var requireOrgMembership = async (orgId, requestUser) => {
  const membership = await prisma.membership.findFirst({
    where: { organizationId: orgId, userId: requestUser.userId },
    include: { role: true }
  });
  if (!membership) {
    throw new AppError_default(
      httpStatus14.FORBIDDEN,
      "You are not a member of this organization"
    );
  }
  return membership;
};
var requireOrgRole = async (orgId, roleId) => {
  const role = await prisma.role.findFirst({
    where: { id: roleId, organizationId: orgId }
  });
  if (!role) {
    throw new AppError_default(
      httpStatus14.NOT_FOUND,
      "Role not found in this organization"
    );
  }
  return role;
};
var createPermission = async (payload) => {
  const existing = await prisma.permission.findFirst({
    where: {
      action: payload.action,
      resource: payload.resource
    }
  });
  if (existing) {
    throw new AppError_default(
      httpStatus14.CONFLICT,
      `Permission "${payload.action}:${payload.resource}" already exists`
    );
  }
  return prisma.permission.create({
    data: {
      action: payload.action,
      resource: payload.resource
    }
  });
};
var getAllPermissions = async () => {
  return prisma.permission.findMany({
    orderBy: [{ resource: "asc" }, { action: "asc" }],
    include: {
      _count: {
        select: { rolePermissions: true }
      }
    }
  });
};
var getPermissionById = async (permId) => {
  const permission = await prisma.permission.findUnique({
    where: { id: permId },
    include: {
      rolePermissions: {
        include: {
          role: {
            select: {
              id: true,
              name: true,
              organization: { select: { id: true, name: true, slug: true } }
            }
          }
        }
      },
      _count: {
        select: { rolePermissions: true }
      }
    }
  });
  if (!permission) {
    throw new AppError_default(httpStatus14.NOT_FOUND, "Permission not found");
  }
  return permission;
};
var updatePermission = async (permId, payload) => {
  const permission = await prisma.permission.findUnique({
    where: { id: permId }
  });
  if (!permission) {
    throw new AppError_default(httpStatus14.NOT_FOUND, "Permission not found");
  }
  const newAction = payload.action ?? permission.action;
  const newResource = payload.resource ?? permission.resource;
  if (newAction !== permission.action || newResource !== permission.resource) {
    const conflict = await prisma.permission.findFirst({
      where: {
        action: newAction,
        resource: newResource,
        NOT: { id: permId }
      }
    });
    if (conflict) {
      throw new AppError_default(
        httpStatus14.CONFLICT,
        `Permission "${newAction}:${newResource}" already exists`
      );
    }
  }
  return prisma.permission.update({
    where: { id: permId },
    data: {
      ...payload.action !== void 0 && { action: payload.action },
      ...payload.resource !== void 0 && { resource: payload.resource }
    }
  });
};
var deletePermission = async (permId) => {
  const permission = await prisma.permission.findUnique({
    where: { id: permId },
    include: {
      _count: { select: { rolePermissions: true } }
    }
  });
  if (!permission) {
    throw new AppError_default(httpStatus14.NOT_FOUND, "Permission not found");
  }
  await prisma.permission.delete({ where: { id: permId } });
  return {
    deletedPermission: { id: permission.id, action: permission.action, resource: permission.resource },
    cascadedRoleAssignments: permission._count.rolePermissions
  };
};
var assignPermissionToRole = async (orgId, roleId, requestUser, payload) => {
  await requireOrgMembership(orgId, requestUser);
  await requireOrgRole(orgId, roleId);
  const permission = await prisma.permission.findUnique({
    where: { id: payload.permissionId }
  });
  if (!permission) {
    throw new AppError_default(
      httpStatus14.NOT_FOUND,
      "Permission not found in the system catalog"
    );
  }
  const alreadyAssigned = await prisma.rolePermission.findUnique({
    where: {
      roleId_permissionId: {
        roleId,
        permissionId: payload.permissionId
      }
    }
  });
  if (alreadyAssigned) {
    throw new AppError_default(
      httpStatus14.CONFLICT,
      `Permission "${permission.action}:${permission.resource}" is already assigned to this role`
    );
  }
  return prisma.rolePermission.create({
    data: {
      roleId,
      permissionId: payload.permissionId
    },
    include: {
      permission: {
        select: { id: true, action: true, resource: true }
      },
      role: {
        select: { id: true, name: true }
      }
    }
  });
};
var removePermissionFromRole = async (orgId, roleId, permId, requestUser) => {
  await requireOrgMembership(orgId, requestUser);
  await requireOrgRole(orgId, roleId);
  const rolePermission = await prisma.rolePermission.findUnique({
    where: {
      roleId_permissionId: {
        roleId,
        permissionId: permId
      }
    },
    include: {
      permission: {
        select: { action: true, resource: true }
      }
    }
  });
  if (!rolePermission) {
    throw new AppError_default(
      httpStatus14.NOT_FOUND,
      "This permission is not assigned to the role"
    );
  }
  await prisma.rolePermission.delete({
    where: {
      roleId_permissionId: {
        roleId,
        permissionId: permId
      }
    }
  });
  return {
    removedPermission: {
      action: rolePermission.permission.action,
      resource: rolePermission.permission.resource
    }
  };
};
var getRolePermissions = async (orgId, roleId, requestUser) => {
  await requireOrgMembership(orgId, requestUser);
  const role = await requireOrgRole(orgId, roleId);
  const rolePermissions = await prisma.rolePermission.findMany({
    where: { roleId },
    include: {
      permission: {
        select: { id: true, action: true, resource: true }
      }
    },
    orderBy: [
      { permission: { resource: "asc" } },
      { permission: { action: "asc" } }
    ]
  });
  return {
    role: {
      id: role.id,
      name: role.name,
      organizationId: role.organizationId
    },
    permissions: rolePermissions.map((rp) => rp.permission),
    total: rolePermissions.length
  };
};
var PermissionService = {
  createPermission,
  getAllPermissions,
  getPermissionById,
  updatePermission,
  deletePermission,
  assignPermissionToRole,
  removePermissionFromRole,
  getRolePermissions
};

// src/app/module/permission/permission.controller.ts
var createPermission2 = catchAsync(async (req, res) => {
  const result = await PermissionService.createPermission(req.body);
  sendResponse(res, {
    httpStatusCode: httpStatus15.CREATED,
    success: true,
    message: "Permission created successfully",
    data: result
  });
});
var getAllPermissions2 = catchAsync(async (req, res) => {
  const result = await PermissionService.getAllPermissions();
  sendResponse(res, {
    httpStatusCode: httpStatus15.OK,
    success: true,
    message: "Permissions fetched successfully",
    data: result
  });
});
var getPermissionById2 = catchAsync(async (req, res) => {
  const { permId } = req.params;
  const result = await PermissionService.getPermissionById(permId);
  sendResponse(res, {
    httpStatusCode: httpStatus15.OK,
    success: true,
    message: "Permission fetched successfully",
    data: result
  });
});
var updatePermission2 = catchAsync(async (req, res) => {
  const { permId } = req.params;
  const result = await PermissionService.updatePermission(
    permId,
    req.body
  );
  sendResponse(res, {
    httpStatusCode: httpStatus15.OK,
    success: true,
    message: "Permission updated successfully",
    data: result
  });
});
var deletePermission2 = catchAsync(async (req, res) => {
  const { permId } = req.params;
  const result = await PermissionService.deletePermission(permId);
  sendResponse(res, {
    httpStatusCode: httpStatus15.OK,
    success: true,
    message: "Permission deleted successfully",
    data: result
  });
});
var assignPermissionToRole2 = catchAsync(
  async (req, res) => {
    const { orgId, roleId } = req.params;
    const result = await PermissionService.assignPermissionToRole(
      orgId,
      roleId,
      req.user,
      req.body
    );
    sendResponse(res, {
      httpStatusCode: httpStatus15.CREATED,
      success: true,
      message: "Permission assigned to role successfully",
      data: result
    });
  }
);
var removePermissionFromRole2 = catchAsync(
  async (req, res) => {
    const { orgId, roleId, permId } = req.params;
    const result = await PermissionService.removePermissionFromRole(
      orgId,
      roleId,
      permId,
      req.user
    );
    sendResponse(res, {
      httpStatusCode: httpStatus15.OK,
      success: true,
      message: "Permission removed from role successfully",
      data: result
    });
  }
);
var getRolePermissions2 = catchAsync(async (req, res) => {
  const { orgId, roleId } = req.params;
  const result = await PermissionService.getRolePermissions(
    orgId,
    roleId,
    req.user
  );
  sendResponse(res, {
    httpStatusCode: httpStatus15.OK,
    success: true,
    message: "Role permissions fetched successfully",
    data: result
  });
});
var PermissionController = {
  createPermission: createPermission2,
  getAllPermissions: getAllPermissions2,
  getPermissionById: getPermissionById2,
  updatePermission: updatePermission2,
  deletePermission: deletePermission2,
  assignPermissionToRole: assignPermissionToRole2,
  removePermissionFromRole: removePermissionFromRole2,
  getRolePermissions: getRolePermissions2
};

// src/app/module/permission/permission.validation.ts
import { z as z11 } from "zod";
var actionField = z11.string("Action is required").min(2, "Action must be at least 2 characters").max(50, "Action must not exceed 50 characters").regex(
  /^[a-z]+(?:_[a-z]+)*$/,
  "Action may only contain lowercase letters and underscores"
);
var resourceField = z11.string("Resource is required").min(2, "Resource must be at least 2 characters").max(50, "Resource must not exceed 50 characters").regex(
  /^[a-z]+(?:_[a-z]+)*$/,
  "Resource may only contain lowercase letters and underscores"
);
var createPermissionSchema = z11.object({
  body: z11.object({
    action: actionField,
    resource: resourceField
  })
});
var updatePermissionSchema = z11.object({
  body: z11.object({
    action: actionField.optional(),
    resource: resourceField.optional()
  })
});
var assignPermissionSchema = z11.object({
  body: z11.object({
    permissionId: z11.string("Permission ID is required").cuid("Invalid permission ID format")
  })
});
var PermissionValidation = {
  createPermissionSchema,
  updatePermissionSchema,
  assignPermissionSchema
};

// src/app/module/permission/permission.route.ts
var router11 = Router11();
router11.post(
  "/",
  checkAuth(),
  validateRequest(PermissionValidation.createPermissionSchema),
  PermissionController.createPermission
);
router11.get("/", checkAuth(), PermissionController.getAllPermissions);
router11.get("/:permId", checkAuth(), PermissionController.getPermissionById);
router11.patch(
  "/:permId",
  checkAuth(),
  validateRequest(PermissionValidation.updatePermissionSchema),
  PermissionController.updatePermission
);
router11.delete("/:permId", checkAuth(), PermissionController.deletePermission);
router11.post(
  "/:orgId/:roleId/assign",
  checkAuth(),
  validateRequest(PermissionValidation.assignPermissionSchema),
  PermissionController.assignPermissionToRole
);
router11.get(
  "/:orgId/:roleId",
  checkAuth(),
  PermissionController.getRolePermissions
);
router11.delete(
  "/:orgId/:roleId/:permId",
  checkAuth(),
  PermissionController.removePermissionFromRole
);
var PermissionRoutes = router11;

// src/app/module/plan/plan.route.ts
import { Router as Router12 } from "express";

// src/app/module/plan/plan.controller.ts
import httpStatus16 from "http-status";

// src/app/module/plan/plan.service.ts
import status17 from "http-status";
var getActivePlans = async () => {
  return await prisma.plan.findMany({
    where: { isActive: true },
    include: {
      features: true
      // Fetch features to display on pricing page
    },
    orderBy: { createdAt: "asc" }
  });
};
var getPlanDetails = async (planId) => {
  const plan = await prisma.plan.findUnique({
    where: { id: planId },
    include: { features: true }
  });
  if (!plan) throw new AppError_default(status17.NOT_FOUND, "Plan not found");
  return plan;
};
var createPlan = async (payload) => {
  const existingPlan = await prisma.plan.findFirst({
    where: { name: payload.name }
  });
  if (existingPlan) {
    throw new AppError_default(status17.CONFLICT, "A plan with this name already exists");
  }
  return await prisma.plan.create({
    data: payload,
    include: { features: true }
  });
};
var updatePlan = async (planId, payload) => {
  const plan = await prisma.plan.findUnique({ where: { id: planId } });
  if (!plan) throw new AppError_default(status17.NOT_FOUND, "Plan not found");
  return await prisma.plan.update({
    where: { id: planId },
    data: payload
  });
};
var deactivatePlan = async (planId) => {
  const plan = await prisma.plan.findUnique({ where: { id: planId } });
  if (!plan) throw new AppError_default(status17.NOT_FOUND, "Plan not found");
  return await prisma.plan.update({
    where: { id: planId },
    data: { isActive: false }
  });
};
var addPlanFeature = async (planId, payload) => {
  const plan = await prisma.plan.findUnique({ where: { id: planId } });
  if (!plan) throw new AppError_default(status17.NOT_FOUND, "Plan not found");
  return await prisma.planFeature.create({
    data: {
      planId,
      ...payload
    }
  });
};
var getPlanFeatures = async (planId) => {
  const plan = await prisma.plan.findUnique({ where: { id: planId } });
  if (!plan) throw new AppError_default(status17.NOT_FOUND, "Plan not found");
  return await prisma.planFeature.findMany({
    where: { planId }
  });
};
var updatePlanFeature = async (planId, featureId, payload) => {
  const feature = await prisma.planFeature.findFirst({
    where: { id: featureId, planId }
  });
  if (!feature)
    throw new AppError_default(status17.NOT_FOUND, "Feature not found in this plan");
  return await prisma.planFeature.update({
    where: { id: featureId },
    data: payload
  });
};
var removePlanFeature = async (planId, featureId) => {
  const feature = await prisma.planFeature.findFirst({
    where: { id: featureId, planId }
  });
  if (!feature)
    throw new AppError_default(status17.NOT_FOUND, "Feature not found in this plan");
  return await prisma.planFeature.delete({
    where: { id: featureId }
  });
};
var PlanService = {
  getActivePlans,
  getPlanDetails,
  createPlan,
  updatePlan,
  deactivatePlan,
  addPlanFeature,
  getPlanFeatures,
  updatePlanFeature,
  removePlanFeature
};

// src/app/module/plan/plan.controller.ts
var getActivePlans2 = catchAsync(async (req, res) => {
  const result = await PlanService.getActivePlans();
  sendResponse(res, {
    httpStatusCode: httpStatus16.OK,
    success: true,
    message: "Active plans retrieved successfully",
    data: result
  });
});
var getPlanDetails2 = catchAsync(async (req, res) => {
  const result = await PlanService.getPlanDetails(req.params.planId);
  sendResponse(res, {
    httpStatusCode: httpStatus16.OK,
    success: true,
    message: "Plan details retrieved",
    data: result
  });
});
var createPlan2 = catchAsync(async (req, res) => {
  const result = await PlanService.createPlan(req.body);
  sendResponse(res, {
    httpStatusCode: httpStatus16.CREATED,
    success: true,
    message: "Plan created successfully",
    data: result
  });
});
var updatePlan2 = catchAsync(async (req, res) => {
  const result = await PlanService.updatePlan(
    req.params.planId,
    req.body
  );
  sendResponse(res, {
    httpStatusCode: httpStatus16.OK,
    success: true,
    message: "Plan updated successfully",
    data: result
  });
});
var deactivatePlan2 = catchAsync(async (req, res) => {
  const planId = req.params.planId;
  const result = await PlanService.deactivatePlan(planId);
  sendResponse(res, {
    httpStatusCode: httpStatus16.OK,
    success: true,
    message: "Plan deactivated successfully",
    data: result
  });
});
var addPlanFeature2 = catchAsync(async (req, res) => {
  const result = await PlanService.addPlanFeature(
    req.params.planId,
    req.body
  );
  sendResponse(res, {
    httpStatusCode: httpStatus16.CREATED,
    success: true,
    message: "Plan feature added successfully",
    data: result
  });
});
var getPlanFeatures2 = catchAsync(async (req, res) => {
  const result = await PlanService.getPlanFeatures(req.params.planId);
  sendResponse(res, {
    httpStatusCode: httpStatus16.OK,
    success: true,
    message: "Plan features retrieved",
    data: result
  });
});
var updatePlanFeature2 = catchAsync(async (req, res) => {
  const result = await PlanService.updatePlanFeature(
    req.params.planId,
    req.params.featureId,
    req.body
  );
  sendResponse(res, {
    httpStatusCode: httpStatus16.OK,
    success: true,
    message: "Plan feature updated successfully",
    data: result
  });
});
var removePlanFeature2 = catchAsync(async (req, res) => {
  await PlanService.removePlanFeature(
    req.params.planId,
    req.params.featureId
  );
  sendResponse(res, {
    httpStatusCode: httpStatus16.OK,
    success: true,
    message: "Plan feature removed successfully",
    data: null
  });
});
var PlanController = {
  getActivePlans: getActivePlans2,
  getPlanDetails: getPlanDetails2,
  createPlan: createPlan2,
  updatePlan: updatePlan2,
  deactivatePlan: deactivatePlan2,
  addPlanFeature: addPlanFeature2,
  getPlanFeatures: getPlanFeatures2,
  updatePlanFeature: updatePlanFeature2,
  removePlanFeature: removePlanFeature2
};

// src/app/module/plan/plan.validation.ts
import { z as z12 } from "zod";
var createPlanSchema = z12.object({
  body: z12.object({
    name: z12.string().min(2, "Plan name must be at least 2 characters").max(50),
    slug: z12.string().min(2).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format"),
    // Matches your org slug logic
    priceMonthly: z12.number().min(0, "Monthly price cannot be negative"),
    priceYearly: z12.number().min(0, "Yearly price cannot be negative"),
    currency: z12.string().optional().default("USD"),
    trialDays: z12.number().min(0).optional().default(14),
    isActive: z12.boolean().optional().default(true)
  })
});
var updatePlanSchema = z12.object({
  body: z12.object({
    name: z12.string().min(2).max(50).optional(),
    price: z12.number().min(0).optional(),
    trialDays: z12.number().min(0).optional(),
    isActive: z12.boolean().optional()
  })
});
var createFeatureSchema = z12.object({
  body: z12.object({
    name: z12.string().min(2).max(100),
    limitValue: z12.number().optional(),
    isEnabled: z12.boolean().optional()
  })
});
var updateFeatureSchema = z12.object({
  body: z12.object({
    name: z12.string().min(2).max(100).optional(),
    limitValue: z12.number().optional(),
    isEnabled: z12.boolean().optional()
  })
});
var PlanValidation = {
  createPlanSchema,
  updatePlanSchema,
  createFeatureSchema,
  updateFeatureSchema
};

// src/app/module/plan/plan.route.ts
var router12 = Router12();
router12.get("/", PlanController.getActivePlans);
router12.post(
  "/",
  checkAuth(),
  // Assuming SUPER_ADMIN is your platform admin role
  validateRequest(PlanValidation.createPlanSchema),
  PlanController.createPlan
);
router12.get("/:planId", PlanController.getPlanDetails);
router12.patch(
  "/:planId",
  checkAuth(),
  validateRequest(PlanValidation.updatePlanSchema),
  PlanController.updatePlan
);
router12.delete("/:planId", checkAuth(), PlanController.deactivatePlan);
router12.post(
  "/:planId/features",
  checkAuth(),
  validateRequest(PlanValidation.createFeatureSchema),
  PlanController.addPlanFeature
);
router12.get("/:planId/features", PlanController.getPlanFeatures);
router12.patch(
  "/:planId/features/:featureId",
  checkAuth(),
  validateRequest(PlanValidation.updateFeatureSchema),
  PlanController.updatePlanFeature
);
router12.delete(
  "/:planId/features/:featureId",
  checkAuth(),
  PlanController.removePlanFeature
);
var PlanRoutes = router12;

// src/app/module/project/project.route.ts
import { Router as Router13 } from "express";

// src/app/module/project/project.controller.ts
import httpStatus17 from "http-status";

// src/app/module/project/project.service.ts
import status18 from "http-status";
var createProject = async (userId, orgSlug, payload) => {
  if (!orgSlug) {
    throw new Error("Organization slug is required to create a project.");
  }
  const normalizedSlug = orgSlug.toLowerCase();
  console.log("Normalized Org Slug in Service:", normalizedSlug);
  console.log("Payload in Service:", payload);
  console.log("User ID in Service:", userId);
  const organization = await prisma.organization.findFirst({
    where: { slug: normalizedSlug }
  });
  console.log("Organization found in Service:", organization);
  if (!organization) {
    throw new Error("Organization not found in this createProject service");
  }
  return await prisma.project.create({
    data: {
      ...payload,
      organizationId: organization.id,
      createdBy: userId,
      projectMembers: {
        create: {
          userId,
          role: "OWNER"
        }
      }
    }
  });
};
var getProjectDetails = async (orgId, projectId) => {
  const project = await prisma.project.findFirst({
    where: { id: projectId, organizationId: orgId },
    include: {
      projectMembers: {
        include: { user: { select: { name: true, image: true } } }
      },
      labels: true
    }
  });
  if (!project) throw new AppError_default(status18.NOT_FOUND, "Project not found");
  return project;
};
var getOrgProjects = async (orgId, query) => {
  const { page = 1, limit = 10, searchTerm = "" } = query;
  const skip = (Number(page) - 1) * Number(limit);
  return await prisma.project.findMany({
    where: {
      organizationId: orgId,
      OR: [
        { name: { contains: searchTerm, mode: "insensitive" } },
        { description: { contains: searchTerm, mode: "insensitive" } }
      ]
    },
    skip,
    take: Number(limit),
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { tasks: true, projectMembers: true } } }
  });
};
var getMyProjects = async (userId) => {
  return await prisma.project.findMany({
    where: {
      projectMembers: { some: { userId } }
    },
    include: {
      organization: true,
      _count: { select: { tasks: true, projectMembers: true } }
    },
    orderBy: { createdAt: "desc" }
  });
};
var updateProject = async (projectId, payload) => {
  return await prisma.project.update({
    where: { id: projectId },
    data: payload
  });
};
var deleteProject = async (projectId) => {
  return await prisma.project.delete({
    where: { id: projectId }
  });
};
var getProjectStats = async (projectId) => {
  const tasks = await prisma.task.groupBy({
    by: ["status"],
    where: { projectId },
    _count: { _all: true }
  });
  const totalTasks = await prisma.task.count({ where: { projectId } });
  const closedTasks = await prisma.task.count({
    where: { projectId, status: "DONE" }
  });
  return {
    statusBreakdown: tasks,
    openTasks: totalTasks - closedTasks,
    closedTasks,
    completionPercentage: totalTasks > 0 ? closedTasks / totalTasks * 100 : 0
  };
};
var ProjectService = {
  createProject,
  getOrgProjects,
  getMyProjects,
  getProjectDetails,
  updateProject,
  deleteProject,
  getProjectStats
};

// src/app/module/project/project.controller.ts
var createProject2 = catchAsync(async (req, res) => {
  console.log("User ID from Middleware:", req.user?.userId);
  console.log("Org Slug from Params:", req.params.orgSlug);
  const result = await ProjectService.createProject(
    req.user.userId,
    req.params.orgSlug,
    req.body
  );
  console.log("Project created:", result);
  sendResponse(res, {
    httpStatusCode: httpStatus17.CREATED,
    success: true,
    message: "Project created successfully",
    data: result
  });
});
var getOrgProjects2 = catchAsync(async (req, res) => {
  const result = await ProjectService.getOrgProjects(
    req.params.orgId,
    req.query
  );
  sendResponse(res, {
    httpStatusCode: httpStatus17.OK,
    success: true,
    message: "Organization projects retrieved",
    data: result
  });
});
var getMyProjects2 = catchAsync(async (req, res) => {
  const result = await ProjectService.getMyProjects(req.user.userId);
  sendResponse(res, {
    httpStatusCode: httpStatus17.OK,
    success: true,
    message: "Your projects retrieved",
    data: result
  });
});
var getProjectDetails2 = catchAsync(async (req, res) => {
  const result = await ProjectService.getProjectDetails(
    req.params.orgId,
    req.params.projectId
  );
  sendResponse(res, {
    httpStatusCode: httpStatus17.OK,
    success: true,
    message: "Project details retrieved",
    data: result
  });
});
var updateProject2 = catchAsync(async (req, res) => {
  const result = await ProjectService.updateProject(
    req.params.projectId,
    req.body
  );
  sendResponse(res, {
    httpStatusCode: httpStatus17.OK,
    success: true,
    message: "Project updated successfully",
    data: result
  });
});
var deleteProject2 = catchAsync(async (req, res) => {
  await ProjectService.deleteProject(req.params.projectId);
  sendResponse(res, {
    httpStatusCode: httpStatus17.OK,
    success: true,
    message: "Project deleted successfully",
    data: null
  });
});
var getProjectStats2 = catchAsync(async (req, res) => {
  const result = await ProjectService.getProjectStats(
    req.params.projectId
  );
  sendResponse(res, {
    httpStatusCode: httpStatus17.OK,
    success: true,
    message: "Project statistics retrieved",
    data: result
  });
});
var ProjectController = {
  createProject: createProject2,
  getOrgProjects: getOrgProjects2,
  getMyProjects: getMyProjects2,
  getProjectDetails: getProjectDetails2,
  updateProject: updateProject2,
  deleteProject: deleteProject2,
  getProjectStats: getProjectStats2
};

// src/app/module/project/project.validation.ts
import { z as z13 } from "zod";
var createProjectSchema = z13.object({
  body: z13.object({
    name: z13.string().min(2).max(100),
    description: z13.string().max(500).optional()
  })
});
var updateProjectSchema = z13.object({
  body: z13.object({
    name: z13.string().min(2).optional(),
    description: z13.string().max(500).optional()
  })
});
var ProjectValidation = {
  createProjectSchema,
  updateProjectSchema
};

// src/app/module/project/project.route.ts
var router13 = Router13();
router13.post(
  "/:orgSlug",
  checkAuth(),
  validateRequest(ProjectValidation.createProjectSchema),
  ProjectController.createProject
);
router13.get("/:orgIdOrSlug", checkAuth(), ProjectController.getOrgProjects);
router13.get("/my-projects", checkAuth(), ProjectController.getMyProjects);
router13.get(
  "/:orgId/:projectId",
  checkAuth(),
  ProjectController.getProjectDetails
);
router13.patch(
  "/:orgId/:projectId",
  checkAuth(),
  validateRequest(ProjectValidation.updateProjectSchema),
  ProjectController.updateProject
);
router13.delete(
  "/:orgId/:projectId",
  checkAuth(),
  ProjectController.deleteProject
);
router13.get(
  "/:orgId/:projectId/stats",
  checkAuth(),
  ProjectController.getProjectStats
);
var ProjectRoutes = router13;

// src/app/module/projectMember/projectMember.route.ts
import { Router as Router14 } from "express";

// src/app/module/projectMember/projectMember.controller.ts
import httpStatus18 from "http-status";

// src/app/module/projectMember/projectMember.service.ts
import status19 from "http-status";
var getProjectMembers = async (projectId) => {
  return await prisma.projectMember.findMany({
    where: { projectId },
    include: {
      user: { select: { id: true, name: true, email: true, image: true } }
    }
  });
};
var addMemberToProject = async (projectId, payload) => {
  const existing = await prisma.projectMember.findUnique({
    where: { projectId_userId: { projectId, userId: payload.userId } }
  });
  if (existing)
    throw new AppError_default(
      status19.CONFLICT,
      "User is already a member of this project"
    );
  return await prisma.projectMember.create({
    data: { projectId, userId: payload.userId, role: payload.role }
  });
};
var updateMemberRole3 = async (projectId, userId, role) => {
  return await prisma.projectMember.update({
    where: { projectId_userId: { projectId, userId } },
    data: { role }
  });
};
var removeMember3 = async (projectId, userId) => {
  const member = await prisma.projectMember.findUnique({
    where: { projectId_userId: { projectId, userId } }
  });
  if (member?.role === ProjectMemberRole.OWNER) {
    throw new AppError_default(status19.BAD_REQUEST, "Project owner cannot be removed");
  }
  return await prisma.projectMember.delete({
    where: { projectId_userId: { projectId, userId } }
  });
};
var leaveProject = async (userId, projectId) => {
  const member = await prisma.projectMember.findUnique({
    where: { projectId_userId: { projectId, userId } }
  });
  if (member?.role === ProjectMemberRole.OWNER) {
    throw new AppError_default(
      status19.BAD_REQUEST,
      "Owner cannot leave. Transfer ownership or delete project."
    );
  }
  return await prisma.projectMember.delete({
    where: { projectId_userId: { projectId, userId } }
  });
};
var ProjectMemberService = {
  getProjectMembers,
  addMemberToProject,
  updateMemberRole: updateMemberRole3,
  removeMember: removeMember3,
  leaveProject
};

// src/app/module/projectMember/projectMember.controller.ts
var getProjectMembers2 = catchAsync(async (req, res) => {
  const result = await ProjectMemberService.getProjectMembers(
    req.params.projectId
  );
  sendResponse(res, {
    httpStatusCode: httpStatus18.OK,
    success: true,
    message: "Project members retrieved",
    data: result
  });
});
var addMemberToProject2 = catchAsync(async (req, res) => {
  const result = await ProjectMemberService.addMemberToProject(
    req.params.projectId,
    req.body
  );
  sendResponse(res, {
    httpStatusCode: httpStatus18.CREATED,
    success: true,
    message: "Member added to project",
    data: result
  });
});
var updateMemberRole4 = catchAsync(async (req, res) => {
  const result = await ProjectMemberService.updateMemberRole(
    req.params.projectId,
    req.params.userId,
    req.body.role
  );
  sendResponse(res, {
    httpStatusCode: httpStatus18.OK,
    success: true,
    message: "Member role updated",
    data: result
  });
});
var removeMember4 = catchAsync(async (req, res) => {
  await ProjectMemberService.removeMember(
    req.params.projectId,
    req.params.userId
  );
  sendResponse(res, {
    httpStatusCode: httpStatus18.OK,
    success: true,
    message: "Member removed from project",
    data: null
  });
});
var leaveProject2 = catchAsync(async (req, res) => {
  await ProjectMemberService.leaveProject(
    req.user.userId,
    req.params.projectId
  );
  sendResponse(res, {
    httpStatusCode: httpStatus18.OK,
    success: true,
    message: "Left the project successfully",
    data: null
  });
});
var ProjectMemberController = {
  getProjectMembers: getProjectMembers2,
  addMemberToProject: addMemberToProject2,
  updateMemberRole: updateMemberRole4,
  removeMember: removeMember4,
  leaveProject: leaveProject2
};

// src/app/module/projectMember/projectMember.validation.ts
import { z as z14 } from "zod";
var addMemberSchema = z14.object({
  body: z14.object({
    userId: z14.string("User ID is required"),
    role: z14.nativeEnum(ProjectMemberRole, "Valid role is required")
  })
});
var updateRoleSchema2 = z14.object({
  body: z14.object({
    role: z14.nativeEnum(ProjectMemberRole, "Valid role is required")
  })
});
var ProjectMemberValidation = {
  addMemberSchema,
  updateRoleSchema: updateRoleSchema2
};

// src/app/module/projectMember/projectMember.route.ts
var router14 = Router14();
router14.get(
  "/:projectId",
  checkAuth(),
  ProjectMemberController.getProjectMembers
);
router14.post(
  "/:projectId",
  checkAuth(),
  validateRequest(ProjectMemberValidation.addMemberSchema),
  ProjectMemberController.addMemberToProject
);
router14.patch(
  "/:projectId/:userId",
  checkAuth(),
  validateRequest(ProjectMemberValidation.updateRoleSchema),
  ProjectMemberController.updateMemberRole
);
router14.delete(
  "/:projectId/:userId",
  checkAuth(),
  ProjectMemberController.removeMember
);
router14.delete(
  "/:projectId/leave",
  checkAuth(),
  ProjectMemberController.leaveProject
);
var ProjectMemberRoutes = router14;

// src/app/module/role/role.route.ts
import { Router as Router15 } from "express";

// src/app/module/role/role.controller.ts
import httpStatus19 from "http-status";

// src/app/module/role/route.service.ts
import status20 from "http-status";
var createRole = async (orgId, payload) => {
  const existing = await prisma.role.findFirst({
    where: { organizationId: orgId, name: payload.name }
  });
  if (existing)
    throw new AppError_default(
      status20.CONFLICT,
      "Role name already exists in this organization"
    );
  return await prisma.role.create({
    data: {
      ...payload,
      organizationId: orgId
    }
  });
};
var getOrgRoles = async (orgId) => {
  return await prisma.role.findMany({
    where: { organizationId: orgId },
    include: { _count: { select: { memberships: true } } }
  });
};
var getRoleDetails = async (orgId, roleId) => {
  const role = await prisma.role.findFirst({
    where: { id: roleId, organizationId: orgId },
    include: {
      rolePermissions: {
        include: { permission: true }
      }
    }
  });
  if (!role)
    throw new AppError_default(status20.NOT_FOUND, "Role not found in this organization");
  return role;
};
var updateRole = async (orgId, roleId, payload) => {
  const role = await prisma.role.findFirst({
    where: { id: roleId, organizationId: orgId }
  });
  if (!role) throw new AppError_default(status20.NOT_FOUND, "Role not found");
  if (role.name === "OWNER" || role.name === "ADMIN") {
    throw new AppError_default(status20.BAD_REQUEST, "System roles cannot be modified");
  }
  return await prisma.role.update({
    where: { id: roleId },
    data: payload
  });
};
var deleteRole = async (orgId, roleId) => {
  const role = await prisma.role.findFirst({
    where: { id: roleId, organizationId: orgId },
    include: { memberships: true }
  });
  if (!role) throw new AppError_default(status20.NOT_FOUND, "Role not found");
  if (role.memberships.length > 0) {
    throw new AppError_default(
      status20.BAD_REQUEST,
      "Cannot delete role while members are assigned to it"
    );
  }
  return await prisma.role.delete({ where: { id: roleId } });
};
var RoleService = {
  createRole,
  getOrgRoles,
  getRoleDetails,
  updateRole,
  deleteRole
};

// src/app/module/role/role.controller.ts
var createRole2 = catchAsync(async (req, res) => {
  const result = await RoleService.createRole(
    req.params.orgId,
    req.body
  );
  sendResponse(res, {
    httpStatusCode: httpStatus19.CREATED,
    success: true,
    message: "Custom role created successfully",
    data: result
  });
});
var getOrgRoles2 = catchAsync(async (req, res) => {
  const result = await RoleService.getOrgRoles(req.params.orgId);
  sendResponse(res, {
    httpStatusCode: httpStatus19.OK,
    success: true,
    message: "Organization roles retrieved successfully",
    data: result
  });
});
var getRoleDetails2 = catchAsync(async (req, res) => {
  const result = await RoleService.getRoleDetails(
    req.params.orgId,
    req.params.roleId
  );
  sendResponse(res, {
    httpStatusCode: httpStatus19.OK,
    success: true,
    message: "Role details retrieved successfully",
    data: result
  });
});
var updateRole2 = catchAsync(async (req, res) => {
  const result = await RoleService.updateRole(
    req.params.orgId,
    req.params.roleId,
    req.body
  );
  sendResponse(res, {
    httpStatusCode: httpStatus19.OK,
    success: true,
    message: "Role updated successfully",
    data: result
  });
});
var deleteRole2 = catchAsync(async (req, res) => {
  await RoleService.deleteRole(
    req.params.orgId,
    req.params.roleId
  );
  sendResponse(res, {
    httpStatusCode: httpStatus19.OK,
    success: true,
    message: "Role deleted successfully",
    data: null
  });
});
var RoleController = {
  createRole: createRole2,
  getOrgRoles: getOrgRoles2,
  getRoleDetails: getRoleDetails2,
  updateRole: updateRole2,
  deleteRole: deleteRole2
};

// src/app/module/role/role.route.ts
var router15 = Router15();
router15.post("/:orgId", checkAuth(), RoleController.createRole);
router15.get("/:orgId", checkAuth(), RoleController.getOrgRoles);
router15.get("/:orgId/:roleId", checkAuth(), RoleController.getRoleDetails);
router15.patch("/:orgId/:roleId", checkAuth(), RoleController.updateRole);
router15.delete("/:orgId/:roleId", checkAuth(), RoleController.deleteRole);
var RoleRoutes = router15;

// src/app/module/subscription/subscription.route.ts
import { Router as Router16 } from "express";

// src/app/module/subscription/subscription.controller.ts
import httpStatus20 from "http-status";

// src/app/module/subscription/subscription.service.ts
import status21 from "http-status";
var verifyOrgOwner = async (userId, orgId) => {
  const membership = await prisma.membership.findFirst({
    where: { organizationId: orgId, userId, role: { name: "OWNER" } }
  });
  if (!membership)
    throw new AppError_default(
      status21.FORBIDDEN,
      "Only organization owners can manage subscriptions"
    );
};
var subscribe = async (userId, orgId, payload) => {
  await verifyOrgOwner(userId, orgId);
  const plan = await prisma.plan.findUnique({
    where: { id: payload.planId }
  });
  if (!plan) throw new AppError_default(status21.NOT_FOUND, "Plan not found");
  const unitAmount = payload.billingCycle === "YEARLY" ? Math.round(Number(plan.priceYearly) * 100) : Math.round(Number(plan.priceMonthly) * 100);
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "subscription",
    customer_email: void 0,
    // You can pass req.user.email here
    line_items: [
      {
        price_data: {
          currency: plan.currency.toLowerCase(),
          product_data: {
            name: plan.name,
            description: plan.description || `Plan: ${plan.name}`
          },
          unit_amount: unitAmount,
          recurring: {
            interval: payload.billingCycle === "YEARLY" ? "year" : "month"
          }
        },
        quantity: 1
      }
    ],
    // Metadata links the Stripe payment back to your local database entities
    metadata: {
      orgId,
      planId: plan.id,
      billingCycle: payload.billingCycle
    },
    success_url: `${process.env.FRONTEND_URL}/${orgId}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONTEND_URL}/${orgId}/billing?canceled=true`
  });
  return { url: session.url };
};
var handleSuccessfulSubscription = async (session) => {
  const { orgId, planId, billingCycle } = session.metadata;
  if (!orgId || !planId) {
    throw new Error(`Missing metadata in Stripe Session: ${session.id}`);
  }
  const stripeSubscriptionId = session.subscription;
  const stripeCustomerId = session.customer;
  const now = /* @__PURE__ */ new Date();
  const periodEnd = /* @__PURE__ */ new Date();
  if (billingCycle === "YEARLY") {
    periodEnd.setFullYear(periodEnd.getFullYear() + 1);
  } else {
    periodEnd.setMonth(periodEnd.getMonth() + 1);
  }
  return await prisma.$transaction(async (tx) => {
    const subscription = await tx.subscription.upsert({
      where: { organizationId: orgId },
      update: {
        planId,
        status: "ACTIVE",
        stripeSubscriptionId,
        stripeCustomerId,
        billingCycle,
        currentPeriodStart: now,
        currentPeriodEnd: periodEnd,
        cancelAtPeriodEnd: false
      },
      create: {
        organizationId: orgId,
        planId,
        status: "ACTIVE",
        stripeSubscriptionId,
        stripeCustomerId,
        billingCycle,
        currentPeriodStart: now,
        currentPeriodEnd: periodEnd
      }
    });
    const amount = session.amount_total ? session.amount_total / 100 : 0;
    await tx.invoice.create({
      data: {
        subscriptionId: subscription.id,
        status: "PAID",
        amountDue: amount,
        amountPaid: amount,
        currency: session.currency?.toUpperCase() || "USD",
        periodStart: now,
        periodEnd,
        paidAt: now,
        stripeInvoiceId: session.invoice
        // Link to Stripe Invoice ID
        // invoicePdfUrl can be updated later via invoice.paid webhook if needed
      }
    });
    return subscription;
  });
};
var getSubscription = async (orgId) => {
  const subscription = await prisma.subscription.findUnique({
    where: { organizationId: orgId },
    include: {
      plan: true,
      // Includes details like plan limits/pricing
      invoices: {
        // CRITICAL: This ensures subscription.invoices is sent to frontend!
        orderBy: {
          createdAt: "desc"
          // Shows your latest invoices first on the ledger
        }
      }
    }
  });
  if (!subscription)
    throw new AppError_default(
      status21.NOT_FOUND,
      "No subscription found for this organization"
    );
  return subscription;
};
var getUsage = async (orgId) => {
  const subscription = await getSubscription(orgId);
  const projectCount = await prisma.project.count({
    where: { organizationId: orgId }
  });
  const memberCount = await prisma.membership.count({
    where: { organizationId: orgId }
  });
  return {
    subscriptionDetails: subscription,
    usage: {
      projects: projectCount,
      members: memberCount
      // Add other metrics (tasks, storage space, etc.) as needed
    }
  };
};
var upgradeSubscription = async (userId, orgId, newPlanId) => {
  await verifyOrgOwner(userId, orgId);
  const sub = await prisma.subscription.findFirst({
    where: { organizationId: orgId, status: { in: ["ACTIVE", "TRIALING"] } }
  });
  if (!sub)
    throw new AppError_default(status21.NOT_FOUND, "Active subscription not found");
  return await prisma.subscription.update({
    where: { id: sub.id },
    data: { planId: newPlanId }
  });
};
var downgradeSubscription = async (userId, orgId, newPlanId) => {
  await verifyOrgOwner(userId, orgId);
  const sub = await prisma.subscription.findFirst({
    where: { organizationId: orgId, status: { in: ["ACTIVE", "TRIALING"] } }
  });
  if (!sub)
    throw new AppError_default(status21.NOT_FOUND, "Active subscription not found");
  return await prisma.subscription.update({
    where: { id: sub.id },
    data: { planId: newPlanId }
  });
};
var changeBillingCycle = async (userId, orgId, billingCycle) => {
  await verifyOrgOwner(userId, orgId);
  const sub = await prisma.subscription.findFirst({
    where: { organizationId: orgId, status: { in: ["ACTIVE", "TRIALING"] } }
  });
  if (!sub)
    throw new AppError_default(status21.NOT_FOUND, "Active subscription not found");
  return await prisma.subscription.update({
    where: { id: sub.id },
    data: { billingCycle }
  });
};
var cancelSubscription = async (userId, orgId) => {
  await verifyOrgOwner(userId, orgId);
  const sub = await prisma.subscription.findFirst({
    where: { organizationId: orgId, status: { in: ["ACTIVE", "TRIALING"] } }
  });
  if (!sub)
    throw new AppError_default(status21.NOT_FOUND, "Active subscription not found");
  return await prisma.subscription.update({
    where: { id: sub.id },
    data: { cancelAtPeriodEnd: true }
  });
};
var reactivateSubscription = async (userId, orgId) => {
  await verifyOrgOwner(userId, orgId);
  const sub = await prisma.subscription.findFirst({
    where: { organizationId: orgId, cancelAtPeriodEnd: true }
  });
  if (!sub)
    throw new AppError_default(
      status21.NOT_FOUND,
      "No pending cancellation found to reactivate"
    );
  return await prisma.subscription.update({
    where: { id: sub.id },
    data: { cancelAtPeriodEnd: false }
  });
};
var SubscriptionService = {
  subscribe,
  handleSuccessfulSubscription,
  getSubscription,
  getUsage,
  upgradeSubscription,
  downgradeSubscription,
  changeBillingCycle,
  cancelSubscription,
  reactivateSubscription
};

// src/app/module/subscription/subscription.controller.ts
var subscribe2 = catchAsync(async (req, res) => {
  const result = await SubscriptionService.subscribe(
    req.user.userId,
    req.params.orgId,
    req.body
  );
  sendResponse(res, {
    httpStatusCode: httpStatus20.CREATED,
    success: true,
    message: "Subscription created successfully",
    data: result
  });
});
var handleWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  if (!sig) {
    console.error("\u274C Webhook Error: No Stripe signature found in headers.");
    return res.status(400).send("No Stripe signature");
  }
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      // The raw buffer
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error(`\u274C Webhook Signature Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  console.log(`\u2705 Webhook Received: ${event.type}`);
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    console.log("\u2139\uFE0F Session Metadata received:", session.metadata);
    try {
      await SubscriptionService.handleSuccessfulSubscription(session);
      console.log("\u{1F680} SUCCESS: Subscription and Invoice saved to Database!");
    } catch (err) {
      console.error("\u274C Database sync failed in webhook:", err.message || err);
      return res.status(500).json({ error: "Webhook DB handler failed" });
    }
  }
  res.json({ received: true });
};
var getSubscription2 = catchAsync(async (req, res) => {
  const result = await SubscriptionService.getSubscription(
    req.params.orgId
  );
  sendResponse(res, {
    httpStatusCode: httpStatus20.OK,
    success: true,
    message: "Subscription retrieved",
    data: result
  });
});
var getUsage2 = catchAsync(async (req, res) => {
  const result = await SubscriptionService.getUsage(req.params.orgId);
  sendResponse(res, {
    httpStatusCode: httpStatus20.OK,
    success: true,
    message: "Usage metrics retrieved",
    data: result
  });
});
var upgradeSubscription2 = catchAsync(async (req, res) => {
  const result = await SubscriptionService.upgradeSubscription(
    req.user.userId,
    req.params.orgId,
    req.body.planId
  );
  sendResponse(res, {
    httpStatusCode: httpStatus20.OK,
    success: true,
    message: "Subscription upgraded successfully",
    data: result
  });
});
var downgradeSubscription2 = catchAsync(
  async (req, res) => {
    const result = await SubscriptionService.downgradeSubscription(
      req.user.userId,
      req.params.orgId,
      req.body.planId
    );
    sendResponse(res, {
      httpStatusCode: httpStatus20.OK,
      success: true,
      message: "Subscription downgraded successfully",
      data: result
    });
  }
);
var changeBillingCycle2 = catchAsync(async (req, res) => {
  const result = await SubscriptionService.changeBillingCycle(
    req.user.userId,
    req.params.orgId,
    req.body.billingCycle
  );
  sendResponse(res, {
    httpStatusCode: httpStatus20.OK,
    success: true,
    message: "Billing cycle updated",
    data: result
  });
});
var cancelSubscription2 = catchAsync(async (req, res) => {
  const result = await SubscriptionService.cancelSubscription(
    req.user.userId,
    req.params.orgId
  );
  sendResponse(res, {
    httpStatusCode: httpStatus20.OK,
    success: true,
    message: "Subscription scheduled for cancellation",
    data: result
  });
});
var reactivateSubscription2 = catchAsync(
  async (req, res) => {
    const result = await SubscriptionService.reactivateSubscription(
      req.user.userId,
      req.params.orgId
    );
    sendResponse(res, {
      httpStatusCode: httpStatus20.OK,
      success: true,
      message: "Subscription reactivated",
      data: result
    });
  }
);
var SubscriptionController = {
  subscribe: subscribe2,
  handleWebhook,
  getSubscription: getSubscription2,
  getUsage: getUsage2,
  upgradeSubscription: upgradeSubscription2,
  downgradeSubscription: downgradeSubscription2,
  changeBillingCycle: changeBillingCycle2,
  cancelSubscription: cancelSubscription2,
  reactivateSubscription: reactivateSubscription2
};

// src/app/module/subscription/subscription.validation.ts
import { z as z15 } from "zod";
var subscribeSchema = z15.object({
  body: z15.object({
    planId: z15.string().min(1, "Plan ID is required"),
    billingCycle: z15.enum(
      ["MONTHLY", "YEARLY"],
      "Billing cycle must be MONTHLY or YEARLY"
    )
  })
});
var changePlanSchema = z15.object({
  body: z15.object({
    planId: z15.string().min(1, "New Plan ID is required")
  })
});
var changeBillingCycleSchema = z15.object({
  body: z15.object({
    billingCycle: z15.enum(["MONTHLY", "YEARLY"])
  })
});
var SubscriptionValidation = {
  subscribeSchema,
  changePlanSchema,
  changeBillingCycleSchema
};

// src/app/module/subscription/subscription.route.ts
var router16 = Router16();
router16.post(
  "/:orgId/subscribe",
  checkAuth(),
  validateRequest(SubscriptionValidation.subscribeSchema),
  SubscriptionController.subscribe
);
router16.get("/:orgId", SubscriptionController.getSubscription);
router16.get("/:orgId/usage", SubscriptionController.getUsage);
router16.patch(
  "/:orgId/upgrade",
  checkAuth(),
  validateRequest(SubscriptionValidation.changePlanSchema),
  SubscriptionController.upgradeSubscription
);
router16.patch(
  "/:orgId/downgrade",
  checkAuth(),
  validateRequest(SubscriptionValidation.changePlanSchema),
  SubscriptionController.downgradeSubscription
);
router16.patch(
  "/:orgId/billing-cycle",
  checkAuth(),
  validateRequest(SubscriptionValidation.changeBillingCycleSchema),
  SubscriptionController.changeBillingCycle
);
router16.patch(
  "/:orgId/cancel",
  checkAuth(),
  SubscriptionController.cancelSubscription
);
router16.patch(
  "/:orgId/reactivate",
  checkAuth(),
  SubscriptionController.reactivateSubscription
);
var SubscriptionRoutes = router16;

// src/app/module/task/task.route.ts
import { Router as Router17 } from "express";

// src/app/module/task/task.controller.ts
import httpStatus21 from "http-status";

// src/app/module/task/task.service.ts
import status22 from "http-status";
var createTask = async (creatorId, projectId, payload) => {
  const { labelIds, ...taskData } = payload;
  return await prisma.task.create({
    data: {
      ...taskData,
      projectId,
      creatorId,
      // Connect existing labels if provided
      labels: labelIds ? { connect: labelIds.map((id) => ({ id })) } : void 0
    }
  });
};
var getProjectTasks = async (projectId, filters) => {
  const { status: status25, priority, assignee, assignedTo, searchTerm } = filters;
  return await prisma.task.findMany({
    where: {
      projectId,
      status: status25,
      priority,
      assignedTo,
      assignee,
      title: searchTerm ? { contains: searchTerm, mode: "insensitive" } : void 0
    },
    include: {
      assignee: { select: { name: true, image: true } }
    }
  });
};
var getMyTasks = async (userId) => {
  return await prisma.task.findMany({
    where: { assignedTo: userId },
    include: { project: { select: { name: true } } },
    orderBy: { createdAt: "asc" }
  });
};
var getTaskDetails = async (taskId) => {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      assignee: true,
      _count: { select: { comments: true, attachments: true } }
    }
  });
  if (!task) throw new AppError_default(status22.NOT_FOUND, "Task not found");
  return task;
};
var updateTask = async (taskId, payload) => {
  return await prisma.task.update({ where: { id: taskId }, data: payload });
};
var updateTaskStatus = async (taskId, newStatus) => {
  return await prisma.task.update({
    where: { id: taskId },
    data: { status: newStatus }
  });
};
var assignTask = async (taskId, userId) => {
  return await prisma.task.update({
    where: { id: taskId },
    data: { assignedTo: userId }
  });
};
var unassignTask = async (taskId) => {
  return await prisma.task.update({
    where: { id: taskId },
    data: { assignedTo: null }
  });
};
var deleteTask = async (taskId) => {
  return await prisma.task.delete({ where: { id: taskId } });
};
var TaskService = {
  createTask,
  getProjectTasks,
  getMyTasks,
  getTaskDetails,
  updateTask,
  updateTaskStatus,
  assignTask,
  unassignTask,
  deleteTask
};

// src/app/module/task/task.controller.ts
var createTask2 = catchAsync(async (req, res) => {
  const result = await TaskService.createTask(
    req.user.userId,
    req.params.projectId,
    req.body
  );
  sendResponse(res, {
    httpStatusCode: httpStatus21.CREATED,
    success: true,
    message: "Task created",
    data: result
  });
});
var getProjectTasks2 = catchAsync(async (req, res) => {
  const result = await TaskService.getProjectTasks(
    req.params.projectId,
    req.query
  );
  sendResponse(res, {
    httpStatusCode: httpStatus21.OK,
    success: true,
    message: "Tasks retrieved",
    data: result
  });
});
var getMyTasks2 = catchAsync(async (req, res) => {
  const result = await TaskService.getMyTasks(req.user.userId);
  sendResponse(res, {
    httpStatusCode: httpStatus21.OK,
    success: true,
    message: "My tasks retrieved",
    data: result
  });
});
var getTaskDetails2 = catchAsync(async (req, res) => {
  const result = await TaskService.getTaskDetails(req.params.taskId);
  sendResponse(res, {
    httpStatusCode: httpStatus21.OK,
    success: true,
    message: "Task details retrieved",
    data: result
  });
});
var updateTask2 = catchAsync(async (req, res) => {
  const result = await TaskService.updateTask(
    req.params.taskId,
    req.body
  );
  sendResponse(res, {
    httpStatusCode: httpStatus21.OK,
    success: true,
    message: "Task updated",
    data: result
  });
});
var updateTaskStatus2 = catchAsync(async (req, res) => {
  const result = await TaskService.updateTaskStatus(
    req.params.taskId,
    req.body.status
  );
  sendResponse(res, {
    httpStatusCode: httpStatus21.OK,
    success: true,
    message: "Status updated",
    data: result
  });
});
var assignTask2 = catchAsync(async (req, res) => {
  const result = await TaskService.assignTask(
    req.params.taskId,
    req.body.userId
  );
  sendResponse(res, {
    httpStatusCode: httpStatus21.OK,
    success: true,
    message: "Task assigned",
    data: result
  });
});
var unassignTask2 = catchAsync(async (req, res) => {
  const result = await TaskService.unassignTask(req.params.taskId);
  sendResponse(res, {
    httpStatusCode: httpStatus21.OK,
    success: true,
    message: "Task unassigned",
    data: result
  });
});
var deleteTask2 = catchAsync(async (req, res) => {
  await TaskService.deleteTask(req.params.taskId);
  sendResponse(res, {
    httpStatusCode: httpStatus21.OK,
    success: true,
    message: "Task deleted",
    data: null
  });
});
var TaskController = {
  createTask: createTask2,
  getProjectTasks: getProjectTasks2,
  getMyTasks: getMyTasks2,
  getTaskDetails: getTaskDetails2,
  updateTask: updateTask2,
  updateTaskStatus: updateTaskStatus2,
  assignTask: assignTask2,
  unassignTask: unassignTask2,
  deleteTask: deleteTask2
};

// src/app/module/task/task.validation.ts
import { z as z16 } from "zod";
var createTaskSchema = z16.object({
  body: z16.object({
    title: z16.string().min(3).max(255),
    description: z16.string().optional(),
    priority: z16.nativeEnum(TaskPriority).optional(),
    dueDate: z16.string().datetime().optional(),
    assigneeId: z16.string().optional(),
    labelIds: z16.array(z16.string()).optional()
  })
});
var updateTaskSchema = z16.object({
  body: z16.object({
    title: z16.string().min(3).optional(),
    description: z16.string().optional(),
    priority: z16.nativeEnum(TaskPriority).optional(),
    dueDate: z16.string().datetime().optional()
  })
});
var updateStatusSchema = z16.object({
  body: z16.object({
    status: z16.nativeEnum(TaskStatus)
  })
});
var assignTaskSchema = z16.object({
  body: z16.object({
    userId: z16.string()
  })
});
var TaskValidation = {
  createTaskSchema,
  updateTaskSchema,
  updateStatusSchema,
  assignTaskSchema
};

// src/app/module/task/task.route.ts
var router17 = Router17();
router17.post(
  "/:projectId",
  checkAuth(),
  validateRequest(TaskValidation.createTaskSchema),
  TaskController.createTask
);
router17.get("/my-tasks", checkAuth(), TaskController.getMyTasks);
router17.get("/:projectId", checkAuth(), TaskController.getProjectTasks);
router17.get("/:projectId/:taskId", checkAuth(), TaskController.getTaskDetails);
router17.patch(
  "/:projectId/:taskId",
  checkAuth(),
  validateRequest(TaskValidation.updateTaskSchema),
  TaskController.updateTask
);
router17.patch(
  "/:projectId/:taskId/status",
  checkAuth(),
  validateRequest(TaskValidation.updateStatusSchema),
  TaskController.updateTaskStatus
);
router17.patch(
  "/:projectId/:taskId/assign",
  checkAuth(),
  validateRequest(TaskValidation.assignTaskSchema),
  TaskController.assignTask
);
router17.patch(
  "/:projectId/:taskId/unassign",
  checkAuth(),
  TaskController.unassignTask
);
router17.delete("/:projectId/:taskId", checkAuth(), TaskController.deleteTask);
var TaskRoutes = router17;

// src/app/module/taskAttachment/taskAttachment.route.ts
import { Router as Router18 } from "express";

// src/app/module/taskAttachment/taskAttachment.controller.ts
import httpStatus22 from "http-status";

// src/app/module/taskAttachment/taskAttachment.service.ts
import status23 from "http-status";
var uploadAttachment = async (payload) => {
  const task = await prisma.task.findUnique({ where: { id: payload.taskId } });
  if (!task) throw new AppError_default(status23.NOT_FOUND, "Task not found");
  return await prisma.taskAttachment.create({
    data: {
      taskId: payload.taskId,
      fileUrl: payload.fileUrl,
      uploadedBy: payload.uploadedBy
    }
  });
};
var getTaskAttachments = async (taskId) => {
  return await prisma.taskAttachment.findMany({
    where: { taskId },
    orderBy: { id: "desc" }
    // No createdAt field in your specific schema, using ID as fallback proxy for sorting
  });
};
var getAttachmentDetails = async (taskId, attachmentId) => {
  const attachment = await prisma.taskAttachment.findFirst({
    where: { id: attachmentId, taskId }
  });
  if (!attachment) throw new AppError_default(status23.NOT_FOUND, "Attachment not found");
  return {
    ...attachment,
    // signedUrl: signedUrl // Attach the temporary download link
    signedUrl: attachment.fileUrl
    // Placeholder
  };
};
var deleteAttachment = async (userId, taskId, attachmentId) => {
  const attachment = await prisma.taskAttachment.findFirst({
    where: { id: attachmentId, taskId },
    include: {
      task: { include: { project: { include: { projectMembers: true } } } }
    }
  });
  if (!attachment) throw new AppError_default(status23.NOT_FOUND, "Attachment not found");
  const isUploader = attachment.uploadedBy === userId;
  const projectMember = attachment.task.project.projectMembers.find(
    (m) => m.userId === userId
  );
  const isPrivileged = projectMember && (projectMember.role === "OWNER" || projectMember.role === "MANAGER");
  if (!isUploader && !isPrivileged) {
    throw new AppError_default(
      status23.FORBIDDEN,
      "You do not have permission to delete this attachment"
    );
  }
  return await prisma.taskAttachment.delete({
    where: { id: attachmentId }
  });
};
var TaskAttachmentService = {
  uploadAttachment,
  getTaskAttachments,
  getAttachmentDetails,
  deleteAttachment
};

// src/app/module/taskAttachment/taskAttachment.controller.ts
var uploadAttachment2 = catchAsync(async (req, res) => {
  const file = req.file;
  if (!file) {
    throw new AppError_default(httpStatus22.BAD_REQUEST, "Please upload a valid file");
  }
  const fileUrl = file.location || file.path;
  const result = await TaskAttachmentService.uploadAttachment({
    taskId: req.params.taskId,
    fileUrl,
    uploadedBy: req.user.userId
  });
  sendResponse(res, {
    httpStatusCode: httpStatus22.CREATED,
    success: true,
    message: "File uploaded successfully",
    data: result
  });
});
var getTaskAttachments2 = catchAsync(async (req, res) => {
  const result = await TaskAttachmentService.getTaskAttachments(
    req.params.taskId
  );
  sendResponse(res, {
    httpStatusCode: httpStatus22.OK,
    success: true,
    message: "Attachments retrieved successfully",
    data: result
  });
});
var getAttachmentDetails2 = catchAsync(async (req, res) => {
  const result = await TaskAttachmentService.getAttachmentDetails(
    req.params.taskId,
    req.params.attachmentId
  );
  sendResponse(res, {
    httpStatusCode: httpStatus22.OK,
    success: true,
    message: "Attachment details retrieved",
    data: result
  });
});
var deleteAttachment2 = catchAsync(async (req, res) => {
  await TaskAttachmentService.deleteAttachment(
    req.user.userId,
    req.params.taskId,
    req.params.attachmentId
  );
  sendResponse(res, {
    httpStatusCode: httpStatus22.OK,
    success: true,
    message: "Attachment deleted successfully",
    data: null
  });
});
var TaskAttachmentController = {
  uploadAttachment: uploadAttachment2,
  getTaskAttachments: getTaskAttachments2,
  getAttachmentDetails: getAttachmentDetails2,
  deleteAttachment: deleteAttachment2
};

// src/app/module/taskAttachment/taskAttachment.validation.ts
import { z as z17 } from "zod";
var attachmentParamsSchema = z17.object({
  params: z17.object({
    taskId: z17.string("Task ID is required"),
    attachmentId: z17.string().optional()
  })
});
var TaskAttachmentValidation = {
  attachmentParamsSchema
};

// src/app/module/taskAttachment/taskAttachment.route.ts
var router18 = Router18();
router18.post(
  "/:taskId",
  checkAuth(),
  validateRequest(TaskAttachmentValidation.attachmentParamsSchema),
  upload.single("file"),
  // <-- Inject Multer middleware here
  TaskAttachmentController.uploadAttachment
);
router18.get(
  "/:taskId",
  checkAuth(),
  validateRequest(TaskAttachmentValidation.attachmentParamsSchema),
  TaskAttachmentController.getTaskAttachments
);
router18.get(
  "/:taskId/:attachmentId",
  checkAuth(),
  validateRequest(TaskAttachmentValidation.attachmentParamsSchema),
  TaskAttachmentController.getAttachmentDetails
);
router18.delete(
  "/:taskId/:attachmentId",
  checkAuth(),
  validateRequest(TaskAttachmentValidation.attachmentParamsSchema),
  TaskAttachmentController.deleteAttachment
);
var TaskAttachmentRoutes = router18;

// src/app/module/taskComment/taskComment.route.ts
import { Router as Router19 } from "express";

// src/app/module/taskComment/taskComment.controller.ts
import httpStatus23 from "http-status";

// src/app/module/taskComment/taskComment.service.ts
import status24 from "http-status";
var createComment = async (userId, taskId, payload) => {
  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task) throw new AppError_default(status24.NOT_FOUND, "Task not found");
  return await prisma.taskComment.create({
    data: {
      message: payload.content,
      taskId,
      userId
    },
    include: {
      user: { select: { name: true, image: true } }
    }
  });
};
var getTaskComments = async (taskId, query) => {
  const { page = 1, limit = 20 } = query;
  const skip = (Number(page) - 1) * Number(limit);
  const [taskComment, total] = await Promise.all([
    prisma.taskComment.findMany({
      where: { taskId },
      include: { user: { select: { id: true, name: true, image: true } } },
      orderBy: { createdAt: "desc" },
      skip,
      take: Number(limit)
    }),
    prisma.taskComment.count({ where: { taskId } })
  ]);
  return {
    meta: { page: Number(page), limit: Number(limit), total },
    data: taskComment
  };
};
var updateComment = async (userId, commentId, payload) => {
  const comment = await prisma.taskComment.findUnique({
    where: { id: commentId }
  });
  if (!comment) throw new AppError_default(status24.NOT_FOUND, "Comment not found");
  if (comment.userId !== userId) {
    throw new AppError_default(status24.FORBIDDEN, "You can only edit your own comments");
  }
  return await prisma.taskComment.update({
    where: { id: commentId },
    data: { message: payload.content }
  });
};
var deleteComment = async (userId, commentId) => {
  const comment = await prisma.taskComment.findUnique({
    where: { id: commentId },
    include: {
      task: { include: { project: { include: { projectMembers: true } } } }
    }
  });
  if (!comment) throw new AppError_default(status24.NOT_FOUND, "Comment not found");
  const isAuthor = comment.userId === userId;
  const projectMember = comment.task.project.projectMembers.find(
    (m) => m.userId === userId
  );
  const isPrivileged = projectMember && (projectMember.role === "OWNER" || projectMember.role === "MANAGER");
  if (!isAuthor && !isPrivileged) {
    throw new AppError_default(
      status24.FORBIDDEN,
      "You do not have permission to delete this comment"
    );
  }
  return await prisma.taskComment.delete({ where: { id: commentId } });
};
var TaskCommentService = {
  createComment,
  getTaskComments,
  updateComment,
  deleteComment
};

// src/app/module/taskComment/taskComment.controller.ts
var createComment2 = catchAsync(async (req, res) => {
  const result = await TaskCommentService.createComment(
    req.user.userId,
    req.params.taskId,
    req.body
  );
  sendResponse(res, {
    httpStatusCode: httpStatus23.CREATED,
    success: true,
    message: "Comment added successfully",
    data: result
  });
});
var getTaskComments2 = catchAsync(async (req, res) => {
  const result = await TaskCommentService.getTaskComments(
    req.params.taskId,
    req.query
  );
  sendResponse(res, {
    httpStatusCode: httpStatus23.OK,
    success: true,
    message: "Comments retrieved successfully",
    data: result
  });
});
var updateComment2 = catchAsync(async (req, res) => {
  const result = await TaskCommentService.updateComment(
    req.user.userId,
    req.params.commentId,
    req.body
  );
  sendResponse(res, {
    httpStatusCode: httpStatus23.OK,
    success: true,
    message: "Comment updated successfully",
    data: result
  });
});
var deleteComment2 = catchAsync(async (req, res) => {
  await TaskCommentService.deleteComment(
    req.user.userId,
    req.params.commentId
  );
  sendResponse(res, {
    httpStatusCode: httpStatus23.OK,
    success: true,
    message: "Comment deleted successfully",
    data: null
  });
});
var TaskCommentController = {
  createComment: createComment2,
  getTaskComments: getTaskComments2,
  updateComment: updateComment2,
  deleteComment: deleteComment2
};

// src/app/module/taskComment/taskComment.validation.ts
import { z as z18 } from "zod";
var createCommentSchema = z18.object({
  body: z18.object({
    content: z18.string().min(1, "Comment content cannot be empty").max(1e3)
  })
});
var updateCommentSchema = z18.object({
  body: z18.object({
    content: z18.string().min(1, "Updated content cannot be empty").max(1e3)
  })
});
var TaskCommentValidation = {
  createCommentSchema,
  updateCommentSchema
};

// src/app/module/taskComment/taskComment.route.ts
var router19 = Router19();
router19.post(
  "/:taskId",
  checkAuth(),
  validateRequest(TaskCommentValidation.createCommentSchema),
  TaskCommentController.createComment
);
router19.get("/:taskId", checkAuth(), TaskCommentController.getTaskComments);
router19.patch(
  "/:taskId/:commentId",
  checkAuth(),
  validateRequest(TaskCommentValidation.updateCommentSchema),
  TaskCommentController.updateComment
);
router19.delete(
  "/:taskId/:commentId",
  checkAuth(),
  TaskCommentController.deleteComment
);
var TaskCommentRoutes = router19;

// src/app/module/user/user.route.ts
import { Router as Router20 } from "express";

// src/app/module/user/user.controller.ts
import httpStatus25 from "http-status";

// src/app/module/user/user.service.ts
import httpStatus24 from "http-status";
var getMyProfile = async (requestUser) => {
  const user = await prisma.user.findUnique({
    where: { id: requestUser.userId },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      emailVerified: true,
      status: true,
      needPasswordChange: true,
      isDeleted: true,
      createdAt: true,
      updatedAt: true,
      memberships: {
        include: {
          organization: { select: { id: true, name: true, slug: true } },
          role: { select: { id: true, name: true } }
        }
      },
      ownedOrganizations: {
        select: { id: true, name: true, slug: true }
      }
    }
  });
  if (!user) {
    throw new AppError_default(httpStatus24.NOT_FOUND, "User not found");
  }
  if (user.isDeleted) {
    throw new AppError_default(httpStatus24.GONE, "This account has been deleted");
  }
  return user;
};
var updateMyProfile = async (requestUser, payload) => {
  const user = await prisma.user.findUnique({
    where: { id: requestUser.userId }
  });
  if (!user) {
    throw new AppError_default(httpStatus24.NOT_FOUND, "User not found");
  }
  if (user.isDeleted) {
    throw new AppError_default(httpStatus24.GONE, "This account has been deleted");
  }
  const updatedUser = await prisma.user.update({
    where: { id: requestUser.userId },
    data: {
      ...payload.name !== void 0 && { name: payload.name },
      ...payload.image !== void 0 && { image: payload.image }
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      emailVerified: true,
      status: true,
      updatedAt: true
    }
  });
  return updatedUser;
};
var changeOwnPassword = async (requestUser, payload, sessionToken) => {
  const session = await auth.api.getSession({
    headers: new Headers({ Authorization: `Bearer ${sessionToken}` })
  });
  if (!session?.user) {
    throw new AppError_default(
      httpStatus24.UNAUTHORIZED,
      "Session is invalid or expired"
    );
  }
  const { currentPassword, newPassword } = payload;
  if (currentPassword === newPassword) {
    throw new AppError_default(
      httpStatus24.BAD_REQUEST,
      "New password must be different from your current password"
    );
  }
  await auth.api.changePassword({
    body: { currentPassword, newPassword, revokeOtherSessions: true },
    headers: new Headers({ Authorization: `Bearer ${sessionToken}` })
  });
  if (session.user.needPasswordChange) {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { needPasswordChange: false }
    });
  }
  const tokenPayload = {
    userId: session.user.id,
    name: session.user.name,
    email: session.user.email,
    status: session.user.status,
    isDeleted: session.user.isDeleted,
    emailVerified: session.user.emailVerified
  };
  return {
    accessToken: tokenUtils.getAccessToken(tokenPayload),
    refreshToken: tokenUtils.getRefreshToken(tokenPayload),
    sessionToken
  };
};
var deleteMyAccount = async (requestUser) => {
  const user = await prisma.user.findUnique({
    where: { id: requestUser.userId }
  });
  if (!user) {
    throw new AppError_default(httpStatus24.NOT_FOUND, "User not found");
  }
  if (user.isDeleted) {
    throw new AppError_default(httpStatus24.GONE, "Account has already been deleted");
  }
  await prisma.$transaction([
    prisma.user.update({
      where: { id: requestUser.userId },
      data: {
        isDeleted: true,
        deletedAt: /* @__PURE__ */ new Date(),
        status: UserStatus.DELETED
      }
    }),
    prisma.session.deleteMany({
      where: { userId: requestUser.userId }
    })
  ]);
};
var getAllUsers = async (filters) => {
  const { page = 1, limit = 10, status: status25, search } = filters;
  const skip = (page - 1) * limit;
  const where = { isDeleted: false };
  if (status25) {
    where.status = status25;
  }
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } }
    ];
  }
  const [data, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        status: true,
        memberships: {
          include: {
            organization: { select: { id: true, name: true, slug: true } },
            role: { select: { id: true, name: true } }
          }
        },
        emailVerified: true,
        needPasswordChange: true,
        createdAt: true,
        updatedAt: true
      }
    }),
    prisma.user.count({ where })
  ]);
  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};
var getUserById = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      status: true,
      emailVerified: true,
      needPasswordChange: true,
      isDeleted: true,
      deletedAt: true,
      createdAt: true,
      updatedAt: true,
      memberships: {
        include: {
          organization: { select: { id: true, name: true, slug: true } },
          role: { select: { id: true, name: true } }
        }
      },
      ownedOrganizations: {
        select: { id: true, name: true, slug: true }
      }
    }
  });
  if (!user) {
    throw new AppError_default(httpStatus24.NOT_FOUND, "User not found");
  }
  return user;
};
var updateUserStatus = async (userId, payload) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new AppError_default(httpStatus24.NOT_FOUND, "User not found");
  }
  if (user.isDeleted) {
    throw new AppError_default(
      httpStatus24.GONE,
      "Cannot change status of a deleted account"
    );
  }
  if (user.status === payload.status) {
    throw new AppError_default(
      httpStatus24.BAD_REQUEST,
      `User status is already ${payload.status}`
    );
  }
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { status: payload.status },
    select: {
      id: true,
      name: true,
      email: true,
      status: true,
      updatedAt: true
    }
  });
  return updatedUser;
};
var forcePasswordChange = async (userId) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new AppError_default(httpStatus24.NOT_FOUND, "User not found");
  }
  if (user.isDeleted) {
    throw new AppError_default(httpStatus24.GONE, "Cannot update a deleted account");
  }
  if (user.needPasswordChange) {
    throw new AppError_default(
      httpStatus24.BAD_REQUEST,
      "User is already required to change their password"
    );
  }
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { needPasswordChange: true },
    select: {
      id: true,
      name: true,
      email: true,
      needPasswordChange: true,
      updatedAt: true
    }
  });
  return updatedUser;
};
var hardDeleteUser = async (userId) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new AppError_default(httpStatus24.NOT_FOUND, "User not found");
  }
  await prisma.user.delete({ where: { id: userId } });
};
var UserService = {
  getMyProfile,
  updateMyProfile,
  changeOwnPassword,
  deleteMyAccount,
  getAllUsers,
  getUserById,
  updateUserStatus,
  forcePasswordChange,
  hardDeleteUser
};

// src/app/module/user/user.controller.ts
var getMyProfile2 = catchAsync(async (req, res) => {
  const result = await UserService.getMyProfile(req.user);
  sendResponse(res, {
    httpStatusCode: httpStatus25.OK,
    success: true,
    message: "Profile fetched successfully",
    data: result
  });
});
var updateMyProfile2 = catchAsync(async (req, res) => {
  const result = await UserService.updateMyProfile(req.user, req.body);
  sendResponse(res, {
    httpStatusCode: httpStatus25.OK,
    success: true,
    message: "Profile updated successfully",
    data: result
  });
});
var changeOwnPassword2 = catchAsync(async (req, res) => {
  const sessionToken = req.cookies["better-auth.session_token"];
  const result = await UserService.changeOwnPassword(
    req.user,
    req.body,
    sessionToken
  );
  const { accessToken, refreshToken: refreshToken3, sessionToken: newSessionToken } = result;
  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken3);
  tokenUtils.setBetterAuthSessionCookie(res, newSessionToken);
  sendResponse(res, {
    httpStatusCode: httpStatus25.OK,
    success: true,
    message: "Password changed successfully",
    data: { accessToken, refreshToken: refreshToken3 }
  });
});
var deleteMyAccount2 = catchAsync(async (req, res) => {
  await UserService.deleteMyAccount(req.user);
  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "none"
  };
  CookieUtils.clearCookie(res, "accessToken", cookieOptions);
  CookieUtils.clearCookie(res, "refreshToken", cookieOptions);
  CookieUtils.clearCookie(res, "better-auth.session_token", cookieOptions);
  sendResponse(res, {
    httpStatusCode: httpStatus25.OK,
    success: true,
    message: "Account deleted successfully",
    data: null
  });
});
var getAllUsers2 = catchAsync(async (req, res) => {
  const filters = {
    page: Number(req.query.page) || 1,
    limit: Number(req.query.limit) || 10,
    status: req.query.status,
    search: req.query.search
  };
  const result = await UserService.getAllUsers(filters);
  sendResponse(res, {
    httpStatusCode: httpStatus25.OK,
    success: true,
    message: "Users fetched successfully",
    data: result
  });
});
var getUserById2 = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const result = await UserService.getUserById(userId);
  sendResponse(res, {
    httpStatusCode: httpStatus25.OK,
    success: true,
    message: "User fetched successfully",
    data: result
  });
});
var updateUserStatus2 = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const result = await UserService.updateUserStatus(userId, req.body);
  sendResponse(res, {
    httpStatusCode: httpStatus25.OK,
    success: true,
    message: "User status updated successfully",
    data: result
  });
});
var forcePasswordChange2 = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const result = await UserService.forcePasswordChange(userId);
  sendResponse(res, {
    httpStatusCode: httpStatus25.OK,
    success: true,
    message: "User will be required to change their password on next login",
    data: result
  });
});
var hardDeleteUser2 = catchAsync(async (req, res) => {
  const { userId } = req.params;
  await UserService.hardDeleteUser(userId);
  sendResponse(res, {
    httpStatusCode: httpStatus25.OK,
    success: true,
    message: "User permanently deleted",
    data: null
  });
});
var UserController = {
  getMyProfile: getMyProfile2,
  updateMyProfile: updateMyProfile2,
  changeOwnPassword: changeOwnPassword2,
  deleteMyAccount: deleteMyAccount2,
  getAllUsers: getAllUsers2,
  getUserById: getUserById2,
  updateUserStatus: updateUserStatus2,
  forcePasswordChange: forcePasswordChange2,
  hardDeleteUser: hardDeleteUser2
};

// src/app/module/user/user.validation.ts
import { z as z19 } from "zod";
var passwordField = z19.string("Password is required").min(8, "Password must be at least 8 characters").max(64, "Password must not exceed 64 characters").regex(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
  "Password must include uppercase, lowercase, and a number"
);
var updateProfileSchema = z19.object({
  body: z19.object({
    name: z19.string().min(2, "Name must be at least 2 characters").max(80, "Name must not exceed 80 characters").trim().optional(),
    image: z19.string().url("Image must be a valid URL").optional()
  })
});
var changeOwnPasswordSchema = z19.object({
  body: z19.object({
    currentPassword: z19.string("Current password is required").min(1),
    newPassword: passwordField
  }).refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must differ from the current password",
    path: ["newPassword"]
  })
});
var updateUserStatusSchema = z19.object({
  body: z19.object({
    status: z19.enum(["ACTIVE", "INACTIVE", "BLOCKED"], {
      required_error: "Status is required",
      message: "Status must be ACTIVE, INACTIVE, or BLOCKED"
    })
  })
});
var UserValidation = {
  updateProfileSchema,
  changeOwnPasswordSchema,
  updateUserStatusSchema
};

// src/app/module/user/user.route.ts
var router20 = Router20();
router20.get("/me", checkAuth(), UserController.getMyProfile);
router20.patch(
  "/me",
  checkAuth(),
  validateRequest(UserValidation.updateProfileSchema),
  UserController.updateMyProfile
);
router20.patch(
  "/me/change-password",
  checkAuth(),
  validateRequest(UserValidation.changeOwnPasswordSchema),
  UserController.changeOwnPassword
);
router20.delete("/me", checkAuth(), UserController.deleteMyAccount);
router20.get("/", checkAuth(), UserController.getAllUsers);
router20.get("/:userId", checkAuth(), UserController.getUserById);
router20.patch(
  "/:userId/status",
  checkAuth(),
  validateRequest(UserValidation.updateUserStatusSchema),
  UserController.updateUserStatus
);
router20.patch(
  "/:userId/force-password",
  checkAuth(),
  UserController.forcePasswordChange
);
router20.delete("/:userId", checkAuth(), UserController.hardDeleteUser);
var UserRoutes = router20;

// src/app/routes/index.ts
var router21 = Router21();
router21.use("/auth", AuthRoutes);
router21.use("/invitation", InvitationRoutes);
router21.use("/activity-log", ActivityLogRoutes);
router21.use("/api-key", ApiKeyRoutes);
router21.use("/file", FileRoutes);
router21.use("/invoice", InvoiceRoutes);
router21.use("/label", LabelRoutes);
router21.use("/membership", MembershipRoutes);
router21.use("/notification", NotificationRoutes);
router21.use("/organization", OrganizationRoutes);
router21.use("/permission", PermissionRoutes);
router21.use("/plan", PlanRoutes);
router21.use("/project", ProjectRoutes);
router21.use("/project-member", ProjectMemberRoutes);
router21.use("/role", RoleRoutes);
router21.use("/subscription", SubscriptionRoutes);
router21.use("/task", TaskRoutes);
router21.use("/task-attachment", TaskAttachmentRoutes);
router21.use("/task-comment", TaskCommentRoutes);
router21.use("/user", UserRoutes);
var IndexRoutes = router21;

// src/app.ts
var app = express();
app.post(
  "/api/v1/subscription/webhook",
  express.raw({ type: "application/json" }),
  SubscriptionController.handleWebhook
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.set("query parser", (str) => qs.parse(str));
app.set("view engine", "ejs");
app.set("views", path3.resolve(process.cwd(), `src/app/templates`));
app.use(
  cors({
    origin: [
      envVars.FRONTEND_URL,
      envVars.BETTER_AUTH_URL,
      "http://localhost:3000",
      "http://localhost:5000"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);
app.use("/api/auth", toNodeHandler(auth));
app.use("/uploads", express.static(path3.join(process.cwd(), "uploads")));
app.use("/api/v1", IndexRoutes);
app.get("/", async (req, res) => {
  res.status(201).json({
    success: true,
    message: "API is working"
  });
});
app.use(notFound);
app.use(globalErrorHandler);
var app_default = app;

// src/server.ts
var bootstrap = async () => {
  try {
    app_default.listen(envVars.PORT, () => {
      console.log(`Server is running on http://localhost:${envVars.PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
};
bootstrap();
