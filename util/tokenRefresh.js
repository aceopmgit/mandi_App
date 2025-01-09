import axios from "axios";

export async function refreshAccessToken() {
  try {
    // Make the refresh request using Axios
    const res = await axios.post("/refreshToken", null, {
      withCredentials: true, // Ensures cookies are sent with the request
    });

    if (res.status === 200) {
      const { accessToken } = res.data; // Assuming the new token is in the response
      // Store the new access token in localStorage
      localStorage.setItem("userToken", accessToken);
    } else {
      console.error("Failed to refresh token");
    }
  } catch (err) {
    console.error("Error refreshing token:", err.message);
  }
}
