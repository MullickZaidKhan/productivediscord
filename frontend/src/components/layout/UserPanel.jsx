// import React from "react";
// import { HiChevronDown, HiCog6Tooth } from "react-icons/hi2";
// import { BsMicMuteFill, BsHeadphones } from "react-icons/bs";
// import { User } from "lucide-react";
// import { motion } from "framer-motion";
// import { tapScale } from "../ui/motion.js";
// import { useDispatch } from "react-redux";
// import { openAccountSettings } from "../../redux/settings/settingspage.js";

// const AVATAR_DECORATION_URL =
//   "https://cdn.discordapp.com/media/v1/collectibles-shop/1256321669467865088/animated";

// export default function UserPanel(props) {
//   const { userinfo, setIsOpen } = props;
//   const dispatch = useDispatch();

//   return (
//     <motion.div
     
//       whileTap={tapScale}
//       className="cursor-pointer w-full max-w-[100%] h-16 bg-[#0f0f0f] hover:bg-[#181b24] rounded-xl flex items-center justify-between px-2 sm:px-3 shadow-lg transition-colors gap-14"
//     >
//       {/* Left */}
//       <div className="flex items-center gap-2 sm:gap-3 min-w-0"  onClick={() => setIsOpen((prev) => !prev)}>
//         <div className="relative w-11 h-11 shrink-0 flex items-center justify-center">
//           {/* Avatar */}
//           <img
//             src={
//               (userinfo && userinfo.profileimg) ||
//               "https://ik.imagekit.io/w5wx4gdmoj/discord_products/Frame%206.png?updatedAt=1786460933931"
//             }
//             alt=""
//             className="w-9 h-9 rounded-full object-cover"
//           />
//           {/* Avatar decoration (animated, sits slightly larger than the avatar, overlapping edges) */}
//           <img
//             src={
//               (userinfo && userinfo.avatarDecoration) || AVATAR_DECORATION_URL
//             }
//             alt=""
//             className="pointer-events-none absolute -inset-0.5 w-12 h-12 object-contain"
//           />
//           {/* Online status dot */}
//           <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#23a55a] border-[2px] border-[#232428] rounded-full z-10"></span>
//         </div>
//         <div className="leading-none min-w-0">
//           <h2 className="text-white font-semibold text-[15px] truncate">
//             {(userinfo && userinfo.name) || "User"}
//           </h2>
//           <p className="text-gray-400 text-xs mt-1">Online</p>
//         </div>
//       </div>
//       {/* Right */}
//       <div className="flex items-center gap-1 shrink-0">
//         {/* Mic */}
//         <button className="hidden min-[380px]:flex w-9 h-9 rounded-lg bg-[#5d2028] hover:bg-[#6b242d] items-center justify-center transition-colors active:scale-95">
//           <BsMicMuteFill size={18} className="text-[#f23f43]" />
//         </button>
//         {/* Arrow */}
//         <button className="w-6 h-9 rounded-lg hover:bg-[#36373d] flex items-center justify-center transition-colors active:scale-95">
//           <HiChevronDown size={16} className="text-gray-300" />
//         </button>
//         {/* Headphone */}
//         <button className="hidden sm:flex w-9 h-9 rounded-lg hover:bg-[#36373d] items-center justify-center transition-colors active:scale-95">
//           <BsHeadphones size={18} className="text-gray-300" />
//         </button>
//         {/* Settings */}
//         <button onClick={() => dispatch(openAccountSettings())} className="hidden sm:flex w-9 h-9 rounded-lg hover:bg-[#36373d] items-center justify-center transition-colors active:scale-95">
//           <HiCog6Tooth size={21} className="text-gray-300" />
//         </button>
//       </div>
//     </motion.div>
//   );
// }
import React from "react";
import { HiChevronDown, HiCog6Tooth } from "react-icons/hi2";
import { BsMicMuteFill, BsHeadphones } from "react-icons/bs";
import { motion } from "framer-motion";
import { tapScale } from "../ui/motion.js";
import { useDispatch } from "react-redux";
import { openAccountSettings } from "../../redux/settings/settingspage.js";

const AVATAR_DECORATION_URL =
  "https://cdn.discordapp.com/media/v1/collectibles-shop/1256321669467865088/animated";

export default function UserPanel(props) {
  const { userinfo, setIsOpen } = props;
  const dispatch = useDispatch();

  return (
  <motion.div
  whileTap={tapScale}
  className="cursor-pointer w-[90%] mx-auto min-[400px]:w-full min-[400px]:mx-0 h-12 sm:h-14 md:h-16 bg-[#0f0f0f] hover:bg-[#181b24] rounded-xl flex items-center justify-between px-1.5 sm:px-2.5 md:px-3 shadow-lg transition-colors gap-2"
>
      {/* Left */}
      <div
        className="flex items-center gap-1.5 sm:gap-2 md:gap-3 min-w-0 flex-1"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <div className="relative w-8 h-8 sm:w-9 sm:h-9 md:w-11 md:h-11 shrink-0 flex items-center justify-center">
          {/* Avatar */}
          <img
            src={
              (userinfo && userinfo.profileimg) ||
              "https://ik.imagekit.io/w5wx4gdmoj/discord_products/Frame%206.png?updatedAt=1786460933931"
            }
            alt=""
            className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full object-cover"
          />
          {/* Avatar decoration */}
          <img
            src={
              (userinfo && userinfo.avatarDecoration) || AVATAR_DECORATION_URL
            }
            alt=""
            className="pointer-events-none absolute -inset-0.5 w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 object-contain"
          />
          {/* Online status dot */}
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 bg-[#23a55a] border-[1.5px] sm:border-[2px] border-[#232428] rounded-full z-10"></span>
        </div>
        <div className="leading-none min-w-0">
          <h2 className="text-white font-semibold text-[12px] sm:text-[13px] md:text-[15px] truncate">
            {(userinfo && userinfo.name) || "User"}
          </h2>
          <p className="text-gray-400 text-[10px] sm:text-[11px] md:text-xs mt-0.5 sm:mt-1">
            Online
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
        {/* Mic */}
        <button className="flex w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-lg bg-[#5d2028] hover:bg-[#6b242d] items-center justify-center transition-colors active:scale-95">
          <BsMicMuteFill size={14} className="text-[#f23f43] sm:hidden" />
          <BsMicMuteFill size={16} className="text-[#f23f43] hidden sm:block md:hidden" />
          <BsMicMuteFill size={18} className="text-[#f23f43] hidden md:block" />
        </button>
        {/* Arrow */}
        <button className="flex w-5 h-7 sm:w-6 sm:h-8 md:w-6 md:h-9 rounded-lg hover:bg-[#36373d] items-center justify-center transition-colors active:scale-95">
          <HiChevronDown size={14} className="text-gray-300" />
        </button>
        {/* Headphone */}
        <button className="flex w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-lg hover:bg-[#36373d] items-center justify-center transition-colors active:scale-95">
          <BsHeadphones size={14} className="text-gray-300 sm:hidden" />
          <BsHeadphones size={16} className="text-gray-300 hidden sm:block md:hidden" />
          <BsHeadphones size={18} className="text-gray-300 hidden md:block" />
        </button>
        {/* Settings */}
        <button
          onClick={() => dispatch(openAccountSettings())}
          className="flex w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-lg hover:bg-[#36373d] items-center justify-center transition-colors active:scale-95"
        >
          <HiCog6Tooth size={16} className="text-gray-300 sm:hidden" />
          <HiCog6Tooth size={18} className="text-gray-300 hidden sm:block md:hidden" />
          <HiCog6Tooth size={21} className="text-gray-300 hidden md:block" />
        </button>
      </div>
    </motion.div>
  );
}