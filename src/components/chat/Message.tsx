import { cn } from '@/lib/utils'
import { MessageType } from '@/types/message'
import React from 'react'

type Props = {
    message: MessageType,
    isMessageSamePerson: boolean
}

function Message({ message, isMessageSamePerson }: Props) {
    return (
        <div className={cn('flex items-end')}>

        </div>
    )
}

export default Message;