import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import React from 'react'
import { pricingItems } from './pricingOptions'
import { PLANS } from '@/lib/constConfig/stripe'
import { cn } from '@/lib/utils'
import { ArrowRight, Check, HelpCircle, Minus } from 'lucide-react'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import UpgradeButton from '@/components/UpgradeButton'

type Props = {}

function PricingPage({ }: Props) {

    const { getUser } = getKindeServerSession()
    const user = getUser()

    return (
        <>
            <MaxWidthWrapper className='mb-8 mt-24 text-center max-w-5xl'>
                <div className="mx-auto mb10\ sm:max-w-lg">
                    <h1 className='text-6xl font-bold sm:text-7xl'>
                        Pricing
                    </h1>
                    <p className="mt-5 text-gray-600 sm:text-lg">
                        Whether you&apos;re just trying out our service or
                        need more, we&apos;ve got you covered.
                    </p>
                </div>

                <div className="pt-12 grid grid-cols-1 gap-10 lg:grid-cols-2">
                    <TooltipProvider>
                        {pricingItems.map(({ plan, tagline, quota, features }) => {
                            const price = PLANS.find((p) => p.slug === plan.toLowerCase())?.price.amount || 0;

                            return (
                                <div
                                    key={plan}
                                    className={cn('relative rounded-2xl bg-white shadow-lg', {
                                        'border-2 border-blue-600 shadow-blue-200': plan === 'Pro',
                                        'border border-gray-200': plan !== 'Pro'
                                    })}
                                >
                                    {plan === 'Pro' ? (
                                        <div className="absolute -top-5 left-0 right-0 mx-auto w-32 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 px-3 py-2 text-sm font-medium text-white">
                                            <span>Upgrade now!</span>
                                        </div>
                                    ) : null}

                                    <div className="p-5">
                                        <h3 className="my-3 text-center font-display text-3xl font-bold">
                                            {plan}
                                        </h3>
                                        <p className="text-gray-500">
                                            {tagline}
                                        </p>
                                        <p className='py-5 font-display text-6xl font-semibold'>
                                            ${price}
                                        </p>
                                        <p className="text-gray-500">
                                            per month
                                        </p>
                                    </div>

                                    <div className="flex h-20 items-center justify-center border-b border-t border-gray-200 bg-gray-50">
                                        <p>{quota.toLocaleString()} PDFs /month included</p>

                                        <Tooltip delayDuration={200}>
                                            <TooltipTrigger>
                                                <HelpCircle className='h-4 w-4 ml-1.5 text-zinc-500' />
                                            </TooltipTrigger>
                                            <TooltipContent className='w-85 p-2'>
                                                How many PDFs you can upload in one month.
                                            </TooltipContent>
                                        </Tooltip>
                                    </div>

                                    <ul className="my-10 space-y-5 px-8">
                                        {features.map(({ text, footnote, negative }) => (
                                            <li className="flex space-x-5">
                                                <div className="flex-shrink-0">
                                                    {negative ? (
                                                        <Minus className='h-6 w-6 text-gray-300' />
                                                    ) : (
                                                        <Check className='h-6 w-6 text-blue-500' />
                                                    )}
                                                </div>

                                                {footnote ? (
                                                    <div className="flex items-center space-x-1">
                                                        <p
                                                            className={cn('text-gray-400', {
                                                                'text-gray-600': negative
                                                            })}
                                                        >
                                                            {text}
                                                        </p>

                                                        <Tooltip delayDuration={200}>
                                                            <TooltipTrigger>
                                                                <HelpCircle className='h-4 w-4 ml-1.5 text-zinc-500' />
                                                            </TooltipTrigger>
                                                            <TooltipContent className='w-85 p-2'>
                                                                {footnote}
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </div>
                                                ) : (
                                                    <p
                                                        className={cn('text-gray-400', {
                                                            'text-gray-600': negative
                                                        })}
                                                    >
                                                        {text}
                                                    </p>
                                                )}
                                            </li>
                                        ))}

                                        <div className='border-t border-gray-200' />
                                        <div className="p-5">
                                            {plan === 'Free' ? (
                                                <Link
                                                    href={user ? '/dashboard' : '/sign-in'}
                                                    className={buttonVariants({
                                                        className: 'w-full',
                                                    })}
                                                >
                                                    {user ? 'Dashboard' : 'Get started for free'}
                                                    <ArrowRight className='h-5 w-5 ml-1.5' />
                                                </Link>
                                            ) : user ? (
                                                <UpgradeButton />
                                            ) : (
                                                <Link
                                                    href={'/sign-in'}
                                                    className={buttonVariants({
                                                        className: 'w-full bg-blue-500',
                                                    })}
                                                >
                                                    Continue
                                                    <ArrowRight className='h-5 w-5 ml-1.5' />
                                                </Link>
                                            )}
                                        </div>
                                    </ul>
                                </div>
                            )
                        })}
                    </TooltipProvider>
                </div>
            </MaxWidthWrapper>
        </>
    )
}

export default PricingPage