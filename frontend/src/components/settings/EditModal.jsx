import React, { useState } from "react";
import { X, Check } from "lucide-react";

export default function EditModal({ title, fieldLabel, initialValue, type = "text", onSave, onClose }) {
  const [value, setValue] = useState(initialValue);
  const [pw, setPw] = useState("");

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 px-4">
      <div className="bg-[#313338] rounded-[4px] w-full max-w-[440px] p-6 relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#b5bac1] hover:text-white"
        >
          <X size={20} />
        </button>
        <h2 className="text-xl font-bold text-white mb-4">{title}</h2>
        <label className="block text-xs font-bold uppercase text-[#b5bac1] mb-2">
          {fieldLabel}
        </label>
        <input
          autoFocus
          type={type}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full bg-[#1e1f22] text-[#dbdee1] text-[15px] rounded-[3px] px-3 py-[10px] outline-none border border-transparent focus:border-[#5865f2] mb-4"
        />
        {type === "password" && (
          <>
            <label className="block text-xs font-bold uppercase text-[#b5bac1] mb-2">
              Current Password
            </label>
            <input
              type="password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              placeholder="Enter current password"
              className="w-full bg-[#1e1f22] text-[#dbdee1] text-[15px] rounded-[3px] px-3 py-[10px] outline-none border border-transparent focus:border-[#5865f2] mb-4"
            />
          </>
        )}
        <div className="flex justify-end gap-3 mt-2">
          <button
            onClick={onClose}
            className="text-sm text-[#dbdee1] hover:underline px-2"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(value)}
            className="bg-[#5865f2] hover:bg-[#4752c4] text-white text-sm font-medium px-4 py-[8px] rounded-[8px] transition-colors flex items-center gap-1.5"
          >
            <Check size={15} /> Save
          </button>
        </div>
      </div>
    </div>
  );
}
