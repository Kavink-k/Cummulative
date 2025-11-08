import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { useEffect } from "react";

const clinicalRecordSchema = z.object({
  semester: z.string(),
  clinicalArea: z.string(),
  credits: z.string(),
  prescribedWeeks: z.string(),
  prescribedHours: z.string(),
  completedHours: z.string(),
  hospital: z.string(),
});

const clinicalExperienceSchema = z.object({
  records: z.array(clinicalRecordSchema),
});

type ClinicalExperienceFormData = z.infer<typeof clinicalExperienceSchema>;

// Data from the Excel file - Record of Clinical Experience sheet
const clinicalExperienceData = {
  "I": [
    { clinicalArea: "Nursing Foundation I including First Aid Module", credits: "2", prescribedWeeks: "10", prescribedHours: "160" },
    { clinicalArea: "General Medical Ward", credits: "1", prescribedWeeks: "5", prescribedHours: "80" },
    { clinicalArea: "General Surgical Ward", credits: "1", prescribedWeeks: "5", prescribedHours: "80" }
  ],
  "II": [
    { clinicalArea: "Nursing Foundation II including Health Assessment Module", credits: "4", prescribedWeeks: "16", prescribedHours: "320" },
    { clinicalArea: "General Medical Ward", credits: "2", prescribedWeeks: "8", prescribedHours: "160" },
    { clinicalArea: "General Surgical Ward", credits: "2", prescribedWeeks: "8", prescribedHours: "160" }
  ],
  "III": [
    { clinicalArea: "Adult Health Nursing I with integrated pathophysiology including BCLS module", credits: "6", prescribedWeeks: "18", prescribedHours: "480" },
    { clinicalArea: "General Medical Ward", credits: "1.4", prescribedWeeks: "4", prescribedHours: "108" },
    { clinicalArea: "General Surgical Ward", credits: "1.4", prescribedWeeks: "4", prescribedHours: "108" },
    { clinicalArea: "Cardiology Ward", credits: "0.6", prescribedWeeks: "2", prescribedHours: "50" },
    { clinicalArea: "Dermatology Ward", credits: "0.3", prescribedWeeks: "1", prescribedHours: "28" },
    { clinicalArea: "Isolation Ward", credits: "0.3", prescribedWeeks: "1", prescribedHours: "28" },
    { clinicalArea: "Orthopedic Ward", credits: "0.6", prescribedWeeks: "2", prescribedHours: "50" },
    { clinicalArea: "Operation Theatre", credits: "0.4", prescribedWeeks: "4", prescribedHours: "108" }
  ],
  "IV": [
    { clinicalArea: "Adult Health Nursing II with integrated pathophysiology including Geriatric Nursing and Palliative Care Module", credits: "6", prescribedWeeks: "20", prescribedHours: "480" },
    { clinicalArea: "ENT Ward & OPD", credits: "0.6", prescribedWeeks: "2", prescribedHours: "48" },
    { clinicalArea: "Ophthalmology Unit", credits: "0.6", prescribedWeeks: "2", prescribedHours: "48" },
    { clinicalArea: "Renal / Nephrology Ward including Dialysis Unit", credits: "0.6", prescribedWeeks: "2", prescribedHours: "48" },
    { clinicalArea: "Burns Unit / Reconstructive Surgical Unit", credits: "0.6", prescribedWeeks: "2", prescribedHours: "48" },
    { clinicalArea: "Neurology - Medical / Surgical Ward", credits: "1", prescribedWeeks: "3", prescribedHours: "72" },
    { clinicalArea: "Isolation Ward / Medical Ward", credits: "0.2", prescribedWeeks: "1", prescribedHours: "24" },
    { clinicalArea: "Oncology Ward (including Day Care / Radiotherapy Unit)", credits: "1", prescribedWeeks: "3", prescribedHours: "72" },
    { clinicalArea: "Emergency Room/Unit", credits: "0.6", prescribedWeeks: "2", prescribedHours: "48" }
  ],
  "V": [
    { clinicalArea: "Child Health Nursing I", credits: "2", prescribedWeeks: "5", prescribedHours: "160" },
    { clinicalArea: "Pediatric Medical Ward", credits: "0.8", prescribedWeeks: "2", prescribedHours: "60" },
    { clinicalArea: "Pediatric Surgical Ward", credits: "0.8", prescribedWeeks: "2", prescribedHours: "60" },
    { clinicalArea: "Pediatric OPD / Immunization Room", credits: "0.4", prescribedWeeks: "1", prescribedHours: "40" },
    { clinicalArea: "Mental Health Nursing", credits: "1", prescribedWeeks: "3", prescribedHours: "80" },
    { clinicalArea: "Psychiatric OPD", credits: "0.4", prescribedWeeks: "1", prescribedHours: "30" },
    { clinicalArea: "Psychiatric In-patient Ward", credits: "0.6", prescribedWeeks: "2", prescribedHours: "50" },
    { clinicalArea: "Community Health Nursing I", credits: "2", prescribedWeeks: "4", prescribedHours: "160" },
    { clinicalArea: "Urban", credits: "1", prescribedWeeks: "2", prescribedHours: "80" },
    { clinicalArea: "Rural", credits: "1", prescribedWeeks: "2", prescribedHours: "80" }
  ],
  "VI": [
    { clinicalArea: "Child Health Nursing II", credits: "1", prescribedWeeks: "3", prescribedHours: "80" },
    { clinicalArea: "Pediatric Medical Ward", credits: "0.4", prescribedWeeks: "1", prescribedHours: "28" },
    { clinicalArea: "Pediatric Surgical Ward", credits: "0.3", prescribedWeeks: "1", prescribedHours: "26" },
    { clinicalArea: "PICU and NICU", credits: "0.3", prescribedWeeks: "1", prescribedHours: "26" },
    { clinicalArea: "Mental Health Nursing II", credits: "2", prescribedWeeks: "5", prescribedHours: "160" },
    { clinicalArea: "Psychiatric OPD", credits: "0.4", prescribedWeeks: "1", prescribedHours: "40" },
    { clinicalArea: "Child Guidance Clinic", credits: "0.4", prescribedWeeks: "1", prescribedHours: "30" },
    { clinicalArea: "Psychiatric In-patient Ward", credits: "0.8", prescribedWeeks: "2", prescribedHours: "60" },
    { clinicalArea: "Community Psychiatry & De-addiction Centre", credits: "0.4", prescribedWeeks: "1", prescribedHours: "30" },
    { clinicalArea: "Nursing Management and Leadership", credits: "1", prescribedWeeks: "2", prescribedHours: "80" },
    { clinicalArea: "Hospital", credits: "0.5", prescribedWeeks: "1", prescribedHours: "40" },
    { clinicalArea: "College", credits: "0.5", prescribedWeeks: "1", prescribedHours: "40" },
    { clinicalArea: "Midwifery & Obstetrics and Gynecology (OBG) Nursing I", credits: "3", prescribedWeeks: "6", prescribedHours: "240" },
    { clinicalArea: "Antenatal OPD & Ward", credits: "0.5", prescribedWeeks: "1", prescribedHours: "40" },
    { clinicalArea: "Labour Room", credits: "1.5", prescribedWeeks: "3", prescribedHours: "160" },
    { clinicalArea: "Postnatal Ward / OP including Family Planning Unit", credits: "1", prescribedWeeks: "2", prescribedHours: "40" }
  ],
  "VII": [
    { clinicalArea: "Midwifery & Obstetrics and Gynecology (OBG) Nursing II", credits: "4", prescribedWeeks: "8", prescribedHours: "320" },
    { clinicalArea: "Antenatal OPD / Infertility Clinic / Reproductive Medicine and Antenatal Ward", credits: "1", prescribedWeeks: "2", prescribedHours: "80" },
    { clinicalArea: "Labour Room", credits: "1", prescribedWeeks: "2", prescribedHours: "80" },
    { clinicalArea: "Postnatal Ward", credits: "0.5", prescribedWeeks: "1", prescribedHours: "40" },
    { clinicalArea: "NICU", credits: "0.5", prescribedWeeks: "1", prescribedHours: "40" },
    { clinicalArea: "OBG OT / Ward", credits: "1", prescribedWeeks: "2", prescribedHours: "80" },
    { clinicalArea: "Community Health Nursing II", credits: "2", prescribedWeeks: "4", prescribedHours: "160" },
    { clinicalArea: "Urban", credits: "1", prescribedWeeks: "2", prescribedHours: "80" },
    { clinicalArea: "Rural", credits: "1", prescribedWeeks: "2", prescribedHours: "80" }
  ],
  "VIII": [
    { clinicalArea: "INTERNSHIP", credits: "12", prescribedWeeks: "22", prescribedHours: "1056" },
    { clinicalArea: "Adult Health Nursing", credits: "4", prescribedWeeks: "6", prescribedHours: "288" },
    { clinicalArea: "General Medical Ward", credits: "1", prescribedWeeks: "2", prescribedHours: "96" },
    { clinicalArea: "General Surgical Ward", credits: "1", prescribedWeeks: "2", prescribedHours: "96" },
    { clinicalArea: "Child Health Nursing", credits: "2", prescribedWeeks: "4", prescribedHours: "192" },
    { clinicalArea: "Urban", credits: "1", prescribedWeeks: "2", prescribedHours: "96" },
    { clinicalArea: "Rural", credits: "1", prescribedWeeks: "2", prescribedHours: "96" },
    { clinicalArea: "Mental Health Nursing", credits: "2", prescribedWeeks: "4", prescribedHours: "192" },
    { clinicalArea: "Psychiatry OPD", credits: "0.5", prescribedWeeks: "1", prescribedHours: "48" },
    { clinicalArea: "Child Guidance Clinic / De-addiction Centre", credits: "0.5", prescribedWeeks: "1", prescribedHours: "48" },
    { clinicalArea: "Psychiatric In-patient Ward", credits: "1", prescribedWeeks: "2", prescribedHours: "96" },
    { clinicalArea: "Midwifery", credits: "2", prescribedWeeks: "4", prescribedHours: "192" },
    { clinicalArea: "Antenatal OPD", credits: "0.5", prescribedWeeks: "1", prescribedHours: "48" },
    { clinicalArea: "Antenatal Ward", credits: "0.5", prescribedWeeks: "1", prescribedHours: "48" },
    { clinicalArea: "Labour Room / OT", credits: "0.5", prescribedWeeks: "1", prescribedHours: "48" },
    { clinicalArea: "Postnatal Ward", credits: "0.5", prescribedWeeks: "1", prescribedHours: "48" }
  ]
};

interface ClinicalExperienceFormProps {
  onSubmit: (data: ClinicalExperienceFormData) => void;
  defaultValues?: Partial<ClinicalExperienceFormData>;
  onProgressChange?: (progress: number) => void;
}

export const ClinicalExperienceForm = ({ onSubmit, defaultValues, onProgressChange }: ClinicalExperienceFormProps) => {
  const form = useForm<ClinicalExperienceFormData>({
    resolver: zodResolver(clinicalExperienceSchema),
    defaultValues: defaultValues || {
      records: [{ semester: "", clinicalArea: "", credits: "", prescribedWeeks: "", prescribedHours: "", completedHours: "", hospital: "" }],
    },
  });

  const { fields, append } = useFieldArray({
    control: form.control,
    name: "records",
  });

  useEffect(() => {
    const subscription = form.watch((values) => {
      let filledFields = 0;
      const fieldsPerRecord = ["semester", "clinicalArea", "credits", "prescribedHours", "completedHours", "hospital"];
      values.records?.forEach((record: any) => {
        filledFields += fieldsPerRecord.filter(
          (field) => record[field] && record[field].toString().trim() !== ""
        ).length;
      });
      const totalRequiredFields = values.records?.length * fieldsPerRecord.length || 0;
      const progress = totalRequiredFields > 0 ? (filledFields / totalRequiredFields) * 100 : 0;
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
                <th className="border p-3 text-left font-semibold">Clinical Area</th>
                <th className="border p-3 text-left font-semibold">Credits</th>
                <th className="border p-3 text-left font-semibold">Prescribed Weeks</th>
                <th className="border p-3 text-left font-semibold">Prescribed Hours</th>
                <th className="border p-3 text-left font-semibold">Completed Hours</th>
                <th className="border p-3 text-left font-semibold">Hospital/Community</th>
              </tr>
            </thead>
            <tbody>
              {fields.map((field, index) => (
                <tr key={field.id} className="hover:bg-muted/50">
                  <td className="border p-2">
                    <FormField
                      control={form.control}
                      name={`records.${index}.semester`}
                      render={({ field }) => (
                        <FormItem>
                          <Select
                            value={field.value}
                            onValueChange={(value) => handleSemesterChange(index, value)}
                          >
                            <FormControl>
                              <SelectTrigger className="h-9">
                                <SelectValue placeholder="Select semester" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Object.keys(clinicalExperienceData).map((semester) => (
                                <SelectItem key={semester} value={semester}>
                                  Semester {semester}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  </td>
                  <td className="border p-2">
                    <FormField
                      control={form.control}
                      name={`records.${index}.clinicalArea`}
                      render={({ field }) => (
                        <FormItem>
                          <Select
                            value={field.value}
                            onValueChange={(value) => handleClinicalAreaChange(index, value)}
                            disabled={!form.watch(`records.${index}.semester`)}
                          >
                            <FormControl>
                              <SelectTrigger className="h-9">
                                <SelectValue placeholder="Select clinical area" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {getClinicalAreasForSemester(form.watch(`records.${index}.semester`)).map((area) => (
                                <SelectItem key={area.clinicalArea} value={area.clinicalArea}>
                                  {area.clinicalArea}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  </td>
                  <td className="border p-2">
                    <FormField
                      control={form.control}
                      name={`records.${index}.credits`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input type="number" {...field} className="h-9" readOnly />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </td>
                  <td className="border p-2">
                    <FormField
                      control={form.control}
                      name={`records.${index}.prescribedWeeks`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input type="number" {...field} className="h-9" readOnly />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </td>
                  <td className="border p-2">
                    <FormField
                      control={form.control}
                      name={`records.${index}.prescribedHours`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input type="number" {...field} className="h-9" readOnly />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </td>
                  <td className="border p-2">
                    <FormField
                      control={form.control}
                      name={`records.${index}.completedHours`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input 
                              placeholder="Completed Hours"
                              type="number" 
                              {...field} 
                              className="h-9"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </td>
                  <td className="border p-2">
                    <FormField
                      control={form.control}
                      name={`records.${index}.hospital`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input {...field} placeholder="Hospital name" className="h-9" />
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
        <Button
          type="button"
          variant="outline"
          onClick={() => append({ semester: "", clinicalArea: "", credits: "", prescribedWeeks: "", prescribedHours: "", completedHours: "", hospital: "" })}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Clinical Record
        </Button>
        <div className="flex justify-end">
          <Button type="submit">Save Clinical Experience</Button>
        </div>
      </form>
    </Form>
  );
};