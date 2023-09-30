import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { router, publicProcedure } from "./trpc";
import { TRPCError } from "@trpc/server";
import { db } from "@/db";

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
});

export type AppRouter = typeof appRouter;
