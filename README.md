# Kratos Dashboard

A modern Next.js dashboard application for managing [Ory Kratos](https://www.ory.sh/kratos/) identity service through its Admin API. This provides a web-based administrative interface for user identity management, authentication flows, and system configuration.

## Features

- **User Management**: Create, read, update, and delete user identities
- **Search & Filtering**: Filter users by status (active, inactive, verified, unverified)
- **Dark Mode Support**: Modern theme switcher with light/dark modes
- **Bulk Operations**: CSV import for mass user creation (planned)
- **Real-time Updates**: Server Actions with automatic page revalidation
- **Progressive Enhancement**: Forms work without JavaScript
- **Modern Architecture**: Next.js 15 with Server Actions and useActionState

## Tech Stack

- **Framework**: Next.js 15.5.3 with App Router and Turbopack
- **React**: 19.1.0 with Server Components
- **TypeScript**: 5.x with strict configuration
- **Styling**: Tailwind CSS 4.x with dark mode support
- **Theme Management**: next-themes for persistent theme switching
- **Package Manager**: Bun (primary)
- **Identity Service**: Ory Kratos Admin API

## Prerequisites

- [Ory Kratos](https://www.ory.sh/kratos/) running locally or accessible via network
- Node.js 18+ (recommended: use with Bun)
- Bun package manager

## Getting Started

### 1. Install Dependencies

```bash
bun install
```

### 2. Environment Setup

Create a `.env.local` file:

```bash
# Kratos Admin API URL (default: http://localhost:4434)
KRATOS_ADMIN_URL=http://localhost:4434

# Kratos Public API URL (default: http://localhost:4433)
KRATOS_PUBLIC_URL=http://localhost:4433
```

### 3. Start Development Server

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to access the dashboard.

### 4. Navigate to Dashboard

The main dashboard is available at [http://localhost:3000/dashboard](http://localhost:3000/dashboard) where you can:

- View all user identities
- Create new users
- Edit existing users
- Delete users
- Search and filter users
- Switch between light and dark themes

## Development Commands

```bash
bun dev              # Start development server with Turbopack
bun run build        # Build for production
bun run start        # Start production server
bun run lint         # Run ESLint
```

**Important**: Always use `bun` instead of `npm` for this project.

## Architecture

This application uses modern Next.js patterns:

- **Server Actions**: All CRUD operations use Next.js 15 Server Actions instead of API routes
- **useActionState**: Modern error handling with structured error responses
- **Server Components**: Dashboard page fetches data server-side
- **Progressive Enhancement**: Forms work without JavaScript
- **URL State Management**: Search parameters managed via `redirect()`

## Kratos Integration

The application integrates with Ory Kratos Admin API for:

- Identity CRUD operations
- User trait management (email, name)
- Credential management (password)
- Verification and recovery address management

### Default Schema Support

Currently supports Kratos default identity schema with:

- **Email**: Primary identifier (required)
- **Name**: First and last name (optional)
- **State**: Active/inactive status
- **Verification**: Email verification status

## Project Structure

```
src/
├── app/
│   ├── actions.ts           # Server Actions for all CRUD operations
│   ├── dashboard/page.tsx   # Main dashboard page (Server Component)
│   └── layout.tsx          # Root layout with fonts
├── components/             # React components
│   ├── AddUserForm.tsx     # User creation form
│   ├── UserActions.tsx     # Edit/delete user actions
│   ├── UserTable.tsx       # Users display table
│   ├── SearchAndFilters.tsx # Search and filter controls
│   ├── Pagination.tsx      # Pagination controls
│   └── ThemeToggle.tsx     # Dark/light mode theme switcher
└── lib/
    └── kratos.ts           # Kratos API client and TypeScript types
```

## Learn More

### Next.js Resources

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API
- [Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations) - Next.js Server Actions guide

### Ory Kratos Resources

- [Ory Kratos Documentation](https://www.ory.sh/kratos/docs/) - Complete Kratos documentation
- [Admin API Reference](https://www.ory.sh/kratos/docs/reference/api) - Kratos Admin API reference

## Deployment

### Vercel (Recommended)

1. Connect your repository to [Vercel](https://vercel.com)
2. Set environment variables in Vercel dashboard:
   - `KRATOS_ADMIN_URL`
   - `KRATOS_PUBLIC_URL`
3. Deploy

### Manual Deployment

```bash
bun run build
bun run start
```

Ensure your Kratos instance is accessible from your deployment environment.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes following the existing patterns
4. Test with a running Kratos instance
5. Submit a pull request

## License

This project is licensed under the MIT License.

