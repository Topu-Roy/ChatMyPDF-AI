import { AppRouter } from "@/trpc";
import { inferRouterOutputs } from "@trpc/server";

type AppRouterType = inferRouterOutputs<AppRouter>;
type MessageOutputFromTRPC = AppRouterType["getFileMessages"]["messages"];
type MessageOutputFromTRPCWithoutText = Omit<
  MessageOutputFromTRPC[number],
  "text"
>;

type CustomText = {
  text: string | JSX.Element;
};

export type MessageType = MessageOutputFromTRPCWithoutText & CustomText;
