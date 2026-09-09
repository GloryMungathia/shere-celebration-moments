import { Link } from 'react-router-dom';
import { Sparkles, Mail, Share2, Palette } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import Button from '@/components/ui/Button';

export default function AboutPage() {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="text-center mb-12">
          <img src="/shere-moments-logo.png" alt="SHERÉ Moments" className="w-[210px] h-auto mx-auto mb-6" />
          <h1 className="text-3xl md:text-4xl font-bold text-stone-800">About SHERÉ Moments</h1>
          <p className="mt-4 text-lg text-stone-600 leading-relaxed">
            We believe every special moment deserves a beautiful invitation. Celebrate
            makes it easy to create and share stunning digital invitations and
            celebration messages — no design skills required.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {[
            {
              icon: Palette,
              title: 'Beautiful Templates',
              desc: 'Choose from elegant, modern, floral, and festive designs for any occasion.',
            },
            {
              icon: Sparkles,
              title: 'Personalize Everything',
              desc: 'Customize colors, fonts, and messages. Add a photo to make it yours.',
            },
            {
              icon: Share2,
              title: 'Share in Seconds',
              desc: 'Publish and send your link via WhatsApp, email, or QR code.',
            },
            {
              icon: Mail,
              title: 'Celebration Messages',
              desc: 'Send heartfelt messages for birthdays, graduations, weddings, and more.',
            },
          ].map((feat, i) => {
            const Icon = feat.icon;
            return (
              <div
                key={i}
                className="rounded-2xl bg-white border border-stone-100 shadow-sm p-6"
              >
                <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-rose-500" />
                </div>
                <h3 className="text-lg font-semibold text-stone-800 mb-2">
                  {feat.title}
                </h3>
                <p className="text-stone-500">{feat.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="text-center rounded-3xl bg-gradient-to-br from-rose-50 to-amber-50 p-8 md:p-12 border border-rose-100">
          <h2 className="text-2xl font-bold text-stone-800 mb-3">
            Ready to celebrate?
          </h2>
          <p className="text-stone-600 mb-6">
            Start creating your invitation or celebration message today.
          </p>
          <Link to="/occasions">
            <Button size="lg">
                Get Started
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
