import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect } from "react";
import { apiService } from "@/lib/api";
import { toast } from "sonner";

const admissionDetailsSchema = z.object({
  studentId: z.string().optional(),
  dateOfAdmission: z.string().min(1, "Date of admission is required"),
  admissionNumber: z.string().min(1, "Admission number is required"),
  rollNumber: z.string().min(1, "Roll number is required"),
  universityRegistration: z.string().min(1, "University registration is required"),
  migrationCertificateNo: z.string().optional(),
  migrationCertificateDate: z.string().optional(),
  eligibilityCertificateNo: z.string().optional(),
  eligibilityCertificateDate: z.string().optional(),
  allotmentCategory: z.string().min(1, "Allotment category is required"),
  govtAllotmentNo: z.string().optional(),
  privateAllotmentNo: z.string().optional(),
  communityCertificateNo: z.string().optional(),
  communityCertificateDate: z.string().optional(),
  nativityCertificateNo: z.string().optional(),
  nativityCertificateDate: z.string().optional(),
  dateOfDiscontinuation: z.string().optional(),
  reasonForDiscontinuation: z.string().optional(),
  scholarshipSource: z.string().optional(),
  scholarshipAmount: z.string().optional(),
  bankLoanSource: z.string().optional(),
  bankLoanAmount: z.string().optional(),
});

type AdmissionDetailsFormData = z.infer<typeof admissionDetailsSchema>;

interface AdmissionDetailsFormProps {
  onSubmit: (data: AdmissionDetailsFormData) => void;
  defaultValues?: Partial<AdmissionDetailsFormData>;
  onProgressChange?: (progress: number) => void;
  onChange?: (data: AdmissionDetailsFormData) => void;
}

export const AdmissionDetailsForm = ({ onSubmit, defaultValues, onProgressChange }: AdmissionDetailsFormProps) => {
  const form = useForm<AdmissionDetailsFormData>({
    resolver: zodResolver(admissionDetailsSchema),
    defaultValues: defaultValues || {},
  });

  useEffect(() => {
    const subscription = form.watch((values) => {
      const requiredFields = [
        "dateOfAdmission",
        "admissionNumber",
        "rollNumber",
        "universityRegistration",
        "allotmentCategory"
      ];
      const filledFields = requiredFields.filter(
        (field) => values[field] && values[field].toString().trim() !== ""
      ).length;
      const progress = (filledFields / requiredFields.length) * 100;
      onProgressChange?.(progress);
    });
    return () => subscription.unsubscribe();
  }, [form, onProgressChange]);

  const handleSubmit = async (data: AdmissionDetailsFormData) => {
    try {
      await apiService.createAdmissionDetail(data);
      toast.success("Admission details saved successfully!");
      onSubmit(data);
    } catch (error: any) {
      console.error("Error saving admission details:", error);
      toast.error(error.response?.data?.message || "Failed to save admission details");
    }
  };

  // Reset form when defaultValues change
  useEffect(() => {
    if (defaultValues) {
      form.reset(defaultValues);
    }
  }, [defaultValues, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="dateOfAdmission"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of Admission</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
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
                  <Input placeholder="Enter admission number" {...field} />
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
                  <Input placeholder="Enter roll number" {...field} />
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
                  <Input placeholder="Enter university registration" {...field} />
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                    <Input placeholder="Enter certificate number" {...field} />
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
                    <Input type="date" {...field} />
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
                    <Input placeholder="Enter certificate number" {...field} />
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
                    <Input type="date" {...field} />
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
                    <Input placeholder="Enter allotment number" {...field} />
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
                    <Input placeholder="Enter allotment number" {...field} />
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
                    <Input placeholder="Enter certificate number" {...field} />
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
                    <Input type="date" {...field} />
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
                    <Input placeholder="Enter certificate number" {...field} />
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
                    <Input type="date" {...field} />
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
                    <Input placeholder="Enter scholarship source" {...field} />
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
                    <Input type="number" placeholder="Enter amount" {...field} />
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
                    <Input placeholder="Enter bank name" {...field} />
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
                    <Input type="number" placeholder="Enter amount" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-4 border-t pt-6">
          <h3 className="font-semibold text-lg">Discontinuation (If Applicable)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="dateOfDiscontinuation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Discontinuation</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
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
                    <Input placeholder="Enter reason" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </form>
    </Form>
  );
};