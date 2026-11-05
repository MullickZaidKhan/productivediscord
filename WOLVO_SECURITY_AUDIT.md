# WOLVO Security Audit Report

## Executive Summary

This security audit analyzes the Wolvo (Discord-like) application's security implementation. The application has a solid foundation but has some critical and medium-severity issues that need attention.

---

## Security Analysis

### 1. Password Hashing

**Status:** IMPLEMENTED ✓

**Location:** `server/src/controller/auth.controller.js:register()` (line 55)

```javascript
const hashPass = await bcrypt.hash(password, 10);
```

**Analysis:**
- Uses bcrypt with 10 rounds (good)
- Password is excluded from queries via `select: false` in schema (auth.model.js:37)

**Risk:** Low
- Consider increasing rounds to 12 for production workloads
- No password complexity requirements on backend (handled by frontend only)

---

### 2. JWT Token Security

**Status:** IMPLEMENTED ✓

**Location:** `server/src/lib/jwt.js`

**Access Token:**
- 15 minute expiry (appropriately short)
- Signed with `JWT_SECRET`

**Refresh Token:**
- 7 day expiry
- Stored hashed in database (good)
- Sanitized payload to remove sensitive fields

**Risk:** Medium
- No token revocation list - tokens valid until expiry even after logout from other devices
- No JWT ID (jti) for unique token identification

---

### 3. Cookie Security

**Status:** IMPLEMENTED ✓

**Location:** `server/src/lib/cookies.js`

```javascript
const authCookieOptions = {
  httpOnly: true,      // ✓ XSS protection
  secure: isProd,      // ✓ HTTPS only in production
  sameSite: isProd ? "none" : "lax", // ✓ CSRF protection
  path: "/",
};
```

**Risk:** Low
- In development, `sameSite: "lax"` is used which allows some cross-site requests
- Consider strict mode if possible

---

### 4. CSRF Protection

**Status:** PARTIALLY IMPLEMENTED ⚠

**Location:** `server/src/app.js:32-42`

```javascript
const verifyCsrfOrigin = (req, res, next) => {
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    const origin = req.get('origin') || req.get('referer');
    const allowedOrigin = process.env.FRONTEND_ORIGIN;
    if (!origin || !origin.startsWith(allowedOrigin)) {
      return res.status(403).json({ error: "CSRF check failed" });
    }
  }
  next();
}
```

**Issue:** The `verifyCsrfOrigin` middleware is defined but **NOT USED** in the app. The `app.use()` call is commented out.

**Lines in app.js:** 23-42

**Risk:** Critical - No CSRF protection on state-changing requests

**Recommendation:** Uncomment and apply the middleware:
```javascript
app.use(verifyCsrfOrigin);
// Or apply only to specific routes:
app.use('/api/v1/auth', verifyCsrfOrigin);
```

---

### 5. CORS Configuration

**Status:** IMPLEMENTED ✓

**Location:** `server/src/app.js:24-29`

```javascript
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"]
}));
```

**Risk:** Medium
- Origins are hardcoded in code, should be configurable
- No wildcard `origin: true` which is good

---

### 6. Rate Limiting

**Status:** IMPLEMENTED ✓

**Location:** `server/src/middleware/rateLimit.js`

**Implemented Limiters:**
- General API: 300 requests / 15 minutes
- Login: 10 requests / 15 minutes (good protection against brute force)
- Registration: 10 requests / 15 minutes
- Token Refresh: 30 requests / 15 minutes
- OTP Send/Verify: 5-10 requests / 15 minutes

**Risk:** Low
- Email OTP rate limiter is correctly applied
- Login rate limiting protects against password guessing

**Note:** Rate limiters are imported in routes but need to be applied. Currently only `refreshRateLimiter` and `accessTokenRateLimiter` are used in `auth.route.js`.

---

### 7. Input Validation

**Status:** PARTIALLY IMPLEMENTED ⚠

**Issues:**
1. No server-side validation middleware (express-validator, Joi, etc.)
2. Validation is done inline in controllers (error-prone and inconsistent)
3. Some fields lack proper validation:
   - `deviceId` is required but format not validated
   - No URL validation for profile images/backgrounds

**Risk:** Medium
- Relies on client-side validation which can be bypassed

---

### 8. MongoDB Query Safety

**Status:** IMPLEMENTED ✓

**Analysis:**
- All queries use Mongoose with proper schema validation
- No raw MongoDB queries found
- Password field uses `select: false`

**Risk:** Low

---

### 9. File Upload Security

**Status:** PARTIALLY IMPLEMENTED ⚠

**Location:** `server/src/config/multer.js`, `server/src/controller/background.controller.js:100-167`

**Issues:**
1. Multer uses `memoryStorage` (no temp files on disk) ✓
2. No file type validation (mimeType, extension)
3. No file size limit configured
4. Image upload goes to ImageKit but no server-side validation

**Risk:** High
- Malicious files could be uploaded
- No size limits allow DoS via large uploads

---

### 10. Socket.IO Security

**Status:** IMPLEMENTED ✓

**Location:** `server/src/Socket.IO/socketAuth.js`

```javascript
export function socketAuthMiddleware(socket, next) {
  const token = cookies.accessToken;
  if (!token) {
    return next(new Error("Authentication required"));
  }
  const payload = verifyAccessToken(token);
  socket.data.userId = payload.id || payload._id;
  next();
}
```

**Analysis:**
- Socket authentication is implemented
- Uses same JWT verification as HTTP routes

**Risk:** Low

---

### 11. End-to-End Encryption Implementation

**Status:** PARTIALLY IMPLEMENTED ⚠

**Analysis:**

**Key Generation (Frontend):**
- Location: `frontend/src/crypto/cryptoUtils.js:getOrCreateKeyPair()`
- Uses ECDH with P-256 curve
- Keys stored in IndexedDB (not transferable)

**Key Storage:**
- Location: `server/src/controller/auth.controller.js`
- `savePublicKey()` stores public key in User model
- `getPublicKeys()` retrieves device public keys

**Encryption Algorithm:**
- AES-GCM 256-bit
- IV: 12 bytes (nonce)

**Issues:**
1. **Private keys are NOT backed up** - If user clears browser data, encryption keys are lost
2. **No key rotation mechanism**
3. **Multi-device handling complex** - Requires each device to have its own keypair
4. **No forward secrecy** - Compromised key can decrypt all past messages
5. **Public key not encrypted at rest** (minor concern)

**Risk:** Medium-High
- Security is good but usability suffers without key backup
- No warning to users about this limitation

---

### 12. Email Security (OTP)

**Status:** IMPLEMENTED ✓

**Location:** `server/src/controller/Secure/verifyEmail.controller.js`

**Security Features:**
- OTP is hashed before storage (SHA-256)
- 1-minute expiry
- 5 failed attempts trigger 30-minute lockout
- 5 OTP requests trigger 30-minute generation block
- Cooldown of 30 seconds between OTP sends

**Risk:** Low

---

### 13. Error Handling & Information Disclosure

**Status:** PARTIALLY IMPLEMENTED ⚠

**Issues:**
1. Error messages are generic (good for security)
2. Stack traces are logged to console but not exposed to client ✓
3. **Sensitive info logged to console:**
   - `server/src/controller/auth.controller.js:38` - Logging `deviceId`
   - `server/src/controller/auth.controller.js:44-45` - Logging email and existing user
   - `server/src/config/imgkit/image.service.js:2-6` - API key prefix logged

**Risk:** Medium
- Console logs may persist in production logs
- Should remove debug logging before production

---

### 14. Session Management

**Status:** IMPLEMENTED ✓

**Location:** `server/src/model/session.model.js`

**Features:**
- Session stored with device ID
- Refresh token hashed before storage
- Expiry date tracked
- Device info (browser, OS, IP) logged

**Missing:**
- No session revocation listing
- No way to revoke all sessions for a user
- Sessions can't be invalidated server-side except by waiting for expiry or deleting specific device

**Risk:** Medium

---

## Security Issue Summary

| Severity | Issue | Location | Recommendation |
|----------|-------|----------|----------------|
| Critical | CSRF middleware not applied | `server/src/app.js:32-42` | Uncomment and activate `verifyCsrfOrigin` middleware |
| High | No file upload validation | `server/src/config/multer.js` | Add file type/size validation |
| Medium | Debug logging in production | Multiple files | Remove or secure console.log statements |
| Medium | No password complexity requirements | Frontend only | Add backend validation (length, special chars) |
| Medium | Session invalidation | `server/src/model/session.js` | Add endpoint to revoke sessions |
| Medium | No token revocation list | `server/src/lib/jwt.js` | Implement token blacklist for logout |
| Medium | Private keys not backed up | Frontend crypto | Warn users or implement key backup |
| Medium | CORS origins hardcoded | `server/src/app.js` | Make configurable via environment |
| Low | Login rate limit could be lower | `server/src/middleware/rateLimit.js` | Consider 5 attempts per 15 min |
| Low | No input sanitization middleware | App level | Add express-validator middleware |

---

## Security Recommendations Priority

### Phase 1 - Critical (Immediate)
1. **Activate CSRF protection** - Uncomment the middleware in `app.js`
2. **Remove debug logging** - Clean up console statements that log sensitive data

### Phase 2 - High (Within 1 week)
1. **Add file upload validation** - MIME type and size limits
2. **Implement input validation middleware** - Use Joi or express-validator

### Phase 3 - Medium (Within 2 weeks)
1. **Session management API** - Allow users to view/revoke sessions
2. **Password policy enforcement** - Backend validation for complexity
3. **Token revocation mechanism** - Allow immediate logout across devices
4. **Key backup warning** - Inform users about encryption key risks

### Phase 4 - Low (Future)
1. **Passwordless authentication options**
2. **Two-factor authentication support**
3. **Security headers middleware** (helmet.js)