// Global types untuk aplikasi Compressly

export interface ImageItem {
  id: string;
  file: File;
  originalSize: number;
  compressedFile?: File;
  compressedSize?: number;
  compressionRate?: number;
  status: 'pending' | 'compressing' | 'completed' | 'error';
  error?: string;
}

export interface CompressionRecord {
  id: string;
  user_id: string;
  original_size: number;
  compressed_size: number;
  compression_rate: number;
  file_name: string;
  image_type: string;
  created_at: string;
  updated_at: string;
}

export interface UserStats {
  totalSaved: number;
  totalImages: number;
  averageCompression: number;
}

export interface UploadResult {
  path: string;
  fullFileName: string;
  fullPath: string;
}

export interface ToastMessage {
  message: string;
  type: 'success' | 'error' | 'info';
}

// Supabase types
export interface Database {
  public: {
    Tables: {
      compressions: {
        Row: CompressionRecord;
        Insert: Omit<CompressionRecord, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<CompressionRecord, 'id' | 'created_at'>>;
      };
    };
  };
}
