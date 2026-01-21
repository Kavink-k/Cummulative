import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem,FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {cn} from "@/lib/utils";
// VerificationForm.tsx

const verificationSchema = z.object({
  semester: z.string(),
  // Adding .nullable() allows the form to accept nulls from the API without crashing
  classTeacherName: z.string().nullable().optional().or(z.literal("")),
  teacherSignature: z.string().nullable().optional().or(z.literal("")),
  principalSignature: z.string().nullable().optional().or(z.literal("")),
});

const verificationFormSchema = z.object({
  studentId: z.string().min(1, "Student ID is required").optional(),
  verifications: z.array(verificationSchema)
});


type VerificationFormData = z.infer<typeof verificationFormSchema>;

const semesters = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];

interface VerificationFormProps {
  onSubmit: (data: VerificationFormData) => void;
  defaultValues?: Partial<VerificationFormData>;
  onProgressChange?: (progress: number) => void;
}

export const VerificationForm = ({ onSubmit, defaultValues, onProgressChange }: VerificationFormProps) => {
  const form = useForm<VerificationFormData>({
    resolver: zodResolver(verificationFormSchema),
    defaultValues: {
      studentId: defaultValues?.studentId,
      verifications: defaultValues?.verifications?.length
        ? defaultValues.verifications
        : semesters.map(sem => ({
          semester: sem,
          classTeacherName: "",
          teacherSignature: "",
          principalSignature: "",
        })),
    },
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: "verifications",
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Table Layout for All Semesters */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-border">
            <thead>
              <tr className="bg-muted/50">
                <th className="border border-border p-3 text-left font-semibold">Semester</th>
                <th className="border border-border p-3 text-left font-semibold">Name of Class Teacher/Coordinator</th>
                <th className="border border-border p-3 text-left font-semibold">Signature of Class Teacher with Date</th>
                <th className="border border-border p-3 text-left font-semibold">Signature of Principal with Date</th>
              </tr>
            </thead>
            <tbody>
  {fields.map((field, index) => (
    <tr key={field.id} className="hover:bg-muted/30 transition-colors">

      {/* Semester (readonly) */}
      <td className="border border-border p-3 font-medium">
        {field.semester}
        {/* Hidden field so form submits the semester */}
        <input
          type="hidden"
          {...form.register(`verifications.${index}.semester`)}
          value={field.semester}
        />
      </td>

      {/* Class Teacher Name */}
      <td className="border border-border p-2">
        <FormField
          control={form.control}
          name={`verifications.${index}.classTeacherName`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Enter teacher name"
                  className={cn(
                    "border-0 h-9 focus-visible:ring-1",
                    form.formState.errors?.verifications?.[index]?.classTeacherName &&
                      "border border-red-500"
                  )}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </td>

      {/* Teacher Signature Date */}
      <td className="border border-border p-2">
        <FormField
          control={form.control}
          name={`verifications.${index}.teacherSignature`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="date"
                  {...field}
                  className={cn(
                    "border-0 h-9 focus-visible:ring-1",
                    form.formState.errors?.verifications?.[index]?.teacherSignature &&
                      "border border-red-500"
                  )}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </td>

      {/* Principal Signature Date */}
      <td className="border border-border p-2">
        <FormField
          control={form.control}
          name={`verifications.${index}.principalSignature`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="date"
                  {...field}
                  className={cn(
                    "border-0 h-9 focus-visible:ring-1",
                    form.formState.errors?.verifications?.[index]?.principalSignature &&
                      "border border-red-500"
                  )}
                />
              </FormControl>
              <FormMessage />
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
          Note: This form records the verification of cumulative records by class teachers/coordinators and the principal for each semester.
        </p>
      </form>
    </Form>
  );
};
