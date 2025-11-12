'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ServiceForm from './service-form';
import { Service } from '@/lib/admin-types';
import { createService, updateService } from '@/lib/service-service';

interface ServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service?: Service | null;
  onSubmit: () => void;
}

export default function ServiceDialog({ 
  open, 
  onOpenChange, 
  service, 
  onSubmit 
}: ServiceDialogProps) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    setLoading(true);
    try {
      if (service) {
        // Update existing service
        await updateService(service.id, data);
      } else {
        // Create new service
        await createService(data);
      }
      onSubmit();
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving service:", error);
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
          <DialogTitle>{service ? 'Edit Layanan' : 'Tambah Layanan Baru'}</DialogTitle>
        </DialogHeader>
        <ServiceForm
          service={service}
          onSubmit={handleSubmit}
          onCancel={handleClose}
          loading={loading}
        />
      </DialogContent>
    </Dialog>
  );
}