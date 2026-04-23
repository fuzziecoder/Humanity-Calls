import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const fetchFormAssets = async () => {
  const response = await axios.get(`${API_URL}/form-assets`);
  return response.data || {};
};

export const uploadFormAsset = async (token, { key, label, file }) => {
  const formData = new FormData();
  formData.append("key", key);
  if (label) formData.append("label", label);
  formData.append("image", file);

  const response = await axios.post(`${API_URL}/form-assets`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
