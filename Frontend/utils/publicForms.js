import axios from "axios";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const errorToast = (message) =>
  toast.error(message || "Something went wrong. Please try again.", {
    style: {
      backgroundColor: "#1A1A1A",
      color: "#fff",
      borderLeft: "5px solid #B71C1C",
    },
  });

export const uploadPublicImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);
  const response = await axios.post(`${API_URL}/public/upload-image`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data?.imageUrl;
};

export const submitPublicBloodDonation = async (data) => {
  try {
    await axios.post(`${API_URL}/public/blood-donation`, { data });
    toast.success("Blood donation pledge submitted successfully!", {
      style: {
        backgroundColor: "#1A1A1A",
        color: "#fff",
        borderLeft: "5px solid #4CAF50",
      },
    });
    return true;
  } catch (error) {
    if (error.response?.status === 429) {
      errorToast("Too many attempts. Please try again shortly.");
    } else {
      errorToast(error.response?.data?.message);
    }
    return false;
  }
};
