import BillingForm from '@/components/BillingForm'
import { getUserSubscriptionPlan } from '@/lib/stripe'
import React from 'react'

type Props = {}

async function BillingPage({ }: Props) {

    const subscriptionPlan = await getUserSubscriptionPlan()

    return (
        <BillingForm subscriptionPlan={subscriptionPlan} />
    )
}

export default BillingPage;