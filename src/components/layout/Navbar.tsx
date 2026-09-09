import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LayoutDashboard, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-stone-100">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center group">
            <img
              src="/shere-moments-logo.png"
              alt="SHERÉ Moments"
              className="hidden sm:block w-[140px] h-auto"
            />
            <img
              src="/shere-moments-icon.png"
              alt="SHERÉ Moments"
              className="block sm:hidden w-8 h-8 object-contain"
            />
          </Link>

          <div className="hidden md:flex items-center gap-1">
            <Link
              to="/occasions"
              className="px-3 py-2 text-sm font-medium text-stone-600 hover:text-rose-600 transition-colors rounded-lg hover:bg-rose-50"
            >
              Create Invitation
            </Link>
            <Link
              to="/messages"
              className="px-3 py-2 text-sm font-medium text-stone-600 hover:text-rose-600 transition-colors rounded-lg hover:bg-rose-50"
            >
              Celebration Messages
            </Link>
            <Link
              to="/about"
              className="px-3 py-2 text-sm font-medium text-stone-600 hover:text-rose-600 transition-colors rounded-lg hover:bg-rose-50"
            >
              About
            </Link>
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="ml-2 inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100 rounded-full transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <button
                  onClick={handleSignOut}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-stone-600 hover:bg-stone-100 rounded-full transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-stone-600 hover:text-rose-600 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="ml-1 px-5 py-2 text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-full transition-colors shadow-sm"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-lg hover:bg-stone-100"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {open && (
          <div className="md:hidden border-t border-stone-100 py-3 space-y-1">
            <Link
              to="/occasions"
              onClick={() => setOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-stone-600 hover:bg-rose-50 rounded-lg"
            >
              Create Invitation
            </Link>
            <Link
              to="/messages"
              onClick={() => setOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-stone-600 hover:bg-rose-50 rounded-lg"
            >
              Celebration Messages
            </Link>
            <Link
              to="/about"
              onClick={() => setOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-stone-600 hover:bg-rose-50 rounded-lg"
            >
              About
            </Link>
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setOpen(false)}
                  className="block px-3 py-2 text-sm font-medium text-stone-600 hover:bg-rose-50 rounded-lg"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleSignOut();
                    setOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-sm font-medium text-stone-600 hover:bg-rose-50 rounded-lg"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex gap-2 px-3 pt-2">
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="flex-1 text-center px-4 py-2 text-sm font-medium text-stone-600 border border-stone-200 rounded-full"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setOpen(false)}
                  className="flex-1 text-center px-4 py-2 text-sm font-medium text-white bg-rose-600 rounded-full"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
