import React from 'react';
import { FileCode2, Network, ArrowUpRight } from 'lucide-react';
import { projects } from '../data/content';
import ScrollReveal from './ScrollReveal';

export default function Projects() {
  return (
    <section id="projects" className="relative px-4 md:px-8 py-20 border-t border-slate-900/50">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Heading */}
        <div className="flex flex-col mb-16">
          <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest mb-2">Build Output</span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-100 font-display">
            Client Engagements & Projects
          </h2>
          <div className="w-12 h-1 bg-gradient-to-r from-cyan-500 to-teal-400 mt-4 rounded-full" />
        </div>

        {/* Projects Cards Grid (GSAP ScrollReveal wrapped) */}
        <ScrollReveal
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          stagger={0.15}
        >
          {projects.map((proj, idx) => (
            <div
              key={idx}
              className="group relative flex flex-col justify-between glass-panel border border-cyan-500/5 hover:border-cyan-500/25 rounded-2xl p-6 hover:bg-slate-900/40 hover:-translate-y-1 transition-all duration-300 shadow-xl"
            >
              <div>
                {/* Project Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-500/25 flex items-center justify-center text-cyan-400 group-hover:border-cyan-400 transition-colors">
                    <FileCode2 className="w-5 h-5" />
                  </div>
                  <span className="font-mono text-[9px] text-slate-500 uppercase tracking-widest">
                    Job ID // {idx + 101}
                  </span>
                </div>

                {/* Project Title */}
                <h3 className="text-xl font-bold text-slate-100 font-display text-left group-hover:text-cyan-400 transition-colors">
                  {proj.title}
                </h3>

                {/* Data Sources Ingested */}
                <div className="mt-4 p-3 rounded-xl bg-slate-950/40 border border-slate-900 text-left">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-cyan-500 uppercase font-semibold">
                    <Network className="w-3.5 h-3.5" />
                    <span>Data Sources Ingested:</span>
                  </div>
                  <p className="text-xs text-slate-450 font-mono mt-1 leading-relaxed">
                    {proj.sources}
                  </p>
                </div>

                {/* Outcome Specifications */}
                <div className="mt-5 text-left">
                  <span className="font-mono text-[10px] text-slate-500 uppercase tracking-wider block mb-1">
                    System Outcome Spec:
                  </span>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
                    {proj.outcome}
                  </p>
                </div>
              </div>

              {/* Technologies / Environment Chips */}
              <div className="mt-8 pt-5 border-t border-slate-900">
                <div className="flex flex-wrap gap-1.5">
                  {proj.environment.map((env, eIdx) => (
                    <span
                      key={eIdx}
                      className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-400 font-medium"
                    >
                      {env}
                    </span>
                  ))}
                </div>
              </div>

              {/* Accent corner icon or line */}
              <div className="absolute top-3 right-3 text-slate-700 group-hover:text-cyan-400 transition-colors">
                <ArrowUpRight className="w-4 h-4 opacity-30 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          ))}
        </ScrollReveal>
      </div>
    </section>
  );
}
