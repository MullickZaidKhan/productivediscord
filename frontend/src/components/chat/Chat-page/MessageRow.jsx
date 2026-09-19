// import Avatar from "./Avatar.jsx";
// import { formatTime } from "./formatTime.js";

// export default function MessageRow({ message, author }) {
//   const hasImage = Boolean(message.image);
//   const hasText = Boolean(message.text);
//   const isDecryptionError = message.text === "⚠️ something went wrong";
//   // console.log(author);
//   return (
//     <div className="msg-row-in group flex gap-4 px-4 md:px-6 py-0.5 hover:bg-white/[0.03] rounded">
//       <div className="pt-0.5 shrink-0">
//         <Avatar
//           name={author.name}
//           profileimg={author.profileimg}
//           initials={author.initials}
//           color={author.color}
//         />
//       </div>
//       <div className="min-w-0">
//         <div className="flex items-baseline">
//           <span className="text-[15px] font-medium text-white hover:underline cursor-pointer">
//             {author.name}
//           </span>
//           <span className="text-[11px] text-[#949ba4] ml-2">
//             {formatTime(message.createdAt)}
//           </span>
//           {message.edited && (
//             <span className="text-[10px] text-[#6d6f78] ml-1.5">(edited)</span>
//           )}
//         </div>

//         {hasImage && (
//           <img
//             src={message.image}
//             alt="attachment"
//             className="mt-1 max-w-xs rounded-lg border border-[#26282c]"
//           />
//         )}

//         {hasText && (
//           <p   className={ isDecryptionError ? "text-[13px] font-bold text-[#afafaff7] italic leading-[1.375rem] whitespace-pre-wrap break-words opacity-80" : "text-[15px] text-[#dbdee1] leading-[1.375rem] whitespace-pre-wrap break-words" }>
//             {message.text}
//           </p>
//         )}
//       </div>
//     </div>
//   );
// }

import Avatar from "./Avatar.jsx";
import { formatTime } from "./formatTime.js";

const DECRYPT_ERROR_TEXT = "⚠️ something went wrong";

function DecryptionError() {
  return (
    <div
      role="alert"
      className="mt-1 inline-flex max-w-full items-center gap-2 rounded-md border border-l-4 border-[#5865f2]/20 border-l-[#5865f2] bg-[#5865f2]/[0.10] px-3 py-1.5"
    >
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4 shrink-0 text-[#fbfbfd]"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
      <div className="min-w-0 leading-tight">
        <p className="text-[13px] font-medium text-[#8b8dec]">
          something went wrong
        </p>
        <p className="text-[11px] text-[#949ba4]">
          Refresh to try again.
        </p>
      </div>
    </div>
  );
}

export default function MessageRow({ message, author }) {
  const hasImage = Boolean(message.image);
  const hasText = Boolean(message.text);
  const isDecryptionError =
    message.decryptFailed === true || message.text === DECRYPT_ERROR_TEXT;

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

        {hasText &&
          (isDecryptionError ? (
            <DecryptionError />
          ) : (
            <p className="text-[15px] text-[#dbdee1] leading-[1.375rem] whitespace-pre-wrap break-words">
              {message.text}
            </p>
          ))}
      </div>
    </div>
  );
}
