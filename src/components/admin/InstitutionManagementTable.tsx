import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Institution } from "@/lib/adminApi";
import { MoreHorizontal, Pencil, Trash2, Search } from "lucide-react";
import { format } from "date-fns";

interface InstitutionManagementTableProps {
    institutions: Institution[];
    onEdit: (institution: Institution) => void;
    onDelete: (institutionId: number) => void;
    loading?: boolean;
}

export default function InstitutionManagementTable({
    institutions = [],
    onEdit,
    onDelete,
    loading = false,
}: InstitutionManagementTableProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [deleteInstitutionId, setDeleteInstitutionId] = useState<number | null>(null);

    const filteredInstitutions = (institutions || []).filter((inst) =>
        inst.institutionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inst.address.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const confirmDelete = (institutionId: number) => {
        setDeleteInstitutionId(institutionId);
    };

    const handleDelete = () => {
        if (deleteInstitutionId) {
            onDelete(deleteInstitutionId);
            setDeleteInstitutionId(null);
        }
    };

    return (
        <div className="space-y-4">
            {/* Search Bar */}
            <div className="flex items-center gap-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search by college name, institution..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <div className="text-sm text-gray-600">
                    Showing {filteredInstitutions.length} of {institutions.length} institutions
                </div>
            </div>

            {/* Table */}
            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Institution Name</TableHead>
                            <TableHead>Address</TableHead>
                            <TableHead>Batch</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                                    Loading institutions...
                                </TableCell>
                            </TableRow>
                        ) : filteredInstitutions.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                                    No institutions found
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredInstitutions.map((institution) => (
                                <TableRow key={institution.id}>
                                    <TableCell className="font-medium">{institution.institutionName}</TableCell>
                                    <TableCell className="max-w-[300px] truncate">{institution.address}</TableCell>
                                    <TableCell>{institution.batch}</TableCell>
                                    <TableCell className="text-sm text-gray-600">
                                        {format(new Date(institution.createdAt), 'MMM dd, yyyy')}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => onEdit(institution)}>
                                                    <Pencil className="h-4 w-4 mr-2" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => confirmDelete(institution.id)}
                                                    className="text-red-600"
                                                >
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteInstitutionId !== null} onOpenChange={() => setDeleteInstitutionId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the institution. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
