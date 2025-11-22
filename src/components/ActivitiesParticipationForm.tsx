
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";

const semesterActivitySchema = z.object({
  semester: z.string(),
  sports: z.string().optional(),
  coCurricular: z.string().optional(),
  extraCurricular: z.string().optional(),
  sna: z.string().optional(),
  nssYrcRrc: z.string().optional(),
  cne: z.string().optional(),
  awardsRewards: z.string().optional(),
});

const activitiesSchema = z.object({
  studentId: z.string().optional(),
  semesters: z.array(semesterActivitySchema),
});

type ActivitiesFormData = z.infer<typeof activitiesSchema>;

const semestersList = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];

interface ActivitiesParticipationFormProps {
  onSubmit: (data: ActivitiesFormData) => void;
  defaultValues?: Partial<ActivitiesFormData>;
  onProgressChange?: (progress: number) => void;
}

export const ActivitiesParticipationForm = ({ onSubmit, defaultValues, onProgressChange }: ActivitiesParticipationFormProps) => {

  const defaultSemesterRows = semestersList.map(sem => ({
    semester: sem,
    sports: "",
    coCurricular: "",
    extraCurricular: "",
    sna: "",
    nssYrcRrc: "",
    cne: "",
    awardsRewards: "",
  }));

  const initialData = {
    studentId: defaultValues?.studentId || "",
    semesters: (defaultValues?.semesters?.length ?? 0) > 0
      ? defaultValues!.semesters
      : defaultSemesterRows,
  };

  const form = useForm<ActivitiesFormData>({
    resolver: zodResolver(activitiesSchema),
    defaultValues: initialData,
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: "semesters",
  });

  // Progress Tracking
  useEffect(() => {
    const subscription = form.watch((values) => {
      let filledFields = 0;
      const fieldsPerSemester = [
        "sports", "coCurricular", "extraCurricular",
        "sna", "nssYrcRrc", "cne", "awardsRewards"
      ];

      values.semesters?.forEach((semester: any) => {
        if (semester) {
          filledFields += fieldsPerSemester.filter(
            (field) => semester[field] && semester[field].toString().trim() !== ""
          ).length;
        }
      });

      const totalRequiredFields = semestersList.length * fieldsPerSemester.length;
      const progress = (filledFields / totalRequiredFields) * 100;
      onProgressChange?.(progress);
    });
    return () => subscription.unsubscribe();
  }, [form, onProgressChange]);

  useEffect(() => {
    if (defaultValues?.studentId) {
      const currentId = form.getValues("studentId");
      if (!currentId) {
        form.setValue("studentId", defaultValues.studentId);
      }
    }
  }, [defaultValues, form]);

  return (
    <Form {...form}>
      <form id="active-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

        <FormField
          control={form.control}
          name="studentId"
          render={({ field }) => (
            <input type="hidden" {...field} value={field.value || ""} />
          )}
        />

        <div className="overflow-x-auto border rounded-lg">
          <table className="w-full border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-muted text-xs md:text-sm">
                <th className="border p-3 text-left font-semibold w-24">Semester</th>
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
                  <td className="border p-2 font-medium text-center bg-muted/20">
                    {field.semester}
                    {/* CRITICAL FIX: Hidden input ensures 'semester' is sent to API */}
                    <input
                      type="hidden"
                      {...form.register(`semesters.${index}.semester`)}
                      defaultValue={field.semester}
                    />
                  </td>

                  <td className="border p-1">
                    <FormField
                      control={form.control}
                      name={`semesters.${index}.sports`}
                      render={({ field }) => (
                        <FormItem><FormControl><Input {...field} className="h-8 text-xs" /></FormControl></FormItem>
                      )}
                    />
                  </td>
                  <td className="border p-1">
                    <FormField
                      control={form.control}
                      name={`semesters.${index}.coCurricular`}
                      render={({ field }) => (
                        <FormItem><FormControl><Input {...field} className="h-8 text-xs" /></FormControl></FormItem>
                      )}
                    />
                  </td>
                  <td className="border p-1">
                    <FormField
                      control={form.control}
                      name={`semesters.${index}.extraCurricular`}
                      render={({ field }) => (
                        <FormItem><FormControl><Input {...field} className="h-8 text-xs" /></FormControl></FormItem>
                      )}
                    />
                  </td>
                  <td className="border p-1">
                    <FormField
                      control={form.control}
                      name={`semesters.${index}.sna`}
                      render={({ field }) => (
                        <FormItem><FormControl><Input {...field} className="h-8 text-xs" /></FormControl></FormItem>
                      )}
                    />
                  </td>
                  <td className="border p-1">
                    <FormField
                      control={form.control}
                      name={`semesters.${index}.nssYrcRrc`}
                      render={({ field }) => (
                        <FormItem><FormControl><Input {...field} className="h-8 text-xs" /></FormControl></FormItem>
                      )}
                    />
                  </td>
                  <td className="border p-1">
                    <FormField
                      control={form.control}
                      name={`semesters.${index}.cne`}
                      render={({ field }) => (
                        <FormItem><FormControl><Input {...field} className="h-8 text-xs" /></FormControl></FormItem>
                      )}
                    />
                  </td>
                  <td className="border p-1">
                    <FormField
                      control={form.control}
                      name={`semesters.${index}.awardsRewards`}
                      render={({ field }) => (
                        <FormItem><FormControl><Input {...field} className="h-8 text-xs" /></FormControl></FormItem>
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