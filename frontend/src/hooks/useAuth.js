import { api } from "../api/axios.js";
import { useContext } from "react";
import { useMutation } from "@tanstack/react-query";
import { login, register, accesstoken, refreshtoken } from "../api/Auth.api.js";
import { AuthContext } from "../context/auth.context.jsx";
import { useQuery } from '@tanstack/react-query'
// export const useAuth = () => {
//     const { user, setUser } = useContext(AuthContext);
//     const handleLogin = async (username, password) => {
//         try {
//             const response = await api.login(username, password);
//             const { user } = response.data;
//             setUser(user);
//         } catch (error) {
//             console.error("Login failed:", error);
//         }
//     }
// }

// return { user, handleLogin };


export function useLogin() {


    return useMutation({
        mutationFn: login,
        onSuccess: (data) => {

            // Handle successful login, e.g., update context or local storage
            // console.log("Login successful:", data);


            // console.log("User set in context:", userData);
            // console.log("User set in context:", User);
        },
        onError: (error) => {
            // Handle login error, e.g., show error message
            console.error("Login failed:", error);
        }
    })
}

export function useRegister() {


    return useMutation({
        mutationFn: register,
        onSuccess: (data) => {

            // Handle successful login, e.g., update context or local storage
            // console.log("Login successful:", data);


            // console.log("User set in context:", userData);
            // console.log("User set in context:", User);
        },
        onError: (error) => {
            // Handle login error, e.g., show error message
            console.error("Login failed:", error);
        }
    })

}


export function useAccessToken() {
    return useQuery({
        queryKey: ['authUser'],
        queryFn: async () => {
            const response = await accesstoken();

            // Access the exact field from API (handling both spelling variations)
            const payload = response?.data?.payloadtofontend || response?.data?.payloadtofrontend;

            if (!payload) {
                throw new Error("No payload found in token response");
            }

            return payload;
        },
        retry: false,
        staleTime: 1000 * 60 * 5,
    });
}

