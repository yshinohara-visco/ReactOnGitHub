# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Language Preference

**Always respond in Japanese (日本語) when working in this repository.**

## Project Overview

This is a React application built with TypeScript and Vite, configured to deploy to GitHub Pages. The project uses React 19 and demonstrates a minimal React + Vite setup with hot module replacement (HMR) and TypeScript support.

## Common Commands

### Development
```bash
npm run dev          # Start Vite dev server with HMR
npm run build        # TypeScript check + production build
npm run preview      # Preview production build locally
npm run lint         # Run ESLint on TypeScript/TSX files
```

### Deployment
```bash
npm run deploy       # Build and deploy to GitHub Pages
                     # Runs predeploy (build) then deploys dist/ to gh-pages branch
```

## Architecture

### Build Configuration
- **Build tool**: Vite with SWC plugin for fast React compilation
- **Base path**: `/ReactOnGitHub/` - critical for GitHub Pages routing (configured in vite.config.ts:7)
- **Output**: Production builds to `dist/` directory
- **Homepage**: Deployed at https://yshinohara-visco.github.io/ReactOnGitHub/

### TypeScript Setup
- Uses project references with separate configs:
  - `tsconfig.app.json` - Application code configuration
  - `tsconfig.node.json` - Build tooling configuration
  - Root `tsconfig.json` references both

### Routing and UI
- **Router**: React Router DOM v7 with basename `/ReactOnGitHub` (configured in src/main.tsx:9)
- **UI Library**: Material-UI (MUI) v7 with Emotion for styling
- **Navigation**: Client-side routing with centralized Navigation component (src/components/Navigation.tsx)
- **Page Structure**: Feature-based pages in `src/pages/` directory:
  - `/` - Home page
  - `/counter` - Counter demo with multiple state management examples
  - `/paint` - Canvas-based paint application
  - `/api-demo` - API demonstration page

### Source Structure
- `src/main.tsx` - Application entry point with React StrictMode and BrowserRouter setup
- `src/App.tsx` - Root component with route definitions
- `src/components/` - Shared components (Navigation, etc.)
- `src/pages/` - Feature-based page components organized by subdirectories
  - Each page may have its own subdirectory with related components and utilities

### Linting
- ESLint configured for TypeScript with React-specific rules
- Enforces React Hooks rules and React Refresh patterns
- Ignores `dist/` and `README.md` (see eslint.config.js:8)
- Unused variables prefixed with `_` are allowed (see eslint.config.js:26-32)

## GitHub Pages Deployment

The deployment process uses `gh-pages` package to publish the built application:

1. Build creates static files in `dist/` with correct base path
2. `gh-pages` pushes `dist/` contents to `gh-pages` branch
3. GitHub Pages serves from `gh-pages` branch

**Important**:
- The `base` setting in vite.config.ts must match the repository name for proper asset loading on GitHub Pages
- The `basename` prop in BrowserRouter (src/main.tsx:9) must match the base path
- Cache issues may occur after deployment - use Ctrl+Shift+R to force refresh (see README.md:5-6)
