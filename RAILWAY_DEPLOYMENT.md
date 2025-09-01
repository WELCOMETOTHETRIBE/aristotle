# 🚀 Railway Deployment Guide

## Environment Variables Required

Set these environment variables in your Railway project:

### Required Variables
```bash
# Database
DATABASE_URL=postgresql://username:password@host:port/database

# Authentication
JWT_SECRET=your-super-secure-jwt-secret-here

# OpenAI (for AI features)
OPENAI_API_KEY=sk-your-openai-api-key

# App Configuration
NEXT_PUBLIC_APP_NAME=Aristotle
NEXTAUTH_URL=https://your-app-name.up.railway.app
NEXTAUTH_SECRET=your-nextauth-secret-here
```

### Optional Variables
```bash
# Development/Production
NODE_ENV=production

# Additional Security
JWT_EXPIRES_IN=7d
```

## Deployment Steps

1. **Connect Repository**
   - Link your GitHub repository to Railway
   - Railway will automatically detect Next.js

2. **Set Environment Variables**
   - Go to your Railway project settings
   - Add all required environment variables above

3. **Database Setup**
   - Railway will automatically provision PostgreSQL
   - Copy the DATABASE_URL from Railway's database tab

4. **Deploy**
   - Railway will automatically build and deploy
   - Monitor the build logs for any issues

## Troubleshooting

### "Something went wrong" Error

If you see this error, check:

1. **Environment Variables**
   ```bash
   # Check if all required variables are set
   DATABASE_URL ✅
   JWT_SECRET ✅
   OPENAI_API_KEY ✅
   NEXT_PUBLIC_APP_NAME ✅
   ```

2. **Database Connection**
   - Verify DATABASE_URL is correct
   - Check if database is accessible
   - Run migrations: `npx prisma migrate deploy`

3. **Build Issues**
   - Check Railway build logs
   - Ensure all dependencies are in package.json
   - Verify TypeScript compilation

### Authentication Issues

1. **JWT Secret**
   - Ensure JWT_SECRET is set and secure
   - Generate a new secret: `openssl rand -base64 32`

2. **Auth Routes**
   - Check if `/api/auth/*` routes are working
   - Verify middleware configuration

3. **Database Tables**
   - Ensure User table exists
   - Check if migrations ran successfully

### Database Issues

1. **Connection**
   ```bash
   # Verify database connection
   npx prisma db push
   ```

2. **Migrations**
   ```bash
   # Run migrations
   npx prisma migrate deploy
   ```

3. **Seed Data**
   ```bash
   # Seed initial data
   npx prisma db seed
   ```

## Health Checks

### API Health Check
```bash
curl https://your-app-name.up.railway.app/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "service": "Aion - Aristotle-Inspired Life Coach"
}
```

### Database Health Check
```bash
curl https://your-app-name.up.railway.app/api/healthz
```

### Ready Check
```bash
curl https://your-app-name.up.railway.app/api/readyz
```

## Common Issues

### 1. Build Fails
- Check if all dependencies are in package.json
- Verify TypeScript compilation
- Check for syntax errors

### 2. Runtime Errors
- Check Railway logs
- Verify environment variables
- Verify database connection

### 3. Authentication Redirect Loop
- Check JWT_SECRET is set
- Verify auth routes are working
- Check middleware configuration

### 4. Database Connection Issues
- Verify DATABASE_URL format
- Check database permissions
- Run migrations manually

## Monitoring

### Railway Logs
- Monitor application logs in Railway dashboard
- Check for errors and warnings
- Monitor resource usage

### Health Monitoring
- Set up health check endpoints
- Monitor API response times
- Check database connection status

## Security Checklist

- [ ] JWT_SECRET is set and secure
- [ ] DATABASE_URL is private
- [ ] OPENAI_API_KEY is secure
- [ ] HTTPS is enabled
- [ ] Environment variables are not exposed
- [ ] Database has proper access controls

## Performance Optimization

1. **Database Indexing**
   - Ensure proper indexes on frequently queried fields
   - Monitor query performance

2. **Caching**
   - Implement Redis for session storage
   - Cache frequently accessed data

3. **CDN**
   - Use Railway's CDN for static assets
   - Optimize image delivery

## Support

If you continue to have issues:

1. Check Railway documentation
2. Review application logs
3. Test locally with production environment variables
4. Contact Railway support if needed 