import axios from 'axios';

export const getErrorMessage = (error: unknown): string | null => {
  if (axios.isAxiosError(error)) {
    return typeof error.response?.data === 'string' ? error.response.data : null;
  } else if (typeof error === 'string') {
    return error;
  } else if (error instanceof Error) {
    return error.message;
  }

  return null;
};
