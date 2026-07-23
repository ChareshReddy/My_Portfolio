import React, { useState, useEffect, useRef } from 'react';
import { Calendar, MapPin, Terminal, CheckCircle2 } from 'lucide-react';
import { experience } from '../data/content';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Experience() {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const marker = markerRef.current;
    const track = trackRef.current;

    if (!section || !marker || !track) return;

    const mm = gsap.matchMedia();

    // DESKTOP: Apply pinning and mechanical spine node progress
    mm.add("(min-width: 768px)", () => {
      const pinTrigger = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "+=200%", // 200% viewport scroll length
        pin: true,
        scrub: true,
        onUpdate: (self) => {
          const trackHeight = track.offsetHeight;
          // Animate node marker down the spine based on scroll progress
          const markerY = self.progress * (trackHeight - 18); // 18px is marker size adjustment
          gsap.to(marker, { 
            y: markerY, 
            duration: 0.1, 
            ease: "power2.out" 
          });

          // Calculate active card index
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
      };
    });

    // MOBILE: Normal linear scrolling, highlight current card in viewport
    mm.add("(max-width: 767px)", () => {
      const scrollTriggers = experience.map((_, idx) => {
        return ScrollTrigger.create({
          trigger: `#exp-card-mobile-${idx}`,
          start: "top 35%",
          end: "bottom 35%",
          onEnter: () => setActiveIndex(idx),
          onEnterBack: () => setActiveIndex(idx)
        });
      });

      return () => {
        scrollTriggers.forEach(st => st.kill());
      };
    });

    return () => mm.revert();
  }, []);

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

        {/* DESKTOP VIEW (Pinned Layout) */}
        <div className="hidden md:flex items-center justify-between w-full max-w-5xl mx-auto h-[480px]">
          
          {/* Experience Cards Stack (Left) */}
          <div className="w-[60%] relative h-full flex items-center justify-start">
            {experience.map((exp, idx) => {
              // Custom precise slide translation based on active index
              let cardClass = "";
              if (idx < activeIndex) {
                cardClass = "opacity-0 -translate-y-16 scale-95 pointer-events-none";
              } else if (idx === activeIndex) {
                cardClass = "opacity-100 translate-y-0 scale-100 pointer-events-auto z-10";
              } else {
                cardClass = "opacity-0 translate-y-16 scale-95 pointer-events-none";
              }

              return (
                <div
                  key={idx}
                  className={`absolute inset-x-0 transition-all duration-400 ease-[power2.inOut] transform ${cardClass}`}
                >
                  <div className="group relative glass-panel border border-cyan-500/10 rounded-2xl p-8 hover:bg-slate-900/40 transition-colors shadow-2xl">
                    {/* Header bar */}
                    <div className="flex items-center justify-between gap-2.5 mb-5">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-cyan-950/60 border border-cyan-500/25 text-cyan-400 font-mono text-[10px] uppercase font-semibold">
                        {exp.type}
                      </span>
                      {exp.highlights && (
                        <span className="inline-flex items-center gap-1.5 text-[10px] text-teal-400 font-mono font-medium">
                          <Terminal className="w-4 h-4" />
                          {exp.highlights}
                        </span>
                      )}
                    </div>

                    <h3 className="text-2xl font-bold text-slate-100 font-display text-left">
                      {exp.role}
                    </h3>
                    <div className="text-left text-sm font-semibold text-slate-350 mt-1">
                      {exp.company}
                    </div>

                    {/* Metadata lines */}
                    <div className="flex items-center gap-4 mt-3 mb-6 font-mono text-xs text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        <span>{exp.period}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4" />
                        <span>{exp.location}</span>
                      </div>
                    </div>

                    {/* Highlights details */}
                    <ul className="space-y-3.5 text-left text-xs sm:text-sm text-slate-400 leading-relaxed">
                      {exp.achievements.map((ach, aIdx) => (
                        <li key={aIdx} className="flex items-start gap-2.5">
                          <CheckCircle2 className="w-4.5 h-4.5 text-cyan-500/70 flex-shrink-0 mt-0.5" />
                          <span>{ach}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Spine & Node Progress (Right) */}
          <div className="w-[25%] flex items-center justify-center h-full">
            <div 
              ref={trackRef} 
              className="w-[3px] bg-slate-900 rounded-full h-[320px] relative border border-slate-900"
            >
              {/* Vertical neon energy spine segment */}
              <div className="absolute top-0 bottom-0 left-0 right-0 bg-gradient-to-b from-cyan-950/20 via-teal-950/20 to-slate-950/20 rounded-full" />
              
              {/* Dynamic traveling node cursor */}
              <div 
                ref={markerRef} 
                className="absolute left-1/2 -translate-x-1/2 w-4.5 h-4.5 rounded-full bg-cyan-400 border-2 border-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.95)] z-20 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* MOBILE VIEW (Sequential Scroll list) */}
        <div className="flex md:hidden flex-col gap-8 w-full max-w-xl mx-auto">
          {experience.map((exp, idx) => (
            <div
              key={idx}
              id={`exp-card-mobile-${idx}`}
              className={`transition-all duration-300 transform ${
                activeIndex === idx 
                  ? 'scale-100 opacity-100' 
                  : 'scale-98 opacity-50'
              }`}
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

      </div>
    </section>
  );
}
