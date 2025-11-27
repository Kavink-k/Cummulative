import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem,FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

const clinicalRecordSchema = z.object({
  semester: z.string(),
  clinicalArea: z.string(),
  credits: z.string(),
  prescribedWeeks: z.string(),
  prescribedHours: z.string(),
  completedHours: z
  .string()
  .min(1, "")
  .regex(/^\d+$/, "Completed hours must be a valid number"),

hospital: z
  .string()
  .min(2, ""),
});

const clinicalExperienceSchema = z.object({
  studentId: z.string().optional(),
  records: z.array(clinicalRecordSchema),
});

type ClinicalExperienceFormData = z.infer<typeof clinicalExperienceSchema>;

// Pre-populated data from the Excel file - all clinical areas for all semesters
const allClinicalRecords = [
  // Semester I
  { semester: "I", clinicalArea: "Nursing Foundation I including First Aid Module", credits: "2", prescribedWeeks: "10", prescribedHours: "160" },
  { semester: "I", clinicalArea: "General Medical Ward", credits: "1", prescribedWeeks: "5", prescribedHours: "80" },
  { semester: "I", clinicalArea: "General Surgical Ward", credits: "1", prescribedWeeks: "5", prescribedHours: "80" },

  // Semester II
  { semester: "II", clinicalArea: "Nursing Foundation II including Health Assessment Module", credits: "4", prescribedWeeks: "16", prescribedHours: "320" },
  { semester: "II", clinicalArea: "General Medical Ward", credits: "2", prescribedWeeks: "8", prescribedHours: "160" },
  { semester: "II", clinicalArea: "General Surgical Ward", credits: "2", prescribedWeeks: "8", prescribedHours: "160" },

  // Semester III
  { semester: "III", clinicalArea: "Adult Health Nursing I with integrated pathophysiology including BCLS module", credits: "6", prescribedWeeks: "18", prescribedHours: "480" },
  { semester: "III", clinicalArea: "General Medical Ward", credits: "1.4", prescribedWeeks: "4", prescribedHours: "108" },
  { semester: "III", clinicalArea: "General Surgical Ward", credits: "1.4", prescribedWeeks: "4", prescribedHours: "108" },
  { semester: "III", clinicalArea: "Cardiology Ward", credits: "0.6", prescribedWeeks: "2", prescribedHours: "50" },
  { semester: "III", clinicalArea: "Dermatology Ward", credits: "0.3", prescribedWeeks: "1", prescribedHours: "28" },
  { semester: "III", clinicalArea: "Isolation Ward", credits: "0.3", prescribedWeeks: "1", prescribedHours: "28" },
  { semester: "III", clinicalArea: "Orthopedic Ward", credits: "0.6", prescribedWeeks: "2", prescribedHours: "50" },
  { semester: "III", clinicalArea: "Operation Theatre", credits: "0.4", prescribedWeeks: "4", prescribedHours: "108" },

  // Semester IV
  { semester: "IV", clinicalArea: "Adult Health Nursing II with integrated pathophysiology including Geriatric Nursing and Palliative Care Module", credits: "6", prescribedWeeks: "20", prescribedHours: "480" },
  { semester: "IV", clinicalArea: "ENT Ward & OPD", credits: "0.6", prescribedWeeks: "2", prescribedHours: "48" },
  { semester: "IV", clinicalArea: "Ophthalmology Unit", credits: "0.6", prescribedWeeks: "2", prescribedHours: "48" },
  { semester: "IV", clinicalArea: "Renal / Nephrology Ward including Dialysis Unit", credits: "0.6", prescribedWeeks: "2", prescribedHours: "48" },
  { semester: "IV", clinicalArea: "Burns Unit / Reconstructive Surgical Unit", credits: "0.6", prescribedWeeks: "2", prescribedHours: "48" },
  { semester: "IV", clinicalArea: "Neurology - Medical / Surgical Ward", credits: "1", prescribedWeeks: "3", prescribedHours: "72" },
  { semester: "IV", clinicalArea: "Isolation Ward / Medical Ward", credits: "0.2", prescribedWeeks: "1", prescribedHours: "24" },
  { semester: "IV", clinicalArea: "Oncology Ward (including Day Care / Radiotherapy Unit)", credits: "1", prescribedWeeks: "3", prescribedHours: "72" },
  { semester: "IV", clinicalArea: "Emergency Room/Unit", credits: "0.6", prescribedWeeks: "2", prescribedHours: "48" },

  // Semester V
  { semester: "V", clinicalArea: "Child Health Nursing I", credits: "2", prescribedWeeks: "5", prescribedHours: "160" },
  { semester: "V", clinicalArea: "Pediatric Medical Ward", credits: "0.8", prescribedWeeks: "2", prescribedHours: "60" },
  { semester: "V", clinicalArea: "Pediatric Surgical Ward", credits: "0.8", prescribedWeeks: "2", prescribedHours: "60" },
  { semester: "V", clinicalArea: "Pediatric OPD / Immunization Room", credits: "0.4", prescribedWeeks: "1", prescribedHours: "40" },
  { semester: "V", clinicalArea: "Mental Health Nursing", credits: "1", prescribedWeeks: "3", prescribedHours: "80" },
  { semester: "V", clinicalArea: "Psychiatric OPD", credits: "0.4", prescribedWeeks: "1", prescribedHours: "30" },
  { semester: "V", clinicalArea: "Psychiatric In-patient Ward", credits: "0.6", prescribedWeeks: "2", prescribedHours: "50" },
  { semester: "V", clinicalArea: "Community Health Nursing I", credits: "2", prescribedWeeks: "4", prescribedHours: "160" },
  { semester: "V", clinicalArea: "Urban", credits: "1", prescribedWeeks: "2", prescribedHours: "80" },
  { semester: "V", clinicalArea: "Rural", credits: "1", prescribedWeeks: "2", prescribedHours: "80" },

  // Semester VI
  { semester: "VI", clinicalArea: "Child Health Nursing II", credits: "1", prescribedWeeks: "3", prescribedHours: "80" },
  { semester: "VI", clinicalArea: "Pediatric Medical Ward", credits: "0.4", prescribedWeeks: "1", prescribedHours: "28" },
  { semester: "VI", clinicalArea: "Pediatric Surgical Ward", credits: "0.3", prescribedWeeks: "1", prescribedHours: "26" },
  { semester: "VI", clinicalArea: "PICU and NICU", credits: "0.3", prescribedWeeks: "1", prescribedHours: "26" },
  { semester: "VI", clinicalArea: "Mental Health Nursing II", credits: "2", prescribedWeeks: "5", prescribedHours: "160" },
  { semester: "VI", clinicalArea: "Psychiatric OPD", credits: "0.4", prescribedWeeks: "1", prescribedHours: "40" },
  { semester: "VI", clinicalArea: "Child Guidance Clinic", credits: "0.4", prescribedWeeks: "1", prescribedHours: "30" },
  { semester: "VI", clinicalArea: "Psychiatric In-patient Ward", credits: "0.8", prescribedWeeks: "2", prescribedHours: "60" },
  { semester: "VI", clinicalArea: "Community Psychiatry & De-addiction Centre", credits: "0.4", prescribedWeeks: "1", prescribedHours: "30" },
  { semester: "VI", clinicalArea: "Nursing Management and Leadership", credits: "1", prescribedWeeks: "2", prescribedHours: "80" },
  { semester: "VI", clinicalArea: "Hospital", credits: "0.5", prescribedWeeks: "1", prescribedHours: "40" },
  { semester: "VI", clinicalArea: "College", credits: "0.5", prescribedWeeks: "1", prescribedHours: "40" },
  { semester: "VI", clinicalArea: "Midwifery & Obstetrics and Gynecology (OBG) Nursing I", credits: "3", prescribedWeeks: "6", prescribedHours: "240" },
  { semester: "VI", clinicalArea: "Antenatal OPD & Ward", credits: "0.5", prescribedWeeks: "1", prescribedHours: "40" },
  { semester: "VI", clinicalArea: "Labour Room", credits: "1.5", prescribedWeeks: "3", prescribedHours: "160" },
  { semester: "VI", clinicalArea: "Postnatal Ward / OP including Family Planning Unit", credits: "1", prescribedWeeks: "2", prescribedHours: "40" },

  // Semester VII
  { semester: "VII", clinicalArea: "Midwifery & Obstetrics and Gynecology (OBG) Nursing II", credits: "4", prescribedWeeks: "8", prescribedHours: "320" },
  { semester: "VII", clinicalArea: "Antenatal OPD / Infertility Clinic / Reproductive Medicine and Antenatal Ward", credits: "1", prescribedWeeks: "2", prescribedHours: "80" },
  { semester: "VII", clinicalArea: "Labour Room", credits: "1", prescribedWeeks: "2", prescribedHours: "80" },
  { semester: "VII", clinicalArea: "Postnatal Ward", credits: "0.5", prescribedWeeks: "1", prescribedHours: "40" },
  { semester: "VII", clinicalArea: "NICU", credits: "0.5", prescribedWeeks: "1", prescribedHours: "40" },
  { semester: "VII", clinicalArea: "OBG OT / Ward", credits: "1", prescribedWeeks: "2", prescribedHours: "80" },
  { semester: "VII", clinicalArea: "Community Health Nursing II", credits: "2", prescribedWeeks: "4", prescribedHours: "160" },
  { semester: "VII", clinicalArea: "Urban", credits: "1", prescribedWeeks: "2", prescribedHours: "80" },
  { semester: "VII", clinicalArea: "Rural", credits: "1", prescribedWeeks: "2", prescribedHours: "80" },

  // Semester VIII
  { semester: "VIII", clinicalArea: "INTERNSHIP", credits: "12", prescribedWeeks: "22", prescribedHours: "1056" },
  { semester: "VIII", clinicalArea: "Adult Health Nursing", credits: "4", prescribedWeeks: "6", prescribedHours: "288" },
  { semester: "VIII", clinicalArea: "General Medical Ward", credits: "1", prescribedWeeks: "2", prescribedHours: "96" },
  { semester: "VIII", clinicalArea: "General Surgical Ward", credits: "1", prescribedWeeks: "2", prescribedHours: "96" },
  { semester: "VIII", clinicalArea: "Child Health Nursing", credits: "2", prescribedWeeks: "4", prescribedHours: "192" },
  { semester: "VIII", clinicalArea: "Urban", credits: "1", prescribedWeeks: "2", prescribedHours: "96" },
  { semester: "VIII", clinicalArea: "Rural", credits: "1", prescribedWeeks: "2", prescribedHours: "96" },
  { semester: "VIII", clinicalArea: "Mental Health Nursing", credits: "2", prescribedWeeks: "4", prescribedHours: "192" },
  { semester: "VIII", clinicalArea: "Psychiatry OPD", credits: "0.5", prescribedWeeks: "1", prescribedHours: "48" },
  { semester: "VIII", clinicalArea: "Child Guidance Clinic / De-addiction Centre", credits: "0.5", prescribedWeeks: "1", prescribedHours: "48" },
  { semester: "VIII", clinicalArea: "Psychiatric In-patient Ward", credits: "1", prescribedWeeks: "2", prescribedHours: "96" },
  { semester: "VIII", clinicalArea: "Midwifery", credits: "2", prescribedWeeks: "4", prescribedHours: "192" },
  { semester: "VIII", clinicalArea: "Antenatal OPD", credits: "0.5", prescribedWeeks: "1", prescribedHours: "48" },
  { semester: "VIII", clinicalArea: "Antenatal Ward", credits: "0.5", prescribedWeeks: "1", prescribedHours: "48" },
  { semester: "VIII", clinicalArea: "Labour Room / OT", credits: "0.5", prescribedWeeks: "1", prescribedHours: "48" },
  { semester: "VIII", clinicalArea: "Postnatal Ward", credits: "0.5", prescribedWeeks: "1", prescribedHours: "48" },
];

interface ClinicalExperienceFormProps {
  onSubmit: (data: ClinicalExperienceFormData) => void;
  defaultValues?: Partial<ClinicalExperienceFormData>;
  onProgressChange?: (progress: number) => void;
}

export const ClinicalExperienceForm = ({ onSubmit, defaultValues, onProgressChange }: ClinicalExperienceFormProps) => {
 const form = useForm<ClinicalExperienceFormData>({
  resolver: zodResolver(clinicalExperienceSchema),

  // 🔥 Real-time validation → red border disappears immediately when fixed
  mode: "onChange",
  reValidateMode: "onChange",

  defaultValues: {
    studentId: defaultValues?.studentId || "",

    // If editing existing data → load it
    // If new form → load default clinical records + blank user fields
    records:
      defaultValues?.records?.length && defaultValues.records.length > 0
        ? defaultValues.records
        : allClinicalRecords.map((r) => ({
            ...r,
            completedHours: "",
            hospital: "",
          })),
  },
});

  const { fields } = useFieldArray({
    control: form.control,
    name: "records",
  });

  // Group records by semester for merged rows (visual only)
  const groupedRecords = fields.reduce((acc, field, index) => {
    if (!acc[field.semester]) {
      acc[field.semester] = [];
    }
    acc[field.semester].push({ ...field, index });
    return acc;
  }, {} as Record<string, Array<any>>);

  const semesterOrder = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];

  // Progress Tracking
  useEffect(() => {
    const subscription = form.watch((values) => {
      let filledFields = 0;
      const fieldsPerRecord = ["completedHours", "hospital"];

      values.records?.forEach((record: any) => {
        if (record) {
          filledFields += fieldsPerRecord.filter(
            (field) => record[field] && record[field].toString().trim() !== ""
          ).length;
        }
      });

      const totalRequiredFields = allClinicalRecords.length * fieldsPerRecord.length;
      const progress = (filledFields / totalRequiredFields) * 100;
      onProgressChange?.(progress);
    });
    return () => subscription.unsubscribe();
  }, [form, onProgressChange]);

  // Sync Student ID
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

        {/* Hidden Student ID */}
        <FormField
          control={form.control}
          name="studentId"
          render={({ field }) => (
            <input type="hidden" {...field} value={field.value || ""} />
          )}
        />

        <div className="overflow-x-auto border rounded-lg">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted">
                <th className="border p-3 text-left font-semibold">Semester</th>
                <th className="border p-3 text-left font-semibold">Clinical Area</th>
                <th className="border p-3 text-left font-semibold">Credits</th>
                <th className="border p-3 text-left font-semibold">Prescribed Weeks</th>
                <th className="border p-3 text-left font-semibold">Prescribed Hours</th>
                <th className="border p-3 text-left font-semibold">Completed Hours</th>
                <th className="border p-3 text-left font-semibold">Hospital/Community</th>
              </tr>
            </thead>
            <tbody>
              {semesterOrder.map((semester) => {
                const records = groupedRecords[semester] || [];
                return records.map((record, recordIndex) => (
                  <tr key={record.id} className="hover:bg-muted/50">
                    {recordIndex === 0 ? (
                      <td
                        className="border p-2 font-medium text-center bg-muted/20"
                        rowSpan={records.length}
                      >
                        {semester}
                      </td>
                    ) : null}
                    <td className="border p-2 font-medium">
                      {record.clinicalArea}
                      {/* Hidden inputs to ensure data is sent */}
                      <input type="hidden" {...form.register(`records.${record.index}.semester`)} defaultValue={record.semester} />
                      <input type="hidden" {...form.register(`records.${record.index}.clinicalArea`)} defaultValue={record.clinicalArea} />
                      <input type="hidden" {...form.register(`records.${record.index}.credits`)} defaultValue={record.credits} />
                      <input type="hidden" {...form.register(`records.${record.index}.prescribedWeeks`)} defaultValue={record.prescribedWeeks} />
                      <input type="hidden" {...form.register(`records.${record.index}.prescribedHours`)} defaultValue={record.prescribedHours} />
                    </td>
                    <td className="border p-2 text-center">{record.credits}</td>
                    <td className="border p-2 text-center">{record.prescribedWeeks}</td>
                    <td className="border p-2 text-center">{record.prescribedHours}</td>
                    <td className="border p-2">
                     {/* Completed Hours (with red border on error) */}
<FormField
  control={form.control}
  name={`records.${record.index}.completedHours`}
  render={({ field }) => {
    const fieldError = form.formState.errors.records?.[record.index]?.completedHours;
    return (
      <FormItem>
        <FormControl>
          <Input
            type="number"
            {...field}
            placeholder="Hours"
            className={cn(
              "h-9",
              fieldError && "border-red-500 focus-visible:ring-red-500"
            )}
            aria-invalid={!!fieldError}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    );
  }}
/>

                    </td>
                    <td className="border p-2">
                     {/* Hospital / Community (with red border on error) */}
<FormField
  control={form.control}
  name={`records.${record.index}.hospital`}
  render={({ field }) => {
    const fieldError = form.formState.errors.records?.[record.index]?.hospital;
    return (
      <FormItem>
        <FormControl>
          <Input
            {...field}
            placeholder="Hospital name"
            className={cn(
              "h-9",
              fieldError && "border-red-500 focus-visible:ring-red-500"
            )}
            aria-invalid={!!fieldError}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    );
  }}
/>

                    </td>
                  </tr>
                ));
              })}
            </tbody>
          </table>
        </div>
      </form>
    </Form>
  );
};