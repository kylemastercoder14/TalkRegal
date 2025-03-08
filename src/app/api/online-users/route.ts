/* eslint-disable prefer-const */
import { NextResponse } from "next/server";
import { pusher } from "@/lib/pusher";

let onlineUsers = new Set<string>(); // ✅ Stores unique users dynamically

export async function POST(req: Request) {
  try {
    const { sessionId } = await req.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID required" },
        { status: 400 }
      );
    }

    console.log(`User joined: ${sessionId}`);
    onlineUsers.add(sessionId); // ✅ Ensure each session ID is unique

    // ✅ Broadcast updated online users count
    await pusher.trigger("presence-users", "user-online", {
      count: onlineUsers.size,
    });

    return NextResponse.json({
      message: "User added",
      count: onlineUsers.size,
    });
  } catch (error) {
    console.error("Online Users API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ count: onlineUsers.size }); // ✅ Return current online users count
}
