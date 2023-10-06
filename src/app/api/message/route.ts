import { db } from "@/db";
import { SendMessageValidator } from "@/lib/validator/sendMessageValidator";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // * Get the body
  const body = req.json();
  if (!body) return NextResponse.json("Body is required", { status: 401 });

  // * Check if the user is authenticated
  const { getUser } = getKindeServerSession();
  const user = getUser();
  if (!user) return NextResponse.json("Unauthorized", { status: 401 });

  // * Validate the body
  const { fileId, message } = SendMessageValidator.parse(body);

  // * Get the file from the DB
  const file = await db.file.findFirst({
    where: {
      id: fileId,
      kindeUserId: user.id,
    },
  });

  if (!file) NextResponse.json({ error: "Not Found" }, { status: 404 });

  await db.message.create({
    data: {
      text: message,
      isUserMessage: true,
      userId: user.id,
      fileId: fileId,
    },
  });
}
