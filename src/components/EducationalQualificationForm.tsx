// import { useForm, useFieldArray } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// const subjectSchema = z.object({
//   subject: z.string(),
//   attempt1MaxMarks: z.string(),
//   attempt1Score: z.string(),
//   attempt1Percentage: z.string(),
//   attempt2MaxMarks: z.string().optional(),
//   attempt2Score: z.string().optional(),
//   attempt2Percentage: z.string().optional(),
// });

// const educationalQualificationSchema = z.object({
//   streamGroup: z.string().min(1, "Stream/Group is required"),
//   subjects: z.array(subjectSchema),
//   certificateNo: z.string().min(1, "Certificate number is required"),
//   certificateDate: z.string().min(1, "Certificate date is required"),
//   yearOfPassing: z.string().min(4, "Year of passing is required"),
//   boardOfExamination: z.string().min(1, "Board of examination is required"),
//   mediumOfInstruction: z.string().min(1, "Medium of instruction is required"),
//   hscVerificationNo: z.string().min(1, "HSC verification number is required"),
//   hscVerificationDate: z.string().min(1, "HSC verification date is required"),
// });

// type EducationalQualificationFormData = z.infer<typeof educationalQualificationSchema>;

// const defaultSubjects = [
//   "Language",
//   "English",
//   "Physics",
//   "Chemistry",
//   "Biology/Botany",
//   "Zoology",
//   "Mathematics",
//   "Others",
// ];

// interface EducationalQualificationFormProps {
//   onSubmit: (data: EducationalQualificationFormData) => void;
//   defaultValues?: Partial<EducationalQualificationFormData>;
// }

// export const EducationalQualificationForm = ({ onSubmit, defaultValues }: EducationalQualificationFormProps) => {
//   const form = useForm<EducationalQualificationFormData>({
//     resolver: zodResolver(educationalQualificationSchema),
//     defaultValues: defaultValues || {
//       subjects: defaultSubjects.map(subject => ({
//         subject,
//         attempt1MaxMarks: "",
//         attempt1Score: "",
//         attempt1Percentage: "",
//       })),
//     },
//   });

//   const { fields } = useFieldArray({
//     control: form.control,
//     name: "subjects",
//   });

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//         <FormField
//           control={form.control}
//           name="streamGroup"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Stream/Group</FormLabel>
//               <FormControl>
//                 <Input placeholder="Science/Commerce/Arts" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <div className="border rounded-lg p-4 space-y-4">
//           <h3 className="font-semibold text-lg">Subject-wise Marks</h3>
//           <div className="overflow-x-auto">
//             <table className="w-full border-collapse">
//               <thead>
//                 <tr className="bg-muted">
//                   <th className="border p-2 text-left">Subject</th>
//                   <th className="border p-2 text-center" colSpan={3}>Attempt 1</th>
//                   <th className="border p-2 text-center" colSpan={3}>Attempt 2 (if applicable)</th>
//                 </tr>
//                 <tr className="bg-muted/50">
//                   <th className="border p-2"></th>
//                   <th className="border p-2 text-xs">Max Marks</th>
//                   <th className="border p-2 text-xs">Score</th>
//                   <th className="border p-2 text-xs">%</th>
//                   <th className="border p-2 text-xs">Max Marks</th>
//                   <th className="border p-2 text-xs">Score</th>
//                   <th className="border p-2 text-xs">%</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {fields.map((field, index) => (
//                   <tr key={field.id}>
//                     <td className="border p-2 font-medium">{field.subject}</td>
//                     <td className="border p-1">
//                       <FormField
//                         control={form.control}
//                         name={`subjects.${index}.attempt1MaxMarks`}
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormControl>
//                               <Input type="number" {...field} className="h-8 text-sm" />
//                             </FormControl>
//                           </FormItem>
//                         )}
//                       />
//                     </td>
//                     <td className="border p-1">
//                       <FormField
//                         control={form.control}
//                         name={`subjects.${index}.attempt1Score`}
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormControl>
//                               <Input type="number" {...field} className="h-8 text-sm" />
//                             </FormControl>
//                           </FormItem>
//                         )}
//                       />
//                     </td>
//                     <td className="border p-1">
//                       <FormField
//                         control={form.control}
//                         name={`subjects.${index}.attempt1Percentage`}
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormControl>
//                               <Input type="number" step="0.01" {...field} className="h-8 text-sm" />
//                             </FormControl>
//                           </FormItem>
//                         )}
//                       />
//                     </td>
//                     <td className="border p-1">
//                       <FormField
//                         control={form.control}
//                         name={`subjects.${index}.attempt2MaxMarks`}
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormControl>
//                               <Input type="number" {...field} className="h-8 text-sm" />
//                             </FormControl>
//                           </FormItem>
//                         )}
//                       />
//                     </td>
//                     <td className="border p-1">
//                       <FormField
//                         control={form.control}
//                         name={`subjects.${index}.attempt2Score`}
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormControl>
//                               <Input type="number" {...field} className="h-8 text-sm" />
//                             </FormControl>
//                           </FormItem>
//                         )}
//                       />
//                     </td>
//                     <td className="border p-1">
//                       <FormField
//                         control={form.control}
//                         name={`subjects.${index}.attempt2Percentage`}
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormControl>
//                               <Input type="number" step="0.01" {...field} className="h-8 text-sm" />
//                             </FormControl>
//                           </FormItem>
//                         )}
//                       />
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <FormField
//             control={form.control}
//             name="certificateNo"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Certificate Number</FormLabel>
//                 <FormControl>
//                   <Input placeholder="Enter certificate number" {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="certificateDate"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Certificate Date</FormLabel>
//                 <FormControl>
//                   <Input type="date" {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="yearOfPassing"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Year of Passing</FormLabel>
//                 <FormControl>
//                   <Input placeholder="2024" {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="boardOfExamination"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Board of Examination</FormLabel>
//                 <Select onValueChange={field.onChange} defaultValue={field.value}>
//                   <FormControl>
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select board" />
//                     </SelectTrigger>
//                   </FormControl>
//                   <SelectContent>
//                     <SelectItem value="state">State Board</SelectItem>
//                     <SelectItem value="cbse">CBSE</SelectItem>
//                     <SelectItem value="icse">ICSE</SelectItem>
//                     <SelectItem value="nios">National Open School (NIOS)</SelectItem>
//                   </SelectContent>
//                 </Select>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="mediumOfInstruction"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Medium of Instruction</FormLabel>
//                 <FormControl>
//                   <Input placeholder="English" {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="hscVerificationNo"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>HSC Verification Certificate No.</FormLabel>
//                 <FormControl>
//                   <Input placeholder="Enter verification number" {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="hscVerificationDate"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>HSC Verification Date</FormLabel>
//                 <FormControl>
//                   <Input type="date" {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>
//       </form>
//     </Form>
//   );
// };



import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect } from "react";

const subjectSchema = z.object({
  subject: z.string(),
  plusOneAttempts: z.array(attemptSchema),
  plusTwoAttempts: z.array(attemptSchema),
});

const educationalQualificationSchema = z.object({
  streamGroup: z.string().min(1, "Stream/Group is required"),
  subjects: z.array(subjectSchema),
  totalPlusOneMaxMarks: z.string(),
  totalPlusOneScore: z.string(),
  totalPlusOnePercentage: z.string(),
  totalPlusTwoMaxMarks: z.string(),
  totalPlusTwoScore: z.string(),
  totalPlusTwoPercentage: z.string(),
  certificateNo: z.string().min(1, "Certificate number is required"),
  certificateDate: z.string().min(1, "Certificate date is required"),
  yearOfPassing: z.string().min(4, "Year of passing is required"),
  boardOfExamination: z.string().min(1, "Board of examination is required"),
  mediumOfInstruction: z.string().min(1, "Medium of instruction is required"),
  hscVerificationNo: z.string().min(1, "HSC verification number is required"),
  hscVerificationDate: z.string().min(1, "HSC verification date is required"),
});

type EducationalQualificationFormData = z.infer<typeof educationalQualificationSchema>;

const defaultSubjects = [
  { subject: "Language", id: "language" },
  { subject: "English", id: "english" },
  { subject: "Physics", id: "physics" },
  { subject: "Chemistry", id: "chemistry" },
  { subject: "Biology / Botany", id: "biology" },
  { subject: "Zoology", id: "zoology" },
  { subject: "Mathematics", id: "mathematics" },
  { subject: "Others", id: "others" },
];

interface EducationalQualificationFormProps {
  onSubmit: (data: EducationalQualificationFormData) => void;
  defaultValues?: Partial<EducationalQualificationFormData>;
  onProgressChange?: (progress: number) => void; // New prop for progress
}

export const EducationalQualificationForm = ({
  onSubmit,
  defaultValues,
  onProgressChange,
}: EducationalQualificationFormProps) => {
  const form = useForm<EducationalQualificationFormData>({
    resolver: zodResolver(educationalQualificationSchema),
    defaultValues: defaultValues || {
      subjects: defaultSubjects.map((subject) => ({
        subject,
        attempt1MaxMarks: "",
        attempt1Score: "",
        attempt1Percentage: "",
      })),
      totalPlusOneMaxMarks: "",
      totalPlusOneScore: "",
      totalPlusOnePercentage: "",
      totalPlusTwoMaxMarks: "",
      totalPlusTwoScore: "",
      totalPlusTwoPercentage: "",
    },
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: "subjects",
  });

  // Calculate progress based on filled required fields
  useEffect(() => {
    const subscription = form.watch((values) => {
      const topLevelFields = [
        "streamGroup",
        "certificateNo",
        "certificateDate",
        "yearOfPassing",
        "boardOfExamination",
        "mediumOfInstruction",
        "hscVerificationNo",
        "hscVerificationDate",
      ];

      // Count filled top-level fields
      const filledTopLevel = topLevelFields.filter(
        (field) => values[field] && values[field].toString().trim() !== ""
      ).length;

      // Count filled subject fields (attempt1 fields are required)
      let filledSubjectFields = 0;
      const subjectFieldsPerSubject = ["attempt1MaxMarks", "attempt1Score", "attempt1Percentage"];
      values.subjects?.forEach((subject: any) => {
        filledSubjectFields += subjectFieldsPerSubject.filter(
          (field) => subject[field] && subject[field].toString().trim() !== ""
        ).length;
      });

      // Total required fields: 7 top-level + (8 subjects * 3 attempt1 fields)
      const totalRequiredFields = topLevelFields.length + defaultSubjects.length * 3; // 7 + 24 = 31
      const filledFields = filledTopLevel + filledSubjectFields;
      const progress = (filledFields / totalRequiredFields) * 100;

      onProgressChange?.(progress);
    });
    return () => subscription.unsubscribe();
  }, [form, onProgressChange]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">II. EDUCATIONAL QUALIFICATION DETAILS</h2>
          <FormField
            control={form.control}
            name="streamGroup"
            render={({ field }) => (
              <FormItem className="w-48">
                <FormLabel className="text-sm">STREAM / GROUP</FormLabel>
                <FormControl>
                  <Input placeholder="Science" {...field} className="h-9" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="border rounded-lg p-4 space-y-4">
          <h3 className="font-semibold text-lg">Subject-wise Marks</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted">
                  <th className="border p-2 text-left">Subject</th>
                  <th className="border p-2 text-center" colSpan={3}>
                    Attempt 1
                  </th>
                  <th className="border p-2 text-center" colSpan={3}>
                    Attempt 2 (if applicable)
                  </th>
                </tr>
                <tr className="bg-muted/50">
                  <th className="border p-2"></th>
                  <th className="border p-2 text-xs">Max Marks</th>
                  <th className="border p-2 text-xs">Score</th>
                  <th className="border p-2 text-xs">%</th>
                  <th className="border p-2 text-xs">Max Marks</th>
                  <th className="border p-2 text-xs">Score</th>
                  <th className="border p-2 text-xs">%</th>
                </tr>
              </thead>
              <tbody>
                {fields.map((field, index) => (
                  <tr key={field.id}>
                    <td className="border p-2 font-medium">{field.subject}</td>
                    <td className="border p-1">
                      <FormField
                        control={form.control}
                        name={`subjects.${index}.attempt1MaxMarks`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input type="number" {...field} className="h-8 text-sm" />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </td>
                    <td className="border p-1">
                      <FormField
                        control={form.control}
                        name={`subjects.${index}.attempt1Score`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input type="number" {...field} className="h-8 text-sm" />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </td>
                    <td className="border p-1">
                      <FormField
                        control={form.control}
                        name={`subjects.${index}.attempt1Percentage`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input type="number" step="0.01" {...field} className="h-8 text-sm" />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </td>
                    <td className="border p-1">
                      <FormField
                        control={form.control}
                        name={`subjects.${index}.attempt2MaxMarks`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input type="number" {...field} className="h-8 text-sm" />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </td>
                    <td className="border p-1">
                      <FormField
                        control={form.control}
                        name={`subjects.${index}.attempt2Score`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input type="number" {...field} className="h-8 text-sm" />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </td>
                    <td className="border p-1">
                      <FormField
                        control={form.control}
                        name={`subjects.${index}.attempt2Percentage`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input type="number" step="0.01" {...field} className="h-8 text-sm" />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </td>
                    
                    {/* +1 Total Columns - Show input fields for ALL attempts */}
                    {Array.from({ length: plusOneAttempts }).map((_, attemptIndex) => (
                      <React.Fragment key={`plus-one-total-${attemptIndex}`}>
                        <td className="border p-2 min-w-[80px]">
                          <FormField
                            control={form.control}
                            name="totalPlusOneMaxMarks"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    {...field} 
                                    className="h-9 text-sm font-medium w-full" 
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </td>
                        <td className="border p-2 min-w-[80px]">
                          <FormField
                            control={form.control}
                            name="totalPlusOneScore"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    {...field} 
                                    className="h-9 text-sm font-medium w-full" 
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </td>
                        <td className="border p-2 min-w-[80px]">
                          <FormField
                            control={form.control}
                            name="totalPlusOnePercentage"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    step="0.01" 
                                    {...field} 
                                    className="h-9 text-sm font-medium w-full" 
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </td>
                      </React.Fragment>
                    ))}
                    
                    {/* +2 Total Columns - Show input fields for ALL attempts */}
                    {Array.from({ length: plusTwoAttempts }).map((_, attemptIndex) => (
                      <React.Fragment key={`plus-two-total-${attemptIndex}`}>
                        <td className="border p-2 min-w-[80px]">
                          <FormField
                            control={form.control}
                            name="totalPlusTwoMaxMarks"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    {...field} 
                                    className="h-9 text-sm font-medium w-full" 
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </td>
                        <td className="border p-2 min-w-[80px]">
                          <FormField
                            control={form.control}
                            name="totalPlusTwoScore"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    {...field} 
                                    className="h-9 text-sm font-medium w-full" 
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </td>
                        <td className="border p-2 min-w-[80px]">
                          <FormField
                            control={form.control}
                            name="totalPlusTwoPercentage"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    step="0.01" 
                                    {...field} 
                                    className="h-9 text-sm font-medium w-full" 
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </td>
                      </React.Fragment>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="certificateNo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Certificate No/Date</FormLabel>
                <FormControl>
                  <Input placeholder="32402339" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="certificateDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Certificate Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="yearOfPassing"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Year of passing</FormLabel>
                <FormControl>
                  <Input placeholder="2020" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="boardOfExamination"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Board of Examination</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select board" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="state">State Board</SelectItem>
                    <SelectItem value="matric">Matriculation Board</SelectItem>
                    <SelectItem value="cbse">CBSE</SelectItem>
                    <SelectItem value="icse">ICSE</SelectItem>
                    <SelectItem value="nios">National Open School (NIOS)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="mediumOfInstruction"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Medium of Instruction</FormLabel>
                <FormControl>
                  <Input placeholder="English" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hscVerificationNo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>HSC Verification Certificate No.</FormLabel>
                <FormControl>
                  <Input placeholder="SP102331" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hscVerificationDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>HSC Verification Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  );
};