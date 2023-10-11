import { ReactNode, createContext, useRef, useState } from "react";
import { useToast } from "../ui/use-toast";
import { useMutation } from "@tanstack/react-query";
import { trpc } from "@/app/_trpc/client";
import { INFINITE_QUERY_DEFAULT_LIMIT } from "@/lib/constConfig/infinite-query";

type ChatContextTypes = {
    addMessage: () => void,
    message: string,
    handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void,
    isLoading: boolean
}

type ChatContextProviderProps = {
    fileId: string,
    children: ReactNode
}

export const ChatContext = createContext<ChatContextTypes>({
    addMessage: () => { },
    message: '',
    handleInputChange: () => { },
    isLoading: false
})

export const ChatContextProvider = ({ fileId, children }: ChatContextProviderProps) => {
    const [message, SetMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()

    const utils = trpc.useContext()
    const backupMessage = useRef('')

    const { mutate: sendMessage } = useMutation({
        mutationFn: async ({ message }: { message: string }) => {
            const res = await fetch('/api/message', {
                method: 'POST',
                body: JSON.stringify({
                    fileId,
                    message
                })
            })

            if (!res.ok) throw new Error('Failed to send message')

            return res.body
        },
        onMutate: async ({ message }) => {
            //* Backup old message and rollback if anythings bad happened
            backupMessage.current = message;
            SetMessage('')

            //* Cancel out any other requests made to getFileMessages 
            await utils.getFileMessages.cancel()

            //* Get copy of the message
            const prevMessages = utils.getFileMessages.getInfiniteData()

            //* Add new messages into the copy of the messages
            utils.getFileMessages.setInfiniteData(
                { fileId, limit: INFINITE_QUERY_DEFAULT_LIMIT },
                (oldData) => {
                    if (!oldData) {
                        return {
                            pages: [],
                            pageParams: [],
                        }
                    }

                    let newPages = [...oldData.pages]
                    let latestPage = newPages[0]

                    //* Insert new message into the latest page
                    latestPage.messages = [
                        {
                            id: crypto.randomUUID().toString(),
                            text: message,
                            createdAt: new Date().toISOString(),
                            isUserMessage: true,
                        },
                        ...latestPage.messages
                    ]

                    //* Inset the page into the whole array that contains all the pages
                    newPages[0] = latestPage

                    return {
                        ...oldData,
                        pages: newPages
                    }
                }
            )

            //* After inserting the message show the loading states
            setIsLoading(true)

            return {
                prevMessages: prevMessages?.pages.flatMap((page) => page.messages) ?? [],
            }
        }
    })

    const addMessage = () => {
        sendMessage({ message });
    }
    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        SetMessage(e.target.value)
    }

    return (
        <ChatContext.Provider value={{
            addMessage,
            handleInputChange,
            isLoading,
            message,
        }}>
            {children}
        </ChatContext.Provider>
    )
}