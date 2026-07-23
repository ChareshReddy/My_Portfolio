import React from 'react';
import { Database, Cpu, ChevronRight, HardDrive, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { summary } from '../data/content';
import ScrollReveal from './ScrollReveal';

export default function About() {
  const steps = [
    {
      title: "1. Data Ingestion (Raw)",
      desc: "Ingestion of multi-source formats (JSON, CSV, Parquet) and transactional records (SQL Server, MySQL).",
      icon: Database,
      color: "border-cyan-500/30 text-cyan-400 bg-cyan-950/20"
    },
    {
      title: "2. ETL Processing (Silver)",
      desc: "PySpark cleaning, schema validation, quarantine handling, and incremental loads.",
      icon: Cpu,
      color: "border-teal-500/30 text-teal-400 bg-teal-950/20"
    },
    {
      title: "3. Lakehouse Optimization (Gold)",
      desc: "Table partitioning, Z-Ordering, metadata pruning, and Delta Lake merges.",
      icon: HardDrive,
      color: "border-emerald-500/30 text-emerald-400 bg-emerald-950/20"
    },
    {
      title: "4. Business Value Output",
      desc: "Clean data delivery, reducing compute costs by 30% and supporting real-time dashboards.",
      icon: ShieldCheck,
      color: "border-indigo-500/30 text-indigo-400 bg-indigo-950/20"
    }
  ];

  return (
    <section id="about" className="relative px-4 md:px-8 py-20 border-t border-slate-900/50">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Heading */}
        <div className="flex flex-col mb-16">
          <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest mb-2">System Blueprint</span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-100 font-display">
            Architecture Specification
          </h2>
          <div className="w-12 h-1 bg-gradient-to-r from-cyan-500 to-teal-400 mt-4 rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Architecture Narrative (Summary Text) */}
          <ScrollReveal 
            className="lg:col-span-6 flex flex-col justify-between glass-panel border border-cyan-500/5 p-6 md:p-8 rounded-2xl"
            stagger={0.2}
          >
            <div>
              <span className="font-mono text-[10px] text-cyan-400 uppercase tracking-wider block mb-4">
                // System Summary Spec
              </span>
              <h3 className="text-2xl font-bold text-slate-50 mb-6 font-display">
                {summary.heading}
              </h3>
              <p className="text-slate-350 text-sm md:text-base leading-relaxed space-y-4 font-normal">
                {summary.text}
              </p>
            </div>

            <div className="mt-8 p-4 rounded-xl bg-slate-950/40 border border-slate-800/60 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div className="text-left">
                <h4 className="text-xs font-semibold text-slate-200">Core Ingestion Standards</h4>
                <p className="text-[11px] text-slate-550 font-mono mt-1">
                  Schema Enforcement • ACID Compliance • Partition Pruning
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* Pipeline Visual Flow Diagram */}
          <ScrollReveal 
            className="lg:col-span-6 flex flex-col justify-center glass-panel border border-cyan-500/10 p-6 md:p-8 rounded-2xl relative overflow-hidden"
            delay={0.15}
          >
            <span className="font-mono text-[10px] text-emerald-400 uppercase tracking-wider block mb-6">
              // Live System Architecture Flow
            </span>

            <div className="space-y-4 relative z-10">
              {steps.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <div key={idx} className="relative">
                    {/* Vertical Connector Line */}
                    {idx < steps.length - 1 && (
                      <div className="absolute left-6.5 top-12 bottom-[-16px] w-[2px] bg-gradient-to-b from-cyan-500/30 to-emerald-500/10 pointer-events-none hidden xs:block" />
                    )}

                    <div className="flex gap-4 items-start group">
                      {/* Node Icon */}
                      <div className={`w-13 h-13 rounded-xl border flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-105 ${step.color} shadow-sm`}>
                        <Icon className="w-5.5 h-5.5" />
                      </div>

                      {/* Content */}
                      <div className="text-left pt-1">
                        <h4 className="text-sm font-semibold text-slate-100 font-display flex items-center gap-1.5">
                          {step.title}
                          <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-cyan-400" />
                        </h4>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Circuit vector backdrop */}
            <svg className="absolute right-0 bottom-0 w-48 h-48 opacity-10 pointer-events-none text-cyan-400" viewBox="0 0 100 100">
              <path d="M100 80 H60 L40 60 H10" fill="none" stroke="currentColor" strokeWidth="1" className="flow-line" />
              <path d="M100 90 H70 L50 70 H20" fill="none" stroke="currentColor" strokeWidth="0.8" />
              <circle cx="60" cy="80" r="2" fill="currentColor" />
              <circle cx="40" cy="60" r="2" fill="currentColor" />
              <circle cx="70" cy="90" r="1.5" fill="currentColor" />
            </svg>
          </ScrollReveal>

        </div>
      </div>
    </section>
  );
}
