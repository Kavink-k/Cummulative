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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useRef } from "react";
import { Upload, X, User } from "lucide-react";
import { toast } from "sonner";

// Schema (photoUrl removed)
const personalProfileSchema = z.object({
  studentId: z.string().min(1, "Student ID is required"),
  studentName: z.string().min(2, "Name must be at least 2 characters").max(100),
  age: z.string().min(1, "Age is required"),
  gender: z.string().min(1, "Gender is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  nationality: z.string().min(1, "Nationality is required"),
  religion: z.string().min(1, "Religion is required"),
  community: z.string().min(1, "Community is required"),
  nativity: z.string().min(1, "Nativity is required"),
  maritalStatus: z.string().min(1, "Marital status is required"),
  parentGuardianName: z
    .string()
    .min(2, "Parent/Guardian name is required")
    .max(100),
  motherTongue: z.string().min(1, "Mother tongue is required"),
  communicationAddress: z
    .string()
    .min(5, "Communication address is required")
    .max(500),
  permanentAddress: z.string().min(5, "Permanent address is required").max(500),
  contactMobile: z
    .string()
    .regex(/^[0-9]{10}$/, "Mobile number must be 10 digits"),
  studentEmail: z.string().email("Invalid email address"),
  aadharNo: z.string().regex(/^[0-9]{12}$/, "Aadhar number must be 12 digits"),
  ociNumber: z.string().optional(),
  emisNo: z.string().min(1, "EMIS number is required"),
  mediumOfInstruction: z.string().min(1, "Medium of instruction is required"),
});

type PersonalProfileFormData = z.infer<typeof personalProfileSchema>;

interface PersonalProfileFormProps {
  onSubmit: (data: PersonalProfileFormData, photoFile: File | null) => void;
  defaultValues?: Partial<PersonalProfileFormData>;
  onProgressChange?: (progress: number) => void;
}

export const PersonalProfileForm = ({
  onSubmit,
  defaultValues,
  onProgressChange,
}: PersonalProfileFormProps) => {
  const form = useForm<PersonalProfileFormData>({
    resolver: zodResolver(personalProfileSchema),
    defaultValues: defaultValues || {},
  });

  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Calculate progress based on filled fields
  useEffect(() => {
    const subscription = form.watch((values) => {
      const requiredFields = Object.keys(personalProfileSchema.shape);
      const filledFields = requiredFields.filter(
        (field) => values[field] && values[field].toString().trim() !== ""
      ).length;
      const progress = (filledFields / requiredFields.length) * 100;
      onProgressChange?.(progress);
    });
    return () => subscription.unsubscribe();
  }, [form, onProgressChange]);

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file (JPG/PNG)");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size should be less than 2MB");
      return;
    }

    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
    toast.success("Photo selected successfully");
  };

  const handleRemovePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    toast.info("Photo removed");
  };

  const handleSubmit = (data: PersonalProfileFormData) => {
    onSubmit(data, photoFile);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="flex gap-6 items-start">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="studentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Student ID</FormLabel>
                  <FormControl>
                    <Input {...field} className="uppercase" placeholder="N26NS000" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="studentName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Student Name</FormLabel>
                  <FormControl>
                    <Input {...field} className="" placeholder="Enter Name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} placeholder="19"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <div className="w-32 h-40 border-2 border-dashed rounded-lg bg-muted/30 flex items-center justify-center">
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="h-16 w-16 opacity-50" />
                )}
              </div>
              {photoPreview && (
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                  onClick={handleRemovePhoto}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-4 w-4 mr-2" />{" "}
              {photoPreview ? "Change" : "Upload"}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoUpload}
            />
            <p className="text-xs text-muted-foreground text-center">
              Max 2MB
              <br />
              JPG, PNG
            </p>
          </div>
        </div>

        {/* Remaining form fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dateOfBirth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of Birth</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="nationality"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nationality</FormLabel>
                <FormControl>
                  <Input placeholder="Indian" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="religion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Religion</FormLabel>
                <FormControl>
                  <Input placeholder="Enter religion" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="community"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Community</FormLabel>
                <FormControl>
                  <Input placeholder="Enter community" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="nativity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nativity</FormLabel>
                <FormControl>
                  <Input placeholder="Enter nativity" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="maritalStatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Marital Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select marital status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="single">Single</SelectItem>
                    <SelectItem value="married">Married</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="parentGuardianName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name of Parent/Guardian</FormLabel>
                <FormControl>
                  <Input placeholder="Enter parent/guardian name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="motherTongue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mother Tongue</FormLabel>
                <FormControl>
                  <Input placeholder="Enter mother tongue" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="mediumOfInstruction"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Medium of Instruction</FormLabel>
                <FormControl>
                  <Input placeholder="English" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-6">
          <FormField
            control={form.control}
            name="communicationAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address for Communication</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter communication address"
                    {...field}
                    rows={3}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="permanentAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Permanent Address</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter permanent address"
                    {...field}
                    rows={3}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="contactMobile"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Mobile Number</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="9876543210" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="studentEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Student Email ID</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="student@example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="aadharNo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Student Aadhar Number</FormLabel>
                <FormControl>
                  <Input placeholder="123456789012" maxLength={12} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ociNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>OCI Number (If Applicable)</FormLabel>
                <FormControl>
                  <Input placeholder="Enter OCI number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="emisNo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Student EMIS Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter EMIS number" {...field} />
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
