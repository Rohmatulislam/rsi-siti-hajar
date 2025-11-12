'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Phone, 
  Video, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  Check,
  AlertCircle,
  User,
  Mail,
  FileText,
  CreditCard,
  MapPin,
  Stethoscope
} from 'lucide-react';
import { Doctor, Schedule } from '@/lib/admin-types';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// Tidak perlu mengimpor createBooking dari service langsung karena akan menggunakan API

interface BookingSectionProps {
  doctor: Doctor;
  schedules: Schedule[];
}

export function BookingSection({ doctor, schedules }: BookingSectionProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useUser();
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [showScheduleDropdown, setShowScheduleDropdown] = useState(false);
  const [consultationType, setConsultationType] = useState<"offline" | "online">("offline");
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [datesLoading, setDatesLoading] = useState(false);
  const [timesLoading, setTimesLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  
  // State untuk informasi pasien
  const [patientInfo, setPatientInfo] = useState({
    name: user?.fullName || '',
    phone: user?.primaryPhoneNumber?.phoneNumber || '',
    email: user?.primaryEmailAddress?.emailAddress || '',
    nik: '', // Nomor Induk Kependudukan
    birthDate: '', // Tanggal lahir
    gender: '', // Jenis kelamin
    address: '', // Alamat
    occupation: '', // Pekerjaan
    maritalStatus: '', // Status pernikahan
    identityType: 'nik', // NIK atau no_rekam_medis
    identityNumber: '',
    insuranceType: 'umum', // bpjs atau umum
    insuranceNumber: '',
    emergencyContactName: '', // Nama kontak darurat
    emergencyContactPhone: '', // Nomor kontak darurat
    bloodType: '', // Golongan darah
    allergies: '' // Alergi obat makanan
  });

  // Ambil tanggal-tanggal yang tersedia
  useEffect(() => {
    if (doctor) {
      const fetchAvailableDates = async () => {
        setDatesLoading(true);
        try {
          // Dalam implementasi nyata, ini akan memanggil API untuk mendapatkan tanggal yang tersedia
          // Untuk demo, kita buat tanggal dalam 30 hari mendatang
          const dates: string[] = [];
          for (let i = 0; i < 30; i++) {
            const date = new Date();
            date.setDate(date.getDate() + i);
            dates.push(date.toISOString().split('T')[0]);
          }
          setAvailableDates(dates);
        } catch (error) {
          console.error("Error fetching available dates:", error);
          toast({
            title: "Error",
            description: "Gagal mengambil tanggal yang tersedia",
            variant: "destructive",
          });
        } finally {
          setDatesLoading(false);
        }
      };

      fetchAvailableDates();
    }
  }, [doctor, toast]);

  // Ambil slot waktu yang tersedia berdasarkan tanggal yang dipilih
  useEffect(() => {
    if (selectedDate && doctor) {
      const fetchAvailableTimes = async () => {
        setTimesLoading(true);
        try {
          // Cek apakah kita ingin mengambil jadwal dari SIMRS Khanza secara real-time
          let scheduleData = schedules;
          
          // Secara opsional ambil jadwal dari SIMRS Khanza secara real-time
          // Ini bisa diaktifkan jika diperlukan
          if (false) { // Nonaktifkan dulu, aktifkan jika diperlukan
            try {
              const response = await fetch(`/api/schedules/khanza?date=${selectedDate}`);
              if (response.ok) {
                const result = await response.json();
                if (result.success) {
                  scheduleData = result.schedules;
                }
              }
            } catch (khanzaError) {
              console.error("Error fetching from Khanza:", khanzaError);
              // Gunakan jadwal lokal jika gagal mengambil dari Khanza
            }
          }
          
          // Gunakan schedules dari props (atau dari Khanza jika diambil) untuk menentukan waktu yang tersedia
          const times: string[] = [];
          
          // Filter schedules untuk tanggal yang dipilih
          const selectedDateSchedules = scheduleData.filter(schedule => 
            schedule.date === selectedDate
          );
          
          if (selectedDateSchedules.length > 0) {
            // Jika ada jadwal spesifik untuk tanggal tersebut dari props
            selectedDateSchedules.forEach(schedule => {
              // Buat slot waktu berdasarkan jadwal dokter
              const startHour = parseInt(schedule.start_time.split(':')[0]);
              const endHour = parseInt(schedule.end_time.split(':')[0]);
              
              for (let hour = startHour; hour < endHour; hour++) {
                times.push(`${hour.toString().padStart(2, '0')}:00 - ${hour.toString().padStart(2, '0')}:30`);
                times.push(`${hour.toString().padStart(2, '0')}:30 - ${(hour + 1).toString().padStart(2, '0')}:00`);
              }
            });
          } else {
            // Jika tidak ada jadwal spesifik untuk tanggal tersebut, buat default
            for (let hour = 8; hour <= 16; hour++) {
              if (hour !== 12) { // Jam istirahat
                times.push(`${hour.toString().padStart(2, '0')}:00 - ${hour.toString().padStart(2, '0')}:30`);
                times.push(`${hour.toString().padStart(2, '0')}:30 - ${(hour + 1).toString().padStart(2, '0')}:00`);
              }
            }
          }
          
          setAvailableTimes(times);
        } catch (error) {
          console.error("Error fetching available times:", error);
          toast({
            title: "Error",
            description: "Gagal mengambil waktu yang tersedia",
            variant: "destructive",
          });
          setAvailableTimes([]);
        } finally {
          setTimesLoading(false);
        }
      };

      fetchAvailableTimes();
    } else {
      setAvailableTimes([]);
      setTimesLoading(false);
    }
  }, [selectedDate, doctor, schedules, toast]);

  const handleBooking = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "Anda harus login terlebih dahulu untuk membuat janji temu.",
        variant: "destructive",
      });
      return;
    }

    if (!patientInfo.name || !patientInfo.phone || !patientInfo.email) {
      toast({
        title: "Error",
        description: "Mohon lengkapi informasi kontak Anda terlebih dahulu.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedDate || !selectedTime) {
      toast({
        title: "Error",
        description: "Mohon pilih tanggal dan waktu konsultasi terlebih dahulu.",
        variant: "destructive",
      });
      return;
    }

    setBookingLoading(true);

    try {
      // Format data untuk booking
      const bookingPayload = {
        bookingData: {
          patientId: user.id,
          doctorId: doctor.id,
          scheduleId: null, // Akan ditentukan berdasarkan jadwal dokter
          appointmentDate: selectedDate,
          appointmentTime: selectedTime.split(' - ')[0], // Ambil waktu awal dari range
          consultationType: consultationType,
          location: consultationType === 'offline' 
            ? doctor.clinic_address || 'Poliklinik Umum' 
            : 'Virtual Consultation',
          fee: doctor.consultation_fee || 150000,
          patientDetails: {
            ...patientInfo
          }
        },
        userId: user.id
      };

      // Kirim permintaan ke API endpoint
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingPayload),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast({
          title: "Sukses",
          description: result.message,
        });
        
        // Redirect ke halaman konfirmasi booking
        router.push(`/appointments/${result.appointmentId}`);
      } else {
        throw new Error(result.error || result.message || 'Gagal membuat janji temu');
      }
    } catch (error) {
      console.error("Error in booking process:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Gagal membuat janji temu. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setBookingLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      day: date.toLocaleDateString('id-ID', { weekday: 'short' }),
      date: date.getDate(),
      month: date.toLocaleDateString('id-ID', { month: 'short' })
    };
  };

  return (
    <Card className="sticky top-6 border-0 shadow-xl rounded-2xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white pb-4">
        <CardTitle className="text-xl font-bold text-center">
          Buat Janji Temu
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          {/* Tipe Konsultasi */}
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-3">
              Tipe Konsultasi
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant={consultationType === "offline" ? "default" : "outline"}
                className={`rounded-lg h-12 transition-none transform-none scale-100 cursor-pointer ${
                  consultationType === "offline" 
                    ? "bg-emerald-600 text-white" 
                    : "border-slate-300 text-slate-700 dark:border-gray-600 dark:text-gray-200"
                }`}
                onClick={() => setConsultationType("offline")}
              >
                <Phone className="h-4 w-4 mr-2" />
                Tatap Muka
              </Button>
              <Button
                variant={consultationType === "online" ? "default" : "outline"}
                className={`rounded-lg h-12 transition-none transform-none scale-100 cursor-pointer ${
                  consultationType === "online" 
                    ? "bg-emerald-600 text-white" 
                    : "border-slate-300 text-slate-700 dark:border-gray-600 dark:text-gray-200"
                }`}
                onClick={() => setConsultationType("online")}
              >
                <Video className="h-4 w-4 mr-2" />
                Online
              </Button>
            </div>
          </div>

          {/* Jadwal Konsultasi */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-slate-900 dark:text-white">Pilih Jadwal</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowScheduleDropdown(!showScheduleDropdown)}
                className="text-emerald-600 dark:text-emerald-400 transition-none transform-none scale-100 cursor-pointer"
                disabled={datesLoading}
              >
                {showScheduleDropdown ? (
                  <ChevronUp className="h-4 w-4 mr-1" />
                ) : (
                  <ChevronDown className="h-4 w-4 mr-1" />
                )}
                {showScheduleDropdown ? "Sembunyikan" : "Pilih"}
              </Button>
            </div>

            {showScheduleDropdown && (
              <div className="space-y-4 bg-slate-50 dark:bg-gray-700 p-4 rounded-lg border border-slate-200 dark:border-gray-600">
                {/* Tanggal Tersedia */}
                <div>
                  <h5 className="font-medium text-slate-700 dark:text-gray-300 mb-3">Pilih Tanggal</h5>
                  {datesLoading ? (
                    <div className="flex justify-center py-4">
                      <div className="rounded-full h-6 w-6 border-2 border-emerald-600 border-t-transparent animate-spin"></div>
                    </div>
                  ) : availableDates.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2">
                      {availableDates.slice(0, 9).map((date, index) => {
                        const formatted = formatDate(date);
                        return (
                          <Button
                            key={`${date}-${index}`}
                            variant={selectedDate === date ? "default" : "outline"}
                            className={`flex flex-col justify-center items-center h-16 rounded-xl transition-none transform-none scale-100 cursor-pointer ${
                              selectedDate === date 
                                ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30" 
                                : "border-2 border-emerald-200 text-emerald-700 dark:border-emerald-800/50 dark:text-emerald-300 bg-white dark:bg-slate-800"
                            }`}
                            onClick={() => {
                              setSelectedDate(date);
                              setSelectedTime(""); // Reset waktu saat tanggal berubah
                            }}
                          >
                            <span className="text-xs font-medium uppercase tracking-wide">{formatted.day}</span>
                            <span className="text-xl font-bold">{formatted.date}</span>
                            <span className="text-xs">{formatted.month}</span>
                          </Button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-slate-500 dark:text-gray-400">
                      Tidak ada tanggal yang tersedia
                    </div>
                  )}
                </div>

                {/* Waktu Tersedia */}
                {selectedDate && (
                  <div>
                    <h5 className="font-medium text-slate-700 dark:text-gray-300 mb-3">Pilih Waktu</h5>
                    {timesLoading ? (
                      <div className="flex justify-center py-4">
                        <div className="rounded-full h-6 w-6 border-2 border-emerald-600 border-t-transparent animate-spin"></div>
                      </div>
                    ) : availableTimes.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2">
                        {availableTimes.map((time, index) => (
                          <Button
                            key={`${time}-${index}`}
                            variant={selectedTime === time ? "default" : "outline"}
                            className={`rounded-lg transition-none transform-none scale-100 cursor-pointer ${
                              selectedTime === time 
                                ? "bg-emerald-600 text-white" 
                                : "border-slate-300 text-slate-700 dark:border-gray-600 dark:text-gray-200"
                            }`}
                            onClick={() => setSelectedTime(time)}
                            disabled={timesLoading}
                          >
                            {time}
                          </Button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-slate-500 dark:text-gray-400">
                        Tidak ada slot waktu tersedia
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Ringkasan Jadwal Terpilih */}
            {selectedDate && selectedTime && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mt-4 dark:bg-emerald-900/20 dark:border-emerald-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-emerald-900 dark:text-emerald-100">
                      {formatDate(selectedDate).day}, {formatDate(selectedDate).date} {formatDate(selectedDate).month}
                    </p>
                    <p className="text-emerald-700 dark:text-emerald-300">{selectedTime}</p>
                    <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-1 flex items-center">
                      {consultationType === 'offline' ? (
                        <MapPin className="h-4 w-4 mr-1" />
                      ) : (
                        <Video className="h-4 w-4 mr-1" />
                      )}
                      {consultationType === 'offline' 
                        ? (doctor.clinic_address || 'Poliklinik Umum') 
                        : 'Konsultasi Online'}
                    </p>
                  </div>
                  <Check className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
            )}
          </div>

          {/* Bagian Informasi Pasien (ditampilkan hanya setelah tanggal dan waktu dipilih) */}
          {selectedDate && selectedTime && (
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Informasi Pasien</h4>
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="name">Nama Lengkap</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="Nama Lengkap"
                        value={patientInfo.name}
                        onChange={(e) => setPatientInfo({...patientInfo, name: e.target.value})}
                        className="pl-10"
                        disabled={!!user?.fullName} // Non-aktifkan jika nama diambil dari Clerk
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="nik">NIK</Label>
                    <Input
                      id="nik"
                      type="text"
                      placeholder="Nomor Induk Kependudukan"
                      value={patientInfo.nik}
                      onChange={(e) => setPatientInfo({...patientInfo, nik: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="birthDate">Tanggal Lahir</Label>
                    <Input
                      id="birthDate"
                      type="date"
                      value={patientInfo.birthDate}
                      onChange={(e) => setPatientInfo({...patientInfo, birthDate: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="gender">Jenis Kelamin</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant={patientInfo.gender === "Laki-laki" ? "default" : "outline"}
                        className={`h-10 ${
                          patientInfo.gender === "Laki-laki" 
                            ? "bg-emerald-600 text-white" 
                            : "border-slate-300 text-slate-700 dark:border-gray-600 dark:text-gray-200"
                        }`}
                        onClick={() => setPatientInfo({...patientInfo, gender: "Laki-laki"})}
                      >
                        Laki-laki
                      </Button>
                      <Button
                        variant={patientInfo.gender === "Perempuan" ? "default" : "outline"}
                        className={`h-10 ${
                          patientInfo.gender === "Perempuan" 
                            ? "bg-emerald-600 text-white" 
                            : "border-slate-300 text-slate-700 dark:border-gray-600 dark:text-gray-200"
                        }`}
                        onClick={() => setPatientInfo({...patientInfo, gender: "Perempuan"})}
                      >
                        Perempuan
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="phone">Nomor Telepon</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Nomor Telepon"
                      value={patientInfo.phone}
                      onChange={(e) => setPatientInfo({...patientInfo, phone: e.target.value})}
                      className="pl-10"
                      disabled={!!user?.primaryPhoneNumber?.phoneNumber} // Non-aktifkan jika nomor diambil dari Clerk
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="email">Alamat Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Alamat Email"
                      value={patientInfo.email}
                      onChange={(e) => setPatientInfo({...patientInfo, email: e.target.value})}
                      className="pl-10"
                      disabled={!!user?.primaryEmailAddress?.emailAddress} // Non-aktifkan jika email diambil dari Clerk
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="address">Alamat Lengkap</Label>
                  <Input
                    id="address"
                    type="text"
                    placeholder="Alamat Lengkap"
                    value={patientInfo.address}
                    onChange={(e) => setPatientInfo({...patientInfo, address: e.target.value})}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="occupation">Pekerjaan</Label>
                    <Input
                      id="occupation"
                      type="text"
                      placeholder="Pekerjaan"
                      value={patientInfo.occupation}
                      onChange={(e) => setPatientInfo({...patientInfo, occupation: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="maritalStatus">Status Pernikahan</Label>
                    <select
                      id="maritalStatus"
                      value={patientInfo.maritalStatus}
                      onChange={(e) => setPatientInfo({...patientInfo, maritalStatus: e.target.value})}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    >
                      <option value="">Pilih Status Pernikahan</option>
                      <option value="Belum Kawin">Belum Kawin</option>
                      <option value="Kawin">Kawin</option>
                      <option value="Cerai Hidup">Cerai Hidup</option>
                      <option value="Cerai Mati">Cerai Mati</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="bloodType">Golongan Darah</Label>
                    <select
                      id="bloodType"
                      value={patientInfo.bloodType}
                      onChange={(e) => setPatientInfo({...patientInfo, bloodType: e.target.value})}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    >
                      <option value="">Pilih Gol. Darah</option>
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="AB">AB</option>
                      <option value="O">O</option>
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="insuranceType">Jenis Pasien</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        variant={patientInfo.insuranceType === "umum" ? "default" : "outline"}
                        className={`rounded-lg h-10 transition-none transform-none scale-100 cursor-pointer ${
                          patientInfo.insuranceType === "umum" 
                            ? "bg-emerald-600 text-white" 
                            : "border-slate-300 text-slate-700 dark:border-gray-600 dark:text-gray-200"
                        }`}
                        onClick={() => setPatientInfo({...patientInfo, insuranceType: "umum"})}
                      >
                        <CreditCard className="h-4 w-4 mr-2" />
                        Umum
                      </Button>
                      <Button
                        variant={patientInfo.insuranceType === "bpjs" ? "default" : "outline"}
                        className={`rounded-lg h-10 transition-none transform-none scale-100 cursor-pointer ${
                          patientInfo.insuranceType === "bpjs" 
                            ? "bg-emerald-600 text-white" 
                            : "border-slate-300 text-slate-700 dark:border-gray-600 dark:text-gray-200"
                        }`}
                        onClick={() => setPatientInfo({...patientInfo, insuranceType: "bpjs"})}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        BPJS
                      </Button>
                    </div>
                  </div>
                </div>
                
                {patientInfo.insuranceType === "bpjs" && (
                  <div>
                    <Label htmlFor="insuranceNumber">Nomor Kartu BPJS</Label>
                    <Input
                      id="insuranceNumber"
                      type="text"
                      placeholder="Masukkan nomor kartu BPJS"
                      value={patientInfo.insuranceNumber}
                      onChange={(e) => setPatientInfo({...patientInfo, insuranceNumber: e.target.value})}
                    />
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="emergencyContactName">Kontak Darurat (Nama)</Label>
                    <Input
                      id="emergencyContactName"
                      type="text"
                      placeholder="Nama kontak darurat"
                      value={patientInfo.emergencyContactName}
                      onChange={(e) => setPatientInfo({...patientInfo, emergencyContactName: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="emergencyContactPhone">Kontak Darurat (Telepon)</Label>
                    <Input
                      id="emergencyContactPhone"
                      type="tel"
                      placeholder="Telepon kontak darurat"
                      value={patientInfo.emergencyContactPhone}
                      onChange={(e) => setPatientInfo({...patientInfo, emergencyContactPhone: e.target.value})}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="allergies">Alergi (Jika Ada)</Label>
                  <Input
                    id="allergies"
                    type="text"
                    placeholder="Alergi terhadap obat/makanan (jika ada)"
                    value={patientInfo.allergies}
                    onChange={(e) => setPatientInfo({...patientInfo, allergies: e.target.value})}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Biaya Konsultasi */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 dark:bg-amber-900/20 dark:border-amber-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-amber-900 dark:text-amber-100">Biaya Konsultasi</p>
                <p className="text-sm text-amber-700 dark:text-amber-300">Termasuk asesmen awal</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-amber-900 dark:text-amber-100 text-lg">
                  Rp {doctor.consultation_fee?.toLocaleString('id-ID') || '150.000'}
                </p>
              </div>
            </div>
          </div>

          {/* Pesan instruksi jika belum memilih tanggal/waktu */}
          {!selectedDate || !selectedTime ? (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 dark:bg-blue-900/20 dark:border-blue-700">
              <p className="text-sm text-blue-800 dark:text-blue-200 text-center">
                Silakan pilih tanggal dan waktu konsultasi terlebih dahulu untuk melengkapi informasi pasien
              </p>
            </div>
          ) : null}

          {/* Tombol Booking */}
          <Button 
            className="w-full bg-emerald-600 hover:bg-emerald-700 rounded-lg py-3 text-lg font-semibold text-white shadow-lg transition-none transform-none scale-100"
            disabled={!selectedDate || !selectedTime || bookingLoading}
            onClick={handleBooking}
          >
            {bookingLoading ? (
              <>
                <Clock className="h-5 w-5 mr-2 animate-spin" />
                Memproses...
              </>
            ) : (
              <>
                <Calendar className="h-5 w-5 mr-2" />
                Pesan Sekarang
              </>
            )}
          </Button>

          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            Waktu konsultasi dapat berubah tergantung pada kunjungan pasien sebelum anda
          </p>
        </div>
      </CardContent>
    </Card>
  );
}