'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ArticleForm from './article-form';
import { Article } from '@/lib/admin-types';
import { createArticle, updateArticle, publishArticle, unpublishArticle } from '@/lib/article-service';

interface ArticleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  article?: Article | null;
  onSubmit: () => void;
}

export default function ArticleDialog({ 
  open, 
  onOpenChange, 
  article, 
  onSubmit 
}: ArticleDialogProps) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    setLoading(true);
    try {
      if (article) {
        // Update existing article
        await updateArticle(article.id, data);
      } else {
        // Create new article
        await createArticle(data);
      }
      onSubmit();
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving article:", error);
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
          <DialogTitle>{article ? 'Edit Artikel' : 'Tambah Artikel Baru'}</DialogTitle>
        </DialogHeader>
        <ArticleForm
          article={article}
          onSubmit={handleSubmit}
          onCancel={handleClose}
          loading={loading}
        />
      </DialogContent>
    </Dialog>
  );
}