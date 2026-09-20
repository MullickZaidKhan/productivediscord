import React from "react";
import { MessageCirclePlus, UsersRound, X } from "lucide-react";
import { motion } from "framer-motion";
import { staggerContainer, fadeInUp } from "../ui/motion.js";
import { useSelector, useDispatch } from "react-redux";
import { openChat, closeChat, setUserInfo } from "../../redux/chat/Chatslice.js";
import{useGetTalkedUsers} from "../../hooks/chat/directMessage.hook.js"
const Sidebar = ({ onClose }) => {
  const dispatch = useDispatch();
  const selectedUser = useSelector((state) => state.chat?.userinfo);
  const {
  data,
  isLoading,
  isError,
} = useGetTalkedUsers();
const onlineFriends = useSelector(
  (state) => state.onlineFriendsslice?.ONLINE_USERS || []
);

const talkedUsers = Array.isArray(data?.data?.data)
  ? data.data.data
  : Array.isArray(data?.data)
    ? data.data
    : [];
const isUserOnline = (userId) => {
  return onlineFriends.some(
    (onlineUser) =>
      String(onlineUser.id ?? onlineUser._id) === String(userId)
  );
};
const handleOpenChat = (user) => {
  if (!user?._id) return;

  dispatch(setUserInfo(user));
  dispatch(openChat());
};
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={staggerContainer(0.04)}
      className="w-[82vw] max-w-[280px] md:w-[23vw] md:max-w-none h-full md:h-screen p-1 bg-[#1e1f22] md:bg-[#03030373] flex flex-col rounded-2x text-[#949ba4] select-none overflow-y-auto"
    >
      {/* Mobile drawer header */}
      {onClose && (
        <div className="flex items-center justify-between px-3 pt-3 md:hidden">
          <span className="text-sm font-semibold text-white">Menu</span>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#3e3f45] transition-colors active:scale-95"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* Search Button */}
      <motion.div variants={fadeInUp} className="p-3">
        <div className="bg-[#1e1f22b4] hover:bg-[#393c4393] cursor-pointer rounded-md py-1.5 px-3 text-sm shadow-sm border border-[#232428] transition-colors">
          Find or start a conversation
        </div>
      </motion.div>

      {/* Nav Items */}
      <div className="px-2 space-y-0.5">
        <motion.div
          variants={fadeInUp}
          className="flex items-center gap-3 px-2 py-2 rounded-md bg-[#3e3f45] text-white cursor-pointer"
        >
          <UsersRound size={18} />
          <span
            onClick={() => {
              dispatch(closeChat());
            }}
            className="text-sm font-medium"
          >
            Friends
          </span>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-[#3e3f45] hover:text-[#dbdee1] cursor-pointer transition-colors"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <span className="text-sm font-medium">Nitro</span>
          <span className="ml-auto text-[10px] font-bold bg-[#232428] text-white px-1.5 py-0.5 rounded-full border border-[#3e3f45]">
            1 MONTH FREE
          </span>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-[#3e3f45] hover:text-[#dbdee1] cursor-pointer transition-colors"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 6h-2c0-2.76-2.24-5-5-5S7 3.24 7 6H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-3c1.66 0 3 1.34 3 3H9c0-1.66 1.34-3 3-3zm7 17H5V8h14v12zm-7-8c-1.66 0-3-1.34-3-3H7c0 2.76 2.24 5 5 5s5-2.24 5-5h-2c0 1.66-1.34 3-3 3z" />
          </svg>
          <span className="text-sm font-medium">Shop</span>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-[#3e3f45] hover:text-[#dbdee1] cursor-pointer transition-colors"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
          </svg>
          <span className="text-sm font-medium">Quests</span>
          <span className="ml-auto text-[10px] font-bold bg-[#5865f2] text-white px-2 py-0.5 rounded-md">
            NEW
          </span>
        </motion.div>
      </div>

      {/* Direct Messages Header */}
      <div className="mt-4 px-4 flex items-center justify-between group cursor-pointer">
        <span className="text-xs font-semibold tracking-wide hover:text-[#dbdee1] transition-colors">
          Direct Messages
        </span>
        <svg
          className="w-4 h-4 hover:text-[#dbdee1] transition-colors"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
        </svg>
      </div>

  {/* DM List */}
<motion.div
  variants={fadeInUp}
  className="mt-1 px-2 space-y-1"
>
  {isLoading && (
    <div className="px-2 py-3 text-xs text-[#949ba4]">
      Loading conversations...
    </div>
  )}

  {isError && (
    <div className="px-2 py-3 text-xs text-red-400">
      Failed to load conversations
    </div>
  )}

  {!isLoading && !isError && talkedUsers.length === 0 && (
    <div className="px-2 py-3 text-xs text-[#949ba4]">
      No conversations yet
    </div>
  )}

  {!isLoading &&
    !isError &&
    talkedUsers.map((user) => (
      <div
        key={user._id}
        onClick={() => handleOpenChat(user)}
        className={`
          flex items-center gap-3
          px-2 py-1
          rounded-[12px]
          text-white
          cursor-pointer
          hover:bg-[#3e3f45]
          transition-colors
          ${selectedUser?._id === user._id ? "bg-[#3e3f45]" : ""}
        `}
      >
        {/* Avatar */}
        <div className="relative shrink-0">
          <img
            src={
              user.profileimg ||
              "https://cdn.discordapp.com/embed/avatars/0.png"
            }
            alt={user.name}
            className="w-8 h-8 rounded-full object-cover bg-[#5865f2]"
          />

         {/* Green dot only when user is online */}
  {isUserOnline(user._id) && (
    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-[#1e1f22] rounded-full flex items-center justify-center">
      <div className="w-2.5 h-2.5 bg-[#23a55a] rounded-full" />
    </div>
  )}
        </div>

        {/* User information */}
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-medium truncate">
              {user.name}
            </span>

            {/* <span className="text-[9px] font-bold bg-[#5865f2] text-white px-1 py-0 rounded">
              CODE
            </span> */}
          </div>

          <span className="text-xs text-[#949ba4] truncate">
            @{user.username}
          </span>
        </div>
      </div>
    ))}
</motion.div>
    </motion.div>
  );
};

export default Sidebar;
