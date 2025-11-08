import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect } from "react";

const courseInstructionSchema = z.object({
  semester: z.string().min(1, "Semester is required"),
  courseCode: z.string().min(1, "Course code is required"),
  universityCourseCode: z.string(),
  courseTitle: z.string().min(1, "Course title is required"),
  theoryCredits: z.string(),
  skillLabCredits: z.string(),
  clinicalCredits: z.string(),
  theoryPrescribed: z.string(),
  theoryAttended: z.string(),
  theoryPercentage: z.string(),
  skillLabPrescribed: z.string(),
  skillLabAttended: z.string(),
  skillLabPercentage: z.string(),
  clinicalPrescribed: z.string(),
  clinicalAttended: z.string(),
  clinicalPercentage: z.string(),
  theoryInternalMax: z.string(),
  theoryInternalObtained: z.string(),
  theoryEndSemMax: z.string(),
  theoryEndSemObtained: z.string(),
  theoryTotalMax: z.string(),
  theoryTotalObtained: z.string(),
  practicalInternalMax: z.string(),
  practicalInternalObtained: z.string(),
  practicalEndSemMax: z.string(),
  practicalEndSemObtained: z.string(),
  practicalTotalMax: z.string(),
  practicalTotalObtained: z.string(),
  gradePoint: z.string(),
  letterGrade: z.string(),
  sgpa: z.string(),
  rank: z.string(),
});

type CourseInstructionFormData = z.infer<typeof courseInstructionSchema>;

interface CourseInstructionFormProps {
  onSubmit: (data: CourseInstructionFormData) => void;
  defaultValues?: Partial<CourseInstructionFormData>;
  onProgressChange?: (progress: number) => void;
}

export const CourseInstructionForm = ({ onSubmit, defaultValues, onProgressChange }: CourseInstructionFormProps) => {
  const form = useForm<CourseInstructionFormData>({
    resolver: zodResolver(courseInstructionSchema),
    defaultValues: defaultValues || {},
  });

  useEffect(() => {
    const subscription = form.watch((values) => {
      const requiredFields = [
        "semester",
        "courseCode",
        "courseTitle"
      ];
      const filledFields = requiredFields.filter(
        (field) => values[field] && values[field].toString().trim() !== ""
      ).length;
      const progress = (filledFields / requiredFields.length) * 100;
      onProgressChange?.(progress);
    });
    return () => subscription.unsubscribe();
  }, [form, onProgressChange]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-muted/30 p-4 rounded-lg border">
          <h3 className="font-semibold text-lg mb-4">Course Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="semester"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Semester</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select semester" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {["I", "II", "III", "IV", "V", "VI", "VII", "VIII"].map(sem => (
                        <SelectItem key={sem} value={sem}>{sem}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="courseCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter course code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="universityCourseCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>University Course Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter university code" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="courseTitle"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Course Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter course title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="bg-muted/30 p-4 rounded-lg border">
          <h3 className="font-semibold text-lg mb-4">Credits</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="theoryCredits"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Theory</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="skillLabCredits"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Skill Lab</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="clinicalCredits"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Clinical</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="bg-muted/30 p-4 rounded-lg border">
          <h3 className="font-semibold text-lg mb-4">Attendance</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <FormLabel>Theory</FormLabel>
              <div className="grid grid-cols-3 gap-2">
                <FormField
                  control={form.control}
                  name="theoryPrescribed"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Prescribed</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="theoryAttended"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Attended</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="theoryPercentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">%</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-2">
              <FormLabel>Skill Lab</FormLabel>
              <div className="grid grid-cols-3 gap-2">
                <FormField
                  control={form.control}
                  name="skillLabPrescribed"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Prescribed</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="skillLabAttended"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Attended</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="skillLabPercentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">%</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-2">
              <FormLabel>Clinical</FormLabel>
              <div className="grid grid-cols-3 gap-2">
                <FormField
                  control={form.control}
                  name="clinicalPrescribed"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Prescribed</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="clinicalAttended"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Attended</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="clinicalPercentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">%</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-muted/30 p-4 rounded-lg border">
          <h3 className="font-semibold text-lg mb-4">Marks</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <FormLabel>Theory</FormLabel>
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="theoryInternalMax"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Internal Max</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="theoryInternalObtained"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Internal Obtained</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="theoryEndSemMax"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">End Sem Max</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="theoryEndSemObtained"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">End Sem Obtained</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="theoryTotalMax"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Total Max</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="theoryTotalObtained"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Total Obtained</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-2">
              <FormLabel>Practical</FormLabel>
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="practicalInternalMax"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Internal Max</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="practicalInternalObtained"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Internal Obtained</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="practicalEndSemMax"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">End Sem Max</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="practicalEndSemObtained"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">End Sem Obtained</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="practicalTotalMax"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Total Max</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="practicalTotalObtained"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Total Obtained</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-muted/30 p-4 rounded-lg border">
          <h3 className="font-semibold text-lg mb-4">Grade & Performance</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <FormField
              control={form.control}
              name="gradePoint"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Grade Point</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="letterGrade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Letter Grade</FormLabel>
                  <FormControl>
                    <Input placeholder="A, B, C..." {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sgpa"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SGPA</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rank"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rank</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
      </form>
    </Form>
  );
};