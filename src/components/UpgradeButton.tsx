import React from 'react'
import { Button } from './ui/button'
import { ArrowRight } from 'lucide-react'

type Props = {}

function UpgradeButton({ }: Props) {
    return (
        <Button className='w-full'>
            Upgrade now
            <ArrowRight className='h-5 w-5 ml-1.5' />
        </Button>
    )
}

export default UpgradeButton