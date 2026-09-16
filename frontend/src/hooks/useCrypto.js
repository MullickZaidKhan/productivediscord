import { useMutation, useQuery } from "@tanstack/react-query";
import {
  savePublicKey,
  getPublicKey,
} from "../api/crypto.api";

export const useSavePublicKey = () => {
  return useMutation({
    mutationFn: savePublicKey,
  });
};

// export const useGetPublicKey = (userId, deviceId) =>
//   useQuery({
//     queryKey: ["publicKey", userId, deviceId],
//     queryFn: () => getPublicKey(userId, deviceId),
//     enabled: !!userId && !!deviceId,
//   });

export const useGetPublicKeys = (userId) => {
  console.log("🔎 useGetPublicKeys form Hook called with userId:", userId);

  return useQuery({
    queryKey: ["publicKeys", userId],
    queryFn: async () => {
      console.log("🌐 Fetching public keys for:", userId);

      const data = await getPublicKey(userId);

      console.log("📦 Public keys API response:", data);

      return data;
    },
    enabled: !!userId,
  });
};