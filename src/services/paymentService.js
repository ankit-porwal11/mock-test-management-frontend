import axiosInstance from '../api/axios';

/**
 * Initiate a new payment (e.g. Razorpay order creation).
 * @param {Object} data - { mockTestId, amount, ... }
 */
export const createPayment = async (data) => {
  const response = await axiosInstance.post('/payments/create-payment', data);
  return response.data;
};

/**
 * PayU Initiate
 */
export const initiatePayUPayment = async (
  paymentId
) => {

  const response =
    await axiosInstance.post(
      `/payu/initiate/${paymentId}`
    );

  return response.data;
};



/**
 * Verify a payment after gateway callback.
 * @param {Object} data - { razorpay_order_id, razorpay_payment_id, razorpay_signature }
 */
export const verifyPayment = async (data) => {
  const response = await axiosInstance.post('/payments/verify-payment', data);
  return response.data;
};

/**
 * Fetch payment history for the current user.
 * @param {{ page?: number, limit?: number, status?: string }} params
 */
export const getPaymentHistory = async (params = {}) => {
  const response = await axiosInstance.get('/payments/payment-history', {
    params: {
      ...(params.page && { page: params.page }),
      ...(params.limit && { limit: params.limit }),
      ...(params.status && { status: params.status }),
    },
  });
  return response.data;
};

/**
 * Fetch a single payment by ID.
 * @param {string} id
 */
export const getPayment = async (id) => {
  const response = await axiosInstance.get(`/payments/get-payment/${id}`);
  return response.data;
};

/**
 * Fetch admin-level payment analytics (totals, counts, breakdowns).
 */
export const getPaymentAnalytics = async () => {
  const response = await axiosInstance.get('/payments/admin/payment-analytics');
  return response.data;
};
