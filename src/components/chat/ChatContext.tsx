import { ReactNode, createContext, useState } from "react";
import { useToast } from "../ui/use-toast";
import { useMutation } from "@tanstack/react-query";

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
    const [isLoading, SetIsLoading] = useState(false)
    const { toast } = useToast()

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
        }
    })

    const addMessage = () => sendMessage({ message })
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