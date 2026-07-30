import { useForm } from "react-hook-form";
import { useLogin } from "../hooks/useAuth";
import { useContext, useState } from "react";
import { AuthContext } from "../context/auth.context.jsx";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAccessToken } from "../hooks/useAuth.js";
const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
const navigate = useNavigate();
  const loginMutation = useLogin();

  const [loginError, setLoginError] = useState("");

  const onSubmit = (formData) => {
    setLoginError("");

    loginMutation.mutate(formData, {
      onSuccess: ({ data }) => {
      navigate("/");
      },
      onError: (err) => {
        console.log(err);
        const message =
          err?.response?.data?.message ||
          err?.message ||
          "Invalid email or password. Please try again.";
        setLoginError(message);
      },
    });
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat px-4"
      style={{
        backgroundImage:
          "url('https://i.pinimg.com/1200x/99/d3/97/99d397ed62159b5a7da6b2d8c7384a86.jpg')",
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-[#040817]/70 backdrop-blur-[2px]" />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md rounded-[30px]  p-6">
        {/* Heading */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-white">Welcome Back</h2>

          <p className="text-gray-400 mt-2 text-lg">
            Please enter your details to sign in
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-gray-300 text-sm mb-2">
              Email Address
            </label>

            <input
              type="email"
              placeholder="name@company.com"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Invalid email address",
                },
              })}
              className={`w-full rounded-full px-5 py-3 bg-[#0b1327ad] text-white placeholder-gray-500 border outline-none transition ${
                errors.email
                  ? "border-red-500"
                  : "border-blue-500/30 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20"
              }`}
            />

            {errors.email && (
              <p className="text-red-400 text-xs mt-2">
                ⚠️ {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-300 text-sm mb-2">
              Password
            </label>

            <input
              type="password"
              placeholder="••••••••"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              })}
              className={`w-full rounded-full px-5 py-3 bg-[#0b1327ad] text-white placeholder-gray-500 border outline-none transition ${
                errors.password
                  ? "border-red-500"
                  : "border-blue-500/30 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20"
              }`}
            />

            {errors.password && (
              <p className="text-red-400 text-xs mt-2">
                ⚠️ {errors.password.message}
              </p>
            )}
          </div>

          {/* Forgot Password */}
          <div className="flex justify-end">
            <a href="/forgot-password" className="text-sm text-gray-400 hover:text-blue-400">
              Forgot password?
            </a>
          </div>

          {/* Login (server) error */}
          {loginError && (
            <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-2.5">
              <p className="text-red-400 text-sm text-center">
                ⚠️ {loginError}
              </p>
            </div>
          )}

          {/* Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-500 py-3.5 font-semibold text-white transition hover:shadow-[0_0_30px_rgba(59,130,246,.5)] hover:scale-[1.02] active:scale-95 disabled:opacity-60"
          >
            {isSubmitting ? "Logging in..." : "Sign In"}
          </button>
        </form>

        {/* Bottom */}
        <div className="mt-8 text-center text-sm text-gray-400">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-400 hover:text-blue-300">
            Sign Up
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;