# WOLVO API Documentation

## Overview

This document describes all API endpoints available in the Wolvo application. All endpoints return JSON responses with appropriate HTTP status codes.

---

## Authentication

### Register User

**POST** `/api/v1/auth/register`

Registers a new user account.

**Request Body:**
```json
{
  "username": "johndoe",
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123!",
  "deviceId": "browser-device-id"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User register successfully",
  "payload": {
    "id": "6...",
    "username": "johndoe",
    "name": "John Doe",
    "email": "john@example.com",
    "profileimg": "https://..."
  }
}
```

**Error Responses:**
- `400 Bad Request` - Missing required fields
- `409 Conflict` - Email already registered

---

### Login

**POST** `/api/v1/auth/login`

Authenticates a user and sets auth cookies.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePassword123!",
  "deviceId": "browser-device-id"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User Logged In",
  "payloadtofrontend": {
    "id": "6...",
    "username": "johndoe",
    "name": "John Doe",
    "email": "john@example.com",
    "profileimg": "https://..."
  }
}
```

**Error Responses:**
- `400 Bad Request` - Missing email or password
- `404 Not Found` - Account not found
- `401 Unauthorized` - Wrong credentials

---

### Logout

**POST** `/api/v1/auth/logout`

Logs out the user and clears auth cookies.

**Requirements:** Authorization required (access token in cookie)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Logged Out Successfully."
}
```

---

### Refresh Token

**GET** `/api/v1/auth/refresh`

Refreshes the access token using the refresh token.

**Requirements:** Refresh token in cookie (httpOnly)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Refreshed."
}
```

**Error Responses:**
- `401 Unauthorized` - No token or invalid token

---

### Verify Access Token

**GET** `/api/v1/auth/accesstoken`

Verifies if the current access token is valid.

**Response (200 OK):**
```json
{
  "success": true,
  "payloadtofrontend": {
    "id": "6...",
    "username": "johndoe",
    "name": "John Doe",
    "email": "john@example.com",
    "profileimg": "https://...",
    "isEmailVerified": true
  }
}
```

**Error Responses:**
- `401 Unauthorized` - No valid token

---

### Check Username Availability

**GET** `/api/v1/auth/checkUsername/:username`

Checks if a username is available.

**Parameters:**
- `username` (path) - Username to check (5-18 characters, alphanumeric + ._)

**Response (200 OK):**
```json
{
  "available": true,
  "message": "Username is available"
}
```

**Response (400 OK - available: false):**
```json
{
  "available": false,
  "message": "Only letters, numbers, '.' and '_' are allowed"
}
```

---

### Send Email Verification OTP

**POST** `/api/v1/auth/send-verification`

Sends a 6-digit verification code to the user's email.

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Verification code sent to your email."
}
```

**Rate Limiting:**
- 5 requests per 15 minutes
- 30-second cooldown between sends
- 5 OTP generations triggers 30-minute block
- 5 failed verification attempts triggers 30-minute lockout

**Error Responses:**
- `429 Too Many Requests` - Rate limited (includes `Retry-After` header)

---

### Verify Email with OTP

**POST** `/api/v1/auth/verify-email`

Verifies the user's email using the OTP code.

**Request Body:**
```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Email verified successfully."
}
```

**Error Responses:**
- `400 Bad Request` - Invalid email or OTP format
- `429 Too Many Requests` - Account locked due to failed attempts

---

### Resend Verification OTP

**POST** `/api/v1/auth/resend-verification`

Resends the verification code to the user's email.

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response:** Same as Send Email Verification OTP

---

### Save Public Key (E2EE)

**POST** `/api/v1/auth/public-key`

Saves the user's device public key for E2EE.

**Requirements:** Authorization required

**Request Body:**
```json
{
  "publicKey": "base64-encoded-public-key",
  "deviceId": "browser-device-id",
  "browser": "Chrome",
  "os": "Windows"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Public key saved successfully.",
  "device": {
    "userId": "6...",
    "deviceId": "...",
    "publicKey": "...",
    "browser": "Chrome",
    "os": "Windows",
    "lastActiveAt": "2024-..."
  }
}
```

---

### Get Public Keys

**GET** `/api/v1/auth/public-key/:userId`

Retrieves all public keys for a user's devices.

**Requirements:** Authorization required

**Response (200 OK):**
```json
{
  "success": true,
  "devices": [
    {
      "deviceId": "...",
      "publicKey": "...",
      "browser": "Chrome",
      "os": "Windows",
      "lastActiveAt": "2024-..."
    }
  ]
}
```

---

### Get Login Devices

**GET** `/api/v1/auth/login-devices`

Lists all active sessions/devices for the current user.

**Requirements:** Authorization required

**Response (200 OK):**
```json
{
  "success": true,
  "count": 2,
  "devices": [
    {
      "userId": "6...",
      "deviceId": "...",
      "refreshToken": "[hidden]",
      "verify": true,
      "expiryDate": "2024-...",
      "browser": "Chrome",
      "os": "Windows",
      "ipAddress": "192.168.1.1",
      "userAgent": "...",
      "lastActiveAt": "2024-...",
      "createdAt": "2024-...",
      "updatedAt": "2024-..."
    }
  ]
}
```

---

## Friends

### Send Friend Request

**POST** `/api/v1/friends/request`

Sends a friend request to another user.

**Requirements:** Authorization required

**Request Body:**
```json
{
  "receiverId": "user-id-or-username"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Friend request sent successfully."
}
```

**Error Responses:**
- `400 Bad Request` - Cannot send to self, already friends, or request exists
- `404 Not Found` - User not found

---

### Accept Friend Request

**PATCH** `/api/v1/friends/accept/:requestId`

Accepts a pending friend request.

**Requirements:** Authorization required (must be the receiver)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Friend request accepted."
}
```

---

### Reject Friend Request

**PATCH** `/api/v1/friends/reject/:requestId`

Rejects a pending friend request.

**Requirements:** Authorization required (must be the receiver)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Friend request rejected."
}
```

---

### Get Friend Requests

**GET** `/api/v1/friends/requests`

Gets all incoming friend requests.

**Requirements:** Authorization required

**Response (200 OK):**
```json
{
  "success": true,
  "count": 3,
  "payload": [
    {
      "sender": {
        "_id": "6...",
        "username": "alice",
        "name": "Alice",
        "email": "alice@example.com"
      },
      "receiver": "6...",
      "status": "pending",
      "createdAt": "2024-...",
      "updatedAt": "2024-..."
    }
  ]
}
```

---

### Get Sent Friend Requests

**GET** `/api/v1/friends/sent`

Gets all friend requests sent by the current user.

**Requirements:** Authorization required

**Response (200 OK):**
```json
{
  "success": true,
  "count": 2,
  "payload": [
    {
      "receiver": { /* receiver user */ },
      "sender": "6...",
      "status": "pending",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

---

### Get Friends List

**GET** `/api/v1/friends`

Gets the authenticated user's friends list.

**Requirements:** Authorization required

**Response (200 OK):**
```json
{
  "success": true,
  "payload": [
    {
      "_id": "6...",
      "username": "alice",
      "name": "Alice",
      "email": "alice@example.com",
      "profileimg": "https://..."
    }
  ]
}
```

---

### Remove Friend

**DELETE** `/api/v1/friends/:friendId`

Removes a friend from the user's friend list.

**Requirements:** Authorization required

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Friend removed."
}
```

---

### Get Pending Friend Requests

**GET** `/api/v1/friends/pending`

Gets friend requests with status "pending".

**Requirements:** Authorization required

---

## Direct Messages

### Send Direct Message

**POST** `/api/v1/chat/directMessage/send-directMessage`

Sends an encrypted direct message.

**Requirements:** Authorization required, multipart form data for images

**Request Body:**
```json
{
  "receiver": "user-id",
  "senderDeviceId": "current-device-id",
  "deviceMessagesreceiver": [
    {
      "senderDeviceId": "your-device-id",
      "receiverDeviceId": "their-device-id",
      "encryptedText": "encrypted-base64",
      "iv": "iv-base64"
    }
  ],
  "deviceMessagessender": [
    {
      "senderDeviceId": "your-device-id",
      "encryptedText": "encrypted-base64",
      "iv": "iv-base64"
    }
  ],
  "replyTo": "message-id", // optional
  "image": "..." // optional, as multipart file
}
```

**Response (201 Created):**
```json
{
  "message": "Message sent successfully",
  "data": {
    "_id": "message-id",
    "sender": "your-id",
    "receiver": "their-id",
    "senderDeviceId": "...",
    "deviceMessagesreceiver": [...],
    "deviceMessagessender": [...],
    "image": "",
    "seen": false,
    "deleted": false,
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

---

### Get Direct Messages

**GET** `/api/v1/chat/directMessage/direct-message/:userId`

Gets all messages between the current user and another user.

**Requirements:** Authorization required

**Parameters:**
- `userId` (path) - The user ID to get messages with

**Response (200 OK):**
```json
{
  "message": "Messages fetched successfully",
  "data": [/* sorted by createdAt descending */],
  "total": 10
}
```

---

### Get Talked Users

**GET** `/api/v1/chat/directMessage/direct-messagechatUsers`

Gets users that the current user has talked to.

**Requirements:** Authorization required

**Response (200 OK):**
```json
{
  "message": "Talked users fetched successfully",
  "data": [
    {
      "_id": "user-id",
      "name": "Alice",
      "profileimg": "https://...",
      "username": "alice"
    }
  ],
  "total": 5
}
```

---

## Background

### Get All Backgrounds

**GET** `/api/v1/background/all`

Gets all available background themes.

**Response (200 OK):**
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "_id": "bg-id",
      "name": "Dark Theme",
      "imageUrl": "https://...",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

---

### Get User's Background

**GET** `/api/v1/background/user-background`

Gets the current user's selected background.

**Requirements:** Authorization required

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "bg-id",
    "name": "Dark Theme",
    "imageUrl": "https://..."
  }
}
```

**Error Responses:**
- `404 Not Found` - No background set for user

---

### Set User's Background

**PUT** `/api/v1/background/user-background`

Sets the current user's background.

**Requirements:** Authorization required

**Request Body:**
```json
{
  "backgroundId": "bg-id"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Background updated successfully",
  "data": {
    "_id": "bg-id",
    "name": "Dark Theme",
    "imageUrl": "https://..."
  }
}
```

---

### Set Profile Image

**PUT** `/api/v1/background/set-profileimg`

Updates the user's profile image.

**Requirements:** Authorization required, multipart form data

**Request:**
- `profileimg`: File upload OR pre-selected URL string

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Profile image updated successfully",
  "data": {
    "id": "user-id",
    "name": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "profileimg": "https://..."
  }
}
```

---

## User Settings

### Update User Name

**PUT** `/api/v1/usersetting/update-name`

Updates the user's display name.

**Requirements:** Authorization required

**Request Body:**
```json
{
  "name": "New Name"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Name updated successfully",
  "data": {
    "name": "New Name"
  }
}
```

**Error Responses:**
- `400 Bad Request` - Name is required or exceeds 50 characters
- `404 Not Found` - User not found

---

## Common Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Error description"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Unauthorized user."
}
```

### 403 Forbidden
```json
{
  "success": false,
  "error": "CSRF check failed: Invalid Origin/Referer"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 409 Conflict
```json
{
  "success": false,
  "message": "Resource already exists"
}
```

### 429 Too Many Requests
```json
{
  "success": false,
  "message": "Rate limit message",
  "retryAfterSeconds": 30
}
```
Headers: `Retry-After: 30`

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## Authentication Methods

### Cookie-Based Auth

The application uses HTTP-only cookies for authentication:

| Cookie | Name | Max Age | HttpOnly | Secure | SameSite |
|--------|------|---------|----------|--------|----------|
| Access Token | `accessToken` | 15 minutes | Yes | Yes (prod) | Lax/None |
| Refresh Token | `refreshToken` | 30 days | Yes | Yes (prod) | Lax/None |

### Frontend Token Refresh

The Axios client automatically refreshes tokens on 401 errors:

```javascript
// api/axios.js - Request interceptor
if (error.response?.status === 401 && !originalRequest._retry) {
  originalRequest._retry = true;
  await api.get("auth/refresh");
  return api(originalRequest);
}
```

---

## Rate Limiting

| Endpoint | Limit | Window |
|----------|-------|--------|
| Login | 10 req | 15 min |
| Register | 10 req | 15 min |
| Token Refresh | 30 req | 15 min |
| Access Token | 100 req | 15 min |
| Email OTP Send | 5 req | 15 min |
| Email OTP Verify | 10 req | 15 min |
| General API | 300 req | 15 min |