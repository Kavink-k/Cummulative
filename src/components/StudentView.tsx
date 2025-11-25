

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { getAllDataByStudentId } from "@/lib/api";
import { EducationalMarksTable } from "@/components/EducationalMarksTable";

const StudentView = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const FILTER_KEYS = ["id", "createdAt", "updatedAt"];

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

    // Special handling for Educational Qualification (step2)
    if (stepId === 'step2') {
      const clean = filterData(section);

      return (
        <div className="space-y-4">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {clean.streamGroup && (
              <div className="p-3 border rounded-md bg-muted">
                <p className="font-semibold">Stream Group</p>
                <p className="text-sm text-muted-foreground">{clean.streamGroup}</p>
              </div>
            )}
            {clean.boardOfExamination && (
              <div className="p-3 border rounded-md bg-muted">
                <p className="font-semibold">Board Of Examination</p>
                <p className="text-sm text-muted-foreground">{clean.boardOfExamination}</p>
              </div>
            )}
            {clean.yearOfPassing && (
              <div className="p-3 border rounded-md bg-muted">
                <p className="font-semibold">Year Of Passing</p>
                <p className="text-sm text-muted-foreground">{clean.yearOfPassing}</p>
              </div>
            )}
            {clean.certificateNo && (
              <div className="p-3 border rounded-md bg-muted">
                <p className="font-semibold">Certificate No</p>
                <p className="text-sm text-muted-foreground">{clean.certificateNo}</p>
              </div>
            )}
            {clean.mediumOfInstruction && (
              <div className="p-3 border rounded-md bg-muted">
                <p className="font-semibold">Medium Of Instruction</p>
                <p className="text-sm text-muted-foreground">{clean.mediumOfInstruction}</p>
              </div>
            )}
          </div>

          {/* Marks Table */}
          {clean.subjects && clean.subjects.length > 0 && (
            <div className="mt-6">
              <h4 className="font-semibold mb-3">Marks Details</h4>
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

    const clean = filterData(section);

    if (Array.isArray(clean)) {
      return (
        <div className="space-y-4">
          {clean.map((row, i) => (
            <Card key={i}>
              <CardHeader>
                <CardTitle>Entry {i + 1}</CardTitle>
              </CardHeader>
              <CardContent>{renderObject(row)}</CardContent>
            </Card>
          ))}
        </div>
      );
    }

    return renderObject(clean);
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl">

      {/* Back Button */}
      <Button variant="outline" className="mb-6" onClick={() => navigate(-1)}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      {/* TOP PROFILE CARD */}
      <Card className="mb-6 border-2 shadow">
        <CardHeader className="flex flex-row items-center gap-4">
          {data.step1?.photoUrl || data.step1?.photo ? (
            <img
              src={
                (data.step1?.photoUrl || data.step1?.photo)?.startsWith('http')
                  ? (data.step1?.photoUrl || data.step1?.photo)
                  : `http://localhost:5000${data.step1?.photoUrl || data.step1?.photo}`
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
