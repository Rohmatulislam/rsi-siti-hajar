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
  DollarSign,
  TrendingUp,
  TrendingDown,
  Plus,
  Download,
  Calendar
} from 'lucide-react';

export default function FinancePage() {
  const [financeData, setFinanceData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Ambil data keuangan dari API
  useEffect(() => {
    const fetchFinanceData = async () => {
      try {
        setLoading(true);
        
        // Panggil API untuk mendapatkan data keuangan
        const response = await fetch('/api/khanza/finance');
        if (!response.ok) {
          throw new Error('Failed to fetch financial data');
        }
        
        const data = await response.json();
        setFinanceData(data);
      } catch (error) {
        console.error('Error fetching financial data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFinanceData();
  }, []);

  const filteredData = financeData.filter(item =>
    (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item.category && item.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Kalkulasi total pendapatan dan pengeluaran
  const totalIncome = financeData.reduce((sum, item) => 
    item.type === 'income' ? sum + (item.amount || 0) : sum, 0
  );
  const totalExpenses = financeData.reduce((sum, item) => 
    item.type === 'expense' ? sum + (item.amount || 0) : sum, 0
  );
  const netProfit = totalIncome - totalExpenses;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">Manajemen Keuangan</CardTitle>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Ekspor
              </Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Transaksi Baru
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <DollarSign className="h-10 w-10 text-green-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Pendapatan</p>
                    <p className="text-xl font-bold">Rp {totalIncome.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-red-50 border-red-200">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <DollarSign className="h-10 w-10 text-red-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Pengeluaran</p>
                    <p className="text-xl font-bold">Rp {totalExpenses.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <DollarSign className="h-10 w-10 text-blue-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Laba Bersih</p>
                    <p className="text-xl font-bold">Rp {netProfit.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <TrendingUp className="h-10 w-10 text-purple-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Rata-rata Harian</p>
                    <p className="text-xl font-bold">Rp {(netProfit / 30).toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="relative w-96">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari transaksi keuangan..."
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
                <TableHead>Keterangan</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Tipe</TableHead>
                <TableHead>Jumlah</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    Memuat data keuangan...
                  </TableCell>
                </TableRow>
              ) : filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.date}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>
                      <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        {item.category}
                      </span>
                    </TableCell>
                    <TableCell>
                      {item.type === 'income' ? (
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded flex items-center">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Pendapatan
                        </span>
                      ) : (
                        <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded flex items-center">
                          <TrendingDown className="h-3 w-3 mr-1" />
                          Pengeluaran
                        </span>
                      )}
                    </TableCell>
                    <TableCell className={item.type === 'income' ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                      {item.type === 'income' ? '+' : '-'}Rp {item.amount?.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        Detail
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    Tidak ada data keuangan ditemukan
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