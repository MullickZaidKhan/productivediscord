import React from "react";
import {
  HiChevronDown,
  HiCog6Tooth,
} from "react-icons/hi2";

import {
  BsMicMuteFill,
  BsHeadphones,
} from "react-icons/bs";
import { User } from "lucide-react";

export default function UserPanel(data) {
  console.log(data)
  return (
    <div className="w-[340px] h-16 bg-[#232428] rounded-xl flex items-center justify-between px-3 shadow-lg">
      {/* Left */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <img
            src={data && data.userinfo.profileimg || "https://i.pinimg.com/originals/f6/5d/f3/f65df37ea7c3cc3f65f8c29906a81eef.gif" }
            alt=""
            className="w-10 h-10 rounded-full object-cover"
          />

          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#23a55a] border-[2px] border-[#232428] rounded-full"></span>
        </div>

        <div className="leading-none">
          <h2 className="text-white font-semibold text-[15px]">
           {data && data.userinfo.name || "User"}  
          </h2>

          <p className="text-gray-400 text-xs mt-1">
            Online
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1">
        {/* Mic */}
        <button className="w-9 h-9 rounded-lg bg-[#5d2028] hover:bg-[#6b242d] flex items-center justify-center transition">
          <BsMicMuteFill
            size={18}
            className="text-[#f23f43]"
          />
        </button>

        {/* Arrow */}
        <button className="w-6 h-9 rounded-lg hover:bg-[#36373d] flex items-center justify-center transition">
          <HiChevronDown
            size={16}
            className="text-gray-300"
          />
        </button>

        {/* Headphone */}
        <button className="w-9 h-9 rounded-lg hover:bg-[#36373d] flex items-center justify-center transition">
          <BsHeadphones
            size={18}
            className="text-gray-300"
          />
        </button>

        {/* Settings */}
        <button className="w-9 h-9 rounded-lg hover:bg-[#36373d] flex items-center justify-center transition">
          <HiCog6Tooth
            size={21}
            className="text-gray-300"
          />
        </button>
      </div>
    </div>
  );
}