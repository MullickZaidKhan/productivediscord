import React, { useState } from "react";
import { Search, User, Shield, ShieldCheck, Users, Info, MessageCircle, Bell, Gem, Rocket, X, Pencil, Check, ChevronRight } from "lucide-react";

const NAV_SECTIONS = [
  {
    label: null,
    items: [{ key: "account", label: "Account", icon: User }],
  },
  {
    label: null,
    items: [
      { key: "password", label: "Password & Security", icon: Shield, indent: true },
      { key: "standing", label: "Account Standing", icon: ShieldCheck, indent: true },
      { key: "family", label: "Family Center", icon: Users, indent: true },
    ],
  },
  {
    label: null,
    items: [
      { key: "privacy", label: "Data & Privacy", icon: Info },
      { key: "messaging", label: "Messaging Permissions", icon: MessageCircle },
      { key: "notifications", label: "Notifications", icon: Bell },
    ],
  },
  {
    label: "Billing",
    items: [
      { key: "nitro", label: "Nitro", icon: Gem },
      { key: "boost", label: "Server Boost", icon: Rocket },
    ],
  },
];

function SidebarItem({ item, active, onClick }) {
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

function Field({ label, value, action, actionLabel = "Edit", onAction, valueClassName }) {
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
            className="bg-[#4e5058] hover:bg-[#6d6f78] text-white text-sm font-medium px-4 py-[8px] rounded-[3px] transition-colors whitespace-nowrap"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}

function EditModal({ title, fieldLabel, initialValue, type = "text", onSave, onClose }) {
  const [value, setValue] = useState(initialValue);
  const [pw, setPw] = useState("");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
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
            className="bg-[#5865f2] hover:bg-[#4752c4] text-white text-sm font-medium px-4 py-[8px] rounded-[3px] transition-colors flex items-center gap-1.5"
          >
            <Check size={15} /> Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DiscordAccountSettings() {
  const [activeKey, setActiveKey] = useState("account");
  const [username, setUsername] = useState("zaidk0064_98925");
  const [email, setEmail] = useState("zaidkhan.dev@gmail.com");
  const [phone, setPhone] = useState("");
  const [emailRevealed, setEmailRevealed] = useState(false);
  const [modal, setModal] = useState(null); // 'username' | 'email' | 'phone' | 'password'
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(true);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  };

  const maskedEmail = () => {
    const [local, domain] = email.split("@");
    return "*".repeat(Math.max(local.length, 1)) + "@" + domain;
  };

  const handleSave = (field, value) => {
    if (field === "username") setUsername(value);
    if (field === "email") setEmail(value);
    if (field === "phone") setPhone(value);
    if (field === "password") showToast("Password updated");
    else showToast(`${field.charAt(0).toUpperCase() + field.slice(1)} updated`);
    setModal(null);
  };

  if (!open) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1e1f22]">
        <button
          onClick={() => setOpen(true)}
          className="bg-[#5865f2] hover:bg-[#4752c4] text-white px-5 py-2.5 rounded-[4px] font-medium"
        >
          Reopen Settings
        </button>
      </div>
    );
  }

  return (
    <div
      className="inset-0 z-40 w-[95%] h-[95%] bg-[#313338] flex font-[500] antialiased overflow-hidden"
      style={{ fontFamily: "'gg sans', 'Helvetica Neue', Helvetica, Arial, sans-serif" }}
    >
      {/* Sidebar */}
      <div className="w-[218px] sm:w-[240px] bg-[#2b2d31] flex justify-end shrink-0 overflow-y-auto">
        <div className="w-full max-w-[218px] py-8 sm:py-[60px] px-2.5">
          {/* Profile header */}
          <div className="flex items-center gap-2.5 px-2.5 mb-4">
            <img
              src="https://api.dicebear.com/7.x/adventurer/svg?seed=Zaidk&backgroundColor=b6e3f4"
              alt="avatar"
              className="w-8 h-8 rounded-full object-cover"
            />
            <div>
              <div className="text-white text-[15px] font-semibold leading-tight">Zaidk</div>
              <button className="text-[11px] text-[#949ba4] hover:text-[#dbdee1] flex items-center gap-1">
                Edit Profiles <Pencil size={10} />
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-4 px-0">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#949ba4]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search"
              className="w-full bg-[#1e1f22] text-[13px] text-[#dbdee1] placeholder-[#87898c] rounded-[4px] pl-8 pr-2 py-[6px] outline-none"
            />
          </div>

          <nav className="space-y-0.5">
            {NAV_SECTIONS.map((section, i) => (
              <div key={i} className="mb-1">
                {section.label && (
                  <div className="px-2.5 pt-3 pb-1 text-xs font-bold uppercase text-[#949ba4] tracking-wide">
                    {section.label}
                  </div>
                )}
                {section.items
                  .filter((it) =>
                    search ? it.label.toLowerCase().includes(search.toLowerCase()) : true
                  )
                  .map((item) => (
                    <SidebarItem
                      key={item.key}
                      item={item}
                      active={activeKey === item.key}
                      onClick={setActiveKey}
                    />
                  ))}
                {i < NAV_SECTIONS.length - 1 && (
                  <div className="border-t border-[#3f4147] my-2 mx-2.5" />
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>

      {/* Main panel */}
      <div className="flex-1 flex justify-center relative overflow-y-auto min-w-0">
        <button
          onClick={() => setOpen(false)}
          className="fixed top-6 right-6 sm:top-[60px] sm:right-10 w-9 h-9 rounded-full border-2 border-[#4e5058] flex items-center justify-center text-[#b5bac1] hover:text-white hover:border-white transition-colors shrink-0 z-10"
          title="Close"
        >
          <X size={18} />
        </button>

        <div className="w-full max-w-[740px] pt-8 sm:pt-[60px] pb-20 px-4 sm:px-10 min-w-0">
          {activeKey === "account" && (
            <>
              <h1 className="text-white text-xl font-semibold mb-6">Account</h1>

              {/* Banner card */}
              <div className="rounded-[8px] overflow-hidden mb-6 bg-gradient-to-r from-[#5865f2] to-[#3a1e8a]">
                <div className="h-[60px]" />
                <div className="bg-[#2b2d31] px-4 pb-4 pt-0 relative">
                  <img
                    src="https://api.dicebear.com/7.x/adventurer/svg?seed=Zaidk&backgroundColor=b6e3f4"
                    className="w-[80px] h-[80px] rounded-full border-[6px] border-[#2b2d31] -mt-10 mb-2"
                    alt="avatar"
                  />
                  <div className="text-white font-semibold text-lg">Zaidk</div>
                  <div className="text-[#b5bac1] text-sm">{username}</div>
                  <button className="mt-3 bg-[#4e5058] hover:bg-[#6d6f78] text-white text-sm font-medium px-4 py-[8px] rounded-[3px]">
                    Edit User Profile
                  </button>
                </div>
              </div>

              <h2 className="text-white text-lg font-semibold mb-1">Account Info</h2>
              <div className="divide-y divide-[#3f4147] mb-6">
                <Field
                  label="Username"
                  value={username}
                  onAction={() => setModal("username")}
                />
                <Field
                  label="Email"
                  value={
                    <span className="flex items-center gap-2">
                      {emailRevealed ? email : maskedEmail()}
                      <button
                        onClick={() => setEmailRevealed((r) => !r)}
                        className="text-[#00a8fc] hover:underline text-[15px]"
                      >
                        {emailRevealed ? "Hide" : "Reveal"}
                      </button>
                    </span>
                  }
                  onAction={() => setModal("email")}
                />
                <Field
                  label="Phone Number"
                  value={
                    phone ? (
                      phone
                    ) : (
                      <span className="text-[#dbdee1]">You haven't added a phone number yet.</span>
                    )
                  }
                  actionLabel={phone ? "Edit" : "Add"}
                  onAction={() => setModal("phone")}
                />
              </div>

              <div className="border-t border-[#3f4147] mb-6" />

              <h2 className="text-white text-lg font-semibold mb-1">Password &amp; Security</h2>
              <div className="divide-y divide-[#3f4147] mb-6">
                <Field
                  label="Password"
                  value="••••••••••••"
                  onAction={() => setModal("password")}
                />
              </div>
            </>
          )}

          {activeKey !== "account" && (
            <div className="flex flex-col items-center justify-center h-[60vh] text-[#949ba4]">
              <div className="text-white text-xl font-semibold mb-2">
                {NAV_SECTIONS.flatMap((s) => s.items).find((i) => i.key === activeKey)?.label}
              </div>
              <p className="text-sm">This section isn't wired up in this demo — click "Account" to see the working page.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {modal === "username" && (
        <EditModal
          title="Change your username"
          fieldLabel="Username"
          initialValue={username}
          onSave={(v) => handleSave("username", v)}
          onClose={() => setModal(null)}
        />
      )}
      {modal === "email" && (
        <EditModal
          title="Change your email"
          fieldLabel="Email"
          initialValue={email}
          type="email"
          onSave={(v) => handleSave("email", v)}
          onClose={() => setModal(null)}
        />
      )}
      {modal === "phone" && (
        <EditModal
          title={phone ? "Change your phone number" : "Add a phone number"}
          fieldLabel="Phone Number"
          initialValue={phone}
          type="tel"
          onSave={(v) => handleSave("phone", v)}
          onClose={() => setModal(null)}
        />
      )}
      {modal === "password" && (
        <EditModal
          title="Update your password"
          fieldLabel="New Password"
          initialValue=""
          type="password"
          onSave={() => handleSave("password", "")}
          onClose={() => setModal(null)}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#248046] text-white text-sm font-medium px-4 py-2.5 rounded-[4px] shadow-lg flex items-center gap-2 z-50">
          <Check size={16} /> {toast}
        </div>
      )}
    </div>
  );
}