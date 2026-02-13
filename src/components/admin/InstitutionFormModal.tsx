import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Institution } from "@/lib/adminApi";

interface InstitutionFormModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (institutionData: any) => Promise<void>;
    institution?: Institution | null;
    mode: 'create' | 'edit';
}

export default function InstitutionFormModal({ open, onClose, onSubmit, institution, mode }: InstitutionFormModalProps) {
    const [formData, setFormData] = useState({
        institutionName: '',
        address: '',
        batch: '',
    });
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        if (institution && mode === 'edit') {
            setFormData({
                institutionName: institution.institutionName,
                address: institution.address,
                batch: institution.batch,
            });
        } else {
            setFormData({
                institutionName: '',
                address: '',
                batch: '',
            });
        }
    }, [institution, mode, open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formData.institutionName || !formData.address || !formData.batch) {
            toast({
                title: "Validation Error",
                description: "Please fill in all required fields",
                variant: "destructive",
            });
            return;
        }

        setLoading(true);
        try {
            await onSubmit(formData);
            onClose();
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.response?.data?.message || `Failed to ${mode} institution`,
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
                    <DialogTitle>{mode === 'create' ? 'Create New Institution' : 'Edit Institution'}</DialogTitle>
                    <DialogDescription>
                        {mode === 'create'
                            ? 'Add a new institution to the system'
                            : 'Update institution information'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="institutionName">Institution Name *</Label>
                        <Input
                            id="institutionName"
                            value={formData.institutionName}
                            onChange={(e) => setFormData({ ...formData, institutionName: e.target.value })}
                            placeholder="ABC College of Nursing and Health Sciences"
                            disabled={mode === 'edit'} // Institution name is unique identifier, can't be changed
                        />
                        {mode === 'edit' && (
                            <p className="text-xs text-gray-500">Institution name cannot be changed after creation</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="address">Address *</Label>
                        <Textarea
                            id="address"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            placeholder="123 Main Street, City, State - 123456"
                            rows={4}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="batch">Batch *</Label>
                        <Input
                            id="batch"
                            value={formData.batch}
                            onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                            placeholder="2023 - 2027"
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Saving...' : mode === 'create' ? 'Create Institution' : 'Update Institution'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
