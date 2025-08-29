# Authentication Setup Guide

This guide will help you set up authentication for the Aristotle application using PostgreSQL.

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or cloud)
- Git

## Setup Steps

### 1. Database Setup

#### Option A: Local PostgreSQL
```bash
# Install PostgreSQL (macOS)
brew install postgresql
brew services start postgresql

# Create database
createdb aristotle

# Or using psql
psql postgres
CREATE DATABASE aristotle;
\q
```

#### Option B: Cloud PostgreSQL (Recommended for Production)
- **Railway**: Create a new PostgreSQL service
- **Supabase**: Create a new project with PostgreSQL
- **Neon**: Create a new database
- **AWS RDS**: Create a PostgreSQL instance

### 2. Environment Configuration

Copy the environment template:
```bash
cp env.local.example .env.local
```

Update `.env.local` with your database credentials:
```bash
# For local PostgreSQL
DATABASE_URL="postgresql://username:password@localhost:5432/aristotle"

# For Railway
DATABASE_URL="postgresql://username:password@host:port/database"

# Generate a secure JWT secret
JWT_SECRET="your-super-secure-jwt-secret-key"
```

### 3. Database Migration

Run the database migrations:
```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed the database
npm run db:seed
```

### 4. Start the Application

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## Authentication Features

### User Registration
- Username and password required
- Email and display name optional
- Password minimum 6 characters
- Username must be unique

### User Login
- Username/password authentication
- JWT tokens stored in HTTP-only cookies
- 7-day token expiration
- Automatic redirect to dashboard after login

### Protected Routes
All main application routes require authentication:
- `/` (Dashboard)
- `/frameworks`
- `/wisdom`, `/courage`, `/justice`, `/temperance`
- `/coach`, `/breath`, `/fasting`
- `/progress`, `/today`, `/community`

### Sign Out
- Clears authentication cookies
- Redirects to login page

## Default User

The seed script creates a default user:
- **Username**: `demo`
- **Password**: `password123`
- **Email**: `demo@aristotle.com`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `POST /api/auth/signout` - User logout
- `GET /api/auth/me` - Get current user

### Protected APIs
All existing APIs now require authentication and will return user-specific data.

## Security Features

- **Password Hashing**: bcrypt with 12 salt rounds
- **JWT Tokens**: Secure token-based authentication
- **HTTP-Only Cookies**: Prevents XSS attacks
- **Middleware Protection**: Automatic route protection
- **Input Validation**: Server-side validation for all inputs

## Deployment

### Railway (Recommended)
1. Connect your GitHub repository to Railway
2. Add PostgreSQL service
3. Set environment variables:
   - `DATABASE_URL` (auto-set by Railway)
   - `JWT_SECRET` (generate secure random string)
   - `NODE_ENV=production`
4. Deploy

### Other Platforms
- **Vercel**: Add PostgreSQL add-on
- **Netlify**: Use external PostgreSQL service
- **AWS**: Use RDS for PostgreSQL

## Troubleshooting

### Database Connection Issues
```bash
# Test database connection
npx prisma db pull

# Reset database
npx prisma migrate reset
```

### Authentication Issues
- Check JWT_SECRET is set
- Verify database migrations ran successfully
- Check browser console for errors
- Ensure cookies are enabled

### Build Issues
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## Development

### Adding New Protected Routes
Update `middleware.ts` to include new routes in the `protectedRoutes` array.

### Customizing Authentication
- Modify `lib/auth.ts` for custom authentication logic
- Update `app/auth/page.tsx` for custom UI
- Extend user model in `prisma/schema.prisma` for additional fields

## Production Checklist

- [ ] Secure JWT_SECRET generated
- [ ] HTTPS enabled
- [ ] Database backups configured
- [ ] Environment variables set
- [ ] Error logging configured
- [ ] Rate limiting implemented
- [ ] Security headers configured 