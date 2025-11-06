import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import { useState } from "react";
import React from "react";

const subjectSchema = z.object({
  subject: z.string(),
  attempt1MaxMarks: z.string(),
  attempt1Score: z.string(),
  attempt1Percentage: z.string(),
  attempt2MaxMarks: z.string().optional(),
  attempt2Score: z.string().optional(),
  attempt2Percentage: z.string().optional(),
  attempt3MaxMarks: z.string().optional(),
  attempt3Score: z.string().optional(),
  attempt3Percentage: z.string().optional(),
});

const educationalQualificationSchema = z.object({
  streamGroup: z.string().min(1, "Stream/Group is required"),
  subjects: z.array(subjectSchema),
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
  "Language",
  "English",
  "Physics",
  "Chemistry",
  "Biology/Botany",
  "Zoology",
  "Mathematics",
  "Others",
];

interface EducationalQualificationFormProps {
  onSubmit: (data: EducationalQualificationFormData) => void;
  defaultValues?: Partial<EducationalQualificationFormData>;
}

export const EducationalQualificationForm = ({ onSubmit, defaultValues }: EducationalQualificationFormProps) => {
  const [attemptCount, setAttemptCount] = useState(1);

  const form = useForm<EducationalQualificationFormData>({
    resolver: zodResolver(educationalQualificationSchema),
    defaultValues: defaultValues || {
      subjects: defaultSubjects.map(subject => ({
        subject,
        attempt1MaxMarks: "",
        attempt1Score: "",
        attempt1Percentage: "",
      })),
    },
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: "subjects",
  });

  const addAttempt = () => {
    if (attemptCount < 3) {
      setAttemptCount(attemptCount + 1);
    }
  };

  const removeAttempt = () => {
    if (attemptCount > 1) {
      setAttemptCount(attemptCount - 1);
    }
  };

  const getAttemptColumns = () => {
    const attempts = [];
    for (let i = 1; i <= attemptCount; i++) {
      attempts.push(
        <th key={`attempt-${i}`} className="border p-2 text-center" colSpan={3}>
          Attempt {i}
        </th>
      );
    }
    return attempts;
  };

  const getAttemptSubColumns = () => {
    const subColumns = [];
    for (let i = 1; i <= attemptCount; i++) {
      subColumns.push(
        <React.Fragment key={`subcols-${i}`}>
          <th className="border p-2 text-xs">Max Marks</th>
          <th className="border p-2 text-xs">Score</th>
          <th className="border p-2 text-xs">%</th>
        </React.Fragment>
      );
    }
    return subColumns;
  };

  const getAttemptFields = (index: number) => {
    const fields = [];
    for (let i = 1; i <= attemptCount; i++) {
      fields.push(
        <React.Fragment key={`attempt-${i}-fields-${index}`}>
          <td className="border p-1">
            <FormField
              control={form.control}
              name={`subjects.${index}.attempt${i}MaxMarks`}
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
              name={`subjects.${index}.attempt${i}Score`}
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
              name={`subjects.${index}.attempt${i}Percentage`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} className="h-8 text-sm" />
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="streamGroup"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stream/Group</FormLabel>
              <FormControl>
                <Input placeholder="Science/Commerce/Arts" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="border rounded-lg p-4 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-lg">Subject-wise Marks</h3>
            <div className="flex gap-2">
              {attemptCount > 1 && (
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={removeAttempt}
                  className="flex items-center gap-1"
                >
                  <Minus className="h-4 w-4" />
                  Remove Attempt {attemptCount}
                </Button>
              )}
              {attemptCount < 3 && (
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={addAttempt}
                  className="flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" />
                  Add Attempt {attemptCount + 1}
                </Button>
              )}
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted">
                  <th className="border p-2 text-left">Subject</th>
                  {getAttemptColumns()}
                </tr>
                <tr className="bg-muted/50">
                  <th className="border p-2"></th>
                  {getAttemptSubColumns()}
                </tr>
              </thead>
              <tbody>
                {fields.map((field, index) => (
                  <tr key={field.id}>
                    <td className="border p-2 font-medium">{field.subject}</td>
                    {getAttemptFields(index)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="certificateNo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Certificate Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter certificate number" {...field} />
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
                <FormLabel>Year of Passing</FormLabel>
                <FormControl>
                  <Input placeholder="2024" {...field} />
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
                  <Input placeholder="Enter verification number" {...field} />
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