export type Occasion =
  | 'wedding'
  | 'birthday'
  | 'graduation'
  | 'anniversary'
  | 'engagement'
  | 'baby-shower'
  | 'other';

export type TemplateStyle =
  | 'elegant'
  | 'minimal'
  | 'floral'
  | 'modern'
  | 'classic'
  | 'festive';

export type MessageCategory =
  | 'birthday'
  | 'graduation'
  | 'wedding'
  | 'anniversary'
  | 'engagement'
  | 'baby'
  | 'congratulations'
  | 'thank-you'
  | 'other';

export type ItemStatus = 'draft' | 'published';

export interface InvitationTemplate {
  id: string;
  name: string;
  occasion: Occasion;
  style: TemplateStyle;
  config: TemplateConfig;
  starter?: InvitationExtras;
  created_at?: string;
}

export interface TemplateConfig {
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  font: string;
  layout: 'centered' | 'split' | 'top-photo' | 'full-photo' | 'minimal' | 'card';
  supportsPhoto: boolean;
  decorative: string;
  borderRadius: string;
  headingFont?: string;
  accentFont?: string;
  pattern?: string;
  emblem?: 'show' | 'none';
}

export interface EventDetails {
  label?: string;
  date?: string | null;
  time?: string;
  venue?: string;
  address?: string;
}

export interface InvitationExtras {
  intro?: string;
  event_label?: string;
  closing?: string;
  signature?: string;
  second_event?: EventDetails | null;
}

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Invitation {
  id: string;
  occasion: Occasion;
  template_id: string | null;
  title: string | null;
  name: string | null;
  event_date: string | null;
  event_time: string | null;
  venue: string | null;
  address: string | null;
  message: string | null;
  photo_url: string | null;
  customization: Partial<TemplateConfig>;
  extras?: InvitationExtras;
  slug: string | null;
  status: ItemStatus;
  created_at?: string;
  updated_at?: string;
}

export interface MessageTemplate {
  id: string;
  category: MessageCategory;
  title: string;
  message: string;
  created_at?: string;
}

export interface CelebrationMessage {
  id: string;
  category: MessageCategory;
  recipient_name: string | null;
  title: string | null;
  message: string | null;
  sender_name: string | null;
  font: string | null;
  slug: string | null;
  status: ItemStatus;
  created_at?: string;
  updated_at?: string;
}

export interface InvitationInput {
  occasion: Occasion;
  template_id?: string | null;
  title?: string;
  name?: string;
  event_date?: string | null;
  event_time?: string;
  venue?: string;
  address?: string;
  message?: string;
  photo_url?: string | null;
  customization?: Partial<TemplateConfig>;
  extras?: InvitationExtras;
}

export interface MessageInput {
  category: MessageCategory;
  recipient_name?: string;
  title?: string;
  message?: string;
  sender_name?: string;
  font?: string | null;
}
