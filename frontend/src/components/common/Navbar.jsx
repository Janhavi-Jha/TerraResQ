import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Satellite, Home, LayoutDashboard, History, Info, Sparkles, Menu, X } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const isActive = (path) => location.pathname === path;
  
  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/history', label: 'History', icon: History },
    { path: '/about', label: 'About', icon: Info },
  ];
  
  return (
    <nav className="sticky top-0 z-50 bg-[#07120D]/95 backdrop-blur-md border-b border-[#1A2E22] shadow-xs">
      <div className="max-w-[1200px] w-full mx-auto px-6">
        <div className="flex items-center justify-between py-5 sm:py-6 min-h-[72px]">
          {/* LEFT: TerraResQ Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-[#22C55E] rounded-lg"
            aria-label="TerraResQ Home"
          >
            <div className="w-9 h-9 rounded-lg bg-[#0B1711] border border-[#1A2E22] flex items-center justify-center text-[#22C55E] group-hover:border-[#22C55E]/50 transition-colors shrink-0">
              <Satellite className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <span className="text-xl font-bold tracking-tight text-[#F8FAFC]">
              Terra<span className="text-[#22C55E]">ResQ</span>
            </span>
          </Link>
          
          {/* RIGHT: Navigation Links + Start Analysis Button */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-1.5 lg:gap-2">
              {navItems.map(({ path, label, icon: Icon }) => {
                const active = isActive(path);
                return (
                  <Link
                    key={path}
                    to={path}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#22C55E] ${
                      active
                        ? 'bg-[#0B1711] text-[#22C55E] border border-[#1A2E22]'
                        : 'text-[#A7B0AA] hover:text-[#F8FAFC] hover:bg-[#0B1711]/60 border border-transparent'
                    }`}
                    aria-current={active ? 'page' : undefined}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{label}</span>
                  </Link>
                );
              })}
            </div>

            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center gap-2 h-10 px-5 bg-[#22C55E] hover:bg-[#16a34a] text-white font-semibold text-sm rounded-lg shadow-sm hover:shadow-[#22C55E]/20 transition-colors focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:ring-offset-2 focus:ring-offset-[#07120D] shrink-0"
            >
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>Start Analysis</span>
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="p-2 rounded-lg bg-[#0B1711] border border-[#1A2E22] text-[#A7B0AA] hover:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#22C55E]"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#1A2E22] bg-[#07120D] px-6 py-4 space-y-2">
          {navItems.map(({ path, label, icon: Icon }) => {
            const active = isActive(path);
            return (
              <Link
                key={path}
                to={path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? 'bg-[#0B1711] text-[#22C55E] border border-[#1A2E22]'
                    : 'text-[#A7B0AA] hover:text-[#F8FAFC] hover:bg-[#0B1711]/60'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{label}</span>
              </Link>
            );
          })}
          
          <div className="pt-2">
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 h-10 px-5 bg-[#22C55E] hover:bg-[#16a34a] text-white font-semibold text-sm rounded-lg shadow-sm"
            >
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>Start Analysis</span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;