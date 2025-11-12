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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AppointmentSuccess } from './appointment-success';

const laboratoryAppointmentSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  phone: z.string().min(1, "Nomor telepon wajib diisi"),
  email: z.string().email("Format email tidak valid"),
  age: z.number().min(1, "Usia wajib diisi").max(120, "Usia tidak valid"),
  gender: z.enum(['laki-laki', 'perempuan'], { 
    errorMap: () => ({ message: "Jenis kelamin wajib dipilih" }) 
  }),
  appointmentDate: z.date({ required_error: "Tanggal pemeriksaan wajib dipilih" }),
  appointmentTime: z.string().min(1, "Waktu pemeriksaan wajib dipilih"),
  examinationType: z.string().min(1, "Jenis pemeriksaan wajib dipilih"),
  notes: z.string().optional(),
});

type LaboratoryAppointmentFormValues = z.infer<typeof laboratoryAppointmentSchema>;

interface LaboratoryAppointmentFormProps {
  onComplete?: () => void;
}

export function LaboratoryAppointmentForm({ onComplete }: LaboratoryAppointmentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [appointmentData, setAppointmentData] = useState<any>(null);

  const form = useForm<LaboratoryAppointmentFormValues>({
    resolver: zodResolver(laboratoryAppointmentSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      age: 0,
      gender: undefined,
      appointmentDate: new Date(),
      appointmentTime: '',
      examinationType: '',
      notes: '',
    },
  });

  const examinationTypes = [
    "Hematologi (CBC)",
    "Kimia Klinik",
    "Imunologi",
    "Mikrobiologi",
    "Feses",
    "Urine Lengkap",
    "Fungsi Ginjal",
    "Fungsi Hati",
    "Gula Darah",
    "Lipid Profile",
    "TSH/T3/T4",
    "Hormon Reproduksi",
    "Tanda Tumor",
    "Alergi",
    "Lainnya"
  ];

  const timeSlots = [
    "07:00", "07:30", "08:00", "08:30", "09:00", "09:30",
    "10:00", "10:30", "11:00", "11:30", "13:00", "13:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"
  ];

  const handleSubmit = async (data: LaboratoryAppointmentFormValues) => {
    setIsSubmitting(true);
    try {
      // Simulasi pengiriman data ke backend
      console.log("Data pendaftaran laboratorium:", data);
      
      // Di sini akan ditambahkan panggilan API untuk menyimpan data ke database
      // await saveAppointmentToDatabase(data);
      
      // Simpan data pendaftaran untuk ditampilkan di halaman sukses
      setAppointmentData({
        patientName: data.name,
        appointmentDate: format(data.appointmentDate, 'dd MMMM yyyy'),
        appointmentTime: data.appointmentTime,
        examinationType: data.examinationType,
        location: "Lantai 1, RSI Siti Hajar Mataram",
        contact: "(0370) 623xxx"
      });
      
      // Tampilkan halaman sukses
      setShowSuccess(true);
      
      // Panggil fungsi callback jika tersedia
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error("Error submitting appointment:", error);
      alert("Terjadi kesalahan saat mendaftar janji. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess && appointmentData) {
    return (
      <AppointmentSuccess
        type="laboratory"
        patientName={appointmentData.patientName}
        appointmentDate={appointmentData.appointmentDate}
        appointmentTime={appointmentData.appointmentTime}
        examinationType={appointmentData.examinationType}
        location={appointmentData.location}
        contact={appointmentData.contact}
        onNewAppointment={() => setShowSuccess(false)}
      />
    );
  }

  return (
    <Card className="border-0 shadow-lg rounded-2xl bg-card">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-emerald-700">Formulir Pendaftaran Laboratorium</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Lengkap *</FormLabel>
                    <FormControl>
                      <Input placeholder="Nama lengkap Anda" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nomor Telepon *</FormLabel>
                    <FormControl>
                      <Input placeholder="Contoh: 081234567890" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input placeholder="email@contoh.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Usia *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Usia Anda" 
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
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jenis Kelamin *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih jenis kelamin" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="laki-laki">Laki-laki</SelectItem>
                        <SelectItem value="perempuan">Perempuan</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="examinationType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jenis Pemeriksaan *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih jenis pemeriksaan" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {examinationTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="appointmentDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Tanggal Pemeriksaan *</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pilih tanggal</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date() || date > new Date(new Date().setMonth(new Date().getMonth() + 3))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="appointmentTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Waktu Pemeriksaan *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih waktu pemeriksaan" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Catatan Tambahan</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Keterangan tambahan, alergi, atau kondisi khusus"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-6 text-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                'Daftar Pemeriksaan Laboratorium'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}