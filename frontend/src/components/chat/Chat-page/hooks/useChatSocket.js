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
    if (!contactId || !currentUserId || !deviceId) {
      return;
    }

    const handleMessageReceive = async ({ message, senderId }) => {
      // ==================================================
      // CHECK CURRENT CHAT
      // ==================================================

      if (String(senderId) !== String(contactId)) {
        return;
      }

      try {
        // ==================================================
        // CHECK MESSAGE DIRECTION
        // ==================================================

        const isSender =
          String(message.sender) === String(currentUserId);

        // ==================================================
        // SELECT DEVICE COPIES
        // ==================================================

        const copies = isSender
          ? message.deviceMessagessender
          : message.deviceMessagesreceiver;

        if (!Array.isArray(copies)) {
          console.error(
            "❌ Device message copies are missing:",
            message._id,
          );
          return;
        }

        // ==================================================
        // FIND COPY FOR CURRENT DEVICE
        // ==================================================

        let copy;

        if (isSender) {
          // Message was sent by current user.
          // Find our own device copy.
          copy = copies.find(
            (item) =>
              String(item.senderDeviceId) ===
              String(deviceId),
          );
        } else {
          // Message was received by current user.
          // Find receiver copy for our device.
          copy = copies.find(
            (item) =>
              String(item.receiverDeviceId) ===
              String(deviceId),
          );
        }

        if (!copy) {
          console.error(
            "❌ No encrypted copy found for current device:",
            {
              messageId: message._id,
              deviceId,
            },
          );

          return;
        }

        // ==================================================
        // FIND SHARED KEY
        // ==================================================

        let sharedKey;

        if (isSender) {
          // Our own device copy.
          //
          // senderSharedKeysRef:
          // key = our device ID

          sharedKey =
            senderSharedKeysRef.current?.get(
              copy.senderDeviceId,
            );
        } else {
          // Receiver copy.
          //
          // sharedKeysRef:
          // key = contact's device ID
          //
          // Therefore we MUST use senderDeviceId.

          sharedKey =
            sharedKeysRef.current?.get(
              copy.senderDeviceId,
            );
        }

        if (!sharedKey) {
          console.error(
            "❌ Shared key not found:",
            {
              messageId: message._id,
              senderDeviceId: copy.senderDeviceId,
              receiverDeviceId: copy.receiverDeviceId,

              availableKeys: isSender
                ? [
                    ...(senderSharedKeysRef.current?.keys() ||
                      []),
                  ]
                : [
                    ...(sharedKeysRef.current?.keys() ||
                      []),
                  ],
            },
          );

          return;
        }

        // ==================================================
        // VALIDATE ENCRYPTED DATA
        // ==================================================

        if (!copy.encryptedText || !copy.iv) {
          console.error(
            "❌ Encrypted text or IV missing:",
            message._id,
          );

          return;
        }

        // ==================================================
        // CONVERT BASE64
        // ==================================================

        const encryptedBytes =
          base64ToUint8Array(
            copy.encryptedText,
          );

        const ivBytes =
          base64ToUint8Array(copy.iv);

        // ==================================================
        // DECRYPT
        // ==================================================

        const text = await decryptMessage(
          encryptedBytes.buffer,
          ivBytes,
          sharedKey,
        );

        // ==================================================
        // CREATE DECRYPTED MESSAGE
        // ==================================================

        const decryptedMessage = {
          ...message,
          text,
        };

        console.log(
          "✅ Socket message decrypted:",
          message._id,
        );

        // ==================================================
        // UPDATE REACT QUERY CACHE
        // ==================================================

        queryClient.setQueryData(
          ["directMessages", contactId],
          (previousData) => {
            // ==================================================
            // CHECK CACHE
            // ==================================================

            if (!previousData) {
              console.warn(
                "⚠️ Chat cache not found:",
                contactId,
              );

              return previousData;
            }

            /*
              Axios response structure:

              previousData = {
                data: {
                  data: [...messages],
                  message: "...",
                  total: 4
                },
                status: 200,
                ...
              }
            */

            const messages =
              previousData?.data?.data;

            // ==================================================
            // CHECK MESSAGE ARRAY
            // ==================================================

            if (!Array.isArray(messages)) {
              console.error(
                "❌ Invalid chat cache structure:",
                previousData,
              );

              return previousData;
            }

            // ==================================================
            // PREVENT DUPLICATE
            // ==================================================

            const alreadyExists =
              messages.some(
                (item) =>
                  String(item._id) ===
                  String(decryptedMessage._id),
              );

            if (alreadyExists) {
              console.log(
                "⚠️ Message already exists:",
                decryptedMessage._id,
              );

              return previousData;
            }

            // ==================================================
            // UPDATE MESSAGE ARRAY
            // ==================================================

            const updatedMessages = [
              ...messages,
              decryptedMessage,
            ];

            // ==================================================
            // CREATE UPDATED CACHE
            // ==================================================

            const updatedCache = {
              ...previousData,

              data: {
                ...previousData.data,

                data: updatedMessages,

                total:
                  typeof previousData.data.total ===
                  "number"
                    ? previousData.data.total + 1
                    : updatedMessages.length,
              },
            };

            console.log(
              "✅ Chat cache updated:",
              {
                messageId: decryptedMessage._id,
                total:
                  updatedCache.data.total,
              },
            );

            return updatedCache;
          },
        );
      } catch (error) {
        console.error(
          "❌ Socket Message Decryption Error:",
          error,
        );
      }
    };

    // ==================================================
    // SOCKET LISTENER
    // ==================================================

    socket.on(
      "message:receive",
      handleMessageReceive,
    );

    // ==================================================
    // CLEANUP
    // ==================================================

    return () => {
      socket.off(
        "message:receive",
        handleMessageReceive,
      );
    };
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