// src/lib/executive/executive-db.ts
import { createConnection, Connection } from 'mysql2/promise';

// Fungsi untuk membuat koneksi ke database SIMRS Khanza
export async function createKhanzaConnection(): Promise<Connection> {
  return await createConnection({
    host: process.env.KHANZA_DB_HOST || process.env.DB_HOST || 'localhost',
    user: process.env.KHANZA_DB_USER || process.env.DB_USER || 'root',
    password: process.env.KHANZA_DB_PASSWORD || process.env.DB_PASSWORD || '',
    database: process.env.KHANZA_DB_NAME || 'khanzasys',
    port: parseInt(process.env.KHANZA_DB_PORT || process.env.DB_PORT || '3306'),
    connectTimeout: 60000,
    acquireTimeout: 60000,
    timeout: 60000,
  });
}

// Fungsi untuk menjalankan query ke database SIMRS Khanza
export async function executeKhanzaQuery(query: string, params?: any[]) {
  const connection = await createKhanzaConnection();
  
  try {
    const [results] = await connection.execute(query, params);
    return results;
  } finally {
    await connection.end();
  }
}