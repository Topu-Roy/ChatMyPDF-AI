import { cn } from '@/lib/utils'
import { MessageType } from '@/types/message'
import React from 'react'

type Props = {
    message: MessageType,
    isNextMessageFromSamePerson: boolean
}

function Message({ message, isNextMessageFromSamePerson }: Props) {
    return (
        <div className={cn('flex items-end', {
            'justify-end': message.isUserMessage
        })}>
            <div className={cn('relative flex h-6 w-6 aspect-square items-center justify-center rounded-sm', {
                'order-2 bg-blue-600': message.isUserMessage,
                'order-1 bg-zinc-800': !message.isUserMessage,
                invisible: isNextMessageFromSamePerson
            })}></div>
        </div>
    )
}

export default Message;