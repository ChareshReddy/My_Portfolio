import React, { useEffect, useState } from 'react';
import { ArrowRight, Terminal, Cpu, Server } from 'lucide-react';
import { personalInfo } from '../data/content';
import ScrollReveal from './ScrollReveal';

const terminalLines = [
  { text: ">>> spark = SparkSession.builder.appName('PortfolioJob').getOrCreate()", type: "input" },
  { text: "[INFO] SparkSession initialized successfully.", type: "success" },
  { text: ">>> df = spark.read.format('delta').load('/lakehouse/gold/metrics')", type: "input" },
  { text: "[INFO] Schema loaded: [id: string, name: string, throughput: double]", type: "info" },
  { text: ">>> df.filter(df.status == 'SUCCESS').groupBy('role').count().show()", type: "input" },
  { text: "+---------------+-------+\n|      role     | count |\n+---------------+-------+\n| Data Engineer | 365+  |\n| Spark Expert  | 250+  |\n+---------------+-------+", type: "output" },
  { text: "[SUCCESS] Execution completed. Pipeline healthy.", type: "success" }
];

export default function Hero() {
  const [terminalIndex, setTerminalIndex] = useState(0);
  const [currentLines, setCurrentLines] = useState([]);
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setShouldReduceMotion(mediaQuery.matches);
  }, []);

  useEffect(() => {
    if (shouldReduceMotion) {
      setCurrentLines(terminalLines);
      return;
    }

    if (terminalIndex < terminalLines.length) {
      const delay = terminalLines[terminalIndex].type === 'input' ? 1200 : 700;
      const timer = setTimeout(() => {
        setCurrentLines((prev) => [...prev, terminalLines[terminalIndex]]);
        setTerminalIndex((prev) => prev + 1);
      }, delay);
      return () => clearTimeout(timer);
    } else {
      // Loop logs after a pause
      const resetTimer = setTimeout(() => {
        setCurrentLines([]);
        setTerminalIndex(0);
      }, 5000);
      return () => clearTimeout(resetTimer);
    }
  }, [terminalIndex, shouldReduceMotion]);

  const handleScrollTo = (e, targetId) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="overview" className="relative min-h-[92vh] flex items-center justify-center px-4 md:px-8 py-16 overflow-hidden">
      {/* Visual Pipeline flow behind text */}
      <div className="absolute top-1/4 left-10 md:left-20 w-[150px] md:w-[300px] h-[2px] bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent pointer-events-none" />
      <div className="absolute bottom-1/3 right-10 md:right-20 w-[150px] md:w-[300px] h-[2px] bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent pointer-events-none" />

      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Intro text (GSAP ScrollReveal wrapped) */}
        <ScrollReveal 
          className="lg:col-span-7 flex flex-col justify-center text-left"
          stagger={0.15}
          triggerHook="95%"
        >
          {/* Status Chip */}
          <div className="inline-flex items-center gap-2 self-start px-3 py-1 rounded-full bg-cyan-950/50 border border-cyan-500/20 text-cyan-400 font-mono text-[10px] uppercase tracking-wider mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            System Online • Active 3D pipeline
          </div>

          {/* Name & Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight font-display text-slate-50 leading-tight">
            Hi, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 font-display drop-shadow-[0_2px_10px_rgba(34,211,238,0.15)]">{personalInfo.name}</span>
          </h1>

          <h2 className="text-xl sm:text-2xl font-mono text-cyan-400 font-medium mt-4 tracking-tight">
            {personalInfo.title}
          </h2>

          <p className="text-slate-400 text-sm sm:text-base font-medium mt-6 leading-relaxed max-w-xl">
            {personalInfo.subtitle}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4 mt-8">
            <a
              href="#about"
              onClick={(e) => handleScrollTo(e, 'about')}
              className="group flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 font-semibold text-sm transition-all hover:scale-[1.03] active:scale-[0.98] shadow-[0_4px_20px_rgba(6,182,212,0.3)] hover:shadow-[0_4px_25px_rgba(6,182,212,0.55)] focus-ring"
            >
              Inspect Schema
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>

            <a
              href="#contact"
              onClick={(e) => handleScrollTo(e, 'contact')}
              className="flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-700 hover:border-cyan-500 bg-slate-900/60 hover:bg-slate-900 text-slate-200 hover:text-cyan-400 font-mono text-xs transition-all duration-300 focus-ring"
            >
              <Terminal className="w-4 h-4" />
              open_connection()
            </a>
          </div>

          {/* System Specs Footer */}
          <div className="flex items-center gap-6 mt-12 pt-8 border-t border-slate-900/50 font-mono text-[10px] text-slate-500 uppercase tracking-widest">
            <div className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-cyan-500/60" />
              <span>Spark 3.5.x</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-emerald-500/60" />
              <span>Databricks Lakehouse</span>
            </div>
          </div>
        </ScrollReveal>

        {/* Live Terminal / Code Panel (GSAP ScrollReveal wrapped) */}
        <ScrollReveal 
          className="lg:col-span-5 w-full focus-ring rounded-2xl overflow-hidden"
          delay={0.3}
          triggerHook="95%"
        >
          <div className="w-full glass-panel border border-cyan-500/10 rounded-2xl shadow-2xl relative">
            {/* Terminal Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-slate-950/60 border-b border-slate-900">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <span className="font-mono text-[11px] text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                pyspark_console.py
              </span>
              <div className="w-4 h-4" />
            </div>

            {/* Terminal Screen */}
            <div className="p-5 font-mono text-xs text-slate-300 min-h-[300px] max-h-[380px] overflow-y-auto space-y-3.5 bg-slate-950/90 select-none">
              {currentLines.map((line, idx) => (
                <div
                  key={idx}
                  className={`leading-relaxed whitespace-pre-wrap ${
                    line.type === 'input' ? 'text-slate-200' :
                    line.type === 'success' ? 'text-emerald-400 font-semibold' :
                    line.type === 'info' ? 'text-cyan-400' : 'text-slate-400 font-medium bg-slate-900/50 p-2 rounded border border-slate-800'
                  }`}
                >
                  {line.text}
                </div>
              ))}
              {terminalIndex < terminalLines.length && !shouldReduceMotion && (
                <span className="inline-block w-2.5 h-4 bg-cyan-400 animate-pulse align-middle ml-1" />
              )}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
