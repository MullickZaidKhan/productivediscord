import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllBackgrounds,
  getUserBackground,
  setUserBackground,
} from "../api/background.api";

// Get all available backgrounds
export const useGetAllBackgrounds = () => {
  return useQuery({
    queryKey: ["backgrounds"],
    queryFn: getAllBackgrounds,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

// Get logged-in user's selected background
export const useGetUserBackground = () => {
  return useQuery({
    queryKey: ["user-background"],
    queryFn: getUserBackground,
  });
};

// Update logged-in user's selected background
export const useSetUserBackground = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: setUserBackground,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user-background"],
      });
    },
  });
};