import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fitSize, photoFileError, MAX_PHOTO_BYTES } from '../src/lib/image.ts';

test('only JPG, PNG and WebP photos are allowed', () => {
  assert.equal(photoFileError({ type: 'image/jpeg', size: 1000 }), null);
  assert.equal(photoFileError({ type: 'image/png', size: 1000 }), null);
  assert.equal(photoFileError({ type: 'image/webp', size: 1000 }), null);
  assert.equal(photoFileError({ type: 'image/gif', size: 1000 }), 'Please choose a JPG, PNG or WebP photo.');
  assert.equal(photoFileError({ type: 'application/pdf', size: 1000 }), 'Please choose a JPG, PNG or WebP photo.');
});

test('photos over 10MB are refused', () => {
  assert.equal(photoFileError({ type: 'image/jpeg', size: MAX_PHOTO_BYTES }), null);
  assert.equal(
    photoFileError({ type: 'image/jpeg', size: MAX_PHOTO_BYTES + 1 }),
    'This photo is too big. Please choose one under 10MB.'
  );
});

test('small photos keep their size', () => {
  assert.deepEqual(fitSize(800, 600), { width: 800, height: 600 });
});

test('big photos shrink to 1200 on the longest side', () => {
  assert.deepEqual(fitSize(4000, 3000), { width: 1200, height: 900 });
  assert.deepEqual(fitSize(1080, 1920), { width: 675, height: 1200 });
  assert.deepEqual(fitSize(500, 250, 100), { width: 100, height: 50 });
});
