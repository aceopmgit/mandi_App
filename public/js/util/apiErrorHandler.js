export function handleApiError(error) {
  // Default error message
  let message = "An unexpected error occurred. Please try again.";

  if (error.response) {
    // Backend responded with an error
    message = error.response.data.message || message;

    // Handle specific error cases
    if (error.response.status === 401) {
      message = "Your session has expired. Please log in again.";
      localStorage.removeItem("userToken");
      window.location.href = "/login"; // Redirect to login page
    }
    if (error.response.status === 403) {
      message = "Access denied";

      window.location.href = "/home"; // Redirect to home page
    }
  } else if (error.request) {
    // No response from the server
    message = "Unable to connect to the server. Please check your network.";
  } else {
    // Other errors
    message = error.message;
  }

  return message;
}
