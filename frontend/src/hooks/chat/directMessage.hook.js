import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  sendDirectMessage,
  getDirectMessages,
} from "../../api/chat/directMessage.api";

export const useSendDirectMessage = () => {
  return useMutation({
    mutationFn: sendDirectMessage,
  });
};

export const usegetDirectMessages = (userId) => {
  return useQuery({
    queryKey: ["directMessages", userId],
    queryFn: () => getDirectMessages(userId),
    enabled: !!userId,
  });
};
