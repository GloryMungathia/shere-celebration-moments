import type { CSSProperties, ReactNode } from 'react';
import { isPattern, scatter } from '@/data/patterns';

interface CardPatternProps {
  pattern?: string;
  primary: string;
  accent: string;
}

const PARTY = ['#f472b6', '#38bdf8', '#facc15', '#34d399', '#a78bfa', '#fb923c'];
const SAGE = '#8aa58a';

type Corner = 'tl' | 'tr' | 'bl' | 'br';

const cornerStyle: Record<Corner, CSSProperties> = {
  tl: { top: 0, left: 0 },
  tr: { top: 0, right: 0, transform: 'scaleX(-1)' },
  bl: { bottom: 0, left: 0, transform: 'scaleY(-1)' },
  br: { bottom: 0, right: 0, transform: 'scale(-1, -1)' },
};

function CornerArt({ corner, width = '38%', viewBox = '0 0 200 200', children }: { corner: Corner; width?: string; viewBox?: string; children: ReactNode }) {
  return (
    <svg
      viewBox={viewBox}
      className="absolute"
      style={{ ...cornerStyle[corner], width, maxWidth: 190, height: 'auto' }}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

function Leaf({ x, y, angle, size = 1, color }: { x: number; y: number; angle: number; size?: number; color: string }) {
  return (
    <path
      d="M0 0 C6 -6 16 -6 22 0 C16 6 6 6 0 0 Z"
      fill={color}
      transform={`translate(${x} ${y}) rotate(${angle}) scale(${size})`}
    />
  );
}

function Rose({ x, y, r, color }: { x: number; y: number; r: number; color: string }) {
  const s = r / 14;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle r="14" fill={color} />
      <circle r="10" fill={color} opacity="0.85" />
      <path
        d="M-8 -2 C-6 -10 6 -10 8 -2 C9 4 3 9 -2 7 C-7 5 -6 -1 -1 -2 C3 -3 4 2 1 3"
        fill="none"
        stroke="#ffffff"
        strokeOpacity="0.55"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </g>
  );
}

function RoseCluster({ primary, accent }: { primary: string; accent: string }) {
  return (
    <>
      <path d="M0 150 C30 120 60 80 120 30" fill="none" stroke={SAGE} strokeWidth="2" />
      <Leaf x={14} y={64} angle={-35} size={1.4} color={SAGE} />
      <Leaf x={62} y={16} angle={20} size={1.3} color={SAGE} />
      <Leaf x={92} y={40} angle={-20} size={1.1} color={SAGE} />
      <Leaf x={30} y={98} angle={60} size={1.1} color={SAGE} />
      <Leaf x={100} y={58} angle={35} size={0.9} color={accent} />
      <Rose x={42} y={42} r={20} color={primary} />
      <Rose x={84} y={24} r={13} color={primary} />
      <Rose x={22} y={86} r={13} color={primary} />
      <circle cx="118" cy="30" r="5" fill={primary} opacity="0.7" />
      <circle cx="10" cy="128" r="4" fill={primary} opacity="0.6" />
      <circle cx="64" cy="70" r="3" fill={accent} />
    </>
  );
}

const BRANCH_LEAVES: [number, number, number][] = [
  [26, 150, -60],
  [30, 130, 200],
  [42, 112, -40],
  [48, 96, 170],
  [62, 82, -30],
  [72, 68, 160],
  [88, 56, -20],
  [102, 46, 150],
  [118, 36, -10],
  [134, 30, 140],
];

function Branch({ color }: { color: string }) {
  return (
    <>
      <path d="M14 190 C20 120 70 50 160 22" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M160 22 C168 18 176 20 178 28 C179 34 172 36 169 31" fill="none" stroke={color} strokeWidth="1.6" />
      {BRANCH_LEAVES.map(([x, y, a]) => (
        <Leaf key={`${x}-${y}`} x={x} y={y} angle={a} size={0.85} color={color} />
      ))}
    </>
  );
}

function Laurel({ color }: { color: string }) {
  const leaves: [number, number, number][] = [];
  for (let i = 0; i < 8; i++) {
    const t = i / 7;
    const x = 100 - 70 * Math.sin(t * 1.3) + (t > 0.8 ? 10 : 0);
    const y = 190 - 170 * t;
    leaves.push([x, y, -110 + t * 40], [x, y, -10 - t * 30]);
  }
  return (
    <>
      <path d="M104 196 C50 170 26 110 46 18" fill="none" stroke={color} strokeWidth="2" />
      {leaves.map(([x, y, a], i) => (
        <Leaf key={i} x={x} y={y} angle={a} size={0.95} color={color} />
      ))}
    </>
  );
}

function Balloon({ x, y, color, tilt = 0 }: { x: number; y: number; color: string; tilt?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${tilt})`}>
      <path d="M0 34 C-6 60 8 80 -2 110" fill="none" stroke="#a8a29e" strokeWidth="1.2" />
      <ellipse rx="24" ry="30" fill={color} />
      <ellipse cx="-8" cy="-12" rx="6" ry="9" fill="#ffffff" opacity="0.35" />
      <path d="M-4 30 L4 30 L0 36 Z" fill={color} />
    </g>
  );
}

function Cloud({ x, y, scale, color }: { x: number; y: number; scale: number; color: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} fill={color}>
      <circle cx="0" cy="0" r="18" />
      <circle cx="20" cy="-8" r="22" />
      <circle cx="44" cy="0" r="17" />
      <rect x="-18" y="0" width="80" height="16" rx="8" />
    </g>
  );
}

function Sparkle({ x, y, size, color }: { x: number; y: number; size: number; color: string }) {
  const s = size;
  return (
    <path
      d={`M${x} ${y - s} Q${x} ${y} ${x + s} ${y} Q${x} ${y} ${x} ${y + s} Q${x} ${y} ${x - s} ${y} Q${x} ${y} ${x} ${y - s} Z`}
      fill={color}
    />
  );
}

function Heart({ x, y, size, color, rotate = 0 }: { x: number; y: number; size: number; color: string; rotate?: number }) {
  return (
    <path
      d="M0 3 C-4 -2 -10 1 -10 6 C-10 11 -3 14 0 18 C3 14 10 11 10 6 C10 1 4 -2 0 3 Z"
      fill={color}
      transform={`translate(${x} ${y}) rotate(${rotate}) scale(${size / 10})`}
    />
  );
}

function FullLayer({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 400 560" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 w-full h-full" aria-hidden="true">
      {children}
    </svg>
  );
}

function Frame({ color, inset = 12, double = false }: { color: string; inset?: number; double?: boolean }) {
  return (
    <>
      <div className="absolute" style={{ inset, border: `1.5px solid ${color}`, borderRadius: 4 }} />
      {double && <div className="absolute" style={{ inset: inset + 5, border: `1px solid ${color}`, opacity: 0.5, borderRadius: 2 }} />}
    </>
  );
}

export default function CardPattern({ pattern, primary, accent }: CardPatternProps) {
  if (!isPattern(pattern) || pattern === 'none') return null;

  let art: ReactNode = null;
  switch (pattern) {
    case 'florals':
      art = (
        <>
          <CornerArt corner="tl">
            <RoseCluster primary={primary} accent={accent} />
          </CornerArt>
          <CornerArt corner="br">
            <RoseCluster primary={primary} accent={accent} />
          </CornerArt>
        </>
      );
      break;
    case 'botanical':
      art = (
        <>
          <CornerArt corner="tl" width="30%">
            <Branch color={primary} />
          </CornerArt>
          <CornerArt corner="tr" width="30%">
            <Branch color={primary} />
          </CornerArt>
        </>
      );
      break;
    case 'classic':
      art = (
        <>
          <Frame color={primary} inset={10} />
          {(['tl', 'tr'] as Corner[]).map((c) => (
            <CornerArt key={c} corner={c} width="12%" viewBox="0 0 60 60">
              <path d="M4 56 V4 H56 M4 20 H20 V4" fill="none" stroke={primary} strokeWidth="2.5" />
            </CornerArt>
          ))}
          <CornerArt corner="tl" width="26%">
            <g transform="translate(18 18) scale(0.85)">
              <Branch color={primary} />
            </g>
          </CornerArt>
          <CornerArt corner="tr" width="26%">
            <g transform="translate(18 18) scale(0.85)">
              <Branch color={primary} />
            </g>
          </CornerArt>
          <svg viewBox="0 0 400 80" preserveAspectRatio="none" className="absolute bottom-0 left-0 w-full" style={{ height: '13%' }} aria-hidden="true">
            <path d="M0 80 L0 18 Q200 96 400 18 L400 80 Z" fill={primary} />
            <path d="M0 80 L0 48 Q200 112 400 48 L400 80 Z" fill="#1c1917" />
          </svg>
        </>
      );
      break;
    case 'laurels':
      art = (
        <>
          <Frame color={accent} inset={14} double />
          <CornerArt corner="bl" width="26%" viewBox="0 0 120 200">
            <g transform="translate(0 200) scale(1 -1)">
              <Laurel color={accent} />
            </g>
          </CornerArt>
          <CornerArt corner="br" width="26%" viewBox="0 0 120 200">
            <g transform="translate(0 200) scale(1 -1)">
              <Laurel color={accent} />
            </g>
          </CornerArt>
        </>
      );
      break;
    case 'deco':
      art = (
        <>
          <Frame color={accent} inset={16} />
          {(['tl', 'tr', 'bl', 'br'] as Corner[]).map((c) => (
            <CornerArt key={c} corner={c} width="22%" viewBox="0 0 120 120">
              <g fill="none" stroke={accent} strokeWidth="1.6">
                <path d="M8 112 V8 H112" />
                <path d="M26 100 V26 H100" />
                <path d="M8 40 Q40 40 40 8" />
              </g>
              <path d="M26 18 L34 26 L26 34 L18 26 Z" fill={accent} />
            </CornerArt>
          ))}
        </>
      );
      break;
    case 'confetti':
      art = (
        <FullLayer>
          {scatter(46, 7).map((p, i) => {
            const color = [primary, accent, ...PARTY][p.color];
            const t = `rotate(${p.rotate} ${p.x} ${p.y})`;
            if (p.shape === 0) return <rect key={i} x={p.x} y={p.y} width={p.size} height={p.size * 0.45} fill={color} transform={t} />;
            if (p.shape === 1) return <circle key={i} cx={p.x} cy={p.y} r={p.size / 2.4} fill={color} />;
            return <Sparkle key={i} x={p.x} y={p.y} size={p.size * 0.8} color={color} />;
          })}
        </FullLayer>
      );
      break;
    case 'balloons':
      art = (
        <>
          <CornerArt corner="tl" width="34%" viewBox="0 0 160 220">
            <Balloon x={44} y={56} color={PARTY[0]} tilt={-8} />
            <Balloon x={96} y={40} color={PARTY[1]} tilt={6} />
            <Balloon x={68} y={104} color={primary} />
          </CornerArt>
          <CornerArt corner="tr" width="34%" viewBox="0 0 160 220">
            <Balloon x={44} y={56} color={PARTY[2]} tilt={-8} />
            <Balloon x={96} y={40} color={accent} tilt={6} />
            <Balloon x={68} y={104} color={PARTY[3]} />
          </CornerArt>
          <FullLayer>
            {scatter(18, 21).map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r={p.size / 3} fill={PARTY[p.color]} opacity="0.7" />
            ))}
          </FullLayer>
        </>
      );
      break;
    case 'hearts':
      art = (
        <FullLayer>
          {scatter(26, 11).map((p, i) => (
            <Heart key={i} x={p.x} y={p.y} size={p.size + 2} rotate={p.rotate % 40 - 20} color={i % 3 ? primary : accent} />
          ))}
        </FullLayer>
      );
      break;
    case 'clouds':
      art = (
        <FullLayer>
          <g opacity="0.55">
            <Cloud x={20} y={40} scale={1.1} color={accent} />
            <Cloud x={290} y={70} scale={1} color={accent} />
            <Cloud x={-10} y={500} scale={1.4} color={accent} />
            <Cloud x={280} y={520} scale={1.3} color={accent} />
          </g>
          {scatter(16, 5).map((p, i) => (
            <Sparkle key={i} x={p.x} y={p.y} size={p.size * 0.7} color={primary} />
          ))}
        </FullLayer>
      );
      break;
    case 'lights':
      art = (
        <>
          <svg viewBox="0 0 400 70" className="absolute top-0 left-0 w-full" aria-hidden="true">
            <path d="M-10 6 Q100 62 200 18 Q300 62 410 6" fill="none" stroke="#57534e" strokeWidth="1.5" />
            {[0.1, 0.25, 0.4, 0.6, 0.75, 0.9].map((t, i) => {
              const half = t < 0.5;
              const u = half ? t * 2 : (t - 0.5) * 2;
              const [x0, cx, x1] = half ? [-10, 100, 200] : [200, 300, 410];
              const [y0, cy, y1] = half ? [6, 62, 18] : [18, 62, 6];
              const x = (1 - u) ** 2 * x0 + 2 * (1 - u) * u * cx + u * u * x1;
              const y = (1 - u) ** 2 * y0 + 2 * (1 - u) * u * cy + u * u * y1;
              return (
                <g key={i}>
                  <circle cx={x} cy={y + 8} r="9" fill={accent} opacity="0.3" />
                  <circle cx={x} cy={y + 8} r="4.5" fill="#fde68a" />
                </g>
              );
            })}
          </svg>
          <CornerArt corner="bl" width="30%">
            <g transform="translate(0 200) scale(1 -1)">
              <Branch color={accent} />
            </g>
          </CornerArt>
          <CornerArt corner="br" width="30%">
            <g transform="translate(0 200) scale(1 -1)">
              <Branch color={accent} />
            </g>
          </CornerArt>
        </>
      );
      break;
    case 'stars':
      art = (
        <FullLayer>
          {scatter(30, 3).map((p, i) => (
            <Sparkle key={i} x={p.x} y={p.y} size={p.size} color={i % 2 ? accent : primary} />
          ))}
        </FullLayer>
      );
      break;
  }

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" data-testid={`pattern-${pattern}`} style={{ borderRadius: 'inherit' }}>
      {art}
    </div>
  );
}
