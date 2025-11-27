import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

// --- Helper for Numbers (Handles "123" -> 123 and "" -> null) ---
const numberOrNull = z.union([
  z.number(),
  z.string().transform((val) => (val === "" ? null : Number(val))),
  z.null(),
]);

const admissionDetailsSchema = z.object({
  studentId: z.string().min(1, "Student ID is required"),

  // Admission
  dateOfAdmission: z.string().min(1, "Date of admission is required"),
  admissionNumber: z.string().min(1, "Admission number is required"),
  rollNumber: z.string().min(1, "Roll number is required"),
  universityRegistration: z
    .string()
    .min(1, "University registration number is required"),

  // Certificates – if your form requires them, add min(1)
  migrationCertificateNo: z
    .string()
    .min(1, "Migration certificate number is required"),
  migrationCertificateDate: z
    .string()
    .min(1, "Migration certificate date is required"),

  eligibilityCertificateNo: z
    .string()
    .min(1, "Eligibility certificate number is required"),
  eligibilityCertificateDate: z
    .string()
    .min(1, "Eligibility certificate date is required"),

  // Allotment
  allotmentCategory: z.string().min(1, "Allotment category is required"),
  govtAllotmentNo: z.string().min(1, "Government allotment number is required"),
  privateAllotmentNo: z.string().min(1, "Private allotment number is required"),

  // Community / Nativity
  communityCertificateNo: z
    .string()
    .min(1, "Community certificate number is required"),
  communityCertificateDate: z
    .string()
    .min(1, "Community certificate date is required"),

  nativityCertificateNo: z
    .string()
    .min(1, "Nativity certificate number is required"),
  nativityCertificateDate: z
    .string()
    .min(1, "Nativity certificate date is required"),

  // Discontinuation
  dateOfDiscontinuation: z
    .string()
    .optional(),
  reasonForDiscontinuation: z
    .string()
    .optional(),

  // Financial Aid
  scholarshipSource: z.string().min(1, "Scholarship source is required"),
  scholarshipAmount: numberOrNull, // keep as-is (since may be null)
  bankLoanSource: z.string().optional(),
  bankLoanAmount: numberOrNull, // keep as-is (since may be null)
});

type AdmissionDetailsFormData = z.infer<typeof admissionDetailsSchema>;

interface AdmissionDetailsFormProps {
  onSubmit: (data: AdmissionDetailsFormData) => void;
  defaultValues?: Partial<AdmissionDetailsFormData>;
  onProgressChange?: (progress: number) => void;
}

export const AdmissionDetailsForm = ({
  onSubmit,
  defaultValues,
  onProgressChange,
}: AdmissionDetailsFormProps) => {
  const form = useForm<AdmissionDetailsFormData>({
    resolver: zodResolver(admissionDetailsSchema),
    defaultValues: defaultValues || {
      studentId: "",
      allotmentCategory: "",
      scholarshipAmount: null,
      bankLoanAmount: null,
    },
  });

  // Track progress
  useEffect(() => {
    const subscription = form.watch((values) => {
      const requiredFields = [
        "dateOfAdmission",
        "admissionNumber",
        "rollNumber",
        "universityRegistration",
        "allotmentCategory",
      ];
      const filledFields = requiredFields.filter(
        (field) =>
          values[field as keyof typeof values] &&
          values[field as keyof typeof values]?.toString().trim() !== ""
      ).length;

      onProgressChange?.((filledFields / requiredFields.length) * 100);
    });
    return () => subscription.unsubscribe();
  }, [form, onProgressChange]);

  /* FIX: Removed the useEffect that calls form.reset(defaultValues).
     This prevents the form from wiping user input on every re-render 
     triggered by progress updates. 
  */

  return (
    <Form {...form}>
      {/* id="active-form" helps Index.tsx find this form to trigger submit */}
      <form
        id="active-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
      >
        {/* Hidden Student ID (Read Only) */}
        <div className="flex justify-end">
          <FormField
            control={form.control}
            name="studentId"
            render={({ field }) => (
              <FormItem className="w-40">
                <FormLabel>Student ID</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value || ""}
                    readOnly
                    className="bg-muted"
                    placeholder="Auto-filled"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="dateOfAdmission"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of Admission</FormLabel>
                <FormControl>
                  <Input type="date" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="admissionNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Admission Number</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter admission number"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="rollNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Roll Number</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter roll number"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="universityRegistration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>University Registration</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter university registration"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="allotmentCategory"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Admission Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="government">Government</SelectItem>
                    <SelectItem value="management">Management</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4 border-t pt-6">
          <h3 className="font-semibold text-lg">Certificates</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="migrationCertificateNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Migration Certificate No.</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ""} />
                  </FormControl>
                   <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="migrationCertificateDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Migration Certificate Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} value={field.value || ""} />
                  </FormControl>
                   <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="eligibilityCertificateNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Eligibility Certificate No.</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ""} />
                  </FormControl>
                   <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="eligibilityCertificateDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Eligibility Certificate Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} value={field.value || ""} />
                  </FormControl>
                   <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="govtAllotmentNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Govt Allotment Order No.</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ""} />
                  </FormControl>
                   <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="privateAllotmentNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Private Allotment Order No.</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ""} />
                  </FormControl>
                   <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="communityCertificateNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Community Certificate No.</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ""} />
                  </FormControl>
                   <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="communityCertificateDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Community Certificate Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} value={field.value || ""} />
                  </FormControl>
                   <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nativityCertificateNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nativity Certificate No.</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ""} />
                  </FormControl>
                   <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nativityCertificateDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nativity Certificate Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} value={field.value || ""} />
                  </FormControl>
                   <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-4 border-t pt-6">
          <h3 className="font-semibold text-lg">Financial Aid</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="scholarshipSource"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Scholarship Source</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ""} />
                  </FormControl>
                   <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="scholarshipAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Scholarship Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      placeholder="0"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bankLoanSource"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bank Loan Source</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ""} />
                  </FormControl>
                   <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bankLoanAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bank Loan Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      placeholder="0"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-4 border-t pt-6">
          <h3 className="font-semibold text-lg">
            Discontinuation (If Applicable)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="dateOfDiscontinuation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Discontinuation</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} value={field.value || ""} />  
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="reasonForDiscontinuation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason for Discontinuation</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ""} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end md:hidden">
          <Button type="submit">Save & Next</Button>
        </div>
      </form>
    </Form>
  );
};
