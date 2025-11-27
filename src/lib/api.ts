import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


export const fetchAllStudentsFromDB = async () => {
  const res = await axios.get("http://localhost:5000/api/personal-profiles/");
  return res.data; // list of student step1 data
};
// Helper to clean empty strings to null (prevents 400 errors on numeric/date fields)
const cleanData = (data: Record<string, any>) => {
  return Object.fromEntries(
    Object.entries(data).map(([k, v]) => [k, v === "" ? null : v])
  );
};

// API functions for each endpoint
export const apiService = {
  // Personal Profile
  createPersonalProfile: async (data: any, photoFile?: File) => {
    // If no photo, send as JSON (cleaned)
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

  // Attendance Record (Array Handling)
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

  // Activity Participation (Array Handling)
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
  // Course Instruction - Updated to handle Array
  // createCourseInstruction: async (data: any) => {
  //   if (data.courses && Array.isArray(data.courses)) {
  //     const promises = data.courses.map((courseData: any) => {
  //       const payload = {
  //         ...cleanData(courseData),
  //         studentId: data.studentId,
  //         semester: data.semester // Important: semester is top-level here
  //       };
  //       return api.post('/course-instructions', payload);
  //     });
  //     return Promise.all(promises);
  //   }
  //   return api.post('/course-instructions', cleanData(data));
  // },
// Course Instruction - Send full array in ONE request
createCourseInstruction: async (data: any) => {
  return api.post('/course-instructions', {
    studentId: data.studentId,
    semester: data.semester,
    courses: data.courses.map((course: any) => cleanData(course))
  });
},

  // Course Instruction - Updated to handle Array
//  createCourseInstruction: async (data: any) => {
//   return api.post('/course-instructions', {
//     studentId: data.studentId,
//     semester: data.semester,
//     courses: data.courses.map((course: any) => cleanData(course))
//   });
// },
  // Observational Visits (Array Handling)
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

  // Clinical Experience (Array Handling)
  createClinicalExperience: async (data: any) => {
    if (data.records && Array.isArray(data.records)) {
      // Filter out empty records (only send records with actual data)
      const filledRecords = data.records.filter((record: any) => {
        const hasCompletedHours = record.completedHours && record.completedHours.toString().trim() !== '';
        const hasHospital = record.hospital && record.hospital.toString().trim() !== '';
        return hasCompletedHours || hasHospital; // Send if either field has data
      });

      if (filledRecords.length === 0) {
        // No data to save
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

  // Research Projects (Array Handling)
  createResearchProject: async (data: any) => {
    if (data.projects && Array.isArray(data.projects)) {
      // Filter out empty projects (only send projects with actual data)
      const filledProjects = data.projects.filter((proj: any) => {
        const hasSemester = proj.semester && proj.semester.toString().trim() !== '';
        const hasAreaOfStudy = proj.areaOfStudy && proj.areaOfStudy.toString().trim() !== '';
        const hasProjectTitle = proj.projectTitle && proj.projectTitle.toString().trim() !== '';
        return hasSemester && hasAreaOfStudy && hasProjectTitle; // All required fields must be filled
      });

      if (filledProjects.length === 0) {
        // No data to save
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

  // Additional Courses (Array Handling)
  createAdditionalCourses: async (data: any) => {
    if (data.courses && Array.isArray(data.courses)) {
      // Filter out empty courses (only send courses with actual data)
      const filledCourses = data.courses.filter((course: any) => {
        const hasCourseName = course.courseName && course.courseName.toString().trim() !== '';
        return hasCourseName; // Only send if course name is filled
      });

      if (filledCourses.length === 0) {
        // No data to save
        return Promise.resolve({ data: { message: 'No additional courses data to save' } });
      }

      const promises = filledCourses.map((course: any) => {
        const payload = {
          ...cleanData(course),
          studentId: data.studentId,
          id: course.id // Include database ID for updates
        };
        return api.post('/additional-courses', payload);
      });
      return Promise.all(promises);
    }
    return api.post('/additional-courses', cleanData(data));
  },

  // Course Completion (Array Handling)
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

  // Verification (Array Handling)
  createVerification: async (data: any) => {
    const payload = {
      studentId: data.studentId,
      verifications: data.verifications.map((v: any) => cleanData(v))
    };

    return api.post('/verifications', payload);
  },

};

// ========== GET METHODS ==========

// Get Personal Profile by Student ID
export const getPersonalProfileByStudentId = async (studentId: string) => {
  return api.get(`/personal-profiles/student/${studentId}`);
};

// Get Educational Qualification by Student ID
export const getEducationalQualificationByStudentId = async (studentId: string) => {
  return api.get(`/educational-qualifications/student/${studentId}`);
};

// Get Admission Detail by Student ID
export const getAdmissionDetailByStudentId = async (studentId: string) => {
  return api.get(`/admission-details/student/${studentId}`);
};

// Get Attendance Records by Student ID
export const getAttendanceRecordsByStudentId = async (studentId: string) => {
  return api.get(`/attendance-records/student/${studentId}`);
};

// Get Activity Participation by Student ID
export const getActivityParticipationByStudentId = async (studentId: string) => {
  return api.get(`/activity-participation/student/${studentId}`);
};

// Get Course Instructions by Student ID
export const getCourseInstructionsByStudentId = async (studentId: string) => {
  return api.get(`/course-instructions/student/${studentId}`);
};

// Get Observational Visits by Student ID
export const getObservationalVisitsByStudentId = async (studentId: string) => {
  return api.get(`/observational-visits/student/${studentId}`);
};

// Get Clinical Experiences by Student ID
export const getClinicalExperiencesByStudentId = async (studentId: string) => {
  return api.get(`/clinical-experiences/student/${studentId}`);
};

// Get Research Projects by Student ID
export const getResearchProjectsByStudentId = async (studentId: string) => {
  return api.get(`/research-projects/student/${studentId}`);
};

// Get Additional Courses by Student ID
export const getAdditionalCoursesByStudentId = async (studentId: string) => {
  return api.get(`/additional-courses/student/${studentId}`);
};

// Get Course Completions by Student ID
export const getCourseCompletionsByStudentId = async (studentId: string) => {
  return api.get(`/course-completions/student/${studentId}`);
};

// Get Verifications by Student ID
export const getVerificationsByStudentId = async (studentId: string) => {
  return api.get(`/verifications/student/${studentId}`);
};

// Fetch all data for a student by studentId
export const getAllDataByStudentId = async (studentId: string) => {
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

    return {
      step1: step1.status === 'fulfilled' && step1.value.data.data
        ? { ...step1.value.data.data, photo: step1.value.data.data.photoUrl }
        : null,
      step2: step2.status === 'fulfilled' ? step2.value.data.data : null,
      step3: step3.status === 'fulfilled' ? step3.value.data.data : null,
      step4: step4.status === 'fulfilled' ? step4.value.data.data : null,
      step5: step5.status === 'fulfilled' ? step5.value.data.data : null,
      step6: step6.status === 'fulfilled' ? step6.value.data.data : null,
      step7: step7.status === 'fulfilled' ? step7.value.data.data : null,
      step8: step8.status === 'fulfilled' ? step8.value.data.data : null,
      step9: step9.status === 'fulfilled' ? step9.value.data.data : null,
      step10: step10.status === 'fulfilled' && step10.value.data.data
        ? {
          courses: Array.isArray(step10.value.data.data)
            ? step10.value.data.data.map((course: any, index: number) => ({
              id: course.id, // Database ID for updates
              courseId: String(index + 1), // Auto-generated display ID
              courseName: course.courseName || '',
              from: course.from ? new Date(course.from).toISOString().split('T')[0] : '',
              to: course.to ? new Date(course.to).toISOString().split('T')[0] : '',
            }))
            : []
        }
        : null,
      step11: step11.status === 'fulfilled' && step11.value.data.data
        ? { completions: Array.isArray(step11.value.data.data) ? step11.value.data.data : [] }
        : null,
      step12: step12.status === 'fulfilled' ? step12.value.data.data : null,
    };
  } catch (error) {
    console.error('Error fetching student data:', error);
    throw error;
  }
};

// Universal Save Function used by Index.tsx
// Now uses POST for create, relies on backend upsert logic
export const saveDataToBackend = async (step: number, data: any) => {
  switch (step) {
    case 1: {
      // Extract photoFile from data if it exists
      const { photoFile, ...restData } = data;
      return apiService.createPersonalProfile(restData, photoFile);
    }
    case 2: return apiService.createEducationalQualification(data);
    case 3: return apiService.createAdmissionDetail(data);
    case 4: return apiService.createAttendanceRecord(data);
    case 5: return apiService.createActivityParticipation(data);
    case 6: return apiService.createCourseInstruction(data);
    case 7: return apiService.createObservationalVisit(data);
    case 8: return apiService.createClinicalExperience(data);
    case 9: return apiService.createResearchProject(data);
    case 10: return apiService.createAdditionalCourses(data);
    case 11: return apiService.createCourseCompletion(data);
    case 12: return apiService.createVerification(data);
    default: throw new Error(`No API endpoint configured for step ${step}`);
  }
};

export default api;