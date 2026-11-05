# WOLVO PROJECT FLOWCHART & ARCHITECTURE DOCUMENTATION

## A. Complete Application Architecture

```mermaid
graph TD
    subgraph "FRONTEND (React 19 + Vite)"
        FE_App[App.jsx<br/>Root Component]
        FE_Routes[app.routes.jsx<br/>React Router DOM 7]
        FE_Store[Redux Store<br/>authSlice.js]
        FE_Hooks[Custom Hooks<br/>useAuth.js, useChat*.js]
        FE_API[API Clients<br/>axios.js, api/*.js]
        FE_Socket[Socket.IO Client<br/>socket.io-client.js]
        FE_Crypto[Web Crypto API<br/>ECDH, AES-GCM<br/>IndexedDB Storage]
        FE_Components[Components<br/>Chat, Sidebar, Settings, etc.]
    end

    subgraph "BACKEND (Node.js + Express 5)"
        BE_App[app.js<br/>Express App<br/>Middleware]
        BE_Server[server.js<br/>HTTP Server<br/>Socket.IO Server]
        BE_Routes[Router Files<br/>auth.route.js,<br/>Friend.route.js,<br/>directMessage.route.js]
        BE_Controllers[Controllers<br/>auth.controller.js,<br/>Friend.controller.js,<br/>directMessage.controller.js]
        BE_Middleware[Middleware<br/>auth.middleware.js,<br/>rateLimit.js]
        BE_Socket[Socket.IO<br/>index.js<br/>chat/mainsocket.js<br/>online_offline.js]
    end

    subgraph "DATABASE (MongoDB)"
        DB_User[User Model<br/>auth.model.js]
        DB_Session[Session Model<br/>session.model.js]
        DB_FriendRequest[FriendRequest<br/>friendRequest.model.js]
        DB_DirectMessage[DirectMessage<br/>directMessage.model.js]
        DB_Background[Background<br/>background.model.js]
        DB_UserBackground[UserBackground<br/>userBackground.model.js]
        DB_UserDevice[UserDevice<br/>userDevice.model.js]
    end

    subgraph "EXTERNAL SERVICES"
        EXT_Mail[SMTP Gmail<br/>nodemailer]
        EXT_ImageKit[ImageKit<br/>Cloud Storage]
        EXT_MongoDB[MongoDB Atlas<br/>Database]
    end

    %% Connections
    FE_Routes --> FE_App
    FE_App --> FE_Store
    FE_Store --> FE_Hooks
    FE_Hooks --> FE_API
    FE_API --> BE_App
    FE_Socket --> BE_App
    
    BE_App --> BE_Routes
    BE_Routes --> BE_Controllers
    BE_Controllers --> BE_Middleware
    BE_App --> BE_Middleware
    BE_App --> BE_Socket
    
    BE_Controllers --> DB_User
    BE_Controllers --> DB_Session
    BE_Controllers --> DB_FriendRequest
    BE_Controllers --> DB_DirectMessage
    BE_Controllers --> DB_Background
    BE_Controllers --> DB_UserBackground
    BE_Controllers --> DB_UserDevice
    
    BE_Socket --> DB_User
    BE_Socket --> DB_DirectMessage
    BE_Socket --> DB_FriendRequest
    BE_App --> EXT_Mail
    BE_App --> EXT_ImageKit
    BE_App --> EXT_MongoDB
    
    style FE_App fill:#4752c4,stroke:#fff
    style BE_App fill:#4752c4,stroke:#fff
    style DB_User fill:#28a745,stroke:#fff
```

## B. Application Startup Flow

```mermaid
flowchart TD
    A[Server Entry: server.js] --> B[Load Environment Variables]
    B --> C[Import Express App]
    C --> D[Initialize HTTP Server]
    D --> E[Create Socket.IO Server]
    E --> F[Apply Socket.IO Middleware]
    F --> G[Initialize Socket Handlers]
    G --> H[Connect to MongoDB]
    H --> I[Start Listening on PORT]
    
    J[Frontend: main.jsx] --> K[Create Root DOM]
    K --> L[Initialize TanStack QueryClient]
    L --> M[Initialize Redux Store]
    M --> N[Render App Component]
    N --> O[React Router Mounts Routes]
    
    style A fill:#ff6b6b,stroke:#fff
    style J fill:#ff6b6b,stroke:#fff
```

## C. User Registration Flow

```mermaid
sequenceDiagram
    participant Client as Frontend
    participant Server as Backend
    participant DB as MongoDB
    participant Email as SMTP Gmail

    Client->>Server: POST /api/v1/auth/register<br/>{username, email, name, password, deviceId}
    Server->>Server: Validate required fields
    Server->>DB: Find existing user by email
    DB-->>Server: No existing user
    Server->>Server: Hash password with bcrypt (10 rounds)
    Server->>Server: Generate JWT tokens (access/refresh)
    Server->>DB: Create Session<br/>{userId, deviceId, refreshToken:<br/>hashed, expiryDate}
    Server->>Client: Set cookies<br/>accessToken, refreshToken
    Server->>Client: 201 Created<br/>{success, message, payload}
    
    Note over Client,Server: Device ID stored in localStorage<br/>for multi-device E2EE
```

## D. Login & Authentication Flow

```mermaid
sequenceDiagram
    participant Client as Frontend
    participant Server as Backend
    participant DB as MongoDB
    
    Client->>Server: POST /api/v1/auth/login<br/>{email, password, deviceId}
    Server->>DB: Find user by email (+password)
    DB-->>Server: User with hashed password
    Server->>Server: bcrypt.compare(password, hash)
    alt Password Match
        Server->>Server: Generate JWT tokens
        Server->>DB: Find existing session for deviceId
        alt New Device
            Server->>DB: Create new Session
        else Existing Device
            Server->>DB: Update session tokens
        end
        Server->>Client: Set auth cookies
        Server->>Client: 200 OK<br/>{payload}
    else Password Mismatch
        Server->>Client: 401 Unauthorized<br/>{message: "Wrong Credentials"}
    end
```

## E. Password Management Flow

```mermaid
graph TD
    subgraph "EXISTING IMPLEMENTATION"
        A[Password Registration] -->|Hashed with bcrypt| B[Stored in User.password]
        B --> C[select: false in schema]
    end
    
    subgraph "NOT IMPLEMENTED"
        D[Forgot Password] --> E[Request reset link]
        E --> F[Send email with token]
        F --> G[Reset password page]
        G --> H[Update password in DB]
    end
    
    subgraph "EMAIL OTP VERIFICATION (IMPLEMENTED)"
        I[sendVerificationOtp] --> J[Generate 6-digit OTP]
        J --> K[Hash OTP with SHA-256]
        K --> L[Store hash: emailVerificationOtpHash]
        L --> M[Send email via nodemailer]
        M --> N[Set expiry: 1 min]
        
        O[verifyEmailOtp] --> P[Compare hashed OTP]
        P --> Q[Set isEmailVerified: true]
        Q --> R[Clear OTP fields]
        
        S[resendVerificationOtp] --> T[Rate limited to 5 reqs/30min]
    end
    
    D -.->|TODO| A
```

### Password/Forgot Password Status

| Feature | Status | Implementation |
|---------|--------|----------------|
| Password hashing on registration | IMPLEMENTED | bcrypt with 10 rounds |
| Password verification on login | IMPLEMENTED | bcrypt.compare() |
| Password update (current password) | NOT IMPLEMENTED | No endpoint exists |
| Forgot password flow | NOT IMPLEMENTED | No endpoint exists |
| Reset password with token | NOT IMPLEMENTED | No endpoint exists |

## F. Real-Time Messaging Flow

```mermaid
sequenceDiagram
    participant Sender as Sender Device
    participant Server as Backend
    participant Receiver as Receiver Device
    participant DB as MongoDB

    Note over Sender: Message is encrypted<br/>locally with E2EE keys
    
    Sender->>Server: POST /api/v1/chat/directMessage/send-directMessage<br/>{
        receiver, senderDeviceId,<br/>deviceMessagesreceiver,<br/>deviceMessagessender, image
    }
    Server->>DB: Create directMessage document
    DB-->>Server: Saved message
    Server->>Server: Emit via Socket.IO<br/>mainchat(io, receiver, message)
    Server->>Receiver: io.to(socketId).emit(message:receive)
    Receiver->>Receiver: Decryption happens<br/>locally with shared keys
    
    Note over Sender,Receiver: E2EE Key Details:<br/>- ECDH P-256 key pairs per device<br/>- AES-GCM 256-bit encryption<br/>- Keys stored in IndexedDB
```

### Message Model (directMessage.model.js)

```
┌─────────────────────────────────────────────────────────────────────────┐
│ directMessage                                                           │
├─────────────────────────────────────────────────────────────────────────┤
│ sender: ObjectId (ref: User)           ← Required                      │
│ receiver: ObjectId (ref: User)       ← Required                      │
│ senderDeviceId: String                 ← Required                      │
│ deviceMessagesreceiver: [{             ← Encrypted for each receiver   │
│   senderDeviceId: String,             │ device                         │
│   receiverDeviceId: String,           │                               │
│   encryptedText: String,              │                               │
│   iv: String                          │                               │
│ }]>                                   ← Required                      │
│ deviceMessagessender: [{               ← Encrypted for each sender     │
│   senderDeviceId: String,             │ device (self-read)           │
│   encryptedText: String,              │                               │
│   iv: String                          │                               │
│ }]>                                   ← Required                      │
│ image: String                        ← Optional attachment             │
│ seen: Boolean (default: false)                                        │
│ deleted: Boolean (default: false)                                     │
│ replyTo: ObjectId (ref: directMessage)                                  │
│ edited: Boolean (default: false)                                      │
│ editedAt: Date (default: null)                                        │
└─────────────────────────────────────────────────────────────────────────┘
```

## G. Friend System Flow

```mermaid
sequenceDiagram
    participant Client as Frontend
    participant Server as Backend
    participant DB1 as User
    participant DB2 as FriendRequest

    Note over Client: Send Friend Request
    Client->>Server: POST /api/v1/friends/request<br/>{receiverId}
    Server->>DB1: Find sender and receiver users
    Server->>DB2: Check existing requests
    Server->>DB2: Create FriendRequest<br/>{sender, receiver, status: "pending"}
    Server->>Client: 201 Created<br/>{message: "Friend request sent"}
    
    rect rgb(230, 245, 255)
        Note over Server: Accept Friend Request
        Server->>DB2: Update FriendRequest.status = "accepted"
        Server->>DB1: $addToSet sender.friends + receiver
        Server->>DB1: $addToSet receiver.friends + sender
        Server->>Client: 200 OK<br/>{message: "Friend request accepted"}
    end
    
    rect rgb(255, 230, 230)
        Note over Server: Reject Friend Request
        Server->>DB2: Update FriendRequest.status = "rejected"
        Server->>Client: 200 OK<br/>{message: "Friend request rejected"}
    end
    
    rect rgb(230, 255, 230)
        Note over Server: Remove Friend
        Server->>DB1: $pull sender.friends - friendId
        Server->>DB1: $pull receiver.friends - senderId
        Server->>Client: 200 OK<br/>{message: "Friend removed"}
    end
```

## H. User Settings Flow

```mermaid
graph LR
    A[Update Name] -->|PUT /api/v1/usersetting/update-name| B[usersetting.controller.js]
    B --> C[User.findByIdAndUpdate]
    C --> D[DB]
    D --> E[200 OK<br/>{message: "Name updated"}]
```

## I. Logout & Session Management Flow

```mermaid
sequenceDiagram
    participant Client as Frontend
    participant Server as Backend
    participant DB as Session Collection

    Client->>Server: POST /api/v1/auth/logout
    Server->>Server: Get refreshToken from cookies
    alt Token Exists
        Server->>Server: Hash the token
        Server->>DB: Delete session<br/>{userId, refreshToken: hashed}
    end
    Server->>Client: Clear cookies (accessToken, refreshToken)
    Server->>Client: 200 OK<br/>{message: "Logged Out Successfully"}

    Note over Server: Access Token<br/>- 15 min expiry<br/>- httpOnly cookie
    Note over Server: Refresh Token<br/>- 7 day expiry<br/>- Hashed in DB
```

### Token Refresh Flow

```mermaid
sequenceDiagram
    participant Client as Frontend
    participant Server as Backend
    participant DB as Session Collection

    Client->>Server: GET /api/v1/auth/refresh<br/>(with refresh cookie)
    Server->>Server: Get token from cookie
    Server->>Server: Find session with hashed token
    alt Valid Session
        Server->>Server: Verify refresh token JWT
        Server->>DB: Update session<br/>{new refresh token, new expiry}
        Server->>Client: Set new cookies<br/>(access + refresh)
        Server->>Client: 200 OK<br/>{message: "Refreshed"}
    else Invalid/No Session
        Server->>Client: 401 Unauthorized
    end
```

## J. Error Handling Flow

```mermaid
graph TD
    A[API Error] --> B{Error Type}
    B -->|Validation| C[400 Bad Request<br/>{success: false, message}]
    B -->|Not Found| D[404 Not Found<br/>{success: false, message}]
    B -->|Unauthorized| E[401 Unauthorized<br/>{success: false, message}]
    B -->|Forbiddden| F[403 Forbidden<br/>{success: false, message}]
    B -->|Conflict| G[409 Conflict<br/>(Duplicate email/username)]
    B -->|Rate Limit| H[429 Too Many<br/>Retry-After header]
    B -->|Server Error| I[500 Internal Server Error<br/>{success: false, message}]
    
    J[Frontend Error] --> K{Error Source}
    K -->|API Response| L[Show error message<br/>from response.data.message]
    K -->|Network| M[Show generic error<br/>"No response from server"]
    K -->|Axios Interceptor| N[Auto-refresh on 401<br/>then retry request]
```

### Frontend Error Handling (axios.js)

```mermaid
graph LR
    A[Request Error] --> B{Status 401?}
    B -->|Yes| C[Retry-After: 0]
    C --> D[GET /api/v1/auth/refresh]
    D --> E{Refresh Success?}
    E -->|Yes| F[Retry Original Request]
    E -->|No| G[Reject Promise<br/>App redirects to login]
    B -->|No| H[Reject Promise<br/>Handled by component]
    
    style E fill:#ffc,stroke:#333
```