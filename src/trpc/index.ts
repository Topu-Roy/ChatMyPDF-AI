import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { router, publicProcedure, privateProcedure } from "./trpc";
import { TRPCError } from "@trpc/server";
import { db } from "@/db";
import { z } from "zod";

export const appRouter = router({
  authCallback: publicProcedure.query(async () => {
    const { getUser } = getKindeServerSession();
    const user = getUser();

    if (!user || !user.email || !user.id) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    // TODO : Check if the user is in the DB
    const dbUser = await db.user.findFirst({
      where: {
        kindeId: user.id?.toString(),
      },
    });

    if (!dbUser) {
      // Create a new user in database
      await db.user.create({
        data: {
          name: `${user.given_name} ${user.family_name}`,
          kindeId: user.id?.toString(),
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
        kindeUserId: userId,
      },
    });

    return files;
  }),

  deleteFile: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;

      const file = await db.file.findFirst({
        where: {
          id: input.id,
          kindeUserId: userId,
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
});

export type AppRouter = typeof appRouter;
