import React, { useEffect, useRef, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { apiService } from "@/lib/api";
import { toast } from "sonner";

// -----------------------------
// Schemas (updated totals -> arrays)
// -----------------------------
const attemptSchema = z.object({
  maxMarks: z.string(),
  score: z.string(),
  percentage: z.string(),
});

const subjectSchema = z.object({
  subject: z.string(),
  plusOneAttempts: z.array(attemptSchema),
  plusTwoAttempts: z.array(attemptSchema),
});

const educationalQualificationSchema = z.object({
  studentId: z.string().optional(),
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
  onProgressChange?: (progress: number) => void;
  onChange?: (data: EducationalQualificationFormData) => void;
}

// -----------------------------
// Helper utilities
// -----------------------------
const makeEmptyAttempt = () => ({ maxMarks: "", score: "", percentage: "" });
const ensureLength = (arr: any[] | undefined, len: number) => {
  const copy = Array.isArray(arr) ? [...arr] : [];
  while (copy.length < len) copy.push(makeEmptyAttempt());
  if (copy.length > len) return copy.slice(0, len);
  return copy;
};

export const EducationalQualificationForm = ({
  onSubmit,
  defaultValues,
  onProgressChange,
  onChange,
}: EducationalQualificationFormProps) => {
  // attempt counts (default 1)
  const [plusOneAttempts, setPlusOneAttempts] = useState<number>(1);
  const [plusTwoAttempts, setPlusTwoAttempts] = useState<number>(1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Transform backend subject shape if needed (safe guard)
  const transformedDefaultValues = defaultValues
    ? {
        ...defaultValues,
        subjects:
          defaultValues.subjects?.map((s: any) => ({
            ...s,
            subject: typeof s.subject === "string" ? s.subject : s.subject?.subject || "",
            plusOneAttempts: Array.isArray(s.plusOneAttempts) ? s.plusOneAttempts : [makeEmptyAttempt()],
            plusTwoAttempts: Array.isArray(s.plusTwoAttempts) ? s.plusTwoAttempts : [makeEmptyAttempt()],
          })) ||
          defaultSubjects.map((sub) => ({
            subject: sub.subject,
            plusOneAttempts: [makeEmptyAttempt()],
            plusTwoAttempts: [makeEmptyAttempt()],
          })),
        totalPlusOneAttempts: Array.isArray((defaultValues as any).totalPlusOneAttempts)
          ? (defaultValues as any).totalPlusOneAttempts
          : [makeEmptyAttempt()],
        totalPlusTwoAttempts: Array.isArray((defaultValues as any).totalPlusTwoAttempts)
          ? (defaultValues as any).totalPlusTwoAttempts
          : [makeEmptyAttempt()],
      }
    : undefined;

  // initialize form with totals arrays
  const form = useForm<EducationalQualificationFormData>({
    resolver: zodResolver(educationalQualificationSchema),
    defaultValues:
      transformedDefaultValues || {
        streamGroup: "",
        subjects: defaultSubjects.map((sub) => ({
          subject: sub.subject,
          plusOneAttempts: [makeEmptyAttempt()],
          plusTwoAttempts: [makeEmptyAttempt()],
        })),
        totalPlusOneAttempts: [makeEmptyAttempt()],
        totalPlusTwoAttempts: [makeEmptyAttempt()],
        certificateNo: "",
        certificateDate: "",
        yearOfPassing: "",
        boardOfExamination: "",
        mediumOfInstruction: "",
        hscVerificationNo: "",
        hscVerificationDate: "",
      },
  });

  const { fields } = useFieldArray({ control: form.control, name: "subjects" });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // If editing, initialize attempt counters from defaultValues (so edit shows correct columns)
  useEffect(() => {
    if (!defaultValues) return;
    const subjects = (defaultValues as any).subjects || [];
    const plusOne = Math.max(...subjects.map((s: any) => (s.plusOneAttempts || []).length), 1);
    const plusTwo = Math.max(...subjects.map((s: any) => (s.plusTwoAttempts || []).length), 1);
    setPlusOneAttempts(plusOne);
    setPlusTwoAttempts(plusTwo);

    // ensure totals arrays exist and have correct length
    const totalsOne = (defaultValues as any).totalPlusOneAttempts || [];
    const totalsTwo = (defaultValues as any).totalPlusTwoAttempts || [];

    const ensuredTotalsOne = ensureLength(totalsOne, plusOne);
    const ensuredTotalsTwo = ensureLength(totalsTwo, plusTwo);

    form.reset({
      ...(transformedDefaultValues as any),
      totalPlusOneAttempts: ensuredTotalsOne,
      totalPlusTwoAttempts: ensuredTotalsTwo,
      subjects: (transformedDefaultValues as any).subjects.map((s: any) => ({
        ...s,
        plusOneAttempts: ensureLength(s.plusOneAttempts, plusOne),
        plusTwoAttempts: ensureLength(s.plusTwoAttempts, plusTwo),
      })),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues]);

  // When attempt counts change, resize subject attempts and totals immutably
  useEffect(() => {
    const current = form.getValues();
    const subjects = current.subjects || [];

    let needUpdate = false;
    const newSubjects = subjects.map((s) => {
      const newPlusOne = ensureLength(s.plusOneAttempts, plusOneAttempts);
      const newPlusTwo = ensureLength(s.plusTwoAttempts, plusTwoAttempts);
      if (
        (s.plusOneAttempts || []).length !== newPlusOne.length ||
        (s.plusTwoAttempts || []).length !== newPlusTwo.length
      ) {
        needUpdate = true;
        return { ...s, plusOneAttempts: newPlusOne, plusTwoAttempts: newPlusTwo };
      }
      return s;
    });

    const newTotalsOne = ensureLength(current.totalPlusOneAttempts, plusOneAttempts);
    const newTotalsTwo = ensureLength(current.totalPlusTwoAttempts, plusTwoAttempts);

    if (needUpdate) {
      form.setValue("subjects", newSubjects, { shouldValidate: false, shouldDirty: true });
    }
    if (newTotalsOne.length !== (current.totalPlusOneAttempts || []).length) {
      form.setValue("totalPlusOneAttempts", newTotalsOne, { shouldValidate: false, shouldDirty: true });
    }
    if (newTotalsTwo.length !== (current.totalPlusTwoAttempts || []).length) {
      form.setValue("totalPlusTwoAttempts", newTotalsTwo, { shouldValidate: false, shouldDirty: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plusOneAttempts, plusTwoAttempts]);

  // Auto-calc percentage when score or maxMarks change
  const watchedSubjects = form.watch("subjects");
  const watchedTotalsOne = form.watch("totalPlusOneAttempts");
  const watchedTotalsTwo = form.watch("totalPlusTwoAttempts");

  useEffect(() => {
    const calcPercent = (scoreStr: string, maxStr: string) => {
      const score = parseFloat(scoreStr || "0");
      const max = parseFloat(maxStr || "0");
      if (!max || isNaN(score) || isNaN(max)) return "";
      const p = (score / max) * 100;
      return Number.isFinite(p) ? p.toFixed(2) : "";
    };

    let subjects = form.getValues("subjects");
    let totals1 = form.getValues("totalPlusOneAttempts");
    let totals2 = form.getValues("totalPlusTwoAttempts");

    // ---------------------------
    // 1) AUTO CALC SUBJECT PERCENTAGES
    // ---------------------------
    subjects = subjects.map((sub) => {
      const plusOne = sub.plusOneAttempts.map((a) => ({
        ...a,
        percentage: calcPercent(a.score, a.maxMarks),
      }));

      const plusTwo = sub.plusTwoAttempts.map((a) => ({
        ...a,
        percentage: calcPercent(a.score, a.maxMarks),
      }));

      return { ...sub, plusOneAttempts: plusOne, plusTwoAttempts: plusTwo };
    });

    // ---------------------------
    // 2) AUTO CALC TOTALS (SUM)
    // totals for each attempt index
    // ---------------------------

    const sumAttempt = (attemptIndex: number, key: "plusOneAttempts" | "plusTwoAttempts") => {
      let sumMax = 0;
      let sumScore = 0;

      for (const sub of subjects) {
        const att = sub[key][attemptIndex];
        if (!att) continue;

        sumMax += Number(att.maxMarks || 0);
        sumScore += Number(att.score || 0);
      }

      return {
        maxMarks: String(sumMax),
        score: String(sumScore),
        percentage: calcPercent(String(sumScore), String(sumMax)),
      };
    };

    // +1 totals
    totals1 = totals1.map((_, i) => sumAttempt(i, "plusOneAttempts"));

    // +2 totals
    totals2 = totals2.map((_, i) => sumAttempt(i, "plusTwoAttempts"));

    // ---------------------------
    // 3) UPDATE FORM VALUES ONLY IF CHANGED
    // ---------------------------

    form.setValue("subjects", subjects, { shouldValidate: false, shouldDirty: true });
    form.setValue("totalPlusOneAttempts", totals1, { shouldValidate: false, shouldDirty: true });
    form.setValue("totalPlusTwoAttempts", totals2, { shouldValidate: false, shouldDirty: true });

    // Notify parent of changes
    if (onChange) {
      const currentValues = form.getValues();
      onChange(currentValues);
    }
  }, [
    watchedSubjects,
    watchedTotalsOne,
    watchedTotalsTwo,
    onChange,
  ]);


  // table helpers (columns)
  const getPlusOneAttemptColumns = () => {
    return Array.from({ length: plusOneAttempts }).map((_, i) => (
      <th key={`plus-one-${i}`} className="border p-2 text-center min-w-[240px]" colSpan={3}>
        +1 {plusOneAttempts > 1 ? `(Attempt ${i + 1})` : ""}
      </th>
    ));
  };

  const getPlusTwoAttemptColumns = () => {
    return Array.from({ length: plusTwoAttempts }).map((_, i) => (
      <th key={`plus-two-${i}`} className="border p-2 text-center min-w-[240px]" colSpan={3}>
        +2 {plusTwoAttempts > 1 ? `(Attempt ${i + 1})` : ""}
      </th>
    ));
  };

  const getPlusOneSubColumns = () => {
    return Array.from({ length: plusOneAttempts }).map((_, i) => (
      <React.Fragment key={`plus-one-sub-${i}`}>
        <th className="border p-2 text-xs min-w-[80px]">Max Marks</th>
        <th className="border p-2 text-xs min-w-[80px]">Score</th>
        <th className="border p-2 text-xs min-w-[80px]">%</th>
      </React.Fragment>
    ));
  };

  const getPlusTwoSubColumns = () => {
    return Array.from({ length: plusTwoAttempts }).map((_, i) => (
      <React.Fragment key={`plus-two-sub-${i}`}>
        <th className="border p-2 text-xs min-w-[80px]">Max Marks</th>
        <th className="border p-2 text-xs min-w-[80px]">Score</th>
        <th className="border p-2 text-xs min-w-[80px]">%</th>
      </React.Fragment>
    ));
  };

  const getPlusOneFields = (subjectIndex: number) => {
    return Array.from({ length: plusOneAttempts }).map((_, i) => (
      <React.Fragment key={`plus-one-${i}-${subjectIndex}`}>
        <td className="border p-2 min-w-[80px]">
          <FormField
            control={form.control}
            name={`subjects.${subjectIndex}.plusOneAttempts.${i}.maxMarks` as any}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="number" {...field} className="h-9 text-sm w-full min-w-[60px]" />
                </FormControl>
              </FormItem>
            )}
          />
        </td>
        <td className="border p-2 min-w-[80px]">
          <FormField
            control={form.control}
            name={`subjects.${subjectIndex}.plusOneAttempts.${i}.score` as any}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="number" {...field} className="h-9 text-sm w-full min-w-[60px]" />
                </FormControl>
              </FormItem>
            )}
          />
        </td>
        <td className="border p-2 min-w-[80px]">
          <FormField
            control={form.control}
            name={`subjects.${subjectIndex}.plusOneAttempts.${i}.percentage` as any}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="number" step="0.01" {...field} className="h-9 text-sm w-full min-w-[60px]" />
                </FormControl>
              </FormItem>
            )}
          />
        </td>
      </React.Fragment>
    ));
  };

  const getPlusTwoFields = (subjectIndex: number) => {
    return Array.from({ length: plusTwoAttempts }).map((_, i) => (
      <React.Fragment key={`plus-two-${i}-${subjectIndex}`}>
        <td className="border p-2 min-w-[80px]">
          <FormField
            control={form.control}
            name={`subjects.${subjectIndex}.plusTwoAttempts.${i}.maxMarks` as any}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="number" {...field} className="h-9 text-sm w-full min-w-[60px]" />
                </FormControl>
              </FormItem>
            )}
          />
        </td>
        <td className="border p-2 min-w-[80px]">
          <FormField
            control={form.control}
            name={`subjects.${subjectIndex}.plusTwoAttempts.${i}.score` as any}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="number" {...field} className="h-9 text-sm w-full min-w-[60px]" />
                </FormControl>
              </FormItem>
            )}
          />
        </td>
        <td className="border p-2 min-w-[80px]">
          <FormField
            control={form.control}
            name={`subjects.${subjectIndex}.plusTwoAttempts.${i}.percentage` as any}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="number" step="0.01" {...field} className="h-9 text-sm w-full min-w-[60px]" />
                </FormControl>
              </FormItem>
            )}
          />
        </td>
      </React.Fragment>
    ));
  };

  const minTableWidth = 200 + plusOneAttempts * 240 + plusTwoAttempts * 240;

  const handleSubmit = async (data: EducationalQualificationFormData) => {
    try {
      // convert any numeric fields if backend expects numbers (optional)
      await apiService.createEducationalQualification(data);
      toast.success("Educational qualification saved successfully!");
      onSubmit(data);
    } catch (error: any) {
      console.error("Error saving educational qualification:", error);
      toast.error(error?.response?.data?.message || "Failed to save educational qualification");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-lg">Subject-wise Marks</h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="relative" ref={dropdownRef}>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-48 justify-between"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <span>Add Attempts</span>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>

                  {isDropdownOpen && (
                    <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                      <div className="p-3 space-y-4">
                        <div className="space-y-2">
                          <div className="text-sm font-medium text-gray-700">+1</div>
                          <div className="flex gap-2">
                            {[1, 2, 3].map((attempt) => (
                              <Button
                                key={`plus-one-${attempt}`}
                                type="button"
                                variant={plusOneAttempts === attempt ? "default" : "outline"}
                                size="sm"
                                className="flex-1"
                                onClick={() => {
                                  setPlusOneAttempts(attempt);
                                  setIsDropdownOpen(false);
                                }}
                              >
                                {attempt}
                              </Button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="text-sm font-medium text-gray-700">+2</div>
                          <div className="flex gap-2">
                            {[1, 2, 3].map((attempt) => (
                              <Button
                                key={`plus-two-${attempt}`}
                                type="button"
                                variant={plusTwoAttempts === attempt ? "default" : "outline"}
                                size="sm"
                                className="flex-1"
                                onClick={() => {
                                  setPlusTwoAttempts(attempt);
                                  setIsDropdownOpen(false);
                                }}
                              >
                                {attempt}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto border rounded-lg">
            <div className="min-w-full inline-block align-middle">
              <table className="w-full border-collapse text-sm" style={{ minWidth: `${minTableWidth}px` }}>
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-3 text-left font-medium min-w-[200px]">SUBJECT</th>
                    {getPlusOneAttemptColumns()}
                    {getPlusTwoAttemptColumns()}
                  </tr>
                  <tr className="bg-gray-50">
                    <th className="border p-2 min-w-[200px]"></th>
                    {getPlusOneSubColumns()}
                    {getPlusTwoSubColumns()}
                  </tr>
                </thead>
                <tbody>
                  {fields.map((fieldItem, index) => (
                    <tr key={fieldItem.id}>
                      <td className="border p-3 font-medium min-w-[200px] bg-gray-50 sticky left-0 z-10">
                        {fieldItem.subject}
                      </td>

                      {getPlusOneFields(index)}
                      {getPlusTwoFields(index)}
                    </tr>
                  ))}

                  {/* Total Row */}
                  <tr className="bg-gray-50">
                    <td className="border p-3 font-medium min-w-[200px] bg-gray-100 sticky left-0 z-10">Total</td>

                    {/* +1 Totals */}
                    {(form.getValues().totalPlusOneAttempts || []).map((_, attemptIndex) => (
                      <React.Fragment key={`plus-one-total-${attemptIndex}`}>
                        <td className="border p-2 min-w-[80px]">
                          <FormField
                            control={form.control}
                            name={`totalPlusOneAttempts.${attemptIndex}.maxMarks` as any}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input type="number" {...field} className="h-9 text-sm font-medium w-full" />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </td>
                        <td className="border p-2 min-w-[80px]">
                          <FormField
                            control={form.control}
                            name={`totalPlusOneAttempts.${attemptIndex}.score` as any}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input type="number" {...field} className="h-9 text-sm font-medium w-full" />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </td>
                        <td className="border p-2 min-w-[80px]">
                          <FormField
                            control={form.control}
                            name={`totalPlusOneAttempts.${attemptIndex}.percentage` as any}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input type="number" step="0.01" {...field} className="h-9 text-sm font-medium w-full" />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </td>
                      </React.Fragment>
                    ))}

                    {/* +2 Totals */}
                    {(form.getValues().totalPlusTwoAttempts || []).map((_, attemptIndex) => (
                      <React.Fragment key={`plus-two-total-${attemptIndex}`}>
                        <td className="border p-2 min-w-[80px]">
                          <FormField
                            control={form.control}
                            name={`totalPlusTwoAttempts.${attemptIndex}.maxMarks` as any}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input type="number" {...field} className="h-9 text-sm font-medium w-full" />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </td>
                        <td className="border p-2 min-w-[80px]">
                          <FormField
                            control={form.control}
                            name={`totalPlusTwoAttempts.${attemptIndex}.score` as any}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input type="number" {...field} className="h-9 text-sm font-medium w-full" />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </td>
                        <td className="border p-2 min-w-[80px]">
                          <FormField
                            control={form.control}
                            name={`totalPlusTwoAttempts.${attemptIndex}.percentage` as any}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input type="number" step="0.01" {...field} className="h-9 text-sm font-medium w-full" />
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

        {/* If you want an explicit submit button in UI, you can add one here. */}
        {/* <div className="text-right"><Button type="submit">Save</Button></div> */}
      </form>
    </Form>
  );
};
