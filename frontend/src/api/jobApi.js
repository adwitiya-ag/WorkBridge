import axiosClient from './axiosClient';

export const jobApi = {
  // Get all jobs
  getAllJobs: async () => {
    const response = await axiosClient.get('/jobs');
    return response.data;
  },

  // Get job by ID
  getJobById: async (jobId) => {
    const response = await axiosClient.get(`/jobs/${jobId}`);
    return response.data;
  },

  // Post a new job (Employer only)
  postJob: async (jobData) => {
    let payload = jobData;
    if (!(jobData instanceof FormData)) {
      payload = new FormData();
      Object.keys(jobData).forEach((key) => payload.append(key, jobData[key]));
    }
    const response = await axiosClient.post('/jobs/postJobs', payload);
    return response.data;
  },

  // Search jobs by title & location
  searchJobs: async ({ title = '', location = '' }) => {
    const payload = new FormData();
    if (title) payload.append('title', title);
    if (location) payload.append('location', location);
    const response = await axiosClient.post('/jobs/search', payload);
    return response.data;
  },

  // Apply to a job (JobSeeker only)
  applyToJob: async (jobId) => {
    const response = await axiosClient.post('/users/apply', { jobId });
    return response.data;
  },
};
