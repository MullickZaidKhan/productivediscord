import React from 'react';
import Sidebar from './Sidebar';
import FriendsList from './FriendsList';
import ActiveNow from './ActiveNow';

function Chat() {
  return (
   <div className="flex min-h-screen rounded-2xl bg-[#313338] font-sans">

      {/* Left Sidebar */}
      <Sidebar />
      
      {/* Vertical Divider */}
      <div className="w-px bg-[#232428]"></div>
      
      {/* Main Friends Area */}
      <FriendsList />
      
      {/* Vertical Divider */}
      <div className="w-px bg-[#232428]"></div>
      
      {/* Right Active Now Panel */}
      <ActiveNow />
    </div>
  );
}

export default Chat;