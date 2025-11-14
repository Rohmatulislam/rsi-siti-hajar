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
  Package,
  Calendar,
  Plus,
  Download,
  Eye,
  Edit,
  Trash2,
  AlertTriangle
} from 'lucide-react';

export default function InventoryPage() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Ambil data inventaris dari API
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setLoading(true);
        
        // Panggil API untuk mendapatkan data inventaris
        const response = await fetch('/api/khanza/inventory');
        if (!response.ok) {
          throw new Error('Failed to fetch inventory data');
        }
        
        const data = await response.json();
        setInventory(data);
      } catch (error) {
        console.error('Error fetching inventory data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  const filteredInventory = inventory.filter(item =>
    (item.item_name && item.item_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item.category && item.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item.location && item.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item.item_code && item.item_code.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Kalkulasi statistik
  const totalItems = inventory.length;
  const lowStockItems = inventory.filter(item => 
    item.quantity <= item.min_stock_level
  ).length;
  const totalValue = inventory.reduce((sum, item) => sum + (item.total_value || 0), 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">Manajemen Data Inventaris</CardTitle>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Ekspor
              </Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Barang Baru
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Package className="h-10 w-10 text-blue-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Barang</p>
                    <p className="text-2xl font-bold">{totalItems}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <AlertTriangle className="h-10 w-10 text-yellow-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Stok Rendah</p>
                    <p className="text-2xl font-bold">{lowStockItems}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Package className="h-10 w-10 text-green-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Nilai</p>
                    <p className="text-2xl font-bold">Rp {totalValue.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Package className="h-10 w-10 text-purple-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Kategori</p>
                    <p className="text-2xl font-bold">{new Set(inventory.map(item => item.category)).size}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="relative w-96">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari inventaris (nama barang, kategori, lokasi)..."
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
                <TableHead>Kode Barang</TableHead>
                <TableHead>Nama Barang</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Lokasi</TableHead>
                <TableHead>Stok</TableHead>
                <TableHead>Stok Minimal</TableHead>
                <TableHead>Harga Satuan</TableHead>
                <TableHead>Nilai Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center">
                    Memuat data inventaris...
                  </TableCell>
                </TableRow>
              ) : filteredInventory.length > 0 ? (
                filteredInventory.map((item, index) => (
                  <TableRow key={index} className={
                    item.quantity <= item.min_stock_level ? 'bg-yellow-50' : ''
                  }>
                    <TableCell className="font-mono">{item.item_code}</TableCell>
                    <TableCell className="font-medium">{item.item_name}</TableCell>
                    <TableCell>
                      <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        {item.category}
                      </span>
                    </TableCell>
                    <TableCell>{item.location}</TableCell>
                    <TableCell className="font-bold">{item.quantity}</TableCell>
                    <TableCell>{item.min_stock_level}</TableCell>
                    <TableCell>Rp {item.unit_price?.toLocaleString()}</TableCell>
                    <TableCell>Rp {item.total_value?.toLocaleString()}</TableCell>
                    <TableCell>
                      {item.quantity <= item.min_stock_level ? (
                        <span className="flex items-center bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Stok Rendah
                        </span>
                      ) : (
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                          Aman
                        </span>
                      )}
                    </TableCell>
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
                  <TableCell colSpan={10} className="text-center">
                    Tidak ada data inventaris ditemukan
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