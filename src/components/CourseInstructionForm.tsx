import { useState, useEffect, useRef } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

// Import your data file - ensure this path is correct
import { semesterData } from "./data/semesterData";
import semesterNotes from "../data/semesterNotes.json";

// Define the shape of a single course
// Schema for individual course - removed isSelected field
const courseSchema = z.object({
  sNo: z.string(),
  courseCode: z.string(),
  universityCourseCode: z.string().optional(),
  courseTitle: z.string(),
  theoryCredits: z.string().optional(),
  skillLabCredits: z.string().optional(),
  clinicalCredits: z.string().optional(),
  theoryPrescribed: z.string().optional(),
  theoryAttended: z.string().optional(),
  theoryPercentage: z.string().optional(),
  skillLabPrescribed: z.string().optional(),
  skillLabAttended: z.string().optional(),
  skillLabPercentage: z.string().optional(),
  clinicalPrescribed: z.string().optional(),
  clinicalAttended: z.string().optional(),
  clinicalPercentage: z.string().optional(),
  theoryInternalMax: z.string().optional(),
  theoryInternalObtained: z.string().optional(),
  theoryEndSemMax: z.string().optional(),
  theoryEndSemObtained: z.string().optional(),
  theoryTotalMax: z.string().optional(),
  theoryTotalObtained: z.string().optional(),
  practicalInternalMax: z.string().optional(),
  practicalInternalObtained: z.string().optional(),
  practicalEndSemMax: z.string().optional(),
  practicalEndSemObtained: z.string().optional(),
  practicalTotalMax: z.string().optional(),
  practicalTotalObtained: z.string().optional(),
  gradePoint: z.string().optional(),
  letterGrade: z.string().optional(),
  sgpa: z.string().optional(),
  rank: z.string().optional(),
});

// Main form schema - attempt is now required
const courseInstructionSchema = z.object({
  studentId: z.string().optional(),
  semester: z.string(),
  attempt: z.number(), // Required for per-semester attempts
  courses: z.array(courseSchema),
});

/////////// Non editable cells //////////

// Hide specific cells ONLY for specific semesters
const nonEditableCells: Record<string, Record<string, number[]>> = {
  I: {
    universityCourseCode: [7],
    theoryAttended: [7],
    theoryPercentage: [7],
    skillLabAttended: [7],
    skillLabPercentage: [7],
    clinicalAttended: [7],
    clinicalPercentage: [7],
    theoryInternalObtained: [7],
    theoryEndSemObtained: [7],
    theoryTotalObtained: [7],
    practicalInternalObtained: [7],
    practicalEndSemObtained: [7],
    practicalTotalObtained: [7],
    gradePoint: [7],
    letterGrade: [7],
    sgpa: [7],
    rank: [7],
  },
  II: {
    universityCourseCode: [5],
    theoryAttended: [5],
    theoryPercentage: [5],
    skillLabAttended: [5],
    skillLabPercentage: [5],
    clinicalAttended: [5],
    clinicalPercentage: [5],
    theoryInternalObtained: [5],
    theoryEndSemObtained: [5],
    theoryTotalObtained: [5],
    practicalInternalObtained: [5],
    practicalEndSemObtained: [5],
    practicalTotalObtained: [5],
    gradePoint: [5],
    letterGrade: [5],
    sgpa: [5],
    rank: [5],
  },
  III: {
    universityCourseCode: [5],
    theoryAttended: [5],
    theoryPercentage: [5],
    skillLabAttended: [5],
    skillLabPercentage: [5],
    clinicalAttended: [5],
    clinicalPercentage: [5],
    theoryInternalObtained: [5],
    theoryEndSemObtained: [5],
    theoryTotalObtained: [5],
    practicalInternalObtained: [5],
    practicalEndSemObtained: [5],
    practicalTotalObtained: [5],
    gradePoint: [5],
    letterGrade: [5],
    sgpa: [5],
    rank: [5],
  },
  IV: {
    universityCourseCode: [6],
    theoryAttended: [6],
    theoryPercentage: [6],
    skillLabAttended: [6],
    skillLabPercentage: [6],
    clinicalAttended: [6],
    clinicalPercentage: [6],
    theoryInternalObtained: [6],
    theoryEndSemObtained: [6],
    theoryTotalObtained: [6],
    practicalInternalObtained: [6],
    practicalEndSemObtained: [6],
    practicalTotalObtained: [6],
    gradePoint: [6],
    letterGrade: [6],
    sgpa: [6],
    rank: [6],
  },
  V: {
    universityCourseCode: [6],
    theoryAttended: [6],
    theoryPercentage: [6],
    skillLabAttended: [6],
    skillLabPercentage: [6],
    clinicalAttended: [6],
    clinicalPercentage: [6],
    theoryInternalObtained: [6],
    theoryEndSemObtained: [6],
    theoryTotalObtained: [6],
    practicalInternalObtained: [6],
    practicalEndSemObtained: [6],
    practicalTotalObtained: [6],
    gradePoint: [6],
    letterGrade: [6],
    sgpa: [6],
    rank: [6],
  },
  VI: {
    universityCourseCode: [5],
    theoryAttended: [5],
    theoryPercentage: [5],
    skillLabAttended: [5],
    skillLabPercentage: [5],
    clinicalAttended: [5],
    clinicalPercentage: [5],
    theoryInternalObtained: [5],
    theoryEndSemObtained: [5],
    theoryTotalObtained: [5],
    practicalInternalObtained: [5],
    practicalEndSemObtained: [5],
    practicalTotalObtained: [5],
    gradePoint: [5],
    letterGrade: [5],
    sgpa: [5],
    rank: [5],
  },
  VII: {
    universityCourseCode: [4],
    theoryAttended: [4],
    theoryPercentage: [4],
    skillLabAttended: [4],
    skillLabPercentage: [4],
    clinicalAttended: [4],
    clinicalPercentage: [4],
    theoryInternalObtained: [4],
    theoryEndSemObtained: [4],
    theoryTotalObtained: [4],
    practicalInternalObtained: [4],
    practicalEndSemObtained: [4],
    practicalTotalObtained: [4],
    gradePoint: [4],
    letterGrade: [4],
    sgpa: [4],
    rank: [4],
  },
  VIII: {
    universityCourseCode: [5],
    theoryAttended: [5],
    theoryPercentage: [5],
    skillLabAttended: [5],
    skillLabPercentage: [5],
    clinicalAttended: [5],
    clinicalPercentage: [5],
    theoryInternalObtained: [5],
    theoryEndSemObtained: [5],
    theoryTotalObtained: [5],
    practicalInternalObtained: [5],
    practicalEndSemObtained: [5],
    practicalTotalObtained: [5],
    gradePoint: [5],
    letterGrade: [5],
    sgpa: [5],
    rank: [5],
  },
};

function isEditable(semester: string, fieldName: string, rowIndex: number) {
  const semRules = nonEditableCells[semester];
  if (!semRules) return true; // editable unless semester has rules

  const disabledRows = semRules[fieldName];
  if (!disabledRows) return true; // editable if this field has no rule in this semester

  return !disabledRows.includes(rowIndex); // editable if row is not listed
}

/////////////////////

type CourseInstructionFormData = z.infer<typeof courseInstructionSchema>;

// Extended interface to support the new attempts structure
interface CourseInstructionFormProps {
  onSubmit: (data: CourseInstructionFormData) => void;
  defaultValues?: Partial<CourseInstructionFormData> & {
    attempts?: Array<{
      semester: string;
      attemptNumber: number;
      courses: any[];
    }>;
  };
  onProgressChange?: (progress: number) => void;
}

/**
 * Normalize a raw row from semesterData into the form-friendly object.
 * Updated to specifically handle the keys found in the generated semesterData.ts
 */
function normalizeRow(raw: Record<string, any>) {
  // Helper to safely get string values, handling potential casing issues
  const getValue = (key: string) => {
    // Try exact match first
    if (raw[key] !== undefined) return String(raw[key]).trim();

    // Fallback: lowercase match (in case data keys vary slightly)
    const lowerKey = key.toLowerCase();
    const foundKey = Object.keys(raw).find((k) => k.toLowerCase() === lowerKey);
    return foundKey ? String(raw[foundKey]).trim() : "";
  };

  // Helper for numbers
  const getNumber = (key: string) => {
    const val = getValue(key);
    const num = Number(val);
    return isNaN(num) ? 0 : num;
  };

  return {
    // 1. Basic Info
    sNo: getValue("s_no"),
    courseCode: getValue("course_code"),
    universityCourseCode: getValue("university_course_code"),
    courseTitle: getValue("course_title"),

    // 2. Credits
    theoryCredits: getValue("credits_theory"),
    skillLabCredits: getValue("skill_lab"),
    clinicalCredits: getValue("clinical"),

    // 3. Instruction Hours
    theoryPrescribed: getValue("course_instruction_hours_theory_prescribed"),
    theoryAttended: getValue("attended"), // Specific mapping for 'attended'
    theoryPercentage: getValue("theory_percentage"),

    skillLabPrescribed: getValue("skill_lab_prescribed"),
    skillLabAttended: getValue("skill_lab_attended"),
    skillLabPercentage: getValue("skill_lab_percentage"),

    clinicalPrescribed: getValue("clinical_prescribed"),
    clinicalAttended: getValue("clinical_attended"),
    clinicalPercentage: getValue("clinical_percentage"),

    // 4. Marks - Theory
    theoryInternalMax: getValue("marks_obtained_theory_internal_maximum"),
    theoryInternalObtained: getValue("obtained"), // Specific mapping for 'obtained'
    theoryEndSemMax: getValue(
      "end_semester_college_university_examination_maximum"
    ),
    theoryEndSemObtained: getValue("theory_end_sem_obtained"),
    theoryTotalMax: getValue("total_marks_maximum"),
    theoryTotalObtained: getValue("theory_total_obtained"),

    // 5. Marks - Practical
    practicalInternalMax: getValue("practical_internal_maximum"),
    practicalInternalObtained: getValue("practical_internal_obtained"),
    practicalEndSemMax: getValue("practical_end_semester_maximum"),
    practicalEndSemObtained: getValue("practical_end_semester_obtained"),
    practicalTotalMax: getValue("practical_total_maximum"),
    practicalTotalObtained: getValue("practical_total_obtained"),

    // 6. Grading
    gradePoint: getValue("grade_point"),
    letterGrade: getValue("letter_grade"),
  };
}

export const CourseInstructionForm = ({
  onSubmit,
  defaultValues,
  onProgressChange,
}: CourseInstructionFormProps) => {
  // State: Selected semester
  // Extract from first attempt if available, otherwise default to "I"
  const [selectedSemester, setSelectedSemester] = useState<string>(() => {
    if (defaultValues?.attempts && Array.isArray(defaultValues.attempts) && defaultValues.attempts.length > 0) {
      return defaultValues.attempts[0].semester || "I";
    }
    return "I";
  });
  
  // State: Per-semester attempts tracking (semester -> array of attempt numbers)
  // CRITICAL: Always start from 0, extract existing attempts from defaultValues
  const [attemptsBySemester, setAttemptsBySemester] = useState<Map<string, number[]>>(() => {
    const initialMap = new Map<string, number[]>();
    
    // Extract all existing attempts from defaultValues if available
    if (defaultValues?.attempts && Array.isArray(defaultValues.attempts)) {
      defaultValues.attempts.forEach((attempt: any) => {
        const sem = attempt.semester;
        const attemptNum = attempt.attemptNumber;
        
        if (!initialMap.has(sem)) {
          initialMap.set(sem, []);
        }
        const existing = initialMap.get(sem)!;
        if (!existing.includes(attemptNum)) {
          existing.push(attemptNum);
        }
      });
      
      // Ensure EVERY semester has Attempt 0 (even if not in data)
      initialMap.forEach((attempts, semester) => {
        if (!attempts.includes(0)) {
          attempts.unshift(0); // Add 0 at the beginning
        }
        attempts.sort((a, b) => a - b); // Sort: 0, 1, 2...
      });
    }
    
    // Ensure current semester is initialized with at least [0]
    // Extract first semester from attempts if available
    const currentSem = (defaultValues?.attempts && Array.isArray(defaultValues.attempts) && defaultValues.attempts.length > 0)
      ? defaultValues.attempts[0].semester
      : "I";
    if (!initialMap.has(currentSem)) {
      initialMap.set(currentSem, [0]);
    }
    
    return initialMap;
  });
  
  // State: Current selected attempt (starts from 0)
  const [selectedAttempt, setSelectedAttempt] = useState<number>(0);
  
  // State: Enabled rows per semester/attempt combination (key format: "semester-attempt")
  const [enabledRowsBySemesterAttempt, setEnabledRowsBySemesterAttempt] = useState<Map<string, Set<string>>>(() => {
    const initialMap = new Map<string, Set<string>>();
    // For attempt 0, all rows are enabled by default (will be handled in isRowEnabled)
    return initialMap;
  });

  // Helper to load and normalize template data from semesterData
  const getTemplateCoursesForSemester = (sem: string) => {
    const rawData = semesterData[sem as keyof typeof semesterData] || [];
    return rawData.map((r: any) => normalizeRow(r));
  };

  // Helper to merge saved data with template data for specific semester and attempt
  const getCoursesForSemester = (sem: string, attempt: number, savedData?: any) => {
    const templateCourses = getTemplateCoursesForSemester(sem);

    // Handle case where savedData is a single attempt object with courses directly
    // Format: { semester, attempt, courses: [...], studentId }
    if (savedData?.courses && Array.isArray(savedData.courses) && !savedData.attempts) {
      // Check if this matches the requested semester and attempt
      if (savedData.semester === sem && savedData.attempt === attempt) {
        return templateCourses.map((template: any) => {
          const saved = savedData.courses.find(
            (s: any) => s.sNo === template.sNo || s.courseCode === template.courseCode
          );
          return saved ? { ...template, ...saved } : template;
        });
      }
      return templateCourses;
    }

    // Handle standard format with attempts array
    // Format: { studentId, attempts: [{ semester, attemptNumber, courses }] }
    if (!savedData?.attempts || !Array.isArray(savedData.attempts)) {
      return templateCourses;
    }

    // Find the specific attempt data for this semester
    const attemptData = savedData.attempts.find(
      (a: any) => a.semester === sem && a.attemptNumber === attempt
    );

    // If no attempt data or courses, return template
    if (!attemptData?.courses || !Array.isArray(attemptData.courses)) {
      return templateCourses;
    }

    // Merge: for each template course, check if there's saved data
    const merged = templateCourses.map((template: any) => {
      const saved = attemptData.courses.find(
        (s: any) => s.sNo === template.sNo || s.courseCode === template.courseCode
      );

      // If found saved data, merge it with template (saved data takes priority)
      if (saved) {
        return { ...template, ...saved };
      }

      // Otherwise return template
      return template;
    });

    return merged;
  };

  // const form = useForm<CourseInstructionFormData>({
  //   resolver: zodResolver(courseInstructionSchema),
  //   defaultValues: defaultValues || {
  //     studentId: "",
  //     semester: selectedSemester,
  //     courses: getCoursesForSemester(selectedSemester, defaultValues?.courses),
  //   },
  // });
  const form = useForm({
    resolver: zodResolver(courseInstructionSchema),
    defaultValues: {
      studentId: defaultValues?.studentId || "",
      semester: (() => {
        // Extract semester from first attempt if available
        if (defaultValues?.attempts && Array.isArray(defaultValues.attempts) && defaultValues.attempts.length > 0) {
          return defaultValues.attempts[0].semester;
        }
        return selectedSemester;
      })(),
      courses: getCoursesForSemester(
        (() => {
          // Use same logic to get initial semester
          if (defaultValues?.attempts && Array.isArray(defaultValues.attempts) && defaultValues.attempts.length > 0) {
            return defaultValues.attempts[0].semester;
          }
          return selectedSemester;
        })(),
        0, // Start with attempt 0
        defaultValues
      ),
      attempt: 0, // Attempts start from 0
    },
  });
  const { fields, replace } = useFieldArray({
    control: form.control,
    name: "courses",
  });
  
  // Track if we've already initialized with defaultValues to prevent infinite loops
  const initializedWithData = useRef(false);
  const lastDefaultValues = useRef<string>("");
  
  ///////////
  useEffect(() => {
    // Convert defaultValues to string to check if it actually changed
    const currentData = JSON.stringify(defaultValues);
    
    // Only run if data actually changed (not just reference)
    if (currentData === lastDefaultValues.current) {
      return; // No change, skip
    }
    
    lastDefaultValues.current = currentData;
    
    // CRITICAL FIX: Update selectedSemester and selectedAttempt from saved data
    // This ensures the form displays the correct semester/attempt in edit mode
    let targetSemester = selectedSemester;
    let targetAttempt = 0;
    
    if (defaultValues?.attempts && Array.isArray(defaultValues.attempts) && defaultValues.attempts.length > 0) {
      // Use the first attempt's semester and attempt number
      targetSemester = defaultValues.attempts[0].semester || selectedSemester;
      targetAttempt = defaultValues.attempts[0].attemptNumber || 0;
      
      // Update states to match the saved data
      if (targetSemester !== selectedSemester) {
        setSelectedSemester(targetSemester);
      }
      if (targetAttempt !== selectedAttempt) {
        setSelectedAttempt(targetAttempt);
      }
    }
    
    const initialCourses = getCoursesForSemester(targetSemester, targetAttempt, defaultValues);
    
    // CRITICAL: Use form.reset() instead of just replace() to update ALL form fields
    // This ensures the entire form (studentId, semester, attempt, courses) is updated
    form.reset({
      studentId: defaultValues?.studentId || "",
      semester: targetSemester,
      attempt: targetAttempt,
      courses: initialCourses,
    });
    
    // Initialize enabled rows for the target attempt if we have saved data
    if (defaultValues?.attempts) {
      const attemptData = defaultValues.attempts.find(
        (a: any) => a.semester === targetSemester && a.attemptNumber === targetAttempt
      );
      if (attemptData?.courses) {
        const key = getAttemptKey(targetSemester, targetAttempt);
        const enabledRows = new Set(attemptData.courses.map((c: any) => c.sNo));
        setEnabledRowsBySemesterAttempt(new Map(enabledRowsBySemesterAttempt.set(key, enabledRows)));
      }
    }
    
    // Handle direct course format too
    if (defaultValues?.courses && Array.isArray(defaultValues.courses) && !defaultValues.attempts) {
      if (defaultValues.semester && defaultValues.attempt !== undefined) {
        targetSemester = defaultValues.semester;
        targetAttempt = defaultValues.attempt;
        
        if (targetSemester !== selectedSemester) {
          setSelectedSemester(targetSemester);
        }
        if (targetAttempt !== selectedAttempt) {
          setSelectedAttempt(targetAttempt);
        }
        
        const key = getAttemptKey(targetSemester, targetAttempt);
        const enabledRows = new Set(defaultValues.courses.map((c: any) => c.sNo).filter(Boolean));
        setEnabledRowsBySemesterAttempt(new Map(enabledRowsBySemesterAttempt.set(key, enabledRows)));
      }
    }
    
    initializedWithData.current = true;
  }, [defaultValues]); // Keep dependency but use ref to prevent infinite loops

  // Handle Semester Change
  const handleSemesterChange = (semester: string) => {
    setSelectedSemester(semester);
    form.setValue("semester", semester);

    // Get or initialize attempts for this semester
    let semesterAttempts = attemptsBySemester.get(semester);
    if (!semesterAttempts) {
      semesterAttempts = [0]; // Initialize with attempt 0
      setAttemptsBySemester(new Map(attemptsBySemester.set(semester, semesterAttempts)));
    }

    // Set to first attempt (0)
    setSelectedAttempt(0);
    form.setValue("attempt", 0);

    // Load courses for this semester, attempt 0
    const newCourses = getCoursesForSemester(semester, 0, defaultValues);
    replace(newCourses);
    
    // Load enabled rows for this semester/attempt if saved data exists
    if (defaultValues?.attempts) {
      const attemptData = defaultValues.attempts.find(
        (a: any) => a.semester === semester && a.attemptNumber === 0
      );
      if (attemptData?.courses) {
        const key = getAttemptKey(semester, 0);
        const enabledRows = new Set(attemptData.courses.map((c: any) => c.sNo));
        setEnabledRowsBySemesterAttempt(new Map(enabledRowsBySemesterAttempt.set(key, enabledRows)));
      }
    }
  };

  // Get the key for enabledRowsBySemesterAttempt Map
  const getAttemptKey = (semester: string, attempt: number) => `${semester}-${attempt}`;

  // Handle Add Attempt - creates new attempt for current semester only
  const handleAddAttempt = () => {
    const currentAttempts = attemptsBySemester.get(selectedSemester) || [0];
    const newAttemptNumber = Math.max(...currentAttempts) + 1;
    
    // Add new attempt to current semester
    const updatedAttempts = [...currentAttempts, newAttemptNumber];
    setAttemptsBySemester(new Map(attemptsBySemester.set(selectedSemester, updatedAttempts)));
    setSelectedAttempt(newAttemptNumber);
    form.setValue("attempt", newAttemptNumber);

    // Load fresh template with all editable fields empty
    const templateCourses = getTemplateCoursesForSemester(selectedSemester);
    replace(templateCourses);
    
    // Initialize with all rows disabled (empty Set)
    const key = getAttemptKey(selectedSemester, newAttemptNumber);
    setEnabledRowsBySemesterAttempt(new Map(enabledRowsBySemesterAttempt.set(key, new Set<string>())));
  };

  // Handle Attempt Change - loads data for specific semester/attempt
  const handleAttemptChange = (attempt: number) => {
    setSelectedAttempt(attempt);
    form.setValue("attempt", attempt);

    // Load data for selected semester and attempt
    const attemptCourses = getCoursesForSemester(selectedSemester, attempt, defaultValues);
    replace(attemptCourses);
    
    // Load enabled rows for this attempt if saved data exists
    if (defaultValues?.attempts) {
      const attemptData = defaultValues.attempts.find(
        (a: any) => a.semester === selectedSemester && a.attemptNumber === attempt
      );
      if (attemptData?.courses) {
        const key = getAttemptKey(selectedSemester, attempt);
        const enabledRows = new Set(attemptData.courses.map((c: any) => c.sNo));
        setEnabledRowsBySemesterAttempt(new Map(enabledRowsBySemesterAttempt.set(key, enabledRows)));
      }
    }
  };

  // Toggle row enabled/disabled
  const handleToggleRow = (sNo: string) => {
    const key = getAttemptKey(selectedSemester, selectedAttempt);
    const currentEnabledRows = enabledRowsBySemesterAttempt.get(key) || new Set<string>();
    const newEnabledRows = new Set(currentEnabledRows);
    
    if (newEnabledRows.has(sNo)) {
      // Disable: remove from set and clear editable field values
      newEnabledRows.delete(sNo);
      clearRowEditableFields(sNo);
    } else {
      // Enable: add to set
      newEnabledRows.add(sNo);
    }
    
    setEnabledRowsBySemesterAttempt(new Map(enabledRowsBySemesterAttempt.set(key, newEnabledRows)));
  };

  // Clear editable fields for a row when disabling
  const clearRowEditableFields = (sNo: string) => {
    const courses = form.getValues("courses");
    const index = courses.findIndex((c: any) => c.sNo === sNo);
    
    if (index >= 0) {
      const editableFields = [
        'theoryAttended', 'theoryPercentage',
        'skillLabAttended', 'skillLabPercentage',
        'clinicalAttended', 'clinicalPercentage',
        'theoryInternalObtained', 'theoryEndSemObtained', 'theoryTotalObtained',
        'practicalInternalObtained', 'practicalEndSemObtained', 'practicalTotalObtained',
        'gradePoint', 'letterGrade', 'sgpa', 'rank', 'universityCourseCode'
      ];
      
      editableFields.forEach(field => {
        form.setValue(`courses.${index}.${field}` as any, '');
      });
    }
  };

  // Check if row is enabled (for attempt 0, all rows are enabled by default)
  const isRowEnabled = (sNo: string) => {
    // For attempt 0, all rows are enabled by default
    if (selectedAttempt === 0) return true;
    
    const key = getAttemptKey(selectedSemester, selectedAttempt);
    const enabledRows = enabledRowsBySemesterAttempt.get(key) || new Set<string>();
    return enabledRows.has(sNo);
  };

  // Progress Tracking
  useEffect(() => {
    const subscription = form.watch((values) => {
      let filledFields = 0;
      // Fields to check for progress calculation
      const fieldsPerCourse = ["theoryAttended", "theoryInternalObtained"];

      values.courses?.forEach((course: any) => {
        if (course) {
          filledFields += fieldsPerCourse.filter(
            (field) => course[field] && String(course[field]).trim() !== ""
          ).length;
        }
      });

      const totalRequiredFields = (fields.length || 1) * fieldsPerCourse.length;
      const progress =
        totalRequiredFields > 0
          ? (filledFields / totalRequiredFields) * 100
          : 0;
      onProgressChange?.(progress);
    });
    return () => subscription.unsubscribe();
  }, [form, onProgressChange, fields.length]);

  // Sync Student ID
  useEffect(() => {
    if (defaultValues?.studentId) {
      const currentId = form.getValues("studentId");
      if (!currentId) {
        form.setValue("studentId", defaultValues.studentId || "");
      }
    }
  }, [defaultValues, form]);

  // CRITICAL: Sync attempt field with selectedAttempt state
  // This ensures the form always submits the correct attempt number
  useEffect(() => {
    form.setValue("attempt", selectedAttempt);
  }, [selectedAttempt, form]);

  // Handle form submission - filter courses by enabled rows
  const handleFormSubmit = (data: CourseInstructionFormData) => {
    const key = getAttemptKey(selectedSemester, selectedAttempt);
    const enabledRows = enabledRowsBySemesterAttempt.get(key) || new Set<string>();
    
    // For attempt 0, include all courses; otherwise filter by enabled rows
    const filteredCourses = selectedAttempt === 0 
      ? data.courses
      : data.courses.filter(c => enabledRows.has(c.sNo));
    
    // Structure data for backend: {studentId, semester, attempt, courses}
    const submissionData = {
      studentId: data.studentId,
      semester: selectedSemester,
      attempt: selectedAttempt,
      courses: filteredCourses
    };
    
    onSubmit(submissionData);
  };

  return (
    <Form {...form}>
      <form
        id="active-form"
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-6"
      >
        <FormField
          control={form.control}
          name="studentId"
          render={({ field }) => (
            <input type="hidden" {...field} value={field.value || ""} />
          )}
        />

        <div className="flex items-center gap-4">
          <label className="font-semibold">Select Semester:</label>
          <Select value={selectedSemester} onValueChange={handleSemesterChange}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {["I", "II", "III", "IV", "V", "VI", "VII", "VIII"].map((sem) => (
                <SelectItem key={sem} value={sem}>
                  Semester {sem}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-4">
          <Button
            type="button"
            onClick={handleAddAttempt}
            variant="outline"
            size="sm"
          >
            + Add Attempt
          </Button>

          {/* Show attempt dropdown if more than one attempt exists for current semester */}
          {(attemptsBySemester.get(selectedSemester)?.length || 0) > 1 && (
            <>
              <label className="font-semibold">Attempt:</label>
              <Select value={String(selectedAttempt)} onValueChange={(v) => handleAttemptChange(Number(v))}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(attemptsBySemester.get(selectedSemester) || []).map((attempt) => (
                    <SelectItem key={attempt} value={String(attempt)}>
                      Attempt {attempt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </>
          )}
        </div>

        {/* Removed selection mode banner - now using +/× toggles per row */}

        <div className="border rounded-lg overflow-x-auto">
          <Table>
            <TableHeader>
              {/* Header Rows */}
              <TableRow className="bg-muted/50 text-xs">
                {/* Action column for row enable/disable toggle (only for attempt > 0) */}
                <TableHead
                  rowSpan={4}
                  className="border-r text-center align-middle min-w-16"
                >
                  {selectedAttempt > 0 ? 'Action' : ''}
                </TableHead>
                <TableHead
                  rowSpan={4}
                  className="border-r text-center align-middle min-w-12"
                >
                  S.No
                </TableHead>
                <TableHead
                  rowSpan={4}
                  className="border-r text-center align-middle min-w-32"
                >
                  Course Code
                </TableHead>
                <TableHead
                  rowSpan={4}
                  className="border-r text-center align-middle min-w-32"
                >
                  University Course Code
                </TableHead>
                <TableHead
                  rowSpan={4}
                  className="border-r text-center align-middle min-w-48"
                >
                  Course Title
                </TableHead>
                <TableHead
                  colSpan={3}
                  className="border-r text-center align-middle"
                >
                  Credits
                </TableHead>
                <TableHead
                  colSpan={9}
                  className="border-r text-center align-middle"
                >
                  Course Instruction Hours
                </TableHead>
                <TableHead
                  colSpan={12}
                  className="border-r text-center align-middle"
                >
                  Marks Obtained
                </TableHead>
                <TableHead
                  rowSpan={4}
                  className="border-r text-center align-middle min-w-20"
                >
                  Grade Point
                </TableHead>
                <TableHead
                  rowSpan={4}
                  className="border-r text-center align-middle min-w-20"
                >
                  Letter Grade
                </TableHead>
                <TableHead
                  rowSpan={4}
                  className="border-r text-center align-middle min-w-20"
                >
                  SGPA
                </TableHead>
                <TableHead
                  rowSpan={4}
                  className="border-r text-center align-middle min-w-20"
                >
                  Rank
                </TableHead>
              </TableRow>

              <TableRow className="bg-muted/50 text-xs">
                <TableHead
                  rowSpan={3}
                  className="border-r text-center align-middle"
                >
                  Theory
                </TableHead>
                <TableHead
                  rowSpan={3}
                  className="border-r text-center align-middle"
                >
                  Skill Lab
                </TableHead>
                <TableHead
                  rowSpan={3}
                  className="border-r text-center align-middle"
                >
                  Clinical
                </TableHead>

                <TableHead
                  colSpan={3}
                  className="border-r text-center align-middle"
                >
                  Theory
                </TableHead>
                <TableHead
                  colSpan={3}
                  className="border-r text-center align-middle"
                >
                  Skill Lab
                </TableHead>
                <TableHead
                  colSpan={3}
                  className="border-r text-center align-middle"
                >
                  Clinical
                </TableHead>

                <TableHead
                  colSpan={6}
                  className="border-r text-center align-middle"
                >
                  Theory
                </TableHead>
                <TableHead
                  colSpan={6}
                  className="border-r text-center align-middle"
                >
                  Practical
                </TableHead>
              </TableRow>

              <TableRow className="bg-muted/50 text-xs">
                <TableHead rowSpan={2} className="border-r text-center">
                  Prescribed
                </TableHead>
                <TableHead rowSpan={2} className="border-r text-center">
                  Attended
                </TableHead>
                <TableHead rowSpan={2} className="border-r text-center">
                  %
                </TableHead>

                <TableHead rowSpan={2} className="border-r text-center">
                  Prescribed
                </TableHead>
                <TableHead rowSpan={2} className="border-r text-center">
                  Attended
                </TableHead>
                <TableHead rowSpan={2} className="border-r text-center">
                  %
                </TableHead>

                <TableHead rowSpan={2} className="border-r text-center">
                  Prescribed
                </TableHead>
                <TableHead rowSpan={2} className="border-r text-center">
                  Attended
                </TableHead>
                <TableHead rowSpan={2} className="border-r text-center">
                  %
                </TableHead>

                <TableHead colSpan={2} className="border-r text-center">
                  Internal
                </TableHead>
                <TableHead colSpan={2} className="border-r text-center">
                  End Sem / College Examination
                </TableHead>
                <TableHead colSpan={2} className="border-r text-center">
                  Total
                </TableHead>

                <TableHead colSpan={2} className="border-r text-center">
                  Internal
                </TableHead>
                <TableHead colSpan={2} className="border-r text-center">
                  End Sem / College Examination
                </TableHead>
                <TableHead colSpan={2} className="border-r text-center">
                  Total
                </TableHead>
              </TableRow>

              <TableRow className="bg-muted/50 text-xs">
                <TableHead className="border-r text-center">Max</TableHead>
                <TableHead className="border-r text-center">Obt</TableHead>
                <TableHead className="border-r text-center">Max</TableHead>
                <TableHead className="border-r text-center">Obt</TableHead>
                <TableHead className="border-r text-center">Max</TableHead>
                <TableHead className="border-r text-center">Obt</TableHead>
                <TableHead className="border-r text-center">Max</TableHead>
                <TableHead className="border-r text-center">Obt</TableHead>
                <TableHead className="border-r text-center">Max</TableHead>
                <TableHead className="border-r text-center">Obt</TableHead>
                <TableHead className="border-r text-center">Max</TableHead>
                <TableHead className="border-r text-center">Obt</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {fields.map((field, index) => {
                const isSemVIII = selectedSemester === "VIII";

                // Define merged row conditions (0-indexed, so 5th row is index 4)
                const isMergedRow =
                  (selectedSemester === "I" && index === 6) || // 7th row
                  (selectedSemester === "II" && index === 4) || // 5th row
                  (selectedSemester === "III" && index === 4) || // 5th row
                  (selectedSemester === "IV" && index === 5); // 6th row

                return (
                  <TableRow
                    key={field.id}
                    className="hover:bg-muted/30 text-xs"
                  >
                    {/* --- ACTION COLUMN: +/× Toggle Button ---  */}
                    <TableCell className="border-r text-center">
                      {selectedAttempt > 0 ? (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => handleToggleRow(field.sNo)}
                        >
                          {isRowEnabled(field.sNo) ? '×' : '+'}
                        </Button>
                      ) : (
                        // Empty cell for attempt 0
                        <span></span>
                      )}
                    </TableCell>

                    {/* --- COLUMNS 1-4 (Always Visible) --- */}

                    {/* 1. S.No */}
                    <TableCell className="border-r text-center">
                      {field.sNo}
                    </TableCell>

                    {/* 2. Course Code */}
                    <TableCell className="border-r">
                      {field.courseCode}
                    </TableCell>

                    {/* 3. University Course Code */}
                    <TableCell className="border-r text-center">
                      <FormField
                        control={form.control}
                        name={`courses.${index}.universityCourseCode`}
                        render={({ field: formField }) => (
                          <FormItem>
                            <FormControl>
                              {isEditable(
                                selectedSemester,
                                "universityCourseCode",
                                index
                              ) ? (
                                // SHOW INPUT only when editable
                                <Input
                                  {...formField}
                                  disabled={!isRowEnabled(field.sNo)}
                                  className={`h-8 w-16 text-xs ${!isRowEnabled(field.sNo) ? 'opacity-50' : ''}`}
                                />
                              ) : (
                                // OTHERWISE SHOW TEXT (no input)
                                <span className="text-xs">
                                  {field.universityCourseCode || ""}
                                </span>
                              )}
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </TableCell>

                    {/* 4. Course Title */}
                    <TableCell className="border-r">
                      {field.courseTitle}
                    </TableCell>

                    {/* --- MERGED LOGIC START (Columns 5 to End) --- */}
                    {isMergedRow ? (
                      // Render this single cell for the merged rows
                      // colSpan 28 covers the rest of the table
                      <TableCell
                        colSpan={28}
                        className="border-r text-center font-medium bg-muted/20"
                      >
                        {/* Displaying theoryPrescribed as requested */}
                        {field.theoryPrescribed}
                      </TableCell>
                    ) : (
                      // Render standard columns for all other rows
                      <>
                        {/* Credits */}
                        <TableCell className="border-r text-center">
                          {field.theoryCredits}
                        </TableCell>
                        <TableCell className="border-r text-center">
                          {field.skillLabCredits}
                        </TableCell>
                        <TableCell className="border-r text-center">
                          {field.clinicalCredits}
                        </TableCell>

                        {/* Instruction Hours - Theory */}
                        <TableCell className="border-r text-center">
                          {isSemVIII && field.theoryPrescribed === "0" ? (
                            <FormField
                              control={form.control}
                              name={`courses.${index}.theoryPrescribed`}
                              render={({ field: formField }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      {...formField}
                                      disabled={!isRowEnabled(field.sNo)}
                                    className={`h-8 w-16 text-xs ${!isRowEnabled(field.sNo) ? 'opacity-50' : ''}`}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          ) : (
                            field.theoryPrescribed
                          )}
                        </TableCell>

                        <TableCell className="border-r text-center">
                          <FormField
                            control={form.control}
                            name={`courses.${index}.theoryAttended`}
                            render={({ field: formField }) => (
                              <FormItem>
                                <FormControl>
                                  {isEditable(
                                    selectedSemester,
                                    "theoryAttended",
                                    index
                                  ) ? (
                                    // SHOW INPUT only when editable
                                    <Input
                                      {...formField}
                                      disabled={!isRowEnabled(field.sNo)}
                                      className={`h-8 w-16 text-xs ${!isRowEnabled(field.sNo) ? 'opacity-50' : ''}`}
                                    />
                                  ) : (
                                    // OTHERWISE SHOW TEXT (no input)
                                    <span className="text-xs">
                                      {field.theoryAttended || ""}
                                    </span>
                                  )}
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </TableCell>

                        <TableCell className="border-r text-center">
                          <FormField
                            control={form.control}
                            name={`courses.${index}.theoryPercentage`}
                            render={({ field: formField }) => (
                              <FormItem>
                                <FormControl>
                                  {isEditable(
                                    selectedSemester,
                                    "theoryPercentage",
                                    index
                                  ) ? (
                                    // SHOW INPUT only when editable
                                    <Input
                                      {...formField}
                                      disabled={!isRowEnabled(field.sNo)}
                                    className={`h-8 w-16 text-xs ${!isRowEnabled(field.sNo) ? 'opacity-50' : ''}`}
                                    />
                                  ) : (
                                    // OTHERWISE SHOW TEXT (no input)
                                    <span className="text-xs">
                                      {field.theoryPercentage || ""}
                                    </span>
                                  )}
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </TableCell>

                        {/* Instruction Hours - Skill Lab */}
                        <TableCell className="border-r text-center">
                          {field.skillLabPrescribed}
                        </TableCell>

                        <TableCell className="border-r text-center">
                          <FormField
                            control={form.control}
                            name={`courses.${index}.skillLabAttended`}
                            render={({ field: formField }) => (
                              <FormItem>
                                <FormControl>
                                  {isEditable(
                                    selectedSemester,
                                    "skillLabAttended",
                                    index
                                  ) ? (
                                    // SHOW INPUT only when editable
                                    <Input
                                      {...formField}
                                      disabled={!isRowEnabled(field.sNo)}
                                    className={`h-8 w-16 text-xs ${!isRowEnabled(field.sNo) ? 'opacity-50' : ''}`}
                                    />
                                  ) : (
                                    // OTHERWISE SHOW TEXT (no input)
                                    <span className="text-xs">
                                      {field.skillLabAttended || ""}
                                    </span>
                                  )}
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </TableCell>

                        <TableCell className="border-r text-center">
                          <FormField
                            control={form.control}
                            name={`courses.${index}.skillLabPercentage`}
                            render={({ field: formField }) => (
                              <FormItem>
                                <FormControl>
                                  {isEditable(
                                    selectedSemester,
                                    "skillLabPercentage",
                                    index
                                  ) ? (
                                    // SHOW INPUT only when editable
                                    <Input
                                      {...formField}
                                      disabled={!isRowEnabled(field.sNo)}
                                    className={`h-8 w-16 text-xs ${!isRowEnabled(field.sNo) ? 'opacity-50' : ''}`}
                                    />
                                  ) : (
                                    // OTHERWISE SHOW TEXT (no input)
                                    <span className="text-xs">
                                      {field.skillLabPercentage || ""}
                                    </span>
                                  )}
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </TableCell>

                        {/* Instruction Hours - Clinical */}
                        <TableCell className="border-r text-center">
                          {field.clinicalPrescribed}
                        </TableCell>

                        <TableCell className="border-r text-center">
                          <FormField
                            control={form.control}
                            name={`courses.${index}.clinicalAttended`}
                            render={({ field: formField }) => (
                              <FormItem>
                                <FormControl>
                                  {isEditable(
                                    selectedSemester,
                                    "clinicalAttended",
                                    index
                                  ) ? (
                                    // SHOW INPUT only when editable
                                    <Input
                                      {...formField}
                                      disabled={!isRowEnabled(field.sNo)}
                                    className={`h-8 w-16 text-xs ${!isRowEnabled(field.sNo) ? 'opacity-50' : ''}`}
                                    />
                                  ) : (
                                    // OTHERWISE SHOW TEXT (no input)
                                    <span className="text-xs">
                                      {field.clinicalAttended || ""}
                                    </span>
                                  )}
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </TableCell>

                        <TableCell className="border-r text-center">
                          <FormField
                            control={form.control}
                            name={`courses.${index}.clinicalPercentage`}
                            render={({ field: formField }) => (
                              <FormItem>
                                <FormControl>
                                  {isEditable(
                                    selectedSemester,
                                    "clinicalPercentage",
                                    index
                                  ) ? (
                                    // SHOW INPUT only when editable
                                    <Input
                                      {...formField}
                                      disabled={!isRowEnabled(field.sNo)}
                                    className={`h-8 w-16 text-xs ${!isRowEnabled(field.sNo) ? 'opacity-50' : ''}`}
                                    />
                                  ) : (
                                    // OTHERWISE SHOW TEXT (no input)
                                    <span className="text-xs">
                                      {field.clinicalPercentage || ""}
                                    </span>
                                  )}
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </TableCell>

                        {/* Marks - Theory */}
                        <TableCell className="border-r text-center">
                          {field.theoryInternalMax}
                        </TableCell>

                        <TableCell className="border-r text-center">
                          <FormField
                            control={form.control}
                            name={`courses.${index}.theoryInternalObtained`}
                            render={({ field: formField }) => (
                              <FormItem>
                                <FormControl>
                                  {isEditable(
                                    selectedSemester,
                                    "theoryInternalObtained",
                                    index
                                  ) ? (
                                    // SHOW INPUT only when editable
                                    <Input
                                      {...formField}
                                      disabled={!isRowEnabled(field.sNo)}
                                    className={`h-8 w-16 text-xs ${!isRowEnabled(field.sNo) ? 'opacity-50' : ''}`}
                                    />
                                  ) : (
                                    // OTHERWISE SHOW TEXT (no input)
                                    <span className="text-xs">
                                      {field.theoryInternalObtained || ""}
                                    </span>
                                  )}
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </TableCell>

                        <TableCell className="border-r text-center">
                          {field.theoryEndSemMax}
                        </TableCell>

                        <TableCell className="border-r text-center">
                          <FormField
                            control={form.control}
                            name={`courses.${index}.theoryEndSemObtained`}
                            render={({ field: formField }) => (
                              <FormItem>
                                <FormControl>
                                  {isEditable(
                                    selectedSemester,
                                    "theoryEndSemObtained",
                                    index
                                  ) ? (
                                    // SHOW INPUT only when editable
                                    <Input
                                      {...formField}
                                      disabled={!isRowEnabled(field.sNo)}
                                    className={`h-8 w-16 text-xs ${!isRowEnabled(field.sNo) ? 'opacity-50' : ''}`}
                                    />
                                  ) : (
                                    // OTHERWISE SHOW TEXT (no input)
                                    <span className="text-xs">
                                      {field.theoryEndSemObtained || ""}
                                    </span>
                                  )}
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </TableCell>

                        <TableCell className="border-r text-center">
                          {field.theoryTotalMax}
                        </TableCell>

                        <TableCell className="border-r text-center">
                          <FormField
                            control={form.control}
                            name={`courses.${index}.theoryTotalObtained`}
                            render={({ field: formField }) => (
                              <FormItem>
                                <FormControl>
                                  {isEditable(
                                    selectedSemester,
                                    "theoryTotalObtained",
                                    index
                                  ) ? (
                                    // SHOW INPUT only when editable
                                    <Input
                                      {...formField}
                                      disabled={!isRowEnabled(field.sNo)}
                                    className={`h-8 w-16 text-xs ${!isRowEnabled(field.sNo) ? 'opacity-50' : ''}`}
                                    />
                                  ) : (
                                    // OTHERWISE SHOW TEXT (no input)
                                    <span className="text-xs">
                                      {field.theoryTotalObtained || ""}
                                    </span>
                                  )}
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </TableCell>

                        {/* Marks - Practical */}
                        <TableCell className="border-r text-center">
                          {field.practicalInternalMax}
                        </TableCell>

                        <TableCell className="border-r text-center">
                          <FormField
                            control={form.control}
                            name={`courses.${index}.practicalInternalObtained`}
                            render={({ field: formField }) => (
                              <FormItem>
                                <FormControl>
                                  {isEditable(
                                    selectedSemester,
                                    "practicalInternalObtained",
                                    index
                                  ) ? (
                                    // SHOW INPUT only when editable
                                    <Input
                                      {...formField}
                                      disabled={!isRowEnabled(field.sNo)}
                                    className={`h-8 w-16 text-xs ${!isRowEnabled(field.sNo) ? 'opacity-50' : ''}`}
                                    />
                                  ) : (
                                    // OTHERWISE SHOW TEXT (no input)
                                    <span className="text-xs">
                                      {field.practicalInternalObtained || ""}
                                    </span>
                                  )}
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </TableCell>

                        <TableCell className="border-r text-center">
                          {field.practicalEndSemMax}
                        </TableCell>

                        <TableCell className="border-r text-center">
                          <FormField
                            control={form.control}
                            name={`courses.${index}.practicalEndSemObtained`}
                            render={({ field: formField }) => (
                              <FormItem>
                                <FormControl>
                                  {isEditable(
                                    selectedSemester,
                                    "practicalEndSemObtained",
                                    index
                                  ) ? (
                                    // SHOW INPUT only when editable
                                    <Input
                                      {...formField}
                                      disabled={!isRowEnabled(field.sNo)}
                                    className={`h-8 w-16 text-xs ${!isRowEnabled(field.sNo) ? 'opacity-50' : ''}`}
                                    />
                                  ) : (
                                    // OTHERWISE SHOW TEXT (no input)
                                    <span className="text-xs">
                                      {field.practicalEndSemObtained || ""}
                                    </span>
                                  )}
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </TableCell>

                        <TableCell className="border-r text-center">
                          {field.practicalTotalMax}
                        </TableCell>

                        <TableCell className="border-r text-center">
                          <FormField
                            control={form.control}
                            name={`courses.${index}.practicalTotalObtained`}
                            render={({ field: formField }) => (
                              <FormItem>
                                <FormControl>
                                  {isEditable(
                                    selectedSemester,
                                    "practicalTotalObtained",
                                    index
                                  ) ? (
                                    // SHOW INPUT only when editable
                                    <Input
                                      {...formField}
                                      disabled={!isRowEnabled(field.sNo)}
                                    className={`h-8 w-16 text-xs ${!isRowEnabled(field.sNo) ? 'opacity-50' : ''}`}
                                    />
                                  ) : (
                                    // OTHERWISE SHOW TEXT (no input)
                                    <span className="text-xs">
                                      {field.practicalTotalObtained || ""}
                                    </span>
                                  )}
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </TableCell>

                        {/* Grade Point / Letter Grade / SGPA / Rank */}
                        <TableCell className="border-r text-center">
                          <FormField
                            control={form.control}
                            name={`courses.${index}.gradePoint`}
                            render={({ field: formField }) => (
                              <FormItem>
                                <FormControl>
                                  {isEditable(
                                    selectedSemester,
                                    "gradePoint",
                                    index
                                  ) ? (
                                    // SHOW INPUT only when editable
                                    <Input
                                      {...formField}
                                      disabled={!isRowEnabled(field.sNo)}
                                    className={`h-8 w-16 text-xs ${!isRowEnabled(field.sNo) ? 'opacity-50' : ''}`}
                                    />
                                  ) : (
                                    // OTHERWISE SHOW TEXT (no input)
                                    <span className="text-xs">
                                      {field.gradePoint || ""}
                                    </span>
                                  )}
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </TableCell>

                        <TableCell className="border-r text-center">
                          <FormField
                            control={form.control}
                            name={`courses.${index}.letterGrade`}
                            render={({ field: formField }) => (
                              <FormItem>
                                <FormControl>
                                  {isEditable(
                                    selectedSemester,
                                    "letterGrade",
                                    index
                                  ) ? (
                                    // SHOW INPUT only when editable
                                    <Input
                                      {...formField}
                                      disabled={!isRowEnabled(field.sNo)}
                                    className={`h-8 w-16 text-xs ${!isRowEnabled(field.sNo) ? 'opacity-50' : ''}`}
                                    />
                                  ) : (
                                    // OTHERWISE SHOW TEXT (no input)
                                    <span className="text-xs">
                                      {field.letterGrade || ""}
                                    </span>
                                  )}
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </TableCell>

                        <TableCell className="border-r text-center">
                          <FormField
                            control={form.control}
                            name={`courses.${index}.sgpa`}
                            render={({ field: formField }) => (
                              <FormItem>
                                <FormControl>
                                  {isEditable(
                                    selectedSemester,
                                    "sgpa",
                                    index
                                  ) ? (
                                    // SHOW INPUT only when editable
                                    <Input
                                      {...formField}
                                      disabled={!isRowEnabled(field.sNo)}
                                    className={`h-8 w-16 text-xs ${!isRowEnabled(field.sNo) ? 'opacity-50' : ''}`}
                                    />
                                  ) : (
                                    // OTHERWISE SHOW TEXT (no input)
                                    <span className="text-xs">
                                      {field.sgpa || ""}
                                    </span>
                                  )}
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </TableCell>

                        <TableCell className="border-r text-center">
                          <FormField
                            control={form.control}
                            name={`courses.${index}.rank`}
                            render={({ field: formField }) => (
                              <FormItem>
                                <FormControl>
                                  {isEditable(
                                    selectedSemester,
                                    "rank",
                                    index
                                  ) ? (
                                    // SHOW INPUT only when editable
                                    <Input
                                      {...formField}
                                      disabled={!isRowEnabled(field.sNo)}
                                    className={`h-8 w-16 text-xs ${!isRowEnabled(field.sNo) ? 'opacity-50' : ''}`}
                                    />
                                  ) : (
                                    // OTHERWISE SHOW TEXT (no input)
                                    <span className="text-xs">
                                      {field.rank || ""}
                                    </span>
                                  )}
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>


        {/* Semester Specific Notes */}
        {semesterNotes.notes[selectedSemester as keyof typeof semesterNotes.notes] && (
          <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
            {typeof semesterNotes.notes[selectedSemester as keyof typeof semesterNotes.notes] === 'string' ? (
              <p className="text-sm font-medium text-foreground">
                {semesterNotes.notes[selectedSemester as keyof typeof semesterNotes.notes] as string}
              </p>
            ) : (
              <div className="space-y-3">
                <h4 className="font-bold text-base text-foreground">
                  {(semesterNotes.notes[selectedSemester as keyof typeof semesterNotes.notes] as any).title}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {(semesterNotes.notes[selectedSemester as keyof typeof semesterNotes.notes] as any).description}
                </p>
                <ul className="list-disc list-inside space-y-1">
                  {(semesterNotes.notes[selectedSemester as keyof typeof semesterNotes.notes] as any).list.map((note: string, idx: number) => (
                    <li key={idx} className="text-sm text-foreground">{note}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </form>
    </Form>
  );
};




