# Frontend Guideline Document

This document explains the frontend setup of the **CodeGuide Starter Kit**. It covers the overall architecture, design principles, styling, components, state management, routing, performance optimizations, testing strategies, and more. Our goal is to provide clear guidance for anyone—technical or not—to understand and work with this frontend.

---

## 1. Frontend Architecture

**Overall Structure**
- Built on **Next.js 15** using the **App Router**. This gives us file-based routing, server-side rendering (SSR), static generation, and server components by default.
- Written in **TypeScript** for type safety and clearer code.
- UI layer uses **React** with **shadcn/ui** (accessibility-focused components) and **Tailwind CSS v4** (utility-first styling).
- Authentication via **Clerk**, data storage via **Supabase** (Postgres), and AI features via the **Vercel AI SDK**.
- Theme switching handled by **next-themes** (light/dark mode).

**Scalability & Maintainability**
- **Server Components** for data fetching and static content, reducing client bundle size and improving performance.
- **Client Components** only where interactivity is needed (e.g., chat interface).
- A modular folder structure (`app/`, `components/`, `lib/`) keeps code organized by responsibility.
- Centralized service clients (Clerk, Supabase) in `lib/` for easy configuration and reuse.

**Performance**
- SSR and static generation where appropriate.
- Tailwind’s tree-shaking to minimize CSS bundle size.
- Incremental adoption of lazy loading and code splitting for heavy components (e.g., AI chat).  

---

## 2. Design Principles

1. **Usability**  
   - Clear navigation and feedback (loading states, error messages).  
   - Intuitive forms and controls using familiar patterns.

2. **Accessibility (A11y)**  
   - All UI components from **shadcn/ui** follow WCAG guidelines.  
   - Keyboard navigation, ARIA attributes, and screen-reader support.

3. **Responsiveness**  
   - Mobile-first approach with Tailwind’s responsive utilities.  
   - Breakpoints ensure layouts adapt to phone, tablet, and desktop.

4. **Consistency**  
   - Shared design tokens (colors, spacing, typography) across components.  
   - Reusable component library (`components/ui/*`) enforces a unified look.

5. **Performance-First**  
   - Favor server rendering and static assets.  
   - Optimize images and assets, minimize client JS.

---

## 3. Styling and Theming

**Styling Approach**
- **Tailwind CSS v4** for utility-first, atomic classes.  
- No custom naming conventions like BEM—styles come from utility classes.
- Base styles and CSS variables defined in `globals.css`.

**UI Framework**
- **shadcn/ui**: Accessible, unstyled primitives styled with Tailwind.

**Theming**
- Managed by **next-themes** using CSS variables.  
- Users can toggle light/dark or follow system preferences.

**Visual Style**
- Modern, flat design with subtle shadows and rounded corners.  
- Clean typography and ample white space.

**Color Palette**
- primary:  #4F46E5  (Indigo)
- secondary: #9333EA  (Purple)
- success:   #10B981  (Green)
- warning:   #F59E0B  (Amber)
- error:     #EF4444  (Red)
- background-light: #F9FAFB  
- background-dark:  #111827  
- text-light:        #1F2937  
- text-dark:         #E5E7EB  

**Typography**
- Primary font: **Inter**, with fallbacks: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif`.

---

## 4. Component Structure

**Organization**
- `app/` holds page routes and layouts.  
- `components/` holds shared UI and feature components.  
  - `components/ui/`: Customizations of shadcn/ui primitives.  
  - `components/chat.tsx`: AI chat interface.
- `lib/` for service clients (Clerk, Supabase) and helpers.

**Component-Based Architecture**
- Encourages reuse and isolation of concerns.  
- Each component has its own folder if it grows (e.g., styles, subcomponents).  
- Naming convention: PascalCase for components, kebab-case for file names if preferred.

**Why It Helps**
- Find things quickly.  
- Update or replace one component without affecting others.  
- Promote collaboration (designers and developers speak the same component language).

---

## 5. State Management

**Global State**
- **React Context API** for simple global needs (theme, user session).

**Local/Component State**
- `useState`, `useReducer` for internal component state.

**Server State / Data Fetching**
- Data fetched in Server Components when possible (Next.js App Router).  
- Client Components (like chat) use the **Vercel AI SDK**’s `useChat` hook, which handles message state and streaming.

**Scaling State**
- If app complexity grows, consider **TanStack Query** or **Zustand** for caching and more sophisticated state needs.

---

## 6. Routing and Navigation

**Routing**
- File-based via **Next.js App Router**.  
- `app/page.tsx` is the home page; subfolders become nested routes.
- API routes live under `app/api/*`.

**Protected Routes**
- Next.js middleware (`src/middleware.ts`) uses **Clerk** to guard private paths (`/dashboard`, `/profile`).  
- Public routes (e.g., `/`, `/api/chat`) stay open.

**Navigation**
- Use `next/link` for client-side transitions.  
- Layouts (`app/layout.tsx`) wrap pages with shared navigation bars or side menus.

---

## 7. Performance Optimization

1. **Server Components & SSR**  
   - Offload data fetching and rendering to the server.  
2. **Tailwind Purge**  
   - Remove unused CSS in production builds automatically.  
3. **Code Splitting & Lazy Loading**  
   - Dynamically import heavy or rarely used components (e.g., AI chat).  
4. **Asset Optimization**  
   - Use Next.js `next/image` for automatic image resizing and optimization.  
5. **Caching & CDN**  
   - Leverage Vercel’s CDN and caching headers for static assets and API responses.  

These optimizations lead to fast initial loads, smooth interactions, and smaller bundles.

---

## 8. Testing and Quality Assurance

**Unit & Integration Tests**
- **Jest** + **React Testing Library** for components and utilities.  
- Mock external services (Clerk, Supabase) using test doubles.

**End-to-End (E2E) Tests**
- **Playwright** or **Cypress** for full workflows (sign-up, chat, data operations).

**Linting & Formatting**
- **ESLint** with Next.js and TypeScript plugins.  
- **Prettier** for a consistent code style.
- Enforce via Git hooks or CI (e.g., Husky, GitHub Actions).

**Accessibility Testing**
- **axe-core** or **Lighthouse** to audit a11y issues automatically.

**Continuous Integration**
- Run tests, lint, and build checks on each pull request (GitHub Actions).  
- Ensure no regressions slip through.

---

## 9. Conclusion and Overall Frontend Summary

This frontend setup brings together modern tools and best practices for building robust web apps:

- **Next.js 15** with Server Components for performance and SEO.
- **TypeScript** for safer code.
- **Clerk** + **Supabase RLS** for secure auth and data.
- **Vercel AI SDK** for ready-made AI chat experiences.
- **Tailwind CSS** + **shadcn/ui** for flexible, accessible design.

It balances speed of development with scalability, maintainability, and user experience. By following these guidelines—organized architecture, clear design principles, consistent styling, thoughtful performance tuning, and strong testing—you can confidently extend, customize, and scale this starter kit for any web application.

Happy coding! 🚀
