import { useState, useRef, useEffect } from "react";
import {
  Calendar, Users, Shield, ChevronDown, Hash, Volume2, Plus, UserPlus, Settings,
  MicOff, Headphones, MessagesSquare, Bell, Pin, Search, Gift, Smile, Sticker,
  Sparkles, Gamepad2, Crown, Code, Maximize2, MoreHorizontal, Bot, Box, User, Play,
} from "lucide-react";

/* ============ SECTION 0: Little animation (only 3 things) ============ */
const Styles = () => (
  <style>{`
    @keyframes pop { from { opacity:0; transform: translateY(8px);} to { opacity:1; transform:none;} }
    @keyframes ping2 { 0%,100%{ box-shadow:0 0 0 0 rgba(35,165,90,.6);} 50%{ box-shadow:0 0 0 6px rgba(35,165,90,0);} }
    .a-pop { animation: pop .3s ease-out both; }   /* new message */
    .a-ping { animation: ping2 2s infinite; }      /* online dot */
    @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }
  `}</style>
);

/* ============ SECTION 1: Data ============ */
const voiceChannels = [
  { name: "General", emoji: "😝" },
  { name: "Full Stack Developer", emoji: "🧑‍💻" },
  { name: "Ai-Implementation", emoji: "🤖" },
  { name: "vibe-coding", emoji: "👶" },
];
const activities = [
  { user: "Stormkoro1", game: "Minecraft", ago: "2w ago", tag: "New Player", color: "bg-emerald-600" },
  { user: "Prashant", game: "Roblox", ago: "5d ago", tag: "New Player", color: "bg-slate-500" },
  { user: "Stormkoro1", game: "Roblox", ago: "5d ago", tag: "", color: "bg-slate-500" },
];
const offline = ["Aayushmaan Jaiswal", "Gravechill001"];
const code = `#include <stdio.h>
#include <math.h>

#ifndef M_PI
#define M_PI 3.14159265358979323846
#endif`;

const Avatar = ({ size = "w-9 h-9" }) => (
  <div className={`${size} shrink-0 rounded-full bg-cyan-500 grid place-items-center text-white`}>
    <Bot size={18} />
  </div>
);

/* ============ SECTION 2: Sidebar ============ */
const Sidebar = () => (
  <aside className="hidden pt-8 h-screen md:flex w-56 shrink-0 flex-col bg-[#121316ad] border-r border-white/5">
    <div className="flex items-center justify-between px-4 h-12 border-b border-white/5 text-white">
      <span className="flex items-center gap-1 text-sm font-bold">Zaid's <ChevronDown size={15} /></span>
      <UserPlus size={16} className="text-gray-400 hover:text-white transition-colors cursor-pointer" />
    </div>

    <nav className="px-3 pt-3 space-y-1 text-gray-400">
      {[[Calendar, "Events"], [Users, "Members"], [Shield, "Server Boosts"]].map(([Icon, t]) => (
        <div key={t} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/5 hover:text-white cursor-pointer transition-colors">
          <Icon size={16} /> {t}
        </div>
      ))}
    </nav>

    <div className="px-3 mt-5 flex-1 overflow-y-auto">
      <p className="px-2 flex items-center justify-between text-sm text-gray-400">
        <span className="flex items-center gap-1">Text Channels <ChevronDown size={12} /></span><Plus size={14} />
      </p>
      <div className="mt-1 flex items-center gap-2 px-3 py-2 rounded-md bg-white/10 text-white text-sm">
        <Hash size={16} /> general
        <span className="ml-auto flex gap-2 text-gray-300"><UserPlus size={14} /><Settings size={14} /></span>
      </div>

      <p className="px-2 mt-4 flex items-center justify-between text-sm text-gray-400">
        <span className="flex items-center gap-1">Voice Channels <ChevronDown size={12} /></span><Plus size={14} />
      </p>
      {voiceChannels.map((v) => (
        <div key={v.name} className="mt-1 flex items-center gap-2 px-3 py-2 rounded-md text-gray-400 hover:bg-white/5 hover:text-white cursor-pointer transition-colors">
          <Volume2 size={16} /> {v.name} <span>{v.emoji}</span>
        </div>
      ))}
    </div>

    {/* <div className="m-2 p-2 rounded-lg bg-gradient-to-r from-slate-700 to-slate-500 flex items-center gap-3 text-white">
      <div className="relative">
        <Avatar size="w-8 h-8" />
        <span className="a-ping absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-slate-600" />
      </div>
      <div className="flex-1 leading-tight"><p className="font-semibold">Zaid</p><p className="text-xs text-gray-200">Online</p></div>
      <MicOff size={15} className="text-red-400" /><Headphones size={15} /><Settings size={15} />
    </div> */}
  </aside>
);

/* ============ SECTION 3: Chat header ============ */
const ChatHeader = () => (
  <header className="flex items-center  py-2.5 justify-between h-12 px-4 border-b border-white/5 bg-[#16171ab6]">
    <h2 className="flex items-center gap-2 text-base font-semibold text-white"><Hash className="text-gray-500" size={20} /> general</h2>
    <div className="flex items-center gap-3 text-gray-300">
      {[MessagesSquare, Bell, Pin, Users].map((Icon, i) => (
        <Icon key={i} size={16} className="hover:text-white cursor-pointer transition-colors" />
      ))}
      <div className="hidden sm:flex items-center gap-2 w-44 px-3 py-1.5 rounded-md bg-[#0e0f11] border border-white/10 text-sm text-gray-400">
        <input placeholder="Search Zaid's" className="flex-1 bg-transparent outline-none placeholder:text-gray-500" />
        <Search size={14} />
      </div>
    </div>
  </header>
);

/* ============ SECTION 4: Messages ============ */
const GameInvite = () => (
  <div className="max-w-sm rounded-2xl p-4 bg-gradient-to-br from-amber-800 to-amber-950 text-white">
    <p className="font-semibold text-amber-100">Game Invitation</p>
    <div className="flex items-center gap-3 mt-3">
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-green-600 grid place-items-center"><Gamepad2 size={24} /></div>
      <div><p className="text-base font-bold">Kour.io</p><p className="text-sm text-amber-100">Game ended. Start a new one?</p></div>
    </div>
    <button className="mt-4 w-full py-2 rounded-lg bg-white text-black text-sm flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors">
      <Play size={15} /> Play
    </button>
  </div>
);

const CodeCard = () => {
  const [open, setOpen] = useState(true);
  return (
    <div className="max-w-sm rounded-xl border border-white/10 bg-[#1b1c20] overflow-hidden">
      {open && <pre className="px-4 py-4 text-[12px] text-gray-200 font-mono leading-5">{code}</pre>}
      <div className="flex items-center gap-3 px-4 py-2 bg-[#222328] text-gray-200">
        <button onClick={() => setOpen(!open)} className="w-8 h-8 grid place-items-center rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
          <ChevronDown size={16} className={`transition-transform ${open ? "" : "-rotate-90"}`} />
        </button>
        <div className="flex-1"><p className="font-medium">message.txt</p><p className="text-sm text-gray-400">4 KB</p></div>
        <Code size={16} /><Maximize2 size={16} /><MoreHorizontal size={16} />
      </div>
    </div>
  );
};

const Message = ({ time, children, anim }) => (
  <div className={`${anim ? "a-pop" : ""} flex gap-3 px-2 py-2 rounded-lg hover:bg-white/[0.03] transition-colors`}>
    <Avatar />
    <div className="min-w-0">
      <p className="flex items-center gap-2">
        <span className="text-emerald-400 font-medium">Zaid</span>
        <span className="px-1.5 text-xs font-bold text-white bg-white/10 rounded">CODE</span>
        <span className="text-sm text-gray-400">{time}</span>
      </p>
      <div className="mt-2 text-gray-100">{children}</div>
    </div>
  </div>
);

const Messages = ({ sent }) => {
  const end = useRef(null);
  useEffect(() => { end.current?.scrollIntoView({ behavior: "smooth" }); }, [sent]);
  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
      <GameInvite />
      <Message time="Yesterday at 3:42 PM"><CodeCard /></Message>
      {sent.map((m, i) => <Message key={i} time="Just now" anim><p>{m}</p></Message>)}
      <div ref={end} />
    </div>
  );
};

/* ============ SECTION 5: Message input ============ */
const MessageInput = ({ onSend }) => {
  const [v, setV] = useState("");
  const submit = () => { if (v.trim()) { onSend(v.trim()); setV(""); } };
  return (
    <div className="px-4 pb-4">
      <div className="flex items-center gap-3 rounded-xl bg-[#1d1e22a0] px-4 py-2 border border-transparent focus-within:border-indigo-400 transition-colors">
        <Plus size={18} className="text-gray-400" />
        <input value={v} onChange={(e) => setV(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="Message #general" className="flex-1 bg-transparent text-white outline-none placeholder:text-gray-500" />
        <Gift size={18} className="text-gray-400 hover:text-white cursor-pointer transition-colors" />
        <span className="px-1 text-xs font-bold rounded bg-gray-400 text-[#1d1e22]">GIF</span>
        <Sticker size={18} className="text-gray-400 hover:text-white cursor-pointer transition-colors" />
        <Smile size={18} className="text-gray-400 hover:text-white cursor-pointer transition-colors" />
        <Sparkles size={18} className="text-gray-400 hover:text-white cursor-pointer transition-colors" />
      </div>
    </div>
  );
};

/* ============ SECTION 6: Member panel ============ */
const MemberPanel = () => (
  <aside className="hidden lg:block w-60 shrink-0 bg-[#121316ba] border-l border-white/5 p-4 h-screen  pt-8 overflow-y-auto">
    <p className="flex items-center gap-1 text-gray-400 mb-3">Activity — 16 <Settings size={12} /></p>
    <div className="space-y-3">
      {activities.map((a, i) => (
        <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-[#1d1e22] hover:bg-[#25262b] transition-colors">
          <div>
            <p className="text-gray-300">{a.user}</p>
            <p className="font-semibold text-white">{a.game}</p>
            <p className="flex items-center gap-1 text-sm text-gray-400">
              <Gamepad2 size={12} /> {a.ago} {a.tag && <span className="ml-2 text-green-400">{a.tag}</span>}
            </p>
          </div>
          <div className={`w-10 h-10 rounded-lg ${a.color} grid place-items-center text-white`}><Box size={20} /></div>
        </div>
      ))}
    </div>

    <p className="mt-4 mb-2 text-gray-400">Online — 1</p>
    <div className="flex items-center gap-3 p-2 rounded-lg bg-gradient-to-r from-slate-800 to-slate-500 text-emerald-400 font-medium">
      <Avatar size="w-8 h-8" /> Zaid <Crown size={14} className="text-yellow-400" />
    </div>

    <p className="mt-4 mb-2 text-gray-400">Offline — 11</p>
    {offline.map((n) => (
      <div key={n} className="flex items-center gap-3 p-2 opacity-50 hover:opacity-100 transition-opacity">
        <div className="w-8 h-8 rounded-full bg-indigo-500/60 grid place-items-center text-white"><User size={16} /></div>
        <span className="text-gray-300">{n}</span>
      </div>
    ))}
  </aside>
);

/* ============ FINAL: join all sections ============ */
export default function App() {
  const [sent, setSent] = useState([]);
  return (
    <div className="h-screen flex justify-center items-center  bg-[#16171ab5] text-sm">
      <Styles />
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 pt-3 h-screen bg-[#1d1e22b2] ">
        <ChatHeader />
        <Messages sent={sent} />
        <MessageInput onSend={(m) => setSent((s) => [...s, m])} />
      </main>
      <MemberPanel />
    </div>
  );
}