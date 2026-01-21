import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { User } from "@/lib/adminApi";
import { Eye, EyeOff, RefreshCw } from "lucide-react";

interface UserFormModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (userData: any) => Promise<void>;
    user?: User | null;
    mode: 'create' | 'edit';
}

export default function UserFormModal({ open, onClose, onSubmit, user, mode }: UserFormModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        designation: '',
        collegeName: '',
        email: '',
        phone: '',
        password: '',
        role: 'user' as 'user' | 'admin',
        isActive: true,
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        if (user && mode === 'edit') {
            setFormData({
                name: user.name,
                designation: user.designation,
                collegeName: user.collegeName,
                email: user.email,
                phone: user.phone,
                password: '',
                role: user.role,
                isActive: user.isActive,
            });
        } else {
            setFormData({
                name: '',
                designation: '',
                collegeName: '',
                email: '',
                phone: '',
                password: '',
                role: 'user',
                isActive: true,
            });
        }
    }, [user, mode, open]);

    const generatePassword = () => {
        const length = 12;
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
        let password = "";
        for (let i = 0; i < length; i++) {
            password += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        setFormData({ ...formData, password });
        toast({
            title: "Password Generated",
            description: "A secure password has been generated",
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formData.name || !formData.designation || !formData.collegeName || !formData.email || !formData.phone) {
            toast({
                title: "Validation Error",
                description: "Please fill in all required fields",
                variant: "destructive",
            });
            return;
        }

        if (mode === 'create' && !formData.password) {
            toast({
                title: "Validation Error",
                description: "Password is required for new users",
                variant: "destructive",
            });
            return;
        }

        if (!/^[0-9]{10}$/.test(formData.phone)) {
            toast({
                title: "Validation Error",
                description: "Phone number must be 10 digits",
                variant: "destructive",
            });
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            toast({
                title: "Validation Error",
                description: "Please enter a valid email address",
                variant: "destructive",
            });
            return;
        }

        setLoading(true);
        try {
            // Don't send password if it's empty in edit mode
            const submitData = mode === 'edit' && !formData.password
                ? { ...formData, password: undefined }
                : formData;

            await onSubmit(submitData);
            onClose();
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.response?.data?.message || `Failed to ${mode} user`,
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{mode === 'create' ? 'Create New User' : 'Edit User'}</DialogTitle>
                    <DialogDescription>
                        {mode === 'create'
                            ? 'Add a new user to the system'
                            : 'Update user information'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Dr. John Smith"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="designation">Designation *</Label>
                            <Input
                                id="designation"
                                value={formData.designation}
                                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                                placeholder="Professor"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="collegeName">College Name *</Label>
                        <Input
                            id="collegeName"
                            value={formData.collegeName}
                            onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })}
                            placeholder="ABC Medical College"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email *</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="john.smith@example.com"
                                disabled={mode === 'edit'}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone *</Label>
                            <Input
                                id="phone"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                                placeholder="9876543210"
                                maxLength={10}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">
                            Password {mode === 'create' ? '*' : '(leave empty to keep current)'}
                        </Label>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder={mode === 'create' ? "Enter password" : "Leave empty to keep current"}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={generatePassword}
                            >
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Generate
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="role">Role</Label>
                            <Select
                                value={formData.role}
                                onValueChange={(value: 'user' | 'admin') => setFormData({ ...formData, role: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="user">User</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="isActive">Active Status</Label>
                            <div className="flex items-center space-x-2 h-10">
                                <Switch
                                    id="isActive"
                                    checked={formData.isActive}
                                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                                />
                                <Label htmlFor="isActive" className="cursor-pointer">
                                    {formData.isActive ? 'Active' : 'Inactive'}
                                </Label>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Saving...' : mode === 'create' ? 'Create User' : 'Update User'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
