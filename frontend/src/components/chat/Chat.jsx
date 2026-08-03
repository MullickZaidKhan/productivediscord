import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from './Sidebar';
import FriendsList from './FriendsList';
import ActiveNow from './ActiveNow';
import { EASE } from '../ui/motion.js';
import ChatPage from './Chatpage.jsx';
function Chat() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [Chatopen, setChatopen] = useState(false);
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
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.28, ease: EASE }}
            >
              <Sidebar onClose={() => setMobileNavOpen(false)} />
            </motion.div>
          </React.Fragment>
        )}
      </AnimatePresence>

      {/* Channel sidebar: inline from md breakpoint up */}
      <div className="hidden md:block h-full">
        <Sidebar />
      </div>

      {/* Vertical Divider */}
      <div className="w-px bg-[#232428] hidden md:block"></div>

      {/* Main Friends Area */}

      {!Chatopen && (<FriendsList onOpenMenu={() => setMobileNavOpen(true)}  setChatopen={setChatopen} />)}
      {Chatopen && (<ChatPage setChatopen={setChatopen} />)}

      {/* Vertical Divider */}
      <div className="w-px bg-[#232428] hidden lg:block"></div>

      {/* Right Active Now Panel */}
      <ActiveNow />
    </div>
  );
}

export default Chat;
