// service-contract.ts - Kontrak layanan untuk integrasi SIMRS Khanza
// Mendefinisikan interface standar yang harus diikuti oleh semua implementasi layanan SIMRS Khanza

// Interface kontrak dasar untuk layanan SIMRS Khanza
export interface IKhanzaService {
  // Fungsi untuk menguji koneksi ke database SIMRS Khanza
  testConnection(): Promise<boolean>;
  
  // Fungsi untuk mengambil semua data dari SIMRS Khanza
  getAllData(): Promise<any>;
  
  // Fungsi untuk mengambil data laporan
  getReports(): Promise<any[]>;
  
  // Fungsi untuk mengambil data keuangan
  getFinancialData(): Promise<any[]>;
  
  // Fungsi untuk mengambil data kunjungan
  getVisitData(): Promise<any[]>;
  
  // Fungsi untuk mengambil data kunjungan laboratorium
  getLabVisits(): Promise<any[]>;
  
  // Fungsi untuk mengambil data kunjungan radiologi
  getRadiologyVisits(): Promise<any[]>;
  
  // Fungsi untuk mengambil data jurnal
  getJournalData(): Promise<any[]>;
  
  // Fungsi untuk mengambil data inventaris
  getInventoryData(): Promise<any[]>;
  
  // Fungsi untuk mengambil data pendapatan obat
  getDrugRevenue(): Promise<any[]>;
  
  // Fungsi untuk mengambil data jadwal dokter
  getDoctorSchedules(doctorId?: string, date?: string): Promise<any[]>;
}

// Interface kontrak untuk koneksi database SIMRS Khanza
export interface IKhanzaDatabase {
  // Fungsi untuk membuat koneksi ke database SIMRS Khanza
  createConnection(): Promise<any>;
  
  // Fungsi untuk mengeksekusi query ke database SIMRS Khanza
  executeQuery(query: string, params?: any[]): Promise<any>;
  
  // Fungsi untuk menutup koneksi ke database SIMRS Khanza
  closeConnection(connection: any): Promise<void>;
}

// Interface kontrak untuk caching SIMRS Khanza
export interface IKhanzaCache {
  // Fungsi untuk menyimpan data ke cache
  set(key: string, data: any, ttl?: number): void;
  
  // Fungsi untuk mengambil data dari cache
  get(key: string): any | null;
  
  // Fungsi untuk memeriksa apakah data ada di cache
  has(key: string): boolean;
  
  // Fungsi untuk menghapus data dari cache
  delete(key: string): void;
  
  // Fungsi untuk membersihkan semua cache
  clear(): void;
}

// Interface kontrak untuk konfigurasi SIMRS Khanza
export interface IKhanzaConfig {
  // Konfigurasi database
  readonly db: {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
    waitForConnections: boolean;
    connectionLimit: number;
    queueLimit: number;
    enableKeepAlive: boolean;
    keepAliveInitialDelay: number;
  };
  
  // Konfigurasi fitur
  readonly features: {
    useMock: boolean;
    enableCache: boolean;
    cacheDuration: number;
  };
  
  // Konfigurasi API
  readonly api: {
    queryTimeout: number;
    maxRetries: number;
  };
}