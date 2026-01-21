// import { useState, useEffect } from "react";
// import { useForm, useFieldArray } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Input } from "@/components/ui/input";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";

// // Import your data file - ensure this path is correct
// import { semesterData } from "./data/semesterData";

// import { apiService } from "@/lib/api";  // <-- ensure path correct
// import { toast } from "sonner";          // optional but recommended


// // Define the shape of a single course
// const courseSchema = z.object({
//   sNo: z.string(),
//   courseCode: z.string(),
//   universityCourseCode: z.string().optional(),
//   courseTitle: z.string(),
//   theoryCredits: z.string().optional(),
//   skillLabCredits: z.string().optional(),
//   clinicalCredits: z.string().optional(),
//   theoryPrescribed: z.string().optional(),
//   theoryAttended: z.string().optional(),
//   theoryPercentage: z.string().optional(),
//   skillLabPrescribed: z.string().optional(),
//   skillLabAttended: z.string().optional(),
//   skillLabPercentage: z.string().optional(),
//   clinicalPrescribed: z.string().optional(),
//   clinicalAttended: z.string().optional(),
//   clinicalPercentage: z.string().optional(),
//   theoryInternalMax: z.string().optional(),
//   theoryInternalObtained: z.string().optional(),
//   theoryEndSemMax: z.string().optional(),
//   theoryEndSemObtained: z.string().optional(),
//   theoryTotalMax: z.string().optional(),
//   theoryTotalObtained: z.string().optional(),
//   practicalInternalMax: z.string().optional(),
//   practicalInternalObtained: z.string().optional(),
//   practicalEndSemMax: z.string().optional(),
//   practicalEndSemObtained: z.string().optional(),
//   practicalTotalMax: z.string().optional(),
//   practicalTotalObtained: z.string().optional(),
//   gradePoint: z.string().optional(),
//   letterGrade: z.string().optional(),
//   sgpa: z.string().optional(),
//   rank: z.string().optional(),
// });

// const courseInstructionSchema = z.object({
//   studentId: z.string().optional(),
//   semester: z.string(),
//   courses: z.array(courseSchema),
// });

// type CourseInstructionFormData = z.infer<typeof courseInstructionSchema>;

// interface CourseInstructionFormProps {
//   onSubmit: (data: CourseInstructionFormData) => void;
//   defaultValues?: Partial<CourseInstructionFormData>;
//   onProgressChange?: (progress: number) => void;
// }

// /**
//  * Normalize a raw row from semesterData into the form-friendly object.
//  * Updated to specifically handle the keys found in the generated semesterData.ts
//  */
// function normalizeRow(raw: Record<string, any>) {
//   // Helper to safely get string values, handling potential casing issues
//   const getValue = (key: string) => {
//     // Try exact match first
//     if (raw[key] !== undefined) return String(raw[key]).trim();

//     // Fallback: lowercase match (in case data keys vary slightly)
//     const lowerKey = key.toLowerCase();
//     const foundKey = Object.keys(raw).find((k) => k.toLowerCase() === lowerKey);
//     return foundKey ? String(raw[foundKey]).trim() : "";
//   };


  
//   // Helper for numbers
//   const getNumber = (key: string) => {
//     const val = getValue(key);
//     const num = Number(val);
//     return isNaN(num) ? 0 : num;
//   };

//   return {
//     // 1. Basic Info
//     sNo: getValue("s_no"),
//     courseCode: getValue("course_code"),
//     universityCourseCode: getValue("university_course_code"),
//     courseTitle: getValue("course_title"),

//     // 2. Credits
//     theoryCredits: getValue("credits_theory"),
//     skillLabCredits: getValue("skill_lab"),
//     clinicalCredits: getValue("clinical"),

//     // 3. Instruction Hours
//     theoryPrescribed: getValue("course_instruction_hours_theory_prescribed"),
//     theoryAttended: getValue("attended"), // Specific mapping for 'attended'
//     theoryPercentage: getValue("theory_percentage"),

//     skillLabPrescribed: getValue("skill_lab_prescribed"),
//     skillLabAttended: getValue("skill_lab_attended"),
//     skillLabPercentage: getValue("skill_lab_percentage"),

//     clinicalPrescribed: getValue("clinical_prescribed"),
//     clinicalAttended: getValue("clinical_attended"),
//     clinicalPercentage: getValue("clinical_percentage"),

//     // 4. Marks - Theory
//     theoryInternalMax: getValue("marks_obtained_theory_internal_maximum"),
//     theoryInternalObtained: getValue("obtained"), // Specific mapping for 'obtained'
//     theoryEndSemMax: getValue(
//       "end_semester_college_university_examination_maximum"
//     ),
//     theoryEndSemObtained: getValue("theory_end_sem_obtained"),
//     theoryTotalMax: getValue("total_marks_maximum"),
//     theoryTotalObtained: getValue("theory_total_obtained"),

//     // 5. Marks - Practical
//     practicalInternalMax: getValue("practical_internal_maximum"),
//     practicalInternalObtained: getValue("practical_internal_obtained"),
//     practicalEndSemMax: getValue("practical_end_semester_maximum"),
//     practicalEndSemObtained: getValue("practical_end_semester_obtained"),
//     practicalTotalMax: getValue("practical_total_maximum"),
//     practicalTotalObtained: getValue("practical_total_obtained"),

//     // 6. Grading
//     gradePoint: getValue("grade_point"),
//     letterGrade: getValue("letter_grade"),
//   };
// }





// export const CourseInstructionForm = ({
//   onSubmit,
//   defaultValues,
//   onProgressChange,
// }: CourseInstructionFormProps) => {
//   const [selectedSemester, setSelectedSemester] = useState<string>(
//     defaultValues?.semester || "I"
//   );


//   const handleSubmitForm = async (values: CourseInstructionFormData) => {
//   try {
//     const payload = {
//       studentId: values.studentId,
//       semester: values.semester,
//       courses: values.courses,
//     };


//     console.log("Submitting Course Instruction:", payload);
//     const res = await apiService.createCourseInstruction(payload);

//     toast.success("Course Instruction saved successfully!");

//     onSubmit?.(values); // keep your parent handler also
//   } catch (error: any) {
//     console.error("Error saving course instruction:", error);
//     toast.error("Failed to save course instruction");
//   }
// };

//   // Helper to load and normalize data
//   const getCoursesForSemester = (sem: string) => {
//     // Ensure we handle cases where sem might not exist in data
//     const rawData = semesterData[sem as keyof typeof semesterData] || [];
//     return rawData.map((r: any) => normalizeRow(r));
//   };

//   const form = useForm<CourseInstructionFormData>({
//     resolver: zodResolver(courseInstructionSchema),
//     defaultValues: defaultValues || {
//       studentId: "",
//       semester: selectedSemester,
//       courses: getCoursesForSemester(selectedSemester),
//     },
//   });

//   const { fields, replace } = useFieldArray({
//     control: form.control,
//     name: "courses",
//   });

//   // Handle Semester Change
//   const handleSemesterChange = (semester: string) => {
//     setSelectedSemester(semester);
//     form.setValue("semester", semester);

//     // Replace current fields with new semester data
//     const newCourses = getCoursesForSemester(semester);
//     replace(newCourses);
//   };

//   // Progress Tracking
//   useEffect(() => {
//     const subscription = form.watch((values) => {
//       let filledFields = 0;
//       // Fields to check for progress calculation
//       const fieldsPerCourse = ["theoryAttended", "theoryInternalObtained"];

//       values.courses?.forEach((course: any) => {
//         if (course) {
//           filledFields += fieldsPerCourse.filter(
//             (field) => course[field] && String(course[field]).trim() !== ""
//           ).length;
//         }
//       });

//       const totalRequiredFields = (fields.length || 1) * fieldsPerCourse.length;
//       const progress =
//         totalRequiredFields > 0
//           ? (filledFields / totalRequiredFields) * 100
//           : 0;
//       onProgressChange?.(progress);
//     });
//     return () => subscription.unsubscribe();
//   }, [form, onProgressChange, fields.length]);

//   // Sync Student ID
//   useEffect(() => {
//     if (defaultValues?.studentId) {
//       const currentId = form.getValues("studentId");
//       if (!currentId) {
//         form.setValue("studentId", defaultValues.studentId || "");
//       }
//     }
//   }, [defaultValues, form]);

//   return (
//     <Form {...form}>
//       <form
//         id="active-form"
//         onSubmit={form.handleSubmit(handleSubmitForm)}
//         className="space-y-6"
//       >
//         <FormField
//           control={form.control}
//           name="studentId"
//           render={({ field }) => (
//             <input type="hidden" {...field} value={field.value || ""} />
//           )}
//         />

//         <div className="flex items-center gap-4">
//           <label className="font-semibold">Select Semester:</label>
//           <Select value={selectedSemester} onValueChange={handleSemesterChange}>
//             <SelectTrigger className="w-48">
//               <SelectValue />
//             </SelectTrigger>
//             <SelectContent>
//               {["I", "II", "III", "IV", "V", "VI", "VII", "VIII"].map((sem) => (
//                 <SelectItem key={sem} value={sem}>
//                   Semester {sem}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>

//         <div className="border rounded-lg overflow-x-auto">
//           <Table>
//             <TableHeader>
//               {/* Header Rows */}
//               <TableRow className="bg-muted/50 text-xs">
//                 <TableHead
//                   rowSpan={4}
//                   className="border-r text-center align-middle min-w-12"
//                 >
//                   S.No
//                 </TableHead>
//                 <TableHead
//                   rowSpan={4}
//                   className="border-r text-center align-middle min-w-32"
//                 >
//                   Course Code
//                 </TableHead>
//                 <TableHead
//                   rowSpan={4}
//                   className="border-r text-center align-middle min-w-32"
//                 >
//                   University Course Code
//                 </TableHead>
//                 <TableHead
//                   rowSpan={4}
//                   className="border-r text-center align-middle min-w-48"
//                 >
//                   Course Title
//                 </TableHead>
//                 <TableHead
//                   colSpan={3}
//                   className="border-r text-center align-middle"
//                 >
//                   Credits
//                 </TableHead>
//                 <TableHead
//                   colSpan={9}
//                   className="border-r text-center align-middle"
//                 >
//                   Course Instruction Hours
//                 </TableHead>
//                 <TableHead
//                   colSpan={12}
//                   className="border-r text-center align-middle"
//                 >
//                   Marks Obtained
//                 </TableHead>
//                 <TableHead
//                   rowSpan={4}
//                   className="border-r text-center align-middle min-w-20"
//                 >
//                   Grade Point
//                 </TableHead>
//                 <TableHead
//                   rowSpan={4}
//                   className="border-r text-center align-middle min-w-20"
//                 >
//                   Letter Grade
//                 </TableHead>
//                 <TableHead
//                   rowSpan={4}
//                   className="border-r text-center align-middle min-w-20"
//                 >
//                   SGPA
//                 </TableHead>
//                 <TableHead
//                   rowSpan={4}
//                   className="border-r text-center align-middle min-w-20"
//                 >
//                   Rank
//                 </TableHead>
//               </TableRow>

//               <TableRow className="bg-muted/50 text-xs">
//                 <TableHead
//                   rowSpan={3}
//                   className="border-r text-center align-middle"
//                 >
//                   Theory
//                 </TableHead>
//                 <TableHead
//                   rowSpan={3}
//                   className="border-r text-center align-middle"
//                 >
//                   Skill Lab
//                 </TableHead>
//                 <TableHead
//                   rowSpan={3}
//                   className="border-r text-center align-middle"
//                 >
//                   Clinical
//                 </TableHead>

//                 <TableHead
//                   colSpan={3}
//                   className="border-r text-center align-middle"
//                 >
//                   Theory
//                 </TableHead>
//                 <TableHead
//                   colSpan={3}
//                   className="border-r text-center align-middle"
//                 >
//                   Skill Lab
//                 </TableHead>
//                 <TableHead
//                   colSpan={3}
//                   className="border-r text-center align-middle"
//                 >
//                   Clinical
//                 </TableHead>

//                 <TableHead
//                   colSpan={6}
//                   className="border-r text-center align-middle"
//                 >
//                   Theory
//                 </TableHead>
//                 <TableHead
//                   colSpan={6}
//                   className="border-r text-center align-middle"
//                 >
//                   Practical
//                 </TableHead>
//               </TableRow>

//               <TableRow className="bg-muted/50 text-xs">
//                 <TableHead rowSpan={2} className="border-r text-center">
//                   Prescribed
//                 </TableHead>
//                 <TableHead rowSpan={2} className="border-r text-center">
//                   Attended
//                 </TableHead>
//                 <TableHead rowSpan={2} className="border-r text-center">
//                   %
//                 </TableHead>

//                 <TableHead rowSpan={2} className="border-r text-center">
//                   Prescribed
//                 </TableHead>
//                 <TableHead rowSpan={2} className="border-r text-center">
//                   Attended
//                 </TableHead>
//                 <TableHead rowSpan={2} className="border-r text-center">
//                   %
//                 </TableHead>

//                 <TableHead rowSpan={2} className="border-r text-center">
//                   Prescribed
//                 </TableHead>
//                 <TableHead rowSpan={2} className="border-r text-center">
//                   Attended
//                 </TableHead>
//                 <TableHead rowSpan={2} className="border-r text-center">
//                   %
//                 </TableHead>

//                 <TableHead colSpan={2} className="border-r text-center">
//                   Internal
//                 </TableHead>
//                 <TableHead colSpan={2} className="border-r text-center">
//                   End Sem
//                 </TableHead>
//                 <TableHead colSpan={2} className="border-r text-center">
//                   Total
//                 </TableHead>

//                 <TableHead colSpan={2} className="border-r text-center">
//                   Internal
//                 </TableHead>
//                 <TableHead colSpan={2} className="border-r text-center">
//                   End Sem
//                 </TableHead>
//                 <TableHead colSpan={2} className="border-r text-center">
//                   Total
//                 </TableHead>
//               </TableRow>

//               <TableRow className="bg-muted/50 text-xs">
//                 <TableHead className="border-r text-center">Max</TableHead>
//                 <TableHead className="border-r text-center">Obt</TableHead>
//                 <TableHead className="border-r text-center">Max</TableHead>
//                 <TableHead className="border-r text-center">Obt</TableHead>
//                 <TableHead className="border-r text-center">Max</TableHead>
//                 <TableHead className="border-r text-center">Obt</TableHead>
//                 <TableHead className="border-r text-center">Max</TableHead>
//                 <TableHead className="border-r text-center">Obt</TableHead>
//                 <TableHead className="border-r text-center">Max</TableHead>
//                 <TableHead className="border-r text-center">Obt</TableHead>
//                 <TableHead className="border-r text-center">Max</TableHead>
//                 <TableHead className="border-r text-center">Obt</TableHead>
//               </TableRow>
//             </TableHeader>

//             <TableBody>
//               {fields.map((field, index) => {
//                 const isSemVIII = selectedSemester === "VIII";

//                 // Define merged row conditions (0-indexed, so 5th row is index 4)
//                 const isMergedRow =
//                   (selectedSemester === "I" && index === 6) || // 7th row
//                   (selectedSemester === "II" && index === 4) || // 5th row
//                   (selectedSemester === "III" && index === 4) || // 5th row
//                   (selectedSemester === "IV" && index === 5); // 6th row

//                 return (
//                   <TableRow
//                     key={field.id}
//                     className="hover:bg-muted/30 text-xs"
//                   >
//                     {/* --- COLUMNS 1-4 (Always Visible) --- */}

//                     {/* 1. S.No */}
//                     <TableCell className="border-r text-center">
//                       {field.sNo}
//                     </TableCell>

//                     {/* 2. Course Code */}
//                     <TableCell className="border-r">
//                       {field.courseCode}
//                     </TableCell>

//                     {/* 3. University Course Code */}
//                     <TableCell className="border-r">
//                       <FormField
//                         control={form.control}
//                         name={`courses.${index}.universityCourseCode`}
//                         render={({ field: formField }) => (
//                           <FormItem>
//                             <FormControl>
//                               {index === 7 ? (
//                                 <span className="text-xs"></span> // show "-" or keep empty if you want
//                               ) : (
//                                 <Input {...formField} className="h-8 text-xs" />
//                               )}
//                             </FormControl>
//                           </FormItem>
//                         )}
//                       />
//                     </TableCell>

//                     {/* 4. Course Title */}
//                     <TableCell className="border-r">
//                       {field.courseTitle}
//                     </TableCell>

//                     {/* --- MERGED LOGIC START (Columns 5 to End) --- */}
//                     {isMergedRow ? (
//                       // Render this single cell for the merged rows
//                       // colSpan 28 covers the rest of the table
//                       <TableCell
//                         colSpan={28}
//                         className="border-r text-center font-medium bg-muted/20"
//                       >
//                         {/* Displaying theoryPrescribed as requested */}
//                         {field.theoryPrescribed}
//                       </TableCell>
//                     ) : (
//                       // Render standard columns for all other rows
//                       <>
//                         {/* Credits */}
//                         <TableCell className="border-r text-center">
//                           {field.theoryCredits}
//                         </TableCell>
//                         <TableCell className="border-r text-center">
//                           {field.skillLabCredits}
//                         </TableCell>
//                         <TableCell className="border-r text-center">
//                           {field.clinicalCredits}
//                         </TableCell>

//                         {/* Instruction Hours - Theory */}
//                         <TableCell className="border-r text-center">
//                           {isSemVIII && field.theoryPrescribed === "0" ? (
//                             <FormField
//                               control={form.control}
//                               name={`courses.${index}.theoryPrescribed`}
//                               render={({ field: formField }) => (
//                                 <FormItem>
//                                   <FormControl>
//                                     <Input
//                                       {...formField}
//                                       className="h-8 w-16 text-xs"
//                                     />
//                                   </FormControl>
//                                 </FormItem>
//                               )}
//                             />
//                           ) : (
//                             field.theoryPrescribed
//                           )}
//                         </TableCell>
//                         <TableCell className="border-r">
//                           <FormField
//                             control={form.control}
//                             name={`courses.${index}.theoryAttended`}
//                             render={({ field: formField }) => (
//                               <FormItem>
//                                 <FormControl>
//                                   {index === 7 ? (
//                                 <span className="text-xs"></span>
//                               ) : (
//                                 <Input {...formField} className="h-8 w-16 text-xs" />
//                               )}
//                                 </FormControl>
//                               </FormItem>
//                             )}
//                           />
//                         </TableCell>
//                         <TableCell className="border-r">
//                           <FormField
//                             control={form.control}
//                             name={`courses.${index}.theoryPercentage`}
//                             render={({ field: formField }) => (
//                               <FormItem>
//                                 <FormControl>
//                                   {index === 7 ? (
//                                 <span className="text-xs"></span>
//                               ) : (
//                                 <Input {...formField} className="h-8 w-16 text-xs" />
//                               )}
//                                 </FormControl>
//                               </FormItem>
//                             )}
//                           />
//                         </TableCell>

//                         {/* Instruction Hours - Skill Lab */}
//                         <TableCell className="border-r text-center">
//                           {field.skillLabPrescribed}
//                         </TableCell>
//                         <TableCell className="border-r">
//                           <FormField
//                             control={form.control}
//                             name={`courses.${index}.skillLabAttended`}
//                             render={({ field: formField }) => (
//                               <FormItem>
//                                 <FormControl>
//                                   {index === 7 ? (
//                                 <span className="text-xs"></span>
//                               ) : (
//                                 <Input {...formField} className="h-8 w-16 text-xs" />
//                               )}
//                                 </FormControl>
//                               </FormItem>
//                             )}
//                           />
//                         </TableCell>
//                         <TableCell className="border-r">
//                           <FormField
//                             control={form.control}
//                             name={`courses.${index}.skillLabPercentage`}
//                             render={({ field: formField }) => (
//                               <FormItem>
//                                 <FormControl>
//                                   {index === 7 ? (
//                                 <span className="text-xs"></span>
//                               ) : (
//                                 <Input {...formField} className="h-8 w-16 text-xs" />
//                               )}
//                                 </FormControl>
//                               </FormItem>
//                             )}
//                           />
//                         </TableCell>

//                         {/* Instruction Hours - Clinical */}
//                         <TableCell className="border-r text-center">
//                           {field.clinicalPrescribed}
//                         </TableCell>
//                         <TableCell className="border-r">
//                           <FormField
//                             control={form.control}
//                             name={`courses.${index}.clinicalAttended`}
//                             render={({ field: formField }) => (
//                               <FormItem>
//                                 <FormControl>
//                                   {index === 7 ? (
//                                 <span className="text-xs"></span>
//                               ) : (
//                                 <Input {...formField} className="h-8 w-16 text-xs" />
//                               )}
//                                 </FormControl>
//                               </FormItem>
//                             )}
//                           />
//                         </TableCell>
//                         <TableCell className="border-r">
//                           <FormField
//                             control={form.control}
//                             name={`courses.${index}.clinicalPercentage`}
//                             render={({ field: formField }) => (
//                               <FormItem>
//                                 <FormControl>
//                                   {index === 7 ? (
//                                 <span className="text-xs"></span>
//                               ) : (
//                                 <Input {...formField} className="h-8 w-16 text-xs" />
//                               )}
//                                 </FormControl>
//                               </FormItem>
//                             )}
//                           />
//                         </TableCell>

//                         {/* Marks - Theory */}
//                         <TableCell className="border-r text-center">
//                           {field.theoryInternalMax}
//                         </TableCell>
//                         <TableCell className="border-r">
//                           <FormField
//                             control={form.control}
//                             name={`courses.${index}.theoryInternalObtained`}
//                             render={({ field: formField }) => (
//                               <FormItem>
//                                 <FormControl>
//                                   {index === 7 ? (
//                                 <span className="text-xs"></span>
//                               ) : (
//                                 <Input {...formField} className="h-8 w-16 text-xs" />
//                               )}
//                                 </FormControl>
//                               </FormItem>
//                             )}
//                           />
//                         </TableCell>
//                         <TableCell className="border-r text-center">
//                           {field.theoryEndSemMax}
//                         </TableCell>
//                         <TableCell className="border-r">
//                           <FormField
//                             control={form.control}
//                             name={`courses.${index}.theoryEndSemObtained`}
//                             render={({ field: formField }) => (
//                               <FormItem>
//                                 <FormControl>
//                                   {index === 7 ? (
//                                 <span className="text-xs"></span>
//                               ) : (
//                                 <Input {...formField} className="h-8 w-16 text-xs" />
//                               )}
//                                 </FormControl>
//                               </FormItem>
//                             )}
//                           />
//                         </TableCell>
//                         <TableCell className="border-r text-center">
//                           {field.theoryTotalMax}
//                         </TableCell>
//                         <TableCell className="border-r">
//                           <FormField
//                             control={form.control}
//                             name={`courses.${index}.theoryTotalObtained`}
//                             render={({ field: formField }) => (
//                               <FormItem>
//                                 <FormControl>
//                                   {index === 7 ? (
//                                 <span className="text-xs"></span>
//                               ) : (
//                                 <Input {...formField} className="h-8 w-16 text-xs" />
//                               )}
//                                 </FormControl>
//                               </FormItem>
//                             )}
//                           />
//                         </TableCell>

//                         {/* Marks - Practical */}
//                         <TableCell className="border-r text-center">
//                           {field.practicalInternalMax}
//                         </TableCell>
//                         <TableCell className="border-r">
//                           <FormField
//                             control={form.control}
//                             name={`courses.${index}.practicalInternalObtained`}
//                             render={({ field: formField }) => (
//                               <FormItem>
//                                 <FormControl>
//                                   {index === 7 ? (
//                                 <span className="text-xs"></span>
//                               ) : (
//                                 <Input {...formField} className="h-8 w-16 text-xs" />
//                               )}
//                                 </FormControl>
//                               </FormItem>
//                             )}
//                           />
//                         </TableCell>
//                         <TableCell className="border-r text-center">
//                           {field.practicalEndSemMax}
//                         </TableCell>
//                         <TableCell className="border-r">
//                           <FormField
//                             control={form.control}
//                             name={`courses.${index}.practicalEndSemObtained`}
//                             render={({ field: formField }) => (
//                               <FormItem>
//                                 <FormControl>
//                                   {index === 7 ? (
//                                 <span className="text-xs"></span>
//                               ) : (
//                                 <Input {...formField} className="h-8 w-16 text-xs" />
//                               )}
//                                 </FormControl>
//                               </FormItem>
//                             )}
//                           />
//                         </TableCell>
//                         <TableCell className="border-r text-center">
//                           {field.practicalTotalMax}
//                         </TableCell>
//                         <TableCell className="border-r">
//                           <FormField
//                             control={form.control}
//                             name={`courses.${index}.practicalTotalObtained`}
//                             render={({ field: formField }) => (
//                               <FormItem>
//                                 <FormControl>
//                                   {index === 7 ? (
//                                 <span className="text-xs"></span>
//                               ) : (
//                                 <Input {...formField} className="h-8 w-16 text-xs" />
//                               )}
//                                 </FormControl>
//                               </FormItem>
//                             )}
//                           />
//                         </TableCell>

//                         {/* Grade Point / Letter Grade / SGPA / Rank */}
//                         <TableCell className="border-r text-center">
//                           <FormField
//                             control={form.control}
//                             name={`courses.${index}.gradePoint`}
//                             render={({ field: formField }) => (
//                               <FormItem>
//                                 <FormControl>
//                                   {index === 7 ? (
//                                 <span className="text-xs"></span>
//                               ) : (
//                                 <Input {...formField} className="h-8 w-16 text-xs" />
//                               )}
//                                 </FormControl>
//                               </FormItem>
//                             )}
//                           />
//                         </TableCell>
//                         <TableCell className="border-r text-center">
//                           <FormField
//                             control={form.control}
//                             name={`courses.${index}.letterGrade`}
//                             render={({ field: formField }) => (
//                               <FormItem>
//                                 <FormControl>
//                                   {index === 7 ? (
//                                 <span className="text-xs"></span>
//                               ) : (
//                                 <Input {...formField} className="h-8 w-16 text-xs" />
//                               )}
//                                 </FormControl>
//                               </FormItem>
//                             )}
//                           />
//                         </TableCell>
//                         <TableCell className="border-r text-center">
//                           <FormField
//                             control={form.control}
//                             name={`courses.${index}.sgpa`}
//                             render={({ field: formField }) => (
//                               <FormItem>
//                                 <FormControl>
//                                   {index === 7 ? (
//                                 <span className="text-xs"></span>
//                               ) : (
//                                 <Input {...formField} className="h-8 w-16 text-xs" />
//                               )}
//                                 </FormControl>
//                               </FormItem>
//                             )}
//                           />
//                         </TableCell>
//                         <TableCell className="border-r text-center">
//                           <FormField
//                             control={form.control}
//                             name={`courses.${index}.rank`}
//                             render={({ field: formField }) => (
//                               <FormItem>
//                                 <FormControl>
//                                   {index === 7 ? (
//                                 <span className="text-xs"></span>
//                               ) : (
//                                 <Input {...formField} className="h-8 w-16 text-xs" />
//                               )}
//                                 </FormControl>
//                               </FormItem>
//                             )}
//                           />
//                         </TableCell>
//                       </>
//                     )}
//                   </TableRow>
//                 );
//               })}
//             </TableBody>
//           </Table>
//         </div>

//         <div className="text-sm text-muted-foreground italic">
//           Note: Fill in marks and attendance for the selected semester.
//         </div>
//       </form>
//     </Form>
//   );
// };


import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";

// Import your data file - ensure this path is correct
import { semesterData } from "./data/semesterData";

// Define the shape of a single course
const courseSchema = z.object({
  sNo: z.string(),
  courseCode: z.string(),
  universityCourseCode: z.string().optional(),
  courseTitle: z.string(),
  theoryCredits: z.string().optional(),
  skillLabCredits: z.string().optional(),
  clinicalCredits: z.string().optional(),
  theoryPrescribed: z.string().optional(),
  theoryAttended: z.string().optional(),
  theoryPercentage: z.string().optional(),
  skillLabPrescribed: z.string().optional(),
  skillLabAttended: z.string().optional(),
  skillLabPercentage: z.string().optional(),
  clinicalPrescribed: z.string().optional(),
  clinicalAttended: z.string().optional(),
  clinicalPercentage: z.string().optional(),
  theoryInternalMax: z.string().optional(),
  theoryInternalObtained: z.string().optional(),
  theoryEndSemMax: z.string().optional(),
  theoryEndSemObtained: z.string().optional(),
  theoryTotalMax: z.string().optional(),
  theoryTotalObtained: z.string().optional(),
  practicalInternalMax: z.string().optional(),
  practicalInternalObtained: z.string().optional(),
  practicalEndSemMax: z.string().optional(),
  practicalEndSemObtained: z.string().optional(),
  practicalTotalMax: z.string().optional(),
  practicalTotalObtained: z.string().optional(),
  gradePoint: z.string().optional(),
  letterGrade: z.string().optional(),
  sgpa: z.string().optional(),
  rank: z.string().optional(),
});

const courseInstructionSchema = z.object({
  studentId: z.string().optional(),
  semester: z.string(),
  courses: z.array(courseSchema),
});

/////////// Non editable cells //////////

// Hide specific cells ONLY for specific semesters
const nonEditableCells: Record<string, Record<string, number[]>> = {
  I: {
    universityCourseCode: [7],
    theoryAttended: [7],
    theoryPercentage: [7],
    skillLabAttended: [7],
    skillLabPercentage: [7],
    clinicalAttended: [7],
    clinicalPercentage: [7],
    theoryInternalObtained: [7],
    theoryEndSemObtained: [7],
    theoryTotalObtained: [7],
    practicalInternalObtained: [7],
    practicalEndSemObtained: [7],
    practicalTotalObtained: [7],
    gradePoint: [7],
    letterGrade: [7],
    sgpa: [7],
    rank: [7],
  },
  II: {
    universityCourseCode: [5],
    theoryAttended: [5],
    theoryPercentage: [5],
    skillLabAttended: [5],
    skillLabPercentage: [5],
    clinicalAttended: [5],
    clinicalPercentage: [5],
    theoryInternalObtained: [5],
    theoryEndSemObtained: [5],
    theoryTotalObtained: [5],
    practicalInternalObtained: [5],
    practicalEndSemObtained: [5],
    practicalTotalObtained: [5],
    gradePoint: [5],
    letterGrade: [5],
    sgpa: [5],
    rank: [5],
  },
  III: {
    universityCourseCode: [5],
    theoryAttended: [5],
    theoryPercentage: [5],
    skillLabAttended: [5],
    skillLabPercentage: [5],
    clinicalAttended: [5],
    clinicalPercentage: [5],
    theoryInternalObtained: [5],
    theoryEndSemObtained: [5],
    theoryTotalObtained: [5],
    practicalInternalObtained: [5],
    practicalEndSemObtained: [5],
    practicalTotalObtained: [5],
    gradePoint: [5],
    letterGrade: [5],
    sgpa: [5],
    rank: [5],
  },
  IV: {
    universityCourseCode: [6],
    theoryAttended: [6],
    theoryPercentage: [6],
    skillLabAttended: [6],
    skillLabPercentage: [6],
    clinicalAttended: [6],
    clinicalPercentage: [6],
    theoryInternalObtained: [6],
    theoryEndSemObtained: [6],
    theoryTotalObtained: [6],
    practicalInternalObtained: [6],
    practicalEndSemObtained: [6],
    practicalTotalObtained: [6],
    gradePoint: [6],
    letterGrade: [6],
    sgpa: [6],
    rank: [6],
  },
  V: {
    universityCourseCode: [6],
    theoryAttended: [6],
    theoryPercentage: [6],
    skillLabAttended: [6],
    skillLabPercentage: [6],
    clinicalAttended: [6],
    clinicalPercentage: [6],
    theoryInternalObtained: [6],
    theoryEndSemObtained: [6],
    theoryTotalObtained: [6],
    practicalInternalObtained: [6],
    practicalEndSemObtained: [6],
    practicalTotalObtained: [6],
    gradePoint: [6],
    letterGrade: [6],
    sgpa: [6],
    rank: [6],
  },
  VI: {
    universityCourseCode: [5],
    theoryAttended: [5],
    theoryPercentage: [5],
    skillLabAttended: [5],
    skillLabPercentage: [5],
    clinicalAttended: [5],
    clinicalPercentage: [5],
    theoryInternalObtained: [5],
    theoryEndSemObtained: [5],
    theoryTotalObtained: [5],
    practicalInternalObtained: [5],
    practicalEndSemObtained: [5],
    practicalTotalObtained: [5],
    gradePoint: [5],
    letterGrade: [5],
    sgpa: [5],
    rank: [5],
  },
  VII: {
    universityCourseCode: [4],
    theoryAttended: [4],
    theoryPercentage: [4],
    skillLabAttended: [4],
    skillLabPercentage: [4],
    clinicalAttended: [4],
    clinicalPercentage: [4],
    theoryInternalObtained: [4],
    theoryEndSemObtained: [4],
    theoryTotalObtained: [4],
    practicalInternalObtained: [4],
    practicalEndSemObtained: [4],
    practicalTotalObtained: [4],
    gradePoint: [4],
    letterGrade: [4],
    sgpa: [4],
    rank: [4],
  },
  VIII: {
    universityCourseCode: [5],
    theoryAttended: [5],
    theoryPercentage: [5],
    skillLabAttended: [5],
    skillLabPercentage: [5],
    clinicalAttended: [5],
    clinicalPercentage: [5],
    theoryInternalObtained: [5],
    theoryEndSemObtained: [5],
    theoryTotalObtained: [5],
    practicalInternalObtained: [5],
    practicalEndSemObtained: [5],
    practicalTotalObtained: [5],
    gradePoint: [5],
    letterGrade: [5],
    sgpa: [5],
    rank: [5],
  },
};

function isEditable(semester: string, fieldName: string, rowIndex: number) {
  const semRules = nonEditableCells[semester];
  if (!semRules) return true; // editable unless semester has rules

  const disabledRows = semRules[fieldName];
  if (!disabledRows) return true; // editable if this field has no rule in this semester

  return !disabledRows.includes(rowIndex); // editable if row is not listed
}

/////////////////////

type CourseInstructionFormData = z.infer<typeof courseInstructionSchema>;

interface CourseInstructionFormProps {
  onSubmit: (data: CourseInstructionFormData) => void;
  defaultValues?: Partial<CourseInstructionFormData>;
  onProgressChange?: (progress: number) => void;
}

/**
 * Normalize a raw row from semesterData into the form-friendly object.
 * Updated to specifically handle the keys found in the generated semesterData.ts
 */
function normalizeRow(raw: Record<string, any>) {
  // Helper to safely get string values, handling potential casing issues
  const getValue = (key: string) => {
    // Try exact match first
    if (raw[key] !== undefined) return String(raw[key]).trim();

    // Fallback: lowercase match (in case data keys vary slightly)
    const lowerKey = key.toLowerCase();
    const foundKey = Object.keys(raw).find((k) => k.toLowerCase() === lowerKey);
    return foundKey ? String(raw[foundKey]).trim() : "";
  };

  // Helper for numbers
  const getNumber = (key: string) => {
    const val = getValue(key);
    const num = Number(val);
    return isNaN(num) ? 0 : num;
  };

  return {
    // 1. Basic Info
    sNo: getValue("s_no"),
    courseCode: getValue("course_code"),
    universityCourseCode: getValue("university_course_code"),
    courseTitle: getValue("course_title"),

    // 2. Credits
    theoryCredits: getValue("credits_theory"),
    skillLabCredits: getValue("skill_lab"),
    clinicalCredits: getValue("clinical"),

    // 3. Instruction Hours
    theoryPrescribed: getValue("course_instruction_hours_theory_prescribed"),
    theoryAttended: getValue("attended"), // Specific mapping for 'attended'
    theoryPercentage: getValue("theory_percentage"),

    skillLabPrescribed: getValue("skill_lab_prescribed"),
    skillLabAttended: getValue("skill_lab_attended"),
    skillLabPercentage: getValue("skill_lab_percentage"),

    clinicalPrescribed: getValue("clinical_prescribed"),
    clinicalAttended: getValue("clinical_attended"),
    clinicalPercentage: getValue("clinical_percentage"),

    // 4. Marks - Theory
    theoryInternalMax: getValue("marks_obtained_theory_internal_maximum"),
    theoryInternalObtained: getValue("obtained"), // Specific mapping for 'obtained'
    theoryEndSemMax: getValue(
      "end_semester_college_university_examination_maximum"
    ),
    theoryEndSemObtained: getValue("theory_end_sem_obtained"),
    theoryTotalMax: getValue("total_marks_maximum"),
    theoryTotalObtained: getValue("theory_total_obtained"),

    // 5. Marks - Practical
    practicalInternalMax: getValue("practical_internal_maximum"),
    practicalInternalObtained: getValue("practical_internal_obtained"),
    practicalEndSemMax: getValue("practical_end_semester_maximum"),
    practicalEndSemObtained: getValue("practical_end_semester_obtained"),
    practicalTotalMax: getValue("practical_total_maximum"),
    practicalTotalObtained: getValue("practical_total_obtained"),

    // 6. Grading
    gradePoint: getValue("grade_point"),
    letterGrade: getValue("letter_grade"),
  };
}

export const CourseInstructionForm = ({
  onSubmit,
  defaultValues,
  onProgressChange,
}: CourseInstructionFormProps) => {
  const [selectedSemester, setSelectedSemester] = useState<string>(
    defaultValues?.semester || "I"
  );

  // Helper to load and normalize template data from semesterData
  const getTemplateCoursesForSemester = (sem: string) => {
    const rawData = semesterData[sem as keyof typeof semesterData] || [];
    return rawData.map((r: any) => normalizeRow(r));
  };

  // Helper to merge saved data with template data
  const getCoursesForSemester = (sem: string, savedData?: any[]) => {
    const templateCourses = getTemplateCoursesForSemester(sem);

    // If no saved data, return template
    if (!savedData || !Array.isArray(savedData)) {
      return templateCourses;
    }

    // Filter saved data for this semester
    const savedCoursesForSem = savedData.filter((c: any) => c.semester === sem);

    // If no saved courses for this semester, return template
    if (savedCoursesForSem.length === 0) {
      return templateCourses;
    }

    // Merge: for each template course, check if there's saved data
    return templateCourses.map((template: any) => {
      const saved = savedCoursesForSem.find(
        (s: any) => s.sNo === template.sNo || s.courseCode === template.courseCode
      );

      // If found saved data, merge it with template (saved data takes priority)
      if (saved) {
        return { ...template, ...saved };
      }

      // Otherwise return template
      return template;
    });
  };

  const form = useForm<CourseInstructionFormData>({
    resolver: zodResolver(courseInstructionSchema),
    defaultValues: defaultValues || {
      studentId: "",
      semester: selectedSemester,
      courses: getCoursesForSemester(selectedSemester, defaultValues),
    },
  });

  const { fields, replace } = useFieldArray({
    control: form.control,
    name: "courses",
  });

  // Handle Semester Change
  const handleSemesterChange = (semester: string) => {
    setSelectedSemester(semester);
    form.setValue("semester", semester);

    // Replace current fields with new semester data (merged with saved data if available)
    const newCourses = getCoursesForSemester(semester, defaultValues);
    replace(newCourses);
  };

  // Progress Tracking
  useEffect(() => {
    const subscription = form.watch((values) => {
      let filledFields = 0;
      // Fields to check for progress calculation
      const fieldsPerCourse = ["theoryAttended", "theoryInternalObtained"];

      values.courses?.forEach((course: any) => {
        if (course) {
          filledFields += fieldsPerCourse.filter(
            (field) => course[field] && String(course[field]).trim() !== ""
          ).length;
        }
      });

      const totalRequiredFields = (fields.length || 1) * fieldsPerCourse.length;
      const progress =
        totalRequiredFields > 0
          ? (filledFields / totalRequiredFields) * 100
          : 0;
      onProgressChange?.(progress);
    });
    return () => subscription.unsubscribe();
  }, [form, onProgressChange, fields.length]);

  // Sync Student ID
  useEffect(() => {
    if (defaultValues?.studentId) {
      const currentId = form.getValues("studentId");
      if (!currentId) {
        form.setValue("studentId", defaultValues.studentId || "");
      }
    }
  }, [defaultValues, form]);

  return (
    <Form {...form}>
      <form
        id="active-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <FormField
          control={form.control}
          name="studentId"
          render={({ field }) => (
            <input type="hidden" {...field} value={field.value || ""} />
          )}
        />

        <div className="flex items-center gap-4">
          <label className="font-semibold">Select Semester:</label>
          <Select value={selectedSemester} onValueChange={handleSemesterChange}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {["I", "II", "III", "IV", "V", "VI", "VII", "VIII"].map((sem) => (
                <SelectItem key={sem} value={sem}>
                  Semester {sem}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="border rounded-lg overflow-x-auto">
          <Table>
            <TableHeader>
              {/* Header Rows */}
              <TableRow className="bg-muted/50 text-xs">
                <TableHead
                  rowSpan={4}
                  className="border-r text-center align-middle min-w-12"
                >
                  S.No
                </TableHead>
                <TableHead
                  rowSpan={4}
                  className="border-r text-center align-middle min-w-32"
                >
                  Course Code
                </TableHead>
                <TableHead
                  rowSpan={4}
                  className="border-r text-center align-middle min-w-32"
                >
                  University Course Code
                </TableHead>
                <TableHead
                  rowSpan={4}
                  className="border-r text-center align-middle min-w-48"
                >
                  Course Title
                </TableHead>
                <TableHead
                  colSpan={3}
                  className="border-r text-center align-middle"
                >
                  Credits
                </TableHead>
                <TableHead
                  colSpan={9}
                  className="border-r text-center align-middle"
                >
                  Course Instruction Hours
                </TableHead>
                <TableHead
                  colSpan={12}
                  className="border-r text-center align-middle"
                >
                  Marks Obtained
                </TableHead>
                <TableHead
                  rowSpan={4}
                  className="border-r text-center align-middle min-w-20"
                >
                  Grade Point
                </TableHead>
                <TableHead
                  rowSpan={4}
                  className="border-r text-center align-middle min-w-20"
                >
                  Letter Grade
                </TableHead>
                <TableHead
                  rowSpan={4}
                  className="border-r text-center align-middle min-w-20"
                >
                  SGPA
                </TableHead>
                <TableHead
                  rowSpan={4}
                  className="border-r text-center align-middle min-w-20"
                >
                  Rank
                </TableHead>
              </TableRow>

              <TableRow className="bg-muted/50 text-xs">
                <TableHead
                  rowSpan={3}
                  className="border-r text-center align-middle"
                >
                  Theory
                </TableHead>
                <TableHead
                  rowSpan={3}
                  className="border-r text-center align-middle"
                >
                  Skill Lab
                </TableHead>
                <TableHead
                  rowSpan={3}
                  className="border-r text-center align-middle"
                >
                  Clinical
                </TableHead>

                <TableHead
                  colSpan={3}
                  className="border-r text-center align-middle"
                >
                  Theory
                </TableHead>
                <TableHead
                  colSpan={3}
                  className="border-r text-center align-middle"
                >
                  Skill Lab
                </TableHead>
                <TableHead
                  colSpan={3}
                  className="border-r text-center align-middle"
                >
                  Clinical
                </TableHead>

                <TableHead
                  colSpan={6}
                  className="border-r text-center align-middle"
                >
                  Theory
                </TableHead>
                <TableHead
                  colSpan={6}
                  className="border-r text-center align-middle"
                >
                  Practical
                </TableHead>
              </TableRow>

              <TableRow className="bg-muted/50 text-xs">
                <TableHead rowSpan={2} className="border-r text-center">
                  Prescribed
                </TableHead>
                <TableHead rowSpan={2} className="border-r text-center">
                  Attended
                </TableHead>
                <TableHead rowSpan={2} className="border-r text-center">
                  %
                </TableHead>

                <TableHead rowSpan={2} className="border-r text-center">
                  Prescribed
                </TableHead>
                <TableHead rowSpan={2} className="border-r text-center">
                  Attended
                </TableHead>
                <TableHead rowSpan={2} className="border-r text-center">
                  %
                </TableHead>

                <TableHead rowSpan={2} className="border-r text-center">
                  Prescribed
                </TableHead>
                <TableHead rowSpan={2} className="border-r text-center">
                  Attended
                </TableHead>
                <TableHead rowSpan={2} className="border-r text-center">
                  %
                </TableHead>

                <TableHead colSpan={2} className="border-r text-center">
                  Internal
                </TableHead>
                <TableHead colSpan={2} className="border-r text-center">
                  End Sem
                </TableHead>
                <TableHead colSpan={2} className="border-r text-center">
                  Total
                </TableHead>

                <TableHead colSpan={2} className="border-r text-center">
                  Internal
                </TableHead>
                <TableHead colSpan={2} className="border-r text-center">
                  End Sem
                </TableHead>
                <TableHead colSpan={2} className="border-r text-center">
                  Total
                </TableHead>
              </TableRow>

              <TableRow className="bg-muted/50 text-xs">
                <TableHead className="border-r text-center">Max</TableHead>
                <TableHead className="border-r text-center">Obt</TableHead>
                <TableHead className="border-r text-center">Max</TableHead>
                <TableHead className="border-r text-center">Obt</TableHead>
                <TableHead className="border-r text-center">Max</TableHead>
                <TableHead className="border-r text-center">Obt</TableHead>
                <TableHead className="border-r text-center">Max</TableHead>
                <TableHead className="border-r text-center">Obt</TableHead>
                <TableHead className="border-r text-center">Max</TableHead>
                <TableHead className="border-r text-center">Obt</TableHead>
                <TableHead className="border-r text-center">Max</TableHead>
                <TableHead className="border-r text-center">Obt</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {fields.map((field, index) => {
                const isSemVIII = selectedSemester === "VIII";

                // Define merged row conditions (0-indexed, so 5th row is index 4)
                const isMergedRow =
                  (selectedSemester === "I" && index === 6) || // 7th row
                  (selectedSemester === "II" && index === 4) || // 5th row
                  (selectedSemester === "III" && index === 4) || // 5th row
                  (selectedSemester === "IV" && index === 5); // 6th row

                return (
                  <TableRow
                    key={field.id}
                    className="hover:bg-muted/30 text-xs"
                  >
                    {/* --- COLUMNS 1-4 (Always Visible) --- */}

                    {/* 1. S.No */}
                    <TableCell className="border-r text-center">
                      {field.sNo}
                    </TableCell>

                    {/* 2. Course Code */}
                    <TableCell className="border-r">
                      {field.courseCode}
                    </TableCell>

                    {/* 3. University Course Code */}
                    <TableCell className="border-r text-center">
                      <FormField
                        control={form.control}
                        name={`courses.${index}.universityCourseCode`}
                        render={({ field: formField }) => (
                          <FormItem>
                            <FormControl>
                              {isEditable(
                                selectedSemester,
                                "universityCourseCode",
                                index
                              ) ? (
                                // SHOW INPUT only when editable
                                <Input
                                  {...formField}
                                  className="h-8 w-16 text-xs"
                                />
                              ) : (
                                // OTHERWISE SHOW TEXT (no input)
                                <span className="text-xs">
                                  {field.universityCourseCode || ""}
                                </span>
                              )}
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </TableCell>

                    {/* 4. Course Title */}
                    <TableCell className="border-r">
                      {field.courseTitle}
                    </TableCell>

                    {/* --- MERGED LOGIC START (Columns 5 to End) --- */}
                    {isMergedRow ? (
                      // Render this single cell for the merged rows
                      // colSpan 28 covers the rest of the table
                      <TableCell
                        colSpan={28}
                        className="border-r text-center font-medium bg-muted/20"
                      >
                        {/* Displaying theoryPrescribed as requested */}
                        {field.theoryPrescribed}
                      </TableCell>
                    ) : (
                      // Render standard columns for all other rows
                      <>
                        {/* Credits */}
                        <TableCell className="border-r text-center">
                          {field.theoryCredits}
                        </TableCell>
                        <TableCell className="border-r text-center">
                          {field.skillLabCredits}
                        </TableCell>
                        <TableCell className="border-r text-center">
                          {field.clinicalCredits}
                        </TableCell>

                        {/* Instruction Hours - Theory */}
                        <TableCell className="border-r text-center">
                          {isSemVIII && field.theoryPrescribed === "0" ? (
                            <FormField
                              control={form.control}
                              name={`courses.${index}.theoryPrescribed`}
                              render={({ field: formField }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      {...formField}
                                      className="h-8 w-16 text-xs"
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          ) : (
                            field.theoryPrescribed
                          )}
                        </TableCell>

                        <TableCell className="border-r text-center">
                          <FormField
                            control={form.control}
                            name={`courses.${index}.theoryAttended`}
                            render={({ field: formField }) => (
                              <FormItem>
                                <FormControl>
                                  {isEditable(
                                    selectedSemester,
                                    "theoryAttended",
                                    index
                                  ) ? (
                                    // SHOW INPUT only when editable
                                    <Input
                                      {...formField}
                                      className="h-8 w-16 text-xs"
                                    />
                                  ) : (
                                    // OTHERWISE SHOW TEXT (no input)
                                    <span className="text-xs">
                                      {field.theoryAttended || ""}
                                    </span>
                                  )}
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </TableCell>

                        <TableCell className="border-r text-center">
                          <FormField
                            control={form.control}
                            name={`courses.${index}.theoryPercentage`}
                            render={({ field: formField }) => (
                              <FormItem>
                                <FormControl>
                                  {isEditable(
                                    selectedSemester,
                                    "theoryPercentage",
                                    index
                                  ) ? (
                                    // SHOW INPUT only when editable
                                    <Input
                                      {...formField}
                                      className="h-8 w-16 text-xs"
                                    />
                                  ) : (
                                    // OTHERWISE SHOW TEXT (no input)
                                    <span className="text-xs">
                                      {field.theoryPercentage || ""}
                                    </span>
                                  )}
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </TableCell>

                        {/* Instruction Hours - Skill Lab */}
                        <TableCell className="border-r text-center">
                          {field.skillLabPrescribed}
                        </TableCell>

                        <TableCell className="border-r text-center">
                          <FormField
                            control={form.control}
                            name={`courses.${index}.skillLabAttended`}
                            render={({ field: formField }) => (
                              <FormItem>
                                <FormControl>
                                  {isEditable(
                                    selectedSemester,
                                    "skillLabAttended",
                                    index
                                  ) ? (
                                    // SHOW INPUT only when editable
                                    <Input
                                      {...formField}
                                      className="h-8 w-16 text-xs"
                                    />
                                  ) : (
                                    // OTHERWISE SHOW TEXT (no input)
                                    <span className="text-xs">
                                      {field.skillLabAttended || ""}
                                    </span>
                                  )}
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </TableCell>

                        <TableCell className="border-r text-center">
                          <FormField
                            control={form.control}
                            name={`courses.${index}.skillLabPercentage`}
                            render={({ field: formField }) => (
                              <FormItem>
                                <FormControl>
                                  {isEditable(
                                    selectedSemester,
                                    "skillLabPercentage",
                                    index
                                  ) ? (
                                    // SHOW INPUT only when editable
                                    <Input
                                      {...formField}
                                      className="h-8 w-16 text-xs"
                                    />
                                  ) : (
                                    // OTHERWISE SHOW TEXT (no input)
                                    <span className="text-xs">
                                      {field.skillLabPercentage || ""}
                                    </span>
                                  )}
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </TableCell>

                        {/* Instruction Hours - Clinical */}
                        <TableCell className="border-r text-center">
                          {field.clinicalPrescribed}
                        </TableCell>

                        <TableCell className="border-r text-center">
                          <FormField
                            control={form.control}
                            name={`courses.${index}.clinicalAttended`}
                            render={({ field: formField }) => (
                              <FormItem>
                                <FormControl>
                                  {isEditable(
                                    selectedSemester,
                                    "clinicalAttended",
                                    index
                                  ) ? (
                                    // SHOW INPUT only when editable
                                    <Input
                                      {...formField}
                                      className="h-8 w-16 text-xs"
                                    />
                                  ) : (
                                    // OTHERWISE SHOW TEXT (no input)
                                    <span className="text-xs">
                                      {field.clinicalAttended || ""}
                                    </span>
                                  )}
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </TableCell>

                        <TableCell className="border-r text-center">
                          <FormField
                            control={form.control}
                            name={`courses.${index}.clinicalPercentage`}
                            render={({ field: formField }) => (
                              <FormItem>
                                <FormControl>
                                  {isEditable(
                                    selectedSemester,
                                    "clinicalPercentage",
                                    index
                                  ) ? (
                                    // SHOW INPUT only when editable
                                    <Input
                                      {...formField}
                                      className="h-8 w-16 text-xs"
                                    />
                                  ) : (
                                    // OTHERWISE SHOW TEXT (no input)
                                    <span className="text-xs">
                                      {field.clinicalPercentage || ""}
                                    </span>
                                  )}
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </TableCell>

                        {/* Marks - Theory */}
                        <TableCell className="border-r text-center">
                          {field.theoryInternalMax}
                        </TableCell>

                        <TableCell className="border-r text-center">
                          <FormField
                            control={form.control}
                            name={`courses.${index}.theoryInternalObtained`}
                            render={({ field: formField }) => (
                              <FormItem>
                                <FormControl>
                                  {isEditable(
                                    selectedSemester,
                                    "theoryInternalObtained",
                                    index
                                  ) ? (
                                    // SHOW INPUT only when editable
                                    <Input
                                      {...formField}
                                      className="h-8 w-16 text-xs"
                                    />
                                  ) : (
                                    // OTHERWISE SHOW TEXT (no input)
                                    <span className="text-xs">
                                      {field.theoryInternalObtained || ""}
                                    </span>
                                  )}
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </TableCell>

                        <TableCell className="border-r text-center">
                          {field.theoryEndSemMax}
                        </TableCell>

                        <TableCell className="border-r text-center">
                          <FormField
                            control={form.control}
                            name={`courses.${index}.theoryEndSemObtained`}
                            render={({ field: formField }) => (
                              <FormItem>
                                <FormControl>
                                  {isEditable(
                                    selectedSemester,
                                    "theoryEndSemObtained",
                                    index
                                  ) ? (
                                    // SHOW INPUT only when editable
                                    <Input
                                      {...formField}
                                      className="h-8 w-16 text-xs"
                                    />
                                  ) : (
                                    // OTHERWISE SHOW TEXT (no input)
                                    <span className="text-xs">
                                      {field.theoryEndSemObtained || ""}
                                    </span>
                                  )}
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </TableCell>

                        <TableCell className="border-r text-center">
                          {field.theoryTotalMax}
                        </TableCell>

                        <TableCell className="border-r text-center">
                          <FormField
                            control={form.control}
                            name={`courses.${index}.theoryTotalObtained`}
                            render={({ field: formField }) => (
                              <FormItem>
                                <FormControl>
                                  {isEditable(
                                    selectedSemester,
                                    "theoryTotalObtained",
                                    index
                                  ) ? (
                                    // SHOW INPUT only when editable
                                    <Input
                                      {...formField}
                                      className="h-8 w-16 text-xs"
                                    />
                                  ) : (
                                    // OTHERWISE SHOW TEXT (no input)
                                    <span className="text-xs">
                                      {field.theoryTotalObtained || ""}
                                    </span>
                                  )}
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </TableCell>

                        {/* Marks - Practical */}
                        <TableCell className="border-r text-center">
                          {field.practicalInternalMax}
                        </TableCell>

                        <TableCell className="border-r text-center">
                          <FormField
                            control={form.control}
                            name={`courses.${index}.practicalInternalObtained`}
                            render={({ field: formField }) => (
                              <FormItem>
                                <FormControl>
                                  {isEditable(
                                    selectedSemester,
                                    "practicalInternalObtained",
                                    index
                                  ) ? (
                                    // SHOW INPUT only when editable
                                    <Input
                                      {...formField}
                                      className="h-8 w-16 text-xs"
                                    />
                                  ) : (
                                    // OTHERWISE SHOW TEXT (no input)
                                    <span className="text-xs">
                                      {field.practicalInternalObtained || ""}
                                    </span>
                                  )}
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </TableCell>

                        <TableCell className="border-r text-center">
                          {field.practicalEndSemMax}
                        </TableCell>

                        <TableCell className="border-r text-center">
                          <FormField
                            control={form.control}
                            name={`courses.${index}.practicalEndSemObtained`}
                            render={({ field: formField }) => (
                              <FormItem>
                                <FormControl>
                                  {isEditable(
                                    selectedSemester,
                                    "practicalEndSemObtained",
                                    index
                                  ) ? (
                                    // SHOW INPUT only when editable
                                    <Input
                                      {...formField}
                                      className="h-8 w-16 text-xs"
                                    />
                                  ) : (
                                    // OTHERWISE SHOW TEXT (no input)
                                    <span className="text-xs">
                                      {field.practicalEndSemObtained || ""}
                                    </span>
                                  )}
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </TableCell>

                        <TableCell className="border-r text-center">
                          {field.practicalTotalMax}
                        </TableCell>

                        <TableCell className="border-r text-center">
                          <FormField
                            control={form.control}
                            name={`courses.${index}.practicalTotalObtained`}
                            render={({ field: formField }) => (
                              <FormItem>
                                <FormControl>
                                  {isEditable(
                                    selectedSemester,
                                    "practicalTotalObtained",
                                    index
                                  ) ? (
                                    // SHOW INPUT only when editable
                                    <Input
                                      {...formField}
                                      className="h-8 w-16 text-xs"
                                    />
                                  ) : (
                                    // OTHERWISE SHOW TEXT (no input)
                                    <span className="text-xs">
                                      {field.practicalTotalObtained || ""}
                                    </span>
                                  )}
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </TableCell>

                        {/* Grade Point / Letter Grade / SGPA / Rank */}
                        <TableCell className="border-r text-center">
                          <FormField
                            control={form.control}
                            name={`courses.${index}.gradePoint`}
                            render={({ field: formField }) => (
                              <FormItem>
                                <FormControl>
                                  {isEditable(
                                    selectedSemester,
                                    "gradePoint",
                                    index
                                  ) ? (
                                    // SHOW INPUT only when editable
                                    <Input
                                      {...formField}
                                      className="h-8 w-16 text-xs"
                                    />
                                  ) : (
                                    // OTHERWISE SHOW TEXT (no input)
                                    <span className="text-xs">
                                      {field.gradePoint || ""}
                                    </span>
                                  )}
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </TableCell>

                        <TableCell className="border-r text-center">
                          <FormField
                            control={form.control}
                            name={`courses.${index}.letterGrade`}
                            render={({ field: formField }) => (
                              <FormItem>
                                <FormControl>
                                  {isEditable(
                                    selectedSemester,
                                    "letterGrade",
                                    index
                                  ) ? (
                                    // SHOW INPUT only when editable
                                    <Input
                                      {...formField}
                                      className="h-8 w-16 text-xs"
                                    />
                                  ) : (
                                    // OTHERWISE SHOW TEXT (no input)
                                    <span className="text-xs">
                                      {field.letterGrade || ""}
                                    </span>
                                  )}
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </TableCell>

                        <TableCell className="border-r text-center">
                          <FormField
                            control={form.control}
                            name={`courses.${index}.sgpa`}
                            render={({ field: formField }) => (
                              <FormItem>
                                <FormControl>
                                  {isEditable(
                                    selectedSemester,
                                    "sgpa",
                                    index
                                  ) ? (
                                    // SHOW INPUT only when editable
                                    <Input
                                      {...formField}
                                      className="h-8 w-16 text-xs"
                                    />
                                  ) : (
                                    // OTHERWISE SHOW TEXT (no input)
                                    <span className="text-xs">
                                      {field.sgpa || ""}
                                    </span>
                                  )}
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </TableCell>

                        <TableCell className="border-r text-center">
                          <FormField
                            control={form.control}
                            name={`courses.${index}.rank`}
                            render={({ field: formField }) => (
                              <FormItem>
                                <FormControl>
                                  {isEditable(
                                    selectedSemester,
                                    "rank",
                                    index
                                  ) ? (
                                    // SHOW INPUT only when editable
                                    <Input
                                      {...formField}
                                      className="h-8 w-16 text-xs"
                                    />
                                  ) : (
                                    // OTHERWISE SHOW TEXT (no input)
                                    <span className="text-xs">
                                      {field.rank || ""}
                                    </span>
                                  )}
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        <div className="text-sm text-muted-foreground italic">
          Note: Fill in marks and attendance for the selected semester.
        </div>
      </form>
    </Form>
  );
};