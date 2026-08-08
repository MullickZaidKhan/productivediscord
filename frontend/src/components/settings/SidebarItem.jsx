import React from "react";

export default function SidebarItem({ item, active, onClick }) {
  const Icon = item.icon;

  return (
    <button
      onClick={() => onClick(item.key)}
      className={[
        "w-full flex items-center gap-2.5 px-2.5 py-[6px] rounded-[4px] text-[15px] transition-colors text-left",
        item.indent ? "ml-0" : "",
        active
          ? "bg-[#404249] text-white font-medium"
          : "text-[#b5bac1] hover:bg-[#35373c] hover:text-[#dbdee1]",
      ].join(" ")}
    >
      <Icon size={17} strokeWidth={2} className={active ? "text-white" : "text-[#b5bac1]"} />
      <span className={item.indent ? "pl-[1px]" : ""}>{item.label}</span>
    </button>
  );
}
