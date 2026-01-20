import Button from "@/components/ui/button";
import Card, { CardContent, CardHeader } from "@/components/ui/card";
import { CourseCard } from "@/components/ui/CourseCard";
import LessonCard from "@/components/ui/lessonCard";
import LessonList from "@/components/ui/lessonList";
import PageHeading from "@/components/ui/pageHeading";
import prisma from "@/lib/db/prisma";

export default async function CoursePage({ params }: { params: { id: string } }) {
  const course = await prisma.course.findUnique({
    where: { id: params.id },
    include: { lessons: true },
  });
  const lessons = course?.lessons || [];

  if (!course) {
    return (
      <div className="mx-4 md:max-w-7xl md:mx-auto p-8 text-center text-red-600">
        Course not found.
        {/* show id */}
        <p>{params.id}</p>
      </div>
    );
  }
  return (
    <div className="mx-4 md:max-w-7xl md:mx-auto bg-background dark:bg-background-dark p-4 mb-8">
        <div className="mb-4">
            <PageHeading>Course Details</PageHeading>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <Card variant="accent" className="hover:shadow-lg col-span-2 transition-shadow duration-300">
                <CardHeader>{course?.title}</CardHeader>
                <CardContent>
                <p>{course?.description || "No description available."}</p>
                </CardContent>
            </Card>
            <Card variant="primary" className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>Enroll Now</CardHeader>
                <CardContent>
                <Button variant="primary" className="w-full">
                    Enroll
                </Button>
                </CardContent>
            </Card>
            </div>

        </div>

        {/* show lessons in a horizontal scroll for large screens */}
        <LessonList lessons={lessons} />
    </div>
  );
}


