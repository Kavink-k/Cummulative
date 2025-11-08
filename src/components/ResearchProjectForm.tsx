import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { useEffect } from "react";

const projectSchema = z.object({
  semester: z.string(),
  areaOfStudy: z.string(),
  type: z.string(),
  projectTitle: z.string(),
});

const researchProjectSchema = z.object({
  projects: z.array(projectSchema),
});

type ResearchProjectFormData = z.infer<typeof researchProjectSchema>;

interface ResearchProjectFormProps {
  onSubmit: (data: ResearchProjectFormData) => void;
  defaultValues?: Partial<ResearchProjectFormData>;
  onProgressChange?: (progress: number) => void;
}

export const ResearchProjectForm = ({ onSubmit, defaultValues, onProgressChange }: ResearchProjectFormProps) => {
  const form = useForm<ResearchProjectFormData>({
    resolver: zodResolver(researchProjectSchema),
    defaultValues: defaultValues || {
      projects: [{ semester: "", areaOfStudy: "", type: "", projectTitle: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "projects",
  });

  useEffect(() => {
    const subscription = form.watch((values) => {
      let filledFields = 0;
      const fieldsPerProject = ["semester", "areaOfStudy", "type", "projectTitle"];
      values.projects?.forEach((project: any) => {
        filledFields += fieldsPerProject.filter(
          (field) => project[field] && project[field].toString().trim() !== ""
        ).length;
      });
      const totalRequiredFields = values.projects?.length * fieldsPerProject.length || 0;
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
                <th className="border p-3 text-left font-semibold">Semester</th>
                <th className="border p-3 text-left font-semibold">Area of Study/Discipline</th>
                <th className="border p-3 text-left font-semibold">Group/Individual</th>
                <th className="border p-3 text-left font-semibold">Project Title</th>
                <th className="border p-3 text-center font-semibold w-20">Action</th>
              </tr>
            </thead>
            <tbody>
              {fields.map((field, index) => (
                <tr key={field.id} className="hover:bg-muted/50">
                  <td className="border p-2">
                    <FormField
                      control={form.control}
                      name={`projects.${index}.semester`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input {...field} placeholder="I, II, III..." className="h-9" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </td>
                  <td className="border p-2">
                    <FormField
                      control={form.control}
                      name={`projects.${index}.areaOfStudy`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input {...field} placeholder="Area of study" className="h-9" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </td>
                  <td className="border p-2">
                    <FormField
                      control={form.control}
                      name={`projects.${index}.type`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input {...field} placeholder="Group/Individual" className="h-9" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </td>
                  <td className="border p-2">
                    <FormField
                      control={form.control}
                      name={`projects.${index}.projectTitle`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input {...field} placeholder="Project title" className="h-9" />
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
          onClick={() => append({ semester: "", areaOfStudy: "", type: "", projectTitle: "" })}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Research Project
        </Button>
      </form>
    </Form>
  );
};