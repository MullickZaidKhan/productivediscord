import React, { useEffect, useMemo, useState } from "react";
import { Check, Crown, Loader2, ImageOff, Search } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  useGetAllBackgrounds,
  useSetUserBackground,
} from "../hooks/background.hook.js";

/**
 * BackgroundPicker
 * ------------------------------------------------------------------
 * Discord-styled "choose your app background" screen.
 *
 * Wire it up:
 *   - Replace `fetchBackgrounds()` with your real API call. It must
 *     resolve to an array shaped like the sample objects below.
 *   - Replace `saveBackground(id)` with your real "select" API call.
 *   - `MOCK_DATA` is only used as a local fallback so this screen is
 *     easy to preview before the API is connected.
 * ------------------------------------------------------------------
 */
// Data is provided by `useGetAllBackgrounds` hook.

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
  const { data, isLoading, error } = useGetAllBackgrounds();
  const setUserBackground = useSetUserBackground();
  const navigate = useNavigate();
  useEffect(() => {
    if (isLoading) {
      setStatus("loading");
      return;
    }

    if (error) {
      setStatus("error");
      return;
    }

    const items = data?.data ?? data ?? [];
    setBackgrounds(items);
    const current = items.find((b) => b.active);
    setSelectedId(current ? current._id : items[0]?._id ?? null);
    setStatus("ready");
  }, [data, isLoading, error]);

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
  const currentActiveId = backgrounds.find((b) => b.active)?._id ?? null;
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
      setBackgrounds((prev) =>
        prev.map((b) => ({ ...b, active: b._id === selectedId }))
      );
      setSaved(true);
      queryClient.invalidateQueries({ queryKey: ["user-background"] });
      // redirect to home on success
      navigate("/");
    } catch (e) {
      // leave UI state to show failure via `saved` remaining false
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#313338] text-[#f2f3f5] flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-black/20 bg-[#313338]/95 backdrop-blur">
        <div className="max-w-6xl mx-auto px-5 py-4 flex flex-col gap-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#949ba4] mb-1">
                Appearance
              </p>
              <h1 className="text-xl sm:text-2xl font-bold text-white">
                Choose your background
              </h1>
              <p className="text-sm text-[#b5bac1] mt-1">
                Pick an image below and it becomes the background across the app.
                Click a card, then hit Apply.
              </p>
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
                    "shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors " +
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
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
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
                    "group relative text-left rounded-xl overflow-hidden bg-[#2b2d31] border transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5865f2] " +
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

                        className={
                          "h-full w-full object-cover transition-transform duration-300 " +
                          "group-hover:scale-105 " +
                          (isSelected ? "" : "")
                        }

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

                  <div className="p-3">
                    <p className="text-sm font-semibold text-white truncate">{bg.name}</p>
                    <p className="text-xs text-[#949ba4] mt-0.5">{bg.category}</p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </main>

      {/* Sticky footer / apply bar */}
      <footer className="sticky bottom-0 z-20 border-t border-black/20 bg-[#2b2d31]">
        <div className="max-w-6xl mx-auto px-5 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            {selected ? (
              <>
                <div className="h-10 w-16 rounded-md overflow-hidden bg-[#1e1f22] shrink-0 border border-white/10">
                  <img
                    src={selected.imageUrl}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {selected.name}
                  </p>
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