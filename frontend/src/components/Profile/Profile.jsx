import React, { useState, useRef, useEffect } from "react";
import { HiChevronDown, HiCog6Tooth } from "react-icons/hi2";
import { BsMicMuteFill, BsHeadphones } from "react-icons/bs";
import { Pencil, ChevronRight, User } from "lucide-react";

// UserPanel.jsx
// export default function UserPanel({ userinfo = {}, isOpen, onToggle }) {
export default function UserPanel(userinfo) {
  const containerRef = useRef(null);
  console.log(userinfo)
  const user ="Zaid khan";
  const profileImg ="https://i.pinimg.com/originals/f6/5d/f3/f65df37ea7c3cc3f65f8c29906a81eef.gif";
  const displayName =userinfo.userinfo.name||"User";
  const handle =  "zaidk0064_98925";
  const statusText = "hi";

//   if (!isOpen) return null; // or keep the trigger button always visible and only guard the popup

  return (
    <div className="relative inline-block" ref={containerRef}>
      {/* Profile Popup */}

      <div className="absolute bottom-[72px] left-0 w-[300px] bg-[#111214] rounded-xl overflow-hidden shadow-2xl z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
        {/* Banner */}
        <div className="h-[100px] bg-[#00709c] relative">
          <div className="absolute -bottom-7 left-4">
            <div className="relative w-[72px] h-[72px]">
              {/* Animated Frame */}
              <img
                src="https://cdn.discordapp.com/media/v1/collectibles-shop/1252404745977462836/animated"
                alt=""
                className="absolute -inset-3 top-[-17px] left-[-6px] w-[96px] h-[96px] object-contain pointer-events-none z-20"
              />
              <img
                src={profileImg}
                alt=""
                className="w-[60px] h-[60px] rounded-full object-cover relative z-10 border-[5px] border-[#111214]"
              />
              {/* Status */}
              <div className="absolute bottom-2.5 right-2.5 w-5 h-5 bg-[#111214] rounded-full flex items-center justify-center z-30">
                <div className="w-3.5 h-3.5 bg-[#23a55a] rounded-full" />
              </div>
              {/* Status Bubble */}
              <div className="absolute -bottom-1 -right-10 bg-[#232428] px-2 py-0.5 rounded-full text-xs text-white z-30 border border-[#111214]">
                {statusText}
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="pt-10 px-4 pb-4">
          <h2 className="text-white font-bold text-xl">{displayName}</h2>
          <p className="text-[#b5bac1] text-sm">{handle}</p>

          <div className="mt-4 space-y-0.5">
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#232428] text-[#b5bac1] hover:text-white transition-colors text-sm">
              <Pencil size={16} />
              <span>Edit Profile</span>
            </button>

            <button className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[#232428] text-[#b5bac1] hover:text-white transition-colors text-sm">
              <div className="flex items-center gap-3">
                <div className="w-3.5 h-3.5 rounded-full bg-[#23a55a]" />
                <span>Online</span>
              </div>
              <ChevronRight size={16} />
            </button>

            <button className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[#232428] text-[#b5bac1] hover:text-white transition-colors text-sm">
              <div className="flex items-center gap-3">
                <User size={16} />
                <span>Switch Accounts</span>
              </div>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
