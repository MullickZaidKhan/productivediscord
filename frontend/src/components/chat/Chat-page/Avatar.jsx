import { UsersRound } from "lucide-react";
import { avatarColor } from "./avatarColor.js";

export default function Avatar({ name, size = 40, profileimg, initials, color }) {
  return (
    <div
      style={{ width: size, height: size }}
      className="rounded-full overflow-hidden shrink-0 select-none"
    >
      {profileimg ? (
        <img
          src={profileimg}
          alt={name || "User"}
          className="w-full h-full object-cover"
        />
      ) : (
        <div
          className="w-full h-full rounded-full flex items-center justify-center font-semibold text-white"
          style={{ backgroundColor: color || avatarColor(name || "?") }}
        >
          {initials ? (
            initials
          ) : name ? (
            name.slice(0, 2).toUpperCase()
          ) : (
            <UsersRound size={size * 0.4} className="text-white" />
          )}
        </div>
      )}
    </div>
  );
}