import { useEffect } from "react";
import { router } from "./app.routes";
import { RouterProvider } from "react-router";
import { useSelector } from "react-redux";
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
//  useEffect(() => {
//   async function testE2EE() {
//     const keyPairA = await getOrCreateKeyPair("userA");

//     const publicKeyBuffer = await crypto.subtle.exportKey(
//       "raw",
//       keyPairA.publicKey
//     );

//     const publicKeyBase64 = arrayBufferToBase64(publicKeyBuffer);

//     console.log("User A Public Key:", publicKeyBase64);

//     const response = await fetch(
//        `${import.meta.env.VITE_API_URL}auth/public-key`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         credentials: "include",
//         body: JSON.stringify({
//           publicKey: publicKeyBase64,
//         }),
//       }
//     );

//     const data = await response.json();

//     console.log("Public Key Server Response:", data);
//     const userBId = "6a6f174c0944b6b0532f658e";

// const responseB = await fetch(
//   `${import.meta.env.VITE_API_URL}auth/public-key/${userBId}`,
//   {
//     method: "GET",
//     credentials: "include",
//   }
// );

// const dataB = await responseB.json();

// console.log("User B Public Key:", dataB);
//   }

//   testE2EE();
// }, []);
  return (
    // <AuthProvider>
    <RouterProvider router={router} />
    // </AuthProvider>
  );
}

export default App;
