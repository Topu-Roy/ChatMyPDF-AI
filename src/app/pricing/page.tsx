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
                <div className=""></div>
            </MaxWidthWrapper>
        </>
    )
}

export default PricingPage