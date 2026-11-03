import type {
  CelebrationMessage,
  Invitation,
  InvitationInput,
  MessageInput,
  User,
} from '@/types';

const env = (import.meta as { env?: Record<string, string | undefined> }).env ?? {};
export const API_URL = (env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '');

const TOKEN_KEY = 'shere_token';

function storages(): Storage[] {
  const list: Storage[] = [];
  try {
    if (typeof localStorage !== 'undefined') list.push(localStorage);
  } catch {
    return list;
  }
  try {
    if (typeof sessionStorage !== 'undefined') list.push(sessionStorage);
  } catch {
    return list;
  }
  return list;
}

export function getToken(): string | null {
  for (const store of storages()) {
    try {
      const token = store.getItem(TOKEN_KEY);
      if (token) return token;
    } catch {
      continue;
    }
  }
  return null;
}

export function setToken(token: string | null, remember = false): void {
  for (const store of storages()) {
    try {
      store.removeItem(TOKEN_KEY);
    } catch {
      continue;
    }
  }
  if (!token) return;
  const [local, session] = storages();
  const target = remember ? local : session ?? local;
  try {
    target?.setItem(TOKEN_KEY, token);
  } catch {
    return;
  }
}

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export function errorMessage(body: unknown, fallback: string): string {
  if (body && typeof body === 'object' && 'detail' in body) {
    const detail = (body as { detail: unknown }).detail;
    if (typeof detail === 'string') return detail;
    if (Array.isArray(detail) && detail.length > 0) {
      const first = detail[0] as { msg?: string };
      if (first?.msg) return first.msg.replace(/^Value error, /, '');
    }
  }
  return fallback;
}

export async function request<T>(path: string, options: { method?: string; body?: unknown } = {}): Promise<T> {
  const headers: Record<string, string> = {};
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  if (options.body !== undefined) headers['Content-Type'] = 'application/json';

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method: options.method ?? 'GET',
      headers,
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
    });
  } catch {
    throw new ApiError('Cannot reach the server. Check your internet and try again.', 0);
  }

  if (res.status === 204) return null as T;
  let body: unknown = null;
  try {
    body = await res.json();
  } catch {
    body = null;
  }
  if (!res.ok) throw new ApiError(errorMessage(body, 'Something went wrong. Please try again.'), res.status);
  return body as T;
}

interface AuthResponse {
  access_token: string;
  user: User;
}

export async function signUp(name: string, email: string, password: string, remember = true): Promise<User> {
  const data = await request<AuthResponse>('/api/auth/register', {
    method: 'POST',
    body: { name, email, password, remember },
  });
  setToken(data.access_token, remember);
  return data.user;
}

export async function signIn(email: string, password: string, remember = false): Promise<User> {
  const data = await request<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: { email, password, remember },
  });
  setToken(data.access_token, remember);
  return data.user;
}

export function signOut(): void {
  setToken(null);
}

export function fetchMe(): Promise<User> {
  return request<User>('/api/auth/me');
}

export const fetchUserInvitations = () => request<Invitation[]>('/api/invitations');
export const fetchInvitationById = (id: string) => request<Invitation>(`/api/invitations/${id}`);
export const createInvitation = (input: InvitationInput) =>
  request<Invitation>('/api/invitations', { method: 'POST', body: input });
export const updateInvitation = (id: string, input: InvitationInput) =>
  request<Invitation>(`/api/invitations/${id}`, { method: 'PUT', body: input });
export const publishInvitation = (id: string) =>
  request<Invitation>(`/api/invitations/${id}/publish`, { method: 'POST' });
export const unpublishInvitation = (id: string) =>
  request<Invitation>(`/api/invitations/${id}/unpublish`, { method: 'POST' });
export const deleteInvitation = (id: string) =>
  request<null>(`/api/invitations/${id}`, { method: 'DELETE' });

export const fetchUserMessages = () => request<CelebrationMessage[]>('/api/messages');
export const fetchMessageById = (id: string) => request<CelebrationMessage>(`/api/messages/${id}`);
export const createMessage = (input: MessageInput) =>
  request<CelebrationMessage>('/api/messages', { method: 'POST', body: input });
export const updateMessage = (id: string, input: MessageInput) =>
  request<CelebrationMessage>(`/api/messages/${id}`, { method: 'PUT', body: input });
export const publishMessage = (id: string) =>
  request<CelebrationMessage>(`/api/messages/${id}/publish`, { method: 'POST' });
export const unpublishMessage = (id: string) =>
  request<CelebrationMessage>(`/api/messages/${id}/unpublish`, { method: 'POST' });
export const deleteMessage = (id: string) => request<null>(`/api/messages/${id}`, { method: 'DELETE' });

async function publicItem<T>(path: string): Promise<T | null> {
  try {
    return await request<T>(path);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null;
    throw err;
  }
}

export const fetchPublicInvitation = (slug: string) =>
  publicItem<Invitation>(`/api/public/invitations/${encodeURIComponent(slug)}`);
export const fetchPublicMessage = (slug: string) =>
  publicItem<CelebrationMessage>(`/api/public/messages/${encodeURIComponent(slug)}`);

export interface ContactInput {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const sendContactMessage = (input: ContactInput) =>
  request<{ message: string }>('/api/contact', { method: 'POST', body: input });
