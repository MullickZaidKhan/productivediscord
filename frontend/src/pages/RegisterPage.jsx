import { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, AlertCircle, Check, X, Loader2 } from "lucide-react";
import { useRegister, checkUsernameEX } from "../hooks/useAuth.js";

// Calculates a simple password strength score based on length and character variety
const getPasswordStrength = (password) => {
  if (!password) {
    return { label: "", score: 0, color: "" };
  }

  if (password.length < 8) {
    return { label: "Too short", score: 0, color: "bg-red-500" };
  }

  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  if (score <= 2) {
    return { label: "Weak", score: 1, color: "bg-red-500" };
  } else if (score <= 3) {
    return { label: "Medium", score: 2, color: "bg-yellow-500" };
  } else {
    return { label: "Strong", score: 3, color: "bg-green-500" };
  }
};

const RegisterPage = () => {
  const {
    register,
    reset,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const registerMutation = useRegister();

  const [showPassword, setShowPassword] = useState(false);

  const passwordValue = watch("password", "");
  const usernameValue = watch("username", "");
  const strength = getPasswordStrength(passwordValue);

  // Live availability check — debounced inside the hook itself
  const { status: usernameStatus, message: usernameMessage } = checkUsernameEX(usernameValue);

  // Pull a human-readable message out of whatever shape the backend error takes
  const getErrorMessage = (error) => {
    const status = error?.response?.status;
    const serverMessage = error?.response?.data?.message;

    if (status === 401 || status === 403) {
      return "Wrong credentials. Please double-check your details and try again.";
    }

    if (status === 409) {
      return serverMessage || "That username or email is already taken.";
    }

    return serverMessage || "Registration failed. Please try again.";
  };

  const onSubmit = (data) => {
    // Guard against submitting a username we already know is taken/invalid
    if (usernameStatus === "taken" || usernameStatus === "invalid") return;

    registerMutation.mutate(data, {
      onSuccess: ({ data }) => {
        reset();
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

      {/* Register Card */}
      <div className="relative z-10 w-full max-w-md rounded-[30px] p-6">
        {/* Heading */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-white">Create Account</h2>
          <p className="text-gray-400 mt-2 text-lg">
            Join us today — it only takes a minute
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
          {/* Username */}
          <div>
            <label className="block text-gray-300 text-sm mb-2">Username</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-5 text-gray-500 pointer-events-none">
                @
              </span>
              <input
                id="username"
                {...register("username", {
                  required: "Username is required",
                  maxLength: { value: 20, message: "Username cannot exceed 20 characters" },
                })}
                type="text"
                placeholder="johndoe"
                autoComplete="off"
                aria-invalid={errors.username ? "true" : "false"}
                className={`w-full rounded-full pl-9 pr-11 py-3 bg-[#0b1327ad] text-white placeholder-gray-500 border outline-none transition ${
                  errors.username || usernameStatus === "taken"
                    ? "border-red-500"
                    : usernameStatus === "available"
                    ? "border-green-500"
                    : "border-blue-500/30 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20"
                }`}
              />

              {/* Right-side status icon — spinner / check / x, just like Instagram's signup form */}
              <span className="absolute inset-y-0 right-0 flex items-center pr-4">
                {usernameStatus === "checking" && (
                  <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />
                )}
                {usernameStatus === "available" && (
                  <Check className="h-4.5 w-4.5 text-green-500" />
                )}
                {(usernameStatus === "taken" || usernameStatus === "invalid") && (
                  <X className="h-4.5 w-4.5 text-red-500" />
                )}
              </span>
            </div>

            {/* Form-level required/maxLength error takes priority over the live-check message */}
            {errors.username ? (
              <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" /> {errors.username.message}
              </p>
            ) : (
              usernameMessage && (
                <p
                  className={`text-xs mt-2 ${
                    usernameStatus === "available"
                      ? "text-green-400"
                      : usernameStatus === "error"
                      ? "text-gray-400"
                      : "text-red-400"
                  }`}
                >
                  {usernameMessage}
                </p>
              )
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-300 text-sm mb-2">Email Address</label>
            <input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Invalid email address",
                },
              })}
              type="email"
              placeholder="name@company.com"
              aria-invalid={errors.email ? "true" : "false"}
              className={`w-full rounded-full px-5 py-3 bg-[#0b1327ad] text-white placeholder-gray-500 border outline-none transition ${
                errors.email
                  ? "border-red-500"
                  : "border-blue-500/30 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20"
              }`}
            />
            {errors.email && (
              <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" /> {errors.email.message}
              </p>
            )}
          </div>

          {/* Password with show/hide toggle */}
          <div>
            <label className="block text-gray-300 text-sm mb-2">Password</label>
            <div className="relative">
              <input
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 8, message: "Password must be at least 8 characters" },
                })}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                aria-invalid={errors.password ? "true" : "false"}
                className={`w-full rounded-full px-5 py-3 pr-11 bg-[#0b1327ad] text-white placeholder-gray-500 border outline-none transition ${
                  errors.password
                    ? "border-red-500"
                    : "border-blue-500/30 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-400 hover:text-blue-400 transition-colors"
              >
                {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
              </button>
            </div>

            {errors.password && (
              <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" /> {errors.password.message}
              </p>
            )}

            {/* Password strength meter — only shows once user starts typing and no length error */}
            {!errors.password && passwordValue && (
              <div className="mt-2">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className={`h-1.5 flex-1 rounded-full transition-colors ${
                        i < strength.score ? strength.color : "bg-gray-600/50"
                      }`}
                    />
                  ))}
                </div>
                <p
                  className={`text-xs mt-1 ${
                    strength.score === 1
                      ? "text-red-400"
                      : strength.score === 2
                      ? "text-yellow-400"
                      : strength.score === 3
                      ? "text-green-400"
                      : "text-gray-400"
                  }`}
                >
                  {strength.label}
                </p>
              </div>
            )}
          </div>

          {/* Backend / credentials error */}
          {registerMutation.isError && (
            <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-2.5 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-red-400" />
              <span className="text-red-400 text-sm">{getErrorMessage(registerMutation.error)}</span>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={registerMutation.isPending || usernameStatus === "taken" || usernameStatus === "invalid"}
            className="w-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-500 py-3.5 font-semibold text-white transition hover:shadow-[0_0_30px_rgba(59,130,246,.5)] hover:scale-[1.02] active:scale-95 disabled:opacity-60"
          >
            {registerMutation.isPending ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Creating account...
              </span>
            ) : (
              "Sign up"
            )}
          </button>
        </form>

        {/* Bottom */}
        <div className="mt-8 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <a href="/login" className="text-blue-400 hover:text-blue-300">
            Sign In
          </a>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;