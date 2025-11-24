'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Founder } from '@/lib/admin-types';
import { createFounder, updateFounder } from '../services/about-service';

interface FounderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  founder?: Founder | null;
  onSubmit: () => void;
}

export default function FounderDialog({
  open,
  onOpenChange,
  founder,
  onSubmit
}: FounderDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: founder?.name || '',
    role: founder?.role || '',
    description: founder?.description || '',
    photo_url: founder?.photo_url || ''
  });

  const handleSubmit = async (data: any) => {
    setLoading(true);
    try {
      if (founder) {
        // Update founder
        await updateFounder(founder.id, data);
      } else {
        // Create new founder
        await createFounder(data);
      }
      onSubmit();
      onOpenChange(false);
      setFormData({ name: '', role: '', description: '', photo_url: '' });
    } catch (error) {
      console.error('Error saving founder:', error);
      // Handle error appropriately
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{founder ? 'Edit Pendiri' : 'Tambah Pendiri Baru'}</DialogTitle>
        </DialogHeader>
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(formData);
          }}
          className="space-y-4"
        >
          <div>
            <label htmlFor="name" className="text-sm font-medium">Nama</label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full p-2 border rounded mt-1"
              required
            />
          </div>
          
          <div>
            <label htmlFor="role" className="text-sm font-medium">Peran</label>
            <input
              id="role"
              type="text"
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              className="w-full p-2 border rounded mt-1"
              required
            />
          </div>
          
          <div>
            <label htmlFor="photo_url" className="text-sm font-medium">URL Foto</label>
            <input
              id="photo_url"
              type="text"
              value={formData.photo_url}
              onChange={(e) => setFormData({...formData, photo_url: e.target.value})}
              className="w-full p-2 border rounded mt-1"
            />
          </div>
          
          <div>
            <label htmlFor="description" className="text-sm font-medium">Deskripsi</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full p-2 border rounded mt-1"
              rows={3}
              required
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="px-4 py-2 text-sm border rounded hover:bg-gray-100"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm bg-emerald-600 text-white rounded hover:bg-emerald-700 disabled:opacity-50"
            >
              {loading ? 'Menyimpan...' : founder ? 'Perbarui' : 'Simpan'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}