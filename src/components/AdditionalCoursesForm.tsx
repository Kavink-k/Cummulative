import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";

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
}

export const AdditionalCoursesForm = ({ onSubmit, defaultValues }: AdditionalCoursesFormProps) => {
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
                <th className="border p-3 text-center font-semibold w-20">Action</th>
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
          onClick={() => append({ courseName: "", from: "", to: "" })}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Course
        </Button>
      </form>
    </Form>
  );
};