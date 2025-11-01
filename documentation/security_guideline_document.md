# Security Guidelines for CodeGuide Starter Kit

This document provides security best practices and recommendations tailored to the CodeGuide Starter Kit. It aligns with the core security principles—security by design, least privilege, defense in depth, input validation, and secure defaults—ensuring that your Next.js 15 application remains robust against threats.

---

## 1. Authentication and Authorization

**Objective:** Protect application endpoints and resources by enforcing strong user identity verification and granular access control.

- **Clerk Integration**  
  • Enforce server-side authentication checks on all protected routes.  
  • Ensure middleware is configured with explicit `publicRoutes` and `ignoredRoutes`.  
  • Verify that `matcher` patterns do not unintentionally expose internal APIs or static assets.

- **Password and Session Security**  
  • Enforce strong password policies (minimum length, complexity).  
  • Store passwords with Argon2 or bcrypt + unique salts.  
  • Enforce idle and absolute session timeouts.  
  • Rotate session tokens on every login and logout to prevent fixation.

- **JSON Web Tokens (JWT)**  
  • Use strong signing algorithms (RS256 or HS256 with sufficiently long secret).  
  • Reject tokens with `alg: none`.  
  • Validate `exp`, `iat`, and `aud` claims.  
  • Implement token revocation/blacklisting for compromised credentials.

- **Multi-Factor Authentication (MFA)**  
  • Offer MFA (TOTP, SMS, WebAuthn) for all privileged users and high-risk operations.  
  • Enforce MFA enrollment on first login for admin roles.

- **Role-Based Access Control (RBAC)**  
  • Define roles (e.g., user, moderator, admin) and associated permissions.  
  • Perform server-side permission checks on every sensitive operation.  
  • Never rely on client-side flags for authorization enforcement.

---

## 2. Data Persistence and Security

**Objective:** Ensure data at rest and in transit is protected, and that database access is strictly controlled.

- **Supabase and Row-Level Security (RLS)**  
  • Enable RLS on all tables containing user-owned data (`todos`, `profiles`).  
  • Define explicit RLS policies using `auth.uid()` to scope SELECT, INSERT, UPDATE, DELETE.  
  • Test RLS policies regularly to verify no unauthorized access loopholes.

- **Secure Database Connections**  
  • Use TLS 1.2+ for all connections to Supabase.  
  • Limit database user privileges—grant only minimal rights needed by the application.  
  • Rotate credentials periodically and store them in a secrets manager (Vault, AWS Secrets Manager).

- **Input Validation and Query Safety**  
  • Use Supabase client’s parameterized queries or prepared statements; avoid string concatenation.  
  • Validate and sanitize all inputs server-side (IDs, text, file metadata) before database operations.  
  • Reject or escape dangerous characters to prevent SQL injection.

- **Encryption at Rest**  
  • Ensure Supabase storage buckets use encryption (AES-256) for uploaded assets.  
  • Encrypt sensitive PII fields at the application layer if additional confidentiality is required.

---

## 3. AI-Powered Interaction

**Objective:** Secure integration with Vercel AI SDK and underlying LLM providers (OpenAI, Anthropic) to prevent abuse and credential leakage.

- **API Key Management**  
  • Store AI credentials in environment variables managed by your secret store—never commit keys.  
  • Scope keys with least privileges (e.g., limit to chat completion).  
  • Rotate keys periodically and after any suspected compromise.

- **Rate Limiting & Quotas**  
  • Implement server-side throttling on the `/api/chat` endpoint to mitigate abuse and DoS.  
  • Enforce per-user and per-IP limits (e.g., X requests per minute).

- **Input & Output Validation**  
  • Validate user messages for size and type constraints before forwarding to LLM.  
  • Sanitize AI responses before rendering—encode HTML to prevent XSS in chat bubbles.

- **Logging and Monitoring**  
  • Log request metadata (user ID, timestamp) without storing message content in plaintext logs.  
  • Monitor usage patterns and anomalous behavior (e.g., rapid-fire requests, injection attempts).

---

## 4. Rich UI Components and Theming

**Objective:** Safeguard the client-side interface against XSS, CSRF, and ensure secure cookie handling.

- **shadcn/ui & Tailwind CSS**  
  • Perform context-aware encoding of any user-supplied text displayed in UI components.  
  • Sanitize custom HTML inputs if you extend or override components.

- **Cross-Site Scripting (XSS) Prevention**  
  • Use React’s built-in escaping. Avoid `dangerouslySetInnerHTML` unless content is sanitized.  
  • Define a strict Content Security Policy (CSP) header—disallow inline scripts and only trusted sources.

- **Cross-Site Request Forgery (CSRF)**  
  • For any state-changing form or fetch, include anti-CSRF tokens (Clerk handles many cases automatically).  
  • Verify tokens on the server for POST, PUT, DELETE actions.

- **Secure Cookies**  
  • Set `HttpOnly`, `Secure`, and `SameSite=Strict` (or `Lax` where necessary) on all auth/session cookies.  
  • Avoid storing sensitive tokens in `localStorage` or `sessionStorage`.

- **Theming & CSS Variables**  
  • Ensure theme toggles cannot be abused to inject malicious CSS.  
  • Sanitize any user-provided theme customization values.

---

## 5. Developer Setup Dashboard

**Objective:** Secure the onboarding experience by guiding developers to safely configure environment, secrets, and dependencies.

- **Environment Variable Guidance**  
  • In `SUPABASE_CLERK_SETUP.md`, emphasize using a secrets manager instead of storing `.env.local` in version control.  
  • Document mandatory variables (e.g., `NEXT_PUBLIC_SUPABASE_URL`, `CLERK_SECRET_KEY`, `AI_API_KEY`) and their scopes.

- **Dependency Management**  
  • Maintain `package-lock.json` to enforce deterministic installs.  
  • Periodically run SCA tools (npm audit, GitHub Dependabot) and address high-severity CVEs.

- **CI/CD Pipeline Security**  
  • Integrate linting (ESLint), formatting (Prettier), and type checks in CI.  
  • Include security scans (Snyk, Trivy) in the build pipeline.  
  • Enforce branch protection rules and code reviews for all merges.

- **Onboarding Checklist**  
  • Validate that all secrets are configured and tested against a staging environment.  
  • Provide automated scripts or GitHub Actions to verify environment readiness (e.g., Supabase health check).

---

## 6. Infrastructure and Operational Security

**Objective:** Harden production environments, keep dependencies updated, and monitor for vulnerabilities.

- **Next.js Production Hardening**  
  • Disable React Developer Tools and verbose errors in production builds.  
  • Serve over TLS 1.2+ with Strict-Transport-Security (HSTS) header.

- **Server & Deployment**  
  • Run on least-privileged containers/VMs.  
  • Close unused ports and disable default credentials.  
  • Regularly apply OS, runtime, and library patches.

- **Logging, Monitoring & Incident Response**  
  • Centralize logs (Sentry, Datadog) and redact sensitive PII.  
  • Set up alerts for error spikes or unauthorized access attempts.  
  • Define an incident response plan with clear escalation paths.

---

## 7. Continuous Improvement

- Conduct periodic security code reviews and penetration tests.  
- Automate dependency updates while validating against regression tests.  
- Perform regular data privacy audits to ensure compliance with GDPR/CCPA.  
- Keep documentation up to date as new features or dependencies are introduced.


**By adhering to these guidelines, you will ensure that the CodeGuide Starter Kit remains a secure, resilient foundation for building modern web applications.**