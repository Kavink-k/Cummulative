// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { ArrowLeft } from "lucide-react";
// import { getAllDataByStudentId } from "@/lib/api";

// const SectionCard = ({ title, children }: any) => (
//   <Card className="mb-6 shadow-md border rounded-xl">
//     <CardHeader className="bg-primary/5 rounded-t-xl">
//       <CardTitle className="text-lg font-semibold">{title}</CardTitle>
//     </CardHeader>
//     <CardContent className="pt-4">{children}</CardContent>
//   </Card>
// );

// const FieldRow = ({ label, value }: any) => (
//   <div className="grid grid-cols-3 py-2 border-b last:border-b-0">
//     <p className="font-medium text-gray-500">{label}</p>
//     <p className="col-span-2 font-semibold">{value || "—"}</p>
//   </div>
// );

// const StudentView = () => {
//   const { studentId } = useParams();
//   const navigate = useNavigate();

//   const [data, setData] = useState<any>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const load = async () => {
//       try {
//         const res = await getAllDataByStudentId(studentId!);
//         setData(res);
//       } catch (err) {
//         console.error("Error:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     load();
//   }, [studentId]);

//   if (loading) return <p className="text-center mt-10">Loading student record...</p>;
//   if (!data || !data.step1) return <p className="text-center mt-10">Student record not found.</p>;

//   const step1 = data.step1;

//   return (
//     <div className="container mx-auto px-4 py-10 max-w-4xl">

//       {/* Back Button */}
//       <Button variant="outline" className="mb-6" onClick={() => navigate(-1)}>
//         <ArrowLeft className="h-4 w-4 mr-2" />
//         Back
//       </Button>

//       {/* Student Header Card */}
//       <Card className="shadow-lg border rounded-xl mb-8">
//         <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-t-xl">
//           <CardTitle className="text-xl font-semibold">Student Profile</CardTitle>
//         </CardHeader>

//         <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">

//           <div className="space-y-2">
//             <p><b>Name:</b> {step1.studentName}</p>
//             <p><b>Student ID:</b> {step1.studentId}</p>
//             {/* <p><b>Registration No:</b> {step1.regNo || "—"}</p> */}
//             <p><b>Email:</b> {step1.studentEmail || "—"}</p>
//             <p><b>Gender:</b> {step1.gender || "—"}</p>
//             <p><b>Age:</b> {step1.age || "—"}</p>
//           </div>

//           {step1.photo && (
//             <div className="flex justify-center">
//               <img
//                 src={step1.photo}
//                 alt="Profile"
//                 className="w-40 h-40 object-cover rounded-xl border shadow"
//               />
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       {/* Step Sections */}
//       {Object.entries(data).map(([key, value]: any) => {
//         if (!value || key === "step1") return null; // skip profile (already shown)

//         return (
//           <SectionCard key={key} title={key.replace("step", "Step ")}>
//             {Array.isArray(value) ? (
//               <div className="space-y-4">
//                 {value.length === 0 ? (
//                   <p className="text-gray-500">No records.</p>
//                 ) : (
//                   value.map((row: any, idx: number) => (
//                     <Card key={idx} className="border p-4 rounded-lg shadow-sm">
//                       {Object.entries(row).map(([field, val]: any) => (
//                         <FieldRow key={field} label={field} value={String(val) || "—"} />
//                       ))}
//                     </Card>
//                   ))
//                 )}
//               </div>
//             ) : typeof value === "object" ? (
//               <div>
//                 {Object.keys(value).length === 0 ? (
//                   <p className="text-gray-500">No data available.</p>
//                 ) : (
//                   Object.entries(value).map(([field, val]: any) => (
//                     <FieldRow key={field} label={field} value={String(val) || "—"} />
//                   ))
//                 )}
//               </div>
//             ) : (
//               <p>{String(value)}</p>
//             )}
//           </SectionCard>
//         );
//       })}
//     </div>
//   );
// };

// export default StudentView;


import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { getAllDataByStudentId } from "@/lib/api";

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

  const renderSection = (section: any) => {
    if (!section) return <p className="text-muted-foreground">No data available.</p>;

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
          <img
            src={data.step1?.photo || "/placeholder-avatar.png"}
            alt="profile"
            className="w-24 h-24 rounded-full border object-cover"
          />
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
    min-h-[130px]
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
                {renderSection(data[t.id])}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default StudentView;
