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

export const useGetPublicKey = (userId) => {
  return useQuery({
    queryKey: ["publicKey", userId],
    queryFn: () => getPublicKey(userId),
    enabled: !!userId,
  });
};