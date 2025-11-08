import { useState, useEffect } from "react";
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
import { BookOpen, ChevronLeft, ChevronRight, Save, CheckCircle2 } from "lucide-react";

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

const Index = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [stepProgress, setStepProgress] = useState<Record<number, number>>({}); // Track progress per step

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleFormSubmit = (stepData: any) => {
    setFormData({ ...formData, [`step${currentStep}`]: stepData });
    setStepProgress((prev) => ({ ...prev, [currentStep]: 100 })); // Mark step as complete on submit
    toast.success("Section saved successfully!");

    if (currentStep < steps.length) {
      handleNext();
    } else {
      console.log("Complete form data:", { ...formData, [`step${currentStep}`]: stepData });
      toast.success("All forms completed successfully!", {
        description: "Your cumulative record has been submitted.",
        icon: <CheckCircle2 className="h-5 w-5" />,
      });
    }
  };

  const handleSaveDraft = () => {
    toast.info("Draft saved successfully!");
    console.log("Current draft:", formData);
  };

  const handleProgressChange = (step: number) => (progress: number) => {
    setStepProgress((prev) => ({ ...prev, [step]: progress }));
  };

  const renderCurrentForm = () => {
    const props = {
      onSubmit: handleFormSubmit,
      defaultValues: formData[`step${currentStep}`],
      onProgressChange: handleProgressChange(currentStep), // Pass progress callback
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary text-primary-foreground p-2 rounded-lg">
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Student Cumulative Record</h1>
                <p className="text-sm text-muted-foreground">Academic Documentation System</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleSaveDraft}>
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <Card className="mb-8 border-2 overflow-x-auto">
          <CardHeader>
            <CardTitle>Form Progress</CardTitle>
            <CardDescription>
              Complete all {steps.length} sections to submit your cumulative record
            </CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <div className="min-w-max flex gap-2">
              <FormStepper
                steps={steps}
                currentStep={currentStep}
                onStepClick={setCurrentStep}
                stepProgress={stepProgress} // Pass progress data
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
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    const currentForm = document.querySelector("form");
                    if (currentForm) {
                      const submitEvent = new Event("submit", { bubbles: true, cancelable: true });
                      currentForm.dispatchEvent(submitEvent);
                    }
                  }}
                >
                  Save & Continue
                </Button>
                {currentStep < steps.length ? (
                  <Button
                    onClick={() => {
                      const currentForm = document.querySelector("form");
                      if (currentForm) {
                        const submitEvent = new Event("submit", { bubbles: true, cancelable: true });
                        currentForm.dispatchEvent(submitEvent);
                      }
                    }}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      const currentForm = document.querySelector("form");
                      if (currentForm) {
                        const submitEvent = new Event("submit", { bubbles: true, cancelable: true });
                        currentForm.dispatchEvent(submitEvent);
                      }
                    }}
                    className="bg-primary"
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Submit All Forms
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>Step {currentStep} of {steps.length} • All information will be saved automatically</p>
        </div>
      </main>

      <footer className="border-t bg-card/30 mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>© 2025 Student Cumulative Record System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;