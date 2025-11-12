import { createSupabaseServerClient } from './supabase-server';

// Interface untuk objek db yang mensimulasikan perilaku dari node-postgres (pg)
interface DbInterface {
  query: (text: string, params?: any[]) => Promise<any>;
}

// Fungsi untuk membuat wrapper Supabase yang mensimulasikan perilaku dari node-postgres (pg)
export const db: DbInterface = {
  query: async (text: string, params?: any[]) => {
    // Mendapatkan server client Supabase
    const supabase = await createSupabaseServerClient(true); // Gunakan service role untuk akses penuh
    
    // Parsing query SQL sederhana untuk menentukan operasi
    const lowerText = text.toLowerCase().trim();
    
    if (lowerText.startsWith('select')) {
      return handleSelectQuery(text, params, supabase);
    } else if (lowerText.startsWith('insert')) {
      return handleInsertQuery(text, params, supabase);
    } else if (lowerText.startsWith('update')) {
      return handleUpdateQuery(text, params, supabase);
    } else if (lowerText.startsWith('delete')) {
      return handleDeleteQuery(text, params, supabase);
    } else {
      throw new Error(`Unsupported query type for: ${text}`);
    }
  }
};

// Fungsi untuk menangani query SELECT
async function handleSelectQuery(text: string, params: any[] | undefined, supabase: any) {
  // Ekstrak nama tabel dari query
  const tableMatch = text.match(/from\s+(\w+)/i);
  if (!tableMatch) {
    throw new Error('Could not determine table from query');
  }
  
  const tableName = tableMatch[1];
  let query = supabase.from(tableName).select();
  
  // Ekstrak kondisi WHERE
  if (text.toLowerCase().includes('where')) {
    const whereClause = text.substring(text.toLowerCase().indexOf('where') + 5);
    query = parseWhereClause(query, whereClause, params);
  }
  
  const { data, error } = await query;
  
  if (error) {
    throw new Error(`Database query error: ${error.message}`);
  }
  
  return { rows: data || [], rowCount: data?.length || 0 };
}

// Fungsi untuk menangani query INSERT
async function handleInsertQuery(text: string, params: any[] | undefined, supabase: any) {
  // Ekstrak nama tabel dan kolom dari query
  const tableMatch = text.match(/insert into (\w+) \(([^)]+)\)/i);
  if (!tableMatch) {
    throw new Error('Could not determine table and columns from INSERT query');
  }
  
  const tableName = tableMatch[1];
  const columns = tableMatch[2].split(',').map(col => col.trim());
  
  // Ekstrak VALUES
  const valuesMatch = text.match(/values \(([^)]+)\)/i);
  if (!valuesMatch) {
    throw new Error('Could not determine values from INSERT query');
  }
  
  // Bangun objek data berdasarkan kolom dan parameter
  const data: any = {};
  columns.forEach((col, index) => {
    if (params && params[index] !== undefined) {
      data[col] = params[index];
    }
  });
  
  // Tambahkan kondisi RETURNING jika ada
  const returningMatch = text.match(/returning (.+)$/i);
  let query = supabase.from(tableName).insert(data);
  
  if (returningMatch) {
    // Jika ada RETURNING, kita perlu mengembalikan data yang disisipkan
    const { data: insertedData, error } = await query.select();
    if (error) {
      throw new Error(`Database insert error: ${error.message}`);
    }
    return { rows: insertedData, rowCount: insertedData?.length || 0 };
  } else {
    const { error } = await query;
    if (error) {
      throw new Error(`Database insert error: ${error.message}`);
    }
    return { rows: [], rowCount: 1 };
  }
}

// Fungsi untuk menangani query UPDATE
async function handleUpdateQuery(text: string, params: any[] | undefined, supabase: any) {
  // Ekstrak nama tabel dari query
  const tableMatch = text.match(/update (\w+) /i);
  if (!tableMatch) {
    throw new Error('Could not determine table from UPDATE query');
  }
  
  const tableName = tableMatch[1];
  
  // Ekstrak SET dan WHERE
  const setMatch = text.match(/set (.+?)( where |$)/i);
  if (!setMatch) {
    throw new Error('Could not determine SET clause from UPDATE query');
  }
  
  const setClause = setMatch[1];
  let query = supabase.from(tableName);
  
  // Parsing SET clause
  const setPairs = setClause.split(',').map(s => s.trim());
  const updateData: any = {};
  
  setPairs.forEach(setPair => {
    const [col, val] = setPair.split('=').map(s => s.trim());
    if (params) {
      // Jika nilai adalah placeholder seperti $1, $2, dll., gunakan nilai dari params
      const paramMatch = val.match(/\$(\d+)/);
      if (paramMatch) {
        const paramIndex = parseInt(paramMatch[1]) - 1;
        if (paramIndex >= 0 && paramIndex < params.length) {
          updateData[col] = params[paramIndex];
        }
      } else {
        // Jika bukan placeholder, gunakan nilai langsung (misalnya untuk konstanta)
        updateData[col] = val;
      }
    }
  });
  
  query = query.update(updateData);
  
  // Ekstrak dan terapkan kondisi WHERE
  if (text.toLowerCase().includes('where')) {
    const whereClause = text.substring(text.toLowerCase().indexOf('where') + 5);
    query = parseWhereClause(query, whereClause, params);
  }
  
  // Tambahkan kondisi RETURNING jika ada
  const returningMatch = text.match(/returning (.+)$/i);
  if (returningMatch) {
    query = query.select();
  }
  
  const { data, error } = await query;
  
  if (error) {
    throw new Error(`Database update error: ${error.message}`);
  }
  
  return { rows: data || [], rowCount: data?.length || 0 };
}

// Fungsi untuk menangani query DELETE
async function handleDeleteQuery(text: string, params: any[] | undefined, supabase: any) {
  // Ekstrak nama tabel dari query
  const tableMatch = text.match(/delete from (\w+)/i);
  if (!tableMatch) {
    throw new Error('Could not determine table from DELETE query');
  }
  
  const tableName = tableMatch[1];
  let query = supabase.from(tableName);
  
  // Ekstrak dan terapkan kondisi WHERE
  if (text.toLowerCase().includes('where')) {
    const whereClause = text.substring(text.toLowerCase().indexOf('where') + 5);
    query = parseWhereClause(query, whereClause, params);
  }
  
  // Tambahkan kondisi RETURNING jika ada
  const returningMatch = text.match(/returning (.+)$/i);
  if (returningMatch) {
    query = query.select();
  }
  
  const { data, error } = await query.delete();
  
  if (error) {
    throw new Error(`Database delete error: ${error.message}`);
  }
  
  return { rows: data || [], rowCount: data?.length || 0 };
}

// Fungsi helper untuk parsing WHERE clause
function parseWhereClause(query: any, whereClause: string, params: any[] | undefined) {
  // Parsing sederhana dari WHERE clause dengan placeholder $1, $2, dll.
  // Contoh: "nik = $1 AND is_active = $2" dengan params ['123456789', true]
  
  // Ganti placeholder dengan nilai sebenarnya
  let processedClause = whereClause.trim();
  
  if (params) {
    params.forEach((param, index) => {
      const placeholder = `$${index + 1}`;
      processedClause = processedClause.replace(new RegExp(placeholder, 'g'), param);
    });
  }
  
  // Parsing kondisi sederhana (hanya equality untuk sekarang)
  const conditions = processedClause.split(' AND ');
  conditions.forEach(condition => {
    condition = condition.trim();
    if (condition.includes('=')) {
      const [column, value] = condition.split('=').map(s => s.trim());
      // Hapus tanda kutip jika ada
      const cleanValue = value.replace(/['"]/g, '');
      query = query.eq(column, cleanValue);
    }
  });
  
  return query;
}