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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { JobListing } from '@/lib/admin-types';

// Schema untuk form lowongan pekerjaan - requirements sebagai string karena input form hanya bisa string
const jobListingFormSchema = z.object({
  title: z.string().min(1, "Judul lowongan wajib diisi"),
  department: z.string().optional(),
  description: z.string().optional(),
  requirements: z.string().optional(), // Input form sebagai string, diproses menjadi array
  salary_range: z.string().optional(),
  location: z.string().optional(),
  employment_type: z.string().optional(),
  status: z.string().optional(),
  application_deadline: z.string().optional(),
});

type JobListingFormValues = z.infer<typeof jobListingFormSchema>;

// Interface untuk data lowongan pekerjaan yang telah diproses (dengan requirements sebagai array)
interface ProcessedJobListingData {
  title: string;
  department?: string;
  description?: string;
  requirements?: string[]; // Sudah diproses menjadi array
  salary_range?: string;
  location?: string;
  employment_type?: string;
  status?: string;
  application_deadline?: string;
}

interface JobListingFormProps {
  jobListing?: JobListing | null;
  onSubmit: (data: ProcessedJobListingData) => void; // Fungsi onSubmit sekarang menerima data yang telah diproses
  onCancel: () => void;
  loading?: boolean;
}

export default function JobListingForm({ jobListing, onSubmit, onCancel, loading = false }: JobListingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<JobListingFormValues>({
    resolver: zodResolver(jobListingFormSchema),
    defaultValues: {
      title: jobListing?.title || '',
      department: jobListing?.department || '',
      description: jobListing?.description || '',
      requirements: jobListing?.requirements ? jobListing.requirements.join(', ') : '',
      salary_range: jobListing?.salary_range || '',
      location: jobListing?.location || '',
      employment_type: jobListing?.employment_type || 'full-time',
      status: jobListing?.status || 'active',
      application_deadline: jobListing?.application_deadline || '',
    },
  });

  const handleSubmit = async (data: JobListingFormValues) => {
    setIsSubmitting(true);
    try {
      // Proses requirements menjadi array
      const requirementsArray = data.requirements 
        ? data.requirements.split(',').map(req => req.trim()).filter(req => req)
        : [];
      
      // Update data dengan requirements yang sudah diproses
      const formData: ProcessedJobListingData = {
        title: data.title,
        department: data.department,
        description: data.description,
        requirements: requirementsArray.length > 0 ? requirementsArray : undefined,
        salary_range: data.salary_range,
        location: data.location,
        employment_type: data.employment_type,
        status: data.status,
        application_deadline: data.application_deadline,
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
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Judul Lowongan *</FormLabel>
                <FormControl>
                  <Input placeholder="Posisi yang dibutuhkan" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="department"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Departemen</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih departemen" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="umum">Umum</SelectItem>
                    <SelectItem value="medis">Medis</SelectItem>
                    <SelectItem value="keperawatan">Keperawatan</SelectItem>
                    <SelectItem value="administrasi">Administrasi</SelectItem>
                    <SelectItem value="keuangan">Keuangan</SelectItem>
                    <SelectItem value="sdm">SDM</SelectItem>
                    <SelectItem value="it">IT</SelectItem>
                    <SelectItem value="pemasaran">Pemasaran</SelectItem>
                    <SelectItem value="farmasi">Farmasi</SelectItem>
                    <SelectItem value="laboratorium">Laboratorium</SelectItem>
                    <SelectItem value="radiologi">Radiologi</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="employment_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipe Pekerjaan</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih tipe pekerjaan" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="full-time">Penuh Waktu</SelectItem>
                    <SelectItem value="part-time">Paruh Waktu</SelectItem>
                    <SelectItem value="contract">Kontrak</SelectItem>
                    <SelectItem value="internship">Magang</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih status lowongan" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="active">Aktif</SelectItem>
                    <SelectItem value="filled">Terisi</SelectItem>
                    <SelectItem value="cancelled">Dibatalkan</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="salary_range"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rentang Gaji</FormLabel>
                <FormControl>
                  <Input placeholder="Contoh: Rp 5.000.000 - Rp 8.000.000" {...field} />
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
                  <Input placeholder="Lokasi kerja" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="application_deadline"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Batas Lamaran</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
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
              <FormLabel>Deskripsi Pekerjaan</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Deskripsi tentang pekerjaan dan tanggung jawab" 
                  rows={4}
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="requirements"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Persyaratan</FormLabel>
              <FormControl>
                <Input placeholder="Contoh: S1 Kedokteran, Minimal 2 tahun pengalaman" {...field} />
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
            {isSubmitting ? 'Memproses...' : jobListing ? 'Simpan Perubahan' : 'Simpan'}
          </Button>
        </div>
      </form>
    </Form>
  );
}