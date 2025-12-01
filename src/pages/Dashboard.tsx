import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Eye, Edit, Printer, BookOpen, LogOut, User2 } from "lucide-react";
import { getUser, logout } from "@/lib/auth";
import { fetchpersonalprofileFromDB, fetchadmissionDetailsFromDB } from "@/lib/api";

const Dashboard = () => {
  const navigate = useNavigate();
  const user = getUser();

  const [personalProfiles, setPersonalProfiles] = useState([]);
  const [admissionDetails, setAdmissionDetails] = useState([]);
  const [students, setStudents] = useState([]); // FINAL MERGED LIST
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch both datasets + merge data
  useEffect(() => {
    const loadAll = async () => {
      try {
        setLoading(true);

        // API calls in parallel
        const [profileRes, admissionRes] = await Promise.all([
          fetchpersonalprofileFromDB(),
          fetchadmissionDetailsFromDB(),
        ]);

        // Normalize profile data
        let profileList = Array.isArray(profileRes)
          ? profileRes
          : Array.isArray(profileRes?.data)
          ? profileRes.data
          : [profileRes];

        // Normalize admission data
        let admissionList = Array.isArray(admissionRes)
          ? admissionRes
          : Array.isArray(admissionRes?.data)
          ? admissionRes.data
          : [admissionRes];

        setPersonalProfiles(profileList);
        setAdmissionDetails(admissionList);

        // 🔥 MERGE DATASETS BY studentId 
        const merged = profileList.map((p) => {
          const admission = admissionList.find((a) => a.studentId === p.studentId);
          return {
            ...p,
            universityRegistration: admission?.universityRegistration || "",
            step3AdmissionDetails: admission || null,
          };
        });

        setStudents(merged);
      } catch (err) {
        console.error("Failed loading student data:", err);
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };

    loadAll();
  }, []);

  // Search filtering
  const filteredStudents = students.filter((student) => {
    const q = searchQuery.toLowerCase();
    return (
      student.studentName?.toLowerCase().includes(q) ||
      student.studentId?.toLowerCase().includes(q) ||
      student.universityRegistration?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      {/* HEADER */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {/* <div className="bg-primary text-primary-foreground p-2 rounded-lg">
                <BookOpen className="h-6 w-6" />
              </div> */}
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

              <Button variant="outline" onClick={() => navigate("/")}>New Record</Button>

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

      {/* MAIN */}
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* SEARCH */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Search Students</CardTitle>
            <CardDescription>Search by name, registration number, or student ID</CardDescription>
          </CardHeader>

          <CardContent>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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

        {/* TABLE */}
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
                    <TableHead>University Reg No</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredStudents.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                        No students found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredStudents.map((student) => (
                      <TableRow key={student.studentId} className="hover:bg-muted/50 uppercase">
                        <TableCell>{student.studentId}</TableCell>
                        <TableCell>{student.studentName}</TableCell>
                        <TableCell>{student.universityRegistration || "—"}</TableCell>

                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" onClick={() => navigate(`/students/${student.studentId}`)}>
                              <Eye className="h-4 w-4 mr-1" /> View
                            </Button>

                            <Button variant="outline" size="sm" onClick={() => navigate(`/students/${student.studentId}/edit`)}>
                              <Edit className="h-4 w-4 mr-1" /> Edit
                            </Button>

                            <Button variant="outline" size="sm" onClick={() => navigate(`/students/${student.studentId}/print`)}>
                              <Printer className="h-4 w-4 mr-1" /> Print
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
