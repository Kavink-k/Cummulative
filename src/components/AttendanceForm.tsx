import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";

// Schema - Allow nulls for empty numeric fields
const numberOrNull = z.union([
  z.string(),
  z.number(),
  z.null()
]).optional().transform(val => val === "" ? null : val); 
// Note: Since the API now cleans data, we keep string validation but allow empty strings 
// which we can clean in the API layer or here. keeping it simple string is safest for UI
// but backend might want numbers. 

const semesterAttendanceSchema = z.object({
  semester: z.string(),
  workingDays: z.string().optional(),
  annualLeave: z.string().optional(),
  sickLeave: z.string().optional(),
  gazettedHolidays: z.string().optional(),
  otherLeave: z.string().optional(),
  compensationDaysHours: z.string().optional(),
});

const attendanceSchema = z.object({
  studentId: z.string().optional(),
  semesters: z.array(semesterAttendanceSchema),
});

type AttendanceFormData = z.infer<typeof attendanceSchema>;

const semestersList = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];

interface AttendanceFormProps {
  onSubmit: (data: AttendanceFormData) => void;
  defaultValues?: Partial<AttendanceFormData>;
  onProgressChange?: (progress: number) => void;
}

export const AttendanceForm = ({ onSubmit, defaultValues, onProgressChange }: AttendanceFormProps) => {
  
  const defaultSemesterRows = semestersList.map(sem => ({
    semester: sem,
    workingDays: "",
    annualLeave: "",
    sickLeave: "",
    gazettedHolidays: "",
    otherLeave: "",
    compensationDaysHours: "",
  }));

  const form = useForm<AttendanceFormData>({
    resolver: zodResolver(attendanceSchema),
    defaultValues: {
      studentId: defaultValues?.studentId || "",
      semesters: (defaultValues?.semesters?.length ?? 0) > 0 
        ? defaultValues?.semesters 
        : defaultSemesterRows,
    },
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
        "workingDays", "annualLeave", "sickLeave", 
        "gazettedHolidays", "otherLeave", "compensationDaysHours"
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

  // Update form if defaultValues changes (e.g. studentId loads later)
  useEffect(() => {
    if (defaultValues?.studentId) {
      const currentValues = form.getValues();
      if (!currentValues.studentId) {
        form.setValue("studentId", defaultValues.studentId);
      }
    }
  }, [defaultValues, form]);

  return (
    <Form {...form}>
      <form id="active-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        
        {/* Hidden Student ID Field */}
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
                <th className="border p-2 text-left font-semibold w-24">Semester</th>
                <th className="border p-2 text-left font-semibold">Working Days</th>
                <th className="border p-2 text-left font-semibold">Annual Leave</th>
                <th className="border p-2 text-left font-semibold">Sick Leave</th>
                <th className="border p-2 text-left font-semibold">Gazetted Holidays</th>
                <th className="border p-2 text-left font-semibold">Other Leave</th>
                <th className="border p-2 text-left font-semibold">Compensation</th>
              </tr>
            </thead>
            <tbody>
              {fields.map((field, index) => (
                <tr key={field.id} className="hover:bg-muted/50">
                  <td className="border p-2 font-medium text-center bg-muted/20">
                    {field.semester}
                  </td>
                  
                  <td className="border p-1">
                    <FormField control={form.control} name={`semesters.${index}.workingDays`} render={({ field }) => (
                        <FormItem><FormControl><Input type="number" {...field} className="h-8 text-xs" /></FormControl></FormItem>
                    )} />
                  </td>
                  <td className="border p-1">
                    <FormField control={form.control} name={`semesters.${index}.annualLeave`} render={({ field }) => (
                        <FormItem><FormControl><Input type="number" {...field} className="h-8 text-xs" /></FormControl></FormItem>
                    )} />
                  </td>
                  <td className="border p-1">
                    <FormField control={form.control} name={`semesters.${index}.sickLeave`} render={({ field }) => (
                        <FormItem><FormControl><Input type="number" {...field} className="h-8 text-xs" /></FormControl></FormItem>
                    )} />
                  </td>
                  <td className="border p-1">
                    <FormField control={form.control} name={`semesters.${index}.gazettedHolidays`} render={({ field }) => (
                        <FormItem><FormControl><Input type="number" {...field} className="h-8 text-xs" /></FormControl></FormItem>
                    )} />
                  </td>
                  <td className="border p-1">
                    <FormField control={form.control} name={`semesters.${index}.otherLeave`} render={({ field }) => (
                        <FormItem><FormControl><Input type="number" {...field} className="h-8 text-xs" /></FormControl></FormItem>
                    )} />
                  </td>
                  <td className="border p-1">
                    <FormField control={form.control} name={`semesters.${index}.compensationDaysHours`} render={({ field }) => (
                        <FormItem><FormControl><Input {...field} className="h-8 text-xs" placeholder="Days/Hrs" /></FormControl></FormItem>
                    )} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground italic">
          Note: Other Leave includes arrear study holidays, arrear examination leave, and important family functions.
        </p>
      </form>
    </Form>
  );
};