import React from "react";

export default function Field({ label, value, action, actionLabel = "Edit", onAction, valueClassName }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="min-w-0 flex-1">
        <div className="text-xs font-bold uppercase tracking-wide text-[#949ba4] mb-1.5">
          {label}
        </div>
        <div className={"text-[15px] text-[#dbdee1] break-words " + (valueClassName || "")}>
          {value}
        </div>
      </div>
      <div className="shrink-0">
        {action ? (
          action
        ) : (
          <button
            onClick={onAction}
            className="bg-[#4e5058] hover:bg-[#6d6f78] text-white text-sm font-medium px-3 sm:px-4 py-[8px] rounded-[5px] transition-colors whitespace-nowrap"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}
