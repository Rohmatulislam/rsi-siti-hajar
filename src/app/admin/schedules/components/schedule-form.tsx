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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, User, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { Schedule } from '@/lib/admin-types';

// Schema untuk form jadwal
const scheduleFormSchema = z.object({
  doctor_id: z.string().min(1, "Dokter wajib dipilih"),
  date: z.string().min(1, "Tanggal wajib dipilih"),
  start_time: z.string().min(1, "Jam mulai wajib diisi"),
  end_time: z.string().min(1, "Jam selesai wajib diisi"),
  available: z.boolean().optional(),
})
.refine((data) => {
  // Validasi bahwa waktu mulai sebelum waktu selesai
  if (data.start_time && data.end_time && data.start_time >= data.end_time) {
    return false;
  }
  return true;
}, {
  message: "Jam mulai harus lebih awal dari jam selesai",
  path: ["end_time"],
});

type ScheduleFormValues = z.infer<typeof scheduleFormSchema>;

interface ScheduleFormProps {
  schedule?: Schedule | null;
  doctors: { id: string; name: string; specialty: string }[];
  onSubmit: (data: ScheduleFormValues) => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function ScheduleForm({ schedule, doctors, onSubmit, onCancel, loading = false }: ScheduleFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ScheduleFormValues>({
    resolver: zodResolver(scheduleFormSchema),
    defaultValues: {
      doctor_id: schedule?.doctor_id || '',
      date: schedule?.date || '',
      start_time: schedule?.start_time || '',
      end_time: schedule?.end_time || '',
      available: schedule?.available !== undefined ? schedule.available : true,
    },
  });

  const handleSubmit = async (data: ScheduleFormValues) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informasi Dokter
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="doctor_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dokter *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih dokter" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {doctors.map((doctor) => (
                        <SelectItem key={doctor.id} value={doctor.id}>
                          {doctor.name} ({doctor.specialty})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Jadwal Praktek
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tanggal Praktek *</FormLabel>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                      <FormControl>
                        <Input 
                          type="date" 
                          className="pl-10" 
                          {...field} 
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="available"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status Ketersediaan</FormLabel>
                    <div className="flex items-center space-x-2">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <span className="text-sm font-medium">
                        {field.value ? (
                          <span className="text-green-600 flex items-center gap-1">
                            <CheckCircle className="h-4 w-4" /> Tersedia
                          </span>
                        ) : (
                          <span className="text-red-600 flex items-center gap-1">
                            <XCircle className="h-4 w-4" /> Tidak Tersedia
                          </span>
                        )}
                      </span>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="start_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jam Mulai *</FormLabel>
                    <div className="relative">
                      <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                      <FormControl>
                        <Input 
                          type="time" 
                          className="pl-10" 
                          {...field} 
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="end_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jam Selesai *</FormLabel>
                    <div className="relative">
                      <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                      <FormControl>
                        <Input 
                          type="time" 
                          className="pl-10" 
                          {...field} 
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

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
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                Memproses...
              </div>
            ) : schedule ? (
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Simpan Perubahan
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Tambah Jadwal
              </div>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}