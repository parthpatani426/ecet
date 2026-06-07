# ECETX Backend Setup Guide

## Overview
This guide will help you set up the FastAPI backend for ECETX with PostgreSQL database.

## Prerequisites
- Python 3.8 or higher
- PostgreSQL 12 or higher
- pip (Python package manager)
- Virtual environment (recommended)

## Installation Steps

### 1. Create Virtual Environment

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Setup PostgreSQL Database

#### Option A: Using Local PostgreSQL Server

```bash
# Install PostgreSQL if not already installed
# https://www.postgresql.org/download/

# Create database and user
psql -U postgres

# In psql terminal:
CREATE USER ecetx_user WITH PASSWORD 'ecetx_password';
CREATE DATABASE ecetx_db OWNER ecetx_user;
ALTER ROLE ecetx_user SET client_encoding TO 'utf8';
ALTER ROLE ecetx_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE ecetx_user SET default_transaction_deferrable TO on;
ALTER ROLE ecetx_user SET default_transaction_read_committed TO off;
\q
```

#### Option B: Using Docker

```bash
docker run --name ecetx-postgres \
  -e POSTGRES_USER=ecetx_user \
  -e POSTGRES_PASSWORD=ecetx_password \
  -e POSTGRES_DB=ecetx_db \
  -p 5432:5432 \
  -d postgres:15
```

### 4. Configure Environment Variables

```bash
# Copy example file
cp .env.example .env

# Edit .env with your settings
nano .env  # or use your preferred editor
```

**Key settings to configure:**

```env
# Database (match your PostgreSQL setup)
DATABASE_URL=postgresql://ecetx_user:ecetx_password@localhost:5432/ecetx_db

# JWT Secret (generate a secure random string)
SECRET_KEY=your-super-secret-key-at-least-32-characters-long

# Email Configuration (choose ONE provider)
# SMTP (Gmail example)
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Or SendGrid
# SENDGRID_API_KEY=your-sendgrid-api-key

# Or Resend
# RESEND_API_KEY=your-resend-api-key

FROM_EMAIL=noreply@ecetx.com

# Environment
ENVIRONMENT=development
FRONTEND_URL=http://localhost:8000
```

**For Gmail SMTP:**
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Use the 16-character App Password as SMTP_PASSWORD

### 5. Initialize Database

```bash
python
>>> from backend.database import init_db
>>> init_db()
>>> exit()
```

### 6. Run FastAPI Server

```bash
python -m backend.main

# Or use uvicorn directly
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

Server will be available at: `http://localhost:8000`

## API Documentation

Once the server is running, visit:
- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc
- **Health Check:** http://localhost:8000/health

## API Endpoints

### Authentication

**Register**
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123",
  "branch": "ece"
}
```

**Login**
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword123",
  "branch": "ece"
}
```

**Verify Email**
```
POST /api/auth/verify-email
Content-Type: application/json

{
  "email": "john@example.com",
  "code": "123456"
}
```

**Forgot Password**
```
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "john@example.com",
  "branch": "ece"
}
```

**Reset Password**
```
POST /api/auth/reset-password
Content-Type: application/json

{
  "email": "john@example.com",
  "code": "123456",
  "new_password": "newpassword123"
}
```

**Refresh Token**
```
POST /api/auth/refresh-token
Content-Type: application/json

{
  "refresh_token": "your-refresh-token"
}
```

### User

**Get Profile**
```
GET /api/user/profile
Authorization: Bearer {access_token}
```

**Get Branch Info**
```
GET /api/user/branch
Authorization: Bearer {access_token}
```

**Logout**
```
POST /api/user/logout
Authorization: Bearer {access_token}
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  branch ENUM NOT NULL,
  email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE
);
```

### OTP Tokens Table
```sql
CREATE TABLE otp_tokens (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  code VARCHAR(6) NOT NULL,
  type VARCHAR(50) NOT NULL,
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

## Troubleshooting

### Database Connection Error
```
Error: psycopg2.OperationalError: could not connect to server
```
**Solution:** Ensure PostgreSQL is running and DATABASE_URL is correct

### Port Already in Use
```
Error: Address already in use
```
**Solution:** Change port or kill process using port 8000:
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :8000
kill -9 <PID>
```

### Email Not Sending
- Check SMTP credentials
- For Gmail, ensure App Password is used (not regular password)
- Check spam folder
- Review server logs for errors

### Token Expiry Issues
Update token expiry times in `.env`:
```env
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
```

## Production Deployment

### Before Going Live

1. **Change SECRET_KEY** - Generate a new secure key:
   ```bash
   python -c "import secrets; print(secrets.token_urlsafe(32))"
   ```

2. **Update ENVIRONMENT** - Set to `production`

3. **Configure CORS** - Update allowed origins in `config.py`

4. **Set up SSL/TLS** - Use HTTPS in production

5. **Configure Proper Email Service** - Use SendGrid or Resend for production

6. **Setup Database Backups** - Regular backups are critical

7. **Enable Rate Limiting** - Prevent abuse

8. **Setup Logging** - Monitor application health

### Deployment Options

- **Heroku** (with PostgreSQL addon)
- **AWS EC2** (with RDS)
- **DigitalOcean** (with Managed PostgreSQL)
- **Railway.app** (easy deployment)
- **Render** (with free tier)

## Testing

```bash
# Test database connection
python
>>> from backend.database import engine
>>> engine.execute("SELECT 1")
>>> exit()

# Run API health check
curl http://localhost:8000/health
```

## Support

For issues or questions:
1. Check logs: `tail -f logs/app.log`
2. Review API docs: http://localhost:8000/docs
3. Check database: `psql -U ecetx_user ecetx_db`

## Security Notes

- Never commit `.env` file with real credentials
- Use environment variables for sensitive data
- Rotate secrets regularly
- Keep dependencies updated
- Monitor for SQL injection attempts
- Implement rate limiting
- Use HTTPS in production

---

**Backend Setup Complete! 🎉**

Your FastAPI server is now running and ready to power ECETX.
