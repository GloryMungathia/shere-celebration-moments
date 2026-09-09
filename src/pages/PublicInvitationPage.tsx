import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Calendar, Clock, Heart, ArrowLeft } from 'lucide-react';
import { fetchPublicInvitation, fetchInvitationTemplates } from '@/lib/api';
import InvitationPreview from '@/components/InvitationPreview';
import Spinner from '@/components/ui/Spinner';
import type { Invitation, InvitationTemplate } from '@/types';

export default function PublicInvitationPage() {
  const { slug } = useParams<{ slug: string }>();
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [template, setTemplate] = useState<InvitationTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    fetchPublicInvitation(slug)
      .then(async (inv) => {
        if (!inv) {
          setError('Invitation not found or not yet published.');
          return;
        }
        setInvitation(inv);
        if (inv.template_id) {
          const templates = await fetchInvitationTemplates();
          const tpl = templates.find((t) => t.id === inv.template_id);
          setTemplate(tpl ?? null);
        }
      })
      .catch(() => setError('Failed to load invitation.'))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 px-4">
        <div className="text-center max-w-md">
          <Heart className="w-12 h-12 text-stone-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-stone-800 mb-2">
            {error || 'Invitation not found'}
          </h1>
          <p className="text-stone-500 mb-6">
            The invitation you're looking for may have been removed or is not yet published.
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

  const config = { ...template?.config, ...invitation.customization };
  const mapsUrl = invitation.address
    ? `https://maps.google.com/?q=${encodeURIComponent(
        `${invitation.venue || ''} ${invitation.address || ''}`
      )}`
    : '#';

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '';
    try {
      return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-rose-50/30 py-6 md:py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <InvitationPreview
            invitation={invitation}
            template={template}
            customization={invitation.customization}
          />
        </div>

        {/* Event details card */}
        <div className="mt-6 bg-white rounded-2xl shadow-sm border border-stone-100 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-stone-800 mb-2">Event Details</h2>
          {invitation.event_date && (
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-rose-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-stone-700">Date</p>
                <p className="text-sm text-stone-500">{formatDate(invitation.event_date)}</p>
              </div>
            </div>
          )}
          {invitation.event_time && (
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-rose-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-stone-700">Time</p>
                <p className="text-sm text-stone-500">{invitation.event_time}</p>
              </div>
            </div>
          )}
          {(invitation.venue || invitation.address) && (
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-rose-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-stone-700">Venue</p>
                {invitation.venue && <p className="text-sm text-stone-500">{invitation.venue}</p>}
                {invitation.address && <p className="text-sm text-stone-400">{invitation.address}</p>}
              </div>
            </div>
          )}
          {invitation.address && (
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-rose-600 text-white font-medium text-sm hover:bg-rose-700 transition-colors"
            >
              <MapPin className="w-4 h-4" />
              Get Directions
            </a>
          )}
        </div>

        <div className="mt-6 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-stone-400 hover:text-stone-600 transition-colors"
          >
            <Heart className="w-4 h-4" fill="currentColor" />
            Create your own invitation
          </Link>
        </div>
      </div>
    </div>
  );
}
