
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Mail, Clock, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext.jsx';

export default function ContactPage() {
  const { language } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const content = {
    tr: {
      title: "İletişim",
      description: "Bizimle iletişime geçin. Sorularınız, önerileriniz veya reklam talepleriniz için buradayız.",
      heading: "Bizimle İletişime Geçin",
      subheading: "Sorularınız, geri bildirimleriniz veya işbirlikleri için aşağıdaki formu doldurabilir veya doğrudan e-posta gönderebilirsiniz.",
      emailLabel: "E-posta Adresimiz",
      responseLabel: "Yanıt Süresi",
      responseTime: "Genellikle 24-48 saat içinde dönüş yapıyoruz.",
      formName: "Adınız Soyadınız",
      formEmail: "E-posta Adresiniz",
      formMessage: "Mesajınız",
      submitBtn: "Mesajı Gönder",
      submitting: "Gönderiliyor...",
      successMsg: "Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.",
      errorMsg: "Lütfen tüm alanları doldurun."
    },
    en: {
      title: "Contact",
      description: "Get in touch with us. We are here for your questions, suggestions, or advertising requests.",
      heading: "Get in Touch",
      subheading: "For questions, feedback, or collaborations, you can fill out the form below or email us directly.",
      emailLabel: "Our Email",
      responseLabel: "Response Time",
      responseTime: "We usually respond within 24-48 hours.",
      formName: "Full Name",
      formEmail: "Email Address",
      formMessage: "Your Message",
      submitBtn: "Send Message",
      submitting: "Sending...",
      successMsg: "Your message has been sent successfully. We will get back to you as soon as possible.",
      errorMsg: "Please fill in all fields."
    }
  }[language];

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast.error(content.errorMsg);
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success(content.successMsg);
      setFormData({ name: '', email: '', message: '' });
    }, 1500);
  };

  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <Helmet>
        <title>{content.title} | TranslateBurn</title>
        <meta name="description" content={content.description} />
      </Helmet>

      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-secondary dark:text-white mb-4">
          {content.heading}
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {content.subheading}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        
        {/* Contact Info */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white dark:bg-card p-8 rounded-2xl shadow-sm border border-border">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-xl text-primary shrink-0">
                <Mail className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-secondary dark:text-white text-lg mb-1">{content.emailLabel}</h3>
                <a href="mailto:contact@translateburn.com" className="text-primary hover:underline font-medium">
                  contact@translateburn.com
                </a>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-card p-8 rounded-2xl shadow-sm border border-border">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-xl text-primary shrink-0">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-secondary dark:text-white text-lg mb-1">{content.responseLabel}</h3>
                <p className="text-muted-foreground">
                  {content.responseTime}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2 bg-white dark:bg-card p-8 md:p-10 rounded-2xl shadow-sm border border-border">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-semibold text-secondary dark:text-white">
                  {content.formName}
                </label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="h-12 text-base text-gray-900 dark:text-white"
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-semibold text-secondary dark:text-white">
                  {content.formEmail}
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className="h-12 text-base text-gray-900 dark:text-white"
                  disabled={isSubmitting}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-semibold text-secondary dark:text-white">
                {content.formMessage}
              </label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="..."
                className="min-h-[160px] text-base resize-none text-gray-900 dark:text-white"
                disabled={isSubmitting}
              />
            </div>

            <Button 
              type="submit" 
              size="lg" 
              className="w-full sm:w-auto btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  {content.submitting}
                </>
              ) : (
                <>
                  <Send className="mr-2 h-5 w-5" />
                  {content.submitBtn}
                </>
              )}
            </Button>
          </form>
        </div>

      </div>
    </main>
  );
}
