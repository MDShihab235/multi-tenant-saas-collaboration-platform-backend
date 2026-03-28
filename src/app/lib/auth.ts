// ============================================================
//  Better-Auth Configuration
//  Project : Multi-Tenant SaaS Collaboration Platform
//  Path    : src/app/lib/auth.ts
// ============================================================

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { bearer, emailOTP } from "better-auth/plugins";
import { envVars } from "../config/env";
import { prisma } from "./prisma";
import { sendEmail } from "../utils/email";

export const auth = betterAuth({
  baseURL: envVars.BETTER_AUTH_URL,
  secret: envVars.BETTER_AUTH_SECRET,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },

  // mapping the user attributes to match your schema
  user: {
    additionalFields: {
      status: { type: "string", defaultValue: "ACTIVE" },
      needPasswordChange: { type: "boolean", defaultValue: false },
      isDeleted: { type: "boolean", defaultValue: false },
    },
  },

  plugins: [
    bearer(),
    emailOTP({
      overrideDefaultEmailVerification: true,
      async sendVerificationOTP({ email, otp, type }) {
        // Fetch user and their global roles if applicable
        const user = await prisma.user.findFirst({
          where: { email },
          select: {
            id: true,
            email: true,
            name: true,
            emailVerified: true,
            // In your schema, "role" isn't a direct field, so we check memberships
            memberships: {
              include: { role: true },
            },
          },
        });

        if (!user) return;

        // Check if user has a SUPER_ADMIN role in any organization membership
        const isSuperAdmin = user.memberships.some(
          (m) => m.role.name === "SUPER_ADMIN",
        );
        if (isSuperAdmin) return;

        if (type === "email-verification" && !user.emailVerified) {
          await sendEmail({
            to: email,
            subject: "Verify your email",
            templateName: "otp",
            templateData: { name: user.name, otp },
          });
        } else if (type === "forget-password") {
          await sendEmail({
            to: email,
            subject: "Password Reset OTP",
            templateName: "otp",
            templateData: { name: user.name, otp },
          });
        }
      },
      expiresIn: 120, // 2 minutes
      otpLength: 6,
    }),
  ],

  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },

  socialProviders: {
    google: {
      clientId: envVars.GOOGLE_CLIENT_ID as string,
      clientSecret: envVars.GOOGLE_CLIENT_SECRET as string,
    },
  },

  // advanced: {
  //   useSecureCookies: false,
  //   cookies: {
  //     sessionToken: {
  //       attributes: {
  //         sameSite: "none",
  //         secure: true,
  //         httpOnly: true,
  //         path: "/",
  //       },
  //     },
  //   },
  // },
  advanced: {
    // If testing on localhost without https, set this to false
    useSecureCookies: process.env.NODE_ENV === "production",
    cookies: {
      sessionToken: {
        attributes: {
          sameSite: "lax", // Change "none" to "lax" for local development
          secure: process.env.NODE_ENV === "production",
        },
      },
    },
  },
});

// ============================================================
//  Custom OTP Wrapper Functions
// ============================================================

/**
 * Manually trigger a verification email OTP
 */
export const sendVerificationEmailOTP = async (payload: {
  body: { email: string };
}) => {
  // We cast the function to 'any' to avoid strict overload mismatching
  return await (auth.api.sendVerificationOTP as any)({
    body: {
      email: payload.body.email,
      type: "email-verification",
    },
  });
};

/**
 * Verify the OTP sent to the user's email
 */
export const verifyEmailOTP = async (payload: {
  body: { email: string; otp: string };
}) => {
  // Fix: Force the compiler to accept the payload structure required by emailOTP plugin
  return await (auth.api.verifyEmail as any)({
    body: {
      email: payload.body.email,
      otp: payload.body.otp,
    },
  });
};

/**
 * Request an OTP for password resetting
 */
export const requestPasswordResetEmailOTP = async (payload: {
  body: { email: string };
}) => {
  return await (auth.api.sendVerificationOTP as any)({
    body: {
      email: payload.body.email,
      type: "forget-password",
    },
  });
};

/**
 * Reset the user password using the verified OTP
 */
export const resetPasswordEmailOTP = async (payload: {
  body: { email: string; otp: string; password: string };
}) => {
  // NOTE: In Better-Auth Reset Password, the 'token' field is used to pass the OTP
  return await (auth.api.resetPassword as any)({
    body: {
      newPassword: payload.body.password,
      token: payload.body.otp,
    },
  });
};
