import React, { useState, useRef, useEffect } from "react";
import {
  X,
  Link2,
  LayoutGrid,
  Plus,
  Pencil,
  Check,
  Camera,
  ImageIcon,
  RotateCw,
} from "lucide-react";

import {closeProfilePageSettings} from "../../redux/Profile/ProfilePageSettings.js" ;
import { useDispatch ,useSelector} from "react-redux";
const DEFAULT_AVATAR =
  "https://ik.imagekit.io/w5wx4gdmoj/discord_products/Frame%206.png?updatedAt=1786460933931";

const WIDGET_LIBRARY = [
  { id: "marvel-rivals", label: "Marvel Rivals", img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300&h=200&fit=crop" },
  { id: "wuthering-waves", label: "Wuthering Waves", img: "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=300&h=200&fit=crop" },
  { id: "arknights", label: "Arknights Endfield", img: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=300&h=200&fit=crop" },
  { id: "favorite-game", label: "Favorite Game", img: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=300&h=200&fit=crop" },
  { id: "games-i-like", label: "Games I Like", img: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=300&h=200&fit=crop" },
  { id: "games-rotation", label: "Games in Rotation", img: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=300&h=200&fit=crop" },
];

/* ---------- small reusable pieces ---------- */

function EditableText({ value, onChange, placeholder, className, multiline }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value || "");

  const commit = () => {
    onChange(draft.trim());
    setEditing(false);
  };

  if (editing) {
    const Field = multiline ? "textarea" : "input";
    return (
      <div className="flex items-start gap-1.5 w-full">
        <Field
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !multiline) commit();
            if (e.key === "Escape") setEditing(false);
          }}
          placeholder={placeholder}
          rows={multiline ? 2 : undefined}
          className="bg-[#1e1f22] border border-[#5865f2] rounded-md px-2 py-1 text-sm text-white outline-none w-full resize-none"
        />
        <button
          onClick={commit}
          className="mt-1 shrink-0 rounded-full bg-[#5865f2] hover:bg-[#4752c4] p-1 transition-colors"
        >
          <Check size={12} className="text-white" />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => {
        setDraft(value || "");
        setEditing(true);
      }}
      className={"group flex items-center gap-1.5 text-left w-full " + (className || "")}
    >
      <span className={value ? "" : "text-[#949ba4] italic"}>{value || placeholder}</span>
      <Pencil size={11} className="opacity-0 group-hover:opacity-60 transition-opacity shrink-0" />
    </button>
  );
}

/** Click-to-edit inline name field, larger font, no icon clutter until hover */
function EditableName({ value, onChange, placeholder }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value || "");

  const commit = () => {
    onChange(draft.trim() || value);
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="flex items-center gap-1.5">
        <input
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") commit();
            if (e.key === "Escape") setEditing(false);
          }}
          placeholder={placeholder}
          className="bg-[#1e1f22] border border-[#5865f2] rounded-md px-2 py-1 text-lg font-bold text-white outline-none w-full"
        />
        <button
          onClick={commit}
          className="shrink-0 rounded-full bg-[#5865f2] hover:bg-[#4752c4] p-1 transition-colors"
        >
          <Check size={12} className="text-white" />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => {
        setDraft(value || "");
        setEditing(true);
      }}
      className="group flex items-center gap-1.5 text-left"
    >
      <h2 className="text-white text-lg sm:text-xl font-bold leading-tight break-all">
        {value}
      </h2>
      <Pencil size={12} className="opacity-0 group-hover:opacity-60 transition-opacity shrink-0" />
    </button>
  );
}

/** Opens the file picker, then hands the raw image off to the edit modal (doesn't apply directly) */
function ImagePicker({ children, onSelectRaw }) {
  const inputRef = useRef(null);
  return (
    <>
      <div onClick={() => inputRef.current?.click()} className="cursor-pointer">
        {children}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = () => onSelectRaw(reader.result);
          reader.readAsDataURL(file);
          e.target.value = "";
        }}
      />
    </>
  );
}

/* ---------- Discord-style "Edit Image" modal: drag to pan, slider to zoom ---------- */

function EditImageModal({ src, shape, onCancel, onApply }) {
  const isCircle = shape === "avatar";
  const boxRef = useRef(null);
  const [box, setBox] = useState({ w: 260, h: 260 });
  const [natural, setNatural] = useState({ w: 1, h: 1 });
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const dragRef = useRef(null);

  // Measure the crop box so this works at any viewport size (phones, tablets, desktop)
  useEffect(() => {
    const measure = () => {
      if (boxRef.current) {
        setBox({ w: boxRef.current.clientWidth, h: boxRef.current.clientHeight });
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Load the source image to know its natural size
  useEffect(() => {
    const img = new window.Image();
    img.onload = () => setNatural({ w: img.naturalWidth, h: img.naturalHeight });
    img.src = src;
  }, [src]);

  const baseScale = Math.max(box.w / natural.w, box.h / natural.h) || 1;
  const scale = baseScale * zoom;
  const drawnW = natural.w * scale;
  const drawnH = natural.h * scale;

  const clamp = (nextPan, z) => {
    const s = baseScale * z;
    const dW = natural.w * s;
    const dH = natural.h * s;
    const halfX = Math.max(0, (dW - box.w) / 2);
    const halfY = Math.max(0, (dH - box.h) / 2);
    return {
      x: Math.min(halfX, Math.max(-halfX, nextPan.x)),
      y: Math.min(halfY, Math.max(-halfY, nextPan.y)),
    };
  };

  const left = (box.w - drawnW) / 2 + pan.x;
  const top = (box.h - drawnH) / 2 + pan.y;

  const onPointerDown = (e) => {
    e.currentTarget.setPointerCapture?.(e.pointerId);
    dragRef.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y };
  };
  const onPointerMove = (e) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.x;
    const dy = e.clientY - dragRef.current.y;
    setPan(clamp({ x: dragRef.current.panX + dx, y: dragRef.current.panY + dy }, zoom));
  };
  const onPointerUp = () => {
    dragRef.current = null;
  };

  const handleZoom = (val) => {
    const z = Number(val);
    setZoom(z);
    setPan((p) => clamp(p, z));
  };

  const reset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const doApply = () => {
    const img = new window.Image();
    img.onload = () => {
      const outW = Math.max(1, Math.round(box.w));
      const outH = Math.max(1, Math.round(box.h));
      const canvas = document.createElement("canvas");
      canvas.width = outW * 2;
      canvas.height = outH * 2;
      const ctx = canvas.getContext("2d");
      const s = (Math.max(outW / img.naturalWidth, outH / img.naturalHeight) || 1) * zoom * 2;
      const dW = img.naturalWidth * s;
      const dH = img.naturalHeight * s;
      const dx = (outW * 2 - dW) / 2 + pan.x * 2;
      const dy = (outH * 2 - dH) / 2 + pan.y * 2;
      ctx.drawImage(img, dx, dy, dW, dH);
      onApply(canvas.toDataURL("image/png"));
    };
    img.src = src;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={onCancel}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[420px] max-h-[90vh] overflow-y-auto rounded-xl bg-[#313338] border border-white/10 shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4">
          <h3 className="text-white font-semibold text-lg">
            {isCircle ? "Edit Avatar" : "Edit Banner"}
          </h3>
          <button onClick={onCancel} className="text-[#949ba4] hover:text-white p-1">
            <X size={18} />
          </button>
        </div>

        {/* Crop stage */}
        <div className="px-5">
          <div
            ref={boxRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
            className={
              "relative mx-auto overflow-hidden bg-[#1e1f22] touch-none select-none cursor-grab active:cursor-grabbing " +
              (isCircle ? "rounded-full" : "rounded-lg")
            }
            style={{
              width: isCircle ? "min(260px, 62vw)" : "min(100%, 420px)",
              aspectRatio: isCircle ? "1 / 1" : "3 / 1",
            }}
          >
            {natural.w > 1 && (
              <img
                src={src}
                alt="edit preview"
                draggable={false}
                className="absolute pointer-events-none"
                style={{
                  width: drawnW,
                  height: drawnH,
                  left,
                  top,
                  maxWidth: "none",
                }}
              />
            )}
            {/* ring overlay to match the reference look */}
            <div
              className={
                "pointer-events-none absolute inset-0 border-2 border-white/90 " +
                (isCircle ? "rounded-full" : "rounded-lg")
              }
            />
          </div>

          {/* Zoom slider */}
          <div className="flex items-center gap-3 mt-4 mb-1">
            <ImageIcon size={15} className="text-[#949ba4] shrink-0" />
            <input
              type="range"
              min="1"
              max="3"
              step="0.01"
              value={zoom}
              onChange={(e) => handleZoom(e.target.value)}
              className="w-full accent-[#5865f2] h-1.5 cursor-pointer"
            />
            <ImageIcon size={20} className="text-[#949ba4] shrink-0" />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-4 mt-3">
          <button
            onClick={reset}
            className="flex items-center gap-1.5 text-[#00a8fc] hover:text-[#3bb6ff] text-sm font-medium"
          >
            <RotateCw size={13} />
            Reset
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded-md text-sm font-medium text-white bg-transparent hover:underline"
            >
              Cancel
            </button>
            <button
              onClick={doApply}
              className="px-4 py-2 rounded-md text-sm font-medium text-white bg-[#5865f2] hover:bg-[#4752c4] transition-colors"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function WidgetCard({ widget, onClick, filled }) {
  return (
    <button
      onClick={onClick}
      className="relative aspect-[16/10] rounded-lg overflow-hidden group border border-white/5"
    >
      <img src={widget.img} alt="" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/40 group-hover:from-black/90 transition-colors" />
      {!filled && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="rounded-full bg-black/50 group-hover:bg-[#5865f2] transition-colors p-2 sm:p-2.5 border border-white/20">
            <Plus size={16} className="text-white sm:hidden" />
            <Plus size={18} className="text-white hidden sm:block" />
          </div>
        </div>
      )}
      <div className="absolute bottom-1.5 left-1.5 right-1.5 sm:bottom-2 sm:left-2 sm:right-2 flex items-center gap-1.5">
        {filled && (
          <span className="bg-black/60 rounded-full p-1">
            <Link2 size={10} className="text-white" />
          </span>
        )}
        <span className="text-white text-xs sm:text-sm font-semibold drop-shadow truncate">
          {widget.label}
        </span>
      </div>
    </button>
  );
}

function WidgetPickerModal({ onClose, onPick }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#2b2d31] rounded-xl w-full max-w-md max-h-[80vh] overflow-y-auto p-4 border border-white/10"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-semibold text-base">Choose a widget</h3>
          <button onClick={onClose} className="text-[#949ba4] hover:text-white p-1">
            <X size={18} />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {WIDGET_LIBRARY.map((w) => (
            <button
              key={w.id}
              onClick={() => onPick(w)}
              className="relative aspect-[16/10] rounded-lg overflow-hidden border border-white/5 hover:border-[#5865f2] transition-colors"
            >
              <img src={w.img} alt="" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/10" />
              <span className="absolute bottom-1.5 left-2 text-white text-xs font-semibold">{w.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- main component ---------- */

export default function ProfilePage() {
  const userinfo = useSelector((state) => state.authinfoSlice.userinfo);
  const [open, setOpen] = useState(true);
  const [tab, setTab] = useState("Board");

  const [name, setName] = useState(userinfo?.name || "Zaidk");
  const [username, setUsername] = useState(userinfo?.username || "zaidk0064_98925");
  const [avatar, setAvatar] = useState(userinfo?.profileimg ||DEFAULT_AVATAR);
  const [banner, setBanner] = useState(null); // null => gray fallback
 
  const [pronouns, setPronouns] = useState("");
  const [bio, setBio] = useState("");
  const [note, setNote] = useState("");
  const [connections, setConnections] = useState([]);
  const [slots, setSlots] = useState([
    { id: "marvel-rivals", label: "Marvel Rivals", img: WIDGET_LIBRARY[0].img, filled: true },
    { id: "wuthering-waves", label: "Wuthering Waves", img: WIDGET_LIBRARY[1].img, filled: true },
    { id: "arknights", label: "Arknights Endfield", img: WIDGET_LIBRARY[2].img, filled: true },
    { id: "favorite-game", label: "Favorite Game", img: WIDGET_LIBRARY[3].img, filled: false },
    { id: "games-i-like", label: "Games I Like", img: WIDGET_LIBRARY[4].img, filled: false },
    { id: "games-rotation", label: "Games in Rotation", img: WIDGET_LIBRARY[5].img, filled: false },
  ]);
  const [pickerSlot, setPickerSlot] = useState(null);
  const [addingConnection, setAddingConnection] = useState(false);
  const [connectionDraft, setConnectionDraft] = useState("");
  const [editingUsername, setEditingUsername] = useState(false);
  const [usernameDraft, setUsernameDraft] = useState(username);

  // { shape: 'avatar' | 'banner', src: rawDataUrl } while the Edit Image modal is open
  const [editingImage, setEditingImage] = useState(null);

   const dispatch = useDispatch();
  useEffect(() => {
    if (userinfo) {
      setName(userinfo.name || "");
      setUsername(userinfo.username || "");
      setUsernameDraft(userinfo.username || "");
    }
  }, [userinfo]);



  return (
    <div className="  flex items-center justify-center p-0 sm:p-4 font-sans">
      <div className="relative w-full max-w-3xl bg-[#232428] sm:rounded-xl overflow-hidden shadow-2xl min-h-[90%] sm:min-h-0">
        {/* Close button */}
        <button
          onClick={() => setOpen(dispatch(closeProfilePageSettings()))}
          className="absolute top-3 right-3 z-20 bg-black/40 hover:bg-black/60 rounded-full p-1.5 transition-colors"
        >
          <X size={16} className="text-white" />
        </button>

        <div className="flex flex-col sm:flex-row">
          {/* Left column */}
          <div className="w-full sm:w-[300px] shrink-0 bg-[#232428]">
            {/* Banner — gray fallback if none set */}
            <ImagePicker onSelectRaw={(src) => setEditingImage({ shape: "banner", src })}>
              <div
                className={
                  "relative h-[110px] sm:h-[130px] w-full group " + (banner ? "" : "bg-[#4a4d53]")
                }
              >
                {banner && (
                  <img src={banner} alt="banner" className="absolute inset-0 w-full h-full object-cover" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#232428] to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-colors">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 text-white text-xs font-medium bg-black/50 px-2.5 py-1 rounded-full">
                    <Camera size={13} />
                    {banner ? "Change banner" : "Add banner"}
                  </span>
                </div>
              </div>
            </ImagePicker>

            <div className="px-4">
              <div className="relative -mt-10 mb-2 w-fit">
                <ImagePicker onSelectRaw={(src) => setEditingImage({ shape: "avatar", src })}>
                  <div className="relative w-20 h-20 group">
                    <img
                      src={avatar}
                      alt="avatar"
                      className="w-20 h-20 rounded-full border-[5px] border-[#232428] object-cover"
                    />
                    <div className="absolute inset-[5px] rounded-full flex items-center justify-center bg-black/0 group-hover:bg-black/40 transition-colors">
                      <Camera
                        size={16}
                        className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                    </div>
                  </div>
                </ImagePicker>
                <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-[#23a55a] border-[3px] border-[#232428]" />
              </div>

              <EditableName value={name} onChange={setName} placeholder="Your name" />

              <div className="flex items-center gap-1.5 text-[#949ba4] text-xs mt-0.5 mb-3 flex-wrap">
                {editingUsername ? (
                  <div className="flex items-center gap-1">
                    <input
                      autoFocus
                      value={usernameDraft}
                      onChange={(e) => setUsernameDraft(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          setUsername(usernameDraft.trim() || username);
                          setEditingUsername(false);
                        }
                        if (e.key === "Escape") setEditingUsername(false);
                      }}
                      className="bg-[#1e1f22] border border-[#5865f2] rounded px-1.5 py-0.5 text-xs text-white outline-none w-32"
                    />
                    <button
                      onClick={() => {
                        setUsername(usernameDraft.trim() || username);
                        setEditingUsername(false);
                      }}
                      className="shrink-0 rounded-full bg-[#5865f2] hover:bg-[#4752c4] p-0.5"
                    >
                      <Check size={10} className="text-white" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setUsernameDraft(username);
                      setEditingUsername(true);
                    }}
                    className="group flex items-center gap-1 hover:text-white"
                  >
                    <span>{username}</span>
                    <Pencil size={10} className="opacity-0 group-hover:opacity-60 transition-opacity" />
                  </button>
                )}
                <span>•</span>
                <EditableText
                  value={pronouns}
                  onChange={setPronouns}
                  placeholder="Add pronouns"
                  className="text-xs text-[#949ba4] hover:text-white w-auto"
                />
              </div>

              <div className="flex items-center gap-2 mb-4">
                <button className="bg-[#2b2d31] hover:bg-[#35373c] p-2 rounded-md transition-colors">
                  <LayoutGrid size={15} className="text-white" />
                </button>
              </div>

              <div className="mb-4">
                <EditableText
                  value={bio}
                  onChange={setBio}
                  placeholder="Your life in one sentence"
                  multiline
                  className="text-[#dbdee1] text-sm hover:bg-white/5 rounded px-1 -mx-1 py-0.5"
                />
              </div>

              <div className="mb-4">
                <p className="text-[#949ba4] text-xs font-semibold uppercase tracking-wide mb-1">
                  Member Since
                </p>
                <p className="text-[#dbdee1] text-sm">Jun 14, 2026</p>
              </div>

           

              <div className="mb-4">
                <p className="text-[#949ba4] text-xs font-semibold uppercase tracking-wide mb-1.5">
                  Connections
                </p>
                {connections.map((c, i) => (
                  <div key={i} className="text-[#dbdee1] text-sm py-0.5">
                    {c}
                  </div>
                ))}
                {addingConnection ? (
                  <div className="flex items-center gap-1.5 mt-1">
                    <input
                      autoFocus
                      value={connectionDraft}
                      onChange={(e) => setConnectionDraft(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && connectionDraft.trim()) {
                          setConnections([...connections, connectionDraft.trim()]);
                          setConnectionDraft("");
                          setAddingConnection(false);
                        }
                        if (e.key === "Escape") setAddingConnection(false);
                      }}
                      placeholder="e.g. Spotify, GitHub"
                      className="bg-[#1e1f22] border border-[#5865f2] rounded-md px-2 py-1 text-sm text-white outline-none flex-1"
                    />
                    <button
                      onClick={() => {
                        if (connectionDraft.trim()) {
                          setConnections([...connections, connectionDraft.trim()]);
                          setConnectionDraft("");
                        }
                        setAddingConnection(false);
                      }}
                      className="shrink-0 rounded-full bg-[#5865f2] hover:bg-[#4752c4] p-1"
                    >
                      <Check size={12} className="text-white" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setAddingConnection(true)}
                    className="flex items-center gap-1 text-[#00a8fc] hover:text-[#3bb6ff] text-sm mt-1"
                  >
                    <Plus size={14} /> Add Connection
                  </button>
                )}
              </div>

              <div className="mb-4">
                <p className="text-[#949ba4] text-xs font-semibold uppercase tracking-wide mb-1">
                  Note (only visible to you)
                </p>
                <EditableText
                  value={note}
                  onChange={setNote}
                  placeholder="Click to add a note"
                  multiline
                  className="text-[#949ba4] text-sm hover:bg-white/5 rounded px-1 -mx-1 py-0.5"
                />
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="flex-1 bg-[#232428] p-4 sm:p-5 min-w-0">
            <div className="flex items-center gap-4 sm:gap-5 border-b border-white/10 mb-6 overflow-x-auto">
              {["Board", "Activity", "Wishlist"].map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={
                    "pb-2.5 text-sm font-medium relative transition-colors whitespace-nowrap " +
                    (tab === t ? "text-white" : "text-[#949ba4] hover:text-white")
                  }
                >
                  {t}
                  {tab === t && (
                    <span className="absolute left-0 right-0 -bottom-px h-[2px] bg-white rounded-full" />
                  )}
                </button>
              ))}
            </div>

            {tab === "Board" && (
              <>
                <div className="text-center mb-5">
                  <h3 className="text-white font-semibold text-base mb-1">
                    Customize your profile with Widgets
                  </h3>
                  <p className="text-[#949ba4] text-sm max-w-sm mx-auto">
                    Choose from our library of Widgets to share more about yourself and your interests
                  </p>
                </div>
                <div className="max-h-[52vh] overflow-y-auto grid grid-cols-2 gap-2.5 sm:gap-3">
                  {slots.map((s, i) => (
                    <WidgetCard key={s.id} widget={s} filled={s.filled} onClick={() => setPickerSlot(i)} />
                  ))}
                </div>
              </>
            )}

            {tab === "Activity" && (
              <div className="text-[#949ba4] text-sm text-center py-16">No recent activity to show.</div>
            )}

            {tab === "Wishlist" && (
              <div className="text-[#949ba4] text-sm text-center py-16">The wishlist is empty.</div>
            )}
          </div>
        </div>
      </div>

      {pickerSlot !== null && (
        <WidgetPickerModal
          onClose={() => setPickerSlot(null)}
          onPick={(w) => {
            const next = [...slots];
            next[pickerSlot] = { ...w, filled: true };
            setSlots(next);
            setPickerSlot(null);
          }}
        />
      )}

      {editingImage && (
        <EditImageModal
          src={editingImage.src}
          shape={editingImage.shape}
          onCancel={() => setEditingImage(null)}
          onApply={(dataUrl) => {
            if (editingImage.shape === "avatar") setAvatar(dataUrl);
            else setBanner(dataUrl);
            setEditingImage(null);
          }}
        />
      )}
    </div>
  );
}