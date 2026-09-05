import React, { useEffect } from "react";
import { router } from "./app.routes";
import { RouterProvider } from "react-router";
// import {AuthProvider} from "./context/auth.context.jsx"
import { generateKeyPair, exportPublicKey } from "./crypto/cryptoUtils.js";
function App() {
  useEffect(() => {
    async function testEncryptionkey() {
      const testKeys = await generateKeyPair();
      const publicKey = await exportPublicKey(testKeys.publicKey);
      console.log("Public Key:", publicKey);
    }

    testEncryptionkey();
  }, []);
  return (
    // <AuthProvider>
    <RouterProvider router={router} />
    // </AuthProvider>
  );
}

export default App;
