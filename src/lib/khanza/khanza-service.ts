import {
  getReportsFromKhanza,
  getFinancialDataFromKhanza,
  getJournalDataFromKhanza,
  getDrugRevenueFromKhanza,
  findPatientByNIKInKhanza,
  findPatientByMedicalRecordNumberInKhanza,
  testKhanzaConnection,
  getPatientsFromKhanza,
  detectKhanzaTableStructure,
  createKhanzaDbConnection,
  getDoctorSchedulesFromKhanza,
  getActiveDoctorsFromKhanza,
  addPatientToKhanza,
  registerPatientToKhanzaOutpatient,
  syncPatientDataFromKhanza
} from './khanza-integration-final';
import { KhanzaConnectionResult } from './types';

// Interface untuk hasil integrasi SIMRS Khanza
export interface KhanzaIntegrationResult {
  reports: any[];
  financialData: any[];
  journalData: any[];
  drugRevenue: any[];
  doctorSchedules: any[];
  activeDoctors: any[];
  patientData: any | null;
}

// Service class untuk integrasi SIMRS Khanza
export class KhanzaIntegrationService {
  // Mengambil semua data dari SIMRS Khanza
  static async getAllData(): Promise<KhanzaIntegrationResult> {
    try {
      // Menjalankan semua fungsi secara paralel untuk efisiensi
      const [
        reports,
        financialData,
        journalData,
        drugRevenue
      ] = await Promise.all([
        getReportsFromKhanza(),
        getFinancialDataFromKhanza(),
        getJournalDataFromKhanza(),
        getDrugRevenueFromKhanza()
      ]);

      const [doctorSchedules, activeDoctors] = await Promise.all([
        getDoctorSchedulesFromKhanza(),
        getActiveDoctorsFromKhanza()
      ]);

      return {
        reports,
        financialData,
        journalData,
        drugRevenue,
        doctorSchedules,
        activeDoctors,
        patientData: null // Akan diisi jika mencari data pasien tertentu
      };
    } catch (error) {
      console.error('Error getting all data from SIMRS Khanza:', error);
      throw error;
    }
  }

  // Getter methods untuk data spesifik
  static async getReports(startDate?: string, endDate?: string): Promise<any[]> {
    return await getReportsFromKhanza(startDate, endDate);
  }

  static async getFinancialData(startDate?: string, endDate?: string): Promise<any[]> {
    return await getFinancialDataFromKhanza(startDate, endDate);
  }

  static async getJournalData(startDate?: string, endDate?: string): Promise<any[]> {
    return await getJournalDataFromKhanza(startDate, endDate);
  }

  static async getDrugRevenue(startDate?: string, endDate?: string): Promise<any[]> {
    return await getDrugRevenueFromKhanza(startDate, endDate);
  }

  static async getDoctorSchedules(doctorCode?: string, date?: string): Promise<any[]> {
    return await getDoctorSchedulesFromKhanza(doctorCode, date);
  }

  static async getActiveDoctors(): Promise<any[]> {
    return await getActiveDoctorsFromKhanza();
  }

  static async findPatientByNIK(nik: string): Promise<any | null> {
    return await findPatientByNIKInKhanza(nik);
  }

  static async findPatientByMedicalRecordNumber(mrn: string): Promise<any | null> {
    return await findPatientByMedicalRecordNumberInKhanza(mrn);
  }

  static async addPatient(patientData: any): Promise<any> {
    return await addPatientToKhanza(patientData);
  }

  static async registerPatientToOutpatient(registrationData: any): Promise<any> {
    return await registerPatientToKhanzaOutpatient(registrationData);
  }

  static async syncPatientData(medicalRecordNumber: string): Promise<any | null> {
    return await syncPatientDataFromKhanza(medicalRecordNumber);
  }

  // Method untuk mengetes koneksi ke SIMRS Khanza
  static async testConnection(): Promise<KhanzaConnectionResult> {
    return await testKhanzaConnection();
  }
}