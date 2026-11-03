import { useEffect, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Mail, Lock, User as UserIcon, AlertCircle, Eye, EyeOff } from 'lucide-react';
import Button from '@/components/ui/Button';
import FormField, { Input } from '@/components/ui/FormField';
import { useAuth } from '@/hooks/useAuth';
import { loginErrors, signupErrors } from '@/lib/validation';

interface AuthPageProps {
  mode: 'login' | 'signup';
}

export default function AuthPage({ mode }: AuthPageProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, login, register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [slow, setSlow] = useState(false);

  const isSignup = mode === 'signup';
  const next = (location.state as { from?: string } | null)?.from || '/dashboard';
  const errors = isSignup ? signupErrors({ name, email, password }) : loginErrors({ email, password });
  const show = (field: string) => (submitted ? errors[field] : undefined);

  useEffect(() => {
    if (user) navigate(next, { replace: true });
  }, [user, navigate, next]);

  useEffect(() => {
    setSubmitted(false);
    setError(null);
  }, [mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setError(null);
    if (Object.keys(errors).length > 0) return;
    setLoading(true);
    const timer = setTimeout(() => setSlow(true), 4000);
    try {
      if (isSignup) await register(name, email, password, remember);
      else await login(email, password, remember);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      clearTimeout(timer);
      setSlow(false);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-amber-50 to-stone-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center">
            <img src="/shere-moments-logo.png" alt="SHERÉ Moments" className="w-[210px] h-auto" />
          </Link>
          <h1 className="text-2xl font-bold text-stone-800 mt-4">
            {isSignup ? 'Create your account' : 'Welcome back'}
          </h1>
          <p className="text-stone-500 mt-1">
            {isSignup ? 'Save your invitations and share them with a link' : 'Log in to manage your invitations'}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-stone-100 p-6 md:p-8">
          {error && (
            <div role="alert" className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-sm text-red-600">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {isSignup && (
              <FormField label="Name" htmlFor="auth-name" error={show('name')}>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <Input
                    id="auth-name"
                    type="text"
                    autoComplete="name"
                    maxLength={80}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="pl-10"
                    invalid={!!show('name')}
                  />
                </div>
              </FormField>
            )}

            <FormField label="Email" htmlFor="auth-email" error={show('email')}>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <Input
                  id="auth-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="pl-10"
                  invalid={!!show('email')}
                />
              </div>
            </FormField>

            <FormField
              label="Password"
              htmlFor="auth-password"
              error={show('password')}
              hint={isSignup ? 'At least 8 characters, with a letter and a number' : undefined}
            >
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <Input
                  id="auth-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete={isSignup ? 'new-password' : 'current-password'}
                  maxLength={128}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isSignup ? 'Create a password' : 'Your password'}
                  className="pl-10 pr-10"
                  invalid={!!show('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </FormField>

            <label className="flex items-center gap-2 text-sm text-stone-600">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-4 h-4 rounded border-stone-300 text-rose-600 focus:ring-rose-400"
              />
              Keep me logged in for 30 days
            </label>

            {slow && <p className="text-xs text-stone-500">Waking up the server, this can take up to a minute the first time...</p>}

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? 'Please wait...' : isSignup ? 'Create Account' : 'Log In'}
            </Button>
          </form>

          <p className="text-center text-sm text-stone-500 mt-6">
            {isSignup ? 'Already have an account? ' : "Don't have an account? "}
            <Link
              to={isSignup ? '/login' : '/signup'}
              state={location.state}
              className="font-medium text-rose-600 hover:text-rose-700"
            >
              {isSignup ? 'Log in' : 'Sign up'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
