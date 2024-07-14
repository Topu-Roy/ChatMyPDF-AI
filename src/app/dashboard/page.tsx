import DashboardComponent from "@/components/DashboardComponent";
import { db } from "@/db";
import { getUserSubscriptionPlan } from "@/lib/stripe";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  // * If not logged in
  if (!user) redirect("/auth-callback?origin=dashboard");
  if (!user.id) redirect("/auth-callback?origin=dashboard");

  // * Check if user is synced to DB
  const dbUser = await db.user.findFirst({
    where: {
      kindeId: user.id,
    },
  });

  // * If not found on redirect for syncing
  if (!dbUser) redirect("/auth-callback?origin=dashboard");

  //* Get user subscriptions details
  const subscription = await getUserSubscriptionPlan();

  return <DashboardComponent isSubscribed={subscription.isSubscribed} />;
}
