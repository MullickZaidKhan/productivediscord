import { useState } from "react";
import { Search, X, Check, Inbox, Send } from "lucide-react";
import {
  usePendingFriendRequests,
  useSentFriendRequests,
} from "../../hooks/useFriend.js";

export default function SentRequests() {
  const [activeSection, setActiveSection] = useState("received");
  const {
    data: receivedRequests = [],
    isLoading: isReceivedLoading,
    isError: isReceivedError,
  } = usePendingFriendRequests();
  const {
    data: sentRequests = [],
    isLoading: isSentLoading,
    isError: isSentError,
  } = useSentFriendRequests();

  const requests = activeSection === "received" ? receivedRequests : sentRequests;
  const isLoading = activeSection === "received" ? isReceivedLoading : isSentLoading;
  const isError = activeSection === "received" ? isReceivedError : isSentError;
  const pendingCount = requests?.length ?? 0;
  const sectionLabel = activeSection === "received" ? "Requests I Get" : "Requests I Send";

  const handleAccept = (request) => {
    // hook up to your accept-friend-request mutation here
    console.log("accept", request._id ?? request.id);
  };

  const handleReject = (request) => {
    // hook up to your reject-friend-request mutation here
    console.log("reject", request._id ?? request.id);
  };

  const handleCancel = (request) => {
    // hook up to your cancel-sent-request mutation here
    console.log("cancel", request._id ?? request.id);
  };

  return (
    <div className="min-h-screen bg-[#31333813] flex justify-center p-6 font-sans">
      <div className="w-full max-w-xl">
        {/* Search box */}
        <div className="flex items-center gap-2.5 bg-[#1e1f22] border border-[#3f4147] rounded-lg px-3.5 py-2.5 mb-5">
          <Search size={16} className="text-[#949ba4] shrink-0" />
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent outline-none border-none text-[#f2f3f5] placeholder-[#949ba4] text-[15px] w-full"
          />
        </div>

        {/* Tab switcher */}
        <div className="flex gap-2 mb-4">
          {[
            { key: "received", label: "Requests I Get", icon: Inbox },
            { key: "sent", label: "Requests I Send", icon: Send },
          ].map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.key;
            return (
              <button
                key={section.key}
                type="button"
                onClick={() => setActiveSection(section.key)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium transition-all ${
                  isActive
                    ? "bg-[#5865f2] text-white shadow-[0_0_0_1px_rgba(88,101,242,0.4)]"
                    : "bg-[#1e1f22] text-[#9aa0a6] hover:bg-[#2b2d31] hover:text-[#e2e4e9]"
                }`}
              >
                <Icon size={14} />
                {section.label}
              </button>
            );
          })}
        </div>

        {/* Section label */}
        <div className="flex items-center justify-between pb-2 mb-1 border-b border-[#3f4147]">
          <span className="text-xs font-bold text-[#f2f3f5] tracking-wide uppercase">
            {sectionLabel}
          </span>
          <span className="text-xs font-bold text-[#5865f2] bg-[#5865f21a] px-2 py-0.5 rounded-full">
            {pendingCount}
          </span>
        </div>

        {isLoading && (
          <div className="text-sm text-[#d1d5db] py-6">Loading pending requests…</div>
        )}

        {isError && (
          <div className="text-sm text-[#f87171] py-6">Failed to load pending requests.</div>
        )}

        {!isLoading && !isError && pendingCount === 0 && (
          <div className="text-sm text-[#cbd5e1] py-6">No pending friend requests.</div>
        )}

        {!isLoading && !isError && requests.map((request) => {
          const profile = activeSection === "received" ? request.sender ?? {} : request.receiver ?? {};
          const displayName = profile.name || profile.username || "Unknown user";
          const username = profile.username ? `@${profile.username}` : "";
          const initials = (profile.name || profile.username || "?").charAt(0).toUpperCase();

          return (
            <div
              key={request._id ?? request.id}
              className="flex items-center px-4 py-2.5 rounded-lg hover:bg-[#3a3c419f] group"
            >
              <div className="relative w-8 h-8 mr-3 shrink-0">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ff5fa2] to-[#d61f69] flex items-center justify-center text-white text-sm font-semibold">
                  {initials}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#23a55a] border-[3px] border-[#313338]" />
              </div>

              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <div className="text-[15px] font-semibold text-[#f2f3f5] leading-tight truncate">
                  {displayName}
                </div>
                <div className="text-[13px] text-[#949ba4] leading-tight truncate">
                  {username}
                </div>
              </div>

              {activeSection === "received" ? (
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    aria-label="Accept request"
                    onClick={() => handleAccept(request)}
                    className="w-8 h-8 rounded-[5px] flex items-center justify-center text-[#23a55a] bg-[#23a55a1a] hover:bg-[#23a55a] hover:text-white transition-colors"
                  >
                    <Check size={16} />
                  </button>
                  <button
                    type="button"
                    aria-label="Reject request"
                    onClick={() => handleReject(request)}
                    className="w-8 h-8 rounded-[5px] flex items-center justify-center text-[#f23f42] bg-[#f23f421a] hover:bg-[#f23f42] hover:text-white transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  aria-label="Cancel request"
                  onClick={() => handleCancel(request)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[#b5bac1] hover:bg-[#4e5058] hover:text-[#f2f3f5] shrink-0"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}