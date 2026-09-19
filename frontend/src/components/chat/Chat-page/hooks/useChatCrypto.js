import { useEffect, useRef, useState } from "react";
import { useGetPublicKeys } from "../../../../hooks/useCrypto.js";
import { getDeviceId } from "../../../../lib/device.js";
import { createSharedKey } from "../../../../crypto/cryptoUtils.js";

export default function useChatCrypto({ currentUser, contact }) {
  const deviceId = getDeviceId();
  const sharedKeysRef = useRef(new Map());
  const senderSharedKeysRef = useRef(new Map());
  const [isSharedKeyReady, setIsSharedKeyReady] = useState(false);
  const [isSenderSharedKeyReady, setIsSenderSharedKeyReady] = useState(false);
  const { data: userBPublicKeys } = useGetPublicKeys(contact?._id);
  const { data: myPublicKeys } = useGetPublicKeys(currentUser?.id);

  // Build keys used to encrypt messages for every receiver device.
// console.log("👤 currentUser:", currentUser);
// console.log("🆔 currentUser ID:", currentUser?.id);
// console.log("🔑 myPublicKeys:", myPublicKeys);
// console.log("🔑 userBPublicKeys:", userBPublicKeys);
//   useEffect(() => {
//     if (userBPublicKeys) {
//       console.log("User B Public Key:", userBPublicKeys);
//     }
//   }, [userBPublicKeys]);

//   // Log the current user's public devices when they become available.
//  useEffect(() => {
//     if (myPublicKeys) {
//       console.log("User currentuser Public Key:", myPublicKeys);
//     }
//   }, [myPublicKeys]);

  // Create receiver-device shared keys whenever the active chat changes.
  useEffect(() => {
    let cancelled = false;

    if (!currentUser?.id || !contact?._id || !userBPublicKeys?.devices?.length) {
      sharedKeysRef.current = new Map();
      Promise.resolve().then(() => {
        if (!cancelled) setIsSharedKeyReady(false);
      });
      return undefined;
    }

    const setupSharedKeys = async () => {
      try {
        // console.log("🔐 Shared key effect running");
        const receiverKeys = new Map();

        for (const device of userBPublicKeys.devices) {
        //   console.log("🔐 Creating key for:", device.deviceId);
          const sharedKey = await createSharedKey(deviceId, device.publicKey);
          receiverKeys.set(device.deviceId, sharedKey);
        }

        if (!cancelled) {
          sharedKeysRef.current = receiverKeys;
        //   console.log("✅ Shared keys ready current user's:", receiverKeys.size);
          setIsSharedKeyReady(receiverKeys.size > 0);
        }
      } catch (error) {
        console.error("❌ Failed to create shared keys:", error);
        if (!cancelled) {
          sharedKeysRef.current = new Map();
          setIsSharedKeyReady(false);
        }
      }
    };

    setupSharedKeys();

    return () => {
      cancelled = true;
    };
  }, [currentUser?.id, contact?._id, userBPublicKeys, deviceId]);

  // Create sender-device shared keys so the sender can read their own messages.
  useEffect(() => {
    let cancelled = false;

    if (!currentUser?.id || !myPublicKeys?.devices?.length) {
      senderSharedKeysRef.current = new Map();
      Promise.resolve().then(() => {
        if (!cancelled) setIsSenderSharedKeyReady(false);
      });
      return undefined;
    }

    const setupSenderSharedKeys = async () => {
      try {
        const senderKeys = new Map();

        for (const device of myPublicKeys.devices) {
        //   console.log("🔐 Creating sender-device key for:", device.deviceId);
          const sharedKey = await createSharedKey(deviceId, device.publicKey);
          senderKeys.set(device.deviceId, sharedKey);
        }

        if (!cancelled) {
          senderSharedKeysRef.current = senderKeys;
        //   console.log("✅ Sender shared keys ready sender-device :", senderKeys.size);
          setIsSenderSharedKeyReady(senderKeys.size > 0);
        }
      } catch (error) {
        console.error("❌ Failed to create sender shared keys:", error);
        if (!cancelled) {
          senderSharedKeysRef.current = new Map();
          setIsSenderSharedKeyReady(false);
        }
      }
    };

    setupSenderSharedKeys();

    return () => {
      cancelled = true;
    };
  }, [currentUser?.id, myPublicKeys, deviceId]);

  return {
    deviceId,
    sharedKeysRef,
    senderSharedKeysRef,
    // Decryption/sending starts only after both key sets are ready.
    isSharedKeyReady: isSharedKeyReady && isSenderSharedKeyReady,
  };
}
