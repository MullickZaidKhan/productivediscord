import { api } from "../api/axios.js";
import { useMutation } from "@tanstack/react-query";
import {
  login,
  register,
  accesstoken,
  refreshtoken,
  checkUsername,
  logout,
  getLoginDevices,
} from "../api/Auth.api.js";
// import { AuthContext } from "../context/auth.context.jsx";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { setLoggedIn, setLoggedOut } from "../redux/authSlice.js";
import { useSelector, useDispatch } from "react-redux";

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      // Handle successful login, e.g., update context or local storage
      // console.log("Login successful:", data);
      queryClient.invalidateQueries({ queryKey: ["authUser"] });

      // console.log("User set in context:", userData);
      // console.log("User set in context:", User);
    },
    onError: (error) => {
      // Handle login error, e.g., show error message
      console.error("Login failed:", error);
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      // Handle successful login, e.g., update context or local storage
      console.log("Register: ", data);

      // console.log("User set in context:", userData);
      // console.log("User set in context:", User);
    },
    onError: (error) => {
      // Handle login error, e.g., show error message
      console.error("Login failed:", error);
    },
  });
}

export function useAccessToken() {
  return useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const response = await accesstoken();

      // Access the exact field from API (handling both spelling variations)
      const payload =
        response?.data?.payloadtofontend || response?.data?.payloadtofrontend;

      if (!payload) {
        throw new Error("No payload found in token response");
      }

      return payload;
    },
    retry: false,
    staleTime: 1000 * 60 * 5,
  });
}
export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["authUser"] });
    },
    onError: () => {
      queryClient.removeQueries({ queryKey: ["authUser"] });
    },
  });
}

export const checkUsernamehook = (username) => {
  const [debouncedUsername, setDebouncedUsername] = useState(username);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedUsername(username);
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [username]);

  return useQuery({
    queryKey: ["checkUsername", debouncedUsername],
    queryFn: async () => {
      try {
        const response = await checkUsername(debouncedUsername);
        return response.data;
      } catch (error) {
        const response = error?.response;
        if (response?.status === 400) {
          return {
            available: false,
            message: response.data?.message || "Username is unavailable",
            success: response.data?.success ?? false,
          };
        }

        throw error;
      }
    },
    enabled: debouncedUsername?.length >= 5,
    retry: false,
  });
};

export const useAuthStatus = () => {
  const dispatch = useDispatch();
  const { data, isLoading, isError, isSuccess } = useAccessToken();
  console.log(data, "from useAuthStatus hook");
  useEffect(() => {
    if (isSuccess) dispatch(setLoggedIn(data));
    if (isError) dispatch(setLoggedOut());
  }, [isSuccess, isError, data, dispatch]);

  if (isLoading) return "loading";
  if (isError || !data) return "unauthenticated";
  return "authenticated";
};

export const useLoginDevices = () => {
  return useQuery({ queryKey: ["loginDevices"], queryFn: getLoginDevices });
};
