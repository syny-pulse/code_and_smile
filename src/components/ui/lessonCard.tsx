"use client";

import { Lesson } from "@prisma/client";
import Link from "next/link";
import { format } from "date-fns";
import { cn } from "@/lib/utils"; // if using a classnames helper
import { BookOpen } from "lucide-react";

type LessonCardProps = {
  lesson: Lesson;
};

export default function LessonCard({ lesson }: LessonCardProps) {
  return (
    <div className="flex border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden dark:bg-gray-800 dark:border-gray-600">
      {/* Accent Strip */}
      <div className="w-2 bg-blue-500" />

      {/* Content */}
      <div className="flex flex-col justify-between p-5 w-full">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-accent dark:text-accent-dark">
            {lesson.title}
          </h3>
          <span className="text-sm text-accent">
            {format(new Date(lesson.createdAt), "MMM dd, yyyy")}
          </span>
        </div>

        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 line-clamp-3">
          {lesson.description}
        </p>

        <Link
          href={`/learner/lessons/${lesson.id}`}
          className="mt-4 inline-flex items-center text-sm text-blue-600 hover:underline dark:text-blue-400"
        >
          <BookOpen className="mr-1 h-4 w-4" />
          View Details
        </Link>
      </div>
    </div>
  );
}
