// ============================================================
//  Auth Middleware — checkAuth
//  Project : Multi-Tenant SaaS Collaboration Platform
//  Path    : src/app/middleware/checkAuth.ts
// ============================================================

import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { UserStatus } from "../../generated/prisma/enums";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppError";
import { prisma } from "../lib/prisma";
import { CookieUtils } from "../utils/cookie";
import { jwtUtils } from "../utils/jwt";

export const checkAuth =
  () => async (req: Request, res: Response, next: NextFunction) => {
    try {
      // 1. Get Session Token from Better-Auth Cookies
      const sessionToken = CookieUtils.getCookie(
        req,
        "better-auth.session_token",
      );

      // 2. Get Access Token from custom cookies (for extra API security)
      const accessToken = CookieUtils.getCookie(req, "accessToken");

      if (!sessionToken && !accessToken) {
        throw new AppError(
          httpStatus.UNAUTHORIZED,
          "Authentication required. Please log in.",
        );
      }

      let userId: string | null = null;

      // ── Primary Check: Session Token ───────────────────────────
      if (sessionToken) {
        const sessionData = await prisma.session.findUnique({
          where: { token: sessionToken },
          include: { user: true },
        });

        if (!sessionData || new Date(sessionData.expiresAt) < new Date()) {
          throw new AppError(
            httpStatus.UNAUTHORIZED,
            "Session expired or invalid.",
          );
        }

        userId = sessionData.userId;
        req.user = {
          userId: sessionData.user.id,
          email: sessionData.user.email,
          name: sessionData.user.name || "",
        };
      }
      // ── Secondary Check: JWT Access Token ──────────────────────
      else if (accessToken) {
        const verified = jwtUtils.verifyToken(
          accessToken,
          envVars.ACCESS_TOKEN_SECRET,
        );
        if (!verified.success) {
          throw new AppError(httpStatus.UNAUTHORIZED, "Invalid access token.");
        }
        userId = verified.data!.userId;
        req.user = verified.data;
      }

      // ── Critical Status Check: Is user ACTIVE? ──────────────────
      if (userId) {
        const userStatus = await prisma.user.findUnique({
          where: { id: userId },
          select: { status: true, isDeleted: true },
        });

        if (!userStatus || userStatus.isDeleted) {
          throw new AppError(
            httpStatus.UNAUTHORIZED,
            "This account has been deleted.",
          );
        }

        if (userStatus.status === UserStatus.BLOCKED) {
          throw new AppError(
            httpStatus.FORBIDDEN,
            "Your account has been blocked. Contact support.",
          );
        }

        if (userStatus.status === UserStatus.INACTIVE) {
          throw new AppError(
            httpStatus.FORBIDDEN,
            "Please verify your email to activate your account.",
          );
        }
      }

      next();
    } catch (error) {
      next(error);
    }
  };
