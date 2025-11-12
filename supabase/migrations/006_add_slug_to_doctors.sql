-- Migrasi untuk menambahkan kolom slug ke tabel doctors
-- Kolom ini akan digunakan untuk URL yang lebih ramah SEO

-- Tambahkan kolom slug ke tabel doctors
ALTER TABLE doctors ADD COLUMN slug TEXT UNIQUE;

-- Buat fungsi untuk menghasilkan slug dari nama
CREATE OR REPLACE FUNCTION generate_slug(input_text TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN LOWER(
    TRANSLATE(
      TRANSLATE(
        TRANSLATE(input_text, ' ', '-'),
        '''', ''
      ),
      '.,!?;:@#$%^&*()',
      ''
    )
  );
END;
$$ LANGUAGE plpgsql;

-- Isi kolom slug berdasarkan nama dokter
UPDATE doctors SET slug = generate_slug(name) WHERE slug IS NULL;

-- Hapus fungsi karena hanya digunakan untuk migrasi
-- DROP FUNCTION generate_slug(TEXT);