import Avatar from "./Avatar.jsx";
import { formatTime } from "./formatTime.js";

export default function MessageRow({ message, author }) {
  const hasImage = Boolean(message.image);
  const hasText = Boolean(message.text);
  // console.log(author);
  return (
    <div className="msg-row-in group flex gap-4 px-4 md:px-6 py-0.5 hover:bg-white/[0.03] rounded">
      <div className="pt-0.5 shrink-0">
        <Avatar
          name={author.name}
          profileimg={author.profileimg}
          initials={author.initials}
          color={author.color}
        />
      </div>
      <div className="min-w-0">
        <div className="flex items-baseline">
          <span className="text-[15px] font-medium text-white hover:underline cursor-pointer">
            {author.name}
          </span>
          <span className="text-[11px] text-[#949ba4] ml-2">
            {formatTime(message.createdAt)}
          </span>
          {message.edited && (
            <span className="text-[10px] text-[#6d6f78] ml-1.5">(edited)</span>
          )}
        </div>

        {hasImage && (
          <img
            src={message.image}
            alt="attachment"
            className="mt-1 max-w-xs rounded-lg border border-[#26282c]"
          />
        )}

        {hasText && (
          <p className="text-[15px] text-[#dbdee1] leading-[1.375rem] whitespace-pre-wrap break-words">
            {message.text}
          </p>
        )}
      </div>
    </div>
  );
}