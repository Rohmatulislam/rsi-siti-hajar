import { createSupabaseServerClient } from '@/lib/supabase-server';
import { AboutContent, Founder } from '@/lib/admin-types';
import AboutPageClient from './page.client';

// Tipe data untuk struktur database
interface AboutContentDB {
  id: number;
  history?: string;
  visi?: string;
  misi?: string[] | string; // Bisa array atau string tergantung dari database
  values?: string[] | string; // Bisa array atau string tergantung dari database
  commitment?: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

// Fungsi untuk mengambil data tentang kami dari database
async function getAboutContent(): Promise<{ content: AboutContent; founders: Founder[] }> {
  // Gunakan service role untuk mengakses data, seperti di halaman admin
  const supabase = await createSupabaseServerClient(true);

  // Ambil data konten utama
  let contentData: any = null;

  try {
    // Ambil data tanpa field JSON untuk menghindari error PGRST301
    // Hanya ambil field yang benar-benar ada di tabel: id, history, visi, commitment, image_url, updated_at
    const { data, error } = await supabase
      .from('about_content')
      .select('id, history, visi, commitment, image_url, updated_at')
      .single();

    if (error) {
      console.error('Error fetching about content:', error);
      // Jika gagal, buat data default
      contentData = {
        id: 1,
        history: 'RSI Siti Hajar Mataram didirikan pada tahun 2009 sebagai rumah sakit swasta yang mengintegrasikan nilai-nilai keislaman dalam pelayanan kesehatan...',
        visi: 'Menjadi rumah sakit islam terkemuka yang memberikan pelayanan kesehatan terbaik dengan pendekatan holistik berbasis teknologi dan nilai-nilai islami.',
        commitment: 'Menyediakan fasilitas kesehatan modern, tenaga medis terlatih, dan layanaan yang mudah diakses oleh masyarakat di seluruh NTB.',
        image_url: null,
        updated_at: new Date().toISOString(),
        misi: 'Memberikan pelayanan kesehatan yang berkualitas, mengutamakan keselamatan pasien, dan mengintegrasikan nilai-nilai spiritual dalam proses penyembuhan.',
        values: 'Kami berpegang pada nilai-nilai keislaman, profesionalisme, keunggulan klinis, dan kepedulian terhadap sesama dalam setiap pelayanan kami.'
      };
    } else {
      contentData = data;
      
      // Coba ambil field JSON secara terpisah dengan menggunakan service role
      try {
        const { data: jsonFields } = await supabase
          .from('about_content')
          .select('misi, "values"')
          .single();
        
        if (jsonFields) {
          // Handle field misi
          if (jsonFields.misi) {
            if (Array.isArray(jsonFields.misi)) {
              // Jika array berisi objek dengan struktur {title, description}, ambil title atau description
              if (jsonFields.misi.length > 0 && typeof jsonFields.misi[0] === 'object' && jsonFields.misi[0] !== null) {
                contentData.misi = jsonFields.misi.map(item =>
                  typeof item === 'object' ? (item.title || item.description || JSON.stringify(item)) : item
                ).join(', ');
              } else {
                contentData.misi = jsonFields.misi.join(', ');
              }
            } else if (typeof jsonFields.misi === 'string') {
              contentData.misi = jsonFields.misi;
            } else {
              contentData.misi = 'Memberikan pelayanan kesehatan yang berkualitas, mengutamakan keselamatan pasien, dan mengintegrasikan nilai-nilai spiritual dalam proses penyembuhan.';
            }
          } else {
            contentData.misi = 'Memberikan pelayanan kesehatan yang berkualitas, mengutamakan keselamatan pasien, dan mengintegrasikan nilai-nilai spiritual dalam proses penyembuhan.';
          }

          // Handle field values
          if (jsonFields.values) {
            if (Array.isArray(jsonFields.values)) {
              // Jika array berisi objek dengan struktur {title, description}, ambil title atau description
              if (jsonFields.values.length > 0 && typeof jsonFields.values[0] === 'object' && jsonFields.values[0] !== null) {
                contentData.values = jsonFields.values.map(item =>
                  typeof item === 'object' ? (item.title || item.description || JSON.stringify(item)) : item
                ).join(', ');
              } else {
                contentData.values = jsonFields.values.join(', ');
              }
            } else if (typeof jsonFields.values === 'string') {
              contentData.values = jsonFields.values;
            } else {
              contentData.values = 'Kami berpegang pada nilai-nilai keislaman, profesionalisme, keunggulan klinis, dan kepedulian terhadap sesama dalam setiap pelayanan kami.';
            }
          } else {
            contentData.values = 'Kami berpegang pada nilai-nilai keislaman, profesionalisme, keunggulan klinis, dan kepedulian terhadap sesama dalam setiap pelayanan kami.';
          }
        }
      } catch (jsonError) {
        console.warn('Could not fetch JSON fields, using defaults:', jsonError);
        // Tetap gunakan nilai default jika ada error
        contentData.misi = 'Memberikan pelayanan kesehatan yang berkualitas, mengutamakan keselamatan pasien, dan mengintegrasikan nilai-nilai spiritual dalam proses penyembuhan.';
        contentData.values = 'Kami berpegang pada nilai-nilai keislaman, profesionalisme, keunggulan klinis, dan kepedulian terhadap sesama dalam setiap pelayanan kami.';
      }
    }
  } catch (error) {
    console.error('Unexpected error fetching about content:', error);
    // Jika error tak terduga, gunakan data default
    contentData = {
      id: 1,
      history: 'RSI Siti Hajar Mataram didirikan pada tahun 2009 sebagai rumah sakit swasta yang mengintegrasikan nilai-nilai keislaman dalam pelayanan kesehatan...',
      visi: 'Menjadi rumah sakit islam terkemuka yang memberikan pelayanan kesehatan terbaik dengan pendekatan holistik berbasis teknologi dan nilai-nilai islami.',
      commitment: 'Menyediakan fasilitas kesehatan modern, tenaga medis terlatih, dan layanaan yang mudah diakses oleh masyarakat di seluruh NTB.',
      image_url: null,
      updated_at: new Date().toISOString(),
      misi: 'Memberikan pelayanan kesehatan yang berkualitas, mengutamakan keselamatan pasien, dan mengintegrasikan nilai-nilai spiritual dalam proses penyembuhan.',
      values: 'Kami berpegang pada nilai-nilai keislaman, profesionalisme, keunggulan klinis, dan kepedulian terhadap sesama dalam setiap pelayanan kami.'
    };
  }

  // Ambil data pendiri
  let foundersData: any[] = [];

  try {
    const { data, error } = await supabase
      .from('founders')
      .select('id, name, role, photo_url, description, created_at, updated_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching founders:', error);
      foundersData = []; // Gunakan array kosong jika error
    } else {
      foundersData = data;
    }
  } catch (error) {
    console.error('Unexpected error fetching founders:', error);
    foundersData = [];
  }

  // Konversi dari struktur database ke interface AboutContent yang digunakan di client
  const aboutContent: AboutContent = {
    id: contentData?.id?.toString() || '1',
    title: 'Tentang RSI Siti Hajar',
    hero_title: 'Tentang RSI Siti Hajar',
    hero_description: 'Rumah Sakit Islam Siti Hajar Mataram, rumah sakit modern dengan pendekatan islami yang memberikan pelayanan kesehatan terbaik di Nusa Tenggara Barat',
    hero_image: contentData?.image_url || null,
    history: contentData?.history || 'RSI Siti Hajar Mataram didirikan pada tahun 2009 sebagai rumah sakit swasta yang mengintegrasikan nilai-nilai keislaman dalam pelayanan kesehatan...',
    vision: contentData?.visi || 'Menjadi rumah sakit islam terkemuka yang memberikan pelayanan kesehatan terbaik dengan pendekatan holistik berbasis teknologi dan nilai-nilai islami.',
    mission: contentData?.misi || 'Memberikan pelayanan kesehatan yang berkualitas, mengutamakan keselamatan pasien, dan mengintegrasikan nilai-nilai spiritual dalam proses penyembuhan.',
    values: contentData?.values || 'Kami berpegang pada nilai-nilai keislaman, profesionalisme, keunggulan klinis, dan kepedulian terhadap sesama dalam setiap pelayanan kami.',
    commitment: contentData?.commitment || 'Menyediakan fasilitas kesehatan modern, tenaga medis terlatih, dan layanaan yang mudah diakses oleh masyarakat di seluruh NTB.',
    achievements: [],
    team: [],
    founders: foundersData as Founder[], // Gunakan data founders yang diambil dari database
    created_at: new Date().toISOString(), // Gunakan waktu saat ini karena tidak ada di tabel
    updated_at: contentData?.updated_at || new Date().toISOString()
  };

  return {
    content: aboutContent,
    founders: foundersData as Founder[] || []
  };
}

export default async function AboutPage() {
  const { content, founders } = await getAboutContent();

  return <AboutPageClient content={content} founders={founders} />;
}