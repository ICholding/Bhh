# Blessed Hope Healthcare (BHH) - Full Stack Environment

This repository contains the production code for the BHH ecosystem, optimized for sovereign hosting.

## Project Structure
- **/api**: Express.js Backend with PostgreSQL integration, Log Sinks, and AI Proxying.
- **/web**: Vite/React Frontend with Supabase Auth and Tailwind CSS.
- **render.yaml**: Infrastructure-as-code for automated Render deployment.

## Deployment Strategy
1. **Frontend**: Deploys as a Static Site with SPA routing.
2. **Backend**: Deploys as a Web Service on Node.js.
3. **Database**: Managed PostgreSQL.

## Logo Usage Policy

**IMPORTANT**: Logos are restricted to specific locations only:

✅ **ALLOWED**:
- Splash screen (`web/src/pages/Splash.jsx`) - background image only
- Landing page footer (`web/src/components/footer/SiteFooter.jsx`) - company info only (no logo image)

❌ **NOT ALLOWED**:
- In-app headers, navigation bars, or page content
- Profile sections or settings pages
- Form pages or application flows

This policy ensures minimal branding and a clean, professional user interface throughout the application.

## Core Architecture
The system uses an **API Shim** strategy. All logic that previously depended on external platforms has been routed to the `/api` service, ensuring data sovereignty and performance stability.

- **Frontend Build**: `npm ci && npm run build`
- **Backend Start**: `node src/server.js`

## Environment Setup
Ensure `VITE_API_BASE_URL` is set on the frontend to the URL of the backend service.

### Supabase Environment Variables
The application requires the following Supabase environment variables in the `/web` directory:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_PUBLIC_SITE_URL=https://bhh.icholding.cloud
```

Copy `.env.example` to `.env` and fill in your Supabase credentials.

## Supabase Auth QA Checklist

Before deploying to production, ensure all Supabase authentication flows are working:

- [ ] **Sign up with email/password** → role selected → login works
- [ ] **Forgot password** → email link received → reset password → login works
- [ ] **Role selected during signup** persists in `profiles.role`
- [ ] **Route guard redirects** to correct dashboard based on role
- [ ] **Password reset link** works when opened on mobile
- [ ] **Environment variables** are set correctly (not committed to repo)
- [ ] **Supabase Dashboard URL Configuration** is set:
  - Site URL: `https://bhh.icholding.cloud`
  - Redirect URLs include `/reset-password` route

## Supabase Dashboard Configuration

**Important**: After merging Supabase integration, configure the following in your Supabase Dashboard:

1. Go to **Authentication** → **URL Configuration**
2. Set **Site URL**: `https://bhh.icholding.cloud`
3. Add **Redirect URLs**:
   - `https://bhh.icholding.cloud`
   - `https://bhh.icholding.cloud/reset-password`
   - `http://localhost:5173/reset-password` (for local development)

## Database Migrations

To apply the Supabase database migrations:

1. Install Supabase CLI: `npm install -g supabase`
2. Link your project: `supabase link --project-ref your-project-ref`
3. Apply migrations: `supabase db push`

Alternatively, run the SQL in `/supabase/migrations/0001_profiles_rls.sql` directly in the Supabase SQL Editor.

## Android Build with Capacitor

The BHH app supports native Android builds using Capacitor 6.

### Prerequisites

- Node.js and npm installed
- Android Studio installed (for building APK/AAB)
- Java Development Kit (JDK) 17 or higher

### Initial Setup

1. **Install dependencies** (includes Capacitor):
   ```bash
   cd web
   npm install
   ```

2. **Build the web app**:
   ```bash
   npm run build
   ```

3. **Initialize Capacitor** (first time only):
   ```bash
   npx cap init
   ```
   
   When prompted:
   - App ID: `cloud.icholding.bhh`
   - App Name: `Blessed Hope Healthcare`

4. **Add Android platform** (first time only):
   ```bash
   npx cap add android
   ```

### Building for Android

1. **Build the web app**:
   ```bash
   cd web
   npm run build
   ```

2. **Sync web assets to Android**:
   ```bash
   npx cap sync
   ```

3. **Open Android Studio**:
   ```bash
   npx cap open android
   ```

4. **Build APK/AAB in Android Studio**:
   - For development: Build → Build Bundle(s) / APK(s) → Build APK(s)
   - For production: Build → Generate Signed Bundle / APK

### Development Workflow

```bash
# Make changes to web app
cd web
npm run dev

# When ready to test on Android
npm run build
npx cap sync
npx cap open android
```

### Configuration

Capacitor configuration is in `web/capacitor.config.ts`:
- `appId`: `cloud.icholding.bhh`
- `appName`: `Blessed Hope Healthcare`
- `webDir`: `dist` (Vite build output)
- `androidScheme`: `https` (for secure connections)

### Environment Variables for Android

Ensure these are set during build:
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_PUBLIC_SITE_URL=https://bhh.icholding.cloud
```

The Android app will use these embedded values from the web build.

### Troubleshooting

- **Build fails**: Ensure JDK 17+ is installed and set as JAVA_HOME
- **Sync fails**: Run `npm run build` first to create the `dist` directory
- **App crashes on launch**: Check that environment variables are set correctly
- **Auth not working**: Verify Supabase redirect URLs include your Android app scheme

