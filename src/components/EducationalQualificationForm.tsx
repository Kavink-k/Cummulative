

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Plus, X } from "lucide-react";
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

  console.log('=== Educational Qualification Form Debug ===');
  console.log('Subject fields count:', subjectFields.length);
  console.log('Subject fields:', subjectFields);
  console.log('Total Plus One Fields count:', totalPlusOneFields.length);
  console.log('Total Plus One Fields:', totalPlusOneFields);
  console.log('Total Plus Two Fields count:', totalPlusTwoFields.length);
  console.log('Total Plus Two Fields:', totalPlusTwoFields);
  console.log('Form values:', form.getValues());
  console.log('==========================================');

  useEffect(() => {
    const subscription = form.watch((values) => {
      const requiredFields = ["streamGroup", "certificateNo", "studentId"];
      const filledCount = requiredFields.filter(k => !!values[k as keyof typeof values]).length;
      onProgressChange?.((filledCount / requiredFields.length) * 100);
    });
    return () => subscription.unsubscribe();
  }, [form, onProgressChange]);

  // Handlers to add new attempts
  const handleAddPlusOneAttempt = () => {
    // Add empty attempt to all subjects for HSC+1
    subjectFields.forEach((_, index) => {
      const currentAttempts = form.getValues(`subjects.${index}.plusOneAttempts`);
      form.setValue(`subjects.${index}.plusOneAttempts`, [...currentAttempts, createEmptyAttempt()]);
    });
    // Add to totals
    const currentTotalAttempts = form.getValues('totalPlusOneAttempts');
    form.setValue('totalPlusOneAttempts', [...currentTotalAttempts, createEmptyAttempt()]);
  };

  const handleAddPlusTwoAttempt = () => {
    // Add empty attempt to all subjects for HSC+2
    subjectFields.forEach((_, index) => {
      const currentAttempts = form.getValues(`subjects.${index}.plusTwoAttempts`);
      form.setValue(`subjects.${index}.plusTwoAttempts`, [...currentAttempts, createEmptyAttempt()]);
    });
    // Add to totals
    const currentTotalAttempts = form.getValues('totalPlusTwoAttempts');
    form.setValue('totalPlusTwoAttempts', [...currentTotalAttempts, createEmptyAttempt()]);
  };

  // Handlers to remove attempts
  const handleRemovePlusOneAttempt = (attemptIndex: number) => {
    const currentTotalAttempts = form.getValues('totalPlusOneAttempts');
    // Prevent removing the last attempt
    if (currentTotalAttempts.length <= 1) {
      return;
    }

    // Remove attempt from all subjects
    subjectFields.forEach((_, index) => {
      const currentAttempts = form.getValues(`subjects.${index}.plusOneAttempts`);
      const newAttempts = currentAttempts.filter((_, i) => i !== attemptIndex);
      form.setValue(`subjects.${index}.plusOneAttempts`, newAttempts);
    });
    // Remove from totals
    const newTotalAttempts = currentTotalAttempts.filter((_, i) => i !== attemptIndex);
    form.setValue('totalPlusOneAttempts', newTotalAttempts);
  };

  const handleRemovePlusTwoAttempt = (attemptIndex: number) => {
    const currentTotalAttempts = form.getValues('totalPlusTwoAttempts');
    // Prevent removing the last attempt
    if (currentTotalAttempts.length <= 1) {
      return;
    }

    // Remove attempt from all subjects
    subjectFields.forEach((_, index) => {
      const currentAttempts = form.getValues(`subjects.${index}.plusTwoAttempts`);
      const newAttempts = currentAttempts.filter((_, i) => i !== attemptIndex);
      form.setValue(`subjects.${index}.plusTwoAttempts`, newAttempts);
    });
    // Remove from totals
    const newTotalAttempts = currentTotalAttempts.filter((_, i) => i !== attemptIndex);
    form.setValue('totalPlusTwoAttempts', newTotalAttempts);
  };

  // Auto-calculate percentage and totals
  useEffect(() => {
    let isUpdating = false; // Flag to prevent infinite loop

    const subscription = form.watch((values) => {
      if (!values.subjects || isUpdating) return;

      isUpdating = true; // Set flag before making changes

      // Calculate percentage for each subject and attempt
      values.subjects.forEach((subject, subjectIndex) => {
        // HSC +1 attempts
        subject.plusOneAttempts?.forEach((attempt, attemptIndex) => {
          const maxMarks = Number(attempt.maxMarks) || 0;
          const score = Number(attempt.score) || 0;

          // Validate: score should not exceed max marks
          if (score > maxMarks && maxMarks > 0) {
            const currentScore = form.getValues(`subjects.${subjectIndex}.plusOneAttempts.${attemptIndex}.score`);
            if (Number(currentScore) !== maxMarks) {
              form.setValue(`subjects.${subjectIndex}.plusOneAttempts.${attemptIndex}.score`, maxMarks, { shouldValidate: false });
            }
            return;
          }

          // Calculate percentage
          if (maxMarks > 0) {
            const percentage = Number(((score / maxMarks) * 100).toFixed(2));
            const currentPercentage = form.getValues(`subjects.${subjectIndex}.plusOneAttempts.${attemptIndex}.percentage`);
            if (Number(currentPercentage) !== percentage) {
              form.setValue(`subjects.${subjectIndex}.plusOneAttempts.${attemptIndex}.percentage`, percentage, { shouldValidate: false });
            }
          }
        });

        // HSC +2 attempts
        subject.plusTwoAttempts?.forEach((attempt, attemptIndex) => {
          const maxMarks = Number(attempt.maxMarks) || 0;
          const score = Number(attempt.score) || 0;

          // Validate: score should not exceed max marks
          if (score > maxMarks && maxMarks > 0) {
            const currentScore = form.getValues(`subjects.${subjectIndex}.plusTwoAttempts.${attemptIndex}.score`);
            if (Number(currentScore) !== maxMarks) {
              form.setValue(`subjects.${subjectIndex}.plusTwoAttempts.${attemptIndex}.score`, maxMarks, { shouldValidate: false });
            }
            return;
          }

          // Calculate percentage
          if (maxMarks > 0) {
            const percentage = Number(((score / maxMarks) * 100).toFixed(2));
            const currentPercentage = form.getValues(`subjects.${subjectIndex}.plusTwoAttempts.${attemptIndex}.percentage`);
            if (Number(currentPercentage) !== percentage) {
              form.setValue(`subjects.${subjectIndex}.plusTwoAttempts.${attemptIndex}.percentage`, percentage, { shouldValidate: false });
            }
          }
        });
      });

      // Calculate totals for each attempt
      const plusOneAttemptCount = values.totalPlusOneAttempts?.length || 0;
      const plusTwoAttemptCount = values.totalPlusTwoAttempts?.length || 0;

      // Calculate HSC +1 totals
      for (let attemptIndex = 0; attemptIndex < plusOneAttemptCount; attemptIndex++) {
        let totalMax = 0;
        let totalScore = 0;

        values.subjects.forEach((subject) => {
          const attempt = subject.plusOneAttempts?.[attemptIndex];
          if (attempt) {
            totalMax += Number(attempt.maxMarks) || 0;
            totalScore += Number(attempt.score) || 0;
          }
        });

        form.setValue(`totalPlusOneAttempts.${attemptIndex}.maxMarks`, totalMax);
        form.setValue(`totalPlusOneAttempts.${attemptIndex}.score`, totalScore);

        if (totalMax > 0) {
          const totalPercentage = ((totalScore / totalMax) * 100).toFixed(2);
          form.setValue(`totalPlusOneAttempts.${attemptIndex}.percentage`, Number(totalPercentage));
        }
      }

      // Calculate HSC +2 totals
      for (let attemptIndex = 0; attemptIndex < plusTwoAttemptCount; attemptIndex++) {
        let totalMax = 0;
        let totalScore = 0;

        values.subjects.forEach((subject) => {
          const attempt = subject.plusTwoAttempts?.[attemptIndex];
          if (attempt) {
            totalMax += Number(attempt.maxMarks) || 0;
            totalScore += Number(attempt.score) || 0;
          }
        });

        form.setValue(`totalPlusTwoAttempts.${attemptIndex}.maxMarks`, totalMax);
        form.setValue(`totalPlusTwoAttempts.${attemptIndex}.score`, totalScore);

        if (totalMax > 0) {
          const totalPercentage = ((totalScore / totalMax) * 100).toFixed(2);
          form.setValue(`totalPlusTwoAttempts.${attemptIndex}.percentage`, Number(totalPercentage));
        }
      }

      isUpdating = false; // Reset flag after all updates
    });

    return () => subscription.unsubscribe();
  }, [form, subjectFields]);

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

        {/* Add Attempt Button */}
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="button" variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Attempt
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={handleAddPlusOneAttempt}>
                Add HSC +1 Attempt
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleAddPlusTwoAttempt}>
                Add HSC +2 Attempt
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
              <tr className="bg-muted/70 text-xs">
                <th className="border p-2"></th>
                {totalPlusOneFields.map((_, i) => (
                  <th key={`h1-header-${i}`} className="border p-2 relative" colSpan={3}>
                    <div className="flex items-center justify-center gap-2">
                      <span>Attempt {i + 1}</span>
                      {totalPlusOneFields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemovePlusOneAttempt(i)}
                          className="text-destructive hover:bg-destructive/10 rounded p-0.5 transition-colors"
                          title="Remove this attempt"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </th>
                ))}
                {totalPlusTwoFields.map((_, i) => (
                  <th key={`h2-header-${i}`} className="border p-2 relative" colSpan={3}>
                    <div className="flex items-center justify-center gap-2">
                      <span>Attempt {i + 1}</span>
                      {totalPlusTwoFields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemovePlusTwoAttempt(i)}
                          className="text-destructive hover:bg-destructive/10 rounded p-0.5 transition-colors"
                          title="Remove this attempt"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </th>
                ))}
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
                      <td className="border p-1"><FormField control={form.control} name={`subjects.${index}.plusOneAttempts.${attemptIdx}.maxMarks`} render={({ field }) => <Input {...field} type="number" className="h-8 text-xs" placeholder="Max" />} /></td>
                      <td className="border p-1"><FormField control={form.control} name={`subjects.${index}.plusOneAttempts.${attemptIdx}.score`} render={({ field }) => <Input {...field} type="number" className="h-8 text-xs" placeholder="Score" />} /></td>
                      <td className="border p-1"><FormField control={form.control} name={`subjects.${index}.plusOneAttempts.${attemptIdx}.percentage`} render={({ field }) => <Input {...field} type="number" step="0.01" className="h-8 text-xs bg-muted" placeholder="%" readOnly />} /></td>
                    </React.Fragment>
                  ))}
                  {totalPlusTwoFields.map((_, attemptIdx) => (
                    <React.Fragment key={`s${index}-a2-${attemptIdx}`}>
                      <td className="border p-1"><FormField control={form.control} name={`subjects.${index}.plusTwoAttempts.${attemptIdx}.maxMarks`} render={({ field }) => <Input {...field} type="number" className="h-8 text-xs" placeholder="Max" />} /></td>
                      <td className="border p-1"><FormField control={form.control} name={`subjects.${index}.plusTwoAttempts.${attemptIdx}.score`} render={({ field }) => <Input {...field} type="number" className="h-8 text-xs" placeholder="Score" />} /></td>
                      <td className="border p-1"><FormField control={form.control} name={`subjects.${index}.plusTwoAttempts.${attemptIdx}.percentage`} render={({ field }) => <Input {...field} type="number" step="0.01" className="h-8 text-xs bg-muted" placeholder="%" readOnly />} /></td>
                    </React.Fragment>
                  ))}
                </tr>
              ))}
              <tr className="bg-muted/20 font-bold">
                <td className="border p-2 text-sm">TOTAL</td>
                {totalPlusOneFields.map((field, idx) => (
                  <React.Fragment key={`t1-${field.id}`}>
                    <td className="border p-1"><FormField control={form.control} name={`totalPlusOneAttempts.${idx}.maxMarks`} render={({ field }) => <Input {...field} type="number" className="h-8 text-xs font-bold bg-muted" readOnly />} /></td>
                    <td className="border p-1"><FormField control={form.control} name={`totalPlusOneAttempts.${idx}.score`} render={({ field }) => <Input {...field} type="number" className="h-8 text-xs font-bold bg-muted" readOnly />} /></td>
                    <td className="border p-1"><FormField control={form.control} name={`totalPlusOneAttempts.${idx}.percentage`} render={({ field }) => <Input {...field} type="number" className="h-8 text-xs font-bold bg-muted" readOnly />} /></td>
                  </React.Fragment>
                ))}
                {totalPlusTwoFields.map((field, idx) => (
                  <React.Fragment key={`t2-${field.id}`}>
                    <td className="border p-1"><FormField control={form.control} name={`totalPlusTwoAttempts.${idx}.maxMarks`} render={({ field }) => <Input {...field} type="number" className="h-8 text-xs font-bold bg-muted" readOnly />} /></td>
                    <td className="border p-1"><FormField control={form.control} name={`totalPlusTwoAttempts.${idx}.score`} render={({ field }) => <Input {...field} type="number" className="h-8 text-xs font-bold bg-muted" readOnly />} /></td>
                    <td className="border p-1"><FormField control={form.control} name={`totalPlusTwoAttempts.${idx}.percentage`} render={({ field }) => <Input {...field} type="number" className="h-8 text-xs font-bold bg-muted" readOnly />} /></td>
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
    </Form >
  );
};