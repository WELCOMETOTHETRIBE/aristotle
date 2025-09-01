import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { getStorageService } from '@/lib/storage-service';

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const { filename } = params;
    
    if (!filename) {
      return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
    }

    // Get storage service for current environment
    const storageService = getStorageService();
    const filePath = storageService.getImagePath(filename);

    try {
      // Read the file
      const imageBuffer = await readFile(filePath);
      
      // Determine content type based on file extension
      const ext = filename.split('.').pop()?.toLowerCase();
      let contentType = 'image/jpeg'; // default
      
      if (ext === 'png') contentType = 'image/png';
      else if (ext === 'gif') contentType = 'image/gif';
      else if (ext === 'webp') contentType = 'image/webp';

      // Return the image with appropriate headers
      return new NextResponse(imageBuffer, {
        status: 200,
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
          'Access-Control-Allow-Origin': '*',
        },
      });
    } catch (readError) {
      console.error('Error reading image file:', readError);
      return NextResponse.json({ error: 'Failed to read image file' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error serving nature photo image:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 