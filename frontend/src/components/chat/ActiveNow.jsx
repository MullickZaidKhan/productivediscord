import React from 'react';
import { motion } from 'framer-motion';
import { staggerContainer, fadeInUp } from '../ui/motion.js';

const ActiveNow = () => {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={staggerContainer(0.08)}
      className="w-[300px] xl:w-[360px] shrink-0 h-full overflow-y-auto bg-[#1a1b1f93] rounded-2x p-4 hidden lg:block"
    >
      <h2 className="text-lg font-semibold text-white mb-4">Active Now</h2>

      <div className="space-y-3">
        {/* Activity 1 */}
        <motion.div variants={fadeInUp} whileHover={hoverCard} className="bg-[#111214] bg-opacity-60 rounded-lg p-3 transition-colors hover:bg-opacity-80 cursor-pointer">
          <div className="flex items-center gap-3 mb-2">
            <div className="relative">
              <img
                src="https://cdn.discordapp.com/embed/avatars/0.png"
                alt="Zaid"
                className="w-8 h-8 rounded-full bg-[#5865f2]"
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-[#2b2d31] rounded-full flex items-center justify-center">
                <div className="w-2.5 h-2.5 bg-[#23a55a] rounded-full"></div>
              </div>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-semibold text-white truncate">Zaid and Maki</span>
              <span className="text-xs text-[#949ba4]">In a Voice Channel</span>
            </div>
          </div>
        </motion.div>

        {/* Activity 2 */}
        <motion.div variants={fadeInUp} whileHover={hoverCard} className="bg-[#111214] bg-opacity-60 rounded-lg p-3 transition-colors hover:bg-opacity-80 cursor-pointer">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-full bg-[#5865f2] flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                </svg>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-semibold text-white truncate">code discussion</span>
                <div className="flex items-center gap-1 text-xs text-[#949ba4]">
                  <span>music</span>
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                  </svg>
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
                  </svg>
                </div>
              </div>
            </div>
            <div className="flex -space-x-2 shrink-0">
              <img src="https://cdn.discordapp.com/embed/avatars/0.png" className="w-5 h-5 rounded-full bg-[#5865f2] border-2 border-[#2b2d31]" alt="" />
              <div className="w-5 h-5 rounded-full bg-[#f23f43] border-2 border-[#2b2d31] flex items-center justify-center">
                <span className="text-[8px] text-white font-bold">M</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Activity 3 */}
        <motion.div variants={fadeInUp} whileHover={hoverCard} className="bg-[#111214] bg-opacity-60 rounded-lg p-3 transition-colors hover:bg-opacity-80 cursor-pointer">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative shrink-0">
                <img
                  src="https://cdn.discordapp.com/embed/avatars/1.png"
                  alt="Kaku"
                  className="w-8 h-8 rounded-full bg-[#3ba55d]"
                />
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-[#2b2d31] rounded-full flex items-center justify-center">
                  <div className="w-2.5 h-2.5 bg-[#23a55a] rounded-full"></div>
                </div>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-semibold text-white truncate">Kaku</span>
                <span className="text-xs text-[#949ba4] truncate">Visual Studio Code — 41m</span>
              </div>
            </div>
            <div className="w-7 h-7 rounded-full bg-[#5865f2] flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
              </svg>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-2 ml-1">
            <div className="w-10 h-10 rounded-lg bg-[#1e1f22] flex items-center justify-center shrink-0">
              <svg className="w-6 h-6 text-[#007acc]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.583 2.376c.833-.506 1.5-.093 1.5.918v17.412c0 1.011-.667 1.424-1.5.918l-11.917-7.206v6.288c0 .667-.583 1.209-1.292 1.209h-1.75c-.708 0-1.292-.542-1.292-1.209V3.084c0-.667.583-1.209 1.292-1.209h1.75c.708 0 1.292.542 1.292 1.209v6.288l11.917-7.206z"/>
              </svg>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-semibold text-white truncate">Editing App.jsx</span>
              <span className="text-xs text-[#949ba4]">Workspace: todo</span>
              <span className="text-xs text-[#949ba4]">41:13 elapsed</span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

const hoverCard = { y: -2 };

export default ActiveNow;