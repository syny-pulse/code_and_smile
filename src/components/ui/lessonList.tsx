"use client";
import LessonCard from "./lessonCard";
import LessonCard2 from "./LessonCard2";
import PageHeading from "./pageHeading";

export default function LessonList({ lessons }: { lessons: any[] }) {

  return (
    <div>
      <PageHeading className="mb-4">
        Lessons
      </PageHeading>
      <div className="hidden md:block overflow-x-auto">
        <div className="flex space-x-4">
          {lessons.map((lesson) => (
            <LessonCard2 key={lesson.id} lesson={lesson} />
          ))}
        </div>
      </div>
    </div>
  );
}