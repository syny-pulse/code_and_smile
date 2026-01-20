import { Course, CourseLevel } from "@prisma/client";
import Link from "next/link";


type CourseCardProps = {
  course: Course;
};

const levelColors: Record<CourseLevel, string> = {
  BEGINNER: '#4ECDC4',      // Teal
  INTERMEDIATE: '#FFD93D',  // Yellow
  ADVANCED: '#FF6B6B',      // Red
};

export function CourseCard({ course }: CourseCardProps) {

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md transition-transform duration-300 hover:shadow-xl hover:-translate-y-1 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100">
      {/* Header Icon Section */}
      <div
        className="relative h-48 flex items-center justify-center bg-opacity-10"
        style={{ backgroundColor: levelColors[course.level] || "#E0E0E0" }}
      >
        <i
          className="fas fa-laptop-code text-5xl transition-transform duration-300 group-hover:scale-110"
          style={{ color: levelColors[course.level] }}
        ></i>
      </div>

      {/* Content Section */}
      <div className="p-6">
        <div className="mb-3 flex items-center justify-between">
          <span
            className="rounded-full px-3 py-1 text-xs font-semibold text-white shadow-sm"
            style={{ backgroundColor: levelColors[course.level] }}
          >
            {course.level}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {course.duration ?? "N/A"} weeks
          </span>
        </div>

        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 truncate">
          {course.title}
        </h3>

        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mb-4">
          {course.description}
        </p>

        <Link
          href={`/courses/${course.id}`}
          className="inline-flex items-center text-sm font-medium transition-colors duration-200 text-primary hover:underline"
          style={{ color: "#FF6F61" }}
        >
          View Course
          <i className="fas fa-chevron-right ml-2 text-xs"></i>
        </Link>
      </div>
    </div>
  );
}
