"use client";

import React, { useEffect, useState } from "react";
import { PlaceholdersAndVanishInput } from "@/components/aceternity/animated-placeholder";
import Navigation from "@/components/global/navigation";
import CourseCard from "@/components/global/course-card";
import ConfessionCard from "@/components/global/confession-card";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Megaphone } from "lucide-react";
import FindingChat from "@/components/global/finding-chat";
import { toast } from "sonner";
import Pusher from "pusher-js";

const usernamePlaceholders = [
  "Your heart's username 💖",
  "Love at first username? 😘",
  "Your soulmate's waiting... 💌",
  "Flirty & unique, just like you 😉",
  "Swipe right on this name! ❤️",
  "What's your dating alter ego? 💘",
  "Username that sparks romance ✨",
  "Pick a name, find a match 💑",
  "Love letters start with a name 💞",
  "Mr. or Ms. Right? 💕",
];

const Page = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [course, setCourse] = useState("");
  const [findingChat, setFindingChat] = useState(false);
  const [usersOnline, setUsersOnline] = useState(0);

  useEffect(() => {
    let sessionId = sessionStorage.getItem("anonymousSessionId");

    if (!sessionId) {
      sessionId = crypto.randomUUID();
      sessionStorage.setItem("anonymousSessionId", sessionId);
    }

    // ✅ Register user online
    fetch("/api/online-users", {
      method: "POST",
      body: JSON.stringify({ sessionId }),
      headers: { "Content-Type": "application/json" },
    });

    // ✅ Fetch initial online users count
    const fetchUsersOnline = async () => {
      try {
        const response = await fetch("/api/online-users");
        const data = await response.json();
        setUsersOnline(data.count);
      } catch (error) {
        console.error("Error fetching online users:", error);
      }
    };

    fetchUsersOnline();

    // ✅ Listen for online user updates using Pusher
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY!, {
      cluster: "ap1",
    });

    const channel = pusher.subscribe("presence-users");
    channel.bind("user-online", (data: { count: number }) => {
      setUsersOnline(data.count);
    });

    return () => {
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, []);

  // ✅ Handle username input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  // ✅ Handle course selection
  const handleCourseSelect = async (selectedCourse: string) => {
    if (!username.trim()) {
      toast.warning("Please enter a username before selecting a course.");
      return;
    }

    setCourse(selectedCourse);
    setFindingChat(true);

    const sessionId = sessionStorage.getItem("anonymousSessionId");

    // ✅ Store user in database
    await fetch("/api/create-user", {
      method: "POST",
      body: JSON.stringify({ sessionId, username, course: selectedCourse }),
      headers: { "Content-Type": "application/json" },
    });

    // ✅ Find a chat partner
    const response = await fetch("/api/find-chat", {
      method: "POST",
      body: JSON.stringify({ sessionId }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();

    if (data?.id) {
      router.push(`/chat/${data.id}`); // ✅ Redirect to chat page
    } else if (data?.waiting) {
      toast.info("We're still finding a chat partner for you...");
    }
  };

  return (
    <div className="relative overflow-hidden">
      <Navigation />
      <div className="mt-32 max-w-7xl mx-auto flex flex-col justify-center items-center">
        <h2 className="mb-5 text-xl text-center sm:text-3xl dark:text-white text-black">
          Enter a unique username
        </h2>
        <PlaceholdersAndVanishInput
          placeholders={usernamePlaceholders}
          onChange={handleChange}
          onSubmit={() => handleCourseSelect(course)}
        />
        <div className="flex items-center gap-2 mt-3">
          <div className="bg-green-600 size-2 rounded-full"></div>
          <p className="text-sm text-muted-foreground">{usersOnline} people chatting right now</p>
        </div>
        <div className="grid lg:grid-cols-5 mb-10 grid-cols-1 gap-5 mt-20">
          {["Information System", "Psychology", "Engineering", "Nursing", "Midwifery"].map(
            (course) => (
              <CourseCard key={course} title={course} onSelect={handleCourseSelect} />
            )
          )}
        </div>
      </div>
      <div className="max-w-7xl mx-auto">
        <ConfessionCard />
      </div>
      <div className="fixed bottom-3 flex items-center justify-center inset-x-0 text-center">
        <p className="text-green-700">
          <b>Developed by:</b>{" "}
          <span
            onClick={() => router.push("https://www.facebook.com/kyleandre.lim29")}
            className="text-black cursor-pointer hover:underline"
          >
            Kyle Andre Lim
          </span>
        </p>
      </div>
      <Button className="fixed bottom-5 right-5">
        <Megaphone />
        Submit a feedback
      </Button>
      {findingChat && <FindingChat />}
    </div>
  );
};

export default Page;
