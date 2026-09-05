import { useEffect } from "react";
import { router } from "./app.routes";
import { RouterProvider } from "react-router";
// import {AuthProvider} from "./context/auth.context.jsx"
import {
  getOrCreateKeyPair,
  deriveSharedKey,
  encryptMessage,
  decryptMessage,
  arrayBufferToBase64,
  uint8ArrayToBase64,
  base64ToUint8Array,
} from "./crypto/cryptoUtils.js";
function App() {
  useEffect(() => {
    async function testE2EE() {
      const keyPairA = await getOrCreateKeyPair("userA");
      const keyPairB = await getOrCreateKeyPair("userB");

      console.log("STEP 1: Keys loaded");

      const sharedKeyA = await deriveSharedKey(
        keyPairA.privateKey,
        keyPairB.publicKey,
      );

      console.log("STEP 2: Shared Key A created", sharedKeyA);

      const sharedKeyB = await deriveSharedKey(
        keyPairB.privateKey,
        keyPairA.publicKey,
      );

      console.log("STEP 3: Shared Key B created", sharedKeyB);
      const keyA = await crypto.subtle.exportKey("raw", sharedKeyA);
      const keyB = await crypto.subtle.exportKey("raw", sharedKeyB);

      const bytesA = new Uint8Array(keyA);
      const bytesB = new Uint8Array(keyB);

      console.log(
        "Same Shared Key:",
        bytesA.every((byte, index) => byte === bytesB[index]),
      );
      const { encrypted, iv } = await encryptMessage("Hello", sharedKeyA);

      const encryptedBase64 = arrayBufferToBase64(encrypted);
      const ivBase64 = uint8ArrayToBase64(iv);

      console.log("Encrypted Base64:", encryptedBase64);
      console.log("IV Base64:", ivBase64);
      const encryptedBytes = base64ToUint8Array(encryptedBase64);
      const ivBytes = base64ToUint8Array(ivBase64);

      console.log("Encrypted Bytes:", encryptedBytes);
      console.log("IV Bytes:", ivBytes);
      const decryptedMessage = await decryptMessage(
        encryptedBytes,
        ivBytes,
        sharedKeyB,
      );

      console.log("Decrypted after Base64:", decryptedMessage);
    }

    testE2EE();
  }, []);
  return (
    // <AuthProvider>
    <RouterProvider router={router} />
    // </AuthProvider>
  );
}

export default App;
