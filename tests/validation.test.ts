import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  contactErrors,
  emailError,
  loginErrors,
  nameError,
  passwordError,
  signupErrors,
} from '../src/lib/validation.ts';

test('name rules', () => {
  assert.equal(nameError('  '), 'Please enter your name.');
  assert.equal(nameError('Amani'), '');
});

test('email rules', () => {
  assert.equal(emailError(''), 'Please enter your email.');
  assert.equal(emailError('amani@'), 'Please enter a valid email address.');
  assert.equal(emailError(' amani@example.com '), '');
});

test('password rules match the server', () => {
  assert.equal(passwordError('short1'), 'Password must be at least 8 characters.');
  assert.equal(passwordError('onlyletters'), 'Password must have a letter and a number.');
  assert.equal(passwordError('12345678'), 'Password must have a letter and a number.');
  assert.equal(passwordError('secret123'), '');
});

test('sign up form', () => {
  assert.deepEqual(signupErrors({ name: 'Amani', email: 'a@b.co', password: 'secret123' }), {});
  assert.deepEqual(Object.keys(signupErrors({ name: '', email: 'x', password: 'x' })), ['name', 'email', 'password']);
});

test('log in form', () => {
  assert.deepEqual(loginErrors({ email: 'a@b.co', password: 'x' }), {});
  assert.deepEqual(loginErrors({ email: 'bad', password: '' }), {
    email: 'Please enter a valid email address.',
    password: 'Please enter your password.',
  });
});

test('contact form', () => {
  assert.deepEqual(contactErrors({ name: 'A', email: 'a@b.co', subject: 'Hi', message: 'Hello' }), {});
  assert.deepEqual(Object.keys(contactErrors({ name: ' ', email: '', subject: ' ', message: '' })), [
    'name',
    'email',
    'subject',
    'message',
  ]);
});
