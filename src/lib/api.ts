// import axios from 'axios';

// const API_BASE_URL = 'http://localhost:5000/api';

// // Create axios instance
// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // API functions for each endpoint
// export const apiService = {
//   // Personal Profile
//   createPersonalProfile: async (data: any, photoFile?: File) => {
//     const formData = new FormData();

//     // Add all form data
//     Object.keys(data).forEach(key => {
//       if (data[key] !== undefined && data[key] !== null) {
//         formData.append(key, data[key]);
//       }
//     });

//     // Add photo if exists
//     if (photoFile) {
//       formData.append('photo', photoFile);
//     }

//     return api.post('/personal-profiles', formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     });
//   },

//   updatePersonalProfile: async (id: string, data: any, photoFile?: File) => {
//     const formData = new FormData();

//     // Add all form data
//     Object.keys(data).forEach(key => {
//       if (data[key] !== undefined && data[key] !== null) {
//         formData.append(key, data[key]);
//       }
//     });

//     // Add photo if exists
//     if (photoFile) {
//       formData.append('photo', photoFile);
//     }

//     return api.put(`/personal-profiles/${id}`, formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     });
//   },

//   // Educational Qualification
//   createEducationalQualification: async (data: any) => {
//     return api.post('/educational-qualifications', data);
//   },

//   // Admission Details
//   createAdmissionDetail: async (data: any) => {
//     return api.post('/admission-details', data);
//   },

//   // Attendance Record
//   createAttendanceRecord: async (data: any) => {
//     return api.post('/attendance-records', data);
//   },

//   // Activities Participation
//   createActivityParticipation: async (data: any) => {
//     return api.post('/activity-participation', data);
//   },

//   // Course Instruction
//   createCourseInstruction: async (data: any) => {
//     return api.post('/course-instructions', data);
//   },

//   // Observational Visits
//   createObservationalVisit: async (data: any) => {
//     return api.post('/observational-visits', data);
//   },

//   // Clinical Experience
//   createClinicalExperience: async (data: any) => {
//     return api.post('/clinical-experiences', data);
//   },

//   // Research Projects
//   createResearchProject: async (data: any) => {
//     return api.post('/research-projects', data);
//   },

//   // Additional Courses
//   createAdditionalCourses: async (data: any) => {
//     return api.post('/additional-courses', data);
//   },

//   // Course Completion
//   createCourseCompletion: async (data: any) => {
//     return api.post('/course-completions', data);
//   },

//   // Verification
//   createVerification: async (data: any) => {
//     return api.post('/verifications', data);
//   },
// };

// export default api;



import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API functions for each endpoint
export const apiService = {
  // Personal Profile - Updated to handle JSON vs FormData
  createPersonalProfile: async (data: any, photoFile?: File) => {
    // If no photo, send as JSON to preserve number types (fixes 400 Bad Request)
    if (!photoFile) {
      return api.post('/personal-profiles', data);
    }

    const formData = new FormData();
    // Add all form data
    Object.keys(data).forEach(key => {
      if (data[key] !== undefined && data[key] !== null) {
        formData.append(key, data[key]);
      }
    });

    // Add photo if exists
    if (photoFile) {
      formData.append('photo', photoFile);
    }

    return api.post('/personal-profiles', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  updatePersonalProfile: async (id: string, data: any, photoFile?: File) => {
    // If no photo, use JSON
    if (!photoFile) {
      return api.put(`/personal-profiles/${id}`, data);
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

    return api.put(`/personal-profiles/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Educational Qualification
  createEducationalQualification: async (data: any) => {
    return api.post('/educational-qualifications', data);
  },

  // Admission Details
  createAdmissionDetail: async (data: any) => {
    console.log('Creating Admission Detail with data at api');
    return api.post('/admission-details', data);
  },

  // Attendance Record
  createAttendanceRecord: async (data: any) => {
    return api.post('/attendance-records', data);
  },

  // Activities Participation
  createActivityParticipation: async (data: any) => {
    return api.post('/activity-participation', data);
  },

  // Course Instruction
  createCourseInstruction: async (data: any) => {
    return api.post('/course-instructions', data);
  },

  // Observational Visits
  createObservationalVisit: async (data: any) => {
    return api.post('/observational-visits', data);
  },

  // Clinical Experience
  createClinicalExperience: async (data: any) => {
    return api.post('/clinical-experiences', data);
  },

  // Research Projects
  createResearchProject: async (data: any) => {
    return api.post('/research-projects', data);
  },

  // Additional Courses
  createAdditionalCourses: async (data: any) => {
    return api.post('/additional-courses', data);
  },

  // Course Completion
  createCourseCompletion: async (data: any) => {
    return api.post('/course-completions', data);
  },

  // Verification
  createVerification: async (data: any) => {
    return api.post('/verifications', data);
  },
};

// Helper function used by Index.tsx
export const saveDataToBackend = async (step: number, data: any) => {
  switch (step) {
    case 1: return apiService.createPersonalProfile(data);
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