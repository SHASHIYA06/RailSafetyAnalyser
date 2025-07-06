# Railway RAMS Platform

## Overview

This is a comprehensive Railway Reliability, Availability, Maintainability, and Safety (RAMS) analysis platform designed for rail and metro industry professionals. The application provides tools for searching, analyzing, and managing electrical, mechanical, and electronic components according to European (EN) standards and railway safety norms.

## System Architecture

The application follows a modern full-stack architecture with clear separation of concerns:

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom railway-themed color palette
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured for Neon serverless)
- **API Design**: RESTful API with structured error handling

### Project Structure
```
├── client/          # Frontend React application
├── server/          # Backend Express.js server
├── shared/          # Shared types and schemas
├── migrations/      # Database migration files
└── attached_assets/ # Documentation and requirements
```

## Key Components

### Data Models
- **Standards**: EN standards, RAMS specifications, and compliance documents
- **Components**: Railway equipment with technical specifications and RAMS scores
- **Suppliers**: Certified suppliers and manufacturer information
- **Users**: Authentication and authorization system

### Core Features
1. **Component Search & Filtering**: Advanced search with category, SIL level, and RAMS score filters
2. **Standards Library**: Comprehensive EN standards database with PDF documentation
3. **RAMS Analysis**: Real-time reliability, availability, maintainability, and safety scoring
4. **Compliance Tracking**: Component certification status and standard compliance
5. **Dashboard Analytics**: Visual metrics and performance indicators

### UI Components
- Railway-themed design with blue color scheme
- Responsive layout supporting mobile and desktop
- Interactive charts and progress indicators
- Advanced filtering and search capabilities
- Export functionality for compliance reports

## Data Flow

1. **Data Ingestion**: Standards and component data are seeded through the database migration system
2. **API Layer**: Express.js routes handle CRUD operations with validation and error handling
3. **Frontend Queries**: TanStack Query manages API calls with caching and optimistic updates
4. **User Interface**: React components render data with real-time updates and interactive filtering

### Search Flow
```
User Input → Component Search → API Query → Database Filter → Results Display
```

### RAMS Calculation
```
Component Data → Score Calculation → Risk Assessment → Compliance Status → Visual Dashboard
```

## External Dependencies

### Database & ORM
- **@neondatabase/serverless**: Serverless PostgreSQL connection
- **drizzle-orm**: Type-safe ORM with schema definitions
- **drizzle-kit**: Database migration and schema management

### UI & Styling
- **@radix-ui/***: Accessible component primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **lucide-react**: Modern icon library

### Development Tools
- **vite**: Fast build tool with HMR
- **typescript**: Type safety across the stack
- **tsx**: TypeScript execution for development

## Deployment Strategy

The application is configured for deployment on Replit with the following considerations:

### Development Mode
- Vite dev server with HMR for frontend
- tsx for TypeScript execution of backend
- Environment variables for database configuration

### Production Build
- Frontend: Vite build targeting modern browsers
- Backend: esbuild bundling for Node.js deployment
- Static asset serving through Express.js

### Database Management
- Drizzle migrations for schema evolution
- Connection pooling for serverless environments
- Environment-based configuration

## Changelog

```
Changelog:
- July 06, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```