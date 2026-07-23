import React, { useEffect, useRef } from 'react';
import { Terminal, Database, Cpu, Wrench, ChevronRight } from 'lucide-react';
import { skills } from '../data/content';
import ScrollReveal from './ScrollReveal';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const iconMap = {
  "Core Languages": Terminal,
  "Big Data & Cloud Systems": Cpu,
  "Databases & Storage": Database,
  "Methodologies & Tools": Wrench
};

// Sub-component for individual skill progress bars animated via GSAP
function SkillBar({ name, level }) {
  const barRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !barRef.current) {
      gsap.set(barRef.current, { width: `${level}%` });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(barRef.current,
        { width: '0%' },
        {
          width: `${level}%`,
          duration: 1.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: barRef.current,
            start: 'top 92%',
            toggleActions: 'play none none none',
          }
        }
      );
    }, barRef);

    return () => ctx.revert();
  }, [level]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs font-mono">
        <span className="text-slate-350 font-medium flex items-center gap-1.5">
          <ChevronRight className="w-3.5 h-3.5 text-cyan-500/60" />
          {name}
        </span>
        <span className="text-cyan-400 font-semibold">{level}%</span>
      </div>

      {/* Progress Track */}
      <div
        className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-900"
        role="progressbar"
        aria-valuenow={level}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-label={`${name} skill level`}
      >
        <div
          ref={barRef}
          className="h-full bg-gradient-to-r from-cyan-500 to-teal-400 rounded-full relative"
        />
      </div>
    </div>
  );
}

export default function Skills() {
  return (
    <section id="skills" className="relative px-4 md:px-8 py-20 border-t border-slate-900/50">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Heading */}
        <div className="flex flex-col mb-16">
          <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest mb-2">Ingestion Schema</span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-100 font-display">
            Technology Stack & Capabilities
          </h2>
          <div className="w-12 h-1 bg-gradient-to-r from-cyan-500 to-teal-400 mt-4 rounded-full" />
        </div>

        {/* Skills Categories Grid */}
        <ScrollReveal
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          stagger={0.15}
        >
          {skills.categories.map((category, idx) => {
            const Icon = iconMap[category.name] || Terminal;
            return (
              <div
                key={category.name}
                className="group relative glass-panel border border-cyan-500/5 rounded-2xl p-6 md:p-8 hover:border-cyan-500/20 hover:bg-slate-900/40 transition-all duration-300 shadow-md"
              >
                {/* Category Header */}
                <div className="flex items-center gap-3.5 mb-8 text-left">
                  <div className="w-11 h-11 rounded-xl bg-cyan-950/55 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:border-cyan-400 transition-colors">
                    <Icon className="w-5.5 h-5.5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-50 font-display">
                      {category.name}
                    </h3>
                    <p className="text-[10px] text-slate-500 font-mono tracking-wider uppercase">
                      Cluster Stack {idx + 1}
                    </p>
                  </div>
                </div>

                {/* Skill Items & Progress Bars */}
                <div className="space-y-6">
                  {category.items.map((skill) => (
                    <SkillBar
                      key={skill.name}
                      name={skill.name}
                      level={skill.level}
                    />
                  ))}
                </div>

                {/* Cyber Glow Accent */}
                <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-cyan-500/10 pointer-events-none transition-all duration-300" />
              </div>
            );
          })}
        </ScrollReveal>
      </div>
    </section>
  );
}
