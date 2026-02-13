import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Printer, Loader2, CheckCircle, XCircle, Clock, ShieldCheck, UserPlus, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getAllDataByStudentId } from "@/lib/api";
import { EducationalMarksTable } from "@/components/EducationalMarksTable";

const StudentDetail = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (error || !student) {
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
                    src={student.steps.step1.photoUrl.startsWith('http') ? student.steps.step1.photoUrl : `${import.meta.env.VITE_BACKEND_URL}${student.steps.step1.photoUrl}`}
                    alt={student.name}
                    className="w-32 h-40 object-cover rounded-sm border-2 border-border shadow-md"
                    style={{ aspectRatio: '3/4' }}
                  />
                </div>
              )}
            </div>
          </CardHeader>
        </Card>

        {student.steps.step3 && (
          <Card className="mb-6">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Personal Profile</CardTitle>
              <div className="flex gap-2">
                {student.steps.step3.approvalStatus === 'APPROVED' ? (
                  <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                    <CheckCircle className="h-3 w-3 mr-1" /> Approved
                  </Badge>
                ) : student.steps.step3.approvalStatus === 'REJECTED' ? (
                  <Badge variant="destructive">
                    <XCircle className="h-3 w-3 mr-1" /> Rejected
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                    <Clock className="h-3 w-3 mr-1" /> Pending Approval
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-6">
                {/* Left side - Personal details */}
                <div className="flex-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DetailItem label="Name" value={student.steps.step3.studentName} />
                    <DetailItem label="Age" value={student.steps.step3.age} />
                    <DetailItem label="Gender" value={student.steps.step3.gender} />
                    <DetailItem label="Date of Birth" value={student.steps.step3.dateOfBirth} />
                    <DetailItem label="Nationality" value={student.steps.step3.nationality} />
                    <DetailItem label="Religion" value={student.steps.step3.religion} />
                    <DetailItem label="Community" value={student.steps.step3.community} />
                    <DetailItem label="Nativity" value={student.steps.step3.nativity} />
                    <DetailItem label="Marital Status" value={student.steps.step3.maritalStatus} />
                    <DetailItem label="Parent/Guardian" value={student.steps.step3.parentGuardianName} />
                    <DetailItem label="Mother Tongue" value={student.steps.step3.motherTongue} />
                    <DetailItem label="Mobile" value={student.steps.step3.contactMobile} />
                    <DetailItem label="Email" value={student.steps.step3.studentEmail} />
                    <DetailItem label="Aadhar No" value={student.steps.step3.aadharNo} />
                    <DetailItem label="EMIS No" value={student.steps.step3.emisNo} />
                    <DetailItem label="Medium" value={student.steps.step3.mediumOfInstruction} />
                  </div>
                </div>

                {/* Right side - Photo */}
                <div className="flex-shrink-0">
                  <img
                    src={
                      student.steps.step3?.photoUrl || student.steps.step3?.photo
                        ? ((student.steps.step3?.photoUrl || student.steps.step3?.photo).startsWith('http') ? (student.steps.step3?.photoUrl || student.steps.step3?.photo) : `${import.meta.env.VITE_BACKEND_URL}${student.steps.step3?.photoUrl || student.steps.step3?.photo}`)
                        : '/images/default-profile.svg'
                    }
                    alt={student.name}
                    className="w-40 h-52 object-cover rounded-sm border-4 border-border shadow-md bg-muted"
                    style={{ aspectRatio: '3/4' }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <DetailItem label="Communication Address" value={student.steps.step3.communicationAddress} />
                <DetailItem label="Permanent Address" value={student.steps.step3.permanentAddress} />
              </div>

              {/* AUDIT TRAIL */}
              <div className="mt-8 pt-6 border-t border-muted">
                <h4 className="text-sm font-semibold mb-4 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" /> Audit Trail
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-muted/30 p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <UserPlus className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider">Created By</p>
                      <p className="text-sm font-medium">
                        {student.steps.step3?.creator?.name || "System"}
                        {student.steps.step3?.creator?.designation && ` (${student.steps.step3.creator.designation})`}
                      </p>
                    </div>
                  </div>

                  {student.steps.step3?.approver && (
                    <div className="flex items-center gap-3">
                      <div className="bg-green-100 p-2 rounded-full">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider">Approved By</p>
                        <p className="text-sm font-medium">
                          {student.steps.step3.approver.name}
                          {student.steps.step3.approver.designation && ` (${student.steps.step3.approver.designation})`}
                        </p>
                      </div>
                    </div>
                  )}

                  {student.steps.step3?.editor && (
                    <div className="flex items-center gap-3">
                      <div className="bg-purple-100 p-2 rounded-full">
                        <Edit className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider">Last Edited By</p>
                        <p className="text-sm font-medium">
                          {student.steps.step3.editor.name}
                          {student.steps.step3.editor.designation && ` (${student.steps.step3.editor.designation})`}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {student.steps.step3?.editRequestReason && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                    <p className="text-[10px] uppercase text-blue-600 font-bold tracking-wider mb-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> Reason for Edit Request / Modification
                    </p>
                    <p className="text-sm text-blue-800 italic">
                      "{student.steps.step3.editRequestReason}"
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {student.steps.step4 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>4. Educational Qualification</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <DetailItem label="Stream/Group" value={student.steps.step4.streamGroup} />
                <DetailItem label="Board" value={student.steps.step4.boardOfExamination} />
                <DetailItem label="Year of Passing" value={student.steps.step4.yearOfPassing} />
                <DetailItem label="Certificate No" value={student.steps.step4.certificateNo} />
                <DetailItem label="Certificate Date" value={student.steps.step4.certificateDate} />
                <DetailItem label="Medium" value={student.steps.step4.mediumOfInstruction} />
              </div>

              {/* Marks Table */}
              {student.steps.step4.subjects && student.steps.step4.subjects.length > 0 ? (
                <div>
                  <h4 className="font-semibold mb-3">Marks Details</h4>
                  <EducationalMarksTable
                    subjects={student.steps.step4.subjects}
                    totalPlusOneAttempts={student.steps.step4.totalPlusOneAttempts || []}
                    totalPlusTwoAttempts={student.steps.step4.totalPlusTwoAttempts || []}
                  />
                </div>
              ) : (
                <p className="text-muted-foreground">No marks data available.</p>
              )}
            </CardContent>
          </Card>
        )}

        {student.steps.step5 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>5. Admission Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <DetailItem label="Date of Admission" value={student.steps.step5.dateOfAdmission} />
                <DetailItem label="Admission Number" value={student.steps.step5.admissionNumber} />
                <DetailItem label="Roll Number" value={student.steps.step5.rollNumber} />
                <DetailItem label="University Registration" value={student.steps.step5.universityRegistration} />
                <DetailItem label="Allotment Category" value={student.steps.step5.allotmentCategory} />
                {student.steps.step5.allotmentNo && (
                  <DetailItem
                    label={student.steps.step5.allotmentCategory === "government" ? "Govt Allotment No" : "Private Allotment No"}
                    value={student.steps.step5.allotmentNo}
                  />
                )}
                {student.steps.step5.allotmentDate && (
                  <DetailItem label="Allotment Order Date" value={student.steps.step5.allotmentDate} />
                )}
                {student.steps.step5.scholarshipSource && (
                  <DetailItem label="Scholarship Source" value={student.steps.step5.scholarshipSource} />
                )}
                {student.steps.step5.scholarshipAmount && (
                  <DetailItem label="Scholarship Amount" value={`₹${student.steps.step5.scholarshipAmount}`} />
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {student.steps.step6 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>6. Attendance Record</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto border rounded-lg">
                <table className="w-full border-collapse min-w-[800px]">
                  <thead>
                    <tr className="bg-muted text-xs md:text-sm">
                      <th className="border p-3 text-left font-semibold w-24">Semester</th>
                      <th className="border p-3 text-left font-semibold">Working Days</th>
                      <th className="border p-3 text-left font-semibold">Annual Leave</th>
                      <th className="border p-3 text-left font-semibold">Sick Leave</th>
                      <th className="border p-3 text-left font-semibold">Gazetted Holidays</th>
                      <th className="border p-3 text-left font-semibold">Other Leave</th>
                      <th className="border p-3 text-left font-semibold">Compensation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {student.steps.step6.semesters?.map((sem: any) => (
                      <tr key={sem.semester} className="hover:bg-muted/50">
                        <td className="border p-2 font-medium text-center bg-muted/20">{sem.semester}</td>
                        <td className="border p-2">{sem.workingDays || "-"}</td>
                        <td className="border p-2">{sem.annualLeave || "-"}</td>
                        <td className="border p-2">{sem.sickLeave || "-"}</td>
                        <td className="border p-2">{sem.gazettedHolidays || "-"}</td>
                        <td className="border p-2">{sem.otherLeave || "-"}</td>
                        <td className="border p-2">{sem.compensationDaysHours || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-muted-foreground italic mt-3">
                Note: Other Leave includes arrear study holidays, arrear examination leave, and important family functions.
              </p>
            </CardContent>
          </Card>
        )}

        {student.steps.step7 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>7. Activities & Participation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto border rounded-lg">
                <table className="w-full border-collapse min-w-[800px]">
                  <thead>
                    <tr className="bg-muted text-xs md:text-sm">
                      <th className="border p-3 text-left font-semibold w-24">Semester</th>
                      <th className="border p-3 text-left font-semibold">Sports</th>
                      <th className="border p-3 text-left font-semibold">Co-curricular</th>
                      <th className="border p-3 text-left font-semibold">Extra-curricular</th>
                      <th className="border p-3 text-left font-semibold">SNA</th>
                      <th className="border p-3 text-left font-semibold">NSS/YRC/RRC</th>
                      <th className="border p-3 text-left font-semibold">CNE</th>
                      <th className="border p-3 text-left font-semibold">Awards/Rewards</th>
                    </tr>
                  </thead>
                  <tbody>
                    {student.steps.step7.semesters?.map((sem: any) => (
                      <tr key={sem.semester} className="hover:bg-muted/50">
                        <td className="border p-2 font-medium text-center bg-muted/20">{sem.semester}</td>
                        <td className="border p-2">{sem.sports || "-"}</td>
                        <td className="border p-2">{sem.coCurricular || "-"}</td>
                        <td className="border p-2">{sem.extraCurricular || "-"}</td>
                        <td className="border p-2">{sem.sna || "-"}</td>
                        <td className="border p-2">{sem.nssYrcRrc || "-"}</td>
                        <td className="border p-2">{sem.cne || "-"}</td>
                        <td className="border p-2">{sem.awardsRewards || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {student.steps.step7 && student.steps.step7.visits && student.steps.step7.visits.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>7. Observational Visits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto border rounded-lg">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border p-3 text-left font-semibold">Semester</th>
                      <th className="border p-3 text-left font-semibold">Institution & Place</th>
                      <th className="border p-3 text-left font-semibold">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      const groupedVisits = student.steps.step7.visits.reduce((acc: any, visit: any) => {
                        if (!acc[visit.semester]) acc[visit.semester] = [];
                        acc[visit.semester].push(visit);
                        return acc;
                      }, {});
                      const semesterOrder = ["I", "II", "III", "IV", "V", "VI", "VII"];
                      return semesterOrder.map((semester) => {
                        const visits = groupedVisits[semester] || [];
                        return visits.map((visit: any, visitIndex: number) => (
                          <tr key={`${semester}-${visitIndex}`} className="hover:bg-muted/50">
                            {visitIndex === 0 && (
                              <td className="border p-2 font-medium text-center bg-muted/20" rowSpan={visits.length}>
                                {semester}
                              </td>
                            )}
                            <td className="border p-2 font-medium">{visit.institutionPlace}</td>
                            <td className="border p-2">{visit.date || "-"}</td>
                          </tr>
                        ));
                      });
                    })()}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {student.steps.step8 && student.steps.step8.records && student.steps.step8.records.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>8. Clinical Experience</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto border rounded-lg">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border p-3 text-left font-semibold">Semester</th>
                      <th className="border p-3 text-left font-semibold">Clinical Area</th>
                      <th className="border p-3 text-left font-semibold">Credits</th>
                      <th className="border p-3 text-left font-semibold">Prescribed Weeks</th>
                      <th className="border p-3 text-left font-semibold">Prescribed Hours</th>
                      <th className="border p-3 text-left font-semibold">Completed Hours</th>
                      <th className="border p-3 text-left font-semibold">Hospital/Community</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      const groupedRecords = student.steps.step8.records.reduce((acc: any, record: any) => {
                        if (!acc[record.semester]) acc[record.semester] = [];
                        acc[record.semester].push(record);
                        return acc;
                      }, {});
                      const semesterOrder = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];
                      return semesterOrder.map((semester) => {
                        const records = groupedRecords[semester] || [];
                        return records.map((record: any, recordIndex: number) => (
                          <tr key={`${semester}-${recordIndex}`} className="hover:bg-muted/50">
                            {recordIndex === 0 && (
                              <td className="border p-2 font-medium text-center bg-muted/20" rowSpan={records.length}>
                                {semester}
                              </td>
                            )}
                            <td className="border p-2 font-medium">{record.clinicalArea}</td>
                            <td className="border p-2 text-center">{record.credits}</td>
                            <td className="border p-2 text-center">{record.prescribedWeeks}</td>
                            <td className="border p-2 text-center">{record.prescribedHours}</td>
                            <td className="border p-2">{record.completedHours || "-"}</td>
                            <td className="border p-2">{record.hospital || "-"}</td>
                          </tr>
                        ));
                      });
                    })()}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {student.steps.step9 && student.steps.step9.projects && student.steps.step9.projects.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>9. Research Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto border rounded-lg">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border p-3 text-left font-semibold">Semester</th>
                      <th className="border p-3 text-left font-semibold">Area of Study/Discipline</th>
                      <th className="border p-3 text-left font-semibold">Group/Individual</th>
                      <th className="border p-3 text-left font-semibold">Project Title</th>
                    </tr>
                  </thead>
                  <tbody>
                    {student.steps.step9.projects.map((project: any, index: number) => (
                      <tr key={index} className="hover:bg-muted/50">
                        <td className="border p-2 font-medium text-center bg-muted/20">{project.semester}</td>
                        <td className="border p-2">{project.areaOfStudy}</td>
                        <td className="border p-2">{project.type}</td>
                        <td className="border p-2">{project.projectTitle}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {student.steps.step10 && student.steps.step10.courses && student.steps.step10.courses.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>10. Additional Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto border rounded-lg">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border p-3 text-left font-semibold w-24">Course ID</th>
                      <th className="border p-3 text-left font-semibold">Name of the Course</th>
                      <th className="border p-3 text-left font-semibold w-40">From</th>
                      <th className="border p-3 text-left font-semibold w-40">To</th>
                    </tr>
                  </thead>
                  <tbody>
                    {student.steps.step10.courses.map((course: any, index: number) => (
                      <tr key={index} className="hover:bg-muted/50">
                        <td className="border p-2 text-center font-semibold bg-muted/20">{course.courseId || index + 1}</td>
                        <td className="border p-2">{course.courseName}</td>
                        <td className="border p-2">{course.from || "-"}</td>
                        <td className="border p-2">{course.to || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {student.steps.step11 && student.steps.step11.completions && student.steps.step11.completions.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>11. Course Completion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto border rounded-lg">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border p-3 text-left font-semibold">Name of the Course</th>
                      <th className="border p-3 text-left font-semibold">Certificate Number</th>
                      <th className="border p-3 text-left font-semibold">Date of Issue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {student.steps.step11.completions.map((completion: any, index: number) => (
                      <tr key={index} className="hover:bg-muted/50">
                        <td className="border p-2 font-medium">{completion.courseName}</td>
                        <td className="border p-2">{completion.certificateNumber || "-"}</td>
                        <td className="border p-2">{completion.dateOfIssue || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-muted-foreground italic mt-3">
                Note: This records the course completion details and certificate information for various academic and professional documents.
              </p>
            </CardContent>
          </Card>
        )}

        {student.steps.step12 && student.steps.step12.verifications && student.steps.step12.verifications.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>12. Verification</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto border rounded-lg">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="border p-3 text-left font-semibold">Semester</th>
                      <th className="border p-3 text-left font-semibold">Name of Class Teacher/Coordinator</th>
                      <th className="border p-3 text-left font-semibold">Signature of Class Teacher with Date</th>
                      <th className="border p-3 text-left font-semibold">Signature of Principal with Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {student.steps.step12.verifications.map((verification: any, index: number) => (
                      <tr key={index} className="hover:bg-muted/30 transition-colors">
                        <td className="border p-3 font-medium">{verification.semester}</td>
                        <td className="border p-2">{verification.classTeacherName || "-"}</td>
                        <td className="border p-2">{verification.teacherSignature || "-"}</td>
                        <td className="border p-2">{verification.principalSignature || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-muted-foreground italic mt-3">
                Note: This records the verification of cumulative records by class teachers/coordinators and the principal for each semester.
              </p>
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
