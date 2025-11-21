import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { apiService } from "@/lib/api";
import { toast } from "sonner";

const courseCompletionSchema = z.object({
  courseName: z.string(),
  certificateNumber: z.string(),
  dateOfIssue: z.string(),
});

const courseCompletionFormSchema = z.object({
  studentId: z.string().optional(),
  completions: z.array(courseCompletionSchema),
});

type CourseCompletionFormData = z.infer<typeof courseCompletionFormSchema>;

// Predefined certificate names from the Excel file
const certificateNames = [
  "Name of the Certificate",
  "Course completion certificate",
  "Transfer certificate",
  "Provisional certificate",
  "Degree certificate",
  "Nursing registration certificate",
  "TNAI card"
];

interface CourseCompletionFormProps {
  onSubmit: (data: CourseCompletionFormData) => void;
  defaultValues?: Partial<CourseCompletionFormData>;
  onProgressChange?: (progress: number) => void;
}

export const CourseCompletionForm = ({ onSubmit, defaultValues, onProgressChange }: CourseCompletionFormProps) => {
  const form = useForm<CourseCompletionFormData>({
    resolver: zodResolver(courseCompletionFormSchema),
    defaultValues: defaultValues || {
      completions: certificateNames.map(name => ({
        courseName: name,
        certificateNumber: "",
        dateOfIssue: "",
      })),
    },
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: "completions",
  });

  const handleSubmit = async (data: CourseCompletionFormData) => {
    try {
      // Submit each completion record as separate records
      const promises = data.completions.map(completion =>
        apiService.createCourseCompletion({
          studentId: data.studentId,
          ...completion
        })
      );

      await Promise.all(promises);
      toast.success("Course completion records saved successfully!");
      onSubmit(data);
    } catch (error: any) {
      console.error("Error saving course completion records:", error);
      toast.error(error.response?.data?.message || "Failed to save course completion records");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="overflow-x-auto border rounded-lg">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted">
                <th className="border p-3 text-left font-semibold">Name of the Course</th>
                <th className="border p-3 text-left font-semibold">Certificate Number</th>
                <th className="border p-3 text-left font-semibold">Date of Issue</th>
              </tr>
            </thead>
            <tbody>
              {fields.map((field, index) => (
                <tr key={field.id} className="hover:bg-muted/50">
                  <td className="border p-2 font-medium">{field.courseName}</td>
                  <td className="border p-2">
                    <FormField
                      control={form.control}
                      name={`completions.${index}.certificateNumber`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input {...field} placeholder="Certificate number" className="h-9" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </td>
                  <td className="border p-2">
                    <FormField
                      control={form.control}
                      name={`completions.${index}.dateOfIssue`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input type="date" {...field} className="h-9" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-muted-foreground italic">
          Note: This form records the course completion details and certificate information for various academic and professional documents.
        </p>
        <div className="flex justify-end">
          <Button type="submit">Save Course Completion Details</Button>
        </div>
      </form>
    </Form>
  );
};