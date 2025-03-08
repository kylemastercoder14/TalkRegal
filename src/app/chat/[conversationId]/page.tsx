"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Ellipsis, User } from "lucide-react";
import MessageInput from "@/components/global/message-input";
import MessageContainer from "@/components/global/message-container";
import { useParams } from "next/navigation";
import Pusher, { Channel } from "pusher-js";

interface Message {
  id: string;
  senderId: string;
  content: string;
  createdAt: string;
}

const Page = () => {
  const { conversationId } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [senderId, setSenderId] = useState<string | null>(null); // ✅ Store sender ID from user
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);

  useEffect(() => {
    // ✅ Get sessionId from localStorage
    const sessionId = localStorage.getItem("anonymousSessionId");
    if (!sessionId) return;

    // ✅ Find the actual `id` from the database using sessionId
    const fetchUserId = async () => {
      try {
        const res = await fetch(`/api/get-user-id?sessionId=${sessionId}`);
        const data = await res.json();
        if (data?.id) {
          setSenderId(data.id); // ✅ Store correct user ID (not sessionId)
        }
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    if (!conversationId) return;

    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `/api/get-messages?conversationId=${conversationId}`
        );
        const data: Message[] = await response.json();
        setMessages(data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();

    let pusher: Pusher | null = null;
    let channel: Channel | null = null;

    if (typeof window !== "undefined") {
      pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY!, {
        cluster: "ap1",
      });

      channel = pusher.subscribe(`chat-${conversationId}`);
      channel.bind("new-message", (message: Message) => {
        setMessages((prev) => [...prev, message]);
      });
    }

    return () => {
      if (channel) channel.unsubscribe();
      if (pusher) pusher.disconnect();
    };
  }, [conversationId]);

  const handleEditMessage = (message: Message) => {
    setEditingMessage(message);
  };

  const handleMessageUpdate = (updatedMessage: Message) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === updatedMessage.id ? updatedMessage : msg))
    );
    setEditingMessage(null);
  };

  return (
    <div className="w-full h-screen overflow-hidden flex pt-2 justify-center items-center">
      <div className="w-[700px] bg-[#2e845f] h-full rounded-xl">
        <div className="h-[10%] px-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Button
              className="hover:bg-transparent text-zinc-300 hover:text-white"
              variant="ghost"
            >
              <ArrowLeft className="size-6" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="bg-green-200/40 relative text-white size-10 rounded-full flex items-center justify-center">
                <User className="size-5" />
                <div className="absolute size-2 top-0.5 right-0.5 bg-green-300 rounded-full"></div>
              </div>
              <div>
                <p className="text-white font-bold">Anonymous</p>
                <p className="text-xs text-green-300 font-semibold">
                  Active now
                </p>
              </div>
            </div>
          </div>
          <Button
            className="hover:bg-transparent text-white hover:text-white"
            variant="ghost"
          >
            <Ellipsis className="size-5" />
          </Button>
        </div>
        <div className="bg-white h-[90%] border shadow-md">
          <div className="h-[93%] overflow-y-auto">
            {messages.map((msg) => (
              <MessageContainer
                key={msg.id}
                isOwn={msg.senderId === senderId} // ✅ Compare senderId with user's actual ID
                message={msg}
                onEdit={handleEditMessage}
              />
            ))}
          </div>
          <div className="h-[7%]">
            {senderId && (
              <MessageInput
                conversationId={conversationId as string}
                editingMessage={editingMessage}
                onUpdate={handleMessageUpdate}
                onCancelEdit={() => setEditingMessage(null)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
