import { useQueryClient } from "@tanstack/react-query";
import { useSendDirectMessage } from "../../../../hooks/chat/directMessage.hook.js";
import {
  arrayBufferToBase64,
  encryptMessage,
  uint8ArrayToBase64,
} from "../../../../crypto/cryptoUtils.js";

async function encryptCopies(text, keyMap, deviceField) {
  const copies = [];

  for (const [copyDeviceId, sharedKey] of keyMap.entries()) {
    if (!copyDeviceId || !sharedKey) {
      console.warn("⚠️ Shared key missing for device:", copyDeviceId);
      continue;
    }

    console.log("🔐 Encrypting message for", deviceField, copyDeviceId);
    const { encrypted, iv } = await encryptMessage(text, sharedKey);
    copies.push({
      [deviceField]: copyDeviceId,
      encryptedText: arrayBufferToBase64(encrypted),
      iv: uint8ArrayToBase64(iv),
    });
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
  const { mutateAsync: sendDirectMessage, isPending: isSending } =
    useSendDirectMessage();

  const sendMessage = async (draft) => {
    const text = draft.trim();
    if (!text || isSending) return false;

    if (!sharedKeysRef.current?.size) {
      console.error("❌ Shared keys are not ready");
      return false;
    }
    if (!deviceId) {
      console.error("❌ Current device ID is missing");
      return false;
    }
    if (!contact?._id) {
      console.error("❌ Receiver user ID is missing");
      return false;
    }
    if (!senderSharedKeysRef.current?.size) {
      console.error("❌ Sender shared keys are not ready");
      return false;
    }

    try {
      const deviceMessagesreceiver = await encryptCopies(
        text,
        sharedKeysRef.current,
        "receiverDeviceId",
      );
      const deviceMessagessender = await encryptCopies(
        text,
        senderSharedKeysRef.current,
        "senderDeviceId",
      );

      if (!deviceMessagesreceiver.length || !deviceMessagessender.length) {
        console.error("❌ Encrypted device copies are incomplete");
        return false;
      }

      await sendDirectMessage({
        receiver: contact._id,
        deviceMessagesreceiver,
        deviceMessagessender,
      });

      console.log("✅ Message sent successfully");
      await queryClient.invalidateQueries({
        queryKey: ["directMessages", contact._id],
      });
      return true;
    } catch (error) {
      console.error("❌ Message Encryption Error:", error);
      return false;
    }
  };

  return { sendMessage, isSending };
}
