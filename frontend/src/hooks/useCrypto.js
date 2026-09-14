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

export const useGetPublicKey = (userId, deviceId) =>
  useQuery({
    queryKey: ["publicKey", userId, deviceId],
    queryFn: () => getPublicKey(userId, deviceId),
    enabled: !!userId && !!deviceId,
  });