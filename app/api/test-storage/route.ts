import { NextResponse } from 'next/server';
import { getStorageService } from '@/lib/storage-service';

export async function GET() {
  try {
    const storageService = getStorageService();
    const isProduction = process.env.NODE_ENV === 'production';
    
    return NextResponse.json({
      success: true,
      environment: process.env.NODE_ENV || 'development',
      isProduction,
      storageService: {
        type: isProduction ? 'ProductionStorageService' : 'LocalStorageService',
        baseDir: isProduction ? '/app/temp-uploads' : '/app/public/uploads/nature-photos',
        publicUrl: isProduction ? '/api/nature-photo/image' : '/uploads/nature-photos'
      },
      note: isProduction 
        ? 'Images will be stored in temp-uploads and served via API route'
        : 'Images will be stored in public/uploads and served as static files'
    });
  } catch (error) {
    console.error('Error testing storage service:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to test storage service' 
    }, { status: 500 });
  }
} 