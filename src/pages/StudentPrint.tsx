// import { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { ArrowLeft, Printer, Loader2 } from "lucide-react";
// import { getAllDataByStudentId } from "@/lib/api";
// import { EducationalMarksPrintTable } from "@/components/EducationalMarksPrintTable";
// import "./StudentPrint.css";

// const StudentPrint = () => {
//   const { studentId } = useParams<{ studentId: string }>();
//   const navigate = useNavigate();
//   const [student, setStudent] = useState<any>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchStudentData = async () => {
//       if (!studentId) return navigate("/dashboard");

//       try {
//         setLoading(true);
//         const data = await getAllDataByStudentId(studentId);

//         setStudent({
//           id: studentId,
//           name: data.step1?.studentName || "Unknown",
//           regNo: data.step1?.regNo || studentId,
//           photoUrl: data.step1?.photoUrl || data.step1?.photo,
//           steps: data,
//         });
//       } catch (err) {
//         console.error(err);
//         navigate("/dashboard");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchStudentData();
//   }, [studentId, navigate]);

//   const formatDate = (dateStr: string | null) => {
//     if (!dateStr) return "-";
//     const date = new Date(dateStr);
//     return isNaN(date.getTime()) ? "-" : date.toLocaleDateString("en-GB");
//   };

//   const handlePrint = () => window.print();

//   if (loading)
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <Loader2 className="h-10 w-10 animate-spin" />
//       </div>
//     );
//   if (!student)
//     return (
//       <div className="text-center py-20">
//         <h2>Student Not Found</h2>
//         <Button onClick={() => navigate("/dashboard")}>Back</Button>
//       </div>
//     );

//   // Helper to safely extract array from step12
//   const getVerifications = () => {
//     const step12 = student.steps.step12;
//     if (Array.isArray(step12)) return step12;
//     if (step12?.verifications && Array.isArray(step12.verifications))
//       return step12.verifications;
//     if (step12 && typeof step12 === "object")
//       return Object.values(step12).flat();
//     return [];
//   };

//   // StudentPrint.tsx

// // Helper to safely extract array from step7
// const getObservationalVisits = () => {
//   const step7 = student.steps.step7;
//   if (Array.isArray(step7)) return step7;
//   // If it's wrapped in a property like 'visits'
//   if (step7?.visits && Array.isArray(step7.visits)) return step7.visits;
//   // If it's a keyed object { "0": {...}, "1": {...} }
//   if (step7 && typeof step7 === "object") return Object.values(step7).filter(i => i !== null);
//   return [];
// };

// const observationalVisits = getObservationalVisits();

//   const verifications = getVerifications();

//   return (
//     <>
//       <div className="no-print bg-background p-4 border-b sticky top-0 z-50">
//         <div className="container mx-auto flex justify-between">
//           <Button variant="outline" onClick={() => navigate(-1)}>
//             <ArrowLeft className="h-4 w-4 mr-2" /> Back
//           </Button>
//           <Button onClick={handlePrint}>
//             <Printer className="h-4 w-4 mr-2" /> Print Full Report
//           </Button>
//         </div>
//       </div>

//       <div className="print-container">
//         {/* HEADER */}
//         <div className="print-header">
//           <h1>STUDENT CUMULATIVE RECORD</h1>
//           <h2>B.Sc. Nursing Programme</h2>
//           <div className="header-content">
//             <div className="student-info">
//               <p>
//                 <strong>Name:</strong> {student.name}
//               </p>
//               <p>
//                 <strong>Student ID:</strong> {student.id}
//               </p>
//               <p>
//                 <strong>Registration No:</strong> {student.regNo}
//               </p>
//             </div>
//             {student.photoUrl && (
//               <div className="student-photo">
//                 <img
//                   src={
//                     student.photoUrl.startsWith("http")
//                       ? student.photoUrl
//                       : `http://localhost:5000${student.photoUrl}`
//                   }
//                   alt="Student"
//                 />
//               </div>
//             )}
//           </div>
//         </div>

//         {/* 1. Personal Profile */}
//         <div className="print-section">
//           <h3 className="section-title">1. Personal Profile</h3>
//           <table className="info-table">
//             <tbody>
//               <tr>
//                 <td>Name of Student</td>
//                 <td colSpan={3}>{student.steps.step1?.studentName || "-"}</td>
//               </tr>
//               <tr>
//                 <td>Age</td>
//                 <td>{student.steps.step1?.age || "-"}</td>
//                 <td>Date of Birth</td>
//                 <td>{formatDate(student.steps.step1?.dateOfBirth)}</td>
//               </tr>
//               <tr>
//                 <td>Gender</td>
//                 <td>{student.steps.step1?.gender || "-"}</td>
//                 <td>Nationality</td>
//                 <td>{student.steps.step1?.nationality || "-"}</td>
//               </tr>
//               <tr>
//                 <td>Religion</td>
//                 <td>{student.steps.step1?.religion || "-"}</td>
//                 <td>Community</td>
//                 <td>{student.steps.step1?.community || "-"}</td>
//               </tr>
//               <tr>
//                 <td>Nativity</td>
//                 <td>{student.steps.step1?.nativity || "-"}</td>
//                 <td>Marital Status</td>
//                 <td>{student.steps.step1?.maritalStatus || "-"}</td>
//               </tr>
//               <tr>
//                 <td>Mother Tongue</td>
//                 <td>{student.steps.step1?.motherTongue || "-"}</td>
//                 <td>Contact Mobile</td>
//                 <td>{student.steps.step1?.contactMobile || "-"}</td>
//               </tr>
//               <tr>
//                 <td>Email</td>
//                 <td>{student.steps.step1?.studentEmail || "-"}</td>
//                 <td>Aadhar No</td>
//                 <td>{student.steps.step1?.aadharNo || "-"}</td>
//               </tr>
//               <tr>
//                 <td>EMIS No</td>
//                 <td>{student.steps.step1?.emisNo || "-"}</td>
//                 <td colSpan={2}></td>
//               </tr>
//               <tr>
//                 <td colSpan={4}>
//                   Parent/Guardian Name:{" "}
//                   {student.steps.step1?.parentGuardianName || "-"}
//                 </td>
//               </tr>
//               <tr>
//                 <td colSpan={4}>
//                   Communication Address:{" "}
//                   {student.steps.step1?.communicationAddress || "-"}
//                 </td>
//               </tr>
//               <tr>
//                 <td colSpan={4}>
//                   Permanent Address:{" "}
//                   {student.steps.step1?.permanentAddress || "-"}
//                 </td>
//               </tr>
//             </tbody>
//           </table>
//         </div>

//         {/* 2. Educational Qualification */}
//         <div className="print-section">
//           <h3 className="section-title">2. Educational Qualification</h3>
//           <table className="info-table">
//             <tbody>
//               <tr>
//                 <td>Stream/Group</td>
//                 <td>{student.steps.step2?.streamGroup || "-"}</td>
//                 <td>Board of Examination</td>
//                 <td>{student.steps.step2?.boardOfExamination || "-"}</td>
//               </tr>
//               <tr>
//                 <td>Year of Passing</td>
//                 <td>{student.steps.step2?.yearOfPassing || "-"}</td>
//                 <td>Medium of Instruction</td>
//                 <td>{student.steps.step2?.mediumOfInstruction || "-"}</td>
//               </tr>
//               <tr>
//                 <td>Certificate No</td>
//                 <td>{student.steps.step2?.certificateNo || "-"}</td>
//                 <td colSpan={2}></td>
//               </tr>
//             </tbody>
//           </table>
//           {student.steps.step2?.subjects?.length > 0 && (
//             <>
//               <h4 className="subsection-title">Marks Obtained</h4>
//               <EducationalMarksPrintTable
//                 subjects={student.steps.step2.subjects}
//                 totalPlusOneAttempts={
//                   student.steps.step2.totalPlusOneAttempts || []
//                 }
//                 totalPlusTwoAttempts={
//                   student.steps.step2.totalPlusTwoAttempts || []
//                 }
//               />
//             </>
//           )}
//         </div>

//         {/* 3. Admission Details */}
//         <div className="print-section">
//           <h3 className="section-title">3. Admission Details</h3>
//           <table className="info-table">
//             <tbody>
//               <tr>
//                 <td>Date of Admission</td>
//                 <td>{formatDate(student.steps.step3?.dateOfAdmission)}</td>
//                 <td>Admission Number</td>
//                 <td>{student.steps.step3?.admissionNumber || "-"}</td>
//               </tr>
//               <tr>
//                 <td>Roll Number</td>
//                 <td>{student.steps.step3?.rollNumber || "-"}</td>
//                 <td>University Registration</td>
//                 <td>{student.steps.step3?.universityRegistration || "-"}</td>
//               </tr>
//               <tr>
//                 <td>Allotment Category</td>
//                 <td>{student.steps.step3?.allotmentCategory || "-"}</td>
//                 <td>Allotment No</td>
//                 <td>
//                   {student.steps.step3?.govtAllotmentNo ||
//                     student.steps.step3?.privateAllotmentNo ||
//                     "-"}
//                 </td>
//               </tr>
//               <tr>
//                 <td>Scholarship Source</td>
//                 <td>{student.steps.step3?.scholarshipSource || "-"}</td>
//                 <td>Scholarship Amount</td>
//                 <td>{student.steps.step3?.scholarshipAmount || "-"}</td>
//               </tr>
//             </tbody>
//           </table>
//         </div>

//         {/* 4. Attendance */}
//         <div className="print-section">
//           <h3 className="section-title">4. Attendance</h3>
//           <table className="data-table">
//             <thead>
//               <tr>
//                 <th>Semester</th>
//                 <th>Working Days</th>
//                 <th>Annual Leave</th>
//                 <th>Sick Leave</th>
//                 <th>Gazetted Holidays</th>
//                 <th>Other Leave</th>
//                 <th>Compensation (Days/Hrs)</th>
//               </tr>
//             </thead>
//             <tbody>
//               {["I", "II", "III", "IV", "V", "VI", "VII", "VIII"].map((sem) => {
//                 const rec =
//                   student.steps.step4?.find((r: any) => r.semester === sem) ||
//                   {};
//                 return (
//                   <tr key={sem}>
//                     <td>{sem}</td>
//                     <td>{rec.workingDays || "-"}</td>
//                     <td>{rec.annualLeave || "-"}</td>
//                     <td>{rec.sickLeave || "-"}</td>
//                     <td>{rec.gazettedHolidays || "-"}</td>
//                     <td>{rec.otherLeave || "-"}</td>
//                     <td>{rec.compensationDaysHours || "-"}</td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>

//         {/* 5. Activities */}
//         <div className="print-section">
//           <h3 className="section-title">5. Activities</h3>
//           <table className="data-table">
//             <thead>
//               <tr>
//                 <th>Semester</th>
//                 <th>Sports</th>
//                 <th>Co-curricular</th>
//                 <th>Extra-curricular</th>
//                 <th>SNA</th>
//                 <th>NSS/YRC/RRC</th>
//                 <th>CNE</th>
//                 <th>Awards/Rewards</th>
//               </tr>
//             </thead>
//             <tbody>
//               {["I", "II", "III", "IV", "V", "VI", "VII", "VIII"].map((sem) => {
//                 const act =
//                   student.steps.step5?.find((a: any) => a.semester === sem) ||
//                   {};
//                 return (
//                   <tr key={sem}>
//                     <td>{sem}</td>
//                     <td>{act.sports || "-"}</td>
//                     <td>{act.coCurricular || "-"}</td>
//                     <td>{act.extraCurricular || "-"}</td>
//                     <td>{act.sna || "-"}</td>
//                     <td>{act.nssYrcRrc || "-"}</td>
//                     <td>{act.cne || "-"}</td>
//                     <td>{act.awardsRewards || "-"}</td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>

//      {/* 6. COURSE INSTRUCTION – landscape print page */}
// <h3 className="section-title no-print">6. COURSE INSTRUCTION</h3>   {/* visible only on screen */}

// {["I","II","III","IV","V","VI","VII","VIII"].map((sem) => {
//   const courses = student.steps.step6?.filter((c:any)=>c.semester===sem) || [];
//   if(courses.length===0) return null;

//   return (
//     <div key={sem} className="course-instruction-print-page"> {/* full A4 page */}
//       <div className="course-instruction-rotate">

//         <h4 className="subsection-title">Semester {sem}</h4>

//         <table className="data-table">
//           <thead>
//             <tr>
//               <th rowSpan={4}>S.No</th>
//               <th rowSpan={4}>Course Code</th>
//               <th rowSpan={4}>Univ. Code</th>
//               <th rowSpan={4}>Title</th>
//               <th colSpan={3}>Credits</th>
//               <th colSpan={9}>Hours</th>
//               <th colSpan={12}>Marks</th>
//               <th rowSpan={4}>Grade Pt</th>
//               <th rowSpan={4}>Letter Grade</th>
//               <th rowSpan={4}>SGPA</th>
//               <th rowSpan={4}>Rank</th>
//             </tr>
//             <tr>
//               <th rowSpan={3}>Theory</th>
//               <th rowSpan={3}>Skill</th>
//               <th rowSpan={3}>Clinical</th>
//               <th colSpan={3}>Theory</th>
//               <th colSpan={3}>Skill</th>
//               <th colSpan={3}>Clinical</th>
//               <th colSpan={6}>Theory</th>
//               <th colSpan={6}>Practical</th>
//             </tr>
//             <tr>
//               <th rowSpan={2}>Presc.</th><th rowSpan={2}>Att.</th><th rowSpan={2}>%</th>
//               <th rowSpan={2}>Presc.</th><th rowSpan={2}>Att.</th><th rowSpan={2}>%</th>
//               <th rowSpan={2}>Presc.</th><th rowSpan={2}>Att.</th><th rowSpan={2}>%</th>
//               <th colSpan={2}>Internal</th><th colSpan={2}>End Sem</th><th colSpan={2}>Total</th>
//               <th colSpan={2}>Internal</th><th colSpan={2}>End Sem</th><th colSpan={2}>Total</th>
//             </tr>
//             <tr>
//               <th>Max</th><th>Obt</th><th>Max</th><th>Obt</th><th>Max</th><th>Obt</th>
//               <th>Max</th><th>Obt</th><th>Max</th><th>Obt</th><th>Max</th><th>Obt</th>
//             </tr>
//           </thead>

//           <tbody>
//             {courses.map((c:any,i:number)=>(
//               <tr key={i}>
//                 <td>{c.sNo||"-"}</td>
//                 <td>{c.courseCode||"-"}</td>
//                 <td>{c.universityCourseCode||"-"}</td>
//                 <td>{c.courseTitle||"-"}</td>
//                 <td>{c.theoryCredits||"-"}</td><td>{c.skillLabCredits||"-"}</td><td>{c.clinicalCredits||"-"}</td>
//                 <td>{c.theoryPrescribed||"-"}</td><td>{c.theoryAttended||"-"}</td><td>{c.theoryPercentage||"-"}</td>
//                 <td>{c.skillLabPrescribed||"-"}</td><td>{c.skillLabAttended||"-"}</td><td>{c.skillLabPercentage||"-"}</td>
//                 <td>{c.clinicalPrescribed||"-"}</td><td>{c.clinicalAttended||"-"}</td><td>{c.clinicalPercentage||"-"}</td>
//                 <td>{c.theoryInternalMax||"-"}</td><td>{c.theoryInternalObtained||"-"}</td>
//                 <td>{c.theoryEndSemMax||"-"}</td><td>{c.theoryEndSemObtained||"-"}</td>
//                 <td>{c.theoryTotalMax||"-"}</td><td>{c.theoryTotalObtained||"-"}</td>
//                 <td>{c.practicalInternalMax||"-"}</td><td>{c.practicalInternalObtained||"-"}</td>
//                 <td>{c.practicalEndSemMax||"-"}</td><td>{c.practicalEndSemObtained||"-"}</td>
//                 <td>{c.practicalTotalMax||"-"}</td><td>{c.practicalTotalObtained||"-"}</td>
//                 <td>{c.gradePoint||"-"}</td><td>{c.letterGrade||"-"}</td><td>{c.sgpa||"-"}</td><td>{c.rank||"-"}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// })}

//        {/* 7. Observational Visits */}
// <div className="print-section">
//   <h3 className="section-title">7. Observational Visits</h3>
//   <table className="data-table">
//     <thead>
//       <tr>
//         <th>Semester</th>
//         <th>Institution & Place</th>
//         <th>Date</th>
//       </tr>
//     </thead>
//     <tbody>
//       {/* Use the safe helper array here */}
//       {observationalVisits.map((v: any, index: number) => (
//         <tr key={v.id || index}>
//           <td>{v.semester || "-"}</td>
//           <td>{v.institutionPlace || "-"}</td>
//           <td>{formatDate(v.date)}</td>
//         </tr>
//       ))}
//     </tbody>
//   </table>
// </div>

//         {/* 8. Clinical Experience */}
//         <div className="print-section">
//           <h3 className="section-title">8. Clinical Experience</h3>
//           <table className="data-table">
//             <thead>
//               <tr>
//                 <th>Semester</th>
//                 <th>Clinical Area</th>
//                 <th>Credits</th>
//                 <th>Weeks</th>
//                 <th>Hours</th>
//                 <th>Completed Hours</th>
//                 <th>Hospital/Community</th>
//               </tr>
//             </thead>
//             <tbody>
//               {student.steps.step8?.map((e: any) => (
//                 <tr key={e.id}>
//                   <td>{e.semester}</td>
//                   <td>{e.clinicalArea}</td>
//                   <td>{e.credits}</td>
//                   <td>{e.prescribedWeeks}</td>
//                   <td>{e.prescribedHours}</td>
//                   <td>{e.completedHours}</td>
//                   <td>{e.hospital}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* 9. Research Projects */}
//         <div className="print-section">
//           <h3 className="section-title">9. Research Projects</h3>
//           <table className="data-table">
//             <thead>
//               <tr>
//                 <th>Semester</th>
//                 <th>Area of Study</th>
//                 <th>Type</th>
//                 <th>Title</th>
//               </tr>
//             </thead>
//             <tbody>
//               {student.steps.step9?.map((p: any) => (
//                 <tr key={p.id}>
//                   <td>{p.semester}</td>
//                   <td>{p.areaOfStudy}</td>
//                   <td>{p.type}</td>
//                   <td>{p.projectTitle}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* 10. Additional Courses */}
//         <div className="print-section">
//           <h3 className="section-title">10. Additional Courses</h3>
//           <table className="data-table">
//             <thead>
//               <tr>
//                 <th>Course ID</th>
//                 <th>Name</th>
//                 <th>From</th>
//                 <th>To</th>
//               </tr>
//             </thead>
//             <tbody>
//               {student.steps.step10?.courses?.map((c: any) => (
//                 <tr key={c.id}>
//                   <td>{c.courseId}</td>
//                   <td>{c.courseName}</td>
//                   <td>{formatDate(c.from)}</td>
//                   <td>{formatDate(c.to)}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* 11. Course Completion */}
//         <div className="print-section">
//           <h3 className="section-title">11. Course Completion</h3>
//           <table className="data-table">
//             <thead>
//               <tr>
//                 <th>Name of Certificate</th>
//                 <th>Certificate Number</th>
//                 <th>Date of Issue</th>
//               </tr>
//             </thead>
//             <tbody>
//               {student.steps.step11?.completions?.map((comp: any) => (
//                 <tr key={comp.id}>
//                   <td>{comp.courseName}</td>
//                   <td>{comp.certificateNumber}</td>
//                   <td>{formatDate(comp.dateOfIssue)}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* 12. VERIFICATION - FIXED & SAFE */}
//         <div className="print-section">
//           <h3 className="section-title">12. VERIFICATION</h3>
//           <table className="data-table">
//             <thead>
//               <tr>
//                 <th className="w-16">Semester</th>
//                 <th>Name of Class Teacher/Coordinator</th>
//                 <th>Signature of Class Teacher with Date</th>
//                 <th>Signature of Principal with Date</th>
//               </tr>
//             </thead>
//             <tbody>
//               {["I", "II", "III", "IV", "V", "VI", "VII", "VIII"].map((sem) => {
//                 const record =
//                   verifications.find((v: any) => v.semester === sem) || {};

//                 return (
//                   <tr key={sem}>
//                     <td className="text-center font-bold text-lg">{sem}</td>
//                     <td className="font-medium">
//                       {record.teacherName || record.classTeacherName || "-"}
//                     </td>
//                     <td className="text-center">
//                       {record.teacherSignature
//                         ? formatDate(record.teacherSignature)
//                         : "-"}

//                     </td>
//                     <td className="text-center">
//                       {record.principalSignature
//                         ? formatDate(record.principalSignature)
//                         : "-"}

//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//           <p className="text-xs italic text-center mt-4">
//             Note: This form records the verification of cumulative records by
//             class teachers/coordinators and the principal for each semester.
//           </p>
//         </div>

//         {/* FOOTER */}
//         <div className="print-footer">
//           <p className="font-semibold">
//             This is a computer-generated document. No signature is required.
//           </p>
//           <p>
//             Generated on:{" "}
//             {new Date().toLocaleDateString("en-IN", {
//               day: "numeric",
//               month: "long",
//               year: "numeric",
//             })}
//           </p>
//         </div>
//       </div>
//     </>
//   );
// };

// export default StudentPrint;
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer, Loader2 } from "lucide-react";
import { getAllDataByStudentId } from "@/lib/api";
import { EducationalMarksPrintTable } from "@/components/EducationalMarksPrintTable";
import "./StudentPrint.css";
import { allClinicalRecords } from "@/components/ClinicalExperienceForm";



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
          name: data.step1?.studentName || "Unknown",
          photoUrl: data.step1?.photoUrl || data.step1?.photo,
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

  // --- MERGE LOGIC FOR CLINICAL EXPERIENCE ---
  const clinicalExperiences = (() => {
    const step8Data = student?.steps?.step8;
    const savedRecords = Array.isArray(step8Data?.records) ? step8Data.records : [];

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

  // Other extractions
  const observationalVisits = getStepData("step7", "visits");
  const researchProjects = getStepData("step9", "projects");
  const additionalCourses = getStepData("step10", "courses");
  const completions = getStepData("step11", "completions");
  const verifications = getStepData("step12", "verifications");

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
                  src={student.photoUrl.startsWith("http") ? student.photoUrl : `http://localhost:5000${student.photoUrl}`}
                  alt="Student"
                />
              </div>
            )}
          </div>
        </div>

        {/* 1. Personal Profile */}
        <div className="print-section">
          <h3 className="section-title">1. Personal Profile</h3>
          <table className="info-table">
            <tbody>
              <tr><td style={{ fontWeight: "bold" }}>Name of Student</td><td colSpan={3}>{student.steps.step1?.studentName || "-"}</td></tr>
              <tr><td>Age</td><td>{student.steps.step1?.age || "-"}</td><td>Date of Birth</td><td>{formatDate(student.steps.step1?.dateOfBirth)}</td></tr>
              <tr><td>Gender</td><td>{student.steps.step1?.gender || "-"}</td><td>Nationality</td><td>{student.steps.step1?.nationality || "-"}</td></tr>
              <tr><td>Religion</td><td>{student.steps.step1?.religion || "-"}</td><td>Community</td><td>{student.steps.step1?.community || "-"}</td></tr>
              <tr><td>Nativity</td><td>{student.steps.step1?.nativity || "-"}</td><td>Marital Status</td><td>{student.steps.step1?.maritalStatus || "-"}</td></tr>
              <tr><td>Mother Tongue</td><td>{student.steps.step1?.motherTongue || "-"}</td><td>Contact Mobile</td><td>{student.steps.step1?.contactMobile || "-"}</td></tr>
              <tr><td>Email</td><td>{student.steps.step1?.studentEmail || "-"}</td><td>Aadhar No</td><td>{student.steps.step1?.aadharNo || "-"}</td></tr>
              <tr><td>EMIS No</td><td>{student.steps.step1?.emisNo || "-"}</td><td colSpan={2}></td></tr>
              <tr><td colSpan={4}>Parent/Guardian Name: {student.steps.step1?.parentGuardianName || "-"}</td></tr>
              <tr><td colSpan={4}>Communication Address: {student.steps.step1?.communicationAddress || "-"}</td></tr>
              <tr><td colSpan={4}>Permanent Address: {student.steps.step1?.permanentAddress || "-"}</td></tr>
            </tbody>
          </table>
        </div>

        {/* 2. Educational Qualification */}
        <div className="print-section">
          <h3 className="section-title">2. Educational Qualification</h3>
          <table className="info-table">
            <tbody>
              <tr><td>Stream/Group</td><td>{student.steps.step2?.streamGroup || "-"}</td><td>Board of Examination</td><td>{student.steps.step2?.boardOfExamination || "-"}</td></tr>
              <tr><td>Year of Passing</td><td>{student.steps.step2?.yearOfPassing || "-"}</td><td>Medium of Instruction</td><td>{student.steps.step2?.mediumOfInstruction || "-"}</td></tr>
              <tr><td>Certificate No</td><td>{student.steps.step2?.certificateNo || "-"}</td><td colSpan={2}></td></tr>
            </tbody>
          </table>
          {student.steps.step2?.subjects?.length > 0 && (
            <>
              <h4 className="subsection-title">Marks Obtained</h4>
              <EducationalMarksPrintTable
                subjects={student.steps.step2.subjects}
                totalPlusOneAttempts={student.steps.step2.totalPlusOneAttempts || []}
                totalPlusTwoAttempts={student.steps.step2.totalPlusTwoAttempts || []}
              />
            </>
          )}
        </div>

        {/* 3. Admission Details */}
        <div className="print-section">
          <h3 className="section-title">3. Admission Details</h3>
          <table className="info-table">
            <tbody>
              <tr><td>Date of Admission</td><td>{formatDate(student.steps.step3?.dateOfAdmission)}</td><td>Admission Number</td><td>{student.steps.step3?.admissionNumber || "-"}</td></tr>
              <tr><td>Roll Number</td><td>{student.steps.step3?.rollNumber || "-"}</td><td>University Registration</td><td>{student.steps.step3?.universityRegistration || "-"}</td></tr>
              <tr><td>Allotment Category</td><td>{student.steps.step3?.allotmentCategory || "-"}</td><td>Allotment No</td><td>{student.steps.step3?.govtAllotmentNo || student.steps.step3?.privateAllotmentNo || "-"}</td></tr>
              <tr><td>Scholarship Source</td><td>{student.steps.step3?.scholarshipSource || "-"}</td><td>Scholarship Amount</td><td>{student.steps.step3?.scholarshipAmount || "-"}</td></tr>
            </tbody>
          </table>
        </div>

        {/* 4. Attendance */}
        <div className="print-section">
          <h3 className="section-title">4. Attendance</h3>
          <table className="data-table">
            <thead>
              <tr><th>Semester</th><th>Working Days</th><th>Annual Leave</th><th>Sick Leave</th><th>Gazetted Holidays</th><th>Other Leave</th><th>Compensation (Days/Hrs)</th></tr>
            </thead>
            <tbody>
              {["I", "II", "III", "IV", "V", "VI", "VII", "VIII"].map((sem) => {
                const step4Arr = Array.isArray(student.steps.step4) ? student.steps.step4 : [];
                const rec = step4Arr.find((r: any) => r.semester === sem) || {};
                return (
                  <tr key={sem}>
                    <td>{sem}</td><td>{rec.workingDays || "-"}</td><td>{rec.annualLeave || "-"}</td><td>{rec.sickLeave || "-"}</td><td>{rec.gazettedHolidays || "-"}</td><td>{rec.otherLeave || "-"}</td><td>{rec.compensationDaysHours || "-"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* 5. Activities */}
        <div className="print-section">
          <h3 className="section-title">5. Activities</h3>
          <table className="data-table">
            <thead>
              <tr><th>Semester</th><th>Sports</th><th>Co-curricular</th><th>Extra-curricular</th><th>SNA</th><th>NSS/YRC/RRC</th><th>CNE</th><th>Awards/Rewards</th></tr>
            </thead>
            <tbody>
              {["I", "II", "III", "IV", "V", "VI", "VII", "VIII"].map((sem) => {
                const step5Arr = Array.isArray(student.steps.step5) ? student.steps.step5 : [];
                const act = step5Arr.find((a: any) => a.semester === sem) || {};
                return (
                  <tr key={sem}>
                    <td>{sem}</td><td>{act.sports || "-"}</td><td>{act.coCurricular || "-"}</td><td>{act.extraCurricular || "-"}</td><td>{act.sna || "-"}</td><td>{act.nssYrcRrc || "-"}</td><td>{act.cne || "-"}</td><td>{act.awardsRewards || "-"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* 6. COURSE INSTRUCTION */}
        <h3 className="section-title no-print">6. COURSE INSTRUCTION</h3>
        {["I", "II", "III", "IV", "V", "VI", "VII", "VIII"].map((sem) => {
          const step6Arr = Array.isArray(student.steps.step6) ? student.steps.step6 : [];
          const courses = step6Arr.filter((c: any) => c.semester === sem) || [];
          if (courses.length === 0) return null;
          return (
            <div key={sem} className="course-instruction-print-page">
              <div className="course-instruction-rotate">
                <h4 className="subsection-title">Semester {sem}</h4>
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
              </div>
            </div>
          );
        })}

        {/* 7. Observational Visits */}
        <div className="print-section">
          <h3 className="section-title">7. Observational Visits</h3>
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

        {/* 8. Clinical Experience */}
        <div className="print-section">
          <h3 className="section-title">8. Clinical Experience</h3>
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

        {/* 9. Research Projects */}
        <div className="print-section">
          <h3 className="section-title">9. Research Projects</h3>
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

        {/* 10. Additional Courses */}
        <div className="print-section">
          <h3 className="section-title">10. Additional Courses</h3>
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

        {/* 11. Course Completion */}
        <div className="print-section">
          <h3 className="section-title">11. Course Completion</h3>
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

        {/* 12. VERIFICATION */}
        <div className="print-section">
          <h3 className="section-title">12. VERIFICATION</h3>
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