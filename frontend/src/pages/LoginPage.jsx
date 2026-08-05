import { useForm } from "react-hook-form";
import { useLogin } from "../hooks/useAuth";
import { useContext, useState } from "react";
import { AuthContext } from "../context/auth.context.jsx";
import { FaUserCircle } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useAccessToken } from "../hooks/useAuth.js";
import { motion } from "framer-motion";
import { staggerContainer, fadeInUp } from "../components/ui/motion.js";

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const navigate = useNavigate();
  const loginMutation = useLogin();

  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // UI-only, no auth logic involved

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
    <div className="min-h-screen w-full flex bg-[#090a0c]">
      {/* LEFT PANEL — decorative, matches reference */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "url('https://i.pinimg.com/1200x/02/c8/a0/02c8a00fddf15a80a75e6174cf6e92c2.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "brightness(-0.78)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(120deg, rgba(13,16,22,0.8) 0%, rgba(36,40,69,0.55) 45%, rgba(9,10,12,0.8) 100%)",
          }}
        />
        <div className="relative z-10 flex flex-col items-center justify-items-center-safe w-full px-12 text-center mt-10">
          <div className="flex items-center gap-2 mb-10">
            <span className="w-2.5 h-2.5 rounded-full border-2 border-white inline-block" />
            <span className="text-white font-semibold tracking-wide">
              YourApp
            </span>
          </div>

          <h2 className="text-3xl font-bold text-white mb-3">
            Welcome Back
          </h2>
          <p className="text-gray-200/80 text-sm mb-10 max-w-xs">
            Sign in to continue right where you left off.
          </p>

          {/* <div className="w-full max-w-xs space-y-3">
            <div className="flex items-center gap-3 rounded-2xl bg-white text-black px-4 py-3 text-left text-sm font-medium">
              <span className="w-5 h-5 rounded-full bg-black text-white text-xs flex items-center justify-center">
                1
              </span>
              Access your dashboard
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-white/10 text-white px-4 py-3 text-left text-sm font-medium">
              <span className="w-5 h-5 rounded-full bg-white/20 text-white text-xs flex items-center justify-center">
                2
              </span>
              Manage your projects
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-white/10 text-white px-4 py-3 text-left text-sm font-medium">
              <span className="w-5 h-5 rounded-full bg-white/20 text-white text-xs flex items-center justify-center">
                3
              </span>
              Collaborate with your team
            </div>
          </div> */}
        </div>
      </div>

      {/* RIGHT PANEL — form, same fields & logic as before */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-3 bg-[#111214]">
        <motion.div
          initial="hidden"
          animate="show"
          variants={staggerContainer(0.06)}
          className="w-full max-w-sm"
        >
          <motion.div variants={fadeInUp} className="mb-5">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Log In
            </h2>
            <p className="text-gray-400 mt-2 text-sm">
              Enter your details to access your account
            </p>
          </motion.div>

          {/* Decorative OAuth buttons — visual only, no handlers wired up */}
          <motion.div variants={fadeInUp} className="flex gap-3 mb-6">
            <button
              type="button"
              className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-[#36393e] bg-[#16181b] text-white text-sm py-2.5 hover:bg-[#23262a] transition"
            >
              <FcGoogle size={16} />
              Google
            </button>
            <button
              type="button"
              className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-[#36393e] bg-[#16181b] text-white text-sm py-2.5 hover:bg-[#23262a] transition"
            >
              <FaGithub size={16} />
              Github
            </button>
          </motion.div>

          <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-3">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-xs text-gray-500">Or</span>
            <div className="h-px flex-1 bg-white/10" />
          </motion.div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <motion.div variants={fadeInUp}>
              <label className="block text-gray-300 text-sm mb-1">
                Email Address
              </label>

              <input
                type="email"
                placeholder="eg. johnfrans@gmail.com"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Invalid email address",
                  },
                })}
                className={`w-full rounded-xl px-4 py-3 bg-[#16181b] text-white placeholder-gray-500 border outline-none transition ${
                  errors.email
                    ? "border-red-500"
                    : "border-[#23262a] focus:border-[#4752c4] focus:ring-4 focus:ring-[#4752c4]/25"
                }`}
              />

              {errors.email && (
                <p className="text-red-400 text-xs mt-2">
                  ⚠️ {errors.email.message}
                </p>
              )}
            </motion.div>

            {/* Password */}
            <motion.div variants={fadeInUp}>
              <label className="block text-gray-300 text-sm mb-1">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                  })}
                  className={`w-full rounded-xl px-4 py-3 pr-11 bg-[#16181b] text-white placeholder-gray-500 border outline-none transition ${
                    errors.password
                      ? "border-red-500"
                      : "border-[#23262a] focus:border-[#4752c4] focus:ring-4 focus:ring-[#4752c4]/25"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <AiOutlineEyeInvisible size={18} />
                  ) : (
                    <AiOutlineEye size={18} />
                  )}
                </button>
              </div>

              {errors.password ? (
                <p className="text-red-400 text-xs mt-2">
                  ⚠️ {errors.password.message}
                </p>
              ) : (
                <p className="text-gray-500 text-xs mt-2">
                  Must be at least 8 characters.
                </p>
              )}
            </motion.div>

            {/* Forgot Password */}
            <motion.div variants={fadeInUp} className="flex justify-end -mt-1">
              <a
                href="/forgot-password"
                className="text-sm text-gray-400 hover:text-[#6b76d9] transition-colors"
              >
                Forgot password?
              </a>
            </motion.div>

            {/* Login (server) error */}
            {loginError && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-2.5"
              >
                <p className="text-red-400 text-sm text-center">
                  ⚠️ {loginError}
                </p>
              </motion.div>
            )}

            {/* Button */}
            <motion.button
              variants={fadeInUp}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-[#4752c4] py-3.5 font-semibold text-white transition-shadow hover:bg-[#3b45a0] hover:shadow-[0_0_30px_rgba(71,82,196,.35)] disabled:opacity-60"
            >
              {isSubmitting ? "Logging in..." : "Sign In"}
            </motion.button>
          </form>

          {/* Bottom */}
          <motion.div
            variants={fadeInUp}
            className="mt-8 text-center text-sm text-gray-400"
          >
            Don't have an account?{" "}
            <a
              href="/register"
              className="text-[#4752c4] hover:text-[#6b76d9] transition-colors"
            >
              Sign Up
            </a>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;