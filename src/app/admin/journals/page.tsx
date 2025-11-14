'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Search,
  FileText,
  Calendar,
  Plus,
  Download,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';

export default function JournalsPage() {
  const [journals, setJournals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Ambil data jurnal dari API
  useEffect(() => {
    const fetchJournals = async () => {
      try {
        setLoading(true);
        
        // Panggil API untuk mendapatkan data jurnal
        const response = await fetch('/api/khanza/journals');
        if (!response.ok) {
          throw new Error('Failed to fetch journal data');
        }
        
        const data = await response.json();
        setJournals(data);
      } catch (error) {
        console.error('Error fetching journal data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJournals();
  }, []);

  const filteredJournals = journals.filter(journal =>
    (journal.title && journal.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (journal.description && journal.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (journal.account_code && journal.account_code.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Kalkulasi statistik
  const totalJournals = journals.length;
  const totalDebit = journals.reduce((sum, journal) => sum + (journal.debit || 0), 0);
  const totalCredit = journals.reduce((sum, journal) => sum + (journal.credit || 0), 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">Manajemen Jurnal</CardTitle>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Ekspor
              </Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Jurnal Baru
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <FileText className="h-10 w-10 text-blue-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Jurnal</p>
                    <p className="text-2xl font-bold">{totalJournals}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <FileText className="h-10 w-10 text-green-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Debit</p>
                    <p className="text-2xl font-bold">Rp {totalDebit.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-red-50 border-red-200">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <FileText className="h-10 w-10 text-red-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Kredit</p>
                    <p className="text-2xl font-bold">Rp {totalCredit.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="relative w-96">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari jurnal (judul, deskripsi, kode akun)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <Input type="date" className="w-40" />
              <span>s/d</span>
              <Input type="date" className="w-40" />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tanggal</TableHead>
                <TableHead>Kode Akun</TableHead>
                <TableHead>Nama Akun</TableHead>
                <TableHead>Deskripsi</TableHead>
                <TableHead>Debit</TableHead>
                <TableHead>Kredit</TableHead>
                <TableHead>Ref</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">
                    Memuat data jurnal...
                  </TableCell>
                </TableRow>
              ) : filteredJournals.length > 0 ? (
                filteredJournals.map((journal, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{journal.date}</TableCell>
                    <TableCell className="font-mono">{journal.account_code}</TableCell>
                    <TableCell>{journal.account_name}</TableCell>
                    <TableCell>{journal.description}</TableCell>
                    <TableCell className="text-right text-green-600 font-bold">
                      {journal.debit > 0 ? `Rp ${journal.debit.toLocaleString()}` : '-'}
                    </TableCell>
                    <TableCell className="text-right text-red-600 font-bold">
                      {journal.credit > 0 ? `Rp ${journal.credit.toLocaleString()}` : '-'}
                    </TableCell>
                    <TableCell>{journal.reference}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">
                    Tidak ada data jurnal ditemukan
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}