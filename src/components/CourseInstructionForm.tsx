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

// // ✅ separated data – adjust path if needed
// import { semesterData } from "./data/semesterData";

// /**
//  * Notes:
//  * - semesterData rows come from the spreadsheet and have column keys like:
//  *   's_no', 'course_code', 'course_title', 'theory', 'skill_lab', ...
//  *   This file normalizes those rows into the shape expected by the form:
//  *   { sNo, courseCode, universityCourseCode, courseTitle, theoryCredits, ... }
//  *
//  * - The normalizer is resilient: it searches row keys by substrings (e.g. 'course', 'theory', 'prescribed')
//  *   so small differences in the spreadsheet headers won't break the form.
//  */

// // Define the shape of a single course
// const courseSchema = z.object({
//   sNo: z.number(),
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
//  * It looks for substrings in the column keys to pick the right value.
//  */
// function normalizeRow(raw: Record<string, any>) {
//   // Lowercase keys map
//   const keys = Object.keys(raw || {}).reduce<Record<string, string>>((acc, k) => {
//     acc[k.toLowerCase()] = String(raw[k] ?? "").trim();
//     return acc;
//   }, {});

//   const find = (candidates: string[]) => {
//     for (const k of Object.keys(keys)) {
//       for (const cand of candidates) {
//         if (k.includes(cand)) return keys[k];
//       }
//     }
//     return "";
//   };

//   const toNumberSafe = (v: string | number) => {
//     if (v === null || v === undefined || String(v).trim() === "") return 0;
//     const n = Number(String(v).replace(/[^0-9.\-]/g, ""));
//     return Number.isFinite(n) ? n : 0;
//   };

//   // Common source keys in the generated semesterData are like:
//   // s_no, course_code, university_course_code, course_title, theory, skill_lab, clinical, prescribed, attended, maximum, obtained, grade_point, letter_grade
//   const sNoCandidate = find(["s_no", "sno", "s.no", "s no"]);
//   const courseCode = find(["course_code", "course code", "coursecode", "code"]);
//   const universityCourseCode = find(["university_course_code", "university course", "university"]);
//   const courseTitle = find(["course_title", "course title", "title"]);
//   const theoryCredits = find(["theory credits", "theory_credit", "theory", "credits", "theory_"]);
//   const skillLabCredits = find(["skill_lab", "skill lab", "skill", "lab"]);
//   const clinicalCredits = find(["clinical", "clinical_credit"]);

//   // For instruction hours and marks, try to find columns containing substrings
//   const theoryPrescribed = find(["theory_prescribed", "theory_pres", "prescribed", "theory prescribed"]);
//   const theoryAttended = find(["theory_attended", "theory_att", "attended"]);
//   const theoryPercentage = find(["theory_percentage", "theory %", "percentage"]);

//   const skillLabPrescribed = find(["skill_prescribed", "skill lab_prescribed", "skill prescribed"]);
//   const skillLabAttended = find(["skill_attended", "skill lab_attended"]);

//   const skillLabPercentage = find(["skill_percentage", "skill %"]);

//   const clinicalPrescribed = find(["clinical_prescribed", "clinical prescribed"]);
//   const clinicalAttended = find(["clinical_attended", "clinical attended"]);
//   const clinicalPercentage = find(["clinical_percentage"]);

//   // Marks — try to identify columns using typical words
//   const theoryInternalMax = find(["internal maximum", "internal_max", "internal maximum", "theory internal maximum", "internal maximum"]);
//   const theoryInternalObtained = find(["internal obtained", "internal_obtained", "internal obtained"]);
//   const theoryEndSemMax = find(["end semester maximum", "end sem maximum", "end_sem_max", "end semester maximum"]);
//   const theoryEndSemObtained = find(["end semester obtained", "end_sem_obtained", "end semester obtained"]);
//   const theoryTotalMax = find(["total marks maximum", "total maximum", "total_maximum"]);
//   const theoryTotalObtained = find(["total obtained", "total_obtained", "total obtained"]);

//   const practicalInternalMax = find(["practical internal maximum", "practical internal max", "practical_internal_max", "practical internal maximum"]);
//   const practicalInternalObtained = find(["practical internal obtained", "practical_internal_obtained"]);
//   const practicalEndSemMax = find(["practical end semester maximum", "practical end sem max", "practical_end_sem_max"]);
//   const practicalEndSemObtained = find(["practical end semester obtained", "practical_end_sem_obtained"]);
//   const practicalTotalMax = find(["practical total maximum", "practical total max", "practical_total_max"]);
//   const practicalTotalObtained = find(["practical total obtained", "practical_total_obtained"]);

//   const gradePoint = find(["grade_point", "grade point", "gradepoint"]);
//   const letterGrade = find(["letter_grade", "letter grade"]);

//   // Build normalized object
//   const normalized = {
//     sNo: Number(sNoCandidate) || toNumberSafe(sNoCandidate),
//     courseCode: courseCode || "",
//     universityCourseCode: universityCourseCode || "",
//     courseTitle: courseTitle || "",
//     theoryCredits: theoryCredits || "",
//     skillLabCredits: skillLabCredits || "",
//     clinicalCredits: clinicalCredits || "",
//     theoryPrescribed: theoryPrescribed || "",
//     theoryAttended: theoryAttended || "",
//     theoryPercentage: theoryPercentage || "",
//     skillLabPrescribed: skillLabPrescribed || "",
//     skillLabAttended: skillLabAttended || "",
//     skillLabPercentage: skillLabPercentage || "",
//     clinicalPrescribed: clinicalPrescribed || "",
//     clinicalAttended: clinicalAttended || "",
//     clinicalPercentage: clinicalPercentage || "",
//     theoryInternalMax: theoryInternalMax || "",
//     theoryInternalObtained: theoryInternalObtained || "",
//     theoryEndSemMax: theoryEndSemMax || "",
//     theoryEndSemObtained: theoryEndSemObtained || "",
//     theoryTotalMax: theoryTotalMax || "",
//     theoryTotalObtained: theoryTotalObtained || "",
//     practicalInternalMax: practicalInternalMax || "",
//     practicalInternalObtained: practicalInternalObtained || "",
//     practicalEndSemMax: practicalEndSemMax || "",
//     practicalEndSemObtained: practicalEndSemObtained || "",
//     practicalTotalMax: practicalTotalMax || "",
//     practicalTotalObtained: practicalTotalObtained || "",
//     gradePoint: gradePoint || "",
//     letterGrade: letterGrade || "",
//   };

//   // If sNo is not a valid number (0), try to parse from first available numeric-like key
//   if (!normalized.sNo || Number.isNaN(normalized.sNo)) {
//     const alt = find(["s_no", "sno", "s.no", "slno", "sl_no"]);
//     normalized.sNo = Number(alt) || 0;
//   }

//   return normalized;
// }

// export const CourseInstructionForm = ({
//   onSubmit,
//   defaultValues,
//   onProgressChange,
// }: CourseInstructionFormProps) => {
//   const [selectedSemester, setSelectedSemester] = useState<string>(
//     defaultValues?.semester || "I"
//   );

//   // Create mapped default courses from semesterData for initial semester
//   const initialCourses =
//     (semesterData[selectedSemester] || []).map((r: any) => normalizeRow(r)) ||
//     [];

//   const form = useForm<CourseInstructionFormData>({
//     resolver: zodResolver(courseInstructionSchema),
//     defaultValues: defaultValues || {
//       studentId: "",
//       semester: selectedSemester,
//       courses: initialCourses,
//     },
//   });

//   const { fields, replace } = useFieldArray({
//     control: form.control,
//     name: "courses",
//   });

//   // Progress Tracking
//   useEffect(() => {
//     const subscription = form.watch((values) => {
//       let filledFields = 0;
//       // Pick a few key fields to track progress
//       const fieldsPerCourse = ["theoryAttended", "theoryInternalObtained"];

//       values.courses?.forEach((course: any) => {
//         if (course) {
//           filledFields += fieldsPerCourse.filter(
//             (field) => course[field] && course[field].toString().trim() !== ""
//           ).length;
//         }
//       });

//       // Approximate total (2 fields * number of courses)
//       const totalRequiredFields =
//         (semesterData[selectedSemester]?.length || 1) * fieldsPerCourse.length;
//       const progress =
//         totalRequiredFields > 0
//           ? (filledFields / totalRequiredFields) * 100
//           : 0;
//       onProgressChange?.(progress);
//     });
//     return () => subscription.unsubscribe();
//   }, [form, onProgressChange, selectedSemester]);

//   // Handle Semester Change
//   const handleSemesterChange = (semester: string) => {
//     setSelectedSemester(semester);
//     form.setValue("semester", semester);
//     // Load data for new semester — normalize each row
//     const newRows = (semesterData[semester] || []).map((r: any) =>
//       normalizeRow(r)
//     );
//     replace(newRows);
//   };

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
//         onSubmit={form.handleSubmit(onSubmit)}
//         className="space-y-6"
//       >
//         {/* Hidden Student ID */}
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
//               {/* ROW 1 */}
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

//                 {/* Credits */}
//                 <TableHead
//                   colSpan={3}
//                   className="border-r text-center align-middle"
//                 >
//                   Credits
//                 </TableHead>

//                 {/* Course Instruction Hours */}
//                 <TableHead
//                   colSpan={9}
//                   className="border-r text-center align-middle"
//                 >
//                   Course Instruction Hours
//                 </TableHead>

//                 {/* Marks Obtained */}
//                 <TableHead
//                   colSpan={12}
//                   className="border-r text-center align-middle"
//                 >
//                   Marks Obtained
//                 </TableHead>

//                 {/* Grade / SGPA / Rank */}
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

//               {/* ROW 2 */}
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

//               {/* ROW 3 */}
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
//                   End Semester College / University examination
//                 </TableHead>
//                 <TableHead colSpan={2} className="border-r text-center">
//                   Total Marks
//                 </TableHead>

//                 <TableHead colSpan={2} className="border-r text-center">
//                   Internal
//                 </TableHead>
//                 <TableHead colSpan={2} className="border-r text-center">
//                   End Semester College / University examination
//                 </TableHead>
//                 <TableHead colSpan={2} className="border-r text-center">
//                   Total Marks
//                 </TableHead>
//               </TableRow>

//               {/* ROW 4 */}
//               <TableRow className="bg-muted/50 text-xs">
//                 <TableHead className="border-r text-center">Maximum</TableHead>
//                 <TableHead className="border-r text-center">Obtained</TableHead>

//                 <TableHead className="border-r text-center">Maximum</TableHead>
//                 <TableHead className="border-r text-center">Obtained</TableHead>

//                 <TableHead className="border-r text-center">Maximum</TableHead>
//                 <TableHead className="border-r text-center">Obtained</TableHead>

//                 <TableHead className="border-r text-center">Maximum</TableHead>
//                 <TableHead className="border-r text-center">Obtained</TableHead>

//                 <TableHead className="border-r text-center">Maximum</TableHead>
//                 <TableHead className="border-r text-center">Obtained</TableHead>

//                 <TableHead className="border-r text-center">Maximum</TableHead>
//                 <TableHead className="border-r text-center">Obtained</TableHead>
//               </TableRow>
//             </TableHeader>

//             <TableBody>
//               {fields.map((field, index) => {
//                 const isSemVIII = selectedSemester === "VIII";

//                 return (
//                   <TableRow
//                     key={field.id}
//                     className="hover:bg-muted/30 text-xs"
//                   >
//                     {/* S.No / Codes / Title */}
//                     <TableCell className="border-r text-center">
//                       {field.sNo}
//                     </TableCell>
//                     <TableCell className="border-r">
//                       {field.courseCode}
//                     </TableCell>
//                     <TableCell className="border-r">
//                       <FormField
//                         control={form.control}
//                         name={`courses.${index}.universityCourseCode`}
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormControl>
//                               <Input {...field} className="h-8 text-xs" />
//                             </FormControl>
//                           </FormItem>
//                         )}
//                       />
//                     </TableCell>
//                     <TableCell className="border-r">
//                       {field.courseTitle}
//                     </TableCell>

//                     {/* Credits */}
//                     <TableCell className="border-r text-center">
//                       {field.theoryCredits}
//                     </TableCell>
//                     <TableCell className="border-r text-center">
//                       {field.skillLabCredits}
//                     </TableCell>
//                     <TableCell className="border-r text-center">
//                       {field.clinicalCredits}
//                     </TableCell>

//                     {/* Course Instruction Hours – Theory */}
//                     <TableCell className="border-r text-center">
//                       {isSemVIII && field.theoryPrescribed === "0" ? (
//                         <FormField
//                           control={form.control}
//                           name={`courses.${index}.theoryPrescribed`}
//                           render={({ field }) => (
//                             <FormItem>
//                               <FormControl>
//                                 <Input
//                                   {...field}
//                                   className="h-8 w-16 text-xs"
//                                 />
//                               </FormControl>
//                             </FormItem>
//                           )}
//                         />
//                       ) : (
//                         field.theoryPrescribed
//                       )}
//                     </TableCell>
//                     <TableCell className="border-r">
//                       <FormField
//                         control={form.control}
//                         name={`courses.${index}.theoryAttended`}
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormControl>
//                               <Input {...field} className="h-8 w-16 text-xs" />
//                             </FormControl>
//                           </FormItem>
//                         )}
//                       />
//                     </TableCell>
//                     <TableCell className="border-r">
//                       <FormField
//                         control={form.control}
//                         name={`courses.${index}.theoryPercentage`}
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormControl>
//                               <Input {...field} className="h-8 w-16 text-xs" />
//                             </FormControl>
//                           </FormItem>
//                         )}
//                       />
//                     </TableCell>

//                     {/* Course Instruction Hours – Skill Lab */}
//                     <TableCell className="border-r text-center">
//                       {field.skillLabPrescribed}
//                     </TableCell>
//                     <TableCell className="border-r">
//                       <FormField
//                         control={form.control}
//                         name={`courses.${index}.skillLabAttended`}
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormControl>
//                               <Input {...field} className="h-8 w-16 text-xs" />
//                             </FormControl>
//                           </FormItem>
//                         )}
//                       />
//                     </TableCell>
//                     <TableCell className="border-r">
//                       <FormField
//                         control={form.control}
//                         name={`courses.${index}.skillLabPercentage`}
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormControl>
//                               <Input {...field} className="h-8 w-16 text-xs" />
//                             </FormControl>
//                           </FormItem>
//                         )}
//                       />
//                     </TableCell>

//                     {/* Course Instruction Hours – Clinical */}
//                     <TableCell className="border-r text-center">
//                       {field.clinicalPrescribed}
//                     </TableCell>
//                     <TableCell className="border-r">
//                       <FormField
//                         control={form.control}
//                         name={`courses.${index}.clinicalAttended`}
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormControl>
//                               <Input {...field} className="h-8 w-16 text-xs" />
//                             </FormControl>
//                           </FormItem>
//                         )}
//                       />
//                     </TableCell>
//                     <TableCell className="border-r">
//                       <FormField
//                         control={form.control}
//                         name={`courses.${index}.clinicalPercentage`}
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormControl>
//                               <Input {...field} className="h-8 w-16 text-xs" />
//                             </FormControl>
//                           </FormItem>
//                         )}
//                       />
//                     </TableCell>

//                     {/* Marks Obtained – Theory */}
//                     <TableCell className="border-r text-center">
//                       {field.theoryInternalMax}
//                     </TableCell>
//                     <TableCell className="border-r">
//                       <FormField
//                         control={form.control}
//                         name={`courses.${index}.theoryInternalObtained`}
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormControl>
//                               <Input {...field} className="h-8 w-16 text-xs" />
//                             </FormControl>
//                           </FormItem>
//                         )}
//                       />
//                     </TableCell>

//                     <TableCell className="border-r text-center">
//                       {isSemVIII && field.theoryEndSemMax === "0" ? (
//                         <FormField
//                           control={form.control}
//                           name={`courses.${index}.theoryEndSemMax`}
//                           render={({ field }) => (
//                             <FormItem>
//                               <FormControl>
//                                 <Input
//                                   {...field}
//                                   className="h-8 w-16 text-xs"
//                                 />
//                               </FormControl>
//                             </FormItem>
//                           )}
//                         />
//                       ) : (
//                         field.theoryEndSemMax
//                       )}
//                     </TableCell>
//                     <TableCell className="border-r">
//                       <FormField
//                         control={form.control}
//                         name={`courses.${index}.theoryEndSemObtained`}
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormControl>
//                               <Input {...field} className="h-8 w-16 text-xs" />
//                             </FormControl>
//                           </FormItem>
//                         )}
//                       />
//                     </TableCell>

//                     <TableCell className="border-r text-center">
//                       {isSemVIII && field.theoryTotalMax === "0" ? (
//                         <FormField
//                           control={form.control}
//                           name={`courses.${index}.theoryTotalMax`}
//                           render={({ field }) => (
//                             <FormItem>
//                               <FormControl>
//                                 <Input
//                                   {...field}
//                                   className="h-8 w-16 text-xs"
//                                 />
//                               </FormControl>
//                             </FormItem>
//                           )}
//                         />
//                       ) : (
//                         field.theoryTotalMax
//                       )}
//                     </TableCell>
//                     <TableCell className="border-r">
//                       <FormField
//                         control={form.control}
//                         name={`courses.${index}.theoryTotalObtained`}
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormControl>
//                               <Input {...field} className="h-8 w-16 text-xs" />
//                             </FormControl>
//                           </FormItem>
//                         )}
//                       />
//                     </TableCell>

//                     {/* Marks Obtained – Practical */}
//                     <TableCell className="border-r text-center">
//                       {isSemVIII && field.practicalInternalMax === "0" ? (
//                         <FormField
//                           control={form.control}
//                           name={`courses.${index}.practicalInternalMax`}
//                           render={({ field }) => (
//                             <FormItem>
//                               <FormControl>
//                                 <Input
//                                   {...field}
//                                   className="h-8 w-16 text-xs"
//                                 />
//                               </FormControl>
//                             </FormItem>
//                           )}
//                         />
//                       ) : (
//                         field.practicalInternalMax
//                       )}
//                     </TableCell>
//                     <TableCell className="border-r">
//                       <FormField
//                         control={form.control}
//                         name={`courses.${index}.practicalInternalObtained`}
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormControl>
//                               <Input {...field} className="h-8 w-16 text-xs" />
//                             </FormControl>
//                           </FormItem>
//                         )}
//                       />
//                     </TableCell>

//                     <TableCell className="border-r text-center">
//                       {isSemVIII && field.practicalEndSemMax === "0" ? (
//                         <FormField
//                           control={form.control}
//                           name={`courses.${index}.practicalEndSemMax`}
//                           render={({ field }) => (
//                             <FormItem>
//                               <FormControl>
//                                 <Input
//                                   {...field}
//                                   className="h-8 w-16 text-xs"
//                                 />
//                               </FormControl>
//                             </FormItem>
//                           )}
//                         />
//                       ) : (
//                         field.practicalEndSemMax
//                       )}
//                     </TableCell>
//                     <TableCell className="border-r">
//                       <FormField
//                         control={form.control}
//                         name={`courses.${index}.practicalEndSemObtained`}
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormControl>
//                               <Input {...field} className="h-8 w-16 text-xs" />
//                             </FormControl>
//                           </FormItem>
//                         )}
//                       />
//                     </TableCell>

//                     <TableCell className="border-r text-center">
//                       {isSemVIII && field.practicalTotalMax === "0" ? (
//                         <FormField
//                           control={form.control}
//                           name={`courses.${index}.practicalTotalMax`}
//                           render={({ field }) => (
//                             <FormItem>
//                               <FormControl>
//                                 <Input
//                                   {...field}
//                                   className="h-8 w-16 text-xs"
//                                 />
//                               </FormControl>
//                             </FormItem>
//                           )}
//                         />
//                       ) : (
//                         field.practicalTotalMax
//                       )}
//                     </TableCell>
//                     <TableCell className="border-r">
//                       <FormField
//                         control={form.control}
//                         name={`courses.${index}.practicalTotalObtained`}
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormControl>
//                               <Input {...field} className="h-8 w-16 text-xs" />
//                             </FormControl>
//                           </FormItem>
//                         )}
//                       />
//                     </TableCell>

//                     {/* Grade Point / Letter Grade / SGPA / Rank */}
//                     <TableCell className="border-r text-center">
//                       {field.gradePoint}
//                     </TableCell>
//                     <TableCell className="border-r text-center">
//                       {field.letterGrade}
//                     </TableCell>
//                     <TableCell className="border-r text-center" />
//                     <TableCell className="border-r text-center" />
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

// // Import your data file
// import { semesterData } from "./data/semesterData";

// // Define the shape of a single course
// const courseSchema = z.object({
//   sNo: z.number(),
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
//  * Updated to specifically handle the keys found in semesterData.ts
//  */
// function normalizeRow(raw: Record<string, any>) {
//   // Lowercase keys map for case-insensitive matching
//   const keys = Object.keys(raw || {}).reduce<Record<string, string>>((acc, k) => {
//     acc[k.toLowerCase()] = String(raw[k] ?? "").trim();
//     return acc;
//   }, {});

//   const find = (candidates: string[]) => {
//     for (const k of Object.keys(keys)) {
//       for (const cand of candidates) {
//         // exact match or substring match
//         if (k === cand || k.includes(cand)) return keys[k];
//       }
//     }
//     return "";
//   };

//   const toNumberSafe = (v: string | number) => {
//     if (v === null || v === undefined || String(v).trim() === "") return 0;
//     const n = Number(String(v).replace(/[^0-9.\-]/g, ""));
//     return Number.isFinite(n) ? n : 0;
//   };

//   // --- MAPPING LOGIC BASED ON YOUR semesterData.ts ---

//   // 1. Basic Info
//   const sNoCandidate = find(["s_no", "slno", "s.no"]);
//   const courseCode = find(["course_code", "code"]);
//   const universityCourseCode = find(["university_course_code"]);
//   const courseTitle = find(["course_title", "title"]);

//   // 2. Credits
//   // Data uses "credits_theory", "skill_lab", "clinical"
//   const theoryCredits = find(["credits_theory", "theory_credits", "theory_credit"]);
//   // Note: Your data often puts credits under just "skill_lab" and "clinical" 
//   // without the word 'credits', so we look for exact matches or keys starting with these.
//   const skillLabCredits = keys["skill_lab"] || find(["skill_lab_credits", "skill_lab"]);
//   const clinicalCredits = keys["clinical"] || find(["clinical_credits", "clinical"]);

//   // 3. Instruction Hours
//   // Data uses "course_instruction_hours_theory_prescribed", "attended"
//   const theoryPrescribed = find(["course_instruction_hours_theory_prescribed", "theory_prescribed"]);
//   const theoryAttended = keys["attended"] || find(["theory_attended"]); 
//   const theoryPercentage = find(["theory_percentage", "percentage"]);

//   const skillLabPrescribed = find(["skill_lab_prescribed"]);
//   const skillLabAttended = find(["skill_lab_attended", "skill_attended"]);
//   const skillLabPercentage = find(["skill_lab_percentage"]);

//   const clinicalPrescribed = find(["clinical_prescribed"]);
//   const clinicalAttended = find(["clinical_attended"]);
//   const clinicalPercentage = find(["clinical_percentage"]);

//   // 4. Marks - Theory
//   // Data uses "marks_obtained_theory_internal_maximum"
//   const theoryInternalMax = find(["marks_obtained_theory_internal_maximum", "theory_internal_max"]);
//   // Your data has a key just called "obtained" which usually sits next to internal max
//   const theoryInternalObtained = keys["obtained"] || find(["theory_internal_obtained", "internal_obtained"]);
  
//   const theoryEndSemMax = find(["end_semester_college_university_examination_maximum", "theory_end_sem_max"]);
//   const theoryEndSemObtained = find(["theory_end_sem_obtained"]);
  
//   const theoryTotalMax = find(["total_marks_maximum", "theory_total_max"]);
//   const theoryTotalObtained = find(["theory_total_obtained"]);

//   // 5. Marks - Practical
//   const practicalInternalMax = find(["practical_internal_maximum"]);
//   const practicalInternalObtained = find(["practical_internal_obtained"]);
//   const practicalEndSemMax = find(["practical_end_semester_maximum"]);
//   const practicalEndSemObtained = find(["practical_end_semester_obtained"]);
//   const practicalTotalMax = find(["practical_total_maximum"]);
//   const practicalTotalObtained = find(["practical_total_obtained"]);

//   // 6. Grading
//   const gradePoint = find(["grade_point"]);
//   const letterGrade = find(["letter_grade"]);

//   // Build normalized object
//   const normalized = {
//     sNo: Number(sNoCandidate) || toNumberSafe(sNoCandidate),
//     courseCode: courseCode || "",
//     universityCourseCode: universityCourseCode || "",
//     courseTitle: courseTitle || "",
    
//     theoryCredits: theoryCredits || "",
//     skillLabCredits: skillLabCredits || "",
//     clinicalCredits: clinicalCredits || "",
    
//     theoryPrescribed: theoryPrescribed || "",
//     theoryAttended: theoryAttended || "",
//     theoryPercentage: theoryPercentage || "",
    
//     skillLabPrescribed: skillLabPrescribed || "",
//     skillLabAttended: skillLabAttended || "",
//     skillLabPercentage: skillLabPercentage || "",
    
//     clinicalPrescribed: clinicalPrescribed || "",
//     clinicalAttended: clinicalAttended || "",
//     clinicalPercentage: clinicalPercentage || "",
    
//     theoryInternalMax: theoryInternalMax || "",
//     theoryInternalObtained: theoryInternalObtained || "",
//     theoryEndSemMax: theoryEndSemMax || "",
//     theoryEndSemObtained: theoryEndSemObtained || "",
//     theoryTotalMax: theoryTotalMax || "",
//     theoryTotalObtained: theoryTotalObtained || "",
    
//     practicalInternalMax: practicalInternalMax || "",
//     practicalInternalObtained: practicalInternalObtained || "",
//     practicalEndSemMax: practicalEndSemMax || "",
//     practicalEndSemObtained: practicalEndSemObtained || "",
//     practicalTotalMax: practicalTotalMax || "",
//     practicalTotalObtained: practicalTotalObtained || "",
    
//     gradePoint: gradePoint || "",
//     letterGrade: letterGrade || "",
//   };

//   // Fallback for S.No if 0
//   if (!normalized.sNo) {
//     normalized.sNo = 0;
//   }

//   return normalized;
// }

// export const CourseInstructionForm = ({
//   onSubmit,
//   defaultValues,
//   onProgressChange,
// }: CourseInstructionFormProps) => {
//   const [selectedSemester, setSelectedSemester] = useState<string>(
//     defaultValues?.semester || "I"
//   );

//   // Helper to load and normalize data
//   const getCoursesForSemester = (sem: string) => {
//     const rawData = semesterData[sem] || [];
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
    
//     const newCourses = getCoursesForSemester(semester);
//     replace(newCourses);
//   };

//   // Progress Tracking
//   useEffect(() => {
//     const subscription = form.watch((values) => {
//       let filledFields = 0;
//       const fieldsPerCourse = ["theoryAttended", "theoryInternalObtained"];

//       values.courses?.forEach((course: any) => {
//         if (course) {
//           filledFields += fieldsPerCourse.filter(
//             (field) => course[field] && course[field].toString().trim() !== ""
//           ).length;
//         }
//       });

//       const totalRequiredFields =
//         (fields.length || 1) * fieldsPerCourse.length;
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
//         onSubmit={form.handleSubmit(onSubmit)}
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
//               {/* Header Rows (unchanged from your original file) */}
//               <TableRow className="bg-muted/50 text-xs">
//                 <TableHead rowSpan={4} className="border-r text-center align-middle min-w-12">S.No</TableHead>
//                 <TableHead rowSpan={4} className="border-r text-center align-middle min-w-32">Course Code</TableHead>
//                 <TableHead rowSpan={4} className="border-r text-center align-middle min-w-32">University Course Code</TableHead>
//                 <TableHead rowSpan={4} className="border-r text-center align-middle min-w-48">Course Title</TableHead>
//                 <TableHead colSpan={3} className="border-r text-center align-middle">Credits</TableHead>
//                 <TableHead colSpan={9} className="border-r text-center align-middle">Course Instruction Hours</TableHead>
//                 <TableHead colSpan={12} className="border-r text-center align-middle">Marks Obtained</TableHead>
//                 <TableHead rowSpan={4} className="border-r text-center align-middle min-w-20">Grade Point</TableHead>
//                 <TableHead rowSpan={4} className="border-r text-center align-middle min-w-20">Letter Grade</TableHead>
//                 <TableHead rowSpan={4} className="border-r text-center align-middle min-w-20">SGPA</TableHead>
//                 <TableHead rowSpan={4} className="border-r text-center align-middle min-w-20">Rank</TableHead>
//               </TableRow>

//               <TableRow className="bg-muted/50 text-xs">
//                 <TableHead rowSpan={3} className="border-r text-center align-middle">Theory</TableHead>
//                 <TableHead rowSpan={3} className="border-r text-center align-middle">Skill Lab</TableHead>
//                 <TableHead rowSpan={3} className="border-r text-center align-middle">Clinical</TableHead>

//                 <TableHead colSpan={3} className="border-r text-center align-middle">Theory</TableHead>
//                 <TableHead colSpan={3} className="border-r text-center align-middle">Skill Lab</TableHead>
//                 <TableHead colSpan={3} className="border-r text-center align-middle">Clinical</TableHead>

//                 <TableHead colSpan={6} className="border-r text-center align-middle">Theory</TableHead>
//                 <TableHead colSpan={6} className="border-r text-center align-middle">Practical</TableHead>
//               </TableRow>

//               <TableRow className="bg-muted/50 text-xs">
//                 <TableHead rowSpan={2} className="border-r text-center">Prescribed</TableHead>
//                 <TableHead rowSpan={2} className="border-r text-center">Attended</TableHead>
//                 <TableHead rowSpan={2} className="border-r text-center">%</TableHead>

//                 <TableHead rowSpan={2} className="border-r text-center">Prescribed</TableHead>
//                 <TableHead rowSpan={2} className="border-r text-center">Attended</TableHead>
//                 <TableHead rowSpan={2} className="border-r text-center">%</TableHead>

//                 <TableHead rowSpan={2} className="border-r text-center">Prescribed</TableHead>
//                 <TableHead rowSpan={2} className="border-r text-center">Attended</TableHead>
//                 <TableHead rowSpan={2} className="border-r text-center">%</TableHead>

//                 <TableHead colSpan={2} className="border-r text-center">Internal</TableHead>
//                 <TableHead colSpan={2} className="border-r text-center">End Sem</TableHead>
//                 <TableHead colSpan={2} className="border-r text-center">Total</TableHead>

//                 <TableHead colSpan={2} className="border-r text-center">Internal</TableHead>
//                 <TableHead colSpan={2} className="border-r text-center">End Sem</TableHead>
//                 <TableHead colSpan={2} className="border-r text-center">Total</TableHead>
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

//                 return (
//                   <TableRow key={field.id} className="hover:bg-muted/30 text-xs">
//                     {/* S.No / Codes / Title */}
//                     <TableCell className="border-r text-center">{field.sNo}</TableCell>
//                     <TableCell className="border-r">{field.courseCode}</TableCell>
//                     <TableCell className="border-r">
//                       <FormField
//                         control={form.control}
//                         name={`courses.${index}.universityCourseCode`}
//                         render={({ field }) => (
//                           <FormItem><FormControl><Input {...field} className="h-8 text-xs" /></FormControl></FormItem>
//                         )}
//                       />
//                     </TableCell>
//                     <TableCell className="border-r">{field.courseTitle}</TableCell>

//                     {/* Credits */}
//                     <TableCell className="border-r text-center">{field.theoryCredits}</TableCell>
//                     <TableCell className="border-r text-center">{field.skillLabCredits}</TableCell>
//                     <TableCell className="border-r text-center">{field.clinicalCredits}</TableCell>

//                     {/* Instruction Hours - Theory */}
//                     <TableCell className="border-r text-center">
//                       {isSemVIII && field.theoryPrescribed === "0" ? (
//                         <FormField
//                           control={form.control}
//                           name={`courses.${index}.theoryPrescribed`}
//                           render={({ field }) => (
//                              <FormItem><FormControl><Input {...field} className="h-8 w-16 text-xs" /></FormControl></FormItem>
//                           )}
//                         />
//                       ) : (field.theoryPrescribed)}
//                     </TableCell>
//                     <TableCell className="border-r">
//                       <FormField
//                         control={form.control}
//                         name={`courses.${index}.theoryAttended`}
//                         render={({ field }) => (
//                           <FormItem><FormControl><Input {...field} className="h-8 w-16 text-xs" /></FormControl></FormItem>
//                         )}
//                       />
//                     </TableCell>
//                     <TableCell className="border-r">
//                       <FormField
//                         control={form.control}
//                         name={`courses.${index}.theoryPercentage`}
//                         render={({ field }) => (
//                           <FormItem><FormControl><Input {...field} className="h-8 w-16 text-xs" /></FormControl></FormItem>
//                         )}
//                       />
//                     </TableCell>

//                     {/* Instruction Hours - Skill Lab */}
//                     <TableCell className="border-r text-center">{field.skillLabPrescribed}</TableCell>
//                     <TableCell className="border-r">
//                       <FormField
//                         control={form.control}
//                         name={`courses.${index}.skillLabAttended`}
//                         render={({ field }) => (
//                           <FormItem><FormControl><Input {...field} className="h-8 w-16 text-xs" /></FormControl></FormItem>
//                         )}
//                       />
//                     </TableCell>
//                     <TableCell className="border-r">
//                       <FormField
//                         control={form.control}
//                         name={`courses.${index}.skillLabPercentage`}
//                         render={({ field }) => (
//                           <FormItem><FormControl><Input {...field} className="h-8 w-16 text-xs" /></FormControl></FormItem>
//                         )}
//                       />
//                     </TableCell>

//                     {/* Instruction Hours - Clinical */}
//                     <TableCell className="border-r text-center">{field.clinicalPrescribed}</TableCell>
//                     <TableCell className="border-r">
//                       <FormField
//                         control={form.control}
//                         name={`courses.${index}.clinicalAttended`}
//                         render={({ field }) => (
//                           <FormItem><FormControl><Input {...field} className="h-8 w-16 text-xs" /></FormControl></FormItem>
//                         )}
//                       />
//                     </TableCell>
//                     <TableCell className="border-r">
//                       <FormField
//                         control={form.control}
//                         name={`courses.${index}.clinicalPercentage`}
//                         render={({ field }) => (
//                           <FormItem><FormControl><Input {...field} className="h-8 w-16 text-xs" /></FormControl></FormItem>
//                         )}
//                       />
//                     </TableCell>

//                     {/* Marks - Theory */}
//                     <TableCell className="border-r text-center">{field.theoryInternalMax}</TableCell>
//                     <TableCell className="border-r">
//                       <FormField
//                         control={form.control}
//                         name={`courses.${index}.theoryInternalObtained`}
//                         render={({ field }) => (
//                           <FormItem><FormControl><Input {...field} className="h-8 w-16 text-xs" /></FormControl></FormItem>
//                         )}
//                       />
//                     </TableCell>
//                     <TableCell className="border-r text-center">{field.theoryEndSemMax}</TableCell>
//                     <TableCell className="border-r">
//                       <FormField
//                         control={form.control}
//                         name={`courses.${index}.theoryEndSemObtained`}
//                         render={({ field }) => (
//                           <FormItem><FormControl><Input {...field} className="h-8 w-16 text-xs" /></FormControl></FormItem>
//                         )}
//                       />
//                     </TableCell>
//                     <TableCell className="border-r text-center">{field.theoryTotalMax}</TableCell>
//                     <TableCell className="border-r">
//                       <FormField
//                         control={form.control}
//                         name={`courses.${index}.theoryTotalObtained`}
//                         render={({ field }) => (
//                           <FormItem><FormControl><Input {...field} className="h-8 w-16 text-xs" /></FormControl></FormItem>
//                         )}
//                       />
//                     </TableCell>

//                     {/* Marks - Practical */}
//                     <TableCell className="border-r text-center">{field.practicalInternalMax}</TableCell>
//                     <TableCell className="border-r">
//                       <FormField
//                         control={form.control}
//                         name={`courses.${index}.practicalInternalObtained`}
//                         render={({ field }) => (
//                           <FormItem><FormControl><Input {...field} className="h-8 w-16 text-xs" /></FormControl></FormItem>
//                         )}
//                       />
//                     </TableCell>
//                     <TableCell className="border-r text-center">{field.practicalEndSemMax}</TableCell>
//                     <TableCell className="border-r">
//                       <FormField
//                         control={form.control}
//                         name={`courses.${index}.practicalEndSemObtained`}
//                         render={({ field }) => (
//                           <FormItem><FormControl><Input {...field} className="h-8 w-16 text-xs" /></FormControl></FormItem>
//                         )}
//                       />
//                     </TableCell>
//                     <TableCell className="border-r text-center">{field.practicalTotalMax}</TableCell>
//                     <TableCell className="border-r">
//                       <FormField
//                         control={form.control}
//                         name={`courses.${index}.practicalTotalObtained`}
//                         render={({ field }) => (
//                           <FormItem><FormControl><Input {...field} className="h-8 w-16 text-xs" /></FormControl></FormItem>
//                         )}
//                       />
//                     </TableCell>

//                     {/* Grade / SGPA / Rank */}
//                     <TableCell className="border-r text-center">{field.gradePoint}</TableCell>
//                     <TableCell className="border-r text-center">{field.letterGrade}</TableCell>
//                     <TableCell className="border-r text-center" />
//                     <TableCell className="border-r text-center" />
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
  sNo: z.number(),
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
});

const courseInstructionSchema = z.object({
  studentId: z.string().optional(),
  semester: z.string(),
  courses: z.array(courseSchema),
});

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
    const foundKey = Object.keys(raw).find(k => k.toLowerCase() === lowerKey);
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
    sNo: getNumber("s_no"),
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
    theoryEndSemMax: getValue("end_semester_college_university_examination_maximum"),
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

  // Helper to load and normalize data
  const getCoursesForSemester = (sem: string) => {
    // Ensure we handle cases where sem might not exist in data
    const rawData = semesterData[sem as keyof typeof semesterData] || [];
    return rawData.map((r: any) => normalizeRow(r));
  };

  const form = useForm<CourseInstructionFormData>({
    resolver: zodResolver(courseInstructionSchema),
    defaultValues: defaultValues || {
      studentId: "",
      semester: selectedSemester,
      courses: getCoursesForSemester(selectedSemester),
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
    
    // Replace current fields with new semester data
    const newCourses = getCoursesForSemester(semester);
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

      const totalRequiredFields =
        (fields.length || 1) * fieldsPerCourse.length;
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
                <TableHead rowSpan={4} className="border-r text-center align-middle min-w-12">S.No</TableHead>
                <TableHead rowSpan={4} className="border-r text-center align-middle min-w-32">Course Code</TableHead>
                <TableHead rowSpan={4} className="border-r text-center align-middle min-w-32">University Course Code</TableHead>
                <TableHead rowSpan={4} className="border-r text-center align-middle min-w-48">Course Title</TableHead>
                <TableHead colSpan={3} className="border-r text-center align-middle">Credits</TableHead>
                <TableHead colSpan={9} className="border-r text-center align-middle">Course Instruction Hours</TableHead>
                <TableHead colSpan={12} className="border-r text-center align-middle">Marks Obtained</TableHead>
                <TableHead rowSpan={4} className="border-r text-center align-middle min-w-20">Grade Point</TableHead>
                <TableHead rowSpan={4} className="border-r text-center align-middle min-w-20">Letter Grade</TableHead>
                <TableHead rowSpan={4} className="border-r text-center align-middle min-w-20">SGPA</TableHead>
                <TableHead rowSpan={4} className="border-r text-center align-middle min-w-20">Rank</TableHead>
              </TableRow>

              <TableRow className="bg-muted/50 text-xs">
                <TableHead rowSpan={3} className="border-r text-center align-middle">Theory</TableHead>
                <TableHead rowSpan={3} className="border-r text-center align-middle">Skill Lab</TableHead>
                <TableHead rowSpan={3} className="border-r text-center align-middle">Clinical</TableHead>

                <TableHead colSpan={3} className="border-r text-center align-middle">Theory</TableHead>
                <TableHead colSpan={3} className="border-r text-center align-middle">Skill Lab</TableHead>
                <TableHead colSpan={3} className="border-r text-center align-middle">Clinical</TableHead>

                <TableHead colSpan={6} className="border-r text-center align-middle">Theory</TableHead>
                <TableHead colSpan={6} className="border-r text-center align-middle">Practical</TableHead>
              </TableRow>

              <TableRow className="bg-muted/50 text-xs">
                <TableHead rowSpan={2} className="border-r text-center">Prescribed</TableHead>
                <TableHead rowSpan={2} className="border-r text-center">Attended</TableHead>
                <TableHead rowSpan={2} className="border-r text-center">%</TableHead>

                <TableHead rowSpan={2} className="border-r text-center">Prescribed</TableHead>
                <TableHead rowSpan={2} className="border-r text-center">Attended</TableHead>
                <TableHead rowSpan={2} className="border-r text-center">%</TableHead>

                <TableHead rowSpan={2} className="border-r text-center">Prescribed</TableHead>
                <TableHead rowSpan={2} className="border-r text-center">Attended</TableHead>
                <TableHead rowSpan={2} className="border-r text-center">%</TableHead>

                <TableHead colSpan={2} className="border-r text-center">Internal</TableHead>
                <TableHead colSpan={2} className="border-r text-center">End Sem</TableHead>
                <TableHead colSpan={2} className="border-r text-center">Total</TableHead>

                <TableHead colSpan={2} className="border-r text-center">Internal</TableHead>
                <TableHead colSpan={2} className="border-r text-center">End Sem</TableHead>
                <TableHead colSpan={2} className="border-r text-center">Total</TableHead>
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

                return (
                  <TableRow key={field.id} className="hover:bg-muted/30 text-xs">
                    {/* S.No / Codes / Title */}
                    <TableCell className="border-r text-center">{field.sNo}</TableCell>
                    <TableCell className="border-r">{field.courseCode}</TableCell>
                    <TableCell className="border-r">
                      <FormField
                        control={form.control}
                        name={`courses.${index}.universityCourseCode`}
                        render={({ field }) => (
                          <FormItem><FormControl><Input {...field} className="h-8 text-xs" /></FormControl></FormItem>
                        )}
                      />
                    </TableCell>
                    <TableCell className="border-r">{field.courseTitle}</TableCell>

                    {/* Credits */}
                    <TableCell className="border-r text-center">{field.theoryCredits}</TableCell>
                    <TableCell className="border-r text-center">{field.skillLabCredits}</TableCell>
                    <TableCell className="border-r text-center">{field.clinicalCredits}</TableCell>

                    {/* Instruction Hours - Theory */}
                    <TableCell className="border-r text-center">
                      {isSemVIII && field.theoryPrescribed === "0" ? (
                        <FormField
                          control={form.control}
                          name={`courses.${index}.theoryPrescribed`}
                          render={({ field }) => (
                             <FormItem><FormControl><Input {...field} className="h-8 w-16 text-xs" /></FormControl></FormItem>
                          )}
                        />
                      ) : (field.theoryPrescribed)}
                    </TableCell>
                    <TableCell className="border-r">
                      <FormField
                        control={form.control}
                        name={`courses.${index}.theoryAttended`}
                        render={({ field }) => (
                          <FormItem><FormControl><Input {...field} className="h-8 w-16 text-xs" /></FormControl></FormItem>
                        )}
                      />
                    </TableCell>
                    <TableCell className="border-r">
                      <FormField
                        control={form.control}
                        name={`courses.${index}.theoryPercentage`}
                        render={({ field }) => (
                          <FormItem><FormControl><Input {...field} className="h-8 w-16 text-xs" /></FormControl></FormItem>
                        )}
                      />
                    </TableCell>

                    {/* Instruction Hours - Skill Lab */}
                    <TableCell className="border-r text-center">{field.skillLabPrescribed}</TableCell>
                    <TableCell className="border-r">
                      <FormField
                        control={form.control}
                        name={`courses.${index}.skillLabAttended`}
                        render={({ field }) => (
                          <FormItem><FormControl><Input {...field} className="h-8 w-16 text-xs" /></FormControl></FormItem>
                        )}
                      />
                    </TableCell>
                    <TableCell className="border-r">
                      <FormField
                        control={form.control}
                        name={`courses.${index}.skillLabPercentage`}
                        render={({ field }) => (
                          <FormItem><FormControl><Input {...field} className="h-8 w-16 text-xs" /></FormControl></FormItem>
                        )}
                      />
                    </TableCell>

                    {/* Instruction Hours - Clinical */}
                    <TableCell className="border-r text-center">{field.clinicalPrescribed}</TableCell>
                    <TableCell className="border-r">
                      <FormField
                        control={form.control}
                        name={`courses.${index}.clinicalAttended`}
                        render={({ field }) => (
                          <FormItem><FormControl><Input {...field} className="h-8 w-16 text-xs" /></FormControl></FormItem>
                        )}
                      />
                    </TableCell>
                    <TableCell className="border-r">
                      <FormField
                        control={form.control}
                        name={`courses.${index}.clinicalPercentage`}
                        render={({ field }) => (
                          <FormItem><FormControl><Input {...field} className="h-8 w-16 text-xs" /></FormControl></FormItem>
                        )}
                      />
                    </TableCell>

                    {/* Marks - Theory */}
                    <TableCell className="border-r text-center">{field.theoryInternalMax}</TableCell>
                    <TableCell className="border-r">
                      <FormField
                        control={form.control}
                        name={`courses.${index}.theoryInternalObtained`}
                        render={({ field }) => (
                          <FormItem><FormControl><Input {...field} className="h-8 w-16 text-xs" /></FormControl></FormItem>
                        )}
                      />
                    </TableCell>
                    <TableCell className="border-r text-center">{field.theoryEndSemMax}</TableCell>
                    <TableCell className="border-r">
                      <FormField
                        control={form.control}
                        name={`courses.${index}.theoryEndSemObtained`}
                        render={({ field }) => (
                          <FormItem><FormControl><Input {...field} className="h-8 w-16 text-xs" /></FormControl></FormItem>
                        )}
                      />
                    </TableCell>
                    <TableCell className="border-r text-center">{field.theoryTotalMax}</TableCell>
                    <TableCell className="border-r">
                      <FormField
                        control={form.control}
                        name={`courses.${index}.theoryTotalObtained`}
                        render={({ field }) => (
                          <FormItem><FormControl><Input {...field} className="h-8 w-16 text-xs" /></FormControl></FormItem>
                        )}
                      />
                    </TableCell>

                    {/* Marks - Practical */}
                    <TableCell className="border-r text-center">{field.practicalInternalMax}</TableCell>
                    <TableCell className="border-r">
                      <FormField
                        control={form.control}
                        name={`courses.${index}.practicalInternalObtained`}
                        render={({ field }) => (
                          <FormItem><FormControl><Input {...field} className="h-8 w-16 text-xs" /></FormControl></FormItem>
                        )}
                      />
                    </TableCell>
                    <TableCell className="border-r text-center">{field.practicalEndSemMax}</TableCell>
                    <TableCell className="border-r">
                      <FormField
                        control={form.control}
                        name={`courses.${index}.practicalEndSemObtained`}
                        render={({ field }) => (
                          <FormItem><FormControl><Input {...field} className="h-8 w-16 text-xs" /></FormControl></FormItem>
                        )}
                      />
                    </TableCell>
                    <TableCell className="border-r text-center">{field.practicalTotalMax}</TableCell>
                    <TableCell className="border-r">
                      <FormField
                        control={form.control}
                        name={`courses.${index}.practicalTotalObtained`}
                        render={({ field }) => (
                          <FormItem><FormControl><Input {...field} className="h-8 w-16 text-xs" /></FormControl></FormItem>
                        )}
                      />
                    </TableCell>

                    {/* Grade / SGPA / Rank */}
                    <TableCell className="border-r text-center">{field.gradePoint}</TableCell>
                    <TableCell className="border-r text-center">{field.letterGrade}</TableCell>
                    <TableCell className="border-r text-center" />
                    <TableCell className="border-r text-center" />
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