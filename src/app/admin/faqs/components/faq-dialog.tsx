'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import FAQForm from './faq-form';
import { FAQ } from '@/lib/admin-types';
import { createFAQ, updateFAQ } from '@/lib/faq-service';

interface FAQDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  faq?: FAQ | null;
  onSubmit: () => void;
}

export default function FAQDialog({ 
  open, 
  onOpenChange, 
  faq, 
  onSubmit 
}: FAQDialogProps) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    setLoading(true);
    try {
      if (faq) {
        // Update existing FAQ
        await updateFAQ(faq.id, data);
      } else {
        // Create new FAQ
        await createFAQ(data);
      }
      onSubmit();
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving FAQ:", error);
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
          <DialogTitle>{faq ? 'Edit FAQ' : 'Tambah FAQ Baru'}</DialogTitle>
        </DialogHeader>
        <FAQForm
          faq={faq}
          onSubmit={handleSubmit}
          onCancel={handleClose}
          loading={loading}
        />
      </DialogContent>
    </Dialog>
  );
}