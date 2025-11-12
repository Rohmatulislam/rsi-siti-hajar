'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import JobListingForm from './job-listing-form';
import { JobListing } from '@/lib/admin-types';
import { createJobListing, updateJobListing, updateJobListingStatus } from '@/lib/job-service';

interface JobListingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobListing?: JobListing | null;
  onSubmit: () => void;
}

export default function JobListingDialog({ 
  open, 
  onOpenChange, 
  jobListing, 
  onSubmit 
}: JobListingDialogProps) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    setLoading(true);
    try {
      if (jobListing) {
        // Update existing job listing
        await updateJobListing(jobListing.id, data);
      } else {
        // Create new job listing
        await createJobListing(data);
      }
      onSubmit();
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving job listing:", error);
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
          <DialogTitle>{jobListing ? 'Edit Lowongan Pekerjaan' : 'Tambah Lowongan Pekerjaan Baru'}</DialogTitle>
        </DialogHeader>
        <JobListingForm
          jobListing={jobListing}
          onSubmit={handleSubmit}
          onCancel={handleClose}
          loading={loading}
        />
      </DialogContent>
    </Dialog>
  );
}