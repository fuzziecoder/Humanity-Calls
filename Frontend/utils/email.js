import axios from "axios";
import { toast } from "react-toastify";
import { getAuthToken } from "./authToken.js";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
export const sendEmail = async (type, data, subject) => {
  const optionalKeys = new Set([
    "locationAddress",
    "donationImageUrl",
    "requestImageUrl",
    "deviceDonationChoices",
  ]);
  const isEmpty = Object.entries(data).some(([key, value]) => {
    if (optionalKeys.has(key)) return false;
    if (Array.isArray(value)) return value.length === 0;
    return !value || value.toString().trim() === "";
  });
  if (isEmpty) {
    toast.error("Please fill in all fields before submitting.", {
      style: {
        backgroundColor: "#1A1A1A",
        color: "#fff",
        borderLeft: "5px solid #B71C1C",
      },
    });
    return false;
  }

  // Phone number validation (exactly 10 digits)
  if (data.phone) {
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(data.phone.toString().trim())) {
      toast.error("Phone number must be exactly 10 digits.", {
        style: {
          backgroundColor: "#1A1A1A",
          color: "#fff",
          borderLeft: "5px solid #B71C1C",
        },
      });
      return false;
    }
  }

  try {
    const token = getAuthToken();
    const headers = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await axios.post(`${API_URL}/send-email`, {
      type,
      data,
      subject,
    }, {
      withCredentials: true,
      headers
    });

    if (response.status === 200) {
      toast.success("Your message has been sent successfully!", {
        style: {
          backgroundColor: "#1A1A1A",
          color: "#fff",
          borderLeft: "5px solid #4CAF50",
        },
      });
      return true;
    }
  } catch (error) {
    if (error.response && error.response.status === 429) {
      const retryAfter = error.response.data.retryAfter || 30;
      toast.error(
        `Too many attempts. Please try again after ${retryAfter} seconds.`,
        {
          style: {
            backgroundColor: "#1A1A1A",
            color: "#fff",
            borderLeft: "5px solid #B71C1C",
          },
        }
      );
    } else if (
      error.response &&
      error.response.data &&
      error.response.data.message
    ) {
      toast.error(error.response.data.message, {
        style: {
          backgroundColor: "#1A1A1A",
          color: "#fff",
          borderLeft: "5px solid #B71C1C",
        },
      });
    } else {
      toast.error("Something went wrong. Please try again later.", {
        style: {
          backgroundColor: "#1A1A1A",
          color: "#fff",
          borderLeft: "5px solid #B71C1C",
        },
      });
    }
    console.error("Email submission error:", error);
    return false;
  }
};
