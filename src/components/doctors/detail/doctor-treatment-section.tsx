import { Card, CardContent } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

// Data konstan untuk penanganan
const treatments = [
  "Manajemen Stres dan Kesehatan Emosional",
  "Terapi Kognitif Perilaku",
  "Konseling Psikologi",
  "Assesment Psikologi",
  "Terapi Keluarga",
  "Konseling Karir"
];

export function DoctorTreatmentSection() {
  return (
    <Card className="border-0 shadow-lg rounded-2xl">
      <CardContent className="p-6">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
          Penanganan Spesialistik
        </h3>
        <div className="grid gap-4">
          {treatments.map((treatment, index) => (
            <div key={index} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 dark:bg-gray-700/50 dark:border-gray-600">
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="text-slate-700 dark:text-gray-300 font-medium">
                {treatment}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}