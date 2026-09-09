import { useState } from 'react';
import { Mail, MessageSquare, Check, AlertCircle } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import Button from '@/components/ui/Button';
import FormField, { Input, TextArea } from '@/components/ui/FormField';
import { supabase } from '@/lib/supabase';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const { error: fnError } = await supabase.functions.invoke('contact-form', {
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          subject: form.subject,
          message: form.message,
        }),
      });
      if (fnError) throw fnError;
      setSubmitted(true);
      setForm({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 6000);
    } catch (err) {
      console.error(err);
      setError('Failed to send your message. Please try again or email us directly.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="text-center mb-10">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center mx-auto mb-4">
            <Mail className="w-7 h-7 text-rose-500" />
          </div>
          <h1 className="text-3xl font-bold text-stone-800">Contact Us</h1>
          <p className="mt-3 text-stone-500">
            Have a question or feedback? We'd love to hear from you.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-sm text-red-600">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {submitted ? (
          <div className="rounded-2xl bg-green-50 border border-green-200 p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <Check className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="text-lg font-semibold text-stone-800 mb-1">
              Message sent!
            </h2>
            <p className="text-stone-500">
              Thank you for reaching out. We'll get back to you soon.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl bg-white border border-stone-100 shadow-sm p-6 md:p-8 space-y-4"
          >
            <FormField label="Your Name">
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="John Smith"
                required
              />
            </FormField>
            <FormField label="Email">
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                required
              />
            </FormField>
            <FormField label="Subject">
              <Input
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                placeholder="How can we help?"
                required
              />
            </FormField>
            <FormField label="Message">
              <TextArea
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Tell us more..."
                required
              />
            </FormField>
            <Button type="submit" className="w-full" size="lg" disabled={submitting}>
              <MessageSquare className="w-4 h-4" />
              {submitting ? 'Sending...' : 'Send Message'}
            </Button>
          </form>
        )}
      </div>
    </Layout>
  );
}
