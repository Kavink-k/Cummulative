
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";

const visitSchema = z.object({
  semester: z.string(),
  institutionPlace: z.string(),
  date: z.string().optional(),
});

const observationalVisitSchema = z.object({
  studentId: z.string().optional(),
  visits: z.array(visitSchema),
});

type ObservationalVisitFormData = z.infer<typeof observationalVisitSchema>;

// Data from the Excel file - Field Visit sheet
const observationalVisitData = [
  { semester: "I", institutionPlace: "Social Organization", date: "" },
  { semester: "II", institutionPlace: "Hospital Visit on Hospital Management System", date: "" },
  { semester: "III", institutionPlace: "Blood Bank", date: "" },
  { semester: "IV", institutionPlace: "Alternative Medicine (Ayurved / Homeopathy / Unani / Siddha)", date: "" },
  { semester: "IV", institutionPlace: "Dialysis Centre", date: "" },
  { semester: "IV", institutionPlace: "Local Disaster Management Centre", date: "" },
  { semester: "IV", institutionPlace: "Old Age Home", date: "" },
  { semester: "V", institutionPlace: "Anganwadi Child Guidance Clinic", date: "" },
  { semester: "V", institutionPlace: "Deaddiction Centre", date: "" },
  { semester: "V", institutionPlace: "CHC/PHC/SC/Health And Purification Site", date: "" },
  { semester: "V", institutionPlace: "Water Supply And Purification Site", date: "" },
  { semester: "V", institutionPlace: "Sewage and Waste Disposal Site", date: "" },
  { semester: "V", institutionPlace: "Milk Purification Plant", date: "" },
  { semester: "V", institutionPlace: "Slaughter House", date: "" },
  { semester: "V", institutionPlace: "Communicable Disease Hospital/Entomology Office", date: "" },
  { semester: "V", institutionPlace: "Regional Forensic Science Laboratory", date: "" },
  { semester: "V", institutionPlace: "Rainwater Harvesting Area", date: "" },
  { semester: "V", institutionPlace: "Nursing Education Institution-Regional/National organization", date: "" },
  { semester: "VI", institutionPlace: "Hospital - Regional / National Organization", date: "" },
  { semester: "VI", institutionPlace: "Child guidance Clinic, School for mentally, Socially and Physically Challenged", date: "" },
  { semester: "VI", institutionPlace: "Mental Health Service Agency", date: "" },
  { semester: "VI", institutionPlace: "Family Welfare Service", date: "" },
  { semester: "VII", institutionPlace: "Healthcare Delivery System", date: "" },
  { semester: "VII", institutionPlace: "Waste Management Site", date: "" },
  { semester: "VII", institutionPlace: "Infertility Clinic, ART Centre", date: "" }
];

interface ObservationalVisitFormProps {
  onSubmit: (data: ObservationalVisitFormData) => void;
  defaultValues?: Partial<ObservationalVisitFormData>;
  onProgressChange?: (progress: number) => void;
}

export const ObservationalVisitForm = ({ onSubmit, defaultValues, onProgressChange }: ObservationalVisitFormProps) => {
  
  const form = useForm<ObservationalVisitFormData>({
    resolver: zodResolver(observationalVisitSchema),
    defaultValues: {
      studentId: defaultValues?.studentId || "",
      visits: (defaultValues?.visits?.length ?? 0) > 0 
        ? defaultValues!.visits 
        : observationalVisitData,
    },
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: "visits",
  });

  // Group visits by semester for merged rows (visual only)
  const groupedVisits = fields.reduce((acc, field, index) => {
    if (!acc[field.semester]) {
      acc[field.semester] = [];
    }
    acc[field.semester].push({ ...field, index });
    return acc;
  }, {} as Record<string, Array<any>>);

  const semesterOrder = ["I", "II", "III", "IV", "V", "VI", "VII"];

  // Progress Tracking
  useEffect(() => {
    const subscription = form.watch((values) => {
      let filledFields = 0;
      const fieldsPerVisit = ["date"];
      
      values.visits?.forEach((visit: any) => {
        if (visit) {
          filledFields += fieldsPerVisit.filter(
            (field) => visit[field] && visit[field].toString().trim() !== ""
          ).length;
        }
      });
      
      const totalRequiredFields = observationalVisitData.length; 
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
                <th className="border p-3 text-left font-semibold">Institution & Place</th>
                <th className="border p-3 text-left font-semibold">Date</th>
              </tr>
            </thead>
            <tbody>
              {semesterOrder.map((semester) => {
                const visits = groupedVisits[semester] || [];
                return visits.map((visit, visitIndex) => (
                  <tr key={visit.id} className="hover:bg-muted/50">
                    {visitIndex === 0 ? (
                      <td 
                        className="border p-2 font-medium text-center bg-muted/20" 
                        rowSpan={visits.length}
                      >
                        {semester}
                      </td>
                    ) : null}
                    <td className="border p-2 font-medium">
                      {visit.institutionPlace}
                      {/* CRITICAL FIX: Hidden inputs to ensure data is sent */}
                      <input type="hidden" {...form.register(`visits.${visit.index}.semester`)} defaultValue={visit.semester} />
                      <input type="hidden" {...form.register(`visits.${visit.index}.institutionPlace`)} defaultValue={visit.institutionPlace} />
                    </td>
                    <td className="border p-2">
                      <FormField
                        control={form.control}
                        name={`visits.${visit.index}.date`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input type="date" {...field} className="h-9" />
                            </FormControl>
                          </FormItem>
                        )}
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