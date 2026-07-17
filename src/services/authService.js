import axiosInstance from '../api/axios';

/**
 * Register a new user.
 * @param {FormData} formData - Multipart form data (includes avatar file)
 */
export const registerUser = async (formData) => {
  const response = await axiosInstance.post('/users/register', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

/**
 * Log in an existing user.
 * @param {{ email: string, password: string }} credentials
 */
export const loginUser = async (credentials) => {
  const response = await axiosInstance.post('/users/login', credentials);
  return response.data;
};

/**
 * Log out the current user (clears httpOnly cookie on server).
 */
export const logoutUser = async () => {
  const response = await axiosInstance.post('/users/logout');
  return response.data;
};

/**
 * Get the currently authenticated user's profile.
 */
export const getCurrentUser = async () => {
  const response = await axiosInstance.get('/users/current-user');
  return response.data;
};

/**
 * Update the authenticated user's account details.
 * @param {Object} data - Fields to update (fullName, email, etc.)
 */
export const updateProfile = async (data) => {
  const response = await axiosInstance.patch('/users/update-account', data);
  return response.data;
};
