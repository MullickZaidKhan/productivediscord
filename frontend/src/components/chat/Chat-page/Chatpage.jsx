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
import { useGetPublicKeys } from "../../../hooks/useCrypto.js";
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
import { getDeviceId } from "../../../lib/device.js";
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
  const sharedKeysRef = useRef(new Map());
  const senderSharedKeysRef = useRef(new Map());
  // 🖼️ Background wallpaper
  const { data: backgroundData } = useGetUserBackground();
  const backgrounds = backgroundData?.data || [];
  const bgimg = backgrounds.imageUrl
    ? backgrounds.imageUrl
    : "https://i.pinimg.com/1200x/62/7e/3a/627e3aa8f4209d6cbcfcd831a30f935e.jpg";
  const deviceId = getDeviceId();
  console.log("🫠 My device ID: ", deviceId);
  const { data: userBPublicKeys } = useGetPublicKeys(contact?._id);
  const { data: myPublicKeys } = useGetPublicKeys(currentUser?._id);
  // console.log("from api find userBPublicKeys:",userBPublicKeys)
  useEffect(() => {
    if (userBPublicKeys) {
      console.log("User B Public Key:", userBPublicKeys);
    }
  }, [userBPublicKeys]);

  useEffect(() => {
    console.log("🔐 Shared key effect running");
    console.log("Full public key response:", userBPublicKeys);
    console.log("User B devices:", userBPublicKeys?.devices);

    if (
      !currentUser?.id ||
      !contact?._id ||
      !userBPublicKeys?.devices?.length
    ) {
      console.log("⏳ Shared keys not ready yet");
      return;
    }

    const setupSharedKeys = async () => {
      try {
        const keys = new Map();

        for (const device of userBPublicKeys.devices) {
          console.log("🔐 Creating key for:", device.deviceId);

          const sharedKey = await createSharedKey(deviceId, device.publicKey);

          keys.set(device.deviceId, sharedKey);
        }

        sharedKeysRef.current = keys;

        console.log("✅ Shared keys ready:", sharedKeysRef.current.size);

        setIsSharedKeyReady(true);
      } catch (error) {
        console.error("❌ Failed to create shared keys:", error);

        sharedKeysRef.current = new Map();
        setIsSharedKeyReady(false);
      }
    };

    setupSharedKeys();
  }, [currentUser?.id, contact?._id, userBPublicKeys, deviceId]);
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
          if (!sharedKeysRef.current) {
            console.error("❌ Shared key is not ready");
            return;
          }

          const encryptedBytes = base64ToUint8Array(message.encryptedText);
          const ivBytes = base64ToUint8Array(message.iv);
          const text = await decryptMessage(
            encryptedBytes.buffer,
            ivBytes,
            sharedKey,
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

  // useEffect(() => {
  //   if (!messages.length || !sharedKeysRef.current || sharedKeysRef.current.size === 0) {
  //     console.log("a  problem ")
  //     return;
  //   }

  //   const decryptMessages = async () => {
  //     try {
  //       const decrypted = await Promise.all(
  //         messages.map(async (message) => {
  //           if (!message.encryptedText || !message.iv) {
  //             return {
  //               ...message,
  //               text: message.text || "",
  //             };
  //           }
  //           console.log("📩 Message from backend:", message);
  //           const encryptedBytes = base64ToUint8Array(message.encryptedText);
  //           const ivBytes = base64ToUint8Array(message.iv);
  //           const sharedKey = sharedKeysRef.current.get(
  //             message.deviceId
  //           );

  //           if (!sharedKey) {
  //             console.error(
  //               "❌ Shared key not found for device:",
  //               message.deviceId
  //             );

  //             return {
  //               ...message,
  //               text: "Something Went Wrong",
  //             };
  //           }
  //           const text = await decryptMessage(
  //             encryptedBytes.buffer,
  //             ivBytes,
  //             sharedKey,
  //           );

  //           return {
  //             ...message,
  //             text: text,
  //           };
  //         }),
  //       );

  //       setDecryptedMessages(decrypted);

  //       console.log("🔓 Decrypted Messages:", decrypted);
  //     } catch (error) {
  //       console.error("❌ Message Decryption Error:", error);
  //     }
  //   };

  //   decryptMessages();
  // }, [messages, isSharedKeyReady]);
  useEffect(() => {
    console.log("🟡 Decrypt effect fired", {
      messagesLength: messages.length,
      isSharedKeyReady,
      sharedKeysSize: sharedKeysRef.current?.size,
      sharedKeysContents: sharedKeysRef.current
        ? Array.from(sharedKeysRef.current.keys())
        : null,
    });

    if (
      !messages.length ||
      !sharedKeysRef.current ||
      sharedKeysRef.current.size === 0
    ) {
      console.log("⏭️ Skipping decrypt — no messages or no shared keys yet", {
        hasMessages: !!messages.length,
        hasSharedKeysMap: !!sharedKeysRef.current,
        sharedKeysSize: sharedKeysRef.current?.size,
      });
      return;
    }

    const decryptMessages = async () => {
      try {
        const decrypted = await Promise.all(
          messages.map(async (message) => {
            if (!message.encryptedText || !message.iv) {
              console.log(
                "ℹ️ Message has no encryptedText/iv, using plain text:",
                message._id,
              );
              return {
                ...message,
                text: message.text || "",
              };
            }

            console.log("📩 Attempting decrypt for message:", {
              id: message._id,
              deviceId: message.deviceId,
              encryptedTextPreview: message.encryptedText?.slice(0, 12),
              ivPreview: message.iv?.slice(0, 12),
            });

            const encryptedBytes = base64ToUint8Array(message.encryptedText);
            const ivBytes = base64ToUint8Array(message.iv);
            const sharedKey = sharedKeysRef.current.get(message.deviceId);

            console.log(
              "🔑 Looked up shared key for deviceId:",
              message.deviceId,
              "->",
              sharedKey ? "FOUND" : "MISSING",
            );

            if (!sharedKey) {
              console.error(
                "❌ Shared key not found for device:",
                message.deviceId,
                "Available keys:",
                Array.from(sharedKeysRef.current.keys()),
              );

              return {
                ...message,
                text: "Something Went Wrong",
              };
            }

            try {
              const text = await decryptMessage(
                encryptedBytes.buffer,
                ivBytes,
                sharedKey,
              );

              console.log("✅ Decrypted message", message._id, "->", text);

              return {
                ...message,
                text: text,
              };
            } catch (decryptErr) {
              console.error(
                "❌ decryptMessage() threw for message:",
                message._id,
                decryptErr,
              );
              return {
                ...message,
                text: "Something Went Wrong",
              };
            }
          }),
        );

        setDecryptedMessages(decrypted);

        console.log("🔓 Final decrypted messages:", decrypted);
      } catch (error) {
        console.error("❌ Message Decryption Error (outer catch):", error);
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

  // const handleSend = async () => {
  //   const text = draft.trim();

  //   if (!text || isSending) return;

  //   if (!sharedKeysRef.current.size) {
  //     console.error("❌ Shared keys are not ready");
  //     return;
  //   }

  //   try {
  //     const encryptedMessages = [];

  //     for (const [deviceId, sharedKey] of sharedKeysRef.current) {
  //       const { encrypted, iv } = await encryptMessage(text, sharedKey);

  //       encryptedMessages.push({
  //         deviceId,
  //         encryptedText: arrayBufferToBase64(encrypted),
  //         iv: uint8ArrayToBase64(iv),
  //       });
  //     }

  //     console.log("🔐 Encrypted for devices:", encryptedMessages);

  //     // Temporary: send the first device's encrypted message
  //     const firstMessage = encryptedMessages[0];

  //     sendDirectMessage(
  //       {
  //         receiver: contact._id,
  //         encryptedText: firstMessage.encryptedText,
  //         iv: firstMessage.iv,
  //         deviceId: firstMessage.deviceId,
  //       },
  //       {
  //         onSuccess: () => {
  //           setDraft("");

  //           queryClient.invalidateQueries({
  //             queryKey: ["directMessages", contact._id],
  //           });
  //         },
  //       },
  //     );
  //   } catch (error) {
  //     console.error("❌ Message Encryption Error:", error);
  //   }
  // };

  const handleSend = async () => {
    const text = draft.trim();

    // ============================================
    // BASIC VALIDATION
    // ============================================

    if (!text || isSending) return;

    if (!sharedKeysRef.current || sharedKeysRef.current.size === 0) {
      console.error("❌ Shared keys are not ready");
      return;
    }

    if (!deviceId) {
      console.error("❌ Current device ID is missing");
      return;
    }

    if (!contact?._id) {
      console.error("❌ Receiver user ID is missing");
      return;
    }

    try {
      // ============================================
      // RECEIVER DEVICE COPIES
      // ============================================

      const deviceMessagesreceiver = [];

      /*
      sharedKeysRef.current:

      key   = receiverDeviceId
      value = sharedKey

      Example:

      B-Mobile  -> sharedKey
      B-Laptop  -> sharedKey
    */

      for (const [
        receiverDeviceId,
        sharedKey,
      ] of sharedKeysRef.current.entries()) {
        if (!sharedKey) {
          console.warn("⚠️ Shared key missing for device:", receiverDeviceId);
          continue;
        }

        if (!receiverDeviceId) {
          console.warn("⚠️ Receiver device ID is missing");
          continue;
        }

        // ==========================================
        // ENCRYPT MESSAGE FOR THIS RECEIVER DEVICE
        // ==========================================

        const { encrypted, iv } = await encryptMessage(text, sharedKey);

        // ==========================================
        // STORE ENCRYPTED COPY
        // ==========================================

        deviceMessagesreceiver.push({
          receiverDeviceId,

          encryptedText: arrayBufferToBase64(encrypted),

          iv: uint8ArrayToBase64(iv),
        });
      }

      // ============================================
      // CHECK ENCRYPTED COPIES
      // ============================================

      console.log("🔐 Receiver encrypted copies:", deviceMessagesreceiver);

      if (deviceMessagesreceiver.length === 0) {
        console.error("❌ No receiver encrypted messages created");
        return;
      }

      // ============================================
      // SEND TO BACKEND
      // ============================================

      sendDirectMessage(
        {
          receiver: contact._id,

          // B's devices
          deviceMessagesreceiver,

          // A's other devices
          // We will add this when sender-device
          // shared keys are implemented.
          deviceMessagessender: [],
        },
        {
          onSuccess: (response) => {
            console.log("✅ Message sent successfully:", response);

            setDraft("");

            queryClient.invalidateQueries({
              queryKey: ["directMessages", contact._id],
            });
          },

          onError: (error) => {
            console.error("❌ Failed to send message:", error);
          },
        },
      );
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
