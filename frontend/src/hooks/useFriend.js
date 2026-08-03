import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriendRequests,
  getFriends,
  removeFriend,
  getPendingFriendRequests,
  getSentFriendRequests,
} from "../api/friendApi";

const FRIENDS_KEY = ["friends"];
const REQUESTS_KEY = ["friendRequests"];
const SENT_REQUESTS_KEY = ["sentFriendRequests"];

/* -------------------- Queries -------------------- */

export const useFriends = () => {
  return useQuery({
    queryKey: FRIENDS_KEY,
    queryFn: async () => {
      const response = await getFriends();
      return response.data.payload;
    },
  });
};

export const useFriendRequests = () => {
  return useQuery({
    queryKey: REQUESTS_KEY,
    queryFn: async () => {
      const response = await getFriendRequests();
      return response.data.payload;
    },
  });
};

/* -------------------- Mutations -------------------- */

export const useSendFriendRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sendFriendRequest,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: REQUESTS_KEY,
      });
    },
  });
};

export const useAcceptFriendRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: acceptFriendRequest,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: REQUESTS_KEY,
      });

      queryClient.invalidateQueries({
        queryKey: FRIENDS_KEY,
      });
    },
  });
};

export const useRejectFriendRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: rejectFriendRequest,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: REQUESTS_KEY,
      });
    },
  });
};

export const useRemoveFriend = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeFriend,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: FRIENDS_KEY,
      });
    },
  });
};

export const usePendingFriendRequests = () => {
  return useQuery({
    queryKey: ["pendingFriendRequests"],
    queryFn: async () => {
      const response = await getPendingFriendRequests();
      return response.data.payload;
    },
    staleTime: 1000 * 60,
  });
};

export const useSentFriendRequests = () => {
  return useQuery({
    queryKey: SENT_REQUESTS_KEY,
    queryFn: async () => {
      const response = await getSentFriendRequests();
      return response.data.payload;
    },
    staleTime: 1000 * 60,
  });
};