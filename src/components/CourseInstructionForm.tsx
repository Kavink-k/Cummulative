// import { useState, useEffect } from "react";
// import { useForm, useFieldArray } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Input } from "@/components/ui/input";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
// import { apiService } from "@/lib/api";
// import { toast } from "sonner";
 
// interface Course {
//   slNo: number;
//   courseCode: string;
//   universityCourseCode: string;
//   courseTitle: string;
//   theoryCredits: string;
//   skillLabCredits: string;
//   clinicalCredits: string;
//   theoryPrescribed: number;
//   theoryAttended?: string;
//   theoryPercentage?: string;
//   skillLabPrescribed: string;
//   skillLabAttended?: string;
//   skillLabPercentage?: string;
//   clinicalPrescribed: number;
//   clinicalAttended?: string;
//   clinicalPercentage?: string;
//   theoryInternalMax: string;
//   theoryInternalObtained?: string;
//   theoryEndSemMax: number;
//   theoryEndSemObtained?: string;
//   theoryTotalMax: number;
//   theoryTotalObtained?: string;
//   practicalInternalMax: number;
//   practicalInternalObtained?: string;
//   practicalEndSemMax: number;
//   practicalEndSemObtained?: string;
//   practicalTotalMax: number;
//   practicalTotalObtained?: string;
//   gradePoint?: string;
//   letterGrade?: string;
// }
 
// const semesterData: Record<string, Course[]> = {
//   "I": [
//     {
//       slNo: 1,
//       courseCode: "ENGL 101",
//       universityCourseCode: "",
//       courseTitle: "Communicative English",
//       theoryCredits: "2",
//       skillLabCredits: "-",
//       clinicalCredits: "-",
//       theoryPrescribed: 40,
//       theoryAttended: "",
//       theoryPercentage: "",
//       skillLabPrescribed: "-",
//       clinicalPrescribed: 0,
//       theoryInternalMax: "25",
//       theoryEndSemMax: 25,
//       theoryTotalMax: 50,
//       practicalInternalMax: 0,
//       practicalEndSemMax: 0,
//       practicalTotalMax: 0
//     },
//     {
//       slNo: 2,
//       courseCode: "ANAT 105",
//       universityCourseCode: "",
//       courseTitle: "Applied Anatomy",
//       theoryCredits: "3",
//       skillLabCredits: "-",
//       clinicalCredits: "-",
//       theoryPrescribed: 60,
//       skillLabPrescribed: "-",
//       clinicalPrescribed: 0,
//       theoryInternalMax: "25",
//       theoryEndSemMax: 75,
//       theoryTotalMax: 100,
//       practicalInternalMax: 0,
//       practicalEndSemMax: 0,
//       practicalTotalMax: 0
//     },
//     {
//       slNo: 3,
//       courseCode: "PHYS 110",
//       universityCourseCode: "",
//       courseTitle: "Applied Physiology",
//       theoryCredits: "3",
//       skillLabCredits: "-",
//       clinicalCredits: "-",
//       theoryPrescribed: 60,
//       skillLabPrescribed: "-",
//       clinicalPrescribed: 0,
//       theoryInternalMax: "25",
//       theoryEndSemMax: 75,
//       theoryTotalMax: 100,
//       practicalInternalMax: 0,
//       practicalEndSemMax: 0,
//       practicalTotalMax: 0
//     },
//     {
//       slNo: 4,
//       courseCode: "SOCI 115",
//       universityCourseCode: "",
//       courseTitle: "Applied Sociology",
//       theoryCredits: "3",
//       skillLabCredits: "-",
//       clinicalCredits: "-",
//       theoryPrescribed: 60,
//       skillLabPrescribed: "-",
//       clinicalPrescribed: 0,
//       theoryInternalMax: "25",
//       theoryEndSemMax: 75,
//       theoryTotalMax: 100,
//       practicalInternalMax: 0,
//       practicalEndSemMax: 0,
//       practicalTotalMax: 0
//     },
//     {
//       slNo: 5,
//       courseCode: "PSYC 120",
//       universityCourseCode: "",
//       courseTitle: "Applied Psychology",
//       theoryCredits: "3",
//       skillLabCredits: "-",
//       clinicalCredits: "-",
//       theoryPrescribed: 80,
//       skillLabPrescribed: "30",
//       clinicalPrescribed: 250,
//       theoryInternalMax: "25",
//       theoryEndSemMax: 75,
//       theoryTotalMax: 100,
//       practicalInternalMax: 0,
//       practicalEndSemMax: 100,
//       practicalTotalMax: 100
//     },
//     {
//       slNo: 6,
//       courseCode: "N-NF(I) 125",
//       universityCourseCode: "",
//       courseTitle: "Nursing Foundation I IncludingFirst Aid module ",
//       theoryCredits: "6",
//       skillLabCredits: "-",
//       clinicalCredits: "-",
//       theoryPrescribed: 120,
//       skillLabPrescribed: "80",
//       clinicalPrescribed: 0,
//       theoryInternalMax: "25",
//       theoryEndSemMax: 75,
//       theoryTotalMax: 100,
//       practicalInternalMax: 0,
//       practicalEndSemMax: 0,
//       practicalTotalMax: 0
//     },
//     {
//       slNo: 7,
//       courseCode: "SSCC (I) 130",
//       universityCourseCode: "",
//       courseTitle: "Self-study/Co-curricular",
//       theoryCredits: "0",
//       skillLabCredits: "-",
//       clinicalCredits: "-",
//       theoryPrescribed: 0,
//       skillLabPrescribed: "-",
//       clinicalPrescribed: 0,
//       theoryInternalMax: "-",
//       theoryEndSemMax: 0,
//       theoryTotalMax: 0,
//       practicalInternalMax: 0,
//       practicalEndSemMax: 0,
//       practicalTotalMax: 0
//     }
//   ],
//   "II": [
//     {
//       slNo: 8,
//       courseCode: "BIOC 135",
//       universityCourseCode: "",
//       courseTitle: "Applied Biochemistry",
//       theoryCredits: "2",
//       skillLabCredits: "-",
//       clinicalCredits: "-",
//       theoryPrescribed: 40,
//       skillLabPrescribed: "-",
//       clinicalPrescribed: 0,
//       theoryInternalMax: "25",
//       theoryEndSemMax: 75,
//       theoryTotalMax: 100,
//       practicalInternalMax: 0,
//       practicalEndSemMax: 0,
//       practicalTotalMax: 0
//     },
//     {
//       slNo: 9,
//       courseCode: "NUTR 140",
//       universityCourseCode: "",
//       courseTitle: "Applied Nutrition and Dietetics",
//       theoryCredits: "3",
//       skillLabCredits: "-",
//       clinicalCredits: "-",
//       theoryPrescribed: 60,
//       skillLabPrescribed: "-",
//       clinicalPrescribed: 0,
//       theoryInternalMax: "25",
//       theoryEndSemMax: 75,
//       theoryTotalMax: 100,
//       practicalInternalMax: 0,
//       practicalEndSemMax: 0,
//       practicalTotalMax: 0
//     },
//     {
//       slNo: 10,
//       courseCode: "N-NF (II) 125",
//       universityCourseCode: "",
//       courseTitle: "Nursing Foundation II  Including Health Assessment Module(Nursing Foundation(I&II)",
//       theoryCredits: "6",
//       skillLabCredits: "-",
//       clinicalCredits: "-",
//       theoryPrescribed: 120,
//       skillLabPrescribed: "120",
//       clinicalPrescribed: 320,
//       theoryInternalMax: "25",
//       theoryEndSemMax: 75,
//       theoryTotalMax: 100,
//       practicalInternalMax: 50,
//       practicalEndSemMax: 50,
//       practicalTotalMax: 100
//     },
//     {
//       slNo: 11,
//       courseCode: "HNIT 145",
//       universityCourseCode: "",
//       courseTitle: "Health/Nursing Informatics & Technology",
//       theoryCredits: "2",
//       skillLabCredits: "-",
//       clinicalCredits: "-",
//       theoryPrescribed: 40,
//       skillLabPrescribed: "40",
//       clinicalPrescribed: 0,
//       theoryInternalMax: "25",
//       theoryEndSemMax: 25,
//       theoryTotalMax: 50,
//       practicalInternalMax: 0,
//       practicalEndSemMax: 0,
//       practicalTotalMax: 0
//     },
//     {
//       slNo: 12,
//       courseCode: "SSCC (II) 130",
//       universityCourseCode: "",
//       courseTitle: "Self-study/Co-curricular",
//       theoryCredits: "0",
//       skillLabCredits: "-",
//       clinicalCredits: "-",
//       theoryPrescribed: 0,
//       skillLabPrescribed: "-",
//       clinicalPrescribed: 0,
//       theoryInternalMax: "-",
//       theoryEndSemMax: 0,
//       theoryTotalMax: 0,
//       practicalInternalMax: 0,
//       practicalEndSemMax: 0,
//       practicalTotalMax: 0
//     }
//   ],
//   "III":[
//     {
//       slNo: 13,
//       courseCode: "MICR 201",
//       universityCourseCode: "",
//       courseTitle: "Applied microbiology and infection control including safety",
//       theoryCredits: "2",
//       skillLabCredits: "1",
//       clinicalCredits: "-",
//       theoryPrescribed: 40,
//       skillLabPrescribed: "40",
//       clinicalPrescribed: 0,
//       theoryInternalMax: "25",
//       theoryEndSemMax: 75,
//       theoryTotalMax: 100,
//       practicalInternalMax: 0,
//       practicalEndSemMax: 0,
//       practicalTotalMax: 0
//     },
//     {
//       slNo: 14,
//       courseCode: "PHAR(I)205",
//       universityCourseCode: "",
//       courseTitle: "Pharmacology I",
//       theoryCredits: "1",
//       skillLabCredits: "-",
//       clinicalCredits: "-",
//       theoryPrescribed: 20,
//       skillLabPrescribed: "-",
//       clinicalPrescribed: 0,
//       theoryInternalMax: "25",
//       theoryEndSemMax: 0,
//       theoryTotalMax: 0,
//       practicalInternalMax: 0,
//       practicalEndSemMax: 0,
//       practicalTotalMax: 0
//     },
    
//       {
//       slNo: 15,
//       courseCode: "PATH(I)210",
//       universityCourseCode: "",
//       courseTitle: "Pathology I",
//       theoryCredits: "1",
//       skillLabCredits: "-",
//       clinicalCredits: "-",
//       theoryPrescribed: 20,
//       skillLabPrescribed: "-",
//       clinicalPrescribed: 0,
//       theoryInternalMax: "25",
//       theoryEndSemMax: 0,
//       theoryTotalMax: 0,
//       practicalInternalMax: 0,
//       practicalEndSemMax: 0,
//       practicalTotalMax: 0
//     },
//     {
//       slNo: 16,
//       courseCode: "N-AHN(I)215",
//       universityCourseCode: "",
//       courseTitle: "Adult Health Nursing I With Integrated Pathophysiology Including BCLS Module(Adult Health Nursing I)",
//       theoryCredits: "7",
//       skillLabCredits: "1",
//       clinicalCredits: "6",
//       theoryPrescribed: 140,
//       skillLabPrescribed: "-",
//       clinicalPrescribed: 480,
//       theoryInternalMax: "25",
//       theoryEndSemMax: 75,
//       theoryTotalMax: 100,
//       practicalInternalMax: 50,
//       practicalEndSemMax: 50,
//       practicalTotalMax: 100
//     },
//     {
//       slNo: 17,
//       courseCode: "SSCC(I)220",
//       universityCourseCode: "",
//       courseTitle: "Self-Study/Co-Curricular",
//       theoryCredits: "0",
//       skillLabCredits: "-",
//       clinicalCredits: "-",
//       theoryPrescribed: 0,
//       skillLabPrescribed: "-",
//       clinicalPrescribed: 0,
//       theoryInternalMax: "-",
//       theoryEndSemMax: 0,
//       theoryTotalMax: 0,
//       practicalInternalMax: 0,
//       practicalEndSemMax: 0,
//       practicalTotalMax: 0
//     }
//   ],
//   "IV": [
//     {
//       slNo: 18,
//       courseCode: "PHAR(II)205",
//       universityCourseCode: "",
//       courseTitle: "Pharmacology II including Fundamentals of prescribing module",
//       theoryCredits: "3",
//       skillLabCredits: "-",
//       clinicalCredits: "-",
//       theoryPrescribed: 60,
//       skillLabPrescribed: "-",
//       clinicalPrescribed: 0,
//       theoryInternalMax: "25",
//       theoryEndSemMax: 75,
//       theoryTotalMax: 100,
//       practicalInternalMax: 0,
//       practicalEndSemMax: 0,
//       practicalTotalMax: 0
//     },
//     {
//       slNo: 19,
//       courseCode: "PATH(II)210",
//       universityCourseCode: "",
//       courseTitle: "Pathology II& Genetics",
//       theoryCredits: "1",
//       skillLabCredits: "-",
//       clinicalCredits: "-",
//       theoryPrescribed: 20,
//       skillLabPrescribed: "-",
//       clinicalPrescribed: 0,
//       theoryInternalMax: "25",
//       theoryEndSemMax: 75,
//       theoryTotalMax: 100,
//       practicalInternalMax: 0,
//       practicalEndSemMax: 0,
//       practicalTotalMax: 0
//     },
//     {
//       slNo: 20,
//       courseCode: "N-AHN(II)225",
//       universityCourseCode: "",
//       courseTitle: "Adult Health Nursing -II With Integrated Pathophysiology Including Geriatric Nursing+ Paliative Care Module",
//       theoryCredits: "7",
//       skillLabCredits: "1",
//       clinicalCredits: "6",
//       theoryPrescribed: 140,
//       skillLabPrescribed: "40",
//       clinicalPrescribed: 480,
//       theoryInternalMax: "25",
//       theoryEndSemMax: 75,
//       theoryTotalMax: 100,
//       practicalInternalMax: 50,
//       practicalEndSemMax: 50,
//       practicalTotalMax: 100
//     },
//     {
//       slNo: 21,
//       courseCode: "PROF230",
//       universityCourseCode: "",
//       courseTitle: "Professionalism,professional values,Ethics Including Bioethics",
//       theoryCredits: "1",
//       skillLabCredits: "-",
//       clinicalCredits: "-",
//       theoryPrescribed: 20,
//       skillLabPrescribed: "-",
//       clinicalPrescribed: 0,
//       theoryInternalMax: "25",
//       theoryEndSemMax: 25,
//       theoryTotalMax: 50,
//       practicalInternalMax: 0,
//       practicalEndSemMax: 0,
//       practicalTotalMax: 0
//     },
//     {
//       slNo: 22,
//       courseCode: "",
//       universityCourseCode: "",
//       courseTitle: "Elective I",
//       theoryCredits: "1",
//       skillLabCredits: "-",
//       clinicalCredits: "-",
//       theoryPrescribed: 20,
//       skillLabPrescribed: "-",
//       clinicalPrescribed: 0,
//       theoryInternalMax: "-",
//       theoryEndSemMax: 50,
//       theoryTotalMax: 50,
//       practicalInternalMax: 0,
//       practicalEndSemMax: 0,
//       practicalTotalMax: 0
//     },
//     {
//       slNo: 23,
//       courseCode: "SSCC(II)220",
//       universityCourseCode: "",
//       courseTitle: "Self-study/Co-curricular",
//       theoryCredits: "0",
//       skillLabCredits: "-",
//       clinicalCredits: "-",
//       theoryPrescribed: 0,
//       skillLabPrescribed: "-",
//       clinicalPrescribed: 0,
//       theoryInternalMax: "-",
//       theoryEndSemMax: 0,
//       theoryTotalMax: 0,
//       practicalInternalMax: 0,
//       practicalEndSemMax: 0,
//       practicalTotalMax: 0
//     }
//   ],
//   "V":[
//     {
//       slNo: 24,
//       courseCode: "N-CHN(I)301",
//       universityCourseCode: "",
//       courseTitle: "Child Health Nursing -I including Essential New born Care (ENBC),FBNC,IMNCI,and PLS Modules",
//       theoryCredits: "3",
//       skillLabCredits: "1",
//       clinicalCredits: "2",
//       theoryPrescribed: 60,
//       skillLabPrescribed: "40",
//       clinicalPrescribed: 160,
//       theoryInternalMax: "25",
//       theoryEndSemMax: 0,
//       theoryTotalMax: 0,
//       practicalInternalMax: 25,
//       practicalEndSemMax: 0,
//       practicalTotalMax: 0
//     },
    
      
//     {
//       slNo: 25,
//       courseCode: "N-HN(I)305",
//       universityCourseCode: "",
//       courseTitle: "Mental Health Nursing-I",
//       theoryCredits: "3",
//       skillLabCredits: "-",
//       clinicalCredits: "1",
//       theoryPrescribed: 60,
//       skillLabPrescribed: "-",
//       clinicalPrescribed:80,
//       theoryInternalMax: "25",
//       theoryEndSemMax: 0,
//       theoryTotalMax: 0,
//       practicalInternalMax: 25,
//       practicalEndSemMax: 0,
//       practicalTotalMax: 0
//     },
//     {
//       slNo: 26,
//       courseCode: "N-COMH(1)310",
//       universityCourseCode: "",
//       courseTitle: "Community Health Nursing-I including Environmental Science &Epidemiology",
//       theoryCredits: "5",
//       skillLabCredits: "-",
//       clinicalCredits: "2",
//       theoryPrescribed: 100,
//       skillLabPrescribed: "-",
//       clinicalPrescribed: 160,
//       theoryInternalMax: "25",
//       theoryEndSemMax: 75,
//       theoryTotalMax: 100,
//       practicalInternalMax: 0,
//       practicalEndSemMax: 50,
//       practicalTotalMax: 100
//     },
//     {
//       slNo: 27,
//       courseCode: "EDUC 315",
//       universityCourseCode: "",
//       courseTitle: "Educational technology/Nursing Education",
//       theoryCredits: "2",
//       skillLabCredits: "1",
//       clinicalCredits: "-",
//       theoryPrescribed: 40,
//       skillLabPrescribed: "40",
//       clinicalPrescribed: 0,
//       theoryInternalMax: "25",
//       theoryEndSemMax: 75,
//       theoryTotalMax: 100,
//       practicalInternalMax: 0,
//       practicalEndSemMax: 0,
//       practicalTotalMax: 0,
//     }
//     ,
//     {
//       slNo: 28,
//       courseCode: "N-FORN 320",
//       universityCourseCode: "",
//       courseTitle: "Introduction to Forensic Nursing and Indian Laws",
//       theoryCredits: "1",
//       skillLabCredits: "-",
//       clinicalCredits: "-",
//       theoryPrescribed: 20,
//       skillLabPrescribed: "-",
//       clinicalPrescribed: 0,
//       theoryInternalMax: "25",
//       theoryEndSemMax: 25,
//       theoryTotalMax: 50,
//       practicalInternalMax: 0,
//       practicalEndSemMax: 0,
//       practicalTotalMax: 0,
//     },
//     {
//       slNo: 29,
//       courseCode: "SSCC(I)325",
//       universityCourseCode: "",
//       courseTitle: "Self-study/Co-curricular",
//       theoryCredits: "0",
//       skillLabCredits: "-",
//       clinicalCredits: "-",
//       theoryPrescribed: 0,
//       skillLabPrescribed: "-",
//       clinicalPrescribed: 0,
//       theoryInternalMax: "-",
//       theoryEndSemMax: 0,
//       theoryTotalMax: 0,
//       practicalInternalMax: 0,
//       practicalEndSemMax: 0,
//       practicalTotalMax: 0
//     }
//       ],
//       "VI":[
//     {
//       slNo: 24,
//       courseCode: "N-CHN(II)301",
//       universityCourseCode: "",
//       courseTitle: "Child Health Nursing(I&II)",
//       theoryCredits: "2",
//       skillLabCredits: "-",
//       clinicalCredits: "1",
//       theoryPrescribed: 40,
//       skillLabPrescribed: "-",
//       clinicalPrescribed: 80,
//       theoryInternalMax: "25",
//       theoryEndSemMax: 75,
//       theoryTotalMax: 100,
//       practicalInternalMax: 50,
//       practicalEndSemMax: 50,
//       practicalTotalMax: 100
//     },
    
      
//     {
//       slNo: 25,
//       courseCode: "N-HN(II)305",
//       universityCourseCode: "",
//       courseTitle: "Mental Health Nursing(I&II)",
//       theoryCredits: "2",
//       skillLabCredits: "-",
//       clinicalCredits: "1",
//       theoryPrescribed: 40,
//       skillLabPrescribed: "-",
//       clinicalPrescribed: 80,
//       theoryInternalMax: "25",
//       theoryEndSemMax: 75,
//       theoryTotalMax: 100,
//       practicalInternalMax: 50,
//       practicalEndSemMax: 50,
//       practicalTotalMax: 100
//     },
//     {
//       slNo: 26,
//       courseCode: "NMLE330",
//       universityCourseCode: "",
//       courseTitle: "Nursing Management &Leadership",
//       theoryCredits: "3",
//       skillLabCredits: "1",
//       clinicalCredits: "-",
//       theoryPrescribed: 60,
//       skillLabPrescribed: "-",
//       clinicalPrescribed: 80,
//       theoryInternalMax: "25",
//       theoryEndSemMax: 75,
//       theoryTotalMax: 100,
//       practicalInternalMax: 0,
//       practicalEndSemMax: 0,
//       practicalTotalMax: 0
//     },
//     {
//       slNo: 27,
//       courseCode: "N-IDW(I)/OBG335",
//       universityCourseCode: "",
//       courseTitle: "Midwifery/Obsterics and Gynecology (OBG)Nursing I Including SBA module",
//       theoryCredits: "3",
//       skillLabCredits: "1",
//       clinicalCredits: "3",
//       theoryPrescribed: 60,
//       skillLabPrescribed: "40",
//       clinicalPrescribed:240,
//       theoryInternalMax: "25",
//       theoryEndSemMax: 0,
//       theoryTotalMax: 0,
//       practicalInternalMax: 25,
//       practicalEndSemMax: 0,
//       practicalTotalMax: 0
//     },
//     {
//       slNo: 28,
//       courseCode: "",
//       universityCourseCode: "",
//       courseTitle: "Elective 2",
//       theoryCredits: "1",
//       skillLabCredits: "-",
//       clinicalCredits: "-",
//       theoryPrescribed: 20,
//       skillLabPrescribed: "-",
//       clinicalPrescribed: 0,
//       theoryInternalMax: "-",
//       theoryEndSemMax: 50,
//       theoryTotalMax: 50,
//       practicalInternalMax: 0,
//       practicalEndSemMax: 0,
//       practicalTotalMax: 0
//     }
//       ],
 
//     "VII":[
//       {
//         slNo: 29,
//       courseCode: "N-COMH 401",
//       universityCourseCode: "",
//       courseTitle: "Community Health Nursing II",
//       theoryCredits: "5",
//       skillLabCredits: "-",
//       clinicalCredits: "2",
//       theoryPrescribed: 100,
//       skillLabPrescribed: "-",
//       clinicalPrescribed: 160,
//       theoryInternalMax: "25",
//       theoryEndSemMax: 75,
//       theoryTotalMax: 100,
//       practicalInternalMax: 50,
//       practicalEndSemMax: 50,
//       practicalTotalMax: 100
//       },
//       {
//         slNo: 30,
//       courseCode: "NRST405",
//       universityCourseCode: "",
//       courseTitle: "Nursing Research&Statistics",
//       theoryCredits: "2",
//       skillLabCredits: "2",
//       clinicalCredits: "-",
//       theoryPrescribed: 40,
//       skillLabPrescribed: "80",
//       clinicalPrescribed: 0,
//       theoryInternalMax: "25",
//       theoryEndSemMax: 75,
//       theoryTotalMax: 100,
//       practicalInternalMax: 0,
//       practicalEndSemMax: 0,
//       practicalTotalMax: 0
//       },
//       {
//         slNo: 31,
//       courseCode: "N-MIDW(II)/OBG 410",
//       universityCourseCode: "",
//       courseTitle: "MidWifery/Obsterics and Gynecology(OBG) Nursing II Including Safe delivery App Module",
//       theoryCredits: "3",
//       skillLabCredits: "1",
//       clinicalCredits: "4",
//       theoryPrescribed: 60,
//       skillLabPrescribed: "40",
//       clinicalPrescribed: 320,
//       theoryInternalMax: "25",
//       theoryEndSemMax: 75,
//       theoryTotalMax: 100,
//       practicalInternalMax: 50,
//       practicalEndSemMax: 50,
//       practicalTotalMax: 100
//       },
 
 
      
//       {
//         slNo: 32,
//       courseCode: "",
//       universityCourseCode: "",
//       courseTitle: "Elective 3",
//       theoryCredits: "1",
//       skillLabCredits: "-",
//       clinicalCredits: "-",
//       theoryPrescribed: 20,
//       skillLabPrescribed: "-",
//       clinicalPrescribed: 0,
//       theoryInternalMax: "-",
//       theoryEndSemMax: 50,
//       theoryTotalMax: 50,
//       practicalInternalMax: 0,
//       practicalEndSemMax: 0,
//       practicalTotalMax: 0
//     }
//   ],
//   "VIII": [
//     {
//       slNo: 33,
//       courseCode: "INTEA",
//       universityCourseCode: "",
//       courseTitle: "Community Health Nursing-4 weeks",
//       theoryCredits: "-",
//       skillLabCredits: "-",
//       clinicalCredits: "12",
//       theoryPrescribed: 0,
//       skillLabPrescribed: "-",
//       clinicalPrescribed: 192,
//       theoryInternalMax: "-",
//       theoryEndSemMax: 0,
//       theoryTotalMax: 0,
//       practicalInternalMax: 0,
//       practicalEndSemMax: 0,
//       practicalTotalMax: 200
//     },
//     {
//       slNo: 34,
//       courseCode: "INTE420",
//       universityCourseCode: "",
//       courseTitle: "Adult Health Nursing-6 weeks",
//       theoryCredits: "-",
//       skillLabCredits: "-",
//       clinicalCredits: "-",
//       theoryPrescribed: 0,
//       skillLabPrescribed: "-",
//       clinicalPrescribed: 288,
//       theoryInternalMax: "-",
//       theoryEndSemMax: 0,
//       theoryTotalMax: 0,
//       practicalInternalMax: 0,
//       practicalEndSemMax: 0,
//       practicalTotalMax: 0
//     },
//     {
//       slNo: 35,
//       courseCode: "INTE425",
//       universityCourseCode: "",
//       courseTitle: "Child Health Nursing-4 weeks",
//       theoryCredits: "0",
//       skillLabCredits: "-",
//       clinicalCredits: "-",
//       theoryPrescribed: 0,
//       skillLabPrescribed: "-",
//       clinicalPrescribed: 192,
//       theoryInternalMax: "-",
//       theoryEndSemMax: 0,
//       theoryTotalMax: 0,
//       practicalInternalMax: 0,
//       practicalEndSemMax: 0,
//       practicalTotalMax: 0
//     },
//     {
//       slNo: 36,
//       courseCode: "INTE430",
//       universityCourseCode: "",
//       courseTitle: "Mental Health Nursing -4weeks ",
//       theoryCredits: "0",
//       skillLabCredits: "-",
//       clinicalCredits: "-",
//       theoryPrescribed: 0,
//       skillLabPrescribed: "-",
//       clinicalPrescribed: 192,
//       theoryInternalMax: "-",
//       theoryEndSemMax: 0,
//       theoryTotalMax: 0,
//       practicalInternalMax: 0,
//       practicalEndSemMax: 0,
//       practicalTotalMax: 0
//     },
//     {
//       slNo: 37,
//       courseCode: "INTEA435",
//       universityCourseCode: "",
//       courseTitle: "Midwifery-4 weeks",
//       theoryCredits: "0",
//       skillLabCredits: "-",
//       clinicalCredits: "-",
//       theoryPrescribed: 0,
//       skillLabPrescribed: "-",
//       clinicalPrescribed: 192,
//       theoryInternalMax: "-",
//       theoryEndSemMax: 0,
//       theoryTotalMax: 0,
//       practicalInternalMax: 0,
//       practicalEndSemMax: 0,
//       practicalTotalMax: 0
      
//       }],
    
    
 
 
//   // Add more semesters as needed
// };

// interface CourseInstructionFormProps {
//   onSubmit: (data: any) => void;
//   defaultValues?: any;
//   onProgressChange?: (progress: number) => void;
//   studentId?: string;
// }
 
// const courseInstructionSchema = z.object({
//   studentId: z.string().optional(),
//   semester: z.string(),
//   courses: z.array(z.object({
//     slNo: z.number(),
//     courseCode: z.string(),
//     universityCourseCode: z.string(),
//     courseTitle: z.string(),
//     theoryCredits: z.string(),
//     skillLabCredits: z.string(),
//     clinicalCredits: z.string(),
//     theoryPrescribed: z.number(),
//     theoryAttended: z.string().optional(),
//     theoryPercentage: z.string().optional(),
//     skillLabPrescribed: z.string(),
//     skillLabAttended: z.string().optional(),
//     skillLabPercentage: z.string().optional(),
//     clinicalPrescribed: z.number(),
//     clinicalAttended: z.string().optional(),
//     clinicalPercentage: z.string().optional(),
//     theoryInternalMax: z.string(),
//     theoryInternalObtained: z.string().optional(),
//     theoryEndSemMax: z.number(),
//     theoryEndSemObtained: z.string().optional(),
//     theoryTotalMax: z.number(),
//     theoryTotalObtained: z.string().optional(),
//     practicalInternalMax: z.number(),
//     practicalInternalObtained: z.string().optional(),
//     practicalEndSemMax: z.number(),
//     practicalEndSemObtained: z.string().optional(),
//     practicalTotalMax: z.number(),
//     practicalTotalObtained: z.string().optional(),
//     gradePoint: z.string().optional(),
//     letterGrade: z.string().optional(),
//   })),
// });

// type CourseInstructionFormData = z.infer<typeof courseInstructionSchema>;

// export const CourseInstructionForm = ({ onSubmit, defaultValues, onProgressChange, studentId }: CourseInstructionFormProps) => {
//   const [selectedSemester, setSelectedSemester] = useState<string>("I");

//   const form = useForm<CourseInstructionFormData>({
//     resolver: zodResolver(courseInstructionSchema),
//     defaultValues: defaultValues || {
//       semester: "I",
//       courses: semesterData["I"],
//     },
//   });

//   const { fields, replace } = useFieldArray({
//     control: form.control,
//     name: "courses",
//   });

//   useEffect(() => {
//     const subscription = form.watch((values) => {
//       let filledFields = 0;
//       const fieldsPerCourse = [
//         "universityCourseCode", "theoryAttended", "theoryPercentage", "skillLabAttended", "skillLabPercentage",
//         "clinicalAttended", "clinicalPercentage", "theoryInternalObtained", "theoryEndSemObtained", "theoryTotalObtained",
//         "practicalInternalObtained", "practicalEndSemObtained", "practicalTotalObtained", "gradePoint", "letterGrade"
//       ];
//       values.courses?.forEach((course: any) => {
//         filledFields += fieldsPerCourse.filter(
//           (field) => course[field] && course[field].toString().trim() !== "" && course[field].toString().trim() !== "-"
//         ).length;
//       });
//       const totalRequiredFields = semesterData[selectedSemester].length * fieldsPerCourse.length;
//       const progress = (filledFields / totalRequiredFields) * 100;
//       onProgressChange?.(progress);
//     });
//     return () => subscription.unsubscribe();
//   }, [form, onProgressChange, selectedSemester]);

//   const handleSemesterChange = (semester: string) => {
//     setSelectedSemester(semester);
//     form.setValue("semester", semester);
//     replace(semesterData[semester] || []);
//   };

//   const handleSubmit = async (data: CourseInstructionFormData) => {
//     try {
//       await apiService.createCourseInstruction(data);
//       toast.success("Course instruction saved successfully!");
//       onSubmit(data);
//     } catch (error: any) {
//       console.error("Error saving course instruction:", error);
//       toast.error(error.response?.data?.message || "Failed to save course instruction");
//     }
//   };
 
//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
//         <div className="flex items-center gap-4">
//           <label className="font-semibold">Select Semester:</label>
//           <Select value={selectedSemester} onValueChange={handleSemesterChange}>
//             <SelectTrigger className="w-48">
//               <SelectValue />
//             </SelectTrigger>
//             <SelectContent>
//               {["I", "II", "III", "IV", "V", "VI", "VII", "VIII"].map((sem) => (
//                 <SelectItem key={sem} value={sem}>
//                   Semester {sem}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>

//         <div className="border rounded-lg overflow-x-auto">
//           <Table>
//             <TableHeader>
//               <TableRow className="bg-muted/50">
//                 <TableHead rowSpan={3} className="border-r text-center align-middle min-w-12">
//                   Sl. No.
//                 </TableHead>
//                 <TableHead rowSpan={3} className="border-r text-center align-middle min-w-32">
//                   Course Code
//                 </TableHead>
//                 <TableHead rowSpan={3} className="border-r text-center align-middle min-w-32">
//                   University Course Code
//                 </TableHead>
//                 <TableHead rowSpan={3} className="border-r text-center align-middle min-w-48">
//                   Course Title
//                 </TableHead>
//                 <TableHead colSpan={3} className="border-r text-center">
//                   Credits
//                 </TableHead>
//                 <TableHead colSpan={9} className="border-r text-center">
//                   Course Instruction Hours
//                 </TableHead>
//                 <TableHead colSpan={12} className="border-r text-center">
//                   Marks Obtained
//                 </TableHead>
//                 <TableHead rowSpan={3} className="border-r text-center align-middle min-w-20">
//                   Grade Point
//                 </TableHead>
//                 <TableHead rowSpan={3} className="border-r text-center align-middle min-w-20">
//                   Letter Grade
//                 </TableHead>
//               </TableRow>
//               <TableRow className="bg-muted/50">
//                 <TableHead className="border-r text-center min-w-16">Theory</TableHead>
//                 <TableHead className="border-r text-center min-w-16">Skill Lab</TableHead>
//                 <TableHead className="border-r text-center min-w-16">Clinical</TableHead>
//                 <TableHead colSpan={3} className="border-r text-center">Theory</TableHead>
//                 <TableHead colSpan={3} className="border-r text-center">Skill Lab</TableHead>
//                 <TableHead colSpan={3} className="border-r text-center">Clinical</TableHead>
//                 <TableHead colSpan={6} className="border-r text-center">Theory</TableHead>
//                 <TableHead colSpan={6} className="border-r text-center">Practical</TableHead>
//               </TableRow>
//               <TableRow className="bg-muted/50">
//                 <TableHead className="border-r text-center text-xs">P</TableHead>
//                 <TableHead className="border-r text-center text-xs">A</TableHead>
//                 <TableHead className="border-r text-center text-xs">%</TableHead>
//                 <TableHead className="border-r text-center text-xs">P</TableHead>
//                 <TableHead className="border-r text-center text-xs">A</TableHead>
//                 <TableHead className="border-r text-center text-xs">%</TableHead>
//                 <TableHead className="border-r text-center text-xs">P</TableHead>
//                 <TableHead className="border-r text-center text-xs">A</TableHead>
//                 <TableHead className="border-r text-center text-xs">%</TableHead>
//                 <TableHead className="border-r text-center text-xs">Internal Max</TableHead>
//                 <TableHead className="border-r text-center text-xs">Internal Obtained</TableHead>
//                 <TableHead className="border-r text-center text-xs">End Sem Max</TableHead>
//                 <TableHead className="border-r text-center text-xs">End Sem Obtained</TableHead>
//                 <TableHead className="border-r text-center text-xs">Total Max</TableHead>
//                 <TableHead className="border-r text-center text-xs">Total Obtained</TableHead>
//                 <TableHead className="border-r text-center text-xs">Internal Max</TableHead>
//                 <TableHead className="border-r text-center text-xs">Internal Obtained</TableHead>
//                 <TableHead className="border-r text-center text-xs">End Sem Max</TableHead>
//                 <TableHead className="border-r text-center text-xs">End Sem Obtained</TableHead>
//                 <TableHead className="border-r text-center text-xs">Total Max</TableHead>
//                 <TableHead className="border-r text-center text-xs">Total Obtained</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {fields.map((field, index) => (
//                 <TableRow key={field.id} className="hover:bg-muted/30">
//                   <TableCell className="border-r text-center">{field.slNo}</TableCell>
//                   <TableCell className="border-r text-sm">{field.courseCode}</TableCell>
//                   <TableCell className="border-r">
//                     <FormField
//                       control={form.control}
//                       name={`courses.${index}.universityCourseCode`}
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormControl>
//                             <Input {...field} className="h-8 text-xs" />
//                           </FormControl>
//                         </FormItem>
//                       )}
//                     />
//                   </TableCell>
//                   <TableCell className="border-r text-sm">{field.courseTitle}</TableCell>
//                   <TableCell className="border-r text-center">{field.theoryCredits}</TableCell>
//                   <TableCell className="border-r text-center">{field.skillLabCredits}</TableCell>
//                   <TableCell className="border-r text-center">{field.clinicalCredits}</TableCell>
//                   <TableCell className="border-r text-center text-sm">{field.theoryPrescribed}</TableCell>
//                   <TableCell className="border-r">
//                     <FormField
//                       control={form.control}
//                       name={`courses.${index}.theoryAttended`}
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormControl>
//                             <Input {...field} className="h-8 w-16 text-xs" />
//                           </FormControl>
//                         </FormItem>
//                       )}
//                     />
//                   </TableCell>
//                   <TableCell className="border-r">
//                     <FormField
//                       control={form.control}
//                       name={`courses.${index}.theoryPercentage`}
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormControl>
//                             <Input {...field} className="h-8 w-16 text-xs" />
//                           </FormControl>
//                         </FormItem>
//                       )}
//                     />
//                   </TableCell>
//                   <TableCell className="border-r text-center text-sm">{field.skillLabPrescribed}</TableCell>
//                   <TableCell className="border-r">
//                     <FormField
//                       control={form.control}
//                       name={`courses.${index}.skillLabAttended`}
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormControl>
//                             <Input {...field} className="h-8 w-16 text-xs" />
//                           </FormControl>
//                         </FormItem>
//                       )}
//                     />
//                   </TableCell>
//                   <TableCell className="border-r">
//                     <FormField
//                       control={form.control}
//                       name={`courses.${index}.skillLabPercentage`}
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormControl>
//                             <Input {...field} className="h-8 w-16 text-xs" />
//                           </FormControl>
//                         </FormItem>
//                       )}
//                     />
//                   </TableCell>
//                   <TableCell className="border-r text-center text-sm">{field.clinicalPrescribed}</TableCell>
//                   <TableCell className="border-r">
//                     <FormField
//                       control={form.control}
//                       name={`courses.${index}.clinicalAttended`}
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormControl>
//                             <Input {...field} className="h-8 w-16 text-xs" />
//                           </FormControl>
//                         </FormItem>
//                       )}
//                     />
//                   </TableCell>
//                   <TableCell className="border-r">
//                     <FormField
//                       control={form.control}
//                       name={`courses.${index}.clinicalPercentage`}
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormControl>
//                             <Input {...field} className="h-8 w-16 text-xs" />
//                           </FormControl>
//                         </FormItem>
//                       )}
//                     />
//                   </TableCell>
//                   <TableCell className="border-r text-center text-sm">{field.theoryInternalMax}</TableCell>
//                   <TableCell className="border-r">
//                     <FormField
//                       control={form.control}
//                       name={`courses.${index}.theoryInternalObtained`}
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormControl>
//                             <Input {...field} className="h-8 w-16 text-xs" />
//                           </FormControl>
//                         </FormItem>
//                       )}
//                     />
//                   </TableCell>
//                   <TableCell className="border-r text-center text-sm">{field.theoryEndSemMax}</TableCell>
//                   <TableCell className="border-r">
//                     <FormField
//                       control={form.control}
//                       name={`courses.${index}.theoryEndSemObtained`}
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormControl>
//                             <Input {...field} className="h-8 w-16 text-xs" />
//                           </FormControl>
//                         </FormItem>
//                       )}
//                     />
//                   </TableCell>
//                   <TableCell className="border-r text-center text-sm">{field.theoryTotalMax}</TableCell>
//                   <TableCell className="border-r">
//                     <FormField
//                       control={form.control}
//                       name={`courses.${index}.theoryTotalObtained`}
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormControl>
//                             <Input {...field} className="h-8 w-16 text-xs" />
//                           </FormControl>
//                         </FormItem>
//                       )}
//                     />
//                   </TableCell>
//                   <TableCell className="border-r text-center text-sm">{field.practicalInternalMax}</TableCell>
//                   <TableCell className="border-r">
//                     <FormField
//                       control={form.control}
//                       name={`courses.${index}.practicalInternalObtained`}
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormControl>
//                             <Input {...field} className="h-8 w-16 text-xs" />
//                           </FormControl>
//                         </FormItem>
//                       )}
//                     />
//                   </TableCell>
//                   <TableCell className="border-r text-center text-sm">{field.practicalEndSemMax}</TableCell>
//                   <TableCell className="border-r">
//                     <FormField
//                       control={form.control}
//                       name={`courses.${index}.practicalEndSemObtained`}
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormControl>
//                             <Input {...field} className="h-8 w-16 text-xs" />
//                           </FormControl>
//                         </FormItem>
//                       )}
//                     />
//                   </TableCell>
//                   <TableCell className="border-r text-center text-sm">{field.practicalTotalMax}</TableCell>
//                   <TableCell className="border-r">
//                     <FormField
//                       control={form.control}
//                       name={`courses.${index}.practicalTotalObtained`}
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormControl>
//                             <Input {...field} className="h-8 w-16 text-xs" />
//                           </FormControl>
//                         </FormItem>
//                       )}
//                     />
//                   </TableCell>
//                   <TableCell className="border-r">
//                     <FormField
//                       control={form.control}
//                       name={`courses.${index}.gradePoint`}
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormControl>
//                             <Input {...field} className="h-8 w-16 text-xs" />
//                           </FormControl>
//                         </FormItem>
//                       )}
//                     />
//                   </TableCell>
//                   <TableCell className="border-r">
//                     <FormField
//                       control={form.control}
//                       name={`courses.${index}.letterGrade`}
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormControl>
//                             <Input {...field} className="h-8 w-16 text-xs" />
//                           </FormControl>
//                         </FormItem>
//                       )}
//                     />
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </div>

//         <div className="text-sm text-muted-foreground italic">
//           Note: P = Prescribed, A = Attended, % = Percentage
//         </div>

//         <div className="flex justify-end">
//           <button
//             type="submit"
//             className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//           >
//             Save Course Instruction
//           </button>
//         </div>
//       </form>
//     </Form>
//   );
// };


import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

const PREDEFINED_COURSES: Record<string, any[]> = {
  "VII": [
    { slNo: 32, courseCode: "", universityCourseCode: "", courseTitle: "Elective 3", theoryCredits: "1", skillLabCredits: "-", clinicalCredits: "-", theoryPrescribed: 20, skillLabPrescribed: "-", clinicalPrescribed: 0, theoryInternalMax: "-", theoryEndSemMax: 50, theoryTotalMax: 50, practicalInternalMax: 0, practicalEndSemMax: 0, practicalTotalMax: 0 }
  ],
  "VIII": [
    { slNo: 33, courseCode: "INTEA", universityCourseCode: "", courseTitle: "Community Health Nursing-4 weeks", theoryCredits: "-", skillLabCredits: "-", clinicalCredits: "12", theoryPrescribed: 0, skillLabPrescribed: "-", clinicalPrescribed: 192, theoryInternalMax: "-", theoryEndSemMax: 0, theoryTotalMax: 0, practicalInternalMax: 0, practicalEndSemMax: 0, practicalTotalMax: 200 },
    { slNo: 34, courseCode: "INTE420", universityCourseCode: "", courseTitle: "Adult Health Nursing-6 weeks", theoryCredits: "-", skillLabCredits: "-", clinicalCredits: "-", theoryPrescribed: 0, skillLabPrescribed: "-", clinicalPrescribed: 288, theoryInternalMax: "-", theoryEndSemMax: 0, theoryTotalMax: 0, practicalInternalMax: 0, practicalEndSemMax: 0, practicalTotalMax: 0 }
  ]
};

const courseInstructionSchema = z.object({
  semester: z.string().min(1, "Semester is required"),
  courseCode: z.string().min(1, "Course code is required"),
  universityCourseCode: z.string().optional(),
  courseTitle: z.string().min(1, "Course title is required"),
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

type CourseInstructionFormData = z.infer<typeof courseInstructionSchema>;

interface CourseInstructionFormProps {
  onSubmit: (data: CourseInstructionFormData) => void;
  defaultValues?: Partial<CourseInstructionFormData>;
  onProgressChange?: (progress: number) => void;
}

export const CourseInstructionForm = ({ onSubmit, defaultValues, onProgressChange }: CourseInstructionFormProps) => {
  const form = useForm<CourseInstructionFormData>({
    resolver: zodResolver(courseInstructionSchema),
    defaultValues: defaultValues || {},
  });

  useEffect(() => {
    const subscription = form.watch((values) => {
      const requiredFields = ["semester", "courseCode", "courseTitle"];
      const filledFields = requiredFields.filter(
        (field) => values[field as keyof typeof values] && values[field as keyof typeof values]?.toString().trim() !== ""
      ).length;
      const progress = (filledFields / requiredFields.length) * 100;
      onProgressChange?.(progress);
    });
    return () => subscription.unsubscribe();
  }, [form, onProgressChange]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-muted/30 p-4 rounded-lg border">
          <h3 className="font-semibold text-lg mb-4">Course Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="semester"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Semester</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select semester" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {["I", "II", "III", "IV", "V", "VI", "VII", "VIII"].map(sem => (
                        <SelectItem key={sem} value={sem}>{sem}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="courseCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Code</FormLabel>
                  <FormControl><Input {...field} placeholder="e.g., NUR101" /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="courseTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Title</FormLabel>
                  <FormControl><Input {...field} placeholder="e.g., Anatomy & Physiology" /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Marks Sections */}
        <div className="bg-muted/30 p-4 rounded-lg border">
          <h3 className="font-semibold text-lg mb-4">Theory Marks</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-3">
                <FormField control={form.control} name="theoryInternalMax" render={({ field }) => (
                  <FormItem><FormLabel className="text-xs">Internal Max</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name="theoryInternalObtained" render={({ field }) => (
                  <FormItem><FormLabel className="text-xs">Internal Obtained</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name="theoryEndSemMax" render={({ field }) => (
                  <FormItem><FormLabel className="text-xs">End Sem Max</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name="theoryEndSemObtained" render={({ field }) => (
                  <FormItem><FormLabel className="text-xs">End Sem Obtained</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name="theoryTotalMax" render={({ field }) => (
                  <FormItem><FormLabel className="text-xs">Total Max</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name="theoryTotalObtained" render={({ field }) => (
                  <FormItem><FormLabel className="text-xs">Total Obtained</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>
                )} />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit">Save Course Instruction</Button>
        </div>
      </form>
    </Form>
  );
};