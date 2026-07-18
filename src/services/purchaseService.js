import axiosInstance from '../api/axios';

export const checkPurchaseStatus = async (
  mockTestId
) => {

  const response =
    await axiosInstance.get(
      `/purchases/check/${mockTestId}`
    );

  return response.data;
};

export const getMyPurchases =
  async () => {

    const response =
      await axiosInstance.get(
        "/purchases/my-purchases"
      );

    return response.data;
};