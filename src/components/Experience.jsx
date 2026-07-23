import React, { useState, useEffect, useRef } from 'react';
import { Calendar, MapPin, Terminal, CheckCircle2 } from 'lucide-react';
import { experience } from '../data/content';
import ScrollReveal from './ScrollReveal';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Experience() {
  const [fallback, setFallback] = useState(true);
  const sectionRef = useRef(null);
  const containerRef = useRef(null);

  // Chronological order: Data Engineer Intern first, then Data Engineer (Full-Time)
  const orderedExp = [...experience].reverse();

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setFallback(isMobile || prefersReducedMotion);
  }, []);

  useEffect(() => {
    if (fallback || !sectionRef.current) return;

    const cards = gsap.utils.toArray('.experience-cube-card');
    if (cards.length <= 1) return;

    // Set initial 3D transform origins and rotation states
    gsap.set(cards, { transformOrigin: "50% 50% -180px", transformStyle: "preserve-3d", backfaceVisibility: "hidden" });
    gsap.set(cards.slice(1), { rotationX: 90, opacity: 0, pointerEvents: 'none' });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: () => `+=${window.innerHeight * (cards.length - 1) * 1.2}`, // scrub distance
        pin: true,
        scrub: 0.5,
        invalidateOnRefresh: true,
      }
    });

    cards.forEach((card, idx) => {
      if (idx < cards.length - 1) {
        const nextCard = cards[idx + 1];
        
        // Flip active card out (rotates up/back), flip next card in (rotates from bottom/front)
        tl.to(card, {
          rotationX: -90,
          opacity: 0,
          pointerEvents: 'none',
          duration: 1,
          ease: "power1.inOut"
        }, idx)
        .fromTo(nextCard,
          { rotationX: 90, opacity: 0, pointerEvents: 'none' },
          {
            rotationX: 0,
            opacity: 1,
            pointerEvents: 'all',
            duration: 1,
            ease: "power1.inOut"
          },
          idx
        );
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => {
        if (t.trigger === sectionRef.current) t.kill();
      });
      tl.kill();
    };
  }, [fallback]);

  // Mobile/Reduced-motion Fallback Rendering: Standard static vertical timeline layout
  if (fallback) {
    return (
      <section id="experience" className="relative px-4 md:px-8 py-20 border-t border-slate-900/50">
        <div className="max-w-7xl mx-auto">
          {/* Section Heading */}
          <div className="flex flex-col mb-16">
            <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest mb-2">Execution Logs</span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-100 font-display">
              Professional Pipeline
            </h2>
            <div className="w-12 h-1 bg-gradient-to-r from-cyan-500 to-teal-400 mt-4 rounded-full" />
          </div>

          {/* Timeline Container */}
          <div className="relative max-w-4xl mx-auto">
            <div className="absolute left-4 md:left-1/2 top-4 bottom-4 w-[2px] bg-gradient-to-b from-cyan-500 via-teal-400 to-slate-800 pointer-events-none hidden sm:block md:-translate-x-1/2" />
            
            <ScrollReveal className="space-y-12" stagger={0.25}>
              {experience.map((exp, idx) => {
                const isEven = idx % 2 === 0;
                return (
                  <div
                    key={idx}
                    className={`relative flex flex-col md:flex-row items-stretch justify-between w-full ${
                      isEven ? 'md:flex-row-reverse' : ''
                    }`}
                  >
                    <div className="absolute left-4 md:left-1/2 top-6 h-5 w-5 rounded-full bg-slate-950 border-2 border-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.6)] z-10 -translate-x-2 sm:translate-x-0 md:-translate-x-1/2" />
                    <div className="hidden md:block w-[45%]" />
                    <div className="w-full md:w-[45%] pl-10 sm:pl-12 md:pl-0">
                      <div className="group relative glass-panel border border-cyan-500/5 hover:border-cyan-500/20 rounded-2xl p-6 md:p-8 hover:bg-slate-900/40 transition-all duration-300 shadow-lg">
                        <div className="flex flex-wrap items-center justify-between gap-2.5 mb-4">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-cyan-950/60 border border-cyan-500/25 text-cyan-400 font-mono text-[10px] uppercase font-semibold">
                            {exp.type}
                          </span>
                          {exp.highlights && (
                            <span className="inline-flex items-center gap-1 text-[10px] text-teal-400 font-mono font-medium">
                              <Terminal className="w-3.5 h-3.5" />
                              {exp.highlights}
                            </span>
                          )}
                        </div>

                        <h3 className="text-xl font-bold text-slate-100 font-display text-left">
                          {exp.role}
                        </h3>
                        <div className="text-left text-sm font-semibold text-slate-350 mt-1">
                          {exp.company}
                        </div>

                        <div className="flex flex-wrap items-center gap-4 mt-3 mb-6 font-mono text-xs text-slate-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{exp.period}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>{exp.location}</span>
                          </div>
                        </div>

                        <ul className="space-y-3.5 text-left text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
                          {exp.achievements.map((ach, aIdx) => (
                            <li key={aIdx} className="flex items-start gap-2.5">
                              <CheckCircle2 className="w-4.5 h-4.5 text-cyan-500/70 flex-shrink-0 mt-0.5" />
                              <span>{ach}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              })}
            </ScrollReveal>
          </div>
        </div>
      </section>
    );
  }

  // 3D Cube Flip Transition view for desktop
  return (
    <section 
      id="experience" 
      ref={sectionRef} 
      className="relative w-full min-h-screen flex flex-col justify-center items-center px-4 md:px-8 py-16 overflow-hidden border-t border-slate-900/50"
    >
      <div className="max-w-7xl w-full mx-auto flex flex-col items-center justify-center">
        {/* Section Heading */}
        <div className="flex flex-col mb-12 items-center text-center">
          <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest mb-2">Execution Logs</span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-100 font-display">
            Professional Pipeline
          </h2>
          <div className="w-12 h-1 bg-gradient-to-r from-cyan-500 to-teal-400 mt-4 rounded-full" />
        </div>

        {/* 3D Cube Card Stack Container */}
        <div 
          ref={containerRef}
          className="relative w-full max-w-2xl h-[520px] md:h-[460px] flex items-center justify-center"
          style={{ perspective: '1600px', transformStyle: 'preserve-3d' }}
        >
          {orderedExp.map((exp, idx) => (
            <div
              key={idx}
              className="absolute inset-0 w-full h-full experience-cube-card"
              style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}
            >
              <div className="group relative w-full h-full glass-panel border border-cyan-500/15 rounded-3xl p-6 md:p-8 bg-slate-950/95 shadow-2xl flex flex-col justify-between select-none">
                
                <div>
                  {/* Job Header */}
                  <div className="flex items-center justify-between gap-2.5 mb-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-cyan-950/60 border border-cyan-500/25 text-cyan-400 font-mono text-[10px] uppercase font-semibold">
                      {exp.type}
                    </span>
                    {exp.highlights && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-teal-400 font-mono font-medium">
                        <Terminal className="w-3.5 h-3.5" />
                        {exp.highlights}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl md:text-2xl font-bold text-slate-50 font-display text-left">
                    {exp.role}
                  </h3>
                  <div className="text-left text-sm font-semibold text-slate-350 mt-1">
                    {exp.company}
                  </div>

                  {/* Location & Time Specs */}
                  <div className="flex flex-wrap items-center gap-4 mt-3 mb-6 font-mono text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{exp.period}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{exp.location}</span>
                    </div>
                  </div>

                  {/* Achievements bullets */}
                  <ul className="space-y-3.5 text-left text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                    {exp.achievements.map((ach, aIdx) => (
                      <li key={aIdx} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4.5 h-4.5 text-cyan-500/70 flex-shrink-0 mt-0.5" />
                        <span>{ach}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Accent glow on hover */}
                <div className="absolute inset-0 rounded-3xl border border-transparent group-hover:border-cyan-500/10 pointer-events-none transition-all duration-300" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
