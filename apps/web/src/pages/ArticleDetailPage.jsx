
import React, { useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Calendar, Clock, User, ArrowRight, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import Breadcrumb from '@/components/Breadcrumb.jsx';
import RelatedArticles from '@/components/RelatedArticles.jsx';
import { getArticleBySlug } from '@/data/articles.js';
import { generateArticleSchema } from '@/utils/seoHelpers.js';
import { useLanguage } from '@/contexts/LanguageContext.jsx';

export default function ArticleDetailPage() {
  const { slug } = useParams();
  const { language, toggleLanguage } = useLanguage();
  const article = getArticleBySlug(slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!article) {
    return <Navigate to="/blog" replace />;
  }

  const content = article[language] || article.tr;

  const t = {
    tr: {
      home: 'Ana Sayfa',
      blog: 'Blog',
      readTime: 'dakika okuma',
      ctaTitle: 'Hemen ücretsiz çeviriye başla',
      ctaDesc: 'TranslateBurn ile hızlı, doğru ve güvenilir çeviriler yapın. DeepL API destekli yapay zeka teknolojisi ile profesyonel sonuçlar alın.',
      ctaBtn: 'Çeviri Aracını Dene'
    },
    en: {
      home: 'Home',
      blog: 'Blog',
      readTime: 'min read',
      ctaTitle: 'Start translating for free now',
      ctaDesc: 'Make fast, accurate, and reliable translations with TranslateBurn. Get professional results with DeepL API-powered AI technology.',
      ctaBtn: 'Try Translation Tool'
    }
  }[language];

  const breadcrumbItems = [
    { label: t.home, href: '/' },
    { label: t.blog, href: '/blog' },
    { label: content.title, href: `/blog/${article.slug}` }
  ];

  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Helmet>
        <title>{`${content.title} - TranslateBurn Blog`}</title>
        <meta name="description" content={content.metaDescription} />
        <meta name="keywords" content={content.keywords.join(', ')} />
        <meta name="author" content={article.author.name} />
        <meta property="og:image" content={article.coverImage} />
        <meta name="twitter:image" content={article.coverImage} />
        <script type="application/ld+json">
          {JSON.stringify(generateArticleSchema({ ...article, ...content }))}
        </script>
      </Helmet>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <Breadcrumb items={breadcrumbItems} />
        <Button 
          variant="outline" 
          size="sm" 
          onClick={toggleLanguage}
          className="shrink-0 border-primary text-primary hover:bg-primary hover:text-white transition-colors"
        >
          <Globe className="h-4 w-4 mr-2" />
          {language === 'tr' ? 'Read in English' : 'Türkçe Oku'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-12">
        {/* Main Content */}
        <article className="w-full">
          <header className="mb-10">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 leading-tight text-secondary dark:text-white" style={{ textWrap: 'balance' }}>
              {content.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-8 font-medium">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" aria-hidden="true" />
                <time dateTime={content.publishDate}>
                  {new Date(content.publishDate).toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US', { 
                    year: 'numeric', month: 'long', day: 'numeric' 
                  })}
                </time>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" aria-hidden="true" />
                <span>{content.readingTime} {t.readTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-primary" aria-hidden="true" />
                <span>{article.author.name}</span>
              </div>
            </div>

            <figure className="mb-10">
              <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-muted shadow-lg border border-border">
                <img 
                  src={article.coverImage} 
                  alt={content.title}
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              </div>
            </figure>
          </header>

          <div 
            className="article-content"
            dangerouslySetInnerHTML={{ __html: content.content }}
          />

          {/* Author Bio Box */}
          <div className="flex items-center gap-5 p-6 bg-white dark:bg-card rounded-xl border border-border shadow-sm mt-12">
            <img 
              src={article.author.avatar} 
              alt={article.author.name}
              className="h-16 w-16 rounded-full object-cover"
              loading="lazy"
            />
            <div>
              <p className="font-bold text-lg text-secondary dark:text-white">{article.author.name}</p>
              <p className="text-muted-foreground">{article.author.bio}</p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-12 p-8 bg-primary/5 rounded-2xl border-2 border-primary/20 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold mb-2 text-secondary dark:text-white">{t.ctaTitle}</h3>
              <p className="text-muted-foreground max-w-xl">
                {t.ctaDesc}
              </p>
            </div>
            <Link to="/translate" className="shrink-0">
              <Button size="lg" className="btn-primary whitespace-nowrap">
                {t.ctaBtn}
                <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
              </Button>
            </Link>
          </div>
        </article>

        {/* Sidebar */}
        <aside className="space-y-8">
          <RelatedArticles 
            currentArticleId={article.id} 
            relatedIds={article.relatedArticleIds} 
          />
        </aside>
      </div>
    </main>
  );
}
