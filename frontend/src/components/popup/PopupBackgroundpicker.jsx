// import React, { useEffect, useMemo, useState } from "react";
// import { Check, Crown, Loader2, ImageOff, Search, X, Sparkles } from "lucide-react";
// import { useQueryClient } from "@tanstack/react-query";
// import { useNavigate } from "react-router-dom";
// import {
//   useGetAllBackgrounds,
//   useSetUserBackground,
//   useGetUserBackground,
// } from "../../hooks/background.hook.js";

// /**
//  * BackgroundPicker
//  * ------------------------------------------------------------------
//  * Discord-styled "choose your app background" popup.
//  *
//  * Renders as a centered modal over a dimmed backdrop, the way Discord's
//  * own settings/customization popups work — on phones it expands to fill
//  * the screen and scrolls internally, on larger screens it's a capped,
//  * rounded card with its own scroll area.
//  *
//  * Data flow:
//  *   - useGetAllBackgrounds()  -> full catalog of selectable backgrounds
//  *   - useGetUserBackground()  -> the ONE background currently applied
//  *                                for this user (used to mark "IN USE"
//  *                                and to default the initial selection)
//  *   - useSetUserBackground()  -> mutation to apply the chosen background
//  * ------------------------------------------------------------------
//  */

// const ALL_TAB = "All";

// function CardSkeleton() {
//   return (
//     <div className="rounded-xl overflow-hidden bg-[#232428] border border-white/5">
//       <div className="aspect-video w-full animate-pulse bg-[#35373c]" />
//       <div className="p-3 space-y-2">
//         <div className="h-3 w-2/3 rounded animate-pulse bg-[#35373c]" />
//         <div className="h-2 w-1/3 rounded animate-pulse bg-[#35373c]" />
//       </div>
//     </div>
//   );
// }

// export default function BackgroundPicker() {
//   const [backgrounds, setBackgrounds] = useState([]);
//   const [status, setStatus] = useState("loading"); // loading | error | ready
//   const [activeTab, setActiveTab] = useState(ALL_TAB);
//   const [query, setQuery] = useState("");
//   const [selectedId, setSelectedId] = useState(null);
//   const [saving, setSaving] = useState(false);
//   const [saved, setSaved] = useState(false);
//   const [brokenImgs, setBrokenImgs] = useState({});

//   const queryClient = useQueryClient();
//   const navigate = useNavigate();
//   const { data, isLoading, error } = useGetAllBackgrounds();
//   const {
//     data: userBackgroundData,
//     isLoading: isUserBackgroundLoading,
//   } = useGetUserBackground();
//   const setUserBackground = useSetUserBackground();

//   // The id of whatever the user currently has applied, straight from
//   // the "current user background" endpoint. Falls back to an `active`
//   // flag on a list item if your API happens to include one instead.
//   const currentActiveId =
//     userBackgroundData?.data?._id ??
//     userBackgroundData?._id ??
//     backgrounds.find((b) => b.active)?._id ??
//     "6a72ea989c51c48df3ebcb47";

//   useEffect(() => {
//     if (isLoading || isUserBackgroundLoading) {
//       setStatus("loading");
//       return;
//     }

//     if (error) {
//       setStatus("error");
//       return;
//     }

//     const items = data?.data ?? data ?? [];
//     setBackgrounds(items);
//     setStatus("ready");
//   }, [data, isLoading, isUserBackgroundLoading, error]);

//   // Default the selection to whatever's already applied, once we know it.
//   useEffect(() => {
//     if (status !== "ready" || selectedId) return;
//     setSelectedId(currentActiveId ?? backgrounds[0]?._id ?? null);
//   }, [status, currentActiveId, backgrounds, selectedId]);

//   // Lock the page underneath from scrolling while the popup is open.
//   useEffect(() => {
//     const prevOverflow = document.body.style.overflow;
//     document.body.style.overflow = "hidden";
//     return () => {
//       document.body.style.overflow = prevOverflow;
//     };
//   }, []);

//   const categories = useMemo(() => {
//     const set = new Set(backgrounds.map((b) => b.category));
//     return [ALL_TAB, ...Array.from(set)];
//   }, [backgrounds]);

//   const filtered = useMemo(() => {
//     return backgrounds
//       .filter((b) => activeTab === ALL_TAB || b.category === activeTab)
//       .filter((b) =>
//         query.trim() ? b.name.toLowerCase().includes(query.trim().toLowerCase()) : true
//       )
//       .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
//   }, [backgrounds, activeTab, query]);

//   const selected = backgrounds.find((b) => b._id === selectedId);
//   const hasChanges = selectedId && selectedId !== currentActiveId;

//   const handlePick = (bg) => {
//     setSelectedId(bg._id);
//     setSaved(false);
//   };

//   const handleApply = async () => {
//     if (!selectedId || saving) return;
//     setSaving(true);
//     try {
//       await setUserBackground.mutateAsync(selectedId);
//       setSaved(true);
//       queryClient.invalidateQueries({ queryKey: ["user-background"] });
//       navigate("/");
//     } catch (e) {
//       // leave `saved` false so the button reverts and the user can retry
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleSkip = () => {
//     if (saving) return;
//     navigate("/");
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-stretch sm:items-center justify-center  backdrop-blur-[3px] sm:p-6">
//       <style>{`
//         @keyframes bp-fade-up {
//           from { opacity: 0; transform: translateY(10px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         @keyframes bp-pop-in {
//           from { opacity: 0; transform: scale(0.97) translateY(6px); }
//           to { opacity: 1; transform: scale(1) translateY(0); }
//         }
//         .bp-card-in { animation: bp-fade-up 0.35s ease both; }
//         .bp-panel-in { animation: bp-pop-in 0.22s cubic-bezier(0.2, 0.8, 0.2, 1) both; }
//         @media (prefers-reduced-motion: reduce) {
//           .bp-card-in, .bp-panel-in { animation: none; }
//         }
//       `}</style>

//       {/* The popup panel itself */}
//       <div
//         className="bp-panel-in relative flex flex-col w-full h-full sm:h-auto sm:max-h-[88vh] sm:max-w-3xl sm:rounded-2xl overflow-hidden bg-[#313338] text-[#f2f3f5] shadow-2xl border border-white/5"
//         role="dialog"
//         aria-modal="true"
//         aria-label="Choose your background"
//       >
//         {/* Ambient glow accent inside the panel, purely decorative */}
//         <div
//           aria-hidden="true"
//           className="pointer-events-none absolute inset-x-0 top-0 h-56 opacity-70"
//           style={{
//             background:
//               "radial-gradient(60% 100% at 15% 0%, rgba(88,101,242,0.35) 0%, rgba(88,101,242,0) 60%), radial-gradient(50% 90% at 90% 0%, rgba(235,69,158,0.2) 0%, rgba(235,69,158,0) 60%)",
//           }}
//         />

//         {/* Close button */}
//         <button
//           onClick={handleSkip}
//           disabled={saving}
//           aria-label="Close and skip"
//           className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30 flex h-8 w-8 items-center justify-center rounded-full bg-black/30 text-[#b5bac1] hover:bg-black/50 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//         >
//           <X size={16} strokeWidth={2.5} />
//         </button>

//         {/* Scrollable content: header + grid live inside the same scroll area */}
//         <div className="relative flex-1 min-h-0 overflow-y-auto overscroll-contain">
//           {/* Header */}
//           <div className="sticky top-0 z-20 border-b border-black/20 bg-[#313338]/90 backdrop-blur-md">
//             <div className="px-4 sm:px-6 pt-5 pb-4 flex flex-col gap-4">
//               <div className="flex items-start gap-2.5 pr-8">
//                 {/* <div className="hidden sm:flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#5865f2] to-[#a35bf2] shadow-lg shadow-[#5865f2]/30">
//                   <Sparkles size={18} className="text-white" />
//                 </div> */}
//                 <div className="min-w-0">
//                   <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-wide text-[#949ba4] mb-1">
//                     Appearance
//                   </p>
//                   <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
//                     Choose your background
//                   </h1>
//                   <p className="text-xs sm:text-sm text-[#b5bac1] mt-1 max-w-md">
//                     Pick an image below and it becomes the background across the app.
//                   </p>
//                 </div>
//               </div>

//               {/* Search */}
//               <div className="flex items-center gap-2 bg-[#1e1f22] rounded-md px-3 py-2 w-full sm:w-64 shrink-0 border border-white/5 focus-within:border-[#5865f2]/60 transition-colors">
//                 <Search size={16} className="text-[#949ba4] shrink-0" />
//                 <input
//                   value={query}
//                   onChange={(e) => setQuery(e.target.value)}
//                   placeholder="Search backgrounds"
//                   className="bg-transparent outline-none text-sm placeholder:text-[#6d6f78] w-full text-white"
//                 />
//               </div>

//               {/* Category tabs */}
//               <div className="flex items-center gap-2 overflow-x-auto pb-1 -mb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
//                 {categories.map((cat) => {
//                   const isActive = cat === activeTab;
//                   return (
//                     <button
//                       key={cat}
//                       onClick={() => setActiveTab(cat)}
//                       className={
//                         "shrink-0 rounded-full px-3.5 py-1.5 text-xs sm:text-sm font-medium transition-all " +
//                         (isActive
//                           ? "bg-[#5865f2] text-white shadow-md shadow-[#5865f2]/30"
//                           : "bg-[#232428] text-[#b5bac1] hover:bg-[#3a3c42] hover:text-white")
//                       }
//                     >
//                       {cat}
//                     </button>
//                   );
//                 })}
//               </div>
//             </div>
//           </div>

//           {/* Grid body */}
//           <div className="relative px-4 sm:px-6 py-5">
//             {status === "loading" && (
//               <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
//                 {Array.from({ length: 8 }).map((_, i) => (
//                   <CardSkeleton key={i} />
//                 ))}
//               </div>
//             )}

//             {status === "error" && (
//               <div className="flex flex-col items-center justify-center text-center py-20 gap-3">
//                 <div className="h-12 w-12 rounded-full bg-[#232428] flex items-center justify-center">
//                   <ImageOff size={22} className="text-[#f23f42]" />
//                 </div>
//                 <p className="text-white font-semibold">Couldn't load backgrounds</p>
//                 <p className="text-sm text-[#949ba4] max-w-sm">
//                   Something went wrong fetching the list. Check your connection and try again.
//                 </p>
//                 <button
//                   onClick={() => {
//                     setStatus("loading");
//                     queryClient.invalidateQueries({ queryKey: ["backgrounds"] });
//                   }}
//                   className="mt-2 rounded-md bg-[#5865f2] hover:bg-[#4752c4] transition-colors text-white text-sm font-medium px-4 py-2"
//                 >
//                   Retry
//                 </button>
//               </div>
//             )}

//             {status === "ready" && filtered.length === 0 && (
//               <div className="flex flex-col items-center justify-center text-center py-20 gap-2">
//                 <p className="text-white font-semibold">No backgrounds match</p>
//                 <p className="text-sm text-[#949ba4]">Try a different search or category.</p>
//               </div>
//             )}

//             {status === "ready" && filtered.length > 0 && (
//               <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
//                 {filtered.map((bg, i) => {
//                   const isSelected = bg._id === selectedId;
//                   const isCurrentlyActive = bg._id === currentActiveId;
//                   const imgBroken = brokenImgs[bg._id];

//                   return (
//                     <button
//                       key={bg._id}
//                       onClick={() => handlePick(bg)}
//                       aria-pressed={isSelected}
//                       style={{ animationDelay: `${Math.min(i, 12) * 25}ms` }}
//                       className={
//                         "bp-card-in group relative text-left rounded-xl overflow-hidden bg-[#232428] border transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5865f2] hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/30 " +
//                         (isSelected
//                           ? "border-[#5865f2] ring-2 ring-[#5865f2]"
//                           : "border-white/5 hover:border-white/20")
//                       }
//                     >
//                       <div className="relative aspect-video w-full overflow-hidden bg-[#1e1f22]">
//                         {!imgBroken ? (
//                           <img
//                             src={bg.imageUrl}
//                             alt={bg.name}
//                             loading="lazy"
//                             onError={() =>
//                               setBrokenImgs((prev) => ({ ...prev, [bg._id]: true }))
//                             }
//                             className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
//                           />
//                         ) : (
//                           <div className="h-full w-full flex items-center justify-center text-[#6d6f78]">
//                             <ImageOff size={22} />
//                           </div>
//                         )}

//                         {/* gradient for legibility */}
//                         <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0" />

//                         {/* premium badge */}
//                         {bg.premium && (
//                           <div className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-black/60 backdrop-blur px-2 py-0.5">
//                             <Crown size={12} className="text-[#f0b232]" />
//                             <span className="text-[10px] font-semibold text-[#f0b232] tracking-wide">
//                               PREMIUM
//                             </span>
//                           </div>
//                         )}

//                         {/* currently applied badge */}
//                         {isCurrentlyActive && (
//                           <div className="absolute top-2 right-2 rounded-full bg-black/60 backdrop-blur px-2 py-0.5">
//                             <span className="text-[10px] font-semibold text-[#23a55a] tracking-wide">
//                               IN USE
//                             </span>
//                           </div>
//                         )}

//                         {/* selection check */}
//                         <div
//                           className={
//                             "absolute bottom-2 right-2 h-6 w-6 rounded-full flex items-center justify-center transition-all " +
//                             (isSelected
//                               ? "bg-[#5865f2] scale-100 opacity-100"
//                               : "bg-black/50 scale-90 opacity-0 group-hover:opacity-100")
//                           }
//                         >
//                           <Check size={14} className="text-white" strokeWidth={3} />
//                         </div>
//                       </div>

//                       <div className="p-2.5 sm:p-3">
//                         <p className="text-xs sm:text-sm font-semibold text-white truncate">{bg.name}</p>
//                         <p className="text-[11px] sm:text-xs text-[#949ba4] mt-0.5">{bg.category}</p>
//                       </div>
//                     </button>
//                   );
//                 })}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Footer / apply bar — stays pinned to the bottom of the panel */}
//         <footer className="relative z-20 border-t border-black/20 bg-[#2b2d31]">
//           <div className="px-4 sm:px-6 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
//             <div className="flex items-center gap-3 min-w-0">
//               {selected ? (
//                 <>
//                   <div className="h-10 w-16 rounded-md overflow-hidden bg-[#1e1f22] shrink-0 border border-white/10">
//                     <img src={selected.imageUrl} alt="" className="h-full w-full object-cover" />
//                   </div>
//                   <div className="min-w-0">
//                     <p className="text-sm font-medium text-white truncate">{selected.name}</p>
//                     <p className="text-xs text-[#949ba4]">
//                       {hasChanges ? "Ready to apply" : "Currently applied"}
//                     </p>
//                   </div>
//                 </>
//               ) : (
//                 <p className="text-sm text-[#949ba4]">Select a background to continue</p>
//               )}
//             </div>

//             <div className="flex items-center gap-2 shrink-0">
//               <button
//                 onClick={handleSkip}
//                 disabled={saving}
//                 className="flex-1 sm:flex-initial rounded-md px-4 py-2 text-sm font-semibold text-[#b5bac1] hover:text-white hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 Skip
//               </button>
//               <button
//                 onClick={handleApply}
//                 disabled={!hasChanges || saving}
//                 className={
//                   "flex-1 sm:flex-initial flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition-colors " +
//                   (!hasChanges || saving
//                     ? "bg-[#3a3c42] text-[#80838e] cursor-not-allowed"
//                     : "bg-[#5865f2] text-white hover:bg-[#4752c4] shadow-md shadow-[#5865f2]/30")
//                 }
//               >
//                 {saving && <Loader2 size={16} className="animate-spin" />}
//                 {saving ? "Applying..." : saved ? "Applied" : "Apply background"}
//               </button>
//             </div>
//           </div>
//         </footer>
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useMemo, useState } from "react";
import { Check, Crown, Loader2, ImageOff, Search } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  useGetAllBackgrounds,
  useSetUserBackground,
  useGetUserBackground,
} from "../../hooks/background.hook";

/**
 * BackgroundPicker
 * ------------------------------------------------------------------
 * Discord-styled "choose your app background" screen.
 *
 * Data flow:
 *   - useGetAllBackgrounds()  -> full catalog of selectable backgrounds
 *   - useGetUserBackground()  -> the ONE background currently applied
 *                                for this user (used to mark "IN USE"
 *                                and to default the initial selection)
 *   - useSetUserBackground()  -> mutation to apply the chosen background
 * ------------------------------------------------------------------
 */

const ALL_TAB = "All";

function CardSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden bg-[#2b2d31] border border-white/5">
      <div className="aspect-video w-full animate-pulse bg-[#35373c]" />
      <div className="p-3 space-y-2">
        <div className="h-3 w-2/3 rounded animate-pulse bg-[#35373c]" />
        <div className="h-2 w-1/3 rounded animate-pulse bg-[#35373c]" />
      </div>
    </div>
  );
}

export default function BackgroundPicker() {
  const [backgrounds, setBackgrounds] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | error | ready
  const [activeTab, setActiveTab] = useState(ALL_TAB);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [brokenImgs, setBrokenImgs] = useState({});

  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetAllBackgrounds();
  const {
    data: userBackgroundData,
    isLoading: isUserBackgroundLoading,
  } = useGetUserBackground();
  const setUserBackground = useSetUserBackground();

  // The id of whatever the user currently has applied, straight from
  // the "current user background" endpoint. Falls back to an `active`
  // flag on a list item if your API happens to include one instead.
  const currentActiveId =
    userBackgroundData?.data?._id ??
    userBackgroundData?._id ??
    backgrounds.find((b) => b.active)?._id ??
    "6a72ea989c51c48df3ebcb47";

  useEffect(() => {
    if (isLoading || isUserBackgroundLoading) {
      setStatus("loading");
      return;
    }

    if (error) {
      setStatus("error");
      return;
    }

    const items = data?.data ?? data ?? [];
    setBackgrounds(items);
    setStatus("ready");
  }, [data, isLoading, isUserBackgroundLoading, error]);

  // Default the selection to whatever's already applied, once we know it.
  useEffect(() => {
    if (status !== "ready" || selectedId) return;
    setSelectedId(currentActiveId ?? backgrounds[0]?._id ?? null);
  }, [status, currentActiveId, backgrounds, selectedId]);

  const categories = useMemo(() => {
    const set = new Set(backgrounds.map((b) => b.category));
    return [ALL_TAB, ...Array.from(set)];
  }, [backgrounds]);

  const filtered = useMemo(() => {
    return backgrounds
      .filter((b) => activeTab === ALL_TAB || b.category === activeTab)
      .filter((b) =>
        query.trim() ? b.name.toLowerCase().includes(query.trim().toLowerCase()) : true
      )
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [backgrounds, activeTab, query]);

  const selected = backgrounds.find((b) => b._id === selectedId);
  const hasChanges = selectedId && selectedId !== currentActiveId;

  const handlePick = (bg) => {
    setSelectedId(bg._id);
    setSaved(false);
  };

  const handleApply = async () => {
    if (!selectedId || saving) return;
    setSaving(true);
    try {
      await setUserBackground.mutateAsync(selectedId);
      setSaved(true);
      queryClient.invalidateQueries({ queryKey: ["user-background"] });
      navigate("/");
    } catch (e) {
      // leave `saved` false so the button reverts and the user can retry
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-full w-full bg-[#313338] text-[#f2f3f5] flex flex-col">
      {/* Header */}
      <header className="sticky -top-1 pt-2 z-20  border-black/20 bg-[#313338]/95 backdrop-blur">
        <div className="max-w-6xl mx-auto px-5 py-4 flex flex-col gap-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              {/* <p className="text-xs font-semibold uppercase tracking-wide text-[#949ba4] mb-1">
                Appearance
              </p> */}
              <h1 className="text-2xl sm:text-2xl font-bold text-white">
                Choose your background
              </h1>
              {/* <p className="text-sm text-[#b5bac1] mt-1">
                Pick an image below and it becomes the background across the app.
                Click a card, then hit Apply.
              </p> */}
            </div>

            {/* Search */}
            <div className="hidden sm:flex items-center gap-2 bg-[#1e1f22] rounded-md px-3 py-2 w-56 shrink-0">
              <Search size={16} className="text-[#949ba4]" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search backgrounds"
                className="bg-transparent outline-none text-sm placeholder:text-[#6d6f78] w-full text-white"
              />
            </div>
          </div>

          {/* Category tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 -mb-1">
            {categories.map((cat) => {
              const isActive = cat === activeTab;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveTab(cat)}
                  className={
                    "shrink-0 rounded-[6px] px-3.5 py-1.5 text-sm font-medium transition-colors " +
                    (isActive
                      ? "bg-[#5865f2] text-white"
                      : "bg-[#2b2d31] text-[#b5bac1] hover:bg-[#3a3c42] hover:text-white")
                  }

                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Body */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-5 py-6">
        {status === "loading" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center justify-center text-center py-24 gap-3">
            <div className="h-12 w-12 rounded-full bg-[#2b2d31] flex items-center justify-center">
              <ImageOff size={22} className="text-[#f23f42]" />
            </div>
            <p className="text-white font-semibold">Couldn't load backgrounds</p>
            <p className="text-sm text-[#949ba4] max-w-sm">
              Something went wrong fetching the list. Check your connection and try again.
            </p>
            <button
              onClick={() => {
                setStatus("loading");
                queryClient.invalidateQueries({ queryKey: ["backgrounds"] });
              }}
              className="mt-2 rounded-md bg-[#5865f2] hover:bg-[#4752c4] transition-colors text-white text-sm font-medium px-4 py-2"
            >
              Retry
            </button>
          </div>
        )}

        {status === "ready" && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center py-24 gap-2">
            <p className="text-white font-semibold">No backgrounds match</p>
            <p className="text-sm text-[#949ba4]">Try a different search or category.</p>
          </div>
        )}

        {status === "ready" && filtered.length > 0 && (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-1">
            {filtered.map((bg) => {
              const isSelected = bg._id === selectedId;
              const isCurrentlyActive = bg._id === currentActiveId;
              const imgBroken = brokenImgs[bg._id];

              return (
                <button
                  key={bg._id}
                  onClick={() => handlePick(bg)}
                  aria-pressed={isSelected}
                  className={
                    "group relative text-left rounded-[10px] overflow-hidden bg-[#2b2d31] border transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5865f2] " +
                    (isSelected
                      ? "border-[#5865f2] ring-2 ring-[#5865f2]"
                      : "border-white/5 hover:border-white/20")
                  }

                >
                  <div className="relative aspect-video w-full overflow-hidden bg-[#1e1f22]">
                    {!imgBroken ? (
                      <img
                        src={bg.imageUrl}
                        alt={bg.name}
                        loading="lazy"
                        onError={() =>
                          setBrokenImgs((prev) => ({ ...prev, [bg._id]: true }))
                        }

                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-[#6d6f78]">
                        <ImageOff size={22} />
                      </div>
                    )}

                    {/* gradient for legibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0" />

                    {/* premium badge */}
                    {bg.premium && (
                      <div className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-black/60 backdrop-blur px-2 py-0.5">
                        <Crown size={12} className="text-[#f0b232]" />
                        <span className="text-[10px] font-semibold text-[#f0b232] tracking-wide">
                          PREMIUM
                        </span>
                      </div>
                    )}

                    {/* currently applied badge */}
                    {isCurrentlyActive && (
                      <div className="absolute top-2 right-2 rounded-full bg-black/60 backdrop-blur px-2 py-0.5">
                        <span className="text-[10px] font-semibold text-[#23a55a] tracking-wide">
                          IN USE
                        </span>
                      </div>
                    )}

                    {/* selection check */}
                    <div
                      className={
                        "absolute bottom-2 right-2 h-6 w-6 rounded-full flex items-center justify-center transition-all " +
                        (isSelected
                          ? "bg-[#5865f2] scale-100 opacity-100"
                          : "bg-black/50 scale-90 opacity-0 group-hover:opacity-100")
                      }

                    >
                      <Check size={14} className="text-white" strokeWidth={3} />
                    </div>
                  </div>

                  {/* <div className="p-3">
                    <p className="text-sm font-semibold text-white truncate">{bg.name}</p>
                    <p className="text-xs text-[#949ba4] mt-0.5">{bg.category}</p>
                  </div> */}
                </button>
              );
            })}
          </div>
        )}
      </main>

      {/* Sticky footer / apply bar */}
      <footer className="sticky bottom-0 z-20 border-black/20 bg-[#313338b4]">
        <div className="max-w-6xl mx-auto px-5 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            {selected ? (
              <>
                <div className="h-10 w-16 rounded-md overflow-hidden bg-[#1e1f22] shrink-0 border border-white/10">
                  <img src={selected.imageUrl} alt="" className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white truncate">{selected.name}</p>
                  <p className="text-xs text-[#949ba4]">
                    {hasChanges ? "Ready to apply" : "Currently applied"}
                  </p>
                </div>
              </>
            ) : (
              <p className="text-sm text-[#949ba4]">Select a background to continue</p>
            )}
          </div>

          <button
            onClick={handleApply}
            disabled={!hasChanges || saving}
            className={
              "shrink-0 flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition-colors " +
              (!hasChanges || saving
                ? "bg-[#3a3c42] text-[#80838e] cursor-not-allowed"
                : "bg-[#5865f2] text-white hover:bg-[#4752c4]")
            }

          >
            {saving && <Loader2 size={16} className="animate-spin" />}
            {saving ? "Applying..." : saved ? "Applied" : "Apply background"}
          </button>
        </div>
      </footer>
    </div>
  );
}