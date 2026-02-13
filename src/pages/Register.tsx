import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { register } from "@/lib/auth";
import { getAllInstitutions } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { User, Mail, Lock, Building2, Briefcase, Phone } from "lucide-react";

const registerSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name is too long"),
    designation: z.string().min(2, "Designation is required").max(100, "Designation is too long"),
    institutionId: z.number({ required_error: "Please select an institution" }).positive("Please select an institution"),
    email: z.string().email("Invalid email address"),
    phone: z.string().regex(/^[0-9]{10}$/, "Phone number must be exactly 10 digits"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function Register() {
    const navigate = useNavigate();
    const [institutions, setInstitutions] = useState<any[]>([]);
    const [loadingInstitutions, setLoadingInstitutions] = useState(true);

    const form = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            designation: "",
            email: "",
            phone: "",
            password: "",
            confirmPassword: "",
        },
    });

    // Fetch institutions on mount
    useEffect(() => {
        const fetchInstitutions = async () => {
            try {
                const response = await getAllInstitutions();
                setInstitutions(response.data.data || []);
            } catch (error) {
                console.error('Error fetching institutions:', error);
                toast.error('Failed to load institutions');
            } finally {
                setLoadingInstitutions(false);
            }
        };
        fetchInstitutions();
    }, []);

    const { mutate, isPending } = useMutation({
        mutationFn: (data: RegisterFormData) =>
            register(data.name, data.designation, data.institutionId, data.email, data.phone, data.password),
        onSuccess: () => {
            toast.success("Registration successful! Welcome aboard!");
            navigate("/", { replace: true });
        },
        onError: (err: any) => {
            toast.error(err?.message || "Registration failed. Please try again.");
        },
    });

    const onSubmit = (data: RegisterFormData) => {
        mutate(data);
    };

    return (
        <div className="min-h-screen grid place-items-center bg-gradient-to-br from-background via-background to-accent/5 p-4">
            <Card className="w-full max-w-2xl border-2 shadow-lg">
                <CardHeader>
                    <CardTitle className="text-2xl">Create Account</CardTitle>
                    <CardDescription>Register to access the Student Cumulative Record System</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Name */}
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Full Name</FormLabel>
                                            <div className="relative">
                                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <FormControl>
                                                    <Input
                                                        placeholder="Dr. John Smith"
                                                        className="pl-9"
                                                        {...field}
                                                    />
                                                </FormControl>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Designation */}
                                <FormField
                                    control={form.control}
                                    name="designation"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Designation</FormLabel>
                                            <div className="relative">
                                                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <FormControl>
                                                    <Input
                                                        placeholder="Professor"
                                                        className="pl-9"
                                                        {...field}
                                                    />
                                                </FormControl>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Institution - Full Width */}
                            <FormField
                                control={form.control}
                                name="institutionId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Institution</FormLabel>
                                        <Select
                                            onValueChange={(value) => field.onChange(parseInt(value))}
                                            value={field.value?.toString()}
                                            disabled={loadingInstitutions}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select your institution" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {institutions.map((inst) => (
                                                    <SelectItem key={inst.id} value={inst.id.toString()}>
                                                        {inst.institutionName}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Email */}
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <FormControl>
                                                    <Input
                                                        type="email"
                                                        placeholder="you@example.com"
                                                        className="pl-9"
                                                        {...field}
                                                    />
                                                </FormControl>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Phone */}
                                <FormField
                                    control={form.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Phone Number</FormLabel>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <FormControl>
                                                    <Input
                                                        type="tel"
                                                        inputMode="numeric"
                                                        maxLength={10}
                                                        placeholder="9876543210"
                                                        className="pl-9"
                                                        {...field}
                                                        onInput={(e) => {
                                                            const input = e.target as HTMLInputElement;
                                                            input.value = input.value.replace(/\D/g, "");
                                                            field.onChange(input.value);
                                                        }}
                                                    />
                                                </FormControl>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Password */}
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <FormControl>
                                                    <Input
                                                        type="password"
                                                        placeholder="••••••••"
                                                        className="pl-9"
                                                        {...field}
                                                    />
                                                </FormControl>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Confirm Password */}
                                <FormField
                                    control={form.control}
                                    name="confirmPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Confirm Password</FormLabel>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <FormControl>
                                                    <Input
                                                        type="password"
                                                        placeholder="••••••••"
                                                        className="pl-9"
                                                        {...field}
                                                    />
                                                </FormControl>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <Button type="submit" className="w-full" disabled={isPending}>
                                {isPending ? "Creating account..." : "Create Account"}
                            </Button>

                            <p className="text-sm text-center text-muted-foreground">
                                Already have an account?{" "}
                                <Link to="/login" className="text-primary hover:underline font-medium">
                                    Sign in
                                </Link>
                            </p>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
