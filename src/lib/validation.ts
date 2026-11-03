const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export function nameError(name: string): string {
  return name.trim() ? '' : 'Please enter your name.';
}

export function emailError(email: string): string {
  if (!email.trim()) return 'Please enter your email.';
  return EMAIL.test(email.trim()) ? '' : 'Please enter a valid email address.';
}

export function passwordError(password: string): string {
  if (password.length < 8) return 'Password must be at least 8 characters.';
  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) return 'Password must have a letter and a number.';
  return '';
}

export function signupErrors(values: { name: string; email: string; password: string }): Record<string, string> {
  const errors: Record<string, string> = {};
  const checks: [string, string][] = [
    ['name', nameError(values.name)],
    ['email', emailError(values.email)],
    ['password', passwordError(values.password)],
  ];
  for (const [field, message] of checks) if (message) errors[field] = message;
  return errors;
}

export function loginErrors(values: { email: string; password: string }): Record<string, string> {
  const errors: Record<string, string> = {};
  const email = emailError(values.email);
  if (email) errors.email = email;
  if (!values.password) errors.password = 'Please enter your password.';
  return errors;
}

export function contactErrors(values: { name: string; email: string; subject: string; message: string }): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!values.name.trim()) errors.name = 'Please enter your name.';
  const email = emailError(values.email);
  if (email) errors.email = email;
  if (!values.subject.trim()) errors.subject = 'Please add a subject.';
  if (!values.message.trim()) errors.message = 'Please write your message.';
  return errors;
}
