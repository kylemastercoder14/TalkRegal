import clsx from "clsx";
import { User, Edit, Smile, Undo, Copy } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

interface MessageProps {
  isOwn?: boolean;
  message: { id: string; senderId: string; content: string; createdAt: string };
  onEdit: (message: {
    id: string;
    senderId: string;
    content: string;
    createdAt: string;
  }) => void;
}

const reactions = ["❤️", "😆", "😲", "😢", "😡", "👍"];

const MessageContainer: React.FC<MessageProps> = ({
  isOwn,
  message,
  onEdit,
}) => {
  const [hovered, setHovered] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      toast.success("Message copied! ✅");
    } catch (error) {
      console.error("Failed to copy message:", error);
      toast.error("Failed to copy message.");
    }
  };

  const container = clsx(
    "flex gap-3 p-4",
    isOwn ? "justify-end" : "justify-start"
  );
  const avatar = clsx(
    "bg-green-200/40 relative text-green-700 size-10 rounded-full flex items-center justify-center",
    isOwn && "hidden"
  );
  const body = clsx("flex flex-col gap-2 relative", isOwn && "items-end");
  const messageClasses = clsx(
    "text-sm px-3 py-2 rounded-lg w-fit overflow-hidden transition duration-200",
    isOwn ? "bg-[#2e845f] text-white" : "bg-gray-100 text-black"
  );

  return (
    <div className={container}>
      {!isOwn && (
        <div className={avatar}>
          <User className="size-5" />
          <div className="absolute size-2 top-0.5 right-0.5 bg-green-300 rounded-full"></div>
        </div>
      )}

      <div
        className={body}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => {
          setHovered(false);
          setShowReactions(false);
        }}
      >
        {/* update an edit status if edited */}
        {/* <p className='text-xs text-gray-400'>Edited</p> */}
        {/* Editable Message Content */}
        <div className={messageClasses}>{message.content}</div>
        <div className="text-xs text-gray-400">
          {new Date(message.createdAt).toLocaleTimeString()}
        </div>

        {selectedReaction && (
          <div className="absolute text-lg mt-1">{selectedReaction}</div>
        )}

        {/* Action Buttons */}
        {hovered && (
          <div
            className={clsx(
              "absolute flex gap-2 bg-transparent rounded-md p-3 transition duration-200",
              isOwn ? "left-[-160px] bottom-4" : "right-[-120px] bottom-4"
            )}
          >
            <button className="p-1.5 rounded-full hover:bg-gray-200">
              <Undo className="size-4 text-gray-600" />
            </button>
            <button
              className="p-1.5 rounded-full hover:bg-gray-200"
              onClick={handleCopy}
            >
              <Copy className="size-4 text-gray-600" />
            </button>
            {isOwn && (
              <button
                className="p-1.5 rounded-full hover:bg-gray-200"
                onClick={() => onEdit(message)}
              >
                <Edit className="size-4 text-gray-600" />
              </button>
            )}
            <button
              className="p-1.5 rounded-full hover:bg-gray-200"
              onClick={() => setShowReactions(!showReactions)}
            >
              <Smile className="size-4 text-gray-600" />
            </button>
          </div>
        )}

        {/* Reaction Picker Popup */}
        {showReactions && (
          <div
            className={clsx(
              "absolute flex gap-2 bg-white shadow-lg rounded-full p-2 transition duration-200",
              isOwn ? "left-[-180px] bottom-10" : "right-[-180px] bottom-10"
            )}
          >
            {reactions.map((emoji) => (
              <button
                key={emoji}
                className="text-xl hover:scale-125 transition transform"
                onClick={() => {
                  setSelectedReaction(emoji);
                  setShowReactions(false);
                }}
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageContainer;
