<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:5865F2,100:23272A&height=220&section=header&text=Discord%20Clone&fontSize=60&fontColor=ffffff&animation=fadeIn&fontAlignY=35&desc=Real-Time%20%E2%80%A2%20Encrypted%20%E2%80%A2%20MERN-Powered&descAlignY=55&descSize=18" width="100%"/>

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=26&duration=2500&pause=800&color=99AAB5&center=true&vCenter=true&width=650&lines=%2400+Server+Never+Sees+Plaintext;%2400+End-to-End+Encrypted+with+ECDH+%2B+AES-GCM;%2400+Powered+by+Socket.IO+%E2%9A%A1;%2400+Built+with+the+MERN+Stack" alt="Typing SVG" />

<br/><br/>

![Status](https://img.shields.io/badge/🟢_Status-Online-43B581?style=for-the-badge&labelColor=23272A)
![License](https://img.shields.io/badge/License-MIT-5865F2?style=for-the-badge&labelColor=23272A)
![Stars](https://img.shields.io/github/stars/Zaid/discord-clone?style=for-the-badge&color=5865F2&labelColor=23272A)
![Last Commit](https://img.shields.io/github/last-commit/Zaid/discord-clone?style=for-the-badge&color=5865F2&labelColor=23272A)

<br/>

<img src="https://skillicons.dev/icons?i=react,vite,nodejs,express,mongodb,socketio,redux,tailwind,js&theme=dark" />

<br/><br/>

**A real-time, Discord-inspired chat application** — built with the MERN stack, Socket.IO, and client-side end-to-end encryption.

[✨ Features](#-features) • [🛠️ Tech Stack](#️-tech-stack) • [🔐 Encryption](#-end-to-end-encryption) • [🏗️ Architecture](#️-architecture) • [🚀 Getting Started](#-getting-started)

</div>

<img src="https://capsule-render.vercel.app/api?type=rect&color=0:23272A,100:23272A&height=2&section=header" width="100%"/>

## 📖 Overview

> 🟦 **This isn't just another Discord clone tutorial.**
> Most stop at Socket.IO events. This one goes further — messages are encrypted **client-side** with ECDH + AES-GCM before they ever leave the browser, so the server (and anyone who compromises it) never sees plaintext.

<br/>

<div align="center">
<img src="https://capsule-render.vercel.app/api?type=rect&color=0:5865F2,100:23272A&height=100&section=header&text=Tech%20Stack&fontSize=32&fontColor=ffffff&animation=twinkling&fontAlignY=55" width="100%"/>
</div>

## 🛠️ Tech Stack

<table width="100%">
<tr>
<th width="50%">🎨 Frontend</th>
<th width="50%">⚙️ Backend</th>
</tr>
<tr valign="top">
<td>

**React + Vite**
Fast, component-based UI with instant HMR during development.

**Tailwind CSS**
Utility-first styling used to build the Discord-style responsive interface.

**Redux Toolkit**
Manages global state — authentication, active conversation, online users.

**TanStack Query**
Handles API requests, caching, background refetching, and invalidation.

**Framer Motion**
Powers the UI's micro-interactions — hover states, message pop-ins, sidebar transitions.

</td>
<td>

**Node.js + Express**
REST API and core server-side application logic.

**MongoDB + Mongoose**
Stores users, messages, sessions, backgrounds, and app data.

**Socket.IO**
Real-time messaging and online/offline presence tracking.

**JWT + HTTP-Only Cookies**
Authentication and secure, XSS-resistant session handling.

**ImageKit**
Image hosting and on-the-fly optimization for uploads.

</td>
</tr>
</table>

<br/>

<div align="center">
<img src="https://capsule-render.vercel.app/api?type=rect&color=0:23272A,100:5865F2&height=100&section=header&text=End-to-End%20Encryption&fontSize=28&fontColor=ffffff&animation=twinkling&fontAlignY=55" width="100%"/>
</div>

## 🔐 End-to-End Encryption

<table width="100%">
<tr>
<td width="33%" align="center">

### 🔑 ECDH
Each client generates a public/private key pair locally — private keys **never** leave the device.

</td>
<td width="33%" align="center">

### 🔒 AES-GCM
Messages are symmetrically encrypted *before* leaving the browser, using an authenticated cipher.

</td>
<td width="33%" align="center">

### 🌐 Web Crypto API
All key generation and encryption uses the browser's native, audited cryptographic APIs.

</td>
</tr>
</table>

### 🔄 How a message travels

```mermaid
sequenceDiagram
    autonumber
    participant A as 👤 User A
    participant S as 🖥️ Server / Socket.IO
    participant B as 👤 User B

    Note over A: Private Key + User B Public Key
    A->>A: Derive ECDH Shared Secret
    A->>A: AES-GCM Encrypt message
    A->>S: Emit encrypted payload
    rect rgb(35, 39, 42)
    Note over S: 🚫 Server never sees plaintext
    end
    S->>B: Forward encrypted payload
    Note over B: Private Key + User A Public Key
    B->>B: Derive same ECDH Shared Secret
    B->>B: AES-GCM Decrypt message
    Note over B: ✅ Original message revealed
```

**In plain terms:** the server is just a courier. It relays encrypted bytes it cannot read, because the AES key is derived independently on each side from a Diffie-Hellman exchange — it's never transmitted anywhere.

<br/>

<div align="center">
<img src="https://capsule-render.vercel.app/api?type=rect&color=0:5865F2,100:23272A&height=100&section=header&text=Real-Time%20Communication&fontSize=28&fontColor=ffffff&animation=twinkling&fontAlignY=55" width="100%"/>
</div>

## ⚡ Real-Time Communication

<table width="100%">
<tr>
<td width="33%" align="center">

**🟢 Online Presence**
Tracks connected users and broadcasts live status to their contacts, Discord-style.

</td>
<td width="33%" align="center">

**💬 Instant Messaging**
Messages are pushed over Socket.IO the moment they're sent — no polling.

</td>
<td width="33%" align="center">

**🔄 Multi-Connection Handling**
A single user can stay online across multiple tabs/devices simultaneously.

</td>
</tr>
</table>

### 💬 What it looks like

<div align="center">

| | |
|---|---|
| **Zaid** &nbsp; <sub>Today at 10:41 AM</sub> | 🟢 |
| hey, check out the new encryption flow 👀 | |
| **Maya** &nbsp; <sub>Today at 10:42 AM</sub> | 🟢 |
| whoa this is actually E2EE?? that's sick 🔥 | |
| **Zaid** &nbsp; <sub>Today at 10:42 AM</sub> &nbsp; <sub>✓ seen</sub> | 🟢 |
| yep — ECDH + AES-GCM, server never sees it | |

</div>

<br/>

<div align="center">
<img src="https://capsule-render.vercel.app/api?type=rect&color=0:23272A,100:5865F2&height=100&section=header&text=Features&fontSize=32&fontColor=ffffff&animation=twinkling&fontAlignY=55" width="100%"/>
</div>

## ✨ Features

| Feature | Description |
|---|---|
| 👤 **Authentication** | Secure login and logout with HTTP-only cookies |
| 💬 **Direct Messages** | One-to-one real-time conversations |
| 🟢 **Online Status** | Shows which friends are currently online |
| 🔐 **E2EE** | Client-side message encryption via ECDH + AES-GCM |
| ↩️ **Reply** | Reply to a specific message in context |
| ✏️ **Edit** | Edit previously sent messages |
| 🗑️ **Delete** | Delete messages you've sent |
| 👁️ **Seen Status** | Read-receipt tracking |
| 🖼️ **Image Upload** | Profile image support via ImageKit |
| 🎨 **Custom Backgrounds** | Personalize chat and profile backgrounds |
| ⚡ **Real-Time Updates** | Powered end-to-end by Socket.IO |
| 📱 **Responsive UI** | Discord-style layout that adapts to any screen |

<br/>

<div align="center">
<img src="https://capsule-render.vercel.app/api?type=rect&color=0:5865F2,100:23272A&height=100&section=header&text=Architecture&fontSize=32&fontColor=ffffff&animation=twinkling&fontAlignY=55" width="100%"/>
</div>

## 🏗️ Architecture

```mermaid
flowchart TD
    A["🎨 React / Vite Frontend<br/>🔐 E2EE happens here — Web Crypto API"] -->|REST API| B["🚂 Express Backend"]
    A -->|Socket.IO| C["⚡ Real-Time Communication Layer"]
    B --> D[("🍃 MongoDB<br/>stores ciphertext only")]
    C -.->|presence + message relay| B

    style A fill:#5865F2,stroke:#23272A,color:#fff
    style B fill:#23272A,stroke:#5865F2,color:#fff
    style C fill:#23272A,stroke:#5865F2,color:#fff
    style D fill:#43B581,stroke:#23272A,color:#fff
```

<details>
<summary><b>🔍 Click to see how a request flows end-to-end</b></summary>
<br/>

1. **User types a message** → React captures it in local state.
2. **Client encrypts it** with the shared AES-GCM key derived via ECDH.
3. **Socket.IO emits** the encrypted payload to the server.
4. **Express/Socket.IO server** authenticates the socket via JWT, then relays the payload — it never decrypts it.
5. **MongoDB persists** only the encrypted ciphertext, so a database leak reveals nothing readable.
6. **Recipient's client** receives the payload over their own socket connection and decrypts it locally.

</details>

<br/>

<div align="center">
<img src="https://capsule-render.vercel.app/api?type=rect&color=0:23272A,100:5865F2&height=100&section=header&text=Screenshots&fontSize=32&fontColor=ffffff&animation=twinkling&fontAlignY=55" width="100%"/>
</div>

## 📸 Screenshots

<div align="center">
<img src="https://via.placeholder.com/800x450/2B2D31/5865F2?text=Add+Your+App+Screenshot+or+GIF+Here" alt="App screenshot placeholder" width="80%"/>

<sub>Swap this for a real screenshot or, better, a short screen-recording GIF — a live demo sells "real-time" far better than a still image.</sub>
</div>

<br/>

<div align="center">
<img src="https://capsule-render.vercel.app/api?type=rect&color=0:5865F2,100:23272A&height=100&section=header&text=Getting%20Started&fontSize=32&fontColor=ffffff&animation=twinkling&fontAlignY=55" width="100%"/>
</div>

## 🚀 Getting Started

<details open>
<summary><b>1️⃣ Clone the repository</b></summary>

```bash
git clone <your-repository-url>
cd discord-clone
```
</details>

<details open>
<summary><b>2️⃣ Install dependencies</b></summary>

```bash
npm install
```
</details>

<details open>
<summary><b>3️⃣ Configure environment variables</b></summary>

Create a `.env` file in the root directory:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
```
</details>

<details open>
<summary><b>4️⃣ Start the application</b></summary>

```bash
npm run dev
```
</details>

<br/>

<div align="center">
<img src="https://capsule-render.vercel.app/api?type=rect&color=0:23272A,100:5865F2&height=100&section=header&text=What%20I%20Learned&fontSize=28&fontColor=ffffff&animation=twinkling&fontAlignY=55" width="100%"/>
</div>

## 🧠 What I Learned

Building this project involved working through:

- Full-stack MERN application architecture
- REST API design and development
- Real-time communication with Socket.IO
- Authentication with JWT and HTTP-only cookies
- Global state management with Redux Toolkit
- Server-state caching with TanStack Query
- MongoDB data modelling for chat applications
- Client-side cryptography fundamentals — ECDH key exchange, AES-GCM encryption
- Responsive, Discord-style UI development
- Real-time online presence systems

<br/>

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:23272A,100:5865F2&height=200&section=footer"/>

### 👨‍💻 Developer

**Zaid**
Built as a learning project to understand how a modern real-time communication platform works from frontend to backend.

[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](#)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](#)

<br/>

### ⭐ If you like this project, consider giving it a star!

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=15&duration=3000&pause=1000&color=99AAB5&center=true&vCenter=true&width=500&lines=Thanks+for+checking+out+the+project!+%F0%9F%92%9C" alt="Footer Typing SVG" />

</div>