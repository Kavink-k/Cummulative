import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Eye, Edit, Printer, LogOut, User2, BookOpen, CheckCircle, XCircle, Clock, AlertCircle, Lock, Unlock } from "lucide-react";
import { fetchpersonalprofileFromDB, fetchadmissionDetailsFromDB, approveStudent, rejectStudent, requestEditAccess, allowEditAccess } from "@/lib/api";
import { getUser, logout, isAdmin, isPrincipal, isMentor } from "@/lib/auth";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";


const STORAGE_KEY = "student_cumulative_data";
const STEP_KEY = "student_cumulative_step";

const Dashboard = () => {
  const navigate = useNavigate();
  const user = getUser();

  const [personalProfiles, setPersonalProfiles] = useState([]);
  const [admissionDetails, setAdmissionDetails] = useState([]);
  const [students, setStudents] = useState([]); // FINAL MERGED LIST
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Edit Request Dialog State
  const [isReasonDialogOpen, setIsReasonDialogOpen] = useState(false);
  const [requestReason, setRequestReason] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  const handleNewForm = () => {
    toast('Start a new form?', {
      description: 'This will clear all current data (saved and unsaved) to start fresh.',
      action: {
        label: 'New Form',
        onClick: () => {
          localStorage.removeItem(STORAGE_KEY);
          localStorage.removeItem(STEP_KEY);
          // Reload page immediately to clear all form state
          navigate("/form");

          window.location.reload();
        },
      },
      cancel: {
        label: 'Cancel',
        onClick: () => toast.info('Cancelled'),
      },
    });
  };

  // Fetch both datasets + merge data
  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      setLoading(true);

      // Define filters based on role
      const filters: any = {};
      if (!isAdmin()) {
        filters.institutionId = user?.institutionId;
      }

      // API calls in parallel
      const [profileRes, admissionRes] = await Promise.all([
        fetchpersonalprofileFromDB(filters),
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

  const handleApprove = async (studentId: string) => {
    try {
      await approveStudent(studentId);
      toast.success("Student record approved");
      loadAll();
    } catch (err) {
      console.error("Approval failed:", err);
      toast.error("Failed to approve record");
    }
  };

  const handleReject = async (studentId: string) => {
    try {
      await rejectStudent(studentId);
      toast.success("Student record rejected");
      loadAll();
    } catch (err) {
      console.error("Rejection failed:", err);
      toast.error("Failed to reject record");
    }
  };


  const handleRequestEdit = async () => {
    if (!selectedStudentId || !requestReason.trim()) {
      toast.error("Please provide a reason for the edit request");
      return;
    }

    try {
      await requestEditAccess(selectedStudentId, requestReason);
      toast.success("Edit access requested");
      setIsReasonDialogOpen(false);
      setRequestReason("");
      setSelectedStudentId(null);
      loadAll();
    } catch (err) {
      toast.error("Failed to request edit access");
    }
  };

  const openReasonDialog = (studentId: string) => {
    setSelectedStudentId(studentId);
    setRequestReason("");
    setIsReasonDialogOpen(true);
  };

  const handleAllowEdit = async (studentId: string) => {
    try {
      await allowEditAccess(studentId);
      toast.success("Edit access granted to Mentor");
      loadAll();
    } catch (err) {
      toast.error("Failed to grant edit access");
    }
  };


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
      <TooltipProvider>
        {/* HEADER */}
        <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Student Records Dashboard</h1>
                  <p className="text-sm text-muted-foreground">Manage Student Cumulative Records</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted text-sm text-muted-foreground">
                  <User2 className="h-4 w-4" />
                  <span className="max-w-[14rem] truncate">
                    {user?.name || "Admin"} ({user?.role}) {user?.email ? `• ${user.email}` : ""}
                  </span>
                </div>

                <Button variant="outline" onClick={handleNewForm}>New Record</Button>

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
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Student Records</CardTitle>
                  <CardDescription>
                    Manage and track student progress
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <Tabs defaultValue="approved" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="approved" className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Approved Records ({students.filter(s => s.approvalStatus === 'APPROVED').length})
                  </TabsTrigger>
                  <TabsTrigger value="pending" className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Pending Approval ({students.filter(s => s.approvalStatus === 'PENDING').length})
                  </TabsTrigger>
                  <TabsTrigger value="rejected" className="flex items-center gap-2">
                    <XCircle className="h-4 w-4" />
                    Rejected ({students.filter(s => s.approvalStatus === 'REJECTED').length})
                  </TabsTrigger>
                </TabsList>

                {['approved', 'pending', 'rejected'].map((statusTab) => {
                  const statusValue = statusTab.toUpperCase();
                  const tabStudents = filteredStudents.filter(s => s.approvalStatus === statusValue);

                  return (
                    <TabsContent key={statusTab} value={statusTab}>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Student ID</TableHead>
                              <TableHead>Name</TableHead>
                              <TableHead>University Reg No</TableHead>
                              <TableHead>Status Info</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>

                          <TableBody>
                            {tabStudents.length === 0 ? (
                              <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                  No {statusTab} records found.
                                </TableCell>
                              </TableRow>
                            ) : (
                              tabStudents.map((student) => {
                                const canMentorEdit = student.approvalStatus !== 'APPROVED' || student.editRequestStatus === 'ALLOWED';
                                const isEditRequested = student.editRequestStatus === 'REQUESTED';

                                return (
                                  <TableRow key={student.studentId} className="hover:bg-muted/50 uppercase">
                                    <TableCell>{student.studentId}</TableCell>
                                    <TableCell>{student.studentName}</TableCell>
                                    <TableCell>{student.universityRegistration || "—"}</TableCell>
                                    <TableCell>
                                      <div className="flex flex-col gap-1">
                                        {isEditRequested && (
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <Badge variant="secondary" className="w-fit bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100 cursor-help">
                                                <AlertCircle className="h-3 w-3 mr-1" /> Edit Requested
                                              </Badge>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                              <p className="font-semibold mb-1">Reason for request:</p>
                                              <p className="max-w-xs italic">"{student.editRequestReason || "No reason provided"}"</p>
                                            </TooltipContent>
                                          </Tooltip>
                                        )}
                                        {student.approvalStatus === 'PENDING' && student.editRequestReason && (
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <Badge variant="secondary" className="w-fit bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100 cursor-help">
                                                <AlertCircle className="h-3 w-3 mr-1" /> Modified
                                              </Badge>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                              <p className="font-semibold mb-1">Reason for modification:</p>
                                              <p className="max-w-xs italic">"{student.editRequestReason}"</p>
                                            </TooltipContent>
                                          </Tooltip>
                                        )}
                                        {!canMentorEdit && isMentor() && (
                                          <Badge variant="outline" className="w-fit">
                                            <Lock className="h-3 w-3 mr-1" /> Locked
                                          </Badge>
                                        )}
                                        {canMentorEdit && isMentor() && student.approvalStatus === 'APPROVED' && (
                                          <Badge variant="secondary" className="w-fit bg-green-100 text-green-800 border-green-200 hover:bg-green-100">
                                            <Unlock className="h-3 w-3 mr-1" /> Edit Allowed
                                          </Badge>
                                        )}
                                      </div>
                                    </TableCell>

                                    <TableCell className="text-right">
                                      <div className="flex justify-end gap-2">
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <Button variant="outline" size="sm" onClick={() => navigate(`/students/${student.studentId}`)}>
                                              <Eye className="h-4 w-4 mr-1" /> View
                                            </Button>
                                          </TooltipTrigger>
                                          <TooltipContent>View full profile</TooltipContent>
                                        </Tooltip>

                                        {(isAdmin() || isPrincipal() || canMentorEdit) ? (
                                          <Button variant="outline" size="sm" onClick={() => navigate(`/students/${student.studentId}/edit`)}>
                                            <Edit className="h-4 w-4 mr-1" /> Edit
                                          </Button>
                                        ) : (
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => openReasonDialog(student.studentId)}
                                            disabled={isEditRequested}
                                          >
                                            <AlertCircle className="h-4 w-4 mr-1" />
                                            {isEditRequested ? "Requested" : "Request Edit"}
                                          </Button>
                                        )}

                                        <Button variant="outline" size="sm" onClick={() => navigate(`/students/${student.studentId}/print`)}>
                                          <Printer className="h-4 w-4 mr-1" /> Print
                                        </Button>

                                        {isPrincipal() && (
                                          <div className="flex gap-2 border-l pl-2">
                                            {student.approvalStatus === 'PENDING' && (
                                              <>
                                                <Button
                                                  variant="default"
                                                  size="sm"
                                                  className="bg-green-600 hover:bg-green-700"
                                                  onClick={() => handleApprove(student.studentId)}
                                                >
                                                  <CheckCircle className="h-4 w-4 mr-1" /> Approve
                                                </Button>
                                                <Button
                                                  variant="destructive"
                                                  size="sm"
                                                  onClick={() => handleReject(student.studentId)}
                                                >
                                                  <XCircle className="h-4 w-4 mr-1" /> Reject
                                                </Button>
                                                {student.editRequestReason && (
                                                  <div className="text-[10px] text-blue-600 bg-blue-50 px-2 py-1 rounded font-medium border border-blue-100 mt-1 text-center">
                                                    Reason: {student.editRequestReason}
                                                  </div>
                                                )}
                                              </>
                                            )}

                                            {isEditRequested && (
                                              <Tooltip>
                                                <TooltipTrigger asChild>
                                                  <Button
                                                    variant="default"
                                                    size="sm"
                                                    className="bg-blue-600 hover:bg-blue-700"
                                                    onClick={() => handleAllowEdit(student.studentId)}
                                                  >
                                                    <Unlock className="h-4 w-4 mr-1" /> Allow Edit
                                                  </Button>
                                                </TooltipTrigger>
                                                <TooltipContent className="bg-blue-600 text-white border-blue-700">
                                                  <p className="font-semibold mb-1">Review Request Reason:</p>
                                                  <p className="max-w-xs italic font-medium">"{student.editRequestReason || "No reason provided"}"</p>
                                                </TooltipContent>
                                              </Tooltip>
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                );
                              })
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    </TabsContent>
                  );
                })}
              </Tabs>
            </CardContent>
          </Card>
        </main>
      </TooltipProvider>

      {/* FOOTER */}
      <footer className="border-t bg-card/30 mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>© 2025 Student Cumulative Record System. All rights reserved.</p>
        </div>
      </footer>
      {/* REASON DIALOG */}
      <Dialog open={isReasonDialogOpen} onOpenChange={setIsReasonDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Edit Access</DialogTitle>
            <DialogDescription>
              This record is approved and locked. Please explain why you need to make changes.
              The Principal will review your request.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Enter reason for editing (e.g., Incorrect marks entered, Photo update needed...)"
              value={requestReason}
              onChange={(e) => setRequestReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReasonDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleRequestEdit} disabled={!requestReason.trim()}>Send Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
