"use client";

import { Lesson } from "@prisma/client";
import Link from "next/link";
import { format } from "date-fns";
import { Book } from "lucide-react";

type LessonCardProps = {
  lesson: Lesson;
};

export default function LessonCard({ lesson }: LessonCardProps) {
  return (
    <div className="flex items-stretch rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 dark:bg-gray-800 dark:border-gray-600">
      {/* Left Icon Area */}
      <div className="flex items-center justify-center w-24 bg-blue-100 dark:bg-blue-900">
        <Book className="h-10 w-10 text-blue-600 dark:text-blue-300" />
      </div>

      {/* Right Content Area */}
      <div className="flex flex-col justify-between p-5 w-full">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-accent dark:text-accent-dark">
            {lesson.title}
          </h3>
          <span className="text-sm text-accent">
            {format(new Date(lesson.createdAt), "MMM dd, yyyy")}
          </span>
        </div>

        <p className="mt-2 text-gray-500 dark:text-gray-400 text-sm line-clamp-3">
          {lesson.description}
        </p>

        <Link
          href={`/learner/lessons/${lesson.id}`}
          className="mt-4 inline-flex items-center text-sm text-blue-600 hover:underline dark:text-blue-400"
        >
          View Lesson
        </Link>
      </div>
    </div>
  );
}
