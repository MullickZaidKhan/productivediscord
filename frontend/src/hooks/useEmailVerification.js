// ../hooks/useEmailVerification.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  sendVerificationOtp,
  verifyEmailOtp,
  resendVerificationOtp,
} from "../api/authVerificationApi";

// Send OTP -> mutateAsync({ email })
export const useSendVerificationOtp = () =>
  useMutation({
    mutationFn: (payload) => sendVerificationOtp(payload),
  });

// Verify OTP -> mutateAsync({ email, otp })
export const useVerifyEmailOtp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => verifyEmailOtp(payload),
    onSuccess: () => {
      // refresh auth/user data so the verified status updates
      queryClient.invalidateQueries({ queryKey: ["userinfo"] });
    },
  });
};

// Resend OTP -> mutateAsync({ email })
export const useResendVerificationOtp = () =>
  useMutation({
    mutationFn: (payload) => resendVerificationOtp(payload),
  });