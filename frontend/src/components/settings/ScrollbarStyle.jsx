import React from "react";

export default function ScrollbarStyle() {
  return (
    <style>{`
      .dc-scroll::-webkit-scrollbar { width: 8px; height: 8px; }
      .dc-scroll::-webkit-scrollbar-track { background: transparent; }
      .dc-scroll::-webkit-scrollbar-thumb {
        background-color: #1a1b1e;
        border-radius: 4px;
      }
      .dc-scroll:hover::-webkit-scrollbar-thumb { background-color: #131417; }
      .dc-scroll { scrollbar-width: thin; scrollbar-color: #1a1b1e transparent; }
    `}</style>
  );
}
