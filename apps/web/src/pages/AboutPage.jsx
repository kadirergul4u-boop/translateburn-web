
import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Globe2, Zap, ShieldCheck, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { useLanguage } from '@/contexts/LanguageContext.jsx';

export default function AboutPage() {
  const { language } = useLanguage();

  const content = {
    tr: {
      title: "Hakkımızda",
      description: "TranslateBurn'ün misyonu, özellikleri ve arkasındaki ekip hakkında bilgi edinin.",
      heroTitle: "Dil Engellerini Ortadan Kaldırıyoruz",
      heroText: "TranslateBurn, dünyanın her yerindeki insanların birbirleriyle kesintisiz iletişim kurmasını sağlamak amacıyla kurulmuş, yapay zeka destekli yeni nesil bir çeviri platformudur.",
      missionTitle: "Misyonumuz",
      missionText: "Amacımız, en gelişmiş yapay zeka teknolojilerini kullanarak herkes için erişilebilir, hızlı ve son derece doğru çeviri hizmetleri sunmaktır. İletişimin önündeki dil bariyerlerini yıkarak küresel anlayışı artırmayı hedefliyoruz.",
      featuresTitle: "Neden TranslateBurn?",
      features: [
        {
          icon: Zap,
          title: "Işık Hızında Çeviri",
          desc: "Saniyeler içinde anlık sonuçlar alarak iş akışınızı kesintiye uğratmadan iletişime devam edin."
        },
        {
          icon: Globe2,
          title: "DeepL Altyapısı",
          desc: "Dünyanın en iyi yapay zeka çeviri motorlarından biri olan DeepL API ile doğal ve bağlama uygun çeviriler."
        },
        {
          icon: ShieldCheck,
          title: "Gizlilik Odaklı",
          desc: "Çevirileriniz sunucularımızda saklanmaz. Verileriniz sadece çeviri anında işlenir ve silinir."
        }
      ],
      ctaTitle: "Hemen Çeviriye Başlayın",
      ctaText: "Ücretsiz ve kayıt olmadan anında çeviri yapmaya başlayın.",
      ctaBtn: "Çeviri Aracına Git"
    },
    en: {
      title: "About Us",
      description: "Learn about TranslateBurn's mission, features, and the team behind it.",
      heroTitle: "Breaking Down Language Barriers",
      heroText: "TranslateBurn is a next-generation AI-powered translation platform founded to enable seamless communication between people all over the world.",
      missionTitle: "Our Mission",
      missionText: "Our goal is to provide accessible, fast, and highly accurate translation services for everyone using the most advanced AI technologies. We aim to increase global understanding by breaking down language barriers in communication.",
      featuresTitle: "Why Choose TranslateBurn?",
      features: [
        {
          icon: Zap,
          title: "Lightning Fast Translation",
          desc: "Get instant results in seconds and continue communicating without interrupting your workflow."
        },
        {
          icon: Globe2,
          title: "DeepL Infrastructure",
          desc: "Natural and context-appropriate translations with DeepL API, one of the world's best AI translation engines."
        },
        {
          icon: ShieldCheck,
          title: "Privacy Focused",
          desc: "Your translations are not stored on our servers. Your data is processed only at the time of translation and deleted."
        }
      ],
      ctaTitle: "Start Translating Now",
      ctaText: "Start translating instantly for free and without registration.",
      ctaBtn: "Go to Translation Tool"
    }
  }[language];

  return (
    <main className="w-full">
      <Helmet>
        <title>{content.title} | TranslateBurn</title>
        <meta name="description" content={content.description} />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-secondary text-white py-24 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            {content.heroTitle}
          </h1>
          <p className="text-xl text-white/80 leading-relaxed max-w-2xl mx-auto">
            {content.heroText}
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-secondary dark:text-white mb-6">
          {content.missionTitle}
        </h2>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
          {content.missionText}
        </p>
      </section>

      {/* Features Section */}
      <section className="bg-muted/30 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-secondary dark:text-white mb-16">
            {content.featuresTitle}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {content.features.map((feature, idx) => (
              <div key={idx} className="bg-white dark:bg-card p-8 rounded-2xl shadow-sm border border-border text-center hover:shadow-md transition-shadow">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-xl bg-primary/10 text-primary mb-6">
                  <feature.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-secondary dark:text-white mb-4">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto bg-primary/5 border-2 border-primary/20 rounded-3xl p-10 md:p-16">
          <h2 className="text-3xl font-bold text-secondary dark:text-white mb-4">
            {content.ctaTitle}
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            {content.ctaText}
          </p>
          <Link to="/translate">
            <Button size="lg" className="btn-primary">
              {content.ctaBtn}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
