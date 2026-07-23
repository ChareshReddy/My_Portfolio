import React from 'react';
import { Award, ShieldCheck, Hourglass } from 'lucide-react';
import { certifications } from '../data/content';
import ScrollReveal from './ScrollReveal';

export default function Certifications() {
  return (
    <section id="certifications" className="relative px-4 md:px-8 py-20 border-t border-slate-900/50">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Heading */}
        <div className="flex flex-col mb-16">
          <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest mb-2">Verified Token Registry</span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-100 font-display">
            Credentials & Certifications
          </h2>
          <div className="w-12 h-1 bg-gradient-to-r from-cyan-500 to-teal-400 mt-4 rounded-full" />
        </div>

        {/* Certifications Grid (GSAP ScrollReveal wrapped) */}
        <ScrollReveal
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
          stagger={0.2}
        >
          {certifications.map((cert, idx) => {
            const isInProgress = cert.status.toLowerCase().includes('progress');

            return (
              <div
                key={idx}
                className="group relative glass-panel border border-cyan-500/5 hover:border-cyan-500/20 rounded-2xl p-6 hover:bg-slate-900/40 transition-all duration-300 shadow-xl overflow-hidden text-left"
              >
                {/* Header status bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-slate-900 group-hover:bg-slate-800 transition-colors" />

                <div className="flex gap-5 items-start">
                  {/* Status Indicator Icon */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 border transition-all duration-300 ${
                    isInProgress 
                      ? 'bg-amber-950/20 border-amber-500/20 text-amber-400 group-hover:border-amber-400' 
                      : 'bg-emerald-950/20 border-emerald-500/20 text-emerald-400 group-hover:border-emerald-400'
                  }`}>
                    {isInProgress ? (
                      <Hourglass className="w-5.5 h-5.5 animate-spin" style={{ animationDuration: '3s' }} />
                    ) : (
                      <ShieldCheck className="w-5.5 h-5.5" />
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="flex-grow pt-0.5">
                    {/* Issuer & Year Status */}
                    <div className="flex items-center justify-between gap-2.5 mb-1.5 font-mono text-[10px] text-slate-500 uppercase font-semibold">
                      <span>{cert.issuer}</span>
                      <span className={`px-2 py-0.5 rounded text-[8px] tracking-wide font-bold ${
                        isInProgress ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}>
                        {cert.status}
                      </span>
                    </div>

                    {/* Certificate Title */}
                    <h3 className="text-lg font-bold text-slate-100 font-display group-hover:text-cyan-400 transition-colors leading-snug">
                      {cert.title}
                    </h3>

                    {/* Skill Registry */}
                    <div className="mt-4 pt-3 border-t border-slate-900/80">
                      <span className="font-mono text-[9px] text-slate-500 uppercase tracking-widest block mb-2">
                        Certified Skill Scope:
                      </span>
                      <p className="text-xs text-slate-400 leading-relaxed font-normal">
                        {cert.skills}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Cyber line decoration on hover */}
                <div className="absolute right-0 bottom-0 w-24 h-[1px] bg-gradient-to-r from-transparent to-cyan-500/20 group-hover:to-cyan-500/40 transition-colors pointer-events-none" />
              </div>
            );
          })}
        </ScrollReveal>

        {/* Education Log Subtitle */}
        <div className="mt-20 max-w-4xl mx-auto border-t border-slate-900/50 pt-16">
          <span className="font-mono text-xs text-emerald-400 uppercase tracking-widest block mb-2 text-center">Foundational Query Base</span>
          <h3 className="text-2xl font-bold text-slate-100 font-display text-center mb-8">
            Academic Track
          </h3>

          <ScrollReveal 
            className="max-w-2xl mx-auto"
            triggerHook="90%"
          >
            <div className="glass-panel border border-cyan-500/5 rounded-2xl p-6 md:p-8 text-left relative group hover:border-cyan-500/20 transition-all duration-300">
              <div className="flex gap-4 items-start">
                <div className="w-11 h-11 rounded-xl bg-cyan-950/60 border border-cyan-500/25 flex items-center justify-center text-cyan-400">
                  <Award className="w-5.5 h-5.5" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2.5 font-mono text-[10px] text-slate-550 uppercase">
                    <span>JNTUA University</span>
                    <span>Andhra Pradesh, India</span>
                  </div>
                  <h4 className="text-lg font-bold text-slate-100 font-display mt-1">
                    Bachelor of Technology in Information Technology
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-455 mt-3 leading-relaxed">
                    Focus on Database Management Systems (DBMS), Data Structures & Algorithms (DSA), Software Engineering, and Big Data Analytics.
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>

      </div>
    </section>
  );
}
