

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import React, { useEffect } from "react";

// --- Schemas ---
const numberOrNull = z.union([
  z.number(),
  z.string().transform((val) => (val === "" ? null : Number(val))),
  z.null()
]).optional();

const attemptSchema = z.object({
  maxMarks: numberOrNull,
  score: numberOrNull,
  percentage: numberOrNull,
});

const subjectSchema = z.object({
  subject: z.string(),
  plusOneAttempts: z.array(attemptSchema),
  plusTwoAttempts: z.array(attemptSchema),
});

const educationalQualificationSchema = z.object({
  studentId: z.string().min(1, "Student ID is missing. Please go back to Step 1."), // Added this
  streamGroup: z.string().min(1, "Stream/Group is required"),
  subjects: z.array(subjectSchema),
  totalPlusOneAttempts: z.array(attemptSchema),
  totalPlusTwoAttempts: z.array(attemptSchema),
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
  "Language", "English", "Physics", "Chemistry",
  "Biology / Botany", "Zoology", "Mathematics", "Others"
];

const createEmptyAttempt = () => ({ maxMarks: null, score: null, percentage: null });

interface EducationalQualificationFormProps {
  onSubmit: (data: EducationalQualificationFormData) => void;
  defaultValues?: Partial<EducationalQualificationFormData>;
  onProgressChange?: (progress: number) => void;
}

export const EducationalQualificationForm = ({
  onSubmit,
  defaultValues,
  onProgressChange,
}: EducationalQualificationFormProps) => {

  const form = useForm<EducationalQualificationFormData>({
    resolver: zodResolver(educationalQualificationSchema),
    defaultValues: {
      studentId: defaultValues?.studentId || "",
      streamGroup: defaultValues?.streamGroup || "",
      subjects: defaultValues?.subjects && defaultValues.subjects.length > 0
        ? defaultValues.subjects
        : defaultSubjects.map((subject) => ({
          subject,
          plusOneAttempts: [createEmptyAttempt()],
          plusTwoAttempts: [createEmptyAttempt()],
        })),
      totalPlusOneAttempts: defaultValues?.totalPlusOneAttempts || [createEmptyAttempt()],
      totalPlusTwoAttempts: defaultValues?.totalPlusTwoAttempts || [createEmptyAttempt()],
      certificateNo: defaultValues?.certificateNo || "",
      certificateDate: defaultValues?.certificateDate || "",
      yearOfPassing: defaultValues?.yearOfPassing || "",
      boardOfExamination: defaultValues?.boardOfExamination || "",
      mediumOfInstruction: defaultValues?.mediumOfInstruction || "",
      hscVerificationNo: defaultValues?.hscVerificationNo || "",
      hscVerificationDate: defaultValues?.hscVerificationDate || "",
    },
  });

  const { fields: subjectFields } = useFieldArray({ control: form.control, name: "subjects" });
  const { fields: totalPlusOneFields } = useFieldArray({ control: form.control, name: "totalPlusOneAttempts" });
  const { fields: totalPlusTwoFields } = useFieldArray({ control: form.control, name: "totalPlusTwoAttempts" });

  console.log('Subject fields count:', subjectFields.length);
  console.log('Subject fields:', subjectFields);

  useEffect(() => {
    const subscription = form.watch((values) => {
      const requiredFields = ["streamGroup", "certificateNo", "studentId"];
      const filledCount = requiredFields.filter(k => !!values[k as keyof typeof values]).length;
      onProgressChange?.((filledCount / requiredFields.length) * 100);
    });
    return () => subscription.unsubscribe();
  }, [form, onProgressChange]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

        {/* Hidden Student ID Field (Read Only) */}
        <div className="flex flex-wrap gap-4 justify-between items-end">
          <h2 className="text-xl font-bold">II. EDUCATIONAL QUALIFICATION</h2>

          <FormField
            control={form.control}
            name="studentId"
            render={({ field }) => (
              <FormItem className="w-32">
                <FormLabel>Student ID</FormLabel>
                <FormControl>
                  <Input {...field} readOnly className="bg-muted" placeholder="Auto-filled" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="streamGroup"
            render={({ field }) => (
              <FormItem className="w-full md:w-48">
                <FormLabel>STREAM / GROUP</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Science" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Marks Table */}
        <div className="border rounded-lg p-4 overflow-x-auto">
          <table className="w-full border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-muted text-sm">
                <th className="border p-2 text-left w-40">Subject</th>
                <th className="border p-2 text-center" colSpan={3 * totalPlusOneFields.length}>H.S.C (+1)</th>
                <th className="border p-2 text-center" colSpan={3 * totalPlusTwoFields.length}>H.S.C (+2)</th>
              </tr>
              <tr className="bg-muted/50 text-xs">
                <th className="border p-2"></th>
                {totalPlusOneFields.map((_, i) => (
                  <React.Fragment key={`h1-${i}`}><th className="border">Max</th><th className="border">Score</th><th className="border">%</th></React.Fragment>
                ))}
                {totalPlusTwoFields.map((_, i) => (
                  <React.Fragment key={`h2-${i}`}><th className="border">Max</th><th className="border">Score</th><th className="border">%</th></React.Fragment>
                ))}
              </tr>
            </thead>
            <tbody>
              {subjectFields.map((field, index) => (
                <tr key={field.id}>
                  <td className="border p-2 text-sm font-medium">{field.subject}</td>
                  {totalPlusOneFields.map((_, attemptIdx) => (
                    <React.Fragment key={`s${index}-a1-${attemptIdx}`}>
                      <td className="border p-1"><FormField control={form.control} name={`subjects.${index}.plusOneAttempts.${attemptIdx}.maxMarks`} render={({ field }) => <Input {...field} type="number" className="h-8 text-xs" />} /></td>
                      <td className="border p-1"><FormField control={form.control} name={`subjects.${index}.plusOneAttempts.${attemptIdx}.score`} render={({ field }) => <Input {...field} type="number" className="h-8 text-xs" />} /></td>
                      <td className="border p-1"><FormField control={form.control} name={`subjects.${index}.plusOneAttempts.${attemptIdx}.percentage`} render={({ field }) => <Input {...field} type="number" step="0.01" className="h-8 text-xs" />} /></td>
                    </React.Fragment>
                  ))}
                  {totalPlusTwoFields.map((_, attemptIdx) => (
                    <React.Fragment key={`s${index}-a2-${attemptIdx}`}>
                      <td className="border p-1"><FormField control={form.control} name={`subjects.${index}.plusTwoAttempts.${attemptIdx}.maxMarks`} render={({ field }) => <Input {...field} type="number" className="h-8 text-xs" />} /></td>
                      <td className="border p-1"><FormField control={form.control} name={`subjects.${index}.plusTwoAttempts.${attemptIdx}.score`} render={({ field }) => <Input {...field} type="number" className="h-8 text-xs" />} /></td>
                      <td className="border p-1"><FormField control={form.control} name={`subjects.${index}.plusTwoAttempts.${attemptIdx}.percentage`} render={({ field }) => <Input {...field} type="number" step="0.01" className="h-8 text-xs" />} /></td>
                    </React.Fragment>
                  ))}
                </tr>
              ))}
              <tr className="bg-muted/20 font-bold">
                <td className="border p-2 text-sm">TOTAL</td>
                {totalPlusOneFields.map((field, idx) => (
                  <React.Fragment key={`t1-${field.id}`}>
                    <td className="border p-1"><FormField control={form.control} name={`totalPlusOneAttempts.${idx}.maxMarks`} render={({ field }) => <Input {...field} type="number" className="h-8 text-xs font-bold" />} /></td>
                    <td className="border p-1"><FormField control={form.control} name={`totalPlusOneAttempts.${idx}.score`} render={({ field }) => <Input {...field} type="number" className="h-8 text-xs font-bold" />} /></td>
                    <td className="border p-1"><FormField control={form.control} name={`totalPlusOneAttempts.${idx}.percentage`} render={({ field }) => <Input {...field} type="number" className="h-8 text-xs font-bold" />} /></td>
                  </React.Fragment>
                ))}
                {totalPlusTwoFields.map((field, idx) => (
                  <React.Fragment key={`t2-${field.id}`}>
                    <td className="border p-1"><FormField control={form.control} name={`totalPlusTwoAttempts.${idx}.maxMarks`} render={({ field }) => <Input {...field} type="number" className="h-8 text-xs font-bold" />} /></td>
                    <td className="border p-1"><FormField control={form.control} name={`totalPlusTwoAttempts.${idx}.score`} render={({ field }) => <Input {...field} type="number" className="h-8 text-xs font-bold" />} /></td>
                    <td className="border p-1"><FormField control={form.control} name={`totalPlusTwoAttempts.${idx}.percentage`} render={({ field }) => <Input {...field} type="number" className="h-8 text-xs font-bold" />} /></td>
                  </React.Fragment>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField control={form.control} name="certificateNo" render={({ field }) => (<FormItem><FormLabel>Certificate No</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="certificateDate" render={({ field }) => (<FormItem><FormLabel>Certificate Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="yearOfPassing" render={({ field }) => (<FormItem><FormLabel>Year of Passing</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="boardOfExamination" render={({ field }) => (
            <FormItem><FormLabel>Board</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger></FormControl>
                <SelectContent>
                  <SelectItem value="state">State Board</SelectItem>
                  <SelectItem value="matric">Matriculation</SelectItem>
                  <SelectItem value="cbse">CBSE</SelectItem>
                  <SelectItem value="icse">ICSE</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="mediumOfInstruction" render={({ field }) => (<FormItem><FormLabel>Medium</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="hscVerificationNo" render={({ field }) => (<FormItem><FormLabel>HSC Verification No</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="hscVerificationDate" render={({ field }) => (<FormItem><FormLabel>HSC Verification Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>)} />
        </div>

        <div className="flex justify-end">
          <Button type="submit">Save Educational Details</Button>
        </div>
      </form>
    </Form>
  );
};