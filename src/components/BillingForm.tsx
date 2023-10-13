'use client'

import { SubscriptionPlanType } from '@/types/subscription-form';
import React from 'react'
import { useToast } from './ui/use-toast';
import { trpc } from '@/app/_trpc/client';
import MaxWidthWrapper from './MaxWidthWrapper';

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

            </form>
        </MaxWidthWrapper>
    )
}

export default BillingForm;