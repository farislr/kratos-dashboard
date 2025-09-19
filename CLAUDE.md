# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15.5.3 dashboard application for managing Ory Kratos identity service through its Admin API. It serves as a web-based administrative interface for user identity management, authentication flows, and system configuration.

**Key Technologies:**
- Next.js 15.5.3 with App Router and Turbopack
- React 19.1.0 with Server Components
- TypeScript 5.x with strict configuration
- Tailwind CSS 4.x for styling
- Bun as primary package manager

## Essential Commands

**Development:**
```bash
bun dev              # Start development server with Turbopack
bun run build        # Build for production with Turbopack
bun run start        # Start production server
bun run lint         # Run ESLint
```

**Important:** Always use `bun` instead of `npm` for this project.

## Architecture Overview

### Server Actions Pattern
This application uses **Next.js 15 Server Actions with useActionState** instead of traditional API routes. All user operations (CRUD) are handled through Server Actions in `src/app/actions.ts` with:
- Promise-based error handling (no try/catch blocks)
- Structured error responses with context-aware messages
- Automatic `revalidatePath()` and `redirect()` for state management
- `useActionState` hook integration for form error states

### Kratos Integration
- **Client Library:** `src/lib/kratos.ts` provides typed Kratos Admin API client
- **Environment Variables:** `KRATOS_ADMIN_URL` (default: http://localhost:4434)
- **Schema:** Uses Kratos default identity schema with email/name fields
- **Search/Filtering:** Client-side filtering since Kratos lacks advanced search

### Component Architecture
- **Dashboard Page:** `src/app/dashboard/page.tsx` - Server component with async searchParams
- **Forms:** All use Server Actions with `useActionState` for error handling
- **State Management:** URL-based via searchParams and redirect()
- **Progressive Enhancement:** Forms work without JavaScript

### Data Flow
1. **User Input** → Form with Server Action
2. **Server Action** → Kratos Admin API call with .catch() error handling
3. **Success** → `revalidatePath()` + `redirect()` with URL state
4. **Error** → Return error object to `useActionState`

### Key Patterns
- **Error Handling:** `useActionState` pattern with structured error returns
- **URL State:** SearchParams managed via `redirect()` in Server Actions
- **Forms:** `action={serverAction}` with `useFormStatus` for loading states
- **Validation:** Server-side validation in Server Actions before Kratos calls

## File Structure Context

```
src/
├── app/
│   ├── actions.ts           # All Server Actions (CRUD operations)
│   ├── dashboard/page.tsx   # Main dashboard with server-side data fetching
│   └── layout.tsx          # Root layout with fonts
├── components/             # React components using Server Actions
│   ├── AddUserForm.tsx     # Create user with useActionState
│   ├── UserActions.tsx     # Edit/delete with separate state management
│   ├── UserTable.tsx       # Display users table
│   ├── SearchAndFilters.tsx # Search form with Server Action
│   └── Pagination.tsx      # Pagination via Server Actions
└── lib/
    └── kratos.ts           # Kratos API client and TypeScript types
```

## Development Notes

### Server Actions Implementation
- All mutations use Server Actions in `src/app/actions.ts`
- Error handling via `.catch()` chains, not try/catch blocks
- Return error objects instead of throwing errors
- Use `redirect()` for URL state changes after successful operations

### Kratos Client Usage
- Import `kratosClient` from `@/lib/kratos` for all API calls
- Client-side search/filtering implemented due to Kratos limitations
- Default schema assumes email + optional name.first/name.last structure

### Form Patterns
- Use `useActionState(serverAction, null)` for error state management
- Include `useFormStatus()` for loading states in submit buttons
- Handle form success by checking absence of error in returned state

### Environment Setup
Ensure Ory Kratos is running on default ports:
- Admin API: http://localhost:4434
- Public API: http://localhost:4433 (if needed)