import type { Occasion, TemplateStyle, TemplateConfig, InvitationTemplate, InvitationExtras } from '@/types';

export interface TemplateSeed {
  name: string;
  occasion: Occasion;
  style: TemplateStyle;
  config: TemplateConfig;
  starter?: InvitationExtras;
}

const card = (config: Omit<TemplateConfig, 'layout' | 'decorative' | 'borderRadius'> & Partial<TemplateConfig>): TemplateConfig => ({
  layout: 'card',
  decorative: '',
  borderRadius: '6px',
  emblem: 'show',
  ...config,
});

export const cardSeeds: TemplateSeed[] = [
  {
    name: 'Rose Garden',
    occasion: 'wedding',
    style: 'floral',
    config: card({
      primaryColor: '#9f4b5b',
      accentColor: '#b08d57',
      backgroundColor: '#fdf8f3',
      textColor: '#44403c',
      font: "'Cormorant Garamond', serif",
      headingFont: "'Great Vibes', cursive",
      accentFont: "'Great Vibes', cursive",
      supportsPhoto: false,
      pattern: 'florals',
      emblem: 'none',
    }),
    starter: { intro: 'Together with their families', event_label: 'The Wedding', closing: 'Love makes life beautiful.' },
  },
  {
    name: 'Balloon Party',
    occasion: 'birthday',
    style: 'festive',
    config: card({
      primaryColor: '#1e3a8a',
      accentColor: '#ec4899',
      backgroundColor: '#ffffff',
      textColor: '#334155',
      font: "'Poppins', sans-serif",
      headingFont: "'Pacifico', cursive",
      accentFont: "'Pacifico', cursive",
      supportsPhoto: true,
      pattern: 'balloons',
      emblem: 'none',
    }),
    starter: { intro: "Let's celebrate", event_label: 'Birthday Party', closing: 'Come hungry, leave happy!' },
  },
  {
    name: 'Navy & Gold',
    occasion: 'graduation',
    style: 'elegant',
    config: card({
      primaryColor: '#e7c873',
      accentColor: '#c9a54a',
      backgroundColor: '#13254a',
      textColor: '#f1f5f9',
      font: "'Montserrat', sans-serif",
      headingFont: "'Great Vibes', cursive",
      accentFont: "'Great Vibes', cursive",
      supportsPhoto: false,
      pattern: 'laurels',
    }),
    starter: { intro: "You're invited to", event_label: 'Graduation Ceremony', closing: 'Big dreams. Bright future.' },
  },
  {
    name: 'Crimson Ceremony',
    occasion: 'graduation',
    style: 'classic',
    config: card({
      primaryColor: '#8b1c24',
      accentColor: '#1c1917',
      backgroundColor: '#ffffff',
      textColor: '#292524',
      font: "'EB Garamond', serif",
      headingFont: "'Great Vibes', cursive",
      accentFont: "'Pinyon Script', cursive",
      supportsPhoto: false,
      pattern: 'classic',
      borderRadius: '0px',
    }),
    starter: {
      intro: 'Graduation invite',
      event_label: 'Graduation Ceremony',
      closing: 'Thank you for being part of my story.',
      second_event: { label: 'Celebration Party', date: null, time: '', venue: '', address: '' },
    },
  },
  {
    name: 'Blush Roses',
    occasion: 'anniversary',
    style: 'floral',
    config: card({
      primaryColor: '#be3455',
      accentColor: '#d4a373',
      backgroundColor: '#fff5f5',
      textColor: '#57534e',
      font: "'Lora', serif",
      headingFont: "'Allura', cursive",
      accentFont: "'Dancing Script', cursive",
      supportsPhoto: true,
      pattern: 'florals',
      emblem: 'none',
    }),
    starter: { intro: 'Happy anniversary', event_label: 'Anniversary Dinner', closing: 'Celebrating love, today and always.' },
  },
  {
    name: 'Lavender Bloom',
    occasion: 'engagement',
    style: 'floral',
    config: card({
      primaryColor: '#6d4c9f',
      accentColor: '#a78bfa',
      backgroundColor: '#faf7ff',
      textColor: '#4c4560',
      font: "'Josefin Sans', sans-serif",
      headingFont: "'Allura', cursive",
      accentFont: "'Great Vibes', cursive",
      supportsPhoto: true,
      pattern: 'florals',
      emblem: 'none',
    }),
    starter: { intro: "You're invited to our engagement", event_label: 'Engagement Party', closing: 'Together is a beautiful place to be.' },
  },
  {
    name: 'Little Bear',
    occasion: 'baby-shower',
    style: 'festive',
    config: card({
      primaryColor: '#a4703f',
      accentColor: '#93c5fd',
      backgroundColor: '#f5faff',
      textColor: '#334155',
      font: "'Quicksand', sans-serif",
      headingFont: "'Pacifico', cursive",
      accentFont: "'Dancing Script', cursive",
      supportsPhoto: false,
      pattern: 'clouds',
      borderRadius: '18px',
    }),
    starter: { intro: 'Honouring', event_label: 'Baby Shower', closing: 'A little one is on the way!' },
  },
  {
    name: 'Evening Lights',
    occasion: 'other',
    style: 'festive',
    config: card({
      primaryColor: '#f3d27a',
      accentColor: '#6b9a5b',
      backgroundColor: '#163a2b',
      textColor: '#f5f5f4',
      font: "'Raleway', sans-serif",
      headingFont: "'Lobster', cursive",
      accentFont: "'Satisfy', cursive",
      supportsPhoto: false,
      pattern: 'lights',
      emblem: 'none',
    }),
    starter: { intro: "You're invited to a", event_label: 'The Celebration', closing: "Let's make it memorable!" },
  },
  {
    name: 'Confetti Pop',
    occasion: 'other',
    style: 'festive',
    config: card({
      primaryColor: '#7c3aed',
      accentColor: '#f59e0b',
      backgroundColor: '#fffdf7',
      textColor: '#3f3f46',
      font: "'Poppins', sans-serif",
      headingFont: "'Righteous', sans-serif",
      accentFont: "'Satisfy', cursive",
      supportsPhoto: true,
      pattern: 'confetti',
      emblem: 'none',
    }),
    starter: { intro: 'Join us for', event_label: 'Party Details', closing: 'See you there!' },
  },
];

export const classicSeeds: TemplateSeed[] = [
  // ---- Wedding ----
  {
    name: 'Romantic Elegance',
    occasion: 'wedding',
    style: 'elegant',
    config: {
      primaryColor: '#be123c',
      accentColor: '#fbbf24',
      backgroundColor: '#fef7f0',
      textColor: '#44403c',
      font: "'Playfair Display', serif",
      layout: 'centered',
      supportsPhoto: true,
      decorative: '❀',
      borderRadius: '16px',
    },
  },
  {
    name: 'Minimal Vows',
    occasion: 'wedding',
    style: 'minimal',
    config: {
      primaryColor: '#1c1917',
      accentColor: '#a8a29e',
      backgroundColor: '#fafaf9',
      textColor: '#292524',
      font: "'Cormorant Garamond', serif",
      layout: 'minimal',
      supportsPhoto: false,
      decorative: '—',
      borderRadius: '4px',
    },
  },
  {
    name: 'Garden Bloom',
    occasion: 'wedding',
    style: 'floral',
    config: {
      primaryColor: '#9d174d',
      accentColor: '#65a30d',
      backgroundColor: '#f7fee7',
      textColor: '#3f3f46',
      font: "'Great Vibes', cursive",
      layout: 'top-photo',
      supportsPhoto: true,
      decorative: '✿',
      borderRadius: '24px',
    },
  },
  {
    name: 'Modern Celebration',
    occasion: 'wedding',
    style: 'modern',
    config: {
      primaryColor: '#0f766e',
      accentColor: '#f59e0b',
      backgroundColor: '#f0fdfa',
      textColor: '#134e4a',
      font: "'Cinzel', serif",
      layout: 'split',
      supportsPhoto: true,
      decorative: '◆',
      borderRadius: '0px',
    },
  },
  // ---- Birthday ----
  {
    name: 'Festive Confetti',
    occasion: 'birthday',
    style: 'festive',
    config: {
      primaryColor: '#c026d3',
      accentColor: '#fbbf24',
      backgroundColor: '#fdf4ff',
      textColor: '#3f3f46',
      font: "'Fredoka', sans-serif",
      layout: 'centered',
      supportsPhoto: true,
      decorative: '🎉',
      borderRadius: '20px',
    },
  },
  {
    name: 'Classic Birthday',
    occasion: 'birthday',
    style: 'classic',
    config: {
      primaryColor: '#1e3a8a',
      accentColor: '#f59e0b',
      backgroundColor: '#fefce8',
      textColor: '#1c1917',
      font: "'Pacifico', cursive",
      layout: 'centered',
      supportsPhoto: true,
      decorative: '★',
      borderRadius: '12px',
    },
  },
  {
    name: 'Minimal Birthday',
    occasion: 'birthday',
    style: 'minimal',
    config: {
      primaryColor: '#dc2626',
      accentColor: '#fca5a5',
      backgroundColor: '#ffffff',
      textColor: '#1c1917',
      font: "'Baloo 2', sans-serif",
      layout: 'minimal',
      supportsPhoto: false,
      decorative: '•',
      borderRadius: '4px',
    },
  },
  // ---- Graduation ----
  {
    name: 'Scholar Elegance',
    occasion: 'graduation',
    style: 'elegant',
    config: {
      primaryColor: '#1e3a8a',
      accentColor: '#fbbf24',
      backgroundColor: '#f8fafc',
      textColor: '#1e293b',
      font: "'Montserrat', sans-serif",
      layout: 'centered',
      supportsPhoto: true,
      decorative: '🎓',
      borderRadius: '16px',
    },
  },
  {
    name: 'Modern Graduate',
    occasion: 'graduation',
    style: 'modern',
    config: {
      primaryColor: '#0f766e',
      accentColor: '#fde68a',
      backgroundColor: '#ecfdf5',
      textColor: '#134e4a',
      font: "'Poppins', sans-serif",
      layout: 'split',
      supportsPhoto: true,
      decorative: '◆',
      borderRadius: '0px',
    },
  },
  {
    name: 'Classic Ceremony',
    occasion: 'graduation',
    style: 'classic',
    config: {
      primaryColor: '#7c2d12',
      accentColor: '#fbbf24',
      backgroundColor: '#fffbeb',
      textColor: '#44403c',
      font: "'Bebas Neue', sans-serif",
      layout: 'centered',
      supportsPhoto: false,
      decorative: '★',
      borderRadius: '12px',
    },
  },
  // ---- Anniversary ----
  {
    name: 'Golden Romance',
    occasion: 'anniversary',
    style: 'elegant',
    config: {
      primaryColor: '#b45309',
      accentColor: '#fbbf24',
      backgroundColor: '#fffbeb',
      textColor: '#44403c',
      font: "'Cormorant Garamond', serif",
      layout: 'centered',
      supportsPhoto: true,
      decorative: '❀',
      borderRadius: '16px',
    },
  },
  {
    name: 'Timeless Love',
    occasion: 'anniversary',
    style: 'classic',
    config: {
      primaryColor: '#831843',
      accentColor: '#f9a8d4',
      backgroundColor: '#fdf2f8',
      textColor: '#500724',
      font: "'Dancing Script', cursive",
      layout: 'centered',
      supportsPhoto: true,
      decorative: '♥',
      borderRadius: '12px',
    },
  },
  {
    name: 'Modern Milestone',
    occasion: 'anniversary',
    style: 'modern',
    config: {
      primaryColor: '#4338ca',
      accentColor: '#fbbf24',
      backgroundColor: '#eef2ff',
      textColor: '#312e81',
      font: "'Lora', serif",
      layout: 'split',
      supportsPhoto: true,
      decorative: '◆',
      borderRadius: '0px',
    },
  },
  // ---- Engagement ----
  {
    name: 'Sparkling Promise',
    occasion: 'engagement',
    style: 'elegant',
    config: {
      primaryColor: '#0e7490',
      accentColor: '#fbbf24',
      backgroundColor: '#ecfeff',
      textColor: '#164e63',
      font: "'Allura', cursive",
      layout: 'centered',
      supportsPhoto: true,
      decorative: '✦',
      borderRadius: '16px',
    },
  },
  {
    name: 'Floral Engagement',
    occasion: 'engagement',
    style: 'floral',
    config: {
      primaryColor: '#be185d',
      accentColor: '#84cc16',
      backgroundColor: '#fefce8',
      textColor: '#3f3f46',
      font: "'Playfair Display', serif",
      layout: 'top-photo',
      supportsPhoto: true,
      decorative: '✿',
      borderRadius: '24px',
    },
  },
  {
    name: 'Minimal Spark',
    occasion: 'engagement',
    style: 'minimal',
    config: {
      primaryColor: '#0f172a',
      accentColor: '#cbd5e1',
      backgroundColor: '#f8fafc',
      textColor: '#1e293b',
      font: "'Montserrat', sans-serif",
      layout: 'minimal',
      supportsPhoto: false,
      decorative: '—',
      borderRadius: '4px',
    },
  },
  // ---- Baby Shower ----
  {
    name: 'Sweet Welcome',
    occasion: 'baby-shower',
    style: 'floral',
    config: {
      primaryColor: '#0369a1',
      accentColor: '#fda4af',
      backgroundColor: '#f0f9ff',
      textColor: '#0c4a6e',
      font: "'Nunito', sans-serif",
      layout: 'centered',
      supportsPhoto: true,
      decorative: '🍼',
      borderRadius: '24px',
    },
  },
  {
    name: 'Modern Baby',
    occasion: 'baby-shower',
    style: 'modern',
    config: {
      primaryColor: '#be185d',
      accentColor: '#c7d2fe',
      backgroundColor: '#fdf2f8',
      textColor: '#831843',
      font: "'Quicksand', sans-serif",
      layout: 'split',
      supportsPhoto: true,
      decorative: '◆',
      borderRadius: '0px',
    },
  },
  {
    name: 'Classic Little One',
    occasion: 'baby-shower',
    style: 'classic',
    config: {
      primaryColor: '#4338ca',
      accentColor: '#fef3c7',
      backgroundColor: '#eef2ff',
      textColor: '#312e81',
      font: "'Comfortaa', sans-serif",
      layout: 'centered',
      supportsPhoto: false,
      decorative: '★',
      borderRadius: '12px',
    },
  },
  // ---- Other ----
  {
    name: 'Versatile Elegance',
    occasion: 'other',
    style: 'elegant',
    config: {
      primaryColor: '#9333ea',
      accentColor: '#fbbf24',
      backgroundColor: '#faf5ff',
      textColor: '#3b0764',
      font: "'Raleway', sans-serif",
      layout: 'centered',
      supportsPhoto: true,
      decorative: '✦',
      borderRadius: '16px',
    },
  },
  {
    name: 'Festive Party',
    occasion: 'other',
    style: 'festive',
    config: {
      primaryColor: '#dc2626',
      accentColor: '#fbbf24',
      backgroundColor: '#fef2f2',
      textColor: '#7f1d1d',
      font: "'Lobster', cursive",
      layout: 'centered',
      supportsPhoto: true,
      decorative: '🎉',
      borderRadius: '20px',
    },
  },
  {
    name: 'Clean & Simple',
    occasion: 'other',
    style: 'minimal',
    config: {
      primaryColor: '#1c1917',
      accentColor: '#a8a29e',
      backgroundColor: '#fafaf9',
      textColor: '#292524',
      font: "'Oswald', sans-serif",
      layout: 'minimal',
      supportsPhoto: false,
      decorative: '•',
      borderRadius: '4px',
    },
  },
];

export const templateSeeds: TemplateSeed[] = [...cardSeeds, ...classicSeeds];

export const defaultTemplateConfig: TemplateConfig = templateSeeds[0].config;

export const colorPresets = [
  '#be123c', '#c026d3', '#9333ea', '#4338ca', '#1e3a8a',
  '#0e7490', '#0f766e', '#15803d', '#b45309', '#dc2626',
  '#1c1917', '#7c2d12',
];

export const backgroundColorPresets = [
  '#fef7f0', '#fdf4ff', '#fefce8', '#f0fdfa', '#f8fafc',
  '#fffbeb', '#fdf2f8', '#eef2ff', '#ecfeff', '#f0f9ff',
  '#faf5ff', '#fef2f2', '#ffffff', '#fafaf9',
];

export const textColorPresets = [
  '#44403c', '#3f3f46', '#1c1917', '#292524', '#1e293b',
  '#134e4a', '#0c4a6e', '#500724', '#312e81', '#3b0764',
  '#7f1d1d', '#164e63',
];

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export const invitationTemplates: InvitationTemplate[] = templateSeeds.map((seed) => ({
  id: `${seed.occasion}-${slugify(seed.name)}`,
  ...seed,
}));

export function getInvitationTemplates(occasion?: string): InvitationTemplate[] {
  return occasion ? invitationTemplates.filter((t) => t.occasion === occasion) : invitationTemplates;
}

export function getInvitationTemplate(id: string | null | undefined): InvitationTemplate | null {
  return invitationTemplates.find((t) => t.id === id) ?? null;
}
