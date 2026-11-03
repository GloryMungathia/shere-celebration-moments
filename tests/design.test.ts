import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  allFonts,
  fontName,
  fontValue,
  getFontGroups,
  getFontOptions,
  getMessageFontGroups,
  getMessageFontOptions,
  googleFontsUrl,
  messageFonts,
  occasionFonts,
} from '../src/data/fonts.ts';
import { isPattern, patternIds, patterns, recommendedPatterns, scatter, sortedPatterns } from '../src/data/patterns.ts';
import { formatEventDate, formatEventTime } from '../src/lib/format.ts';
import { cardSeeds, invitationTemplates } from '../src/data/templates.ts';

test('the font library has many fonts and no repeats', () => {
  assert.ok(allFonts.length >= 40);
  assert.equal(new Set(allFonts).size, allFonts.length);
});

test('font values carry a fallback', () => {
  assert.equal(fontValue('Great Vibes'), "'Great Vibes', cursive");
  assert.equal(fontValue('Lora'), "'Lora', serif");
  assert.equal(fontValue('Poppins'), "'Poppins', sans-serif");
  assert.equal(fontValue('Unknown Font'), "'Unknown Font', sans-serif");
});

test('font names are read from values', () => {
  assert.equal(fontName("'Pinyon Script', cursive"), 'Pinyon Script');
  assert.equal(fontName('Georgia, serif'), 'Georgia');
  assert.equal(fontName(null), '');
});

test('every recommended font exists in the library', () => {
  for (const roles of Object.values(occasionFonts)) {
    for (const list of Object.values(roles)) for (const name of list) assert.ok(allFonts.includes(name), name);
  }
  for (const list of Object.values(messageFonts)) for (const name of list) assert.ok(allFonts.includes(name), name);
});

test('font groups put recommended fonts first and list every font once', () => {
  const groups = getFontGroups('graduation', 'heading');
  assert.equal(groups[0].label, 'Recommended');
  assert.equal(groups[0].options[0].label, 'Great Vibes');
  const names = groups.flatMap((g) => g.options.map((o) => o.label));
  assert.equal(names.length, allFonts.length);
  assert.equal(new Set(names).size, names.length);
  assert.equal(getFontOptions('wedding').length, allFonts.length);
});

test('message fonts are grouped too', () => {
  const groups = getMessageFontGroups('thank-you');
  assert.deepEqual(groups[0].options.map((o) => o.label), ['Dancing Script', 'Lora', 'Merriweather', 'Open Sans', 'PT Serif']);
  assert.equal(getMessageFontOptions('baby').length, allFonts.length);
});

test('the Google Fonts link loads every font', () => {
  const url = googleFontsUrl();
  for (const name of allFonts) assert.ok(url.includes(`family=${name.replace(/ /g, '+')}`), name);
  assert.ok(url.includes('family=Great+Vibes&'));
  assert.ok(url.includes('family=Lato:wght@400;700'));
});

test('every template uses fonts from the library', () => {
  for (const t of invitationTemplates) {
    for (const value of [t.config.font, t.config.headingFont, t.config.accentFont]) {
      if (value) assert.ok(allFonts.includes(fontName(value)), `${t.id} ${value}`);
    }
  }
});

test('patterns have unique ids and the none option', () => {
  assert.equal(new Set(patternIds).size, patterns.length);
  assert.equal(patterns[0].id, 'none');
  assert.ok(isPattern('florals'));
  assert.ok(!isPattern('zebra'));
  assert.ok(!isPattern(5));
});

test('pattern list puts recommended patterns first without repeats', () => {
  for (const occasion of Object.keys(recommendedPatterns) as (keyof typeof recommendedPatterns)[]) {
    const list = sortedPatterns(occasion);
    assert.equal(list.length, patterns.length);
    assert.equal(list[0].id, 'none');
    assert.equal(list[1].id, recommendedPatterns[occasion][0]);
    assert.equal(new Set(list.map((p) => p.id)).size, list.length);
  }
});

test('scatter is the same every time and keeps the middle clear', () => {
  const a = scatter(20, 7);
  assert.deepEqual(a, scatter(20, 7));
  assert.equal(a.length, 20);
  for (const p of a) assert.ok(!(p.x > 90 && p.x < 310 && p.y > 90 && p.y < 470));
  assert.ok(scatter(30, 3, false).some((p) => p.x > 90 && p.x < 310 && p.y > 90 && p.y < 470));
});

test('card templates use known patterns and have starter text', () => {
  assert.equal(cardSeeds.length, 9);
  for (const seed of cardSeeds) {
    assert.equal(seed.config.layout, 'card');
    assert.ok(isPattern(seed.config.pattern), seed.name);
    assert.ok(seed.starter?.event_label, seed.name);
  }
  const crimson = cardSeeds.find((s) => s.name === 'Crimson Ceremony');
  assert.ok(crimson?.starter?.second_event);
});

test('event dates read like a card', () => {
  assert.equal(formatEventDate('2026-11-13'), 'Friday, 13 November 2026');
  assert.equal(formatEventDate(''), '');
  assert.equal(formatEventDate(null), '');
  assert.equal(formatEventDate('soon'), 'soon');
});

test('event times use AM and PM', () => {
  assert.equal(formatEventTime('14:30'), '2:30 PM');
  assert.equal(formatEventTime('00:15'), '12:15 AM');
  assert.equal(formatEventTime('12:00'), '12:00 PM');
  assert.equal(formatEventTime('9:05'), '9:05 AM');
  assert.equal(formatEventTime('25:00'), '25:00');
  assert.equal(formatEventTime('noon'), 'noon');
  assert.equal(formatEventTime(undefined), '');
});
