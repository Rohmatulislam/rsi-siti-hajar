-- Perintah SQL untuk menambahkan semua layanan berdasarkan .tech_spec_doc.md ke tabel services

-- Menambahkan layanan unggulan sesuai dokumen teknis
INSERT INTO public.services (id, category, title, description, image_url, contact_info, location, operating_hours, features, reviews) VALUES
(
  gen_random_uuid(),
  'unggulan',
  'Bedah Minimal Invasif',
  'Tindakan pembedahan dilakukan dengan sayatan sangat kecil menggunakan bantuan kamera endoskopik dan peralatan bedah khusus berteknologi tinggi',
  '/images/bener/baner-minimal-inpansif.jpg',
  '(0370) 123456',
  'Gedung C Lantai 3, Ruang Bedah',
  'Senin - Jumat: 08:00 - 16:00',
  ARRAY['Bedah saluran cerna', 'Bedah urologi', 'Bedah ortopedi dan traumatologi'],
  ARRAY['{"patient_name": "Ahmad Fauzi", "rating": 5, "comment": "Pemulihan cepat dan nyeri minimal"}', '{"patient_name": "Siti Rahayu", "rating": 5, "comment": "Sayatan kecil tapi hasil maksimal"}']
),
(
  gen_random_uuid(),
  'unggulan',
  'ESWL (Extracorporeal Shock Wave Lithotripsy)',
  'Solusi Non-Bedah untuk Menghancurkan Batu Ginjal menggunakan gelombang kejut berenergi tinggi',
  '/images/bener/baner.JPG',
  '(0370) 123457',
  'Gedung B Lantai 2',
  'Senin - Jumat: 07:00 - 17:00',
  ARRAY['Batu Ginjal', 'Batu Ureter', 'Batu Kandung Kemih'],
  ARRAY['{"patient_name": "Budi Santoso", "rating": 4, "comment": "Prosedur tanpa sayatan, pemulihan cepat"}', '{"patient_name": "Rina Kusuma", "rating": 5, "comment": "Sangat membantu tanpa operasi"}']
),
(
  gen_random_uuid(),
  'unggulan',
  'Persalinan Syarii',
  'Pelayanan kesehatan yang aman secara medis dan sesuai dengan nilai-nilai Islam',
  '/images/bener/baner-doctors.jpg',
  '(0370) 123458',
  'Gedung A Lantai 1',
  '24 Jam',
  ARRAY['Persalinan normal dan caesar syari', 'Pendampingan spiritual', 'Suami diperkenankan mendampingi'],
  ARRAY['{"patient_name": "Dewi Lestari", "rating": 5, "comment": "Pelayanan sangat menghormati prinsip syariah"}', '{"patient_name": "Agus Prasetyo", "rating": 5, "comment": "Keluarga suami bisa mendampingi"}']
),
(
  gen_random_uuid(),
  'unggulan',
  'Poliklinik Eksekutif',
  'Pelayanan rawat jalan khusus bagi pasien yang mengutamakan kenyamanan, waktu, dan pelayanan personal',
  '/images/bener/baner-minimal-inpansif.jpg',
  '(0370) 123459',
  'Gedung A Lantai 2',
  'Senin - Sabtu: 08:00 - 17:00',
  ARRAY['Anak', 'Penyakit Dalam', 'Ortopedi', 'Bedah Umum', 'Saraf', 'Kulit & Kelamin'],
  ARRAY['{"patient_name": "Rudi Hartono", "rating": 5, "comment": "Pelayanan eksklusif tanpa antre"}', '{"patient_name": "Tina Sari", "rating": 4, "comment": "Tenaga medis pilihan"}']
);

-- Menambahkan layanan kesehatan lainnya sesuai dokumen teknis
INSERT INTO public.services (id, category, title, description, image_url, contact_info, location, operating_hours, features, reviews) VALUES
(
  gen_random_uuid(),
  'kesehatan',
  'Rawat Inap',
  'Pengawasan medis menyeluruh oleh dokter spesialis dan perawat profesional selama 24 jam',
  '/images/bener/baner.JPG',
  '(0370) 123460',
  'Gedung C Lantai 1-4',
  '24 Jam',
  ARRAY['Kelas VIP dan VVIP', 'Kelas I, II, dan III', 'Ruang Isolasi', 'Ruang Bersalin'],
  ARRAY['{"patient_name": "Joko Widodo", "rating": 5, "comment": "Perawatan nyaman dan profesional"}', '{"patient_name": "Sri Mulyani", "rating": 4, "comment": "Pelayanan Islami yang menyentuh"}']
),
(
  gen_random_uuid(),
  'kesehatan',
  'Rawat Jalan',
  'Akses mudah, pelayanan cepat, dan dokter spesialis lengkap',
  '/images/bener/baner-doctors.jpg',
  '(0370) 123461',
  'Gedung A Lantai 1-3',
  'Senin - Sabtu: 07:00 - 16:00',
  ARRAY['Klinik Penyakit Dalam', 'Klinik Anak', 'Klinik Ortopedi', 'Klinik Bedah Umum'],
  ARRAY['{"patient_name": "Fajar Nugraha", "rating": 4, "comment": "Proses registrasi efisien"}', '{"patient_name": "Lina Kurnia", "rating": 5, "comment": "Dokter spesialis lengkap"}']
),
(
  gen_random_uuid(),
  'kesehatan',
  'Farmasi 24 Jam',
  'Pelayanan pemesanan dan penyerahan obat selama 24 jam',
  '/images/bener/baner-minimal-inpansif.jpg',
  '(0370) 123462',
  'Gedung A Lantai Dasar',
  '24 Jam',
  ARRAY['Pelayanan resep', 'Informasi obat', 'Konsultasi obat'],
  ARRAY['{"patient_name": "Eko Prasetyo", "rating": 4, "comment": "Buka 24 jam sangat membantu"}', '{"patient_name": "Dian Puspita", "rating": 5, "comment": "Apoteker profesional"}']
),
(
  gen_random_uuid(),
  'kesehatan',
  'Laboratorium',
  'Pelayanan pemeriksaan laboratorium darah, urine, dan berbagai tes medis lainnya',
  '/images/bener/baner.JPG',
  '(0370) 123463',
  'Gedung B Lantai 1',
  'Senin - Sabtu: 06:00 - 17:00',
  ARRAY['Hematologi', 'Kimia Klinik', 'Imunologi', 'Mikrobiologi'],
  ARRAY['{"patient_name": "Hendra Wijaya", "rating": 5, "comment": "Hasil cepat dan akurat"}', '{"patient_name": "Yuni Astuti", "rating": 4, "comment": "Pelayanan profesional"}']
),
(
  gen_random_uuid(),
  'kesehatan',
  'Radiologi',
  'Pelayanan pencitraan medis termasuk X-ray, USG, CT-Scan, dan MRI',
  '/images/bener/baner-doctors.jpg',
  '(0370) 123464',
  'Gedung B Lantai 3',
  'Senin - Sabtu: 07:00 - 16:00',
  ARRAY['X-Ray', 'USG', 'CT-Scan', 'MRI'],
  ARRAY['{"patient_name": "Andi Saputra", "rating": 5, "comment": "Alat canggih dan hasil tajam"}', '{"patient_name": "Mega Lestari", "rating": 4, "comment": "Petugas ahli dan ramah"}']
),
(
  gen_random_uuid(),
  'kesehatan',
  'Rehabilitasi Medik',
  'Memulihkan fungsi tubuh yang menurun akibat penyakit, cedera, atau kondisi pascaoperasi',
  '/images/bener/baner-minimal-inpansif.jpg',
  '(0370) 123465',
  'Gedung C Lantai 2',
  'Senin - Jumat: 08:00 - 15:00',
  ARRAY['Fisioterapi', 'Okupasi terapi', 'Terapi wicara', 'Rehabilitasi pascastroke'],
  ARRAY['{"patient_name": "Taufik Hidayat", "rating": 5, "comment": "Terapis sangat kompeten"}', '{"patient_name": "Ratna Sari", "rating": 4, "comment": "Proses pemulihan cepat"}']
),
(
  gen_random_uuid(),
  'kesehatan',
  'Medical Check Up (MCU)',
  'Deteksi dini untuk hidup sehat dan produktif',
  '/images/bener/baner.JPG',
  '(0370) 123466',
  'Gedung A Lantai 2',
  'Senin - Sabtu: 06:00 - 14:00',
  ARRAY['Deteksi Dini Penyakit Jantung', 'Deteksi Dini Diabetes', 'Skrining Pranikah', 'Deteksi Lengkap'],
  ARRAY['{"patient_name": "Bambang Susilo", "rating": 5, "comment": "Proses cepat dan nyaman"}', '{"patient_name": "Nurul Huda", "rating": 4, "comment": "Pemeriksaan menyeluruh"}']
);

-- Cek data yang telah dimasukkan
SELECT category, title FROM public.services ORDER BY category, title;