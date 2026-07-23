import React from 'react';
import Pipeline3D from './components/Pipeline3D';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Certifications from './components/Certifications';
import Contact from './components/Contact';
import { personalInfo } from './data/content';

export default function App() {
  return (
    <div className="relative min-h-screen text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Persistent 3D R3F Scroll-Driven Background */}
      <Pipeline3D />

      {/* Floating Sticky Navigation */}
      <Navbar />

      {/* Main Page Layout Content */}
      <main className="mx-auto max-w-7xl relative z-10">
        
        {/* HERO Section */}
        <Hero />

        {/* ABOUT Section */}
        <About />

        {/* SKILLS Section */}
        <Skills />

        {/* EXPERIENCE Section */}
        <Experience />

        {/* PROJECTS Section */}
        <Projects />

        {/* CERTIFICATIONS Section */}
        <Certifications />

        {/* CONTACT Section */}
        <Contact />

      </main>

      {/* Footer Log Specifications */}
      <footer className="relative z-10 border-t border-slate-900 bg-slate-950/65 py-8 text-center text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>
            © {new Date().getFullYear()} {personalInfo.name}. All systems operational.
          </span>
          <span className="flex items-center gap-1.5 uppercase tracking-wider text-[10px] text-cyan-500/70">
            <span>Built with React + Three.js (R3F) + GSAP + Tailwind v4</span>
          </span>
        </div>
      </footer>
    </div>
  );
}
