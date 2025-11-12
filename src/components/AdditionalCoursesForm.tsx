import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { useEffect } from "react";

const courseSchema = z.object({
  courseName: z.string(),
  from: z.string(),
  to: z.string(),
});

const additionalCoursesSchema = z.object({
  courses: z.array(courseSchema),
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
      courses: [{ courseName: "", from: "", to: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "courses",
  });

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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="overflow-x-auto border rounded-lg">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted">
                <th className="border p-3 text-left font-semibold">Name of the Course</th>
                <th className="border p-3 text-left font-semibold">From</th>
                <th className="border p-3 text-left font-semibold">To</th>
              </tr>
            </thead>
            <tbody>
              {fields.map((field, index) => (
                <tr key={field.id} className="hover:bg-muted/50">
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => append({ courseName: "", from: "", to: "" })}
            className="flex-1"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Course
          </Button>
          
          {fields.length > 1 && (
            <Button
              type="button"
              variant="destructive"
              onClick={() => remove(fields.length - 1)}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Remove Last
            </Button>
          )}
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