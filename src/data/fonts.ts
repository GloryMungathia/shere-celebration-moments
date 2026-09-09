import type { Occasion } from '@/types';
import type { MessageCategory } from '@/types';

export interface FontOption {
  label: string;
  value: string;
}

export const occasionFonts: Record<Occasion, { default: string; alternatives: string[] }> = {
  wedding: {
    default: "'Playfair Display', serif",
    alternatives: [
      "'Cormorant Garamond', serif",
      "'Great Vibes', cursive",
      "'Allura', cursive",
      "'Cinzel', serif",
    ],
  },
  birthday: {
    default: "'Fredoka', sans-serif",
    alternatives: [
      "'Pacifico', cursive",
      "'Baloo 2', sans-serif",
      "'Luckiest Guy', cursive",
      "'Montserrat', sans-serif",
    ],
  },
  graduation: {
    default: "'Montserrat', sans-serif",
    alternatives: [
      "'Poppins', sans-serif",
      "'Bebas Neue', sans-serif",
      "'Raleway', sans-serif",
      "'Source Sans 3', sans-serif",
    ],
  },
  anniversary: {
    default: "'Cormorant Garamond', serif",
    alternatives: [
      "'Dancing Script', cursive",
      "'Great Vibes', cursive",
      "'Allura', cursive",
      "'Lora', serif",
    ],
  },
  engagement: {
    default: "'Allura', cursive",
    alternatives: [
      "'Playfair Display', serif",
      "'Cormorant Garamond', serif",
      "'Montserrat', sans-serif",
      "'Great Vibes', cursive",
    ],
  },
  'baby-shower': {
    default: "'Nunito', sans-serif",
    alternatives: [
      "'Quicksand', sans-serif",
      "'Comfortaa', sans-serif",
      "'Pacifico', cursive",
    ],
  },
  other: {
    default: "'Raleway', sans-serif",
    alternatives: [
      "'Lobster', cursive",
      "'Oswald', sans-serif",
      "'Open Sans', sans-serif",
      "'Montserrat', sans-serif",
    ],
  },
};

export const messageFonts: Record<MessageCategory, { default: string; alternatives: string[] }> = {
  birthday: {
    default: "'Dancing Script', cursive",
    alternatives: ["'Lora', serif", "'Merriweather', serif", "'Great Vibes', cursive", "'Open Sans', sans-serif"],
  },
  graduation: {
    default: "'Dancing Script', cursive",
    alternatives: ["'Lora', serif", "'Merriweather', serif", "'Great Vibes', cursive", "'Open Sans', sans-serif"],
  },
  wedding: {
    default: "'Dancing Script', cursive",
    alternatives: ["'Lora', serif", "'Merriweather', serif", "'Great Vibes', cursive", "'Open Sans', sans-serif"],
  },
  anniversary: {
    default: "'Dancing Script', cursive",
    alternatives: ["'Lora', serif", "'Merriweather', serif", "'Great Vibes', cursive", "'Open Sans', sans-serif"],
  },
  engagement: {
    default: "'Dancing Script', cursive",
    alternatives: ["'Lora', serif", "'Merriweather', serif", "'Great Vibes', cursive", "'Open Sans', sans-serif"],
  },
  baby: {
    default: "'Dancing Script', cursive",
    alternatives: ["'Lora', serif", "'Merriweather', serif", "'Great Vibes', cursive", "'Open Sans', sans-serif"],
  },
  congratulations: {
    default: "'Dancing Script', cursive",
    alternatives: ["'Lora', serif", "'Merriweather', serif", "'Great Vibes', cursive", "'Open Sans', sans-serif"],
  },
  'thank-you': {
    default: "'Dancing Script', cursive",
    alternatives: ["'Lora', serif", "'Merriweather', serif", "'Great Vibes', cursive", "'Open Sans', sans-serif"],
  },
  other: {
    default: "'Dancing Script', cursive",
    alternatives: ["'Lora', serif", "'Merriweather', serif", "'Great Vibes', cursive", "'Open Sans', sans-serif"],
  },
};

export function getFontOptions(occasion: Occasion): FontOption[] {
  const { default: defaultFont, alternatives } = occasionFonts[occasion];
  return [
    { label: 'Default', value: defaultFont },
    ...alternatives.map((f) => {
      const name = f.match(/'([^']+)'/)?.[1] ?? f;
      return { label: name, value: f };
    }),
  ];
}

export function getMessageFontOptions(category: MessageCategory): FontOption[] {
  const { default: defaultFont, alternatives } = messageFonts[category];
  return [
    { label: 'Default', value: defaultFont },
    ...alternatives.map((f) => {
      const name = f.match(/'([^']+)'/)?.[1] ?? f;
      return { label: name, value: f };
    }),
  ];
}
