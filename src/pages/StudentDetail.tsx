import { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getStudentById } from "@/lib/data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, IdCard } from "lucide-react";

// Titles should match your form step titles
const sectionMeta: { key: keyof NonNullable<ReturnType<typeof getStudentById>>["steps"]; title: string; desc?: string }[] = [
  { key: "step1",  title: "Personal Profile",         desc: "Student's basic information" },
  { key: "step2",  title: "Educational Qualification",desc: "Academic records" },
  { key: "step3",  title: "Admission Details",        desc: "Admission & certificates" },
  { key: "step4",  title: "Attendance Record",        desc: "Working days & leave details" },
  { key: "step5",  title: "Activities & Participation", desc: "Sports & co-curricular activities" },
  { key: "step6",  title: "Course Instruction",       desc: "Course details & marks" },
  { key: "step7",  title: "Observational Visits",     desc: "Field visit records" },
  { key: "step8",  title: "Clinical Experience",      desc: "Clinical hours tracking" },
  { key: "step9",  title: "Research Projects",        desc: "Nursing research projects" },
  { key: "step10", title: "Additional Courses",       desc: "Extra courses completed" },
  { key: "step11", title: "Course Completion",        desc: "Course completion details" },
  { key: "step12", title: "Verification",             desc: "Semester-wise verification" },
];

export default function StudentDetail() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const rec = useMemo(() => getStudentById(String(id)), [id]);

  if (!rec) {
    return (
      <div className="p-4 md:p-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <Card className="border-2">
          <CardHeader>
            <CardTitle>Student not found</CardTitle>
            <CardDescription>We couldn’t locate a record for this ID.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <>
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-30">
        <div className="px-4 py-4 flex items-center gap-3">
          <div className="bg-primary text-primary-foreground p-2 rounded-lg">
            <IdCard className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{rec.name || "Student Record"}</h1>
            <p className="text-sm text-muted-foreground">
              {rec.regNo ? `RegNo: ${rec.regNo}` : rec.email || rec.id}
            </p>
          </div>
          <div className="ml-auto">
            <Button variant="outline" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
        </div>
      </header>

      <div className="p-4 md:p-6 space-y-6">
        {sectionMeta.map(({ key, title, desc }) => {
          const data = rec.steps?.[key];
          return (
            <Card key={key} className="border-2 shadow-sm">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
                <CardTitle className="text-xl">{title}</CardTitle>
                {desc && <CardDescription>{desc}</CardDescription>}
              </CardHeader>
              <CardContent className="pt-4">
                {data ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Object.entries(data).map(([k, v]) => (
                      <div key={k} className="text-sm">
                        <div className="text-muted-foreground">{labelize(k)}</div>
                        <div className="font-medium break-words">
                          {renderValue(v)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">No data provided for this section.</div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
}

function labelize(key: string) {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .replace(/^./, (c) => c.toUpperCase());
}

function renderValue(v: any) {
  if (v == null) return "—";
  if (typeof v === "boolean") return v ? "Yes" : "No";
  if (Array.isArray(v)) {
    return v.length ? (
      <ul className="list-disc pl-5 space-y-1">
        {v.map((item, idx) => (
          <li key={idx}>{typeof item === "object" ? JSON.stringify(item) : String(item)}</li>
        ))}
      </ul>
    ) : "—";
  }
  if (typeof v === "object") return <pre className="text-xs bg-muted/50 p-2 rounded">{JSON.stringify(v, null, 2)}</pre>;
  return String(v);
}
