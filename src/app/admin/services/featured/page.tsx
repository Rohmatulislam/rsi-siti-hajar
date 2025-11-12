'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  createFeaturedService, 
  updateFeaturedService, 
  deleteFeaturedService,
  getAllFeaturedServices
} from '@/lib/actions/service-actions';
import { toast } from 'sonner';

interface Service {
  id: string;
  category: string | null;
  title: string;
  description: string | null;
  image_url: string | null;
  contact_info: string | null;
  location: string | null;
  operating_hours: string | null;
  features: string[] | null;
  reviews: string[] | null;
  created_at: string;
  updated_at: string;
}

export default function AdminFeaturedServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    contact_info: '',
    location: '',
    operating_hours: '',
    features: [''] as string[],
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const result = await getAllFeaturedServices();
      if (result.success) {
        setServices(result.data);
      } else {
        toast.error('Gagal memuat layanan unggulan');
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Terjadi kesalahan saat memuat layanan');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData(prev => ({ ...prev, features: newFeatures }));
  };

  const addFeatureField = () => {
    setFormData(prev => ({ ...prev, features: [...prev.features, ''] }));
  };

  const removeFeatureField = (index: number) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, features: newFeatures }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const formElement = e.target as HTMLFormElement;
      const fileInput = formElement.querySelector('input[type="file"]') as HTMLInputElement;
      
      let imageUrl = formData.image_url;
      
      // Jika ada file yang dipilih dan bukan URL yang sudah ada, upload file tersebut
      if (fileInput && fileInput.files && fileInput.files[0]) {
        const file = fileInput.files[0];
        
        // Upload file ke server
        const uploadFormData = new FormData();
        uploadFormData.append('file', file);
        uploadFormData.append('folder', 'services');

        const uploadResponse = await fetch('/api/upload-image', {
          method: 'POST',
          body: uploadFormData,
        });

        const uploadResult = await uploadResponse.json();

        if (!uploadResponse.ok) {
          throw new Error(uploadResult.error || 'Gagal mengupload gambar');
        }

        if (uploadResult.url) {
          imageUrl = uploadResult.url;
        }
      }

      const formDataObj = new FormData();
      formDataObj.append('title', formData.title);
      formDataObj.append('description', formData.description);
      formDataObj.append('image_url', imageUrl);
      formDataObj.append('contact_info', formData.contact_info);
      formDataObj.append('location', formData.location);
      formDataObj.append('operating_hours', formData.operating_hours);
      formDataObj.append('features_count', formData.features.length.toString());
      
      formData.features.forEach((feature, index) => {
        formDataObj.append(`feature_${index}`, feature);
      });

      let result;
      if (editingService) {
        result = await updateFeaturedService(editingService.id, formDataObj);
      } else {
        result = await createFeaturedService(formDataObj);
      }

      if (result.success) {
        toast.success(editingService ? 'Layanan berhasil diperbarui' : 'Layanan berhasil dibuat');
        resetForm();
        fetchServices();
      } else {
        toast.error(result.error || 'Terjadi kesalahan');
      }
    } catch (error) {
      console.error('Error submitting service:', error);
      toast.error(error instanceof Error ? error.message : 'Terjadi kesalahan saat menyimpan layanan');
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      description: service.description || '',
      image_url: service.image_url || '',
      contact_info: service.contact_info || '',
      location: service.location || '',
      operating_hours: service.operating_hours || '',
      features: service.features || [''],
    });
  };

  const handleDelete = async (serviceId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus layanan ini?')) return;
    
    try {
      const result = await deleteFeaturedService(serviceId);
      if (result.success) {
        toast.success('Layanan berhasil dihapus');
        fetchServices();
      } else {
        toast.error(result.error || 'Gagal menghapus layanan');
      }
    } catch (error) {
      console.error('Error deleting service:', error);
      toast.error('Terjadi kesalahan saat menghapus layanan');
    }
  };

  const resetForm = () => {
    setEditingService(null);
    setFormData({
      title: '',
      description: '',
      image_url: '',
      contact_info: '',
      location: '',
      operating_hours: '',
      features: [''],
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Kelola Layanan Unggulan</h1>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Kelola Layanan Unggulan</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{editingService ? 'Edit Layanan' : 'Tambah Layanan Baru'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Nama Layanan</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
              
              <div>
                <Label>Gambar Layanan</Label>
                <Input
                  type="file"
                  id="image_url"
                  name="image_url"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const file = e.target.files[0];
                      // Validasi ukuran file (maksimal 5MB)
                      if (file.size > 5 * 1024 * 1024) {
                        toast.error('Ukuran file terlalu besar. Maksimal 5MB diizinkan.');
                        e.target.value = ''; // Reset input
                        return;
                      }
                      // Validasi tipe file
                      const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
                      if (!validTypes.includes(file.type)) {
                        toast.error('Format file tidak didukung. Harap gunakan file PNG, JPG, atau JPEG.');
                        e.target.value = ''; // Reset input
                        return;
                      }
                      // Untuk menghandle file upload, kita akan memprosesnya di submit handler
                      // dan mengganti value dengan URL file sementara
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        setFormData(prev => ({
                          ...prev,
                          image_url: event.target?.result as string || ''
                        }));
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                {editingService && editingService.image_url && !formData.image_url && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Gambar saat ini: {editingService.image_url.split('/').pop() || 'gambar_lama.jpg'}
                  </p>
                )}
                {(formData.image_url && formData.image_url.startsWith('data:image')) || 
                 (editingService && editingService.image_url && formData.image_url === editingService.image_url) ? (
                  <div className="mt-2 flex justify-center">
                    <img 
                      src={editingService && editingService.image_url && formData.image_url === editingService.image_url 
                           ? editingService.image_url 
                           : formData.image_url} 
                      alt="Preview" 
                      className="w-32 h-32 object-cover rounded border"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/images/placeholder.jpg";
                      }}
                    />
                  </div>
                ) : null}
              </div>
              
              <div>
                <Label htmlFor="contact_info">Info Kontak</Label>
                <Input
                  id="contact_info"
                  name="contact_info"
                  value={formData.contact_info}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <Label htmlFor="location">Lokasi</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <Label htmlFor="operating_hours">Jam Operasional</Label>
                <Input
                  id="operating_hours"
                  name="operating_hours"
                  value={formData.operating_hours}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <Label>Fitur Layanan</Label>
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <Input
                      value={feature}
                      onChange={(e) => handleFeatureChange(index, e.target.value)}
                      placeholder={`Fitur ${index + 1}`}
                    />
                    {formData.features.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeFeatureField(index)}
                      >
                        ×
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addFeatureField}
                  className="mt-2"
                >
                  Tambah Fitur
                </Button>
              </div>
              
              <div className="flex gap-2">
                <Button type="submit">
                  {editingService ? 'Simpan Perubahan' : 'Tambah Layanan'}
                </Button>
                {editingService && (
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Batal
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Daftar Layanan Unggulan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {services.map((service) => (
                <Card key={service.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{service.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {service.description}
                        </p>
                        {service.features && service.features.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {service.features.slice(0, 3).map((feature, index) => (
                              <span key={index} className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded">
                                {feature}
                              </span>
                            ))}
                            {service.features.length > 3 && (
                              <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded">
                                +{service.features.length - 3} lainnya
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleEdit(service)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(service.id)}
                        >
                          Hapus
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {services.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  Belum ada layanan unggulan
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}