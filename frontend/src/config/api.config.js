// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const ROLES = {
  JOB_SEEKER: 'JobSeeker',
  EMPLOYER: 'Employer',
};

export const STORAGE_KEYS = {
  TOKEN: 'hireme_token',
  ROLE: 'hireme_role',
  USER: 'hireme_user',
};
