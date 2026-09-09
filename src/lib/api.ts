import { supabase } from './supabase';
import type {
  Invitation,
  CelebrationMessage,
  InvitationInput,
  MessageInput,
  InvitationTemplate,
  MessageTemplate,
} from '@/types';

// ---------- Templates ----------

export async function fetchInvitationTemplates(
  occasion?: string
): Promise<InvitationTemplate[]> {
  let query = supabase
    .from('invitation_templates')
    .select('*')
    .order('created_at', { ascending: true });
  if (occasion) query = query.eq('occasion', occasion);
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function fetchMessageTemplates(
  category?: string
): Promise<MessageTemplate[]> {
  let query = supabase
    .from('message_templates')
    .select('*')
    .order('created_at', { ascending: true });
  if (category) query = query.eq('category', category);
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

// ---------- Invitations ----------

export async function fetchUserInvitations(): Promise<Invitation[]> {
  const { data, error } = await supabase
    .from('invitations')
    .select('*')
    .order('updated_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function fetchInvitationById(id: string): Promise<Invitation | null> {
  const { data, error } = await supabase
    .from('invitations')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function fetchPublicInvitation(slug: string): Promise<Invitation | null> {
  const { data, error } = await supabase
    .from('invitations')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function createInvitation(
  input: InvitationInput
): Promise<Invitation> {
  const { data, error } = await supabase
    .from('invitations')
    .insert(input)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateInvitation(
  id: string,
  input: Partial<InvitationInput>
): Promise<Invitation> {
  const { data, error } = await supabase
    .from('invitations')
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteInvitation(id: string): Promise<void> {
  const { error } = await supabase.from('invitations').delete().eq('id', id);
  if (error) throw error;
}

export async function publishInvitation(id: string): Promise<Invitation> {
  const slug = generateSlug();
  const { data, error } = await supabase
    .from('invitations')
    .update({ status: 'published', slug, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ---------- Celebration Messages ----------

export async function fetchUserMessages(): Promise<CelebrationMessage[]> {
  const { data, error } = await supabase
    .from('celebration_messages')
    .select('*')
    .order('updated_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function fetchMessageById(id: string): Promise<CelebrationMessage | null> {
  const { data, error } = await supabase
    .from('celebration_messages')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function fetchPublicMessage(slug: string): Promise<CelebrationMessage | null> {
  const { data, error } = await supabase
    .from('celebration_messages')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function createMessage(input: MessageInput): Promise<CelebrationMessage> {
  const { data, error } = await supabase
    .from('celebration_messages')
    .insert(input)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateMessage(
  id: string,
  input: Partial<MessageInput>
): Promise<CelebrationMessage> {
  const { data, error } = await supabase
    .from('celebration_messages')
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteMessage(id: string): Promise<void> {
  const { error } = await supabase
    .from('celebration_messages')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

export async function publishMessage(id: string): Promise<CelebrationMessage> {
  const slug = generateSlug();
  const { data, error } = await supabase
    .from('celebration_messages')
    .update({ status: 'published', slug, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ---------- Auth ----------

export async function signUp(email: string, password: string, name: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } },
  });
  if (error) throw error;
  return data;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

// ---------- Image Upload ----------

export async function uploadPhoto(file: File, userId: string): Promise<string> {
  const ext = file.name.split('.').pop() || 'jpg';
  const path = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from('invitation-photos').upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  });
  if (error) throw error;
  const { data } = supabase.storage.from('invitation-photos').getPublicUrl(path);
  return data.publicUrl;
}

// ---------- Helpers ----------

function generateSlug(): string {
  return Math.random().toString(36).substring(2, 8) + Date.now().toString(36).slice(-4);
}
