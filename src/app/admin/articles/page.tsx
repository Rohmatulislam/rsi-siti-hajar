'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Search,
  Pencil,
  Trash2,
  Eye,
  FilePlus
} from 'lucide-react';
import { getAllArticles, deleteArticle, publishArticle, unpublishArticle } from '@/lib/article-service';
import { Article } from '@/lib/admin-types';
import ArticleDialog from './components/article-dialog';
import { getUserById } from '@/lib/user-service';

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [userNames, setUserNames] = useState<Record<string, string>>({});

  // Ambil data artikel
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const data = await getAllArticles();
        setArticles(data);
        
        // Ambil nama pengguna untuk setiap artikel
        const userIds = [...new Set(data.map(article => article.author_id).filter(id => id))];
        const newUserNames: Record<string, string> = { ...userNames };
        
        for (const userId of userIds) {
          if (userId && !newUserNames[userId]) {
            try {
              const user = await getUserById(userId);
              newUserNames[userId] = user.full_name || user.email || userId;
            } catch (error) {
              console.error(`Error fetching user ${userId}:`, error);
              newUserNames[userId] = userId; // Gunakan ID sebagai fallback
            }
          }
        }
        
        setUserNames(newUserNames);
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [refreshTrigger]);

  // Filter artikel berdasarkan pencarian
  const filteredArticles = articles.filter(article => 
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (article.category && article.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (article.published ? 'published' : 'draft').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus artikel ini?')) {
      try {
        await deleteArticle(id);
        setRefreshTrigger(prev => prev + 1); // Refresh data
      } catch (error) {
        console.error('Error deleting article:', error);
      }
    }
  };

  const handlePublish = async (id: string) => {
    try {
      await publishArticle(id);
      setRefreshTrigger(prev => prev + 1); // Refresh data
    } catch (error) {
      console.error('Error publishing article:', error);
    }
  };

  const handleUnpublish = async (id: string) => {
    try {
      await unpublishArticle(id);
      setRefreshTrigger(prev => prev + 1); // Refresh data
    } catch (error) {
      console.error('Error unpublishing article:', error);
    }
  };

  const handleDialogSubmit = () => {
    setRefreshTrigger(prev => prev + 1); // Refresh data after adding/editing
  };

  const handleEdit = (article: Article) => {
    setEditingArticle(article);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Manajemen Artikel</h1>
          <p className="text-gray-600 dark:text-gray-400">Kelola artikel kesehatan</p>
        </div>
        <Button onClick={() => {
          setEditingArticle(null); // Kosongkan artikel yang sedang diedit
          setDialogOpen(true); // Buka dialog
        }}>
          <FilePlus className="h-4 w-4 mr-2" />
          Tambah Artikel
        </Button>
      </div>

      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Cari artikel..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Memuat data artikel...</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Judul</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Penulis</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredArticles.length > 0 ? (
                    filteredArticles.map((article, index) => (
                      <TableRow key={article.id}>
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell className="font-medium">{article.title}</TableCell>
                        <TableCell>{article.category || '-'}</TableCell>
                        <TableCell>{article.author_id && userNames[article.author_id] ? userNames[article.author_id] : (article.author_id || '-')}</TableCell>
                        <TableCell>
                          {article.published ? (
                            <span className="text-green-600 dark:text-green-400">Dipublikasikan</span>
                          ) : (
                            <span className="text-yellow-600 dark:text-yellow-400">Draft</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(`/articles/${article.slug}`, '_blank')}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(article)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            {article.published ? (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleUnpublish(article.id)}
                                className="text-orange-600 dark:text-orange-400"
                              >
                                Batal Publikasi
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePublish(article.id)}
                                className="text-green-600 dark:text-green-400"
                              >
                                Publikasikan
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(article.id)}
                              className="text-red-600 dark:text-red-400"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        Tidak ada artikel ditemukan
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      <ArticleDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        article={editingArticle}
        onSubmit={handleDialogSubmit}
      />
    </div>
  );
}