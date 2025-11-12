'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Calendar, Clock, MapPin, Phone } from 'lucide-react';
import Link from 'next/link';

interface AppointmentSuccessProps {
  type: 'laboratory' | 'radiology';
  patientName: string;
  appointmentDate: string;
  appointmentTime: string;
  examinationType: string;
  location: string;
  contact: string;
  onNewAppointment?: () => void;
}

export function AppointmentSuccess({ 
  type, 
  patientName, 
  appointmentDate, 
  appointmentTime, 
  examinationType,
  location,
  contact,
  onNewAppointment
}: AppointmentSuccessProps) {
  const serviceName = type === 'laboratory' ? 'Laboratorium' : 'Radiologi';
  const serviceIcon = type === 'laboratory' ? '🧪' : '🏥';

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-card text-foreground border-border">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-emerald-100 dark:bg-emerald-900/30 p-4 rounded-full">
                  <CheckCircle className="h-12 w-12 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-emerald-700">
                Pendaftaran Berhasil!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <p className="text-lg font-semibold text-foreground">
                  Halo, <span className="text-emerald-600">{patientName}</span>
                </p>
                <p className="text-muted-foreground mt-2">
                  Pendaftaran pemeriksaan {examinationType} Anda telah berhasil
                </p>
              </div>

              <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-center mb-2">
                  <span className="text-2xl">{serviceIcon}</span>
                  <h3 className="text-xl font-bold ml-2 text-emerald-700 dark:text-emerald-400">
                    {serviceName}
                  </h3>
                </div>
                <p className="text-center text-muted-foreground">
                  RSI Siti Hajar Mataram
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center p-3 bg-muted rounded-lg dark:bg-card">
                  <Calendar className="h-5 w-5 mr-3 text-emerald-600 dark:text-emerald-400" />
                  <div>
                    <p className="text-sm text-muted-foreground">Tanggal</p>
                    <p className="font-medium text-foreground">{appointmentDate}</p>
                  </div>
                </div>
                
                <div className="flex items-center p-3 bg-muted rounded-lg dark:bg-card">
                  <Clock className="h-5 w-5 mr-3 text-emerald-600 dark:text-emerald-400" />
                  <div>
                    <p className="text-sm text-muted-foreground">Waktu</p>
                    <p className="font-medium text-foreground">{appointmentTime}</p>
                  </div>
                </div>
                
                <div className="flex items-center p-3 bg-muted rounded-lg dark:bg-card">
                  <MapPin className="h-5 w-5 mr-3 text-emerald-600 dark:text-emerald-400" />
                  <div>
                    <p className="text-sm text-muted-foreground">Lokasi</p>
                    <p className="font-medium text-foreground">{location}</p>
                  </div>
                </div>
                
                <div className="flex items-center p-3 bg-muted rounded-lg dark:bg-card">
                  <Phone className="h-5 w-5 mr-3 text-emerald-600 dark:text-emerald-400" />
                  <div>
                    <p className="text-sm text-muted-foreground">Kontak</p>
                    <p className="font-medium text-foreground">{contact}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-3">
                <Button 
                  asChild 
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                >
                  <Link href="/">Kembali ke Beranda</Link>
                </Button>
                
                {onNewAppointment ? (
                  <Button 
                    variant="outline" 
                    className="w-full border-border text-foreground hover:bg-muted"
                    onClick={onNewAppointment}
                  >
                    Buat Janji Baru
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    asChild
                    className="w-full border-border text-foreground hover:bg-muted"
                  >
                    <Link href={`/services/${type === 'laboratory' ? 'laboratory' : 'radiology'}`}>
                      Kembali ke Halaman {serviceName}
                    </Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}