// src/crypto/cryptoUtils.js
import { saveKeyPair, getKeyPair } from "./storage";

// export async function generateKeyPair() {
//   const keyPair = await window.crypto.subtle.generateKey(
//     {
//       name: "ECDH",
//       namedCurve: "P-256",
//     },
//     true,
//     ["deriveKey", "deriveBits"],
//   );
//   await savePrivateKey(keyPair.privateKey);
//   const privateKey = await getPrivateKey();
//   console.log("Retrieved Private Key", privateKey);
//   return keyPair;
// }

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

export async function ImportPublicKey(publicKeybase64) {
  const binary = atob(publicKeybase64);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  const publicKey = await window.crypto.subtle.importKey(
    "raw",
    bytes,
    {
      name: "ECDH",
      namedCurve: "P-256",
    },
    true,
    [],
  );
  return publicKey;
}

export async function deriveSharedKey(privateKey, otherPublicKey) {
  const sharedKey = await window.crypto.subtle.deriveKey(
    {
      name: "ECDH",
      public: otherPublicKey,
    },
    privateKey,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
  return sharedKey;
}

export async function encryptMessage(message, sharedKey) {
  const encoder = new TextEncoder();

  const iv = window.crypto.getRandomValues(
    new Uint8Array(12)
  );

  const encrypted = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    sharedKey,
    encoder.encode(message)
  );

  return {
    encrypted,
    iv,
  };
}

export async function decryptMessage(encrypted, iv, sharedKey) {
  const decrypted = await window.crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    sharedKey,
    encrypted
  );

  const decoder = new TextDecoder();

  return decoder.decode(decrypted);
}

export async function getOrCreateKeyPair(userId) {
  const existingKeyPair = await getKeyPair(userId);

  if (existingKeyPair) {
    console.log(`${userId} Existing Key Pair Retrieved`);
    return existingKeyPair;
  }

  const keyPair = await window.crypto.subtle.generateKey(
    {
      name: "ECDH",
      namedCurve: "P-256",
    },
    true,
    ["deriveKey", "deriveBits"],
  );

  await saveKeyPair(userId, keyPair);

  console.log(`${userId} New Key Pair Generated and Saved`);

  return keyPair;
}

export function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = "";

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary);
}

export function uint8ArrayToBase64(array) {
  return arrayBufferToBase64(array.buffer);
}


export function base64ToUint8Array(base64) {
  const binary = atob(base64);

  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}