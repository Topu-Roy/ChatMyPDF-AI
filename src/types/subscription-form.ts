import { getUserSubscriptionPlan } from "@/lib/stripe";

export type SubscriptionPlanType = {
  subscriptionPlan: Awaited<ReturnType<typeof getUserSubscriptionPlan>>;
};
