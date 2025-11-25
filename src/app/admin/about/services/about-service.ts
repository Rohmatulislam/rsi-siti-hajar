import { createSupabaseServerClient } from '@/lib/supabase-server';
import { AboutContent, Founder } from '@/lib/admin-types';

// Service untuk manajemen pendiri rumah sakit
export const getFounders = async (): Promise<Founder[]> => {
  const supabase = await createSupabaseServerClient(true);
  
  const { data, error } = await supabase
    .from('founders')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data as Founder[];
};

export const getFounderById = async (id: string) => {
  const supabase = await createSupabaseServerClient(true);
  
  const { data, error } = await supabase
    .from('founders')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
};

export const createFounder = async (founder: Omit<Founder, 'id' | 'created_at'>) => {
  const supabase = await createSupabaseServerClient(true);
  
  const { data, error } = await supabase
    .from('founders')
    .insert([{
      name: founder.name,
      role: founder.role,
      description: founder.description,
      photo_url: founder.photo_url,
      created_at: new Date().toISOString()
    }])
    .select()
    .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
};

export const updateFounder = async (id: string, founder: Partial<Founder>) => {
  const supabase = await createSupabaseServerClient(true);
  
  const { data, error } = await supabase
    .from('founders')
    .update(founder)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
};

export const deleteFounder = async (id: string) => {
  const supabase = await createSupabaseServerClient(true);
  
  const { error } = await supabase
    .from('founders')
    .delete()
    .eq('id', id);
  
  if (error) {
    throw new Error(error.message);
  }
  
  return { success: true };
};

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

// Fungsi helper untuk mengonversi berbagai tipe data ke string
const convertToString = (data: any): string => {
  // Jika data adalah string mungkin berisi JSON
  if (typeof data === 'string') {
    try {
      // Coba parse sebagai JSON
      const parsed = JSON.parse(data);
      // Jika berhasil diparse, proses hasilnya
      if (Array.isArray(parsed)) {
        return parsed.map(item =>
          typeof item === 'string' ? item :
          typeof item === 'object' ?
            Object.values(item).filter(val => val !== null && val !== undefined).join(', ') :
            String(item)
        ).join(', ');
      } else if (typeof parsed === 'object' && parsed !== null) {
        return Object.values(parsed).filter(val => val !== null && val !== undefined).join(', ');
      } else {
        return String(parsed);
      }
    } catch (e) {
      // Jika bukan JSON valid, kembalikan sebagai string
      return data;
    }
  }
  // Jika data adalah array
  else if (Array.isArray(data)) {
    return data.map(item => {
      if (typeof item === 'string') {
        return item;
      } else if (typeof item === 'object' && item !== null) {
        if (Array.isArray(item)) {
          return convertToString(item);
        } else {
          return Object.values(item).filter(val => val !== null && val !== undefined).join(', ');
        }
      } else {
        return String(item);
      }
    }).join(', ');
  }
  // Jika data adalah object
  else if (typeof data === 'object' && data !== null) {
    // Cek apakah ini "[object Object]" hasil dari toString
    if (data.toString && data.toString() !== '[object Object]') {
      return data.toString();
    } else {
      // Ambil semua nilai dari object
      try {
        const values = Object.values(data).filter(val => val !== null && val !== undefined);
        return values.map(val =>
          typeof val === 'string' ? val :
          typeof val === 'object' ? JSON.stringify(Object.values(val)).replace(/[\[\]"]/g, '') :
          String(val)
        ).join(', ');
      } catch (e) {
        return JSON.stringify(data).replace(/[\[\]"]/g, '');
      }
    }
  }
  // Jika tipe data lain
  else {
    return String(data || '');
  }
};

// Service untuk manajemen konten tentang kami
export const getAboutContent = async () => {
  const supabase = await createSupabaseServerClient(true);

  const { data, error } = await supabase
    .from('about_content')
    .select('*')
    .single();

  if (error) {
    // Jika tidak ditemukan, buat default
    if (error.code === 'PGRST116') {
      return createDefaultAboutContent();
    }
    throw new Error(error.message);
  }

  // Konversi dari struktur database ke interface AboutContent
  const missionString = convertToString(data.misi);
  const valuesString = convertToString(data.values);

  const aboutContent: AboutContent = {
    id: data.id.toString(),
    title: 'Tentang RSI Siti Hajar',
    hero_title: 'Tentang RSI Siti Hajar',
    hero_description: 'Rumah Sakit Islam Siti Hajar Mataram, rumah sakit modern dengan pendekatan islami yang memberikan pelayanan kesehatan terbaik di Nusa Tenggara Barat',
    hero_image: data.image_url || null,
    history: data.history || '',
    vision: data.visi || '',
    mission: missionString,
    values: valuesString,
    commitment: data.commitment || '',
    achievements: [],
    team: [],
    founders: [],
    created_at: new Date().toISOString(),
    updated_at: data.updated_at
  };

  return aboutContent;
};

export const updateAboutContent = async (id: string, content: Partial<AboutContent>) => {
  const supabase = await createSupabaseServerClient(true);
  
  // Menyesuaikan dengan struktur database
  let misiValue: string[] | undefined;
  let valuesValue: string[] | undefined;
  
  if (content.mission) {
    // Jika mission adalah string yang dipisahkan koma, konversi ke array
    if (typeof content.mission === 'string') {
      misiValue = content.mission.split(',').map(item => item.trim());
    } else if (Array.isArray(content.mission)) {
      misiValue = content.mission;
    } else {
      misiValue = [content.mission.toString()];
    }
  }
  
  if (content.values) {
    // Jika values adalah string yang dipisahkan koma, konversi ke array
    if (typeof content.values === 'string') {
      valuesValue = content.values.split(',').map(item => item.trim());
    } else if (Array.isArray(content.values)) {
      valuesValue = content.values;
    } else {
      valuesValue = [content.values.toString()];
    }
  }
  
  const dbContent = {
    history: content.history,
    visi: content.vision,
    misi: misiValue,
    values: valuesValue,
    commitment: content.commitment,
    image_url: content.hero_image || content.image_url, // Gunakan hero_image jika tersedia, jika tidak gunakan image_url untuk kompatibilitas
    updated_at: new Date().toISOString()
  };
  
  const { data, error } = await supabase
    .from('about_content')
    .update(dbContent)
    .eq('id', id)
    .select();

  if (error) {
    throw new Error(error.message);
  }

  if (!data || data.length === 0) {
    throw new Error('No data returned from update operation');
  }

  // Ambil data pertama dari hasil update
  const updatedData = data[0];

  // Mengembalikan dalam format AboutContent
  const updatedMissionString = convertToString(updatedData.misi);
  const updatedValuesString = convertToString(updatedData.values);

  const updatedContent: AboutContent = {
    id: updatedData.id.toString(),
    title: 'Tentang RSI Siti Hajar',
    hero_title: 'Tentang RSI Siti Hajar',
    hero_description: 'Rumah Sakit Islam Siti Hajar Mataram, rumah sakit modern dengan pendekatan islami yang memberikan pelayanan kesehatan terbaik di Nusa Tenggara Barat',
    hero_image: updatedData.image_url || null,
    history: updatedData.history || '',
    vision: updatedData.visi || '',
    mission: updatedMissionString,
    values: updatedValuesString,
    commitment: updatedData.commitment || '',
    achievements: [],
    team: [],
    founders: [],
    created_at: new Date().toISOString(),
    updated_at: updatedData.updated_at
  };
  
  return updatedContent;
};

export const createDefaultAboutContent = async () => {
  const supabase = await createSupabaseServerClient(true);
  
  const defaultContent = {
    id: 1,
    history: 'RSI Siti Hajar Mataram didirikan pada tahun 2009 sebagai rumah sakit swasta yang mengintegrasikan nilai-nilai keislaman dalam pelayanan kesehatan. Sejak awal berdiri, kami berkomitmen untuk memberikan pelayanan kesehatan yang berkualitas dengan sentuhan spiritual dan profesionalisme tinggi.',
    visi: 'Menjadi rumah sakit islam terkemuka yang memberikan pelayanan kesehatan terbaik dengan pendekatan holistik berbasis teknologi dan nilai-nilai islami.',
    misi: ['Memberikan pelayanan kesehatan yang berkualitas', 'mengutamakan keselamatan pasien', 'mengintegrasikan nilai-nilai spiritual dalam proses penyembuhan'],
    values: ['keislaman', 'profesionalisme', 'keunggulan klinis', 'kepedulian terhadap sesama'],
    commitment: 'Menyediakan fasilitas kesehatan modern, tenaga medis terlatih, dan layanaan yang mudah diakses oleh masyarakat di seluruh NTB.',
    image_url: null,
    updated_at: new Date().toISOString()
  };
  
  const { data, error } = await supabase
    .from('about_content')
    .insert([defaultContent])
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  // Mengembalikan dalam format AboutContent
  const defaultMissionString = convertToString(data.misi);
  const defaultValuesString = convertToString(data.values);

  const aboutContent: AboutContent = {
    id: data.id.toString(),
    title: 'Tentang RSI Siti Hajar',
    hero_title: 'Tentang RSI Siti Hajar',
    hero_description: 'Rumah Sakit Islam Siti Hajar Mataram, rumah sakit modern dengan pendekatan islami yang memberikan pelayanan kesehatan terbaik di Nusa Tenggara Barat',
    hero_image: data.image_url || null,
    history: data.history || '',
    vision: data.visi || '',
    mission: defaultMissionString,
    values: defaultValuesString,
    commitment: data.commitment || '',
    achievements: [],
    team: [],
    founders: [],
    created_at: new Date().toISOString(),
    updated_at: data.updated_at
  };
  
  return aboutContent;
};