import React from "react";
import { HiChevronDown, HiCog6Tooth } from "react-icons/hi2";
import { BsMicMuteFill, BsHeadphones } from "react-icons/bs";
import { User } from "lucide-react";
import { motion } from "framer-motion";
import { tapScale } from "../ui/motion.js";

const AVATAR_DECORATION_URL =
  "https://cdn.discordapp.com/media/v1/collectibles-shop/1256321669467865088/animated";

export default function UserPanel(props) {
  const { userinfo,setIsOpen } = props;
  console.log(userinfo)
  return (
  <motion.div
 onClick={() => setIsOpen(prev => !prev)}
  whileTap={tapScale}
  className="cursor-pointer w-full max-w-[440px] h-16 bg-[#0f0f0f] hover:bg-[#181b24] rounded-xl flex items-center justify-between px-2 sm:px-3 shadow-lg transition-colors gap-14"
>
      {/* Left */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <div className="relative w-11 h-11 shrink-0 flex items-center justify-center">
          {/* Avatar */}
          <img
            src={
              (userinfo && userinfo.profileimg) ||
              "https://i.pinimg.com/originals/f6/5d/f3/f65df37ea7c3cc3f65f8c29906a81eef.gif"
            }

            alt=""
            className="w-9 h-9 rounded-full object-cover"
          />
          {/* Avatar decoration (animated, sits slightly larger than the avatar, overlapping edges) */}
          <img
            src={
              (userinfo && userinfo.avatarDecoration) || AVATAR_DECORATION_URL
            }

            alt=""
            className="pointer-events-none absolute -inset-0.5 w-12 h-12 object-contain"
          />
          {/* Online status dot */}
          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#23a55a] border-[2px] border-[#232428] rounded-full z-10"></span>
        </div>
        <div className="leading-none min-w-0">
          <h2 className="text-white font-semibold text-[15px] truncate">
            {(userinfo && userinfo.name) || "User"}
          </h2>
          <p className="text-gray-400 text-xs mt-1">Online</p>
        </div>
      </div>
      {/* Right */}
      <div className="flex items-center gap-1 shrink-0">
        {/* Mic */}
        <button className="hidden min-[380px]:flex w-9 h-9 rounded-lg bg-[#5d2028] hover:bg-[#6b242d] items-center justify-center transition-colors active:scale-95">
          <BsMicMuteFill size={18} className="text-[#f23f43]" />
        </button>
        {/* Arrow */}
        <button className="w-6 h-9 rounded-lg hover:bg-[#36373d] flex items-center justify-center transition-colors active:scale-95">
          <HiChevronDown size={16} className="text-gray-300" />
        </button>
        {/* Headphone */}
        <button className="hidden sm:flex w-9 h-9 rounded-lg hover:bg-[#36373d] items-center justify-center transition-colors active:scale-95">
          <BsHeadphones size={18} className="text-gray-300" />
        </button>
        {/* Settings */}
        <button className="hidden sm:flex w-9 h-9 rounded-lg hover:bg-[#36373d] items-center justify-center transition-colors active:scale-95">
          <HiCog6Tooth size={21} className="text-gray-300" />
        </button>
      </div>
    </motion.div>
  );
}
