import React from 'react'
import { motion } from 'framer-motion';
import { staggerContainer, fadeInUp } from '../ui/motion.js';
const Onlinepage = () => {
    return (
        <div>
            <>
                {/* Search */}
                <div className="px-3 sm:px-4 pt-4 pb-2">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search"
                            className="w-full bg-[#1e1f22] text-[#949ba4] placeholder-[#949ba4] text-sm rounded-md py-1.5 pl-9 pr-3 outline-none transition-shadow focus:ring-2 focus:ring-[#5865f2]/50"
                        />
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#949ba4]" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                        </svg>
                    </div>
                </div>

                {/* Online Count */}
                <div className="px-4 sm:px-5 pt-2 pb-1">
                    <span className="text-xs font-semibold text-[#949ba4] tracking-wide">Online — 1</span>
                </div>

                {/* Friends List */}
                <motion.div
                    initial="hidden"
                    animate="show"
                    variants={staggerContainer(0.06)}
                    className="px-2 flex-1 overflow-y-auto"
                >
                    <motion.div
                        variants={fadeInUp}
                        className="flex items-center gap-3 px-3 py-1 rounded-md hover:bg-[#3e3f45] hover:bg-opacity-50 group cursor-pointer transition-colors"
                    >
                        <div className="relative shrink-0">
                            <img
                                src="https://cdn.discordapp.com/embed/avatars/0.png"
                                alt="Zaid"
                                className="w-8 h-8 rounded-full bg-[#5865f2]"
                            />
                            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-[#313338] rounded-full flex items-center justify-center">
                                <div className="w-2.5 h-2.5 bg-[#23a55a] rounded-full"></div>
                            </div>
                        </div>

                        <div className="flex flex-col flex-1 min-w-0">
                            <span className="text-sm font-medium text-[#f2f3f5] truncate">Zaid</span>
                            <div className="flex items-center gap-1 text-xs text-[#23a55a]">
                                <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                                </svg>
                                <span>In voice</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                            <button className="w-9 h-9 rounded-full bg-[#2b2d31] hover:bg-[#232428] flex items-center justify-center transition-colors active:scale-95">
                                <svg className="w-5 h-5 text-[#b5bac1]" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                                </svg>
                            </button>
                            <button className="w-9 h-9 rounded-full bg-[#2b2d3100] hover:bg-[#232428] flex items-center justify-center transition-colors active:scale-95">
                                <svg className="w-5 h-5 text-[#b5bac1]" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                                </svg>
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            </>
        </div>
    )
}

export default Onlinepage