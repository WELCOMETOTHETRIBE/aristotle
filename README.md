# Aristotle - Ancient Wisdom Wellness System

A comprehensive wellness system based on ancient philosophical wisdom and modern science, built with Next.js 14, TypeScript, and Prisma.

## 🚀 Production Status

✅ **Production Ready** - All critical issues resolved
- ✅ Type-safe with strict TypeScript
- ✅ Comprehensive error handling and logging
- ✅ Security headers and input validation
- ✅ CI/CD pipeline with automated testing
- ✅ Health checks and monitoring
- ✅ Docker containerization

## 🌟 Features

### 🎯 **Core Functionality**
- **Voice-First Design**: Natural conversations through voice input and output
- **Aristotle-Inspired Coaching**: AI coach based on ancient wisdom for modern flourishing
- **Real-Time Processing**: Instant voice transcription and AI responses
- **Evolving Memory**: AI that remembers your values and learns from interactions
- **Structured Plans**: Concrete, actionable steps for goal achievement
- **Hedonic Awareness**: Monitor patterns to break unhealthy habits

### 🧘 **Wellness Tools**
- **Breathwork Timer**: Guided breathing exercises with multiple patterns
- **Fasting Tracker**: Comprehensive fasting protocols with benefit analysis
- **Habit Tracking**: Build and maintain positive habits
- **Goal Management**: Set and track progress toward meaningful goals

### 🎨 **Modern UI/UX**
- **Glass Morphism Design**: Beautiful, modern interface
- **Responsive Layout**: Works seamlessly on all devices
- **Dark/Light Mode**: Adaptive theming
- **Smooth Animations**: Engaging user experience

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ 
- pnpm (recommended) or npm
- PostgreSQL database
- OpenAI API key (optional)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd aristotle
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.local.example .env.local
   ```
   
   Edit `.env.local` and add your configuration:
   ```env
   # Required
   DATABASE_URL="postgresql://username:password@localhost:5432/aristotle"
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
   
   # Optional
   OPENAI_API_KEY="your-openai-api-key"
   RAILWAY_TOKEN="your-railway-token"
   RAILWAY_PROJECT_ID="your-railway-project-id"
   
   # Environment
   NODE_ENV="development"
   LOG_LEVEL="info"
   ```

4. **Set up the database**
   ```bash
   pnpm prisma generate
   pnpm prisma db push
   pnpm prisma db seed
   ```

5. **Start the development server**
   ```bash
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Testing

```bash
# Run all tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Run E2E tests
pnpm e2e

# Run type checking
pnpm typecheck

# Run linting
pnpm lint
```

## 🏗️ Production Deployment

### Railway Deployment (Recommended)

1. **Connect to Railway**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login to Railway
   railway login
   
   # Link your project
   railway link
   ```

2. **Set environment variables in Railway dashboard**
   - `DATABASE_URL`: PostgreSQL connection string
   - `JWT_SECRET`: Secure random string (32+ characters)
   - `NODE_ENV`: "production"
   - `LOG_LEVEL`: "info"
   - `OPENAI_API_KEY`: Your OpenAI API key

3. **Deploy**
   ```bash
   railway up
   ```

### Docker Deployment

1. **Build the Docker image**
   ```bash
   docker build -t aristotle .
   ```

2. **Run the container**
   ```bash
   docker run -p 3000:3000 \
     -e DATABASE_URL="your-database-url" \
     -e JWT_SECRET="your-jwt-secret" \
     -e NODE_ENV="production" \
     aristotle
   ```

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `JWT_SECRET` | Yes | Secret key for JWT tokens (32+ chars) |
| `NODE_ENV` | No | Environment (development/production) |
| `LOG_LEVEL` | No | Logging level (info/debug/error) |
| `OPENAI_API_KEY` | No | OpenAI API key for AI features |
| `RAILWAY_TOKEN` | No | Railway deployment token |
| `RAILWAY_PROJECT_ID` | No | Railway project ID |

## 📊 Monitoring & Health Checks

### Health Endpoints

- **Health Check**: `GET /api/healthz`
  ```json
  {
    "ok": true,
    "timestamp": "2024-01-01T00:00:00.000Z",
    "version": "0.1.0",
    "environment": "production",
    "uptime": 3600
  }
  ```

- **Readiness Check**: `GET /api/readyz`
  ```json
  {
    "ok": true,
    "timestamp": "2024-01-01T00:00:00.000Z",
    "version": "0.1.0",
    "services": {
      "database": "connected"
    }
  }
  ```

### Logging

The application uses structured logging with Pino:

```bash
# View logs in development
pnpm dev

# View logs in production (Railway)
railway logs

# View logs in Docker
docker logs <container-id>
```

## 🔧 Development

### Project Structure

```
aristotle/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   └── frameworks/        # Framework pages
├── components/            # React components
├── lib/                   # Utility libraries
│   ├── config/           # Configuration
│   ├── db.ts             # Database client
│   └── logger.ts         # Logging
├── prisma/               # Database schema
├── public/               # Static assets
└── tests/                # Test files
```

### Database Schema

The application uses Prisma with PostgreSQL:

```bash
# Generate Prisma client
pnpm prisma generate

# Run migrations
pnpm prisma migrate deploy

# View database
pnpm prisma studio

# Reset database
pnpm prisma db push --force-reset
```

### Adding New Features

1. **Create feature branch**
   ```bash
   git checkout -b feature/new-feature
   ```

2. **Implement feature**
   - Add TypeScript types
   - Write tests
   - Update documentation

3. **Run checks**
   ```bash
   pnpm typecheck
   pnpm lint
   pnpm test
   ```

4. **Create pull request**
   - CI/CD will run automatically
   - All checks must pass

## 🚨 Troubleshooting

### Common Issues

**Build fails with TypeScript errors**
```bash
# Fix TypeScript errors
pnpm typecheck

# Or temporarily ignore (not recommended for production)
# Add // @ts-ignore comments
```

**Database connection issues**
```bash
# Check database URL
echo $DATABASE_URL

# Test connection
pnpm prisma db push

# Reset database
pnpm prisma db push --force-reset
```

**Health checks failing**
```bash
# Check application logs
railway logs

# Verify environment variables
railway variables

# Test health endpoints
curl https://your-app.railway.app/api/healthz
```

### Performance Issues

**Slow database queries**
- Check Prisma query logs
- Add database indexes
- Optimize N+1 queries

**High memory usage**
- Monitor with Railway metrics
- Check for memory leaks
- Optimize bundle size

## 🔒 Security

### Security Features

- ✅ Input validation with Zod
- ✅ JWT token authentication
- ✅ Security headers (CSP, XSS protection)
- ✅ Rate limiting on API endpoints
- ✅ SQL injection prevention (Prisma)
- ✅ XSS protection
- ✅ CSRF protection

### Security Checklist

- [ ] JWT_SECRET is 32+ characters
- [ ] DATABASE_URL is secure
- [ ] Environment variables are set
- [ ] Security headers are enabled
- [ ] Rate limiting is configured
- [ ] Input validation is in place

## 📈 Performance

### Optimization Features

- ✅ Next.js 14 App Router
- ✅ Server Components
- ✅ Image optimization
- ✅ Bundle splitting
- ✅ Caching strategies
- ✅ Database query optimization

### Performance Monitoring

```bash
# Build analysis
pnpm build

# Bundle analysis
pnpm analyze

# Performance testing
pnpm test:e2e
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Run all checks
6. Submit a pull request

### Development Standards

- TypeScript strict mode
- ESLint + Prettier
- Unit tests for utilities
- E2E tests for critical paths
- Conventional commits

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [README.md](README.md)
- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-repo/discussions)

## 🏃‍♂️ Runbook

### Emergency Procedures

**Application Down**
1. Check Railway dashboard
2. View application logs
3. Verify environment variables
4. Restart application if needed

**Database Issues**
1. Check database connection
2. Verify DATABASE_URL
3. Check Prisma migrations
4. Contact database provider

**Performance Issues**
1. Check Railway metrics
2. Review application logs
3. Monitor database queries
4. Scale resources if needed

### Maintenance

**Regular Tasks**
- Monitor application logs
- Check health endpoints
- Review security updates
- Update dependencies
- Backup database

**Deployment Checklist**
- [ ] All tests pass
- [ ] TypeScript compilation successful
- [ ] Environment variables set
- [ ] Database migrations applied
- [ ] Health checks passing
- [ ] Performance monitoring active
