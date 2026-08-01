import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, AlertCircle, Check, X, Loader2, ArrowLeft } from "lucide-react";
import { useRegister, checkUsernamehook } from "../hooks/useAuth.js";
import { motion, AnimatePresence } from "framer-motion";
import { staggerContainer, fadeInUp } from "../components/ui/motion.js";
import { useNavigate } from "react-router-dom";
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

const STEPS = [
  { id: 1, label: "About you" },
  { id: 2, label: "Username" },
  { id: 3, label: "Password" },
];

const RegisterPage = () => {
  const {
    register,
    reset,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = useForm();
const navigate = useNavigate();
  const registerMutation = useRegister();

  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [usernameChecked, setUsernameChecked] = useState("");
  const [errorusernameChecked, seterrorusernameChecked] = useState("");

  const { data, isLoading, error } = checkUsernamehook(usernameChecked);

  useEffect(() => {
    if (
      usernameChecked.length > 0 &&
      (usernameChecked.length < 5 || usernameChecked.length > 18)
    ) {
      seterrorusernameChecked(
        "Username must be between 5 and 18 characters long."
      );
    } else {
      seterrorusernameChecked("");
    }
  }, [usernameChecked]);

  const passwordValue = watch("password", "");
  const usernameValue = watch("username", "");
  const strength = getPasswordStrength(passwordValue);

  // Derive live username status from the availability-check hook's response.
  // Priority: local length validation > loading > hook error > server result
  const usernameStatus = !usernameValue
    ? undefined
    : errorusernameChecked
      ? "invalid"
      : isLoading
        ? "checking"
        : error
          ? "error"
          : data && "available" in data
            ? (data.available ? "available" : "taken")
            : undefined;

  const usernameMessage = errorusernameChecked
    ? errorusernameChecked
    : error
      ? "Couldn't check username right now."
      : data?.message || "";

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

  // Which fields belong to which step, so we only validate what's on screen
  const fieldsForStep = {
    1: ["name", "email"],
    2: ["username"],
    3: ["password"],
  };

  const goNext = async () => {
    const valid = await trigger(fieldsForStep[step]);
    if (!valid) return;

    // Block advancing past the username step if it's known taken/invalid
    if (step === 2 && (usernameStatus === "taken" || usernameStatus === "invalid")) {
      return;
    }

    setDirection(1);
    setStep((s) => Math.min(s + 1, STEPS.length));
  };

  const goBack = () => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 1));
  };

  const onSubmit = (data) => {
    // Guard against submitting a username we already know is taken/invalid
    if (usernameStatus === "taken" || usernameStatus === "invalid") return;

    registerMutation.mutate(data, {
      onSuccess: ({ data }) => {
        reset();
        setUsernameChecked("");
        setStep(1);
window.location.href = "/";
      },
    });
  };

  const slideVariants = {
    enter: (dir) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? -40 : 40, opacity: 0 }),
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat px-4 py-10"
      style={{
        backgroundImage:
          "url('https://i.pinimg.com/1200x/99/d3/97/99d397ed62159b5a7da6b2d8c7384a86.jpg')",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-[#040817]/70 backdrop-blur-[2px]" />

      {/* Register Card */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={staggerContainer(0.06)}
        className="relative z-10 w-full max-w-md rounded-[30px] border border-white/10 bg-[#0b1327]/60 p-6 sm:p-8 shadow-2xl shadow-black/40 backdrop-blur-md"
      >
        {/* Heading */}
        <motion.div variants={fadeInUp} className="text-center mb-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Create Account
          </h2>
          <p className="text-gray-400 mt-2 text-base sm:text-lg">
            Join us today — it only takes a minute
          </p>
        </motion.div>

        {/* Step indicator */}
        <motion.div variants={fadeInUp} className="flex items-center justify-center gap-2 mb-8">
          {STEPS.map((s) => (
            <div key={s.id} className="flex items-center gap-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  s.id === step
                    ? "w-6 bg-blue-500"
                    : s.id < step
                      ? "w-2 bg-blue-500/60"
                      : "w-2 bg-white/15"
                }`}
              />
            </div>
          ))}
        </motion.div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
          <AnimatePresence mode="wait" custom={direction}>
            {/* Step 1 — Name + Email */}
            {step === 1 && (
              <motion.div
                key="step1"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25 }}
                className="space-y-5"
              >
                {/* Full Name */}
                <div>
                  <label htmlFor="name" className="block text-gray-300 text-sm mb-2">
                    Full Name
                  </label>
                  <input
                    id="name"
                    {...register("name", {
                      required: "Name is required",
                      minLength: { value: 2, message: "Name must be at least 2 characters" },
                      maxLength: { value: 50, message: "Name cannot exceed 50 characters" },
                    })}
                    type="text"
                    placeholder="John Doe"
                    autoComplete="name"
                    aria-invalid={errors.name ? "true" : "false"}
                    className={`w-full rounded-full px-5 py-3 bg-[#0b1327ad] text-white placeholder-gray-500 border outline-none transition ${
                      errors.name
                        ? "border-red-500"
                        : "border-blue-500/30 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20"
                    }`}
                  />
                  {errors.name && (
                    <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                      <AlertCircle className="h-3.5 w-3.5" /> {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-gray-300 text-sm mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: "Invalid email address",
                      },
                    })}
                    type="email"
                    placeholder="name@company.com"
                    autoComplete="email"
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

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  type="button"
                  onClick={goNext}
                  className="w-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-500 py-3.5 font-semibold text-white transition-shadow hover:shadow-[0_0_30px_rgba(59,130,246,.5)]"
                >
                  Next
                </motion.button>
              </motion.div>
            )}

            {/* Step 2 — Username */}
            {step === 2 && (
              <motion.div
                key="step2"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25 }}
                className="space-y-5"
              >
                <div>
                  <label htmlFor="username" className="block text-gray-300 text-sm mb-2">
                    Username
                  </label>
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
                      onChange={(e) => setUsernameChecked(e.target.value)}
                      placeholder="johndoe"
                      autoComplete="off"
                      aria-invalid={errors.username || errorusernameChecked ? "true" : "false"}
                      className={`w-full rounded-full pl-9 pr-11 py-3 bg-[#0b1327ad] text-white placeholder-gray-500 border outline-none transition ${
                        errors.username || errorusernameChecked || usernameStatus === "taken"
                          ? "border-red-500"
                          : usernameStatus === "available"
                            ? "border-green-500"
                            : "border-blue-500/30 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20"
                      }`}
                    />

                    {/* Right-side status icon — spinner / check / x */}
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
                        className={`text-xs mt-2 flex items-center gap-1 ${
                          usernameStatus === "available"
                            ? "text-green-400"
                            : usernameStatus === "error"
                              ? "text-gray-400"
                              : "text-red-400"
                        }`}
                      >
                        {usernameStatus === "available" && <Check className="h-3.5 w-3.5" />}
                        {(usernameStatus === "taken" || usernameStatus === "invalid") && (
                          <AlertCircle className="h-3.5 w-3.5" />
                        )}
                        {usernameMessage}
                      </p>
                    )
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={goBack}
                    aria-label="Back"
                    className="flex items-center justify-center rounded-full px-4 py-3.5 border border-white/15 text-gray-300 hover:bg-white/5 transition-colors"
                  >
                    <ArrowLeft className="h-4.5 w-4.5" />
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.96 }}
                    type="button"
                    onClick={goNext}
                    disabled={usernameStatus === "taken" || usernameStatus === "invalid"}
                    className="flex-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-500 py-3.5 font-semibold text-white transition-shadow hover:shadow-[0_0_30px_rgba(59,130,246,.5)] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-none"
                  >
                    Next
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Step 3 — Password */}
            {step === 3 && (
              <motion.div
                key="step3"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25 }}
                className="space-y-5"
              >
                <div>
                  <label htmlFor="password" className="block text-gray-300 text-sm mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
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
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-2.5 flex items-start gap-2"
                  >
                    <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-red-400" />
                    <span className="text-red-400 text-sm">{getErrorMessage(registerMutation.error)}</span>
                  </motion.div>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={goBack}
                    aria-label="Back"
                    className="flex items-center justify-center rounded-full px-4 py-3.5 border border-white/15 text-gray-300 hover:bg-white/5 transition-colors"
                  >
                    <ArrowLeft className="h-4.5 w-4.5" />
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.96 }}
                    type="submit"
                    disabled={registerMutation.isPending}
                    className="flex-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-500 py-3.5 font-semibold text-white transition-shadow hover:shadow-[0_0_30px_rgba(59,130,246,.5)] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-none"
                  >
                    {registerMutation.isPending ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Creating account...
                      </span>
                    ) : (
                      "Sign up"
                    )}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>

        {/* Bottom */}
        <motion.div variants={fadeInUp} className="mt-8 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <a href="/login" className="text-blue-400 hover:text-blue-300 transition-colors">
            Sign In
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;