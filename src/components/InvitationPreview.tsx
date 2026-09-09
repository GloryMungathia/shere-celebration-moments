import type { Invitation, InvitationTemplate, TemplateConfig } from '@/types';
import { occasionLabels } from '@/data/occasions';
import OccasionDecoration from './OccasionDecoration';

interface InvitationPreviewProps {
  invitation: Partial<Invitation>;
  template: InvitationTemplate | null;
  customization?: Partial<TemplateConfig>;
}

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export default function InvitationPreview({
  invitation,
  template,
  customization,
}: InvitationPreviewProps) {
  const config: TemplateConfig = {
    ...(template?.config ?? ({} as TemplateConfig)),
    ...customization,
  };

  const {
    primaryColor,
    accentColor,
    backgroundColor,
    textColor,
    font,
    layout,
    supportsPhoto,
    decorative,
    borderRadius,
  } = config;

  const occasion = invitation.occasion ?? 'other';
  const photo = invitation.photo_url;
  const hasPhoto = supportsPhoto && !!photo;
  const style: React.CSSProperties = {
    backgroundColor,
    color: textColor,
    fontFamily: font,
    borderRadius,
  };

  const decorativeStyle: React.CSSProperties = { color: accentColor };

  const renderContent = () => (
    <>
      <div className="text-4xl mb-3" style={decorativeStyle}>
        {decorative}
      </div>
      <p className="text-xs uppercase tracking-widest mb-2" style={{ color: accentColor }}>
        You're Invited
      </p>
      <h2 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: primaryColor }}>
        {invitation.title || invitation.name || 'Your Event'}
      </h2>
      {invitation.name && invitation.title && (
        <p className="text-lg mb-4">{invitation.name}</p>
      )}
      <div className="w-16 h-px mx-auto mb-4" style={{ backgroundColor: accentColor }} />
      {invitation.event_date && (
        <p className="text-sm mb-1">{formatDate(invitation.event_date)}</p>
      )}
      {invitation.event_time && <p className="text-sm mb-1">{invitation.event_time}</p>}
      {invitation.venue && <p className="text-sm font-medium mt-2">{invitation.venue}</p>}
      {invitation.address && <p className="text-xs opacity-70">{invitation.address}</p>}
      {invitation.message && (
        <p className="text-sm mt-4 italic opacity-80 max-w-sm mx-auto">{invitation.message}</p>
      )}
    </>
  );

  if (layout === 'split' && hasPhoto) {
    return (
      <div className="w-full overflow-hidden shadow-xl" style={style}>
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2 h-48 md:h-auto min-h-[200px] bg-stone-200">
            {photo && (
              <img src={photo} alt="Invitation" className="w-full h-full object-cover" />
            )}
          </div>
          <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-center text-center">
            <OccasionDecoration occasion={occasion} accentColor={accentColor} primaryColor={primaryColor}>
              <div className="py-4">{renderContent()}</div>
            </OccasionDecoration>
          </div>
        </div>
      </div>
    );
  }

  if (layout === 'top-photo' && hasPhoto) {
    return (
      <div className="w-full overflow-hidden shadow-xl" style={style}>
        <div className="h-48 md:h-56 bg-stone-200">
          {photo && (
            <img src={photo} alt="Invitation" className="w-full h-full object-cover" />
          )}
        </div>
        <div className="p-6 md:p-8 text-center">
          <OccasionDecoration occasion={occasion} accentColor={accentColor} primaryColor={primaryColor}>
            <div className="py-4">{renderContent()}</div>
          </OccasionDecoration>
        </div>
      </div>
    );
  }

  if (layout === 'full-photo' && hasPhoto) {
    return (
      <div className="w-full overflow-hidden shadow-xl relative" style={style}>
        <div className="relative h-64 md:h-80 bg-stone-200">
          {photo && (
            <img src={photo} alt="Invitation" className="w-full h-full object-cover" />
          )}
          <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-white text-center p-6">
            <div className="text-3xl mb-2" style={{ color: accentColor }}>
              {decorative}
            </div>
            <p className="text-xs uppercase tracking-widest mb-1" style={{ color: accentColor }}>
              You're Invited
            </p>
            <h2 className="text-xl md:text-2xl font-bold mb-2">
              {invitation.title || invitation.name || 'Your Event'}
            </h2>
            {invitation.name && invitation.title && <p className="text-lg mb-2">{invitation.name}</p>}
            {invitation.event_date && <p className="text-sm">{formatDate(invitation.event_date)}</p>}
            {invitation.event_time && <p className="text-sm">{invitation.event_time}</p>}
            {invitation.venue && <p className="text-sm">{invitation.venue}</p>}
          </div>
        </div>
        {(invitation.message || invitation.address) && (
          <div className="p-4 text-center">
            {invitation.message && <p className="text-sm italic opacity-80">{invitation.message}</p>}
            {invitation.address && <p className="text-xs opacity-60 mt-1">{invitation.address}</p>}
          </div>
        )}
      </div>
    );
  }

  if (layout === 'minimal') {
    return (
      <div className="w-full p-8 md:p-12 shadow-xl text-center" style={style}>
        <div className="text-2xl mb-4" style={decorativeStyle}>
          {decorative}
        </div>
        <p className="text-xs uppercase tracking-[0.3em] mb-3" style={{ color: accentColor }}>
          {occasionLabels[occasion]}
        </p>
        <h2 className="text-2xl md:text-3xl font-light mb-4" style={{ color: primaryColor }}>
          {invitation.title || invitation.name || 'Your Event'}
        </h2>
        {invitation.name && invitation.title && (
          <p className="text-lg mb-4">{invitation.name}</p>
        )}
        {invitation.event_date && (
          <p className="text-sm mb-1 tracking-wide">{formatDate(invitation.event_date)}</p>
        )}
        {invitation.event_time && <p className="text-sm mb-1">{invitation.event_time}</p>}
        {invitation.venue && <p className="text-sm font-medium">{invitation.venue}</p>}
        {invitation.address && <p className="text-xs opacity-60">{invitation.address}</p>}
        {invitation.message && (
          <p className="text-sm mt-4 opacity-70 max-w-xs mx-auto">{invitation.message}</p>
        )}
      </div>
    );
  }

  // Default: centered
  return (
    <div className="w-full p-8 md:p-12 shadow-xl text-center" style={style}>
      {hasPhoto && (
        <div className="mb-6 mx-auto w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 bg-stone-200"
          style={{ borderColor: accentColor }}
        >
          {photo && (
            <img src={photo} alt="Invitation" className="w-full h-full object-cover" />
          )}
        </div>
      )}
      <OccasionDecoration occasion={occasion} accentColor={accentColor} primaryColor={primaryColor}>
        <div className="py-2">{renderContent()}</div>
      </OccasionDecoration>
    </div>
  );
}
