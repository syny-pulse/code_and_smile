import Link from "next/link";

export interface SimpleCourse {
  id: string;
  title: string;
  description?: string;
  duration?: number | null;
  level?: string;
}

type CourseCardProps = {
  course: SimpleCourse;
};

const defaultColor = '#4ECDC4'; // Teal as default

export function CourseCard({ course }: CourseCardProps) {
  // varied colors based on title length just for variety
  const colors = ['#4ECDC4', '#FFD93D', '#FF6B6B', '#267fc3', '#ffc82e'];
  const colorIndex = course.title.length % colors.length;
  const cardColor = colors[colorIndex];

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md transition-transform duration-300 hover:shadow-xl hover:-translate-y-1 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100">
      {/* Header Icon Section */}
      <div
        className="relative h-48 flex items-center justify-center bg-opacity-10"
        style={{ backgroundColor: `${cardColor}20` }}
      >
        <i
          className={`fas fa-laptop-code text-5xl transition-transform duration-300 group-hover:scale-110`}
          style={{ color: cardColor }}
        ></i>
      </div>

      {/* Content Section */}
      <div className="p-6">
        <div className="mb-3 flex items-center justify-between">
          <span
            className="rounded-full px-3 py-1 text-xs font-semibold text-white shadow-sm"
            style={{ backgroundColor: cardColor }}
          >
            Course
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {course.duration ? `${course.duration} mins` : "Self-paced"}
          </span>
        </div>

        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 truncate">
          {course.title}
        </h3>

        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mb-4">
          {course.description || "No description available."}
        </p>

        <Link
          href={`/courses/${course.id}`} // id is the title string
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
