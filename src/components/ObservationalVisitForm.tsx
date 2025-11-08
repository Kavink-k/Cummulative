import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { useEffect } from "react";

const visitSchema = z.object({
  semester: z.string(),
  institution: z.string(),
  place: z.string(),
  date: z.string(),
});

const observationalVisitSchema = z.object({
  visits: z.array(visitSchema),
});

type ObservationalVisitFormData = z.infer<typeof observationalVisitSchema>;

interface ObservationalVisitFormProps {
  onSubmit: (data: ObservationalVisitFormData) => void;
  defaultValues?: Partial<ObservationalVisitFormData>;
  onProgressChange?: (progress: number) => void;
}

export const ObservationalVisitForm = ({ onSubmit, defaultValues, onProgressChange }: ObservationalVisitFormProps) => {
  const form = useForm<ObservationalVisitFormData>({
    resolver: zodResolver(observationalVisitSchema),
    defaultValues: defaultValues || {
      visits: [{ semester: "", institution: "", place: "", date: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "visits",
  });

  useEffect(() => {
    const subscription = form.watch((values) => {
      let filledFields = 0;
      const fieldsPerVisit = ["semester", "institution", "place", "date"];
      values.visits?.forEach((visit: any) => {
        filledFields += fieldsPerVisit.filter(
          (field) => visit[field] && visit[field].toString().trim() !== ""
        ).length;
      });
      const totalRequiredFields = values.visits?.length * fieldsPerVisit.length || 0;
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
                <th className="border p-3 text-left font-semibold">Institution</th>
                <th className="border p-3 text-left font-semibold">Place</th>
                <th className="border p-3 text-left font-semibold">Date</th>
                <th className="border p-3 text-center font-semibold w-20">Action</th>
              </tr>
            </thead>
            <tbody>
              {fields.map((field, index) => (
                <tr key={field.id} className="hover:bg-muted/50">
                  <td className="border p-2">
                    <FormField
                      control={form.control}
                      name={`visits.${index}.semester`}
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
                      name={`visits.${index}.institution`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input {...field} placeholder="Institution name" className="h-9" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </td>
                  <td className="border p-2">
                    <FormField
                      control={form.control}
                      name={`visits.${index}.place`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input {...field} placeholder="Location" className="h-9" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </td>
                  <td className="border p-2">
                    <FormField
                      control={form.control}
                      name={`visits.${index}.date`}
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
          onClick={() => append({ semester: "", institution: "", place: "", date: "" })}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Visit Record
        </Button>
      </form>
    </Form>
  );
};