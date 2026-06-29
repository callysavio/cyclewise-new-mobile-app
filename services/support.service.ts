import api from "./api";

/* ================================
   TYPES
================================ */

export interface CreateSupportPayload {
  subject: string;
  email: string;
  message: string;
}

export interface SupportResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    subject: string;
    email: string;
    message: string;
    createdAt: string;
  };
}

export interface SupportError {
  message: string;
  statusCode: number;
}

/* ================================
   CONFIG
================================ */

const REQUEST_TIMEOUT = 15000;
const MAX_RETRIES = 2;

/* ================================
   INTERNAL RETRY FUNCTION
================================ */

const sleep = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms));

const requestWithRetry = async <T>(
  fn: () => Promise<T>,
  retries = MAX_RETRIES
): Promise<T> => {

  try {
    return await fn();

  } catch (error: any) {

    if (retries === 0) throw error;

    await sleep(1000);

    return requestWithRetry(fn, retries - 1);
  }
};

/* ================================
   CREATE SUPPORT REQUEST
================================ */

export const createSupportRequest = async (
  payload: CreateSupportPayload
): Promise<SupportResponse> => {

  try {

    const response = await requestWithRetry(() =>
      api.post<SupportResponse>(
        "/support",
        payload,
        {
          timeout: REQUEST_TIMEOUT,
        }
      )
    );

    return response.data;

  } catch (error: any) {

    const normalizedError: SupportError = {
      message:
        error?.response?.data?.message ||
        error?.message ||
        "Network error. Please check your internet connection.",
      statusCode:
        error?.response?.status ||
        500,
    };

    console.log("Support Service Error:", normalizedError);

    throw normalizedError;
  }
};