import { db } from '@/db'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { notFound, redirect } from 'next/navigation'
import React from 'react'

type PropsType = {
    params: {
        fileId: string
    }
}

export default async function page({ params }: PropsType) {
    // Get the file id from folder param
    const fileId = params.fileId

    // Check if the user is authenticated
    const { getUser } = getKindeServerSession()
    const user = getUser()

    if (!user || !user.id) {
        redirect(`auth-callback?origin=dashboard/${fileId}`)
    }

    // Get the file
    const file = await db.file.findFirst({
        where: {
            id: fileId,
            kindeUserId: user.id,
        }
    })

    if (!file) notFound()

    return (
        <div>{fileId}</div>
    )
}
