import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Printer } from "lucide-react";
import { sampleStudents } from "@/data/sampleStudents";
import { getStudent } from "@/lib/data";

const StudentDetail = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();

  const student = sampleStudents.find(s => s.id === studentId) || getStudent(studentId || "");

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 p-8">
      <div className="container mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <Button variant="outline" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate(`/students/${studentId}/edit`)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Record
            </Button>
            <Button onClick={() => navigate(`/students/${studentId}/print`)}>
              <Printer className="h-4 w-4 mr-2" />
              Print Report
            </Button>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-2xl">{student.name}</CardTitle>
                <div className="flex gap-4 text-sm text-muted-foreground mt-2">
                  <span>ID: {student.id}</span>
                  <span>•</span>
                  <span>Reg No: {student.regNo}</span>
                  <span>•</span>
                  <span>{student.email}</span>
                </div>
              </div>
              {student.steps.step1?.photoUrl && (
                <div className="ml-4">
                  <img
                    src={student.steps.step1.photoUrl}
                    alt={student.name}
                    className="w-24 h-32 object-cover rounded-lg border-2 border-border shadow-md"
                  />
                </div>
              )}
            </div>
          </CardHeader>
        </Card>

        {student.steps.step1 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Personal Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-6">
                {/* Left side - Personal details */}
                <div className="flex-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DetailItem label="Name" value={student.steps.step1.studentName} />
                    <DetailItem label="Age" value={student.steps.step1.age} />
                    <DetailItem label="Gender" value={student.steps.step1.gender} />
                    <DetailItem label="Date of Birth" value={student.steps.step1.dateOfBirth} />
                    <DetailItem label="Nationality" value={student.steps.step1.nationality} />
                    <DetailItem label="Religion" value={student.steps.step1.religion} />
                    <DetailItem label="Community" value={student.steps.step1.community} />
                    <DetailItem label="Nativity" value={student.steps.step1.nativity} />
                    <DetailItem label="Marital Status" value={student.steps.step1.maritalStatus} />
                    <DetailItem label="Parent/Guardian" value={student.steps.step1.parentGuardianName} />
                    <DetailItem label="Mother Tongue" value={student.steps.step1.motherTongue} />
                    <DetailItem label="Mobile" value={student.steps.step1.contactMobile} />
                    <DetailItem label="Email" value={student.steps.step1.studentEmail} />
                    <DetailItem label="Aadhar No" value={student.steps.step1.aadharNo} />
                    <DetailItem label="EMIS No" value={student.steps.step1.emisNo} />
                    <DetailItem label="Medium" value={student.steps.step1.mediumOfInstruction} />
                  </div>
                </div>

                {/* Right side - Photo */}
                <div className="flex-shrink-0">
                  <img
                    src={student.steps.step1?.photoUrl || '/images/default-profile.svg'}
                    alt={student.name}
                    className="w-32 h-40 object-cover rounded-lg border-2 border-border shadow-md bg-muted"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <DetailItem label="Communication Address" value={student.steps.step1.communicationAddress} />
                <DetailItem label="Permanent Address" value={student.steps.step1.permanentAddress} />
              </div>
            </CardContent>
          </Card>
        )}

        {student.steps.step2 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Educational Qualification</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                <DetailItem label="Stream/Group" value={student.steps.step2.streamGroup} />
                <DetailItem label="Board" value={student.steps.step2.boardOfExamination} />
                <DetailItem label="Year of Passing" value={student.steps.step2.yearOfPassing} />
                <DetailItem label="Certificate No" value={student.steps.step2.certificateNo} />
                <DetailItem label="Certificate Date" value={student.steps.step2.certificateDate} />
                <DetailItem label="Medium" value={student.steps.step2.mediumOfInstruction} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Plus One Results</h4>
                  <DetailItem label="Total Max Marks" value={student.steps.step2.totalPlusOneMaxMarks} />
                  <DetailItem label="Total Score" value={student.steps.step2.totalPlusOneScore} />
                  <DetailItem label="Percentage" value={`${student.steps.step2.totalPlusOnePercentage}%`} />
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Plus Two Results</h4>
                  <DetailItem label="Total Max Marks" value={student.steps.step2.totalPlusTwoMaxMarks} />
                  <DetailItem label="Total Score" value={student.steps.step2.totalPlusTwoScore} />
                  <DetailItem label="Percentage" value={`${student.steps.step2.totalPlusTwoPercentage}%`} />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {student.steps.step3 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Admission Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <DetailItem label="Date of Admission" value={student.steps.step3.dateOfAdmission} />
                <DetailItem label="Admission Number" value={student.steps.step3.admissionNumber} />
                <DetailItem label="Roll Number" value={student.steps.step3.rollNumber} />
                <DetailItem label="University Registration" value={student.steps.step3.universityRegistration} />
                <DetailItem label="Allotment Category" value={student.steps.step3.allotmentCategory} />
                {student.steps.step3.govtAllotmentNo && (
                  <DetailItem label="Govt Allotment No" value={student.steps.step3.govtAllotmentNo} />
                )}
                {student.steps.step3.privateAllotmentNo && (
                  <DetailItem label="Private Allotment No" value={student.steps.step3.privateAllotmentNo} />
                )}
                {student.steps.step3.scholarshipSource && (
                  <DetailItem label="Scholarship Source" value={student.steps.step3.scholarshipSource} />
                )}
                {student.steps.step3.scholarshipAmount && (
                  <DetailItem label="Scholarship Amount" value={`₹${student.steps.step3.scholarshipAmount}`} />
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {student.steps.step4 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Attendance Record</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border p-2 text-left">Semester</th>
                      <th className="border p-2 text-left">Working Days</th>
                      <th className="border p-2 text-left">Annual Leave</th>
                      <th className="border p-2 text-left">Sick Leave</th>
                      <th className="border p-2 text-left">Gazetted Holidays</th>
                      <th className="border p-2 text-left">Other Leave</th>
                    </tr>
                  </thead>
                  <tbody>
                    {student.steps.step4.semesters?.map((sem: any) => (
                      <tr key={sem.semester}>
                        <td className="border p-2">{sem.semester}</td>
                        <td className="border p-2">{sem.workingDays}</td>
                        <td className="border p-2">{sem.annualLeave}</td>
                        <td className="border p-2">{sem.sickLeave}</td>
                        <td className="border p-2">{sem.gazettedHolidays}</td>
                        <td className="border p-2">{sem.otherLeave}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {student.steps.step5 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Activities & Participation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border p-2 text-left">Semester</th>
                      <th className="border p-2 text-left">Sports</th>
                      <th className="border p-2 text-left">Co-Curricular</th>
                      <th className="border p-2 text-left">Extra-Curricular</th>
                      <th className="border p-2 text-left">NSS/YRC/RRC</th>
                      <th className="border p-2 text-left">Awards</th>
                    </tr>
                  </thead>
                  <tbody>
                    {student.steps.step5.semesters?.map((sem: any) => (
                      <tr key={sem.semester}>
                        <td className="border p-2">{sem.semester}</td>
                        <td className="border p-2">{sem.sports}</td>
                        <td className="border p-2">{sem.coCurricular}</td>
                        <td className="border p-2">{sem.extraCurricular}</td>
                        <td className="border p-2">{sem.nssYrcRrc}</td>
                        <td className="border p-2">{sem.awardsRewards || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

const DetailItem = ({ label, value }: { label: string; value: string | undefined }) => (
  <div>
    <p className="text-sm text-muted-foreground">{label}</p>
    <p className="font-medium">{value || "-"}</p>
  </div>
);

export default StudentDetail;
