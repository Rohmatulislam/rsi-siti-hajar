-- Perintah SQL untuk menambahkan data layanan kesehatan ke tabel services

-- Menambahkan beberapa layanan unggulan
INSERT INTO public.services (id, category, title, description, image_url, contact_info, location, operating_hours, features, reviews) VALUES
(
  gen_random_uuid(),
  'unggulan',
  'Bedah Minimal Invasif',
  'Prosedur pembedahan dengan sayatan kecil untuk meminimalkan trauma dan mempercepat pemulihan',
  '/images/bener/baner-minimal-inpansif.jpg',
  '(0370) 123456',
  'Gedung C Lantai 3, Ruang Bedah',
  'Senin - Jumat: 08:00 - 16:00',
  ARRAY['Laparoskopi', 'Arthroscopy', 'Uretroscopy', 'Thoracoscopy'],
  ARRAY['{"patient_name": "Ahmad Fauzi", "rating": 5, "comment": "Pelayanan sangat baik dan profesional"}', '{"patient_name": "Siti Rahayu", "rating": 5, "comment": "Pemulihan cepat dan nyeri minimal"}']
),
(
  gen_random_uuid(),
  'unggulan',
  'ESWL (Extracorporeal Shock Wave Lithotripsy)',
  'Terapi non-bedah untuk menghancurkan batu ginjal dan batu saluran kemih menggunakan gelombang kejut',
  '/images/bener/baner.JPG',
  '(0370) 123457',
  'Gedung B Lantai 2',
  'Senin - Jumat: 07:00 - 17:00',
  ARRAY['Batu Ginjal', 'Batu Ureter', 'Batu Kandung Kemih'],
  ARRAY['{"patient_name": "Budi Santoso", "rating": 4, "comment": "Prosedur berjalan lancar"}', '{"patient_name": "Rina Kusuma", "rating": 5, "comment": "Sangat membantu tanpa operasi"}']
),
(
  gen_random_uuid(),
  'unggulan',
  'Persalinan Syarii',
  'Pelayanan persalinan yang menggabungkan aspek medis dan spiritual sesuai prinsip syariah',
  '/images/bener/baner-doctors.jpg',
  '(0370) 123458',
  'Gedung A Lantai 1',
  '24 Jam',
  ARRAY['Persalinan Normal', 'Persalinan Dengan Pendamping', 'Perawatan Nifas'],
  ARRAY['{"patient_name": "Dewi Lestari", "rating": 5, "comment": "Pelayanan sangat menghormati prinsip syariah"}', '{"patient_name": "Agus Prasetyo", "rating": 5, "comment": "Keluarga suami bisa mendampingi"}']
);

-- Menambahkan beberapa layanan kesehatan lainnya
INSERT INTO public.services (id, category, title, description, image_url, contact_info, location, operating_hours, features, reviews) VALUES
(
  gen_random_uuid(),
  'kesehatan',
  'Medical Check Up',
  'Pemeriksaan kesehatan menyeluruh untuk mendeteksi dini berbagai penyakit',
  '/images/bener/baner.JPG',
  '(0370) 123459',
  'Gedung A Lantai 2',
  'Senin - Sabtu: 07:00 - 15:00',
  ARRAY['Pemeriksaan Umum', 'Laboratorium', 'Radiologi', 'Konsultasi Spesialis'],
  ARRAY['{"patient_name": "Rudi Hartono", "rating": 5, "comment": "Pemeriksaan lengkap dengan hasil akurat"}', '{"patient_name": "Tina Sari", "rating": 4, "comment": "Petugas ramah dan profesional"}']
),
(
  gen_random_uuid(),
  'kesehatan',
  'Laboratorium',
  'Pelayanan pemeriksaan laboratorium darah, urine, dan berbagai tes medis lainnya',
  '/images/bener/baner-doctors.jpg',
  '(0370) 123460',
  'Gedung B Lantai 1',
  'Senin - Sabtu: 06:00 - 17:00',
  ARRAY['Hematologi', 'Kimia Klinik', 'Imunologi', 'Mikrobiologi'],
  ARRAY['{"patient_name": "Joko Widodo", "rating": 4, "comment": "Hasil cepat dan akurat"}', '{"patient_name": "Sri Mulyani", "rating": 5, "comment": "Pelayanan profesional dan terpercaya"}']
),
(
  gen_random_uuid(),
  'kesehatan',
  'Radiologi',
  'Pelayanan pencitraan medis termasuk X-ray, USG, CT-Scan, dan MRI',
  '/images/bener/baner-minimal-inpansif.jpg',
  '(0370) 123461',
  'Gedung B Lantai 3',
  'Senin - Sabtu: 07:00 - 16:00',
  ARRAY['X-Ray', 'USG', 'CT-Scan', 'MRI'],
  ARRAY['{"patient_name": "Fajar Nugraha", "rating": 5, "comment": "Alat canggih dan hasil tajam"}', '{"patient_name": "Lina Kurnia", "rating": 4, "comment": "Petugas ahli dan ramah"}']
),
(
  gen_random_uuid(),
  'kesehatan',
  'Fisioterapi',
  'Pelayanan rehabilitasi medis untuk mempercepat pemulihan fungsi tubuh',
  '/images/bener/baner.JPG',
  '(0370) 123462',
  'Gedung C Lantai 2',
  'Senin - Jumat: 08:00 - 15:00',
  ARRAY['Terapi Gerak', 'Elektroterapi', 'Manual Therapy', 'Latihan Fungsional'],
  ARRAY['{"patient_name": "Eko Prasetyo", "rating": 5, "comment": "Terapis sangat kompeten"}', '{"patient_name": "Dian Puspita", "rating": 4, "comment": "Proses pemulihan cepat"}']
);

-- Cek data yang telah dimasukkan
SELECT * FROM public.services WHERE category IN ('unggulan', 'kesehatan');