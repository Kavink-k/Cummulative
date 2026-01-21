import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
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
import { BookOpen, ChevronLeft, ChevronRight, CheckCircle2, ArrowLeft, Save, Loader2 } from "lucide-react";
import { getAllDataByStudentId, saveDataToBackend } from "@/lib/api";
import { StudentInfoDisplay } from "@/components/StudentInfoDisplay";
import { allClinicalRecords } from "@/components/ClinicalExperienceForm";




// ADD THIS ENTIRE FUNCTION HERE
const transformDataForEdit = (data: any) => {
  const transformed = { ...data };


  // StudentEdit.tsx -> inside transformDataForEdit function

// Transform Admission Details (Step 3)
if (data.step3) {
  transformed.step3 = {
    ...data.step3,
    // Admission Basics
    universityRegistration: data.step3.universityRegistration ?? "",
    
    // Certificates
    migrationCertificateNo: data.step3.migrationCertificateNo ?? "",
    migrationCertificateDate: data.step3.migrationCertificateDate ?? "",
    eligibilityCertificateNo: data.step3.eligibilityCertificateNo ?? "",
    eligibilityCertificateDate: data.step3.eligibilityCertificateDate ?? "",
    govtAllotmentNo: data.step3.govtAllotmentNo ?? "",
    privateAllotmentNo: data.step3.privateAllotmentNo ?? "",
    communityCertificateNo: data.step3.communityCertificateNo ?? "",
    communityCertificateDate: data.step3.communityCertificateDate ?? "",
    nativityCertificateNo: data.step3.nativityCertificateNo ?? "",
    nativityCertificateDate: data.step3.nativityCertificateDate ?? "",

    // Discontinuation
    dateOfDiscontinuation: data.step3.dateOfDiscontinuation ?? "",
    reasonForDiscontinuation: data.step3.reasonForDiscontinuation ?? "",

    // Financial Aid
    scholarshipSource: data.step3.scholarshipSource ?? "",
    bankLoanSource: data.step3.bankLoanSource ?? "",
    // Note: Amount fields use numberOrNull helper, so null is actually okay there,
    // but keeping them as null or 0 is safer.
    scholarshipAmount: data.step3.scholarshipAmount ?? null,
    bankLoanAmount: data.step3.bankLoanAmount ?? null,
  };
}




  // Transform Attendance (Step 4) - Keep as array, just ensure proper structure
  if (data.step4 && Array.isArray(data.step4)) {
    transformed.step4 = {
      semesters: data.step4.map((item: any) => ({
        semester: item.semester?.toString().trim() || "",
        workingDays: item.workingDays ?? "",
        annualLeave: item.annualLeave ?? "",
        sickLeave: item.sickLeave ?? "",
        gazettedHolidays: item.gazettedHolidays ?? "",
        otherLeave: item.otherLeave ?? "",
        compensationDaysHours: item.compensationDaysHours ?? "",
      }))
    };
  }

  // Transform Activities (Step 5) - Keep as array, just ensure proper structure
  if (data.step5 && Array.isArray(data.step5)) {
    transformed.step5 = {
      semesters: data.step5.map((item: any) => ({
        semester: item.semester?.toString().trim() || "",
        sports: item.sports || "",
        coCurricular: item.coCurricular || "",
        extraCurricular: item.extraCurricular || "",
        sna: item.sna || "",
        nssYrcRrc: item.nssYrcRrc || "",
        cne: item.cne || "",
        awardsRewards: item.awardsRewards || "",
      }))
    };
  }

  // Transform Course Instruction (Step 6) - Keep as raw array
  // Form expects array of all courses across all semesters
  // No transformation needed


  // Transform Clinical Experience (Step 8)
  // if (data.step8) {
  //   const savedRecords = Array.isArray(data.step8.records) ? data.step8.records : [];
    
  //   // Merge database data with the static master list
  //   transformed.step8 = {
  //     ...data.step8,
  //     records: allClinicalRecords.map((staticRec: any) => {
  //       // Find if we have saved data for this specific clinical area in this semester
  //       const savedMatch = savedRecords.find(
  //         (s: any) => s.semester === staticRec.semester && s.clinicalArea === staticRec.clinicalArea
  //       );

  //       return {
  //         ...staticRec,
  //         completedHours: savedMatch?.completedHours ?? "",
  //         hospital: savedMatch?.hospital ?? "",
  //       };
  //     })
  //   };
  // }
if (data.step8) {
    // Get the actual saved array from the database
    const savedRecords = Array.isArray(data.step8.records) ? data.step8.records : [];
    
    transformed.step8 = {
      ...data.step8,
      // Map through the MASTER list to ensure every row exists
      records: allClinicalRecords.map((staticRec: any) => {
        // Find if user has saved data for this specific clinical area + semester
        const savedMatch = savedRecords.find(
          (s: any) => s.semester === staticRec.semester && s.clinicalArea === staticRec.clinicalArea
        );

        return {
          ...staticRec, // Prescribed values (Credits, Weeks, Hours)
          completedHours: savedMatch?.completedHours ?? "", // Stored value or blank
          hospital: savedMatch?.hospital ?? "", // Stored value or blank
        };
      })
    };
  }

  /////////////////////////////////
if (data.step12 && Array.isArray(data.step12.verifications)) {
    transformed.step12 = {
      ...data.step12,
      verifications: data.step12.verifications.map((v: any) => ({
        semester: v.semester || "",
        // The null-coalescing operator (??) converts null/undefined to ""
        classTeacherName: v.classTeacherName ?? "",
        teacherSignature: v.teacherSignature ?? "",
        principalSignature: v.principalSignature ?? "",
      }))
    };
  }


////////////////////////////////
// StudentEdit.tsx -> inside transformDataForEdit function

// Transform Course Completion (Step 11)
if (data.step11 && Array.isArray(data.step11.completions)) {
  transformed.step11 = {
    ...data.step11,
    completions: data.step11.completions.map((c: any) => ({
      courseName: c.courseName || "",
      // Convert null database values to empty strings
      certificateNumber: c.certificateNumber ?? "",
      dateOfIssue: c.dateOfIssue ?? "",
    }))
  };
}

  return transformed;
};




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
  const [currentDefaults, setCurrentDefaults] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [studentInfo, setStudentInfo] = useState<any>(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      if (!studentId) {
        setError("No student ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getAllDataByStudentId(studentId);

        // Set student info from step1
        if (data.step1) {
          setStudentInfo({
            id: studentId,
            name: data.step1.studentName || "Unknown",
            regNo: data.step1.regNo || studentId,
            email: data.step1.studentEmail || "",
          });
        }

        // Set form data
              // Transform data so AttendanceForm and ActivitiesForm can read it
        const transformedData = transformDataForEdit(data);

        setFormData(transformedData);
        setCurrentDefaults(transformedData);

        // Calculate progress based on transformed data
        const progress: Record<number, number> = {};
        for (let i = 1; i <= 12; i++) {
          if (transformedData[`step${i}`]) {
            progress[i] = 100;
          }
        }
        setStepProgress(progress);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching student data:", err);
        setError("Failed to load student data");
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [studentId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Loading student data...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !studentInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Student Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              {error || "The student record you're looking for doesn't exist."}
            </p>
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

  const handleFormSubmit = async (stepData: any) => {
    try {
      const updated = { ...formData, [`step${currentStep}`]: stepData };
      setFormData(updated);
      setCurrentDefaults(updated);
      setStepProgress((prev) => ({ ...prev, [currentStep]: 100 }));

      // Save to backend
      await saveDataToBackend(currentStep, stepData);

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
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Failed to save changes", {
        description: "Please try again.",
      });
    }
  };

  const handleFormChange = (step: number) => (data: any) => {
    const updated = { ...currentDefaults, [`step${step}`]: data };
    setCurrentDefaults(updated);
  };

  const handleProgressChange = (step: number) => (progress: number) => {
    const clamped = Math.max(0, Math.min(100, progress));
    setStepProgress((prev) => ({ ...prev, [step]: clamped }));
  };

  const handleResetForm = () => {
    if (window.confirm("Are you sure you want to reset all form data? This action cannot be undone.")) {
      setFormData({});
      setStepProgress({});
      setCurrentStep(1);
      toast.success("Form reset successfully!");
    }
  };

  const triggerActiveFormSubmit = () => {
    const currentForm = document.querySelector("form");
    if (currentForm) {
      const submitEvent = new Event("submit", { bubbles: true, cancelable: true });
      currentForm.dispatchEvent(submitEvent);
    }
  };

  const renderCurrentForm = () => {
    const studentId = currentDefaults.step1?.studentId;

    // Special handling for step6 (Course Instruction) - it's an array, not an object
    let defaultValues;
    if (currentStep === 6 && Array.isArray(currentDefaults.step6)) {
      // For Course Instruction, pass the array directly (form will handle merging)
      defaultValues = currentDefaults.step6;
    } else {
      // For all other steps, spread the object
      defaultValues = {
        ...currentDefaults[`step${currentStep}`],
        studentId: currentDefaults.step1?.studentId || studentId,
      };
    }

    const props = {
      onSubmit: handleFormSubmit,
      defaultValues,
      onProgressChange: handleProgressChange(currentStep),
      onChange: handleFormChange(currentStep),
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
                <p className="text-sm text-muted-foreground">{studentInfo.name} - {studentInfo.regNo}</p>
              </div>
            </div>

            <Button variant="outline" onClick={() => navigate("/dashboard")}>
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
            {currentStep > 1 && formData.step1?.studentId && formData.step1?.studentName && (
              <StudentInfoDisplay
                studentId={formData.step1.studentId}
                studentName={formData.step1.studentName}
              />
            )}
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
