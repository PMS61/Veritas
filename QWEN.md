# Veritas Project Context

## Project Overview

Veritas is a Next.js-based web application designed as a "lightweight, privacy-aware truth discernment" platform for information verification. The application aggregates signals from multiple sources, flags potential misinformation, and surfaces verified insights for journalists, researchers, and informed citizens.

### Architecture & Technology Stack

The project follows a hybrid architecture using:

**Frontend & Core Infrastructure (Next.js + Supabase):**
- Next.js 15 with React 19
- TypeScript for type safety
- Tailwind CSS with shadcn/ui components
- Supabase for authentication, database (PostgreSQL), and real-time features
- Geist and Manrope fonts

**AI/ML & Complex Processing (FastAPI):**
- FastAPI backend for AI/ML processing
- Python ecosystem for NLP, machine learning, and data processing
- Integration with Hugging Face models, translation APIs, and other ML services

### Key Features

1. **Information Verification**: AI-powered claim analysis and fact-checking
2. **Misinformation Detection**: Pattern matching and anomaly detection
3. **Source Credibility**: Source reliability scoring and authority assessment
4. **Real-time Feed Processing**: Ingestion and normalization of multiple data streams
5. **Trend Analysis**: Pattern recognition and emerging topic detection
6. **User Management**: Role-based access control (Admin vs General users)
7. **Verification Workflows**: Manual and automated verification processes

### Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin dashboard routes
│   ├── api/               # API routes
│   ├── dashboard/         # User dashboard
│   ├── verify/            # Verification interface
│   └── ...               # Other route groups
├── components/            # React components (including shadcn/ui)
├── lib/                  # Utility functions
├── hooks/                # Custom React hooks
├── data/                 # Data models and schemas
├── public/               # Static assets
├── styles/               # Global styles
```

### Building and Running

**Development:**
```bash
npm install
npm run dev
```

This starts the Next.js development server on the default port. The application expects a FastAPI backend running for AI/ML features and a Supabase project for authentication and database.

**Production:**
```bash
npm run build
npm start
```

### Development Conventions

- **Type Safety**: Full TypeScript usage throughout the codebase
- **Component Library**: shadcn/ui with Radix UI primitives and Tailwind CSS
- **Styling**: Tailwind CSS with CSS variables for theming
- **Authentication**: Supabase Auth with role-based access control
- **State Management**: React hooks with potential additional state management libraries
- **API Communication**: Next.js Server Actions for simple operations, API routes for complex operations
- **File Structure**: App Router convention with nested route groups

### Key Dependencies

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Radix UI primitives
- Lucide React icons
- Zod for schema validation
- React Hook Form for form handling
- Recharts for data visualization
- Sonner for toast notifications

### User Types & Access

The application supports two primary user types:
- **Admin Users**: Fact-checkers, journalists, content moderators, researchers
- **General Users**: Informed citizens, students, educators, social media users

With role-based access control implemented via Supabase Row-Level Security (RLS).

### Environment Configuration

The application requires:
- Supabase project configuration (URL and API keys)
- Potential FastAPI backend endpoint (for AI/ML services)
- Environment variables for authentication and external services