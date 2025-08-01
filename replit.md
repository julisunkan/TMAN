# Overview

CyberLabs is a comprehensive cybersecurity education platform designed to teach ethical hacking and penetration testing through interactive tutorials and hands-on labs. The application provides structured learning modules covering topics from basic lab setup to advanced security techniques, complete with progress tracking, achievements, and practical exercises.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The frontend is built using React 18 with TypeScript, utilizing modern hooks-based architecture. The application uses Wouter for client-side routing instead of React Router, providing a lightweight navigation solution. State management is handled through React Query for server state and local React hooks for component state.

The UI framework is based on shadcn/ui components with Radix UI primitives, providing accessible and customizable components. Styling is implemented using Tailwind CSS with a custom cybersecurity theme featuring dark colors, neon accents, and terminal-inspired aesthetics.

Key architectural decisions:
- **Component Structure**: Modular component architecture with separation between layout, tutorial, and UI components
- **Styling Strategy**: CSS custom properties for theme variables with Tailwind utilities for consistent spacing and typography
- **State Management**: React Query for caching and synchronizing server state, with local storage for progress tracking
- **Type Safety**: Full TypeScript integration with shared schema types between frontend and backend

## Backend Architecture
The server follows an Express.js REST API pattern with TypeScript. The architecture separates concerns into distinct layers:

- **Route Handlers**: Clean separation of API endpoints in the routes module
- **Storage Layer**: Abstracted storage interface supporting both in-memory and database implementations
- **Development Integration**: Vite middleware integration for development mode with hot reloading

Key architectural decisions:
- **Database Strategy**: Drizzle ORM with PostgreSQL for production, with fallback to in-memory storage for development
- **API Design**: RESTful endpoints with consistent JSON responses and proper HTTP status codes
- **Build System**: ESBuild for server bundling and Vite for client-side development
- **Development Experience**: Integrated development server with automatic reloading and error overlay

## Data Storage Solutions
The application uses a flexible storage architecture that supports multiple backends:

- **Production Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Development Storage**: In-memory storage with Map-based data structures for rapid development
- **Client Storage**: LocalStorage for progress tracking, bookmarks, and user preferences

Schema design includes:
- **Users**: Authentication and profile information
- **Progress Tracking**: Module and lesson completion with timestamps
- **Bookmarks**: User-saved tutorial sections and references
- **Achievements**: Gamification system with various achievement types

## Authentication and Authorization
Currently implements a simplified authentication system suitable for development and educational use. The architecture is prepared for future enhancement with session-based authentication using connect-pg-simple for session storage.

## External Dependencies

### Core Framework Dependencies
- **React 18**: Frontend framework with hooks and concurrent features
- **Express.js**: Backend web framework for API routes
- **TypeScript**: Type safety across the entire stack
- **Vite**: Build tool and development server

### Database and ORM
- **Drizzle ORM**: Type-safe database toolkit for PostgreSQL
- **@neondatabase/serverless**: Serverless PostgreSQL driver
- **connect-pg-simple**: PostgreSQL session store for Express

### UI and Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives
- **shadcn/ui**: Pre-built component library
- **Lucide React**: Icon library for consistent iconography

### Development and Build Tools
- **ESBuild**: Fast JavaScript bundler for server code
- **PostCSS**: CSS processing for Tailwind
- **tsx**: TypeScript execution for development

### State Management and Data Fetching
- **TanStack React Query**: Server state management and caching
- **Wouter**: Lightweight client-side routing

### Development Environment
- **Replit Integration**: Custom Vite plugins for Replit environment
- **Runtime Error Overlay**: Development error handling and debugging