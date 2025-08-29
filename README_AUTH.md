# Authentication System

The Aristotle app uses a JWT-based authentication system with HTTP-only cookies for security.

## Features

- **JWT Tokens**: Secure token-based authentication
- **HTTP-only Cookies**: Prevents XSS attacks
- **Password Hashing**: Uses bcrypt for secure password storage
- **Middleware Protection**: Automatic route protection
- **React Context**: Easy-to-use authentication state management

## API Endpoints

### POST /api/auth/signup
Create a new user account.

**Request Body:**
```json
{
  "username": "string",
  "password": "string",
  "email": "string (optional)",
  "displayName": "string (optional)"
}
```

**Response:**
```json
{
  "message": "User created successfully",
  "user": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com",
    "displayName": "Test User"
  }
}
```

### POST /api/auth/signin
Sign in with existing credentials.

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "message": "Authentication successful",
  "user": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com",
    "displayName": "Test User"
  }
}
```

### GET /api/auth/me
Get current user information.

**Response:**
```json
{
  "user": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com",
    "displayName": "Test User",
    "tz": "America/Los_Angeles",
    "createdAt": "2025-08-29T15:28:04.669Z"
  }
}
```

### POST /api/auth/signout
Sign out and clear authentication.

**Response:**
```json
{
  "message": "Signed out successfully"
}
```

## React Components

### AuthProvider
Wraps your app to provide authentication context.

```tsx
import { AuthProvider } from '@/lib/auth-context';

function App() {
  return (
    <AuthProvider>
      <YourApp />
    </AuthProvider>
  );
}
```

### useAuth Hook
Access authentication state and methods in components.

```tsx
import { useAuth } from '@/lib/auth-context';

function MyComponent() {
  const { user, loading, signIn, signUp, signOut } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please sign in</div>;

  return (
    <div>
      <h1>Welcome, {user.displayName}!</h1>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}
```

### AuthGuard
Protect routes that require authentication.

```tsx
import AuthGuard from '@/components/AuthGuard';

function ProtectedPage() {
  return (
    <AuthGuard>
      <div>This content is only visible to authenticated users</div>
    </AuthGuard>
  );
}
```

## Middleware

The app uses Next.js middleware to automatically protect routes:

- **Protected Routes**: All routes except `/auth` and API routes
- **Authentication Check**: Verifies JWT token in cookies
- **Automatic Redirects**: Redirects unauthenticated users to `/auth`

## Environment Variables

Required environment variables:

```env
# JWT Secret (generate a secure random string)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Database URL
DATABASE_URL="postgresql://username:password@localhost:5432/aristotle"
```

## Security Features

1. **HTTP-only Cookies**: Prevents JavaScript access to auth tokens
2. **Secure Flag**: Cookies are secure in production
3. **SameSite Protection**: Prevents CSRF attacks
4. **Password Hashing**: Uses bcrypt with 12 salt rounds
5. **JWT Expiration**: Tokens expire after 7 days
6. **Input Validation**: Server-side validation of all inputs

## Testing

Test the authentication system:

```bash
# Start the development server
npm run dev

# Test signup
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"testpass123","email":"test@example.com"}'

# Test signin
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"testpass123"}' \
  -c cookies.txt

# Test protected endpoint
curl -X GET http://localhost:3000/api/auth/me -b cookies.txt

# Test signout
curl -X POST http://localhost:3000/api/auth/signout -b cookies.txt
```

## Database Schema

The User model includes:

```prisma
model User {
  id          Int      @id @default(autoincrement())
  username    String   @unique
  email       String?  @unique
  password    String   // Hashed password
  displayName String?
  tz          String?  @default("America/Los_Angeles")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

## Troubleshooting

### Common Issues

1. **"Not authenticated" error**: Check if JWT_SECRET is set correctly
2. **Database connection issues**: Verify DATABASE_URL is correct
3. **Cookie not set**: Ensure credentials: 'include' is used in fetch requests
4. **Middleware redirects**: Check if the route is properly configured

### Debug Endpoints

Use `/api/debug-auth` to check authentication status:

```bash
curl -X GET http://localhost:3000/api/debug-auth -b cookies.txt
```

This will return detailed information about the current authentication state. 