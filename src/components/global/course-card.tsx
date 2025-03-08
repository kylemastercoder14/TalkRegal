"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Laptop, Brain, Wrench, Stethoscope, Baby } from "lucide-react";

const courseIcons: { [key: string]: React.ElementType } = {
  "Information System": Laptop,
  Psychology: Brain,
  Engineering: Wrench,
  Nursing: Stethoscope,
  Midwifery: Baby,
};

const CourseCard = ({
  title,
  onSelect,
}: {
  title: string;
  onSelect: (course: string) => void;
}) => {
  const Icon = courseIcons[title] || Laptop;

  return (
    <Card
      onClick={() => onSelect(title)}
      className="w-[240px] cursor-pointer hover:border-green-600 transition"
    >
      <CardContent className="p-6">
        <div className="flex flex-col items-center justify-center">
          <div className="bg-green-200 dark:bg-green-700 dark:text-green-200 mb-5 text-green-700 size-12 flex items-center justify-center rounded-full">
            <Icon className="w-6 h-6" />
          </div>
          <h1 className="text-center text-lg font-semibold">{title}</h1>
          <p className="text-muted-foreground text-sm mt-2 text-center">
            Connect with students anonymously.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseCard;
