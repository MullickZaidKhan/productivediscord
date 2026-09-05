
// export async function savePrivateKey(privateKey) {
//   const request = indexedDB.open("SecureChatDB", 1);
//   request.onsuccess = (event) => {
//     const db = event.target.result;
//     const transaction = db.transaction("keys", "readwrite");
//     const store = transaction.objectStore("keys");
//     store.put(privateKey, "privateKey");
//     transaction.oncomplete = () => {
//       console.log("Private Key Saved Successfully");
//     };
//   };
//   request.onupgradeneeded = (event) => {
//     const db = event.target.result;
//     db.createObjectStore("keys");
//   };
// }

// export async function getPrivateKey() {
//   return new Promise((resolve, reject) => {
//     const request = indexedDB.open("SecureChatDB", 1);
//     request.onsuccess = (event) => {
//       const db = event.target.result;
//       const transaction = db.transaction("keys", "readonly");
//       const store = transaction.objectStore("keys");
//       const getRequest = store.get("privateKey");
//       getRequest.onsuccess = () => {
//         resolve(getRequest.result)
       
//       };
//     };
//   });
// }

// src/crypto/storage.js

export async function saveKeyPair(userId, keyPair) {
  const request = indexedDB.open("SecureChatDB", 1);

  request.onupgradeneeded = (event) => {
    const db = event.target.result;

    if (!db.objectStoreNames.contains("keys")) {
      db.createObjectStore("keys");
    }
  };

  return new Promise((resolve, reject) => {
    request.onsuccess = (event) => {
      const db = event.target.result;

      const transaction = db.transaction("keys", "readwrite");
      const store = transaction.objectStore("keys");

      store.put(keyPair, userId);

      transaction.oncomplete = () => {
        console.log(`${userId} Key Pair Saved`);
        resolve();
      };

      transaction.onerror = () => {
        reject(transaction.error);
      };
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

export async function getKeyPair(userId) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("SecureChatDB", 1);

    request.onsuccess = (event) => {
      const db = event.target.result;

      const transaction = db.transaction("keys", "readonly");
      const store = transaction.objectStore("keys");

      const getRequest = store.get(userId);

      getRequest.onsuccess = () => {
        resolve(getRequest.result || null);
      };

      getRequest.onerror = () => {
        reject(getRequest.error);
      };
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}