import React, { useState, useEffect, useRef } from 'react';
import { Calendar, MapPin, Terminal, CheckCircle2 } from 'lucide-react';
import { experience } from '../data/content';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Experience() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(
        window.innerWidth < 768 || 
        (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      );
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Initialize the window progress flag
    window.experienceScrollProgress = 0;

    if (isMobile || isMobile === null) return;

    const section = sectionRef.current;
    if (!section) return;

    // DESKTOP: Pin the Experience section container to drive the R3F 3D Orbit
    const pinTrigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "+=220%", // Scroll space mapping to 3D Orbit phases
      pin: true,
      scrub: true,
      onUpdate: (self) => {
        // Publish scroll progress globally for R3F Canvas reading
        window.experienceScrollProgress = self.progress;

        // Calculate current active card index
        const progress = self.progress;
        const idx = Math.min(
          Math.floor(progress * experience.length),
          experience.length - 1
        );
        setActiveIndex(idx);
      }
    });

    return () => {
      pinTrigger.kill();
      window.experienceScrollProgress = 0;
    };
  }, [isMobile]);

  // Render loading state before hydration resize check
  if (isMobile === null) {
    return <div className="min-h-screen bg-transparent" />;
  }

  return (
    <section 
      ref={sectionRef} 
      id="experience" 
      className="relative px-4 md:px-8 py-20 border-t border-slate-900/50 min-h-screen flex flex-col justify-center bg-transparent"
    >
      <div className="max-w-7xl w-full mx-auto flex-grow flex flex-col justify-center">
        
        {/* Section Heading */}
        <div className="flex flex-col mb-12 md:mb-16">
          <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest mb-2">Execution Logs</span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-100 font-display">
            Professional Pipeline
          </h2>
          <div className="w-12 h-1 bg-gradient-to-r from-cyan-500 to-teal-400 mt-4 rounded-full" />
        </div>

        {/* DESKTOP VIEW (3D Orbit Placeholder space) */}
        {!isMobile && (
          <div className="w-full flex items-center justify-between max-w-5xl mx-auto h-[480px] pointer-events-none select-none">
            {/* Left Column (Card Spacer) */}
            <div className="w-[60%] h-full" />
            
            {/* Right Column (Spine Spacer) */}
            <div className="w-[25%] h-full" />
          </div>
        )}

        {/* MOBILE VIEW (Sequential Scroll list) */}
        {isMobile && (
          <div className="flex flex-col gap-8 w-full max-w-xl mx-auto">
            {experience.map((exp, idx) => (
              <div
                key={idx}
                id={`exp-card-mobile-${idx}`}
                className="scale-100 opacity-100 transition-all duration-300"
              >
                <div className="group relative glass-panel border border-cyan-500/5 rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center justify-between gap-2.5 mb-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-cyan-950/60 border border-cyan-500/25 text-cyan-400 font-mono text-[9px] uppercase font-semibold">
                      {exp.type}
                    </span>
                    {exp.highlights && (
                      <span className="inline-flex items-center gap-1 text-[9px] text-teal-400 font-mono font-medium">
                        <Terminal className="w-3.5 h-3.5" />
                        {exp.highlights}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-slate-100 font-display text-left">
                    {exp.role}
                  </h3>
                  <div className="text-left text-xs font-semibold text-slate-350 mt-1">
                    {exp.company}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 mt-3 mb-4 font-mono text-[10px] text-slate-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{exp.period}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{exp.location}</span>
                    </div>
                  </div>

                  <ul className="space-y-3 text-left text-xs text-slate-400 leading-relaxed">
                    {exp.achievements.map((ach, aIdx) => (
                      <li key={aIdx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-cyan-500/70 flex-shrink-0 mt-0.5" />
                        <span>{ach}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
