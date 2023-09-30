import DashboardComponent from '@/components/DashboardComponent'
import { db } from '@/db'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { redirect } from 'next/navigation'

export default async function Dashboard() {
    const { getUser } = getKindeServerSession()
    const user = getUser()

    // * If not logged in
    if (!user || !user.id) redirect('/auth-callback?origin=dashboard')

    // * Check if user is synced to DB
    const dbUser = await db.user.findFirst({
        where: {
            kindeId: user.id,
        }
    })

    // * If not found on redirect for syncing
    if (!dbUser) redirect('/auth-callback?origin=dashboard')

    return (
        <DashboardComponent />
    )
}
