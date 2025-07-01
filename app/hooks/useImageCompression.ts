import { useState, useCallback } from 'react';
import imageCompression from 'browser-image-compression';
import { ImageItem } from '@/app/types';

export function useImageCompression() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);

  const addImages = useCallback((files: File[]) => {
    const newImages: ImageItem[] = files.map((file) => ({
      id: crypto.randomUUID(),
      file,
      originalSize: file.size,
      status: 'pending' as const,
    }));
    
    setImages(prev => [...prev, ...newImages]);
  }, []);

  const compressImages = useCallback(async () => {
    setIsCompressing(true);
    
    const compressionOptions = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      fileType: 'image/jpeg',
    };

    try {
      const updatedImages = await Promise.all(
        images.map(async (image) => {
          if (image.status !== 'pending') return image;

          try {
            setImages(prev => 
              prev.map(img => 
                img.id === image.id 
                  ? { ...img, status: 'compressing' as const }
                  : img
              )
            );

            const compressedFile = await imageCompression(
              image.file, 
              compressionOptions
            );

            const compressionRate = Math.round(
              ((image.originalSize - compressedFile.size) / image.originalSize) * 100
            );

            return {
              ...image,
              compressedFile,
              compressedSize: compressedFile.size,
              compressionRate,
              status: 'completed' as const,
            };
          } catch (error) {
            return {
              ...image,
              status: 'error' as const,
              error: error instanceof Error ? error.message : 'Compression failed',
            };
          }
        })
      );

      setImages(updatedImages);
    } finally {
      setIsCompressing(false);
    }
  }, [images]);

  const removeImage = useCallback((id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setImages([]);
  }, []);

  return {
    images,
    isCompressing,
    addImages,
    compressImages,
    removeImage,
    clearAll,
  };
}
