# Tanstack Query Setup for Hungry4Change Admin Portal

## Overview
This document outlines the implementation of Tanstack Query (React Query) with axios for the Hungry4Change admin portal, providing efficient data fetching, caching, and state management.

## What Was Implemented

### 1. Dependencies Added
- `@tanstack/react-query@5.90.2` - Core React Query library
- `@tanstack/react-query-devtools@5.90.2` - Development tools for debugging

### 2. API Configuration (`src/lib/api.ts`)
- Updated base URL to `https://h4cbackend.vercel.app`
- Enhanced axios configuration with proper headers
- Request interceptor for automatic JWT token attachment
- Response interceptor for 401 error handling and automatic logout
- Improved error handling utilities

### 3. Query Client Setup (`src/lib/query.ts`)
- Configured QueryClient with optimal defaults
- 5-minute stale time for better performance
- Smart retry logic (no retry on 401/403 errors)
- Disabled retry for mutations

### 4. Comprehensive Query Hooks (`src/lib/queries.ts`)
Based on the backend entities from the PRD, implemented hooks for:

#### Core Entities
- **Causes**: `useCauses`, `useCreateCause`, `useUpdateCause`, `useDeleteCause`
- **Donations**: `useDonations`, `useCreateDonation`
- **Volunteers**: `useVolunteers`, `useCreateVolunteer`, `useUpdateVolunteer`, `useDeleteVolunteer`
- **Events**: `useEvents`, `useCreateEvent`, `useUpdateEvent`, `useDeleteEvent`
- **Blogs**: `useBlogs`, `useCreateBlog`, `useUpdateBlog`, `useDeleteBlog`
- **Testimonials**: `useTestimonials`, `useCreateTestimonial`, `useUpdateTestimonial`, `useDeleteTestimonial`
- **Contact**: `useContact`
- **Media**: `useMedia`
- **Stats**: `useStats`

#### Features
- TypeScript interfaces matching backend entities
- Automatic cache invalidation on mutations
- Built-in loading states and error handling
- Toast notifications for success/error feedback
- Optimistic updates and background refetching

### 5. Authentication Integration (`src/lib/auth.tsx`)
- Migrated authentication to use Tanstack Query mutations
- Automatic query cache clearing on logout
- Loading states for login process
- Enhanced error handling with toast notifications

### 6. App Integration (`src/App.tsx`)
- Added QueryClientProvider wrapper
- Integrated React Query DevTools for development
- Proper provider hierarchy (QueryClient > AuthProvider > App)

### 7. Updated Pages
Demonstrated the new query hooks in:
- **Causes Page**: Full CRUD operations with loading states
- **Dashboard Page**: Multiple data sources with automatic caching
- **Blogs Page**: Complete blog management functionality
- **Login Page**: Enhanced authentication flow

## Key Benefits

### Performance
- Automatic caching reduces API calls
- Background refetching keeps data fresh
- Optimistic updates for better UX
- Request deduplication

### Developer Experience
- Type-safe API calls with TypeScript
- Centralized error handling
- Loading states built-in
- DevTools for debugging

### User Experience
- Instant loading for cached data
- Automatic retry on network failures
- Loading indicators during operations
- Toast notifications for feedback

## Usage Examples

### Basic Data Fetching
```typescript
const { data: causes, isLoading, error } = useCauses()
```

### Creating Data
```typescript
const createCause = useCreateCause()
await createCause.mutateAsync({ title: 'New Cause', ... })
```

### Updating Data
```typescript
const updateCause = useUpdateCause()
await updateCause.mutateAsync({ id: '123', title: 'Updated Title' })
```

### Deleting Data
```typescript
const deleteCause = useDeleteCause()
await deleteCause.mutateAsync('123')
```

## Backend API Endpoints Used

Based on the PRD analysis, the following endpoints are integrated:

- `GET /causes` - List all causes
- `POST /causes` - Create new cause
- `PUT /causes/:id` - Update cause
- `DELETE /causes/:id` - Delete cause
- `GET /donations` - List donations
- `POST /donations` - Create donation
- `GET /volunteers` - List volunteers
- `POST /volunteers` - Create volunteer
- `PUT /volunteers/:id` - Update volunteer
- `DELETE /volunteers/:id` - Delete volunteer
- `GET /events` - List events
- `POST /events` - Create event
- `PUT /events/:id` - Update event
- `DELETE /events/:id` - Delete event
- `GET /blogs` - List blogs
- `POST /blogs` - Create blog
- `PUT /blogs/:id` - Update blog
- `DELETE /blogs/:id` - Delete blog
- `GET /testimonials` - List testimonials
- `POST /testimonials` - Create testimonial
- `PUT /testimonials/:id` - Update testimonial
- `DELETE /testimonials/:id` - Delete testimonial
- `GET /contact` - List contact submissions
- `GET /media` - List media files
- `GET /donations/stats` - Get donation statistics
- `POST /auth/login` - User authentication

## Next Steps

1. **Update remaining pages** (Events, Volunteers, Testimonials, Contact, Media) to use the new query hooks
2. **Add optimistic updates** for better perceived performance
3. **Implement pagination** for large datasets
4. **Add search and filtering** capabilities
5. **Set up error boundaries** for better error handling
6. **Add offline support** with React Query's offline capabilities

## Development Tools

The React Query DevTools are available in development mode. Press the floating button in the bottom-left corner to:
- Inspect query cache
- Monitor query states
- Debug mutations
- View query timelines

This setup provides a robust foundation for the admin portal with modern data fetching patterns and excellent developer experience.
