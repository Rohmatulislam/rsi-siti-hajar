import { Card, CardContent } from '@/components/ui/card';

// Data konstan untuk riwayat pendidikan
const educationHistory = [
  {
    degree: "Pendidikan Magister Psikologi",
    institution: "2008 • Universitas Gadjah Mada, Yogyakarta",
    description: "Lulus dengan predikat Cum Laude"
  },
  {
    degree: "Pendidikan Sarjana Psikologi",
    institution: "2001 • Universitas Gadjah Mada, Yogyakarta",
    description: "Fokus pada Psikologi Klinis"
  }
];

export function DoctorEducationSection() {
  return (
    <Card className="border-0 shadow-lg rounded-2xl">
      <CardContent className="p-6">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
          Riwayat Pendidikan
        </h3>
        <div className="space-y-6">
          {educationHistory.map((edu, index) => (
            <div key={index} className="relative pl-8 pb-6 last:pb-0">
              <div className="absolute left-0 top-0 w-4 h-4 bg-emerald-500 rounded-full border-4 border-white dark:border-gray-800 shadow-lg"></div>
              <div className="bg-slate-50 dark:bg-gray-700/50 rounded-xl p-4 border border-slate-200 dark:border-gray-600">
                <h4 className="font-bold text-slate-900 dark:text-white text-lg">
                  {edu.degree}
                </h4>
                <p className="text-emerald-600 dark:text-emerald-400 font-semibold">
                  {edu.institution}
                </p>
                <p className="text-slate-600 dark:text-gray-400 mt-2">
                  {edu.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}