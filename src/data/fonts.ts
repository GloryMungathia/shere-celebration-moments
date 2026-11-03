import type { MessageCategory, Occasion } from '@/types';

export interface FontOption {
  label: string;
  value: string;
}

export type FontGroup = 'script' | 'serif' | 'sans' | 'display' | 'handwritten';
export type FontRole = 'heading' | 'accent' | 'body';

export interface FontGroupOptions {
  label: string;
  options: FontOption[];
}

export const fontGroupLabels: Record<FontGroup, string> = {
  script: 'Script (elegant, romantic)',
  serif: 'Serif (classic, formal)',
  sans: 'Sans serif (clean, modern)',
  display: 'Display (bold, fun)',
  handwritten: 'Handwritten (personal letters)',
};

const fallback: Record<FontGroup, string> = {
  script: 'cursive',
  serif: 'serif',
  sans: 'sans-serif',
  display: 'sans-serif',
  handwritten: 'cursive',
};

const library: Record<FontGroup, string[]> = {
  script: [
    'Great Vibes',
    'Allura',
    'Alex Brush',
    'Pinyon Script',
    'Parisienne',
    'Dancing Script',
    'Sacramento',
    'Satisfy',
    'Tangerine',
    'Cookie',
    'Pacifico',
    'Lobster',
  ],
  serif: [
    'Playfair Display',
    'Cormorant Garamond',
    'Cinzel',
    'Lora',
    'Merriweather',
    'PT Serif',
    'EB Garamond',
    'Libre Baskerville',
    'Marcellus',
  ],
  sans: [
    'Montserrat',
    'Poppins',
    'Raleway',
    'Lato',
    'Open Sans',
    'Roboto',
    'Nunito',
    'Quicksand',
    'Josefin Sans',
    'Source Sans 3',
  ],
  display: [
    'Bebas Neue',
    'Oswald',
    'Abril Fatface',
    'Righteous',
    'Fredoka',
    'Baloo 2',
    'Luckiest Guy',
    'Bubblegum Sans',
    'Comfortaa',
  ],
  handwritten: ['Caveat', 'Kalam', 'Patrick Hand', 'Amatic SC', 'Comic Neue'],
};

export function fontValue(name: string): string {
  const group = (Object.keys(library) as FontGroup[]).find((g) => library[g].includes(name));
  return `'${name}', ${group ? fallback[group] : 'sans-serif'}`;
}

export function fontName(value: string | null | undefined): string {
  if (!value) return '';
  return value.match(/'([^']+)'/)?.[1] ?? value.split(',')[0].trim();
}

export const allFonts: string[] = (Object.keys(library) as FontGroup[]).flatMap((g) => library[g]);

type Recommended = Record<FontRole, string[]>;

export const occasionFonts: Record<Occasion, Recommended> = {
  wedding: {
    heading: ['Great Vibes', 'Playfair Display', 'Pinyon Script', 'Allura'],
    accent: ['Great Vibes', 'Allura', 'Dancing Script', 'Alex Brush'],
    body: ['Cormorant Garamond', 'Lora', 'Lato', 'Open Sans', 'Montserrat'],
  },
  birthday: {
    heading: ['Pacifico', 'Fredoka', 'Luckiest Guy', 'Baloo 2'],
    accent: ['Pacifico', 'Dancing Script', 'Satisfy'],
    body: ['Poppins', 'Montserrat', 'Open Sans', 'Lato', 'Nunito'],
  },
  graduation: {
    heading: ['Great Vibes', 'Playfair Display', 'Bebas Neue', 'Cinzel'],
    accent: ['Pinyon Script', 'Allura', 'Great Vibes', 'Dancing Script'],
    body: ['Montserrat', 'Lora', 'EB Garamond', 'Roboto', 'Lato'],
  },
  anniversary: {
    heading: ['Allura', 'Great Vibes', 'Playfair Display'],
    accent: ['Dancing Script', 'Alex Brush', 'Allura'],
    body: ['Lora', 'Lato', 'Open Sans', 'Cormorant Garamond'],
  },
  engagement: {
    heading: ['Allura', 'Playfair Display', 'Great Vibes'],
    accent: ['Great Vibes', 'Dancing Script', 'Alex Brush'],
    body: ['Montserrat', 'Josefin Sans', 'Lora', 'Lato'],
  },
  'baby-shower': {
    heading: ['Pacifico', 'Bubblegum Sans', 'Fredoka'],
    accent: ['Dancing Script', 'Pacifico', 'Comic Neue'],
    body: ['Quicksand', 'Nunito', 'Comfortaa', 'Open Sans'],
  },
  other: {
    heading: ['Lobster', 'Righteous', 'Pacifico', 'Abril Fatface'],
    accent: ['Satisfy', 'Caveat', 'Dancing Script'],
    body: ['Raleway', 'Montserrat', 'Poppins', 'Lato', 'Open Sans'],
  },
};

export const messageFonts: Record<MessageCategory, string[]> = {
  birthday: ['Pacifico', 'Dancing Script', 'Fredoka', 'Poppins', 'Caveat'],
  graduation: ['Playfair Display', 'Dancing Script', 'Montserrat', 'Lora', 'Great Vibes'],
  wedding: ['Great Vibes', 'Cormorant Garamond', 'Allura', 'Lora', 'Playfair Display'],
  anniversary: ['Allura', 'Dancing Script', 'Lora', 'Great Vibes', 'Alex Brush'],
  engagement: ['Allura', 'Playfair Display', 'Great Vibes', 'Josefin Sans'],
  baby: ['Quicksand', 'Pacifico', 'Nunito', 'Comic Neue', 'Dancing Script'],
  congratulations: ['Playfair Display', 'Satisfy', 'Montserrat', 'Lobster', 'Lora'],
  'thank-you': ['Dancing Script', 'Lora', 'Merriweather', 'Open Sans', 'PT Serif'],
  other: ['Dancing Script', 'Kalam', 'Lora', 'Caveat', 'Merriweather'],
};

function groupedOptions(recommended: string[]): FontGroupOptions[] {
  const groups: FontGroupOptions[] = [
    { label: 'Recommended', options: recommended.map((name) => ({ label: name, value: fontValue(name) })) },
  ];
  for (const group of Object.keys(library) as FontGroup[]) {
    const options = library[group]
      .filter((name) => !recommended.includes(name))
      .map((name) => ({ label: name, value: fontValue(name) }));
    if (options.length) groups.push({ label: fontGroupLabels[group], options });
  }
  return groups;
}

export function getFontGroups(occasion: Occasion, role: FontRole): FontGroupOptions[] {
  return groupedOptions(occasionFonts[occasion][role]);
}

export function getMessageFontGroups(category: MessageCategory): FontGroupOptions[] {
  return groupedOptions(messageFonts[category]);
}

export function getFontOptions(occasion: Occasion): FontOption[] {
  return getFontGroups(occasion, 'body').flatMap((g) => g.options);
}

export function getMessageFontOptions(category: MessageCategory): FontOption[] {
  return getMessageFontGroups(category).flatMap((g) => g.options);
}

const fontWeights: Record<string, string> = {
  'Playfair Display': '400;600;700',
  'Cormorant Garamond': '400;600;700',
  Cinzel: '400;600;700',
  Lora: '400;600;700',
  'EB Garamond': '400;600;700',
  'Dancing Script': '400;600;700',
  Montserrat: '400;600;700',
  Poppins: '400;600;700',
  Raleway: '400;600;700',
  'Open Sans': '400;600;700',
  Roboto: '400;700',
  Nunito: '400;600;700',
  Quicksand: '400;600;700',
  'Josefin Sans': '400;600;700',
  'Source Sans 3': '400;600;700',
  Oswald: '400;600;700',
  Fredoka: '400;600;700',
  'Baloo 2': '400;600;700',
  Comfortaa: '400;600;700',
  Caveat: '400;700',
  Lato: '400;700',
  Merriweather: '400;700',
  'PT Serif': '400;700',
  'Libre Baskerville': '400;700',
  Kalam: '400;700',
  'Comic Neue': '400;700',
  'Amatic SC': '400;700',
};

export function googleFontsUrl(): string {
  const families = allFonts.map((name) => {
    const weights = fontWeights[name];
    return `family=${name.replace(/ /g, '+')}${weights ? `:wght@${weights}` : ''}`;
  });
  return `https://fonts.googleapis.com/css2?${families.join('&')}&display=swap`;
}
