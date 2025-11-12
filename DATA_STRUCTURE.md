# Student Record Data Structure

## Complete Data Model

### StudentRecord Interface
```typescript
interface StudentRecord {
  id: string;              // Unique identifier (e.g., "STU001")
  name: string;            // Student full name
  email: string;           // Student email
  regNo: string;           // Registration number (e.g., "NS2021001")
  steps: {
    step1?: PersonalProfile;
    step2?: EducationalQualification;
    step3?: AdmissionDetails;
    step4?: AttendanceRecord;
    step5?: ActivitiesParticipation;
    step6?: CourseInstruction;
    step7?: ObservationalVisits;
    step8?: ClinicalExperience;
    step9?: ResearchProjects;
    step10?: AdditionalCourses;
    step11?: CourseCompletion;
    step12?: Verification;
  };
}
```

## Step-by-Step Data Structures

### Step 1: Personal Profile
```typescript
{
  studentName: string;
  age: string;
  gender: "male" | "female" | "other";
  dateOfBirth: string;           // YYYY-MM-DD
  nationality: string;
  religion: string;
  community: string;
  nativity: string;
  maritalStatus: "single" | "married";
  parentGuardianName: string;
  motherTongue: string;
  communicationAddress: string;
  permanentAddress: string;
  contactMobile: string;         // 10 digits
  studentEmail: string;
  aadharNo: string;              // 12 digits
  ociNumber?: string;
  emisNo: string;
  mediumOfInstruction: string;
}
```

### Step 2: Educational Qualification
```typescript
{
  streamGroup: string;
  subjects: Array<{
    subject: string;
    plusOneAttempts: Array<{
      maxMarks: string;
      score: string;
      percentage: string;
    }>;
    plusTwoAttempts: Array<{
      maxMarks: string;
      score: string;
      percentage: string;
    }>;
  }>;
  totalPlusOneMaxMarks: string;
  totalPlusOneScore: string;
  totalPlusOnePercentage: string;
  totalPlusTwoMaxMarks: string;
  totalPlusTwoScore: string;
  totalPlusTwoPercentage: string;
  certificateNo: string;
  certificateDate: string;       // YYYY-MM-DD
  yearOfPassing: string;
  boardOfExamination: string;
  mediumOfInstruction: string;
  hscVerificationNo: string;
  hscVerificationDate: string;   // YYYY-MM-DD
}
```

### Step 3: Admission Details
```typescript
{
  dateOfAdmission: string;       // YYYY-MM-DD
  admissionNumber: string;
  rollNumber: string;
  universityRegistration: string;
  migrationCertificateNo?: string;
  migrationCertificateDate?: string;
  eligibilityCertificateNo?: string;
  eligibilityCertificateDate?: string;
  allotmentCategory: string;
  govtAllotmentNo?: string;
  privateAllotmentNo?: string;
  communityCertificateNo?: string;
  communityCertificateDate?: string;
  nativityCertificateNo?: string;
  nativityCertificateDate?: string;
  dateOfDiscontinuation?: string;
  reasonForDiscontinuation?: string;
  scholarshipSource?: string;
  scholarshipAmount?: string;
  bankLoanSource?: string;
  bankLoanAmount?: string;
}
```

### Step 4: Attendance Record
```typescript
{
  semesters: Array<{
    semester: "I" | "II" | "III" | "IV" | "V" | "VI" | "VII" | "VIII";
    workingDays: string;
    annualLeave: string;
    sickLeave: string;
    gazettedHolidays: string;
    otherLeave: string;
    compensationDaysHours: string;
  }>;
}
```

### Step 5: Activities & Participation
```typescript
{
  semesters: Array<{
    semester: "I" | "II" | "III" | "IV" | "V" | "VI" | "VII" | "VIII";
    sports: string;
    coCurricular: string;
    extraCurricular: string;
    sna: string;
    nssYrcRrc: string;
    cne: string;
    awardsRewards: string;
  }>;
}
```

### Step 6: Course Instruction
```typescript
{
  semester: string;
  courses: Array<{
    slNo: number;
    courseCode: string;
    universityCourseCode: string;
    courseTitle: string;
    theoryCredits: string;
    skillLabCredits: string;
    clinicalCredits: string;
    theoryPrescribed: number;
    theoryAttended?: string;
    theoryPercentage?: string;
    skillLabPrescribed: string;
    skillLabAttended?: string;
    skillLabPercentage?: string;
    clinicalPrescribed: number;
    clinicalAttended?: string;
    clinicalPercentage?: string;
    theoryInternalMax: string;
    theoryInternalObtained?: string;
    theoryEndSemMax: number;
    theoryEndSemObtained?: string;
    theoryTotalMax: number;
    theoryTotalObtained?: string;
    practicalInternalMax: number;
    practicalInternalObtained?: string;
    practicalEndSemMax: number;
    practicalEndSemObtained?: string;
    practicalTotalMax: number;
    practicalTotalObtained?: string;
    gradePoint?: string;
    letterGrade?: string;
  }>;
}
```

### Step 7: Observational Visits
```typescript
{
  visits: Array<{
    semester: string;
    institutionPlace: string;
    date: string;              // YYYY-MM-DD
  }>;
}
```

### Step 8: Clinical Experience
```typescript
{
  records: Array<{
    semester: string;
    clinicalArea: string;
    credits: string;
    prescribedWeeks: string;
    prescribedHours: string;
    completedHours: string;
    hospital: string;
  }>;
}
```

### Step 9: Research Projects
```typescript
{
  projects: Array<{
    semester: string;
    areaOfStudy: string;
    type: string;              // "Group" or "Individual"
    projectTitle: string;
  }>;
}
```

### Step 10: Additional Courses
```typescript
{
  courses: Array<{
    courseName: string;
    from: string;              // YYYY-MM-DD
    to: string;                // YYYY-MM-DD
  }>;
}
```

### Step 11: Course Completion
```typescript
{
  completions: Array<{
    courseName: string;
    certificateNumber: string;
    dateOfIssue: string;       // YYYY-MM-DD
  }>;
}
```

### Step 12: Verification
```typescript
{
  verifications: Array<{
    semester: string;
    classTeacherName: string;
    teacherSignature: string;
    principalSignature: string;
    verificationDate: string;  // YYYY-MM-DD
  }>;
}
```

## Sample Data Example

### Complete Student Record
```typescript
{
  id: "STU001",
  name: "PRIYA SHARMA",
  email: "priya.sharma@nursing.edu",
  regNo: "NS2021001",
  steps: {
    step1: {
      studentName: "PRIYA SHARMA",
      age: "21",
      gender: "female",
      dateOfBirth: "2003-05-15",
      nationality: "Indian",
      religion: "Hindu",
      community: "OC",
      nativity: "Tamil Nadu",
      maritalStatus: "single",
      parentGuardianName: "Rajesh Sharma",
      motherTongue: "Tamil",
      communicationAddress: "123, Anna Nagar, Chennai, Tamil Nadu - 600040",
      permanentAddress: "123, Anna Nagar, Chennai, Tamil Nadu - 600040",
      contactMobile: "9876543210",
      studentEmail: "priya.sharma@nursing.edu",
      aadharNo: "123456789012",
      ociNumber: "",
      emisNo: "TN2021001",
      mediumOfInstruction: "English"
    },
    step2: {
      streamGroup: "Biology",
      subjects: [
        {
          subject: "Tamil",
          plusOneAttempts: [{ maxMarks: "100", score: "85", percentage: "85" }],
          plusTwoAttempts: [{ maxMarks: "100", score: "88", percentage: "88" }]
        }
        // ... more subjects
      ],
      totalPlusOneMaxMarks: "500",
      totalPlusOneScore: "440",
      totalPlusOnePercentage: "88",
      totalPlusTwoMaxMarks: "500",
      totalPlusTwoScore: "451",
      totalPlusTwoPercentage: "90.2",
      certificateNo: "CERT2021001",
      certificateDate: "2021-05-20",
      yearOfPassing: "2021",
      boardOfExamination: "Tamil Nadu State Board",
      mediumOfInstruction: "English",
      hscVerificationNo: "HSC2021001",
      hscVerificationDate: "2021-06-10"
    }
    // ... steps 3-12
  }
}
```

## Field Validations

### Required Fields by Step

**Step 1 (Personal Profile):**
- All fields except `ociNumber` are required
- `contactMobile`: Must be 10 digits
- `aadharNo`: Must be 12 digits
- `studentEmail`: Must be valid email format

**Step 2 (Educational Qualification):**
- All fields are required
- `yearOfPassing`: Must be 4 digits

**Step 3 (Admission Details):**
- Required: `dateOfAdmission`, `admissionNumber`, `rollNumber`, `universityRegistration`, `allotmentCategory`
- Optional: All certificate and scholarship fields

**Steps 4-5:**
- Array of semester data (8 semesters)
- All semester fields are strings

**Steps 6-12:**
- Vary by form type
- Most fields are optional to allow partial completion

## Storage

### LocalStorage Key
```
students_db_v1
```

### Storage Format
```json
[
  {
    "id": "STU001",
    "name": "PRIYA SHARMA",
    "email": "priya.sharma@nursing.edu",
    "regNo": "NS2021001",
    "steps": { /* ... */ },
    "updatedAt": 1704067200000
  }
]
```

## API Functions

### Available Functions
```typescript
// Get all students
getAllStudents(): StudentRecord[]

// Get single student
getStudent(id: string): StudentRecord | null

// Create or update student
upsertStudent(record: StudentRecord): void

// Update specific fields
updateStudent(id: string, updates: Partial<StudentRecord>): StudentRecord | null

// Search students
searchStudents(query: string): StudentRecord[]
```

## Notes

- All dates are stored in ISO format (YYYY-MM-DD)
- Numeric fields are stored as strings for form compatibility
- Optional fields can be empty strings or undefined
- Semester values use Roman numerals: "I", "II", "III", etc.
- Arrays allow multiple entries (subjects, semesters, courses, etc.)
