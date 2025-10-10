# Contributing to CodeGuide Starter Kit

We welcome contributions to the CodeGuide Starter Kit! This document provides guidelines for contributing to the project.

## Getting Started

1. Fork the repository
2. Clone your fork locally
3. Install dependencies: `npm install`
4. Copy `.env.example` to `.env.local` and configure your environment variables
5. Start the development server: `npm run dev`

## Development Process

### Setting Up Your Development Environment

1. **Prerequisites**:
   - Node.js 18 or later
   - npm or yarn package manager
   - Git

2. **Environment Setup**:
   - Follow the setup instructions in `SUPABASE_CLERK_SETUP.md`
   - Ensure all required environment variables are configured
   - Test the application runs correctly with `npm run dev`

### Making Changes

1. Create a new branch for your feature or bug fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes following our coding standards (see below)

3. Test your changes thoroughly:
   ```bash
   npm run lint
   npm run build
   ```

4. Commit your changes with a descriptive commit message:
   ```bash
   git commit -m "feat: add new feature description"
   ```

5. Push to your fork and create a pull request

## Coding Standards

### TypeScript
- Use strict TypeScript throughout the codebase
- Define proper types for all props, functions, and API responses
- Utilize the configured path aliases (`@/`) for imports

### React & Next.js
- Use server components by default, client components only when needed
- Follow the established patterns in the codebase
- Utilize the App Router structure (`/src/app`)

### Styling
- Use TailwindCSS for all styling
- Follow the established design system with shadcn/ui components
- Support both light and dark themes using CSS custom properties
- Use existing UI components before creating new ones

### Database
- All new tables must implement Row Level Security (RLS)
- Use Clerk user IDs (`auth.jwt() ->> 'sub'`) in RLS policies
- Follow the established patterns in `supabase/migrations/`

### Code Organization
- Place reusable utilities in `src/lib/`
- Use PascalCase for components
- Group related functionality in appropriate directories
- Keep components focused and single-purpose

## Pull Request Guidelines

### Before Submitting
- [ ] Code follows the project's style guidelines
- [ ] Self-review of the code has been performed
- [ ] Code is properly commented where necessary
- [ ] Changes have been tested locally
- [ ] Lint checks pass (`npm run lint`)
- [ ] Build succeeds (`npm run build`)

### PR Description
Please include:
- Clear description of what the PR does
- Why the change is needed
- Screenshots for UI changes
- Any breaking changes or migration notes

### Review Process
- All PRs require at least one review
- Address all review feedback before merging
- Maintain a clean git history

## Types of Contributions

### Bug Reports
When filing a bug report, please include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, Node version, etc.)
- Screenshots or error logs if applicable

### Feature Requests
For new features:
- Describe the problem you're solving
- Explain why this feature would be beneficial
- Consider backward compatibility
- Discuss implementation approach if applicable

### Documentation
- Keep documentation up to date with code changes
- Improve existing documentation clarity
- Add examples for complex features
- Update CLAUDE.md when adding new patterns

## Code Examples

### Adding a New Component
```typescript
// src/components/ui/my-component.tsx
import { cn } from "@/lib/utils"

interface MyComponentProps {
  className?: string
  children: React.ReactNode
}

export function MyComponent({ className, children }: MyComponentProps) {
  return (
    <div className={cn("base-styles", className)}>
      {children}
    </div>
  )
}
```

### Database Migration Example
```sql
-- supabase/migrations/002_new_feature.sql
CREATE TABLE example_table (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE example_table ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own records" ON example_table
  FOR ALL USING (auth.jwt() ->> 'sub' = user_id);
```

## Community Guidelines

- Be respectful and inclusive
- Help others learn and grow
- Provide constructive feedback
- Follow our code of conduct
- Ask questions if you're unsure about anything

## Getting Help

- Check existing issues and discussions
- Review the project documentation
- Ask questions in pull request discussions
- Reach out to maintainers for guidance

Thank you for contributing to CodeGuide Starter Kit!