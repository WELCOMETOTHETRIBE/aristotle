# Railway Deployment Guide

## Overview

This guide covers deploying the Aristotle application to Railway, including handling of image uploads and storage in production.

## Current Status

- ✅ **Database**: PostgreSQL deployed and connected
- ✅ **API Routes**: All endpoints working
- ✅ **Authentication**: JWT-based auth system
- ✅ **Image Uploads**: Working with temporary file storage
- ⚠️ **Image Storage**: Temporary solution - needs cloud storage for production

## Image Storage Solution

### Current Implementation

The application now uses a **Storage Service** that handles both development and production environments:

- **Development**: Images stored in `/public/uploads/nature-photos/` (accessible via static file serving)
- **Production**: Images stored in `/temp-uploads/` (served via API route `/api/nature-photo/image/[filename]`)

### How It Works

1. **Upload**: Images are saved to environment-appropriate location
2. **Database**: Image paths are stored as URLs
3. **Serving**: Images are served via API route in production, static files in development

### API Endpoints

- `POST /api/nature-photo` - Upload new nature photo
- `GET /api/nature-photo/image/[filename]` - Serve image file (production)
- `GET /api/nature-photo?userId=X` - Get user's photos

## Production Considerations

### Current Limitations

1. **Temporary Storage**: Images are stored in Railway's ephemeral filesystem
2. **No Persistence**: Images will be lost on container restarts/redeploys
3. **Memory Usage**: Large images consume container memory

### Recommended Solutions

#### Option 1: Cloud Storage (Recommended)
```bash
# Add to environment variables
CLOUD_STORAGE_PROVIDER="aws" # or "gcp", "azure"
CLOUD_STORAGE_BUCKET="aristotle-nature-photos"
CLOUD_STORAGE_ACCESS_KEY="your-access-key"
CLOUD_STORAGE_SECRET_KEY="your-secret-key"
```

#### Option 2: Railway Volumes
```json
// railway.json
{
  "volumes": [
    {
      "name": "nature-photos",
      "mountPath": "/app/uploads"
    }
  ]
}
```

#### Option 3: External CDN
- Use services like Cloudinary, Imgix, or AWS CloudFront
- Handle image optimization and delivery
- Better performance and reliability

## Environment Variables

### Required for Production
```bash
# Database
DATABASE_URL="postgresql://..."

# JWT
JWT_SECRET="your-super-secret-jwt-key"

# Environment
NODE_ENV="production"

# OpenAI (if using AI features)
OPENAI_API_KEY="your-openai-api-key"
```

### Optional for Enhanced Features
```bash
# Cloud Storage
CLOUD_STORAGE_PROVIDER="aws"
CLOUD_STORAGE_BUCKET="your-bucket"
CLOUD_STORAGE_ACCESS_KEY="your-key"
CLOUD_STORAGE_SECRET_KEY="your-secret"

# Monitoring
RAILWAY_TOKEN="your-railway-token"
RAILWAY_PROJECT_ID="your-project-id"
```

## Deployment Steps

### 1. Build and Deploy
```bash
# Railway will automatically build and deploy on git push
git add .
git commit -m "Update image storage for production"
git push origin main
```

### 2. Verify Deployment
```bash
# Check Railway dashboard
# Verify database connection
# Test image upload functionality
```

### 3. Monitor Logs
```bash
# Check for any errors in Railway logs
# Monitor image upload success/failure rates
# Watch for storage-related issues
```

## Testing Production

### Image Upload Test
1. Navigate to the nature photo log widget
2. Upload a test image
3. Verify the image is saved and displayed
4. Check the API response for the correct image URL

### Expected Behavior
- **Upload**: Should succeed with 200 response
- **Storage**: Image saved to `/temp-uploads/` directory
- **Database**: Record created with URL like `/api/nature-photo/image/filename.jpg`
- **Display**: Image should load via the API route

## Troubleshooting

### Common Issues

#### 1. 404 Errors on Image Access
- Check if the image file exists in the correct directory
- Verify the API route is working
- Check Railway logs for file system errors

#### 2. Upload Failures
- Verify the uploads directory exists and is writable
- Check file permissions
- Monitor memory usage for large files

#### 3. Database Connection Issues
- Verify DATABASE_URL is correct
- Check if Railway PostgreSQL is running
- Verify network connectivity

### Debug Commands
```bash
# Check container logs
railway logs

# Access container shell
railway shell

# Check file system
ls -la /app/temp-uploads/
ls -la /app/public/uploads/

# Check environment
echo $NODE_ENV
echo $DATABASE_URL
```

## Future Improvements

### Phase 1: Cloud Storage Integration
- Implement AWS S3, Google Cloud Storage, or Azure Blob Storage
- Add image optimization and resizing
- Implement CDN for better performance

### Phase 2: Advanced Features
- Image metadata extraction
- Automatic tagging and categorization
- Backup and archival strategies
- Image versioning and history

### Phase 3: Monitoring and Analytics
- Upload success/failure tracking
- Storage usage monitoring
- Performance metrics
- Cost optimization

## Support

For issues related to:
- **Railway Deployment**: Check Railway documentation and support
- **Image Storage**: Review the storage service implementation
- **Database**: Verify Prisma configuration and connections
- **General App**: Check application logs and error messages

## Conclusion

The current implementation provides a working solution for production deployment with some limitations. For long-term production use, implementing cloud storage is recommended to ensure image persistence and better performance. 