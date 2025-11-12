'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import RichTextEditor from '@/components/rich-text-editor';
import ImageUpload from '@/components/image-upload';
import { Service, Doctor } from '@/lib/admin-types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Schema untuk form layanan - features dan reviews sebagai string karena input form hanya bisa string
const serviceFormSchema = z.object({
  category: z.string().optional(),
  title: z.string().min(1, "Judul layanan wajib diisi"),
  description: z.string().optional(), // Ini sekarang menerima HTML sebagai string
  image_url: z.string().optional(),
  contact_info: z.string().optional(),
  location: z.string().optional(),
  operating_hours: z.string().optional(),
  features: z.string().optional(), // Input form sebagai string, diproses menjadi array
  reviews: z.string().optional(), // Input form sebagai string, diproses menjadi array
});

type ServiceFormValues = z.infer<typeof serviceFormSchema>;

// Interface untuk data layanan yang telah diproses (dengan features dan reviews sebagai array)
interface ProcessedServiceData {
  category?: string;
  title: string;
  description?: string;
  image_url?: string;
  contact_info?: string;
  location?: string;
  operating_hours?: string;
  features?: string[]; // Sudah diproses menjadi array
  reviews?: string[]; // Sudah diproses menjadi array
}

interface ServiceFormProps {
  service?: Service | null;
  onSubmit: (data: ProcessedServiceData) => void; // Fungsi onSubmit sekarang menerima data yang telah diproses
  onCancel: () => void;
  loading?: boolean;
}

export default function ServiceForm({ service, onSubmit, onCancel, loading = false }: ServiceFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      category: service?.category || '',
      title: service?.title || '',
      description: service?.description || '',
      image_url: service?.image_url || '',
      contact_info: service?.contact_info || '',
      location: service?.location || '',
      operating_hours: service?.operating_hours || '',
      features: service?.features ? service.features.join(', ') : '',
      reviews: service?.reviews ? service.reviews.join(', ') : '',
    },
  });

  const handleSubmit = async (data: ServiceFormValues) => {
    setIsSubmitting(true);
    try {
      // Proses features menjadi array
      const featuresArray = data.features 
        ? data.features.split(',').map(feature => feature.trim()).filter(feature => feature)
        : [];
      
      // Proses reviews menjadi array
      const reviewsArray = data.reviews 
        ? data.reviews.split(',').map(review => review.trim()).filter(review => review)
        : [];
      
      // Update data dengan arrays yang sudah diproses
      const formData: ProcessedServiceData = {
        category: data.category,
        title: data.title,
        description: data.description,
        image_url: data.image_url,
        contact_info: data.contact_info,
        location: data.location,
        operating_hours: data.operating_hours,
        features: featuresArray.length > 0 ? featuresArray : undefined,
        reviews: reviewsArray.length > 0 ? reviewsArray : undefined,
      };
      
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kategori</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kategori layanan" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="instalasi">Instalasi</SelectItem>
                    <SelectItem value="unggulan">Unggulan</SelectItem>
                    <SelectItem value="penunjang">Penunjang</SelectItem>
                    <SelectItem value="rawat-jalan">Rawat Jalan</SelectItem>
                    <SelectItem value="rawat-inap">Rawat Inap</SelectItem>
                    <SelectItem value="gawat-darurat">Gawat Darurat</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Judul Layanan *</FormLabel>
                <FormControl>
                  <Input placeholder="Judul layanan" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="contact_info"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Informasi Kontak</FormLabel>
                <FormControl>
                  <Input placeholder="Contoh: (0370) 623xxx" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lokasi</FormLabel>
                <FormControl>
                  <Input placeholder="Lokasi layanan" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="operating_hours"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Jam Operasional</FormLabel>
                <FormControl>
                  <Input placeholder="Contoh: 07:00 - 16:00 WITA" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="image_url"
            render={({ field: { onChange, value } }) => (
              <FormItem>
                <FormLabel>Gambar Layanan</FormLabel>
                <FormControl>
                  <ImageUpload 
                    value={value || undefined}
                    onChange={onChange}
                    folder="services"
                    label="Upload Gambar Layanan"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deskripsi</FormLabel>
              <FormControl>
                <RichTextEditor
                  content={field.value || ''}
                  onUpdate={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="features"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fitur Layanan</FormLabel>
              <FormControl>
                <Input placeholder="Contoh: Laboratorium, Radiologi, ICU" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="reviews"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ulasan</FormLabel>
              <FormControl>
                <Input placeholder="Contoh: Ulasan positif 1, Ulasan positif 2" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end space-x-2 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Batal
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting || loading}
          >
            {isSubmitting ? 'Memproses...' : service ? 'Simpan Perubahan' : 'Simpan'}
          </Button>
        </div>
      </form>
    </Form>
  );
}