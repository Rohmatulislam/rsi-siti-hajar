// src/lib/khanza-constants.ts

/**
 * Konstanta-konstanta untuk integrasi SIMRS Khanza
 * Mengandung definisi untuk berbagai kemungkinan nama kolom dan struktur tabel
 */

export const KHANZA_TABLE_MAPPINGS = {
  // Tabel detail pemberian obat
  detail_pemberian_obat: {
    columns: {
      kode_barang: ['kode_brng', 'kd_barang', 'id_barang'],
      jumlah: ['jml', 'jumlah', 'qty'],
      biaya_obat: ['biaya_obat', 'harga', 'h_jual'],
      no_rawat: ['no_rawat', 'nomor_rawat', 'id_rawat'],
      tgl_perawatan: ['tgl_perawatan', 'tanggal', 'tgl'],
      embalase: ['embalase', 'biaya_embalase'],
      tuslah: ['tuslah', 'biaya_tuslah']
    }
  },
  
  // Tabel databarang
  databarang: {
    columns: {
      kode_barang: ['kode_brng', 'kd_barang', 'id_barang'],
      nama_barang: ['nama_brng', 'nm_barang', 'nama'],
      harga_beli: ['harga_beli', 'h_beli', 'harga_pembelian'],
      ralan: ['ralan', 'harga_ralan', 'harga_jual_ralan'],
      ranap: ['ranap', 'harga_inap', 'harga_jual_inap']
    }
  },
  
  // Tabel penjualan
  penjualan: {
    columns: {
      nota_jual: ['nota_jual', 'no_nota', 'id_transaksi'],
      tgl_jual: ['tgl_jual', 'tanggal', 'tgl'],
      subtotal: ['subtotal', 'total', 'jumlah']
    }
  },
  
  // Tabel detailjual
  detailjual: {
    columns: {
      nota_jual: ['nota_jual', 'no_nota', 'id_transaksi'],
      kode_barang: ['kode_brng', 'kd_barang', 'id_barang'],
      jumlah_jual: ['jml_jual', 'jumlah', 'qty'],
      harga_jual: ['h_jual', 'harga', 'harga_jual'],
      subtotal: ['subtotal', 'total', 'jumlah']
    }
  },
  
  // Tabel jurnal
  jurnal: {
    columns: {
      kode_rekening: ['kd_rek', 'kode_rek', 'rek'],
      nama_rekening: ['nm_rek', 'nama_rek', 'nama_akun'],
      tanggal: ['tgl_jurnal', 'tanggal', 'tgl'],
      no_jurnal: ['no_jurnal', 'no_bukti', 'id_jurnal'],
      keterangan: ['keterangan', 'ket', 'deskripsi'],
      debet: ['debet', 'debit', 'penerimaan'],
      kredit: ['kredit', 'pengeluaran']
    }
  },
  
  // Tabel transaksi
  transaksi: {
    columns: {
      tanggal: ['tgl', 'tanggal', 'tgl_transaksi'],
      keterangan: ['keterangan', 'ket', 'deskripsi'],
      jenis: ['jenis', 'tipe', 'kategori'],
      jumlah: ['nominal', 'jumlah', 'nilai'],
      kode_rekening: ['kd_rek', 'kode_rek', 'rek'],
      nama_rekening: ['nm_rek', 'nama_rek', 'nama_akun'],
      no_bukti: ['no_bukti', 'no_transaksi', 'id_transaksi']
    }
  }
};

/**
 * Daftar kemungkinan nama kolom untuk tanggal
 */
export const DATE_COLUMN_NAMES = [
  'tgl', 'tanggal', 'tgl_jurnal', 'tgl_transaksi', 
  'tgl_jual', 'tgl_bayar', 'tgl_lunas', 'tgl_input',
  'tgl_perawatan', 'tgl_rekap', 'tgl_buku', 'tgl_laporan'
];

/**
 * Daftar kemungkinan nama kolom untuk keterangan
 */
export const DESCRIPTION_COLUMN_NAMES = [
  'keterangan', 'ket', 'deskripsi', 'catatan', 'note', 'judul'
];

/**
 * Daftar kemungkinan nama kolom untuk jumlah/nilai
 */
export const AMOUNT_COLUMN_NAMES = [
  'nominal', 'jumlah', 'nilai', 'total', 'subtotal', 
  'debet', 'debit', 'kredit', 'ttl_bayar', 'jumlah_bayar'
];

/**
 * Daftar kemungkinan nama kolom untuk kode
 */
export const CODE_COLUMN_NAMES = [
  'kd_rek', 'kode_rek', 'rek', 'kode_brng', 'kd_barang', 
  'no_jurnal', 'no_bukti', 'no_transaksi', 'kode_laporan'
];

/**
 * Mapping sumber transaksi
 */
export const TRANSACTION_SOURCE_MAPPING = {
  ralan: ['RALAN', 'rawat_jalan', 'outpatient', 'jalan'],
  ranap: ['RANAP', 'rawat_inap', 'inpatient', 'inap'],
  jual_bebas: ['jual_bebas', 'penjualan', 'jual', 'bebas']
};

/**
 * Query-query fallback yang umum digunakan
 */
export const FALLBACK_QUERIES = {
  drugRevenue: [
    // Query utama - detail_pemberian_obat dengan databarang
    `SELECT
      db.kode_brng as id,
      db.nama_brng as drug_name,
      SUM(dpo.jml) as quantity_sold,
      dpo.biaya_obat as unit_price,
      SUM((dpo.biaya_obat * dpo.jml) + COALESCE(dpo.embalase, 0) + COALESCE(dpo.tuslah, 0)) as total_revenue,
      db.harga_beli as cost_price,
      SUM(db.harga_beli * dpo.jml) as total_cost,
      SUM((dpo.biaya_obat * dpo.jml) + COALESCE(dpo.embalase, 0) + COALESCE(dpo.tuslah, 0)) - SUM(db.harga_beli * dpo.jml) as profit,
      CASE
        WHEN SUM(db.harga_beli * dpo.jml) > 0
        THEN ((SUM((dpo.biaya_obat * dpo.jml) + COALESCE(dpo.embalase, 0) + COALESCE(dpo.tuslah, 0)) - SUM(db.harga_beli * dpo.jml)) / SUM((dpo.biaya_obat * dpo.jml) + COALESCE(dpo.embalase, 0) + COALESCE(dpo.tuslah, 0))) * 100
        ELSE 0
      END as profit_margin,
      CASE
        WHEN dpo.no_rawat LIKE '%RALAN%' THEN 'ralan'
        WHEN dpo.no_rawat LIKE '%RANAP%' THEN 'ranap'
        ELSE 'ralan'
      END as transaction_source,
      dpo.no_rawat as patient_id,
      '' as prescription_id,
      dpo.tgl_perawatan as date,
      dpo.tgl_perawatan as created_at
    FROM detail_pemberian_obat dpo
    JOIN databarang db ON dpo.kode_brng = db.kode_brng
    WHERE 1=1
    GROUP BY db.kode_brng, db.nama_brng, dpo.biaya_obat, db.harga_beli, dpo.no_rawat, dpo.tgl_perawatan
    ORDER BY dpo.tgl_perawatan DESC
    LIMIT 100`,
    
    // Fallback - hanya detail_pemberian_obat
    `SELECT
      kode_brng as id,
      kode_brng as drug_name,
      jml as quantity_sold,
      biaya_obat as unit_price,
      (biaya_obat * jml) as total_revenue,
      0 as cost_price,
      0 as total_cost,
      0 as profit,
      0 as profit_margin,
      CASE
        WHEN no_rawat LIKE '%RALAN%' THEN 'ralan'
        WHEN no_rawat LIKE '%RANAP%' THEN 'ranap'
        ELSE 'ralan'
      END as transaction_source,
      no_rawat as patient_id,
      '' as prescription_id,
      tgl_perawatan as date,
      tgl_perawatan as created_at
    FROM detail_pemberian_obat
    ORDER BY tgl_perawatan DESC
    LIMIT 100`
  ]
};

/**
 * Konfigurasi default untuk caching
 */
export const DEFAULT_CACHE_CONFIG = {
  enabled: process.env.KHANZA_ENABLE_CACHE === 'true',
  duration: parseInt(process.env.KHANZA_CACHE_DURATION || '3600'), // detik
  prefix: 'khanza_'
};