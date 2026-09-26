import axiosClient from './axiosClient';

export const authApi = {
  // JobSeeker Auth
  registerUser: async (formData) => {
    // Expects FormData with name, email, password, profileImage file, resume file
    const response = await axiosClient.post('/users/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  loginUser: async (credentials) => {
    let payload = credentials;
    if (!(credentials instanceof FormData)) {
      payload = new FormData();
      Object.keys(credentials).forEach((key) => payload.append(key, credentials[key]));
    }
    const response = await axiosClient.post('/users/login', payload);
    return response.data;
  },

  logoutUser: async () => {
    const response = await axiosClient.post('/users/logout');
    return response.data;
  },

  getUserProfile: async () => {
    const response = await axiosClient.get('/users/getUser');
    return response.data;
  },

  // Employer Auth
  registerEmployer: async (formDataOrData) => {
    let payload = formDataOrData;
    let headers = {};
    if (formDataOrData instanceof FormData) {
      headers['Content-Type'] = 'multipart/form-data';
    } else {
      payload = new FormData();
      Object.keys(formDataOrData).forEach((key) => {
        if (formDataOrData[key]) payload.append(key, formDataOrData[key]);
      });
      headers['Content-Type'] = 'multipart/form-data';
    }
    const response = await axiosClient.post('/employers/register', payload, { headers });
    return response.data;
  },

  loginEmployer: async (credentials) => {
    let payload = credentials;
    if (!(credentials instanceof FormData)) {
      payload = new FormData();
      Object.keys(credentials).forEach((key) => payload.append(key, credentials[key]));
    }
    const response = await axiosClient.post('/employers/login', payload);
    return response.data;
  },

  logoutEmployer: async () => {
    const response = await axiosClient.post('/employers/logout');
    return response.data;
  },

  getEmployerProfile: async () => {
    const response = await axiosClient.get('/employers/getEmployer');
    return response.data;
  },

  getEmployerApplicants: async () => {
    const response = await axiosClient.get('/employers/applicants');
    return response.data;
  },
};
