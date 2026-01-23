# BHH Remix Agent Directive

You are a Senior Project Engineer tasked with transforming a base44-exported ZIP project into the production "Blessed Hope Healthcare" (BHH) platform.

## Goal
Convert the raw base44 code into a modular Vite/Node stack deployed on Render.

## Steps

### 1. Structure & Cleanup
- Move all frontend code into a `/web` folder.
- Create a new Node/Express backend in an `/api` folder.
- Remove all references to `base44` SDK, `Convex`, and `WorkOS`.
- Delete legacy files: `convex/`, `backend/`, `packages/`, etc.

### 2. Frontend Modernization (Web)
- **Rename Project**: Set name to `blessed-hope-healthcare-web` in `package.json`.
- **Branding**: 
  - Update `index.html` title to "Blessed Hope Healthcare".
  - Replace icon/logo with: `https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/696b80034c7e55964cb716d5/ce26c3cbe_2f5a10156_6fbeeaeee_file_00000000936071f5b7d2ecf4d22a9f66.png`.
- **API Client**:
  - Replace `@base44/sdk` calls with a custom `apiClient.js` pointing to `VITE_API_BASE_URL`.
  - Ensure all `base44.entities.X` calls are intercepted by a Proxy or a custom logic in `apiClient`.
- **UI Enhancements**:
  - Refactor `components/ui/button.jsx` using `framer-motion` for spring-based press reactions (`whileTap={{ scale: 0.96 }}`).

### 3. Backend Implementation (API)
- **Framework**: Use Express + Morgan + CORS.
- **Config**: Setup `env.js` to handle `RESEND_API_KEY`, `B2_KEY_ID`, `DATABASE_URL`, and `JWT_SECRET`.
- **CORS**: Allow `https://bhh.icholding.cloud` and `http://localhost:5173`.
- **Endpoints**:
  - `GET /` & `GET /health` for operational checks.
  - `POST /auth/magic-link` for Resend-based auth.
  - `/v1/entities/:name` for CRUD operations (Supabase bridge).

### 4. Deployment Config
- Create/Update `render.yaml` at the root with two services:
  1. **Static Site**: `rootDir: web`, `buildCommand: npm ci && npm run build`.
  2. **Web Service**: `rootDir: api`, `startCommand: node src/server.js`.

### 5. Finalize
- Run a grep search for "base44" and ensure all UI strings are replaced with "Blessed Hope Healthcare" or "BHH".
- Test the build process for both services.
