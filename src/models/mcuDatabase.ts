// models/mcuDatabase.ts
import { Pool, PoolConnection } from 'mysql2/promise';

interface Patient {
  no_rkm_medis: string;
  nm_pasien: string;
  no_ktp: string;
  tgl_lahir: string;
  jk: string;
  alamat: string;
  no_tlp: string;
  email: string;
}

interface MCUPackage {
  id: string;
  name: string;
  description: string;
  price: string;
  features: string[];
}

interface MCUSchedule {
  date: string;
  day: string;
  available: boolean;
  doctor: string;
  time: string;
  maxCapacity: number;
  bookedCount: number;
}

interface MCUPatientData {
  identifier: string;
  name: string;
  birthDate: string;
  gender: string;
  address: string;
  phone: string;
  email?: string;
}

interface MCURegistration {
  noReg: string;
  noBooking: string;
  noOrder: string;
  packageId: string;
  date: string;
  time: string;
  patientRm: string;
}

class MCUDatabase {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  // Fungsi untuk mencari pasien berdasarkan RM atau NIK
  async findPatient(identifier: string): Promise<Patient | null> {
    const connection: PoolConnection = await this.pool.getConnection();
    try {
      const query = `
        SELECT no_rkm_medis, nm_pasien, no_ktp, tgl_lahir, jk, alamat, no_tlp, email 
        FROM pasien 
        WHERE no_rkm_medis = ? OR no_ktp = ?
      `;
      const [rows] = await connection.execute(query, [identifier, identifier]);
      const patientArray = rows as Patient[];
      return patientArray.length > 0 ? patientArray[0] : null;
    } finally {
      connection.release();
    }
  }

  // Fungsi untuk mengecek ketersediaan RM
  async isRmAvailable(rm: string): Promise<boolean> {
    const connection: PoolConnection = await this.pool.getConnection();
    try {
      const query = 'SELECT COUNT(*) as count FROM pasien WHERE no_rkm_medis = ?';
      const [rows] = await connection.execute(query, [rm]);
      
      interface CountResult {
        count: number;
      }
      
      const result = rows as CountResult[];
      return result[0].count === 0;
    } finally {
      connection.release();
    }
  }

  // Fungsi untuk membuat pasien baru
  async createNewPatient(patientData: MCUPatientData): Promise<string> {
    const connection: PoolConnection = await this.pool.getConnection();
    try {
      // Generate RM baru
      const newRm = await this.generateNewRm(connection);
      
      const query = `
        INSERT INTO pasien (no_rkm_medis, nm_pasien, no_ktp, tgl_lahir, jk, alamat, no_tlp, email) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      await connection.execute(query, [
        newRm,
        patientData.name,
        patientData.identifier, // NIK
        patientData.birthDate,
        patientData.gender,
        patientData.address,
        patientData.phone,
        patientData.email || null
      ]);
      
      return newRm;
    } finally {
      connection.release();
    }
  }

  // Fungsi untuk menghasilkan RM baru
  private async generateNewRm(connection: PoolConnection): Promise<string> {
    // Ambil RM terakhir
    const query = 'SELECT no_rkm_medis FROM pasien ORDER BY no_rkm_medis DESC LIMIT 1';
    const [rows] = await connection.execute(query);
    
    interface PatientResult {
      no_rkm_medis: string;
    }
    
    const lastPatient = (rows as PatientResult[])[0];
    
    let newRm: string;
    if (!lastPatient) {
      newRm = '000001'; // RM pertama
    } else {
      const lastNumber = parseInt(lastPatient.no_rkm_medis);
      const nextNumber = lastNumber + 1;
      newRm = nextNumber.toString().padStart(6, '0');
    }
    
    // Pastikan RM unik
    if (!(await this.isRmAvailable(newRm))) {
      // Jika tidak unik, tambahkan angka
      return this.generateNewRm(connection);
    }
    
    return newRm;
  }

  // Fungsi untuk membuat pendaftaran MCU
  async createMCURegistration(
    patientData: MCUPatientData,
    packageId: string,
    date: string,
    time: string
  ): Promise<MCURegistration> {
    const connection: PoolConnection = await this.pool.getConnection();
    try {
      await connection.beginTransaction();
      
      // Generate nomor registrasi baru
      const noReg = await this.generateNewRegistrationNumber(connection);
      const noBooking = await this.generateNewBookingNumber(connection);
      const noOrder = await this.generateNewOrderNumber(connection);
      
      // Masukkan ke reg_periksa
      const regQuery = `
        INSERT INTO reg_periksa (no_reg, no_rkm_medis, kd_dokter, kd_poli, tgl_registrasi, jam_reg, sttus, kd_pj) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      await connection.execute(regQuery, [
        noReg,
        patientData.identifier, // RM pasien
        'D001', // Dokter default MCU
        'MCU', // Kode poli MCU
        date,
        time,
        'Belum',
        'A01' // Penanggung jawab default
      ]);
      
      // Masukkan ke booking_registrasi
      const bookingQuery = `
        INSERT INTO booking_registrasi (no_booking, no_rkm_medis, kd_dokter, kd_poli, tanggal_periksa, jam_mulai, status, no_reg) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      await connection.execute(bookingQuery, [
        noBooking,
        patientData.identifier,
        'D001',
        'MCU',
        date,
        time,
        'Belum',
        noReg
      ]);
      
      // Masukkan ke permintaan_mcu
      const mcuQuery = `
        INSERT INTO permintaan_mcu (noorder, no_rkm_medis, tgl_permintaan, jam_permintaan, kd_pj, status, paket_mcu) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      await connection.execute(mcuQuery, [
        noOrder,
        patientData.identifier,
        new Date().toISOString().split('T')[0],
        new Date().toTimeString().split(' ')[0],
        'A01',
        'Belum',
        packageId
      ]);
      
      await connection.commit();
      
      return {
        noReg,
        noBooking,
        noOrder,
        packageId,
        date,
        time,
        patientRm: patientData.identifier
      };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Fungsi untuk generate nomor registrasi baru
  private async generateNewRegistrationNumber(connection: PoolConnection): Promise<string> {
    const date = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const query = `
      SELECT no_reg FROM reg_periksa 
      WHERE tgl_registrasi = ? 
      ORDER BY no_reg DESC LIMIT 1
    `;
    const [rows] = await connection.execute(query, [new Date().toISOString().split('T')[0]]);
    
    interface RegResult {
      no_reg: string;
    }
    
    const lastReg = (rows as RegResult[])[0];
    let newNumber: number;
    
    if (!lastReg) {
      newNumber = 1;
    } else {
      const lastNumber = parseInt(lastReg.no_reg.substring(8)); // Ambil angka setelah tanggal
      newNumber = lastNumber + 1;
    }
    
    return `REG${date}${newNumber.toString().padStart(4, '0')}`;
  }

  // Fungsi untuk generate nomor booking baru
  private async generateNewBookingNumber(connection: PoolConnection): Promise<string> {
    const date = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const query = `
      SELECT no_booking FROM booking_registrasi 
      WHERE tanggal_periksa = ? 
      ORDER BY no_booking DESC LIMIT 1
    `;
    const [rows] = await connection.execute(query, [new Date().toISOString().split('T')[0]]);
    
    interface BookingResult {
      no_booking: string;
    }
    
    const lastBooking = (rows as BookingResult[])[0];
    let newNumber: number;
    
    if (!lastBooking) {
      newNumber = 1;
    } else {
      const lastNumber = parseInt(lastBooking.no_booking.substring(8)); // Ambil angka setelah tanggal
      newNumber = lastNumber + 1;
    }
    
    return `BK${date}${newNumber.toString().padStart(4, '0')}`;
  }

  // Fungsi untuk generate nomor order baru
  private async generateNewOrderNumber(connection: PoolConnection): Promise<string> {
    const date = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const query = `
      SELECT noorder FROM permintaan_mcu 
      WHERE tgl_permintaan = ? 
      ORDER BY noorder DESC LIMIT 1
    `;
    const [rows] = await connection.execute(query, [new Date().toISOString().split('T')[0]]);
    
    interface OrderResult {
      noorder: string;
    }
    
    const lastOrder = (rows as OrderResult[])[0];
    let newNumber: number;
    
    if (!lastOrder) {
      newNumber = 1;
    } else {
      const lastNumber = parseInt(lastOrder.norder.substring(8)); // Ambil angka setelah tanggal
      newNumber = lastNumber + 1;
    }
    
    return `MCU${date}${newNumber.toString().padStart(4, '0')}`;
  }

  // Fungsi untuk mendapatkan paket MCU
  async getMCUPackages(): Promise<MCUPackage[]> {
    // Dalam implementasi nyata, ini akan query ke tabel paket_mcu
    // Untuk sekarang kita gunakan data mock
    return [
      {
        id: 'basic',
        name: 'MCU Basic',
        description: 'Pemeriksaan dasar kesehatan secara menyeluruh',
        price: 'Rp 500.000',
        features: [
          'Pemeriksaan fisik dokter',
          'Laboratorium dasar',
          'EKG',
          'Rontgen Thorax'
        ]
      },
      {
        id: 'silver',
        name: 'MCU Silver',
        description: 'Pemeriksaan komprehensif dengan hasil lengkap',
        price: 'Rp 1.200.000',
        features: [
          'Pemeriksaan fisik dokter',
          'Laboratorium lengkap',
          'EKG & USG Abdomen',
          'Rontgen Thorax',
          'Konsultasi dokter spesialis'
        ]
      },
      {
        id: 'gold',
        name: 'MCU Gold',
        description: 'Pemeriksaan menyeluruh dengan hasil mendalam',
        price: 'Rp 2.500.000',
        features: [
          'Pemeriksaan fisik dokter',
          'Laboratorium lengkap',
          'EKG & USG Abdomen',
          'Rontgen Thorax',
          'Konsultasi dokter spesialis',
          'USG Jantung',
          'Spirometri'
        ]
      },
      {
        id: 'executive',
        name: 'MCU Executive',
        description: 'Pemeriksaan premium dengan hasil terlengkap',
        price: 'Rp 4.500.000',
        features: [
          'Pemeriksaan fisik dokter',
          'Laboratorium lengkap',
          'EKG & USG Abdomen',
          'Rontgen Thorax',
          'Konsultasi dokter spesialis',
          'USG Jantung',
          'Spirometri',
          'Endoskopi',
          'MRI (opsional)'
        ]
      }
    ];
  }

  // Fungsi untuk cek ketersediaan jadwal MCU
  async checkScheduleAvailability(date: string, time?: string): Promise<MCUSchedule[]> {
    const connection: PoolConnection = await this.pool.getConnection();
    try {
      // Dapatkan nama hari dari tanggal
      const dayName = new Date(date).toLocaleDateString('id-ID', { weekday: 'long' });
      
      // Query untuk mendapatkan jumlah booking yang sudah ada
      const bookedQuery = `
        SELECT COUNT(*) as booked_count, jam_mulai
        FROM booking_registrasi
        WHERE tanggal_periksa = ? AND kd_poli = 'MCU' AND status != 'Batal'
        GROUP BY jam_mulai
      `;
      const [bookedRows] = await connection.execute(bookedQuery, [date]);
      
      interface BookedResult {
        booked_count: number;
        jam_mulai: string;
      }
      
      const bookedData = bookedRows as BookedResult[];
      const bookedMap = new Map<string, number>();
      bookedData.forEach(row => {
        bookedMap.set(row.jam_mulai, row.booked_count);
      });
      
      // Jadwal MCU default per hari
      const scheduleTemplate: Record<string, Array<{time: string, doctor: string}>> = {
        'Senin': [
          { time: '07:00', doctor: 'Dr. Ahmad' },
          { time: '08:00', doctor: 'Dr. Siti' },
          { time: '09:00', doctor: 'Dr. Budi' }
        ],
        'Selasa': [
          { time: '07:00', doctor: 'Dr. Rina' },
          { time: '08:00', doctor: 'Dr. Joko' },
          { time: '09:00', doctor: 'Dr. Lina' }
        ],
        'Rabu': [
          { time: '07:00', doctor: 'Dr. Ahmad' },
          { time: '08:00', doctor: 'Dr. Rina' },
          { time: '09:00', doctor: 'Dr. Joko' }
        ],
        'Kamis': [
          { time: '07:00', doctor: 'Dr. Siti' },
          { time: '08:00', doctor: 'Dr. Budi' },
          { time: '09:00', doctor: 'Dr. Lina' }
        ],
        'Jumat': [
          { time: '07:00', doctor: 'Dr. Ahmad' },
          { time: '08:00', doctor: 'Dr. Joko' },
          { time: '09:00', doctor: 'Dr. Rina' }
        ],
        'Sabtu': [
          { time: '07:00', doctor: 'Dr. Budi' },
          { time: '08:00', doctor: 'Dr. Lina' },
          { time: '09:00', doctor: 'Dr. Siti' }
        ]
      };
      
      const availableSchedules: MCUSchedule[] = [];
      
      if (scheduleTemplate[dayName]) {
        scheduleTemplate[dayName].forEach(slot => {
          const bookedCount = bookedMap.get(slot.time) || 0;
          const maxCapacity = 8; // Kapasitas maksimum per slot
          
          availableSchedules.push({
            date,
            day: dayName,
            available: bookedCount < maxCapacity,
            doctor: slot.doctor,
            time: slot.time,
            maxCapacity,
            bookedCount
          });
        });
      }
      
      // Filter jika waktu spesifik diminta
      if (time) {
        return availableSchedules.filter(schedule => schedule.time === time);
      }
      
      return availableSchedules;
    } finally {
      connection.release();
    }
  }
}

export { MCUDatabase, Patient, MCUPatientData, MCURegistration };