"use client";

import { type ReactNode, createContext, useRef, useState } from "react";
import { useToast } from "../ui/use-toast";
import { useMutation } from "@tanstack/react-query";
import { trpc } from "@/app/_trpc/client";
import { INFINITE_QUERY_DEFAULT_LIMIT } from "@/lib/constConfig/infinite-query";

type ChatContextTypes = {
  addMessage: () => void;
  message: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  isLoading: boolean;
};

type ChatContextProviderProps = {
  fileId: string;
  children: ReactNode;
};

export const ChatContext = createContext<ChatContextTypes>({
  message: "",
  isLoading: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  addMessage: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  handleInputChange: () => {},
});

export const ChatContextProvider = ({
  fileId,
  children,
}: ChatContextProviderProps) => {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const utils = trpc.useContext();
  const backupMessage = useRef("");

  const { mutate: sendMessage } = useMutation({
    mutationFn: async ({ message }: { message: string }) => {
      const res = await fetch("/api/message", {
        method: "POST",
        body: JSON.stringify({
          fileId,
          message,
        }),
      });

      if (!res.ok) throw new Error("Failed to send message");

      return res.body;
    },
    onMutate: async ({ message }) => {
      //* Backup old message and rollback if anythings bad happened
      backupMessage.current = message;
      setMessage("");

      //* Cancel out any other requests made to getFileMessages
      await utils.getFileMessages.cancel();

      //* Get copy of the message
      const prevMessages = utils.getFileMessages.getInfiniteData();

      //* Add new messages into the copy of the messages
      utils.getFileMessages.setInfiniteData(
        { fileId, limit: INFINITE_QUERY_DEFAULT_LIMIT },
        (oldData) => {
          if (!oldData) {
            return {
              pages: [],
              pageParams: [],
            };
          }

          const newPages = [...oldData.pages];
          const latestPage = newPages[0];

          //* Insert new message into the latest page
          if (latestPage) {
            latestPage.messages = [
              {
                id: crypto.randomUUID().toString(),
                text: message,
                createdAt: new Date().toISOString(),
                isUserMessage: true,
              },
              ...latestPage.messages,
            ];

            //* Inset the page into the whole array that contains all the pages
            newPages[0] = latestPage;

            return {
              ...oldData,
              pages: newPages,
            };
          }
        },
      );

      //* After inserting the message show the loading states
      setIsLoading(true);

      return {
        prevMessages:
          prevMessages?.pages.flatMap((page) => page.messages) ?? [],
      };
    },
    onError: (_, __, context) => {
      //* Rollback to the last message
      setMessage(backupMessage.current);

      utils.getFileMessages.setData(
        { fileId },
        { messages: context?.prevMessages ?? [] },
      );

      toast({
        title: "Something went wrong",
        description: "Please try to refresh the page or try again",
        variant: "destructive",
      });
    },
    onSettled: async () => {
      setIsLoading(false);

      //* Validate and make sure all messages are same as in database
      await utils.getFileMessages.invalidate({ fileId });
    },
    onSuccess: async (stream) => {
      setIsLoading(false);

      if (!stream) {
        return toast({
          title: "Something went wrong",
          description: "Please try to refresh the page or try again",
          variant: "destructive",
        });
      }

      const reader = stream.getReader();
      const decoder = new TextDecoder();
      let done = false;

      //* Accumulate response
      let accumulatedResponse = "";

      while (!done) {
        const { value, done: doneReading } = await reader.read();

        done = doneReading;
        const responseChunk = decoder.decode(value);
        accumulatedResponse += responseChunk;

        //* Append accumulated response chunk to the actual message
        try {
          utils.getFileMessages.setInfiniteData(
            { fileId, limit: INFINITE_QUERY_DEFAULT_LIMIT },
            (oldData) => {
              if (!oldData) return { pages: [], pageParams: [] };

              const isAIResponseCreated = oldData.pages.some((msg) =>
                msg.messages.some((msg) => msg.id === "ai_response"),
              );

              const updatedPages = oldData.pages.map((page) => {
                if (page === oldData.pages[0]) {
                  let updatedMessages;

                  if (!isAIResponseCreated) {
                    updatedMessages = [
                      {
                        createdAt: new Date().toISOString(),
                        id: "ai_response",
                        text: accumulatedResponse,
                        isUserMessage: false,
                      },
                      ...page.messages,
                    ];
                  } else {
                    updatedMessages = page.messages.map((message) => {
                      if (message.id === "ai_response") {
                        return {
                          ...message,
                          text: accumulatedResponse,
                        };
                      }
                      return message;
                    });
                  }

                  return {
                    ...page,
                    messages: updatedMessages,
                  };
                }

                return page;
              });

              return {
                ...oldData,
                pages: updatedPages,
              };
            },
          );
        } catch (error) {
          toast({
            title: "Something went wrong",
            description: "something bad happened, Please try again",
            variant: "destructive",
          });
        }
      }
    },
  });

  const addMessage = () => {
    sendMessage({ message });
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  return (
    <ChatContext.Provider
      value={{
        addMessage,
        handleInputChange,
        isLoading,
        message,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
