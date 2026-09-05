
export async function savePrivateKey(privateKey) {
  const request = indexedDB.open("SecureChatDB", 1);
  request.onsuccess = (event) => {
    const db = event.target.result;
    const transaction = db.transaction("keys", "readwrite");
    const store = transaction.objectStore("keys");
    store.put(privateKey, "privateKey");
    transaction.oncomplete = () => {
      console.log("Private Key Saved Successfully");
    };
  };
  request.onupgradeneeded = (event) => {
    const db = event.target.result;
    db.createObjectStore("keys");
  };
}

export async function getPrivateKey() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("SecureChatDB", 1);
    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction("keys", "readonly");
      const store = transaction.objectStore("keys");
      const getRequest = store.get("privateKey");
      getRequest.onsuccess = () => {
        resolve(getRequest.result)
        console.log(getRequest.result);
      };
    };
  });
}
