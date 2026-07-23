import React, { useState, useEffect } from 'react';
import { Menu, X, Database, Terminal, Layers, Briefcase, FileCode2, Award, Mail } from 'lucide-react';
import { personalInfo } from '../data/content';

const navItems = [
  { label: 'Overview', href: '#overview', icon: Terminal },
  { label: 'Architecture', href: '#about', icon: Layers },
  { label: 'Tech Stack', href: '#skills', icon: Database },
  { label: 'Pipeline', href: '#experience', icon: Briefcase },
  { label: 'Products', href: '#projects', icon: FileCode2 },
  { label: 'Credentials', href: '#certifications', icon: Award },
  { label: 'Connect', href: '#contact', icon: Mail }
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 120;

      for (const item of navItems) {
        const targetId = item.href.slice(1);
        const element = document.getElementById(targetId);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(targetId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = (e, href) => {
    e.preventDefault();
    setIsOpen(false);
    const targetId = href.slice(1);
    const element = document.getElementById(targetId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      });
      setActiveSection(targetId);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full px-4 py-3 md:px-8">
      <nav className="mx-auto max-w-7xl glass-panel rounded-2xl border border-cyan-500/10 px-4 py-2.5 md:px-6 shadow-lg">
        <div className="flex items-center justify-between">
          {/* Logo Brand */}
          <a
            href="#overview"
            onClick={(e) => handleClick(e, '#overview')}
            className="flex items-center gap-2.5 group focus-ring rounded-lg py-1 px-2"
          >
            <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 group-hover:border-cyan-400 transition-all duration-300">
              <span className="font-mono text-sm font-bold tracking-tighter">CR</span>
              <div className="absolute inset-0 rounded-lg bg-cyan-400/10 opacity-0 group-hover:opacity-100 blur transition-all duration-300" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-wide text-slate-100 font-display">
                {personalInfo.name.split(' ')[0]} {personalInfo.name.split(' ')[1]}
              </span>
              <span className="font-mono text-[10px] tracking-wider text-cyan-400/80 uppercase">
                {personalInfo.title}
              </span>
            </div>
          </a>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.href.slice(1);
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleClick(e, item.href)}
                  className={`relative flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono tracking-wider transition-all duration-300 rounded-lg focus-ring ${
                    isActive 
                      ? 'text-cyan-400 font-semibold bg-cyan-950/30 border border-cyan-500/25 shadow-[0_0_12px_rgba(34,211,238,0.12)]' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/20 border border-transparent'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {item.label}
                </a>
              );
            })}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex lg:hidden items-center justify-center p-2 text-slate-400 hover:text-cyan-400 transition-colors rounded-lg focus-ring"
            aria-label="Toggle main navigation menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Panel */}
      <div 
        className={`absolute left-4 right-4 top-20 z-50 glass-panel-heavy rounded-2xl border border-cyan-500/20 p-4 shadow-2xl lg:hidden transition-all duration-300 origin-top ${
          isOpen ? 'opacity-100 scale-y-100 translate-y-0' : 'opacity-0 scale-y-95 -translate-y-2 pointer-events-none'
        }`}
      >
        <div className="flex flex-col gap-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.href.slice(1);
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleClick(e, item.href)}
                className={`flex items-center gap-3 px-4 py-3 font-mono text-sm tracking-wide transition-all rounded-xl focus-ring ${
                  isActive 
                    ? 'text-cyan-400 bg-cyan-950/30 border border-cyan-500/20' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/35 border border-transparent'
                }`}
              >
                <Icon className="w-4.5 h-4.5" />
                <span>{item.label}</span>
              </a>
            );
          })}
        </div>
      </div>
    </header>
  );
}
