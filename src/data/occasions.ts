import type { Occasion } from '@/types';
import {
  Heart,
  Cake,
  GraduationCap,
  Award,
  Sparkles,
  Baby,
  PartyPopper,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface OccasionInfo {
  key: Occasion;
  label: string;
  description: string;
  icon: LucideIcon;
  gradient: string;
}

export const occasions: OccasionInfo[] = [
  {
    key: 'wedding',
    label: 'Wedding',
    description: 'Celebrate the union of two hearts',
    icon: Heart,
    gradient: 'from-rose-400 to-pink-500',
  },
  {
    key: 'birthday',
    label: 'Birthday',
    description: 'Make their special day unforgettable',
    icon: Cake,
    gradient: 'from-amber-400 to-orange-500',
  },
  {
    key: 'graduation',
    label: 'Graduation',
    description: 'Honor their hard-earned achievement',
    icon: GraduationCap,
    gradient: 'from-blue-400 to-indigo-500',
  },
  {
    key: 'anniversary',
    label: 'Anniversary',
    description: 'Celebrate years of love and togetherness',
    icon: Award,
    gradient: 'from-purple-400 to-rose-500',
  },
  {
    key: 'engagement',
    label: 'Engagement',
    description: 'Share the joy of a new beginning',
    icon: Sparkles,
    gradient: 'from-teal-400 to-cyan-500',
  },
  {
    key: 'baby-shower',
    label: 'Baby Shower',
    description: 'Welcome a new little one into the world',
    icon: Baby,
    gradient: 'from-sky-400 to-blue-500',
  },
  {
    key: 'other',
    label: 'Other',
    description: 'Celebrate any special occasion',
    icon: PartyPopper,
    gradient: 'from-emerald-400 to-green-500',
  },
];

export function getOccasionInfo(key: Occasion): OccasionInfo | undefined {
  return occasions.find((o) => o.key === key);
}

export const occasionLabels: Record<Occasion, string> = {
  wedding: 'Wedding',
  birthday: 'Birthday',
  graduation: 'Graduation',
  anniversary: 'Anniversary',
  engagement: 'Engagement',
  'baby-shower': 'Baby Shower',
  other: 'Other',
};

export const occasionNameField: Record<Occasion, string> = {
  wedding: "Couple's Names",
  birthday: "Celebrant's Name",
  graduation: "Graduate's Name",
  anniversary: "Couple's Names",
  engagement: "Couple's Names",
  'baby-shower': "Parent's Name",
  other: 'Name',
};

export const occasionTitleField: Record<Occasion, string> = {
  wedding: 'Event Title',
  birthday: 'Event Title',
  graduation: 'Ceremony',
  anniversary: 'Event Title',
  engagement: 'Event Title',
  'baby-shower': 'Event Title',
  other: 'Event Title',
};
