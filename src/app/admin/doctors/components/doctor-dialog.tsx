'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import DoctorForm from '@/components/doctors/admin/doctor-form';
import { Doctor } from '@/lib/admin-types';
import { createDoctor, updateDoctor } from '@/lib/doctor-service';

interface DoctorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  doctor?: Doctor | null;
  onSubmit: () => void;
}

export default function DoctorDialog({
  open,
  onOpenChange,
  doctor,
  onSubmit
}: DoctorDialogProps) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: {
    name: string;
    specialty: string;
    user_id?: string;
    image_url?: string;
    description?: string;
    experience_years?: number;
    education?: string;
    certifications?: string[];
    consultation_fee?: number;
    // Field tambahan untuk sistem Poli Eksekutif
    is_executive?: boolean;
    kd_dokter?: string;
    sip?: string;
    bpjs?: boolean;
  }) => {
    setLoading(true);
    try {
      if (doctor) {
        // Update existing doctor
        await updateDoctor(doctor.id, {
          name: data.name,
          specialty: data.specialty,
          user_id: data.user_id,
          image_url: data.image_url,
          description: data.description,
          experience_years: data.experience_years,
          education: data.education,
          certifications: data.certifications,
          consultation_fee: data.consultation_fee,
          // Field tambahan untuk sistem Poli Eksekutif
          is_executive: data.is_executive,
          kd_dokter: data.kd_dokter,
          sip: data.sip,
          bpjs: data.bpjs,
        });
      } else {
        // Create new doctor
        await createDoctor({
          name: data.name,
          specialty: data.specialty,
          user_id: data.user_id || undefined, // Menyertakan user_id atau undefined
          image_url: data.image_url,
          description: data.description,
          experience_years: data.experience_years,
          education: data.education,
          certifications: data.certifications,
          consultation_fee: data.consultation_fee,
          // Field tambahan untuk sistem Poli Eksekutif
          is_executive: data.is_executive,
          kd_dokter: data.kd_dokter,
          sip: data.sip,
          bpjs: data.bpjs,
        });
      }
      onSubmit();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error saving doctor:", error);
      // Tampilkan pesan error kepada pengguna
      alert(error.message || "Terjadi kesalahan saat menyimpan dokter. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{doctor ? 'Edit Dokter' : 'Tambah Dokter Baru'}</DialogTitle>
        </DialogHeader>
        <DoctorForm
          doctor={doctor}
          onSubmit={handleSubmit}
          onCancel={handleClose}
          loading={loading}
        />
      </DialogContent>
    </Dialog>
  );
}