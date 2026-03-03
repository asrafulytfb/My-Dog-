import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Heart, Menu, X, User as UserIcon, LogOut } from 'lucide-react';
import { cn } from '../lib/utils';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

export default function Header() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [user, setUser] = React.useState<User | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Blog', href: '/blog' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-primary p-1.5 rounded-lg">
              <Heart className="w-6 h-6 text-white fill-current" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              Hope<span className="text-primary">Voice</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  location.pathname === link.href ? "text-primary" : "text-slate-600"
                )}
              >
                {link.name}
              </Link>
            ))}
            
            <div className="h-6 w-px bg-slate-100" />

            {user ? (
              <div className="flex items-center gap-4">
                <Link 
                  to={user.app_metadata?.role === 'admin' ? "/admin/dashboard" : "/"}
                  className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-primary"
                >
                  <UserIcon className="w-4 h-4" />
                  {user.user_metadata?.full_name || 'My Account'}
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-slate-400 hover:text-red-500 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-primary">
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-bold text-primary hover:underline"
                >
                  Join Us
                </Link>
              </div>
            )}

            <Link
              to="/donate"
              className="bg-primary text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-primary-hover transition-all shadow-md hover:shadow-lg"
            >
              Donate Now
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 hover:text-primary p-2"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-slate-100 animate-in slide-in-from-top duration-200">
          <div className="px-4 pt-2 pb-6 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "block px-3 py-2 rounded-md text-base font-medium",
                  location.pathname === link.href
                    ? "bg-secondary text-primary"
                    : "text-slate-600 hover:bg-slate-50 hover:text-primary"
                )}
              >
                {link.name}
              </Link>
            ))}
            
            <div className="border-t border-slate-100 my-2 pt-2">
              {user ? (
                <>
                  <Link
                    to={user.app_metadata?.role === 'admin' ? "/admin/dashboard" : "/"}
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium text-slate-600"
                  >
                    {user.user_metadata?.full_name || 'My Account'}
                  </Link>
                  <button
                    onClick={() => { handleLogout(); setIsOpen(false); }}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-500"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium text-slate-600"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium text-primary"
                  >
                    Join Us
                  </Link>
                </>
              )}
            </div>

            <div className="pt-4">
              <Link
                to="/donate"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center bg-primary text-white px-5 py-3 rounded-xl text-base font-semibold hover:bg-primary-hover transition-all"
              >
                Donate Now
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
