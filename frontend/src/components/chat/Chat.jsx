import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Sidebar from "./Sidebar";
import FriendsList from "./FriendsList";
import ActiveNow from "./ActiveNow";
import { EASE } from "../ui/motion.js";
import ChatPage from "./Chat-page/Chatpage.jsx";
import { useSelector, useDispatch } from "react-redux";
import {
  clearUserInfo,
  closeChat,
  openChat,
  setUserInfo,
} from "../../redux/chat/Chatslice.js";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useGetTalkedUsers } from "../../hooks/chat/directMessage.hook.js";
import { setTab } from "../../redux/FriendsList/Friendslice.js";

const EMPTY_USERS = [];

function Chat() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { userId } = useParams();
  const selectedChatId = useSelector((state) => state.chat?.userinfo?._id);
  const {
    data,
    isLoading: isTalkedUsersLoading,
    isError: isTalkedUsersError,
  } = useGetTalkedUsers();
  const talkedUsers = Array.isArray(data?.data?.data)
    ? data.data.data
    : Array.isArray(data?.data)
      ? data.data
      : EMPTY_USERS;
  const hasSelectedRouteUser = String(selectedChatId ?? "") === userId;

  useEffect(() => {
    const pathToTab = {
      "/": "Online",
      "/Online": "Online",
      "/All": "All",
      "/Add_Friend": "Add Friend",
      "/Pending": "Pending",
    };
    const selectedTab = pathToTab[location.pathname];
    if (selectedTab) {
      dispatch(setTab(selectedTab));
    }
  }, [dispatch, location.pathname]);

  useEffect(() => {
    if (!userId) {
      dispatch(closeChat());
      return;
    }

    const selectedUser = talkedUsers.find(
      (user) => String(user._id ?? user.id) === userId,
    );
    if (selectedUser) {
      dispatch(
        setUserInfo({
          ...selectedUser,
          _id: selectedUser._id ?? selectedUser.id,
        }),
      );
      dispatch(openChat());
    } else if (
      String(selectedChatId ?? "") !== userId &&
      !isTalkedUsersLoading
    ) {
      dispatch(clearUserInfo());
    }
  }, [
    dispatch,
    isTalkedUsersLoading,
    selectedChatId,
    talkedUsers,
    userId,
  ]);

  const openUserChat = (user) => {
    const id = user?._id ?? user?.id;
    if (!id) return;

    dispatch(setUserInfo({ ...user, _id: id }));
    dispatch(openChat());
    navigate(`/channels/@me/${encodeURIComponent(id)}`);
  };

  const openFriends = () => {
    dispatch(closeChat());
    navigate("/");
  };

  return (
    <div className="flex h-full min-h-0 bg-[#313338bb] font-sans relative overflow-hidden">
      {/* Mobile channel-list drawer */}
      <AnimatePresence>
        {mobileNavOpen && (
          <React.Fragment key="mobile-drawer">
            <motion.div
              key="backdrop"
              className="fixed inset-0 bg-black/60 z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileNavOpen(false)}
            />
            <motion.div
              key="drawer"
              className="fixed left-0 top-0 h-full z-50 md:hidden"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.28, ease: EASE }}
            >
              <Sidebar
                onClose={() => setMobileNavOpen(false)}
                onOpenChat={openUserChat}
                onOpenFriends={openFriends}
              />
            </motion.div>
          </React.Fragment>
        )}
      </AnimatePresence>

      {/* Channel sidebar: inline from md breakpoint up */}
      <div className="hidden md:block h-full">
        <Sidebar onOpenChat={openUserChat} onOpenFriends={openFriends} />
      </div>

      {/* Vertical Divider */}
      <div className="w-px bg-[#232428] hidden md:block"></div>

      {/* Main Friends Area */}

      {!userId && (
        <FriendsList
          onOpenMenu={() => setMobileNavOpen(true)}
          onOpenChat={openUserChat}
        />
      )}
      {userId && hasSelectedRouteUser && (
        <ChatPage
          key={String(userId)}
          onCloseChat={openFriends}
        />
      )}
      {userId && !hasSelectedRouteUser && (
        <div className="flex-1 min-w-0 min-h-0 h-full flex items-center justify-center bg-[#0000008e] text-sm text-[#949ba4]">
          {isTalkedUsersLoading
            ? "Loading conversation..."
            : isTalkedUsersError
              ? "Unable to load this conversation."
              : "Conversation not found."}
        </div>
      )}

      {/* Vertical Divider */}
      <div className="w-px bg-[#232428] hidden lg:block"></div>

      {/* Right Active Now Panel */}
      <ActiveNow />
    </div>
  );
}

export default Chat;
