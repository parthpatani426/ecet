# ECETX (ECETX PRODUCTION) - Implementation TODO

## Backend (FastAPI + PostgreSQL + SQLAlchemy)

### 1) Database schema & models
- [ ] Fix `users.email` rule to enforce **one email = one branch** (DB-level uniqueness)
- [ ] Add missing tables/models:
  - [ ] `subjects`
  - [ ] `topics`
  - [ ] `materials`
  - [ ] `questions`
  - [ ] `mock_tests`
  - [ ] `mock_attempts`
  - [ ] `user_progress`
- [ ] Add indexes for branch-filtered queries and dashboard aggregations
- [ ] Introduce Alembic migrations (create initial migration, then subsequent index/constraint migrations)

### 2) Authentication production fixes
- [ ] Ensure **verified-only login** is enforced (only verified accounts can login)
- [ ] Remove `branch` from login request/response flow:
  - [ ] Update `backend/routes/auth.py`:
    - [ ] remove `branch` from `LoginRequest`
    - [ ] derive branch from `users.branch` using authenticated user
  - [ ] Update `assets/js/api-client.js` and `login.html` UI:
    - [ ] remove branch selection from login
- [ ] Standardize auth dependencies:
  - [ ] create a reusable `get_current_user` dependency using JWT + load user from DB
- [ ] Add JWT/session validation improvements:
  - [ ] validate `sessions` table state (is_valid) if using server-side session tracking

### 3) Branch Guru system
- [ ] Implement a production-grade branch GPT endpoint:
  - [ ] `POST /api/guru/chat`
  - [ ] uses authenticated user → branch → `get_branch_guru_url(branch)`
  - [ ] (recommended) backend proxies to ChatGPT GPT URL to prevent exposing guru mapping
- [ ] Ensure frontend Branch Guru button opens branch-assigned GPT with **no manual switching**

### 4) Dashboard & learning services (real backend APIs)
- [ ] Implement authenticated dashboard endpoints (no hardcoded/mock data):
  - [ ] `GET /api/dashboard/summary` (welcome, streak, continue learning, recent activity counts)
  - [ ] `GET /api/dashboard/progress` (overall + subject progress)
  - [ ] `GET /api/dashboard/subjects`
  - [ ] `GET /api/dashboard/topics?subject_id=...`
  - [ ] `GET /api/dashboard/materials?topic_id=...`
  - [ ] `GET /api/practice/questions?...` (branch/subject/topic filters)
  - [ ] `GET /api/mocks/tests`
  - [ ] `POST /api/mocks/attempts` (store `mock_attempts`)
  - [ ] `GET /api/previous-papers`
  - [ ] `GET /api/analytics`
  - [ ] `GET /api/rank/predictor`
  - [ ] `GET /api/leaderboard`
  - [ ] `GET /api/activity/recent`
- [ ] Implement analytics computations:
  - [ ] streak logic (from attempts timestamps and/or progress updates)
  - [ ] progress percentages (from `user_progress`)
  - [ ] leaderboard (from best score/rank derived from attempts)

### 5) Production hardening for 500+ concurrency
- [ ] Add rate limiting for:
  - [ ] `/api/auth/*`
  - [ ] OTP endpoints
  - [ ] `/api/guru/chat`
- [ ] Add structured logging + request IDs
- [ ] Add proper error handling and consistent error response schema
- [ ] Decide sync vs async SQLAlchemy strategy for scale:
  - [ ] (recommended) move to async engine + asyncpg for high concurrency

## Frontend (HTML/JS)

### 6) Remove hardcoded data & branch selection
- [ ] Replace `assets/data/mockData.js` usage with real API calls
- [ ] Update `assets/js/api-client.js`:
  - [ ] `login(email,password)` only (no branch param)
- [ ] Update auth UI:
  - [ ] `login.html` remove branch input
  - [ ] dashboard loads via `/api/user/branch` and subsequent dashboard endpoints

### 7) Branch-specific rendering
- [ ] Ensure dashboard pages fetch and render branch-specific data:
  - [ ] subjects/progress/analytics/practice/mocks/previous papers/guru

## Milestones
- [ ] Backend DB schema + migrations ready
- [ ] Auth login branch removed + auto branch load working
- [ ] Branch Guru GPT button working with branch-specific mapping
- [ ] Dashboard module APIs and frontend integration complete
- [ ] Load test and concurrency validation (500+)
