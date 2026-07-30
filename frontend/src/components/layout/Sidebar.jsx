import React from "react";
import {
  FaDiscord,
  FaPlus,
  FaCompass,
} from "react-icons/fa";
import { User } from "lucide-react";
import { HiArrowDownTray } from "react-icons/hi2";

const servers = [
  {
    id: 1,
    image:
      "https://cdn-icons-png.flaticon.com/512/5968/5968756.png",
  },
  {
    id: 2,
    image:
      "https://cdn-icons-png.flaticon.com/512/5968/5968705.png",
    badge: true,
  },
  {
    id: 3,
    image:
      "https://i.pravatar.cc/100?img=12",
  },
  {
    id: 4,
    image:
      "https://i.pravatar.cc/100?img=22",
    badge: true,
  },
];

export default function Sidebar() {
  return (
    <div className="w-[62px] h-screen bg-[#1e1f22] flex flex-col items-center py-2">

      {/* Discord Logo */}
      <button className="w-11 h-11 rounded-2xl bg-[#313338] hover:bg-[#5865F2] transition-all duration-200 flex items-center justify-center text-white">
        <img src="./Frame 12 (2).png" alt="" className="w-9 h-9 object-contain" />
      </button>

      {/* Divider */}
      <div className="w-5 h-[2px] bg-[#3f4147] rounded-full my-2"></div>

      {/* Servers */}
      <div className="flex flex-col gap-1.5">
        {servers.map((server) => (
          <div key={server.id} className="relative group">

            {/* Green Indicator */}
            <span className="absolute left-[-10px] top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-[#23a55a]"></span>

            <button className="w-9 h-9 rounded-2xl overflow-hidden bg-[#313338] hover:rounded-xl transition-all duration-200">
              <img
                src={server.image}
                alt=""
                className="w-full h-full object-cover"
              />
            </button>

            {server.badge && (
              <span className="absolute -right-1 -top-1 w-5 h-5 rounded-full text-white bg-black border-2 border-[#1e1f22] flex items-center justify-center text-[7px]">
                <User  />
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Spacer */}
      <div className="flex-1"></div>

      {/* Bottom Buttons */}
      <div className="flex flex-col gap-1.5">

        <button className="w-8 h-8 rounded-2xl bg-[#313338] hover:bg-[#23a55a] transition flex items-center justify-center text-white">
          <FaPlus size={12} />
        </button>

        <button className="w-8 h-8 rounded-2xl bg-[#313338] hover:bg-[#23a55a] transition flex items-center justify-center text-white">
          <FaCompass size={14} />
        </button>

        <button className="w-8 h-8 rounded-2xl bg-[#313338] hover:bg-[#23a55a] transition flex items-center justify-center text-white">
          <HiArrowDownTray size={14} />
        </button>

      </div>
    </div>
  );
}