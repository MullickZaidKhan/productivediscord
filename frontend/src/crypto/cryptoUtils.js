// src/crypto/cryptoUtils.js
import { savePrivateKey ,getPrivateKey } from "./storage";
export async function generateKeyPair() {
  const keyPair = await window.crypto.subtle.generateKey(
    {
      name: "ECDH",
      namedCurve: "P-256",
    },
    true,
    ["deriveKey", "deriveBits"],
  );
  await savePrivateKey(keyPair.privateKey);
  const privateKey=await getPrivateKey();
  console.log("Retrieved Private Key",privateKey)
  return keyPair;
}
export async function exportPublicKey(publicKey) {
  const exportedKey = await window.crypto.subtle.exportKey("raw", publicKey);

  // ArrayBuffer → Base64
  const bytes = new Uint8Array(exportedKey);

  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary);
}

export async function ImportPublicKey(publicKeybase64){
  const binary = atob( publicKeybase64)
const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
}