# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Commands
- `pnpm dev` - Start development server
- `pnpm build` - Build for production  
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm analyze` - Build with bundle analyzer

### Testing Commands
- `pnpm test` - Run tests in watch mode
- `pnpm test:run` - Run tests once
- `pnpm test:coverage` - Run tests with coverage report

## Architecture Overview

### Feature-Based Architecture
The codebase follows a feature-based organization pattern:

```
src/
├── components/
│   ├── auth/           # Authentication components
│   ├── gatherings/     # Meeting-related components
│   ├── mypage/         # User profile components  
│   ├── reviews/        # Review components
│   ├── saved/          # Saved meetings components
│   ├── shadcn-ui/      # UI library components
│   └── shared/         # Global reusable components
├── hooks/api/          # API hooks using Tanstack Query
├── utils/              # Utility functions by feature
└── queries/            # Query key factories
```

### "Async Surf" Pattern
This project implements a custom "Async Surf" pattern for managing client-server async flows:

#### Client Side Components:
- **API Hooks** (`hooks/api/`): Custom hooks wrapping Tanstack Query operations
- **Queries Station** (`queries/`): Centralized query key management using Query Factory pattern
- **API Paths Station** (`lib/api/apiPaths.ts`): Centralized API endpoint definitions
  - `EXTERNAL_PATHS`: API routes → Backend
  - `INTERNAL_PATHS`: Client → API routes
- **Client Fetchers** (`lib/api/clientFetchers.ts`): Axios-based HTTP clients with interceptors
- **Surf Guard** (`lib/api/surfGuard.ts`): Consistent error handling utilities

#### Server Side Components:
- **Server Fetcher** (`lib/api/serverFetcher.ts`): Fetch API wrapper for server-side requests with Next.js optimizations

### State Management
- **Tanstack Query**: Server state management
- **Context API**: Global client state (auth, theme)
- **React Hook Form + Zod**: Form state and validation

### Key Libraries
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type safety
- **Tailwind CSS + shadcn/ui**: Styling
- **Vitest + MSW**: Testing
- **Motion**: Animations

## Important Patterns

### API Integration
- All API calls go through custom hooks in `hooks/api/`
- Query keys are centralized in `queries/` files
- Error handling is standardized through Surf Guard utilities
- Client-server communication follows the Async Surf pattern

### Component Organization
- Components are grouped by feature (auth, gatherings, reviews, etc.)
- `shared/` contains globally reusable components
- Each feature may have its own `shared/` subdirectory for feature-specific reusable components

### Form Handling
- Use React Hook Form with Zod validation schemas
- Form schemas are located in `utils/[feature]/` directories
- XSS protection is implemented via `escapeForXSS` utility

### Path Aliases
- `@/*` maps to `src/*` (configured in tsconfig.json)

## Testing Setup
- Vitest with jsdom environment
- MSW for API mocking
- Setup file: `src/__test__/setup.ts`
- Test files alongside source code with `.test.ts` suffix