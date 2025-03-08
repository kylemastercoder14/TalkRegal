/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-key */
"use client";
import React, { useEffect, useState } from "react";
import {
  MessageCircleHeart,
  School,
  Camera,
  CoffeeIcon,
  ScrollText,
  Search,
  LaptopIcon,
  Loader2,
  Megaphone,
  Users,
  Square,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const FindingChat = () => {
  const icons = [
    <Search className="size-8 text-green-700" />,
    <Megaphone className="size-8 text-green-700" />,
    <MessageCircleHeart className="size-8 text-green-700" />,
    <Users className="size-8 text-green-700" />,
    <CoffeeIcon className="size-8 text-green-700" />,
    <LaptopIcon className="size-8 text-green-700" />,
    <School className="size-8 text-green-700" />,
    <Camera className="size-8 text-green-700" />,
    <ScrollText className="size-8 text-green-700" />,
  ];

  const [currentIcon, setCurrentIcon] = useState(icons[0]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * icons.length);
      setCurrentIcon(icons[randomIndex]);
    }, 700);

    return () => clearInterval(intervalId);
  }, []);
  return (
    <div className="fixed inset-0 w-full h-screen bg-white z-50 flex items-center justify-center">
      <div className="border shadow-lg w-[400px] py-5 rounded-xl flex items-center flex-col justify-center">
        {currentIcon}
        <span className="text-base flex items-center gap-2 mt-4 text-green-700">
          Finding a chat partner... <Loader2 className="w-4 h-4 animate-spin" />
        </span>
        <p className="text-sm text-muted-foreground mt-2">
          If {"it's"} taking too long, please refresh the page.
        </p>
        <Button variant="destructive" className="mt-3" size="sm">
          <Square fill="#fff" className="text-transparent" />
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default FindingChat;
