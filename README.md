"# productiveDassboard-" 
💬 Discord Clone

A real-time Discord-inspired chat application built with the MERN stack, Socket.IO, and modern web technologies.

---

🛠️ Tech Stack

<table>
<tr>
<td width="50%">🎨 Frontend

React + Vite
Fast and component-based UI development.

Tailwind CSS
Used to build the Discord-style responsive interface.

Redux Toolkit
Manages global application state such as authentication, selected chats, and online users.

TanStack Query
Handles API requests, caching, invalidation, and server state.

</td><td width="50%">⚙️ Backend

Node.js + Express
REST API and server-side application logic.

MongoDB + Mongoose
Stores users, messages, sessions, backgrounds, and other application data.

Socket.IO
Provides real-time messaging and online/offline presence.

JWT + HTTP-Only Cookies
Used for authentication and secure session handling.

</td>
</tr>
</table>---

🔐 End-to-End Encryption

<table>
<tr>
<td width="33%" align="center">🔑 ECDH

Public/private key pairs are generated on the client.

</td><td width="33%" align="center">🔒 AES-GCM

Messages are encrypted before being sent to the server.

</td><td width="33%" align="center">🌐 Web Crypto API

Browser-native cryptographic APIs are used for key generation and encryption.

</td>
</tr>
</table>🔐 Encryption Flow

User A
  │
  │ Private Key + User B Public Key
  ▼
ECDH Shared Secret
  │
  ▼
AES-GCM Encryption
  │
  ▼
Encrypted Message
  │
  ▼
Server / Socket.IO
  │
  ▼
User B
  │
  │ User B Private Key + User A Public Key
  ▼
Same Shared Secret
  │
  ▼
AES-GCM Decryption
  │
  ▼
Original Message

---

⚡ Real-Time Communication

<table>
<tr>
<td>🟢 Online Presence

Tracks connected users and displays their online status.

</td>
<td>💬 Real-Time Messages

Messages can be delivered instantly through Socket.IO.

</td>
<td>🔄 Multi-Connection Handling

Supports multiple socket connections for users and devices.

</td>
</tr>
</table>---

✨ Features

Feature| Description
👤 Authentication| Secure login and logout
💬 Direct Messages| One-to-one real-time conversations
🟢 Online Status| Shows currently online friends
🔐 E2EE| Client-side message encryption
↩️ Reply| Reply to specific messages
✏️ Edit| Edit sent messages
🗑️ Delete| Delete messages
👁️ Seen Status| Message read tracking
🖼️ Image Upload| Profile image support
🎨 Backgrounds| Custom chat/profile backgrounds
⚡ Real-Time Updates| Socket.IO powered communication
📱 Responsive UI| Discord-style responsive interface

---

📦 Technologies Used

<table>
<tr>
<td align="center">⚛️<br><b>React</b></td>
<td align="center">⚡<br><b>Vite</b></td>
<td align="center">🟢<br><b>Node.js</b></td>
<td align="center">🚂<br><b>Express</b></td>
</tr><tr>
<td align="center">🍃<br><b>MongoDB</b></td>
<td align="center">🔌<br><b>Socket.IO</b></td>
<td align="center">🔄<br><b>Redux Toolkit</b></td>
<td align="center">📡<br><b>TanStack Query</b></td>
</tr><tr>
<td align="center">🎨<br><b>Tailwind CSS</b></td>
<td align="center">✨<br><b>Framer Motion</b></td>
<td align="center">🖼️<br><b>ImageKit</b></td>
<td align="center">🔐<br><b>Web Crypto API</b></td>
</tr>
</table>---

🏗️ Architecture

                    ┌─────────────────┐
                    │   React / Vite  │
                    │    Frontend     │
                    └────────┬────────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
        REST API                       Socket.IO
              │                             │
              ▼                             ▼
       ┌─────────────┐              ┌─────────────┐
       │   Express   │              │  Real-Time  │
       │   Backend   │              │ Communication│
       └──────┬──────┘              └─────────────┘
              │
              ▼
       ┌─────────────┐
       │   MongoDB   │
       │   Database  │
       └─────────────┘

              🔐
       Client-side E2EE
       Web Crypto API

---

📸 Screenshots

«Add your application screenshots here.»

┌──────────────────────────────────────────────┐
│                                              │
│             YOUR APP SCREENSHOT              │
│                                              │
│                                              │
└──────────────────────────────────────────────┘

---

🚀 Getting Started

1. Clone the repository

git clone <your-repository-url>
cd discord-clone

2. Install dependencies

npm install

3. Configure environment variables

Create a ".env" file and add your required MongoDB, JWT, ImageKit and other configuration values.

4. Start the application

npm run dev

---

🧠 What I Learned

This project helped me work with:

- Full-stack MERN application architecture
- REST API development
- Real-time communication with Socket.IO
- Authentication and HTTP-only cookies
- Redux state management
- Server-state caching with TanStack Query
- MongoDB data modelling
- Client-side cryptography
- ECDH key exchange
- AES-GCM encryption
- Responsive UI development
- Real-time online presence

---

👨‍💻 Developer

Zaid

Built as a learning project to understand how a modern real-time communication platform works from frontend to backend.

---

⭐ If you like the project, consider giving it a star!
