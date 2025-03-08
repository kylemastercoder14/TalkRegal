import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const ConfessionCard = () => {
  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="">
          <div className="text-lg font-semibold flex gap-2 items-center">
            Anonymous Confessions{" "}
            <Badge className="bg-[#2e845f] text-white hover:bg-[#2e845f]/80">
              Coming Soon
            </Badge>
          </div>
          <p className="text-muted-foreground mt-2">
            Connect with students anonymously. Share your thoughts, secrets, and
            stories without revealing your identity. Speak your heart out and
            connect with others in a judgment-free space.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConfessionCard;
