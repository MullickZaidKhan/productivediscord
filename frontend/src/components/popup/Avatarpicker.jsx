import React, { useState, useEffect, useRef } from "react";
import { useSetUserProfile } from "../../hooks/background.hook";
import {setUser} from "../../redux/authSlice.js"
import { useSelector, useDispatch } from 'react-redux'
import {
  Ghost,
  Cat,
  Rocket,
  Flame,
  Star,
  Zap,
  Bot,
  Skull,
  Check,
  SkipForward,
  Sparkles,
  Upload,
  Pencil,
  Loader2,
} from "lucide-react";

const FEATURED_IMG =
  "https://ik.imagekit.io/w5wx4gdmoj/discord_products/Frame%206.png?updatedAt=1786460933931";

const GALLERY = [
  { id: "featured", label: "Classic", type: "image", src: FEATURED_IMG },
  {
    id: "g1",
    label: "Look 01",
    type: "image",
    src: "https://i.pinimg.com/736x/80/cd/b3/80cdb332d3642192fe3565f5a9390a87.jpg",
  },
  {
    id: "g2",
    label: "Look 02",
    type: "image",
    src: "https://i.pinimg.com/736x/9a/41/19/9a4119db61e961a19d6d6101093b2cae.jpg",
  },
  {
    id: "g3",
    label: "Look 03",
    type: "image",
    src: "https://i.pinimg.com/1200x/2f/3f/02/2f3f0210ddd06dcb863a689d93e99345.jpg",
  },
  {
    id: "g4",
    label: "Look 04",
    type: "image",
    src: "https://i.pinimg.com/1200x/f5/a0/76/f5a076922e3118ebe28a1736a10a7366.jpg",
  },
  {
    id: "g5",
    label: "Look 05",
    type: "image",
    src: "https://i.pinimg.com/736x/a1/3b/6a/a13b6afa259d9afcee71209dbb7a5444.jpg",
  },
  {
    id: "g6",
    label: "Look 06",
    type: "image",
    src: "https://i.pinimg.com/1200x/de/05/ca/de05cabe43fac048551aec86aab68509.jpg",
  },
  {
    id: "g7",
    label: "Look 07",
    type: "image",
    src: "https://i.pinimg.com/736x/65/83/c2/6583c2df26b1f614a9cb0516284e1759.jpg",
  },
  {
    id: "g8",
    label: "Look 08",
    type: "image",
    src: "https://i.pinimg.com/1200x/77/c7/28/77c728ecadad1f77a5bfc1f201ff8148.jpg",
  },
  {
    id: "g9",
    label: "Look 09",
    type: "image",
    src: "https://i.pinimg.com/736x/d5/fb/55/d5fb554e5b79c94e438a660bbaf2df61.jpg",
  },
];

const STYLES = [
  { id: "ghost", label: "Ghost", icon: Ghost, c1: "#8B5CF6", c2: "#5B21B6" },
  { id: "cat", label: "Prowl", icon: Cat, c1: "#F97316", c2: "#DB2777" },
  { id: "rocket", label: "Launch", icon: Rocket, c1: "#0EA5E9", c2: "#1D4ED8" },
  { id: "flame", label: "Ember", icon: Flame, c1: "#F59E0B", c2: "#DC2626" },
  { id: "star", label: "Nova", icon: Star, c1: "#FACC15", c2: "#EA580C" },
  { id: "zap", label: "Volt", icon: Zap, c1: "#A3E635", c2: "#059669" },
  { id: "bot", label: "Circuit", icon: Bot, c1: "#2DD4BF", c2: "#4338CA" },
  { id: "skull", label: "Rogue", icon: Skull, c1: "#94A3B8", c2: "#334155" },
];

const BLURPLE = "#5865F2";
const CARD = "#2b2d31";
const CARD_HOVER = "#34363c";

export default function AvatarPicker() {
  const [selected, setSelected] = useState("featured");
  const [customAvatar, setCustomAvatar] = useState(null); // data URL for preview
  const [customFile, setCustomFile] = useState(null); // actual File for upload
  const [mounted, setMounted] = useState(false);
  const [toast, setToast] = useState(null);
  const { mutate, isPending } = useSetUserProfile();
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2400);
    return () => clearTimeout(t);
  }, [toast]);

  const allAvatars = [
    ...(customAvatar
      ? [
          {
            id: "custom",
            label: "Your photo",
            type: "image",
            src: customAvatar,
          },
        ]
      : []),
    ...GALLERY,
    ...STYLES,
  ];

  const current = allAvatars.find((a) => a.id === selected) || allAvatars[0];

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setToast("Please choose an image file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setCustomAvatar(reader.result);
      setCustomFile(file);
      setSelected("custom");
      setToast("Your photo is ready to use.");
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleMutationResult = (label) => ({
    onSuccess: () => {
      setToast(`Nice pick — "${label}" is now your avatar.`);
    },
    onError: (error) => {
      setToast(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong. Please try again."
      );
    },
  });

const saveProfileImage = () => {
  if (isPending) return;

  if (selected === "custom" && customFile) {
    const formData = new FormData();
    formData.append("profileimg", customFile);

    mutate(formData, {
      onSuccess: (data) => {
         dispatch(setUser(data.data));
        // console.log("Profile image uploaded successfully:", data);
      },
      onError: (error) => {
        // console.error("Profile image upload failed:", error);
      },
    });
  } else {
    mutate(current.src, {
      onSuccess: (data) => {
         dispatch(setUser(data.data));
        console.log("Profile image selected successfully:", data);
      },
      onError: (error) => {
        console.error("Profile image selection failed:", error);
      },
    });
  }
};

  const renderFace = (a, size = 40) => {
    if (a.type === "image") {
      return (
        <img
          src={a.src}
          alt={a.label}
          className="w-full h-full object-cover"
          draggable={false}
        />
      );
    }
    const Icon = a.icon;
    return (
      <div
        className="w-full h-full flex items-center justify-center"
        style={{ background: `linear-gradient(135deg, ${a.c1}, ${a.c2})` }}
      >
        <Icon color="white" size={size} strokeWidth={2} />
      </div>
    );
  };

  const AvatarButton = ({ a, i, delayOffset }) => {
    const isSelected = selected === a.id;
    return (
      <button
        key={a.id}
        onClick={() => setSelected(a.id)}
        className="avatar-card relative flex flex-col items-center gap-1.5 sm:gap-2 focus:outline-none min-w-0"
        style={{
          animationDelay: mounted ? `${(delayOffset + i) * 50}ms` : "0ms",
        }}
      >
        <div
          className="avatar-inner relative w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full overflow-hidden cursor-pointer shrink-0"
          style={{
            boxShadow: isSelected
              ? `0 0 0 3px ${CARD}, 0 0 0 5px ${BLURPLE}`
              : "0 0 0 2px rgba(255,255,255,0.08)",
          }}
        >
          {renderFace(a, 24)}
          {isSelected && (
            <span
              className="check-badge absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center"
              style={{ background: BLURPLE, border: `2px solid ${CARD}` }}
            >
              <Check size={10} color="white" strokeWidth={3} />
            </span>
          )}
        </div>
        <span
          className="text-[10px] xs:text-[11px] sm:text-xs font-medium truncate max-w-full px-0.5"
          style={{ color: isSelected ? "#ffffff" : "#949BA4" }}
        >
          {a.label}
        </span>
      </button>
    );
  };

  return (
    <div
      className="w-full min-h-screen flex items-center justify-center p-3 xs:p-4 sm:p-6 lg:p-8 overflow-y-auto"
      style={{
        fontFamily:
          "'Segoe UI', ui-rounded, 'SF Pro Rounded', system-ui, sans-serif",
      }}
    >
      <style>{`
        @keyframes floatUp {
          from { opacity: 0; transform: translateY(14px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes popCheck {
          0%   { transform: scale(0) rotate(-20deg); opacity: 0; }
          60%  { transform: scale(1.25) rotate(6deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes breathe {
          0%, 100% { box-shadow: 0 0 0 0 rgba(88,101,242,0.55); }
          50%      { box-shadow: 0 0 0 10px rgba(88,101,242,0); }
        }
        @keyframes toastIn {
          from { opacity: 0; transform: translate(-50%, 12px); }
          to   { opacity: 1; transform: translate(-50%, 0); }
        }
        @keyframes dashPulse {
          0%, 100% { border-color: rgba(88,101,242,0.5); }
          50%      { border-color: rgba(88,101,242,1); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .avatar-card { animation: floatUp 0.5s cubic-bezier(0.16,1,0.3,1) both; }
        .avatar-card:hover .avatar-inner { transform: scale(1.06); }
        .avatar-inner { transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1); }
        .preview-ring { animation: breathe 2.4s ease-in-out infinite; }
        .check-badge { animation: popCheck 0.4s cubic-bezier(0.34,1.56,0.64,1) both; }
        .upload-tile { animation: floatUp 0.5s cubic-bezier(0.16,1,0.3,1) both, dashPulse 2.6s ease-in-out infinite; }
        .upload-tile:hover { transform: scale(1.06); }
        .spin-icon { animation: spin 0.9s linear infinite; }
        .section-label {
          font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
          color: #949BA4; margin-bottom: 10px;
        }
        .right-scroll::-webkit-scrollbar { width: 6px; }
        .right-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 999px; }
        .modal-scroll::-webkit-scrollbar { width: 6px; }
        .modal-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 999px; }
        .avatar-grid { grid-template-columns: repeat(4, minmax(0,1fr)); }
        @media (min-width: 380px) {
          .avatar-grid { grid-template-columns: repeat(5, minmax(0,1fr)); }
        }
        @media (min-width: 1024px) {
          .avatar-grid { grid-template-columns: repeat(5, minmax(0,1fr)); }
        }
      `}</style>

      <div
        className="modal-scroll w-full max-w-[420px] sm:max-w-xl lg:max-w-5xl max-h-[94vh] overflow-y-auto rounded-2xl sm:rounded-3xl p-4 xs:p-5 sm:p-8 lg:p-10 lg:grid lg:grid-cols-[300px_1fr] lg:gap-5"
        style={{
          background: CARD,
          border: "1px solid rgba(255,255,255,0.06)",
          boxShadow: "0 30px 60px -20px rgba(0,0,0,0.6)",
        }}
      >
        {/* Left column (desktop landscape): header + preview + actions */}
        <div className="lg:flex lg:flex-col lg:justify-center">
          <div className="flex flex-col items-center text-center mb-5 sm:mb-8 lg:items-start lg:text-left">
            <span
              className="uppercase tracking-widest text-[10px] sm:text-xs font-bold mb-2 sm:mb-3 flex items-center gap-1.5"
              style={{ color: BLURPLE }}
            >
              <Sparkles size={14} /> Profile setup
            </span>
            <h1 className="text-white text-lg xs:text-xl sm:text-2xl lg:text-3xl font-extrabold mb-1.5 sm:mb-2">
              Pick your avatar
            </h1>
            <p
              className="text-xs sm:text-sm lg:text-base"
              style={{ color: "#949BA4" }}
            >
              Upload your own photo, pick a look, or skip for now.
            </p>
          </div>

          <div className="flex justify-center lg:justify-start mb-5 sm:mb-9 lg:mb-8">
            <div
              key={selected}
              className="preview-ring w-20 h-20 xs:w-24 xs:h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full overflow-hidden"
              style={{ boxShadow: `0 0 0 4px ${BLURPLE}` }}
            >
              <div className="w-full h-full">{renderFace(current, 40)}</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
            <button
              onClick={saveProfileImage}
              disabled={isPending}
              className="flex-1 py-3 rounded-xl font-bold text-white transition-all duration-200 active:scale-95 hover:brightness-110 hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0 disabled:active:scale-100"
              style={{
                background: BLURPLE,
                boxShadow: `0 8px 20px -6px ${BLURPLE}`,
              }}
            >
              {isPending ? (
                <>
                  <Loader2 size={16} className="spin-icon" />
                  Saving…
                </>
              ) : (
                "Set as avatar"
              )}
            </button>
            <button
              onClick={() =>
                setToast("Skipped — you can set an avatar anytime in Settings.")
              }
              disabled={isPending}
              className="flex-1 py-3 rounded-xl font-bold transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70"
              style={{
                background: "transparent",
                color: "#DBDEE1",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = CARD_HOVER)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              <SkipForward size={16} />
              Skip for now
            </button>
          </div>
        </div>

        {/* Right column (desktop landscape): scrollable option sections */}
        <div className="mt-6 lg:mt-0 right-scroll lg:max-h-[560px] lg:overflow-y-auto lg:pr-2">
          {/* Upload your own */}
          <div className="mb-6 sm:mb-7">
            <div className="section-label">Your photo</div>
            <div className="flex gap-3 sm:gap-4 flex-wrap">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFile}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="upload-tile flex flex-col items-center gap-1.5 sm:gap-2 focus:outline-none min-w-0"
              >
                <div
                  className="w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center border-2 border-dashed cursor-pointer shrink-0"
                  style={{
                    borderColor: "rgba(88,101,242,0.6)",
                    background: "rgba(88,101,242,0.08)",
                  }}
                >
                  {customAvatar ? (
                    <Pencil size={18} color={BLURPLE} />
                  ) : (
                    <Upload size={18} color={BLURPLE} />
                  )}
                </div>
                <span
                  className="text-[10px] xs:text-[11px] sm:text-xs font-medium"
                  style={{ color: "#949BA4" }}
                >
                  {customAvatar ? "Replace" : "Upload"}
                </span>
              </button>
              {customAvatar && (
                <AvatarButton
                  a={{
                    id: "custom",
                    label: "Your photo",
                    type: "image",
                    src: customAvatar,
                  }}
                  i={0}
                  delayOffset={0}
                />
              )}
            </div>
          </div>

          {/* Gallery */}
          <div className="mb-6 sm:mb-7">
            <div className="section-label">Gallery picks</div>
            <div className="avatar-grid grid gap-2.5 xs:gap-3 sm:gap-4">
              {GALLERY.map((a, i) => (
                <AvatarButton a={a} i={i} delayOffset={2} key={a.id} />
              ))}
            </div>
          </div>

          {/* Default styles */}
          {/* <div className="mb-2">
            <div className="section-label">Default styles</div>
            <div className="avatar-grid grid gap-2.5 xs:gap-3 sm:gap-4">
              {STYLES.map((a, i) => (
                <AvatarButton a={a} i={i} delayOffset={12} key={a.id} />
              ))}
            </div>
          </div> */}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className="fixed bottom-5 xs:bottom-6 sm:bottom-8 left-1/2 z-50 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-medium text-white shadow-2xl max-w-[92vw] text-center"
          style={{
            background: CARD,
            border: `1px solid ${BLURPLE}`,
            animation: "toastIn 0.35s cubic-bezier(0.16,1,0.3,1) both",
          }}
        >
          {toast}
        </div>
      )}
    </div>
  );
}