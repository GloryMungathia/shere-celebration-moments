import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User as UserIcon, AlertCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import FormField, { Input } from '@/components/ui/FormField';
import { useAuth } from '@/hooks/useAuth';
import { signUp, signIn } from '@/lib/api';

interface AuthPageProps {
  mode: 'login' | 'signup';
}

export default function AuthPage({ mode }: AuthPageProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isSignup = mode === 'signup';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (isSignup) {
        if (!name.trim()) {
          setError('Please enter your name.');
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setError('Password must be at least 6 characters.');
          setLoading(false);
          return;
        }
        await signUp(email, password, name);
      } else {
        await signIn(email, password);
      }
      navigate('/dashboard');
    } catch (err: any) {
      if (err.message?.includes('already registered')) {
        setError('An account with this email already exists. Try logging in.');
      } else if (err.message?.includes('Invalid login')) {
        setError('Invalid email or password. Please try again.');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-amber-50 to-stone-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center">
            <img
              src="/shere-moments-logo.png"
              alt="SHERÉ Moments"
              className="w-[210px] h-auto"
            />
          </Link>
          <h1 className="text-2xl font-bold text-stone-800 mt-4">
            {isSignup ? 'Create your account' : 'Welcome back'}
          </h1>
          <p className="text-stone-500 mt-1">
            {isSignup
              ? 'Start creating beautiful invitations'
              : 'Sign in to manage your invitations'}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-stone-100 p-6 md:p-8">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-sm text-red-600">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <FormField label="Name">
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="pl-10"
                    required
                  />
                </div>
              </FormField>
            )}

            <FormField label="Email">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="pl-10"
                  required
                />
              </div>
            </FormField>

            <FormField label="Password">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isSignup ? 'At least 6 characters' : 'Your password'}
                  className="pl-10"
                  required
                />
              </div>
            </FormField>

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading
                ? 'Please wait...'
                : isSignup
                  ? 'Create Account'
                  : 'Sign In'}
            </Button>
          </form>

          <p className="text-center text-sm text-stone-500 mt-6">
            {isSignup ? 'Already have an account? ' : "Don't have an account? "}
            <Link
              to={isSignup ? '/login' : '/signup'}
              className="font-medium text-rose-600 hover:text-rose-700"
            >
              {isSignup ? 'Sign in' : 'Sign up'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
