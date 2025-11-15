// src/lib/mcu/mcu-db.ts
import mysql from 'mysql2/promise';

// Fungsi untuk membuat koneksi ke database SIMRS Khanza
export async function createKhanzaConnection() {
  const connection = await mysql.createConnection({
    host: process.env.KHAZNA_DB_HOST || 'localhost',
    user: process.env.KHAZNA_DB_USER || 'root',
    password: process.env.KHAZNA_DB_PASSWORD || '',
    database: process.env.KHAZNA_DB_NAME || 'khanza',
    port: parseInt(process.env.KHAZNA_DB_PORT || '3306'),
    // Opsi tambahan untuk koneksi yang lebih stabil
    connectTimeout: 60000, // 60 detik
    acquireTimeout: 60000, // 60 detik
    timeout: 60000, // 60 detik
    charset: 'utf8mb4',
    // Untuk menghindari masalah dengan tanggal
    dateStrings: true,
  });

  return connection;
}

// Fungsi untuk mengeksekusi query ke database SIMRS Khanza
export async function executeKhanzaQuery(query: string, params?: any[]) {
  const connection = await createKhanzaConnection();
  
  try {
    const [results] = await connection.execute(query, params);
    
    // Pastikan hasil dalam bentuk array
    if (Array.isArray(results)) {
      return results;
    } else if (results && typeof results === 'object') {
      // Jika hasil bukan array, ubah ke array
      return [results];
    } else {
      return [];
    }
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

// Fungsi untuk mengeksekusi multiple query dalam satu koneksi
export async function executeMultipleKhanzaQueries(queries: Array<{ query: string; params?: any[] }>) {
  const connection = await createKhanzaConnection();
  
  try {
    await connection.beginTransaction();
    
    const results = [];
    for (const q of queries) {
      const [result] = await connection.execute(q.query, q.params);
      results.push(result);
    }
    
    await connection.commit();
    return results;
  } catch (error) {
    await connection.rollback();
    console.error('Database transaction error:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

// Fungsi untuk mengeksekusi query INSERT dan mendapatkan ID terakhir
export async function executeKhanzaInsert(query: string, params?: any[]) {
  const connection = await createKhanzaConnection();
  
  try {
    const [result] = await connection.execute(query, params);
    
    if (result && (result as any).insertId) {
      return {
        insertId: (result as any).insertId,
        affectedRows: (result as any).affectedRows
      };
    }
    
    return result;
  } catch (error) {
    console.error('Database insert error:', error);
    throw error;
  } finally {
    await connection.end();
  }
}