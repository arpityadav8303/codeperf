I am string this project from 23/03/2026 so manage dates according to strting date
# CodePerf — Complete Learning & Building Roadmap
# Claude Context File — Always paste this when starting a new chat

---

## 🤖 PROMPT FOR CLAUDE (Paste this with context)

You are my dedicated technical mentor for the next 12 months. I am building
"CodePerf" — an Algorithmic Complexity Profiler — as my portfolio project to
get a job at a product-based company at 8-10 LPA by February 2027.

Rules for how you help me:
1. Always relate explanations back to CodePerf project
2. Give me phase-appropriate help only (check which phase/week I am currently in)
3. When I say "give me today's task" — look at my current week and give me
   exactly what to study and build that day with resources
4. Focus only on what 8-10 LPA product companies actually test
5. When explaining a concept, always show: concept → how it works → how it
   applies to CodePerf
6. Be honest about difficulty. Don't sugarcoat.
7. If I am stuck, don't give full solution — give hints first
8. At end of each week, give me a checklist to self-evaluate
9. Never suggest learning something outside my current phase unless I ask
10. I can give only 11-12 hours per week. Respect this constraint always.

My current status: [I WILL UPDATE THIS EVERY WEEK — e.g. "Phase 1, Week 3"]

---

## 👤 About Me
- Location: Gurugram, India
- Target: 8-10 LPA at product-based company by Feb 2027
- Available hours: 11-12 hours per week
- Daily split: Mon-Fri = 1.5 hrs/day | Sat-Sun = 2 hrs/day
- Learning philosophy: Build first using what I know. Introduce new technology
  only when the project hits a wall without it. Skill-building is the goal,
  not just finishing.

---

## 🎯 Project: CodePerf
**Algorithmic Complexity Profiler & Performance Intelligence Platform**

### Problem It Solves
Fintech companies (Zerodha, Razorpay, CRED) cannot automatically detect
when a developer introduces an O(n²) regression before it hits production.

### How It Works
- Benchmarks functions across input sizes: n = 10, 100, 1K, 10K, 100K, 1M
- Empirically derives Big-O complexity using least-squares curve fitting
- Blocks GitHub PRs automatically when performance regressions are detected
- Provides AI-powered code review using a RAG pipeline

### 3 Operating Modes
1. PR Mode       — Triggered on every PR, scans only changed files
2. Full Repo Scan — Manual or scheduled, scans entire codebase, builds heatmap
3. Manual Mode   — Developer pastes any function, gets instant analysis

### Full Tech Stack
| Layer          | Technology                                      |
|----------------|-------------------------------------------------|
| Frontend       | React, Monaco Editor, Chart.js, WebSockets      |
| Backend API    | Node.js, Express.js                             |
| Database       | MySQL (Phase 1-3) → PostgreSQL (Phase 4+)       |
| ORM            | TypeORM (works with both MySQL and PostgreSQL)  |
| Vector Search  | pgvector (inside PostgreSQL — added at Phase 4) |
| Job Queue      | Redis + BullMQ                                  |
| Judge Engine   | C++ (OOP + seccomp sandbox + Linux syscalls)    |
| AI Service     | Python FastAPI                                  |
| AI Pipeline    | RAG + Gen AI (LLM)                              |
| Integration    | GitHub Webhooks, GitHub Checks API, GitHub OAuth|

### 4-Layer Architecture (applied in every feature)
```
Request → Controller → Service → Repository → Model (Entity)
  ↑           ↑            ↑           ↑           ↑
HTTP in   routes +     business     DB queries   TypeORM
          validation   logic        only here    entity
```
- **Controller**: handles HTTP req/res, input validation (Zod), calls Service
- **Service**: all business logic, orchestrates calls to Repo, never touches DB directly
- **Repository**: all TypeORM/SQL queries, no business logic, no HTTP stuff
- **Model (Entity)**: TypeORM entity class, column definitions, relations

**Why this matters for MySQL → PostgreSQL migration:**
When you migrate, ONLY the Repository layer and Model (Entity) layer need changes.
Controllers and Services stay 100% untouched. This is the exact reason the 4-layer
architecture pays off — your business logic is decoupled from your database driver.

### MySQL → PostgreSQL Migration Plan
```
Phase 1-3: Build everything on MySQL
  - Company uses MySQL → you learn what you use at work
  - TypeORM syntax is identical for both databases
  - All Controllers and Services are DB-agnostic (they call Repo, not SQL)

Start of Phase 4 (Oct 2026): Migrate to PostgreSQL
  - Why: pgvector (RAG/embeddings) only works on PostgreSQL
  - What changes: only Repository files + Entity files (connection config)
  - What stays the same: all Controllers, all Services, all business logic
  - Migration effort: ~2-3 days, not weeks
  - TypeORM migration files are re-run on PostgreSQL fresh (no data to port yet)
```

### How New Technology Is Introduced
```
Each new technology has a TRIGGER — the moment the project breaks without it:

Week 9:  POST /submissions blocks the entire API for 30 seconds
         → Redis + BullMQ fixes it. You feel the pain before the solution.

Week 10: Client has no way to see live benchmark progress
         → WebSockets fix it. You understand why polling is not enough.

Week 11: GitHub sends PR events but you have no way to receive them
         → Webhooks fix it. You understand why HMAC verification matters.

Week 12: You detect a regression but cannot stop the PR from merging
         → GitHub Checks API fixes it. The product becomes complete.

Phase 3: Node.js cannot enforce memory/time limits on user code
         → Linux syscalls + seccomp fix it. Nothing else works here.

Phase 4: MySQL cannot do vector similarity search for RAG
         → PostgreSQL + pgvector fix it. Migration makes sense now.
```

---

## 📊 Current Skill Level
| Technology              | Level                    |
|-------------------------|--------------------------|
| React                   | Familiar — basics        |
| Node.js + Express       | Familiar — basics        |
| MySQL + TypeORM         | Familiar — basics        |
| PostgreSQL              | Zero (will migrate in Phase 4) |
| C++ + OOP               | Basic — some OOP         |
| RAG / AI Integration    | Zero                     |
| pgvector                | Zero                     |
| seccomp / Linux syscalls| Zero                     |
| GitHub Apps / Webhooks  | Zero                     |
| Redis + BullMQ          | Zero                     |
| Python FastAPI          | Zero                     |

---

## 🗺️ MASTER ROADMAP OVERVIEW

| Phase | Duration          | Focus                                    | Hours    |
|-------|-------------------|------------------------------------------|----------|
| 1     | Mar–May 2026      | Build Complete Backend API               | ~143 hrs |
| 2     | Jun–Jul 2026      | React Frontend                           | ~96 hrs  |
| 3     | Aug–Sep 2026      | C++ Judge Engine                         | ~96 hrs  |
| 4     | Oct–Nov 2026      | RAG + AI Integration                     | ~96 hrs  |
| 5     | Dec–Feb 2027      | Polish + Production + Interview Prep     | ~144 hrs |

Target by Feb 2027: 70% project complete + interview ready at 8-10 LPA

**Core principle: Build first using what you know.
Introduce new technology only when the project demands it.**

---

## ═══════════════════════════════════════════════════════
## PHASE 1 — Build Complete Backend API
## Mar 2026 → May 2026 | 13 Weeks | ~143 Hours
## ═══════════════════════════════════════════════════════

### PHASE 1 GOAL
Build the complete, working CodePerf backend API using technologies you
already know (Node, Express, MySQL, TypeORM). New technologies (Redis,
BullMQ, WebSockets, GitHub Webhooks) are introduced only when the project
hits a real wall without them — not before.

**Database: MySQL** (your company uses MySQL — learn what you use at work)
**Architecture: Controller → Service → Repository → Model on every feature**
**Rule: No new technology until the project breaks without it**

---

### ── WEEK 1 (Mar 2 – Mar 8) ──────────────────────────────
**Topic: Project Scaffold — Folder Structure + TypeORM Setup + All Entities**
**Weekly Goal: Running Express server connected to MySQL with all 5 entities and migrations**
**New Tech This Week: None — you know all of this**

| Day | Hours | Task |
|-----|-------|------|
| Mon | 1.5   | Set up the backend/ folder. Init TypeScript project. Install: express, typescript, typeorm, mysql2, reflect-metadata, zod, dotenv. Configure tsconfig.json. Get a basic Express server running on port 3000 |
| Tue | 1.5   | Set up TypeORM DataSource with MySQL. Configure ormconfig. Create the full folder structure: controllers/, services/, repos/, models/, middleware/, routes/, utils/. This structure never changes |
| Wed | 1.5   | Build Model layer — write all 5 TypeORM entities: User, Submission, BenchmarkResult, AlgorithmPattern, Repository. Define all columns and relations (@OneToMany, @ManyToOne). No sync:true — migrations only |
| Thu | 1.5   | Run first migrations. Generate migration from entities. Run migration. Verify all 5 tables exist in MySQL with correct columns and foreign keys. Fix any relation errors |
| Fri | 1.5   | Build utils/response.ts — sendResponse() helper that always returns {success, data, message, pagination}. Build middleware/errorHandler.ts — catches all errors, returns standard error format. Apply both globally |
| Sat | 2.0   | Build middleware/validate.ts — Zod validation middleware. Write Zod schemas for all 5 entities (create + update). Test that invalid request bodies are rejected before hitting controller |
| Sun | 2.0   | Build middleware/logger.ts using Winston. Structured JSON logs with levels (info/warn/error). Morgan for HTTP request logging. Add request ID to every log. Verify logs are clean and readable |

**End of Week 1 Checklist:**
- [ ] Express server running, connected to MySQL
- [ ] All 5 TypeORM entities created with proper relations
- [ ] Migrations running — no sync:true anywhere
- [ ] Standard sendResponse() helper applied to all routes
- [ ] Error handler middleware catching everything
- [ ] Winston + Morgan logger on every request
- [ ] Folder structure matches 4-layer architecture exactly

---

### ── WEEK 2 (Mar 9 – Mar 15) ──────────────────────────────
**Topic: Auth API — JWT + Refresh Tokens + bcrypt**
**Weekly Goal: Complete auth system — register, login, refresh, logout, /me**
**New Tech This Week: None — JWT and bcrypt are familiar**

| Day | Hours | Task |
|-----|-------|------|
| Mon | 1.5   | Build Model layer: User entity with @BeforeInsert hook that bcrypt-hashes password automatically. passwordHash column, no plain password. Write UserRepo: findByEmail(), findById(), save() |
| Tue | 1.5   | Build AuthService.register() — check no duplicate email → save user (password hashed via entity hook) → generate access token (15 min expiry) + refresh token (7 day expiry) → return both |
| Wed | 1.5   | Build AuthController + routes/auth.ts: POST /api/v1/auth/register and POST /api/v1/auth/login. Both call AuthService. Apply Zod validation. Return tokens in response |
| Thu | 1.5   | Build: POST /api/v1/auth/refresh — validate refresh token → issue new access token + rotate refresh token (old one invalidated). POST /api/v1/auth/logout — blacklist refresh token. GET /api/v1/auth/me |
| Fri | 1.5   | Build middleware/auth.ts — extract JWT from Authorization header → verify → attach user to req.user. Apply to protect all non-auth routes. Confirm unprotected routes return 401 without valid token |
| Sat | 2.0   | Wire everything: Test all 5 auth endpoints in Postman in sequence — register → login → /me → refresh → logout. Confirm token rotation (old refresh token rejected after rotation) |
| Sun | 2.0   | Deepen understanding: Write answers to — "How does JWT signing work?", "Why 15 min access token?", "Why is logout hard with JWT and how do you solve it?". These are exact interview questions |

**End of Week 2 Checklist:**
- [ ] Register endpoint — user saved, tokens returned
- [ ] Login endpoint — validates credentials, returns tokens
- [ ] /me endpoint — returns user from JWT payload
- [ ] Refresh endpoint — old token invalidated, new token issued
- [ ] Auth middleware rejecting requests without valid token
- [ ] Can explain JWT signing and refresh token rotation without notes

---

### ── WEEK 3 (Mar 16 – Mar 22) ──────────────────────────────
**Topic: GitHub OAuth + Security Hardening**
**Weekly Goal: GitHub login working. Auth routes hardened with rate limiting.**
**New Tech This Week: None — OAuth is straightforward to implement**

| Day | Hours | Task |
|-----|-------|------|
| Mon | 1.5   | Study: OAuth 2.0 Authorization Code flow step by step. Why you never see the user's password. What happens at each step. Register a GitHub OAuth App in your GitHub developer settings |
| Tue | 1.5   | Build: GET /api/v1/auth/github — redirect user to GitHub auth URL with client_id + scopes. GET /api/v1/auth/github/callback — receive code, exchange for GitHub access token, fetch user profile from GitHub |
| Wed | 1.5   | Build: After callback — check if user exists by githubId. If yes: generate JWT and login. If no: create new user (no password, githubId only), then login. Return same JWT tokens as regular login |
| Thu | 1.5   | Build: Rate limiting using express-rate-limit. Auth routes: 5 attempts per 15 mins. API routes: 100 per min. Different limits per route group. Confirm brute force on /login is blocked after 5 attempts |
| Fri | 1.5   | Build: Add Helmet.js — understand what each header does. Add input sanitization. Write test confirming security headers are present in every response |
| Sat | 2.0   | Full auth test: All 7 endpoints in Postman (register, login, refresh, logout, /me, github, github/callback). Write complete Postman collection with test scripts. Every endpoint must pass |
| Sun | 2.0   | Draw the full auth flow from memory: user clicks login → what happens step by step → what is stored in DB → what is stored client-side → how refresh works → how logout works. This is your interview answer |

**End of Week 3 Checklist:**
- [ ] GitHub OAuth login working end to end
- [ ] Rate limiting on all auth routes (brute force blocked)
- [ ] Helmet security headers present in every response
- [ ] Full Postman collection for all 7 auth endpoints
- [ ] Can draw and explain entire auth flow without notes

---

### ── WEEK 4 (Mar 23 – Mar 29) ──────────────────────────────
**Topic: Submission API — Core Endpoints**
**Weekly Goal: POST and GET /submissions working with strict 4-layer architecture**
**New Tech This Week: None — Express + TypeORM building**

| Day | Hours | Task |
|-----|-------|------|
| Mon | 1.5   | Build Model layer: Submission entity (id, code, language, status, detectedComplexity, confidence). BenchmarkResult entity (id, inputSize, executionTimeMs, memoryUsedKb). Submission hasMany BenchmarkResult. Run migrations |
| Tue | 1.5   | Build SubmissionRepo: save(submission), findById(id), findWithBenchmarks(id) using QueryBuilder + leftJoinAndSelect. BenchmarkRepo: saveBulk(results[]), findBySubmissionId(id). DB logic lives here only |
| Wed | 1.5   | Build SubmissionService.create(dto) — validate → save submission with status 'queued' → save mock benchmark results (hardcoded for now, real C++ engine in Phase 3) → update status 'completed' → return |
| Thu | 1.5   | Build SubmissionController + routes/submissions.ts: POST /api/v1/submissions — Zod validation → Service.create() → return {submissionId, status}. Apply auth middleware |
| Fri | 1.5   | Build: GET /api/v1/submissions/:id — Controller → Service → SubmissionRepo.findWithBenchmarks() → return submission with all benchmark results. Return 404 if not found or belongs to different user |
| Sat | 2.0   | Test end to end: login → POST /submissions → GET /submissions/:id. Confirm mock benchmarks returned. Run EXPLAIN on GET query — confirm no full table scan. Add index on userId if missing |
| Sun | 2.0   | 4-layer audit: Is any DB query in Service? Move to Repo. Is any business logic in Controller? Move to Service. Is any HTTP code in Service? Move to Controller. Each layer does ONE thing only |

**End of Week 4 Checklist:**
- [ ] POST /submissions saves submission + mock benchmarks to DB
- [ ] GET /submissions/:id returns submission with benchmark results
- [ ] Auth protecting both endpoints (401 if no token)
- [ ] 404 returned if submission belongs to another user
- [ ] No DB queries in Service layer — all in Repo
- [ ] No business logic in Controller layer — all in Service

---

### ── WEEK 5 (Mar 30 – Apr 5) ──────────────────────────────
**Topic: Submission API — Pagination + Filters + History**
**Weekly Goal: Full submission history with pagination and filters**
**New Tech This Week: None — QueryBuilder pagination patterns**

| Day | Hours | Task |
|-----|-------|------|
| Mon | 1.5   | Build SubmissionRepo.findAllByUser() — QueryBuilder with WHERE userId, ORDER BY createdAt DESC, LIMIT + OFFSET. Return {results, total} — both are needed for pagination metadata |
| Tue | 1.5   | Add optional filters to findAllByUser(): language (cpp/python/java/js), detectedComplexity (On/Onlogn/On2), date range. Only apply filters when provided. Test all combinations |
| Wed | 1.5   | Build SubmissionService.list() — accepts page + limit + filters. Validates (page >= 1, limit max 50). Calls repo. Returns {data, total, page, totalPages} — all calculated here |
| Thu | 1.5   | Build: GET /api/v1/submissions — Controller extracts query params, passes to Service.list(), returns paginated response using sendResponse() with pagination field populated |
| Fri | 1.5   | Build: GET /api/v1/submissions/:id/review — returns placeholder {review: "AI review coming in Phase 4", suggestedFix: null}. Structure the response properly — real AI replaces this content later |
| Sat | 2.0   | Test: Create 5 submissions with different languages. Test pagination (page=1 limit=2, page=2 limit=2). Test each filter. Confirm pagination metadata correct |
| Sun | 2.0   | SQL deep dive on real queries: Run EXPLAIN on paginated + filtered query. Add composite index on (userId, createdAt). Run EXPLAIN again. Document exactly what changed and why |

**End of Week 5 Checklist:**
- [ ] GET /submissions returns paginated results with metadata
- [ ] All 3 filters working correctly
- [ ] Composite index on (userId, createdAt) confirmed with EXPLAIN
- [ ] EXPLAIN shows index scan, not full table scan
- [ ] /review endpoint returning correct placeholder structure

---

### ── WEEK 6 (Apr 6 – Apr 12) ──────────────────────────────
**Topic: SQL Deep Dive — Window Functions + Indexes on Real CodePerf Schema**
**Weekly Goal: Write advanced SQL against actual CodePerf tables. No toy examples.**
**New Tech This Week: None — deepening SQL you already know**

| Day | Hours | Task |
|-----|-------|------|
| Mon | 1.5   | Study: Window functions — ROW_NUMBER(), RANK(), DENSE_RANK(), LAG(), LEAD(). OVER(PARTITION BY ... ORDER BY ...). Write directly on CodePerf MySQL schema — not toy tables |
| Tue | 1.5   | Write this real CodePerf query: "For each user, their last 5 submissions with complexity" — using ROW_NUMBER() partitioned by userId ordered by createdAt DESC. Filter WHERE row_num <= 5 |
| Wed | 1.5   | Write this real CodePerf query: "For each submission, show current complexity AND previous complexity side by side" using LAG(). This is exactly what regression detection compares |
| Thu | 1.5   | Study: B-Tree index internals — draw it. Composite index column order rule. When indexes hurt. Add all missing indexes to CodePerf schema. EXPLAIN before and after each one. Document results |
| Fri | 1.5   | Study + Fix: N+1 problem — find it in your existing TypeORM code (anywhere you loop and call repo inside the loop). Fix all N+1 with leftJoinAndSelect. Confirm with query logs the count dropped |
| Sat | 2.0   | Write the 3 dashboard queries: (1) Complexity distribution — count of each type per user. (2) Top 5 users by submission count this week. (3) Functions that regressed using LAG() over time |
| Sun | 2.0   | Practice: LeetCode Top SQL 50 — complete 10 problems focusing on JOINs and window functions. These exact patterns come up in product company interviews |

**End of Week 6 Checklist:**
- [ ] Can write ROW_NUMBER + LAG + LEAD directly on real schema
- [ ] All 3 dashboard queries working and returning correct results
- [ ] All N+1 problems fixed in TypeORM code
- [ ] Every query has proper indexes (confirmed with EXPLAIN)
- [ ] Completed at least 10 LeetCode SQL problems

---

### ── WEEK 7 (Apr 13 – Apr 19) ──────────────────────────────
**Topic: Repository API — Connect GitHub Repos**
**Weekly Goal: Users can connect their GitHub repos to CodePerf**
**New Tech This Week: None — Express + TypeORM building**

| Day | Hours | Task |
|-----|-------|------|
| Mon | 1.5   | Build Model layer: Repository entity — githubRepoId, fullName, webhookSecret, blockOnRegression (boolean), regressionThresholdX (float, e.g. 2.0 = 2x slower triggers block). ManyToOne to User. Run migration |
| Tue | 1.5   | Build RepositoryRepo: save(), findById(), findAllByUser(), findByGithubRepoId(). Add index on githubRepoId — this will be queried heavily when webhooks arrive in Week 11 |
| Wed | 1.5   | Build RepositoryService: connect(userId, dto) — validate not already connected → generate webhookSecret using crypto.randomBytes(32) → save → return. list(userId) — paginated list |
| Thu | 1.5   | Build RepositoryController + routes/repositories.ts: POST /api/v1/repositories, GET /api/v1/repositories. Auth middleware applied. Zod validation on POST body |
| Fri | 1.5   | Build: GET /api/v1/repositories/:id/functions — returns empty array for now (real data comes after webhook + analysis pipeline built in Weeks 11-12). PUT to update config. DELETE to disconnect |
| Sat | 2.0   | Test all repository endpoints in Postman. What happens if same repo connected twice? Handle with proper error message (not 500). Add this to Postman collection |
| Sun | 2.0   | Think ahead: The webhookSecret generated this week — in Week 11 this exact secret will be used to verify HMAC signatures from GitHub. Write a note in the code explaining why it was generated this way |

**End of Week 7 Checklist:**
- [ ] POST /repositories saving repo with generated webhookSecret
- [ ] GET /repositories listing user's repos (paginated)
- [ ] PUT + DELETE working with proper auth checks
- [ ] Duplicate repo connection handled gracefully
- [ ] Index on githubRepoId confirmed with EXPLAIN

---

### ── WEEK 8 (Apr 20 – Apr 26) ──────────────────────────────
**Topic: Dashboard API + Transactions + ACID**
**Weekly Goal: Dashboard API working. Transactions protecting multi-insert operations.**
**New Tech This Week: None — TypeORM transactions are part of TypeORM**

| Day | Hours | Task |
|-----|-------|------|
| Mon | 1.5   | Study: ACID with real CodePerf examples. If submission saves but benchmarks fail — DB is in inconsistent state. This is why transactions exist. MySQL InnoDB is ACID-compliant. MyISAM is not — know this difference |
| Tue | 1.5   | Build: Wrap submission creation in TypeORM queryRunner transaction. BEGIN → save submission → save all benchmarks → COMMIT. If any insert fails → ROLLBACK. Service calls repo.createWithBenchmarks() and knows nothing about transactions |
| Wed | 1.5   | Study: Isolation levels — Repeatable Read (MySQL default) vs Read Committed (PostgreSQL default). What phantom reads and dirty reads are. Write a scenario where wrong isolation level causes a bug in CodePerf |
| Thu | 1.5   | Build DashboardService.getStats(userId) — runs in parallel using Promise.all: total submissions, complexity distribution, last 5 submissions, connected repos count, regression count this week |
| Fri | 1.5   | Build DashboardController + GET /api/v1/dashboard — one API call, 5 parallel DB queries. Returns everything. Confirm it uses Promise.all (not sequential awaits) |
| Sat | 2.0   | Performance test dashboard: Seed 100 submissions with benchmarks. Run dashboard query. EXPLAIN each sub-query. All should use indexes. Fix any that do full table scans |
| Sun | 2.0   | Full Phase 1 architecture audit: Every controller — only HTTP? Every service — only business logic? Every repo — only DB queries? Fix any violations found |

**End of Week 8 Checklist:**
- [ ] Submission creation wrapped in transaction (rollback tested)
- [ ] Dashboard API returning all 5 stats in one call
- [ ] Promise.all used for parallel DB queries (not sequential)
- [ ] Can explain ACID with real CodePerf failure scenarios
- [ ] MySQL default isolation level known and why it matters
- [ ] 4-layer architecture clean across all features built so far

---

### ── WEEK 9 (Apr 27 – May 3) ──────────────────────────────
**Topic: Redis + BullMQ — Sync Processing Is Blocking the API**
**Weekly Goal: Submission pipeline async. API returns in <100ms. Worker processes in background.**
**⚡ NEW TECH: Redis + BullMQ introduced because the project needs it now**

```
WHY THIS WEEK:
Right now POST /submissions processes mock benchmarks synchronously.
The API server is blocked during processing — no other requests handled.
When real C++ benchmarks run (Phase 3), this will block for 30+ seconds.
Fix: job queue. You learn Redis + BullMQ because you feel exactly why you need it.
```

| Day | Hours | Task |
|-----|-------|------|
| Mon | 1.5   | Study: What Redis is, why it is fast (in-memory key-value). Basic commands: GET, SET, EXPIRE, DEL, HSET, HGET. Install Redis locally. Run redis-cli. Difference: cache vs session store vs queue |
| Tue | 1.5   | Study: BullMQ — what a job queue is and why it exists. Job lifecycle: waiting → active → completed → failed. Worker concurrency. Retries on failure. Build a simple "hello world" queue + worker first |
| Wed | 1.5   | Refactor SubmissionService.create() — instead of processing synchronously, add a BullMQ job to the analysis queue and return {submissionId, status: 'queued'} immediately. API now returns in <100ms |
| Thu | 1.5   | Build workers/analysisWorker.ts — picks up job, simulates processing (setTimeout 5 seconds), updates submission status queued → running → completed in DB. Confirm via Postman that status updates correctly |
| Fri | 1.5   | Build: Failed job handling — exponential backoff retry (3 attempts). Dead letter queue for permanently failed jobs. Force a job to fail, confirm it retries 3 times then moves to failed state |
| Sat | 2.0   | Build: Redis cache for GET /submissions/:id. Cache-aside pattern: check cache first → DB on miss → store in cache with 5 min TTL. Test: first call hits DB, second hits cache (confirm in logs) |
| Sun | 2.0   | Deepen: Redis data structures — String, Hash, List, Sorted Set. Where would Sorted Set be used in CodePerf? Answer: challenge mode leaderboard (score = complexity achieved). Write the ZADD/ZRANGE query |

**End of Week 9 Checklist:**
- [ ] POST /submissions returns in <100ms (job queued, not processed)
- [ ] Worker picks up job and processes it in background
- [ ] Submission status updates queued → running → completed
- [ ] Failed jobs retry 3 times then go to dead letter queue
- [ ] GET /submissions/:id cached in Redis with TTL
- [ ] Can explain exactly why sync processing was wrong and how BullMQ fixes it

---

### ── WEEK 10 (May 4 – May 10) ──────────────────────────────
**Topic: WebSockets — Client Needs Live Progress Updates**
**Weekly Goal: Client subscribes to submissionId and receives real-time progress**
**⚡ NEW TECH: WebSockets introduced because polling is not good enough**

```
WHY THIS WEEK:
Submission is now async. Client gets submissionId and waits.
Polling (GET /submissions/:id every second) wastes server resources.
Fix: WebSocket — a persistent connection that pushes updates to the client.
You learn WebSockets because the product experience requires real-time updates.
```

| Day | Hours | Task |
|-----|-------|------|
| Mon | 1.5   | Study: WebSocket protocol — how it differs from HTTP. The handshake. Full-duplex communication. When to use WebSockets vs polling vs Server-Sent Events. Install ws package in backend |
| Tue | 1.5   | Build: WebSocket server on Express. Client connects and sends { type: 'subscribe', submissionId: 'xyz' }. Server registers subscription in memory: Map<submissionId, WebSocket[]> |
| Wed | 1.5   | Build: BullMQ worker emits progress events via notificationService — { type: 'progress', submissionId, progress: 50, status: 'running' }. notificationService looks up subscriptions and sends to each connected client |
| Thu | 1.5   | Build: Completion event — { type: 'completed', submissionId, detectedComplexity: 'O(n log n)', confidence: 0.94 }. Failure event — { type: 'failed', submissionId, error: 'timeout' } |
| Fri | 1.5   | Handle edge cases: Client connects after job already completed — query DB for current status and send immediately. Client disconnects mid-job — remove from subscription map on 'close' event |
| Sat | 2.0   | Test end to end in browser: HTML page with WebSocket connection. Submit code. Watch live progress appear in real time. This should feel like a real product — because it is |
| Sun | 2.0   | Study: WebSocket scaling problem — 2 Node.js servers: client on server A, worker on server B — server A never gets the event. Solution: Redis pub/sub. Understand how it works (full implementation in Phase 5) |

**End of Week 10 Checklist:**
- [ ] Client can subscribe to submissionId over WebSocket
- [ ] Worker sends progress events (0% → 50% → 100%) to subscribers
- [ ] Completed event fires with complexity + confidence
- [ ] Failed event fires with error message
- [ ] Late subscribers immediately receive current status from DB
- [ ] Can explain WebSocket vs polling trade-offs clearly

---

### ── WEEK 11 (May 11 – May 17) ──────────────────────────────
**Topic: GitHub Webhooks — Receiving PR Events**
**Weekly Goal: CodePerf receives GitHub PR events and triggers analysis jobs**
**⚡ NEW TECH: GitHub Webhooks + HMAC signature verification**

```
WHY THIS WEEK:
Users have connected repos. But CodePerf has no way to KNOW when a PR opens.
GitHub needs to push a notification to CodePerf — that is what webhooks do.
Without this, the PR regression detection feature simply cannot exist.
```

| Day | Hours | Task |
|-----|-------|------|
| Mon | 1.5   | Study: How webhooks work — GitHub sends HTTP POST to your server on events. What HMAC-SHA256 signature verification is. WHY it is critical — without it, anyone could send fake PR events to your server |
| Tue | 1.5   | Set up ngrok to expose localhost. Register ngrok URL as webhook in GitHub repo settings. Select events: pull_request (opened, synchronize, closed). Confirm GitHub sends a ping event successfully |
| Wed | 1.5   | Build routes/webhooks.ts: POST /api/v1/webhooks/github. Use raw body parser (NOT json parser — HMAC must be computed on raw body). Verify X-Hub-Signature-256 header against webhookSecret from DB. Reject 401 if mismatch |
| Thu | 1.5   | Build WebhookService.handlePREvent(payload) — extract repoId, PR number, branch name, changed files. Look up connected repository by githubRepoId. If blockOnRegression is false — log and return. If true — add analysis job to BullMQ |
| Fri | 1.5   | Build: Idempotency key on webhook handler — hash of (repoId + prNumber + headSha) stored in Redis with TTL. If same event arrives twice (GitHub retries) — skip processing. This prevents duplicate analysis jobs |
| Sat | 2.0   | Test end to end: Open a real PR on test repo → webhook fires → HMAC verified → BullMQ job created → worker logs "analyzing PR #X". Use ngrok dashboard to inspect raw payload |
| Sun | 2.0   | Study: Webhook reliability — what if your server is down? GitHub retries but only 3 times. What if processing fails? Should you emit a success 200 immediately, then process async? Yes — always do this. Update handler to return 200 immediately then queue the job |

**End of Week 11 Checklist:**
- [ ] Webhook endpoint receiving GitHub PR events
- [ ] HMAC signature verification working (fake requests get 401)
- [ ] PR events triggering BullMQ analysis jobs
- [ ] Idempotency key preventing duplicate processing
- [ ] ngrok working for local development
- [ ] Handler returns 200 immediately, processes async

---

### ── WEEK 12 (May 18 – May 24) ──────────────────────────────
**Topic: GitHub Checks API — Blocking PR Merges on Regression**
**Weekly Goal: CodePerf posts check results on PRs. Regression blocks merge.**
**⚡ NEW TECH: GitHub Checks API + GitHub App authentication**

```
WHY THIS WEEK:
You can detect a regression. But detecting it is useless if the PR still merges.
The GitHub Checks API lets you programmatically pass or fail a PR merge.
This is the core B2B value proposition. Now you build it.
```

| Day | Hours | Task |
|-----|-------|------|
| Mon | 1.5   | Study: GitHub App vs OAuth App. Key difference: GitHub App has installation tokens and can create check runs on PRs. Create a GitHub App in developer settings. Generate private key. Store securely in env |
| Tue | 1.5   | Build GitHubService.generateInstallationToken(installationId) — use App private key to sign JWT, exchange for installation token. This token is used for all GitHub API calls on behalf of an installed repo |
| Wed | 1.5   | Build GitHubService.createCheck(repoFullName, headSha) — POST to /repos/:owner/:repo/check-runs with status: 'in_progress'. Call this the moment a PR webhook arrives and analysis starts |
| Thu | 1.5   | Build: When analysis worker completes — call GitHubService.updateCheck(). No regression → conclusion: 'success', output: table of complexities. Regression detected → conclusion: 'failure', output: before vs after comparison |
| Fri | 1.5   | Build: Post detailed PR comment via GitHub Issues API — table: function name, complexity before, complexity after, change. Developers see this in their PR without leaving GitHub |
| Sat | 2.0   | Test complete PR regression flow: Open PR → check created 'in_progress' → mock analysis runs → check updated pass/fail → comment posted. Watch merge button grey out on failure |
| Sun | 2.0   | Write complete README for backend: env variables needed, MySQL setup, Redis setup, GitHub App setup, how to run migrations, how to run workers, how to test webhooks with ngrok. Someone else must be able to run it |

**End of Week 12 Checklist:**
- [ ] GitHub App created with private key
- [ ] Check created as 'in_progress' when PR webhook arrives
- [ ] Check updated to success/failure after analysis completes
- [ ] PR comment posted with before/after complexity comparison
- [ ] Merge blocked when regression threshold exceeded
- [ ] Complete README written — another person can set it up

---

### ── WEEK 13 (May 25 – May 31) ──────────────────────────────
**Topic: Swagger Docs + Polish + Phase 1 Wrap-Up**
**Weekly Goal: Backend is production-quality. Every endpoint documented. Ready for Phase 2.**
**New Tech This Week: None — documentation and consolidation**

| Day | Hours | Task |
|-----|-------|------|
| Mon | 1.5   | Build: Swagger/OpenAPI docs using swagger-jsdoc + swagger-ui-express. Every endpoint: description, request body, response schema, auth requirement, all error codes. Accessible at /api/docs |
| Tue | 1.5   | Build: Complete Postman collection — all endpoints in order: register → login → create submission → watch status → create repo → open PR → check result. Export collection as JSON and commit it |
| Wed | 1.5   | Interview prep: Write answers to 10 backend questions — async model, JWT vs sessions, OAuth, rate limiting, transactions, N+1, indexes, job queues, WebSockets, webhook security |
| Thu | 1.5   | System design practice: Draw from memory — "Design the CodePerf submission pipeline". Client → API → Queue → Worker → DB → WebSocket back to client. Explain every component and why |
| Fri | 1.5   | Code review your own code: Walk through every file. Are errors handled? Are edge cases covered? Is code readable? Fix the 5 worst issues you find |
| Sat | 2.0   | Mock interview: Ask Claude to interview you on everything built in Phase 1. Answer every question out loud. This is the most important session of Phase 1 |
| Sun | 2.0   | Plan Phase 2: Backend is done. Now you build UI against it. Set up frontend/ folder. Get React + TypeScript + Vite running. Install TanStack Query. Make first API call to your backend from React |

**End of Phase 1 Checklist — You should be able to:**
- [ ] Explain Node.js async model and why it matters for an API server
- [ ] Build complete JWT auth + GitHub OAuth from scratch
- [ ] Write complex SQL with window functions on real schema
- [ ] Explain ACID with real CodePerf failure scenarios
- [ ] Use TypeORM migrations — never sync:true
- [ ] Explain why BullMQ was introduced and what problem it solves
- [ ] Explain why WebSockets were introduced and what problem they solve
- [ ] Explain why HMAC verification on webhooks is not optional
- [ ] Have working backend with 15+ endpoints all tested in Postman
- [ ] Every feature follows controller → service → repo → model cleanly
- [ ] Can explain every single technical decision made in the project

---

## ═══════════════════════════════════════════════════════
## PHASE 2 — React Frontend
## Jun 2026 → Jul 2026 | 8 Weeks | ~96 Hours
## ═══════════════════════════════════════════════════════

### PHASE 2 GOAL
Build the complete CodePerf UI against the already-working backend API.
No backend work in this phase — frontend only. Learn patterns that
product companies actually test in frontend interviews.

### Week-by-Week Plan

| Week | Dates         | Focus                                          | New Tech? |
|------|---------------|------------------------------------------------|-----------|
| 14   | Jun 1–7       | Project setup + folder structure + routing     | Nothing new |
| 15   | Jun 8–14      | TanStack Query + auth pages (login/register)   | ⚡ TanStack Query |
| 16   | Jun 15–21     | Zustand global state + protected routes        | ⚡ Zustand |
| 17   | Jun 22–28     | Monaco Editor + code submission page           | ⚡ Monaco Editor |
| 18   | Jun 29–Jul 5  | WebSocket hook — live benchmark progress in UI | Nothing new |
| 19   | Jul 6–12      | Chart.js complexity curves + submission result | ⚡ Chart.js |
| 20   | Jul 13–19     | Dashboard page + submission history (paginated)| Nothing new |
| 21   | Jul 20–26     | Repository page + polish + Phase 2 wrap-up     | Nothing new |

### Key New Things to Learn in Phase 2
```
TanStack Query — 1 week (Week 15)
  - Why it exists: server state is different from UI state
  - useQuery for GET requests with caching + background refetch
  - useMutation for POST/PUT/DELETE with optimistic updates
  - Why this replaces useEffect + useState for API calls entirely

Zustand — 2-3 days (Week 16)
  - Global state for auth (user object, token)
  - Much simpler than Redux — 20 lines replaces 200
  - persist middleware for token storage

Monaco Editor — 1 week (Week 17)
  - Has many quirks — needs dedicated time
  - Language support, theme, keybindings
  - Controlled vs uncontrolled mode
  - Getting and setting editor value

Chart.js — 3-4 days (Week 19)
  - Line chart for time (ms) vs input size (n) curves
  - Custom tooltips showing complexity at each point
  - Responsive sizing for dashboard

React Hook Form + Zod — 2 days (Week 15)
  - Form validation in React the right way
  - Zod schema validation reused from backend (same schema)
```

---

### ── WEEK 14 (Jun 1 – Jun 7) ──────────────────────────────
**Topic: Project Setup — Folder Structure + Routing + API Client**
**Weekly Goal: React app running, talking to the live backend, with the folder structure you'll use for the rest of Phase 2**
**New Tech This Week: None — Vite, React Router, Axios are familiar**

| Day | Hours | Task |
|-----|-------|------|
| Mon | 1.5   | Set up frontend/ folder. `npm create vite@latest` with React + TypeScript template. Install: react-router-dom, axios. Get the dev server running. Confirm hot reload works |
| Tue | 1.5   | Build the feature-based folder structure under src/: app/ (router, providers), features/ (auth, submissions, dashboard, repositories), shared/ (api client, components, hooks, types), styles/. This mirrors backend vocabulary — controllers map to pages, services map to hooks |
| Wed | 1.5   | Build shared/api/client.ts — single Axios instance with baseURL pointing to your backend, withCredentials if needed. Add a request interceptor stub (token attached later in Week 16) and a response interceptor that unwraps your backend's {success, data, message} envelope |
| Thu | 1.5   | Build app/router.tsx using React Router v6 createBrowserRouter. Define routes: /login, /register, /dashboard, /submissions, /submissions/:id, /repositories. Wrap with a root Layout component (header + nav placeholder) |
| Fri | 1.5   | Build shared/components/ — Button, Input, Card, Spinner, ErrorMessage as small reusable presentational components. No business logic in these — pure props in, JSX out. This is the component vocabulary you'll reuse everywhere |
| Sat | 2.0   | Wire a real test call: from a temporary page, call GET /api/v1/dashboard (or any existing endpoint) directly with the Axios client. Confirm CORS is configured correctly on the backend. Fix CORS errors if they appear |
| Sun | 2.0   | Study: Why feature-based (vertical slice) folder structure scales better than type-based (all components/, all hooks/) as an app grows. Write 3 sentences on this — it's a common frontend architecture interview question |

**End of Week 14 Checklist:**
- [ ] Vite + React + TypeScript app running locally
- [ ] Feature-based folder structure created (app/, features/, shared/, styles/)
- [ ] Axios client configured with response envelope unwrapping
- [ ] Router set up with all top-level routes (even if pages are empty stubs)
- [ ] Shared component library started (Button, Input, Card, Spinner)
- [ ] Confirmed a real API call to your backend succeeds (CORS working)
- [ ] Can explain why feature-based structure was chosen over type-based

---

### ── WEEK 15 (Jun 8 – Jun 14) ──────────────────────────────
**Topic: TanStack Query — Auth Pages (Login / Register)**
**Weekly Goal: Working login and register pages backed by TanStack Query, not useEffect**
**⚡ NEW TECH: TanStack Query introduced because manual useEffect + useState fetching does not scale**

```
WHY THIS WEEK:
You could fetch with useEffect + useState like you've done before.
But that means manually handling loading, error, caching, and refetching
for every single API call across the whole app — 20+ times over.
Fix: TanStack Query. It treats server data as its own kind of state,
separate from UI state, and handles caching/loading/error for you.
```

| Day | Hours | Task |
|-----|-------|------|
| Mon | 1.5   | Study: Why "server state" is fundamentally different from "client state" (it's owned by the server, can go stale, needs caching/refetching/dedup). Install @tanstack/react-query. Set up QueryClientProvider at the app root |
| Tue | 1.5   | Build features/auth/api/authApi.ts — plain functions calling your backend: login(dto), register(dto), getMe(). Build features/auth/hooks/useLogin.ts and useRegister.ts using useMutation. No React Hook Form yet — wire with plain controlled inputs first |
| Wed | 1.5   | Install react-hook-form + @hookform/resolvers + zod. Build features/auth/schemas.ts reusing the same validation shape as your backend's Zod schemas. Build LoginForm using useForm + zodResolver |
| Thu | 1.5   | Build RegisterForm the same way. Wire both forms' onSubmit to useLogin()/useRegister() mutations. Show field-level validation errors inline. Show a loading spinner on the submit button while mutation is pending |
| Fri | 1.5   | Build error handling: useMutation's onError — show backend error message (e.g. "email already exists") in a banner above the form, not just console.log. Confirm wrong password / duplicate email show the correct message |
| Sat | 2.0   | Build useMe() with useQuery — calls GET /api/v1/auth/me. Test full flow: register → redirect to login → login → confirm useMe() returns the correct user. Use React Query Devtools to inspect cache state live |
| Sun | 2.0   | Deepen understanding: Open React Query Devtools, trigger the same query twice, observe caching/dedup. Write down: what is staleTime vs cacheTime/gcTime, and why useQuery refetches on window focus by default. These are common frontend interview questions |

**End of Week 15 Checklist:**
- [ ] Login page working — calls real backend, shows real errors
- [ ] Register page working — same pattern
- [ ] React Hook Form + Zod validating both forms client-side
- [ ] useMutation handling loading/error/success states for both
- [ ] useMe() (useQuery) correctly fetching current user
- [ ] React Query Devtools used to inspect cache behavior
- [ ] Can explain staleTime vs gcTime and why TanStack Query replaces useEffect fetching

---

### ── WEEK 16 (Jun 15 – Jun 21) ──────────────────────────────
**Topic: Zustand Global State — Protected Routes**
**Weekly Goal: Auth token persisted globally, protected routes redirect unauthenticated users**
**⚡ NEW TECH: Zustand introduced because auth state needs to be readable from anywhere in the app**

```
WHY THIS WEEK:
The logged-in user and JWT token are needed in many places at once —
the Axios interceptor, the nav bar, every protected page, the logout button.
Passing this through props everywhere is unworkable.
Fix: Zustand. A tiny global store, much simpler than Redux for this size app.
```

| Day | Hours | Task |
|-----|-------|------|
| Mon | 1.5   | Study: Why prop-drilling auth state breaks down past 2-3 levels. Compare options: Context API vs Redux vs Zustand — why Zustand fits a project this size (no boilerplate, no providers wrapping the whole tree). Install zustand |
| Tue | 1.5   | Build shared/store/authStore.ts — create() with state: {user, accessToken, refreshToken} and actions: setAuth(), clearAuth(). Use the persist middleware so the token survives a page refresh (stored in localStorage under the hood by Zustand itself, not manually) |
| Wed | 1.5   | Wire authStore into your Login/Register mutations' onSuccess — call setAuth(tokens, user) on success, then navigate to /dashboard. Update the Axios request interceptor (the stub from Week 14) to read the token from authStore and attach Authorization: Bearer header |
| Thu | 1.5   | Build the response interceptor's 401 handling: on 401, call your backend's refresh endpoint once, retry the original request with the new token; if refresh also fails, call authStore.clearAuth() and redirect to /login. This mirrors the refresh-rotation logic you built on the backend in Week 2 |
| Fri | 1.5   | Build app/ProtectedRoute.tsx — a wrapper component that checks authStore for a token; if absent, <Navigate to="/login" />; if present, render children/Outlet. Apply it to /dashboard, /submissions, /repositories routes |
| Sat | 2.0   | Build a simple Nav bar that reads user.name from authStore and shows a Logout button. Logout calls authStore.clearAuth() + navigates to /login. Test the full loop: login → refresh page (still logged in) → logout → confirm protected routes redirect |
| Sun | 2.0   | Edge case test: manually expire/corrupt the access token in localStorage, hit a protected page, confirm the interceptor's refresh-then-retry logic kicks in correctly. If refresh token is also invalid, confirm clean redirect to /login with no infinite loop |

**End of Week 16 Checklist:**
- [ ] Zustand authStore created with persist middleware
- [ ] Axios interceptor attaching token from store automatically
- [ ] 401 → refresh → retry logic working (mirrors backend Week 2 rotation)
- [ ] ProtectedRoute redirecting unauthenticated users correctly
- [ ] Nav bar + logout working end to end
- [ ] Page refresh keeps user logged in (persist middleware confirmed)
- [ ] Can explain why Zustand was chosen over Context API or Redux here

---

### ── WEEK 17 (Jun 22 – Jun 28) ──────────────────────────────
**Topic: Monaco Editor — Code Submission Page**
**Weekly Goal: Users can write/paste code in a real code editor and submit it for analysis**
**⚡ NEW TECH: Monaco Editor — has real quirks, needs dedicated time**

```
WHY THIS WEEK:
A <textarea> for code input would work but feels unprofessional and lacks
syntax highlighting — a dealbreaker for a "developer tool" product.
Fix: Monaco Editor — the actual engine behind VS Code. This is what makes
CodePerf's submission page look and feel like a real product.
```

| Day | Hours | Task |
|-----|-------|------|
| Mon | 1.5   | Study: Monaco Editor basics via @monaco-editor/react wrapper (don't fight raw monaco-editor APIs directly). Install it. Render a basic editor with a hardcoded language + theme. Understand controlled mode: value + onChange props |
| Tue | 1.5   | Build features/submissions/components/CodeEditor.tsx wrapping Monaco — props: value, onChange, language. Add a language dropdown (cpp/python/java/javascript) that updates the editor's language prop dynamically. Confirm syntax highlighting switches correctly |
| Wed | 1.5   | Build features/submissions/pages/NewSubmissionPage.tsx — CodeEditor + language dropdown + Submit button. Local component state for code + language (this is UI state, not server state — no TanStack Query needed yet) |
| Thu | 1.5   | Build features/submissions/hooks/useCreateSubmission.ts with useMutation calling POST /api/v1/submissions. On success, navigate to /submissions/:id using the returned submissionId. Show validation error if code is empty |
| Fri | 1.5   | Polish editor UX: set theme to vs-dark, enable minimap: false for a cleaner look, set a sensible default font size, add a "Clear" button. Handle the editor's loading state (Monaco's JS bundle loads async — show a spinner until ready) |
| Sat | 2.0   | Test end to end with your real backend: submit code in each supported language, confirm POST /submissions fires correctly and you're redirected to the (still placeholder) submission detail page with the correct submissionId in the URL |
| Sun | 2.0   | Study Monaco quirks worth knowing for interviews: why it's loaded via a Web Worker, controlled vs uncontrolled editor pitfalls (cursor jumping if value updates wrong), and how it differs from a plain CodeMirror/textarea solution |

**End of Week 17 Checklist:**
- [ ] Monaco Editor rendering with working syntax highlighting
- [ ] Language dropdown switching highlighting correctly
- [ ] Submission form posting real code to the backend
- [ ] useCreateSubmission (useMutation) handling loading/error/success
- [ ] Redirect to /submissions/:id with correct ID after submit
- [ ] Editor polished — dark theme, clean UX, async load handled
- [ ] Can explain controlled vs uncontrolled Monaco usage and its pitfalls

---

### ── WEEK 18 (Jun 29 – Jul 5) ──────────────────────────────
**Topic: WebSocket Hook — Live Benchmark Progress in the UI**
**Weekly Goal: Submission detail page shows live progress (0% → 100%) using the backend's existing WebSocket server**
**New Tech This Week: None — your backend WebSocket server already exists from Week 10; this is the client side**

```
WHY THIS WEEK:
Right now the submission detail page is a placeholder. The backend already
pushes progress/completed/failed events over WebSocket (built in Week 10).
The frontend needs to subscribe and react to them — this is what makes
the product feel alive instead of a static form.
```

| Day | Hours | Task |
|-----|-------|------|
| Mon | 1.5   | Study: Native browser WebSocket API — new WebSocket(url), onopen, onmessage, onclose, onerror. Decide: raw WebSocket vs a small wrapper hook. Plan: build a reusable useWebSocket hook, not a one-off |
| Tue | 1.5   | Build shared/hooks/useWebSocket.ts — connects on mount, exposes sendMessage() and lastMessage (parsed JSON), handles cleanup (ws.close()) on unmount via useEffect's cleanup function. Reconnect-on-close is a stretch goal, not required this week |
| Wed | 1.5   | Build features/submissions/hooks/useSubmissionProgress.ts — uses useWebSocket, sends {type: 'subscribe', submissionId} on connect, and derives {progress, status} state from incoming messages (progress/completed/failed types from Week 10's backend) |
| Thu | 1.5   | Build features/submissions/pages/SubmissionDetailPage.tsx — shows a progress bar driven by useSubmissionProgress while status is 'running', and switches to showing results once status becomes 'completed' (results UI itself comes in Week 19 with charts) |
| Fri | 1.5   | Handle the "late subscriber" edge case on the frontend: if the page loads after the job already completed, useQuery (GET /submissions/:id) should immediately show the final state instead of waiting forever on a progress bar that will never update |
| Sat | 2.0   | Test end to end with the real backend: submit code (Week 17 page) → land on detail page → watch progress bar move live as the backend worker processes the (still-mocked, from Phase 1) benchmark job → see completed state appear |
| Sun | 2.0   | Study: why this should NOT be done with TanStack Query polling instead (you already know why from backend Week 10 — connect it explicitly to the frontend implementation you just built). Write 3 sentences comparing the two approaches |

**End of Week 18 Checklist:**
- [ ] Reusable useWebSocket hook built and working
- [ ] useSubmissionProgress correctly deriving progress/status from messages
- [ ] Submission detail page shows live progress bar during processing
- [ ] Completed state correctly replaces the progress bar
- [ ] Late-subscriber edge case handled (loads completed state if already done)
- [ ] Can explain why WebSocket was used here instead of TanStack Query polling

---

### ── WEEK 19 (Jul 6 – Jul 12) ──────────────────────────────
**Topic: Chart.js — Complexity Curves on the Submission Result**
**Weekly Goal: Submission detail page shows a real time-vs-input-size chart once analysis completes**
**⚡ NEW TECH: Chart.js introduced because a table of numbers doesn't communicate "O(n²) regression" — a curve does**

```
WHY THIS WEEK:
The backend returns benchmark results as raw numbers: input size vs
execution time, for n = 10 to n = 1M. A table of these numbers is correct
but useless to a human reviewing a PR. A line chart makes the curve shape
(and therefore the complexity) visually obvious in one glance.
```

| Day | Hours | Task |
|-----|-------|------|
| Mon | 1.5   | Study: Chart.js core concepts — Chart instance, datasets, scales (linear vs logarithmic axes — log scale matters here since input sizes span 10 to 1M). Install chart.js + react-chartjs-2. Render one hardcoded line chart to confirm setup works |
| Tue | 1.5   | Build features/submissions/components/ComplexityChart.tsx — takes benchmarkResults (inputSize, executionTimeMs pairs) as props, renders a line chart with input size on x-axis (log scale) and time on y-axis |
| Wed | 1.5   | Build custom tooltips: on hover, show "n=100,000 → 42ms" instead of Chart.js's raw default tooltip. Add a horizontal reference concept — visually distinguishing O(n) (straight-ish line on log-log) from O(n²) (steep curve) |
| Thu | 1.5   | Wire ComplexityChart into SubmissionDetailPage — once status is 'completed' (from Week 18's WebSocket state or the useQuery refetch), fetch full results via GET /submissions/:id and render the chart alongside detectedComplexity + confidence |
| Fri | 1.5   | Build a small ComplexityBadge component — colored badge (green/yellow/red) based on detectedComplexity, matching the heatmap color scheme planned for later phases. Show this next to the chart and on submission history rows (used again in Week 20) |
| Sat | 2.0   | Make the chart responsive — test at mobile width and desktop width, confirm it resizes correctly (Chart.js's responsive: true + maintainAspectRatio: false pattern). Test with submissions of different complexities to confirm curve shapes look visually distinct |
| Sun | 2.0   | Study: why a logarithmic x-axis is the right choice when input sizes span 6 orders of magnitude (10 to 1,000,000) — what the chart would look like (and why it'd be useless) on a linear axis instead. Write this down — it's a good talking point in interviews |

**End of Week 19 Checklist:**
- [ ] Chart.js rendering real benchmark data as a line chart
- [ ] Log-scale x-axis used correctly for input size
- [ ] Custom tooltips showing readable n → time labels
- [ ] ComplexityBadge component built and reused
- [ ] Chart responsive on mobile and desktop
- [ ] Can explain why log scale was necessary for this specific chart

---

### ── WEEK 20 (Jul 13 – Jul 19) ──────────────────────────────
**Topic: Dashboard Page + Submission History (Paginated)**
**Weekly Goal: Dashboard shows real stats from the backend; submission history is paginated and filterable**
**New Tech This Week: None — TanStack Query patterns you already know, applied to two more pages**

| Day | Hours | Task |
|-----|-------|------|
| Mon | 1.5   | Build features/dashboard/hooks/useDashboardStats.ts with useQuery calling GET /api/v1/dashboard (built on the backend in Week 8). Build DashboardPage with stat cards: total submissions, complexity distribution, regression count this week |
| Tue | 1.5   | Build a complexity distribution chart on the dashboard (reuse Chart.js from Week 19 — this time a bar or pie chart, not a line chart) showing count of O(n), O(n log n), O(n²) submissions |
| Wed | 1.5   | Build features/submissions/hooks/useSubmissionsList.ts — useQuery calling GET /submissions with page/limit/filters as query params, matching the backend pagination shape from Week 5. Keep filters (language, complexity, date range) as local UI state |
| Thu | 1.5   | Build SubmissionHistoryPage — table/list of submissions using ComplexityBadge (Week 19) per row, pagination controls (prev/next + page numbers), and filter dropdowns wired to useSubmissionsList's params |
| Fri | 1.5   | Wire TanStack Query's keepPreviousData (or placeholderData in v5) so the table doesn't flash empty/loading when changing pages — old data stays visible while the new page loads in the background. This is a real TanStack Query interview topic |
| Sat | 2.0   | Test end to end with real data: create several submissions across languages/complexities, confirm dashboard stats match, confirm history page filters + pagination return correct results matching what Postman showed in backend Week 5 |
| Sun | 2.0   | Polish: loading skeletons for dashboard cards and history table (instead of blank screens), empty states ("No submissions yet — create your first one") with a CTA button linking to /submissions/new |

**End of Week 20 Checklist:**
- [ ] Dashboard page showing real stats from the backend
- [ ] Complexity distribution chart on dashboard
- [ ] Submission history paginated and filterable, matching backend behavior
- [ ] keepPreviousData/placeholderData preventing pagination flicker
- [ ] Loading skeletons and empty states implemented
- [ ] Can explain why placeholderData matters for pagination UX

---

### ── WEEK 21 (Jul 20 – Jul 26) ──────────────────────────────
**Topic: Repository Page + Polish + Phase 2 Wrap-Up**
**Weekly Goal: Repository management page complete. Frontend is demo-ready. Ready for Phase 3.**
**New Tech This Week: None — consolidation and polish**

| Day | Hours | Task |
|-----|-------|------|
| Mon | 1.5   | Build features/repositories/hooks (useRepositories list query, useConnectRepository mutation, useDeleteRepository mutation) calling the backend endpoints from Week 7. Build RepositoryListPage showing connected repos as cards |
| Tue | 1.5   | Build a "Connect Repository" form/modal — POST to /repositories, show the generated webhookSecret once with a copy-to-clipboard button (mirrors the backend logic from Week 7 where this secret is generated) |
| Wed | 1.5   | Build per-repo settings (PUT) — toggle blockOnRegression, edit regressionThresholdX — and a Disconnect (DELETE) button with a confirmation dialog. Reuse shared/components for the dialog rather than building a one-off |
| Thu | 1.5   | Global error handling pass: confirm every page has a sensible error state if its query/mutation fails (not just a blank screen). Add a global toast/notification system (simple shared/components/Toast.tsx) for success/error feedback across the app |
| Fri | 1.5   | Full responsive + accessibility pass: test every page at mobile width, fix any broken layouts. Confirm forms have proper labels, buttons have accessible text, and focus states are visible (keyboard navigation works) |
| Sat | 2.0   | Full end-to-end walkthrough as if demoing to an interviewer: register → login → connect a repo → submit code → watch live progress → see chart + complexity result → check dashboard → check history. Fix anything that breaks or feels rough |
| Sun | 2.0   | Mock interview: ask Claude to interview you on Phase 2 — TanStack Query vs useEffect, why Zustand here, Monaco's controlled mode, why log-scale charting, why WebSocket over polling, pagination UX with placeholderData. Plan Phase 3: re-read the C++ Judge Engine section, confirm you're ready to start Week 22 |

**End of Phase 2 Checklist — You should be able to:**
- [ ] Explain why TanStack Query replaces manual useEffect data fetching
- [ ] Explain staleTime vs gcTime and cache invalidation patterns
- [ ] Explain why Zustand was chosen here over Context API or Redux
- [ ] Explain the Axios interceptor's token-refresh-and-retry flow in detail
- [ ] Explain Monaco Editor's controlled mode and common pitfalls
- [ ] Explain why a log-scale axis was necessary for the complexity chart
- [ ] Explain why WebSockets (not polling) drive the live progress UI
- [ ] Have a fully working frontend: auth, submission flow, live progress, charts, dashboard, history, repository management
- [ ] Can demo the entire CodePerf flow end to end without it breaking
- [ ] Can explain every single technical decision made in Phase 2

---

## ═══════════════════════════════════════════════════════
## PHASE 3 — C++ Judge Engine
## Aug 2026 → Sep 2026 | 8 Weeks | ~96 Hours
## ═══════════════════════════════════════════════════════

### PHASE 3 GOAL
Replace the mock benchmark data with a real sandboxed execution engine.
This is the core differentiator of CodePerf — what no other portfolio
project has. After this phase, real user code is compiled, run at scale,
timed precisely, and classified by complexity automatically.

### Week-by-Week Plan

| Week | Dates         | Focus                                          | New Tech? |
|------|---------------|------------------------------------------------|-----------|
| 22   | Aug 3–9       | C++ OOP — classes, virtual, RAII, smart ptrs   | ⚡ Modern C++ (C++17) |
| 23   | Aug 10–16     | InputGenerator class — typed inputs at scale   | C++ applied |
| 24   | Aug 17–23     | Linux syscalls — fork, exec, waitpid, pipes    | ⚡ Linux syscalls |
| 25   | Aug 24–30     | Runner class + TimingCollector                 | C++ applied |
| 26   | Aug 31–Sep 6  | seccomp sandbox — whitelist safe syscalls      | ⚡ seccomp |
| 27   | Sep 7–13      | CurveAnalyzer — least-squares fitting          | C++ applied |
| 28   | Sep 14–20     | ComplexityClassifier — pick best fit curve     | C++ applied |
| 29   | Sep 21–27     | Connect C++ binary to Node.js via child_process | Everything connects |

### Key Things to Learn in Phase 3
```
Week 22: Modern C++ (C++17)
  - Inheritance, virtual functions, abstract classes (pure virtual = 0)
  - unique_ptr, shared_ptr — RAII pattern, no manual delete ever
  - std::vector, std::map, std::unordered_map
  - Move semantics basics (why && exists)

Week 24: Linux Systems Programming
  - fork() — create child process (copy of parent)
  - execve() — replace child process image with user's compiled binary
  - waitpid() — parent waits for child, collects exit status
  - SIGALRM — timer signal: if child runs longer than N seconds → kill it
  - setrlimit() — hard memory ceiling: child cannot allocate beyond X MB
  - Pipes — bidirectional stdin/stdout between parent and child process

Week 26: seccomp (Secure Computing Mode)
  - What system calls are at the Linux kernel level
  - libseccomp library
  - Whitelist ONLY safe syscalls: read, write, mmap, mprotect, exit
  - Block: network syscalls (connect, socket), filesystem (open, unlink)
  - Block: fork (prevents fork bombs from user code)

Week 27: Math for Complexity Classification
  - Least squares curve fitting — fit (n, time) pairs to candidate curves
  - Candidates: O(1), O(log n), O(n), O(n log n), O(n²), O(2^n)
  - Pick candidate with lowest sum of squared residuals
  - Output: { complexity: "O(n log n)", confidence: 0.94 }
  - No deep linear algebra needed — just implement the formula
```

---

## ═══════════════════════════════════════════════════════
## PHASE 4 — RAG + AI Integration
## Oct 2026 → Nov 2026 | 8 Weeks | ~96 Hours
## ═══════════════════════════════════════════════════════

### PHASE 4 GOAL
Add the AI layer. Start with MySQL → PostgreSQL migration (2-3 days) because
pgvector only works on PostgreSQL. Then build the RAG pipeline that turns raw
complexity results into actionable, grounded AI code reviews.
The /submissions/:id/review endpoint that returned a placeholder in Phase 1
will now return a real AI-powered response.

### Week-by-Week Plan

| Week | Dates         | Focus                                          | New Tech? |
|------|---------------|------------------------------------------------|-----------|
| 30   | Oct 5–11      | MySQL → PostgreSQL migration + pgvector setup  | ⚡ PostgreSQL + pgvector |
| 31   | Oct 12–18     | Python FastAPI basics + ai-service/ structure  | ⚡ Python FastAPI |
| 32   | Oct 19–25     | Embedder module — OpenAI embeddings API        | ⚡ Embeddings |
| 33   | Oct 26–Nov 1  | Knowledge base — 100 algorithm patterns        | RAG applied |
| 34   | Nov 2–8       | Retriever module — pgvector cosine search      | RAG applied |
| 35   | Nov 9–15      | Reviewer module — prompt engineering + LLM     | ⚡ Prompt engineering |
| 36   | Nov 16–22     | Connect ai-service to Node.js backend          | Everything connects |
| 37   | Nov 23–29     | AI Review UI in React — side-by-side diff      | React applied |

### MySQL → PostgreSQL Migration (Week 30 — 2-3 days)
```
Why: pgvector only exists in PostgreSQL — no workaround.
Effort: 2-3 days. Here is exactly why it is easy:

What changes (only these 2 layers):
  - Model (Entities):
    - AUTO_INCREMENT → remove (TypeORM handles UUID/SERIAL for PostgreSQL)
    - TINYINT boolean → boolean type
    - JSON column → JSONB column (better performance in PostgreSQL)
  - TypeORM config: type: "mysql" → type: "postgres"
  - Install: npm install pg, remove mysql2

What does NOT change (DB-agnostic layers):
  - All Controllers — zero changes
  - All Services — zero changes
  - All BullMQ workers — zero changes
  - All Express middleware — zero changes
  - All business logic — zero changes

Steps:
  1. npm install pg && npm uninstall mysql2
  2. Update TypeORM DataSource config
  3. Update entity data types where needed
  4. Re-run all migrations on fresh PostgreSQL instance
  5. Test every endpoint in Postman — behavior identical
  6. CREATE EXTENSION IF NOT EXISTS vector
  7. Add embedding column (vector(1536)) to AlgorithmPattern entity
  8. Phase 4 RAG work can now begin
```

### Key Things to Learn in Phase 4
```
Week 31: Python FastAPI
  - FastAPI is Express but in Python — same concepts
  - Routes, request models (Pydantic), response models
  - Calling OpenAI API from Python
  - Connecting to PostgreSQL using asyncpg

Week 32: Embeddings
  - What embeddings are: text → vector of 1536 numbers
  - Why semantically similar text has similar vectors (cosine similarity)
  - OpenAI text-embedding-ada-002 API — input: string, output: number[]
  - Store result in pgvector column

Week 33-34: RAG Pipeline
  - Embedder: bottleneck context text → 1536-dim vector
  - Retriever: vector → pgvector cosine search → top 5 algorithm patterns
  - pgvector query: SELECT ... ORDER BY embedding <=> $1::vector LIMIT 5
  - IVFFlat index for approximate nearest neighbor (faster at scale)

Week 35: Prompt Engineering
  - System: "You are a performance engineering expert..."
  - Context: insert 5 retrieved algorithm patterns
  - User: "Here is slow code + detected complexity. Explain and fix."
  - Output: explanation + refactored code + new complexity estimate
  - Key: retrieved context prevents hallucination (grounded response)
```

---

## ═══════════════════════════════════════════════════════
## PHASE 5 — Polish + Production + Interview Prep
## Dec 2026 → Feb 2027 | 13 Weeks | ~144 Hours
## ═══════════════════════════════════════════════════════

### PHASE 5 GOAL
Take the working product to polished, demo-ready state.
Prepare thoroughly for interviews by drilling system design, practicing
live demos, and studying the exact questions 8-10 LPA companies ask.

### Week-by-Week Plan

| Week | Dates         | Focus                                          |
|------|---------------|------------------------------------------------|
| 38   | Dec 1–7       | Full project audit — bugs, edge cases, errors  |
| 39   | Dec 8–14      | Codebase heatmap feature                       |
| 40   | Dec 15–21     | Team dashboard — complexity trends per sprint  |
| 41   | Dec 22–28     | Load testing with k6 — find bottlenecks        |
| 42   | Dec 29–Jan 4  | Redis caching — heavy query optimization       |
| 43   | Jan 5–11      | System design documentation + ADRs             |
| 44   | Jan 12–18     | Architecture diagrams + complete API docs      |
| 45   | Jan 19–25     | Mock interviews — backend deep dive            |
| 46   | Jan 26–Feb 1  | Mock interviews — system design rounds         |
| 47   | Feb 2–8       | Mock interviews — project walkthrough          |
| 48   | Feb 9–15      | Mock interviews — DSA rounds                   |
| 49   | Feb 16–22     | Resume finalization + LinkedIn update          |
| 50   | Feb 23–28     | Job applications start                         |

### Key Things to Do in Phase 5
```
Week 38: Full Audit
  - Every endpoint tested with edge cases
  - Error messages are clear and helpful (not "Internal Server Error")
  - No 500 errors from unhandled cases
  - Logs are clean and useful

Week 39-40: B2B Features
  - Heatmap: scan entire repo, color-code by complexity per function
    Green = O(n) or better, Yellow = O(n log n), Red = O(n²) or worse
  - Team dashboard: track O(n²) functions per sprint over time
  - These are what enterprise customers pay for

Week 41-42: Performance
  - Load test with k6: 100 concurrent submissions
  - Find bottlenecks (slow queries, unindexed joins)
  - Redis cache most expensive DB queries (dashboard stats, patterns)
  - Connection pooling for PostgreSQL

Week 43-44: Documentation (Critical for Interviews)
  - Architecture diagram on draw.io
  - ADRs: why BullMQ, why C++, why MySQL then PostgreSQL, why RAG
  - Database schema diagram
  - Swagger docs complete and accurate
  - This is what you show in every interview

Week 45-49: Interview Prep
  - System design: code execution system (sandbox, queues, IPC)
  - System design: webhook reliability (idempotency, retries, HMAC)
  - System design: RAG retrieval (embeddings, vector DB, prompt construction)
  - Live demo of CodePerf running end to end
  - Explain every technical decision confidently
```

---

## 🎯 Target Outcome by Feb 2027

### Project Status (70% Complete)
```
✅ Complete auth system (JWT + GitHub OAuth)
✅ Complete submission pipeline (API + Queue + WebSocket)
✅ Complete database schema with migrations
✅ GitHub webhook + PR blocking (Checks API)
✅ React frontend with Monaco + Charts
✅ C++ execution engine (runs code, measures time)
✅ Complexity classifier (O(n), O(n log n), O(n²))
✅ MySQL → PostgreSQL migration completed
✅ RAG pipeline with 100 algorithm patterns
✅ AI code reviewer showing suggestions
✅ Basic codebase heatmap

⏳ Not done (30% remaining for future)
  - Full seccomp sandbox (partial sandbox built)
  - Enterprise multi-tenant features
  - Full sprint tracking
  - Production Docker + CI/CD
  - Adversarial test generator
```

### Interview Readiness
```
Can confidently answer:
✅ Node.js async model — event loop, why it matters for API servers
✅ JWT + OAuth flow end to end
✅ SQL: window functions, indexes, ACID, N+1 (MySQL + PostgreSQL)
✅ TypeORM migrations, QueryBuilder, transactions
✅ 4-layer architecture — why controller/service/repo/model separation matters
✅ Why TypeORM makes MySQL→PostgreSQL migration easy (only repo+model change)
✅ Why BullMQ was introduced — sync processing was blocking the API
✅ Why WebSockets were introduced — polling was not good enough
✅ Why HMAC verification on webhooks is not optional
✅ System design: code execution system (sandboxing, queues, IPC)
✅ System design: webhook reliability system
✅ System design: RAG/retrieval system
✅ Can demo CodePerf live in every interview
✅ Can explain every single technical decision made
```

---

## 📋 How to Use This File With Claude

At the start of every new chat, paste this file and say:

> "I am currently on [Phase X, Week Y].
>  Today I want to work on [topic or just say 'give me today's task'].
>  Help me continue building CodePerf."

Claude will know exactly where you are, what you have already built,
what comes next, and how to help you for that specific day.

---

## 🔄 Update Log (Update this every day yourself)

| day  |    Status   | Notes                      |
|------|-------------|----------------------------|
| 1    | done        |   basic server setup  done |
| 2    | Not started |                            |
| 3    | Not started |                            |
...
(fill this as you progress)
