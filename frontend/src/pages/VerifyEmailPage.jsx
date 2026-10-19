import { useEffect, useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAuthStatus } from "../hooks/useAuth"; // <- adjust path
import {
  useSendVerificationOtp,
  useVerifyEmailOtp,
  useResendVerificationOtp,
} from "../hooks/useEmailVerification"; // <- adjust path

const OTP_LENGTH = 6;
const OTP_EXPIRY_SECONDS = 60; // matches OTP_EXPIRY_MS on the backend
const RESEND_COOLDOWN_SECONDS = 30; // matches OTP_COOLDOWN_MS on the backend

const parseError = (e) => {
  const d = e?.response?.data ?? e?.data ?? {};
  return {
    message: d.message || e?.message || "Something went wrong. Please try again.",
    retryAfterSeconds: d.retryAfterSeconds,
    attemptsRemaining: d.attemptsRemaining,
    status: e?.response?.status ?? e?.status,
  };
};

const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

// Discord palette
const C = {
  card: "bg-[#313338]/80",
  input: "bg-[#1e1f22]",
  text: "text-[#f2f3f5]",
  muted: "text-[#b5bac1]",
  faint: "text-[#949ba4]",
  link: "text-[#00a8fc]",
  danger: "text-[#f23f42]",
};
const backgroundImage =
  "https://i.pinimg.com/1200x/a5/3d/d9/a53dd9dc2ca234eb150596f6f91b9315.jpg";

const primaryBtn =
  "flex h-[44px] w-full items-center justify-center gap-2 rounded-[3px] bg-[#5865f2] text-[16px] font-medium text-white transition-colors hover:bg-[#4752c4] active:bg-[#3c45a5] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-[#5865f2] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00a8fc]";

const labelCls = "block text-left text-xs font-bold uppercase tracking-wide";

export default function VerifyEmailPage() {
  const navigate = useNavigate();
  const status = useAuthStatus(); // also hydrates Redux userinfo on refresh

  // ---- email comes from Redux ----
  const userinfo = useSelector((state) => state.authinfoSlice.userinfo);
  const email = (userinfo?.email ?? userinfo?.user?.email ?? "").trim().toLowerCase();

  const sendOtp = useSendVerificationOtp();
  const verifyOtp = useVerifyEmailOtp();
  const resendOtp = useResendVerificationOtp();

  const [step, setStep] = useState("start"); // start | otp | blocked | success
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState("");
  const [attemptsLeft, setAttemptsLeft] = useState(null);
  const [shake, setShake] = useState(false);

  const [cooldown, setCooldown] = useState(0);
  const [expiresIn, setExpiresIn] = useState(0);
  const [blockedFor, setBlockedFor] = useState(0);
  const [blockedMsg, setBlockedMsg] = useState("");

  const inputs = useRef([]);
  const loading = [sendOtp, verifyOtp, resendOtp].some((m) => m.isPending ?? m.isLoading);
  const verifying = verifyOtp.isPending ?? verifyOtp.isLoading;
  const resending = resendOtp.isPending ?? resendOtp.isLoading;
  const code = otp.join("");
  const expired = step === "otp" && expiresIn <= 0;

  useEffect(() => {
    const t = setInterval(() => {
      setCooldown((c) => Math.max(0, c - 1));
      setExpiresIn((c) => Math.max(0, c - 1));
      setBlockedFor((c) => Math.max(0, c - 1));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (step === "blocked" && blockedFor === 0) {
      setStep("start");
      setError("");
    }
  }, [blockedFor, step]);

  // go to "/" after the success screen; hard reload is the fallback
  useEffect(() => {
    if (step !== "success") return;
    const t1 = setTimeout(() => navigate("/", { replace: true }), 1500);
    const t2 = setTimeout(() => {
      if (window.location.pathname !== "/") window.location.replace("/");
    }, 3000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [step, navigate]);

  // focus first box when the OTP step opens
  useEffect(() => {
    if (step === "otp") setTimeout(() => inputs.current[0]?.focus(), 60);
  }, [step]);

  // ---- route guards (after all hooks) ----
  // Skipped on the success screen so the refetch can't interrupt it.
  if (step !== "success") {
    if (status === "loading") return <FullScreen><Spinner big /></FullScreen>;
    if (status === "unauthenticated") return <Navigate to="/login" replace />;
    if (status === "authenticated") return <Navigate to="/" replace />;
  }

  const fail = (msg) => {
    setError(msg);
    setShake(true);
    setTimeout(() => setShake(false), 450);
  };

  const clearBoxes = () => {
    setOtp(Array(OTP_LENGTH).fill(""));
    setTimeout(() => inputs.current[0]?.focus(), 100);
  };

  const block = (seconds, message) => {
    setBlockedFor(seconds || 1800);
    setBlockedMsg(message);
    setStep("blocked");
  };

  const requestCode = async (mutation) => {
    if (!email) return fail("We couldn't find your email. Please log in again.");
    setError("");
    try {
      const res = await mutation.mutateAsync({ email });
      const message = res?.message ?? res?.data?.message ?? "";
      if (/already verified/i.test(message)) return setStep("success");

      setStep("otp");
      setAttemptsLeft(null);
      setCooldown(RESEND_COOLDOWN_SECONDS);
      setExpiresIn(OTP_EXPIRY_SECONDS);
      clearBoxes();
    } catch (e) {
      const { message, retryAfterSeconds, status: httpStatus } = parseError(e);
      if (httpStatus === 429) {
        if (retryAfterSeconds && retryAfterSeconds <= RESEND_COOLDOWN_SECONDS) {
          setCooldown(retryAfterSeconds);
          if (step === "start") setStep("otp");
          fail(message);
        } else {
          block(retryAfterSeconds, message);
        }
      } else {
        fail(message);
      }
    }
  };

const submitOtp = async (value = code) => {
  if (loading) return;
  if (value.length !== OTP_LENGTH)
    return fail("Enter the full 6-digit code.");
  if (expired) return fail("This code has expired. Request a new one.");
  setError("");
  try {
    await verifyOtp.mutateAsync({ email, otp: value });
    setStep("success");
    // not tied to the component, so it still runs if the page re-mounts
    setTimeout(() => window.location.replace("/"), 1200);
  } catch (e) {
    const {
      message,
      retryAfterSeconds,
      attemptsRemaining,
      status: s,
    } = parseError(e);
    if (s === 429) return block(retryAfterSeconds, message);
    if (typeof attemptsRemaining === "number")
      setAttemptsLeft(attemptsRemaining);
    fail(message);
    clearBoxes();
  }
};

  const handleChange = (i, v) => {
    if (!/^\d?$/.test(v)) return;
    const next = [...otp];
    next[i] = v;
    setOtp(next);
    setError("");
    if (v && i < OTP_LENGTH - 1) inputs.current[i + 1]?.focus();
    if (next.every(Boolean)) submitOtp(next.join(""));
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) inputs.current[i - 1]?.focus();
    if (e.key === "ArrowLeft" && i > 0) inputs.current[i - 1]?.focus();
    if (e.key === "ArrowRight" && i < OTP_LENGTH - 1) inputs.current[i + 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!text) return;
    const next = Array(OTP_LENGTH).fill("");
    text.split("").forEach((c, i) => (next[i] = c));
    setOtp(next);
    inputs.current[Math.min(text.length, OTP_LENGTH - 1)]?.focus();
    if (text.length === OTP_LENGTH) submitOtp(text);
  };

  const expiryPct = (expiresIn / OTP_EXPIRY_SECONDS) * 100;

  return (
    <FullScreen backgroundImage={backgroundImage}>
      <style>{`
        @keyframes shake { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-7px)} 40%,80%{transform:translateX(7px)} }
        @keyframes pop { 0%{transform:scale(.5);opacity:0} 70%{transform:scale(1.1)} 100%{transform:scale(1);opacity:1} }
        @keyframes rise { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .anim-shake{animation:shake .4s}
        .anim-pop{animation:pop .45s ease-out both}
        .anim-rise{animation:rise .3s ease-out both}
        @media (prefers-reduced-motion: reduce){ .anim-shake,.anim-pop,.anim-rise{animation:none} }
      `}</style>

      <div
        className={`w-full max-w-[480px] rounded-[5px] ${C.card} p-6 shadow-[0_2px_10px_rgba(0,0,0,.2)] backdrop-blur-sm sm:p-8 ${
          shake ? "anim-shake" : ""
        }`}
      >
        {/* ---------- START ---------- */}
        {step === "start" && (
          <div className="anim-rise text-center">
            <IconCircle><MailIcon /></IconCircle>
            <h1 className={`mt-5 text-2xl font-semibold ${C.text}`}>Verify your email</h1>
            <p className={`mt-2 text-base ${C.muted}`}>
              We'll send a 6-digit verification code to your email address.
            </p>

            <div className="mt-6">
              <label className={`${labelCls} ${C.muted}`}>Email</label>
              <div className={`mt-2 truncate rounded-[3px] ${C.input} px-3 py-[10px] text-left text-base ${C.text}`}>
                {email || "—"}
              </div>
            </div>

            {error && <p className={`mt-2 text-left text-sm ${C.danger}`}>{error}</p>}

            <button
              onClick={() => requestCode(sendOtp)}
              disabled={loading || !email}
              className={`${primaryBtn} mt-5`}
            >
              {loading && <Spinner />}
              {loading ? "Sending..." : "Send verification code"}
            </button>
          </div>
        )}

        {/* ---------- OTP ---------- */}
        {step === "otp" && (
          <div className="anim-rise text-center">
            <IconCircle><LockIcon /></IconCircle>
            <h1 className={`mt-5 text-2xl font-semibold ${C.text}`}>Enter your code</h1>
            <p className={`mt-2 text-base ${C.muted}`}>
              We sent a 6-digit code to{" "}
              <span className={`break-all font-medium ${C.text}`}>{email}</span>
            </p>

            <label className={`${labelCls} mb-2 mt-6 ${error ? C.danger : C.muted}`}>
              Verification code <span className={C.danger}>*</span>
              {error && (
                <span className="font-normal normal-case italic">
                  {" "}- {error}
                  {typeof attemptsLeft === "number" &&
                    ` ${attemptsLeft} attempt${attemptsLeft === 1 ? "" : "s"} remaining.`}
                </span>
              )}
            </label>

            <div className="flex justify-between gap-1.5 sm:gap-2" onPaste={handlePaste}>
              {otp.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => (inputs.current[i] = el)}
                  value={d}
                  inputMode="numeric"
                  maxLength={1}
                  disabled={loading}
                  aria-label={`Digit ${i + 1}`}
                  autoComplete={i === 0 ? "one-time-code" : "off"}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  onFocus={(e) => e.target.select()}
                  className={`h-14 w-full min-w-0 rounded-[3px] border-2 ${C.input} text-center text-2xl font-semibold ${C.text} caret-transparent outline-none transition-colors disabled:opacity-60 ${
                    error
                      ? "border-[#f23f42]"
                      : d
                      ? "border-[#4e5058]"
                      : "border-transparent"
                  } focus:border-[#00a8fc]`}
                />
              ))}
            </div>

            {/* expiry */}
            <div className="mt-4 text-left">
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className={C.faint}>Code expires in</span>
                <span className={`font-medium ${expired ? C.danger : C.muted}`}>
                  {expired ? "Expired" : fmt(expiresIn)}
                </span>
              </div>
              <div className={`h-1 overflow-hidden rounded-full ${C.input}`}>
                <div
                  className={`h-full rounded-full transition-all duration-1000 ease-linear ${
                    expired ? "bg-[#f23f42]" : expiresIn <= 10 ? "bg-[#f0b232]" : "bg-[#5865f2]"
                  }`}
                  style={{ width: `${expiryPct}%` }}
                />
              </div>
            </div>

            <button
              onClick={() => submitOtp()}
              disabled={loading || code.length !== OTP_LENGTH || expired}
              className={`${primaryBtn} mt-5`}
            >
              {verifying && <Spinner />}
              {verifying ? "Verifying..." : "Verify"}
            </button>

            <div className="mt-4 flex items-center justify-between text-sm">
              <button
                onClick={() => {
                  setStep("start");
                  setError("");
                }}
                className={`${C.link} hover:underline`}
              >
                Back
              </button>

              {cooldown > 0 ? (
                <span className={C.faint}>
                  Resend code in <span className={`font-medium ${C.muted}`}>{fmt(cooldown)}</span>
                </span>
              ) : (
                <button
                  onClick={() => requestCode(resendOtp)}
                  disabled={loading}
                  className={`${C.link} hover:underline disabled:opacity-50`}
                >
                  {resending ? "Sending..." : "Resend code"}
                </button>
              )}
            </div>
          </div>
        )}

        {/* ---------- BLOCKED ---------- */}
        {step === "blocked" && (
          <div className="anim-rise text-center">
            <IconCircle red>
              <svg className="h-9 w-9 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0 3.75h.008M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
            </IconCircle>
            <h1 className={`mt-5 text-2xl font-semibold ${C.text}`}>You're being rate limited</h1>
            <p className={`mx-auto mt-2 max-w-xs text-base ${C.muted}`}>{blockedMsg}</p>
            <div className={`mt-5 rounded-[3px] ${C.input} px-4 py-3`}>
              <p className={`${labelCls} text-center ${C.muted}`}>Try again in</p>
              <p className={`mt-1 text-3xl font-semibold ${C.danger}`}>{fmt(blockedFor)}</p>
            </div>
          </div>
        )}

        {/* ---------- SUCCESS ---------- */}
        {step === "success" && (
          <div className="text-center">
            <div className="anim-pop mx-auto flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[#23a55a]">
              <svg className="h-9 w-9 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <h1 className={`anim-rise mt-5 text-2xl font-semibold ${C.text}`}>Email verified</h1>
            <p className={`anim-rise mt-2 text-base ${C.muted}`}>Taking you to your account...</p>
          </div>
        )}
      </div>
    </FullScreen>
  );
}

/* ---------- small pieces ---------- */

function FullScreen({ children, backgroundImage }) {
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = Boolean(backgroundImage) && !imageFailed;

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#05060D] px-4 py-8 font-['gg_sans','Noto_Sans','Helvetica_Neue',Helvetica,Arial,sans-serif]">
      {showImage && (
        <img
          src={backgroundImage}
          alt=""
          aria-hidden="true"
          onError={() => setImageFailed(true)}
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        />
      )}

      {showImage && <div className="pointer-events-none absolute inset-0 bg-black/60" />}

      {!showImage && (
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-52 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-[#3F42BE]/15 blur-[130px]" />
          <div className="absolute -bottom-64 -right-40 h-[500px] w-[500px] rounded-full bg-[#3F42BE]/10 blur-[140px]" />
          <div className="absolute -bottom-64 -left-40 h-[400px] w-[400px] rounded-full bg-[#252A70]/10 blur-[120px]" />
        </div>
      )}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30" />

      <div className="relative z-10 flex w-full justify-center">{children}</div>
    </div>
  );
}

function IconCircle({ children, red }) {
  return (
    <div
      className={`mx-auto flex h-[72px] w-[72px] items-center justify-center rounded-full ${
        red ? "bg-[#f23f42]" : "bg-[#5865f2]"
      }`}
    >
      {children}
    </div>
  );
}

function MailIcon() {
  return (
    <svg className="h-9 w-9 text-white" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.24a2.25 2.25 0 01-1.07 1.92l-7.5 4.62a2.25 2.25 0 01-2.36 0l-7.5-4.62A2.25 2.25 0 012.25 6.99V6.75" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg className="h-9 w-9 text-white" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
  );
}

function Spinner({ big }) {
  return (
    <svg className={`animate-spin ${big ? "h-10 w-10 text-white" : "h-4 w-4"}`} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
      <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}