import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormStepper } from "@/components/FormStepper";
import { PersonalProfileForm } from "@/components/PersonalProfileForm";
import { EducationalQualificationForm } from "@/components/EducationalQualificationForm";
import { AdmissionDetailsForm } from "@/components/AdmissionDetailsForm";
import { AttendanceForm } from "@/components/AttendanceForm";
import { ActivitiesParticipationForm } from "@/components/ActivitiesParticipationForm";
import { CourseInstructionForm } from "@/components/CourseInstructionForm";
import { ObservationalVisitForm } from "@/components/ObservationalVisitForm";
import { ClinicalExperienceForm } from "@/components/ClinicalExperienceForm";
import { ResearchProjectForm } from "@/components/ResearchProjectForm";
import { AdditionalCoursesForm } from "@/components/AdditionalCoursesForm";
import { CourseCompletionForm } from "@/components/CourseCompletionForm";
import { VerificationForm } from "@/components/VerificationForm";
import { toast } from "sonner";
import { BookOpen, ChevronLeft, ChevronRight, CheckCircle2, ArrowLeft } from "lucide-react";
import { sampleStudents } from "@/data/sampleStudents";
import { getStudent, updateStudent, upsertStudent } from "@/lib/data";

const steps = [
  { id: 1, title: "Personal Profile", description: "Student's basic information" },
  { id: 2, title: "Educational Qualification", description: "Academic records" },
  { id: 3, title: "Admission Details", description: "Admission & certificates" },
  { id: 4, title: "Attendance Record", description: "Working days & leave details" },
  { id: 5, title: "Activities & Participation", description: "Sports & co-curricular activities" },
  { id: 6, title: "Course Instruction", description: "Course details & marks" },
  { id: 7, title: "Observational Visits", description: "Field visit records" },
  { id: 8, title: "Clinical Experience", description: "Clinical hours tracking" },
  { id: 9, title: "Research Projects", description: "Nursing research projects" },
  { id: 10, title: "Additional Courses", description: "Extra courses completed" },
  { id: 11, title: "Course Completion", description: "Course completion details" },
  { id: 12, title: "Verification", description: "Semester-wise verification" },
];

const StudentEdit = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [stepProgress, setStepProgress] = useState<Record<number, number>>({});

  const student = sampleStudents.find(s => s.id === studentId) || getStudent(studentId || "");

  useEffect(() => {
    if (student) {
      setFormData(student.steps);
      // Calculate initial progress
      const progress: Record<number, number> = {};
      for (let i = 1; i <= 12; i++) {
        if (student.steps[`step${i}` as keyof typeof student.steps]) {
          progress[i] = 100;
        }
      }
      setStepProgress(progress);
    }
  }, [student]);

  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Student Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">The student record you're looking for doesn't exist.</p>
            <Button onClick={() => navigate("/dashboard")}>Back to Dashboard</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleNext = () => {
    setCurrentStep((s) => {
      const next = Math.min(steps.length, s + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return next;
    });
  };

  const handlePrevious = () => {
    setCurrentStep((s) => {
      const prev = Math.max(1, s - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return prev;
    });
  };

  const handleFormSubmit = (stepData: any) => {
    const updated = { ...formData, [`step${currentStep}`]: stepData };
    setFormData(updated);
    setStepProgress((prev) => ({ ...prev, [currentStep]: 100 }));
    
    // Save to storage
    upsertStudent({
      id: student.id,
      name: student.name,
      email: student.email,
      regNo: student.regNo,
      steps: updated,
    });

    toast.success("Section updated successfully!");

    if (currentStep < steps.length) {
      handleNext();
    } else {
      toast.success("All changes saved!", {
        description: "Student record has been updated.",
        icon: <CheckCircle2 className="h-5 w-5" />,
      });
      navigate(`/students/${studentId}`);
    }
  };

  const handleProgressChange = (step: number) => (progress: number) => {
    const clamped = Math.max(0, Math.min(100, progress));
    setStepProgress((prev) => ({ ...prev, [step]: clamped }));
  };

  const triggerActiveFormSubmit = () => {
    const currentForm = document.querySelector("form");
    if (currentForm) {
      const submitEvent = new Event("submit", { bubbles: true, cancelable: true });
      currentForm.dispatchEvent(submitEvent);
    }
  };

  const renderCurrentForm = () => {
    const studentId = formData.step1?.studentId;
    const defaultValues = { ...formData[`step${currentStep}`], studentId };
    const props = {
      onSubmit: handleFormSubmit,
      defaultValues,
      onProgressChange: handleProgressChange(currentStep),
    };

    switch (currentStep) {
      case 1:
        return <PersonalProfileForm {...props} />;
      case 2:
        return <EducationalQualificationForm {...props} />;
      case 3:
        return <AdmissionDetailsForm {...props} />;
      case 4:
        return <AttendanceForm {...props} />;
      case 5:
        return <ActivitiesParticipationForm {...props} />;
      case 6:
        return <CourseInstructionForm {...props} />;
      case 7:
        return <ObservationalVisitForm {...props} />;
      case 8:
        return <ClinicalExperienceForm {...props} />;
      case 9:
        return <ResearchProjectForm {...props} />;
      case 10:
        return <AdditionalCoursesForm {...props} />;
      case 11:
        return <CourseCompletionForm {...props} />;
      case 12:
        return <VerificationForm {...props} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="bg-primary text-primary-foreground p-2 rounded-lg">
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Edit Student Record</h1>
                <p className="text-sm text-muted-foreground">{student.name} - {student.regNo}</p>
              </div>
            </div>

            <Button variant="outline" onClick={() => navigate(`/students/${studentId}`)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <Card className="mb-8 border-2 overflow-x-auto">
          <CardHeader>
            <CardTitle>Form Progress</CardTitle>
            <CardDescription>
              Edit any of the {steps.length} sections
            </CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <div className="min-w-max flex gap-2">
              <FormStepper
                steps={steps}
                currentStep={currentStep}
                onStepClick={setCurrentStep}
                stepProgress={stepProgress}
                showProgressLabels
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
            <CardTitle className="text-2xl">{steps[currentStep - 1].title}</CardTitle>
            <CardDescription className="text-base">
              {steps[currentStep - 1].description}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {renderCurrentForm()}

            <div className="flex justify-between mt-8 pt-6 border-t">
              <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1}>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              <div className="flex gap-3">
                <Button variant="outline" onClick={triggerActiveFormSubmit}>
                  Save & Continue
                </Button>

                {currentStep < steps.length ? (
                  <Button onClick={triggerActiveFormSubmit}>
                    Next
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button onClick={triggerActiveFormSubmit} className="bg-primary">
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Save All Changes
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default StudentEdit;
