import { useQueryClient } from "@tanstack/react-query";
import { useSendDirectMessage } from "../../../../hooks/chat/directMessage.hook.js";
import {
  arrayBufferToBase64,
  encryptMessage,
  uint8ArrayToBase64,
} from "../../../../crypto/cryptoUtils.js";

async function encryptCopies(
  text,
  keyMap,
  deviceField,
  senderDeviceId = null,
) {
  const copies = [];

  for (const [copyDeviceId, sharedKey] of keyMap.entries()) {
    if (!copyDeviceId || !sharedKey) {
      console.warn("⚠️ Shared key missing for device:", copyDeviceId);
      continue;
    }

    console.log(
      "🔐 Encrypting message for",
      deviceField,
      copyDeviceId,
    );

    const { encrypted, iv } = await encryptMessage(
      text,
      sharedKey,
    );

    const copy = {
      [deviceField]: copyDeviceId,
      encryptedText: arrayBufferToBase64(encrypted),
      iv: uint8ArrayToBase64(iv),
    };

    // Receiver copy needs to know which sender device
    // created this encrypted copy.
    if (senderDeviceId) {
      copy.senderDeviceId = senderDeviceId;
    }

    copies.push(copy);
  }

  return copies;
}

export default function useSendChatMessage({
  contact,
  deviceId,
  sharedKeysRef,
  senderSharedKeysRef,
}) {
  const queryClient = useQueryClient();

  const {
    mutateAsync: sendDirectMessage,
    isPending: isSending,
  } = useSendDirectMessage();

  const sendMessage = async (draft) => {
    const text = draft.trim();

    if (!text || isSending) return false;

    // ==================================================
    // VALIDATION
    // ==================================================

    if (!deviceId) {
      console.error("❌ Current device ID is missing");
      return false;
    }

    if (!contact?._id) {
      console.error("❌ Receiver user ID is missing");
      return false;
    }

    if (!sharedKeysRef.current?.size) {
      console.error("❌ Receiver shared keys are not ready");
      return false;
    }

    if (!senderSharedKeysRef.current?.size) {
      console.error("❌ Sender shared keys are not ready");
      return false;
    }

    try {
      // ==================================================
      // ENCRYPT FOR RECEIVER DEVICES
      // ==================================================

      const deviceMessagesreceiver = await encryptCopies(
        text,
        sharedKeysRef.current,
        "receiverDeviceId",
        deviceId, // 👈 current sender device
      );

      // ==================================================
      // ENCRYPT FOR MY OTHER DEVICES
      // ==================================================

      const deviceMessagessender = await encryptCopies(
        text,
        senderSharedKeysRef.current,
        "senderDeviceId",
      );

      // ==================================================
      // VALIDATION
      // ==================================================

      if (
        !deviceMessagesreceiver.length ||
        !deviceMessagessender.length
      ) {
        console.error(
          "❌ Encrypted device copies are incomplete",
        );
        return false;
      }

      // ==================================================
      // SEND TO BACKEND
      // ==================================================

      await sendDirectMessage({
        receiver: contact._id,

        // Device that originally sent the message
        senderDeviceId: deviceId,

        // Receiver device copies
        deviceMessagesreceiver,

        // My other device copies
        deviceMessagessender,
      });

      console.log("✅ Message sent successfully");

      // ==================================================
      // REFRESH MESSAGES
      // ==================================================

      await queryClient.invalidateQueries({
        queryKey: ["directMessages", contact._id],
      });

      return true;
    } catch (error) {
      console.error(
        "❌ Message Encryption Error:",
        error,
      );

      return false;
    }
  };

  return {
    sendMessage,
    isSending,
  };
}