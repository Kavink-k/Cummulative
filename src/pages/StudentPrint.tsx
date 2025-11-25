import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer, Loader2 } from "lucide-react";
import { getAllDataByStudentId } from "@/lib/api";
import { EducationalMarksPrintTable } from "@/components/EducationalMarksPrintTable";
import "./StudentPrint.css";

const StudentPrint = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentData = async () => {
      if (!studentId) {
        navigate("/dashboard");
        return;
      }

      try {
        setLoading(true);
        const data = await getAllDataByStudentId(studentId);

        // Construct student object from backend data
        const studentData = {
          id: studentId,
          name: data.step1?.studentName || "Unknown",
          regNo: data.step1?.regNo || studentId,
          email: data.step1?.studentEmail || "",
          steps: data,
        };

        setStudent(studentData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching student data:", err);
        navigate("/dashboard");
      }
    };

    fetchStudentData();
  }, [studentId, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading student data for printing...</p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Student Not Found</h2>
          <Button onClick={() => navigate("/dashboard")}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <div className="no-print bg-background p-4 border-b sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between">
          <Button variant="outline" onClick={() => navigate(`/students/${studentId}`)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Print Report
          </Button>
        </div>
      </div>

      <div className="print-container">
        <div className="print-header">
          <div className="header-content">
            <div className="header-text">
              <h1>STUDENT CUMULATIVE RECORD</h1>
              <h2>B.Sc. Nursing Programme</h2>
              <div className="student-info">
                <p><strong>Name:</strong> {student.name}</p>
                <p><strong>Student ID:</strong> {student.id}</p>
                <p><strong>Registration No:</strong> {student.regNo}</p>
              </div>
            </div>
            {student.steps.step1?.photoUrl && (
              <div className="student-photo">
                <img
                  src={student.steps.step1.photoUrl.startsWith('http') ? student.steps.step1.photoUrl : `http://localhost:5000${student.steps.step1.photoUrl}`}
                  alt={student.name}
                />
              </div>
            )}
          </div>
        </div>

        {student.steps.step1 && (
          <div className="print-section">
            <h3 className="section-title">1. PERSONAL PROFILE</h3>
            <div className="profile-with-photo">
              <table className="info-table">
                <tbody>
                  <tr>
                    <td className="label">Name of Student</td>
                    <td className="value">{student.steps.step1.studentName}</td>
                    <td className="label">Age</td>
                    <td className="value">{student.steps.step1.age}</td>
                  </tr>
                  <tr>
                    <td className="label">Gender</td>
                    <td className="value">{student.steps.step1.gender}</td>
                    <td className="label">Date of Birth</td>
                    <td className="value">{student.steps.step1.dateOfBirth}</td>
                  </tr>
                  <tr>
                    <td className="label">Nationality</td>
                    <td className="value">{student.steps.step1.nationality}</td>
                    <td className="label">Religion</td>
                    <td className="value">{student.steps.step1.religion}</td>
                  </tr>
                  <tr>
                    <td className="label">Community</td>
                    <td className="value">{student.steps.step1.community}</td>
                    <td className="label">Nativity</td>
                    <td className="value">{student.steps.step1.nativity}</td>
                  </tr>
                  <tr>
                    <td className="label">Marital Status</td>
                    <td className="value">{student.steps.step1.maritalStatus}</td>
                    <td className="label">Mother Tongue</td>
                    <td className="value">{student.steps.step1.motherTongue}</td>
                  </tr>
                  <tr>
                    <td className="label">Parent/Guardian Name</td>
                    <td className="value" colSpan={3}>{student.steps.step1.parentGuardianName}</td>
                  </tr>
                  <tr>
                    <td className="label">Communication Address</td>
                    <td className="value" colSpan={3}>{student.steps.step1.communicationAddress}</td>
                  </tr>
                  <tr>
                    <td className="label">Permanent Address</td>
                    <td className="value" colSpan={3}>{student.steps.step1.permanentAddress}</td>
                  </tr>
                  <tr>
                    <td className="label">Contact Mobile</td>
                    <td className="value">{student.steps.step1.contactMobile}</td>
                    <td className="label">Email</td>
                    <td className="value">{student.steps.step1.studentEmail}</td>
                  </tr>
                  <tr>
                    <td className="label">Aadhar Number</td>
                    <td className="value">{student.steps.step1.aadharNo}</td>
                    <td className="label">EMIS Number</td>
                    <td className="value">{student.steps.step1.emisNo}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {student.steps.step2 && (
          <div className="print-section">
            <h3 className="section-title">2. EDUCATIONAL QUALIFICATION</h3>

            {/* Basic Information */}
            <table className="info-table">
              <tbody>
                <tr>
                  <td className="label">Stream/Group</td>
                  <td className="value">{student.steps.step2.streamGroup}</td>
                  <td className="label">Board of Examination</td>
                  <td className="value">{student.steps.step2.boardOfExamination}</td>
                </tr>
                <tr>
                  <td className="label">Year of Passing</td>
                  <td className="value">{student.steps.step2.yearOfPassing}</td>
                  <td className="label">Medium of Instruction</td>
                  <td className="value">{student.steps.step2.mediumOfInstruction}</td>
                </tr>
                <tr>
                  <td className="label">Certificate Number</td>
                  <td className="value">{student.steps.step2.certificateNo}</td>
                  <td className="label">Certificate Date</td>
                  <td className="value">{student.steps.step2.certificateDate}</td>
                </tr>
              </tbody>
            </table>

            {/* Marks Table */}
            {student.steps.step2.subjects && student.steps.step2.subjects.length > 0 && (
              <>
                <h4 className="subsection-title">Academic Performance</h4>
                <EducationalMarksPrintTable
                  subjects={student.steps.step2.subjects}
                  totalPlusOneAttempts={student.steps.step2.totalPlusOneAttempts || []}
                  totalPlusTwoAttempts={student.steps.step2.totalPlusTwoAttempts || []}
                />
              </>
            )}
          </div>
        )}

        {student.steps.step3 && (
          <div className="print-section">
            <h3 className="section-title">3. ADMISSION DETAILS</h3>
            <table className="info-table">
              <tbody>
                <tr>
                  <td className="label">Date of Admission</td>
                  <td className="value">{student.steps.step3.dateOfAdmission}</td>
                  <td className="label">Admission Number</td>
                  <td className="value">{student.steps.step3.admissionNumber}</td>
                </tr>
                <tr>
                  <td className="label">Roll Number</td>
                  <td className="value">{student.steps.step3.rollNumber}</td>
                  <td className="label">University Registration</td>
                  <td className="value">{student.steps.step3.universityRegistration}</td>
                </tr>
                <tr>
                  <td className="label">Allotment Category</td>
                  <td className="value">{student.steps.step3.allotmentCategory}</td>
                  <td className="label">Allotment Number</td>
                  <td className="value">{student.steps.step3.govtAllotmentNo || student.steps.step3.privateAllotmentNo || "-"}</td>
                </tr>
                {student.steps.step3.scholarshipSource && (
                  <tr>
                    <td className="label">Scholarship Source</td>
                    <td className="value">{student.steps.step3.scholarshipSource}</td>
                    <td className="label">Scholarship Amount</td>
                    <td className="value">₹{student.steps.step3.scholarshipAmount}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {student.steps.step4 && (
          <div className="print-section">
            <h3 className="section-title">4. ATTENDANCE RECORD</h3>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Semester</th>
                  <th>Working Days</th>
                  <th>Annual Leave</th>
                  <th>Sick Leave</th>
                  <th>Gazetted Holidays</th>
                  <th>Other Leave</th>
                </tr>
              </thead>
              <tbody>
                {student.steps.step4.semesters?.map((sem: any) => (
                  <tr key={sem.semester}>
                    <td>{sem.semester}</td>
                    <td>{sem.workingDays}</td>
                    <td>{sem.annualLeave}</td>
                    <td>{sem.sickLeave}</td>
                    <td>{sem.gazettedHolidays}</td>
                    <td>{sem.otherLeave}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {student.steps.step5 && (
          <div className="print-section">
            <h3 className="section-title">5. ACTIVITIES & PARTICIPATION</h3>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Semester</th>
                  <th>Sports</th>
                  <th>Co-Curricular</th>
                  <th>Extra-Curricular</th>
                  <th>NSS/YRC/RRC</th>
                  <th>Awards & Rewards</th>
                </tr>
              </thead>
              <tbody>
                {student.steps.step5.semesters?.map((sem: any) => (
                  <tr key={sem.semester}>
                    <td>{sem.semester}</td>
                    <td>{sem.sports}</td>
                    <td>{sem.coCurricular}</td>
                    <td>{sem.extraCurricular}</td>
                    <td>{sem.nssYrcRrc}</td>
                    <td>{sem.awardsRewards || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="print-footer">
          <p>This is a computer-generated document. No signature is required.</p>
          <p>Generated on: {new Date().toLocaleDateString("en-IN", {
            year: "numeric",
            month: "long",
            day: "numeric"
          })}</p>
        </div>
      </div>
    </>
  );
};

export default StudentPrint;
