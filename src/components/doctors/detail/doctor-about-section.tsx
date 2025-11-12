import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Doctor } from '@/lib/admin-types';

interface DoctorAboutSectionProps {
  doctor: Doctor;
}

// Data konstan untuk gejala
const symptoms = [
  "Gangguan Kecemasan", "Stres Berat", "Depresi", 
  "Gangguan Mood", "Insomnia", "Gangguan Panik"
];

export function DoctorAboutSection({ doctor }: DoctorAboutSectionProps) {
  return (
    <Card className="border-0 shadow-lg rounded-2xl">
      <CardContent className="p-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              Tentang Dokter
            </h3>
            <div className="text-slate-700 dark:text-gray-300 leading-relaxed">
              {doctor.description ? (
                <div dangerouslySetInnerHTML={{ __html: doctor.description }} />
              ): (
                "Dokter spesialis yang berpengalaman dengan komitmen tinggi terhadap pelayanan kesehatan terbaik untuk pasien."
              )}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              Gejala & Penyakit yang Ditangani
            </h3>
            <div className="flex flex-wrap gap-3">
              {symptoms.map((symptom) => (
                <Badge 
                  key={symptom} 
                  variant="secondary" 
                  className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-2 text-sm dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700"
                >
                  {symptom}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}