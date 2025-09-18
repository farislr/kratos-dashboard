# Task Completion Checklist

## Code Quality Gates (Always Required)

### Essential Checks
1. **ESLint Validation**: `bun run lint` - Must pass without errors
2. **TypeScript Check**: `tsc --noEmit` - Verify type safety
3. **Build Verification**: `bun run build` - Ensure production build succeeds
4. **Development Server**: `bun dev` - Verify no runtime errors

### Pre-Commit Verification
- [ ] No ESLint errors or warnings
- [ ] TypeScript compilation successful
- [ ] All imports resolve correctly
- [ ] Production build completes successfully
- [ ] No console errors in browser dev tools

## Development Workflow Validation

### Local Testing
- [ ] Development server starts without errors (localhost:3000)
- [ ] Hot reload functions correctly
- [ ] Changes reflect immediately in browser
- [ ] No JavaScript runtime errors in console
- [ ] Mobile responsiveness works (if UI changes)

### Code Standards Compliance
- [ ] TypeScript types properly defined for all props/functions
- [ ] Import statements organized correctly (external → internal → relative)
- [ ] Naming conventions followed (PascalCase components, camelCase functions)
- [ ] Path mapping used (@/* instead of ../)
- [ ] "use client" directive added where needed for client components

## Ory Kratos Integration Checks (When Applicable)
- [ ] API endpoints properly typed with TypeScript interfaces
- [ ] Error handling implemented for API failures
- [ ] Loading states managed for async operations
- [ ] Authentication state properly managed
- [ ] Admin API calls secure and authorized

## Accessibility & Performance
- [ ] Semantic HTML elements used appropriately
- [ ] Images have descriptive alt attributes
- [ ] Keyboard navigation functional
- [ ] Color contrast sufficient for readability
- [ ] Next.js Image component used for optimized images
- [ ] Server Components used where possible for performance

## File Organization
- [ ] Components placed in appropriate directories
- [ ] No temporary or debug files left behind
- [ ] CSS organized (globals.css for global, modules for components)
- [ ] Public assets properly placed in `/public` directory
- [ ] Types defined in appropriate interfaces or type files

## Deployment Readiness
- [ ] Environment variables properly configured
- [ ] No hardcoded credentials or secrets
- [ ] Production build optimized
- [ ] Static assets optimized
- [ ] Error boundaries implemented where needed