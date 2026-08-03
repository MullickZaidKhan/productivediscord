// import React, { useState } from 'react';
// import { MessageCirclePlus, UsersRound, Menu, ChevronRight, Search, MessageSquare, MoreVertical } from "lucide-react";
// import { motion } from 'framer-motion';
// import { staggerContainer, fadeInUp } from '../ui/motion.js';
// import Onlinepage from '../common/Onlinepage.jsx';
// import AddFriendpage from '../common/AddFriendpage.jsx';
// import { AllList } from '../common/AllList.jsx';
// const FriendsList = ({ onOpenMenu }) => {
//   const [activeTab, setActiveTab] = useState('Online');

//   const tabs = ['Friends', 'Online', 'All', 'Add Friend'];

//   return (
//     <div className="flex-1 min-w-0 min-h-0 h-full bg-[#0000008e] flex flex-col">
//       {/* Header */}
//       <div className="h-12 px-2 sm:px-4 mt-3 flex items-center gap-2 sm:gap-4 border-b border-[#232428] shadow-sm overflow-x-auto">
//         {/* Mobile menu button */}
//         <button
//           onClick={onOpenMenu}
//           className="md:hidden shrink-0 w-8 h-8 rounded-md flex items-center justify-center hover:bg-[#3e3f45] text-[#dbdee1] transition-colors active:scale-95"
//           aria-label="Open menu"
//         >
//           <Menu size={18} />
//         </button>

//         <div className="flex items-center gap-2 text-[#f2f3f5] shrink-0">
//           <UsersRound size={18} />
//           <span className="text-sm font-semibold hidden sm:inline">Friends</span>
//           <svg className="w-3 h-3 text-[#949ba4]" fill="currentColor" viewBox="0 0 24 24">
//             <path d="M7 10l5 5 5-5z" />
//           </svg>
//         </div>

//         <div className="w-px h-6 bg-[#3e3f45] mx-1 shrink-0"></div>

//         <div className="flex items-center gap-5 shrink-0">
//           {tabs.slice(1).map((tab) => (
//             <button
//               key={tab}
//               onClick={() => setActiveTab(tab)}
//               className={`px-2 py-1 rounded-md text-sm font-medium transition-colors whitespace-nowrap active:scale-95 ${activeTab === tab && tab !== 'Add Friend'
//                 ? 'bg-[#3e3f45] text-white'
//                 : tab === 'Add Friend'
//                   ? 'bg-[#5865f2] text-white hover:bg-[#4752c4]'
//                   : 'text-[#949ba4] hover:text-[#dbdee1] hover:bg-[#3e3f45]'
//                 }`}
//             >
//               {tab}
//             </button>
//           ))}
//         </div>

//         <div className="ml-auto shrink-0">
//           <div className="w-8 h-8 rounded-full bg-[#2b2d31] flex items-center justify-center hover:bg-[#3e3f45] cursor-pointer transition-colors">
//             <svg className="w-5 h-5 text-[#949ba4]" fill="currentColor" viewBox="0 0 24 24">
//               <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
//             </svg>
//             <div className="absolute top-2 right-2 w-5 h-5 m-1 mr-4 rounded-full text-[10px] text-white flex items-center justify-center  ">
//               <MessageCirclePlus />
//             </div>
//           </div>
//         </div>
//       </div>
//       {activeTab === 'Online' && (
//         <Onlinepage />
//       )}
//       {activeTab === 'Add Friend' && (
//         <AddFriendpage />
//       )}
//       {activeTab === 'All' && (
//         <AllList />
//       )}
//     </div>
//   );
// };

// export default FriendsList;
import React, { useState } from 'react';
import { MessageCirclePlus, UsersRound, Menu, ChevronRight, Search, MessageSquare, MoreVertical } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';
import { staggerContainer, fadeInUp } from '../ui/motion.js';
import Onlinepage from '../common/Onlinepage.jsx';
import AddFriendpage from '../common/AddFriendpage.jsx';
import { AllList } from '../common/AllList.jsx';
import SentRequests from '../common/SentRequests.jsx';
const FriendsList = ({ onOpenMenu ,setChatopen}) => {
  const [activeTab, setActiveTab] = useState('Online');

  const tabs = ['Friends', 'Online', 'All', 'Add Friend', 'Pending'];

  return (
    <div className="flex-1 min-w-0 min-h-0 h-full bg-[#0000008e] flex flex-col">
      {/* Header */}
      <div className="h-12 px-2 sm:px-4 mt-3 flex items-center gap-2 sm:gap-4 border-b border-[#232428] shadow-sm overflow-x-auto">
        {/* Mobile menu button */}
        <button
          onClick={onOpenMenu}
          className="md:hidden shrink-0 w-8 h-8 rounded-md flex items-center justify-center hover:bg-[#3e3f45] text-[#dbdee1] transition-colors active:scale-95"
          aria-label="Open menu"
        >
          <Menu size={18} />
        </button>

        <div className="flex items-center gap-2 text-[#f2f3f5] shrink-0">
          <UsersRound size={18} />
          <span className="text-sm font-semibold hidden sm:inline">Friends</span>
     
        </div>

        <div className="w-px h-6 bg-[#3e3f45] mx-1 shrink-0"></div>

        <div className="relative flex items-center gap-5 shrink-0">
          {tabs.slice(1).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative px-2 py-1 rounded-md text-sm font-medium transition-colors whitespace-nowrap active:scale-95 ${
                tab === 'Add Friend'
                  ? 'bg-[#5865f2] text-white hover:bg-[#4752c4]'
                  : activeTab === tab
                    ? 'text-white'
                    : 'text-[#949ba4] hover:text-[#dbdee1] hover:bg-[#3e3f45]'
              }`}
            >
              {/* Sliding active background (skip for Add Friend, it has its own bg) */}
              {activeTab === tab && tab !== 'Add Friend' && (
                <motion.span
                  layoutId="friends-tab-highlight"
                  className="absolute inset-0 bg-[#3e3f45] rounded-md -z-10"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              {tab}
            </button>
          ))}
        </div>

        <div className="ml-auto shrink-0">
          <div className="w-8 h-8 rounded-full bg-[#2b2d31] flex items-center justify-center hover:bg-[#3e3f45] cursor-pointer transition-colors">
            <svg className="w-5 h-5 text-[#949ba4]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
            </svg>
            <div className="absolute top-2 right-2 w-5 h-5 m-1 mr-4 rounded-full text-[10px] text-white flex items-center justify-center  ">
              <MessageCirclePlus />
            </div>
          </div>
        </div>
      </div>

      {/* Animated content panel */}
      <div className="flex-1 min-h-0 relative overflow-hidden">
        <AnimatePresence mode="wait">
          {activeTab === 'Online' && (
            <motion.div
              key="online"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="h-full"
            >
              <Onlinepage />
            </motion.div>
          )}
          {activeTab === 'Add Friend' && (
            <motion.div
              key="add-friend"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="h-full"
            >
              <AddFriendpage />
            </motion.div>
          )}
          {activeTab === 'All' && (
            <motion.div
              key="all"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="h-full"
            >
              <AllList setChatopen={setChatopen} />
            </motion.div>
          )}
          {activeTab === 'Pending' && (
            <motion.div
              key="pending"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="h-full"
            >
              <SentRequests />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FriendsList;