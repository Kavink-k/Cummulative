
// import { useForm, useFieldArray } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { useEffect } from "react";

// const semesterAttendanceSchema = z.object({
//   semester: z.string(),
//   workingDays: z.number().optional(),
//   annualLeave: z.number().optional(),
//   sickLeave: z.number().optional(),
//   gazettedHolidays: z.number().optional(),
//   otherLeave: z.number().optional(),
//   compensationDaysHours: z.string().optional(),
// });

// const attendanceSchema = z.object({
//   studentId: z.string().optional(),
//   semesters: z.array(semesterAttendanceSchema),
// });

// type AttendanceFormData = z.infer<typeof attendanceSchema>;

// const semestersList = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];

// interface AttendanceFormProps {
//   onSubmit: (data: AttendanceFormData) => void;
//   defaultValues?: Partial<AttendanceFormData>;
//   onProgressChange?: (progress: number) => void;
// }

// export const AttendanceForm = ({ onSubmit, defaultValues, onProgressChange }: AttendanceFormProps) => {

//   // const defaultSemesterRows = semestersList.map(sem => ({
//   //   semester: sem,
//   //   workingDays: undefined as any,
//   //   annualLeave: undefined as any,
//   //   sickLeave: undefined as any,
//   //   gazettedHolidays: undefined as any,
//   //   otherLeave: undefined as any,
//   //   compensationDaysHours: "",
//   // }));

//   // Update this block in your component
// const defaultSemesterRows = semestersList.map(sem => ({
//   semester: sem,
//   workingDays: "" as any, // Change from undefined to ""
//   annualLeave: "" as any,
//   sickLeave: "" as any,
//   gazettedHolidays: "" as any,
//   otherLeave: "" as any,
//   compensationDaysHours: "",
// }));

//   const initialData: Partial<AttendanceFormData> = {
//     studentId: defaultValues?.studentId || "",
//     semesters: (defaultValues?.semesters?.length ?? 0) > 0
//       ? defaultValues!.semesters
//       : defaultSemesterRows,
//   };

//   // const form = useForm<AttendanceFormData>({
//   //   resolver: zodResolver(attendanceSchema),
//   //   defaultValues: initialData,
//   // });
// const form = useForm<AttendanceFormData>({
//   resolver: zodResolver(attendanceSchema),
//   defaultValues: initialData,
//   shouldFocusError: false, // Prevents jumping to the first field on submit
// });


//   const { fields } = useFieldArray({
//     control: form.control,
//     name: "semesters",
//   });

//   // Progress Tracking
//   useEffect(() => {
//     const subscription = form.watch((values) => {
//       let filledFields = 0;
//       const fieldsPerSemester = [
//         "workingDays", "annualLeave", "sickLeave",
//         "gazettedHolidays", "otherLeave", "compensationDaysHours"
//       ];

//       values.semesters?.forEach((semester: any) => {
//         if (semester) {
//           filledFields += fieldsPerSemester.filter(
//             (field) => semester[field] && semester[field].toString().trim() !== ""
//           ).length;
//         }
//       });

//       const totalRequiredFields = semestersList.length * fieldsPerSemester.length;
//       const progress = (filledFields / totalRequiredFields) * 100;
//       onProgressChange?.(progress);
//     });
//     return () => subscription.unsubscribe();
//   }, [form, onProgressChange]);

//   // Update form if defaultValues changes (e.g. studentId loads later)
//   useEffect(() => {
//     if (defaultValues?.studentId) {
//       const currentValues = form.getValues();
//       if (!currentValues.studentId) {
//         form.setValue("studentId", defaultValues.studentId);
//       }
//     }
//     // Only load semesters if the current form is empty to prevent focus-stealing re-renders
//   if (defaultValues?.semesters && form.getValues("semesters").length === 0) {
//      form.reset({
//        ...form.getValues(),
//        semesters: defaultValues.semesters
//      });
//   }
//   }, [defaultValues, form]);

//   return (
//     <Form {...form}>
//       <form id="active-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

//         {/* Hidden Student ID Field */}
//         <FormField
//           control={form.control}
//           name="studentId"
//           render={({ field }) => (
//             <input type="hidden" {...field} value={field.value || ""} />
//           )}
//         />

//         <div className="overflow-x-auto border rounded-lg">
//           <table className="w-full border-collapse min-w-[800px]">
//             <thead>
//               <tr className="bg-muted text-xs md:text-sm">
//                 <th className="border p-2 text-left font-semibold w-24">Semester</th>
//                 <th className="border p-2 text-left font-semibold">Working Days</th>
//                 <th className="border p-2 text-left font-semibold">Annual Leave</th>
//                 <th className="border p-2 text-left font-semibold">Sick Leave</th>
//                 <th className="border p-2 text-left font-semibold">Gazetted Holidays</th>
//                 <th className="border p-2 text-left font-semibold">Other Leave</th>
//                 <th className="border p-2 text-left font-semibold">Compensation</th>
//               </tr>
//             </thead>
//             <tbody>
//               {fields.map((field, index) => (
//                 <tr key={field.id} className="hover:bg-muted/50">
//                   <td className="border p-2 font-medium text-center bg-muted/20">
//                     {field.semester}
//                     {/* CRITICAL FIX: Hidden input ensures 'semester' is sent to API */}
//                     <input
//                       type="hidden"
//                       {...form.register(`semesters.${index}.semester`)}
//                       defaultValue={field.semester}
//                     />
//                   </td>

//                   <td className="border p-1">
//                     <FormField control={form.control} name={`semesters.${index}.workingDays`} render={({ field }) => (
//                       <FormItem><FormControl><Input type="number" {...field} className="h-8 text-xs" /></FormControl></FormItem>
//                     )} />
//                   </td>
//                   <td className="border p-1">
//                     <FormField control={form.control} name={`semesters.${index}.annualLeave`} render={({ field }) => (
//                       <FormItem><FormControl><Input type="number" {...field} className="h-8 text-xs" /></FormControl></FormItem>
//                     )} />
//                   </td>
//                   <td className="border p-1">
//                     <FormField control={form.control} name={`semesters.${index}.sickLeave`} render={({ field }) => (
//                       <FormItem><FormControl><Input type="number" {...field} className="h-8 text-xs" /></FormControl></FormItem>
//                     )} />
//                   </td>
//                   <td className="border p-1">
//                     <FormField control={form.control} name={`semesters.${index}.gazettedHolidays`} render={({ field }) => (
//                       <FormItem><FormControl><Input type="number" {...field} className="h-8 text-xs" /></FormControl></FormItem>
//                     )} />
//                   </td>
//                   <td className="border p-1">
//                     <FormField control={form.control} name={`semesters.${index}.otherLeave`} render={({ field }) => (
//                       <FormItem><FormControl><Input type="number" {...field} className="h-8 text-xs" /></FormControl></FormItem>
//                     )} />
//                   </td>
//                   <td className="border p-1">
//                     <FormField control={form.control} name={`semesters.${index}.compensationDaysHours`} render={({ field }) => (
//                       <FormItem><FormControl><Input {...field} className="h-8 text-xs" placeholder="Days/Hrs" /></FormControl></FormItem>
//                     )} />
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//         <p className="text-xs text-muted-foreground italic">
//           Note: Other Leave includes arrear study holidays, arrear examination leave, and important family functions.
//         </p>
//       </form>
//     </Form>
//   );
// };


import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";

// Helper to handle the string-to-number conversion for empty inputs
const emptyToOptionalNumber = z.preprocess(
  (val) => (val === "" || val === null || val === undefined ? undefined : Number(val)),
  z.number().optional()
);

const semesterAttendanceSchema = z.object({
  semester: z.string(),
  workingDays: emptyToOptionalNumber,
  annualLeave: emptyToOptionalNumber,
  sickLeave: emptyToOptionalNumber,
  gazettedHolidays: emptyToOptionalNumber,
  otherLeave: emptyToOptionalNumber,
  compensationDaysHours: z.string().optional(),
});

const attendanceSchema = z.object({
  studentId: z.string().optional(),
  semesters: z.array(semesterAttendanceSchema),
});

type AttendanceFormData = z.infer<typeof attendanceSchema>;

const semestersList = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];

interface AttendanceFormProps {
  onSubmit: (data: AttendanceFormData) => void;
  defaultValues?: Partial<AttendanceFormData>;
  onProgressChange?: (progress: number) => void;
}

export const AttendanceForm = ({ onSubmit, defaultValues, onProgressChange }: AttendanceFormProps) => {
  // 1. Initialize with empty strings to keep inputs controlled
  const defaultSemesterRows = semestersList.map(sem => ({
    semester: sem,
    workingDays: "" as any, 
    annualLeave: "" as any,
    sickLeave: "" as any,
    gazettedHolidays: "" as any,
    otherLeave: "" as any,
    compensationDaysHours: "",
  }));

  const initialData: AttendanceFormData = {
    studentId: defaultValues?.studentId || "",
    semesters: (defaultValues?.semesters?.length ?? 0) > 0
      ? (defaultValues!.semesters as any)
      : defaultSemesterRows,
  };

  const form = useForm<AttendanceFormData>({
    resolver: zodResolver(attendanceSchema),
    defaultValues: initialData,
    shouldFocusError: false, // Prevents jumping focus on error
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: "semesters",
  });

  // 2. Load data updates carefully
  useEffect(() => {
    if (defaultValues?.studentId && !form.getValues("studentId")) {
      form.setValue("studentId", defaultValues.studentId);
    }
    
    // Only reset if form is currently empty
    if (defaultValues?.semesters && form.getValues("semesters").length === 0) {
       form.reset({
         ...form.getValues(),
         semesters: defaultValues.semesters
       });
    }
  }, [defaultValues, form]);

  return (
    <Form {...form}>
      {/* 3. Added error logging to handleSubmit to catch silent validation failures */}
      <form 
        id="active-form" 
        onSubmit={form.handleSubmit(onSubmit, (errors) => console.log("Validation Errors:", errors))} 
        className="space-y-6"
      >
        <FormField
          control={form.control}
          name="studentId"
          render={({ field }) => (
            <input type="hidden" {...field} value={field.value || ""} />
          )}
        />

        <div className="overflow-x-auto border rounded-lg">
          <table className="w-full border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-muted text-xs md:text-sm">
                <th className="border p-2 text-left font-semibold w-24">Semester</th>
                <th className="border p-2 text-left font-semibold">Working Days</th>
                <th className="border p-2 text-left font-semibold">Annual Leave</th>
                <th className="border p-2 text-left font-semibold">Sick Leave</th>
                <th className="border p-2 text-left font-semibold">Gazetted Holidays</th>
                <th className="border p-2 text-left font-semibold">Other Leave</th>
                <th className="border p-2 text-left font-semibold">Compensation</th>
              </tr>
            </thead>
            <tbody>
              {fields.map((field, index) => (
                <tr key={field.id} className="hover:bg-muted/50">
                  <td className="border p-2 font-medium text-center bg-muted/20">
                    {field.semester}
                    <input
                      type="hidden"
                      {...form.register(`semesters.${index}.semester`)}
                    />
                  </td>

                  {/* 4. Use value={field.value ?? ""} to ensure control stability */}
                  <td className="border p-1">
                    <FormField control={form.control} name={`semesters.${index}.workingDays`} render={({ field }) => (
                      <FormItem><FormControl><Input type="number" {...field} value={field.value ?? ""} className="h-8 text-xs" /></FormControl></FormItem>
                    )} />
                  </td>
                  <td className="border p-1">
                    <FormField control={form.control} name={`semesters.${index}.annualLeave`} render={({ field }) => (
                      <FormItem><FormControl><Input type="number" {...field} value={field.value ?? ""} className="h-8 text-xs" /></FormControl></FormItem>
                    )} />
                  </td>
                  <td className="border p-1">
                    <FormField control={form.control} name={`semesters.${index}.sickLeave`} render={({ field }) => (
                      <FormItem><FormControl><Input type="number" {...field} value={field.value ?? ""} className="h-8 text-xs" /></FormControl></FormItem>
                    )} />
                  </td>
                  <td className="border p-1">
                    <FormField control={form.control} name={`semesters.${index}.gazettedHolidays`} render={({ field }) => (
                      <FormItem><FormControl><Input type="number" {...field} value={field.value ?? ""} className="h-8 text-xs" /></FormControl></FormItem>
                    )} />
                  </td>
                  <td className="border p-1">
                    <FormField control={form.control} name={`semesters.${index}.otherLeave`} render={({ field }) => (
                      <FormItem><FormControl><Input type="number" {...field} value={field.value ?? ""} className="h-8 text-xs" /></FormControl></FormItem>
                    )} />
                  </td>
                  <td className="border p-1">
                    <FormField control={form.control} name={`semesters.${index}.compensationDaysHours`} render={({ field }) => (
                      <FormItem><FormControl><Input {...field} value={field.value ?? ""} className="h-8 text-xs" placeholder="Days/Hrs" /></FormControl></FormItem>
                    )} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </form>
    </Form>
  );
};