import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { router, publicProcedure, privateProcedure } from "./trpc";
import { TRPCError } from "@trpc/server";
import { db } from "@/db";
import { z } from "zod";
import { INFINITE_QUERY_DEFAULT_LIMIT } from "@/lib/constConfig/infinite-query";
import { absoluteURL } from "@/lib/utils";
import { getUserSubscriptionPlan, stripe } from "@/lib/stripe";
import { PLANS } from "@/lib/constConfig/stripe";

export const appRouter = router({
  authCallback: publicProcedure.query(async () => {
    const { getUser } = getKindeServerSession();
    const user = getUser();

    if (!user || !user.email || !user.id) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    // * Check if the user is in the DB
    const dbUser = await db.user.findFirst({
      where: {
        kindeId: user.id,
      },
    });

    if (!dbUser) {
      // * Create a new user in database
      await db.user.create({
        data: {
          name: `${user.given_name} ${user.family_name}`,
          kindeId: user.id,
          email: user.email,
        },
      });
    }

    return { success: true };
  }),

  getUserFiles: privateProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;

    const files = await db.file.findMany({
      where: {
        kindeId: userId,
      },
    });

    return files;
  }),

  getFile: privateProcedure
    .input(z.object({ key: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;

      const file = await db.file.findFirst({
        where: {
          kindeId: userId,
          key: input.key,
        },
      });

      if (!file) throw new TRPCError({ code: "NOT_FOUND" });

      return file;
    }),

  deleteFile: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;

      const file = await db.file.findFirst({
        where: {
          id: input.id,
          kindeId: userId,
        },
      });

      if (!file) throw new TRPCError({ code: "NOT_FOUND" });

      await db.file.delete({
        where: {
          id: input.id,
        },
      });

      return { success: true };
    }),

  getFileUploadStatus: privateProcedure
    .input(z.object({ fileID: z.string() }))
    .query(async ({ input, ctx }) => {
      const file = await db.file.findFirst({
        where: {
          id: input.fileID,
          kindeId: ctx.userId,
        },
      });

      if (!file) return { status: "PENDING" as const };

      return { status: file.uploadStatus };
    }),

  getFileMessages: privateProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(), //* Nullish means optional
        fileId: z.string(),
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { userId } = ctx;
      const { fileId, cursor } = input;
      const limit = input.limit ?? INFINITE_QUERY_DEFAULT_LIMIT;

      const file = await db.file.findFirst({
        where: {
          id: fileId,
          kindeId: userId,
        },
      });

      if (!file) throw new TRPCError({ code: "NOT_FOUND" });

      const messages = await db.message.findMany({
        take: limit + 1,
        where: {
          fileId,
        },
        orderBy: {
          createdAt: "desc",
        },

        //* It's for identify the last message
        //* and fetch the next messages based on the last message
        cursor: cursor ? { id: cursor } : undefined,
        select: {
          id: true,
          isUserMessage: true,
          createdAt: true,
          text: true,
        },
      });

      let nextCursor: typeof cursor | string = undefined;
      if (messages.length > limit) {
        const nextItem = messages.pop();
        nextCursor = nextItem?.id.toString();
      }

      return {
        messages,
        nextCursor,
      };
    }),

  createStripeSession: privateProcedure.mutation(async ({ ctx }) => {
    const { user, userId } = ctx;
    const billingURL = absoluteURL("/dashboard/billing");

    if (!user) throw new TRPCError({ code: "UNAUTHORIZED" });

    const dbUser = await db.user.findFirst({
      where: {
        kindeId: userId,
      },
    });

    if (!dbUser) throw new TRPCError({ code: "UNAUTHORIZED" });

    const subscriptionPlan = await getUserSubscriptionPlan();
    if (subscriptionPlan.isSubscribed && dbUser.stripeCustomerId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: dbUser.stripeCustomerId,
        return_url: billingURL,
      });

      console.log(billingURL);

      return { url: stripeSession.url };
    }

    const stripeSession = await stripe.checkout.sessions.create({
      success_url: billingURL,
      cancel_url: billingURL,
      payment_method_types: ["card"],
      mode: "subscription",
      billing_address_collection: "auto",
      line_items: [
        {
          price: PLANS.find((p) => p.name === "Pro")?.price.priceIds.test,
        },
      ],
      metadata: {
        userId: userId,
      },
    });

    console.log(billingURL);
    return { url: stripeSession.url };
  }),

  getKindeUser: privateProcedure.query(({ ctx }) => {
    const { user } = ctx;
    return { user };
  }),
});

export type AppRouter = typeof appRouter;
