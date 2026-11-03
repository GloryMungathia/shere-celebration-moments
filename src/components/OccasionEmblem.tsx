import type { Occasion } from '@/types';

interface OccasionEmblemProps {
  occasion: Occasion;
  primary: string;
  accent: string;
  className?: string;
}

export default function OccasionEmblem({ occasion, primary, accent, className = 'w-16 h-16' }: OccasionEmblemProps) {
  let art;
  switch (occasion) {
    case 'graduation':
      art = (
        <>
          <path d="M4 24 L32 12 L60 24 L32 36 Z" fill={primary} />
          <path d="M16 30 V42 C16 48 48 48 48 42 V30 L32 37 Z" fill={primary} opacity="0.85" />
          <path d="M32 24 L52 28 V44" fill="none" stroke={accent} strokeWidth="2" />
          <rect x="49" y="43" width="6" height="9" rx="2" fill={accent} />
        </>
      );
      break;
    case 'wedding':
      art = (
        <>
          <circle cx="24" cy="36" r="14" fill="none" stroke={primary} strokeWidth="4" />
          <circle cx="40" cy="36" r="14" fill="none" stroke={accent} strokeWidth="4" />
          <path d="M36 18 L40 13 L44 18 L40 23 Z" fill={accent} />
        </>
      );
      break;
    case 'birthday':
      art = (
        <>
          <rect x="12" y="34" width="40" height="18" rx="3" fill={primary} />
          <rect x="16" y="24" width="32" height="12" rx="3" fill={accent} />
          <path d="M12 42 Q19 47 26 42 Q32 47 38 42 Q45 47 52 42" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.7" />
          {[24, 32, 40].map((x) => (
            <g key={x}>
              <rect x={x - 1.5} y="14" width="3" height="10" fill={primary} />
              <path d={`M${x} 6 C${x + 4} 10 ${x + 2} 14 ${x} 14 C${x - 2} 14 ${x - 4} 10 ${x} 6 Z`} fill="#f59e0b" />
            </g>
          ))}
        </>
      );
      break;
    case 'anniversary':
      art = (
        <>
          <path d="M24 22 C20 14 8 16 8 26 C8 36 20 42 24 48 C28 42 40 36 40 26 C40 16 28 14 24 22 Z" fill={primary} />
          <path d="M40 18 C37 12 28 13 28 21 C28 29 37 34 40 38 C43 34 52 29 52 21 C52 13 43 12 40 18 Z" fill={accent} opacity="0.9" />
        </>
      );
      break;
    case 'engagement':
      art = (
        <>
          <circle cx="32" cy="40" r="16" fill="none" stroke={primary} strokeWidth="4" />
          <path d="M24 16 L28 10 H36 L40 16 L32 26 Z" fill={accent} />
          <path d="M24 16 H40 M28 10 L32 16 L36 10" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.7" />
        </>
      );
      break;
    case 'baby-shower':
      art = (
        <>
          <circle cx="18" cy="18" r="8" fill={primary} />
          <circle cx="46" cy="18" r="8" fill={primary} />
          <circle cx="18" cy="18" r="4" fill={accent} />
          <circle cx="46" cy="18" r="4" fill={accent} />
          <circle cx="32" cy="34" r="20" fill={primary} />
          <ellipse cx="32" cy="41" rx="9" ry="7" fill={accent} />
          <circle cx="25" cy="30" r="2.5" fill="#1c1917" />
          <circle cx="39" cy="30" r="2.5" fill="#1c1917" />
          <ellipse cx="32" cy="38" rx="3" ry="2" fill="#1c1917" />
        </>
      );
      break;
    default:
      art = (
        <path
          d="M32 6 L39 24 L58 25 L43 37 L48 56 L32 45 L16 56 L21 37 L6 25 L25 24 Z"
          fill={accent}
          stroke={primary}
          strokeWidth="2"
          strokeLinejoin="round"
        />
      );
  }
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true" data-testid="emblem">
      {art}
    </svg>
  );
}
