import { Link, useLocation } from 'react-router-dom';
import { Fingerprint, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../../utils/cn';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Dashboard', path: '/dashboard' },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <Fingerprint className="w-8 h-8 text-primary-500" />
              <span className="text-xl font-bold tracking-tight">VoteAI</span>
            </Link>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navLinks.map((link) => {
                // Don't show Dashboard if not logged in
                if (link.path === '/dashboard' && !user) return null;
                
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={cn(
                      "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      location.pathname === link.path 
                        ? "bg-primary-500/10 text-primary-400" 
                        : "text-gray-300 hover:bg-surfaceHover hover:text-white"
                    )}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {user ? (
            <div className="hidden md:flex items-center gap-4">
              <span className="text-sm text-gray-300">Welcome, <span className="text-white font-medium">{user.fullName}</span></span>
              <button 
                onClick={logout}
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                Log out
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-4">
              <Link to="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                Log in
              </Link>
              <Link to="/register" className="px-4 py-2 rounded-md text-sm font-medium bg-primary-600 hover:bg-primary-500 transition-colors shadow-[0_0_15px_rgba(79,70,229,0.3)]">
                Register
              </Link>
            </div>
          )}

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-400 hover:text-white focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-surface border-b border-white/10">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => {
              if (link.path === '/dashboard' && !user) return null;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "block px-3 py-2 rounded-md text-base font-medium",
                    location.pathname === link.path
                      ? "bg-primary-500/10 text-primary-400"
                      : "text-gray-300 hover:bg-surfaceHover hover:text-white"
                  )}
                >
                  {link.name}
                </Link>
              );
            })}
            
            <div className="mt-4 pt-4 border-t border-white/10 flex flex-col gap-2">
              {user ? (
                <>
                  <div className="px-3 py-2 text-sm text-gray-400">Signed in as <span className="text-white font-medium">{user.fullName}</span></div>
                  <button onClick={() => { logout(); setIsOpen(false); }} className="text-left block px-3 py-2 text-base font-medium text-red-400 hover:text-red-300">
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white">
                    Log in
                  </Link>
                  <Link to="/register" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-primary-400 hover:text-primary-300">
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
