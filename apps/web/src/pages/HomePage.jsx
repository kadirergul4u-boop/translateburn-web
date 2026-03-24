
import React, { memo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Zap, Globe2 } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import ArticleCard from '@/components/ArticleCard.jsx';
import AdvertisingPlaceholder from '@/components/AdvertisingPlaceholder.jsx';
import { getAllArticles } from '@/data/articles.js';
import { useLanguage } from '@/contexts/LanguageContext.jsx';

const HomePage = memo(function HomePage() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const featuredArticles = getAllArticles().slice(0, 3);

  const t = {
    tr: {
      heroTitle: "Anında Yapay Zeka Destekli Çeviri Aracı",
      heroDesc: "Dil engellerini anında aşın. 30'dan fazla dilde doğal ve doğru çeviriler için gelişmiş yapay zeka ile güçlendirilmiştir.",
      cta: "Çeviriye Başla",
      features: [
        { icon: Zap, title: "Işık Hızında", desc: "Saniyeler içinde anlık sonuçlar" },
        { icon: Sparkles, title: "Yapay Zeka Doğruluğu", desc: "DeepL destekli doğal çeviriler" },
        { icon: Globe2, title: "30+ Dil", desc: "Dünyanın her yeriyle iletişim kurun" }
      ],
      blogTitle: "Blog'dan Son Yazılar",
      blogDesc: "Çeviri teknolojileri ve dil öğrenimi hakkında en güncel içeriklerimizi keşfedin.",
      viewAll: "Tüm Makaleleri Gör"
    },
    en: {
      heroTitle: "Instant AI-Powered Translation Tool",
      heroDesc: "Break language barriers instantly. Powered by advanced AI for natural, accurate translations across 30+ languages.",
      cta: "Start Translating",
      features: [
        { icon: Zap, title: "Lightning Fast", desc: "Instant results in seconds" },
        { icon: Sparkles, title: "AI Accuracy", desc: "DeepL-powered natural translations" },
        { icon: Globe2, title: "30+ Languages", desc: "Communicate with the whole world" }
      ],
      blogTitle: "Latest from the Blog",
      blogDesc: "Discover our latest content on translation technologies and language learning.",
      viewAll: "View All Articles"
    }
  }[language];

  return (
    <main className="w-full">
      {/* Hero Section */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto pt-20 pb-16 text-center">
        <div className="space-y-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-secondary dark:text-white text-balance leading-tight">
            {t.heroTitle}
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t.heroDesc}
          </p>
          <div className="pt-4">
            <Button 
              size="lg" 
              onClick={() => navigate('/translate')}
              className="btn-primary gap-2 h-14 px-10 text-lg"
            >
              {t.cta}
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 text-left">
          {t.features.map((feature, idx) => (
            <div key={idx} className="card-custom p-6 flex flex-col items-center text-center md:items-start md:text-left">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-secondary dark:text-white mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <AdvertisingPlaceholder size="leaderboard" className="my-8" />

      {/* Featured Blog Section */}
      <section className="bg-white dark:bg-secondary/20 py-20 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-secondary dark:text-white mb-4 tracking-tight">
                {t.blogTitle}
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl">
                {t.blogDesc}
              </p>
            </div>
            <Link to="/blog" className="shrink-0">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white transition-colors">
                {t.viewAll}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredArticles.map(article => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      </section>
      
      <AdvertisingPlaceholder size="leaderboard" className="my-12" />
    </main>
  );
});

export default HomePage;
