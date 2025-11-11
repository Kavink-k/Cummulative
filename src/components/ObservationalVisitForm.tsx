// import { useForm, useFieldArray } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Plus } from "lucide-react";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// const visitSchema = z.object({
//   semester: z.string(),
//   institutionPlace: z.string(),
//   date: z.string(),
// });

// const observationalVisitSchema = z.object({
//   visits: z.array(visitSchema),
// });

// type ObservationalVisitFormData = z.infer<typeof observationalVisitSchema>;

// // Data from the Excel file - Field Visit sheet
// const observationalVisitData = {
//   "I": [
//     { institutionPlace: "Social Organization" }
//   ],
//   "II": [
//     { institutionPlace: "Hospital Visit on Hospital Management System" }
//   ],
//   "III": [
//     { institutionPlace: "Blood Bank" }
//   ],
//   "IV": [
//     { institutionPlace: "Alternative Medicine (Ayurved / Homeopathy / Unani / Siddha)" },
//     { institutionPlace: "Dialysis Centre" },
//     { institutionPlace: "Local Disaster Management Centre" },
//     { institutionPlace: "Old Age Home" }
//   ],
//   "V": [
//     { institutionPlace: "Anganwadi Child Guidance Clinic" },
//     { institutionPlace: "Deaddiction Centre" },
//     { institutionPlace: "CHC/PHC/SC/Health And Purification Site" },
//     { institutionPlace: "Water Supply And Purification Site" },
//     { institutionPlace: "Sewage and Waste Disposal Site" },
//     { institutionPlace: "Milk Purification Plant" },
//     { institutionPlace: "Slaughter House" },
//     { institutionPlace: "Communicable Disease Hospital/Entomology Office" },
//     { institutionPlace: "Regional Forensic Science Laboratory" },
//     { institutionPlace: "Rainwater Harvesting Area" },
//     { institutionPlace: "Nursing Education Institution-Regional/National organization" }
//   ],
//   "VI": [
//     { institutionPlace: "Hospital - Regional / National Organization" },
//     { institutionPlace: "Child guidance Clinic, School for mentally, Socially and Physically Challenged" },
//     { institutionPlace: "Mental Health Service Agency" },
//     { institutionPlace: "Family Welfare Service" }
//   ],
//   "VII": [
//     { institutionPlace: "Healthcare Delivery System" },
//     { institutionPlace: "Waste Management Site" },
//     { institutionPlace: "Infertility Clinic, ART Centre" }
//   ]
// };

// interface ObservationalVisitFormProps {
//   onSubmit: (data: ObservationalVisitFormData) => void;
//   defaultValues?: Partial<ObservationalVisitFormData>;
// }

// export const ObservationalVisitForm = ({ onSubmit, defaultValues }: ObservationalVisitFormProps) => {
//   const form = useForm<ObservationalVisitFormData>({
//     resolver: zodResolver(observationalVisitSchema),
//     defaultValues: defaultValues || {
//       visits: [{ semester: "", institutionPlace: "", date: "" }],
//     },
//   });

//   const { fields, append } = useFieldArray({
//     control: form.control,
//     name: "visits",
//   });

//   const handleSemesterChange = (index: number, value: string) => {
//     // Update the semester field
//     form.setValue(`visits.${index}.semester`, value);
    
//     // Clear the institutionPlace when semester changes
//     form.setValue(`visits.${index}.institutionPlace`, "");
//   };

//   const handleInstitutionPlaceChange = (index: number, value: string) => {
//     form.setValue(`visits.${index}.institutionPlace`, value);
//   };

//   const getInstitutionPlacesForSemester = (semester: string) => {
//     if (semester && observationalVisitData[semester as keyof typeof observationalVisitData]) {
//       return observationalVisitData[semester as keyof typeof observationalVisitData];
//     }
//     return [];
//   };

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//         <div className="overflow-x-auto border rounded-lg">
//           <table className="w-full border-collapse">
//             <thead>
//               <tr className="bg-muted">
//                 <th className="border p-3 text-left font-semibold">Semester</th>
//                 <th className="border p-3 text-left font-semibold">Institution & Place</th>
//                 <th className="border p-3 text-left font-semibold">Date</th>
//               </tr>
//             </thead>
//             <tbody>
//               {fields.map((field, index) => (
//                 <tr key={field.id} className="hover:bg-muted/50">
//                   <td className="border p-2">
//                     <FormField
//                       control={form.control}
//                       name={`visits.${index}.semester`}
//                       render={({ field }) => (
//                         <FormItem>
//                           <Select
//                             value={field.value}
//                             onValueChange={(value) => handleSemesterChange(index, value)}
//                           >
//                             <FormControl>
//                               <SelectTrigger className="h-9">
//                                 <SelectValue placeholder="Select semester" />
//                               </SelectTrigger>
//                             </FormControl>
//                             <SelectContent>
//                               {Object.keys(observationalVisitData).map((semester) => (
//                                 <SelectItem key={semester} value={semester}>
//                                   Semester {semester}
//                                 </SelectItem>
//                               ))}
//                             </SelectContent>
//                           </Select>
//                         </FormItem>
//                       )}
//                     />
//                   </td>
//                   <td className="border p-2">
//                     <FormField
//                       control={form.control}
//                       name={`visits.${index}.institutionPlace`}
//                       render={({ field }) => (
//                         <FormItem>
//                           <Select
//                             value={field.value}
//                             onValueChange={(value) => handleInstitutionPlaceChange(index, value)}
//                             disabled={!form.watch(`visits.${index}.semester`)}
//                           >
//                             <FormControl>
//                               <SelectTrigger className="h-9">
//                                 <SelectValue placeholder="Select institution & place" />
//                               </SelectTrigger>
//                             </FormControl>
//                             <SelectContent>
//                               {getInstitutionPlacesForSemester(form.watch(`visits.${index}.semester`)).map((visit, visitIndex) => (
//                                 <SelectItem key={visitIndex} value={visit.institutionPlace}>
//                                   {visit.institutionPlace}
//                                 </SelectItem>
//                               ))}
//                             </SelectContent>
//                           </Select>
//                         </FormItem>
//                       )}
//                     />
//                   </td>
//                   <td className="border p-2">
//                     <FormField
//                       control={form.control}
//                       name={`visits.${index}.date`}
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormControl>
//                             <Input type="date" {...field} className="h-9" />
//                           </FormControl>
//                         </FormItem>
//                       )}
//                     />
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//         <Button
//           type="button"
//           variant="outline"
//           onClick={() => append({ semester: "", institutionPlace: "", date: "" })}
//           className="w-full"
//         >
//           <Plus className="h-4 w-4 mr-2" />
//           Add Visit Record
//         </Button>
//         <div className="flex justify-end">
//           <Button type="submit">Save Observational Visits</Button>
//         </div>
//       </form>
//     </Form>
//   );
// };

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const visitSchema = z.object({
  semester: z.string(),
  institutionPlace: z.string(),
  date: z.string(),
});

const observationalVisitSchema = z.object({
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
}

export const ObservationalVisitForm = ({ onSubmit, defaultValues }: ObservationalVisitFormProps) => {
  const form = useForm<ObservationalVisitFormData>({
    resolver: zodResolver(observationalVisitSchema),
    defaultValues: defaultValues || {
      visits: observationalVisitData,
    },
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: "visits",
  });

  // Group visits by semester for merged rows
  const groupedVisits = fields.reduce((acc, field, index) => {
    if (!acc[field.semester]) {
      acc[field.semester] = [];
    }
    acc[field.semester].push({ ...field, index });
    return acc;
  }, {} as Record<string, Array<any>>);

  const semesterOrder = ["I", "II", "III", "IV", "V", "VI", "VII"];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                        className="border p-2 font-medium" 
                        rowSpan={visits.length}
                      >
                        {semester}
                      </td>
                    ) : null}
                    <td className="border p-2 font-medium">{visit.institutionPlace}</td>
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
        <p className="text-sm text-muted-foreground italic">
          Note: This form records the observational visits and field visits conducted during each semester as per the curriculum requirements.
        </p>
        <div className="flex justify-end">
          <Button type="submit">Save Observational Visits</Button>
        </div>
      </form>
    </Form>
  );
};