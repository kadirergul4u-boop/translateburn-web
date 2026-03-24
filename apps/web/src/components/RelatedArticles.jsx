
import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, ArrowRight } from 'lucide-react';
import { getRelatedArticles } from '@/data/articles.js';

export default function RelatedArticles({ currentArticleId, relatedIds }) {
  const relatedArticles = getRelatedArticles(currentArticleId, relatedIds);

  if (relatedArticles.length === 0) {
    return null;
  }

  return (
    <aside className="bg-card rounded-2xl p-6 shadow-sm border" aria-label="Related Articles">
      <h3 className="text-lg font-bold mb-4">İlgili Makaleler</h3>
      <div className="space-y-4">
        {relatedArticles.slice(0, 4).map((article) => (
          <article key={article.id} className="group">
            <Link 
              to={`/blog/${article.slug}`}
              className="flex gap-4 hover:bg-muted/50 p-3 rounded-lg transition-colors duration-200"
            >
              <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-muted">
                <img 
                  src={article.featuredImage} 
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm leading-tight mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-200">
                  {article.title}
                </h4>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" aria-hidden="true" />
                  <span>{article.readingTime} dk</span>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-200 shrink-0 self-center" aria-hidden="true" />
            </Link>
          </article>
        ))}
      </div>
    </aside>
  );
}
