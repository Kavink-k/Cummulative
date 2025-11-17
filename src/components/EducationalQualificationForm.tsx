import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import React from "react";
import { ChevronDown } from "lucide-react";

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
  onProgressChange?: (progress: number) => void;
}

export const EducationalQualificationForm = ({ onSubmit, defaultValues, onProgressChange }: EducationalQualificationFormProps) => {
  const [plusOneAttempts, setPlusOneAttempts] = useState(1);
  const [plusTwoAttempts, setPlusTwoAttempts] = useState(1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Transform defaultValues if they exist to match the expected structure
  const transformedDefaultValues = defaultValues ? {
    ...defaultValues,
    subjects: defaultValues.subjects?.map(subject => ({
      ...subject,
      subject: typeof subject.subject === 'string' ? subject.subject : (subject.subject as any).subject
    })) || defaultSubjects.map(subject => ({
      subject: subject.subject,
      plusOneAttempts: [{ maxMarks: "", score: "", percentage: "" }],
      plusTwoAttempts: [{ maxMarks: "", score: "", percentage: "" }],
    }))
  } : undefined;

  const form = useForm<EducationalQualificationFormData>({
    resolver: zodResolver(educationalQualificationSchema),
    defaultValues: transformedDefaultValues || {
      streamGroup: "",
      subjects: defaultSubjects.map(subject => ({
        subject: subject.subject,
        plusOneAttempts: [{ maxMarks: "", score: "", percentage: "" }],
        plusTwoAttempts: [{ maxMarks: "", score: "", percentage: "" }],
      })),
      totalPlusOneMaxMarks: "",
      totalPlusOneScore: "",
      totalPlusOnePercentage: "",
      totalPlusTwoMaxMarks: "",
      totalPlusTwoScore: "",
      totalPlusTwoPercentage: "",
      certificateNo: "",
      certificateDate: "",
      yearOfPassing: "",
      boardOfExamination: "",
      mediumOfInstruction: "",
      hscVerificationNo: "",
      hscVerificationDate: "",
    },
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: "subjects",
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update attempts when dropdown values change
  useEffect(() => {
    const currentSubjects = form.getValues().subjects;
    
    // Handle +1 attempts
    const updatedPlusOneSubjects = currentSubjects.map(subject => {
      const currentAttempts = subject.plusOneAttempts.length;
      if (currentAttempts < plusOneAttempts) {
        // Add new attempts
        const newAttempts = [...subject.plusOneAttempts];
        while (newAttempts.length < plusOneAttempts) {
          newAttempts.push({ maxMarks: "", score: "", percentage: "" });
        }
        return { ...subject, plusOneAttempts: newAttempts };
      } else if (currentAttempts > plusOneAttempts) {
        // Remove attempts
        return { ...subject, plusOneAttempts: subject.plusOneAttempts.slice(0, plusOneAttempts) };
      }
      return subject;
    });

    // Handle +2 attempts
    const finalSubjects = updatedPlusOneSubjects.map(subject => {
      const currentAttempts = subject.plusTwoAttempts.length;
      if (currentAttempts < plusTwoAttempts) {
        // Add new attempts
        const newAttempts = [...subject.plusTwoAttempts];
        while (newAttempts.length < plusTwoAttempts) {
          newAttempts.push({ maxMarks: "", score: "", percentage: "" });
        }
        return { ...subject, plusTwoAttempts: newAttempts };
      } else if (currentAttempts > plusTwoAttempts) {
        // Remove attempts
        return { ...subject, plusTwoAttempts: subject.plusTwoAttempts.slice(0, plusTwoAttempts) };
      }
      return subject;
    });

    form.setValue("subjects", finalSubjects);
  }, [plusOneAttempts, plusTwoAttempts, form]);

  const getPlusOneAttemptColumns = () => {
    const columns = [];
    for (let i = 0; i < plusOneAttempts; i++) {
      columns.push(
        <th key={`plus-one-${i}`} className="border p-2 text-center min-w-[240px]" colSpan={3}>
          +1 {plusOneAttempts > 1 ? `(Attempt ${i + 1})` : ''}
        </th>
      );
    }
    return columns;
  };

  const getPlusTwoAttemptColumns = () => {
    const columns = [];
    for (let i = 0; i < plusTwoAttempts; i++) {
      columns.push(
        <th key={`plus-two-${i}`} className="border p-2 text-center min-w-[240px]" colSpan={3}>
          +2 {plusTwoAttempts > 1 ? `(Attempt ${i + 1})` : ''}
        </th>
      );
    }
    return columns;
  };

  const getPlusOneSubColumns = () => {
    const subColumns = [];
    for (let i = 0; i < plusOneAttempts; i++) {
      subColumns.push(
        <React.Fragment key={`plus-one-sub-${i}`}>
          <th className="border p-2 text-xs min-w-[80px]">Max Marks</th>
          <th className="border p-2 text-xs min-w-[80px]">Score</th>
          <th className="border p-2 text-xs min-w-[80px]">%</th>
        </React.Fragment>
      );
    }
    return subColumns;
  };

  const getPlusTwoSubColumns = () => {
    const subColumns = [];
    for (let i = 0; i < plusTwoAttempts; i++) {
      subColumns.push(
        <React.Fragment key={`plus-two-sub-${i}`}>
          <th className="border p-2 text-xs min-w-[80px]">Max Marks</th>
          <th className="border p-2 text-xs min-w-[80px]">Score</th>
          <th className="border p-2 text-xs min-w-[80px]">%</th>
        </React.Fragment>
      );
    }
    return subColumns;
  };

  const getPlusOneFields = (subjectIndex: number) => {
    const fields = [];
    for (let i = 0; i < plusOneAttempts; i++) {
      fields.push(
        <React.Fragment key={`plus-one-${i}-${subjectIndex}`}>
          <td className="border p-2 min-w-[80px]">
            <FormField
              control={form.control}
              name={`subjects.${subjectIndex}.plusOneAttempts.${i}.maxMarks`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field} 
                      className="h-9 text-sm w-full min-w-[60px]" 
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </td>
          <td className="border p-2 min-w-[80px]">
            <FormField
              control={form.control}
              name={`subjects.${subjectIndex}.plusOneAttempts.${i}.score`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field} 
                      className="h-9 text-sm w-full min-w-[60px]" 
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </td>
          <td className="border p-2 min-w-[80px]">
            <FormField
              control={form.control}
              name={`subjects.${subjectIndex}.plusOneAttempts.${i}.percentage`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01" 
                      {...field} 
                      className="h-9 text-sm w-full min-w-[60px]" 
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </td>
        </React.Fragment>
      );
    }
    return fields;
  };

  const getPlusTwoFields = (subjectIndex: number) => {
    const fields = [];
    for (let i = 0; i < plusTwoAttempts; i++) {
      fields.push(
        <React.Fragment key={`plus-two-${i}-${subjectIndex}`}>
          <td className="border p-2 min-w-[80px]">
            <FormField
              control={form.control}
              name={`subjects.${subjectIndex}.plusTwoAttempts.${i}.maxMarks`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field} 
                      className="h-9 text-sm w-full min-w-[60px]" 
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </td>
          <td className="border p-2 min-w-[80px]">
            <FormField
              control={form.control}
              name={`subjects.${subjectIndex}.plusTwoAttempts.${i}.score`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field} 
                      className="h-9 text-sm w-full min-w-[60px]" 
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </td>
          <td className="border p-2 min-w-[80px]">
            <FormField
              control={form.control}
              name={`subjects.${subjectIndex}.plusTwoAttempts.${i}.percentage`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01" 
                      {...field} 
                      className="h-9 text-sm w-full min-w-[60px]" 
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </td>
        </React.Fragment>
      );
    }
    return fields;
  };

  // Calculate minimum table width based on attempts
  const minTableWidth = 200 + (plusOneAttempts * 240) + (plusTwoAttempts * 240);

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
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-lg">Subject-wise Marks</h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="relative" ref={dropdownRef}>
                  {/* Custom Dropdown Trigger */}
                  <Button
                    type="button"
                    variant="outline"
                    className="w-48 justify-between"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <span>Add Attempts</span>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>

                  {/* Custom Dropdown Content */}
                  {isDropdownOpen && (
                    <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                      <div className="p-3 space-y-4">
                        {/* Plus One Section */}
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

                        {/* Plus Two Section */}
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
              <table 
                className="w-full border-collapse text-sm" 
                style={{ minWidth: `${minTableWidth}px` }}
              >
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
                  {fields.map((field, index) => (
                    <tr key={field.id}>
                      <td className="border p-3 font-medium min-w-[200px] bg-gray-50 sticky left-0 z-10">
                        {field.subject}
                      </td>
                      {getPlusOneFields(index)}
                      {getPlusTwoFields(index)}
                    </tr>
                  ))}
                  
                  {/* Total Row */}
                  <tr className="bg-gray-50">
                    <td className="border p-3 font-medium min-w-[200px] bg-gray-100 sticky left-0 z-10">
                      Total
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