"use client";

import { type SubscriptionPlanType } from "@/types/subscription-form";
import React from "react";
import { useToast } from "./ui/use-toast";
import { trpc } from "@/app/_trpc/client";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";

function BillingForm({ subscriptionPlan }: SubscriptionPlanType) {
  const { toast } = useToast();

  const { mutate: createStripeSession, isLoading } =
    trpc.createStripeSession.useMutation({
      onSuccess: ({ url }) => {
        if (url) {
          window.location.href = url;
        } else {
          toast({
            title: "Something went wrong...",
            description: "Please try again in a moment",
            variant: "destructive",
          });
        }
      },
    });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    createStripeSession();
  }

  return (
    <MaxWidthWrapper className="max-w-5xl">
      <form className="mt-12" onSubmit={handleSubmit}>
        <Card className="space-y-4 py-4 sm:px-8">
          <CardContent>
            <h2 className="text-3xl font-bold">Subscription Plan</h2>
            <p className="">
              You are currently on the{" "}
              <strong className="mr-1.5">{subscriptionPlan.name}</strong>
              plan.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col items-start justify-between space-y-2 sm:flex-row md:space-x-0">
            <Button type="submit">
              {isLoading ? (
                <Loader2 className="mr-4 h-4 w-4 animate-spin" />
              ) : null}
              {subscriptionPlan.isSubscribed
                ? "Manage Subscription"
                : "Upgrade to Pro plan"}
            </Button>

            {subscriptionPlan.isSubscribed ? (
              <p className="rounded-full text-sm font-medium">
                {subscriptionPlan.isCanceled
                  ? `Your Subscription will be canceled on `
                  : `Your Subscription will be renewed on `}
                <strong>
                  {format(
                    new Date(subscriptionPlan.stripeCurrentPeriodEnd!),
                    "dd/mm/yyyy",
                  )}
                </strong>
              </p>
            ) : null}
          </CardFooter>
        </Card>
      </form>
    </MaxWidthWrapper>
  );
}

export default BillingForm;
