import { writeFile, readFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export interface StorageService {
  saveImage(filename: string, imageData: string): Promise<string>;
  getImageUrl(filename: string): string;
  getImagePath(filename: string): string;
}

// Local storage implementation for development
class LocalStorageService implements StorageService {
  private baseDir: string;
  private publicUrl: string;

  constructor() {
    this.baseDir = join(process.cwd(), 'public', 'uploads', 'nature-photos');
    this.publicUrl = '/uploads/nature-photos';
  }

  async saveImage(filename: string, imageData: string): Promise<string> {
    // Ensure directory exists
    if (!existsSync(this.baseDir)) {
      await mkdir(this.baseDir, { recursive: true });
    }

    const filePath = join(this.baseDir, filename);
    const base64Data = imageData.replace(/^data:image\/[a-z]+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    
    await writeFile(filePath, buffer);
    return this.getImageUrl(filename);
  }

  getImageUrl(filename: string): string {
    return `${this.publicUrl}/${filename}`;
  }

  getImagePath(filename: string): string {
    return join(this.baseDir, filename);
  }
}

// Production storage implementation - store under public uploads for stable serving
class ProductionStorageService implements StorageService {
  private baseDir: string;
  private publicUrl: string;

  constructor() {
    // Use the same public uploads path in production so Next can serve it statically
    this.baseDir = join(process.cwd(), 'public', 'uploads', 'nature-photos');
    this.publicUrl = '/uploads/nature-photos';
  }

  async saveImage(filename: string, imageData: string): Promise<string> {
    if (!existsSync(this.baseDir)) {
      await mkdir(this.baseDir, { recursive: true });
    }

    const filePath = join(this.baseDir, filename);
    const base64Data = imageData.replace(/^data:image\/[a-z]+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    
    await writeFile(filePath, buffer);
    return this.getImageUrl(filename);
  }

  getImageUrl(filename: string): string {
    return `${this.publicUrl}/${filename}`;
  }

  getImagePath(filename: string): string {
    return join(this.baseDir, filename);
  }
}

// Factory function to get the appropriate storage service
export function getStorageService(): StorageService {
  if (process.env.NODE_ENV === 'production') {
    return new ProductionStorageService();
  }
  return new LocalStorageService();
}

// Helper function to generate unique filenames
export function generateUniqueFilename(userId: number, originalExtension: string = 'jpg'): string {
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(2, 15);
  return `nature_${userId}_${timestamp}_${randomId}.${originalExtension}`;
}

// Helper function to extract file extension from base64 data
export function getFileExtensionFromBase64(base64Data: string): string {
  const match = base64Data.match(/^data:image\/([a-z]+);base64,/);
  return match ? match[1] : 'jpg';
} 