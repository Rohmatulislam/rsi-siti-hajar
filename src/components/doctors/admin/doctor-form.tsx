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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Doctor } from '@/lib/admin-types';
import { useAuth } from '@clerk/nextjs';

// Schema untuk form dokter - certifications sebagai string karena input form hanya bisa string
const doctorFormSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  specialty: z.string().min(1, "Spesialisasi wajib diisi"),
  user_id: z.string().optional(), // Menyertakan user_id untuk mengaitkan dengan akun pengguna
  image_url: z.string().optional(),
  description: z.string().optional(),
  experience_years: z.number().min(0, "Tahun pengalaman minimal 0").optional(),
  education: z.string().optional(),
  certifications: z.string().optional(), // Input form sebagai string, diproses menjadi array
  consultation_fee: z.number().min(0, "Biaya konsultasi minimal 0").optional(),
  slug: z.string().optional(),
  // Field tambahan untuk sistem Poli Eksekutif
  is_executive: z.boolean().optional(),
  kd_dokter: z.string().optional(),
  sip: z.string().optional(),
  bpjs: z.boolean().optional(),
});

type DoctorFormValues = z.infer<typeof doctorFormSchema>;

// Interface untuk data dokter yang telah diproses (dengan certifications sebagai array)
interface ProcessedDoctorData {
  name: string;
  specialty: string;
  user_id?: string; // Menyertakan user_id untuk mengaitkan dengan akun pengguna
  image_url?: string;
  description?: string;
  experience_years?: number;
  education?: string;
  certifications?: string[]; // Sudah diproses menjadi array
  consultation_fee?: number;
  slug?: string;
  // Field tambahan untuk sistem Poli Eksekutif
  is_executive?: boolean;
  kd_dokter?: string;
  sip?: string;
  bpjs?: boolean;
}

interface DoctorFormProps {
  doctor?: Doctor | null;
  onSubmit: (data: ProcessedDoctorData) => void; // Fungsi onSubmit sekarang menerima data yang telah diproses
  onCancel: () => void;
  loading?: boolean;
}

export default function DoctorForm({ doctor, onSubmit, onCancel, loading = false }: DoctorFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { userId } = useAuth(); // Mendapatkan userId dari auth

  const form = useForm<DoctorFormValues>({
    resolver: zodResolver(doctorFormSchema),
    defaultValues: {
      name: doctor?.name || '',
      specialty: doctor?.specialty || '',
      user_id: doctor?.user_id || userId || '', // Gunakan user_id dari dokter yang diedit atau userId dari auth
      image_url: doctor?.image_url || '',
      description: doctor?.description || '',
      experience_years: doctor?.experience_years || 0,
      education: doctor?.education || '',
      certifications: doctor?.certifications ? doctor.certifications.join(', ') : '',
      consultation_fee: doctor?.consultation_fee || 0,
      slug: doctor?.slug || '',
      // Default values untuk field tambahan
      is_executive: doctor?.is_executive || false,
      kd_dokter: doctor?.kd_dokter || '',
      sip: doctor?.sip || '',
      bpjs: doctor?.bpjs || false,
    },
  });

  const watchName = form.watch('name');

  // Efek untuk memperbarui slug ketika nama berubah (hanya untuk dokter baru)
  useEffect(() => {
    if (watchName && !doctor) {
      // Hanya untuk dokter baru, buat slug otomatis dari nama
      const slug = watchName
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');

      form.setValue('slug', slug);
    }
  }, [watchName, doctor, form]);

  const handleSubmit = async (data: DoctorFormValues) => {
    setIsSubmitting(true);
    try {
      // Proses certifications menjadi array
      const certificationsArray = data.certifications
        ? data.certifications.split(',').map(cert => cert.trim()).filter(cert => cert)
        : [];

      // Update data dengan certifications yang sudah diproses
      const formData: ProcessedDoctorData = {
        name: data.name,
        specialty: data.specialty,
        user_id: data.user_id, // Sertakan user_id
        image_url: data.image_url,
        description: data.description,
        experience_years: data.experience_years,
        education: data.education,
        certifications: certificationsArray.length > 0 ? certificationsArray : undefined,
        consultation_fee: data.consultation_fee,
        slug: data.slug,
        // Field tambahan untuk sistem Poli Eksekutif
        is_executive: data.is_executive,
        kd_dokter: data.kd_dokter,
        sip: data.sip,
        bpjs: data.bpjs,
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Lengkap *</FormLabel>
                <FormControl>
                  <Input placeholder="Nama dokter" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="specialty"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Spesialisasi *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih spesialisasi dokter" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Jiwa">Jiwa</SelectItem>
                    <SelectItem value="Penyakit Dalam">Penyakit Dalam</SelectItem>
                    <SelectItem value="Anak">Anak</SelectItem>
                    <SelectItem value="Bedah">Bedah</SelectItem>
                    <SelectItem value="Kandungan">Kandungan</SelectItem>
                    <SelectItem value="Mata">Mata</SelectItem>
                    <SelectItem value="THT">THT</SelectItem>
                    <SelectItem value="Kulit & Kelamin">Kulit & Kelamin</SelectItem>
                    <SelectItem value="Gigi & Mulut">Gigi & Mulut</SelectItem>
                    <SelectItem value="Saraf">Saraf</SelectItem>
                    <SelectItem value="Orthopedi">Orthopedi</SelectItem>
                    <SelectItem value="Jantung">Jantung</SelectItem>
                    <SelectItem value="Paru-Paru">Paru-Paru</SelectItem>
                    <SelectItem value="Urologi">Urologi</SelectItem>
                    <SelectItem value="Radiologi">Radiologi</SelectItem>
                    <SelectItem value="Anestesiologi">Anestesiologi</SelectItem>
                    <SelectItem value="Rehabilitasi Medik">Rehabilitasi Medik</SelectItem>
                    <SelectItem value="Patologi">Patologi</SelectItem>
                    <SelectItem value="Farmasi">Farmasi</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="education"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pendidikan</FormLabel>
                <FormControl>
                  <Input placeholder="Contoh: Fakultas Kedokteran Universitas Indonesia" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="experience_years"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tahun Pengalaman</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Tahun pengalaman"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="consultation_fee"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Biaya Konsultasi</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Biaya konsultasi"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : 0)}
                  />
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
                <FormLabel>Foto Dokter</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={value || undefined}
                    onChange={onChange}
                    folder="doctors"
                    label="Upload Foto Dokter"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="certifications"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sertifikasi</FormLabel>
              <FormControl>
                <Input placeholder="Contoh: Spesialis Penyakit Dalam, Spesialis Jantung" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
        {/* Section untuk field-field tambahan sistem Poli Eksekutif */}
        <div className="border-t border-gray-200 pt-6 mt-6">
          <h3 className="text-lg font-medium mb-4">Pengaturan Poli Eksekutif</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="is_executive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <input
                      type="checkbox"
                      className="mt-1 h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                      checked={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Dokter Eksekutif
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bpjs"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <input
                      type="checkbox"
                      className="mt-1 h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                      checked={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Melayani BPJS
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="kd_dokter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kode Dokter (SIMRS)</FormLabel>
                  <FormControl>
                    <Input placeholder="Kode dokter dari SIMRS Khanza" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sip"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SIP (Surat Izin Praktik)</FormLabel>
                  <FormControl>
                    <Input placeholder="Nomor Surat Izin Praktik" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

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
            {isSubmitting ? 'Memproses...' : doctor ? 'Simpan Perubahan' : 'Simpan'}
          </Button>
        </div>
      </form>
    </Form>
  );
}