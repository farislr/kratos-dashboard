# Tech Stack & Configuration Details

## Core Technologies
- **Next.js 15.5.3**: Latest version with App Router, Server Components, Turbopack
- **React 19.1.0**: Latest React with concurrent features and improved performance
- **TypeScript 5.x**: Strict mode, modern ES2017 target, path mapping with @/*
- **Tailwind CSS 4.x**: Latest version with modern configuration and PostCSS

## Development Environment
- **Package Manager**: Bun (primary, fastest), npm/yarn/pnpm available
- **Build System**: Turbopack for development and production builds
- **Linting**: ESLint 9.x with Next.js and TypeScript configurations
- **Path Resolution**: `@/*` maps to `./src/*` for clean imports

## Project Structure (src-based)
```
kratos-dashboard/
├── src/
│   └── app/                # Next.js App Router
│       ├── layout.tsx      # Root layout with fonts
│       ├── page.tsx        # Homepage
│       ├── globals.css     # Global styles + Tailwind
│       └── favicon.ico     # Site icon
├── public/                 # Static assets
└── config files
```

## Configuration Files
- **TypeScript**: Strict mode, bundler resolution, Next.js plugin
- **ESLint**: Next.js core-web-vitals + TypeScript rules
- **Next.js**: Minimal config, ready for customization
- **PostCSS**: Tailwind CSS processing
- **Tailwind**: Modern v4 setup with CSS variables

## Font & Theme System
- **Fonts**: Geist Sans (UI), Geist Mono (code) with CSS variables
- **Theme**: Light/dark mode with CSS variables (--background, --foreground)
- **Responsive**: Mobile-first design with Tailwind breakpoints