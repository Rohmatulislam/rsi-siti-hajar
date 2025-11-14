'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Search,
  Pill,
  DollarSign,
  TrendingUp,
  Calendar,
  Download
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';

// Interface data sesuai hasil backend Khanza
interface DrugRevenueItem {
  id: string;
  drug_name: string;
  quantity_sold: number;
  unit_price: number;
  total_revenue: number;
  cost_price: number;
  total_cost: number;
  profit: number;
  profit_margin: number;
  transaction_source: string;
  patient_id: string;
  prescription_id: string;
  date: string;
  created_at: string;
}

export default function DrugRevenuePage() {
  const [data, setData] = useState<DrugRevenueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [timeRange, setTimeRange] = useState<'daily' | 'monthly' | 'yearly'>('daily');

  // Fetch dari API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let url = '/api/khanza/drug-revenue';
        const params = new URLSearchParams();
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        if (params.toString()) url += `?${params.toString()}`;

        const res = await fetch(url);
        const json = await res.json();
        setData(json);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [startDate, endDate]);

  // Validasi tanggal berdasarkan rentang yang ditentukan
  const isValidDate = (dateStr: string): boolean => {
    try {
      const date = new Date(dateStr);
      // Periksa apakah tanggal valid
      if (isNaN(date.getTime())) {
        return false;
      }

      const now = new Date();
      // Memastikan tanggal tidak di masa depan dan tidak terlalu lama yang lalu
      let isInRange = date <= now && date >= new Date('1970-01-01');

      // Jika ada rentang tanggal yang ditentukan, tambahkan filter berdasarkan rentang itu
      if (startDate) {
        const start = new Date(startDate);
        isInRange = isInRange && date >= start;
      }

      if (endDate) {
        const end = new Date(endDate);
        isInRange = isInRange && date <= end;
      }

      return isInRange;
    } catch (e) {
      return false;
    }
  };

  // Filter pencarian dengan validasi tanggal
  const filtered = data.filter((item) =>
    (item.drug_name?.toLowerCase().includes(search.toLowerCase()) ||
    item.patient_id?.toLowerCase().includes(search.toLowerCase()) ||
    item.prescription_id?.toLowerCase().includes(search.toLowerCase())) &&
    isValidDate(item.date)
  );

  // Statistik utama
  const totalRevenue = filtered.reduce((a, b) => a + (typeof b.total_revenue === 'number' ? b.total_revenue : parseFloat(b.total_revenue) || 0), 0);
  const totalProfit = filtered.reduce((a, b) => a + (typeof b.profit === 'number' ? b.profit : parseFloat(b.profit) || 0), 0);
  const totalCost = filtered.reduce((a, b) => a + (typeof b.total_cost === 'number' ? b.total_cost : parseFloat(b.total_cost) || 0), 0);
  const totalDrugs = filtered.reduce((a, b) => a + (typeof b.quantity_sold === 'number' ? b.quantity_sold : parseFloat(b.quantity_sold) || 0), 0);
  const avgMargin =
    filtered.length > 0
      ? filtered.reduce((a, b) => a + (typeof b.profit_margin === 'number' ? b.profit_margin : parseFloat(b.profit_margin) || 0), 0) /
        filtered.length
      : 0;

  // Fungsi untuk mengelompokkan data berdasarkan rentang waktu
  const groupDataByTimeRange = () => {
    const grouped: Record<string, number> = {};

    filtered.forEach(item => {
      if (!isValidDate(item.date)) return; // Lewati item dengan tanggal tidak valid

      let key = '';
      const date = new Date(item.date);

      // Pastikan tanggal valid sebelum mengolah
      if (isNaN(date.getTime())) return; // Lewati jika tanggal tidak valid

      switch (timeRange) {
        case 'daily':
          key = date.toISOString().split('T')[0]; // YYYY-MM-DD
          break;
        case 'monthly':
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`; // YYYY-MM
          break;
        case 'yearly':
          key = `${date.getFullYear()}`; // YYYY
          break;
      }

      if (!grouped[key]) {
        grouped[key] = 0;
      }
      grouped[key] += item.total_revenue;
    });

    // Urutkan data berdasarkan tanggal
    const sortedEntries = Object.entries(grouped).sort(([a], [b]) => {
      if (timeRange === 'daily') {
        const dateA = new Date(a);
        const dateB = new Date(b);
        if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) return 0;
        return dateA.getTime() - dateB.getTime();
      } else if (timeRange === 'monthly') {
        const [aYear, aMonth] = a.split('-').map(Number);
        const [bYear, bMonth] = b.split('-').map(Number);
        if (aYear === undefined || aMonth === undefined || bYear === undefined || bMonth === undefined) return 0;
        if (isNaN(aYear) || isNaN(aMonth) || isNaN(bYear) || isNaN(bMonth)) return 0;
        return (aYear - bYear) * 12 + (aMonth - bMonth);
      } else { // yearly
        const numA = parseInt(a);
        const numB = parseInt(b);
        if (isNaN(numA) || isNaN(numB)) return 0;
        return numA - numB;
      }
    });

    return sortedEntries.map(([date, revenue]) => ({
      date,
      revenue
    }));
  };

  // Gunakan useMemo agar chartData hanya dihitung ulang ketika dependensi berubah
  const chartData = useMemo(() => groupDataByTimeRange(), [filtered, timeRange]);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(val);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white py-10 px-6 space-y-8">
      <header className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-emerald-700">
          Manajemen Pendapatan Obat
        </h1>
        <p className="text-emerald-600 text-sm">
          Dashboard analisis penjualan & keuntungan obat – SIMRS Khanza
        </p>
      </header>

      {/* Statistik ringkas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="bg-emerald-100 border-none shadow-sm">
          <CardContent className="p-4 flex items-center space-x-3">
            <Pill className="text-emerald-700 w-8 h-8" />
            <div>
              <p className="text-xs text-emerald-700">Total Obat Terjual</p>
              <p className="text-xl font-bold">{totalDrugs}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-emerald-100 border-none shadow-sm">
          <CardContent className="p-4 flex items-center space-x-3">
            <DollarSign className="text-emerald-700 w-8 h-8" />
            <div>
              <p className="text-xs text-emerald-700">Total Pendapatan</p>
              <p className="text-xl font-bold">{formatCurrency(totalRevenue)}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-emerald-100 border-none shadow-sm">
          <CardContent className="p-4 flex items-center space-x-3">
            <DollarSign className="text-emerald-700 w-8 h-8" />
            <div>
              <p className="text-xs text-emerald-700">Total Biaya</p>
              <p className="text-xl font-bold">{formatCurrency(totalCost)}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-emerald-100 border-none shadow-sm">
          <CardContent className="p-4 flex items-center space-x-3">
            <TrendingUp className="text-emerald-700 w-8 h-8" />
            <div>
              <p className="text-xs text-emerald-700">Total Laba</p>
              <p className="text-xl font-bold">{formatCurrency(totalProfit)}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-emerald-100 border-none shadow-sm">
          <CardContent className="p-4 flex items-center space-x-3">
            <TrendingUp className="text-emerald-700 w-8 h-8" />
            <div>
              <p className="text-xs text-emerald-700">Rata-rata Margin</p>
              <p className="text-xl font-bold">{avgMargin.toFixed(2)}%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-2 top-3 text-emerald-600 w-4 h-4" />
          <Input
            placeholder="Cari nama obat..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 border-emerald-200"
          />
        </div>

        <div className="flex gap-2 items-center">
          <Calendar className="text-emerald-600 w-4 h-4" />
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border-emerald-200"
          />
          <span className="text-emerald-600">s/d</span>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border-emerald-200"
          />
          <Button
            variant="outline"
            size="sm"
            className="text-emerald-700 border-emerald-300 hover:bg-emerald-100"
          >
            <Download className="w-4 h-4 mr-1" />
            Ekspor
          </Button>
        </div>
      </div>

      {/* Filter waktu untuk grafik */}
      <div className="flex flex-wrap gap-2 justify-center">
        <Button
          variant={timeRange === 'daily' ? 'default' : 'outline'}
          size="sm"
          className={`${
            timeRange === 'daily'
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
              : 'text-emerald-700 border-emerald-300 hover:bg-emerald-50'
          }`}
          onClick={() => setTimeRange('daily')}
        >
          Harian
        </Button>
        <Button
          variant={timeRange === 'monthly' ? 'default' : 'outline'}
          size="sm"
          className={`${
            timeRange === 'monthly'
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
              : 'text-emerald-700 border-emerald-300 hover:bg-emerald-50'
          }`}
          onClick={() => setTimeRange('monthly')}
        >
          Bulanan
        </Button>
        <Button
          variant={timeRange === 'yearly' ? 'default' : 'outline'}
          size="sm"
          className={`${
            timeRange === 'yearly'
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
              : 'text-emerald-700 border-emerald-300 hover:bg-emerald-50'
          }`}
          onClick={() => setTimeRange('yearly')}
        >
          Tahunan
        </Button>
      </div>

      {/* Grafik */}
      <Card className="border-none shadow-sm bg-white">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-emerald-700 text-lg">
              Tren Pendapatan {timeRange === 'daily' ? 'Harian' : timeRange === 'monthly' ? 'Bulanan' : 'Tahunan'}
            </CardTitle>
            <div className="grid grid-cols-2 gap-4 w-full sm:w-auto">
              <div className="bg-emerald-50 p-3 rounded-lg">
                <p className="text-xs text-emerald-600">Total Pendapatan</p>
                <p className="text-lg font-bold text-emerald-700">
                  {formatCurrency(chartData.reduce((sum, item) => sum + item.revenue, 0))}
                </p>
              </div>
              <div className="bg-emerald-50 p-3 rounded-lg">
                <p className="text-xs text-emerald-600">Rata-rata</p>
                <p className="text-lg font-bold text-emerald-700">
                  {chartData.length > 0
                    ? formatCurrency(chartData.reduce((sum, item) => sum + item.revenue, 0) / chartData.length)
                    : formatCurrency(0)}
                </p>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="emerald" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(val) => {
                    if (timeRange === 'daily') {
                      return format(parseISO(val), 'dd MMM', { locale: id });
                    } else if (timeRange === 'monthly') {
                      // Konversi format YYYY-MM menjadi tanggal untuk formatting
                      const [year, month] = val.split('-');
                      const yearNum = parseInt(year);
                      const monthNum = parseInt(month);

                      // Validasi bahwa nilai yang di-parse adalah angka yang valid
                      if (isNaN(yearNum) || isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
                        return val; // Kembalikan nilai asli jika tidak valid
                      }

                      return format(new Date(yearNum, monthNum - 1, 1), 'MMM yyyy', { locale: id });
                    } else { // yearly
                      return val; // already in YYYY format
                    }
                  }}
                  tick={{ fontSize: 12 }}
                  interval="equidistantPreserveStart"
                />
                <YAxis
                  tickFormatter={(val) => `Rp ${(val / 1000000).toFixed(0)}Jt`}
                  width={80}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  formatter={(v: number) => [formatCurrency(v), 'Pendapatan']}
                  labelFormatter={(val) => {
                    if (timeRange === 'daily') {
                      return format(parseISO(val), 'dd MMMM yyyy', { locale: id });
                    } else if (timeRange === 'monthly') {
                      // Konversi format YYYY-MM menjadi tanggal untuk formatting
                      const [year, month] = val.split('-');
                      const yearNum = parseInt(year);
                      const monthNum = parseInt(month);

                      // Validasi bahwa nilai yang di-parse adalah angka yang valid
                      if (isNaN(yearNum) || isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
                        return val; // Kembalikan nilai asli jika tidak valid
                      }

                      return format(new Date(yearNum, monthNum - 1, 1), 'MMMM yyyy', { locale: id });
                    } else { // yearly
                      return `${val}`;
                    }
                  }}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '0.5rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#059669"
                  fill="url(#emerald)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-emerald-600">
              Tidak ada data untuk ditampilkan
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabel Data */}
      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="text-emerald-700 text-lg">
            Data Pendapatan Obat
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Obat</TableHead>
                  <TableHead>Sumber</TableHead>
                  <TableHead>Pasien</TableHead>
                  <TableHead>Resep</TableHead>
                  <TableHead>Jumlah</TableHead>
                  <TableHead>Harga</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Biaya</TableHead>
                  <TableHead>Laba</TableHead>
                  <TableHead>Margin</TableHead>
                  <TableHead>Tanggal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={11} className="text-center">
                      Memuat data...
                    </TableCell>
                  </TableRow>
                ) : filtered.length > 0 ? (
                  filtered.map((item, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">
                        {item.drug_name}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            item.transaction_source === 'ralan'
                              ? 'bg-emerald-100 text-emerald-700'
                              : item.transaction_source === 'ranap'
                              ? 'bg-teal-100 text-teal-700'
                              : item.transaction_source === 'resep'
                              ? 'bg-lime-100 text-lime-700'
                              : item.transaction_source === 'jual_bebas'
                              ? 'bg-cyan-100 text-cyan-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {item.transaction_source || '-'}
                        </span>
                      </TableCell>
                      <TableCell>
                        {item.patient_id || '-'}
                      </TableCell>
                      <TableCell>
                        {item.prescription_id || '-'}
                      </TableCell>
                      <TableCell>{item.quantity_sold}</TableCell>
                      <TableCell>{formatCurrency(item.unit_price)}</TableCell>
                      <TableCell>{formatCurrency(item.total_revenue)}</TableCell>
                      <TableCell>{formatCurrency(item.total_cost || 0)}</TableCell>
                      <TableCell
                        className={
                          (item.profit || 0) >= 0
                            ? 'text-green-600'
                            : 'text-red-600'
                        }
                      >
                        {formatCurrency(item.profit || 0)}
                      </TableCell>
                      <TableCell>{item.profit_margin?.toFixed(2)}%</TableCell>
                      <TableCell>
                        {isValidDate(item.date)
                          ? format(parseISO(item.date), 'dd MMM yyyy', {
                              locale: id
                            })
                          : '-'
                        }
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={11} className="text-center">
                      Tidak ada data ditemukan
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
