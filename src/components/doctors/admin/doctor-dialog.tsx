"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import DoctorForm from "@/components/doctors/admin/doctor-form";
import { Doctor } from "@/lib/admin-types";
import { createDoctor, updateDoctor } from "@/lib/doctor-service";

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

  const handleSubmit = async (data: any) => {
    setLoading(true);
    try {
      if (doctor) {
        // Update existing doctor
        await updateDoctor(doctor.id, data);
      } else {
        // Create new doctor
        await createDoctor(data);
      }
      onSubmit();
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving doctor:", error);
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