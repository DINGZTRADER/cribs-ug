Here is the comprehensive `audit.md` file covering every stage of the build process. This document serves as a Quality Assurance (QA) checklist to ensure the architecture, schema, and logic align strictly with the "Uganda Direct" specifications provided in the sources.

```markdown
# Project Audit & Execution Checklist: Uganda Direct Rental Platform

This document outlines the mandatory audit points for each phase of development. Use this to verify that the implementation matches the defined architecture, security standards, and business logic.

---

## 🏛 PHASE 1: Architecture & Infrastructure Setup

**Goal:** Establish a resilient foundation compatible with low-end devices and geospatial requirements.

### 1.1 Docker & Environment
- [ ] **PostGIS Verification:** Ensure the Docker image is `postgis/postgis:15-3.3` (or similar), not standard `postgres`.
    - *Audit Command:* `SELECT PostGIS_Version();` inside the DB container.
- [ ] **Environment Variables:** Verify `.env` includes:
    - `DATABASE_URL` (with schema=public)
    - `JWT_SECRET` (High entropy)
    - `MTN_API_KEY` & `AIRTEL_API_KEY` (Stubs for dev)
    - `SUPABASE_URL` & `SUPABASE_KEY` (If using managed services)

### 1.2 Monorepo Structure
- [ ] **Workspace Isolation:** Verify `apps/api` and `apps/mobile` are distinct workspaces.
- [ ] **Shared Packages:** Ensure `packages/database` and `packages/types` exist.
    - *Risk:* If types are duplicated manually in Frontend/Backend, the API contract will break.

### 1.3 Database Initialization
- [ ] **Extensions:** Verify `CREATE EXTENSION IF NOT EXISTS "postgis";` and `"pgcrypto";` are in the initial migration.
- [ ] **Schema V2 Match:** Confirm table names use snake_case (`tenant_profiles`, `webhook_logs`, etc.) matching Source.

---

## 🔐 PHASE 2: Authentication & User Management

**Goal:** Secure, phone-based identity verification with role segregation.

### 2.1 Schema & Data Integrity
- [ ] **Phone Uniqueness:** Verify `phone` column in `users` table has a `UNIQUE` constraint.
- [ ] **Role Enforcement:** Ensure `role` is an ENUM or CHECK constraint: `CHECK (role IN ('tenant','landlord','admin'))`.
- [ ] **Cascade Deletes:** Verify `ON DELETE CASCADE` is set on `tenant_profiles` and `landlord_profiles`.

### 2.2 Auth Logic (NestJS)
- [ ] **Transaction Safety:** Registration *must* use `prisma.$transaction`.
    - *Audit:* If User is created but Profile fails, both must roll back.
- [ ] **Password Hashing:** Confirm `bcrypt` implementation with salt rounds >= 10.
- [ ] **JWT Payload:** Token must contain `sub` (UUID) and `role` (string) to avoid DB lookups on every request.

### 2.3 Row Level Security (RLS)
- [ ] **Profile Privacy:**
    - Policy: Users can only edit *their own* rows.
    - **CRITICAL FIX:** Create `public_profiles` VIEW (SQL) to allow searching landlords without exposing their private phone numbers/IDs.

---

## 🏠 PHASE 3: Properties & Supply Module

**Goal:** Enable verified supply accumulation (The "Supply-First Strategy").

### 3.1 Schema & Storage
- [ ] **Composite Indexes:** Verify index `idx_properties_search` exists on `(status, district, rent_amount)`.
- [ ] **Image Storage:** Schema must support two URLs per image: `thumbnail_url` (compressed) and `highres_url` (original).
- [ ] **Landlord Representative Fix:** Ensure `property_managers` table exists (if implementing manager logic) or RLS allows "Landlord manage own properties".

### 3.2 Logic & Validation
- [ ] **Geospatial Data:** Property creation must save `location` as `GEOGRAPHY(POINT)` for PostGIS, in addition to `latitude`/`longitude` decimals for simple UI rendering.
- [ ] **Verification Logic:** Landlords with `verified_owner = false` in `landlord_profiles` should not display the "Verified Badge" on the frontend.

---

## 🔎 PHASE 4: Search & Discovery (Freemium Hook)

**Goal:** Prove value to Tenants before asking for payment.

### 4.1 Search Performance
- [ ] **PostGIS Query:** The `SearchService` must use `ST_DWithin` for radius search, not JavaScript Haversine formulas.
- [ ] **Payload Optimization:** The `/search` endpoint must **NOT** return:
    - `landlord_phone`
    - `highres_url`
    - *Why:* Saves data for users, prevents bypassing the paywall.

### 4.2 The "Cold Start" UI
- [ ] **Freemium Visibility:** Unauthenticated users *must* be able to see property cards, rent amounts, and thumbnails.
- [ ] **Blur Logic:** Ensure the "Show Phone" button is visible but locked behind the `UnlockGuard`.

---

## 💰 PHASE 5: Monetization (Plans & Payments)

**Goal:** The "Gatekeeper" revenue model.

### 5.1 Payment Integrity
- [ ] **Webhook Logs:** Verify `webhook_logs` table captures the *raw JSON* payload from MTN/Airtel before processing.
    - *Audit:* Is `transaction_reference` indexed?
- [ ] **Idempotency:** The webhook handler must check if a `transaction_reference` has already been processed to prevent double-subscription.

### 5.2 Gating Middleware (`UnlockGuard`)
- [ ] **Tier Logic Check:**
    - Budget Tier (5k) -> Blocks unlocking rent > 500k.
    - Family Tier (30k) -> Blocks unlocking rent > 1M.
    - Premium -> Unlocks All.
- [ ] **Upsell Response:** When access is denied, return HTTP 403 with a structured body:
    ```json
    { "allowed": false, "required_plan": "Family", "upgrade_options": [...] }
    ```

---

## 🛡 PHASE 6: Safety & Visit Architecture

**Goal:** The core differentiator vs. Facebook Marketplace.

### 6.1 Visit State Machine
- [ ] **Flow Validation:** Ensure state transitions are strictly sequential:
    `requested` -> `confirmed` -> `arrived` -> `completed`
- [ ] **Safety Timer:** Verify that `arrival_confirmed = true` triggers a background job (BullMQ or Cron) to check in after X hours.

### 6.2 Reporting & Reputation
- [ ] **Rating Constraint:** Ratings allowed *only* if `visit.completion_confirmed = true`.
- [ ] **User Reports:** Ensure `user_reports` table links to specific `visit_id` or `property_id` for context.

---

## 📱 PHASE 7: Mobile UI & Navigation (React Native)

**Goal:** Optimized flow for low-end Android.

### 7.1 Navigation Structure
- [ ] **Split Stacks:** Verify `TenantStack` and `LandlordStack` are completely separate after login.
- [ ] **Active Visit Mode:** Ensure the App detects if a user has a visit in `arrived` state and shows the "SOS / Complete" overlay immediately upon opening.

### 7.2 Performance
- [ ] **Lazy Loading:** `FlashList` or `FlatList` must be used for search results.
- [ ] **Image Handling:** Property cards must load `thumbnail_url`. `highres_url` should only load on the Detail screen.
```