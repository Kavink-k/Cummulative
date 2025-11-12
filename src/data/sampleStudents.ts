export interface StudentRecord {
  id: string;
  name: string;
  email: string;
  regNo: string;
  steps: {
    step1?: any;
    step2?: any;
    step3?: any;
    step4?: any;
    step5?: any;
    step6?: any;
    step7?: any;
    step8?: any;
    step9?: any;
    step10?: any;
    step11?: any;
    step12?: any;
  };
}

export const sampleStudents: StudentRecord[] = [
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
        mediumOfInstruction: "English",
        photoUrl: "",
      },
      step2: {
        streamGroup: "Biology",
        subjects: [
          {
            subject: "Tamil",
            plusOneAttempts: [{ maxMarks: "100", score: "85", percentage: "85" }],
            plusTwoAttempts: [{ maxMarks: "100", score: "88", percentage: "88" }],
          },
          {
            subject: "English",
            plusOneAttempts: [{ maxMarks: "100", score: "90", percentage: "90" }],
            plusTwoAttempts: [{ maxMarks: "100", score: "92", percentage: "92" }],
          },
          {
            subject: "Physics",
            plusOneAttempts: [{ maxMarks: "100", score: "82", percentage: "82" }],
            plusTwoAttempts: [{ maxMarks: "100", score: "85", percentage: "85" }],
          },
          {
            subject: "Chemistry",
            plusOneAttempts: [{ maxMarks: "100", score: "88", percentage: "88" }],
            plusTwoAttempts: [{ maxMarks: "100", score: "90", percentage: "90" }],
          },
          {
            subject: "Biology",
            plusOneAttempts: [{ maxMarks: "100", score: "95", percentage: "95" }],
            plusTwoAttempts: [{ maxMarks: "100", score: "96", percentage: "96" }],
          },
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
        hscVerificationDate: "2021-06-10",
      },
      step3: {
        dateOfAdmission: "2021-08-15",
        admissionNumber: "ADM2021001",
        rollNumber: "ROLL2021001",
        universityRegistration: "UNIV2021001",
        allotmentCategory: "Government",
        govtAllotmentNo: "GOVT2021001",
        scholarshipSource: "State Government",
        scholarshipAmount: "50000",
      },
      step4: {
        semesters: [
          { semester: "I", workingDays: "90", annualLeave: "2", sickLeave: "1", gazettedHolidays: "5", otherLeave: "0", compensationDaysHours: "0" },
          { semester: "II", workingDays: "95", annualLeave: "1", sickLeave: "2", gazettedHolidays: "4", otherLeave: "0", compensationDaysHours: "0" },
          { semester: "III", workingDays: "92", annualLeave: "3", sickLeave: "0", gazettedHolidays: "5", otherLeave: "0", compensationDaysHours: "0" },
          { semester: "IV", workingDays: "90", annualLeave: "2", sickLeave: "1", gazettedHolidays: "6", otherLeave: "0", compensationDaysHours: "0" },
          { semester: "V", workingDays: "88", annualLeave: "4", sickLeave: "1", gazettedHolidays: "5", otherLeave: "0", compensationDaysHours: "0" },
          { semester: "VI", workingDays: "93", annualLeave: "1", sickLeave: "0", gazettedHolidays: "4", otherLeave: "0", compensationDaysHours: "0" },
          { semester: "VII", workingDays: "91", annualLeave: "2", sickLeave: "1", gazettedHolidays: "5", otherLeave: "0", compensationDaysHours: "0" },
          { semester: "VIII", workingDays: "85", annualLeave: "3", sickLeave: "2", gazettedHolidays: "6", otherLeave: "0", compensationDaysHours: "0" },
        ],
      },
      step5: {
        semesters: [
          { semester: "I", sports: "Volleyball", coCurricular: "Debate", extraCurricular: "Music", sna: "Yes", nssYrcRrc: "NSS", cne: "Yes", awardsRewards: "Best Newcomer" },
          { semester: "II", sports: "Volleyball", coCurricular: "Quiz", extraCurricular: "Dance", sna: "Yes", nssYrcRrc: "NSS", cne: "Yes", awardsRewards: "" },
          { semester: "III", sports: "Badminton", coCurricular: "Drama", extraCurricular: "Art", sna: "Yes", nssYrcRrc: "NSS", cne: "Yes", awardsRewards: "Sports Champion" },
          { semester: "IV", sports: "Badminton", coCurricular: "Debate", extraCurricular: "Music", sna: "Yes", nssYrcRrc: "NSS", cne: "Yes", awardsRewards: "" },
          { semester: "V", sports: "Athletics", coCurricular: "Quiz", extraCurricular: "Dance", sna: "Yes", nssYrcRrc: "YRC", cne: "Yes", awardsRewards: "" },
          { semester: "VI", sports: "Athletics", coCurricular: "Drama", extraCurricular: "Art", sna: "Yes", nssYrcRrc: "YRC", cne: "Yes", awardsRewards: "Cultural Award" },
          { semester: "VII", sports: "Volleyball", coCurricular: "Debate", extraCurricular: "Music", sna: "Yes", nssYrcRrc: "YRC", cne: "Yes", awardsRewards: "" },
          { semester: "VIII", sports: "Volleyball", coCurricular: "Quiz", extraCurricular: "Dance", sna: "Yes", nssYrcRrc: "YRC", cne: "Yes", awardsRewards: "Overall Best Student" },
        ],
      },
    },
  },
  {
    id: "STU002",
    name: "ANANYA REDDY",
    email: "ananya.reddy@nursing.edu",
    regNo: "NS2021002",
    steps: {
      step1: {
        studentName: "ANANYA REDDY",
        age: "22",
        gender: "female",
        dateOfBirth: "2002-08-22",
        nationality: "Indian",
        religion: "Hindu",
        community: "BC",
        nativity: "Andhra Pradesh",
        maritalStatus: "single",
        parentGuardianName: "Venkat Reddy",
        motherTongue: "Telugu",
        communicationAddress: "456, T Nagar, Chennai, Tamil Nadu - 600017",
        permanentAddress: "789, Vijayawada, Andhra Pradesh - 520001",
        contactMobile: "9876543211",
        studentEmail: "ananya.reddy@nursing.edu",
        aadharNo: "234567890123",
        ociNumber: "",
        emisNo: "TN2021002",
        mediumOfInstruction: "English",
      },
      step2: {
        streamGroup: "Biology",
        subjects: [
          {
            subject: "Telugu",
            plusOneAttempts: [{ maxMarks: "100", score: "80", percentage: "80" }],
            plusTwoAttempts: [{ maxMarks: "100", score: "83", percentage: "83" }],
          },
          {
            subject: "English",
            plusOneAttempts: [{ maxMarks: "100", score: "87", percentage: "87" }],
            plusTwoAttempts: [{ maxMarks: "100", score: "89", percentage: "89" }],
          },
          {
            subject: "Physics",
            plusOneAttempts: [{ maxMarks: "100", score: "78", percentage: "78" }],
            plusTwoAttempts: [{ maxMarks: "100", score: "81", percentage: "81" }],
          },
          {
            subject: "Chemistry",
            plusOneAttempts: [{ maxMarks: "100", score: "85", percentage: "85" }],
            plusTwoAttempts: [{ maxMarks: "100", score: "88", percentage: "88" }],
          },
          {
            subject: "Biology",
            plusOneAttempts: [{ maxMarks: "100", score: "92", percentage: "92" }],
            plusTwoAttempts: [{ maxMarks: "100", score: "94", percentage: "94" }],
          },
        ],
        totalPlusOneMaxMarks: "500",
        totalPlusOneScore: "422",
        totalPlusOnePercentage: "84.4",
        totalPlusTwoMaxMarks: "500",
        totalPlusTwoScore: "435",
        totalPlusTwoPercentage: "87",
        certificateNo: "CERT2021002",
        certificateDate: "2021-05-22",
        yearOfPassing: "2021",
        boardOfExamination: "Andhra Pradesh Board",
        mediumOfInstruction: "English",
        hscVerificationNo: "HSC2021002",
        hscVerificationDate: "2021-06-12",
      },
      step3: {
        dateOfAdmission: "2021-08-16",
        admissionNumber: "ADM2021002",
        rollNumber: "ROLL2021002",
        universityRegistration: "UNIV2021002",
        allotmentCategory: "Management",
        privateAllotmentNo: "PVT2021002",
      },
      step4: {
        semesters: [
          { semester: "I", workingDays: "89", annualLeave: "3", sickLeave: "1", gazettedHolidays: "5", otherLeave: "0", compensationDaysHours: "0" },
          { semester: "II", workingDays: "93", annualLeave: "2", sickLeave: "2", gazettedHolidays: "4", otherLeave: "0", compensationDaysHours: "0" },
          { semester: "III", workingDays: "90", annualLeave: "3", sickLeave: "1", gazettedHolidays: "5", otherLeave: "0", compensationDaysHours: "0" },
          { semester: "IV", workingDays: "88", annualLeave: "3", sickLeave: "2", gazettedHolidays: "6", otherLeave: "0", compensationDaysHours: "0" },
          { semester: "V", workingDays: "86", annualLeave: "4", sickLeave: "2", gazettedHolidays: "5", otherLeave: "0", compensationDaysHours: "0" },
          { semester: "VI", workingDays: "91", annualLeave: "2", sickLeave: "1", gazettedHolidays: "4", otherLeave: "0", compensationDaysHours: "0" },
          { semester: "VII", workingDays: "89", annualLeave: "3", sickLeave: "2", gazettedHolidays: "5", otherLeave: "0", compensationDaysHours: "0" },
          { semester: "VIII", workingDays: "83", annualLeave: "4", sickLeave: "2", gazettedHolidays: "6", otherLeave: "0", compensationDaysHours: "0" },
        ],
      },
      step5: {
        semesters: [
          { semester: "I", sports: "Badminton", coCurricular: "Quiz", extraCurricular: "Dance", sna: "Yes", nssYrcRrc: "NSS", cne: "Yes", awardsRewards: "" },
          { semester: "II", sports: "Badminton", coCurricular: "Debate", extraCurricular: "Music", sna: "Yes", nssYrcRrc: "NSS", cne: "Yes", awardsRewards: "" },
          { semester: "III", sports: "Athletics", coCurricular: "Drama", extraCurricular: "Art", sna: "Yes", nssYrcRrc: "NSS", cne: "Yes", awardsRewards: "" },
          { semester: "IV", sports: "Athletics", coCurricular: "Quiz", extraCurricular: "Dance", sna: "Yes", nssYrcRrc: "NSS", cne: "Yes", awardsRewards: "" },
          { semester: "V", sports: "Volleyball", coCurricular: "Debate", extraCurricular: "Music", sna: "Yes", nssYrcRrc: "YRC", cne: "Yes", awardsRewards: "" },
          { semester: "VI", sports: "Volleyball", coCurricular: "Drama", extraCurricular: "Art", sna: "Yes", nssYrcRrc: "YRC", cne: "Yes", awardsRewards: "" },
          { semester: "VII", sports: "Badminton", coCurricular: "Quiz", extraCurricular: "Dance", sna: "Yes", nssYrcRrc: "YRC", cne: "Yes", awardsRewards: "" },
          { semester: "VIII", sports: "Badminton", coCurricular: "Debate", extraCurricular: "Music", sna: "Yes", nssYrcRrc: "YRC", cne: "Yes", awardsRewards: "" },
        ],
      },
      step6: { semester: "I", courses: [] },
      step7: {
        visits: [
          { semester: "I", institutionPlace: "Social Organization", date: "2021-10-18" },
          { semester: "II", institutionPlace: "Hospital Visit on Hospital Management System", date: "2022-02-22" },
        ],
      },
      step8: {
        records: [
          { semester: "I", clinicalArea: "Nursing Foundation I including First Aid Module", credits: "2", prescribedWeeks: "10", prescribedHours: "160", completedHours: "158", hospital: "Apollo Hospital" },
        ],
      },
      step9: {
        projects: [
          { semester: "V", areaOfStudy: "Pediatric Nursing", type: "Group", projectTitle: "Child Nutrition and Development" },
        ],
      },
      step10: {
        courses: [
          { courseName: "Advanced Cardiac Life Support (ACLS)", from: "2022-03-10", to: "2022-03-12" },
        ],
      },
      step11: {
        completions: [
          { courseName: "Course completion certificate", certificateNumber: "", dateOfIssue: "" },
          { courseName: "Transfer certificate", certificateNumber: "", dateOfIssue: "" },
          { courseName: "Provisional certificate", certificateNumber: "", dateOfIssue: "" },
          { courseName: "Degree certificate", certificateNumber: "", dateOfIssue: "" },
          { courseName: "Nursing registration certificate", certificateNumber: "", dateOfIssue: "" },
          { courseName: "TNAI card", certificateNumber: "", dateOfIssue: "" },
        ],
      },
      step12: {
        verifications: [
          { semester: "I", classTeacherName: "Dr. Radha Krishnan", teacherSignature: "", principalSignature: "", verificationDate: "2021-12-22" },
          { semester: "II", classTeacherName: "Dr. Radha Krishnan", teacherSignature: "", principalSignature: "", verificationDate: "2022-05-27" },
        ],
      },
    },
  },
  {
    id: "STU003",
    name: "KAVYA KRISHNAN",
    email: "kavya.krishnan@nursing.edu",
    regNo: "NS2021003",
    steps: {
      step1: {
        studentName: "KAVYA KRISHNAN",
        age: "20",
        gender: "female",
        dateOfBirth: "2004-03-10",
        nationality: "Indian",
        religion: "Hindu",
        community: "OC",
        nativity: "Kerala",
        maritalStatus: "single",
        parentGuardianName: "Krishnan Nair",
        motherTongue: "Malayalam",
        communicationAddress: "789, Adyar, Chennai, Tamil Nadu - 600020",
        permanentAddress: "321, Kochi, Kerala - 682001",
        contactMobile: "9876543212",
        studentEmail: "kavya.krishnan@nursing.edu",
        aadharNo: "345678901234",
        ociNumber: "",
        emisNo: "TN2021003",
        mediumOfInstruction: "English",
      },
      step2: {
        streamGroup: "Biology",
        subjects: [
          {
            subject: "Malayalam",
            plusOneAttempts: [{ maxMarks: "100", score: "88", percentage: "88" }],
            plusTwoAttempts: [{ maxMarks: "100", score: "90", percentage: "90" }],
          },
          {
            subject: "English",
            plusOneAttempts: [{ maxMarks: "100", score: "93", percentage: "93" }],
            plusTwoAttempts: [{ maxMarks: "100", score: "95", percentage: "95" }],
          },
          {
            subject: "Physics",
            plusOneAttempts: [{ maxMarks: "100", score: "85", percentage: "85" }],
            plusTwoAttempts: [{ maxMarks: "100", score: "87", percentage: "87" }],
          },
          {
            subject: "Chemistry",
            plusOneAttempts: [{ maxMarks: "100", score: "90", percentage: "90" }],
            plusTwoAttempts: [{ maxMarks: "100", score: "92", percentage: "92" }],
          },
          {
            subject: "Biology",
            plusOneAttempts: [{ maxMarks: "100", score: "97", percentage: "97" }],
            plusTwoAttempts: [{ maxMarks: "100", score: "98", percentage: "98" }],
          },
        ],
        totalPlusOneMaxMarks: "500",
        totalPlusOneScore: "453",
        totalPlusOnePercentage: "90.6",
        totalPlusTwoMaxMarks: "500",
        totalPlusTwoScore: "462",
        totalPlusTwoPercentage: "92.4",
        certificateNo: "CERT2021003",
        certificateDate: "2021-05-18",
        yearOfPassing: "2021",
        boardOfExamination: "Kerala State Board",
        mediumOfInstruction: "English",
        hscVerificationNo: "HSC2021003",
        hscVerificationDate: "2021-06-08",
      },
      step3: {
        dateOfAdmission: "2021-08-17",
        admissionNumber: "ADM2021003",
        rollNumber: "ROLL2021003",
        universityRegistration: "UNIV2021003",
        allotmentCategory: "Government",
        govtAllotmentNo: "GOVT2021003",
        scholarshipSource: "Merit Scholarship",
        scholarshipAmount: "75000",
      },
      step4: {
        semesters: [
          { semester: "I", workingDays: "91", annualLeave: "2", sickLeave: "0", gazettedHolidays: "5", otherLeave: "0", compensationDaysHours: "0" },
          { semester: "II", workingDays: "95", annualLeave: "1", sickLeave: "1", gazettedHolidays: "4", otherLeave: "0", compensationDaysHours: "0" },
          { semester: "III", workingDays: "93", annualLeave: "2", sickLeave: "0", gazettedHolidays: "5", otherLeave: "0", compensationDaysHours: "0" },
          { semester: "IV", workingDays: "91", annualLeave: "2", sickLeave: "1", gazettedHolidays: "6", otherLeave: "0", compensationDaysHours: "0" },
          { semester: "V", workingDays: "89", annualLeave: "3", sickLeave: "1", gazettedHolidays: "5", otherLeave: "0", compensationDaysHours: "0" },
          { semester: "VI", workingDays: "94", annualLeave: "1", sickLeave: "0", gazettedHolidays: "4", otherLeave: "0", compensationDaysHours: "0" },
          { semester: "VII", workingDays: "92", annualLeave: "2", sickLeave: "1", gazettedHolidays: "5", otherLeave: "0", compensationDaysHours: "0" },
          { semester: "VIII", workingDays: "86", annualLeave: "3", sickLeave: "1", gazettedHolidays: "6", otherLeave: "0", compensationDaysHours: "0" },
        ],
      },
      step5: {
        semesters: [
          { semester: "I", sports: "Athletics", coCurricular: "Drama", extraCurricular: "Art", sna: "Yes", nssYrcRrc: "NSS", cne: "Yes", awardsRewards: "Best Performer" },
          { semester: "II", sports: "Athletics", coCurricular: "Quiz", extraCurricular: "Dance", sna: "Yes", nssYrcRrc: "NSS", cne: "Yes", awardsRewards: "" },
          { semester: "III", sports: "Volleyball", coCurricular: "Debate", extraCurricular: "Music", sna: "Yes", nssYrcRrc: "NSS", cne: "Yes", awardsRewards: "" },
          { semester: "IV", sports: "Volleyball", coCurricular: "Drama", extraCurricular: "Art", sna: "Yes", nssYrcRrc: "NSS", cne: "Yes", awardsRewards: "" },
          { semester: "V", sports: "Badminton", coCurricular: "Quiz", extraCurricular: "Dance", sna: "Yes", nssYrcRrc: "YRC", cne: "Yes", awardsRewards: "" },
          { semester: "VI", sports: "Badminton", coCurricular: "Debate", extraCurricular: "Music", sna: "Yes", nssYrcRrc: "YRC", cne: "Yes", awardsRewards: "Academic Excellence" },
          { semester: "VII", sports: "Athletics", coCurricular: "Drama", extraCurricular: "Art", sna: "Yes", nssYrcRrc: "YRC", cne: "Yes", awardsRewards: "" },
          { semester: "VIII", sports: "Athletics", coCurricular: "Quiz", extraCurricular: "Dance", sna: "Yes", nssYrcRrc: "YRC", cne: "Yes", awardsRewards: "" },
        ],
      },
      step6: { semester: "I", courses: [] },
      step7: {
        visits: [
          { semester: "I", institutionPlace: "Social Organization", date: "2021-10-20" },
          { semester: "II", institutionPlace: "Hospital Visit on Hospital Management System", date: "2022-02-25" },
          { semester: "III", institutionPlace: "Blood Bank", date: "2022-08-15" },
        ],
      },
      step8: {
        records: [
          { semester: "I", clinicalArea: "Nursing Foundation I including First Aid Module", credits: "2", prescribedWeeks: "10", prescribedHours: "160", completedHours: "160", hospital: "Fortis Hospital" },
          { semester: "I", clinicalArea: "General Medical Ward", credits: "1", prescribedWeeks: "5", prescribedHours: "80", completedHours: "82", hospital: "Fortis Hospital" },
        ],
      },
      step9: {
        projects: [
          { semester: "V", areaOfStudy: "Maternal Health", type: "Individual", projectTitle: "Antenatal Care Practices in Urban Areas" },
          { semester: "VI", areaOfStudy: "Geriatric Care", type: "Group", projectTitle: "Quality of Life in Elderly Population" },
        ],
      },
      step10: {
        courses: [
          { courseName: "Infection Control", from: "2022-02-10", to: "2022-02-12" },
          { courseName: "Patient Safety", from: "2022-06-15", to: "2022-06-17" },
        ],
      },
      step11: {
        completions: [
          { courseName: "Course completion certificate", certificateNumber: "", dateOfIssue: "" },
          { courseName: "Transfer certificate", certificateNumber: "", dateOfIssue: "" },
          { courseName: "Provisional certificate", certificateNumber: "", dateOfIssue: "" },
          { courseName: "Degree certificate", certificateNumber: "", dateOfIssue: "" },
          { courseName: "Nursing registration certificate", certificateNumber: "", dateOfIssue: "" },
          { courseName: "TNAI card", certificateNumber: "", dateOfIssue: "" },
        ],
      },
      step12: {
        verifications: [
          { semester: "I", classTeacherName: "Dr. Meena Nair", teacherSignature: "", principalSignature: "", verificationDate: "2021-12-25" },
          { semester: "II", classTeacherName: "Dr. Meena Nair", teacherSignature: "", principalSignature: "", verificationDate: "2022-05-30" },
          { semester: "III", classTeacherName: "Dr. Anjali Menon", teacherSignature: "", principalSignature: "", verificationDate: "2022-12-20" },
        ],
      },
    },
  },
  {
    id: "STU004",
    name: "MEERA PATEL",
    email: "meera.patel@nursing.edu",
    regNo: "NS2021004",
    steps: {
      step1: {
        studentName: "MEERA PATEL",
        age: "21",
        gender: "female",
        dateOfBirth: "2003-11-05",
        nationality: "Indian",
        religion: "Hindu",
        community: "OC",
        nativity: "Gujarat",
        maritalStatus: "single",
        parentGuardianName: "Ramesh Patel",
        motherTongue: "Gujarati",
        communicationAddress: "234, Velachery, Chennai, Tamil Nadu - 600042",
        permanentAddress: "567, Ahmedabad, Gujarat - 380001",
        contactMobile: "9876543213",
        studentEmail: "meera.patel@nursing.edu",
        aadharNo: "456789012345",
        ociNumber: "",
        emisNo: "TN2021004",
        mediumOfInstruction: "English",
      },
      step2: {
        streamGroup: "Biology",
        subjects: [
          {
            subject: "Gujarati",
            plusOneAttempts: [{ maxMarks: "100", score: "82", percentage: "82" }],
            plusTwoAttempts: [{ maxMarks: "100", score: "84", percentage: "84" }],
          },
          {
            subject: "English",
            plusOneAttempts: [{ maxMarks: "100", score: "86", percentage: "86" }],
            plusTwoAttempts: [{ maxMarks: "100", score: "88", percentage: "88" }],
          },
          {
            subject: "Physics",
            plusOneAttempts: [{ maxMarks: "100", score: "80", percentage: "80" }],
            plusTwoAttempts: [{ maxMarks: "100", score: "83", percentage: "83" }],
          },
          {
            subject: "Chemistry",
            plusOneAttempts: [{ maxMarks: "100", score: "84", percentage: "84" }],
            plusTwoAttempts: [{ maxMarks: "100", score: "86", percentage: "86" }],
          },
          {
            subject: "Biology",
            plusOneAttempts: [{ maxMarks: "100", score: "91", percentage: "91" }],
            plusTwoAttempts: [{ maxMarks: "100", score: "93", percentage: "93" }],
          },
        ],
        totalPlusOneMaxMarks: "500",
        totalPlusOneScore: "423",
        totalPlusOnePercentage: "84.6",
        totalPlusTwoMaxMarks: "500",
        totalPlusTwoScore: "434",
        totalPlusTwoPercentage: "86.8",
        certificateNo: "CERT2021004",
        certificateDate: "2021-05-25",
        yearOfPassing: "2021",
        boardOfExamination: "Gujarat Board",
        mediumOfInstruction: "English",
        hscVerificationNo: "HSC2021004",
        hscVerificationDate: "2021-06-15",
      },
      step3: {
        dateOfAdmission: "2021-08-18",
        admissionNumber: "ADM2021004",
        rollNumber: "ROLL2021004",
        universityRegistration: "UNIV2021004",
        allotmentCategory: "Management",
        privateAllotmentNo: "PVT2021004",
      },
      step4: {
        semesters: [
          { semester: "I", workingDays: "88", annualLeave: "3", sickLeave: "2", gazettedHolidays: "5", otherLeave: "0", compensationDaysHours: "0" },
          { semester: "II", workingDays: "92", annualLeave: "2", sickLeave: "2", gazettedHolidays: "4", otherLeave: "0", compensationDaysHours: "0" },
          { semester: "III", workingDays: "89", annualLeave: "3", sickLeave: "2", gazettedHolidays: "5", otherLeave: "0", compensationDaysHours: "0" },
          { semester: "IV", workingDays: "87", annualLeave: "3", sickLeave: "3", gazettedHolidays: "6", otherLeave: "0", compensationDaysHours: "0" },
          { semester: "V", workingDays: "85", annualLeave: "4", sickLeave: "2", gazettedHolidays: "5", otherLeave: "0", compensationDaysHours: "0" },
          { semester: "VI", workingDays: "90", annualLeave: "2", sickLeave: "2", gazettedHolidays: "4", otherLeave: "0", compensationDaysHours: "0" },
          { semester: "VII", workingDays: "88", annualLeave: "3", sickLeave: "2", gazettedHolidays: "5", otherLeave: "0", compensationDaysHours: "0" },
          { semester: "VIII", workingDays: "82", annualLeave: "4", sickLeave: "3", gazettedHolidays: "6", otherLeave: "0", compensationDaysHours: "0" },
        ],
      },
      step5: {
        semesters: [
          { semester: "I", sports: "Badminton", coCurricular: "Debate", extraCurricular: "Music", sna: "Yes", nssYrcRrc: "NSS", cne: "Yes", awardsRewards: "" },
          { semester: "II", sports: "Badminton", coCurricular: "Quiz", extraCurricular: "Dance", sna: "Yes", nssYrcRrc: "NSS", cne: "Yes", awardsRewards: "" },
          { semester: "III", sports: "Volleyball", coCurricular: "Drama", extraCurricular: "Art", sna: "Yes", nssYrcRrc: "NSS", cne: "Yes", awardsRewards: "" },
          { semester: "IV", sports: "Volleyball", coCurricular: "Debate", extraCurricular: "Music", sna: "Yes", nssYrcRrc: "NSS", cne: "Yes", awardsRewards: "" },
          { semester: "V", sports: "Athletics", coCurricular: "Quiz", extraCurricular: "Dance", sna: "Yes", nssYrcRrc: "YRC", cne: "Yes", awardsRewards: "" },
          { semester: "VI", sports: "Athletics", coCurricular: "Drama", extraCurricular: "Art", sna: "Yes", nssYrcRrc: "YRC", cne: "Yes", awardsRewards: "" },
          { semester: "VII", sports: "Badminton", coCurricular: "Debate", extraCurricular: "Music", sna: "Yes", nssYrcRrc: "YRC", cne: "Yes", awardsRewards: "" },
          { semester: "VIII", sports: "Badminton", coCurricular: "Quiz", extraCurricular: "Dance", sna: "Yes", nssYrcRrc: "YRC", cne: "Yes", awardsRewards: "" },
        ],
      },
      step6: { semester: "I", courses: [] },
      step7: {
        visits: [
          { semester: "I", institutionPlace: "Social Organization", date: "2021-10-22" },
          { semester: "II", institutionPlace: "Hospital Visit on Hospital Management System", date: "2022-02-28" },
        ],
      },
      step8: {
        records: [
          { semester: "I", clinicalArea: "Nursing Foundation I including First Aid Module", credits: "2", prescribedWeeks: "10", prescribedHours: "160", completedHours: "155", hospital: "Max Hospital" },
        ],
      },
      step9: {
        projects: [
          { semester: "V", areaOfStudy: "Infection Control", type: "Group", projectTitle: "Hospital Acquired Infections Prevention" },
        ],
      },
      step10: {
        courses: [
          { courseName: "Wound Care Management", from: "2022-04-10", to: "2022-04-12" },
        ],
      },
      step11: {
        completions: [
          { courseName: "Course completion certificate", certificateNumber: "", dateOfIssue: "" },
          { courseName: "Transfer certificate", certificateNumber: "", dateOfIssue: "" },
          { courseName: "Provisional certificate", certificateNumber: "", dateOfIssue: "" },
          { courseName: "Degree certificate", certificateNumber: "", dateOfIssue: "" },
          { courseName: "Nursing registration certificate", certificateNumber: "", dateOfIssue: "" },
          { courseName: "TNAI card", certificateNumber: "", dateOfIssue: "" },
        ],
      },
      step12: {
        verifications: [
          { semester: "I", classTeacherName: "Dr. Sunita Patel", teacherSignature: "", principalSignature: "", verificationDate: "2021-12-28" },
          { semester: "II", classTeacherName: "Dr. Sunita Patel", teacherSignature: "", principalSignature: "", verificationDate: "2022-06-02" },
        ],
      },
    },
  },
  {
    id: "STU005",
    name: "DIVYA MENON",
    email: "divya.menon@nursing.edu",
    regNo: "NS2021005",
    steps: {
      step1: {
        studentName: "DIVYA MENON",
        age: "22",
        gender: "female",
        dateOfBirth: "2002-07-18",
        nationality: "Indian",
        religion: "Christian",
        community: "OC",
        nativity: "Tamil Nadu",
        maritalStatus: "single",
        parentGuardianName: "Thomas Menon",
        motherTongue: "Tamil",
        communicationAddress: "890, Mylapore, Chennai, Tamil Nadu - 600004",
        permanentAddress: "890, Mylapore, Chennai, Tamil Nadu - 600004",
        contactMobile: "9876543214",
        studentEmail: "divya.menon@nursing.edu",
        aadharNo: "567890123456",
        ociNumber: "",
        emisNo: "TN2021005",
        mediumOfInstruction: "English",
      },
      step2: {
        streamGroup: "Biology",
        subjects: [
          {
            subject: "Tamil",
            plusOneAttempts: [{ maxMarks: "100", score: "84", percentage: "84" }],
            plusTwoAttempts: [{ maxMarks: "100", score: "86", percentage: "86" }],
          },
          {
            subject: "English",
            plusOneAttempts: [{ maxMarks: "100", score: "91", percentage: "91" }],
            plusTwoAttempts: [{ maxMarks: "100", score: "93", percentage: "93" }],
          },
          {
            subject: "Physics",
            plusOneAttempts: [{ maxMarks: "100", score: "83", percentage: "83" }],
            plusTwoAttempts: [{ maxMarks: "100", score: "86", percentage: "86" }],
          },
          {
            subject: "Chemistry",
            plusOneAttempts: [{ maxMarks: "100", score: "87", percentage: "87" }],
            plusTwoAttempts: [{ maxMarks: "100", score: "89", percentage: "89" }],
          },
          {
            subject: "Biology",
            plusOneAttempts: [{ maxMarks: "100", score: "94", percentage: "94" }],
            plusTwoAttempts: [{ maxMarks: "100", score: "96", percentage: "96" }],
          },
        ],
        totalPlusOneMaxMarks: "500",
        totalPlusOneScore: "439",
        totalPlusOnePercentage: "87.8",
        totalPlusTwoMaxMarks: "500",
        totalPlusTwoScore: "450",
        totalPlusTwoPercentage: "90",
        certificateNo: "CERT2021005",
        certificateDate: "2021-05-21",
        yearOfPassing: "2021",
        boardOfExamination: "Tamil Nadu State Board",
        mediumOfInstruction: "English",
        hscVerificationNo: "HSC2021005",
        hscVerificationDate: "2021-06-11",
      },
      step3: {
        dateOfAdmission: "2021-08-19",
        admissionNumber: "ADM2021005",
        rollNumber: "ROLL2021005",
        universityRegistration: "UNIV2021005",
        allotmentCategory: "Government",
        govtAllotmentNo: "GOVT2021005",
        scholarshipSource: "Minority Scholarship",
        scholarshipAmount: "60000",
      },
      step4: {
        semesters: [
          { semester: "I", workingDays: "90", annualLeave: "2", sickLeave: "1", gazettedHolidays: "5", otherLeave: "0", compensationDaysHours: "0" },
          { semester: "II", workingDays: "94", annualLeave: "2", sickLeave: "1", gazettedHolidays: "4", otherLeave: "0", compensationDaysHours: "0" },
          { semester: "III", workingDays: "91", annualLeave: "3", sickLeave: "1", gazettedHolidays: "5", otherLeave: "0", compensationDaysHours: "0" },
          { semester: "IV", workingDays: "89", annualLeave: "2", sickLeave: "2", gazettedHolidays: "6", otherLeave: "0", compensationDaysHours: "0" },
          { semester: "V", workingDays: "87", annualLeave: "4", sickLeave: "1", gazettedHolidays: "5", otherLeave: "0", compensationDaysHours: "0" },
          { semester: "VI", workingDays: "92", annualLeave: "2", sickLeave: "1", gazettedHolidays: "4", otherLeave: "0", compensationDaysHours: "0" },
          { semester: "VII", workingDays: "90", annualLeave: "3", sickLeave: "1", gazettedHolidays: "5", otherLeave: "0", compensationDaysHours: "0" },
          { semester: "VIII", workingDays: "84", annualLeave: "3", sickLeave: "2", gazettedHolidays: "6", otherLeave: "0", compensationDaysHours: "0" },
        ],
      },
      step5: {
        semesters: [
          { semester: "I", sports: "Volleyball", coCurricular: "Debate", extraCurricular: "Music", sna: "Yes", nssYrcRrc: "NSS", cne: "Yes", awardsRewards: "" },
          { semester: "II", sports: "Volleyball", coCurricular: "Quiz", extraCurricular: "Dance", sna: "Yes", nssYrcRrc: "NSS", cne: "Yes", awardsRewards: "" },
          { semester: "III", sports: "Badminton", coCurricular: "Drama", extraCurricular: "Art", sna: "Yes", nssYrcRrc: "NSS", cne: "Yes", awardsRewards: "" },
          { semester: "IV", sports: "Badminton", coCurricular: "Debate", extraCurricular: "Music", sna: "Yes", nssYrcRrc: "NSS", cne: "Yes", awardsRewards: "" },
          { semester: "V", sports: "Athletics", coCurricular: "Quiz", extraCurricular: "Dance", sna: "Yes", nssYrcRrc: "YRC", cne: "Yes", awardsRewards: "" },
          { semester: "VI", sports: "Athletics", coCurricular: "Drama", extraCurricular: "Art", sna: "Yes", nssYrcRrc: "YRC", cne: "Yes", awardsRewards: "" },
          { semester: "VII", sports: "Volleyball", coCurricular: "Debate", extraCurricular: "Music", sna: "Yes", nssYrcRrc: "YRC", cne: "Yes", awardsRewards: "" },
          { semester: "VIII", sports: "Volleyball", coCurricular: "Quiz", extraCurricular: "Dance", sna: "Yes", nssYrcRrc: "YRC", cne: "Yes", awardsRewards: "" },
        ],
      },
      step6: {
        semester: "I",
        courses: [],
      },
      step7: {
        visits: [
          { semester: "I", institutionPlace: "Social Organization", date: "2021-10-15" },
          { semester: "II", institutionPlace: "Hospital Visit on Hospital Management System", date: "2022-02-20" },
          { semester: "III", institutionPlace: "Blood Bank", date: "2022-08-10" },
        ],
      },
      step8: {
        records: [
          { semester: "I", clinicalArea: "Nursing Foundation I including First Aid Module", credits: "2", prescribedWeeks: "10", prescribedHours: "160", completedHours: "160", hospital: "Government General Hospital" },
          { semester: "I", clinicalArea: "General Medical Ward", credits: "1", prescribedWeeks: "5", prescribedHours: "80", completedHours: "80", hospital: "Government General Hospital" },
        ],
      },
      step9: {
        projects: [
          { semester: "V", areaOfStudy: "Community Health", type: "Group", projectTitle: "Health Awareness Campaign in Rural Areas" },
          { semester: "VI", areaOfStudy: "Mental Health", type: "Individual", projectTitle: "Stress Management Among Nursing Students" },
        ],
      },
      step10: {
        courses: [
          { courseName: "Basic Life Support (BLS)", from: "2022-01-10", to: "2022-01-12" },
          { courseName: "First Aid Training", from: "2021-09-15", to: "2021-09-17" },
        ],
      },
      step11: {
        completions: [
          { courseName: "Course completion certificate", certificateNumber: "CC2025001", dateOfIssue: "2025-05-15" },
          { courseName: "Transfer certificate", certificateNumber: "", dateOfIssue: "" },
          { courseName: "Provisional certificate", certificateNumber: "", dateOfIssue: "" },
          { courseName: "Degree certificate", certificateNumber: "", dateOfIssue: "" },
          { courseName: "Nursing registration certificate", certificateNumber: "", dateOfIssue: "" },
          { courseName: "TNAI card", certificateNumber: "", dateOfIssue: "" },
        ],
      },
      step12: {
        verifications: [
          { semester: "I", classTeacherName: "Dr. Lakshmi Menon", teacherSignature: "", principalSignature: "", verificationDate: "2021-12-20" },
          { semester: "II", classTeacherName: "Dr. Lakshmi Menon", teacherSignature: "", principalSignature: "", verificationDate: "2022-05-25" },
          { semester: "III", classTeacherName: "Dr. Priya Kumar", teacherSignature: "", principalSignature: "", verificationDate: "2022-12-18" },
          { semester: "IV", classTeacherName: "Dr. Priya Kumar", teacherSignature: "", principalSignature: "", verificationDate: "2023-05-22" },
        ],
      },
    },
  },
];
