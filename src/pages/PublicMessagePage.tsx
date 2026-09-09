import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, ArrowLeft } from 'lucide-react';
import { fetchPublicMessage } from '@/lib/api';
import Spinner from '@/components/ui/Spinner';
import { messageCategoryLabels, messageCategoryIcons } from '@/data/messageTemplates';

export default function PublicMessagePage() {
  const { slug } = useParams<{ slug: string }>();
  const [message, setMessage] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    fetchPublicMessage(slug)
      .then((msg) => {
        if (!msg) {
          setError('Message not found or not yet published.');
          return;
        }
        setMessage(msg);
      })
      .catch(() => setError('Failed to load message.'))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !message) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 px-4">
        <div className="text-center max-w-md">
          <Heart className="w-12 h-12 text-stone-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-stone-800 mb-2">
            {error || 'Message not found'}
          </h1>
          <p className="text-stone-500 mb-6">
            The message you're looking for may have been removed or is not yet published.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-rose-600 text-white font-medium hover:bg-rose-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  const category = message.category as keyof typeof messageCategoryLabels;
  const font = message.font || "'Dancing Script', cursive";

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-stone-50 py-6 md:py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div
          className="bg-white rounded-3xl shadow-xl p-8 md:p-12 text-center"
          style={{ fontFamily: font }}
        >
          <div className="text-5xl mb-6">
            {messageCategoryIcons[category]}
          </div>
          {message.recipient_name && (
            <p className="text-sm text-stone-500 mb-3">
              Dear {message.recipient_name},
            </p>
          )}
          <h1 className="text-2xl md:text-3xl font-bold text-stone-800 mb-6">
            {message.title}
          </h1>
          <p className="text-stone-600 leading-relaxed whitespace-pre-wrap text-lg">
            {message.message}
          </p>
          {message.sender_name && (
            <div className="mt-8 pt-6 border-t border-stone-100">
              <p className="text-sm text-stone-500">
                With love,
                <br />
                <span className="text-lg font-semibold text-stone-700">
                  {message.sender_name}
                </span>
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-stone-400 hover:text-stone-600 transition-colors"
          >
            <Heart className="w-4 h-4" fill="currentColor" />
            Create your own celebration message
          </Link>
        </div>
      </div>
    </div>
  );
}
