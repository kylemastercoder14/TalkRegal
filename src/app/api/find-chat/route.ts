import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { sessionId } = await req.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const user = await db.user.findUnique({ where: { sessionId } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if the user is already in an active conversation
    let conversation = await db.conversation.findFirst({
      where: {
        isActive: true,
        OR: [{ userOneId: user.id }, { userTwoId: user.id }],
      },
    });

    if (conversation) {
      return NextResponse.json({ id: conversation.id });
    }

    // Find a waiting user (from any course) who is not already in a conversation
    const waitingUser = await db.user.findFirst({
      where: {
        sessionId: { not: sessionId }, // Avoid matching with self
        NOT: {
          OR: [
            { conversationsAsUserOne: { some: { isActive: true } } },
            { conversationsAsUserTwo: { some: { isActive: true } } },
          ],
        },
      },
    });

    if (waitingUser) {
      // Create a new conversation with the matched user
      conversation = await db.conversation.create({
        data: {
          userOneId: waitingUser.id,
          userTwoId: user.id,
          isActive: true,
        },
      });

      return NextResponse.json({ id: conversation.id });
    }

    // If no waiting user is found, mark the current user as waiting
    return NextResponse.json({ waiting: true });
  } catch (error) {
    console.error("Find Chat API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
