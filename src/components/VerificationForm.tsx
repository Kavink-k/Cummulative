import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const verificationSchema = z.object({
  semester: z.string(),
  classTeacherName: z.string(),
  teacherSignature: z.string(),
  principalSignature: z.string(),
});

const verificationFormSchema = z.object({
  studentId: z.string().optional(),
  verifications: z.array(verificationSchema),
});

type VerificationFormData = z.infer<typeof verificationFormSchema>;

const semesters = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];

interface VerificationFormProps {
  onSubmit: (data: VerificationFormData) => void;
  defaultValues?: Partial<VerificationFormData>;
  onProgressChange?: (progress: number) => void;
}

export const VerificationForm = ({ onSubmit, defaultValues, onProgressChange }: VerificationFormProps) => {
  const [selectedSemester, setSelectedSemester] = useState("I");

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

  // Find the index of the currently selected semester
  const selectedIndex = fields.findIndex(field => field.semester === selectedSemester);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Semester Selector */}
        <div className="flex items-center gap-4 mb-6">
          <label className="text-sm font-semibold whitespace-nowrap">
            Select Semester:
          </label>
          <Select value={selectedSemester} onValueChange={setSelectedSemester}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select semester" />
            </SelectTrigger>
            <SelectContent>
              {semesters.map((sem) => (
                <SelectItem key={sem} value={sem}>
                  Semester {sem}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Display fields for selected semester only */}
        {selectedIndex !== -1 && (
          <div className="space-y-4 border rounded-lg p-6 bg-card">
            <h3 className="text-lg font-semibold mb-4">
              Semester {selectedSemester} Verification
            </h3>

            <FormField
              control={form.control}
              name={`verifications.${selectedIndex}.classTeacherName`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name of Class Teacher/Coordinator</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter teacher name" />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`verifications.${selectedIndex}.teacherSignature`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Signature of Class Teacher with Date</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Signature & date" />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`verifications.${selectedIndex}.principalSignature`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Signature of Principal with Date</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Signature & date" />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        )}

        <p className="text-sm text-muted-foreground italic">
          Note: This form records the verification of cumulative records by class teachers/coordinators and the principal for each semester.
        </p>
      </form>
    </Form>
  );
};
