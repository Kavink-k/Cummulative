
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useRef } from "react";
import { Upload, X, User } from "lucide-react";
import { toast } from "sonner";
import { checkStudentId } from "@/lib/api"; 

const personalProfileSchema = z.object({
  studentId: z.string().min(1, "Student ID is required"),
  studentName: z.string().min(2, "Name must be at least 2 characters").max(100),
  age: z.coerce.number().min(1, "Age is required"),
  gender: z.string().min(1, "Gender is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  nationality: z.string().min(1, "Nationality is required"),
  religion: z.string().min(1, "Religion is required"),
  community: z.string().min(1, "Community is required"),
  nativity: z.string().min(1, "Nativity is required"),
  maritalStatus: z.string().min(1, "Marital status is required"),
  parentGuardianName: z.string().min(2, "Parent/Guardian name is required").max(100),
  motherTongue: z.string().min(1, "Mother tongue is required"),
  communicationAddress: z.string().min(5, "Communication address is required").max(500),
  permanentAddress: z.string().min(5, "Permanent address is required").max(500),
  contactMobile: z.string().regex(/^[0-9]{10}$/, "Mobile number must be 10 digits"),
  studentEmail: z.string().email("Invalid email address"),
  aadharNo: z.string().regex(/^[0-9]{12}$/, "Aadhar number must be 12 digits"),
  ociNumber: z.string().optional(),
  emisNo: z.string().min(1, "EMIS number is required"),
  mediumOfInstruction: z.string().min(1, "Medium of instruction is required"),
  photo: z.union([z.string(), z.null(), z.undefined()]).optional(), // Photo URL from backend - can be string, null, or undefined
  id: z.number().optional(), // Database ID from backend
  photoUrl: z.string().optional().nullable(), // Alternative photo field name from backend
}).passthrough(); // Allow extra fields from backend without validation errors

type PersonalProfileFormData = z.infer<typeof personalProfileSchema>;

interface PersonalProfileFormProps {
  onSubmit: (data: PersonalProfileFormData & { photoFile?: File | null }) => void;
  defaultValues?: Partial<PersonalProfileFormData>;
  onProgressChange?: (progress: number) => void;
}

export const PersonalProfileForm = ({ onSubmit, defaultValues, onProgressChange }: PersonalProfileFormProps) => {
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  // Track if photo was uploaded locally (not from backend)
  // This prevents the uploaded photo from being overwritten when navigating between steps
  const [isLocalPhoto, setIsLocalPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // const form = useForm<PersonalProfileFormData>({
  //   resolver: zodResolver(personalProfileSchema),
  //   defaultValues: defaultValues || {},
  //   mode: 'onSubmit', // Only validate on submit
  // });

  const defaultFormValues: Partial<PersonalProfileFormData> = {
    studentId: "",
    studentName: "",
    age: 0,
    gender: "",
    dateOfBirth: "",
    nationality: "",
    religion: "",
    community: "",
    nativity: "",
    maritalStatus: "",
    parentGuardianName: "",
    motherTongue: "",
    communicationAddress: "",
    permanentAddress: "",
    contactMobile: "",
    studentEmail: "",
    aadharNo: "",
    ociNumber: "",
    emisNo: "",
    mediumOfInstruction: "",
  };

  const form = useForm<PersonalProfileFormData>({
    resolver: zodResolver(personalProfileSchema),
    // Merge defaults so no field is ever undefined
    defaultValues: {
      ...defaultFormValues,
      ...defaultValues,
    },
    mode: 'onSubmit',
  });



  // Load saved photo from defaultValues ONLY on initial mount (not on re-renders)
  // This prevents the uploaded photo from disappearing when clicking on input fields
  const hasLoadedInitialPhoto = useRef(false);

  useEffect(() => {
    // Only run once on mount to load backend photo
    if (hasLoadedInitialPhoto.current) return;

    // Backend returns 'photoUrl' but form uses 'photo'
    const photoUrl = defaultValues?.photo || (defaultValues as any)?.photoUrl;

    if (photoUrl) {
      // If there's a saved photo URL from the backend, display it
      const fullPhotoUrl = photoUrl.startsWith('http')
        ? photoUrl
        : `${import.meta.env.VITE_BACKEND_URL}${photoUrl}`;
      setPhotoPreview(fullPhotoUrl);
      // Clear photoFile since we're showing a saved photo from backend
      setPhotoFile(null);
    }

    hasLoadedInitialPhoto.current = true;
  }, []); // Empty dependency array = only run on mount

  useEffect(() => {
    const subscription = form.watch((values) => {
      const requiredFields = [
        "studentId", "studentName", "age", "gender", "dateOfBirth",
        "nationality", "religion", "community", "nativity", "maritalStatus",
        "parentGuardianName", "motherTongue", "communicationAddress",
        "permanentAddress", "contactMobile", "studentEmail", "aadharNo",
        "emisNo", "mediumOfInstruction"
      ];
      const filledFields = requiredFields.filter(
        (field) => values[field as keyof typeof values] && values[field as keyof typeof values]?.toString().trim() !== ""
      ).length;
      const progress = (filledFields / requiredFields.length) * 100;
      onProgressChange?.(progress);
    });
    return () => subscription.unsubscribe();
  }, [form, onProgressChange]);

  // Handle photo file selection
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      setPhotoFile(file);
      // Mark this as a locally uploaded photo (not from backend)
      setIsLocalPhoto(true);

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle photo removal
  const handleRemovePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    setIsLocalPhoto(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

// Handle form submission with studentId check
// const handleFormSubmit = async (data: PersonalProfileFormData) => {
//   console.log("🔍 Checking studentId before saving...");

//   try {
//     const res = await checkStudentId(data.studentId);

//     // If API returns 200 → student exists
//     if (res?.data) {
//       toast.error("Student already exists!");
//       return; // ❌ stop submission
//     }
//   } catch (error: any) {
//     // If backend returns 404 → student not found → OK
//     if (error?.response?.status === 404) {
//       console.log("StudentId not found. Proceeding...");
//     } else {
//       toast.error("Server error while checking student ID");
//       return;
//     }
//   }

//   // If reached here → ID is NEW → continue your old flow
//   const submissionData = {
//     ...data,
//     photoFile,
//     photoUrl: (!photoPreview && !photoFile) ? "" : data.photo,
//   };

//   console.log("Saving new student profile...");
//   onSubmit(submissionData);
// };
const handleFormSubmit = async (data: PersonalProfileFormData) => {
  console.log("🔍 Checking studentId before saving...");

  const isEditMode = !!defaultValues?.id;

  // 🟡 Only check student ID if it's a NEW form
  if (!isEditMode) {
    try {
      const res = await checkStudentId(data.studentId);

      if (res?.data) {
        toast.error("Student already exists!");
        return; // ❌ stop submission
      }
    } catch (error: any) {
      if (error?.response?.status === 404) {
        // Not found = OK
      } else {
        toast.error("Server error while checking student ID");
        return;
      }
    }
  } else {
    console.log("✏️ Edit mode: Skipping studentId duplicate check");
  }

  // 🟢 Proceed with save (same as before)
  const submissionData = {
    ...data,
    photoFile,
    photoUrl: (!photoPreview && !photoFile) ? "" : data.photo,
  };

  onSubmit(submissionData);
};


  // Handle form errors
  const handleFormError = (errors: any) => {
    console.error('❌ Form validation FAILED!');
    console.error('Validation errors:', errors);

    // Log detailed error information
    Object.keys(errors).forEach(fieldName => {
      console.error(`Field "${fieldName}" error:`, errors[fieldName]);
      console.error(`  - Type: ${errors[fieldName].type}`);
      console.error(`  - Message: ${errors[fieldName].message}`);
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit, handleFormError)} className="space-y-6">
        {/* Photo Upload Section - Passport Size */}
        <div className="flex flex-col items-center gap-4 p-6 border-2 border-dashed border-border rounded-lg bg-muted/20">
          <div className="relative">
            {photoPreview ? (
              <div className="relative group">
                <img
                  src={photoPreview}
                  alt="Passport photo preview"
                  className="w-40 h-52 object-cover border-4 border-primary shadow-lg rounded-sm"
                  style={{ aspectRatio: '3/4' }}
                />
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1.5 shadow-md hover:bg-destructive/90 transition-colors"
                  title="Remove photo"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="w-40 h-52 bg-muted border-4 border-border flex flex-col items-center justify-center rounded-sm" style={{ aspectRatio: '3/4' }}>
                <User className="h-20 w-20 text-muted-foreground" />
                <p className="text-xs text-muted-foreground mt-2">Passport Size</p>
              </div>
            )}
          </div>

          <div className="flex flex-col items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              onChange={handlePhotoChange}
              className="hidden"
              id="photo-upload"
            />
            <label htmlFor="photo-upload">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                {photoPreview ? 'Change Photo' : 'Upload Photo'}
              </Button>
            </label>
            <p className="text-xs text-muted-foreground">Max size: 5MB (JPG,JPEG, PNG)</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Added Student ID field */}
          <FormField
            control={form.control}
            name="studentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Student ID</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. E25CY086" {...field} className="uppercase" />
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
                <FormLabel>Name of Student (Block Letters)</FormLabel>
                <FormControl>
                  <Input placeholder="JOHN DOE" {...field} className="uppercase" />
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
                  <Input type="number" placeholder="18" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                  <Textarea placeholder="Enter communication address" {...field} rows={3} />
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
                  <Textarea placeholder="Enter permanent address" {...field} rows={3} />
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
                  <Input
                    type="text"
                    inputMode="numeric"
                    maxLength={10}
                    pattern="[0-9]*"
                    placeholder="9876543210"
                    {...field}
                    onInput={(e) => {
                      const input = e.target as HTMLInputElement;
                      input.value = input.value.replace(/\D/g, ""); // remove non-numeric
                      field.onChange(input.value); // update RHF properly
                    }}
                  />
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
                  <Input type="email" placeholder="student@example.com" {...field} />
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
                  <Input placeholder="123456789012" maxLength={12} {...field} onInput={(e) => {
                    const input = e.target as HTMLInputElement;
                    input.value = input.value.replace(/\D/g, ""); // remove non-numeric
                    field.onChange(input.value); // update RHF properly
                  }} />
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

        <div className="flex justify-end">
          <Button type="submit">Save Personal Profile</Button>
        </div>
      </form>
    </Form>
  );
};