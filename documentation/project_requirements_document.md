# Project Requirements Document (PRD)

## 1. Project Overview

The **CodeGuide Starter Kit** is a production-ready template built on Next.js 15 that jumpstarts the development of modern web applications. It bundles essential services—user authentication (Clerk), data persistence (Supabase), AI-driven chat (Vercel AI SDK with OpenAI/Anthropic), and a polished UI component library (shadcn/ui + Tailwind CSS v4)—so teams don’t have to wire them up from scratch. Everything is wired together following best practices for security (Row Level Security in Supabase), theming (light/dark), and performance (server-side rendering, streaming responses).

This starter kit exists to eliminate boilerplate setup and enforce a consistent architecture. Key objectives are:  
• Accelerate time-to-first-commit for new projects by providing a "batteries-included" codebase.  
• Enforce best practices around security (Clerk + Supabase RLS) and modern React patterns (Next.js App Router, Server & Client Components).  
• Offer a clear developer onboarding experience via a built-in Setup Dashboard. Success is measured by how quickly a developer can clone the repo, configure environment variables, and have a fully functioning app with auth, database, and AI chat in under 15 minutes.

---

## 2. In-Scope vs. Out-of-Scope

### In-Scope (Version 1)
• User sign-up, sign-in, sign-out, and profile management via Clerk.  
• Protected routes and API endpoints using Clerk’s middleware.  
• Supabase PostgreSQL integration with Row Level Security (RLS) policies tying data access to Clerk user IDs.  
• AI chat interface leveraging the Vercel AI SDK with streaming responses from OpenAI and Anthropic Claude.  
• A component library based on shadcn/ui and utility-first styling via Tailwind CSS v4.  
• Light/dark theme toggling powered by `next-themes`.  
• Developer Setup Dashboard on the home page to guide environment variable configuration.  
• Utility modules in `src/lib` for Supabase client creation, user fetching (`currentUser()`), and centralized configurations.

### Out-of-Scope (Phase Later)
• File or media uploads and storage (e.g., S3 or Supabase Storage UI).  
• Custom analytics dashboards or event-tracking integrations.  
• Payment processing or billing flows.  
• End-to-end automated tests (unit, integration, E2E).  
• Multi-tenant support or role-based access beyond basic user ownership.  
• Advanced state management libraries (e.g., Redux, Zustand) or data-fetching abstractions (React Query).  

---

## 3. User Flow

A new visitor lands on the home page (`/`). If environment variables are missing, they see the **Setup Dashboard** with step-by-step instructions to configure Clerk, Supabase, and AI keys. Once the developer provides valid `.env.local` values and restarts the server, that Setup Dashboard disappears. Instead, visitors see a hero section with a call-to-action to sign in or sign up.

When an end user clicks **Sign Up**, they’re taken through Clerk’s hosted sign-up flow. After completing registration, they’re redirected to the home page where the **Chat** interface appears below the hero. They type messages into the chat box, hit send, and watch the AI respond in real time. A top navigation (or sidebar if added later) lets them navigate to their **Profile** page or **Sign Out**. Throughout, the UI respects light/dark theme preferences.

---

## 4. Core Features

- **Authentication & Authorization**  
  • Clerk-powered sign-up, sign-in, session management  
  • Middleware for protecting server and API routes  

- **Database & Security**  
  • Supabase client with SSR and client modes  
  • Row Level Security (RLS) policies enforcing user-specific data access  

- **AI Chat Interface**  
  • Vercel AI SDK integration for streaming responses  
  • Support for OpenAI and Anthropic Claude models  

- **UI Component Library**  
  • `shadcn/ui` components based on Radix UI  
  • Styled with Tailwind CSS v4  

- **Theming**  
  • Light/dark mode toggle via `next-themes`  

- **Developer Setup Dashboard**  
  • Guided onboarding for environment variable setup  

- **Utility Modules**  
  • `supabase.ts` to initialize public & server clients  
  • `user.ts` for fetching current user via Clerk  

- **API Routes**  
  • `/api/chat` handler streaming AI responses  

---

## 5. Tech Stack & Tools

- **Frontend Framework**: Next.js 15 (App Router, SSR & SSG)  
- **Language**: TypeScript  
- **Styling**: Tailwind CSS v4 (utility-first CSS)  
- **UI Components**: shadcn/ui (built on Radix UI)  
- **Theming**: next-themes for dynamic light/dark modes  
- **Authentication**: Clerk (hosted auth, middleware)  
- **Database**: Supabase (PostgreSQL) with RLS  
- **AI Integration**: Vercel AI SDK  
  • Models: OpenAI GPT, Anthropic Claude  
- **Server Runtime**: Node.js 18+  
- **Environment Management**: `.env.local` with `.env.example` template  
- **IDE & Plugins** (_optional_)  
  • VSCode with ESLint, Prettier, Tailwind CSS IntelliSense  
  • Cursor or Windsurf for AI-assisted coding  

---

## 6. Non-Functional Requirements

- **Performance**  
  • Server-side rendering of critical pages under 200ms  
  • Streaming chat responses should begin within 1s  
- **Security**  
  • All API routes behind Clerk middleware over HTTPS  
  • RLS policies to prevent unauthorized data access  
  • Secrets stored in environment variables, not in code  
- **Compliance**  
  • Adhere to OWASP Top 10 guidelines  
  • GDPR-friendly data handling (only store what’s necessary)  
- **Usability**  
  • WCAG-compliant UI components  
  • Responsive design for mobile and desktop  

---

## 7. Constraints & Assumptions

- Clerk, Supabase, OpenAI, and Anthropic API keys must be provisioned before running.  
- Project runs on Node.js 18+, leveraging Next.js 15 features (App Router, server components).  
- The developer has Git, Node.js, and a modern browser installed.  
- Vercel AI SDK supports both OpenAI and Anthropic endpoints without breaking changes.  
- Environment variables are correctly loaded from `.env.local`.  
- CookieStore helper is only available in Next.js server components or route handlers.  

---

## 8. Known Issues & Potential Pitfalls

- **CookieStore Limitations**: Trying to use `cookies()` outside server components or route handlers will throw. Mitigation: wrap cookie logic in `try/catch` (already done) or conditionally import.  
- **API Rate Limits**: OpenAI/Anthropic may throttle. Mitigation: implement exponential backoff or error UI.  
- **Middleware Matching**: The Clerk `matcher` pattern is broad; accidental public route exposure must be double-checked.  
- **RLS Misconfiguration**: Incorrect `auth.uid()` usage can lock out all users. Mitigation: test policies with multiple user accounts early.  
- **Environment Drift**: Missing or stale `.env.local` entries will break startup. Mitigation: include `.env.example` and clear error messages on missing keys.  
- **Accessibility Gaps**: Custom UI components may need an A11y audit. Mitigation: integrate axe-core or a similar tool in CI.

<!-- End of PRD -->