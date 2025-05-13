import axios from "axios";

// Import the api instance from auth.service.js to reuse the default headers
import { api } from "./auth.service";

const BASE_URL = "http://localhost:5000/api/v1/videos";

// Create a new instance for videoService
const videoApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Ensure cookies are sent
  headers: {
    "Content-Type": "application/json",
  },
});

// Safely copy the Authorization header from the auth api instance
if (
  api &&
  api.defaults &&
  api.defaults.headers &&
  api.defaults.headers.common
) {
  videoApi.defaults.headers.common["Authorization"] =
    api.defaults.headers.common["Authorization"] || "";
} else {
  console.warn("auth.service api instance is not properly defined");
}

const videoService = {
  getAllVideos: async (params = {}) => {
    try {
      const response = await videoApi.get("", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching videos:", error);
      throw error.response?.data || new Error("Failed to fetch videos");
    }
  },

  uploadVideo: async (formData) => {
    try {
      const response = await videoApi.post("", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error uploading video:", error);
      throw error.response?.data || new Error("Failed to upload video");
    }
  },

  getVideoById: async (videoId) => {
    try {
      const response = await videoApi.get(`/${videoId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching video by ID:", error);
      throw error.response?.data || new Error("Failed to fetch video");
    }
  },
};

export default videoService;
