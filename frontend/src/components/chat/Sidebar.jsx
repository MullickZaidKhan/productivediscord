import React from 'react';
import { MessageCirclePlus ,UsersRound  } from "lucide-react";
const Sidebar = () => {
  return (
    <div className="w-[240px] min-h-screen p-1 bg-[#03030373] flex flex-col rounded-2x text-[#949ba4] select-none">
      {/* Search Button */}
      <div className="p-3">
        <div className="bg-[#1e1f22] hover:bg-[#393c43] cursor-pointer rounded-md py-1.5 px-3 text-sm shadow-sm border border-[#232428]">
          Find or start a conversation
        </div>
      </div>

      {/* Nav Items */}
      <div className="px-2 space-y-0.5">
        <div className="flex items-center gap-3 px-2 py-2 rounded-md bg-[#3e3f45] text-white cursor-pointer">
          <UsersRound size={18}/>
          <span className="text-sm font-medium">Friends</span>
        </div>

        <div className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-[#3e3f45] hover:text-[#dbdee1] cursor-pointer transition-colors">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          <span className="text-sm font-medium">Nitro</span>
          <span className="ml-auto text-[10px] font-bold bg-[#232428] text-white px-1.5 py-0.5 rounded-full border border-[#3e3f45]">
            1 MONTH FREE
          </span>
        </div>

        <div className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-[#3e3f45] hover:text-[#dbdee1] cursor-pointer transition-colors">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 6h-2c0-2.76-2.24-5-5-5S7 3.24 7 6H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-3c1.66 0 3 1.34 3 3H9c0-1.66 1.34-3 3-3zm7 17H5V8h14v12zm-7-8c-1.66 0-3-1.34-3-3H7c0 2.76 2.24 5 5 5s5-2.24 5-5h-2c0 1.66-1.34 3-3 3z"/>
          </svg>
          <span className="text-sm font-medium">Shop</span>
        </div>

        <div className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-[#3e3f45] hover:text-[#dbdee1] cursor-pointer transition-colors">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
          </svg>
          <span className="text-sm font-medium">Quests</span>
          <span className="ml-auto text-[10px] font-bold bg-[#5865f2] text-white px-2 py-0.5 rounded-md">
            NEW
          </span>
        </div>
      </div>

      {/* Direct Messages Header */}
      <div className="mt-4 px-4 flex items-center justify-between group cursor-pointer">
        <span className="text-xs font-semibold tracking-wide hover:text-[#dbdee1] transition-colors">
          Direct Messages
        </span>
        <svg className="w-4 h-4 hover:text-[#dbdee1] transition-colors" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
        </svg>
      </div>

      {/* DM List */}
      <div className="mt-1 px-2">
        <div className="flex items-center gap-3 px-2 py-1 rounded-[12px] bg-[#3e3f45] text-white cursor-pointer">
          <div className="relative">
            <img 
              src="https://cdn.discordapp.com/embed/avatars/0.png" 
              alt="Zaid" 
              className="w-8 h-8 rounded-full bg-[#5865f2]"
            />
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-[#1e1f22] rounded-full flex items-center justify-center">
              <div className="w-2.5 h-2.5 bg-[#23a55a] rounded-full"></div>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-medium">Zaid</span>
              <span className="text-[9px] font-bold bg-[#5865f2] text-white px-1 py-0 rounded">CODE</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-[#949ba4]">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
              </svg>
              <span>In voice</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;