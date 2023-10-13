'use client'

import { SubscriptionPlanType } from '@/types/subscription-form';
import React from 'react'
import { useToast } from './ui/use-toast';
import { trpc } from '@/app/_trpc/client';
import MaxWidthWrapper from './MaxWidthWrapper';
import { Card, CardContent, CardFooter, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Loader, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

function BillingForm({ subscriptionPlan }: SubscriptionPlanType) {
    const { toast } = useToast()

    const { mutate: createStripeSession, isLoading } = trpc.createStripeSession.useMutation({
        onSuccess: ({ url }) => {
            if (url) {
                window.location.href = url
            } else {
                toast({
                    title: "Something went wrong...",
                    description: "Please try again in a moment",
                    variant: "destructive"
                })
            }
        }
    })

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        createStripeSession()
    }

    return (
        <MaxWidthWrapper className='max-w-5xl'>
            <form className='mt-12' onSubmit={handleSubmit}>
                <Card>
                    <CardTitle>Subscription Plan</CardTitle>
                    <CardContent>
                        You are currently on the {' '}
                        <strong>{subscriptionPlan.name}</strong>
                        plan.
                    </CardContent>
                    <CardFooter className='flex flex-col items-start space-y-2 md:flex-row justify-between md:space-x-0' >
                        <Button type='submit'>
                            {isLoading ? (
                                <Loader2 className='mr-4 h-4 w-4 animate-spin' />
                            ) : null}
                            {subscriptionPlan.isSubscribed ? "Manage Subscription" : "Upgrade to Pro plan"}
                        </Button>

                        {subscriptionPlan.isSubscribed ? (
                            <p className='rounded-full text-sm font-medium'>
                                {
                                    subscriptionPlan.isCanceled
                                        ? "Your Subscription will be canceled on "
                                        : "Your Subscription will be renewed on "
                                }
                            </p>
                        ) : null}
                        {format(subscriptionPlan.stripeCurrentPeriodEnd!, 'dd.mm.yyyy')}
                    </CardFooter>
                </Card>
            </form>
        </MaxWidthWrapper>
    )
}

export default BillingForm;