'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useState } from 'react';

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
import { Switch } from '@/components/ui/switch';

import { 
  Select,
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Article } from '@/lib/admin-types';

// Schema untuk form artikel
const articleFormSchema = z.object({
  title: z.string().min(1, "Judul artikel wajib diisi"),
  slug: z.string().optional(),
  content: z.string().optional(),
  image_url: z.string().optional(),
  category: z.string().min(1, "Kategori artikel wajib dipilih"),
  excerpt: z.string().optional(),
  published: z.boolean().optional(),
});

type ArticleFormValues = z.infer<typeof articleFormSchema>;

interface ArticleFormProps {
  article?: Article | null;
  onSubmit: (data: ArticleFormValues) => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function ArticleForm({ article, onSubmit, onCancel, loading = false }: ArticleFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ArticleFormValues>({
    resolver: zodResolver(articleFormSchema),
    defaultValues: {
      title: article?.title || '',
      slug: article?.slug || '',
      content: article?.content || '',
      image_url: article?.image_url || '',
      category: article?.category || '',
      excerpt: article?.excerpt || '',
      published: article?.published || false,
    },
  });

  const handleSubmit = async (data: ArticleFormValues) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
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
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Judul Artikel *</FormLabel>
                <FormControl>
                  <Input placeholder="Judul artikel" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input placeholder="Slug artikel (otomatis dibuat jika kosong)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kategori</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih kategori artikel" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="kesehatan">🏥 Kesehatan</SelectItem>
                    <SelectItem value="gaya-hidup">🏃 Gaya Hidup</SelectItem>
                    <SelectItem value="nutrisi">🥗 Nutrisi</SelectItem>
                    <SelectItem value="penyakit">🩺 Penyakit</SelectItem>
                    <SelectItem value="obat">💊 Obat</SelectItem>
                    <SelectItem value="kehamilan">🤰 Kehamilan</SelectItem>
                    <SelectItem value="anak">👶 Anak</SelectItem>
                    <SelectItem value="lansia">👵 Lansia</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="image_url"
            render={({ field: { onChange, value } }) => (
              <FormItem>
                <FormLabel>Gambar Artikel</FormLabel>
                <FormControl>
                  <ImageUpload 
                    value={value || undefined}
                    onChange={onChange}
                    folder="articles"
                    label="Upload Gambar Artikel"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="excerpt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ringkasan</FormLabel>
              <FormControl>
                <RichTextEditor
                  content={field.value || ''}
                  onUpdate={field.onChange}
                  placeholder="Tulis ringkasan artikel di sini..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Konten Artikel</FormLabel>
              <FormControl>
                <RichTextEditor
                  content={field.value || ''}
                  onUpdate={field.onChange}
                  placeholder="Tulis konten lengkap artikel di sini..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="published"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Publikasikan</FormLabel>
                <FormMessage />
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
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
            {isSubmitting ? 'Memproses...' : article ? 'Simpan Perubahan' : 'Simpan'}
          </Button>
        </div>
      </form>
    </Form>
  );
}