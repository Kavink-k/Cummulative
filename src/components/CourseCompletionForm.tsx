import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";

const completionSchema = z.object({
  courseName: z.string(),
  certificateNumber: z.string(),
  dateOfIssue: z.string(),
});

const courseCompletionSchema = z.object({
  completions: z.array(completionSchema),
});

type CourseCompletionFormData = z.infer<typeof courseCompletionSchema>;

interface CourseCompletionFormProps {
  onSubmit: (data: CourseCompletionFormData) => void;
  defaultValues?: Partial<CourseCompletionFormData>;
}

export const CourseCompletionForm = ({ onSubmit, defaultValues }: CourseCompletionFormProps) => {
  const form = useForm<CourseCompletionFormData>({
    resolver: zodResolver(courseCompletionSchema),
    defaultValues: defaultValues || {
      completions: [{ courseName: "", certificateNumber: "", dateOfIssue: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "completions",
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="overflow-x-auto border rounded-lg">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted">
                <th className="border p-3 text-left font-semibold">Name of the Course</th>
                <th className="border p-3 text-left font-semibold">Certificate Number</th>
                <th className="border p-3 text-left font-semibold">Date of Issue</th>
                <th className="border p-3 text-center font-semibold w-20">Action</th>
              </tr>
            </thead>
            <tbody>
              {fields.map((field, index) => (
                <tr key={field.id} className="hover:bg-muted/50">
                  <td className="border p-2">
                    <FormField
                      control={form.control}
                      name={`completions.${index}.courseName`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input {...field} placeholder="Course name" className="h-9" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </td>
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
                  <td className="border p-2 text-center">
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                      >
                        <X className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => append({ courseName: "", certificateNumber: "", dateOfIssue: "" })}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Completion Record
        </Button>
      </form>
    </Form>
  );
};