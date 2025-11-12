import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer } from "lucide-react";
import { sampleStudents } from "@/data/sampleStudents";
import { getStudent } from "@/lib/data";
import "./StudentPrint.css";

const StudentPrint = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();

  const student = sampleStudents.find(s => s.id === studentId) || getStudent(studentId || "");

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
                  src={student.steps.step1.photoUrl} 
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
              <div className="profile-photo">
                <img 
                  src={student.steps.step1?.photoUrl || '/images/default-profile.svg'} 
                  alt={student.name}
                />
              </div>
            </div>
          </div>
        )}

        {student.steps.step2 && (
          <div className="print-section">
            <h3 className="section-title">2. EDUCATIONAL QUALIFICATION</h3>
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

            <h4 className="subsection-title">Academic Performance</h4>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Class</th>
                  <th>Total Max Marks</th>
                  <th>Total Score</th>
                  <th>Percentage</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Plus One</td>
                  <td>{student.steps.step2.totalPlusOneMaxMarks}</td>
                  <td>{student.steps.step2.totalPlusOneScore}</td>
                  <td>{student.steps.step2.totalPlusOnePercentage}%</td>
                </tr>
                <tr>
                  <td>Plus Two</td>
                  <td>{student.steps.step2.totalPlusTwoMaxMarks}</td>
                  <td>{student.steps.step2.totalPlusTwoScore}</td>
                  <td>{student.steps.step2.totalPlusTwoPercentage}%</td>
                </tr>
              </tbody>
            </table>
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
