import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { getInstitutionByName } from "@/lib/api";
import { getUser } from "@/lib/auth";
import { Loader2 } from "lucide-react";

const institutionSchema = z.object({
    institutionName: z.string().min(1, "Institution name is required"),
    address: z.string().min(1, "Address is required"),
    batch: z.string().min(1, "Batch is required"),
});

type InstitutionFormData = z.infer<typeof institutionSchema>;

interface InstitutionFormProps {
    onSubmit: (data: InstitutionFormData) => void;
    defaultValues?: Partial<InstitutionFormData>;
    onProgressChange?: (progress: number) => void;
}

export const InstitutionForm = ({
    onSubmit,
    defaultValues,
    onProgressChange,
}: InstitutionFormProps) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const form = useForm<InstitutionFormData>({
        resolver: zodResolver(institutionSchema),
        defaultValues: defaultValues || {
            institutionName: "",
            address: "",
            batch: "",
        },
    });

    // Fetch institution details based on logged-in user
    useEffect(() => {
        const fetchInstitutionDetails = async () => {
            try {
                setLoading(true);
                setError(null);

                // Get logged-in user
                const user = getUser();
                if (!user) {
                    setError("User not logged in");
                    setLoading(false);
                    return;
                }

                // Check if user has institutionId
                if (!user.institutionId) {
                    setError(`User account does not have an institution assigned. Please contact your administrator.`);
                    setLoading(false);
                    return;
                }

                console.log('Fetching institution for ID:', user.institutionId);

                // Fetch institution details by user's institutionId
                const response = await getInstitutionByName(user.institution?.institutionName || '');
                const institutionData = response.data.data;

                if (institutionData) {
                    // Auto-populate form fields
                    form.setValue('institutionName', institutionData.institutionName);
                    form.setValue('address', institutionData.address);
                    form.setValue('batch', institutionData.batch);
                } else {
                    setError("Institution details not found");
                }
            } catch (err: any) {
                console.error('Failed to fetch institution details:', err);
                setError(err.response?.data?.message || "Failed to load institution details");
            } finally {
                setLoading(false);
            }
        };

        fetchInstitutionDetails();
    }, [form]);

    // Track progress
    useEffect(() => {
        const subscription = form.watch((values) => {
            const requiredFields = ["institutionName", "address", "batch"];
            const filledFields = requiredFields.filter(
                (field) =>
                    values[field as keyof typeof values] &&
                    values[field as keyof typeof values]?.toString().trim() !== ""
            ).length;

            onProgressChange?.((filledFields / requiredFields.length) * 100);
        });
        return () => subscription.unsubscribe();
    }, [form, onProgressChange]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">Loading institution details...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
                <p className="text-sm text-destructive font-medium">Error: {error}</p>
                <p className="text-xs text-muted-foreground mt-1">
                    Please contact your administrator or try logging in again.
                </p>
            </div>
        );
    }

    return (
        <Form {...form}>
            <form
                id="active-form"
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
            >
                {/* Title Section */}
                <div className="space-y-2 border-b pb-4">
                    <h2 className="text-center text-xl font-bold text-foreground">
                        CUMMULATIVE RECORD
                    </h2>
                    <h3 className="text-center text-lg font-semibold text-foreground">
                        BACHELOR OF SCIENCE IN NURSING
                    </h3>
                    <p className="text-center text-sm text-muted-foreground">
                        (4 Years)
                    </p>
                    <p className="text-center text-xs text-muted-foreground italic">
                        (Revised Regulations and Curriculum, INC, 2021)
                    </p>
                </div>

                {/* Form Fields - All Read-Only */}
                <div className="space-y-6 border rounded-lg p-6 bg-muted/20">
                    <FormField
                        control={form.control}
                        name="institutionName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-base font-semibold">
                                    NAME OF THE INSTITUTION
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        value={field.value || ""}
                                        className="text-base bg-muted"
                                        readOnly
                                        disabled
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-base font-semibold">
                                    ADDRESS
                                </FormLabel>
                                <FormControl>
                                    <Textarea
                                        {...field}
                                        value={field.value || ""}
                                        className="text-base min-h-[100px] bg-muted"
                                        readOnly
                                        disabled
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="batch"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-base font-semibold">
                                    BATCH
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        value={field.value || ""}
                                        className="text-base bg-muted"
                                        readOnly
                                        disabled
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </form>
        </Form>
    );
};
