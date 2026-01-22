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

## Core Architecture
The system uses an **API Shim** strategy. All logic that previously depended on external platforms has been routed to the `/api` service, ensuring data sovereignty and performance stability.

- **Frontend Build**: `npm ci && npm run build`
- **Backend Start**: `node src/server.js`

## Environment Setup
Ensure `VITE_API_BASE_URL` is set on the frontend to the URL of the backend service.
