# Project Context: Wolvo

Wolvo is a secure, real-time messaging application designed with privacy in mind, featuring end-to-end encryption (E2EE) for direct messages and a focus on secure authentication.

## 1. Project Overview
Wolvo facilitates private, direct messaging between users. It uses client-side encryption, where messages are encrypted locally before being sent, ensuring that the server stores only encrypted payloads. It also implements robust authentication, including OTP-based email verification.

## 2. Tech Stack
*   **Frontend:** React 19, Vite, Tailwind CSS, Redux Toolkit, TanStack Query, Socket.IO Client, Framer Motion, Axios.
*   **Backend:** Node.js, Express 5, Socket.IO, Mongoose (MongoDB).
*   **Database:** MongoDB.
*   **Authentication & Security:** JWT (access/refresh tokens), bcrypt (password hashing), `express-rate-limit`, `nodemailer` (email verification), custom CORS and CSRF protection middleware.
*   **Encryption:** Web Crypto API (ECDH for key exchange, AES-GCM for message encryption).
*   **Assets:** ImageKit (for image hosting).

## 3. Folder Structure
*   `frontend/`: React application.
    *   `src/api/`: API service modules.
    *   `src/components/`: UI components categorized by feature (chat, settings, profile, layout).
    *   `src/crypto/`: Encryption utilities and key management (using IndexedDB).
    *   `src/hooks/`: React custom hooks for chat, auth, and crypto logic.
    *   `src/redux/`: Global state management.
*   `server/`: Express backend.
    *   `src/app.js`: Express app setup and middleware.
    *   `src/controller/`: Business logic for authentication, chat, and friends.
    *   `src/model/`: Mongoose schemas.
    *   `src/router/`: API endpoints.
    *   `src/Socket.IO/`: Socket.IO connection handling and event logic.
    *   `src/lib/`: JWT helpers and cookie utilities.

## 4. Architecture
*   **Frontend-Backend:** Communicates via REST APIs (Axios) and WebSockets (Socket.IO).
*   **Database:** MongoDB stores users, sessions, direct messages, and background data.
*   **State:** Redux manages global state; React Context/Hooks manage local/ephemeral state.
*   **Encryption:** Keys are generated client-side using the Web Crypto API. Public keys are exchanged via the server (stored in MongoDB), while private keys are managed locally in the browser's IndexedDB.

## 5. Features
*   **Implemented:** User registration/login, OTP email verification, E2EE direct messaging, friend requests, real-time online status presence, typing indicators, image support in chat (ImageKit).
*   **Incomplete/Planned:** Many components exist in various states of development (e.g., chat message grouping, some settings pages). Several files show commented-out or experimental code.

## 6. Authentication & Security
*   **Login/Reg:** User registration requires device identification (`deviceId`). JWT tokens are stored in HttpOnly cookies (`setAuthCookies` in `server/src/lib/cookies.js`).
*   **OTP Verification:** Implemented in `server/src/controller/Secure/verifyEmail.controller.js`. Includes rate limiting, lockout periods, and OTP expiry tracking within the `User` model.
*   **CSRF Protection:** Basic origin/referer checking middleware in `server/src/app.js`.

## 7. API Routes
*   `/api/v1/auth`: `register`, `login`, `logout`, `public-key` management, `send-verification`, `verify-email`.
*   `/api/v1/friends`: Friend request management.
*   `/api/v1/chat/directMessage`: Message sending and fetching.

## 8. Database Models
*   `User`: Contains `username`, `email`, `password` (hashed), `publicKey`, `isEmailVerified`, and OTP tracking fields.
*   `directMessage`: Stores `sender`, `receiver`, `senderDeviceId`, and multiple encrypted copies in `deviceMessagesreceiver` and `deviceMessagessender` arrays to ensure messages are readable by all user devices.
*   `FriendRequest`: Manages request status (`pending`, `accepted`, `rejected`).
*   `Session`, `UserDevice`: Tracks active login sessions and authorized devices.

## 9. Real-Time Communication
*   **Socket.IO:** Handled in `server/src/Socket.IO/`.
*   **Presence:** Uses `online_offline.js` to manage `Map`-based presence tracking (`userId` -> `Set<socketId>`).
*   **Events:** `message:receive`, `typing:start`, `typing:stop`, `presence:init`.

## 10. End-to-End Encryption
*   **Key Exchange:** ECDH (P-256 curve).
*   **Message Encryption:** AES-GCM (256-bit).
*   **Implementation:** Keys are stored in `IndexedDB`. Messages are encrypted for *every* device of the recipient and every *other* device of the sender (to keep sync). This is reflected in the `deviceMessagesreceiver` and `deviceMessagessender` fields in the `directMessage` model.

## 11. Frontend State Management
*   **Redux Toolkit:** Handles authentication state, chat messages, and settings.
*   **TanStack Query:** Manages API fetching and caching (`directMessages`, `auth`).

## 12. Environment Variables
*   **Server:** `PORT`, `MONGO_URI`, `JWT_SECRET`, `REFRESH_SECRET`, `IMAGEKIT_PRIVATE_KEY`, `EMAIL_USER`, `EMAIL_APP_PASSWORD`.
*   **Frontend:** `VITE_API_URL`, etc.

## 13. Setup & Commands
*   **Setup:** `npm install` in both `frontend/` and `server/`.
*   **Dev:** `npm run dev` in both folders.

## 14. Known Issues & TODOs
*   Many files contain legacy commented-out code (especially in crypto and chat modules).
*   Experimental code exists in `App.jsx` and various hooks, indicating incomplete implementations or abandoned tests.
*   `directMessage` model has commented-out older versions.

## 15. Development Guidelines
*   Future development should prioritize cleaning up legacy commented-out code in `frontend/src/components/chat/Chat-page/` and `server/src/controller/`.
*   Maintain the strict E2EE model: do not change the `deviceMessages` structure in `directMessage` without careful consideration of key exchange flows.
*   Use standard REST patterns for new routes and Socket.IO for real-time events.
