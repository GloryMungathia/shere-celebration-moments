import { Link } from 'react-router-dom';
import {
  Heart,
  Cake,
  GraduationCap,
  Award,
  Sparkles,
  Baby,
  PartyPopper,
  ArrowRight,
  Mail,
  Palette,
  Share2,
  FileText,
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import Button from '@/components/ui/Button';
import { occasions } from '@/data/occasions';

export default function LandingPage() {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-rose-50 via-amber-50 to-stone-50">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-rose-200 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-200 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/60 backdrop-blur-sm border border-rose-100 mb-6">
              <Sparkles className="w-4 h-4 text-rose-500" />
              <span className="text-sm font-medium text-stone-600">
                Beautiful invitations in minutes
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-stone-800 tracking-tight leading-tight">
              Create beautiful invitations for life's special moments
            </h1>
            <p className="mt-6 text-lg text-stone-600 leading-relaxed">
              Design personalized invitations and celebration messages in minutes.
              Choose a template, add your details, and share with a link — no design
              skills needed.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/occasions">
                <Button size="lg" className="w-full sm:w-auto">
                  <Heart className="w-5 h-5" />
                  Create an Invitation
                </Button>
              </Link>
              <Link to="/messages">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  <Mail className="w-5 h-5" />
                  Create a Celebration Message
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Occasions */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-stone-800">
            What are you celebrating?
          </h2>
          <p className="mt-3 text-stone-500">
            Pick an occasion and start creating your invitation
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {occasions.map((occ) => {
            const Icon = occ.icon;
            return (
              <Link
                key={occ.key}
                to={`/templates/${occ.key}`}
                className="group relative overflow-hidden rounded-2xl bg-white border border-stone-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 p-6 text-center"
              >
                <div
                  className={`w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${occ.gradient} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-stone-800 mb-1">
                  {occ.label}
                </h3>
                <p className="text-sm text-stone-500">{occ.description}</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white border-y border-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-stone-800">
              How it works
            </h2>
            <p className="mt-3 text-stone-500">
              Three simple steps to a beautiful invitation
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Palette,
                title: 'Choose a template',
                desc: 'Browse our collection of elegant, modern, and festive designs for any occasion.',
                color: 'from-rose-400 to-pink-500',
              },
              {
                icon: FileText,
                title: 'Personalize your message',
                desc: 'Add your event details, customize colors and fonts, and optionally upload a photo.',
                color: 'from-amber-400 to-orange-500',
              },
              {
                icon: Share2,
                title: 'Share your invitation',
                desc: 'Publish and get a unique link to send to guests via WhatsApp, email, or QR code.',
                color: 'from-teal-400 to-cyan-500',
              },
            ].map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={i} className="text-center relative">
                  <div className="text-6xl font-bold text-stone-100 absolute -top-4 left-1/2 -translate-x-1/2 -z-0">
                    {i + 1}
                  </div>
                  <div
                    className={`relative w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-md`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-stone-800 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-stone-500 leading-relaxed">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Celebration Messages */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="rounded-3xl bg-gradient-to-br from-amber-50 to-rose-50 p-8 md:p-12 border border-amber-100">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/60 mb-4">
              <Mail className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-medium text-stone-600">
                Celebration Messages
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-stone-800 mb-4">
              Send heartfelt messages for any occasion
            </h2>
            <p className="text-lg text-stone-600 mb-6">
              Birthdays, graduations, weddings, anniversaries, and more. Choose from
              our curated message templates, personalize the words, and share with a
              link.
            </p>
            <Link to="/messages">
              <Button size="lg">
                Create a Celebration Message
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
