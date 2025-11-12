// Variabel global untuk menyimpan counter antrian per poli (dalam implementasi sebenarnya ini akan disimpan di database)
const queueCounters: Record<string, number> = {};

/**
 * Fungsi untuk mengenerate nomor antrian berdasarkan poli
 */
export function generateQueueNumber(polyclinic: string): string {
  // Ambil huruf awal dari nama poli atau singkatan
  let prefix = '';
  switch(polyclinic) {
    case 'penyakit-dalam':
      prefix = 'PD';
      break;
    case 'bedah':
      prefix = 'BD';
      break;
    case 'anak':
      prefix = 'AK';
      break;
    case 'kandungan':
      prefix = 'KB';
      break;
    case 'mata':
      prefix = 'MT';
      break;
    case 'kulit-dan-kelamin':
      prefix = 'KK';
      break;
    case 'saraf':
      prefix = 'SR';
      break;
    case 'orthopedi':
      prefix = 'OR';
      break;
    case 'gigi':
      prefix = 'GG';
      break;
    case 'telinga-hidung-tenggorokan':
      prefix = 'TH';
      break;
    default:
      prefix = 'XX';
  }
  
  // Increment counter untuk poli ini
  if (!queueCounters[polyclinic]) {
    queueCounters[polyclinic] = 1;
  } else {
    queueCounters[polyclinic]++;
  }
  
  // Format: PD-001 (contoh)
  const counter = String(queueCounters[polyclinic]).padStart(3, '0');
  
  return `${prefix}-${counter}`;
}

/**
 * Fungsi untuk mengenerate nomor rekam medis
 */
export function generateMedicalRecordNumber(): string {
  // Dalam implementasi sebenarnya akan diambil dari database
  // Generate angka acak 6 digit
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  
  return `RM${randomNum}`;
}