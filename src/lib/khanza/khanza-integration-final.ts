import * as mysql from 'mysql2/promise';
import { Connection, Pool, PoolConnection, RowDataPacket } from 'mysql2/promise';
import { KHANZA_CONFIG } from './khanza-config';
import { db } from '../db';
import { khanzaCache, createCacheKey } from '../cache';
import {
  KhanzaDrugRevenue,
  AdvancedDrugRevenueReport
} from './types';
import {
  KHANZA_TABLE_MAPPINGS,
  DATE_COLUMN_NAMES,
  DESCRIPTION_COLUMN_NAMES,
  AMOUNT_COLUMN_NAMES,
  CODE_COLUMN_NAMES,
  TRANSACTION_SOURCE_MAPPING,
  FALLBACK_QUERIES,
  DEFAULT_CACHE_CONFIG
} from './khanza-constants';

// Interface untuk struktur tabel SIMRS Khanza
interface KhanzaTableStructure {
  hasDetailPemberianObat: boolean;
  hasPemberianObat: boolean;
  hasResepObat: boolean;
  hasResepDokter: boolean;
  hasPenjualan: boolean;
  hasDetailJual: boolean;
  hasDatabarang: boolean;
  hasJurnal: boolean;
  hasTransaksi: boolean;
  detailPemberianObatColumns: string[];
  pemberianObatColumns: string[];
  resepObatColumns: string[];
  resepDokterColumns: string[];
  penjualanColumns: string[];
  detailJualColumns: string[];
  databarangColumns: string[];
  jurnalColumns: string[];
  transaksiColumns: string[];
}

// Interface untuk konfigurasi koneksi
interface KhanzaDbConnection {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  waitForConnections?: boolean;
  connectionLimit?: number;
  queueLimit?: number;
}

// Pool koneksi ke database SIMRS Khanza
let pool: Pool;

// Fungsi untuk membuat koneksi ke database SIMRS Khanza
export async function createKhanzaDbConnection(): Promise<PoolConnection> {
  if (!pool) {
    const connectionConfig: KhanzaDbConnection = {
      host: process.env.KHANZA_DB_HOST || KHANZA_CONFIG.db.host,
      port: parseInt(process.env.KHANZA_DB_PORT || KHANZA_CONFIG.db.port.toString()),
      user: process.env.KHANZA_DB_USER || KHANZA_CONFIG.db.user,
      password: process.env.KHANZA_DB_PASSWORD || KHANZA_CONFIG.db.password,
      database: process.env.KHANZA_DB_NAME || KHANZA_CONFIG.db.database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    };

    // Validasi bahwa semua kredensial telah disediakan
    if (!connectionConfig.host || !connectionConfig.user || !connectionConfig.database) {
      throw new Error(
        'Kredensial database SIMRS Khanza tidak lengkap. Harap atur KHANZA_DB_HOST, KHANZA_DB_USER, KHANZA_DB_PASSWORD, dan KHANZA_DB_NAME di environment variables'
      );
    }

    pool = mysql.createPool(connectionConfig);
  }

  return await pool.getConnection();
}

// Fungsi untuk mendeteksi struktur tabel SIMRS Khanza
export async function detectKhanzaTableStructure(): Promise<KhanzaTableStructure> {
  let connection: PoolConnection | null = null;
  try {
    connection = await createKhanzaDbConnection();

    // Cek apakah tabel-tabel utama ada
    const [detailPemberianObatResult] = await connection.execute<RowDataPacket[]>(
      "SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'detail_pemberian_obat'"
    );
    const hasDetailPemberianObat = Array.isArray(detailPemberianObatResult) && detailPemberianObatResult.length > 0;

    const [pemberianObatResult] = await connection.execute<RowDataPacket[]>(
      "SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'pemberian_obat'"
    );
    const hasPemberianObat = Array.isArray(pemberianObatResult) && pemberianObatResult.length > 0;

    const [resepObatResult] = await connection.execute<RowDataPacket[]>(
      "SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'resep_obat'"
    );
    const hasResepObat = Array.isArray(resepObatResult) && resepObatResult.length > 0;

    const [resepDokterResult] = await connection.execute<RowDataPacket[]>(
      "SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'resep_dokter'"
    );
    const hasResepDokter = Array.isArray(resepDokterResult) && resepDokterResult.length > 0;

    const [penjualanResult] = await connection.execute<RowDataPacket[]>(
      "SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'penjualan'"
    );
    const hasPenjualan = Array.isArray(penjualanResult) && penjualanResult.length > 0;

    const [detailJualResult] = await connection.execute<RowDataPacket[]>(
      "SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'detailjual'"
    );
    const hasDetailJual = Array.isArray(detailJualResult) && detailJualResult.length > 0;

    const [databarangResult] = await connection.execute<RowDataPacket[]>(
      "SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'databarang'"
    );
    const hasDatabarang = Array.isArray(databarangResult) && databarangResult.length > 0;

    const [jurnalResult] = await connection.execute<RowDataPacket[]>(
      "SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'jurnal'"
    );
    const hasJurnal = Array.isArray(jurnalResult) && jurnalResult.length > 0;

    const [transaksiResult] = await connection.execute<RowDataPacket[]>(
      "SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'transaksi'"
    );
    const hasTransaksi = Array.isArray(transaksiResult) && transaksiResult.length > 0;

    // Ambil kolom-kolom dari masing-masing tabel
    const detailPemberianObatColumns = hasDetailPemberianObat
      ? (await getTableColumns(connection, 'detail_pemberian_obat')).map(col => col.Field)
      : [];

    const pemberianObatColumns = hasPemberianObat
      ? (await getTableColumns(connection, 'pemberian_obat')).map(col => col.Field)
      : [];

    const resepObatColumns = hasResepObat
      ? (await getTableColumns(connection, 'resep_obat')).map(col => col.Field)
      : [];

    const resepDokterColumns = hasResepDokter
      ? (await getTableColumns(connection, 'resep_dokter')).map(col => col.Field)
      : [];

    const penjualanColumns = hasPenjualan
      ? (await getTableColumns(connection, 'penjualan')).map(col => col.Field)
      : [];

    const detailJualColumns = hasDetailJual
      ? (await getTableColumns(connection, 'detailjual')).map(col => col.Field)
      : [];

    const databarangColumns = hasDatabarang
      ? (await getTableColumns(connection, 'databarang')).map(col => col.Field)
      : [];

    const jurnalColumns = hasJurnal
      ? (await getTableColumns(connection, 'jurnal')).map(col => col.Field)
      : [];

    const transaksiColumns = hasTransaksi
      ? (await getTableColumns(connection, 'transaksi')).map(col => col.Field)
      : [];

    return {
      hasDetailPemberianObat,
      hasPemberianObat,
      hasResepObat,
      hasResepDokter,
      hasPenjualan,
      hasDetailJual,
      hasDatabarang,
      hasJurnal,
      hasTransaksi,
      detailPemberianObatColumns,
      pemberianObatColumns,
      resepObatColumns,
      resepDokterColumns,
      penjualanColumns,
      detailJualColumns,
      databarangColumns,
      jurnalColumns,
      transaksiColumns
    };

  } finally {
    if (connection) {
      try {
        await connection.release();
      } catch (closeError) {
        console.warn('⚠️ Error releasing Khanza connection:', closeError);
      }
    }
  }
}

// Fungsi bantu untuk mendapatkan kolom-kolom dari tabel
async function getTableColumns(connection: Connection, tableName: string) {
  const [columns] = await connection.execute<RowDataPacket[]>(
    `SHOW COLUMNS FROM ${tableName}`
  );
  return columns;
}

// Fungsi untuk memeriksa keberadaan kolom tertentu
function hasColumn(columns: string[], columnName: string): boolean {
  return columns.includes(columnName);
}

// Fungsi untuk memilih kolom yang tersedia dari beberapa kemungkinan
function getAvailableColumn(columns: string[], possibleNames: string[]): string {
  for (const name of possibleNames) {
    if (columns.includes(name)) {
      return name;
    }
  }
  return possibleNames[0]; // Kembalikan yang pertama jika tak ada yang ditemukan
}

// Fungsi untuk membangun query pendapatan obat otomatis berdasarkan struktur tabel yang tersedia
function buildDrugRevenueQuery(tableStructure: KhanzaTableStructure, startDate?: string, endDate?: string, limit: number = 100): { query: string; params: any[] } {
  let query = `
    SELECT
      drug_data.id,
      drug_data.drug_name,
      drug_data.quantity_sold,
      drug_data.unit_price,
      drug_data.total_revenue,
      drug_data.cost_price,
      drug_data.total_cost,
      drug_data.profit,
      drug_data.profit_margin,
      drug_data.transaction_source,
      drug_data.patient_id,
      drug_data.prescription_id,
      DATE_FORMAT(drug_data.date, '%Y-%m-%d %H:%i:%s') as date,
      DATE_FORMAT(drug_data.created_at, '%Y-%m-%d %H:%i:%s') as created_at
    FROM (
  `;

  const params: any[] = [];
  let queryParts: string[] = [];

  // Bagian untuk transaksi rawat jalan dari detail_pemberian_obat jika tersedia
  if (tableStructure.hasDetailPemberianObat) {
    const kodeBrngCol = getAvailableColumn(tableStructure.detailPemberianObatColumns, ['kode_brng']);
    const jmlCol = getAvailableColumn(tableStructure.detailPemberianObatColumns, ['jml']);
    const biayaObatCol = getAvailableColumn(tableStructure.detailPemberianObatColumns, ['biaya_obat']);
    const hBeliCol = getAvailableColumn(tableStructure.detailPemberianObatColumns, ['h_beli', 'harga_beli']);
    const costPriceCol = getAvailableColumn(tableStructure.databarangColumns, ['h_beli', 'harga_beli']);
    const tglPerawatanCol = getAvailableColumn(tableStructure.detailPemberianObatColumns, ['tgl_perawatan']);
    const noRawatCol = getAvailableColumn(tableStructure.detailPemberianObatColumns, ['no_rawat']);

    queryParts.push(`
      -- Transaksi rawat jalan dari detail_pemberian_obat
      SELECT
        db.kode_brng as id,
        db.nama_brng as drug_name,
        dpo.${jmlCol} as quantity_sold,
        COALESCE(dpo.${biayaObatCol}, db.jualbebas) as unit_price,
        (COALESCE(dpo.${biayaObatCol}, db.jualbebas) * dpo.${jmlCol}) as total_revenue,
        COALESCE(dpo.${hBeliCol}, db.${costPriceCol}, 0) as cost_price,
        (COALESCE(dpo.${hBeliCol}, db.${costPriceCol}, 0) * dpo.${jmlCol}) as total_cost,
        ((COALESCE(dpo.${biayaObatCol}, db.jualbebas) * dpo.${jmlCol}) - (COALESCE(dpo.${hBeliCol}, db.${costPriceCol}, 0) * dpo.${jmlCol})) as profit,
        CASE
          WHEN (COALESCE(dpo.${hBeliCol}, db.${costPriceCol}, 0) * dpo.${jmlCol}) > 0
          THEN (((COALESCE(dpo.${biayaObatCol}, db.jualbebas) * dpo.${jmlCol}) - (COALESCE(dpo.${hBeliCol}, db.${costPriceCol}, 0) * dpo.${jmlCol})) / (COALESCE(dpo.${biayaObatCol}, db.jualbebas) * dpo.${jmlCol})) * 100
          ELSE 0
        END as profit_margin,
        'ralan' as transaction_source,
        dpo.${noRawatCol} as patient_id,
        '' as prescription_id,
        dpo.${tglPerawatanCol} as date,
        dpo.${tglPerawatanCol} as created_at
      FROM detail_pemberian_obat dpo
      JOIN databarang db ON dpo.${kodeBrngCol} = db.kode_brng
      WHERE 1=1
    `);

    let firstPart = queryParts[queryParts.length - 1];
    if (startDate && endDate) {
      firstPart += ` AND dpo.${tglPerawatanCol} BETWEEN ? AND ?`;
      params.push(startDate, endDate);
    } else {
      firstPart += ` AND dpo.${tglPerawatanCol} >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)`;
    }
    queryParts[queryParts.length - 1] = firstPart;
  }

  // Bagian untuk transaksi rawat inap dari pemberian_obat jika tersedia
  if (tableStructure.hasPemberianObat) {
    const kodeBrngCol = getAvailableColumn(tableStructure.pemberianObatColumns, ['kode_brng']);
    const jlhObatCol = getAvailableColumn(tableStructure.pemberianObatColumns, ['jlh_obat']);
    const tglPemberianCol = getAvailableColumn(tableStructure.pemberianObatColumns, ['tgl_pemberian']);
    const noRawatCol = getAvailableColumn(tableStructure.pemberianObatColumns, ['no_rawat']);
    const costPriceCol = getAvailableColumn(tableStructure.databarangColumns, ['h_beli', 'harga_beli']);

    let pemberianObatPart = `
      -- Transaksi rawat inap dari pemberian_obat
      SELECT
        db.kode_brng as id,
        db.nama_brng as drug_name,
        po.${jlhObatCol} as quantity_sold,
        COALESCE(db.jualbebas) as unit_price,
        (COALESCE(db.jualbebas) * po.${jlhObatCol}) as total_revenue,
        COALESCE(db.${costPriceCol}, 0) as cost_price,
        (COALESCE(db.${costPriceCol}, 0) * po.${jlhObatCol}) as total_cost,
        ((COALESCE(db.jualbebas) * po.${jlhObatCol}) - (COALESCE(db.${costPriceCol}, 0) * po.${jlhObatCol})) as profit,
        CASE
          WHEN (COALESCE(db.${costPriceCol}, 0) * po.${jlhObatCol}) > 0
          THEN (((COALESCE(db.jualbebas) * po.${jlhObatCol}) - (COALESCE(db.${costPriceCol}, 0) * po.${jlhObatCol})) / (COALESCE(db.jualbebas) * po.${jlhObatCol})) * 100
          ELSE 0
        END as profit_margin,
        'ranap' as transaction_source,
        po.${noRawatCol} as patient_id,
        '' as prescription_id,
        po.${tglPemberianCol} as date,
        po.${tglPemberianCol} as created_at
      FROM pemberian_obat po
      JOIN databarang db ON po.${kodeBrngCol} = db.kode_brng
      WHERE po.${tglPemberianCol} IS NOT NULL
    `;

    if (startDate && endDate) {
      pemberianObatPart += ` AND po.${tglPemberianCol} BETWEEN ? AND ?`;
      params.push(startDate, endDate);
    } else {
      pemberianObatPart += ` AND po.${tglPemberianCol} >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)`;
    }

    queryParts.push(pemberianObatPart);
  }

  // Bagian untuk transaksi resep jika tersedia
  if (tableStructure.hasResepObat && tableStructure.hasResepDokter) {
    const kodeBrngCol = getAvailableColumn(tableStructure.resepDokterColumns, ['kode_brng']);
    const jmlCol = getAvailableColumn(tableStructure.resepDokterColumns, ['jml']);
    const noResepCol = getAvailableColumn(tableStructure.resepObatColumns, ['no_resep']);
    const tglPeresepanCol = getAvailableColumn(tableStructure.resepObatColumns, ['tgl_peresepan']);
    const noRawatCol = getAvailableColumn(tableStructure.resepObatColumns, ['no_rawat']);
    const costPriceCol = getAvailableColumn(tableStructure.databarangColumns, ['h_beli', 'harga_beli']);

    let resepPart = `
      -- Transaksi resep dari resep_dokter dan resep_obat
      SELECT
        rd.${kodeBrngCol} as id,
        db.nama_brng as drug_name,
        rd.${jmlCol} as quantity_sold,
        COALESCE(db.jualbebas) as unit_price,
        (COALESCE(db.jualbebas) * rd.${jmlCol}) as total_revenue,
        COALESCE(db.${costPriceCol}, 0) as cost_price,
        (COALESCE(db.${costPriceCol}, 0) * rd.${jmlCol}) as total_cost,
        ((COALESCE(db.jualbebas) * rd.${jmlCol}) - (COALESCE(db.${costPriceCol}, 0) * rd.${jmlCol})) as profit,
        CASE
          WHEN (COALESCE(db.${costPriceCol}, 0) * rd.${jmlCol}) > 0
          THEN (((COALESCE(db.jualbebas) * rd.${jmlCol}) - (COALESCE(db.${costPriceCol}, 0) * rd.${jmlCol})) / (COALESCE(db.jualbebas) * rd.${jmlCol})) * 100
          ELSE 0
        END as profit_margin,
        'resep' as transaction_source,
        ro.${noRawatCol} as patient_id,
        ro.${noResepCol} as prescription_id,
        ro.${tglPeresepanCol} as date,
        ro.${tglPeresepanCol} as created_at
      FROM resep_obat ro
      JOIN resep_dokter rd ON ro.${noResepCol} = rd.${noResepCol}
      JOIN databarang db ON rd.${kodeBrngCol} = db.kode_brng
      WHERE ro.${tglPeresepanCol} IS NOT NULL
    `;

    if (startDate && endDate) {
      resepPart += ` AND ro.${tglPeresepanCol} BETWEEN ? AND ?`;
      params.push(startDate, endDate);
    } else {
      resepPart += ` AND ro.${tglPeresepanCol} >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)`;
    }

    queryParts.push(resepPart);
  }

  // Bagian untuk transaksi jual bebas jika tersedia
  if (tableStructure.hasPenjualan && tableStructure.hasDetailJual) {
    const kodeBrngCol = getAvailableColumn(tableStructure.detailJualColumns, ['kode_brng']);
    const jumlahCol = getAvailableColumn(tableStructure.detailJualColumns, ['jumlah', 'jml_jual']);
    const hJualCol = getAvailableColumn(tableStructure.detailJualColumns, ['h_jual', 'harga']);
    const hBeliCol = getAvailableColumn(tableStructure.detailJualColumns, ['h_beli', 'harga_beli']);
    const subtotalCol = getAvailableColumn(tableStructure.detailJualColumns, ['subtotal']);
    const tglJualCol = getAvailableColumn(tableStructure.penjualanColumns, ['tgl_jual']);
    const notaJualCol = getAvailableColumn(tableStructure.penjualanColumns, ['nota_jual']);
    const notaJualColDetail = getAvailableColumn(tableStructure.detailJualColumns, ['nota_jual']);
    const costPriceCol = getAvailableColumn(tableStructure.databarangColumns, ['h_beli', 'harga_beli']);

    let jualBebasPart = `
      -- Transaksi jual bebas
      SELECT
        db.kode_brng as id,
        db.nama_brng as drug_name,
        dj.${jumlahCol} as quantity_sold,
        COALESCE(dj.${hJualCol}, db.jualbebas) as unit_price,
        COALESCE(dj.${subtotalCol}, dj.${hJualCol} * dj.${jumlahCol}, db.jualbebas * dj.${jumlahCol}) as total_revenue,
        COALESCE(dj.${hBeliCol}, db.${costPriceCol}, 0) as cost_price,
        (COALESCE(dj.${hBeliCol}, db.${costPriceCol}, 0) * dj.${jumlahCol}) as total_cost,
        (COALESCE(dj.${subtotalCol}, dj.${hJualCol} * dj.${jumlahCol}, db.jualbebas * dj.${jumlahCol}) - (COALESCE(dj.${hBeliCol}, db.${costPriceCol}, 0) * dj.${jumlahCol})) as profit,
        CASE
          WHEN (COALESCE(dj.${hBeliCol}, db.${costPriceCol}, 0) * dj.${jumlahCol}) > 0
          THEN ((COALESCE(dj.${subtotalCol}, dj.${hJualCol} * dj.${jumlahCol}, db.jualbebas * dj.${jumlahCol}) - (COALESCE(dj.${hBeliCol}, db.${costPriceCol}, 0) * dj.${jumlahCol})) / COALESCE(dj.${subtotalCol}, dj.${hJualCol} * dj.${jumlahCol}, db.jualbebas * dj.${jumlahCol}, 1)) * 100
          ELSE 0
        END as profit_margin,
        'jual_bebas' as transaction_source,
        '' as patient_id,
        '' as prescription_id,
        p.${tglJualCol} as date,
        p.${tglJualCol} as created_at
      FROM penjualan p
      JOIN detailjual dj ON p.${notaJualCol} = dj.${notaJualColDetail}
      JOIN databarang db ON dj.${kodeBrngCol} = db.kode_brng
      WHERE 1=1
    `;

    if (startDate && endDate) {
      jualBebasPart += ` AND p.${tglJualCol} BETWEEN ? AND ?`;
      params.push(startDate, endDate);
    } else {
      jualBebasPart += ` AND p.${tglJualCol} >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)`;
    }

    queryParts.push(jualBebasPart);
  }

  // Gabungkan semua bagian query
  query += queryParts.join(' UNION ALL ') + `
    ) AS drug_data
    ORDER BY drug_data.date DESC
    LIMIT ?
  `;
  params.push(limit);

  return { query, params };
}

// Fungsi untuk eksekusi query dengan cache
async function executeQueryWithCache(query: string, params: any[], cacheKey: string): Promise<any> {
  if (KHANZA_CONFIG.features.enableCache && khanzaCache.get(cacheKey)) {
    console.log(`Cache hit for key: ${cacheKey}`);
    return khanzaCache.get(cacheKey);
  }

  let connection: PoolConnection | null = null;
  try {
    console.log(`Executing query: ${query.substring(0, 100)}...`); // Log hanya sebagian query
    connection = await createKhanzaDbConnection();
    const [result] = await connection.execute(query, params);

    if (KHANZA_CONFIG.features.enableCache) {
      // Gunakan TTL dinamis tergantung jumlah hasil
      const cacheTtl = params[params.length - 1] > 50 ? 300000 : 60000; // 5 menit untuk limit > 50, 1 menit untuk yang lain
      khanzaCache.set(cacheKey, result, cacheTtl);
      console.log(`Data cached for key: ${cacheKey} with TTL: ${cacheTtl}ms`);
    }

    return Array.isArray(result) ? result : [];
  } catch (error) {
    console.error('[KHANZA ERROR]', error instanceof Error ? error.message : error);
    throw new Error(`Khanza DB Error: ${error instanceof Error ? error.message : String(error)}`);
  } finally {
    if (connection) {
      try {
        await connection.release();
      } catch (closeError) {
        console.warn('⚠️ Error releasing Khanza connection:', closeError);
      }
    }
  }
}

// Fungsi untuk menguji koneksi ke database SIMRS Khanza
export async function testKhanzaConnection(): Promise<{ success: boolean; message: string; version?: string; tables?: string[] }> {
  let connection: PoolConnection | null = null;

  try {
    console.log('Mencoba membuat koneksi ke database SIMRS Khanza...');

    // Buat koneksi ke database SIMRS
    connection = await createKhanzaDbConnection();

    console.log('Koneksi berhasil dibuat. Mengambil informasi database...');

    // Uji koneksi dengan mengambil versi database
    const [versionResult] = await connection.execute('SELECT VERSION() as version');
    const version = Array.isArray(versionResult) && versionResult[0]
      ? (versionResult[0] as any).version
      : 'Unknown';

    // Ambil beberapa nama tabel untuk verifikasi
    const [tablesResult] = await connection.execute(
      "SELECT TABLE_NAME as name FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE() LIMIT 10"
    );

    const tables = Array.isArray(tablesResult)
      ? tablesResult.map((row: any) => row.name)
      : [];

    // Coba akses tabel pasien untuk verifikasi struktur
    try {
      const [patientTable] = await connection.execute("SHOW COLUMNS FROM pasien");
      if (!Array.isArray(patientTable) || patientTable.length === 0) {
        throw new Error("Tabel 'pasien' tidak ditemukan atau tidak dapat diakses");
      }
    } catch (tableError) {
      console.warn("Peringatan: Tidak dapat mengakses tabel 'pasien':", tableError);
    }

    console.log('Koneksi ke database SIMRS Khanza berhasil!');

    return {
      success: true,
      message: `Terhubung ke database SIMRS Khanza. Versi: ${version}`,
      version,
      tables
    };
  } catch (error) {
    console.error('[KHANZA ERROR]', error instanceof Error ? error.message : error);

    if (error instanceof Error) {
      let message = error.message;

      if (message.includes('ECONNREFUSED')) {
        message = `Tidak dapat terhubung ke database SIMRS Khanza di ${KHANZA_CONFIG.db.host}:${KHANZA_CONFIG.db.port}. Pastikan server database berjalan dan konfigurasi benar.`;
      } else if (message.includes('ER_ACCESS_DENIED_ERROR')) {
        message = 'Kredensial database SIMRS Khanza salah. Periksa username dan password.';
      } else if (message.includes('ER_BAD_DB_ERROR')) {
        message = `Database '${KHANZA_CONFIG.db.database}' tidak ditemukan di server.`;
      }

      return {
        success: false,
        message: `Koneksi ke database SIMRS Khanza gagal: ${message}`
      };
    }

    return {
      success: false,
      message: 'Koneksi ke database SIMRS Khanza gagal dengan error tidak dikenal'
    };
  } finally {
    if (connection) {
      try {
        await connection.release();
      } catch (closeError) {
        console.warn('⚠️ Error releasing Khanza connection:', closeError);
      }
    }
  }
}

// Fungsi untuk mendapatkan data pendapatan obat dari SIMRS Khanza dengan pendekatan otomatis
export async function getDrugRevenueFromKhanza(startDate?: string, endDate?: string, limit: number = 100): Promise<KhanzaDrugRevenue[]> {
  try {
    const cacheKey = createCacheKey('getDrugRevenueFromKhanza', { startDate, endDate, limit });

    if (KHANZA_CONFIG.features.enableCache && khanzaCache.get(cacheKey)) {
      console.log(`Cache hit for key: ${cacheKey}`);
      return khanzaCache.get(cacheKey);
    }

    // Otomatis deteksi struktur tabel SIMRS Khanza
    const tableStructure = await detectKhanzaTableStructure();
    console.log('Struktur tabel SIMRS Khanza terdeteksi:', tableStructure);

    // Bangun query otomatis berdasarkan struktur tabel
    const { query, params } = buildDrugRevenueQuery(tableStructure, startDate, endDate, limit);

    const results = await executeQueryWithCache(
      query,
      params,
      cacheKey
    );

    const drugRevenue = Array.isArray(results) ? results : [];

    if (KHANZA_CONFIG.features.enableCache) {
      // Gunakan TTL dinamis tergantung jumlah hasil
      const cacheTtl = limit > 50 ? 300000 : 60000; // 5 menit untuk limit > 50, 1 menit untuk yang lain
      khanzaCache.set(cacheKey, drugRevenue, cacheTtl);
      console.log(`Data cached for key: ${cacheKey} with TTL: ${cacheTtl}ms`);
    }

    return drugRevenue;
  } catch (error) {
    console.error('[KHANZA ERROR]', error instanceof Error ? error.message : error);
    throw new Error(`Khanza DB Error: ${error instanceof Error ? error.message : String(error)}`);
  }
}


// Fungsi untuk mendapatkan data jurnal keuangan dari SIMRS Khanza
export async function getJournalDataFromKhanza(startDate?: string, endDate?: string, limit: number = 100): Promise<any[]> {
  try {
    const cacheKey = createCacheKey('getJournalDataFromKhanza', { startDate, endDate, limit });

    if (KHANZA_CONFIG.features.enableCache && khanzaCache.get(cacheKey)) {
      console.log(`Cache hit for key: ${cacheKey}`);
      return khanzaCache.get(cacheKey);
    }

    // Query utama: Pendekatan berdasarkan struktur SIMRS Khanza yang sebenarnya
    let query = `
      SELECT
        COALESCE(j.kd_rek, j.kode_rek, j.rek) as account_code,
        COALESCE(j.nm_rek, j.nama_rek) as account_name,
        DATE_FORMAT(COALESCE(j.tgl_jurnal, j.tanggal, j.tgl), '%Y-%m-%d %H:%i:%s') as date,
        COALESCE(j.no_jurnal, j.no_bukti) as journal_number,
        COALESCE(j.keterangan, j.ket) as description,
        COALESCE(j.debet, j.debit) as debit,
        j.kredit as credit,
        DATE_FORMAT(j.tgl_input, '%Y-%m-%d %H:%i:%s') as created_at
      FROM jurnal j
      WHERE 1=1
    `;

    const params: any[] = [];

    // Tambahkan filter tanggal jika disediakan
    if (startDate && endDate) {
      query += ` AND j.tgl_jurnal BETWEEN ? AND ?`;
      params.push(startDate, endDate);
    } else {
      // Jika tidak ada tanggal, gunakan default 30 hari terakhir
      query += ` AND j.tgl_jurnal >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)`;
    }

    query += ` ORDER BY j.tgl_jurnal DESC LIMIT ?`;
    params.push(limit);

    const results = await executeQueryWithCache(query, params, cacheKey);

    const journalData = Array.isArray(results) ? results : [];

    if (KHANZA_CONFIG.features.enableCache) {
      // Gunakan TTL dinamis tergantung jumlah hasil
      const cacheTtl = limit > 50 ? 300000 : 60000; // 5 menit untuk limit > 50, 1 menit untuk yang lain
      khanzaCache.set(cacheKey, journalData, cacheTtl);
      console.log(`Data cached for key: ${cacheKey} with TTL: ${cacheTtl}ms`);
    }

    return journalData;
  } catch (error) {
    console.error('[KHANZA ERROR]', error instanceof Error ? error.message : error);
    throw new Error(`Khanza DB Error: ${error instanceof Error ? error.message : String(error)}`);
  }
}


// Fungsi untuk mendapatkan data keuangan dari SIMRS Khanza
export async function getFinancialDataFromKhanza(startDate?: string, endDate?: string, limit: number = 100): Promise<any[]> {
  try {
    const cacheKey = createCacheKey('getFinancialDataFromKhanza', { startDate, endDate, limit });

    if (KHANZA_CONFIG.features.enableCache && khanzaCache.get(cacheKey)) {
      console.log(`Cache hit for key: ${cacheKey}`);
      return khanzaCache.get(cacheKey);
    }

    // Fallback queries untuk berbagai skenario
    const fallbackQueries = [
      // Fallback 1: Tabel transaksi keuangan
      {
        query: `
          SELECT
            COALESCE(t.kode_rek, t.kd_rek, t.rek) as account_code,
            COALESCE(t.nama_rek, t.nm_rek) as account_name,
            DATE_FORMAT(COALESCE(t.tgl, t.tgl_transaksi, t.tanggal), '%Y-%m-%d %H:%i:%s') as date,
            t.keterangan as description,
            COALESCE(t.jenis, t.tipe) as type,
            COALESCE(t.nilai, t.nominal, t.jumlah) as amount,
            t.no_bukti as reference_number,
            DATE_FORMAT(t.tgl_input, '%Y-%m-%d %H:%i:%s') as created_at
          FROM transaksi t
          WHERE 1=1
          ORDER BY t.tgl_transaksi DESC
          LIMIT ?
        `,
        description: 'Fallback 1: Tabel transaksi keuangan'
      },
      // Fallback 2: Tabel jurnal
      {
        query: `
          SELECT
            COALESCE(j.kd_rek, j.kode_rek, j.rek) as account_code,
            COALESCE(j.nm_rek, j.nama_rek) as account_name,
            DATE_FORMAT(COALESCE(j.tgl_jurnal, j.tanggal, j.tgl), '%Y-%m-%d %H:%i:%s') as date,
            j.keterangan as description,
            'JURNAL' as type,
            COALESCE(j.debet, j.debit) as amount,
            j.no_jurnal as reference_number,
            DATE_FORMAT(j.tgl_input, '%Y-%m-%d %H:%i:%s') as created_at
          FROM jurnal j
          WHERE 1=1
          ORDER BY j.tgl_jurnal DESC
          LIMIT ?
        `,
        description: 'Fallback 2: Tabel jurnal keuangan'
      },
      // Fallback 3: Tabel keuangan
      {
        query: `
          SELECT
            COALESCE(k.kode_rek, k.kd_rek, k.rek) as account_code,
            COALESCE(k.nama_akun, k.nama_rek, k.nm_rek) as account_name,
            DATE_FORMAT(COALESCE(k.tgl, k.tgl_transaksi, k.tanggal), '%Y-%m-%d %H:%i:%s') as date,
            k.keterangan as description,
            COALESCE(k.jenis, k.tipe) as type,
            COALESCE(k.nominal, k.nilai, k.jumlah) as amount,
            k.no_bukti as reference_number,
            DATE_FORMAT(k.tgl_input, '%Y-%m-%d %H:%i:%s') as created_at
          FROM keuangan k
          WHERE 1=1
          ORDER BY k.tgl_transaksi DESC
          LIMIT ?
        `,
        description: 'Fallback 3: Tabel keuangan'
      },
      // Fallback 4: Tabel transaksi_keu
      {
        query: `
          SELECT
            COALESCE(tk.kd_rek, tk.kode_rek, tk.rek) as account_code,
            COALESCE(tk.nm_rek, tk.nama_rek) as account_name,
            DATE_FORMAT(COALESCE(tk.tgl, tk.tgl_transaksi, tk.tanggal), '%Y-%m-%d %H:%i:%s') as date,
            tk.keterangan as description,
            COALESCE(tk.jenis, tk.tipe) as type,
            COALESCE(tk.nilai, tk.nominal, tk.jumlah) as amount,
            tk.no_bukti as reference_number,
            DATE_FORMAT(tk.tgl_input, '%Y-%m-%d %H:%i:%s') as created_at
          FROM transaksi_keu tk
          WHERE 1=1
          ORDER BY tk.tgl_transaksi DESC
          LIMIT ?
        `,
        description: 'Fallback 4: Tabel transaksi keuangan'
      }
    ];

    // Coba setiap query fallback
    for (let i = 0; i < fallbackQueries.length; i++) {
      try {
        console.log(`Mencoba ${fallbackQueries[i].description}`);

        const fallbackResult = await executeQueryWithCache(
          fallbackQueries[i].query,
          [limit],
          createCacheKey(`getFinancialDataFromKhanza_fallback_${i}`, { startDate, endDate, limit })
        );

        if (Array.isArray(fallbackResult) && fallbackResult.length > 0) {
          console.log(`Fallback ${i + 1} berhasil: ${fallbackQueries[i].description}`);
          return fallbackResult;
        }
      } catch (fallbackError) {
        console.error(`Fallback ${i + 1} gagal (${fallbackQueries[i].description}):`, fallbackError);
        // Lanjutkan ke fallback berikutnya
      }
    }

    // Jika semua fallback gagal, kembalikan array kosong
    console.warn('Semua fallback query gagal untuk getFinancialDataFromKhanza');
    return [];
  } catch (error) {
    console.error('[KHANZA ERROR]', error instanceof Error ? error.message : error);
    throw new Error(`Khanza DB Error: ${error instanceof Error ? error.message : String(error)}`);
  }
}


// Fungsi untuk mendapatkan laporan keuangan dari SIMRS Khanza
export async function getReportsFromKhanza(startDate?: string, endDate?: string, limit: number = 100): Promise<any[]> {
  try {
    const cacheKey = createCacheKey('getReportsFromKhanza', { startDate, endDate, limit });

    if (KHANZA_CONFIG.features.enableCache && khanzaCache.get(cacheKey)) {
      console.log(`Cache hit for key: ${cacheKey}`);
      return khanzaCache.get(cacheKey);
    }

    // Fallback queries untuk berbagai skenario
    const fallbackQueries = [
      // Fallback 1: Tabel laporan keuangan
      {
        query: `
          SELECT
            COALESCE(l.kode_laporan, l.kd_laporan, l.rek) as report_code,
            COALESCE(l.nama_laporan, l.nm_laporan) as report_name,
            DATE_FORMAT(COALESCE(l.tgl, l.tgl_laporan, l.tanggal), '%Y-%m-%d %H:%i:%s') as date,
            l.keterangan as description,
            COALESCE(l.jenis, l.tipe) as type,
            COALESCE(l.nilai, l.nominal, l.jumlah) as amount,
            l.no_bukti as reference_number,
            DATE_FORMAT(l.tgl_input, '%Y-%m-%d %H:%i:%s') as created_at
          FROM laporan_keuangan l
          WHERE 1=1
          ORDER BY l.tgl_laporan DESC
          LIMIT ?
        `,
        description: 'Fallback 1: Tabel laporan keuangan'
      },
      // Fallback 2: Tabel laporan
      {
        query: `
          SELECT
            COALESCE(l.kode_laporan, l.kd_laporan, l.rek) as report_code,
            COALESCE(l.nama_laporan, l.nm_laporan) as report_name,
            DATE_FORMAT(COALESCE(l.tgl, l.tgl_laporan, l.tanggal), '%Y-%m-%d %H:%i:%s') as date,
            l.keterangan as description,
            COALESCE(l.jenis, l.tipe) as type,
            COALESCE(l.nilai, l.nominal, l.jumlah) as amount,
            l.no_bukti as reference_number,
            DATE_FORMAT(l.tgl_input, '%Y-%m-%d %H:%i:%s') as created_at
          FROM laporan l
          WHERE 1=1
          ORDER BY l.tgl_laporan DESC
          LIMIT ?
        `,
        description: 'Fallback 2: Tabel laporan'
      },
      // Fallback 3: Tabel rekap_keu
      {
        query: `
          SELECT
            COALESCE(r.kode_rek, r.kd_rek, r.rek) as report_code,
            COALESCE(r.nama_rek, r.nm_rek) as report_name,
            DATE_FORMAT(COALESCE(r.tgl, r.tgl_rekap, r.tanggal), '%Y-%m-%d %H:%i:%s') as date,
            r.keterangan as description,
            COALESCE(r.jenis, r.tipe) as type,
            COALESCE(r.nilai, r.nominal, r.jumlah) as amount,
            r.no_bukti as reference_number,
            DATE_FORMAT(r.tgl_input, '%Y-%m-%d %H:%i:%s') as created_at
          FROM rekap_keu r
          WHERE 1=1
          ORDER BY r.tgl_rekap DESC
          LIMIT ?
        `,
        description: 'Fallback 3: Tabel rekap keuangan'
      },
      // Fallback 4: Tabel transaksi keuangan
      {
        query: `
          SELECT
            COALESCE(tk.kode_rek, tk.kd_rek, tk.rek) as report_code,
            COALESCE(tk.nama_rek, tk.nm_rek) as report_name,
            DATE_FORMAT(COALESCE(tk.tgl, tk.tgl_transaksi, tk.tanggal), '%Y-%m-%d %H:%i:%s') as date,
            tk.keterangan as description,
            COALESCE(tk.jenis, tk.tipe) as type,
            COALESCE(tk.nilai, tk.nominal, tk.jumlah) as amount,
            tk.no_bukti as reference_number,
            DATE_FORMAT(tk.tgl_input, '%Y-%m-%d %H:%i:%s') as created_at
          FROM transaksi_keu tk
          WHERE 1=1
          ORDER BY tk.tgl_transaksi DESC
          LIMIT ?
        `,
        description: 'Fallback 4: Tabel transaksi keuangan'
      }
    ];

    // Coba setiap query fallback
    for (let i = 0; i < fallbackQueries.length; i++) {
      try {
        console.log(`Mencoba ${fallbackQueries[i].description}`);

        const fallbackResult = await executeQueryWithCache(
          fallbackQueries[i].query,
          [limit],
          createCacheKey(`getReportsFromKhanza_fallback_${i}`, { startDate, endDate, limit })
        );

        if (Array.isArray(fallbackResult) && fallbackResult.length > 0) {
          console.log(`Fallback ${i + 1} berhasil: ${fallbackQueries[i].description}`);
          return fallbackResult;
        }
      } catch (fallbackError) {
        console.error(`Fallback ${i + 1} gagal (${fallbackQueries[i].description}):`, fallbackError);
        // Lanjutkan ke fallback berikutnya
      }
    }

    // Jika semua fallback gagal, kembalikan array kosong
    console.warn('Semua fallback query gagal untuk getReportsFromKhanza');
    return [];
  } catch (error) {
    console.error('[KHANZA ERROR]', error instanceof Error ? error.message : error);
    throw new Error(`Khanza DB Error: ${error instanceof Error ? error.message : String(error)}`);
  }
}


// Fungsi untuk mendapatkan data pasien dari SIMRS Khanza
export async function getPatientsFromKhanza(limit: number = 50): Promise<any[]> {
  try {
    const cacheKey = createCacheKey('getPatientsFromKhanza', { limit });

    if (KHANZA_CONFIG.features.enableCache && khanzaCache.get(cacheKey)) {
      console.log(`Cache hit for key: ${cacheKey}`);
      return khanzaCache.get(cacheKey);
    }

    let connection: PoolConnection | null = null;
    try {
      console.log('Mengambil data pasien dari SIMRS Khanza...');
      connection = await createKhanzaDbConnection();

      // Query untuk mengambil data pasien
      const query = `
        SELECT
          no_rkm_medis as patient_id,
          nm_pasien as patient_name,
          jk as gender,
          DATE_FORMAT(tgl_lahir, '%Y-%m-%d') as birth_date,
          almt as address,
          tgl_daftar as registration_date
        FROM pasien
        ORDER BY tgl_daftar DESC
        LIMIT ?
      `;

      const [results] = await connection.execute(query, [limit]);

      const patients = Array.isArray(results) ? results : [];

      if (KHANZA_CONFIG.features.enableCache) {
        const cacheTtl = 300000; // 5 menit
        khanzaCache.set(cacheKey, patients, cacheTtl);
        console.log(`Pasien data cached for key: ${cacheKey} with TTL: ${cacheTtl}ms`);
      }

      return patients;
    } finally {
      if (connection) {
        try {
          await connection.end();
        } catch (closeError) {
          console.warn('⚠️ Error closing Khanza connection:', closeError);
        }
      }
    }
  } catch (error) {
    console.error('[KHANZA ERROR]', error instanceof Error ? error.message : error);
    throw new Error(`Khanza DB Error: ${error instanceof Error ? error.message : String(error)}`);
  }
}


// Fungsi untuk mencari pasien di database SIMRS Khanza berdasarkan NIK
export async function findPatientByNIKInKhanza(nik: string): Promise<any | null> {
  try {
    const cacheKey = createCacheKey('findPatientByNIKInKhanza', { nik });

    if (KHANZA_CONFIG.features.enableCache && khanzaCache.get(cacheKey)) {
      console.log(`Cache hit for key: ${cacheKey}`);
      return khanzaCache.get(cacheKey);
    }

    let connection: PoolConnection | null = null;
    try {
      console.log(`Mencari pasien dengan NIK: ${nik}`);
      connection = await createKhanzaDbConnection();

      // Query untuk mencari pasien berdasarkan NIK
      const query = `
        SELECT
          no_rkm_medis as patient_id,
          nm_pasien as patient_name,
          jk as gender,
          DATE_FORMAT(tgl_lahir, '%Y-%m-%d') as birth_date,
          almt as address,
          tgl_daftar as registration_date
        FROM pasien
        WHERE no_ktp = ?
        LIMIT 1
      `;

      const [results] = await connection.execute(query, [nik]);

      const patient = Array.isArray(results) && results.length > 0 ? results[0] : null;

      if (KHANZA_CONFIG.features.enableCache) {
        const cacheTtl = 3600000; // 1 jam
        khanzaCache.set(cacheKey, patient, cacheTtl);
        console.log(`Patient data cached for key: ${cacheKey} with TTL: ${cacheTtl}ms`);
      }

      return patient;
    } finally {
      if (connection) {
        try {
          await connection.end();
        } catch (closeError) {
          console.warn('⚠️ Error closing Khanza connection:', closeError);
        }
      }
    }
  } catch (error) {
    console.error('[KHANZA ERROR]', error instanceof Error ? error.message : error);
    throw new Error(`Khanza DB Error: ${error instanceof Error ? error.message : String(error)}`);
  }
}


// Fungsi untuk mencari pasien di database SIMRS Khanza berdasarkan nomor rekam medis
export async function findPatientByMedicalRecordNumberInKhanza(mrn: string): Promise<any | null> {
  try {
    const cacheKey = createCacheKey('findPatientByMedicalRecordNumberInKhanza', { mrn });

    if (KHANZA_CONFIG.features.enableCache && khanzaCache.get(cacheKey)) {
      console.log(`Cache hit for key: ${cacheKey}`);
      return khanzaCache.get(cacheKey);
    }

    let connection: PoolConnection | null = null;
    try {
      console.log(`Mencari pasien dengan nomor rekam medis: ${mrn}`);
      connection = await createKhanzaDbConnection();

      // Query untuk mencari pasien berdasarkan nomor rekam medis
      const query = `
        SELECT
          no_rkm_medis as patient_id,
          nm_pasien as patient_name,
          jk as gender,
          DATE_FORMAT(tgl_lahir, '%Y-%m-%d') as birth_date,
          almt as address,
          tgl_daftar as registration_date
        FROM pasien
        WHERE no_rkm_medis = ?
        LIMIT 1
      `;

      const [results] = await connection.execute(query, [mrn]);

      const patient = Array.isArray(results) && results.length > 0 ? results[0] : null;

      if (KHANZA_CONFIG.features.enableCache) {
        const cacheTtl = 3600000; // 1 jam
        khanzaCache.set(cacheKey, patient, cacheTtl);
        console.log(`Patient data cached for key: ${cacheKey} with TTL: ${cacheTtl}ms`);
      }

      return patient;
    } finally {
      if (connection) {
        try {
          await connection.end();
        } catch (closeError) {
          console.warn('⚠️ Error closing Khanza connection:', closeError);
        }
      }
    }
  } catch (error) {
    console.error('[KHANZA ERROR]', error instanceof Error ? error.message : error);
    throw new Error(`Khanza DB Error: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// Fungsi tambahan untuk kebutuhan dashboard dan lainnya

// Fungsi untuk mengambil data jadwal dokter dari SIMRS Khanza
export async function getDoctorSchedulesFromKhanza(doctorCode?: string, date?: string): Promise<any[]> {
  const cacheKey = createCacheKey('doctorSchedules', { doctorCode, date });
  const cached = await khanzaCache.get(cacheKey);
  if (cached) {
    console.log('📅 Mengambil data jadwal dokter dari cache');
    return cached as any[];
  }

  let connection: PoolConnection | null = null;
  try {
    // Gunakan koneksi langsung ke database SIMRS Khanza
    connection = await createKhanzaDbConnection();

    let query = '';
    const params: any[] = [];

    if (doctorCode && date) {
      query = 'SELECT * FROM jadwal WHERE kd_dokter = ? AND tanggal = ? LIMIT 100';
      params.push(doctorCode, date);
    } else if (doctorCode) {
      query = 'SELECT * FROM jadwal WHERE kd_dokter = ? LIMIT 100';
      params.push(doctorCode);
    } else if (date) {
      query = 'SELECT * FROM jadwal WHERE tanggal = ? LIMIT 100';
      params.push(date);
    } else {
      query = 'SELECT * FROM jadwal LIMIT 100';
    }

    const [rows] = await connection.execute(query, params);

    // Konversi data ke format yang diharapkan
    const schedules = Array.isArray(rows) ? rows as any[] : [];

    await khanzaCache.set(cacheKey, schedules, 300000); // 5 menit cache
    return schedules;
  } catch (error) {
    console.error('Error fetching doctor schedules from Khanza:', error);
    throw new Error(`Error fetching doctor schedules: ${error instanceof Error ? error.message : String(error)}`);
  } finally {
    if (connection) {
      try {
        await connection.release();
      } catch (closeError) {
        console.warn('⚠️ Error releasing Khanza connection:', closeError);
      }
    }
  }
}

// Fungsi untuk mengambil daftar dokter aktif dari SIMRS Khanza
export async function getActiveDoctorsFromKhanza(): Promise<any[]> {
  const cacheKey = createCacheKey('activeDoctors', {});
  const cached = await khanzaCache.get(cacheKey);
  if (cached) {
    console.log('👤 Mengambil data dokter aktif dari cache');
    return cached as any[];
  }

  let connection: PoolConnection | null = null;
  try {
    // Gunakan koneksi langsung ke database SIMRS Khanza
    connection = await createKhanzaDbConnection();

    // Query untuk mengambil data dokter aktif
    const query = `
      SELECT dokter.kd_dokter, dokter.nm_dokter, poliklinik.nm_poli
      FROM dokter
      LEFT JOIN poliklinik ON dokter.kd_poli = poliklinik.kd_poli
      WHERE dokter.status = '1'
      ORDER BY dokter.nm_dokter
    `;
    const [rows] = await connection.execute(query);

    // Konversi data ke format yang diharapkan
    const doctors = Array.isArray(rows) ? rows as any[] : [];

    await khanzaCache.set(cacheKey, doctors, 300000); // 5 menit cache
    return doctors;
  } catch (error) {
    console.error('Error fetching active doctors from Khanza:', error);
    throw new Error(`Error fetching active doctors: ${error instanceof Error ? error.message : String(error)}`);
  } finally {
    if (connection) {
      try {
        await connection.release();
      } catch (closeError) {
        console.warn('⚠️ Error releasing Khanza connection:', closeError);
      }
    }
  }
}

// Fungsi untuk mengambil data kunjungan pasien dari SIMRS Khanza
export async function getVisitDataFromKhanza(startDate?: string, endDate?: string): Promise<any[]> {
  const cacheKey = createCacheKey('visitData', { startDate, endDate });
  const cached = await khanzaCache.get(cacheKey);
  if (cached) {
    console.log('🏥 Mengambil data kunjungan dari cache');
    return cached as any[];
  }

  let connection: PoolConnection | null = null;
  try {
    // Gunakan koneksi langsung ke database SIMRS Khanza
    connection = await createKhanzaDbConnection();

    let query = `
      SELECT
        reg_periksa.no_reg,
        reg_periksa.no_rawat,
        reg_periksa.tgl_registrasi,
        reg_periksa.jam_reg,
        reg_periksa.no_rkm_medis,
        pasien.nm_pasien,
        dokter.nm_dokter,
        poliklinik.nm_poli,
        penjab.png_jawab
      FROM reg_periksa
      LEFT JOIN pasien ON reg_periksa.no_rkm_medis = pasien.no_rkm_medis
      LEFT JOIN dokter ON reg_periksa.kd_dokter = dokter.kd_dokter
      LEFT JOIN poliklinik ON reg_periksa.kd_poli = poliklinik.kd_poli
      LEFT JOIN penjab ON reg_periksa.kd_pj = penjab.kd_pj
    `;

    const params: any[] = [];

    // Tambahkan filter tanggal jika disediakan
    if (startDate && endDate) {
      query += ' WHERE reg_periksa.tgl_registrasi BETWEEN ? AND ?';
      params.push(startDate, endDate);
    } else if (startDate) {
      query += ' WHERE reg_periksa.tgl_registrasi >= ?';
      params.push(startDate);
    } else if (endDate) {
      query += ' WHERE reg_periksa.tgl_registrasi <= ?';
      params.push(endDate);
    }

    query += ' ORDER BY reg_periksa.tgl_registrasi DESC LIMIT 1000';

    const [rows] = await connection.execute(query, params);

    // Konversi data ke format yang diharapkan
    const visits = Array.isArray(rows) ? rows as any[] : [];

    await khanzaCache.set(cacheKey, visits, 300000); // 5 menit cache
    return visits;
  } catch (error) {
    console.error('Error fetching visit data from Khanza:', error);
    throw new Error(`Error fetching visit data: ${error instanceof Error ? error.message : String(error)}`);
  } finally {
    if (connection) {
      try {
        await connection.release();
      } catch (closeError) {
        console.warn('⚠️ Error releasing Khanza connection:', closeError);
      }
    }
  }
}

// Fungsi untuk mengambil data kunjungan radiologi dari SIMRS Khanza
export async function getRadiologyVisitsFromKhanza(startDate?: string, endDate?: string): Promise<any[]> {
  const cacheKey = createCacheKey('radiologyVisits', { startDate, endDate });
  const cached = await khanzaCache.get(cacheKey);
  if (cached) {
    console.log('📷 Mengambil data kunjungan radiologi dari cache');
    return cached as any[];
  }

  let connection: PoolConnection | null = null;
  try {
    // Gunakan koneksi langsung ke database SIMRS Khanza
    connection = await createKhanzaDbConnection();

    let query = `
      SELECT
        periksa_radiologi.no_rawat,
        reg_periksa.tgl_registrasi,
        reg_periksa.jam_reg,
        reg_periksa.no_rkm_medis,
        pasien.nm_pasien,
        dokter.nm_dokter,
        penjab.png_jawab,
        periksa_radiologi.biaya
      FROM periksa_radiologi
      LEFT JOIN reg_periksa ON periksa_radiologi.no_rawat = reg_periksa.no_rawat
      LEFT JOIN pasien ON reg_periksa.no_rkm_medis = pasien.no_rkm_medis
      LEFT JOIN dokter ON reg_periksa.kd_dokter = dokter.kd_dokter
      LEFT JOIN penjab ON reg_periksa.kd_pj = penjab.kd_pj
    `;

    const params: any[] = [];

    // Tambahkan filter tanggal jika disediakan
    if (startDate && endDate) {
      query += ' WHERE reg_periksa.tgl_registrasi BETWEEN ? AND ?';
      params.push(startDate, endDate);
    } else if (startDate) {
      query += ' WHERE reg_periksa.tgl_registrasi >= ?';
      params.push(startDate);
    } else if (endDate) {
      query += ' WHERE reg_periksa.tgl_registrasi <= ?';
      params.push(endDate);
    }

    query += ' ORDER BY reg_periksa.tgl_registrasi DESC LIMIT 1000';

    const [rows] = await connection.execute(query, params);

    // Konversi data ke format yang diharapkan
    const radiologyVisits = Array.isArray(rows) ? rows as any[] : [];

    await khanzaCache.set(cacheKey, radiologyVisits, 300000); // 5 menit cache
    return radiologyVisits;
  } catch (error) {
    console.error('Error fetching radiology visit data from Khanza:', error);
    throw new Error(`Error fetching radiology visit data: ${error instanceof Error ? error.message : String(error)}`);
  } finally {
    if (connection) {
      try {
        await connection.release();
      } catch (closeError) {
        console.warn('⚠️ Error releasing Khanza connection:', closeError);
      }
    }
  }
}

// Fungsi untuk mengambil data kunjungan laboratorium dari SIMRS Khanza
export async function getLabVisitsFromKhanza(startDate?: string, endDate?: string): Promise<any[]> {
  const cacheKey = createCacheKey('labVisits', { startDate, endDate });
  const cached = await khanzaCache.get(cacheKey);
  if (cached) {
    console.log('🧪 Mengambil data kunjungan laboratorium dari cache');
    return cached as any[];
  }

  let connection: PoolConnection | null = null;
  try {
    // Gunakan koneksi langsung ke database SIMRS Khanza
    connection = await createKhanzaDbConnection();

    let query = `
      SELECT
        periksa_lab.no_rawat,
        reg_periksa.tgl_registrasi,
        reg_periksa.jam_reg,
        reg_periksa.no_rkm_medis,
        pasien.nm_pasien,
        dokter.nm_dokter,
        penjab.png_jawab,
        periksa_lab.biaya
      FROM periksa_lab
      LEFT JOIN reg_periksa ON periksa_lab.no_rawat = reg_periksa.no_rawat
      LEFT JOIN pasien ON reg_periksa.no_rkm_medis = pasien.no_rkm_medis
      LEFT JOIN dokter ON reg_periksa.kd_dokter = dokter.kd_dokter
      LEFT JOIN penjab ON reg_periksa.kd_pj = penjab.kd_pj
    `;

    const params: any[] = [];

    // Tambahkan filter tanggal jika disediakan
    if (startDate && endDate) {
      query += ' WHERE reg_periksa.tgl_registrasi BETWEEN ? AND ?';
      params.push(startDate, endDate);
    } else if (startDate) {
      query += ' WHERE reg_periksa.tgl_registrasi >= ?';
      params.push(startDate);
    } else if (endDate) {
      query += ' WHERE reg_periksa.tgl_registrasi <= ?';
      params.push(endDate);
    }

    query += ' ORDER BY reg_periksa.tgl_registrasi DESC LIMIT 1000';

    const [rows] = await connection.execute(query, params);

    // Konversi data ke format yang diharapkan
    const labVisits = Array.isArray(rows) ? rows as any[] : [];

    await khanzaCache.set(cacheKey, labVisits, 300000); // 5 menit cache
    return labVisits;
  } catch (error) {
    console.error('Error fetching lab visit data from Khanza:', error);
    throw new Error(`Error fetching lab visit data: ${error instanceof Error ? error.message : String(error)}`);
  } finally {
    if (connection) {
      try {
        await connection.release();
      } catch (closeError) {
        console.warn('⚠️ Error releasing Khanza connection:', closeError);
      }
    }
  }
}

// Fungsi untuk mengambil data inventaris obat dari SIMRS Khanza
export async function getInventoryDataFromKhanza(): Promise<any[]> {
  const cacheKey = createCacheKey('inventoryData', {});
  const cached = await khanzaCache.get(cacheKey);
  if (cached) {
    console.log('📦 Mengambil data inventaris dari cache');
    return cached as any[];
  }

  let connection: PoolConnection | null = null;
  try {
    // Gunakan koneksi langsung ke database SIMRS Khanza
    connection = await createKhanzaDbConnection();

    // Query untuk mengambil data inventaris obat
    const query = `
      SELECT
        databarang.kode_brng,
        databarang.nama_brng,
        databarang.h_beli,
        databarang.h_jual,
        stocks.stok
      FROM databarang
      LEFT JOIN stocks ON databarang.kode_brng = stocks.kode_brng
      WHERE databarang.jenis = 'OB'  -- Hanya obat-obatan
      ORDER BY databarang.nama_brng
      LIMIT 1000
    `;
    const [rows] = await connection.execute(query);

    // Konversi data ke format yang diharapkan
    const inventory = Array.isArray(rows) ? rows as any[] : [];

    await khanzaCache.set(cacheKey, inventory, 300000); // 5 menit cache
    return inventory;
  } catch (error) {
    console.error('Error fetching inventory data from Khanza:', error);
    throw new Error(`Error fetching inventory data: ${error instanceof Error ? error.message : String(error)}`);
  } finally {
    if (connection) {
      try {
        await connection.release();
      } catch (closeError) {
        console.warn('⚠️ Error releasing Khanza connection:', closeError);
      }
    }
  }
}

// Fungsi untuk mengambil jadwal dokter berdasarkan ID layanan/poli dari SIMRS Khanza
export async function getScheduleByServiceId(serviceId: string): Promise<any[]> {
  const cacheKey = createCacheKey('scheduleByServiceId', { serviceId });
  const cached = await khanzaCache.get(cacheKey);
  if (cached) {
    console.log('📅 Mengambil jadwal dokter berdasarkan layanan dari cache');
    return cached as any[];
  }

  let connection: PoolConnection | null = null;
  try {
    // Gunakan koneksi langsung ke database SIMRS Khanza
    connection = await createKhanzaDbConnection();

    // Cek apakah serviceId adalah kode poli valid (umumnya pendek, bukan UUID)
    // Jika serviceId adalah UUID (panjang dengan tanda hubung), kita asumsikan bukan kode SIMRS
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(serviceId);

    if (isUUID) {
      console.warn('serviceId adalah UUID, bukan kode poliklinik SIMRS. Mengembalikan array kosong.');
      return [];
    }

    // Cek nama tabel pendaftaran yang benar-benar ada di database
    let tableName = '';
    const possibleTableNames = ['daftar_poli', 'reg_periksa'];

    for (const name of possibleTableNames) {
      const [tableCheck] = await connection.execute(`
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = ?
        AND table_name = ?
      `, [KHANZA_CONFIG.db.database, name]);

      if (Array.isArray(tableCheck) && tableCheck.length > 0) {
        tableName = name;
        break;
      }
    }

    let query = '';
    const queryParams: any[] = [serviceId];

    if (tableName) {
      // Jika tabel pendaftaran ditemukan, gunakan query lengkap
      query = `
        SELECT
          jadwal.kd_dokter,
          dokter.nm_dokter,
          jadwal.kd_poli,
          poliklinik.nm_poli,
          jadwal.hari_kerja,
          jadwal.jam_mulai,
          jadwal.jam_selesai,
          jadwal.kuota,
          COUNT(${tableName}.no_reg) as jumlah_pasien_terdaftar
        FROM jadwal
        LEFT JOIN dokter ON jadwal.kd_dokter = dokter.kd_dokter
        LEFT JOIN poliklinik ON jadwal.kd_poli = poliklinik.kd_poli
        LEFT JOIN ${tableName} ON jadwal.kd_dokter = ${tableName}.kd_dokter
          AND jadwal.kd_poli = ${tableName}.kd_poli
          AND ${tableName}.tgl_registrasi = CURDATE()
          AND ${tableName}.stts != 'Batal'
        WHERE jadwal.kd_poli = ?
          AND jadwal.status = '1'  -- Jadwal aktif
        GROUP BY jadwal.kd_dokter, jadwal.kd_poli, jadwal.hari_kerja
        ORDER BY jadwal.hari_kerja, jadwal.jam_mulai
      `;
    } else {
      // Jika tabel pendaftaran tidak ditemukan, gunakan query sederhana
      query = `
        SELECT
          jadwal.kd_dokter,
          dokter.nm_dokter,
          jadwal.kd_poli,
          poliklinik.nm_poli,
          jadwal.hari_kerja,
          jadwal.jam_mulai,
          jadwal.jam_selesai,
          jadwal.kuota,
          0 as jumlah_pasien_terdaftar  -- Set ke 0 karena tabel tidak ada
        FROM jadwal
        LEFT JOIN dokter ON jadwal.kd_dokter = dokter.kd_dokter
        LEFT JOIN poliklinik ON jadwal.kd_poli = poliklinik.kd_poli
        WHERE jadwal.kd_poli = ?
          AND jadwal.status = '1'  -- Jadwal aktif
        ORDER BY jadwal.hari_kerja, jadwal.jam_mulai
      `;
    }

    const [rows] = await connection.execute(query, queryParams);

    // Konversi data ke format yang diharapkan
    const schedules = Array.isArray(rows) ? rows.map((row: any) => ({
      id: `${row.kd_dokter}-${row.kd_poli}-${row.hari_kerja}`, // Buat ID unik
      doctor_id: row.kd_dokter,
      doctor_name: row.nm_dokter,
      clinic_id: row.kd_poli,
      clinic_name: row.nm_poli,
      day: row.hari_kerja,
      start_time: row.jam_mulai,
      end_time: row.jam_selesai,
      max_patients: row.kuota || 0,
      available_slots: Math.max(0, (row.kuota || 0) - (row.jumlah_pasien_terdaftar || 0)),
      current_patients: row.jumlah_pasien_terdaftar || 0
    })) : [];

    await khanzaCache.set(cacheKey, schedules, 300000); // 5 menit cache
    return schedules;
  } catch (error) {
    console.error('Error fetching schedule by service ID from Khanza:', error);
    // Jika ada error karena struktur tabel tidak cocok, kembalikan array kosong
    if (error instanceof Error && ['ER_NO_SUCH_TABLE', 'ER_BAD_TABLE_ERROR'].includes((error as any).code)) {
      console.warn('Tabel tidak ditemukan di database SIMRS, mengembalikan array kosong');
      return [];
    }
    // Jika error karena kolom tidak ditemukan, kembalikan array kosong
    if (error instanceof Error && ['ER_BAD_FIELD_ERROR', 'ER_NO_SUCH_FIELD'].includes((error as any).code)) {
      console.warn('Kolom tidak ditemukan di tabel SIMRS, mengembalikan array kosong');
      return [];
    }
    throw new Error(`Error fetching schedule by service ID: ${error instanceof Error ? error.message : String(error)}`);
  } finally {
    if (connection) {
      try {
        await connection.release();
      } catch (closeError) {
        console.warn('⚠️ Error releasing Khanza connection:', closeError);
      }
    }
  }
}

// Fungsi untuk menambahkan pasien ke SIMRS Khanza
export async function addPatientToKhanza(patientData: any): Promise<any> {
  let connection: PoolConnection | null = null;
  try {
    // Gunakan koneksi langsung ke database SIMRS Khanza
    connection = await createKhanzaDbConnection();

    // Validasi data pasien
    if (!patientData.no_rkm_medis || !patientData.nm_pasien) {
      throw new Error('Nomor rekam medis dan nama pasien wajib diisi');
    }

    // Query untuk menambahkan pasien ke database
    const query = `
      INSERT INTO pasien (
        no_rkm_medis, nm_pasien, no_ktp, jk, tmp_lahir, tgl_lahir,
        alamat, gol_darah, agama, stts_nikah, pekerjaan, no_tlp,
        tgl_daftar, umur, pnd, keluarga, namakeluarga
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      patientData.no_rkm_medis,
      patientData.nm_pasien,
      patientData.no_ktp || '',
      patientData.jk || '',
      patientData.tmp_lahir || '',
      patientData.tgl_lahir || '0000-00-00',
      patientData.alamat || '',
      patientData.gol_darah || 'Tidak Tau',
      patientData.agama || 0,
      patientData.stts_nikah || '',
      patientData.pekerjaan || '-',
      patientData.no_tlp || '',
      patientData.tgl_daftar || new Date().toISOString().split('T')[0],
      patientData.umur || '0',
      patientData.pnd || '-',
      patientData.keluarga || '',
      patientData.namakeluarga || ''
    ];

    const result = await connection.execute(query, params);
    const insertId = result[0] && typeof result[0] === 'object' && 'insertId' in result[0] ? (result[0] as any).insertId : null;

    // Ambil data pasien yang baru saja ditambahkan
    const newPatientQuery = 'SELECT * FROM pasien WHERE no_rkm_medis = ?';
    const [rows] = await connection.execute(newPatientQuery, [patientData.no_rkm_medis]);

    const newPatient = Array.isArray(rows) && rows.length > 0 ? rows[0] as any : null;

    // Hapus cache yang relevan
    await khanzaCache.delete(createCacheKey('patients', {}));

    return newPatient;
  } catch (error) {
    console.error('Error adding patient to Khanza:', error);
    throw new Error(`Error adding patient: ${error instanceof Error ? error.message : String(error)}`);
  } finally {
    if (connection) {
      try {
        await connection.release();
      } catch (closeError) {
        console.warn('⚠️ Error releasing Khanza connection:', closeError);
      }
    }
  }
}

// Fungsi untuk mendaftarkan pasien sebagai rawat jalan di SIMRS Khanza
export async function registerPatientToKhanzaOutpatient(registrationData: any): Promise<any> {
  let connection: PoolConnection | null = null;
  try {
    // Gunakan koneksi langsung ke database SIMRS Khanza
    connection = await createKhanzaDbConnection();

    // Validasi data registrasi
    if (!registrationData.no_rkm_medis) {
      throw new Error('Nomor rekam medis pasien wajib diisi');
    }
    if (!registrationData.kd_poli) {
      throw new Error('Kode poli wajib diisi');
    }
    if (!registrationData.kd_dokter) {
      throw new Error('Kode dokter wajib diisi');
    }

    // Ambil data pasien untuk validasi
    const patientQuery = 'SELECT * FROM pasien WHERE no_rkm_medis = ?';
    const [patientRows] = await connection.execute(patientQuery, [registrationData.no_rkm_medis]);
    const patient = Array.isArray(patientRows) && patientRows.length > 0 ? patientRows[0] as any : null;

    if (!patient) {
      throw new Error('Pasien tidak ditemukan');
    }

    // Generate nomor registrasi dan rawat
    const date = new Date().toISOString().split('T')[0];
    const time = new Date().toTimeString().split(' ')[0];
    const maxNoRegQuery = "SELECT MAX(no_reg) as max_no_reg FROM reg_periksa WHERE tgl_registrasi = ? AND kd_poli = ?";
    const [maxNoRegRows] = await connection.execute(maxNoRegQuery, [date, registrationData.kd_poli]);
    const maxNoReg = Array.isArray(maxNoRegRows) && maxNoRegRows.length > 0 ? (maxNoRegRows[0] as any).max_no_reg : 0;
    const newNoReg = String(Number(maxNoReg) + 1).padStart(3, '0');

    // Generate nomor rawat
    const maxNoRawatQuery = "SELECT MAX(CONVERT(SUBSTRING(no_rawat, 10), UNSIGNED)) as max_no_rawat FROM reg_periksa WHERE tgl_registrasi = ?";
    const [maxNoRawatRows] = await connection.execute(maxNoRawatQuery, [date]);
    const maxNoRawat = Array.isArray(maxNoRawatRows) && maxNoRawatRows.length > 0 ? (maxNoRawatRows[0] as any).max_no_rawat : 0;
    const newNoRawatNum = Number(maxNoRawat) + 1;
    const newNoRawat = `${date.split('-').join('')}.${String(newNoRawatNum).padStart(6, '0')}`;

    // Query untuk registrasi rawat jalan
    const query = `
      INSERT INTO reg_periksa (
        no_reg, no_rawat, tgl_registrasi, jam_reg, kd_dokter, no_rkm_medis,
        kd_poli, p_jawab, almt_pj, hubunganpj, biaya_reg, stts, stts_daftar,
        prioritas, kd_pj, departemen, no_antrian, tanggal_periksa, status_poli
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      newNoReg,
      newNoRawat,
      date,
      time,
      registrationData.kd_dokter,
      registrationData.no_rkm_medis,
      registrationData.kd_poli,
      registrationData.p_jawab || patient.nm_pasien,
      registrationData.almt_pj || patient.alamat,
      registrationData.hubunganpj || 'SAUDARA',
      registrationData.biaya_reg || 0,
      registrationData.stts || 'Belum',
      registrationData.stts_daftar || 'Lama',
      registrationData.prioritas || 0,
      registrationData.kd_pj || 'A01', // Default penanggung jawab
      registrationData.departemen || '',
      newNoReg,
      date,
      registrationData.status_poli || 'Lama'
    ];

    await connection.execute(query, params);

    // Ambil data registrasi yang baru dibuat
    const newRegistrationQuery = 'SELECT * FROM reg_periksa WHERE no_rawat = ?';
    const [rows] = await connection.execute(newRegistrationQuery, [newNoRawat]);

    const registration = Array.isArray(rows) && rows.length > 0 ? rows[0] as any : null;

    // Hapus cache yang relevan
    const cacheKey = createCacheKey('visitData', {});
    await khanzaCache.delete(cacheKey);

    return registration;
  } catch (error) {
    console.error('Error registering patient to Khanza outpatient:', error);
    throw new Error(`Error registering patient: ${error instanceof Error ? error.message : String(error)}`);
  } finally {
    if (connection) {
      try {
        await connection.release();
      } catch (closeError) {
        console.warn('⚠️ Error releasing Khanza connection:', closeError);
      }
    }
  }
}

// Fungsi untuk menyinkronkan data pasien dari SIMRS Khanza
export async function syncPatientDataFromKhanza(medicalRecordNumber: string): Promise<any> {
  const cacheKey = createCacheKey('patientSync', { medicalRecordNumber });
  const cached = await khanzaCache.get(cacheKey);
  if (cached) {
    console.log('🔄 Mengambil data pasien yang telah disinkronkan dari cache');
    return cached as any;
  }

  let connection: PoolConnection | null = null;
  try {
    // Gunakan koneksi langsung ke database SIMRS Khanza
    connection = await createKhanzaDbConnection();

    // Ambil data pasien
    const query = 'SELECT * FROM pasien WHERE no_rkm_medis = ?';
    const [rows] = await connection.execute(query, [medicalRecordNumber]);

    const patient = Array.isArray(rows) && rows.length > 0 ? rows[0] as any : null;

    if (patient) {
      // Ambil juga data registrasi terbaru pasien
      const regQuery = 'SELECT * FROM reg_periksa WHERE no_rkm_medis = ? ORDER BY tgl_registrasi DESC LIMIT 1';
      const [regRows] = await connection.execute(regQuery, [medicalRecordNumber]);

      if (Array.isArray(regRows) && regRows.length > 0) {
        patient.latest_registration = regRows[0];
      }

      await khanzaCache.set(cacheKey, patient, 300000); // 5 menit cache
      return patient;
    }

    return null;
  } catch (error) {
    console.error('Error syncing patient data from Khanza:', error);
    throw new Error(`Error syncing patient data: ${error instanceof Error ? error.message : String(error)}`);
  } finally {
    if (connection) {
      try {
        await connection.release();
      } catch (closeError) {
        console.warn('⚠️ Error releasing Khanza connection:', closeError);
      }
    }
  }
}