import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-stone-50 border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Link to="/" className="flex items-center">
            <img
              src="/shere-moments-logo.png"
              alt="SHERÉ Moments"
              className="w-[120px] h-auto"
            />
          </Link>
          <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm font-medium text-stone-700">
            <Link to="/" className="hover:text-rose-600 transition-colors">
              Home
            </Link>
            <Link to="/occasions" className="hover:text-rose-600 transition-colors">
              Create Invitation
            </Link>
            <Link to="/messages" className="hover:text-rose-600 transition-colors">
              Celebration Messages
            </Link>
            <Link to="/about" className="hover:text-rose-600 transition-colors">
              About
            </Link>
            <Link to="/contact" className="hover:text-rose-600 transition-colors">
              Contact
            </Link>
          </nav>
        </div>
        <div className="mt-6 pt-6 border-t border-stone-200 text-center text-sm text-stone-500">
          <p>Crafted with care for life's special moments.</p>
        </div>
      </div>
    </footer>
  );
}
