import React from "react";
import {
  FaDiscord,
  FaPlus,
  FaCompass,
} from "react-icons/fa";
import { Volume2 } from "lucide-react";
import { HiArrowDownTray } from "react-icons/hi2";
import { motion } from "framer-motion";
import { staggerContainer, fadeInUp, tapScale } from "../ui/motion.js";

const servers = [
  {
    id: 1,
    image:
      "https://i.pinimg.com/736x/98/c9/c6/98c9c69a7816ad5107b06d654c733bd9.jpg",
  },
  {
    id: 2,
    image:
      "https://i.pinimg.com/736x/7e/b0/ad/7eb0ad3404f6a6325b6f67cb2708b9ca.jpg",
    badge: true,
  },
  {
    id: 3,
    image:
      "https://i.pinimg.com/1200x/52/f0/b2/52f0b21596c0e80fca993cdfb12f1fed.jpg",
  },
  {
    id: 4,
    image:
      "https://i.pinimg.com/736x/88/02/27/880227df5154f2c7365701592d36d306.jpg",
    badge: true,
  },
];

export default function Sidebar() {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={staggerContainer(0.05)}
      className="w-14 sm:w-[66px] shrink-0 p-1.5 sm:p-2.5 h-screen overflow-y-auto bg-[#1e1f22] flex flex-col items-center py-3 sm:py-6"
    >
      {/* Discord Logo */}
      <motion.button
        variants={fadeInUp}
        whileHover={{ scale: 1.05 }}
        whileTap={tapScale}
        className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#313338] hover:bg-[#4650be] transition-colors duration-200 flex items-center justify-center text-white"
      >
        <img src="./Frame 12 (2).png" alt="" className="w-9 h-9 sm:w-10 sm:h-10 object-contain" />
      </motion.button>

      {/* Divider */}
      <div className="w-5 h-0.5 bg-[#3f4147] rounded-full my-2"></div>

      {/* Servers */}
      <div className="flex flex-col mt-2.5 gap-1.5">
        {servers.map((server) => (
          <motion.div key={server.id} variants={fadeInUp} className="relative group">

            {/* Green Indicator */}
            <span className="absolute -left-2.5 top-1/2 -translate-y-1/2 h-6 w-1 rounded-[1vw] bg-[#fcfcfca9] scale-y-0 group-hover:scale-y-100 transition-transform duration-200 origin-center"></span>

            <motion.button
              whileHover={{ scale: 1.05, borderRadius: "10px" }}
              whileTap={tapScale}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-[15px] overflow-hidden bg-[#313338] transition-colors duration-200"
            >
              <img
                src={server.image}
                alt=""
                className="w-full h-full object-cover "
              />
            </motion.button>

            {server.badge && (
              <span className="absolute -right-1 -top-1 w-5 h-5 rounded-[15px] text-white p-0.5 bg-[#252525] border-2 border-[#1e1f22] flex items-center justify-center text-[7px]">
                <Volume2  />
              </span>
            )}
          </motion.div>
        ))}
      </div>

      {/* Bottom Buttons */}
      <div className="flex flex-col gap-2.5 mb-5 mt-2.5">

        <motion.button
          variants={fadeInUp}
          whileHover={{ scale: 1.05 }}
          whileTap={tapScale}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-[1vw] bg-[#313338] hover:bg-[#23a55a] transition-colors flex items-center justify-center text-white"
        >
          <FaPlus size={16} />
        </motion.button>

        <motion.button
          variants={fadeInUp}
          whileHover={{ scale: 1.05 }}
          whileTap={tapScale}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-[1vw] bg-[#313338] hover:bg-[#23a55a] transition-colors flex items-center justify-center text-white"
        >
          <FaCompass size={17} />
        </motion.button>

        <motion.button
          variants={fadeInUp}
          whileHover={{ scale: 1.05 }}
          whileTap={tapScale}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-[1vw] bg-[#313338] hover:bg-[#23a55a] transition-colors flex items-center justify-center text-white"
        >
          <HiArrowDownTray size={19} />
        </motion.button>

      </div>
    </motion.div>
  );
}