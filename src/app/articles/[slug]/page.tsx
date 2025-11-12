import { getArticleBySlug, getPublicArticles } from "@/lib/article-service";
import { notFound } from "next/navigation";
import ArticleDetailClient from "@/components/article-detail-client";

export async function generateStaticParams() {
  try {
    // Fetch all published article slugs from the database
    const articles = await getPublicArticles();
    return articles.map((article) => ({
      slug: article.slug,
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return []; // Return empty array if there's an error
  }
}

export default async function ArticleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  try {
    const resolvedParams = await params;
    // Fetch article by slug from the database
    const article = await getArticleBySlug(resolvedParams.slug);
    
    if (!article) {
      notFound();
    }

    // Fetch related articles
    const allArticles = await getPublicArticles();
    const relatedArticles = allArticles
      .filter(a => a.category === article.category && a.id !== article.id)
      .slice(0, 3); // Limit to 3 related articles

    // Format the article data
    const formattedArticle = {
      id: article.id,
      slug: article.slug,
      title: article.title,
      excerpt: article.excerpt || "",
      date: article.published_at ? new Date(article.published_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      author: article.author_name || "Unknown Author",
      category: article.category || "Uncategorized",
      image: article.image_url || "",
      content: article.content || ""
    };

    const formattedRelatedArticles = relatedArticles.map(rel => ({
      id: rel.id,
      slug: rel.slug,
      title: rel.title,
      excerpt: rel.excerpt || "",
      date: rel.published_at ? new Date(rel.published_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      author: rel.author_name || "Unknown Author",
      category: rel.category || "Uncategorized",
      image: rel.image_url || "",
    }));

    return (
      <ArticleDetailClient 
        article={formattedArticle} 
        relatedArticles={formattedRelatedArticles} 
      />
    );
  } catch (error) {
    console.error("Error fetching article:", error);
    notFound();
  }
}