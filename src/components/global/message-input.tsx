/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { LaughIcon, SendHorizonal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import clsx from "clsx";

interface Message {
  id: string;
  senderId: string;
  content: string;
  createdAt: string;
}

interface MessageInputProps {
  conversationId: string;
  editingMessage: Message | null;
  onUpdate: (updatedMessage: Message) => void;
  onCancelEdit: () => void;
}

const MessageInput: React.FC<MessageInputProps> = ({
  conversationId,
  editingMessage,
  onUpdate,
  onCancelEdit,
}) => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (editingMessage) {
      setMessage(editingMessage.content);
      setIsEditing(true);
    } else {
      setIsEditing(false);
    }
  }, [editingMessage]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const sessionId = sessionStorage.getItem("anonymousSessionId");

    if (!sessionId) {
      console.error("No sessionId found in sessionStorage.");
      return;
    }

    setLoading(true);

    try {
      if (editingMessage) {
        const updatedMessage = { ...editingMessage, content: message.trim() };

        await fetch(`/api/update-message/${editingMessage.id}`, {
          method: "PUT",
          body: JSON.stringify(updatedMessage),
          headers: { "Content-Type": "application/json" },
        });

        onUpdate(updatedMessage);
        setIsEditing(false);
      } else {
        const payload = {
          conversationId,
          senderId: sessionId,
          content: message.trim(),
        };

        await fetch("/api/send-message", {
          method: "POST",
          body: JSON.stringify(payload),
          headers: { "Content-Type": "application/json" },
        });
      }

      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const addEmoji = (emoji: any) => {
    setMessage((prev) => prev + emoji.native);
    setShowEmojiPicker(false);
  };

  const handleCancel = () => {
    setMessage("");
    setIsEditing(false);
    onCancelEdit();
  };

  return (
    <div className="border-t py-3 w-full flex items-center px-5 gap-3 justify-center relative">
      {/* Swipe-up edit banner */}
      <div
        className={clsx(
          "absolute w-full left-0 bg-accent flex items-center justify-between px-2 py-2 rounded-lg transition-all duration-300",
          isEditing ? "-top-12 opacity-100" : "-top-14 opacity-0"
        )}
      >
        <div>
          <p className="text-xs text-gray-600">Editing Message</p>
          <p className="text-black text-sm truncate">{message}</p>
        </div>
        <Button variant="ghost" type="button" onClick={handleCancel}>
          <X />
        </Button>
      </div>

      {/* Emoji Picker */}
      <div className="relative">
        <Button
          size="icon"
          className="rounded-full"
          onClick={() => setShowEmojiPicker((prev) => !prev)}
        >
          <LaughIcon />
        </Button>
        {showEmojiPicker && (
          <div className="absolute bottom-12 left-0 z-50 bg-white shadow-md rounded-lg">
            <Picker data={data} onEmojiSelect={addEmoji} />
          </div>
        )}
      </div>

      {/* Input field */}
      <div className="flex gap-2 w-full">
        <Input
          placeholder={
            editingMessage
              ? "Edit your message..."
              : "Enter your message here..."
          }
          value={message}
          disabled={loading}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Button disabled={loading} onClick={sendMessage}>
          <SendHorizonal />
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;
