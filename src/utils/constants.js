export const APP_NAME = 'PrepMaster';

export const BASE_URL = import.meta.env.VITE_API_URL;;

export const DIFFICULTY_LEVELS = ['Easy', 'Medium', 'Hard'];

export const PAYMENT_STATUS = Object.freeze({
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
  PENDING: 'PENDING',
});

export const ITEMS_PER_PAGE = 9;
