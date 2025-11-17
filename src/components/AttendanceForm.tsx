import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";

const semesterAttendanceSchema = z.object({
  semester: z.string(),
  workingDays: z.string(),
  annualLeave: z.string(),
  sickLeave: z.string(),
  gazettedHolidays: z.string(),
  otherLeave: z.string(),
  compensationDaysHours: z.string(),
});

const attendanceSchema = z.object({
  studentId: z.string().optional(),
  semesters: z.array(semesterAttendanceSchema),
});

type AttendanceFormData = z.infer<typeof attendanceSchema>;

const semesters = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];

interface AttendanceFormProps {
  onSubmit: (data: AttendanceFormData) => void;
  defaultValues?: Partial<AttendanceFormData>;
  onProgressChange?: (progress: number) => void;
}

export const AttendanceForm = ({ onSubmit, defaultValues, onProgressChange }: AttendanceFormProps) => {
  const form = useForm<AttendanceFormData>({
    resolver: zodResolver(attendanceSchema),
    defaultValues: defaultValues || {
      semesters: semesters.map(sem => ({
        semester: sem,
        workingDays: "",
        annualLeave: "",
        sickLeave: "",
        gazettedHolidays: "",
        otherLeave: "",
        compensationDaysHours: "",
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
        "workingDays",
        "annualLeave",
        "sickLeave",
        "gazettedHolidays",
        "otherLeave",
        "compensationDaysHours"
      ];
      values.semesters?.forEach((semester: any) => {
        filledFields += fieldsPerSemester.filter(
          (field) => semester[field] && semester[field].toString().trim() !== ""
        ).length;
      });
      const totalRequiredFields = semesters.length * fieldsPerSemester.length; // 8 * 6 = 48
      const progress = (filledFields / totalRequiredFields) * 100;
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
                <th className="border p-3 text-left font-semibold">Working Days</th>
                <th className="border p-3 text-left font-semibold">Annual Leave</th>
                <th className="border p-3 text-left font-semibold">Sick Leave</th>
                <th className="border p-3 text-left font-semibold">Gazetted Holidays</th>
                <th className="border p-3 text-left font-semibold">Other Leave</th>
                <th className="border p-3 text-left font-semibold">Compensation</th>
              </tr>
            </thead>
            <tbody>
              {fields.map((field, index) => (
                <tr key={field.id} className="hover:bg-muted/50">
                  <td className="border p-2 font-medium">{field.semester}</td>
                  <td className="border p-1">
                    <FormField
                      control={form.control}
                      name={`semesters.${index}.workingDays`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input type="number" {...field} className="h-9" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </td>
                  <td className="border p-1">
                    <FormField
                      control={form.control}
                      name={`semesters.${index}.annualLeave`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input type="number" {...field} className="h-9" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </td>
                  <td className="border p-1">
                    <FormField
                      control={form.control}
                      name={`semesters.${index}.sickLeave`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input type="number" {...field} className="h-9" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </td>
                  <td className="border p-1">
                    <FormField
                      control={form.control}
                      name={`semesters.${index}.gazettedHolidays`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input type="number" {...field} className="h-9" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </td>
                  <td className="border p-1">
                    <FormField
                      control={form.control}
                      name={`semesters.${index}.otherLeave`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input type="number" {...field} className="h-9" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </td>
                  <td className="border p-1">
                    <FormField
                      control={form.control}
                      name={`semesters.${index}.compensationDaysHours`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input {...field} className="h-9" placeholder="Days/Hours" />
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
          Note: Other Leave includes arrear study holidays, arrear examination leave, and important family functions
        </p>
      </form>
    </Form>
  );
};