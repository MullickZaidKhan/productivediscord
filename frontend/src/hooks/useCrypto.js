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


  return useQuery({
    queryKey: ["publicKeys", userId],
    queryFn: async () => {


      const data = await getPublicKey(userId);
      
      

      return data;
    },
    enabled: !!userId,
  });
};