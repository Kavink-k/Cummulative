
import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer, Loader2 } from "lucide-react";
import { getAllDataByStudentId } from "@/lib/api";
import { EducationalMarksPrintTable } from "@/components/EducationalMarksPrintTable";
import { GeneralInstructions } from "@/components/GeneralInstructions";
import "./StudentPrint.css";
import { allClinicalRecords } from "@/components/ClinicalExperienceForm";
import semesterNotes from "../data/semesterNotes.json";



const StudentPrint = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentData = async () => {
      if (!studentId) return navigate("/dashboard");

      try {
        setLoading(true);
        const data = await getAllDataByStudentId(studentId);


        setStudent({
          id: studentId,
          name: data.step3?.studentName || "Unknown",
          photoUrl: data.step3?.photoUrl || data.step3?.photo,
          steps: data,
        });
      } catch (err) {
        console.error("Error fetching student data:", err);
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [studentId, navigate]);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? "-" : date.toLocaleDateString("en-GB");
  };

  const handlePrint = () => window.print();

  // --- SAFE DATA EXTRACTORS ---
  const getStepData = (stepKey: string, arrayKey?: string) => {
    const data = student?.steps?.[stepKey];
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (arrayKey && data[arrayKey] && Array.isArray(data[arrayKey])) return data[arrayKey];
    if (typeof data === "object") {
      if (data.records && Array.isArray(data.records)) return data.records;
      if (data.completions && Array.isArray(data.completions)) return data.completions;
      return Object.values(data).filter((i) => i !== null);
    }
    return [];
  };



  // --- MERGE LOGIC FOR CLINICAL EXPERIENCE ---
  const clinicalExperiences = (() => {
    const step10Data = student?.steps?.step10; // Clinical Experience is now step 10
    const savedRecords = Array.isArray(step10Data?.records) ? step10Data.records : [];

    // Always map from the master list to keep the full table structure
    return allClinicalRecords.map((staticRec: any) => {
      const savedMatch = savedRecords.find(
        (s: any) =>
          s.semester === staticRec.semester &&
          s.clinicalArea === staticRec.clinicalArea
      );

      return {
        ...staticRec,
        completedHours: savedMatch?.completedHours || "-",
        hospital: savedMatch?.hospital || "-",
      };
    });
  })();

  // Other extractions (updated for new step numbering)
  const observationalVisits = getStepData("step9", "visits");
  const researchProjects = getStepData("step11", "projects");
  const additionalCourses = getStepData("step12", "courses");
  const completions = getStepData("step13", "completions");
  const verifications = getStepData("step14", "verifications");



  // Real extraction logic dependent on 'student'
  const courseData = useMemo(() => {
    const data = student?.steps?.step8;
    if (!data) return [];

    // Case 1: New structure with attempts array (Object with attempts)
    if (data?.attempts && Array.isArray(data.attempts)) {
      return data.attempts.flatMap((att: any) => {
        if (!att.courses || !Array.isArray(att.courses)) return [];
        // Handle both attemptNumber and attempt keys, allowing 0 as a valid value
        const attemptVal = att.attemptNumber !== undefined ? att.attemptNumber : (att.attempt !== undefined ? att.attempt : 1);
        
        return att.courses.map((course: any) => ({
          ...course,
          semester: att.semester,
          attempt: attemptVal
        }));
      });
    }
    
    // Case 2: Intermediate structure (Object with courses)
    if (data?.courses && Array.isArray(data.courses)) {
      return data.courses.map((course: any) => ({
        ...course,
        semester: data.semester || course.semester,
        attempt: data.attempt || course.attempt || 1
      }));
    }

    // Case 3: Array of Semester Objects (EACH containing attempts) - THIS IS THE ACTUAL CASE
    if (Array.isArray(data)) {
      // Check if items have attempts array
      const firstItem = data.length > 0 ? data[0] : null;
      if (firstItem && firstItem.attempts && Array.isArray(firstItem.attempts)) {
        return data.flatMap((semesterObj: any) => {
          return semesterObj.attempts.flatMap((att: any) => {
            if (!att.courses || !Array.isArray(att.courses)) return [];
            // Handle both attemptNumber and attempt keys, allowing 0 as a valid value
            const attemptVal = att.attemptNumber !== undefined ? att.attemptNumber : (att.attempt !== undefined ? att.attempt : 1);
            
            return att.courses.map((course: any) => ({
              ...course,
              semester: semesterObj.semester, // Use semester from parent object
              attempt: attemptVal
            }));
          });
        });
      }

      // Case 4: Legacy flat array (items are courses directly)
      return data;
    }

    return [];
  }, [student]);

  // Group by Semester -> Attempt
  const groupedCourses = useMemo(() => {
    if (!courseData.length) return {};
    const groups: Record<string, Record<string, any[]>> = {};

    courseData.forEach((course: any) => {
       const sem = course.semester || "Unknown";
       const att = String(course.attempt !== undefined && course.attempt !== null ? course.attempt : "1");
       
       if (!groups[sem]) groups[sem] = {};
       if (!groups[sem][att]) groups[sem][att] = [];
       groups[sem][att].push(course);
    });
    return groups;
  }, [courseData]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="h-10 w-10 animate-spin" />
    </div>
  );

  if (!student) return (
    <div className="text-center py-20">
      <h2>Student Not Found</h2>
      <Button onClick={() => navigate("/dashboard")}>Back</Button>
    </div>
  );

  return (
    <>
      <div className="no-print bg-background p-4 border-b sticky top-0 z-50">
        <div className="container mx-auto flex justify-between">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
          <Button onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" /> Print Full Report
          </Button>
        </div>
      </div>



      <div className="print-container">
        {/* HEADER */}
        <div className="print-header">
          <h1>STUDENT CUMULATIVE RECORD</h1>
          <h2>B.Sc. Nursing Programme</h2>
          <div className="header-content">
            <div className="student-info">
              <div>
                <p><strong>Name:</strong> {student.name}</p>
                <p><strong>Student ID:</strong> {student.id}</p>
                {/* <p><strong>Registration No:</strong> {student.regNo}</p> */}
              </div>
            </div>
            {student.photoUrl && (
              <div className="student-photo">
                <img
                  src={student.photoUrl.startsWith("http") ? student.photoUrl : `${import.meta.env.VITE_BACKEND_URL}${student.photoUrl}`}
                  alt="Student"
                />
              </div>
            )}
          </div>
        </div>

        {/* 1. Institution Details */}
        <div className="print-section">
          <h3 className="section-title">1. Institution Details</h3>
          <table className="info-table">
            <tbody>
              <tr><td style={{ fontWeight: "bold" }}>Institution Name:</td><td colSpan={3}>{student.steps.step1?.institutionName || "-"}</td></tr>
              <tr><td style={{ fontWeight: "bold" }}>Address:</td><td colSpan={3}>{student.steps.step1?.address || "-"}</td></tr>
              <tr><td style={{ fontWeight: "bold" }}>Batch:</td><td>{student.steps.step1?.batch || "-"}</td><td style={{ fontWeight: "bold" }}>Course:</td><td>{student.steps.step1?.course || "-"}</td></tr>
            </tbody>
          </table>
        </div>

        {/* 2. General Instructions */}
        <div className="print-section">
          <h3 className="section-title">2. General Instructions</h3>
          <GeneralInstructions mode="print" />
        </div>

        {/* 3. Personal Profile */}
        <div className="print-section">
          <h3 className="section-title">3. Personal Profile</h3>
          <table className="info-table">
            <tbody>
              <tr><td style={{ fontWeight: "bold" }}>Name of Student:</td><td colSpan={3}>{student.steps.step3?.studentName || "-"}</td></tr>
              <tr><td style={{ fontWeight: "bold" }}>Age:</td><td>{student.steps.step3?.age || "-"}</td><td style={{ fontWeight: "bold" }}>Date of Birth:</td><td>{formatDate(student.steps.step3?.dateOfBirth)}</td></tr>
              <tr><td style={{ fontWeight: "bold" }}>Gender:</td><td>{student.steps.step3?.gender || "-"}</td><td style={{ fontWeight: "bold" }}>Nationality:</td><td>{student.steps.step3?.nationality || "-"}</td></tr>
              <tr><td style={{ fontWeight: "bold" }}>Religion:</td><td>{student.steps.step3?.religion || "-"}</td><td style={{ fontWeight: "bold" }}>Community:</td><td>{student.steps.step3?.community || "-"}</td></tr>
              <tr><td style={{ fontWeight: "bold" }}>Nativity:</td><td>{student.steps.step3?.nativity || "-"}</td><td style={{ fontWeight: "bold" }}>Marital Status:</td><td>{student.steps.step3?.maritalStatus || "-"}</td></tr>
              <tr><td style={{ fontWeight: "bold" }}>Mother Tongue:</td><td>{student.steps.step3?.motherTongue || "-"}</td><td style={{ fontWeight: "bold" }}>Contact Mobile:</td><td>{student.steps.step3?.contactMobile || "-"}</td></tr>
              <tr><td style={{ fontWeight: "bold" }}>Email:</td><td>{student.steps.step3?.studentEmail || "-"}</td><td style={{ fontWeight: "bold" }}>Aadhar No:</td><td>{student.steps.step3?.aadharNo || "-"}</td></tr>
              <tr><td style={{ fontWeight: "bold" }}>EMIS No:</td><td>{student.steps.step3?.emisNo || "-"}</td><td ><span style={{ fontWeight: "bold" }}>Parent/Guardian Name:</span></td><td> {student.steps.step3?.parentGuardianName || "-"}</td></tr>
              <tr><td colSpan={4}><span style={{ fontWeight: "bold" }}>Communication Address:</span> {student.steps.step3?.communicationAddress || "-"}</td></tr>
              <tr><td colSpan={4}><span style={{ fontWeight: "bold" }}>Permanent Address:</span> {student.steps.step3?.permanentAddress || "-"}</td></tr>
            </tbody>
          </table>
        </div>

        {/* 3. Educational Qualification */}
        <div className="print-section">
          <h3 className="section-title">3. Educational Qualification</h3>
          <table className="info-table">
            <tbody>
              <tr><td style={{ fontWeight: "bold" }}>Stream/Group:</td><td>{student.steps.step4?.streamGroup || "-"}</td><td style={{ fontWeight: "bold" }}>Board of Examination:</td><td>{student.steps.step4?.boardOfExamination || "-"}</td></tr>
              <tr><td style={{ fontWeight: "bold" }}>Year of Passing:</td><td>{student.steps.step4?.yearOfPassing || "-"}</td><td style={{ fontWeight: "bold" }}>Medium of Instruction:</td><td>{student.steps.step4?.mediumOfInstruction || "-"}</td></tr>
              <tr><td style={{ fontWeight: "bold" }}>Certificate No:</td><td>{student.steps.step4?.certificateNo || "-"}</td><td style={{ fontWeight: "bold" }}>Certificate Date:</td><td>{formatDate(student.steps.step4?.certificateDate)}</td></tr>
              <tr><td style={{ fontWeight: "bold" }}>HSC Verification No:</td><td>{student.steps.step4?.hscVerificationNo || "-"}</td><td style={{ fontWeight: "bold" }}>HSC Verification Date:</td><td>{formatDate(student.steps.step4?.hscVerificationDate)}</td></tr>
            </tbody>
          </table>
          {student.steps.step4?.subjects?.length > 0 && (
            <>
              <h4 className="subsection-title">Marks Obtained</h4>
              <EducationalMarksPrintTable
                subjects={student.steps.step4.subjects}
                totalPlusOneAttempts={student.steps.step4.totalPlusOneAttempts || []}
                totalPlusTwoAttempts={student.steps.step4.totalPlusTwoAttempts || []}
              />
            </>
          )}
        </div>

        {/* 4. Admission Details */}
        <div className="print-section">
          <h3 className="section-title">4. Admission Details</h3>
          <table className="info-table">
            <tbody>
              <tr><td style={{ fontWeight: "bold" }}>Date of Admission:</td><td>{formatDate(student.steps.step5?.dateOfAdmission)}</td><td style={{ fontWeight: "bold" }}>Admission Number:</td><td>{student.steps.step5?.admissionNumber || "-"}</td></tr>
              <tr><td style={{ fontWeight: "bold" }}>Roll Number:</td><td>{student.steps.step5?.rollNumber || "-"}</td><td style={{ fontWeight: "bold" }}>University Registration:</td><td>{student.steps.step5?.universityRegistration || "-"}</td></tr>
              <tr><td style={{ fontWeight: "bold" }}>Allotment Category:</td><td>{student.steps.step5?.allotmentCategory || "-"}</td><td style={{ fontWeight: "bold" }}>Allotment No:</td><td>{student.steps.step5?.govtAllotmentNo || student.steps.step5?.privateAllotmentNo || "-"}</td></tr>
              <tr><td style={{ fontWeight: "bold" }}>Scholarship Source:</td><td>{student.steps.step5?.scholarshipSource || "-"}</td><td style={{ fontWeight: "bold" }}>Scholarship Amount:</td><td>{student.steps.step5?.scholarshipAmount || "-"}</td></tr>
            </tbody>
          </table>
        </div>

        {/* 5. Attendance */}
        <div className="print-section">
          <h3 className="section-title">5. Attendance</h3>
          <table className="data-table">
            <thead>
              <tr><th>Semester</th><th>Working Days</th><th>Annual Leave</th><th>Sick Leave</th><th>Gazetted Holidays</th><th>Other Leave</th><th>Compensation (Days/Hrs)</th></tr>
            </thead>
            <tbody>
              {["I", "II", "III", "IV", "V", "VI", "VII", "VIII"].map((sem) => {
                const step6Arr = Array.isArray(student.steps.step6) ? student.steps.step6 : [];
                const rec = step6Arr.find((r: any) => r.semester === sem) || {};
                return (
                  <tr key={sem}>
                    <td>{sem}</td><td>{rec.workingDays || "-"}</td><td>{rec.annualLeave || "-"}</td><td>{rec.sickLeave || "-"}</td><td>{rec.gazettedHolidays || "-"}</td><td>{rec.otherLeave || "-"}</td><td>{rec.compensationDaysHours || "-"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* 6. Activities */}
        <div className="print-section">
          <h3 className="section-title">6. Activities</h3>
          <table className="data-table">
            <thead>
              <tr><th>Semester</th><th>Sports</th><th>Co-curricular</th><th>Extra-curricular</th><th>SNA</th><th>NSS/YRC/RRC</th><th>CNE</th><th>Awards/Rewards</th></tr>
            </thead>
            <tbody>
              {["I", "II", "III", "IV", "V", "VI", "VII", "VIII"].map((sem) => {
                const step7Arr = Array.isArray(student.steps.step7) ? student.steps.step7 : [];
                const act = step7Arr.find((a: any) => a.semester === sem) || {};
                return (
                  <tr key={sem}>
                    <td>{sem}</td><td>{act.sports || "-"}</td><td>{act.coCurricular || "-"}</td><td>{act.extraCurricular || "-"}</td><td>{act.sna || "-"}</td><td>{act.nssYrcRrc || "-"}</td><td>{act.cne || "-"}</td><td>{act.awardsRewards || "-"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* 7. COURSE INSTRUCTION */}
        <h3 className="section-title no-print">7. COURSE INSTRUCTION</h3>
        {["I", "II", "III", "IV", "V", "VI", "VII", "VIII"].map((sem) => {
          if (!groupedCourses[sem]) return null;
          
          const attempts = Object.keys(groupedCourses[sem]).sort((a,b) => Number(a)-Number(b));
          
          return attempts.map((att) => {
            const courses = groupedCourses[sem][att];
            if (courses.length === 0) return null;

            return (
              <div key={`${sem}-${att}`} className="course-instruction-print-page">
                <div className="course-instruction-rotate">
                  <h4 className="subsection-title">Semester {sem} - Attempt {att}</h4>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th rowSpan={4}>S.No</th><th rowSpan={4}>Course Code</th><th rowSpan={4}>Univ. Code</th><th rowSpan={4}>Title</th><th colSpan={3}>Credits</th><th colSpan={9}>Hours</th><th colSpan={12}>Marks</th><th rowSpan={4}>Grade Pt</th><th rowSpan={4}>Letter Grade</th><th rowSpan={4}>SGPA</th><th rowSpan={4}>Rank</th>
                      </tr>
                      <tr>
                        <th rowSpan={3}>Theory</th><th rowSpan={3}>Skill</th><th rowSpan={3}>Clinical</th><th colSpan={3}>Theory</th><th colSpan={3}>Skill</th><th colSpan={3}>Clinical</th><th colSpan={6}>Theory</th><th colSpan={6}>Practical</th>
                      </tr>
                      <tr>
                        <th rowSpan={2}>Presc.</th><th rowSpan={2}>Att.</th><th rowSpan={2}>%</th><th rowSpan={2}>Presc.</th><th rowSpan={2}>Att.</th><th rowSpan={2}>%</th><th rowSpan={2}>Presc.</th><th rowSpan={2}>Att.</th><th rowSpan={2}>%</th><th colSpan={2}>Internal</th><th colSpan={2}>End Sem</th><th colSpan={2}>Total</th><th colSpan={2}>Internal</th><th colSpan={2}>End Sem</th><th colSpan={2}>Total</th>
                      </tr>
                      <tr>
                        <th>Max</th><th>Obt</th><th>Max</th><th>Obt</th><th>Max</th><th>Obt</th><th>Max</th><th>Obt</th><th>Max</th><th>Obt</th><th>Max</th><th>Obt</th>
                      </tr>
                    </thead>
                    <tbody>
                      {courses.map((c: any, i: number) => (
                        <tr key={i}>
                          <td>{c.sNo || "-"}</td><td>{c.courseCode || "-"}</td><td>{c.universityCourseCode || "-"}</td><td>{c.courseTitle || "-"}</td><td>{c.theoryCredits || "-"}</td><td>{c.skillLabCredits || "-"}</td><td>{c.clinicalCredits || "-"}</td><td>{c.theoryPrescribed || "-"}</td><td>{c.theoryAttended || "-"}</td><td>{c.theoryPercentage || "-"}</td><td>{c.skillLabPrescribed || "-"}</td><td>{c.skillLabAttended || "-"}</td><td>{c.skillLabPercentage || "-"}</td><td>{c.clinicalPrescribed || "-"}</td><td>{c.clinicalAttended || "-"}</td><td>{c.clinicalPercentage || "-"}</td><td>{c.theoryInternalMax || "-"}</td><td>{c.theoryInternalObtained || "-"}</td><td>{c.theoryEndSemMax || "-"}</td><td>{c.theoryEndSemObtained || "-"}</td><td>{c.theoryTotalMax || "-"}</td><td>{c.theoryTotalObtained || "-"}</td><td>{c.practicalInternalMax || "-"}</td><td>{c.practicalInternalObtained || "-"}</td><td>{c.practicalEndSemMax || "-"}</td><td>{c.practicalEndSemObtained || "-"}</td><td>{c.practicalTotalMax || "-"}</td><td>{c.practicalTotalObtained || "-"}</td><td>{c.gradePoint || "-"}</td><td>{c.letterGrade || "-"}</td><td>{c.sgpa || "-"}</td><td>{c.rank || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Semester Specific Notes */}
                  {semesterNotes.notes[sem as keyof typeof semesterNotes.notes] && (
                    <div style={{ marginTop: '10px', fontSize: '12px', color: '#444', fontStyle: 'italic', borderTop: '1px solid #eee', paddingTop: '8px' }}>
                      {typeof semesterNotes.notes[sem as keyof typeof semesterNotes.notes] === 'string' ? (
                        <p>{semesterNotes.notes[sem as keyof typeof semesterNotes.notes] as string}</p>
                      ) : (
                        <div>
                          <strong style={{ display: 'block', marginBottom: '4px', color: '#000' }}>{(semesterNotes.notes[sem as keyof typeof semesterNotes.notes] as any).title}</strong>
                          <p style={{ marginBottom: '6px' }}>{(semesterNotes.notes[sem as keyof typeof semesterNotes.notes] as any).description}</p>
                          <ul style={{ paddingLeft: '20px', listStyleType: 'disc' }}>
                            {(semesterNotes.notes[sem as keyof typeof semesterNotes.notes] as any).list.map((note: string, idx: number) => (
                              <li key={idx} style={{ marginBottom: '2px' }}>{note}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          });
        })}

        {/* 8. Observational Visits */}
        <div className="print-section">
          <h3 className="section-title">8. Observational Visits</h3>
          <table className="data-table">
            <thead><tr><th>Semester</th><th>Institution & Place</th><th>Date</th></tr></thead>
            <tbody>
              {observationalVisits.map((v: any, index: number) => (
                <tr key={v.id || index}>
                  <td>{v.semester || "-"}</td><td>{v.institutionPlace || "-"}</td><td>{formatDate(v.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 9. Clinical Experience */}
        <div className="print-section">
          <h3 className="section-title">9. Clinical Experience</h3>
          <table className="data-table">
            <thead>
              <tr><th>Semester</th><th>Clinical Area</th><th>Credits</th><th>Weeks</th><th>Hours</th><th>Completed Hours</th><th>Hospital/Community</th></tr>
            </thead>
            <tbody>
              {clinicalExperiences.map((e: any, index: number) => (
                <tr key={e.id || index}>
                  <td>{e.semester || "-"}</td>
                  <td>{e.clinicalArea || "-"}</td>
                  <td>{e.credits || "-"}</td>
                  <td>{e.prescribedWeeks || "-"}</td>
                  <td>{e.prescribedHours || "-"}</td>
                  <td>{e.completedHours || "-"}</td>
                  <td>{e.hospital || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 10. Research Projects */}
        <div className="print-section">
          <h3 className="section-title">10. Research Projects</h3>
          <table className="data-table">
            <thead><tr><th>Semester</th><th>Area of Study</th><th>Type</th><th>Title</th></tr></thead>
            <tbody>
              {researchProjects.map((p: any, index: number) => (
                <tr key={p.id || index}>
                  <td>{p.semester || "-"}</td><td>{p.areaOfStudy || "-"}</td><td>{p.type || "-"}</td><td>{p.projectTitle || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 11. Additional Courses */}
        <div className="print-section">
          <h3 className="section-title">11. Additional Courses</h3>
          <table className="data-table">
            <thead><tr><th>Course ID</th><th>Name</th><th>From</th><th>To</th></tr></thead>
            <tbody>
              {additionalCourses.map((c: any, index: number) => (
                <tr key={c.id || index}>
                  <td>{c.courseId || "-"}</td><td>{c.courseName || "-"}</td><td>{formatDate(c.from)}</td><td>{formatDate(c.to)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 12. Course Completion */}
        <div className="print-section">
          <h3 className="section-title">12. Course Completion</h3>
          <table className="data-table">
            <thead><tr><th>Name of Certificate</th><th>Certificate Number</th><th>Date of Issue</th></tr></thead>
            <tbody>
              {completions.map((comp: any, index: number) => (
                <tr key={comp.id || index}>
                  <td>{comp.courseName || "-"}</td><td>{comp.certificateNumber || "-"}</td><td>{formatDate(comp.dateOfIssue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 13. VERIFICATION */}
        <div className="print-section">
          <h3 className="section-title">13. VERIFICATION</h3>
          <table className="data-table">
            <thead>
              <tr><th className="w-16">Semester</th><th>Name of Class Teacher/Coordinator</th><th>Signature of Class Teacher with Date</th><th>Signature of Principal with Date</th></tr>
            </thead>
            <tbody>
              {["I", "II", "III", "IV", "V", "VI", "VII", "VIII"].map((sem) => {
                const record = verifications.find((v: any) => v.semester === sem) || {};
                return (
                  <tr key={sem}>
                    <td className="text-center font-bold text-lg">{sem}</td>
                    <td className="font-medium">{record.teacherName || record.classTeacherName || "-"}</td>
                    <td className="text-center">{record.teacherSignature ? formatDate(record.teacherSignature) : "-"}</td>
                    <td className="text-center">{record.principalSignature ? formatDate(record.principalSignature) : "-"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* FOOTER */}
        <div className="print-footer">
          <p>Generated on: {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
        </div>
      </div>
    </>
  );
};

export default StudentPrint;