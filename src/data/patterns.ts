import type { Occasion } from '@/types';

export type PatternId =
  | 'none'
  | 'florals'
  | 'botanical'
  | 'classic'
  | 'laurels'
  | 'deco'
  | 'confetti'
  | 'balloons'
  | 'hearts'
  | 'clouds'
  | 'lights'
  | 'stars';

export interface PatternInfo {
  id: PatternId;
  label: string;
  description: string;
}

export const patterns: PatternInfo[] = [
  { id: 'none', label: 'No pattern', description: 'A clean card' },
  { id: 'florals', label: 'Roses', description: 'Rose clusters in two corners' },
  { id: 'botanical', label: 'Leafy branches', description: 'Fine branches in the top corners' },
  { id: 'classic', label: 'Classic frame', description: 'Thin frame, branches and a curved band' },
  { id: 'laurels', label: 'Laurels', description: 'Laurel branches and a thin frame' },
  { id: 'deco', label: 'Gold corners', description: 'Art deco corner lines' },
  { id: 'confetti', label: 'Confetti', description: 'Colourful confetti pieces' },
  { id: 'balloons', label: 'Balloons', description: 'Balloon bunches at the top' },
  { id: 'hearts', label: 'Hearts', description: 'Small hearts all over' },
  { id: 'clouds', label: 'Clouds', description: 'Soft clouds and tiny stars' },
  { id: 'lights', label: 'String lights', description: 'Party lights and leaves' },
  { id: 'stars', label: 'Twinkles', description: 'Small sparkles' },
];

export const patternIds = patterns.map((p) => p.id);

export const recommendedPatterns: Record<Occasion, PatternId[]> = {
  wedding: ['florals', 'botanical', 'classic', 'deco'],
  birthday: ['balloons', 'confetti', 'stars'],
  graduation: ['laurels', 'classic', 'deco', 'stars'],
  anniversary: ['florals', 'hearts', 'botanical'],
  engagement: ['florals', 'hearts', 'botanical'],
  'baby-shower': ['clouds', 'stars', 'hearts'],
  other: ['lights', 'confetti', 'stars', 'botanical'],
};

export function sortedPatterns(occasion: Occasion): PatternInfo[] {
  const first = recommendedPatterns[occasion];
  return [
    patterns[0],
    ...first.map((id) => patterns.find((p) => p.id === id)!),
    ...patterns.filter((p) => p.id !== 'none' && !first.includes(p.id)),
  ];
}

export function isPattern(value: unknown): value is PatternId {
  return typeof value === 'string' && (patternIds as string[]).includes(value);
}

export interface ScatterPiece {
  x: number;
  y: number;
  size: number;
  rotate: number;
  shape: number;
  color: number;
}

export function scatter(count: number, seed: number, keepCenterClear = true): ScatterPiece[] {
  let state = seed;
  const next = () => {
    state = (state * 1103515245 + 12345) % 2147483648;
    return state / 2147483648;
  };
  const pieces: ScatterPiece[] = [];
  while (pieces.length < count) {
    const x = next() * 400;
    const y = next() * 560;
    const piece = {
      x,
      y,
      size: 4 + next() * 7,
      rotate: Math.round(next() * 360),
      shape: Math.floor(next() * 3),
      color: Math.floor(next() * 6),
    };
    if (keepCenterClear && x > 90 && x < 310 && y > 90 && y < 470) continue;
    pieces.push(piece);
  }
  return pieces;
}
