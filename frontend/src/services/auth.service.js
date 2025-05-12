import axios from "axios";

const BASE_URL = "http://localhost:5000/api/v1/users"; // Adjust this to match your backend URL

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
      });

      return response.data;
    } catch (error) {
      throw error.response
        ? error.response.data
        : new Error("Registration failed");
    }
  },

  async login(credentials) {
    try {
      const response = await axios.post(
        `${BASE_URL}/login`,
        {
          username: credentials.username,
          email: credentials.email,
          password: credentials.password,
        },
        {
          withCredentials: true, // Important for handling cookies
        }
      );

      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error("Login failed");
    }
  },

  async getCurrentUser() {
    try {
      const response = await axios.get(`${BASE_URL}/current-user`, {
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      throw error.response
        ? error.response.data
        : new Error("Failed to fetch user");
    }
  },

  async logout() {
    try {
      const response = await axios.post(
        `${BASE_URL}/logout`,
        {},
        {
          withCredentials: true,
        }
      );

      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error("Logout failed");
    }
  },
};
