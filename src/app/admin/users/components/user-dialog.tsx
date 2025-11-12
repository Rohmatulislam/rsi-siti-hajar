'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import UserForm from './user-form';
import { User } from '@/lib/admin-types';
import { updateUserRole, updateUser } from '@/lib/user-service';

interface UserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: User | null;
  onSubmit: () => void;
}

export default function UserDialog({ 
  open, 
  onOpenChange, 
  user, 
  onSubmit 
}: UserDialogProps) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    setLoading(true);
    try {
      if (user) {
        // Update existing user
        await updateUser(user.id, data);
      } else {
        // Create new user - in practice, this would be handled differently
        // since users are typically created through Clerk signup
        console.warn("Creating new users through admin panel is not recommended. Users should sign up through Clerk.");
      }
      onSubmit();
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving user:", error);
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
          <DialogTitle>{user ? 'Edit Pengguna' : 'Detail Pengguna'}</DialogTitle>
        </DialogHeader>
        <UserForm
          user={user}
          onSubmit={handleSubmit}
          onCancel={handleClose}
          loading={loading}
        />
      </DialogContent>
    </Dialog>
  );
}