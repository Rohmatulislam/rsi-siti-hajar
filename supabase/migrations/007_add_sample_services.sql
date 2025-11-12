-- Menambahkan data layanan contoh termasuk layanan unggulan

-- Insert layanan unggulan
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
  ARRAY[
    'Laparoskopi',
    'Arthroscopy',
    'Uretroscopy',
    'Thoracoscopy'
  ],
  ARRAY[
    '{"patient_name": "Ahmad Fauzi", "rating": 5, "comment": "Pelayanan sangat baik dan profesional"}',
    '{"patient_name": "Siti Rahayu", "rating": 5, "comment": "Pemulihan cepat dan nyeri minimal"}'
  ]
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
  ARRAY[
    'Batu Ginjal',
    'Batu Ureter',
    'Batu Kandung Kemih'
  ],
  ARRAY[
    '{"patient_name": "Budi Santoso", "rating": 4, "comment": "Prosedur berjalan lancar"}',
    '{"patient_name": "Rina Kusuma", "rating": 5, "comment": "Sangat membantu tanpa operasi"}'
  ]
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
  ARRAY[
    'Persalinan Normal',
    'Persalinan Dengan Pendamping',
    'Perawatan Nifas'
  ],
  ARRAY[
    '{"patient_name": "Dewi Lestari", "rating": 5, "comment": "Pelayanan sangat menghormati prinsip syariah"}',
    '{"patient_name": "Agus Prasetyo", "rating": 5, "comment": "Keluarga suami bisa mendampingi"}'
  ]
);