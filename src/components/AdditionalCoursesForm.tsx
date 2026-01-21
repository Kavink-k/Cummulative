import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { useEffect } from "react";

const courseSchema = z.object({
  id: z.number().optional(),          // DB ID (keep optional)
  courseId: z.string().min(1),        // Auto-generated → must exist, but has no error message
  courseName: z.string().min(1, "Course name is required"),
  from: z.string().min(1, "Start date is required"),
  to: z.string().min(1, "End date is required"),
});

const additionalCoursesSchema = z.object({
  studentId: z.string().min(1, "Student ID is required"),
  courses: z
    .array(courseSchema)
    .min(1, "At least one course must be added"),
});

type AdditionalCoursesFormData = z.infer<typeof additionalCoursesSchema>;

interface AdditionalCoursesFormProps {
  onSubmit: (data: AdditionalCoursesFormData) => void;
  defaultValues?: Partial<AdditionalCoursesFormData>;
  onProgressChange?: (progress: number) => void;
}

export const AdditionalCoursesForm = ({ onSubmit, defaultValues, onProgressChange }: AdditionalCoursesFormProps) => {
  const form = useForm<AdditionalCoursesFormData>({
    resolver: zodResolver(additionalCoursesSchema),
    defaultValues: defaultValues || {
      courses: [{ courseId: "1", courseName: "", from: "", to: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "courses",
  });

  // Auto-generate Course IDs
  useEffect(() => {
    const courses = form.getValues("courses");
    courses.forEach((course, index) => {
      if (!course.courseId || course.courseId === "") {
        form.setValue(`courses.${index}.courseId`, String(index + 1));
      }
    });
  }, [fields.length, form]);

  useEffect(() => {
    const subscription = form.watch((values) => {
      let filledFields = 0;
      const fieldsPerCourse = ["courseName", "from", "to"];
      values.courses?.forEach((course: any) => {
        filledFields += fieldsPerCourse.filter(
          (field) => course[field] && course[field].toString().trim() !== ""
        ).length;
      });
      const totalRequiredFields = values.courses?.length * fieldsPerCourse.length || 0;
      const progress = totalRequiredFields > 0 ? (filledFields / totalRequiredFields) * 100 : 0;
      onProgressChange?.(progress);
    });
    return () => subscription.unsubscribe();
  }, [form, onProgressChange]);

  const handleAddCourse = () => {
    const currentCourses = form.getValues("courses");
    const nextId = String(currentCourses.length + 1);
    append({ courseId: nextId, courseName: "", from: "", to: "" });
  };

  const handleRemoveCourse = async (index: number) => {
    const courses = form.getValues("courses");
    const courseToDelete = courses[index];

    // If the course has a database ID, delete it from the backend
    if (courseToDelete.id) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/additional-courses/${courseToDelete.id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          console.error('Failed to delete course from database');
          alert('Failed to delete course from database');
          return;
        }

        const result = await response.json();

        // Update form with reassigned courses from backend
        if (result.data.remainingCourses) {
          const updatedCourses = result.data.remainingCourses.map((course: any, idx: number) => ({
            id: course.id,
            courseId: String(idx + 1),
            courseName: course.courseName,
            from: course.from ? new Date(course.from).toISOString().split('T')[0] : '',
            to: course.to ? new Date(course.to).toISOString().split('T')[0] : '',
          }));

          // Replace all courses with the updated list
          form.setValue('courses', updatedCourses.length > 0 ? updatedCourses : [{ courseId: "1", courseName: "", from: "", to: "" }]);
        }
      } catch (error) {
        console.error('Error deleting course:', error);
        alert('Error deleting course');
        return;
      }
    } else {
      // If no database ID, just remove from form locally
      remove(index);

      // Re-number remaining courses
      const remainingCourses = form.getValues("courses");
      remainingCourses.forEach((_, idx) => {
        form.setValue(`courses.${idx}.courseId`, String(idx + 1));
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="overflow-x-auto border rounded-lg">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted">
                <th className="border p-3 text-left font-semibold w-24">Course ID</th>
                <th className="border p-3 text-left font-semibold">Name of the Course</th>
                <th className="border p-3 text-left font-semibold w-40">From</th>
                <th className="border p-3 text-left font-semibold w-40">To</th>
                <th className="border p-3 text-center font-semibold w-20">Action</th>
              </tr>
            </thead>
            <tbody>
              {fields.map((field, index) => (
                <tr key={field.id} className="hover:bg-muted/50">
                  <td className="border p-2">
                    <FormField
                      control={form.control}
                      name={`courses.${index}.courseId`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              {...field}
                              readOnly
                              className="h-9 bg-muted cursor-not-allowed text-center font-semibold"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </td>
                  <td className="border p-2">
                    <FormField
                      control={form.control}
                      name={`courses.${index}.courseName`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input {...field} placeholder="Course name" className="h-9" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </td>
                  <td className="border p-2">
                    <FormField
                      control={form.control}
                      name={`courses.${index}.from`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input type="date" {...field} className="h-9" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </td>
                  <td className="border p-2">
                    <FormField
                      control={form.control}
                      name={`courses.${index}.to`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input type="date" {...field} className="h-9" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </td>
                  <td className="border p-2 text-center">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveCourse(index)}
                      className="h-8 w-8 p-0 hover:bg-destructive hover:text-destructive-foreground"
                      title="Delete this course"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleAddCourse}
            className="flex-1"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Course
          </Button>
        </div>

        <div className="flex justify-end">
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            Submit Courses
          </Button>
        </div>
      </form>
    </Form>
  );
};