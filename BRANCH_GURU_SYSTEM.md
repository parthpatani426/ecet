# ECETX Branch-Specific Guru System Documentation

## System Overview

ECETX has been transformed into a production-grade **Branch-Specific ECET Guru System** where each student is permanently connected to one of five engineering branches and has access to a dedicated AI tutor (GPT) specific to their branch.

## Architecture

### System Components

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (HTML/CSS/JS)               │
│  ├─ Login Page (Branch Selection)                       │
│  ├─ Registration (Branch Required)                      │
│  ├─ Email Verification                                  │
│  ├─ Dashboard (Branch Guru Button)                      │
│  └─ Profile (Read-Only Branch)                          │
└────────────────┬────────────────────────────────────────┘
                 │ HTTPS/JWT
                 ▼
┌─────────────────────────────────────────────────────────┐
│                  FastAPI Backend                        │
│  ├─ Authentication (Register/Login/Password Reset)      │
│  ├─ JWT Token Management                               │
│  ├─ Email Verification with OTP                        │
│  ├─ User Profile Management                            │
│  └─ Branch-Specific Routing                            │
└────────────────┬────────────────────────────────────────┘
                 │ SQL
                 ▼
┌─────────────────────────────────────────────────────────┐
│           PostgreSQL Database                           │
│  ├─ users (locked branch field)                        │
│  ├─ otp_tokens (email & password reset)                │
│  └─ sessions (JWT token tracking)                      │
└─────────────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│         OpenAI GPT Tutors (External)                    │
│  ├─ ECET ECE Guru                                      │
│  ├─ ECET EEE Guru                                      │
│  ├─ ECET CME Guru                                      │
│  ├─ AP ECET Civil Guru                                 │
│  └─ ECET Mechanical Guru                               │
└─────────────────────────────────────────────────────────┘
```

## Branches & GPT Mappings

| Branch | Full Name | GPT URL |
|--------|-----------|---------|
| ECE | Electronics & Communication Engineering | https://chatgpt.com/g/g-6a24001154b08191812b13cde8e9ca5d-ecet-ece |
| EEE | Electrical & Electronics Engineering | https://chatgpt.com/g/g-6a23e587545881919dba2917c1fdd4c6-ecet-eee-guru |
| CME | Computer Science & Engineering | https://chatgpt.com/g/g-6a23cdffc82c8191a95dc0f00760fbb3-ecet-cme-guru |
| Civil | Civil Engineering | https://chatgpt.com/g/g-6a23febe57f08191ba68c5317a1e0e99-ap-ecet-civil |
| Mechanical | Mechanical Engineering | https://chatgpt.com/g/g-6a23eb5942c08191b73f6f97611b7528-ecet-mech |

## Registration System

### Flow

```
User → Registration Page → Select Branch → Email/Password → Database Entry → Email Verification → Login
```

### Key Rules

1. **One Branch Per Account**: Each user must select ONE branch during registration
2. **Email Uniqueness Per Branch**: 
   - `student@gmail.com` can register as **ECE**
   - But `student@gmail.com` CANNOT register as **EEE** (same branch email)
   - However, `student@gmail.com` CAN register in different branches (different accounts)
3. **Permanent Branch**: Once registered, branch cannot be changed
4. **Email Verification**: Required before account activation

### Error Handling

**When registering duplicate email in same branch:**
```
❌ This email is already registered under the Electronics & Communication Engineering branch.

To register another branch account, user must use another email.
```

## Login System

### Flow

```
User → Login Page → Email + Password + Branch → Validation → JWT Tokens → Dashboard
```

### Key Validation

1. **Email + Password + Branch** (all three required)
2. **Branch Locking**: User cannot switch branches after login
3. **JWT Authentication**: Access token valid for 30 minutes, refresh token for 7 days
4. **Session Tracking**: All logins are tracked in sessions table

### Login Response

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer",
  "user": {
    "id": 123,
    "name": "John Doe",
    "email": "john@example.com",
    "branch": "ece",
    "branch_name": "Electronics & Communication Engineering",
    "guru_url": "https://chatgpt.com/g/g-6a24001154b08191...",
    "email_verified": true
  }
}
```

## Dashboard Experience

### Post-Login Features

After successful login, users see:

1. **Welcome Message**: "Welcome Back, [Name]! 👋"
2. **Quick Actions Bar**:
   - 📚 Learn
   - ✏️ Practice
   - 📝 Tests
   - 🤖 **Branch Guru** (NEW - Opens GPT for their branch)
3. **Statistics**: Study streak, scores, rank, hours
4. **Courses**: Continue learning section
5. **Analytics**: Performance overview

### Branch Guru Button

Automatically opens the GPT tutor for the logged-in user's branch:

```javascript
// Example: User is logged in as CME
// Clicking "Branch Guru" opens:
// https://chatgpt.com/g/g-6a23cdffc82c8191a95dc0f00760fbb3-ecet-cme-guru
// in a new tab
```

## Profile Page

### Displayed Information

```
┌─────────────────────────────────┐
│      Account Information        │
├─────────────────────────────────┤
│ Name: John Doe                  │
│ Email: john@example.com         │
│ Branch: ECE (READ-ONLY)        │
│ Member Since: January 15, 2024  │
└─────────────────────────────────┘
```

### Key Feature

**Branch field is READ-ONLY** with explanation:
```
⚠️ Note: Your branch is locked and cannot be changed. 
It was selected during registration.
```

## Email Verification System

### Verification Flow

```
Registration → OTP Generated → Email Sent → User Verifies → Account Activated
```

### Email Templates

#### 1. Verification Email
- Sent after registration
- Contains 6-digit OTP
- Valid for 15 minutes
- Subject: "🎓 Verify Your ECETX Email"

#### 2. Password Reset Email
- Sent when user requests password reset
- Contains 6-digit OTP
- Valid for 15 minutes
- Subject: "🔐 Reset Your ECETX Password"

#### 3. Welcome Email
- Sent after email verification
- Confirms account activation
- Lists platform features
- Subject: "🎉 Welcome to ECETX!"

## Authentication Endpoints

### Base URL
```
http://localhost:8000/api
```

### Register
```
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "branch": "ece"
}

Response: 201 Created
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "branch": "ece",
  "message": "✅ Registration successful! Check your email for verification code.",
  "status_code": 201
}
```

### Verify Email
```
POST /auth/verify-email
Content-Type: application/json

{
  "email": "john@example.com",
  "code": "123456"
}

Response: 200 OK
{
  "message": "✅ Email verified successfully!",
  "status_code": 200
}
```

### Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!",
  "branch": "ece"
}

Response: 200 OK
{
  "access_token": "...",
  "refresh_token": "...",
  "token_type": "bearer",
  "user": { ... },
  "status_code": 200
}
```

### Forgot Password
```
POST /auth/forgot-password
Content-Type: application/json

{
  "email": "john@example.com",
  "branch": "ece"
}

Response: 200 OK
{
  "message": "✅ If an account exists, you'll receive a password reset code",
  "status_code": 200
}
```

### Reset Password
```
POST /auth/reset-password
Content-Type: application/json

{
  "email": "john@example.com",
  "code": "123456",
  "new_password": "NewSecurePass456!"
}

Response: 200 OK
{
  "message": "✅ Password reset successfully! Please login with your new password.",
  "status_code": 200
}
```

### Get Profile
```
GET /user/profile
Authorization: Bearer {access_token}

Response: 200 OK
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "branch": "ece",
  "email_verified": true,
  "created_at": "2024-01-15T10:30:00",
  "is_active": true
}
```

### Get Branch Info
```
GET /user/branch
Authorization: Bearer {access_token}

Response: 200 OK
{
  "branch": "ece",
  "guru_url": "https://chatgpt.com/g/g-6a24001154b08191...",
  "guru_name": "ECET Electronics & Communication Engineering Guru"
}
```

## Database Schema

### Users Table

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  branch ENUM('ece', 'eee', 'cme', 'civil', 'mechanical') NOT NULL,
  email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  UNIQUE(email, branch)  -- Same email allowed in different branches
);
```

### OTP Tokens Table

```sql
CREATE TABLE otp_tokens (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  code VARCHAR(6) NOT NULL,
  type VARCHAR(50) NOT NULL,  -- 'email_verification', 'password_reset'
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NOT NULL
);
```

### Sessions Table

```sql
CREATE TABLE sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(500) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NOT NULL,
  is_valid BOOLEAN DEFAULT TRUE
);
```

## Frontend Implementation

### Key JavaScript Classes

#### 1. ECETXAPIClient
Handles all API communication with JWT authentication.

```javascript
// Register
await window.apiClient.register(name, email, password, branch);

// Login
await window.apiClient.login(email, password, branch);

// Verify Email
await window.apiClient.verifyEmail(email, code);

// Password Reset
await window.apiClient.forgotPassword(email, branch);
await window.apiClient.resetPassword(email, code, newPassword);

// User Profile
await window.apiClient.getProfile();
await window.apiClient.getBranchInfo();

// Logout
await window.apiClient.logout();
```

#### 2. AuthenticationManager
Manages authentication state and authorization.

```javascript
// Check if authenticated
window.authManager.isAuthenticated  // boolean

// Get stored user
window.authManager.user  // { id, name, email, branch, ... }

// Get user's branch
window.authManager.getBranch()  // 'ece'

// Get guru URL
window.authManager.getGuruURL()  // 'https://chatgpt.com/...'

// Logout
await window.authManager.logout()
```

#### 3. BranchGuruManager
Manages opening branch-specific GPT tutors.

```javascript
// Open user's branch guru
window.branchGuruManager.openBranchGuru()

// Get guru URL for branch
window.branchGuruManager.getGuruUrl('ece')  // 'https://chatgpt.com/...'

// Get branch name
window.branchGuruManager.getBranchName('ece')
// 'Electronics & Communication Engineering'

// Get all branches
window.branchGuruManager.getBranches()
// ['ece', 'eee', 'cme', 'civil', 'mechanical']
```

## Security Features

### Password Security

1. **Minimum 8 characters** required
2. **Bcrypt hashing** with salt
3. **Password reset via OTP** (no password reset links)
4. **All sessions invalidated** on password reset

### JWT Security

1. **Access Token**: 30-minute expiry
2. **Refresh Token**: 7-day expiry
3. **Token Verification**: On every protected endpoint
4. **Session Tracking**: All tokens stored in database

### Email Security

1. **OTP Verification**: 15-minute window
2. **One-time use**: OTP marked as used after verification
3. **Secure Storage**: Hashed passwords, encrypted tokens
4. **Rate Limiting**: (Ready for implementation)

### CORS Protection

- Configured for specific origins
- Credentials allowed only from trusted domains
- Production-safe configuration

## Production Checklist

- [ ] Change `SECRET_KEY` (generate new 32+ char string)
- [ ] Set `ENVIRONMENT=production`
- [ ] Configure SMTP or SendGrid/Resend
- [ ] Update database credentials
- [ ] Enable HTTPS
- [ ] Setup database backups
- [ ] Configure rate limiting
- [ ] Setup logging and monitoring
- [ ] Review CORS whitelist
- [ ] Enable database connection pooling

## Error Handling

### Common API Errors

| Status | Error | Solution |
|--------|-------|----------|
| 409 | Email already registered under branch | Use different email or different account |
| 401 | Invalid email, password, or branch | Check credentials and branch selection |
| 400 | Invalid or expired OTP | Request new OTP |
| 403 | Account is deactivated | Contact support |
| 500 | Server error | Check logs, retry |

## Future Enhancements

1. **Multi-device Sync**: Keep progress across devices
2. **Branch-specific Content**: Custom courses per branch
3. **Real-time Analytics**: Live progress tracking
4. **Social Learning**: Branch-specific communities
5. **Mobile App**: Native Android/iOS
6. **Advanced Analytics**: ML-powered recommendations
7. **Certificate System**: Completion certificates per branch

## Support & Troubleshooting

### Common Issues

**"Branch Guru button doesn't work"**
- Ensure user is logged in
- Check browser console for errors
- Verify GPT URL is correct

**"Email not received"**
- Check spam/junk folder
- Verify email address
- Wait a few minutes for delivery

**"Can't login with correct credentials"**
- Ensure branch is selected correctly
- Check if account is active
- Verify email is verified

**"Password reset code expired"**
- OTP valid for 15 minutes
- Request new code from forgot-password page

## Contact & Support

- **Email**: support@ecetx.com
- **Issues**: GitHub Issues (if open-source)
- **Documentation**: Full API docs at `/docs`

---

**ECETX Branch-Specific Guru System v1.0** ✅
