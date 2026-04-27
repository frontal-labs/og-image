# Architecture Documentation

## Overview

The OG Image Generation Service is a Next.js-based web service that dynamically generates Open Graph images with customizable themes. The architecture follows a modular design with clear separation of concerns, making it maintainable and extensible.

## Technology Stack

### Core Framework
- **Next.js 16.2.4** - React framework with App Router
- **React 19.2.4** - UI library for component-based rendering
- **TypeScript 5** - Type-safe JavaScript development

### Development Tools
- **Biome** - Code formatting and linting
- **Vitest** - Unit testing framework
- **Husky** - Git hooks for code quality
- **Changesets** - Version management and changelog generation

### Deployment
- **Vercel** - Serverless deployment platform
- **Node.js** - Runtime environment

## Project Structure

```
src/
├── app/                    # Next.js App Router routes
│   ├── health/            # Health check endpoint
│   │   └── route.ts
│   └── route.tsx          # Main OG image generation endpoint
├── components/            # React components
│   ├── og-image.tsx       # Main OG image component
│   ├── themes/            # Theme-specific components
│   │   ├── editorial-theme.tsx
│   │   ├── gradient-theme.tsx
│   │   ├── minimal-theme.tsx
│   │   ├── spotlight-theme.tsx
│   │   ├── system-theme.tsx
│   │   └── theme-props.ts
│   └── brand/             # Brand-related components
├── config/                # Configuration files
│   └── env.ts            # Environment variables
├── lib/                   # Utility libraries
│   ├── error.ts          # Error handling utilities
│   ├── log.ts            # Logging utilities
│   └── og.ts             # OG-specific utilities
├── services/              # Business logic services
│   └── og-service.ts     # OG image generation service
└── proxy.ts              # Middleware for security headers
```

## Architecture Patterns

### 1. Service Layer Architecture

The application follows a service layer pattern with clear separation between:

- **Routes** (`src/app/`) - Handle HTTP requests/responses
- **Services** (`src/services/`) - Contain business logic
- **Libraries** (`src/lib/`) - Provide utilities and helpers
- **Components** (`src/components/`) - Handle presentation logic

### 2. Component-Based Design

The OG image generation is built using React components:

```typescript
OGImage (main component)
├── Theme-specific components
│   ├── GradientTheme
│   ├── MinimalTheme
│   ├── SpotlightTheme
│   ├── EditorialTheme
│   └── SystemTheme
└── Brand components
```

### 3. Error Handling Strategy

Centralized error handling with custom error classes:

```typescript
AppError (base class)
├── ValidationError
├── UnsupportedMediaTypeError
└── GenerationError
```

## Core Components

### Route Handlers

#### Main Route (`src/app/route.tsx`)
- Handles GET and POST requests for OG image generation
- Validates input parameters
- Delegates to OG service for image generation
- Implements consistent error responses

#### Health Check (`src/app/health/route.ts`)
- Provides service health status
- Supports both GET and HEAD methods
- Returns version and timestamp information

### Service Layer

#### OG Service (`src/services/og-service.ts`)
**Core Responsibilities:**
- Font loading and caching
- Image generation using Next.js ImageResponse
- ETag generation for caching
- Parameter validation and normalization

**Key Features:**
- Lazy font loading with caching
- Parallel font loading for performance
- Configurable image dimensions
- Intelligent caching headers

### Component System

#### Main OG Image Component (`src/components/og-image.tsx`)
Acts as a theme router, selecting appropriate theme component based on the theme parameter.

#### Theme Components
Each theme is a separate React component that implements:
- Unique visual design
- Responsive layout
- Consistent typography
- Theme-specific styling

### Utility Libraries

#### Error Handling (`src/lib/error.ts`)
- Custom error classes with HTTP status codes
- Centralized error response formatting
- Error logging integration

#### OG Utilities (`src/lib/og.ts`)
- Parameter validation functions
- Theme normalization
- Text length validation
- Type definitions for OG parameters

## Data Flow

### Request Processing Flow

1. **Request Reception**
   - Middleware applies security headers and CORS
   - Route handler receives HTTP request

2. **Parameter Validation**
   - Extract and validate query parameters or JSON body
   - Apply length constraints and format validation
   - Normalize theme selection

3. **Service Processing**
   - Load fonts (with caching)
   - Generate ETag for caching
   - Create ImageResponse with React component

4. **Response Generation**
   - Apply caching headers
   - Return PNG image with appropriate metadata

### Component Rendering Flow

1. **Theme Selection**
   - OGImage component receives theme parameter
   - Routes to appropriate theme component

2. **Font Loading**
   - Service loads required fonts asynchronously
   - Fonts are cached for subsequent requests

3. **Image Generation**
   - Next.js ImageResponse renders React component to PNG
   - Applies configured dimensions and fonts

## Security Architecture

### Middleware Security (`src/proxy.ts`)

**CORS Configuration:**
- Whitelisted origins for development and production
- Dynamic Vercel domain support
- Proper preflight handling

**Security Headers:**
- `Referrer-Policy: no-referrer`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`

### Input Validation

**Parameter Validation:**
- Type checking for all inputs
- Length constraints (title: 100 chars, description: 200 chars)
- Theme validation against allowed values
- SQL injection prevention (not applicable for this service)

**Content-Type Validation:**
- Strict JSON content-type requirement for POST requests
- Media type validation before body parsing

## Performance Optimization

### Caching Strategy

**Client-Side Caching:**
- ETag generation based on content hash
- Conditional request support
- Cache-Control headers for browser caching

**Server-Side Caching:**
- Font file caching in memory
- Vercel edge caching via headers
- CDN distribution through Vercel

### Resource Optimization

**Font Loading:**
- Lazy loading of font files
- Parallel font loading
- ArrayBuffer conversion for optimal memory usage

**Image Generation:**
- Efficient React component rendering
- Optimized PNG output
- Minimal memory footprint

## Deployment Architecture

### Vercel Serverless Functions

**Function Structure:**
- Each route becomes a serverless function
- Automatic scaling based on demand
- Edge deployment for global performance

**Environment Configuration:**
- Environment-specific settings
- Debug mode support
- Version management

### Build Process

**Next.js Build:**
- Static optimization where possible
- Bundle size optimization
- TypeScript compilation

**Asset Management:**
- Font files in public directory
- Automatic asset optimization
- CDN distribution

## Extensibility Design

### Adding New Themes

1. Create new theme component in `src/components/themes/`
2. Implement `OGThemeProps` interface
3. Add theme to `OG_THEMES` array in `src/lib/og.ts`
4. Update theme router in `OGImage` component

### Adding New Parameters

1. Update `OGParams` interface in `src/lib/og.ts`
2. Add validation logic in `validateOGParams`
3. Update route handlers to extract new parameter
4. Modify theme components to use new parameter

### Custom Error Types

1. Extend `AppError` class in `src/lib/error.ts`
2. Add appropriate HTTP status code
3. Update error response formatting if needed
4. Add logging configuration

## Monitoring and Observability

### Health Monitoring

**Health Check Endpoint:**
- Service availability status
- Version information
- Timestamp for monitoring

**Error Tracking:**
- Structured error logging
- Error code classification
- Request context preservation

### Performance Monitoring

**Response Time Tracking:**
- Request duration measurement
- Font loading performance
- Image generation timing

**Resource Usage:**
- Memory usage monitoring
- Font cache efficiency
- Request pattern analysis

## Development Workflow

### Code Quality

**Linting and Formatting:**
- Biome for consistent code style
- Pre-commit hooks via Husky
- Automated formatting on save

**Testing:**
- Vitest for unit testing
- Component testing capabilities
- API endpoint testing

### Version Management

**Changesets:**
- Automated version bumping
- Changelog generation
- Semantic versioning

**Git Workflow:**
- Feature branch development
- Pull request reviews
- Automated deployments

## Future Considerations

### Scalability

**Potential Enhancements:**
- Rate limiting implementation
- Database integration for templates
- User authentication system
- Custom font upload support

**Performance Improvements:**
- Image compression optimization
- Advanced caching strategies
- CDN optimization
- Geographic distribution

### Feature Extensions

**Theme System:**
- Dynamic theme loading
- User-defined themes
- Theme marketplace
- A/B testing support

**Advanced Features:**
- Image overlays and watermarks
- Multi-language support
- Batch image generation
- Template management system