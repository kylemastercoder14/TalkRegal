import { NextResponse } from "next/server";
import db from "@/lib/db";
import { pusher } from "@/lib/pusher";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Received payload:", body); // ✅ Debugging

    const { conversationId, senderId: sessionId, content } = body; // ✅ `senderId` is actually `sessionId`

    if (!conversationId || !sessionId || !content.trim()) {
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

    // ✅ Check if the conversation exists
    const conversation = await db.conversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation) {
      console.error("Error: Conversation not found", conversationId);
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    // ✅ Save message to DB with correct `sender.id`
    const message = await db.message.create({
      data: {
        conversationId,
        senderId: sender.id, // 🔥 Use the actual `User` ID, not `sessionId`
        content,
      },
    });

    console.log("Created message:", message); // ✅ Debugging

    // ✅ Insert the conversation into the History table if it doesn't exist
    const existingHistory = await db.history.findUnique({
      where: { conversationId },
    });

    if (!existingHistory) {
      await db.history.create({
        data: {
          conversationId,
          content: content, // Store the first message as initial history content
        },
      });

      console.log("History created for conversation:", conversationId);
    } else {
      // ✅ Append the new message content to the existing history
      await db.history.update({
        where: { conversationId },
        data: {
          content: existingHistory.content + "\n" + content, // Append new messages
        },
      });

      console.log("History updated for conversation:", conversationId);
    }

    // ✅ Send the message in real-time using Pusher
    const payload = {
      id: message.id,
      content: message.content,
      senderId: message.senderId,
      createdAt: message.createdAt.toISOString(),
    };

    console.log("Pusher payload:", payload); // ✅ Debugging

    await pusher.trigger(`chat-${conversationId}`, "new-message", payload);

    return NextResponse.json(message);
  } catch (error) {
    console.error("Send Message API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
