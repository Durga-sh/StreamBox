import axios from "axios";

const BASE_URL = "http://localhost:5000/api/v1/users"; // Adjust this to match your backend URL

// Create an axios instance with default configs
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Important for cookies
  headers: {
    "Content-Type": "application/json",
  },
});

export const authService = {
  async register(userData) {
    try {
      const formData = new FormData();
      formData.append("fullName", userData.fullName);
      formData.append("email", userData.email);
      formData.append("username", userData.username);
      formData.append("password", userData.password);

      // Append avatar if exists
      if (userData.avatar) {
        formData.append("avatar", userData.avatar);
      }

      // Append cover image if exists
      if (userData.coverImage) {
        formData.append("coverImage", userData.coverImage);
      }

      const response = await axios.post(`${BASE_URL}/register`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      console.error("Registration error:", error);
      throw error.response
        ? error.response.data
        : new Error("Registration failed");
    }
  },

  async login(credentials) {
    try {
      const response = await api.post("/login", {
        username: credentials.username,
        email: credentials.email,
        password: credentials.password,
      });

      // If there's a token in the response, store it for API calls
      if (response.data?.data?.accessToken) {
        localStorage.setItem("accessToken", response.data.data.accessToken);
        api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response.data.data.accessToken}`;
      }

      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      throw error.response ? error.response.data : new Error("Login failed");
    }
  },

  async getCurrentUser() {
    try {
      // Add token from localStorage as a fallback
      const token = localStorage.getItem("accessToken");
      const config = {};

      if (token) {
        config.headers = {
          Authorization: `Bearer ${token}`,
        };
      }

      const response = await api.get("/current-user", config);
      return response.data;
    } catch (error) {
      console.error("Get current user error:", error);
      throw error.response
        ? error.response.data
        : new Error("Failed to fetch user");
    }
  },

  async logout() {
    try {
      const response = await api.post("/logout");
      // Clear local storage
      localStorage.removeItem("accessToken");
      delete api.defaults.headers.common["Authorization"];
      return response.data;
    } catch (error) {
      console.error("Logout error:", error);
      throw error.response ? error.response.data : new Error("Logout failed");
    }
  },
};

// Export the api instance
export { api };
