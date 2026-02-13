// import axios from 'axios';

// const API_BASE_URL = 'https://cummulative-backend-production.up.railway.app/api';

// // Create axios instance
// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });


// export const fetchAllStudentsFromDB = async () => {
//   const res = await axios.get("https://cummulative-backend-production.up.railway.app/api/personal-profiles/");
//   return res.data; // list of student step1 data
// };
// // Helper to clean empty strings to null (prevents 400 errors on numeric/date fields)
// const cleanData = (data: Record<string, any>) => {
//   return Object.fromEntries(
//     Object.entries(data).map(([k, v]) => [k, v === "" ? null : v])
//   );
// };

// // API functions for each endpoint
// export const apiService = {
//   // Personal Profile
//   createPersonalProfile: async (data: any, photoFile?: File) => {
//     // If no photo, send as JSON (cleaned)
//     if (!photoFile) {
//       return api.post('/personal-profiles', cleanData(data));
//     }

//     const formData = new FormData();
//     Object.keys(data).forEach(key => {
//       if (data[key] !== undefined && data[key] !== null) {
//         formData.append(key, data[key]);
//       }
//     });

//     if (photoFile) {
//       formData.append('photo', photoFile);
//     }

//     return api.post('/personal-profiles', formData, {
//       headers: { 'Content-Type': 'multipart/form-data' },
//     });
//   },

//   updatePersonalProfile: async (id: string, data: any, photoFile?: File) => {
//     if (!photoFile) return api.put(`/personal-profiles/${id}`, cleanData(data));

//     const formData = new FormData();
//     Object.keys(data).forEach(key => {
//       if (data[key] !== undefined && data[key] !== null) {
//         formData.append(key, data[key]);
//       }
//     });
//     if (photoFile) formData.append('photo', photoFile);

//     return api.put(`/personal-profiles/${id}`, formData, {
//       headers: { 'Content-Type': 'multipart/form-data' },
//     });
//   },

//   createEducationalQualification: async (data: any) => {
//     return api.post('/educational-qualifications', cleanData(data));
//   },

//   createAdmissionDetail: async (data: any) => {
//     return api.post('/admission-details', cleanData(data));
//   },

//   // Attendance Record (Array Handling)
//   createAttendanceRecord: async (data: any) => {
//     if (data.semesters && Array.isArray(data.semesters)) {
//       const promises = data.semesters.map((semesterData: any) => {
//         const payload = {
//           ...cleanData(semesterData),
//           studentId: data.studentId,
//         };
//         return api.post('/attendance-records', payload);
//       });
//       return Promise.all(promises);
//     }
//     return api.post('/attendance-records', cleanData(data));
//   },

//   // Activity Participation (Array Handling)
//   createActivityParticipation: async (data: any) => {
//     if (data.semesters && Array.isArray(data.semesters)) {
//       const promises = data.semesters.map((semesterData: any) => {
//         const payload = {
//           ...cleanData(semesterData),
//           studentId: data.studentId
//         };
//         return api.post('/activity-participation', payload);
//       });
//       return Promise.all(promises);
//     }
//     return api.post('/activity-participation', cleanData(data));
//   },
//   // Course Instruction - Updated to handle Array
//   // createCourseInstruction: async (data: any) => {
//   //   if (data.courses && Array.isArray(data.courses)) {
//   //     const promises = data.courses.map((courseData: any) => {
//   //       const payload = {
//   //         ...cleanData(courseData),
//   //         studentId: data.studentId,
//   //         semester: data.semester // Important: semester is top-level here
//   //       };
//   //       return api.post('/course-instructions', payload);
//   //     });
//   //     return Promise.all(promises);
//   //   }
//   //   return api.post('/course-instructions', cleanData(data));
//   // },
// // Course Instruction - Send full array in ONE request
// createCourseInstruction: async (data: any) => {
//   return api.post('/course-instructions', {
//     studentId: data.studentId,
//     semester: data.semester,
//     courses: data.courses.map((course: any) => cleanData(course))
//   });
// },

//   // Course Instruction - Updated to handle Array
// //  createCourseInstruction: async (data: any) => {
// //   return api.post('/course-instructions', {
// //     studentId: data.studentId,
// //     semester: data.semester,
// //     courses: data.courses.map((course: any) => cleanData(course))
// //   });
// // },
//   // Observational Visits (Array Handling)
//   createObservationalVisit: async (data: any) => {
//     if (data.visits && Array.isArray(data.visits)) {
//       const promises = data.visits.map((visitData: any) => {
//         const payload = {
//           ...cleanData(visitData),
//           studentId: data.studentId
//         };
//         return api.post('/observational-visits', payload);
//       });
//       return Promise.all(promises);
//     }
//     return api.post('/observational-visits', cleanData(data));
//   },

//   // Clinical Experience (Array Handling)
//   createClinicalExperience: async (data: any) => {
//     if (data.records && Array.isArray(data.records)) {
//       // Filter out empty records (only send records with actual data)
//       const filledRecords = data.records.filter((record: any) => {
//         const hasCompletedHours = record.completedHours && record.completedHours.toString().trim() !== '';
//         const hasHospital = record.hospital && record.hospital.toString().trim() !== '';
//         return hasCompletedHours || hasHospital; // Send if either field has data
//       });

//       if (filledRecords.length === 0) {
//         // No data to save
//         return Promise.resolve({ data: { message: 'No clinical experience data to save' } });
//       }

//       const promises = filledRecords.map((record: any) => {
//         const payload = {
//           ...cleanData(record),
//           studentId: data.studentId
//         };
//         return api.post('/clinical-experiences', payload);
//       });
//       return Promise.all(promises);
//     }
//     return api.post('/clinical-experiences', cleanData(data));
//   },

//   // Research Projects (Array Handling)
//   createResearchProject: async (data: any) => {
//     if (data.projects && Array.isArray(data.projects)) {
//       // Filter out empty projects (only send projects with actual data)
//       const filledProjects = data.projects.filter((proj: any) => {
//         const hasSemester = proj.semester && proj.semester.toString().trim() !== '';
//         const hasAreaOfStudy = proj.areaOfStudy && proj.areaOfStudy.toString().trim() !== '';
//         const hasProjectTitle = proj.projectTitle && proj.projectTitle.toString().trim() !== '';
//         return hasSemester && hasAreaOfStudy && hasProjectTitle; // All required fields must be filled
//       });

//       if (filledProjects.length === 0) {
//         // No data to save
//         return Promise.resolve({ data: { message: 'No research project data to save' } });
//       }

//       const promises = filledProjects.map((proj: any) => {
//         const payload = {
//           ...cleanData(proj),
//           studentId: data.studentId
//         };
//         return api.post('/research-projects', payload);
//       });
//       return Promise.all(promises);
//     }
//     return api.post('/research-projects', cleanData(data));
//   },

//   // Additional Courses (Array Handling)
//   createAdditionalCourses: async (data: any) => {
//     if (data.courses && Array.isArray(data.courses)) {
//       // Filter out empty courses (only send courses with actual data)
//       const filledCourses = data.courses.filter((course: any) => {
//         const hasCourseName = course.courseName && course.courseName.toString().trim() !== '';
//         return hasCourseName; // Only send if course name is filled
//       });

//       if (filledCourses.length === 0) {
//         // No data to save
//         return Promise.resolve({ data: { message: 'No additional courses data to save' } });
//       }

//       const promises = filledCourses.map((course: any) => {
//         const payload = {
//           ...cleanData(course),
//           studentId: data.studentId,
//           id: course.id // Include database ID for updates
//         };
//         return api.post('/additional-courses', payload);
//       });
//       return Promise.all(promises);
//     }
//     return api.post('/additional-courses', cleanData(data));
//   },

//   // Course Completion (Array Handling)
//   createCourseCompletion: async (data: any) => {
//     if (data.completions && Array.isArray(data.completions)) {
//       const promises = data.completions.map((comp: any) => {
//         const payload = {
//           ...cleanData(comp),
//           studentId: data.studentId
//         };
//         return api.post('/course-completions', payload);
//       });
//       return Promise.all(promises);
//     }
//     return api.post('/course-completions', cleanData(data));
//   },

//   // Verification (Array Handling)
//   createVerification: async (data: any) => {
//     const payload = {
//       studentId: data.studentId,
//       verifications: data.verifications.map((v: any) => cleanData(v))
//     };

//     return api.post('/verifications', payload);
//   },

// };

// // ========== GET METHODS ==========

// // Get Personal Profile by Student ID
// export const getPersonalProfileByStudentId = async (studentId: string) => {
//   return api.get(`/personal-profiles/student/${studentId}`);
// };

// // Get Educational Qualification by Student ID
// export const getEducationalQualificationByStudentId = async (studentId: string) => {
//   return api.get(`/educational-qualifications/student/${studentId}`);
// };

// // Get Admission Detail by Student ID
// export const getAdmissionDetailByStudentId = async (studentId: string) => {
//   return api.get(`/admission-details/student/${studentId}`);
// };

// // Get Attendance Records by Student ID
// export const getAttendanceRecordsByStudentId = async (studentId: string) => {
//   return api.get(`/attendance-records/student/${studentId}`);
// };

// // Get Activity Participation by Student ID
// export const getActivityParticipationByStudentId = async (studentId: string) => {
//   return api.get(`/activity-participation/student/${studentId}`);
// };

// // Get Course Instructions by Student ID
// export const getCourseInstructionsByStudentId = async (studentId: string) => {
//   return api.get(`/course-instructions/student/${studentId}`);
// };

// // Get Observational Visits by Student ID
// export const getObservationalVisitsByStudentId = async (studentId: string) => {
//   return api.get(`/observational-visits/student/${studentId}`);
// };

// // Get Clinical Experiences by Student ID
// export const getClinicalExperiencesByStudentId = async (studentId: string) => {
//   return api.get(`/clinical-experiences/student/${studentId}`);
// };

// // Get Research Projects by Student ID
// export const getResearchProjectsByStudentId = async (studentId: string) => {
//   return api.get(`/research-projects/student/${studentId}`);
// };

// // Get Additional Courses by Student ID
// export const getAdditionalCoursesByStudentId = async (studentId: string) => {
//   return api.get(`/additional-courses/student/${studentId}`);
// };

// // Get Course Completions by Student ID
// export const getCourseCompletionsByStudentId = async (studentId: string) => {
//   return api.get(`/course-completions/student/${studentId}`);
// };

// // Get Verifications by Student ID
// export const getVerificationsByStudentId = async (studentId: string) => {
//   return api.get(`/verifications/student/${studentId}`);
// };

// // Fetch all data for a student by studentId
// export const getAllDataByStudentId = async (studentId: string) => {
//   try {
//     const [step1, step2, step3, step4, step5, step6, step7, step8, step9, step10, step11, step12] = await Promise.allSettled([
//       getPersonalProfileByStudentId(studentId),
//       getEducationalQualificationByStudentId(studentId),
//       getAdmissionDetailByStudentId(studentId),
//       getAttendanceRecordsByStudentId(studentId),
//       getActivityParticipationByStudentId(studentId),
//       getCourseInstructionsByStudentId(studentId),
//       getObservationalVisitsByStudentId(studentId),
//       getClinicalExperiencesByStudentId(studentId),
//       getResearchProjectsByStudentId(studentId),
//       getAdditionalCoursesByStudentId(studentId),
//       getCourseCompletionsByStudentId(studentId),
//       getVerificationsByStudentId(studentId),
//     ]);

//     return {
//       step1: step1.status === 'fulfilled' && step1.value.data.data
//         ? { ...step1.value.data.data, photo: step1.value.data.data.photoUrl }
//         : null,
//       step2: step2.status === 'fulfilled' ? step2.value.data.data : null,
//       step3: step3.status === 'fulfilled' ? step3.value.data.data : null,
//       step4: step4.status === 'fulfilled' ? step4.value.data.data : null,
//       step5: step5.status === 'fulfilled' ? step5.value.data.data : null,
//       step6: step6.status === 'fulfilled' ? step6.value.data.data : null,
//       step7: step7.status === 'fulfilled' ? step7.value.data.data : null,
//       step8: step8.status === 'fulfilled' ? step8.value.data.data : null,
//       step9: step9.status === 'fulfilled' ? step9.value.data.data : null,
//       step10: step10.status === 'fulfilled' && step10.value.data.data
//         ? {
//           courses: Array.isArray(step10.value.data.data)
//             ? step10.value.data.data.map((course: any, index: number) => ({
//               id: course.id, // Database ID for updates
//               courseId: String(index + 1), // Auto-generated display ID
//               courseName: course.courseName || '',
//               from: course.from ? new Date(course.from).toISOString().split('T')[0] : '',
//               to: course.to ? new Date(course.to).toISOString().split('T')[0] : '',
//             }))
//             : []
//         }
//         : null,
//       step11: step11.status === 'fulfilled' && step11.value.data.data
//         ? { completions: Array.isArray(step11.value.data.data) ? step11.value.data.data : [] }
//         : null,
//       step12: step12.status === 'fulfilled' ? step12.value.data.data : null,
//     };
//   } catch (error) {
//     console.error('Error fetching student data:', error);
//     throw error;
//   }
// };

// // Universal Save Function used by Index.tsx
// // Now uses POST for create, relies on backend upsert logic
// export const saveDataToBackend = async (step: number, data: any) => {
//   switch (step) {
//     case 1: {
//       // Extract photoFile from data if it exists
//       const { photoFile, ...restData } = data;
//       return apiService.createPersonalProfile(restData, photoFile);
//     }
//     case 2: return apiService.createEducationalQualification(data);
//     case 3: return apiService.createAdmissionDetail(data);
//     case 4: return apiService.createAttendanceRecord(data);
//     case 5: return apiService.createActivityParticipation(data);
//     case 6: return apiService.createCourseInstruction(data);
//     case 7: return apiService.createObservationalVisit(data);
//     case 8: return apiService.createClinicalExperience(data);
//     case 9: return apiService.createResearchProject(data);
//     case 10: return apiService.createAdditionalCourses(data);
//     case 11: return apiService.createCourseCompletion(data);
//     case 12: return apiService.createVerification(data);
//     default: throw new Error(`No API endpoint configured for step ${step}`);
//   }
// };

// export default api;



import axios from 'axios';
import { getUser } from './auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptor to include user ID in headers
api.interceptors.request.use((config) => {
  const user = getUser();
  if (user) {
    config.headers['x-user-id'] = user.id.toString();
    config.headers['x-user-role'] = user.role;
  }
  return config;
});

export const fetchpersonalprofileFromDB = async (filters: { institutionId?: number; approvalStatus?: string } = {}) => {
  const params = new URLSearchParams();
  if (filters.institutionId) params.append("institutionId", filters.institutionId.toString());
  if (filters.approvalStatus) params.append("approvalStatus", filters.approvalStatus);

  const user = getUser();
  const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/personal-profiles/`, {
    params,
    headers: user ? { 'x-user-id': user.id.toString() } : {}
  });
  return res.data; // list of student step1 data
};

export const approveStudent = async (studentId: string) => {
  return api.patch(`/personal-profiles/approve/${studentId}`);
};

export const rejectStudent = async (studentId: string) => {
  return api.patch(`/personal-profiles/reject/${studentId}`);
};

export const requestEditAccess = async (studentId: string, reason: string) => {
  return api.patch(`/personal-profiles/request-edit/${studentId}`, { reason });
};

export const allowEditAccess = async (studentId: string) => {
  return api.patch(`/personal-profiles/allow-edit/${studentId}`);
};


export const fetchadmissionDetailsFromDB = async () => {
  const user = getUser();
  const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/admission-details/`, {
    headers: user ? { 'x-user-id': user.id.toString() } : {}
  });
  return res.data;
};


// Helper to clean empty strings to null (prevents 400 errors on numeric/date fields)
const cleanData = (data: Record<string, any>) => {
  return Object.fromEntries(
    Object.entries(data).map(([k, v]) => [k, v === "" ? null : v])
  );
};

// ========================
// BULK UPLOAD ADDED HERE (ONLY NEW THING)
// ========================
export const uploadBulkFile = async ({ file }: { file: File | null }) => {
  if (!file) throw new Error("No file provided");

  const formData = new FormData();
  formData.append("excel", file);  // KEY must be "excel"

  return await api.post("/bulk-upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    timeout: 600000, // optional but good for large file uploads
  });
};



// API functions for each endpoint
export const apiService = {
  // Institution Detail
  createInstitutionDetail: async (data: any) => {
    return api.post('/institution-details', cleanData(data));
  },

  // Personal Profile
  createPersonalProfile: async (data: any, photoFile?: File) => {
    if (!photoFile) {
      return api.post('/personal-profiles', cleanData(data));
    }

    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (data[key] !== undefined && data[key] !== null) {
        formData.append(key, data[key]);
      }
    });

    if (photoFile) {
      formData.append('photo', photoFile);
    }

    return api.post('/personal-profiles', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  updatePersonalProfile: async (id: string, data: any, photoFile?: File) => {
    if (!photoFile) return api.put(`/personal-profiles/${id}`, cleanData(data));

    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (data[key] !== undefined && data[key] !== null) {
        formData.append(key, data[key]);
      }
    });
    if (photoFile) formData.append('photo', photoFile);

    return api.put(`/personal-profiles/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  createEducationalQualification: async (data: any) => {
    return api.post('/educational-qualifications', cleanData(data));
  },

  createAdmissionDetail: async (data: any) => {
    return api.post('/admission-details', cleanData(data));
  },

  createAttendanceRecord: async (data: any) => {
    if (data.semesters && Array.isArray(data.semesters)) {
      const promises = data.semesters.map((semesterData: any) => {
        const payload = {
          ...cleanData(semesterData),
          studentId: data.studentId,
        };
        return api.post('/attendance-records', payload);
      });
      return Promise.all(promises);
    }
    return api.post('/attendance-records', cleanData(data));
  },

  createActivityParticipation: async (data: any) => {
    if (data.semesters && Array.isArray(data.semesters)) {
      const promises = data.semesters.map((semesterData: any) => {
        const payload = {
          ...cleanData(semesterData),
          studentId: data.studentId
        };
        return api.post('/activity-participation', payload);
      });
      return Promise.all(promises);
    }
    return api.post('/activity-participation', cleanData(data));
  },

  createObservationalVisit: async (data: any) => {
    if (data.visits && Array.isArray(data.visits)) {
      const promises = data.visits.map((visitData: any) => {
        const payload = {
          ...cleanData(visitData),
          studentId: data.studentId
        };
        return api.post('/observational-visits', payload);
      });
      return Promise.all(promises);
    }
    return api.post('/observational-visits', cleanData(data));
  },

  createClinicalExperience: async (data: any) => {
    if (data.records && Array.isArray(data.records)) {
      const filledRecords = data.records.filter((record: any) => {
        const hasCompletedHours = record.completedHours && record.completedHours.toString().trim() !== '';
        const hasHospital = record.hospital && record.hospital.toString().trim() !== '';
        return hasCompletedHours || hasHospital;
      });

      if (filledRecords.length === 0) {
        return Promise.resolve({ data: { message: 'No clinical experience data to save' } });
      }

      const promises = filledRecords.map((record: any) => {
        const payload = {
          ...cleanData(record),
          studentId: data.studentId
        };
        return api.post('/clinical-experiences', payload);
      });
      return Promise.all(promises);
    }
    return api.post('/clinical-experiences', cleanData(data));
  },

  createResearchProject: async (data: any) => {
    if (data.projects && Array.isArray(data.projects)) {
      const filledProjects = data.projects.filter((proj: any) => {
        const hasSemester = proj.semester && proj.semester.toString().trim() !== '';
        const hasAreaOfStudy = proj.areaOfStudy && proj.areaOfStudy.toString().trim() !== '';
        const hasProjectTitle = proj.projectTitle && proj.projectTitle.toString().trim() !== '';
        return hasSemester && hasAreaOfStudy && hasProjectTitle;
      });

      if (filledProjects.length === 0) {
        return Promise.resolve({ data: { message: 'No research project data to save' } });
      }

      const promises = filledProjects.map((proj: any) => {
        const payload = {
          ...cleanData(proj),
          studentId: data.studentId
        };
        return api.post('/research-projects', payload);
      });
      return Promise.all(promises);
    }
    return api.post('/research-projects', cleanData(data));
  },

  createAdditionalCourses: async (data: any) => {
    if (data.courses && Array.isArray(data.courses)) {
      const filledCourses = data.courses.filter((course: any) => {
        const hasCourseName = course.courseName && course.courseName.toString().trim() !== '';
        return hasCourseName;
      });

      if (filledCourses.length === 0) {
        return Promise.resolve({ data: { message: 'No additional courses data to save' } });
      }

      const promises = filledCourses.map((course: any) => {
        const payload = {
          ...cleanData(course),
          studentId: data.studentId,
          id: course.id
        };
        return api.post('/additional-courses', payload);
      });
      return Promise.all(promises);
    }
    return api.post('/additional-courses', cleanData(data));
  },

  createCourseInstruction: async (data: any) => {
    console.log("📤 API Service sending to backend:", { studentId: data.studentId, semester: data.semester, attempt: data.attempt, coursesCount: data.courses?.length });
    return api.post('/course-instructions', {
      studentId: data.studentId,
      semester: data.semester,
      attempt: data.attempt, // Include attempt number
      courses: data.courses.map((course: any) => cleanData(course))
    });
  },

  createCourseCompletion: async (data: any) => {
    if (data.completions && Array.isArray(data.completions)) {
      const promises = data.completions.map((comp: any) => {
        const payload = {
          ...cleanData(comp),
          studentId: data.studentId
        };
        return api.post('/course-completions', payload);
      });
      return Promise.all(promises);
    }
    return api.post('/course-completions', cleanData(data));
  },

  createVerification: async (data: any) => {
    const payload = {
      studentId: data.studentId,
      verifications: data.verifications.map((v: any) => cleanData(v))
    };
    return api.post('/verifications', payload);
  },
};

// ========== GET METHODS ==========
export const getAllInstitutions = async () => {
  return api.get('/institution-details');
};

export const getInstitutionByName = async (institutionName: string) => {
  return api.get(`/institution-details/institution/${encodeURIComponent(institutionName)}`);
};

export const getPersonalProfileByStudentId = async (studentId: string) => {
  return api.get(`/personal-profiles/student/${studentId}`);
};

//get all students by id 
export const checkStudentId = async (studentId: string) => {
  return api.get(`/personal-profiles/student/${studentId}`);
};



export const getEducationalQualificationByStudentId = async (studentId: string) => {
  return api.get(`/educational-qualifications/student/${studentId}`);
};

export const getAdmissionDetailByStudentId = async (studentId: string) => {
  return api.get(`/admission-details/student/${studentId}`);
};

export const getAttendanceRecordsByStudentId = async (studentId: string) => {
  return api.get(`/attendance-records/student/${studentId}`);
};

export const getActivityParticipationByStudentId = async (studentId: string) => {
  return api.get(`/activity-participation/student/${studentId}`);
};

export const getCourseInstructionsByStudentId = async (studentId: string) => {
  return api.get(`/course-instructions/student/${studentId}`);
};

export const getObservationalVisitsByStudentId = async (studentId: string) => {
  return api.get(`/observational-visits/student/${studentId}`);
};

export const getClinicalExperiencesByStudentId = async (studentId: string) => {
  return api.get(`/clinical-experiences/student/${studentId}`);
};

export const getResearchProjectsByStudentId = async (studentId: string) => {
  return api.get(`/research-projects/student/${studentId}`);
};

export const getAdditionalCoursesByStudentId = async (studentId: string) => {
  return api.get(`/additional-courses/student/${studentId}`);
};

export const getCourseCompletionsByStudentId = async (studentId: string) => {
  return api.get(`/course-completions/student/${studentId}`);
};

export const getVerificationsByStudentId = async (studentId: string) => {
  return api.get(`/verifications/student/${studentId}`);
};

export const getAllDataByStudentId = async (studentId: string) => {
  // Safe date parsing helper - converts database date to YYYY-MM-DD format
  const parseDate = (dateValue: any): string => {
    if (!dateValue) return '';
    try {
      const date = new Date(dateValue);
      // Check if date is valid
      if (isNaN(date.getTime())) return '';
      return date.toISOString().split('T')[0];
    } catch (error) {
      console.warn('Invalid date value:', dateValue, error);
      return '';
    }
  };

  try {
    const [step1, step2, step3, step4, step5, step6, step7, step8, step9, step10, step11, step12] = await Promise.allSettled([
      getPersonalProfileByStudentId(studentId),
      getEducationalQualificationByStudentId(studentId),
      getAdmissionDetailByStudentId(studentId),
      getAttendanceRecordsByStudentId(studentId),
      getActivityParticipationByStudentId(studentId),
      getCourseInstructionsByStudentId(studentId),
      getObservationalVisitsByStudentId(studentId),
      getClinicalExperiencesByStudentId(studentId),
      getResearchProjectsByStudentId(studentId),
      getAdditionalCoursesByStudentId(studentId),
      getCourseCompletionsByStudentId(studentId),
      getVerificationsByStudentId(studentId),
    ]);

    // Fetch institution details if institutionId exists in personal profile
    let step0 = null;
    if (step1.status === 'fulfilled' && step1.value.data.data?.institutionId) {
      const institutionId = step1.value.data.data.institutionId;
      try {
        const institutionResponse = await api.get(`/institution-details/${institutionId}`);
        step0 = { status: 'fulfilled' as const, value: institutionResponse };
      } catch (error) {
        step0 = { status: 'rejected' as const, reason: error };
      }
    }

    return {
      // Frontend Step 1: Institution Details (from backend step0)
      step1: step0?.status === 'fulfilled' && step0.value.data.data
        ? step0.value.data.data
        : null,

      // Frontend Step 2: General Instructions (no backend data, skip)
      // step2 is not included because it's a read-only instructions page

      // Frontend Step 3: Personal Profile (from backend step1)
      step3: step1.status === 'fulfilled' && step1.value.data.data
        ? {
          ...step1.value.data.data,
          photo: step1.value.data.data.photoUrl,
          dateOfBirth: parseDate(step1.value.data.data.dateOfBirth),
          regNo: step1.value.data.data.universityRegistration,
        }
        : null,

      // Frontend Step 4: Educational Qualification (from backend step2)
      step4: step2.status === 'fulfilled' && step2.value.data.data
        ? {
          ...step2.value.data.data,
          certificateDate: parseDate(step2.value.data.data.certificateDate),
          hscVerificationDate: parseDate(step2.value.data.data.hscVerificationDate)
        }
        : null,

      // Frontend Step 5: Admission Details (from backend step3)
      step5: step3.status === 'fulfilled' && step3.value.data.data
        ? {
          ...step3.value.data.data,
          dateOfAdmission: parseDate(step3.value.data.data.dateOfAdmission),
          migrationCertificateDate: parseDate(step3.value.data.data.migrationCertificateDate),
          eligibilityCertificateDate: parseDate(step3.value.data.data.eligibilityCertificateDate),
          communityCertificateDate: parseDate(step3.value.data.data.communityCertificateDate),
          nativityCertificateDate: parseDate(step3.value.data.data.nativityCertificateDate),
          dateOfDiscontinuation: parseDate(step3.value.data.data.dateOfDiscontinuation),
        }
        : null,

      // Frontend Step 6: Attendance Record (from backend step4)
      step6: step4.status === 'fulfilled' && step4.value.data.data
        ? { semesters: Array.isArray(step4.value.data.data) ? step4.value.data.data : [] }
        : null,

      // Frontend Step 7: Activities & Participation (from backend step5)
      step7: step5.status === 'fulfilled' && step5.value.data.data
        ? { semesters: Array.isArray(step5.value.data.data) ? step5.value.data.data : [] }
        : null,

      // Frontend Step 8: Course Instruction (from backend step6)
      // Backend returns: { data: [{ semester, attempts: [{ attempt, courses }] }] }
      // Return the semestersData array directly - it will be transformed by StudentEdit.tsx
      step8: (() => {
        const rawData = step6.status === 'fulfilled' && step6.value.data.data;
        console.log("🔍 API - step6 raw data:", JSON.stringify(rawData).substring(0, 300));
        const result = rawData ? (Array.isArray(rawData) ? rawData : []) : null;
        console.log("🔍 API - step8 result is array?", Array.isArray(result), "Value:", result);
        return result;
      })(),

      // Frontend Step 9: Observational Visits (from backend step7)
      step9: step7.status === 'fulfilled' && step7.value.data.data
        ? {
          visits: Array.isArray(step7.value.data.data)
            ? step7.value.data.data.map((visit: any) => ({
              ...visit,
              date: parseDate(visit.date)
            }))
            : []
        }
        : null,

      // Frontend Step 10: Clinical Experience (from backend step8)
      step10: step8.status === 'fulfilled' && step8.value.data.data
        ? {
          records: Array.isArray(step8.value.data.data) ? step8.value.data.data : []
        }
        : null,

      // Frontend Step 11: Research Projects (from backend step9)
      step11: step9.status === 'fulfilled' && step9.value.data.data
        ? {
          projects: Array.isArray(step9.value.data.data) ? step9.value.data.data : []
        }
        : null,

      // Frontend Step 12: Additional Courses (from backend step10)
      step12: step10.status === 'fulfilled' && step10.value.data.data
        ? {
          courses: Array.isArray(step10.value.data.data)
            ? step10.value.data.data.map((course: any, index: number) => ({
              id: course.id,
              courseId: String(index + 1),
              courseName: course.courseName || '',
              from: parseDate(course.from),
              to: parseDate(course.to),
            }))
            : []
        }
        : null,

      // Frontend Step 13: Course Completion (from backend step11)
      step13: step11.status === 'fulfilled' && step11.value.data.data
        ? {
          completions: Array.isArray(step11.value.data.data)
            ? step11.value.data.data.map((comp: any) => ({
              ...comp,
              dateOfIssue: parseDate(comp.dateOfIssue)
            }))
            : []
        }
        : null,

      // Frontend Step 14: Verification (from backend step12)
      step14: step12.status === 'fulfilled' && step12.value.data.data
        ? {
          verifications: Array.isArray(step12.value.data.data.verifications)
            ? step12.value.data.data.verifications.map((ver: any) => ({
              ...ver,
              teacherSignature: parseDate(ver.teacherSignature),
              principalSignature: parseDate(ver.principalSignature)
            }))
            : []
        }
        : null,
    };
  } catch (error) {
    console.error('Error fetching student data:', error);
    throw error;
  }
};

export const saveDataToBackend = async (step: number, data: any) => {
  // Frontend step numbers now include "General Instructions" at step 2
  // Backend expects: 1=Institution, 2=Personal, 3=Educational, etc.
  // Frontend has: 1=Institution, 2=Instructions, 3=Personal, 4=Educational, etc.
  // So we need to map: frontend step 3+ → backend step 2+

  switch (step) {
    case 1: return apiService.createInstitutionDetail(data);
    case 2:
      // Step 2 is General Instructions (no backend save)
      throw new Error('General Instructions page does not save to backend');
    case 3: {
      // Frontend step 3 = Personal Profile = Backend step 2
      const { photoFile, ...restData } = data;
      return apiService.createPersonalProfile(restData, photoFile);
    }
    case 4: return apiService.createEducationalQualification(data); // Backend step 3
    case 5: return apiService.createAdmissionDetail(data); // Backend step 4
    case 6: return apiService.createAttendanceRecord(data); // Backend step 5
    case 7: return apiService.createActivityParticipation(data); // Backend step 6
    case 8: return apiService.createCourseInstruction(data); // Backend step 7
    case 9: return apiService.createObservationalVisit(data); // Backend step 8
    case 10: return apiService.createClinicalExperience(data); // Backend step 9
    case 11: return apiService.createResearchProject(data); // Backend step 10
    case 12: return apiService.createAdditionalCourses(data); // Backend step 11
    case 13: return apiService.createCourseCompletion(data); // Backend step 12
    case 14: return apiService.createVerification(data); // Backend step 13
    default: throw new Error(`No API endpoint configured for step ${step}`);
  }
};

export default api;