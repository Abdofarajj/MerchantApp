import { AxiosError } from "axios";

/**
 * API Problem types for consistent error handling
 */
export type ApiProblem =
  | "cannot-connect"
  | "timeout"
  | "server"
  | "unauthorized"
  | "forbidden"
  | "not-found"
  | "rejected"
  | "bad-data"
  | "unknown";

/**
 * Maps Axios errors to user-friendly API problems
 */
export function mapAxiosErrorToApiProblem(error: AxiosError): ApiProblem {
  // Network errors
  if (!error.response) {
    if (error.code === "ECONNABORTED") return "timeout";
    return "cannot-connect";
  }

  // HTTP status codes
  const { status } = error.response;

  switch (status) {
    case 401:
      return "unauthorized";
    case 403:
      return "forbidden";
    case 404:
      return "not-found";
    case 400:
    case 422:
      return "rejected";
    case 500:
    case 502:
    case 503:
      return "server";
    default:
      return "unknown";
  }
}

/**
 * Gets user-friendly error message for API problems
 */
export function getApiProblemMessage(problem: ApiProblem, data?: any): string {
  switch (problem) {
    case "cannot-connect":
      return "Unable to connect to the server. Please check your internet connection.";
    case "timeout":
      return "Request timed out. Please try again.";
    case "server":
      return "Server error. Please try again later.";
    case "unauthorized":
      return "Session expired. Please sign in again.";
    case "forbidden":
      return "You don't have permission to perform this action.";
    case "not-found":
      return "The requested resource was not found.";
    case "rejected":
      // For 400 errors, try to extract the specific API message
      if (data) {
        const message =
          (data as any)?.messageName || (data as any)?.message || data;
        if (typeof message === "string" && message.trim()) {
          return message;
        }
      }
      return "Invalid request. Please check your input.";
    case "bad-data":
      return "Received invalid data from server.";
    case "unknown":
    default:
      return "An unexpected error occurred. Please try again.";
  }
}

/**
 * Determines if an API problem should show a toast (non-blocking)
 * vs alert (blocking) or be silent
 */
export function shouldShowToastForProblem(problem: ApiProblem): boolean {
  switch (problem) {
    case "cannot-connect":
    case "timeout":
    case "server":
    case "rejected": // This includes 400 errors like "pending charge order"
    case "bad-data":
      return true; // Show toast for user feedback
    case "unauthorized":
    case "forbidden":
    case "not-found":
    case "unknown":
    default:
      return false; // Handle differently (alert, silent, etc.)
  }
}

/**
 * Determines if an API problem should trigger a sign-out
 */
export function shouldSignOutForProblem(problem: ApiProblem): boolean {
  return problem === "unauthorized";
}
