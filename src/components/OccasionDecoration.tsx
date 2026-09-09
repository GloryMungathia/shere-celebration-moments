import type { Occasion } from '@/types';

interface OccasionDecorationProps {
  occasion: Occasion;
  accentColor: string;
  primaryColor: string;
  children: React.ReactNode;
}

export default function OccasionDecoration({
  occasion,
  accentColor,
  primaryColor,
  children,
}: OccasionDecorationProps) {
  switch (occasion) {
    case 'wedding':
      return (
        <div className="relative">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              border: `2px solid ${accentColor}`,
              borderRadius: 'inherit',
              opacity: 0.5,
            }}
          />
          <div
            className="absolute inset-2 pointer-events-none"
            style={{
              border: `1px solid ${accentColor}`,
              borderRadius: 'inherit',
              opacity: 0.3,
            }}
          />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <span style={{ color: accentColor, fontSize: '1.5rem' }}>❀</span>
          </div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 pointer-events-none">
            <span style={{ color: accentColor, fontSize: '1.5rem' }}>❀</span>
          </div>
          <div className="relative">{children}</div>
        </div>
      );

    case 'birthday':
      return (
        <div className="relative">
          <div
            className="absolute top-2 left-2 pointer-events-none"
            style={{ color: accentColor, fontSize: '1.2rem', opacity: 0.6 }}
          >
            ✦
          </div>
          <div
            className="absolute top-2 right-2 pointer-events-none"
            style={{ color: accentColor, fontSize: '1.2rem', opacity: 0.6 }}
          >
            ✦
          </div>
          <div
            className="absolute bottom-2 left-2 pointer-events-none"
            style={{ color: accentColor, fontSize: '1.2rem', opacity: 0.6 }}
          >
            ✦
          </div>
          <div
            className="absolute bottom-2 right-2 pointer-events-none"
            style={{ color: accentColor, fontSize: '1.2rem', opacity: 0.6 }}
          >
            ✦
          </div>
          <div
            className="absolute top-0 left-0 right-0 h-1 pointer-events-none rounded-t-[inherit]"
            style={{ background: `linear-gradient(90deg, ${accentColor}, ${primaryColor}, ${accentColor})`, opacity: 0.5 }}
          />
          <div
            className="absolute bottom-0 left-0 right-0 h-1 pointer-events-none rounded-b-[inherit]"
            style={{ background: `linear-gradient(90deg, ${accentColor}, ${primaryColor}, ${accentColor})`, opacity: 0.5 }}
          />
          <div className="relative">{children}</div>
        </div>
      );

    case 'graduation':
      return (
        <div className="relative">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              border: `2px solid ${accentColor}`,
              borderRadius: 'inherit',
              opacity: 0.4,
            }}
          />
          <div
            className="absolute top-0 left-0 w-8 h-8 pointer-events-none"
            style={{ borderTop: `3px solid ${accentColor}`, borderLeft: `3px solid ${accentColor}`, borderRadius: 'inherit' }}
          />
          <div
            className="absolute top-0 right-0 w-8 h-8 pointer-events-none"
            style={{ borderTop: `3px solid ${accentColor}`, borderRight: `3px solid ${accentColor}`, borderRadius: 'inherit' }}
          />
          <div
            className="absolute bottom-0 left-0 w-8 h-8 pointer-events-none"
            style={{ borderBottom: `3px solid ${accentColor}`, borderLeft: `3px solid ${accentColor}`, borderRadius: 'inherit' }}
          />
          <div
            className="absolute bottom-0 right-0 w-8 h-8 pointer-events-none"
            style={{ borderBottom: `3px solid ${accentColor}`, borderRight: `3px solid ${accentColor}`, borderRadius: 'inherit' }}
          />
          <div className="relative">{children}</div>
        </div>
      );

    case 'anniversary':
      return (
        <div className="relative">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              border: `1.5px solid ${accentColor}`,
              borderRadius: 'inherit',
              opacity: 0.4,
            }}
          />
          <div
            className="absolute inset-1.5 pointer-events-none"
            style={{
              border: `1px solid ${accentColor}`,
              borderRadius: 'inherit',
              opacity: 0.2,
            }}
          />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <span style={{ color: accentColor, fontSize: '1.3rem' }}>♥</span>
          </div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 pointer-events-none">
            <span style={{ color: accentColor, fontSize: '1.3rem' }}>♥</span>
          </div>
          <div className="relative">{children}</div>
        </div>
      );

    case 'engagement':
      return (
        <div className="relative">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              border: `1.5px solid ${accentColor}`,
              borderRadius: 'inherit',
              opacity: 0.4,
            }}
          />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <span style={{ color: accentColor, fontSize: '1.4rem' }}>✦</span>
          </div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 pointer-events-none">
            <span style={{ color: accentColor, fontSize: '1.4rem' }}>✦</span>
          </div>
          <div
            className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 pointer-events-none"
            style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: accentColor, opacity: 0.5 }}
          />
          <div
            className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 pointer-events-none"
            style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: accentColor, opacity: 0.5 }}
          />
          <div className="relative">{children}</div>
        </div>
      );

    case 'baby-shower':
      return (
        <div className="relative">
          <div
            className="absolute top-0 left-0 right-0 h-1 pointer-events-none rounded-t-[inherit]"
            style={{ background: `linear-gradient(90deg, ${accentColor}, ${primaryColor}, ${accentColor})`, opacity: 0.4 }}
          />
          <div
            className="absolute bottom-0 left-0 right-0 h-1 pointer-events-none rounded-b-[inherit]"
            style={{ background: `linear-gradient(90deg, ${accentColor}, ${primaryColor}, ${accentColor})`, opacity: 0.4 }}
          />
          <div
            className="absolute top-3 left-3 pointer-events-none"
            style={{ color: accentColor, fontSize: '1rem', opacity: 0.5 }}
          >
            ✦
          </div>
          <div
            className="absolute top-3 right-3 pointer-events-none"
            style={{ color: accentColor, fontSize: '1rem', opacity: 0.5 }}
          >
            ✦
          </div>
          <div
            className="absolute bottom-3 left-3 pointer-events-none"
            style={{ color: accentColor, fontSize: '1rem', opacity: 0.5 }}
          >
            ✦
          </div>
          <div
            className="absolute bottom-3 right-3 pointer-events-none"
            style={{ color: accentColor, fontSize: '1rem', opacity: 0.5 }}
          >
            ✦
          </div>
          <div className="relative">{children}</div>
        </div>
      );

    default:
      return (
        <div className="relative">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              border: `1.5px solid ${accentColor}`,
              borderRadius: 'inherit',
              opacity: 0.3,
            }}
          />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <span style={{ color: accentColor, fontSize: '1.2rem' }}>✦</span>
          </div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 pointer-events-none">
            <span style={{ color: accentColor, fontSize: '1.2rem' }}>✦</span>
          </div>
          <div className="relative">{children}</div>
        </div>
      );
  }
}
