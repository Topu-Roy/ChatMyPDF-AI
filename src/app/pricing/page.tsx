import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import React from 'react'

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
            </MaxWidthWrapper>
        </>
    )
}

export default PricingPage