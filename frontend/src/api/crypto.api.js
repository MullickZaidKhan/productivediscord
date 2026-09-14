import { api } from "../api/axios";

export const savePublicKey = async ({ publicKey, deviceId }) => {

  const response = await api.post("auth/public-key", {
    publicKey,
    deviceId,
  });

  return response.data;
};

export const getPublicKey = async (userId) => {
  const response = await api.get(`auth/public-key/${userId}`);

  return response.data;
};