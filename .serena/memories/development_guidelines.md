# Development Guidelines & Best Practices

## Next.js App Router Architecture

### Component Strategy
- **Server Components**: Default for data fetching, static content, SEO-critical pages
- **Client Components**: Interactive UI, state management, browser APIs, event handlers
- **Hybrid Approach**: Server Components wrapping Client Components for optimal performance

### Data Fetching Patterns
- **Server-Side**: Use `fetch()` in Server Components for initial data
- **Client-Side**: React Query, SWR, or native fetch for dynamic updates
- **Caching**: Leverage Next.js built-in caching for API responses
- **Streaming**: Use Suspense boundaries for progressive loading

### Route Organization
```
src/app/
├── layout.tsx              # Root layout
├── page.tsx                # Homepage
├── dashboard/              # Dashboard routes
│   ├── layout.tsx          # Dashboard layout
│   ├── page.tsx            # Dashboard home
│   ├── users/              # User management
│   └── settings/           # Settings pages
└── api/                    # API routes (if needed)
```

## Ory Kratos Integration Patterns

### API Integration Strategy
- **Server Actions**: Use for form submissions and mutations
- **API Routes**: Proxy sensitive admin API calls through Next.js
- **Client Fetching**: Direct public API calls for read operations
- **Type Safety**: Define TypeScript interfaces for all Kratos API responses

### Security Considerations
- **Admin API**: Never expose admin endpoints directly to client
- **Session Management**: Implement proper session validation
- **CSRF Protection**: Use Next.js built-in CSRF protection
- **Environment Variables**: Store Kratos URLs and credentials securely

## State Management Strategy

### Application State
- **URL State**: Use searchParams for filters, pagination, sorting
- **Server State**: React Query/SWR for caching API responses
- **UI State**: useState for component-local state
- **Global State**: Context API for theme, user preferences

### Form Handling
- **Simple Forms**: Controlled components with useState
- **Complex Forms**: React Hook Form or similar library
- **Validation**: Zod or similar for schema validation
- **Server Actions**: For form submissions with automatic revalidation

## Performance Optimization

### Bundle Optimization
- **Code Splitting**: Automatic with Next.js App Router
- **Dynamic Imports**: Use for heavy components or libraries
- **Tree Shaking**: Avoid wildcard imports
- **Bundle Analysis**: Use @next/bundle-analyzer for optimization

### Runtime Performance
- **Image Optimization**: Always use next/image
- **Font Optimization**: Use next/font for custom fonts
- **Lazy Loading**: Implement for data-heavy components
- **Memoization**: Use React.memo and useMemo judiciously

## Testing Strategy (Future Implementation)

### Testing Pyramid
- **Unit Tests**: Component logic and utility functions
- **Integration Tests**: Component interactions and API calls
- **E2E Tests**: Complete user workflows
- **Visual Tests**: Component appearance and responsive design

### Testing Tools Recommendations
- **Jest + Testing Library**: Unit and integration tests
- **Playwright**: End-to-end testing
- **Storybook**: Component development and visual testing
- **MSW**: API mocking for tests

## Error Handling & Monitoring

### Error Boundaries
- **Route Level**: error.tsx files for route-specific errors
- **Component Level**: Custom error boundaries for critical sections
- **Global Handling**: Root error boundary for uncaught errors

### Logging & Monitoring
- **Development**: Console logging with structured data
- **Production**: Consider error tracking services (Sentry, etc.)
- **API Errors**: Proper error messages and status codes
- **User Feedback**: Toast notifications for user-facing errors