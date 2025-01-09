const apiClient = axios.create({
  baseURL: "/api", // Adjust to your API base URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: Attach the access token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("userToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: Handle token expiry
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check for token expiration (401) and ensure the request hasn't been retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark request as retried

      try {
        // Refresh token
        const refreshResponse = await axios.post(
          "/auth/refresh-token",
          {},
          { withCredentials: true }
        );
        const newAccessToken = refreshResponse.data.token;

        // Store new token
        localStorage.setItem("userToken", newAccessToken);

        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error("Failed to refresh token:", refreshError);
        // Remove tokens and redirect to login
        localStorage.removeItem("userToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
