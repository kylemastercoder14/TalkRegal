import Image from "next/image";
import Link from "next/link";
import React from "react";
import { ModeToggle } from "./mode-toggle";
import { Button } from '@/components/ui/button';
import { History, Settings } from 'lucide-react';

const Navigation = () => {
  return (
    <nav className="sticky inset-0 border-b py-3 w-full">
      <div className="flex max-w-7xl mx-auto justify-between items-center px-4">
        <Link href="/">
          <Image
            src="/assets/logo-text.png"
            width={120}
            height={120}
            alt="Logo"
          />
        </Link>
        <div className="flex items-center">
          <ModeToggle />
		  <p className='ml-4 mr-3'>|</p>
		  <Button variant="ghost">
			<History size={20} />
			History
		  </Button>
		  <Button className='ml-2' variant="outline">
			<Settings size={20} />
			Settings
		  </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
