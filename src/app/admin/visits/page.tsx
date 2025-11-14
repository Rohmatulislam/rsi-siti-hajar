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
  Users,
  Bed,
  Stethoscope,
  Calendar,
  Plus,
  Download
} from 'lucide-react';

export default function VisitsPage() {
  const [visits, setVisits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [visitType, setVisitType] = useState<'all' | 'outpatient' | 'inpatient'>('all');

  // Ambil data kunjungan dari API
  useEffect(() => {
    const fetchVisits = async () => {
      try {
        setLoading(true);
        
        // Panggil API untuk mendapatkan data kunjungan
        const response = await fetch('/api/khanza/visits');
        if (!response.ok) {
          throw new Error('Failed to fetch visit data');
        }
        
        const data = await response.json();
        setVisits(data);
      } catch (error) {
        console.error('Error fetching visit data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVisits();
  }, []);

  const filteredVisits = visits.filter(visit => {
    const matchesSearch = (visit.patient_name && visit.patient_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (visit.diagnosis && visit.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (visit.patient_id && visit.patient_id.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (visitType === 'all') return matchesSearch;
    if (visitType === 'outpatient') return matchesSearch && visit.visit_type === 'rawat_jalan';
    if (visitType === 'inpatient') return matchesSearch && visit.visit_type === 'rawat_inap';
    
    return matchesSearch;
  });

  // Kalkulasi statistik
  const outpatientVisits = visits.filter(v => v.visit_type === 'rawat_jalan').length;
  const inpatientVisits = visits.filter(v => v.visit_type === 'rawat_inap').length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">Manajemen Kunjungan</CardTitle>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Ekspor
              </Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Kunjungan Baru
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Users className="h-10 w-10 text-blue-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Kunjungan</p>
                    <p className="text-2xl font-bold">{visits.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Stethoscope className="h-10 w-10 text-green-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Rawat Jalan</p>
                    <p className="text-2xl font-bold">{outpatientVisits}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Bed className="h-10 w-10 text-purple-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Rawat Inap</p>
                    <p className="text-2xl font-bold">{inpatientVisits}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <Button 
              variant={visitType === 'all' ? 'default' : 'outline'} 
              onClick={() => setVisitType('all')}
            >
              Semua Kunjungan
            </Button>
            <Button 
              variant={visitType === 'outpatient' ? 'default' : 'outline'} 
              onClick={() => setVisitType('outpatient')}
            >
              Rawat Jalan
            </Button>
            <Button 
              variant={visitType === 'inpatient' ? 'default' : 'outline'} 
              onClick={() => setVisitType('inpatient')}
            >
              Rawat Inap
            </Button>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="relative w-96">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari kunjungan (nama pasien, ID, diagnosis)..."
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
                <TableHead>ID Kunjungan</TableHead>
                <TableHead>Nama Pasien</TableHead>
                <TableHead>Jenis Kunjungan</TableHead>
                <TableHead>Dokter</TableHead>
                <TableHead>Diagnosis</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    Memuat data kunjungan...
                  </TableCell>
                </TableRow>
              ) : filteredVisits.length > 0 ? (
                filteredVisits.map((visit, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-mono">{visit.visit_id}</TableCell>
                    <TableCell className="font-medium">{visit.patient_name}</TableCell>
                    <TableCell>
                      <span className={
                        visit.visit_type === 'rawat_jalan' 
                          ? 'bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded'
                          : 'bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded'
                      }>
                        {visit.visit_type === 'rawat_jalan' ? 'Rawat Jalan' : 'Rawat Inap'}
                      </span>
                    </TableCell>
                    <TableCell>{visit.doctor_name}</TableCell>
                    <TableCell>{visit.diagnosis}</TableCell>
                    <TableCell>{visit.visit_date}</TableCell>
                    <TableCell>
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        {visit.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    Tidak ada data kunjungan ditemukan
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