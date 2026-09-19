import { useEffect, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { createSocket } from "../../../../socket.io-client/socket.io-client.js";
import {
  base64ToUint8Array,
  decryptMessage,
} from "../../../../crypto/cryptoUtils.js";

export default function useChatSocket({
  contactId,
  currentUserId,
  deviceId,
  sharedKeysRef,
  senderSharedKeysRef,
}) {
  const queryClient = useQueryClient();
  const socket = useMemo(() => createSocket(), []);

  useEffect(() => {
    const handleMessageReceive = async ({ message, senderId }) => {
      if (String(senderId) !== String(contactId)) return;

      try {
        let decryptedMessage = message;
        const isSender = String(message.sender) === String(currentUserId);
        const copies = isSender
          ? message.deviceMessagessender
          : message.deviceMessagesreceiver;
        const deviceField = isSender ? "senderDeviceId" : "receiverDeviceId";
        const copy = Array.isArray(copies)
          ? copies.find((item) => String(item[deviceField]) === String(deviceId))
          : null;
        const keyMap = isSender ? senderSharedKeysRef.current : sharedKeysRef.current;
        const sharedKey = keyMap?.get(copy?.[deviceField]);

        if (!copy?.encryptedText || !copy?.iv || !sharedKey) {
          console.error("❌ No encrypted copy found for this device");
          return;
        }

        const encryptedBytes = base64ToUint8Array(copy.encryptedText);
        const ivBytes = base64ToUint8Array(copy.iv);
        const text = await decryptMessage(
          encryptedBytes.buffer,
          ivBytes,
          sharedKey,
        );
        decryptedMessage = { ...message, text };
        console.log("✅ Socket message decrypted");

        queryClient.setQueryData(
          ["directMessages", contactId],
          (previousData) => {
            if (!Array.isArray(previousData?.data?.data)) return previousData;
            return {
              ...previousData,
              data: {
                ...previousData.data,
                data: [...previousData.data.data, decryptedMessage],
              },
            };
          },
        );
      } catch (error) {
        console.error("❌ Socket Message Decryption Error:", error);
      }
    };

    socket.on("message:receive", handleMessageReceive);
    return () => socket.off("message:receive", handleMessageReceive);
  }, [
    socket,
    queryClient,
    contactId,
    currentUserId,
    deviceId,
    sharedKeysRef,
    senderSharedKeysRef,
  ]);

  return socket;
}
