'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const registrationSchema = z.object({
  nik: z.string().min(16, 'NIK harus 16 digit').max(16, 'NIK harus 16 digit'),
  name: z.string().min(1, 'Nama wajib diisi'),
  gender: z.enum(['Laki-laki', 'Perempuan'], { 
    errorMap: () => ({ message: 'Jenis kelamin wajib dipilih' }) 
  }),
  birthDate: z.string().min(1, 'Tanggal lahir wajib diisi'),
  address: z.string().min(1, 'Alamat wajib diisi'),
  phone: z.string().min(1, 'No. Telp wajib diisi'),
  medicalRecordNumber: z.string().optional(), // No RM untuk pasien lama
  patientType: z.enum(['lama', 'baru'], { 
    errorMap: () => ({ message: 'Jenis pasien wajib dipilih' }) 
  }),
  polyclinic: z.string().min(1, 'Poliklinik wajib dipilih'),
  doctor: z.string().min(1, 'Dokter wajib dipilih'),
});

type RegistrationFormValues = z.infer<typeof registrationSchema>;

export default function HospitalRegistrationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      nik: '',
      name: '',
      gender: undefined,
      birthDate: '',
      address: '',
      phone: '',
      medicalRecordNumber: '',
      patientType: 'baru',
      polyclinic: '',
      doctor: '',
    },
  });

  const handleSubmit = async (data: RegistrationFormValues) => {
    setIsSubmitting(true);
    try {
      // Kirim data ke API
      const response = await fetch('/api/registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nik: data.nik,
          name: data.name,
          gender: data.gender,
          birthDate: data.birthDate,
          address: data.address,
          phone: data.phone,
          medicalRecordNumber: data.medicalRecordNumber || undefined,
          patientType: data.patientType,
          polyclinic: data.polyclinic,
          doctor: data.doctor,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal melakukan pendaftaran');
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Gagal melakukan pendaftaran');
      }
      
      // Redirect ke halaman bukti pendaftaran dengan data yang lengkap
      const registrationData = {
        ...data,
        id: result.appointment.id,
        queueNumber: result.queueNumber,
        visitDate: result.visitDate,
        medicalRecordNumber: result.patient.medical_record_number,
      };
      
      router.push(`/registration-confirmation?data=${encodeURIComponent(JSON.stringify(registrationData))}`);
    } catch (error: any) {
      console.error('Error during registration:', error);
      alert(error.message || 'Terjadi kesalahan saat mendaftar. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 p-4">
      <Card className="w-full max-w-2xl shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-emerald-700">Formulir Pendaftaran Pasien</CardTitle>
          <CardDescription>
            Silakan isi data diri Anda dengan lengkap untuk membuat janji temu
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="nik"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>NIK *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Masukkan Nomor Induk Kependudukan" 
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Lengkap *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Masukkan nama lengkap Anda" 
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="birthDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tanggal Lahir *</FormLabel>
                      <FormControl>
                        <Input 
                          type="date"
                          {...field}
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
                      <RadioGroup 
                        onValueChange={field.onChange} 
                        value={field.value}
                        className="flex flex-row space-x-4"
                      >
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <RadioGroupItem value="Laki-laki" />
                          </FormControl>
                          <FormLabel className="font-normal">Laki-laki</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <RadioGroupItem value="Perempuan" />
                          </FormControl>
                          <FormLabel className="font-normal">Perempuan</FormLabel>
                        </FormItem>
                      </RadioGroup>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Alamat *</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Masukkan alamat lengkap Anda" 
                          {...field}
                          className="resize-none"
                        />
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
                      <FormLabel>No. Telp *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Masukkan nomor telepon Anda" 
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="patientType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status Pasien *</FormLabel>
                      <RadioGroup 
                        onValueChange={field.onChange} 
                        value={field.value}
                        className="flex flex-row space-x-4"
                      >
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <RadioGroupItem value="baru" />
                          </FormControl>
                          <FormLabel className="font-normal">Pasien Baru</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <RadioGroupItem value="lama" />
                          </FormControl>
                          <FormLabel className="font-normal">Pasien Lama</FormLabel>
                        </FormItem>
                      </RadioGroup>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.watch('patientType') === 'lama' && (
                  <FormField
                    control={form.control}
                    name="medicalRecordNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>No. Rekam Medis</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Masukkan nomor rekam medis Anda (jika ada)" 
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="polyclinic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Poliklinik *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih poliklinik" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="penyakit-dalam">Penyakit Dalam</SelectItem>
                          <SelectItem value="bedah">Bedah</SelectItem>
                          <SelectItem value="anak">Anak</SelectItem>
                          <SelectItem value="kandungan">Kandungan</SelectItem>
                          <SelectItem value="mata">Mata</SelectItem>
                          <SelectItem value="kulit-dan-kelamin">Kulit dan Kelamin</SelectItem>
                          <SelectItem value="saraf">Saraf</SelectItem>
                          <SelectItem value="orthopedi">Orthopedi</SelectItem>
                          <SelectItem value="gigi">Gigi</SelectItem>
                          <SelectItem value="telinga-hidung-tenggorokan">THT</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="doctor"
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
                          <SelectItem value="dr-andi-s">Dr. Andi Susanto, Sp.PD</SelectItem>
                          <SelectItem value="dr-budi-h">Dr. Budi Harsono, Sp.A</SelectItem>
                          <SelectItem value="dr-citra-m">Dr. Citra Maharani, Sp.OG</SelectItem>
                          <SelectItem value="dr-dedi-k">Dr. Dedi Kurniawan, Sp.B</SelectItem>
                          <SelectItem value="dr-era-n">Dr. Era Nuraini, Sp.M</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 text-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Memproses...' : 'Buat Janji Temu'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}