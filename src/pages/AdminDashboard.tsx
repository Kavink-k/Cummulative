import { useState, useEffect } from "react";
import { UserPlus2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import UserManagementTable from "@/components/admin/UserManagementTable";
import UserFormModal from "@/components/admin/UserFormModal";
import BulkUploadComponent from "@/components/admin/BulkUploadComponent";
import InstitutionManagementTable from "@/components/admin/InstitutionManagementTable";
import InstitutionFormModal from "@/components/admin/InstitutionFormModal";
import {
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    User,
    PaginatedUsers,
    getInstitutions,
    createInstitution,
    updateInstitution,
    deleteInstitution,
    Institution,
} from "@/lib/adminApi";

export default function AdminDashboard() {
    const [usersData, setUsersData] = useState<PaginatedUsers | null>(null);
    const [institutions, setInstitutions] = useState<Institution[]>([]);
    const [loading, setLoading] = useState(true);
    const [usersLoading, setUsersLoading] = useState(false);
    const [institutionsLoading, setInstitutionsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [institutionModalOpen, setInstitutionModalOpen] = useState(false);
    const [institutionModalMode, setInstitutionModalMode] = useState<'create' | 'edit'>('create');
    const [selectedInstitution, setSelectedInstitution] = useState<Institution | null>(null);
    const { toast } = useToast();

    const limit = 10;

    // Fetch users
    const fetchUsers = async () => {
        setUsersLoading(true);
        try {
            const data = await getUsers(page, limit, search);
            setUsersData(data);
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to fetch users",
                variant: "destructive",
            });
        } finally {
            setUsersLoading(false);
        }
    };

    // Fetch institutions
    const fetchInstitutions = async () => {
        setInstitutionsLoading(true);
        try {
            const data = await getInstitutions();
            setInstitutions(data);
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to fetch institutions",
                variant: "destructive",
            });
        } finally {
            setInstitutionsLoading(false);
        }
    };

    // Initial load
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await Promise.all([fetchUsers(), fetchInstitutions()]);
            setLoading(false);
        };
        loadData();
    }, []);

    // Reload users when page or search changes
    useEffect(() => {
        fetchUsers();
    }, [page, search]);

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    const handleSearch = (searchTerm: string) => {
        setSearch(searchTerm);
        setPage(1); // Reset to first page on search
    };

    const handleCreateUser = () => {
        setModalMode('create');
        setSelectedUser(null);
        setModalOpen(true);
    };

    const handleEditUser = (user: User) => {
        setModalMode('edit');
        setSelectedUser(user);
        setModalOpen(true);
    };

    const handleDeleteUser = async (userId: number) => {
        try {
            await deleteUser(userId);
            toast({
                title: "Success",
                description: "User deactivated successfully",
            });
            await fetchUsers();
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to delete user",
                variant: "destructive",
            });
        }
    };

    const handleSubmitUser = async (userData: any) => {
        try {
            if (modalMode === 'create') {
                await createUser(userData);
                toast({
                    title: "Success",
                    description: "User created successfully",
                });
            } else if (selectedUser) {
                await updateUser(selectedUser.id, userData);
                toast({
                    title: "Success",
                    description: "User updated successfully",
                });
            }
            setModalOpen(false);
            await fetchUsers();
        } catch (error: any) {
            throw error; // Let the modal handle the error
        }
    };

    const handleCreateInstitution = () => {
        setInstitutionModalMode('create');
        setSelectedInstitution(null);
        setInstitutionModalOpen(true);
    };

    const handleEditInstitution = (institution: Institution) => {
        setInstitutionModalMode('edit');
        setSelectedInstitution(institution);
        setInstitutionModalOpen(true);
    };

    const handleDeleteInstitution = async (institutionId: number) => {
        try {
            await deleteInstitution(institutionId);
            toast({
                title: "Success",
                description: "Institution deleted successfully",
            });
            await fetchInstitutions();
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to delete institution",
                variant: "destructive",
            });
        }
    };

    const handleSubmitInstitution = async (institutionData: any) => {
        try {
            if (institutionModalMode === 'create') {
                await createInstitution(institutionData);
                toast({
                    title: "Success",
                    description: "Institution created successfully",
                });
            } else if (selectedInstitution) {
                await updateInstitution(selectedInstitution.id, institutionData);
                toast({
                    title: "Success",
                    description: "Institution updated successfully",
                });
            }
            setInstitutionModalOpen(false);
            await fetchInstitutions();
        } catch (error: any) {
            throw error; // Let the modal handle the error
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                    <p className="text-gray-600 mt-1">Manage users and system settings</p>
                </div>
                <Button onClick={handleCreateUser}>
                    <UserPlus2 className="h-4 w-4 mr-2" />
                    Create User
                </Button>
            </div>

            {/* Tabs for User Management, Institution Management, and Bulk Upload */}
            <Tabs defaultValue="users" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="users">User Management</TabsTrigger>
                    <TabsTrigger value="institutions">Institution Management</TabsTrigger>
                    <TabsTrigger value="bulk-upload">Bulk Upload</TabsTrigger>
                </TabsList>

                <TabsContent value="users" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>All Users</CardTitle>
                            <CardDescription>View and manage all registered users</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {usersData && (
                                <UserManagementTable
                                    users={usersData.users}
                                    total={usersData.total}
                                    page={usersData.page}
                                    limit={usersData.limit}
                                    totalPages={usersData.totalPages}
                                    onPageChange={handlePageChange}
                                    onSearch={handleSearch}
                                    onEdit={handleEditUser}
                                    onDelete={handleDeleteUser}
                                    loading={usersLoading}
                                />
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="institutions" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>All Institutions</CardTitle>
                                    <CardDescription>View and manage all institutions</CardDescription>
                                </div>
                                <Button onClick={handleCreateInstitution}>
                                    <UserPlus2 className="h-4 w-4 mr-2" />
                                    Add Institution
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <InstitutionManagementTable
                                institutions={institutions}
                                onEdit={handleEditInstitution}
                                onDelete={handleDeleteInstitution}
                                loading={institutionsLoading}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="bulk-upload">
                    <BulkUploadComponent key={usersData?.total} />
                </TabsContent>
            </Tabs>

            {/* User Form Modal */}
            <UserFormModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onSubmit={handleSubmitUser}
                user={selectedUser}
                mode={modalMode}
            />

            {/* Institution Form Modal */}
            <InstitutionFormModal
                open={institutionModalOpen}
                onClose={() => setInstitutionModalOpen(false)}
                onSubmit={handleSubmitInstitution}
                institution={selectedInstitution}
                mode={institutionModalMode}
            />
        </div>
    );
}
