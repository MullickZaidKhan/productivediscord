import React from "react";
import {
  MessageCirclePlus,
  UsersRound,
  Menu,
  ChevronRight,
  Search,
  MessageSquare,
  MoreVertical,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { staggerContainer, fadeInUp } from "../ui/motion.js";
import { useFriends } from "../../hooks/useFriend.js";
import { useDispatch } from "react-redux";
import { setUserInfo } from "../../redux/chat/Chatslice.js";

export const AllList = ({ setChatopen }) => {
  const dispatch = useDispatch();
  const { data: friends = [], isLoading, isError } = useFriends();

  const FRIENDS =
    friends.length > 0
      ? friends
      : [
          
        ];

  const friendsCount = FRIENDS.length;

  const handleFriendClick = (friend) => {
    dispatch(setUserInfo(friend));
    setChatopen?.(true);
  };

  return (
    <div>
      <div className=" w-full bg-[#31333813] flex items-start justify-center px-5 pt-5">
        <div className="w-full bg-[#31333800] flex justify-center">
          <div className="w-full ">
            {/* Search */}
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative"
            >
              <input
                placeholder="Search"
                className="w-full bg-[#1e1f22] text-white placeholder-[#87898c] text-sm rounded-md pl-3 pr-9 py-2 outline-none"
              />
              <Search
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#87898c]"
              />
            </motion.div>

            {/* Section label */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.25, delay: 0.05 }}
              className="text-[#96989d] text-xs font-semibold mt-5 mb-2 px-1"
            >
              All friends — {friendsCount}
            </motion.div>
            <div className="h-px bg-[#3f4147] mb-1" />

            {/* List */}
            <div>
              <div className="w-full bg-[#31333800] flex flex-col justify-center gap-4">
                <AnimatePresence>
                  {isLoading ? (
                    <div className="text-sm text-[#d1d5db] py-6">
                      Loading friends…
                    </div>
                  ) : isError ? (
                    <div className="text-sm text-[#f87171] py-6">
                      Failed to load friends.
                    </div>
                  ) : (
                    FRIENDS.map((f, i) => (
                      <motion.div
                        key={f.name}
                         onClick={() => handleFriendClick(f)}
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -24 }}
                        transition={{
                          duration: 0.35,
                          delay: i * 0.06,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        whileHover={{
                          backgroundColor: "rgba(255,255,255,0.03)",
                        }}
                        className="rounded-md"
                      >
                        <div className="flex items-center gap-5 px-2 py-2.5">
                          <div className="relative shrink-0">
                            <div
                              className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-medium"
                              style={{
                                backgroundColor: f.color || "#6b7280",
                              }}
                            >
                              {f.initials ? (
                                f.initials
                              ) : f.name ? (
                                f.name.slice(0, 2).toUpperCase()
                              ) : (
                                <UsersRound
                                  size={16}
                                  className="text-white"
                                />
                              )}
                            </div>
                            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#80848e] border-[3px] border-[#313338]" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="text-white text-sm font-medium truncate">
                              {f.name}
                            </div>
                            <div className="text-[#949ba4] text-xs">
                              Offline
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <motion.button
                              whileHover={{
                                scale: 1.08,
                                backgroundColor: "rgba(255,255,255,0.08)",
                              }}
                              onClick={() => handleFriendClick(f)}
                              whileTap={{ scale: 0.92 }}
                              transition={{ duration: 0.12 }}
                              className="w-9 h-9 rounded-full flex items-center justify-center"
                            >
                              <svg
                                className="w-5 h-5 text-[#b5bac1]"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                              </svg>
                            </motion.button>
                            <motion.button
                              whileHover={{
                                scale: 1.08,
                                backgroundColor: "rgba(255,255,255,0.08)",
                              }}
                              whileTap={{ scale: 0.92 }}
                              transition={{ duration: 0.12 }}
                              className="w-9 h-9 rounded-full flex items-center justify-center"
                            >
                              <MoreVertical
                                size={17}
                                className="text-[#b5bac1]"
                              />
                            </motion.button>
                          </div>
                        </div>
                        {i < FRIENDS.length - 1 && (
                          <div className="h-px bg-[#3f414785] mx-2" />
                        )}
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
