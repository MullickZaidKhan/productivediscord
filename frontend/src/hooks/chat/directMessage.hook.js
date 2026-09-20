import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  sendDirectMessage,
  getDirectMessages,
  getTalkedUsers,
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

// ====================================================== // GET USERS I HAVE TALKED TO // ====================================================== 
export const useGetTalkedUsers = () => {
  return useQuery({
    queryKey: ["talkedUsers"],
    queryFn: getTalkedUsers,
  });
}