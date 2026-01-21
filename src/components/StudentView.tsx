import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Printer } from "lucide-react";
import { getAllDataByStudentId } from "@/lib/api";
import { EducationalMarksTable } from "@/components/EducationalMarksTable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

/* -------------------------------------------------------------------------- */
/*               Dedicated component for Course Instruction view             */
/* -------------------------------------------------------------------------- */
const CourseInstructionView = ({ data }: { data: any[] }) => {
  const [selectedSemester, setSelectedSemester] = useState("I");

  // Filter courses for the selected semester
  const semesterCourses = Array.isArray(data)
    ? data.filter((item: any) => item.semester === selectedSemester)
    : [];

  // Separate actual courses from total/summary rows
  const actualCourses = semesterCourses.filter(
    (c: any) =>
      c.sNo && // real courses have sNo
      !c.courseTitle?.includes("SEMESTER -") &&
      !c.courseTitle?.includes("Self-study") &&
      !c.courseTitle?.includes("Elective")
  );

  const totalRow = semesterCourses.find((c: any) =>
    c.courseTitle?.includes(`SEMESTER - ${selectedSemester}`)
  );

  const selfStudyRow = semesterCourses.find((c: any) =>
    c.courseTitle?.includes("Self-study")
  );

  const electiveRow = semesterCourses.find((c: any) =>
    c.courseTitle?.includes("Elective")
  );

  // Calculate totals from actual courses (fallback to DB total row if needed)
  let totalTheoryCredits = 0,
    totalSkillLabCredits = 0,
    totalClinicalCredits = 0,
    totalTheoryPrescribed = 0,
    totalTheoryAttended = 0,
    totalTheoryPercentage = 0,
    totalSkillLabPrescribed = 0,
    totalSkillLabAttended = 0,
    totalSkillLabPercentage = 0,
    totalClinicalPrescribed = 0,
    totalClinicalAttended = 0,
    totalClinicalPercentage = 0;

  actualCourses.forEach((c: any) => {
    totalTheoryCredits += Number(c.theoryCredits || 0);
    totalSkillLabCredits += Number(c.skillLabCredits || 0);
    totalClinicalCredits += Number(c.clinicalCredits || 0);
    totalTheoryPrescribed += Number(c.theoryPrescribed || 0);
    totalTheoryAttended += Number(c.theoryAttended || 0);
    totalSkillLabPrescribed += Number(c.skillLabPrescribed || 0);
    totalSkillLabAttended += Number(c.skillLabAttended || 0);
    totalClinicalPrescribed += Number(c.clinicalPrescribed || 0);
    totalClinicalAttended += Number(c.clinicalAttended || 0);
  });

  // Add elective if present
  if (electiveRow) {
    totalTheoryCredits += Number(electiveRow.theoryCredits || 0);
    totalTheoryPrescribed += Number(electiveRow.theoryPrescribed || 0);
    totalTheoryAttended += Number(electiveRow.theoryAttended || 0);
  }

  // If DB already has total row, use it as fallback/override
  if (totalRow) {
    totalTheoryCredits = Number(totalRow.theoryCredits) || totalTheoryCredits;
    totalSkillLabCredits = Number(totalRow.skillLabCredits) || totalSkillLabCredits;
    totalClinicalCredits = Number(totalRow.clinicalCredits) || totalClinicalCredits;
    totalTheoryPrescribed = Number(totalRow.theoryPrescribed) || totalTheoryPrescribed;
    totalSkillLabPrescribed = Number(totalRow.skillLabPrescribed) || totalSkillLabPrescribed;
    totalClinicalPrescribed = Number(totalRow.clinicalPrescribed) || totalClinicalPrescribed;
  }

  if (actualCourses.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <label className="font-semibold">Select Semester:</label>
          <Select value={selectedSemester} onValueChange={setSelectedSemester}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {["I", "II", "III", "IV", "V", "VI", "VII", "VIII"].map((s) => (
                <SelectItem key={s} value={s}>Semester {s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <p className="text-muted-foreground">No course records found for Semester {selectedSemester}.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <label className="font-semibold">Select Semester:</label>
        <Select value={selectedSemester} onValueChange={setSelectedSemester}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {["I", "II", "III", "IV", "V", "VI", "VII", "VIII"].map((s) => (
              <SelectItem key={s} value={s}>Semester {s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            {/* Row 1: Main Categories */}
            <TableRow className="bg-muted/50 text-xs">
              <TableHead rowSpan={4} className="border-r text-center align-middle min-w-[40px]">S.No</TableHead>
              <TableHead rowSpan={4} className="border-r text-center align-middle min-w-[100px]">Course Code</TableHead>
              <TableHead rowSpan={4} className="border-r text-center align-middle min-w-[150px]">University Course Code</TableHead>
              <TableHead rowSpan={4} className="border-r text-center align-middle min-w-[200px]">Course Title</TableHead>
              <TableHead colSpan={3} className="border-r text-center">Credits</TableHead>
              <TableHead colSpan={9} className="border-r text-center">Course Instruction Hours</TableHead>
              <TableHead colSpan={12} className="border-r text-center">Marks Obtained</TableHead>
              <TableHead rowSpan={4} className="border-r text-center align-middle min-w-[80px]">Grade Point</TableHead>
              <TableHead rowSpan={4} className="border-r text-center align-middle min-w-[80px]">Letter Grade</TableHead>
              <TableHead rowSpan={4} className="border-r text-center align-middle min-w-[80px]">SGPA</TableHead>
              <TableHead rowSpan={4} className="border-r text-center align-middle min-w-[80px]">Rank</TableHead>
            </TableRow>

            {/* Row 2: Sub-categories */}
            <TableRow className="bg-muted/50 text-xs">
              <TableHead rowSpan={3} className="border-r text-center align-middle">Theory</TableHead>
              <TableHead rowSpan={3} className="border-r text-center align-middle">Skill Lab</TableHead>
              <TableHead rowSpan={3} className="border-r text-center align-middle">Clinical</TableHead>
              <TableHead colSpan={3} className="border-r text-center">Theory</TableHead>
              <TableHead colSpan={3} className="border-r text-center">Skill Lab</TableHead>
              <TableHead colSpan={3} className="border-r text-center">Clinical</TableHead>
              <TableHead colSpan={6} className="border-r text-center">Theory</TableHead>
              <TableHead colSpan={6} className="border-r text-center">Practical</TableHead>
            </TableRow>

            {/* Row 3: Prescribed/Attended/% */}
            <TableRow className="bg-muted/50 text-xs">
              <TableHead rowSpan={2} className="border-r text-center align-middle">Prescribed</TableHead>
              <TableHead rowSpan={2} className="border-r text-center align-middle">Attended</TableHead>
              <TableHead rowSpan={2} className="border-r text-center align-middle">%</TableHead>
              <TableHead rowSpan={2} className="border-r text-center align-middle">Prescribed</TableHead>
              <TableHead rowSpan={2} className="border-r text-center align-middle">Attended</TableHead>
              <TableHead rowSpan={2} className="border-r text-center align-middle">%</TableHead>
              <TableHead rowSpan={2} className="border-r text-center align-middle">Prescribed</TableHead>
              <TableHead rowSpan={2} className="border-r text-center align-middle">Attended</TableHead>
              <TableHead rowSpan={2} className="border-r text-center align-middle">%</TableHead>
              <TableHead colSpan={2} className="border-r text-center">Internal</TableHead>
              <TableHead colSpan={2} className="border-r text-center">End Sem</TableHead>
              <TableHead colSpan={2} className="border-r text-center">Total</TableHead>
              <TableHead colSpan={2} className="border-r text-center">Internal</TableHead>
              <TableHead colSpan={2} className="border-r text-center">End Sem</TableHead>
              <TableHead colSpan={2} className="border-r text-center">Total</TableHead>
            </TableRow>

            {/* Row 4: Max/Obt */}
            <TableRow className="bg-muted/50 text-xs">
              <TableHead className="border-r text-center">Max</TableHead>
              <TableHead className="border-r text-center">Obt</TableHead>
              <TableHead className="border-r text-center">Max</TableHead>
              <TableHead className="border-r text-center">Obt</TableHead>
              <TableHead className="border-r text-center">Max</TableHead>
              <TableHead className="border-r text-center">Obt</TableHead>
              <TableHead className="border-r text-center">Max</TableHead>
              <TableHead className="border-r text-center">Obt</TableHead>
              <TableHead className="border-r text-center">Max</TableHead>
              <TableHead className="border-r text-center">Obt</TableHead>
              <TableHead className="border-r text-center">Max</TableHead>
              <TableHead className="border-r text-center">Obt</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {/* Self-study row if present */}
            {selfStudyRow && (
              <TableRow className="bg-gray-50 text-sm">
                <TableCell className="border-r"></TableCell>
                <TableCell className="border-r">{selfStudyRow.courseCode || "-"}</TableCell>
                <TableCell className="border-r">{selfStudyRow.universityCourseCode || "-"}</TableCell>
                <TableCell className="border-r italic">{selfStudyRow.courseTitle || "-"}</TableCell>
                <TableCell className="border-r"></TableCell>
                <TableCell className="border-r"></TableCell>
                <TableCell className="border-r"></TableCell>
                <TableCell className="border-r text-center">{selfStudyRow.theoryPrescribed || "-"}</TableCell>
                <TableCell colSpan={28} className="border-r text-muted-foreground text-center">Self-study / Co-curricular</TableCell>
              </TableRow>
            )}

            {/* Elective row if present */}
            {electiveRow && (
              <TableRow className="bg-gray-50 text-sm">
                <TableCell className="border-r"></TableCell>
                <TableCell className="border-r">{electiveRow.courseCode || "-"}</TableCell>
                <TableCell className="border-r">{electiveRow.universityCourseCode || "-"}</TableCell>
                <TableCell className="border-r italic">{electiveRow.courseTitle || "-"}</TableCell>
                <TableCell className="border-r text-center">{electiveRow.theoryCredits || "-"}</TableCell>
                <TableCell className="border-r"></TableCell>
                <TableCell className="border-r"></TableCell>
                <TableCell className="border-r text-center">{electiveRow.theoryPrescribed || "-"}</TableCell>
                <TableCell className="border-r text-center">{electiveRow.theoryAttended || "-"}</TableCell>
                <TableCell className="border-r text-center">{electiveRow.theoryPercentage || "-"}</TableCell>
                <TableCell colSpan={9} className="border-r text-center">-</TableCell>
                <TableCell className="border-r"></TableCell>
                <TableCell className="border-r"></TableCell>
                <TableCell className="border-r text-center">{electiveRow.theoryEndSemMax || "-"}</TableCell>
                <TableCell className="border-r text-center">{electiveRow.theoryEndSemObtained || "-"}</TableCell>
                <TableCell className="border-r text-center">{electiveRow.theoryTotalMax || "-"}</TableCell>
                <TableCell className="border-r text-center">{electiveRow.theoryTotalObtained || "-"}</TableCell>
                <TableCell colSpan={6} className="border-r text-center">-</TableCell>
                <TableCell className="border-r"></TableCell>
                <TableCell className="border-r"></TableCell>
                <TableCell className="border-r"></TableCell>
                <TableCell className="border-r"></TableCell>
              </TableRow>
            )}

            {/* Actual courses */}
            {actualCourses.map((c: any, idx: number) => (
              <TableRow key={c.id || idx} className="text-sm hover:bg-muted/30">
                <TableCell className="border-r text-center">{c.sNo || idx + 1}</TableCell>
                <TableCell className="border-r text-center font-medium">{c.courseCode || "-"}</TableCell>
                <TableCell className="border-r text-center">{c.universityCourseCode || "-"}</TableCell>
                <TableCell className="border-r pl-2">{c.courseTitle || "-"}</TableCell>

                {/* Credits */}
                <TableCell className="border-r text-center">{c.theoryCredits || "-"}</TableCell>
                <TableCell className="border-r text-center">{c.skillLabCredits || "-"}</TableCell>
                <TableCell className="border-r text-center">{c.clinicalCredits || "-"}</TableCell>

                {/* Instruction Hours - Theory */}
                <TableCell className="border-r text-center">{c.theoryPrescribed || "-"}</TableCell>
                <TableCell className="border-r text-center">{c.theoryAttended || "-"}</TableCell>
                <TableCell className="border-r text-center">{c.theoryPercentage || "-"}</TableCell>

                {/* Skill Lab */}
                <TableCell className="border-r text-center">{c.skillLabPrescribed || "-"}</TableCell>
                <TableCell className="border-r text-center">{c.skillLabAttended || "-"}</TableCell>
                <TableCell className="border-r text-center">{c.skillLabPercentage || "-"}</TableCell>

                {/* Clinical */}
                <TableCell className="border-r text-center">{c.clinicalPrescribed || "-"}</TableCell>
                <TableCell className="border-r text-center">{c.clinicalAttended || "-"}</TableCell>
                <TableCell className="border-r text-center">{c.clinicalPercentage || "-"}</TableCell>

                {/* Marks - Theory Internal */}
                <TableCell className="border-r text-center">{c.theoryInternalMax || "-"}</TableCell>
                <TableCell className="border-r text-center">{c.theoryInternalObtained || "-"}</TableCell>

                {/* Theory End Sem */}
                <TableCell className="border-r text-center">{c.theoryEndSemMax || "-"}</TableCell>
                <TableCell className="border-r text-center">{c.theoryEndSemObtained || "-"}</TableCell>

                {/* Theory Total */}
                <TableCell className="border-r text-center">{c.theoryTotalMax || "-"}</TableCell>
                <TableCell className="border-r text-center">{c.theoryTotalObtained || "-"}</TableCell>

                {/* Practical Internal */}
                <TableCell className="border-r text-center">{c.practicalInternalMax || "-"}</TableCell>
                <TableCell className="border-r text-center">{c.practicalInternalObtained || "-"}</TableCell>

                {/* Practical End Sem */}
                <TableCell className="border-r text-center">{c.practicalEndSemMax || "-"}</TableCell>
                <TableCell className="border-r text-center">{c.practicalEndSemObtained || "-"}</TableCell>

                {/* Practical Total */}
                <TableCell className="border-r text-center">{c.practicalTotalMax || "-"}</TableCell>
                <TableCell className="border-r text-center">{c.practicalTotalObtained || "-"}</TableCell>

                {/* Grading */}
                <TableCell className="border-r text-center">{c.gradePoint || "-"}</TableCell>
                <TableCell className="border-r text-center">{c.letterGrade || "-"}</TableCell>
                <TableCell className="border-r text-center">{c.sgpa || "-"}</TableCell>
                <TableCell className="border-r text-center">{c.rank || "-"}</TableCell>
              </TableRow>
            ))}

            {/* Final Total Row */}
            <TableRow className="bg-muted font-bold text-sm">
              <TableCell colSpan={4} className="border-r text-left pl-4">
                SEMESTER - {selectedSemester}
              </TableCell>
              <TableCell className="border-r text-center">{totalTheoryCredits}</TableCell>
              <TableCell className="border-r text-center">{totalSkillLabCredits}</TableCell>
              <TableCell className="border-r text-center">{totalClinicalCredits}</TableCell>
              <TableCell className="border-r text-center">{totalTheoryPrescribed}</TableCell>
              <TableCell className="border-r text-center">{totalTheoryAttended || "-"}</TableCell>
              <TableCell className="border-r text-center">{totalTheoryPercentage || "-"}</TableCell>
              <TableCell className="border-r text-center">{totalSkillLabPrescribed}</TableCell>
              <TableCell className="border-r text-center">{totalSkillLabAttended || "-"}</TableCell>
              <TableCell className="border-r text-center">{totalSkillLabPercentage || "-"}</TableCell>
              <TableCell className="border-r text-center">{totalClinicalPrescribed}</TableCell>
              <TableCell className="border-r text-center">{totalClinicalAttended || "-"}</TableCell>
              <TableCell className="border-r text-center">{totalClinicalPercentage || "-"}</TableCell>
              <TableCell colSpan={12} className="border-r text-center">-</TableCell>
              <TableCell className="border-r text-center">-</TableCell>
              <TableCell className="border-r text-center">-</TableCell>
              <TableCell className="border-r text-center">-</TableCell>
              <TableCell className="border-r text-center">-</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <p className="text-xs text-muted-foreground italic">
        Note: Fill in marks and attendance for the selected semester.
      </p>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                               Main Component                               */
/* -------------------------------------------------------------------------- */
const StudentView = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const FILTER_KEYS = ["id", "createdAt", "updatedAt", "regNo"];

  const filterData = (obj: any) => {
    if (!obj) return null;

    if (Array.isArray(obj)) {
      return obj.map(item => filterData(item));
    }

    let clean: any = {};
    for (const key in obj) {
      if (!FILTER_KEYS.includes(key)) {
        clean[key] = obj[key];
      }
    }
    return clean;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAllDataByStudentId(studentId!);
        console.log("VIEW PAGE DATA:", res);
        setData(res);
      } catch (err) {
        console.error("View error:", err);
      }
      setLoading(false);
    };

    fetchData();
  }, [studentId]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!data) return <p className="text-center mt-10">No student data found.</p>;

  const tabs = [
    { id: "step1", title: "1. Personal Profile" },
    { id: "step2", title: "2. Educational Qualification" },
    { id: "step3", title: "3. Admission Details" },
    { id: "step4", title: "4. Attendance" },
    { id: "step5", title: "5. Activities" },
    { id: "step6", title: "6. Course Instruction" },
    { id: "step7", title: "7. Observational Visits" },
    { id: "step8", title: "8. Clinical Experience" },
    { id: "step9", title: "9. Research Projects" },
    { id: "step10", title: "10. Additional Courses" },
    { id: "step11", title: "11. Course Completion" },
    { id: "step12", title: "12. Verification" },
  ];

  const renderObject = (obj: any) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Object.entries(obj).map(([key, value]) => (
        <div key={key} className="p-3 border rounded-md bg-muted">
          <p className="font-semibold capitalize">{key.replace(/([A-Z])/g, " $1")}</p>
          <p className="text-sm text-muted-foreground">{String(value) || "-"}</p>
        </div>
      ))}
    </div>
  );

  const renderSection = (section: any, stepId?: string) => {
    if (!section) return <p className="text-muted-foreground">No data available.</p>;

    // === COURSE INSTRUCTION - STEP 6 ===
    if (stepId === "step6") {
      return <CourseInstructionView data={section} />;
    }

    // === OBSERVATIONAL VISITS - STEP 7 ===
    if (stepId === "step7") {
      // Handle both array format and {visits: []} format
      const visits = Array.isArray(section) ? section : (section?.visits || []);

      if (visits.length === 0) {
        return <p className="text-muted-foreground">No observational visits recorded.</p>;
      }

      // Group visits by semester
      const groupedVisits = visits.reduce((acc, visit) => {
        if (!acc[visit.semester]) {
          acc[visit.semester] = [];
        }
        acc[visit.semester].push(visit);
        return acc;
      }, {} as Record<string, any[]>);

      const semesterOrder = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];

      return (
        <div className="overflow-x-auto border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted">
                <TableHead className="border text-left font-semibold p-3">Semester</TableHead>
                <TableHead className="border text-left font-semibold p-3">Institution & Place</TableHead>
                <TableHead className="border text-left font-semibold p-3">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {semesterOrder.map((semester) => {
                const semesterVisits = groupedVisits[semester] || [];
                if (semesterVisits.length === 0) {
                  return (
                    <TableRow key={semester} className="hover:bg-muted/50">
                      <TableCell className="border p-2 font-medium text-center bg-muted/20">{semester}</TableCell>
                      <TableCell className="border p-2">-</TableCell>
                      <TableCell className="border p-2">-</TableCell>
                    </TableRow>
                  );
                }

                return semesterVisits.map((visit, visitIndex) => (
                  <TableRow key={`${semester}-${visitIndex}`} className="hover:bg-muted/50">
                    {visitIndex === 0 && (
                      <TableCell
                        rowSpan={semesterVisits.length}
                        className="border p-2 font-medium text-center bg-muted/20"
                      >
                        {semester}
                      </TableCell>
                    )}
                    <TableCell className="border p-2">{visit.institutionPlace || "-"}</TableCell>
                    <TableCell className="border p-2">{visit.date || "-"}</TableCell>
                  </TableRow>
                ));
              })}
            </TableBody>
          </Table>
        </div>
      );
    }

    // === CLINICAL EXPERIENCE - STEP 8 ===
    if (stepId === "step8") {
      // Handle both array format and {records: []} format
      const records = Array.isArray(section) ? section : (section?.records || []);

      if (records.length === 0) {
        return <p className="text-muted-foreground">No clinical experience recorded.</p>;
      }

      // Group records by semester
      const groupedRecords = records.reduce((acc, record) => {
        if (!acc[record.semester]) {
          acc[record.semester] = [];
        }
        acc[record.semester].push(record);
        return acc;
      }, {} as Record<string, any[]>);

      const semesterOrder = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];

      return (
        <div className="overflow-x-auto border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted">
                <TableHead className="border text-left font-semibold p-3">Semester</TableHead>
                <TableHead className="border text-left font-semibold p-3">Clinical Area</TableHead>
                <TableHead className="border text-left font-semibold p-3">Credits</TableHead>
                <TableHead className="border text-left font-semibold p-3">Prescribed Weeks</TableHead>
                <TableHead className="border text-left font-semibold p-3">Prescribed Hours</TableHead>
                <TableHead className="border text-left font-semibold p-3">Completed Hours</TableHead>
                <TableHead className="border text-left font-semibold p-3">Hospital/Community</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {semesterOrder.map((semester) => {
                const semesterRecords = groupedRecords[semester] || [];
                if (semesterRecords.length === 0) {
                  return (
                    <TableRow key={semester} className="hover:bg-muted/50">
                      <TableCell className="border p-2 font-medium text-center bg-muted/20">{semester}</TableCell>
                      <TableCell className="border p-2">-</TableCell>
                      <TableCell className="border p-2">-</TableCell>
                      <TableCell className="border p-2">-</TableCell>
                      <TableCell className="border p-2">-</TableCell>
                      <TableCell className="border p-2">-</TableCell>
                      <TableCell className="border p-2">-</TableCell>
                    </TableRow>
                  );
                }

                return semesterRecords.map((record, recordIndex) => (
                  <TableRow key={`${semester}-${recordIndex}`} className="hover:bg-muted/50">
                    {recordIndex === 0 && (
                      <TableCell
                        rowSpan={semesterRecords.length}
                        className="border p-2 font-medium text-center bg-muted/20"
                      >
                        {semester}
                      </TableCell>
                    )}
                    <TableCell className="border p-2">{record.clinicalArea || "-"}</TableCell>
                    <TableCell className="border p-2">{record.credits || "-"}</TableCell>
                    <TableCell className="border p-2">{record.prescribedWeeks || "-"}</TableCell>
                    <TableCell className="border p-2">{record.prescribedHours || "-"}</TableCell>
                    <TableCell className="border p-2">{record.completedHours || "-"}</TableCell>
                    <TableCell className="border p-2">{record.hospital || "-"}</TableCell>
                  </TableRow>
                ));
              })}
            </TableBody>
          </Table>
        </div>
      );
    }

    // === RESEARCH PROJECTS - STEP 9 ===
    if (stepId === "step9") {
      // Handle both array format and {projects: []} format
      const projects = Array.isArray(section) ? section : (section?.projects || []);

      if (projects.length === 0) {
        return <p className="text-muted-foreground">No research projects recorded.</p>;
      }

      // Sort projects by semester for consistent order
      const sortedProjects = [...projects].sort((a, b) => {
        const semA = a.semester || "";
        const semB = b.semester || "";
        return semA.localeCompare(semB);
      });

      return (
        <div className="overflow-x-auto border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted">
                <TableHead className="border text-left font-semibold p-3">Semester</TableHead>
                <TableHead className="border text-left font-semibold p-3">Area of Study/Discipline</TableHead>
                <TableHead className="border text-left font-semibold p-3">Group/Individual</TableHead>
                <TableHead className="border text-left font-semibold p-3">Project Title</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedProjects.map((project, index) => (
                <TableRow key={index} className="hover:bg-muted/50">
                  <TableCell className="border p-2">{project.semester || "-"}</TableCell>
                  <TableCell className="border p-2">{project.areaOfStudy || "-"}</TableCell>
                  <TableCell className="border p-2">{project.type || "-"}</TableCell>
                  <TableCell className="border p-2">{project.projectTitle || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      );
    }

    // === ADDITIONAL COURSES - STEP 10 ===
    if (stepId === "step10") {
      const courses = section?.courses || (Array.isArray(section) ? section : []);

      if (courses.length === 0) {
        return <p className="text-muted-foreground">No additional courses recorded.</p>;
      }

      return (
        <div className="overflow-x-auto border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted">
                <TableHead className="border text-left font-semibold p-3">Course ID</TableHead>
                <TableHead className="border text-left font-semibold p-3">Name of the Course</TableHead>
                <TableHead className="border text-left font-semibold p-3">From</TableHead>
                <TableHead className="border text-left font-semibold p-3">To</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((course, index) => (
                <TableRow key={course.id || index} className="hover:bg-muted/50">
                  <TableCell className="border p-2">{course.courseId || index + 1}</TableCell>
                  <TableCell className="border p-2">{course.courseName || "-"}</TableCell>
                  <TableCell className="border p-2">{course.from || "-"}</TableCell>
                  <TableCell className="border p-2">{course.to || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      );
    }

    // === COURSE COMPLETION - STEP 11 ===
    if (stepId === "step11") {
      const completions = Array.isArray(section?.completions) ? section.completions : [];

      // Define the exact order and labels to display
      const certificateOrder = [
        "Name of the Certificate",
        "Course completion certificate",
        "Transfer certificate",
        "Provisional certificate",
        "Degree certificate",
        "Nursing registration certificate",
        "TNAI card"
      ];

      // Helper to format date (convert ISO string to dd/mm/yyyy)
      const formatDate = (dateString: string | null) => {
        if (!dateString) return "-";
        try {
          const date = new Date(dateString);
          if (isNaN(date.getTime())) return "-";
          return date.toLocaleDateString("en-GB"); // dd/mm/yyyy
        } catch {
          return "-";
        }
      };

      // Map data by courseName
      const completionMap = new Map();
      completions.forEach((item: any) => {
        if (item.courseName) {
          completionMap.set(item.courseName, {
            certificateNumber: item.certificateNumber || "-",
            dateOfIssue: formatDate(item.dateOfIssue)
          });
        }
      });

      return (
        <div className="space-y-6">
          <div className="overflow-x-auto border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Name of the Course</TableHead>
                  <TableHead className="font-semibold text-center">Certificate Number</TableHead>
                  <TableHead className="font-semibold text-center">Date of Issue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {certificateOrder.map((certName) => {
                  const data = completionMap.get(certName) || { certificateNumber: "-", dateOfIssue: "-" };
                  return (
                    <TableRow key={certName} className="hover:bg-muted/30">
                      <TableCell className="font-medium">{certName}</TableCell>
                      <TableCell className="text-center">{data.certificateNumber}</TableCell>
                      <TableCell className="text-center">{data.dateOfIssue}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          <p className="text-xs text-muted-foreground italic">
            Note: This form records the course completion details and certificate information for various academic and professional documents.
          </p>
        </div>
      );
    }

    // === VERIFICATION - STEP 12 ===
    if (stepId === "step12") {
      // Handle both array format and {verifications: []} format
      const verifications = Array.isArray(section) ? section : (section?.verifications || []);

      if (verifications.length === 0) {
        return <p className="text-muted-foreground">No verification records available.</p>;
      }

      // Create a map: semester → record
      const verificationMap = new Map<string, any>();
      verifications.forEach((v: any) => {
        if (v.semester) {
          verificationMap.set(v.semester, v);
        }
      });

      const semesterOrder = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];

      const formatDate = (dateStr: string | null) => {
        if (!dateStr) return "-";
        const date = new Date(dateStr);
        return isNaN(date.getTime()) ? "-" : date.toLocaleDateString("en-GB");
      };

      return (
        <div className="space-y-6">
          <div className="overflow-x-auto border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold text-center w-20">Semester</TableHead>
                  <TableHead className="font-semibold">Name of Class Teacher/Coordinator</TableHead>
                  <TableHead className="font-semibold text-center">Signature of Class Teacher with Date</TableHead>
                  <TableHead className="font-semibold text-center">Signature of Principal with Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {semesterOrder.map((sem) => {
                  const record = verificationMap.get(sem) || {};

                  return (
                    <TableRow key={sem} className="hover:bg-muted/30">
                      <TableCell className="font-medium text-center font-bold text-lg">
                        {sem}
                      </TableCell>
                      <TableCell className="font-medium">
                        {record.teacherName || record.classTeacherName || "-"}
                      </TableCell>
                      <TableCell className="text-center">
                        {record.teacherSignature
                          ? formatDate(record.teacherSignature)
                          : "-"}
                        {/* {record.teacherSignature && (
                          <span className="ml-2 inline-block w-8 h-8 border-b-2 border-gray-600"></span>
                        )} */}
                      </TableCell>
                      <TableCell className="text-center">
                        {record.principalSignature
                          ? formatDate(record.principalSignature)
                          : "-"}
                        {/* {record.principalSignatureDate && (
                          <span className="ml-2 inline-block w-8 h-8 border-b-2 border-gray-600"></span>
                        )} */}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          <p className="text-xs text-muted-foreground italic text-center">
            Note: This form records the verification of cumulative records by class teachers/coordinators and the principal for each semester.
          </p>
        </div>
      );
    }

    // === ACTIVITIES - STEP 5 ===
    if (stepId === "step5") {
      const activities = Array.isArray(section) ? section : [];

      if (activities.length === 0) {
        return <p className="text-muted-foreground">No activities recorded.</p>;
      }

      return (
        <div className="overflow-x-auto border rounded-lg">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-muted">
                <th className="border p-4 text-left font-semibold">Semester</th>
                <th className="border p-4 text-left font-semibold">Sports</th>
                <th className="border p-4 text-left font-semibold">Co-curricular</th>
                <th className="border p-4 text-left font-semibold">Extra-curricular</th>
                <th className="border p-4 text-left font-semibold">SNA</th>
                <th className="border p-4 text-left font-semibold">NSS/YRC/RRC</th>
                <th className="border p-4 text-left font-semibold">CNE</th>
                <th className="border p-4 text-left font-semibold">Awards/Rewards</th>
              </tr>
            </thead>
            <tbody>
              {["I", "II", "III", "IV", "V", "VI", "VII", "VIII"].map((sem) => {
                const act = activities.find((a: any) => a.semester === sem) || {};

                return (
                  <tr key={sem} className="hover:bg-muted/30 transition-colors">
                    <td className="border p-4 font-medium text-center bg-muted/20">
                      {sem}
                    </td>
                    <td className="border p-4 min-w-[120px]">{act.sports || "-"}</td>
                    <td className="border p-4 min-w-[120px]">{act.coCurricular || "-"}</td>
                    <td className="border p-4 min-w-[120px]">{act.extraCurricular || "-"}</td>
                    <td className="border p-4 min-w-[80px]">{act.sna || "-"}</td>
                    <td className="border p-4 min-w-[100px]">{act.nssYrcRrc || "-"}</td>
                    <td className="border p-4 min-w-[80px]">{act.cne || "-"}</td>
                    <td className="border p-4 min-w-[140px] font-medium text-emerald-700">
                      {act.awardsRewards || "-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      );
    }

    // === ATTENDANCE - STEP 4 ===
    if (stepId === "step4") {
      const attendanceRecords = Array.isArray(section) ? section : section?.semesters || [];

      if (!attendanceRecords || attendanceRecords.length === 0) {
        return <p className="text-muted-foreground">No attendance data available.</p>;
      }

      return (
        <div className="space-y-6">
          <div className="overflow-x-auto border rounded-lg">
            <table className="w-full border-collapse min-w-[800px] text-sm">
              <thead>
                <tr className="bg-muted">
                  <th className="border p-3 text-left font-semibold">Semester</th>
                  <th className="border p-3 text-left font-semibold">Working Days</th>
                  <th className="border p-3 text-left font-semibold">Annual Leave</th>
                  <th className="border p-3 text-left font-semibold">Sick Leave</th>
                  <th className="border p-3 text-left font-semibold">Gazetted Holidays</th>
                  <th className="border p-3 text-left font-semibold">Other Leave</th>
                  <th className="border p-3 text-center font-semibold">
                    Compensation<br />
                    <span className="text-xs font-normal text-muted-foreground">Days/Hrs</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {["I", "II", "III", "IV", "V", "VI", "VII", "VIII"].map((sem) => {
                  const record = attendanceRecords.find((r: any) =>
                    r.semester === sem || r.semester === `Semester ${sem}`
                  ) || {};

                  return (
                    <tr key={sem} className="hover:bg-muted/30 transition-colors">
                      <td className="border p-3 font-medium text-center bg-muted/20">
                        Semester {sem}
                      </td>
                      <td className="border p-3 text-center">{record.workingDays ?? "-"}</td>
                      <td className="border p-3 text-center">{record.annualLeave ?? "-"}</td>
                      <td className="border p-3 text-center">{record.sickLeave ?? "-"}</td>
                      <td className="border p-3 text-center">{record.gazettedHolidays ?? "-"}</td>
                      <td className="border p-3 text-center">{record.otherLeave ?? "-"}</td>
                      <td className="border p-3 text-center font-medium">
                        {record.compensationDaysHours || "-"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground italic">
            Note: Other Leave includes arrear study holidays, arrear examination leave, and important family functions.
          </p>
        </div>
      );
    }

    // === EDUCATIONAL QUALIFICATION - STEP 2 ===
    if (stepId === "step2") {
      const clean = filterData(section);

      return (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {clean.streamGroup && (
              <div className="p-4 border rounded-lg bg-muted/30">
                <p className="font-semibold text-sm">Stream/Group</p>
                <p className="text-muted-foreground">{clean.streamGroup}</p>
              </div>
            )}
            {clean.boardOfExamination && (
              <div className="p-4 border rounded-lg bg-muted/30">
                <p className="font-semibold text-sm">Board of Examination</p>
                <p className="text-muted-foreground">{clean.boardOfExamination}</p>
              </div>
            )}
            {clean.yearOfPassing && (
              <div className="p-4 border rounded-lg bg-muted/30">
                <p className="font-semibold text-sm">Year of Passing</p>
                <p className="text-muted-foreground">{clean.yearOfPassing}</p>
              </div>
            )}
            {clean.certificateNo && (
              <div className="p-4 border rounded-lg bg-muted/30">
                <p className="font-semibold text-sm">Certificate No.</p>
                <p className="text-muted-foreground">{clean.certificateNo}</p>
              </div>
            )}
            {clean.mediumOfInstruction && (
              <div className="p-4 border rounded-lg bg-muted/30">
                <p className="font-semibold text-sm">Medium of Instruction</p>
                <p className="text-muted-foreground">{clean.mediumOfInstruction}</p>
              </div>
            )}
            {clean.certificateDate && (
              <div className="p-4 border rounded-lg bg-muted/30">
                <p className="font-semibold text-sm">Certificate Date</p>
                <p className="text-muted-foreground">{clean.certificateDate}</p>
              </div>
            )}   {clean.hscVerificationNo && (
              <div className="p-4 border rounded-lg bg-muted/30">
                <p className="font-semibold text-sm">HSC Verification No</p>
                <p className="text-muted-foreground">{clean.hscVerificationNo}</p>
              </div>
            )}
            {clean.hscVerificationDate && (
              <div className="p-4 border rounded-lg bg-muted/30">
                <p className="font-semibold text-sm">HSC Verification Date</p>
                <p className="text-muted-foreground">{clean.hscVerificationDate}</p>
              </div>
            )}
          </div>

          {clean.subjects && Array.isArray(clean.subjects) && clean.subjects.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Marks Obtained</h3>
              <EducationalMarksTable
                subjects={clean.subjects}
                totalPlusOneAttempts={clean.totalPlusOneAttempts || []}
                totalPlusTwoAttempts={clean.totalPlusTwoAttempts || []}
              />
            </div>
          )}
        </div>
      );
    }

    // === DEFAULT RENDERING ===
    const clean = filterData(section);

    if (Array.isArray(clean)) {
      return (
        <div className="space-y-6">
          {clean.map((item, index) => (
            <Card key={index} className="border">
              <CardContent className="pt-6">
                {renderObject(item)}
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    return renderObject(clean);
  };
  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl">

      {/* HEADER ACTIONS: Back + Edit Button */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex gap-2">
          <Button
            onClick={() => navigate(`/students/${studentId}/edit`)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Student Record
          </Button>
          <Button onClick={() => navigate(`/students/${studentId}/print`)} className="bg-red-600 hover:bg-red-700 text-white"
          >
            <Printer className="h-4 w-4" />
            Print Report
          </Button>
        </div>
      </div>


      {/* TOP PROFILE CARD */}
      <Card className="mb-6 border-2 shadow">
        <CardHeader className="flex flex-row items-center gap-4">
          {data.step1?.photoUrl || data.step1?.photo ? (
            <img
              src={
                (data.step1?.photoUrl || data.step1?.photo)?.startsWith('http')
                  ? (data.step1?.photoUrl || data.step1?.photo)
                  : `${import.meta.env.VITE_BACKEND_URL}${data.step1?.photoUrl || data.step1?.photo}`
              }
              alt="profile"
              className="w-32 h-40 object-cover rounded-sm border-2 border-border shadow-md"
              style={{ aspectRatio: '3/4' }}
            />
          ) : (
            <div className="w-32 h-40 bg-muted border-2 border-border rounded-sm flex items-center justify-center" style={{ aspectRatio: '3/4' }}>
              <p className="text-xs text-muted-foreground">No Photo</p>
            </div>
          )}
          <div>
            <CardTitle className="text-xl">{data.step1?.studentName}</CardTitle>
            <p className="text-muted-foreground text-sm">Student ID: {studentId}</p>
            {/* <p className="text-muted-foreground text-sm">Registration No: {data.step1?.regNo}</p> */}
          </div>
        </CardHeader>
      </Card>

      {/* TABS */}
      <Tabs defaultValue="step1" className="w-full">
        <TabsList
          className="
    flex flex-wrap 
    justify-center
    gap-4
    p-4 
    mb-8 
    rounded-lg 
    bg-muted 
    w-full
    auto-rows-auto
    min-h-[170px]
  "
        >
          {tabs.map(t => (
            <TabsTrigger
              key={t.id}
              value={t.id}
              className="
        px-4 py-2 
        text-xs md:text-sm 
        rounded-md 
        whitespace-normal 
        leading-snug
        text-center
        min-w-[150px]
        font-medium
        h-auto
      "
            >
              {t.title}
            </TabsTrigger>
          ))}
        </TabsList>





        {tabs.map(t => (
          <TabsContent key={t.id} value={t.id}>
            <Card className="border-2">
              <CardHeader>
                <CardTitle>{t.title}</CardTitle>
              </CardHeader>
              <CardContent>
                {renderSection(data[t.id], t.id)}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default StudentView;