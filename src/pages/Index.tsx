
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
import { BookOpen, ChevronLeft, ChevronRight, Save, CheckCircle2, Trash2, Database } from "lucide-react";
import { saveDataToBackend, getAllDataByStudentId } from "@/lib/api";

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

const STORAGE_KEY = "student_cumulative_data";
const STEP_KEY = "student_cumulative_step";

const Index = () => {
  // 1. Load initial state from Local Storage
  const [currentStep, setCurrentStep] = useState(() => {
    const savedStep = localStorage.getItem(STEP_KEY);
    return savedStep ? parseInt(savedStep) : 1;
  });

  const [formData, setFormData] = useState<Record<string, any>>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  });

  // Initialize progress based on saved data
  const [stepProgress, setStepProgress] = useState<Record<number, number>>(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    const progress: Record<number, number> = {};
    if (savedData) {
      const parsed = JSON.parse(savedData);
      // If data exists for a step, assume it's 100% done for visual purposes
      Object.keys(parsed).forEach(key => {
        if (key.startsWith('step')) {
          const id = parseInt(key.replace('step', ''));
          if (!isNaN(id)) progress[id] = 100;
        }
      });
    }
    return progress;
  });

  const [isSaving, setIsSaving] = useState(false);

  // 2. Auto-save to Local Storage on any change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    localStorage.setItem(STEP_KEY, currentStep.toString());
  }, [currentStep]);

  // 3. Fetch data from backend when studentId is available
  useEffect(() => {
    const fetchBackendData = async () => {
      const step1Data = formData.step1;
      if (!step1Data?.studentId) {
        console.log('No studentId found, skipping backend fetch');
        return;
      }

      try {
        console.log(`Fetching data from backend for studentId: ${step1Data.studentId}`);
        const backendData = await getAllDataByStudentId(step1Data.studentId);

        // Merge backend data with localStorage (localStorage takes precedence)
        const mergedData: Record<string, any> = {};

        // Iterate over step keys
        (['step1', 'step2', 'step3', 'step4', 'step5', 'step6', 'step7', 'step8', 'step9', 'step10', 'step11', 'step12'] as const).forEach((stepKey) => {
          if (backendData[stepKey]) {
            // If localStorage doesn't have this step, use backend data
            if (!formData[stepKey]) {
              mergedData[stepKey] = backendData[stepKey];
            }
          }
        });

        if (Object.keys(mergedData).length > 0) {
          console.log('Merging backend data with localStorage:', mergedData);
          setFormData(prev => ({ ...prev, ...mergedData }));

          // Update progress for fetched steps
          const newProgress: Record<number, number> = {};
          Object.keys(mergedData).forEach(key => {
            if (key.startsWith('step')) {
              const stepNum = parseInt(key.replace('step', ''));
              if (!isNaN(stepNum)) {
                newProgress[stepNum] = 100;
              }
            }
          });
          setStepProgress(prev => ({ ...prev, ...newProgress }));
        }
      } catch (error) {
        console.error('Error fetching backend data:', error);
        // Don't show error toast, just log it - data might not exist yet
      }
    };

    fetchBackendData();
  }, [formData.step1?.studentId]); // Only run when studentId changes

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

  // Main Submit Handler
  const handleFormSubmit = async (stepData: any) => {
    setIsSaving(true);

    // Update Local State
    setFormData(prev => ({ ...prev, [`step${currentStep}`]: stepData }));
    setStepProgress(prev => ({ ...prev, [currentStep]: 100 }));

    try {
      // Debug: Log what we are sending
      console.log(`Submitting Step ${currentStep} payload:`, stepData);

      // Save to Backend
      await saveDataToBackend(currentStep, stepData);

      toast.success("Saved to Database!", {
        icon: <Database className="h-4 w-4 text-green-500" />,
      });

      if (currentStep < steps.length) {
        handleNext();
      } else {
        toast.success("All forms completed!");
      }
    } catch (error: any) {
      console.error("DB Save Error:", error);

      // Extract error message safely
      let errorMsg = "Unknown error";
      if (error.response && error.response.data) {
        errorMsg = error.response.data.message || JSON.stringify(error.response.data);
      } else if (error.message) {
        errorMsg = error.message;
      }

      toast.error("Saved Locally Only", {
        description: `Database sync failed: ${errorMsg}`,
        duration: 5000, // Keep visible longer
        action: {
          label: "Retry",
          onClick: () => handleFormSubmit(stepData),
        },
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleClearData = () => {
    if (confirm("Clear all local data? This will reset the form.")) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STEP_KEY);
      setFormData({});
      setStepProgress({});
      setCurrentStep(1);
      window.location.reload();
    }
  };

  const handleSaveDraft = () => {
    // Data is already in localStorage via useEffect, just notify user
    toast.info("Draft saved locally!");
  };

  const handleProgressChange = (step: number) => (progress: number) => {
    setStepProgress(prev => ({ ...prev, [step]: progress }));
  };

  // --- CRITICAL: Helper to inject Student ID into steps 2+ ---
  const getStepDefaultValues = (step: number) => {
    const savedData = formData[`step${step}`] || {};

    // If we are on step 2 or greater, look for studentId in step 1 data
    if (step > 1) {
      const step1Data = formData.step1;
      // If we have a studentId from step 1, ensure it's in the current step's defaults
      if (step1Data?.studentId && !savedData.studentId) {
        return { ...savedData, studentId: step1Data.studentId };
      }
    }
    return savedData;
  };

  const renderCurrentForm = () => {
    const commonProps = {
      onSubmit: handleFormSubmit,
      defaultValues: getStepDefaultValues(currentStep),
      onProgressChange: handleProgressChange(currentStep),
    };

    switch (currentStep) {
      case 1: return <PersonalProfileForm {...commonProps} />;
      case 2: return <EducationalQualificationForm {...commonProps} />;
      case 3: return <AdmissionDetailsForm {...commonProps} />;
      case 4: return <AttendanceForm {...commonProps} />;
      case 5: return <ActivitiesParticipationForm {...commonProps} />;
      case 6: return <CourseInstructionForm {...commonProps} />;
      case 7: return <ObservationalVisitForm {...commonProps} />;
      case 8: return <ClinicalExperienceForm {...commonProps} />;
      case 9: return <ResearchProjectForm {...commonProps} />;
      case 10: return <AdditionalCoursesForm {...commonProps} />;
      case 11: return <CourseCompletionForm {...commonProps} />;
      case 12: return <VerificationForm {...commonProps} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-primary text-primary-foreground p-2 rounded-lg">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Student Record</h1>
              <p className="text-xs text-muted-foreground">Academic Documentation System</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={handleClearData} title="Reset">
              <Trash2 className="h-5 w-5 text-muted-foreground hover:text-destructive" />
            </Button>
            <Button variant="outline" onClick={handleSaveDraft}>
              <Save className="h-4 w-4 mr-2" />
              Draft
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <Card className="mb-8 border-2 overflow-x-auto">
          <CardHeader>
            <CardTitle>Form Progress</CardTitle>
            <CardDescription>Step {currentStep} of {steps.length}</CardDescription>
          </CardHeader>
          <CardContent>
            <FormStepper
              steps={steps}
              currentStep={currentStep}
              onStepClick={setCurrentStep}
              stepProgress={stepProgress}
            />
          </CardContent>
        </Card>

        <Card className="border-2 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
            <CardTitle>{steps[currentStep - 1].title}</CardTitle>
            <CardDescription>{steps[currentStep - 1].description}</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {renderCurrentForm()}

            <div className="flex justify-between mt-8 pt-6 border-t">
              <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1}>
                <ChevronLeft className="h-4 w-4 mr-2" /> Previous
              </Button>

              {/* This button finds the first form element on the page and dispatches a submit event.
                  This allows the button to live outside the form component while still controlling it.
              */}
              <Button
                onClick={() => {
                  const form = document.querySelector("form");
                  if (form) {
                    form.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
                  } else {
                    console.error("No form found to submit");
                  }
                }}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : currentStep === steps.length ? "Submit All" : "Save & Next"}
                {!isSaving && <ChevronRight className="h-4 w-4 ml-2" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Index;