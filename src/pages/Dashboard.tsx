// import { useState,useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Search, Eye, Edit, Printer, BookOpen, LogOut, User2 } from "lucide-react";
// import { sampleStudents } from "@/data/sampleStudents";
// import { getUser, logout } from "@/lib/auth";
// import { getAllStudents } from "@/lib/data";
// import { fetchAllStudentsFromDB } from "@/lib/api";

// const Dashboard = () => {

//   const [students, setStudents] = useState([]);
// const [loading, setLoading] = useState(true);

// useEffect(() => {
//   const load = async () => {
//     try {
//       const res = await fetchAllStudentsFromDB();

//       console.log("RAW STUDENT RESPONSE =>", res);

//       let list = [];

//       // Handle most common backend shapes
//       if (Array.isArray(res)) {
//         list = res;
//       } else if (Array.isArray(res.data)) {
//         list = res.data;
//       } else if (Array.isArray(res.profiles)) {
//         list = res.profiles;
//       } else {
//         list = [res]; // fallback
//       }

//       setStudents(list);
//     } catch (e) {
//       console.error("Failed loading students:", e);
//       setStudents([]); // fail safely
//     }
//   };

//   load();
// }, []);



//   const navigate = useNavigate();
//   const user = getUser();
//   const [searchQuery, setSearchQuery] = useState("");

//   // Combine sample students with any stored students
//   const storedStudents = getAllStudents();
//   const allStudents = [...sampleStudents, ...storedStudents.filter(s => !sampleStudents.find(ss => ss.id === s.id))];

//  const filteredStudents = students.filter((student) => {
//   const q = searchQuery.toLowerCase();
//   return (
//     student.studentName?.toLowerCase().includes(q) ||
//     student.studentEmail?.toLowerCase().includes(q) ||
//     student.studentId?.toLowerCase().includes(q)
//   );
// });


//   const handleView = (studentId: string) => {
//     navigate(`/students/${encodeURIComponent(studentId)}`);
//   };

//   const handleEdit = (studentId: string) => {
//     navigate(`/students/${encodeURIComponent(studentId)}/edit`);
//   };

//   const handlePrint = (studentId: string) => {
//     navigate(`/students/${encodeURIComponent(studentId)}/print`);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
//       <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
//         <div className="container mx-auto px-4 py-4">
//           <div className="flex items-center justify-between gap-3">
//             <div className="flex items-center gap-3">
//               <div className="bg-primary text-primary-foreground p-2 rounded-lg">
//                 <BookOpen className="h-6 w-6" />
//               </div>
//               <div>
//                 <h1 className="text-2xl font-bold text-foreground">Student Records Dashboard</h1>
//                 <p className="text-sm text-muted-foreground">Manage Student Cumulative Records</p>
//               </div>
//             </div>

//             <div className="flex items-center gap-2">
//               <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted text-sm text-muted-foreground">
//                 <User2 className="h-4 w-4" />
//                 <span className="max-w-[14rem] truncate">
//                   {user?.name || "Admin"} {user?.email ? `• ${user.email}` : ""}
//                 </span>
//               </div>

//               <Button
//                 variant="outline"
//                 onClick={() => navigate("/")}
//               >
//                 New Record
//               </Button>

//               <Button
//                 variant="destructive"
//                 onClick={() => {
//                   logout();
//                   window.location.href = "/login";
//                 }}
//               >
//                 <LogOut className="h-4 w-4 mr-2" />
//                 Logout
//               </Button>
//             </div>
//           </div>
//         </div>
//       </header>

//       <main className="container mx-auto px-4 py-8 max-w-7xl">
//         <Card className="mb-6">
//           <CardHeader>
//             <CardTitle>Search Students</CardTitle>
//             <CardDescription>Search by name, registration number, email, or student ID</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="flex gap-2">
//               <div className="relative flex-1">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                 <Input
//                   placeholder="Search students..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   className="pl-10"
//                 />
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>Student Records ({filteredStudents.length})</CardTitle>
//             <CardDescription>
//               {filteredStudents.length === allStudents.length
//                 ? "Showing all student records"
//                 : `Showing ${filteredStudents.length} of ${allStudents.length} records`}
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="overflow-x-auto">
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Student ID</TableHead>
//                     <TableHead>Name</TableHead>
//                     <TableHead>Registration No</TableHead>
//                     <TableHead className="text-right">Actions</TableHead>
//                   </TableRow>
//                 </TableHeader>
//               <TableBody>
//   {filteredStudents.length === 0 ? (
//     <TableRow>
//       <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
//         No students found matching your search.
//       </TableCell>
//     </TableRow>
//   ) : (
//     filteredStudents.map((student) => (
//       <TableRow key={student.id} className="hover:bg-muted/50 uppercase">

//         {/* Student ID */}
//         <TableCell className="font-medium">
//           {student.studentId}
//         </TableCell>

//         {/* Student Name */}
//         <TableCell>
//           {student.studentName}
//         </TableCell>

//         {/* Registration Number — backend does NOT return this now */}
//         <TableCell>
//           {student.registerNo || student.regNo || "—"}
//         </TableCell>

//         {/* Actions */}
//         <TableCell className="text-right">
//           <div className="flex justify-end gap-2">

//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => navigate(`/students/${encodeURIComponent(student.studentId)}`)}
//             >
//               <Eye className="h-4 w-4 mr-1" />
//               View
//             </Button>

//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => handleEdit(student.studentId)}
//             >
//               <Edit className="h-4 w-4 mr-1" />
//               Edit
//             </Button>

//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => handlePrint(student.studentId)}
//             >
//               <Printer className="h-4 w-4 mr-1" />
//               Print
//             </Button>

//           </div>
//         </TableCell>

//       </TableRow>
//     ))
//   )}
// </TableBody>

//               </Table>
//             </div>
//           </CardContent>
//         </Card>
//       </main>

//       <footer className="border-t bg-card/30 mt-12">
//         <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
//           <p>© 2025 Student Cumulative Record System. All rights reserved.</p>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default Dashboard;



import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Eye, Edit, Printer, BookOpen, LogOut, User2 } from "lucide-react";
import { getUser, logout } from "@/lib/auth";
import { fetchAllStudentsFromDB } from "@/lib/api";

const Dashboard = () => {
  const navigate = useNavigate();
  const user = getUser();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch backend students
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchAllStudentsFromDB();

        console.log("RAW STUDENT RESPONSE =>", res);

        let list = [];

        if (Array.isArray(res)) {
          list = res;
        } else if (Array.isArray(res.data)) {
          list = res.data;
        } else {
          list = [res];
        }

        setStudents(list);
      } catch (e) {
        console.error("Failed loading students:", e);
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // Search filtering
  const filteredStudents = students.filter((student) => {
    const q = searchQuery.toLowerCase();
    return (
      student.studentName?.toLowerCase().includes(q) ||
      student.studentId?.toLowerCase().includes(q) ||
      student.regNo?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      {/* HEADER */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="bg-primary text-primary-foreground p-2 rounded-lg">
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Student Records Dashboard</h1>
                <p className="text-sm text-muted-foreground">Manage Student Cumulative Records</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted text-sm text-muted-foreground">
                <User2 className="h-4 w-4" />
                <span className="max-w-[14rem] truncate">
                  {user?.name || "Admin"} {user?.email ? `• ${user.email}` : ""}
                </span>
              </div>

              <Button variant="outline" onClick={() => navigate("/")}>
                New Record
              </Button>

              <Button
                variant="destructive"
                onClick={() => {
                  logout();
                  window.location.href = "/login";
                }}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* SEARCH CARD */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Search Students</CardTitle>
            <CardDescription>Search by name, registration number, or student ID</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search students..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* TABLE CARD */}
        <Card>
          <CardHeader>
            <CardTitle>Student Records ({filteredStudents.length})</CardTitle>
            <CardDescription>
              Showing {filteredStudents.length} of {students.length} records
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Registration No</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredStudents.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                        No students found matching your search.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredStudents.map((student) => (
                      <TableRow key={student.id} className="hover:bg-muted/50 uppercase">
                        <TableCell className="font-medium">{student.studentId}</TableCell>
                        <TableCell>{student.studentName}</TableCell>
                        <TableCell>{student.regNo || "—"}</TableCell>

                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/students/${student.studentId}`)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>

                            <Button variant="outline" size="sm" onClick={() => navigate(`/students/${student.studentId}/edit`)}>
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>

                            <Button variant="outline" size="sm" onClick={() => navigate(`/students/${student.studentId}/print`)}>
                              <Printer className="h-4 w-4 mr-1" />
                              Print
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* FOOTER */}
      <footer className="border-t bg-card/30 mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>© 2025 Student Cumulative Record System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
