import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";
import { apiService } from "@/lib/api";
import { toast } from "sonner";

const semesterActivitySchema = z.object({
  semester: z.string(),
  sports: z.string(),
  coCurricular: z.string(),
  extraCurricular: z.string(),
  sna: z.string(),
  nssYrcRrc: z.string(),
  cne: z.string(),
  awardsRewards: z.string(),
});

const activitiesSchema = z.object({
  studentId: z.string().optional(),
  semesters: z.array(semesterActivitySchema),
});

type ActivitiesFormData = z.infer<typeof activitiesSchema>;

const semesters = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];

interface ActivitiesParticipationFormProps {
  onSubmit: (data: ActivitiesFormData) => void;
  defaultValues?: Partial<ActivitiesFormData>;
  onProgressChange?: (progress: number) => void;
}

export const ActivitiesParticipationForm = ({ onSubmit, defaultValues, onProgressChange }: ActivitiesParticipationFormProps) => {
  const form = useForm<ActivitiesFormData>({
    resolver: zodResolver(activitiesSchema),
    defaultValues: defaultValues || {
      semesters: semesters.map(sem => ({
        semester: sem,
        sports: "",
        coCurricular: "",
        extraCurricular: "",
        sna: "",
        nssYrcRrc: "",
        cne: "",
        awardsRewards: "",
      })),
    },
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: "semesters",
  });

  useEffect(() => {
    const subscription = form.watch((values) => {
      let filledFields = 0;
      const fieldsPerSemester = [
        "sports",
        "coCurricular",
        "extraCurricular",
        "sna",
        "nssYrcRrc",
        "cne",
        "awardsRewards"
      ];
      values.semesters?.forEach((semester: any) => {
        filledFields += fieldsPerSemester.filter(
          (field) => semester[field] && semester[field].toString().trim() !== ""
        ).length;
      });
      const totalRequiredFields = semesters.length * fieldsPerSemester.length; // 8 semesters * 7 fields = 56
      const progress = (filledFields / totalRequiredFields) * 100;
      onProgressChange?.(progress);
    });
    return () => subscription.unsubscribe();
  }, [form, onProgressChange]);

  const handleSubmit = async (data: ActivitiesFormData) => {
    try {
      // Submit each semester as separate records
      const promises = data.semesters.map(semester =>
        apiService.createActivityParticipation({
          studentId: data.studentId,
          ...semester
        })
      );

      await Promise.all(promises);
      toast.success("Activities participation saved successfully!");
      onSubmit(data);
    } catch (error: any) {
      console.error("Error saving activities participation:", error);
      toast.error(error.response?.data?.message || "Failed to save activities participation");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="overflow-x-auto border rounded-lg">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted">
                <th className="border p-3 text-left font-semibold">Semester</th>
                <th className="border p-3 text-left font-semibold">Sports</th>
                <th className="border p-3 text-left font-semibold">Co-curricular</th>
                <th className="border p-3 text-left font-semibold">Extra-curricular</th>
                <th className="border p-3 text-left font-semibold">SNA</th>
                <th className="border p-3 text-left font-semibold">NSS/YRC/RRC</th>
                <th className="border p-3 text-left font-semibold">CNE</th>
                <th className="border p-3 text-left font-semibold">Awards/Rewards</th>
              </tr>
            </thead>
            <tbody>
              {fields.map((field, index) => (
                <tr key={field.id} className="hover:bg-muted/50">
                  <td className="border p-2 font-medium">{field.semester}</td>
                  <td className="border p-1">
                    <FormField
                      control={form.control}
                      name={`semesters.${index}.sports`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input {...field} className="h-9" placeholder="Sports activities" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </td>
                  <td className="border p-1">
                    <FormField
                      control={form.control}
                      name={`semesters.${index}.coCurricular`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input {...field} className="h-9" placeholder="Co-curricular" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </td>
                  <td className="border p-1">
                    <FormField
                      control={form.control}
                      name={`semesters.${index}.extraCurricular`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input {...field} className="h-9" placeholder="Extra-curricular" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </td>
                  <td className="border p-1">
                    <FormField
                      control={form.control}
                      name={`semesters.${index}.sna`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input {...field} className="h-9" placeholder="SNA" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </td>
                  <td className="border p-1">
                    <FormField
                      control={form.control}
                      name={`semesters.${index}.nssYrcRrc`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input {...field} className="h-9" placeholder="NSS/YRC/RRC" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </td>
                  <td className="border p-1">
                    <FormField
                      control={form.control}
                      name={`semesters.${index}.cne`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input {...field} className="h-9" placeholder="CNE" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </td>
                  <td className="border p-1">
                    <FormField
                      control={form.control}
                      name={`semesters.${index}.awardsRewards`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input {...field} className="h-9" placeholder="Awards/Rewards" />
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
      </form>
    </Form>
  );
};