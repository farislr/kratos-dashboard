# Code Style & Development Conventions

## TypeScript Standards
- **Strict Mode**: Enabled for maximum type safety
- **Target**: ES2017 for modern browser compatibility
- **Imports**: Use `import type` for type-only imports
- **Path Mapping**: Prefer `@/` for src-relative imports over `../`

## File & Naming Conventions
- **Components**: PascalCase (e.g., `UserDashboard.tsx`)
- **Files**: kebab-case or camelCase (following Next.js patterns)
- **Functions**: camelCase (e.g., `getUserData`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)
- **Interfaces**: PascalCase with descriptive names (e.g., `UserProfile`)

## Next.js App Router Patterns
- **Server Components**: Default pattern for data fetching
- **Client Components**: Use `"use client"` for interactivity
- **Layouts**: Shared UI in `layout.tsx` files
- **Metadata**: Export `metadata` objects for SEO
- **File Structure**: Feature-based organization within `/src/app`

## React Component Structure
```tsx
import type { ComponentProps } from "react";
import { useState } from "react";
import { ExternalComponent } from "external-lib";
import { InternalComponent } from "@/components/internal";
import "./component.css";

interface Props {
  required: string;
  optional?: number;
}

export default function ComponentName({ required, optional = 0 }: Props) {
  const [state, setState] = useState<string>("");
  
  return (
    <div className="tailwind-classes">
      {/* Component content */}
    </div>
  );
}
```

## Styling Conventions
- **Tailwind First**: Use utility classes for styling
- **CSS Variables**: For theme colors (--background, --foreground)
- **Responsive Design**: Mobile-first with Tailwind breakpoints
- **Dark Mode**: Use CSS variables with prefers-color-scheme
- **Component Styles**: Use CSS modules or globals.css for complex styles

## Import Organization
1. **React/Next.js**: Core framework imports first
2. **External Libraries**: Third-party packages
3. **Internal Modules**: Project components and utilities
4. **Relative Imports**: Local files last
5. **CSS/Styles**: Import styles at the end

## Error Handling & TypeScript
- **Strict Null Checks**: Handle undefined/null explicitly
- **Type Guards**: Use for runtime type checking
- **Error Boundaries**: Implement for React error handling
- **API Types**: Define interfaces for external API responses