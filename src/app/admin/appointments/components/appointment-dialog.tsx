'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AppointmentForm from './appointment-form';
import { Appointment } from '@/lib/admin-types';
import { createAppointment, updateAppointmentStatus } from '@/lib/appointment-service';

interface AppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment?: Appointment | null;
  patients: { id: string; full_name: string | null; email: string | null }[];
  doctors: { id: string; name: string; specialty: string }[];
  onSubmit: () => void;
}

export default function AppointmentDialog({ 
  open, 
  onOpenChange, 
  appointment, 
  patients,
  doctors,
  onSubmit 
}: AppointmentDialogProps) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    setLoading(true);
    try {
      if (appointment) {
        // Update existing appointment status
        await updateAppointmentStatus(appointment.id, data.status);
      } else {
        // Create new appointment
        await createAppointment(data);
      }
      onSubmit();
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving appointment:", error);
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
          <DialogTitle>{appointment ? 'Edit Janji Temu' : 'Tambah Janji Temu Baru'}</DialogTitle>
        </DialogHeader>
        <AppointmentForm
          appointment={appointment}
          patients={patients}
          doctors={doctors}
          onSubmit={handleSubmit}
          onCancel={handleClose}
          loading={loading}
        />
      </DialogContent>
    </Dialog>
  );
}