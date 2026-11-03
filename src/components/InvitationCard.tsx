import type { CSSProperties } from 'react';
import { CalendarDays, Clock, MapPin } from 'lucide-react';
import type { EventDetails, Invitation, Occasion, TemplateConfig } from '@/types';
import CardPattern from './CardPattern';
import OccasionEmblem from './OccasionEmblem';
import { formatEventDate, formatEventTime } from '@/lib/format';

interface InvitationCardProps {
  invitation: Partial<Invitation>;
  config: TemplateConfig;
}

function hasDetails(event: EventDetails | null | undefined): boolean {
  return !!event && !!(event.label || event.date || event.time || event.venue || event.address);
}

function Divider({ color }: { color: string }) {
  return (
    <div className="flex items-center justify-center gap-2 my-4" aria-hidden="true">
      <span className="h-px w-14" style={{ backgroundColor: color, opacity: 0.6 }} />
      <svg viewBox="0 0 20 20" className="w-3 h-3">
        <path d="M10 1 L13 10 L10 19 L7 10 Z" fill={color} />
      </svg>
      <span className="h-px w-14" style={{ backgroundColor: color, opacity: 0.6 }} />
    </div>
  );
}

function EventBlock({
  event,
  primary,
  bannerText,
}: {
  event: EventDetails;
  primary: string;
  bannerText: string;
}) {
  return (
    <div className="flex flex-col items-center text-center gap-1.5 min-w-0">
      {event.label && (
        <p
          className="px-4 py-1 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.18em] mb-2"
          style={{ backgroundColor: primary, color: bannerText, clipPath: 'polygon(6% 0, 94% 0, 100% 50%, 94% 100%, 6% 100%, 0 50%)' }}
        >
          {event.label}
        </p>
      )}
      {event.venue && (
        <p className="text-base sm:text-lg font-semibold uppercase tracking-wide leading-tight" style={{ color: primary }}>
          {event.venue}
        </p>
      )}
      {event.date && (
        <p className="flex items-center gap-1.5 text-sm">
          <CalendarDays className="w-4 h-4 shrink-0" style={{ color: primary }} />
          {formatEventDate(event.date)}
        </p>
      )}
      {event.time && (
        <p className="flex items-center gap-1.5 text-sm">
          <Clock className="w-4 h-4 shrink-0" style={{ color: primary }} />
          {formatEventTime(event.time)}
        </p>
      )}
      {event.address && (
        <p className="flex items-center gap-1.5 text-sm opacity-80">
          <MapPin className="w-4 h-4 shrink-0" style={{ color: primary }} />
          {event.address}
        </p>
      )}
    </div>
  );
}

function bannerTextColor(hex: string): string {
  const m = hex.match(/^#([0-9a-f]{6})$/i);
  if (!m) return '#ffffff';
  const n = parseInt(m[1], 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return 0.299 * r + 0.587 * g + 0.114 * b > 160 ? '#1c1917' : '#ffffff';
}

export default function InvitationCard({ invitation, config }: InvitationCardProps) {
  const { primaryColor, accentColor, backgroundColor, textColor, font, borderRadius, pattern, emblem } = config;
  const headingFont = config.headingFont || font;
  const accentFont = config.accentFont || headingFont;
  const occasion = (invitation.occasion ?? 'other') as Occasion;
  const extras = invitation.extras ?? {};
  const photo = config.supportsPhoto ? invitation.photo_url : null;

  const mainEvent: EventDetails = {
    label: extras.event_label,
    date: invitation.event_date,
    time: invitation.event_time ?? '',
    venue: invitation.venue ?? '',
    address: invitation.address ?? '',
  };
  const second = hasDetails(extras.second_event) ? extras.second_event! : null;
  const bannerText = bannerTextColor(primaryColor);
  const topSpace = pattern === 'florals' || pattern === 'balloons' ? 112 : pattern === 'lights' ? 72 : 48;
  const bottomSpace = pattern === 'classic' || pattern === 'florals' ? 96 : 64;

  const style: CSSProperties = {
    backgroundColor,
    color: textColor,
    fontFamily: font,
    borderRadius,
  };

  return (
    <div className="relative w-full overflow-hidden shadow-xl" style={style} data-testid="invitation-card">
      <CardPattern pattern={pattern} primary={primaryColor} accent={accentColor} />
      <div
        className="relative z-10 flex flex-col items-center text-center px-8 sm:px-14 min-h-[560px]"
        style={{ paddingTop: topSpace, paddingBottom: bottomSpace }}
      >
        {photo && (
          <div className="mb-4 w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4" style={{ borderColor: accentColor }}>
            <img src={photo} alt="" className="w-full h-full object-cover" />
          </div>
        )}
        {emblem !== 'none' && !photo && <OccasionEmblem occasion={occasion} primary={primaryColor} accent={accentColor} className="w-14 h-14 sm:w-16 sm:h-16 mb-2" />}

        {extras.intro && (
          <p className="text-xs sm:text-sm uppercase tracking-[0.3em] mb-2" style={{ color: accentColor }}>
            {extras.intro}
          </p>
        )}

        <h2 className="text-5xl sm:text-6xl leading-tight break-words max-w-full" style={{ color: primaryColor, fontFamily: headingFont }}>
          {invitation.title || 'Your Event'}
        </h2>

        {invitation.name && (
          <p className="mt-3 text-3xl sm:text-4xl leading-tight break-words max-w-full" style={{ color: primaryColor, fontFamily: accentFont }}>
            {invitation.name}
          </p>
        )}

        <Divider color={primaryColor} />

        {invitation.message && <p className="text-base leading-relaxed max-w-md whitespace-pre-line">{invitation.message}</p>}

        {(hasDetails(mainEvent) || second) && (
          <div className={`w-full mt-6 grid gap-6 ${second ? 'sm:grid-cols-2' : ''}`}>
            {hasDetails(mainEvent) && <EventBlock event={mainEvent} primary={primaryColor} bannerText={bannerText} />}
            {second && <EventBlock event={second} primary={primaryColor} bannerText={bannerText} />}
          </div>
        )}

        {extras.closing && (
          <>
            <Divider color={primaryColor} />
            <p className="italic leading-relaxed max-w-md whitespace-pre-line" style={{ color: primaryColor }}>
              {extras.closing}
            </p>
          </>
        )}

        {extras.signature && (
          <div className="mt-5">
            <p className="text-sm">Kind regards,</p>
            <p className="text-2xl sm:text-3xl mt-1" style={{ color: primaryColor, fontFamily: accentFont }}>
              {extras.signature}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
