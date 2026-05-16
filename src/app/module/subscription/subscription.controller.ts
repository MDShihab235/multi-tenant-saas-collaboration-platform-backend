// ============================================================
//  Subscription Module — Controller
// ============================================================

import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { SubscriptionService } from "./subscription.service";
import Stripe from "stripe";
import { stripe } from "../../config/stripe.config";

const subscribe = catchAsync(async (req: Request, res: Response) => {
  const result = await SubscriptionService.subscribe(
    req.user.userId,
    req.params.orgId as string,
    req.body,
  );
  sendResponse(res, {
    httpStatusCode: httpStatus.CREATED,
    success: true,
    message: "Subscription created successfully",
    data: result,
  });
});

const handleWebhook = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"];

  if (!sig) {
    console.error("❌ Webhook Error: No Stripe signature found in headers.");
    return res.status(400).send("No Stripe signature");
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body, // The raw buffer
      sig as string,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err: any) {
    // BUG FIX: If you see this error in your console, your Webhook Secret in .env is WRONG.
    console.error(`❌ Webhook Signature Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log(`✅ Webhook Received: ${event.type}`);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    console.log("ℹ️ Session Metadata received:", session.metadata);

    try {
      // Execute the DB transaction
      await SubscriptionService.handleSuccessfulSubscription(session);
      console.log("🚀 SUCCESS: Subscription and Invoice saved to Database!");
    } catch (err: any) {
      // BUG FIX: If the DB fails (e.g., foreign key error, missing orgId), it logs here.
      console.error("❌ Database sync failed in webhook:", err.message || err);
      return res.status(500).json({ error: "Webhook DB handler failed" });
    }
  }

  // Acknowledge receipt to Stripe
  res.json({ received: true });
};

const getSubscription = catchAsync(async (req: Request, res: Response) => {
  const result = await SubscriptionService.getSubscription(
    req.params.orgId as string,
  );
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Subscription retrieved",
    data: result,
  });
});

const getUsage = catchAsync(async (req: Request, res: Response) => {
  const result = await SubscriptionService.getUsage(req.params.orgId as string);
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Usage metrics retrieved",
    data: result,
  });
});

const upgradeSubscription = catchAsync(async (req: Request, res: Response) => {
  const result = await SubscriptionService.upgradeSubscription(
    req.user.userId,
    req.params.orgId as string,
    req.body.planId,
  );
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Subscription upgraded successfully",
    data: result,
  });
});

const downgradeSubscription = catchAsync(
  async (req: Request, res: Response) => {
    const result = await SubscriptionService.downgradeSubscription(
      req.user.userId,
      req.params.orgId as string,
      req.body.planId,
    );
    sendResponse(res, {
      httpStatusCode: httpStatus.OK,
      success: true,
      message: "Subscription downgraded successfully",
      data: result,
    });
  },
);

const changeBillingCycle = catchAsync(async (req: Request, res: Response) => {
  const result = await SubscriptionService.changeBillingCycle(
    req.user.userId,
    req.params.orgId as string,
    req.body.billingCycle,
  );
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Billing cycle updated",
    data: result,
  });
});

const cancelSubscription = catchAsync(async (req: Request, res: Response) => {
  const result = await SubscriptionService.cancelSubscription(
    req.user.userId,
    req.params.orgId as string,
  );
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Subscription scheduled for cancellation",
    data: result,
  });
});

const reactivateSubscription = catchAsync(
  async (req: Request, res: Response) => {
    const result = await SubscriptionService.reactivateSubscription(
      req.user.userId,
      req.params.orgId as string,
    );
    sendResponse(res, {
      httpStatusCode: httpStatus.OK,
      success: true,
      message: "Subscription reactivated",
      data: result,
    });
  },
);

export const SubscriptionController = {
  subscribe,
  handleWebhook,
  getSubscription,
  getUsage,
  upgradeSubscription,
  downgradeSubscription,
  changeBillingCycle,
  cancelSubscription,
  reactivateSubscription,
};
