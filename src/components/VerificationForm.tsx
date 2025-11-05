import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const verificationSchema = z.object({
  semester: z.string(),
  classTeacherName: z.string(),
  teacherSignature: z.string(),
  principalSignature: z.string(),
});

const verificationFormSchema = z.object({
  verifications: z.array(verificationSchema),
});

type VerificationFormData = z.infer<typeof verificationFormSchema>;

const semesters = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];

interface VerificationFormProps {
  onSubmit: (data: VerificationFormData) => void;
  defaultValues?: Partial<VerificationFormData>;
}

export const VerificationForm = ({ onSubmit, defaultValues }: VerificationFormProps) => {
  const form = useForm<VerificationFormData>({
    resolver: zodResolver(verificationFormSchema),
    defaultValues: defaultValues || {
      verifications: semesters.map(sem => ({
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
        <div className="overflow-x-auto border rounded-lg">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted">
                <th className="border p-3 text-left font-semibold">Semester</th>
                <th className="border p-3 text-left font-semibold">Name of Class Teacher/Coordinator</th>
                <th className="border p-3 text-left font-semibold">Signature of Class Teacher with Date</th>
                <th className="border p-3 text-left font-semibold">Signature of Principal with Date</th>
              </tr>
            </thead>
            <tbody>
              {fields.map((field, index) => (
                <tr key={field.id} className="hover:bg-muted/50">
                  <td className="border p-2 font-medium">{field.semester}</td>
                  <td className="border p-2">
                    <FormField
                      control={form.control}
                      name={`verifications.${index}.classTeacherName`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input {...field} placeholder="Teacher name" className="h-9" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </td>
                  <td className="border p-2">
                    <FormField
                      control={form.control}
                      name={`verifications.${index}.teacherSignature`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input {...field} placeholder="Signature & date" className="h-9" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </td>
                  <td className="border p-2">
                    <FormField
                      control={form.control}
                      name={`verifications.${index}.principalSignature`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input {...field} placeholder="Signature & date" className="h-9" />
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
          Note: This form records the verification of cumulative records by class teachers/coordinators and the principal for each semester.
        </p>
      </form>
    </Form>
  );
};