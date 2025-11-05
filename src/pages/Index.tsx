import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormStepper } from "@/components/FormStepper";
import { PersonalProfileForm } from "@/components/PersonalProfileForm";
import { EducationalQualificationForm } from "@/components/EducationalQualificationForm";
import { AdmissionDetailsForm } from "@/components/AdmissionDetailsForm";
import { toast } from "sonner";
import { BookOpen, ChevronLeft, ChevronRight, Save } from "lucide-react";

const steps = [
  {
    id: 1,
    title: "Personal Profile",
    description: "Student's basic information",
  },
  {
    id: 2,
    title: "Educational Qualification",
    description: "Academic records",
  },
  {
    id: 3,
    title: "Admission Details",
    description: "Admission & certificates",
  },
];

const Index = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Record<string, any>>({});

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
    toast.success("Section saved successfully!");
    
    if (currentStep < steps.length) {
      handleNext();
    } else {
      console.log("Complete form data:", { ...formData, [`step${currentStep}`]: stepData });
      toast.success("All forms completed successfully!");
    }
  };

  const handleSaveDraft = () => {
    toast.info("Draft saved successfully!");
    console.log("Current draft:", formData);
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
        <Card className="mb-8 border-2">
          <CardHeader>
            <CardTitle>Form Progress</CardTitle>
            <CardDescription>Complete all sections to submit your cumulative record</CardDescription>
          </CardHeader>
          <CardContent>
            <FormStepper steps={steps} currentStep={currentStep} onStepClick={setCurrentStep} />
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
            {currentStep === 1 && (
              <PersonalProfileForm
                onSubmit={handleFormSubmit}
                defaultValues={formData.step1}
              />
            )}
            {currentStep === 2 && (
              <EducationalQualificationForm
                onSubmit={handleFormSubmit}
                defaultValues={formData.step2}
              />
            )}
            {currentStep === 3 && (
              <AdmissionDetailsForm
                onSubmit={handleFormSubmit}
                defaultValues={formData.step3}
              />
            )}

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
                    const currentForm = document.querySelector('form');
                    if (currentForm) {
                      const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
                      currentForm.dispatchEvent(submitEvent);
                    }
                  }}
                >
                  Save & Continue
                </Button>
                {currentStep < steps.length ? (
                  <Button
                    onClick={() => {
                      const currentForm = document.querySelector('form');
                      if (currentForm) {
                        const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
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
                      const currentForm = document.querySelector('form');
                      if (currentForm) {
                        const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
                        currentForm.dispatchEvent(submitEvent);
                      }
                    }}
                  >
                    Submit All Forms
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>Step {currentStep} of {steps.length} • All fields marked with * are required</p>
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