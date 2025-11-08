import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { useEffect } from "react";

const clinicalRecordSchema = z.object({
  semester: z.string(),
  clinicalArea: z.string(),
  credits: z.string(),
  prescribedHours: z.string(),
  completedHours: z.string(),
  hospital: z.string(),
});

const clinicalExperienceSchema = z.object({
  records: z.array(clinicalRecordSchema),
});

type ClinicalExperienceFormData = z.infer<typeof clinicalExperienceSchema>;

interface ClinicalExperienceFormProps {
  onSubmit: (data: ClinicalExperienceFormData) => void;
  defaultValues?: Partial<ClinicalExperienceFormData>;
  onProgressChange?: (progress: number) => void;
}

export const ClinicalExperienceForm = ({ onSubmit, defaultValues, onProgressChange }: ClinicalExperienceFormProps) => {
  const form = useForm<ClinicalExperienceFormData>({
    resolver: zodResolver(clinicalExperienceSchema),
    defaultValues: defaultValues || {
      records: [{ semester: "", clinicalArea: "", credits: "", prescribedHours: "", completedHours: "", hospital: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "records",
  });

  useEffect(() => {
    const subscription = form.watch((values) => {
      let filledFields = 0;
      const fieldsPerRecord = ["semester", "clinicalArea", "credits", "prescribedHours", "completedHours", "hospital"];
      values.records?.forEach((record: any) => {
        filledFields += fieldsPerRecord.filter(
          (field) => record[field] && record[field].toString().trim() !== ""
        ).length;
      });
      const totalRequiredFields = values.records?.length * fieldsPerRecord.length || 0;
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
                <th className="border p-3 text-left font-semibold">Clinical Area</th>
                <th className="border p-3 text-left font-semibold">Credits</th>
                <th className="border p-3 text-left font-semibold">Prescribed Hours</th>
                <th className="border p-3 text-left font-semibold">Completed Hours</th>
                <th className="border p-3 text-left font-semibold">Hospital/Community</th>
                <th className="border p-3 text-center font-semibold w-20">Action</th>
              </tr>
            </thead>
            <tbody>
              {fields.map((field, index) => (
                <tr key={field.id} className="hover:bg-muted/50">
                  <td className="border p-2">
                    <FormField
                      control={form.control}
                      name={`records.${index}.semester`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input {...field} placeholder="I, II..." className="h-9" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </td>
                  <td className="border p-2">
                    <FormField
                      control={form.control}
                      name={`records.${index}.clinicalArea`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input {...field} placeholder="Clinical area" className="h-9" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </td>
                  <td className="border p-2">
                    <FormField
                      control={form.control}
                      name={`records.${index}.credits`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input type="number" {...field} className="h-9" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </td>
                  <td className="border p-2">
                    <FormField
                      control={form.control}
                      name={`records.${index}.prescribedHours`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input type="number" {...field} className="h-9" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </td>
                  <td className="border p-2">
                    <FormField
                      control={form.control}
                      name={`records.${index}.completedHours`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input type="number" {...field} className="h-9" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </td>
                  <td className="border p-2">
                    <FormField
                      control={form.control}
                      name={`records.${index}.hospital`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input {...field} placeholder="Hospital name" className="h-9" />
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
          onClick={() => append({ semester: "", clinicalArea: "", credits: "", prescribedHours: "", completedHours: "", hospital: "" })}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Clinical Record
        </Button>
      </form>
    </Form>
  );
};