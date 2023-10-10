import { cn } from '@/lib/utils'
import { MessageType } from '@/types/message'
import React from 'react'
import { Icons } from '../MyIcons'

type Props = {
    message: MessageType,
    isNextMessageFromSamePerson: boolean
}

function Message({ message, isNextMessageFromSamePerson }: Props) {
    return (
        <div className={cn('flex items-end', {
            'justify-end': message.isUserMessage
        })}>
            <div
                className={cn('relative flex h-6 w-6 aspect-square items-center justify-center rounded-sm', {
                    'order-2 bg-blue-600': message.isUserMessage,
                    'order-1 bg-zinc-800': !message.isUserMessage,
                    invisible: isNextMessageFromSamePerson
                })}
            >
                {message.isUserMessage ? (
                    <Icons.user className='fill-zinc-200 text-zinc-200 h-3/4 w-3/4' />
                ) : (
                    <Icons.logo className='fill-zinc-200 text-zinc-200 h-3/4 w-3/4' />
                )}
            </div>

            <div
                className={cn('px-4 py-2 rounded-lg inline-block', {
                    'bg-blue-600 text-white': message.isUserMessage,
                    'bg-gray-200 text-gray-900': !message.isUserMessage,
                    'rounded-br-none': isNextMessageFromSamePerson && message.isUserMessage,
                    'rounded-bl-none': isNextMessageFromSamePerson && !message.isUserMessage,
                })}
            >
                { }
            </div>
        </div>
    )
}

export default Message;