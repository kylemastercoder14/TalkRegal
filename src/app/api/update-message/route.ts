import { NextResponse } from "next/server";
import db from "@/lib/db";
import { pusher } from "@/lib/pusher";

export async function PUT(
  req: Request,
  { params }: { params: { messageId: string } }
) {
  try {
    const { messageId } = params;
    const body = await req.json();
    console.log("Received update request:", body); // ✅ Debugging

    const { senderId: sessionId, content } = body; // ✅ `senderId` is actually `sessionId`

    if (!messageId || !sessionId || !content.trim()) {
      console.error("Validation Error: Missing required fields");
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // ✅ Find the user using `sessionId` and get the correct `id`
    const sender = await db.user.findUnique({
      where: { sessionId },
    });

    if (!sender) {
      console.error("Error: User not found for sessionId", sessionId);
      return NextResponse.json(
        { error: "Invalid sender. User does not exist" },
        { status: 400 }
      );
    }

    // ✅ Find the message to update
    const existingMessage = await db.message.findUnique({
      where: { id: messageId },
    });

    if (!existingMessage) {
      console.error("Error: Message not found", messageId);
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    // ✅ Ensure only the sender can edit their message
    if (existingMessage.senderId !== sender.id) {
      console.error("Unauthorized edit attempt by", sender.id);
      return NextResponse.json(
        { error: "Unauthorized to edit this message" },
        { status: 403 }
      );
    }

    // ✅ Update the message content
    const updatedMessage = await db.message.update({
      where: { id: messageId },
      data: { content },
    });

    console.log("Updated message:", updatedMessage); // ✅ Debugging

    // ✅ Send real-time update to Pusher
    const payload = {
      id: updatedMessage.id,
      content: updatedMessage.content,
      senderId: updatedMessage.senderId,
      createdAt: updatedMessage.createdAt.toISOString(),
    };

    console.log("Pusher payload:", payload); // ✅ Debugging

    await pusher.trigger(
      `chat-${existingMessage.conversationId}`,
      "message-updated",
      payload
    );

    return NextResponse.json(updatedMessage);
  } catch (error) {
    console.error("Update Message API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
