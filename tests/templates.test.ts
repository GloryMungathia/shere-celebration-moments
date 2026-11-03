import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  getInvitationTemplate,
  getInvitationTemplates,
  invitationTemplates,
  slugify,
  templateSeeds,
} from '../src/data/templates.ts';
import {
  getMessageTemplate,
  getMessageTemplates,
  messageCategoryLabels,
  messageTemplates,
} from '../src/data/messageTemplates.ts';

test('slugify makes clean ids', () => {
  assert.equal(slugify('Romantic Elegance'), 'romantic-elegance');
  assert.equal(slugify('  Cake & Candles! '), 'cake-and-candles');
});

test('every invitation template has a unique id', () => {
  const ids = invitationTemplates.map((t) => t.id);
  assert.equal(ids.length, templateSeeds.length);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(ids[0], 'wedding-rose-garden');
});

test('every occasion has at least one template', () => {
  for (const occasion of ['wedding', 'birthday', 'graduation', 'anniversary', 'engagement', 'baby-shower', 'other']) {
    assert.ok(getInvitationTemplates(occasion).length > 0, occasion);
  }
  assert.equal(getInvitationTemplates().length, invitationTemplates.length);
});

test('templates are found by id', () => {
  assert.equal(getInvitationTemplate('wedding-romantic-elegance')?.name, 'Romantic Elegance');
  assert.equal(getInvitationTemplate('nope'), null);
  assert.equal(getInvitationTemplate(null), null);
});

test('every template has the design options the editor needs', () => {
  for (const t of invitationTemplates) {
    for (const key of ['primaryColor', 'accentColor', 'backgroundColor', 'textColor', 'font', 'layout'] as const) {
      assert.ok(t.config[key], `${t.id} ${key}`);
    }
  }
});

test('every message template has a unique id and a known category', () => {
  const ids = messageTemplates.map((t) => t.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const t of messageTemplates) assert.ok(t.category in messageCategoryLabels, t.id);
});

test('message templates are found by id and category', () => {
  const first = messageTemplates[0];
  assert.equal(getMessageTemplate(first.id)?.title, first.title);
  assert.equal(getMessageTemplate('nope'), null);
  assert.ok(getMessageTemplates('birthday').every((t) => t.category === 'birthday'));
  assert.equal(getMessageTemplates().length, messageTemplates.length);
});
