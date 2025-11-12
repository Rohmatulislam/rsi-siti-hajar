'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string | null) => void;
  folder?: string;
  label?: string;
  className?: string;
}

export default function ImageUpload({ 
  value, 
  onChange, 
  folder = 'doctors', 
  label = 'Upload Foto',
  className = '' 
}: ImageUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Validasi tipe file
      const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
      if (!validTypes.includes(selectedFile.type)) {
        alert('Format file tidak didukung. Harap gunakan file PNG, JPG, atau JPEG.');
        return;
      }
      
      // Validasi ukuran file (maksimal 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        alert('Ukuran file terlalu besar. Maksimal 5MB diizinkan.');
        return;
      }
      
      setFile(selectedFile);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('Upload error:', result.error);
        alert('Gagal mengupload gambar: ' + result.error);
        return;
      }

      if (result.url) {
        onChange(result.url);
        console.log('Image uploaded successfully:', result.url);
      }
    } catch (error: any) {
      console.error('Error uploading image:', error);
      alert('Gagal mengupload gambar: ' + (error?.message || 'Terjadi kesalahan tidak terduga'));
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setFile(null);
    setPreview(null);
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {label && <Label>{label}</Label>}
      
      <div className="flex flex-col items-center space-y-4">
        {preview ? (
          <div className="relative">
            <img 
              src={preview} 
              alt="Preview" 
              className="w-32 h-32 rounded-full object-cover border-2 border-gray-300"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute -top-2 -right-2 rounded-full h-6 w-6 p-0"
              onClick={handleRemove}
            >
              ×
            </Button>
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-full w-32 h-32 flex items-center justify-center bg-gray-50">
            <span className="text-gray-500 text-sm">No Image</span>
          </div>
        )}
        
        <div className="flex flex-col items-center space-y-2">
          <div className="flex space-x-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".png,.jpg,.jpeg"
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              Pilih Gambar
            </Button>
            
            {file && (
              <Button
                type="button"
                onClick={handleUpload}
                disabled={uploading}
              >
                {uploading ? 'Mengupload...' : 'Upload'}
              </Button>
            )}
            
            {preview && !file && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleRemove}
              >
                Hapus
              </Button>
            )}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Format yang didukung: PNG, JPG, JPEG (Maks. 5MB)</p>
        </div>
      </div>
    </div>
  );
}