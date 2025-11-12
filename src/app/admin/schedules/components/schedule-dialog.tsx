'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ScheduleForm from './schedule-form';
import { Schedule } from '@/lib/admin-types';
import { createSchedule, updateSchedule } from '@/lib/schedule-service';

interface ScheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  schedule?: Schedule | null;
  doctors: { id: string; name: string; specialty: string }[];
  onSubmit: () => void;
}

export default function ScheduleDialog({ 
  open, 
  onOpenChange, 
  schedule, 
  doctors,
  onSubmit 
}: ScheduleDialogProps) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    setLoading(true);
    try {
      if (schedule) {
        // Update existing schedule
        await updateSchedule(schedule.id, data);
      } else {
        // Create new schedule
        await createSchedule(data);
      }
      onSubmit();
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving schedule:", error);
      alert(`Gagal menyimpan jadwal: ${error instanceof Error ? error.message : 'Terjadi kesalahan'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {schedule ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Edit Jadwal Dokter
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Tambah Jadwal Dokter Baru
              </>
            )}
          </DialogTitle>
        </DialogHeader>
        <ScheduleForm
          schedule={schedule}
          doctors={doctors}
          onSubmit={handleSubmit}
          onCancel={handleClose}
          loading={loading}
        />
      </DialogContent>
    </Dialog>
  );
}