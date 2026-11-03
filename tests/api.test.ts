import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

class MemoryStorage {
  data = new Map<string, string>();
  getItem(key: string) {
    return this.data.has(key) ? this.data.get(key)! : null;
  }
  setItem(key: string, value: string) {
    this.data.set(key, value);
  }
  removeItem(key: string) {
    this.data.delete(key);
  }
  clear() {
    this.data.clear();
  }
}

const local = new MemoryStorage();
const session = new MemoryStorage();
Object.defineProperty(globalThis, 'localStorage', { value: local, configurable: true });
Object.defineProperty(globalThis, 'sessionStorage', { value: session, configurable: true });

const api = await import('../src/lib/api.ts');

type Call = { url: string; init: RequestInit };
let calls: Call[] = [];

function mockFetch(status: number, body?: unknown, raw?: string) {
  globalThis.fetch = (async (url: string, init: RequestInit) => {
    calls.push({ url, init });
    return new Response(raw ?? (body === undefined ? null : JSON.stringify(body)), { status });
  }) as typeof fetch;
}

beforeEach(() => {
  local.clear();
  session.clear();
  calls = [];
});

test('uses localhost when no API address is set', () => {
  assert.equal(api.API_URL, 'http://localhost:8000');
});

test('remembered token goes in local storage', () => {
  api.setToken('abc', true);
  assert.equal(local.getItem('shere_token'), 'abc');
  assert.equal(session.getItem('shere_token'), null);
  assert.equal(api.getToken(), 'abc');
});

test('token that is not remembered goes in session storage', () => {
  api.setToken('xyz', false);
  assert.equal(session.getItem('shere_token'), 'xyz');
  assert.equal(local.getItem('shere_token'), null);
  assert.equal(api.getToken(), 'xyz');
});

test('setting a new token clears the old one and null logs out', () => {
  api.setToken('old', true);
  api.setToken('new', false);
  assert.equal(local.getItem('shere_token'), null);
  api.signOut();
  assert.equal(api.getToken(), null);
});

test('token helpers survive storage that throws', () => {
  const broken = {
    getItem() {
      throw new Error('blocked');
    },
    setItem() {
      throw new Error('blocked');
    },
    removeItem() {
      throw new Error('blocked');
    },
  };
  Object.defineProperty(globalThis, 'localStorage', { value: broken, configurable: true });
  Object.defineProperty(globalThis, 'sessionStorage', { value: broken, configurable: true });
  try {
    assert.doesNotThrow(() => api.setToken('a', true));
    assert.equal(api.getToken(), null);
  } finally {
    Object.defineProperty(globalThis, 'localStorage', { value: local, configurable: true });
    Object.defineProperty(globalThis, 'sessionStorage', { value: session, configurable: true });
  }
});

test('token helpers survive storage that cannot be opened', () => {
  const getter = (name: string) =>
    Object.defineProperty(globalThis, name, {
      get() {
        throw new Error('denied');
      },
      configurable: true,
    });
  getter('localStorage');
  try {
    assert.equal(api.getToken(), null);
    getter('sessionStorage');
    Object.defineProperty(globalThis, 'localStorage', { value: local, configurable: true });
    api.setToken('only-local', false);
    assert.equal(local.getItem('shere_token'), 'only-local');
  } finally {
    Object.defineProperty(globalThis, 'localStorage', { value: local, configurable: true });
    Object.defineProperty(globalThis, 'sessionStorage', { value: session, configurable: true });
  }
});

test('sign up saves the token and sends the remember choice', async () => {
  mockFetch(201, { access_token: 'tok', user: { id: 1, name: 'Amani', email: 'a@b.co' } });
  const user = await api.signUp('Amani', 'a@b.co', 'secret123', true);
  assert.equal(user.name, 'Amani');
  assert.equal(local.getItem('shere_token'), 'tok');
  assert.equal(calls[0].url, 'http://localhost:8000/api/auth/register');
  assert.deepEqual(JSON.parse(calls[0].init.body as string), {
    name: 'Amani',
    email: 'a@b.co',
    password: 'secret123',
    remember: true,
  });
});

test('log in without remember uses session storage', async () => {
  mockFetch(200, { access_token: 'tok2', user: { id: 1, name: 'Amani', email: 'a@b.co' } });
  await api.signIn('a@b.co', 'secret123');
  assert.equal(session.getItem('shere_token'), 'tok2');
  assert.equal(JSON.parse(calls[0].init.body as string).remember, false);
});

test('requests send the token and JSON body', async () => {
  api.setToken('tok', true);
  mockFetch(201, { id: 'i1' });
  await api.createInvitation({ occasion: 'birthday', title: 'Party' });
  const headers = calls[0].init.headers as Record<string, string>;
  assert.equal(headers.Authorization, 'Bearer tok');
  assert.equal(headers['Content-Type'], 'application/json');
  assert.equal(calls[0].init.method, 'POST');
});

test('requests without a token or body send no extra headers', async () => {
  mockFetch(200, []);
  await api.fetchUserMessages();
  assert.deepEqual(calls[0].init.headers, {});
  assert.equal(calls[0].init.method, 'GET');
  assert.equal(calls[0].init.body, undefined);
});

test('204 returns null', async () => {
  mockFetch(204);
  assert.equal(await api.deleteInvitation('i1'), null);
});

test('server errors carry the message and status', async () => {
  mockFetch(409, { detail: 'An account with this email already exists' });
  await assert.rejects(api.signUp('A', 'a@b.co', 'secret123'), (err: InstanceType<typeof api.ApiError>) => {
    assert.equal(err.message, 'An account with this email already exists');
    assert.equal(err.status, 409);
    return true;
  });
});

test('validation errors show the first message', () => {
  const body = { detail: [{ msg: 'Value error, Enter a valid email address' }] };
  assert.equal(api.errorMessage(body, 'x'), 'Enter a valid email address');
  assert.equal(api.errorMessage({ detail: [] }, 'fallback'), 'fallback');
  assert.equal(api.errorMessage({ detail: [{}] }, 'fallback'), 'fallback');
  assert.equal(api.errorMessage(null, 'fallback'), 'fallback');
});

test('error without a JSON body uses a friendly message', async () => {
  mockFetch(500, undefined, 'oops');
  await assert.rejects(api.fetchMe(), /Something went wrong/);
});

test('network failure gives a friendly message', async () => {
  globalThis.fetch = (async () => {
    throw new TypeError('Failed to fetch');
  }) as typeof fetch;
  await assert.rejects(api.fetchMe(), /Cannot reach the server/);
});

test('public pages return null when not found', async () => {
  mockFetch(404, { detail: 'Invitation not found' });
  assert.equal(await api.fetchPublicInvitation('abc'), null);
  assert.equal(await api.fetchPublicMessage('abc'), null);
});

test('public pages still throw other errors', async () => {
  mockFetch(500, { detail: 'Down' });
  await assert.rejects(api.fetchPublicInvitation('abc'), /Down/);
});

test('every helper calls the right path and method', async () => {
  mockFetch(200, {});
  const cases: [() => Promise<unknown>, string, string][] = [
    [() => api.fetchMe(), 'GET', '/api/auth/me'],
    [() => api.fetchUserInvitations(), 'GET', '/api/invitations'],
    [() => api.fetchInvitationById('i1'), 'GET', '/api/invitations/i1'],
    [() => api.updateInvitation('i1', { occasion: 'wedding' }), 'PUT', '/api/invitations/i1'],
    [() => api.publishInvitation('i1'), 'POST', '/api/invitations/i1/publish'],
    [() => api.unpublishInvitation('i1'), 'POST', '/api/invitations/i1/unpublish'],
    [() => api.fetchMessageById('m1'), 'GET', '/api/messages/m1'],
    [() => api.createMessage({ category: 'birthday' }), 'POST', '/api/messages'],
    [() => api.updateMessage('m1', { category: 'birthday' }), 'PUT', '/api/messages/m1'],
    [() => api.publishMessage('m1'), 'POST', '/api/messages/m1/publish'],
    [() => api.unpublishMessage('m1'), 'POST', '/api/messages/m1/unpublish'],
    [() => api.deleteMessage('m1'), 'DELETE', '/api/messages/m1'],
    [() => api.fetchPublicInvitation('a b'), 'GET', '/api/public/invitations/a%20b'],
    [() => api.sendContactMessage({ name: 'A', email: 'a@b.co', subject: 'Hi', message: 'Hello' }), 'POST', '/api/contact'],
  ];
  for (const [call, method, path] of cases) {
    calls = [];
    await call();
    assert.equal(calls[0].init.method, method, path);
    assert.equal(calls[0].url, `http://localhost:8000${path}`);
  }
});
