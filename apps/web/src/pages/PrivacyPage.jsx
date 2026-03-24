
import React from 'react';
import { Helmet } from 'react-helmet';
import { Shield } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext.jsx';

export default function PrivacyPage() {
  const { language } = useLanguage();

  const content = {
    tr: {
      title: "Gizlilik Politikası",
      description: "TranslateBurn.com gizlilik politikası ve veri işleme uygulamaları.",
      lastUpdated: "Son Güncelleme: 23 Mart 2026",
      sections: [
        {
          title: "1. Veri Toplama ve Kullanımı",
          text: "TranslateBurn.com olarak gizliliğinize büyük önem veriyoruz. Çeviri aracımızı kullanırken girdiğiniz metinler, yalnızca çeviri işlemini gerçekleştirmek amacıyla DeepL API'sine iletilir. Bu metinler sunucularımızda kalıcı olarak saklanmaz, kaydedilmez veya üçüncü şahıslarla paylaşılmaz."
        },
        {
          title: "2. Çerezler (Cookies)",
          text: "Sitemiz, kullanıcı deneyimini geliştirmek, tercihlerinizi (dil, tema vb.) hatırlamak ve site trafiğini analiz etmek amacıyla çerezler kullanmaktadır. Çerez kullanımını tarayıcı ayarlarınızdan kontrol edebilir veya reddedebilirsiniz."
        },
        {
          title: "3. Google AdSense ve Reklamlar",
          text: "Sitemizde Google AdSense reklamları yayınlanmaktadır. Google, kullanıcıların sitemize veya diğer sitelere yaptıkları önceki ziyaretlere dayalı olarak reklam yayınlamak için çerezleri kullanır. Kullanıcılar, Google Reklam Ayarları sayfasını ziyaret ederek kişiselleştirilmiş reklamcılığı devre dışı bırakabilirler."
        },
        {
          title: "4. Kullanıcı Hakları",
          text: "Kişisel verileriniz üzerinde kontrol sahibisiniz. Tarayıcınızda saklanan yerel verileri (çeviri geçmişi, favoriler) dilediğiniz zaman silebilirsiniz. Sistemimiz hesap oluşturma gerektirmediği için kişisel kimlik bilgilerinizi toplamıyoruz."
        },
        {
          title: "5. Veri Saklama",
          text: "Çeviri geçmişiniz ve favorileriniz yalnızca sizin cihazınızda (localStorage) saklanır. Sunucularımızda herhangi bir kullanıcı verisi veya çeviri metni arşivi tutulmamaktadır."
        },
        {
          title: "6. İletişim",
          text: "Gizlilik politikamız hakkında sorularınız varsa, lütfen contact@translateburn.com adresi üzerinden bizimle iletişime geçin."
        }
      ]
    },
    en: {
      title: "Privacy Policy",
      description: "TranslateBurn.com privacy policy and data processing practices.",
      lastUpdated: "Last Updated: March 23, 2026",
      sections: [
        {
          title: "1. Data Collection and Usage",
          text: "At TranslateBurn.com, we take your privacy seriously. The texts you enter while using our translation tool are transmitted to the DeepL API solely for the purpose of performing the translation. These texts are not permanently stored on our servers, recorded, or shared with third parties."
        },
        {
          title: "2. Cookies",
          text: "Our site uses cookies to improve user experience, remember your preferences (language, theme, etc.), and analyze site traffic. You can control or reject the use of cookies through your browser settings."
        },
        {
          title: "3. Google AdSense and Advertising",
          text: "We display Google AdSense ads on our site. Google uses cookies to serve ads based on users' prior visits to our site or other sites. Users may opt out of personalized advertising by visiting the Google Ads Settings page."
        },
        {
          title: "4. User Rights",
          text: "You have control over your personal data. You can delete local data stored in your browser (translation history, favorites) at any time. Since our system does not require account creation, we do not collect personally identifiable information."
        },
        {
          title: "5. Data Retention",
          text: "Your translation history and favorites are stored only on your device (localStorage). We do not keep any user data or translation text archives on our servers."
        },
        {
          title: "6. Contact",
          text: "If you have any questions about our privacy policy, please contact us at contact@translateburn.com."
        }
      ]
    }
  }[language];

  return (
    <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <Helmet>
        <title>{content.title} | TranslateBurn</title>
        <meta name="description" content={content.description} />
      </Helmet>

      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mb-6">
          <Shield className="h-8 w-8" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-secondary dark:text-white mb-4">
          {content.title}
        </h1>
        <p className="text-muted-foreground font-medium">
          {content.lastUpdated}
        </p>
      </div>

      <div className="bg-white dark:bg-card rounded-2xl shadow-sm border border-border p-8 md:p-12 space-y-10">
        {content.sections.map((section, index) => (
          <section key={index}>
            <h2 className="text-2xl font-bold text-secondary dark:text-white mb-4">
              {section.title}
            </h2>
            <p className="text-[#343A40] dark:text-gray-300 leading-relaxed text-lg">
              {section.text}
            </p>
          </section>
        ))}
      </div>
    </main>
  );
}
