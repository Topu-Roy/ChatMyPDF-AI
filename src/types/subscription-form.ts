import { type getUserSubscriptionPlanType } from "@/lib/stripe";

export type SubscriptionPlanType = {
  subscriptionPlan: getUserSubscriptionPlanType;
};
