import axios from "axios";

// Import the api instance from auth.service.js to reuse the default headers
import { api } from "./auth.service";

const BASE_URL = "http://localhost:5000/api/v1";

const videoApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
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
      const response = await videoApi.get("/videos", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching videos:", error);
      throw error.response?.data || new Error("Failed to fetch videos");
    }
  },

  uploadVideo: async (formData) => {
    try {
      const response = await videoApi.post("/videos", formData, {
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
      const response = await videoApi.get(`/videos/${videoId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching video by ID:", error);
      throw error.response?.data || new Error("Failed to fetch video");
    }
  },

  toggleVideoLike: async (videoId) => {
    try {
      const response = await videoApi.post(`/likes/v/${videoId}`);
      return response.data;
    } catch (error) {
      console.error("Error toggling video like:", error);
      throw error.response?.data || new Error("Failed to toggle like");
    }
  },

  checkVideoLike: async (videoId) => {
    try {
      const response = await videoApi.get(`/likes/v/${videoId}`);
      return response.data;
    } catch (error) {
      console.error("Error checking video like:", error);
      throw error.response?.data || new Error("Failed to check like status");
    }
  },

  addComment: async (videoId, commentData) => {
    try {
      const response = await videoApi.post(`/comments/${videoId}`, commentData);
      return response.data;
    } catch (error) {
      console.error("Error adding comment:", error);
      throw error.response?.data || new Error("Failed to add comment");
    }
  },

  getVideoComments: async (videoId, params = {}) => {
    try {
      const response = await videoApi.get(`/comments/${videoId}`, { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching comments:", error);
      throw error.response?.data || new Error("Failed to fetch comments");
    }
  },
};

export default videoService;
