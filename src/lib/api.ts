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
  // Personal Profile
  createPersonalProfile: async (data: any, photoFile?: File) => {
    // If no photo, send as JSON
    if (!photoFile) {
      return api.post('/personal-profiles', data);
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
    if (!photoFile) return api.put(`/personal-profiles/${id}`, data);

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
    return api.post('/educational-qualifications', data);
  },

  createAdmissionDetail: async (data: any) => {
    return api.post('/admission-details', data);
  },

  // --- FIXED: Handle Array of Semesters ---
  createAttendanceRecord: async (data: any) => {
    // The backend expects single records, but the form provides an array.
    // We map over the semesters and send individual requests.
    if (data.semesters && Array.isArray(data.semesters)) {
      const promises = data.semesters.map((semesterData: any) => {
        // Clean up empty strings for numeric fields before sending
        const cleanData = Object.fromEntries(
          Object.entries(semesterData).map(([k, v]) => [
            k, 
            v === "" ? null : v 
          ])
        );

        const payload = {
          ...cleanData,
          studentId: data.studentId, // Ensure ID is attached to every row
        };
        
        return api.post('/attendance-records', payload);
      });
      return Promise.all(promises);
    }
    return api.post('/attendance-records', data);
  },

  createActivityParticipation: async (data: any) => {
    // Apply similar logic if Activities uses an array structure
    if (data.semesters && Array.isArray(data.semesters)) {
       const promises = data.semesters.map((semesterData: any) => {
         const payload = { ...semesterData, studentId: data.studentId };
         return api.post('/activity-participation', payload);
       });
       return Promise.all(promises);
    }
    return api.post('/activity-participation', data);
  },

  createCourseInstruction: async (data: any) => {
    return api.post('/course-instructions', data);
  },

  createObservationalVisit: async (data: any) => {
    // Assuming visits is an array
    if (data.visits && Array.isArray(data.visits)) {
        const promises = data.visits.map((visitData: any) => {
            const payload = { ...visitData, studentId: data.studentId };
            return api.post('/observational-visits', payload);
        });
        return Promise.all(promises);
    }
    return api.post('/observational-visits', data);
  },

  createClinicalExperience: async (data: any) => {
     if (data.records && Array.isArray(data.records)) {
        const promises = data.records.map((record: any) => {
            const payload = { ...record, studentId: data.studentId };
            return api.post('/clinical-experiences', payload);
        });
        return Promise.all(promises);
    }
    return api.post('/clinical-experiences', data);
  },

  createResearchProject: async (data: any) => {
    if (data.projects && Array.isArray(data.projects)) {
        const promises = data.projects.map((proj: any) => {
            const payload = { ...proj, studentId: data.studentId };
            return api.post('/research-projects', payload);
        });
        return Promise.all(promises);
    }
    return api.post('/research-projects', data);
  },

  createAdditionalCourses: async (data: any) => {
    if (data.courses && Array.isArray(data.courses)) {
        const promises = data.courses.map((course: any) => {
            const payload = { ...course, studentId: data.studentId };
            return api.post('/additional-courses', payload);
        });
        return Promise.all(promises);
    }
    return api.post('/additional-courses', data);
  },

  createCourseCompletion: async (data: any) => {
    if (data.completions && Array.isArray(data.completions)) {
        const promises = data.completions.map((comp: any) => {
            const payload = { ...comp, studentId: data.studentId };
            return api.post('/course-completions', payload);
        });
        return Promise.all(promises);
    }
    return api.post('/course-completions', data);
  },

  createVerification: async (data: any) => {
    if (data.verifications && Array.isArray(data.verifications)) {
        const promises = data.verifications.map((ver: any) => {
            const payload = { ...ver, studentId: data.studentId };
            return api.post('/verifications', payload);
        });
        return Promise.all(promises);
    }
    return api.post('/verifications', data);
  },
};

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