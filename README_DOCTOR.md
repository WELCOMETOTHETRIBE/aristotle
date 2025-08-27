# 🏥 Aristotle Project Doctor

A comprehensive self-healing system for your Aristotle app that detects, reproduces, and fixes broken buttons, API routes, schemas, and environment/config issues.

## 🚀 Quick Start

### Run the Doctor
```bash
npm run doctor
```

### Run Full Verification
```bash
npm run verify
```

### Access the Dashboard
Visit `/__doctor` in your browser to see the interactive health dashboard.

## 🎯 What the Doctor Does

### 1. **Health Checks**
- ✅ Environment variable validation
- ✅ Database connection testing
- ✅ API route validation
- ✅ Audio file verification
- ✅ TTS system testing

### 2. **Auto-Fixes**
- 🔧 Missing environment variables
- 🔧 Database schema issues
- 🔧 Missing audio files
- 🔧 TypeScript errors
- 🔧 Linting issues

### 3. **Testing**
- 🧪 Unit tests for API routes
- 🧪 Component smoke tests
- 🧪 E2E tests with Playwright
- 🧪 Mobile responsiveness tests

### 4. **Monitoring**
- 📊 Real-time health dashboard
- 📊 Error logging and tracking
- 📊 Performance monitoring
- 📊 Client-side error capture

## 📋 Available Commands

```bash
# Run the doctor (auto-fix and report)
npm run doctor

# Type checking
npm run typecheck

# Lint and auto-fix
npm run lint:fix

# Run all tests
npm run test

# Run E2E tests
npm run e2e

# Full verification (typecheck + tests + e2e)
npm run verify
```

## 🏥 Doctor Dashboard

Visit `/__doctor` to access the interactive dashboard that shows:

- **Environment Status**: Missing/present environment variables
- **Database Health**: Connection status and errors
- **Audio System**: Breathwork audio file status
- **TTS System**: OpenAI TTS API status
- **Client Errors**: Real-time error tracking
- **Test Results**: Latest test run results

## 🔧 Auto-Fixes

The Doctor automatically fixes common issues:

### Environment Variables
- Adds missing variables to `.env.local.example`
- Validates required variables are set

### Database Issues
- Tests Prisma connection
- Validates schema
- Provides connection troubleshooting

### Audio Files
- Generates missing breathwork audio files
- Validates audio mapping exists
- Tests TTS API connectivity

### Code Quality
- Runs TypeScript type checking
- Fixes linting issues
- Validates API schemas

## 🧪 Testing Strategy

### Unit Tests
- API route validation
- Schema validation
- Error handling

### Component Tests
- Smoke tests for key components
- Accessibility checks
- Mobile responsiveness

### E2E Tests
- Full user flows
- Clickable element testing
- Error scenario testing

## 📊 Error Tracking

The Doctor tracks errors in multiple ways:

### Server-Side
- Structured logging with `lib/log.ts`
- Request ID tracking
- Error categorization

### Client-Side
- Global error boundary
- Unhandled promise rejection tracking
- Clickable element monitoring

### Dashboard
- Real-time error display
- Error history
- Diagnostic information

## 🎯 Aristotle-Specific Features

### Audio System Validation
- Breathwork audio file checks
- TTS API connectivity
- Audio mapping validation

### Database Fallback Testing
- Tests graceful degradation
- Validates fallback data
- Connection error handling

### Mobile UI Testing
- Responsive design validation
- Touch interaction testing
- Mobile-specific error scenarios

## 🔍 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   ```bash
   # Check DATABASE_URL is set
   echo $DATABASE_URL
   
   # Test connection manually
   npx prisma db push
   ```

2. **Audio Files Missing**
   ```bash
   # Regenerate audio files
   npm run generate-breathwork-audio
   ```

3. **Environment Variables Missing**
   ```bash
   # Check .env.local
   cat .env.local
   
   # Copy from example
   cp .env.local.example .env.local
   ```

4. **Tests Failing**
   ```bash
   # Run tests individually
   npm run test
   npm run e2e
   
   # Check for specific failures
   npm run test -- --reporter=verbose
   ```

### Getting Help

1. **Check the Dashboard**: Visit `/__doctor` for real-time status
2. **Run the Doctor**: `npm run doctor` for auto-fixes
3. **Review Logs**: Check `doctor-report.json` for detailed analysis
4. **Manual Verification**: Run `npm run verify` for full validation

## 🚀 Production Deployment

Before deploying to production:

1. **Run Full Verification**
   ```bash
   npm run verify
   ```

2. **Check Health Dashboard**
   - Visit `/__doctor`
   - Ensure all systems are green

3. **Review Doctor Report**
   ```bash
   npm run doctor
   cat doctor-report.json
   ```

4. **Set Environment Variables**
   - Ensure all required variables are set
   - Test database connectivity
   - Validate API keys

## 📈 Continuous Monitoring

The Doctor provides continuous monitoring through:

- **Health Endpoint**: `/api/__health` for external monitoring
- **Error Tracking**: Real-time error capture and reporting
- **Performance Metrics**: Response time and error rate tracking
- **Automated Alerts**: Dashboard notifications for issues

---

*"The whole is greater than the sum of its parts." - Aristotle*

The Project Doctor ensures your Aristotle app is healthy, reliable, and ready for production! 🏥✨
