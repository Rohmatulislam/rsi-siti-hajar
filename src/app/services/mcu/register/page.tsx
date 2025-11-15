'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { motion } from 'framer-motion';
import {
  User,
  Calendar,
  Clock,
  Stethoscope,
  MapPin,
  FileText,
  AlertCircle,
  Search,
  Package,
  HeartPulse,
  Shield,
  CheckCircle,
  Award,
  TrendingUp,
  Info,
  Phone,
  Mail,
  Home,
  Venus,
  Mars,
  IdCard,
  CreditCard,
  QrCode,
  ArrowLeft
} from 'lucide-react';

// Tipe data pasien
interface PatientData {
  identifier: string; // no_rkm_medis or no_ktp
  name: string;
  birthDate: string;
  gender: string;
  address: string;
  phone: string;
  package: string;
  email?: string;
}

// Mock data paket MCU
const mcuPackages = [
  { id: 'basic', name: 'MCU Basic', price: 'Rp 500.000' },
  { id: 'silver', name: 'MCU Silver', price: 'Rp 1.200.000' },
  { id: 'gold', name: 'MCU Gold', price: 'Rp 2.500.000' },
  { id: 'executive', name: 'MCU Executive', price: 'Rp 4.500.000' },
];

// Mock data jadwal MCU
const mcuSchedule = [
  { date: '2025-11-18', day: 'Rabu', available: true },
  { date: '2025-11-19', day: 'Kamis', available: true },
  { date: '2025-11-20', day: 'Jumat', available: false },
  { date: '2025-11-21', day: 'Sabtu', available: true },
  { date: '2025-11-22', day: 'Minggu', available: true },
  { date: '2025-11-23', day: 'Senin', available: true },
];

export default function MCUPatientRegistrationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const packageName = searchParams.get('package') || 'basic';

  const [registrationMode, setRegistrationMode] = useState<'existing' | 'new'>('existing');
  const [patientData, setPatientData] = useState<PatientData>({
    identifier: '',
    name: '',
    birthDate: '',
    gender: '',
    address: '',
    phone: '',
    package: packageName,
    email: ''
  });
  const [patientFound, setPatientFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPatientData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setPatientData(prev => ({ ...prev, [name]: value }));
  };

  const handleSearchPatient = async () => {
    if (!patientData.identifier) {
      setError('Nomor Rekam Medis atau NIK harus diisi');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      // Simulasi API call untuk mencari data pasien dari SIMRS
      // Dalam implementasi asli, ini akan mengakses tabel pasien di SIMRS Khanza
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock data pasien
      if (patientData.identifier === '123456' || patientData.identifier === '1234567890123456') {
        setPatientData({
          ...patientData,
          name: 'Siti Aminah',
          birthDate: '1985-05-15',
          gender: 'Perempuan',
          address: 'Jl. Merdeka No. 123, Mataram',
          phone: '081234567890',
          email: 'siti.aminah@email.com'
        });
        setPatientFound(true);
        setSuccessMessage('Pasien ditemukan dalam sistem kami!');
      } else {
        setError('Nomor Rekam Medis atau NIK tidak ditemukan. Silakan daftar sebagai pasien baru.');
        setPatientFound(false);
      }
    } catch (err) {
      setError('Terjadi kesalahan saat mencari data pasien');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDate) {
      setError('Silakan pilih tanggal MCU');
      return;
    }

    if (!patientData.phone || patientData.phone.length < 10) {
      setError('Nomor HP harus diisi dengan benar');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      // Simulasi API call untuk mendaftar MCU ke SIMRS
      // Dalam implementasi asli, ini akan menyimpan ke tabel yang sesuai di SIMRS Khanza
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Redirect ke halaman konfirmasi
      router.push(`/services/mcu/success?package=${patientData.package}&date=${selectedDate}`);
    } catch (err) {
      setError('Terjadi kesalahan saat mendaftarkan MCU');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleNewPatient = () => {
    setRegistrationMode('new');
    setPatientFound(false);
    setPatientData({
      ...patientData,
      identifier: '',
      name: '',
      birthDate: '',
      gender: '',
      address: '',
      phone: '',
      email: ''
    });
    setError('');
    setSuccessMessage('');
  };

  const handleExistingPatient = () => {
    setRegistrationMode('existing');
    setPatientFound(false);
    setPatientData({
      ...patientData,
      identifier: '',
      name: '',
      birthDate: '',
      gender: '',
      address: '',
      phone: '',
      email: ''
    });
    setError('');
    setSuccessMessage('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-emerald-50 to-white py-8 pt-16">
      {/* Decorative background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-emerald-200/10 rounded-full blur-3xl -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-teal-200/10 rounded-full blur-3xl translate-y-1/2"></div>
      </div>

      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center mb-8"
          >
            <Button
              variant="outline"
              className="mr-4 border-emerald-600 text-emerald-600 hover:bg-emerald-50"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Pendaftaran MCU</h1>
              <p className="text-sm text-gray-600 mt-1">Medical Check Up - RSI Siti Hajar Mataram</p>
            </div>
          </motion.div>

          {!showSuccess ? (
            <form onSubmit={handleRegister}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <Card className="border-emerald-200 mb-8 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                  <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-t-lg">
                    <CardTitle className="text-lg text-gray-800 flex items-center">
                      <HeartPulse className="h-5 w-5 text-emerald-600 mr-2" />
                      Pilih Mode Pendaftaran
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="cursor-pointer"
                      >
                        <Button
                          type="button"
                          variant={registrationMode === 'existing' ? 'default' : 'outline'}
                          className={`w-full flex flex-col items-center justify-center h-24 p-4 ${registrationMode === 'existing' ? 'bg-emerald-600 hover:bg-emerald-700' : 'border-emerald-600 text-emerald-600'}`}
                          onClick={handleExistingPatient}
                        >
                          <User className="h-6 w-6 mb-2" />
                          <span>Pasien Lama</span>
                          <p className="text-xs opacity-70 mt-1">Sudah terdaftar sebelumnya</p>
                        </Button>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="cursor-pointer"
                      >
                        <Button
                          type="button"
                          variant={registrationMode === 'new' ? 'default' : 'outline'}
                          className={`w-full flex flex-col items-center justify-center h-24 p-4 ${registrationMode === 'new' ? 'bg-emerald-600 hover:bg-emerald-700' : 'border-emerald-600 text-emerald-600'}`}
                          onClick={handleNewPatient}
                        >
                          <Shield className="h-6 w-6 mb-2" />
                          <span>Pasien Baru</span>
                          <p className="text-xs opacity-70 mt-1">Belum pernah terdaftar</p>
                        </Button>
                      </motion.div>
                    </div>

                    {registrationMode === 'existing' ? (
                      <div className="space-y-4">
                        <div className="flex space-x-2">
                          <div className="flex-1">
                            <Label htmlFor="identifier">Nomor Rekam Medis atau NIK</Label>
                            <div className="relative">
                              <Input
                                id="identifier"
                                name="identifier"
                                value={patientData.identifier}
                                onChange={handleInputChange}
                                placeholder="Masukkan RM atau NIK"
                                className="pl-10"
                              />
                              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            </div>
                          </div>
                          <div className="flex items-end">
                            <Button
                              type="button"
                              onClick={handleSearchPatient}
                              disabled={loading}
                              className="h-10 bg-emerald-600 hover:bg-emerald-700"
                            >
                              {loading ? 'Mencari...' : 'Cari'}
                            </Button>
                          </div>
                        </div>
                        
                        {error && (
                          <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                          </Alert>
                        )}
                        
                        {successMessage && (
                          <Alert>
                            <CheckCircle className="h-4 w-4 text-emerald-600" />
                            <AlertDescription className="text-emerald-700">{successMessage}</AlertDescription>
                          </Alert>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <p className="text-sm text-gray-600 mb-4">
                          Silakan isi formulir pendaftaran pasien baru berikut:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="name">Nama Lengkap</Label>
                            <div className="relative">
                              <Input
                                id="name"
                                name="name"
                                value={patientData.name}
                                onChange={handleInputChange}
                                placeholder="Nama lengkap pasien"
                                required
                                className="pl-10"
                              />
                              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="birthDate">Tanggal Lahir</Label>
                            <Input
                              id="birthDate"
                              name="birthDate"
                              type="date"
                              value={patientData.birthDate}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="gender">Jenis Kelamin</Label>
                            <Select value={patientData.gender} onValueChange={(value) => handleSelectChange('gender', value)}>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Pilih jenis kelamin" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                                <SelectItem value="Perempuan">Perempuan</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="identifier">NIK</Label>
                            <div className="relative">
                              <Input
                                id="identifier"
                                name="identifier"
                                value={patientData.identifier}
                                onChange={handleInputChange}
                                placeholder="Nomor Induk Kependudukan"
                                required
                                className="pl-10"
                              />
                              <IdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="address">Alamat Lengkap</Label>
                          <div className="relative">
                            <Input
                              id="address"
                              name="address"
                              value={patientData.address}
                              onChange={handleInputChange}
                              placeholder="Alamat sesuai KTP"
                              required
                              className="pl-10"
                            />
                            <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="phone">Nomor HP</Label>
                            <div className="relative">
                              <Input
                                id="phone"
                                name="phone"
                                type="tel"
                                value={patientData.phone}
                                onChange={handleInputChange}
                                placeholder="Nomor HP aktif"
                                required
                                className="pl-10"
                              />
                              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="email">Email (Opsional)</Label>
                            <div className="relative">
                              <Input
                                id="email"
                                name="email"
                                type="email"
                                value={patientData.email || ''}
                                onChange={(e) => setPatientData({...patientData, email: e.target.value})}
                                placeholder="Alamat email"
                                className="pl-10"
                              />
                              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {patientFound && registrationMode === 'existing' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <Card className="border-emerald-200 mb-8 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                      <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-t-lg">
                        <CardTitle className="text-lg text-gray-800 flex items-center">
                          <User className="h-5 w-5 text-emerald-600 mr-2" />
                          Data Pasien
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label>Nama Lengkap</Label>
                            <p className="font-medium">{patientData.name}</p>
                          </div>
                          <div>
                            <Label>Tanggal Lahir</Label>
                            <p className="font-medium">{patientData.birthDate}</p>
                          </div>
                          <div>
                            <Label>Jenis Kelamin</Label>
                            <p className="font-medium">{patientData.gender}</p>
                          </div>
                          <div>
                            <Label>Nomor Rekam Medis</Label>
                            <p className="font-medium">{patientData.identifier}</p>
                          </div>
                          <div className="md:col-span-2">
                            <Label>Alamat</Label>
                            <p className="font-medium">{patientData.address}</p>
                          </div>
                          <div>
                            <Label>Nomor HP</Label>
                            <p className="font-medium">{patientData.phone}</p>
                          </div>
                          <div>
                            <Label>Email</Label>
                            <p className="font-medium">{patientData.email || '-'}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {(patientFound || registrationMode === 'new') && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  >
                    <Card className="border-emerald-200 mb-8 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                      <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-t-lg">
                        <CardTitle className="text-lg text-gray-800 flex items-center">
                          <Package className="h-5 w-5 text-emerald-600 mr-2" />
                          Pilih Paket MCU
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {mcuPackages.map((pkg) => (
                            <div
                              key={pkg.id}
                              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                                patientData.package === pkg.id
                                  ? 'border-emerald-500 bg-emerald-50 shadow-md'
                                  : 'border-gray-200 hover:border-emerald-300'
                              }`}
                              onClick={() => handleSelectChange('package', pkg.id)}
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-semibold text-gray-800">{pkg.name}</h4>
                                  <p className="text-emerald-600 font-bold">{pkg.price}</p>
                                </div>
                                {patientData.package === pkg.id && (
                                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-emerald-200 mb-8 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                      <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-t-lg">
                        <CardTitle className="text-lg text-gray-800 flex items-center">
                          <Calendar className="h-5 w-5 text-emerald-600 mr-2" />
                          Pilih Jadwal MCU
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                          {mcuSchedule.map((item, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.6, delay: index * 0.1 }}
                            >
                              <div
                                className={`border-2 text-center p-3 cursor-pointer rounded-lg transition-all ${
                                  selectedDate === item.date
                                    ? 'border-emerald-500 bg-emerald-500 text-white'
                                    : item.available
                                    ? 'border-emerald-300 bg-emerald-50 hover:bg-emerald-100'
                                    : 'border-gray-300 bg-gray-100 opacity-60 cursor-not-allowed'
                                }`}
                                onClick={() => item.available && setSelectedDate(item.date)}
                              >
                                <p className={`font-semibold ${selectedDate === item.date ? 'text-white' : 'text-gray-700'}`}>{item.day}</p>
                                <p className={`text-lg font-bold ${selectedDate === item.date ? 'text-white' : 'text-emerald-700'}`}>{item.date.split('-')[2]}</p>
                                <div className={`inline-flex items-center mt-1 text-xs px-2 py-1 rounded-full ${
                                  selectedDate === item.date
                                    ? 'bg-white text-emerald-700'
                                    : item.available
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-gray-200 text-gray-600'
                                }`}>
                                  {item.available ? (
                                    <>
                                      <CheckCircle className="h-3 w-3 mr-1" />
                                      Tersedia
                                    </>
                                  ) : (
                                    <>
                                      <Clock className="h-3 w-3 mr-1" />
                                      Penuh
                                    </>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                        {selectedDate && (
                          <p className="mt-4 text-center text-emerald-700 font-medium">
                            Jadwal MCU dipilih: {new Date(selectedDate).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                          </p>
                        )}
                      </CardContent>
                    </Card>

                    <Card className="border-emerald-200 mb-8 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                      <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-t-lg">
                        <CardTitle className="text-lg text-gray-800 flex items-center">
                          <CreditCard className="h-5 w-5 text-emerald-600 mr-2" />
                          Metode Pembayaran
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div
                            className={`border-2 rounded-lg p-4 cursor-pointer text-center transition-all ${
                              paymentMethod === 'cash'
                                ? 'border-emerald-500 bg-emerald-50 shadow-md'
                                : 'border-gray-200 hover:border-emerald-300'
                            }`}
                            onClick={() => setPaymentMethod('cash')}
                          >
                            <CashIcon className="h-8 w-8 mx-auto mb-2 text-emerald-600" />
                            <p className="font-medium">Tunai</p>
                          </div>
                          <div
                            className={`border-2 rounded-lg p-4 cursor-pointer text-center transition-all ${
                              paymentMethod === 'transfer'
                                ? 'border-emerald-500 bg-emerald-50 shadow-md'
                                : 'border-gray-200 hover:border-emerald-300'
                            }`}
                            onClick={() => setPaymentMethod('transfer')}
                          >
                            <BankIcon className="h-8 w-8 mx-auto mb-2 text-emerald-600" />
                            <p className="font-medium">Transfer Bank</p>
                          </div>
                          <div
                            className={`border-2 rounded-lg p-4 cursor-pointer text-center transition-all ${
                              paymentMethod === 'card'
                                ? 'border-emerald-500 bg-emerald-50 shadow-md'
                                : 'border-gray-200 hover:border-emerald-300'
                            }`}
                            onClick={() => setPaymentMethod('card')}
                          >
                            <CreditCard className="h-8 w-8 mx-auto mb-2 text-emerald-600" />
                            <p className="font-medium">Kartu Kredit</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {error && (
                      <Alert variant="destructive" className="mb-6">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    <div className="flex justify-center">
                      <Button
                        type="submit"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                        disabled={loading || !selectedDate}
                      >
                        {loading ? (
                          <div className="flex items-center">
                            <span className="mr-2">Memproses...</span>
                            <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <HeartPulse className="h-5 w-5 mr-2" />
                            Daftar MCU Sekarang
                          </div>
                        )}
                      </Button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="border-emerald-200 shadow-2xl hover:shadow-3xl transition-shadow duration-300">
                <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-t-lg text-center py-8">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <CheckCircle className="h-12 w-12 text-emerald-600" />
                  </div>
                  <CardTitle className="text-2xl text-white">Pendaftaran Berhasil!</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="text-center mb-6">
                    <p className="text-gray-700 mb-2">Terima kasih telah mendaftar MCU di RSI Siti Hajar</p>
                    <p className="text-emerald-600 font-medium">Nomor booking Anda: MCU-{Date.now().toString().substr(-6)}</p>
                  </div>
                  
                  <div className="flex justify-center mb-6">
                    <div className="bg-gray-100 p-4 rounded-lg">
                      <QrCode className="h-32 w-32 text-emerald-600" />
                      <p className="text-xs text-gray-600 mt-2">Scan untuk verifikasi</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Nama:</span>
                      <span className="font-medium">{patientData.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Paket:</span>
                      <span className="font-medium">
                        {mcuPackages.find(p => p.id === patientData.package)?.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tanggal MCU:</span>
                      <span className="font-medium">
                        {selectedDate ? new Date(selectedDate).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Metode Pembayaran:</span>
                      <span className="font-medium capitalize">{paymentMethod}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-center mt-8">
                    <Button
                      asChild
                      variant="outline"
                      className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                    >
                      <Link href="/services/mcu">
                        Kembali ke Halaman Utama
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

// Ikon kustom untuk metode pembayaran
function CashIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="12" x="2" y="6" rx="2" />
      <circle cx="12" cy="12" r="2" />
      <path d="M6 12h.01M18 12h.01" />
    </svg>
  );
}

function BankIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 15V9.5a3.5 3.5 0 0 0-3.5-3.5A3.5 3.5 0 0 0 8 9.5V15" />
      <path d="M3 15v-3a3 3 0 1 1 6 0v3" />
      <path d="M15 8.5v-2a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
      <path d="M3 22h18" />
    </svg>
  );
}