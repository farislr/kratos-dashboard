# Essential Development Commands

## Primary Development Workflow
```bash
# Start development server (primary)
bun dev                    # Uses Turbopack for faster builds
npm run dev               # Alternative if using npm

# Production build and start
bun run build             # Build for production
bun run start             # Start production server

# Code quality
bun run lint              # ESLint check
eslint                    # Direct ESLint command
```

## Package Management (Bun Primary)
```bash
# Dependencies
bun install               # Install all dependencies
bun add <package>         # Add production dependency
bun add -d <package>      # Add development dependency
bun remove <package>      # Remove dependency
bun update               # Update dependencies

# Alternative package managers
npm install / yarn install / pnpm install
```

## Development URLs & Resources
- **Local Development**: http://localhost:3000
- **Next.js Documentation**: https://nextjs.org/docs
- **Tailwind CSS Docs**: https://tailwindcss.com/docs
- **TypeScript Handbook**: https://www.typescriptlang.org/docs

## macOS/Darwin System Commands
```bash
# File operations
ls -la                    # List files with details
find . -name "*.tsx"      # Find TypeScript React files
grep -r "pattern" src/    # Search in source files
cat <file>                # View file contents

# Git workflow
git status               # Repository status
git add .                # Stage changes
git commit -m "message"  # Commit changes
git branch               # List branches
git checkout -b <name>   # Create feature branch

# Process management
ps aux | grep node       # Find Node processes
kill -9 <pid>            # Kill process by ID
lsof -i :3000           # Check port 3000 usage
```

## Ory Kratos Integration Commands (Future)
```bash
# When integrating with Kratos
curl http://localhost:4434/health/ready  # Check Kratos Admin API
curl http://localhost:4433/health/ready  # Check Kratos Public API
```