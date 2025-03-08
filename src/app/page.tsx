"use client";
import React from "react";
import { Spotlight } from "@/components/aceternity/spotlight-background";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";
import { ModeToggle } from "@/components/global/mode-toggle";
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();
  return (
    <div className="h-screen w-full flex md:items-center md:justify-center dark:bg-black/[0.96] bg-white/[0.96] antialiased dark:bg-grid-white/[0.02] bg-grid-black/[0.2] relative overflow-hidden">
      <Spotlight />
      <div className="p-4 max-w-7xl mx-auto relative z-10 w-full pt-20 md:pt-0">
        <Image
          src="/assets/logo-text.png"
          className="mx-auto mb-1"
          alt="Logo"
          width={300}
          height={300}
        />
        <h1 className="text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b dark:from-neutral-50 dark:to-neutral-400 from-neutral-600 to-neutral-800 bg-opacity-50">
          A safe space for Regals to chat.
        </h1>
        <p className="mt-4 font-normal text-lg dark:text-neutral-300 text-neutral-600 max-w-5xl text-center mx-auto">
          Connect, share, and express yourself freely. TalkRegal is a safe space
          where Regals can chat anonymously, exchange thoughts, and engage in
          open conversations—without fear of judgment.
        </p>
        <div className="mt-10 gap-5 justify-center flex items-center">
          <Button size="lg" variant="secondary">
            Read our policies
          </Button>
          <Button size="lg" onClick={() => router.push('/get-started')}>
            ✨ Get Started{" "}
            <ArrowRightIcon className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
          </Button>
        </div>
        <div className='fixed bottom-5 right-5'>
          <ModeToggle />
        </div>
      </div>
    </div>
  );
}
