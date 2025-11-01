# Backend Structure Document

## 1. Backend Architecture

This project uses a modern server-side framework and follows a component-based, service-oriented design. The main pieces are:

- **Framework & Runtime**
  - Next.js 15 (App Router) running on Node.js
  - TypeScript for type safety and clearer code
- **Design Patterns**
  - Server Components for data fetching and rendering on the server by default
  - Client Components only where interactive behavior is needed (marked with `use client`)
  - Middleware pattern for route protection and request processing
  - Utility modules under `src/lib/` to centralize service clients (Supabase, Clerk)
- **How it supports scalability, maintainability, performance**
  - **Scalability**: Serverless deployment on Vercel allows horizontal scaling without extra configuration. Supabase offers a managed Postgres that can grow with demand.  
  - **Maintainability**: TypeScript and clear folder structure (`app/`, `components/`, `lib/`) keep code organized. Centralized utility functions make updates in one place.  
  - **Performance**: Server Components reduce bundled JavaScript for pages that don’t need client-side interactivity. Built-in caching strategies and edge functions via Vercel accelerate response times.

## 2. Database Management

- **Database Technology**
  - PostgreSQL (via Supabase managed service)
  - SQL database with support for real-time subscriptions
- **Data Structure & Access**
  - Tables are defined with migrations under `supabase/migrations/` to ensure consistency across environments
  - Row Level Security (RLS) policies enforce that each user sees only their own data, using Clerk’s `auth.uid()` in Supabase
  - The Supabase client is initialized in `src/lib/supabase.ts`, passing Clerk’s session token so that RLS policies can authenticate requests
- **Data Management Practices**
  - Versioned SQL migrations for schema changes
  - Environment variables (`.env.local`) to store database URL and anon key securely
  - Automated RLS policies to maintain data privacy by default

## 3. Database Schema

Below is a human-readable summary of the main tables and their security policies, followed by SQL definitions.

**Profiles Table**
- Stores basic user profile details
- Columns:
  - **id**: Unique identifier (UUID)
  - **user_id**: Clerk user ID (text)
  - **first_name**, **last_name**: User’s name fields (text)
  - **created_at**, **updated_at**: Timestamps
- RLS: Users can only view or update their own profile (checked against `auth.uid()`).

**Todos Table**
- Stores user tasks
- Columns:
  - **id**: Primary key (UUID)
  - **user_id**: Clerk user ID (text)
  - **title**: Task description (text)
  - **is_complete**: boolean flag
  - **created_at**, **updated_at**: Timestamps
- RLS: Users can only select, insert, update, or delete their own todos.

**SQL Schema (PostgreSQL)**
```sql
-- Enable extensions (if needed)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- PROFILES TABLE
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles: view own"  ON profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Profiles: modify own" ON profiles FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- TODOS TABLE
CREATE TABLE todos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  is_complete BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE todos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Todos: select own" ON todos FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Todos: insert own" ON todos FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Todos: update own" ON todos FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Todos: delete own" ON todos FOR DELETE USING (auth.uid() = user_id);
```  

## 4. API Design and Endpoints

This project uses Next.js App Router to define backend routes as serverless functions.

- **Approach**: RESTful-style endpoints under `src/app/api/`
- **Key Endpoint**:
  - **POST /api/chat**
    - Receives user messages in JSON format
    - Uses Vercel AI SDK to forward requests to OpenAI or Anthropic models
    - Streams AI responses back to the client for a real-time chat experience
- **Communication Flow**:
  1. Frontend chat component sends a POST request to `/api/chat` with the user’s message and session token
  2. Server route authenticates via Clerk middleware, then calls the AI SDK
  3. AI SDK streams chunks of text back to the route handler
  4. Route handler flushes the stream to the frontend, which renders it progressively

## 5. Hosting Solutions

- **Next.js on Vercel**
  - Automatic deployments on push to main branch
  - Edge network for global distribution and low-latency responses
  - Built-in scaling: functions spin up on demand
- **Database on Supabase**
  - Managed Postgres cluster with automatic backups
  - Horizontal scaling options and connection pooling
- **Benefits**
  - **Reliability**: SLA-backed services from Vercel and Supabase
  - **Scalability**: Serverless and managed databases remove operational burden
  - **Cost-effectiveness**: Pay-as-you-go pricing with free tiers for small projects

## 6. Infrastructure Components

- **Load Balancer & Edge Network**
  - Vercel’s global edge network balances traffic across serverless functions
- **Caching**
  - Automatic caching of static assets and SSR pages via Vercel
  - Option to configure cache headers for API responses
- **Content Delivery Network (CDN)**
  - Vercel’s built-in CDN for images and static files
- **Real-Time Subscriptions**
  - Supabase’s real-time websocket connections for live updates (optional enhancement)
- **Middleware**
  - Next.js middleware for authentication and route matching before reaching API handlers

## 7. Security Measures

- **Authentication**
  - Clerk handles sign-up, sign-in, multi-factor auth, and session management
  - Middleware (`src/middleware.ts`) redirects unauthenticated users to Clerk’s sign-in pages
- **Authorization**
  - Supabase Row Level Security tied to Clerk’s `auth.uid()` ensures each user can only see or modify their own data
- **Data Encryption**
  - All traffic over HTTPS/TLS
  - Environment variables stored securely (Vercel Environment or `.env.local` not committed to Git)
- **API Protection**
  - Public routes defined explicitly (e.g., `/`, `/api/chat`)
  - All other routes require a valid session cookie
- **Other Practices**
  - Principle of least privilege for database roles
  - Regular rotation of keys and tokens via environment configuration

## 8. Monitoring and Maintenance

- **Performance Monitoring**
  - Vercel Analytics for latency and error rates
  - Supabase dashboard for query performance and database health
- **Logging & Error Tracking**
  - Consider integrating Sentry or Logflare with Next.js
  - Serverless function logs available in Vercel console
- **Maintenance Strategies**
  - Automated database backups and migrations via Supabase
  - CI/CD pipeline on GitHub Actions or Vercel to run tests, lint, and deploy
  - Scheduled dependency updates (e.g., using Dependabot)

## 9. Conclusion and Overall Backend Summary

The backend uses a proven, serverless architecture powered by Next.js on Vercel and a managed PostgreSQL instance on Supabase. Authentication and authorization are robustly handled by Clerk and RLS policies, while AI integrations are made seamless via the Vercel AI SDK. This setup delivers:

- **Fast global performance** through edge functions and CDN
- **Strong data security** with RLS, HTTPS, and token-based auth
- **Easy scalability** with managed, serverless infrastructure
- **High maintainability** thanks to TypeScript, modular code organization, and database migrations

Overall, this backend structure aligns with modern web app requirements, offering a solid foundation for both current needs and future growth.