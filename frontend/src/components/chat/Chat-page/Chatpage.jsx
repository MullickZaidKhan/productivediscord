import { useEffect, useMemo, useRef, useState } from "react";
import {
  Phone,
  ChevronLeft,
  Video,
  Pin,
  Users,
  UsersRound,
  Gift,
  Smile,
  Grid3x3,
  Image as ImageIcon,
  Plus,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import { closeChat } from "../../../redux/chat/Chatslice.js";
import {
  useSendDirectMessage,
  usegetDirectMessages,
} from "../../../hooks/chat/directMessage.hook.js";
import { useGetPublicKey } from "../../../hooks/useCrypto.js";
import {
  createSharedKey,
  encryptMessage,
  decryptMessage,
  base64ToUint8Array,
  arrayBufferToBase64,
  uint8ArrayToBase64,
} from "../../../crypto/cryptoUtils.js";
import { createSocket } from "../../../socket.io-client/socket.io-client.js";
import TypingIndicator from "./TypingIndicator.jsx";
import MessageRow from "./MessageRow.jsx";
import InputIcon from "./InputIcon.jsx";
import { groupMessagesByDay } from "./groupMessagesByDay.js";
import { useGetUserBackground } from "../../../hooks/background.hook.js";
// export default function ChatPage() {
//   const dispatch = useDispatch();
//   const queryClient = useQueryClient();
//   const [isContactTyping, setIsContactTyping] = useState(false);
//   const typingTimeoutRef = useRef(null);
//   const [headerIn, setHeaderIn] = useState(false);
//   const [draft, setDraft] = useState("");
//   const [decryptedMessages, setDecryptedMessages] = useState([]);
//   const [isSharedKeyReady, setIsSharedKeyReady] = useState(false);
//   const scrollRef = useRef(null);

//   const contact = useSelector((state) => state.chat.userinfo);

//   const currentUser = useSelector((state) => state.authinfoSlice.userinfo);
//   const sharedKeyRef = useRef(null);
//   const {
//     data: userBPublicKey,
//   } = useGetPublicKey(contact?._id);
//   useEffect(() => {
//     if (userBPublicKey) {
//       console.log("User B Public Key:", userBPublicKey);
//     }
//   }, [userBPublicKey]);

//   useEffect(() => {
//     if (!currentUser?.id || !contact?._id || !userBPublicKey?.publicKey) {
//       return;
//     }

//     const setupSharedKey = async () => {
//       try {
//         const sharedKey = await createSharedKey(
//           currentUser.id,
//           userBPublicKey.publicKey,
//         );

//         sharedKeyRef.current = sharedKey;
//         setIsSharedKeyReady(true);

//         console.log("🔐 Shared Key Ready:", sharedKey);
//       } catch (error) {
//         console.error("❌ Failed to create shared key:", error);
//         sharedKeyRef.current = null;
//         setIsSharedKeyReady(false);
//       }
//     };

//     setupSharedKey();
//   }, [currentUser?.id, contact?._id, userBPublicKey]);

//   const socket = useMemo(() => createSocket(), []);
//   useEffect(() => {
//     const handleMessageReceive = async ({ message, senderId }) => {
//       if (String(senderId) !== String(contact?._id)) {
//         console.log("⛔ Message belongs to another conversation");
//         return;
//       }

//       try {
//         let decryptedMessage = message;

//         // E2EE message
//         if (message.encryptedText && message.iv) {
//           if (!sharedKeyRef.current) {
//             console.error("❌ Shared key is not ready");
//             return;
//           }

//           const encryptedBytes = base64ToUint8Array(message.encryptedText);

//           const ivBytes = base64ToUint8Array(message.iv);

//           const text = await decryptMessage(
//             encryptedBytes.buffer,
//             ivBytes,
//             sharedKeyRef.current,
//           );

//           decryptedMessage = {
//             ...message,
//             text,
//           };

//           console.log("🔓 Socket Message Decrypted:", decryptedMessage);
//         }

//         queryClient.setQueryData(
//           ["directMessages", contact?._id],
//           (previousDataofchat) => {
//             if (Array.isArray(previousDataofchat?.data?.data)) {
//               return {
//                 ...previousDataofchat,
//                 data: {
//                   ...previousDataofchat.data,
//                   data: [...previousDataofchat.data.data, decryptedMessage],
//                 },
//               };
//             }

//             return previousDataofchat;
//           },
//         );
//       } catch (error) {
//         console.error("❌ Socket Message Decryption Error:", error);
//       }
//     };

//     socket.on("message:receive", handleMessageReceive);

//     return () => {
//       socket.off("message:receive", handleMessageReceive);
//     };
//   }, [socket, queryClient, contact?._id]);

//   // Adjust this selector to match wherever the logged-in user is stored in your auth slice.

//   useEffect(() => {
//     const handleTypingStart = ({ userId }) => {
//       // console.log("⌨️ TYPING START RECEIVED:", userId);
//       // console.log("👤 CURRENT CONTACT:", contact?._id);

//       if (String(userId) === String(contact?._id)) {
//         setIsContactTyping(true);
//       }
//     };

//     const handleTypingStop = ({ userId }) => {
//       // console.log("⌨️ TYPING STOP RECEIVED:", userId);

//       if (String(userId) === String(contact?._id)) {
//         setIsContactTyping(false);
//       }
//     };

//     socket.on("typing:start", handleTypingStart);
//     socket.on("typing:stop", handleTypingStop);

//     return () => {
//       socket.off("typing:start", handleTypingStart);
//       socket.off("typing:stop", handleTypingStop);
//     };
//   }, [socket, contact?._id]);

//   const {
//     data: messagesResponse,
//     isLoading: messagesLoading,
//     isError: messagesError,
//   } = usegetDirectMessages(contact?._id);
//   const onlineFriends = useSelector(
//     (state) => state.onlineFriendsslice?.ONLINE_USERS || [],
//   );
//   const findtheuserisonline = onlineFriends.some(
//     (person) => String(person.id) === String(contact?._id),
//   );

//   const { mutate: sendDirectMessage, isPending: isSending } =
//     useSendDirectMessage();

//   const messages = useMemo(() => {
//     // Handles either { data: [...] } or an axios-wrapped { data: { data: [...] } }
//     if (Array.isArray(messagesResponse)) return messagesResponse;
//     if (Array.isArray(messagesResponse?.data)) return messagesResponse.data;
//     if (Array.isArray(messagesResponse?.data?.data))
//       return messagesResponse.data.data;
//     return [];
//   }, [messagesResponse]);
//   // 👇 ADD DECRYPTION HERE
//   useEffect(() => {
//     if (!messages.length || !sharedKeyRef.current) {
//       return;
//     }

//     const decryptMessages = async () => {
//       try {
//         const decrypted = await Promise.all(
//           messages.map(async (message) => {
//             // Old plaintext message
//             if (!message.encryptedText || !message.iv) {
//               return {
//                 ...message,
//                 text: message.text || "",
//               };
//             }

//             const encryptedBytes = base64ToUint8Array(message.encryptedText);

//             const ivBytes = base64ToUint8Array(message.iv);

//             const text = await decryptMessage(
//               encryptedBytes.buffer,
//               ivBytes,
//               sharedKeyRef.current,
//             );

//             // Replace encrypted message with plaintext
//             return {
//               ...message,
//               text: text,
//             };
//           }),
//         );

//         setDecryptedMessages(decrypted);

//         console.log("🔓 Decrypted Messages:", decrypted);
//       } catch (error) {
//         console.error("❌ Message Decryption Error:", error);
//       }
//     };

//     decryptMessages();
//   }, [messages,isSharedKeyReady

//   ]);
//   const sortedMessages = useMemo(
//     () =>
//       [...decryptedMessages].sort(
//         (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
//       ),
//     [decryptedMessages],
//   );

//   const groupedMessages = useMemo(
//     () => groupMessagesByDay(sortedMessages),
//     [sortedMessages],
//   );

//   // Header fade-in
//   useEffect(() => {
//     const headerTimer = setTimeout(() => setHeaderIn(true), 30);
//     return () => clearTimeout(headerTimer);
//   }, []);

//   // Keep the view scrolled to the newest message
//   useEffect(() => {
//     if (scrollRef.current) {
//       scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
//     }
//   }, [messages.length]);

//   if (!contact) {
//     return (
//       <div className="flex-1 min-w-0 min-h-0 h-full bg-[#0000008e] flex items-center justify-center text-[#949ba4] text-sm">
//         Select a conversation to start chatting
//       </div>
//     );
//   }

//   // const handleSend = () => {
//   //   const text = draft.trim();
//   //   if (!text || isSending) return;

//   //   sendDirectMessage(
//   //     { receiver: contact._id, text },
//   //     {
//   //       onSuccess: () => {
//   //         setDraft("");
//   //         queryClient.invalidateQueries({
//   //           queryKey: ["directMessages", contact._id],
//   //         });
//   //       },
//   //     },
//   //   );
//   // };
//   const handleSend = async () => {
//     const text = draft.trim();

//     if (!text || isSending) return;

//     if (!sharedKeyRef.current) {
//       console.error("❌ Shared key is not ready");
//       return;
//     }

//     try {
//       const { encrypted, iv } = await encryptMessage(
//         text,
//         sharedKeyRef.current,
//       );
//       const encryptedBase64 = arrayBufferToBase64(encrypted);
//       const ivBase64 = uint8ArrayToBase64(iv);
//       sendDirectMessage(
//         {
//           receiver: contact._id,
//           encryptedText: encryptedBase64,
//           iv: ivBase64,
//         },
//         {
//           onSuccess: () => {
//             setDraft("");

//             queryClient.invalidateQueries({
//               queryKey: ["directMessages", contact._id],
//             });
//           },
//         },
//       );
//       console.log("🔐 Ciphertext Base64:", encryptedBase64);
//       console.log("🔑 IV Base64:", ivBase64);
//       console.log("🔐 Encrypted Message:", encrypted);
//       console.log("🔑 IV:", iv);
//     } catch (error) {
//       console.error("❌ Message Encryption Error:", error);
//     }
//   };
//   const handleTyping = (e) => {
//     const value = e.target.value;

//     setDraft(value);

//     if (!contact?._id || !currentUser?.id) return;

//     // Send typing:start to server
//     socket.emit("typing:start", {
//       senderId: currentUser.id,
//       receiverId: contact._id,
//     });

//     // Clear previous timeout
//     if (typingTimeoutRef.current) {
//       clearTimeout(typingTimeoutRef.current);
//     }

//     // After 1 second without typing, send typing:stop
//     typingTimeoutRef.current = setTimeout(() => {
//       socket.emit("typing:stop", {
//         senderId: currentUser.id,
//         receiverId: contact._id,
//       });
//     }, 1000);
//   };
//   const handleKeyDown = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSend();
//     }
//   };

//   return (
//     <div
//       className="
//         fixed inset-0 z-50 bg-[#0000008e] flex flex-col
//         sm:static sm:inset-auto sm:z-auto sm:flex-1 sm:min-w-0 sm:min-h-0 sm:h-full
//       "
//     >
//       {/* Header */}
//       <div
//         className="flex items-center justify-between px-4 h-12 border-b border-[#26282c] shadow-sm shrink-0 transition-all duration-300 ease-out py-2"
//         style={{
//           opacity: headerIn ? 1 : 0,
//           transform: headerIn ? "translateY(0px)" : "translateY(-6px)",
//         }}
//       >
//         <div className="flex items-center gap-2.5 min-w-0">
//           <button
//             onClick={() => dispatch(closeChat())}
//             className="rounded-full p-1 hover:bg-white/10 transition-colors"
//             aria-label="Close chat"
//           >
//             <ChevronLeft className="text-white" />
//           </button>

//           <div className="relative shrink-0">
//             {/* Avatar */}
//             <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center text-white text-xs font-medium">
//               {contact.profileimg ? (
//                 <img
//                   src={contact.profileimg}
//                   alt={contact.name || "User"}
//                   className="w-full h-full object-cover"
//                 />
//               ) : (
//                 <div
//                   className="w-full h-full rounded-full flex items-center justify-center"
//                   style={{
//                     backgroundColor: contact.color || "#6b7280",
//                   }}
//                 >
//                   {contact.initials ? (
//                     contact.initials
//                   ) : contact.name ? (
//                     contact.name.slice(0, 2).toUpperCase()
//                   ) : (
//                     <UsersRound size={16} className="text-white" />
//                   )}
//                 </div>
//               )}
//             </div>

//             {/* Online / Offline status */}
//             <span
//               className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-[3px] border-[#313338] ${
//                 findtheuserisonline ? "bg-[#23a559]" : "bg-[#80848e]"
//               }`}
//             />
//           </div>

//           <span className="font-semibold text-[15px] text-white truncate">
//             {contact.name}
//           </span>
//         </div>

//         <div className="flex items-center gap-4 text-[#b5bac1]">
//           <InputIcon label="Call">
//             <Phone size={20} />
//           </InputIcon>
//           <InputIcon label="Video call">
//             <Video size={20} />
//           </InputIcon>
//           <InputIcon label="Pinned messages">
//             <Pin size={20} />
//           </InputIcon>
//           <InputIcon label="Add friend">
//             <Users size={20} />
//           </InputIcon>
//         </div>
//       </div>

//       {/* Messages */}
//       <div ref={scrollRef} className="flex-1 overflow-y-auto pb-2">
//         {messagesLoading && (
//           <p className="text-center text-[13px] text-[#6d6f78] mt-6">
//             Loading messages…
//           </p>
//         )}

//         {messagesError && (
//           <p className="text-center text-[13px] text-[#ed4245] mt-6">
//             Couldn't load messages. Please try again.
//           </p>
//         )}

//         {!messagesLoading && !messagesError && messages.length === 0 && (
//           <p className="text-center text-[13px] text-[#6d6f78] mt-6">
//             No messages yet. Say hello 👋
//           </p>
//         )}

//         {groupedMessages.map((group) => (
//           <div key={group.label}>
//             <div className="flex items-center gap-3 px-6 my-3 select-none">
//               <div className="h-px bg-[#3f4147] flex-1" />
//               <span className="text-[12px] text-[#949ba4] font-medium">
//                 {group.label}
//               </span>
//               <div className="h-px bg-[#3f4147] flex-1" />
//             </div>

//             <div className="flex flex-col gap-2.5">
//               {group.messages.map((message) => {
//                 const isOwn = message.sender === currentUser?.id;
//                 const author = isOwn
//                   ? {
//                       name: currentUser?.name || "You",
//                       profileimg: currentUser?.profileimg,
//                     }
//                   : { name: contact.name, profileimg: contact?.profileimg };
//                 return (
//                   <MessageRow
//                     key={message._id}
//                     message={message}
//                     author={author}
//                   />
//                 );
//               })}
//             </div>
//           </div>
//         ))}
//       </div>
//       {isContactTyping && <TypingIndicator name={contact.name} />}
//       {/* Message input */}
//       <div className="px-4 pb-6 p-8 pt-1 shrink-0">
//         <div className="flex items-center gap-3 bg-[#383a40] rounded-lg px-4 py-2.5 focus-within:ring-1 focus-within:ring-[#4a4d55] transition-all duration-200">
//           <InputIcon label="Add attachment">
//             <Plus size={20} />
//           </InputIcon>
//           <input
//             type="text"
//             value={draft}
//             // onChange={(e) => setDraft(e.target.value)}
//             onChange={handleTyping}
//             onKeyDown={handleKeyDown}
//             placeholder={`Message @${contact.name}`}
//             className="flex-1 bg-transparent outline-none text-cyan-50 text-[15px] placeholder-[#6d6f78]"
//           />
//           <div className="flex items-center gap-3.5">
//             <InputIcon label="Send a gift">
//               <Gift size={20} />
//             </InputIcon>
//             <InputIcon label="Open GIF picker">
//               <ImageIcon size={20} />
//             </InputIcon>
//             <InputIcon label="Open sticker picker">
//               <Grid3x3 size={20} />
//             </InputIcon>
//             <InputIcon
//               label="Send message"
//               onClick={handleSend}
//               disabled={isSending || !draft.trim()}
//             >
//               <Smile size={20} />
//             </InputIcon>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
export default function ChatPage() {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [isContactTyping, setIsContactTyping] = useState(false);
  const typingTimeoutRef = useRef(null);
  const [headerIn, setHeaderIn] = useState(false);
  const [draft, setDraft] = useState("");
  const [decryptedMessages, setDecryptedMessages] = useState([]);
  const [isSharedKeyReady, setIsSharedKeyReady] = useState(false);
  const scrollRef = useRef(null);

  const contact = useSelector((state) => state.chat.userinfo);
  const currentUser = useSelector((state) => state.authinfoSlice.userinfo);
  const sharedKeyRef = useRef(null);

  // 🖼️ Background wallpaper
  const { data: backgroundData } = useGetUserBackground();
  const backgrounds = backgroundData?.data || [];
  const bgimg = backgrounds.imageUrl
    ? backgrounds.imageUrl
    : "https://i.pinimg.com/1200x/62/7e/3a/627e3aa8f4209d6cbcfcd831a30f935e.jpg";

  const { data: userBPublicKey } = useGetPublicKey(contact?._id);

  useEffect(() => {
    if (userBPublicKey) {
      console.log("User B Public Key:", userBPublicKey);
    }
  }, [userBPublicKey]);

  useEffect(() => {
    if (!currentUser?.id || !contact?._id || !userBPublicKey?.publicKey) {
      return;
    }

    const setupSharedKey = async () => {
      try {
        const sharedKey = await createSharedKey(
          currentUser.id,
          userBPublicKey.publicKey,
        );

        sharedKeyRef.current = sharedKey;
        setIsSharedKeyReady(true);

        console.log("🔐 Shared Key Ready:", sharedKey);
      } catch (error) {
        console.error("❌ Failed to create shared key:", error);
        sharedKeyRef.current = null;
        setIsSharedKeyReady(false);
      }
    };

    setupSharedKey();
  }, [currentUser?.id, contact?._id, userBPublicKey]);

  const socket = useMemo(() => createSocket(), []);

  useEffect(() => {
    const handleMessageReceive = async ({ message, senderId }) => {
      if (String(senderId) !== String(contact?._id)) {
        console.log("⛔ Message belongs to another conversation");
        return;
      }

      try {
        let decryptedMessage = message;

        if (message.encryptedText && message.iv) {
          if (!sharedKeyRef.current) {
            console.error("❌ Shared key is not ready");
            return;
          }

          const encryptedBytes = base64ToUint8Array(message.encryptedText);
          const ivBytes = base64ToUint8Array(message.iv);

          const text = await decryptMessage(
            encryptedBytes.buffer,
            ivBytes,
            sharedKeyRef.current,
          );

          decryptedMessage = {
            ...message,
            text,
          };

          console.log("🔓 Socket Message Decrypted:", decryptedMessage);
        }

        queryClient.setQueryData(
          ["directMessages", contact?._id],
          (previousDataofchat) => {
            if (Array.isArray(previousDataofchat?.data?.data)) {
              return {
                ...previousDataofchat,
                data: {
                  ...previousDataofchat.data,
                  data: [...previousDataofchat.data.data, decryptedMessage],
                },
              };
            }

            return previousDataofchat;
          },
        );
      } catch (error) {
        console.error("❌ Socket Message Decryption Error:", error);
      }
    };

    socket.on("message:receive", handleMessageReceive);

    return () => {
      socket.off("message:receive", handleMessageReceive);
    };
  }, [socket, queryClient, contact?._id]);

  useEffect(() => {
    const handleTypingStart = ({ userId }) => {
      if (String(userId) === String(contact?._id)) {
        setIsContactTyping(true);
      }
    };

    const handleTypingStop = ({ userId }) => {
      if (String(userId) === String(contact?._id)) {
        setIsContactTyping(false);
      }
    };

    socket.on("typing:start", handleTypingStart);
    socket.on("typing:stop", handleTypingStop);

    return () => {
      socket.off("typing:start", handleTypingStart);
      socket.off("typing:stop", handleTypingStop);
    };
  }, [socket, contact?._id]);

  const {
    data: messagesResponse,
    isLoading: messagesLoading,
    isError: messagesError,
  } = usegetDirectMessages(contact?._id);

  const onlineFriends = useSelector(
    (state) => state.onlineFriendsslice?.ONLINE_USERS || [],
  );
  const findtheuserisonline = onlineFriends.some(
    (person) => String(person.id) === String(contact?._id),
  );

  const { mutate: sendDirectMessage, isPending: isSending } =
    useSendDirectMessage();

  const messages = useMemo(() => {
    if (Array.isArray(messagesResponse)) return messagesResponse;
    if (Array.isArray(messagesResponse?.data)) return messagesResponse.data;
    if (Array.isArray(messagesResponse?.data?.data))
      return messagesResponse.data.data;
    return [];
  }, [messagesResponse]);

  useEffect(() => {
    if (!messages.length || !sharedKeyRef.current) {
      return;
    }

    const decryptMessages = async () => {
      try {
        const decrypted = await Promise.all(
          messages.map(async (message) => {
            if (!message.encryptedText || !message.iv) {
              return {
                ...message,
                text: message.text || "",
              };
            }

            const encryptedBytes = base64ToUint8Array(message.encryptedText);
            const ivBytes = base64ToUint8Array(message.iv);

            const text = await decryptMessage(
              encryptedBytes.buffer,
              ivBytes,
              sharedKeyRef.current,
            );

            return {
              ...message,
              text: text,
            };
          }),
        );

        setDecryptedMessages(decrypted);

        console.log("🔓 Decrypted Messages:", decrypted);
      } catch (error) {
        console.error("❌ Message Decryption Error:", error);
      }
    };

    decryptMessages();
  }, [messages, isSharedKeyReady]);

  const sortedMessages = useMemo(
    () =>
      [...decryptedMessages].sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      ),
    [decryptedMessages],
  );

  const groupedMessages = useMemo(
    () => groupMessagesByDay(sortedMessages),
    [sortedMessages],
  );

  useEffect(() => {
    const headerTimer = setTimeout(() => setHeaderIn(true), 30);
    return () => clearTimeout(headerTimer);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages.length]);

  if (!contact) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center text-[#949ba4] text-sm bg-cover bg-center sm:static sm:inset-auto sm:z-auto sm:flex-1 sm:min-w-0 sm:min-h-0 sm:h-full"
        style={{ backgroundImage: `url(${bgimg})` }}
      >
        {/* <div className="absolute inset-0 bg-[#000000b6]" /> */}
        <span className="relative z-10">
          Select a conversation to start chatting
        </span>
      </div>
    );
  }

  const handleSend = async () => {
    const text = draft.trim();

    if (!text || isSending) return;

    if (!sharedKeyRef.current) {
      console.error("❌ Shared key is not ready");
      return;
    }

    try {
      const { encrypted, iv } = await encryptMessage(
        text,
        sharedKeyRef.current,
      );
      const encryptedBase64 = arrayBufferToBase64(encrypted);
      const ivBase64 = uint8ArrayToBase64(iv);
      sendDirectMessage(
        {
          receiver: contact._id,
          encryptedText: encryptedBase64,
          iv: ivBase64,
        },
        {
          onSuccess: () => {
            setDraft("");

            queryClient.invalidateQueries({
              queryKey: ["directMessages", contact._id],
            });
          },
        },
      );
      console.log("🔐 Ciphertext Base64:", encryptedBase64);
      console.log("🔑 IV Base64:", ivBase64);
      console.log("🔐 Encrypted Message:", encrypted);
      console.log("🔑 IV:", iv);
    } catch (error) {
      console.error("❌ Message Encryption Error:", error);
    }
  };

  const handleTyping = (e) => {
    const value = e.target.value;

    setDraft(value);

    if (!contact?._id || !currentUser?.id) return;

    socket.emit("typing:start", {
      senderId: currentUser.id,
      receiverId: contact._id,
    });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("typing:stop", {
        senderId: currentUser.id,
        receiverId: contact._id,
      });
    }, 1000);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className="
        fixed inset-0 z-50 flex flex-col 
        sm:static sm:inset-auto sm:z-auto sm:flex-1 sm:min-w-0 sm:min-h-0 sm:h-full sm:bg-[#0000008e]
      "
    >
      {/* Mobile-only wallpaper layer (hidden on sm and up) */}
      <div
        className="absolute inset-0 bg-cover bg-center sm:hidden"
        style={{
          backgroundImage: `url(${bgimg})`,
          filter: "brightness(0.6)",
        }}
      />
      {/* Mobile-only dark tint over the wallpaper (hidden on sm and up) */}
      <div className="absolute inset-0 bg-[#000000ab] sm:hidden" />

      {/* Actual content, sits above the mobile background layers */}
      <div className="relative z-10 flex flex-col h-full ">
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 h-13 border-b bg-[#26282c]/70 border-[#26282c] shadow-sm shrink-0 transition-all duration-300 ease-out py-2"
          style={{
            opacity: headerIn ? 1 : 0,
            transform: headerIn ? "translateY(0px)" : "translateY(-6px)",
          }}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              onClick={() => dispatch(closeChat())}
              className="rounded-full p-1 hover:bg-white/10 transition-colors"
              aria-label="Close chat"
            >
              <ChevronLeft className="text-white" />
            </button>

            <div className="relative shrink-0">
              <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center text-white text-xs font-medium">
                {contact.profileimg ? (
                  <img
                    src={contact.profileimg}
                    alt={contact.name || "User"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="w-full h-full rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: contact.color || "#6b7280",
                    }}
                  >
                    {contact.initials ? (
                      contact.initials
                    ) : contact.name ? (
                      contact.name.slice(0, 2).toUpperCase()
                    ) : (
                      <UsersRound size={16} className="text-white" />
                    )}
                  </div>
                )}
              </div>

              <span
                className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-[3px] border-[#313338] ${
                  findtheuserisonline ? "bg-[#23a559]" : "bg-[#80848e]"
                }`}
              />
            </div>

            <span className="font-semibold text-[15px] text-white truncate">
              {contact.name}
            </span>
          </div>

          <div className="flex items-center gap-4 text-[#b5bac1]">
            <InputIcon label="Call">
              <Phone size={20} />
            </InputIcon>
            <InputIcon label="Video call">
              <Video size={20} />
            </InputIcon>
            <InputIcon label="Pinned messages">
              <Pin size={20} />
            </InputIcon>
            <InputIcon label="Add friend">
              <Users size={20} />
            </InputIcon>
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto pb-2">
          {messagesLoading && (
            <p className="text-center text-[13px] text-[#6d6f78] mt-6">
              Loading messages…
            </p>
          )}

          {messagesError && (
            <p className="text-center text-[13px] text-[#ed4245] mt-6">
              Couldn't load messages. Please try again.
            </p>
          )}

          {!messagesLoading && !messagesError && messages.length === 0 && (
            <p className="text-center text-[13px] text-[#6d6f78] mt-6">
              No messages yet. Say hello 👋
            </p>
          )}

          {groupedMessages.map((group) => (
            <div key={group.label}>
              <div className="flex items-center gap-3 px-6 my-3 select-none">
                <div className="h-px bg-[#3f4147] flex-1" />
                <span className="text-[12px] text-[#949ba4] font-medium">
                  {group.label}
                </span>
                <div className="h-px bg-[#3f4147] flex-1" />
              </div>

              <div className="flex flex-col gap-2.5">
                {group.messages.map((message) => {
                  const isOwn = message.sender === currentUser?.id;
                  const author = isOwn
                    ? {
                        name: currentUser?.name + " ( you )" || "You",
                        profileimg: currentUser?.profileimg,
                      }
                    : { name: contact.name, profileimg: contact?.profileimg };
                  return (
                    <MessageRow
                      key={message._id}
                      message={message}
                      author={author}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {isContactTyping && <TypingIndicator name={contact.name} />}

        {/* Message input */}
        <div className="px-4 pb-6 p-8 pt-1 shrink-0">
          <div className="flex items-center gap-3 bg-[#383a40] rounded-lg px-4 py-2.5 focus-within:ring-1 focus-within:ring-[#4a4d55] transition-all duration-200">
            <InputIcon label="Add attachment">
              <Plus size={20} />
            </InputIcon>
            <input
              type="text"
              value={draft}
              onChange={handleTyping}
              onKeyDown={handleKeyDown}
              placeholder={`Message @${contact.name}`}
              className="flex-1 bg-transparent outline-none text-cyan-50 text-[15px] placeholder-[#6d6f78]"
            />
            <div className="flex items-center gap-3.5">
              <InputIcon label="Send a gift">
                <Gift size={20} />
              </InputIcon>
              <InputIcon label="Open GIF picker">
                <ImageIcon size={20} />
              </InputIcon>
              <InputIcon label="Open sticker picker">
                <Grid3x3 size={20} />
              </InputIcon>
              <InputIcon
                label="Send message"
                onClick={handleSend}
                disabled={isSending || !draft.trim()}
              >
                <Smile size={20} />
              </InputIcon>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
