import { AxiosError } from "axios";
import { logger } from "../utils/logger";
import {
  mapAxiosErrorToApiProblem,
  getApiProblemMessage,
  shouldShowToastForProblem,
} from "../utils/apiProblem";
import { toastManager } from "../utils/toast";

/**
 * Centralized error handler for API responses
 * Extracts meaningful error messages and shows appropriate UI feedback
 */
export const handleApiError = (error: AxiosError, context: string): never => {
  // Map to API problem
  const problem = mapAxiosErrorToApiProblem(error);
  const message = getApiProblemMessage(problem, error.response?.data);

  // Log error details in development
  if (__DEV__) {
    logger.error(`${context}: API error`, {
      problem,
      message,
      status: error.response?.status,
    });
  }

  // Show toast for user feedback if appropriate
  if (shouldShowToastForProblem(problem)) {
    toastManager.error(message);
  }

  // Throw user-friendly error message
  throw new Error(message);
};

/**
 * Specific handler for 400 Bad Request errors
 * Always shows toast with the exact API error message
 */
export const handleBadRequestError = (
  error: AxiosError,
  context: string
): void => {
  if (error.response?.status === 400) {
    const errorMessage =
      (error.response?.data as any)?.messageName ||
      (error.response?.data as any)?.message ||
      error.response?.data ||
      "Bad request";

    // Log in development only
    if (__DEV__) {
      logger.log(`${context}: 400 API error message`, errorMessage);
    }

    // Always show toast for 400 errors (includes "pending charge order" messages)
    toastManager.error(errorMessage);

    throw new Error(errorMessage);
  }

  // If not a 400 error, use general handler
  handleApiError(error, context);
};
