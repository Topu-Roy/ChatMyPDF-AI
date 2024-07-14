import { cn } from "@/lib/utils";
import { type MessageType } from "@/types/message";
import { forwardRef } from "react";
import { Icons } from "../MyIcons";
import ReactMarkdown from "react-markdown";
import { format } from "date-fns";

type Props = {
  message: MessageType;
  isNextMessageFromSamePerson: boolean;
};

const Message = forwardRef<HTMLDivElement, Props>(
  ({ message, isNextMessageFromSamePerson }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex items-end gap-1.5", {
          "justify-end": message.isUserMessage,
        })}
      >
        <div
          className={cn(
            "relative flex aspect-square h-6 w-6 items-center justify-center rounded-sm",
            {
              "order-2 bg-blue-600": message.isUserMessage,
              "bg-zinc-800": !message.isUserMessage,
              invisible: isNextMessageFromSamePerson,
            },
          )}
        >
          {message.isUserMessage ? (
            <Icons.user className="h-3/4 w-3/4 fill-zinc-200 text-zinc-200" />
          ) : (
            <Icons.logo className="h-3/4 w-3/4 fill-zinc-200 text-zinc-200" />
          )}
        </div>

        <div
          className={cn("inline-block rounded-lg px-4 py-2", {
            "bg-blue-600 text-white": message.isUserMessage,
            "bg-gray-200 text-gray-900": !message.isUserMessage,
            "rounded-br-none":
              isNextMessageFromSamePerson && message.isUserMessage,
            "rounded-bl-none":
              isNextMessageFromSamePerson && !message.isUserMessage,
          })}
        >
          {message.text === "string" ? (
            <ReactMarkdown
              className={cn("prose", {
                "text-zinc-50": message.isUserMessage,
              })}
            >
              {message.text}
            </ReactMarkdown>
          ) : (
            message.text
          )}

          {message.id !== "loading-message" ? (
            <div
              className={cn("mt-2 w-full select-none text-right text-xs", {
                "text-zinc-500": !message.isUserMessage,
                "text-blue-300": message.isUserMessage,
              })}
            >
              {format(new Date(message.createdAt), "HH:mm")}
            </div>
          ) : null}
        </div>
      </div>
    );
  },
);

Message.displayName = "Message";

export default Message;
