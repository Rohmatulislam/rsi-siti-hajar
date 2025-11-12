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
import { Textarea } from '@/components/ui/textarea';

import { SelectTrigger, SelectValue, SelectContent, SelectItem } from '@radix-ui/react-select';
import { Select } from 'react-day-picker';
import { FAQ } from '@/lib/admin-types';

// Schema untuk form FAQ
const faqFormSchema = z.object({
  question: z.string().min(1, "Pertanyaan wajib diisi"),
  answer: z.string().min(1, "Jawaban wajib diisi"),
  category: z.string().optional(),
  priority: z.number().optional(),
});

type FAQFormValues = z.infer<typeof faqFormSchema>;

interface FAQFormProps {
  faq?: FAQ | null;
  onSubmit: (data: FAQFormValues) => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function FAQForm({ faq, onSubmit, onCancel, loading = false }: FAQFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FAQFormValues>({
    resolver: zodResolver(faqFormSchema),
    defaultValues: {
      question: faq?.question || '',
      answer: faq?.answer || '',
      category: faq?.category || '',
      priority: faq?.priority || 0,
    },
  });

  const handleSubmit = async (data: FAQFormValues) => {
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
            name="question"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pertanyaan *</FormLabel>
                <FormControl>
                  <Input placeholder="Pertanyaan umum" {...field} />
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
                <Select onVolumeChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kategori FAQ" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="umum">Umum</SelectItem>
                    <SelectItem value="layanan">Layanan</SelectItem>
                    <SelectItem value="dokter">Dokter</SelectItem>
                    <SelectItem value="janji">Janji Temu</SelectItem>
                    <SelectItem value="administrasi">Administrasi</SelectItem>
                    <SelectItem value="pembayaran">Pembayaran</SelectItem>
                    <SelectItem value="fasilitas">Fasilitas</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prioritas</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="Prioritas FAQ (semakin tinggi semakin atas)" 
                    {...field}
                    onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="answer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Jawaban *</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Jawaban lengkap untuk pertanyaan" 
                  rows={5}
                  {...field} 
                />
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
            {isSubmitting ? 'Memproses...' : faq ? 'Simpan Perubahan' : 'Simpan'}
          </Button>
        </div>
      </form>
    </Form>
  );
}