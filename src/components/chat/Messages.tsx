import { trpc } from "@/app/_trpc/client";
import { INFINITE_QUERY_DEFAULT_LIMIT } from "@/lib/constConfig/infinite-query";
import { Loader2, MessageSquare } from "lucide-react";
import React from "react";
import Message from "./Message";
import { Skeleton } from "../ui/skeleton";

type Props = {
    fileId: string;
};

function Messages({ fileId }: Props) {
    const { data, isLoading } = trpc.getFileMessages.useInfiniteQuery(
        {
            fileId,
            limit: INFINITE_QUERY_DEFAULT_LIMIT,
        },
        {
            getNextPageParam: ({ nextCursor }) => nextCursor,
            keepPreviousData: true,
        }
    );

    //* used flatMap to get all message in same level [][] => []
    const messages = data?.pages.flatMap((msg) => msg.messages);

    const loadingMessage = {
        id: "loading-message",
        createdAt: new Date().toISOString(),
        isUserMessage: false,
        text: (
            //* Mock Ai is loading
            <span className="flex h-full justify-center items-center">
                <Loader2 className="h-4 w-4 animate-spin" />
            </span>
        ),
    };

    //* Insert the loading indicator if necessary
    //* Into the message array
    const messagesWithLoadingState = [
        ...(true ? [loadingMessage] : []),
        ...(messages ?? []),
    ];

    return (
        <div className="flex flex-1 max-h-[calc(100vh-3.5rem-7rem)] border-zinc-200 flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">
            {messagesWithLoadingState && messagesWithLoadingState.length > 0 ? (
                messagesWithLoadingState.map((message, i) => {
                    const isNextMessageFromSamePerson =
                        messagesWithLoadingState[i - 1]?.isUserMessage ===
                        messagesWithLoadingState[i]?.isUserMessage;

                    if (i === messagesWithLoadingState.length - 1) {
                        return (
                            <Message
                                message={message}
                                isNextMessageFromSamePerson={isNextMessageFromSamePerson}
                                key={message.id}
                            />
                        );
                    } else {
                        return (
                            <Message
                                message={message}
                                isNextMessageFromSamePerson={isNextMessageFromSamePerson}
                                key={message.id}
                            />
                        );
                    }
                })
            ) : isLoading ? (
                <div className="w-full flex flex-col gap-2">
                    <Skeleton className="h-16" />
                    <Skeleton className="h-16" />
                    <Skeleton className="h-16" />
                    <Skeleton className="h-16" />
                </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center gap-2">
                    <MessageSquare className="h-8 w-8 text-blue-500" />
                    <h3 className="font-semibold text-xl">You&apos;re all set!!</h3>
                    <p className="text-zinc-500 text-sm">
                        Ask any question about this PDF
                    </p>
                </div>
            )}
        </div>
    );
}

export default Messages;
