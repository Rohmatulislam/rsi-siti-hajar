'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
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
  Pencil,
  Trash2,
  Eye,
  Plus,
  FileText,
  Users,
  Building2,
  HeartPulse,
  Upload
} from 'lucide-react';
import { AboutContent, AboutSection, Founder } from '@/lib/admin-types';

// Fungsi untuk mendapatkan konten tentang kami
async function getAboutContent(): Promise<AboutContent> {
  const response = await fetch('/api/admin/about');
  if (!response.ok) {
    throw new Error('Failed to fetch about content');
  }
  return response.json();
}

// Fungsi untuk memperbarui konten tentang kami
async function updateAboutContent(id: string, content: Partial<AboutContent>): Promise<AboutContent> {
  const response = await fetch('/api/admin/about', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id, ...content }),
  });
  if (!response.ok) {
    throw new Error('Failed to update about content');
  }
  return response.json();
}

// Fungsi untuk mendapatkan pendiri
async function getFounders(): Promise<Founder[]> {
  const response = await fetch('/api/admin/about/founders');
  if (!response.ok) {
    throw new Error('Failed to fetch founders');
  }
  return response.json();
}

// Fungsi untuk menghapus pendiri
async function deleteFounder(id: string): Promise<void> {
  const response = await fetch(`/api/admin/about/founders/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to delete founder');
  }
}

// Fungsi untuk menambah pendiri
async function addFounder(founder: Omit<Founder, 'id' | 'created_at'>): Promise<Founder> {
  const response = await fetch('/api/admin/about/founders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(founder),
  });
  if (!response.ok) {
    throw new Error('Failed to add founder');
  }
  return response.json();
}

// Fungsi untuk upload gambar
async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', 'founders'); // Gunakan folder 'founders' untuk gambar pendiri

  const response = await fetch('/api/upload-image', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to upload image');
  }

  const result = await response.json();
  return result.url;
}

export default function AboutPage() {
  const [aboutContent, setAboutContent] = useState<AboutContent | null>(null);
  const [founders, setFounders] = useState<Founder[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'general' | 'founders' | 'achievements' | 'team'>('general');
  const [showAddFounderModal, setShowAddFounderModal] = useState(false);
  const [showEditFounderModal, setShowEditFounderModal] = useState(false);
  const [newFounder, setNewFounder] = useState<Omit<Founder, 'id' | 'created_at'>>({
    name: '',
    role: '',
    description: '',
    photo_url: ''
  });
  const [editingFounder, setEditingFounder] = useState<Founder | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const content = await getAboutContent();
      const foundersData = await getFounders();

      setAboutContent(content);
      setFounders(foundersData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (aboutContent) {
      try {
        await updateAboutContent(aboutContent.id, aboutContent);
        alert('Data berhasil disimpan!');
      } catch (error) {
        console.error('Error saving data:', error);
        alert('Terjadi kesalahan saat menyimpan data');
      }
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    if (e.target.files && e.target.files[0] && aboutContent) {
      const file = e.target.files[0];
      try {
        const imageUrl = await uploadImage(file);
        setAboutContent({ ...aboutContent, [field]: imageUrl });
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Gagal mengunggah gambar');
      }
    }
  };

  const handleFounderImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, founderId: string) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        const imageUrl = await uploadImage(file);

        // Update founder dengan URL gambar
        const updatedFounders = founders.map(founder =>
          founder.id === founderId ? { ...founder, photo_url: imageUrl } : founder
        );

        setFounders(updatedFounders);
      } catch (error) {
        console.error('Error uploading founder image:', error);
        alert('Gagal mengunggah gambar pendiri');
      }
    }
  };

  const handleAddFounder = async () => {
    try {
      const addedFounder = await addFounder(newFounder);
      setFounders([...founders, addedFounder]);
      setNewFounder({ name: '', role: '', description: '', photo_url: '' });
      setShowAddFounderModal(false);
      alert('Pendiri berhasil ditambahkan!');
    } catch (error) {
      console.error('Error adding founder:', error);
      alert('Gagal menambahkan pendiri');
    }
  };

  const handleNewFounderImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        const imageUrl = await uploadImage(file);
        setNewFounder({ ...newFounder, photo_url: imageUrl });
      } catch (error) {
        console.error('Error uploading new founder image:', error);
        alert('Gagal mengunggah gambar pendiri');
      }
    }
  };

  const handleEditFounder = async (founder: Founder) => {
    setEditingFounder(founder);
    setShowEditFounderModal(true);
  };

  const handleUpdateFounder = async () => {
    if (editingFounder) {
      try {
        const response = await fetch(`/api/admin/about/founders/${editingFounder.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editingFounder),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to update founder');
        }

        const updatedFounder = await response.json();

        // Update state dengan founder yang telah diperbarui
        setFounders(founders.map(f => f.id === updatedFounder.id ? updatedFounder : f));
        setShowEditFounderModal(false);
        setEditingFounder(null);
        alert('Pendiri berhasil diperbarui!');
      } catch (error) {
        console.error('Error updating founder:', error);
        alert('Gagal memperbarui pendiri');
      }
    }
  };

  const handleEditFounderImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && editingFounder) {
      const file = e.target.files[0];
      try {
        const imageUrl = await uploadImage(file);
        setEditingFounder({ ...editingFounder, photo_url: imageUrl });
      } catch (error) {
        console.error('Error uploading edit founder image:', error);
        alert('Gagal mengunggah gambar pendiri');
      }
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse flex flex-col space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <FileText className="mr-3 h-8 w-8 text-emerald-600" />
            Kelola Halaman Tentang Kami
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Atur konten halaman tentang rumah sakit Anda
          </p>
        </div>
        <Button onClick={handleSave}>
          Simpan Perubahan
        </Button>
      </div>

      <Card>
        <CardHeader className="border-b">
          <div className="flex space-x-4">
            <button
              className={`px-4 py-2 rounded-lg cursor-pointer ${activeTab === 'general' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-100' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
              onClick={() => setActiveTab('general')}
            >
              <div className="flex items-center">
                <Building2 className="mr-2 h-4 w-4" />
                Umum
              </div>
            </button>
            <button
              className={`px-4 py-2 rounded-lg cursor-pointer ${activeTab === 'founders' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-100' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
              onClick={() => setActiveTab('founders')}
            >
              <div className="flex items-center">
                <Users className="mr-2 h-4 w-4" />
                Pendiri & Dewan
              </div>
            </button>
            <button
              className={`px-4 py-2 rounded-lg cursor-pointer ${activeTab === 'achievements' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-100' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
              onClick={() => setActiveTab('achievements')}
            >
              <div className="flex items-center">
                <HeartPulse className="mr-2 h-4 w-4" />
                Prestasi
              </div>
            </button>
            <button
              className={`px-4 py-2 rounded-lg cursor-pointer ${activeTab === 'team' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-100' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
              onClick={() => setActiveTab('team')}
            >
              <div className="flex items-center">
                <Users className="mr-2 h-4 w-4" />
                Tim Kami
              </div>
            </button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {activeTab === 'general' && aboutContent && (
            <div className="space-y-6">
              {/* Upload Gambar Hero Section */}
              <div className="space-y-4">
                <Label>Gambar Hero Section</Label>
                <div className="flex items-center space-x-4">
                  {aboutContent.hero_image ? (
                    <div className="relative">
                      <img 
                        src={aboutContent.hero_image} 
                        alt="Hero Section" 
                        className="w-32 h-24 object-cover rounded-md border"
                      />
                      <div className="absolute inset-0 bg-black/50 rounded-md opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Eye className="h-5 w-5 text-white" />
                      </div>
                    </div>
                  ) : (
                    <div className="w-32 h-24 bg-gray-200 border-2 border-dashed rounded-md flex items-center justify-center text-gray-500">
                      Tidak Ada Gambar
                    </div>
                  )}
                  <div>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'hero_image')}
                      className="w-64"
                    />
                    <p className="text-sm text-gray-500 mt-1">Ukuran disarankan: 1200x400px</p>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="title">Judul Halaman</Label>
                <Input
                  id="title"
                  value={aboutContent.title}
                  onChange={(e) => setAboutContent({...aboutContent, title: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="hero_title">Judul Hero</Label>
                <Input
                  id="hero_title"
                  value={aboutContent.hero_title}
                  onChange={(e) => setAboutContent({...aboutContent, hero_title: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="hero_description">Deskripsi Hero</Label>
                <Textarea
                  id="hero_description"
                  value={aboutContent.hero_description}
                  onChange={(e) => setAboutContent({...aboutContent, hero_description: e.target.value})}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="history">Sejarah Singkat</Label>
                <Textarea
                  id="history"
                  value={aboutContent.history}
                  onChange={(e) => setAboutContent({...aboutContent, history: e.target.value})}
                  rows={6}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="vision">Visi</Label>
                  <Textarea
                    id="vision"
                    value={aboutContent.vision}
                    onChange={(e) => setAboutContent({...aboutContent, vision: e.target.value})}
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="mission">Misi</Label>
                  <Textarea
                    id="mission"
                    value={aboutContent.mission}
                    onChange={(e) => setAboutContent({...aboutContent, mission: e.target.value})}
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="values">Nilai Utama</Label>
                  <Textarea
                    id="values"
                    value={aboutContent.values}
                    onChange={(e) => setAboutContent({...aboutContent, values: e.target.value})}
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="commitment">Komitmen</Label>
                  <Textarea
                    id="commitment"
                    value={aboutContent.commitment}
                    onChange={(e) => setAboutContent({...aboutContent, commitment: e.target.value})}
                    rows={4}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'founders' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Pendiri & Dewan</h2>
                <Button onClick={() => setShowAddFounderModal(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Tambah Pendiri
                </Button>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Gambar</TableHead>
                    <TableHead>Nama</TableHead>
                    <TableHead>Peran</TableHead>
                    <TableHead>Deskripsi</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {founders.map((founder) => (
                    <TableRow key={founder.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {founder.photo_url ? (
                            <img
                              src={founder.photo_url}
                              alt={founder.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-xs">
                              No Photo
                            </div>
                          )}
                          <label className="cursor-pointer">
                            <Upload className="h-4 w-4 text-emerald-600" />
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleFounderImageUpload(e, founder.id)}
                            />
                          </label>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{founder.name}</TableCell>
                      <TableCell>{founder.role}</TableCell>
                      <TableCell>{founder.description}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm" className="cursor-pointer" onClick={() => handleEditFounder(founder)}>
                            <Pencil className="h-4 w-4 cursor-pointer" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700 cursor-pointer"
                            onClick={async () => {
                              if (confirm('Apakah Anda yakin ingin menghapus pendiri ini?')) {
                                await deleteFounder(founder.id);
                                fetchData(); // Refresh data setelah penghapusan
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4 cursor-pointer" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Modal tambah pendiri */}
          {showAddFounderModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md">
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Tambah Pendiri Baru</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="new-founder-name">Nama</Label>
                      <Input
                        id="new-founder-name"
                        value={newFounder.name}
                        onChange={(e) => setNewFounder({...newFounder, name: e.target.value})}
                        placeholder="Nama pendiri"
                      />
                    </div>
                    <div>
                      <Label htmlFor="new-founder-role">Peran</Label>
                      <Input
                        id="new-founder-role"
                        value={newFounder.role}
                        onChange={(e) => setNewFounder({...newFounder, role: e.target.value})}
                        placeholder="Peran pendiri"
                      />
                    </div>
                    <div>
                      <Label htmlFor="new-founder-description">Deskripsi</Label>
                      <Textarea
                        id="new-founder-description"
                        value={newFounder.description}
                        onChange={(e) => setNewFounder({...newFounder, description: e.target.value})}
                        placeholder="Deskripsi pendiri"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="new-founder-photo">Foto</Label>
                      <div className="flex items-center space-x-2">
                        {newFounder.photo_url ? (
                          <img
                            src={newFounder.photo_url}
                            alt="Preview"
                            className="w-16 h-16 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-gray-500">No Photo</span>
                          </div>
                        )}
                        <label className="cursor-pointer">
                          <Upload className="h-6 w-6 text-emerald-600 cursor-pointer" />
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleNewFounderImageUpload}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3 mt-6">
                    <Button
                      variant="outline"
                      onClick={() => setShowAddFounderModal(false)}
                    >
                      Batal
                    </Button>
                    <Button onClick={handleAddFounder}>
                      Simpan
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Modal edit pendiri */}
          {showEditFounderModal && editingFounder && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md">
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Edit Pendiri</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="edit-founder-name">Nama</Label>
                      <Input
                        id="edit-founder-name"
                        value={editingFounder.name}
                        onChange={(e) => setEditingFounder({...editingFounder, name: e.target.value})}
                        placeholder="Nama pendiri"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-founder-role">Peran</Label>
                      <Input
                        id="edit-founder-role"
                        value={editingFounder.role}
                        onChange={(e) => setEditingFounder({...editingFounder, role: e.target.value})}
                        placeholder="Peran pendiri"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-founder-description">Deskripsi</Label>
                      <Textarea
                        id="edit-founder-description"
                        value={editingFounder.description}
                        onChange={(e) => setEditingFounder({...editingFounder, description: e.target.value})}
                        placeholder="Deskripsi pendiri"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-founder-photo">Foto</Label>
                      <div className="flex items-center space-x-2">
                        {editingFounder.photo_url ? (
                          <img
                            src={editingFounder.photo_url}
                            alt="Preview"
                            className="w-16 h-16 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-gray-500">No Photo</span>
                          </div>
                        )}
                        <label className="cursor-pointer">
                          <Upload className="h-6 w-6 text-emerald-600 cursor-pointer" />
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleEditFounderImageUpload}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3 mt-6">
                    <Button
                      variant="outline"
                      onClick={() => setShowEditFounderModal(false)}
                    >
                      Batal
                    </Button>
                    <Button onClick={handleUpdateFounder}>
                      Simpan Perubahan
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'achievements' && aboutContent && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Prestasi</h2>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Tambah Prestasi
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {aboutContent.achievements.map((achievement, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <Input
                            placeholder="Jumlah"
                            value={achievement.number}
                            onChange={(e) => {
                              const updated = [...aboutContent.achievements];
                              updated[index].number = e.target.value;
                              setAboutContent({...aboutContent, achievements: updated});
                            }}
                          />
                          <Input
                            className="mt-2"
                            placeholder="Deskripsi"
                            value={achievement.label}
                            onChange={(e) => {
                              const updated = [...aboutContent.achievements];
                              updated[index].label = e.target.value;
                              setAboutContent({...aboutContent, achievements: updated});
                            }}
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => {
                            const updated = aboutContent.achievements.filter((_, i) => i !== index);
                            setAboutContent({...aboutContent, achievements: updated});
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'team' && aboutContent && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Tim Profesional Kami</h2>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Tambah Tim
                </Button>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama</TableHead>
                    <TableHead>Peran</TableHead>
                    <TableHead>Pengalaman</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {aboutContent.team.map((member, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{member.name}</TableCell>
                      <TableCell>{member.role}</TableCell>
                      <TableCell>{member.experience}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}