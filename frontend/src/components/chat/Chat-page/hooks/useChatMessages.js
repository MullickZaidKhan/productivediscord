// import { useEffect, useMemo, useState } from "react";
// import { usegetDirectMessages } from "../../../../hooks/chat/directMessage.hook.js";
// import {
//   base64ToUint8Array,
//   decryptMessage,
// } from "../../../../crypto/cryptoUtils.js";
// import { groupMessagesByDay } from "../groupMessagesByDay.js";

// function getMessageCopy(message, currentUserId, deviceId) {
//   const isSender = String(message.sender) === String(currentUserId);
//   const copies = isSender
//     ? message.deviceMessagessender
//     : message.deviceMessagesreceiver;
//   const deviceField = isSender ? "senderDeviceId" : "receiverDeviceId";

//   if (!Array.isArray(copies)) return null;
//   return copies.find(
//     (copy) => String(copy[deviceField]) === String(deviceId),
//   );
// }

// export default function useChatMessages({
//   contactId,
//   currentUserId,
//   deviceId,
//   sharedKeysRef,
//   senderSharedKeysRef,
//   isSharedKeyReady,
// }) {
//   const {
//     data: messagesResponse,
//     isLoading: messagesLoading,
//     isError: messagesError,
//   } = usegetDirectMessages(contactId);
//   const [decryptedMessages, setDecryptedMessages] = useState([]);

//   const messages = useMemo(() => {
//     if (Array.isArray(messagesResponse)) return messagesResponse;
//     if (Array.isArray(messagesResponse?.data)) return messagesResponse.data;
//     if (Array.isArray(messagesResponse?.data?.data)) {
//       return messagesResponse.data.data;
//     }
//     return [];
//   }, [messagesResponse]);

//   useEffect(() => {
//     let cancelled = false;

//     if (!messages.length || !isSharedKeyReady) {
//       Promise.resolve().then(() => {
//         if (!cancelled) setDecryptedMessages([]);
//       });
//       return undefined;
//     }

//     const decryptMessages = async () => {
//       const decrypted = await Promise.all(
//         messages.map(async (message) => {
//             console.log("💬 All Messages:",message );

//           const copy = getMessageCopy(message, currentUserId, deviceId);
//           const keyMap =
//             String(message.sender) === String(currentUserId)
//               ? senderSharedKeysRef.current
//               : sharedKeysRef.current;
//           const sharedKey = keyMap?.get(
//             copy?.senderDeviceId || copy?.receiverDeviceId,
//           );

//           if (!copy?.encryptedText || !copy?.iv) {
//             console.error("❌ No encrypted copy found for this device:", message._id);
//             return { ...message, text: "⚠️ something went wrong" };
//           }

//           if (!sharedKey) {
//             console.error("❌ Shared key not found for message:", message._id);
//             return { ...message, text: "⚠️ something went wrong" };
//           }

//           try {
//             const encryptedBytes = base64ToUint8Array(copy.encryptedText);
//             const ivBytes = base64ToUint8Array(copy.iv);
//             const text = await decryptMessage(
//               encryptedBytes.buffer,
//               ivBytes,
//               sharedKey,
//             );
//             console.log("✅ Message decrypted:", message._id);
//             return { ...message, text };
//           } catch (error) {
//             console.error("❌ Message decryption failed:", message._id, error);
//             return { ...message, text: "⚠️ something went wrong" };
//           }
//         }),
//       );

//       if (!cancelled) setDecryptedMessages(decrypted);
//     };

//     decryptMessages().catch((error) => {
//       console.error("❌ Message Decryption Error:", error);
//     });

//     return () => {
//       cancelled = true;
//     };
//   }, [
//     messages,
//     currentUserId,
//     deviceId,
//     sharedKeysRef,
//     senderSharedKeysRef,
//     isSharedKeyReady,
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

//   return {
//     messages,
//     decryptedMessages,
//     sortedMessages,
//     groupedMessages,
//     messagesLoading,
//     messagesError,
//   };
// }

import { useEffect, useMemo, useState } from "react";
import { usegetDirectMessages } from "../../../../hooks/chat/directMessage.hook.js";
import {
  base64ToUint8Array,
  decryptMessage,
} from "../../../../crypto/cryptoUtils.js";
import { groupMessagesByDay } from "../groupMessagesByDay.js";

function getMessageCopy(message, currentUserId, deviceId) {
  const isSender = String(message.sender) === String(currentUserId);

  const copies = isSender
    ? message.deviceMessagessender
    : message.deviceMessagesreceiver;

  if (!Array.isArray(copies)) return null;

  const deviceField = isSender
    ? "senderDeviceId"
    : "receiverDeviceId";

  return copies.find(
    (copy) => String(copy[deviceField]) === String(deviceId),
  );
}

export default function useChatMessages({
  contactId,
  currentUserId,
  deviceId,
  sharedKeysRef,
  senderSharedKeysRef,
  isSharedKeyReady,
}) {
  const {
    data: messagesResponse,
    isLoading: messagesLoading,
    isError: messagesError,
  } = usegetDirectMessages(contactId);

  const [decryptedMessages, setDecryptedMessages] = useState([]);

  /*
   * Normalize API response.
   */
  const messages = useMemo(() => {
    if (Array.isArray(messagesResponse)) {
      return messagesResponse;
    }

    if (Array.isArray(messagesResponse?.data)) {
      return messagesResponse.data;
    }

    if (Array.isArray(messagesResponse?.data?.data)) {
      return messagesResponse.data.data;
    }

    return [];
  }, [messagesResponse]);

  /*
   * Decrypt messages whenever:
   * - messages change
   * - current device changes
   * - shared keys become ready
   */
  useEffect(() => {
    let cancelled = false;

    if (!messages.length || !isSharedKeyReady) {
      setDecryptedMessages([]);
      return;
    }

    const decryptMessages = async () => {
      const decrypted = await Promise.all(
        messages.map(async (message) => {
          try {
            const isSender =
              String(message.sender) === String(currentUserId);

            /*
             * Find the encrypted copy belonging
             * to the current device.
             */
            const copy = getMessageCopy(
              message,
              currentUserId,
              deviceId,
            );

            if (!copy) {
              console.warn(
                "⚠️ No encrypted copy for current device:",
                {
                  messageId: message._id,
                  deviceId,
                  isSender,
                },
              );

              return {
                ...message,
                text: "⚠️ something went wrong",
              };
            }

            if (!copy.encryptedText || !copy.iv) {
              console.warn(
                "⚠️ Encrypted copy is incomplete:",
                message._id,
              );

              return {
                ...message,
                text: "⚠️ something went wrong",
              };
            }

            /*
             * -----------------------------------------
             * SENDER
             * -----------------------------------------
             *
             * I sent this message.
             *
             * deviceMessagessender contains copies
             * encrypted for my own devices.
             *
             * Example:
             *
             * senderDeviceId:
             * 349e...
             *
             * senderSharedKeysRef:
             * 349e... -> sharedKey
             */
            if (isSender) {
              const senderDeviceId = copy.senderDeviceId;

              const sharedKey =
                senderSharedKeysRef.current.get(
                  senderDeviceId,
                );

              if (!sharedKey) {
                console.warn(
                  "⚠️ Sender shared key not found:",
                  {
                    messageId: message._id,
                    senderDeviceId,
                    availableKeys: [
                      ...senderSharedKeysRef.current.keys(),
                    ],
                  },
                );

                return {
                  ...message,
                  text: "⚠️ something went wrong",
                };
              }

              const encryptedBytes =
                base64ToUint8Array(copy.encryptedText);

              const ivBytes =
                base64ToUint8Array(copy.iv);

              const text = await decryptMessage(
                encryptedBytes.buffer,
                ivBytes,
                sharedKey,
              );

              console.log(
                "✅ Sender message decrypted:",
                message._id,
              );

              return {
                ...message,
                text,
              };
            }

            /*
             * -----------------------------------------
             * RECEIVER
             * -----------------------------------------
             *
             * Someone else sent this message.
             *
             * deviceMessagesreceiver must contain:
             *
             * {
             *   senderDeviceId,
             *   receiverDeviceId,
             *   encryptedText,
             *   iv
             * }
             *
             * We use senderDeviceId to find
             * the correct ECDH shared key.
             */
            const senderDeviceId = copy.senderDeviceId;

            if (!senderDeviceId) {
              console.warn(
                "⚠️ senderDeviceId missing from receiver copy:",
                message._id,
              );

              return {
                ...message,
                text: "⚠️ something went wrong",
              };
            }

            const sharedKey =
              sharedKeysRef.current.get(
                senderDeviceId,
              );

            if (!sharedKey) {
              console.warn(
                "⚠️ Receiver shared key not found:",
                {
                  messageId: message._id,
                  senderDeviceId,
                  receiverDeviceId: copy.receiverDeviceId,
                  availableKeys: [
                    ...sharedKeysRef.current.keys(),
                  ],
                },
              );

              return {
                ...message,
                text: "⚠️ something went wrong",
              };
            }

            const encryptedBytes =
              base64ToUint8Array(copy.encryptedText);

            const ivBytes =
              base64ToUint8Array(copy.iv);

            const text = await decryptMessage(
              encryptedBytes.buffer,
              ivBytes,
              sharedKey,
            );

            console.log(
              "✅ Receiver message decrypted:",
              message._id,
            );

            return {
              ...message,
              text,
            };
          } catch (error) {
            console.error(
              "❌ Message decryption failed:",
              message._id,
              error,
            );

            return {
              ...message,
              text: "⚠️ something went wrong",
            };
          }
        }),
      );

      if (!cancelled) {
        setDecryptedMessages(decrypted);
      }
    };

    decryptMessages().catch((error) => {
      console.error(
        "❌ Message Decryption Error:",
        error,
      );
    });

    return () => {
      cancelled = true;
    };
  }, [
    messages,
    currentUserId,
    deviceId,
    sharedKeysRef,
    senderSharedKeysRef,
    isSharedKeyReady,
  ]);

  /*
   * Sort messages by creation time.
   */
  const sortedMessages = useMemo(() => {
    return [...decryptedMessages].sort(
      (a, b) =>
        new Date(a.createdAt) -
        new Date(b.createdAt),
    );
  }, [decryptedMessages]);

  /*
   * Group messages by day.
   */
  const groupedMessages = useMemo(
    () => groupMessagesByDay(sortedMessages),
    [sortedMessages],
  );

  return {
    messages,
    decryptedMessages,
    sortedMessages,
    groupedMessages,
    messagesLoading,
    messagesError,
  };
}

