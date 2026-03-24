
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge.jsx';
import { useLanguage } from '@/contexts/LanguageContext.jsx';

export default function ArticleCard({ article }) {
  const { language } = useLanguage();
  const content = article[language] || article.tr;

  return (
    <article className="card-custom overflow-hidden flex flex-col h-full group">
      <Link to={`/blog/${article.slug}`} className="block overflow-hidden">
        <div className="aspect-[16/9] bg-muted overflow-hidden relative">
          <img 
            src={article.thumbnail || article.coverImage} 
            alt={content.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-300" />
        </div>
      </Link>
      
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <Badge variant="secondary" className="text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 border-0">
            <Tag className="h-3 w-3 mr-1" aria-hidden="true" />
            {content.category}
          </Badge>
          <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
              {new Date(content.publishDate).toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US', { 
                year: 'numeric', month: 'short', day: 'numeric' 
              })}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              {content.readingTime} {language === 'tr' ? 'dk' : 'min'}
            </span>
          </div>
        </div>

        <Link to={`/blog/${article.slug}`} className="block mb-3">
          <h3 className="text-xl font-bold leading-snug text-secondary dark:text-white group-hover:text-primary transition-colors duration-300 line-clamp-2">
            {content.title}
          </h3>
        </Link>

        <p className="text-[#343A40] dark:text-gray-300 text-sm leading-relaxed mb-6 flex-1">
          {content.excerpt}
        </p>

        <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src={article.author.avatar} 
              alt={article.author.name}
              className="h-8 w-8 rounded-full object-cover"
              loading="lazy"
            />
            <span className="text-sm font-semibold text-secondary dark:text-white">{article.author.name}</span>
          </div>
          <Link 
            to={`/blog/${article.slug}`}
            className="text-sm font-bold text-primary hover:text-[#E64A19] transition-colors"
          >
            {language === 'tr' ? 'Devamını Oku →' : 'Read More →'}
          </Link>
        </div>
      </div>
    </article>
  );
}
