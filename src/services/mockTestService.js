import axiosInstance from '../api/axios';

/**
 * Create a new mock test (admin).
 * @param {Object} data - Mock test payload
 */
export const createMockTest = async (data) => {
  const response = await axiosInstance.post('/mock-tests/create-mock-test', data);
  return response.data;
};

/**
 * Fetch all mock tests with optional pagination and search.
 * @param {{ page?: number, limit?: number, search?: string }} params
 */
export const getAllMockTests = async (params = {}) => {
  const response = await axiosInstance.get('/mock-tests/get-all-mock-tests', {
    params: {
      ...(params.page && { page: params.page }),
      ...(params.limit && { limit: params.limit }),
      ...(params.search && { search: params.search }),
    },
  });
  return response.data;
};

/**
 * Fetch a single mock test by ID.
 * @param {string} id
 */
export const getMockTest = async (id) => {
  const response = await axiosInstance.get(`/mock-tests/get-mock-test/${id}`);
  return response.data;
};

/**
 * Update a mock test by ID (admin).
 * @param {string} id
 * @param {Object} data - Updated fields
 */
export const updateMockTest = async (id, data) => {
  const response = await axiosInstance.put(`/mock-tests/update-mock-test/${id}`, data);
  return response.data;
};

/**
 * Delete a mock test by ID (admin).
 * @param {string} id
 */
export const deleteMockTest = async (id) => {
  const response = await axiosInstance.delete(`/mock-tests/delete-mock-test/${id}`);
  return response.data;
};
