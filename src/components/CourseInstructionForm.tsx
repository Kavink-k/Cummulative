import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
 
interface Course {
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
}
 
const semesterData: Record<string, Course[]> = {
  "I": [
    {
      slNo: 1,
      courseCode: "ENGL 101",
      universityCourseCode: "",
      courseTitle: "Communicative English",
      theoryCredits: "2",
      skillLabCredits: "-",
      clinicalCredits: "-",
      theoryPrescribed: 40,
      theoryAttended: "",
      theoryPercentage: "",
      skillLabPrescribed: "-",
      clinicalPrescribed: 0,
      theoryInternalMax: "25",
      theoryEndSemMax: 25,
      theoryTotalMax: 50,
      practicalInternalMax: 0,
      practicalEndSemMax: 0,
      practicalTotalMax: 0
    },
    {
      slNo: 2,
      courseCode: "ANAT 105",
      universityCourseCode: "",
      courseTitle: "Applied Anatomy",
      theoryCredits: "3",
      skillLabCredits: "-",
      clinicalCredits: "-",
      theoryPrescribed: 60,
      skillLabPrescribed: "-",
      clinicalPrescribed: 0,
      theoryInternalMax: "25",
      theoryEndSemMax: 75,
      theoryTotalMax: 100,
      practicalInternalMax: 0,
      practicalEndSemMax: 0,
      practicalTotalMax: 0
    },
    {
      slNo: 3,
      courseCode: "PHYS 110",
      universityCourseCode: "",
      courseTitle: "Applied Physiology",
      theoryCredits: "3",
      skillLabCredits: "-",
      clinicalCredits: "-",
      theoryPrescribed: 60,
      skillLabPrescribed: "-",
      clinicalPrescribed: 0,
      theoryInternalMax: "25",
      theoryEndSemMax: 75,
      theoryTotalMax: 100,
      practicalInternalMax: 0,
      practicalEndSemMax: 0,
      practicalTotalMax: 0
    },
    {
      slNo: 4,
      courseCode: "SOCI 115",
      universityCourseCode: "",
      courseTitle: "Applied Sociology",
      theoryCredits: "3",
      skillLabCredits: "-",
      clinicalCredits: "-",
      theoryPrescribed: 60,
      skillLabPrescribed: "-",
      clinicalPrescribed: 0,
      theoryInternalMax: "25",
      theoryEndSemMax: 75,
      theoryTotalMax: 100,
      practicalInternalMax: 0,
      practicalEndSemMax: 0,
      practicalTotalMax: 0
    },
    {
      slNo: 5,
      courseCode: "PSYC 120",
      universityCourseCode: "",
      courseTitle: "Applied Psychology",
      theoryCredits: "3",
      skillLabCredits: "-",
      clinicalCredits: "-",
      theoryPrescribed: 80,
      skillLabPrescribed: "30",
      clinicalPrescribed: 250,
      theoryInternalMax: "25",
      theoryEndSemMax: 75,
      theoryTotalMax: 100,
      practicalInternalMax: 0,
      practicalEndSemMax: 100,
      practicalTotalMax: 100
    },
    {
      slNo: 6,
      courseCode: "N-NF(I) 125",
      universityCourseCode: "",
      courseTitle: "Nursing Foundation I IncludingFirst Aid module ",
      theoryCredits: "6",
      skillLabCredits: "-",
      clinicalCredits: "-",
      theoryPrescribed: 120,
      skillLabPrescribed: "80",
      clinicalPrescribed: 0,
      theoryInternalMax: "25",
      theoryEndSemMax: 75,
      theoryTotalMax: 100,
      practicalInternalMax: 0,
      practicalEndSemMax: 0,
      practicalTotalMax: 0
    },
    {
      slNo: 7,
      courseCode: "SSCC (I) 130",
      universityCourseCode: "",
      courseTitle: "Self-study/Co-curricular",
      theoryCredits: "0",
      skillLabCredits: "-",
      clinicalCredits: "-",
      theoryPrescribed: 0,
      skillLabPrescribed: "-",
      clinicalPrescribed: 0,
      theoryInternalMax: "-",
      theoryEndSemMax: 0,
      theoryTotalMax: 0,
      practicalInternalMax: 0,
      practicalEndSemMax: 0,
      practicalTotalMax: 0
    }
  ],
  "II": [
    {
      slNo: 8,
      courseCode: "BIOC 135",
      universityCourseCode: "",
      courseTitle: "Applied Biochemistry",
      theoryCredits: "2",
      skillLabCredits: "-",
      clinicalCredits: "-",
      theoryPrescribed: 40,
      skillLabPrescribed: "-",
      clinicalPrescribed: 0,
      theoryInternalMax: "25",
      theoryEndSemMax: 75,
      theoryTotalMax: 100,
      practicalInternalMax: 0,
      practicalEndSemMax: 0,
      practicalTotalMax: 0
    },
    {
      slNo: 9,
      courseCode: "NUTR 140",
      universityCourseCode: "",
      courseTitle: "Applied Nutrition and Dietetics",
      theoryCredits: "3",
      skillLabCredits: "-",
      clinicalCredits: "-",
      theoryPrescribed: 60,
      skillLabPrescribed: "-",
      clinicalPrescribed: 0,
      theoryInternalMax: "25",
      theoryEndSemMax: 75,
      theoryTotalMax: 100,
      practicalInternalMax: 0,
      practicalEndSemMax: 0,
      practicalTotalMax: 0
    },
    {
      slNo: 10,
      courseCode: "N-NF (II) 125",
      universityCourseCode: "",
      courseTitle: "Nursing Foundation II  Including Health Assessment Module(Nursing Foundation(I&II)",
      theoryCredits: "6",
      skillLabCredits: "-",
      clinicalCredits: "-",
      theoryPrescribed: 120,
      skillLabPrescribed: "120",
      clinicalPrescribed: 320,
      theoryInternalMax: "25",
      theoryEndSemMax: 75,
      theoryTotalMax: 100,
      practicalInternalMax: 50,
      practicalEndSemMax: 50,
      practicalTotalMax: 100
    },
    {
      slNo: 11,
      courseCode: "HNIT 145",
      universityCourseCode: "",
      courseTitle: "Health/Nursing Informatics & Technology",
      theoryCredits: "2",
      skillLabCredits: "-",
      clinicalCredits: "-",
      theoryPrescribed: 40,
      skillLabPrescribed: "40",
      clinicalPrescribed: 0,
      theoryInternalMax: "25",
      theoryEndSemMax: 25,
      theoryTotalMax: 50,
      practicalInternalMax: 0,
      practicalEndSemMax: 0,
      practicalTotalMax: 0
    },
    {
      slNo: 12,
      courseCode: "SSCC (II) 130",
      universityCourseCode: "",
      courseTitle: "Self-study/Co-curricular",
      theoryCredits: "0",
      skillLabCredits: "-",
      clinicalCredits: "-",
      theoryPrescribed: 0,
      skillLabPrescribed: "-",
      clinicalPrescribed: 0,
      theoryInternalMax: "-",
      theoryEndSemMax: 0,
      theoryTotalMax: 0,
      practicalInternalMax: 0,
      practicalEndSemMax: 0,
      practicalTotalMax: 0
    }
  ],
  "III":[
    {
      slNo: 13,
      courseCode: "MICR 201",
      universityCourseCode: "",
      courseTitle: "Applied microbiology and infection control including safety",
      theoryCredits: "2",
      skillLabCredits: "1",
      clinicalCredits: "-",
      theoryPrescribed: 40,
      skillLabPrescribed: "40",
      clinicalPrescribed: 0,
      theoryInternalMax: "25",
      theoryEndSemMax: 75,
      theoryTotalMax: 100,
      practicalInternalMax: 0,
      practicalEndSemMax: 0,
      practicalTotalMax: 0
    },
    {
      slNo: 14,
      courseCode: "PHAR(I)205",
      universityCourseCode: "",
      courseTitle: "Pharmacology I",
      theoryCredits: "1",
      skillLabCredits: "-",
      clinicalCredits: "-",
      theoryPrescribed: 20,
      skillLabPrescribed: "-",
      clinicalPrescribed: 0,
      theoryInternalMax: "25",
      theoryEndSemMax: 0,
      theoryTotalMax: 0,
      practicalInternalMax: 0,
      practicalEndSemMax: 0,
      practicalTotalMax: 0
    },
    
      {
      slNo: 15,
      courseCode: "PATH(I)210",
      universityCourseCode: "",
      courseTitle: "Pathology I",
      theoryCredits: "1",
      skillLabCredits: "-",
      clinicalCredits: "-",
      theoryPrescribed: 20,
      skillLabPrescribed: "-",
      clinicalPrescribed: 0,
      theoryInternalMax: "25",
      theoryEndSemMax: 0,
      theoryTotalMax: 0,
      practicalInternalMax: 0,
      practicalEndSemMax: 0,
      practicalTotalMax: 0
    },
    {
      slNo: 16,
      courseCode: "N-AHN(I)215",
      universityCourseCode: "",
      courseTitle: "Adult Health Nursing I With Integrated Pathophysiology Including BCLS Module(Adult Health Nursing I)",
      theoryCredits: "7",
      skillLabCredits: "1",
      clinicalCredits: "6",
      theoryPrescribed: 140,
      skillLabPrescribed: "-",
      clinicalPrescribed: 480,
      theoryInternalMax: "25",
      theoryEndSemMax: 75,
      theoryTotalMax: 100,
      practicalInternalMax: 50,
      practicalEndSemMax: 50,
      practicalTotalMax: 100
    },
    {
      slNo: 17,
      courseCode: "SSCC(I)220",
      universityCourseCode: "",
      courseTitle: "Self-Study/Co-Curricular",
      theoryCredits: "0",
      skillLabCredits: "-",
      clinicalCredits: "-",
      theoryPrescribed: 0,
      skillLabPrescribed: "-",
      clinicalPrescribed: 0,
      theoryInternalMax: "-",
      theoryEndSemMax: 0,
      theoryTotalMax: 0,
      practicalInternalMax: 0,
      practicalEndSemMax: 0,
      practicalTotalMax: 0
    }
  ],
  "IV": [
    {
      slNo: 18,
      courseCode: "PHAR(II)205",
      universityCourseCode: "",
      courseTitle: "Pharmacology II including Fundamentals of prescribing module",
      theoryCredits: "3",
      skillLabCredits: "-",
      clinicalCredits: "-",
      theoryPrescribed: 60,
      skillLabPrescribed: "-",
      clinicalPrescribed: 0,
      theoryInternalMax: "25",
      theoryEndSemMax: 75,
      theoryTotalMax: 100,
      practicalInternalMax: 0,
      practicalEndSemMax: 0,
      practicalTotalMax: 0
    },
    {
      slNo: 19,
      courseCode: "PATH(II)210",
      universityCourseCode: "",
      courseTitle: "Pathology II& Genetics",
      theoryCredits: "1",
      skillLabCredits: "-",
      clinicalCredits: "-",
      theoryPrescribed: 20,
      skillLabPrescribed: "-",
      clinicalPrescribed: 0,
      theoryInternalMax: "25",
      theoryEndSemMax: 75,
      theoryTotalMax: 100,
      practicalInternalMax: 0,
      practicalEndSemMax: 0,
      practicalTotalMax: 0
    },
    {
      slNo: 20,
      courseCode: "N-AHN(II)225",
      universityCourseCode: "",
      courseTitle: "Adult Health Nursing -II With Integrated Pathophysiology Including Geriatric Nursing+ Paliative Care Module",
      theoryCredits: "7",
      skillLabCredits: "1",
      clinicalCredits: "6",
      theoryPrescribed: 140,
      skillLabPrescribed: "40",
      clinicalPrescribed: 480,
      theoryInternalMax: "25",
      theoryEndSemMax: 75,
      theoryTotalMax: 100,
      practicalInternalMax: 50,
      practicalEndSemMax: 50,
      practicalTotalMax: 100
    },
    {
      slNo: 21,
      courseCode: "PROF230",
      universityCourseCode: "",
      courseTitle: "Professionalism,professional values,Ethics Including Bioethics",
      theoryCredits: "1",
      skillLabCredits: "-",
      clinicalCredits: "-",
      theoryPrescribed: 20,
      skillLabPrescribed: "-",
      clinicalPrescribed: 0,
      theoryInternalMax: "25",
      theoryEndSemMax: 25,
      theoryTotalMax: 50,
      practicalInternalMax: 0,
      practicalEndSemMax: 0,
      practicalTotalMax: 0
    },
    {
      slNo: 22,
      courseCode: "",
      universityCourseCode: "",
      courseTitle: "Elective I",
      theoryCredits: "1",
      skillLabCredits: "-",
      clinicalCredits: "-",
      theoryPrescribed: 20,
      skillLabPrescribed: "-",
      clinicalPrescribed: 0,
      theoryInternalMax: "-",
      theoryEndSemMax: 50,
      theoryTotalMax: 50,
      practicalInternalMax: 0,
      practicalEndSemMax: 0,
      practicalTotalMax: 0
    },
    {
      slNo: 23,
      courseCode: "SSCC(II)220",
      universityCourseCode: "",
      courseTitle: "Self-study/Co-curricular",
      theoryCredits: "0",
      skillLabCredits: "-",
      clinicalCredits: "-",
      theoryPrescribed: 0,
      skillLabPrescribed: "-",
      clinicalPrescribed: 0,
      theoryInternalMax: "-",
      theoryEndSemMax: 0,
      theoryTotalMax: 0,
      practicalInternalMax: 0,
      practicalEndSemMax: 0,
      practicalTotalMax: 0
    }
  ],
  "V":[
    {
      slNo: 24,
      courseCode: "N-CHN(I)301",
      universityCourseCode: "",
      courseTitle: "Child Health Nursing -I including Essential New born Care (ENBC),FBNC,IMNCI,and PLS Modules",
      theoryCredits: "3",
      skillLabCredits: "1",
      clinicalCredits: "2",
      theoryPrescribed: 60,
      skillLabPrescribed: "40",
      clinicalPrescribed: 160,
      theoryInternalMax: "25",
      theoryEndSemMax: 0,
      theoryTotalMax: 0,
      practicalInternalMax: 25,
      practicalEndSemMax: 0,
      practicalTotalMax: 0
    },
    
      
    {
      slNo: 25,
      courseCode: "N-HN(I)305",
      universityCourseCode: "",
      courseTitle: "Mental Health Nursing-I",
      theoryCredits: "3",
      skillLabCredits: "-",
      clinicalCredits: "1",
      theoryPrescribed: 60,
      skillLabPrescribed: "-",
      clinicalPrescribed:80,
      theoryInternalMax: "25",
      theoryEndSemMax: 0,
      theoryTotalMax: 0,
      practicalInternalMax: 25,
      practicalEndSemMax: 0,
      practicalTotalMax: 0
    },
    {
      slNo: 26,
      courseCode: "N-COMH(1)310",
      universityCourseCode: "",
      courseTitle: "Community Health Nursing-I including Environmental Science &Epidemiology",
      theoryCredits: "5",
      skillLabCredits: "-",
      clinicalCredits: "2",
      theoryPrescribed: 100,
      skillLabPrescribed: "-",
      clinicalPrescribed: 160,
      theoryInternalMax: "25",
      theoryEndSemMax: 75,
      theoryTotalMax: 100,
      practicalInternalMax: 0,
      practicalEndSemMax: 50,
      practicalTotalMax: 100
    },
    {
      slNo: 27,
      courseCode: "EDUC 315",
      universityCourseCode: "",
      courseTitle: "Educational technology/Nursing Education",
      theoryCredits: "2",
      skillLabCredits: "1",
      clinicalCredits: "-",
      theoryPrescribed: 40,
      skillLabPrescribed: "40",
      clinicalPrescribed: 0,
      theoryInternalMax: "25",
      theoryEndSemMax: 75,
      theoryTotalMax: 100,
      practicalInternalMax: 0,
      practicalEndSemMax: 0,
      practicalTotalMax: 0,
    }
    ,
    {
      slNo: 28,
      courseCode: "N-FORN 320",
      universityCourseCode: "",
      courseTitle: "Introduction to Forensic Nursing and Indian Laws",
      theoryCredits: "1",
      skillLabCredits: "-",
      clinicalCredits: "-",
      theoryPrescribed: 20,
      skillLabPrescribed: "-",
      clinicalPrescribed: 0,
      theoryInternalMax: "25",
      theoryEndSemMax: 25,
      theoryTotalMax: 50,
      practicalInternalMax: 0,
      practicalEndSemMax: 0,
      practicalTotalMax: 0,
    },
    {
      slNo: 29,
      courseCode: "SSCC(I)325",
      universityCourseCode: "",
      courseTitle: "Self-study/Co-curricular",
      theoryCredits: "0",
      skillLabCredits: "-",
      clinicalCredits: "-",
      theoryPrescribed: 0,
      skillLabPrescribed: "-",
      clinicalPrescribed: 0,
      theoryInternalMax: "-",
      theoryEndSemMax: 0,
      theoryTotalMax: 0,
      practicalInternalMax: 0,
      practicalEndSemMax: 0,
      practicalTotalMax: 0
    }
      ],
      "VI":[
    {
      slNo: 24,
      courseCode: "N-CHN(II)301",
      universityCourseCode: "",
      courseTitle: "Child Health Nursing(I&II)",
      theoryCredits: "2",
      skillLabCredits: "-",
      clinicalCredits: "1",
      theoryPrescribed: 40,
      skillLabPrescribed: "-",
      clinicalPrescribed: 80,
      theoryInternalMax: "25",
      theoryEndSemMax: 75,
      theoryTotalMax: 100,
      practicalInternalMax: 50,
      practicalEndSemMax: 50,
      practicalTotalMax: 100
    },
    
      
    {
      slNo: 25,
      courseCode: "N-HN(II)305",
      universityCourseCode: "",
      courseTitle: "Mental Health Nursing(I&II)",
      theoryCredits: "2",
      skillLabCredits: "-",
      clinicalCredits: "1",
      theoryPrescribed: 40,
      skillLabPrescribed: "-",
      clinicalPrescribed: 80,
      theoryInternalMax: "25",
      theoryEndSemMax: 75,
      theoryTotalMax: 100,
      practicalInternalMax: 50,
      practicalEndSemMax: 50,
      practicalTotalMax: 100
    },
    {
      slNo: 26,
      courseCode: "NMLE330",
      universityCourseCode: "",
      courseTitle: "Nursing Management &Leadership",
      theoryCredits: "3",
      skillLabCredits: "1",
      clinicalCredits: "-",
      theoryPrescribed: 60,
      skillLabPrescribed: "-",
      clinicalPrescribed: 80,
      theoryInternalMax: "25",
      theoryEndSemMax: 75,
      theoryTotalMax: 100,
      practicalInternalMax: 0,
      practicalEndSemMax: 0,
      practicalTotalMax: 0
    },
    {
      slNo: 27,
      courseCode: "N-IDW(I)/OBG335",
      universityCourseCode: "",
      courseTitle: "Midwifery/Obsterics and Gynecology (OBG)Nursing I Including SBA module",
      theoryCredits: "3",
      skillLabCredits: "1",
      clinicalCredits: "3",
      theoryPrescribed: 60,
      skillLabPrescribed: "40",
      clinicalPrescribed:240,
      theoryInternalMax: "25",
      theoryEndSemMax: 0,
      theoryTotalMax: 0,
      practicalInternalMax: 25,
      practicalEndSemMax: 0,
      practicalTotalMax: 0
    },
    {
      slNo: 28,
      courseCode: "",
      universityCourseCode: "",
      courseTitle: "Elective 2",
      theoryCredits: "1",
      skillLabCredits: "-",
      clinicalCredits: "-",
      theoryPrescribed: 20,
      skillLabPrescribed: "-",
      clinicalPrescribed: 0,
      theoryInternalMax: "-",
      theoryEndSemMax: 50,
      theoryTotalMax: 50,
      practicalInternalMax: 0,
      practicalEndSemMax: 0,
      practicalTotalMax: 0
    }
      ],
 
    "VII":[
      {
        slNo: 29,
      courseCode: "N-COMH 401",
      universityCourseCode: "",
      courseTitle: "Community Health Nursing II",
      theoryCredits: "5",
      skillLabCredits: "-",
      clinicalCredits: "2",
      theoryPrescribed: 100,
      skillLabPrescribed: "-",
      clinicalPrescribed: 160,
      theoryInternalMax: "25",
      theoryEndSemMax: 75,
      theoryTotalMax: 100,
      practicalInternalMax: 50,
      practicalEndSemMax: 50,
      practicalTotalMax: 100
      },
      {
        slNo: 30,
      courseCode: "NRST405",
      universityCourseCode: "",
      courseTitle: "Nursing Research&Statistics",
      theoryCredits: "2",
      skillLabCredits: "2",
      clinicalCredits: "-",
      theoryPrescribed: 40,
      skillLabPrescribed: "80",
      clinicalPrescribed: 0,
      theoryInternalMax: "25",
      theoryEndSemMax: 75,
      theoryTotalMax: 100,
      practicalInternalMax: 0,
      practicalEndSemMax: 0,
      practicalTotalMax: 0
      },
      {
        slNo: 31,
      courseCode: "N-MIDW(II)/OBG 410",
      universityCourseCode: "",
      courseTitle: "MidWifery/Obsterics and Gynecology(OBG) Nursing II Including Safe delivery App Module",
      theoryCredits: "3",
      skillLabCredits: "1",
      clinicalCredits: "4",
      theoryPrescribed: 60,
      skillLabPrescribed: "40",
      clinicalPrescribed: 320,
      theoryInternalMax: "25",
      theoryEndSemMax: 75,
      theoryTotalMax: 100,
      practicalInternalMax: 50,
      practicalEndSemMax: 50,
      practicalTotalMax: 100
      },
 
 
      
      {
        slNo: 32,
      courseCode: "",
      universityCourseCode: "",
      courseTitle: "Elective 3",
      theoryCredits: "1",
      skillLabCredits: "-",
      clinicalCredits: "-",
      theoryPrescribed: 20,
      skillLabPrescribed: "-",
      clinicalPrescribed: 0,
      theoryInternalMax: "-",
      theoryEndSemMax: 50,
      theoryTotalMax: 50,
      practicalInternalMax: 0,
      practicalEndSemMax: 0,
      practicalTotalMax: 0
    }
  ],
  "VIII": [
    {
      slNo: 33,
      courseCode: "INTEA",
      universityCourseCode: "",
      courseTitle: "Community Health Nursing-4 weeks",
      theoryCredits: "-",
      skillLabCredits: "-",
      clinicalCredits: "12",
      theoryPrescribed: 0,
      skillLabPrescribed: "-",
      clinicalPrescribed: 192,
      theoryInternalMax: "-",
      theoryEndSemMax: 0,
      theoryTotalMax: 0,
      practicalInternalMax: 0,
      practicalEndSemMax: 0,
      practicalTotalMax: 200
    },
    {
      slNo: 34,
      courseCode: "INTE420",
      universityCourseCode: "",
      courseTitle: "Adult Health Nursing-6 weeks",
      theoryCredits: "-",
      skillLabCredits: "-",
      clinicalCredits: "-",
      theoryPrescribed: 0,
      skillLabPrescribed: "-",
      clinicalPrescribed: 288,
      theoryInternalMax: "-",
      theoryEndSemMax: 0,
      theoryTotalMax: 0,
      practicalInternalMax: 0,
      practicalEndSemMax: 0,
      practicalTotalMax: 0
    },
    {
      slNo: 35,
      courseCode: "INTE425",
      universityCourseCode: "",
      courseTitle: "Child Health Nursing-4 weeks",
      theoryCredits: "0",
      skillLabCredits: "-",
      clinicalCredits: "-",
      theoryPrescribed: 0,
      skillLabPrescribed: "-",
      clinicalPrescribed: 192,
      theoryInternalMax: "-",
      theoryEndSemMax: 0,
      theoryTotalMax: 0,
      practicalInternalMax: 0,
      practicalEndSemMax: 0,
      practicalTotalMax: 0
    },
    {
      slNo: 36,
      courseCode: "INTE430",
      universityCourseCode: "",
      courseTitle: "Mental Health Nursing -4weeks ",
      theoryCredits: "0",
      skillLabCredits: "-",
      clinicalCredits: "-",
      theoryPrescribed: 0,
      skillLabPrescribed: "-",
      clinicalPrescribed: 192,
      theoryInternalMax: "-",
      theoryEndSemMax: 0,
      theoryTotalMax: 0,
      practicalInternalMax: 0,
      practicalEndSemMax: 0,
      practicalTotalMax: 0
    },
    {
      slNo: 37,
      courseCode: "INTEA435",
      universityCourseCode: "",
      courseTitle: "Midwifery-4 weeks",
      theoryCredits: "0",
      skillLabCredits: "-",
      clinicalCredits: "-",
      theoryPrescribed: 0,
      skillLabPrescribed: "-",
      clinicalPrescribed: 192,
      theoryInternalMax: "-",
      theoryEndSemMax: 0,
      theoryTotalMax: 0,
      practicalInternalMax: 0,
      practicalEndSemMax: 0,
      practicalTotalMax: 0
      
      }],
    
    
 
 
  // Add more semesters as needed
};
 
export const CourseInstructionForm = () => {
 
  const [selectedSemester, setSelectedSemester] = useState<string>("I");
  const [courses, setCourses] = useState<Course[]>(semesterData["I"]);
 
  const handleSemesterChange = (semester: string) => {
    setSelectedSemester(semester);
    setCourses(semesterData[semester] || []);
  };
 
  const handleInputChange = (index: number, field: keyof Course, value: string) => {
    const updatedCourses = [...courses];
    (updatedCourses[index] as any)[field] = value;
    setCourses(updatedCourses);
  };
 
  return (
    <div className="space-y-6">
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
 
      <div className="border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead rowSpan={3} className="border-r text-center align-middle min-w-12">
                Sl. No.
              </TableHead>
              <TableHead rowSpan={3} className="border-r text-center align-middle min-w-32">
                Course Code
              </TableHead>
              <TableHead rowSpan={3} className="border-r text-center align-middle min-w-32">
                University Course Code
              </TableHead>
              <TableHead rowSpan={3} className="border-r text-center align-middle min-w-48">
                Course Title
              </TableHead>
              <TableHead colSpan={3} className="border-r text-center">
                Credits
              </TableHead>
              <TableHead colSpan={9} className="border-r text-center">
                Course Instruction Hours
              </TableHead>
              <TableHead colSpan={12} className="border-r text-center">
                Marks Obtained
              </TableHead>
              <TableHead rowSpan={3} className="border-r text-center align-middle min-w-20">
                Grade Point
              </TableHead>
              <TableHead rowSpan={3} className="border-r text-center align-middle min-w-20">
                Letter Grade
              </TableHead>
            </TableRow>
            <TableRow className="bg-muted/50">
              <TableHead className="border-r text-center min-w-16">Theory</TableHead>
              <TableHead className="border-r text-center min-w-16">Skill Lab</TableHead>
              <TableHead className="border-r text-center min-w-16">Clinical</TableHead>
              <TableHead colSpan={3} className="border-r text-center">Theory</TableHead>
              <TableHead colSpan={3} className="border-r text-center">Skill Lab</TableHead>
              <TableHead colSpan={3} className="border-r text-center">Clinical</TableHead>
              <TableHead colSpan={6} className="border-r text-center">Theory</TableHead>
              <TableHead colSpan={6} className="border-r text-center">Practical</TableHead>
            </TableRow>
            <TableRow className="bg-muted/50">
              <TableHead className="border-r text-center text-xs">P</TableHead>
              <TableHead className="border-r text-center text-xs">A</TableHead>
              <TableHead className="border-r text-center text-xs">%</TableHead>
              <TableHead className="border-r text-center text-xs">P</TableHead>
              <TableHead className="border-r text-center text-xs">A</TableHead>
              <TableHead className="border-r text-center text-xs">%</TableHead>
              <TableHead className="border-r text-center text-xs">P</TableHead>
              <TableHead className="border-r text-center text-xs">A</TableHead>
              <TableHead className="border-r text-center text-xs">%</TableHead>
              <TableHead className="border-r text-center text-xs">Internal Max</TableHead>
              <TableHead className="border-r text-center text-xs">Internal Obtained</TableHead>
              <TableHead className="border-r text-center text-xs">End Sem Max</TableHead>
              <TableHead className="border-r text-center text-xs">End Sem Obtained</TableHead>
              <TableHead className="border-r text-center text-xs">Total Max</TableHead>
              <TableHead className="border-r text-center text-xs">Total Obtained</TableHead>
              <TableHead className="border-r text-center text-xs">Internal Max</TableHead>
              <TableHead className="border-r text-center text-xs">Internal Obtained</TableHead>
              <TableHead className="border-r text-center text-xs">End Sem Max</TableHead>
              <TableHead className="border-r text-center text-xs">End Sem Obtained</TableHead>
              <TableHead className="border-r text-center text-xs">Total Max</TableHead>
              <TableHead className="border-r text-center text-xs">Total Obtained</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.map((course, index) => (
              <TableRow key={index} className="hover:bg-muted/30">
                <TableCell className="border-r text-center">{course.slNo}</TableCell>
                <TableCell className="border-r text-sm">{course.courseCode}</TableCell>
                <TableCell className="border-r">
                  <Input
                    value={course.universityCourseCode}
                    onChange={(e) => handleInputChange(index, "universityCourseCode", e.target.value)}
                    className="h-8 text-xs"
                  />
                </TableCell>
                <TableCell className="border-r text-sm">{course.courseTitle}</TableCell>
                <TableCell className="border-r text-center">{course.theoryCredits}</TableCell>
                <TableCell className="border-r text-center">{course.skillLabCredits}</TableCell>
                <TableCell className="border-r text-center">{course.clinicalCredits}</TableCell>
                <TableCell className="border-r text-center text-sm">{course.theoryPrescribed}</TableCell>
                <TableCell className="border-r">
                  <Input
                    value={course.theoryAttended || ""}
                    onChange={(e) => handleInputChange(index, "theoryAttended", e.target.value)}
                    className="h-8 w-16 text-xs"
                  />
                </TableCell>
                <TableCell className="border-r">
                  <Input
                    value={course.theoryPercentage || ""}
                    onChange={(e) => handleInputChange(index, "theoryPercentage", e.target.value)}
                    className="h-8 w-16 text-xs"
                  />
                </TableCell>
                <TableCell className="border-r text-center text-sm">{course.skillLabPrescribed}</TableCell>
                <TableCell className="border-r">
                  <Input
                    value={course.skillLabAttended || ""}
                    onChange={(e) => handleInputChange(index, "skillLabAttended", e.target.value)}
                    className="h-8 w-16 text-xs"
                  />
                </TableCell>
                <TableCell className="border-r">
                  <Input
                    value={course.skillLabPercentage || ""}
                    onChange={(e) => handleInputChange(index, "skillLabPercentage", e.target.value)}
                    className="h-8 w-16 text-xs"
                  />
                </TableCell>
                <TableCell className="border-r text-center text-sm">{course.clinicalPrescribed}</TableCell>
                <TableCell className="border-r">
                  <Input
                    value={course.clinicalAttended || ""}
                    onChange={(e) => handleInputChange(index, "clinicalAttended", e.target.value)}
                    className="h-8 w-16 text-xs"
                  />
                </TableCell>
                <TableCell className="border-r">
                  <Input
                    value={course.clinicalPercentage || ""}
                    onChange={(e) => handleInputChange(index, "clinicalPercentage", e.target.value)}
                    className="h-8 w-16 text-xs"
                  />
                </TableCell>
                <TableCell className="border-r text-center text-sm">{course.theoryInternalMax}</TableCell>
                <TableCell className="border-r">
                  <Input
                    value={course.theoryInternalObtained || ""}
                    onChange={(e) => handleInputChange(index, "theoryInternalObtained", e.target.value)}
                    className="h-8 w-16 text-xs"
                  />
                </TableCell>
                <TableCell className="border-r text-center text-sm">{course.theoryEndSemMax}</TableCell>
                <TableCell className="border-r">
                  <Input
                    value={course.theoryEndSemObtained || ""}
                    onChange={(e) => handleInputChange(index, "theoryEndSemObtained", e.target.value)}
                    className="h-8 w-16 text-xs"
                  />
                </TableCell>
                <TableCell className="border-r text-center text-sm">{course.theoryTotalMax}</TableCell>
                <TableCell className="border-r">
                  <Input
                    value={course.theoryTotalObtained || ""}
                    onChange={(e) => handleInputChange(index, "theoryTotalObtained", e.target.value)}
                    className="h-8 w-16 text-xs"
                  />
                </TableCell>
                <TableCell className="border-r text-center text-sm">{course.practicalInternalMax}</TableCell>
                <TableCell className="border-r">
                  <Input
                    value={course.practicalInternalObtained || ""}
                    onChange={(e) => handleInputChange(index, "practicalInternalObtained", e.target.value)}
                    className="h-8 w-16 text-xs"
                  />
                </TableCell>
                <TableCell className="border-r text-center text-sm">{course.practicalEndSemMax}</TableCell>
                <TableCell className="border-r">
                  <Input
                    value={course.practicalEndSemObtained || ""}
                    onChange={(e) => handleInputChange(index, "practicalEndSemObtained", e.target.value)}
                    className="h-8 w-16 text-xs"
                  />
                </TableCell>
                <TableCell className="border-r text-center text-sm">{course.practicalTotalMax}</TableCell>
                <TableCell className="border-r">
                  <Input
                    value={course.practicalTotalObtained || ""}
                    onChange={(e) => handleInputChange(index, "practicalTotalObtained", e.target.value)}
                    className="h-8 w-16 text-xs"
                  />
                </TableCell>
                <TableCell className="border-r">
                  <Input
                    value={course.gradePoint || ""}
                    onChange={(e) => handleInputChange(index, "gradePoint", e.target.value)}
                    className="h-8 w-16 text-xs"
                  />
                </TableCell>
                <TableCell className="border-r">
                  <Input
                    value={course.letterGrade || ""}
                    onChange={(e) => handleInputChange(index, "letterGrade", e.target.value)}
                    className="h-8 w-16 text-xs"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
 
      <div className="text-sm text-muted-foreground italic">
        Note: P = Prescribed, A = Attended, % = Percentage
      </div>
    </div>
  );
};