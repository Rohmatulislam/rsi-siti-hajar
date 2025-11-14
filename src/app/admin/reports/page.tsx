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
  Download,
  Calendar,
  Printer
} from 'lucide-react';

export default function ReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Ambil data laporan dari API
  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        
        // Panggil API untuk mendapatkan data laporan
        const response = await fetch('/api/khanza/reports');
        if (!response.ok) {
          throw new Error('Failed to fetch report data');
        }
        
        const data = await response.json();
        setReports(data);
      } catch (error) {
        console.error('Error fetching report data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const filteredReports = reports.filter(report =>
    (report.title && report.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (report.description && report.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">Manajemen Laporan</CardTitle>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Printer className="h-4 w-4 mr-2" />
                Cetak
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Ekspor
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="relative w-96">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari laporan..."
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <FileText className="h-10 w-10 text-blue-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Laporan Harian</p>
                    <p className="text-2xl font-bold">24</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <FileText className="h-10 w-10 text-green-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Laporan Mingguan</p>
                    <p className="text-2xl font-bold">8</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <FileText className="h-10 w-10 text-purple-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Laporan Bulanan</p>
                    <p className="text-2xl font-bold">2</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Judul Laporan</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Tipe</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    Memuat data laporan...
                  </TableCell>
                </TableRow>
              ) : filteredReports.length > 0 ? (
                filteredReports.map((report, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{report.title}</TableCell>
                    <TableCell>{report.date}</TableCell>
                    <TableCell>
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        {report.type}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        {report.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-2" />
                        Lihat
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    Tidak ada laporan ditemukan
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