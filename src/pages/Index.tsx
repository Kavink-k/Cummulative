import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
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
import { BookOpen, ChevronLeft, ChevronRight, Save, CheckCircle2, Trash2, Database, FilePlus } from "lucide-react";
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
  const navigate = useNavigate();
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
  // Use a ref to track if we've already fetched for this studentId
  const fetchedStudentIdRef = useRef<string | null>(null);

  useEffect(() => {
    const fetchBackendData = async () => {
      const step1Data = formData.step1;
      if (!step1Data?.studentId) {
        return;
      }

      // Skip if we've already fetched for this studentId
      if (fetchedStudentIdRef.current === step1Data.studentId) {
        return;
      }

      try {
        const backendData = await getAllDataByStudentId(step1Data.studentId);

        // Merge backend data with localStorage (localStorage takes precedence)
        const mergedData: Record<string, any> = {};

        // Iterate over step keys
        (['step1', 'step2', 'step3', 'step4', 'step5', 'step6', 'step7', 'step8', 'step9', 'step10', 'step11', 'step12'] as const).forEach((stepKey) => {
          if (backendData[stepKey]) {
            // If localStorage doesn't have this step, use backend data
            if (!formData[stepKey]) {
              mergedData[stepKey] = backendData[stepKey];
            } else {
              // Merge: localStorage takes precedence, but fill in missing fields from backend
              mergedData[stepKey] = { ...backendData[stepKey], ...formData[stepKey] };
            }
          }
        });

        if (Object.keys(mergedData).length > 0) {
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

        // Mark this studentId as fetched
        fetchedStudentIdRef.current = step1Data.studentId;
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

    // Update Local State immediately with the new data
    const updatedFormData = { ...formData, [`step${currentStep}`]: stepData };
    setFormData(updatedFormData);
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
        navigate("/dashboard");
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
    toast('Reset all form data?', {
      description: 'This will clear all form data (saved and unsaved). This cannot be undone.',
      action: {
        label: 'Reset',
        onClick: () => {
          localStorage.removeItem(STORAGE_KEY);
          localStorage.removeItem(STEP_KEY);
          // Reload page immediately to clear all form state
          window.location.reload();
        },
      },
      cancel: {
        label: 'Cancel',
        onClick: () => {
          toast.info('Reset cancelled');
        },
      },
    });
  };

  const handleNewForm = () => {
    toast('Start a new form?', {
      description: 'This will clear all current data (saved and unsaved) to start fresh.',
      action: {
        label: 'New Form',
        onClick: () => {
          localStorage.removeItem(STORAGE_KEY);
          localStorage.removeItem(STEP_KEY);
          // Reload page immediately to clear all form state
          window.location.reload();
        },
      },
      cancel: {
        label: 'Cancel',
        onClick: () => toast.info('Cancelled'),
      },
    });
  };

  const handleSaveDraft = () => {
    const hasData = Object.keys(formData).length > 0;

    if (!hasData) {
      toast.info('No data to save as draft');
      return;
    }

    // Data is already auto-saved to localStorage
    const studentId = formData.step1?.studentId || 'Unknown';
    const completedSteps = Object.keys(formData).length;

    toast.success('Draft saved successfully!', {
      description: `Student ID: ${studentId} | ${completedSteps} section(s) saved`,
      icon: <Save className="h-4 w-4" />,
    });
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

  // const renderCurrentForm = () => {
  //   const defaultValues = getStepDefaultValues(currentStep);
  //   const commonProps = {
  //     onSubmit: handleFormSubmit,
  //     defaultValues: defaultValues,
  //     onProgressChange: handleProgressChange(currentStep),
  //     key: `step-${currentStep}-${JSON.stringify(defaultValues)}`, // Force remount when data changes
  //   };

  //   switch (currentStep) {
  //     case 1: return <PersonalProfileForm {...commonProps} />;
  //     case 2: return <EducationalQualificationForm {...commonProps} />;
  //     case 3: return <AdmissionDetailsForm {...commonProps} />;
  //     case 4: return <AttendanceForm {...commonProps} />;
  //     case 5: return <ActivitiesParticipationForm {...commonProps} />;
  //     case 6: return <CourseInstructionForm {...commonProps} />;
  //     case 7: return <ObservationalVisitForm {...commonProps} />;
  //     case 8: return <ClinicalExperienceForm {...commonProps} />;
  //     case 9: return <ResearchProjectForm {...commonProps} />;
  //     case 10: return <AdditionalCoursesForm {...commonProps} />;
  //     case 11: return <CourseCompletionForm {...commonProps} />;
  //     case 12: return <VerificationForm {...commonProps} />;
  //     default: return null;
  //   }
  // };
  // ✅ NEW CODE (FIXED)
  const renderCurrentForm = () => {
    const defaultValues = getStepDefaultValues(currentStep);

    // 1. Remove key from the object
    const commonProps = {
      onSubmit: handleFormSubmit,
      defaultValues: defaultValues,
      onProgressChange: handleProgressChange(currentStep),
    };

    // 2. Define the key separately
    const formKey = `step-${currentStep}-${JSON.stringify(defaultValues)}`;

    // 3. Pass the key explicitly to each component
    switch (currentStep) {
      case 1: return <PersonalProfileForm key={formKey} {...commonProps} />;
      case 2: return <EducationalQualificationForm key={formKey} {...commonProps} />;
      case 3: return <AdmissionDetailsForm key={formKey} {...commonProps} />;
      case 4: return <AttendanceForm key={formKey} {...commonProps} />;
      case 5: return <ActivitiesParticipationForm key={formKey} {...commonProps} />;
      case 6: return <CourseInstructionForm key={formKey} {...commonProps} />;
      case 7: return <ObservationalVisitForm key={formKey} {...commonProps} />;
      case 8: return <ClinicalExperienceForm key={formKey} {...commonProps} />;
      case 9: return <ResearchProjectForm key={formKey} {...commonProps} />;
      case 10: return <AdditionalCoursesForm key={formKey} {...commonProps} />;
      case 11: return <CourseCompletionForm key={formKey} {...commonProps} />;
      case 12: return <VerificationForm key={formKey} {...commonProps} />;
      default: return null;
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            {/* <div className="bg-primary text-primary-foreground p-2 rounded-lg">
              <BookOpen className="h-6 w-6" />
            </div> */}
            <div>
              <h1 className="text-2xl font-bold text-foreground">Student Record</h1>
              <p className="text-xs text-muted-foreground">Academic Documentation System</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleNewForm}
              title="Start a new student form"
            >
              <FilePlus className="h-4 w-4 mr-2" />
              New Form
            </Button>

            <Button
              variant="outline"
              onClick={handleClearData}
              title="Reset all form data"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Reset
            </Button>

            <Button
              variant="outline"
              onClick={handleSaveDraft}
              title="Save current progress as draft"
            >
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

              {/* This button finds the first form element on the page and triggers submission.
                  This allows the button to live outside the form component while still controlling it.
              */}
              <Button
                onClick={() => {
                  const form = document.querySelector("form");

                  if (form) {
                    // Use requestSubmit() to properly trigger form validation
                    if (typeof form.requestSubmit === 'function') {
                      form.requestSubmit();
                    } else {
                      // Fallback for older browsers
                      form.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
                    }
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