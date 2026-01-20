import Card, { CardHeader } from "@/components/ui/card";
import PageHeading from "@/components/ui/pageHeading";
import prisma from "@/lib/db/prisma";

export default async function Lesson({
    params,
}: {
    params: { id: string };
}){
    const lesson = await prisma.lesson.findUnique({
        where: { id: params.id },
    });
   return (
       <div className="mx-4 md:max-w-7xl md:mx-auto bg-background dark:bg-background-dark p-4 mb-8">
           <PageHeading className="mb-4">
               {lesson?.title}
           </PageHeading>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card variant="secondary" className="col-span-2">
                <CardHeader className="bg-accent/5">
                    {lesson?.description || "No description available."}
                </CardHeader>
               
            </Card>
            <Card variant="primary" className="col-span-1">
                <CardHeader className="bg-primary/5">
                    <h3 className="text-lg font-semibold">Lesson Details</h3>
                </CardHeader>
                <div className="p-4">
                    <p><strong>Created At:</strong> {lesson ? new Date(lesson.createdAt).toLocaleDateString() : "N/A"}</p>
                    <p><strong>Updated At:</strong> {lesson ? new Date(lesson.updatedAt).toLocaleDateString() : "N/A"}</p>
                </div>
            </Card>
            </div>

       </div>
   );
}